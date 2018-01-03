#!/usr/local/bin/ruby -w
require 'cgi'
require 'erb'
include ERB::Util  # enable <%=h %> and <%=u %>

cgi = CGI.new 'html4'
puts cgi.header( 'charset'=>'UTF-8' )

text = '@a << 2'
url  = 'http://.../?prm=あいう'

tmpl = %q{
<?xml version="1.0" encoding="euc-jp"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<HTML xmlns="http://www.w3.org/1999/xhtml" lang="ja" xml:lang="ja">
<HEAD>
<META CONTENT="text/html;CHARSET=UTF-8" HTTP-EQUIV="Content-Type"/>
<TITLE>erb test</TITLE>
</HEAD>
<BODY>
<h1>ERB test</h1>

<h2>HTML escaped string</h2>
<%=h text %>
<br/>

<h2>URL encoded string</h2>
<%=u url %>
<br/>

<h2>ENV.each</h2>
<% ENV.each do |k,v| %>
    <%=h k %> : <%=h v %><br/>
<% end %>

</BODY>
</HTML>
}

ERB.new(
    tmpl,  # template string
    nil,   # security level
    '<>'   # trim mode
).run      # or, .run( binding )
