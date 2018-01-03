package MyApp::DupDropper::Tour;

sub new {
    my $class = shift;
    my $p = {
        check_hash => {},
        dup_count => 0,
    };
    return bless $p, $class;
}

sub is_duplicate {
    my $self = shift;
    my $obj  = shift || {};
    my $brand = $obj->{brand}{code};
    my $str   = $brand . '_' . substr( $obj->{title}, 0, 20 );
    if( $self->{check_hash}{ $str } ){
        warn "$obj->{title}\n" if $ENV{DEBUG};
        $self->{dup_count}++;
        return 1;
    }
    $self->{check_hash}{ $str }++;
    return undef;
}

1;
