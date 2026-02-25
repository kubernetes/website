---
title: Контейнери Windows у Kubernetes
content_type: concept
weight: 65
---

<!-- overview -->

Застосунки Windows становлять значну частину сервісів та застосунків, що працюють у багатьох організаціях. [Контейнери Windows](https://aka.ms/windowscontainers) забезпечують спосіб інкапсуляції процесів та пакування залежностей, що спрощує використання практик DevOps та слідування хмарним рідним патернам для застосунків Windows.

Організації, що вклались у застосунки на базі Windows та Linux, не мають шукати окремі оркестратори для управління своїми навантаженнями, що призводить до збільшення оперативної ефективності у їх розгортаннях, незалежно від операційної системи.

<!-- body -->

## Windows-вузли у Kubernetes {#windows-nodes-in-kubernetes}

Для увімкнення оркестрування контейнерів Windows у Kubernetes, додайте Windows-вузли до вашого поточного Linux-кластера. Планування розміщення контейнерів Windows у {{< glossary_tooltip text="Podʼах" term_id="pod" >}} на Kubernetes подібне до планування розміщення контейнерів на базі Linux.

Для запуску контейнерів Windows ваш Kubernetes кластер має включати декілька операційних систем.
Хоча {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} можна запускати лише на Linux, ви можете розгортати робочі вузли, що працюють як на Windows, так і на Linux.

Windows {{< glossary_tooltip text="вузли" term_id="node" >}} є [підтримуваними](#windows-os-version-support), за умови, що операційна система є Windows Server 2022 або Windows Server 2025.

Цей документ використовує термін *контейнери Windows* для позначення контейнерів Windows з
ізоляцією на рівні процесу. Kubernetes не підтримує запуск контейнерів Windows з
[ізоляцією Hyper-V](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container).

## Сумісність та обмеження {#limitations}

Деякі функції вузла доступні лише при використанні певного [середовища для виконання контейнерів](#container-runtime); інші не доступні на Windows-вузлах, зокрема:

* HugePages: не підтримуються для контейнерів Windows
* Привілейовані контейнери: не підтримуються для контейнерів Windows. [Контейнери HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/) пропонують схожий функціонал.
* TerminationGracePeriod: вимагає containerD

Не всі функції спільних просторів імен підтримуються. Дивіться [Сумісність API](#api) для детальнішої інформації.

Дивіться [Сумісність версій Windows OS](#windows-os-version-support) для деталей щодо версій Windows, з якими Kubernetes протестовано.

З точки зору API та kubectl, контейнери Windows поводяться майже так само, як і контейнери на базі Linux. Проте, існують деякі помітні відмінності у ключовому функціоналі, які окреслені в цьому розділі.

### Порівняння з Linux {#compatibility-linux-similarities}

Ключові елементи Kubernetes працюють однаково в Windows, як і в Linux. Цей розділ описує кілька ключових абстракцій робочих навантажень та їх співвідносяться у Windows.

* [Podsʼи](/docs/concepts/workloads/pods/)

  Pod є базовим будівельним блоком Kubernetes — найменшою та найпростішою одиницею в моделі об’єктів Kubernetes, яку ви створюєте або розгортаєте. Ви не можете розгортати Windows та
  Linux контейнери в одному Podʼі. Всі контейнери в Podʼі плануються на один вузол, де кожен вузол представляє певну платформу та архітектуру. Наступні можливості, властивості та події Podʼа підтримуються з контейнерами Windows:

  * Один або кілька контейнерів на Pod з ізоляцією процесів та спільним використанням томів
  * Поля `status` Podʼа
  * Проби готовності, життєздатності та запуску
  * Хуки життєвого циклу контейнера postStart & preStop
  * ConfigMap, Secrets: як змінні оточення або томи
  * Томи `emptyDir`
  * Монтування іменованих каналів хоста
  * Ліміти ресурсів
  * Поле OS:

    Значення поля `.spec.os.name` має бути встановлено у `windows`, щоб вказати, що поточний Pod використовує контейнери Windows.

    Якщо ви встановлюєте поле `.spec.os.name` у `windows`, вам не слід встановлювати наступні поля в `.spec` цього Podʼа:

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

    У вищезазначеному списку, символи зірочки (`*`) вказують на всі елементи у списку. Наприклад, `spec.containers[*].securityContext` стосується обʼєкта SecurityContext для всіх контейнерів. Якщо будь-яке з цих полів вказано, Pod не буде прийнято API сервером.

* [Ресурси робочих навантажень]](/docs/concepts/workloads/controllers/):
  * ReplicaSet
  * Deployment
  * StatefulSet
  * DaemonSet
  * Job
  * CronJob
  * ReplicationController
* {{< glossary_tooltip text="Service" term_id="service" >}}. Дивіться [Балансування навантаження та Service](/docs/concepts/services-networking/windows-networking/#load-balancing-and-service) для деталей.

Podʼи, ресурси робочого навантаження та Service є критичними елементами для управління Windows навантаженнями у Kubernetes. Однак, самі по собі вони недостатні для забезпечення належного управління життєвим циклом Windows навантажень у динамічному хмарному середовищі.

* `kubectl exec`
* Метрики Podʼів та контейнерів
* {{< glossary_tooltip text="Горизонтальне автомасштабування Podʼів" term_id="horizontal-pod-autoscaler" >}}
* {{< glossary_tooltip text="Квоти ресурсів" term_id="resource-quota" >}}
* Випередження планувальника

### Параметри командного рядка для kubelet {#kubelet-compatibility}

Деякі параметри командного рядка для kubelet ведуть себе по-іншому у Windows, як описано нижче:

* Параметр `--windows-priorityclass` дозволяє встановлювати пріоритет планування процесу kubelet (див. [Управління ресурсами процесора](/docs/concepts/configuration/windows-resource-management/#resource-management-cpu))
* Прапорці `--kube-reserved`, `--system-reserved` та `--eviction-hard` оновлюють [NodeAllocatable](/docs/tasks/administer-cluster/reserve-compute-resources/#node-allocatable)
* Виселення за допомогою `--enforce-node-allocable` не реалізовано
* При запуску на вузлі Windows kubelet не має обмежень памʼяті або процесора. `--kube-reserved` та `--system-reserved` віднімаються лише від `NodeAllocatable` і не гарантують ресурсів для навантаження. Дивіться [Управління ресурсами для вузлів Windows](/docs/concepts/configuration/windows-resource-management/#resource-reservation) для отримання додаткової інформації.
* Умова `PIDPressure` не реалізована
* Kubelet не вживає дій щодо виселення з приводу OOM (Out of memory)

### Сумісність API {#api}

Існують важливі відмінності в роботі API Kubernetes для Windows через ОС та середовище виконання контейнерів. Деякі властивості навантаження були розроблені для Linux, і їх не вдається виконати у Windows.

На високому рівні концепції ОС відрізняються:

* Ідентифікація — Linux використовує ідентифікатор користувача (UID) та ідентифікатор групи (GID), які представлені як цілі числа. Імена користувачів і груп не є канонічними — це просто псевдоніми у `/etc/groups` або `/etc/passwd` до UID+GID. Windows використовує більший бінарний [ідентифікатор безпеки](https://docs.microsoft.com/en-us/windows/security/identity-protection/access-control/security-identifiers) (SID), який зберігається в базі даних Windows Security Access Manager (SAM). Ця база даних не використовується спільно між хостом та контейнерами або між контейнерами.
* Права доступу до файлів — Windows використовує список управління доступом на основі (SID), тоді як POSIX-системи, такі як Linux, використовують бітову маску на основі дозволів обʼєкта та UID+GID, плюс _опціональні_ списки управління доступом.
* Шляхи до файлів — у Windows зазвичай використовується `\` замість `/`. Бібліотеки вводу-виводу Go зазвичай приймають обидва і просто забезпечують їх роботу, але коли ви встановлюєте шлях або командний рядок, що інтерпретується всередині контейнера, можливо, буде потрібен символ `\`.
* Сигнали — інтерактивні програми Windows обробляють завершення по-іншому і можуть реалізувати одне або декілька з цього:
  * UI-потік обробляє чітко визначені повідомлення, включаючи `WM_CLOSE`.
  * Консольні програми обробляють Ctrl-C або Ctrl-break за допомогою обробника керування.
  * Служби реєструють функцію обробника керування службами, яка може приймати коди керування `SERVICE_CONTROL_STOP`.

Коди виходу контейнера дотримуються тієї ж самої конвенції, де 0 є успіхом, а ненульове значення є помилкою. Конкретні коди помилок можуть відрізнятися між Windows та Linux. Однак коди виходу, передані компонентами Kubernetes (kubelet, kube-proxy), залишаються незмінними.

#### Сумісність полів для специфікацій контейнера {#compatibility-v1-pod-spec-containers}

Наступний список документує відмінності у роботі специфікацій контейнерів Podʼа між Windows та Linux:

* Великі сторінки не реалізовані в контейнері Windows та недоступні. Вони потребують [встановлення привілеїв користувача](https://docs.microsoft.com/en-us/windows/desktop/Memory/large-page-support), які не налаштовуються для контейнерів.
* `requests.cpu` та `requests.memory` — запити віднімаються від доступних ресурсів вузла, тому вони можуть використовуватися для уникнення перевстановлення вузла. Проте вони не можуть гарантувати ресурси в перевстановленому вузлі. Їх слід застосовувати до всіх контейнерів як найкращу практику, якщо оператор хоче уникнути перевстановлення повністю.
* `securityContext.allowPrivilegeEscalation` — неможливо на Windows; жодна з можливостей не підключена
* `securityContext.capabilities` — можливості POSIX не реалізовані у Windows
* `securityContext.privileged` — Windows не підтримує привілейовані контейнери, замість них використовуйте [Контейнери HostProcess](/docs/tasks/configure-pod-container/create-hostprocess-pod/)
* `securityContext.procMount` — Windows не має файлової системи `/proc`
* `securityContext.readOnlyRootFilesystem` — неможливо на Windows; запис доступу необхідний для реєстру та системних процесів, щоб виконуватися всередині контейнера
* `securityContext.runAsGroup` — неможливо на Windows, оскільки відсутня підтримка GID
* `securityContext.runAsNonRoot` — це налаштування перешкоджатиме запуску контейнерів як `ContainerAdministrator`, який є найближчим еквівалентом користувача root у Windows.
* `securityContext.runAsUser` — використовуйте [`runAsUserName`](/docs/tasks/configure-pod-container/configure-runasusername) замість цього
* `securityContext.seLinuxOptions` — неможливо у Windows, оскільки SELinux специфічний для Linux
* `terminationMessagePath` — у цьому є деякі обмеження, оскільки Windows не підтримує зіставлення одного файлу. Стандартне значення — `/dev/termination-log`, що працює, оскільки воно стандартно не існує у Windows.

#### Сумісність полів для специфікацій Podʼа {#compatibility-v1-pod}

Наступний список документує відмінності у роботі специфікацій Podʼа між Windows та Linux:

* `hostIPC` та `hostpid` — спільне використання простору імен хосту неможливе у Windows
* `hostNetwork` — підключення до мережі хосту неможливе у Windows
* `dnsPolicy` — встановлення `dnsPolicy` Podʼа на `ClusterFirstWithHostNet` не підтримується у Windows, оскільки мережа хосту не надається. Podʼи завжди працюють з мережею контейнера.
* `podSecurityContext` [див. нижче](#compatibility-v1-pod-spec-containers-securitycontext)
* `shareProcessNamespace` — це бета-функція, яка залежить від просторів імен Linux, які не реалізовані у Windows. Windows не може ділитися просторами імен процесів або кореневою файловою системою контейнера. Можлива лише спільна мережа.
* `terminationGracePeriodSeconds` — це не повністю реалізовано в Docker у Windows, див. [тікет GitHub](https://github.com/moby/moby/issues/25982). Поведінка на сьогодні полягає в тому, що процес ENTRYPOINT отримує сигнал CTRL_SHUTDOWN_EVENT, потім Windows типово чекає 5 секунд, і нарешті вимикає всі процеси за допомогою звичайної поведінки вимкнення Windows. Значення 5 секунд визначаються в реєстрі Windows [всередині контейнера](https://github.com/moby/moby/issues/25982#issuecomment-426441183), тому їх можна перевизначити при збиранні контейнера.
* `volumeDevices` — це бета-функція, яка не реалізована у Windows. Windows не може підключати блочні пристрої безпосередньо до Podʼів.
* `volumes`
  * Якщо ви визначаєте том `emptyDir`, ви не можете встановити його джерело тома на `memory`.
* Ви не можете активувати `mountPropagation` для монтування томів, оскільки це не підтримується у Windows.

#### Доступ до мережі хосту {#compatibility-v1-pod-sec-containers-hostnetwork}

У версіях Kubernetes від 1.26 до 1.32 було включено альфа-підтримку запуску Windows Pods у просторі імен мережі хосту.

Kubernetes v{{< skew currentVersion >}} **не** містить `WindowsHostNetwork` або підтримку запуску Windows Pods у мережі з простору імен хосту.

#### Сумісність полів для контексту безпеки Podʼа {#compatibility-v1-pod-spec-containers-securitycontext}

Тільки поля `securityContext.runAsNonRoot` та `securityContext.windowsOptions` з поля Podʼа [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) працюють у Windows.

## Виявлення проблем вузла {#node-problem-detector}

Механізм виявлення проблем вузла (див. [Моніторинг справності вузла](/docs/tasks/debug/debug-cluster/monitor-node-health/)) має попередню підтримку для Windows. Для отримання додаткової інформації відвідайте [сторінку проєкту на GitHub](https://github.com/kubernetes/node-problem-detector#windows).

## Контейнер паузи {#pause-container}

У кластері Kubernetes спочатку створюється інфраструктурний або контейнер "пауза", щоб вмістити інший контейнер. У Linux, групи керування та простори імен, що утворюють з Pod, потребують процесу для підтримки їхнього подальшого існування; процес паузи забезпечує це. Контейнери, які належать до одного Podʼа, включаючи інфраструктурні та робочі контейнери, мають спільну мережеву точку доступу (з тою ж самою IPv4 та / або IPv6 адресою, тими самими просторами портів мережі). Kubernetes використовує контейнери паузи для того, щоб дозволити робочим контейнерам виходити з ладу або перезапускатися без втрати будь-якої конфігурації мережі.

Kubernetes підтримує багатоархітектурний образ, який включає підтримку для Windows. Для Kubernetes v{{< skew currentPatchVersion >}} рекомендований образ паузи — `registry.k8s.io/pause:3.6`. [Вихідний код](https://github.com/kubernetes/kubernetes/tree/master/build/pause) доступний на GitHub.

Microsoft підтримує інший багатоархітектурний образ, з підтримкою Linux та Windows amd64, це `mcr.microsoft.com/oss/kubernetes/pause:3.6`. Цей образ побудований з того ж вихідного коду, що й образ, підтримуваний Kubernetes, але всі виконавчі файли Windows підписані [authenticode](https://docs.microsoft.com/en-us/windows-hardware/drivers/install/authenticode) Microsoft. Проєкт Kubernetes рекомендує використовувати образ, підтримуваний Microsoft, якщо ви розгортаєте в операційному середовищі або середовищі подібному до операційного, яке вимагає підписаних виконавчих файлів.

## Середовища виконання контейнерів {#container-runtime}

Вам потрібно встановити {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}} на кожний вузол у кластері, щоб Podʼи могли там працювати.

Наступні середовища виконання контейнерів ппрацюютьу Windows:

{{% thirdparty-content %}}

### ContainerD

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

Ви можете використовувати {{< glossary_tooltip term_id="containerd" text="ContainerD" >}} версії 1.4.0+ як середовище виконання контейнера для вузлів Kubernetes, які працюють на Windows.

Дізнайтеся, як [встановити ContainerD на вузол Windows](/docs/setup/production-environment/container-runtimes/#containerd).
{{< note >}}
Є [відоме обмеження](/docs/tasks/configure-pod-container/configure-gmsa/#gmsa-limitations) при використанні GMSA з containerd для доступу до мережевих ресурсів Windows, яке потребує
патча ядра.
{{< /note >}}

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) є доступним середовищем виконання контейнерів для всіх версій Windows Server 2019 та пізніших.

Для отримання додаткової інформації дивіться [Встановлення MCR на серверах Windows](https://docs.mirantis.com/mcr/25.0/install/mcr-windows.html).

## Сумісність версій операційної системи Windows {#windows-os-version-support}

На вузлах Windows діють строгі правила сумісності, де версія операційної системи хосту повинна відповідати версії операційної системи базового образу контейнера. Повністю підтримуються лише Windows контейнери з операційною системою контейнера Windows Server 2019.

Для Kubernetes v{{< skew currentVersion >}}, сумісність операційної системи для вузлів Windows (та Podʼів) виглядає так:

Випуск LTSC Windows Server
: Windows Server 2022
: Windows Server 2025

Також застосовується політика [відхилення версій](/docs/setup/release/version-skew-policy/) Kubernetes.

## Рекомендації та важливі аспекти апаратного забезпечення {#windows-hardware-recommendations}

{{% thirdparty-content %}}

{{< note >}}
Наведені тут апаратні характеристики слід розглядати як розумні стандартні значення. Вони не призначені представляти мінімальні вимоги або конкретні рекомендації для операційних середовищ. Залежно від вимог вашого навантаження ці значення можуть потребувати коригування.
{{< /note >}}

* 64-бітний процесор з 4 ядрами CPU або більше, здатний підтримувати віртуалізацію
* 8 ГБ або більше оперативної памʼяті
* 50 ГБ або більше вільного місця на диску

Для отримання найновішої інформації про мінімальні апаратні вимоги дивіться [Вимоги апаратного забезпечення для Windows Server у документації Microsoft](https://learn.microsoft.com/en-us/windows-server/get-started/hardware-requirements). Для керівництва у виборі ресурсів для операційних робочих вузлів дивіться [Робочі вузли для операційного середовища в документації Kubernetes](/docs/setup/production-environment/#production-worker-nodes).

Для оптимізації ресурсів системи, якщо не потрібний графічний інтерфейс, бажано використовувати операційну систему Windows Server, яка не включає опцію встановлення
[Windows Desktop Experience](https://learn.microsoft.com/en-us/windows-server/get-started/install-options-server-core-desktop-experience), оскільки така конфігурація зазвичай звільняє більше ресурсів системи.

При оцінці дискового простору для робочих вузлів Windows слід враховувати, що образи контейнера Windows зазвичай більші за образи контейнера Linux, розмір образів контейнерів може становити
від [300 МБ до понад 10 ГБ](https://techcommunity.microsoft.com/t5/containers/nano-server-x-server-core-x-server-which-base-image-is-the-right/ba-p/2835785) для одного образу. Додатково, слід зауважити, що типово диск `C:` в контейнерах Windows являє собою віртуальний вільний розмір 20 ГБ, це не фактично використаний простір, а лише розмір диска, який може займати один контейнер при використанні локального сховища на хості. Дивіться [Контейнери на Windows — Документація зберігання контейнерів](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/container-storage#storage-limits) для отримання більш детальної інформації.

## Отримання допомоги та усунення несправностей {#troubleshooting}

Для усунення несправностей звертайтесь до відповідного [розділу](/docs/tasks/debug/) цієї документації, він стане вашим головним джерелом в отриманні потрібних відомостей.

Додаткова допомога з усунення несправностей, специфічна для Windows, є в цьому розділі. Логи є важливою складовою усунення несправностей у Kubernetes. Переконайтеся, що ви додаєте їх кожного разу, коли звертаєтеся за допомогою у розвʼязані проблем до інших учасників. Дотримуйтесь інструкцій у [керівництві щодо збору логів](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#gathering-logs) від SIG Windows.

### Повідомлення про проблеми та запити нових функцій {#reporting-issues-and-feature-requests}

Якщо у вас є підозра на помилку або ви хочете подати запит на нову функцію, будь ласка, дотримуйтесь [настанов з участі від SIG Windows](https://github.com/kubernetes/community/blob/master/sig-windows/CONTRIBUTING.md#reporting-issues-and-feature-requests), щоб створити новий тікет. Спочатку вам слід переглянути список проблем у разі, якщо вона вже була повідомлена раніше, і додавати коментар зі своїм досвідом щодо проблеми та додавати додаткові логи. Канал SIG Windows у Slack Kubernetes також є чудовим способом отримати підтримку та ідеї для усунення несправностей перед створенням тікету.

### Перевірка правильності роботи кластера Windows {#validating-the-windows-cluster-operability}

Проєкт Kubernetes надає специфікацію _Готовності до роботи у середовищі Windows_ разом з структурованим набором тестів. Цей набір тестів розділений на два набори тестів: базовий та розширений, кожен з яких містить категорії, спрямовані на тестування конкретних областей. Його можна використовувати для перевірки всіх функцій системи Windows та гібридної системи (змішана з Linux вузлами) з повним охопленням.

Щоб налаштувати проєкт на новому створеному кластері, дивіться інструкції у [посібнику проєкту](https://github.com/kubernetes-sigs/windows-operational-readiness/blob/main/README.md).

## Інструменти розгортання {#deployment-tools}

Інструмент kubeadm допомагає вам розгортати кластер Kubernetes, надаючи панель управління для управління кластером та вузли для запуску ваших робочих навантажень.

Проєкт [кластерного API Kubernetes](https://cluster-api.sigs.k8s.io/) також надає засоби для автоматизації розгортання вузлів Windows.

## Канали поширення Windows {#windows-distribution-channels}

Для докладного пояснення каналів поширення Windows дивіться [документацію Microsoft](https://docs.microsoft.com/en-us/windows-server/get-started-19/servicing-channels-19).

Інформацію про різні канали обслуговування Windows Server, включаючи їх моделі підтримки, можна знайти на сторінці [каналів обслуговування Windows Server](https://docs.microsoft.com/en-us/windows-server/get-started/servicing-channels-comparison).
