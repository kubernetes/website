---
title: Watch
id: watch
full_link: /docs/reference/using-api/api-concepts/#api-verbs
short_description: >
  Дієслово, яке використовується для відстеження змін обʼєкта в Kubernetes у вигляді потоку.

aka:
- Спостереження
tags:
- API verb
- fundamental
---

Дієслово, яке використовується для відстеження змін обʼєкта в Kubernetes у вигляді потоку. Використовується для ефективного виявлення змін.

<!--more-->

Дієслово, яке використовується для відстеження змін обʼєкта у Kubernetes у вигляді потоку. Watch дозволяє ефективно виявляти зміни; наприклад, {{< glossary_tooltip term_id="controller" text="контролер" >}}, якому потрібно знати, коли змінюється ConfigMap, може використовувати watch, а не опитування.

Ознайомтесь з [Ефективним виявленням змін у концепціях API](/docs/reference/using-api/api-concepts/#efficient-detection-of-changes) для отримання додаткової інформації.
