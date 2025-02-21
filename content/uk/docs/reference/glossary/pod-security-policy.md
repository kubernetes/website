---
title: Політики безпеки Podʼа
id: pod-security-policy
date: 2018-04-12
full_link: /uk/docs/concepts/security/pod-security-policy/
short_description: >
  Дозволяють деталізовану авторизацію створення та оновлення Podʼів.

aka: 
- Pod Security Policy
tags:
- core-object
- fundamental
---

Дозволяють деталізовану авторизацію створення та оновлення {{< glossary_tooltip term_id="pod" text="Podʼів">}}.

<!--more-->

Ресурс на рівні кластера, який контролює аспекти безпеки, що стосуються специфікації Podʼа. Обʼєкти `PodSecurityPolicy` визначають набір умов, якими повинен відповідати Pod, щоб його можна було прийняти в систему, а також стандартні значення для повʼязаних полів. Керування політикою безпеки Podʼа реалізується як додатковий контролер допуску.

Починаючи з Kubernetes v1.21, `PodSecurityPolicy` визнано застарілими, а з v1.25 — видалено. Як альтернативу, використовуйте [Pod Security Admission](/uk/docs/concepts/security/pod-security-admission/) або сторонній втулок допуску.
