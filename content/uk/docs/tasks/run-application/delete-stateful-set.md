---
title: Видалення StatefulSet
content_type: task
weight: 60
---

<!-- overview -->

Це завдання показує, як видалити {{< glossary_tooltip term_id="StatefulSet" >}}.

## {{% heading "prerequisites" %}}

- Це завдання передбачає, що у вас є застосунок, який працює на вашому кластері та представлений StatefulSet.

<!-- steps -->

## Видалення StatefulSet {#deleting-a-statefulset}

Ви можете видалити StatefulSet так само як і інші ресурси в Kubernetes: використовуйте команду `kubectl delete` та вкажіть StatefulSet або файлом, або імʼям.

```shell
kubectl delete -f <file.yaml>
```

```shell
kubectl delete statefulsets <statefulset-name>
```

Після видалення StatefulSet може знадобитися окремо видалити повʼязаний headless service.

```shell
kubectl delete service <імʼя-сервісу>
```

Під час видалення StatefulSet через `kubectl`, StatefulSet масштабується до 0. Всі Podʼи, які є частиною цього робочого навантаження, також видаляються. Якщо ви хочете видалити лише StatefulSet і не Podʼи, використовуйте `--cascade=orphan`. Наприклад:

```shell
kubectl delete -f <файл.yaml> --cascade=orphan
```

Передачею `--cascade=orphan` до `kubectl delete` Podʼи, що керуються StatefulSet залишаються після того, як обʼєкт StatefulSet сам по собі буде видалений. Якщо Podʼи мають мітку `app.kubernetes.io/name=MyApp`, ви можете видалити їх наступним чином:

```shell
kubectl delete pods -l app.kubernetes.io/name=MyApp
```

### Постійні томи {#persistent-volumes}

Видалення Podʼів у StatefulSet не призведе до видалення повʼязаних томів. Це зроблено для того, щоб ви мали можливість скопіювати дані з тому перед його видаленням. Видалення PVC після завершення роботи Podʼів може спричинити видалення зазначених постійних томів залежно від класу сховища та політики повторного використання. Ніколи не припускайте можливість доступу до тому
після видалення заявки.

{{< note >}}
Будьте обережні при видаленні PVC, оскільки це може призвести до втрати даних.
{{< /note >}}

### Повне видалення StatefulSet {#complete-deletion-of-a-statefulset}

Щоб видалити все у StatefulSet, включаючи повʼязані Podʼи, ви можете виконати серію команд, схожих на наступні:

```shell
grace=$(kubectl get pods <под-stateful-set> --template '{{.spec.terminationGracePeriodSeconds}}')
kubectl delete statefulset -l app.kubernetes.io/name=MyApp
sleep $grace
kubectl delete pvc -l app.kubernetes.io/name=MyApp

```

У вище наведеному прикладі Podʼи мають мітку `app.kubernetes.io/name=MyApp`; підставте вашу власну мітку за потреби.

### Примусове видалення Podʼів StatefulSet {#force-deletion-of-statefulset-pods}

Якщо ви помітите, що деякі Podʼи у вашому StatefulSet застрягли у стані 'Terminating' або 'Unknown' протягом тривалого періоду часу, вам може знадобитися втрутитися вручну, щоб примусово видалити Podʼи з apiserverʼа. Це потенційно небезпечне завдання. Див.
[Примусове видалення Podʼів StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/) для отримання детальної інформації.

## {{% heading "whatsnext" %}}

Дізнайтеся більше про [примусове видалення Podʼів StatefulSet](/docs/tasks/run-application/force-delete-stateful-set-pod/).
