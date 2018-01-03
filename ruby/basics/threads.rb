require 'net/http'

pages = %w( www.rubycentral.org slashdot.org www.google.com )
threads = []
for page_to_fetch in pages
    threads << Thread.new(page_to_fetch) do |url|
        http = Net::HTTP.new(url, 80) 
        print "Fetching: #{url}\n"   # rather than puts
        resp = http.get('/')
        print "Got #{url}: #{resp.message}\n"
    end
end
threads.each {|thr| thr.join }  # wait for all sub-thread end


## trap exceptions in thread
Thread.abort_on_exception = false  # true will die main process too
4.times do |number|
    threads << Thread.new(number) do |i|
        raise "Boom!" if i == 1
        print "#{i}\n"
    end
end
print "Waiting\n"
threads.each do |t|
    begin
        t.join
    rescue RuntimeError => e
        puts "Failed: #{e.message}"
    end
end
puts "Done"


## mutex lock for updating shared variables
def inc(n)
    n+1
end
sum = 0
mutex = Mutex.new
threads = (1..10).map do
    Thread.new do
        100_000.times do
            mutex.synchronize do
                sum = inc(sum)
            end
            ## same as:
            # mutex.lock
            # sum = inc(sum)
            # mutex.unlock
        end
    end
end
threads.each(&:join)
p sum
