---
title: Системні логи
content_type: concept
weight: 80
---

<!-- overview -->

Логи компонентів системи фіксують події, які відбуваються в кластері, що може бути дуже корисним для налагодження. Ви можете налаштувати рівень деталізації логів, щоб бачити більше або менше деталей. Логи можуть бути настільки грубими, що вони показують лише помилки у компоненті, або настільки дрібними, що вони показують крок за кроком слідування за подіями (наприклад, логи доступу HTTP, зміни стану події, дії контролера або рішення планувальника).

<!-- body -->

{{< warning >}}
На відміну від описаних тут прапорців командного рядка, *вивід логу* сам по собі *не* підпадає під гарантії стійкості API Kubernetes: окремі записи логу та їх форматування можуть змінюватися від одного релізу до наступного!
{{< /warning >}}

## Klog

klog — це бібліотека реєстрації подій для системних компонентів Kubernetes. [klog](https://github.com/kubernetes/klog) генерує повідомлення логу для системних компонентів Kubernetes.

Kubernetes знаходиться в процесі спрощення реєстрації подій у своїх компонентах. Наступні прапорці командного рядка klog [є застарілими](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components) починаючи з Kubernetes v1.23 і будуть видалені у Kubernetes v1.26:

- `--add-dir-header`
- `--alsologtostderr`
- `--log-backtrace-at`
- `--log-dir`
- `--log-file`
- `--log-file-max-size`
- `--logtostderr`
- `--one-output`
- `--skip-headers`
- `--skip-log-headers`
- `--stderrthreshold`

Вивід буде завжди записуватися у stderr, незалежно від формату виводу. Очікується, що перенаправлення виводу буде оброблено компонентом, який викликає компонент Kubernetes. Це може бути оболонка POSIX або інструмент, такий як systemd.

У деяких випадках, наприклад, у контейнері distroless або службі Windows, ці параметри недоступні. У цьому випадку можна використовувати бінарний файл [`kube-log-runner`](https://github.com/kubernetes/kubernetes/blob/d2a8a81639fcff8d1221b900f66d28361a170654/staging/src/k8s.io/component-base/logs/kube-log-runner/README.md) як обгортку навколо компонента Kubernetes для перенаправлення виводу. Вже скомпільований бінарний файл включено в декілька базових образів Kubernetes під його традиційною назвою `/go-runner` та як `kube-log-runner` в архівах випусків сервера та вузла.

Ця таблиця показує відповідність викликів `kube-log-runner` перенаправленню оболонки:

| Використання                               | POSIX оболонка (напр. bash) | `kube-log-runner <options> <cmd>`                           |
| -------------------------------------------|-------------------------------|-------------------------------------------------------------|
| Обʼєднати stderr і stdout, записати у stdout| `2>&1`                        | `kube-log-runner` (типова поведінка)                        |
| Перенаправити обидва в лог               | `1>>/tmp/log 2>&1`            | `kube-log-runner -log-file=/tmp/log`                        |
| Скопіювати в лог і до stdout             | `2>&1 \| tee -a /tmp/log`     | `kube-log-runner -log-file=/tmp/log -also-stdout`           |
| Перенаправити лише stdout в лог         | `>/tmp/log`                   | `kube-log-runner -log-file=/tmp/log -redirect-stderr=false` |

### Вивід klog {#klog-output}

Приклад традиційного формату виводу klog:

```log
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

Рядок повідомлення може містити перенесення рядків:

```log
I1025 00:15:15.525108       1 example.go:79] This is a message
which has a line break.
```

### Структуроване ведення логів {#structured-logging}

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< warning >}}
Перехід до структурованого формату ведення логів є поточним процесом. Не всі повідомлення логів мають структурований формат у цій версії. Під час обробки логів вам також доведеться працювати з неструктурованими повідомленнями логів.

Форматування логів та серіалізація значень можуть змінюватися.
{{< /warning>}}

Структуроване ведення логів вводить єдину структуру в повідомлення логів, що дозволяє програмно отримувати інформацію. Ви можете зберігати та обробляти структуровані логи з меншими зусиллями та витратами. Код, який генерує повідомлення логів, визначає, чи використовує він традиційний неструктурований вивід klog, чи структуроване ведення логів.

Формат структурованих повідомлень логів є типово текстовим, у форматі, який зберігає сумісність з традиційним klog:

```none
<klog заголовок> "<повідомлення>" <ключ1>="<значення1>" <ключ2>="<значення2>" ...
```

Приклад:

```log
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

Рядки беруться в лапки. Інші значення форматуються за допомогою [`%+v`](https://pkg.go.dev/fmt#hdr-Printing), що може призводити до того, що повідомлення логів продовжуватимуться на наступному рядку [залежно від даних](https://github.com/kubernetes/kubernetes/issues/106428).

```console
I1025 00:15:15.525108       1 example.go:116] "Example" data="This is text with a line break\nand \"quotation marks\"." someInt=1 someFloat=0.1 someStruct={StringField: First line,
second line.}
```

### Контекстне ведення логів {#contextual-logging}

{{< feature-state for_k8s_version="v1.30" state="beta" >}}

Контекстне ведення логів базується на структурованому веденні логів. Це переважно стосується того, як розробники використовують системні виклики ведення логів: код, побудований на цьому концепті, є більш гнучким і підтримує додаткові варіанти використання, як описано в [KEP щодо контекстного ведення логів](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging).

Якщо розробники використовують додаткові функції, такі як `WithValues` або `WithName`, у своїх компонентах, то записи в журнал міститимуть додаткову інформацію, яка передається у функції своїм абонентам.

Для Kubernetes Kubernetes {{< skew currentVersion >}}, це керується через [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `ContextualLogging`, що є типово увімкненою. Інфраструктура для цього була додана в 1.24 без модифікації компонентів. Команда [`component-base/logs/example`](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go) показує, як використовувати нові виклики ведення логів та як компонент поводиться, якщо він підтримує контекстне ведення логів.

```console
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  Набір пар ключ=значення, які описують feature gate для експериментальних функцій. Опції:
                                     AllAlpha=true|false (ALPHA - стандартно=false)
                                     AllBeta=true|false (BETA - стандартно=false)
                                     ContextualLogging=true|false (BETA - default=true)
$ go run . --feature-gates ContextualLogging=true
...
I0222 15:13:31.645988  197901 example.go:54] "runtime" logger="example.myname" foo="bar" duration="1m0s"
I0222 15:13:31.646007  197901 example.go:55] "another runtime" logger="example" foo="bar" duration="1h0m0s" duration="1m0s"
```

Ключ `logger` та `foo="bar"` були додані абонентом функції, яка записує повідомлення `runtime` та значення `duration="1m0s"`, без необхідності модифікувати цю функцію.

Коли контекстне ведення логів вимкнене, функції `WithValues` та `WithName` нічого не роблять, а виклики ведення логів пройшли через глобальний реєстратор klog. Отже, ця додаткова інформація більше не виводиться в журнал:

```console
$ go run . --feature-gates ContextualLogging=false
...
I0222 15:14:40.497333  198174 example.go:54] "runtime" duration="1m0s"
I0222 15:14:40.497346  198174 example.go:55] "another runtime" duration="1h0m0s" duration="1m0s"
```

### Формат логу у форматі JSON {#json-log-format}

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{<warning >}}
Вивід у форматі JSON не підтримує багато стандартних прапорців klog. Для списку непідтримуваних прапорців klog дивіться [Посібник командного рядка](/docs/reference/command-line-tools-reference/).

Не всі логи гарантовано будуть записані у форматі JSON (наприклад, під час запуску процесу). Якщо ви плануєте розбирати логи, переконайтеся, що можете обробити також рядки логу, які не є JSON.

Назви полів та серіалізація JSON можуть змінюватися.
{{< /warning >}}

Прапорець `--logging-format=json` змінює формат логу з власного формату klog на формат JSON. Приклад формату логу у форматі JSON (форматований для зручності):

```json
{
   "ts": 1580306777.04728,
   "v": 4,
   "msg": "Pod status updated",
   "pod":{
      "name": "nginx-1",
      "namespace": "default"
   },
   "status": "ready"
}
```

Ключі з особливим значенням:

- `ts` — відмітка часу у форматі Unix (обовʼязково, дійсне число)
- `v` — деталізація (тільки для інформаційних повідомлень, а не для повідомлень про помилки, ціле число)
- `err` — рядок помилки (необовʼязково, рядок)
- `msg` — повідомлення (обовʼязково, рядок)

Список компонентів, що наразі підтримують формат JSON:

- {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
- {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
- {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
- {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### Рівень деталізації логів {#log-verbosity-level}

Прапорець `-v` керує рівнем деталізації логу. Збільшення значення збільшує кількість зареєстрованих подій. Зменшення значення зменшує кількість зареєстрованих подій. Збільшення рівнів деталізації записує все менш важливі події. На рівні деталізації 0 журнал реєструє лише критичні події.

### Розташування логів {#log-location}

Існують два типи системних компонентів: ті, які працюють у контейнері, та ті, які не працюють у контейнері. Наприклад:

- Планувальник Kubernetes та kube-proxy працюють у контейнері.
- kubelet та {{<glossary_tooltip term_id="container-runtime" text="середовище виконання контейнерів">}} не працюють у контейнерах.

На машинах з systemd, kubelet та середовище виконання контейнерів записують логи в journald. В іншому випадку вони записуються в файли `.log` в теці `/var/log`. Системні компоненти всередині контейнерів завжди записуються в файли `.log` у теці `/var/log`, обходячи типовий механізм ведення логу. Аналогічно логам контейнерів, вам слід регулярно виконувати ротацію логів системних компонентів у теці `/var/log`. У кластерах Kubernetes, створених сценарієм `kube-up.sh`, ротація логів налаштована за допомогою інструменту `logrotate`. Інструмент `logrotate` виконує ротацію логів щоденно або якщо розмір логу перевищує 100 МБ.

## Отримання логів {#log-query}

{{< feature-state feature_gate_name="NodeLogQuery" >}}

Для допомоги у розвʼязанні проблем на вузлах Kubernetes версії v1.27 введено функцію, яка дозволяє переглядати логи служб, що працюють на вузлі. Щоб скористатися цією функцією, переконайтеся, що для цього вузла увімкнути [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `NodeLogQuery`, а також що параметри конфігурації kubelet `enableSystemLogHandler` та `enableSystemLogQuery` обидва встановлені в значення true. На Linux ми припускаємо, що логи служб доступні через journald. На Windows ми припускаємо, що логи служб доступні в постачальнику логів застосунків. В обох операційних системах логи також доступні за допомогою читання файлів у теці `/var/log/`.

Якщо у вас є дозвіл на взаємодію з обʼєктами Node, ви можете спробувати цю функцію на всіх ваших вузлах або лише на їх підмножині. Ось приклад отримання логу служби kubelet з вузла:

```shell
# Отримати логи kubelet з вузла під назвою node-1.example
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```

Ви також можете отримувати файли, за умови, що файли знаходяться в теці, для якої kubelet дозволяє читання логів. Наприклад, ви можете отримати лог з `/var/log/` на вузлі Linux:

```shell
kubectl get --raw "/api/v1/nodes/<назва-вузла>/proxy/logs/?query=/<назва-файлу-логу>"
```

Kubelet використовує евристику для отримання логів. Це допомагає, якщо ви не знаєте, чи даний системний сервіс записує логи до стандартного реєстратора операційної системи, такого як journald, чи до файлу логу у `/var/log/`. Спочатку евристика перевіряє стандартний реєстратор, а якщо його немає, вона намагається отримати перші логи з `/var/log/<імʼя-служби>` або `/var/log/<назва-служби>.log` або `/var/log/<назва-служби>/<назва-служби>.log`.

Повний перелік параметрів, які можна використовувати:

Опція  | Опис
------ | -----------
`boot` | показує повідомлення про завантаження з певного завантаження системи
`pattern` | фільтрує записи логу за заданим регулярним виразом, сумісним з Perl
`query` | вказує службу(и) або файли, з яких слід повернути логи (обовʼязково)
`sinceTime` | час відображення логу, починаючи з [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) (включно)
`untilTime` | час до якого показувати логи, за [RFC3339](https://www.rfc-editor.org/rfc/rfc3339) (включно)
`tailLines` | вказує, скільки рядків з кінця логу отримати; типово отримується весь журнал

Приклад складнішого запиту:

```shell
# Отримати логи kubelet з вузла під назвою node-1.example, у яких є слово "error"
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```

## {{% heading "whatsnext" %}}

- Дізнайтеся про [Архітектуру логів Kubernetes](/docs/concepts/cluster-administration/logging/)
- Дізнайтеся про [Структуроване ведення логу](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
- Дізнайтеся про [Контекстне ведення логу](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
- Дізнайтеся про [застарілі прапорці klog](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
- Дізнайтеся про [Умови ведення логу за важливістю](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
- Дізнайтеся про [Log Query](https://kep.k8s.io/2258)
