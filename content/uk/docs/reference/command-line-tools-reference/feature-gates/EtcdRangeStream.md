---
title: EtcdRangeStream
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"

---
Дозволяє kube-apiserver використовувати RPC `RangeStream` etcd для потокової передачі великих відповідей list з etcd, замість отримання їх в одній відповіді `Range`. Це зменшує сплески використання памʼяті як в etcd, так і в kube-apiserver під час обслуговування великих запитів `LIST`.
