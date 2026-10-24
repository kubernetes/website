---
title: H2CContainerProbe
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає підтримку HTTP/2 без шифрування (h2c) для HTTP-перевірок контейнерів. Коли увімкнено, ви можете додати поле `protocol` до поля `httpGet` у HTTP-перевірках. Встановлення `protocol: HTTP2` для перевірки liveness, readiness або startup змушує `kubelet` виконувати перевірку через h2c замість HTTP/1.1. Див. [Налаштування перевірок Liveness, Readiness та Startup](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#use-h2c-with-http-probes).
