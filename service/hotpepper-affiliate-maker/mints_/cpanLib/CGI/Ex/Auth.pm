package CGI::Ex::Auth;

### CGI Extended Application

###----------------------------------------------------------------###
#  Copyright 2004 - Paul Seamons                                     #
#  Distributed under the Perl Artistic License without warranty      #
###----------------------------------------------------------------###

### See perldoc at bottom


use strict;
use vars qw($USE_PLAINTEXT
            $CHECK_CRYPTED
            $EXPIRE_LOGINS
            $FAILED_SLEEP
            $VERSION
            );

use CGI::Ex::Dump qw(debug);
use MIME::Base64 qw(encode_base64 decode_base64);

BEGIN {
  $VERSION = '0.10';
  $CHECK_CRYPTED = 1        if ! defined $CHECK_CRYPTED;
  $FAILED_SLEEP  = 2        if ! defined $FAILED_SLEEP;
  $EXPIRE_LOGINS = 6 * 3600 if ! defined $EXPIRE_LOGINS;
  #if ($ENV{MOD_PERL}) {
  #  require Digest::SHA1;
  #  require Digest::MD5;
  #}
}

###----------------------------------------------------------------###

sub new {
  my $class = shift || __PACKAGE__;
  my $self  = ref($_[0]) ? shift : {@_};
  bless $self, $class;
  $self->init();
  return $self;
}

sub init {}

###----------------------------------------------------------------###

sub require_auth {
  my $self = shift;
  $self = __PACKAGE__->new($self) if ! UNIVERSAL::isa($self, __PACKAGE__);

  ### shortcut that will print a js file as needed
  if ($ENV{PATH_INFO} && $ENV{PATH_INFO} =~ m|^/js/(CGI/Ex/\w+\.js)$|) {
    $self->cgix->print_js($1);
    return 0;
  }

  my $form    = $self->form;
  my $cookies = $self->cookies;
  my $key_l   = $self->key_logout;
  my $key_c   = $self->key_cookie;
  my $key_u   = $self->key_user;
  my $key_p   = $self->key_pass;
  my $key_chk = $self->key_cookie_check;
  my $had_form_info = 0;

  ### if they've passed us information - try and use it
  if ($form->{$key_l}) {
    $self->delete_cookie;

  } elsif (exists($form->{$key_u}) && exists($form->{$key_p})) {
    if ($self->verify_userpass($form->{$key_u}, $form->{$key_p})) {
      my $has_cookies = scalar keys %$cookies;
      my $user  = $form->{$key_u};
      my $str   = encode_base64(join(":", delete($form->{$key_u}), delete($form->{$key_p})), "");
      my $key_s = $self->key_save;
      $self->set_cookie($str, delete($form->{$key_s}));
      #return $self->success($user); # assume that cookies will work - if not next page will cause login
      #### this may actually be the nicer thing to do in the common case - except for the nasty looking
      #### url - all things considered - should really get location boucing to work properly while being
      #### able to set a cookie at the same time

      if ($has_cookies) {
        return $self->success($user); # assuming if they have cookies - the one we set will work
      } else {
        $form->{$key_chk} = time();
        my $key_r = $self->key_redirect;
        if (! $form->{$key_r}) {
          my $script = $ENV{SCRIPT_NAME} || die "Missing SCRIPT_NAME";
          my $info   = $ENV{PATH_INFO} || '';
          my $query  = $self->cgix->make_form($form);
          $form->{$key_r} = $script . $info . ($query ? "?$query" : "");
        }
        $self->location_bounce($form->{$key_r});
        return 0;
      }
    } else {
      $had_form_info = 1;
      $self->delete_cookie;
    }

  ### otherwise look for an already set cookie
  } elsif ($cookies->{$key_c}) {
    my ($user, $pass) = split /:/, decode_base64($cookies->{$key_c}), 2;
    return $self->success($user) if $self->verify_userpass($user, $pass);
    $self->delete_cookie;

  ### cases to handle no cookies
  } elsif ($form->{$key_chk}) {
    my $value = delete $form->{$key_chk};
    if ($self->allow_htauth) {
      die "allow_htauth is not implemented - yet";
    } elsif (abs(time() - $value) < 3600) {
      # fail down to below where we ask for auth
      # this is assuming that all webservers in the cluster are within 3600 of each other
    } else {
      $self->hook_print("no_cookies", $form);
      return 0;
    }
  }

  ### oh - you're still here - well then - ask for login credentials
  my $key_r = $self->key_redirect;
  if (! $form->{$key_r}) {
    my $script = $ENV{SCRIPT_NAME} || die "Missing SCRIPT_NAME";
    my $info   = $ENV{PATH_INFO} || '';
    my $query  = $self->cgix->make_form($form);
    $form->{$key_r} = $script . $info . ($query ? "?$query" : "");
  }
  $form->{login_error} = $had_form_info;
  $self->hook_print("get_login_info", $form);
  return 0;
}

