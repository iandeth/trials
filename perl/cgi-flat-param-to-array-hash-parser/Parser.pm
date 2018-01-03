package Parser;
use strict;
use warnings;
use Carp;
use JSON::Syck;

sub service_method_data_parse {
    my $class = shift;
    my $data  = shift || {};
    my @task;
    foreach my $k ( keys %$data ){
        ## parsing this directive: { 'fields()'=>'some_method(fld)' }
        if( $k =~ /^(\w+)\(\)$/ ){
            my $outname = $1;
            my ( $method, $arg ) = ( $data->{$k} =~ /^ (.+?) (?: \( \s* (.+?) \s* \) )? $/xms );
            croak "$k parse failed. Param with the same key name already exists: $outname" if defined $data->{$outname};
            croak "$k parse failed. No such method supported: $data->{$k}" if !defined $method;
            ## to_array_of_hash
            if( $method eq '2arrhash' ){
                push @task, {
                    args       => { outname=>$outname, keyname=>$arg },
                    method     => "_transform_flat_param_to_array_of_hashes",
                    delete_key => sub { my $data=shift; delete $data->{"$outname()"} },
                    exec_order => 2,
                };
            ## no corresponding method defined
            }else{
                croak "$k parse failed. No such method supported: $data->{$k}";
            }
        ## parsing this directive: { 'fields{}'=>'{some:1,json:[1,2]}' }
        ## and also              : { 'fields[]'=>'{some:1,json:[1,2]}' }
        }elsif( $k =~ /^ ( ( [^ \{\}\[\] ]+ ) (?: \{\} | \[\] ) ) $/xms ){
            my( $target_key, $outname ) = ( $1, $2 );
            croak "$k parse failed. Param with the same key name already exists: $outname" if defined $data->{$outname};
            ## json_to_perl
            push @task, {
                args       => { target_key=>$target_key, outname=>$outname },
                method     => "_transform_json_to_perl_object",
                delete_key => sub { my $data=shift; delete $data->{$target_key} },
                exec_order => 1,
            };
        }
    }
    ## do nothing and return original data if no directive were found
    return $data if scalar @task == 0;
    ## else exec tasks
    my $newdata = { %$data };  # create shallow copy
    foreach my $task ( sort { $a->{exec_order} <=> $b->{exec_order} } @task ){
        ## exec task method
        my $method = $task->{method};
        $newdata = $class->$method( %{$task->{args}}, data=>$newdata );    
        ## delete directive hash key/value from $newdata
        $task->{delete_key}->( $newdata );
    }
    return $newdata;
};

sub _transform_flat_param_to_array_of_hashes {
    my $class = shift;
    my $arg   = {
        data    => {},
        outname => 'array_of_hashes',
        keyname => 'fld',
        @_,
    };
    $arg->{keyname} ||= '';
    my $data = $arg->{data};
    my %flds;
    my @delete_origkeys;
    ## find and process target key/value
    foreach my $origkey ( keys %$data ){
        ## if $k is something like 'fld1_foo', 'fld21_id', 'fldxx_bar' ...
        if( $origkey =~ /^$arg->{keyname}([^_]+)_(.+?)$/ ){
            my ($grp,$key) = ($1,$2);
            $flds{$grp} ||= {};
            $flds{$grp}->{$key} = $data->{$origkey};
            push @delete_origkeys, $origkey;
        }
    }
    ## delete before-parse key/values
    foreach my $k ( @delete_origkeys ){
        delete $data->{$k};    
    }
    ## make nicely sorted array
    my @sorted_keys = sort keys %flds;
    my @flds;
    foreach my $k ( @sorted_keys ){
        push @flds, $flds{$k};  
    }
    ## create new key/value in $data
    $data->{ $arg->{outname} } = \@flds;
    return $data;
}

sub _transform_json_to_perl_object {
    my $class = shift;
    my $arg   = {
        data       => {},
        outname    => 'perl_object',
        target_key => '',
        @_,
    };
    my $data = $arg->{data};
    ## get json text
    my $json = $data->{ $arg->{target_key} };
    ## do nothing if json text is blank
    return $data if !defined $json || $json eq '';
    ## croak if json text isn't a string
    croak "$arg->{target_key} is not a json string: $json" if ref $json || ref \$json ne 'SCALAR';
    ## json2perl
    # using JSON::Syck instead of JSON because JSON woludn't allow single quotes
    # as string representation -> {foo:'bar'},
    # it only accepts double quotes -> {foo:"bar"}
    # and JSON::XS does not support 'allow_singlequote' option.
    # but JSON::Syck can accept single quotes too -> {foo:'bar'}
    my $obj = JSON::Syck::Load( $json );
    #my $obj = JSON->new->allow_singlequote->decode( $json );

    ## create new $data key/value
    $data->{ $arg->{outname} } = $obj;
    return $data;
}

1;
