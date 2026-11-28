---
title: Налаштування кількох планувальників
content_type: task
weight: 20
---

<!-- overview -->

Kubernetes постачається зі стандартним планувальником, описаним [тут](/docs/reference/command-line-tools-reference/kube-scheduler/). Якщо стандартний планувальник не відповідає вашим потребам, ви можете реалізувати власний. Більше того, можна одночасно запускати кілька планувальників поряд зі стандартним і вказувати Kubernetes, який планувальник використовувати для кожного з ваших Podʼів. Розгляньмо на прикладі, як запускати кілька планувальників у Kubernetes.

Докладний опис реалізації планувальника виходить за межі цього документа. Канонічний приклад дивіться в реалізації kube-scheduler у [pkg/scheduler](https://github.com/kubernetes/kubernetes/tree/master/pkg/scheduler) у теці вихідного коду Kubernetes.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Упакування планувальника {#package-the-scheduler}

Упакуйте бінарний файл планувальника в образ контейнера. Для цього прикладу можна використати стандартний планувальник (kube-scheduler) як другий планувальник. Клонуйте [вихідний код Kubernetes із GitHub](https://github.com/kubernetes/kubernetes) і зберіть його.

```shell
git clone https://github.com/kubernetes/kubernetes.git
cd kubernetes
make
```

Створіть образ контейнера, що містить бінарний файл kube-scheduler. Ось `Dockerfile` для збирання образу:

```docker
FROM busybox
ADD ./_output/local/bin/linux/amd64/kube-scheduler /usr/local/bin/kube-scheduler
```

Збережіть файл як `Dockerfile`, зберіть образ і надішліть його до реєстру. У цьому прикладі образ надсилається до [Google Container Registry (GCR)](https://cloud.google.com/container-registry/). Докладніше дивіться в [документації](https://cloud.google.com/container-registry/docs/) GCR. Також можна використовувати [docker hub](https://hub.docker.com/search?q=). Докладніше дивіться в [документації](https://docs.docker.com/docker-hub/repos/create/#create-a-repository) docker hub.

```shell
docker build -t gcr.io/my-gcp-project/my-kube-scheduler:1.0 .     # Назва образу та репозиторій,
gcloud docker -- push gcr.io/my-gcp-project/my-kube-scheduler:1.0 # використані тут, є лише прикладом
```

## Визначення Deployment Kubernetes для планувальника {#define-a-kubernetes-deployment-for-the-scheduler}

Тепер, коли ваш планувальник є в образі контейнера, створіть для нього конфігурацію Podʼа й запустіть його у своєму кластері Kubernetes. Але замість створення Podʼа безпосередньо в кластері для цього прикладу можна використати [Deployment](/docs/concepts/workloads/controllers/deployment/). [Deployment](/docs/concepts/workloads/controllers/deployment/) керує [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/), який, своєю чергою, керує Podʼами, завдяки чому планувальник стійкий до збоїв. Ось конфігурація Deployment. Збережіть її як `my-scheduler.yaml`:

{{% code_sample file="admin/sched/my-scheduler.yaml" %}}

У наведеному вище маніфесті використано [KubeSchedulerConfiguration](/docs/reference/scheduling/config/) для налаштування поведінки вашої реалізації планувальника. Цю конфігурацію передано `kube-scheduler` під час ініціалізації за допомогою параметра `--config`. Файл конфігурації зберігається в ConfigMap `my-scheduler-config`. Pod Deployment `my-scheduler` монтує ConfigMap `my-scheduler-config` як том.

У згаданій вище конфігурації планувальника ваша реалізація планувальника подана за допомогою [KubeSchedulerProfile](/docs/reference/config-api/kube-scheduler-config.v1/#kubescheduler-config-k8s-io-v1-KubeSchedulerProfile).

{{< note >}}
Щоб визначити, чи відповідає планувальник за планування конкретного Podʼа, поле `spec.schedulerName` у PodTemplate або маніфесті Podʼа має збігатися з полем `schedulerName` у `KubeSchedulerProfile`. Усі планувальники, що працюють у кластері, мають мати унікальні назви.
{{< /note >}}

Також зверніть увагу, що ви створюєте окремий службовий обліковий запис `my-scheduler` і привʼязуєте до нього ClusterRole `system:kube-scheduler`, щоб він міг отримати ті самі привілеї, що й `kube-scheduler`.

Докладний опис інших аргументів командного рядка дивіться в [документації kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/), а інших налаштовуваних конфігурацій `kube-scheduler` — у [довіднику з конфігурації планувальника](/docs/reference/config-api/kube-scheduler-config.v1/).

## Запуск другого планувальника в кластері {#run-the-second-scheduler-in-the-cluster}

{{< caution >}}
Перед розгортанням кількох планувальників або профілів планування ознайомтеся з розділом [Запуск кількох планувальників](/docs/concepts/scheduling-eviction/running-multiple-schedulers/), щоб зрозуміти різні стратегії розгортання та уникнути конфліктів планування ресурсів.
{{< /caution >}}

Щоб запустити планувальник у кластері Kubernetes, створіть Deployment, вказаний у наведеній вище конфігурації, у кластері Kubernetes:

```shell
kubectl create -f my-scheduler.yaml
```

Переконайтеся, що Pod планувальника працює:

```shell
kubectl get pods --namespace=kube-system
```

```
NAME                                           READY     STATUS    RESTARTS   AGE
....
my-scheduler-lnf4s-4744f                       1/1       Running   0          2m
...
```

У цьому списку ви маєте побачити Pod my-scheduler у стані "Running", а також стандартний Pod kube-scheduler.

### Увімкнення вибору лідера {#enable-leader-election}

Щоб запустити кілька планувальників з увімкненим вибором лідера, потрібно зробити таке:

Оновіть такі поля KubeSchedulerConfiguration у ConfigMap `my-scheduler-config` у вашому файлі YAML:

* `leaderElection.leaderElect` на `true`
* `leaderElection.resourceNamespace` на `<lock-object-namespace>`
* `leaderElection.resourceName` на `<lock-object-name>`

{{< note >}}
Панель управління створює обʼєкти блокування для вас, але простір імен вже повинен існувати. Ви можете використовувати простір імен `kube-system`.
{{< /note >}}

Якщо у вашому кластері увімкнено RBAC, потрібно оновити кластерну роль `system:kube-scheduler`. Додайте назву вашого планувальника до resourceNames правила, застосованого до ресурсів `endpoints` і `leases`, як у наведеному нижче прикладі:

```shell
kubectl edit clusterrole system:kube-scheduler
```

{{% code_sample file="admin/sched/clusterrole.yaml" %}}

## Вказання планувальників для Podʼів {#specify-schedulers-for-pods}

Тепер, коли другий планувальник працює, створіть кілька Podʼів і вкажіть, щоб їх планував або стандартний планувальник, або той, який ви розгорнули. Щоб запланувати певний Pod за допомогою конкретного планувальника, вкажіть назву планувальника у специфікації цього Podʼа. Розгляньмо три приклади.

- Специфікація Podʼа без назви планувальника

  {{% code_sample file="admin/sched/pod1.yaml" %}}

  Коли назву планувальника не вказано, Pod автоматично планується за допомогою default-scheduler.

  Збережіть цей файл як `pod1.yaml` і надішліть його до кластера Kubernetes.

  ```shell
  kubectl create -f pod1.yaml
  ```

- Специфікація Podʼа з `default-scheduler`

  {{% code_sample file="admin/sched/pod2.yaml" %}}

  Планувальник задається вказанням його назви як значення `spec.schedulerName`. У цьому випадку ми вказуємо назву стандартного планувальника, тобто `default-scheduler`.

  Збережіть цей файл як `pod2.yaml` і надішліть його до кластера Kubernetes.

  ```shell
  kubectl create -f pod2.yaml
  ```

- Специфікація Podʼа з `my-scheduler`

  {{% code_sample file="admin/sched/pod3.yaml" %}}

  У цьому випадку ми вказуємо, що цей Pod має планувати розгорнутий нами планувальник — `my-scheduler`. Зверніть увагу, що значення `spec.schedulerName` має збігатися з назвою планувальника в полі `schedulerName` відповідного `KubeSchedulerProfile`.

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

Щоб спростити роботу з цими прикладами, ми не перевіряли, чи справді Podʼи заплановано бажаними планувальниками. Це можна перевірити, змінивши порядок надсилання наведених вище конфігурацій Podʼів і Deployment. Якщо надіслати всі конфігурації Podʼів до кластера Kubernetes раніше за конфігурацію Deployment планувальника, Pod `annotation-second-scheduler` назавжди залишиться в стані "Pending", тоді як інші два Podʼи буде заплановано. Щойно ви надішлете конфігурацію Deployment планувальника і новий планувальник запрацює, Pod `annotation-second-scheduler` також буде заплановано.

Також можна переглянути записи "Scheduled" у логах подій, щоб перевірити, що Podʼи заплановано бажаними планувальниками.

```shell
kubectl get events
```

Ви також можете використати [власну конфігурацію планувальника](/docs/reference/scheduling/config/#multiple-profiles) або власний образ контейнера для основного планувальника кластера, змінивши його маніфест статичного Podʼа на відповідних вузлах панелі управління.
