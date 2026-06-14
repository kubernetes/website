---
title: Відстеження стану вузлів
content_type: завдання
weight: 20
---

<!-- overview -->

*Node Problem Detector* — це служба для моніторингу та звітування про стан вузла. Ви можете запустити Node Problem Detector як `DaemonSet` або окремий демон. Node Problem Detector збирає інформацію про проблеми вузла з різних демонів і повідомляє їх на сервер API як [стан вузла](/docs/concepts/architecture/nodes/#condition) або як [події](/docs/reference/kubernetes-api/cluster-resources/event-v1).

Для отримання інформації щодо встановлення та використання Node Problem Detector, див. [Документацію проєкту Node Problem Detector](https://github.com/kubernetes/node-problem-detector).

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Обмеження {#limitations}

* Node Problem Detector використовує формат логу ядра для повідомлення про проблеми ядра.
  Щоб дізнатися, як розширити формат логу ядра, див. [Додавання підтримки для іншого формату логу](#support-other-log-format).

## Увімкнення Node Problem Detector {#enabling-node-problem-detector}

Деякі хмарні постачальники увімкнуть Node Problem Detector як {{< glossary_tooltip text="надбудову" term_id="addons" >}}. Ви також можете увімкнути Node Problem Detector за допомогою `kubectl` або створити Addon DaemonSet.

### Використання kubectl для увімкнення Node Problem Detector {#using-kubectl}

`kubectl` надає найбільш гнучке керування Node Problem Detector. Ви можете перезаписати типову конфігурацію, щоб вона відповідала вашому середовищу або виявляла спеціалізовані проблеми вузла. Наприклад:

1. Створіть конфігурацію Node Problem Detector, аналогічну `node-problem-detector.yaml`:

   {{% code_sample file="debug/node-problem-detector.yaml" %}}

   {{< note >}}
   Вам слід перевірити, що тека системного логу є відповідною вашому дистрибутиву операційної системи.
   {{< /note >}}

2. Запустіть Node Problem Detector за допомогою `kubectl`:

   ```shell
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector.yaml
   ```

### Використання Podʼа надбудови для увімкнення Node Problem Detector {#using-addon-pod}

Якщо ви використовуєте власне рішення для ініціалізації кластера та не потребуєте перезапису типової конфігурації, ви можете скористатися Podʼом надбудови, щоб автоматизувати розгортання.

Створіть `node-problem-detector.yaml` та збережіть конфігурацію в теці Podʼа надбудови `/etc/kubernetes/addons/node-problem-detector` на вузлі панелі управління.

## Перезапис конфігурації {#overwrite-the-configuration}

[Типова конфігурація](https://github.com/kubernetes/node-problem-detector/tree/v0.8.12/config) вбудована під час збирання Docker-образу Node Problem Detector.

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
   # Якщо у вас вже працює Node Problem Detector, видаліть перед перстворенням
   kubectl delete -f https://k8s.io/examples/debug/node-problem-detector.yaml
   kubectl apply -f https://k8s.io/examples/debug/node-problem-detector-configmap.yaml
   ```

{{< note >}}
Цей підхід застосовується тільки до Node Problem Detector, запущеного за допомогою `kubectl`.
{{< /note >}}

Перезапис конфігурації не підтримується, якщо Node Problem Detector працює як надбудова кластера. Менеджер надбудов не підтримує `ConfigMap`.

## Демони проблем {#problem-daemons}

Демон проблем — це піддемон Node Problem Detector. Він моніторить певні види проблем вузла та повідомляє про них Node Problem Detector. Існує кілька типів підтримуваних демонів проблем.

* Тип демона `SystemLogMonitor` моніторить системні логи та повідомляє про проблеми та метрики згідно з попередньо визначеними правилами. Ви можете настроїти конфігурації для різних джерел логів таких як [filelog](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-filelog.json), [kmsg](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor.json), [kernel](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/kernel-monitor-counter.json), [abrt](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/abrt-adaptor.json), та [systemd](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/systemd-monitor-counter.json).

* Тип демона `SystemStatsMonitor` збирає різноманітні статистичні дані системи, повʼязані зі справністю, як метрики. Ви можете настроїти його поведінку, оновивши його [файл конфігурації](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/system-stats-monitor.json).

* Тип демона `CustomPluginMonitor` викликає та перевіряє різні проблеми вузла, запускаючи сценарії, визначені користувачем. Ви можете використовувати різні власні втулки для моніторингу різних проблем і настроювати поведінку демона, оновивши [файл конфігурації](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/custom-plugin-monitor.json).

* Тип демона `HealthChecker` перевіряє стан kubelet та контейнерного середовища на вузлі.

### Додавання підтримки для іншого формату логів {#support-other-log-format}

Монітор системного логу наразі підтримує файлові логи, journald та kmsg. Додаткові джерела можна додати, реалізувавши новий [спостерігач за логами](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/pkg/systemlogmonitor/logwatchers/types/log_watcher.go).

### Додавання власних втулків моніторингу {#adding-custom-plugin-monitors}

Ви можете розширити Node Problem Detector для виконання будь-яких сценаріїв моніторингу, написаних будь-якою мовою програмування, розробивши власний втулок. Сценарії моніторингу повинні відповідати протоколу втулка щодо коду виходу та стандартного виводу. Для отримання додаткової інформації див.  [пропозицію інтерфейсу втулка](https://docs.google.com/document/d/1jK_5YloSYtboj-DtfjmYKxfNnUxCAvohLnsH5aGCAYQ/edit#).

## Експортер {#exporter}

Експортер повідомляє про проблеми та/або метрики вузлів до певних бекендів. Підтримуються наступні експортери:

* **Експортер Kubernetes**: цей експортер повідомляє про проблеми вузлів на сервер API Kubernetes. Тимчасові проблеми повідомляються як Події, а постійні проблеми — як Стан вузла.

* **Експортер Prometheus**: цей експортер локально повідомляє про проблеми вузлів та метрики у форматі Prometheus (або OpenMetrics). Ви можете вказати IP-адресу та порт для експортера, використовуючи аргументи командного рядка.

* **Експортер Stackdriver**: цей експортер повідомляє про проблеми вузлів та метрики в службу моніторингу Stackdriver. Поведінку експорту можна налаштувати, використовуючи [файл конфігурації](https://github.com/kubernetes/node-problem-detector/blob/v0.8.12/config/exporter/stackdriver-exporter.json).

<!-- discussion -->

## Рекомендації та обмеження {#recommendations-and-restrictions}

Рекомендується запускати Node Problem Detector в вашому кластері для моніторингу стану вузлів. При запуску Node Problem Detector можна очікувати додаткове навантаження ресурсів на кожному вузлі. Зазвичай це прийнятно, оскільки:

* Лог ядра росте відносно повільно.
* Для Node Problem Detector встановлено обмеження ресурсів.
* Навіть при великому навантаженні використання ресурсів прийнятне. Докладніше див. результати
  [бенчмарків Node Problem Detector](https://github.com/kubernetes/node-problem-detector/issues/2#issuecomment-220255629).
