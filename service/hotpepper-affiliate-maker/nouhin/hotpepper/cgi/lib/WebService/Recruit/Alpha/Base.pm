package WebService::Recruit::Alpha::Base;
use strict;
use CGI qw/ -oldstyle_urls /;
use LWP::UserAgent ();
use XML::TreePP ();
our $VERSION = '0.01';

sub new {
	my $class = shift;
	my $p = {
		api_key_name => 'key',
		api_key      => undef,
		api_url      => undef,
		params       => {},
		items_per_page_name => 'count',
		items_per_page   => 10,
		items_start_name => 'start',
		items_start => 1,
		is_success  => 0,
		error_msg   => undef,
		parse_content_options => {},
		result_tree => undef,
		@_,
	};
	return bless $p, $class;
}

sub _send_request {
	my $self = shift;
	$self->{params} = {
		"$self->{api_key_name}" => $self->get_api_key(),
		"$self->{items_per_page_name}" => $self->{items_per_page},
		@_,
	};
	# state initialize
	$self->{is_success}  = 0;
	$self->{error_msg}   = undef;
	$self->{result_tree} = undef;
	# prepare get string
	my $url = $self->_make_url_with_query( $self->{params} );

	# http request
	# my $raw_content = $self->_http_request( $url );
	# parse content
	# my $tree = $self->_parse_content( $raw_content );
	#
	# http request & parse content
	my $tree = $self->_http_request_and_parse( $url );
	$tree    = $self->_parse_post_hook( $tree );

	# custom error check
	return undef unless $self->_check_result( $tree );
	# on success
	$self->{is_success}  = 1;
	$self->{result_tree} = $tree;
	return $tree;
}

sub _make_url_with_query {
	my $self   = shift;
	my $params = shift || $self->{params};
	# remember some parameter values for latter creation
	# of paging info.
	if(my $v = $params->{ $self->{items_per_page_name} }){
		$self->{items_per_page} = $v;
	}
	if(my $v = $params->{ $self->{items_start_name} }){
		$self->{items_start} = $v;
	}
	# make encoded query string
	my $q = CGI->new($params);
	return $self->{api_url} . '?' . $q->query_string();
}

sub _http_request_and_parse {
	my $self = shift;
	my $url  = shift;
	my $tpp = XML::TreePP->new(
		%{ $self->{parse_content_options} }
	);
	return $tpp->parsehttp('GET',$url);
}

sub _parse_post_hook {
	my $self = shift;
	my $tree = shift;
	return 1;
}

sub is_success {
	my $self = shift;
	return $self->{is_success};
}

sub get_api_key {
	my $self = shift;
	return $self->{api_key};
}

sub set_api_key {
	my $self = shift;
	$self->{api_key} = shift;
	return 1;
}

sub get_result {
	my $self = shift;
	return $self->{result_tree};
}

sub get_url_with_query {
	my $self = shift;
	return $self->_make_url_with_query();
}

sub get_items_per_page {
	my $self = shift;
	return $self->{items_per_page};
}

sub set_items_per_page {
	my $self = shift;
	$self->{items_per_page} = shift || $self->{items_per_page};
	return 1;
}

sub get_paging_info {
	my $self = shift;
	my $arg = {
		with_range_info => 0,
		range => 5,
		start    => $self->{items_start},
		per_page => $self->{items_per_page},
		actual_display_items => $self->{items_per_page},
		@_,
	};
	my $data = $self->get_result();
	my $pager = {
		total_items => $data->{NumberOfResults},
		total_pages => 1,
		back  => 0,
		next  => 0,
		disp_page_num => 1,
		disp_from     => $arg->{start},
		disp_to       => $arg->{start} + $arg->{actual_display_items} - 1,
	};
	if($arg->{with_range_info}){
		$pager->{range_info} = [];
		$pager->{has_more_back} = 0;
		$pager->{has_more_next} = 0;
	}
	# has back link
	if($arg->{start} != 1){
		$pager->{back} = $arg->{start} - $arg->{per_page};
		$pager->{back} = 1 if $pager->{back} < 1;
		$pager->{back_url} = $self->_make_url_with_query({
			%{ $self->{params} },
			"$self->{items_start_name}" => $pager->{back},
		});
	}
	# has next link
	my $last_item = $arg->{start} + $arg->{actual_display_items} - 1;
	if($last_item < $pager->{total_items}){
		$pager->{next} = $arg->{start} + $arg->{actual_display_items};
		$pager->{next_url} = $self->_make_url_with_query({
			%{ $self->{params} },
			"$self->{items_start_name}" => $pager->{next},
		});
	}
	# find current page num
	my($int,$dec) = split(/\./, $pager->{total_items} / $arg->{per_page});
	$pager->{total_pages} = ($dec)? $int + 1 : $int;
	for my $i (1 .. $pager->{total_pages}){
		if(
			$i * $arg->{per_page} > $arg->{start} &&
			($i - 1) * $arg->{per_page} < $arg->{start}
		){
			$pager->{disp_page_num} = $i;
			last;
		}
	}
	# create all page links
	for my $i (1 .. $pager->{total_pages}){
		# has more back/next?
		if($arg->{with_range_info} && $arg->{range} > 0){
			if(
				$pager->{disp_page_num} - $arg->{range} > 0 &&
				$i < $pager->{disp_page_num} - $arg->{range}
			){
				$pager->{has_more_back} = 1;
				next;
			}
			if($i > $pager->{disp_page_num} + $arg->{range}){
				$pager->{has_more_next} = 1;
				next;
			}
		}
		# make url
		my $start = ($i - 1) * $arg->{per_page} + 1;
		my $url = $self->_make_url_with_query({
			%{ $self->{params} },
			"$self->{items_start_name}" => $start,
		});
		# add to all pages array
		if($arg->{with_range_info}){
			push(@{ $pager->{range_info} }, {
				page_num => $i,
				is_current => ($pager->{disp_page_num} == $i) ?
					1 : 0,
				url => $url,
				start => $start,
			});
		}
	}
	return $pager;
}

sub _set_error_msg {
	my $self = shift;
	my $msg  = shift;
	$self->{is_success} = 0;
	$self->{error_msg}  = $msg;
	return 1;
}

sub get_error_msg {
	my $self = shift;
	return $self->{error_msg};
}

1;
__END__

=head1 NAME

WebService::Recruit -- リクルート社提供のWEBサービス wrapper (base class)

=head1 SYNOPSIS

L<WebService::Recruit::Hotpepper>やL<WebService::Recruit::Jalan>モジュール用のベースクラスです。単体では使う事は想定されていません。

=cut