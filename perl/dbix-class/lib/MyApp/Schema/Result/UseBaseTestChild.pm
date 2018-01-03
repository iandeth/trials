package MyApp::Schema::Result::UseBaseTestChild;
use base qw/MyApp::Schema::Result::UseBaseTestParent/;

__PACKAGE__->table( 'component_test' );  # required to call again here
__PACKAGE__->add_columns( qw/foo/ );

1;
