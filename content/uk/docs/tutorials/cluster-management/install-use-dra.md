---
title: Встановлення драйверів та виділення пристроїв з DRA
content_type: tutorial
weight: 60
min-kubernetes-server-version: v1.34
---
<!-- МАЙБУТНІМ СУПРОВОДЖУВАЧАМ:
Початкова мета цього документа полягала в тому, щоб люди (в основному адміністратори кластера) зрозуміли важливість драйвера DRA та його взаємодію з API DRA. В результаті цього для цього навчального посібника було вимогою не використовувати Helm і бути більш прямолінійним з усіма процедурами встановлення компонентів. Хоча багато з цього вмісту також корисно для авторів робочих навантажень, я бачу основну аудиторію _цього_ посібника як адміністраторів кластера, які, на мою думку, також повинні розуміти, як API DRA взаємодіють з драйвером для їх належного обслуговування. Якби мені довелося вибирати, на якій аудиторії зосередитися в цьому документі, я б вибрав адміністраторів кластера. Якщо текст стає занадто заплутаним через врахування обох аудиторій, я б краще створив другий посібник для авторів робочих навантажень, який взагалі не зачіпає драйвер (оскільки, на мою думку, це більше відповідає тому, яким ми думаємо має бути їхній досвід) і також потенційно розглядає більш детальні/ ✨ цікаві ✨ випадки використання.
-->

{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->
Цей посібник показує, як встановити драйвери {{< glossary_tooltip term_id="dra" text="Динамічного виділення ресурсів (DRA)" >}} у вашому кластері та як використовувати їх разом з API DRA для виділення {{< glossary_tooltip text="пристроїв" term_id="device"
>}} для Pod. Ця сторінка призначена для адміністраторів кластерів.

{{< glossary_tooltip text="Динамічне виділення ресурсів (DRA)" term_id="dra" >}} дозволяє кластеру керувати доступністю та виділенням апаратних ресурсів для задоволення вимог Podʼів до апаратних ресурсів та налаштувань. Щоб підтримати це, суміш вбудованих компонентів Kubernetes (таких як планувальник Kubernetes, kubelet і kube-controller-manager) та сторонніх драйверів від власників пристроїв (які називаються драйверами DRA) спільно відповідають за оголошення, виділення, підготовку, монтування, перевірку стану, скасування підготовки та очищення ресурсів протягом усього життєвого циклу Podʼа. Ці компоненти обмінюються інформацією через серію специфічних для DRA API в групі API `resource.k8s.io`, включаючи {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}, {{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}}, {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}}, а також нові поля в самій специфікації Pod.

<!-- objectives -->

### {{% heading "objectives" %}}

* Розгорнути приклад драйвера DRA
* Розгорнути Pod, що виконує заявку на апаратні ресурси за допомогою API DRA
* Видалити Pod, який має заявку

<!-- prerequisites -->
## {{% heading "prerequisites" %}}

Ваш кластер повинен підтримувати [RBAC](/docs/reference/access-authn-authz/rbac/). Ви можете спробувати цей посібник з кластером, який використовує механізм авторизації, відмінний від RBAC, але в цьому випадку вам доведеться адаптувати кроки щодо визначення ролей і дозволів.

{{< include "task-tutorial-prereqs.md" >}}

Цей посібник був протестований з вузлами Linux, хоча він також може працювати з іншими типами вузлів.

 {{< version-check >}}

Якщо ваш кластер наразі не працює під управлінням Kubernetes {{< skew currentVersion >}}, перегляньте документацію щодо версії Kubernetes, яку ви плануєте використовувати.

<!-- lessoncontent -->

## Дослідження початкового стану кластера {#explore-initial-state}

Ви можете витратити деякий час, щоб спостерігати за початковим станом кластера з увімкненим DRA, особливо якщо ви не використовували ці API раніше. Якщо ви налаштували новий кластер для цього посібника, без встановленого драйвера та ще не задоволених заявок Pod, вивід цих команд не покаже жодних ресурсів.

