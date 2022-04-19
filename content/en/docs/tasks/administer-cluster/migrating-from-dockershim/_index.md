---
title: "Migrating from dockershim"
weight: 10
content_type: task
no_list: true
---

<!-- overview -->

This section presents information you need to know when migrating from
dockershim to other container runtimes.

Since the announcement of [dockershim deprecation](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
in Kubernetes 1.20, there were questions on how this will affect various workloads and Kubernetes
installations. Our [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) is there to help you
to understand the problem better.

<!-- body -->

Dockershim will be removed from Kubernetes following the release of v1.24.
If you use Docker via dockershim as your container runtime, and wish to upgrade to v1.24,
it is recommended that you either migrate to another runtime or find an alternative means to obtain Docker Engine support.
If you're not sure whether you are using Docker,
[find out what container runtime is used on a node](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).

Your cluster might have more than one kind of node, although this is not a common
configuration.

These tasks will help you to migrate:

* [Check whether Dockershim deprecation affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/)
* [Migrating from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/)
* [Migrating telemetry and security agents from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)


## {{% heading "whatsnext" %}}

* Check out [container runtimes](/docs/setup/production-environment/container-runtimes/)
  to understand your options for a container runtime.
* There is a
  [GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917)
  to track discussion about the deprecation and removal of dockershim.
* If you found a defect or other technical concern relating to migrating away from dockershim,
  you can [report an issue](https://github.com/kubernetes/kubernetes/issues/new/choose)
  to the Kubernetes project.
