---
title: Обмеження томів на вузлі
content_type: concept
weight: 90
---

<!-- overview -->

На цій сторінці описано максимальну кількість томів, які можна підʼєднати до вузла, для різних хмарних провайдерів.

Хмарні провайдери, такі як Google, Amazon і Microsoft, зазвичай обмежують кількість томів, які можна підʼєднати до вузла. Важливо, щоб Kubernetes дотримувався цих обмежень. Інакше Podʼи, заплановані на вузол, можуть застрягти в очікуванні підʼєднання томів.

<!-- body -->

## Стандартні обмеження Kubernetes {#kubernetes-default-limits}

Планувальник Kubernetes має стандартні обмеження на кількість томів, які можна підʼєднати до вузла:

| Хмарний сервіс | Максимальна кількість томів на вузол |
|----------------|-------------------------------------|
| [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) | 39 |
| [Google Persistent Disk](https://cloud.google.com/persistent-disk/) | 16 |
| [Microsoft Azure Disk Storage](https://azure.microsoft.com/en-us/services/storage/main-disks/) | 16 |

## Обмеження динамічних томів {#dynamic-volume-limits}

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

Обмеження динамічних томів підтримуються для таких типів томів.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

Для томів, керованих вбудованими втулками томів, Kubernetes автоматично визначає тип вузла і застосовує відповідну максимальну кількість томів для вузла. Наприклад:

- У [Google Compute Engine](https://cloud.google.com/compute/) до вузла можна підʼєднати до 127 томів, [залежно від типу вузла](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

- Для дисків Amazon EBS на типах екземплярів M5,C5,R5,T3 та Z1D Kubernetes дозволяє підʼєднувати до вузла лише 25 томів. Для інших типів екземплярів в [Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/) Kubernetes дозволяє підʼєднувати до вузла 39 томів.

- В Azure до вузла можна підʼєднати до 64 дисків, залежно від типу вузла. Докладніше дивіться [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

- Якщо драйвер сховища CSI оголошує максимальну кількість томів для вузла (за допомогою `NodeGetInfo`), {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} дотримується цього обмеження. Докладніше дивіться в [специфікаціях CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo).

- Для томів, керованих вбудованими втулками, які було перенесено на драйвер CSI, максимальною кількістю томів буде та, про яку повідомляє драйвер CSI.

### Mutable CSI Node Allocatable Count {#mutable-csi-node-allocatable-count}

{{< feature-state feature_gate_name="MutableCSINodeAllocatableCount" >}}

Драйвери CSI можуть динамічно змінювати максимальну кількість томів, які можна підʼєднати до вузла, під час роботи. Це підвищує точність планування та зменшує кількість збоїв планування Podʼів через зміни в доступності ресурсів.

Щоб скористатися цією можливістю, ви повинні ввімкнути функціональну можливість `MutableCSINodeAllocatableCount` у таких компонентах:

- `kube-apiserver`
- `kubelet`

#### Періодичні оновлення {#periodic-updates}

Якщо цю можливість увімкнено, драйвери CSI можуть запитувати періодичні оновлення своїх обмежень томів, встановивши поле `nodeAllocatableUpdatePeriodSeconds` у специфікації `CSIDriver`. Наприклад:

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: hostpath.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

kubelet періодично викликатиме точку доступу `NodeGetInfo` відповідного драйвера CSI, щоб оновити максимальну кількість томів, які можна підʼєднати, використовуючи інтервал, вказаний у полі `nodeAllocatableUpdatePeriodSeconds`. Мінімально допустиме значення цього поля — 10 секунд.

Якщо операція підʼєднання тому завершується помилкою `ResourceExhausted` (код gRPC 8), Kubernetes негайно оновлює кількість доступних для розподілу томів цього вузла. Крім того, kubelet позначає уражені Podʼи як Failed, що дозволяє їхнім контролерам обробити повторне створення. Це запобігає безстроковому застряганню Podʼів у стані `ContainerCreating`.

### Запобігання розміщенню Podʼа без драйвера CSI {#preventing-pod-placement-without-csi-driver}

{{< feature-state feature_gate_name="VolumeLimitScaling" >}}

Функціональна можливість [`VolumeLimitScaling`](/docs/reference/command-line-tools-reference/feature-gates/#VolumeLimitScaling) стандартно ввімкнена в Kubernetes v1.37.

Однак запобігання розміщенню Podʼів на вузлах без драйвера CSI вимагає явної згоди через поле `spec.preventPodSchedulingIfMissing` обʼєкта `CSIDriver`.

Поле `preventPodSchedulingIfMissing` стандартно має значення `false`, і його потрібно встановити в `true`, якщо ви не хочете, щоб Podʼи планувалися на вузлах без драйвера CSI. Стандартне значення `false` вибрано з міркувань зворотної сумісності та сумісності з [Cluster AutoScaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler), який може не враховувати обмеження томів CSI під час автомасштабування (дивіться розділ нижче).

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: hostpath.csi.k8s.io
spec:
  preventPodSchedulingIfMissing: true
```

### Обмеження підʼєднання томів CSI та cluster autoscaler {#csi-volume-attach-limits-and-cluster-autoscaler}

[Cluster autoscaler](https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler) може враховувати обмеження томів CSI, коли встановлено `--enable-csi-node-aware-scheduling=true`. Цей параметр не залежить від функціональної можливості `VolumeLimitScaling`.

Якщо ви використовуєте cluster autoscaler, встановлюйте `spec.preventPodSchedulingIfMissing` у `true` лише тоді, коли cluster autoscaler налаштовано з `--enable-csi-node-aware-scheduling=true`. Інакше його симуляції планування не включатимуть потрібну інформацію `CSINode` для нових вузлів, і cluster autoscaler може не масштабуватися вгору для Podʼів в очікуванні, які використовують томи CSI.
