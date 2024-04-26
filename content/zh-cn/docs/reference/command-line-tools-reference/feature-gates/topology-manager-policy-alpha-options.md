---
title: TopologyManagerPolicyAlphaOptions
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.26"
---

<!--
Allow fine-tuning of topology manager policies,
experimental, Alpha-quality options.
This feature gate guards *a group* of topology manager options whose quality level is alpha.
This feature gate will never graduate to beta or stable.
-->
允许微调拓扑管理器策略的实验性的、Alpha 质量的选项。
此特性门控守护**一组**质量级别为 Alpha 的拓扑管理器选项。
此特性门控绝对不会进阶至 Beta 或稳定版。
