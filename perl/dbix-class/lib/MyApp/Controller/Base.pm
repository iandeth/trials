package MyApp::Controller::Base;
use base qw/Chips::App::C/;
use strict;
use warnings;
use version; our $VERSION = qv("1.0.0");
use MyApp::EnvDetector;
use Chips::DBI::MySQL;

# データベース接続設定
sub _init_database_driver {
    my $self    = shift;
    my $options = shift;
    my $cnf = $self->env->get_config->{database} || {};
    return Chips::DBI::MySQL->new(
        database   => $cnf->{database},
        host       => $cnf->{host},
        port       => $cnf->{port},
        user       => $cnf->{user},
        password   => $cnf->{password},
        allow_access_from => $cnf->{allow_access_from},
    );
}

# 環境設定
sub _init_env_driver {
    my $self    = shift;
    my $options = shift;
    return MyApp::EnvDetector->new( %$options );
}

1;
