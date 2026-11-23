---
title: KubeletCgroupDriverFromCRI
content_type: feature_gate
build:
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
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    locked: true
    fromVersion: "1.34"
---

Вмикає виявлення параметра конфігурації драйвера cgroup kubelet із {{<glossary_tooltip term_id="cri" text="CRI">}}. Виявлення працює лише на вузлах, де встановлено середовище виконання контейнерів CRI, що підтримує виклик CRI `RuntimeConfig`. Якщо CRI підтримує цю функцію, kubelet ігнорує параметр конфігурації `cgroupDriver` (або застарілий аргумент командного рядка `--cgroup-driver`). Якщо середовище виконання контейнерів не підтримує цей RPC, kubelet використовує застарілий механізм, що базується на перевірці параметра конфігурації `cgroupDriver`. У майбутніх версіях Kubernetes kubelet перестане використовувати цю конфігурацію як запасний варіант. Тому користувачам необхідно оновити середовище виконання контейнерів CRI до версії, що підтримує виклик CRI `RuntimeConfig`. Адміністратори можуть використовувати метрику
`kubelet_cri_losing_support`, щоб перевірити, чи є у їхньому кластері вузли, які використовують застарілу поведінку.
