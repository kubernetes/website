---
title: UnknownVersionInteroperabilityProxy
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.35"
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---
Проксі-запити ресурсів до правильного однорангового kube-apiserver, коли існує декілька kube-апісерверів у різних версіях. Докладнішу інформацію наведено у статті [Проксі змішаних версій](/docs/concepts/architecture/mixed-version-proxy/).
