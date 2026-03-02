---
title: Створення статичних Podʼів
weight: 220
content_type: task
---

<!-- overview -->

*Статичні Podʼи* керуються безпосередньо демоном kubelet на конкретному вузлі, без спостереження за ними з боку {{< glossary_tooltip text="API сервера" term_id="kube-apiserver" >}}. На відміну від Podʼів, які керуються панеллю управління (наприклад, {{< glossary_tooltip text="Deployment" term_id="deployment" >}}), kubelet спостерігає за кожним статичним Podʼом (і перезапускає його у разі невдачі).

Статичні Podʼи завжди привʼязані до одного {{< glossary_tooltip term_id="kubelet" >}} на конкретному вузлі.

Kubelet автоматично намагається створити {{< glossary_tooltip text="дзеркальний Pod" term_id="mirror-pod" >}} на сервері Kubernetes API для кожного статичного Podʼа. Це означає, що Podʼи, які запущені на вузлі, є видимими на сервері API, але не можуть бути керовані звідти. Назви Podʼів будуть мати суфікс з іменем хосту вузла відділеним дефісом.

{{< note >}}
Якщо ви використовуєте кластеризований Kubernetes і використовуєте статичні Podʼи для запуску Podʼа на кожному вузлі, вам, ймовірно, слід використовувати {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} замість цього.
{{< /note >}}