###----------------------------------------------------------------###

sub hook_print {
  my $self = shift;
  my $page = shift;
  my $form = shift;

  ### copy the form and add various pieces
  my $FORM = {%$form};
  $FORM->{payload}      = $self->payload;
  $FORM->{error}        = ($form->{login_error}) ? "Login Failed" : "";
  $FORM->{key_user}     = $self->key_user;
  $FORM->{key_pass}     = $self->key_pass;
  $FORM->{key_save}     = $self->key_save;
  $FORM->{key_redirect} = $self->key_redirect;
  $FORM->{form_name}    = $self->form_name;
  $FORM->{script_name}  = $ENV{SCRIPT_NAME};
  $FORM->{path_info}    = $ENV{PATH_INFO} || '';
  $FORM->{login_script} = $self->login_script($FORM);
  delete $FORM->{$FORM->{key_pass}};

  ### allow for custom hook
  if (my $meth = $self->{hook_print}) {
    $self->$meth($page, $FORM);
    return 0;
  }

  ### no hook - give basic functionality
  my $content;
  if ($page eq 'no_cookies') {
    $content = qq{<div style="border: 2px solid black;background:red;color:white">You do not appear to have cookies enabled.</div>};
  } elsif ($page eq 'get_login_info') {
    $content = $self->basic_login_page($FORM);
  } else {
    $content = "No content for page \"$page\"";
  }

  $self->cgix->print_content_type();
  print $content;
  return 0;
}

###----------------------------------------------------------------###

sub success {
  my $self = shift;
  my $user = shift;
  $self->{user} = $ENV{REMOTE_USER} = $user;
  $self->hook_success($user);
  return 1;
}

sub user {
  my $self = shift;
  return $self->{user};
}

sub hook_success {
  my $self = shift;
  my $user = shift;
  my $meth;
  if ($meth = $self->{hook_success}) {
    $self->$meth($user);
  }
}

###----------------------------------------------------------------###

sub delete_cookie {
  my $self  = shift;
  my $key_c = $self->key_cookie;
  $self->cgix->set_cookie({
    -name    => $key_c,
    -value   => '',
    -expires => '-10y',
    -path    => '/',
  });
}      

sub set_cookie {
  my $self  = shift;
  my $key_c = $self->key_cookie;
  my $value = shift || '';
  my $save_pass = shift;
  $self->cgix->set_cookie({
    -name    => $key_c,
    -value   => $value,
    ($save_pass ? (-expires => '+10y') : ()),
    -path    => '/',
  });
}

sub location_bounce {
  my $self = shift;
  my $url = shift;
  return $self->cgix->location_bounce($url);
}

###----------------------------------------------------------------###

sub key_logout {
  my $self = shift;
  $self->{key_logout} = shift if $#_ != -1;
  return $self->{key_logout} ||= 'logout';
}

sub key_cookie {
  my $self = shift;
  $self->{key_cookie} = shift if $#_ != -1;
  return $self->{key_cookie} ||= 'ce_auth';
}

sub key_cookie_check {
  my $self = shift;
  $self->{key_cookie_check} = shift if $#_ != -1;
  return $self->{key_cookie_check} ||= 'ccheck';
}

sub key_user {
  my $self = shift;
  $self->{key_user} = shift if $#_ != -1;
  return $self->{key_user} ||= 'ce_user';
}

sub key_pass {
  my $self = shift;
  $self->{key_pass} = shift if $#_ != -1;
  return $self->{key_pass} ||= 'ce_pass';
}

sub key_save {
  my $self = shift;
  $self->{key_save} = shift if $#_ != -1;
  return $self->{key_save} ||= 'ce_save';
}

