---
`reviewers:
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
title: DaemonSet
api_metadata:
- apiVersion: "apps/v1"
  kind: "DaemonSet"
description: >-
  DaemonSet определяет Pod'ы, предоставляющие локальные для узла возможности. Они могут быть критически важны для работы кластера, например, сетевой вспомогательный инструмент, или являться частью дополнения.
content_type: concept
weight: 40
hide_summary: true # Listed separately in section index
---

<!-- overview -->

_DaemonSet_ гарантирует, что на всех (или некоторых) узлах запущена копия Pod'а. При добавлении узлов в кластер Pod'ы автоматически добавляются на них. При удалении узлов из кластера эти Pod'ы удаляются сборщиком мусора. Удаление DaemonSet приведёт к удалению всех созданных им Pod'ов.

Типичные случаи использования DaemonSet:

- запуск демона кластерного хранилища на каждом узле
- запуск демона сбора логов на каждом узле
- запуск демона мониторинга узлов на каждом узле

В простом случае для каждого типа демона используется один DaemonSet, охватывающий все узлы.
В более сложных конфигурациях может использоваться несколько DaemonSet для одного типа демона, но с разными флагами и/или разными запросами памяти и CPU для различных типов оборудования.

<!-- body -->

## Написание спецификации DaemonSet

### Создание DaemonSet

DaemonSet можно описать в YAML-файле. Например, файл `daemonset.yaml` ниже описывает DaemonSet, запускающий Docker-образ fluentd-elasticsearch:

{{% code_sample file="controllers/daemonset.yaml" %}}

Создание DaemonSet на основе YAML-файла:

```
kubectl apply -f https://k8s.io/examples/controllers/daemonset.yaml
```

### Обязательные поля

Как и для любой другой конфигурации Kubernetes, DaemonSet требует наличия полей `apiVersion`, `kind` и `metadata`. Общую информацию о работе с конфигурационными файлами см. в разделах
[запуск stateless-приложений](/docs/tasks/run-application/run-stateless-application-deployment/)
и [управление объектами с помощью kubectl](/docs/concepts/overview/working-with-objects/object-management/).

Имя объекта DaemonSet должно быть допустимым
[DNS-именем поддомена](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

DaemonSet также требует наличия секции
[`.spec`](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#spec-and-status).

### Шаблон Pod'а

Поле `.spec.template` является одним из обязательных полей в `.spec`.

Поле `.spec.template` представляет собой [шаблон Pod'а](/docs/concepts/workloads/pods/#pod-templates).
Оно имеет точно такую же схему, как и {{< glossary_tooltip text="Pod" term_id="pod" >}},
за исключением того, что является вложенным и не имеет полей `apiVersion` и `kind`.

Помимо обязательных полей для Pod'а, шаблон Pod'а в DaemonSet должен указывать соответствующие
метки (см. [селектор Pod'ов](#селектор-podов)).

Шаблон Pod'а в DaemonSet должен иметь [`RestartPolicy`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy),
равную `Always`, или быть не указанным, что по умолчанию означает `Always`.

### Селектор Pod'ов

Поле `.spec.selector` является селектором Pod'ов. Оно работает так же, как `.spec.selector`
у [Job](/docs/concepts/workloads/controllers/job/).

Необходимо указать селектор Pod'ов, который соответствует меткам в
`.spec.template`.
Также, после создания DaemonSet,
его `.spec.selector` не может быть изменён. Изменение селектора Pod'ов может привести к
непреднамеренному осиротению Pod'ов, что может запутать пользователей.

Поле `.spec.selector` представляет собой объект, состоящий из двух полей:

* `matchLabels` — работает так же, как `.spec.selector` у
  [ReplicationController](/docs/concepts/workloads/controllers/replicationcontroller/).
* `matchExpressions` — позволяет создавать более сложные селекторы, указывая ключ,
  список значений и оператор, связывающий ключ и значения.

Когда указаны оба поля, результат объединяется по логическому И (AND).

Поле `.spec.selector` должно соответствовать `.spec.template.metadata.labels`.
Конфигурация с несовпадающими значениями будет отклонена API.

### Запуск Pod'ов на выбранных узлах

Если указано поле `.spec.template.spec.nodeSelector`, контроллер DaemonSet будет
создавать Pod'ы на узлах, соответствующих этому [селектору узлов](/docs/concepts/scheduling-eviction/assign-pod-node/).
Аналогично, если указано поле `.spec.template.spec.affinity`,
контроллер DaemonSet будет создавать Pod'ы на узлах, соответствующих этой
[привязке к узлам (node affinity)](/docs/concepts/scheduling-eviction/assign-pod-node/).
Если ни одно из полей не указано, контроллер DaemonSet будет создавать Pod'ы на всех узлах.

## Как планируются Pod'ы демонов

DaemonSet может использоваться для обеспечения того, чтобы все подходящие узлы запускали копию Pod'а.
Контроллер DaemonSet создаёт Pod для каждого подходящего узла и добавляет поле
`spec.affinity.nodeAffinity` в Pod для соответствия целевому хосту. После
создания Pod'а обычно управление берёт на себя планировщик по умолчанию, который
привязывает Pod к целевому хосту, устанавливая поле `.spec.nodeName`. Если новый
Pod не помещается на узле, планировщик по умолчанию может вытеснить (evict) некоторые из
существующих Pod'ов на основе
[приоритета](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)
нового Pod'а.

{{< note >}}
Если важно, чтобы Pod DaemonSet запускался на каждом узле, часто желательно
установить `.spec.template.spec.priorityClassName` для DaemonSet в
[PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass)
с более высоким приоритетом, чтобы гарантировать это вытеснение.
{{< /note >}}

Пользователь может указать другой планировщик для Pod'ов DaemonSet,
установив поле `.spec.template.spec.schedulerName` у DaemonSet.

Исходная привязка к узлам, указанная в поле
`.spec.template.spec.affinity.nodeAffinity` (если указана), учитывается
контроллером DaemonSet при оценке подходящих узлов,
но заменяется в созданном Pod'е на привязку к узлу, соответствующую имени
подходящего узла.

```yaml
nodeAffinity:
  requiredDuringSchedulingIgnoredDuringExecution:
    nodeSelectorTerms:
    - matchFields:
      - key: metadata.name
        operator: In
        values:
        - target-host-name
