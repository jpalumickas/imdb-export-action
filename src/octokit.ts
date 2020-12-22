import { Octokit } from '@octokit/action';
// import multipleUpdatePlugin from "octokit-commit-multiple-files"

// const Octokit = GitHub.plugin(
//   multipleUpdatePlugin
// )
// const Octokit = GitHub;

const octokit = new Octokit();

export default octokit;
