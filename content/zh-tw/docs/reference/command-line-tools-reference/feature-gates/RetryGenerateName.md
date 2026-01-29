---
title: RetryGenerateName
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
    toVersion: "1.31"
  - stage: stable
    defaultValue: true
    fromVersion: "1.32"
---

<!--
Enables retrying of object creation when the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
is expected to generate a [name](/docs/concepts/overview/working-with-objects/names/#names).

When this feature is enabled, requests using `generateName` are retried automatically in case the
control plane detects a name conflict with an existing object, up to a limit of 8 total attempts.
-->
當 {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}要生成[名稱](/zh-cn/docs/concepts/overview/working-with-objects/names/#names)時，
允許重試對象創建。

當此特性被啓用時，如果控制平面檢測到與某個現有對象存在名稱衝突，
則使用 `generateName` 的請求將被自動重試，最多重試 8 次。
