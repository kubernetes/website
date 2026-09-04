---
title: Використання Antrea для NetworkPolicy
content_type: task
weight: 10
---

<!-- overview -->
Ця сторінка показує, як встановити та використовувати втулок Antrea CNI в Kubernetes. Щоб дізнатися більше про проєкт Antrea, прочитайте [Вступ до Antrea](https://antrea.io/docs/).

## {{% heading "prerequisites" %}}

Вам потрібно мати кластер Kubernetes. Слідуйте [початковому керівництву kubeadm](/docs/reference/setup-tools/kubeadm/) для його створення.

<!-- steps -->

## Розгортання Antrea за допомогою kubeadm {#deploying-antrea-with-kubeadm}

Слідуйте керівництву [Початок роботи](https://github.com/vmware-tanzu/antrea/blob/main/docs/getting-started.md) для розгортання Antrea за допомогою kubeadm.

## {{% heading "whatsnext" %}}

Після того, як ваш кластер буде запущений, ви можете перейти до [Оголошення мережевої політики](/docs/tasks/administer-cluster/declare-network-policy/), щоб спробувати в дії Kubernetes NetworkPolicy.
