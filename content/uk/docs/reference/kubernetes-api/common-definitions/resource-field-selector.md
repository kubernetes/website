---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ResourceFieldSelector"
content_type: "api_reference"
description: "ResourceFieldSelector представляє ресурси контейнера (cpu, memory) та формат їх виводу."
title: "ResourceFieldSelector"
weight: 11
auto_generated: false
---

`import "k8s.io/api/core/v1"`


`ResourceFieldSelector` представляє ресурси контейнера (cpu, memory) та їх формат виводу.

---

- **resource** (string), обовʼязково

  Обовʼязково: ресурс, який потрібно вибрати.

- **containerName** (string)

  Назва контейнера: обовʼязково для томів, необовʼязково для змінних середовища.

- **divisor** (<a href="{{< ref "../common-definitions/quantity#Quantity" >}}">Quantity</a>)

  Вказує формат виводу відображених ресурсів, стандартне значення — "1".
