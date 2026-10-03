---
title: CustomResourceDefinition
id: CustomResourceDefinition
full_link: /docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
short_description: >
  Власний код, який визначає ресурс для додавання до сервера API вашого кластера Kubernetes без створення власного сервера.

aka:
tags:
- fundamental
- operation
- extension
---

Різновид {{< glossary_tooltip text="API object" term_id="object" >}}, який визначає новий власний API користувача для додавання до вашого сервера API Kubernetes без створення повноцінного власного сервера користувача.

<!--more-->

CustomResourceDefinitions (визначення власного ресурсу) дозволяють розширювати API Kubernetes для вашого середовища, якщо вбудовані {{< glossary_tooltip text="ресурси API" term_id="api-resource" >}} не можуть задовольнити ваші потреби.
