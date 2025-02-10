---
title: InPlacePodVerticalScaling
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.27"
---
Podリソースの再作成なしで垂直オートスケーリングができる機能を有効にします。
