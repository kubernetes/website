---
# Removed from Kubernetes
title: BoundServiceAccountTokenVolume
content_type: feature_gate

_build:
  list: never
  render: false
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
迁移 ServiceAccount 卷以使用由
ServiceAccountTokenVolumeProjection 组成的投射卷。集群管理员可以使用
`serviceaccount_stale_tokens_total` 度量值来监控依赖于扩展令牌的负载。
如果没有这种类型的负载，你可以在启动 `kube-apiserver` 时添加
`--service-account-extend-token-expiration=false` 参数关闭扩展令牌。
查看[绑定服务账号令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)获取更多详细信息。
