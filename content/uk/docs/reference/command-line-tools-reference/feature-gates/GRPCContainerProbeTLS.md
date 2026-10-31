---
title: GRPCContainerProbeTLS
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.37"
---
Вмикає підтримку TLS для gRPC-перевірок контейнерів. Коли увімкнено, ви можете додати поле `mode` до поля `grpc` у gRPC-перевірках. Встановлення `mode: TLS` для перевірки liveness, readiness або startup змушує kubelet підключатися через TLS (з `InsecureSkipVerify`). Див. [Налаштування перевірок Liveness, Readiness та Startup](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#grpc-probe-tls).
