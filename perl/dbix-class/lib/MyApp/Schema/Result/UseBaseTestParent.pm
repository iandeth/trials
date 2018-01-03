package MyApp::Schema::Result::UseBaseTestParent;
use base qw/DBIx::Class::Core/;

__PACKAGE__->table( 'component_test' );
__PACKAGE__->add_columns( qw/id name/ );
__PACKAGE__->set_primary_key( 'id' );

1;
