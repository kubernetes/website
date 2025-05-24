---
title: Виконання відкату DaemonSet
content_type: task
weight: 20
min-kubernetes-server-version: 1.7
---

<!-- overview -->

Ця сторінка показує, як виконати відкат на {{< glossary_tooltip term_id="daemonset" >}}.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Ви повинні вже знати, як [виконати поетапне оновлення на DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).

<!-- steps -->

## Виконання відкату на DaemonSet {#performing-a-rollback-on-a-daemonset}

### Крок 1: Знайдіть ревізію DaemonSet, до якої ви хочете повернутися {#step-1-find-the-daemonset-revision-you-want-to-roll-back-to}

Цей крок можна пропустити, якщо ви хочете повернутися до останньої ревізії.

Перегляньте всі ревізії DaemonSet:

```shell
kubectl rollout history daemonset <daemonset-name>
```

Це поверне список ревізій DaemonSet:

```none
daemonsets "<daemonset-name>"
REVISION        CHANGE-CAUSE
1               ...
2               ...
...
```

* Причина зміни копіюється з анотації DaemonSet `kubernetes.io/change-cause` до його ревізій під час створення. Ви можете вказати `--record=true` в `kubectl`, щоб записати команду, виконану в анотації причини зміни.

Щоб переглянути деталі конкретної ревізії:

```shell
kubectl rollout history daemonset <daemonset-name> --revision=1
```

Це поверне деталі цієї ревізії:

```none
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

### Крок 2: Поверніться до конкретної ревізії DaemonSet {#step-2-rollback-to-a-specific-revision}

```shell
# Вкажіть номер ревізії, отриманий на кроці 1, у --to-revision
kubectl rollout undo daemonset <daemonset-name> --to-revision=<revision>
```

Якщо команда успішна, вона поверне:

```none
daemonset "<daemonset-name>" rolled back
```

{{< note >}}
Якщо прапорець `--to-revision` не вказано, kubectl обирає найновішу ревізію.
{{< /note >}}

### Крок 3: Спостерігайте за процесом відкату DaemonSet {#step-3-watch-the-progress-of-the-daemonset-rollback}

`kubectl rollout undo daemonset` вказує серверу почати відкочування
DaemonSet. Реальний відкат виконується асинхронно всередині {{< glossary_tooltip term_id="control-plane" text="панелі управління" >}} кластера.

Щоб спостерігати за процесом відкату:

```shell
kubectl rollout status ds/<daemonset-name>
```

Коли відкочування завершиться, вивід буде подібним до цього:

```none
daemonset "<daemonset-name>" successfully rolled out
```

<!-- discussion -->

## Розуміння ревізій DaemonSet {#understanding-daemonset-revisions}

У попередньому кроці `kubectl rollout history` ви отримали список ревізій DaemonSet. Кожна ревізія зберігається в ресурсі під назвою ControllerRevision.

Щоб побачити, що зберігається в кожній ревізії, знайдіть сирцеві ресурси ревізії DaemonSet:

```shell
kubectl get controllerrevision -l <daemonset-selector-key>=<daemonset-selector-value>
```

Це поверне список ControllerRevisions:

```none
NAME                               CONTROLLER                     REVISION   AGE
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     1          1h
<daemonset-name>-<revision-hash>   DaemonSet/<daemonset-name>     2          1h
```

Кожен ControllerRevision зберігає анотації та шаблон ревізії DaemonSet.

`kubectl rollout undo` бере конкретний ControllerRevision і замінює шаблон DaemonSet на шаблон, збережений у ControllerRevision. `kubectl rollout undo` еквівалентний оновленню шаблону DaemonSet до попередньої ревізії за допомогою інших команд, таких як `kubectl edit` або `kubectl apply`.

{{< note >}}
Ревізії DaemonSet завжди рухаються вперед. Тобто, після завершення відкату номер ревізії (`поле .revision`) ControllerRevision, до якого було виконано відкат, збільшиться. Наприклад, якщо у вас є ревізії 1 і 2 в системі, і ви повертаєтеся з ревізії 2 до ревізії 1, ControllerRevision з `.revision: 1` стане `.revision: 3`.
{{< /note >}}

## Усунення несправностей {#troubleshooting}

* Див. [усунення несправностей при поетапному оновленні DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/#troubleshooting).
