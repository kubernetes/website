---
title: Налаштування доступу до одного кластера
description: >-
  Налаштуйте файл kubeconfig для доступу до наявного кластера Kubernetes за допомогою kubectl.
content_type: task
weight: 25
---

<!-- overview -->

На цій сторінці показано, як налаштувати kubectl для доступу до одного наявного кластера за допомогою наданого файла kubeconfig або відомостей про підключення до кластера. Докладніше про концепцію дивіться в розділі [Організація доступу до кластера за допомогою файлів kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

## {{% heading "prerequisites" %}} {#before-you-begin}

* Потрібен запущений кластер Kubernetes. Якщо його немає, створіть локальний кластер за допомогою [Minikube](https://minikube.sigs.k8s.io/docs/start/) або виберіть інше [навчальне середовище](/docs/setup/learning-environment/).
* [Встановіть kubectl](/docs/tasks/tools/). Його версія має бути [у межах однієї другорядної версії](/releases/version-skew-policy/#kubectl) від версії API-сервера кластера. Перевірте версію клієнта командою `kubectl version --client`.
* Переконайтеся, що компʼютер може підʼєднатися до API-сервера кластера; за потреби використовуйте VPN.
* Підготуйте текстовий редактор і приватну робочу теку.

Приклади для оболонки використовують Bash або Zsh у Linux і macOS та PowerShell у Windows.

<!-- steps -->

## Отримайте відомості для доступу до кластера {#obtain-your-cluster-access-information}

Попросіть адміністратора кластера або постачальника надати особистий файл kubeconfig чи наведені нижче відомості. Приклади значень використовуються в командах далі; замініть їх на параметри вашого кластера.

{{< table caption="Приклади відомостей для доступу до кластера та джерела їх отримання" >}}

| Відомості | Приклад | Де отримати |
| :--- | :--- | :--- |
| Адреса API-сервера | `https://api.example.com:6443` | В адміністратора або в інструкціях постачальника щодо підключення до кластера. |
| Сертифікат довіреного центру сертифікації (CA) | PEM-файл `ca.crt` | Попросіть файл в адміністратора. Файл kubeconfig від постачальника вже містить посилання на потрібний CA-файл або самі дані. Окремий файл CA не потрібен, якщо сертифікат сервера довірений операційною системою. |
| Метод автентифікації | Плагін облікових даних, наприклад `example-credential-plugin`, підписаний клієнтський сертифікат або токен | В інструкціях постачальника щодо входу або в адміністратора. |
| Простір імен і дозволи | Простір імен `default` із дозволом переглядати Podʼи | В адміністратора або в політиці доступу постачальника. |

{{< /table >}}

Для кластера, яким керує постачальник, дотримуйтеся його інструкцій щодо kubeconfig. Вони також пояснюють, які засоби для входу потрібні.

Для кластерів kubeadm адміністратори можуть скористатися інструкціями [Створення файлів kubeconfig для додаткових користувачів](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users).

{{< warning >}}
Використовуйте лише довірені файли kubeconfig. Вони можуть запускати плагіни облікових даних або читати локальні файли. Перевіряйте незнайомі файли перед використанням.
{{< /warning >}}

### Спробуйте виконати завдання з Minikube {#try-the-task-with-minikube}

Для локального прикладу встановіть Minikube та сумісний менеджер контейнерів або віртуальних машин за інструкцією [Початок роботи з Minikube](https://minikube.sigs.k8s.io/docs/start/).

1. Запустіть кластер Minikube зі стандартним профілем:

   ```shell
   minikube start --profile=minikube
   ```

   Minikube створить контекст `minikube` з адресою API-сервера та параметрами локального сертифіката, тому збирати ці значення вручну не потрібно.

1. У приватній робочій теці виберіть вільну назву файла, наприклад `cluster-config`, і експортуйте контекст:

   {{< tabs name="single-cluster-minikube-export" >}}
   {{% tab name="Linux і macOS" %}}

   ```shell
   kubectl config view --context=minikube --minify --flatten --raw > cluster-config
   ```

   {{% /tab %}}
   {{% tab name="Windows" %}}

   ```powershell
   kubectl config view --context=minikube --minify --flatten --raw | Set-Content -Path cluster-config -Encoding utf8
   ```

   {{% /tab %}}
   {{< /tabs >}}

   `--flatten` додає файли сертифікатів у конфігурацію, а `--raw` зберігає облікові дані, не приховуючи їх. Файл містить приватний ключ — зберігайте його в безпечному місці.

Перейдіть до розділу [Перевірте доступ до кластера](#verify-access-to-the-cluster). У цьому прикладі файл має назву `cluster-config`, а контекст — `minikube`; пропустіть розділи ручного налаштування.

## Використайте наданий файл kubeconfig {#use-a-supplied-kubeconfig-file}

Дотримуйтеся інструкцій постачальника, зокрема щодо встановлення та входу до плагіна облікових даних. Для автентифікації за сертифікатом використовуйте приватний ключ, згенерований локально; дивіться розділ [Налаштуйте облікові дані](#configure-credentials).

1. Збережіть файл kubeconfig як `cluster-config` у робочій теці. Якщо такий файл уже існує, виберіть іншу назву та використовуйте її в наступних командах. Для посилань на файли та виконувані файли плагінів указуйте абсолютні шляхи.
1. Перегляньте контексти у наданому файлі:

   ```shell
   kubectl --kubeconfig=cluster-config config get-contexts
   ```

1. Виберіть контекст кластера, замінивши `CONTEXT_NAME` назвою з виводу команди:

   ```shell
   kubectl --kubeconfig=cluster-config config use-context CONTEXT_NAME
   ```

Перейдіть до розділу [Перевірте доступ до кластера](#verify-access-to-the-cluster).

## Створіть kubeconfig із відомостей про підключення {#create-a-kubeconfig-from-connection-information}

Почніть у теці, де ще немає файла `cluster-config`. Ці команди створять його, не змінюючи наявний kubeconfig. Замініть URL сервера, шляхи до сертифікатів і простір імен значеннями свого кластера. Локальні назви `my-cluster`, `my-user` і `my-context` можна залишити, якщо вони ще не використовуються у ваших файлах kubeconfig.

### Налаштуйте кластер {#configure-the-cluster}

Збережіть сертифікат довіреного CA кластера як `ca.crt`, а потім запишіть його та адресу API-сервера за допомогою [`kubectl config set-cluster`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-cluster/):

```shell
kubectl --kubeconfig=cluster-config config set-cluster my-cluster --server=https://api.example.com:6443 --certificate-authority=ca.crt
```

У конфігурації буде збережено посилання на `ca.crt` відносно теки файла kubeconfig. Якщо сертифікат сервера довірений операційною системою, не вказуйте `--certificate-authority`.

### Налаштуйте облікові дані {#configure-credentials}

За допомогою [`kubectl config set-credentials`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-credentials/) створіть у `cluster-config` запис `my-user` у розділі `users`. Цей запис визначає, який плагін облікових даних, сертифікат і ключ або токен використовувати. Виберіть один із наведених методів автентифікації.

{{< tabs name="single-cluster-authentication" >}}
{{% tab name="Плагін облікових даних" %}}

Плагін облікових даних отримує облікові дані під час підключення kubectl до API-сервера.

1. Встановіть плагін і увійдіть за інструкціями постачальника. Його виконуваний файл має бути в `PATH` або викликайте його за повним шляхом.
1. Налаштуйте плагін, замінивши `example-credential-plugin` назвою його виконуваного файла:

   ```shell
   kubectl --kubeconfig=cluster-config config set-credentials my-user --exec-command=example-credential-plugin --exec-api-version=client.authentication.k8s.io/v1 --exec-interactive-mode=IfAvailable
   ```

   Використовуйте версію API та режим інтерактивності, потрібні постачальнику. Додайте `--exec-arg=VALUE` і `--exec-env=NAME=VALUE`, щоб передати необхідні аргументи й змінні середовища. Відповідь плагіна має відповідати `--exec-api-version`. Докладніше дивіться в розділі [Плагіни облікових даних client-go](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins).

{{% /tab %}}
{{% tab name="Клієнтський сертифікат" %}}

Використовуйте цей метод, якщо кластер підтримує клієнтські сертифікати X.509. Потрібна утиліта командного рядка `openssl`.

1. Якщо потрібен новий сертифікат, згенеруйте приватний ключ і запит на підписання сертифіката (CSR). Виберіть вільні назви файлів і замініть `YOUR_USERNAME` на імʼя користувача, погоджене з адміністратором, наприклад `jane`:

   ```shell
   openssl genrsa -out my-user.key 3072
   openssl req -new -key my-user.key -out my-user.csr -subj "/CN=YOUR_USERNAME"
   ```

1. Якщо ви згенерували CSR, надішліть адміністратору лише `my-user.csr`; файл `my-user.key` залиште в себе. Збережіть підписаний сертифікат як `my-user.crt`. Адміністратор може скористатися процесом [CertificateSigningRequest](/docs/tasks/tls/certificate-issue-client-csr/), якщо це підтримується кластером.
1. Додайте сертифікат і ключ до конфігурації:

   ```shell
   kubectl --kubeconfig=cluster-config config set-credentials my-user --client-certificate=my-user.crt --client-key=my-user.key --embed-certs=true
   ```

   Ця команда вбудовує сертифікат і приватний ключ у `cluster-config`. Захищайте цей файл так само, як приватний ключ.

{{% /tab %}}
{{% tab name="Довготривалий токен bearer" %}}

Використовуйте цей метод, якщо адміністратор або постачальник надав довготривалий токен bearer для вашої особи, який приймає кластер.

Замініть `YOUR_TOKEN` цим токеном:

```shell
kubectl --kubeconfig=cluster-config config set-credentials my-user --token=YOUR_TOKEN
```

Токен буде збережено у `cluster-config`. Будь-хто, хто отримає до нього доступ, зможе автентифікуватися від вашого імені, доки токен не завершиться або його не буде відкликано. Зберігайте файл у безпеці та дотримуйтеся інструкцій адміністратора щодо заміни токена.

{{% /tab %}}
{{< /tabs >}}

### Налаштуйте та виберіть контекст {#configure-and-select-a-context}

Контекст зберігає кластер, облікові дані та простір імен, які слід використовувати разом.

1. Створіть контекст, який підʼєднується до `my-cluster` з обліковими даними `my-user` і простором імен `default`. Скористайтеся [`kubectl config set-context`](/docs/reference/kubectl/generated/kubectl_config/kubectl_config_set-context/):

   ```shell
   kubectl --kubeconfig=cluster-config config set-context my-context --cluster=my-cluster --user=my-user --namespace=default
   ```

   Параметр `--user=my-user` вибирає запис із попереднього розділу. Якщо цей запис використовує сертифікат, виданий для `jane`, кластер автентифікує вас як `jane`; `my-user` — лише назва облікових даних у файлі.
1. Виберіть цей контекст:

   ```shell
   kubectl --kubeconfig=cluster-config config use-context my-context
   ```

1. Перегляньте конфігурацію:

   ```shell
   kubectl --kubeconfig=cluster-config config view
   ```

   Для прикладу з плагіном облікових даних вивід буде приблизно таким:

   ```yaml
   apiVersion: v1
   clusters:
   - cluster:
       certificate-authority: ca.crt
       server: https://api.example.com:6443
     name: my-cluster
   contexts:
   - context:
       cluster: my-cluster
       namespace: default
       user: my-user
     name: my-context
   current-context: my-context
   kind: Config
   users:
   - name: my-user
     user:
       exec:
         apiVersion: client.authentication.k8s.io/v1
         args: null
         command: example-credential-plugin
         env: null
         interactiveMode: IfAvailable
         provideClusterInfo: false
   ```

   Для автентифікації за сертифікатом замість `exec` буде показано поля сертифіката й ключа, а для токена bearer — поле `token`.

{{< note >}}
Додайте `--minify` до команди `kubectl config view`, щоб показати лише конфігурацію поточного контексту.
{{< /note >}}

## Перевірте доступ до кластера {#verify-access-to-the-cluster}

Замість `default` використовуйте призначений вам простір імен.

1. Перевірте, яку особу визначив кластер:

   ```shell
   kubectl --kubeconfig=cluster-config auth whoami
   ```

   Переконайтеся, що імʼя користувача та групи правильні.
1. Перевірте, чи можна переглядати Podʼи у вашому просторі імен:

   ```shell
   kubectl --kubeconfig=cluster-config auth can-i list pods --namespace=default
   ```

   Якщо команда повертає `no`, зверніться до адміністратора щодо потрібних дозволів. Автентифікація сама по собі не надає доступу до ресурсів.
1. Якщо відповідь `yes`, перегляньте Podʼи:

   ```shell
   kubectl --kubeconfig=cluster-config get pods --namespace=default
   ```

   Вивід `No resources found` є нормальним, якщо в просторі імен немає Podʼів.

## Збережіть kubeconfig у стандартному розташуванні {#save-the-kubeconfig-in-the-default-location}

Після налаштування збережіть `cluster-config` як стандартний файл kubeconfig: `$HOME/.kube/config` у Linux і macOS або `$env:USERPROFILE\.kube\config` у Windows. Якщо змінна середовища `KUBECONFIG` не задана чи порожня та не вказано `--kubeconfig`, kubectl автоматично читає цей файл. Задавати `KUBECONFIG` для стандартного файла не потрібно.

Якщо у файлі kubeconfig вказано `certificate-authority: ca.crt`, замініть це значення на абсолютний шлях до CA-файла перед копіюванням.

Якщо стандартного файла ще немає, скопіюйте `cluster-config` з робочої теки:

{{< tabs name="single-cluster-default-save" >}}
{{% tab name="Linux і macOS" %}}

```shell
mkdir -p "$HOME/.kube"
cp cluster-config "$HOME/.kube/config"
chmod 600 "$HOME/.kube/config"
```

{{% /tab %}}
{{% tab name="Windows" %}}

```powershell
New-Item -ItemType Directory -Path "$env:USERPROFILE\.kube" -Force | Out-Null
Copy-Item cluster-config "$env:USERPROFILE\.kube\config"
```

{{% /tab %}}
{{< /tabs >}}

## Використайте додаткові файли kubeconfig (необовʼязково) {#use-additional-kubeconfig-files-optional}

Якщо ви зберігаєте конфігурації в окремих файлах, використовуйте `KUBECONFIG`, щоб вибрати файли, які читає kubectl. Це необовʼязково: стандартний kubeconfig працює і без цієї змінної. У Linux і macOS шляхи в `KUBECONFIG` розділяються двокрапкою (`:`), а у Windows — крапкою з комою (`;`). Параметр `--kubeconfig` натомість вибирає лише один файл.

Наведені приклади зберігають поточне значення, додають стандартний файл і `cluster-config`, а потім виконують запит. Запускайте їх із теки, де збережено `cluster-config`. Замініть `CONTEXT_NAME` на `my-context` для ручного прикладу, `minikube` для прикладу з Minikube або на контекст із наданого файла. Замість `default` укажіть свій простір імен:

{{< tabs name="single-cluster-optional-kubeconfig" >}}
{{% tab name="Linux і macOS" %}}

```shell
export KUBECONFIG_SAVED="$KUBECONFIG"
export KUBECONFIG="${KUBECONFIG}:$HOME/.kube/config:$PWD/cluster-config"
kubectl --context=CONTEXT_NAME get pods --namespace=default
```

{{% /tab %}}
{{% tab name="Windows" %}}

```powershell
$env:KUBECONFIG_SAVED = $env:KUBECONFIG
$env:KUBECONFIG = "$env:KUBECONFIG;$env:USERPROFILE\.kube\config;$PWD\cluster-config"
kubectl --context=CONTEXT_NAME get pods --namespace=default
```

{{% /tab %}}
{{< /tabs >}}

Для однакових записів перевагу мають файли, перелічені раніше. Докладніше дивіться в розділі [Налаштування доступу до кількох кластерів](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/).

Якщо ви скористалися попереднім необовʼязковим розділом, виконайте команду в тому самому терміналі, щоб відновити попереднє значення `KUBECONFIG`:

{{< tabs name="single-cluster-kubeconfig-cleanup" >}}
{{% tab name="Linux і macOS" %}}

```shell
export KUBECONFIG="$KUBECONFIG_SAVED"
```

{{% /tab %}}
{{% tab name="Windows" %}}

```powershell
$env:KUBECONFIG = $env:KUBECONFIG_SAVED
```

{{% /tab %}}
{{< /tabs >}}

<!-- discussion -->

## Усунення проблем із доступом {#troubleshoot-access}

Якщо команда завершується помилкою, дивіться розділ [Усунення проблем із kubectl](/docs/tasks/debug/), присвячений kubeconfig, підключенню, автентифікації та помилкам TLS.

## Інші способи використання kubeconfig {#other-uses-of-kubeconfig}

Такі компоненти, як [kubelet](/docs/reference/command-line-tools-reference/kubelet/) і [kube-proxy](/docs/reference/command-line-tools-reference/kube-proxy/), також використовують файли kubeconfig. Дотримуйтеся їхньої документації щодо ідентифікації та налаштування файлів.

## {{% heading "whatsnext" %}} {#what-s-next}

### Налаштуйте параметри kubectl {#customize-kubectl-preferences}

Файл kubeconfig містить параметри підключення до кластера й автентифікації. Окремий необовʼязковий файл `kuberc` налаштовує стандартні значення та псевдоніми kubectl; для доступу до кластера все одно використовується kubeconfig.

Якщо для автентифікації використовується плагін облікових даних exec, політика плагінів облікових даних у kuberc може визначати, чи дозволено запускати цей плагін. Це допомагає захиститися від шкідливих файлів kubeconfig.

Інструкції зі створення окремого файла `kuberc` наведено в розділі [Налаштування користувача kubectl (kuberc)](/docs/reference/kubectl/kuberc/).

### Додаткові матеріали {#additional-reading}

* [Налаштування доступу до кількох кластерів](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)
* [Організація доступу до кластера за допомогою файлів kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [Довідник kubeconfig (v1)](/docs/reference/config-api/kubeconfig.v1/)
* [Довідник `kubectl config`](/docs/reference/kubectl/generated/kubectl_config/)
