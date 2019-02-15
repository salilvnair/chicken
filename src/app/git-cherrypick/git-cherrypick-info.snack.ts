import { Component, Inject } from "@angular/core";
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from "@angular/material";

@Component({
    selector: 'cherry-pick-info',
    templateUrl: 'cherry-pick-info.snack.html',
    styleUrls:['cherry-pick-info.snack.css']
  })
  export class GitCherryPickInfoSnack {
    constructor(
      public snackBarRef:MatSnackBarRef<GitCherryPickInfoSnack>,
      @Inject(MAT_SNACK_BAR_DATA) public data: any
      ){}

      onClickClose(){
        this.snackBarRef.dismiss();
      }
  }