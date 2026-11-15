---
title: Додавання записів до файлу /etc/hosts у Podʼі за допомогою HostAliases
content_type: task
weight: 60
min-kubernetes-server-version: 1.7
---

<!-- overview -->

Додавання записів до файлу `/etc/hosts` у Podʼі дає змогу перевизначити розвʼязання імен хостів на рівні Podʼа, коли DNS та інші варіанти не підходять. Ви можете додавати ці власні записи за допомогою поля HostAliases у PodSpec.

Проєкт Kubernetes рекомендує змінювати конфігурацію DNS за допомогою поля `hostAliases` (частина `.spec` Podʼа), а не за допомогою init-контейнера чи інших засобів безпосереднього редагування `/etc/hosts`. Зміни, внесені іншим способом, kubelet може перезаписати під час створення або перезапуску Podʼа.

<!-- steps -->

## Стандартний вміст файлу hosts {#default-hosts-file-content}

Запустіть Pod із Nginx, якому призначено IP-адресу Podʼа:

```shell
kubectl run nginx --image nginx
```

```
pod/nginx created
```

Перевірте IP-адресу Podʼа:

```shell
kubectl get pods --output=wide
```

```
NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
nginx    1/1       Running   0          13s    10.200.0.4   worker0
```

Вміст файлу hosts виглядатиме так:

```shell
kubectl exec nginx -- cat /etc/hosts
```

```
# Kubernetes-managed hosts file.
127.0.0.1	localhost
::1	localhost ip6-localhost ip6-loopback
fe00::0	ip6-localnet
fe00::0	ip6-mcastprefix
fe00::1	ip6-allnodes
fe00::2	ip6-allrouters
10.200.0.4	nginx
```

Стандартно файл `hosts` містить лише шаблонні записи IPv4 та IPv6, такі як `localhost` і власне імʼя хоста.

## Додавання додаткових записів за допомогою hostAliases {#adding-additional-entries-with-hostaliases}

Крім стандартних шаблонних записів, ви можете додати до файлу `hosts` інші записи. Наприклад, щоб розвʼязувати `foo.local`, `bar.local` у `127.0.0.1`, а `foo.remote`, `bar.remote` у `10.1.2.3`, налаштуйте HostAliases для Podʼа в полі `.spec.hostAliases`:

{{% code_sample file="service/networking/hostaliases-pod.yaml" %}}

Ви можете запустити Pod із такою конфігурацією, виконавши:

```shell
kubectl apply -f https://k8s.io/examples/service/networking/hostaliases-pod.yaml
```

```
pod/hostaliases-pod created
```

Перегляньте подробиці Podʼа, щоб побачити його адресу IPv4 і статус:

```shell
kubectl get pod --output=wide
```

```
NAME                           READY     STATUS      RESTARTS   AGE       IP              NODE
hostaliases-pod                0/1       Completed   0          6s        10.200.0.5      worker0
```

Вміст файлу `hosts` виглядає так:

```shell
kubectl logs hostaliases-pod
```

```
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

kubelet керує файлом `hosts` для кожного контейнера Podʼа, щоб середовище виконання контейнерів не змінювало цей файл після запуску контейнерів. Історично Kubernetes завжди використовував Docker Engine як середовище виконання контейнерів, а Docker Engine змінював файл `/etc/hosts` після запуску кожного контейнера.

Поточний Kubernetes може використовувати різні середовища виконання контейнерів; попри це, kubelet керує файлом hosts у кожному контейнері, щоб результат був очікуваним незалежно від середовища виконання контейнерів, яке ви використовуєте.

{{< caution >}}
Уникайте ручних змін файлу hosts усередині контейнера.

Якщо ви вносите ручні зміни до файлу hosts, ці зміни втрачаються, коли контейнер завершує роботу.
{{< /caution >}}
