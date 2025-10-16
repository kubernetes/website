---
title: Налаштування GMSA для Windows Podʼів та контейнерів
content_type: task
weight: 30
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Ця сторінка показує, як налаштувати [Group Managed Service Accounts](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/group-managed-service-accounts-overview) (GMSA) для Podʼів та контейнерів, які будуть запущені на вузлах Windows. Group Managed Service Accounts це специфічний тип облікового запису Active Directory, який забезпечує автоматичне управління паролями, спрощене управління іменами служб (SPN) та можливість делегування управління іншим адміністраторам на кількох серверах.

У Kubernetes специфікації облікових даних GMSA налаштовуються на рівні кластера Kubernetes як Custom Resources. Windows Podʼи, також як і окремі контейнери в Podʼі, можуть бути налаштовані для використання GMSA для доменних функцій (наприклад, автентифікація Kerberos) при взаємодії з іншими службами Windows.

## {{% heading "prerequisites" %}}

Вам необхідно мати кластер Kubernetes і інструмент командного рядка `kubectl`, налаштований для керування з вашим кластером. Очікується, що в кластері будуть вузли Windows. Цей розділ охоплює набір початкових кроків, необхідних один раз для кожного кластера:

### Встановлення CRD для GMSACredentialSpec {#install-the-gmsacredentialspec-crd}

[CustomResourceDefinition](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)(CRD) для ресурсів специфікації облікових даних GMSA потрібно налаштувати на кластері, щоб визначити тип настроюваного ресурсу `GMSACredentialSpec`. Завантажте GMSA CRD [YAML](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-crd.yml) і збережіть як gmsa-crd.yaml. Далі встановіть CRD за допомогою `kubectl apply -f gmsa-crd.yaml`.

### Встановлення вебхуків для перевірки користувачів GMSA {#install-webhooks-to-validate-gmsa-users}

Два вебхуки потрібно налаштувати на кластері Kubernetes для заповнення та перевірки посилань на специфікації облікових даних GMSA на рівні Podʼа або контейнера:

1. Модифікаційний вебхук, який розширює посилання на GMSAs (за іменем зі специфікації Podʼа) до повної специфікації облікових даних у форматі JSON у специфікації Podʼа.

2. Валідаційний вебхук забезпечує, що всі посилання на GMSAs уповноважені для використання службовим обліковим записом Podʼа.

Встановлення зазначених вище вебхуків та повʼязаних обʼєктів вимагає наступних кроків:

1. Створіть пару ключів сертифікатів (яка буде використовуватися для забезпечення звʼязку контейнера вебхука з кластером)

1. Встановіть Secret із вищезазначеним сертифікатом.

1. Створіть Deployment для основної логіки вебхука.

1. Створіть конфігурації валідаційного та модифікаційного вебхуків, посилаючись на Deployment.

[Скрипт](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/deploy-gmsa-webhook.sh) можна використовувати для розгортання та налаштування вебхуків GMSA та повʼязаних з ними обʼєктів, зазначених вище. Скрипт можна запускати з опцією `--dry-run=server`, щоб ви могли переглянути зміни, які будуть внесені в ваш кластер.

