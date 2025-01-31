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
配置 `kube-controller-manager` 以向每个命名空间发布名为 `kube-root-ca.crt` 的
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}。
这个 ConfigMap 包含一个 CA 证书包，用于验证与 kube-apiserver 的连接。
更多细节参阅[绑定的服务账户令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)。
