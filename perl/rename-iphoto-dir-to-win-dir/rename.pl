#!/usr/bin/perl -w
use strict;
use File::Find;

my $dir = shift || '.';
my $cnt_dir=0;
my $cnt_file=0;
finddepth({
	wanted => sub {
		if( -d $_ && $_ =~ /:/ ){
			# rename directory name with colon
			# e.g. 2008:08:30 -> 2008-08-30-0000-00
			( my $new = $_ ) =~ s/:/-/g;
			$new .= '-0000-00';
			rename $_, $new;
			print "dir rename: $new\n";
			$cnt_dir++;
		}
		elsif( -f $_ && $_ =~ /^\./ ){
			unlink $_;
			print "unlink: $_\n";
			$cnt_file++;
		}
	},
}, $dir );

print "total directories: $cnt_dir\n";
print "total files:       $cnt_file\n";
