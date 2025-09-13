---
title: PodReadyToStartContainersCondition
former_titles:
  - PodHasNetworkCondition
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
---
kubelet را فعال کنید تا وضعیت [PodReadyToStartContainers](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network) را روی podها علامت‌گذاری کند.
این دروازه ویژگی قبلاً با نام `PodHasNetworkCondition` شناخته می‌شد و وضعیت مرتبط با آن `PodHasNetwork` نامگذاری شده بود.