package Mints::Controller::DBI;
use base DBI;
# turning the UTF8 flag ON will make $dbh->trace method work
# properly with multi-byte characters (i.e. Japanese)

package Mints::Controller::DBI::st;
use base DBI::st;
sub execute {
	my $self = shift;
	utf8::decode($_) foreach @_;
	return $self->SUPER::execute(@_);
}
sub bind_param {
	my $self  = shift;
	my $p_num = shift;
	my $bval  = shift;
	utf8::decode($bval);
	return $self->SUPER::bind_param($p_num,$bval,@_);
}

package Mints::Controller::DBI::db;
use base DBI::db;
sub prepare {
	my $self      = shift;
	my $statement = shift;
	utf8::decode($statement);
	return $self->SUPER::prepare($statement,@_);
}

1;