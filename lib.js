const tmp = require("tmp");
const fs = require("fs");
const spawn  = require('child_process').spawn;



function openInTerminal(command, cwd){
    return new Promise((resolve, reject) => {
        switch(process.platform){
            case 'darwin': return _execDarwin(command, cwd, resolve);
            case 'win32': return _execWindows(command, cwd, resolve);
            case 'linux': return _execLinux(command, cwd, resolve);
            default: return reject("Unknown platform: " + process.platform)
        }
    })
}
function _execDarwin(command, cwd, resolve){
    const file = tmp.tmpNameSync({postfix: 'command'});
    const cmd = (cwd ? "cd \"" + cwd + "\" && " : "") + command
    fs.writeFileSync(file, cmd);
    fs.chmod(file,0o775, function(){
        const proc = spawn("open " + file, {
            shell: true
        });
        proc.on("exit", function(){
            console.log("Exit");
            resolve();
        })
    });

}

function _execLinux(command, cwd, resolve){
    const cmd = (cwd ? "cd \"" + cwd + "\" && " : "") + command
    spawn("gnome-terminal -x bash -c \"" + cmd + "\"");
    resolve();
}

function _execWindows(command, cwd, resolve){
    const file = tmp.tmpNameSync({postfix: 'bat'});
    const cmd = (cwd ? "cd \"" + cwd + "\" && " : "") + command
    fs.writeFileSync(file, cmd);
    fs.chmod(file,0o775, function(){
        const proc = spawn("start cmd.exe /K " + file, {
            shell: true
        });
        proc.on("exit", function(){
            console.log("Exit");
            resolve();
        })
    });
}

module.exports = openInTerminal;