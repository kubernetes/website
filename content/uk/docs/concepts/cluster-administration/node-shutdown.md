---
title: Вимкнення вузлів
content_type: concept
weight: 10
---

<!-- overview -->

У кластері Kubernetes {{< glossary_tooltip text="вузол" term_id="node" >}} може бути вимкнено планово й коректно або несподівано через такі причини, як відключення живлення чи інші зовнішні обставини. Вимкнення вузла може призвести до збою робочого навантаження, якщо перед вимкненням для вузла не виконано drain. Вимкнення вузла може бути **коректним** (graceful) або **некоректним** (non-graceful).

{{< caution >}}
Пакунок `unattended-upgrades` з Debian у своїй звичайній конфігурації конфліктує з коректним вимкненням вузла. Якщо ви використовуєте стандартну конфігурацію `unattended-upgrades`, яка змінює період коректного завершення під час вимкнення сервера, kubelet не зможе отримати блокування, потрібне для правильної обробки подій вимкнення.

Це відбувається, якщо значення `shutdownGracePeriod` перевищує 30 секунд. Щоб уникнути цього, ви можете приглушити частину конфігурації `unattended-upgrades`, зробивши `/etc/systemd/logind.conf.d/unattended-upgrades-logind-maxdelay.conf` символічним посиланням на `/dev/null`.

