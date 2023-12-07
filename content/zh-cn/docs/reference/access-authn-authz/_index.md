---
title: API 访问控制
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
关于 Kubernetes 如何实现和控制 API 访问的介绍性材料，
可阅读[控制 Kubernetes API 的访问](/zh-cn/docs/concepts/security/controlling-access/)。

参考文档：

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

- [身份认证](/zh-cn/docs/reference/access-authn-authz/authentication/)
  - [使用启动引导令牌来执行身份认证](/zh-cn/docs/reference/access-authn-authz/bootstrap-tokens/)
- [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
  - [动态准入控制](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/)
- [鉴权与授权](/zh-cn/docs/reference/access-authn-authz/authorization/)
  - [基于角色的访问控制](/zh-cn/docs/reference/access-authn-authz/rbac/)
  - [基于属性的访问控制](/zh-cn/docs/reference/access-authn-authz/abac/)
  - [节点鉴权](/zh-cn/docs/reference/access-authn-authz/node/)
  - [Webhook 鉴权](/zh-cn/docs/reference/access-authn-authz/webhook/)
- [证书签名请求](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/)
  - 包含 [CSR 的批复](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#approval-rejection)
    和[证书签名](/zh-cn/docs/reference/access-authn-authz/certificate-signing-requests/#signing)
- 服务账号
  - [开发者指南](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/)
  - [管理文档](/zh-cn/docs/reference/access-authn-authz/service-accounts-admin/)
- [Kubelet 认证和鉴权](/zh-cn/docs/reference/access-authn-authz/kubelet-authn-authz/)
  - 包括 kubelet [TLS 启动引导](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/)
