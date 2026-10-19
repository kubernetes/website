---
title: DRAResourceClaimGranularStatusAuthorization
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.36"
---

<!--
Enables support for granular authorization of ResourceClaim status updates.
This feature requires additional fine-grained access permissions when modifying
specific fields within ResourceClaim status objects.
-->
启用对 ResourceClaim 状态更新的细粒度授权支持。
此特性需要在修改 ResourceClaim 状态对象中的特定字段时，拥有额外的细粒度访问权限。
