---
title: 从 dockershim 迁移
weight: 20
content_type: task
no_list: true
---
<!--
title: "Migrating from dockershim"
weight: 20
content_type: task
no_list: true
-->

<!-- overview -->

<!--
This section presents information you need to know when migrating from
dockershim to other container runtimes.
-->
本节提供从 dockershim 迁移到其他容器运行时的必备知识。

<!--
Since the announcement of [dockershim deprecation](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)
in Kubernetes 1.20, there were questions on how this will affect various workloads and Kubernetes
installations. Our [Dockershim Removal FAQ](/blog/2022/02/17/dockershim-faq/) is there to help you
to understand the problem better.
-->
自从 Kubernetes 1.20 宣布
[弃用 dockershim](/zh-cn/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)，
各类疑问随之而来：这对各类工作负载和 Kubernetes 部署会产生什么影响。
我们的[弃用 Dockershim 常见问题](/blog/2022/02/17/dockershim-faq/)可以帮助你更好地理解这个问题。

<!--
Dockershim was removed from Kubernetes with the release of v1.24.
If you use Docker Engine via dockershim as your container runtime and wish to upgrade to v1.24,
it is recommended that you either migrate to another runtime or find an alternative means to obtain Docker Engine support.
-->
Dockershim 在 Kubernetes v1.24 版本已经被移除。
如果你集群内是通过 dockershim 使用 Docker Engine 作为容器运行时，并希望 Kubernetes 升级到 v1.24，
建议你迁移到其他容器运行时或使用其他方法以获得 Docker 引擎支持。

<!--
Check out the [container runtimes](/docs/setup/production-environment/container-runtimes/)
section to know your options.
-->
请参阅[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)
一节以了解可用的备选项。

<!--
The version of Kubernetes with dockershim (1.23) is out of support and the v1.24
will run out of support [soon](/releases/#release-v1-24). Make sure to
[report issues](https://github.com/kubernetes/kubernetes/issues) you encountered
with the migration so the issues can be fixed in a timely manner and your cluster would be
ready for dockershim removal. After v1.24 running out of support, you will need
to contact your Kubernetes provider for support or upgrade multiple versions at a time
if there are critical issues affecting your cluster.
-->
带 dockershim 的 Kubernetes 版本 (1.23) 已不再支持，
v1.24 [很快](/zh-cn/releases/#release-v1-24)也将不再支持。

当在迁移过程中遇到麻烦，请[上报问题](https://github.com/kubernetes/kubernetes/issues)。
那么问题就可以及时修复，你的集群也可以进入移除 dockershim 前的就绪状态。
在 v1.24 支持结束后，如果出现影响集群的严重问题，
你需要联系你的 Kubernetes 供应商以获得支持或一次升级多个版本。

<!--
Your cluster might have more than one kind of node, although this is not a common
configuration.

These tasks will help you to migrate:

* [Check whether Dockershim removal affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
* [Migrate Docker Engine nodes from dockershim to cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
* [Migrating telemetry and security agents from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)
-->
你的集群中可以有不止一种类型的节点，尽管这不是常见的情况。

下面这些任务可以帮助你完成迁移：

* [检查移除 Dockershim 是否影响到你](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
* [将 Docker Engine 节点从 dockershim 迁移到 cri-dockerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
* [从 dockershim 迁移遥测和安全代理](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)

## {{% heading "whatsnext" %}}

<!--
* Check out [container runtimes](/docs/setup/production-environment/container-runtimes/)
  to understand your options for an alternative.
* If you find a defect or other technical concern relating to migrating away from dockershim,
  you can [report an issue](https://github.com/kubernetes/kubernetes/issues/new/choose)
  to the Kubernetes project.
-->
* 查看[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)了解可选的容器运行时。
* 如果你发现与 dockershim 迁移相关的缺陷或其他技术问题，
  可以在 Kubernetes 项目[报告问题](https://github.com/kubernetes/kubernetes/issues/new/choose)。
