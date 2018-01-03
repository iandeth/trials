package MyApp::Schema::Result::Artist;
use base qw/DBIx::Class::Core/;

__PACKAGE__->table( 'artist' );
__PACKAGE__->add_columns( qw/artist_id name/ );
__PACKAGE__->set_primary_key( 'artist_id' );
__PACKAGE__->has_many( cds=>'MyApp::Schema::Result::CD', 'artist_id' );

1;
