import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
  name: "compact"
})
export class CompactPipe implements PipeTransform {
  transform(value: any, arg1: any): any {
    return this.showCompactFolderPath(value, arg1);
  }

  showCompactFolderPath(folderPath: string, mark: number) {
    let length = folderPath.length;
    let middle = " ..... ";
    if (length > 33) {
      let x = folderPath.substring(0, mark) + middle + folderPath.substring(length - mark, length);
      return x;
    }
    return folderPath;
  }
}
