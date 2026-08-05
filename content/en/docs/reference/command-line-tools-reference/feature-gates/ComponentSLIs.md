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
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.32"
    toVersion: "1.34"

removed: true
---
Enable the `/metrics/slis` endpoint on Kubernetes components like
kubelet, kube-scheduler, kube-proxy, kube-controller-manager, cloud-controller-manager
allowing you to scrape health check metrics.
