/* CREATE DATABASE `bdcard2` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin; */
/* CREATE DATABASE `bdcard2_test` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin; */

CREATE TABLE session (
  id char(32),
  modified int,
  lifetime int,
  data text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='PHP Session テーブル';
