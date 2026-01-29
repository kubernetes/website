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
允許對 CPU 管理器策略進行微調，針對試驗性的、Alpha 質量級別的選項。
此特性門控用來保護一組質量級別爲 Alpha 的 CPU 管理器選項。
此特性門控永遠不會被升級爲 Beta 或者穩定版本。