[YAML шаблон](https://github.com/kubernetes-sigs/windows-gmsa/blob/master/admission-webhook/deploy/gmsa-webhook.yml.tpl), що використовується скриптом, також може бути використаний для ручного розгортання вебхуків та повʼязаних обʼєктів (з відповідними замінами параметрів)

<!-- steps -->

## Налаштування GMSA та вузлів Windows в Active Directory {#configure-gmsas-and-windows-nodes-in-active-directory}

Перш ніж Podʼи в Kubernetes можуть бути налаштовані на використання GMSA, необхідно провести налаштування бажаних GMSA в Active Directory, як описано в [документації Windows GMSA](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#BKMK_Step1). Вузли робочих станцій Windows (які є частиною кластера Kubernetes) повинні бути налаштовані в Active Directory для доступу до секретних облікових даних, що повʼязані з бажаним GMSA, як описано в [документації Windows GMSA](https://docs.microsoft.com/en-us/windows-server/security/group-managed-service-accounts/getting-started-with-group-managed-service-accounts#to-add-member-hosts-using-the-set-adserviceaccount-cmdlet).

## Створення ресурсів GMSA Credential Spec {#create-gmsa-credential-spec-resources}

Після встановлення CRD GMSACredentialSpec (як описано раніше), можна налаштувати власні ресурси, що містять специфікації облікових даних GMSA. Специфікація облікових даних GMSA не містить конфіденційні або секретні дані. Це інформація, яку контейнерне середовище може використовувати для опису бажаної GMSA контейнера для Windows. Специфікації облікових даних GMSA можуть бути створені у форматі YAML за допомогою утиліти [сценарію PowerShell](https://github.com/kubernetes-sigs/windows-gmsa/tree/master/scripts/GenerateCredentialSpecResource.ps1).

Ось кроки для створення YAML-файлу специфікації облікових даних GMSA вручну у форматі JSON і подальше його конвертування:

1. Імпортуйте модуль CredentialSpec [module](https://github.com/MicrosoftDocs/Virtualization-Documentation/blob/live/windows-server-container-tools/ServiceAccounts/CredentialSpec.psm1): `ipmo CredentialSpec.psm1`.

1. Створіть специфікацію облікових даних у форматі JSON за допомогою команди `New-CredentialSpec`. Щоб створити специфікацію облікових даних GMSA з іменем WebApp1, викличте `New-CredentialSpec -Name WebApp1 -AccountName WebApp1 -Domain $(Get-ADDomain -Current LocalComputer)`.

1. Використайте команду `Get-CredentialSpec`, щоб показати шлях до файлу JSON.

1. Конвертуйте файл credspec з формату JSON у YAML та застосуйте необхідні заголовкові поля `apiVersion`, `kind`, `metadata` та `credspec`, щоб зробити його специфікацією GMSACredentialSpec, яку можна налаштувати в Kubernetes.

Наступна конфігурація YAML описує специфікацію облікових даних GMSA з іменем `gmsa-WebApp1`:

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
    Guid: 244818ae-87ac-4fcd-92ec-e79e5252348a  # GUID для Domain
    MachineAccountName: WebApp1 # Імʼя користувача облікового запису GMSA
    NetBiosName: CONTOSO  # Імʼя домену NETBIOS
    Sid: S-1-5-21-2126449477-2524075714-3094792973 # SID для Domain
```

Вищезазначений ресурс специфікації облікових даних може бути збережений як `gmsa-Webapp1-credspec.yaml` і застосований до кластера за допомогою: `kubectl apply -f gmsa-Webapp1-credspec.yaml`.

## Налаштування ролі кластера для включення RBAC у конкретні специфікації облікових даних GMSA {#configure-cluster-role-to-enable-rbac-on-specific-gmsa-credential-specs}

Для кожного ресурсу специфікації облікових даних GMSA потрібно визначити роль в кластері. Це авторизує дію `use` ("використовувати") на конкретному ресурсі GMSA певним субʼєктом, який, як правило, є службовим обліковим записом. Наведений нижче приклад показує роль в кластері, яка авторизує використання специфікації облікових даних `gmsa-WebApp1` зверху. Збережіть файл як gmsa-webapp1-role.yaml і застосуйте його за допомогою `kubectl apply -f gmsa-webapp1-role.yaml`.

```yaml
# Створення ролі для читання credspec
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

## Призначення ролі службовому обліковому запису для використання конкретних специфікацій облікових даних GMSA {#assign-role-to-service-account-to-use-specific-gmsa-credspecs}

Службовий обліковий запис (з якими будуть налаштовані Podʼи) повинен бути привʼязаний до ролі в кластері, створеної вище. Це авторизує службовий обліковий запис використовувати бажаний ресурс специфікації облікових даних GMSA. Нижче показано, як стандартний службовий обліковий запис привʼязується до ролі в кластера `webapp1-role` для використання ресурсу специфікації облікових даних `gmsa-WebApp1`, створеного вище.

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

## Налаштування посилання на специфікацію облікових даних GMSA в специфікації Pod {#configure-gmsa-credential-spec-reference-in-pod-spec}

Поле `securityContext.windowsOptions.gmsaCredentialSpecName` у специфікації Pod використовується для вказівки посилань на бажані ресурси специфікації облікових даних GMSA в специфікаціях Pod. Це налаштовує всі контейнери в специфікації Pod на використання вказаного GMSA. Нижче наведено приклад специфікації Pod з анотацією, заповненою для посилання на `gmsa-WebApp1`:

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

Індивідуальні контейнери в специфікації Pod також можуть вказати бажану специфікацію облікових даних GMSA, використовуючи поле `securityContext.windowsOptions.gmsaCredentialSpecName` на рівні окремого контейнера. Наприклад:

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

Під час застосування специфікацій Pod з заповненими полями GMSA (як описано вище) в кластері відбувається наступна послідовність подій:

1. Модифікаційний вебхук розвʼязує та розширює всі посилання на ресурси специфікації облікових даних GMSA до вмісту специфікації облікових даних GMSA.

2. Валідаційний вебхук переконується, що службовий обліковий запис, повʼязаний з Pod, авторизований для дії `use` на вказаній специфікації облікових даних GMSA.

3. Контейнерне середовище налаштовує кожен контейнер Windows із вказаною специфікацією облікових даних GMSA, щоб контейнер міг прийняти елемент GMSA в Active Directory та отримати доступ до служб в домені, використовуючи цей елемент.

## Автентифікація на мережевих ресурсах за допомогою імені хосту або повного доменного імені {#authenticating-to-network-shares-using-hostname-or-fqdn}

Якщо ви маєте проблеми з підключенням до SMB-ресурсів з Podʼів за допомогою імені хосту або повного доменного імені, але можете отримати доступ до ресурсів за їх адресою IPv4, переконайтеся, що встановлений наступний ключ реєстру на вузлах Windows.

```cmd
reg add "HKLM\SYSTEM\CurrentControlSet\Services\hns\State" /v EnableCompartmentNamespace /t REG_DWORD /d 1
```

Після цього потрібно перестворити Podʼи, щоб вони врахували зміни в поведінці. Додаткову інформацію про те, як використовується цей ключ реєстру, можна знайти [тут](https://github.com/microsoft/hcsshim/blob/885f896c5a8548ca36c88c4b87fd2208c8d16543/internal/uvm/create.go#L74-L83).

## Усунення несправностей {#troubleshooting}

Якщо у вас виникають труднощі з налаштуванням роботи GMSA в вашому середовищі, існують кілька кроків усунення несправностей, які ви можете виконати.

Спочатку переконайтеся, що credspec був переданий до Podʼа. Для цього вам потрібно виконати команду `exec` в одному з ваших Podʼів і перевірити вивід команди `nltest.exe /parentdomain`.

У наступному прикладі Pod не отримав credspec правильно:

```PowerShell
kubectl exec -it iis-auth-7776966999-n5nzr powershell.exe
```

Результат команди `nltest.exe /parentdomain` показує наступну помилку:

```output
Getting parent domain failed: Status = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

Якщо ваш Pod отримав credspec правильно, наступним кроком буде перевірка звʼязку з доменом. Спочатку, зсередини вашого Podʼа, виконайте nslookup, щоб знайти корінь вашого домену.

Це дозволить нам визначити 3 речі:

1. Pod може досягти контролера домену (DC).
2. Контролер домену (DC) може досягти Podʼа.
3. DNS працює правильно.

Якщо тест DNS та комунікації успішний, наступним буде перевірка, чи Pod встановив захищений канал звʼязку з доменом. Для цього, знову ж таки, виконайте команду `exec` в вашому Podʼі та запустіть команду `nltest.exe /query`.

```PowerShell
nltest.exe /query
```

Результат буде наступним:

```output
I_NetLogonControl failed: Статус = 1722 0x6ba RPC_S_SERVER_UNAVAILABLE
```

Це говорить нам те, що з якоїсь причини Pod не зміг увійти в домен, використовуючи обліковий запис, вказаний у credspec. Ви можете спробувати полагодити захищений канал за допомогою наступного:

```PowerShell
nltest /sc_reset:domain.example
```

Якщо команда успішна, ви побачите подібний вивід:

```output
Flags: 30 HAS_IP  HAS_TIMESERV
Trusted DC Name \\dc10.domain.example
Trusted DC Connection Status Status = 0 0x0 NERR_Success
The command completed successfully
```

Якщо дії вище виправили помилку, ви можете автоматизувати цей крок, додавши наступний виклик у час життєвого циклу до специфікації вашого Podʼа. Якщо це не виправило помилку, вам потрібно перевірити ваш credspec ще раз та підтвердити, що він правильний та повний.

```yaml
        image: registry.domain.example/iis-auth:1809v1
        lifecycle:
          postStart:
            exec:
              command: ["powershell.exe","-command","do { Restart-Service -Name netlogon } while ( $($Result = (nltest.exe /query); if ($Result -like '*0x0 NERR_Success*') {return $true} else {return $false}) -eq $false)"]
        imagePullPolicy: IfNotPresent
```

Якщо ви додасте розділ `lifecycle` до специфікації вашого Podʼа, Pod виконає вказані команди для перезапуску служби `netlogon` до того, як команда `nltest.exe /query` вийде без помилок.
