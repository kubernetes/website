---
title: "Migrating from dockershim"
weight: 10
content_type: task 
---

<!-- overview -->

This section presents information you need to know when migrating from
dockershim to other container runtimes.

Since the announcement of [dockershim deprecation](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
in Kubernetes 1.20, there were questions on how this will affect various workloads and Kubernetes
installations. Our [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) is there to help you
to understand the problem better.

It is recommended to migrate from dockershim to alternative container runtimes.
Check out [container runtimes](/docs/setup/production-environment/container-runtimes/)
section to know your options. Make sure to
[report issues](https://github.com/kubernetes/kubernetes/issues) you encountered
with the migration. So the issue can be fixed in a timely manner and your cluster would be
ready for dockershim removal.
