---
content_type: "reference"
title: Локальні файли та шляхи, які використовує Kubelet
weight: 42
---

{{< glossary_tooltip text="kubelet" term_id="kubelet" >}} — це переважно процес без збереження стану, який працює на {{< glossary_tooltip text="вузлі" term_id="node" >}} Kubernetes. У цьому документі описані файли, які kubelet читає та записує.

{{< note >}}

Цей документ має інформаційний характер і не описує жодної гарантованої поведінки або API. У ньому перелічено ресурси, що використовуються kubelet, що є деталлю реалізації та може бути змінено у будь-якій версії.

{{< /note >}}

Зазвичай, kubelet використовує {{< glossary_tooltip text="панель управління" term_id="control-plane" >}} як джерело істини про те, що повинно запускатися на вузлі, і {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}} для отримання поточного стану контейнерів. За наявності _kubeconfig_ (конфігурації клієнта API), kubelet підключається до панелі управління; інакше вузол працює в _автономному режимі_.

На Linux-вузлах kubelet також читає cgroups та різні системні файли для збору метрик.

На Windows-вузлах kubelet збирає метрики іншим механізмом, що не спирається на шляхи.

Є також кілька інших файлів, які використовуються kubelet, і kubelet спілкується за допомогою локальних сокетів Unix-домену. Деякі з них — це сокети, на яких слухає kubelet, а інші — сокети, які kubelet виявляє та підключається до них як клієнт.

{{< note >}}

