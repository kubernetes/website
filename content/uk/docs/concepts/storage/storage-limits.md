---
title: Обмеження томів на вузлі
content_type: concept
weight: 90
---

<!-- overview -->

Ця сторінка описує максимальну кількість томів, які можна прикріпити до вузла для різних хмарних постачальників.

Хмарні постачальники, такі як Google, Amazon і Microsoft, зазвичай мають обмеження на те, скільки томів можна прикріпити до вузла. Важливо, щоб Kubernetes дотримувався цих обмежень. В іншому випадку Podʼи, заплановані на вузлі, можуть застрягти в очікуванні прикріплення томів.

<!-- body -->

## Типові обмеження Kubernetes {#kubernetes-default-limits}

У планувальнику Kubernetes є типові обмеження на кількість томів, які можна прикріпити до вузла:

| Хмарний сервіс | Максимальна кількість томів на вузол |
|----------------|-------------------------------------|
| [Amazon Elastic Block Store (EBS)](https://aws.amazon.com/ebs/) | 39 |
| [Google Persistent Disk](https://cloud.google.com/persistent-disk/) | 16 |
| [Microsoft Azure Disk Storage](https://azure.microsoft.com/en-us/services/storage/main-disks/) | 16 |

## Обмеження динамічних томів {#dynamic-volume-limits}

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

Обмеження динамічних томів підтримуються для наступних типів.

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

Для томів, керованих вбудованими втулками томів, Kubernetes автоматично визначає тип вузла і накладає відповідне максимальне обмеження кількості томів для вузла. Наприклад:

- У [Google Compute Engine](https://cloud.google.com/compute/), до вузла може бути приєднано до 127 томів, [залежно від типу вузла](https://cloud.google.com/compute/docs/disks/#pdnumberlimits).

- Для дисків Amazon EBS на типах екземплярів M5,C5,R5,T3 та Z1D Kubernetes дозволяє приєднувати тільки 25 томів до вузла. Для інших типів інстансів на [Amazon Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/), Kubernetes дозволяє приєднувати 39 томів до вузла.

- На Azure до вузла може бути приєднано до 64 дисків, залежно від типу вузла. Докладніше див. [Sizes for virtual machines in Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes).

- Якщо драйвер сховища CSI рекламує максимальну кількість томів для вузла (використовуючи `NodeGetInfo`), {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} дотримується цього обмеження. Див. [специфікації CSI](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo) для отримання додаткових деталей.

- Для томів, керованих вбудованими втулками, які були перенесені у драйвер CSI, максимальна кількість томів буде тією, яку повідомив драйвер CSI.

### Mutable CSI Node Allocatable Count {#mutable-csi-node-allocatable-count}

{{< feature-state feature_gate_name="MutableCSINodeAllocatableCount" >}}

Драйвери CSI можуть динамічно регулювати максимальну кількість томів, які можуть бути приєднані до вузла під час виконання. Це підвищує точність планування та зменшує ймовірність збоїв у плануванні через зміну доступності ресурсів.

Це альфа-версія функції і стандартно вона вимкнена.

Щоб скористатися цією можливістю, вам слід увімкнути функціональну можливість `MutableCSINodeAllocatableCount` в наступних компонентах:

- `kube-apiserver`
- `kubelet`

#### Періодичні оновлення {#periodic-updates}

Якщо увімкнено, драйвери CSI можуть запитувати періодичні оновлення своїх лімітів томів, встановивши поле `nodeAllocatableUpdatePeriodSeconds` у специфікації `CSIDriver`. Наприклад:

```yaml
apiVersion: storage.k8s.io/v1
kind: CSIDriver
metadata:
  name: hostpath.csi.k8s.io
spec:
  nodeAllocatableUpdatePeriodSeconds: 60
```

Kubelet періодично викликатиме точку доступу `NodeGetInfo` відповідного драйвера CSI, щоб оновити максимальну кількість приєднаних томів, використовуючи інтервал, вказаний у полі `nodeAllocatableUpdatePeriodSeconds`. Мінімально допустиме значення для цього поля — 10 секунд.

Якщо операція приєднання тому завершиться невдало з помилкою `ResourceExhausted` (код gRPC 8), Kubernetes негайно оновить лічильник виділених томів для цього вузла. Додатково, kubelet позначає уражені поди як Failed, що дозволяє їх контролерам обробляти відтворення. Це запобігає застряганню подів у стані `ContainerCreating`.

### Запобігання розміщенню Podʼа без драйвера CSI {#preventing-pod-placement-without-csi-driver}

{{< feature-state feature_gate_name="VolumeLimitScaling" >}}

Якщо [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates#VolumeLimitScaling) `VolumeLimitScaling` увімкнено і драйвер CSI має відповідний об’єкт `CSIDriver`, то планувальник запобігатиме розміщенню подів на вузлах, на яких ще не встановлено драйвер CSI. Це обмеження застосовується лише до подів, які потребують відповідного тому CSI.
