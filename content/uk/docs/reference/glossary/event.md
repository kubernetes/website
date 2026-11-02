---
title: Подія
id: event
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   Обʼєкти Kubernetes, які описують зміну стану в кластері.

aka:
- Event
tags:
- core-object
- fundamental
---

{{< glossary_tooltip text="Обʼєкт" term_id="object" >}} Kubernetes, який описує зміну стану або помітні події в кластері.

<!--more-->

Події мають обмежений час зберігання, а причини та повідомлення можуть змінюватися з часом. Споживачі подій не повинні покладатися на терміни події із зазначеною причиною, що відображає стан основної причини, або продовження існування подій з цієї причини.

Події слід розглядати як інформаційні дані, що надаються як найкраще, та які є додатковими даними.

У Kubernetes [аудит](/docs/tasks/debug/debug-cluster/audit/) генерує інший вид Подій (API-група `audit.k8s.io`).
