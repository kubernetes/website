---
title: Налаштування GMSA для Podʼів і контейнерів Windows
content_type: task
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Ця сторінка показує, як налаштувати [Group Managed Service Accounts](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA) для Podʼів і контейнерів, які запускатимуться на вузлах Windows. Group Managed Service Accounts — це особливий тип облікового запису Active Directory, який забезпечує автоматичне керування паролями, спрощене керування іменами принципалів служб (SPN) і можливість делегувати керування іншим адміністраторам на кількох серверах.

У Kubernetes специфікації облікових даних GMSA налаштовуються в межах усього кластера Kubernetes як власні ресурси (Custom Resources). Podʼи Windows, а також окремі контейнери в Podʼі можна налаштувати на використання GMSA для доменних функцій (наприклад, автентифікації Kerberos) під час взаємодії з іншими службами Windows.

## {{% heading "prerequisites" %}} {#before-you-begin}

Вам потрібен кластер Kubernetes, а інструмент командного рядка `kubectl` має бути налаштований для взаємодії з вашим кластером. Очікується, що кластер має робочі вузли Windows. Цей розділ описує набір початкових кроків, які потрібно виконати один раз для кожного кластера:

### Встановлення CRD для GMSACredentialSpec {#install-the-gmsacredentialspec-crd}

[CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)(CRD) для ресурсів специфікацій облікових даних GMSA потрібно налаштувати в кластері, щоб визначити тип власного ресурсу `GMSACredentialSpec`. Завантажте [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml) CRD GMSA і збережіть його як gmsa-crd.yaml. Далі встановіть CRD за допомогою `kubectl apply -f gmsa-crd.yaml`

### Встановлення вебхуків для перевірки користувачів GMSA {#install-webhooks-to-validate-gmsa-users}

У кластері Kubernetes потрібно налаштувати два вебхуки для заповнення та перевірки посилань на специфікації облікових даних GMSA на рівні Podʼа або контейнера:

1. Змінювальний вебхук, який розгортає посилання на GMSA (за іменем зі специфікації Podʼа) у повну специфікацію облікових даних у форматі JSON у специфікації Podʼа.

1. Валідаційний вебхук, який перевіряє, що службовому обліковому запису Podʼа дозволено використовувати всі вказані посилання на GMSA.

Встановлення наведених вище вебхуків і повʼязаних обʼєктів потребує таких кроків:

1. Створіть пару ключів сертифіката (вона дасть змогу контейнеру вебхука взаємодіяти з кластером)

1. Встановіть Secret з наведеним вище сертифікатом.

1. Створіть Deployment для основної логіки вебхука.

1. Створіть конфігурації валідаційного та змінювального вебхуків, що посилаються на Deployment.

Для розгортання та налаштування вебхуків GMSA і повʼязаних з ними обʼєктів, згаданих вище, можна використати [скрипт](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh). Скрипт можна запустити з параметром `--dry-run=server`, щоб переглянути зміни, які буде внесено у ваш кластер.

[YAML-шаблон](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl), який використовує скрипт, також можна використати для ручного розгортання вебхуків і повʼязаних обʼєктів (з відповідною підстановкою параметрів)

<!-- steps -->

## Налаштування GMSA та вузлів Windows в Active Directory {#configure-gmsas-and-windows-nodes-in-active-directory}

Перш ніж налаштовувати Podʼи в Kubernetes на використання GMSA, потрібні GMSA слід підготувати в Active Directory, як описано в [документації Windows GMSA](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1). Робочі вузли Windows (що входять до кластера Kubernetes) потрібно налаштувати в Active Directory для доступу до секретних облікових даних, повʼязаних із потрібним GMSA, як описано в [документації Windows GMSA](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet).

## Створення ресурсів специфікацій облікових даних GMSA {#create-gmsa-credential-spec-resources}

Після встановлення CRD GMSACredentialSpec (як описано раніше) можна налаштувати власні ресурси, що містять специфікації облікових даних GMSA. Специфікація облікових даних GMSA не містить секретних або конфіденційних даних. Це інформація, за допомогою якої середовище виконання контейнерів може описати для Windows потрібний GMSA контейнера. Специфікації облікових даних GMSA можна згенерувати у форматі YAML за допомогою допоміжного [скрипта PowerShell](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1).

Ось кроки для створення YAML специфікації облікових даних GMSA вручну у форматі JSON з подальшим перетворенням:

1. Імпортуйте [модуль](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1) CredentialSpec: `ipmo CredentialSpec.psm1`

1. Створіть специфікацію облікових даних у форматі JSON за допомогою команди `New-CredentialSpec`. Щоб створити специфікацію облікових даних GMSA з іменем WebApp1, викличте `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`.