sub key_redirect {
  my $self = shift;
  $self->{key_redirect} = shift if $#_ != -1;
  return $self->{key_redirect} ||= 'redirect';
}

sub form_name {
  my $self = shift;
  $self->{form_name} = shift if $#_ != -1;
  return $self->{form_name} ||= 'ce_form';
}

sub allow_htauth {
  my $self = shift;
  $self->{allow_htauth} = shift if $#_ != -1;
  return $self->{allow_htauth} ||= 0;
}

sub payload {
  my $self = shift;
  my $user = shift;
  my $time = shift || time();
  my $meth;
  my @payload = ($time);
  if ($meth = $self->{hook_payload}) {
    push @payload, $self->$meth($user);
  }
  return join "/", @payload;
}

###----------------------------------------------------------------###

sub verify_userpass {
  my $self = shift;
  my $user = shift;
  my $pass = shift;
  my $host = shift || $self->host;
  my $meth;
  if ($meth = $self->{hook_verify_userpass}) {
    return $self->$meth($user, $pass, $host);
  } else {
    return $self->hook_verify_userpass($user, $pass, $host);
  }
}

sub hook_verify_userpass {
  my $self = shift;
  my $user = shift;
  my $pass_test = shift;
  my $host = shift || $self->host;

  return undef if ! defined $user;
  return undef if ! defined $pass_test;
  my $pass_real = $self->hook_get_pass_by_user($user, $host);
  return undef if ! defined $pass_real;

  my $type_real = ($pass_real =~ m/^(md5|sha1)\((.+)\)$/) ? $1 : 'plainorcrypt';
  my $hash_real = $2;
  my $type_test = ($pass_test =~ m/^(md5|sha1)\((.+)\)$/) ? $1 : 'plainorcrypt';
  my $hash_test = $2;

  ### if both types were plaintext - check if the equal
  if ($type_real eq 'plainorcrypt'
      && $type_test eq 'plainorcrypt') {
    return 1 if $pass_real eq $pass_test;
    if ($CHECK_CRYPTED && $pass_real =~ m|^([./0-9A-Za-z]{2})(.{,11})$|) {
      return 1 if crypt($pass_test, $1) eq $pass_real;
    }
    return 0;

  } else {
    ### if test type is plaintext - then hash it and compare it alone
    if ($type_test eq 'plainorcrypt') {
      $pass_test = $self->enc_func($type_real, $pass_test); # encode same as real
      $pass_test = "$type_real($pass_test)";
      return $pass_test eq $pass_real;

    ### if real type is plaintext - then hash it to get ready for test
    } elsif ($type_real eq 'plainorcrypt') {
      $pass_real = $self->enc_func($type_test, $pass_real);
      $pass_real = "$type_test($pass_real)";
      $type_real = $type_test;
    }
    
    ### the types should be the same (unless a system stored sha1 and md5 passwords)
    if ($type_real ne $type_test) {
      warn "Test types for user \"$user\" are of two different types - very bad";
      return 0;
    }

    ### no payload - compare directly
    if ($hash_test !~ m|^(.+)/([^/]+)$|) {
      return lc($pass_test) eq lc($pass_real);

    ### and finally - check the payload (allows for expiring login)
    } else {
      my $payload = $1; # payload can be anything
      my $compare = $2; # a checksum which is the enc of the payload + '/' + enc of password
      my @payload = split /\//, $payload;

      return 0 if $self->enc_func($type_test, "$payload/$hash_real") ne $compare;

      ### if no save password && greater than expire time- expire
      if ($EXPIRE_LOGINS && ! $payload[1] && $payload[0] =~ m/^(\d+)/) {
        return 0 if time() > $1 + $EXPIRE_LOGINS;
      }
      return 1;
    }
  }
  return 0; # nothing should make it this far
}

sub enc_func {
  my $self = shift;
  my $type = shift;
  my $str  = shift;
  if ($type eq 'md5') {
    require Digest::MD5;
    return &Digest::MD5::md5_hex($str);
  } elsif ($type eq 'sha1') {
    require Digest::SHA1;
    return &Digest::SHA1::sha1_hex($str);
  }
}

sub set_hook_get_pass_by_user {
  my $self = shift;
  $self->{hook_get_pass_by_user} = shift;
}

