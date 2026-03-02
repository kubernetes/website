---
title: UserNamespacesPodSecurityStandards
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.29"
    toVersion: "1.34"

removed: true
---
Дозволити помʼякшення політик стандартів безпеки для Podʼів, які працюють з просторами імен. Ви маєте встановити значення цієї можливості узгоджено на всіх вузлах кластера, а також увімкнути `UserNamespacesSupport`, щоб використовувати цю можливість.

Ця функціональна можливість не входить до складу Kubernetes v1.35 (і наступних версій), оскільки в цих версіях Kubernetes усі підтримувані версії kubelet не зможуть створити под, якщо він запитує простір імен користувача, а вузол — ні.
