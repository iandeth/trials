#!/usr/bin/perl -w
use strict;
use File::Find;
use File::Path;
use FindBin;

our $VERSION = shift @ARGV || '1.0';
our $REPOS = 'http://iandeth.googlecode.com/svn/trials/service/beauty-style-alliance/trunk';
our $ARCHIVE_NAME = "beauty-style-alliance";

# change working directory
chdir $FindBin::RealBin;

# get latest source from svn repository
my $ok = system "svn export $REPOS $ARCHIVE_NAME";
die 'failed svn export' if $ok < 0;

# remove unnecessary files and directories
foreach my $fd (qw/
    .htaccess
    bridge.cgi
    cpan
    deploy-tool.pl
    index.html
    devel.html
    devel-zero.html
    devel-more.html
    devel-more-stop.html
    devel-keyword.html
    access_log
/){
    rmtree "$ARCHIVE_NAME/$fd";
    print "remove: $fd\n";
}

# change bridge.cgi place
# dev=local, prd=mtl.tatamilab.jp
{
    open my $fh, '<', "$ARCHIVE_NAME/js/myapp.js" or die $!;
    my @lines = <$fh>;
    close $fh;
    open $fh, '>', "$ARCHIVE_NAME/js/myapp.js" or die $!;
    foreach (@lines){
        if( m{ (\s+?url:\s+?')bridge.cgi('.+?) }xsmg ){ 
            print $fh $1,
                'http://webservice.recruit.co.jp/beauty/style-imo/bridge.cgi',
                $2, "\n";
        }else{
            print $fh $_;
        }
    }
    print "change bridge.cgi path: mtl.recruit.co.jp\n";
}

# create zip file
my $zip = "${ARCHIVE_NAME}.zip";
unlink $zip if -f $zip;
system "zip -r $zip $ARCHIVE_NAME";

# remove archived directory
END {
    rmtree $ARCHIVE_NAME;
}
