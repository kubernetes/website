---
title: Kubernetes 安全和信息披露
content_type: concept
weight: 20
---

<!--
title: Kubernetes Security and Disclosure Information
aliases: [/security/]
reviewers:
- eparis
- erictune
- philips
- jessfraz
content_type: concept
weight: 20
-->

<!-- overview -->
<!--
This page describes Kubernetes security and disclosure information.
-->
本页面介绍 Kubernetes 安全和信息披露相关的内容。


<!-- body -->
<!--
## Security Announcements
-->
## 安全公告

<!--
Join the [kubernetes-security-announce](https://groups.google.com/forum/#!forum/kubernetes-security-announce) group for emails about security and major API announcements.
-->
加入 [kubernetes-security-announce](https://groups.google.com/forum/#!forum/kubernetes-security-announce) 组，以获取关于安全性和主要 API 公告的电子邮件。

<!--
You can also subscribe to an RSS feed of the above using [this link](https://groups.google.com/forum/feed/kubernetes-security-announce/msgs/rss_v2_0.xml?num=50).
-->
你也可以使用[此链接](https://groups.google.com/forum/feed/kubernetes-security-announce/msgs/rss_v2_0.xml?num=50) 订阅上述的 RSS 反馈。

<!--
## Report a Vulnerability
-->
## 报告一个漏洞

<!--
We’re extremely grateful for security researchers and users that report vulnerabilities to the Kubernetes Open Source Community. All reports are thoroughly investigated by a set of community volunteers.
-->
我们非常感谢向Kubernetes开源社区报告漏洞的安全研究人员和用户。
所有报告都由一组社区志愿者彻底调查。

<!--
To make a report, please email the private [security@kubernetes.io](mailto:security@kubernetes.io) list with the security details and the details expected for [all Kubernetes bug reports](https://git.k8s.io/kubernetes/.github/ISSUE_TEMPLATE/bug-report.md).
-->
如需报告，请连同安全细节以及预期的[所有 Kubernetes bug 报告](https://git.k8s.io/kubernetes/.github/ISSUE_TEMPLATE/bug-report.md)
详细信息电子邮件到[security@kubernetes.io](mailto:security@kubernetes.io)列表。

<!--
You can also email the private [security@kubernetes.io](mailto:security@kubernetes.io) list with the security details and the details expected for [all Kubernetes bug reports](https://git.k8s.io/kubernetes/.github/ISSUE_TEMPLATE/bug-report.md).
-->
你还可以通过电子邮件向私有 [security@kubernetes.io](mailto:security@kubernetes.io) 列表发送电子邮件，邮件中应该包含[所有 Kubernetes 错误报告](https://git.k8s.io/kubernetes/.github/ISSUE_TEMPLATE/bug-report.md)所需的详细信息。
<!--
You may encrypt your email to this list using the GPG keys of the [Product Security Committee members](https://git.k8s.io/security/README.md#product-security-committee-psc). Encryption using GPG is NOT required to make a disclosure.
-->
你可以使用[产品安全团队成员](https://git.k8s.io/security/README.md#product-security-committee-psc) 
的 GPG 密钥加密你的电子邮件到此列表。使用 GPG 加密不需要公开。

<!--
### When Should I Report a Vulnerability?
-->
### 我应该在什么时候报告漏洞？

<!--
- You think you discovered a potential security vulnerability in Kubernetes
- You are unsure how a vulnerability affects Kubernetes
- You think you discovered a vulnerability in another project that Kubernetes depends on
   - For projects with their own vulnerability reporting and disclosure process, please report it directly there
-->
- 你认为在 Kubernetes 中发现了一个潜在的安全漏洞
- 你不确定漏洞如何影响 Kubernetes
- 你认为你在 Kubernetes 依赖的另一个项目中发现了一个漏洞
- 对于具有漏洞报告和披露流程的项目，请直接在该项目处报告

<!--
### When Should I NOT Report a Vulnerability?
-->
### 我什么时候不应该报告漏洞？

<!--
- You need help tuning Kubernetes components for security
- You need help applying security related updates
- Your issue is not security related
-->
- 你需要帮助调整 Kubernetes 组件的安全性
- 你需要帮助应用与安全相关的更新
- 你的问题与安全无关

<!--
## Security Vulnerability Response
-->
## 安全漏洞响应

<!--
Each report is acknowledged and analyzed by Product Security Team members within 3 working days. This will set off the [Security Release Process](https://git.k8s.io/sig-release/security-release-process-documentation/security-release-process.md#disclosures).
-->
每个报告在 3 个工作日内由产品安全团队成员确认和分析。这将启动[安全发布过程](https://git.k8s.io/sig-release/security-release-process-documentation/security-release-process.md#disclosures)。

<!--
Any vulnerability information shared with Product Security Team stays within Kubernetes project and will not be disseminated to other projects unless it is necessary to get the issue fixed.
-->
与产品安全团队共享的任何漏洞信息都保留在 Kubernetes 项目中，除非有必要修复该问题，否则不会传播到其他项目。

<!--
As the security issue moves from triage, to identified fix, to release planning we will keep the reporter updated.
-->
随着安全问题从分类、识别修复、发布计划等方面的进展，我们将不断更新报告。

<!--
## Public Disclosure Timing
-->
## 公开披露时间

<!--
A public disclosure date is negotiated by the Kubernetes product security team and the bug submitter. We prefer to fully disclose the bug as soon as possible once a user mitigation is available.
-->
公开披露日期由 Kubernetes 产品安全团队和 bug 提交者协商。我们倾向于在用户缓解措施可用时尽快完全披露该 bug。

<!--
It is reasonable to delay disclosure when the bug or the fix is not yet fully understood, the solution is not well-tested, or for vendor coordination.
-->
当 bug 或其修复还没有被完全理解，解决方案没有经过良好的测试，或者为了处理供应商协调问题时，延迟披露是合理的。

<!--
The timeframe for disclosure is from immediate (especially if it's already publicly known) to a few weeks. As a basic default, we expect report date to disclosure date to be on the order of 7 days. The Kubernetes product security team holds the final say when setting a disclosure date.
-->
信息披露的时间范围从即时（尤其是已经公开的）到几周。作为一个基本的约定，我们希望报告日期到披露日期的间隔是 7 天。在设置披露日期时，Kubernetes 产品安全团队拥有最终决定权。

