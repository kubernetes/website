---
title: Привіт Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Цей навчальний посібник показує, як запустити демонстраційний застосунок у Kubernetes за допомогою minikube. Навчальний посібник надає образ контейнера, який за допомогою NGINX повертає у відповідь усі отримані запити.

## {{% heading "objectives" %}} {#objectives}

* Розгорнути демонстраційний застосунок у minikube.
* Запустити застосунок.
* Переглянути логи застосунку.

## {{% heading "prerequisites" %}} {#before-you-begin}


Цей навчальний посібник передбачає, що ви вже налаштували `minikube`. Інструкції щодо встановлення дивіться в __Кроці 1__ на сторінці [minikube start](https://minikube.sigs.k8s.io/docs/start/).
{{< alert color="info" title="Примітка" >}}
Виконайте лише інструкції з __Кроку 1, Встановлення__. Решту розглянуто на цій сторінці.
{{< /alert >}}

Вам також потрібно встановити `kubectl`. Інструкції щодо встановлення дивіться в розділі [Встановлення інструментів](/docs/tasks/tools/#kubectl).


<!-- lessoncontent -->

## Створення кластера minikube {#create-a-minikube-cluster}

```shell
minikube start
```

{{< alert color="info" title="Примітка" >}}
Команда `minikube start` створює кластер з одним вузлом. Цей вузол виконує роль і панелі управління, і робочого вузла. Це відрізняється від багатьох промислових кластерів Kubernetes, де вузли панелі управління зазвичай ізольовані від робочих вузлів за допомогою [taint](/docs/concepts/scheduling-eviction/taint-and-toleration/) або повністю невидимі для користувача.
{{< /alert >}}

## Перевірка стану кластера minikube {#check-the-status-of-the-minikube-cluster}

Перевірте стан кластера minikube, щоб переконатися, що всі компоненти працюють.

```shell
minikube status
```
Вивід наведеної вище команди має показувати всі компоненти у стані Running або Configured, як у прикладі виводу нижче:

```
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

## Відкриття інформаційної панелі {#open-the-dashboard}

Відкрийте інформаційну панель Kubernetes. Це можна зробити двома різними способами:

{{< tabs name="dashboard" >}}
{{% tab name="Запуск вебоглядача" %}}
Відкрийте **новий** термінал і виконайте:
```shell
# Запустіть новий термінал та залиште його працювати.
minikube dashboard
```

Тепер поверніться до термінала, де ви запустили `minikube start`.

{{< alert color="info" title="Примітка" >}}
Команда `dashboard` вмикає надбудову інформаційної панелі та відкриває проксі в типовому вебоглядачі. Ви можете створювати в інформаційній панелі ресурси Kubernetes, такі як Deployment і Service.

Щоб дізнатися, як уникнути безпосереднього запуску вебоглядача з термінала й отримати URL вебінтерфейсу інформаційної панелі, дивіться вкладку «Скопіювати та вставити URL».

Типово інформаційна панель доступна лише з внутрішньої віртуальної мережі Kubernetes. Команда `dashboard` створює тимчасовий проксі, щоб інформаційна панель стала доступною ззовні віртуальної мережі Kubernetes.

Щоб зупинити проксі, натисніть `Ctrl+C` для виходу з процесу. Після завершення команди інформаційна панель продовжує працювати в кластері Kubernetes. Ви можете знову виконати команду `dashboard`, щоб створити інший проксі для доступу до інформаційної панелі.
{{< /alert >}}

{{% /tab %}}
{{% tab name="Скопіювати та вставити URL" %}}

Якщо ви не хочете, щоб minikube відкривав вебоглядач за вас, виконайте підкоманду `dashboard` з прапорцем `--url`. `minikube` виведе URL, який ви можете відкрити у вебоглядачі на свій вибір.

Відкрийте **новий** термінал і виконайте:
```shell
# Запустіть новий термінал та залиште його працювати.
minikube dashboard --url
```

Тепер ви можете скористатися цим URL і повернутися до термінала, де ви запустили `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Створення Deployment {#create-a-deployment}

[*Pod*](/docs/concepts/workloads/pods/) у Kubernetes — це група з одного або декількох контейнерів, що обʼєднані разом з метою адміністрування і роботи в мережі. У цьому навчальному посібнику Pod має лише один контейнер. Kubernetes [*Deployment*](/docs/concepts/workloads/controllers/deployment/) перевіряє стан вашого Podʼа і перезапускає контейнер Podʼа, якщо контейнер перестає працювати. Створювати і масштабувати Podʼи рекомендується за допомогою Deploymentʼів.

1. За допомогою команди `kubectl create` створіть Deployment, який керуватиме Podʼом. Pod запускає контейнер на основі наданого образу Docker.

    ```shell
    # Запустіть тестовий образ контейнера, який містить вебсервер
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
    ```

1. Перегляньте інформацію про Deployment:

    ```shell
    kubectl get deployments
    ```

    У виводі ви побачите подібну інформацію:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    (Може знадобитися деякий час, поки Pod стане доступним. Якщо ви бачите «0/1», спробуйте ще раз за кілька секунд.)

1. Перегляньте інформацію про Pod:

    ```shell
    kubectl get pods
    ```

    У виводі ви побачите подібну інформацію:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

1. Перегляньте події кластера:

    ```shell
    kubectl get events
    ```

1. Перегляньте конфігурацію `kubectl`:

    ```shell
    kubectl config view
    ```

1. Перегляньте логи застосунку для контейнера в Podʼі (замініть імʼя Podʼа на те, яке ви отримали з `kubectl get pods`).

   {{< alert color="info" title="Примітка" >}}
   Замініть `hello-node-5f76cf6ccf-br9b5` у команді `kubectl logs` на імʼя Podʼа з виводу команди `kubectl get pods`.
   {{< /alert >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   У виводі ви побачите подібну інформацію:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```


{{< alert color="info" title="Примітка" >}}
Більше про команди `kubectl` ви можете дізнатися зі статті [Інструмент командного рядка (kubectl)](/docs/reference/kubectl/).
{{< /alert >}}

## Створення Service {#create-a-service}

Типово Pod доступний лише за внутрішньою IP-адресою в межах кластера Kubernetes. Для того, щоб контейнер `hello-node` став доступний за межами віртуальної мережі Kubernetes, Pod необхідно відкрити як [*Service*](/docs/concepts/services-networking/service/) Kubernetes.

{{< alert color="danger" title="Попередження" >}}
Контейнер agnhost має точку доступу `/shell`, яка корисна для налагодження, але її небезпечно відкривати для доступу з публічного інтернету. Не запускайте його в кластері, доступному з інтернету, або в промисловому кластері.
{{< /alert >}}

1. Відкрийте Pod для публічного доступу з інтернету за допомогою команди `kubectl expose`:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    Прапорець `--type=LoadBalancer` вказує, що ви хочете відкрити доступ до Service за межами кластера.

    Код застосунку в тестовому образі прослуховує лише TCP-порт 8080. Якби ви використали `kubectl expose`, щоб відкрити інший порт, клієнти не змогли б підʼєднатися до цього іншого порту.

2. Перегляньте інформацію про створений вами Service:

    ```shell
    kubectl get services
    ```

    У виводі ви побачите подібну інформацію:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    Для хмарних провайдерів, що підтримують балансувальники навантаження, для доступу до Service буде надано зовнішню IP-адресу. У minikube тип `LoadBalancer` робить Service доступним через команду `minikube service`.

3. Виконайте наступну команду:

    ```shell
    minikube service hello-node
    ```

    Це відкриє вікно вебоглядача, яке обслуговує ваш застосунок і показує його відповідь.

## Увімкнення надбудов {#enable-addons}

Інструмент minikube містить набір вбудованих {{< glossary_tooltip text="надбудов" term_id="addons" >}}, які можна увімкнути, вимкнути і відкрити в локальному середовищі Kubernetes.

1. Перегляньте перелік наразі підтримуваних надбудов:

    ```shell
    minikube addons list
    ```

    У виводі ви побачите подібну інформацію:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

1. Увімкніть надбудову, наприклад `metrics-server`:

    ```shell
    minikube addons enable metrics-server
    ```

    У виводі ви побачите подібну інформацію:

    ```
    The 'metrics-server' addon is enabled
    ```

1. Перегляньте Pod і Service, які ви створили, встановивши цю надбудову:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    У виводі ви побачите подібну інформацію:

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

1. Перевірте вивід `metrics-server`:

    ```shell
    kubectl top pods
    ```

    У виводі ви побачите подібну інформацію:

    ```
    NAME                         CPU(cores)   MEMORY(bytes)
    hello-node-ccf4b9788-4jn97   1m           6Mi
    ```

    Якщо ви бачите таке повідомлення, зачекайте і спробуйте ще раз:

    ```
    error: Metrics API not available
    ```

1. Вимкніть `metrics-server`:

    ```shell
    minikube addons disable metrics-server
    ```

    У виводі ви побачите подібну інформацію:

    ```
    metrics-server was successfully disabled
    ```

## Очищення {#clean-up}

Тепер ви можете видалити ресурси, які створили у вашому кластері:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Зупиніть кластер Minikube

```shell
minikube stop
```

За бажанням видаліть ВМ з Minikube:

```shell
# Необовʼязково
minikube delete
```

Якщо ви хочете знову використовувати minikube, щоб дізнатися більше про Kubernetes, видаляти його не потрібно.

## Підсумки {#conclusion}

На цій сторінці розглянуто основні аспекти створення та запуску кластера minikube. Тепер ви готові розгортати застосунки.

## {{% heading "whatsnext" %}} {#what-s-next}


* Навчальний посібник про те, як _[розгорнути свій перший застосунок у Kubernetes за допомогою kubectl](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_.
* Дізнайтеся більше про [обʼєкти Deployment](/docs/concepts/workloads/controllers/deployment/).
* Дізнайтеся більше про [розгортання застосунків](/docs/tasks/run-application/run-stateless-application-deployment/).
* Дізнайтеся більше про [обʼєкти Service](/docs/concepts/services-networking/service/).
