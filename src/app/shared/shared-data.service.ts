import { Injectable } from "@angular/core";

@Injectable()
export class SharedData {
  private gitRootPath: string;
  private selectedFile: string;
  private selectedBranch: string;
  private showMerge: boolean;
  private branches: string[];

  clear() {
    this.gitRootPath = null;
    this.branches = null;
    this.selectedFile = null;
    this.selectedBranch = null;
    this.showMerge = false;
  }

  setRemoteBranches(branches: string[]) {
    this.branches = branches;
  }
  getRemoteBranches() {
    return this.branches;
  }
  setSelectedBranch(selectedBranch: string) {
    this.selectedBranch = selectedBranch;
  }

  setShowMerge(showMerge: boolean) {
    this.showMerge = showMerge;
  }

  getSelectedBranch() {
    return this.selectedBranch;
  }

  hasShowMerge() {
    return this.showMerge;
  }

  setGitRootPath(gitRootPath: string) {
    this.gitRootPath = gitRootPath;
  }

  getGitRootPath() {
    return this.gitRootPath;
  }

  setSelectedFilePath(selectedFile: string) {
    this.selectedFile = selectedFile;
  }

  getSelectedFilePath() {
    return this.selectedFile;
  }
}
