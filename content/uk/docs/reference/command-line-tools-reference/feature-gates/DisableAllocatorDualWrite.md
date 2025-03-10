---
title: DisableAllocatorDualWrite
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.31"
---

Ви можете увімкнути функціональну можливість `MultiCIDRServiceAllocator`. Сервер API підтримує міграцію зі старих розподільників bitmap ClusterIP на нові розподільники IPAddress.

Сервер API виконує подвійний запис на обидва розподільники. Ця функція вимикає подвійний запис на нові розподільники ClusterIP; ви можете увімкнути цю функцію, якщо ви завершили відповідний етап міграції.