1.  Отримайте список {{< glossary_tooltip text="DeviceClasses" term_id="deviceclass" >}}:

    ```shell
    kubectl get deviceclasses
    ```

    Вивід буде схожий на цей:

    ```text
    No resources found
    ```

1.  Отримайте список {{< glossary_tooltip text="ResourceSlices" term_id="resourceslice" >}}:

    ```shell
    kubectl get resourceslices
    ```

    Вивід буде схожий на цей:

    ```text
    No resources found
    ```

1.  Отримайте список {{< glossary_tooltip text="ResourceClaims" term_id="resourceclaim" >}} та {{< glossary_tooltip text="ResourceClaimTemplates" term_id="resourceclaimtemplate" >}}

    ```shell
    kubectl get resourceclaims -A
    kubectl get resourceclaimtemplates -A
    ```

    Вивід буде схожий на цей:

    ```text
    No resources found
    No resources found
    ```

На даний момент ви підтвердили, що DRA увімкнено та налаштовано правильно в кластері, і що жоден драйвер DRA ще не оголосив жодних ресурсів API DRA.

## Встановлення демонстраційного драйвера DRA {#install-example-driver}

Драйвери DRA — це сторонні програми, які працюють на кожному вузлі вашого кластера, щоб взаємодіяти з апаратним забезпеченням цього вузла та вбудованими компонентами DRA Kubernetes. Процедура встановлення залежить від вибраного вами драйвера, але, ймовірно, розгортається як {{< glossary_tooltip term_id="daemonset" >}} на всіх або вибраних вузлах (з використанням {{< glossary_tooltip text="selectors" term_id="selector" >}} або подібних механізмів) у вашому кластері.

Перевірте документацію вашого драйвера на наявність конкретних інструкцій щодо встановлення, які можуть включати чарт Helm, набір маніфестів або інші інструменти розгортання.

