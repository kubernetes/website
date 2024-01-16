---
# Removed from Kubernetes
title: CustomPodDNS
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.9"
    toVersion: "1.9"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.10"
    toVersion: "1.13"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.14"
    toVersion: "1.16"

removed: true  
---
Enable customizing the DNS settings for a Pod using its `dnsConfig` property.
Check [Pod's DNS Config](/docs/concepts/services-networking/dns-pod-service/#pod-dns-config)
for more details.
