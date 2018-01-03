#!/usr/bin/perl -w
use strict;
use File::Find;
use File::Path qw/mkpath/;
use File::Spec;
use File::Copy;
use File::stat;
use FindBin;
use Image::ExifTool qw/:Public/;
use Getopt::Long;

my $indir  = 'test-photos';
my $outdir = 'result';

GetOptions(
	"indir=s"  => \$indir,
	"outdir=s" => \$outdir,
);

$outdir = File::Spec->rel2abs( $outdir );
my $cnt_dir     = 0;
my $cnt_file    = 0;
my $cnt_ignore  = 0;
my $cnt_unknown = 0;

find({
	wanted => sub {
		if( /^\./ ){
			# dot files
			return if /^\.+$/;
			print "skip: $_\n";
		}elsif( -d $_ ){
			# directories
			# do nothing.
		}elsif( -f $_ ){
			# files
			make_out_file( $_ );
		}else{
			# what else then?
			print "unknown: $_\n";
			$cnt_unknown++;
		}
	},
}, $indir );

print "\n[total]\n";
print "dir:     $cnt_dir\n";
print "file:    $cnt_file\n";
print "ignore:  $cnt_ignore\n";
print "unknown: $cnt_unknown\n";


sub make_out_file {
	my $file = shift || '.';
	my $info = ImageInfo $file;
	my $dt   = $info->{DateTimeOriginal} || $info->{CreateDate};
	#use Dumpvalue; Dumpvalue->new->dumpValue( $info ); die;
	if( !$dt ){
		ignore_file( $file );
		return;
	}
	my ( $y,$m,$d,$h,$mi,$s ) = ( $dt =~ /(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/ );
	my $dir = make_out_dir( $y, $m, $d );
	# set suffix
	my ( $suffix ) = ( $file =~ /[^.]+\.([^.]+)$/ );
	$suffix = lc $suffix;
	if( $suffix eq 'jpeg' ){
		$suffix = 'jpg';
	}
	my $outfile = "$dir/${y}_${m}_${d}_$h$mi$s.$suffix";
	( my $outfile_wo_suffix = $outfile ) =~ s/\.$suffix//;
	# adobe photo album - edited files
	if( $file =~ /_edited\./ ){
		#$outfile = $outfile_wo_suffix . "_edited.$suffix";
		my $relfile = File::Spec->abs2rel( $outfile, $outdir );
		ignore_file( $file, "edited - $relfile" );
		return;
	}
	# 2nd shot in the same 1 second
	if( -f $outfile ){
		my $s_this = stat $file;
		my $s_that = stat $outfile;
		if( $s_this->size eq $s_that->size ){
			ignore_file( $file, "duplicates - $outfile" );
			return;
		}
		my $i = 2;
		while( 1 ){
			my $d2  = sprintf "%02d", $i;
			my $tmp = $outfile_wo_suffix . "_${d2}.$suffix";
			if( !-f $tmp ){
				$outfile = $tmp;
				last;
			}
			$i++;
		}
	}
	# copy file
	copy $file, $outfile or die $!;
	my $relfile = File::Spec->abs2rel( $outfile, $outdir );
	print "file created: $relfile\n";
	$cnt_file++;
	return $outfile;
}

sub make_out_dir {
	my ( $y,$m,$d ) = @_;
	my $dir = "$outdir/$y/${y}_${m}_${d}";
	return $dir if -d $dir;
	mkpath $dir, 0;	
	my $reldir = File::Spec->abs2rel( $dir, $outdir );
	print "dir  created: $reldir\n";
	$cnt_dir++;
	return $dir;
}

sub ignore_file {
	my $file = shift || return;
	my $type = shift || 'unwanted';
	my $dir = "$outdir/ignored";
	if( !-d ){
		mkpath $dir, 0;
	}
	copy $file, "$dir/$file";
	print "ignore file: $type - $file\n";
	$cnt_ignore++;
	return;
}
