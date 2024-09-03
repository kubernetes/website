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
---

<!--
Enables retrying of object creation when the
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
is expected to generate a [name](/docs/concepts/overview/working-with-objects/names/#names).
When this feature is enabled, requests using `generateName` are retried automatically in case the
control plane detects a name conflict with an existing object, up to a limit of 8 total attempts.
-->
当 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}要生成[名称](/zh-cn/docs/concepts/overview/working-with-objects/names/#names)时，
允许重试对象创建。当此特性被启用时，如果控制平面检测到与某个现有对象存在名称冲突，
则使用 `generateName` 的请求将被自动重试，最多重试 8 次。
