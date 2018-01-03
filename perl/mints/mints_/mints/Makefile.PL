

use ExtUtils::MakeMaker;
# See lib/ExtUtils/MakeMaker.pm for details of how to influence
# the contents of the Makefile that is written.
WriteMakefile(
    NAME         => 'Mints',
    VERSION_FROM => 'lib/Mints.pm', # finds \$VERSION
    AUTHOR       => 'Toshimasa Ishibashi (iandeth99@ybb.ne.jp)',
    ABSTRACT     => 'simple, easy-to-install MVC framework for web app\'s',
    PREREQ_PM    => {
                     'Test::Simple' => 0.44,
                    },
);
