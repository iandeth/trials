#!/usr/local/bin/ruby -w
require 'cgi'
require 'cgi/session'

cgi = CGI.new 'html4'

# (re)create session (using cookie session_id)
ssn = CGI::Session.new( cgi )
# how to delete session
if cgi[ 'delete' ] != ''
    ssn.delete
    ssn = CGI::Session.new( cgi )
end
# store data
if cgi[ 'text' ] != ''
    ssn[ 'text' ] = cgi[ 'text' ]
end

cgi.out(
    'charset' => 'UTF-8'
) do
    cgi.html do
        cgi.head do
            cgi.meta(
                'HTTP-EQUIV' => 'Content-Type',
                'CONTENT'    => 'text/html;CHARSET=UTF-8'
            ) + 
            cgi.title { 'sessions' }
        end + 
        cgi.body do
            html = cgi.h1 { 'sessions' }
            html += cgi.form do
                cgi.text_field( 'text' ) +
                cgi.br +
                cgi.submit( 'save to session' )
            end

            if ssn[ 'text' ] != ''
                html += cgi.h2 { 'session data' }
                html += cgi.pre do
                    # read data from session
                    "session id: #{ ssn.session_id }\n" + 
                    "saved text: #{ ssn[ 'text' ] }"
                end

                # some checking UI's
                html += cgi.a( 'href'=>"", 'target'=>"_blank" ) do
                    "now, open new window to see data stored"
                end
                html += cgi.form do
                    cgi.submit( 'value'=>'delete session',
                        'name'=>'delete' )
                end
            end
            html
        end
    end
end
