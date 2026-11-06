---
title: Namespace
id: namespace
full_link: /docs/concepts/overview/working-with-objects/namespaces
short_description: >
  Абстракція, що використовується в Kubernetes для ізоляції груп ресурсів в межах одного кластера.

aka:
- Простір імен
tags:
- fundamental
---

Абстракція, що використовується в Kubernetes для ізоляції груп {{< glossary_tooltip text="ресурсів API" term_id="api-resource" >}} в межах одного {{< glossary_tooltip text="кластера" term_id="cluster" >}}.

<!--more-->

Простори імен використовуються для організації обʼєктів в кластері та надають можливість поділу ресурсів кластера. Назви ресурсів повинні бути унікальними в межах простору імен, але не між просторами імен. Простори імен застосовуються лише до ресурсів, які належать до простору імен _(наприклад, Pods, Deployments, Services)_, і не застосовуються до ресурсів, які є загальними для кластера _(наприклад, StorageClasses, Nodes, PersistentVolumes)_.
