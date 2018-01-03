#!/usr/bin/local/ruby -w
require 'mysql'
# require 'rubygems'
# gem 'mysql'
# require 'mysql'

begin
    dbh = Mysql.real_connect "localhost", "root", "", "test"
    puts "Server version: #{dbh.get_server_info}"
    sth = dbh.prepare "SHOW TABLES"
    sth.execute
    sth.each do |r|
        p r
    end
rescue Mysql::Error => e
    puts "Error code: #{e.errno}"
    puts "Error message: #{e.error}"
    puts "Error SQLSTATE: #{e.sqlstate}" if e.respond_to? "sqlstate"
ensure
    dbh.close if dbh
end

# for more on how to use, check this page:
# http://www.kitebird.com/articles/ruby-mysql.html
