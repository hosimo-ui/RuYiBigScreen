-- ============================================
-- TSAR 监控数据库建表 & 数据导入脚本
-- 适用于 MySQL 8.0 Docker 容器
-- ============================================

DROP DATABASE IF EXISTS tsar;
CREATE DATABASE tsar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tsar;

-- --------------------------------------------
-- 1. 主机信息表
-- --------------------------------------------
CREATE TABLE host_detail (
    `hostid`   VARCHAR(20)  PRIMARY KEY COMMENT '主机ID（主键）',
    `hostname` VARCHAR(100) COMMENT '主机FQDN名',
    `owner`    VARCHAR(20)  COMMENT '负责人',
    `model`    VARCHAR(50)  COMMENT '硬件型号',
    `location1` VARCHAR(20) COMMENT '机房位置',
    `location2` VARCHAR(20) COMMENT '机柜编号'
) COMMENT '主机信息明细表（20台服务器）';

-- --------------------------------------------
-- 2. 指标字典表
-- --------------------------------------------
CREATE TABLE mod_detail (
    `mod`  VARCHAR(30) PRIMARY KEY COMMENT '指标代码（主键）',
    `type` VARCHAR(10) COMMENT '资源类型：disk/pref',
    `desc` VARCHAR(100) COMMENT '指标中文说明',
    `unit` VARCHAR(20)  COMMENT '单位',
    `tag`  VARCHAR(50)  COMMENT '指标分类标签'
) COMMENT '指标MOD字典表（35个磁盘指标 + 20个性能指标）';

-- --------------------------------------------
-- 3. 采集明细表（合并 disk_tsar + pref_tsar）
-- --------------------------------------------
CREATE TABLE tsar_detail (
    `ts`     BIGINT        COMMENT '采集时间戳（毫秒，epoch）',
    `hostid` VARCHAR(20)   COMMENT '主机ID → host_detail.hostid',
    `type`   VARCHAR(10)   COMMENT '资源类型：disk/pref',
    `mod`    VARCHAR(30)   COMMENT '指标代码 → mod_detail.mod',
    `value`  DECIMAL(12,2) COMMENT '采集值',
    `tag`    VARCHAR(50)   COMMENT '指标分类标签 → mod_detail.tag',
    INDEX idx_hostid (`hostid`),
    INDEX idx_mod (`mod`),
    INDEX idx_ts (`ts`),
    INDEX idx_type_mod (`type`, `mod`)
) COMMENT '采集明细表（disk_tsar + pref_tsar 合并）';

-- --------------------------------------------
-- 批量导入数据（LOAD DATA 比 INSERT 快 10x+）
-- --------------------------------------------
LOAD DATA INFILE '/var/lib/mysql-files/host_detail.dat'
INTO TABLE host_detail
FIELDS TERMINATED BY '\t'
IGNORE 1 LINES;

LOAD DATA INFILE '/var/lib/mysql-files/mod_detail.dat'
INTO TABLE mod_detail
FIELDS TERMINATED BY '\t'
IGNORE 1 LINES;

LOAD DATA INFILE '/var/lib/mysql-files/disk_tsar.dat'
INTO TABLE tsar_detail
FIELDS TERMINATED BY '\t'
IGNORE 1 LINES;

LOAD DATA INFILE '/var/lib/mysql-files/pref_tsar.dat'
INTO TABLE tsar_detail
FIELDS TERMINATED BY '\t'
IGNORE 1 LINES;
