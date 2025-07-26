---
title: NodeSwap
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.22"
    toVersion: "1.27"
  - stage: beta
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.29"
  - stage: beta
    defaultValue: true
    fromVersion: "1.30"
---
kubelet را فعال کنید تا حافظه swap را برای بارهای کاری Kubernetes روی یک گره اختصاص دهد.
باید با تنظیم `KubeletConfiguration.failSwapOn` روی false استفاده شود.
برای جزئیات بیشتر، لطفاً به [swap memory](/docs/concepts/architecture/nodes/#swap-memory) مراجعه کنید.
