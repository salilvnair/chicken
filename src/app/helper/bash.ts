import { ElectronService } from "ngx-electron";
import { ThreadUtil } from "./thread.util";

export interface BashUtil {
  init(electronService: ElectronService,threadUtil:ThreadUtil): void;
  executeCommand(
    commandString: string,
    returnAsArray: boolean,
    includeLineBreak?: boolean
  ): Promise<any>;
}
