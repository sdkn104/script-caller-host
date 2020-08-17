// Copyright (C) 2020 hashedtomato3@gmail.com
// License: MIT 

// =================================================================
// ======= Native Message Protocol Handling ========================
// =================================================================

const fs = require('fs');
const execFile = require('child_process').execFile;


// get a message and call handleMessage()
process.stdin.on('readable', () => {
  var input = []
  var chunk
  while (chunk = process.stdin.read()) {
    input.push(chunk)
  }
  input = Buffer.concat(input)

  var msgLen = input.readUInt32LE(0)
  var dataLen = msgLen + 4

  if (input.length >= dataLen) {
    var content = input.slice(4, dataLen)
    var json = JSON.parse(content.toString())
    handleMessage(json)
  }
})

// send a message to the extension
function sendMessage(msg) {
  var buffer = Buffer.from(JSON.stringify(msg))
  var header = Buffer.alloc(4)
  header.writeUInt32LE(buffer.length, 0)
  var data = Buffer.concat([header, buffer])
  process.stdout.write(data)
}


// =================================================================
// ======= User Functions ==========================================
// =================================================================

// on error
process.on('uncaughtException', (err) => {
  sendMessage({uncaughtException: err.toString()})
})


// message handling
function handleMessage(msg) {
  try {
    if( msg.cmd === "get-options") { // config data requested
      let response = {}
      // load JSON file
      let browserAction = require("./customize/browserAction.json")
      // replace icon image file name with icon data URL
      if( browserAction.icon ) {
        var mime = 'image/png'; 
        var encoding = "base64";
        var data = fs.readFileSync(browserAction.icon).toString(encoding); 
        var url = 'data:' + mime + ';' + encoding + ',' + data; 
        browserAction.icon = url;
      }
      // set browserAction to response
      response.browserAction = browserAction;
      // set injection code to response
      if( ! ("menu" in browserAction) ) {
        throw new Error("menu key not found in browserAction.json")
      }
      response.injectionCode = []
      browserAction.menu.forEach(function(elem, idx){
        let file = elem.injectionScript
        let filename = "./customize/"+file
        if( file && fs.existsSync(filename)){
          let text = fs.readFileSync(filename, {encoding:"utf-8"})
          response.injectionCode[idx] = text
        }
      })
      // send response
      sendMessage(response);
    } else if(msg.cmd === "click") { // menu item clicked
      // load native code
      let file = browserAction.menu[msg.idx];
      let filename = "./customize/"+file
      let r = null
      // execute native code
      if( fs.existsSync(filename)){
        r = require(filename).main(msg.injectionCodeResults);
      }
      sendMessage({response: r})
    } else {
    }
  } catch(err) {
    sendMessage({error:err.name, message:err.message, stack:err.stack})
  }
}
