---
title: InPlacePodVerticalScalingAllocatedStatus
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.32"
    toVersion: "1.32"
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.33"

---
فیلد `allocatedResources` را در وضعیت کانتینر فعال می‌کند. این ویژگی مستلزم فعال بودن گیت `InPlacePodVerticalScaling` نیز هست.