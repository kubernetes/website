---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "LocalObjectReference"
content_type: "api_reference"
description: "LocalObjectReference містить достатньо інформації, щоб дозволити вам знайти вказаний обʼєкт всередині того самого простору імен."
title: "LocalObjectReference."
weight: 4
auto_generated: flase
---

`import "k8s.io/api/core/v1"`

LocalObjectReference містить достатньо інформації, щоб дозволити вам знайти вказаний обʼєкт всередині того самого простору імен."
title: "LocalObjectReference

---

- **name** (string)

    Назва обʼєкта, на який ви посилаєтеся. Це поле є фактично обов'язковим, але через зворотну сумісність дозволено залишати його порожнім. Екземпляри цього типу з порожнім значенням тут, як правило, є помилковими. Докладніше: [https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names](/docs/concepts/overview/working-with-objects/names/#names)
