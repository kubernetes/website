---
title: Використання NUMA-орієнтованого менеджера памʼяті
content_type: task
min-kubernetes-server-version: v1.32
weight: 410
---

<!-- overview -->

{{< feature-state feature_gate_name="MemoryManager" >}}

Менеджер памʼяті Kubernetes дозволяє функцію гарантованого виділення памʼяті (та великих сторінок) для Podʼів {{< glossary_tooltip text="QoS класу" term_id="qos-class" >}} `Guaranteed`.

Менеджер памʼяті використовує протокол генерації підказок для вибору найбільш відповідної спорідненості NUMA для точки доступу. Менеджер памʼяті передає ці підказки центральному менеджеру (*Менеджеру топології*). На основі як підказок, так і політики Менеджера топології, Pod відхиляється або допускається на вузол.

Крім того, Менеджер памʼяті забезпечує, що памʼять, яку запитує Pod, виділяється з мінімальної кількості NUMA-вузлів.

Менеджер памʼяті має відношення тільки до хостів на базі Linux.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Для вирівнювання ресурсів памʼяті з іншими запитаними ресурсами у специфікації Podʼа:

- Менеджер CPU повинен бути увімкнений, і на вузлі повинна бути налаштована відповідна політика Менеджера CPU. Див. [управління політиками керування CPU](/docs/tasks/administer-cluster/cpu-management-policies/);
- Менеджер топології повинен бути увімкнений, і на вузлі повинна бути налаштована відповідна політика Менеджера топології. Див. [управління політиками керування топологією](/docs/tasks/administer-cluster/topology-manager/).

Починаючи з версії v1.22, Менеджер памʼяті типово увімкнено за допомогою [функціональної можливості](/docs/reference/command-line-tools-reference/feature-gates/) `MemoryManager`.

Для версій до v1.22, `kubelet` повинен бути запущений з наступним прапорцем:

`--feature-gates=MemoryManager=true`

щоб увімкнути функцію Менеджера памʼяті.

## Як працює Менеджер памʼяті? {#how-does-the-memory-manager-operate}

