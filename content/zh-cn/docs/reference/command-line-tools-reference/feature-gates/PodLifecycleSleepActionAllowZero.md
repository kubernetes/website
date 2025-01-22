---
title: PodLifecycleSleepActionAllowZero
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.32"
---

<!--
Enables setting zero value for the `sleep` action in [container lifecycle hooks](/docs/concepts/containers/container-lifecycle-hooks/).
-->
允许在[容器生命周期回调](/zh-cn/docs/concepts/containers/container-lifecycle-hooks/)中为
`sleep` 操作设置零值。
