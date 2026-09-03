---
title: API server
id: kube-apiserver
full_link: /docs/concepts/architecture/#kube-apiserver
short_description: >
  Компонент панелі управління, що обслуговує API Kubernetes.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---

Сервер API є компонентом {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} Kubernetes, який надає доступ до API Kubernetes. Сервер API є фронтендом для панелі управління Kubernetes.

<!--more-->

Основна реалізація сервера API Kubernetes — [kube-apiserver](/docs/reference/generated/kube-apiserver/). kube-apiserver спроєктований для горизонтального масштабування, тобто масштабується за допомогою розгортання додаткових екземплярів. Ви можете запустити кілька екземплярів kube-apiserver та балансувати трафік між ними.
