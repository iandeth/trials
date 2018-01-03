package RWS::Parse::ABROAD::Spot;
use base qw( RWS::Parse::ABROAD::Base );
use strict;

sub _init {
    my $self = shift;
    $self->SUPER::_init( @_ );
    $self->{name} = 'spot';
}

sub _init_fetcher {
    my $self = shift;
    return RWS::Fetch->new(
        api => '/ab-road/spot/v1/alliance',
        key => $self->{api}{key},
        params => {
            count  => 100,
        },
    );
}

sub _create_csv_each_row {
    my $self = shift;
    my $row  = shift;
    return [
        $row->{code},
        $row->{name},
        $row->{city}{code},
        $row->{city}{name},
    ];
}

1;

