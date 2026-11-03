---
title: CustomResourceDefinition
id: CustomResourceDefinition
full_link: /docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
short_description: >
  Власний код, який визначає ресурс для додавання до вашого API-сервера Kubernetes без створення повноцінного власного сервера.

aka:
tags:
- fundamental
- operation
- extension
---

Різновид {{< glossary_tooltip text="обʼєкта API" term_id="object" >}}, який визначає новий власний API для додавання до вашого API-сервера Kubernetes без створення повноцінного власного сервера.

<!--more-->

CustomResourceDefinitions (визначення власних ресурсів) дозволяють розширювати API Kubernetes для вашого середовища, якщо вбудовані {{< glossary_tooltip text="ресурси API" term_id="api-resource" >}} не задовольняють ваших потреб.
