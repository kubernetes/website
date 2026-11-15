---
title: Зʼєднання фронтенду з бекендом за допомогою Services
content_type: tutorial
weight: 70
---

<!-- overview -->

Це завдання показує, як створити мікросервіси _фронтенду_ й _бекенду_. Мікросервіс бекенду — це сервіс привітання. Фронтенд відкриває доступ до бекенду за допомогою nginx та обʼєкта {{< glossary_tooltip term_id="service" >}} Kubernetes.

## {{% heading "objectives" %}} {#objectives}

* Створити й запустити приклад мікросервісу бекенду `hello` за допомогою обʼєкта {{< glossary_tooltip term_id="deployment" >}}.
* Використовувати обʼєкт Service для надсилання трафіку до кількох реплік мікросервісу бекенду.
* Створити й запустити мікросервіс фронтенду `nginx`, також за допомогою обʼєкта Deployment.
* Налаштувати мікросервіс фронтенду на надсилання трафіку до мікросервісу бекенду.
* Використати обʼєкт Service `type=LoadBalancer`, щоб відкрити доступ до мікросервісу фронтенду ззовні кластера.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Це завдання використовує [Services із зовнішніми балансувальниками навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/), які потребують підтримуваного середовища. Якщо ваше середовище їх не підтримує, натомість можна використати Service типу [NodePort](/docs/concepts/services-networking/service/#type-nodeport).

<!-- lessoncontent -->

## Створення бекенду за допомогою Deployment {#creating-the-backend-using-a-deployment}

Бекенд — це простий мікросервіс привітання. Ось файл конфігурації Deployment бекенду:

{{% code_sample file="service/access/backend-deployment.yaml" %}}

Створіть Deployment для бекенду:

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-deployment.yaml
```

Перегляньте інформацію про Deployment бекенду:

```shell
kubectl describe deployment backend
```

Вивід подібний до такого:

```
Name:                           backend
Namespace:                      default
CreationTimestamp:              Mon, 24 Oct 2016 14:21:02 -0700
Labels:                         app=hello
                                tier=backend
                                track=stable
Annotations:                    deployment.kubernetes.io/revision=1
Selector:                       app=hello,tier=backend,track=stable
Replicas:                       3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:                   RollingUpdate
MinReadySeconds:                0
RollingUpdateStrategy:          1 max unavailable, 1 max surge
Pod Template:
  Labels:       app=hello
                tier=backend
                track=stable
  Containers:
   hello:
    Image:              "gcr.io/google-samples/hello-go-gke:1.0"
    Port:               80/TCP
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Conditions:
  Type          Status  Reason
  ----          ------  ------
  Available     True    MinimumReplicasAvailable
  Progressing   True    NewReplicaSetAvailable
OldReplicaSets:                 <none>
NewReplicaSet:                  hello-3621623197 (3/3 replicas created)
Events:
...
```

## Створення обʼєкта Service `hello` {#creating-the-hello-service-object}

Ключовим для надсилання запитів із фронтенду до бекенду є Service бекенду. Service створює постійну IP-адресу й запис імені DNS, щоб мікросервіс бекенду завжди був доступний. Service використовує {{< glossary_tooltip text="селектори" term_id="selector" >}}, щоб визначити Podʼи, до яких спрямовувати трафік.

Спочатку перегляньте файл конфігурації Service:

{{% code_sample file="service/access/backend-service.yaml" %}}

У файлі конфігурації видно, що Service з назвою `hello` спрямовує трафік до Podʼів із мітками `app: hello` і `tier: backend`.

Створіть Service для бекенду:

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-service.yaml
```

На цьому етапі у вас є Deployment `backend`, що виконує три репліки застосунку `hello`, і Service, який може спрямовувати до них трафік. Однак цей сервіс недоступний і не розвʼязується ззовні кластера.

## Створення фронтенду {#creating-the-frontend}

Тепер, коли бекенд працює, можна створити фронтенд, доступний ззовні кластера, який підʼєднується до бекенду, проксіюючи до нього запити.

Фронтенд надсилає запити до робочих Podʼів бекенду, використовуючи DNS-імʼя, надане Service бекенду. DNS-імʼя — `hello`, це значення поля `name` у файлі конфігурації `examples/service/access/backend-service.yaml`.

Podʼи в Deployment фронтенду запускають образ nginx, налаштований на проксіювання запитів до Service бекенду `hello`. Ось файл конфігурації nginx:

{{% code_sample file="service/access/frontend-nginx.conf" %}}

Як і бекенд, фронтенд має Deployment і Service. Важлива відмінність між сервісами бекенду й фронтенду в тому, що конфігурація Service фронтенду має `type: LoadBalancer`, тобто Service використовує балансувальник навантаження, наданий вашим хмарним провайдером, і буде доступний ззовні кластера.

{{% code_sample file="service/access/frontend-service.yaml" %}}

{{% code_sample file="service/access/frontend-deployment.yaml" %}}

Створіть Deployment і Service фронтенду:

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend-deployment.yaml
kubectl apply -f https://k8s.io/examples/service/access/frontend-service.yaml
```

Вивід підтверджує, що обидва ресурси створено:

```
deployment.apps/frontend created
service/frontend created
```

{{< note >}}
Конфігурацію nginx вбудовано в [образ контейнера](/examples/service/access/Dockerfile). Кращий спосіб — використати [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/), щоб легше змінювати конфігурацію.
{{< /note >}}

## Взаємодія із Service фронтенду {#interact-with-the-frontend-service}

Після створення Service типу LoadBalancer цією командою можна знайти зовнішню IP-адресу:

```shell
kubectl get service frontend --watch
```

Це показує конфігурацію Service `frontend` і відстежує зміни. Спочатку зовнішня IP-адреса вказана як `<pending>`:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   <pending>     80/TCP   10s
```

Щойно зовнішню IP-адресу буде надано, конфігурація оновиться й міститиме нову IP-адресу в колонці `EXTERNAL-IP`:

```
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

Тепер цю IP-адресу можна використовувати для взаємодії із сервісом `frontend` ззовні кластера.

## Надсилання трафіку через фронтенд {#send-traffic-through-the-frontend}

Фронтенд і бекенд тепер зʼєднані. Ви можете звернутися до точки доступу командою curl за зовнішньою IP-адресою Service фронтенду.

```shell
curl http://${EXTERNAL_IP} # замініть це на EXTERNAL-IP, який ви бачили раніше
```

Вивід показує повідомлення, згенероване бекендом:

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}} {#cleaning-up}

Щоб видалити Services, введіть цю команду:

```shell
kubectl delete services frontend backend
```

Щоб видалити Deployments, ReplicaSets і Podʼи, у яких працюють застосунки бекенду й фронтенду, введіть цю команду:

```shell
kubectl delete deployment frontend backend
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [Services](/docs/concepts/services-networking/service/)
* Дізнайтеся більше про [ConfigMaps](/docs/tasks/configure-pod-container/configure-pod-configmap/)
* Дізнайтеся більше про [DNS для Services і Podʼів](/docs/concepts/services-networking/dns-pod-service/)
