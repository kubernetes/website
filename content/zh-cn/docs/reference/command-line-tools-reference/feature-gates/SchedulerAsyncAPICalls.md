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
修改 kube-scheduler，使整个调度周期中不再存在对 Kubernetes API 服务器的阻塞请求。
取而代之的是，使用异步代码与 Kubernetes API 进行交互。
