import { Component, OnInit, ViewChild, ViewChildren, QueryList } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ElectronService } from "ngx-electron";
import { MacBashUtil } from "../helper/macos";
import { WindowsBashUtil } from "../helper/windows";
import { GitUtil } from "../helper/gitutil";
import { BashUtil } from "../helper/bash";
import { GitLogModel } from "../helper/model/git-log.model";
import { MatPaginator, MatTableDataSource, MatSort, MatCheckboxChange, MatSnackBar, MatCheckbox } from "@angular/material";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "@angular/animations";
import {
  GitCommitModel,
  GitCommitNameStatus
} from "../helper/model/git-commit.model";
import { SharedData } from "../shared/shared-data.service";
import { Router } from "@angular/router";
import { ThreadUtil } from "../helper/thread.util";
import { GitCherrypickComponent } from "../git-cherrypick/git-cherrypick.component";
import { GitCherryPickInfoSnack } from "../git-cherrypick/git-cherrypick-info.snack";
import { ChickenUtil } from "../helper/chicken.util";

const MODIFIED = "M";
const DELETED = "D";
const ADDED = "A";
const RENAMED = "R";
@Component({
  selector: "git-history",
  templateUrl: "./git-history.component.html",
  styleUrls: ["./git-history.component.css"],
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", display: "none" })
      ),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      )
    ])
  ]
})
export class GitHistoryComponent implements OnInit {
  expanded = false;
  expandedHash;
  bashUtil: BashUtil;
  date = new Date();
  gitRootPath: string;
  cherryPickInfo:any;
  authors = new FormControl();
  authorList: string[] = [];
  branchList: string[] = [];
  selectedCommitIds: string[] = [];
  selectedAuthors: string[] = [];
  selectedFromDate: string;
  selectedBranch: string = "master";
  selectedToDate: string;
  gitLogList: GitLogModel[] = [];
  dataSource: MatTableDataSource<GitLogModel>;
  expandedElement: GitCommitModel | null;
  columnsToDisplay: string[];
  gitCommitFileStatusCache = {};
  showMerges: boolean = false;
  onlyMerges: boolean = false;
  clipboard = "clipboard";
  copyButton = true;
  filterHashId: string;
  selectedFilterOption = "hidemerges";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('selectAllCommitCheckBox') selectAllCommitCheckBox: MatCheckbox;
  @ViewChildren(MatCheckbox) checkBoxes: QueryList<MatCheckbox>
  constructor(
    private electronService: ElectronService,
    private threadUtil:ThreadUtil,
    private sharedData: SharedData,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.init();
    if (this.sharedData.getGitRootPath()) {
      this.loadSharedData();
      this.loadGitHistory();
      this.loadGitRemoteBranches();
    }
  }
  loadSharedData() {
    this.selectedBranch = this.sharedData.getSelectedBranch();
    this.gitRootPath = this.sharedData.getGitRootPath();
  }
  prepareAuthorList(gitLogList: GitLogModel[]) {
    return Array.from(new Set(gitLogList.map(log => log.author)));
  }
  init() {
    this.loadBashUtil();
  }
  onChangeBranch() {
    this.loadGitHistory();
  }

  findGitRoot(dirPath: string) {
    var self = this;
    return GitUtil.getRootDirectory(dirPath, this.bashUtil);
  }
  loadBashUtil() {
    var bashUtil: BashUtil;
    var osvar = this.electronService.process.platform;
    //console.log(osvar);
    if (osvar == "darwin" || osvar == "linux") {
      bashUtil = new MacBashUtil();
      bashUtil.init(this.electronService,this.threadUtil);
    } else if (osvar == "win32") {
      bashUtil = new WindowsBashUtil();
      bashUtil.init(this.electronService,this.threadUtil);
    }
    this.bashUtil = bashUtil;
  }
  loadGitRemoteBranches() {
    var self = this;
    if (self.sharedData.getRemoteBranches()) {
      self.branchList = self.sharedData.getRemoteBranches();
    } else {
      GitUtil.getOriginRemoteBranches(this.gitRootPath, this.bashUtil).then(
        branches => {
          self.branchList = branches;
          self.sharedData.setRemoteBranches(self.branchList);
        }
      );
    }
  }
  loadGitHistory() {
    var self = this;
    GitUtil.retrieveGitLogs(
      this.gitRootPath,
      this.bashUtil,
      self.showMerges,
      self.onlyMerges,
      self.selectedBranch
    ).then(logs => {
      var gitLogJsonList = "[" + logs.join(",") + "]";
      //console.log(gitLogJsonList);
      var gitLogJsonDataList: GitLogModel[] = JSON.parse(gitLogJsonList);
      self.gitLogList = [];
      gitLogJsonDataList.forEach(element => {
        self.gitLogList.push(element);
      });
      self.authorList = self.prepareAuthorList(self.gitLogList);
      //self.gitLogList = gitLogJsonDataList;
      self.columnsToDisplay = [];
      self.columnsToDisplay = Object.keys(self.gitLogList[0]);
      ChickenUtil.remove(self.columnsToDisplay,"checked");
      self.dataSource = new MatTableDataSource<GitLogModel>();
      self.dataSource.data = self.gitLogList;
      //console.log(self.paginator);
      self.dataSource.paginator = self.paginator;
      self.dataSource.sort = self.sort;
      self.setFilterPredicate();
      //console.log(self.dataSource.filter);
      //console.log(self.dataSource);
    });
  }

