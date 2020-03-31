---
content_template: templates/concept
title: Contribute to Kubernetes docs
linktitle: Contribute
main_menu: true
weight: 80
---

{{% capture overview %}}

If you would like to help contribute to the Kubernetes documentation or website,
we're happy to have your help! Anyone can contribute, whether you're new to the
project or you've been around a long time, and whether you self-identify as a
developer, an end user, or someone who just can't stand seeing typos.

{{% /capture %}}

{{% capture body %}}

## Getting Started

Anyone can open an issue describing problems or desired improvements with documentation, or contribute a change with a pull request (PR).
Some tasks require more trust and need more access in the Kubernetes organization.
See [Participating in SIG Docs](/docs/contribute/participating/) for more details about
of roles and permissions.

Kubernetes documentation resides in a GitHub repository. While we welcome
contributions from anyone, you do need basic comfort with git and GitHub to
operate effectively in the Kubernetes community.

To get involved with documentation:

1. Sign the CNCF [Contributor License Agreement](https://github.com/kubernetes/community/blob/master/CLA.md).
2. Familiarize yourself with the [documentation repository](https://github.com/kubernetes/website) and the website's [static site generator](https://gohugo.io).
3. Make sure you understand the basic processes for [improving content](https://kubernetes.io/docs/contribute/start/#improve-existing-content) and [reviewing changes](https://kubernetes.io/docs/contribute/start/#review-docs-pull-requests).

## Contributions best practices

- Do write clear and meaningful GIT commit messages.
- Make sure to include _Github Special Keywords_ which references the issue and automatically closes the issue when PR is merged.
- When you make a small change to a PR like fixing a typo, any style change, or changing grammar. Make sure you squash your commits so that you dont get a large number of commits for a relatively small change.
- Make sure you include a nice PR description depicting the code you have changes, why to change a following piece of code and ensuring there is sufficient information for the reviewer to understand your PR.
- Additional Readings : 
    - [chris.beams.io/posts/git-commit/](https://chris.beams.io/posts/git-commit/)
    - [github.com/blog/1506-closing-issues-via-pull-requests ](https://github.com/blog/1506-closing-issues-via-pull-requests )
    - [davidwalsh.name/squash-commits-git ](https://davidwalsh.name/squash-commits-git )

## Other ways to contribute

- To contribute to the Kubernetes community through online forums like Twitter or Stack Overflow, or learn about local meetups and Kubernetes events, visit the [Kubernetes community site](/community/).
- To contribute to feature development, read the [contributor cheatsheet](https://github.com/kubernetes/community/tree/master/contributors/guide/contributor-cheatsheet) to get started.

{{% /capture %}}

{{% capture whatsnext %}}

- For more information about the basics of contributing to documentation, read [Start contributing](/docs/contribute/start/).
- Follow the [Kubernetes documentation style guide](/docs/contribute/style/style-guide/) when proposing changes.
- For more information about SIG Docs, read [Participating in SIG Docs](/docs/contribute/participating/).
- For more information about localizing Kubernetes docs, read [Localizing Kubernetes documentation](/docs/contribute/localization/).

{{% /capture %}}
