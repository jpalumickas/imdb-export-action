# IMDb Export GitHub Action

A GitHub action that allows you to export your IMDb ratings and watchlist as csv to repository

## Example Usage

```yaml
on:
  push:
  workflow_dispatch:
  schedule:
    - cron: '0 0 */3 * *'

jobs:
  export:
    name: Export
    runs-on: ubuntu-latest
    steps:
      - name: Export from IMDb
        uses: jpalumickas/imdb-export-action@v1.2.0
        with:
          imdb_email: ${{ secrets.IMDB_EMAIL }}
          imdb_password: ${{ secrets.IMDB_PASSWORD }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Reference

Here are all the inputs available through `with`:

| Input                      | Description                                                    | Default                 | Required |
| -------------------------- | -------------------------------------------------------------- | ----------------------- | -------- |
| `imdb_email`               | Your IMDb email address                                        |                         | ✔        |
| `imdb_password`            | Your IMDb password                                             |                         | ✔        |
| `GITHUB_TOKEN`             | The GitHub Token to be used to authenticate to your repository |                         | ✔        |
| `ratings_path`             | Ratings file path in repository                                | `imdb_ratings.csv`      |          |
| `ratings_commit_message`   | Commit message when updating ratings file                      | `Update IMDb Ratings`   |          |
| `watchlist_path`           | Watchlist file path in repository                              | `imdb_watchlist.csv`    |          |
| `watchlist_commit_message` | Commit message when updating watchlist file                    | `Update IMDb Watchlist` |          |

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
