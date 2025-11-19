---
title: SchedulerAsyncAPICalls
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Change the kube-scheduler to make the entire scheduling cycle free of blocking requests to the Kubernetes API server.
Instead, interact with the Kubernetes API using asynchronous code.
-->
修改 kube-scheduler，使整個調度週期中不再存在對 Kubernetes API 伺服器的阻塞請求。
取而代之的是，使用異步代碼與 Kubernetes API 進行交互。
