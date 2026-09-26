---
title: InOrderInformers
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: true
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: beta
    defaultValue: true
    fromVersion: "1.34"
---

<!--
Force the informers to deliver watch stream events in order instead of out of order.
-->
强制通知组件（Informer）按顺序而非乱序传递 watch 流事件。
