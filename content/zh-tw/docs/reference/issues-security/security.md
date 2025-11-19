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
本頁面介紹 Kubernetes 安全和信息披露相關的內容。


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
組，以獲取關於安全性和主要 API 公告的電子郵件。

<!--
## Report a Vulnerability
-->
## 報告一個漏洞 {#report-a-vulnerability}

<!--
We're extremely grateful for security researchers and users that report vulnerabilities to
the Kubernetes Open Source Community. All reports are thoroughly investigated by a set of community volunteers.
-->
我們非常感謝向 Kubernetes 開源社區報告漏洞的安全研究人員和用戶。
所有的報告都由社區志願者進行徹底調查。

<!--
To make a report, submit your vulnerability to the [Kubernetes bug bounty program](https://hackerone.com/kubernetes).
This allows triage and handling of the vulnerability with standardized response times.
-->
如需報告，請將你的漏洞提交給 [Kubernetes 漏洞賞金計劃](https://hackerone.com/kubernetes)。
這樣做可以使得社區能夠在標準化的響應時間內對漏洞進行分類和處理。

<!--
You can also email the private [security@kubernetes.io](mailto:security@kubernetes.io)
list with the security details and the details expected for
[all Kubernetes bug reports](https://github.com/kubernetes/kubernetes/blob/master/.github/ISSUE_TEMPLATE/bug-report.yaml).
-->
你還可以通過電子郵件向私有 [security@kubernetes.io](mailto:security@kubernetes.io)
列表發送電子郵件，郵件中應該包含
[所有 Kubernetes 錯誤報告](https://github.com/kubernetes/kubernetes/blob/master/.github/ISSUE_TEMPLATE/bug-report.yaml)
所需的詳細信息。

<!--
You may encrypt your email to this list using the GPG keys of the
[Security Response Committee members](https://git.k8s.io/security/README.md#product-security-committee-psc).
Encryption using GPG is NOT required to make a disclosure.
-->
你可以使用[安全響應委員會成員](https://git.k8s.io/security/README.md#product-security-committee-psc)的
GPG 密鑰加密你的發往郵件列表的郵件。揭示問題時不需要使用 GPG 來加密。

<!--
### When Should I Report a Vulnerability?
-->
### 我應該在什麼時候報告漏洞？ {#when-should-i-report-a-vulnerability}

<!--
- You think you discovered a potential security vulnerability in Kubernetes
- You are unsure how a vulnerability affects Kubernetes
- You think you discovered a vulnerability in another project that Kubernetes depends on
  - For projects with their own vulnerability reporting and disclosure process, please report it directly there
-->
- 你認爲在 Kubernetes 中發現了一個潛在的安全漏洞
- 你不確定漏洞如何影響 Kubernetes
- 你認爲你在 Kubernetes 依賴的另一個項目中發現了一個漏洞
  - 對於具有漏洞報告和披露流程的項目，請直接在該項目處報告

<!--
### When Should I NOT Report a Vulnerability?
-->
### 我什麼時候不應該報告漏洞？ {#when-should-i-not-report-a-vulnerability}

<!--
- You need help tuning Kubernetes components for security
- You need help applying security related updates
- Your issue is not security related
-->
- 你需要調整 Kubernetes 組件安全性的幫助
- 你需要應用與安全相關更新的幫助
- 你的問題與安全無關

<!--
## Security Vulnerability Response
-->
## 安全漏洞響應 {#security-vulnerability-response}

<!--
Each report is acknowledged and analyzed by Security Response Committee members within 3 working days.
This will set off the [Security Release Process](https://git.k8s.io/security/security-release-process.md#disclosures).
-->
每個報告在 3 個工作日內由安全響應委員會成員確認和分析，
這將啓動[安全發佈過程](https://git.k8s.io/sig-release/security-release-process-documentation/security-release-process.md#disclosures)。

<!--
Any vulnerability information shared with Security Response Committee stays within Kubernetes project
and will not be disseminated to other projects unless it is necessary to get the issue fixed.
-->
與安全響應委員會共享的任何漏洞信息都保留在 Kubernetes 項目中，除非有必要修復該問題，否則不會傳播到其他項目。

<!--
As the security issue moves from triage, to identified fix, to release planning we will keep the reporter updated.
-->
隨着安全問題從分類、識別修復、發佈計劃等方面的進展，我們將不斷更新報告。

<!--
## Public Disclosure Timing
-->
## 公開披露時間 {#public-disclosure-timing}

<!--
A public disclosure date is negotiated by the Kubernetes Security Response Committee and the bug submitter.
We prefer to fully disclose the bug as soon as possible once a user mitigation is available.
-->
公開披露日期由 Kubernetes 安全響應委員會和 bug 提交者協商。
我們傾向於在能夠爲用戶提供緩解措施之後儘快完全披露該 bug。

<!--
It is reasonable to delay disclosure when the bug or the fix is not yet fully understood,
the solution is not well-tested, or for vendor coordination.
-->
當 bug 或其修復還沒有被完全理解，解決方案沒有經過良好的測試，或者爲了處理供應商協調問題時，延遲披露是合理的。

<!--
The timeframe for disclosure is from immediate (especially if it's already publicly known)
to a few weeks. For a vulnerability with a straightforward mitigation, we expect report date
to disclosure date to be on the order of 7 days. The Kubernetes Security Response Committee
holds the final say when setting a disclosure date.
-->
信息披露的時間範圍從即時（尤其是已經公開的）到幾周不等。
對於具有直接緩解措施的漏洞，我們希望報告日期到披露日期的間隔是 7 天。
在設置披露日期方面，Kubernetes 安全響應委員會擁有最終決定權。
