---
title: Налаштування проб життєздатності, готовності та запуску
content_type: task
weight: 140
---

<!-- overview -->

Ця сторінка показує, як налаштувати проби життєздатності, готовності та запуску для контейнерів.

Докладніше про проби дивіться [Проби життєздатності, готовності та запуску](/docs/concepts/workloads/pods/probes).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Визначення команди життєздатності {#define-a-liveness-command}

Багато застосунків, що працюють тривалий час, зрештою переходять у непрацездатний стан і не можуть відновитися інакше, ніж через перезапуск. Kubernetes надає проби життєздатності для виявлення та виправлення таких ситуацій.

У цій вправі ви створюєте Pod, який запускає контейнер на основі образу `registry.k8s.io/busybox:1.27.2`. Ось файл конфігурації Podʼа:

{{% code_sample file="pods/probe/exec-liveness.yaml" %}}

У файлі конфігурації можна побачити, що у Podʼа є один `Container`. Поле `periodSeconds` вказує, що kubelet повинен виконувати пробу життєздатності кожні 5 секунд. Поле `initialDelaySeconds` повідомляє kubelet, що він повинен зачекати 5 секунд перед виконанням першої проби. Для виконання проби kubelet виконує команду `cat /tmp/healthy` у цільовому контейнері. Якщо команда успішно виконується, вона повертає 0, і kubelet вважає контейнер живим і справним. Якщо команда повертає ненульове значення, kubelet примусово зупиняє контейнер і перезапускає його.

Під час запуску контейнера виконується ця команда:

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

Протягом перших 30 секунд життя контейнера існує файл `/tmp/healthy`. Таким чином, протягом перших 30 секунд команда `cat /tmp/healthy` повертає код успіху. Після 30 секунд `cat /tmp/healthy` повертає код невдачі.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

Протягом 30 секунд перегляньте події Podʼа:

```shell
kubectl describe pod liveness-exec
```

Вивід показує, що жодна проба життєздатності ще не зазнала невдачі:

```none
Type    Reason     Age   From               Message
----    ------     ----  ----               -------
Normal  Scheduled  11s   default-scheduler  Successfully assigned default/liveness-exec to node01
Normal  Pulling    9s    kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal  Pulled     7s    kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal  Created    7s    kubelet, node01    Created container liveness
Normal  Started    7s    kubelet, node01    Started container liveness
```

Після 35 секунд знову перегляньте події Podʼа:

```shell
kubectl describe pod liveness-exec
```

У нижній частині виводу є повідомлення про те, що проби життєздатності зазнали невдачі, а контейнери, які не пройшли перевірку, були примусово зупинені й перестворені.

```none
Type     Reason     Age                From               Message
----     ------     ----               ----               -------
Normal   Scheduled  57s                default-scheduler  Successfully assigned default/liveness-exec to node01
Normal   Pulling    55s                kubelet, node01    Pulling image "registry.k8s.io/busybox:1.27.2"
Normal   Pulled     53s                kubelet, node01    Successfully pulled image "registry.k8s.io/busybox:1.27.2"
Normal   Created    53s                kubelet, node01    Created container liveness
Normal   Started    53s                kubelet, node01    Started container liveness
Warning  Unhealthy  10s (x3 over 20s)  kubelet, node01    Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
Normal   Killing    10s                kubelet, node01    Container liveness failed liveness probe, will be restarted
```

Почекайте ще 30 секунд та перевірте, що контейнер був перезапущений:

```shell
kubectl get pod liveness-exec
```

Вивід показує, що значення `RESTARTS` збільшилося. Зверніть увагу, що лічильник `RESTARTS` збільшується, щойно контейнер, який не пройшов перевірку, знову переходить у стан виконання:

```none
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## Визначення HTTP-запиту життєздатності {#define-a-liveness-http-request}

Ще один вид проб життєздатності використовує HTTP GET-запит. Ось файл конфігурації для Podʼа, який запускає контейнер на основі образу `registry.k8s.io/e2e-test-images/agnhost`.

{{% code_sample file="pods/probe/http-liveness.yaml" %}}

У файлі конфігурації можна побачити, що у Podʼа є один контейнер. Поле `periodSeconds` вказує, що kubelet повинен виконувати пробу життєздатності кожні 3 секунди. Поле `initialDelaySeconds` повідомляє kubelet, що він повинен зачекати 3 секунди перед виконанням першої проби. Для виконання проби kubelet надсилає HTTP GET-запит на сервер, який працює в контейнері та слухає порт 8080. Якщо обробник для шляху `/healthz` сервера повертає код успіху, kubelet вважає контейнер живим і справним. Якщо обробник повертає код невдачі, kubelet примусово зупиняє контейнер і перезапускає його.

Будь-який код, більший або рівний 200 і менший за 400, вказує на успіх. Будь-який інший код вказує на невдачу.

Ви можете переглянути вихідний код сервера в [server.go](https://github.com/kubernetes/kubernetes/blob/master/test/images/agnhost/liveness/server.go).

Протягом перших 10 секунд, коли контейнер живий, обробник `/healthz` повертає статус 200. Після цього обробник повертає статус 500.

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

Kubelet починає виконувати перевірку стану справності через 3 секунди після запуску контейнера. Таким чином, перші кілька перевірок стану справності будуть успішними. Але після 10 секунд перевірки стану справності будуть невдалими, і kubelet зупинить та перезапустить контейнер.

Щоб спробувати перевірку життєздатності через HTTP, створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

Через 10 секунд перегляньте події Podʼа, щоб перевірити, що проби життєздатності зазнали невдачі, і контейнер був перезапущений:

```shell
kubectl describe pod liveness-http
```

У випусках після v1.13 налаштування змінних середовища локального HTTP-проксі не впливають на пробу життєздатності через HTTP.

### Використання HTTP/2 cleartext (h2c) з HTTP пробами {#use-h2c-with-http-probes}

{{< feature-state feature_gate_name="H2CContainerProbe" >}}

Стандартно `kubelet` надсилає HTTP/1.1 запити під час виконання HTTP проби. Якщо ваш застосунок обслуговує точки доступу стану справності лише через HTTP/2 cleartext (h2c), ви можете додати поле `protocol` до поля `httpGet` у специфікації проби та вказати значення `HTTP2`. Це вимагає, щоб функціональна можливість [`H2CContainerProbe`](/docs/reference/command-line-tools-reference/feature-gates/#H2CContainerProbe) була увімкнена як на `kube-apiserver`, так і на `kubelet`.

{{% code_sample file="pods/probe/h2c-liveness.yaml" %}}

Коли `protocol` встановлено в `HTTP2`, `kubelet` зʼєднується через HTTP/2 cleartext (h2c) — HTTP/2 через звичайний TCP без TLS. Такі конфігурації не підтримуються:

* `protocol: HTTP2` та `scheme: HTTPS`
* `protocol: HTTP2` та значення у полі `host`

Якщо функціональну можливість вимкнено, API-сервер видаляє поле `protocol` з нових або оновлених Podʼів.

## Визначення проби життєздатності TCP {#define-a-tcp-liveness-probe}

Третій тип проби життєздатності використовує TCP-сокет. З такою конфігурацією kubelet спробує відкрити сокет до вашого контейнера на вказаному порту. Якщо зʼєднання вдасться встановити, контейнер вважається справним, якщо ні — це вважається збоєм.

{{% code_sample file="pods/probe/tcp-liveness-readiness.yaml" %}}

Як бачите, конфігурація перевірки TCP досить схожа на перевірку HTTP. У цьому прикладі використовуються і проба готовності, і проба життєздатності. Kubelet виконає першу пробу життєздатності через 15 секунд після запуску контейнера. Вона спробує підʼєднатися до контейнера `goproxy` на порту 8080. Якщо проба життєздатності не вдасться, контейнер буде перезапущено. Kubelet і далі виконуватиме цю перевірку кожні 10 секунд.

Крім проби життєздатності, ця конфігурація містить пробу готовності. Kubelet виконає першу пробу готовності через 15 секунд після запуску контейнера. Як і проба життєздатності, вона спробує підʼєднатися до контейнера `goproxy` на порту 8080. Якщо проба буде успішною, Pod буде позначено як готовий, і він отримуватиме трафік від Service. Якщо проба готовності не вдасться, Pod буде позначено як неготовий, і він не отримуватиме трафік від жодного Service.

Щоб спробувати перевірку життєздатності через TCP, створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

Через 15 секунд перегляньте події Podʼа, щоб перевірити, що проби життєздатності:

```shell
kubectl describe pod goproxy
```

## Визначення проби життєздатності через gRPC {#define-a-grpc-liveness-probe}

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

Якщо ваш застосунок реалізує [Протокол gRPC перевірки стану справності](https://github.com/grpc/grpc/blob/master/doc/health-checking.md), цей приклад показує, як налаштувати Kubernetes для його використання для перевірок життєздатності застосунку. Так само ви можете налаштувати проби готовності та запуску.

Ось приклад маніфесту:

{{% code_sample file="pods/probe/grpc-liveness.yaml" %}}

Щоб спробувати перевірку життєздатності через gRPC, створіть Pod за допомогою наведеної нижче команди. У наведеному нижче прикладі Pod etcd налаштовано на використання проби життєздатності gRPC.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

Через 15 секунд перегляньте події Podʼа, щоб перевірити, що перевірка життєздатності не зазнала невдачі:

```shell
kubectl describe pod etcd-with-grpc
```

Під час використання проби gRPC є кілька технічних деталей, які варто знати:

- Проби виконуються для IP-адреси Podʼа або його імені хоста. Обовʼязково налаштуйте свою точку доступу gRPC на прослуховування IP-адреси Podʼа.
- Проби стандартно зʼєднуються без шифрування (plaintext). Як увімкнути TLS, дивіться [Використання TLS із пробами gRPC](#grpc-probe-tls).
- Для вбудованих проб немає кодів помилок. Усі помилки вважаються збоями проби.
- Якщо функціональну можливість `ExecProbeTimeout` встановлено в `false`, grpc-health-probe **не** враховує налаштування `timeoutSeconds` (стандартно 1 с), тоді як вбудована проба зазнає невдачі через тайм-аут.

### Використання TLS із пробами gRPC {#grpc-probe-tls}

{{< feature-state feature_gate_name="GRPCContainerProbeTLS" >}}

Стандартно `kubelet` зʼєднується з точками доступу перевірки справності gRPC без шифрування (plaintext). Якщо ваш застосунок обслуговує gRPC лише через TLS, можна додати поле `mode` до поля `grpc` у специфікації проби й вказати значення `TLS`. Для цього потрібно, щоб функціональну можливість [`GRPCContainerProbeTLS`](/docs/reference/command-line-tools-reference/feature-gates/#GRPCContainerProbeTLS) було увімкнено і на `kube-apiserver`, і на `kubelet`.

{{% code_sample file="pods/probe/grpc-tls-liveness.yaml" %}}

Коли `mode` встановлено у `TLS`, `kubelet` зʼєднується через TLS з `InsecureSkipVerify` і не перевіряє сертифікат сервера. Це відповідає поведінці HTTPS проб. Перевірка сертифікатів не підтримується.

Якщо функціональну можливість вимкнено, `kube-apiserver` видаляє поле `mode` з нових або оновлених Podʼів.

## Використання іменованого порту {#use-a-named-port}

Ви можете використовувати іменований [`port`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#ports) для проб HTTP та TCP. Проби gRPC не підтримують іменовані порти.

Наприклад:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## Захист контейнерів, що повільно запускаються, за допомогою проб запуску {#define-startup-probes}

Іноді доводиться мати справу із застосунками, яким під час першої ініціалізації потрібен додатковий час на запуск. У таких випадках буває складно налаштувати параметри проби життєздатності без шкоди для швидкої реакції на взаємоблокування (deadlocks), заради якої таку пробу й використовують. Рішення — налаштувати пробу запуску з тією самою командою, перевіркою HTTP або TCP і зі значенням `failureThreshold * periodSeconds`, достатньо великим, щоб покрити найгірший час запуску.

Отже, попередній приклад набуде такого вигляду:

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

Завдяки пробі запуску застосунок матиме щонайбільше 5 хвилин (30 * 10 = 300 с), щоб завершити запуск. Щойно проба запуску один раз вдасться, справу бере на себе проба життєздатності, забезпечуючи швидку реакцію на взаємоблокування контейнера. Якщо проба запуску так і не вдасться, контейнер буде зупинено через 300 с, і далі діятиме `restartPolicy` Podʼа.

## Визначення проб готовності {#define-readiness-probes}

Іноді застосунки тимчасово не можуть обслуговувати трафік. Наприклад, під час запуску застосунку може знадобитися завантажити великі дані чи файли конфігурації, або після запуску він може залежати від зовнішніх сервісів. У таких випадках ви не хочете примусово зупиняти застосунок, але й не хочете надсилати йому запити. Kubernetes надає проби готовності для виявлення та помʼякшення таких ситуацій. Pod з контейнерами, які повідомляють, що вони не готові, не отримує трафіку через Service Kubernetes.

{{< note >}}
Проби готовності працюють у контейнері протягом його всього життєвого циклу.
{{< /note >}}

{{< caution >}}
Проби готовності та життєздатності не залежать одна від одної для успішного виконання. Якщо ви хочете зачекати перед виконанням проби готовності, вам слід використовувати `initialDelaySeconds` або `startupProbe`.
{{< /caution >}}

Проби готовності налаштовуються аналогічно пробам життєздатності. Єдина відмінність полягає в тому, що ви використовуєте поле `readinessProbe` замість поля `livenessProbe`.

```yaml
readinessProbe:
  exec:
    command:
    - /bin/cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

Конфігурація проб готовності через HTTP та TCP також залишається ідентичною конфігурації проб життєздатності.

Проби готовності та життєздатності можуть використовуватися паралельно для того самого контейнера. Використання обох може забезпечити, що трафік не досягне контейнера, який не готовий до нього, та що контейнери будуть перезапускатися у разі виникнення несправностей.

## {{% heading "whatsnext" %}} {#what-s-next}

* Дізнайтеся більше про [Проби життєздатності, готовності та запуску](/docs/concepts/workloads/pods/probes/).
* Повну специфікацію полів, повʼязаних із пробами, дивіться в довіднику API: [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/), [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container), [Probe](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
