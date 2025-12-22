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
When the `AuthorizePodWebsocketUpgradeCreatePermission` feature gate is `true`,
clients must be authorized to **create** Pod subresources even when triggering their
creation using a WebSocket.

The connection upgrade request occurs for each of the following subresources: `pods/exec`,
`pods/attach`, and `pods/portforward`. This feature gate fixes a security gap caused by
the protocol transition: while SPDY requests utilize HTTP `POST` (naturally aligning with
the **create** RBAC permission), the WebSocket protocol requires an HTTP `GET` request for
the handshake. To correct this defect, a synthetic RBAC check is now applied to ensure
WebSocket upgrades strictly enforce the **create** permission, matching the existing
SPDY security model.

You may want to disable this feature gate if you have existing clients or custom tooling
that rely on the previous behavior—specifically, if they connect via WebSockets but do *not*
currently hold the **create** RBAC permission.
