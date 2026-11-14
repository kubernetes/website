---
title: "Приклад: Розгортання Cassandra з використанням StatefulSet"
content_type: tutorial
weight: 30
---

<!-- overview -->
Цей посібник покаже вам, як запустити [Apache Cassandra](https://cassandra.apache.org/) у Kubernetes. Cassandra, база даних, потребує постійного сховища для забезпечення збереженості даних (_стану_ застосунку). У цьому прикладі власний seed provider Cassandra дає змогу базі даних виявляти нові екземпляри Cassandra, коли вони приєднуються до кластера Cassandra.

*StatefulSet* полегшує розгортання застосунків зі станом у вашому кластері Kubernetes. Докладніше про можливості, використані в цьому посібнику, див. [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).

{{< alert color="info" title="Примітка" >}}
Cassandra та Kubernetes обидва використовують термін _вузол_ для позначення члена кластера. У цьому посібнику Podʼи, що належать StatefulSet, є вузлами Cassandra та членами кластера Cassandra (який називають _кільцем_ (_ring_)). Коли ці Podʼи працюють у вашому кластері Kubernetes, панель управління Kubernetes планує ці Podʼи на {{< glossary_tooltip text="вузли" term_id="node" >}} Kubernetes.

Коли вузол Cassandra запускається, він використовує _список seed-вузлів_ (seed list) для початкового виявлення інших вузлів у кільці. У цьому посібнику розгортається власний seed provider Cassandra, який дає змогу базі даних виявляти нові Podʼи Cassandra в міру їх появи у вашому кластері Kubernetes.
{{< /alert >}}

## {{% heading "objectives" %}} {#objectives}

* Створення та перевірка headless {{< glossary_tooltip text="Service" term_id="service" >}} для Cassandra.
* Використання {{< glossary_tooltip term_id="StatefulSet" >}} для створення кільця Cassandra.
* Перевірка StatefulSet.
* Зміна StatefulSet.
* Видалення StatefulSet та його {{< glossary_tooltip text="Podʼів" term_id="pod" >}}.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Для роботи з цим посібником ви вже маєте бути базово знайомі з {{< glossary_tooltip text="Podʼами" term_id="pod" >}}, {{< glossary_tooltip text="Service" term_id="service" >}} і {{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}}.

### Додаткові інструкції щодо налаштування Minikube {#additional-minikube-setup-instructions}

{{< alert color="caution" title="Увага" >}}
[Minikube](https://minikube.sigs.k8s.io/docs/) стандартно використовує 2048 МБ памʼяті та 2 CPU. Запуск Minikube зі стандартною конфігурацією ресурсів під час виконання цього посібника призводить до помилок нестачі ресурсів. Щоб уникнути цих помилок, запустіть Minikube з такими налаштуваннями:

```shell
minikube start --memory 5120 --cpus=4
```

{{< /alert >}}

<!-- lessoncontent -->
## Створення headless Service для Cassandra {#creating-a-cassandra-headless-service}

У Kubernetes {{< glossary_tooltip text="Service" term_id="service" >}} описує набір {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, які виконують одне й те саме завдання.

Наведений нижче Service використовується для DNS-пошуку між Podʼами Cassandra та клієнтами у вашому кластері:

{{% code_sample file="application/cassandra/cassandra-service.yaml" %}}

Створіть Service для відстеження всіх членів StatefulSet Cassandra з файлу `cassandra-service.yaml`:

```shell
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-service.yaml
```

### Перевірка (необовʼязково) {#validating}

Отримайте інформацію про Service Cassandra.

```shell
kubectl get svc cassandra
```

Відповідь:

```
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   ClusterIP   None         <none>        9042/TCP   45s
```

Якщо ви не бачите Service з назвою `cassandra`, це означає, що його не вдалося створити. Довідку з усунення поширених проблем див. у розділі [Налагодження Service](/docs/tasks/debug/debug-application/debug-service/).

## Використання StatefulSet для створення кільця Cassandra {#using-a-statefulset-to-create-a-cassandra-ring}

Маніфест StatefulSet, наведений нижче, створює кільце Cassandra, що складається з трьох Podʼів.

{{< alert color="info" title="Примітка" >}}
У цьому прикладі використовується стандартний provisioner для Minikube. Оновіть наведений нижче StatefulSet відповідно до хмари, з якою ви працюєте.
{{< /alert >}}

{{% code_sample file="application/cassandra/cassandra-statefulset.yaml" %}}

Створіть StatefulSet Cassandra з файлу `cassandra-statefulset.yaml`:

```shell
# Використовуйте це, якщо ви можете застосувати cassandra-statefulset.yaml без змін
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml
```

Якщо вам потрібно змінити `cassandra-statefulset.yaml` для вашого кластера, завантажте https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml і застосуйте цей маніфест з теки, у яку ви зберегли змінену версію:

```shell
# Використовуйте це, якщо ви змінили cassandra-statefulset.yaml локально
kubectl apply -f cassandra-statefulset.yaml
```

## Перевірка StatefulSet Cassandra {#validating-the-cassandra-statefulset}

1. Отримайте StatefulSet Cassandra:

    ```shell
    kubectl get statefulset cassandra
    ```

    Відповідь буде схожа на:

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   3         0         13s
    ```

    Ресурс `StatefulSet` розгортає Podʼи послідовно.

1. Отримайте Podʼи, щоб побачити статус їх упорядкованого створення:

    ```shell
    kubectl get pods -l="app=cassandra"
    ```

    Відповідь буде схожа на:

    ```shell
    NAME          READY     STATUS              RESTARTS   AGE
    cassandra-0   1/1       Running             0          1m
    cassandra-1   0/1       ContainerCreating   0          8s
    ```

    Розгортання всіх трьох Podʼів може тривати кілька хвилин. Після розгортання та сама команда повертає вивід, подібний до:

    ```
    NAME          READY     STATUS    RESTARTS   AGE
    cassandra-0   1/1       Running   0          10m
    cassandra-1   1/1       Running   0          9m
    cassandra-2   1/1       Running   0          8m
    ```

3. Виконайте інструмент Cassandra [nodetool](https://cwiki.apache.org/confluence/display/CASSANDRA2/NodeTool) всередині першого Podʼа, щоб переглянути стан кільця.

    ```shell
    kubectl exec -it cassandra-0 -- nodetool status
    ```

    Відповідь буде схожою на:

    ```
    Datacenter: DC1-K8Demo
    ======================
    Status=Up/Down
    |/ State=Normal/Leaving/Joining/Moving
    --  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
    UN  172.17.0.5  83.57 KiB  32           74.0%             e2dd09e6-d9d3-477e-96c5-45094c08db0f  Rack1-K8Demo
    UN  172.17.0.4  101.04 KiB  32           58.8%             f89d6835-3a42-4419-92b3-0e62cae1479c  Rack1-K8Demo
    UN  172.17.0.6  84.74 KiB  32           67.1%             a6a1e8c2-3dc5-4417-b1a0-26507af2aaad  Rack1-K8Demo
    ```

## Зміна StatefulSet Cassandra {#modifying-the-cassandra-statefulset}

Використовуйте `kubectl edit`, щоб змінити розмір StatefulSet Cassandra.

1. Виконайте цю команду:

    ```shell
    kubectl edit statefulset cassandra
    ```

    Ця команда відкриває редактор у вашому терміналі. Рядок, який вам потрібно змінити, — це поле `replicas`. Наведений нижче приклад — це уривок з файлу StatefulSet:

    ```yaml
    # Please edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: apps/v1
    kind: StatefulSet
    metadata:
      creationTimestamp: 2016-08-13T18:40:58Z
      generation: 1
      labels:
      app: cassandra
      name: cassandra
      namespace: default
      resourceVersion: "323"
      uid: 7a219483-6185-11e6-a910-42010a8a0fc0
    spec:
      replicas: 3
    ```

1. Змініть кількість реплік на 4 і збережіть маніфест.

    Тепер StatefulSet масштабується для роботи з 4 Podʼами.

1. Отримайте StatefulSet Cassandra, щоб перевірити зміни:

    ```shell
    kubectl get statefulset cassandra
    ```

    Відповідь буде схожа на:

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   4         4         36m
    ```

## {{% heading "cleanup" %}} {#cleaning-up}

Видалення або зменшення масштабу StatefulSet не призводить до видалення томів, повʼязаних із StatefulSet. Це налаштування захищає вас, оскільки ваші дані цінніші, ніж автоматичне очищення всіх повʼязаних ресурсів StatefulSet.

{{< alert color="danger" title="Увага" >}}
Залежно від класу сховища та політики повторного використання видалення *PersistentVolumeClaims* може призвести до видалення й повʼязаних томів. Ніколи не розраховуйте, що зможете отримати доступ до даних, якщо їхні PersistentVolumeClaim видалено.
{{< /alert >}}

1. Виконайте ці команди (обʼєднані в одну), щоб видалити все в StatefulSet Cassandra:

    ```shell
    grace=$(kubectl get pod cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
      && kubectl delete statefulset -l app=cassandra \
      && echo "Sleeping ${grace} seconds" 1>&2 \
      && sleep $grace \
      && kubectl delete persistentvolumeclaim -l app=cassandra
    ```

1. Виконайте цю команду, щоб видалити Service, який ви налаштували для Cassandra:

    ```shell
    kubectl delete service -l app=cassandra
    ```

## Змінні середовища контейнера Cassandra {#cassandra-container-environment-variables}

Podʼи в цьому посібнику використовують образ [`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/databases/cassandra/image/Dockerfile) з [реєстру контейнерів](https://cloud.google.com/container-registry/docs/) Google. Наведений вище образ Docker базується на [debian-base](https://github.com/kubernetes/release/tree/master/images/build/debian-base) і містить OpenJDK 8.

Цей образ містить стандартне встановлення Cassandra з репозиторію Apache Debian. За допомогою змінних середовища ви можете змінювати значення, які вставляються в `cassandra.yaml`.

| Змінна середовища        | Стандартне значення      |
| ------------------------ |:------------------------:|
| `CASSANDRA_CLUSTER_NAME` | `'Test Cluster'`         |
| `CASSANDRA_NUM_TOKENS`   | `32`                     |
| `CASSANDRA_RPC_ADDRESS`  | `0.0.0.0`                |

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся, як виконувати [Масштабування StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
* Дізнайтеся більше про [_KubernetesSeedProvider_](https://github.com/kubernetes/examples/blob/master/databases/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)
* Подивіться інші [конфігурації seed provider](https://github.com/kubernetes/examples/blob/master/databases/cassandra/java/README.md)
