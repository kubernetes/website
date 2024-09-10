---
title: PodHostIPs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.28"
  - stage: beta
    defaultValue: true
    fromVersion: "1.29"
    toVersion: "1.30"
  - stage: stable
    defaultValue: true
    fromVersion: "1.30"
---

<!--
Enable the `status.hostIPs` field for pods and the {{< glossary_tooltip term_id="downward-api" text="downward API" >}}.
The field lets you expose host IP addresses to workloads.
-->
为 Pod 和 {{< glossary_tooltip term_id="downward-api" text="downward API" >}}
启用 `status.hostIPs` 字段。此字段允许你将主机 IP 地址暴露给工作负载。
