---
# Removed from Kubernetes
title: SetHostnameAsFQDN
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.19"
    toVersion: "1.19"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.21"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.24"    

removed: true
---
قابلیت تنظیم نام دامنه کاملاً واجد شرایط (FQDN) را به عنوان نام میزبان یک پاد فعال کنید. به [Pod's `setHostnameAsFQDN` field](/docs/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field).
 مراجعه کنید.