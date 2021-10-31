import octokit from './octokit';
import { components } from '@octokit/openapi-types';

type GetRepoContentResponseDataFile = components['schemas']['content-file'];

interface CommitFileOptions {
  message: string;
  content: string;
  path: string;
}

if (!process.env.GITHUB_REPOSITORY) {
  throw new Error('Failed to get GitHub repository');
}

const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

const commitFile = async ({ message, content, path }: CommitFileOptions) => {
  const existingFile = await octokit.repos.getContent({
    repo,
    owner,
    path,
  });

  const base64Content = Buffer.from(content).toString('base64');

  // https://github.com/octokit/rest.js/issues/1971
  const data =
    existingFile && (existingFile.data as GetRepoContentResponseDataFile);

  if (existingFile?.data && data.content === base64Content) {
    console.log(`File ${path} didn't change. Skipping.`);
    return;
  }

  return await octokit.repos.createOrUpdateFileContents({
    repo,
    owner,
    path,
    message,
    content: base64Content,
    sha: existingFile && data.sha,
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
