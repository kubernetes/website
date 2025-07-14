---
title: CloudDualStackNodeIPs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.29"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
    toVersion: "1.31"

removed: true
---
فعال‌سازی دو پشته‌ای `kubelet --node-ip` با ارائه‌دهندگان ابر خارجی.
برای جزئیات بیشتر به [Configure IPv4/IPv6 dual-stack](/docs/concepts/services-networking/dual-stack/#configure-ipv4-ipv6-dual-stack) مراجعه کنید.