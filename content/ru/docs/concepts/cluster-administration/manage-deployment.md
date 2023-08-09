---
reviewers:
title: Управление ресурсами
content_type: concept
weight: 40
---

<!-- overview -->

Итак, вы развернули приложение и настроили доступ к нему с помощью сервиса. Что дальше? Kubernetes предоставляет ряд инструментов, помогающих управлять развертыванием приложений, включая их масштабирование и обновление. Среди особенностей, которые мы обсудим более подробно, — [конфигурационные файлы](/docs/concepts/configuration/overview/) и [лейблы](/docs/concepts/overview/working-with-objects/labels/).

<!-- body -->

## Организация конфигураций ресурсов

Многие приложения требуют создания нескольких ресурсов типа Deployment и Service. Управление ими можно упростить, сгруппировав в один YAML-файл (со строкой "---" в качестве разделителя). Например:

{{% codenew file="application/nginx-app.yaml" %}}

Можно создавать сразу несколько ресурсов:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
service/my-nginx-svc created
deployment.apps/my-nginx created
```

Ресурсы будут создаваться в порядке, в котором они описаны в файле. Таким образом, первым лучше всего описать сервис — это позволит планировщику распределять Pod'ы этого сервиса по мере их создания контроллером (контроллерами), например, Deployment'ом.

`kubectl apply` также может принимать сразу несколько аргументов `-f`:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

Кроме того, можно указывать директории вместо отдельных файлов или в дополнение ним:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/
```

`kubectl` прочитает все файлы с расширениями `.yaml`, `.yml` или `.json`.

Рекомендуется размещать ресурсы, имеющие отношение к одному микросервису или уровню приложения, в одном файле, а также группировать все файлы, связанные с приложением, в одной директории. Если уровни вашего приложения связываются друг с другом через DNS, можно развернуть все компоненты стека совместно.

Также в качестве источника конфигурации можно указать URL — это удобно при создании/настройке с использованием конфигурационных файлов, размещенных на GitHub:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/main/content/en/examples/application/nginx/nginx-deployment.yaml
```

```shell
deployment.apps/my-nginx created
```

## Пакетные операции в kubectl

Создание ресурсов — не единственная операция, которую `kubectl` может выполнять в рамках одной команды. Этот инструмент также способен извлекать имена ресурсов из конфигурационных файлов для выполнения других операций, в частности, для удаления созданных ресурсов:

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

В случае двух ресурсов их можно перечислить в командной строке, используя синтаксис вида resource/name:

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

При большем количестве ресурсов удобнее указать селектор (запрос по лейблу) с помощью `-l` или `--selector`, который отфильтрует ресурсы по их лейблам:

```shell
kubectl delete deployment,services -l app=nginx
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

Поскольку `kubectl` выводит имена ресурсов в том же синтаксисе, что и получает, можно выстраивать цепочки операций с помощью `$()` или `xargs`:

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service | xargs -i kubectl get {}
```

```shell
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

Приведенные выше команды сначала создают ресурсы в разделе `examples/application/nginx/`, выводят о них информацию в формате `-o name` (то есть в виде пары resource/name). Затем в результатах производится поиск по "service" (`grep`), и информация о найденных ресурсах выводится с помощью `kubectl get`.

Если ресурсы хранятся в нескольких поддиректориях в пределах одной директории, можно рекурсивно выполнять операции и в этих поддиректориях, указав `--recursive` или `-R` наряду с флагом `--filename`, `-f`.

Предположим, что существует директория `project/k8s/development`, в которой хранятся все {{< glossary_tooltip text="манифесты" term_id="manifest" >}}, необходимые для dev-окружения, организованные по типу ресурсов:

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

По умолчанию при выполнении массовых операций над `project/k8s/development` команда остановится на первом уровне, не обрабатывая поддиректории. К примеру, попытка создать ресурсы, описанные в этой директории, приведет к ошибке:

```shell
kubectl apply -f project/k8s/development
```

```shell
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

Вместо этого следует указать флаг `--recursive` или `-R` с флагом `--filename`, `-f`:

```shell
kubectl apply -f project/k8s/development --recursive
```

```shell
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Флаг `--recursive` работает с любыми операциями, принимающими флаг `--filename`, `-f`, например: `kubectl {create, get, delete, describe, rollout}` и т.д.

