package App::Tab;
use base qw/App::Base/;
use strict;
use LWP::UserAgent;
use URI;

sub index {
    my $self = shift;
    my $fb = $self->{fb};
    return 1;
}

sub share_via_app {
    my $self = shift;
    my $fb = $self->{fb};
    my $sr = $fb->signed_request;
    if( !$fb->is_auth_user ){
        ## ユーザー x アプリの認証ダイアログ
        my $scope = 'read_stream,publish_stream,user_birthday,user_location';
        $scope .= ',manage_pages' if $sr->{page}{admin};  # ページ管理者
        my $uri = URI->new( 'https://www.facebook.com/dialog/oauth' );
        $uri->query_form(
            client_id    => $fb->app_id,
            redirect_uri => $fb->tab_app_url,
            scope        => $scope,
        );
        print $self->{cgi}->redirect( $uri );
        return;
    }

    ## ユーザーのウォールに投稿
    my $prm = {
        message => 'TestApp 02 からの投稿だよ',
        # link  => $fb->canvas_url,
        # link  => $fb->tab_app_url,
        link    => 'http://yahoo.co.jp/',
        access_token => $sr->{oauth_token},
    };
    if( $self->{cgi}->param( 'extra' ) ){
        $prm = {
            %$prm,
            picture => 'http://iandeth.dyndns.org/trials/facebook-app/basics/img/cola.jpg',
            name => 'コンテンツタイトル',
            caption => 'キャプションです',
            description => '詳細説明文です ',
        };
    }
    my $res = $fb->request_api(
        path   => "$sr->{user_id}/feed",
        method => 'POST',
        params => $prm,
    );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    return 1;
}

sub share_via_app_to_friend_wall {
    my $self = shift;
    my $fb = $self->{fb};
    my $sr = $fb->signed_request;
    ## 対象ユーザーの名前を取得 (画面表示)
    $self->{friend_id}   = $self->{cgi}->param( 'friend_id' ) || die 'no friend_id';
    $self->{friend_info} = $fb->user_info( $self->{friend_id} );
    ## ウォール投稿
    my $res = $fb->request_api(
        path   => "$self->{friend_id}/feed",
        method => 'POST',
        params => {
            message => 'TestApp 02 からの投稿だよ',
            link    => 'http://yahoo.co.jp/',
            access_token => $sr->{oauth_token},
        },
    );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    return 1;
}

sub post_to_page_wall_as_viewer {
    my $self = shift;
    my $fb = $self->{fb};
    my $sr = $fb->signed_request;
    ## ページのウォールへ投稿
    my $res = $fb->request_api(
        path   => "$sr->{page}{id}/feed",
        method => 'POST',
        params => {
            message => 'TestApp 02 からの投稿だよ',
            access_token => $sr->{oauth_token},
        },
    );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    return 1;
}

sub post_to_page_wall_as_page_account {
    my $self = shift;
    my $fb = $self->{fb};
    my $sr = $fb->signed_request;
    ## page access_token を取得
    my $ptoken = eval { $fb->page_access_token };
    die $@ if $@;
    ## ページのウォールへ投稿
    my $res = $fb->request_api(
        path   => "$sr->{page}{id}/feed",
        method => 'POST',
        params => {
            message => 'TestApp 02 からの投稿だよ by ページアカウント',
            access_token => $ptoken,
        },
    );
    die "$res->{error}{type} - $res->{error}{message}" if $res->{error};
    return 1;
}

1;
