---
layout: blog
title: Короткий огляд Kubernetes v1.38
draft: true
slug: kubernetes-v1-38-sneak-peek
author: >
  Aaron Braundmeier,
  Arsh Sharma,
  Kirti Goyal,
  Omar Nasser,
  Sayan Chowdhury,
  Urvashi Choubey
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

У міру наближення дати випуску Kubernetes v1.38 проєкт розвивається та вдосконалюється, а окремі функції можуть бути визнані застарілими, видалені або замінені кращими з метою забезпечення загального стабільного функціонування проєкту. У цій статті описано заплановані зміни Kubernetes v1.38, про які, на думку команди випуску, варто знати, щоб і надалі підтримувати середовище Kubernetes та не відставати від оновлень. Наведені нижче відомості відображають поточний стан випуску v1.38 і можуть змінитися до фактичної дати випуску.

## Застарілі функції та вилучення в Kubernetes v1.38 {#deprecations-and-removals-for-kubernetes-v1-38}

### kubectl: вилучення змінних середовища для вимкнення WebSocket {#kubectl-websocket-opt-out-environment-variables-removed}

Починаючи з v1.30, `kubectl` типово використовує WebSocket замість SPDY для команд `kubectl exec`, `attach` і `cp`, а з v1.31 — також для `kubectl port-forward`. Змінні середовища `KUBECTL_REMOTE_COMMAND_WEBSOCKETS` і `KUBECTL_PORT_FORWARD_WEBSOCKETS` давали змогу вимкнути таку поведінку. У v1.38 ці змінні буде вилучено. Після цього `kubectl` завжди спочатку намагатиметься використовувати WebSocket і за потреби переходитиме на SPDY — так само, як це працює зараз типово. Якщо у ваших сценаріях або середовищах CI задано будь-яку з цих змінних, її можна прибрати: вона більше не впливатиме на роботу.

