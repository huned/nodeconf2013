five = require('johnny-five')

five.Board().on 'ready', ->
  button = new five.Button(8)
  led = new five.Led(13)

  button.on 'down', -> led.on()
  button.on 'up', -> led.off()
