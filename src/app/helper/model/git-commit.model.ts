export class GitCommitModel {
  hash: string;
  fileCommits: GitCommitNameStatus[];
}

export class GitCommitNameStatus {
  fileName: string;
  fileStatus: string;
  shortStatus: string;
  color: string;
}
