---
title: ComponentSLIs
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---
<!--
Enable the `/metrics/slis` endpoint on Kubernetes components like
kubelet, kube-scheduler, kube-proxy, kube-controller-manager, cloud-controller-manager
allowing you to scrape health check metrics.
-->
在 kubelet、kube-scheduler、kube-proxy、kube-controller-manager、cloud-controller-manager
等 Kubernetes 组件上启用 `/metrics/slis` 端点，从而允许你抓取健康检查指标。
