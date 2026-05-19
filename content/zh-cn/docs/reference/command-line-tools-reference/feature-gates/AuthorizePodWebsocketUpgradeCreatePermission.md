---
title: AuthorizePodWebsocketUpgradeCreatePermission
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---

<!--
When the `AuthorizePodWebsocketUpgradeCreatePermission` feature gate is `true`,
clients must be authorized to **create** Pod subresources even when triggering their
creation using a WebSocket.
-->
当 `AuthorizePodWebsocketUpgradeCreatePermission` 特性门控为 `true`，  
即使通过 WebSocket 触发 Pod 子资源的创建，客户端也必须具有**创建** Pod 子资源的权限。

<!--
The connection upgrade request occurs for each of the following subresources: `pods/exec`,
`pods/attach`, and `pods/portforward`. This feature gate fixes a security gap caused by
the protocol transition: while SPDY requests utilize HTTP `POST` (naturally aligning with
the **create** RBAC permission), the WebSocket protocol requires an HTTP `GET` request for
the handshake. To correct this defect, a synthetic RBAC check is now applied to ensure
WebSocket upgrades strictly enforce the **create** permission, matching the existing
SPDY security model.
-->
针对子资源 `pods/exec`、`pods/attach` 和 `pods/portforward` 的连接都会发生连接升级请求。
此特性门控修复了由协议转换引起的安全漏洞：SPDY 请求使用 HTTP `POST`
（自然对应 **create** RBAC 权限），而 WebSocket 协议在握手阶段需要 HTTP `GET` 请求。
为纠正此缺陷，现在系统会实施一项合成的 RBAC 检查，以确保 WebSocket 升级严格遵从
**create** 权限，匹配现有 SPDY 安全模型。

<!--
You may want to disable this feature gate if you have existing clients or custom tooling
that rely on the previous behavior—specifically, if they connect via WebSockets but do *not*
currently hold the **create** RBAC permission.
-->
如果你有当前客户端或定制工具链依赖于之前的行为，特别是如果它们通过 WebSocket
连接但没有 **create** RBAC 权限，你可能希望禁用此特性门控。
