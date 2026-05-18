---
title: Налаштування кількох планувальників
content_type: task
weight: 20
---

<!-- overview -->

Kubernetes постачається зі стандартним [планувальником](/docs/reference/command-line-tools-reference/kube-scheduler/). Якщо стандартний планувальник не підходить для ваших потреб, ви можете реалізувати власний. До того, ви можете одночасно запускати кілька планувальників поряд зі стандартним планувальником і вказувати Kubernetes, який планувальник використовувати для кожного з ваших Podʼів. Тепер навчимося запускати кілька планувальників в Kubernetes на прикладі.

Детальний опис того, як реалізувати планувальник, виходить за рамки цього документа. Будь ласка, зверніться до реалізації kube-scheduler в [pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler) в теці вихідних кодів Kubernetes для канонічного прикладу.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Упакування планувальника {#package-the-scheduler}

Упакуйте ваш планувальник у контейнерний образ. Для цілей цього прикладу ви можете використовувати стандартний планувальник (kube-scheduler) як ваш другий планувальник. Клонуйте [вихідний код Kubernetes з GitHub](https://github.com/kubernetes/kubernetes) і зберіть планувальник з сирців.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

Створіть контейнерний образ, що містить виконавчий файл kube-scheduler. Ось `Dockerfile` для створення образу:

```docker
FROM busybox
ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

Збережіть файл як `Dockerfile`, зберіть образ і завантажте його до реєстру. У цьому прикладі образ завантажується до [Google Container Registry (GCR)](https://cloud.google.com/container-registry/). Для отримання додаткової інформації, будь ласка, прочитайте [документацію GCR](https://cloud.google.com/container-registry/docs/). Як альтернативу ви також можете використовувати [docker hub](https://hub.docker.com/search?q=). Для отримання додаткової інформації зверніться до [документації docker hub](https://docs.docker.com/docker-hub/repos/create/#create-a-repository).

```shell
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .     # Назва образу та репозиторію
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0 # тут є лише прикладом
```

## Визначення розгортання Kubernetes для планувальника {#define-a-kubernetes-deployment-for-the-scheduler}

Тепер, коли ви маєте ваш планувальник у контейнерному образі, створіть конфігурацію Podʼа для нього і запустіть його у вашому кластері Kubernetes. Але замість того, щоб створювати Pod безпосередньо в кластері, ви можете використовувати [Deployment](/docs/concepts/workloads/controllers/deployment/) для цього прикладу. [Deployment](/docs/concepts/workloads/controllers/deployment/) керує [Replica Set](/docs/concepts/workloads/controllers/replicaset/), який, своєю чергою, керує Podʼами, забезпечуючи стійкість планувальника до збоїв. Ось конфігурація розгортання. Збережіть її як `my-scheduler.yaml`:

{{% code_sample file="admin/sched/my-scheduler.yaml" %}}

У наведеному вище маніфесті ви використовуєте [KubeSchedulerConfiguration](/docs/reference/scheduling/config/) для налаштування поведінки вашої реалізації планувальника. Ця конфігурація була передана kube-scheduler під час ініціалізації за допомогою параметра `--config`. Конфігураційний файл зберігається у ConfigMap `my-scheduler-config`. Pod Deployment `my-scheduler` монтує ConfigMap `my-scheduler-config` як том.

У вищезгаданій конфігурації планувальника ваша реалізація планувальника представлена за допомогою [KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile).

{{< note >}}
Щоб визначити, чи відповідає планувальник за планування конкретного Podʼа, поле `spec.schedulerName` в PodTemplate або Pod маніфесті повинно збігатися з полем `schedulerName` профілю `KubeSchedulerProfile`. Усі планувальники, що працюють у кластері, повинні мати унікальні імена.
{{< /note >}}

Також зверніть увагу, що ви створюєте окремий службовий обліковий запис `my-scheduler` і привʼязуєте до нього кластерну роль `system:kube-scheduler`, щоб він міг отримати ті ж привілеї, що й `kube-scheduler`.

Будь ласка, зверніться до [документації kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/) для детального опису інших параметрів командного рядка та [довідкової інформації щодо конфігурації планувальника](/docs/reference/config-api/kube-scheduler-config.v1/) для детального опису інших налаштовуваних конфігурацій `kube-scheduler`.

## Запуск другого планувальника в кластері {#run-the-second-scheduler-in-the-cluster}

Щоб запустити ваш планувальник у кластері Kubernetes, створіть Deployment вказаний у конфігурації вище у кластері Kubernetes:

```shell
kubectl create -f my-scheduler.yaml
```

Переконайтеся, що Pod планувальника працює:

```shell
kubectl get pods --namespace=kube-system
```

```none
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

У цьому списку ви повинні побачити Pod "Running" my-scheduler, на додачу до стандартного планувальника kube-scheduler.

### Увімкнення обрання лідера {#enable-leader-election}

Щоб запустити кілька планувальників з увімкненим обранням лідера, ви повинні зробити наступне:

Оновіть наступні поля для KubeSchedulerConfiguration у ConfigMap `my-scheduler-config` у вашому YAML файлі:

* `leaderElection.leaderElect` до `true`
* `leaderElection.resourceNamespace` до `<lock-object-namespace>`
* `leaderElection.resourceName` до `<lock-object-name>`

{{< note >}}
Панель управління створює обʼєкти блокування для вас, але простір імен вже повинен існувати. Ви можете використовувати простір імен `kube-system`.
{{< /note >}}

Якщо у вашому кластері увімкнено RBAC, ви повинні оновити кластерну роль `system:kube-scheduler`. Додайте імʼя вашого планувальника до імен ресурсів у правилі, яке застосовується до ресурсів `endpoints` та `leases`, як у наступному прикладі:

```shell
kubectl edit clusterrole system:kube-scheduler
```

{{% code_sample file="admin/sched/clusterrole.yaml" %}}

## Вказання планувальників для Podʼів {#specify-schedulers-for-pods}

Тепер, коли ваш другий планувальник працює, створіть кілька Podʼів і вкажіть, щоб вони
планувалися або стандартним планувальником, або тим, який ви розгорнули. Щоб запланувати Pod за допомогою конкретного планувальника, вкажіть імʼя планувальника у специфікації Podʼа. Розгляньмо три приклади.

* Специфікація Podʼа без вказаного імені планувальника

  {{% code_sample file="admin/sched/pod1.yaml" %}}

  Коли імʼя планувальника не вказано, Pod автоматично планується за допомогою стандартного планувальника.

  Збережіть цей файл як `pod1.yaml` і надішліть його до кластера Kubernetes.

  ```shell
  kubectl create -f pod1.yaml
  ```

* Специфікація Podʼа з `default-scheduler`

  {{% code_sample file="admin/sched/pod2.yaml" %}}

  Планувальник вказується шляхом надання його імені як значення для `spec.schedulerName`. У цьому випадку ми надаємо імʼя стандартного планувальника, яке є `default-scheduler`.

  Збережіть цей файл як `pod2.yaml` і надішліть його до кластера Kubernetes.

  ```shell
  kubectl create -f pod2.yaml
  ```

* Специфікація Podʼа з `my-scheduler`

  {{% code_sample file="admin/sched/pod3.yaml" %}}

  У цьому випадку ми вказуємо, що цей Pod має бути запланований за допомогою планувальника, який ми розгорнули — `my-scheduler`. Зверніть увагу, що значення `spec.schedulerName` повинно відповідати імені, яке було надано планувальнику в полі `schedulerName` профілю `KubeSchedulerProfile`.

  Збережіть цей файл як `pod3.yaml` і надішліть його до кластера Kubernetes.

  ```shell
  kubectl create -f pod3.yaml
  ```

  Переконайтеся, що всі три Podʼи працюють.

  ```shell
  kubectl get pods
  ```

<!-- discussion -->

### Перевірка, що Podʼи були заплановані за допомогою бажаних планувальників {#verifying-that-the-pods-were-scheduled-using-the-desired-schedulers}

Для спрощення роботи з цими прикладами ми не перевірили, що Podʼи дійсно були заплановані за допомогою бажаних планувальників. Ми можемо перевірити це, змінивши порядок подання конфігурацій Podʼів і розгортання вище. Якщо ми передамо всі конфігурації Podʼів до кластера Kubernetes перед передачею конфігурації розгортання планувальника, ми побачимо, що Pod `annotation-second-scheduler` залишається в стані "Pending" назавжди, тоді як інші два Podʼи заплановані. Після надсилання конфігурації розгортання планувальника і запуску нашого нового планувальника, Pod `annotation-second-scheduler` також запланується.

Як альтернативу, ви можете переглянути записи "Scheduled" у лозі подій, щоб перевірити, що Podʼи були заплановані бажаними планувальниками.

```shell
kubectl get events
```

Ви також можете використовувати [власну конфігурацію планувальника](/docs/reference/scheduling/config/#multiple-profiles) або власний контейнерний образ для основного планувальника кластера, змінивши його статичний маніфест Podʼа на відповідних вузлах панелі управління.
