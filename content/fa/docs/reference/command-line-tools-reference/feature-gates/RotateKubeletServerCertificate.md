---
title: RotateKubeletServerCertificate
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.7"
    toVersion: "1.11"
  - stage: beta
    defaultValue: true
    fromVersion: "1.12"
---
چرخش گواهی TLS سرور را روی kubelet فعال کنید.
برای جزئیات بیشتر به [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration) مراجعه کنید.