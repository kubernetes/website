---
title: ChangeContainerStatusOnKubeletRestart
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: deprecated
    defaultValue: false
    fromVersion: "1.35"
---
Вмикає старий спосіб запису для оновлення статусу контейнера `ready` після того, як kubelet виявляє [перезапуск](/docs/concepts/workloads/pods/pod-lifecycle/#kubelet-restarts).

Ця функція була введена, щоб дозволити вам повернути поведінку до раніше використовуваного стандартного значення. Якщо вас влаштовує стандартна поведінка, вам не потрібно вмикати цю функцію.
