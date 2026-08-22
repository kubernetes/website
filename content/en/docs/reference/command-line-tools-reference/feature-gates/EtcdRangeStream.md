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
Enables the kube-apiserver to use etcd's `RangeStream` RPC to stream large list
responses from etcd, instead of fetching them in a single `Range` response. This
reduces memory spikes in both etcd and the kube-apiserver when serving large
`LIST` requests.
