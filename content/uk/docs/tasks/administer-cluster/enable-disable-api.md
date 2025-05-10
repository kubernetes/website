---
title: Увімкнення або вимкнення API Kubernetes
content_type: task
weight: 200
---

<!-- overview -->

На цій сторінці показано, як увімкнути або вимкнути версію API зі вузла {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} вашого кластера.

<!-- steps -->

Конкретні версії API можна увімкнути або вимкнути, передаючи `--runtime-config=api/<version>` як аргумент командного рядка до сервера API. Значення для цього аргументу є розділеним комами списком версій API. Пізніші значення перекривають попередні.

Аргумент командного рядка `runtime-config` також підтримує 2 спеціальні ключі:

- `api/all`, що представляє всі відомі API.
- `api/legacy`, що представляє лише застарілі API. Застарілі API — це будь-які API, які були явно визнані [застарілими](/docs/reference/using-api/deprecation-policy/).

Наприклад, щоб вимкнути всі версії API, крім v1, передайте `--runtime-config=api/all=false,api/v1=true` до `kube-apiserver`.

## {{% heading "whatsnext" %}}

Прочитайте [повну документацію](/docs/reference/command-line-tools-reference/kube-apiserver/) для компонента `kube-apiserver`.
