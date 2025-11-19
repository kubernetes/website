---
title: API 訪問控制
weight: 30
no_list: true
---

<!--
title: API Access Control
weight: 30
no_list: true
-->

<!--
For an introduction to how Kubernetes implements and controls API access,
read [Controlling Access to the Kubernetes API](/docs/concepts/security/controlling-access/).

Reference documentation:
-->
關於 Kubernetes 如何實現和控制 API 訪問的介紹性材料，
可閱讀[控制 Kubernetes API 的訪問](/zh-cn/docs/concepts/security/controlling-access/)。

參考文檔：

<!--
- [Authenticating](/docs/reference/access-authn-authz/authentication/)
   - [Authenticating with Bootstrap Tokens](/docs/reference/access-authn-authz/bootstrap-tokens/)
- [Admission Controllers](/docs/reference/access-authn-authz/admission-controllers/)
   - [Dynamic Admission Control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [Authorization](/docs/reference/access-authn-authz/authorization/)
   - [Role Based Access Control](/docs/reference/access-authn-authz/rbac/)
   - [Attribute Based Access Control](/docs/reference/access-authn-authz/abac/)
   - [Node Authorization](/docs/reference/access-authn-authz/node/)
   - [Webhook Authorization](/docs/reference/access-authn-authz/webhook/)
- [Certificate Signing Requests](/docs/reference/access-authn-authz/certificate-signing-requests/)
   - including [CSR approval](/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
     and [certificate signing](/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- Service accounts
  - [Developer guide](/docs/tasks/configure-pod-container/configure-service-account/)
  - [Administration](/docs/reference/access-authn-authz/service-accounts-admin/)
- [Kubelet Authentication & Authorization](/docs/reference/access-authn-authz/kubelet-authn-authz/)
  - including kubelet [TLS bootstrapping](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
-->

- [身份認證](/zh-cn/docs/reference/access-authn-authz/authentication/)
  - [使用啓動引導令牌來執行身份認證](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
- [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
  - [動態准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [鑑權與授權](/zh-cn/docs/reference/access-authn-authz/authorization/)
  - [基於角色的訪問控制](/zh-cn/docs/reference/access-authn-authz/rbac/)
  - [基於屬性的訪問控制](/zh-cn/docs/reference/access-authn-authz/abac/)
  - [節點鑑權](/zh-cn/docs/reference/access-authn-authz/node/)
  - [Webhook 鑑權](/zh-cn/docs/reference/access-authn-authz/webhook/)
- [證書籤名請求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  - 包含 [CSR 的批覆](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
    和[證書籤名](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- 服務賬號
  - [開發者指南](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
  - [管理文檔](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)
- [Kubelet 認證和鑑權](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/)
  - 包括 kubelet [TLS 啓動引導](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
