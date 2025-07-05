---
title: Контролер допуску
id: admission-controller
date: 2019-06-28
full_link: /docs/reference/access-authn-authz/admission-controllers/
short_description: >
  Фрагмент коду, який перехоплює запити до сервера API Kubernetes перед збереженням обʼєкта.

aka:
- Admission Controller
tags:
- extension
- security
---

Фрагмент коду, який перехоплює запити до сервера API Kubernetes перед збереженням обʼєкта.

<!--more-->

Контролери допуску налаштовуються для API сервера Kubernetes і можуть бути "перевіряючими", "мутаційними" або обома. Будь-який контролер допуску може відхилити запит. Мутаційні контролери можуть модифікувати обʼєкти, які вони пропускають; перевіряючі контролери цього робити не можуть.

* [Контролери допуску в документації Kubernetes](/docs/reference/access-authn-authz/admission-controllers/)
