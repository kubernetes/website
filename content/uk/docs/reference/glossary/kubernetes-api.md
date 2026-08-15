---
title: API Kubernetes
id: kubernetes-api
full_link: /docs/concepts/overview/kubernetes-api/
short_description: >
  Застосунок, який обслуговує функціонал Kubernetes через RESTful інтерфейс та зберігає стан кластера.

aka:
tags:
- fundamental
- architecture
---

Застосунок, який обслуговує функціонал Kubernetes через RESTful інтерфейс та зберігає стан кластера.

<!--more-->

Ресурси Kubernetes та "записи про наміри" зберігаються як обʼєкти API та модифікуються за допомогою RESTful викликів до API. API дозволяє керувати конфігурацією декларативним способом. Користувачі можуть взаємодіяти з API Kubernetes безпосередньо або за допомогою інструментів, таких як `kubectl`. Ядро API Kubernetes є гнучким та може бути розширено для підтримки власних ресурсів користувачів.
