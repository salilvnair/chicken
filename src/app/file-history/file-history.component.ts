import { Component, OnInit, ViewChild } from "@angular/core";
import { ElectronService } from "ngx-electron";
import { BashUtil } from "../helper/bash";
import { MacBashUtil } from "../helper/macos";
import { WindowsBashUtil } from "../helper/windows";
import { GitUtil } from "../helper/gitutil";
import { GitLogModel } from "../helper/model/git-log.model";
import {
  MatTableDataSource,
  MatSort,
  MatPaginator,
  MatCheckboxChange
} from "@angular/material";
import { SharedData } from "../shared/shared-data.service";
import { Router } from "@angular/router";
import { FormControl } from "@angular/forms";
import { ThreadUtil } from "../helper/thread.util";

@Component({
  selector: "file-history",
  templateUrl: "./file-history.component.html",
  styleUrls: ["./file-history.component.css"]
})
export class FileHistoryComponent implements OnInit {
  bashUtil: BashUtil;
  gitRootPath: string;
  filePath: string;
  selectedBranch: string;
  hasShowMerge: boolean;
  gitLogList: GitLogModel[];
  dataSource: MatTableDataSource<GitLogModel>;
  columnsToDisplay: string[];
  authors = new FormControl();
  date = new Date();
  authorList: string[] = [];
  branchList: string[] = [];
  selectedAuthors: string[] = [];
  selectedFromDate: string;
  selectedToDate: string;
  gitFileLogStatusCache = {};
  filterHashId: string;
  diffString: string;
  compareSideBySide: boolean = false;
  comparableCommits: string[];
  comparableCommitsPosition: DOMRect[];
  compareButtonTopPosition: string;
  compareButtonLeftPosition: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private electronService: ElectronService,
    private threadUtil: ThreadUtil,
    private sharedData: SharedData,
    private router: Router
  ) {}
  ngOnInit() {
    console.log('hmmmmm');
    this.init();
    this.gitRootPath = this.sharedData.getGitRootPath();
    this.filePath = this.sharedData.getSelectedFilePath();
    this.selectedBranch = this.sharedData.getSelectedBranch();
    this.hasShowMerge = this.sharedData.hasShowMerge();
    if (!this.gitRootPath || !this.filePath) {
      this.router.navigate(["gitHistory"]);
    } else {
      this.loadGitHistory();
    }
  }

  onBack() {
    if (this.diffString) {
      this.diffString = null;
      this.comparableCommits = [];
      this.comparableCommitsPosition = [];
      this.compareButtonTopPosition = null;
      this.compareButtonLeftPosition = null;
    } else {
      this.router.navigate(["gitHistory"]);
    }
  }

  getGitDiff() {
    var self = this;
    if (this.comparableCommits) {
      GitUtil.getGitDiff(
        this.gitRootPath,
        this.bashUtil,
        this.comparableCommits[0],
        this.comparableCommits[1],
        this.filePath
      ).then(diffString => {
        self.diffString = diffString;
      });
    } else {
      GitUtil.getGitDiff(this.gitRootPath, this.bashUtil).then(diffString => {
        self.diffString = diffString;
      });
    }
  }

  onComapre() {
    this.getGitDiff();
  }

  init() {
    var bashUtil: BashUtil;
    var osvar = this.electronService.process.platform;
    if (osvar == "darwin" || osvar == "linux") {
      bashUtil = new MacBashUtil();
      bashUtil.init(this.electronService,this.threadUtil);
    } else if (osvar == "win32") {
      bashUtil = new WindowsBashUtil();
      bashUtil.init(this.electronService,this.threadUtil);
    }
    this.bashUtil = bashUtil;
  }

  loadGitHistory() {
    var self = this;
    GitUtil.retrieveGitFileHistory(
      this.gitRootPath,
      this.bashUtil,
      this.filePath,
      this.selectedBranch,
      this.hasShowMerge
    ).then(logs => {
      var gitLogJsonList = "[" + logs.join(",") + "]";
      //console.log(gitLogJsonList);
      var gitLogJsonDataList: GitLogModel[] = JSON.parse(gitLogJsonList);
      self.gitLogList = [];
      gitLogJsonDataList.forEach(element => {
        self.gitLogList.push(element);
      });
      self.authorList = self.prepareAuthorList(self.gitLogList);
      console.log(self.authorList);
      //self.gitLogList = gitLogJsonDataList;
      self.columnsToDisplay = Object.keys(self.gitLogList[0]);
      self.dataSource = new MatTableDataSource<GitLogModel>();
      self.dataSource.data = self.gitLogList;
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
    if (column == "hash" || column == "compare" || column == "message") {
      return false;
    }
    return true;
  }

  prepareAuthorList(gitLogList: GitLogModel[]) {
    return Array.from(new Set(gitLogList.map(log => log.author)));
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

  onChangeFilteredHash() {
    this.dataSource.filter = this.filterHashId;
  }

  compareTwoCommits(event: MatCheckboxChange, commitId: string) {
    let domRect: DOMRect = event.source._elementRef.nativeElement.getBoundingClientRect();
    this.compareButtonTopPosition = null;
    this.compareButtonLeftPosition = null;
    if (!this.comparableCommits) {
      this.comparableCommits = [];
      this.comparableCommitsPosition = [];
      if (event.checked) {
        this.comparableCommits.push(commitId);
        this.comparableCommitsPosition.push(domRect);
      }
    } else {
      if (this.comparableCommits.length <= 2) {
        if (event.checked) {
          this.comparableCommits.push(commitId);
          this.comparableCommitsPosition.push(domRect);
        } else {
          this.comparableCommits = this.comparableCommits.filter(
            item => item !== commitId
          );
          this.comparableCommitsPosition = this.comparableCommitsPosition.filter(
            item => item.y !== domRect.y
          );
        }
      }
    }
  }
  disableOtherHashId(commitId) {
    if (this.comparableCommits && this.comparableCommits.length >= 2) {
      if (this.comparableCommits.indexOf(commitId) > -1) {
        return false;
      }
      return true;
    }
    return false;
  }

  calculateCompareButtonTopPosition(rect1: DOMRect, rect2: DOMRect) {
    let finalTopPosition = 0;
    if (rect1.y > rect2.y) {
      finalTopPosition = (rect1.y - rect2.y) / 2 - 11;
      finalTopPosition = finalTopPosition + rect2.y;
    } else {
      finalTopPosition = (rect2.y - rect1.y) / 2 - 11;
      finalTopPosition = finalTopPosition + rect1.y;
    }
    finalTopPosition = Math.floor(finalTopPosition);
    return finalTopPosition + "px";
  }

  calculateCompareButtonLeftPosition(rect1: DOMRect) {
    let finalLeftPosition = Math.floor(rect1.x) - 12;
    return finalLeftPosition + "px";
  }

  getCompareButtonTopPosition() {
    if (!this.compareButtonTopPosition) {
      this.compareButtonTopPosition = this.calculateCompareButtonTopPosition(
        this.comparableCommitsPosition[0],
        this.comparableCommitsPosition[1]
      );
    }
    return this.compareButtonTopPosition;
  }

  getCompareButtonLeftPosition() {
    if (!this.compareButtonLeftPosition) {
      this.compareButtonLeftPosition = this.calculateCompareButtonLeftPosition(
        this.comparableCommitsPosition[0]
      );
    }
    return this.compareButtonLeftPosition;
  }
}
