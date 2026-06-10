---
title: Cloud Controller Manager
id: cloud-controller-manager
full_link: /docs/concepts/architecture/cloud-controller/
short_description: >
  Компонент панелі управління, що інтегрує Kubernetes з хмарними провайдерами.
aka:
tags:
- architecture
- operation
---

Компонент {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} Kubernetes, що інтегрує управління логікою певної хмари. Cloud controller manager дозволяє звʼязувати ваш кластер з API хмарного провайдера та відокремлює компоненти, що взаємодіють з хмарною платформою від компонентів, які взаємодіють тільки в кластері.

<!--more-->

Відокремлюючи логіку сумісності між Kubernetes і базовою хмарною інфраструктурою, компонент cloud-controller-manager дає змогу хмарним провайдерам випускати функції з іншою швидкістю порівняно з основним проєктом Kubernetes.
