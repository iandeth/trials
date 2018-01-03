/* CREATE DATABASE `myapp` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin; */

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tmp_users;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS posts_tags;
DROP TABLE IF EXISTS post2s;
DROP TABLE IF EXISTS tag2s;
DROP TABLE IF EXISTS post2s_tag2s;

CREATE TABLE users (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  email varchar(50) NOT NULL,
  username varchar(50) NOT NULL,
  password varchar(50) NOT NULL,
  role varchar(20) NOT NULL DEFAULT 'user' COMMENT '権限: user|admin',
  post_count bigint unsigned DEFAULT 0,
  active tinyint unsigned DEFAULT 1 COMMENT '有効フラグ 1=有効, 0=無効',
  created datetime DEFAULT NULL,
  modified datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX (`email`, `active`)
) ENGINE=InnoDB;

CREATE TABLE tmp_users (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  hash varchar(50) NOT NULL,
  wtype tinyint unsigned DEFAULT 1 COMMENT '1=新規ユーザー登録, 2=メアド変更',
  created datetime DEFAULT NULL,
  data text,
  PRIMARY KEY (`id`),
  INDEX (`hash`, `wtype`)
) ENGINE=InnoDB COMMENT 'ユーザー登録: メール確認前状態';

CREATE TABLE posts (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  title varchar(50) DEFAULT NULL,
  body text,
  user_id bigint unsigned NOT NULL,
  category_id bigint unsigned NOT NULL DEFAULT 1,
  tag_count bigint unsigned DEFAULT 0,
  created datetime DEFAULT NULL,
  modified datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE categories (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT NULL,
  post_count bigint unsigned DEFAULT 0,
  sort_order bigint unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE tags (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT NULL,
  post_count bigint unsigned DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE posts_tags (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  post_id bigint unsigned NOT NULL,
  tag_id bigint unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

/* HABTM join model お試し用 */
CREATE TABLE post2s (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  title varchar(50) DEFAULT NULL,
  body text,
  tag2_count bigint unsigned DEFAULT 0,
  post2s_tag2_count bigint unsigned DEFAULT 0,
  created datetime DEFAULT NULL,
  modified datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE tag2s (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT NULL,
  post2_count bigint unsigned DEFAULT 0,
  post2s_tag2_count bigint unsigned DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

CREATE TABLE post2s_tag2s (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  post2_id bigint unsigned NOT NULL,
  tag2_id bigint unsigned NOT NULL,
  comment text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

