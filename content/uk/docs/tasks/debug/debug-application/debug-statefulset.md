---
title: Налагодження StatefulSet
content_type: task
weight: 30
---

<!-- overview -->

Це завдання показує, як налагоджувати StatefulSet.

## {{% heading "prerequisites" %}} {#before-you-begin}

* Вам потрібен кластер Kubernetes, та інструмент командного рядка kubectl повинен бути налаштований на звʼязок з вашим кластером.
* У вас має бути запущений StatefulSet, який ви хочете дослідити.

<!-- steps -->

## Налагодження StatefulSet {#debugging-a-statefulset}

Щоб вивести список усіх Podʼів, які належать до StatefulSet і мають мітку `app.kubernetes.io/name=MyApp`, можна використати таку команду:

```shell
kubectl get pods -l app.kubernetes.io/name=MyApp
```

Якщо ви бачите, що якісь із перелічених Podʼів тривалий час перебувають у стані `Unknown` або `Terminating`, зверніться до завдання [Видалення Podʼів StatefulSet](/docs/tasks/run-application/delete-stateful-set/) за інструкціями, що з ними робити. Налагоджувати окремі Podʼи у StatefulSet можна за допомогою посібника [Налагодження Podʼів](/docs/tasks/debug/debug-application/debug-pods/).

## {{% heading "whatsnext" %}} {#what-s-next}

Дізнайтеся більше про [налагодження init-контейнера](/docs/tasks/debug/debug-application/debug-init-containers/).
