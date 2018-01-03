## via http://pivotallabs.com/users/shagemann/blog/articles/1967-test-your-rake-tasks-
class MyOut
  def self.puts(s)
    puts s
  end
end

namespace :cron do
  desc "tasks to run via cron"

  task :sample => :environment do
    MyOut.puts "sample task!!"
    MyOut.puts "arg foo = #{ENV['foo']}" if ENV['foo']
    Rails::logger.debug "debug line inside rake tasks"
  end

end

