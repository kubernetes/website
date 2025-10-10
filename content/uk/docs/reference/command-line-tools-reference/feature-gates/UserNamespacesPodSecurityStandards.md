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
---
Дозволити помʼякшення політик стандартів безпеки для Podʼів, які працюють з просторами імен. Ви маєте встановити значення цієї можливості узгоджено на всіх вузлах кластера, а також увімкнути `UserNamespacesSupport`, щоб використовувати цю можливість.
