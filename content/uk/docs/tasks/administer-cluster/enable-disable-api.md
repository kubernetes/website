---
title: Увімкнення або вимкнення API Kubernetes
content_type: task
weight: 200
---

<!-- overview -->

На цій сторінці показано, як увімкнути або вимкнути версію API у {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} вашого кластера.

<!-- steps -->

Окремі версії API можна вмикати або вимикати, передаючи API-серверу аргумент командного рядка `--runtime-config=api/<version>`. Значення цього аргументу — список версій API, розділених комами. Пізніші значення перевизначають попередні.

Аргумент командного рядка `runtime-config` також підтримує 2 спеціальні ключі:

- `api/all`, що позначає всі відомі API
- `api/legacy`, що представляє лише застарілі API. Застарілі API — це будь-які API, які були явно визнані [застарілими](/docs/reference/using-api/deprecation-policy/).

Наприклад, щоб вимкнути всі версії API, крім v1, передайте `--runtime-config=api/all=false,api/v1=true` до `kube-apiserver`.

## {{% heading "whatsnext" %}} {#what-s-next}

Прочитайте [повну документацію](/docs/reference/command-line-tools-reference/kube-apiserver/) компонента `kube-apiserver`.
