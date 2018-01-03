#!/usr/local/bin/ruby -w
require 'cgi'

cgi = CGI.new 'html4'
cgi.out(
    'charset' => 'UTF-8'
) do
    cgi.html do
        cgi.head do
            cgi.meta(
                'HTTP-EQUIV' => 'Content-Type',
                'CONTENT'    => 'text/html;CHARSET=UTF-8'
            ) + 
            cgi.title { 'file upload' }
        end + 
        cgi.body do
            html = cgi.h1 { 'file upload' }
            html += cgi.multipart_form do
                cgi.file_field( 'upfile' ) +
                cgi.br +
                cgi.submit( 'upload!' )
            end

            file = cgi['upfile']
            if cgi.has_key?( 'upfile' ) && file.respond_to?( :read ) then
                # depending on file size, file.class can be either of
                # StringIO, or File (via Tempfile)
                html += cgi.pre do
                    "class:             #{ CGI.escapeHTML file.to_s }\n" +
                    "localpath:         #{ file.local_path }\n" +
                    "original_filename: #{ file.original_filename }\n" +
                    "content_type:      #{ file.content_type }"
                end
                # to retrieve content data, call #read
                #file.read
            end
            html
        end
    end
end
