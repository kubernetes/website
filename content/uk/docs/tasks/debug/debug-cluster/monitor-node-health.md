---
title: Відстеження стану вузлів
content_type: task
weight: 20
---

<!-- overview -->

*Node Problem Detector* — це демон для моніторингу стану вузла та звітування про нього. Node Problem Detector можна запустити як `DaemonSet` або як окремий демон. Node Problem Detector збирає інформацію про проблеми вузла з різних демонів і повідомляє про ці стани API-серверу як [стани](/docs/concepts/architecture/nodes/#condition) вузла або як [події](/docs/reference/kubernetes-api/cluster-resources/event-v1).

Щоб дізнатися, як встановити й використовувати Node Problem Detector, дивіться [документацію проєкту Node Problem Detector](https://github.com/kubernetes/node-problem-detector).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Обмеження {#limitations}

* Node Problem Detector використовує формат логу ядра для повідомлення про проблеми ядра. Щоб дізнатися, як розширити формат логу ядра, дивіться [Додавання підтримки іншого формату логів](#support-other-log-format).

## Увімкнення Node Problem Detector {#enabling-node-problem-detector}

Деякі хмарні постачальники вмикають Node Problem Detector як {{< glossary_tooltip text="надбудову" term_id="addons" >}}. Ви також можете увімкнути Node Problem Detector за допомогою `kubectl` або створивши DaemonSet надбудови.

### Використання kubectl для увімкнення Node Problem Detector {#using-kubectl}

`kubectl` дає найгнучкіше керування Node Problem Detector. Ви можете перезаписати стандартну конфігурацію, щоб пристосувати її до свого середовища або виявляти власні проблеми вузла. Наприклад:

1. Створіть конфігурацію Node Problem Detector, аналогічну `node-problem-detector.yaml`:

   {{% code_sample file="debug/node-problem-detector.yaml" %}}

   {{< note >}}
   Перевірте, чи тека системного логу правильна для дистрибутиву вашої операційної системи.
   {{< /note >}}

1. Запустіть Node Problem Detector за допомогою `kubectl`:

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```

### Використання Podʼа надбудови для увімкнення Node Problem Detector {#using-addon-pod}

Якщо ви використовуєте власне рішення для початкового налаштування кластера й вам не потрібно перезаписувати стандартну конфігурацію, ви можете скористатися Podʼом надбудови, щоб ще більше автоматизувати розгортання.

Створіть `node-problem-detector.yaml` та збережіть конфігурацію в теці Podʼа надбудови `/etc/kubernetes/addons/node-problem-detector` на вузлі панелі управління.

## Перезапис конфігурації {#overwrite-the-configuration}

[Стандартна конфігурація](https://github.com/kubernetes/node-problem-detector/tree/v0.8.12/config) вбудовується під час збирання Docker-образу Node Problem Detector.

Однак ви можете використовувати [`ConfigMap`](/docs/tasks/configure-pod-container/configure-pod-configmap/) для перезапису конфігурації:

1. Змініть файли конфігурації в `config/`.
1. Створіть `ConfigMap` `node-problem-detector-config`:

   ```shell
   kubectl create configmap node-problem-detector-config --from-file=config/
   ```

1. Змініть `node-problem-detector.yaml`, щоб використовувати `ConfigMap`:

   {{% code_sample file="debug/node-problem-detector-configmap.yaml" %}}

1. Перестворіть Node Problem Detector з новим файлом конфігурації:

   ```shell
   # Якщо у вас працює node-problem-detector, видаліть його перед перестворенням
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```

{{< note >}}
Цей підхід застосовується тільки до Node Problem Detector, запущеного за допомогою `kubectl`.
{{< /note >}}

Перезапис конфігурації не підтримується, якщо Node Problem Detector працює як надбудова кластера. Менеджер надбудов не підтримує `ConfigMap`.

## Демони проблем {#problem-daemons}

Демон проблем — це піддемон Node Problem Detector. Він моніторить певні види проблем вузла та повідомляє про них Node Problem Detector. Існує кілька типів підтримуваних демонів проблем.

- Демон типу `SystemLogMonitor` відстежує системні логи й повідомляє про проблеми та метрики згідно з попередньо визначеними правилами. Ви можете налаштувати конфігурації для різних джерел логів, таких як [filelog](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-filelog.json), [kmsg](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor.json), [kernel](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-counter.json), [abrt](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/abrt-adaptor.json) і [systemd](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/systemd-monitor-counter.json).

- Демон типу `SystemStatsMonitor` збирає різні системні статистичні дані, повʼязані зі справністю, як метрики. Його поведінку можна налаштувати, оновивши його [файл конфігурації](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/system-stats-monitor.json).

- Демон типу `CustomPluginMonitor` викликає та перевіряє різні проблеми вузла, запускаючи сценарії, визначені користувачем. Ви можете використовувати різні власні втулки моніторингу для відстеження різних проблем і налаштовувати поведінку демона, оновивши [файл конфігурації](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/custom-plugin-monitor.json).

- Демон типу `HealthChecker` перевіряє справність kubelet і середовища виконання контейнерів на вузлі.

### Додавання підтримки іншого формату логів {#support-other-log-format}

Монітор системного логу наразі підтримує файлові логи, journald та kmsg. Додаткові джерела можна додати, реалізувавши новий [спостерігач за логами](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/pkg/systemlogmonitor/logwatchers/types/log_watcher.go).

### Додавання власних втулків моніторингу {#adding-custom-plugin-monitors}

Ви можете розширити Node Problem Detector, щоб він виконував будь-які сценарії моніторингу, написані будь-якою мовою, розробивши власний втулок. Сценарії моніторингу мають відповідати протоколу втулка щодо коду виходу та стандартного виводу. Докладніше дивіться [пропозицію інтерфейсу втулка](https://docs.google.com/document/d/1jK_5YloSYtboj-DtfjmYKxfNnUxCAvohLnsH5aGCAYQ/edit#).

## Експортер {#exporter}

Експортер повідомляє про проблеми та/або метрики вузлів певним бекендам. Підтримуються такі експортери:

- **Експортер Kubernetes**: цей експортер повідомляє про проблеми вузлів API-серверу Kubernetes. Тимчасові проблеми повідомляються як події (Events), а постійні — як стани вузла (Node Conditions).

- **Експортер Prometheus**: цей експортер локально повідомляє про проблеми вузлів і метрики як метрики Prometheus (або OpenMetrics). IP-адресу й порт експортера можна вказати аргументами командного рядка.

- **Експортер Stackdriver**: цей експортер повідомляє про проблеми вузлів і метрики до Stackdriver Monitoring API. Поведінку експорту можна налаштувати за допомогою [файлу конфігурації](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/exporter/stackdriver-exporter.json).

<!-- discussion -->

## Рекомендації та обмеження {#recommendations-and-restrictions}

Рекомендується запускати Node Problem Detector у кластері для моніторингу стану вузлів. Під час роботи Node Problem Detector можна очікувати додаткових витрат ресурсів на кожному вузлі. Зазвичай це прийнятно, оскільки:

* Лог ядра росте відносно повільно.
* Для Node Problem Detector встановлено обмеження ресурсів.
* Навіть під високим навантаженням використання ресурсів прийнятне. Докладніше дивіться [результати бенчмарку](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629) Node Problem Detector.
