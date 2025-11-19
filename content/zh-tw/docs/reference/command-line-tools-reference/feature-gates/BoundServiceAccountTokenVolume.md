---
# Removed from Kubernetes
title: BoundServiceAccountTokenVolume
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.13"
    toVersion: "1.20"
  - stage: beta 
    defaultValue: true
    fromVersion: "1.21"
    toVersion: "1.21"    
  - stage: stable
    defaultValue: true
    fromVersion: "1.22"
    toVersion: "1.23"    

removed: true
---

<!--
Migrate ServiceAccount volumes to use a projected volume
consisting of a ServiceAccountTokenVolumeProjection. Cluster admins can use metric
`serviceaccount_stale_tokens_total` to monitor workloads that are depending on the extended
tokens. If there are no such workloads, turn off extended tokens by starting `kube-apiserver` with
flag `--service-account-extend-token-expiration=false`.

Check [Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
for more details.
-->
將 ServiceAccount 卷遷移到使用由
ServiceAccountTokenVolumeProjection 組成的投射卷。集羣管理員可以使用
`serviceaccount_stale_tokens_total` 指標來監控依賴於擴展令牌的工作負載。
如果沒有這樣的工作負載，你可以在啓動 `kube-apiserver` 時添加
`--service-account-extend-token-expiration=false` 標誌來關閉擴展令牌。

更多詳情請參見[綁定服務賬號令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)。
