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
<!--
Enables the kube-apiserver to use etcd's `RangeStream` RPC to stream large list
responses from etcd, instead of fetching them in a single `Range` response. This
reduces memory spikes in both etcd and the kube-apiserver when serving large
`LIST` requests.
-->
允许 kube-apiserver 使用 etcd 的 `RangeStream` RPC 以流式方式获取 etcd 的大型列表响应，
而不是通过单个 `Range` 响应一次性获取。
这可以减少 etcd 和 kube-apiserver 在处理大型 `LIST` 请求时的内存峰值。