sub hook_get_pass_by_user {
  my $self = shift;
  my $user = shift;
  my $host = shift || $self->host;
  my $meth;
  if ($meth = $self->{hook_get_pass_by_user}) {
    return $self->$meth($user, $host);
  }
  die "hook_get_pass_by_user is a virtual method - please override - or use set_hook_get_pass_by_user";
}

###----------------------------------------------------------------###

sub cgix {
  my $self = shift;
  $self->{cgix} = shift if $#_ != -1;
  return $self->{cgix} ||= do {
    require CGI::Ex;
    CGI::Ex->new(); # return of the do
  };
}

sub form {
  my $self = shift;
  if ($#_ != -1) {
    $self->{form} = shift || die "Invalid form";
  }
  return $self->{form} ||= $self->cgix->get_form;
}

sub cookies {
  my $self = shift;
  if ($#_ != -1) {
    $self->{cookies} = shift || die "Invalid cookies";
  }
  return $self->{cookies} ||= $self->cgix->get_cookies;
}

sub host {
  my $self = shift;
  return $self->{host} = shift if $#_ != -1;
  return $self->{host} ||= do {
    my $host = $ENV{HTTP_HOST} || die "Missing \$ENV{HTTP_HOST}";
    $host = lc($host);
    $host =~ s/:\d*$//;      # remove port number
    $host =~ s/\.+$//;       # remove qualified dot
    $host =~ s/[^\w\.\-]//g; # remove odd characters
    $host; # return of the do
  };
}

###----------------------------------------------------------------###

sub basic_login_page {
  my $self = shift;
  my $form = shift;

  my $text = $self->basic_login_template();
  $self->cgix->swap_template(\$text, $form);
  $self->cgix->fill(\$text, $form);

  return $text;
}

sub basic_login_template {
  return qq{
    [% header %]
    <div align="center">
    <span class="error" style="color:red">[% error %]</span>
    <form name="[% form_name %]" method="get" action="[% script_name %]">
    <table border="0" class="login_table">
    <tr>
      <td>Username:</td>
      <td><input name="[% key_user %]" type="text" size="30" value=""></td>
    </tr>
    <tr>
      <td>Password:</td>
      <td><input name="[% key_pass %]" type="password" size="30" value=""></td>
    </tr>
    <tr>
      <td colspan="2">
        <input type="checkbox" name="[% key_save %]" value="1"> Save Password ?
      </td>
    </tr>
    <tr>
      <td colspan="2" align="right">
        <input type="hidden" name="[% key_redirect %]">
        <input type="hidden" name="payload">
        <input type="submit" value="Submit">
      </td>
    </tr>
    [% extra_table %]
    </table>
    </form>
    </div>
    [% login_script %]
    [% footer %]
  };
}

sub login_type {
  my $self = shift;
  if ($#_ != -1) {
    $self->{login_type} = defined($_[0]) ? lc(shift) : undef;
  }
  $self->{login_type} = do {
    my $type;
    if ($USE_PLAINTEXT) {
      $type = '';
    } elsif (eval {require Digest::SHA1}) {
      $type = 'sha1';
    } elsif (eval {require Digest::MD5}) {
      $type = 'md5';
    } else {
      $type = "";
    }
    $type; # return of the do
  } if ! defined $self->{login_type};
  return $self->{login_type};
}


sub login_script {
  my $self = shift;
  my $form = shift;
  my $type = $self->login_type;
  return if ! $type || $type !~ /^(sha1|md5)$/;

  return qq{
    <script src="$form->{script_name}/js/CGI/Ex/$type.js"></script>
    <script>
    function send_it () {
      var f = document.$form->{form_name};
      var s = (f.$form->{key_save}.checked) ? 1 : 0;
      var l = f.payload.value + '/' + s;
      var r = f.$form->{key_redirect}.value;
      var q = document.$form->{form_name}.action;
      var sum = document.${type}_hex(l+'/'+document.${type}_hex(f.$form->{key_pass}.value));
      q += '?$form->{key_user}='+escape(f.$form->{key_user}.value);
      q += '&$form->{key_save}='+escape(s);
      q += '&$form->{key_pass}='+escape('$type('+l+'/'+sum+')');
      location.href = q;
      return false;
    }
    if (document.${type}_hex) document.$form->{form_name}.onsubmit = function () { return send_it() }
    </script>
  };
}

