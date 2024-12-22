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
Allows an API client to request a stream of data rather than fetching a full list. 
This functionality is available in `client-go` and requires the 
[WatchList](/docs/reference/command-line-tools-reference/feature-gates/) 
feature to be enabled on the server. 
If the `WatchList` is not supported on the server, the client will seamlessly fall back to a standard list request.
