---
title: Використання sysctl в кластері Kubernetes
content_type: task
weight: 400
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

У цьому документі описано, як налаштовувати та використовувати параметри ядра в межах кластера Kubernetes, використовуючи інтерфейс {{< glossary_tooltip term_id="sysctl" >}}.

{{< note >}}
Починаючи з версії Kubernetes 1.23, kubelet підтримує використання `/` або `.` як роздільників у назвах sysctl. Починаючи з версії Kubernetes 1.25, налаштування Sysctls для Podʼа підтримує встановлення sysctl зі слешами. Наприклад, ту саму назву sysctl можна записати як `kernel.shm_rmid_forced`, використовуючи крапку як роздільник, або як `kernel/shm_rmid_forced`, використовуючи слеш. Докладніше про метод перетворення параметрів sysctl див. сторінку [sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html) проєкту Linux man-pages.
{{< /note >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< note >}}
`sysctl` — це інструмент командного рядка, специфічний для Linux, який використовується для налаштування різних параметрів ядра, і він недоступний в операційних системах, що не базуються на Linux.
{{< /note >}}

{{< include "task-tutorial-prereqs.md" >}}

Для деяких кроків вам також потрібно мати змогу змінювати параметри командного рядка для kubelet, що працюють на вашому кластері.

<!-- steps -->

## Перелік усіх параметрів sysctl {#listing-all-sysctl-parameters}

У Linux інтерфейс sysctl дає змогу адміністратору змінювати параметри ядра під час роботи. Параметри доступні через віртуальну файлову систему процесів `/proc/sys/`. Параметри охоплюють різні підсистеми, як-от:

