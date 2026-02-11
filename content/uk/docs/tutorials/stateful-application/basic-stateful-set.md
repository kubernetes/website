---
title: Основи StatefulSet
content_type: tutorial
weight: 10
---

<!-- overview -->
Цей підручник надає вступ до управління застосунками за допомогою {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}. Він демонструє, як створювати, видаляти, масштабувати та оновлювати Podʼи StatefulSets.

## {{% heading "prerequisites" %}}

Перш ніж розпочати цей підручник, вам слід ознайомитися з наступними концепціями Kubernetes:

* [Podʼи](/docs/concepts/workloads/pods/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
* [PersistentVolumes Provisioning](/docs/concepts/storage/dynamic-provisioning/)
* Інструмент командного рядка [kubectl](/docs/reference/kubectl/kubectl/)

{{% include "task-tutorial-prereqs.md" %}}
Вам слід налаштувати `kubectl` для використання контексту, який використовує простір імен `default`. Якщо ви використовуєте наявний кластер, переконайтеся, що можна використовувати
простір імен цього кластера для практики. Ідеальною буде практика в кластері, де не запущені реальні робочі навантаження.

Також корисно прочитати сторінку з концепціями про [StatefulSets](/docs/concepts/workloads/controllers/statefulset/).

{{< note >}}
Цей підручник передбачає, що ваш кластер налаштований на динамічне забезпечення
PersistentVolumes. Вам також потрібно мати [типовий StorageClass](/docs/concepts/storage/storage-classes/#default-storageclass). Якщо ваш кластер не налаштований для динамічного забезпечення сховища, вам доведеться вручну забезпечити два томи по 1 GiB перед початком цього уроку та налаштувати ваш кластер так, щоб ці PersistentVolumes відповідали шаблонам PersistentVolumeClaim, які визначає StatefulSet.
{{< /note >}}

## {{% heading "objectives" %}}

StatefulSets призначені для використання з застосунками, які зберігаються свій стан, та розподіленими системами. Однак, адміністрування стану застосунків та розподілених систем у Kubernetes є широкою та складною темою. Щоб продемонструвати базові можливості StatefulSet і не змішувати першу тему з другою, ви розгорнете простий вебзастосунок за допомогою StatefulSet.

Після цього уроку ви будете знайомі з наступним.

* Як створити StatefulSet
* Як StatefulSet керує своїми Podʼами
* Як видалити StatefulSet
* Як масштабувати StatefulSet
* Як оновлювати Podʼи StatefulSet

<!-- lessoncontent -->

## Створення StatefulSet {#creating-a-statefulset}

Почніть зі створення StatefulSet (і Service, на який він спирається) за допомогою
наведеного нижче прикладу. Він схожий на приклад, наведений у концепції [StatefulSets](/docs/concepts/workloads/controllers/statefulset/). Він створює [headless Service](/docs/concepts/services-networking/service/#headless-services), `nginx`, щоб опублікувати IP-адреси Podʼів у StatefulSet, `web`.

{{% code_sample file="application/web/web.yaml" %}}

Вам знадобляться принаймні два термінали. У першому терміналі використовуйте [`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) для спостереження ({{< glossary_tooltip text="watch" term_id="watch" >}}) за створенням Podʼів StatefulSet.

```shell
# використовуйте цей термінал для виконання команд із зазначенням --watch
# завершіть цей watch, коли вам буде запропоновано розпочати новий watch
kubectl get pods --watch -l app=nginx
```

У другому терміналі використовуйте [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) для створення headless Service та StatefulSet:

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```

```none
service/nginx created
statefulset.apps/web created
```

Наведена вище команда створює два Podʼи, кожен з яких запускає вебсервер [NGINX](https://www.nginx.com). Отримайте інформацію про `nginx` Service…

```shell
kubectl get service nginx
```

```none
NAME      TYPE         CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
nginx     ClusterIP    None         <none>        80/TCP    12s
```

…потім отримайте інформацію про `web` StatefulSet, щоб переконатися, що обидва були створені успішно:

```shell
kubectl get statefulset web
```

```none
NAME   READY   AGE
web    2/2     37s
```

### Упорядковане створення Podʼів {#ordered-pod-creation}

Типово StatefulSet створює свої Podʼи в строгому порядку.

Для StatefulSet з _n_ репліками, коли Podʼи розгортаються, вони створюються послідовно, впорядковані від _{0..n-1}_. Перегляньте вивід команди `kubectl get` у першому терміналі. Зрештою вивід буде виглядати як у наведеному нижче прикладі.

```shell
# Не починайте новий watch;
# це вже повинно працювати
kubectl get pods --watch -l app=nginx
```

```none
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         19s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

Зверніть увагу, що Pod `web-1` не запускається, поки Pod `web-0` не буде _Running_ (див. [Фази Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)) та _Ready_ (див. `type` у [Стани Pod](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)).

Пізніше в цьому підручнику ви будете практикувати [паралельний запуск](#parallel-pod-management).

{{< note >}}
Щоб налаштувати цілочисельний порядковий номер, призначений кожному Pod у StatefulSet, дивіться [Початковий порядковий номер](/docs/concepts/workloads/controllers/statefulset/#start-ordinal).
{{< /note >}}

## Podʼи в StatefulSet {#pods-in-a-statefulset}

Podʼи в StatefulSet мають унікальний порядковий індекс та стабільну мережеву ідентичність.

### Перевірка порядкового індексу Podʼів

Отримайте Podʼи StatefulSet:

```shell
kubectl get pods -l app=nginx
```

```none
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m
```

Як зазначено в концепції [StatefulSets](/docs/concepts/workloads/controllers/statefulset/), Podʼи в StatefulSet мають фіксовану, унікальну ідентичність. Ця ідентичність базується на унікальному порядковому індексі, який призначається кожному Podʼу контролером StatefulSet {{< glossary_tooltip term_id="controller" text="controller">}}. Імена Podʼів приймають форму `<імʼя statefulset>-<порядковий індекс>`. Оскільки StatefulSet `web` має дві репліки, він створює два Podʼи, `web-0` та `web-1`.

### Використання стабільних мережевих ідентичностей {#using-stable-network-identities}

Кожен Pod має стабільне імʼя хосту на основі свого порядкового індексу. Використовуйте [`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec) для виконання команди `hostname` в кожному Podʼі:

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'hostname'; done
```

```none
web-0
web-1
```

Використайте [`kubectl run`](/docs/reference/generated/kubectl/kubectl-commands/#run) для запуску контейнера, який надає команду `nslookup` з пакунка `dnsutils`. Використовуючи `nslookup` з іменами хостів Podʼів, ви можете переглянути їх внутрішні адреси DNS:

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```

що запускає нову оболонку. У цій новій оболонці запустіть:

```shell
# Виконайте це в оболонці контейнера dns-test
nslookup web-0.nginx
```

Вивід схожий на:

```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.6

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.6
```

(і тепер вийдіть з оболонки контейнера: `exit`)

CNAME headless сервісу вказує на SRV записи (один для кожного Podʼа, який виконується та готовий). SRV записи вказують на записи A, які містять IP-адреси Podʼів.

У одному терміналі спостерігайте за Podʼами StatefulSet:

```shell
# Розпочніть новий watch
# Завершіть цей watch, коли бачите, що видалення завершено
kubectl get pod --watch -l app=nginx
```

У другому терміналі використовуйте [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) для видалення всіх Podʼів у StatefulSet:

```shell
kubectl delete pod -l app=nginx
```

```none
Pod "web-0" видалено
Pod "web-1" видалено
```

Чекайте, поки StatefulSet перезапустить їх, і обидва Podʼи перейдуть до стану Running та Ready:

```shell
# Це вже має працювати
kubectl get pod --watch -l app=nginx
```

```none
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

Використовуйте `kubectl exec` та `kubectl run`, щоб переглянути імена хостів Podʼів та внутрішні
DNS-записи. Спочатку перегляньте імена хостів Podʼів:

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
```

```none
web-0
web-1
```

потім, запустіть:

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```

що запускає новиe оболонку. У цій новій оболонці запустіть:

```shell
# Виконайте це в оболонці контейнера dns-test
nslookup web-0.nginx
```

Вивід схожий на:

```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-0.nginx
Address 1: 10.244.1.7

nslookup web-1.nginx
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      web-1.nginx
Address 1: 10.244.2.8
```

(і тепер вийдіть з оболонки контейнера: `exit`)

Порядкові номери, імена хостів Podʼів, SRV записи та імена записів A не змінилися, але IP-адреси, повʼязані з Podʼами, можуть змінюватися. У кластері, який використовується для цього навчального посібника, вони змінюються. Тому важливо не налаштовувати інші застосунки на підʼєднання до Podʼів у StatefulSet за IP-адресою конкретного Podʼа (можна підключатися до Podʼів, за їх іменем хосту).

#### Виявлення конкретних Podʼів у StatefulSet {#discovery-for-specific-pods-in-a-statefulset}

Якщо вам потрібно знайти та підʼєднатись до активних учасників StatefulSet, вам слід запитувати CNAME headless Service (`nginx.default.svc.cluster.local`). SRV записи, повʼязані з CNAME, будуть містити лише Podʼ у StatefulSet, які виконуються та готові.

Якщо ваш застосунок вже реалізував логіку підʼєднання, яка перевіряє працездатність та готовність, ви можете використовувати SRV записи Podʼів (`web-0.nginx.default.svc.cluster.local`, `web-1.nginx.default.svc.cluster.local`), оскільки вони стабільні, і ваш застосунок зможе виявляти адреси Podʼів, коли вони переходять до стану Running та Ready.

Якщо ваш застосунок хоче знайти будь-який здоровий Pod у StatefulSet і, отже, не потрібно відстежувати кожний конкретний Pod, ви також можете підʼєднатись до IP-адреси `type: ClusterIP` сервісу, Podʼів в цьому StatefulSet. Ви можете використовувати той самий Service, який відстежує StatefulSet (вказаний у `serviceName` StatefulSet) або окремий Service, який вибирає відповідний набір Podʼів.

### Запис у стійке сховище {#writing-to-stable-storage}

Отримайте PersistentVolumeClaims для `web-0` та `web-1`:

```shell
kubectl get pvc -l app=nginx
```

Вивід схожий на:

```none
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s
```

Контролер StatefulSet створив два {{< glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" >}}, які привʼязані до двох {{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}.

Оскільки кластер, використаний у цьому посібнику, налаштований на динамічну підготовку PersistentVolumes, PersistentVolumes були створені та привʼязані автоматично.

NGINX вебсервер типово обслуговує індексний файл із `/usr/share/nginx/html/index.html`. Поле `volumeMounts` в `spec` StatefulSet забезпечує, що тека `/usr/share/nginx/html` є зберігається у PersistentVolume.

Запишіть імена хостів Podʼів у їх файли `index.html` та перевірте, що вебсервери NGINX обслуговують імена хостів:

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'echo "$(hostname)" > /usr/share/nginx/html/index.html'; done

for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```none
web-0
web-1
```

{{< note >}}
Якщо замість цього ви бачите відповіді **403 Forbidden** для вищезазначеної команди curl, вам потрібно виправити дозволи для теки, змонтованого `volumeMounts` (через [помилку під час використання томів hostPath](https://github.com/kubernetes/kubernetes/issues/2630)),
запустивши:

`for i in 0 1; do kubectl exec web-$i -- chmod 755 /usr/share/nginx/html; done`

перш ніж повторити команду `curl` вище.
{{< /note >}}

У одному терміналі спостерігайте за Podʼами StatefulSet:

```shell
# Завершіть цей watch, коли ви дійдете до кінця розділу.
# На початку "Scaling a StatefulSet" ви розпочнете новий watch.
kubectl get pod --watch -l app=nginx
```

У другому терміналі видаліть всі Podʼи StatefulSet:

```shell
kubectl delete pod -l app=nginx
```

```none
pod "web-0" deleted
pod "web-1" deleted
```

Дослідіть вивід команди `kubectl get` у першому терміналі та зачекайте, поки всі Podʼи перейдуть до стану Running та Ready.

```shell
# Це вже має працювати
kubectl get pod --watch -l app=nginx
```

```none
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

Перевірте, чи продовжують вебсервери обслуговувати свої імена хостів:

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```none
web-0
web-1
```

Навіть якщо `web-0` та `web-1` переплановані, вони продовжують обслуговувати свої імена хостів, оскільки PersistentVolumes, повʼязані з їхніми PersistentVolumeClaims, знову монтується до їхніх `volumeMounts`. Незалежно від того, на якому вузлі заплановані `web-0` та `web-1`, їхні PersistentVolumes будуть підключені до відповідних точок монтування.

## Масштабування StatefulSet {#scaling-a-statefulset}

Масштабування StatefulSet передбачає збільшення або зменшення кількості реплік (горизонтальне масштабування). Це досягається шляхом оновлення поля `replicas`. Ви можете використовувати або [`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale), або [`kubectl patch`](/docs/reference/generated/kubectl/kubectl-commands/#patch), щоб масштабувати StatefulSet.

### Збільшення масштабу {#scaling-up}

Збільшення масштабу означає додавання додаткових реплік. Забезпечивши те, що ваш застосунок може розподіляти роботу між StatefulSet, новий більший набір Podʼів може виконувати більше цієї роботи.

У одному вікні термінала спостерігайте за Podʼами у StatefulSet:

```shell
# Якщо у вас вже запущений watch, ви можете продовжити його використовувати.
# В іншому випадку запустіть один.
# Закінчіть цей watch, коли для StatefulSet буде 5 справних Podʼів
kubectl get pods --watch -l app=nginx
```

У іншому вікні термінала використовуйте `kubectl scale`, щоб змінити кількість реплік на 5:

```shell
kubectl scale sts web --replicas=5
```

```none
statefulset.apps/web scaled
```

Дослідіть вивід команди `kubectl get` у першому терміналі та зачекайте, доки три додаткові Podʼи перейдуть у стан Running та Ready.

```shell
# Це вже має працювати
kubectl get pod --watch -l app=nginx
```

```none
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2h
web-1     1/1       Running   0          2h
NAME      READY     STATUS    RESTARTS   AGE
web-2     0/1       Pending   0          0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       ContainerCreating   0         0s
web-3     1/1       Running   0         18s
web-4     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-4     0/1       ContainerCreating   0         0s
web-4     1/1       Running   0         19s
```

Контролер StatefulSet змінив кількість реплік. Як і при [створенні StatefulSet](#ordered-pod-creation), контролер StatefulSet створював кожен Pod послідовно з урахуванням його порядкового індексу, і чекав, доки попередній Pod перейде у стан Running та Ready перед запуском наступного Podʼа.

### Зменшення масштабу {#scaling-down}

Зменшення масштабу означає зменшення кількості реплік. Наприклад, ви можете це зробити через те, що рівень трафіку до служби зменшився, і на поточному масштабі є ресурси, що простоюють.

У одному вікні термінала спостерігайте за Podʼами у StatefulSet:

```shell
# Закінчіть цей watch, коли лишиться лише 3 Podʼи для StatefulSet
kubectl get pod --watch -l app=nginx
```

У іншому вікні термінала використовуйте `kubectl patch`, щоб зменшити кількість реплік StatefulSet до трьох:

```shell
kubectl patch sts web -p '{"spec":{"replicas":3}}'
```

```none
statefulset.apps/web patched
```

Зачекайте, доки `web-4` і `web-3` перейдуть у стан Terminating.

```shell
# Це вже має працювати
kubectl get pods --watch -l app=nginx
```

```none
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3h
web-1     1/1       Running             0          3h
web-2     1/1       Running             0          55s
web-3     1/1       Running             0          36s
web-4     0/1       ContainerCreating   0          18s
NAME      READY     STATUS    RESTARTS   AGE
web-4     1/1       Running   0          19s
web-4     1/1       Terminating   0         24s
web-4     1/1       Terminating   0         24s
web-3     1/1       Terminating   0         42s
web-3     1/1       Terminating   0         42s
```

### Послідовне завершення Podʼів {#ordered-pod-termination}

Панель управління видаляє кожний Pod по одному, у зворотньому порядку щодо його порядкового індексу, і чекає, доки кожен Pod повністю не зупиниться перед видаленням наступного.

Отримайте PersistentVolumeClaims StatefulSet:

```shell
kubectl get pvc -l app=nginx
```

```none
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-2   Bound     pvc-e1125b27-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-3   Bound     pvc-e1176df6-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-4   Bound     pvc-e11bb5f8-b508-11e6-932f-42010a800002   1Gi        RWO           13h
```

Ще існують пʼять PersistentVolumeClaims та пʼять PersistentVolumes. Під час дослідження [стабільного сховища](#writing-to-stable-storage) Podʼа, ви бачили, що PersistentVolumes, змонтовані у Podʼи StatefulSet, не видаляються, коли Podʼи StatefulSet видаляються. Це також вірно, коли видалення Podʼів викликано зменшенням масштабу StatefulSet.

### Оновлення StatefulSets {#updating-statefulsets}

Контролер StatefulSet підтримує автоматизоване оновлення. Стратегія, яка використовується, визначається полем `spec.updateStrategy` обʼєкта API StatefulSet. Ця функція може бути використана для оновлення образів контейнерів, запитів ресурсів та/або лімітів, міток та анотацій Podʼів у StatefulSet.

Існують дві стратегії оновлення: `RollingUpdate` (типово) та `OnDelete`.

### RollingUpdate {#rolling-update}

Стратегія оновлення `RollingUpdate` оновлює всі Podʼи в StatefulSet у зворотньому порядку щодо їх порядкового індексу, з дотриманням гарантій StatefulSet.

Ви можете розділити оновлення StatefulSet, який використовує стратегію `RollingUpdate`, на _партиції_, вказавши `.spec.updateStrategy.rollingUpdate.partition`. Ви будете практикувати це пізніше у цьому посібнику.

Спочатку спробуйте просте поетапне оновлення.

В одному вікні термінала відредагуйте StatefulSet `web`, щоб знову змінити образ контейнера:

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.24"}]'
```

```none
statefulset.apps/web patched
```

В іншому терміналі спостерігайте за Podʼами у StatefulSet:

```shell
# Закінчіть це спостереження, коли відбудеться розгортання
#
# Якщо ви не впевнені, залиште його ще на одну хвилину
kubectl get pod -l app=nginx --watch
```

Вивід буде подібний до:

```none
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          7m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          8m
web-2     1/1       Terminating   0         8m
web-2     1/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Terminating   0         8m
web-2     0/1       Pending   0         0s
web-2     0/1       Pending   0         0s
web-2     0/1       ContainerCreating   0         0s
web-2     1/1       Running   0         19s
web-1     1/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Terminating   0         8m
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         6s
web-0     1/1       Terminating   0         7m
web-0     1/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Terminating   0         7m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         10s
```

Podʼи в StatefulSet оновлюються у зворотньому порядку щодо їх порядкового індексу. Контролер StatefulSet завершує кожен Pod і чекає, доки він не перейде в стан Running та Ready, перед тим як оновити наступний Pod. Зверніть увагу, що, навіть якщо контролер StatefulSet не продовжить оновлювати наступний Pod, поки його порядковий наступник не буде Running та Ready, він відновить будь-який Pod, який зазнав помилки під час оновлення до попередньої версії.

Podʼи, які вже отримали оновлення, будуть відновлені до оновленої версії, а Podʼи, які ще не отримали оновлення, будуть відновлені до попередньої версії. Таким чином, контролер намагається продовжувати забезпечувати працездатність застосунку та зберігати оновлення в однорідному стані при наявності тимчасових збоїв.

Отримайте Podʼи, щоб переглянути їх образи контейнерів:

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```

```none
registry.k8s.io/nginx-slim:0.24
registry.k8s.io/nginx-slim:0.24
registry.k8s.io/nginx-slim:0.24

```

Всі Podʼи в StatefulSet зараз використовують попередній образ контейнера.

{{< note >}}
Ви також можете використовувати `kubectl rollout status sts/<name>` для перегляду стану поетапного оновлення StatefulSet
{{< /note >}}

#### Підготовка оновлення {#staging-an-update}

Ви можете розбити оновлення StatefulSet, який використовує стратегію `RollingUpdate`, на _розділи_, вказавши `.spec.updateStrategy.rollingUpdate.partition`.

Для отримання додаткового контексту ви можете прочитати [Поточні оновлення частинами](/docs/concepts/workloads/controllers/statefulset/#partitions) на сторінці концепції StatefulSet.

Ви можете підготувати оновлення StatefulSet, використовуючи поле `partition` всередині `.spec.updateStrategy.rollingUpdate`. Для цього оновлення ви залишите наявні Podʼи в StatefulSet без змін, поки змінюєте шаблон Podʼа для StatefulSet. Потім ви (або, це поза цим навчальним посібником, якась зовнішня автоматизація) можете запустити це підготовлене оновлення.

Спочатку виправте StatefulSet `web`, щоб додати розділ до поля `updateStrategy`:

```shell
# Значення "partition" визначає, до яких порядкових номерів застосовується зміна
# Переконайтеся, що використовуєте число, більше, ніж останній порядковий номер для
# StatefulSet
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":3}}}}'
```

```none
statefulset.apps/web patched
```

Знову виправте StatefulSet, щоб змінити образ контейнера, який використовує цей StatefulSet:

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.21"}]'
```

```none
statefulset.apps/web patched
```

Видаліть Pod у StatefulSet:

```shell
kubectl delete pod web-2
```

```none
pod "web-2" deleted
```

Зачекайте, поки замінений Pod `web-2` буде запущений і готовий:

```shell
# Закінчіть перегляд, коли побачите, що web-2 справний
kubectl get pod -l app=nginx --watch
```

```none
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

Отримайте образ контейнера Podʼа:

```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```

```none
registry.k8s.io/nginx-slim:0.24
```

Зверніть увагу, що, навіть якщо стратегія оновлення — `RollingUpdate`, StatefulSet відновив Pod з початковим образом контейнера. Це тому, що порядковий номер Podʼа менше, ніж `partition`, вказаний у `updateStrategy`.

#### Канаркове оновлення {#rolling-out-a-canary}

Тепер ви спробуєте [канаркове оновлення](https://glossary.cncf.io/canary-deployment/) цієї підготовленої зміни.

Ви можете виконати канаркове оновлення (для тестування зміненого шаблону) шляхом зменшення `partition`, який ви вказали [вище](#staging-an-update).

Виправте StatefulSet, щоб зменшити розділ:

```shell
# Значення "partition" повинно відповідати найвищому існуючому порядковому номеру для
# StatefulSet
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
```

```none
statefulset.apps/web patched
```

Панель управління спровокує заміну для `web-2` (реалізовану через належне **видалення**, а потім створення нового Podʼа, як тільки видалення завершиться). Зачекайте, поки новий Pod `web-2` буде запущений і готовий.

```shell
# Це вже має бути запущено
kubectl get pod -l app=nginx --watch
```

```none
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          4m
web-1     1/1       Running             0          4m
web-2     0/1       ContainerCreating   0          11s
web-2     1/1       Running   0         18s
```

Отримайте інформацію про контейнер Podʼа:

```shell
kubectl get pod web-2 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```

```none
registry.k8s.io/nginx-slim:0.21
```

Коли ви змінили `partition`, контролер StatefulSet автоматично оновив Pod `web-2`, оскільки порядковий номер Podʼа був більшим або рівним `partition`.

Видаліть Pod `web-1`:

```shell
kubectl delete pod web-1
```

```none
pod "web-1" deleted
```

Зачекайте, поки Pod `web-1` буде запущений і готовий.

```shell
# Це вже має бути запущено
kubectl get pod -l app=nginx --watch
```

Вивід подібний до:

```none
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Running       0          6m
web-1     0/1       Terminating   0          6m
web-2     1/1       Running       0          2m
web-1     0/1       Terminating   0         6m
web-1     0/1       Terminating   0         6m
web-1     0/1       Terminating   0         6m
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         18s
```

Отримайте образ контейнера Podʼа `web-1`:

```shell
kubectl get pod web-1 --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'
```

```none
registry.k8s.io/nginx-slim:0.24
```

`web-1` був відновлений до своєї початкової конфігурації, тому що порядковий номер Podʼа був меншим за `partition`. Коли вказано `partition`, всі Podʼи з порядковим номером, який більше або дорівнює `partition`, будуть оновлені, коли буде оновлено `.spec.template` StatefulSet. Якщо Pod з порядковим номером, який менший за `partition`, буде видалений або інакше припинений, він буде відновлено до початкової конфігурації.

#### Поступові оновлення {#phased-roll-outs}

Ви можете виконати поступове оновлення (наприклад, лінійне, геометричне або експоненціальне оновлення) за допомогою розділеного оновлення з аналогічним методом до того, як ви впровадили [канаркове оновлення](#rolling-out-a-canary). Щоб виконати поступове оновлення, встановіть `partition` на порядковий номер, на якому ви хочете, щоб контролер призупинив оновлення.

Розділ в цей момент встановлено на `2`. Встановіть розділ на `0`:

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}}}}'
```

```none
statefulset.apps/web patched
```

Зачекайте, поки всі Podʼи в StatefulSet стануть запущеними і готовими.

```shell
# Це вже має бути запущено
kubectl get pod -l app=nginx --watch
```

Вивід подібний до:

```none
NAME      READY     STATUS              RESTARTS   AGE
web-0     1/1       Running             0          3m
web-1     0/1       ContainerCreating   0          11s
web-2     1/1       Running             0          2m
web-1     1/1       Running   0         18s
web-0     1/1       Terminating   0         3m
web-0     1/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Terminating   0         3m
web-0     0/1       Pending   0         0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         3s
```

Отримайте деталі образу контейнера для Podʼів у StatefulSet:

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```

```none
registry.k8s.io/nginx-slim:0.21
registry.k8s.io/nginx-slim:0.21
registry.k8s.io/nginx-slim:0.21
```

Переміщуючи `partition` на `0`, ви дозволили StatefulSet продовжити процес оновлення.

### OnDelete {#on-delete}

Ви обираєте цю стратегію оновлення для StatefulSet, встановивши `.spec.template.updateStrategy.type` на `OnDelete`.

Виправте StatefulSet `web`, щоб використовувати стратегію оновлення `OnDelete`:

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"OnDelete", "rollingUpdate": null}}}'
```

```none
statefulset.apps/web patched
```

Коли ви обираєте цю стратегію оновлення, контролер StatefulSet не автоматично оновлює Podʼи, коли вноситься зміна до поля `.spec.template` StatefulSet. Вам потрібно керувати оновленням самостійно — або вручну, або за допомогою окремої автоматизації.

## Видалення StatefulSet {#deleting-statefulset}

StatefulSet підтримує як _не каскадне_, так і _каскадне_ видалення. При не каскадному **видаленні** Podʼи StatefulSet не видаляються при видаленні самого StatefulSet. При каскадному **видаленні** видаляються як StatefulSet, так і його Podʼи.

Прочитайте [Використання каскадного видалення у кластері](/docs/tasks/administer-cluster/use-cascading-deletion/), щоб дізнатися про каскадне видалення загалом.

### Некаскадне видалення {#non-cascading-delete}

В одному вікні термінала спостерігайте за Podʼами у StatefulSet.

```shell
# Завершіть цей перегляд, коли не буде Podʼів для StatefulSet
kubectl get pods --watch -l app=nginx
```

Використовуйте [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete), щоб видалити StatefulSet. Переконайтеся, що ви передали параметр `--cascade=orphan` до команди. Цей параметр повідомляє Kubernetes видаляти лише StatefulSet, і **не** видаляти жодного з його Podʼів.

```shell
kubectl delete statefulset web --cascade=orphan
```

```none
statefulset.apps "web" deleted
```

Отримайте Podʼи, щоб перевірити їх статус:

```shell
kubectl get pods -l app=nginx
```

```none
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          6m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          5m
```

Навіть якщо `web` був видалений, всі Podʼи все ще запущені і готові. Видаліть `web-0`:

```shell
kubectl delete pod web-0
```

```none
pod "web-0" deleted
```

Отримайте Podʼи StatefulSet:

```shell
kubectl get pods -l app=nginx
```

```none
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          10m
web-2     1/1       Running   0          7m
```

Оскільки StatefulSet `web` було видалено, `web-0` не було перезапущено.

В одному терміналі спостерігайте за Podʼами StatefulSet.

```shell
# Залиште цей перегляд запущеним до наступного разу, коли ви почнете перегляд
kubectl get pods --watch -l app=nginx
```

У другому терміналі створіть знову StatefulSet. Зверніть увагу, якщо ви не видалили `nginx` Service (що ви не повинні були робити), ви побачите помилку, яка вказує, що Service вже існує.

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```

```none
statefulset.apps/web created
service/nginx unchanged
```

Ігноруйте помилку. Вона лише вказує на те, що була спроба створити headless Service _nginx_, незважаючи на те, що цей Service вже існує.

Дослідіть вихідні дані команди `kubectl get`, яка працює у першому терміналі.

```shell
# Це вже має бути запущено
kubectl get pods --watch -l app=nginx
```

```none
NAME      READY     STATUS    RESTARTS   AGE
web-1     1/1       Running   0          16m
web-2     1/1       Running   0          2m
NAME      READY     STATUS    RESTARTS   AGE
web-0     0/1       Pending   0          0s
web-0     0/1       Pending   0         0s
web-0     0/1       ContainerCreating   0         0s
web-0     1/1       Running   0         18s
web-2     1/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
web-2     0/1       Terminating   0         3m
```

Коли StatefulSet `web` був відновлений, він спочатку перезапустив `web-0`. Оскільки `web-1` вже був запущений і готовий, коли `web-0` перейшов до стану Running і Ready, він став резервним для цього Podʼа. Оскільки ви відновили StatefulSet з `replicas` рівним 2, як тільки `web-0` був відновлений, і як тільки `web-1` вже був визначений як Running і Ready, `web-2` був закінчений.

Тепер ще раз розгляньте вміст файлу `index.html`, який обслуговують вебсервери Podʼів:

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```none
web-0
web-1
```

Навіть якщо ви видалили як StatefulSet, так і Pod `web-0`, він все ще обслуговує імʼя хоста, яке спочатку було введено в його файл `index.html`. Це тому, що StatefulSet ніколи не видаляє PersistentVolumes, повʼязані з Podʼом. Коли ви відновили StatefulSet і перезапустили `web-0`, його оригінальний PersistentVolume знову змонтувався.

### Каскадне видалення {#cascading-delete}

В одному вікні термінала спостерігайте за Podʼами у StatefulSet.

```shell
# Залиште це запущеним до наступного розділу сторінки
kubectl get pods --watch -l app=nginx
```

В іншому терміналі знову видаліть StatefulSet. Цього разу не використовуйте параметр `--cascade=orphan`.

```shell
kubectl delete statefulset web
```

```none
statefulset.apps "web" deleted
```

Дослідіть вихідні дані команди `kubectl get`, яка працює у першому терміналі, і зачекайте, поки всі Podʼи перейдуть у стан Terminating.

```shell
# Це вже має бути запущено
kubectl get pods --watch -l app=nginx
```

```none
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          11m
web-1     1/1       Running   0          27m
NAME      READY     STATUS        RESTARTS   AGE
web-0     1/1       Terminating   0          12m
web-1     1/1       Terminating   0         29m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-0     0/1       Terminating   0         12m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m
web-1     0/1       Terminating   0         29m

```

Як ви бачили в розділі [Зменшення мастабу](#scaling-down), Podʼи видаляються по одному, з урахуванням зворотного порядку їх порядкових індексів. Перед видаленням Podʼа контролер StatefulSet чекає, поки Pod-наступник буде повністю видалено.

{{< note >}}
Хоча каскадне видалення видаляє StatefulSet разом з його Podʼами, каскад **не** видаляє headless Service, повʼязаний з StatefulSet. Ви повинні видалити Service `nginx` вручну.
{{< /note >}}

```shell
kubectl delete service nginx
```

```none
service "nginx" deleted
```

Знову створіть StatefulSet і headless Service:

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```

```none
service/nginx created
statefulset.apps/web created
```

Коли всі Podʼи StatefulSet перейдуть у стан Running і Ready, отримайте вміст їх файлів `index.html`:

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```none
web-0
web-1
```

Навіть якщо ви повністю видалили StatefulSet і всі його Podʼи, Podʼи перестворюються з монтуванням їх PersistentVolumes, і `web-0` й `web-1` продовжують обслуговувати свої імена хостів.

Нарешті, видаліть Service `nginx`…

```shell
kubectl delete service nginx
```

```none
service "nginx" deleted
```

…і StatefulSet `web`:

```shell
kubectl delete statefulset web
```

```none
statefulset "web" deleted
```

### Політика управління Podʼами {#pod-management-policy}

Для деяких розподілених систем порядок, гарантований StatefulSet, є непотрібним або небажаним. Ці системи потребують лише унікальності та ідентичності.

Ви можете вказати [політику управління Podʼами](/docs/concepts/workloads/controllers/statefulset/#pod-management-policies), щоб уникнути цього строгого порядку; або `OrderedReady` (типово), або `Parallel`.

### Політика управління Podʼами OrderedReady {#orderedready-pod-management}

Управління Podʼами `OrderedReady` є стандартним значенням для StatefulSet. Воно каже контролеру StatefulSet дотримуватися гарантій порядку, показаних вище.

Використовуйте цей параметр, коли ваш застосунок вимагає або очікує, що зміни, такі як запуск нової версії вашого застосунку, відбуваються у строгому порядку за порядковим номером (номером Pod), який надає StatefulSet. Іншими словами, якщо у вас є Podʼи `app-0`, `app-1` та `app-2`, Kubernetes оновить `app-0` першим і перевірить його. Якщо перевірка пройшла успішно, Kubernetes оновить `app-1`, а потім `app-2`.

Якщо ви додали ще два Podʼи, Kubernetes налаштує `app-3` та почекає, доки він не стане справним, перед тим як розгорнути `app-4`.

Оскільки це стандартне налаштування, ви вже практикували його використання.

### Політика управління Podʼами Parallel {#parallel-pod-management}

Альтернатива, управління Podʼами `Parallel`, каже контролеру StatefulSet запускати або видаляти всі Podʼи паралельно, і не чекати, поки Podʼи не стануть `Running` і `Ready` або повністю видаленими перед запуском або видаленням іншого Podʼа.

Опція управління Podʼами `Parallel` впливає лише на поведінку при масштабуванні. Оновлення не піддаються впливу; Kubernetes все ще впроваджує зміни по черзі. Для цього навчального посібника застосунок дуже простий: вебсервер, який повідомляє вам його імʼя хосту (тому що це StatefulSet, імʼя хосту для кожного Podʼа є різним і передбачуваним).

{{% code_sample file="application/web/web-parallel.yaml" %}}

Цей маніфест ідентичний тому, який ви завантажили вище, за винятком того, що `.spec.podManagementPolicy` StatefulSet `web` встановлено на `Parallel`.

В одному терміналі спостерігайте за Podʼами в StatefulSet.

```shell
# Залиште це запущеним до кінця розділу
kubectl get pod -l app=nginx --watch
```

В іншому терміналі змініть конфігурацію StatefulSet на управління Podʼами `Parallel`:

```shell
kubectl apply -f https://k8s.io/examples/application/web/web-parallel.yaml
```

```none
service/nginx updated
statefulset.apps/web updated
```

Залиште відкритим термінал, де ви запустили спостереження. У іншому вікні терміналу масштабуйте StatefulSet:

```shell
kubectl scale statefulset/web --replicas=5
```

```none
statefulset.apps/web scaled
```

Дослідіть вихідні дані терміналу, де запущена команда `kubectl get`. Вони можуть виглядати приблизно так

```none
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         0s
web-3     0/1       Pending   0         7s
web-3     0/1       ContainerCreating   0         7s
web-2     0/1       Pending   0         0s
web-4     0/1       Pending   0         0s
web-2     1/1       Running   0         8s
web-4     0/1       ContainerCreating   0         4s
web-3     1/1       Running   0         26s
web-4     1/1       Running   0         2s
```

StatefulSet запустив три нові Podʼи, і він не чекав, поки перший стане Running і Ready перед запуском другого і третього Podʼів.

Цей підхід є корисним, якщо ваше робоче навантаження зберігає стан або Podʼи мають можливість ідентифікувати один одного за передбачуваною назвою, особливо якщо вам іноді потрібно швидко надати більше потужності. Якщо цей простий вебсервіс для навчального посібника раптово отримав додаткові 1,000,000 запитів на хвилину, то ви хотіли б запустити додаткові Podʼи — але ви також не хотіли б чекати, поки кожен новий Pod буде запущений. Запуск додаткових Podʼів паралельно скорочує час між запитом на додаткову потужність і її доступністю для використання.

## {{% heading "cleanup" %}}

У вас маєть бути два термінали, готові для запуску команд `kubectl` для проведення очищення.

```shell
kubectl delete sts web
# sts - скорочення для statefulset
```

Ви можете відстежувати виконання команди `kubectl get`, щоб переглянути видалення цих ресурсів.

```shell
# завершіть перегляд, коли побачите необхідне
kubectl get pod -l app=nginx --watch
```

```none
web-3     1/1       Terminating   0         9m
web-2     1/1       Terminating   0         9m
web-3     1/1       Terminating   0         9m
web-2     1/1       Terminating   0         9m
web-1     1/1       Terminating   0         44m
web-0     1/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-3     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-1     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-2     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-2     0/1       Terminating   0         9m
web-1     0/1       Terminating   0         44m
web-1     0/1       Terminating   0         44m
web-1     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-0     0/1       Terminating   0         44m
web-3     0/1       Terminating   0         9m
web-3     0/1       Terminating   0         9m
web-3     0/1       Terminating   0         9m
```

Під час видалення StatefulSet видаляються всі Podʼи одночасно; не чекаючи завершення роботи наступного Podʼа у черзі.

Закрийте термінал, де виконується команда `kubectl get`, та видаліть Service `nginx`:

```shell
kubectl delete svc nginx
```

Видаліть носій постійного зберігання для PersistentVolumes, що використовувалися в цьому посібнику.

```shell
kubectl get pvc
```

```none
NAME        STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
www-web-0   Bound    pvc-2bf00408-d366-4a12-bad0-1869c65d0bee   1Gi        RWO            standard       25m
www-web-1   Bound    pvc-ba3bfe9c-413e-4b95-a2c0-3ea8a54dbab4   1Gi        RWO            standard       24m
www-web-2   Bound    pvc-cba6cfa6-3a47-486b-a138-db5930207eaf   1Gi        RWO            standard       15m
www-web-3   Bound    pvc-0c04d7f0-787a-4977-8da3-d9d3a6d8d752   1Gi        RWO            standard       15m
www-web-4   Bound    pvc-b2c73489-e70b-4a4e-9ec1-9eab439aa43e   1Gi        RWO            standard       14m
```

```shell
kubectl get pv
```

```none
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM               STORAGECLASS   REASON   AGE
pvc-0c04d7f0-787a-4977-8da3-d9d3a6d8d752   1Gi        RWO            Delete           Bound    default/www-web-3   standard                15m
pvc-2bf00408-d366-4a12-bad0-1869c65d0bee   1Gi        RWO            Delete           Bound    default/www-web-0   standard                25m
pvc-b2c73489-e70b-4a4e-9ec1-9eab439aa43e   1Gi        RWO            Delete           Bound    default/www-web-4   standard                14m
pvc-ba3bfe9c-413e-4b95-a2c0-3ea8a54dbab4   1Gi        RWO            Delete           Bound    default/www-web-1   standard                24m
pvc-cba6cfa6-3a47-486b-a138-db5930207eaf   1Gi        RWO            Delete           Bound    default/www-web-2   standard                15m
```

```shell
kubectl delete pvc www-web-0 www-web-1 www-web-2 www-web-3 www-web-4
```

```none
persistentvolumeclaim "www-web-0" deleted
persistentvolumeclaim "www-web-1" deleted
persistentvolumeclaim "www-web-2" deleted
persistentvolumeclaim "www-web-3" deleted
persistentvolumeclaim "www-web-4" deleted
```

```shell
kubectl get pvc
```

```none
No resources found in default namespace.
```

{{< note >}}
Вам також потрібно видалити носій постійне зберігання для PersistentVolumes, що використовувалось в цьому посібнику. Виконайте необхідні дії згідно з вашим середовищем, конфігурацією зберігання та методом надання послуг, щоб забезпечити повторне використання всього сховища.
{{< /note >}}
