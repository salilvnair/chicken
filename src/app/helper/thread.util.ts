import { Injectable } from "@angular/core";

@Injectable()
export class ThreadUtil {
    async sleep(ms:number) {
        await this._sleep(ms);
    }

    private _sleep(ms:number){
        return new Promise(resolve => setTimeout(resolve, ms));
      }
}