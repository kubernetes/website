---
reviewers:
- david-mcmahon
- jbeda
title: Building from Source
---

You can either build a release from source or download a pre-built release.  If you do not plan on developing Kubernetes itself, we suggest using a pre-built version of the current release, which can be found in the [Release Notes](/docs/imported/release/notes/).

The Kubernetes source code can be downloaded from the [kubernetes/kubernetes repo](https://github.com/kubernetes/kubernetes).

### Building from source

If you are simply building a release from source there is no need to set up a full golang environment as all building happens in a Docker container.

Building a release is simple.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

For more details on the release process see the kubernetes/kubernetes [`build`](http://releases.k8s.io/{{page.githubbranch}}/build/) directory.
