---
title: TopologyManagerPolicyBetaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---

<!--
Allow fine-tuning of topology manager policies,
experimental, Beta-quality options.
This feature gate guards *a group* of topology manager options whose quality level is beta.
This feature gate will never graduate to stable.
-->
允许微调拓扑管理器策略的实验性的、Beta 质量的选项。
此特性门控守护**一组**质量级别为 Beta 的拓扑管理器选项。
此特性门控绝对不会进阶至稳定版。