Докладніше дивіться в [KEP-4006: Transition from SPDY to WebSockets](https://kubernetes.dev/resources/keps/4006).

### kubectl: вилучення поля `name` з дозволених записів втулків облікових даних у kuberc {#kubectl-name-dropped-from-kuberc-credential-plugin-allowlist-entries}

Файл `kuberc` зберігає налаштування користувача `kubectl` окремо від облікових даних кластера у kubeconfig. Зокрема, у ньому можна задати список втулків облікових даних, які дозволено запускати `kubectl`. У бета-версії API `kubectl.config.k8s.io/v1beta1` у записі списку дозволів можна вказати `name` як псевдонім для `command`. Поле `name` (але не `command`) застаріло з v1.36.

Оскільки в v1.38 очікується перехід `kuberc` до стабільної версії, нового API `kubectl.config.k8s.io/v1` поле `name` не матиме. Якщо у вас є записи списку дозволів із полем `name`, замініть його на `command` вже зараз.

Докладніше дивіться в [KEP-3104:Separate kubectl user preferences from cluster configs](https://kubernetes.dev/resources/keps/3104).

## Поточні масштабні зміни {#ongoing-major-changes}

### Майбутнє вилучення підтримки cgroup v1 {#cgroup-v1-support}

Підтримка cgroup v1 поступово припиняється. Починаючи з v1.35, `kubelet` не запускається на вузлах із cgroup v1, якщо в конфігурації kubelet не встановлено `failCgroupV1: false`. Цей параметр залишиться доступним у v1.38, але його варто вважати лише короткостроковим рішенням: підтримку cgroup v1 планується вилучити в одному з майбутніх випусків. Якщо ви ще цього не зробили, сплануйте перехід на [cgroup v2](/docs/concepts/architecture/cgroups/).

Докладніше дивіться в [KEP-5573: Remove cgroup v1 support](https://kubernetes.dev/resources/keps/5573).

### Admission webhooks більше не отримуватимуть запити на перевірку автентифікації та авторизації {#webhook-virtual-resources}

Починаючи з v1.37, функціональну можливість `ExcludeAdmissionWebhookVirtualResources` типово ввімкнено. Коли вона активна, validating і mutating admission webhooks більше не отримують запити на (віртуальний) запис до TokenReview, SelfSubjectReview, SubjectAccessReview, SelfSubjectAccessReview, LocalSubjectAccessReview або SelfSubjectRulesReview. Якщо створити або оновити конфігурацію webhook із правилами для одного з цих ресурсів, буде показано попередження про застарілу функцію. Під час запуску API-сервер також записуватиме в журнал наявні конфігурації, яких це стосується.

Якщо webhook має отримувати такі запити, наразі цю функціональну можливість можна вимкнути. Врахуйте, однак, що після переходу до стабільного стану її планують заблокувати у ввімкненому стані.

Докладніше дивіться в [KEP-5793: Manifest Based Admission Control Config](https://kubernetes.dev/resources/keps/5793).

## Зміни, що можуть спричинити несумісність, у Kubernetes v1.38{#breaking-changes-in-kubernetes-v1-38}

### Середовища виконання контейнерів мають повідомляти драйвер cgroup {#cgroup-driver-from-cri}

У v1.37 та старіших підтримуваних випусках `kubelet` має застарілий механізм налаштування драйвера cgroup. Сучасний спосіб — виклик CRI `RuntimeConfig`, який повідомляє рекомендований середовищем виконання контейнерів драйвер cgroup. У v1.38 `kubelet` типово більше не дозволятиме використовувати застарілий механізм: його буде позначено застарілим і вимкнено, якщо його не ввімкнути явно. У результаті у вузлах v1.38 середовище виконання контейнерів фактично має запускатися **до** `kubelet`, щоб той міг визначити потрібний драйвер cgroup. Якщо після повторних спроб `kubelet` не зможе отримати драйвер cgroup від середовища виконання, він завершить роботу з помилкою, так і не зареєструвавши вузол.

У межах цього майбутнього випуску поле `cgroupDriver` у файлі конфігурації kubelet буде застарілим. `kubelet` не лише вважатиме застарілим явне задання цього поля, а й відхилятиме його, якщо ви повторно не ввімкнете застарілий механізм за допомогою тимчасової функціональної можливості `LegacyCgroupDriverFallback`. Kubeadm також перестане типово встановлювати `cgroupDriver` у `systemd`, а його попередні перевірки повідомлятимуть про помилку, якщо середовище виконання не підтримує цей виклик RPC. Якщо на будь-якому з ваших вузлів працює несумісна стара версія середовища виконання контейнерів, дотримуйтеся інструкцій щодо оновлення в офіційних примітках до випуску v1.38.

Докладніше дивіться в [KEP-4033: Discover cgroup driver from CRI](https://kubernetes.dev/resources/keps/4033) і [kubernetes/kubernetes#136731](https://github.com/kubernetes/kubernetes/pull/136731).

### Ресурси на рівні Podʼа: зміниться робота зі swap на вузлах `LimitedSwap` {#pod-level-resources-swap}

Якщо ви використовуєте ресурси на рівні Podʼа у вузлах Linux із cgroup v2 та налаштованим `LimitedSwap`, у v1.38 `kubelet` почне застосовувати обмеження swap на основі налаштувань памʼяті Podʼа. Це означає, що Podʼи, у яких запит памʼяті на рівні Podʼа дорівнює її обмеженню, взагалі не матимуть доступу до swap — ні для Podʼа, ні для кожного його контейнера, навіть якщо запит памʼяті контейнера менший за його обмеження. Перед оновленням перевірте робочі навантаження, які покладаються на swap, і обовʼязково прочитайте офіційні примітки до випуску v1.38 з докладними рекомендаціями.

Докладніше дивіться в [KEP-2837: Pod Level Resource Specifications](https://kubernetes.dev/resources/keps/2837).

## Основні вдосконалення Kubernetes v1.38 {#featured-enhancements-of-kubernetes-v1-38}

Наведені нижче вдосконалення, імовірно, увійдуть до майбутнього випуску v1.38. Це не гарантія: склад випуску може змінитися.

### Перехід налаштувань користувача kubectl (kuberc) до стабільної версії {#kuberc}

Очікується, що `kuberc` — окремий файл конфігурації `kubectl` для налаштувань користувача, як-от псевдонімів, типових параметрів і політики для плагінів облікових даних, — перейде до стабільної версії у v1.38.

Докладніше читайте в розділі [Налаштування користувача kubectl (kuberc)](/docs/reference/kubectl/kuberc/) або в [KEP-3104: Separate kubectl user preferences from cluster configs](https://kubernetes.dev/resources/keps/3104).

### Перехід ресурсів на рівні Podʼа до стабільної версії {#pod-level-resources}

Очікується, що ресурси на рівні Podʼа, які дають змогу встановлювати запити й обмеження CPU, памʼяті та hugepages для Podʼа загалом, перейдуть до стабільної версії у v1.38. Якщо ви використовуєте вузли Linux із `LimitedSwap`, перед оновленням прочитайте про [зміну роботи зі swap](#pod-level-resources-swap).

Докладніше читайте в розділі [Призначення ресурсів CPU та памʼяті на рівні Podʼа](/docs/tasks/configure-pod-container/assign-pod-level-resources/) або в [KEP-2837: Pod Level Resource Specifications](https://kubernetes.dev/resources/keps/2837).

### Перехід підтримки подільних пристроїв у DRA до стабільної версії {#dra-partitionable-devices}

Подільні пристрої дають змогу драйверу [динамічного розподілу ресурсів](/docs/concepts/resource-management/dynamic-resource-allocation/) (DRA) оголосити пристрій, наприклад GPU, як цілий пристрій і як кілька менших частин. Планувальник виділяє лише ті комбінації, які поміщаються у фізичний пристрій. Очікується, що у v1.38 ця можливість перейде до стабільної версії, а функціональну можливість `DRAPartitionableDevices` буде заблоковано у ввімкненому стані.

Докладніше читайте в розділі [Подільні пристрої](/docs/concepts/resource-management/dynamic-resource-allocation/dra-features/#partitionable-devices) або в [KEP-4815: DRA: Add support for partitionable devices](https://kubernetes.dev/resources/keps/4815).

### API EvictionRequest (альфа) {#eviction-request-api}

Виселити Pod не завжди так просто, як завершити його роботу. Деякі застосунки можуть виконувати важливу роботу, наприклад міграцію даних або очищення. Їхнє завершення без часу на підготовку може спричинити перебої.

API EvictionRequest запроваджує більш скоординований спосіб виселення Podʼів. Він дає змогу застосункам і контролерам підготуватися до виселення Podʼа. Наприклад, коли потрібно звільнити вузол або перенести Pod на інший вузол, контролер може створити EvictionRequest, щоб повідомити про потребу виселити цей Pod.

Контролер запиту на виселення координує процес із відповідачами, налаштованими для Podʼа. Вони можуть виконати специфічні для застосунку завдання, як-от завершити поточну роботу, очистити ресурси або перенести дані до завершення Podʼа.

Якщо власного відповідача немає або відповідачі не завершили процес, Kubernetes може повернутися до наявного механізму виселення, ініційованого через API. Цей механізм і далі дотримується PodDisruptionBudget (PDB). API EvictionRequest не замінює PDB, а дає застосункам змогу взяти участь у процесі виселення.

Оскільки це альфа-функція, потрібно буде ввімкнути і функціональну можливість `EvictionRequestAPI`, **і** відповідну альфа-групу API. Коли зʼявляться примітки до випуску v1.38 і документація, перевірте в них точні вимоги.

Докладніше дивіться в [KEP-4563: API EvictionRequest](https://kubernetes.dev/resources/keps/4563).

## Дізнайтеся більше {#want-to-know-more}

Про нові функції та застарілі можливості також повідомляють у примітках до випуску Kubernetes. Інформацію про [Kubernetes v1.38](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.38.md) буде офіційно опубліковано в журналі змін цього випуску.

Випуск Kubernetes v1.38 заплановано на **середу, 16 грудня 2026 року**. Слідкуйте за оновленнями!

Оголошення про зміни також можна знайти в примітках до випусків:

- [Kubernetes v1.37](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.37.md)
- [Kubernetes v1.36](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.36.md)
- [Kubernetes v1.35](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.35.md)

## Долучайтеся {#get-involved}

Найпростіший спосіб долучитися до Kubernetes — приєднатися до однієї з багатьох [спеціалізованих груп інтересів](https://kubernetes.dev/community/community-groups/sigs/) (SIG), що відповідають вашим інтересам.

Якщо ви не знаєте, з чого почати, приєднайтеся до щомісячного заходу [«Орієнтація для нових учасників»](https://www.kubernetes.dev/docs/orientation/). Там ми розповідаємо про структуру проєкту й допомагаємо зробити перший внесок.

- Дізнайтеся, як стати [учасником проєкту Kubernetes](https://www.kubernetes.dev/docs/guide/)
- Читайте про події у спільноті Kubernetes у нашому [блозі](https://kubernetes.io/blog/)
- Приєднайтеся до [Slack](https://slack.k8s.io/)
- Стежте за нами в [X](https://x.com/kubernetesio)
- Стежте за нами в [LinkedIn](https://www.linkedin.com/company/kubernetes/)
- Стежте за нами в [Bluesky](https://bsky.app/profile/kubernetes.io), щоб отримувати останні новини
- Долучайтеся до обговорень спільноти на [Discuss](https://discuss.kubernetes.io/)
- Ставте запитання (або відповідайте на них) на [Stack Overflow](https://stackoverflow.com/questions/tagged/kubernetes)
- Поділіться [історією кінцевого користувача Kubernetes](https://www.cncf.io/case-studies/)
- Дізнайтеся більше про [команду випуску Kubernetes](https://github.com/kubernetes/sig-release/tree/master/release-team)
