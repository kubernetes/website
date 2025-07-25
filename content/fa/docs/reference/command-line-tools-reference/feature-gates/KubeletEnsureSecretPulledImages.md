---
title: KubeletEnsureSecretPulledImages
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
---
اطمینان حاصل کنید که پادهایی که درخواست تصویر می‌کنند، با اعتبارنامه‌های ارائه شده، در زمانی که تصویر از قبل در گره موجود است، مجاز به دسترسی به تصویر هستند. به [Ensure Image Pull Credential Verification](/docs/concepts/containers/images#ensureimagepullcredentialverification). مراجعه کنید.