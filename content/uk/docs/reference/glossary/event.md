---
title: Event
id: event
date: 2022-01-16
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   Events — це обʼєкти Kubernetes, які описують зміну стану в системі.

aka: 
tags:
- core-object
- fundamental
---
Event – це обʼєкт Kubernetes, який описує зміну стану або помітні події в системі.

<!--more-->
Eventʼи мають обмежений час зберігання, а причини та повідомлення можуть змінюватися з часом. Споживачі подій не повинні покладатися на терміни події із зазначеною причиною, що відображає стан основної причини, або продовження існування подій з цієї причини.

Eventʼи слід розглядати як інформаційні дані, що надаються як найкраще, та які є додатковими даними.

У Kubernetes [аудит](/docs/tasks/debug/debug-cluster/audit/) генерує інший вид Event (API-група `audit.k8s.io`).
