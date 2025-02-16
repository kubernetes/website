---
title: KubeletCgroupDriverFromCRI
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.28"
    toVersion: "1.30"
  - stage: beta
    defaultValue: true
    fromVersion: "1.31"
---
Вмикає виявлення параметра конфігурації драйвера cgroup kubelet з {{<glossary_tooltip term_id="cri" text="CRI">}}. Ви можете використовувати цю функціональну можливість на вузлах з kubelet, які її підтримують, і де є середовище виконання контейнерів CRI, що підтримує виклик CRI `RuntimeConfig`. Якщо як CRI, так і kubelet підтримують цю функцію, kubelet ігнорує налаштування конфігурації `cgroupDriver` (або застарілий аргумент командного рядка `--cgroup-driver`). Якщо ви увімкнете цю функціональну можливість, а середовище виконання контейнерів не підтримує її, kubelet повертається до використання драйвера, налаштованого за допомогою параметра конфігурації `cgroupDriver`. Дивіться [Конфігурація драйвера cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver) для отримання додаткової інформації.
