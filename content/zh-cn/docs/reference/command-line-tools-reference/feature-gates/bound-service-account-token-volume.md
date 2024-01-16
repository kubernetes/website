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
将 ServiceAccount 卷迁移到使用由
ServiceAccountTokenVolumeProjection 组成的投射卷。集群管理员可以使用
`serviceaccount_stale_tokens_total` 指标来监控依赖于扩展令牌的工作负载。
如果没有这样的工作负载，你可以在启动 `kube-apiserver` 时添加
`--service-account-extend-token-expiration=false` 标志来关闭扩展令牌。

更多详情请参见[绑定服务账号令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)。
