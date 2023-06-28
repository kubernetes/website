---
title: ExpandedDNSConfig
content_type: feature_gate
_build:
  list: never
  render: false
---
Enable kubelet and kube-apiserver to allow more DNS
search paths and longer list of DNS search paths. This feature requires container
runtime support(Containerd: v1.5.6 or higher, CRI-O: v1.22 or higher). See
[Expanded DNS Configuration](/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration).
