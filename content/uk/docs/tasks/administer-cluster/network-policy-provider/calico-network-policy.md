---
title: Використання Calico для NetworkPolicy
content_type: task
weight: 20
---

<!-- overview -->
Ця сторінка показує кілька швидких способів створення кластера Calico в Kubernetes.

## {{% heading "prerequisites" %}}

Вирішіть, чи ви хочете розгорнути [хмарний](#creating-a-calico-cluster-with-google-kubernetes-engine-gke) або [локальний](#creating-a-local-calico-cluster-with-kubeadm) кластер.

<!-- steps -->

## Створення кластера Calico з Google Kubernetes Engine (GKE) {#creating-a-calico-cluster-with-google-kubernetes-engine-gke}

**Передумова**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts).

1. Щоб запустити кластер GKE з Calico, включіть прапорець `--enable-network-policy`.

   **Синтаксис**

   ```shell
   gcloud container clusters create [ІМ'Я_КЛАСТЕРА] --enable-network-policy
   ```

   **Приклад**

   ```shell
   gcloud container clusters create my-calico-cluster --enable-network-policy
   ```

2. Для перевірки розгортання використовуйте наступну команду.

   ```shell
   kubectl get pods --namespace=kube-system
   ```

   Podʼи Calico починаються з `calico`. Перевірте, щоб кожен з них мав статус `Running`.

## Створення локального кластера Calico з kubeadm {#creating-a-local-calico-cluster-with-kubeadm}

Щоб отримати локальний кластер Calico для одного хосту за пʼятнадцять хвилин за допомогою kubeadm, див. [Швидкий старт Calico](https://projectcalico.docs.tigera.io/getting-started/kubernetes/).

## {{% heading "whatsnext" %}}

Після того, як ваш кластер буде запущений, ви можете перейти до [Оголошення мережевої політики](/docs/tasks/administer-cluster/declare-network-policy/), щоб спробувати в дії Kubernetes NetworkPolicy.
