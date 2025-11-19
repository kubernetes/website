---
title: ExpandedDNSConfig
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"  
    toVersion: "1.27" 
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"  
    toVersion: "1.29" 
removed: true
---

<!--
Enable kubelet and kube-apiserver to allow more DNS
search paths and longer list of DNS search paths. This feature requires container
runtime support(Containerd: v1.5.6 or higher, CRI-O: v1.22 or higher). See
[Expanded DNS Configuration](/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration).
-->
在 kubelet 和 kube-apiserver 上啓用後，
允許使用更多的 DNS 搜索域和搜索域列表。此功能特性需要容器運行時
（containerd v1.5.6 或更高，CRI-O v1.22 或更高）的支持。
參閱[擴展 DNS 設定](/zh-cn/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration).
