---
layout: blog
title: "Ingress NGINX 退役：你需要了解的内容"
slug: ingress-nginx-retirement
date: 2025-11-11T10:30:00-08:00
author: >
  Tabitha Sable (Kubernetes SRC)
translator: >
  [Xin Li](https://github.com/my-git9) (DaoCloud)
---
<!--
layout: blog
title: "Ingress NGINX Retirement: What You Need to Know"
slug: ingress-nginx-retirement
canonicalUrl: https://www.kubernetes.dev/blog/2025/11/12/ingress-nginx-retirement
date: 2025-11-11T10:30:00-08:00
author: >
  Tabitha Sable (Kubernetes SRC)
-->

<!--
To prioritize the safety and security of the ecosystem, Kubernetes SIG Network and the Security Response Committee are announcing the upcoming retirement of [Ingress NGINX](https://github.com/kubernetes/ingress-nginx/). Best-effort maintenance will continue until March 2026. Afterward, there will be no further releases, no bugfixes, and no updates to resolve any security vulnerabilities that may be discovered. **Existing deployments of Ingress NGINX will continue to function and installation artifacts will remain available.**

We recommend migrating to one of the many alternatives. Consider [migrating to Gateway API](https://gateway-api.sigs.k8s.io/guides/), the modern replacement for Ingress. If you must continue using Ingress, many alternative Ingress controllers are [listed in the Kubernetes documentation](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/). Continue reading for further information about the history and current state of Ingress NGINX, as well as next steps.
-->
为了优先考虑生态系统的安全，Kubernetes SIG Network 和安全响应委员会宣布
[Ingress NGINX](https://github.com/kubernetes/ingress-nginx/) 即将退役，
并将尽力将其维护期持续到 2026 年 3 月。
之后，将不再有进一步的版本发布、错误修复和更新来解决可能发现的任何安全漏洞。
**现有的 Ingress NGINX Deployment 将继续运行，并且安装工件仍将可用。**

我们建议迁移到替代方案之一。考虑[迁移到 Gateway API](https://gateway-api.sigs.k8s.io/guides/)，
这是 Ingress 的现代替代品。如果你必须继续使用 Ingress，许多替代的 Ingress 控制器已在
[Kubernetes 文档中列出](/zh-cn/docs/concepts/services-networking/ingress-controllers/)。
下文介绍有关 Ingress NGINX 的历史和当前状态以及后续步骤的更多信息。

<!--
## About Ingress NGINX

[Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) is the original user-friendly way to direct network traffic to workloads running on Kubernetes. ([Gateway API](https://kubernetes.io/docs/concepts/services-networking/gateway/) is a newer way to achieve many of the same goals.) In order for an Ingress to work in your cluster, there must be an [Ingress controller](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) running. There are many Ingress controller choices available, which serve the needs of different users and use cases. Some are cloud-provider specific, while others have more general applicability.

[Ingress NGINX](https://www.github.com/kubernetes/ingress-nginx) was an Ingress controller, developed early in the history of the Kubernetes project as an example implementation of the API. It became very popular due to its tremendous flexibility, breadth of features, and independence from any particular cloud or infrastructure provider. Since those days, many other Ingress controllers have been created within the Kubernetes project by community groups, and by cloud native vendors. Ingress NGINX has continued to be one of the most popular, deployed as part of many hosted Kubernetes platforms and within innumerable independent users’ clusters.
-->
## 关于 Ingress NGINX

[Ingress](https://kubernetes.io/zh-cn/docs/concepts/services-networking/ingress/)
是将网络流量导向运行在 Kubernetes 上的工作负载的原生的、用户友好的方式。
（[Gateway API](https://kubernetes.io/zh-cn/docs/concepts/services-networking/gateway/) 是实现许多相同目标的新方法。）
为了使 Ingress 在集群中工作，你必须运行一个
[Ingress 控制器](https://kubernetes.io/zh-cn/docs/concepts/services-networking/ingress-controllers/)。
有多种 Ingress 控制器可供选择，可以满足不同用户和使用场景的需求。
有些是特定于云提供商的，而其他的则具有更广泛的应用性。

[Ingress NGINX](https://www.github.com/kubernetes/ingress-nginx)
是一个 Ingress 控制器，作为 API 的示例实现，在 Kubernetes 项目早期开发。
由于其极大的灵活性、丰富的特性以及不依赖于任何特定的云或基础设施提供商，它变得非常流行。
自那时以来，许多其他的 Ingress 控制器已经在 Kubernetes 项目中由社区小组和云原生供应商创建。
Ingress NGINX 一直是其中最受欢迎的选择之一，被部署在许多托管的 Kubernetes
平台上以及无数独立用户的集群中。

<!--
## History and Challenges

The breadth and flexibility of Ingress NGINX has caused maintenance challenges. Changing expectations about cloud native software have also added complications. What were once considered helpful options have sometimes come to be considered serious security flaws, such as the ability to add arbitrary NGINX configuration directives via the "snippets" annotations. Yesterday’s flexibility has become today’s insurmountable technical debt.

Despite the project’s popularity among users, Ingress NGINX has always struggled with insufficient or barely-sufficient maintainership. For years, the project has had only one or two people doing development work, on their own time, after work hours and on weekends. Last year, the Ingress NGINX maintainers [announced](https://kccncna2024.sched.com/event/1hoxW/securing-the-future-of-ingress-nginx-james-strong-isovalent-marco-ebert-giant-swarm) their plans to wind down Ingress NGINX and develop a replacement controller together with the Gateway API community. Unfortunately, even that announcement failed to generate additional interest in helping maintain Ingress NGINX or develop InGate to replace it. (InGate development never progressed far enough to create a mature replacement; it will also be retired.)
-->
## 历史与挑战

Ingress NGINX 的广度和灵活性导致了维护上的挑战，对于云原生软件不断变化的期望也增加了复杂性。
其中曾经被认为是有帮助的选项，有时却被视为严重的安全缺陷，例如通过“片段”注解添加任意 NGINX 配置指令的能力。
昨天的灵活性已成为今天的难以克服的技术债务。

尽管该项目在用户中非常受欢迎，但 Ingress NGINX 一直存在一个问题，就是维护者很少、勉强应付。
多年来，项目仅有的一到两个人在其业余时间、下班后和周末进行开发工作。去年，Ingress NGINX
维护者[宣布](/zh-cn/docs/contribute/blog/securing-the-future-of-ingress-nginx)
他们的计划是逐步停止 Ingress NGINX，并与 Gateway API 社区一起开发替代控制器。
不幸的是，即使是这样的公告也未能激起更多兴趣来帮助维护 Ingress NGINX 或开发 InGate 以取代它。
（InGate 的开发从未进展到足以创建一个成熟的替代品；它也将被退役。）

<!--
## Current State and Next Steps

Currently, Ingress NGINX is receiving best-effort maintenance. SIG Network and the Security Response Committee have exhausted our efforts to find additional support to make Ingress NGINX sustainable. To prioritize user safety, we must retire the project.

In March 2026, Ingress NGINX maintenance will be halted, and the project will be [retired](https://github.com/kubernetes-retired/). After that time, there will be no further releases, no bugfixes, and no updates to resolve any security vulnerabilities that may be discovered. The GitHub repositories will be made read-only and left available for reference.
-->
## 当前状态与下一步

目前，Ingress NGINX 的维护模式是尽力而为的。
SIG Network 和安全响应委员会已经用尽全力寻找额外的支持来使 Ingress NGINX 可持续发展。
为了优先考虑用户的安全，我们必须停止该项目。

2026 年 3 月，Ingress NGINX 的维护将被停止，项目将被[退役](https://github.com/kubernetes-retired/)。
之后，将不再有进一步的版本发布、错误修复或更新来解决可能发现的任何安全漏洞。
GitHub 仓库将变为只读，并留作参考。

<!--
Existing deployments of Ingress NGINX will not be broken. Existing project artifacts such as Helm charts and container images will remain available.

In most cases, you can check whether you use Ingress NGINX by running `kubectl get pods \--all-namespaces \--selector app.kubernetes.io/name=ingress-nginx` with cluster administrator permissions.
-->
现有的 Ingress NGINX 部署不会受到影响。现有的项目制品，如 Helm 图表和容器镜像，仍将保持可用。

在大多数情况下，你可以通过运行 `kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx`
来检查是否使用了 Ingress NGINX，这需要集群管理员权限。

<!--
We would like to thank the Ingress NGINX maintainers for their work in creating and maintaining this project–their dedication remains impressive. This Ingress controller has powered billions of requests in datacenters and homelabs all around the world. In a lot of ways, Kubernetes wouldn’t be where it is without Ingress NGINX, and we are grateful for so many years of incredible effort.

**SIG Network and the Security Response Committee recommend that all Ingress NGINX users begin migration to Gateway API or another Ingress controller immediately.** Many options are listed in the Kubernetes documentation: [Gateway API](https://gateway-api.sigs.k8s.io/guides/), [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/). Additional options may be available from vendors you work with.
-->
我们想感谢 Ingress NGINX 的维护者们在创建和维护此项目中所做的工作——他们的奉献精神令人印象深刻。
这个 Ingress 控制器在全球的数据中心和家庭实验室中处理了数十亿次请求。
在很多方面，如果没有 Ingress NGINX，Kubernetes 不会取得如今的成就，我们对如此多年的杰出努力表示感激。

**SIG Network 和安全响应委员会建议所有 Ingress NGINX 用户立即开始迁移到 Gateway API
或其他 Ingress 控制器。
** Kubernetes 文档中列出了许多选项：[Gateway API](https://gateway-api.sigs.k8s.io/guides/)、
[Ingress](https://kubernetes.io/zh-cn/docs/concepts/services-networking/ingress-controllers/)。
与你合作的供应商可能还提供其他选项。