###----------------------------------------------------------------###

### return arguments to add on to a url to allow login (for emails)
sub auth_string_sha1 {
  my $self = shift;
  my $user = shift;
  my $pass = shift;
  my $save = shift || 0;
  my $time = shift || time;
  my $payload = $self->payload($time);

  require Digest::SHA1;

  if ($pass =~ /^sha1\((.+)\)$/) {
    $pass = $1;
  } else {
    $pass = &Digest::SHA1::sha1_hex($pass);
  }
  $pass = &Digest::SHA1::sha1_hex("$payload/$save/$pass");

  return $self->cgix->make_form({
    $self->key_user => $user,
    $self->key_pass => "sha1($payload/$save/$pass)",
    $self->key_save => $save,
  });
}

###----------------------------------------------------------------###

1;

__END__

=head1 NAME

CGI::Ex::Auth - Handle logins nicely.

=head1 SYNOPSIS

  ### authorize the user
  my $auth = $self->auth({
    hook_get_pass_by_user => \&get_pass_by_user,
    hook_print            => \&my_print,
    login_type            => 'sha1',
  });
  ### login_type may be sha1, md5, or plaintext


  sub get_pass_by_user {
    my $auth = shift;
    my $username = shift;
    my $host = shift;
    my $password = some_way_of_getting_password;
    return $password;
  }

  sub my_print {
    my $auth = shift;
    my $step = shift;
    my $form = shift; # form includes login_script at this point
    my $content = get_content_from_somewhere;
    $auth->cgix->swap_template(\$content, $form);
    $auth->cgix->print_content_type;
    print $content;
  }

=head1 DESCRIPTION

CGI::Ex::Auth allows for autoexpiring, safe logins.  Auth uses
javascript modules that perform SHA1 and MD5 encoding to encode
the password on the client side before passing them through the
internet.

If SHA1 is used the storage of the password can be described by
the following code:

  my $pass = "plaintextpassword";
  my $save = ($save_the_password) ? 1 : 0;
  my $time = time;
  my $store = sha1_hex("$time/$save/" . sha1_hex($pass));

This allows for passwords to be stored as sha1 in a database.
Passwords stored in the database this way are still susceptible to bruteforce
attack, but are much more secure than storing plain text.

If MD5 is used, the above procedure is replaced with md5_hex.

A downside to this module is that it does not use a session to preserve state
so authentication has to happen on every request.  A plus is that you don't
need to use a session.  With later releases, a method will be added to allow
authentication to look inside of a stored session somewhat similar to
CGI::Session::Auth.

=head1 METHODS

=over 4

=item C<new>

Constructor.  Takes a hash or hashref of properties as arguments.

=item C<init>

Called automatically near the end of new.

=item C<require_auth>

Performs the core logic.  Returns true on successful login.
Returns false on failed login.  If a false value is returned,
execution of the CGI should be halted.  require_auth WILL
NOT automatically stop execution.

  $auth->require_auth || exit;

=item C<hook_print>

Called if login failed.  Defaults to printing a very basic page.
You will want to override it with a template from your own system.
The hook that is called will be passed the step to print (currently
only "get_login_info" and "no_cookies"), and a hash containing the
form variables as well as the following:

  payload      - $self->payload
  error        - The error that occurred (if any)
  key_user     - $self->key_user;
  key_pass     - $self->key_pass;
  key_save     - $self->key_save;
  key_redirect - $self->key_redirect;
  form_name    - $self->form_name;
  script_name  - $ENV{SCRIPT_NAME}
  path_info    - $ENV{PATH_INFO} || ''
  login_script - $self->login_script($FORM); # The javascript that does the login

=item C<success>

Method called on successful login.  Sets $self->user as well as $ENV{REMOTE_USER}.

=item C<user>

Returns the user that was successfully logged in (undef if no success).

=item C<hook_success>

Called from success.  May be overridden or a subref may be given as a property.

=item C<key_logout>

If a key is passed the form hash that matches this key, the current user will
be logged out.  Default is "logout".

=item C<key_cookie>

The name of the auth cookie.  Default is "ce_auth".

=item C<key_cookie_check>

