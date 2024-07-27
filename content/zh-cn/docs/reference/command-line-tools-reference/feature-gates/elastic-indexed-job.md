---
title: ElasticIndexedJob
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
---
<!--
Enables Indexed Jobs to be scaled up or down by mutating both
`spec.completions` and `spec.parallelism` together such that `spec.completions == spec.parallelism`.
See docs on [elastic Indexed Jobs](/docs/concepts/workloads/controllers/job#elastic-indexed-jobs)
for more details.
-->
允许通过同时改变 `spec.completions` 和 `spec.parallelism`
使得 `spec.completions == spec.parallelism` 来对带索引的 Job 执行扩容或缩容。
更多细节请参阅[弹性索引 Job](/zh-cn/docs/concepts/workloads/controllers/job#elastic-indexed-jobs) 文档。
