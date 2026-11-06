---
title: Створення статичних Podʼів
weight: 220
content_type: task
---

<!-- overview -->

Ця сторінка показує, як створювати _статичні Podʼи_ на вузлі. Докладніше про те, що таке статичні Podʼи і коли їх використовувати, дивіться [Статичні Podʼи](/docs/concepts/workloads/pods/static-pods/).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

На цій сторінці передбачається, що ви використовуєте {{< glossary_tooltip term_id="cri-o" >}} для запуску Podʼів, а ваші вузли працюють під операційною системою Fedora. Інструкції для інших дистрибутивів або встановлень Kubernetes можуть відрізнятися.

<!-- steps -->

## Створення статичного Podʼа {#static-pod-creation}

Ви можете налаштувати статичний Pod з використанням [файлу конфігурації, що зберігається в файловій системі](#configuration-files) або [файлу конфігурації, що зберігається на вебсервері](#pods-created-via-http).

### Маніфест статичного Podʼа у файловій системі {#configuration-files}

Маніфести — це стандартні визначення Podʼів у форматі JSON або YAML у певній теці. Використовуйте поле `staticPodPath: <the directory>` у [файлі конфігурації kubelet](/docs/reference/config-api/kubelet-config.v1beta1/), який періодично сканує теку і створює/видаляє статичні Podʼи, коли в ній зʼявляються/зникають файли YAML/JSON. Зверніть увагу, що під час сканування вказаної теки kubelet ігнорує файли, назви яких починаються з крапки.

{{< caution >}}
Kubelet обробляє **всі файли, що не починаються з крапки**, у теці статичних Podʼів — фільтрування за розширенням файлу не здійснюється. Наприклад, якщо ви створюєте резервну копію маніфесту, виконавши команду `cp kube-apiserver.yaml kube-apiserver.yaml.backup`, kubelet прочитає **обидва** файли і спробує створити статичний Pod з кожного з них. Коли два файли визначають Pod з однаковою назвою, результат є невизначеним і може призвести до того, що застаріла специфікація резервної копії буде тихо застосована замість поточного маніфесту. Якщо ви створюєте резервну копію, зберігайте її **поза** текою статичних Podʼів (наприклад, у `/etc/kubernetes/backup/`).
{{< /caution >}}

Наприклад, так можна запустити простий вебсервер як статичний Pod:

1. Виберіть вузол, на якому ви хочете запустити статичний Pod. У цьому прикладі це `my-node1`.

   ```shell
   ssh my-node1
   ```

1. Виберіть теку, наприклад `/etc/kubernetes/manifests`, і помістіть туди визначення Podʼа вебсервера, наприклад `/etc/kubernetes/manifests/static-web.yaml`:

   ```shell
   # Виконайте цю команду на вузлі, де працює kubelet
   mkdir -p /etc/kubernetes/manifests/
   cat <<EOF >/etc/kubernetes/manifests/static-web.yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: static-web
     labels:
       role: myrole
   spec:
     containers:
       - name: web
         image: nginx
         ports:
           - name: web
             containerPort: 80
             protocol: TCP
   EOF
   ```

1. Налаштуйте kubelet на цьому вузлі, задавши значення `staticPodPath` у [файлі конфігурації kubelet](/docs/reference/config-api/kubelet-config.v1beta1/). Докладніше дивіться [Встановлення параметрів kubelet через файл конфігурації](/docs/tasks/administer-cluster/kubelet-config-file/).

   Альтернативний і застарілий метод — налаштувати kubelet на цьому вузлі на локальний пошук маніфестів статичних Podʼів за допомогою аргументу командного рядка. Щоб використати застарілий підхід, запустіть kubelet з аргументом `--pod-manifest-path=/etc/kubernetes/manifests/`.

1. Перезапустіть kubelet. У Fedora для цього виконайте:

   ```shell
   # Виконайте цю команду на вузлі, де працює kubelet
   systemctl restart kubelet
   ```

### Маніфест Podʼа, розміщений на вебсервері {#pods-created-via-http}

kubelet періодично завантажує файл, вказаний аргументом `--manifest-url=<URL>`, і інтерпретує його як файл JSON/YAML з визначеннями Podʼів. Як і у випадку [маніфестів у файловій системі](#configuration-files), kubelet повторно отримує маніфест за розкладом. Якщо список статичних Podʼів змінився, kubelet застосовує ці зміни.

Щоб скористатися цим підходом:

1. Створіть YAML-файл і збережіть його на вебсервері, щоб передати URL цього файлу kubelet.

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: static-web
     labels:
       role: myrole
   spec:
     containers:
       - name: web
         image: nginx
         ports:
           - name: web
             containerPort: 80
             protocol: TCP
   ```

1. Налаштуйте kubelet на обраному вузлі на використання цього вебманіфесту, додавши до файлу конфігурації kubelet поле `staticPodURL`:

   ```yaml
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   staticPodURL: "<manifest-url>"
   ```

1. Перезапустіть kubelet. У Fedora для цього виконайте:

   ```shell
   # Виконайте цю команду на вузлі, де працює kubelet
   systemctl restart kubelet
   ```

## Спостереження за поведінкою статичного Podʼа {#behavior-of-static-pods}

Після запуску kubelet автоматично запускає всі визначені статичні Podʼи. Оскільки ви визначили статичний Pod і перезапустили kubelet, новий статичний Pod вже має бути запущений.

Ви можете переглянути запущені контейнери (включно зі статичними Podʼами), виконавши (на вузлі):

```shell
# Виконайте цю команду на вузлі, де працює kubelet
crictl ps
```

Вивід може бути приблизно таким:

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
129fd7d382018   docker.io/library/nginx@sha256:...    11 minutes ago    Running    web     0          34533c6729106
```

{{< note >}}
`crictl` виводить URI образу та контрольну суму SHA-256. `NAME` виглядатиме приблизно так: `docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`.
{{< /note >}}

Дзеркальний Pod можна побачити на API-сервері:

```shell
kubectl get pods
```

```console
NAME                  READY   STATUS    RESTARTS        AGE
static-web-my-node1   1/1     Running   0               2m
```

{{< note >}}
Переконайтеся, що kubelet має дозвіл на створення дзеркального Podʼа на API-сервері. Інакше API-сервер відхилить запит на створення.
{{< /note >}}

{{< glossary_tooltip term_id="label" text="Мітки" >}} статичного Podʼа передаються дзеркальному Podʼу. Ці мітки можна використовувати як звичайно, через {{< glossary_tooltip term_id="selector" text="селектори" >}} тощо.

Якщо спробувати за допомогою `kubectl` видалити дзеркальний Pod з API-сервера, kubelet _не_ видалить статичний Pod:

```shell
kubectl delete pod static-web-my-node1
```

```console
pod "static-web-my-node1" deleted
```

Видно, що Pod досі працює:

```shell
kubectl get pods
```

```console
NAME                  READY   STATUS    RESTARTS   AGE
static-web-my-node1   1/1     Running   0          4s
```

Поверніться на вузол, де працює kubelet, і спробуйте вручну зупинити контейнер. Ви побачите, що через деякий час kubelet помітить це й автоматично перезапустить Pod:

```shell
# Виконайте ці команди на вузлі, де працює kubelet
crictl stop 129fd7d382018 # замініть на ID вашого контейнера
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
89db4553e1eeb   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

Визначивши потрібний контейнер, можна отримати його логи за допомогою `crictl`:

```shell
# Виконайте ці команди на вузлі, де працює контейнер
crictl logs <container_id>
```

```console
10.240.0.48 - - [16/Nov/2022:12:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nov/2022:12:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nove/2022:12:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

Докладніше про налагодження за допомогою `crictl` дивіться [_Налагодження вузлів Kubernetes за допомогою crictl_](/docs/tasks/debug/debug-cluster/crictl/).

## Динамічне додавання та видалення статичних Podʼів {#dynamic-addition-and-removal-of-static-pods}

Запущений kubelet періодично сканує налаштовану теку (`/etc/kubernetes/manifests` у нашому прикладі) на зміни й додає/видаляє Podʼи, коли файли зʼявляються/зникають у цій теці.

```shell
# Це передбачає, що ви використовуєте файлову конфігурацію статичних Podʼів
# Виконайте ці команди на вузлі, де працює контейнер
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
crictl ps
# Ви бачите, що ніякий контейнер nginx не працює
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
f427638871c35   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

## {{% heading "whatsnext" %}} {#what-s-next}

* [Статичні Podʼи](/docs/concepts/workloads/pods/static-pods/)
* [Генерування маніфестів статичних Podʼів для компонентів панелі управління](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifests-for-control-plane-components)
* [Генерування маніфесту статичного Podʼа для локального etcd](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifest-for-local-etcd)
* [Налагодження вузлів Kubernetes за допомогою `crictl`](/docs/tasks/debug/debug-cluster/crictl/)
* [Дізнайтеся більше про `crictl`](https://github.com/kubernetes-sigs/cri-tools)
* [Налаштування екземплярів etcd як статичних Podʼів, керованих kubelet](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
