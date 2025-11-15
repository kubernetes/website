---
title: Конвертація файлу Docker Compose в ресурси Kubernetes
content_type: task
weight: 230
---

<!-- overview -->

Що таке Kompose? Це інструмент конвертації для всього, що стосується композиції (зокрема Docker Compose) в ресурси систем оркестрування (Kubernetes або OpenShift).

Додаткову інформацію можна знайти на вебсайті Kompose за адресою [https://kompose.io](https://kompose.io).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Встановлення Kompose {#install-kompose}

Є кілька способів встановлення Kompose. Наш спосіб - завантаження бінарного файлу з останнього релізу GitHub.

{{< tabs name="install_ways" >}}
{{% tab name="Завантаження з GitHub" %}}

Kompose випускається через GitHub кожні три тижні, ви можете переглянути всі поточні релізи на [сторінці релізів GitHub](https://github.com/kubernetes/kompose/releases).

```sh
# Linux
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-windows-amd64.exe -o kompose.exe

chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

Також ви можете завантажити [архів](https://github.com/kubernetes/kompose/releases).

{{% /tab %}}
{{% tab name="Збірка з сирців" %}}

Встановлення за допомогою `go get` витягує дані з гілки master з останніми змінами розробки.

```sh
go get -u github.com/kubernetes/kompose
```

{{% /tab %}}
{{% tab name="Homebrew (macOS)" %}}

У macOS ви можете встановити останній реліз за допомогою [Homebrew](https://brew.sh):

```bash
brew install kompose
```

{{% /tab %}}
{{< /tabs >}}

## Використання Kompose {#use-kompose}

За кілька кроків ми переведемо вас з Docker Compose до Kubernetes. Вам потрібен лише наявний файл `docker-compose.yml`.

1. Перейдіть до теки, що містить ваш файл `docker-compose.yml`. Якщо у вас його немає, ви можете випробувати використовуючи цей.

   ```yaml

   services:

     redis-leader:
       container_name: redis-leader
       image: redis
       ports:
         - "6379"

     redis-replica:
       container_name: redis-replica
       image: redis
       ports:
         - "6379"
       command: redis-server --replicaof redis-leader 6379 --dir /tmp

     web:
       container_name: web
       image: quay.io/kompose/web
       ports:
         - "8080:8080"
       environment:
         - GET_HOSTS_FROM=dns
       labels:
         kompose.service.type: LoadBalancer
   ```

2. Щоб конвертувати файл `docker-compose.yml` у файли, які можна використовувати з `kubectl`, запустіть `kompose convert`, а потім `kubectl apply -f <output file>`.

   ```bash
   kompose convert
   ```

   Вивід подібний до:

   ```none
   INFO Kubernetes file "redis-leader-service.yaml" created
   INFO Kubernetes file "redis-replica-service.yaml" created
   INFO Kubernetes file "web-tcp-service.yaml" created
   INFO Kubernetes file "redis-leader-deployment.yaml" created
   INFO Kubernetes file "redis-replica-deployment.yaml" created
   INFO Kubernetes file "web-deployment.yaml" created
   ```

   ```bash
    kubectl apply -f web-tcp-service.yaml,redis-leader-service.yaml,redis-replica-service.yaml,web-deployment.yaml,redis-leader-deployment.yaml,redis-replica-deployment.yaml
   ```

   Вивід подібний до:

   ```none
   deployment.apps/redis-leader created
   deployment.apps/redis-replica created
   deployment.apps/web created
   service/redis-leader created
   service/redis-replica created
   service/web-tcp created
   ```

   Ваші розгортання, що працюють в Kubernetes.

3. Доступ до вашого застосунку.

   Якщо ви вже використовуєте `minikube` для вашого процесу розробки:

   ```bash
   minikube service web-tcp
   ```

   В іншому випадку, подивімось, яку IP використовує ваш Service!

   ```sh
   kubectl describe svc web-tcp
   ```

   ```none
   Name:                     web-tcp
   Namespace:                default
   Labels:                   io.kompose.service=web-tcp
   Annotations:              kompose.cmd: kompose convert
                           kompose.service.type: LoadBalancer
                           kompose.version: 1.33.0 (3ce457399)
   Selector:                 io.kompose.service=web
   Type:                     LoadBalancer
   IP Family Policy:         SingleStack
   IP Families:              IPv4
   IP:                       10.102.30.3
   IPs:                      10.102.30.3
   Port:                     8080  8080/TCP
   TargetPort:               8080/TCP
   NodePort:                 8080  31624/TCP
   Endpoints:                10.244.0.5:8080
   Session Affinity:         None
   External Traffic Policy:  Cluster
   Events:                   <none>
   ```

   Якщо ви використовуєте хмарного постачальника, ваша IP буде вказана поруч з `LoadBalancer Ingress`.

   ```sh
   curl http://192.0.2.89
   ```

4. Прибирання.

   Після завершення тестування розгортання прикладного застосунку просто запустіть наступну команду в вашій оболонці, щоб видалити використані ресурси.

   ```sh
   kubectl delete -f web-tcp-service.yaml,redis-leader-service.yaml,redis-replica-service.yaml,web-deployment.yaml,redis-leader-deployment.yaml,redis-replica-deployment.yaml
   ```

<!-- discussion -->

## Посібник користувача {#user-guide}

- CLI
  - [`kompose convert`](#kompose-convert)
- Документація
  - [Альтернативні конвертації](#alternative-conversions)
  - [Мітки](#labels)
  - [Перезавантаження](#restart)
  - [Версії Docker Compose](#docker-compose-versions)

Kompose підтримує двох провайдерів: OpenShift і Kubernetes. Ви можете вибрати відповідного постачальника, використовуючи глобальну опцію `--provider`. Якщо постачальник не вказаний, буде встановлено Kubernetes.

## `kompose convert`

Kompose підтримує конвертацію файлів Docker Compose версій V1, V2 і V3 в обʼєкти Kubernetes та OpenShift.

### Приклад `kompose convert` для Kubernetes {#kubernetes-kompose-convert-example}

```shell
kompose --file docker-voting.yml convert
```

```none
WARN Unsupported key networks - ignoring
WARN Unsupported key build - ignoring
INFO Kubernetes file "worker-svc.yaml" created
INFO Kubernetes file "db-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "result-svc.yaml" created
INFO Kubernetes file "vote-svc.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
INFO Kubernetes file "result-deployment.yaml" created
INFO Kubernetes file "vote-deployment.yaml" created
INFO Kubernetes file "worker-deployment.yaml" created
INFO Kubernetes file "db-deployment.yaml" created
```

```shell
ls
```

```none
db-deployment.yaml  docker-compose.yml         docker-gitlab.yml  redis-deployment.yaml  result-deployment.yaml  vote-deployment.yaml  worker-deployment.yaml
db-svc.yaml         docker-voting.yml          redis-svc.yaml     result-svc.yaml        vote-svc.yaml           worker-svc.yaml
```

Ви також можете надати кілька файлів docker-compose одночасно:

```shell
kompose -f docker-compose.yml -f docker-guestbook.yml convert
```

```none
INFO Kubernetes file "frontend-service.yaml" created
INFO Kubernetes file "mlbparks-service.yaml" created
INFO Kubernetes file "mongodb-service.yaml" created
INFO Kubernetes file "redis-master-service.yaml" created
INFO Kubernetes file "redis-slave-service.yaml" created
INFO Kubernetes file "frontend-deployment.yaml" created
INFO Kubernetes file "mlbparks-deployment.yaml" created
INFO Kubernetes file "mongodb-deployment.yaml" created
INFO Kubernetes file "mongodb-claim0-persistentvolumeclaim.yaml" created
INFO Kubernetes file "redis-master-deployment.yaml" created
INFO Kubernetes file "redis-slave-deployment.yaml" created
```

```shell
ls
```

```none
mlbparks-deployment.yaml  mongodb-service.yaml                       redis-slave-service.jsonmlbparks-service.yaml
frontend-deployment.yaml  mongodb-claim0-persistentvolumeclaim.yaml  redis-master-service.yaml
frontend-service.yaml     mongodb-deployment.yaml                    redis-slave-deployment.yaml
redis-master-deployment.yaml
```

Коли надається кілька файлів docker-compose, конфігурація обʼєднується. Будь-яка конфігурація, яка є спільною, буде перевизначена наступним файлом.

### Приклад `kompose convert` для OpenShift {#openshift-kompose-convert-example}

```sh
kompose --provider openshift --file docker-voting.yml convert
```

```none
WARN [worker] Service cannot be created because of missing port.
INFO OpenShift file "vote-service.yaml" created
INFO OpenShift file "db-service.yaml" created
INFO OpenShift file "redis-service.yaml" created
INFO OpenShift file "result-service.yaml" created
INFO OpenShift file "vote-deploymentconfig.yaml" created
INFO OpenShift file "vote-imagestream.yaml" created
INFO OpenShift file "worker-deploymentconfig.yaml" created
INFO OpenShift file "worker-imagestream.yaml" created
INFO OpenShift file "db-deploymentconfig.yaml" created
INFO OpenShift file "db-imagestream.yaml" created
INFO OpenShift file "redis-deploymentconfig.yaml" created
INFO OpenShift file "redis-imagestream.yaml" created
INFO OpenShift file "result-deploymentconfig.yaml" created
INFO OpenShift file "result-imagestream.yaml" created
```

Також підтримує створення buildconfig для директиви build в сервісі. Стандартно використовується віддалений репозиторій для поточної гілки git як джерело репозиторію, та поточну гілку як гілку джерела для збірки. Ви можете вказати інше джерело репозиторію та гілку джерела, використовуючи опції `--build-repo` та `--build-branch` відповідно.

```sh
kompose --provider openshift --file buildconfig/docker-compose.yml convert
```

```none
WARN [foo] Service cannot be created because of missing port.
INFO OpenShift Buildconfig using git@github.com:rtnpro/kompose.git::master as source.
INFO OpenShift file "foo-deploymentconfig.yaml" created
INFO OpenShift file "foo-imagestream.yaml" created
INFO OpenShift file "foo-buildconfig.yaml" created
```

{{< note >}}
Якщо ви вручну публікуєте артефакти OpenShift за допомогою `oc create -f`, вам потрібно забезпечити, щоб ви публікували артефакт imagestream перед артефактом buildconfig, щоб уникнути цієї проблеми OpenShift: <https://github.com/openshift/origin/issues/4518>.
{{< /note >}}

## Альтернативні конвертації {#alternative-conversions}

Типово `kompose` перетворює файли у форматі yaml на обʼєкти Kubernetes [Deployments](/docs/concepts/workloads/controllers/deployment/) та [Services](/docs/concepts/services-networking/service/). У вас є альтернативна опція для генерації json за допомогою `-j`. Також, ви можете альтернативно згенерувати обʼєкти [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/), [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/), або [Helm](https://github.com/helm/helm) чарти.

```sh
kompose convert -j
INFO Kubernetes file "redis-svc.json" created
INFO Kubernetes file "web-svc.json" created
INFO Kubernetes file "redis-deployment.json" created
INFO Kubernetes file "web-deployment.json" created
```

Файли `*-deployment.json` містять обʼєкти Deployment.

```sh
kompose convert --replication-controller
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-replicationcontroller.yaml" created
INFO Kubernetes file "web-replicationcontroller.yaml" created
```

Файли `*-replicationcontroller.yaml` містять обʼєкти Replication Controller. Якщо ви хочете вказати кількість реплік (стандартно 1), використовуйте прапорець `--replicas`: `kompose convert --replication-controller --replicas 3`.

```shell
kompose convert --daemon-set
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-daemonset.yaml" created
INFO Kubernetes file "web-daemonset.yaml" created
```

Файли `*-daemonset.yaml` містять обʼєкти DaemonSet.

Якщо ви хочете згенерувати чарт для використання з [Helm](https://github.com/kubernetes/helm), виконайте:

```shell
kompose convert -c
```

```none
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-deployment.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
chart created in "./docker-compose/"
```

```shell
tree docker-compose/
```

```none
docker-compose
├── Chart.yaml
├── README.md
└── templates
    ├── redis-deployment.yaml
    ├── redis-svc.yaml
    ├── web-deployment.yaml
    └── web-svc.yaml
```

Структура чарту спрямована на надання каркаса для створення ваших чартів Helm.

## Мітки {#labels}

`kompose` підтримує специфічні для Kompose мітки в файлі `docker-compose.yml`, щоб явно визначити поведінку сервісу при конвертації.

- `kompose.service.type` визначає тип сервісу, який потрібно створити.

  Наприклад:

  ```yaml
  version: "2"
  services:
    nginx:
      image: nginx
      dockerfile: foobar
      build: ./foobar
      cap_add:
        - ALL
      container_name: foobar
      labels:
        kompose.service.type: nodeport
  ```

- `kompose.service.expose` визначає, чи потрібно сервісу бути доступним ззовні кластера чи ні. Якщо значення встановлено на "true", постачальник автоматично встановлює точку доступу, і для будь-якого іншого значення, значення встановлюється як імʼя хосту. Якщо в сервісі визначено кілька портів, вибирається перший.

  - Для постачальника Kubernetes створюється ресурс Ingress, припускається, що контролер Ingress вже налаштований.
  - Для постачальника OpenShift створюється маршрут.

  Наприклад:

  ```yaml
  version: "2"
  services:
    web:
      image: tuna/docker-counter23
      ports:
      - "5000:5000"
      links:
      - redis
      labels:
        kompose.service.expose: "counter.example.com"
    redis:
      image: redis:3.0
      ports:
      - "6379"
  ```

Наразі підтримуються наступні варіанти:

| Ключ                  | Значення                           |
|-----------------------|------------------------------------|
| kompose.service.type  | nodeport / clusterip / loadbalancer |
| kompose.service.expose| true / hostname |

{{< note >}}
Мітка `kompose.service.type` повинна бути визначена лише з `ports`, інакше `kompose` завершиться невдачею.
{{< /note >}}

## Перезапуск {#restart}

Якщо ви хочете створити звичайні Podʼи без контролерів, ви можете використовувати конструкцію `restart` у docker-compose, щоб визначити це. Дивіться таблицю нижче, щоб побачити, що відбувається при значенні `restart`.

| `docker-compose` `restart` | створений обʼєкт  | `restartPolicy` Podʼа   |
|----------------------------|-------------------|-------------------------|
| `""`                       | обʼєкт контролера | `Always`                |
| `always`                   | обʼєкт контролера | `Always`                |
| `on-failure`               | Капсула           | `OnFailure`             |
| `no`                       | Капсула           | `Never`                 |

{{< note >}}
Обʼєкт контролера може бути `deployment` або `replicationcontroller`.
{{< /note >}}

Наприклад, сервіс `pival` стане Podʼом нижче. Цей контейнер обчислює значення `pi`.

```yaml
version: '2'

services:
  pival:
    image: perl
    command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
    restart: "on-failure"
```

### Попередження про конфігурації Deployment {#warning-about-deployment-configurations}

Якщо в Docker Compose файлі вказано том для сервісу, стратегія Deployment (Kubernetes) або DeploymentConfig (OpenShift) змінюється на "Recreate" замість "RollingUpdate" (типово). Це робиться для того, щоб уникнути одночасного доступу кількох екземплярів сервісу до тому.

Якщо в Docker Compose файлі імʼя сервісу містить `_` (наприклад, `web_service`), то воно буде замінено на `-`, і імʼя сервісу буде перейменовано відповідно (наприклад, `web-service`). Kompose робить це, оскільки "Kubernetes" не дозволяє `_` в імені обʼєкта.

Зверніть увагу, що зміна назви сервісу може зіпсувати деякі файли `docker-compose`.

## Версії Docker Compose {#docker-compose-versions}

Kompose підтримує версії Docker Compose: 1, 2 та 3. Ми маємо обмежену підтримку версій 2.1 та 3.2 через їх експериментальний характер.

Повний список сумісності між усіма трьома версіями перераховано у нашому [документі з конвертації](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md), включаючи список всіх несумісних ключів Docker Compose.
