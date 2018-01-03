#!/usr/local/bin/ruby -w
require 'cgi'

cgi = CGI.new 'html4'

# cookies
cookie = CGI::Cookie::new(
    'name'    => 'hoge',
    'value'   => [ '99' ],  # must be String, not Integer
    'expires' => Time.now + 300,
    'path'    => ENV[ 'REQUEST_URI' ]
)

# output
cgi.out(
    'status'  => '200',
    'type'    => 'text/html',
    'charset' => 'UTF-8',
    'cookie'  => [ cookie ]
) do
    cgi.html do
        cgi.head do
            cgi.meta(
                'HTTP-EQUIV' => 'Content-Type',
                'CONTENT'    => 'text/html;CHARSET=UTF-8'
            ) + 
            cgi.title { "basic test" }
        end + 
        cgi.body do
            html = <<-"EOS"
            <h1>basic test</h1>
            <form action="" method="post">
            <input type="checkbox" name="chk" value="a" checked/> val a<br/>
            <input type="checkbox" name="chk" value="b" checked/> val b<br/>
            <input type="checkbox" name="chk" value="c"/> val c<br/>
            <textarea name="txta">hoge\nfuga</textarea><br/>
            <input type="submit" value="submit"/>
            </form>
            EOS

            # post parameters
            html += '<h2>POST PARAMETERS</h2>'
            html += '<pre>'
            html += cgi.params.inspect
            html += '</pre>'

            # read cookies
            html += '<h2>COOKIES</h2>'
            html += '<pre>'
            cgi.cookies.each do |k,v|
                html += "#{k}: #{ v.join('/') }\n"
            end
            html += '</pre>'

            # ENV
            html += '<h2>ENV</h2>'
            html += '<pre>'
            ENV.each do |k,v|
                html += "[#{k}] #{v}\n"
            end
            html += '</pre>'
        end
    end
end


# or you can print html manually
# puts cgi.header(
#   'status'  => '200',
#   'type'    => 'text/html',
#   'charset' => 'UTF-8',
#   'cookie'  => [ cookie ]
# )
# puts "<html>"
# puts "<head></head>"
# puts "<body></body>"
# puts "</html>"
