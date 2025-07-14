---
title: KubeletPSI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
kubelet را فعال کنید تا معیارهای اطلاعات مربوط به واماندگی فشار (PSI) را در Summary API و معیارهای Prometheus نمایش دهد.

