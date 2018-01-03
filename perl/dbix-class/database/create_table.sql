DROP TABLE IF EXISTS artist;
DROP TABLE IF EXISTS cd;
DROP TABLE IF EXISTS component_test;

CREATE TABLE artist (
    artist_id serial,
    name varchar(50),
    PRIMARY KEY (artist_id)
) ENGINE=InnoDB;

CREATE TABLE cd (
    cd_id      serial,
    artist_id  bigint unsigned not null,
    title      varchar(100),
    year       smallint unsigned,
    PRIMARY KEY (cd_id)
) ENGINE=InnoDB;

CREATE TABLE component_test (
    id serial,
    name varchar(50),
    PRIMARY KEY (id)
) ENGINE=InnoDB;
