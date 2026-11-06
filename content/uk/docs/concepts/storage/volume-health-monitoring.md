---
title: Моніторинг справності томів
content_type: concept
weight: 100
---

<!-- overview -->

{{< feature-state feature_gate_name="CSIVolumeHealth" >}}

Моніторинг справності томів CSI дозволяє драйверу {{< glossary_tooltip text="CSI" term_id="csi" >}} повідомляти Kubernetes про проблеми зі справністю тому або бекенду його сховища безпосередньо. Драйвер звітує через RPC CSI, а Kubernetes показує ці звіти у трьох полях статусу: {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} `.status.healthStatus`, {{< glossary_tooltip text="Pod" term_id="pod" >}} `.status.volumeHealth` та [CSINode](/docs/reference/kubernetes-api/storage/csi-node-v1/) `.status.storageHealth`. Автоматизація може стежити за цими стійкими полями статусу, а не відтворювати справність томів з ефемерних {{< glossary_tooltip text="Events" term_id="event" >}} чи зі специфічних для постачальника dashboards.

{{< note >}}
Функціональна можливість `CSIVolumeHealth` існує з Kubernetes v1.21, але механізм, описаний на цій сторінці, є переробкою, яка замінює початкову альфа-реалізацію. Що змінилося, дивіться в розділі [Обмеження](#limitations).
{{< /note >}}

<!-- body -->

## Як це працює {#how-it-works}

Специфікація CSI визначає чотири RPC для звітування про справність:

- На втулку контролера CSI: `ControllerListVolumeHealth` та `ControllerGetVolumeHealth`, для справності кожного тому, яку спостерігає контролер.
- На втулку вузла CSI: `NodeGetVolumeHealth`, для справності кожного тому, яку спостерігає вузол, та `NodeGetStorageHealth`, для справності бекенду сховища, як її видно з цього вузла.

Драйверу потрібно реалізувати лише ті RPC, які він хоче підтримувати, і оголосити їхню підтримку через можливості втулка CSI. Драйвер, який не реалізує жодного з цих RPC, ніколи не опитується, і звітування для нього залишається неактивним. Драйвер, який оголошує можливість контролера `LIST_VOLUME_HEALTH`, також повинен оголосити `GET_VOLUME_HEALTH`; цю вимогу забезпечує sidecar-контейнер `csi-external-health-monitor-controller`.

Кожен звіт про справність містить `status` із невеликого набору значень, придатних для машинного аналізу, разом із визначеним драйвером `reason` та необовʼязковим зрозумілим людині `message`:

- Значення статусу на рівні тому (використовуються для `PersistentVolumeClaim.status.healthStatus` та `Pod.status.volumeHealth`): `Inaccessible`, `DataLoss`, `Degraded`.
- Значення статусу бекенду сховища (використовуються для `CSINode.status.storageHealth`): `StorageUnreachable`, `StorageDegraded`.

Звіти зі сторони вузла та зі сторони контролера незалежні: том може бути `Inaccessible` з одного вузла, який втратив шлях до даних бекенду, тоді як втулок контролера все ще повідомляє, що том справний, і навпаки.

## Справність, про яку повідомляється в Podʼах {#health-reported-on-pods}

Для томів, які використовують драйвер CSI з підтримкою RPC `NodeGetVolumeHealth` зі сторони вузла, {{< glossary_tooltip term_id="kubelet" text="kubelet" >}} періодично викликає цей RPC для кожного тому CSI, який він змонтував для Podʼа, і записує результат у `pod.status.volumeHealth`, використовуючи як ключ назву тому з `pod.spec.volumes`. Інтервал опитування — це налаштування kubelet `volumeStatsAggPeriod` (прапорець командного рядка `--volume-stats-agg-period`).

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

kubelet записує лише `pods/status`, субресурс, який він уже має право оновлювати для Podʼів, привʼязаних до його власного вузла, тому для цього поля не потрібна нова авторизація.

## Справність, про яку повідомляється в CSINode {#health-reported-on-csinode}

Для кожного зареєстрованого на вузлі драйвера CSI, який підтримує `NodeGetStorageHealth`, kubelet періодично викликає цей RPC і записує результат у `csinode.status.storageHealth`, використовуючи як ключ назву драйвера.

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

Запис `StorageHealthCondition` може за потреби обмежувати свою дію конкретним `accessMode` або `volumeMode` для бекендів, які деградують асиметрично (наприклад, мережева проблема, яка впливає на доступ `ReadWriteMany`, але не на `ReadWriteOnce`).

Запис у `csinodes/status` — це нова можливість, додана цією функціональністю: [режим авторизації Node](/docs/reference/access-authn-authz/node/) та втулок допуску NodeRestriction дозволяють kubelet змінювати лише обʼєкт `CSINode`, який відповідає його власному вузлу, і лише поки ввімкнено функціональну можливість [`CSIVolumeHealth`](/docs/reference/command-line-tools-reference/feature-gates/#CSIVolumeHealth).

## Справність, про яку повідомляється в PersistentVolumeClaims {#health-reported-on-persistentvolumeclaims}

Справність томів, яку спостерігає контролер, записує в `persistentvolumeclaim.status.healthStatus` sidecar-контейнер `csi-external-health-monitor-controller`, що працює поряд із втулком контролера драйвера CSI. Sidecar-контейнер викликає `ControllerListVolumeHealth` (або переходить на `ControllerGetVolumeHealth` для кожного тому) і записує результат:

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

Жоден вузол ніколи не записує це поле; це робить лише sidecar-контейнер, що працює в панелі управління. Це не дає скомпрометованому або несправному вузлу впливати на те, що інші користувачі кластера бачать у PVC.

Чи доступний цей шлях для конкретного драйвера, залежить від того, чи цей драйвер і його розгортання sidecar-контейнера `csi-external-health-monitor-controller` перейшли на нові RPC контролера.

## Увімкнення моніторингу справності томів {#enabling-volume-health-monitoring}

Моніторингом справності томів керує одна функціональна можливість [`CSIVolumeHealth`](/docs/reference/command-line-tools-reference/feature-gates/#CSIVolumeHealth) на `kube-apiserver` та kubelet:

- На `kube-apiserver` увімкнення функціональної можливості дозволяє записувати та читати нові поля статусу; вимкнення вилучає ці поля під час наступного запису в обʼєкт, але зберігає вже збережені значення.
- На kubelet увімкнення функціональної можливості запускає періодичне опитування зі сторони вузла, описане вище.

Моніторинг зі сторони контролера, який заповнює `persistentvolumeclaim.status.healthStatus`, не має власної функціональної можливості. Розгортання sidecar-контейнера `csi-external-health-monitor-controller` поряд із втулком контролера вашого драйвера CSI саме по собі є ввімкненням цього моніторингу.

Увімкнення функціональної можливості саме по собі не призводить до появи інформації про справність: драйвер CSI також повинен оголосити та реалізувати відповідні RPC. Перегляньте документацію свого драйвера CSI, щоб дізнатися, які з чотирьох RPC він підтримує, якщо підтримує.

## Моніторинг {#monitoring}

kubelet надає метрику типу gauge `csi_node_storage_health_status` з мітками `driver_name`, `status` та `reason` і значенням `1` для кожного стану бекенду сховища, про який наразі повідомляється для драйвера на цьому вузлі.

## Обмеження {#limitations}

- Kubernetes лише показує ці звіти про справність, але не діє на їх основі. Ніщо в Kubernetes не переплановує Podʼи, не перемикає томи на резерв і не реагує якось інакше на повідомлений стан самостійно. Створення контролера виправлення на основі цих полів статусу залишається за операторами кластерів і постачальниками.
- Старіша альфа-реалізація тієї самої функціональної можливості `CSIVolumeHealth` (доступна з Kubernetes v1.21) повідомляла про ненормальні стани томів за допомогою Events Kubernetes та метрики `kubelet_volume_stats_health_status_abnormal`. Цей механізм замінено полями статусу та RPC, описаними на цій сторінці, і його більше не існує.

## {{% heading "whatsnext" %}} {#whats-next}

- Прочитайте [KEP-1432](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor), щоб ознайомитися з повним дизайном.
- Дивіться [документацію драйверів CSI](https://kubernetes-csi.github.io/docs/drivers.html), щоб дізнатися, які драйвери CSI реалізують моніторинг справності томів.
