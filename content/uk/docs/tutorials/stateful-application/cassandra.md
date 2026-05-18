---
title: "Приклад: Розгортання Cassandra з використанням StatefulSet"
content_type: tutorial
weight: 30
---

<!-- overview -->
Цей підручник покаже вам, як запустити [Apache Cassandra](https://cassandra.apache.org/) у Kubernetes. Cassandra, база даних, потребує постійного сховища для забезпечення стійкості даних (_стан_ застосунку). У цьому прикладі використовується власний постачальник насіння Cassandra, що дозволяє базі даних виявляти нові екземпляри Cassandra, коли вони приєднуються до кластера Cassandra.

*StatefulSet* полегшує розгортання стійких застосунків у вашому кластері Kubernetes. Для отримання додаткової інформації про використані у цьому підручнику функції дивіться [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).

{{< note >}}
Cassandra та Kubernetes використовують термін _вузол_ для позначення члена кластера. У цьому підручнику Podʼи, що належать StatefulSet, є вузлами Cassandra та є членами кластера Cassandra (званого _кільцем_ (_ring_)). Коли ці Podʼи працюють у вашому кластері Kubernetes, панель управління Kubernetes розміщує ці Podʼи на {{< glossary_tooltip text="Вузлах" term_id="node" >}} Kubernetes.

Коли вузол Cassandra стартує, він використовує _список насіння_ для відкриття виявлення інших вузлів у кільці. У цьому підручнику розгортається власний постачальник насіння Cassandra, який дозволяє базі даних виявляти нові Podʼи Cassandra в міру їх появи у вашому кластері Kubernetes.
{{< /note >}}

## {{% heading "objectives" %}}

* Створення та перевірка Cassandra headless {{< glossary_tooltip text="Service" term_id="service" >}}.
* Використання {{< glossary_tooltip term_id="StatefulSet" >}} для створення кільця Cassandra.
* Перевірка StatefulSet.
* Зміна StatefulSet.
* Видалення StatefulSet та його {{< glossary_tooltip text="Podʼів" term_id="pod" >}}.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Для роботи з цим посібником ви повинні вже мати базові знання про {{< glossary_tooltip text="Podʼи" term_id="pod" >}}, {{< glossary_tooltip text="Сервіси" term_id="service" >}}, та {{< glossary_tooltip text="StatefulSets" term_id="StatefulSet" >}}.

### Додаткові інструкції щодо налаштування Minikube {#additional-minikube-setup-instructions}

{{< caution >}}
[Minikube](https://minikube.sigs.k8s.io/docs/) стандартно використовує 2048 МБ пам’яті та 2 ЦП. Запуск Minikube зі стандартною конфігурацією ресурсів призводить до помилок недостатності ресурсів під час виконання настанов цього посібника. Щоб уникнути цих помилок, запустіть Minikube з наступними налаштуваннями:

```shell
minikube start --memory 5120 --cpus=4
```

{{< /caution >}}

<!-- lessoncontent -->
## Створення headless Service для Cassandra {#creating-a-cassandra-headless-service}

У Kubernetes {{< glossary_tooltip text="Service" term_id="service" >}} описує набір {{< glossary_tooltip text="Podʼів" term_id="pod" >}}, які виконують одну й ту ж задачу.

Наступний Service використовується для DNS-пошуку між Podʼами Cassandra та клієнтами у вашому кластері:

{{% code_sample file="application/cassandra/cassandra-service.yaml" %}}

Створіть Service для відстеження всіх членів StatefulSet Cassandra з файлу `cassandra-service.yaml`:

```shell
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-service.yaml
```

### Перевірка (необов’язково) {#validating}

Отримайте інформацію про Cassandra Service.

```shell
kubectl get svc cassandra
```

Відповідь буде

```none
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   ClusterIP   None         <none>        9042/TCP   45s
```

Якщо ви не бачите Service з назвою `cassandra`, це означає, що його створення не вдалося. Прочитайте [Налагодження Service](/docs/tasks/debug/debug-application/debug-service/), щоб отримати довідку з усунення загальних проблем.

## Використання StatefulSet для створення кільця Cassandra {#using-a-statefulset-to-create-a-cassandra-ring}

Маніфест StatefulSet, наведений нижче, створює кільце Cassandra, що складається з трьох Podʼів.

{{< note >}}
У цьому прикладі використовується стандартний провізор для Minikube. Будь ласка, оновіть наступний StatefulSet для хмари, з якою ви працюєте.
{{< /note >}}

{{% code_sample file="application/cassandra/cassandra-statefulset.yaml" %}}

Створіть StatefulSet Cassandra з файлу `cassandra-statefulset.yaml`:

```shell
# Використовуйте це, якщо ви можете застосувати cassandra-statefulset.yaml без змін
kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml
```

Якщо вам потрібно змінити `cassandra-statefulset.yaml` для вашого кластера, завантажте https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml та застосуйте цей маніфест, з теки, в яку ви зберегли змінену версію:

```shell
# Використовуйте це, якщо ви змінили cassandra-statefulset.yaml локально
kubectl apply -f cassandra-statefulset.yaml
```

## Перевірка StatefulSet Cassandra {#verifying-the-cassandra-statefulset}

1. Отримайте StatefulSet Cassandra:

    ```shell
    kubectl get statefulset cassandra
    ```

    Відповідь буде схожа на:

    ```none
    NAME        DESIRED   CURRENT   AGE
    cassandra   3         0         13s
    ```

    Ресурс `StatefulSet` розгортає Podʼи послідовно.

1. Отримайте Podʼи, щоб побачити статус створення в зазначеному порядку:

    ```shell
    kubectl get pods -l="app=cassandra"
    ```

    Відповідь буде схожа на:

    ```shell
    NAME          READY     STATUS              RESTARTS   AGE
    cassandra-0   1/1       Running             0          1m
    cassandra-1   0/1       ContainerCreating   0          8s
    ```

    На створення всіх трьох Podʼів може піти декілька хвилин. Після їх розгортання ця ж команда повертає вихідні дані, схожі на:

    ```none
    NAME          READY     STATUS    RESTARTS   AGE
    cassandra-0   1/1       Running   0          10m
    cassandra-1   1/1       Running   0          9m
    cassandra-2   1/1       Running   0          8m
    ```

1. Виконайте інструмент [nodetool](https://cwiki.apache.org/confluence/display/CASSANDRA2/NodeTool) Cassandra всередині першого Podʼа, щоб переглянути стан кільця.

    ```shell
    kubectl exec -it cassandra-0 -- nodetool status
    ```

    Відповідь буде схожою на:

    ```none
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

1. Виконайте наступну команду:

    ```shell
    kubectl edit statefulset cassandra
    ```

    Ця команда відкриває редактор у вашому терміналі. Рядок, який вам потрібно змінити, — це поле `replicas`. Наведений нижче приклад — це уривок з файлу StatefulSet:

    ```yaml
    # Будь ласка, відредагуйте об’єкт нижче. Рядки, що починаються з '#', будуть проігноровані,
    # і пустий файл призведе до відмови редагування. Якщо під час збереження файлу виникне помилка,
    # цей файл буде знову відкритий із відповідними несправностями.
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

2. Змініть кількість реплік на 4 і збережіть маніфест.

    Тепер StatefulSet масштабується для роботи з 4 Podʼами.

3. Отримайте StatefulSet Cassandra, щоб перевірити зміни:

    ```shell
    kubectl get statefulset cassandra
    ```

    Відповідь буде схожа на:

    ```none
    NAME        DESIRED   CURRENT   AGE
    cassandra   4         4         36m
    ```

## {{% heading "cleanup" %}}

Видалення або зменшення масштабу StatefulSet не призводить до видалення томів, повʼязаних із StatefulSet. Це налаштування захищає вас, оскільки ваші дані цінніші, ніж автоматичне очищення всіх повʼязаних ресурсів StatefulSet.

{{< warning >}}
Залежно від класу сховища та політики вилучення, видалення *PersistentVolumeClaims* може призвести до вилучення також повʼязаних томів. Ніколи не припускайте, що ви зможете отримати доступ до даних, якщо їх томи будуть видалені.
{{< /warning >}}

1. Виконайте наступні команди (послідовно обʼєднані в одну команду) для видалення всього в StatefulSet Cassandra:

    ```shell
    grace=$(kubectl get pod cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
      && kubectl delete statefulset -l app=cassandra \
      && echo "Sleeping ${grace} seconds" 1>&2 \
      && sleep $grace \
      && kubectl delete persistentvolumeclaim -l app=cassandra
    ```

1. Виконайте наступну команду для видалення Service, який ви налаштували для Cassandra:

    ```shell
    kubectl delete service -l app=cassandra
    ```

## Змінні середовища контейнера Cassandra {#cassandra-container-environment-variables}

Podʼи в цьому посібнику використовують образ [`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile) з реєстру контейнерів Google. Докер-образ вище базується на [debian-base](https://github.com/kubernetes/release/tree/master/images/build/debian-base) і містить OpenJDK 8.

Цей образ включає стандартну установку Cassandra з репозиторію Apache Debian. За допомогою змінних середовища ви можете змінити значення, які вставляються в `cassandra.yaml`.

| Змінна середовища        | Стандартне значенняанням |
| ------------------------ |:------------------------:|
| `CASSANDRA_CLUSTER_NAME` | `'Test Cluster'`         |
| `CASSANDRA_NUM_TOKENS`   | `32`                     |
| `CASSANDRA_RPC_ADDRESS`  | `0.0.0.0`                |

## {{% heading "whatsnext" %}}

* Дізнайтеся, як [Масштабувати StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
* Дізнайтеся більше про [*KubernetesSeedProvider*](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)
* Подивіться інші [налаштування постачальника насіння](https://git.k8s.io/examples/cassandra/java/README.md)
