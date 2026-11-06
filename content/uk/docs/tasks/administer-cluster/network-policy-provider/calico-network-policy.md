---
title: Використання Calico для NetworkPolicy
content_type: task
weight: 20
---

<!-- overview -->
Ця сторінка показує кілька швидких способів створення кластера Calico в Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

Вирішіть, чи ви хочете розгорнути [хмарний](#creating-a-calico-cluster-with-google-kubernetes-engine-gke) або [локальний](#creating-a-local-calico-cluster-with-kubeadm) кластер.

<!-- steps -->

## Створення кластера Calico з Google Kubernetes Engine (GKE) {#creating-a-calico-cluster-with-google-kubernetes-engine-gke}

**Передумова**: [gcloud](https://cloud.google.com/sdk/docs/quickstarts).

1. Щоб запустити кластер GKE з Calico, включіть прапорець `--enable-network-policy`.

   **Синтаксис**

   ```shell
   gcloud container clusters create [CLUSTER_NAME] --enable-network-policy
   ```

   **Приклад**

   ```shell
   gcloud container clusters create my-calico-cluster --enable-network-policy
   ```

1. Щоб перевірити розгортання, використайте таку команду.

   ```shell
   kubectl get pods --namespace=kube-system
   ```

   Podʼи Calico починаються з `calico`. Перевірте, щоб кожен з них мав статус `Running`.

## Створення локального кластера Calico з kubeadm {#creating-a-local-calico-cluster-with-kubeadm}

Щоб за пʼятнадцять хвилин отримати локальний кластер Calico з одним хостом за допомогою kubeadm, дивіться [Calico Quickstart](https://projectcalico.docs.tigera.io/getting-started/kubernetes/).

## {{% heading "whatsnext" %}} {#what-s-next}

Після того, як ваш кластер буде запущений, ви можете перейти до [Оголошення мережевої політики](/docs/tasks/administer-cluster/declare-network-policy/), щоб спробувати в дії Kubernetes NetworkPolicy.
