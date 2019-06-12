#!/usr/bin/env python

import os

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
    r = requests.post("https://api.github.com/graphql",
                      json={"query": query},
                      headers={
                          "Authorization": "token %s" % token,
                          "Accept": "application/vnd.github.ocelot-preview+json",
                          "Accept-Encoding": "gzip"
                      })
    reply = r.json()
    prs = reply['data']['repository']['pullRequests']['edges']

    for pr in prs:
        files = pr["node"]["files"]["edges"]
        for f in files:
            if path == f["node"]["path"]:
                print("%s (%s)" % (pr["node"]["title"], pr["node"]["state"]))
                print(pr["node"]["url"])
                print("----------------")


if __name__ == '__main__':
    main()
