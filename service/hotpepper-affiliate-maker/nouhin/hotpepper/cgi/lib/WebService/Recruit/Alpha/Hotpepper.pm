package WebService::Recruit::Alpha::Hotpepper;
use base WebService::Recruit::Alpha::Base;
use strict;
our $VERSION = '0.01';

sub new {
	my $class = shift;
	my $p = $class->SUPER::new(@_);
	$p->{api_key_name}        = 'key';
	$p->{items_per_page_name} = 'Count';
	$p->{items_start_name}    = 'Start';
	$p->set_items_per_page( 10 );
	$p->{parse_content_options} = {
		force_array => [ 'Shop','Message' ]
	};
	return bless $p, $class;
}

sub _parse_post_hook {
	my $self = shift;
	my $tree = shift;
	# get rid of root element
	return $tree->{Results};
}

sub _check_result {
	my $self = shift;
	my $tree = shift;
	if($tree->{Message}){
		$self->_set_error_msg( $tree->{Message}[0] );
		return undef;
	}
	if($tree->{NumberOfResults} < 1){
		$self->_set_error_msg( "検索結果が0件でした" );
		return undef;
	}
	return 1;
}

sub get_paging_info {
	my $self = shift;
	my $data = $self->get_result();
	return $self->SUPER::get_paging_info(
		actual_display_items => scalar @{ $data->{Shop} || [] },
		@_,
	);
}

sub get_area_master_table {
	my $self = shift;
	### translate array to hash: SmallArea
	$self->small_area();
	return undef unless $self->is_success();
	my $sa_res = $self->get_result()->{SmallArea};
	my $sa_in_ma = {};
	foreach (@{ $sa_res }){
		$sa_in_ma->{ $_->{MiddleAreaCD} }{ $_->{SmallAreaCD} } = {
			name => $_->{SmallAreaName},
		};
	}
	### translate array to hash: MiddleArea
	$self->middle_area();
	return undef unless $self->is_success();
	my $ma_res = $self->get_result()->{MiddleArea};
	my $ma_in_la = {};
	foreach (@{ $ma_res }){
		$ma_in_la->{ $_->{LargeAreaCD} }{ $_->{MiddleAreaCD} } = {
			name => $_->{MiddleAreaName},
			sa   => $sa_in_ma->{ $_->{MiddleAreaCD} },
		};
	}
	### translate array to hash: LargeArea
	$self->service_area();
	return undef unless $self->is_success();
	my $sva_res = $self->get_result()->{ServiceArea};
	my $lsa_of_la = {};
	foreach (@{ $sva_res }){
		my $la_cd = $_->{ServiceAreaCD};
		$la_cd =~ s{^SA}{Z0};
		$lsa_of_la->{ $la_cd } = $_->{LargeServiceAreaCD};
	}
	$self->large_area();
	return undef unless $self->is_success();
	my $la_res = $self->get_result()->{LargeArea};
	my $la_in_lsa = {};
	foreach (@{ $la_res }){
		my $lsa = $lsa_of_la->{ $_->{LargeAreaCD} };
		$la_in_lsa->{ $lsa }{ $_->{LargeAreaCD} } = {
			name => $_->{LargeAreaName},
			ma   => $ma_in_la->{ $_->{LargeAreaCD} },
		};
	}
	### translate array to hash: LargeServiceArea
	$self->large_service_area();
	return undef unless $self->is_success();
	my $lsa_res = $self->get_result()->{LargeServiceArea};
	my $lsa = {};
	foreach (@{ $lsa_res }){
		$lsa->{ $_->{LargeServiceAreaCD} } = {
			name => $_->{LargeServiceAreaName},
			la   => $la_in_lsa->{ $_->{LargeServiceAreaCD} },
		};
	}
	return $lsa;
}

sub gourmet_search {
	my $self = shift;
	$self->{api_url} = 'http://api.hotpepper.jp/GourmetSearch/V110/';
	my %params = @_;
	if(exists $params{Keyword} && $params{Keyword} ne ''){
		# OR検索対応: 全角スペースを半角に
		$params{Keyword} =~ s{　}{ }g;
	}
	return $self->_send_request( %params );
}

sub large_service_area {
	my $self = shift;
	$self->{api_url} = 'http://api.hotpepper.jp/LargeServiceArea/V110/';
	return $self->_send_request(@_);
}

sub service_area {
	my $self = shift;
	$self->{api_url} = 'http://api.hotpepper.jp/ServiceArea/V110/';
	return $self->_send_request(@_);
}

sub large_area {
	my $self = shift;
	$self->{api_url} = 'http://api.hotpepper.jp/LargeArea/V110/';
	return $self->_send_request(@_);
}

sub middle_area {
	my $self = shift;
	$self->{api_url} = 'http://api.hotpepper.jp/MiddleArea/V110/';
	return $self->_send_request(@_);
}

sub small_area {
	my $self = shift;
	$self->{api_url} = 'http://api.hotpepper.jp/SmallArea/V110/';
	return $self->_send_request(@_);
}

sub genre {
	my $self = shift;
	$self->{api_url} = 'http://api.hotpepper.jp/Genre/V110/';
	return $self->_send_request(@_);
}

sub budget {
	my $self = shift;
	$self->{api_url} = 'http://api.hotpepper.jp/Budget/V110/';
	return $self->_send_request(@_);
}

1;
__END__

=head1 NAME

WebService::Recruit::Hotpepper -- Hotpepper.jp WEBサービス wrapper

=head1 SYNOPSIS

基本

  use WebService::Recruit::Hotpepper;
  my $api = WebService::Recruit::Hotpepper->new(
    api_key => 'guest'
  );
  my $tree = $api->gourmet_search(
    Keyword => '銀座 焼肉'
  ) or die $api->get_error_msg();
  print "全件数: $tree->{NumberOfResults} \n";
  print "1件目の店舗名: $tree->{Shop}[0]{ShopName} \n";

さらにページング処理用の情報を取得

  my $pgr = $api->get_paging_info();
  print "$pgr->{disp_from}から$pgr->{disp_to}件目を表示中\n";
  print "次ページのURLは $pgr->{next_url}\n";

マスタ系情報を取得

  my $tree = $api->large_service_area();
  print "$tree->{LargeServiceArea}[0]{LargeServiceAreaName} \n";

地域系マスタを階層データに変換したものを取得

  my $area_tree = $api->get_area_master_table();
  foreach (keys %{ $area_tree }){ ... }

=head1 DESCRIPTION

Hotpepper.jp WEBサービスの詳細
http://api.hotpepper.jp/reference.html

=cut