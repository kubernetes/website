---
title: SELinuxMountReadWriteOncePod
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha 
    defaultValue: false
    fromVersion: "1.25"
    toVersion: "1.26"
  - stage: beta
    defaultValue: false
    fromVersion: "1.27"
    toVersion: "1.27"
  - stage: beta
    defaultValue: true
    fromVersion: "1.28"
---
Прискорює запуск контейнера, дозволяючи kubelet монтувати томи для Pod безпосередньо з правильною міткою SELinux замість того, щоб рекурсивно змінювати кожен файл на томах. Початкова реалізація була зосереджена на томах ReadWriteOncePod.
