---
title: RetryGenerateName
content_type: feature_gate

_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"

---
Дозволяє повторити спробу створення обʼєкта, коли {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} очікується, що сервер {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}} згенерує [name](/docs/concepts/overview/working-with-objects/names/#names). Якщо цю можливість увімкнено, запити з використанням `generateName` будуть автоматично повторюватися, якщо панель управління виявить конфлікт імен з наявним обʼєктом, але не більше 8 спроб.
