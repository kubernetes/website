---
title: "从 dockershim 迁移"
weight: 10
content_type: task 
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
[弃用 dockershim](/zh/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)，
各类疑问随之而来：这对各类工作负载和 Kubernetes 部署会产生什么影响。
我们的[弃用  Dockershim 常见问题](/blog/2022/02/17/dockershim-faq/)可以帮助你更好地理解这个问题。

<!-- It is recommended to migrate from dockershim to alternative container runtimes.
Check out [container runtimes](/docs/setup/production-environment/container-runtimes/)
section to know your options. Make sure to
[report issues](https://github.com/kubernetes/kubernetes/issues) you encountered
with the migration. So the issue can be fixed in a timely manner and your cluster would be
ready for dockershim removal.
-->
建议从 dockershim 迁移到其他替代的容器运行时。
请参阅[容器运行时](/zh/docs/setup/production-environment/container-runtimes/)
一节以了解可用的备选项。
当在迁移过程中遇到麻烦，请[上报问题](https://github.com/kubernetes/kubernetes/issues)。
那么问题就可以及时修复，你的集群也可以进入移除 dockershim 前的就绪状态。