Цей посібник використовує приклад драйвера, який можна знайти в репозиторії [kubernetes-sigs/dra-example-driver](https://github.com/kubernetes-sigs/dra-example-driver), щоб продемонструвати встановлення драйвера. Цей приклад драйвера оголошує симульовані GPU для Kubernetes, з якими можуть взаємодіяти ваші Podʼи.

### Підготовка кластера до встановлення драйвера {#prepare-cluster-driver}

Щоб спростити очищення, створіть простір імен з назвою dra-tutorial:

1.  Створіть простір імен:

    ```shell
    kubectl create namespace dra-tutorial
    ```

У промисловому середовищі ви, напевно, використовували б раніше випущений або кваліфікований образ від постачальника драйвера або вашої організації, і ваші вузли повинні мати доступ до реєстру образів, де зберігається образ драйвера. У цьому навчальному посібнику ви будете використовувати публічно випущений образ dra-example-driver, щоб змоделювати доступ до образу драйвера DRA.

1.  Підтвердіть, що ваші вузли мають доступ до образу, виконавши наступну команду зсередини одного з вузлів вашого кластера:

    ```shell
    docker pull registry.k8s.io/dra-example-driver/dra-example-driver:v0.2.0
    ```

### Розгортання компонентів драйвера DRA {#deploy-the-dra-driver-components}

Для цього навчального посібника ви встановите критично важливі компоненти демонстраційного драйвера ресурсів окремо за допомогою `kubectl`.

1.  Створіть DeviceClass, що представляє типи пристроїв, які підтримує цей драйвер DRA:

    {{% code_sample language="yaml" file="dra/driver-install/deviceclass.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/deviceclass.yaml
    ```

1.  Створіть службовий обліковий запис, кластерну роль і привʼязку кластерної ролі, які будуть використовуватися драйвером для отримання дозволів на взаємодію з Kubernetes API в цьому кластері:

      1.  Створіть Service Account:

          {{% code_sample language="yaml" file="dra/driver-install/serviceaccount.yaml" %}}

          ```shell
          kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/serviceaccount.yaml
          ```

      1.  Створіть ClusterRole:

          {{% code_sample language="yaml" file="dra/driver-install/clusterrole.yaml" %}}

          ```shell
          kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/clusterrole.yaml
          ```

      1.  Створіть ClusterRoleBinding:

          {{% code_sample language="yaml" file="dra/driver-install/clusterrolebinding.yaml" %}}

          ```shell
          kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/clusterrolebinding.yaml
          ```

1.  Створіть {{< glossary_tooltip term_id="priority-class" >}} для DRA
    драйвера. PriorityClass запобігає витісненню компонента драйвера DRA, який відповідає за важливі операції життєвого циклу для Podʼів з заявками. Дізнайтеся більше про [пріоритет Podʼів та виселення тут](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

    {{% code_sample language="yaml" file="dra/driver-install/priorityclass.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/priorityclass.yaml
    ```

1.  Розгорніть фактичний драйвер DRA як DaemonSet, налаштований на запуск прикладу двійкового файлу драйвера з вищезазначеними дозволами.

    {{% code_sample language="yaml" file="dra/driver-install/daemonset.yaml" %}}

    ```shell
    kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/daemonset.yaml
    ```
    DaemonSet налаштовано з точками монтування томів, необхідними для взаємодії з підлягаючим текою Container Device Interface (CDI), і для відкриття його сокета для `kubelet` через теку `kubelet/plugins`.

### Перевірка встановлення драйвера DRA {#verify-driver-install}

1.  Отримайте список Podʼів DaemonSet драйвера DRA на всіх робочих вузлах:

    ```shell
    kubectl get pod -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```

    Вивід буде схожий на цей:

    ```text
    NAME                                     READY   STATUS    RESTARTS   AGE
    dra-example-driver-kubeletplugin-4sk2x   1/1     Running   0          13s
    dra-example-driver-kubeletplugin-cttr2   1/1     Running   0          13s
    ```

1.  Початкова відповідальність локального драйвера DRA кожного вузла полягає в оновленні відомостей кластера про те, які пристрої доступні для Podʼів на цьому вузлі, публікуючи його метадані в API ResourceSlices. Ви можете перевірити цей API, щоб побачити, що кожен вузол з драйвером оголошує клас пристрою, який він представляє.

    Перевірте наявність доступних ResourceSlices:

    ```shell
    kubectl get resourceslices
    ```

    Вивід буде схожий на цей:

    ```text
    NAME                                 NODE           DRIVER            POOL           AGE
    kind-worker-gpu.example.com-k69gd    kind-worker    gpu.example.com   kind-worker    19s
    kind-worker2-gpu.example.com-qdgpn   kind-worker2   gpu.example.com   kind-worker2   19s
    ```

На даний момент ви успішно встановили приклад драйвера DRA та підтвердили його початкову конфігурацію. Тепер ви готові використовувати DRA для планування Podʼів.

## Запит ресурсів та розгортання Podʼа {#claim-resources-pod}

Щоб запитати ресурси за допомогою DRA, ви створюєте ResourceClaims або ResourceClaimTemplates, які визначають ресурси, які потрібні вашим Podʼам. У демонстраційному драйвері для симульованих пристроїв GPU доступний атрибут ємності памʼяті. Цей розділ показує, як використовувати {{< glossary_tooltip term_id="cel" >}} для
зазначення ваших вимог у ResourceClaim, вибору цього ResourceClaim у специфікації Podʼа та спостереження за виділенням ресурсів.

Цей посібник демонструє лише один базовий приклад ResourceClaim DRA. Читайте [Динамічне виділення ресурсів](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/), щоб дізнатися більше про ResourceClaims.

### Створення ResourceClaim {#create-resourceclaim}

У цьому розділі ви створюєте ResourceClaim і посилаєтеся на нього в Pod. Яким би не був запит, поле `deviceClassName` є обовʼязковим, звужуючи обсяг запиту до конкретного класу пристрою. Сам запит може включати вираз {{< glossary_tooltip term_id="cel" >}}, який посилається на атрибути, які можуть бути оголошені драйвером, що керує цим класом пристроїв.

У цьому прикладі ви створите запит на будь-який GPU, що оголошує понад 10Gi ємності памʼяті. Атрибут, що експонує ємність від прикладного драйвера, має форму `device.capacity['gpu.example.com'].memory`. Зверніть увагу, що імʼя запиту встановлено на `some-gpu`.

{{% code_sample language="yaml" file="dra/driver-install/example/resourceclaim.yaml" %}}

```shell
kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/example/resourceclaim.yaml
```

### Створення Pod, який посилається на цей ResourceClaim {#create-the-pod-that-references-that-resourceclaim}

Нижче наведено маніфест Pod, що посилається на ResourceClaim, який ви щойно створили, `some-gpu`, у полі `spec.resourceClaims.resourceClaimName`. Локальне імʼя для цього запиту, `gpu`, потім використовується в полі `spec.containers.resources.claims.name`, щоб виділити запит для підлеглого контейнера Pod.

{{% code_sample language="yaml" file="dra/driver-install/example/pod.yaml" %}}

```shell
kubectl apply --server-side -f http://k8s.io/examples/dra/driver-install/example/pod.yaml
```

1.  Підтвердіть, що pod розгорнуто:

    ```shell
    kubectl get pod pod0 -n dra-tutorial
    ```

    Вивід буде схожий на цей:

    ```text
    NAME   READY   STATUS    RESTARTS   AGE
    pod0   1/1     Running   0          9s
    ```

### Дослідження стану DRA {#explore-the-dra-state}

Після створення Podʼа кластер намагається запланювати цей Pod на вузол, де Kubernetes може задовольнити ResourceClaim. У цьому навчальному посібнику драйвер DRA розгорнуто на всіх вузлах і оголошено симульовані GPU на всіх вузлах, всі з яких мають достатню оголошену ємність для задоволення заявки Podʼа, тому Kubernetes може планувати цей Pod на будь-якому вузлі та може виділити будь-який з симульованих GPU на цьому вузлі.

Коли Kubernetes виділяє симульований GPU для Pod, демонстраційний драйвер додає змінні середовища в кожен контейнер, до якого він виділений, щоб вказати, які GPU _мали б_ бути впроваджені в них реальним драйвером ресурсів і як вони мали б бути налаштовані, тому ви можете перевірити ці змінні середовища, щоб побачити, як Podʼи оброблялися системою.

1.  Перевірте логи Pod, які повідомляють імʼя симульованого GPU, що був виділений:

    ```shell
    kubectl logs pod0 -c ctr0 -n dra-tutorial | grep -E "GPU_DEVICE_[0-9]+=" | grep -v "RESOURCE_CLAIM"
    ```

    Вивід буде схожий на цей:

    ```text
    declare -x GPU_DEVICE_0="gpu-0"
    ```

1.  Перевірте стан обʼєкта ResourceClaim:

    ```shell
    kubectl get resourceclaims -n dra-tutorial
    ```

    Вивід буде схожий на цей:

    ```text
    NAME       STATE                AGE
    some-gpu   allocated,reserved   34s
    ```

    У цьому виводі стовпець `STATE` показує, що ResourceClaim виділено та зарезервовано.

1.  Перевірте деталі ResourceClaim `some-gpu`. Вираз `status` в ResourceClaim містить інформацію про виділений пристрій і Pod, для якого він був зарезервований:

    ```shell
    kubectl get resourceclaim some-gpu -n dra-tutorial -o yaml
    ```

    Вивід буде схожий на цей:

    {{< highlight yaml "linenos=inline, hl_lines=27-30 38-41, style=emacs" >}}
    apiVersion: resource.k8s.io/v1
    kind: ResourceClaim
    metadata:
        creationTimestamp: "2025-08-20T18:17:31Z"
        finalizers:
        - resource.kubernetes.io/delete-protection
        name: some-gpu
        namespace: dra-tutorial
        resourceVersion: "2326"
        uid: d3e48dbf-40da-47c3-a7b9-f7d54d1051c3
    spec:
        devices:
            requests:
            - exactly:
                allocationMode: ExactCount
                count: 1
                deviceClassName: gpu.example.com
                selectors:
                - cel:
                    expression: device.capacity['gpu.example.com'].memory.compareTo(quantity('10Gi'))
                    >= 0
            name: some-gpu
    status:
        allocation:
            devices:
            results:
            - device: gpu-0
                driver: gpu.example.com
                pool: kind-worker
                request: some-gpu
            nodeSelector:
            nodeSelectorTerms:
            - matchFields:
                - key: metadata.name
                operator: In
                values:
                - kind-worker
        reservedFor:
        - name: pod0
            resource: pods
            uid: c4dadf20-392a-474d-a47b-ab82080c8bd7
    {{< /highlight >}}

1.  Щоб перевірити, як драйвер обробив виділення пристрою, отримайте журнали для Podʼів DaemonSet драйвера:

    ```shell
    kubectl logs -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```

    Вивід буде схожий на цей:

    ```log
    I0729 05:11:52.679057       1 driver.go:84] NodePrepareResource is called: number of claims: 1
    I0729 05:11:52.684450       1 driver.go:112] Returning newly prepared devices for claim '79e1e8d8-7e53-4362-aad1-eca97678339e': [&Device{RequestNames:[some-gpu],PoolName:kind-worker,DeviceName:gpu-4,CDIDeviceIDs:[k8s.gpu.example.com/gpu=common k8s.gpu.example.com/gpu=79e1e8d8-7e53-4362-aad1-eca97678339e-gpu-4],}]
    ```

Тепер ви успішно розгорнули Pod, який запитує пристрої за допомогою DRA, перевірили, що Pod було заплановано на відповідний вузол, і побачили, що повʼязані види API DRA були оновлені зі статусом виділення.

## Видалення Podʼа, що має заявку {#delete-pod-claim}

Коли Pod з заявкою видаляється, драйвер DRA деалокує ресурс, щоб він був доступний для майбутнього планування. Щоб перевірити цю поведінку, видаліть Pod, який ви створили на попередніх кроках, і спостерігайте за відповідними змінами в ResourceClaim та драйвері.

1.  Видаліть Pod `pod0`:

    ```shell
    kubectl delete pod pod0 -n dra-tutorial
    ```

    Вивід буде схожий на цей:

    ```text
    pod "pod0" deleted
    ```

### Спостереження за станом DRA {#observe-the-dra-state}

Коли Pod видаляється, драйвер деалокує пристрій з ResourceClaim і оновлює ресурс ResourceClaim в API Kubernetes. ResourceClaim має стан `pending`, поки він не буде згаданий у новому Pod.

1.  Перевірте стан ResourceClaim `some-gpu`:

    ```shell
    kubectl get resourceclaims -n dra-tutorial
    ```

    Вивід буде схожий на цей:

    ```text
    NAME       STATE     AGE
    some-gpu   pending   76s
    ```

1.  Перевірте, що драйвер обробив скасування підготовки пристрою для цього запиту, перевіривши журнали драйвера:

    ```shell
    kubectl logs -l app.kubernetes.io/name=dra-example-driver -n dra-tutorial
    ```

    Вивід буде схожий на цей:

    ```log
    I0820 18:22:15.629376       1 driver.go:138] UnprepareResourceClaims is called: number of claims: 1
    ```

Тепер ви видалили Pod, який мав заявку, і спостерігали, що драйвер вживав заходів для скасування підготовки підлягаючого апаратного ресурсу та оновлення API DRA, щоб відобразити, що ресурс знову доступний для майбутнього планування.

## {{% heading "cleanup" %}}

Щоб очистити ресурси, які ви створили в цьому навчальному посібнику, виконайте ці кроки:

```shell
kubectl delete namespace dra-tutorial
kubectl delete deviceclass gpu.example.com
kubectl delete clusterrole dra-example-driver-role
kubectl delete clusterrolebinding dra-example-driver-role-binding
kubectl delete priorityclass dra-driver-high-priority
```

## {{% heading "whatsnext" %}}

* [Дізнайтеся більше про DRA](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
* [Виділення пристроїв робочим навантаженням за допомогою DRA](/docs/tasks/configure-pod-container/assign-resources/allocate-devices-dra)
