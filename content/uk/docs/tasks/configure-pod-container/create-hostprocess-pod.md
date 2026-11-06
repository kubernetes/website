---
title: Створення Podʼа Windows HostProcess
content_type: task
weight: 50
min-kubernetes-server-version: 1.23
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Контейнери Windows HostProcess дають змогу запускати контейнеризовані робочі навантаження на хості Windows. Ці контейнери працюють як звичайні процеси, але мають доступ до мережевого простору імен, сховища та пристроїв хоста, коли їм надано відповідні привілеї користувача. Контейнери HostProcess можна використовувати для розгортання мережевих втулків, конфігурацій сховища, втулків пристроїв, kube-proxy та інших компонентів на вузлах Windows без потреби в окремих проксі чи безпосереднього встановлення сервісів хоста.

Адміністративні завдання, як-от встановлення патчів безпеки, збирання журналів подій тощо, можна виконувати без потреби входу операторів кластера на кожен вузол Windows. Контейнери HostProcess можуть працювати від імені будь-якого користувача, доступного на хості або в домені хоста, що дає змогу адміністраторам обмежувати доступ до ресурсів через дозволи користувачів. Хоча ізоляція файлової системи чи процесів не підтримується, під час запуску контейнера на хості створюється новий том, щоб надати йому чисте й консолідоване робоче середовище. Контейнери HostProcess також можна збирати на основі наявних базових образів Windows, і вони не успадковують тих самих [вимог сумісності](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility), що й контейнери Windows Server, тобто версія базових образів не мусить збігатися з версією хоста. Однак рекомендується використовувати ту саму версію базового образу, що й для ваших робочих навантажень контейнерів Windows Server, щоб на вузлі не було невикористовуваних образів, які займають місце. Контейнери HostProcess також підтримують [монтування томів](#volume-mounts) у томі контейнера.

### Коли використовувати контейнер Windows HostProcess? {#when-should-i-use-a-windows-hostprocess-container}

- Коли потрібно виконувати завдання, які потребують мережевого простору імен хоста. Контейнери HostProcess мають доступ до мережевих інтерфейсів та IP-адрес хоста.
- Вам потрібен доступ до ресурсів хоста, таких як файлова система, журнали подій тощо.
- Встановлення певних драйверів пристроїв або служб Windows.
- Обʼєднання адміністративних завдань та політик безпеки. Це зменшує ступінь привілеїв, які потрібні вузлам Windows.

## {{% heading "prerequisites" %}} {#before-you-begin}

<!-- change this when graduating to stable -->

Цей посібник стосується Kubernetes v{{< skew currentVersion >}}. Якщо ви використовуєте не Kubernetes v{{< skew currentVersion >}}, перегляньте документацію для своєї версії Kubernetes.

У Kubernetes {{< skew currentVersion >}} можливість контейнерів HostProcess стандартно увімкнена. kubelet взаємодіє з containerd безпосередньо, передаючи прапорець hostprocess через CRI. Для запуску контейнерів HostProcess можна використовувати найновішу версію containerd (v1.6+). [Як встановити containerd.](/docs/setup/production-environment/container-runtimes/#containerd)

## Обмеження {#limitations}

Ці обмеження стосуються Kubernetes v{{< skew currentVersion >}}:

- Контейнерам HostProcess потрібне {{< glossary_tooltip text="середовище виконання контейнерів" term_id="container-runtime" >}} containerd 1.6 або новіше, рекомендовано containerd 1.7.
- Podʼи HostProcess можуть містити лише контейнери HostProcess. Це поточне обмеження ОС Windows; непривілейовані контейнери Windows не можуть спільно використовувати vNIC з простором імен IP хоста.
- Контейнери HostProcess працюють як процес на хості й не мають жодної ізоляції, крім обмежень ресурсів, накладених на обліковий запис користувача HostProcess. Ні ізоляція файлової системи, ні ізоляція Hyper-V для контейнерів HostProcess не підтримуються.
- Монтування томів підтримується, томи монтуються в томі контейнера. Дивіться [Монтування томів](#volume-mounts)
- Стандартно для контейнерів HostProcess доступний обмежений набір облікових записів користувачів хоста. Дивіться [Вибір облікового запису користувача](#choosing-a-user-account).
- Обмеження ресурсів (диск, памʼять, кількість CPU) підтримуються так само, як для процесів на хості.
- Як іменовані канали, так і сокети Unix-домену **не** підтримуються і замість цього слід отримувати доступ до них через їх шлях на хості (наприклад, \\\\.\\pipe\\\*)

## Вимоги до конфігурації Podʼа HostProcess {#hostprocess-pod-configuration-requirements}

Щоб увімкнути Pod Windows HostProcess, потрібно встановити правильні налаштування в конфігурації безпеки Podʼа. Серед політик, визначених у [стандартах безпеки Podʼів](/docs/concepts/security/pod-security-standards), Podʼи HostProcess заборонені політиками baseline і restricted. Тому рекомендується, щоб Podʼи HostProcess працювали відповідно до профілю privileged.

Під час роботи з політикою privileged для створення Podʼа HostProcess потрібно встановити такі налаштування:

<table>
  <caption style="display: none">Специфікація привілейованої політики</caption>
  <thead>
    <tr>
      <th>Елемент</th>
      <th>Політика</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="white-space: nowrap"><a href="/uk/docs/concepts/security/pod-security-standards"><tt>securityContext.windowsOptions.hostProcess</tt></a></td>
      <td>
        <p>Windows Podʼи надають можливість запуску <a href="/uk/docs/tasks/configure-pod-container/create-hostprocess-pod"> контейнерів HostProcess</a>, які дозволяють привілейований доступ до вузла Windows. </p>
        <p><strong>Дозволені значення</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/uk/docs/concepts/security/pod-security-standards"><tt>hostNetwork</tt></a></td>
      <td>
        <p>Podʼи, що містять контейнери HostProcess, мають використовувати мережевий простір імен хоста.</p>
        <p><strong>Дозволені значення</strong></p>
        <ul>
          <li><code>true</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/uk/docs/tasks/configure-pod-container/configure-runasusername/"><tt>securityContext.windowsOptions.runAsUserName</tt></a></td>
      <td>
        <p>Необхідно вказати, яким користувачем має виконуватися контейнер HostProcess в специфікації Podʼа.</p>
        <p><strong>Дозволені значення</strong></p>
        <ul>
          <li><code>NT AUTHORITY\SYSTEM</code></li>
          <li><code>NT AUTHORITY\Local service</code></li>
          <li><code>NT AUTHORITY\NetworkService</code></li>
          <li>Назви локальних груп користувачів (див. нижче)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td style="white-space: nowrap"><a href="/uk/docs/concepts/security/pod-security-standards"><tt>runAsNonRoot</tt></a></td>
      <td>
        <p>Оскільки контейнери HostProcess мають привілейований доступ до хоста, поле <tt>runAsNonRoot</tt> не може бути встановлене в true.</p>
        <p><strong>Дозволені значення</strong></p>
        <ul>
          <li>Undefined/Nil</li>
          <li><code>false</code></li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

### Приклад маніфесту (частково) {#manifest-example}

```yaml
spec:
  securityContext:
    windowsOptions:
      hostProcess: true
      runAsUserName: "NT AUTHORITY\\Local service"
  hostNetwork: true
  containers:
  - name: test
    image: image1:latest
    command:
      - ping
      - -t
      - 127.0.0.1
  nodeSelector:
    "kubernetes.io/os": windows
```

## Монтування томів {#volume-mounts}

Контейнери HostProcess підтримують монтування томів у просторі томів контейнера. Поведінка монтування томів залежить від версії середовища виконання containerd на вузлі.

### Containerd v1.6 {#containerd-v1-6}

Застосунки, що працюють у контейнері, можуть звертатися до змонтованих томів безпосередньо за відносними або абсолютними шляхами. Під час створення контейнера встановлюється змінна середовища `$CONTAINER_SANDBOX_MOUNT_POINT`, яка містить абсолютний шлях на хості до тому контейнера. Відносні шляхи ґрунтуються на конфігурації `.spec.containers.volumeMounts.mountPath`.

Для доступу до токенів службового облікового запису (наприклад) у контейнері підтримуються такі структури шляхів:

- `.\var\run\secrets\kubernetes.io\serviceaccount\`
- `$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

### Containerd v1.7 (та новіші версії) {#containerd-v1-7-and-greater}

Застосунки, що працюють у контейнері, можуть звертатися до змонтованих томів безпосередньо за `mountPath`, указаним у volumeMount (так само, як контейнери Linux і контейнери Windows, що не є HostProcess).

Для зворотної сумісності до томів також можна звертатися за тими самими відносними шляхами, що налаштовуються containerd v1.6.

Наприклад, для доступу до токенів службового облікового запису усередині контейнера ви можете використовувати один із таких шляхів:

- `c:\var\run\secrets\kubernetes.io\serviceaccount`
- `/var/run/secrets/kubernetes.io/serviceaccount/`
- `$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

## Обмеження ресурсів {#resource-limits}

Обмеження ресурсів (диск, памʼять, кількість CPU) застосовуються до job-обʼєкта й діють у межах усього job. Наприклад, з обмеженням 10MB памʼять, виділена для будь-якого job-обʼєкта HostProcess, буде обмежена 10MB. Така сама поведінка, як і в інших типах контейнерів Windows. Ці обмеження задаються так само, як зараз для будь-якого оркестратора чи середовища виконання, що використовується. Єдина відмінність — у розрахунку використання дискових ресурсів для відстеження ресурсів через відмінності в способі початкового запуску контейнерів HostProcess.

## Вибір облікового запису користувача {#choosing-a-user-account}

### Системні облікові записи {#system-accounts}

Стандартно контейнери HostProcess можуть працювати від імені одного з трьох підтримуваних облікових записів служб Windows:

- **[LocalSystem](https://docs.microsoft.com/windows/win32/services/localsystem-account)**
- **[LocalService](https://docs.microsoft.com/windows/win32/services/localservice-account)**
- **[NetworkService](https://docs.microsoft.com/windows/win32/services/networkservice-account)**

Для кожного контейнера HostProcess слід вибрати відповідний обліковий запис служби Windows, прагнучи обмежити ступінь привілеїв, щоб уникнути випадкового (або навіть зловмисного) пошкодження хоста. Обліковий запис служби LocalSystem має найвищий рівень привілеїв із трьох і його слід використовувати лише в разі крайньої потреби. Де можливо, використовуйте обліковий запис служби LocalService, оскільки він має найменше привілеїв із трьох варіантів.

### Локальні облікові записи {#local-accounts}

Якщо це налаштовано, контейнери HostProcess також можуть працювати від імені локальних облікових записів користувачів, що дає змогу операторам вузлів надавати робочим навантаженням детально налаштований доступ.

Щоб запускати контейнери HostProcess від імені локального користувача, спершу на вузлі потрібно створити локальну групу користувачів, а назву цієї групи вказати в полі `runAsUserName` у розгортанні. Перед ініціалізацією контейнера HostProcess створюється новий **ефемерний** локальний обліковий запис користувача, який приєднується до вказаної групи і від імені якого запускається контейнер. Це дає низку переваг, зокрема усуває потребу керувати паролями локальних облікових записів. Початковий контейнер HostProcess, що працює від імені облікового запису служби, можна використати для підготовки груп користувачів для подальших контейнерів HostProcess.

{{< note >}}
Запуск контейнерів HostProcess від імені локальних облікових записів користувачів потребує containerd v1.7+
{{< /note >}}

Приклад:

1. Створіть локальну групу користувачів на вузлі (це можна зробити в іншому контейнері HostProcess).

    ```cmd
    net localgroup hpc-localgroup /add
    ```

1. Надайте доступ до потрібних ресурсів на вузлі локальній групі користувачів. Це можна зробити за допомогою інструментів, таких як [icacls](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls).

1. Встановіть для Podʼа або окремих контейнерів значення `runAsUserName`, що дорівнює назві локальної групи користувачів.

    ```yaml
    securityContext:
      windowsOptions:
        hostProcess: true
        runAsUserName: hpc-localgroup
    ```

1. Заплануйте Pod!

## Базовий образ для контейнерів HostProcess {#base-image-for-hostprocess-containers}

Контейнери HostProcess можна збирати з будь-яких наявних [базових образів контейнерів Windows](https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images).

Крім того, створено новий базовий образ спеціально для контейнерів HostProcess! Докладніше дивіться [проєкт windows-host-process-containers-base-image на GitHub](https://github.com/microsoft/windows-host-process-containers-base-image#overview).

## Усунення несправностей контейнерів HostProcess {#troubleshooting-hostprocess-containers}

- Контейнери HostProcess не запускаються з помилкою `failed to create user process token: failed to logon user: Access is denied.: unknown`

  Переконайтеся, що containerd працює від імені облікового запису служби `LocalSystem` або `LocalService`. Облікові записи користувачів (навіть облікові записи адміністраторів) не мають дозволів створювати токени входу для будь-якого з підтримуваних [облікових записів користувачів](#choosing-a-user-account).
