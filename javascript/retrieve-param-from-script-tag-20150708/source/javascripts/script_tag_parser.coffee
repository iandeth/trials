window.ScriptTagParser = class ScriptTagParser
  @getCurrentScript: ()->
    scripts = document.getElementsByTagName('script')
    return scripts[scripts.length - 1]

  getSiteJsMatcher: ()->
    return /\/all(-[^.]+)?\.js/

  getCurrentScript2: (regexp)->
    $('ul').append("<li>---</li>")
    $('script').each (i, s)->
      $('ul').append("<li>script #{i+1}: #{s.src}</li>")
    $('ul').append("<li>---</li>")
    _cur_script = undefined
    $('script').each (i, script) ->
      _cur_script = script if script['src']?.match regexp
    return _cur_script

  getParamByName: (name, script=undefined)->
    script = current_script unless script
    #$('ul').append('<li>' + current_script + '</li>')
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]")
    regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
    results = regex.exec(script.src)
    if results == null
      return ""
    else
      return decodeURIComponent(results[1].replace(/\+/g, " "))

try
  current_script = undefined
  current_script = ScriptTagParser.getCurrentScript()
catch e