1. Використайте команду `Get-CredentialSpec`, щоб показати шлях до файлу JSON.

1. Перетворіть файл credspec з формату JSON на YAML і додайте потрібні поля заголовка `apiVersion`, `kind`, `metadata` і `credspec`, щоб зробити з нього власний ресурс GMSACredentialSpec, який можна налаштувати в Kubernetes.

Така конфігурація YAML описує специфікацію облікових даних GMSA з назвою `gmsa-WebApp1`:

```yaml
apiVersion: windows.k8s.io/v1
kind: GMSACredentialSpec
metadata:
  name: gmsa-WebApp1  # Це довільне імʼя, але воно буде використовуватися як посилання
credspec:
  ActiveDirectoryConfig:
    GroupManagedServiceAccounts:
    - Name: WebApp1   # Імʼя користувача облікового запису GMSA
      Scope: CONTOSO  # Імʼя домену NETBIOS
    - Name: WebApp1   # Імʼя користувача облікового запису GMSA
      Scope: contoso.com # Імʼя домену DNS
  CmsPlugins:
  - ActiveDirectory
  DomainJoinConfig:
    DnsName: contoso.com  # Імʼя домену DNS
    DnsTreeName: contoso.com # Корінь імені домену DNS
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  # GUID домену
    MachineAccountName: WebApp1 # Імʼя користувача облікового запису GMSA
    NetBiosName: CONTOSO  # Імʼя домену NETBIOS
    Sid: S-1-5-21-2126449477-2524075714-3094792973 # SID домену
```

Вищезазначений ресурс специфікації облікових даних може бути збережений як `gmsa-Webapp1-credspec.yaml` і застосований до кластера за допомогою: `kubectl apply -f gmsa-Webapp1-credspec.yaml`.

## Налаштування кластерної ролі для ввімкнення RBAC для конкретних специфікацій облікових даних GMSA {#configure-cluster-role-to-enable-rbac-on-specific-gmsa-credential-specs}

Для кожного ресурсу специфікації облікових даних GMSA потрібно визначити кластерну роль. Вона дозволяє субʼєкту, яким зазвичай є службовий обліковий запис, виконувати дію `use` над конкретним ресурсом GMSA. Наведений нижче приклад показує кластерну роль, яка дозволяє використовувати наведену вище специфікацію облікових даних `gmsa-WebApp1`. Збережіть файл як gmsa-webapp1-role.yaml і застосуйте його за допомогою `kubectl apply -f gmsa-webapp1-role.yaml`

```yaml
# Створіть роль для читання credspec
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: webapp1-role
rules:
- apiGroups: ["windows.k8s.io"]
  resources: ["gmsacredentialspecs"]
  verbs: ["use"]
  resourceNames: ["gmsa-WebApp1"]
```

## Призначення ролі службовим обліковим записам для використання конкретних credspec GMSA {#assign-role-to-service-accounts-to-use-specific-gmsa-credspecs}

Службовий обліковий запис (з яким будуть налаштовані Podʼи) потрібно привʼязати до створеної вище кластерної ролі. Це дозволяє службовому обліковому запису використовувати потрібний ресурс специфікації облікових даних GMSA. Нижче показано, як стандартний службовий обліковий запис привʼязується до кластерної ролі `webapp1-role` для використання створеного вище ресурсу специфікації облікових даних `gmsa-WebApp1`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: allow-default-svc-account-read-on-gmsa-WebApp1
  namespace: default
subjects:
- kind: ServiceAccount
  name: default
  namespace: default
roleRef:
  kind: ClusterRole
  name: webapp1-role
  apiGroup: rbac.authorization.k8s.io
```

## Налаштування посилання на специфікацію облікових даних GMSA у специфікації Podʼа {#configure-gmsa-credential-spec-reference-in-pod-spec}

Поле специфікації Podʼа `securityContext.windowsOptions.gmsaCredentialSpecName` використовується, щоб вказати в специфікаціях Podʼів посилання на потрібні власні ресурси специфікацій облікових даних GMSA. Це налаштовує всі контейнери в специфікації Podʼа на використання вказаного GMSA. Ось приклад специфікації Podʼа з анотацією, заповненою для посилання на `gmsa-WebApp1`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      securityContext:
        windowsOptions:
          gmsaCredentialSpecName: gmsa-webapp1
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
      nodeSelector:
        kubernetes.io/os: windows
```

