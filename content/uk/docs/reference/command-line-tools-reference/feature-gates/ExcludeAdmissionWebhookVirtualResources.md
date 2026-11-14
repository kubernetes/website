---
title: ExcludeAdmissionWebhookVirtualResources
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: beta
    defaultValue: true
    fromVersion: "1.37"
---
Виключає непостійні (віртуальні) ресурси автентифікації та авторизації, такі як `TokenReview` та `SubjectAccessReview`, з admission webhooks. Це відповідає набору ресурсів, які ValidatingAdmissionPolicy та MutatingAdmissionPolicy вже виключають, і запобігає блокуванню некоректно працюючим webhook власних запитів автентифікації та авторизації кластера. Вимкніть цю функціональну можливість, щоб відновити попередню поведінку надсилання admission webhooks для цих ресурсів.
