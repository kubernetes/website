---
title: Контейнери Windows у Kubernetes
content_type: concept
weight: 65
---

<!-- overview -->

Застосунки Windows становлять значну частину сервісів та застосунків, що працюють у багатьох організаціях. [Контейнери Windows](https://aka.ms/windowscontainers) дають змогу інкапсулювати процеси та пакувати залежності, що спрощує використання практик DevOps і дотримання патернів cloud native для застосунків Windows.

Організаціям, що інвестували в застосунки на базі Windows і Linux, не потрібно шукати окремі оркестратори для керування своїми робочими навантаженнями, що підвищує операційну ефективність їхніх розгортань незалежно від операційної системи.

<!-- body -->

## Вузли Windows у Kubernetes {#windows-nodes-in-kubernetes}

Щоб увімкнути оркестрування контейнерів Windows у Kubernetes, додайте вузли Windows до вашого наявного кластера Linux. Планування контейнерів Windows у {{< glossary_tooltip text="Podʼах" term_id="pod" >}} у Kubernetes подібне до планування контейнерів на базі Linux.

Щоб запускати контейнери Windows, ваш кластер Kubernetes має містити кілька операційних систем. Хоча {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} можна запускати лише на Linux, ви можете розгортати робочі вузли, що працюють як на Windows, так і на Linux.

{{< glossary_tooltip text="Вузли" term_id="node" >}} Windows [підтримуються](#windows-os-version-support) за умови, що операційною системою є Windows Server 2022 або Windows Server 2025.

У цьому документі термін *контейнери Windows* означає контейнери Windows з ізоляцією на рівні процесів. Kubernetes не підтримує запуск контейнерів Windows з [ізоляцією Hyper-V](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container).

## Сумісність та обмеження {#limitations}

Деякі можливості вузлів доступні лише за використання певного [середовища виконання контейнерів](#container-runtime); інші недоступні на вузлах Windows, зокрема:

* HugePages: не підтримуються для контейнерів Windows
* Привілейовані контейнери: не підтримуються для контейнерів Windows. [Контейнери HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/) пропонують схожу функціональність.
* TerminationGracePeriod: вимагає containerD

Підтримуються не всі можливості спільних просторів імен. Докладніше дивіться в розділі [Сумісність API](#api).

Докладніше про версії Windows, з якими тестується Kubernetes, дивіться в розділі [Сумісність версій операційної системи Windows](#windows-os-version-support).

З точки зору API та kubectl контейнери Windows поводяться майже так само, як контейнери на базі Linux. Проте існують деякі помітні відмінності в ключовій функціональності, описані в цьому розділі.

### Порівняння з Linux {#compatibility-linux-similarities}

Ключові елементи Kubernetes працюють у Windows так само, як і в Linux. У цьому розділі описано кілька ключових абстракцій робочих навантажень і те, як вони відображаються у Windows.

* [Podʼи](/docs/concepts/workloads/pods/)

  Pod — це базовий будівельний блок Kubernetes: найменша та найпростіша одиниця в обʼєктній моделі Kubernetes, яку ви створюєте або розгортаєте. Не можна розгортати контейнери Windows і Linux в одному Podʼі. Усі контейнери в Podʼі плануються на один вузол, де кожен вузол представляє певну платформу та архітектуру. З контейнерами Windows підтримуються такі можливості, властивості та події Podʼа:

  * Один або кілька контейнерів на Pod з ізоляцією процесів та спільним використанням томів
  * Поля `status` Podʼа
  * Проби готовності, життєздатності та запуску
  * Хуки життєвого циклу контейнера postStart та preStop
  * ConfigMap, Secrets: як змінні середовища або томи
  * Томи `emptyDir`
  * Монтування іменованих каналів хоста
  * Обмеження ресурсів
  * Поле OS:

    Значення поля `.spec.os.name` має бути встановлено у `windows`, щоб вказати, що поточний Pod використовує контейнери Windows.

    Якщо ви встановлюєте поле `.spec.os.name` у `windows`, ви не повинні встановлювати такі поля в `.spec` цього Podʼа:

    * `spec.hostPID`
    * `spec.hostIPC`
    * `spec.securityContext.seLinuxOptions`
    * `spec.securityContext.seccompProfile`
    * `spec.securityContext.fsGroup`
    * `spec.securityContext.fsGroupChangePolicy`
    * `spec.securityContext.sysctls`
    * `spec.shareProcessNamespace`
    * `spec.securityContext.runAsUser`
    * `spec.securityContext.runAsGroup`
    * `spec.securityContext.supplementalGroups`
    * `spec.containers[*].securityContext.seLinuxOptions`
    * `spec.containers[*].securityContext.seccompProfile`
    * `spec.containers[*].securityContext.capabilities`
    * `spec.containers[*].securityContext.readOnlyRootFilesystem`
    * `spec.containers[*].securityContext.privileged`
    * `spec.containers[*].securityContext.allowPrivilegeEscalation`
    * `spec.containers[*].securityContext.procMount`
    * `spec.containers[*].securityContext.runAsUser`
    * `spec.containers[*].securityContext.runAsGroup`

    У наведеному вище списку символи підстановки (`*`) позначають усі елементи списку. Наприклад, `spec.containers[*].securityContext` стосується обʼєкта SecurityContext для всіх контейнерів. Якщо вказано будь-яке з цих полів, API-сервер не прийме цей Pod.

* [Ресурси робочих навантажень](/docs/concepts/workloads/controllers/), зокрема:
  * ReplicaSet
  * Deployment
  * StatefulSet
  * DaemonSet
  * Job
  * CronJob
  * ReplicationController
* {{< glossary_tooltip text="Services" term_id="service" >}}. Докладніше дивіться в розділі [Балансування навантаження та Services](/docs/concepts/services-networking/windows-networking/#load-balancing-and-services).

Podʼи, ресурси робочих навантажень та Services є критично важливими елементами для керування робочими навантаженнями Windows у Kubernetes. Однак самі по собі вони недостатні для належного керування життєвим циклом робочих навантажень Windows у динамічному середовищі cloud native.

* `kubectl exec`
* Метрики Podʼів та контейнерів
* {{< glossary_tooltip text="Горизонтальне автомасштабування Podʼів" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="Квоти ресурсів" term_id="resource-quota" >}}
* Витіснення планувальником

### Параметри командного рядка для kubelet {#kubelet-compatibility}

Деякі параметри командного рядка kubelet поводяться у Windows інакше, як описано нижче:

* Параметр `--windows-priorityclass` дозволяє встановлювати пріоритет планування процесу kubelet (див. [Керування ресурсами CPU](/docs/concepts/configuration/windows-resource-management/#resource-management-cpu))
* Прапорці `--kube-reserved`, `--system-reserved` та `--eviction-hard` оновлюють [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
* Виселення за допомогою `--enforce-node-allocable` не реалізовано
* Під час роботи на вузлі Windows kubelet не має обмежень памʼяті або CPU. `--kube-reserved` та `--system-reserved` лише віднімаються від `NodeAllocatable` і не гарантують ресурсів для робочих навантажень. Докладніше дивіться в розділі [Керування ресурсами для вузлів Windows](/docs/concepts/configuration/windows-resource-management/#resource-reservation).
* Стан `PIDPressure` не реалізовано
* kubelet не вживає дій щодо виселення через OOM

### Сумісність API {#api}

Існують тонкі відмінності в роботі API Kubernetes для Windows, зумовлені ОС та середовищем виконання контейнерів. Деякі властивості робочих навантажень було розроблено для Linux, і вони не працюють у Windows.

На високому рівні відрізняються такі концепції ОС:

* Ідентичність — Linux використовує ідентифікатор користувача (UID) та ідентифікатор групи (GID), які подаються як цілі числа. Імена користувачів і груп не є канонічними — це лише псевдоніми для UID+GID у `/etc/groups` або `/etc/passwd`. Windows використовує довший двійковий [ідентифікатор безпеки](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers) (SID), який зберігається в базі даних Windows Security Access Manager (SAM). Ця база даних не є спільною між хостом і контейнерами або між контейнерами.
* Права доступу до файлів — Windows використовує список керування доступом на основі (SID), тоді як POSIX-системи, такі як Linux, використовують бітову маску на основі дозволів обʼєкта та UID+GID, а також _необовʼязкові_ списки керування доступом.
* Шляхи до файлів — у Windows прийнято використовувати `\` замість `/`. Бібліотеки вводу-виводу Go зазвичай приймають обидва варіанти й просто забезпечують їхню роботу, але коли ви задаєте шлях або командний рядок, що інтерпретується всередині контейнера, може знадобитися `\`.
* Сигнали — інтерактивні застосунки Windows обробляють завершення інакше і можуть реалізовувати один або кілька таких механізмів:
  * UI-потік обробляє чітко визначені повідомлення, зокрема `WM_CLOSE`.
  * Консольні застосунки обробляють Ctrl-C або Ctrl-break за допомогою обробника керування (Control Handler).
  * Служби реєструють функцію обробника керування службою (Service Control Handler), яка може приймати коди керування `SERVICE_CONTROL_STOP`.

Коди виходу контейнера дотримуються тієї самої домовленості: 0 означає успіх, а ненульове значення — помилку. Конкретні коди помилок у Windows та Linux можуть відрізнятися. Однак коди виходу, які передають компоненти Kubernetes (kubelet, kube-proxy), залишаються незмінними.

#### Сумісність полів для специфікацій контейнера {#compatibility-v1-pod-spec-containers}

У цьому списку наведено відмінності в роботі специфікацій контейнерів Podʼа між Windows та Linux:

* Великі сторінки (huge pages) не реалізовані в середовищі виконання контейнерів Windows і недоступні. Вони потребують [наявності привілею користувача](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support), який не налаштовується для контейнерів.
* `requests.cpu` та `requests.memory` — запити віднімаються від доступних ресурсів вузла, тому їх можна використовувати, щоб уникнути надмірного виділення ресурсів вузла. Проте вони не можуть гарантувати ресурси на вузлі з надмірно виділеними ресурсами. Як найкращу практику їх слід застосовувати до всіх контейнерів, якщо оператор хоче повністю уникнути надмірного виділення ресурсів.
* `securityContext.allowPrivilegeEscalation` — неможливо у Windows; жодні можливості (capabilities) не підключені
* `securityContext.capabilities` — можливості POSIX (capabilities) не реалізовані у Windows
* `securityContext.privileged` — Windows не підтримує привілейовані контейнери, замість них використовуйте [Контейнери HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* `securityContext.procMount` — Windows не має файлової системи `/proc`
* `securityContext.readOnlyRootFilesystem` — неможливо у Windows; для роботи реєстру та системних процесів усередині контейнера потрібен доступ на запис
* `securityContext.runAsGroup` — неможливо у Windows, оскільки немає підтримки GID
* `securityContext.runAsNonRoot` — це налаштування перешкоджатиме запуску контейнерів як `ContainerAdministrator`, який є найближчим еквівалентом користувача root у Windows.
* `securityContext.runAsUser` — використовуйте [`runAsUserName`](/docs/tasks/configure-pod-container/configure-runasusername) замість цього
* `securityContext.seLinuxOptions` — неможливо у Windows, оскільки SELinux специфічний для Linux
* `terminationMessagePath` — тут є певні обмеження, оскільки Windows не підтримує зіставлення окремих файлів. Стандартне значення — `/dev/termination-log`, і воно працює, бо цей шлях стандартно не існує у Windows.

#### Сумісність полів для специфікацій Podʼа {#compatibility-v1-pod}

У цьому списку наведено відмінності в роботі специфікацій Podʼа між Windows та Linux:

* `hostIPC` та `hostpid` — спільне використання простору імен хоста неможливе у Windows
* `hostNetwork` — використання мережі хоста неможливе у Windows
* `dnsPolicy` — встановлення `dnsPolicy` Podʼа на `ClusterFirstWithHostNet` не підтримується у Windows, оскільки мережа хоста не надається. Podʼи завжди працюють з мережею контейнера.
* `podSecurityContext` [див. нижче](#compatibility-v1-pod-spec-containers-securitycontext)
* `shareProcessNamespace` — це бета-можливість, яка залежить від просторів імен Linux, не реалізованих у Windows. Windows не може спільно використовувати простори імен процесів або кореневу файлову систему контейнера. Спільною може бути лише мережа.
* `terminationGracePeriodSeconds` — це не повністю реалізовано в Docker у Windows, див. [issue на GitHub](https://github.com/moby/moby/issues/25982). Наразі процес ENTRYPOINT отримує CTRL_SHUTDOWN_EVENT, потім Windows стандартно чекає 5 секунд і нарешті завершує всі процеси звичайним для Windows способом вимкнення. Стандартні 5 секунд насправді задані в реєстрі Windows [усередині контейнера](https://github.com/moby/moby/issues/25982#issuecomment-426441183), тому їх можна перевизначити під час збирання контейнера.
* `volumeDevices` — це бета-можливість, яка не реалізована у Windows. Windows не може підключати сирі блочні пристрої до Podʼів.
* `volumes`
  * Якщо ви визначаєте том `emptyDir`, ви не можете встановити для нього джерело `memory`.
* Ви не можете увімкнути `mountPropagation` для монтування томів, оскільки це не підтримується у Windows.

#### Доступ до мережі хоста {#compatibility-v1-pod-sec-containers-hostnetwork}

Kubernetes від v1.26 до v1.32 містив альфа-підтримку запуску Podʼів Windows у мережевому просторі імен хоста.

Kubernetes v{{< skew currentVersion >}} **не** містить функціональної можливості `WindowsHostNetwork` і не підтримує запуск Podʼів Windows у мережевому просторі імен хоста.

#### Сумісність полів для контексту безпеки Podʼа {#compatibility-v1-pod-spec-containers-securitycontext}

Лише поля `securityContext.runAsNonRoot` та `securityContext.windowsOptions` із полів [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) Podʼа працюють у Windows.

## Виявлення проблем вузла {#node-problem-detector}

Механізм виявлення проблем вузла (див. [Моніторинг справності вузла](/docs/tasks/debug/debug-cluster/monitor-node-health/)) має попередню підтримку для Windows. Для отримання додаткової інформації відвідайте [сторінку проєкту на GitHub](https://github.com/kubernetes/node-problem-detector#windows).

## Контейнер pause {#pause-container}

У Podʼі Kubernetes спочатку створюється інфраструктурний контейнер, або контейнер «pause», щоб розмістити контейнер. У Linux для cgroups та просторів імен, що утворюють Pod, потрібен процес, який підтримує їхнє подальше існування; цей процес забезпечує pause. Контейнери, які належать до одного Podʼа, зокрема інфраструктурні та робочі контейнери, мають спільну мережеву кінцеву точку (та сама адреса IPv4 та/або IPv6, ті самі простори мережевих портів). Kubernetes використовує контейнери pause, щоб робочі контейнери могли аварійно завершуватися або перезапускатися без втрати мережевої конфігурації.

Kubernetes супроводжує багатоархітектурний образ із підтримкою Windows. Для Kubernetes v{{< skew currentPatchVersion >}} рекомендований образ pause — `registry.k8s.io/pause:3.6`. [Вихідний код](https://github.com/kubernetes/kubernetes/tree/master/build/pause) доступний на GitHub.

Microsoft супроводжує інший багатоархітектурний образ із підтримкою Linux та Windows amd64, який можна знайти як `mcr.microsoft.com/oss/kubernetes/pause:3.6`. Цей образ зібрано з того самого вихідного коду, що й образ, який супроводжує Kubernetes, але всі бінарні файли Windows [підписані authenticode](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode) компанією Microsoft. Проєкт Kubernetes рекомендує використовувати образ, який супроводжує Microsoft, якщо ви розгортаєте у промисловому або подібному до промислового середовищі, що потребує підписаних бінарних файлів.

## Середовища виконання контейнерів {#container-runtime}

Вам потрібно встановити {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}} на кожний вузол у кластері, щоб Podʼи могли там працювати.

Із Windows працюють такі середовища виконання контейнерів:

{{% thirdparty-content %}}

### ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Ви можете використовувати {{< glossary_tooltip term_id="containerd" text="ContainerD" >}} версії 1.4.0+ як середовище виконання контейнерів для вузлів Kubernetes, які працюють на Windows.

Дізнайтеся, як [встановити ContainerD на вузол Windows](/docs/setup/production-environment/container-runtimes/#containerd).
{{< note >}}
Є [відоме обмеження](/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations) під час використання GMSA з containerd для доступу до мережевих ресурсів Windows, яке потребує виправлення ядра.
{{< /note >}}

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) доступне як середовище виконання контейнерів для всіх версій Windows Server 2019 та новіших.

Для отримання додаткової інформації дивіться [Встановлення MCR на серверах Windows](https://docs.mirantis.com/mcr/25.0/install/mcr-windows.html).

## Сумісність версій операційної системи Windows {#windows-os-version-support}

На вузлах Windows діють суворі правила сумісності: версія операційної системи хоста повинна збігатися з версією операційної системи базового образу контейнера.

Для Kubernetes v{{< skew currentVersion >}} сумісність операційних систем для вузлів Windows (та Podʼів) така:

Випуск LTSC Windows Server
: Windows Server 2022
: Windows Server 2025

Також застосовується [політика версійної розбіжності](/docs/setup/release/version-skew-policy/) Kubernetes.

## Рекомендації та важливі аспекти апаратного забезпечення {#windows-hardware-recommendations}

{{% thirdparty-content %}}

{{< note >}}
Наведені тут апаратні характеристики слід розглядати як розумні стандартні значення. Вони не є мінімальними вимогами чи конкретними рекомендаціями для промислових середовищ. Залежно від вимог вашого робочого навантаження ці значення може знадобитися скоригувати.
{{< /note >}}

- 64-бітний процесор із 4 ядрами CPU або більше, здатний підтримувати віртуалізацію
- 8 GB або більше оперативної памʼяті
- 50 GB або більше вільного місця на диску

Найновішу інформацію про мінімальні апаратні вимоги дивіться на сторінці [Вимоги до апаратного забезпечення для Windows Server у документації Microsoft](https://learn.microsoft.com/en-us/windows-server/get-started/hardware-requirements). Рекомендації щодо вибору ресурсів для промислових робочих вузлів дивіться в розділі [Промислові робочі вузли в документації Kubernetes](/docs/setup/production-environment/#production-worker-nodes).

Для оптимізації ресурсів системи, якщо графічний інтерфейс не потрібен, може бути краще використовувати інсталяцію Windows Server без варіанта встановлення [Windows Desktop Experience](https://learn.microsoft.com/en-us/windows-server/get-started/install-options-server-core-desktop-experience), оскільки така конфігурація зазвичай звільняє більше ресурсів системи.

Оцінюючи дисковий простір для робочих вузлів Windows, врахуйте, що образи контейнерів Windows зазвичай більші за образи контейнерів Linux: розмір одного образу становить від [300 MB до понад 10 GB](https://techcommunity.microsoft.com/t5/containers/nano-server-x-server-core-x-server-which-base-image-is-the-right/ba-p/2835785). Крім того, зверніть увагу, що диск `C:` у контейнерах Windows стандартно має віртуальний вільний розмір 20 GB: це не фактично зайнятий простір, а розмір диска, до якого може вирости один контейнер під час використання локального сховища на хості. Докладніше дивіться на сторінці [Контейнери у Windows — документація про сховище контейнерів](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/container-storage#storage-limits).

## Отримання допомоги та усунення несправностей {#troubleshooting}

Основним джерелом допомоги з усунення несправностей у вашому кластері Kubernetes має бути сторінка [Усунення несправностей](/docs/tasks/debug/).

Додаткову допомогу з усунення несправностей, специфічну для Windows, наведено в цьому розділі. Логи є важливою складовою усунення несправностей у Kubernetes. Обовʼязково додавайте їх щоразу, коли звертаєтеся по допомогу до інших учасників. Дотримуйтесь інструкцій у [настановах щодо збору логів](https://github.com/kubernetes/community/blob/main/sig-windows/CONTRIBUTING.md#gathering-logs) від SIG Windows.

### Повідомлення про проблеми та запити на нові можливості {#reporting-issues-and-feature-requests}

Якщо у вас є щось схоже на помилку або ви хочете подати запит на нову можливість, дотримуйтесь [настанов для учасників SIG Windows](https://github.com/kubernetes/community/blob/main/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests), щоб створити новий issue. Спочатку перегляньте список issues на випадок, якщо про проблему вже повідомляли, і додайте коментар про свій досвід та додаткові логи. Канал SIG Windows у Slack Kubernetes також є чудовим способом отримати початкову підтримку та ідеї щодо усунення несправностей перед створенням issue.

### Перевірка правильності роботи кластера Windows {#validating-the-windows-cluster-operability}

Проєкт Kubernetes надає специфікацію _Windows Operational Readiness_ разом зі структурованим набором тестів. Цей набір поділено на дві групи тестів, базову та розширену, кожна з яких містить категорії, спрямовані на тестування конкретних областей. Його можна використовувати для перевірки всієї функціональності системи Windows та гібридної системи (разом із вузлами Linux) з повним покриттям.

Щоб налаштувати проєкт на щойно створеному кластері, дивіться інструкції в [посібнику проєкту](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md).

## Інструменти розгортання {#deployment-tools}

Інструмент kubeadm допомагає розгортати кластер Kubernetes, надаючи панель управління для керування кластером та вузли для запуску ваших робочих навантажень.

Проєкт Kubernetes [cluster API](https://cluster-api.sigs.k8s.io/) також надає засоби для автоматизації розгортання вузлів Windows.

## Канали поширення Windows {#windows-distribution-channels}

Для докладного пояснення каналів поширення Windows дивіться [документацію Microsoft](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).

Інформацію про різні канали обслуговування Windows Server, зокрема їхні моделі підтримки, можна знайти на сторінці [Канали обслуговування Windows Server](https://docs.microsoft.com/en-us/windows-server/get-started/servicing-channels-comparison).
