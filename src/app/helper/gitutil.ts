import { BashUtil } from "./bash";

export class GitUtil {
  static getFileCommitStatus(
    hashId: string,
    gitRootPath: string,
    bashUtil: BashUtil
  ) {
    let gitLogCommitStatusCmd =
      "cd '" +
      gitRootPath +
      "' && git diff-tree --no-commit-id --name-status -r " +
      hashId +
      " --name-status --diff-filter=ADMR -M100% ";
    //console.log(gitLogCmd);
    return bashUtil.executeCommand(gitLogCommitStatusCmd, true);
  }

  static getGitDiff(
    gitRootPath: string,
    bashUtil: BashUtil,
    commitId1?: string,
    commitId2?: string,
    fileFullPath?: string
  ) {
    let gitDiffCmd = "cd '" + gitRootPath + "' && git diff";
    if (commitId1 && commitId2) {
      gitDiffCmd = gitDiffCmd + " " + commitId1 + " " + commitId2;
    } else if (commitId1) {
      gitDiffCmd = gitDiffCmd + " " + commitId1;
    } else if (commitId2) {
      gitDiffCmd = gitDiffCmd + " " + commitId2;
    }
    if (fileFullPath) {
      gitDiffCmd = gitDiffCmd + " " + fileFullPath;
    }
    return bashUtil.executeCommand(gitDiffCmd, false, false);
  }

  static getOriginRemoteBranches(gitRootPath: string, bashUtil: BashUtil) {
    let branchCmd =
      'cd "' +
      gitRootPath +
      '" && git branch -a | awk \'{gsub("remotes/","",$1); gsub("origin/HEAD","all",$1); gsub("*","");print $1 }\'';
    return bashUtil.executeCommand(branchCmd, true);
  }
  static retrieveGitFileHistory(
    gitRootPath: string,
    bashUtil: BashUtil,
    fileFullPath: string,
    selectedBranch: string,
    showMerges: boolean
  ) {
    let branchCmd = "";
    let mergeCmd = "--no-merges";
    if (selectedBranch) {
      branchCmd = selectedBranch;
      if (branchCmd === "all") {
        branchCmd = "--all";
      }
    }
    if (showMerges) {
      mergeCmd = "--merges";
    }
    let gitLogCmd =
      "cd '" +
      gitRootPath +
      "' && git log " +
      branchCmd +
      ' --pretty=format:"{\\"compare\\":\\"%H\\",\\"hash\\":\\"%H\\",\\"author\\":\\"%an\\",\\"message\\":\\"%f\\",\\"date\\":\\"%ad\\"}" --date=format:%m/%d/%Y ' +
      mergeCmd +
      " " +
      fileFullPath;
    //console.log(gitLogCmd);
    return bashUtil.executeCommand(gitLogCmd, true);
  }

  static retrieveGitLogs(
    gitRootPath: string,
    bashUtil: BashUtil,
    showMerges: boolean,
    onlyMerges: boolean,
    selectedBranch: string
  ) {
    let mergeCmd = "--no-merges";
    let branchCmd = "";
    if (selectedBranch) {
      branchCmd = selectedBranch;
      if (branchCmd === "all") {
        branchCmd = "--all";
      }
    }
    if (showMerges && !onlyMerges) {
      mergeCmd = "";
    } else if (onlyMerges) {
      mergeCmd = "--merges";
    }
    let gitLogCmd =
      "cd '" +
      gitRootPath +
      "' && git log " +
      branchCmd +
      ' --pretty=format:"{\\"author\\":\\"%an\\",\\"hash\\":\\"%H\\",\\"message\\":\\"%f\\",\\"date\\":\\"%ad\\"}" --date=format:%m/%d/%Y ' +
      mergeCmd;
    //console.log(gitLogCmd);
    return bashUtil.executeCommand(gitLogCmd, true);
  }
  static gitGetBranches(gitRootPath: string, bashUtil: BashUtil) {
    let gitListRemoteBranchCmd = 'cd "' + gitRootPath + '" && git branch -r';
    return bashUtil.executeCommand(gitListRemoteBranchCmd, true);
  }

  static gitGetAuthors(
    gitRootPath: string,
    bashUtil: BashUtil
  ): Promise<string[]> {
    let gitListRemoteBranchCmd =
      'cd "' + gitRootPath + '" && git log --format="%an" | sort -u';
    return bashUtil.executeCommand(gitListRemoteBranchCmd, true);
  }

  static getRootDirectory(
    repoPath: string,
    bashUtil: BashUtil
  ): Promise<string> {
    let getRootDirCmd =
      'cd "' + repoPath + '" && git rev-parse --show-toplevel';
    return bashUtil.executeCommand(getRootDirCmd, false);
  }
}
