---
# Removed from Kubernetes
title: RootCAConfigMap
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.19"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.20"
    toVersion: "1.20"
  - stage: stable
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.22"

removed: true
---

<!--
Configure the `kube-controller-manager` to publish a
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} named `kube-root-ca.crt`
to every namespace. This ConfigMap contains a CA bundle used for verifying connections
to the kube-apiserver. See
[Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
for more details.
-->
設定 `kube-controller-manager` 以向每個命名空間發佈名爲 `kube-root-ca.crt` 的
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}。
這個 ConfigMap 包含一個 CA 證書包，用於驗證與 kube-apiserver 的連接。
更多細節參閱[綁定的服務賬戶令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)。
