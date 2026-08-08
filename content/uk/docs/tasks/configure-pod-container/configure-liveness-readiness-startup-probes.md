---
title: Налаштування проб життєздатності, готовності та запуску
content_type: task
weight: 140
---

<!-- overview -->

Ця сторінка показує, як налаштувати проби життєздатності, готовності та запуску для контейнерів.

Для отримання додаткової інформації про проби див. [Проби життєздатності, готовності та запуску](/docs/concepts/workloads/pods/probes)

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Визначте команду життєздатності {#define-a-liveness-command}

Багато застосунків, що працюють протягом тривалого часу, зрештою переходять у непрацездатний стан і не можуть відновитися, крім як знову бути перезапущеними. Kubernetes надає проби життєздатності для виявлення та виправлення таких ситуацій.

У цьому завданні ви створите Pod, який запускає контейнер на основі образу `registry.k8s.io/busybox:1.27.2`. Ось файл конфігурації для Podʼа:

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

Виведений текст показує, що жодна проба життєздатності ще не зазнав невдачі:

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

У нижній частині виводу є повідомлення про те, що проби життєздатності зазнали невдачі, і непрацездатні контейнери були примусово зупинені та перезапущені.

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

Виведений текст показує, що `RESTARTS` було збільшено. Зауважте, що лічильник `RESTARTS` збільшується, як тільки непрацездатний контейнер знову переходить у стан виконання:

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

Щоб спробувати перевірку стану справності через HTTP, створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

Через 10 секунд перегляньте події Podʼа, щоб перевірити, що проби життєздатності зазнали невдачі, і контейнер був перезапущений:

```shell
kubectl describe pod liveness-http
```

У випусках після v1.13 налаштування локального HTTP-проксі не впливають на пробу життєздатності через HTTP.

## Визначення проби життєздатності через TCP-сокет {#define-a-tcp-liveness-probe}

Третій тип проби життєздатності використовує TCP сокет. З цією конфігурацією kubelet спробує відкрити зʼєднання з вашим контейнером на вказаному порту. Якщо він може встановити зʼєднання, контейнер вважається справним, якщо ні — це вважається невдачею.

{{% code_sample file="pods/probe/tcp-liveness-readiness.yaml" %}}

Як можна побачити, конфігурація для перевірки TCP досить схожа на перевірку через HTTP. У цьому прикладі використовуються як проби готовності, так і життєздатності. Kubelet надішле першу пробу життєздатності через 15 секунд після запуску контейнера. Ця проба спробує підʼєднатися до контейнера `goproxy` на порту 8080. Якщо проба на життєздатність не спрацює, контейнер буде перезапущено. Kubelet продовжить виконувати цю перевірку кожні 10 секунд.

Крім проби життєздатності, ця конфігурація включає пробу готовності. Kubelet запустить першу пробу готовності через 15 секунд після запуску контейнера. Аналогічно проби життєздатності, це спроба підʼєднатися до контейнера `goproxy` на порту 8080. Якщо проба пройде успішно, Pod буде позначений як готовий і отримає трафік від сервісів. Якщо перевірка готовності не вдасться, то Pod буде позначений як не готовий і не отримає трафік від жодного з сервісів.

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

Щоб спробувати перевірку життєздатності через gRPC, створіть Pod за допомогою наступної команди. У наведеному нижче прикладі, Pod etcd налаштований для використання проби життєздатності через gRPC.

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/grpc-liveness.yaml
```

Через 15 секунд перегляньте події Podʼа, щоб перевірити, що перевірка життєздатності не зазнала невдачі:

```shell
kubectl describe pod etcd-with-grpc
```

При використанні проби через gRPC, є кілька технічних деталей, на які варто звернути увагу:

- Проби запускаються для IP-адреси Podʼа або його імені хосту. Обовʼязково налаштуйте вашу кінцеву точку gRPC для прослуховування IP-адреси Podʼа.
- Проби не підтримують жодних параметрів автентифікації (наприклад, `-tls`).
- Немає кодів помилок для вбудованих проб. Усі помилки вважаються невдачами проби.
- Якщо `ExecProbeTimeout` feature gate встановлено у `false`, grpc-health-probe **не** дотримується налаштування `timeoutSeconds` (яке стандартно становить 1 с), тоді як вбудована проба зазнає невдачі через тайм-аут.

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

## Захист контейнерів, що повільно запускаються за допомогою проб запуску {#define-startup-probes}

Іноді вам доводиться мати справу з застосунками, які вимагають додаткового часу запуску при їх першій ініціалізації. У таких випадках може бути складно налаштувати параметри проби життєздатності без компромісів щодо швидкої відповіді на затримки, які мотивували використання такої проби. Рішення полягає в тому, щоб налаштувати пробу запуску з тою самою командою, перевіркою через HTTP або TCP, з `failureThreshold * periodSeconds`, достатньо довгим, щоб покрити найгірший випадок щодо часу запуску.

Отже, попередній приклад стане:

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

Завдяки пробі запуску застосунок матиме максимум 5 хвилин (30 * 10 = 300 с), щоб завершити свій запуск. Як тільки проба запуску вдалася один раз, проба життєздатності бере роль на себе, щоб забезпечити швидку відповідь на затримки роботи контейнера. Якщо проба запуску ніколи не вдається, контейнер буде зупинений після 300 с і підпадатиме під `restartPolicy` Podʼа.

## Визначення проб готовності {#define-readiness-probe}

Іноді застосунки тимчасово не можуть обслуговувати трафік. Наприклад, застосунок може потребувати завантаження великих даних або конфігураційних файлів під час запуску, або залежати від зовнішніх служб після запуску. У таких випадках ви не хочете примусово припиняти роботу застосунку, але ви також не хочете надсилати йому запити. Kubernetes надає проби готовності для виявлення та помʼякшення таких ситуацій. Pod з контейнерами, які повідомляють, що вони не готові, не отримують трафіку через Service Kubernetes.

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

Конфігурація для проб готовності через HTTP та TCP також залишається ідентичною конфігурації пробам життєздатності.

Проби готовності та життєздатності можуть використовуватися паралельно для того самого контейнера. Використання обох може забезпечити, що трафік не досягне контейнера, який не готовий до нього, та що контейнери будуть перезапускатися у разі виникнення несправностей.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [Проби життєздатності, готовності та запуску](/docs/concepts/workloads/pods/probes/).
- Для повної специфікації полів, повʼязаних з пробами, дивіться довідник API: [Pod](/docs/reference/kubernetes-api/workload-resources/pod-v1/), [Контейнери](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container), [Проби](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Probe)
