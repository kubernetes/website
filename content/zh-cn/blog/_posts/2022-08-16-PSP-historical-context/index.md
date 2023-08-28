---
layout: blog
title: "PodSecurityPolicy：历史背景"
date: 2022-08-23T15:00:00-0800
slug: podsecuritypolicy-the-historical-context
evergreen: true
---

<!--
layout: blog
title: "PodSecurityPolicy: The Historical Context"
date: 2022-08-23T15:00:00-0800
slug: podsecuritypolicy-the-historical-context
evergreen: true
-->

<!--
**Author:** Mahé Tardy (Quarkslab)
-->
**作者：** Mahé Tardy (Quarkslab)

<!--
The PodSecurityPolicy (PSP) admission controller has been removed, as of
Kubernetes v1.25. Its deprecation was announced and detailed in the blog post
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/),
published for the Kubernetes v1.21 release.
-->
从 Kubernetes v1.25 开始，PodSecurityPolicy (PSP) 准入控制器已被移除。 
在为 Kubernetes v1.21 发布的博文 [PodSecurityPolicy 弃用：过去、现在和未来](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/) 
中，已经宣布并详细说明了它的弃用情况。

<!--
This article aims to provide historical context on the birth and evolution of
PSP, explain why the feature never made it to stable, and show why it was
removed and replaced by Pod Security admission control.
-->
本文旨在提供 PSP 诞生和演变的历史背景，解释为什么从未使该功能达到稳定状态，并说明为什么它被移除并被 Pod 安全准入控制取代。

<!--
PodSecurityPolicy, like other specialized admission control plugins, provided
fine-grained permissions on specific fields concerning the pod security settings
as a built-in policy API. It acknowledged that cluster administrators and
cluster users are usually not the same people, and that creating workloads in
the form of a Pod or any resource that will create a Pod should not equal being
"root on the cluster". It could also encourage best practices by configuring
more secure defaults through mutation and decoupling low-level Linux security
decisions from the deployment process.
-->
PodSecurityPolicy 与其他专门的准入控制插件一样，作为内置的策略 API，对有关 Pod 安全设置的特定字段提供细粒度的权限。
它承认集群管理员和集群用户通常不是同一个人，并且以 Pod 形式或任何将创建 Pod 的资源的形式创建工作负载的权限不应该等同于“集群上的 root 账户”。
它还可以通过变更配置来应用更安全的默认值，并将底层 Linux 安全决策与部署过程分离来促进最佳实践。

<!--
## The birth of PodSecurityPolicy

PodSecurityPolicy originated from OpenShift's SecurityContextConstraints
(SCC) that were in the very first release of the Red Hat OpenShift Container Platform,
even before Kubernetes 1.0. PSP was a stripped-down version of the SCC.
-->
## PodSecurityPolicy 的诞生

PodSecurityPolicy 源自 OpenShift 的 SecurityContextConstraints (SCC)，
它出现在 Red Hat OpenShift 容器平台的第一个版本中，甚至在 Kubernetes 1.0 之前。PSP 是 SCC 的精简版。

