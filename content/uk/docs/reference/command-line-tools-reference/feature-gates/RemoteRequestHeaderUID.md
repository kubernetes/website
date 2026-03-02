---
title: RemoteRequestHeaderUID
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
---
Дозволяє серверу API приймати UID (ідентифікатори користувачів) через автентифікацію заголовка запиту. Це також змусить агрегатор API `kube-apiserver` додавати UID у стандартних заголовках під час пересилання запитів до серверів, що обслуговують агрегований API.
