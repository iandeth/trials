package RWS::Parse::Base;
use base qw( RWS::Base );
use strict;
use IO::File;
use File::Spec;
use RWS::Fetch;

sub new {
    my $class = shift;
    my $key   = shift;
    my $parent = $class->SUPER::new;
    my $p = {
        %$parent,
        name    => 'base',
        fetcher => undef,
        api => {
            key => $key,
        },
        csv => {
            file => undef,
            fh   => undef,
        },
    };
    my $self = bless $p, $class;
    $self->_init( @_ );
    return $self;
}

sub _init {
    my $self = shift;
    $self->{fetcher} = $self->_init_fetcher;
    return 1;
}

sub _init_fetcher {
    my $self = shift;
    return RWS::Fetch->new;
}

sub create_csv {
    my $self = shift;
    my $dir  = shift || '.';
    my $fh   = $self->{csv}{fh};
    my $name = $self->{name};
    my $file = "$dir/$name.csv";
    if( !$fh ){
        $fh = IO::File->new( $file, '>' ) or die $!;
        $self->{csv}{fh} = $fh;
    }
    local $| = 1;
    my $count = 0;
    my $relpath = File::Spec->abs2rel( $file );
    $self->{fetcher}->fetch_all( sub {
        my $json = shift;
        my $arr = $json->{results}{$name} || [];
        foreach my $area ( @$arr ){
            my $cols = $self->_create_csv_each_row( $area );
            my $line = join "\t", @$cols;
            $fh->print( $line, "\n" );
            $count++;
            print "generating $relpath ... $count rows\r";
        }
    });
    print "\n";
}

sub _create_csv_each_row {
    my $self = shift;
    my $itm  = shift;  # each api result item json
    return 'sample\row';
}

1;
