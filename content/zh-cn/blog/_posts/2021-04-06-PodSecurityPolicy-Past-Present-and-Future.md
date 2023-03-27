---
layout: blog
title: "弃用 PodSecurityPolicy：过去、现在、未来"
date: 2021-04-06
slug: podsecuritypolicy-deprecation-past-present-and-future
---
<!--
title: "PodSecurityPolicy Deprecation: Past, Present, and Future"
-->

<!--
**Author:** Tabitha Sable (Kubernetes SIG Security)
-->
作者：Tabitha Sable（Kubernetes SIG Security）

{{% pageinfo color="primary" %}}
<!--
**Update:** *With the release of Kubernetes v1.25, PodSecurityPolicy has been removed.*
-->
**更新：随着 Kubernetes v1.25 的发布，PodSecurityPolicy 已被删除。**

<!--
*You can read more information about the removal of PodSecurityPolicy in the
[Kubernetes 1.25 release notes](/blog/2022/08/23/kubernetes-v1-25-release/#pod-security-changes).*
-->
**你可以在 [Kubernetes 1.25 发布说明](/zh-cn/blog/2022/08/23/kubernetes-v1-25-release/#pod-security-changes)
中阅读有关删除 PodSecurityPolicy 的更多信息。**

{{% /pageinfo %}}

<!--
PodSecurityPolicy (PSP) is being deprecated in Kubernetes 1.21, to be released later this week.
This starts the countdown to its removal, but doesn’t change anything else.
PodSecurityPolicy will continue to be fully functional for several more releases before being removed completely.
In the meantime, we are developing a replacement for PSP that covers key use cases more easily and sustainably.
-->
PodSecurityPolicy (PSP) 在 Kubernetes 1.21 中被弃用。<!--to be released later this week这句感觉没必要翻译，非漏译-->
PSP 日后会被移除，但目前不会改变任何其他内容。在移除之前，PSP 将继续在后续多个版本中完全正常运行。
与此同时，我们正在开发 PSP 的替代品，希望可以更轻松、更可持续地覆盖关键用例。

<!--
What are Pod Security Policies? Why did we need them? Why are they going away, and what’s next?
How does this affect you? These key questions come to mind as we prepare to say goodbye to PSP,
so let’s walk through them together. We’ll start with an overview of how features get removed from Kubernetes.
-->
什么是 PSP？为什么需要 PSP？为什么要弃用，未来又将如何发展？
这对你有什么影响？当我们准备告别 PSP，这些关键问题浮现在脑海中，
所以让我们一起来讨论吧。本文首先概述 Kubernetes 如何移除一些特性。

<!--
## What does deprecation mean in Kubernetes?
-->
## Kubernetes 中的弃用是什么意思？

<!--
Whenever a Kubernetes feature is set to go away, our [deprecation policy](/docs/reference/using-api/deprecation-policy/)
is our guide. First the feature is marked as deprecated, then after enough time has passed, it can finally be removed.
-->
每当 Kubernetes 决定弃用某项特性时，我们会遵循[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)。
首先将该特性标记为已弃用，然后经过足够长的时间后，最终将其移除。

<!--
Kubernetes 1.21 starts the deprecation process for PodSecurityPolicy. As with all feature deprecations,
PodSecurityPolicy will continue to be fully functional for several more releases.
The current plan is to remove PSP from Kubernetes in the 1.25 release.
-->
Kubernetes 1.21 启动了 PodSecurityPolicy 的弃用流程。与弃用任何其他功能一样，
PodSecurityPolicy 将继续在后续几个版本中完全正常运行。目前的计划是在 1.25 版本中将其移除。

<!--
Until then, PSP is still PSP. There will be at least a year during which the newest Kubernetes releases will
still support PSP, and nearly two years until PSP will pass fully out of all supported Kubernetes versions.
-->
在彻底移除之前，PSP 仍然是 PSP。至少在未来一年时间内，最新的 Kubernetes
版本仍将继续支持 PSP。大约两年之后，PSP 才会在所有受支持的 Kubernetes 版本中彻底消失。

<!--
## What is PodSecurityPolicy?
-->
## 什么是 PodSecurityPolicy？

<!--
[PodSecurityPolicy](/docs/concepts/security/pod-security-policy/) is
a built-in [admission controller](/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/)
that allows a cluster administrator to control security-sensitive aspects of the Pod specification.
-->
[PodSecurityPolicy](/zh-cn/docs/concepts/security/pod-security-policy/)
是一个内置的[准入控制器](/blog/2019/03/21/a-guide-to-kubernetes-admission-controllers/)，
允许集群管理员控制 Pod 规约中涉及安全的敏感内容。

<!--
First, one or more PodSecurityPolicy resources are created in a cluster to define the requirements Pods must meet.
Then, RBAC rules are created to control which PodSecurityPolicy applies to a given pod.
If a pod meets the requirements of its PSP, it will be admitted to the cluster as usual.
In some cases, PSP can also modify Pod fields, effectively creating new defaults for those fields.
If a Pod does not meet the PSP requirements, it is rejected, and cannot run.
-->
首先，在集群中创建一个或多个 PodSecurityPolicy 资源来定义 Pod 必须满足的要求。
然后，创建 RBAC 规则来决定为特定的 Pod 应用哪个 PodSecurityPolicy。
如果 Pod 满足其 PSP 的要求，则照常被允许进入集群。
在某些情况下，PSP 还可以修改 Pod 字段，有效地为这些字段创建新的默认值。
如果 Pod 不符合 PSP 要求，则被拒绝进入集群，并且无法运行。

<!--
One more important thing to know about PodSecurityPolicy: it’s not the same as
[PodSecurityContext](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context).
-->
关于 PodSecurityPolicy，还需要了解：它与
[PodSecurityContext](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) 不同。

<!--
A part of the Pod specification, PodSecurityContext (and its per-container counterpart `SecurityContext`)
is the collection of fields that specify many of the security-relevant settings for a Pod.
The security context dictates to the kubelet and container runtime how the Pod should actually be run.
In contrast, the PodSecurityPolicy only constrains (or defaults) the values that may be set on the security context.
-->
作为 Pod 规约的一部分，PodSecurityContext（及其每个容器对应的 `SecurityContext`）
是一组字段的集合，这些字段为 Pod 指定了与安全相关的许多设置。
安全上下文指示 kubelet 和容器运行时究竟应该如何运行 Pod。
相反，PodSecurityPolicy 仅约束可能在安全上下文中设置的值（或设置默认值）。

<!--
The deprecation of PSP does not affect PodSecurityContext in any way.
-->
弃用 PSP 不会以任何方式影响 PodSecurityContext。

<!--
## Why did we need PodSecurityPolicy?
-->
## 以前为什么需要 PodSecurityPolicy？

<!--
In Kubernetes, we define resources such as Deployments, StatefulSets, and Services that
represent the building blocks of software applications. The various controllers inside
a Kubernetes cluster react to these resources, creating further Kubernetes resources or
configuring some software or hardware to accomplish our goals.
-->
在 Kubernetes 中，我们定义了 Deployment、StatefulSet 和 Service 等资源。
这些资源代表软件应用程序的构建块。Kubernetes 集群中的各种控制器根据这些资源做出反应，
创建更多的 Kubernetes 资源或配置一些软件或硬件来实现我们的目标。

<!--
In most Kubernetes clusters, 
RBAC (Role-Based Access Control) [rules](/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)
control access to these resources. `list`, `get`, `create`, `edit`, and `delete` are
the sorts of API operations that RBAC cares about,
but _RBAC does not consider what settings are being put into the resources it controls_.
For example, a Pod can be almost anything from a simple webserver to
a privileged command prompt offering full access to the underlying server node and all the data.
It’s all the same to RBAC: a Pod is a Pod is a Pod.
-->
在大多数 Kubernetes 集群中，由 RBAC（基于角色的访问控制）[规则](/zh-cn/docs/reference/access-authn-authz/rbac/#role-and-clusterrole)
控制对这些资源的访问。 `list`、`get`、`create`、`edit` 和 `delete` 是 RBAC 关心的 API 操作类型，
但 **RBAC 不考虑其所控制的资源中加入了哪些设置**。例如，
Pod 几乎可以是任何东西，例如简单的网络服务器，或者是特权命令提示（提供对底层服务器节点和所有数据的完全访问权限）。
这对 RBAC 来说都是一样的：Pod 就是 Pod 而已。

<!--
To control what sorts of settings are allowed in the resources defined in your cluster,
you need Admission Control in addition to RBAC. Since Kubernetes 1.3,
PodSecurityPolicy has been the built-in way to do that for security-related Pod fields.
Using PodSecurityPolicy, you can prevent “create Pod” from automatically meaning “root on every cluster node,”
without needing to deploy additional external admission controllers.
-->
要控制集群中定义的资源允许哪些类型的设置，除了 RBAC 之外，还需要准入控制。
从 Kubernetes 1.3 开始，内置 PodSecurityPolicy 一直被作为 Pod 安全相关字段的准入控制机制。
使用 PodSecurityPolicy，可以防止“创建 Pod”这个能力自动变成“每个集群节点上的 root 用户”，
并且无需部署额外的外部准入控制器。

<!--
## Why is PodSecurityPolicy going away?
-->
## 现在为什么 PodSecurityPolicy 要消失？

<!--
In the years since PodSecurityPolicy was first introduced, we have realized that
PSP has some serious usability problems that can’t be addressed without making breaking changes.
-->
自从首次引入 PodSecurityPolicy 以来，我们已经意识到 PSP 存在一些严重的可用性问题，
只有做出断裂式的改变才能解决。

<!--
The way PSPs are applied to Pods has proven confusing to nearly everyone that has attempted to use them.
It is easy to accidentally grant broader permissions than intended,
and difficult to inspect which PSP(s) apply in a given situation. The “changing Pod defaults” feature can be handy,
but is only supported for certain Pod settings and it’s not obvious when they will or will not apply to your Pod.
Without a “dry run” or audit mode, it’s impractical to retrofit PSP to existing clusters safely,
and it’s impossible for PSP to ever be enabled by default.
-->
实践证明，PSP 应用于 Pod 的方式让几乎所有尝试使用它们的人都感到困惑。
很容易意外授予比预期更广泛的权限，并且难以查看某种特定情况下应用了哪些 PSP。
“更改 Pod 默认值”功能很方便，但仅支持某些 Pod 设置，而且无法明确知道它们何时会或不会应用于的 Pod。
如果没有“试运行”或审计模式，将 PSP 安全地改造并应用到现有集群是不切实际的，并且永远都不可能默认启用 PSP。

<!--
For more information about these and other PSP difficulties, check out
SIG Auth’s KubeCon NA 2019 Maintainer Track session video:{{< youtube "SFtHRmPuhEw?start=953" youtube-quote-sm >}}
-->
有关这些问题和其他 PSP 困难的更多信息，请查看
KubeCon NA 2019 的 SIG Auth 维护者频道会议记录：{{< youtube "SFtHRmPuhEw?start=953" youtube-quote-sm >}}

<!--
Today, you’re not limited only to deploying PSP or writing your own custom admission controller.
Several external admission controllers are available that incorporate lessons learned from PSP to
provide a better user experience. [K-Rail](https://github.com/cruise-automation/k-rail),
[Kyverno](https://github.com/kyverno/kyverno/), and
[OPA/Gatekeeper](https://github.com/open-policy-agent/gatekeeper/) are all well-known, and each has its fans.
-->
如今，你不再局限于部署 PSP 或编写自己的自定义准入控制器。
有几个外部准入控制器可用，它们结合了从 PSP 中吸取的经验教训以提供更好的用户体验。
[K-Rail](https://github.com/cruise-automation/k-rail)、
[Kyverno](https://github.com/kyverno/kyverno/)、
[OPA/Gatekeeper](https://github.com/open-policy-agent/gatekeeper/) 都家喻户晓，各有粉丝。

<!--
Although there are other good options available now, we believe there is still value in
having a built-in admission controller available as a choice for users. With this in mind,
we turn toward building what’s next, inspired by the lessons learned from PSP.
-->
尽管现在还有其他不错的选择，但我们认为，提供一个内置的准入控制器供用户选择，仍然是有价值的事情。
考虑到这一点，以及受 PSP 经验的启发，我们转向下一步。

<!--
## What’s next?
-->
## 下一步是什么？

<!--
Kubernetes SIG Security, SIG Auth, and a diverse collection of other community members
have been working together for months to ensure that what’s coming next is going to be awesome.
We have developed a Kubernetes Enhancement Proposal ([KEP 2579](https://github.com/kubernetes/enhancements/issues/2579))
and a prototype for a new feature, currently being called by the temporary name "PSP Replacement Policy."
We are targeting an Alpha release in Kubernetes 1.22.
-->
Kubernetes SIG Security、SIG Auth 和其他社区成员几个月来一直在倾力合作，确保接下来的方案能令人惊叹。
我们拟定了 Kubernetes 增强提案（[KEP 2579](https://github.com/kubernetes/enhancements/issues/2579)）
以及一个新功能的原型，目前称之为“PSP 替代策略”。
我们的目标是在 Kubernetes 1.22 中发布 Alpha 版本。

<!--
PSP Replacement Policy starts with the realization that
since there is a robust ecosystem of external admission controllers already available,
PSP’s replacement doesn’t need to be all things to all people.
Simplicity of deployment and adoption is the key advantage a built-in admission controller has
compared to an external webhook, so we have focused on how to best utilize that advantage.
-->
PSP 替代策略始于，我们认识到已经有一个强大的外部准入控制器生态系统可用，
所以，PSP 的替代品不需要满足所有人的所有需求。与外部 Webhook 相比，
部署和采用的简单性是内置准入控制器的关键优势。我们专注于如何最好地利用这一优势。

<!--
PSP Replacement Policy is designed to be as simple as practically possible
while providing enough flexibility to really be useful in production at scale.
It has soft rollout features to enable retrofitting it to existing clusters,
and is configurable enough that it can eventually be active by default.
It can be deactivated partially or entirely, to coexist with external admission controllers for advanced use cases.
-->
PSP 替代策略旨在尽可能简单，同时提供足够的灵活性以支撑大规模生产场景。
它具有柔性上线能力，以便于将其改装到现有集群，并且新的策略是可配置的，可以设置为默认启用。
PSP 替代策略可以被部分或全部禁用，以便在高级使用场景中与外部准入控制器共存。

<!--
## What does this mean for you?
-->
## 这对你意味着什么？

<!--
What this all means for you depends on your current PSP situation.
If you’re already using PSP, there’s plenty of time to plan your next move.
Please review the PSP Replacement Policy KEP and think about how well it will suit your use case.
-->
这一切对你意味着什么取决于你当前的 PSP 情况。如果已经在使用 PSP，那么你有足够的时间来计划下一步行动。
请查看 PSP 替代策略 KEP 并考虑它是否适合你的使用场景。

<!--
If you’re making extensive use of the flexibility of PSP with numerous PSPs and complex binding rules,
you will likely find the simplicity of PSP Replacement Policy too limiting.
Use the next year to evaluate the other admission controller choices in the ecosystem.
There are resources available to ease this transition,
such as the [Gatekeeper Policy Library](https://github.com/open-policy-agent/gatekeeper-library).
-->
如果你已经在通过众多 PSP 和复杂的绑定规则深度利用 PSP 的灵活性，你可能会发现 PSP 替代策略的简单性有太多限制。
此时，建议你在接下来的一年中评估一下生态系统中的其他准入控制器选择。有些资源可以让这种过渡更容易，
比如 [Gatekeeper Policy Library](https://github.com/open-policy-agent/gatekeeper-library)。

<!--
If your use of PSP is relatively simple, with a few policies and straightforward binding to
service accounts in each namespace, you will likely find PSP Replacement Policy to be a good match for your needs.
Evaluate your PSPs compared to the Kubernetes [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
to get a feel for where you’ll be able to use the Restricted, Baseline, and Privileged policies.
Please follow along with or contribute to the KEP and subsequent development,
and try out the Alpha release of PSP Replacement Policy when it becomes available.
-->
如果只是使用 PSP 的基础功能，只用几个策略并直接绑定到每个命名空间中的服务帐户，
你可能会发现 PSP 替代策略非常适合你的需求。
对比 Kubernetes [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/) 评估你的 PSP，
了解可以在哪些情形下使用限制策略、基线策略和特权策略。
欢迎关注或为 KEP 和后续发展做出贡献，并在可用时试用 PSP 替代策略的 Alpha 版本。

<!--
If you’re just beginning your PSP journey, you will save time and effort by keeping it simple.
You can approximate the functionality of PSP Replacement Policy today by using the Pod Security Standards’ PSPs.
If you set the cluster default by binding a Baseline or Restricted policy to the `system:serviceaccounts` group,
and then make a more-permissive policy available as needed in certain
Namespaces [using ServiceAccount bindings](/docs/concepts/policy/pod-security-policy/#run-another-pod),
you will avoid many of the PSP pitfalls and have an easy migration to PSP Replacement Policy.
If your needs are much more complex than this, your effort is probably better spent adopting
one of the more fully-featured external admission controllers mentioned above.
-->
如果刚刚开始 PSP 之旅，你可以通过保持简单来节省时间和精力。
你可以使用 Pod 安全标准的 PSP 来获得和目前 PSP 替代策略相似的功能。
如果你将基线策略或限制策略绑定到 `system:serviceaccounts` 组来设置集群默认值，
然后[使用 ServiceAccount 绑定](/zh-cn/docs/concepts/policy/pod-security-policy/#run-another-pod)
在某些命名空间下根据需要制定更宽松的策略，就可以避免许多 PSP 陷阱并轻松迁移到 PSP 替代策略。
如果你的需求比这复杂得多，那么建议将精力花在采用比上面提到的功能更全的某个外部准入控制器。

<!--
We’re dedicated to making Kubernetes the best container orchestration tool we can,
and sometimes that means we need to remove longstanding features to make space for better things to come.
When that happens, the Kubernetes deprecation policy ensures you have plenty of time to plan your next move.
In the case of PodSecurityPolicy, several options are available to suit a range of needs and use cases.
Start planning ahead now for PSP’s eventual removal, and please consider contributing to its replacement! Happy securing!
-->
我们致力于使 Kubernetes 成为我们可以做到的最好的容器编排工具，
有时这意味着我们需要删除长期存在的功能，以便为更好的特性腾出空间。
发生这种情况时，Kubernetes 弃用策略可确保你有足够的时间来计划下一步行动。
对于 PodSecurityPolicy，有几个选项可以满足一系列需求和用例。
现在就开始为 PSP 的最终移除提前制定计划，请考虑为它的替换做出贡献！<!--omitted "Happy securing!" as suggested-->

<!--
**Acknowledgment:** It takes a wonderful group to make wonderful software.
Thanks are due to everyone who has contributed to the PSP replacement effort,
especially (in alphabetical order) Tim Allclair, Ian Coldwater, and Jordan Liggitt.
It’s been a joy to work with y’all on this.
-->
**致谢：** 研发优秀的软件需要优秀的团队。感谢为 PSP 替代工作做出贡献的所有人，
尤其是（按字母顺序）Tim Allclair、Ian Coldwater 和 Jordan Liggitt。
和你们共事非常愉快。
