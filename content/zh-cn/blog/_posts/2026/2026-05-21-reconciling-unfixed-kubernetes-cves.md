---
layout: blog
title: "回顾既往：为未修复的 Kubernetes CVE 纠正记录"
draft: true
slug: reconciling-unfixed-kubernetes-cves
author: >
  [Pushkar Joglekar](https://github.com/PushkarJ) (Broadcom / SIG Security)、
  [Tabitha Sable](https://github.com/tabbysable) (Datadog / K8s Security Response Committee / SIG Security)
translator: >
  [Xin Li](https://github.com/my-git9)
---
<!--
layout: blog
title: "Reconciling the Past: Correcting Records for Unfixed Kubernetes CVEs"
draft: true
slug: reconciling-unfixed-kubernetes-cves
author: >
  [Pushkar Joglekar](https://github.com/PushkarJ) (Broadcom / SIG Security),
  [Tabitha Sable](https://github.com/tabbysable) (Datadog / K8s Security Response Committee / SIG Security)
-->

<!--
The Kubernetes project relies on transparency to empower cluster administrators and security researchers. One important way we do that is by publishing CVE records into the Common Vulnerabilities and Exposures database. As part of our ongoing effort to mature the official [Kubernetes CVE Feed](/docs/reference/issues-security/official-cve-feed/), we have identified some discrepancies. CVE records for a few older, unfixed issues incorrectly include a _fixed version_ field.
-->
Kubernetes 项目依靠透明度来赋能集群管理员和安全研究人员。
我们做到这一点的重要方式之一是将 CVE 记录发布到通用漏洞披露数据库中。
作为我们持续完善官方
[Kubernetes CVE 动态订阅源](/zh-cn/docs/reference/issues-security/official-cve-feed/)的一部分，
我们发现了一些差异。
某些较早的未修复问题的 CVE 记录错误地包含了 **已修复版本（fixed version）** 字段。

<!--
The Kubernetes Security Response Committee (SRC) will correct the affected CVE records on June 1, 2026. This may result in vulnerability scanners identifying these vulnerabilities in places where they were previously not detected.
-->
Kubernetes 安全响应委员会（SRC）将于 2026 年 6 月 1 日纠正受影响的 CVE 记录。
这可能导致漏洞扫描器在这些漏洞之前未被检测到的地方识别出它们。

<!--
To help reduce confusion, this post provides a technical update on three vulnerabilities that were disclosed in previous years but remain unfixed: **CVE-2020-8561**, **CVE-2020-8562**, and **CVE-2021-25740**.
-->
为帮助减少混淆，本文针对以下三个多年前披露但仍未修复的漏洞提供技术更新：
**CVE-2020-8561**、**CVE-2020-8562** 和 **CVE-2021-25740**。

<!--
## Why we are updating these records now
-->
## 为什么我们现在更新这些记录

<!--
While these vulnerabilities have been public for several years, the recent work to generate official Open Source Vulnerabilities (OSV) files revealed that their corresponding CVE records did not accurately reflect their status. Specifically, some records suggested a _fixed_ version existed, when in reality, these issues are architectural design trade-offs that cannot be fully remediated through code without breaking fundamental Kubernetes functionality.
-->
虽然这些漏洞已经公开多年，但最近生成官方开源漏洞（OSV）文件的工作发现，
它们对应的 CVE 记录并未准确反映其状态。具体而言，某些记录表明存在**已修复**版本，
而实际上这些问题属于架构设计上的权衡，无法在不破坏 Kubernetes 基础功能的情况下通过代码完全修复。

<!--
Correcting these records is vital for the community for:
-->
纠正这些记录对社区至关重要，原因如下：

<!--
- **Automation Fidelity**: Modern vulnerability scanners depend on precise version ranges. Inaccurate _fixed_ tags lead to false negatives, giving users a false sense of security.
-->
- **自动化保真度**：现代漏洞扫描器依赖于精确的版本范围。
  不准确的**已修复**标签会导致漏报，让用户产生虚假的安全感。

<!--
- **Risk Documentation**: By formalizing these as _unfixed_, we ensure that platform providers and administrators are aware of the persistent need for administrative mitigations.
-->
- **风险文档化**：通过将这些正式确定为**未修复**，
  我们确保平台提供商和管理员了解持续需要采取管理缓解措施的必要性。

<!--
For completeness, we should also mention that [CVE-2020-8554](https://www.cve.org/cverecord?id=CVE-2020-8554) is an unfixed CVE with a correct CVE record stating that it affects all versions. That record will also be updated to use a more-standardized version number format.
-->
为完整性起见，我们还应提及 [CVE-2020-8554](https://www.cve.org/cverecord?id=CVE-2020-8554)
是一个未修复的 CVE，但其 CVE 记录正确地声明它影响所有版本。
该记录也将更新为使用更标准化的版本号格式。

<!--
## Technical analysis of unfixed architectural risks
-->
## 未修复架构风险的技术分析

<!--
The following vulnerabilities will not be fixed by the Kubernetes project. GitHub issues remain the best reference for the technical mechanics of these flaws.
-->
以下漏洞将不会由 Kubernetes 项目修复。
GitHub 问题仍然是了解这些缺陷技术细节的最佳参考资料。

<!--
### [CVE-2020-8561](https://github.com/kubernetes/kubernetes/issues/104720): Webhook redirect in kube-apiserver
-->
### [CVE-2020-8561](https://github.com/kubernetes/kubernetes/issues/104720)：kube-apiserver 中的 Webhook 重定向

<!--
- **Severity**: Medium (4.1).
-->
- **严重程度**：中（4.1）。

<!--
- **The Issue**: The kube-apiserver follows HTTP redirects when communicating with admission webhooks. An actor capable of configuring an AdmissionWebhookConfiguration can redirect API server requests to internal, private networks.
-->
- **问题描述**：kube-apiserver 在与准入 webhook 通信时会遵循 HTTP 重定向。
  能够配置 AdmissionWebhookConfiguration 的参与者可以将 API 服务器请求重定向到内部私有网络。

<!--
- **Why it remains unfixed**: Restricting this behavior would require breaking the standard HTTP client behavior that many legitimate integrations rely on.
-->
- **未修复原因**：限制此行为需要打破许多合法集成所依赖的标准 HTTP 客户端行为。

<!--
- **Mitigation**: Set the API server log level to less than 10 (to prevent logging response bodies) and disable dynamic profiling (`--profiling=false`) to prevent unauthorized log-level changes.
-->
- **缓解措施**：将 API 服务器日志级别设置为小于 10（以防止记录响应正文），
  并禁用动态性能分析（`--profiling=false`）以防止未经授权的日志级别更改。

<!--
### [CVE-2020-8562](https://github.com/kubernetes/kubernetes/issues/101493): Proxy bypass via DNS TOCTOU
-->
### [CVE-2020-8562](https://github.com/kubernetes/kubernetes/issues/101493)：通过 DNS TOCTOU 绕过代理

<!--
- **Severity**: Low (3.1).
-->
- **严重程度**：低（3.1）。

<!--
- **The Issue**: A Time-of-Check to Time-of-Use (TOCTOU) race condition in the API server proxy allows users to bypass IP restrictions. The system performs a DNS check to validate an IP, but then performs a second resolution for the actual connection, which an attacker can manipulate.
-->
- **问题描述**：API 服务器代理中的检查时间到使用时间（TOCTOU）竞争条件允许用户绕过 IP 限制。
  系统执行 DNS 检查以验证 IP，但随后为实际连接执行第二次解析，攻击者可以操纵此过程。

<!--
- **Why it remains unfixed**: Fixing this requires pinning resolved IPs in a way that breaks complex split-horizon DNS or dynamic IP environments.
-->
- **未修复原因**：修复此问题需要固定已解析的 IP，但这会破坏复杂的分割视图 DNS 或动态 IP 环境。

<!--
- **Mitigation**: Use a local DNS caching server like dnsmasq for the API server and configure `min-cache-ttl` to enforce consistent responses between the check and the connection.
-->
- **缓解措施**：为 API 服务器使用本地 DNS 缓存服务器（如 dnsmasq），
  并配置 `min-cache-ttl` 以在检查和连接之间强制执行一致的响应。

<!--
### [CVE-2021-25740](https://github.com/kubernetes/kubernetes/issues/103675): Cross-namespace forwarding via Endpoints
-->
### [CVE-2021-25740](https://github.com/kubernetes/kubernetes/issues/103675)：通过 Endpoints 的跨名字空间转发

<!--
- **Severity**: Low (3.1).
-->
- **严重程度**：低（3.1）。

<!--
- **The Issue**: A design flaw in the Endpoint and EndpointSlice API objects allows users to manually specify IP addresses, which can be used to point a LoadBalancer or Ingress toward backends in other namespaces.
-->
- **问题描述**：Endpoints 和 EndpointSlices API 对象中的设计缺陷允许用户手动指定 IP 地址，
  这些地址可用于将 LoadBalancer 或 Ingress 指向其他名字空间中的后端。

<!--
- **Why it remains unfixed**: This is a fundamental feature of the Endpoints API used by many networking tools and operators.
-->
- **未修复原因**：这是许多网络工具和 operator 使用的 Endpoints API 的基础功能。

<!--
- **Mitigation**: Restrict write access to Endpoint (legacy) and EndpointSlices. Since Kubernetes 1.22, Kubernetes RBAC authorization mode no longer includes those permissions in the default _edit_ and _admin_ ClusterRoles. That removal applies to clusters created using Kubernetes v1.22; for clusters upgraded from older versions, administrators should manually audit and reconcile the `system:aggregate-to-edit` ClusterRole.
-->
- **缓解措施**：限制对 Endpoints（遗留）和 EndpointSlices 的写访问权限。
  自 Kubernetes 1.22 起，Kubernetes RBAC 授权模式不再在默认
  **edit** 和 **admin** ClusterRole 中包含这些权限。
  该移除适用于使用 Kubernetes v1.22 创建的集群；对于从旧版本升级的集群，
  管理员应手动审核并协调 `system:aggregate-to-edit` ClusterRole。

{{< note >}}
<!--
On June 1, 2026, these CVE records will be updated to correctly reflect the fact that all versions are affected. You may see them begin to appear in vulnerability scanner results.
-->
2026 年 6 月 1 日，这些 CVE 记录将被更新以正确反映所有版本均受影响的事实。
你可能会看到它们开始出现在漏洞扫描器结果中。
{{< /note >}}

<!--
## Required actions for administrators
-->
## 管理员需要采取的操作

<!--
The Kubernetes project recommends a _secure by configuration_ approach to manage these persistent risks:
-->
Kubernetes 项目推荐采用**通过配置实现安全**的方法来管理这些持续风险：

<!--
| Vulnerability | Action Item | Severity Score (Rating) | Command / Configuration |
| :---- | :---- | :---- | :---- |
| **CVE-2020-8561** | Restrict Log Verbosity | 4.1 (Medium) | Ensure `--v` is set to `< 10` and `--profiling=false`. |
| **CVE-2020-8562** | Enforce DNS Consistency | 3.1 (Low) | Deploy dnsmasq or a similar caching resolver on control plane nodes. |
| **CVE-2021-25740** | Hardened RBAC | 3.1 (Low) | `kubectl auth reconcile` to remove Endpoint write access from broad roles. |
-->
| 漏洞 | 操作项 | 严重程度评分（评级） | 命令 / 配置 |
| :---- | :---- | :---- | :---- |
| **CVE-2020-8561** | 限制日志详细程度 | 4.1（中） | 确保 `--v` 设置为 `< 10` 且 `--profiling=false`。 |
| **CVE-2020-8562** | 强制 DNS 一致性 | 3.1（低） | 在控制平面节点上部署 dnsmasq 或类似的缓存解析器。 |
| **CVE-2021-25740** | 强化 RBAC | 3.1（低） | 使用 `kubectl auth reconcile` 从广泛角色中移除 Endpoints 写访问权限。 |

<!--
The RBAC action for CVE-2021-25740 applies when your cluster uses RBAC authorization mode, which is the default for clusters created with standard Kubernetes tooling. Administrators should independently test and validate these configurations in a non-production environment, assessing the architectural risks against their specific threat model and risk tolerance.
-->
CVE-2021-25740 的 RBAC 操作适用于使用 RBAC 授权模式的集群，
这是使用标准 Kubernetes 工具创建的集群的默认设置。
管理员应在非生产环境中独立测试和验证这些配置，
根据其特定的威胁模型和风险承受能力评估架构风险。

<!--
## Conclusion: maturity through transparency
-->
## 结语：通过透明度走向成熟

<!--
The effort to reconcile these records is a sign of a maturing security ecosystem. By moving away from the "patch-only" mindset and accurately documenting architectural debt, the Kubernetes project provides the community with the high-fidelity data needed to secure modern cloud native infrastructure.
-->
协调这些记录的努力是安全生态系统走向成熟的标志。
通过摒弃**仅打补丁**的思维模式并准确记录架构债务，
Kubernetes 项目为社区提供了保护现代云原生基础设施所需的高保真数据。

<!--
We would like to thank the security researchers—QiQi Xu, Javier Provecho, and others—who identified these risks, and the SIG Security Tooling contributors who continue to refine our official feeds. Special shoutout to Rory McCune for sharing information around these CVEs through his blog posts.
-->
我们要感谢发现这些风险的安全研究人员 —— QiQi Xu、Javier Provecho 等，
以及继续完善我们官方动态订阅源的 SIG Security Tooling 贡献者。
特别感谢 Rory McCune 通过他的博客文章分享了有关这些 CVE 的信息。
