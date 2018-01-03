#!/usr/bin/local/ruby -w
require 'rubygems'
gem 'mysql'
require 'mysql'

begin
    dbh = Mysql.real_connect "localhost", "apviaapps_user", "", "apviaapps_development"

    sth = dbh.prepare "SELECT id from action_logs where app_id = ? and event_id = ?"
    sth.execute 'bunshin', 'q_answered'

    sth2 = dbh.prepare "SELECT * from action_logs where id = ?"
    sth.each do |r|
        sth2.execute r[0]
        sth2.each do |r2|
            p r2[0]
        end
        sth2.free_result
    end
rescue Mysql::Error => e
    puts "Error code: #{e.errno}"
    puts "Error message: #{e.error}"
    puts "Error SQLSTATE: #{e.sqlstate}" if e.respond_to? "sqlstate"
ensure
    dbh.close if dbh
end
