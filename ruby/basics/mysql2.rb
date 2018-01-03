#!/usr/local/bin/ruby -w
require 'mysql2'

begin
    client = Mysql2::Client.new :host=>"127.0.0.1", :username=>"root", :database=>'test'
    # s = client.escape "foo"
    # results = client.query "SELECT * FROM foo WHERE text = #{s}"
    results = client.query "SHOW TABLES"
    results.each do |r|
        p r
    end
rescue Mysql2::Error => e
    puts "Error number:   #{e.error_number}"
    puts "Error message:  #{e.message}"
    puts "Error SQLSTATE: #{e.sql_state}"
end

# for more on how to use, check this page:
# https://github.com/brianmario/mysql2
