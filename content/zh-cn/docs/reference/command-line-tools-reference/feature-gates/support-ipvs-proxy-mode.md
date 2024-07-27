---
# Removed from Kubernetes
title: SupportIPVSProxyMode
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.8"
    toVersion: "1.8"
  - stage: beta 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.9"    
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.10"
  - stage: stable
    defaultValue: true
    fromVersion: "1.11"
    toVersion: "1.20"    

removed: true
---
<!--
Enable providing in-cluster service load balancing using IPVS.
See [service proxies](/docs/reference/networking/virtual-ips/) for more details.
-->
启用使用 IPVS 提供集群内服务负载平衡。
详情参见[服务代理](/zh-cn/docs/reference/networking/virtual-ips/)。
