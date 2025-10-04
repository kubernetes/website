---
title: ContainerStopSignals
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.33"
---
استفاده از چرخه عمر StopSignal را برای کانتینرها جهت پیکربندی سیگنال‌های توقف سفارشی که کانتینرها با استفاده از آنها متوقف می‌شوند، فعال می‌کند.