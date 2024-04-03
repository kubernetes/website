---
title: CPUManagerPolicyAlphaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.23"
---
<!--
This allows fine-tuning of CPUManager policies,
experimental, Alpha-quality options
This feature gate guards *a group* of CPUManager options whose quality level is alpha.
This feature gate will never graduate to beta or stable.
-->
允许对 CPU 管理器策略进行微调，针对试验性的、Alpha 质量级别的选项。
此特性门控用来保护一组质量级别为 Alpha 的 CPU 管理器选项。
此特性门控永远不会被升级为 Beta 或者稳定版本。
