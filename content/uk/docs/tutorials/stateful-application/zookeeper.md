---
title: Запуск ZooKeeper, координатора розподіленої системи
content_type: tutorial
weight: 40
---

<!-- overview -->

Цей посібник демонструє, як запускати [Apache Zookeeper](https://zookeeper.apache.org) в Kubernetes, використовуючи [StatefulSets](/docs/concepts/workloads/controllers/statefulset/), [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget) і [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).

## {{% heading "prerequisites" %}} {#before-you-begin}

Перш ніж почати цей посібник, ознайомтеся з такими концепціями Kubernetes:

- [Podʼи](/docs/concepts/workloads/pods/)
- [DNS кластера](/docs/concepts/services-networking/dns-pod-service/)
- [Headless Services](/docs/concepts/services-networking/service/#headless-services)
- [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
- [StatefulSets](/docs/concepts/workloads/controllers/statefulset/)
- [PodDisruptionBudgets](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budget)
- [PodAntiAffinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
- [kubectl CLI](/docs/reference/kubectl/kubectl/)

Вам потрібен кластер щонайменше з чотирма вузлами, і кожен вузол потребує щонайменше 2 CPU та 4 ГіБ памʼяті. У цьому посібнику ви виконуватимете cordon і drain вузлів кластера. **Це означає, що кластер завершить роботу та виселить усі Podʼи на своїх вузлах, а вузли тимчасово стануть непридатними для планування.** Для цього посібника варто використовувати окремий кластер або переконатися, що спричинене вами порушення не завадить іншим орендарям.

У цьому посібнику передбачається, що ви налаштували свій кластер на динамічне надання PersistentVolume. Якщо ваш кластер так не налаштовано, вам доведеться вручну надати три томи по 20 ГіБ, перш ніж почати цей посібник.

## {{% heading "objectives" %}} {#objectives}

Після проходження цього посібника ви будете знати, як:

- Як розгорнути ансамбль ZooKeeper за допомогою StatefulSet.
- Як узгоджено налаштовувати ансамбль.
- Як розподіляти розгортання серверів ZooKeeper в ансамблі.
- Як використовувати PodDisruptionBudgets, щоб забезпечити доступність сервісу під час запланованого обслуговування.

<!-- lessoncontent -->

### ZooKeeper {#zookeeper}

[Apache ZooKeeper](https://zookeeper.apache.org/doc/current/) — це розподілений координаційний сервіс з відкритим кодом для розподілених застосунків. ZooKeeper дає змогу читати, записувати дані та спостерігати за їх оновленнями. Дані організовано в ієрархію, подібну до файлової системи, і репліковано на всі сервери ZooKeeper в ансамблі (наборі серверів ZooKeeper). Усі операції з даними атомарні та послідовно узгоджені. ZooKeeper забезпечує це за допомогою протоколу консенсусу [Zab](https://pdfs.semanticscholar.org/b02c/6b00bd5dbdbd951fddb00b906c82fa80f0b3.pdf), реплікуючи машину станів на всі сервери ансамблю.

Ансамбль використовує протокол Zab для вибору лідера, і ансамбль не може записувати дані, доки вибори не завершаться. Після цього ансамбль використовує Zab, щоб реплікувати всі записи до кворуму, перш ніж підтвердити їх і зробити видимими для клієнтів. Якщо не брати до уваги зважені кворуми, кворум — це більшість ансамблю, що містить поточного лідера. Наприклад, якщо в ансамблі три сервери, кворум становить частина, що містить лідера й ще один сервер. Якщо ансамбль не може досягти кворуму, він не може записувати дані.

Сервери ZooKeeper зберігають усю свою машину станів у памʼяті та записують кожну зміну до надійного WAL (Write Ahead Log) на носії. Коли сервер аварійно завершує роботу, він може відновити попередній стан, відтворивши WAL. Щоб WAL не зростав безмежно, сервери ZooKeeper періодично записують знімки свого стану з памʼяті на носій. Ці знімки можна завантажити безпосередньо в памʼять, а всі записи WAL, що передували знімку, можна відкинути.

## Створення ансамблю ZooKeeper {#creating-a-zookeeper-ensemble}

Наведений нижче маніфест містить [Headless Service](/docs/concepts/services-networking/service/#headless-services), [Service](/docs/concepts/services-networking/service/), [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) і [StatefulSet](/docs/concepts/workloads/controllers/statefulset/).

{{% code_sample file="application/zookeeper/zookeeper.yaml" %}}

Відкрийте термінал і скористайтеся командою [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply), щоб створити маніфест.

```shell
kubectl apply -f https://k8s.io/examples/application/zookeeper/zookeeper.yaml
```

Це створить Headless Service `zk-hs`, Service `zk-cs`, PodDisruptionBudget `zk-pdb` і StatefulSet `zk`.

```
service/zk-hs created
service/zk-cs created
poddisruptionbudget.policy/zk-pdb created
statefulset.apps/zk created
```

Скористайтеся [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get), щоб спостерігати, як контролер StatefulSet створює Podʼи StatefulSet.

```shell
kubectl get pods -w -l app=zk
```

Коли Pod `zk-2` в стані Running та Ready, скористайтеся `CTRL-C`, щоб припинити виконання kubectl.

```
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

Оскільки в анонімній мережі немає алгоритму вибору лідера, який гарантовано завершується, Zab потребує явної конфігурації членства для виборів лідера. Кожен сервер в ансамблі повинен мати унікальний ідентифікатор, усі сервери повинні знати глобальний набір ідентифікаторів, і кожен ідентифікатор має бути повʼязаний з мережевою адресою.

Використовуйте [`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec), щоб отримати імена хостів Podʼів у StatefulSet `zk`.

```shell
for i in 0 1 2; do kubectl exec zk-$i -- hostname; done
```

Контролер StatefulSet надає кожному Podʼу унікальне імʼя хоста на основі його порядкового індексу. Імена хостів мають вигляд `<імʼя statefulset>-<порядковий індекс>`. Оскільки поле `replicas` StatefulSet `zk` встановлено в `3`, контролер набору створює три Podʼи з іменами хостів `zk-0`, `zk-1` і `zk-2`.

```
zk-0
zk-1
zk-2
```

Сервери в ансамблі ZooKeeper використовують натуральні числа як унікальні ідентифікатори, і зберігають ідентифікатор кожного сервера у файлі, який називається `myid`, в теці даних сервера.

Щоб переглянути вміст файлу `myid` для кожного сервера, скористайтеся такою командою.

```shell
for i in 0 1 2; do echo "myid zk-$i";kubectl exec zk-$i -- cat /var/lib/zookeeper/data/myid; done
```

Оскільки ідентифікатори є натуральними числами, а порядкові індекси — невідʼємними цілими числами, ідентифікатор можна згенерувати, додавши 1 до порядкового номера.

```
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

```
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

Записи A в [DNS Kubernetes](/docs/concepts/services-networking/dns-pod-service/) перетворюють FQDN в IP-адреси Podʼів. Якщо Kubernetes переплановує Podʼи, він оновлює записи A із новими IP-адресами Podʼів, але імена записів A не змінюються.

ZooKeeper зберігає конфігурацію застосунку у файлі з назвою `zoo.cfg`. Використайте `kubectl exec`, щоб переглянути вміст файлу `zoo.cfg` у Podʼі `zk-0`.

```shell
kubectl exec zk-0 -- cat /opt/zookeeper/conf/zoo.cfg
```

У властивостях `server.1`, `server.2` та `server.3` внизу файлу `1`, `2` та `3` відповідають ідентифікаторам у файлах `myid` серверів ZooKeeper. Їм задано FQDN Podʼів у StatefulSet `zk`.

```
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

Протоколи консенсусу вимагають, щоб ідентифікатор кожного учасника був унікальним. Жодні два учасники протоколу Zab не повинні претендувати на той самий унікальний ідентифікатор. Це потрібно, щоб процеси в системі могли домовитися, які процеси які дані затвердили. Якщо запустити два Podʼи з тим самим порядковим номером, два сервери ZooKeeper ідентифікуватимуть себе як той самий сервер.

```shell
kubectl get pods -w -l app=zk
```

```
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

Записи A для кожного Podʼа створюються, коли Pod стає Ready. Тому FQDN серверів ZooKeeper вказуватимуть на одну точку доступу, і цією точкою доступу буде унікальний сервер ZooKeeper, що претендує на ідентичність, налаштовану в його файлі `myid`.

```
zk-0.zk-hs.default.svc.cluster.local
zk-1.zk-hs.default.svc.cluster.local
zk-2.zk-hs.default.svc.cluster.local
```

Це гарантує, що властивості `servers` у файлах `zoo.cfg` серверів ZooKeeper представляють правильно налаштований ансамбль.

```
server.1=zk-0.zk-hs.default.svc.cluster.local:2888:3888
server.2=zk-1.zk-hs.default.svc.cluster.local:2888:3888
server.3=zk-2.zk-hs.default.svc.cluster.local:2888:3888
```

Коли сервери використовують протокол Zab, щоб спробувати затвердити значення, вони або досягнуть консенсусу й затвердять значення (якщо вибори лідера пройшли успішно і принаймні два Podʼи Running і Ready), або не зможуть цього зробити (якщо будь-яку з умов не виконано). Не виникне стану, за якого один сервер підтверджує запис від імені іншого.

### Базова перевірка ансамблю {#sanity-testing-the-ensemble}

Найпростіша базова перевірка — записати дані на один сервер ZooKeeper і прочитати їх з іншого.

Наведена нижче команда виконує скрипт `zkCli.sh`, щоб записати `world` за шляхом `/hello` у Podʼі `zk-0` в ансамблі.

```shell
kubectl exec zk-0 -- zkCli.sh create /hello world
```

```
WATCHER::

WatchedEvent state:SyncConnected type:None path:null
Created /hello
```

Щоб отримати дані з Podʼа `zk-1`, використовуйте таку команду.

```shell
kubectl exec zk-1 -- zkCli.sh get /hello
```

Дані, які ви створили на `zk-0`, доступні на всіх серверах в ансамблі.

```
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

### Забезпечення надійного зберігання {#providing-durable-storage}

Як зазначено в розділі [Основи ZooKeeper](#zookeeper), ZooKeeper фіксує всі записи в надійному WAL і періодично записує знімки стану з памʼяті на носії. Використання WAL для забезпечення надійності — поширений прийом для застосунків, які використовують протоколи консенсусу, щоб отримати репліковану машину станів.

Використовуйте команду [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete), щоб видалити обʼєкт `StatefulSet` `zk`.

```shell
kubectl delete statefulset zk
```

```
statefulset.apps "zk" deleted
```

Спостерігайте за завершенням роботи Podʼів у `StatefulSet`.

```shell
kubectl get pods -w -l app=zk
```

Коли `zk-0` повністю завершить роботу, використовуйте `CTRL-C`, щоб завершити виконання kubectl.

```
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

Коли Pod `zk-2` перебуває в стані Running і Ready, використовуйте `CTRL-C`, щоб завершити виконання kubectl.

```
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

Використайте наведену нижче команду, щоб отримати з Podʼа `zk-2` значення, яке ви ввели під час [базової перевірки](#sanity-testing-the-ensemble).

```shell
kubectl exec zk-2 zkCli.sh get /hello
```

Хоча ви завершили роботу та знову створили всі Podʼи в StatefulSet `zk`, ансамбль усе ще обслуговує початкове значення.

```
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

Поле `volumeClaimTemplates` у `spec` StatefulSet `zk` задає PersistentVolume, наданий для кожного Podʼа.

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

Використайте цю команду, щоб отримати `PersistentVolumeClaims` `StatefulSet`.

```shell
kubectl get pvc -l app=zk
```

Коли `StatefulSet` повторно створює Podʼи, він повторно монтує PersistentVolumes Podʼів.

```
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
datadir-zk-0   Bound     pvc-bed742cd-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-1   Bound     pvc-bedd27d2-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
datadir-zk-2   Bound     pvc-bee0817e-bcb1-11e6-994f-42010a800002   20Gi       RWO           1h
```

Розділ `volumeMounts` у `template` контейнера `StatefulSet` монтує PersistentVolume в теки даних серверів ZooKeeper.

```yaml
volumeMounts:
- name: datadir
  mountPath: /var/lib/zookeeper
```

Коли Pod у `StatefulSet` `zk` (пере)планується, у теку даних сервера ZooKeeper завжди монтується той самий `PersistentVolume`. Навіть коли Podʼи переплануються, усі записи, зроблені у WAL серверів ZooKeeper, та всі їхні знімки зберігаються.

## Забезпечення узгодженої конфігурації {#ensuring-consistent-configuration}

Як зазначено в розділах [Забезпечення виборів лідера](#facilitating-leader-election) та [Досягнення консенсусу](#achieving-consensus), сервери в ансамблі ZooKeeper потребують узгодженої конфігурації, щоб обрати лідера й сформувати кворум. Їм також потрібна узгоджена конфігурація протоколу Zab, щоб протокол коректно працював через мережу. У нашому прикладі ми досягаємо узгодженої конфігурації, вбудовуючи її безпосередньо в маніфест.

Отримайте `zk` StatefulSet.

```shell
kubectl get sts zk -o yaml
```

```
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

Один з файлів, які генерує скрипт `zkGenConfig.sh`, керує логуванням ZooKeeper. ZooKeeper використовує [Log4j](https://logging.apache.org/log4j/2.x/) і стандартно застосовує для логування rolling file appender на основі часу та розміру.

Використайте наведену нижче команду, щоб отримати конфігурацію логування з одного з Podʼів у StatefulSet `zk`.

```shell
kubectl exec zk-0 cat /usr/etc/zookeeper/log4j.properties
```

Наведена нижче конфігурація логування змусить процес ZooKeeper записувати всі свої логи у стандартний вихідний потік.

```
zookeeper.root.logger=CONSOLE
zookeeper.console.threshold=INFO
log4j.rootLogger=${zookeeper.root.logger}
log4j.appender.CONSOLE=org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.Threshold=${zookeeper.console.threshold}
log4j.appender.CONSOLE.layout=org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern=%d{ISO8601} [myid:%X{myid}] - %-5p [%t:%C{1}@%L] - %m%n
```

Це найпростіший спосіб безпечно вести логи всередині контейнера. Оскільки застосунки записують логи у стандартний вивід, ротацію логів за вас виконуватиме Kubernetes. Kubernetes також реалізує розумну політику зберігання, яка гарантує, що логи застосунків, записані в стандартний вивід і стандартний потік помилок, не вичерпають локальні носії.

Використайте [`kubectl logs`](/docs/reference/generated/kubectl/kubectl-commands/#logs), щоб отримати останні 20 рядків логів з одного з Podʼів.

```shell
kubectl logs zk-0 --tail 20
```

Ви можете переглядати логи застосунків, записані у стандартний вивід або стандартну помилку, використовуючи `kubectl logs` та з Kubernetes Dashboard.

```
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

Kubernetes інтегрується з багатьма рішеннями для логування. Ви можете вибрати рішення для логування, яке найкраще підходить для вашого кластера та застосунків. Для логування та агрегації на рівні кластера розгляньте розгортання [sidecar-контейнера](/docs/concepts/cluster-administration/logging#sidecar-container-with-logging-agent) для ротації та надсилання ваших логів.

### Налаштування непривілейованого користувача {#configuring-a-non-privileged-user}

Чи варто дозволяти застосунку працювати як привілейований користувач усередині контейнера — питання дискусійне. Якщо ваша організація вимагає, щоб застосунки працювали від імені непривілейованого користувача, ви можете використати [SecurityContext](/docs/tasks/configure-pod-container/security-context/), щоб керувати тим, від імені якого користувача запускається точка входу.

У `template` Podʼів `StatefulSet` `zk` є `SecurityContext`.

```yaml
securityContext:
  runAsUser: 1000
  fsGroup: 1000
```

У контейнерах Podʼів UID 1000 відповідає користувачеві zookeeper, а GID 1000 — групі zookeeper.

Отримайте інформацію про процес ZooKeeper з Podʼа `zk-0`.

```shell
kubectl exec zk-0 -- ps -elf
```

Оскільки поле `runAsUser` обʼєкта `securityContext` встановлено в 1000, процес ZooKeeper працює не як root, а як користувач zookeeper.

```
F S UID        PID  PPID  C PRI  NI ADDR SZ WCHAN  STIME TTY          TIME CMD
4 S zookeep+     1     0  0  80   0 -  1127 -      20:46 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
0 S zookeep+    27     1  0  80   0 - 1155556 -    20:46 ?        00:00:19 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

Стандартно, коли PersistentVolume Podʼа монтується в теку даних сервера ZooKeeper, він доступний лише користувачеві root. Така конфігурація не дає процесу ZooKeeper записувати свій WAL і зберігати знімки.

Використайте наведену нижче команду, щоб отримати права доступу до теки даних ZooKeeper у Podʼі `zk-0`.

```shell
kubectl exec -ti zk-0 -- ls -ld /var/lib/zookeeper/data
```

Оскільки поле `fsGroup` обʼєкта `securityContext` встановлено в 1000, власником PersistentVolume Podʼів стає група zookeeper, і процес ZooKeeper може читати та записувати свої дані.

```
drwxr-sr-x 3 zookeeper zookeeper 4096 Dec  5 20:45 /var/lib/zookeeper/data
```

## Керування процесом ZooKeeper {#managing-the-zookeeper-process}

У [документації ZooKeeper](https://zookeeper.apache.org/doc/current/zookeeperAdmin.html#sc_supervision) зазначено: «Вам знадобиться наглядовий процес, який керує кожним із процесів ваших серверів ZooKeeper (JVM)». Використання watchdog (наглядового процесу) для перезапуску процесів, що зазнали збою, у розподіленій системі — поширений підхід. Під час розгортання застосунку в Kubernetes замість зовнішньої утиліти як наглядового процесу слід використовувати Kubernetes як watchdog для вашого застосунку.

### Оновлення ансамблю {#updating-the-ensemble}

`StatefulSet` `zk` налаштований на використання стратегії оновлення `RollingUpdate`.

Ви можете використовувати `kubectl patch`, щоб оновити кількість `cpus`, виділених серверам.

```shell
kubectl patch sts zk --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/resources/requests/cpu", "value":"0.3"}]'
```

```
statefulset.apps/zk patched
```

Використовуйте `kubectl rollout status`, щоб спостерігати за статусом оновлення.

```shell
kubectl rollout status sts/zk
```

```
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

Це завершує роботу Podʼів по одному у зворотному порядку і створює їх знову з новою конфігурацією. Це забезпечує збереження кворуму під час поетапного оновлення.

Використовуйте команду `kubectl rollout history`, щоб переглянути історію або попередні конфігурації.

```shell
kubectl rollout history sts/zk
```

Вивід подібний до цього:

```
statefulsets "zk"
REVISION
1
2
```

Використовуйте команду `kubectl rollout undo`, щоб скасувати модифікацію.

```shell
kubectl rollout undo sts/zk
```

Вивід подібний до цього:

```
statefulset.apps/zk rolled back
```

### Обробка відмови процесу {#handling-process-failure}

[Політики перезапуску](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) визначають, як Kubernetes обробляє збої процесу точки входу контейнера в Podʼі. Для Podʼів у `StatefulSet` єдине доречне значення `RestartPolicy` — Always, і воно стандартне. Для застосунків зі станом **ніколи** не перевизначайте стандартну політику.

Використайте цю команду, щоб переглянути дерево процесів сервера ZooKeeper, що працює в Podʼі `zk-0`.

```shell
kubectl exec zk-0 -- ps -ef
```

Команда, яка використовується як точка входу контейнера, має PID 1, а процес ZooKeeper, нащадок точки входу, має PID 27.

```
UID        PID  PPID  C STIME TTY          TIME CMD
zookeep+     1     0  0 15:03 ?        00:00:00 sh -c zkGenConfig.sh && zkServer.sh start-foreground
zookeep+    27     1  0 15:03 ?        00:00:03 /usr/lib/jvm/java-8-openjdk-amd64/bin/java -Dzookeeper.log.dir=/var/log/zookeeper -Dzookeeper.root.logger=INFO,CONSOLE -cp /usr/bin/../build/classes:/usr/bin/../build/lib/*.jar:/usr/bin/../share/zookeeper/zookeeper-3.4.9.jar:/usr/bin/../share/zookeeper/slf4j-log4j12-1.6.1.jar:/usr/bin/../share/zookeeper/slf4j-api-1.6.1.jar:/usr/bin/../share/zookeeper/netty-3.10.5.Final.jar:/usr/bin/../share/zookeeper/log4j-1.2.16.jar:/usr/bin/../share/zookeeper/jline-0.9.94.jar:/usr/bin/../src/java/lib/*.jar:/usr/bin/../etc/zookeeper: -Xmx2G -Xms2G -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /usr/bin/../etc/zookeeper/zoo.cfg
```

В іншому терміналі спостерігайте за Podʼами у `StatefulSet` `zk` за допомогою цієї команди.

```shell
kubectl get pod -w -l app=zk
```

В іншому терміналі завершіть процес ZooKeeper у Podʼі `zk-0` за допомогою цієї команди.

```shell
kubectl exec zk-0 -- pkill java
```

Завершення процесу ZooKeeper призвело до завершення його батьківського процесу. Оскільки `RestartPolicy` контейнера — Always, батьківський процес було перезапущено.

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          21m
zk-1      1/1       Running   0          20m
zk-2      1/1       Running   0          19m
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Error     0          29m
zk-0      0/1       Running   1         29m
zk-0      1/1       Running   1         29m
```

Якщо ваш застосунок використовує скрипт (наприклад, `zkServer.sh`) для запуску процесу, який реалізує бізнес-логіку застосунку, скрипт має завершуватися разом із дочірнім процесом. Це гарантує, що Kubernetes перезапустить контейнер застосунку, коли процес, що реалізує бізнес-логіку застосунку, зазнає збою.

### Перевірка життєздатності {#testing-for-liveness}

Налаштувати застосунок на перезапуск збійних процесів недостатньо, щоб розподілена система залишалася справною. Бувають сценарії, коли процеси системи можуть бути живими, але не відповідати або бути несправними в інший спосіб. Використовуйте проби життєздатності, щоб повідомляти Kubernetes, що процеси вашого застосунку несправні і їх слід перезапустити.

`template` Podʼа для `StatefulSet` `zk` визначає пробу життєздатності.

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

```
OK=$(echo ruok | nc 127.0.0.1 $1)
if [ "$OK" == "imok" ]; then
    exit 0
else
    exit 1
fi
```

В одному вікні термінала використайте цю команду, щоб спостерігати за Podʼами у StatefulSet `zk`.

```shell
kubectl get pod -w -l app=zk
```

В іншому вікні використайте цю команду, щоб видалити скрипт `zookeeper-ready` з файлової системи Podʼа `zk-0`.

```shell
kubectl exec zk-0 -- rm /opt/zookeeper/bin/zookeeper-ready
```

Коли проба життєздатності процесу ZooKeeper не проходить, Kubernetes автоматично перезапускає процес за вас, забезпечуючи перезапуск несправних процесів в ансамблі.

```shell
kubectl get pod -w -l app=zk
```

```
NAME      READY     STATUS    RESTARTS   AGE
zk-0      1/1       Running   0          1h
zk-1      1/1       Running   0          1h
zk-2      1/1       Running   0          1h
NAME      READY     STATUS    RESTARTS   AGE
zk-0      0/1       Running   0          1h
zk-0      0/1       Running   1         1h
zk-0      1/1       Running   1         1h
```

### Перевірка готовності {#testing-for-readiness}

Готовність — не те саме, що життєздатність. Якщо процес живий, він запланований і справний. Якщо процес готовий, він може обробляти вхідні дані. Життєздатність є необхідною, але не достатньою умовою готовності. Бувають випадки, особливо під час ініціалізації та завершення роботи, коли процес може бути живим, але не готовим.

Якщо ви вказуєте пробу готовності, Kubernetes гарантуватиме, що процеси вашого застосунку не отримуватимуть мережевого трафіку, доки не пройдуть перевірки готовності.

Для сервера ZooKeeper життєздатність означає готовність. Тому проба готовності з маніфесту `zookeeper.yaml` ідентична пробі життєздатності.

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

Хоча проби життєздатності та готовності ідентичні, важливо вказати обидві. Це гарантує, що мережевий трафік отримуватимуть лише справні сервери ансамблю ZooKeeper.

## Стійкість до відмов вузлів {#tolerating-node-failure}

ZooKeeper потрібен кворум серверів, щоб успішно затверджувати зміни даних. В ансамблі з трьох серверів для успішного запису справними мають бути два сервери. У системах на основі кворуму учасників розгортають у різних доменах відмов, щоб забезпечити доступність. Щоб уникнути простою через втрату окремої машини, найкращі практики не допускають розміщення кількох екземплярів застосунку на одній машині.

Стандартно Kubernetes може розміщувати Podʼи `StatefulSet` на одному вузлі. Якщо у створеному вами ансамблі з трьох серверів два сервери перебувають на одному вузлі і цей вузол виходить з ладу, клієнти вашого сервісу ZooKeeper зазнають простою, доки хоча б один з Podʼів не буде переплановано.

Завжди передбачайте додаткову потужність, щоб процеси критичних систем могли бути переплановані в разі відмови вузлів. Тоді простій триватиме лише доти, доки планувальник Kubernetes не переплановує один із серверів ZooKeeper. Однак якщо ви хочете, щоб ваш сервіс витримував відмови вузлів без простою, установіть `podAntiAffinity`.

Використовуйте наведену нижче команду, щоб отримати вузли для Podʼів у `StatefulSet` `zk`.

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

Всі Podʼи у `StatefulSet` `zk` розгорнуті на різних вузлах.

```
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

Поле `requiredDuringSchedulingIgnoredDuringExecution` повідомляє планувальнику Kubernetes, що він ніколи не повинен розміщувати два Podʼи з міткою `app` зі значенням `zk` в одному домені, визначеному `topologyKey`. `topologyKey` `kubernetes.io/hostname` вказує, що домен — це окремий вузол. Використовуючи різні правила, мітки та селектори, ви можете розширити цей прийом, щоб розподілити свій ансамбль між фізичними й мережевими доменами відмов і доменами відмов живлення.

## Витримування обслуговування {#surviving-maintenance}

У цьому розділі ви виконаєте cordon і drain вузлів. Якщо ви проходите цей посібник на спільному кластері, переконайтеся, що це не зашкодить іншим орендарям.

Попередній розділ показав, як розподілити Podʼи між вузлами, щоб пережити незаплановані відмови вузлів, але вам також потрібно планувати тимчасові відмови вузлів, що виникають через заплановане обслуговування.

Використайте цю команду, щоб отримати вузли у вашому кластері.

```shell
kubectl get nodes
```

У цьому посібнику передбачається кластер щонайменше з чотирма вузлами. Якщо в кластері більше чотирьох вузлів, використайте [`kubectl cordon`](/docs/reference/generated/kubectl/kubectl-commands/#cordon), щоб виконати cordon для всіх вузлів, окрім чотирьох. Обмеження чотирма вузлами гарантує, що під час планування Podʼів zookeeper у подальшій симуляції обслуговування Kubernetes натрапить на обмеження affinity і PodDisruptionBudget.

```shell
kubectl cordon <node-name>
```

Використайте цю команду, щоб отримати `zk-pdb` `PodDisruptionBudget`.

```shell
kubectl get pdb zk-pdb
```

Поле `max-unavailable` показує Kubernetes, що в будь-який момент може бути недоступний найбільше один Pod з `StatefulSet` `zk`.

```
NAME      MIN-AVAILABLE   MAX-UNAVAILABLE   ALLOWED-DISRUPTIONS   AGE
zk-pdb    N/A             1                 1
```

В одному терміналі використайте цю команду, щоб спостерігати за Podʼами у `StatefulSet` `zk`.

```shell
kubectl get pods -w -l app=zk
```

В іншому терміналі використайте цю команду, щоб отримати вузли, на яких зараз заплановано Podʼи.

```shell
for i in 0 1 2; do kubectl get pod zk-$i --template {{.spec.nodeName}}; echo ""; done
```

Вивід подібний до цього:

```
kubernetes-node-pb41
kubernetes-node-ixsl
kubernetes-node-i4c4
```

Використайте [`kubectl drain`](/docs/reference/generated/kubectl/kubectl-commands/#drain), щоб виконати cordon і drain вузла, на якому заплановано Pod `zk-0`.

```shell
kubectl drain $(kubectl get pod zk-0 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

Вивід подібний до цього:

```
node "kubernetes-node-pb41" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-pb41, kube-proxy-kubernetes-node-pb41; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-o5elz
pod "zk-0" deleted
node "kubernetes-node-pb41" drained
```

Оскільки у вашому кластері чотири вузли, `kubectl drain` виконується успішно, і `zk-0` переплановується на інший вузол.

```
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

Продовжуйте спостерігати за Podʼами `StatefulSet` у першому терміналі та виконайте drain вузла, на якому заплановано `zk-1`.

```shell
kubectl drain $(kubectl get pod zk-1 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

Вивід подібний до цього:

```
"kubernetes-node-ixsl" cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-ixsl, kube-proxy-kubernetes-node-ixsl; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-voc74
pod "zk-1" deleted
node "kubernetes-node-ixsl" drained
```

Pod `zk-1` не можна запланувати, оскільки `StatefulSet` `zk` містить правило `PodAntiAffinity`, яке не дає розміщувати Podʼи разом, а оскільки для планування доступні лише два вузли, Pod залишиться в стані Pending.

```shell
kubectl get pods -w -l app=zk
```

Вивід подібний до цього:

```
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

Продовжуйте спостерігати за Podʼами StatefulSet і виконайте drain вузла, на якому заплановано `zk-2`.

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

Вивід подібний до цього:

```
node "kubernetes-node-i4c4" cordoned

WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
WARNING: Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog; Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4
There are pending pods when an error occurred: Cannot evict pod as it would violate the pod's disruption budget.
pod/zk-2
```

Використовуйте `CTRL-C` для припинення роботи `kubectl`.

Ви не можете виконати drain третього вузла, оскільки виселення `zk-2` порушило б `zk-budget`. Однак вузол залишиться в стані cordon.

Використайте `zkCli.sh`, щоб отримати з `zk-0` значення, яке ви ввели під час базової перевірки.

```shell
kubectl exec zk-0 zkCli.sh get /hello
```

Сервіс усе ще доступний, оскільки його `PodDisruptionBudget` дотримано.

```
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

Використайте [`kubectl uncordon`](/docs/reference/generated/kubectl/kubectl-commands/#uncordon), щоб виконати uncordon першого вузла.

```shell
kubectl uncordon kubernetes-node-pb41
```

Вивід подібний до цього:

```
node "kubernetes-node-pb41" uncordoned
```

`zk-1` переплановано на цей вузол. Зачекайте, доки `zk-1` не буде Running і Ready.

```shell
kubectl get pods -w -l app=zk
```

Вивід подібний до цього:

```
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

Спробуйте виконати drain вузла, на якому заплановано `zk-2`.

```shell
kubectl drain $(kubectl get pod zk-2 --template {{.spec.nodeName}}) --ignore-daemonsets --force --delete-emptydir-data
```

Вивід подібний до цього:

```
node "kubernetes-node-i4c4" already cordoned
WARNING: Deleting pods not managed by ReplicationController, ReplicaSet, Job, or DaemonSet: fluentd-cloud-logging-kubernetes-node-i4c4, kube-proxy-kubernetes-node-i4c4; Ignoring DaemonSet-managed pods: node-problem-detector-v0.1-dyrog
pod "heapster-v1.2.0-2604621511-wht1r" deleted
pod "zk-2" deleted
node "kubernetes-node-i4c4" drained
```

На цей раз `kubectl drain` успішно виконується.

Виконайте uncordon другого вузла, щоб дозволити перепланування `zk-2`.

```shell
kubectl uncordon kubernetes-node-ixsl
```

Вивід подібний до цього:

```
node "kubernetes-node-ixsl" uncordoned
```

Ви можете використовувати `kubectl drain` разом з `PodDisruptionBudgets`, щоб ваші сервіси залишалися доступними під час обслуговування. Якщо drain використовується для cordon вузлів і виселення Podʼів перед виведенням вузла з роботи для обслуговування, бюджет порушень сервісів, які його задають, буде дотримано. Завжди виділяйте додаткову потужність для критичних сервісів, щоб їхні Podʼи могли негайно бути переплановані.

## {{% heading "cleanup" %}} {#cleaning-up}

- Використайте `kubectl uncordon`, щоб виконати uncordon усіх вузлів у вашому кластері.
- Ви маєте видалити носії постійного сховища для PersistentVolume, використаних у цьому посібнику. Виконайте потрібні кроки залежно від вашого середовища, конфігурації сховища та методу надання, щоб усе сховище було звільнено.
