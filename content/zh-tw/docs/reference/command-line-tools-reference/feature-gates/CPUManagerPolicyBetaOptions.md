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
允許對 CPU 管理器策略進行微調，針對試驗性的、Beta 質量級別的選項。
此特性門控用來保護一組質量級別爲 Beta 的 CPU 管理器選項。
此特性門控永遠不會被升級爲穩定版本。
