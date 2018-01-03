package Tools::Facebook;
use base qw/Tools::Base/;
use strict;
use Carp;
use JSON;
use MIME::Base64;
use Digest::SHA;
use URI;
use LWP::UserAgent;

__PACKAGE__->mk_accessors(qw/
    app_id
    app_secret
    access_token
    signed_request
    canvas_url
/);

our $API_DOMAIN = 'graph.facebook.com';

sub new {
    my $class = shift;
    my $self  = $class->SUPER::new(@_);
    my %options = @_;
    my $p = {
        app_id         => '',
        app_secret     => '',
        access_token   => '',
        signed_request => {},     # resolved perl hash
        canvas_url     => '',     # 例 "//apps.facebook.com/feosodi_test_one/"
        _api_res_cache => {},
    };
    foreach my $k ( keys %$p ){
        $self->{$k} = ( defined $options{$k} )? $options{$k} : $p->{$k};
    }
    ## signed_request あるなら decode しておく
    my $osr = $options{signed_request};
    if( $osr ){
        if( !ref $osr ){  # string ならば
            $self->{signed_request} = $self->_decode_signed_request( $osr );
        }
    }else{
        $self->{signed_request} = {};
    }
    return $self;
}

sub request_api {
    my $self = shift;
    my $p = {
        path   => '',    # eg: 'me/feed'
        method => 'GET', # GET|POST|DELETE
        params => {},    # HTTP params
        @_,
    };
    if( !$p->{path} ){
        return { error=>{ type=>'', message=>'path undef' } };
    }
    $p->{method} = uc $p->{method};  # 大文字に

    my $proto = ($p->{params}{access_token})? 'https' : 'http';
    (my $path = $p->{path}) =~ s{^/}{};
    my $uri = URI->new( "$proto://$API_DOMAIN/$path" );
    if( $p->{method} eq 'GET' ){
        $uri->query_form( %{$p->{params}} );
        ## check for cache
        my $ret = $self->{_api_res_cache}{ $uri->as_string };
        return $ret if $ret;
    }
    my $ua = LWP::UserAgent->new;
    my $res;
    if( $p->{method} eq 'POST' ){
        $res = $ua->post( $uri, $p->{params} );
    }else{
        $res = $ua->get( $uri );
    }
    my $body = $res->content;
    my $ret;
    if( $res->is_success ){
        $ret = from_json( $body );
    }else{
        $ret = ($body)? from_json( $body ) : {
            error => {
                type => $res->status_line,
                message => $res->message,
            },
        };
    }
    ## cache GET response
    if( $p->{method} eq 'GET' ){
        $self->{_api_res_cache}{ $uri->as_string } = $ret;
    }
    return $ret;
}

sub page_info {
    my $self = shift;
    my $page_id = $self->signed_request->{page}{id};
    die "signed_request doesn't contain page.id" if !$page_id;
    my $res = $self->request_api( path=>$page_id );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    return $res;
}

sub tab_app_url {
    my $self = shift;
    my $sk   = shift || '';
    my $info = $self->page_info;
    die "no link url in page info" if !$info->{link};
    $sk = "app_" . $self->app_id if !$sk;
    return "$info->{link}?sk=$sk";
}

sub is_auth_user {
    my $self = shift;
    return ($self->signed_request->{user_id})? 1 : 0;
}

sub user_info {
    my $self = shift;
    ## 引数で user id 渡す、無い場合はログインユーザーを対象に
    my $uid = shift || $self->signed_request->{user_id};
    die "not an auth user" if !$uid;
    my $res = $self->request_api( path=>$uid );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    return $res;
}

sub user_friends {
    my $self = shift;
    my $sr = $self->signed_request;
    my $uid = $sr->{user_id};
    die "not an auth user" if !$uid;
    my $res = $self->request_api(
        path   => "$uid/friends",
        params => { access_token=>$sr->{oauth_token} },
    );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    return $res->{data};
}

sub permissions {
    my $self = shift;
    my $sr = $self->signed_request;
    my $res = $self->request_api(
        path   => 'me/permissions',
        params => { access_token=>$sr->{oauth_token} },
    );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    return $res->{data}[0] || {};
}

sub page_access_token {
    my $self = shift;
    my $page_id = shift;
    my $sr = $self->signed_request;
    $page_id = $sr->{page}{id} if !$page_id;
    die "signed_request doesn't contain page.id" if !$page_id;
    die "user is not an admin of this page: $page_id" if !$sr->{page}{admin};
    ## 現 user から manage_pages 権限貰ってないと駄目
    my $p = $self->permissions;
    die "app has no manage_pages permission" if !$p->{manage_pages};
    ## page account 用 access_token 取得
    my $res = $self->request_api(
        path   => $page_id,
        params => {
            fields => 'access_token',
            access_token => $sr->{oauth_token},
        },
    );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    die "something is wrong, no access_token response" if !$res->{access_token};
    return $res->{access_token};
}


##
## utils
##
sub _decode_signed_request {
    my $self = shift;
    my $sreq = shift || croak 'no args: signed_request';
    # decode
    my ($encoded_sig, $payload) = split /\./, $sreq;
    my $sig = $self->_base64_url_decode($encoded_sig);
    my $ret = from_json( $self->_base64_url_decode($payload) );
    # validation
    croak 'no app_secret specified' if !$self->{app_secret};
    if ( !defined $ret->{algorithm} || $ret->{algorithm} ne 'HMAC-SHA256' ) {
        croak 'signed_request の署名アルゴリズムが不正です: ' . (defined $ret->{algorithm} ? $ret->{algorithm} : "(null)");
    }
    my $expected_sig = Digest::SHA::hmac_sha256($payload, $self->{app_secret});
    croak 'signed_request の署名が不正です' if $sig ne $expected_sig;
    return $ret;
}

sub _base64_url_decode {
    my $self = shift;
    my $tmp = shift;
    $tmp =~ tr#-_#+/#;
    return MIME::Base64::decode($tmp);
}

sub dump_env_as_html {
    my $self = shift;
    my $arg = {
        cgi => '',
        @_,
    };
    my $ret  = $self->SUPER::dump_env_as_html(@_);
    my $sr   = $self->signed_request || return $ret;
    my $text = to_json( $sr, { pretty=>1 } );
    my $html = <<"EOS";
    <h3>SIGNED REQUEST</h3>
    <pre style="font-size:1.2em">$text</pre>
    <br/>
EOS
    return $html . $ret;
}

1;
