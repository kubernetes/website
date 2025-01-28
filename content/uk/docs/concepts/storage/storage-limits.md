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

## Власні обмеження

Ви можете змінити ці обмеження, встановивши значення змінної середовища `KUBE_MAX_PD_VOLS`, а потім запустивши планувальник. Драйвери CSI можуть мати іншу процедуру, дивіться їх документацію щодо налаштування обмежень.

Будьте обережні, якщо ви встановлюєте ліміт, який перевищує стандартний ліміт. Зверніться до документації хмарного постачальника, щоб переконатися, що Nodes дійсно може підтримувати встановлений вами ліміт.

Обмеження застосовується до всього кластера, тому воно впливає на всі вузли.

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
