---
title: SELinuxMount
content_type: feature_gate
_build:
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

---
Прискорює запуск контейнера, дозволяючи kubelet монтувати томи для Pod безпосередньо з правильною міткою SELinux замість того, щоб рекурсивно змінювати кожен файл на томах. Це розширює можливості покращення продуктивності за допомогою `SELinuxMountReadWriteOncePod`, поширюючи реалізацію на всі томи.

Для увімкнення `SELinuxMount` потрібно, щоб було увімкнено `SELinuxChangePolicy`.
