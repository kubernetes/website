---
title: Системні логи
content_type: concept
weight: 80
---

<!-- overview -->

Логи системних компонентів фіксують події, що відбуваються в кластері, і це може бути дуже корисно для налагодження. Ви можете налаштувати рівень деталізації логів, щоб бачити більше або менше подробиць. Логи можуть бути як грубозернистими, показуючи лише помилки в компоненті, так і дрібнозернистими, показуючи покрокове трасування подій (наприклад, логи доступу HTTP, зміни стану Podʼів, дії контролерів або рішення планувальника).

<!-- body -->

{{< warning >}}
На відміну від описаних тут прапорців командного рядка, сам *вивід логів* *не* підпадає під гарантії стабільності API Kubernetes: окремі записи логів та їх форматування можуть змінюватися від випуску до випуску!
{{< /warning >}}

## Klog

klog — це бібліотека логування Kubernetes. [klog](https://github.com/kubernetes/klog) генерує повідомлення логів для системних компонентів Kubernetes.

Kubernetes поступово спрощує логування у своїх компонентах. Наведені нижче прапорці командного рядка klog [застаріли](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components), починаючи з Kubernetes v1.23, і вилучені в Kubernetes v1.26:

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

Вивід завжди записується у stderr незалежно від формату виводу. Очікується, що перенаправленням виводу займається компонент, який викликає компонент Kubernetes. Це може бути оболонка POSIX або інструмент на кшталт systemd.

У деяких випадках, наприклад у контейнері distroless або системній службі Windows, ці варіанти недоступні. Тоді можна використати бінарний файл [`kube-log-runner`](https://github.com/kubernetes/kubernetes/blob/d2a8a81639fcff8d1221b900f66d28361a170654/staging/src/k8s.io/component-base/logs/kube-log-runner/README.md) як обгортку навколо компонента Kubernetes для перенаправлення виводу. Попередньо зібраний бінарний файл входить до кількох базових образів Kubernetes під традиційною назвою `/go-runner` і як `kube-log-runner` в архівах випусків для сервера та вузлів.

Ця таблиця показує відповідність викликів `kube-log-runner` перенаправленню в оболонці:

| Використання                                 | Оболонка POSIX (наприклад, bash) | `kube-log-runner <options> <cmd>`                           |
| ---------------------------------------------|----------------------------------|-------------------------------------------------------------|
| Обʼєднати stderr і stdout, записати в stdout | `2>&1`                           | `kube-log-runner` (стандартна поведінка)                    |
| Перенаправити обидва у файл логу             | `1>>/tmp/log 2>&1`               | `kube-log-runner -log-file=/tmp/log`                        |
| Скопіювати у файл логу та в stdout           | `2>&1 \| tee -a /tmp/log`        | `kube-log-runner -log-file=/tmp/log -also-stdout`           |
| Перенаправити лише stdout у файл логу        | `>/tmp/log`                      | `kube-log-runner -log-file=/tmp/log -redirect-stderr=false` |

### Вивід klog {#klog-output}

Приклад традиційного власного формату klog:

```log
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

Рядок повідомлення може містити перенесення рядків:

```log
I1025 00:15:15.525108       1 example.go:79] This is a message
which has a line break.
```

### Структуроване логування {#structured-logging}

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< warning >}}
Міграція на структуровані повідомлення логів — поточний процес. У цій версії не всі повідомлення логів структуровані. Під час розбору файлів логів потрібно також обробляти неструктуровані повідомлення логів.

Форматування логів та серіалізація значень можуть змінюватися.
{{< /warning >}}

Структуроване логування додає до повідомлень логів єдину структуру, що дає змогу отримувати з них інформацію програмно. Ви можете зберігати та обробляти структуровані логи з меншими зусиллями та витратами. Код, який генерує повідомлення логу, визначає, чи використовує він традиційний неструктурований вивід klog, чи структуроване логування.

Стандартно структуровані повідомлення логів форматуються як текст у форматі, зворотно сумісному з традиційним klog:

```none
<klog заголовок> "<повідомлення>" <ключ1>="<значення1>" <ключ2>="<значення2>" ...
```

Приклад:

```log
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

Рядки беруться в лапки. Інші значення форматуються за допомогою [`%+v`](https://pkg.go.dev/fmt#hdr-Printing), через що повідомлення логів можуть продовжуватися на наступному рядку [залежно від даних](https://github.com/kubernetes/kubernetes/issues/106428).

```console
I1025 00:15:15.525108       1 example.go:116] "Example" data="This is text with a line break\nand \"quotation marks\"." someInt=1 someFloat=0.1 someStruct={StringField: First line,
second line.}
```

### Контекстне логування {#contextual-logging}

{{< feature-state for_k8s_version="v1.30" state="beta" >}}

Контекстне логування побудоване на основі структурованого логування. Це переважно стосується того, як розробники використовують виклики логування: код, побудований на цій концепції, гнучкіший і підтримує додаткові сценарії використання, описані в [KEP про контекстне логування](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging).

Якщо розробники використовують у своїх компонентах додаткові функції, такі як `WithValues` або `WithName`, то записи логів міститимуть додаткову інформацію, яку передає у функції код, що їх викликає.

У Kubernetes {{< skew currentVersion >}} це керується функціональною можливістю [`ContextualLogging`](/docs/reference/command-line-tools-reference/feature-gates/#ContextualLogging), яку стандартно ввімкнено. Інфраструктуру для цього додано у версії 1.24 без змін у компонентах. Команда [`component-base/logs/example`](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go) показує, як використовувати нові виклики логування та як поводиться компонент, що підтримує контекстне логування.

```console
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     ContextualLogging=true|false (BETA - default=true)
$ go run . --feature-gates ContextualLogging=true
...
I0222 15:13:31.645988  197901 example.go:54] "runtime" logger="example.myname" foo="bar" duration="1m0s"
I0222 15:13:31.646007  197901 example.go:55] "another runtime" logger="example" foo="bar" duration="1h0m0s" duration="1m0s"
```

Ключ `logger` та `foo="bar"` додано кодом, що викликає функцію, яка записує повідомлення `runtime` і значення `duration="1m0s"`, без потреби змінювати цю функцію.

Коли контекстне логування вимкнено, `WithValues` і `WithName` нічого не роблять, а виклики логування проходять через глобальний логер klog. Тому цієї додаткової інформації більше немає у виводі логів:

```console
$ go run . --feature-gates ContextualLogging=false
...
I0222 15:14:40.497333  198174 example.go:54] "runtime" duration="1m0s"
I0222 15:14:40.497346  198174 example.go:55] "another runtime" duration="1h0m0s" duration="1m0s"
```

### Формат логів JSON {#json-log-format}

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{< warning >}}
Вивід у форматі JSON не підтримує багато стандартних прапорців klog. Перелік непідтримуваних прапорців klog дивіться в [довідці щодо інструментів командного рядка](/docs/reference/command-line-tools-reference/).

Не всі логи гарантовано записуються у форматі JSON (наприклад, під час запуску процесу). Якщо ви плануєте розбирати логи, переконайтеся, що можете обробляти й рядки логів, які не є JSON.

Назви полів та серіалізація JSON можуть змінюватися.
{{< /warning >}}

Прапорець `--logging-format=json` змінює формат логів із власного формату klog на формат JSON. Приклад логу у форматі JSON (відформатований для зручності читання):

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

- `ts` — позначка часу у форматі Unix (обовʼязково, дійсне число)
- `v` — рівень деталізації (лише для інформаційних повідомлень, не для повідомлень про помилки, ціле число)
- `err` — рядок помилки (необовʼязково, рядок)
- `msg` — повідомлення (обовʼязково, рядок)

Перелік компонентів, які наразі підтримують формат JSON:

- {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
- {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
- {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
- {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### Рівень деталізації логів {#log-verbosity-level}

Прапорець `-v` керує рівнем деталізації логів. Збільшення значення збільшує кількість подій, що логуються. Зменшення значення зменшує кількість подій, що логуються. Вищі рівні деталізації додають до логів дедалі менш важливі події. На рівні деталізації 0 логуються лише критичні події.

### Розташування логів {#log-location}

Є два види системних компонентів: ті, що працюють у контейнері, і ті, що не працюють у контейнері. Наприклад:

- Планувальник Kubernetes та kube-proxy працюють у контейнері.
- kubelet та {{<glossary_tooltip term_id="container-runtime" text="середовище виконання контейнерів">}} не працюють у контейнерах.

На машинах із systemd kubelet і середовище виконання контейнерів пишуть у journald. В іншому разі вони пишуть у файли `.log` у теці `/var/log`. Системні компоненти всередині контейнерів завжди пишуть у файли `.log` у теці `/var/log`, оминаючи стандартний механізм логування. Як і для логів контейнерів, вам слід виконувати ротацію логів системних компонентів у теці `/var/log`. У кластерах Kubernetes, створених сценарієм `kube-up.sh`, ротацію логів налаштовано за допомогою інструмента `logrotate`. Інструмент `logrotate` виконує ротацію логів щодня або коли розмір логу перевищує 100MB.

## Запит логів {#log-query}

{{< feature-state feature_gate_name="NodeLogQuery" >}}

Можливість Log Query допомагає налагоджувати проблеми на вузлах Linux і Windows. Запроваджена в Kubernetes v1.27, вона дозволяє переглядати логи сервісів, що працюють на вузлі. Щоб скористатися цією можливістю, переконайтеся, що для цільового вузла обидва параметри конфігурації kubelet `enableSystemLogHandler` та `enableSystemLogQuery` встановлено в _true_.

У Kubernetes v1.36 ця можливість стала стабільною, і функціональну можливість [`NodeLogQuery`](/docs/reference/command-line-tools-reference/feature-gates/#NodeLogQuery) тепер зафіксовано в _true_, тобто її стандартно ввімкнено, а `enableSystemLogHandler` залишається єдиним параметром, потрібним для ввімкнення або вимкнення Log Query.

Стандартно `enableSystemLogHandler` має значення _false_, і його рекомендується залишати вимкненим, окрім випадків активного налагодження.

{{< warning >}}
Надання дозволів на `nodes/proxy` (навіть лише дозволу **get**) також відкриває доступ до потужних API kubelet, які можна використовувати для виконання команд у будь-якому контейнері, що працює на вузлі, тому будьте обережні з керуванням цими дозволами. Докладніше дивіться в розділі [Автентифікація/авторизація kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/#get-nodes-proxy-warning).
{{< /warning >}}

У Linux передбачається, що логи сервісів доступні через _journald_. У Windows передбачається, що логи сервісів доступні через провайдера логів застосунків. В обох операційних системах логи також доступні через читання файлів у `/var/log/`.

Якщо у вас є дозвіл на взаємодію з обʼєктами Node, ви можете спробувати цю можливість на всіх своїх вузлах або лише на їх частині. Ось приклад отримання логів сервісу kubelet із вузла:

```shell
# Отримати логи kubelet з вузла під назвою node-1.example
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet"
```

Ви також можете отримувати файли, якщо вони розташовані в теці, з якої kubelet дозволяє отримувати логи. Наприклад, можна отримати лог із `/var/log` на вузлі Linux:

```shell
kubectl get --raw "/api/v1/nodes/<назва-вузла>/proxy/logs/?query=/<назва-файлу-логу>"
```

kubelet використовує евристику для отримання логів. Це допомагає, якщо ви не знаєте, чи певний системний сервіс записує логи до власного логера операційної системи, такого як journald, чи до файлу логу в `/var/log/`. Евристика спочатку перевіряє власний логер, а якщо він недоступний, намагається отримати перші логи з `/var/log/<назва-сервісу>` або `/var/log/<назва-сервісу>.log` чи `/var/log/<назва-сервісу>/<назва-сервісу>.log`.

Повний перелік параметрів, які можна використовувати:

| Параметр    | Опис |
|-------------|------|
| `boot`      | показує повідомлення з певного завантаження системи |
| `pattern`   | фільтрує записи логів за вказаним регулярним виразом, сумісним із PERL |
| `query`     | вказує сервіс(и) або файли, з яких потрібно повернути логи (обовʼязково) |
| `sinceTime` | позначка часу [RFC3339](https://www.rfc-editor.org/rfc/rfc3339), починаючи з якої показувати логи (включно) |
| `untilTime` | позначка часу [RFC3339](https://www.rfc-editor.org/rfc/rfc3339), до якої показувати логи (включно) |
| `tailLines` | вказує, скільки рядків із кінця логу отримати; стандартно отримується весь лог |

Приклад складнішого запиту:

```shell
# Отримати логи kubelet з вузла під назвою node-1.example, у яких є слово "error"
kubectl get --raw "/api/v1/nodes/node-1.example/proxy/logs/?query=kubelet&pattern=error"
```

## {{% heading "whatsnext" %}} {#whats-next}

- Дізнайтеся про [архітектуру логування Kubernetes](/docs/concepts/cluster-administration/logging/)
- Дізнайтеся про [структуроване логування](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
- Дізнайтеся про [контекстне логування](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
- Дізнайтеся про [застарівання прапорців klog](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
- Дізнайтеся про [домовленості щодо рівнів важливості логування](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-instrumentation/logging.md)
- Дізнайтеся про [Log Query](https://kep.k8s.io/2258)
