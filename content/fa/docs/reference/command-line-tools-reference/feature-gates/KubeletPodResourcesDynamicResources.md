---
title: KubeletPodResourcesDynamicResources
content_type: feature_gate
_build:
  list: never
  render: false
  
stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"  
---
نقطه پایانی gRPC منابع غلاف kubelet را به ... گسترش دهید تا منابع اختصاص داده شده در `ResourceClaims` را از طریق API `DynamicResourceAllocation` شامل شود.
برای جزئیات بیشتر به [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources) مراجعه کنید.
با اطلاعاتی در مورد منابع قابل تخصیص، که به کلاینت‌ها امکان می‌دهد منابع محاسباتی آزاد روی یک گره را به درستی ردیابی کنند.