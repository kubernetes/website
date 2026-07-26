---
layout: blog
title: '更新 NGINX-Ingress 以使用稳定的 Ingress API'
date: 2021-07-26
slug: update-with-ingress-nginx
---
<!--
layout: blog
title: 'Updating NGINX-Ingress to use the stable Ingress API'
date: 2021-07-26
slug: update-with-ingress-nginx
-->

<!--
**Authors:** James Strong, Ricardo Katz
-->
**作者：** James Strong, Ricardo Katz

<!--
With all Kubernetes APIs, there is a process to creating, maintaining, and
ultimately deprecating them once they become GA. The networking.k8s.io API group is no
different. The upcoming Kubernetes 1.22 release will remove several deprecated APIs
that are relevant to networking:
-->
对于所有 Kubernetes API，一旦它们被正式发布（GA），就有一个创建、维护和最终弃用它们的过程。
networking.k8s.io API 组也不例外。
即将发布的 Kubernetes 1.22 版本将移除几个与网络相关的已弃用 API：

<!--
- the `networking.k8s.io/v1beta1` API version of [IngressClass](/docs/concepts/services-networking/ingress/#ingress-class)
- all beta versions of [Ingress](/docs/concepts/services-networking/ingress/): `extensions/v1beta1` and `networking.k8s.io/v1beta1`
-->
- [IngressClass](/zh-cn/docs/concepts/services-networking/ingress/#ingress-class) 的 `networking.k8s.io/v1beta1` API 版本
- [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 的所有 Beta 版本: `extensions/v1beta1` 和 `networking.k8s.io/v1beta1`

<!--
On a v1.22 Kubernetes cluster, you'll be able to access Ingress and IngressClass
objects through the stable (v1) APIs, but access via their beta APIs won't be possible.
-->
在 v1.22 Kubernetes 集群上，你能够通过稳定版本（v1）的 API 访问 Ingress 和 IngressClass 对象，
但无法通过其 Beta API 访问。 
<!--
This change has been in
in discussion since
[2017](https://github.com/kubernetes/kubernetes/issues/43214),
[2019](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) with 
1.16 Kubernetes API deprecations, and most recently in
KEP-1453: 
[Graduate Ingress API to GA](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/1453-ingress-api#122).
-->
自 [2017](https://github.com/kubernetes/kubernetes/issues/43214)、
[2019](https://kubernetes.io/blog/2019/07/18/api-deprecations-in-1-16/) 
以来一直讨论关于 Kubernetes 1.16 弃用 API 的更改，
最近的讨论是在 KEP-1453：[Ingress API 毕业到 GA](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/1453-ingress-api#122)。

<!--
During community meetings, the networking Special Interest Group has decided to continue 
supporting Kubernetes versions older than 1.22 with Ingress-NGINX version 0.47.0. 
Support for Ingress-NGINX will continue for six months after Kubernetes 1.22 
is released. Any additional bug fixes and CVEs for Ingress-NGINX will be 
addressed on a need-by-need basis.
-->
在社区会议中，网络特别兴趣小组决定继续支持带有 0.47.0 版本 Ingress-NGINX 的早于 1.22 版本的 Kubernetes。
在 Kubernetes 1.22 发布后，对 Ingress-NGINX 的支持将持续六个月。
团队会根据需要解决 Ingress-NGINX 的额外错误修复和 CVE 问题。

<!--
Ingress-NGINX will have separate branches and releases of Ingress-NGINX to 
support this model, mirroring the Kubernetes project process. Future 
releases of the Ingress-NGINX project will track and support the latest 
versions of Kubernetes.
-->
Ingress-NGINX 将拥有独立的分支和发布版本来支持这个模型，与 Kubernetes 项目流程相一致。
Ingress-NGINX 项目的未来版本将跟踪和支持最新版本的 Kubernetes。

<!--
{{< table caption="Ingress NGINX supported version with Kubernetes Versions" >}}
Kubernetes 版本  | Ingress-NGINX version | Notes
:-------------------|:----------------------|:------------
v1.22              | v1.0.0-alpha.2     | New features, plus bug fixes.
v1.21              | v0.47.x        | Bugfixes only, and just for security issues or crashes. No end-of-support date announced.
v1.20              | v0.47.x        | Bugfixes only, and just  for security issues or crashes. No end-of-support date announced.
v1.19              | v0.47.x        | Bugfixes only, and just  for security issues or crashes. Fixes only provided until 6 months after Kubernetes v1.22.0 is released.
{{< /table >}}    
-->
{{< table caption="Kubernetes 各版本支持的 Ingress NGINX 版本" >}}
Kubernetes 版本  | Ingress-NGINX 版本 | 公告
:-------------------|:----------------------|:------------
v1.22              | v1.0.0-alpha.2     | 新特性，以及错误修复。
v1.21              | v0.47.x        | 仅修复安全问题或系统崩溃的错误。没有宣布终止支持日期。
v1.20              | v0.47.x        | 仅修复安全问题或系统崩溃的错误。没有宣布终止支持日期。
v1.19              | v0.47.x        | 仅修复安全问题或系统崩溃的错误。仅在 Kubernetes v1.22.0 发布后的 6 个月内提供修复支持。
{{< /table >}}    

<!--
Because of the updates in Kubernetes 1.22, **v0.47.0** will not work with 
Kubernetes 1.22. 
-->
由于 Kubernetes 1.22 中的更新，**v0.47.0** 将无法与 Kubernetes 1.22 一起使用。 

<!--
# What you need to do
-->
## 你需要做什么

<!--
The team is currently in the process of upgrading ingress-nginx to support 
the v1 migration, you can track the progress 
[here](https://github.com/kubernetes/ingress-nginx/pull/7156).  
We're not making feature improvements to `ingress-nginx` until after the support for
Ingress v1 is complete.
-->
团队目前正在升级 Ingress-NGINX 以支持向 v1 的迁移，
你可以在[此处](https://github.com/kubernetes/ingress-nginx/pull/7156)跟踪进度。
在对 Ingress v1 的支持完成之前，
我们不会对功能进行改进。

<!--
In the meantime to ensure no compatibility issues: 
-->
同时，团队会确保没有兼容性问题：

<!--
* Update to the latest version of Ingress-NGINX; currently
  [v0.47.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v0.47.0) 
-->
* 更新到最新的 Ingress-NGINX 版本，
  目前是 [v0.47.0](https://github.com/kubernetes/ingress-nginx/releases/tag/controller-v0.47.0)。 
<!--
* After Kubernetes 1.22 is released, ensure you are using the latest version of 
  Ingress-NGINX that supports the stable APIs for Ingress and IngressClass.
-->  
* Kubernetes 1.22 发布后，请确保使用的是支持 Ingress 和 IngressClass 稳定 API 的最新版本的 Ingress-NGINX。
<!--
* Test Ingress-NGINX version v1.0.0-alpha.2 with Cluster versions >= 1.19 
  and report any issues to the projects Github page. 
-->
* 使用集群版本 >= 1.19 测试 Ingress-NGINX 版本 v1.0.0-alpha.2，并将任何问题报告给项目 GitHub 页面。

<!--
The community’s feedback and support in this effort is welcome. The
Ingress-NGINX Sub-project regularly holds community meetings where we discuss
this and other issues facing the project. For more information on the sub-project, 
please see [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network).
-->
欢迎社区对此工作的反馈和支持。
Ingress-NGINX 子项目定期举行社区会议，
我们会讨论这个问题以及项目面临的其他问题。
有关子项目的更多信息，请参阅 [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network)。
