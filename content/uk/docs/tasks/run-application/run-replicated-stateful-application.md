---
title: Запуск реплікованого застосунку зі збереженням стану
content_type: task
weight: 30
---

<!-- overview -->

Ця сторінка показує, як запустити реплікований застосунок зі збереженням стану ({{< glossary_tooltip term_id="statefulset" >}}). Цей застосунок — реплікована база даних MySQL. У топології цього прикладу є один головний сервер і кілька реплік, що використовують асинхронну реплікацію на основі рядків.

{{< note >}}
**Ця конфігурація не для операційної експлуатації**. Налаштування MySQL залишаються на небезпечних стандартних значеннях, щоб зосередитися на загальних патернах запуску застосунків зі збереженням стану в Kubernetes.
{{< /note >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

- {{< include "task-tutorial-prereqs.md" >}}
- {{< include "default-storage-class-prereqs.md" >}}
- Це завдання передбачає, що ви знаєте про [Постійні томи](/docs/concepts/storage/persistent-volumes/) та [StatefulSets](/docs/concepts/workloads/controllers/statefulset/), а також інші основні поняття, такі як [Pod](/docs/concepts/workloads/pods/), [Service](/docs/concepts/services-networking/service/) та [ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap/).
- Трохи знань MySQL корисні, але цей посібник має на меті представити загальні патерни, які можуть бути корисними для інших систем.
- Ви використовуєте простір імен default або інший простір імен, в якому відсутні обʼєкти, що конфліктують.
- У вас має бути AMD64-сумісний процесор.

## {{% heading "objectives" %}}

- Розгорнути репліковану топологію MySQL за допомогою StatefulSet.
- Направити трафік від клієнта MySQL.
- Спостерігати стійкість до перерв у роботі.
- Масштабувати StatefulSet вгору та вниз.

<!-- lessoncontent -->

## Розгортання MySQL {#deploy-mysql}

Приклад розгортання складається з ConfigMap, двох Service та StatefulSet.

### Створення ConfigMap {#configmap}

Створіть ConfigMap із наступного файлу конфігурації YAML:

{{% code_sample file="application/mysql/mysql-configmap.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-configmap.yaml
```

Цей ConfigMap надає перевизначення для `my.cnf`, що дозволяє вам незалежно керувати конфігурацією на головному сервері MySQL та його репліках. У цьому випадку ви хочете, щоб головний сервер міг обслуговувати логи реплікацій реплік, а репліки відхиляли будь-які записи, які надходять не через реплікацію.

Немає нічого особливого у самому ConfigMap, що зумовлює застосування різних частин до різних Podʼів. Кожен Pod вирішує, яку частину дивитися при ініціалізації, на основі інформації, що надає контролер StatefulSet.

### Створення Service {#services}

Створіть Service із наступного файлу конфігурації YAML:

{{% code_sample file="application/mysql/mysql-services.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-services.yaml
```

Service headless надає місце для DNS-записів, які {{< glossary_tooltip text="контролери" term_id="controller" >}} StatefulSet створюють для кожного Podʼа, що є частиною набору. Оскільки headless Service називається `mysql`, Podʼи доступні за допомогою зіставлення `<pod-name>.mysql` з будь-якого іншого Podʼа в тому ж Kubernetes кластері та просторі імен.

Клієнтський Service, з назвою `mysql-read`, є звичайним Service з власним кластерним IP, який розподіляє підключення між всіма Podʼами MySQL, які повідомляють про готовність. Набір потенційних точок доступу включає головний сервер MySQL та всі репліки.

Зверніть увагу, що лише запити на читання можуть використовувати балансувальник Service. Оскільки існує лише один головний сервер MySQL, клієнти повинні підключатися безпосередньо до головного Podʼа MySQL (через його DNS-запис у головному Service) для виконання записів.

### Створення StatefulSet {#statefulset}

Наостанок, створіть StatefulSet із наступного файлу конфігурації YAML:

{{% code_sample file="application/mysql/mysql-statefulset.yaml" %}}

```shell
kubectl apply -f https://k8s.io/examples/application/mysql/mysql-statefulset.yaml
```

Ви можете спостерігати за процесом запуску, виконавши:

```shell
kubectl get pods -l app=mysql --watch
```

Через деякий час ви повинні побачити, що всі 3 Podʼи стануть `Running`:

```none
NAME      READY     STATUS    RESTARTS   AGE
mysql-0   2/2       Running   0          2m
mysql-1   2/2       Running   0          1m
mysql-2   2/2       Running   0          1m
```

Натисніть **Ctrl+C**, щоб скасувати перегляд.

{{< note >}}
Якщо ви не бачите жодних змін, переконайтеся, що у вас увімкнений динамічний PersistentVolume провізор, як зазначено у [передумовах](#before-you-begin).
{{< /note >}}

Цей маніфест використовує різноманітні техніки для керування Podʼами як частиною StatefulSet. У наступному розділі підкреслено деякі з цих технік, щоб пояснити, що відбувається під час створення Podʼів StatefulSet.

## Розуміння ініціалізації Podʼа зі збереженням стану {#understanding-statefulset-pod-initialization}

Контролер StatefulSet запускає Podʼи по одному, в порядку їх індексів. Він чекає, доки кожен Pod не повідомить про готовність, перш ніж запустити наступний.

Крім того, контролер призначає кожному Podʼу унікальне, стабільне імʼя у формі `<statefulset-name>-<ordinal-index>`, в результаті отримуємо Podʼи з іменами `mysql-0`, `mysql-1` та `mysql-2`.

Шаблон Podʼа у вищенаведеному маніфесті StatefulSet використовує ці властивості, щоб здійснити впорядкований запуск реплікації MySQL.

### Створення конфігурації {#generating-configuration}

Перед запуском будь-яких контейнерів у специфікації Podʼа, спочатку Pod запускає будь-які
[контейнери ініціалізації](/docs/concepts/workloads/pods/init-containers/) у визначеному порядку.

Перший контейнер ініціалізації, `init-mysql`, генерує спеціальні конфігураційні файли MySQL на основі порядкового індексу.

Скрипт визначає свій власний порядковий індекс, витягуючи його з кінця імені Podʼа, яке повертається командою `hostname`. Потім він зберігає порядковий індекс (з числовим зміщенням для уникнення зарезервованих значень) у файлі з назвою `server-id.cnf` в теці `conf.d` MySQL. Це перетворює унікальний, стабільний ідентифікатор, наданий StatefulSet, у домен ідентифікаторів серверів MySQL, які вимагають таких же властивостей.

Скрипт у контейнері `init-mysql` також застосовує або `primary.cnf`, або `replica.cnf` з ConfigMap, копіюючи вміст у `conf.d`. Оскільки у топології цього прикладу є лише один головний сервер MySQL та будь-яка кількість реплік, скрипт призначає порядковий індекс `0` головному серверу, а всі інші — репліками. Разом з гарантією контролера StatefulSet щодо [порядку розгортання](/docs/concepts/workloads/controllers/statefulset/#deployment-and-scaling-guarantees), це забезпечує готовність головного сервера MySQL перед створенням реплік, щоб вони могли почати реплікацію.

### Клонування наявних даних {#cloning-existing-data}

Загалом, коли новий Pod приєднується до набору як репліка, він повинен припускати, що головний сервер MySQL може вже містити дані. Також він повинен припускати, що логи реплікації можуть не бути повністю отримані з самого початку. Ці консервативні припущення є ключем до можливості запуску робочого StatefulSet масштабуватися вгору та вниз з часом, а не залишатися фіксованим на своєму початковому розмірі.

Другий контейнер ініціалізації, з назвою `clone-mysql`, виконує операцію клонування на реплікаційному Podʼі першого разу, коли він запускається на порожньому PersistentVolume. Це означає, що він копіює всі наявні дані з іншого працюючого Podʼа, таким чином, його локальний стан є достатньо консистентним для початку реплікації з головного сервера.

MySQL сам по собі не надає механізму для цього, тому приклад використовує популярний відкритий інструмент — Percona XtraBackup. Під час клонування MySQL сервер може мати знижену продуктивність. Щоб мінімізувати вплив на головний сервер MySQL, скрипт вказує кожному Podʼу отримувати дані з Podʼа, чий порядковий індекс на одиницю менший. Це працює через те, що контролер StatefulSet завжди гарантує, що Pod `N` є готовим перед запуском Podʼа `N+1`.

### Початок реплікації {#starting-replication}

Після успішного завершення контейнерів ініціалізації запускаються звичайні контейнери. Podʼи MySQL складаються з контейнера `mysql`, в якому працює фактичний сервер `mysqld`, та контейнера `xtrabackup`, який діє як [sidecar](/blog/2015/06/the-distributed-system-toolkit-patterns).

Sidecar `xtrabackup` переглядає клоновані файли даних і визначає, чи необхідно ініціалізувати реплікацію MySQL на репліці. У цьому випадку він чекає, доки `mysqld` буде готовий, а потім виконує команди `CHANGE MASTER TO` та `START SLAVE` з параметрами реплікації, отриманими з клонованих файлів XtraBackup.

Після того як репліка починає реплікацію, вона запамʼятовує свій головний сервер MySQL і автоматично підʼєднується, якщо сервер перезавантажується або зʼєднання втрачається. Також, оскільки репліки шукають головний сервер за його стабільним DNS-імʼям (`mysql-0.mysql`), вони автоматично знаходять головний сервер навіть якщо він отримує новий IP Podʼа через перепланування.

Нарешті, після початку реплікації, контейнер `xtrabackup` слухає зʼєднання з інших Podʼів, які запитують клон даних. Цей сервер залишається активним нескінченно довго в разі, якщо StatefulSet масштабується вгору, або якщо наступний Pod втрачає свій PersistentVolumeClaim і потрібно повторно виконати клонування.

## Надсилання клієнтського трафіку {#sending-client-traffic}

Ви можете надіслати тестові запити до головного сервера MySQL (хост `mysql-0.mysql`) запустивши тимчасовий контейнер з образом `mysql:5.7` і використовуючи бінарний файл клієнта `mysql`.

```shell
kubectl run mysql-client --image=mysql:5.7 -i --rm --restart=Never --\
  mysql -h mysql-0.mysql <<EOF
CREATE DATABASE test;
CREATE TABLE test.messages (message VARCHAR(250));
INSERT INTO test.messages VALUES ('hello');
EOF
```

Використовуйте хост `mysql-read`, щоб надіслати тестові запити до будь-якого сервера, який повідомляє про готовність:

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-read -e "SELECT * FROM test.messages"
```

Ви повинні отримати вивід схожий на цей:

```none
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

Щоб продемонструвати, що Service `mysql-read` розподіляє підключення між
серверами, ви можете запустити `SELECT @@server_id` у циклі:

```shell
kubectl run mysql-client-loop --image=mysql:5.7 -i -t --rm --restart=Never --\
  bash -ic "while sleep 1; do mysql -h mysql-read -e 'SELECT @@server_id,NOW()'; done"
```

Ви повинні бачити, що `@@server_id` змінюється випадковим чином, оскільки може бути вибрана інша точка доступу при кожній спробі підключення:

```none
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         100 | 2006-01-02 15:04:05 |
+-------------+---------------------+
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         102 | 2006-01-02 15:04:06 |
+-------------+---------------------+
+-------------+---------------------+
| @@server_id | NOW()               |
+-------------+---------------------+
|         101 | 2006-01-02 15:04:07 |
+-------------+---------------------+
```

Ви можете натиснути **Ctrl+C**, коли захочете зупинити цикл, але цікаво тримати його запущеним в іншому вікні, щоб бачити ефект від наступних кроків.

## Симуляція відмови Podʼа та Вузла {#simulate-pod-and-node-downtime}

Щоб продемонструвати підвищену доступність читання з пулу реплік замість одного сервера, залиште цикл `SELECT @@server_id`, запущений вище, активним, тоді як ви змушуєте Pod вийти зі стану Ready.

### Збій проби готовності {#break-readiness-probe}

[Проба готовності](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-readiness-probes) для контейнера `mysql` виконує команду `mysql -h 127.0.0.1 -e 'SELECT 1'`, щоб переконатися, що сервер запущений і може виконувати запити.

Одним зі способів змусити цю пробу готовності збоїти — це пошкодити цю команду:

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql /usr/bin/mysql.off
```

Ця дія втручається у файлову систему контейнера Podʼа `mysql-2` і перейменовує команду `mysql`, щоб проба готовності не могла її знайти. Через кілька секунд Pod повинен повідомити про один зі своїх контейнерів як неготовий, що можна перевірити за допомогою:

```shell
kubectl get pod mysql-2
```

Перевірте значення `1/2` у стовпці `READY`:

```none
NAME      READY     STATUS    RESTARTS   AGE
mysql-2   1/2       Running   0          3m
```

На цьому етапі ви повинні бачити продовження роботи вашого циклу `SELECT @@server_id`, хоча він більше не повідомляє про `102`. Нагадаємо, що скрипт `init-mysql` визначив `server-id` як `100 + $ordinal`, тож ідентифікатор сервера `102` відповідає Поду `mysql-2`.

Тепер відновіть Pod і він повинен знову зʼявитися у виводі циклу через кілька секунд:

```shell
kubectl exec mysql-2 -c mysql -- mv /usr/bin/mysql.off /usr/bin/mysql
```

### Видалення Podʼів {#delete-pods}

Контролер StatefulSet також створює Podʼи знову, якщо вони видалені, подібно до того, як це робить ReplicaSet для Podʼів без збереження стану.

```shell
kubectl delete pod mysql-2
```

Контролер StatefulSet помічає, що Podʼа `mysql-2` більше не існує, і створює новий з тією ж назвою та повʼязаний з тим самим PersistentVolumeClaim. Ви повинні побачити, що ідентифікатор сервера `102` зникне з виводу циклу протягом певного часу і потім повернеться самостійно.

### Виведення вузла з експлуатації {#drain-node}

Якщо у вашому кластері Kubernetes є кілька вузлів, ви можете симулювати відмову вузла(наприклад, під час оновлення вузлів) за допомогою команди [drain](/docs/reference/generated/kubectl/kubectl-commands/#drain).

Спочатку визначте, на якому вузлі знаходиться один із Podʼів MySQL:

```shell
kubectl get pod mysql-2 -o wide
```

Назва вузла повинна зʼявитися у останньому стовпчику:

```none
NAME      READY     STATUS    RESTARTS   AGE       IP            NODE
mysql-2   2/2       Running   0          15m       10.244.5.27   kubernetes-node-9l2t
```

Потім виведіть вузол з експлуатації, виконавши наступну команду, яка забороняє новим Podʼам запускатися на цьому вузлі та видаляє будь-які існуючі Podʼи. Замість `<node-name>` підставте назву вузла, яку ви знайшли на попередньому кроці.

{{< caution >}}
Виведення вузла з експлуатації може вплинути на інші завдання та застосунки, що працюють на тому ж вузлі. Виконуйте наступний крок тільки на тестовому кластері.
{{< /caution >}}

```shell
# Дивіться вище поради щодо впливу на інші завдання
kubectl drain <node-name> --force --delete-emptydir-data --ignore-daemonsets
```

Тепер ви можете спостерігати, як Pod переплановується на іншому вузлі:

```shell
kubectl get pod mysql-2 -o wide --watch
```

Це має виглядати приблизно так:

```none
NAME      READY   STATUS          RESTARTS   AGE       IP            NODE
mysql-2   2/2     Terminating     0          15m       10.244.1.56   kubernetes-node-9l2t
[...]
mysql-2   0/2     Pending         0          0s        <none>        kubernetes-node-fjlm
mysql-2   0/2     Init:0/2        0          0s        <none>        kubernetes-node-fjlm
mysql-2   0/2     Init:1/2        0          20s       10.244.5.32   kubernetes-node-fjlm
mysql-2   0/2     PodInitializing 0          21s       10.244.5.32   kubernetes-node-fjlm
mysql-2   1/2     Running         0          22s       10.244.5.32   kubernetes-node-fjlm
mysql-2   2/2     Running         0          30s       10.244.5.32   kubernetes-node-fjlm
```

І знову, ви повинні побачити, що ідентифікатор сервера `102` зник з виводу циклу `SELECT @@server_id` протягом певного часу, а потім повернувся.

Тепер знову дозвольте вузлу приймати навантаження:

```shell
kubectl uncordon <node-name>
```

## Масштабування кількості реплік {#scaling-the-number-of-replicas}

Коли ви використовуєте реплікацію MySQL, ви можете збільшувати кількість запитів на читання, додаючи репліки. Для StatefulSet це можна зробити однією командою:

```shell
kubectl scale statefulset mysql --replicas=5
```

Спостерігайте, як нові Podʼи запускаються, виконавши:

```shell
kubectl get pods -l app=mysql --watch
```

Коли вони будуть готові, ви побачите, що ідентифікатори серверів `103` та `104` починають зʼявлятися у виводі циклу `SELECT @@server_id`.

Ви також можете перевірити, що ці нові сервери мають дані, які ви додали до них до того, як вони існували:

```shell
kubectl run mysql-client --image=mysql:5.7 -i -t --rm --restart=Never --\
  mysql -h mysql-3.mysql -e "SELECT * FROM test.messages"
```

```none
Waiting for pod default/mysql-client to be running, status is Pending, pod ready: false
+---------+
| message |
+---------+
| hello   |
+---------+
pod "mysql-client" deleted
```

Зменшити кількість реплік також можна однією командою:

```shell
kubectl scale statefulset mysql --replicas=3
```

{{< note >}}
Хоча збільшення створює нові PersistentVolumeClaims автоматично, зменшення автоматично не видаляє ці PVC.

Це дає вам можливість залишити ці ініціалізовані PVC для швидшого збільшення, або вилучити дані перед їх видаленням.
{{< /note >}}

Ви можете перевірити це, виконавши:

```shell
kubectl get pvc -l app=mysql
```

Це покаже, що всі 5 PVC все ще існують, попри те, що StatefulSet був зменшений до 3:

```none
NAME           STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
data-mysql-0   Bound     pvc-8acbf5dc-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-1   Bound     pvc-8ad39820-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-2   Bound     pvc-8ad69a6d-b103-11e6-93fa-42010a800002   10Gi       RWO           20m
data-mysql-3   Bound     pvc-50043c45-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
data-mysql-4   Bound     pvc-500a9957-b1c5-11e6-93fa-42010a800002   10Gi       RWO           2m
```

Якщо ви не збираєтеся повторно використовувати додаткові PVC, ви можете їх видалити:

```shell
kubectl delete pvc data-mysql-3
kubectl delete pvc data-mysql-4
```

## {{% heading "cleanup" %}}

1. Припинить цикл `SELECT @@server_id`, натиснувши **Ctrl+C** в його терміналі або виконавши наступне з іншого терміналу:

   ```shell
   kubectl delete pod mysql-client-loop --now
   ```

2. Видаліть StatefulSet. Це також розпочне завершення Podʼів.

   ```shell
   kubectl delete statefulset mysql
   ```

3. Перевірте, що Podʼи зникають. Вони можуть зайняти деякий час для завершення роботи.

   ```shell
   kubectl get pods -l app=mysql
   ```

   Ви будете знати, що Podʼи завершилися, коли вищезазначена команда поверне:

   ```none
   No resources found.
   ```

4. Видаліть ConfigMap, Services та PersistentVolumeClaims.

   ```shell
   kubectl delete configmap,service,pvc -l app=mysql
   ```

5. Якщо ви вручну створювали PersistentVolumes, вам також потрібно вручну видалити їх, а також звільнити відповідні ресурси. Якщо ви використовували динамічний провізор, він автоматично видаляє PersistentVolumes, коли бачить, що ви видалили PersistentVolumeClaims. Деякі динамічні провізори (такі як ті, що стосуються EBS та PD) також звільняють відповідні ресурси при видаленні PersistentVolumes.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [масштабування StatefulSet](/docs/tasks/run-application/scale-stateful-set/).
- Дізнайтеся більше про [налагодження StatefulSet](/docs/tasks/debug/debug-application/debug-statefulset/).
- Дізнайтеся більше про [видалення StatefulSet](/docs/tasks/run-application/delete-stateful-set/).
- Дізнайтеся більше про [примусове видалення Podʼів StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
- Подивіться в [сховищі Helm чартів](https://artifacthub.io/) інші приклади застосунків зі збереженням стану.