- ядро (загальний префікс: `kernel.`)
- мережа (загальний префікс: `net.`)
- віртуальна памʼять (загальний префікс: `vm.`)
- MDADM (загальний префікс: `dev.`)
- Більше підсистем описано у [документації ядра](https://www.kernel.org/doc/Documentation/sysctl/README).

Щоб отримати список всіх параметрів, ви можете виконати команду:

```shell
sudo sysctl -a
```

## Безпечні та небезпечні sysctl {#safe-and-unsafe-sysctls}

Kubernetes класифікує sysctl як _безпечні_ або _небезпечні_. Крім належного просторового розмежування, _безпечний_ sysctl повинен бути належним чином _ізольованим_ між Podʼами на тому ж вузлі. Це означає, що встановлення _безпечного_ sysctl для одного Podʼа

- не повинно мати жодного впливу на інші Podʼи на вузлі
- не повинно дозволяти шкодити справності вузла
- не повинно дозволяти отримувати CPU або ресурси памʼяті поза межами обмежень ресурсів Podʼа.

Наразі більшість _просторово розмежованих_ (по просторах імен) sysctl не обовʼязково вважаються _безпечними_. До набору _безпечних_ входять такі sysctl:

- `kernel.shm_rmid_forced`;
- `net.ipv4.ip_local_port_range`;
- `net.ipv4.tcp_syncookies`;
- `net.ipv4.ping_group_range` (починаючи з Kubernetes 1.18);
- `net.ipv4.ip_unprivileged_port_start` (починаючи з Kubernetes 1.22);
- `net.ipv4.ip_local_reserved_ports` (починаючи з Kubernetes 1.27, потрібне ядро 3.16+);
- `net.ipv4.tcp_keepalive_time` (починаючи з Kubernetes 1.29, потрібне ядро 4.5+);
- `net.ipv4.tcp_fin_timeout` (починаючи з Kubernetes 1.29, потрібне ядро 4.6+);
- `net.ipv4.tcp_keepalive_intvl` (починаючи з Kubernetes 1.29, потрібне ядро 4.5+);
- `net.ipv4.tcp_keepalive_probes` (починаючи з Kubernetes 1.29, потрібне ядро 4.5+).
- `net.ipv4.tcp_rmem` (починаючи з Kubernetes 1.32, потрібне ядро 4.15+).
- `net.ipv4.tcp_wmem` (починаючи з Kubernetes 1.32, потрібне ядро 4.15+).
- `net.ipv4.tcp_slow_start_after_idle` (починаючи з Kubernetes 1.37, потрібне ядро 4.15+).
- `net.ipv4.tcp_notsent_lowat` (починаючи з Kubernetes 1.37, потрібне ядро 4.6+).

{{< note >}}
Є деякі винятки зі списку безпечних sysctl:

- Параметри sysctl `net.*` не дозволені, якщо ввімкнено мережу хоста.
- Параметр sysctl `net.ipv4.tcp_syncookies` не має просторового розмежування в ядрах Linux версії 4.5 або нижче.
{{< /note >}}

Цей список буде розширюватися у майбутніх версіях Kubernetes, коли kubelet буде підтримувати кращі механізми ізоляції.

### Увімкнення небезпечних sysctl {#enabling-unsafe-sysctls}

Всі _безпечні_ sysctl є стандартно увімкненими.

Всі _небезпечні_ sysctl стандартно вимкнені та повинні бути дозволені вручну адміністратором кластера на кожному вузлі окремо. Podʼи з вимкненими небезпечними sysctl будуть заплановані, але їх не вдасться запустити.

Зважаючи на наведене вище попередження, адміністратор кластера може дозволити певні _небезпечні_ sysctl для дуже особливих ситуацій, як-от налаштування високопродуктивних застосунків або застосунків реального часу. _Небезпечні_ sysctl вмикаються окремо для кожного вузла прапорцем kubelet; наприклад:

```shell
kubelet --allowed-unsafe-sysctls \
  'kernel.msg*,net.core.somaxconn' ...
```

Для {{< glossary_tooltip term_id="minikube" >}} це можна зробити за допомогою прапорця `extra-config`:

```shell
minikube start --extra-config="kubelet.allowed-unsafe-sysctls=kernel.msg*,net.core.somaxconn"...
```

Таким чином можна увімкнути лише _просторово розмежовані_ sysctl.

## Налаштування sysctl для Podʼа {#setting-sysctls-for-a-pod}

Низка sysctl у сучасних ядрах Linux _просторово розмежовані_. Це означає, що їх можна налаштовувати незалежно для кожного Podʼа на вузлі. У Kubernetes через securityContext Podʼа можна налаштовувати лише просторово розмежовані sysctl.

Відомо, що такі sysctl мають просторове розмежування. Цей список може змінитися в майбутніх версіях ядра Linux.

- `kernel.shm*`
- `kernel.msg*`
- `kernel.sem`
- `fs.mqueue.*`
- Ті `net.*`, які можна налаштувати в просторі імен мережі контейнера. Однак є винятки (наприклад, `net.netfilter.nf_conntrack_max` та `net.netfilter.nf_conntrack_expect_max` можуть бути налаштовані в просторі імен мережі контейнера, але не мають просторового розмежування до Linux 5.12.2).

Sysctl без просторового розмежування називають _вузловими_ sysctl. Якщо вам потрібно налаштувати їх, ви повинні вручну налаштувати їх в операційній системі кожного вузла або за допомогою DaemonSet з привілейованими контейнерами.

Використовуйте securityContext Podʼа для налаштування просторово розмежованих sysctl. securityContext застосовується до всіх контейнерів у тому ж Podʼі.

У цьому прикладі securityContext Podʼа використовується для встановлення безпечного sysctl `kernel.shm_rmid_forced` і двох небезпечних sysctl `net.core.somaxconn` та `kernel.msgmax`. У специфікації немає розрізнення між _безпечними_ та _небезпечними_ sysctl.

{{< warning >}}
Змінюйте параметри sysctl лише після розуміння їхніх наслідків, щоб уникнути дестабілізації вашої операційної системи.
{{< /warning >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
spec:
  securityContext:
    sysctls:
    - name: kernel.shm_rmid_forced
      value: "0"
    - name: net.core.somaxconn
      value: "1024"
    - name: kernel.msgmax
      value: "65536"
  ...
```

<!-- discussion -->

{{< warning >}}
Оскільки _небезпечні_ sysctl небезпечні за своєю природою, ви використовуєте їх на власний ризик, і це може призвести до серйозних проблем, як-от неправильна поведінка контейнерів, нестача ресурсів або повна непрацездатність вузла.
{{< /warning >}}

Доброю практикою є вважати вузли з особливими налаштуваннями sysctl позначеними _taint_ у межах кластера і планувати на них лише ті Podʼи, яким потрібні ці налаштування sysctl. Для цього рекомендується використовувати можливість Kubernetes [_taint і toleration_](/docs/reference/generated/kubectl/kubectl-commands/#taint).

Pod з _небезпечними_ sysctl не вдасться запустити на жодному вузлі, на якому ці два _небезпечні_ sysctl не ввімкнено явно. Як і з _вузловими_ sysctl, для планування таких Podʼів на відповідні вузли рекомендується використовувати [можливість _taint і toleration_](/docs/reference/generated/kubectl/kubectl-commands/#taint) або [taint на вузлах](/docs/concepts/scheduling-eviction/taint-and-toleration/).

## Налаштування sysctl для всіх Podʼів {#setting-sysctls-for-all-pods}

{{< feature-state feature_gate_name="DefaultPodSysctls" >}}

Ви можете налаштувати стандартний набір параметрів ядра (sysctl), які `kubelet` застосовує до всіх Podʼів, що працюють на вузлі Linux, включно з {{< glossary_tooltip text="статичними Podʼами" term_id="static-pod" >}}. Це корисно, коли адміністраторам вузлів потрібно забезпечити узгоджене налаштування параметрів ядра для всіх робочих навантажень на вузлі або в межах групи вузлів (наприклад, налаштування розмірів буферів TCP для високопродуктивних мереж) без необхідності, щоб кожна специфікація Podʼа окремо встановлювала `securityContext.sysctls`.

Щоб використовувати цю можливість, увімкніть функціональну можливість [`DefaultPodSysctls`](/docs/reference/command-line-tools-reference/feature-gates/#DefaultPodSysctls) для `kubelet` і вкажіть пари ключ-значення в полі `defaultPodSysctls` вашого [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/).

Поле `defaultPodSysctls` підтримує всі просторово розмежовані sysctl (`kernel.shm*`, `kernel.msg*`, `kernel.sem`, `kernel.domainname`, `fs.mqueue.*`, `net.*` та `user.*`), охоплюючи як _безпечні_, так і _небезпечні_ sysctl. Оскільки ці стандартні значення налаштовуються безпосередньо адміністратором вузла на `kubelet`, вам не потрібно додавати небезпечні sysctl до списку дозволених у `allowedUnsafeSysctls`.

Наведений нижче приклад налаштовує `kubelet` застосовувати стандартні sysctl у кількох просторово розмежованих підсистемах (мережа, IPC та простори імен користувача) до всіх Podʼів на вузлі:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
featureGates:
  DefaultPodSysctls: true
defaultPodSysctls:
  # Sysctl простору імен мережі (пропускаються, якщо Pod використовує hostNetwork: true)
  net.ipv4.ip_forward: "1"
  net.ipv4.tcp_rmem: "4096 87380 16777216"
  net.ipv4.tcp_wmem: "4096 65536 16777216"
  net.core.somaxconn: "1024"
  # Sysctl простору імен IPC (пропускаються, якщо Pod використовує hostIPC: true)
  kernel.shmall: "1048576"
  kernel.msgmax: "65536"
  kernel.sem: "250 32000 32 128"
  fs.mqueue.msg_max: "1024"
  # Sysctl простору імен користувача (пропускаються, якщо Pod поділяє простір імен користувача хоста)
  user.max_user_namespaces: "1000"
```

### Пріоритет та перевизначення {#precedence-and-overriding}

Значення, явно встановлені у `spec.securityContext.sysctls` Podʼа, завжди перевизначають відповідні стандартні значення, вказані у `defaultPodSysctls` `kubelet`. Перевизначення застосовуються індивідуально на основі кожного ключа: якщо Pod вказує значення для sysctl, яке також визначене у `defaultPodSysctls`, налаштування на рівні Podʼа має пріоритет для цього конкретного sysctl, тоді як інші стандартні значення продовжують застосовуватися. Зверніть увагу, що не існує груп повʼязаних налаштувань sysctl; якщо ваше робоче навантаження перевизначає sysctl, який є частиною повʼязаної групи (наприклад, розміри мережевих буферів), специфікація Podʼа повинна враховувати всі повʼязані налаштування за потреби.

### Простори імен хоста та фільтрація {#host-namespaces-and-filtering}

`kubelet` застосовує стандартні sysctl під час створення пісочниці Podʼа лише якщо Pod працює в окремому просторі імен для відповідної підсистеми. Якщо Pod поділяє простір імен хоста, стандартні sysctl для цього простору імен пропускаються для цього Podʼа:

- Sysctl `net.*` пропускаються, якщо Pod використовує мережу хоста (`hostNetwork: true`).
- Sysctl IPC (`kernel.sem`, `kernel.msg*`, `kernel.shm*`, `fs.mqueue.*`) пропускаються, якщо Pod використовує IPC хоста (`hostIPC: true`).
- Sysctl `user.*` пропускаються, якщо Pod поділяє простір імен користувача хоста (`hostUsers: true` або не встановлено).
- Sysctl UTS (`kernel.domainname`) пропускаються, якщо Pod використовує мережу хоста (`hostNetwork: true`).

### Перевірка та обмеження {#validation-and-limitations}

`kubelet` перевіряє `defaultPodSysctls` під час запуску. Непросторово розмежовані sysctl, недійсні назви sysctl або дублікати ключів перешкоджатимуть запуску `kubelet`.

Крім того, певні sysctl `net.*` можуть бути непросторово розмежованими залежно від вашої версії ядра. Вказання непросторово розмежованого sysctl `net.*` у `defaultPodSysctls` призведе до збою створення пісочниці Podʼа з помилкою `FailedCreatePodSandBox`. Pod продовжуватиме повторювати спроби створення пісочниці нескінченно. Переконайтеся, що всі вказані sysctl є просторово розмежованими на ядрі вашого вузла.

Зміни `defaultPodSysctls` застосовуються лише до новостворених Podʼів. `kubelet` не переналаштовує наявні Podʼи динамічно (див. [Що відбувається після перезапуску вузла](/docs/reference/node/what-happens-on-restart/#impact-of-a-kubelet-restart)). Наявні Podʼи продовжують працювати з sysctl, застосованими під час створення їхньої пісочниці. Якщо ви хочете, щоб наявні Podʼи отримали оновлені стандартні sysctl, потрібно створити ці Podʼи заново (наприклад, виконавши cordon і drain вузла).
