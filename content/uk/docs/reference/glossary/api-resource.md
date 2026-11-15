---
title: Ресурс API
id: api-resource
full_link: /docs/reference/using-api/api-concepts/#standard-api-terminology
short_description: >
  Сутність Kubernetes, що представляє точку доступу на API-сервері Kubernetes.

aka:
 - Resource
tags:
- architecture
---

Сутність у системі типів Kubernetes, що відповідає точці доступу в {{< glossary_tooltip text="API Kubernetes" term_id="kubernetes-api" >}}. Ресурс зазвичай представляє {{< glossary_tooltip text="обʼєкт" term_id="object" >}}. Деякі ресурси представляють операцію над іншими обʼєктами, як-от перевірку дозволів.
<!--more-->
Кожен ресурс представляє точку доступу HTTP (URI) на API-сервері Kubernetes і визначає схему обʼєктів або операцій для цього ресурсу.
