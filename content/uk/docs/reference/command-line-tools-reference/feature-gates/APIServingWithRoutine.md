---
title: APIServingWithRoutine
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.30"
---
Ця функціональна можливість дозволяє серверу API покращити продуктивність: сервер API може використовувати окремі goroutines (легкі потоки, керовані середовищем виконання Go) для обслуговування запитів [**watch**](/docs/reference/using-api/api-concepts/#effective-detection-of-changes).
