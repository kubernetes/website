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

Makes all API calls during scheduling asynchronous, by introducing a new kube-scheduler-wide way of handling such calls.
