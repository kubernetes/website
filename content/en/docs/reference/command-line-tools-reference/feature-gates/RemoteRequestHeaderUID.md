---
title: RemoteRequestHeaderUID
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.32"
---
Enable the API server to accept UIDs (user IDs) via request header authentication.
This will also make the `kube-apiserver`'s API aggregator add UIDs via standard headers when
forwarding requests to the servers serving the aggregated API.

