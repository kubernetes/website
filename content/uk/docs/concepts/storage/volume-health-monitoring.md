---
title: Моніторинг справності томів
content_type: concept
weight: 100
---

<!-- overview -->

{{< feature-state feature_gate_name="CSIVolumeHealth" >}}

Моніторинг справності томів CSI дозволяє {{< glossary_tooltip text="CSI" term_id="csi" >}} драйверу повідомляти про проблеми зі справністю тому або його підлеглої системи збереження безпосередньо до Kubernetes. Драйвер повідомляє через CSI RPC, а Kubernetes виводить ці звіти у трьох полях статусу: {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} `.status.healthStatus`, {{< glossary_tooltip text="Pod" term_id="pod" >}} `.status.volumeHealth` та [CSINode](/docs/reference/kubernetes-api/storage/csi-node-v1/) `.status.storageHealth`. Автоматизація може відстежувати ці довготривалі поля статусу замість необхідності відновлювати стан справності тому з ефемерних {{< glossary_tooltip text="подій" term_id="event" >}} чи зі специфічних для постачальника панелей моніторингу.

{{< note >}}
Функціональна можливість `CSIVolumeHealth` існує ще з Kubernetes v1.21, але механізм, описаний на цій сторінці, є перепроєктуванням, яке замінює початкову альфа-реалізацію. Див. [Обмеження](#limitations), щоб дізнатися, що змінилося.
{{< /note >}}

<!-- body -->

## Як це працює {#how-it-works}

Специфікація CSI визначає чотири RPC для звітування про стан справності:

- На втулку контролера CSI: `ControllerListVolumeHealth` та `ControllerGetVolumeHealth`, для спостережуваного контролером стану справності кожного тому.
- На втулку вузла CSI: `NodeGetVolumeHealth`, для спостережуваного вузлом стану справності кожного тому, та `NodeGetStorageHealth`, для стану справності системи збереження як видно з цього вузла.

Драйверу потрібно реалізувати лише ті RPC, які він хоче підтримувати, і він повідомляє про підтримку через можливості втулка CSI. Драйвер, який не реалізує жоден із цих RPC, ніколи не опитується, і звітування залишається неактивним для цього драйвера. Драйвер, який повідомляє про можливість контролера `LIST_VOLUME_HEALTH`, також повинен повідомляти про `GET_VOLUME_HEALTH`; sidecar `csi-external-health-monitor-controller` забезпечує виконання цієї вимоги.

Кожен звіт про стан справності містить `status`, взятий із невеликого набору значень, придатних для машинного аналізу, разом із визначеним драйвером `reason` та необовʼязковим зрозумілим людині `message`:

- Значення статусу рівня тому (використовуються для `PersistentVolumeClaim.status.healthStatus` та `Pod.status.volumeHealth`): `Inaccessible`, `DataLoss`, `Degraded`.
- Значення статусу системи збереження (використовуються для `CSINode.status.storageHealth`): `StorageUnreachable`, `StorageDegraded`.

Звіти зі сторони вузла та зі сторони контролера незалежні: том може бути `Inaccessible` з одного вузла, який втратив свій шлях доступу до даних системи збереження, тоді як втулок контролера все ще повідомляє про том як справний, і навпаки.

## Стан справності, про який повідомляється у Podʼах {#health-reported-on-pods}

Для томів, які використовують драйвер CSI, що підтримує RPC `NodeGetVolumeHealth` зі сторони вузла, {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} періодично викликає цей RPC для кожного тома CSI, який він змонтував для Podʼа, і записує результат у `pod.status.volumeHealth`, з сортуванням за назвою тома з файлу `pod.spec.volumes`. Інтервал опитування — це налаштування kubelet `volumeStatsAggPeriod` (прапорець командного рядка `--volume-stats-agg-period`).

```yaml
apiVersion: v1
kind: Pod
# ...
status:
  volumeHealth:
  - name: my-volume
    healthConditions:
    - status: Inaccessible
      reason: VolumeNotFound
      message: "volume not found on the storage backend"
    lastTransitionTime: "2026-07-20T12:00:00Z"
```

Kubelet записує лише `pods/status`, субресурс, який він уже авторизований оновлювати для Podʼів, привʼязаних до його власного вузла, тому для цього поля не потрібна нова авторизація.

## Стан справності, про який повідомляється у CSINode {#health-reported-on-csinode}

Для кожного драйвера CSI, зареєстрованого на вузлі, який підтримує `NodeGetStorageHealth`, kubelet періодично викликає цей RPC і записує результат у `csinode.status.storageHealth`, з сортуванням за назвою драйвера.

```yaml
apiVersion: storage.k8s.io/v1
kind: CSINode
# ...
status:
  storageHealth:
  - name: csi.example.com
    healthConditions:
    - status: StorageUnreachable
      reason: NetworkPartition
      message: "data path to the storage backend is unreachable from this node"
```

Запис `StorageHealthCondition` може за бажанням обмежувати себе конкретним `accessMode` або `volumeMode`, для систем збереження, які деградують асиметрично (наприклад, мережева проблема, яка впливає на доступ `ReadWriteMany`, але не на `ReadWriteOnce`).

Запис у `csinodes/status` — це нова можливість, додана цією функцією: [режим авторизації вузла](/docs/reference/access-authn-authz/node/) та втулок допуску NodeRestriction дозволяють kubelet патчити лише обʼєкт `CSINode`, який відповідає його власному вузлу, і лише поки [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `CSIVolumeHealth` увімкнено.

## Стан справності, про який повідомляється у PersistentVolumeClaims {#health-reported-on-persistentvolumeclaims}

Спостережуваний контролером стан справності тому записується у `persistentvolumeclaim.status.healthStatus` через sidecar `csi-external-health-monitor-controller`, який запускається поряд із втулком контролера драйвера CSI. Sidecar викликає `ControllerListVolumeHealth` (або звертається до `ControllerGetVolumeHealth` для кожного тому) і записує результат:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
# ...
status:
  healthStatus:
    healthConditions:
    - status: Inaccessible
      reason: VolumeNotFound
      message: "volume not found on the storage backend"
    lastTransitionTime: "2026-07-20T12:00:00Z"
```

Жоден вузол ніколи не записує це поле; це робить лише sidecar `csi-external-health-monitor-controller`, що працює в панелі управління. Це не дозволяє скомпрометованому або неправильно працюючому вузлу впливати на те, що інші користувачі кластера бачать у PVC.

Чи доступний цей шлях для конкретного драйвера, залежить від того, чи цей драйвер та його розгортання sidecar `csi-external-health-monitor-controller` запровадили нові RPC контролера.

## Увімкнення моніторингу справності томів {#enabling-volume-health-monitoring}

Моніторинг справності томів керується однією [функціональною можливістю](/docs/reference/command-line-tools-reference/feature-gates/), `CSIVolumeHealth`, як на `kube-apiserver`, так і на kubelet:

- На `kube-apiserver` увімкнення функціональної можливості дозволяє записувати та читати нові поля статусу; вимкнення видаляє поля при наступному записі в обʼєкт, зберігаючи вже збережені значення.
- На kubelet увімкнення функціональної можливості запускає періодичне опитування зі сторони вузла, описане вище.

Моніторинг зі сторони контролера, який заповнює `persistentvolumeclaim.status.healthStatus`, не має власної функціональної можливості. Розгортання sidecar `csi-external-health-monitor-controller` поряд із втулком контролера вашого драйвера CSI саме по собі є згодою зі сторони контролера.

Увімкнення функціональної можливості саме по собі не призводить до появи будь-якої інформації про стан справності: драйвер CSI також повинен повідомляти та реалізовувати відповідні RPC. Перегляньте документацію вашого драйвера CSI, щоб дізнатися, які з чотирьох RPC, якщо такі є, він підтримує.

## Моніторинг {#monitoring}

Kubelet надає метрику-датчик `csi_node_storage_health_status`, позначену мітками `driver_name`, `status` та `reason`, зі значенням `1` для кожного стану системи збереження, про який наразі повідомляється для драйвера на цьому вузлі.

## Обмеження {#limitations}

- Kubernetes лише відображає ці звіти про стан справності; він не діє на їх основі. Ніщо в Kubernetes не переплановує Podʼи, не здійснює відновлення томів або іншим чином не реагує на повідомлений стан самостійно. Створення контролера виправлення поверх цих полів статусу залишається на розсуд операторів кластера та постачальників.
- Старіша альфа-реалізація тієї ж функціональної можливості `CSIVolumeHealth` (доступна починаючи з Kubernetes v1.21) повідомляла про ненормальні умови тому за допомогою Kubernetes Events та метрики `kubelet_volume_stats_health_status_abnormal`. Цей механізм було замінено полями статусу та RPC, описаними на цій сторінці, і його більше не існує.

## {{% heading "whatsnext" %}}

- Прочитайте [KEP-1432](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor), щоб дізнатися про повний проєкт.
- Див. [документацію драйвера CSI](https://kubernetes-csi.github.io/docs/drivers.html), щоб дізнатися, які драйвери CSI реалізують моніторинг справності томів.
