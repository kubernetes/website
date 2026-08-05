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

Change the kube-scheduler to make the entire scheduling cycle free of blocking requests to the Kubernetes API server.
Instead, interact with the Kubernetes API using asynchronous code.
