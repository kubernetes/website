---
layout: blog
title: "Ingress NGINX：Kubernetes 指导委员会和安全响应委员会的声明"
date: 2026-01-29
slug: ingress-nginx-statement
author: >
  [Kat Cosgrove](https://github.com/katcosgrove)（指导委员会）
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "Ingress NGINX: Statement from the Kubernetes Steering and Security Response Committees"
date: 2026-01-29
slug: ingress-nginx-statement
author: >
  [Kat Cosgrove](https://github.com/katcosgrove) (Steering Committee)
-->

<!--
**In March 2026, Kubernetes will retire Ingress NGINX, a piece of critical infrastructure for about half of cloud native environments.** 
The retirement of Ingress NGINX was [announced](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/) for March 2026,
after years of [public warnings](https://groups.google.com/a/kubernetes.io/g/dev/c/rxtrKvT_Q8E/m/6_ej0c1ZBAAJ)
that the project was in dire need of contributors and maintainers.
There will be no more releases for bug fixes, security patches, or any updates of any kind after the project is retired.
This cannot be ignored, brushed off, or left until the last minute to address.
We cannot overstate the severity of this situation or the importance of beginning migration
to alternatives like [Gateway API](https://gateway-api.sigs.k8s.io/guides/getting-started/)
or one of the many [third-party Ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/) immediately.
--->
**Kubernetes 将于 2026 年 3 月停止维护 Ingress NGINX，
该基础设施是大约一半云原生环境的关键组成部分。**
Ingress NGINX 的停止维护计划已于 2026 年 3 月正式宣布，此前多年来，
Kubernetes 一直公开警告该项目急需贡献者和维护者。
项目停止维护后，将不再发布任何错误修复、安全补丁或任何类型的更新。
此事不能被忽视、敷衍了事，更不能拖延到最后一刻才处理。
我们再怎么强调这种情况的严重性，以及立即开始迁移到替代方案
（例如 [Gateway API](https://gateway-api.sigs.k8s.io/guides/getting-started/)
或众多[第三方 Ingress 控制器](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/)）
的重要性都不为过。

<!--
To be abundantly clear: choosing to remain with Ingress NGINX after its retirement leaves you and your users vulnerable to attack. None of the available alternatives are direct drop-in replacements. This will require planning and engineering time. Half of you will be affected. You have two months left to prepare.

**Existing deployments will continue to work, so unless you proactively check, you may not know you are affected until you are compromised.** In most cases, you can check to find out whether or not you rely on Ingress NGINX by running `kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx` with cluster administrator permissions.
-->
必须明确指出：在 Ingress NGINX 退役后继续使用，将使你和你的用户面临攻击风险。
目前没有任何替代方案可以直接替换 Ingress NGINX。这需要规划和工程时间。
大约一半的用户会受到影响。你还有两个月的时间来准备。

**现有部署将继续运行，因此，除非你主动检查，否则你可能直到系统遭到入侵才会意识到自己受到影响。**
在大多数情况下，你可以使用集群管理员权限运行
`kubectl get pods --all-namespaces --selector app.kubernetes.io/name=ingress-nginx`
命令，来检查你是否依赖于 Ingress NGINX。

<!--
Despite its broad appeal and widespread use by companies of all sizes,
and repeated calls for help from the maintainers,
the Ingress NGINX project never received the contributors it so desperately needed.
According to internal Datadog research, about 50% of cloud native environments
currently rely on this tool, and yet for the last several years,
it has been maintained solely by one or two people working in their free time.
Without sufficient staffing to maintain the tool to a standard both ourselves
and our users would consider secure, the responsible choice is to wind it
down and refocus efforts on modern alternatives like [Gateway API](https://gateway-api.sigs.k8s.io/guides/getting-started/).
-->
尽管 Ingress NGINX 项目广受欢迎，被各种规模的公司广泛使用，而且维护者也多次呼吁贡献者加入，
但它始终未能获得急需的贡献者。根据 Datadog 的内部研究，
目前约有 50% 的云原生环境依赖于该工具，然而在过去的几年里，
它一直由一两个人利用业余时间维护。
由于没有足够的人员来将该工具维护到我们和用户都认为安全的水平，
负责任的选择是逐步停止该项目，并将精力重新集中到诸如
[Gateway API](https://gateway-api.sigs.k8s.io/guides/getting-started/) 等现代替代方案上。

<!--
We did not make this decision lightly; as inconvenient as it is now,
doing so is necessary for the safety of all users and the ecosystem as a whole.
Unfortunately, the flexibility Ingress NGINX was designed with, that was once a boon,
has become a burden that cannot be resolved. With the technical debt that has piled up,
and fundamental design decisions that exacerbate security flaws,
it is no longer reasonable or even possible to continue maintaining the tool even if resources did materialize.
-->
我们做出这个决定并非轻率之举；尽管目前会带来诸多不便，
但为了所有用户和整个生态系统的安全，这是必要的。
遗憾的是，Ingress NGINX 最初设计的灵活性 —— 曾经是一大优势——如今却成了无法解决的负担。
由于技术债务不断累积，以及一些根本性的设计决策加剧了安全漏洞，即便未来资源到位，
继续维护该工具也已不再合理，甚至不可能。

<!--
We issue this statement together to reinforce the scale of this change
and the potential for serious risk to a significant percentage of
Kubernetes users if this issue is ignored.
It is imperative that you check your clusters now.
If you are reliant on Ingress NGINX, you must begin planning for migration.
-->
我们联合发布此声明，旨在强调此次变更的规模之大，
以及若忽视此问题可能对相当一部分 Kubernetes 用户造成严重风险。
你务必立即检查你的集群。如果你依赖 Ingress NGINX，则必须开始规划迁移。

<!--
Thank you,

Kubernetes Steering Committee

Kubernetes Security Response Committee
-->
谢谢，

Kubernetes 指导委员会

Kubernetes 安全响应委员会
