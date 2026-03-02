---
title: Відкриття зовнішньої IP-адреси для доступу до застосунку в кластері
content_type: tutorial
weight: 10
---

<!-- overview -->

Ця сторінка показує, як створити обʼєкт Kubernetes Service, який відкриває зовнішню IP-адресу.

## {{% heading "prerequisites" %}}

* Встановіть [kubectl](/docs/tasks/tools/).
* Використовуйте хмарного провайдера, такого як Google Kubernetes Engine або Amazon Web Services, щоб створити кластер Kubernetes. У цьому підручнику створюється [зовнішній балансувальник навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/), який вимагає хмарного провайдера.
* Налаштуйте `kubectl` для спілкування з вашим API-сервером Kubernetes. Для інструкцій дивіться документацію вашого хмарного провайдера.

## {{% heading "objectives" %}}

* Запустіть пʼять екземплярів застосунку Hello World.
* Створіть обʼєкт Service, який відкриває зовнішню IP-адресу.
* Використовуйте обʼєкт Service для доступу до запущеного застосунку.

<!-- lessoncontent -->

## Створення Service для застосунку, що працює в пʼяти Podʼах {#creating-a-service-for-an-application-running-in-five-pods}

1. Запустіть застосунок Hello World у вашому кластері:

   {{% code_sample file="service/load-balancer-example.yaml" %}}

   ```shell
   kubectl apply -f https://k8s.io/examples/service/load-balancer-example.yaml
   ```

   Попередня команда створює {{< glossary_tooltip text="Deployment" term_id="deployment" >}} і повʼязаний з ним {{< glossary_tooltip term_id="replica-set" text="ReplicaSet" >}}. ReplicaSet має пʼять {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, кожен з яких запускає застосунок Hello World.

1. Виведіть інформацію про Deployment:

   ```shell
   kubectl get deployments hello-world
   kubectl describe deployments hello-world
   ```

1. Виведіть інформацію про обʼєкти ReplicaSet:

   ```shell
   kubectl get replicasets
   kubectl describe replicasets
   ```

1. Створіть обʼєкт Service, який експонує Deployment:

   ```shell
   kubectl expose deployment hello-world --type=LoadBalancer --name=my-service
   ```

1. Виведіть інформацію про Service:

   ```shell
   kubectl get services my-service
   ```

   Вивід буде подібний до:

   ```console
   NAME         TYPE           CLUSTER-IP     EXTERNAL-IP      PORT(S)    AGE
   my-service   LoadBalancer   10.3.245.137   104.198.205.71   8080/TCP   54s
   ```

   {{< note >}}

   Сервіс типу `type=LoadBalancer` підтримується зовнішніми хмарними провайдерами, що не розглядається в цьому прикладі, будь ласка, зверніться до [встановлення `type: LoadBalancer` для вашого Service](/docs/concepts/services-networking/service/#loadbalancer) для деталей.

   {{< /note >}}

   {{< note >}}

   Якщо зовнішня IP-адреса показується як \<pending\>, зачекайте хвилину та введіть ту саму команду знову.

   {{< /note >}}

1. Виведіть детальну інформацію про Service:

   ```shell
   kubectl describe services my-service
   ```

   Вивід буде подібний до:

   ```console
   Name:           my-service
   Namespace:      default
   Labels:         app.kubernetes.io/name=load-balancer-example
   Annotations:    <none>
   Selector:       app.kubernetes.io/name=load-balancer-example
   Type:           LoadBalancer
   IP:             10.3.245.137
   LoadBalancer Ingress:   104.198.205.71
   Port:           <unset> 8080/TCP
   NodePort:       <unset> 32377/TCP
   Endpoints:      10.0.0.6:8080,10.0.1.6:8080,10.0.1.7:8080 + 2 more...
   Session Affinity:   None
   Events:         <none>
   ```

   Занотуйте зовнішню IP-адресу (`LoadBalancer Ingress`), відкриту вашим сервісом. У цьому прикладі, зовнішня IP-адреса — 104.198.205.71. Також занотуйте значення `Port` і `NodePort`. У цьому прикладі, `Port` — 8080, а `NodePort` — 32377.

1. У попередньому виводі ви можете побачити, що сервіс має кілька точок доступу: 10.0.0.6:8080, 10.0.1.6:8080, 10.0.1.7:8080 + ще 2. Це внутрішні адреси Podʼів, які запускають застосунок Hello World. Щоб переконатися, що це адреси Podʼів, введіть цю команду:

   ```shell
   kubectl get pods --output=wide
   ```

   Вивід буде подібний до:

   ```console
   NAME                         ...  IP         NODE
   hello-world-2895499144-1jaz9 ...  10.0.1.6   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-2e5uh ...  10.0.1.8   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-9m4h1 ...  10.0.0.6   gke-cluster-1-default-pool-e0b8d269-5v7a
   hello-world-2895499144-o4z13 ...  10.0.1.7   gke-cluster-1-default-pool-e0b8d269-1afc
   hello-world-2895499144-segjf ...  10.0.2.5   gke-cluster-1-default-pool-e0b8d269-cpuc
   ```

1. Використовуйте зовнішню IP-адресу (`LoadBalancer Ingress`) для доступу до застосунку Hello World:

   ```shell
   curl http://<external-ip>:<port>
   ```

   де `<external-ip>` — це зовнішня IP-адреса (`LoadBalancer Ingress`) вашого сервісу, а `<port>` — значення `Port` в описі вашого сервісу. Якщо ви використовуєте minikube, ввівши `minikube service my-service` автоматично відкриє застосунок Hello World в оглядачі.

   Відповідь на успішний запит — привітальне повідомлення:

   ```console
   Hello, world!
   Version: 2.0.0
   Hostname: 0bd46b45f32f
   ```

## {{% heading "cleanup" %}}

Щоб видалити Service, введіть цю команду:

```shell
kubectl delete services my-service
```

Щоб видалити Deployment, ReplicaSet і Podʼи, які запускають застосунок Hello World, введіть цю команду:

```shell
kubectl delete deployment hello-world
```

## {{% heading "whatsnext" %}}

Дізнайтеся більше про [Підключення застосунків за допомогою Service](/docs/tutorials/services/connect-applications-service/).
