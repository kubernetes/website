---
title: Налаштування ініціалізації Podʼа
content_type: task
weight: 170
---

<!-- overview -->

На цій сторінці показано, як використовувати init-контейнер для ініціалізації Podʼа перед запуском контейнера застосунку.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Створення Podʼа з init-контейнером {#create-a-pod-that-has-an-init-container}

У цій вправі ви створюєте Pod з одним контейнером застосунку й одним init-контейнером. Init-контейнер виконується до завершення, перш ніж запуститься контейнер застосунку.

Ось файл конфігурації Podʼа:

{{% code_sample file="pods/init-containers.yaml" %}}

У файлі конфігурації видно, що Pod має том, який спільно використовують init-контейнер і контейнер застосунку.

Init-контейнер монтує спільний том у `/work-dir`, а контейнер застосунку монтує спільний том у `/usr/share/nginx/html`. Init-контейнер виконує таку команду, а потім завершується:

```shell
wget -O /work-dir/index.html http://info.cern.ch
```

Зверніть увагу, що init-контейнер записує файл `index.html` у кореневу теку сервера nginx.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

Перевірте, що контейнер nginx працює:

```shell
kubectl get pod init-demo
```

Вивід показує, що контейнер nginx працює:

```
NAME        READY     STATUS    RESTARTS   AGE
init-demo   1/1       Running   0          1m
```

Отримайте доступ до оболонки в контейнері nginx, що працює в Podʼі `init-demo`:

```shell
kubectl exec -it init-demo -- /bin/bash
```

У своїй оболонці надішліть запит GET на сервер nginx:

```
root@nginx:~# apt-get update
root@nginx:~# apt-get install curl
root@nginx:~# curl localhost
```

Вивід показує, що nginx обслуговує вебсторінку, яку записав init-контейнер:

```html
<html><head></head><body><header>
<title>http://info.cern.ch</title>
</header>

<h1>http://info.cern.ch - home of the first website</h1>
  ...
  <li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
  ...
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про
  [взаємодію між контейнерами, що працюють в одному Podʼі](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/).
* Дізнайтеся більше про [init-контейнери](/docs/concepts/workloads/pods/init-containers/).
* Дізнайтеся більше про [томи](/docs/concepts/storage/volumes/).
* Дізнайтеся більше про [налагодження init-контейнерів](/docs/tasks/debug/debug-application/debug-init-containers/)
