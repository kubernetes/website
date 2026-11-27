---
title: KubeServingCertificatesSigner
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Adds the "kubernetes.io/service-serving" signer for Pod/Service serving certificates.
Pods may request serving certificates from this signer by using the `podCertificate`
projected volume.
