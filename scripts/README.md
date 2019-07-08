# Development scripts for Kubernetes documentation

- `find_pr.py`: Find what GitHub pull requests touch a given file.
- `upstream_changes.py`: Find what changes occurred between two versions
- `test_examples.sh`: This script tests whether a change affects example files bundled in the website.
- `check-headers-file.sh`: This script checks the headers if you are in a production environment.
- `hugo-version-check.sh`: This script checks whether your local Hugo version matches the version used in production.

## Requirements

Some of those scripts have external requirements. You can install them with the following commands:

```
python3 -m pip install -r requirements.txt
```

## find_pr.py

```
$ ./find_pr.py --help
Usage: find_pr.py [OPTIONS] PATH

  Find what GitHub pull requests touch a given file.

  ex: ./find_pr.py --tags "language/fr" "content/fr/_index.html"

Options:
  --tags TEXT          Tags of PullRequest (Can be passed multiple times)
  --token TEXT         GitHub API token. (Default env variable GITHUB_TOKEN)
  --last-n-pr INTEGER  Last n-th PullRequests
  --help               Show this message and exit.
```

## upstream_changes.py

```
$ ./upstream_changes.py --help
Usage: upstream_changes.py [OPTIONS] PATH

  Find what changes occurred between two versions

  ex: ./upstream_changes.py content/fr/_index.html

Options:
  --reference TEXT  Specify the reference version of the file. Default to the
                    English one.
  --git-path TEXT   Specify git path
  --help            Show this message and exit.
```

## test_examples.sh

This script tests whether a change affects example files bundled in the website.

To install the dependencies:

    $ ./scripts/test_examples.sh install

To run the examples:

    $ ./scripts/test_examples.sh run

## check-headers-file.sh

This script checks the headers if you are in a production environment.

    ./scripts/check-headers-file.sh

## hugo-version-check.sh

This script checks whether your local Hugo version matches the version used in production.

    ./scripts/hugo-version-check.sh
