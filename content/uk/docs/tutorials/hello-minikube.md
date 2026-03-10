---
title: Привіт Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

Цей посібник показує, як запустити зразковий застосунок у середовищі Kubernetes за допомогою minikube. Посібник надає образ контейнера, який використовує NGINX для відповіді на всі запити.

## {{% heading "objectives" %}}

* Розгортання тестового застосунку в minikube.
* Запуск застосунку.
* Перегляд логів застосунку.

## {{% heading "prerequisites" %}}

Цей застосунок передбачає, що у вас вже є встановлений `minikube`. Дивіться __Крок 1__ в [minikube start](https://minikube.sigs.k8s.io/docs/start/) для інструкцій щодо встановлення.

{{< note >}}
Виконайте лише інструкції з __Кроку 1, Встановлення__. Решту розглянуто на цій сторінці.
{{< /note >}}

Вам також потрібно встановити `kubectl`. Дивіться [Встановлення інструментів](/docs/tasks/tools/#kubectl) для інструкцій щодо встановлення.

<!-- lessoncontent -->

## Створення кластера minikube {#create-minikube-cluster}

```shell
minikube start
```

## Перевірка стану кластера minikube {#check-the-status-of-the-minikube-cluster}

Перевірте стан кластера minikube, щоб переконатися, що всі компоненти працюють.

```shell
minikube status
```

Результат виконання вищевказаної команди повинен показувати, що всі компоненти працюють або налаштовані, як показано в прикладі нижче:

```none
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

## Відкрийте інформаційну панель {#open-dashboard}

Відкрийте інформаційну панель Kubernetes. Це можна зробити двома різними способами:

{{< tabs name="dashboard" >}}
{{% tab name="Запуск вебоглядача" %}}
Відкрийте __новий__ термінал та виконайте команду:

```shell
# Запустіть новий термінал та залиште його працювати.
minikube dashboard
```

Тепер поверніться до термінала, де ви запустили `minikube start`.

{{< note >}}
Команда `dashboard` вмикає надбудову інформаційної панелі, відкриває проксі та запускає стандартний системний вебоглядач. Ви можете створювати ресурси Kubernetes в інформаційній панелі, такі як Deployment та Service.

Щоб дізнатися, як уникнути безпосереднього запуску вебоглядача з термінала та отримати URL-адресу для вебінтерфейсу, дивіться вкладку «Скопіювати та вставити URL».

Стандартно, інформаційна панель доступна лише з внутрішньої віртуальної мережі Kubernetes. Команда `dashboard` створює тимчасовий проксі, щоб інформаційна панель була доступна за межами віртуальної мережі Kubernetes.

Щоб зупинити проксі, використовуйте комбінацію `Ctrl+C`, щоб вийти з процесу. Після виходу з команди інформаційна панель залишається запущеною в кластері Kubernetes. Ви можете знову запустити команду `dashboard`, щоб створити інший проксі для доступу до інформаційної панелі.
{{< /note >}}

{{% /tab %}}
{{% tab name="Скопіювати та вставити URL" %}}

Якщо ви не хочете, щоб minikube відкривав вебоглядач для вас, запустіть команду `dashboard` з прапорцем `--url`. `minikube` виводить URL-адресу, яку ви можете відкрити у будь-якому вебоглядачі на ваш вибір.

Відкрийте __новий__ термінал та виконайте команду:

```shell
# Запустіть новий термінал та залиште його працювати.
minikube dashboard --url
```

Тепер поверніться до термінала, де ви запустили `minikube start`.

{{% /tab %}}
{{< /tabs >}}

## Створення Deployment {#create-deployment}

[*Pod*](/docs/concepts/workloads/pods/) в Kubernetes — це група з одного або більше контейнерів, які повʼязані один з одним для керування ними та використання мережевих ресурсів. Pod в цьому посібнику містить тільки один контейнер. Kubernetes [*Deployment*](/docs/concepts/workloads/controllers/deployment/) перевіряє життєздатність вашого Podʼа та, якщо він виходить з ладу, перезапускає його. Deployment є рекомендованим способом створення та масштабування Podʼів.

1. Скористайтесь командою `kubectl create` для створення Deployment, що буде керувати Podʼом. Pod запускає контейнер, на основі наданого образу Docker.

   ```shell
   # Запустіть тестовий образ контейнера, який містить вебсервер
   kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
   ```

2. Перевірте, чи створено Deployment.

   ```shell
   kubectl get deployments
   ```

   Ви маєте отримати вивід, подібний до такого:

   ```output
   NAME         READY   UP-TO-DATE   AVAILABLE   AGE
   hello-node   1/1     1            1           1m
   ```

   (Зачекайте деякий час, поки Pod стане доступним. Якщо ви бачите "0/1", спробуйте ще раз через кілька секунд.)

3. Перевірте, чи створено Pod.

   ```shell
   kubectl get pods
   ```

   Ви маєте отримати вивід, подібний до такого:

   ```output
   NAME                          READY   STATUS    RESTARTS   AGE
   hello-node--5f76cf6ccf-br9b5  1/1     Running   0          1m
   ```

4. Перегляд подій кластера:

   ```shell
   kubectl get events
   ```

5. Перегляд конфігурації `kubectl`:

   ```shell
   kubectl config view
   ```

6. Перегляд логів застосунку з контейнера в Podʼі (замініть назву Podʼа на ту, яку ви отримали з `kubectl get pods`).

   {{< note >}}
   Замініть `hello-node-5f76cf6ccf-br9b5` у команді `kubectl logs` на назву Podʼа, яку ви отримали з виводу `kubectl get pods`.
   {{< /note >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   Вивід має бути подібним до такого:

   ```output
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< note >}}
Для ознайомлення з додатковими командами `kubectl` зверніться до [Огляду kubectl](/docs/reference/kubectl/).
{{< /note >}}

