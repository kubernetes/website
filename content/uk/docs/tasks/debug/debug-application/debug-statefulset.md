---
title: Налагодження StatefulSet
content_type: task
weight: 30
---

<!-- overview -->

Ця задача показує, як усувати несправності у StatefulSet.

## {{% heading "prerequisites" %}}

* Вам потрібен кластер Kubernetes, та інструмент командного рядка kubectl повинен бути налаштований на звʼязок з вашим кластером.
* Ви повинні мати запущений StatefulSet, який ви хочете дослідити.

<!-- steps -->

## Усунення несправностей у StatefulSet {#debugging-a-statefulset}

Для того, щоб переглянути всі Podʼи, які належать до StatefulSet і мають мітку `app.kubernetes.io/name=MyApp` на них, ви можете використовувати наступне:

```shell
kubectl get pods -l app.kubernetes.io/name=MyApp
```

Якщо ви помітили, що будь-які Podʼи вказані у стані `Unknown` або `Terminating` протягом тривалого періоду часу, зверніться до завдання [Видалення Podʼів StatefulSet](/docs/tasks/run-application/delete-stateful-set/) за інструкціями щодо дії з ними. Ви можете усувати несправності окремих Podʼів у StatefulSet, використовуючи [Посібник з усунення несправностей Podʼів](/docs/tasks/debug/debug-application/debug-pods/).

## {{% heading "whatsnext" %}}

Дізнайтеся більше про [усунення несправностей контейнера ініціалізації](/docs/tasks/debug/debug-application/debug-init-containers/).
