import { BashUtil } from "./bash";
import { ElectronService } from "ngx-electron";
import { Subject } from "rxjs";
import { ThreadUtil } from "./thread.util";

export class WindowsBashUtil implements BashUtil {
  electronService: ElectronService;
  threadUtil:ThreadUtil;
  init(electronService: ElectronService,threadUtil:ThreadUtil) {
    this.electronService = electronService;
    this.threadUtil = threadUtil;
  }
  executeCommand(
    commandString: string,
    returnAsArray: boolean,
    includeLineBreak?: boolean
  ) {
    let cp = this.electronService.remote.require("child_process");
    let self = this;
    this.electronService.ipcRenderer.send("deleteWinProcess");
    return new Promise<any>(function(resolve, reject) {
      //process.platform = "linux";
      cp.exec(
        commandString,
        {
          env: { PATH: "C:\\progra~1\\git\\bin" },
          shell: "C:\\progra~1\\git\\bin\\bash.exe",
          maxBuffer: 1024 * 1024
        },
        (error: any, stdout: any, stderr: any) => {
          self.electronService.ipcRenderer.send("setWinProcess");
          if (error) {
            reject(error);
            return;
          } else if (stderr) {
            reject(stderr);
            return;
          }
          stdout = stdout.trim();
          //console.log(stdout);
          let stdoutArray: string[] = stdout.split(/\r?\n/);
          let newStdOut = "";
          let returnArray = [];
          //console.log(stdoutArray);
          stdoutArray.forEach((el, index) => {
            el = el.trim();
            returnArray.push(el);
            newStdOut = newStdOut + el;
          });
          if (returnAsArray) {
            resolve(returnArray);
            return;
          } else if (includeLineBreak) {
            resolve(newStdOut);
            return;
          } else {
            resolve(stdout);
            return;
          }
        }
      );
    });
  }

  execute(
    commandString: string,
    returnAsArray: boolean,
    includeLineBreak?: boolean
  ) {
    let cp = this.electronService.remote.require("child_process");
    let self = this;
    let executorSubject = new Subject<any>();
    this.electronService.remote.getCurrentWindow().removeAllListeners();
    this.electronService.ipcRenderer.send("deleteWinProcess");
    var executor = cp.exec(commandString, {
      env: { PATH: "C:\\progra~1\\git\\bin" },
      shell: "C:\\progra~1\\git\\bin\\bash.exe"
    });
    self.electronService.ipcRenderer.send("setWinProcess");
    executor.stdout.on('data', (data)=> {
      this.threadUtil.sleep(1000);
      let stdoutArray: string[] = data.split(/\r?\n/);
      let newStdOut = "";
      let returnArray = [];
      //console.log(stdoutArray);
      stdoutArray.forEach((el, index) => {
        el = el.trim();
        returnArray.push(el);
        newStdOut = newStdOut + el;
      });
      if (returnAsArray) {
        executorSubject.next(returnArray);
        return;
      } else if (includeLineBreak) {
        executorSubject.next(newStdOut);
      } else {
        executorSubject.next(data.toString());
      }
    });
    
    executor.stderr.on('data',  (data)=> {
      this.threadUtil.sleep(1000);
      let stdoutArray: string[] = data.split(/\r?\n/);
      let newStdOut = "";
      let returnArray = [];
      //console.log(stdoutArray);
      stdoutArray.forEach((el, index) => {
        el = el.trim();
        returnArray.push(el);
        newStdOut = newStdOut + el;
      });
      if (returnAsArray) {
        executorSubject.next(returnArray);
        return;
      } else if (includeLineBreak) {
        executorSubject.next(newStdOut);
      } else {
        executorSubject.next(data.toString());
      }
    });
    
    executor.on('exit', function (code) {
      executorSubject.next(code.toString());
      executorSubject.complete();
      //console.log('child process exited with code ' + code.toString());
    });
    return executorSubject.asObservable();
  }

}
