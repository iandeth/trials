package Tools::Base;
use base qw/Class::Accessor::Fast/;
use strict;
use Template;
use CGI;

sub new {
    my $class = shift;
    my $p = {
        @_,
    };
    return bless $p, $class;
}

sub dump_env_as_html {
    my $self = shift;
    my $arg = {
        cgi => undef,  # isa CGI
        ses => undef,  # isa CGI::Session
        %{ shift || {} },
    };
    $arg->{cgi} = CGI->new if !$arg->{cgi};
    my $stash = {
        env => { map { $_ => $::ENV{$_} } sort keys %::ENV },
        cgi => $arg->{cgi},
        ses => $arg->{ses},
    };
    my $tmpl = <<'EOS';
    <h3>PARAMS</h3>
    <table>
        [% FOREACH r IN cgi.param.sort %]
        <tr>
        <td class="label">[% r | html %]</td>
        <td>[% cgi.param( r ) | html %]</td>
        </tr>
        [% END %]
    </table>
    <br/>
    [% IF ses %]
    <h3>SESSION</h3>
    <table>
        [% FOREACH r IN ses.dataref %]
        <tr>
        <td class="label">[% r.key | html %]</td>
        <td>[% r.value | html %]</td>
        </tr>
        [% END %]
    </table>
    <br/>
    [% END %]
    <h3>ENV</h3>
    <table>
        [% FOREACH r IN env %]
        <tr>
        <td class="label">[% r.key | html %]</td>
        <td>[% r.value | html %]</td>
        </tr>
        [% END %]
    </table>
EOS
    my $tt= Template->new({});
    my $ret = '';
    $tt->process(\$tmpl, $stash, \$ret) || die $tt->error();
    return $ret;
}

1;
