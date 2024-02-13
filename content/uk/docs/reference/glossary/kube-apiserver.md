---
title: API server
id: kube-apiserver
date: 2018-04-12
full_link: /docs/concepts/overview/components/#kube-apiserver
short_description: >
  Компоент панелі управління, що обслуговує API Kubernetes.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
Сервер API є компонентом {{< glossary_tooltip text="панелі управління" term_id="control-plane" >}} Kubernetes, який надає доступ до API Kubernetes. Сервер API є фронтендом для панелі управління Kubernetes.

<!--more-->

Основна реалізація сервера API Kubernetes — [kube-apiserver](/docs/reference/generated/kube-apiserver/). kube-apiserver спроєктований для горизонтального масштабування, тобто масштабується за допомогою розгортання додаткових екземплярів. Ви можете запустити кілька екземплярів kube-apiserver та балансувати трафік між ними.
