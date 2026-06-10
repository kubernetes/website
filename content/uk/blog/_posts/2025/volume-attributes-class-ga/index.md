---
layout: blog
title: "Kubernetes v1.34: VolumeAttributesClass для зміни атрибутів томів тепер GA"
date: 2025-09-08T10:30:00-08:00
slug: kubernetes-v1-34-volume-attributes-class
author: >
  Sunny Song (Google)
translator: >
  [Андрій Головін](https://github.com/Andygol)
---

API VolumeAttributesClass, який надає можливість користувачам динамічно змінювати атрибути томів, офіційно перейшов у стадію загальної доступності (GA) у Kubernetes v1.34. Це важлива віхa, яка забезпечує надійний і стабільний спосіб налаштування вашого постійного сховища безпосередньо в Kubernetes.

## Що таке VolumeAttributesClass? {#what-is-volumeattributesclass}

По суті, VolumeAttributesClass — це ресурс, що охоплює кластер, який визначає набір змінних параметрів для тому. Розглядайте це як "профіль" для вашого сховища, що дозволяє адміністраторам кластерів експонувати різні рівні якості обслуговування (QoS) або продуктивності.

Користувачі можуть вказати `volumeAttributesClassName` у своїх PersistentVolumeClaim (PVC), щоб вказати, який клас атрибутів вони бажають. Чарівність відбувається через Container Storage Interface (CSI): коли PVC, що посилається на VolumeAttributesClass, оновлюється, відповідний драйвер CSI взаємодіє з відповідною системою зберігання, щоб застосувати вказані зміни до тому.

Це означає, що ви тепер можете:

*   Динамічно масштабувати продуктивність: збільшити IOPS або пропускну здатність для завантаженої бази даних або зменшити її для менш критичного застосунку.
*   Оптимізувати витрати: налаштовувати атрибути на льоту, щоб відповідати вашим поточним потребам, уникаючи надмірного постачання.
*   Спростити операції: керувати змінами томів безпосередньо в API Kubernetes, а не покладатися на зовнішні інструменти або ручні процеси.

## Що нового в GA порівняно з бета {#what-is-new-from-beta-to-ga}

Є два основних вдосконалення порівняно з бета.

### Підтримка скасування у разі виникнення помилок {#cancellation-support-when-errors-occur}

Щоб покращити стійкість і зручність використання, випуск GA вводить явну підтримку скасування, коли під час запиту на зміну тома виникає помилка. Якщо відповідна система зберігання або драйвер CSI вказує, що запитувані зміни не можуть бути застосовані (наприклад, через недійсні аргументи), користувачі можуть скасувати операцію і повернути том до його попередньої стабільної конфігурації, запобігаючи залишенню тому в несумісному стані.

### Підтримка квот на основі області дії {#quota-support-based-on-scope}

Хоча VolumeAttributesClass не додає нового типу квот, панель управління Kubernetes може бути налаштована для примусового дотримання квот на PersistentVolumeClaims, які посилаються на конкретний VolumeAttributesClass.

Це досягається за допомогою поля `scopeSelector` в ResourceQuota для націлювання на PVC, які мають `.spec.volumeAttributesClassName`, встановлене на конкретне імʼя VolumeAttributesClass. Будь ласка, дивіться більше деталей [тут]( https://kubernetes.io/docs/concepts/policy/resource-quotas/#resource-quota-per-volumeattributesclass).

## Підтримка драйверами VolumeAttributesClass {#drivers-support-volumeattributesclass}

* Драйвер Amazon EBS CSI: Драйвер AWS EBS CSI має надійну підтримку VolumeAttributesClass і дозволяє динамічно змінювати такі параметри, як тип тому (наприклад, gp2 на gp3, io1 на io2), IOPS і пропускну здатність томів EBS.
* Драйвер Google Compute Engine (GCE) Persistent Disk CSI (pd.csi.storage.gke.io): цей драйвер також підтримує динамічну зміну атрибутів постійного диска, включаючи IOPS і пропускну здатність, за допомогою VolumeAttributesClass.

## Контакти {#contact}

Якщо у вас є запитання або конкретні запити, повʼязані з VolumeAttributesClass, будь ласка, звертайтеся до [SIG Storage community](https://github.com/kubernetes/community/tree/master/sig-storage).