Зараз Менеджер памʼяті пропонує виділення гарантованої памʼяті (та великих сторінок) для Podʼів у класі QoS `Guaranteed`. Щоб негайно ввести Менеджер памʼяті в роботу, слідкуйте вказівкам у розділі [Налаштування Менеджера памʼяті](#memory-manager-configuration), а потім підготуйте та розгорніть Pod `Guaranteed`, як показано в розділі [Розміщення Podʼів класу QoS Guaranteed](#placing-a-pod-in-the-guaranteed-qos-class).

Менеджер памʼяті є постачальником підказок і надає підказки топології для Менеджера топології, який потім вирівнює запитані ресурси згідно з цими підказками топології. На Linux, він також застосовує `cgroups` (тобто `cpuset.mems`) для Podʼів. Повна схематична діаграма щодо процесу допуску та розгортання Podʼа показано у [Memory Manager KEP: Design Overview][4] та нижче:

![Memory Manager у процесі прийняття та розгортання Podʼа](/images/docs/memory-manager-diagram.svg)

Під час цього процесу Менеджер памʼяті оновлює свої внутрішні лічильники, що зберігаються в [Node Map та Memory Maps][2], для управління гарантованим виділенням памʼяті.

Менеджер памʼяті оновлює Node Map під час запуску та виконання наступним чином.

### Запуск {#startup}

Це відбувається один раз, коли адміністратор вузла використовує `--reserved-memory` (розділ
[Прапорець зарезервованої памʼяті](#reserved-memory-flag)). У цьому випадку Node Map оновлюється, щоб відображати це резервування, як показано в [Memory Manager KEP: Memory Maps at start-up (with examples)][5].

Адміністратор повинен надати прапорець `--reserved-memory` при налаштуванні політики `Static`.

### Робота {#runtime}

Посилання [Memory Manager KEP: Memory Maps at runtime (with examples)][6] ілюструє, як успішне розгортання Podʼа впливає на Node Map, і також повʼязано з тим, як потенційні випадки вичерпання памʼяті (OOM) далі обробляються Kubernetes або операційною системою.

Важливою темою в контексті роботи Менеджера памʼяті є керування NUMA-групами. Кожного разу, коли запит памʼяті Podʼа перевищує місткість одного NUMA-вузла, Менеджер памʼяті намагається створити групу, яка включає декілька NUMA-вузлів і має розширений обсяг памʼяті. Проблему вирішено, як про це йдеться у [Memory Manager KEP: How to enable the guaranteed memory allocation over many NUMA nodes?][3]. Також, посилання [Memory Manager KEP: Simulation - how the Memory Manager works? (by examples)][1] показує, як відбувається управління групами.

### Підтримка Windows {#windows-support}

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

Підтримку Windows можна увімкнути за допомогою функціональної можливості `WindowsCPUAndMemoryAffinity` і вона потребує підтримки під час виконання контейнера. У Windows підтримується лише політика [BestEffort Policy](#policy-best-effort).

## Налаштування Менеджера памʼяті {#memory-manager-configuration}

Інші Менеджери повинні бути спочатку попередньо налаштовані. Далі, функцію Менеджера памʼяті слід увімкнути та запустити з політикою `Static` (розділ [Політика Static](#policy-static)). Опційно можна зарезервувати певну кількість памʼяті для системи або процесів kubelet, щоб збільшити стабільність вузла (розділ [Прапорець зарезервованої памʼяті](#reserved-memory-flag)).

### Політики {#policies}

Менеджер памʼяті підтримує дві політики. Ви можете вибрати політику за допомогою прапорця `kubelet` `--memory-manager-policy`:

- `None` (типово)
- `Static` (тільки Linux)
- `BestEffort` (тільки Windows)

#### Політика None {#policy-none}

Це типова політика і вона не впливає на виділення памʼяті жодним чином. Вона працює так само як і коли Менеджер памʼяті взагалі відсутній.

Політика `None` повертає типову підказку топології. Ця спеціальна підказка позначає, що Hint Provider (в цьому випадку Менеджер памʼяті) не має переваги щодо спорідненості NUMA з будь-яким ресурсом.

#### Політика Static {#policy-static}

У випадку `Guaranteed` Podʼа політика Менеджера памʼяті `Static` повертає підказки топології, що стосуються набору NUMA-вузлів, де памʼять може бути гарантованою, та резервує памʼять, оновлюючи внутрішній обʼєкт [NodeMap][2].

У випадку Podʼа `BestEffort` або `Burstable` політика Менеджера памʼяті `Static` повертає назад типову підказку топології, оскільки немає запиту на гарантовану памʼять, і не резервує памʼять внутрішнього обʼєкта [NodeMap][2].

Ця політика підтримується тільки в Linux.

#### Політика BestEffort {#policy-best-effort}

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

Ця політика підтримується лише у Windows.

У Windows призначення вузлів NUMA працює інакше, ніж у Linux. Не існує механізму, який би гарантував, що доступ до памʼяті надається лише з певного вузла NUMA. Замість цього планувальник Windows вибере найоптимальніший вузол NUMA на основі призначень процесора(ів). Можливо, Windows може використовувати інші вузли NUMA, якщо планувальник Windows вважатиме їх оптимальними.

Політика відстежує кількість доступної та запитуваної памʼяті за допомогою внутрішньої [NodeMap][2]. Менеджер памʼяті докладе максимум зусиль для забезпечення достатнього обсягу памʼяті навузлі NUMA перед тим, як призначити пам'ять. Це означає, що у більшості випадків розподіл памʼяті має відбуватися як очікується.

### Прапорець зарезервованої памʼяті {#reserved-memory-flag}

Механізм [виділення ресурсів вузла](/docs/tasks/administer-cluster/reserve-compute-resources/) (Node Allocatable) зазвичай використовується адміністраторами вузлів для резервування системних ресурсів вузла K8S для kubelet або процесів операційної системи, щоб підвищити стабільність вузла. Для цього можна використовувати відповідний набір прапорців, щоб вказати загальну кількість зарезервованої памʼяті для вузла. Це попередньо налаштоване значення далі використовується для розрахунку реальної кількості "виділеної"
памʼяті вузла, доступної для Podʼів.

Планувальник Kubernetes використовує "виділену" памʼять для оптимізації процесу планування Podʼів. Для цього використовуються прапорці `--kube-reserved`, `--system-reserved` та `--eviction-threshold`. Сума їх значень враховує загальну кількість зарезервованої памʼяті.

Новий прапорець `--reserved-memory` було додано до Memory Manager, щоб дозволити цю загальну зарезервовану памʼять розділити (адміністратором вузла) і відповідно зарезервувати для багатьох вузлів NUMA.

Прапорець визначається як розділений комами список резервування памʼяті різних типів на NUMA-вузол. Резервації памʼяті по кількох NUMA-вузлах можна вказати, використовуючи крапку з комою як роздільник. Цей параметр корисний лише в контексті функції Менеджера памʼяті. Менеджер памʼяті не використовуватиме цю зарезервовану памʼять для виділення контейнерних робочих навантажень.

Наприклад, якщо у вас є NUMA-вузол "NUMA0" з доступною памʼяттю `10 ГБ`, і було вказано `--reserved-memory`, щоб зарезервувати `1 ГБ` памʼяті в "NUMA0", Менеджер памʼяті припускає, що для контейнерів доступно тільки `9 ГБ`.

Ви можете не вказувати цей параметр, але слід памʼятати, що кількість зарезервованої памʼяті з усіх NUMA-вузлів повинна дорівнювати кількості памʼяті, вказаній за допомогою [функції виділення ресурсів вузла](/docs/tasks/administer-cluster/reserve-compute-resources/). Якщо принаймні один параметр виділення вузла не дорівнює нулю, вам слід вказати `--reserved-memory` принаймні для одного NUMA-вузла. Фактично, порогове значення `eviction-hard` типово становить `100 Mi`, отже, якщо використовується політика `Static`, `--reserved-memory` є обовʼязковим.

Також слід уникати наступних конфігурацій:

1. дублікатів, тобто того самого NUMA-вузла або типу памʼяті, але з іншим значенням;
2. встановлення нульового ліміту для будь-якого типу памʼяті;
3. ідентифікаторів NUMA-вузлів, які не існують в апаратному забезпеченні машини;
4. назв типів памʼяті відмінних від `memory` або `hugepages-<size>` (великі сторінки певного розміру `<size>` також повинні існувати).

Синтаксис:

`--reserved-memory N:memory-type1=value1,memory-type2=value2,...`

- `N` (ціле число) — індекс NUMA-вузла, наприклад `0`
- `memory-type` (рядок) — представляє тип памʼяті:
  - `memory` — звичайна памʼять
  - `hugepages-2Mi` або `hugepages-1Gi` — великі сторінки
- `value` (рядок) - кількість зарезервованої памʼяті, наприклад `1Gi`.

Приклад використання:

`--reserved-memory 0:memory=1Gi,hugepages-1Gi=2Gi`

або

`--reserved-memory 0:memory=1Gi --reserved-memory 1:memory=2Gi`

або

`--reserved-memory '0:memory=1Gi;1:memory=2Gi'`

При вказанні значень для прапорця `--reserved-memory` слід дотримуватися налаштування, яке ви вказали раніше за допомогою прапорців функції виділення вузла. Іншими словами, слід дотримуватися такого правила для кожного типу памʼяті:

`sum(reserved-memory(i)) = kube-reserved + system-reserved + eviction-threshold`,

де `i` - це індекс NUMA-вузла.

Якщо ви не дотримуєтесь вищезазначеної формули, Менеджер памʼяті покаже помилку при запуску.

Іншими словами, у вищезазначеному прикладі показано, що для звичайної памʼяті (`type=memory`) ми загалом резервуємо `3 ГБ`, а саме:

`sum(reserved-memory(i)) = reserved-memory(0) + reserved-memory(1) = 1 ГБ + 2 ГБ = 3 ГБ`

Приклад командних аргументів kubelet, що стосуються конфігурації виділення вузла:

- `--kube-reserved=cpu=500m,memory=50Mi`
- `--system-reserved=cpu=123m,memory=333Mi`
- `--eviction-hard=memory.available<500Mi`

{{< note >}}
Типове значення для жорсткого порога виселення становить 100MiB, а **не** нуль. Не забудьте збільшити кількість памʼяті, яку ви резервуєте, встановивши `--reserved-memory` на величину цього жорсткого порога виселення. В іншому випадку kubelet не запустить Менеджер памʼяті та покаже помилку.
{{< /note >}}

Нижче наведено приклад правильної конфігурації:

```shell
--kube-reserved=cpu=4,memory=4Gi
--system-reserved=cpu=1,memory=1Gi
--memory-manager-policy=Static
--reserved-memory '0:memory=3Gi;1:memory=2148Mi'
```

Перед версією Kubernetes 1.32 вам також потрібно додавати

```shell
--feature-gates=MemoryManager=true
```

Перевірмо цю конфігурацію:

1. `kube-reserved + system-reserved + eviction-hard(за замовчуванням) = reserved-memory(0) + reserved-memory(1)`
2. `4GiB + 1GiB + 100MiB = 3GiB + 2148MiB`
3. `5120MiB + 100MiB = 3072MiB + 2148MiB`
4. `5220MiB = 5220MiB` (що є правильним)

## Розміщення Podʼа в класі QoS Guaranteed {#placing-a-pod-in-the-guaranteed-qos-class}

Якщо вибрана політика відрізняється від `None`, Менеджер памʼяті ідентифікує Podʼи, які належать до класу обслуговування `Guaranteed`. Менеджер памʼяті надає конкретні підказки топології Менеджеру топології для кожного Podʼа з класом обслуговування `Guaranteed`. Для Podʼів, які належать до класу обслуговування відмінного від `Guaranteed`, Менеджер памʼяті надає Менеджеру топології типові підказки топології.

Наведені нижче уривки з маніфестів Podʼа призначають Pod до класу обслуговування `Guaranteed`.

Pod з цілим значенням CPU працює в класі обслуговування `Guaranteed`, коли `requests` дорівнюють `limits`:

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "2"
        example.com/device: "1"
```

Також Pod, який спільно використовує CPU, працює в класі обслуговування `Guaranteed`, коли `requests` дорівнюють `limits`.

```yaml
spec:
  containers:
  - name: nginx
    image: nginx
    resources:
      limits:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
      requests:
        memory: "200Mi"
        cpu: "300m"
        example.com/device: "1"
```

Зверніть увагу, що для Podʼа потрібно вказати як запити CPU, так і памʼяті, щоб він належав до класу обслуговування `Guaranteed`.

## Розвʼязання проблем {#troubleshooting}

Для виявлення причин, чому Pod не вдалося розгорнути або він був відхилений на вузлі, можуть бути використані наступні засоби:

- статус Podʼа — вказує на помилки топологічної спорідненості
- системні логи — містять цінну інформацію для налагодження, наприклад, про згенеровані підказки
- файл стану — вивід внутрішнього стану Менеджера памʼяті (включає [Node Map та Memory Map][2])
- починаючи з v1.22, можна використовувати [API втулка ресурсів пристроїв](#device-plugin-resource-api), щоб отримати інформацію про памʼять, зарезервовану для контейнерів.

### Статус Podʼа (TopologyAffinityError) {#TopologyAffinityError}

Ця помилка зазвичай виникає у наступних ситуаціях:

- вузол не має достатньо ресурсів, щоб задовольнити запит Podʼа
- запит Podʼа відхилено через обмеження певної політики Менеджера топології

Помилка показується у статусі Podʼа:

```shell
kubectl get pods
```

```none
NAME         READY   STATUS                  RESTARTS   AGE
guaranteed   0/1     TopologyAffinityError   0          113s
```

Використовуйте `kubectl describe pod <id>` або `kubectl get events`, щоб отримати докладне повідомлення про помилку:

```none
Warning  TopologyAffinityError  10m   kubelet, dell8  Resources cannot be allocated with Topology locality
```

### Системні логи {#system-logs}

Шукайте системні логи для певного Podʼа.

У логах можна знайти набір підказок, які згенерував Менеджер памʼяті для Podʼа. Також у логах повинен бути присутній набір підказок, згенерований Менеджером CPU.

Менеджер топології обʼєднує ці підказки для обчислення єдиної найкращої підказки. Найкраща підказка також повинна бути присутня в логах.

Найкраща підказка вказує, куди виділити всі ресурси. Менеджер топології перевіряє цю підказку за своєю поточною політикою і, залежно від вердикту, або допускає Pod до вузла, або відхиляє його.

Також шукайте логи для випадків, повʼязаних з Менеджером памʼяті, наприклад, для отримання інформації про оновлення `cgroups` та `cpuset.mems`.

### Аналіз стану менеджера памʼяті на вузлі {#examine-the-memory-manager-state-on-a-node}

Спочатку розгляньмо розгорнутий зразок `Guaranteed` Podʼа, специфікація якого виглядає так:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: guaranteed
spec:
  containers:
  - name: guaranteed
    image: consumer
    imagePullPolicy: Never
    resources:
      limits:
        cpu: "2"
        memory: 150Gi
      requests:
        cpu: "2"
        memory: 150Gi
    command: ["sleep","infinity"]
```

Потім увійдімо на вузол, де він був розгорнутий, і розглянемо файл стану у `/var/lib/kubelet/memory_manager_state`:

```json
{
   "policyName":"Static",
   "machineState":{
      "0":{
         "numberOfAssignments":1,
         "memoryMap":{
            "hugepages-1Gi":{
               "total":0,
               "systemReserved":0,
               "allocatable":0,
               "reserved":0,
               "free":0
            },
            "memory":{
               "total":134987354112,
               "systemReserved":3221225472,
               "allocatable":131766128640,
               "reserved":131766128640,
               "free":0
            }
         },
         "nodes":[
            0,
            1
         ]
      },
      "1":{
         "numberOfAssignments":1,
         "memoryMap":{
            "hugepages-1Gi":{
               "total":0,
               "systemReserved":0,
               "allocatable":0,
               "reserved":0,
               "free":0
            },
            "memory":{
               "total":135286722560,
               "systemReserved":2252341248,
               "allocatable":133034381312,
               "reserved":29295144960,
               "free":103739236352
            }
         },
         "nodes":[
            0,
            1
         ]
      }
   },
   "entries":{
      "fa9bdd38-6df9-4cf9-aa67-8c4814da37a8":{
         "guaranteed":[
            {
               "numaAffinity":[
                  0,
                  1
               ],
               "type":"memory",
               "size":161061273600
            }
         ]
      }
   },
   "checksum":4142013182
}
```

З цього файлу стану можна дізнатись, що Pod був привʼязаний до обох NUMA вузлів, тобто:

```json
"numaAffinity":[
   0,
   1
],
```

Термін "привʼязаний" означає, що споживання памʼяті Podʼом обмежено (через конфігурацію `cgroups`) цими NUMA вузлами.

Це автоматично означає, що Менеджер памʼяті створив нову групу, яка обʼєднує ці два NUMA вузли, тобто вузли з індексами `0` та `1`.

Зверніть увагу, що управління групами виконується досить складним способом, і подальші пояснення надані в Memory Manager KEP в [цьому][1] та [цьому][3] розділах.

Для аналізу ресурсів памʼяті, доступних у групі, потрібно додати відповідні записи з NUMA вузлів, які належать до групи.

Наприклад, загальна кількість вільної "звичайної" памʼяті в групі може бути обчислена шляхом додавання вільної памʼяті, доступної на кожному NUMA вузлі в групі, тобто в розділі `"memory"` NUMA вузла `0` (`"free":0`) та NUMA вузла `1` (`"free":103739236352`). Таким чином, загальна кількість вільної "звичайної" памʼяті в цій групі дорівнює `0 + 103739236352` байт.

Рядок `"systemReserved":3221225472` вказує на те, що адміністратор цього вузла зарезервував `3221225472` байти (тобто `3Gi`) для обслуговування процесів kubelet та системи на NUMA вузлі `0`, використовуючи прапорець `--reserved-memory`.

### API втулка ресурсів пристроїв {#device-plugin-resource-api}

Kubelet надає службу gRPC `PodResourceLister` для включення виявлення ресурсів та повʼязаних метаданих. Використовуючи його [точку доступу List gRPC](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#grpc-endpoint-list), можна отримати інформацію про зарезервовану памʼять для кожного контейнера, яка міститься у protobuf повідомленні `ContainerMemory`. Цю інформацію можна отримати лише для Podʼів у класі якості обслуговування Guaranteed.

## {{% heading "whatsnext" %}}

- [Memory Manager KEP: Design Overview][4]
- [Memory Manager KEP: Memory Maps at start-up (with examples)][5]
- [Memory Manager KEP: Memory Maps at runtime (with examples)][6]
- [Memory Manager KEP: Simulation - how the Memory Manager works? (by examples)][1]
- [Memory Manager KEP: The Concept of Node Map and Memory Maps][2]
- [Memory Manager KEP: How to enable the guaranteed memory allocation over many NUMA nodes?][3]

[1]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#simulation---how-the-memory-manager-works-by-examples
[2]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#the-concept-of-node-map-and-memory-maps
[3]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#how-to-enable-the-guaranteed-memory-allocation-over-many-numa-nodes
[4]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#design-overview
[5]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#memory-maps-at-start-up-with-examples
[6]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/1769-memory-manager#memory-maps-at-runtime-with-examples
