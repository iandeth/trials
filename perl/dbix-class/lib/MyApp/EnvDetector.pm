package MyApp::EnvDetector;
use base qw/Chips::EnvDetector/;
use strict;
use warnings;
use Carp;
use version; our $VERSION = qv("0.1.0");

sub _detect {
    my $self = shift;
    my $p = shift || {};
    return $p->{current} || $ENV{APP_ENV} || 'development';
}

sub _config_definitions {
    my $self = shift;
    my $current = shift;
    my $defs = {
        'development' => {
            public_path  => '.',
            database => {
                database => "test",
                host     => "127.0.0.1",
                port     => "3306",
                user     => "foo",
                password => "",
                allow_access_from => [ '%' ],
            },
        },
        'production' => {
            public_path  => '.',  # right next to the cgi path
        },
        'test' => {
            public_path  => '.',
        },
    };
    return $defs->{$current};
}
1;
