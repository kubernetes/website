---
layout: blog
title: "Kubernetes v1.37: Memory QoS переходить у бета-версію"
draft: true
slug: kubernetes-v1-37-memory-qos-graduates-to-beta
author: >
  Qi Wang (Red Hat),
  Sohan Kunkerkar (Red Hat)
translator: >
  [Андрій Головін](https://github.com/andygol)
---

Memory QoS переходить у бета-версію в Kubernetes v1.37 і тепер стандартно увімкнено. На вузлах Linux, що працюють з cgroup v2, ця функція використовує контролер пам’яті, щоб надати ядру кращі вказівки щодо обробки пам’яті контейнера. Вперше вона була представлена як альфа у v1.22 і розширена у v1.36 з багаторівневою резервацією пам’яті.

У цьому дописі розглядається, що змінилося у v1.37, що означає перехід у бета-версію для операторів кластерів і як налаштувати цю функцію.

## Що змінилося у v1.37 {#what-changed-in-v1-37}

### Memory QoS в статусі Beta і стандартно увімкнено {#memory-qos-is-beta-and-enabled-by-default}

Функціональна можливість `MemoryQoS` тепер у статусі Beta у v1.37. Це означає, що у кожного `kubelet` версії v1.37 ця функціональна можливість увімкнена без будь-яких змін у конфігурації. Увімкнення функції як стандартної є безпечним, оскільки конфігурація `kubelet` не активує обмеження пам’яті або резервування пам’яті. Жодні значення `memory.high`, `memory.min` або `memory.low` не записуються до cgroups, якщо ви явно їх не налаштували.

Ви можете вибірково ввімкнути певні поведінки через поля конфігурації `kubelet`:

1. Встановіть `memoryThrottlingFactor` (наприклад, `0.9`), щоб увімкнути обмеження `memory.high` для контейнерів Burstable і BestEffort. Типове значення `null`, що означає відсутність обмежень.
2. Встановіть `memoryReservationPolicy` на `TieredReservation`, щоб увімкнути багаторівневий захист пам’яті через `memory.min` і `memory.low`. Типове значення `None`, що означає відсутність резервування пам’яті.

### Стандартне значення `memoryThrottlingFactor` змінено на null {#default-memorythrottlingfactor-changed-to-null}

У попередніх альфа-релізах `memoryThrottlingFactor` мав стандартне значення `0.9`, що означало, що увімкнення функціональної можливості призводило до того, що `kubelet` встановлював `memory.high` для контейнерів. У v1.37 стандартне значення — `null`, тому `kubelet` не встановлює `memory.high`, якщо ви явно не налаштували це значення.

Це зміна була внесена тому, що з стандартним увімкненням функціональної можливості автоматичне встановлення `memory.high` могло обмежувати робочі навантаження, які раніше працювали без обмежень. Встановлення значення `null` гарантує, що оновлення до v1.37 не змінює поведінку виконання для наявних кластерів.

Якщо ваш файл конфігурації `kubelet` уже містить явне значення `memoryThrottlingFactor`, це значення зберігається під час оновлення, і обмеження продовжує працювати як раніше. Якщо ваш файл конфігурації не містить `memoryThrottlingFactor`, `kubelet` використовує нове стандартне значення `null` і перестає встановлювати `memory.high`. Щоб зберегти обмеження в цьому випадку, додайте `memoryThrottlingFactor` явно:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
```

## Як налаштувати MemoryQoS у v1.37 {#how-to-configure-memoryqos-in-v1-37}

Для повного опису налаштування Memory QoS див. [Memory QoS з cgroup v2](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2), [Налаштування резервування пам’яті](/docs/concepts/workloads/pods/pod-qos/#configuring-memory-reservation) та [Системні вимоги](/docs/concepts/workloads/pods/pod-qos/#system-requirements)

### Увімкнення тільки обмеження пам’яті {#enable-memory-throttling-only}

Встановіть `memoryThrottlingFactor` у значення між 0 і 1. `kubelet` використовує цей коефіцієнт для обчислення `memory.high` для контейнерів Burstable і BestEffort. Див. [Обмеження пам’яті](/docs/concepts/workloads/pods/pod-qos/#memory-throttling) для того, як обчислюється `memory.high` для кожного класу QoS.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
```

### Увімкнення обмеження пам’яті та багаторівневого резервування {#enable-memory-throttling-and-tiered-reservation}

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryThrottlingFactor: 0.9
memoryReservationPolicy: TieredReservation
```

### Увімкнення багаторівневого резервування без обмеження пам’яті {#enable-tiered-reservation-without-throttling}

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
memoryReservationPolicy: TieredReservation
```

### Вимкнення Memory QoS повністю {#disable-memory-qos-entirely}

Щоб вимкнути функцію після оновлення, встановіть функціональну можливість у значення `false` і переконайтеся, що конфігурація kubelet сумісна. `kubelet` відхиляє конфігурацію, якщо `memoryThrottlingFactor` встановлено на будь-яке значення, крім колишнього стандартного значення `0.9`, або якщо `memoryReservationPolicy` встановлено на `TieredReservation`, тому видаліть або відкоригуйте ці поля, якщо ви їх встановили.

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: false
```

Коли функціональна можливість вимкнена або `memoryReservationPolicy` не встановлено на `TieredReservation`, `kubelet` скидає застарілий захист під час запуску на вузлах cgroup v2: `memory.min=0` і `memory.low=0` у кореневому cgroup kubepods, а `memory.low=0` у cgroup Burstable QoS. Для контейнерів застарілі значення `memory.high` скидаються до `max` на шляхах узгодження, таких як перезапуск або зміна розміру.

## Відомі обмеження: резервування пам’яті поширюється на весь вузол {#known-limitation-memory-reservation-is-node-wide}

`memoryReservationPolicy` застосовується до кожного пода на вузлі. З `TieredReservation` кожен под Guaranteed отримує `memory.min`, а кожен Burstable под отримує `memory.low`; немає способу вибірково застосувати політику до окремих подів. Вузол, який змішує робочі навантаження, що потребують жорсткого резервування, з робочими навантаженнями, які повинні залишатися відновлюваними, повинен обрати одну політику для всіх них.

Жорстке резервування також охоплює все, що нараховується на cgroup контейнера, включно з кешем сторінок, тому под, який читає великі файли, може утримувати пам’ять, яку ядро в іншому випадку звільнило б для обслуговування сусідніх подів.

SIG Node відстежує обидва в [kubernetes/kubernetes#140246](https://github.com/kubernetes/kubernetes/issues/140246). Якщо це впливає на вас, найкраще місце для опису вашого робочого навантаження — це цей тікет.

## Чого очікувати далі {#what-to-expect-next}

Наступним етапом для Memory QoS є перехід у GA. Відгуки користувачів Beta допоможуть визначити будь-які залишкові налаштування перед цим кроком. Якщо ви зіткнетеся з проблемами, будь ласка, повідомляйте про помилки в [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/issues).

## Як я можу дізнатися більше? {#how-can-i-learn-more}

- [KEP-2570: Memory QoS](https://www.kubernetes.dev/resources/keps/2570/)
- [Класи якості обслуговування Podʼів](/docs/concepts/workloads/pods/pod-qos/)
- [Memory QoS з cgroup v2](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2)
- [Керування ресурсами для контейнерів](/docs/concepts/configuration/manage-resources-containers/)
- [Підтримка cgroups v2 у Kubernetes](/docs/concepts/architecture/cgroups/)
- [Linux kernel cgroups v2 documentation](https://docs.kernel.org/admin-guide/cgroup-v2.html)

## Як долучитися {#getting-involved}

Ця функціональна можливість керується [SIG Node](https://www.kubernetes.dev/community/community-groups/sigs/node/). Якщо ви зацікавлені у внеску або маєте відгуки, ви можете зв’язатися через:

- Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
- [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
- [SIG Node meetings](https://www.kubernetes.dev/community/community-groups/sigs/node/#meetings)
