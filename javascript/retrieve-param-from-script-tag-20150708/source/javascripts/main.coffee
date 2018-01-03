if (!window.console)
  console = { log: ()-> }

  #$('head').append('<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js?dweee=123"></script>')

$(()->
  p = new ScriptTagParser()

  # version 1
  #v = p.getParamByName('qux')
  # version 2
  regexp = p.getSiteJsMatcher()
  script = p.getCurrentScript2(regexp)
  v = p.getParamByName('qux', script)

  if v
    $('ul').append("<li>current script: qux=#{v}</li>")
    $('body').addClass('success')
  else
    $('body').addClass('failure')
)
