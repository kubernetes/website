---
title: Настройка Liveness, Readiness и Startup проб
content_type: task
weight: 110
---

<!-- overview -->

На этой странице рассказывается, как настроить liveness, readiness и startup пробы для контейнеров.

[Kubelet](/docs/admin/kubelet/) использует liveness пробу для проверки,
когда перезапустить контейнер.
Например, liveness проба должна поймать блокировку,
когда приложение запущено, но не может ничего сделать.
В этом случае перезапуск приложения может помочь сделать приложение
более доступным, несмотря на баги.

Kubelet использует readiness пробы, чтобы узнать,
готов ли контейнер принимать траффик.
Pod считается готовым, когда все его контейнеры готовы.

Одно из применений такого сигнала - контроль, какие Pod будут использованы
в качестве бек-енда для сервиса.
Пока Pod не в статусе ready, он будет исключен из балансировщиков нагрузки сервиса.

Kubelet использует startup пробы, чтобы понять, когда приложение в контейнере было запущено.
Если проба настроена, он блокирует liveness и readiness проверки, до того как проба становится успешной, и проверяет, что эта проба не мешает запуску приложения.
Это может быть использовано для проверки работоспособности медленно стартующих контейнеров,
чтобы избежать убийства kubelet'ом прежде, чем они будут запущены.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Определение liveness команды

Многие приложения, работающие в течение длительного времени, ломаются
и могут быть восстановлены только перезапуском.
Kubernetes предоставляет liveness пробы, чтобы обнаруживать и исправлять такие ситуации.

В этом упражнении вы создадите Pod, который запускает контейнер, основанный на образе `registry.k8s.io/busybox`. Конфигурационный файл для Pod'а:

{{% codenew file="pods/probe/exec-liveness.yaml" %}}

В конфигурационном файле вы можете видеть, что Pod состоит из одного `Container`.
Поле `periodSeconds` определяет, что kubelet должен производить liveness
пробы каждые 5 секунд. Поле `initialDelaySeconds` говорит kubelet'у, что он должен ждать 5 секунд перед первой пробой. Для проведения пробы
kubelet исполняет команду `cat /tmp/healthy` в целевом контейнере.
Если команда успешна, она возвращает 0, и kubelet считает контейнер живым и здоровым.
Если команда возвращает ненулевое значение, kubelet убивает и перезапускает контейнер.

Когда контейнер запускается, он исполняет команду

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

Для первых 30 секунд жизни контейнера существует файл `/tmp/healthy`.
Поэтому в течение первых 30 секунд команда `cat /tmp/healthy` возвращает код успеха. После 30 секунд `cat /tmp/healthy` возвращает код ошибки.

Создание Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

В течение 30 секунд посмотрим события Pod:

```shell
kubectl describe pod liveness-exec
```

Вывод команды показывает, что ещё ни одна liveness проба не завалена:

```
FirstSeen    LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
24s       24s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "registry.k8s.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "registry.k8s.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
```

После 35 секунд посмотрим события Pod снова:

```shell
kubectl describe pod liveness-exec
```

Внизу вывода появились сообщения, показывающие, что liveness
проба завалена и containers был убит и пересоздан.

```
FirstSeen LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
37s       37s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "registry.k8s.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "registry.k8s.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
2s        2s      1   {kubelet worker0}   spec.containers{liveness}   Warning     Unhealthy   Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
```

Подождите ещё 30 секунд и убедитесь, что контейнер был перезапущен:

```shell
kubectl get pod liveness-exec
```

Вывод команды показывает, что `RESTARTS` увеличено на 1:

