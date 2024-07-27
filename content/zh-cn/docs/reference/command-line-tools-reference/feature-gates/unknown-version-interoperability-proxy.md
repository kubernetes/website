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

<!--
Proxy resource requests to the correct peer kube-apiserver when
multiple kube-apiservers exist at varied versions.
See [Mixed version proxy](/docs/concepts/architecture/mixed-version-proxy/) for more information.
-->
当存在多个不同版本的 kube-apiserver 时，将资源请求代理到正确的对等 kube-apiserver。
更多信息请参见[混合版本代理](/zh-cn/docs/concepts/architecture/mixed-version-proxy/) 。
