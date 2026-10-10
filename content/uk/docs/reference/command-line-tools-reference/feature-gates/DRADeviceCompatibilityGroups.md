---
title: DRADeviceCompatibilityGroups
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає підтримку [груп сумісності пристроїв](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#device-compatibility-groups) у DRA. Драйвери можуть оголошувати непрозорі групи сумісності для кожного запису `consumesCounters` пристрою в ResourceSlice, а планувальник спільно розподіляє лише ті пристрої, що використовують один і той самий набір лічильників, коли їх оголошені групи перетинаються. Вимагає увімкнення `DRAPartitionableDevices`.