## Створення Service {#create-a-service}

Стандартно, Pod доступний лише за його внутрішньою IP-адресою в межах Kubernetes-кластера. Щоб зробити контейнер `hello-node` доступним назовні віртуальної мережі Kubernetes, вам потрібно експонувати Pod як [*Service*](/docs/concepts/services-networking/service/) Kubernetes.

{{< warning >}}
Контейнер agnhost має точку доступу `/shell`, яка корисна для налагодження, але є небезпечною у випадку її експонування для публічного доступу з інтернету. Не запускайте цей контейнер в кластері, що має вихід до інтернету, або на вашому операційному кластері.
{{< /warning >}}

1. Скористайтесь командою `kubectl expose` для експонування Podʼа:

   ```shell
   kubectl expose deployment hello-node --type=LoadBalancer --port=8080
   ```

   Прапорець `--type=LoadBalancer` вказує, що ви хочете надати доступ до вашого Serviceʼу за межами кластера.

   Код застосунку всередині тестового образу контейнера тільки прослуховує порт 8080. Якщо ви використовуєте інший порт в `kubectl expose`, клієнти не зможуть отримати доступ до вашого застосунку.

2. Перевірте, чи створено Service:

   ```shell
   kubectl get services
   ```

   Ви маєте отримати вивід, подібний до такого:

   ```output
   NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
   hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
   kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
   ```

   У хмарних провайдерів, які підтримують балансувальники навантаження, для доступу до Service буде надано зовнішню IP-адресу. В minikube команда `minikube service` створює Service типу `LoadBalancer`.

3. Виконайте наступну команду:

   ```shell
   minikube service hello-node
   ```

   Це відкриє вікно вебоглядача, що показує відповідь застосунку.

## Увімкнення надбудов {#enable-addons}

Інструменти minikube містять набір вбудованих {{< glossary_tooltip text="надбудов" term_id="addons" >}}, які можна увімкнути, вимкнути та відкрити в локальному середовищі Kubernetes.

1. Перегляньте список доступних надбудов:

   ```shell
   minikube addons list
   ```

   Ви маєте отримати вивід, подібний до такого:

   ```output
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

1. Увімкніть надбудову, наприклад, `metrics-server`:

   ```shell
   minikube addons enable metrics-server
   ```

   Ви маєте отримати вивід, подібний до такого:

   ```output
   The 'metrics-server' addon is enabled
   ```

1. Перегляньте Podʼи та Serviceʼи, які щойно було створено:

   ```shell
   kubectl get pod,svc -n kube-system
   ```

   Вивід має бути подібним до такого:

   ```output
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

1. Перевірте вивід з `metrics-server`:

   ```shell
   kubectl top pods
   ```

   Ви маєте отримати вивід, подібний до такого:

   ```output
   NAME                         CPU(cores)   MEMORY(bytes)
   hello-node-ccf4b9788-4jn97   1m           6Mi
   ```

   Якщо ви бачите наступне повідомлення, почекайте та спробуйте ще раз:

   ```output
   error: Metrics API not available
   ```

1. Вимкніть `metrics-server`:

   ```shell
   minikube addons disable metrics-server
   ```

   Вивід має бути схожим на:

   ```output
   metrics-server was successfully disabled
   ```

## Видалення кластера minikube {#clean-up}

Тепер ви можете видалити ресурси, які ви створили в кластері:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

Зупиніть кластер minikube:

```shell
minikube stop
```

Необовʼязково, ви можете видалити кластер minikube:

```shell
# Необовʼязково
minikube delete
```

Якщо ви бажаєте використовувати minikube знову для продовження вивчення Kubernetes, ви можете не видаляти його.

## Підсумки {#conclusion}

Ця сторінка містить базові аспекти використання minikube для розгортання простого кластера Kubernetes та запуску тестового застосунку. Тепер ви готові до розгортання власних застосунків.

## {{% heading "whatsnext" %}}

* Посібник [*Розгортання вашого першого застосунку в Kubernetes за допомогою kubectl*](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/).
* Дізнайтеся більше про [Deployment](/docs/concepts/workloads/controllers/deployment/).
* Дізнайтесь більше про [Розгортання застосунків](/docs/tasks/run-application/run-stateless-application-deployment/).
* Дізнайтесь більше про [Service](/docs/concepts/services-networking/service/).
