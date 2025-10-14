---
# title: API server
title: API-сервер
id: kube-apiserver
date: 2018-04-12
full_link: /docs/concepts/architecture/#kube-apiserver
# short_description: >
#  Control plane component that serves the Kubernetes API.
short_description: >
  Компонент площини управління, що надає доступ до API Kubernetes.

aka:
- kube-apiserver
tags:
- architecture
- fundamental
---
<!-- The API server is a component of the Kubernetes
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} that exposes the Kubernetes API.
The API server is the front end for the Kubernetes control plane.
-->
API-сервер є компонентом {{< glossary_tooltip text="площини управління" term_id="control-plane" >}} Kubernetes, через який можна отримати доступ до API Kubernetes. API-сервер є фронтендом площини управління Kubernetes.

<!--more-->

<!-- The main implementation of a Kubernetes API server is [kube-apiserver](/docs/reference/generated/kube-apiserver/). -->
<!-- kube-apiserver is designed to scale horizontally&mdash;that is, it scales by deploying more instances. -->
<!-- You can run several instances of kube-apiserver and balance traffic between those instances. -->
Основною реалізацією Kubernetes API-сервера є [kube-apiserver](/docs/reference/generated/kube-apiserver/). kube-apiserver підтримує горизонтальне масштабування, тобто масштабується за рахунок збільшення кількості інстансів. kube-apiserver можна запустити на декількох інстансах, збалансувавши між ними трафік.
