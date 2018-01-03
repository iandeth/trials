package MyApp::Controller::Fiddle;
use base qw/MyApp::Controller::Base/;
use strict;
use warnings;
use version; our $VERSION = qv("1.0.0");
use Carp;
use MyApp::Schema;
use MyApp::Controller::CreateTables;

sub x01_artist_all {
    my $self = shift;
    my $arg  = { trace=>1, @_, };
    my $schema = $self->_get_schema( %$arg );
    ## fetch all artists
    my $artist_rs = $schema->resultset( 'Artist' );
    while( my $artist = $artist_rs->next ){
        $self->log->set_log( "-", "artist", $artist->artist_id, $artist->name ); 
    }
    ## same as above
    #foreach my $artist ( $schema->resultset( 'Artist' )->all ){
    #    $self->log->set_log( "-", "artist", $artist->artist_id, $artist->name ); 
    #}
    return 1;
}

sub x02_artist_search {
    my $self = shift;
    my $arg  = { trace=>1, @_, };
    my $schema = $self->_get_schema( trace=>$arg->{trace} );
    ## search for artist like 'M%'
    my $artist_rs = $schema->resultset( 'Artist' )->search({ name=>{ like=>'M%' } });
    while( my $artist = $artist_rs->next ){
        my $cds_rs = $artist->cds->search( undef, { order_by=>'year' } );
        $self->log->set_log( "-", "artist", $artist->name, $cds_rs->count . " cds" ); 
        ## get artist's cds
        while( my $cd = $cds_rs->next ){
            $self->log->set_log( "-", "cd", $artist->name, $cd->year, $cd->title ); 
        }
    }

    return 1;
}

sub x03_cd_search_prefetch_artist {
    my $self = shift;
    my $arg  = { trace=>1, @_, };
    my $schema = $self->_get_schema( trace=>$arg->{trace} );
    ## search cds for artist like 'M%'
    my $cds_rs = $schema->resultset( 'CD' )->search(
        { "artist.name"=>{ like=>'M%' } },
        { prefetch=>'artist' },
    );
    while( my $cd = $cds_rs->next ){
        $self->log->set_log( "-", "cd", $cd->artist->name, $cd->year, $cd->title ); 
    }

    ## get all 'M%' artist's cds
    ## this is a lame way, in terms of DBI query execution count
    #my $m_artist_cds_rs = $m_rs->search_related( 'cds', undef, { order_by=>'year' } );
    #while( my $cd = $m_artist_cds_rs->next ){
    #    $self->log->set_log( "-", "cd order by year", $cd->artist->name, $cd->year, $cd->title );
    #}
    return 1;
}

sub x04_cd_search_with_pager {
    my $self = shift;
    my $arg  = { trace=>1, @_, };
    my $schema = $self->_get_schema( trace=>$arg->{trace} );
    ## search cds for artist like 'M%'
    my $cds_rs = $schema->resultset( 'CD' )->search(
        { "artist.name"=>{ like=>'M%' } },
        { prefetch=>'artist', order_by=>'year', rows=>4, page=>1 },
    );
    my $page = $cds_rs->pager;
    $self->log->set_log( 
        "-", "cd page info",
        "total: " . $page->total_entries . " cds",
        "current page: " . $page->current_page . "/" . $page->last_page,
    ); 
    for ( my $p = 1; $p <= $page->last_page; $p++ ){
        my $_rs = $cds_rs->page( $p );
        while( my $cd = $_rs->next ){
            $self->log->set_log( "-", "page $p", $cd->artist->name, $cd->year, $cd->title ); 
        }
    }
    return 1;
}

sub x05_insert_new_cd {
    my $self = shift;
    my $arg  = {
        trace    => 1,
        base_dir => '',
        @_,
    };
    my $schema = $self->_get_schema( trace=>$arg->{trace} );
    $self->_recreate_tables_and_records( base_dir=>$arg->{base_dir} );
    ## insert new record
    my $artist = $schema->resultset( 'Artist' )->single({ name=>'Megadeth' });  # or ->search({ name=>'Megadeth' })->slice(0);
    my $cd = $schema->resultset( 'CD' )->new({ title=>'Youthanasia', year=>1994, artist=>$artist });
    $schema->txn_do(sub {
        $cd->insert;
        $self->log->set_log( "OK", "insert new record", $cd->title, $cd->id );
    });
    ## see result
    my $cds_rs = $schema->resultset( 'CD' )->search({ artist_id=>$artist->id });
    while( my $cd = $cds_rs->next ){
        $self->log->set_log( "-", "cd", $cd->id, $cd->year, $cd->title ); 
    }
}

sub x06_component_test_add_columns {
    my $self = shift;
    my $arg  = {
        trace    => 1,
        @_,
    };
    my $schema = $self->_get_schema( trace=>$arg->{trace} );
    my $rs = $schema->resultset( 'ComponentTest' )->all;
    return 1;
}

sub x07_use_base_test {
    my $self = shift;
    my $arg  = {
        trace    => 1,
        @_,
    };
    my $schema = $self->_get_schema( trace=>$arg->{trace} );
    $self->log->set_log( "resultset parent..." );
    my $rs  = $schema->resultset( 'UseBaseTestParent' )->all;
    $self->log->set_log( "resultset child..." );
    my $rs2 = $schema->resultset( 'UseBaseTestChild' )->all;
    return 1;
}

sub x99_deployment_statement {
    my $self = shift;
    my $arg  = { trace=>1, @_, };
    my $schema = $self->_get_schema( trace=>$arg->{trace} );
    $self->log->set_log( "-", "deploy", $schema->storage->deployment_statements( $schema ) );
    return 1; 
}

## utilities
sub _get_schema {
    my $self = shift;
    my $arg  = {
        trace => 0,
        @_,
    };
    my $schema = MyApp::Schema->connect(sub {
        my $dbh = $self->database->connect_cached;
        return $dbh;
    });
    if( $arg->{trace} ){
        $schema->storage->debug(1);
        $schema->storage->debugcb(sub {
            my ($op,$info) = @_;
            warn "\n    [trace]\n    " . $info . "\n";
        });
    }
    return $schema;
}

sub _recreate_tables_and_records {
    my $self = shift;
    my $arg  = {
        base_dir => '',
        @_,
    };
    my $app = MyApp::Controller::CreateTables->new( use_tools=>$self );
    my $file = $arg->{base_dir} . "/../database/create_table.sql";
    my $load_data_dir = $arg->{base_dir} . "/../database/initial_data";
    $app->process( from_file=>$file, load_data_dir=>$load_data_dir );
    croak $app->error->get_error if $app->error->is_error;
    return 1;
}

1;
