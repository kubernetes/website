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
Вмикає точку доступу `/metrics/slis` на таких компонентах Kubernetes як kubelet, kube-scheduler, kube-proxy, kube-controller-manager, cloud-controller-manager що дозволяє вам отримувати метрики перевірки працездатності.
