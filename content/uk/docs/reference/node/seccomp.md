---
content_type: reference
title: Seccomp та Kubernetes
weight: 80
---
<!-- overview -->

Seccomp (secure computing mode) — це функція ядра Linux, яка існує з версії 2.6.12. Її можна використовувати для обмеження привілеїв процесу шляхом ізоляції, обмежуючи системні виклики, які він може здійснювати з простору користувача в ядро. Kubernetes дозволяє автоматично застосовувати профілі seccomp, завантажені на {{< glossary_tooltip text="вузол" term_id="node" >}}, до ваших Podʼів і контейнерів.

## Поля Seccomp {#seccomp-fields}

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

Існує чотири способи вказати профіль seccomp для {{< glossary_tooltip text="Podʼа" term_id="pod" >}}:

- для всього Podʼа, використовуючи [`spec.securityContext.seccompProfile`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
- для окремого контейнера, використовуючи [`spec.containers[*].securityContext.seccompProfile`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
- для (перезапускного / sidecar) init-контейнера, використовуючи [`spec.initContainers[*].securityContext.seccompProfile`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
- для [ефемерного контейнера](/docs/concepts/workloads/pods/ephemeral-containers), використовуючи [`spec.ephemeralContainers[*].securityContext.seccompProfile`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-2)

{{% code_sample file="pods/security/seccomp/fields.yaml" %}}

Pod у прикладі вище працює як `Unconfined`, тоді як `ephemeral-container` та `init-container` конкретно визначають `RuntimeDefault`. Якби ефемерний або init-контейнер не встановили явно поле `securityContext.seccompProfile`, тоді значення успадковується від Pod. Це ж стосується і контейнера, який використовує локальний профіль `my-profile.json`.

Загалом, поля контейнерів (включаючи ефемерні) мають вищий пріоритет, ніж значення на рівні Pod, а контейнери, які не задають поле seccomp, успадковують профіль від Pod.

{{< note >}}
Неможливо застосувати профіль seccomp до Podʼа або контейнера, що працює з налаштуванням `privileged: true` у `securityContext` контейнера. Привілейовані контейнери завжди працюють у режимі `Unconfined`.
{{< /note >}}

Наступні значення можливі для поля `seccompProfile.type`:

`Unconfined`
: Навантаження працює без будь-яких обмежень seccomp.

`RuntimeDefault`
: Застосовується стандартний профіль seccomp, визначений {{< glossary_tooltip text="середовищем виконання контейнерів" term_id="container-runtime" >}}. Стандартні профілі прагнуть забезпечити надійний набір параметрів безпеки, зберігаючи функціональність навантаження. Можливо, що стандартні профілі відрізняються між різними середовищами виконання контейнерів та їх версіями, наприклад, порівнюючи профілі {{< glossary_tooltip text="CRI-O" term_id="cri-o" >}} та {{< glossary_tooltip text="containerd" term_id="containerd" >}}.

`Localhost`
: Застосовується `localhostProfile`, який має бути доступний на диску вузла (у Linux це `/var/lib/kubelet/seccomp`). Доступність профілю seccomp перевіряється {{< glossary_tooltip text="середовищем виконання контейнерів" term_id="container-runtime" >}} під час створення контейнера. Якщо профіль не існує, то створення контейнера завершиться з помилкою `CreateContainerError`.

### Профілі `Localhost` {#localhost-profiles}

Профілі Seccomp — це JSON-файли, що відповідають схемі, визначеній [специфікацією середовища виконання OCI](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp). Профіль, як правило, визначає дії на основі відповідних системних викликів, але також дозволяє передавати конкретні значення як аргументи до системних викликів. Наприклад:

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "syscalls": [
    {
      "names": [
        "adjtimex",
        "alarm",
        "bind",
        "waitid",
        "waitpid",
        "write",
        "writev"
      ],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

`defaultAction` у профілі вище визначено як `SCMP_ACT_ERRNO` і буде повернуто як резервне для дій, визначених у syscalls. Помилка визначена як код `38` через поле 'defaultErrnoRet'.

Наступні дії зазвичай можливі:

`SCMP_ACT_ERRNO`
: Повернення вказаного коду помилки.

`SCMP_ACT_ALLOW`
: Дозвіл на виконання системного виклику.

`SCMP_ACT_KILL_PROCESS`
: Завершення процесу.

`SCMP_ACT_KILL_THREAD` і `SCMP_ACT_KILL`
: Завершення тільки потоку.

`SCMP_ACT_TRAP`
: Генерація сигналу `SIGSYS`.

`SCMP_ACT_NOTIFY` і `SECCOMP_RET_USER_NOTIF`
: Сповіщення простору користувача.

`SCMP_ACT_TRACE`
: Сповіщення процесу трасування з вказаним значенням.

`SCMP_ACT_LOG`
: Дозвіл на виконання системного виклику після того, як дія була зареєстрована в syslog або auditd.

Деякі дії, такі як `SCMP_ACT_NOTIFY` або `SECCOMP_RET_USER_NOTIF`, можуть бути не підтримувані залежно від середовища виконання контейнера, середовища виконання OCI або версії ядра Linux. Можуть бути також додаткові обмеження, наприклад, що `SCMP_ACT_NOTIFY` не може використовуватися як `defaultAction` або для певних системних викликів, таких як `write`. Усі ці обмеження визначаються або середовищем виконання OCI ([runc](https://github.com/opencontainers/runc),
[crun](https://github.com/containers/crun)) або [libseccomp](https://github.com/seccomp/libseccomp).

Масив JSON `syscalls` містить список об’єктів, що посилаються на системні виклики за їхніми відповідними `names`. Наприклад, дія `SCMP_ACT_ALLOW` може бути використана для створення білого списку дозволених системних викликів, як показано у прикладі вище. Також можна визначити інший список, використовуючи дію `SCMP_ACT_ERRNO`, але з іншим значенням повернення (`errnoRet`).

Також можливо вказати аргументи (`args`), що передаються до певних системних викликів. Більше інформації про ці розширені випадки використання можна знайти в [специфікації середовища виконання OCI](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp) та [документації ядра Linux щодо Seccomp](https://www.kernel.org/doc/Documentation/prctl/seccomp_filter.txt).

## Додаткове читання

- [Обмеження системних викликів контейнера за допомогою seccomp](/docs/tutorials/security/seccomp/)
- [Стандарти безпеки Pod](/docs/concepts/security/pod-security-standards/)
