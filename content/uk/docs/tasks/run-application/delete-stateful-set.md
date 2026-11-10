---
title: Видалення StatefulSet
content_type: task
weight: 60
---

<!-- overview -->

Це завдання показує, як видалити {{< glossary_tooltip term_id="StatefulSet" >}}.

## {{% heading "prerequisites" %}} {#before-you-begin}

- Це завдання передбачає, що у вас у кластері працює застосунок, представлений StatefulSet.

<!-- steps -->

## Видалення StatefulSet {#deleting-a-statefulset}

Ви можете видалити StatefulSet так само, як й інші ресурси в Kubernetes: скористайтеся командою `kubectl delete` і вкажіть StatefulSet за файлом або за назвою.

```shell
kubectl delete -f <file.yaml>
```

```shell
kubectl delete statefulsets <statefulset-name>
```

Після видалення самого StatefulSet може знадобитися окремо видалити повʼязаний headless Service.

```shell
kubectl delete service <service-name>
```

Під час видалення StatefulSet через `kubectl` StatefulSet масштабується до 0. Усі Podʼи, що є частиною цього робочого навантаження, також видаляються. Якщо ви хочете видалити лише StatefulSet, а не Podʼи, використовуйте `--cascade=orphan`. Наприклад:

```shell
kubectl delete -f <file.yaml> --cascade=orphan
```

Якщо передати `--cascade=orphan` до `kubectl delete`, Podʼи, якими керує StatefulSet, залишаться навіть після видалення самого обʼєкта StatefulSet. Якщо Podʼи мають мітку `app.kubernetes.io/name=MyApp`, їх можна видалити так:

```shell
kubectl delete pods -l app.kubernetes.io/name=MyApp
```

### Постійні томи {#persistent-volumes}

Видалення Podʼів у StatefulSet не призводить до видалення повʼязаних томів. Це зроблено для того, щоб ви мали змогу скопіювати дані з тому перед його видаленням. Видалення PVC після завершення роботи Podʼів може спричинити видалення відповідних постійних томів залежно від класу сховища та політики повторного використання. Ніколи не розраховуйте на доступ до тому після видалення заявки.

{{< note >}}
Будьте обережні під час видалення PVC, оскільки це може призвести до втрати даних.
{{< /note >}}

### Повне видалення StatefulSet {#complete-deletion-of-a-statefulset}

Щоб видалити все у StatefulSet, зокрема повʼязані Podʼи, можна виконати серію команд, подібних до наведених нижче:

```shell
grace=$(kubectl get pods <stateful-set-pod> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app.kubernetes.io/name=MyApp
sleep $grace
kubectl delete pvc -l app.kubernetes.io/name=MyApp

```

У наведеному вище прикладі Podʼи мають мітку `app.kubernetes.io/name=MyApp`; за потреби підставте власну мітку.

### Примусове видалення Podʼів StatefulSet {#force-deletion-of-statefulset-pods}

Якщо деякі Podʼи у вашому StatefulSet тривалий час залишаються у стані 'Terminating' або 'Unknown', може знадобитися втрутитися вручну, щоб примусово видалити Podʼи з API-сервера. Це потенційно небезпечне завдання. Докладніше дивіться в розділі [Примусове видалення Podʼів StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).

## {{% heading "whatsnext" %}} {#what-s-next}

Дізнайтеся більше про [примусове видалення Podʼів StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