Докладніше дивіться в [документації `logind.conf`](https://www.freedesktop.org/software/systemd/man/latest/logind.conf.html).
{{< /caution >}}

<!-- body -->

## Коректне вимкнення вузла {#graceful-node-shutdown}

kubelet намагається виявити вимкнення системи вузла та завершує Podʼи, що працюють на вузлі.

kubelet забезпечує, щоб під час вимкнення вузла Podʼи проходили звичайний [процес завершення Podʼа](/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination). Під час вимкнення вузла kubelet не приймає нові Podʼи (навіть якщо ці Podʼи вже привʼязані до вузла).

### Увімкнення коректного вимкнення вузла {#enabling-graceful-node-shutdown}

{{< tabs name="graceful_shutdown_os" >}}
{{% tab name="Linux" %}}
{{< feature-state feature_gate_name="GracefulNodeShutdown" >}}

У Linux коректним вимкненням вузла керує функціональна можливість [`GracefulNodeShutdown`](/docs/reference/command-line-tools-reference/feature-gates/#GracefulNodeShutdown), яку стандартно ввімкнено у версії 1.21.

{{< note >}}

Коректне вимкнення вузла залежить від systemd, оскільки використовує [блокування інгібіторів systemd](https://www.freedesktop.org/wiki/Software/systemd/inhibit/), щоб затримати вимкнення вузла на заданий час.

{{</ note >}}
{{% /tab %}}

{{% tab name="Windows" %}}
{{< feature-state feature_gate_name="WindowsGracefulNodeShutdown" >}}

У Windows коректним вимкненням вузла керує функціональна можливість [`WindowsGracefulNodeShutdown`](/docs/reference/command-line-tools-reference/feature-gates/#WindowsGracefulNodeShutdown), яку запроваджено у версії 1.32 як альфа-можливість. У Kubernetes 1.34 ця можливість перебуває на стадії бета й стандартно ввімкнена.

{{< note >}}
Коректне вимкнення вузла у Windows залежить від того, чи працює kubelet як служба Windows; тоді він матиме зареєстрований [обробник керування службою](https://learn.microsoft.com/en-us/windows/win32/services/service-control-handler-function), щоб затримати подію preshutdown на заданий час.
{{</ note >}}

Коректне вимкнення вузла у Windows неможливо скасувати.

Якщо kubelet не працює як служба Windows, він не зможе встановити та відстежувати подію [Preshutdown](https://learn.microsoft.com/en-us/windows/win32/api/winsvc/ns-winsvc-service_preshutdown_info), і вузлу доведеться пройти процедуру [некоректного вимкнення вузла](#non-graceful-node-shutdown), згадану вище.

Якщо коректне вимкнення вузла у Windows ввімкнено, але kubelet не працює як служба Windows, kubelet продовжить працювати, а не завершиться збоєм. Однак він запише в лог помилку про те, що його потрібно запускати як службу Windows.
{{% /tab %}}

{{< /tabs >}}

### Налаштування коректного вимкнення вузла {#configuring-graceful-node-shutdown}

Зверніть увагу, що стандартно обидва параметри конфігурації, описані нижче, `shutdownGracePeriod` та `shutdownGracePeriodCriticalPods`, мають нульове значення, тому коректне вимкнення вузла не активоване. Щоб активувати цю можливість, обидва параметри потрібно правильно налаштувати, встановивши ненульові значення.

Щойно kubelet отримує сповіщення про вимкнення вузла, він встановлює на Node стан `NotReady` із `reason` зі значенням `"node is shutting down"`. kube-scheduler враховує цей стан і не планує жодних Podʼів на цей вузол; очікується, що інші сторонні планувальники дотримуватимуться такої самої логіки. Це означає, що нові Podʼи не плануватимуться на цей вузол, а отже, жоден із них не запуститься.

kubelet **також** відхиляє Podʼи під час фази `PodAdmission`, якщо виявлено поточне вимкнення вузла, тому навіть Podʼи з {{< glossary_tooltip text="toleration" term_id="toleration" >}} для `node.kubernetes.io/not-ready:NoSchedule` там не запустяться.

Коли kubelet встановлює цей стан на своєму Node через API, він також починає завершувати всі Podʼи, що працюють локально.

Під час коректного вимкнення kubelet завершує Podʼи у дві фази:

1. Завершує звичайні Podʼи, що працюють на вузлі.
1. Завершує [критичні Podʼи](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical), що працюють на вузлі.

Коректне вимкнення вузла налаштовується двома параметрами [`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/):

- `shutdownGracePeriod`:

  Визначає загальний час, на який вузол має затримати вимкнення. Це загальний період коректного завершення для звичайних і [критичних Podʼів](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).

- `shutdownGracePeriodCriticalPods`:

  Визначає час, який використовується для завершення [критичних Podʼів](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical) під час вимкнення вузла. Це значення має бути меншим за `shutdownGracePeriod`.

{{< note >}}
Є випадки, коли вимкнення вузла було скасовано системою (або, можливо, вручну адміністратором). У будь-якому з цих випадків вузол повернеться до стану `Ready`. Однак Podʼи, які вже розпочали процес завершення, не будуть відновлені kubelet і їх потрібно буде перепланувати.
{{< /note >}}

Наприклад, якщо `shutdownGracePeriod=30s`, а `shutdownGracePeriodCriticalPods=10s`, kubelet затримає вимкнення вузла на 30 секунд. Під час вимкнення перші 20 (30-10) секунд буде зарезервовано для коректного завершення звичайних Podʼів, а останні 10 секунд — для завершення [критичних Podʼів](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical).

{{< note >}}
Коли Podʼи виселяються під час коректного вимкнення вузла, вони позначаються як вимкнені. Команда `kubectl get pods` показує статус виселених Podʼів як `Terminated`. А `kubectl describe pod` вказує, що Pod було виселено через вимкнення вузла:

```none
Reason:         Terminated
Message:        Pod was terminated in response to imminent node shutdown.
```

{{< /note >}}

### Коректне вимкнення вузла на основі пріоритету Podʼів {#pod-priority-graceful-node-shutdown}

{{< feature-state feature_gate_name="GracefulNodeShutdownBasedOnPodPriority" >}}

Щоб забезпечити більшу гнучкість щодо порядку завершення Podʼів під час коректного вимкнення вузла, воно враховує PriorityClass Podʼів, за умови, що ви ввімкнули цю можливість у своєму кластері. Ця можливість дозволяє адміністраторам кластера явно визначати порядок завершення Podʼів під час коректного вимкнення вузла на основі [класів пріоритету](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass).

Можливість [коректного вимкнення вузла](#graceful-node-shutdown), описана вище, вимикає Podʼи у дві фази: спочатку некритичні Podʼи, а потім критичні. Якщо потрібна додаткова гнучкість, щоб явно й докладніше визначити порядок Podʼів під час вимкнення, можна використовувати коректне вимкнення на основі пріоритету Podʼів.

Коли коректне вимкнення вузла враховує пріоритети Podʼів, його можна виконувати в кілька фаз, кожна з яких вимикає Podʼи певного класу пріоритету. У kubelet можна налаштувати конкретні фази та час вимкнення для кожної фази.

Припустімо, що в кластері є такі власні [класи пріоритету Podʼів](/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass):

|Назва класу пріоритету Podʼа|Значення класу пріоритету Podʼа|
|-------------------------|------------------------|
|`custom-class-a`         | 100000                 |
|`custom-class-b`         | 10000                  |
|`custom-class-c`         | 1000                   |
|`regular/unset`          | 0                      |

У [конфігурації kubelet](/docs/reference/config-api/kubelet-config.v1beta1/) налаштування `shutdownGracePeriodByPodPriority` можуть мати такий вигляд:

|Значення класу пріоритету Podʼа|Період вимкнення|
|------------------------|---------------|
| 100000                 |10 секунд|
| 10000                  |180 секунд|
| 1000                   |120 секунд|
| 0                      |60 секунд|

Відповідна конфігурація YAML kubelet виглядатиме так:

```yaml
shutdownGracePeriodByPodPriority:
  - priority: 100000
    shutdownGracePeriodSeconds: 10
  - priority: 10000
    shutdownGracePeriodSeconds: 180
  - priority: 1000
    shutdownGracePeriodSeconds: 120
  - priority: 0
    shutdownGracePeriodSeconds: 60
```

Наведена вище таблиця означає, що будь-який Pod зі значенням `priority` >= 100000 отримає лише 10 секунд на вимкнення, будь-який Pod зі значенням >= 10000 і < 100000 отримає 180 секунд на вимкнення, будь-який Pod зі значенням >= 1000 і < 10000 отримає 120 секунд на вимкнення. Нарешті, усі інші Podʼи отримають 60 секунд на вимкнення.

Не обовʼязково вказувати значення, відповідні всім класам. Наприклад, можна використовувати ці налаштування:

|Значення класу пріоритету Podʼа|Період вимкнення|
|------------------------|---------------|
| 100000                 |300 секунд|
| 1000                   |120 секунд|
| 0                      |60 секунд|

У цьому випадку Podʼи з `custom-class-b` потраплять до тієї самої групи вимкнення, що й `custom-class-c`.

Якщо в певному діапазоні немає Podʼів, kubelet не чекає на Podʼи в цьому діапазоні пріоритетів. Натомість kubelet одразу переходить до наступного діапазону значень класу пріоритету.

Якщо цю можливість увімкнено, а конфігурацію не надано, жодних дій з упорядкування не виконується.

Щоб використовувати цю можливість, потрібно ввімкнути функціональну можливість [`GracefulNodeShutdownBasedOnPodPriority`](/docs/reference/command-line-tools-reference/feature-gates/#GracefulNodeShutdownBasedOnPodPriority) і встановити в `ShutdownGracePeriodByPodPriority` у [конфігурації kubelet](/docs/reference/config-api/kubelet-config.v1beta1/) потрібну конфігурацію зі значеннями класів пріоритету Podʼів та відповідними періодами вимкнення.

{{< note >}}
Можливість враховувати пріоритет Podʼів під час коректного вимкнення вузла запроваджено як альфа-можливість у Kubernetes v1.23. У Kubernetes {{< skew currentVersion >}} ця можливість перебуває на стадії бета й стандартно ввімкнена.
{{< /note >}}

Метрики `graceful_shutdown_start_time_seconds` та `graceful_shutdown_end_time_seconds` надаються в підсистемі kubelet для моніторингу вимкнень вузлів.

## Обробка некоректного вимкнення вузла {#non-graceful-node-shutdown}

{{< feature-state feature_gate_name="NodeOutOfServiceVolumeDetach" >}}

Вимкнення вузла може не виявити Node Shutdown Manager у kubelet — або тому, що команда не активує механізм блокування інгібіторів, який використовує kubelet, або через помилку користувача, тобто неправильне налаштування ShutdownGracePeriod та ShutdownGracePeriodCriticalPods. Докладніше дивіться в розділі [Коректне вимкнення вузла](#graceful-node-shutdown) вище.

Коли вузол вимкнено, але Node Shutdown Manager у kubelet цього не виявив, Podʼи, що входять до {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}, застрягнуть у стані завершення на вимкненому вузлі та не зможуть перейти на новий запущений вузол. Це тому, що kubelet на вимкненому вузлі недоступний для видалення Podʼів, тому StatefulSet не може створити новий Pod з такою самою назвою. Якщо Podʼи використовують томи, VolumeAttachments не буде видалено з початкового вимкненого вузла, тому томи, які використовують ці Podʼи, не можна підʼєднати до нового запущеного вузла. Унаслідок цього застосунок, що працює в StatefulSet, не може функціонувати належним чином. Якщо початковий вимкнений вузол знову запрацює, kubelet видалить Podʼи, а нові Podʼи буде створено на іншому запущеному вузлі. Якщо початковий вимкнений вузол не запрацює, ці Podʼи назавжди застрягнуть у стані завершення на вимкненому вузлі.

Щоб помʼякшити цю ситуацію, користувач може вручну додати taint `node.kubernetes.io/out-of-service` з ефектом `NoExecute` або `NoSchedule` до вузла, позначивши його як виведений з експлуатації. Якщо вузол позначено цим taint, Podʼи на вузлі буде примусово видалено, якщо вони не мають відповідних tolerations, а операції відʼєднання томів для Podʼів, що завершуються на вузлі, відбудуться негайно. Це дозволяє Podʼам з виведеного з експлуатації вузла швидко відновитися на іншому вузлі.

Під час некоректного вимкнення Podʼи завершуються у дві фази:

1. Примусово видаляються Podʼи, які не мають відповідних tolerations `out-of-service`.
1. Негайно виконується операція відʼєднання томів для таких Podʼів.

{{< note >}}

- Перш ніж додавати taint `node.kubernetes.io/out-of-service`, слід перевірити, що вузол уже вимкнений або знеструмлений (а не перебуває в процесі перезапуску).
- Користувач має вручну видалити taint out-of-service після того, як Podʼи буде переміщено на новий вузол і користувач перевірить, що вимкнений вузол відновився, оскільки саме користувач додав цей taint.

{{< /note >}}

### Примусове відʼєднання сховища за тайм-аутом {#storage-force-detach-on-timeout}

У будь-якій ситуації, коли видалення Podʼа не вдалося протягом 6 хвилин, Kubernetes примусово відʼєднає томи, що розмонтовуються, якщо в цей момент вузол несправний. Будь-яке робоче навантаження, що все ще працює на вузлі й використовує примусово відʼєднаний том, спричинить порушення [специфікації CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#controllerunpublishvolume), згідно з якою `ControllerUnpublishVolume` «**має** викликатися після того, як усі виклики `NodeUnstageVolume` та `NodeUnpublishVolume` для тому виконано й вони успішно завершилися». За таких обставин томи на цьому вузлі можуть зазнати пошкодження даних.

Примусове відʼєднання сховища є необовʼязковим; користувачі можуть натомість скористатися можливістю «Non-graceful node shutdown».

Примусове відʼєднання сховища за тайм-аутом можна вимкнути, встановивши поле конфігурації `disable-force-detach-on-timeout` у `kube-controller-manager`. Вимкнення цієї можливості означає, що для тому, розміщеного на вузлі, який несправний понад 6 хвилин, повʼязаний [VolumeAttachment](/docs/reference/kubernetes-api/config-and-storage-resources/volume-attachment-v1/) не буде видалено.

Після застосування цього налаштування несправні Podʼи, все ще приєднані до томів, потрібно відновлювати за допомогою процедури [обробки некоректного вимкнення вузла](#non-graceful-node-shutdown), згаданої вище.

{{< note >}}

- Під час використання процедури [обробки некоректного вимкнення вузла](#non-graceful-node-shutdown) потрібно бути обережними.
- Відхилення від документованих вище кроків може призвести до пошкодження даних.

{{< /note >}}

## {{% heading "whatsnext" %}} {#whats-next}

Дізнайтеся більше про таке:

- Блог: [Non-Graceful Node Shutdown](/blog/2023/08/16/kubernetes-1-28-non-graceful-node-shutdown-ga/).
- Архітектура кластера: [Вузли](/docs/concepts/architecture/nodes/).
