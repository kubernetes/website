---
title: CPUManagerPolicyBetaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.23"
---
<!--
This allows fine-tuning of CPUManager policies,
experimental, Beta-quality options
This feature gate guards *a group* of CPUManager options whose quality level is beta.
This feature gate will never graduate to stable.
-->
允许对 CPU 管理器策略进行微调，针对试验性的、Beta 质量级别的选项。
此特性门控用来保护一组质量级别为 Beta 的 CPU 管理器选项。
此特性门控永远不会被升级为稳定版本。
