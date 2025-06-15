---
# Removed from Kubernetes
title: APISelfSubjectReview
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.26"
    toVersion: "1.26"
  - stage: beta
    defaultValue: true
    fromVersion: "1.27"
    toVersion: "1.27"
  - stage: stable
    defaultValue: true
    fromVersion: "1.28"
    toVersion: "1.29"
removed: true
---
Вмикає API `SelfSubjectReview`, який дозволяє користувачам бачити автентифікаційну інформацію субʼєкта запиту. Дивіться [API доступу до автентифікаційної інформації для клієнта](/docs/reference/access-authn-authz/authentication/#self-subject-review) для більш детальної інформації.
