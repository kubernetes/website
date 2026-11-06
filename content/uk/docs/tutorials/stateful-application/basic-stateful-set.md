---
title: Основи StatefulSet
content_type: tutorial
weight: 10
---

<!-- overview -->
Цей посібник знайомить із керуванням застосунками за допомогою {{< glossary_tooltip text="StatefulSets" term_id="statefulset" >}}. Він демонструє, як створювати, видаляти, масштабувати та оновлювати Podʼи StatefulSet.

## {{% heading "prerequisites" %}} {#before-you-begin}

Перш ніж розпочати цей посібник, ознайомтеся з такими концепціями Kubernetes:

* [Podʼи](/docs/concepts/workloads/pods/)
* [Cluster DNS](/docs/concepts/services-networking/dns-pod-service/)
* [Headless Services](/docs/concepts/services-networking/service/#headless-services)
* [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)
* [PersistentVolumes Provisioning](/docs/concepts/storage/dynamic-provisioning/)
* Інструмент командного рядка [kubectl](/docs/reference/kubectl/kubectl/)

{{% include "task-tutorial-prereqs.md" %}}
Вам слід налаштувати `kubectl` на використання контексту, який використовує простір імен `default`. Якщо ви використовуєте наявний кластер, переконайтеся, що для практики можна використовувати стандартний простір імен цього кластера. В ідеалі практикуйтеся в кластері, де не працюють реальні робочі навантаження.

Також корисно прочитати сторінку концепції про [StatefulSets](/docs/concepts/workloads/controllers/statefulset/).

{{< alert color="info" title="Примітка" >}}
Цей посібник передбачає, що ваш кластер налаштований на динамічне надання PersistentVolumes. Вам також потрібен [стандартний StorageClass](/docs/concepts/storage/storage-classes/#default-storageclass). Якщо ваш кластер не налаштований на динамічне надання сховища, вам доведеться перед початком цього посібника вручну надати два томи по 1 ГіБ і налаштувати кластер так, щоб ці PersistentVolumes відповідали шаблонам PersistentVolumeClaim, які визначає StatefulSet.
{{< /alert >}}

## {{% heading "objectives" %}} {#objectives}

StatefulSets призначені для використання із застосунками зі станом і розподіленими системами. Однак адміністрування застосунків зі станом і розподілених систем у Kubernetes — широка та складна тема. Щоб продемонструвати базові можливості StatefulSet і не змішувати першу тему з другою, ви розгорнете простий вебзастосунок за допомогою StatefulSet.

Після цього посібника ви будете знайомі з таким.

* Як створити StatefulSet
* Як StatefulSet керує своїми Podʼами
* Як видалити StatefulSet
* Як масштабувати StatefulSet
* Як оновлювати Podʼи StatefulSet

<!-- lessoncontent -->

## Створення StatefulSet {#creating-a-statefulset}

Почніть зі створення StatefulSet (і Service, на який він спирається) за допомогою наведеного нижче прикладу. Він схожий на приклад, наведений у концепції [StatefulSets](/docs/concepts/workloads/controllers/statefulset/). Він створює [headless Service](/docs/concepts/services-networking/service/#headless-services), `nginx`, щоб опублікувати IP-адреси Podʼів у StatefulSet, `web`.

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

```
service/nginx created
statefulset.apps/web created
```

Наведена вище команда створює два Podʼи, у кожному з яких працює вебсервер [NGINX](https://www.nginx.com). Отримайте інформацію про Service `nginx`…

```shell
kubectl get service nginx
```

```
NAME      TYPE         CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
nginx     ClusterIP    None         <none>        80/TCP    12s
```

…потім отримайте інформацію про StatefulSet `web`, щоб переконатися, що обидва створено успішно:

```shell
kubectl get statefulset web
```

```
NAME   READY   AGE
web    2/2     37s
```

### Упорядковане створення Podʼів {#ordered-pod-creation}

Стандартно StatefulSet створює свої Podʼи в суворому порядку.

Для StatefulSet з _n_ репліками під час розгортання Podʼи створюються послідовно, у порядку від _{0..n-1}_. Перегляньте вивід команди `kubectl get` у першому терміналі. Зрештою вивід виглядатиме як у наведеному нижче прикладі.

```shell
# Не починайте новий watch;
# це вже повинно працювати
kubectl get pods --watch -l app=nginx
```

```
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

Зверніть увагу, що Pod `web-1` не запускається, доки Pod `web-0` не буде _Running_ (див. [Фаза Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)) і _Ready_ (див. `type` у розділі [Стани Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)).

Пізніше в цьому посібнику ви спробуєте [паралельний запуск](#parallel-pod-management).

{{< alert color="info" title="Примітка" >}}
Щоб налаштувати цілочисельний порядковий номер, що призначається кожному Podʼу в StatefulSet, див. [Початковий порядковий номер](/docs/concepts/workloads/controllers/statefulset/#start-ordinal).
{{< /alert >}}

## Podʼи в StatefulSet {#pods-in-a-statefulset}

Podʼи в StatefulSet мають унікальний порядковий індекс та стабільну мережеву ідентичність.

### Перевірка порядкового індексу Podʼа {#examining-the-pod-s-ordinal-index}

Отримайте Podʼи StatefulSet:

```shell
kubectl get pods -l app=nginx
```

```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          1m
web-1     1/1       Running   0          1m
```

Як зазначено в концепції [StatefulSets](/docs/concepts/workloads/controllers/statefulset/), Podʼи в StatefulSet мають сталу унікальну ідентичність. Ця ідентичність базується на унікальному порядковому індексі, який кожному Podʼу призначає {{< glossary_tooltip term_id="controller" text="контролер">}} StatefulSet. Імена Podʼів мають вигляд `<імʼя statefulset>-<порядковий індекс>`. Оскільки StatefulSet `web` має дві репліки, він створює два Podʼи: `web-0` і `web-1`.

### Використання стабільних мережевих ідентичностей {#using-stable-network-identities}

Кожен Pod має стабільне імʼя хоста на основі свого порядкового індексу. Використайте [`kubectl exec`](/docs/reference/generated/kubectl/kubectl-commands/#exec), щоб виконати команду `hostname` у кожному Podʼі:

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'hostname'; done
```

```
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

Вивід подібний до:

```
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

CNAME headless Service вказує на записи SRV (по одному для кожного Podʼа в стані Running і Ready). Записи SRV вказують на записи A, які містять IP-адреси Podʼів.

В одному терміналі спостерігайте за Podʼами StatefulSet:

```shell
# Розпочніть новий watch
# Завершіть цей watch, коли бачите, що видалення завершено
kubectl get pod --watch -l app=nginx
```

У другому терміналі використовуйте [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete) для видалення всіх Podʼів у StatefulSet:

```shell
kubectl delete pod -l app=nginx
```

```
pod "web-0" deleted
pod "web-1" deleted
```

Зачекайте, поки StatefulSet перезапустить їх і обидва Podʼи перейдуть у стан Running і Ready:

```shell
# Це вже має працювати
kubectl get pod --watch -l app=nginx
```

```
NAME      READY     STATUS              RESTARTS   AGE
web-0     0/1       ContainerCreating   0          0s
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          2s
web-1     0/1       Pending   0         0s
web-1     0/1       Pending   0         0s
web-1     0/1       ContainerCreating   0         0s
web-1     1/1       Running   0         34s
```

Використовуйте `kubectl exec` та `kubectl run`, щоб переглянути імена хостів Podʼів та внутрішні DNS-записи. Спочатку перегляньте імена хостів Podʼів:

```shell
for i in 0 1; do kubectl exec web-$i -- sh -c 'hostname'; done
```

```
web-0
web-1
```

потім виконайте:

```shell
kubectl run -i --tty --image busybox:1.28 dns-test --restart=Never --rm
```

що запускає нову оболонку. У цій новій оболонці запустіть:

```shell
# Виконайте це в оболонці контейнера dns-test
nslookup web-0.nginx
```

Вивід подібний до:

```
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

Порядкові номери, імена хостів, записи SRV та імена записів A Podʼів не змінилися, але IP-адреси, повʼязані з Podʼами, могли змінитися. У кластері, використаному для цього посібника, вони змінилися. Саме тому важливо не налаштовувати інші застосунки на підключення до Podʼів у StatefulSet за IP-адресою конкретного Podʼа (підключатися до Podʼів, розвʼязуючи їхні імена хостів, можна).

#### Виявлення конкретних Podʼів у StatefulSet {#discovery-for-specific-pods-in-a-statefulset}

Якщо вам потрібно знайти активних учасників StatefulSet і підключитися до них, запитуйте CNAME headless Service (`nginx.default.svc.cluster.local`). Записи SRV, повʼязані з CNAME, міститимуть лише ті Podʼи StatefulSet, що перебувають у стані Running і Ready.

Якщо ваш застосунок уже реалізує логіку підключення, яка перевіряє життєздатність і готовність, ви можете використовувати записи SRV Podʼів (`web-0.nginx.default.svc.cluster.local`, `web-1.nginx.default.svc.cluster.local`), оскільки вони стабільні, і ваш застосунок зможе виявляти адреси Podʼів, коли вони переходитимуть у стан Running і Ready.

Якщо вашому застосунку потрібно знайти будь-який справний Pod у StatefulSet і, отже, не потрібно відстежувати кожен конкретний Pod, ви також можете підключитися до IP-адреси Service `type: ClusterIP`, за яким стоять Podʼи цього StatefulSet. Ви можете використати той самий Service, що відстежує StatefulSet (вказаний у `serviceName` StatefulSet), або окремий Service, який вибирає потрібний набір Podʼів.

### Запис у стабільне сховище {#writing-to-stable-storage}

Отримайте PersistentVolumeClaims для `web-0` та `web-1`:

```shell
kubectl get pvc -l app=nginx
```

Вивід подібний до:

```
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           48s
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           48s
```

Контролер StatefulSet створив два {{< glossary_tooltip text="PersistentVolumeClaims" term_id="persistent-volume-claim" >}}, які привʼязані до двох {{< glossary_tooltip text="PersistentVolumes" term_id="persistent-volume" >}}.

Оскільки кластер, використаний у цьому посібнику, налаштований на динамічне надання PersistentVolumes, PersistentVolumes було створено та привʼязано автоматично.

Вебсервер NGINX стандартно віддає індексний файл з `/usr/share/nginx/html/index.html`. Поле `volumeMounts` у `spec` StatefulSet гарантує, що теку `/usr/share/nginx/html` забезпечує PersistentVolume.

Запишіть імена хостів Podʼів у їх файли `index.html` та перевірте, що вебсервери NGINX обслуговують імена хостів:

```shell
for i in 0 1; do kubectl exec "web-$i" -- sh -c 'echo "$(hostname)" > /usr/share/nginx/html/index.html'; done

for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

{{< alert color="info" title="Примітка" >}}
Якщо натомість ви бачите відповіді **403 Forbidden** на наведену вище команду curl, вам потрібно виправити дозволи для теки, змонтованої `volumeMounts` (через [помилку під час використання томів hostPath](https://github.com/kubernetes/kubernetes/issues/2630)), виконавши:

`for i in 0 1; do kubectl exec web-$i -- chmod 755 /usr/share/nginx/html; done`

перш ніж повторити команду `curl` вище.
{{< /alert >}}

В одному терміналі спостерігайте за Podʼами StatefulSet:

```shell
# Завершіть цей watch, коли ви дійдете до кінця розділу.
# На початку "Scaling a StatefulSet" ви розпочнете новий watch.
kubectl get pod --watch -l app=nginx
```

У другому терміналі видаліть всі Podʼи StatefulSet:

```shell
kubectl delete pod -l app=nginx
```

```
pod "web-0" deleted
pod "web-1" deleted
```

Дослідіть вивід команди `kubectl get` у першому терміналі та зачекайте, поки всі Podʼи перейдуть до стану Running та Ready.

```shell
# Це вже має працювати
kubectl get pod --watch -l app=nginx
```

```
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

```
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

Хоча `web-0` і `web-1` було переплановано, вони продовжують віддавати свої імена хостів, оскільки PersistentVolumes, повʼязані з їхніми PersistentVolumeClaims, знову монтуються до їхніх `volumeMounts`. Незалежно від того, на якому вузлі заплановано `web-0` і `web-1`, їхні PersistentVolumes буде змонтовано у відповідні точки монтування.

## Масштабування StatefulSet {#scaling-a-statefulset}

Масштабування StatefulSet передбачає збільшення або зменшення кількості реплік (горизонтальне масштабування). Це досягається шляхом оновлення поля `replicas`. Ви можете використовувати або [`kubectl scale`](/docs/reference/generated/kubectl/kubectl-commands/#scale), або [`kubectl patch`](/docs/reference/generated/kubectl/kubectl-commands/#patch), щоб масштабувати StatefulSet.

### Збільшення масштабу {#scaling-up}

Збільшення масштабу означає додавання реплік. За умови, що ваш застосунок може розподіляти роботу в межах StatefulSet, новий, більший набір Podʼів зможе виконувати більше цієї роботи.

В одному вікні термінала спостерігайте за Podʼами у StatefulSet:

```shell
# Якщо у вас вже запущений watch, ви можете продовжити його використовувати.
# В іншому випадку запустіть один.
# Закінчіть цей watch, коли для StatefulSet буде 5 справних Podʼів
kubectl get pods --watch -l app=nginx
```

В іншому вікні термінала використовуйте `kubectl scale`, щоб змінити кількість реплік на 5:

```shell
kubectl scale sts web --replicas=5
```

```
statefulset.apps/web scaled
```

Дослідіть вивід команди `kubectl get` у першому терміналі та зачекайте, доки три додаткові Podʼи перейдуть у стан Running та Ready.

```shell
# Це вже має працювати
kubectl get pod --watch -l app=nginx
```

```
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

Контролер StatefulSet змінив кількість реплік. Як і під час [створення StatefulSet](#ordered-pod-creation), контролер StatefulSet створював кожен Pod послідовно відповідно до його порядкового індексу і чекав, доки попередник кожного Podʼа перейде у стан Running і Ready, перш ніж запускати наступний Pod.

### Зменшення масштабу {#scaling-down}

Зменшення масштабу означає зменшення кількості реплік. Наприклад, ви можете зробити це тому, що трафік до сервісу зменшився і за поточного масштабу є ресурси, що простоюють.

В одному вікні термінала спостерігайте за Podʼами у StatefulSet:

```shell
# Закінчіть цей watch, коли лишиться лише 3 Podʼи для StatefulSet
kubectl get pod --watch -l app=nginx
```

В іншому вікні термінала використовуйте `kubectl patch`, щоб зменшити кількість реплік StatefulSet до трьох:

```shell
kubectl patch sts web -p '{"spec":{"replicas":3}}'
```

```
statefulset.apps/web patched
```

Зачекайте, доки `web-4` і `web-3` перейдуть у стан Terminating.

```shell
# Це вже має працювати
kubectl get pods --watch -l app=nginx
```

```
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

Панель управління видаляла по одному Podʼу у зворотному порядку їхніх порядкових індексів і чекала, доки кожен Pod повністю зупиниться, перш ніж видалити наступний.

Отримайте PersistentVolumeClaims StatefulSet:

```shell
kubectl get pvc -l app=nginx
```

```
NAME        STATUS    VOLUME                                     CAPACITY   ACCESSMODES   AGE
www-web-0   Bound     pvc-15c268c7-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-1   Bound     pvc-15c79307-b507-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-2   Bound     pvc-e1125b27-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-3   Bound     pvc-e1176df6-b508-11e6-932f-42010a800002   1Gi        RWO           13h
www-web-4   Bound     pvc-e11bb5f8-b508-11e6-932f-42010a800002   1Gi        RWO           13h

```

Досі існують пʼять PersistentVolumeClaims і пʼять PersistentVolumes. Досліджуючи [стабільне сховище](#writing-to-stable-storage) Podʼа, ви бачили, що PersistentVolumes, змонтовані до Podʼів StatefulSet, не видаляються, коли видаляються Podʼи StatefulSet. Так само відбувається, коли видалення Podʼів спричинене зменшенням масштабу StatefulSet.

## Оновлення StatefulSets {#updating-statefulsets}

Контролер StatefulSet підтримує автоматизовані оновлення. Стратегію визначає поле `spec.updateStrategy` обʼєкта API StatefulSet. Цю можливість можна використовувати для оновлення образів контейнерів, запитів ресурсів та/або обмежень, міток та анотацій Podʼів у StatefulSet.

Є дві допустимі стратегії оновлення: `RollingUpdate` (стандартна) та `OnDelete`.

### RollingUpdate {#rolling-update}

Стратегія оновлення `RollingUpdate` оновлює всі Podʼи в StatefulSet у зворотному порядку щодо їх порядкового індексу, з дотриманням гарантій StatefulSet.

Ви можете розділити оновлення StatefulSet, який використовує стратегію `RollingUpdate`, на _частини_ (partitions), вказавши `.spec.updateStrategy.rollingUpdate.partition`. Ви спробуєте це пізніше в цьому посібнику.

Спочатку спробуйте просте поетапне оновлення.

В одному вікні термінала виконайте patch для StatefulSet `web`, щоб знову змінити образ контейнера:

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.24"}]'
```

```
statefulset.apps/web patched
```

В іншому терміналі спостерігайте за Podʼами у StatefulSet:

```shell
# Закінчіть це спостереження, коли відбудеться розгортання
#
# Якщо ви не впевнені, залиште його ще на одну хвилину
kubectl get pod -l app=nginx --watch
```

Вивід подібний до:

```
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

Podʼи в StatefulSet оновлюються у зворотному порядку їхніх порядкових індексів. Контролер StatefulSet завершує роботу кожного Podʼа і чекає, доки він перейде в стан Running і Ready, перш ніж оновлювати наступний Pod. Зверніть увагу: хоча контролер StatefulSet не перейде до оновлення наступного Podʼа, доки його наступник за порядковим номером не буде Running і Ready, він відновить будь-який Pod, що зазнає збою під час оновлення, до наявної версії цього Podʼа.

Podʼи, які вже отримали оновлення, буде відновлено до оновленої версії, а Podʼи, які ще не отримали оновлення, — до попередньої версії. Таким чином контролер намагається підтримувати справність застосунку та узгодженість оновлення за наявності періодичних збоїв.

Отримайте Podʼи, щоб переглянути їх образи контейнерів:

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```

```
registry.k8s.io/nginx-slim:0.24
registry.k8s.io/nginx-slim:0.24
registry.k8s.io/nginx-slim:0.24

```

Всі Podʼи в StatefulSet зараз використовують попередній образ контейнера.

{{< alert color="info" title="Примітка" >}}
Ви також можете використовувати `kubectl rollout status sts/<name>` для перегляду стану поетапного оновлення StatefulSet
{{< /alert >}}

#### Підготовка оновлення {#staging-an-update}

Ви можете розділити оновлення StatefulSet, який використовує стратегію `RollingUpdate`, на _частини_ (partitions), вказавши `.spec.updateStrategy.rollingUpdate.partition`.

Докладніше див. [Поетапні оновлення частинами](/docs/concepts/workloads/controllers/statefulset/#partitions) на сторінці концепції StatefulSet.

Ви можете підготувати оновлення StatefulSet за допомогою поля `partition` у `.spec.updateStrategy.rollingUpdate`. Для цього оновлення ви залишите наявні Podʼи в StatefulSet без змін, змінюючи при цьому шаблон Podʼа для StatefulSet. Потім ви (або, поза межами посібника, якась зовнішня автоматизація) можете запустити це підготовлене оновлення.

Спочатку виконайте patch для StatefulSet `web`, щоб додати `partition` до поля `updateStrategy`:

```shell
# Значення "partition" визначає, до яких порядкових номерів застосовується зміна
# Переконайтеся, що використовуєте число, більше, ніж останній порядковий номер для
# StatefulSet
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":3}}}}'
```

```
statefulset.apps/web patched
```

Знову виконайте patch для StatefulSet, щоб змінити образ контейнера, який використовує цей StatefulSet:

```shell
kubectl patch statefulset web --type='json' -p='[{"op": "replace", "path": "/spec/template/spec/containers/0/image", "value":"registry.k8s.io/nginx-slim:0.21"}]'
```

```
statefulset.apps/web patched
```

Видаліть Pod у StatefulSet:

```shell
kubectl delete pod web-2
```

```
pod "web-2" deleted
```

Зачекайте, поки Pod `web-2`, що його замінює, перейде в стан Running і Ready:

```shell
# Закінчіть перегляд, коли побачите, що web-2 справний
kubectl get pod -l app=nginx --watch
```

```
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

```
registry.k8s.io/nginx-slim:0.24
```

Зверніть увагу: хоча стратегія оновлення — `RollingUpdate`, StatefulSet відновив Pod з початковим образом контейнера. Це тому, що порядковий номер Podʼа менший за `partition`, вказаний в `updateStrategy`.

#### Канаркове оновлення {#rolling-out-a-canary}

Тепер ви спробуєте [канаркове оновлення](https://glossary.cncf.io/canary-deployment/) цієї підготовленої зміни.

Ви можете виконати канаркове оновлення (щоб протестувати змінений шаблон), зменшивши `partition`, який ви вказали [вище](#staging-an-update).

Виконайте patch для StatefulSet, щоб зменшити `partition`:

```shell
# Значення "partition" повинно відповідати найвищому існуючому порядковому номеру для
# StatefulSet
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":2}}}}'
```

```
statefulset.apps/web patched
```

Панель управління ініціює заміну `web-2` (реалізовану через коректне **видалення** з подальшим створенням нового Podʼа, щойно видалення завершиться). Зачекайте, поки новий Pod `web-2` перейде в стан Running і Ready.

```shell
# Це вже має бути запущено
kubectl get pod -l app=nginx --watch
```

```
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

```
registry.k8s.io/nginx-slim:0.21

```

Коли ви змінили `partition`, контролер StatefulSet автоматично оновив Pod `web-2`, оскільки порядковий номер Podʼа був більшим або рівним `partition`.

Видаліть Pod `web-1`:

```shell
kubectl delete pod web-1
```

```
pod "web-1" deleted
```

Зачекайте, поки Pod `web-1` перейде в стан Running і Ready.

```shell
# Це вже має бути запущено
kubectl get pod -l app=nginx --watch
```

Вивід подібний до:

```
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

```
registry.k8s.io/nginx-slim:0.24
```

`web-1` відновлено до початкової конфігурації, тому що порядковий номер Podʼа був меншим за `partition`. Коли вказано `partition`, усі Podʼи з порядковим номером, більшим або рівним `partition`, буде оновлено, коли оновлюється `.spec.template` StatefulSet. Якщо Pod з порядковим номером, меншим за `partition`, буде видалено або його роботу буде завершено іншим чином, його буде відновлено до початкової конфігурації.

#### Поетапні впровадження {#phased-roll-outs}

Ви можете виконати поетапне впровадження (наприклад, лінійне, геометричне чи експоненціальне) за допомогою поетапного оновлення частинами так само, як ви виконували [канаркове оновлення](#rolling-out-a-canary). Щоб виконати поетапне впровадження, встановіть `partition` у порядковий номер, на якому контролер має призупинити оновлення.

Зараз `partition` має значення `2`. Встановіть `partition` у `0`:

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"RollingUpdate","rollingUpdate":{"partition":0}}}}'
```

```
statefulset.apps/web patched
```

Зачекайте, поки всі Podʼи в StatefulSet перейдуть у стан Running і Ready.

```shell
# Це вже має бути запущено
kubectl get pod -l app=nginx --watch
```

Вивід подібний до:

```
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

Отримайте відомості про образи контейнерів Podʼів у StatefulSet:

```shell
for p in 0 1 2; do kubectl get pod "web-$p" --template '{{range $i, $c := .spec.containers}}{{$c.image}}{{end}}'; echo; done
```

```
registry.k8s.io/nginx-slim:0.21
registry.k8s.io/nginx-slim:0.21
registry.k8s.io/nginx-slim:0.21
```

Переміщуючи `partition` на `0`, ви дозволили StatefulSet продовжити процес оновлення.

### OnDelete {#on-delete}

Ви вибираєте цю стратегію оновлення для StatefulSet, встановивши `.spec.updateStrategy.type` в `OnDelete`.

Виконайте patch для StatefulSet `web`, щоб використовувати стратегію оновлення `OnDelete`:

```shell
kubectl patch statefulset web -p '{"spec":{"updateStrategy":{"type":"OnDelete", "rollingUpdate": null}}}'
```

```
statefulset.apps/web patched
```

Коли ви вибираєте цю стратегію оновлення, контролер StatefulSet не оновлює Podʼи автоматично, коли змінюється поле `.spec.template` StatefulSet. Вам потрібно керувати розгортанням самостійно — вручну або за допомогою окремої автоматизації.

## Видалення StatefulSet {#deleting-statefulsets}

StatefulSet підтримує як _некаскадне_, так і _каскадне_ видалення. Під час некаскадного **видалення** Podʼи StatefulSet не видаляються разом зі StatefulSet. Під час каскадного **видалення** видаляються і StatefulSet, і його Podʼи.

Прочитайте [Використання каскадного видалення у кластері](/docs/tasks/administer-cluster/use-cascading-deletion/), щоб дізнатися про каскадне видалення загалом.

### Некаскадне видалення {#non-cascading-delete}

В одному вікні термінала спостерігайте за Podʼами у StatefulSet.

```
# Завершіть цей перегляд, коли не буде Podʼів для StatefulSet
kubectl get pods --watch -l app=nginx
```

Використовуйте [`kubectl delete`](/docs/reference/generated/kubectl/kubectl-commands/#delete), щоб видалити StatefulSet. Переконайтеся, що ви передали параметр `--cascade=orphan` до команди. Цей параметр повідомляє Kubernetes видаляти лише StatefulSet, і **не** видаляти жодного з його Podʼів.

```shell
kubectl delete statefulset web --cascade=orphan
```

```
statefulset.apps "web" deleted
```

Отримайте Podʼи, щоб перевірити їх статус:

```shell
kubectl get pods -l app=nginx
```

```
NAME      READY     STATUS    RESTARTS   AGE
web-0     1/1       Running   0          6m
web-1     1/1       Running   0          7m
web-2     1/1       Running   0          5m
```

Хоча `web` видалено, усі Podʼи досі в стані Running і Ready. Видаліть `web-0`:

```shell
kubectl delete pod web-0
```

```
pod "web-0" deleted
```

Отримайте Podʼи StatefulSet:

```shell
kubectl get pods -l app=nginx
```

```
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

У другому терміналі створіть StatefulSet знову. Зверніть увагу: якщо ви не видалили Service `nginx` (а цього не слід було робити), ви побачите помилку про те, що Service уже існує.

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```

```
statefulset.apps/web created
service/nginx unchanged
```

Ігноруйте помилку. Вона лише вказує на те, що була спроба створити headless Service _nginx_, незважаючи на те, що цей Service вже існує.

Дослідіть вивід команди `kubectl get`, яка працює у першому терміналі.

```shell
# Це вже має бути запущено
kubectl get pods --watch -l app=nginx
```

```
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

Коли StatefulSet `web` було створено знову, він спочатку перезапустив `web-0`. Оскільки `web-1` уже був у стані Running і Ready, щойно `web-0` перейшов у стан Running і Ready, StatefulSet прийняв (adopted) цей Pod. Оскільки ви створили StatefulSet знову з `replicas`, рівним 2, щойно `web-0` було створено знову і визначено, що `web-1` уже в стані Running і Ready, роботу `web-2` було завершено.

Тепер ще раз розгляньте вміст файлу `index.html`, який обслуговують вебсервери Podʼів:

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

Хоча ви видалили і StatefulSet, і Pod `web-0`, він досі віддає імʼя хоста, яке спочатку було записано в його файл `index.html`. Це тому, що StatefulSet ніколи не видаляє PersistentVolumes, повʼязані з Podʼом. Коли ви знову створили StatefulSet і він перезапустив `web-0`, його початковий PersistentVolume знову змонтовано.

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

```
statefulset.apps "web" deleted
```

Дослідіть вивід команди `kubectl get`, яка працює у першому терміналі, і зачекайте, поки всі Podʼи перейдуть у стан Terminating.

```shell
# Це вже має бути запущено
kubectl get pods --watch -l app=nginx
```

```
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

Як ви бачили в розділі [Зменшення масштабу](#scaling-down), роботу Podʼів завершується по одному у зворотному порядку їхніх порядкових індексів. Перш ніж завершити роботу Podʼа, контролер StatefulSet чекає, доки наступник Podʼа за порядковим номером повністю завершить роботу.

{{< alert color="info" title="Примітка" >}}
Хоча каскадне видалення видаляє StatefulSet разом з його Podʼами, каскад **не** видаляє headless Service, повʼязаний з StatefulSet. Ви повинні видалити Service `nginx` вручну.
{{< /alert >}}

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

Знову створіть StatefulSet і headless Service:

```shell
kubectl apply -f https://k8s.io/examples/application/web/web.yaml
```

```
service/nginx created
statefulset.apps/web created
```

Коли всі Podʼи StatefulSet перейдуть у стан Running і Ready, отримайте вміст їх файлів `index.html`:

```shell
for i in 0 1; do kubectl exec -i -t "web-$i" -- curl http://localhost/; done
```

```
web-0
web-1
```

Хоча ви повністю видалили StatefulSet і всі його Podʼи, Podʼи створюються знову зі змонтованими PersistentVolumes, і `web-0` та `web-1` продовжують віддавати свої імена хостів.

Нарешті, видаліть Service `nginx`…

```shell
kubectl delete service nginx
```

```
service "nginx" deleted
```

…і StatefulSet `web`:

```shell
kubectl delete statefulset web
```

```
statefulset "web" deleted
```

## Політика керування Podʼами {#pod-management-policy}

Для деяких розподілених систем порядок, гарантований StatefulSet, є непотрібним або небажаним. Ці системи потребують лише унікальності та ідентичності.

Ви можете вказати [політику керування Podʼами](/docs/concepts/workloads/controllers/statefulset/#pod-management-policies), щоб уникнути цього суворого порядку: `OrderedReady` (стандартна) або `Parallel`.

### Керування Podʼами OrderedReady {#orderedready-pod-management}

Керування Podʼами `OrderedReady` є стандартним для StatefulSet. Воно наказує контролеру StatefulSet дотримуватися гарантій порядку, продемонстрованих вище.

Використовуйте цей варіант, коли ваш застосунок вимагає або очікує, що зміни, як-от розгортання нової версії застосунку, відбуваються в суворому порядку порядкових номерів (номерів Podʼів), який забезпечує StatefulSet. Іншими словами, якщо у вас є Podʼи `app-0`, `app-1` і `app-2`, Kubernetes спочатку оновить `app-0` і перевірить його. Якщо перевірки пройдено, Kubernetes оновить `app-1`, а потім `app-2`.

Якби ви додали ще два Podʼи, Kubernetes налаштував би `app-3` і дочекався, доки він стане справним, перш ніж розгортати `app-4`.

Оскільки це стандартне налаштування, ви вже практикували його використання.

### Керування Podʼами Parallel {#parallel-pod-management}

Альтернатива, керування Podʼами `Parallel`, наказує контролеру StatefulSet запускати або завершувати роботу всіх Podʼів паралельно і не чекати, поки Podʼи стануть `Running` і `Ready` або повністю завершать роботу, перш ніж запускати чи завершувати інший Pod.

Варіант керування Podʼами `Parallel` впливає лише на поведінку під час масштабування. Оновлення це не зачіпає: Kubernetes і далі впроваджує зміни по черзі. У цьому посібнику застосунок дуже простий: вебсервер, який повідомляє своє імʼя хоста (оскільки це StatefulSet, імʼя хоста кожного Podʼа різне й передбачуване).

{{% code_sample file="application/web/web-parallel.yaml" %}}

Цей маніфест ідентичний тому, який ви завантажили вище, за винятком того, що `.spec.podManagementPolicy` StatefulSet `web` встановлено в `Parallel`.

В одному терміналі спостерігайте за Podʼами в StatefulSet.

```shell
# Залиште це запущеним до кінця розділу
kubectl get pod -l app=nginx --watch
```

В іншому терміналі змініть конфігурацію StatefulSet на керування Podʼами `Parallel`:

```shell
kubectl apply -f https://k8s.io/examples/application/web/web-parallel.yaml
```

```
service/nginx updated
statefulset.apps/web updated
```

Залиште відкритим термінал, де працює спостереження. В іншому вікні термінала масштабуйте StatefulSet:

```shell
kubectl scale statefulset/web --replicas=5
```

```
statefulset.apps/web scaled
```

Перегляньте вивід термінала, де працює команда `kubectl get`. Він може виглядати приблизно так

```
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

StatefulSet запустив три нові Podʼи і не чекав, доки перший стане Running і Ready, перш ніж запустити другий і третій.

Цей підхід корисний, якщо ваше робоче навантаження має елемент стану або потребує, щоб Podʼи могли ідентифікувати одне одного за передбачуваними назвами, і особливо якщо вам іноді потрібно швидко надати значно більше потужності. Якби цей простий вебсервіс із посібника раптом отримав додатковий 1 000 000 запитів на хвилину, ви захотіли б запустити більше Podʼів, але не захотіли б чекати на запуск кожного нового Podʼа. Паралельний запуск додаткових Podʼів скорочує час між запитом додаткової потужності та моментом, коли вона доступна.

## {{% heading "cleanup" %}} {#cleaning-up}

У вас мають бути відкриті два термінали, готові для запуску команд `kubectl` під час очищення.

```shell
kubectl delete sts web
# sts - скорочення для statefulset
```

Ви можете спостерігати за `kubectl get`, щоб побачити, як ці Podʼи видаляються.

```shell
# завершіть перегляд, коли побачите необхідне
kubectl get pod -l app=nginx --watch
```

```
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

Під час видалення StatefulSet видаляє всі Podʼи одночасно; він не чекає, доки наступник Podʼа за порядковим номером завершить роботу, перш ніж видалити цей Pod.

Закрийте термінал, де виконується команда `kubectl get`, та видаліть Service `nginx`:

```shell
kubectl delete svc nginx
```

Видаліть носії постійного сховища для PersistentVolumes, використаних у цьому посібнику.

```shell
kubectl get pvc
```

```
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

```
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

```
persistentvolumeclaim "www-web-0" deleted
persistentvolumeclaim "www-web-1" deleted
persistentvolumeclaim "www-web-2" deleted
persistentvolumeclaim "www-web-3" deleted
persistentvolumeclaim "www-web-4" deleted
```

```shell
kubectl get pvc
```

```
No resources found in default namespace.
```

{{< alert color="info" title="Примітка" >}}
Вам також потрібно видалити носії постійного сховища для PersistentVolumes, використаних у цьому посібнику. Виконайте потрібні кроки залежно від вашого середовища, конфігурації сховища та методу надання, щоб усе сховище було звільнено.
{{< /alert >}}
