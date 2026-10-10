---
title: "How Docs Handle Third Party and Dual Sourced Content"
date: 2020-05-06
slug: third-party-dual-sourced
url: /blog/2020/05/third-party-dual-sourced-content
author: >
  Zach Corleissen (Cloud Native Computing Foundation)
---

*Editor's note: Zach is one of the chairs for the Kubernetes documentation special interest group (SIG Docs).*

Late last summer, SIG Docs started a community conversation about third party content in Kubernetes docs. This conversation became a [Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/pull/1327) (KEP) and, after five months for review and comment, SIG Architecture approved the KEP as a [content guide](/docs/contribute/style/content-guide/) for Kubernetes docs.

Here's how Kubernetes docs handle third party content now:

> Links to active content in the Kubernetes project (projects in the kubernetes and kubernetes-sigs GitHub orgs) are always allowed.
>
> Kubernetes requires some third party content to function. Examples include container runtimes (containerd, CRI-O, Docker), networking policy (CNI plugins), Ingress controllers, and logging.
>
> Docs can link to third party open source software (OSS) outside the Kubernetes project if it’s necessary for Kubernetes to function.

These common sense guidelines make sure that Kubernetes docs document Kubernetes.

## Keeping the docs focused

Our goal is for Kubernetes docs to be a trustworthy guide to Kubernetes features. To achieve this goal, SIG Docs is [tracking third party content](https://github.com/kubernetes/website/issues/20232) and removing any third party content that isn't both in the Kubernetes project _and_ required for Kubernetes to function.

### Re-homing content

Some content will be removed that readers may find helpful. To make sure readers have continuous access to information, we're giving stakeholders until the [1.19 release deadline for docs](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.19), **July 9th, 2020** to re-home any content slated for removal.

Over the next few months you'll see less third party content in the docs as contributors open PRs to remove content.

## Background

Over time, SIG Docs observed increasing vendor content in the docs. Some content took the form of vendor-specific implementations that aren't required for Kubernetes to function in-project. Other content was thinly-disguised advertising with minimal to no feature content. Some vendor content was new; other content had been in the docs for years. It became clear that the docs needed clear, well-bounded guidelines for what kind of third party content is and isn't allowed. The [content guide](https://kubernetes.io/docs/contribute/content-guide/) emerged from an extensive period for review and comment from the community.

Docs work best when they're accurate, helpful, trustworthy, and remain focused on features. In our experience, vendor content dilutes trust and accuracy. 

Put simply: feature docs aren't a place for vendors to advertise their products. Our content policy keeps the docs focused on helping developers and cluster admins, not on marketing.

## Dual sourced content

Less impactful but also important is how Kubernetes docs handle _dual-sourced content_. Dual-sourced content is content published in more than one location, or from a non-canonical source.

From the [Kubernetes content guide](https://kubernetes.io/docs/contribute/style/content-guide/#dual-sourced-content):

> Wherever possible, Kubernetes docs link to canonical sources instead of hosting dual-sourced content.

Minimizing dual-sourced content streamlines the docs and makes content across the Web more searchable. We're working to consolidate and redirect dual-sourced content in the Kubernetes docs as well.

## Ways to contribute

We're tracking third-party content in an [issue in the Kubernetes website repository](https://github.com/kubernetes/website/issues/20232). If you see third party content that's out of project and isn't required for Kubernetes to function, please comment on the tracking issue. 

Feel free to open a PR that removes non-conforming content once you've identified it!

## Want to know more?

For more information, read the issue description for [tracking third party content](https://github.com/kubernetes/website/issues/20232). 
