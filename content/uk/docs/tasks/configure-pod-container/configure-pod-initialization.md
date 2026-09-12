---
title: Налаштування ініціалізації Podʼа
content_type: task
weight: 170
---

<!-- overview -->

На цій сторінці показано, як використовувати Init Container для ініціалізації Podʼа перед запуском контейнера застосунку.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Створіть Pod, який має Init Container {#create-a-pod-that-has-an-init-container}

У цьому завданні ви створите Pod, який має один контейнер застосунку та один Init Container. Контейнер ініціалізації виконується до завершення перед тим, як розпочне виконання контейнер застосунку.

Ось файл конфігурації для Podʼа:

{{% code_sample file="pods/init-containers.yaml" %}}

У файлі конфігурації ви бачите, що в Podʼі є Том, який обидва контейнери (ініціалізації та застосунку) спільно використовують.

Контейнер ініціалізації монтує спільний Том у `/work-dir`, а контейнер застосунку монтує спільний Том у `/usr/share/nginx/html`. Контейнер ініціалізації виконує наступну команду, а потім завершується:

```shell
wget -O /work-dir/index.html http://info.cern.ch
```

Зверніть увагу, що контейнер ініціалізації записує файл `index.html` в кореневу теку сервера nginx.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/init-containers.yaml
```

Перевірте, що контейнер nginx працює:

```shell
kubectl get pod init-demo
```

Вивід показує, що контейнер nginx працює:

```none
NAME        READY     STATUS    RESTARTS   AGE
init-demo   1/1       Running   0          1m
```

Отримайте доступ до оболонки в контейнері nginx, що працює в Podʼі `init-demo`:

```shell
kubectl exec -it init-demo -- /bin/bash
```

У своїй оболонці надішліть запит GET на сервер nginx:

```shell
root@nginx:~# apt-get update
root@nginx:~# apt-get install curl
root@nginx:~# curl localhost
```

Вивід показує, що nginx обслуговує вебсторінку, яку записав контейнер ініціалізації:

```html
<html><head></head><body><header>
<title>http://info.cern.ch</title>
</header>

<h1>http://info.cern.ch - home of the first website</h1>
  ...
  <li><a href="http://info.cern.ch/hypertext/WWW/TheProject.html">Browse the first website</a></li>
  ...
```

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про
  [спілкування між контейнерами, що працюють в одному Podʼі](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/).
* Дізнайтеся більше про [Контейнери ініціалізації](/docs/concepts/workloads/pods/init-containers/).
* Дізнайтеся більше про [Томи](/docs/concepts/storage/volumes/).
* Дізнайтеся більше про [Налагодження контейнерів ініціалізації](/docs/tasks/debug/debug-application/debug-init-containers/)
