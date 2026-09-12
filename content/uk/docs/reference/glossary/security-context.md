---
title: Контекст Безпеки
id: security-context
full_link: /docs/tasks/configure-pod-container/security-context/
short_description: >
  Поле `securityContext` визначає налаштування привілеїв та контролю доступу для Podʼа або контейнера.

aka:
- Security Context
tags:
- security
---

Поле `securityContext` визначає налаштування привілеїв та контролю доступу для {{< glossary_tooltip text="Podʼа" term_id="pod" >}} або {{< glossary_tooltip text="контейнера" term_id="container" >}}.

<!--more-->

У `securityContext` можна визначити: користувача, яким виконуються процеси, групу, якою виконуються процеси, та налаштування привілеїв. Також можна налаштувати політики безпеки (наприклад: SELinux, AppArmor чи seccomp).

Налаштування `PodSpec.securityContext` застосовується до всіх контейнерів в Podʼі.
