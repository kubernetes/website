---
title: Зʼєднання фронтенду з бекендом за допомогою Service
content_type: tasks
weight: 70
---

<!-- overview -->

Це завдання показує, як створити мікросервіси _frontend_ та _backend_. Мікросервіс бекенд є сервісом для привітання. Фронтенд експонує backend за допомогою nginx та обʼєкта Kubernetes {{< glossary_tooltip term_id="service" >}}.

## {{% heading "objectives" %}}

* Створити та запустити зразок мікросервісу бекенд  `hello` за допомогою обʼєкта {{< glossary_tooltip term_id="deployment" >}}.
* Використовувати обʼєкт Service для надсилання трафіку до кількох реплік мікросервісу бекенд.
* Створити та запустити мікросервіс фронтенд `nginx`, також використовуючи обʼєкт Deployment.
* Налаштувати мікросервіс фронтенд для надсилання трафіку до мікросервісу бекенд.
* Використовувати обʼєкт Service типу `LoadBalancer` для експонування мікросервісу фронтенд назовні кластера.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Це завдання використовує [Service з зовнішніми балансувальниками навантаження](/docs/tasks/access-application-cluster/create-external-load-balancer/), які вимагають підтримуваного середовища. Якщо ваше середовище не підтримує це, ви можете використовувати Service типу
[NodePort](/docs/concepts/services-networking/service/#type-nodeport).

<!-- lessoncontent -->

## Створення бекенд за допомогою Deployment {#creating-the-backend-using-a-deployment}

Бекенд — це простий мікросервіс для привітань. Ось конфігураційний файл для розгортання:

{{% code_sample file="service/access/backend-deployment.yaml" %}}

Створіть Deployment для бекенду:

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-deployment.yaml
```

Перегляньте інформацію про Deployment:

```shell
kubectl describe deployment backend
```

Вивід буде схожий на цей:

```none
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

Ключовим елементом для надсилання запитів з фронтенду до бекенду є бекенд Service. Service створює постійну IP-адресу та запис DNS, так що мікросервіс бекенд завжди може бути доступним. Service використовує {{< glossary_tooltip text="селектори" term_id="selector" >}}, щоб знайти Podʼи, до яких треба спрямувати трафік.

Спочатку ознайомтеся з конфігураційним файлом Service:

{{% code_sample file="service/access/backend-service.yaml" %}}

У конфігураційному файлі можна побачити, що Service з назвою `hello` маршрутизує трафік до Podʼів з мітками `app: hello` та `tier: backend`.

Створіть Service для бекенду:

```shell
kubectl apply -f https://k8s.io/examples/service/access/backend-service.yaml
```

На цьому етапі у вас є Deployment `backend`, що виконує три репліки вашого `hello` застосунку, та Service, який може маршрутизувати трафік до них. Проте цей Service не є доступним та не може бути доступний за межами кластера.

## Створення frontend {#creating-the-frontend}

Тепер, коли ваш бекенд запущено, ви можете створити frontend, який буде доступним за межами кластера та підключатиметься до backend, проксуючи запити до нього.

Фронтенд надсилає запити до Podʼів backend, використовуючи DNS-імʼя, надане Serviceʼу бекенд. DNS-імʼя — це `hello`, яке є значенням поля `name` у конфігураційному файлі `examples/service/access/backend-service.yaml`.

Podʼи у Deployment фронтенд запускають образ nginx, налаштований для проксіювання запитів до Service бекенда `hello`. Ось конфігураційний файл nginx:

{{% code_sample file="service/access/frontend-nginx.conf" %}}

Подібно до бекенду, фронтенд має Deployment та Service. Важливою відмінністю між Serviceʼами бекендаа та фронтенда є те, що конфігурація для Service фронтенда має `type: LoadBalancer`, що означає, що Service використовує балансувальник навантаження, який надається вашим хмарним провайдером, і буде доступним за межами кластеру.

{{% code_sample file="service/access/frontend-service.yaml" %}}

{{% code_sample file="service/access/frontend-deployment.yaml" %}}

Створіть Deployment та Service фронтенд:

```shell
kubectl apply -f https://k8s.io/examples/service/access/frontend-deployment.yaml
kubectl apply -f https://k8s.io/examples/service/access/frontend-service.yaml
```

Вивід підтверджує, що обидва ресурси створено:

```none
deployment.apps/frontend created
service/frontend created
```

{{< note >}}
Конфігурація nginx вбудована в [образ контейнера](/examples/service/access/Dockerfile). Кращий спосіб зробити її — скористатись [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/), щоб ви могли легше змінювати конфігурацію.
{{< /note >}}

## Взаємодія з Service фронтенду {#interacting-with-the-frontend-service}

Після створення Service типу LoadBalancer, ви можете використати цю команду, щоб знайти зовнішню IP-адресу:

```shell
kubectl get service frontend --watch
```

Вивід показує конфігурацію Service `frontend` та спостерігає за змінами. Спочатку зовнішня IP-адреса вказана як `<pending>`:

```none
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   <pending>     80/TCP   10s
```

Як тільки зовнішня IP-адреса буде надана, конфігурація оновлюється і включає нову IP-адресу під заголовком `EXTERNAL-IP`:

```none
NAME       TYPE           CLUSTER-IP      EXTERNAL-IP        PORT(S)  AGE
frontend   LoadBalancer   10.51.252.116   XXX.XXX.XXX.XXX    80/TCP   1m
```

Цю IP-адресу тепер можна використовувати для взаємодії з Service `frontend` ззовні кластера.

## Надсилання трафіку через фронтенд {#sending-traffic-through-the-frontend}

Тепер фронтенд та бекенд зʼєднані. Ви можете звернутися до точки доступу використовуючи команду curl з зовнішньою IP-адресою вашого Service фронтенду.

```shell
curl http://${EXTERNAL_IP} # замініть це на EXTERNAL-IP, який ви бачили раніше
```

Вивід показує повідомлення, згенероване бекендом:

```json
{"message":"Hello"}
```

## {{% heading "cleanup" %}}

Щоб видалити Serviceʼи, введіть цю команду:

```shell
kubectl delete services frontend backend
```

Щоб видалити Deploymentʼи, ReplicaSet та Podʼи, які запускають бекенд та фронтенд застосунки, введіть цю команду:

```shell
kubectl delete deployment frontend backend
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Service](/docs/concepts/services-networking/service/)
* Дізнайтеся більше про [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/)
* Дізнайтеся більше про [DNS для Service та Podʼів](/docs/concepts/services-networking/dns-pod-service/)
