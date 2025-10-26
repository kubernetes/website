---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "NodeSelectorRequirement"
content_type: "api_reference"
description: "Вимоги селектора вузлів — це селектор, що містить значення, ключ та оператор, який повʼязує ключ і значення."
title: "NodeSelectorRequirement"
weight: 5
auto_generated: false
---

`import "k8s.io/api/core/v1"`

Вимоги селектора вузлів — це селектор, що містить значення, ключ та оператор, який повʼязує ключ і значення.

---

- **key** (string), обовʼязково

  key — це ключ мітки, до якого застосовується селектор.

- **operator** (string), обовʼязково

  operator представляє стосунок ключа до набору значень. Допустимі оператори: In, NotIn, Exists, DoesNotExist, Gt та Lt.

  Можливі значення переліку (enum):
  - `"DoesNotExist"`
  - `"Exists"`
  - `"Gt"`
  - `"In"`
  - `"Lt"`
  - `"NotIn"`

- **values** ([]string)

  *Atomic: буде замінено під час злиття*

  values — це масив рядкових значень. Якщо оператор — In або NotIn, масив значень повинен бути не пустим. Якщо оператор — Exists або DoesNotExist, масив значень повинен бути пустим. Якщо оператор — Gt або Lt, масив значень повинен містити один елемент, який буде інтерпретовано як ціле число. Цей масив замінюється під час стратегічного злиття патча.
