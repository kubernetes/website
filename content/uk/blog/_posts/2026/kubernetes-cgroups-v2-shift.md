---
layout: blog
title: 'Перехід на cgroup v2 у Kubernetes: що вам потрібно знати'
draft: true
slug: kubernetes-cgroups-v2-shift
author: >
   Paco Xu (DaoCloud)
translator: >
  [Андрій Головін](https://github.com/andygol)
---

В Linux _cgroups_ (control groups) — це функція ядра, яка використовується для керування системними ресурсами. Kubernetes використовує cgroups для розподілу таких ресурсів, як CPU та памʼять, між контейнерами, гарантуючи, що застосунки працюють безперебійно, не заважаючи один одному. Починаючи з релізу Kubernetes v1.31, підтримка керування cgroup v1 перейшла в [режим підтримки](/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/). Підтримка керування cgroup v2 стабільна, починаючи з Kubernetes v1.25.

Порівняно з cgroup v1, cgroup v2 надає єдину уніфіковану ієрархію, більш узгоджений інтерфейс та міцнішу основу для ізоляції ресурсів і сучасних функцій керування ресурсами.

## Визнання cgroup v1 застарілим {#deprecation-of-cgroup-v1}

Kubernetes [оголосив cgroup v1 застарілим](/docs/concepts/architecture/cgroups/#deprecation-of-cgroup-v1). Починаючи з Kubernetes v1.35, `failCgroupV1` стандартно дорівнює `true`, тому kubelet типово не запускається на вузлі з cgroup v1. Адміністратори можуть тимчасово встановити `failCgroupV1: false` у [файлі конфігурації kubelet](/docs/tasks/administer-cluster/kubelet-config-file/), але видалення буде слідувати [політиці застарілості Kubernetes](/docs/reference/deprecation-policy/). Подальшу роботу з видалення відстежується в [KEP-5573: Remove cgroup v1 support](https://www.kubernetes.dev/resources/keps/5573).

Якщо ви все ще використовуєте реліз старіший за v1.35, виконайте міграцію кожного Linux-вузла на cgroup v2 перед оновленням або плануйте встановити тимчасове перевизначення `failCgroupV1: false`. Якщо ви вже на v1.35 або пізнішій версії, підтвердьте, що кожен Linux-вузол працює з cgroup v2 (або що ви навмисно зберігаєте перевизначення). За типової конфігурації вузол, що залишився на cgroup v1, зазнає збою під час запуску kubelet.

Для кластерів, що управляються kubeadm, у Kubernetes v1.35 ця перевірка також відбувається раніше і є більш суворою. Попередня перевірка `SystemVerification`, яку надає `k8s.io/system-validators`, повертає помилку під час `kubeadm init`, `kubeadm join` та `kubeadm upgrade`, коли виявляє cgroup v1 з kubelet v1.35 або пізнішої версії; зі старішим kubelet перевірка залишається попередженням. Деталі дивіться в [примітках до релізу kubernetes/system-validators#1.12.1](https://github.com/kubernetes/system-validators/releases/tag/v1.12.1).

Найчастіші запитання охоплюють три основні сфери: чому варто мігрувати, переваги та недоліки, і ключові моменти, про які слід памʼятати при використанні cgroup v2.

## Обмеження cgroup v1 та покращення з cgroup v2 {#limitations-of-cgroup-v1-and-improvements-with-cgroup-v2}

Документація ядра Linux описує обидва інтерфейси:

- [документація cgroup v1](https://www.kernel.org/doc/Documentation/cgroup-v1/)
- [документація cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)

Перелічимо деякі відомі проблеми.

### Памʼять `active_file` не вважається доступною памʼяттю {#active-file-memory-is-not-considered-available-memory}

Kubelet вважає памʼять `active_file` невідновлюваною. Для навантажень з інтенсивним вводом/виводом великий кеш сторінок може змусити kubelet повідомляти про тиск на памʼять та виселяти Podʼи. Це [відома проблема kubelet](/docs/concepts/scheduling-eviction/node-pressure-eviction/#active-file-memory-is-not-considered-as-available-memory) ([kubernetes/kubernetes#43916](https://github.com/kubernetes/kubernetes/issues/43916)); міграція на cgroup v2 сама по собі не змінює цей розрахунок. Задокументований обхідний шлях — встановити однакові запити та ліміти памʼяті для контейнерів, які виконують інтенсивний ввід/вивід, попередньо вимірявши відповідне значення.

### Оновлення Memory QoS у Kubernetes v1.36 {#memory-qos-updates-in-kubernetes-v1-36}

[Memory QoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2) було представлено як альфа-функцію в Kubernetes v1.22 і оновлено у v1.27. Ця функція залишається альфа-функцією у v1.36, але тепер відокремлює обмеження памʼяті від її резервування та додає [багаторівневий захист памʼяті](/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/):

Memory QoS доступний **лише** на Linux-вузлах, які використовують cgroup v2. Він покладається на контролер памʼяті cgroup v2: `memory.high` забезпечує обмеження, тоді як `memory.min` і `memory.low` забезпечують жорсткий і мʼякий захист, коли увімкнено багаторівневе резервування. cgroup v1 не може надати таку модель захисту.

- Увімкнення функціональної можливості `MemoryQoS` застосовує обмеження `memory.high` до контейнерів Burstable. Поріг визначається із запиту, ліміту та `memoryThrottlingFactor` (стандартно `0.9`).
- `memoryReservationPolicy: None` є стандартним значенням. Він не записує `memory.min` чи `memory.low`.
- `memoryReservationPolicy: TieredReservation` зіставляє запити памʼяті Podʼів Guaranteed з `memory.min` (жорсткий захист), а запити Podʼів Burstable — з `memory.low` (мʼякий захист). Podʼи BestEffort не отримують жодного захисту.
- Kubelet надає альфа-метрики для загальних резервувань `memory.min` та `memory.low` на вузлі.

- Рекомендується ядро 5.9 або пізнішої версії. На старіших ядрах відновлення `memory.high` може спричинити відомий livelock; починаючи з v1.36, kubelet записує попередження в журнал, коли Memory QoS увімкнено на ураженому ядрі.

Наприклад, щоб увімкнути багаторівневий захист:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  MemoryQoS: true
memoryReservationPolicy: TieredReservation
memoryThrottlingFactor: 0.9
```

Загальна рекомендація Kubernetes — не вмикати альфа-функції у промисловому середовищі; однак, якщо ви вважаєте, що Memory QoS з багаторівневим резервуванням корисним для вашої платформи у промисловому середовищі, обовʼязково протестуйте конфігурацію **та** врахуйте жорстко зарезервовану памʼять, перш ніж увімкнути функціональну можливість `TieredReservation`. Поточне зіставлення класів QoS Kubernetes з контролерами cgroup v2 дивіться у документації [Pod QoS](/docs/concepts/workloads/pods/pod-qos/#memory-qos-with-cgroup-v2).

### Обробка OOM з урахуванням контейнера {#container-aware-oom-handling}

На вузлах з cgroup v2 kubelet зазвичай встановлює `singleProcessOOMKill` у `false`. Тому він встановлює `memory.oom.group` для кожного cgroup контейнера, щоб подія OOM вбивала всі процеси в цьому контейнері разом, а не залишала частково працюючий багатопроцесний контейнер. Встановіть `singleProcessOOMKill: true`, лише якщо вам потрібна поведінка, сумісна з cgroup v1, коли ядро може вбивати по одному процесу за раз. Дивіться [довідку `KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-KubeletConfiguration) для цього налаштування.

Ця поведінка обмежена cgroup контейнера, а не всього Podʼа. Крім того, `cgroup.kill` — це окремий адміністративний інтерфейс: запис `1` у нього надсилає `SIGKILL` кожному процесу в цьому cgroup та його нащадках; він не налаштовує поведінку OOM. Контролер памʼяті cgroup v2 додатково надає лічильники `memory.events`, які можуть спостерігати системи моніторингу та просторові OOM-менеджери.

### Підтримка rootless {#rootless-support}

У cgroup v1 делегування контролерів менш привілейованим контейнерам може бути небезпечним.

На відміну від cgroup v1, cgroup v2 офіційно підтримує делегування. Більшість реалізацій rootless-контейнерів покладаються на systemd для делегування контролерів v2 непривілейованим користувачам.

Цей механізм делегування відокремлений від просторів імен користувачів Podʼів Kubernetes, які зіставляють користувачів контейнерів з непривілейованими користувачами хоста. [Підтримка просторів імен користувачів Podʼів](/docs/concepts/workloads/pods/user-namespaces/) досягла стабільності в Kubernetes v1.36; перевірте її вимоги до файлової системи, ядра, середовища виконання CRI та OCI перед увімкненням.

### Що ще? {#what-else}

1. Історії eBPF:
   - У cgroup v1 контроль доступу до пристроїв відображається через файли інтерфейсу.
   - Контролер пристроїв cgroup v2 не має файлів інтерфейсу і реалізований поверх cgroup BPF.
   - Cilium прикріплює BPF-програми cgroup для балансування навантаження на основі сокетів. Його [стандартний cgroup root](https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/#validate-bpf-cgroup-programs-attachment) — це `/run/cilium/cgroupv2`.
2. [Pressure Stall Information (PSI)](/docs/reference/instrumentation/understand-psi-metrics/) повідомляє про конкуренцію за CPU, памʼять та ввід/вивід на рівні вузла, Podʼа та контейнера. На підтримуваних кластерах kubelet стандартно надає PSI (`KubeletPSI` стабільний і перебуває у ввімкненому стані). PSI вимагає cgroup v2, Linux 4.20 або пізнішої версії, `CONFIG_PSI=y` та ядро, завантажене без `psi=0`. Kubelet показує ці дані через [Summary API](/docs/reference/instrumentation/node-metrics/#summary-api-source) та `/metrics/cadvisor`.
3. Під час міграції оновіть програмне забезпечення, яке читає файлову систему cgroup безпосередньо. [Поради щодо міграції](/docs/concepts/architecture/cgroups/#migrating-cgroupv2) рекомендують cAdvisor v0.43.0 або пізнішої версії та перелічують сумісні версії Java, Node.js та `automaxprocs`.

### Перетворення ваги CPU у новіших OCI-середовищах виконання {#cpu-weight-conversion-in-newer-oci-runtimes}

cgroup v1 використовує `cpu.shares`, тоді як cgroup v2 використовує `cpu.weight`. Новіші середовища виконання OCI використовують покращене нелінійне перетворення, яке зберігає типовий пріоритет і надає малим CPU-запитам кориснішу гранулярність. Зміну реалізовано в середовищі виконання OCI, а не в Kubernetes: вона доступна в crun v1.23 та runc v1.3.2. Після оновлення середовища виконання інструменти моніторингу або політик, які передбачають точні значення `cpu.weight`, можуть потребувати оновлень. Читайте «[Нове перетворення з cgroup v1 CPU Shares на v2 CPU Weight](/blog/2026/01/30/new-cgroup-v1-to-v2-cpu-conversion-formula/)» щодо формули, прикладів та міркувань сумісності.

### Оновлення ресурсів на місці {#in-place-resource-updates}

[Вертикальне масштабування Podʼів на місці](/docs/concepts/workloads/pods/pod-lifecycle/#pod-resize-inplace) досягло стабільності в Kubernetes v1.35. Kubernetes v1.36 потім стандартно [увімкнув](/blog/2026/04/30/kubernetes-v1-36-inplace-pod-level-resources-beta/) вертикальне масштабування на місці для ресурсів рівня Podʼа, як бета-функцію. Kubelet координує зміни між рівнями Podʼа та контейнера cgroups так, щоб збільшення створювали запас простору до зростання лімітів контейнера, тоді як зменшення обмежували контейнери перед звуженням межі рівня Podʼа. Точне сукупне застосування цієї функції v1.36 вимагає cgroup v2.

## Впровадження cgroup версії 2 {#adopting-cgroup-version-2}

### Вимоги {#requirements}

Ось що вам потрібно для використання cgroup v2 з Kubernetes. По-перше, вам потрібна версія Kubernetes з підтримкою керування cgroup v2; вона стабільна, починаючи з Kubernetes v1.25, і всі підтримувані релізи Kubernetes включають цю підтримку.

- Вам потрібен щонайменше один Linux-вузол; cgroup — це суто Linux-концепція
- Ваше встановлення ОС має працювати з увімкненим cgroup v2
- Версія ядра має бути 5.8 або пізнішою (5.9 або пізніша рекомендується при використанні Memory QoS)
- Середовище виконання контейнерів має підтримувати cgroup v2. Наприклад:
  - containerd v1.4 або пізніша підтримує cgroup v2; використовуйте containerd v2.0 або пізнішу для автоматичного виявлення cgroup-драйвера
  - CRI-O v1.20 або пізніша
- Kubelet і середовище виконання контейнерів мають бути налаштовані на використання правильного cgroup-драйвера. Дивіться [Налаштування cgroup-драйвера kubelet відповідно до cgroup-драйвера середовища виконання контейнерів](/docs/setup/production-environment/container-runtimes/#cgroup-drivers).

Наразі ви можете повернутися до використання cgroup v1; проєкт Kubernetes рекомендує використовувати cgroup v2, але в Kubernetes 1.36 (поточний реліз) варіант cgroup v1 все ще підтримується як запасний. Цей запасний варіант заплановано до видалення в Kubernetes v1.38. Якщо ви запускаєте старіший кластер, плануйте міграцію; якщо ви налаштовуєте новий кластер з Linux-вузлами, вам слід віддати перевагу cgroup v2. В обох випадках перегляньте [документацію Kubernetes щодо рантаймів контейнерів](/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver) та (якщо застосовно) [матрицю сумісності containerd](https://github.com/containerd/containerd/blob/main/RELEASES.md#kubernetes-support).

#### Оновлення ядра, що стосуються cgroup v2 {#kernel-updates-around-cgroup-v2}

Коли Kubernetes був вперше анонсований, у 2014 році, існував лише cgroup v1. Керування cgroup версії 2 вперше зʼявилося в ядрі Linux 4.5, випущеному у 2016 році.

- У Linux 4.5 підтримувалися контролери cgroup v2 `io`, `memory` та `pids`.
- Linux 4.15 додав підтримку контролера `cpu` cgroup v2.
- Підтримка [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html) (PSI) почалася з Linux 4.20.
- Проєкт Kubernetes не рекомендує використовувати cgroup v2 з ядром Linux старішим за 5.2 через відсутність підтримки заморожувача завдань на рівні cgroup.
- Kubernetes визначає версію 5.8 як мінімальну версію ядра для cgroup v2; системний файл `cpu.stat` кореневого cgroup було додано в Linux 5.8.
- Виправлення livelock `memory.high`, яке використовує Memory QoS, присутнє в Linux 5.9 та пізніших.
- `memory.peak` було додано в Linux 5.19.

### Конфігурація cgroup-драйвера {#cgroup-driver-configuration}

[Налаштуйте cgroup-драйвер kubelet відповідно до cgroup-драйвера рантайма контейнерів](/docs/setup/production-environment/container-runtimes/#cgroup-drivers).

Якщо ви використовуєте `kubeadm` для керування кластером, Kubernetes рекомендує використовувати cgroup-драйвер `systemd`, оскільки `kubeadm` керує kubelet як службою systemd. Для інших інструментів керування перевірте документацію інструмента, який ви використовуєте для керування кластером.

Якщо ви можете обрати будь-який варіант, я рекомендую використовувати драйвер systemd.

Який би інструмент ви не обрали, kubelet автоматично намагається виявити рекомендований cgroup-драйвер середовища виконання. Це автоматичне виявлення покладається на використання рантайма, який реалізує RPC `RuntimeConfig` CRI (наприклад: containerd v2.0+ або CRI-O v1.28+).

Якщо ви використовуєте середовище виконання контейнерів, яке підтримує cgroup v2, але не підтримує автоматичне виявлення cgroup-драйвера, ви можете вручну налаштувати перевизначення, відредагувавши файл конфігурації kubelet. Наприклад:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
```

Автоматичне виявлення cgroup-драйвера рантайма через CRI, яке відстежується [KEP-4033](https://www.kubernetes.dev/resources/keps/4033), досягло стабільності в Kubernetes v1.34. Воно вимагає середовища виконання, яке реалізує CRI RPC `RuntimeConfig` (containerd v2.0+ або CRI-O v1.28+). Коли воно доступне, kubelet використовує значення, повідомлене середовищем виконання, замість налаштованого значення `cgroupDriver`.

### Інструменти та команди для усунення несправностей {#tools-and-commands-for-troubleshooting}

Інструменти та команди, про які вам слід знати щодо cgroups:

- `stat -fc %T /sys/fs/cgroup/`: Перевірте, чи увімкнено cgroup v2; вона повертає `cgroup2fs`.
- `systemctl list-units 'kube*' --type=slice` або `--type=scope`: Перелічіть одиниці, повʼязані з Kubernetes, які systemd наразі має в памʼяті.
- `bpftool cgroup list /sys/fs/cgroup/*`: Перелічіть усі програми, прикріплені до CGROUP cgroup.
- `systemd-cgls /sys/fs/cgroup/*`: Рекурсивно покажіть вміст контрольних груп.
- `systemd-cgtop`: Покажіть верхні контрольні групи за їхнім використанням ресурсів.
- `tree -L 2 -d /sys/fs/cgroup/kubepods.slice`: Покажіть теки cgroups, повʼязані з Podʼами.

#### Як перевірити, чи ліміт CPU або памʼяті Podʼа успішно застосовано до файлу cgroup? {#how-to-check-if-a-pod-cpu-or-memory-limit-is-successfully-applied-to-the-cgroup-file}

Працюйте від обʼєкта API вниз до вузла. Ідентифікуйте вузол, потім порівняйте бажані ресурси в специфікації з фактичними значеннями у статусі (зміна розміру на місці може залишити їх неузгодженими):

```bash
kubectl get pod <pod-name> -n <namespace> \
  -o jsonpath='{.spec.nodeName}{"\n"}'

kubectl get pod <pod-name> -n <namespace> \
  -o jsonpath='{range .spec.containers[*]}{.name}{" spec\t"}{.resources}{"\n"}{end}'

kubectl get pod <pod-name> -n <namespace> \
  -o jsonpath='{range .status.containerStatuses[*]}{.name}{" status\t"}{.resources}{"\n"}{end}'
```

На цьому вузлі, від імені root, з cgroup-драйвером systemd та cgroup v2 (ці фрагменти також потребують `jq`). Визначте контейнер за мітками kubelet; самої назви контейнера недостатньо, щоб бути унікальною на вузлі. Використовуйте `crictl ps -a`, якщо контейнер не запущено:

```bash
CONTAINER_ID=$(crictl ps \
  --label io.kubernetes.pod.namespace=<namespace> \
  --label io.kubernetes.pod.name=<pod-name> \
  --name <container-name> -q | head -n1)

# OCI-представлення (не імена полів protobuf CRI)
crictl inspect "$CONTAINER_ID" | jq '.info.runtimeSpec.linux.resources'

# Шлях cgroup ядра для цього контейнера
PID=$(crictl inspect "$CONTAINER_ID" | jq -r '.info.pid')
CGROUP="/sys/fs/cgroup$(awk -F: '$1=="0"{print $3}' /proc/$PID/cgroup)"

cat "$CGROUP/cpu.weight"   # request.cpu → shares → weight; не ліміт
cat "$CGROUP/cpu.max"      # limit.cpu як "quota period"; без ліміту — "max <period>"
cat "$CGROUP/memory.max"   # limit.memory; без ліміту — "max"

# Cgroup рівня Podʼа (батьківський slice), використовується ресурсами рівня Podʼа
cat "$(dirname "$CGROUP")/cpu.max" "$(dirname "$CGROUP")/memory.max"

# Присутні, коли увімкнено MemoryQoS
cat "$CGROUP/memory.high" "$CGROUP/memory.min" "$CGROUP/memory.low"

SCOPE=$(basename "$CGROUP")
systemctl show "$SCOPE" \
  -p CPUWeight -p CPUQuotaPerSecUSec -p CPUQuotaPeriodUSec -p MemoryMax
```

Не трактуйте `info.runtimeSpec.linux.cgroupsPath` як шлях файлової системи, коли середовище виконання використовує драйвер systemd; це значення — шлях одиниці systemd (`slice:runtime:id`), а не тека під `/sys/fs/cgroup`.

Очікуване зіставлення на кожному рівні:

- Kubernetes: `spec.containers[*].resources` (бажані) та `status.containerStatuses[*].resources` (фактичні після зміни розміру на місці). Ресурси рівня Podʼа знаходяться в `spec.resources` та батьківському pod-slice.
- CRI (kubelet → середовище виконання; ці назви protobuf залишаються в стилі cgroup v1 навіть на v2): `cpu_shares`, `cpu_quota`, `cpu_period`, `memory_limit_in_bytes`, плюс `unified` для Memory QoS. `crictl inspect` не показує ці назви; він показує OCI-специфікацію, яку середовище виконання визначає із них.
- OCI-специфікація: `linux.resources.cpu.{shares,quota,period}`, `linux.resources.memory.limit` та `linux.resources.unified`. Середовище виконання перетворює shares, quota та period у файли cgroup v2. Після оновлення crun або runc формула перетворення shares у weight може змінитися; дивіться [перетворення ваги CPU](#cpu-weight-conversion-in-newer-oci-runtimes).
- scope systemd: `CPUWeight`, `CPUQuotaPerSecUSec`, `CPUQuotaPeriodUSec`, `MemoryMax`. Безлімітні або невстановлені значення часто відображаються як `[not set]` або нескінченність.
- cgroupfs: `cpu.weight` (з CPU-запиту; невстановлений запит все одно дає стандартне значення у 2 shares), `cpu.max` та `memory.max` у scope контейнера. Memory QoS додає `memory.high`, `memory.min` та `memory.low`.

## Подальше читання {#further-reading}

- [Kubernetes 1.31: Moving cgroup v1 Support into Maintenance Mode](/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/)
- [Kubernetes v1.36: Tiered Memory Protection with Memory QoS](/blog/2026/04/29/kubernetes-v1-36-memory-qos-tiered-protection/)
- [Kubernetes v1.36: PSI Metrics for Kubernetes Graduates to GA](/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/)
- [Kubernetes 1.25: cgroup v2 graduates to GA](/blog/2022/08/31/cgroupv2-ga-1-25/)
- KubeCon NA 2022 [cgroup v2: Before You Jump In](https://www.youtube.com/watch?v=WxZK-UXKvXk) від Tony Gosselin та Mike Tougeron, Adobe Systems
- KubeCon NA 2022 [Cgroupv2 Is Coming Soon To a Cluster Near You](https://www.youtube.com/watch?v=sgyFCp1CRhA) — David Porter, Google та Mrunal Patel, RedHat
- KubeCon EU 2020 [Kubernetes On cgroup v2](https://www.youtube.com/watch?v=u8h0e84HxcE&t=783s) від Giuseppe Scrivano, Red Hat.
- Цей допис охоплює лише базові вимоги та конфігурацію компонентів Kubernetes. Він не включатиме, як увімкнути cgroup fs у дистрибутивах ОС. Для міграції ви можете звернутися до [міграції на cgroup v2](/docs/concepts/architecture/cgroups/#migrating-cgroupv2)
