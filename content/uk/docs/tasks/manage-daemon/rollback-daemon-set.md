---
title: Виконання відкочування DaemonSet
content_type: task
weight: 20
min-kubernetes-server-version: 1.7
---

<!-- overview -->

На цій сторінці показано, як виконати відкочування {{< glossary_tooltip term_id="daemonset" >}}.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Ви вже маєте знати, як [виконати поетапне оновлення DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).

<!-- steps -->

## Виконання відкочування DaemonSet {#performing-a-rollback-on-a-daemonset}

### Крок 1: Знайдіть ревізію DaemonSet, до якої потрібно відкотитися {#step-1-find-the-daemonset-revision-you-want-to-roll-back-to}

Цей крок можна пропустити, якщо ви хочете лише відкотитися до останньої ревізії.

Виведіть усі ревізії DaemonSet:

```shell
kubectl rollout history daemonset <daemonset-name>
```

Це поверне список ревізій DaemonSet:

```
daemonsets "<daemonset-name>"
REVISION        CHANGE-CAUSE
1               ...
2               ...
...
```

* Причина зміни копіюється з анотації DaemonSet `kubernetes.io/change-cause` до його ревізій під час їх створення. Ви можете вказати `--record=true` у `kubectl`, щоб записати виконану команду в анотацію причини зміни.

Щоб переглянути подробиці конкретної ревізії:

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

Це поверне подробиці цієї ревізії:

```
daemonsets "<daemonset-name>" with revision #1
Pod Template:
Labels:       foo=bar
Containers:
app:
 Image:        ...
 Port:         ...
 Environment:  ...
 Mounts:       ...
Volumes:      ...
```

### Крок 2: Відкотіться до конкретної ревізії {#step-2-roll-back-to-a-specific-revision}

```shell
# Вкажіть номер ревізії, отриманий на кроці 1, у --to-revision
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

Якщо команда виконається успішно, вона поверне:

```
daemonset "<daemonset-name>" rolled back
```

{{< note >}}
Якщо прапорець `--to-revision` не вказано, kubectl обирає найновішу ревізію.
{{< /note >}}

### Крок 3: Спостерігайте за перебігом відкочування DaemonSet {#step-3-watch-the-progress-of-the-daemonset-rollback}

`kubectl rollout undo daemonset` наказує серверу почати відкочування DaemonSet. Фактичне відкочування виконується асинхронно всередині {{< glossary_tooltip term_id="control-plane" text="панелі управління" >}} кластера.

Щоб спостерігати за перебігом відкочування:

```shell
kubectl rollout status ds/<daemonset-name>
```

Коли відкочування завершиться, вивід буде подібний до такого:

```
daemonset "<daemonset-name>" successfully rolled out
```

<!-- discussion -->

## Розуміння ревізій DaemonSet {#understanding-daemonset-revisions}

На попередньому кроці `kubectl rollout history` ви отримали список ревізій DaemonSet. Кожна ревізія зберігається в ресурсі під назвою ControllerRevision.

Щоб побачити, що зберігається в кожній ревізії, знайдіть необроблені ресурси ревізій DaemonSet:

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

Це поверне список ControllerRevisions:

```
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

Кожен ControllerRevision зберігає анотації та шаблон ревізії DaemonSet.

`kubectl rollout undo` бере конкретний ControllerRevision і замінює шаблон DaemonSet шаблоном, збереженим у ControllerRevision. `kubectl rollout undo` рівнозначний оновленню шаблону DaemonSet до попередньої ревізії іншими командами, такими як `kubectl edit` або `kubectl apply`.

{{< note >}}
Ревізії DaemonSet рухаються лише вперед. Тобто після завершення відкочування номер ревізії (поле `.revision`) ControllerRevision, до якого відбулося відкочування, збільшується. Наприклад, якщо в системі є ревізії 1 і 2 і ви відкочуєтеся з ревізії 2 до ревізії 1, ControllerRevision із `.revision: 1` стане `.revision: 3`.
{{< /note >}}

## Усунення несправностей {#troubleshooting}

* Дивіться [усунення несправностей поетапного оновлення DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting).
