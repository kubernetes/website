---
title: Налаштування доступу до кількох кластерів
content_type: task
weight: 30
card:
  name: tasks
  weight: 25
  title: Налаштування доступу до кластерів
---

<!-- overview -->

На цій сторінці показано, як налаштувати доступ до кількох кластерів за допомогою файлів конфігурації. Після того як кластери, користувачів і контексти визначено в одному чи кількох файлах конфігурації, можна швидко перемикатися між кластерами за допомогою команди `kubectl config use-context`.

{{< note >}}
Файл, що використовується для налаштування доступу до кластера, іноді називають *файлом kubeconfig*. Це загальна назва файлів конфігурації. Це не означає, що існує файл з назвою `kubeconfig`.
{{< /note >}}

{{< warning >}}
Використовуйте файли kubeconfig лише з надійних джерел. Використання спеціально створеного файлу kubeconfig може призвести до виконання шкідливого коду або розкриття файлів. Якщо вам потрібно використати ненадійний файл kubeconfig, спершу ретельно його перевірте, як перевіряли б скрипт оболонки.
{{< /warning >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}}

Щоб перевірити, чи встановлено {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}, виконайте команду `kubectl version --client`. Версія kubectl має бути [в межах однієї мінорної версії](/releases/version-skew-policy/#kubectl) від версії API-сервера вашого кластера.

<!-- steps -->

## Визначення кластерів, користувачів і контекстів {#define-clusters-users-and-contexts}

Припустимо, у вас є два кластери: один для розробки, а інший для тестування. У кластері `development` ваші фронтенд-розробники працюють у просторі імен `frontend`, а розробники сховищ — у просторі імен `storage`. У кластері `test` розробники працюють у стандартному просторі імен або створюють додаткові простори імен за потреби. Доступ до кластера розробки вимагає автентифікації за сертифікатом. Доступ до тестового кластера вимагає автентифікації за іменем користувача та паролем.

Створіть теку з назвою `config-exercise`. У теці `config-exercise` створіть файл з назвою `config-demo` з таким вмістом:

```yaml
apiVersion: v1
kind: Config
preferences: {}

clusters:
- cluster:
  name: development
- cluster:
  name: test

users:
- name: developer
- name: experimenter

contexts:
- context:
  name: dev-frontend
- context:
  name: dev-storage
- context:
  name: exp-test
```

Файл конфігурації описує кластери, користувачів і контексти. Ваш файл `config-demo` містить каркас для опису двох кластерів, двох користувачів і трьох контекстів.

Перейдіть до теки `config-exercise`. Виконайте ці команди, щоб додати відомості про кластери до файлу конфігурації:

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster test --server=https://5.6.7.8 --insecure-skip-tls-verify
```

Додайте відомості про користувачів до файлу конфігурації:

{{< caution >}}
Зберігання паролів у конфігурації клієнта Kubernetes ризиковано. Кращою альтернативою є використання втулка облікових даних і окреме зберігання цих даних. Дивіться [втулки облікових даних client-go](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins).
{{< /caution >}}

```shell
kubectl config --kubeconfig=config-demo set-credentials developer --client-certificate=fake-cert-file --client-key=fake-key-file
kubectl config --kubeconfig=config-demo set-credentials experimenter --username=exp --password=some-password
```

{{< note >}}

- Щоб видалити користувача, можна виконати команду `kubectl --kubeconfig=config-demo config unset users.<name>`;
- Щоб видалити кластер, можна виконати команду `kubectl --kubeconfig=config-demo config unset clusters.<name>`;
- Щоб видалити контекст, можна виконати команду `kubectl --kubeconfig=config-demo config unset contexts.<name>`.
{{< /note >}}

Додайте відомості про контексти до файлу конфігурації:

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-test --cluster=test --namespace=default --user=experimenter
```

Відкрийте файл `config-demo`, щоб побачити додані відомості. Замість відкриття файлу `config-demo` можна використати команду `config view`.

```shell
kubectl config --kubeconfig=config-demo view
```

Вивід показує два кластери, двох користувачів і три контексти:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
- cluster:
    insecure-skip-tls-verify: true
    server: https://5.6.7.8
  name: test
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
current-context: ""
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
- name: experimenter
  user:
    # Примітка до документації (цей коментар НЕ є частиною виводу команди).
    # Зберігання паролів у конфігурації клієнта Kubernetes ризиковано.
    # Кращою альтернативою є використання втулка облікових даних
    # і окреме зберігання цих даних.
    # Дивіться https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins
    password: some-password
    username: exp
```

Наведені вище `fake-ca-file`, `fake-cert-file` і `fake-key-file` є заповнювачами шляхів до файлів сертифікатів. Вам потрібно замінити їх на справжні шляхи до файлів сертифікатів у вашому середовищі.

Іноді може знадобитися вбудувати сюди дані, закодовані в Base64, замість окремих файлів сертифікатів; у такому разі потрібно додати суфікс `-data` до ключів, наприклад, `certificate-authority-data`, `client-certificate-data`, `client-key-data`.

Кожен контекст — це трійка (кластер, користувач, простір імен). Наприклад, контекст `dev-frontend` означає: «Використовувати облікові дані користувача `developer` для доступу до простору імен `frontend` кластера `development`».

Встановіть поточний контекст:

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

Тепер кожна введена команда `kubectl` застосовуватиметься до кластера й простору імен, зазначених у контексті `dev-frontend`. Команда використовуватиме облікові дані користувача, зазначеного в контексті `dev-frontend`.

Щоб побачити лише інформацію про конфігурацію, повʼязану з поточним контекстом, використовуйте прапорець `--minify`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

Вивід показує інформацію про конфігурацію, повʼязану з контекстом `dev-frontend`:

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority: fake-ca-file
    server: https://1.2.3.4
  name: development
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
current-context: dev-frontend
kind: Config
preferences: {}
users:
- name: developer
  user:
    client-certificate: fake-cert-file
    client-key: fake-key-file
```

Тепер припустимо, що ви хочете попрацювати деякий час у тестовому кластері.

Змініть поточний контекст на `exp-test`:

```shell
kubectl config --kubeconfig=config-demo use-context exp-test
```

Тепер будь-яка введена команда `kubectl` застосовуватиметься до стандартного простору імен кластера `test`. Команда використовуватиме облікові дані користувача, зазначеного в контексті `exp-test`.

Перегляньте конфігурацію, повʼязану з новим поточним контекстом `exp-test`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

Нарешті, припустимо, що ви хочете попрацювати деякий час у просторі імен `storage` кластера `development`.

Змініть поточний контекст на `dev-storage`:

```shell
kubectl config --kubeconfig=config-demo use-context dev-storage
```

Перегляньте конфігурацію, повʼязану з новим поточним контекстом `dev-storage`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

## Створення другого файлу конфігурації {#create-a-second-configuration-file}

У теці `config-exercise` створіть файл з назвою `config-demo-2` з таким вмістом:

```yaml
apiVersion: v1
kind: Config
preferences: {}

contexts:
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
```

Наведений вище файл конфігурації визначає новий контекст з назвою `dev-ramp-up`.

## Встановіть змінну середовища KUBECONFIG {#set-the-kubeconfig-environment-variable}

Перевірте, чи є у вас змінна середовища з назвою `KUBECONFIG`. Якщо так, збережіть її поточне значення, щоб пізніше відновити його. Наприклад:

### Linux

```shell
export KUBECONFIG_SAVED="$KUBECONFIG"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```

Змінна середовища `KUBECONFIG` — це список шляхів до файлів конфігурації. У Linux і Mac елементи списку розділяються двокрапкою, а у Windows — крапкою з комою. Якщо у вас є змінна середовища `KUBECONFIG`, ознайомтеся з файлами конфігурації зі списку.

Тимчасово додайте два шляхи до змінної середовища `KUBECONFIG`. Наприклад:

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:config-demo:config-demo-2"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

У теці `config-exercise` виконайте цю команду:

```shell
kubectl config view
```

Вивід показує обʼєднану інформацію з усіх файлів, зазначених у змінній середовища `KUBECONFIG`. Зокрема, зверніть увагу, що обʼєднана інформація містить контекст `dev-ramp-up` з файлу `config-demo-2` і три контексти з файлу `config-demo`:

```yaml
contexts:
- context:
    cluster: development
    namespace: frontend
    user: developer
  name: dev-frontend
- context:
    cluster: development
    namespace: ramp
    user: developer
  name: dev-ramp-up
- context:
    cluster: development
    namespace: storage
    user: developer
  name: dev-storage
- context:
    cluster: test
    namespace: default
    user: experimenter
  name: exp-test
```

Докладніше про обʼєднання файлів kubeconfig дивіться в розділі [Організація доступу до кластера за допомогою файлів kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

## Ознайомтеся з текою $HOME/.kube {#explore-the-home-kube-directory}

Якщо у вас уже є кластер і ви можете взаємодіяти з ним за допомогою `kubectl`, то, ймовірно, у теці `$HOME/.kube` є файл з назвою `config`.

Перейдіть до теки `$HOME/.kube` і перегляньте, які файли там є. Зазвичай там є файл з назвою `config`. У цій теці можуть бути й інші файли конфігурації. Коротко ознайомтеся з їхнім вмістом.

## Додайте $HOME/.kube/config до змінної середовища KUBECONFIG {#append-home-kube-config-to-your-kubeconfig-environment-variable}

Якщо у вас є файл `$HOME/.kube/config` і він ще не зазначений у змінній середовища `KUBECONFIG`, додайте його туди зараз. Наприклад:

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:${HOME}/.kube/config"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG="$Env:KUBECONFIG;$HOME\.kube\config"
```

Перегляньте інформацію про конфігурацію, обʼєднану з усіх файлів, які тепер зазначені у змінній середовища `KUBECONFIG`. У теці `config-exercise` введіть:

```shell
kubectl config view
```

## Очищення {#clean-up}

Поверніть змінній середовища `KUBECONFIG` її початкове значення. Наприклад:<br>

### Linux

```shell
export KUBECONFIG="$KUBECONFIG_SAVED"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=$ENV:KUBECONFIG_SAVED
```

## Перевірте субʼєкт, представлений kubeconfig {#check-the-subject-represented-by-the-kubeconfig}

Не завжди очевидно, які атрибути (імʼя користувача, групи) ви отримаєте після автентифікації в кластері. Це може бути ще складніше, якщо ви керуєте більше ніж одним кластером одночасно.

Існує підкоманда `kubectl` для перевірки атрибутів субʼєкта, таких як імʼя користувача, для вибраного контексту клієнта Kubernetes: `kubectl auth whoami`.

Докладніше про це читайте в розділі [API-доступ до інформації автентифікації клієнта](/docs/reference/access-authn-authz/authentication/#self-subject-review).

## {{% heading "whatsnext" %}} {#what-s-next}

* [Організація доступу до кластера за допомогою файлів kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
* [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)
