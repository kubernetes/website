---
title: CRIListStreaming
content_type: feature_gate
build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---
Дозволяє потокові RPC для операцій list CRI (`ListContainers`, `ListPodSandbox`, `ListImages`). Коли увімкнено, kubelet використовує серверні потокові RPC (наприклад, `StreamContainers`, `StreamPodSandboxes`), які дозволяють середовищу виконання контейнерів розділяти результати на кілька відповідей, обходячи обмеження розміру повідомлення gRPC у 16 МіБ. Це дозволяє отримувати список контейнерів на вузлах з тисячами контейнерів без збоїв. Якщо середовище виконання контейнерів не підтримує потокові RPC, kubelet повертається до унарних RPC.
