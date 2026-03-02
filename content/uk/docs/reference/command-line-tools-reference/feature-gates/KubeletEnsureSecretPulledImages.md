---
title: KubeletEnsureSecretPulledImages
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.33"
    toVersion: "1.34"
  - stage: beta
    defaultValue: true
    fromVersion: "1.35"
---
Забезпечує, що podʼи, які запитують образ, мають дозвіл на доступ до образу за допомогою наданих облікових даних, якщо образ вже присутній на вузлі. Див. розділ [Забезпечення перевірки облікових даних при отриманні образу](/docs/concepts/containers/images#ensureimagepullcredentialverification).
