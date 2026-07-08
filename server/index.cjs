/**
 * 最小化 Express API 服务器 — 连接 Docker MySQL8，为数据大屏提供数据
 * 启动: npm run api
 */
const mysql = require('mysql2/promise')

// ===================== 连接池 =====================
const pool = mysql.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'tsar',
  waitForConnections: true,
})

// ===================== 通用响应 =====================
function ok(data) {
  return { code: 0, data, message: 'ok' }
}

// ===================== 简易路由 =====================
const routes = {
  // 1. 概览指标
  async '/api/dashboard/summary'() {
    const [[{ host_count }]] = await pool.query('SELECT COUNT(DISTINCT hostid) AS host_count FROM host_detail')
    const [[{ record_count }]] = await pool.query('SELECT COUNT(*) AS record_count FROM tsar_detail')
    const [[cpu]] = await pool.query(
      "SELECT ROUND(AVG(value), 1) AS v FROM tsar_detail WHERE type='pref' AND `mod`='cpu_usage'"
    )
    const [[disk]] = await pool.query(
      "SELECT ROUND(AVG(value), 1) AS v FROM tsar_detail WHERE type='disk' AND `mod`='sda_util'"
    )
    return ok({
      todayVisits: Number(host_count),
      realtimeOrders: Number(record_count),
      activeUsers: Number(cpu?.v ?? 0),
      systemHealth: Number(disk?.v ?? 0),
    })
  },

  // 2. 趋势（最近12个时间点的CPU + 内存）
  async '/api/dashboard/trend'() {
    const [rows] = await pool.query(
      'SELECT DATE_FORMAT(FROM_UNIXTIME(ts / 1000), "%H:%i") AS time, ' +
      'ROUND(AVG(CASE WHEN `mod`="cpu_usage" THEN value END), 1) AS cpu, ' +
      'ROUND(AVG(CASE WHEN `mod`="mem_used" THEN value END), 0) AS mem ' +
      'FROM tsar_detail WHERE type="pref" AND `mod` IN ("cpu_usage","mem_used") ' +
      'GROUP BY time ORDER BY MIN(ts) DESC LIMIT 12'
    )
    rows.reverse()
    return ok([
      { name: 'CPU使用率(%)', data: rows.map((r) => ({ time: r.time, value: Number(r.cpu) })) },
      { name: '内存使用(GB)', data: rows.map((r) => ({ time: r.time, value: Math.round(Number(r.mem) / 1024) })) },
    ])
  },

  // 3. 机房分布
  async '/api/dashboard/categories'() {
    const [rows] = await pool.query(
      'SELECT location1 AS name, COUNT(*) AS value FROM host_detail GROUP BY location1 ORDER BY value DESC'
    )
    return ok(rows)
  },

  // 4. 主机负载排名 Top 8
  async '/api/dashboard/ranking'() {
    const [rows] = await pool.query(
      'SELECT h.hostname AS name, ' +
      'ROUND(AVG(CASE WHEN t.`mod`="load1" THEN t.value END), 2) AS value ' +
      'FROM tsar_detail t JOIN host_detail h ON t.hostid = h.hostid ' +
      'WHERE t.`mod`="load1" GROUP BY h.hostid, h.hostname ' +
      'ORDER BY value DESC LIMIT 8'
    )
    // 简化 hostname: server-001.hismartlab.cn → server-001
    return ok(rows.map((r, i) => ({
      name: r.name.split('.')[0],
      value: Math.round(Number(r.value) * 100) / 100,
      rank: i + 1,
    })))
  },

  // 5. 系统健康雷达
  async '/api/dashboard/radar'() {
    const [rows] = await pool.query(
      'SELECT `mod`, ROUND(AVG(value), 1) AS v FROM tsar_detail WHERE ' +
      '(`mod`="cpu_usage" AND type="pref") OR (`mod`="mem_used" AND type="pref") OR ' +
      '(`mod`="sda_util" AND type="disk") OR (`mod`="net_in" AND type="pref") OR ' +
      '(`mod`="load1" AND type="pref") OR (`mod`="proc_total" AND type="pref") ' +
      'GROUP BY `mod`'
    )
    const map = Object.fromEntries(rows.map((r) => [r.mod, Number(r.v)]))
    const norm = (raw, max) => Math.min(100, Math.round(((raw ?? 50) / max) * 100))
    return ok({
      indicators: [
        { name: 'CPU', max: 100 },
        { name: '内存', max: 100 },
        { name: '磁盘IO', max: 100 },
        { name: '网络', max: 100 },
        { name: '负载', max: 100 },
        { name: '进程', max: 100 },
      ],
      series: [
        { name: '当前系统', values: [
          norm(map.cpu_usage, 80),
          norm(map.mem_used, 65536),
          norm(map.sda_util, 80),
          norm(map.net_in, 200),
          norm(map.load1, 5),
          norm(map.proc_total, 500),
        ]},
        { name: '基线', values: [65, 60, 55, 50, 45, 50] },
      ],
    })
  },

  // 6. 监控告警（查异常值 + 静态消息混合）
  async '/api/dashboard/activities'() {
    const [warnRows] = await pool.query(
      'SELECT h.hostname, t.`mod`, t.value, t.ts, m.desc ' +
      'FROM tsar_detail t JOIN host_detail h ON t.hostid=h.hostid ' +
      'JOIN mod_detail m ON t.`mod`=m.`mod` AND t.type=m.type ' +
      'WHERE (t.`mod`="cpu_usage" AND t.value > 90) ' +
      'OR (t.`mod`="sda_util" AND t.value > 90) ' +
      'OR (t.`mod`="load1" AND t.value > 3) ' +
      'ORDER BY t.ts DESC LIMIT 8'
    )
    const activities = warnRows.map((r, i) => ({
      id: Date.now() - i,
      type: r.value > 95 ? 'error' : 'warning',
      content: `${r.hostname.split('.')[0]} ${r.desc} ${r.value}，超过阈值`,
      time: new Date(Number(r.ts)).toISOString(),
    }))
    if (activities.length < 8) {
      const fallbacks = [
        { type: 'info', content: '数据采集调度器正常运行中' },
        { type: 'success', content: '定时备份任务完成，耗时 2.3 秒' },
        { type: 'info', content: '监控系统版本已更新至 v2.4.1' },
        { type: 'info', content: 'A机房 温湿度传感器数据正常' },
        { type: 'success', content: '主机巡检任务全部通过' },
        { type: 'info', content: '日志归档完成，释放磁盘空间 12GB' },
        { type: 'warning', content: '机柜03 电源负载接近额定值 80%' },
        { type: 'info', content: '新主机 host020 已加入监控集群' },
      ]
      for (let i = activities.length; i < 8; i++) {
        activities.push({ id: Date.now() - i, ...fallbacks[i] })
      }
    }
    return ok(activities.slice(0, 8))
  },

  // 7. 主机状态矩阵（机房 × 机柜）
  async '/api/dashboard/map-points'() {
    const [rows] = await pool.query(
      'SELECT h.hostid, h.location1, h.location2, ' +
      'ROUND(AVG(CASE WHEN t.`mod`="cpu_usage" THEN t.value END), 1) AS cpu ' +
      'FROM host_detail h LEFT JOIN tsar_detail t ON h.hostid=t.hostid AND t.`mod`="cpu_usage" ' +
      'GROUP BY h.hostid, h.location1, h.location2 ORDER BY h.location1, h.location2'
    )
    const roomMap = { 'A机房': 1, 'B机房': 2, 'C机房': 3, 'D机房': 4, 'E机房': 5 }
    return ok(rows.map((r) => {
      const rackNum = parseInt(r.location2.replace('机柜', '')) || 1
      return {
        name: r.hostid,
        value: [roomMap[r.location1] || 1, rackNum],
        level: Number(r.cpu) > 85 ? 1 : Number(r.cpu) > 60 ? 3 : 5,
      }
    }))
  },

  // 8. 主机实时状态（取最新一组CPU数据）
  async '/api/dashboard/hub-nodes'() {
    const [rows] = await pool.query(
      'SELECT t.hostid, h.hostname, ' +
      'ROUND(AVG(CASE WHEN t.`mod`="cpu_usage" THEN t.value END), 1) AS cpu ' +
      'FROM tsar_detail t JOIN host_detail h ON t.hostid=h.hostid ' +
      'WHERE t.type="pref" GROUP BY t.hostid, h.hostname ORDER BY t.hostid LIMIT 8'
    )
    return ok(rows.map((r) => ({
      name: r.hostid,
      value: Math.round(Number(r.cpu) > 100 ? 100 : Number(r.cpu)),
      status: Number(r.cpu) > 85 ? 'danger' : Number(r.cpu) > 60 ? 'warning' : 'good',
      description: `${r.hostname.split('.')[0]} CPU ${Number(r.cpu)}%`,
    })))
  },
}

// ===================== HTTP Server =====================
const http = require('http')
const PORT = 8080

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)
  const handler = routes[url.pathname]

  if (!handler) {
    res.writeHead(404)
    return res.end(JSON.stringify({ code: 404, message: 'Not found: ' + url.pathname }))
  }

  try {
    const data = await handler()
    res.writeHead(200)
    res.end(JSON.stringify(data))
  } catch (err) {
    console.error('[API Error]', url.pathname, err.message)
    res.writeHead(500)
    res.end(JSON.stringify({ code: 500, message: err.message }))
  }
})

server.listen(PORT, () => {
  console.log(`TSAR API server running at http://localhost:${PORT}`)
  console.log('Endpoints:')
  Object.keys(routes).sort().forEach((r) => console.log('  GET ' + r))
})
