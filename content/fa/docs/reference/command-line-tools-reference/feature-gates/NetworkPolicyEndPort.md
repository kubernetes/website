---
title: NetworkPolicyEndPort
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.21"
    toVersion: "1.21"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"
  - stage: stable
    defaultValue: true
    fromVersion: "1.25"
    toVersion: "1.26"

removed: true
---
به شما امکان می‌دهد پورت‌ها را در یک قانون [NetworkPolicy](/docs/concepts/services-networking/network-policies/) به عنوان طیفی از شماره پورت‌ها تعریف کنید.