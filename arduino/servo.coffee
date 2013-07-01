five = require('johnny-five')

five.Board().on 'ready', ->
  button = new five.Button(8)
  #led = new five.Led(13)
  servo = new five.Servo(10)
  servo.center()

  button.on 'down', ->
    servo.move(180)

  button.on 'up', ->
    servo.move(0)
