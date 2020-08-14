const execFile = require('child_process').execFile;

exports.main = function(data){
    let d = data[0].title.toString().replace(/[&:|"'\r\n]/g, " ");
    execFile('cmd',  ['/c', 'start', 'cmd', '/c', `echo Title = ${d} & pause`]);
    //execFile('cmd',  ['/c', 'start', 'powershell', '-c', 'echo xxx; Read-Host "Hit Return"']);
    //execFile('notepad.exe');
    return data;
}