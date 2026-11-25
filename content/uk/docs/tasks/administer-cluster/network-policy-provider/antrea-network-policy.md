---
title: Використання Antrea для NetworkPolicy
content_type: task
weight: 10
---

<!-- overview -->
Ця сторінка показує, як встановити та використовувати втулок Antrea CNI в Kubernetes. Щоб дізнатися більше про проєкт Antrea, прочитайте [Вступ до Antrea](https://antrea.io/docs/).

## {{% heading "prerequisites" %}} {#before-you-begin}

Вам потрібен кластер Kubernetes. Щоб створити його, скористайтеся [посібником з початку роботи з kubeadm](/docs/reference/setup-tools/kubeadm/).

<!-- steps -->

## Розгортання Antrea за допомогою kubeadm {#deploying-antrea-with-kubeadm}

Щоб розгорнути Antrea для kubeadm, скористайтеся посібником [Getting Started](https://github.com/vmware-tanzu/antrea/blob/main/docs/getting-started.md).

## {{% heading "whatsnext" %}} {#what-s-next}

Після того, як ваш кластер буде запущений, ви можете перейти до [Оголошення мережевої політики](/docs/tasks/administer-cluster/declare-network-policy/), щоб спробувати в дії Kubernetes NetworkPolicy.
