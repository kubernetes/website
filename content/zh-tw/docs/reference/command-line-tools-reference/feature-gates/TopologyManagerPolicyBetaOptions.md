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
允許微調拓撲管理器策略的實驗性的、Beta 質量的選項。
此特性門控守護**一組**質量級別爲 Beta 的拓撲管理器選項。
此特性門控絕對不會進階至穩定版。
