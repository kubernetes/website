---
title: PodCertificateRequest
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.34"
    toVersion: "1.34"
  - stage: beta
    defaultValue: false
    fromVersion: "1.35"
---
Enable PodCertificateRequest objects and podCertificate projected volume
sources.
