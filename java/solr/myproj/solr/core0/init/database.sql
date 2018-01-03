/* CREATE DATABASE `solr_myproj` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin; */
DROP TABLE IF EXISTS shops;
DROP TABLE IF EXISTS areas;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS shop_tags;

CREATE TABLE shops (
    id bigint unsigned auto_increment primary key,
    name varchar(50),
    address varchar(50),
    area_id bigint unsigned,
    modified timestamp
) ENGINE=InnoDB;

CREATE TABLE areas (
    id bigint unsigned primary key,
    name varchar(50)
);

CREATE TABLE tags (
    id bigint unsigned primary key,
    name varchar(50)
);

CREATE TABLE shop_tags (
    id bigint unsigned auto_increment primary key,
    shop_id bigint unsigned not null,
    tag_id bigint unsigned not null
);


INSERT INTO areas VALUES
    (1, '東京 西側'),
    (2, '東京 東側'),
    (3, '東京 北側'),
    (4, '東京 南側')
;

INSERT INTO tags VALUES
    (1, '焼肉'),
    (2, 'ラーメン'),
    (3, 'イタリアン'),
    (4, '高級'),
    (5, 'ランチ有り')
;

INSERT INTO shops VALUES
    (1, '牛角 祖師谷店', '東京都墨田区１', 3, null),
    (2, '目黒 二郎', '東京都目黒区２', 1, null),
    (3, 'ピアットナポリ 柏店', '千葉県柏市３', 2, null),
    (4, '牛角 津田沼店', '千葉県津田沼市４', 2, null)
;

INSERT INTO shop_tags VALUES
    (null, 1, 1), /* 牛角: 焼肉, ランチ有り */
    (null, 1, 5),
    (null, 2, 2), /* 二郎: ラーメン */
    (null, 3, 3), /* ピアット: イタリアン, 高級 */
    (null, 3, 4),
    (null, 4, 1)  /* 牛角 津田沼: 焼肉 */
;