<!--
The origin of the creation of PodSecurityPolicy is difficult to track, notably
because it was mainly added before Kubernetes Enhancements Proposal (KEP)
process, when design proposals were still a thing. Indeed, the archive of the final
[design proposal](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/pod-security-policy.md)
is still available. Nevertheless, a [KEP issue number five](https://github.com/kubernetes/enhancements/issues/5) 
was created after the first pull requests were merged.
-->
PodSecurityPolicy 的创建起源很难追踪，特别是因为它主要是在 Kubernetes 增强提案 (KEP) 流程之前添加的，
当时仍在使用设计提案（Design Proposal）。事实上，最终[设计提案](https://github.com/kubernetes/design-proposals-archive/blob/main/auth/pod-security-policy.md)的存档仍然可以找到。
尽管如此，[编号为 5 的 KEP](https://github.com/kubernetes/enhancements/issues/5)
是在合并第一个拉取请求后创建的。

<!--
Before adding the first piece of code that created PSP, two main pull
requests were merged into Kubernetes, a [`SecurityContext` subresource](https://github.com/kubernetes/kubernetes/pull/7343)
that defined new fields on pods' containers, and the first iteration of the [ServiceAccount](https://github.com/kubernetes/kubernetes/pull/7101)
API.
-->
在添加创建 PSP 的第一段代码之前，两个主要的拉取请求被合并到 Kubernetes 中，
[`SecurityContext` 子资源](https://github.com/kubernetes/kubernetes/pull/7343)
定义了 Pod 容器上的新字段，以及 [ServiceAccount](https://github.com/kubernetes/kubernetes/pull/7101) 
API 的第一次迭代。


<!--
Kubernetes 1.0 was released on 10 July 2015 without any mechanism to restrict the
security context and sensitive options of workloads, other than an alpha-quality
SecurityContextDeny admission plugin (then known as `scdeny`).
The [SecurityContextDeny plugin](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#securitycontextdeny)
is still in Kubernetes today (as an alpha feature) and creates an admission controller that
prevents the usage of some fields in the security context.
-->
Kubernetes 1.0 于 2015 年 7 月 10 日发布，除了 Alpha 阶段的 SecurityContextDeny 准入插件
（当时称为 `scdeny`）之外，
没有任何机制来限制安全上下文和工作负载的敏感选项。
[SecurityContextDeny 插件](https://kubernetes.io/docs/reference/access-authn-authz/admission-controllers/#securitycontextdeny)
今天仍存在于 Kubernetes 中（作为 Alpha 特性），负责创建一个准入控制器，以防止在安全上下文中使用某些字段。

<!--
The roots of the PodSecurityPolicy were added with
[the very first pull request on security policy](https://github.com/kubernetes/kubernetes/pull/7893),
which added the design proposal with the new PSP object, based on the SCC (Security Context Constraints). It
was a long discussion of nine months, with back and forth from OpenShift's SCC,
many rebases, and the rename to PodSecurityPolicy that finally made it to
upstream Kubernetes in February 2016. Now that the PSP object
had been created, the next step was to add an admission controller that could enforce
these policies. The first step was to add the admission
[without taking into account the users or groups](https://github.com/kubernetes/kubernetes/pull/7893#issuecomment-180410539).
A specific [issue to bring PodSecurityPolicy to a usable state](https://github.com/kubernetes/kubernetes/issues/23217)
was added to keep track of the progress and a first version of the admission
controller was merged in [pull request named PSP admission](https://github.com/kubernetes/kubernetes/pull/24600)
in May 2016. Then around two months later, Kubernetes 1.3 was released.
-->
PodSecurityPolicy 的根源是[早期关于安全策略的一个拉取请求](https://github.com/kubernetes/kubernetes/pull/7893)，
它以 SCC（安全上下文约束）为基础，增加了新的 PSP 对象的设计方案。这是一个长达 9 个月的漫长讨论，
基于 OpenShift 的 SCC 反复讨论，
多次变动，并重命名为 PodSecurityPolicy，最终在 2016 年 2 月进入上游 Kubernetes。
现在 PSP 对象已经创建，下一步是添加一个可以执行这些政策的准入控制器。
第一步是添加[不考虑用户或组](https://github.com/kubernetes/kubernetes/pull/7893#issuecomment-180410539)
的准入控制。
2016 年 5 月，一个特定的[使 PodSecurityPolicy 达到可用状态的问题](https://github.com/kubernetes/kubernetes/issues/23217)被添加进来，
以跟踪进展，并在[名为 PSP 准入的拉取请求](https://github.com/kubernetes/kubernetes/pull/24600)中合并了准入控制器的第一个版本。
然后大约两个月后，发布了 Kubernetes 1.3。


<!--
Here is a timeline that recaps the main pull requests of the birth of the
PodSecurityPolicy and its admission controller with 1.0 and 1.3 releases as
reference points.
-->
下面是一个时间表，它以 1.0 和 1.3 版本作为参考点，回顾了 PodSecurityPolicy 及其准入控制器诞生的主要拉取请求。

{{< figure src="./timeline.svg" alt="Timeline of the PodSecurityPolicy creation pull requests" >}}

<!--
After that, the PSP admission controller was enhanced by adding what was initially
left aside. [The authorization mechanism](https://github.com/kubernetes/kubernetes/pull/33080),
merged in early November 2016 allowed administrators to use multiple policies
in a cluster to grant different levels of access for different types of users.
Later, a [pull request](https://github.com/kubernetes/kubernetes/pull/52849)
merged in October 2017 fixed [a design issue](https://github.com/kubernetes/kubernetes/issues/36184)
on ordering PodSecurityPolicies between mutating and alphabetical order, and continued to
build the PSP admission as we know it. After that, many improvements and fixes
followed to build the PodSecurityPolicy feature of recent Kubernetes releases.
-->
之后，PSP 准入控制器通过添加最初被搁置的内容进行了增强。
在 2016 年 11 月上旬合并[鉴权机制](https://github.com/kubernetes/kubernetes/pull/33080)，
允许管理员在集群中使用多个策略，为不同类型的用户授予不同级别的访问权限。
后来，2017 年 10 月合并的一个[拉取请求](https://github.com/kubernetes/kubernetes/pull/52849) 
修复了 PodSecurityPolicies 在变更和字母顺序之间冲突的[设计问题](https://github.com/kubernetes/kubernetes/issues/36184)，
并继续构建我们所知道的 PSP 准入。之后，进行了许多改进和修复，以构建最近 Kubernetes 版本的 PodSecurityPolicy 功能。


<!--
## The rise of Pod Security Admission 

Despite the crucial issue it was trying to solve, PodSecurityPolicy presented
some major flaws:
-->
## Pod 安全准入的兴起

尽管 PodSecurityPolicy 试图解决的是一个关键问题，但它却包含一些重大缺陷：

<!--
- **Flawed authorization model** - users can create a pod if they have the
  **use** verb on the PSP that allows that pod or the pod's service account has
  the **use** permission on the allowing PSP.
- **Difficult to roll out** - PSP fail-closed. That is, in the absence of a policy,
  all pods are denied. It mostly means that it cannot be enabled by default and
  that users have to add PSPs for all workloads before enabling the feature,
  thus providing no audit mode to discover which pods would not be allowed by
  the new policy. The opt-in model also leads to insufficient test coverage and
  frequent breakage due to cross-feature incompatibility. And unlike RBAC,
  there was no strong culture of shipping PSP manifests with projects.
- **Inconsistent unbounded API** - the API has grown with lots of
  inconsistencies notably because of many requests for niche use cases: e.g.
  labels, scheduling, fine-grained volume controls, etc. It has poor
  composability with a weak prioritization model, leading to unexpected
  mutation priority. It made it really difficult to combine PSP with other
  third-party admission controllers.
- **Require security knowledge** - effective usage still requires an
  understanding of Linux security primitives. e.g. MustRunAsNonRoot +
  AllowPrivilegeEscalation.
-->
- **有缺陷的鉴权模式** - 如果用户针对 PSP 具有执行 **use** 动作的权限，而此 PSP 准许该 Pod
  或者该 Pod 的服务帐户对 PSP 执行 **use** 操作，则用户可以创建一个 Pod。
- **难以推广** - PSP 失败关闭。也就是说，在没有策略的情况下，所有 Pod 都会被拒绝。
  这主要意味着默认情况下无法启用它，并且用户必须在启用该功能之前为所有工作负载添加 PSP，
  因此没有提供审计模式来发现哪些 Pod 会不被新策略所允许。
  这种采纳模式还导致测试覆盖率不足，并因跨特性不兼容而经常出现故障。
  而且与 RBAC 不同的是，还不存在在项目中交付 PSP 清单的强大文化。
- **不一致的无边界 API** - API 的发展有很多不一致的地方，特别是由于许多小众场景的请求：
  如标签、调度、细粒度的卷控制等。它的可组合性很差，优先级模型较弱，会导致意外的变更优先级。
  这使得 PSP 与其他第三方准入控制器的结合真的很困难。
- **需要安全知识** - 有效使用 PSP 仍然需要了解 Linux 的安全原语。
  例如：MustRunAsNonRoot + AllowPrivilegeEscalation。

<!--
The experience with PodSecurityPolicy concluded that most users care for two or three
policies, which led to the creation of the [Pod Security Standards](/docs/concepts/security/pod-security-standards/),
that define three policies:
- **Privileged** - unrestricted policy.
- **Baseline** - minimally restrictive policy, allowing the default pod
  configuration.
- **Restricted** - security best practice policy.
-->
PodSecurityPolicy 的经验得出的结论是，大多数用户关心两个或三个策略，这导致了
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)的创建，它定义了三个策略：
- **Privileged（特权的）** - 策略不受限制。
- **Baseline（基线的）** - 策略限制很少，允许默认 Pod 配置。
- **Restricted（受限的）** - 安全最佳实践策略。

<!--
The replacement for PSP, the new [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
is an in-tree, stable for Kubernetes v1.25, admission plugin to enforce these
standards at the namespace level. It makes it easier to enforce basic pod
security without deep security knowledge. For more sophisticated use cases, you
might need a third-party solution that can be easily combined with Pod Security
Admission.
-->
作为 PSP 的替代品，新的 [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)是
Kubernetes v1.25 的树内稳定的准入插件，用于在命名空间级别强制执行这些标准。
无需深入的安全知识，就可以更轻松地实施基本的 Pod 安全性。
对于更复杂的用例，你可能需要一个可以轻松与 Pod 安全准入结合的第三方解决方案。

<!--
## What's next

For further details on the SIG Auth processes, covering PodSecurityPolicy removal and
creation of Pod Security admission, the
[SIG auth update at KubeCon NA 2019](https://www.youtube.com/watch?v=SFtHRmPuhEw)
and the [PodSecurityPolicy Replacement: Past, Present, and Future](https://www.youtube.com/watch?v=HsRRmlTJpls)
presentation at KubeCon NA 2021 records are available.
-->
## 下一步是什么

有关 SIG Auth 流程的更多详细信息，包括 PodSecurityPolicy 删除和 Pod 安全准入的创建，
请参阅在 KubeCon NA 2021 的
[SIG auth update at KubeCon NA 2019](https://www.youtube.com/watch?v=SFtHRmPuhEw) 和 
[PodSecurityPolicy Replacement: Past, Present, and Future](https://www.youtube.com/watch?v=HsRRmlTJpls)
演示录像。

<!--
Particularly on the PSP removal, the
[PodSecurityPolicy Deprecation: Past, Present, and Future](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)
blog post is still accurate.
-->
特别是在 PSP 移除方面，[PodSecurityPolicy 弃用：过去、现在和未来](/blog/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/)博客文章仍然是准确的。

<!--
And for the new Pod Security admission,
[documentation is available](/docs/concepts/security/pod-security-admission/).
In addition, the blog post
[Kubernetes 1.23: Pod Security Graduates to Beta](/blog/2021/12/09/pod-security-admission-beta/)
along with the KubeCon EU 2022 presentation
[The Hitchhiker's Guide to Pod Security](https://www.youtube.com/watch?v=gcz5VsvOYmI)
give great hands-on tutorials to learn.
-->
对于新的 Pod 安全许可，[可以访问文档](/zh-cn/docs/concepts/security/pod-security-admission/)。
此外，博文 [Kubernetes 1.23: Pod Security Graduers to Beta](/blog/2021/12/09/pod-security-admission-beta/)
以及 KubeCon EU 2022 演示文稿 [the Hitchhicker’s Guide to Pod Security](https://www.youtube.com/watch?v=gcz5VsvOYmI)
提供了很好的实践教程来学习。