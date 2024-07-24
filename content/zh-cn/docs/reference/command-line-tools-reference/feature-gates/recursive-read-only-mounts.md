---
title: RecursiveReadOnlyMounts
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
Enables support for recursive read-only mounts.
For more details, see [read-only mounts](/docs/concepts/storage/volumes/#read-only-mounts).
-->
启用对递归只读挂载的支持。
更多细节参阅[只读挂载](/zh-cn/docs/concepts/storage/volumes/#read-only-mounts)。
