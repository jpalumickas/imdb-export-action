import * as core from '@actions/core';
import fetchData from './fetchData';
import commitFile from './commitFile';

(async () => {
  const email = core.getInput('imdb_email', { trimWhitespace: true });
  const password = core.getInput('imdb_password', { trimWhitespace: true });

  try {
    const data = await fetchData({
      email, password
    });

    if (!data.ratings && !data.watchlist) {
      core.setFailed(`Failed to get data from IMDb`);
      return;
    }

    core.debug('Commit files');

    if (data.ratings) {
      await commitFile({
        path: core.getInput('ratings_path', { trimWhitespace: true }),
        message: core.getInput('ratings_commit_message', {
          trimWhitespace: true,
        }),
        content: data.ratings,
      });
    }

    if (data.watchlist) {
      await commitFile({
        path: core.getInput('watchlist_path', { trimWhitespace: true }),
        message: core.getInput('watchlist_commit_message', {
          trimWhitespace: true,
        }),
        content: data.watchlist,
      });
    }
  } catch (err) {
    console.error(err);
    core.setFailed(`Action failed with error ${err}`);
  }
})();
