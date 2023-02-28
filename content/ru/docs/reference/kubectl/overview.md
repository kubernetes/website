---
reviewers:
- hw-qiaolei
title: Обзор kubectl
content_type: concept
weight: 20
card:
  name: reference
  weight: 20
---

<!-- overview -->
Kubectl — это инструмент командной строки для управления кластерами Kubernetes. `kubectl` ищет файл config в директории $HOME/.kube. Вы можете указать другие файлы [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/), установив переменную окружения KUBECONFIG или флаг [`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

На этой странице рассматривается синтаксис kubectl, описаны командные операции и приведены распространённые примеры. Подробную информацию о каждой команде, включая все поддерживаемые в ней флаги и подкоманды, смотрите в справочной документации [kubectl](/docs/reference/generated/kubectl/kubectl-commands/). Инструкции по установке находятся на странице [Установка и настройка kubectl](/ru/docs/tasks/kubectl/install/).



<!-- body -->

## Синтаксис

Используйте следующий синтаксис для выполнения команд `kubectl` в терминале:

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

где `command`, `TYPE`, `NAME` и `flags`:

* `command`: определяет выполняемую операцию с одним или несколькими ресурсами, например, `create`, `get`, `describe`, `delete`.

* `TYPE`: определяет [тип ресурса](#типы-ресурсов). Типы ресурсов не чувствительны к регистру, кроме этого вы можете использовать единственную, множественную или сокращенную форму. Например, следующие команды выведут одно и то же.

      ```shell
      kubectl get pod pod1
      kubectl get pods pod1
      kubectl get po pod1
      ```

* `NAME`: определяет имя ресурса. Имена чувствительны к регистру. Если имя не указано, то отображаются подробности по всем ресурсам, например, `kubectl get pods`.

  При выполнении операции с несколькими ресурсами можно выбрать каждый ресурс по типу и имени, либо сделать это в одном или нескольких файлов:

   * Выбор ресурсов по типу и имени:

      * Сгруппировать ресурсы, если все они одного типа:  `TYPE1 name1 name2 name<#>`.<br/>
      Пример: `kubectl get pod example-pod1 example-pod2`

      * Выбор нескольких типов ресурсов по отдельности:  `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`.<br/>
      Пример: `kubectl get pod/example-pod1 replicationcontroller/example-rc1`

   * Выбор ресурсов по одному или нескольким файлов:  `-f file1 -f file2 -f file<#>`

      * [Используйте YAML вместо JSON](/docs/concepts/configuration/overview/#general-configuration-tips), так как YAML удобнее для пользователей, особенно в конфигурационных файлах.<br/>
     Пример: `kubectl get pod -f ./pod.yaml`

* `flags`: определяет дополнительные флаги. Например, вы можете использовать флаги `-s` или `--server`, чтобы указать адрес и порт API-сервера Kubernetes.<br/>

{{< caution >}}
Указанные вами флаги из командной строки переопределят значения по умолчанию и связанные переменные окружения.
{{< /caution >}}

Если вам нужна помощь, выполните команду `kubectl help`.

## Операции

В следующей таблице приведены краткие описания и общий синтаксис всех операций `kubectl`:

Операция       | Синтаксис    |       Описание
-------------------- | -------------------- | --------------------
`annotate`    | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Добавить или обновить аннотации одного или нескольких ресурсов.
`api-versions`    | `kubectl api-versions [flags]` | Вывести доступные версии API.
`apply`            | `kubectl apply -f FILENAME [flags]`| Внести изменения в конфигурацию ресурса из файла или потока stdin.
`attach`        | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | Подключиться к запущенному контейнеру либо для просмотра потока вывода, либо для работы с контейнером (stdin).
`autoscale`    | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu-percent=CPU] [flags]</code> | Автоматически промасштабировать набор подов, управляемых контроллером репликации.
`cluster-info`    | `kubectl cluster-info [flags]` | Показать информацию о главном узле и сервисах в кластере.
`config`        | `kubectl config SUBCOMMAND [flags]` | Изменить файлы kubeconfig. Подробные сведения смотрите в отдельных подкомандах.
`create`        | `kubectl create -f FILENAME [flags]` | Создать один или несколько ресурсов из файла или stdin.
`delete`        | <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> | Удалить ресурсы из файла, потока stdin, либо с помощью селекторов меток, имен, селекторов ресурсов или ресурсов.
`describe`    | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | Показать подробное состояние одного или нескольких ресурсов.
`diff`        | `kubectl diff -f FILENAME [flags]`| Diff file or stdin against live configuration (**BETA**)
`edit`        | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | Отредактировать и обновить определение одного или нескольких ресурсов на сервере, используя редактор по умолчанию.
`exec`        | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | Выполнить команду в контейнере пода.
`explain`    | `kubectl explain  [--recursive=false] [flags]` | Посмотреть документацию по ресурсам. Например, поды, узлы, сервисы и т.д.
`expose`        | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | Создать Kubernetes-сервис из контроллера репликации, сервиса или пода.
`get`        | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | Вывести один или несколько ресурсов.
`label`        | <code>kubectl label (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Добавить или обновить метки для одного или нескольких ресурсов.
`logs`        | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | Вывести логи контейнера в поде.
`patch`        | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | Обновить один или несколько полей ресурса, используя стратегию слияния патча.
`port-forward`    | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | Переадресовать один или несколько локальных портов в под.
`proxy`        | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | Запустить прокси для API Kubernetes.
`replace`        | `kubectl replace -f FILENAME` | Заменить ресурс из файла или потока stdin.
`rolling-update`    | <code>kubectl rolling-update OLD_CONTROLLER_NAME ([NEW_CONTROLLER_NAME] --image=NEW_CONTAINER_IMAGE &#124; -f NEW_CONTROLLER_SPEC) [flags]</code> | Выполните плавающее обновление, постепенно заменяя указанный контроллер репликации и его поды.
`run`        | `kubectl run NAME --image=image [--env="key=value"] [--port=port] [--replicas=replicas] [--dry-run=bool] [--overrides=inline-json] [flags]` | Запустить указанный образ в кластере.
`scale`        | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | Обновить размер указанного контроллера репликации.
`version`        | `kubectl version [--client] [flags]` | Отобразить версию Kubernetes, запущенного на клиенте и сервере.

Примечание: подробную информацию о командных операциях смотрите в справочную документацию [kubectl](/ru/docs/user-guide/kubectl/).

## Типы ресурсов

В следующей таблице перечислены все доступные типы ресурсов вместе с сокращенными аббревиатурами.

(Это актуальный вывод команды `kubectl api-resources` с версии Kubernetes 1.13.3.)

| Resource Name | Short Names | API Group | Namespaced | Resource Kind |
|---|---|---|---|---|
| `bindings` | | | true | Binding|
| `componentstatuses` | `cs` | | false | ComponentStatus |
| `configmaps` | `cm` | | true | ConfigMap |
| `endpoints` | `ep` | | true | Endpoints |
| `limitranges` | `limits` | | true | LimitRange |
| `namespaces` | `ns` | | false | Namespace |
| `nodes` | `no` | | false | Node |
| `persistentvolumeclaims` | `pvc` | | true | PersistentVolumeClaim |
| `persistentvolumes` | `pv` | | false | PersistentVolume |
| `pods` | `po` | | true | Pod |
| `podtemplates` | | | true | PodTemplate |
| `replicationcontrollers` | `rc` | | true| ReplicationController |
| `resourcequotas` | `quota` | | true | ResourceQuota |
| `secrets` | | | true | Secret |
| `serviceaccounts` | `sa` | | true | ServiceAccount |
| `services` | `svc` | | true | Service |
| `mutatingwebhookconfigurations` | | admissionregistration.k8s.io | false | MutatingWebhookConfiguration |
| `validatingwebhookconfigurations` | | admissionregistration.k8s.io | false | ValidatingWebhookConfiguration |
| `customresourcedefinitions` | `crd`, `crds` | apiextensions.k8s.io | false |  CustomResourceDefinition |
| `apiservices` | | apiregistration.k8s.io | false | APIService |
| `controllerrevisions` | | apps | true | ControllerRevision |
| `daemonsets` | `ds` | apps | true | DaemonSet |
| `deployments` | `deploy` | apps | true | Deployment |
| `replicasets` | `rs` | apps | true | ReplicaSet |
| `statefulsets` | `sts` | apps | true | StatefulSet |
| `tokenreviews` | | authentication.k8s.io | false | TokenReview |
| `localsubjectaccessreviews` | | authorization.k8s.io | true | LocalSubjectAccessReview |
| `selfsubjectaccessreviews` | | authorization.k8s.io | false | SelfSubjectAccessReview |
| `selfsubjectrulesreviews` | | authorization.k8s.io | false | SelfSubjectRulesReview |
| `subjectaccessreviews` | | authorization.k8s.io | false | SubjectAccessReview |
| `horizontalpodautoscalers` | `hpa` | autoscaling | true | HorizontalPodAutoscaler |
| `cronjobs` | `cj` | batch | true | CronJob |
| `jobs` | | batch | true | Job |
| `certificatesigningrequests` | `csr` | certificates.k8s.io | false | CertificateSigningRequest |
| `leases` | | coordination.k8s.io | true | Lease |
| `events` | `ev` | events.k8s.io | true | Event |
| `ingresses` | `ing` | extensions | true | Ingress |
| `networkpolicies` | `netpol` | networking.k8s.io | true | NetworkPolicy |
| `poddisruptionbudgets` | `pdb` | policy | true | PodDisruptionBudget |
| `podsecuritypolicies` | `psp` | policy | false | PodSecurityPolicy |
| `clusterrolebindings` | | rbac.authorization.k8s.io | false | ClusterRoleBinding |
| `clusterroles` | | rbac.authorization.k8s.io | false | ClusterRole |
| `rolebindings` | | rbac.authorization.k8s.io | true | RoleBinding |
| `roles` | | rbac.authorization.k8s.io | true | Role |
| `priorityclasses` | `pc` | scheduling.k8s.io | false | PriorityClass |
| `csidrivers` | | storage.k8s.io | false | CSIDriver |
| `csinodes` | | storage.k8s.io | false | CSINode |
| `storageclasses` | `sc` | storage.k8s.io |  false | StorageClass |
| `volumeattachments` | | storage.k8s.io | false | VolumeAttachment |

## Опции вывода

В следующих разделах рассматривается форматирование и сортировка вывода определенных команд. Дополнительные сведения о том, какие команды поддерживают разные варианты вывода, смотрите в справочной документации [kubectl](/ru/docs/user-guide/kubectl/).

### Форматирование вывода

Стандартный формат вывода всех команд `kubectl` представлен в понятном для человека текстовом формате. Чтобы вывести подробности в определенном формате можно добавить флаги `-o` или `--output` к команде `kubectl`.

#### Синтаксис

```shell
kubectl [command] [TYPE] [NAME] -o <output_format>
```

В зависимости от операции `kubectl` поддерживаются следующие форматы вывода:

Выходной формат | Описание
--------------| -----------
`-o custom-columns=<spec>` | Вывести таблицу с использованием списка [пользовательских столбцов](#пользовательские-столбцы), разделённого запятыми.
`-o custom-columns-file=<filename>` | Вывести таблицу с использованием шаблона с [пользовательскими столбцами](#пользовательские-столбцы) в файле `<filename>`.
`-o json`     | Вывести API-объект в формате JSON.
`-o jsonpath=<template>` | Вывести поля, определенные в выражении [jsonpath](/ru/docs/reference/kubectl/jsonpath/).
`-o jsonpath-file=<filename>` | Вывести поля, определённые в выражении [jsonpath](/ru/docs/reference/kubectl/jsonpath/) из файла `<filename>`.
`-o name`     | Вывести только имя ресурса.
`-o wide`     | Вывести в текстовом формате с дополнительной информацией. Для подов отображается имя узла.
`-o yaml`     | Вывести API-объект в формате YAML

##### Пример

В данном примере следующая команда выводит подробную информацию по указанному поду в виде объекта в YAML-формате:

```shell
kubectl get pod web-pod-13je7 -o yaml
```

Примечание: подробную информацию о доступных форматах вывода в определенной команде смотрите в справочной документации [kubectl](/ru/docs/user-guide/kubectl/).

#### Пользовательские столбцы

Для определения пользовательских столбцов и вывода в таблицу только нужных данных, можно использовать опцию  `custom-columns`. Вы можете определить пользовательские столбцы в самой опции, либо сделать это в файле шаблона:  `-o custom-columns=<spec>` или `-o custom-columns-file=<filename>`.

##### Примеры

Столбцы указаны в самой команде:

```shell
kubectl get pods <pod-name> -o custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

Столбцы указаны в файле шаблона:

```shell
kubectl get pods <pod-name> -o custom-columns-file=template.txt
```

где файл `template.txt` содержит следующее:

```
NAME          RSRC
metadata.name metadata.resourceVersion
```

Результат выполнения любой из показанной выше команды:

```shell
NAME           RSRC
submit-queue   610995
```

#### Получение вывода с сервера

`kubectl` может получать информацию об объектах с сервера.
Это означает, что для любого указанного ресурса сервер вернет столбцы и строки по этому ресурсу, которые отобразит клиент.
Благодаря тому, что сервер инкапсулирует реализацию вывода, гарантируется единообразный и понятный для человека вывод на всех клиентах, использующих один и тот же кластер.

Эта функциональность включена по умолчанию, начиная с `kubectl` 1.11 и выше. Чтобы отключить ее, добавьте флаг `--server-print=false` в команду `kubectl get`.

##### Примеры

Для вывода информации о состоянии пода, используйте следующую команду:

```shell
kubectl get pods <pod-name> --server-print=false
```

Вывод будет выглядеть следующим образом:

```shell
NAME       READY     STATUS              RESTARTS   AGE
pod-name   1/1       Running             0          1m
```

### Сортировка списка объектов

Для вывода объектов в виде отсортированного списка в терминал используется флаг `--sort-by` к команде `kubectl`. Для сортировки объектов нужно указать любое числовое или строковое поле в флаге `--sort-by`. Для определения поля используйте выражение [jsonpath](/ru/docs/reference/kubectl/jsonpath/).

#### Синтаксис

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

##### Пример

Чтобы вывести список подов, отсортированных по имени, выполните команду ниже:

```shell
kubectl get pods --sort-by=.metadata.name
```

## Примеры: распространенные операции

Посмотрите следующие примеры, чтобы ознакомиться с часто используемыми операциями `kubectl`:

`kubectl apply` - Внести изменения или обновить ресурс из файла или потока stdin.

```shell
# Создать сервис из определения в example-service.yaml.
kubectl apply -f example-service.yaml

# Создать контроллер репликации из определения в example-controller.yaml.
kubectl apply -f example-controller.yaml

# Создать объекты, которые определены в файлах с расширением .yaml, .yml или .json в директории <directory>.
kubectl apply -f <directory>
```

`kubectl get` - Вывести один или несколько ресурсов.

```shell
# Вывести все поды в текстовом формате вывода.
kubectl get pods

# Вывести все поды в текстовом формате вывода и включить дополнительную информацию (например, имя узла).
kubectl get pods -o wide

# Вывести контроллер репликации с указанным именем в текстовом формате вывода. Совет: вы можете использовать сокращенный псевдоним 'rc' вместо 'replicationcontroller'.
kubectl get replicationcontroller <rc-name>

# Вывести все контроллеры репликации и сервисы вместе в текстовом формате вывода.
kubectl get rc,services

# Вывести все наборы демонов в текстовом формате вывода.
kubectl get ds

# Вывести все поды, запущенные на узле server01
kubectl get pods --field-selector=spec.nodeName=server01
```

`kubectl describe` - Показать подробное состояние одного или нескольких ресурсов, по умолчанию также включаются неинициализированные ресурсы.

```shell
# Показать информацию об узле с именем <node-name>.
kubectl describe nodes <node-name>

# Показать подробности пода <pod-name>.
kubectl describe pods/<pod-name>

# Показать подробности всех подов, управляемые контроллером репликации <rc-name>.
# Обратите внимание: любые поды, созданные контроллером репликации, имеют префикс с именем контроллера репликации.
kubectl describe pods <rc-name>

# Показать подробности по всем подам
kubectl describe pods
```

{{< note >}}
Как правило, команда `kubectl get` используется для получения одного или нескольких ресурсов одного и того же типа. Она поддерживает большой набор флагов, с помощью которых можно настроить формат вывода, например, с помощью флага `-o` или `--output`.
Вы можете указать флаг `-w` или `--watch`, чтобы отслеживать изменения в конкретном объекте. Команда `kubectl describe` в основном сфокусирована на описание многих взаимосвязанных аспектов указанного ресурса. При генерации вывода для пользователя она может обращаться к API-серверу. К примеру, команда `kubectl describe node` выдает не только информацию об узле, но и краткий обзор запущенных на нем подов, генерируемых событий и т.д.
{{< /note >}}

`kubectl delete` - Удалить ресурсы из файла, потока stdin или с помощью селекторов меток, имена, селекторов ресурсов или имен ресурсов.

```shell
# Удалить под по типу и имени, указанных в файле pod.yaml.
kubectl delete -f pod.yaml

# Удалить все поды и сервисы с именем метки <label-name>.
kubectl delete pods,services -l name=<label-name>

# Удалить все поды, включая неинициализированные.
kubectl delete pods --all
```

`kubectl exec` - Выполнить команду в контейнере пода.

```shell
# Получить вывод от запущенной команды 'date' в поде <pod-name>. По умолчанию отображается вывод из первого контейнера.
kubectl exec <pod-name> date

# Получить вывод из запущенной команды 'date' в контейнере <container-name> пода <pod-name>.
kubectl exec <pod-name> -c <container-name> date

# Получить интерактивный терминал (TTY) и запустить /bin/bash в поде <pod-name>. По умолчанию отображается вывод из первого контейнера.
kubectl exec -ti <pod-name> /bin/bash
```

`kubectl logs` - Вывести логи контейнера в поде.

```shell
# Возвращает текущие логи в поде <pod-name>.
kubectl logs <pod-name>

# Вывод логов в поде <pod-name> в режиме реального времени. Это похоже на команду 'tail -f' Linux.
kubectl logs -f <pod-name>
```

## Примеры: создание и использование плагинов

Посмотрите следующие примеры, чтобы ознакомиться с тем, как писать и использовать плагины `kubectl`:

```shell
# Плагин может быть на на любом языке, а сам исполняемый файл должен начинается с префикса "kubectl-".
cat ./kubectl-hello
#!/bin/bash

# Этот плагин выводит строку "hello world"
echo "hello world"

# Сделать плагин исполняемым
sudo chmod +x ./kubectl-hello

# Переместить его в директорию из PATH
sudo mv ./kubectl-hello /usr/local/bin

# Плагин дял kubectl создан и "установлен".
# Воспользоваться плагином можно через kubectl, вызвав его подобно обычной команды.
kubectl hello
```

```
hello world
```

```
# "Отмена установки" плагина происходит через удаление его файла из директории в PATH.
sudo rm /usr/local/bin/kubectl-hello
```

Посмотреть все доступные плагины `kubectl` можно с помощью подкоманды `kubectl plugin list`:

```shell
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
/usr/local/bin/kubectl-bar
```

```
# Эта команда также может сообщить, что плагин является неисполняемым,
# либо что плагин переопределен другими плагинами

sudo chmod -x /usr/local/bin/kubectl-foo
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo identified as a plugin, but it is not executable
/usr/local/bin/kubectl-bar

error: one plugin warning was found
```

Плагины можно рассматривать как способ создания более сложной функциональности поверх существующих команд kubectl:

```shell
cat ./kubectl-whoami
#!/bin/bash

# Этот плагин использует команду `kubectl config` для вывода
# информации о текущем пользователе из текущего выбранного контекста
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ .context.user }}{{ end }}{{ end }}'
```

Выполнение этого плагина генерирует вывод, содержащий пользователя для текущего выбранного контекста в файле KUBECONFIG:

```shell
# Сделать файл исполняемым
sudo chmod +x ./kubectl-whoami

# Перенести файл в директорию из PATH
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```

Чтобы узнать больше о плагинах, изучите [пример CLI-плагина](https://github.com/kubernetes/sample-cli-plugin).



## {{% heading "whatsnext" %}}


Начните использовать команды [kubectl](/ru/docs/reference/generated/kubectl/kubectl-commands/).


