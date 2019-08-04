$('a.img').on('click', function() {
  var id = $(this).attr('id');
  var text;

  if (id == 'dora') {
    text = 'どこでもドア';
  } else if (id == 'jiba') {
    text = 'ひゃくれつ肉球';
  }

  $('h1').text(text);
  return false;
});
