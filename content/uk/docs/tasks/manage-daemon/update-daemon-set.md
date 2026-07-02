---
title: Виконання поетапного оновлення DaemonSet
content_type: task
weight: 10
---

<!-- overview -->

Ця сторінка показує, як виконати поетапне оновлення (rolling update) DaemonSet.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## Стратегія оновлення DaemonSet {#daemonset-update-strategy}

DaemonSet має два типи стратегій оновлення:

* `OnDelete`: Зі стратегією оновлення `OnDelete`, після оновлення шаблону DaemonSet нові Podʼи DaemonSet будуть створюватися *лише* після вручну видалених старих Podʼів DaemonSet. Це та ж поведінка, що й у версії Kubernetes 1.5 або раніше.
* `RollingUpdate`: Це стандартна стратегія оновлення. Зі стратегією оновлення `RollingUpdate`, після оновлення шаблону DaemonSet старі Podʼи DaemonSet будуть видалені, і нові Podʼи DaemonSet будуть створені автоматично, у контрольованому режимі. Під час усього процесу оновлення на кожному вузлі працюватиме максимум один Pod DaemonSet.

## Виконання поетапного оновлення {#performing-a-rolling-update}

Щоб увімкнути функцію поетапного оновлення DaemonSet, необхідно встановити
`.spec.updateStrategy.type` на `RollingUpdate`.

Ви можете також встановити значення [`.spec.updateStrategy.rollingUpdate.maxUnavailable`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec) (типово 1), [`.spec.minReadySeconds`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)
(типово 0) та [`.spec.updateStrategy.rollingUpdate.maxSurge`](/docs/reference/kubernetes-api/workload-resources/daemon-set-v1/#DaemonSetSpec)
(типово 0).

### Створення DaemonSet зі стратегією оновлення `RollingUpdate` {#creating-a-daemonset-with-rollingupdate-update-strategy}

Цей YAML файл задає DaemonSet зі стратегією оновлення `RollingUpdate`:

{{% code_sample file="controllers/fluentd-daemonset.yaml" %}}

Після перевірки стратегії оновлення в маніфесті DaemonSet, створіть DaemonSet:

```shell
kubectl create -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

Або скористайтесь командою `kubectl apply`, щоб створити той самий DaemonSet, якщо ви плануєте оновлювати DaemonSet за допомогою `kubectl apply`.

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml
```

### Перевірка стратегії оновлення `RollingUpdate` у DaemonSet {#checking-daemonset-rollingupdate-update-strategy}

Перевірте стратегію оновлення вашого DaemonSet і переконайтесь, що вона встановлена на `RollingUpdate`:

```shell
kubectl get ds/fluentd-elasticsearch -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}' -n kube-system
```

Якщо ви ще не створили DaemonSet у системі, перевірте ваш маніфест DaemonSet за допомогою наступної команди:

```shell
kubectl apply -f https://k8s.io/examples/controllers/fluentd-daemonset.yaml --dry-run=client -o go-template='{{.spec.updateStrategy.type}}{{"\n"}}'
```

Вивід обох команд повинен бути таким:

```none
RollingUpdate
```

Якщо вивід не `RollingUpdate`, поверніться назад і змініть обʼєкт DaemonSet або його маніфест відповідно.

### Оновлення шаблону DaemonSet {#updating-a-daemonset-template}

Будь-які оновлення до `.spec.template` `RollingUpdate` DaemonSet викличуть поетапне оновлення. Оновімо DaemonSet, застосувавши новий YAML файл. Це можна зробити за допомогою кількох різних команд `kubectl`.

{{% code_sample file="controllers/fluentd-daemonset-update.yaml" %}}

#### Декларативні команди {#declarative-commands}

Якщо ви оновлюєте DaemonSets за допомогою [конфігураційних файлів](/docs/tasks/manage-kubernetes-objects/declarative-config/), використовуйте `kubectl apply`:

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

Нарешті, спостерігайте за станом останнього поетапного оновлення DaemonSet:

```shell
kubectl rollout status ds/fluentd-elasticsearch -n kube-system
```

Коли оновлення завершиться, вивід буде подібний до цього:

```shell
daemonset "fluentd-elasticsearch" successfully rolled out
```

## Усунення несправностей {#troubleshooting}

### Поетапне оновлення DaemonSet застрягло {#daemonset-rolling-update-is-stuck}

Іноді поетапне оновлення DaemonSet може застрягнути. Ось деякі можливі причини:

#### Деякі вузли вичерпали ресурси {#some-nodes-run-out-of-resources}

Оновлення застрягло, оскільки нові Podʼи DaemonSet не можуть бути заплановані на принаймні один вузол. Це можливо, коли вузол [вичерпує ресурси](/docs/concepts/scheduling-eviction/node-pressure-eviction/).

Коли це трапляється, знайдіть вузли, на яких не заплановані Podʼи DaemonSet, порівнявши вихід `kubectl get nodes` з виходом:

```shell
kubectl get pods -l name=fluentd-elasticsearch -o wide -n kube-system
```

Після того, як ви знайдете ці вузли, видаліть деякі не-DaemonSet Podʼи з вузла, щоб звільнити місце для нових Podʼіів DaemonSet.

{{< note >}}
Це викличе переривання обслуговування, коли видалені Podʼи не контролюються жодними контролерами або Podʼи не реплікуються. Це також не враховує [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/).
{{< /note >}}

#### Неправильне оновлення {#broken-rollout}

Якщо недавнє оновлення шаблону DaemonSet є неправильним, наприклад, контейнер зациклюється або образ контейнера не існує (часто через помилку у назві), поетапне оновлення DaemonSet не просуватиметься.

Щоб виправити це, оновіть шаблон DaemonSet ще раз. Нове оновлення не буде блокуватися попередніми несправними оновленнями.

#### Невідповідність годинників {#clock-skew}

Якщо у DaemonSet задано значення `.spec.minReadySeconds`, невідповідність годинників між мастером та вузлами зробить DaemonSet нездатним визначити правильний прогрес оновлення.

## Очищення {#clean-up}

Видаліть DaemonSet з простору імен:

```shell
kubectl delete ds fluentd-elasticsearch -n kube-system
```

## {{% heading "whatsnext" %}}

* Див. [Виконання відкату DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
* Див. [Створення DaemonSet для прийняття наявних Podʼів DaemonSet](/docs/concepts/workloads/controllers/daemonset/)
