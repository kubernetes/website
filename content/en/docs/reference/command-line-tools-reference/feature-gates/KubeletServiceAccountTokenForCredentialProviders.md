---
title: KubeletServiceAccountTokenForCredentialProviders
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    locked: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    locked: false
    fromVersion: "1.34"
---

Enable kubelet to send the service account token bound to the pod for which the image is being pulled to the credential provider plugin.
