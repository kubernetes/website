---
title: SELinuxMount
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.36"
  - stage: stable
    defaultValue: true
    fromVersion: "1.37"

---
Прискорює запуск контейнера, дозволяючи kubelet монтувати томи для Pod безпосередньо з правильною міткою SELinux замість того, щоб рекурсивно змінювати кожен файл на томах. Це розширює можливості покращення продуктивності за допомогою `SELinuxMountReadWriteOncePod`, поширюючи реалізацію на всі томи.
