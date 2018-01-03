package MyApp::Parse::Base;
use strict;
use IO::File;
use File::Spec;
use RWS::Fetch;

sub new {
    my $class = shift;
    my $key   = shift;
    my $p = {
        name    => 'base',
        fetcher => undef,
        api => {
            key => $key,
        },
        xml => {
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

sub create_xml {
    my $self = shift;
    my $dir  = shift || '.';
    my $fh   = $self->{xml}{fh};
    my $name = $self->{name};
    my $file = "$dir/$name.csv";
    if( !$fh ){
        $fh = IO::File->new( $file, '>' ) or die $!;
        $self->{xml}{fh} = $fh;
    }
    local $| = 1;
    my $count = 0;
    my $relpath = File::Spec->abs2rel( $file );
    $self->{fetcher}->fetch_all( sub {
        my $json = shift;
        my $arr = $json->{results}{$name} || [];
        foreach my $area ( @$arr ){
            my $cols = $self->_prepare_each_row_object( $area );
            my $line = join "\t", @$cols;
            $fh->print( $line, "\n" );
            $count++;
            print "generating $relpath ... $count rows\r";
        }
    });
    print "\n";
}

sub _prepare_each_row_object {
    my $self = shift;
    my $itm  = shift;  # each api result item
    return {};
}

1;
