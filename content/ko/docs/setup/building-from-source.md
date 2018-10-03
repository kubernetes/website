---
title: 소스로부터 빌드
---

You can either build a release from source or download a pre-built release.  If you do not plan on developing Kubernetes itself, we suggest using a pre-built version of the current release, which can be found in the [Release Notes](/docs/setup/release/notes/).

The Kubernetes source code can be downloaded from the [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) repo.

## 소스로부터 빌드

If you are simply building a release from source there is no need to set up a full golang environment as all building happens in a Docker container.

Building a release is simple.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make release
```

For more details on the release process see the kubernetes/kubernetes [`build`](http://releases.k8s.io/{{< param "githubbranch" >}}/build/) directory.
