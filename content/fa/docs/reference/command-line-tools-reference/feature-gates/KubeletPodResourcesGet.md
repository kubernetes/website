---
title: KubeletPodResourcesGet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
---
نقطه پایانی `Get` gRPC را روی kubelet برای منابع Pod فعال کنید.
این API [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
 را تقویت می‌کند.