  setFilterPredicate() {
    var self = this;
    self.dataSource.filterPredicate = (data: GitLogModel, filter: string) => {
      if (
        self.selectedFromDate &&
        self.selectedToDate &&
        self.selectedAuthors.length == 0
      ) {
        var fromDateSelected = new Date(this.selectedFromDate);
        var toDateSelected = new Date(this.selectedToDate);
        var objectDate = new Date(data.date);
        return (
          fromDateSelected.getTime() <= objectDate.getTime() &&
          toDateSelected.getTime() >= objectDate.getTime()
        );
      } else if (
        self.selectedFromDate &&
        self.selectedToDate &&
        self.selectedAuthors.length > 0
      ) {
        var fromDateSelected = new Date(this.selectedFromDate);
        var toDateSelected = new Date(this.selectedToDate);
        var objectDate = new Date(data.date);
        let selectedAuthor = self.selectedAuthors.filter(
          author => author === data.author
        );
        return (
          selectedAuthor.length > 0 &&
          fromDateSelected.getTime() <= objectDate.getTime() &&
          toDateSelected.getTime() >= objectDate.getTime()
        );
      } else if (self.selectedFromDate && self.selectedAuthors.length > 0) {
        //console.log("3");
        var fromDateSelected = new Date(this.selectedFromDate);
        var objectDate = new Date(data.date);
        let selectedAuthor = self.selectedAuthors.filter(
          author => author === data.author
        );
        return (
          selectedAuthor.length > 0 &&
          fromDateSelected.getTime() <= objectDate.getTime()
        );
      } else if (self.selectedFromDate && self.selectedAuthors.length == 0) {
        var fromDateSelected = new Date(this.selectedFromDate);
        var objectDate = new Date(data.date);
        return fromDateSelected.getTime() <= objectDate.getTime();
      } else if (self.selectedAuthors.length > 0) {
        //console.log("4");
        let selectedAuthor = self.selectedAuthors.filter(
          author => author === data.author
        );
        return selectedAuthor.length > 0 ? true : false;
      } else if (self.filterHashId) {
        return self.filterHashId === data.hash;
      }
      //console.log(self.selectedAuthors.length);
      return !filter || data.author == filter;
    };
  }

  isSortable(column) {
    if (column == "select" ||column == "hash" || column == "message") {
      return false;
    }
    return true;
  }
  selectRepo(event) {
    var self = this;
    if (event.target.files[0]) {
      let repoPath = event.target.files[0].path;
      this.findGitRoot(repoPath).then(gitRootPath => {
        self.sharedData.clear();
        self.gitRootPath = gitRootPath;
        self.sharedData.setGitRootPath(gitRootPath);
        self.selectedBranch = "all";
        self.loadGitHistory();
        self.loadGitRemoteBranches();
      });
      event.target.value = null;
    }
  }
  getBranchColor(branchName) {
    if (branchName) {
      if (branchName.indexOf("origin") > -1) {
        return "red";
      } else if (branchName == "all") {
        return "";
      }
    }
    return "blue";
  }

  getCommitFiles(hashId) {
    if (this.expanded && this.expandedHash === hashId) {
      this.expandedElement = null;
      this.expanded = false;
    } else {
      //console.log(hashId);
      var self = this;
      if (self.gitCommitFileStatusCache[hashId]) {
        self.expandedElement = self.gitCommitFileStatusCache[hashId];
      } else {
        GitUtil.getFileCommitStatus(
          hashId,
          this.gitRootPath,
          this.bashUtil
        ).then(value => {
          //console.log(value);
          self.expandedElement = self.prepareGitFileCommitStatus(hashId, value);
          self.gitCommitFileStatusCache[hashId] = { ...self.expandedElement };
          //console.log(self.gitCommitFileStatusCache);
        });
      }
      this.expandedHash = hashId;
      this.expanded = true;
    }
  }

