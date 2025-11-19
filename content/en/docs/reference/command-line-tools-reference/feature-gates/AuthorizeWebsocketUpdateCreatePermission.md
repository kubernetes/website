---
title: AuthorizeWebsocketUpdateCreatePermission
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
When the `AuthorizePodWebsocketUpgradeCreatePermission` feature-gate is `true`,
the `create` permission for Websocket upgrade requests is required. This
upgrade request occurs for each of the following subresources: `pods/exec`,
`pods/attach`, and `pods/portforward`. Previously, the SPDY API requests to
these subresources already required the `create` permission.

Before upgrading to 1.35, ensure any custom ClusterRoles and Roles intended to
grant `pods/exec`, `pods/attach`, or `pods/portforward` permission include the
`create` verb.
