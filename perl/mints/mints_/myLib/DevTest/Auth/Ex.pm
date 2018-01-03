package DevTest::Auth::Ex;
use base Mints::Model;
use strict;
use CGI::Ex::Auth;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	
	  $self->{a} = CGI::Ex::Auth->new({
	    hook_get_pass_by_user => \&get_pass_by_user,
	    #hook_print            => \&my_print,
	    login_type            => 'sha1',
	  });
	$self->{a}{ctrl} = $ctrl;
	$ctrl->setViewModule('Mints::View::None');
	$self->{a}->require_auth;
}

### authorize the user
sub get_pass_by_user {
	my $auth = shift;
    my $username = shift;
    my $host = shift;
    my $password = 'hoge';
    return $password;
  }

  sub my_print {
    my $auth = shift;
    my $step = shift;
    my $form = shift; # form includes login_script at this point
    my $content = '';
	$auth->{ctrl}{model}{form} = $form;
    #$auth->cgix->swap_template(\$content, $form);
    #$auth->cgix->print_content_type;
    #print $content;
  }

1;