```
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## Определение liveness HTTP запроса

Другой вид liveness пробы использует запрос HTTP GET. Ниже представлен файл конфигурации для Pod, который запускает контейнер, основанный на образе `registry.k8s.io/e2e-test-images/agnhost`.

{{% codenew file="pods/probe/http-liveness.yaml" %}}

В конфигурационном файле вы можете видеть Pod с одним контейнером.
Поле `periodSeconds` определяет, что kubelet должен производить liveness
пробы каждые 3 секунды. Поле `initialDelaySeconds` сообщает kubelet'у, что он должен ждать 3 секунды перед проведением первой пробы. Для проведения пробы
kubelet отправляет запрос HTTP GET на сервер, который запущен в контейнере и слушает порт 8080. Если обработчик пути `/healthz` на сервере
возвращает код успеха, kubelet рассматривает контейнер как живой и здоровый. Если обработчик возвращает код ошибки, kubelet убивает и перезапускает контейнер.

Любой код, больший или равный 200 и меньший 400, означает успех. Любой другой код интерпретируется как ошибка.

Вы можете посмотреть исходные коды сервера в
[server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

В течение первых 10 секунд жизни контейнера обработчик `/healthz`
возвращает статус 200. После обработчик возвращает статус 500.

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("error: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
})
```

Kubelet начинает выполнять health checks через 3 секунды после старта контейнера.
Итак, первая пара проверок будет успешна. Но после 10 секунд health
checks будут завалены и kubelet убьёт и перезапустит контейнер.

Чтобы попробовать HTTP liveness проверку, создайте Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

Через 10 секунд посмотрите события Pod, чтобы проверить, что liveness probes завалилась и container перезапустился:

```shell
kubectl describe pod liveness-http
```

В релизах до v1.13 (включая v1.13), если переменная окружения
`http_proxy` (или `HTTP_PROXY`) определена на node, где запущен Pod,
HTTP liveness проба использует этот прокси.
В версиях после v1.13, определение локальной HTTP прокси в переменной окружения не влияет на HTTP liveness пробу.

## Определение TCP liveness пробы

Третий тип liveness проб использует TCP сокет. С этой конфигурацией
kubelet будет пытаться открыть сокет к вашему контейнеру на определённый порт.
Если он сможет установить соединение, контейнер будет считаться здоровым, если нет, будет считаться заваленным.

{{% codenew file="pods/probe/tcp-liveness-readiness.yaml" %}}

Как вы можете видеть, конфигурация TCP проверок довольно похожа на HTTP проверки.
Этот пример использует обе - readiness и liveness пробы. Kubelet будет отправлять первую readiness пробу через 5 секунд после старта контейнера. Он будет пытаться соединиться с `goproxy` контейнером на порт 8080. Если проба успешна, Pod
будет помечен как ready. Kubelet будет продолжать запускать эту проверку каждые 10 секунд.

В дополнение к readiness пробе, конфигурация включает liveness пробу.
Kubelet запустит первую liveness пробу через 15 секунд после старта контейнера. Аналогично readiness пробе, он будет пытаться соединиться с контейнером `goproxy` на порт 8080. Если liveness проба завалится, контейнер будет перезапущен.

Для испытаний TCP liveness проверки, создадим Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

Через 15 секунд посмотрим события Pod'а для проверки liveness пробы:

```shell
kubectl describe pod goproxy
```

## Использование именованных портов

Вы можете использовать именованный порт
[ContainerPort](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerport-v1-core)
для HTTP или TCP liveness проверок:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## Защита медленно запускающихся контейнеров со startup пробами {#define-startup-probes}

Иногда приходится иметь дело со старыми приложениями, которым может требоваться дополнительное время для запуска
на их первую инициализацию.
В таких случаях бывает сложно настроить параметры liveness пробы без ущерба для скорости реакции на deadlock'и, для выявления которых как раз и нужна liveness проба.
Хитрость заключается в том, чтобы настроить startup пробу с такой же командой, что и HTTP или TCP проверка, но `failureThreshold * periodSeconds` должно быть достаточным, чтобы покрыть наихудшее время старта.

Итак, предыдущий пример будет выглядеть так:

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  
livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

Благодаря startup пробе, приложению дано максимум 5 минут
(30 * 10 = 300 сек.) для завершения его старта.
Как только startup проба успешна 1 раз, liveness проба начинает контролировать дедлоки контейнеров.
Если startup probe так и не заканчивается успехом, контейнер будет убит через 300 секунд и подвергнется `restartPolicy` pod'а.

## Определение readiness проб

