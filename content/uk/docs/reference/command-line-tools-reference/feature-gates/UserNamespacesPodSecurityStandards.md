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
Дозволити помʼякшення політик стандартів безпеки Podʼів (Pod Security Standards) для Podʼів, які працюють з просторами імен. Ви маєте встановити значення цієї функціональної можливості узгоджено на всіх вузлах кластера, а також увімкнути `UserNamespacesSupport`, щоб використовувати цю функцію.

Ця функціональна можливість не входить до складу Kubernetes v1.35 (і наступних версій), оскільки в цих версіях Kubernetes усі підтримувані версії kubelet не зможуть створити Pod, якщо він запитує простір імен користувача, а вузол — ні.
