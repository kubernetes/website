---

title: Створення Podʼа Windows HostProcess
content_type: task
weight: 50
min-kubernetes-server-version: 1.23
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Windows HostProcess контейнери дозволяють вам запускати контейнеризовані робочі навантаження на хості Windows. Ці контейнери працюють як звичайні процеси, але мають доступ до мережевого простору імен хосту, сховища та пристроїв, коли надані відповідні права користувача. Контейнери HostProcess можуть бути використані для розгортання мережевих втулків, сховищ конфігурацій, пристроїв, kube-proxy та інших компонентів на вузлах Windows без потреби у власних проксі або безпосереднього встановлення служб хосту.

Адміністративні завдання, такі як встановлення патчів безпеки, збір подій логів тощо, можна виконувати без потреби входу операторів кластера на кожен вузол Windows. Контейнери HostProcess можуть працювати як будь-який користувач, що доступний на хості або в домені машини хосту, що дозволяє адміністраторам обмежити доступ до ресурсів через дозволи користувача. Хоча і не підтримуються ізоляція файлової системи або процесу, при запуску контейнера на хості створюється новий том, щоб надати йому чисте та обʼєднане робоче середовище. Контейнери HostProcess також можуть бути побудовані на базі наявних образів базової системи Windows і не успадковують ті ж [вимоги сумісності](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility) як контейнери Windows server, що означає, що версія базового образу не повинна відповідати версії хосту. Однак рекомендується використовувати ту ж версію базового образу, що й ваші робочі навантаження контейнерів Windows Server, щоб уникнути зайвого використання місця на вузлі. Контейнери HostProcess також підтримують [монтування томів](#volume-mounts) всередині тома контейнера.

### Коли варто використовувати контейнери Windows HostProcess? {#when-shoud-i-use-a-windows-hostprocess-container}

- Коли потрібно виконати завдання, які потребують мережевого простору імен хосту. Контейнери HostProcess мають доступ до мережевих інтерфейсів хосту та IP-адрес.
- Вам потрібен доступ до ресурсів на хості, таких як файлова система, події логів тощо.
- Встановлення конкретних драйверів пристроїв або служб Windows.
- Обʼєднання адміністративних завдань та політик безпеки. Це зменшує ступінь привілеїв, які потрібні вузлам Windows.

## {{% heading "prerequisites" %}}

<!-- change this when graduating to stable -->

Цей посібник стосується конкретно Kubernetes v{{< skew currentVersion >}}. Якщо ви використовуєте іншу версію Kubernetes, перевірте документацію для цієї версії Kubernetes.

У Kubernetes {{< skew currentVersion >}} контейнери HostProcess є типово увімкненими. kubelet буде спілкуватися з containerd безпосередньо, передаючи прапорець hostprocess через CRI. Ви можете використовувати останню версію containerd (v1.6+) для запуску контейнерів HostProcess. [Як встановити containerd](/docs/setup/production-environment/container-runtimes/#containerd).

## Обмеження {#limitations}

Ці обмеження стосуються Kubernetes v{{< skew currentVersion >}}:

- Контейнери HostProcess вимагають {{< glossary_tooltip text="середовища виконання контейнерів" term_id="container-runtime" >}} containerd 1.6 або вище, рекомендується використовувати containerd 1.7.
- Podʼи HostProcess можуть містити лише контейнери HostProcess. Це поточне обмеження ОС Windows; непривілейовані контейнери Windows не можуть спільно використовувати vNIC з простором імен IP хосту.
- Контейнери HostProcess запускаються як процес на хості та не мають жодного рівня ізоляції, окрім обмежень ресурсів, накладених на обліковий запис користувача HostProcess. Ізоляція ні файлової системи, ні ізоляції Hyper-V не підтримуються для контейнерів HostProcess.
- Монтування томів підтримуються і монтуватимуться як томом контейнера. Див. [Монтування томів](#volume-mounts)
- Стандартно для контейнерів HostProcess доступний обмежений набір облікових записів користувачів хосту. Див. [Вибір облікового запису користувача](#choosing-a-user-account).
- Обмеження ресурсів (диск, памʼять, кількість процесорів) підтримуються так само як і процеси на хості.
- Як іменовані канали, так і сокети Unix-домену **не** підтримуються і замість цього слід отримувати доступ до них через їх шлях на хості (наприклад, \\\\.\\pipe\\\*)

## Вимоги до конфігурації HostProcess Pod {#hostprocess-pod-configuration-requirements}

Для активації Windows HostProcess Pod необхідно встановити відповідні конфігурації у конфігурації безпеки Podʼа. З усіх політик, визначених у [Стандартах безпеки Pod](/docs/concepts/security/pod-security-standards), HostProcess Podʼи заборонені за базовою та обмеженою політиками. Тому рекомендується, щоб HostProcess Podʼи працювали відповідно до привілейованого профілю.

Під час роботи з привілейованою політикою, ось конфігурації, які потрібно встановити для активації створення HostProcess Pod:

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
        <p>Контейнери HostProcess Podʼи повинні використовувати мережевий простір хоста.</p>
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

Контейнери HostProcess підтримують можливість монтування томів у просторі томів контейнера. Поведінка монтування томів відрізняється залежно від версії контейнерного середовища containerd, яке використовується на вузлі.

### Containerd v1.6 {#containerd-v1-6}

Застосунки, що працюють усередині контейнера, можуть отримувати доступ до підключених томів безпосередньо за допомогою відносних або абсолютних шляхів. Під час створення контейнера встановлюється змінна середовища `$CONTAINER_SANDBOX_MOUNT_POINT`, яка містить абсолютний шлях хосту до тому контейнера. Відносні шляхи базуються на конфігурації `.spec.containers.volumeMounts.mountPath`.

Для доступу до токенів службового облікового запису (наприклад) у контейнері підтримуються такі структури шляхів:

- `.\var\run\secrets\kubernetes.io\serviceaccount\`
- `$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

### Containerd v1.7 (та новіші версії) {#containerd-v1-7-and-greater}

Застосунки, які працюють усередині контейнера, можуть отримувати доступ до підключених томів безпосередньо через вказаний `mountPath` тому (аналогічно Linux і не-HostProcess контейнерам Windows).

Для забезпечення зворотної сумісності зі старими версіями, доступ до томів також може бути здійснений через використання тих самих відносних шляхів, які були налаштовані у containerd v1.6.

Наприклад, для доступу до токенів службового облікового запису усередині контейнера ви можете використовувати один із таких шляхів:

- `c:\var\run\secrets\kubernetes.io\serviceaccount`
- `/var/run/secrets/kubernetes.io/serviceaccount/`
- `$CONTAINER_SANDBOX_MOUNT_POINT\var\run\secrets\kubernetes.io\serviceaccount\`

## Обмеження ресурсів {#resource-limits}

Обмеження ресурсів (диск, памʼять, кількість CPU) застосовуються до задачі і є загальними для всієї задачі. Наприклад, при обмеженні в 10 МБ памʼяті, памʼять, виділена для будь-якого обʼєкта задачі HostProcess, буде обмежена 10 МБ. Це така ж поведінка, як і в інших типах контейнерів Windows. Ці обмеження вказуються так само як і зараз для будь-якого середовища виконання контейнерів або оркестрування, яке використовується. Єдина відмінність полягає у розрахунку використання дискових ресурсів для відстеження ресурсів через відмінності у способі
ініціалізації контейнерів HostProcess.

## Вибір облікового запису користувача {#choosing-a-user-account}

### Системні облікові записи {#system-accounts}

Типово контейнери HostProcess підтримують можливість запуску з одного з трьох підтримуваних облікових записів служб Windows:

- **[LocalSystem](https://docs.microsoft.com/windows/win32/services/localsystem-account)**
- **[LocalService](https://docs.microsoft.com/windows/win32/services/localservice-account)**
- **[NetworkService](https://docs.microsoft.com/windows/win32/services/networkservice-account)**

Вам слід вибрати відповідний обліковий запис служби Windows для кожного контейнера HostProcess, спираючись на обмеження ступеня привілеїв, щоб уникнути випадкових (або навіть зловмисних) пошкоджень хосту. Обліковий запис служби LocalSystem має найвищий рівень привілеїв серед трьох і повинен використовуватися лише у разі абсолютної необхідності. Де це можливо, використовуйте обліковий запис служби LocalService, оскільки він має найнижчий рівень привілеїв серед цих трьох варіантів.

### Локальні облікові записи {#local-accounts}

Якщо налаштовано, контейнери HostProcess також можуть запускатися як локальні облікові записи користувачів, що дозволяє операторам вузлів надавати деталізований доступ до робочих навантажень.

Для запуску контейнерів HostProcess як локального користувача, спершу на вузлі має бути створена локальна група користувачів, і імʼя цієї локальної групи користувачів повинно бути вказане у полі `runAsUserName` у Deployment. Перед ініціалізацією контейнера HostProcess має бути створено новий **ефемерний** локальний обліковий запис користувача та приєднано його до вказаної групи користувачів, з якої запускається контейнер. Це надає кілька переваг, включаючи уникнення необхідності управління паролями для локальних облікових записів користувачів. Початковий контейнер HostProcess, що працює як службовий обліковий запис, може бути використаний для підготовки груп користувачів для подальших контейнерів HostProcess.

{{< note >}}
Запуск контейнерів HostProcess як локальних облікових записів користувачів вимагає containerd v1.7+
{{< /note >}}

Приклад:

1. Створіть локальну групу користувачів на вузлі (це може бути зроблено в іншому контейнері HostProcess).

    ```cmd
    net localgroup hpc-localgroup /add
    ```

1. Надайте доступ до потрібних ресурсів на вузлі локальній групі користувачів. Це можна зробити за допомогою інструментів, таких як [icacls](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls).

1. Встановіть `runAsUserName` на імʼя локальної групи користувачів для Podʼа або окремих контейнерів.

    ```yaml
    securityContext:
      windowsOptions:
        hostProcess: true
        runAsUserName: hpc-localgroup
    ```

1. Заплануйте Pod!

## Базовий образ для контейнерів HostProcess {#base-image-for-hostprocess-containers}

Контейнери HostProcess можуть бути побудовані з будь-яких наявних [базових образів контейнерів Windows](https://learn.microsoft.com/virtualization/windowscontainers/manage-containers/container-base-images).

Крім того, був створений новий базовий образ спеціально для контейнерів HostProcess! Для отримання додаткової інформації перегляньте [проєкт windows-host-process-containers-base-image на github](https://github.com/microsoft/windows-host-process-containers-base-image#overview).

## Розвʼязання проблем з контейнерами HostProcess {#troubleshooting-hostprocess-containers}

- Контейнери HostProcess не запускаються, помилка `failed to create user process token: failed to logon user: Access is denied.: unknown`.

  Переконайтеся, що containerd працює як службовий обліковий запис `LocalSystem` або `LocalService`. Облікові записи користувачів (навіть адміністраторські облікові записи) не мають дозволів на створення токенів входу для будь-яких підтримуваних [облікових записів користувачів](#choosing-a-user-account).
