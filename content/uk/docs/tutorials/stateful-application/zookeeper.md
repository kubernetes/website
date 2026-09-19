---
title:  Запуск ZooKeeper, розподіленого системного координатора
content_type: tutorial
weight: 40
---

<!-- overview -->

Цей посібник демонструє як запускати [Apache Zookeeper](https://zookeeper.apache.org) в Kubernetes, використовуючи [StatefulSets](/docs/concepts/workloads/controllers/statefulset/), [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget), та [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).

## {{% heading "prerequisites" %}}

Перед тим як розпочати, переконайтеся, що ви маєте уявлення про:

- [Podʼи](/docs/concepts/workloads/pods/)
- [DNS кластера](/docs/concepts/services-networking/dns-pod-service/)
- [Headless Services](/docs/concepts/services-networking/service/#headless-services)
- [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
- [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)
- [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget)
- [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
- [kubectl CLI](/docs/reference/kubectl/kubectl/)

Вам необхідно мати кластер із щонайменше чотирма вузлами, і кожен вузол повинен мати щонайменше 2 ЦП та 4 ГБ памʼяті. У цьому посібнику ви будете закривати (cordon) та очищувати для обслуговування (drain) вузли кластера. **Це означає, що кластер припинить роботу та виселить всі Podʼи зі своїх вузлів, і вузли тимчасово стануть не придатними до розміщення Podʼів.** Вам слід використовувати окремий кластер для цього посібника, або ви повинні забезпечити, що порушення, яке ви викличете, не нашкодить іншим мешканцям кластера.

У цьому посібнику передбачається, що ви налаштували свій кластер для динамічного надання постійних томів (PersistentVolumes). Якщо ваш кластер не налаштований на це, вам доведеться вручну створити три томи обсягом 20 ГБ перед початком виконання кроків цього посібника.

## {{% heading "objectives" %}}

Після проходження цього посібника ви будете знати, як:

- Розгортати ансамбль Apache Zookeeper використовуючи StatefulSet.
- Як надійно налаштовувати ансамбль.
- Як поширювати розгортання серверів Zookeeper в ансамблі.
- Як використовувати PodDisruptionBudgets для забезпечення високої доступності послуг під час запланованого обслуговування.

<!-- lessoncontent -->

## ZooKeeper

[Apache ZooKeeper](https://zookeeper.apache.org/doc/current/) — це розподілена, відкрита координаційна служба для розподілених застосунків. ZooKeeper дозволяє читати, записувати та спостерігати за оновленнями даних. Дані організовані у вигляді ієрархії файлової системи та реплікуються на всі сервери ZooKeeper в ансамблі (набір серверів ZooKeeper). Всі операції з даними є атомарними та послідовно консистентними. ZooKeeper забезпечує це, використовуючи протокол консенсусу [Zab](https://pdfs.semanticscholar.org/b02c/6b00bd5dbdbd951fddb00b906c82fa80f0b3.pdf) для реплікації машини стану на всіх серверах в ансамблі.

Ансамбль використовує протокол Zab для вибору лідера, ансамбль не може записувати дані, поки цей вибір лідера не завершиться. Після його завершення ансамбль використовує Zab, щоб забезпечити реплікацію всіх записів до кворуму, перш ніж він підтверджує їх та робить їх видимими для клієнтів. Без зваженого кворуму, кворум — буде більшістю складових ансамблю, які містять поточного лідера. Наприклад, якщо в ансамблі є три сервери, компонент, який містить лідера і ще один сервер, становитимуть кворум. Якщо ансамбль не може досягти кворуму, він не може записувати дані.

Сервери ZooKeeper зберігають свою повну машину стану в памʼяті та записують кожну зміну до довгострокового WAL (Write Ahead Log) на носії інформації. Коли сервер аварійно завершує роботу, він може відновити свій попередній стан, відтворюючи WAL. Щоб запобігти безмежному зростанню WAL, сервери ZooKeeper періодично роблять знімки їхнього стану в памʼяті на носій інформації. Ці знімки можуть бути завантажені безпосередньо в памʼять, а всі записи WAL, які передували знімку, можуть бути видалені.

## Створення ансамблю ZooKeeper {#creating-a-zookeeper-ensemble}

Маніфест нижче містить:

- [Headless Service](/docs/concepts/services-networking/service/#headless-services),
- [Service](/docs/concepts/services-networking/service/),
- [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets),
- [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).

{{% code_sample file="application/zookeeper/zookeeper.yaml" %}}

Відкрийте термінал і скористайтеся командою [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply), щоб створити маніфест.

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

Це створить `zk-hs` Headless Service, `zk-cs` Service, `zk-pdb` PodDisruptionBudget та `zk` StatefulSet.

```none
service/zk-hs створено
service/zk-cs створено
poddisruptionbudget.policy/zk-pdb створено
statefulset.apps/zk створено
```

Скористайтеся [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get), щоб спостерігати за створенням StatefulSet контролером Podʼів StatefulSet.

```shell
kubectl get pods -w -l app=zk
```

Коли Pod `zk-2` в стані Running та Ready, скористайтеся `CTRL-C`, щоб припинити виконання kubectl.

```none
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

Контролер StatefulSet створює три Podʼи, і кожен Pod містить контейнер з [сервером ZooKeeper](https://archive.apache.org/dist/zookeeper/stable/).

### Забезпечення виборів лідера {#facilitating-leader-election}

Оскільки в анонімній мережі немає алгоритму завершення для вибору лідера, Zab вимагає явної конфігурації членства для виконання виборів лідера. Кожен сервер в ансамблі повинен мати унікальний ідентифікатор, всі сервери повинні знати глобальний набір ідентифікаторів, і кожен ідентифікатор повинен бути повʼязаний з мережевою адресою.

Використовуйте [`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec), щоб отримати імена хостів Podʼів у StatefulSet `zk`.

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname; done
```

Контролер StatefulSet надає кожному Podʼу унікальне імʼя хосту на основі його порядкового індексу. Імена хостів мають форму `<імʼя statefulset>-<порядковий індекс>`. Оскільки поле `replicas` StatefulSet `zk` встановлено на `3`, контролер набору створює три Podʼа з іменами хостів `zk-0`, `zk-1` і `zk-2`.

```none
zk-0
zk-1
zk-2
```

Сервери в ансамблі ZooKeeper використовують натуральні числа як унікальні ідентифікатори, і зберігають ідентифікатор кожного сервера у файлі, який називається `myid`, в теці даних сервера.

Щоб переглянути вміст файлу `myid` для кожного сервера, скористайтеся такою командою.

```shell
for i in 0 1 2; do echo "myid zk-$i";kubectl exec zk-$i -- cat /var/lib/zookeeper/data/myid; done
```

Оскільки ідентифікатори є натуральними числами, а порядкові індекси є не відʼємними цілими числами, можна згенерувати ідентифікатор, додавши 1 до порядкового номера.

```none
myid zk-0
1
myid zk-1
2
myid zk-2
3
```

Щоб отримати повне доменне імʼя (FQDN) кожного Podʼа у StatefulSet `zk`, використовуйте таку команду.

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname -f; done
```

Service `zk-hs` створює домен для всіх Podʼів, `zk-hs.default.svc.cluster.local`.

```none
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

Записи A в [DNS Kubernetes](/docs/concepts/services-networking/dns-pod-service/) перетворюють FQDN в IP-адреси Podʼів. Якщо Kubernetes переплановує Podʼи, він оновлює записи A із новими IP-адресами Podʼів, але імена записів A не змінюються.

ZooKeeper зберігає свою конфігурацію застосунку в файлі з іменем `zoo.cfg`. Використовуйте `kubectl exec`, щоб переглянути вміст файлу `zoo.cfg` у Поді `zk-0`.

```shell
kubectl exec zk-0 -- cat /opt/zookeeper/conf/zoo.cfg
```

У властивостях `server.1`, `server.2` та `server.3` внизу файлу, `1`, `2` та `3` відповідають ідентифікаторам у файлах `myid` серверів ZooKeeper. Вони встановлені на FQDN для Podʼів у StatefulSet `zk`.

```none
clientPort=2181
dataDir=/var/lib/zookeeper/data
dataLogDir=/var/lib/zookeeper/log
tickTime=2000
initLimit=10
syncLimit=2000
maxClientCnxns=60
minSessionTimeout= 4000
maxSessionTimeout= 40000
autopurge.snapRetainCount=3
autopurge.purgeInterval=0
server.1=zk-0.zk-hs.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-hs.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-hs.default.svc.cluster.local:2888:3888
```

### Досягнення консенсусу {#achieving-consensus}

Протоколи консенсусу вимагають, щоб ідентифікатори кожного учасника були унікальними. Два учасники у протоколі Zab не повинні претендувати на той самий унікальний ідентифікатор. Це необхідно для того, щоб процеси в системі могли погодитися щодо того, які процеси затвердили які дані. Якщо запускаються два Podʼа з тим самим порядковим номером, два сервери ZooKeeper ідентифікуватимуть себе як один і той самий сервер.

```shell
kubectl get pods -w -l app=zk
```

```none
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

Записи A для кожного Pod вводяться, коли Pod стає готовим. Тому, FQDN серверів ZooKeeper посилається на єдину точку доступу, і ця точка доступу буде унікальним сервером ZooKeeper, який претендує на ідентифікацію, налаштовану в його файлі `myid`.

```none
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

Це забезпечує, що властивості `servers` у файлах `zoo.cfg` ZooKeepers становлять собою правильно налаштований ансамбль.

```none
server.1=zk-0.zk-hs.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-hs.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-hs.default.svc.cluster.local:2888:3888
```

Коли сервери використовують протокол Zab, щоб спробувати затвердити значення, вони або досягатимуть консенсусу і затверджуватимуть значення (якщо вибори лідера пройшли успішно і принаймні два Podʼа працюють та готові), або вони не зможуть цього зробити (якщо будь-яка з умов не виконується). Ні один стан не призведе до того, що один сервер підтверджує запис від імені іншого.

### Перевірка адекватності ансамблю {#sanity-testing-the-ensemble}

Найбільш базове тестування на адекватність — це запис даних на один сервер ZooKeeper і читання даних з іншого.

Наведена нижче команда виконує скрипт `zkCli.sh`, щоб записати `world` в шлях `/hello` у Pod `zk-0` в ансамблі.

```shell
kubectl exec zk-0 -- zkCli.sh create /hello world
```

```none
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
Created /hello
```

Щоб отримати дані з Podʼа `zk-1`, використовуйте таку команду.

```shell
kubectl exec zk-1 -- zkCli.sh get /hello
```

Дані, які ви створили на `zk-0`, доступні на всіх серверах в ансамблі.

```none
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x100000002
ctime = Thu Dec 08 15:13:30 UTC 2016
mZxid = 0x100000002
mtime = Thu Dec 08 15:13:30 UTC 2016
pZxid = 0x100000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

### Забезпечення стійкості зберігання {#providing-durable-storage}

Як зазначено в розділі [Основи ZooKeeper](#zookeeper), ZooKeeper фіксує всі записи в стійкому журналі (WAL) та періодично записує знімки стану памʼяті на носії. Використання WAL для забезпечення стійкості є поширеною технікою для застосунків, які використовують протоколи консенсусу для досягнення реплікованої машини станів.

Використовуйте команду [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete), щоб видалити обʼєкт `StatefulSet` `zk`.

```shell
kubectl delete statefulset zk
```

```none
statefulset.apps "zk" deleted
```

Спостерігайте за завершенням роботи Podʼів у `StatefulSet`.

```shell
kubectl get pods -w -l app=zk
```

Коли `zk-0` повністю завершить роботу, використовуйте `CTRL-C`, щоб завершити виконання kubectl.

```none
zk-2      1/1       Terminating   0         9m
zk-0      1/1       Terminating   0         11m
zk-1      1/1       Terminating   0         10m
zk-2      0/1       Terminating   0         9m
zk-2      0/1       Terminating   0         9m
zk-2      0/1       Terminating   0         9m
zk-1      0/1       Terminating   0         10m
zk-1      0/1       Terminating   0         10m
zk-1      0/1       Terminating   0         10m
zk-0      0/1       Terminating   0         11m
zk-0      0/1       Terminating   0         11m
zk-0      0/1       Terminating   0         11m
```

Повторно застосуйте маніфест у файлі `zookeeper.yaml`.

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

Це створює обʼєкт `StatefulSet` `zk`, але інші обʼєкти API у маніфесті не модифікуються, оскільки вони вже існують.

Спостерігайте, як контролер `StatefulSet` перестворює Podʼи `StatefulSet`.

```shell
kubectl get pods -w -l app=zk
```

Коли Pod `zk-2` відзначається як Running і Ready, використовуйте `CTRL-C`, щоб завершити виконання kubectl.

```none
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Pending   0          0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         19s
zk-0      1/1       Running   0         40s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       ContainerCreating   0         0s
zk-1      0/1       Running   0         18s
zk-1      1/1       Running   0         40s
zk-2      0/1       Pending   0         0s
zk-2      0/1       Pending   0         0s
zk-2      0/1       ContainerCreating   0         0s
zk-2      0/1       Running   0         19s
zk-2      1/1       Running   0         40s
```

Використайте наведену нижче команду, щоб отримати значення, яке ви ввели під час [тестування на адекватність](#sanity-testing-the-ensemble), з Podʼа `zk-2`.

```shell
kubectl exec zk-2 zkCli.sh get /hello
```

Навіть якщо ви зупинили та знову створили всі Podʼи в `StatefulSet` `zk`, ансамбль все ще обслуговує початкове значення.

```none
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x100000002
ctime = Thu Dec 08 15:13:30 UTC 2016
mZxid = 0x100000002
mtime = Thu Dec 08 15:13:30 UTC 2016
pZxid = 0x100000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

Секція `volumeClaimTemplates` поля `spec` обʼєкта `zk` `StatefulSet` вказує на PersistentVolume, який створюється для кожного Podʼа.

```yaml
volumeClaimTemplates:
  - metadata:
      name: datadir
      annotations:
        volume.alpha.kubernetes.io/storage-class: anything
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 20Gi
```

Контролер `StatefulSet` генерує `PersistentVolumeClaim` для кожного Podʼа у `StatefulSet`.

Використайте наступну команду, щоб отримати `PersistentVolumeClaims` `StatefulSet`.

```shell
kubectl get pvc -l app=zk
```

Коли `StatefulSet` повторно створює Podʼи, він повторно монтує PersistentVolumes Podʼів.

```none
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
datadir-zk-0   Bound     pvc-bed742cd-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-1   Bound     pvc-bedd27d2-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-2   Bound     pvc-bee0817e-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
```

Розділ `volumeMounts` контейнера `template` `StatefulSet` монтує PersistentVolumes в теки даних серверів ZooKeeper.

```yaml
volumeMounts:
- name: datadir
  mountPath: /var/lib/zookeeper
```

Коли Pod у `zk` `StatefulSet` (пере)планується, у нього завжди монтується той самий `PersistentVolume` у теку даних сервера ZooKeeper. Навіть коли Podʼи переплануються, всі записи, зроблені у логах WAL серверів ZooKeeper, та всі їх знімки залишаються стійкими.

## Забезпечення однорідної конфігурації {#ensuring-consistent-configuration}

Як вказано в розділах [Забезпечення виборів лідера](#facilitating-leader-election) та [Досягнення консенсусу](#achieving-consensus), сервери в ансамблі ZooKeeper потребують однорідної конфігурації для вибору лідера та формування кворуму. Також потрібна однорідна конфігурація протоколу Zab для коректної роботи протоколу мережею. У нашому прикладі ми досягаємо однорідної конфігурації, вбудувавши конфігурацію безпосередньо у маніфест.

Отримайте `zk` StatefulSet.

```shell
kubectl get sts zk -o yaml
```

```yaml
…
command:
      - sh
      - -c
      - "start-zookeeper \
        --servers=3 \
        --data_dir=/var/lib/zookeeper/data \
        --data_log_dir=/var/lib/zookeeper/data/log \
        --conf_dir=/opt/zookeeper/conf \
        --client_port=2181 \
        --election_port=3888 \
        --server_port=2888 \
        --tick_time=2000 \
        --init_limit=10 \
        --sync_limit=5 \
        --heap=512M \
        --max_client_cnxns=60 \
        --snap_retain_count=3 \
        --purge_interval=12 \
        --max_session_timeout=40000 \
        --min_session_timeout=4000 \
        --log_level=INFO"
…
```

Команда, яка використовується для запуску серверів ZooKeeper, передає конфігурацію як параметр командного рядка. Ви також можете використовувати змінні середовища для передачі конфігурації в ансамбль.

### Налаштування системи логування {#configuring-logging}

Один з файлів, що генерується сценарієм `zkGenConfig.sh`, керує логуванням ZooKeeper. ZooKeeper використовує [Log4j](https://logging.apache.org/log4j/2.x/), і типово він використовує інструмент постійного додавання, який покладається на час та розмір для конфігурації логування.

Використайте команду нижче, щоб отримати конфігурацію логування з одного з контейнерів у StatefulSet `zk`.

```shell
kubectl exec zk-0 cat /usr/etc/zookeeper/log4j.properties
```

Конфігурація логування нижче призведе до того, що процес ZooKeeper буде записувати всі свої логи у вихідний файловий потік стандартного виводу.

```none
zookeeper.root.logger=CONSOLE
zookeeper.console.threshold=INFO
log4j.rootLogger=${zookeeper.root.logger}
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.Threshold=${zookeeper.console.threshold}
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} [myid:%X{myid}] - %-5p [%t:%C{1}@%L] - %m%n
```

Це найпростіший спосіб безпечного логування всередині контейнера. Тому що програми записують логи у стандартний вивід, Kubernetes буде відповідальним за ротацію логів для вас. Kubernetes також реалізує розумну політику зберігання, яка гарантує, що логи застосунків, записані у потоки стандартного виводу та помилок, не виснажують локальні носії інформації.

Використайте [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands/#logs), щоб отримати останні 20 рядків логів з одного з контейнерів.

```shell
kubectl logs zk-0 --tail 20
```

Ви можете переглядати логи застосунків, записані у стандартний вивід або стандартну помилку, використовуючи `kubectl logs` та з Kubernetes Dashboard.

```log
2016-12-06 19:34:16,236 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52740
2016-12-06 19:34:16,237 [myid:1] - INFO  [Thread-1136:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52740 (no session established for client)
2016-12-06 19:34:26,155 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52749
2016-12-06 19:34:26,155 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52749
2016-12-06 19:34:26,156 [myid:1] - INFO  [Thread-1137:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52749 (no session established for client)
2016-12-06 19:34:26,222 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52750
2016-12-06 19:34:26,222 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52750
2016-12-06 19:34:26,226 [myid:1] - INFO  [Thread-1138:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52750 (no session established for client)
2016-12-06 19:34:36,151 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52760
2016-12-06 19:34:36,152 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52760
2016-12-06 19:34:36,152 [myid:1] - INFO  [Thread-1139:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52760 (no session established for client)
2016-12-06 19:34:36,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52761
2016-12-06 19:34:36,231 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52761
2016-12-06 19:34:36,231 [myid:1] - INFO  [Thread-1140:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52761 (no session established for client)
2016-12-06 19:34:46,149 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52767
2016-12-06 19:34:46,149 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52767
2016-12-06 19:34:46,149 [myid:1] - INFO  [Thread-1141:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52767 (no session established for client)
2016-12-06 19:34:46,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxnFactory@192] - Accepted socket connection from /127.0.0.1:52768
2016-12-06 19:34:46,230 [myid:1] - INFO  [NIOServerCxn.Factory:0.0.0.0/0.0.0.0:2181:NIOServerCnxn@827] - Processing ruok command from /127.0.0.1:52768
2016-12-06 19:34:46,230 [myid:1] - INFO  [Thread-1142:NIOServerCnxn@1008] - Closed socket connection for client /127.0.0.1:52768 (no session established for client)
```

Kubernetes інтегрується з багатьма рішеннями для логування. Ви можете вибрати рішення для логування, яке найкраще підходить для вашого кластера та застосунків. Для логування та агрегації на рівні кластера розгляньте розгортання [sidecar контейнера](/docs/concepts/cluster-administration/logging#sidecar-container-with-logging-agent), для ротації та надсилання ваших логів.

### Налаштування не привілейованого користувача {#configuring-a-non-privileged-user}

Найкращі практики дозволити застосунку працювати як привілейований користувач всередині контейнера — це предмет для обговорення. Якщо ваша організація вимагає, щоб застосунки працювали як непривілейований користувач, ви можете використовувати [SecurityContext](/docs/tasks/configure-pod-container/security-context/) для контролю над користувачем, під яким запускається точка входу.

У `template` Podʼів `StatefulSet` `zk` є `SecurityContext`.

```yaml
securityContext:
  runAsUser: 1000
  fsGroup: 1000
```

У контейнерах Podʼів, UID 1000 відповідає користувачеві zookeeper, а GID 1000 відповідає групі zookeeper.

Отримайте інформацію про процес ZooKeeper з Поду `zk-0`.

```shell
kubectl exec zk-0 -- ps -elf
```

Оскільки поле `runAsUser` обʼєкта `securityContext` встановлене на 1000, замість того, щоб запускатися як root, процес ZooKeeper запускається як користувач zookeeper.

```none
F S UID        PID  PPID  C PRI  NI ADDR SZ WCHAN  STIME TTY          TIME CMD
4 S zookeep+     1     0  0  80   0 -  1127 -      20:46 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
0 S zookeep+    27     1  0  80   0 - 1155556 -    20:46 ?        00:00:19 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

Типово, коли PersistentVolumes Поду монтується в теку даних сервера ZooKeeper, він доступний тільки для користувача root. Ця конфігурація заважає процесу ZooKeeper записувати свій лог та зберігати свої знімки.

Використовуйте команду нижче, щоб отримати права доступу до файлу теки даних ZooKeeper на Поді `zk-0`.

```shell
kubectl exec -ti zk-0 -- ls -ld /var/lib/zookeeper/data
```

Оскільки поле `fsGroup` обʼєкта `securityContext` встановлене на 1000, власність PersistentVolumes Podʼів встановлюється на групу zookeeper, і процес ZooKeeper може читати та записувати свої дані.

```none
drwxr-sr-x 3 zookeeper zookeeper 4096 Dec  5 20:45 /var/lib/zookeeper/data
```

## Управління процесом ZooKeeper {#managing-the-zookeeper-process}

В [документації ZooKeeper](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_supervision) зазначено, що "Вам захочеться мати наглядовий процес, який керує кожним з ваших процесів сервера ZooKeeper (JVM)." Використання watchdog (наглядового процесу) для перезапуску процесів, що зазнали збою, у розподіленій системі є загальним шаблоном. При розгортанні застосунку в Kubernetes, замість використання зовнішньої утиліти як наглядового процесу, ви повинні використовувати Kubernetes як watchdog для вашого застосунку.

### Оновлення ансамблю {#updating-the-ensemble}

`StatefulSet` `zk` налаштований на використання стратегії оновлення `RollingUpdate`.

Ви можете використовувати `kubectl patch`, щоб оновити кількість `cpus`, виділених серверам.

```shell
kubectl patch sts zk --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/cpu", "value":"0.3"}]'
```

```none
statefulset.apps/zk відредаговано
```

Використовуйте `kubectl rollout status`, щоб спостерігати за статусом оновлення.

```shell
kubectl rollout status sts/zk
```

```none
waiting for statefulset rolling update to complete 0 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
waiting for statefulset rolling update to complete 1 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
waiting for statefulset rolling update to complete 2 pods at revision zk-5db4499664...
Waiting for 1 pods to be ready...
Waiting for 1 pods to be ready...
statefulset rolling update complete 3 pods at revision zk-5db4499664...
```

Це припиняє роботу Podʼів, по одному, у зворотному порядку, і перестворює їх з новою конфігурацією. Це забезпечує підтримку кворуму під час постійного оновлення.

Використовуйте команду `kubectl rollout history`, щоб переглянути історію або попередні конфігурації.

```shell
kubectl rollout history sts/zk
```

Вивід схожий на такий:

```none
statefulsets "zk"
REVISION
1
2
```

Використовуйте команду `kubectl rollout undo`, щоб скасувати модифікацію.

```shell
kubectl rollout undo sts/zk
```

Вивід схожий на такий:

```none
statefulset.apps/zk повернувся до попереднього стану
```

### Обробка відмови процесу {#handling-process-failure}

[Політики перезапуску](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) контролюють, як Kubernetes обробляє відмови процесів для вхідної точки контейнера в Pod. Для Podʼів у `StatefulSet` єдине припустиме значення `RestartPolicy` — це Always, і це є стандартним значенням. Для StatefulSet застосунків ви **ніколи** не повинні змінювати стандартні значення.

Використовуйте наступну команду, щоб переглянути дерево процесів сервера ZooKeeper, який працює в поді `zk-0`.

```shell
kubectl exec zk-0 -- ps -ef
```

Команда, яка використовується як точка входу контейнера, має PID 1, а процес ZooKeeper, нащадок точки входу, має PID 27.

```none
UID        PID  PPID  C STIME TTY          TIME CMD
zookeep+     1     0  0 15:03 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
zookeep+    27     1  0 15:03 ?        00:00:03 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

У іншому терміналі спостерігайте за Podʼами у `StatefulSet` `zk` за допомогою наступної команди.

```shell
kubectl get pod -w -l app=zk
```

У іншому терміналі завершіть процес ZooKeeper у поді `zk-0` за допомогою наступної команди.

```shell
kubectl exec zk-0 -- pkill java
```

Завершення процесу ZooKeeper призвело до завершення його батьківського процесу. Оскільки `RestartPolicy` контейнера — завжди, він перезапустив батьківський процес.

```none
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          21m
zk-1      1/1       Running   0          20m
zk-2      1/1       Running   0          19m
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Error     0          29m
zk-0      0/1       Running   1         29m
zk-0      1/1       Running   1         29m
```

Якщо ваш застосунок використовує сценарій (наприклад, `zkServer.sh`) для запуску процесу, який реалізує бізнес-логіку застосунку, сценарій повинен завершуватися разом з дочірнім процесом. Це забезпечує перезапуск контейнера застосунку, коли процес, що реалізує бізнес-логіку застосунку, зазнає збою.

### Тестування на доступність {#testing-for-liveness}

Налаштування вашого застосунку на перезапуск збійних процесів це ще не все, щоб забезпечити справність розподіленої системи. Існують сценарії, коли процеси системи можуть бути живими, але недоступними або інакше несправними. Вам слід використовувати проби на доступність, щоб повідомити Kubernetes про те, що процеси вашого застосунку є несправними, і його слід перезапустити.

Шаблон Pod для `StatefulSet` `zk` визначає пробу на доступність.

```yaml
  livenessProbe:
    exec:
      command:
      - sh
      - -c
      - "zookeeper-ready 2181"
    initialDelaySeconds: 15
    timeoutSeconds: 5
```

Проба викликає скрипт bash, який використовує чотирилітерне слово `ruok` ZooKeeper для перевірки стану справності сервера.

```shell
OK=$(echo ruok | nc 127.0.0.1 $1)
if [ "$OK" == "imok" ]; then
    exit 0
else
    exit 1
fi
```

У одному вікні термінала використовуйте наступну команду, щоб спостерігати за подами у `StatefulSet` `zk`.

```shell
kubectl get pod -w -l app=zk
```

У іншому вікні, використовуйте наступну команду, щоб видалити скрипт `zookeeper-ready` з файлової системи Podʼа `zk-0`.

```shell
kubectl exec zk-0 -- rm /opt/zookeeper/bin/zookeeper-ready
```

Коли проба на доступність для процесу ZooKeeper невдала, Kubernetes автоматично перезапустить процес за вас, забезпечуючи тим самим перезапуск несправних процесів у наборі.

```shell
kubectl get pod -w -l app=zk
```

```none
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Running   0          1h
zk-0      0/1       Running   1         1h
zk-0      1/1       Running   1         1h
```

### Тестування готовності {#testing-for-readiness}

Готовність не те саме, що і доступність. Якщо процес живий, він запланований і справний. Якщо процес готовий, він може обробляти вхідні дані. Доступність є необхідною, але не достатньою, умовою для готовності. Є випадки, особливо під час ініціалізації та завершення, коли процес може бути доступним, але не готовим.

Якщо ви вказуєте пробу на готовність, Kubernetes буде переконуватися, що процеси вашого застосунку не отримуватимуть мережевого трафіку до тих пір, поки їхні перевірки готовності не пройдуть.

Для сервера ZooKeeper, доступність означає готовність. Тому проба готовності з маніфесту `zookeeper.yaml` ідентична пробі на доступність.

```yaml
  readinessProbe:
    exec:
      command:
      - sh
      - -c
      - "zookeeper-ready 2181"
    initialDelaySeconds: 15
    timeoutSeconds: 5
```

Навіть якщо проби на доступність та готовність ідентичні, важливо вказати обидві. Це забезпечує, що мережевий трафік отримуватимуть лише справні сервери в ансамблі ZooKeeper.

## Толерантність до відмов вузлів {#tolerating-node-failure}

Для успішного збереження змін даних ZooKeeper потрібен кворум серверів. Для ансамблю з трьох серверів, два сервери повинні бути справними, щоб записи вдалися. У системах на основі кворуму учасники розгорнені в областях відмов для забезпечення доступності. Щоб уникнути перебоїв через втрату окремої машини, найкращі практики виключають спільне розташування кількох екземплярів застосунку на одній машині.

Станадартно Kubernetes може розміщувати Podʼи в `StatefulSet` на тому ж вузлі. Для створеного вами ансамблю з трьох серверів, якщо два сервери знаходяться на тому ж вузлі, і цей вузол виходить з ладу, клієнти вашої служби ZooKeeper зазнають перебою, поки хоча б один з Podʼів не буде перепланований.

Ви завжди повинні надавати додаткові можливості для перепланування процесів критичних систем у разі відмови вузла. Якщо ви це зробите, перерва буде тривати лише до тих пір, поки планувальник Kubernetes перепланує один з серверів ZooKeeper. Однак, якщо ви хочете, щоб ваша служба терпіла відмови вузлів без перебою роботи, вам слід встановити `podAntiAffinity`.

Використовуйте наведену нижче команду, щоб отримати вузли для Podʼів у `StatefulSet` `zk`.

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template={{.spec.nodeName}}; echo ""; done
```

Всі Podʼи у `StatefulSet` `zk` розгорнуті на різних вузлах.

```none
kubernetes-node-cxpk
kubernetes-node-a5aq
kubernetes-node-2g2d
```

Це через те, що у Podʼах у `StatefulSet` `zk` вказано `PodAntiAffinity`.

```yaml
affinity:
  podAntiAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
            - key: "app"
              operator: In
              values:
                - zk
        topologyKey: "kubernetes.io/hostname"
```

Поле `requiredDuringSchedulingIgnoredDuringExecution` говорить планувальнику Kubernetes, що він ніколи не повинен розміщувати два Podʼи з міткою `app` як `zk` у домені, визначеному за допомогою `topologyKey`. Ключ `topologyKey` `kubernetes.io/hostname` вказує, що домен — це окремий вузол. Використовуючи різні правила, мітки та селектори, ви можете розширити цей метод, щоб розподілити свій ансамбль на фізичні, мережеві та домени відмов.

## Виживання під час обслуговування {#surviving-maintenance}

У цьому розділі ви здійсните блокування та виведення вузлів для обслуговування. Якщо ви використовуєте цей посібник на спільному кластері, переконайтеся, що це не позначиться негативно на інших мешканцях.

Попередній розділ показав, як розподілити ваші Podʼи по вузлах, щоб вижити в разі непередбачуваних відмов вузлів, але вам також потрібно планувати тимчасові відмови вузлів, які виникають через заплановане обслуговування.

Використайте цю команду, щоб отримати вузли у вашому кластері.

```shell
kubectl get nodes
```

У цьому посібнику передбачається наявність кластера з щонайменше чотирма вузлами. Якщо в кластері є більше чотирьох вузлів, використовуйте [`kubectl cordon`](/docs/reference/generated/kubectl/kubectl-commands/#cordon), щоб заборонити доступ до всіх вузлів, окрім чотирьох. Обмеження до чотирьох вузлів гарантуватиме, що Kubernetes врахує обмеження подібності та PodDisruptionBudget при плануванні Podʼів zookeeper у наступній симуляції обслуговування.

```shell
kubectl cordon <імʼя-вузла>
```

Використайте цю команду, щоб отримати `zk-pdb` `PodDisruptionBudget`.

```shell
kubectl get pdb zk-pdb
```

Поле `max-unavailable` показує Kubernetes, що в будь-який момент може бути недоступний найбільше один Pod з `StatefulSet` `zk`.

```none
NAME      MIN-AVAILABLE   MAX-UNAVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    N/A             1                 1
```

У одному терміналі використовуйте цю команду, щоб переглядати Podʼи у `StatefulSet` `zk`.

```shell
kubectl get pods -w -l app=zk
```

У іншому терміналі використовуйте цю команду, щоб отримати вузли, на яких наразі заплановані Podʼи.

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

Вихідна інформація подібна до наступної:

```none
kubernetes-node-pb41
kubernetes-node-ixsl
kubernetes-node-i4c4
```

Використовуйте [`kubectl drain`](/docs/reference/generated/kubectl/kubectl-commands/#drain), щоб заблокувати та вивести з використання вузол, на якому запланований Pod `zk-0`.

```shell
kubectl drain $(kubectl get pod zk-0 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

Вихідна інформація подібна до наступної:

```none
node "kubernetes-node-pb41" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-pb41, kube-proxy-kubernetes-node-pb41; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-o5elz
pod "zk-0" deleted
node "kubernetes-node-pb41" drained
```

Оскільки у вашому кластері є чотири вузла, команда `kubectl drain` успішно виконується, і `zk-0` перепланований на інший вузол.

```none
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   2          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS        RESTARTS   AGE
zk-0      1/1       Terminating   2          2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Pending   0         0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         51s
zk-0      1/1       Running   0         1m
```

Продовжуйте слідкувати за Podʼами StatefulSet у першому терміналі і виведіть вузол, на якому запланований `zk-1`.

```shell
kubectl drain $(kubectl get pod zk-1 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

Вихідна інформація подібна до наступної:

```none
"kubernetes-node-ixsl" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-ixsl, kube-proxy-kubernetes-node-ixsl; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-voc74
pod "zk-1" deleted
node "kubernetes-node-ixsl" drained
```

Pod `zk-1` не може бути перепланований, оскільки `StatefulSet` `zk` містить правило `PodAntiAffinity`, яке запобігає спільному розташуванню Podʼів, і так як доступні тільки два вузла, Pod залишиться в стані очікування.

```shell
kubectl get pods -w -l app=zk
```

Вихідна інформація подібна до наступної:

```none
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   2          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS        RESTARTS   AGE
zk-0      1/1       Terminating   2          2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Pending   0         0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         51s
zk-0      1/1       Running   0         1m
zk-1      1/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
```

Продовжуйте слідкувати за Podʼами StatefulSet, і виведіть з використання вузол, на якому запланований `zk-2`.

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

Вихідна інформація подібна до наступної:

```none
node "kubernetes-node-i4c4" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
WARNING: Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog; Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4
There are pending pods when an error occurred: Cannot evict pod as it would violate the pod's disruption budget.
pod/zk-2
```

Використовуйте `CTRL-C` для припинення роботи `kubectl`.

Ви не можете вивести з роботи третій вузол, оскільки `zk-2` буде порушувати `zk-budget`. Однак, вузол залишатиметься заблокованим (cordoned).

Використовуйте `zkCli.sh` для отримання значень введених впродовж перевірки адекватності `zk-0`.

```shell
kubectl exec zk-0 zkCli.sh get /hello
```

Service все ще доступний, оскільки його `PodDisruptionBudget` не порушено.

```none
WatchedEvent state:SyncConnected type:None path:null
world
cZxid = 0x200000002
ctime = Wed Dec 07 00:08:59 UTC 2016
mZxid = 0x200000002
mtime = Wed Dec 07 00:08:59 UTC 2016
pZxid = 0x200000002
cversion = 0
dataVersion = 0
aclVersion = 0
ephemeralOwner = 0x0
dataLength = 5
numChildren = 0
```

Використовуйте [`kubectl uncordon`](/docs/reference/generated/kubectl/kubectl-commands/#uncordon), щоб розблокувати вузол.

```shell
kubectl uncordon kubernetes-node-pb41
```

Вивід буде подібний до наступного:

```none
node "kubernetes-node-pb41" uncordoned
```

`zk-1` переплановано на цей вузол. Зачекайте доки `zk-1` не буде  Running та Ready.

```shell
kubectl get pods -w -l app=zk
```

Вивід буде подібний до наступного:

```none
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   2          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS        RESTARTS   AGE
zk-0      1/1       Terminating   2          2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Terminating   2         2h
zk-0      0/1       Pending   0         0s
zk-0      0/1       Pending   0         0s
zk-0      0/1       ContainerCreating   0         0s
zk-0      0/1       Running   0         51s
zk-0      1/1       Running   0         1m
zk-1      1/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Terminating   0         2h
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         0s
zk-1      0/1       Pending   0         12m
zk-1      0/1       ContainerCreating   0         12m
zk-1      0/1       Running   0         13m
zk-1      1/1       Running   0         13m
```

Спробуйте вивести вузол з обслуговування на якмоу запланований `zk-2`.

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

Вивід буде подібний до наступного:

```none
node "kubernetes-node-i4c4" already cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
pod "heapster-v1.2.0-2604621511-wht1r" deleted
pod "zk-2" deleted
node "kubernetes-node-i4c4" drained
```

На цей раз `kubectl drain` успішно виконується.

Розблокуйте другий вузол, щоб дозволити перепланування `zk-2`.

```shell
kubectl uncordon kubernetes-node-ixsl
```

Вивід буде подібний до наступного:

```none
node "kubernetes-node-ixsl" uncordoned
```

Ви можете використовувати `kubectl drain` разом з `PodDisruptionBudgets`, щоб забезпечити доступність ваших служб під час обслуговування. Якщо `drain` використовується для блокування вузлів та видалення Podʼів до виключення вузла з експлуатації для обслуговування, служби, які виражають бюджет відмов, мають поважати цей бюджет . Ви завжди повинні виділяти додаткову потужність для критичних служб, щоб їх Podʼи могли негайно бути переплановані.

## {{% heading "cleanup" %}}

- Використайте `kubectl uncordon`, щоб розблокувати всі вузли у вашому кластері.
- Ви повинні видалити носії постійного носія для PersistentVolumes, використаних у цьому посібнику. Дотримуйтеся необхідних кроків, залежно від вашого середовища, конфігурації зберігання та методу надання послуг, щоб переконатися, що всі збережені дані вилучено.
