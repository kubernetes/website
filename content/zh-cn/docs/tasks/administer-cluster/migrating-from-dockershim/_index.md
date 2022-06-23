---
title: 从 dockershim 迁移
weight: 10
content_type: task 
no_list: true
---
<!-- 
title: "Migrating from dockershim"
weight: 10
content_type: task 
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
我们的[弃用  Dockershim 常见问题](/blog/2022/02/17/dockershim-faq/)可以帮助你更好地理解这个问题。

<!-- 
Dockershim was removed from Kubernetes with the release of v1.24.
If you use Docker Engine via dockershim as your container runtime, and wish to upgrade to v1.24,
it is recommended that you either migrate to another runtime or find an alternative means to obtain Docker Engine support.
-->
Dockershim 在 Kubernetes v1.24 版本已经被移除。
如果你集群内是通过 dockershim 使用 Docker Engine 作为容器运行时，并希望 Kubernetes 升级到 v1.24，
建议你迁移到其他容器运行时或使用其他方法以获得 Docker 引擎支持。

<!--
Check out [container runtimes](/docs/setup/production-environment/container-runtimes/)
section to know your options. Make sure to
[report issues](https://github.com/kubernetes/kubernetes/issues) you encountered
with the migration. So the issue can be fixed in a timely manner and your cluster would be
ready for dockershim removal.
-->
建议从 dockershim 迁移到其他替代的容器运行时。
请参阅[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)
一节以了解可用的备选项。
当在迁移过程中遇到麻烦，请[上报问题](https://github.com/kubernetes/kubernetes/issues)。
那么问题就可以及时修复，你的集群也可以进入移除 dockershim 前的就绪状态。

<!--
Your cluster might have more than one kind of node, although this is not a common
configuration.

These tasks will help you to migrate:

* [Check whether Dockershim deprecation affects you](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/)
* [Migrate Docker Engine nodes from dockershim to cri-dockerd](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
* [Migrating telemetry and security agents from dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)
-->
你的集群中可以有不止一种类型的节点，尽管这不是常见的情况。

下面这些任务可以帮助你完成迁移：

* [检查弃用 Dockershim 是否影响到你](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-deprecation-affects-you/)
* [将 Docker Engine 节点从 dockershim 迁移到 cri-dockerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
* [从 dockershim 迁移遥测和安全代理](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)

## {{% heading "whatsnext" %}}

<!--
* Check out [container runtimes](/docs/setup/production-environment/container-runtimes/)
  to understand your options for a container runtime.
* There is a
  [GitHub issue](https://github.com/kubernetes/kubernetes/issues/106917)
  to track discussion about the deprecation and removal of dockershim.
* If you found a defect or other technical concern relating to migrating away from dockershim,
  you can [report an issue](https://github.com/kubernetes/kubernetes/issues/new/choose)
  to the Kubernetes project.
-->
* 查看[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)了解可选的容器运行时。
* [GitHub 问题](https://github.com/kubernetes/kubernetes/issues/106917)跟踪有关
  dockershim 的弃用和删除的讨论。
* 如果你发现与 dockershim 迁移相关的缺陷或其他技术问题，
  可以在 Kubernetes 项目[报告问题](https://github.com/kubernetes/kubernetes/issues/new/choose)。

