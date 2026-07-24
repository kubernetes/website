---
title: Налаштування доступу до декількох кластерів
content_type: task
weight: 30
card:
  name: tasks
  weight: 25
  title: Налаштування доступу до кластерів
---

<!-- overview -->

Ця сторінка показує, як налаштувати доступ до декількох кластерів за допомогою конфігураційних файлів. Після того, як ваші кластери, користувачі та контексти визначені в одному або декількох конфігураційних файлах, ви можете швидко перемикатися між кластерами, використовуючи команду `kubectl config use-context`.

{{< note >}}
Файл, що використовується для налаштування доступу до кластера, іноді називається *kubeconfig файлом*. Це загальний спосіб посилання на файли конфігурації. Це не означає, що існує файл з назвою `kubeconfig`.
{{< /note >}}

{{< warning >}}
Використовуйте kubeconfig файли тільки з надійних джерел. Використання спеціально створеного kubeconfig файлу може призвести до виконання шкідливого коду або витоку файлів. Якщо вам необхідно використовувати ненадійний kubeconfig файл, уважно перевірте його перед використанням, так само як ви б перевіряли shell скрипт.
{{< /warning >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

Щоб перевірити, чи встановлений {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}, виконайте команду `kubectl version --client`. Версія kubectl повинна бути в межах [однієї мінорної](/releases/version-skew-policy/#kubectl) версії API сервера вашого кластера.

<!-- steps -->

## Визначення кластерів, користувачів і контекстів {#define-clusters-users-contexts}

Припустимо, у вас є два кластери: один для розробки, а інший для тестування. У кластері `development` ваші фронтенд розробники працюють в просторі імен `frontend`, а розробники, які опікуються зберіганням даних працюють в просторі імен `storage`. У кластері `test` розробники працюють в стандартному просторі імен default або створюють додаткові простори імен за потреби. Доступ до кластера розробки вимагає автентифікації за сертифікатом. Доступ до тестового кластера вимагає автентифікації за іменем користувача та паролем.

Створіть теку з назвою `config-exercise`. У вашій теці `config-exercise` створіть файл з назвою `config-demo` з наступним вмістом:

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

Конфігураційний файл описує кластери, користувачів і контексти. Ваш файл `config-demo` має структуру для опису двох кластерів, двох користувачів і трьох контекстів.

Перейдіть до теки `config-exercise`. Виконайте ці команди, щоб додати деталі кластера до вашого конфігураційного файлу:

```shell
kubectl config --kubeconfig=config-demo set-cluster development --server=https://1.2.3.4 --certificate-authority=fake-ca-file
kubectl config --kubeconfig=config-demo set-cluster test --server=https://5.6.7.8 --insecure-skip-tls-verify
```

Додайте відомості про користувачів до вашого конфігураційного файлу:

{{< caution >}}
Зберігання паролів у конфігурації клієнта Kubernetes ризиковано. Краще використовувати втулок для автентифікації та зберігати паролі окремо. Дивіться: [client-go втулки автентифікації](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)
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

Додайте деталі контексту до вашого конфігураційного файлу:

```shell
kubectl config --kubeconfig=config-demo set-context dev-frontend --cluster=development --namespace=frontend --user=developer
kubectl config --kubeconfig=config-demo set-context dev-storage --cluster=development --namespace=storage --user=developer
kubectl config --kubeconfig=config-demo set-context exp-test --cluster=test --namespace=default --user=experimenter
```

Відкрийте ваш файл `config-demo`, щоб побачити додані деталі. Як альтернативу відкриттю файлу `config-demo`, можна використовувати команду `config view`.

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
    # Зберігання паролів у конфігурації клієнта Kubernetes є ризикованим.
    # Кращою альтернативою буде використання втулка облікових даних
    # і зберігати облікові дані окремо.
    # Див. https://kubernetes.io/docs/reference/access-authn-authz/authentication/client-go-credential-plugins
    password: some-password
    username: exp
```

Файли `fake-ca-file`, `fake-cert-file` та `fake-key-file` вище є заповнювачами для шляхів до сертифікатів. Вам потрібно замінити їх на реальні шляхи до сертифікатів у вашому середовищі.

Іноді ви можете захотіти використовувати дані у форматі Base64 замість окремих файлів сертифікатів; у такому випадку вам потрібно додати суфікс `-data` до ключів, наприклад, `certificate-authority-data`, `client-certificate-data`, `client-key-data`.

Кожен контекст є трійкою (кластер, користувач, простір імен). Наприклад, контекст `dev-frontend` означає: "Використовувати облікові дані користувача `developer` для доступу до простору імен `frontend` у кластері `development`".

Встановіть поточний контекст:

```shell
kubectl config --kubeconfig=config-demo use-context dev-frontend
```

Тепер, коли ви введете команду `kubectl`, дія буде застосовуватися до кластера і простору імен, вказаних у контексті `dev-frontend`. І команда буде використовувати облікові дані користувача, вказаного у контексті `dev-frontend`.

Щоб побачити лише інформацію про конфігурацію, повʼязану з поточним контекстом, використовуйте прапорець `--minify`.

```shell
kubectl config --kubeconfig=config-demo view --minify
```

Вивід показує інформацію про конфігурацію, повʼязану з контекстом `dev-frontend`:

```yaml
api

Version: v1
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

Тепер будь-яка команда `kubectl`, яку ви введете, буде застосовуватися до стандартного простору імен default кластера `test`. І команда буде використовувати облікові дані користувача, вказаного у контексті `exp-test`.

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

## Створення другого конфігураційного файлу {#create-a-second-configuration-file}

У вашій теці `config-exercise` створіть файл з назвою `config-demo-2` з наступним вмістом:

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

Вищезазначений конфігураційний файл визначає новий контекст з назвою `dev-ramp-up`.

## Встановіть змінну середовища KUBECONFIG {#set-the-kubeconfig-environment-variable}

Перевірте, чи є у вас змінна середовища з назвою `KUBECONFIG`. Якщо так, збережіть поточне значення вашої змінної середовища `KUBECONFIG`, щоб ви могли відновити її пізніше. Наприклад:

### Linux

```shell
export KUBECONFIG_SAVED="$KUBECONFIG"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG_SAVED=$ENV:KUBECONFIG
```

Змінна середовища `KUBECONFIG` є списком шляхів до конфігураційних файлів. Список розділяється двокрапкою для Linux і Mac та крапкою з комою для Windows. Якщо у вас є змінна середовища `KUBECONFIG`, ознайомтеся з конфігураційними файлами у списку.

Тимчасово додайте два шляхи до вашої змінної середовища `KUBECONFIG`. Наприклад:

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:config-demo:config-demo-2"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG=("config-demo;config-demo-2")
```

У вашій теці `config-exercise` виконайте цю команду:

```shell
kubectl config view
```

Вивід показує обʼєднану інформацію з усіх файлів, зазначених у вашій змінній середовища `KUBECONFIG`. Зокрема, зверніть увагу, що обʼєднана інформація містить контекст `dev-ramp-up` з файлу `config-demo-2` і три контексти з файлу `config-demo`:

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

Для отримання додаткової інформації про те, як обʼєднуються файли kubeconfig, дивіться [Організація доступу до кластерів за допомогою файлів kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/).

## Ознайомтеся з текою $HOME/.kube {#explore-the-home-kube-directory}

Якщо у вас вже є кластер і ви можете використовувати `kubectl` для взаємодії з кластером, то, ймовірно, у вас є файл з назвою `config` у теці `$HOME/.kube`.

Перейдіть до теки `$HOME/.kube` і перегляньте, які файли там знаходяться. Зазвичай, там є файл з назвою `config`. Також можуть бути інші конфігураційні файли у цій теці. Ознайомтеся зі змістом цих файлів.

## Додайте $HOME/.kube/config до вашої змінної середовища KUBECONFIG {#add-home-kube-config-to-your-kubeconfig-environment-variable}

Якщо у вас є файл `$HOME/.kube/config` і він ще не зазначений у вашій змінній середовища `KUBECONFIG`, додайте його до вашої змінної середовища `KUBECONFIG` зараз. Наприклад:

### Linux

```shell
export KUBECONFIG="${KUBECONFIG}:${HOME}/.kube/config"
```

### Windows PowerShell

```powershell
$Env:KUBECONFIG="$Env:KUBECONFIG;$HOME\.kube\config"
```

Перегляньте інформацію про конфігурацію, обʼєднану з усіх файлів, які зараз зазначені у вашій змінній середовища `KUBECONFIG`. У вашій теці `config-exercise` введіть:

```shell
kubectl config view
```

## Очищення {#clean-up}

Поверніть вашу змінну середовища `KUBECONFIG` до її оригінального значення. Наприклад:

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

Існує підкоманда `kubectl` для перевірки атрибутів субʼєкта, таких як імʼя користувача, для вашого вибраного контексту клієнта Kubernetes: `kubectl auth whoami`.

Детальніше читайте у [Доступ до інформації автентифікації клієнта через API](/docs/reference/access-authn-authz/authentication/#self-subject-review).

## {{% heading "whatsnext" %}}

- [Організація доступу до кластерів за допомогою файлів kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
- [kubectl config](/docs/reference/generated/kubectl/kubectl-commands#config)
