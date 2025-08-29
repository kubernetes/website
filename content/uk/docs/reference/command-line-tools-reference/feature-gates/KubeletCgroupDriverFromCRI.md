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
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"
---

Вмикає виявлення параметра конфігурації драйвера cgroup kubelet з {{<glossary_tooltip term_id="cri" text="CRI">}}. Ця функціональна можливість тепер увімкнена для всіх кластерів. Однак вона працює лише на вузлах, де є рушій виконання контейнерів CRI, який підтримує виклик CRI `RuntimeConfig`. Якщо CRI підтримує цю функцію, kubelet ігнорує параметр конфігурації `cgroupDriver` (або застарілий аргумент командного рядка `--cgroup-driver`). Якщо рушій виконання контейнерів не підтримує його, kubelet повертається до використання драйвера, налаштованого за допомогою параметра конфігурації `cgroupDriver`. Kubelet перестане повертатися до цієї конфігурації в Kubernetes 1.36. Таким чином, користувачі повинні оновити свій рушій виконання контейнерів CRI до версії, яка підтримує виклик CRI `RuntimeConfig` до цього часу. Адміністратори можуть використовувати метрику `kubelet_cri_losing_support`, щоб дізнатися, чи є вузли в їхньому кластері, які втратять підтримку в 1.36. Наступні версії CRI підтримують цей виклик CRI:

* containerd: Підтримка була додана в v2.0.0
* CRI-O: Підтримка була додана в v1.28.0

Дивіться [Конфігурація драйвера cgroup](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver) для отримання додаткової інформації.
