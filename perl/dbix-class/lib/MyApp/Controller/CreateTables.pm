package MyApp::Controller::CreateTables;
use base qw/MyApp::Controller::Base/;
use strict;
use warnings;
use version; our $VERSION = qv("1.0.0");
use Carp;
use Cwd qw/getcwd realpath/;
use File::Spec;

sub process {
    my $self = shift;
    my $arg  = {
        from_file => '',
        load_data_dir => '',
        intent_error => 0,   # cause database connect error intentionally, for mock use
        @_,
    };
    ## disable \n trimming of logger
    $self->log->do_each(sub {
        shift->trim_ws(0);
        return 1;
    });

    my $stop_here = $self->_generate_create_database_sql_if_needed( intent_error=>$arg->{intent_error} );
    return if $stop_here || $self->error->is_error;

    my $dbh = $self->_connect_database_and_show_info;
    return if $self->error->is_error;

    my $sql_ref = $self->_get_sql_text( $arg->{from_file} );
    return if $self->error->is_error;

    $self->_execute_sql_and_show_info( $sql_ref, $dbh );
    return if $self->error->is_error;

    $self->_show_tables( $dbh );
    return if $self->error->is_error;

    $self->_load_data_from_file( $arg->{load_data_dir}, $dbh );
    return if $self->error->is_error;

    return 1;
}

sub _generate_create_database_sql_if_needed {
    my $self = shift;
    my $arg  = {
        intent_error => 0,
        @_,
    };
    eval {
        $self->database->connect({ RaiseError=>1 });
        die "intented error" if $arg->{intent_error};
    };
    if( $@ =~ m/Can't connect/ ){
        ## no mysqld service on configured host+port
        $self->error->set_error( "MySQL database connect failed. Check your config's host and port setting.\n\n$@" );
        return;
    }elsif( $@ ){
        ## assume there's no database created yet
        $self->log->set_log( "OK", join "\n", 
            "displaying create database sql",
            "",
            "Assume you'll need to create new database for this project.",
            "Execute the following SQL as admin user of database service:",
            "", "",
            $self->database->generate_create_database_sql( indent=>1 ),
            "", "",
            "Then, re-run this script again to continue.",
            "",
        );
        return 1;
    }
    return;
}

sub _connect_database_and_show_info {
    my $self = shift;
    my $dbh  = $self->database->connect;
    $self->log->set_log( "OK", "db connect: $dbh->{Name}" );
    return $dbh;
}

sub _get_sql_text {
    my $self = shift;
    my $path = shift;
    $path = realpath $path;
    ## validate
    if( !$path ){
        $self->error->set_error( "must specify sql file path" );
        return;
    }
    if( !-f $path ){
        $self->error->set_error( "file doesn't exist: $path" );
        return;
    }
    open my $fh, '<', $path or die $!;
    my $s = do { local $/ = undef; <$fh> };
    my $relpath = File::Spec->abs2rel( $path, getcwd );
    $self->log->set_log( "OK", "read file:  $relpath" );
    return \$s;
}

sub _execute_sql_and_show_info {
    my $self    = shift;
    my $sql_ref = shift || return;
    my $dbh     = shift || return;
    ## hook code for each sql query execution
    my $hook = sub {
        my $sql = shift || '';
        $sql =~ s/\(.+//;  # CREATE TABLE foo ( id auto_increment, ... ) -> CREATE TABLE foo
        $self->log->set_log( "OK", $sql );
    };
    ## execute them
    my $count = $self->database->batch_execute_plain_sql_text( $$sql_ref, $dbh, { each_post_hook=>$hook } );
    $self->log->set_log( "OK", "executed $count queries" );
    return 1;
}

sub _show_tables {
    my $self = shift;
    my $dbh  = shift || return;
    my $sth = $dbh->prepare( "SHOW TABLES" );
    $sth->execute;
    my @log;
    push @log, 'And the current database looks like this:', '';
    while ( my $res = $sth->fetchrow_arrayref ){
        my $tblname = $res->[0];
        push @log, "    $tblname";
    }
    push @log, '';
    $self->log->set_log( "OK", join "\n", @log );
    return 1;
}

sub _load_data_from_file {
    my $self = shift;
    my $dir  = shift || return;
    my $dbh  = shift || return;
    foreach my $file ( glob "$dir/*" ){
        $file = realpath $file;
        my ($cnt,$tbl) = $self->database->import_data_from_file( $file, $dbh );
        my $relpath = File::Spec->abs2rel( $file, getcwd );
        $self->log->set_log( "OK", "load data: $relpath -> $cnt recs" );
    }
    return 1;
}

1;
