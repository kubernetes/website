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
Ця функціональна можливість (feature gate) дозволяє API-серверу покращити продуктивність: API-сервер може використовувати окремі goroutines (легкі потоки, керовані середовищем виконання Go) для обслуговування запитів [**watch**](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes).
