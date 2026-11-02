---
title: Використання Service для доступу до застосунку в кластері
content_type: tutorial
weight: 60
---

<!-- overview -->

На цій сторінці показано, як створити обʼєкт Service у Kubernetes, за допомогою якого зовнішні клієнти можуть отримати доступ до застосунку, що працює в кластері. Service забезпечує балансування навантаження для застосунку, який має два запущені екземпляри.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

## {{% heading "objectives" %}} {#objectives}

- Запустити два екземпляри застосунку Hello World.
- Створити обʼєкт Service, який відкриває порт вузла.
- Використовувати обʼєкт Service для доступу до запущеного застосунку.

<!-- lessoncontent -->

## Створення Service для застосунку, що працює у двох Podʼах {#creating-a-service-for-an-application-running-in-two-pods}

Ось файл конфігурації Deployment застосунку:

{{% code_sample file="service/access/hello-application.yaml" %}}

1. Запустіть застосунок Hello World у кластері: створіть Deployment застосунку за допомогою наведеного вище файлу:

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```

   Попередня команда створює {{< glossary_tooltip text="Deployment" term_id="deployment" >}} і повʼязаний {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}. ReplicaSet має два {{< glossary_tooltip text="Podʼи" term_id="pod" >}}, кожен з яких запускає застосунок Hello World.

1. Перегляньте інформацію про Deployment:

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. Перегляньте інформацію про ваші обʼєкти ReplicaSet:

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. Створіть обʼєкт Service, який відкриває доступ до Deployment:

   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

1. Перегляньте інформацію про Service:

   ```shell
   kubectl describe services example-service
   ```

   Вивід подібний до такого:

   ```none
   Name:                   example-service
   Namespace:              default
   Labels:                 run=load-balancer-example
   Annotations:            <none>
   Selector:               run=load-balancer-example
   Type:                   NodePort
   IP:                     10.32.0.16
   Port:                   <unset> 8080/TCP
   TargetPort:             8080/TCP
   NodePort:               <unset> 31496/TCP
   Endpoints:              10.200.1.4:8080,10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```

   Занотуйте значення NodePort для Service. Наприклад, у попередньому виводі значення NodePort становить 31496.

1. Виведіть Podʼи, на яких працює застосунок Hello World:

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   Вивід подібний до такого:

   ```none
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```

1. Отримайте публічну IP-адресу одного з вузлів, на якому працює Pod Hello World. Спосіб отримання цієї адреси залежить від того, як налаштовано кластер. Наприклад, якщо ви використовуєте Minikube, адресу вузла можна побачити, виконавши `kubectl cluster-info`. Якщо ви використовуєте екземпляри Google Compute Engine, переглянути публічні адреси вузлів можна командою `gcloud compute instances list`.

1. На вибраному вузлі створіть правило фаєрвола, яке дозволяє TCP-трафік на порт вузла. Наприклад, якщо значення NodePort вашого Service — 31568, створіть правило фаєрвола, яке дозволяє TCP-трафік на порт 31568. Різні хмарні провайдери пропонують різні способи налаштування правил фаєрвола.

1. Використовуйте адресу вузла та порт вузла для доступу до застосунку Hello World:

   ```shell
   curl http://<public-node-ip>:<node-port>
   ```

   де `<public-node-ip>` — публічна IP-адреса вашого вузла, а `<node-port>` — значення NodePort вашого сервісу. Відповідь на успішний запит — вітальне повідомлення:

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: hello-world-cdd4458f4-m47c8
   ```

## Використання файлу конфігурації Service {#using-a-service-configuration-file}

Замість `kubectl expose` можна використати [файл конфігурації Service](/docs/concepts/services-networking/service/), щоб створити Service.

## {{% heading "cleanup" %}} {#cleaning-up}

Щоб видалити Service, введіть цю команду:

    kubectl delete services example-service

Щоб видалити Deployment, ReplicaSet і Podʼи, на яких працює застосунок Hello World, введіть цю команду:

    kubectl delete deployment hello-world

## {{% heading "whatsnext" %}} {#what-s-next}

Скористайтеся навчальним матеріалом [Підключення застосунків за допомогою Services](/docs/tutorials/services/connect-applications-service/).
