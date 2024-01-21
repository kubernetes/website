---
title: Логи системных компонентов
content_type: concept
weight: 60
---

<!-- overview -->

Логи системных компонентов регистрируют события, происходящие в кластере, что может быть очень полезно при отладке. Степень детализации логов настраивается. Так, в логах низкой детализации будет содержаться только информация об ошибках внутри компонента, в то время как логи высокой детализации будут содержать пошаговую трассировку событий (доступ по HTTP, изменения состояния Pod'а, действия контроллера, решения планировщика).

<!-- body -->

## Klog

[klog](https://github.com/kubernetes/klog) — библиотека Kubernetes для сбора логов. Отвечает за генерацию соответствующих сообщений для системных компонентов оркестратора.

Дополнительные сведения о настройке klog можно получить в [Справке по CLI](/docs/reference/command-line-tools-reference/).

В настоящее время ведется работа по упрощению процесса сбора логов в компонентах Kubernetes. Приведенные ниже флаги командной строки klog [устарели](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components), начиная с версии Kubernetes 1.23, и будут удалены в одном из будущих релизов:

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

Вывод всегда будет записываться в stderr независимо от его формата. Перенаправление вывода должно осуществляться компонентом, который вызывает компонент Kubernetes, например, POSIX-совместимой командной оболочкой или инструментом вроде systemd.

Иногда эти опции недоступны — например, в случае контейнера без дистрибутива (distroless) или системной службы Windows. Тогда [`kube-log-runner`](https://github.com/kubernetes/kubernetes/blob/d2a8a81639fcff8d1221b900f66d28361a170654/staging/src/k8s.io/component-base/logs/kube-log-runner/README.md) можно использовать в качестве обертки вокруг компонента Kubernetes для перенаправления вывода. Его предварительно собранный исполняемый файл включен в некоторые базовые образы Kubernetes под старым именем `/go-runner`, а в актуальных бинарных релизах архивов с kubernetes-server и kubernetes-node он называется `kube-log-runner`.

В таблице ниже показаны соответствия между вызовами `kube-log-runner` и логикой перенаправления командной оболочки:

| Использование                                | Оболочка POSIX (например, Bash) | `kube-log-runner <options> <cmd>`                             |
| ---------------------------------------------|---------------------------------|---------------------------------------------------------------|
| Объединить stderr и stdout, вывести в stdout | `2>&1`                          | `kube-log-runner` (default behavior)                           |
| Перенаправить оба потока в файл лога         | `1>>/tmp/log 2>&1`              | `kube-log-runner -log-file=/tmp/log`                           |
| Скопировать в файл лога и в stdout           | `2>&1 \| tee -a /tmp/log`       | `kube-log-runner -log-file=/tmp/log -also-stdout`       |
| Перенаправить только stdout в файл лога      | `>/tmp/log`                     | `kube-log-runner -log-file=/tmp/log -redirect-stderr=false` |

### Вывод klog

Пример оригинального "родного" формата klog:
```
I1025 00:15:15.525108       1 httplog.go:79] GET /api/v1/namespaces/kube-system/pods/metrics-server-v0.3.1-57c75779f-9p8wg: (1.512ms) 200 [pod_nanny/v0.0.0 (linux/amd64) kubernetes/$Format 10.56.1.19:51756]
```

Сообщение может содержать переносы строк:
```
I1025 00:15:15.525108       1 example.go:79] This is a message
which has a line break.
```


### Структурированное логирование

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< warning >}}
Переход на структурированное логирование — продолжающийся процесс. Не все сообщения структурированы в текущей версии Kubernetes. При парсинге файлов логов необходимо также обрабатывать неструктурированные сообщения.

Формат логов и сериализация значений могут измениться в будущем. 
{{< /warning>}}

Структурированное логирование придает определенную структуру сообщениям логов, упрощая программное извлечение информации и сокращая затраты и усилия на их обработку. Код, который генерирует сообщение лога, определяет, используется ли обычный неструктурированный вывод klog или структурированное логирование.

По умолчанию структурированные сообщения форматируются как текст, при этом его формат обратно совместим с традиционным форматом klog:

```ini
<klog header> "<message>" <key1>="<value1>" <key2>="<value2>" ...
```

Пример:

```ini
I1025 00:15:15.525108       1 controller_utils.go:116] "Pod status updated" pod="kube-system/kubedns" status="ready"
```

Строки заключаются в кавычки. Другие значения форматируются с помощью [`%+v`](https://pkg.go.dev/fmt#hdr-Printing). В результате сообщение может продолжиться на следующей строке в [зависимости от типа данных](https://github.com/kubernetes/kubernetes/issues/106428).

```
I1025 00:15:15.525108       1 example.go:116] "Example" data="This is text with a line break\nand \"quotation marks\"." someInt=1 someFloat=0.1 someStruct={StringField: First line,
second line.}
```

### Контекстное логирование

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

Контекстное логирование базируется на структурированном логировании. Речь идет в первую очередь о том, как разработчики используют лог-вызовы: код, основанный на этой концепции, более гибок и поддерживает дополнительные сценарии использования (см. [Contextual Logging KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)).

При использовании в компонентах дополнительных функций, таких как `WithValues` или `WithName`, записи лога содержат дополнительную информацию, которая передается в функции вызывающей стороной.

В настоящее время за включение контекстного логирования отвечает переключатель функционала `StructuredLogging`. По умолчанию оно отключено. Соответствующая инфраструктура появилась в версии 1.24 и она не потребовала изменений в компонентах. Команда [`component-base/logs/example`](https://github.com/kubernetes/kubernetes/blob/v1.24.0-beta.0/staging/src/k8s.io/component-base/logs/example/cmd/logger.go) показывает, как использовать новые лог-вызовы и как ведет себя компонент, поддерживающий контекстное логирование.

```console
$ cd $GOPATH/src/k8s.io/kubernetes/staging/src/k8s.io/component-base/logs/example/cmd/
$ go run . --help
...
      --feature-gates mapStringBool  A set of key=value pairs that describe feature gates for alpha/experimental features. Options are:
                                     AllAlpha=true|false (ALPHA - default=false)
                                     AllBeta=true|false (BETA - default=false)
                                     ContextualLogging=true|false (ALPHA - default=false)
$ go run . --feature-gates ContextualLogging=true
...
I0404 18:00:02.916429  451895 logger.go:94] "example/myname: runtime" foo="bar" duration="1m0s"
I0404 18:00:02.916447  451895 logger.go:95] "example: another runtime" foo="bar" duration="1m0s"
```

Префикс `example` и `foo="bar"` были добавлены вызовом функции, которая пишет в лог сообщение `runtime` и значение `duration="1m0s"`, при этом вносить изменения в эту функцию не потребовалось.

При отключенном контекстном логировании `WithValues` и `WithName` ничего не делают, а вызовы журнала проходят через глобальный логгер klog. Соответственно, эта дополнительная информация более не отображается в логе:

```console
$ go run . --feature-gates ContextualLogging=false
...
I0404 18:03:31.171945  452150 logger.go:94] "runtime" duration="1m0s"
I0404 18:03:31.171962  452150 logger.go:95] "another runtime" duration="1m0s"
```

### Логи в формате JSON

{{< feature-state for_k8s_version="v1.19" state="alpha" >}}

{{<warning >}}
Вывод в формате JSON не поддерживает многие стандартные флаги klog. Список неподдерживаемых флагов klog см. в [Справочнике по CLI](/docs/reference/command-line-tools-reference/).

Кроме того, запись в формате JSON не гарантируется (например, во время запуска процесса). Таким образом, если планируется дальнейший парсинг логов, убедитесь, что ваш парсер способен обрабатывать строки лога, которые не являются JSON.

Имена полей и сериализация JSON могут измениться в будущем.
{{< /warning >}}

Флаг `--logging-format=json` переключает формат логов с родного формата klog на JSON. Пример лога в формате JSON (стилистически отформатированном):
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

Специальные ключи:
* `ts` — временная метка в формате времени Unix (обязательный параметр, float);
* `v` — детализация (для общей информации — не для сообщений об ошибках, int);
* `err` — ошибка (опциональный параметр, string);
* `msg` — сообщение (обязательный параметр, string).


Список компонентов, поддерживающих формат JSON:
* {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
* {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}
* {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
* {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}

### Уровень детализации лога

Флаг `-v` задает степень детализации лога. Увеличение значения увеличивает количество регистрируемых событий. Уменьшение значения уменьшает количество регистрируемых событий. Увеличение детализации приводит к тому, что регистрируются все менее значимые события. При уровне детализации, равном 0, регистрируются только критические события.

### Местоположение лога

Существует два типа системных компонентов: те, которые работают в контейнере, и те, которые работают за пределами контейнера. Например:

* Планировщик Kubernetes и kube-proxy работают в контейнере.
* kubelet и {{<glossary_tooltip term_id="container-runtime" text="среда исполнения для контейнеров">}}
  работают за пределами контейнеров.

На машинах с systemd среда исполнения и kubelet пишут в journald. В противном случае ведется запись в файлы `.log` в директории `/var/log`. Системные компоненты внутри контейнеров всегда пишут в файлы `.log` в директории `/var/log`, обходя механизм логирования по умолчанию. Как и логи контейнеров, логи системных компонентов в `/var/log` нуждаются в ротации. В кластерах Kubernetes, созданных с использованием скрипта `kube-up.sh`, ротация логов настраивается с помощью инструмента `logrotate`. `logrotate` ротирует логи ежедневно или при достижении ими размера в 100 МБ.

## {{% heading "whatsnext" %}}

* [Архитектура логирования в Kubernetes](/docs/concepts/cluster-administration/logging/)
* [Структурированное логирование (EN)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/1602-structured-logging)
* [Контекстное логирование (EN)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/3077-contextual-logging)
* [Вывод флагов klog из эксплуатации (EN)](https://github.com/kubernetes/enhancements/tree/master/keps/sig-instrumentation/2845-deprecate-klog-specific-flags-in-k8s-components)
* [Соглашения и правила для определения критичности логов (EN)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md)
