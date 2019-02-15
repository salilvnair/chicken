import { Component, OnInit } from '@angular/core';
import { SharedData } from '../shared/shared-data.service';
import { BashUtil } from '../helper/bash';
import { GitUtil } from '../helper/gitutil';
import { GitLogModel } from '../helper/model/git-log.model';
import { ElectronService } from 'ngx-electron';
import { MacBashUtil } from '../helper/macos';
import { WindowsBashUtil } from '../helper/windows';
import { ThreadUtil } from '../helper/thread.util';
@Component({
  selector: 'git-cherrypick',
  templateUrl: './git-cherrypick.component.html',
  styleUrls: ['./git-cherrypick.component.css']
})
export class GitCherrypickComponent implements OnInit {
  branchList: string[] = [];
  bashUtil: BashUtil;
  gitRootPath: string;
  selectedSourceBranch:string;
  sourceLogList:GitLogModel[];
  constructor(
    private sharedData: SharedData,
    ) { }

  ngOnInit() {

  }

  
}
