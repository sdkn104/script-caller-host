// Native Code
//
// function main should be defined
// argument of main is the value returned by injection code
// return value from main will be passed to caller in the browser extension

const execFile = require('child_process').execFile;

exports.main = function(injectionCodeResults) {

    let d = injectionCodeResults[0].title.toString().replace(/[&:|"'\r\n]/g, " ");
    execFile('cmd',  ['/c', 'start', 'cmd', '/c', `echo Title = ${d} & pause`]);
    
    //execFile('cmd',  ['/c', 'start', 'powershell', '-c', 'echo xxx; Read-Host "Hit Return"']);
    //execFile('notepad.exe');
    
    return {result:"success"};  // return to browser extension
}
