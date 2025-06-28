---
api_metadata:
  apiVersion: ""
  import: "k8s.io/api/core/v1"
  kind: "TypedLocalObjectReference"
content_type: "api_reference"
description: "TypedLocalObjectReference містить достатньо інформації, щоб дозволити вам знаходити типізований згаданий обʼєкт всередині того ж простору імен."
title: "TypedLocalObjectReference"
weight: 13
auto_generated: false
---

`import "k8s.io/api/core/v1"`

`TypedLocalObjectReference` містить достатньо інформації, щоб дозволити вам знаходити типізований згаданий обʼєкт всередині того ж простору імен.

---

- **kind** (string), обовʼязково

  Kind — це тип ресурсу, на який посилаються.

- **name** (string), обовʼязково

  Name — це назва ресурсу, на який посилаються.

- **apiGroup** (string)

  APIGroup — це група для ресурсу, на який посилаються. Якщо APIGroup не вказано, вказаний Kind повинен бути в основній групі API. Для будь-яких інших сторонніх типів APIGroup є обовʼязковим.
