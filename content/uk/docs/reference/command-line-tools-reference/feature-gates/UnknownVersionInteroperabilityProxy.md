---
title: UnknownVersionInteroperabilityProxy
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
---
Проксі-запити ресурсів до правильного однорангового kube-apiserver, коли існує декілька kube-апісерверів у різних версіях. Докладнішу інформацію наведено у статті [Проксі змішаних версій](/docs/concepts/architecture/mixed-version-proxy/).
