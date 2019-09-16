#!/usr/bin/env python

import os
import json

import click
import requests
from jinja2 import Template


@click.command()
@click.argument("path")
@click.option("--tags",
              multiple=True,
              help="Tags of PullRequest (Can be passed multiple times)")
@click.option("--token",
              help="GitHub API token. (Default env variable GITHUB_TOKEN)",
              default=os.environ.get("GITHUB_TOKEN", ""))
@click.option("--last-n-pr",
              help="Last n-th PullRequests",
              default=100)
def main(tags, token, path, last_n_pr):
    """
    Find what GitHub pull requests touch a given file.

    ex:
    ./find_pr.py --tags "language/fr" "content/fr/_index.html"
    """

    if not token:
        print("GitHub token not provided (required)")
        exit(1)

    query = Template("""
    query {
      repository(name: "website", owner: "kubernetes") {
        pullRequests({% if tags %}labels: [{% for tag in tags %}"{{ tag }}", {% endfor %}], {% endif %}last: {{ last_n_pr }}) {
          edges {
            node {
              title
              state
              url
              files (last: 100) {
                edges {
                  node {
                    path
                  }
                }
              }
            }
          }
        }
      }
    }
    """).render(tags=tags, last_n_pr=last_n_pr)

    try:
        r = requests.post("https://api.github.com/graphql",
                          json={"query": query},
                          headers={
                              "Authorization": "token %s" % token,
                              "Accept": "application/vnd.github.ocelot-preview+json",
                              "Accept-Encoding": "gzip"
                          })
        r.raise_for_status()

        reply = r.json()
        prs = reply['data']['repository']['pullRequests']['edges']

        for pr in prs:
            files = pr["node"]["files"]["edges"]
            for f in files:
                if path == f["node"]["path"]:
                    print("%s (%s)" % (pr["node"]["title"], pr["node"]["state"]))
                    print(pr["node"]["url"])
                    print("----------------")

    except requests.exceptions.HTTPError as err:
        gh_err_response = json.loads(err.response.text)
        print("HTTP Error: %d %s" % (err.response.status_code, gh_err_response['message']))
    except requests.exceptions.ConnectionError as err:
        print("Error Connecting: %s" % err)
    except requests.exceptions.Timeout as err:
        print("Timeout Error: %s" % err)
    except requests.exceptions.RequestException as err:
        print("Oops, another error occurred: %s" % err)

if __name__ == '__main__':
    main()
