import { BashUtil } from "./bash";
import { ElectronService } from "ngx-electron";
import { ThreadUtil } from "./thread.util";

export class MacBashUtil implements BashUtil {
  electronService: ElectronService;
  init(electronService: ElectronService,threadUtil:ThreadUtil) {
    this.electronService = electronService;
  }
  executeCommand(
    commandString: string,
    returnAsArray: boolean,
    includeLineBreak?: boolean
  ) {
    let cp = this.electronService.remote.require("child_process");
    return new Promise<any>((resolve, reject) => {
      cp.exec(commandString, (error: any, stdout: any, stderr: any) => {
        if (error) {
          reject(error);
          return;
        } else if (stderr) {
          reject(stderr);
          return;
        }
        stdout = stdout.trim();
        let stdoutArray: string[] = stdout.split(/\r?\n/);
        let newStdOut = "";
        let returnArray = [];
        stdoutArray.forEach((el, index) => {
          el = el.trim();
          if (stdoutArray.length - 1 != index) {
            returnArray.push(el);
          } else {
            newStdOut = newStdOut + el;
          }
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
      });
    });
  }
  executeCommandSync(commandString: string) {}
}