  prepareGitFileCommitStatus(hashId: string, statusArray: string[]) {
    let gitCommitModel: GitCommitModel = new GitCommitModel();
    let gitCommitNameStatusList: GitCommitNameStatus[] = [];
    statusArray = statusArray.slice(0, 100);
    statusArray.forEach(fileStatus => {
      let gitCommitNameStatus: GitCommitNameStatus = new GitCommitNameStatus();
      if (fileStatus.charAt(0).indexOf(MODIFIED) > -1) {
        gitCommitNameStatus.fileStatus = "Modified";
        gitCommitNameStatus.shortStatus = MODIFIED;
        gitCommitNameStatus.color = "rgb(27, 128, 178)";
        fileStatus = fileStatus.replace(MODIFIED, "").trim();
      } else if (fileStatus.charAt(0).indexOf(ADDED) > -1) {
        gitCommitNameStatus.fileStatus = "Added";
        gitCommitNameStatus.shortStatus = ADDED;
        gitCommitNameStatus.color = "rgb(60, 135, 70)";
        fileStatus = fileStatus.replace(ADDED, "").trim();
      } else if (fileStatus.charAt(0).indexOf(DELETED) > -1) {
        gitCommitNameStatus.fileStatus = "Deleted";
        gitCommitNameStatus.shortStatus = DELETED;
        gitCommitNameStatus.color = "rgb(158, 18, 29)";
        fileStatus = fileStatus.replace(DELETED, "").trim();
      } else if (fileStatus.charAt(0).indexOf(RENAMED) > -1) {
        gitCommitNameStatus.fileStatus = "Renamed";
        gitCommitNameStatus.shortStatus = RENAMED;
        gitCommitNameStatus.color = "rgb(27, 128, 178)";
        fileStatus = fileStatus.replace(RENAMED + "100", "").trim();
      }
      gitCommitNameStatus.fileName = fileStatus;
      gitCommitNameStatusList.push(gitCommitNameStatus);
    });
    gitCommitNameStatusList.sort((a, b) => {
      var x = a.shortStatus.toLowerCase();
      var y = b.shortStatus.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });
    gitCommitModel.hash = hashId;
    gitCommitModel.fileCommits = gitCommitNameStatusList;
    return gitCommitModel;
  }

  filterByAuthor(author) {
    this.selectedAuthors = [...author];
    if (author.length == 0 && !this.selectedFromDate && !this.selectedToDate) {
      return (this.dataSource.filter = null);
    }
    this.dataSource.filter = author;
  }

  filterByFromDate() {
    if (this.dataSource) {
      this.dataSource.filter = this.selectedFromDate;
    }
  }

  filterByToDate() {
    if (this.dataSource) {
      this.dataSource.filter = this.selectedToDate;
    }
  }
  clearToDate() {
    if (!this.selectedFromDate) {
      this.selectedToDate = null;
    }
  }

  disablePagination() {
    if (this.dataSource && this.dataSource.filteredData.length > 5) {
      return false;
    }
    return true;
  }

  onChangeFilterOption() {
    if (this.selectedFilterOption === "showmerges") {
      this.showMerges = true;
      this.onlyMerges = false;
    } else if (this.selectedFilterOption === "onlymerges") {
      this.onlyMerges = true;
    } else {
      this.showMerges = false;
      this.onlyMerges = false;
    }
    this.loadGitHistory();
  }

  showFileHistory(filePath) {
    this.sharedData.setGitRootPath(this.gitRootPath);
    this.sharedData.setSelectedFilePath(filePath);
    this.sharedData.setSelectedBranch(this.selectedBranch);
    if (this.onlyMerges || this.showMerges) {
      this.sharedData.setShowMerge(true);
    }
    this.router.navigate(["/fileHistory"]);
  }

  onChangeFilteredHash() {
    this.dataSource.filter = this.filterHashId;
  }

  onSelectAllCommits(event:MatCheckboxChange){
    this.checkBoxes.forEach(checkBox=>{
      if(checkBox.name=="select"){
        if(event.checked){
          checkBox.checked = true;
        }
        else{
          checkBox.checked = false;
        }
        let gitLogFound = this.gitLogList.find(gitLog=>gitLog.hash ===checkBox.id);
        gitLogFound.checked = checkBox.checked ;     
      }
    })
    if(event.checked){
      this.onSelectCommits();
    }
  }

  onNextGitLogs(event:any){
    this.selectAllCommitCheckBox.checked=false;
  }

  onSelectCommits(){
    let anyChecked = false;
    this.checkBoxes.forEach(checkBox=>{
      if(checkBox.name=="select"){
        if(checkBox.checked){
          anyChecked = true;
        }
      }
    })
    if(!this.cherryPickInfo && anyChecked){
       let cherryPickInfoRef = this.snackBar.openFromComponent(GitCherryPickInfoSnack,
        {
          panelClass:['info-snackbar']
        });
       cherryPickInfoRef.afterDismissed().subscribe(()=>{
        this.cherryPickInfo = null;
       })
       this.cherryPickInfo = cherryPickInfoRef;
    }
  }



}
