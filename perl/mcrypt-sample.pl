#!/usr/bin/perl -w
use strict;
use Mcrypt;

#my $str = "foobarbaz12345678";
#my $str = "foobarbaz12345678あいうえ日本語";
#my $str = "12|102|20100129045902";
my $str = "12|102|20100129045902|600";
$str = shift @ARGV if scalar @ARGV > 0;

my $key    = "32 bytes of your apps secret key";  # secret key
my $iv     = "16 bytes of rand"; # shared initialization vector
my $hexenc = "";  # final encrypted output token

## encrypt
{
    my $td = Mcrypt->new(
        algorithm => Mcrypt::TWOFISH(),
        mode      => Mcrypt::CFB(),
        verbose   => 1,
    );
    $td->init( $key, $iv ) or die "Could not initialize td";
    #warn "key_size  : $td->{KEY_SIZE}\n";
    #warn "iv_size   : $td->{IV_SIZE}\n";
    warn "block_size: $td->{BLOCK_SIZE}\n";
    my $str_padded = _pad( $str, $td->{BLOCK_SIZE} );
    warn "str length : " . length( $str_padded ) . "\n";
    my $enc = $td->encrypt( $str_padded );
    $hexenc = unpack "H*", $enc;
    warn qq{encrypt + hexed string : "$hexenc"\n};
}

## decrypt
{
    my $td = Mcrypt->new(
        algorithm => Mcrypt::TWOFISH(),
        mode      => Mcrypt::CFB(),
        verbose   => 1,
    );
    $td->init( $key, $iv ) or die "Could not initialize td";
    my $enc = pack "H*", $hexenc;
    my $dec_padded = $td->decrypt( $enc );
    my $dec = _trim_pad( $dec_padded );
    warn qq{decrypted string       : "$dec"\n};
}

## utils
sub _pad {
    my $str = shift || '';
    my $block_size = shift || 16;
    my $pad_char = " ";
    use bytes;
    my $str_len = length $str;
    no bytes;
    return $str . $pad_char x (_ceil($str_len / $block_size) * $block_size - $str_len);
}

sub _trim_pad {
    my $str = shift || '';
    my $pad_char = " ";
    $str =~ s/${pad_char}+$//;
    return $str;
}

sub _ceil {
   my $var = shift;
   my $a = 0;
   $a = 1 if($var > 0 and $var != int($var));
   return int($var + $a);
}
