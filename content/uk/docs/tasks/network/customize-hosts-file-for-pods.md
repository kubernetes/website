---
title: Додавання записів до файлу /etc/hosts у Pod за допомогою HostAliases
content_type: task
weight: 10
min-kubernetes-server-version: 1.7
---

<!-- overview -->

Додавання записів до файлу `/etc/hosts` у Pod надає можливість перевизначення розподілу імен на рівні Pod, коли DNS та інші параметри не застосовуються. Ви можете додавати ці власні записи за допомогою поля HostAliases у PodSpec.

Проєкт Kubernetes рекомендує змінювати конфігурацію DNS за допомогою поля `hostAliases` (частина файлу `.spec` для Podʼа), а не за допомогою контейнера init або інших засобів для редагування безпосередньо `/etc/hosts`. Зміни, внесені в інший спосіб, можуть бути перезаписані kubelet під час створення або перезапуску Pod.

<!-- steps -->

## Типовий вміст файлу hosts {#default-hosts-file-content}

Запустіть Pod з Nginx, який має призначену IP-адресу Podʼа:

```shell
kubectl run nginx --image nginx
```

```none
pod/nginx created
```

Перевірте IP-адресу Podʼа:

```shell
kubectl get pods --output=wide
```

```none
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

Вміст файлу hosts буде виглядати так:

```shell
kubectl exec nginx -- cat /etc/hosts
```

```none
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

Типово файл `hosts` містить тільки шаблони IPv4 та IPv6, такі як `localhost` та власне імʼя хосту.

## Додавання додаткових записів за допомогою hostAliases {#adding-additional-entries-with-hostaliases}

Крім стандартних шаблонів, ви можете додати додаткові записи до файлу `hosts`. Наприклад: щоб перевести `foo.local`, `bar.local` в `127.0.0.1` та `foo.remote`, `bar.remote` в `10.1.2.3`, ви можете налаштувати HostAliases для Pod в підполі `.spec.hostAliases`:

{{% code_sample file="service/networking/hostaliases-pod.yaml" %}}

Ви можете запустити Pod з такою конфігурацією, виконавши:

```shell
kubectl apply -f https://k8s.io/examples/service/networking/hostaliases-pod.yaml
```

```none
pod/hostaliases-pod created
```

Перевірте деталі Pod, щоб побачити його IPv4-адресу та статус:

```shell
kubectl get pod --output=wide
```

```none
NAME                           READY     STATUS      RESTARTS   AGE       IP              NODE
hostaliases-pod                0/1       Completed   0          6s        10.200.0.5      worker0
```

Вміст файлу `hosts` виглядає так:

```shell
kubectl logs hostaliases-pod
```

```none
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.5	hostaliases-pod

# Entries added by HostAliases.
127.0.0.1	foo.local	bar.local
10.1.2.3	foo.remote	bar.remote
```

з додатковими записами, вказаними внизу.

## Чому kubelet керує файлом hosts? {#why-does-kubelet-manage-the-hosts-file}

kubelet керує файлом `hosts` для кожного контейнера Podʼа, щоб запобігти модифікації файлу контейнерним середовищем після того, як контейнери вже були запущені. Історично Kubernetes завжди використовував Docker Engine як своє контейнерне середовище, і Docker Engine модифікував файл `/etc/hosts` після запуску кожного контейнера.

Поточна версія Kubernetes може використовувати різні контейнерні середовища; проте, kubelet керує файлом hosts у кожному контейнері, щоб результат був таким, як очікувалося, незалежно від використаного контейнерного середовища.

{{< caution >}}
Уникайте внесення ручних змін до файлу hosts всередині контейнера.

Якщо ви вносите ручні зміни до файлу hosts, ці зміни будуть втрачені при виході з контейнера.
{{< /caution >}}
