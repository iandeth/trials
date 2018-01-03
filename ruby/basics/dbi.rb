#!/usr/local/bin/ruby -w
require 'dbi'

# basic
begin
    dbh = DBI.connect "DBI:Mysql:test:localhost", "root", ""
    row = dbh.select_one "SELECT VERSION()"
    puts "Server version: #{row[0]}"
rescue DBI::DatabaseError => e
    puts "Error code: #{e.err}"
    puts "Error message: #{e.errstr}"
ensure
    dbh.disconnect if dbh
end


# create table
TBL = 'ruby_dbi_test'
dbh = DBI.connect "DBI:Mysql:test:localhost", "root", ""
dbh.do "DROP TABLE IF EXISTS #{TBL}"
dbh.do <<"EOS"
    CREATE TABLE #{TBL} (
        id  int not null auto_increment,
        txt text,
        primary key( id )
    )
EOS


# insert records
# and retrieve auto_increment id's
dbh.prepare( "INSERT INTO #{TBL} VALUES( ?, ? )" ) do |sth|
    ('a' .. 'd').each do |itm|
        sth.execute nil, itm
        id = dbh.func :insert_id
        puts "insert: #{id} ok"
    end
end


# select rows
dbh.execute( "SELECT * FROM #{TBL}" ) do |sth|
    sth.fetch_hash do |row|
        puts "select: #{row['id']} is #{row['txt']}"
    end
end


# transactions
dbh['AutoCommit'] = false
begin
    dbh.do "INSERT INTO #{TBL} VALUES( ?, ? )", nil, "e" 
    dbh.commit
rescue DBI::DatabaseError => e
    puts e.errstr
    dbh.rollback
end
# or more simple way (auto commit/rollback)
dbh.transaction do |dbh|
    dbh.do "INSERT INTO #{TBL} VALUES( ?, ? )", nil, "f"
end
dbh['AutoCommit'] = true
