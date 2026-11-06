---
title: Виконання поетапного оновлення DaemonSet
content_type: task
weight: 10
---

<!-- overview -->

На цій сторінці показано, як виконати поетапне оновлення DaemonSet.

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Стратегія оновлення DaemonSet {#daemonset-update-strategy}

DaemonSet має два типи стратегій оновлення:

* `OnDelete`: Зі стратегією оновлення `OnDelete` після оновлення шаблону DaemonSet нові Podʼи DaemonSet створюватимуться *лише* тоді, коли ви вручну видалите старі Podʼи DaemonSet. Така сама поведінка була в DaemonSet у Kubernetes версії 1.5 або раніше.
* `RollingUpdate`: Це стандартна стратегія оновлення. Зі стратегією оновлення `RollingUpdate` після оновлення шаблону DaemonSet старі Podʼи DaemonSet буде завершено, а нові Podʼи DaemonSet буде автоматично створено контрольованим чином. Протягом усього процесу оновлення на кожному вузлі працюватиме щонайбільше один Pod DaemonSet.

## Виконання поетапного оновлення {#performing-a-rolling-update}

Щоб увімкнути поетапне оновлення DaemonSet, потрібно встановити `.spec.updateStrategy.type` у `RollingUpdate`.

Ви також можете встановити [`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec) (стандартно 1), [`.spec.minReadySeconds`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec) (стандартно 0) та [`.spec.updateStrategy.rollingUpdate.maxSurge`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec) (стандартно 0).

### Створення DaemonSet зі стратегією оновлення `RollingUpdate` {#creating-a-daemonset-with-rollingupdate-update-strategy}

Цей файл YAML визначає DaemonSet зі стратегією оновлення `RollingUpdate`:

{{% code_sample file="controllers/fluentd-daemonset.yaml" %}}

Перевіривши стратегію оновлення в маніфесті DaemonSet, створіть DaemonSet:

```shell
kubectl create -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

Або скористайтесь командою `kubectl apply`, щоб створити той самий DaemonSet, якщо ви плануєте оновлювати DaemonSet за допомогою `kubectl apply`.

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

### Перевірка стратегії оновлення `RollingUpdate` у DaemonSet {#checking-daemonset-rollingupdate-update-strategy}

Перевірте стратегію оновлення вашого DaemonSet і переконайтеся, що вона встановлена в `RollingUpdate`:

```shell
kubectl get ds/fluentd-elasticsearch -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}' -n kube-system
```

Якщо ви ще не створили DaemonSet у системі, натомість перевірте маніфест DaemonSet такою командою:

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml --dry-run=client -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```

Вивід обох команд має бути таким:

```
RollingUpdate
```

Якщо вивід не `RollingUpdate`, поверніться й відповідно змініть обʼєкт DaemonSet або маніфест.

### Оновлення шаблону DaemonSet {#updating-a-daemonset-template}

Будь-які оновлення `.spec.template` у DaemonSet зі стратегією `RollingUpdate` запускають поетапне оновлення. Оновімо DaemonSet, застосувавши новий файл YAML. Це можна зробити кількома різними командами `kubectl`.

{{% code_sample file="controllers/fluentd-daemonset-update.yaml" %}}

#### Декларативні команди {#declarative-commands}

Якщо ви оновлюєте DaemonSets за допомогою [файлів конфігурації](/docs/tasks/manage-kubernetes-objects/declarative-config/), використовуйте `kubectl apply`:

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset-update.yaml
```

#### Імперативні команди {#imperative-commands}

Якщо ви оновлюєте DaemonSets за допомогою [імперативних команд](/docs/tasks/manage-kubernetes-objects/imperative-command/), використовуйте `kubectl edit` :

```shell
kubectl edit ds/fluentd-elasticsearch -n kube-system
```

##### Оновлення лише образу контейнера {#updating-only-the-container-image}

Якщо вам потрібно оновити лише образ контейнера у шаблоні DaemonSet, тобто
`.spec.template.spec.containers[*].image`, використовуйте `kubectl set image`:

```shell
kubectl set image ds/fluentd-elasticsearch fluentd-elasticsearch=quay.io/fluentd_elasticsearch/fluentd:v2.6.0 -n kube-system
```

### Спостереження за станом поетапного оновлення {#watching-the-rolling-update-status}

Нарешті, спостерігайте за станом розгортання останнього поетапного оновлення DaemonSet:

```shell
kubectl rollout status ds/fluentd-elasticsearch -n kube-system
```

Коли розгортання завершиться, вивід буде подібний до такого:

```shell
daemonset "fluentd-elasticsearch" successfully rolled out
```

## Усунення несправностей {#troubleshooting}

### Поетапне оновлення DaemonSet застрягло {#daemonset-rolling-update-is-stuck}

Іноді поетапне оновлення DaemonSet може застрягнути. Ось деякі можливі причини:

#### На деяких вузлах вичерпуються ресурси {#some-nodes-run-out-of-resources}

Розгортання застрягло, оскільки нові Podʼи DaemonSet не можна запланувати щонайменше на один вузол. Таке можливо, коли на вузлі [вичерпуються ресурси](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

Коли це трапляється, знайдіть вузли, на яких не заплановано Podʼи DaemonSet, порівнявши вивід `kubectl get nodes` з виводом:

```shell
kubectl get pods -l name=fluentd-elasticsearch -o wide -n kube-system
```

Знайшовши ці вузли, видаліть із них деякі Podʼи, що не належать до DaemonSet, щоб звільнити місце для нових Podʼів DaemonSet.

{{< note >}}
Це спричинить порушення роботи сервісу, якщо видалені Podʼи не контролюються жодним контролером або не мають реплік. Це також не враховує [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/).
{{< /note >}}

#### Невдале розгортання {#broken-rollout}

Якщо останнє оновлення шаблону DaemonSet невдале, наприклад контейнер постійно аварійно завершується (crash looping) або образу контейнера не існує (часто через одруківку), розгортання DaemonSet не просуватиметься.

Щоб виправити це, ще раз оновіть шаблон DaemonSet. Нове розгортання не блокуватиметься попередніми несправними розгортаннями.

#### Невідповідність годинників {#clock-skew}

Якщо в DaemonSet задано `.spec.minReadySeconds`, невідповідність годинників між панеллю управління та вузлами не дасть DaemonSet правильно визначати перебіг розгортання.

## Очищення {#clean-up}

Видаліть DaemonSet із простору імен:

```shell
kubectl delete ds fluentd-elasticsearch -n kube-system
```

## {{% heading "whatsnext" %}} {#what-s-next}

* Дивіться [Виконання відкочування DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
* Дивіться [Створення DaemonSet для прийняття наявних Podʼів DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
