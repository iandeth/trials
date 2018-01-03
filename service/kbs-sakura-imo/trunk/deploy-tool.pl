#!/usr/bin/perl -w
use strict;
use File::Find;
use File::Path;
use FindBin;

our $VERSION = shift @ARGV || '1.0';
our $REPOS = 'http://iandeth.googlecode.com/svn/trials/service/kbs-sakura-imo/trunk';
our $ARCHIVE_NAME = "kbs-sakura-imo";

# change working directory
chdir $FindBin::RealBin;

# get latest source from svn repository
my $ok = system "svn export $REPOS $ARCHIVE_NAME";
die 'failed svn export' if $ok < 0;

# remove unnecessary files and directories
foreach my $fd (qw/
    jalan_bridge.cgi
    deploy-tool.pl
/){
    rmtree "$ARCHIVE_NAME/$fd";
    print "remove: $fd\n";
}

# change jalan_bridge.cgi place
# dev=local, prd=mtl.tatamilab.jp
{
    open my $fh, '<', "$ARCHIVE_NAME/js/recruit.info.js" or die $!;
    my @lines = <$fh>;
    close $fh;
    open $fh, '>', "$ARCHIVE_NAME/js/recruit.info.js" or die $!;
    foreach (@lines){
        if( m{ (\s+?var\s+?url\s+?=\s+?')jalan_bridge.cgi('.+?) }xsmg ){ 
            print $fh $1,
                'http://mtl.recruit.co.jp/sandbox/toshi_i/kbs-sakura-imo/jalan_bridge.cgi',
                $2, "\n";
        }else{
            print $fh $_;
        }
    }
    print "change jalan_bridge.cgi path: mtl.recruit.co.jp\n";
}

# create zip file
my $zip = "${ARCHIVE_NAME}.zip";
unlink $zip if -f $zip;
system "zip -r $zip $ARCHIVE_NAME";

# remove archived directory
END {
    rmtree $ARCHIVE_NAME;
}
