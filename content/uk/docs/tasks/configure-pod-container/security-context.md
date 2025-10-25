---
title: Налаштування контексту безпеки для Podʼа або контейнера
content_type: task
weight: 110
---

<!-- overview -->

Контекст безпеки визначає параметри привілеїв та контролю доступу для Podʼа або контейнера. Налаштування контексту безпеки включають, але не обмежуються:

* Дискреційний контроль доступу: Дозвіл на доступ до обʼєкта, такого як файл, базується на [ідентифікаторі користувача (UID) та ідентифікаторі групи (GID)](https://wiki.archlinux.org/index.php/users_and_groups).

* [Security Enhanced Linux (SELinux)](https://en.wikipedia.org/wiki/Security-Enhanced_Linux): Обʼєкти призначаються мітки безпеки.

* Виконання з привілеями або без них.

* [Linux Capabilities](https://linux-audit.com/linux-capabilities-hardening-linux-binaries-by-removing-setuid/): Надає процесу деякі привілеї, але не всі привілеї користувача root.

* [AppArmor](/docs/tutorials/security/apparmor/): Використовуйте профілі програм для обмеження можливостей окремих програм.

* [Seccomp](/docs/tutorials/security/seccomp/): Фільтрує системні виклики процесу.

* `allowPrivilegeEscalation`: Контролює, чи може процес отримувати більше привілеїв, ніж його батьківський процес. Ця логічна величина безпосередньо контролює, чи встановлюється прапорець [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt) для процесу контейнера. `allowPrivilegeEscalation` завжди true, коли контейнер:

  * запущений з привілеями, або
  * має `CAP_SYS_ADMIN`

* `readOnlyRootFilesystem`: Підключає кореневу файлову систему контейнера тільки для читання.

Вищевказані пункти не є повним набором налаштувань контексту безпеки,докладну інформацію див. у [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core) для повного переліку.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## Встановлення контексту безпеки для Pod {#set-the-security-context-for-a-pod}

Щоб вказати параметри безпеки для Podʼа, включіть поле `securityContext` в специфікацію Pod. Поле `securityContext` є обʼєктом [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core). Параметри безпеки, які ви вказуєте для Pod, застосовуються до всіх контейнерів в Podʼі. Ось файл конфігурації для Podʼа з `securityContext` та томом `emptyDir`:

{{% code_sample file="pods/security/security-context.yaml" %}}

У файлі конфігурації поле `runAsUser` вказує, що для будь-яких контейнерів в Podʼі, всі процеси виконуються з ідентифікатором користувача 1000. Поле `runAsGroup` вказує основний ідентифікатор групи 3000 для усіх процесів у контейнерах Pod. Якщо це поле відсутнє, основний ідентифікатор групи контейнерів буде root(0). Будь-які створені файли також належатимуть користувачу 1000 та групі 3000 при вказанні `runAsGroup`. Оскільки вказано поле `fsGroup`, всі процеси контейнера також належать до додаткової групи ідентифікатора 2000. Власником тому `/data/demo` та всіх створених файлів у цьому томі буде груповий ідентифікатор 2000. Додатково, коли вказане поле `supplementalGroups`, всі процеси контейнера також є частиною вказаних груп. Якщо це поле пропущене, це означає, що воно порожнє.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context.yaml
```

Перевірте, що контейнер Pod запущений:

```shell
kubectl get pod security-context-demo
```

Отримайте оболонку до запущеного контейнера:

```shell
kubectl exec -it security-context-demo -- sh
```

У вашій оболонці перелічіть запущені процеси:

```shell
ps
```

Виведений результат показує, що процеси виконуються від імені користувача 1000, що є значенням `runAsUser`:

```none
PID   USER     TIME  COMMAND
    1 1000      0:00 sleep 1h
    6 1000      0:00 sh
...
```

У вашій оболонці перейдіть до `/data`, та виведіть список тек:

```shell
cd /data
ls -l
```

Виведений результат показує, що тека `/data/demo` має ідентифікатор групи 2000, що є значенням `fsGroup`.

```none
drwxrwsrwx 2 root 2000 4096 Jun  6 20:08 demo
```

У вашій оболонці перейдіть до `/data/demo`, та створіть файл:

```shell
cd demo
echo hello > testfile
```

Виведіть список файлів у теці `/data/demo`:

```shell
ls -l
```

Виведений результат показує, що `testfile` має ідентифікатор групи 2000, що є значенням `fsGroup`.

```none
-rw-r--r-- 1 1000 2000 6 Jun  6 20:08 testfile
```

Виконайте наступну команду:

```shell
id
```

Результат буде схожий на цей:

```none
uid=1000 gid=3000 groups=2000,3000,4000
```

З результату видно, що `gid` дорівнює 3000, що є таким самим, як поле `runAsGroup`. Якби поле `runAsGroup` було пропущено, `gid` залишився б 0 (root), і процес зміг би взаємодіяти з файлами, які належать групі root(0) та групам, які мають необхідні права групи для групи root (0). Ви також можете побачити, що `groups` містить ідентифікатори груп, які вказані в `fsGroup` і `supplementalGroups`, поряд з `gid`.

Вийдіть з оболонки:

```shell
exit
```

### Неявні членства груп, визначені в `/etc/group` в контейнерному образі {#implicit-group-membership-defined-in-etc-group-in-the-container-image}

Стандартно Kubernetes обʼєднує інформацію про групи з Podʼа з інформацією, визначеною в `/etc/group` в контейнерному образі.

{{% code_sample file="pods/security/security-context-5.yaml" %}}

Цей контекст безпеки Podʼа містить `runAsUser`, `runAsGroup` та `supplementalGroups`. Проте ви можете побачити, що фактичні додаткові групи, що прикріплені до процесу контейнера, включатимуть ідентифікатори груп, які походять з `/etc/group` всередині контейнерного образу.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-5.yaml
```

Перевірте, чи контейнер Pod запущений:

```shell
kubectl get pod security-context-demo
```

Отримайте оболонку для запущеного контейнера:

```shell
kubectl exec -it security-context-demo -- sh
```

Перевірте ідентичність процесу:

```shell
id
```

Вивід буде схожий на:

```none
uid=1000 gid=3000 groups=3000,4000,50000
```

Ви можете побачити, що `groups` включає ідентифікатор групи `50000`. Це тому, що користувач (`uid=1000`), який визначений в образі, належить до групи (`gid=50000`), яка визначена в `/etc/group` всередині контейнерного образу.

Перевірте `/etc/group` в контейнерному образі:

```shell
cat /etc/group
```

Ви побачите, що `uid 1000` належить до групи `50000`.

```none
...
user-defined-in-image:x:1000:
group-defined-in-image:x:50000:user-defined-in-image
```

Вийдіть з оболонки:

```shell
exit
```

{{<note>}}
_Неявно обʼєднані_ додаткові групи можуть викликати проблеми з безпекою, особливо при доступі до томів (див. [kubernetes/kubernetes#112879](https://issue.k8s.io/112879) для деталей). Щоб уникнути цього, перегляньте розділ нижче.
{{</note>}}

## Налаштування SupplementalGroups для Podʼа {#supplementalgroupspolicy}

{{< feature-state feature_gate_name="SupplementalGroupsPolicy" >}}

Цю функцію можна увімкнути, встановивши [функціональну можливість](/docs/reference/command-line-tools-reference/feature-gates/) `SupplementalGroupsPolicy` для kubelet та kube-apiserver, а також налаштувавши поле `.spec.securityContext.supplementalGroupsPolicy` для Podʼа.

Поле `supplementalGroupsPolicy` визначає політику для розрахунку додаткових груп для процесів контейнера в Podʼі. Для цього поля є два дійсних
значення:

* `Merge`: Членство в групах, визначене в `/etc/group` для основного користувача контейнера, буде обʼєднано. Це є стандартною політикою, якщо не зазначено інше.

* `Strict`: Тільки ідентифікатори груп у полях `fsGroup`, `supplementalGroups` або `runAsGroup` прикріплюються як додаткові групи для процесів контейнера. Це означає, що жодне членство в групах з `/etc/group` для основного користувача контейнера не буде обʼєднано.

Коли функція увімкнена, вона також надає ідентичність процесу, прикріплену до першого процесу контейнера в полі `.status.containerStatuses[].user.linux`. Це буде корисно для виявлення, чи прикріплені неявні ідентифікатори груп.

{{% code_sample file="pods/security/security-context-6.yaml" %}}

Цей маніфест Podʼа визначає `supplementalGroupsPolicy=Strict`. Ви можете побачити, що жодне членство в групах, визначене в `/etc/group`, не обʼєднується в додаткові групи для процесів контейнера.

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-6.yaml
```

Перевірте, що контейнер Podʼа працює:

```shell
kubectl get pod security-context-demo
```

Перевірте ідентичність процесу:

```shell
kubectl exec -it security-context-demo -- id
```

Вивід буде подібним до цього:

```none
uid=1000 gid=3000 groups=3000,4000
```

Перегляньте статус Podʼа:

```shell
kubectl get pod security-context-demo -o yaml
```

Ви можете побачити, що поле `status.containerStatuses[].user.linux` надає ідентичність процесу, прикріплену до першого процесу контейнера.

```yaml
...
status:
  containerStatuses:
  - name: sec-ctx-demo
    user:
      linux:
        gid: 3000
        supplementalGroups:
        - 3000
        - 4000
        uid: 1000
...
```

{{<note>}}
Зверніть увагу, що значення в полі `status.containerStatuses[].user.linux` є _першою прикріпленою_ ідентичністю процесу до першого процесу контейнера в контейнері. Якщо контейнер має достатні привілеї для здійснення системних викликів, повʼязаних з ідентичністю процесу (наприклад, [`setuid(2)`](https://man7.org/linux/man-pages/man2/setuid.2.html), [`setgid(2)`](https://man7.org/linux/man-pages/man2/setgid.2.html) або [`setgroups(2)`](https://man7.org/linux/man-pages/man2/setgroups.2.html) та ін.), процес контейнера може змінити свою ідентичність. Отже, _реальна_ ідентичність процесу буде динамічною.
{{</note>}}

### Реалізації {#implementations-supplementalgroupspolicy}

{{% thirdparty-content %}}

Відомо, що наступні середовища виконання контейнерів підтримують контроль додаткових груп з тонкою настройкою.

На рівні CRI:

* [containerd](https://containerd.io/), починаючи з v2.0
* [CRI-O](https://cri-o.io/), починаючи з v1.31

Ви можете перевірити, чи підтримується функція в статусі вузла.

```yaml
apiVersion: v1
kind: Node
...
status:
  features:
    supplementalGroupsPolicy: true
```

{{<note>}}
В цьому альфа-випуску (з v1.31 до v1.32), коли pod з `SupplementalGroupsPolicy=Strict` призначений до вузла, який НЕ підтримцє цю фцнкцію (напр. `.status.features.supplementalGroupsPolicy=false`), політика додаткових груп podʼа повернеться до політики `Merge` _мовчки_.

Однак, починаючи з бета-версії (v1.33), для суворішого забезпечення дотримання політики, __таке створення podʼів буде відхилено kubelet, оскільки вузол не може забезпечити дотримання зазначеної політики__. Коли ваш pod буде відхилено, ви побачите попередження `reason=SupplementalGroupsPolicyNotSupported`, як показано нижче:

```yaml
apiVersion: v1
kind: Event
...
type: Warning
reason: SupplementalGroupsPolicyNotSupported
message: "SupplementalGroupsPolicy=Strict is not supported in this node"
involvedObject:
  apiVersion: v1
  kind: Pod
  ...
```

{{</note>}}

## Налаштування політики зміни дозволів та прав власності тому для Pod {#configure-volume-permission-and-ownership-change-policy-for-pods}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Типово Kubernetes рекурсивно змінює права власності та дозволи для вмісту кожного тому так, щоб вони відповідали значенню `fsGroup`, вказаному в `securityContext` Podʼа при підключенні цього тому. Для великих томів перевірка та зміна власності та дозволів може займати багато часу, сповільнюючи запуск Podʼів. Ви можете використовувати поле `fsGroupChangePolicy` в `securityContext` для контролю способу, яким Kubernetes перевіряє та керує власністю та дозволами для тому.

**fsGroupChangePolicy** — `fsGroupChangePolicy` визначає поведінку зміни власності та дозволів тому перед тим, як він буде використаний в Pod. Це поле застосовується лише до типів томів, які підтримують контроль власності та дозволів за допомогою `fsGroup`. Це поле має два можливі значення:

* _OnRootMismatch_: Змінювати дозволи та права власності тільки у випадку, якщо дозволи та права кореневої теки не відповідають очікуваним дозволам тому. Це може допомогти скоротити час зміни власності та дозволів тому.
* _Always_: Завжди змінювати дозволи та права власності тому під час підключення.

Наприклад:

```yaml
securityContext:
  runAsUser: 1000
  runAsGroup: 3000
  fsGroup: 2000
  fsGroupChangePolicy: "OnRootMismatch"
```

{{< note >}}
Це поле не впливає на типи ефемерних томів, таких як [`secret`](/docs/concepts/storage/volumes/#secret), [`configMap`](/docs/concepts/storage/volumes/#configmap), та [`emptyDir`](/docs/concepts/storage/volumes/#emptydir).
{{< /note >}}

## Делегування зміни прав власності та дозволів тому до драйвера CSI {#delegating-volume-permission-and-ownership-change-to-csi-driver}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Якщо ви розгортаєте драйвер [Container Storage Interface (CSI)](https://github.com/container-storage-interface/spec/blob/master/spec.md), який підтримує `VOLUME_MOUNT_GROUP` `NodeServiceCapability`, процес встановлення права власності та дозволів файлу на основі `fsGroup`, вказаного в `securityContext`, буде виконуватися драйвером CSI, а не Kubernetes. У цьому випадку, оскільки Kubernetes не виконує жодної зміни права власності та дозволів, `fsGroupChangePolicy` не набуває чинності, і згідно з вказаним CSI, очікується, що драйвер монтує том з наданим `fsGroup`, що призводить до отримання тому, який є доступними для читаання/запису для `fsGroup`.

## Встановлення контексту безпеки для контейнера {#set-the-security-context-for-a-container}

Для вказання параметрів безпеки для контейнера, включіть поле `securityContext` в маніфест контейнера. Поле `securityContext` є обʼєктом [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core). Параметри безпеки, які ви вказуєте для контейнера, застосовуються тільки до окремого контейнера, і вони перевизначають налаштування, зроблені на рівні Podʼа, коли є перетин. Налаштування контейнера не впливають на томи Podʼів.

Ось файл конфігурації для Podʼа з одним контейнером. Як Pod, так і контейнер мають поле `securityContext`:

{{% code_sample file="pods/security/security-context-2.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-2.yaml
```

Перевірте, що контейнер Pod запущений:

```shell
kubectl get pod security-context-demo-2
```

Отримайте оболонку до запущеного контейнера:

```shell
kubectl exec -it security-context-demo-2 -- sh
```

У вашій оболонці перегляньте запущені процеси:

```shell
ps aux
```

Виведений результат показує, що процеси виконуються від імені користувача 2000. Це значення
`runAsUser`, вказане для контейнера. Воно перевизначає значення 1000, вказане для Pod.

```none
USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
2000         1  0.0  0.0   4336   764 ?        Ss   20:36   0:00 /bin/sh -c node server.js
2000         8  0.1  0.5 772124 22604 ?        Sl   20:36   0:00 node server.js
...
```

Вийдіть з оболонки:

```shell
exit
```

## Встановлення можливостей для контейнера {#set-capabilities-for-a-container}

За допомогою [можливостей Linux](https://man7.org/linux/man-pages/man7/capabilities.7.html), ви можете надати певні привілеї процесу, не надаючи всі привілеї користувачеві з правами root. Щоб додати або видалити можливості Linux для контейнера, включіть поле `capabilities` в розділ `securityContext` маніфесту контейнера.

Спочатку подивімося, що відбувається, коли ви не включаєте поле `capabilities`. Ось файл конфігурації, який не додає або не видаляє жодних можливостей контейнера:

{{% code_sample file="pods/security/security-context-3.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-3.yaml
```

Перевірте, що контейнер Pod запущений:

```shell
kubectl get pod security-context-demo-3
```

Отримайте оболонку до запущеного контейнера:

```shell
kubectl exec -it security-context-demo-3 -- sh
```

У вашій оболонці перегляньте запущені процеси:

```shell
ps aux
```

Виведений результат показує ідентифікатори процесів (PID) для контейнера:

```none
USER  PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root    1  0.0  0.0   4336   796 ?     Ss   18:17   0:00 /bin/sh -c node server.js
root    5  0.1  0.5 772124 22700 ?     Sl   18:17   0:00 node server.js
```

У вашій оболонці перегляньте статус для процесу 1:

```shell
cd /proc/1
cat status
```

Виведений результат показує bitmap можливостей для процесу:

```none
...
CapPrm:	00000000a80425fb
CapEff:	00000000a80425fb
...
```

Запамʼятайте bitmap можливостей, а потім вийдіть з оболонки:

```shell
exit
```

Далі, запустіть контейнер, який є такий самий, як попередній контейнер, за винятком того, що він має додаткові можливості.

Ось файл конфігурації для Pod, який запускає один контейнер. Конфігурація додає можливості `CAP_NET_ADMIN` та `CAP_SYS_TIME`:

{{% code_sample file="pods/security/security-context-4.yaml" %}}

Створіть Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/security/security-context-4.yaml
```

Отримайте оболонку до запущеного контейнера:

```shell
kubectl exec -it security-context-demo-4 -- sh
```

У вашій оболонці перегляньте можливості для процесу 1:

```shell
cd /proc/1
cat status
```

Виведений результат показує бітову карту можливостей для процесу:

```none
...
CapPrm:	00000000aa0435fb
CapEff:	00000000aa0435fb
...
```

Порівняйте можливості двох контейнерів:

```none
00000000a80425fb
00000000aa0435fb
```

У bitmap можливостей першого контейнера біти 12 і 25 не встановлені. У другому контейнері, біти 12 і 25 встановлені. Біт 12 — це `CAP_NET_ADMIN`, а біт 25 — це `CAP_SYS_TIME`. Дивіться [capability.h](https://github.com/torvalds/linux/blob/master/include/uapi/linux/capability.h) для визначень констант можливостей.

{{< note >}}
Константи можливостей Linux мають форму `CAP_XXX`. Але коли ви перелічуєте можливості у маніфесті вашого контейнера, вам необхідно пропустити частину `CAP_` константи. Наприклад, для додавання `CAP_SYS_TIME`, включіть `SYS_TIME` у ваш список можливостей.
{{< /note >}}

## Встановлення профілю Seccomp для контейнера {#set-the-seccomp-profile-for-a-container}

Щоб встановити профіль Seccomp для контейнера, включіть поле `seccompProfile` в розділ `securityContext` вашого маніфесту Pod або контейнера. Поле `seccompProfile` є обʼєктом [SeccompProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#seccompprofile-v1-core), який складається з `type` та `localhostProfile`. Допустимі варіанти для `type` включають `RuntimeDefault`, `Unconfined` та `Localhost`. `localhostProfile` повинен бути встановлений лише якщо `type: Localhost`. Він вказує шлях до попередньо налаштованого профілю на вузлі, повʼязаного з розташуванням налаштованого профілю Seccomp kubelet (налаштованого за допомогою прапорця `--root-dir`).

Ось приклад, який встановлює профіль Seccomp до стандартного профілю контейнера вузла:

```yaml
...
securityContext:
  seccompProfile:
    type: RuntimeDefault
```

Ось приклад, який встановлює профіль Seccomp до попередньо налаштованого файлу за шляхом `<kubelet-root-dir>/seccomp/my-profiles/profile-allow.json`:

```yaml
...
securityContext:
  seccompProfile:
    type: Localhost
    localhostProfile: my-profiles/profile-allow.json
```

## Налаштування профілю AppArmor для контейнера {#set-the-apparmor-profile-for-a-container}

Щоб налаштувати профіль AppArmor для контейнера, включіть поле `appArmorProfile` в секцію `securityContext` вашого контейнера. Поле `appArmorProfile` є [обʼєктом AppArmorProfile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#apparmorprofile-v1-core), що складається з `type` та `localhostProfile`. Дійсні опції для `type` включають `RuntimeDefault` (стандартно), `Unconfined` і `Localhost`. `localhostProfile` слід встановлювати тільки якщо `type` є `Localhost`. Це вказує на назву попередньо налаштованого профілю на вузлі. Профіль повинен бути завантажений на всіх вузлах, які підходять для Podʼа, оскільки ви не знаєте, де буде розгорнуто Pod. Підходи до налаштування власних профілів обговорюються в [Налаштування вузлів з профілями](/docs/tutorials/security/apparmor/#setting-up-nodes-with-profiles).

Примітка: Якщо `containers[*].securityContext.appArmorProfile.type` явно встановлено на `RuntimeDefault`, то Pod не буде допущено, якщо AppArmor не включено на вузлі. Однак, якщо `containers[*].securityContext.appArmorProfile.type` не зазначено, то стандартне значення (що також є `RuntimeDefault`) буде застосовано тільки якщо вузол має увімкнений AppArmor. Якщо вузол має вимкнений AppArmor, Pod буде допущено, але контейнер не буде обмежено профілем `RuntimeDefault`.

Ось приклад, який встановлює профіль AppArmor на стандартний профіль контейнерного середовища вузла:

```yaml
...
containers:
- name: container-1
  securityContext:
    appArmorProfile:
      type: RuntimeDefault
```

Ось приклад, який встановлює профіль AppArmor на попередньо налаштований профіль
з назвою `k8s-apparmor-example-deny-write`:

```yaml
...
containers:
- name: container-1
  securityContext:
    appArmorProfile:
      type: Localhost
      localhostProfile: k8s-apparmor-example-deny-write
```

Для отримання додаткової інформації дивіться [Обмеження доступу контейнера до ресурсів з AppArmor](/docs/tutorials/security/apparmor/).

## Призначення міток SELinux контейнеру {#assign-selinux-labels-to-a-container}

Щоб призначити мітки SELinux контейнеру, включіть поле `seLinuxOptions` в розділ `securityContext` вашого маніфесту Podʼа або контейнера. Поле `seLinuxOptions` є обʼєктом [SELinuxOptions](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#selinuxoptions-v1-core). Ось приклад, який застосовує рівень SELinux:

```yaml
...
securityContext:
  seLinuxOptions:
    level: "s0:c123,c456"
```

{{< note >}}
Для призначення міток SELinux модуль безпеки SELinux повинен бути завантажений в операційну систему хосту. На робочих вузлах Windows та Linux без підтримки SELinux це поле та будь-які описані нижче функціональні можливості SELinux не мають жодного впливу.
{{< /note >}}

### Ефективне переозначення обʼєктів SELinux в томах {#efficient-selinux-volume-relabeling}

{{< feature-state feature_gate_name="SELinuxMountReadWriteOncePod" >}}

{{< note >}}
У Kubernetes v1.27 було введено обмежену ранню форму такої поведінки, яка була застосовна тільки до томів (та PersistentVolumeClaims), які використовують режим доступу `ReadWriteOncePod`.

Kubernetes v1.33 пропонує [функціональні можливості](/docs/reference/command-line-tools-reference/feature-gates/) `SELinuxChangePolicy` та `SELinuxMount` в стані бета, щоб розширити це поліпшення продуктивності на інші види PersistentVolumeClaims, як пояснено докладніше нижче. Зважаючи на стан бета, `SELinuxMount` станадртно вимкнено.
{{< /note >}}

З вимкненною функціональною можливістю `SELinuxMount` (стандартно в Kubernetes 1.33 та попередніх виписках), контейнерне середовище стандартно рекурсивно призначає мітку SELinux для всіх файлів на всіх томах Pod. Щоб прискорити цей процес, Kubernetes може миттєво змінити мітку SELinux тому за допомогою параметра монтування `-o context=<мітка>`.

Щоб скористатися цим прискоренням, мають бути виконані всі ці умови:

* [Функціональна можливість](/docs/reference/command-line-tools-reference/feature-gates/)  `SELinuxMountReadWriteOncePod` має бути увімкнена.
* Pod повинен використовувати PersistentVolumeClaim з відповідними `accessModes` та [функціональною можливстю](/docs/reference/command-line-tools-reference/feature-gates/):
  * Або том має `accessModes: ["ReadWriteOncePod"]`, і властивість включення `SELinuxMountReadWriteOncePod` увімкнена.
  * Або том може використовувати будь-які інші режими доступу та  `SELinuxMountReadWriteOncePod`, `SELinuxChangePolicy` та `SELinuxMount` повинні бути увімкнені, а Pod мати `spec.securityContext.seLinuxChangePolicy` або nil (стандартно), або `MountOption`.
* Pod (або всі його контейнери, які використовують PersistentVolumeClaim) повинні мати встановлені параметри `seLinuxOptions`.
* Відповідний PersistentVolume повинен бути або:
  * Том, який використовує старі типи томів `iscsi`, `rbd` або `fc`.
  * Або том, який використовує драйвер CSI {{< glossary_tooltip text="CSI" term_id="csi" >}}. Драйвер CSI повинен оголосити, що він підтримує монтування з `-o context`, встановивши `spec.seLinuxMount: true` у його екземплярі CSIDriver.

Коли будь-яка з цих умов не задовольняється, переозначення SELinux відбувається іншим шляхом: контейнерне середовище рекурсивно змінює мітку SELinux для всіх inodes (файлів і тек) у томі. Якщо вказати явно, це стосується ефемерних томів Kubernetes, таких як `secret`, `configMap` та `projected`, а також усіх томів, екземпляр CSIDriver яких явно не оголошує монтування за допомогою `-o context`.

Коли використовується це прискорення, всі Podʼи, які одночасно використовують той самий відповідний том на одному вузлі, **повинні мати однакову мітку SELinux**. Pod з іншою міткою SELinux не запуститься та буде у стані `ContainerCreating`, доки всі Podʼи з іншими мітками SELinux, що використовують цей том, не будуть видалені.

{{< feature-state feature_gate_name="SELinuxChangePolicy" >}}
Для Podʼів, які хочуть відмовитися від зміни міток за допомогою параметрів монтування, вони можуть встановити `spec.securityContext.seLinuxChangePolicy` у значення `Recursive`. Це потрібно у випадку, коли декілька podʼів використовують один том на одному вузлі, але вони працюють з різними мітками SELinux, що дозволяє одночасний доступ до тома. Наприклад, привілейований pod працює з міткою `spc_t`, а непривілейований pod працює зі стандартною міткою `container_file_t`. За відсутності значення `spec.securityContext.seLinuxChangePolicy` (або зі стандартним значенням `MountOption`) на вузлі може працювати лише один з таких podʼів, інший отримує ContainerCreating з помилкою `conflicting SELinux labels of volume <назва тома>: <мітка виконуваного тома> і <мітка тома, який не може запуститися>`.

#### SELinuxWarningController

Щоб полегшити ідентифікацію Podʼів, на які вплинула зміна міток томів SELinux, у kube-controller-manager було додано новий контролер, який називається `SELinuxWarningController`. Стандартно він вимкнений і може бути увімкнений або встановленням `--controllers=*,selinux-warning-controller` [прапорець командного рядка](/docs/reference/command-line-tools-reference/kube-controller-manager/), або за допомогою параметра `genericControllerManagerConfiguration.controllers` [поле у KubeControllerManagerConfiguration](/docs/reference/config-api/kube-controller-manager-config.v1alpha1/#controlermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration). Цей контролер потребує увімкнення функціональної можливості `SELinuxChangePolicy`.

Якщо її увімкнено, контролер відстежує запущені Podʼи і виявляє, що два Podʼи використовують один і той самий том з різними мітками SELinux:

1. Він надсилає подію обом Podʼам. `kubectl describe pod <назва podʼа>` показує, що `SELinuxLabel "<мітка на podʼі>" конфліктує з podʼом <назва іншого podʼа>, який використовує той самий том, що і цей pod з SELinuxLabel "<мітка іншого podʼа>". Якщо обидва podʼи розміщено на одному вузлі, лише один з них може отримати доступ до тома`.
2. Підніміть метрику `selinux_warning_controller_selinux_volume_conflict`. Метрика містить назви томів + простори імен у якості міток для легкої ідентифікації постраждалих томів.

Адміністратор кластера може використовувати цю інформацію, щоб визначити, на які саме Podʼи впливає зміна планування, і проактивно виключити їх з оптимізації (наприклад, встановити `spec.securityContext.seLinuxChangePolicy: Recursive`).

{{< warning >}}
Ми наполегливо рекомендуємо кластерам, що використовують SELinux, увімкнути цей контролер і переконатися, що метрика `selinux_warning_controller_selinux_volume_conflict` не повідомляє про жодні конфлікти, перш ніж увімкнути функціональну можливість `SELinuxMount` або оновити його до версії, де `SELinuxMount` стандартно увімкнено.
{{< /warning >}}

#### Функціональні можливості {#feature-gates}

Наступні функціональні можливості керують поведінкою перепризначення томів SELinux:

* `SELinuxMountReadWriteOncePod`: вмикає оптимізацію для томів з `accessModes: ["ReadWriteOncePod"]`. Це дуже безпечна можливість, оскільки не може статися так, що два пристрої можуть використовувати один том з таким режимом доступу. Стандартно її увімкнено з v1.28.
* `SELinuxChangePolicy`: вмикає поле `spec.securityContext.seLinuxChangePolicy` у Pod і повʼязаний з ним SELinuxWarningController у kube-controller-manager. Ця функція може бути використана перед увімкненням `SELinuxMount` для перевірки Podʼів, запущених на кластері, і для проактивного виключення Podʼів з оптимізації. Ця функція вимагає увімкнення `SELinuxMountReadWriteOncePod`. Це бета-версія і є стандартно увімкненою у версії 1.33.
* `SELinuxMount` вмикає оптимізацію для всіх допустимих томів. Оскільки це може порушити роботу наявних робочих навантажень, ми рекомендуємо спочатку увімкнути `SELinuxChangePolicy` + SELinuxWarningController, щоб перевірити вплив змін. Ця функціональна можливість вимагає увімкнення `SELinuxMountReadWriteOncePod` і `SELinuxChangePolicy`. Це бета-версія, однак вона стандартно вимкнена у 1.33.

## Управління доступом до файлової системи `/proc` {#proc-access}

{{< feature-state feature_gate_name="ProcMountType" >}}

Для середовищ виконання, які слідують специфікації виконання OCI, контейнери типово запускаються у режимі, де є кілька шляхів, які промасковані та доступні тільки для читання. Результатом цього є те, що в межах простору імен монтування контейнера присутні ці шляхи, і вони можуть працювати подібно до того, якби контейнер був ізольованим хостом, але процес контейнера не може записувати до них. Список промаскованих і доступних тільки для читання шляхів такий:

* Промасковані шляхи:
  * `/proc/asound`
  * `/proc/acpi`
  * `/proc/kcore`
  * `/proc/keys`
  * `/proc/latency_stats`
  * `/proc/timer_list`
  * `/proc/timer_stats`
  * `/proc/sched_debug`
  * `/proc/scsi`
  * `/sys/firmware`
  * `/sys/devices/virtual/powercap`

* Шляхи доступні тільки для читання:
  * `/proc/bus`
  * `/proc/fs`
  * `/proc/irq`
  * `/proc/sys`
  * `/proc/sysrq-trigger`


Для деяких Podʼів вам може знадобитися обійти стандартний шлях маскування. Найбільш поширений контекст, коли це потрібно, — це спроба запуску контейнерів у межах контейнера Kubernetes (у межах Podʼа).

Поле `procMount` в `securityContext` дозволяє користувачеві запитати, щоб `/proc` контейнера був `Unmasked`, або міг бути підмонтований для читання-запису контейнерним процесом. Це також стосується `/sys/firmware`, який не знаходиться в `/proc`.

```yaml
...
securityContext:
  procMount: Unmasked
```

{{< note >}}
Встановлення `procMount` в Unmasked потребує, щоб значення `spec.hostUsers` в специфікації Pod було `false`. Іншими словами: контейнер, який бажає мати Unmasked `/proc` або Unmasked `/sys`, також повинен бути у [просторі імен користувача](/docs/concepts/workloads/pods/user-namespaces/). У версіях Kubernetes v1.12 по v1.29 це вимога не дотримувалася.
{{< /note >}}

## Обговорення {#discussion}

Контекст безпеки для Pod застосовується до Контейнерів Pod і також до Томів Pod при необхідності. Зокрема, `fsGroup` та `seLinuxOptions` застосовуються до Томів наступним чином:

* `fsGroup`: Томи, які підтримують управління власністю, модифікуються так, щоб бути власністю та доступними для запису за GID, вказаним у `fsGroup`. Докладніше див. [Документ із проєктування управління власністю томів](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md).

* `seLinuxOptions`: Томи, які підтримують мітку SELinux, переозначаються так, щоб бути доступними за міткою, вказаною у `seLinuxOptions`. Зазвичай вам потрібно лише встановити розділ `level`. Це встановлює мітку [Multi-Category Security (MCS)](https://selinuxproject.org/page/NB_MLS), яку отримують всі Контейнери у Pod, а також Томи.

{{< warning >}}
Після вказання мітки MCS для Pod всі Pod з такою міткою можуть отримати доступ до Тома. Якщо вам потрібен захист між Podʼами, вам слід призначити унікальну мітку MCS для кожного Pod.
{{< /warning >}}

## Очищення {#clean-up}

Видаліть Pod:

```shell
kubectl delete pod security-context-demo
kubectl delete pod security-context-demo-2
kubectl delete pod security-context-demo-3
kubectl delete pod security-context-demo-4
```

## {{% heading "whatsnext" %}}

* [PodSecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritycontext-v1-core)
* [SecurityContext](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#securitycontext-v1-core)
* [Посібник з налаштування втулків CRI](https://github.com/containerd/containerd/blob/main/docs/cri/config.md)
* [Документ проєктування контекстів безпеки](https://git.k8s.io/design-proposals-archive/auth/security_context.md)
* [Документ проєктування управління власністю](https://git.k8s.io/design-proposals-archive/storage/volume-ownership-management.md)
* [Допуск PodSecurity](/docs/concepts/security/pod-security-admission/)
* [Документ проєктування AllowPrivilegeEscalation](https://git.k8s.io/design-proposals-archive/auth/no-new-privs.md)
* Для отримання додаткової інформації про механізми безпеки в Linux дивіться [Огляд функцій безпеки ядра Linux](https://www.linux.com/learn/overview-linux-kernel-security-features) (Примітка: деяка інформація може бути застарілою)
* Дізнайтеся більше про [Простори імен користувачів](/docs/concepts/workloads/pods/user-namespaces/) для Linux контейнерів.
* [Промасковані шляхи в специфікації OCI Runtime](https://github.com/opencontainers/runtime-spec/blob/f66aad47309/config-linux.md#masked-paths)
