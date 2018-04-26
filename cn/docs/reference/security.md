---
layout: docwithnav
title: Kubernetes安全和公告信息
permalink: /security/
approvers:
- eparis
- erictune
- philips
- jessfraz
cn-approvers:
- jiaj12
cn-reviewers:
- chentao1596
---

<!--
## Security Announcements
-->
## 安全公告
<!--
Join the [kubernetes-announce](https://groups.google.com/forum/#!forum/kubernetes-announce) group for emails about security and major API announcements.
-->
加入 [kubernetes-announce](https://groups.google.com/forum/#!forum/kubernetes-announce) 群组，您将会收到有关安全方面和主要 API 公告的电子邮件。

<!--
## Report a Vulnerability
-->
## 上报安全漏洞


<!--
We’re extremely grateful for security researchers and users that report vulnerabilities to the Kubernetes Open Source Community. All reports are thoroughly investigated by a set of community volunteers.
-->
我们非常感激那些向 Kubernetes 开源社区上报安全漏洞的安全调查者和用户。所有提交的信息都会被社区志愿者仔细审查。


<!--
To make a report, please email the private [kubernetes-security@googlegroups.com](mailto:kubernetes-security@googlegroups.com) list with the security details and the details expected for [all Kubernetes bug reports](https://git.k8s.io/kubernetes/.github/ISSUE_TEMPLATE.md).
-->
请您通过向这个匿名邮件名单上报漏洞信息。邮件的内容应该包括安全的内容以及预期的内容，请参照模板 [所有 Kubernetes 漏洞信息提交模板](https://git.k8s.io/kubernetes/.github/ISSUE_TEMPLATE.md)

<!--
You may encrypt your email to this list using the GPG keys of the [Product Security Team members](https://git.k8s.io/community/contributors/devel/security-release-process.md#product-security-team-pst). Encryption using GPG is NOT required to make a disclosure.
-->
您可以在提交报告时通过 [产品安全团队成员](https://git.k8s.io/community/contributors/devel/security-release-process.md#product-security-team-pst)提供的 GPG 密钥来加密你的邮件。但加密不是强制的。

<!--
### When Should I Report a Vulnerability?
-->
### 何时上报漏洞？

<!--
- You think you discovered a potential security vulnerability in Kubernetes
- You are unsure how a vulnerability affects Kubernetes
- You think you discovered a vulnerability in another project that Kubernetes depends on (e.g. docker, rkt, etcd)
-->
- 您觉得您发现了一个 Kubernetes 的潜在安全漏洞
- 您不确定这个漏洞会如何影响 Kubernetes
- 您觉得您发现了一个 Kubernetes 所依赖的项目（如 docker, rkt, etcd）的漏洞

<!--
### When Should I NOT Report a Vulnerability?
-->
### 何时我不需要上报漏洞？

<!--
- You need help tuning Kubernetes components for security
- You need help applying security related updates
- Your issue is not security related
-->
- 您正在协助进行 Kubernetes 组件的安全调试
- 您正在协助进行安全相关升级
- 您发现的不是安全相关问题

<!--
## Security Vulnerability Response
-->
## 安全漏洞的回复

<!--
Each report is acknowledged and analyzed by Product Security Team members within 3 working days. This will set off the [Security Release Process](https://git.k8s.io/community/contributors/devel/security-release-process.md#product-security-team-pst).
-->
我们的产品安全团队成员将会在三个工作日内对提交的报告进行分析。流程请参见 [安全发布流程](https://git.k8s.io/community/contributors/devel/security-release-process.md#product-security-team-pst)。

<!--
Any vulnerability information shared with Product Security Team stays within Kubernetes project and will not be disseminated to other projects unless it is necessary to get the issue fixed.
-->
所有发送给产品安全团队的漏洞信息只会在 Kubernetes 项目内分享，除非必要，否则不会与其他项目共享。

<!--
As the security issue moves from triage, to identified fix, to release planning we will keep the reporter updated.
-->
我们将会在安全问题解决的全过程中与提交者保持联系。

<!--
## Public Disclosure Timing
-->
## 正式发布时间节点

<!--
A public disclosure date is negotiated by the Kubernetes product security team and the bug submitter. We prefer to fully disclose the bug as soon as possible once a user mitigation is available. It is reasonable to delay disclosure when the bug or the fix is not yet fully understood, the solution is not well-tested, or for vendor coordination. The timeframe for disclosure is from immediate (especially if it's already publicly known) to a few weeks. As a basic default, we expect report date to disclosure date to be on the order of 7 days. The Kubernetes product security team holds the final say when setting a disclosure date.
-->
Kuberntes 产品安全团队会与问题提交者讨论决定正式发布时间。我们倾向于一旦在解决方案可用时就公布这个漏洞。但是，问题或者解决方案没有明确、测试不够充分、供应商的协调要求，这些因素导致安全漏洞延迟公布都是合理的。一般情况下，特别是公众已经知道的情况下，漏洞信息会在几周内被发布。通常，我们定在七天内发布漏洞信息。Kubernetes 产品安全团队保留漏洞信息发布日期的最终解释权利。
