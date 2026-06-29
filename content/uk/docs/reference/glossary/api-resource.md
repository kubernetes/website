---
title: Ресурс API
id: api-resource
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  Сутність Kubernetes, що представляє точку доступу сервера Kubernetes API.

aka:
 - Resource
tags:
- architecture
---

Сутність у системі типів Kubernetes, що відповідає точці доступу у {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}. Ресурс зазвичай представляє {{< glossary_tooltip text="обʼєкт" term_id="object" >}}. Деякі ресурси представляють операцію над іншими обʼєктами, наприклад, перевірку дозволів.
<!--more-->
Кожен ресурс являє собою точку доступу HTTP (URI) сервера Kubernetes API, що визначає схему для обʼєктів або операцій для цього ресурсу.
