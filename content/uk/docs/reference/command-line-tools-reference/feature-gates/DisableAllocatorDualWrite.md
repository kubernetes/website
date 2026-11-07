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
    toVersion: "1.32"
  - stage: beta
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.33"
  - stage: stable
    defaultValue: true
    fromVersion: "1.34"

---
Ви можете увімкнути функціональну можливість `MultiCIDRServiceAllocator`. API-сервер підтримує міграцію зі старих розподільників bitmap ClusterIP на нові розподільники IPAddress.

API-сервер виконує подвійний запис на обидва розподільники. Ця функціональна можливість вимикає подвійний запис на нові розподільники ClusterIP; ви можете увімкнути цю функціональну можливість, якщо ви завершили відповідний етап міграції.