Ця сторінка наводить шляхи у форматі Linux, які відповідають шляхам Windows із додаванням кореневого диска `C:\` замість `/` (якщо не вказано інше). Наприклад, `/var/lib/kubelet/device-plugins` відповідає шляху `C:\var\lib\kubelet\device-plugins`.

{{< /note >}}

## Конфігурація {#configuration}

### Конфігураційні файли kubelet {#kubelet-configuration-files}

Шлях до конфігураційного файлу kubelet можна налаштувати за допомогою командного аргументу `--config`. Kubelet також підтримує доповнювані конфігураційні файли для розширення налаштувань.

### Сертифікати {#certificates}

Сертифікати та приватні ключі зазвичай розташовані в `/var/lib/kubelet/pki`, але цей шлях можна налаштувати за допомогою командного аргументу kubelet `--cert-dir`. Імена файлів сертифікатів також можна налаштувати.

### Маніфести {#manifests}

Маніфести для статичних Podʼів зазвичай розташовані в `/etc/kubernetes/manifests`. Місце розташування можна налаштувати за допомогою опції конфігурації kubelet `staticPodPath`.

### Налаштування юнітів systemd {#systemd-unit-settings}

Коли kubelet працює як юніт systemd, деякі налаштування kubelet можуть бути визначені в файлі налаштувань systemd. Зазвичай це включає:

- командні аргументи для запуску kubelet
- змінні середовища, що використовуються kubelet або для налаштування середовища golang

## Стан {#state}

### Файли контрольних точок для менеджерів ресурсів {#resource-managers-state}

Усі менеджери ресурсів зберігають відповідність між Podʼами та виділеними ресурсами у файлах стану. Ці файли розташовані в базовій теці kubelet, також відомій як _root directory_ (але це не те саме, що `/`, коренева тека вузла). Ви можете налаштувати базову теку для kubelet за допомогою аргументу командного рядка `--root-dir`.

Назви файлів:

- memory_manager_state для менеджера пам’яті
- cpu_manager_state для менеджера процесорів
- dra_manager_state для DRA

### Файл контрольної точки для менеджера пристроїв {#device-manager-state}

Менеджер пристроїв створює контрольні точки в тій самій теці, що й сокет-файли: `/var/lib/kubelet/device-plugins/`. Назва файлу контрольної точки — `kubelet_internal_checkpoint` для [менеджера пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#device-plugin-integration-with-the-topology-manager).

### Контрольні точки ресурсів Pod {#pod-resource-checkpoints}

{{< feature-state feature_gate_name="InPlacePodVerticalScaling" >}}

Якщо на вузлі увімкнено [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/)  `InPlacePodVerticalScaling`, kubelet зберігає локальний запис про _виділені_ та _активовані_ ресурси Pod. Докладніше про використання цих записів див. у статті [Зміна розміру ресурсів CPU та памʼяті, призначених контейнерам](/docs/tasks/configure-pod-container/resize-container-resources/).

Назви файлів:

- `allocated_pods_state` записує ресурси, виділені для кожного контейнера, запущеного на вузлі
- `actuated_pods_state` записує ресурси, які були прийняті виконавчим середовищем для кожного контейнера, запущеного на вузлі

Файли знаходяться у базовій теці kubelet (`/var/lib/kubelet` стандартно у Linux; налаштовується за допомогою `--root-dir`).

### Середовище виконання контейнерів {#container-runtime}

Kubelet спілкується з середовищем виконання контейнерів за допомогою сокета, налаштованого через такі параметри конфігурації:

- containerRuntimeEndpoint для операцій із середовищем виконання
- imageServiceEndpoint для операцій з управління образами

Фактичні значення цих точок доступу залежать від середовища виконання контейнерів, яке використовується.

### Втулки пристроїв {#device-plugins}

Kubelet відкриває сокет за шляхом `/var/lib/kubelet/device-plugins/kubelet.sock` для різних втулків пристроїв, які реєструються.

Коли втулок пристрою реєструється, він надає шлях до свого сокета, щоб kubelet міг підʼєднатися.

Сокет втулка пристрою повинен знаходитися в теці `device-plugins` у базовій теці kubelet. На типовому Linux-вузлі це означає `/var/lib/kubelet/device-plugins`.

### API ресурсів Podʼів {#pod-resources-api}

API ресурсів Podʼів буде доступний за шляхом `/var/lib/kubelet/pod-resources`.

### DRA, CSI та втулки пристроїв {#dra-csi-and-device-plugins}

Kubelet шукає сокет-файли, створені втулками пристроїв, керованими через DRA, менеджер пристроїв або втулки зберігання, а потім намагається приєднатись до цих сокетів. Текою, у якій kubelet шукає, є `plugins_registry` у базовій теці kubelet, тобто на типовому Linux-вузлі це — `/var/lib/kubelet/plugins_registry`.

Зверніть увагу, що для втулків пристроїв є два альтернативні механізми реєстрації. Тільки один із них повинен використовуватися для певного втулка.

Типи втулків, які можуть розміщувати сокет-файли в цій теці:

- втулки CSI
- втулки DRA
- втулки менеджера пристроїв

(зазвичай `/var/lib/kubelet/plugins_registry`).

### Належне вимкнення вузлів {#graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

[Належне вимкнення вузлів](/docs/concepts/cluster-administration/node-shutdown/#graceful-node-shutdown) зберігає стан локально за адресою `/var/lib/kubelet/graceful_node_shutdown_state`.

### Записи отримання образів {#image-pull-records}

{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}

Kubelet зберігає записи про спроби та успішні отримання образів і використовує їх для перевірки того, що образ вже було успішно отримано з тими самими обліковими даними.

Ці записи зберігаються у вигляді файлів у теці `image_registry` у базовій теці kubelet. На типовому вузлі Linux це означає `/var/lib/kubelet/image_manager`. У `image_manager` є дві вкладених теки:

- `pulling` - зберігає записи про образи, які Kubelet намагається витягнути.
- `pulled` - зберігає записи про образи, які було успішно отримано Kubelet, разом з метаданими про облікові дані, які було використано для отримання.

Докладні відомості наведено у розділі [Перевірка облікових даних при отриманні образів](/docs/concepts/containers/images#ensureimagepullcredentialverification).

## Профілі безпеки та конфігурація {#security-profiles-configuration}

### Seccomp {#seccomp}

Файли профілів seccomp, на які посилаються Podʼи, мають бути розміщені стандартно у `/var/lib/kubelet/seccomp`. Дивіться [довідку Seccomp](/docs/reference/node/seccomp/) для деталей.

### AppArmor {#apparmor}

Kubelet не завантажує і не звертається до профілів AppArmor за специфічним для Kubernetes шляхом. Профілі AppArmor завантажуються через операційну систему вузла, а не посилаються за їх шляхом.

## Блокування {#locking}

{{< feature-state state="alpha" for_k8s_version="v1.2" >}}

Файл блокування для kubelet зазвичай знаходиться за адресою `/var/run/kubelet.lock`. Kubelet використовує цей файл для того, щоб два різні екземпляри kubelet не намагалися працювати у конфлікті одна одної.
Ви можете налаштувати шлях до файлу блокування, використовуючи аргумент командного рядка kubelet `--lock-file`.

Якщо два екземпляри kubelet на одному вузлі використовують різні значення для шляху до файлу блокування, вони не зможуть виявити конфлікт, коли обидва працюють одночасно.

## {{% heading "whatsnext" %}}

- Дізнайтеся більше про [аргументи командного рядка kubelet](/docs/reference/command-line-tools-reference/kubelet/).
- Ознайомтеся з [довідником з налаштування Kubelet (v1beta1)](/docs/reference/config-api/kubelet-config.v1beta1/).
