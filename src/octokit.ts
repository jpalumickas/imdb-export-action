import * as core from '@actions/core';
import { GitHub, getOctokitOptions } from '@actions/github/lib/utils';
// import multipleUpdatePlugin from "octokit-commit-multiple-files"

// const Octokit = GitHub.plugin(
//   multipleUpdatePlugin
// )
// const Octokit = GitHub;

const githubToken = core.getInput('github_token');
const octokitOptions = getOctokitOptions(githubToken);
const octokit = new GitHub(octokitOptions) as InstanceType<typeof GitHub>;

export default octokit;
