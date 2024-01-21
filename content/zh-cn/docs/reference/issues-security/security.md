---
title: Kubernetes 安全和信息披露
aliases: [/zh-cn/security/]
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
## 安全公告 {#security-announcements}

<!--
Join the [kubernetes-security-announce](https://groups.google.com/forum/#!forum/kubernetes-security-announce)
group for emails about security and major API announcements.
-->
加入 [kubernetes-security-announce](https://groups.google.com/forum/#!forum/kubernetes-security-announce)
组，以获取关于安全性和主要 API 公告的电子邮件。

<!--
## Report a Vulnerability
-->
## 报告一个漏洞 {#report-a-vulnerability}

<!--
We're extremely grateful for security researchers and users that report vulnerabilities to
the Kubernetes Open Source Community. All reports are thoroughly investigated by a set of community volunteers.
-->
我们非常感谢向 Kubernetes 开源社区报告漏洞的安全研究人员和用户。
所有的报告都由社区志愿者进行彻底调查。

<!--
To make a report, submit your vulnerability to the [Kubernetes bug bounty program](https://hackerone.com/kubernetes).
This allows triage and handling of the vulnerability with standardized response times.
-->
如需报告，请将你的漏洞提交给 [Kubernetes 漏洞赏金计划](https://hackerone.com/kubernetes)。
这样做可以使得社区能够在标准化的响应时间内对漏洞进行分类和处理。

<!--
You can also email the private [security@kubernetes.io](mailto:security@kubernetes.io)
list with the security details and the details expected for
[all Kubernetes bug reports](https://github.com/kubernetes/kubernetes/blob/master/.github/ISSUE_TEMPLATE/bug-report.yaml).
-->
你还可以通过电子邮件向私有 [security@kubernetes.io](mailto:security@kubernetes.io)
列表发送电子邮件，邮件中应该包含
[所有 Kubernetes 错误报告](https://github.com/kubernetes/kubernetes/blob/master/.github/ISSUE_TEMPLATE/bug-report.yaml)
所需的详细信息。

<!--
You may encrypt your email to this list using the GPG keys of the
[Security Response Committee members](https://git.k8s.io/security/README.md#product-security-committee-psc).
Encryption using GPG is NOT required to make a disclosure.
-->
你可以使用[安全响应委员会成员](https://git.k8s.io/security/README.md#product-security-committee-psc)的
GPG 密钥加密你的发往邮件列表的邮件。揭示问题时不需要使用 GPG 来加密。

<!--
### When Should I Report a Vulnerability?
-->
### 我应该在什么时候报告漏洞？ {#when-should-i-report-a-vulnerability}

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
### 我什么时候不应该报告漏洞？ {#when-should-i-not-report-a-vulnerability}

<!--
- You need help tuning Kubernetes components for security
- You need help applying security related updates
- Your issue is not security related
-->
- 你需要调整 Kubernetes 组件安全性的帮助
- 你需要应用与安全相关更新的帮助
- 你的问题与安全无关

<!--
## Security Vulnerability Response
-->
## 安全漏洞响应 {#security-vulnerability-response}

<!--
Each report is acknowledged and analyzed by Security Response Committee members within 3 working days.
This will set off the [Security Release Process](https://git.k8s.io/security/security-release-process.md#disclosures).
-->
每个报告在 3 个工作日内由安全响应委员会成员确认和分析，
这将启动[安全发布过程](https://git.k8s.io/sig-release/security-release-process-documentation/security-release-process.md#disclosures)。

<!--
Any vulnerability information shared with Security Response Committee stays within Kubernetes project
and will not be disseminated to other projects unless it is necessary to get the issue fixed.
-->
与安全响应委员会共享的任何漏洞信息都保留在 Kubernetes 项目中，除非有必要修复该问题，否则不会传播到其他项目。

<!--
As the security issue moves from triage, to identified fix, to release planning we will keep the reporter updated.
-->
随着安全问题从分类、识别修复、发布计划等方面的进展，我们将不断更新报告。

<!--
## Public Disclosure Timing
-->
## 公开披露时间 {#public-disclosure-timing}

<!--
A public disclosure date is negotiated by the Kubernetes Security Response Committee and the bug submitter.
We prefer to fully disclose the bug as soon as possible once a user mitigation is available.
-->
公开披露日期由 Kubernetes 安全响应委员会和 bug 提交者协商。
我们倾向于在能够为用户提供缓解措施之后尽快完全披露该 bug。

<!--
It is reasonable to delay disclosure when the bug or the fix is not yet fully understood,
the solution is not well-tested, or for vendor coordination.
-->
当 bug 或其修复还没有被完全理解，解决方案没有经过良好的测试，或者为了处理供应商协调问题时，延迟披露是合理的。

<!--
The timeframe for disclosure is from immediate (especially if it's already publicly known)
to a few weeks. For a vulnerability with a straightforward mitigation, we expect report date
to disclosure date to be on the order of 7 days. The Kubernetes Security Response Committee
holds the final say when setting a disclosure date.
-->
信息披露的时间范围从即时（尤其是已经公开的）到几周不等。
对于具有直接缓解措施的漏洞，我们希望报告日期到披露日期的间隔是 7 天。
在设置披露日期方面，Kubernetes 安全响应委员会拥有最终决定权。
