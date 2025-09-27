---
title: ExpandedDNSConfig
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.25"
  - stage: beta
    defaultValue: true
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.29"
removed: true
---
Дозволяє використовувати kubelet і kube-apiserver, щоб отримати більше шляхів пошуку DNS і довший список шляхів пошуку DNS. Ця функція потребує підтримки середовища виконання контейнерів (Containerd: v1.5.6 або новішої версії, CRI-O: v1.22 або новішої версії). Див. статтю [Розширена конфігурація DNS](/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration).
