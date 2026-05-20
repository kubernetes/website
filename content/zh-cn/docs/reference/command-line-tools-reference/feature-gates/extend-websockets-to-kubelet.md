---
title: ExtendWebSocketsToKubelet
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

<!--
When ExtendWebSocketsToKubelet is enabled and a kubelet node advertises support,
exec/attach/portforward streams are proxied directly to the kubelet rather than
being translated or tunneled at the API server. Critically, the same
stream translation and tunneling handlers used at the API server are now set up
identically at the kubelet — the logic is simply moved closer to the container
runtime. This feature depends on NodeDeclaredFeatures graduating to beta so that
kubelet capability advertisement is reliable in production clusters.
-->
当 ExtendWebSocketsToKubelet 启用且 kubelet 节点通告支持时，
exec/attach/portforward 流量直接代理到 kubelet，而不是在 API 服务器处转换或隧道传输。
关键在于，API 服务器使用的相同流转换和隧道处理程序现在在 kubelet
中也以相同的方式设置 —— 逻辑只是更靠近容器运行时。
此特性依赖于 NodeDeclaredFeatures 升级到 Beta，以便 kubelet 能力通告在生产集群中可靠。
