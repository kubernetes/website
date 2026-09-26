---
title: VolumeBindMountOptions
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає встановлення параметрів монтування bind (`noexec`, `nodev`, `nosuid`) для кожного монтування тому контейнера за допомогою поля `bindMountOptions` у `volumeMounts`. Коли увімкнено, kubelet передає ці параметри середовищу виконання контейнерів, яке застосовує їх як прапорці монтування bind Linux. Середовище виконання контейнерів має підтримувати поле `mount_options` у повідомленні CRI `Mount`. Це поле не впливає на вузли Windows.
