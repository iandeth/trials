# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

Category.create([
  { id:1, name:'PHP',  sort_order:1 },
  { id:2, name:'Perl', sort_order:2 },
  { id:3, name:'Ruby', sort_order:3 }
]);

Tag.create([
  { id:1, name:'Red' },
  { id:2, name:'Blue' },
  { id:3, name:'Green' },
  { id:4, name:'White' },
]);

Label.create([
  { id:1, name:'Good', sort_order:1 },
  { id:2, name:'Better', sort_order:2 },
  { id:3, name:'Poor', sort_order:3 },
  { id:4, name:'Worst', sort_order:4 },
]);
