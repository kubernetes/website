---
title: WatchListClient
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.30"
---
This enables an API client (inlcuding some control plane components) to
request a stream of data rather than an entire list. The behavior change
is implemented in the client-go library and it is opaque to the client.
To enable this optimization, you need to enable `WatchList` feature on
the API server.

