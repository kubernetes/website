---
title: Використання Kube-router для NetworkPolicy
content_type: task
weight: 40
---

<!-- overview -->

Ця сторінка показує, як використовувати [Kube-router](https://github.com/cloudnativelabs/kube-router) для NetworkPolicy.

## {{% heading "prerequisites" %}} {#before-you-begin}

Вам потрібно мати запущений кластер Kubernetes. Якщо у вас ще немає кластера, ви можете створити його, використовуючи будь-які інсталятори кластерів, такі як Kops, Bootkube, Kubeadm тощо.

<!-- steps -->

## Встановлення надбудови Kube-router {#installing-kube-router-addon}

Надбудова Kube-router містить контролер мережевих політик, який відстежує на API-сервері Kubernetes оновлення будь-яких NetworkPolicy та Podʼів і налаштовує правила iptables та ipsets, щоб дозволяти або блокувати трафік відповідно до політик. Щоб встановити надбудову Kube-router, скористайтеся посібником [trying Kube-router with cluster installers](https://www.kube-router.io/docs/user-guide/#try-kube-router-with-cluster-installers).

## {{% heading "whatsnext" %}} {#what-s-next}

Після того, як ви встановили надбудову Kube-router, ви можете перейти до [Оголошення мережевої політики](/docs/tasks/administer-cluster/declare-network-policy/) для випробування Kubernetes NetworkPolicy.
