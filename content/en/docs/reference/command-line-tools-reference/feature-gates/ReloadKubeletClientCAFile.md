---
title: ReloadKubeletClientCAFile
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Allow the kubelet to watch the client certificate authority (CA) file that it uses to authenticate
requests to its HTTPS endpoint, and to load changes to that file without a restart.
