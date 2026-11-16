---
title: Інструмент командного рядка (kubectl)
content_type: reference
weight: 110
no_list: true
card:
  name: reference
  title: Інструмент командного рядка (kubectl)
  weight: 20
---

<!-- overview -->
{{< glossary_definition prepend="Kubernetes надає" term_id="kubectl" length="short" >}}

Цей інструмент має назву `kubectl`.

Для отримання налаштувань `kubectl` шукає файл `config` в теці `$HOME/.kube`. Ви можете вказати інший файл [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) у змінній середовища `KUBECONFIG` або за допомогою прапорця [`--kubeconfig`](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

Цей огляд охоплює синтаксис `kubectl`, описує операції команд і містить поширені приклади. Докладніше про кожну команду, включаючи всі підтримувані прапорці та субкоманди, див. довідкову документацію [kubectl](/docs/reference/kubectl/generated/kubectl/).

Для огляду див. [Інструмент командного рядка kubectl](/docs/concepts/overview/kubectl/). Інструкції з встановлення наведено у статті [Встановлення kubectl](/docs/tasks/tools/#kubectl); короткий посібник є у [шпаргалці](/docs/reference/kubectl/quick-reference/). Якщо ви звикли користуватись інструментом командного рядка `docker`, [`kubectl` для користувачів Docker](/docs/reference/kubectl/docker-cli-to-kubectl/) пояснює деякі еквівалентні команди для Kubernetes.

<!-- body -->

## Синтаксис {#syntax}

Використовуйте такий синтаксис для виконання команд `kubectl` у вашому терміналі:

```shell
kubectl [command] [TYPE] [NAME] [flags]
```

де `command`, `TYPE`, `NAME` та `flags` визначаються так:

* `command`: Вказує операцію, яку ви хочете виконати з одним чи кількома ресурсами, наприклад `create`, `get`, `describe`, `delete`.

* `TYPE`: Вказує [тип ресурсу](#resource-types). Типи ресурсів нечутливі до регістру, і можна вказувати форми однини, множини чи абревіатури. Наприклад, такі команди виводять той самий результат:

  ```shell
  kubectl get pod pod1
  kubectl get pods pod1
  kubectl get po pod1
  ```

* `NAME`: Вказує імʼя ресурсу. Імена чутливі до регістру. Якщо імʼя пропущено, виводяться деталі для всіх ресурсів, наприклад `kubectl get pods`.

  Під час виконання операції над кількома ресурсами можна вказати кожен ресурс за типом та іменем або вказати один чи кілька файлів:

  * Щоб вказати ресурси за типом та іменем:

    * Щоб групувати ресурси, якщо всі вони одного типу: `TYPE1 name1 name2 name<#>`.<br/>
      Приклад: `kubectl get pod example-pod1 example-pod2`.

    * Щоб вказати кілька типів ресурсів окремо: `TYPE1/name1 TYPE1/name2 TYPE2/name3 TYPE<#>/name<#>`.<br/>
      Приклад: `kubectl get pod/example-pod1 replicationcontroller/example-rc1`.

  * Щоб вказати ресурси за допомогою одного чи кількох файлів: `-f file1 -f file2 -f file<#>`.

    * Використовуйте YAML замість JSON, оскільки YAML зазвичай є зручнішим для користувача, особливо для файлів конфігурації.<br/>
      Приклад: `kubectl get -f ./pod.yaml`

* `flags`: Вказує необовʼязкові прапорці. Наприклад, ви можете використовувати прапорці `-s` або `--server`, щоб вказати адресу та порт API-сервера Kubernetes.<br/>

{{< caution >}}
Прапорці, які ви вказуєте в командному рядку, перевизначають типові значення та будь-які відповідні змінні середовища.
{{< /caution >}}

Якщо вам потрібна допомога, виконайте команду `kubectl help` у вікні термінала.

## Автентифікація та перевизначення простору імен в кластері {#in-cluster-authentication-and-namespace-overrides}

Типово `kubectl` спочатку визначатиме, чи він виконується всередині Podʼа, і отже, в кластері. Програма починає з перевірки наявності змінних середовища `KUBERNETES_SERVICE_HOST` та `KUBERNETES_SERVICE_PORT`, а також наявності файлу токена службового облікового запису за шляхом `/var/run/secrets/kubernetes.io/serviceaccount/token`. Якщо всі три умови виконуються, вважається, що використовується автентифікація в кластері.

Для забезпечення зворотної сумісності, якщо під час автентифікації в кластері встановлено змінну середовища `POD_NAMESPACE`, вона перевизначить типовий простір імен, взятий з токена службового облікового запису. Це буде впливати на будь-які маніфести або інструменти, які покладаються на типовий простір імен.

**Змінна середовища `POD_NAMESPACE`**

Якщо змінна середовища `POD_NAMESPACE` встановлена, операції CLI для ресурсів з обмеженим простором імен будуть отримувати типове значення від цієї змінної. Наприклад, якщо значення змінної — `seattle`, `kubectl get pods` поверне Podʼи з простору імен `seattle`. Це тому, що Podʼи є ресурсом обмеженим простором імен, а в команді простір імен не вказано. Ознайомтесь з виводом `kubectl api-resources`, щоб визначити, чи ресурс обмежений простором імен чи ні.

Явне використання `--namespace <value>` перевизначає цю поведінку.

**Як kubectl обробляє токени ServiceAccount**

Якщо:

* маємо файл токена службового облікового запису Kubernetes, змонтований за шляхом `/var/run/secrets/kubernetes.io/serviceaccount/token`, і
* встановлено змінну середовища `KUBERNETES_SERVICE_HOST`, і
* встановлено змінну середовища `KUBERNETES_SERVICE_PORT`, і
* ви не вказуєте простір імен явно в командному рядку kubectl

тоді kubectl вважатиме, що він працює у вашому кластері. Інструмент kubectl знаходить простір імен цього ServiceAccount (це такий самий простір імен, що й у Podʼа) та діє відповідно до цього простору імен. Це відрізняється від того, що відбувається поза кластером; коли kubectl працює за межами кластера і ви не вказуєте простір імен, команда kubectl діє в просторі імен, встановленому для поточного контексту у вашій конфігурації клієнта. Щоб змінити типовий простір імен для kubectl, ви можете використовувати таку команду:

```shell
kubectl config set-context --current --namespace=<namespace-name>
```

## Операції {#operations}

Таблиця нижче містить короткі описи та загальний синтаксис для всіх операцій `kubectl`:

Операція | Синтаксис | Опис
-- | -- | --
`alpha` | `kubectl alpha SUBCOMMAND [flags]` | Вивести список доступних команд, які відповідають функціям рівня alpha, що типово не увімкнені у кластерах Kubernetes.
`annotate` | <code>kubectl annotate (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Додати або оновити анотації одного чи кількох ресурсів.
`api-resources` | `kubectl api-resources [flags]` | Вивести список доступних ресурсів API.
`api-versions` | `kubectl api-versions [flags]` | Вивести список доступних версій API.
`apply` | `kubectl apply -f FILENAME [flags]`| Застосувати зміну конфігурації до ресурсу з файлу або stdin.
`attach` | `kubectl attach POD -c CONTAINER [-i] [-t] [flags]` | Приєднатися до запущеного контейнера для перегляду виводу або взаємодії з контейнером (stdin).
`auth` | `kubectl auth [flags] [options]` | Перевірити авторизацію.
`autoscale` | <code>kubectl autoscale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--min=MINPODS] --max=MAXPODS [--cpu=CPU] [flags]</code> | Автоматично масштабувати набір Podʼів, керованих контролером реплікації.
`certificate` | `kubectl certificate SUBCOMMAND [options]` | Змінити ресурси сертифікатів.
`cluster-info` | `kubectl cluster-info [flags]` | Показати інформацію про точки доступу master та сервісів у кластері.
`completion` | `kubectl completion SHELL [options]` | Вивести код функції автозавершення оболонки для bash або zsh.
`config` | `kubectl config SUBCOMMAND [flags]` | Змінити файли kubeconfig. Деталі див. в описі окремих підкоманд.
`convert` | `kubectl convert -f FILENAME [options]` | Конвертувати файли конфігурації між різними версіями API. Приймаються формати YAML та JSON. Примітка — потрібно встановити втулок `kubectl-convert`.
`cordon` | `kubectl cordon NODE [options]` | Позначити вузол як недоступний для планування.
`cp` | `kubectl cp <file-spec-src> <file-spec-dest> [options]` | Копіювати файли та теки до і з контейнерів.
`create` | `kubectl create -f FILENAME [flags]` | Створити один чи кілька ресурсів з файлу або stdin.
`delete` | <code>kubectl delete (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label &#124; --all]) [flags]</code> | Видалити ресурси з файлу, stdin або вказати селектори міток, імена, селектори ресурсів або ресурси.
`describe` | <code>kubectl describe (-f FILENAME &#124; TYPE [NAME_PREFIX &#124; /NAME &#124; -l label]) [flags]</code> | Показати докладний стан одного чи кількох ресурсів.
`diff` | `kubectl diff -f FILENAME [flags]`| Порівняти файл або stdin з робочою конфігурацією.
`drain` | `kubectl drain NODE [options]` | Виконати drain вузла для підготовки до обслуговування.
`edit` | <code>kubectl edit (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [flags]</code> | Редагувати та оновити визначення одного чи кількох ресурсів на сервері за допомогою типового редактора.
`events` | `kubectl events` | Вивести список подій.
`exec` | `kubectl exec POD [-c CONTAINER] [-i] [-t] [flags] [-- COMMAND [args...]]` | Виконати команду в контейнері у Podʼі.
`explain` | `kubectl explain TYPE [--recursive=false] [flags]` | Отримати документацію про різні ресурси, такі як Podʼи, вузли, сервіси і т. д.
`expose` | <code>kubectl expose (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) [--port=port] [--protocol=TCP&#124;UDP] [--target-port=number-or-name] [--name=name] [--external-ip=external-ip-of-service] [--type=type] [flags]</code> | Надати доступ ззовні до контролера реплікації, Service або Pod як до нового Service Kubernetes.
`get` | <code>kubectl get (-f FILENAME &#124; TYPE [NAME &#124; /NAME &#124; -l label]) [--watch] [--sort-by=FIELD] [[-o &#124; --output]=OUTPUT_FORMAT] [flags]</code> | Вивести список ресурсів.
`kustomize` | `kubectl kustomize <dir> [flags] [options]` | Вивести список ресурсів API, згенерованих з інструкцій у файлі kustomization.yaml. Аргумент повинен бути шляхом до теки, що містить файл, або URL репозиторію git з суфіксом шляху, який вказує на те ж саме відносно кореня репозиторію.
`label` | <code>kubectl label (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) KEY_1=VAL_1 ... KEY_N=VAL_N [--overwrite] [--all] [--resource-version=version] [flags]</code> | Додати або оновити мітки одного чи кількох ресурсів.
`logs` | `kubectl logs POD [-c CONTAINER] [--follow] [flags]` | Вивести логи контейнера у Podʼі.
`options` | `kubectl options` | Список глобальних параметрів командного рядка, які застосовуються до всіх команд.
`patch` | <code>kubectl patch (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --patch PATCH [flags]</code> | Оновити одне чи кілька полів ресурсу за допомогою процесу strategic merge patch.
`plugin` | `kubectl plugin [flags] [options]` | Надає інструменти для взаємодії з втулками.
`port-forward` | `kubectl port-forward POD [LOCAL_PORT:]REMOTE_PORT [...[LOCAL_PORT_N:]REMOTE_PORT_N] [flags]` | Переспрямувати один або кілька локальних портів у Pod.
`proxy` | `kubectl proxy [--port=PORT] [--www=static-dir] [--www-prefix=prefix] [--api-prefix=prefix] [flags]` | Запустити проксі до API-сервера Kubernetes.
`replace` | `kubectl replace -f FILENAME` | Замінити ресурс з файлу або stdin.
`rollout` | `kubectl rollout SUBCOMMAND [options]` | Керувати розгортанням ресурсу. Дійсні типи ресурсів: Deployment, DaemonSet та StatefulSet.
`run` | <code>kubectl run NAME --image=image [--env="key=value"] [--port=port] [--dry-run=server&#124;client&#124;none] [--overrides=inline-json] [flags]</code> | Запустити вказаний образ у кластері.
`scale` | <code>kubectl scale (-f FILENAME &#124; TYPE NAME &#124; TYPE/NAME) --replicas=COUNT [--resource-version=version] [--current-replicas=count] [flags]</code> | Оновити розмір вказаного контролера реплікації.
`set` | `kubectl set SUBCOMMAND [options]` | Налаштувати ресурси застосунку.
`taint` | `kubectl taint NODE NAME KEY_1=VAL_1:TAINT_EFFECT_1 ... KEY_N=VAL_N:TAINT_EFFECT_N [options]` | Оновити taint на одному чи декількох вузлах.
`top` | <code>kubectl top (POD &#124; NODE) [flags] [options]</code> | Показати використання ресурсів (CPU/Memory/Storage) для Podʼа чи вузла.
`uncordon` | `kubectl uncordon NODE [options]` | Позначити вузол як доступний для планування.
`version` | `kubectl version [--client] [flags]` | Показати версію Kubernetes, яка працює на клієнті та сервері.
`wait` | <code>kubectl wait ([-f FILENAME] &#124; resource.group/resource.name &#124; resource.group [(-l label &#124; --all)]) [--for=delete&#124;--for condition=available] [options]</code> | Експериментально: чекати на певний стан одного чи кількох ресурсів.

Щоб дізнатися більше про операції, що виконують команди, див. довідку [kubectl](/docs/reference/kubectl/kubectl/).

## Типи ресурсів {#resource-types}

У наступній таблиці наведено список всіх підтримуваних типів ресурсів та їхніх скорочених псевдонімів.

(Цей вивід можна отримати за допомогою `kubectl api-resources`, він був актуальним на момент Kubernetes 1.25.0)

| ІМʼЯ | СКОРОЧЕННЯ | ВЕРСІЯ API | ПРОСТІР ІМЕН | ТИП |
|---|---|---|---|---|
| `bindings` |  | v1 | true | Binding |
| `componentstatuses` | `cs` | v1 | false | ComponentStatus |
| `configmaps` | `cm` | v1 | true | ConfigMap |
| `endpoints` | `ep` | v1 | true | Endpoints |
| `events` | `ev` | v1 | true | Event |
| `limitranges` | `limits` | v1 | true | LimitRange |
| `namespaces` | `ns` | v1 | false | Namespace |
| `nodes` | `no` | v1 | false | Node |
| `persistentvolumeclaims` | `pvc` | v1 | true | PersistentVolumeClaim |
| `persistentvolumes` | `pv` | v1 | false | PersistentVolume |
| `pods` | `po` | v1 | true | Pod |
| `podtemplates` |  | v1 | true | PodTemplate |
| `replicationcontrollers` | `rc` | v1 | true | ReplicationController |
| `resourcequotas` | `quota` | v1 | true | ResourceQuota |
| `secrets` |  | v1 | true | Secret |
| `serviceaccounts` | `sa` | v1 | true | ServiceAccount |
| `services` | `svc` | v1 | true | Service |
| `mutatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | MutatingWebhookConfiguration |
| `validatingwebhookconfigurations` |  | admissionregistration.k8s.io/v1 | false | ValidatingWebhookConfiguration |
| `customresourcedefinitions` | `crd,crds` | apiextensions.k8s.io/v1 | false | CustomResourceDefinition |
| `apiservices` |  | apiregistration.k8s.io/v1 | false | APIService |
| `controllerrevisions` |  | apps/v1 | true | ControllerRevision |
| `daemonsets` | `ds` | apps/v1 | true | DaemonSet |
| `deployments` | `deploy` | apps/v1 | true | Deployment |
| `replicasets` | `rs` | apps/v1 | true | ReplicaSet |
| `statefulsets` | `sts` | apps/v1 | true | StatefulSet |
| `tokenreviews` |  | authentication.k8s.io/v1 | false | TokenReview |
| `localsubjectaccessreviews` |  | authorization.k8s.io/v1 | true | LocalSubjectAccessReview |
| `selfsubjectaccessreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectAccessReview |
| `selfsubjectrulesreviews` |  | authorization.k8s.io/v1 | false | SelfSubjectRulesReview |
| `subjectaccessreviews` |  | authorization.k8s.io/v1 | false | SubjectAccessReview |
| `horizontalpodautoscalers` | `hpa` | autoscaling/v2 | true | HorizontalPodAutoscaler |
| `cronjobs` | `cj` | batch/v1 | true | CronJob |
| `jobs` |  | batch/v1 | true | Job |
| `certificatesigningrequests` | `csr` | certificates.k8s.io/v1 | false | CertificateSigningRequest |
| `leases` |  | coordination.k8s.io/v1 | true | Lease |
| `endpointslices` |  | discovery.k8s.io/v1 | true | EndpointSlice |
| `events` | `ev` | events.k8s.io/v1 | true | Event |
| `flowschemas` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | FlowSchema |
| `prioritylevelconfigurations` |  | flowcontrol.apiserver.k8s.io/v1beta2 | false | PriorityLevelConfiguration |
| `ingressclasses` |  | networking.k8s.io/v1 | false | IngressClass |
| `ingresses` | `ing` | networking.k8s.io/v1 | true | Ingress |
| `networkpolicies` | `netpol` | networking.k8s.io/v1 | true | NetworkPolicy |
| `runtimeclasses` |  | node.k8s.io/v1 | false | RuntimeClass |
| `poddisruptionbudgets` | `pdb` | policy/v1 | true | PodDisruptionBudget |
| `podsecuritypolicies` | `psp` | policy/v1beta1 | false | PodSecurityPolicy |
| `clusterrolebindings` |  | rbac.authorization.k8s.io/v1 | false | ClusterRoleBinding |
| `clusterroles` |  | rbac.authorization.k8s.io/v1 | false | ClusterRole |
| `rolebindings` |  | rbac.authorization.k8s.io/v1 | true | RoleBinding |
| `roles` |  | rbac.authorization.k8s.io/v1 | true | Role |
| `priorityclasses` | `pc` | scheduling.k8s.io/v1 | false | PriorityClass |
| `csidrivers` |  | storage.k8s.io/v1 | false | CSIDriver |
| `csinodes` |  | storage.k8s.io/v1 | false | CSINode |
| `csistoragecapacities` |  | storage.k8s.io/v1 | true | CSIStorageCapacity |
| `storageclasses` | `sc` | storage.k8s.io/v1 | false | StorageClass |
| `volumeattachments` |  | storage.k8s.io/v1 | false | VolumeAttachment |

## Параметри виводу {#output-options}

У наступних розділах описано, як форматувати або сортувати вивід деяких команд. Докладні відомості про те, які команди підтримують різні параметри виводу, див. у довідковій документації [kubectl](/docs/reference/kubectl/kubectl/).

### Форматування виводу {#formatting-output}

Типовий формат виводу для всіх команд `kubectl` – це читабельний текстовий формат. Щоб вивести деталі у вашому терміналі у певному форматі, ви можете додати прапорець `-o` або `--output` до підтримуваної команди `kubectl`.

#### Синтаксис {#syntax-1}

```shell
kubectl [command] [TYPE] [NAME] -o <output_format>
```

Залежно від операції `kubectl`, підтримуються такі формати виводу:

Формат виводу | Опис
--------------| -----------
`-o custom-columns=<spec>` | Вивести таблицю, використовуючи розділений комою список [власних стовпців](#custom-columns).
`-o custom-columns-file=<filename>` | Вивести таблицю, використовуючи шаблон [власних стовпців](#custom-columns) у файлі `<filename>`.
`-o json`     | Вивести обʼєкт API у форматі JSON.
`-o jsonpath=<template>` | Вивести поля, визначені у виразі [jsonpath](/docs/reference/kubectl/jsonpath/).
`-o jsonpath-file=<filename>` | Вивести поля, визначені у виразі [jsonpath](/docs/reference/kubectl/jsonpath/) у файлі `<filename>`.
`-o kyaml`    | Вивести обʼєкт API у форматі [KYAML](/docs/reference/encodings/kyaml/).
`-o name`     | Вивести лише імʼя ресурсу і нічого більше.
`-o wide`     | Вивести у текстовому форматі з будь-якою додатковою інформацією. Для Podʼів додається імʼя вузла.
`-o yaml`     | Вивести обʼєкт API у форматі YAML. KYAML є специфічним для Kubernetes діалектом YAML, і може читатись як YAML.

##### Приклад {#example}

У цьому прикладі така команда виводить інформацію про один Pod як обʼєкт у форматі YAML:

```shell
kubectl get pod web-pod-13je7 -o yaml
```

Нагадування: Дивіться довідку [kubectl](/docs/reference/kubectl/kubectl/) для отримання деталей щодо підтримуваних форматів виводу для кожної команди.

#### Власні стовпці {#custom-columns}

Щоб визначити власні стовпці та виводити лише ті деталі, які вам потрібні у вигляді таблиці, ви можете використовувати параметр `custom-columns`. Власні стовпці можна визначити безпосередньо в команді або у файлі шаблону: `-o custom-columns=<spec>` або `-o custom-columns-file=<filename>`.

##### Приклади {#examples}

Безпосередньо в команді:

```shell
kubectl get pods <pod-name> -o custom-columns=NAME:.metadata.name,RSRC:.metadata.resourceVersion
```

Файл шаблону:

```shell
kubectl get pods <pod-name> -o custom-columns-file=template.txt
```

де `template.txt` містить:

```
NAME          RSRC
metadata.name metadata.resourceVersion
```

Результат виконання будь-якої з команд буде подібний до:

```
NAME           RSRC
submit-queue   610995
```

#### Стовпці на стороні сервера {#server-side-columns}

`kubectl` підтримує отримання від сервера інформації про стовпці для обʼєктів. Це означає, що для будь-якого заданого ресурсу сервер поверне стовпці та рядки, що стосуються цього ресурсу, а клієнт їх виведе. Це дозволяє отримати послідовний, зручний для читання вивід для різних клієнтів, які використовуються для одного і того ж кластера, оскільки деталі виведення інкапсулює сервер.

Ця можливість типово увімкнена. Щоб вимкнути її, додайте прапорець `--server-print=false` до команди `kubectl get`.

##### Приклади {#examples-1}

Щоб вивести інформацію про стан Podʼа, використовуйте команду на зразок такої:

```shell
kubectl get pods <pod-name> --server-print=false
```

Вивід буде подібний до:

```
NAME       AGE
pod-name   1m
```

### Сортування списку обʼєктів {#sorting-list-objects}

Щоб вивести обʼєкти у відсортованому списку у вашому вікні термінала, ви можете додати прапорець `--sort-by` до підтримуваної команди `kubectl`. Впорядкуйте ваші обʼєкти, вказавши будь-яке числове чи рядкове поле з прапорцем `--sort-by`. Для вказання поля використовуйте вираз [jsonpath](/docs/reference/kubectl/jsonpath/).

#### Синтаксис {#syntax-2}

```shell
kubectl [command] [TYPE] [NAME] --sort-by=<jsonpath_exp>
```

##### Приклад {#example-1}

Щоб вивести список Podʼів, відсортованих за назвами, виконайте:

```shell
kubectl get pods --sort-by=.metadata.name
```

## Приклади: Загальні операції {#examples-common-operations}

Використовуйте цей набір прикладів, щоб ознайомитися з тим, як використовувати найпоширеніші операції `kubectl`:

`kubectl apply` — Застосувати або оновити ресурс із файлу чи stdin.

```shell
# Створити Service, використовуючи визначення у файлі example-service.yaml.
kubectl apply -f example-service.yaml

# Створити контролер реплікації, використовуючи визначення у файлі example-controller.yaml.
kubectl apply -f example-controller.yaml

# Створити обʼєкти, які визначені у файлах з розширеннями .yaml, .yml, або .json у теці <directory>.
kubectl apply -f <directory>
```

`kubectl get` — Вивести список одного чи кількох ресурсів.

```shell
# Показати всі Podʼи у форматі звичайного тексту.
kubectl get pods

# Показати всі Podʼи у форматі звичайного тексту з додатковою інформацією (наприклад, імʼям вузла).
kubectl get pods -o wide

# Показати контролер реплікації із вказаним імʼям у форматі звичайного тексту. Порада: Ви можете скоротити та замінити тип ресурсу 'replicationcontroller' на скорочену назву 'rc'.
kubectl get replicationcontroller <rc-name>

# Показати всі контролери реплікації та Service разом у форматі звичайного тексту.
kubectl get rc,services

# Показати всі DaemonSet у форматі звичайного тексту.
kubectl get ds

# Показати всі Podʼи, які працюють на вузлі server01
kubectl get pods --field-selector=spec.nodeName=server01
```

`kubectl describe` — Показати детальний стан одного чи кількох ресурсів, типово включно з тими, що ще не ініціалізовані.

```shell
# Показати деталі вузла із імʼям <node-name>.
kubectl describe nodes <node-name>

# Показати деталі Podʼа із імʼям <pod-name>.
kubectl describe pods/<pod-name>

# Показати деталі всіх Podʼів, якими керує контролер реплікації з іменем <rc-name>.
# Памʼятайте: Будь-які Podʼи, які створює контролер реплікації, отримують префікс із імʼям контролера реплікації.
kubectl describe pods <rc-name>

# Описати всі Podʼи
kubectl describe pods
```

{{< note >}}
Команда `kubectl get` зазвичай використовується для отримання одного чи кількох ресурсів того ж типу ресурсу. Вона має багатий набір прапорців, що дозволяють налаштовувати формат виводу за допомогою прапорця `-o` або `--output`, наприклад. Ви можете вказати прапорець `-w` або `--watch`, щоб почати слідкування за оновленнями для певного обʼєкта. Команда `kubectl describe` більше фокусується на описі багатьох повʼязаних аспектів вказаного ресурсу. Вона може робити кілька викликів до API-сервера для побудови виводу для користувача. Наприклад, команда `kubectl describe node` отримує не тільки інформацію про вузол, але й підсумок Podʼів, які працюють на ньому, події, створені для вузла, і т. д.
{{< /note >}}

`kubectl delete` — Видалити ресурси або з використанням файлу, або з stdin, або вказавши селектори міток, імена, селектори ресурсів чи самі ресурси.

```shell
# Видалити Pod, використовуючи тип та імʼя, вказане у файлі pod.yaml.
kubectl delete -f pod.yaml

# Видалити всі Podʼи та Service із міткою '<label-key>=<label-value>'.
kubectl delete pods,services -l <label-key>=<label-value>

# Видалити всі Podʼи, включаючи неініціалізовані.
kubectl delete pods --all
```

`kubectl exec` — Виконати команду у контейнері Podʼа.

```shell
# Отримати вивід виконання команди 'date' у Podʼі <pod-name>. Типово виводиться результат з першого контейнера.
kubectl exec <pod-name> -- date

# Отримати вивід виконання команди 'date' у контейнері <container-name> Podʼа <pod-name>.
kubectl exec <pod-name> -c <container-name> -- date

# Отримати інтерактивний TTY та виконати /bin/bash у Podʼі <pod-name>. Типово виводиться результат з першого контейнера.
kubectl exec -ti <pod-name> -- /bin/bash
```

`kubectl logs` — Вивести логи для контейнера у Podʼі.

```shell
# Отримати знімок логів з Podʼа <pod-name>.
kubectl logs <pod-name>

# Почати виведення логів у режимі стрічки з Podʼа <pod-name>. Це схоже на команду 'tail -f' у Linux.
kubectl logs -f <pod-name>
```

`kubectl diff` — Переглянути відмінності запропонованих оновлень кластера.

```shell
# Порівняти ресурси, включені в "pod.json".
kubectl diff -f pod.json

# Порівняти файл, прочитаний зі stdin.
cat service.yaml | kubectl diff -f -
```

## Приклади: Створення та використання втулків {#examples-creating-and-using-plugins}

Використовуйте цей набір прикладів, щоб ознайомитися із написанням та використанням втулків `kubectl`:

```shell
# створіть простий втулок будь-якою мовою та назвіть отриманий виконуваний файл
# так, щоб його назва починалася з префікса "kubectl-"
cat ./kubectl-hello
```

```shell
#!/bin/sh

# цей втулок виводить слова "hello world"
echo "hello world"
```

Коли втулок написано, зробімо його виконуваним:

```bash
chmod a+x ./kubectl-hello

# та перемістіть його в місце, яке є у вашому шляху (PATH)
sudo mv ./kubectl-hello /usr/local/bin
sudo chown root:root /usr/local/bin

# Тепер ви створили та "встановили" втулок kubectl.
# Ви можете почати використовувати цей втулок, викликаючи його з kubectl, ніби це звичайна команда
kubectl hello
```

```
hello world
```

```shell
# Ви можете "вилучити" втулок, видаливши його з теки у вашому
# $PATH, де ви його розмістили
sudo rm /usr/local/bin/kubectl-hello
```

Щоб переглянути всі втулки, доступні для `kubectl`, використовуйте команду `kubectl plugin list`:

```shell
kubectl plugin list
```

Вивід буде схожий на:

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-hello
/usr/local/bin/kubectl-foo
/usr/local/bin/kubectl-bar
```

`kubectl plugin list` також попереджає вас про втулки, які не мають прав на виконання, або які затінені іншими втулками; наприклад:

```shell
sudo chmod -x /usr/local/bin/kubectl-foo # прибрати дозвіл на виконання
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

Втулки можна розглядати як спосіб будувати складнішу функціональність на основі наявних команд kubectl:

```shell
cat ./kubectl-whoami
```

У наступних кількох прикладах припускається, що файл `kubectl-whoami` вже має такий вміст:

```shell
#!/bin/bash

# цей втулок використовує команду `kubectl config` для виведення
# інформації про поточного користувача, на основі вибраного контексту
kubectl config view --template='{{ range .contexts }}{{ if eq .name "'$(kubectl config current-context)'" }}Current user: {{ printf "%s\n" .context.user }}{{ end }}{{ end }}'
```

Запуск вищезазначеної команди дає вам вивід із зазначенням користувача для поточного контексту у вашому файлі KUBECONFIG:

```shell
# зробіть файл виконуваним
sudo chmod +x ./kubectl-whoami

# та перемістіть його в теку з вашого PATH
sudo mv ./kubectl-whoami /usr/local/bin

kubectl whoami
Current user: plugins-user
```

## {{% heading "whatsnext" %}} {#whats-next}

* Ознайомтеся з документацією `kubectl`:
  * [довідник команд](/docs/reference/kubectl/kubectl/) kubectl
  * довідник [аргументів командного рядка](/docs/reference/kubectl/generated/kubectl/)
* Дізнайтеся про [домовленості використання `kubectl`](/docs/reference/kubectl/conventions/)
* Ознайомтеся з [підтримкою JSONPath](/docs/reference/kubectl/jsonpath/) у kubectl
* Дізнайтеся, як [розширювати kubectl за допомогою втулків](/docs/tasks/extend-kubectl/kubectl-plugins)
  * Для отримання додаткової інформації про втулки, подивіться [приклад CLI-втулка](https://github.com/kubernetes/sample-cli-plugin).
