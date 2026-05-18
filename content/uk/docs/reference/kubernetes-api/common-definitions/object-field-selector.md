---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "ObjectFieldSelector"
content_type: "api_reference"
description: "`ObjectFieldSelector` вибирає поле з версією API обʼєкта."
title: "ObjectFieldSelector"
weight: 6
auto_generated: false
---

`import "k8s.io/api/core/v1"`

`ObjectFieldSelector` вибирає поле з версією API обʼєкта.

---

- **fieldPath** (string), обовʼязково

  Шлях поля для вибору в зазначеній версії API.

- **apiVersion** (string)

  Версія схеми, в якій виражений fieldPath, стандартне значення — "v1".
