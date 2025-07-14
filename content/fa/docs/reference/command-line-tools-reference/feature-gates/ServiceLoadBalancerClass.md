---
# Removed from Kubernetes
title: ServiceLoadBalancerClass
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
    toVersion: "1.23"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.24"
    toVersion: "1.25"    

removed: true
---
فیلد `loadBalancerClass` را در سرویس‌ها فعال می‌کند. برای جزئیات بیشتر به [Specifying class of load balancer implementation](/docs/concepts/services-networking/service/#load-balancer-class)
 مراجعه کنید.