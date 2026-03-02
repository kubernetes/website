---
title: Використання Service для доступу до застосунку у кластері
content_type: task
weight: 60
---

<!-- overview -->

Ця сторінка показує, як створити обʼєкт Service в Kubernetes, який зовнішні клієнти можуть використовувати для доступу до застосунку, що працює у кластері. Service забезпечує балансування навантаження для застосунку, який має два запущені екземпляри.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

## {{% heading "objectives" %}}

- Запустити два екземпляри застосунку Hello World.
- Створити обʼєкт Service, який експонує порт вузла.
- Використовувати обʼєкт Service для доступу до запущеного застосунку.

<!-- lessoncontent -->

## Створення Service для застосунку, який працює у двох Podʼах {#creating-a-service-for-an-application-running-in-two-pods}

Ось конфігураційний файл для Deployment застосунку:

{{% code_sample file="service/access/hello-application.yaml" %}}

1. Запустіть застосунок Hello World у вашому кластері: Створіть Deployment застосунку, використовуючи файл вище:

   ```shell
   kubectl apply -f https://k8s.io/examples/service/access/hello-application.yaml
   ```

   Попередня команда створює {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
   та повʼязаний з ним {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}.
   ReplicaSet має два {{< glossary_tooltip text="Podʼи" term_id="pod" >}} кожен з яких запускає застосунок Hello World.

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

1. Створіть обʼєкт Service, який експонує Deployment:

   ```shell
   kubectl expose deployment hello-world --type=NodePort --name=example-service
   ```

1. Перегляньте інформацію про Service:

   ```shell
   kubectl describe services example-service
   ```

   Вивід буде схожий на цей:

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
   Endpoints:              10.200.1.4:8080, 10.200.2.5:8080
   Session Affinity:       None
   Events:                 <none>
   ```

   Занотуйте значення NodePort для Service. Наприклад, у попередньому виводі значення NodePort становить 31496.

1. Перегляньте Podʼи, що запускають застосунок Hello World:

   ```shell
   kubectl get pods --selector="run=load-balancer-example" --output=wide
   ```

   Вивід буде схожий на цей:

   ```none
   NAME                           READY   STATUS    ...  IP           NODE
   hello-world-2895499144-bsbk5   1/1     Running   ...  10.200.1.4   worker1
   hello-world-2895499144-m1pwt   1/1     Running   ...  10.200.2.5   worker2
   ```

1. Отримайте публічну IP-адресу одного з ваших вузлів, що запускає Pod Hello World. Як ви отримаєте цю адресу залежить від того, як ви налаштували свій кластер. Наприклад, якщо ви використовуєте Minikube, ви можете побачити адресу вузла, виконавши команду `kubectl cluster-info`. Якщо ви використовуєте trptvgkzhb Google Compute Engine, ви можете використати команду `gcloud compute instances list` для перегляду публічних адрес ваших вузлів.

1. На обраному вами вузлі створіть правило брандмауера, яке дозволяє TCP-трафік на вашому порту вузла. Наприклад, якщо ваш Service має значення NodePort 31568, створіть правило брандмауера, яке дозволяє TCP-трафік на порт 31568. Різні постачальники хмарних послуг пропонують різні способи налаштування правил брандмауера.

1. Використовуйте адресу вузла та порт вузла для доступу до застосунку Hello World:

   ```shell
   curl http://<public-node-ip>:<node-port>
   ```

   де `<public-node-ip>` — це публічна IP-адреса вашого вузла, а `<node-port>` — це значення NodePort для вашого Service. Відповідь на успішний запит буде повідомленням з привітанням:

   ```none
   Hello, world!
   Version: 2.0.0
   Hostname: hello-world-cdd4458f4-m47c8
   ```

## Використання конфігураційного файлу Service {#using-a-service-configuration-file}

Як альтернатива використанню `kubectl expose`, ви можете використовувати [конфігураційний файл Service](/docs/concepts/services-networking/service/) для створення Service.

## {{% heading "cleanup" %}}

Щоб видалити Service, введіть цю команду:

```shell
kubectl delete services example-service
```

Щоб видалити Deployment, ReplicaSet та Podʼи, що запускають застосунок Hello World, введіть цю команду:

```shell
 kubectl delete deployment hello-world
```

## {{% heading "whatsnext" %}}

Ознайомтесь з посібником [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/).