Окремі контейнери в специфікації Podʼа також можуть вказати потрібну credspec GMSA за допомогою поля `securityContext.windowsOptions.gmsaCredentialSpecName` на рівні контейнера. Наприклад:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    run: with-creds
  name: with-creds
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      run: with-creds
  template:
    metadata:
      labels:
        run: with-creds
    spec:
      containers:
      - image: mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019
        imagePullPolicy: Always
        name: iis
        securityContext:
          windowsOptions:
            gmsaCredentialSpecName: gmsa-Webapp1
      nodeSelector:
        kubernetes.io/os: windows
```

Коли специфікації Podʼів із заповненими полями GMSA (як описано вище) застосовуються в кластері, відбувається така послідовність подій:

1. Змінювальний вебхук розвʼязує та розгортає всі посилання на ресурси специфікацій облікових даних GMSA у вміст специфікації облікових даних GMSA.

1. Валідаційний вебхук перевіряє, що службовому обліковому запису, повʼязаному з Podʼом, дозволено виконувати дію `use` для вказаної специфікації облікових даних GMSA.

1. Середовище виконання контейнерів налаштовує кожен контейнер Windows із вказаною специфікацією облікових даних GMSA, щоб контейнер міг набути ідентичності GMSA в Active Directory і звертатися до служб у домені, використовуючи цю ідентичність.

## Автентифікація до мережевих спільних ресурсів за іменем хоста або FQDN {#authenticating-to-network-shares-using-hostname-or-fqdn}

Якщо у вас виникають проблеми з підʼєднанням до спільних ресурсів SMB з Podʼів за іменем хоста або FQDN, але ви можете звертатися до них за IPv4-адресою, переконайтеся, що на вузлах Windows встановлено такий ключ реєстру.

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\hns\State" /v EnableCompartmentNamespace /t REG_DWORD /d 1
```

Після цього запущені Podʼи потрібно перестворити, щоб вони перейняли зміни поведінки. Докладніше про те, як використовується цей ключ реєстру, можна дізнатися [тут](https://github.com/microsoft/hcsshim/blob/885f896c5a8548ca36c88c4b87fd2208c8d16543/internal/uvm/create.go#L74-L83)

## Усунення несправностей {#troubleshooting}

Якщо у вас виникають труднощі із запуском GMSA у вашому середовищі, можна виконати кілька кроків усунення несправностей.

Спершу переконайтеся, що credspec передано до Podʼа. Для цього потрібно виконати `exec` в одному з ваших Podʼів і перевірити вивід команди `nltest.exe /parentdomain`.

У наведеному нижче прикладі Pod не отримав credspec правильно:

```PowerShell
kubectl exec -it iis-auth-7776966999-n5nzr powershell.exe
```

`nltest.exe /parentdomain` видає таку помилку:

```output
Getting parent domain failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

Якщо ваш Pod отримав credspec правильно, далі перевірте звʼязок із доменом. Спершу всередині вашого Podʼа швидко виконайте nslookup, щоб знайти корінь вашого домену.

Це покаже нам 3 речі:

1. Pod може звʼязатися з DC
1. DC може звʼязатися з Podʼом
1. DNS працює правильно.

Якщо тест DNS і звʼязку пройдено, далі потрібно перевірити, чи встановив Pod захищений канал звʼязку з доменом. Для цього знову виконайте `exec` у вашому Podʼі та запустіть команду `nltest.exe /query`.

```PowerShell
nltest.exe /query
```

Отримаємо такий вивід:

```output
I_NetLogonControl failed: Статус = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

Це означає, що з певної причини Pod не зміг увійти в домен за допомогою облікового запису, вказаного в credspec. Можна спробувати відновити захищений канал, виконавши таке:

```PowerShell
nltest /sc_reset:domain.example
```

Якщо команда виконається успішно, ви побачите вивід, подібний до такого:

```output
Flags: 30 HAS_IP  HAS_TIMESERV
Trusted DC Name \\dc10.domain.example
Trusted DC Connection Status Status = 0 0x0 NERR_Success
The command completed successfully
```

Якщо це виправило помилку, цей крок можна автоматизувати, додавши до специфікації Podʼа такий хук життєвого циклу. Якщо ж помилку не виправлено, потрібно ще раз перевірити ваш credspec і переконатися, що він правильний і повний.

```yaml
        image: registry.domain.example/iis-auth:1809v1
        lifecycle:
          postStart:
            exec:
              command: ["powershell.exe","-command","do { Restart-Service -Name netlogon } while ( $($Result = (nltest.exe /query); if ($Result -like '*0x0 NERR_Success*') {return $true} else {return $false}) -eq $false)"]
        imagePullPolicy: IfNotPresent
```

Якщо ви додасте наведений вище розділ `lifecycle` до специфікації Podʼа, Pod виконуватиме вказані команди для перезапуску служби `netlogon`, доки команда `nltest.exe /query` не завершиться без помилки.
