---
title: PodHasNetworkCondition
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.27"

removed: true
---
kubelet را فعال کنید تا وضعیت [PodHasNetwork](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network) را روی podها علامت‌گذاری کند. این وضعیت در نسخه ۱.۲۸ به `PodReadyToStartContainersCondition` تغییر نام داده شد.