Иногда приложения временно не могут обслужить траффик.
Например, приложение может требовать загрузки огромных данных
или конфигурационных файлов во время старта, или зависит от внешних сервисов после старта.
В таких случаях вы не хотите убивать приложение, но и
отправлять ему клиентские запросы тоже не хотите.
Kubernetes предоставляет
readiness пробы для определения и нивелирования таких ситуаций. Pod с контейнерами сообщает, что они не готовы принимать траффик через Kubernetes Services.

{{< note >}}
Readiness пробы запускаются на контейнере в течение всего его жизненного цикла.
{{< /note >}}

Readiness пробы настраиваются аналогично liveness пробам. Единственная разница в использовании поля `readinessProbe` вместо `livenessProbe`.

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

Конфигурация HTTP и TCP readiness проб также идентичны
liveness пробам.

Readiness и liveness пробы могут быть использованы одновременно на одном контейнере.
Использование обеих проб может обеспечить отсутствие траффика в контейнер, пока он не готов для этого, и контейнер будет перезапущен, если сломается.

## Конфигурация проб

{{< comment >}}
Eventually, some of this section could be moved to a concept topic.
{{< /comment >}}

[Probes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) имеют несколько полей, которые
вы можете использовать для более точного контроля поведения
liveness и readiness проверок:

* `initialDelaySeconds`: Количество секунд от старта контейнера до начала liveness или readiness проб. По умолчанию 0 секунд. Минимальное значение 0.
* `periodSeconds`: Длительность времени (в секундах) между двумя последовательными проведениями проб. По умолчанию 10
секунд. Минимальное значение 1.
* `timeoutSeconds`: Количество секунд ожидания пробы. По умолчанию
1 секунда. Минимальное значение 1.
* `successThreshold`: Минимальное количество последовательных проверок, чтобы проба считалась успешной после неудачной. По умолчанию 1.
Должна быть 1 для liveness. Минимальное значение 1.
* `failureThreshold`: Когда Pod стартует и проба даёт ошибку, Kubernetes будет пытаться `failureThreshold` раз перед тем, как сдаться. Сдаться в этом случае для liveness пробы означает перезапуск контейнера. В случае readiness пробы Pod будет помечен Unready.
По умолчанию 3. Минимальное значение 1.

[HTTP пробы](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
имеют дополнительные поля, которые могут быть установлены для `httpGet`:

* `host`: Имя хоста для соединения, по умолчанию pod IP. Вы, возможно, захотите установить заголовок "Host" в httpHeaders вместо этого.
* `scheme`: Схема для соединения к хосту (HTTP or HTTPS). По умолчанию HTTP.
* `path`: Путь для доступа к HTTP серверу.
* `httpHeaders`: Кастомные заголовки запроса. HTTP позволяет повторяющиеся заголовки.
* `port`: Имя или номер порта для доступа к контейнеру. Номер должен быть в диапазоне от 1 до 65535.

Для HTTP проб kubelet отправляет HTTP запрос на настроенный путь и
порт для проведения проверок. Kubelet отправляет пробу на IP адрес pod’а,
если адрес не переопределён необязательным полем `host` в `httpGet`. Если поле `scheme` установлено в `HTTPS`, kubelet отправляет HTTPS запрос, пропуская проверку сертификата. В большинстве сценариев вам не нужно устанавливать поле `host`.
Рассмотрим один сценарий, где бы он мог понадобиться. Допустим, контейнер слушает 127.0.0.1 и поле Pod'а `hostNetwork` задано в true. Поле `host` опции `httpGet` должно быть задано в 127.0.0.1. Если pod полагается на виртуальные хосты, что, скорее всего, более распространённая ситуация, лучше вместо поля `host` устанавливать заголовок `Host` в `httpHeaders`.

Для TCP проб kubelet устанавливает соединение с ноды, не внутри pod, что означает, что вы не можете использовать service name в параметре `host`, пока kubelet не может выполнить его резолв.



## {{% heading "whatsnext" %}}


* Узнать больше о
[Контейнерных пробах](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

Вы также можете прочитать API references для:

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [Проба](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)




