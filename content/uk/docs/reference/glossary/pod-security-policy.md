---
title: Політики безпеки Podʼа
id: pod-security-policy
full_link: /docs/concepts/security/pod-security-policy/
short_description: >
  Видалений API, що забезпечував дотримання обмежень безпеки Podʼів.

aka:
- Pod Security Policy
tags:
- security
---

Колишній API Kubernetes, що забезпечував дотримання обмежень безапеки, під час створення та оновлення {{< glossary_tooltip term_id="pod" text="Podʼів">}}.

<!--more-->

Починаючи з Kubernetes v1.21, `PodSecurityPolicy` визнано застарілими, а з v1.25 — видалено. Як альтернативу, використовуйте [Pod Security Admission](/docs/concepts/security/pod-security-admission/) або сторонній втулок допуску.
