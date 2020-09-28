import octokit from './octokit';
import { context } from '@actions/github';

interface CommitFileOptions {
  message: string;
  content: string;
  path: string;
}

const commitFile = async ({ message, content, path }: CommitFileOptions) => {
  const existingFile = await octokit.repos.getContent({
    ...context.repo,
    path,
  });

  const base64Content = Buffer.from(content).toString('base64');

  if (existingFile && existingFile.data.content === base64Content) {
    console.log(`File ${path} didn't change. Skipping.`);
    return;
  }

  return await octokit.repos.createOrUpdateFileContents({
    ...context.repo,
    path,
    message,
    content: base64Content,
    sha: existingFile && existingFile.data.sha,
  });
};

// const repoget = await octokit.repos.get(context.repo);
// console.log(repoget);
// const defaultBranch = repoget.data.default_branch;
// console.log({ defaultBranch });
// const r = await octokit.repos.createOrUpdateFiles({
//   ...context.repo,
//   message: 'Update files',
//   branch: defaultBranch,
//   changes: [
//     {
//       path: "imdb_ratings.csv",
//       contents: result.ratings,
//     },
//     {
//       path: "imdb_watchlist.csv",
//       contents: result.watchlist,
//     }
//   ]
// })

export default commitFile;
