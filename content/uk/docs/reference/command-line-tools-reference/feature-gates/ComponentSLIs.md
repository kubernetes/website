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
Вмикає точку доступу `/metrics/slis` на таких компонентах Kubernetes як kubelet, kube-scheduler, kube-proxy, kube-controller-manager, cloud-controller-manager що дозволяє вам отримувати метрики перевірки працездатності.
