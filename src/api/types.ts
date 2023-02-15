export interface GitRepo {
  name: string;
  author: string;
  commits: GitCommit[];
  cacheDate: number;
  onPage: number;
}

export interface GitCommit {
  html_url: string;
  shortSha: string;
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    }
  }
}