---
title: ClusterTrustBundle
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
---

Ця функціональна можливість існує в Kubernetes API server та controller manager.

Використовуючи kube-apiserver, вона дозволяє підтримку ClusterTrustBundle.

Щоб використовувати API ClusterTrustBundle у вашому кластері, потрібно увімкнути цю функціональну можливість і також [увімкнути](/docs/tasks/administer-cluster/enable-disable-api/) відповідну альфа-групу API за допомогою аргументу командного рядка `--runtime-config` для kube-apiserver.

У Kubernetes controller manager вона використовується для керування публікацією ClusterTrustBundle для підписувача `kubernetes.io/kube-apiserver-serving`.