{{< note >}}
`spec` статичного Podʼа не може посилатися на інші обʼєкти API (наприклад, {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}, {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, {{< glossary_tooltip text="Secret" term_id="secret" >}}, тощо).
{{< /note >}}

{{< note >}}
Статичні Podʼи не підтримують [Ефемерні контейнери](/docs/concepts/workloads/pods/ephemeral-containers/).
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

На цій сторінці передбачається, що ви використовуєте {{< glossary_tooltip term_id="cri-o" >}} для запуску Podʼів, а також що ваші вузли працюють під управлінням операційної системи Fedora. Інструкції для інших дистрибутивів або встановлень Kubernetes можуть відрізнятися.

<!-- steps -->

### Створення статичного Podʼа {#static-pod-creation}

Ви можете налаштувати статичний Pod з використанням [файлу конфігурації, що зберігається в файловій системі](#configuration-files) або [файлу конфігурації, що зберігається на вебсервері](#pods-created-via-http).

### Статичний Pod з файлової системи {#configuration-files}

Маніфести — це стандартні визначення Podʼів у форматі JSON або YAML в певній теці. Використовуйте поле `staticPodPath: <тека>` у [конфігураційному файлі kubelet](/docs/reference/config-api/kubelet-config.v1beta1/), який періодично сканує теку і створює/видаляє статичні Podʼи, коли у цій теці зʼявляються/зникають файли YAML/JSON. Зверніть увагу, що kubelet ігнорує файли, що починаються з крапки при скануванні вказаної теки.

Наприклад, так можна запустити простий вебсервер як статичний Pod:

1. Виберіть вузол, на якому ви хочете запустити статичний Pod. У цьому прикладі це `my-node1`.

   ```shell
   ssh my-node1
   ```

2. Виберіть теку, наприклад `/etc/kubernetes/manifests`, і помістіть туди визначення Podʼа вебсервера, наприклад, `/etc/kubernetes/manifests/static-web.yaml`:

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

3. Налаштуйте kubelet на тому вузлі, щоб встановити значення `staticPodPath` в [конфігураційному файлі kubelet](/docs/reference/config-api/kubelet-config.v1beta1/). Див. [Встановлення параметрів kubelet через конфігураційний файл](/docs/tasks/administer-cluster/kubelet-config-file/) для отримання додаткової інформації.

   Альтернативний і застарілий метод полягає в налаштуванні kubelet на тому вузлі, щоб він шукав маніфести статичного Podʼа локально, використовуючи аргумент командного рядка. Щоб використовувати застарілий підхід, запустіть kubelet з аргументом `--pod-manifest-path=/etc/kubernetes/manifests/`.

4. Перезапустіть kubelet. У Fedora ви виконаєте:

   ```shell
   # Виконайте цю команду на вузлі, де працює kubelet
   systemctl restart kubelet
   ```

### Маніфест Podʼа, розміщений на вебсервері {#pods-created-via-http}

Kubelet періодично завантажує файл, вказаний аргументом `--manifest-url=<URL>`,
і розглядає його як файл JSON/YAML, який містить визначення Podʼів.
Подібно до того, як працюють [маніфести, розміщені в файловій системі](#configuration-files), kubelet
перевіряє маніфест за розкладом. Якщо відбулися зміни в списку статичних
Podʼів, kubelet застосовує їх.

Щоб скористатися цим підходом:

1. Створіть YAML-файл і збережіть його на веб-сервері, щоб ви могли передати URL цього файлу kubelet.

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

2. Налаштуйте kubelet на обраному вузлі для використання цього веб-маніфесту,
   запустивши його з аргументом `--manifest-url=<URL-маніфесту>`.
   У Fedora відредагуйте `/etc/kubernetes/kubelet`, щоб додати цей рядок:

   ```shell
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<URL-маніфесту>"
   ```

3. Перезапустіть kubelet. У Fedora ви виконаєте:

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

Вивід може бути наступним:

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
129fd7d382018   docker.io/library/nginx@sha256:...    11 minutes ago    Running    web     0          34533c6729106
```

{{< note >}}
`crictl` виводить URI образу та контрольну суму SHA-256. `NAME` буде виглядати більш подібним до: `docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`.
{{< /note >}}

Ви можете побачити дзеркальний Pod на сервері API:

```shell
kubectl get pods
```

```console
NAME                  READY   STATUS    RESTARTS        AGE
static-web-my-node1   1/1     Running   0               2m
```

{{< note >}}
Переконайтеся, що kubelet має дозвіл на створення дзеркального Podʼа на сервері API. якщо — ні, запит на створення буде відхилено сервером API.
{{< /note >}}

{{< glossary_tooltip term_id="label" text="Мітки" >}} зі статичного Podʼа передаються в дзеркальний Pod. Ви можете використовувати ці мітки як зазвичай через {{< glossary_tooltip term_id="selector" text="селектори" >}}, і т.д.

Якщо ви спробуєте використовувати `kubectl` для видалення дзеркального Podʼа з сервера API, kubelet _не_ видаляє статичний Pod:

```shell
kubectl delete pod static-web-my-node1
```

```console
pod "static-web-my-node1" deleted
```

Ви побачите, що Pod все ще працює:

```shell
kubectl get pods
```

```console
NAME                  READY   STATUS    RESTARTS   AGE
static-web-my-node1   1/1     Running   0          4s
```

Поверніться на вузол, де працює kubelet, і спробуйте вручну зупинити контейнер. Ви побачите, що після певного часу kubelet помітить це та автоматично перезапустить Pod:

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

Після того як ви визначите потрібний контейнер, ви можете отримати журнал для цього контейнера за допомогою `crictl`:

```shell
# Виконайте ці команди на вузлі, де працює контейнер
crictl logs <container_id>
```

```console
10.240.0.48 - - [16/Nov/2022:12:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nov/2022:12:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nove/2022:12:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

Щоб дізнатися більше про те, як налагоджувати за допомогою `crictl`, відвідайте [_Налагодження вузлів Kubernetes за допомогою crictl_](/docs/tasks/debug/debug-cluster/crictl/).

## Динамічне додавання та видалення статичних Podʼів {#dynamic-addition-and-removal-of-static-pods}

Запущений kubelet періодично сканує налаштовану теку (`/etc/kubernetes/manifests` у нашому прикладі) на предмет змін та додає/видаляє Podʼи при появі/зникненні файлів в цій теці.

```shell
# Це передбачає, що ви використовуєте файлову конфігурацію статичних Podʼів
# Виконайте ці команди на вузлі, де працює контейнер
#
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

## {{% heading "whatsnext" %}}

* [Створення статичних файлів маніфестів Podʼів для компонентів панелі управління](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifests-for-control-plane-components)
* [Створення статичного файлу маніфесту Podʼа для локального etcd](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifest-for-local-etcd)
* [Налагодження вузлів Kubernetes за допомогою `crictl`](/docs/tasks/debug/debug-cluster/crictl/)
* [Дізнайтеся більше про `crictl`](https://github.com/kubernetes-sigs/cri-tools)
* [Налаштування екземплярів etcd як статичних Podʼів, керованих kubelet](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