A field name used during a bounce to see if cookies exist.  Default is "ccheck".

=item C<key_user>

The form field name used to pass the username.  Default is "ce_user".

=item C<key_pass>

The form field name used to pass the password.  Default is "ce_pass".

=item C<key_save>

The form field name used to pass whether they would like to save the cookie for
a longer period of time.  Default is "ce_save".  The value of this form field
should be 1 or 0.  If it is zero, the cookie installed will be a session cookie
and will expire in $EXPIRE_LOGINS seconds (default of 6 hours).

=item C<form_name>

The name of the html login form to attach the javascript to.  Default is "ce_form".

=item C<payload>

Additional variables to store in the cookie.  Can be used for anything.  Should be
kept small.  Default is time (should always use time as the first argument).  Used
for autoexpiring the cookie and to prevent bruteforce attacks.

=item C<verify_userpass>

Called to verify the passed form information or the stored cookie.  Calls hook_verify_userpass.

=item C<hook_verify_userpass>

Called by verify_userpass.  Arguments are the username, cookie or info to be tested,
and the hostname.  Default method calls hook_get_pass_by_user to get the real password.
Then based upon how the real password is stored (sha1, md5, plaintext, or crypted) and
how the login info was passed from the html form (or javascript), will attempt to compare
the two and return success or failure.  It should be noted that if the javascript method
used is SHA1 and the password is stored crypted or md5'ed - the comparison will not work
and the login will fail.  SHA1 logins require either plaintext password or sha1 stored passwords.
MD5 logins require either plaintext password or md5 stored passwords.  Plaintext logins
allow for SHA1 or MD5 or crypted or plaintext storage - but should be discouraged because
they are plaintext and the users password can be discovered.

=item C<hook_get_pass_by_user>

Called by hook_verify_userpass.  Arguments are the username and hostname.  Should return
a sha1 password, md5 password, plaintext password, or crypted password depending
upon which system is being used to get the information from the user.

=item C<set_hook_get_pass_by_user>

Allows for setting the subref used by hook_get_pass_by_user.x

=item C<cgix>

Returns a CGI::Ex object.

=item C<form>

A hash of passed form info.  Defaults to CGI::Ex::get_form.

=item C<cookies>

The current cookies.  Defaults to CGI::Ex::get_cookies.

=item C<host>

What host are we on.  Defaults to a cleaned $ENV{HTTP_HOST}.

=item C<basic_login_page>

Calls the basic_login_template, swaps in the form variables (including
form name, login_script, etc).  Then prints content_type, the content, and
returns.

=item C<basic_login_template>

Returns a bare essentials form that will handle the login.  Has place
holders for all of the form name, and login variables, and errors and
login javascript.  Variable place holders are of the form
[% login_script %] which should work with Template::Toolkit or CGI::Ex::swap_template.

=item C<login_type>

Either sha1, md5, or plaintext.  If global $USE_PLAINTEXT is set,
plaintext password will be used.  login_type will then look for
Digest::SHA1, then Digest::MD5, and then fail to plaintext.

SHA1 comparison will work with passwords stored as plaintext password,
or stored as the string "sha1(".sha1_hex($password).")".

MD5 comparison will work with passwords stored as plaintext password,
or stored as the string "md5(".md5_hex($password).")".

Plaintext comparison will work with passwords stored as sha1(string),
md5(string), plaintext password string, or crypted password.

=item C<login_script>

Returns a chunk of javascript that will encode the password before
the html form is ever submitted.  It does require that $ENV{PATH_TRANSLATED}
is not modified before calling the require_auth method so that any
external javascript files may be served (also by the require_auth).

=item C<auth_string_sha1>

Arguments are username, password, save_password, and time.  This will
return a valid login string.  You probably will want to pass 1 for the
save_password or else the login will only be good for 6 hours.

  my $login = $self->auth->auth_string_sha1($user, $pass, 1);
  my $url   = "http://$ENV{HTTP_HOST}$ENV{SCRIPT_NAME}?$login";

=head1 TODO

Using plaintext allows for the password to be passed in the querystring.
It should at least be Base64 encoded.  I'll add that soon - BUT - really
you should be using the SHA1 or MD5 login types.

=head1 AUTHORS

Paul Seamons <perlspam at seamons dot com>

=cut