```


### Ограничения (taints) и допуски (tolerations)

Контроллер DaemonSet автоматически добавляет набор {{< glossary_tooltip
text="допусков (tolerations)" term_id="toleration" >}} к Pod'ам DaemonSet:

{{< table caption="Допуски для Pod'ов DaemonSet" >}}

| Ключ допуска                                                                                                        | Эффект       | Описание                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| [`node.kubernetes.io/not-ready`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-not-ready)             | `NoExecute`  | Pod'ы DaemonSet могут планироваться на узлы, которые не готовы или не могут принимать Pod'ы. Любые Pod'ы DaemonSet, работающие на таких узлах, не будут вытеснены. |
| [`node.kubernetes.io/unreachable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-unreachable)         | `NoExecute`  | Pod'ы DaemonSet могут планироваться на узлы, недоступные для контроллера узлов. Любые Pod'ы DaemonSet, работающие на таких узлах, не будут вытеснены. |
| [`node.kubernetes.io/disk-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-disk-pressure)     | `NoSchedule` | Pod'ы DaemonSet могут планироваться на узлы с проблемами нехватки дискового пространства.                                                                         |
| [`node.kubernetes.io/memory-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-memory-pressure) | `NoSchedule` | Pod'ы DaemonSet могут планироваться на узлы с проблемами нехватки памяти.                                                                        |
| [`node.kubernetes.io/pid-pressure`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-pid-pressure) | `NoSchedule` | Pod'ы DaemonSet могут планироваться на узлы с проблемами нехватки процессов.                                                                        |
| [`node.kubernetes.io/unschedulable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-unschedulable)   | `NoSchedule` | Pod'ы DaemonSet могут планироваться на узлы, помеченные как непланируемые.                                                                            |
| [`node.kubernetes.io/network-unavailable`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-network-unavailable) | `NoSchedule` | **Добавляется только для Pod'ов DaemonSet, запрашивающих сеть хоста**, т.е. Pod'ов с `spec.hostNetwork: true`. Такие Pod'ы DaemonSet могут планироваться на узлы с недоступной сетью.|

{{< /table >}}

Вы также можете добавить собственные допуски к Pod'ам DaemonSet,
определив их в шаблоне Pod'а DaemonSet.

Поскольку контроллер DaemonSet автоматически устанавливает допуск
`node.kubernetes.io/unschedulable:NoSchedule`,
Kubernetes может запускать Pod'ы DaemonSet на узлах, помеченных как _непланируемые_.

Если вы используете DaemonSet для предоставления важной функции уровня узла, такой как
[сетевое взаимодействие кластера](/docs/concepts/cluster-administration/networking/),
полезно, что Kubernetes размещает Pod'ы DaemonSet на узлах до того, как они будут готовы.
Например, без этого специального допуска вы можете оказаться в тупиковой ситуации,
когда узел не помечен как готовый, потому что сетевой плагин там не запущен,
и в то же время сетевой плагин не запущен на этом узле, потому что узел ещё не готов.

## Взаимодействие с Pod'ами демонов

Некоторые возможные паттерны взаимодействия с Pod'ами в DaemonSet:

- **Push**: Pod'ы в DaemonSet настроены на отправку обновлений в другой сервис, например,
  в базу данных статистики. У них нет клиентов.
- **IP узла и известный порт**: Pod'ы в DaemonSet могут использовать `hostPort`, чтобы быть
  доступными по IP-адресам узлов.
  Клиенты каким-либо образом знают список IP-адресов узлов и знают порт по соглашению.
- **DNS**: Создайте [headless-сервис](/docs/concepts/services-networking/service/#headless-services)
  с тем же селектором Pod'ов, а затем обнаруживайте DaemonSet'ы, используя ресурс `endpoints`
  или получая несколько A-записей из DNS.
- **Service**: Создайте сервис с тем же селектором Pod'ов и используйте сервис для доступа к
  демону на случайном узле. Используйте [политику внутреннего трафика сервиса (Service Internal Traffic Policy)](/docs/concepts/services-networking/service-traffic-policy/)
  для ограничения Pod'ами на том же узле.

## Обновление DaemonSet

При изменении меток узлов DaemonSet оперативно добавит Pod'ы на узлы, которые теперь соответствуют условиям, и удалит
Pod'ы с узлов, которые больше не соответствуют.

Вы можете изменять Pod'ы, созданные DaemonSet. Однако Pod'ы не позволяют обновлять все
поля. Кроме того, контроллер DaemonSet будет использовать исходный шаблон при следующем
создании узла (даже с тем же именем).

Вы можете удалить DaemonSet. Если указать `--cascade=orphan` с `kubectl`, то Pod'ы
останутся на узлах. Если впоследствии создать новый DaemonSet с тем же селектором,
новый DaemonSet примет существующие Pod'ы. Если какие-либо Pod'ы требуют замены, DaemonSet заменит
их в соответствии со своей `updateStrategy`.

Вы можете [выполнить плавное обновление (rolling update)](/docs/tasks/manage-daemon/update-daemon-set/) DaemonSet.

## Альтернативы DaemonSet

### Init-скрипты

Безусловно, можно запускать процессы-демоны напрямую на узле (например, используя
`init`, `upstartd` или `systemd`). Это вполне допустимо. Однако есть несколько преимуществ
запуска таких процессов через DaemonSet:

- Возможность мониторинга и управления логами демонов так же, как и приложений.
- Один и тот же язык конфигурации и инструменты (например, шаблоны Pod'ов, `kubectl`) для демонов и приложений.
- Запуск демонов в контейнерах с ограничениями ресурсов повышает изоляцию между демонами и
  контейнерами приложений. Однако этого также можно достичь, запуская демоны в контейнере, но не в Pod'е.

### Обычные Pod'ы (Bare Pods)

Можно создавать Pod'ы напрямую, указывая конкретный узел для запуска. Однако
DaemonSet заменяет Pod'ы, которые были удалены или завершены по любой причине, например, в случае
сбоя узла или при разрушительном обслуживании узла, таком как обновление ядра. По этой причине следует
использовать DaemonSet вместо создания отдельных Pod'ов.

### Статические Pod'ы

Можно создавать Pod'ы, записывая файл в определённый каталог, отслеживаемый Kubelet. Такие Pod'ы
называются [статическими Pod'ами](/docs/tasks/configure-pod-container/static-pod/).
В отличие от DaemonSet, статическими Pod'ами нельзя управлять с помощью kubectl
или других клиентов Kubernetes API. Статические Pod'ы не зависят от apiserver, что делает их полезными
в случаях начальной загрузки кластера. Также статические Pod'ы могут быть объявлены устаревшими в будущем.

### Deployment'ы

DaemonSet'ы похожи на [Deployment'ы](/docs/concepts/workloads/controllers/deployment/) тем, что
оба создают Pod'ы, и эти Pod'ы содержат процессы, которые не должны завершаться (например, веб-серверы,
серверы хранения).

Используйте Deployment для stateless-сервисов, таких как фронтенды, где масштабирование вверх и вниз
количества реплик и развёртывание обновлений важнее, чем контроль того, на каком именно хосте
запускается Pod. Используйте DaemonSet, когда важно, чтобы копия Pod'а всегда работала на
всех или определённых хостах, если DaemonSet предоставляет функциональность уровня узла, позволяющую другим Pod'ам корректно работать на этом конкретном узле.

Например, [сетевые плагины](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) часто включают компонент, работающий как DaemonSet. Компонент DaemonSet обеспечивает работу кластерной сети на узле, где он запущен.


## {{% heading "whatsnext" %}}

* Узнайте больше о [Pod'ах](/docs/concepts/workloads/pods):
  * Узнайте о [статических Pod'ах](/docs/tasks/configure-pod-container/static-pod/), которые полезны для запуска компонентов
    {{< glossary_tooltip text="плоскости управления (control plane)" term_id="control-plane" >}} Kubernetes.
* Узнайте, как использовать DaemonSet'ы:
  * [Выполнение плавного обновления (rolling update) DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
  * [Выполнение отката DaemonSet](/docs/tasks/manage-daemon/rollback-daemon-set/)
    (например, если развёртывание прошло не так, как ожидалось).
* Узнайте, [как Kubernetes назначает Pod'ы на узлы](/docs/concepts/scheduling-eviction/assign-pod-node/).
* Узнайте о [плагинах устройств](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) и
  [дополнениях](/docs/concepts/cluster-administration/addons/), которые часто работают как DaemonSet'ы.
* `DaemonSet` является ресурсом верхнего уровня в Kubernetes REST API.
  Прочитайте определение объекта {{< api-reference page="workload-resources/daemon-set-v1" >}},
  чтобы понять API для DaemonSet'ов.
