// [10:35:28] huned@omg:distributed $ node main.js --port=8000 --name=huned --host=10.0.1.30 --server=x

var net = require('net')
var EventEmitter = require('events').EventEmitter
var opts = require('optimist').argv
var MessageStream = require('message-stream')

var myIp = require('my-local-ip')()
var port = opts.port
var serverPort = opts.server
var clientPort = opts.port
var host = opts.host || myIp

var id = myIp + ':' + port

// chat object
function Chat(id, name) {
  var chat = new EventEmitter()

  // chat.send() -- emit a 'message' event
  chat.send = function(text) {
    chat.emit("message", {
      ts: Date.now(),
      id: id,
      name: name,
      text: text
    })
  }

  // chat.createStream() -- 
  chat.createStream = function() {

    var stream = MessageStream(function(message) {
      chat.emit('message', message, stream);
    });

    chat.on('message', function(message, source) {
      if (stream !== source) stream.queue(message)
    });

    // return stream
    return stream;
  }

  // return chat object
  return chat;
}

// instantiate a chat object
var chat = Chat(id, opts.name || 'Anonymous')

// when i type stuff, call chat.send()
process.stdin.on('data', function(buffer) {
  chat.send(buffer.toString())
})

// when i receive a message event, echo it to my screen
chat.on('message', function(message) {
  console.log(message.name, '>', message.text);
})

// start a server
net.createServer(function(stream) {
  // what's going on here?
  stream.pipe(chat.createStream()).pipe(stream)
}).listen(serverPort, host)
console.log('started server on', serverPort, host);

// connect function
var connect = function() {
  var client = net.connect(clientPort, host);
  client.pipe(chat.createStream()).pipe(client);
  console.log('connected to', clientPort, host);

  // define reconnect()
  var reconnect = function() {
    client.removeAllListeners()
    setTimeout(connect, 1000)
  }

  // reconnect() on error, end
  client.on('error', reconnect);
  client.on('end', reconnect);
}

// invoke connect
connect();
