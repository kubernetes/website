---
title: Cloud Controller Manager
id: cloud-controller-manager
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Компонент панелі управління, що інтегрує Kubernetes зі сторонніми хмарними провайдерами.
aka:
tags:
- architecture
- operation
---

Компонент {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} Kubernetes, що вбудовує логіку управління, специфічну для хмари. Cloud controller manager дозволяє звʼязувати ваш кластер з API хмарного провайдера та відокремлює компоненти, що взаємодіють із хмарною платформою, від компонентів, які взаємодіють тільки з вашим кластером.

<!--more-->

Відокремлюючи логіку сумісності між Kubernetes і базовою хмарною інфраструктурою, компонент cloud-controller-manager дає змогу хмарним провайдерам випускати функції з іншою швидкістю порівняно з основним проєктом Kubernetes.
