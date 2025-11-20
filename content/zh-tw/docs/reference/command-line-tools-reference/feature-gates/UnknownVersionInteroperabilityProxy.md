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
當存在多個不同版本的 kube-apiserver 時，將資源請求代理到正確的對等 kube-apiserver。
更多資訊請參見[混合版本代理](/zh-cn/docs/concepts/architecture/mixed-version-proxy/)。
