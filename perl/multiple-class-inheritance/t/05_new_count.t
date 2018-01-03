use Test::More tests=>16;
use strict;
use NormalPerl::Chintai::Field::Text;
use C3::Chintai::Field::Text;

## count how many times each parent class' new() 
## is being called behind.
{
    NormalPerl::Chintai::Field::Text->new;
    is $NormalPerl::Creyle2::Field::NEW_COUNT, 2;   # yes, this is the downside of this solution
    is $NormalPerl::Creyle2::Field::Text::NEW_COUNT, 1;
    is $NormalPerl::Chintai::Field::NEW_COUNT, 1;
    is $NormalPerl::Chintai::Field::Text::NEW_COUNT, 1;
    NormalPerl::Chintai::Field::Text->new;
    is $NormalPerl::Creyle2::Field::NEW_COUNT, 4;   # oh no
    is $NormalPerl::Creyle2::Field::Text::NEW_COUNT, 2;
    is $NormalPerl::Chintai::Field::NEW_COUNT, 2;
    is $NormalPerl::Chintai::Field::Text::NEW_COUNT, 2;
}
{
    C3::Chintai::Field::Text->new;
    is $C3::Creyle2::Field::NEW_COUNT, 1;   # problem solved with Class::C3
    is $C3::Creyle2::Field::Text::NEW_COUNT, 1;
    is $C3::Chintai::Field::NEW_COUNT, 1;
    is $C3::Chintai::Field::Text::NEW_COUNT, 1;
    C3::Chintai::Field::Text->new;
    is $C3::Creyle2::Field::NEW_COUNT, 2;
    is $C3::Creyle2::Field::Text::NEW_COUNT, 2;
    is $C3::Chintai::Field::NEW_COUNT, 2;
    is $C3::Chintai::Field::Text::NEW_COUNT, 2;
}
