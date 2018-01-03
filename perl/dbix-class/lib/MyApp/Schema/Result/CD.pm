package MyApp::Schema::Result::CD;
use base qw/DBIx::Class::Core/;

__PACKAGE__->load_components( qw/InflateColumn::DateTime/ );
__PACKAGE__->table( 'cd' );
__PACKAGE__->add_columns( qw/cd_id artist_id title year/ );
__PACKAGE__->set_primary_key( 'cd_id' );
__PACKAGE__->belongs_to( artist=>'MyApp::Schema::Result::Artist', 'artist_id' );

1;
