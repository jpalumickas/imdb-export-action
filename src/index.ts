import * as core from '@actions/core';
import fetchData from './fetchData';
import commitFile from './commitFile';

(async () => {
  try {
    const data = await fetchData();

    if (!data.ratings || !data.watchlist) return;

    core.debug('Commit files');

    if (data.ratings) {
      await commitFile({
        path: core.getInput('ratings_path'),
        message: core.getInput('ratings_commit_message'),
        content: data.ratings,
      });
    }

    if (data.watchlist) {
      await commitFile({
        path: core.getInput('watchlist_path'),
        message: core.getInput('watchlist_commit_message'),
        content: data.watchlist,
      });
    }
  } catch (err) {
    console.error(err);
    core.setFailed(`Action failed with error ${err}`);
  }
})();