Флаг `--recursive` также работает для нескольких аргументов `-f`:

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```shell
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

В разделе [Инструмент командной строки kubectl](/docs/reference/kubectl/) доступна дополнительная информация о `kubectl`.

## Эффективное использование лейблов

Во всех примерах, рассмотренных до этого момента, к ресурсам прикреплялся лишь один лейбл. Однако существуют сценарии, когда необходимо использовать несколько лейблов, чтобы отличить наборы ресурсов друг от друга.

Например, разные приложения могут использовать разные значения для лейбла `app`, а в случае многоуровневого приложения вроде [гостевой книги](https://github.com/kubernetes/examples/tree/master/guestbook/) лейблы могут указывать на соответствующий уровень. Например, у фронтенда могут быть следующие лейблы:

```yaml
     labels:
        app: guestbook
        tier: frontend
```

в то время как у master'а и slave'а Redis будут лейблы `tier` и, возможно, даже дополнительный лейбл `role`:

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

и

```yaml
     labels:
        app: guestbook
        tier: backend
        role: slave
```

Лейблы позволяют группировать ресурсы по любому параметру с соответствующим лейблом: 

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```shell
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=slave
```
```shell
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

## Канареечные развертывания

Еще один сценарий, в котором применение нескольких лейблов как нельзя кстати, — дифференциация развертываний отдельных релизов или конфигураций одного и того же компонента. Как правило, новая версия приложения (указанная с помощью тега образа в шаблоне Pod'а) запускается в так называемом *канареечном* (canary) развертывании параллельно с предыдущей версией. Далее на нее направляется часть реального production-трафика.

В примере ниже лейбл `track` помогает различить релизы.

У основного, стабильного релиза он будет иметь значение `stable`:

```yaml
     name: frontend
     replicas: 3
     ...
     labels:
        app: guestbook
        tier: frontend
        track: stable
     ...
     image: gb-frontend:v3
```

У нового релиза фронтенда гостевой книги значение этого лейбла будет другим (`canary`), чтобы два набора Pod'ов не пересекались:

```yaml
     name: frontend-canary
     replicas: 1
     ...
     labels:
        app: guestbook
        tier: frontend
        track: canary
     ...
     image: gb-frontend:v4
```

Чтобы охватить оба набора реплик, сервис фронтенда следует настроить на выбор общего подмножества их лейблов (т.е. опустить лейбл `track`). В результате трафик будет поступать на обе версии приложения:

```yaml
  selector:
     app: guestbook
     tier: frontend
```

При этом число стабильных и канареечных реплик можно менять, регулируя долю production-трафика, которую будет получать каждая версия приложения (три к одному в нашем случае). Убедившись в стабильности новой версии, можно поменять значение ее лейбла `track` с `canary` на `stable`.

Более подробный пример доступен в [руководстве по развертыванию Ghost](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary).

## Обновление лейблов

Иногда возникает необходимость поменять лейблы у существующих Pod'ов и других ресурсов перед созданием новых. Сделать это можно с помощью команды `kubectl label`. Например, чтобы промаркировать все Pod'ы NGINX как имеющие отношение к фронтенду, выполните следующую команду:

```shell
kubectl label pods -l app=nginx tier=fe
```

```shell
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Сначала она выберет все Pod'ы с лейблом `app=nginx`, а затем пометит их лейблом `tier=fe`. Чтобы просмотреть список этих Pod'ов, выполните:

```shell
kubectl get pods -l app=nginx -L tier
```
```shell
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

Будут выведены все Pod'ы `app=nginx` с дополнительным столбцом `tier` (задается с помощью `-L` или `--label-columns`).

Дополнительную информацию можно найти в разделах [Лейблы](/docs/concepts/overview/working-with-objects/labels/) и [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).

## Обновление аннотаций

Иногда возникает потребность навесить на ресурсы аннотации. Аннотации — это произвольные неидентифицирующие метаданные для извлечения клиентами API (инструментами, библиотеками и т.п.). Добавить аннотацию можно с помощью команды `kubectl annotate`. Например:

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```

```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

Для получения дополнительной информации обратитесь к разделу [Аннотации](/docs/concepts/overview/working-with-objects/annotations/) и описанию команды [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate).

## Масштабирование приложения

Для масштабирования приложения можно воспользоваться инструментом `kubectl`. Например, следующая команда уменьшит число реплик с 3 до 1:

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```shell
deployment.apps/my-nginx scaled
```

После ее применения количество Pod'ов под управлением соответствующего объекта Deployment сократится до одного:

```shell
kubectl get pods -l app=nginx
```

```shell
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

Чтобы система автоматически выбирала необходимое количество реплик NGINX в диапазоне от 1 до 3, выполните следующую команду:

```shell
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```shell
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

Теперь количество реплик NGINX будет автоматически увеличиваться и уменьшаться по мере необходимости.

Для получения дополнительной информации см. разделы [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale), [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) и [horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/).

## Обновление ресурсов "на месте"

Иногда возникает необходимость внести мелкие обновления в созданные ресурсы, не требующие их пересоздания.

### kubectl apply

Хранить конфигурационные файлы рекомендуемтся в системе контроля версий (см. [конфигурация как код](https://martinfowler.com/bliki/InfrastructureAsCode.html)). В этом случае их можно будет поддерживать и версионировать вместе с кодом ресурсов, которые те конфигурируют. Далее с помощью команды [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) изменения, внесенные в конфигурацию, можно применить к кластеру.

Она сравнит новую версию конфигурации с предыдущей и применит внесенные изменения, не меняя параметры, установленные автоматически, не затронутые новой редакцией конфигурации.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

Обратите внимание, что `kubectl apply` добавляет к ресурсу аннотацию, помогающую отслеживать изменения в конфигурации с момента предыдущего вызова. При вызове `kubectl apply` проводит трехстороннее сравнение (three-way diff) предыдущей конфигурации, ее текущей и новой версий, которое определяет, какие правки следует внести в ресурс.

На данный момент ресурсы в Kubernetes создаются без данной аннотации, поэтому при первом вызове `kubectl apply` проведет двустороннее сравнение входных данных и текущей конфигурации ресурса. Кроме того, она не cможет определить, какие свойства, заданные при создании ресурса, требуют удаления (соответственно, не будет их удалять).

При всех последующих вызовах `kubectl apply` и других команд, меняющих конфигурацию, таких как `kubectl replace` и `kubectl edit`, аннотация будет обновляться. В результате `kubectl apply` сможет проводить трехстороннее сравнение (three-way diff), определяя, какие свойства требуют удаления, и удалять их.

### kubectl edit

Ресурсы также можно обновлять с помощью команды `kubectl edit`:

```shell
kubectl edit deployment/my-nginx
```

По сути, `kubectl edit` объединяет в себе логику нескольких команд, упрощая жизнь пользователям: сначала она получает (`get`) ресурс, вызывает текстовый редактор, а затем применяет (`apply`) обновленную конфигурацию:

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# внесите правки и сохраните файл

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

Обратите внимание, что задать предпочитаемый текстовый редактор можно с помощью переменных окружения `EDITOR` или `KUBE_EDITOR`.

За дополнительной информацией обратитесь к разделу [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit).

### kubectl patch

Команда `kubectl patch` обновляет объекты API "на месте". Она поддерживает форматы JSON patch, JSON merge patch и strategic merge patch. См. разделы [Обновление объектов API "на месте" с помощью kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/) и [kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch).

## Обновления, требующие перерыва в работе 

Иногда может понадобиться обновить поля ресурса, которые нельзя изменить после инициализации, или возникнет необходимость немедленно внести рекурсивные изменения, например, "починить" сбойные Pod'ы, созданные Deployment'ом. Для этого можно воспользоваться командой `replace --force`, которая удалит и пересоздаст ресурс. Вот как можно внести правки в исходный файл конфигурации в нашем примере:

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```shell
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## Обновление приложения без перерыва в работе

В какой-то момент возникнет необходимость обновить развернутое приложение. Обычно это делают, указывая новый образ или тег образа, как в приведенном выше сценарии канареечного развертывания. `kubectl` поддерживает несколько видов обновлений, каждый из которых подходит для разных сценариев.

Ниже будет рассказано, как создавать и обновлять приложения с помощью объектов Deployment.

Предположим, что в кластере используется версия NGINX 1.14.2:

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```shell
deployment.apps/my-nginx created
```

с тремя репликами (чтобы старые и новые ревизии могли сосуществовать):

```shell
kubectl scale deployment my-nginx --current-replicas=1 --replicas=3
```

```
deployment.apps/my-nginx scaled
```

Чтобы перейти на версию 1.16.1, измените значение параметра `.spec.template.spec.containers[0].image` с `nginx:1.14.2` на `nginx:1.16.1`:

```shell
kubectl edit deployment/my-nginx
```

Вот и все! Deployment декларативно обновит развернутое приложение NGINX "за кулисами". При этом Kubernetes проследит, чтобы число недоступных реплик в каждый момент времени не превышало определенного значения, а также за тем, чтобы количество новых реплик не превышало определенного предела, установленного для желаемого числа Pod'ов. Более подробную информацию об этом можно получить в разделе [Deployment](/docs/concepts/workloads/controllers/deployment/).



## {{% heading "whatsnext" %}}


- Узнайте о том, [как использовать `kubectl` для интроспекции и отладки приложений](/docs/tasks/debug/debug-application/debug-running-pod/).
- Ознакомьтесь с [Лучшими практиками и советами по конфигурированию](/docs/concepts/configuration/overview/).

