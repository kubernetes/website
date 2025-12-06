---
title: Використання Romana для NetworkPolicy
content_type: task
weight: 50
---

<!-- overview -->

Ця сторінка показує, як використовувати Romana для NetworkPolicy.

## {{% heading "prerequisites" %}}

Виконайте кроки 1, 2 та 3 з [початкового керівництва kubeadm](/docs/reference/setup-tools/kubeadm/).

<!-- steps -->

## Встановлення Romana за допомогою kubeadm {#installing-romana-with-kubeadm}

Слідуйте [керівництву з контейнеризованого встановлення](https://github.com/romana/romana/tree/master/containerize) для kubeadm.

## Застосування мережевих політик {#applying-network-policies}

Для застосування мережевих політик використовуйте одне з наступного:

* [Мережеві політики Romana](https://github.com/romana/romana/wiki/Romana-policies).
  * [Приклад мережевої політики Romana](https://github.com/romana/core/blob/master/doc/policy.md).
* API NetworkPolicy.

## {{% heading "whatsnext" %}}

Після встановлення Romana ви можете перейти до [Оголошення мережевої політики](/docs/tasks/administer-cluster/declare-network-policy/) для випробування Kubernetes NetworkPolicy.
