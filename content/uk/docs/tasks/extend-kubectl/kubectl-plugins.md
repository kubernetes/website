---
title: "Розширення kubectl за допомогою втулків"
description: "Дізнайтеся, як розширити kubectl за допомогою втулків."
content_type: task
weight: 150
---

<!-- Overview -->

Цей посібник демонструє, як встановлювати та створювати розширення для [kubectl](/docs/reference/kubectl/kubectl/). Вважаючи основні команди `kubectl` основними будівельними блоками для взаємодії з кластером Kubernetes, адміністратор кластера може розглядати втулки як засіб використання цих будівельних блоків для створення складнішої поведінки. Втулки розширюють `kubectl` новими підкомандами, що дозволяє використовувати нові та власні функції, які не входять до основного дистрибутиву `kubectl`.

## {{% heading "prerequisites" %}}

Вам потрібно мати встановлений працюючий бінарний файл `kubectl`.

<!-- steps -->

## Встановлення втулків для kubectl {#installing-kubectl-plugins}

Втулок — це автономний виконуваний файл, назва якого починається з `kubectl-`. Для встановлення втулка перемістіть його виконуваний файл до будь-якої теки, що знаходиться в вашому `PATH`.

Ви також можете знайти та встановити втулки для `kubectl`, наявні у відкритому доступі, за допомогою [Krew](https://krew.dev/). Krew — це менеджер втулків, підтримуваний спільнотою Kubernetes SIG CLI.

{{< caution >}}
Втулки для `kubectl`, доступні через [індекс втулків Krew](https://krew.sigs.k8s.io/plugins/), не перевіряються на безпеку. Ви повинні встановлювати та запускати втулки на власний розсуд, оскільки це довільні програми, що виконуються на вашому компʼютері.
{{< /caution >}}

### Пошук втулків {#discovering-plugins}

`kubectl` надає команду `kubectl plugin list`, яка оглядає ваш `PATH` для відповідних виконуваних файлів втулків. Виконання цієї команди призводить до огляду всіх файлів у вашому `PATH`. Будь-які файли, які є виконуваними та починаються з `kubectl-`, зʼявляться *в порядку їх розташування в вашому `PATH`* у виводі цієї команди. Для будь-яких файлів, що починаються з `kubectl-` та *не* є виконуваними, буде додано попередження. Також буде додане попередження для будь-яких вірних файлів втулків, назви яких перекриваються.

Ви можете використовувати [Krew](https://krew.dev/), щоб шукати та встановлювати втулки для `kubectl` з [індексу втулків](https://krew.sigs.k8s.io/plugins/), який підтримується спільнотою.

#### Створення втулків {#create-plugins}

`kubectl` дозволяє втулкам додавати власні команди у вигляді `kubectl create something` шляхом створення виконуваного файлу з іменем `kubectl-create-something` та розміщення його в вашому `PATH`.

#### Обмеження

Зараз неможливо створити втулки, які перезаписують чинні команди `kubectl` або розширюють команди відмінні від `create`. Наприклад, створення втулка `kubectl-version` призведе до того, що цей втулок ніколи не буде виконаний, оскільки наявна команда `kubectl version` завжди матиме пріоритет. За цим обмеженням також *не* можна використовувати втулки для додавання нових підкоманд до наявних команд `kubectl`. Наприклад, додавання підкоманди `kubectl attach vm`, назвавши свій втулок `kubectl-attach-vm`, призведе до його ігнорування.

`kubectl plugin list` виводить попередження для будь-яких вірних втулків, які намагаються це зробити.

## Написання втулків для kubectl {#writing-kubectl-plugins}

Ви можете написати втулок будь-якою мовою програмування або скриптом, який дозволяє вам створювати команди для командного рядка.

Для втулків не потрібно жодної установки чи попереднього завантаження. Виконувані файли втулків успадковують середовище від бінарного файлу `kubectl`. Втулок визначає, який шлях команди він бажає реалізувати на основі свого імені. Наприклад, втулок з іменем `kubectl-foo` надає команду `kubectl foo`. Вам потрібно встановити виконуваний файл втулка десь у вашому `PATH`.

### Приклад втулка {#example-plugin}

```bash
#!/bin/bash

# optional argument handling
if [[ "$1" == "version" ]]
then
    echo "1.0.0"
    exit 0
fi

# optional argument handling
if [[ "$1" == "config" ]]
then
    echo "$KUBECONFIG"
    exit 0
fi

echo "I am a plugin named kubectl-foo"
```

### Користування втулком {#using-a-plugin

Для використання втулка зробіть його виконуваним:

```shell
sudo chmod +x ./kubectl-foo
```

та помістіть його в теку, яка знаходиться в вашому `PATH`:

```shell
sudo mv ./kubectl-foo /usr/local/bin
```

Тепер ви можете викликати втулок, використовуючи `kubectl foo`:

```shell
kubectl foo
```

```
I am a plugin named kubectl-foo
```

Всі аргументи та прапорці, передаються втулку як-вони-є для виконання:

```shell
kubectl foo version
```

```
1.0.0
```

Всі змінні оточення також передається у вигляді як-вони-є:

```bash
export KUBECONFIG=~/.kube/config
kubectl foo config
```

```
/home/<user>/.kube/config
```

```shell
KUBECONFIG=/etc/kube/config kubectl foo config
```

```
/etc/kube/config
```

Крім того, перший аргумент, який передається втуку, завжди буде повним шляхом до місця, де його було викликано (`$0` буде дорівнювати `/usr/local/bin/kubectl-foo` в прикладі вище).

### Іменування втулків {#naming-a-plugin}

Як видно в прикладі вище, втулок визначає шлях команди, яку він буде реалізовувати, на основі свого імені файлу. Кожна підкоманда в шляху, для якої використовується втулок, розділена дефісом (`-`). Наприклад, втулок, який бажає запускатись, коли користувач викликає команду `kubectl foo bar baz`, матиме імʼя файлу `kubectl-foo-bar-baz`.

#### Обробка прапорців та аргументів {#flag-and-argument-handling}

{{< note >}}
Механізм втулків не створює жодних специфічних для втулків значень або змінних середовища для процесу втулка.

Раніше існувавший механізм втулків kubectl надавав змінні середовища, такі як `KUBECTL_PLUGINS_CURRENT_NAMESPACE`; таке вже не відбувається.
{{< /note >}}

Втулки kubectl повинні розбирати та перевіряти всі передані їм аргументи. Див. [використання пакета command line runtime](#using-the-command-line-runtime-package) для отримання відомостей про бібліотеку Go, призначену на авторів втулків.

Нижче наведено кілька додаткових випадків, коли користувачі викликають ваш втулок, надаючи додаткові прапорці та аргументи. Розберемо це на прикладі втулка `kubectl-foo-bar-baz` з вищезазначеного сценарію.

Якщо ви виконуєте `kubectl foo bar baz arg1 --flag=value arg2`, механізм втулків kubectl спочатку намагатиметься знайти втулок з найдовшим можливим імʼям, що в цьому випадку буде `kubectl-foo-bar-baz-arg1`. Не знайшовши цього втулка, kubectl тоді розглядає останнє значення, розділене дефісами, як аргумент (тут `arg1`) та намагається знайти наступне найдовше можливе імʼя, `kubectl-foo-bar-baz`. Знайшовши втулок з таким імʼям, kubectl викликає цей втулок, передаючи всі аргументи та прапорці після імені втулка як аргументи для процесу втулка.

Приклад:

```bash
# створимо втулок
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# "iвстановимо" ваш втулок перемістивши його у теку з $PATH
sudo mv ./kubectl-foo-bar-baz /usr/local/bin

# перевіримо, що kubectl розпізнав ваш втулок
kubectl plugin list
```

```none
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-foo-bar-baz
```

```shell
# перевірте, що виклик вашого втулка через команду "kubectl" працює
# навіть тоді, коли користувач передає додаткові аргументи та прапорці
# до виконуваного користувачем виконуваного файлу вашого втулка.

kubectl foo bar baz arg1 --meaningless-flag=true
```

```none
My first command-line argument was arg1
```

Як бачите, ваш втулок було знайдено на основі команди `kubectl`, вказаної користувачем, і всі додаткові аргументи та прапорці були передані як є до виконуваного файлу втулка після того, як його було знайдено.

#### Назви з дефісами та підкреслюваннями {#names-with-dashes-and-underscores}

Хоча механізм втулків `kubectl` використовує дефіси (`-`) у іменах файлів втулків для розділення послідовності підкоманд, оброблених втулком, все ж можна створити втулок з іменем, що містить дефіс в його виклику з командного рядка, використовуючи підкреслення (`_`) у його імені файлу.

Приклад:

```bash
# створимо втулок, що містить підкреслення в назві файлу
echo -e '#!/bin/bash\n\necho "I am a plugin with a dash in my name"' > ./kubectl-foo_bar
sudo chmod +x ./kubectl-foo_bar

# перемістимо втулок у теку з $PATH
sudo mv ./kubectl-foo_bar /usr/local/bin

# тепер ви можете викликати ваш втулок через kubectl:
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

Зауважте, що додавання підкреслення в імʼя файлу втулка не заважає створенню команд, таких як `kubectl foo_bar`. Команду з прикладу вище можна викликати як з дефісом (`-`), так і з підкресленням (`_`):

```bash
# Ви можете викликати вашу власну команду з дефісом
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

```bash
# Ви ткаож можете викликати свою власну команду з підкресленнями
kubectl foo_bar
```

```
I am a plugin with a dash in my name
```

#### Конфлікти імен та затьмарення {#name-conflicts-and-overshadowing}

Можливе існування кількох втулків з однаковою назвою файлу в різних розташуваннях у вашому `PATH`. Наприклад, при наступному значенні `PATH`: `PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins`, копія втулка `kubectl-foo` може існувати в `/usr/local/bin/plugins` та `/usr/local/bin/moreplugins`, так що результат виклику команди `kubectl plugin list` буде наступним:

```bash
PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/plugins/kubectl-foo
/usr/local/bin/moreplugins/kubectl-foo
  - warning: /usr/local/bin/moreplugins/kubectl-foo is overshadowed by a similarly named plugin: /usr/local/bin/plugins/kubectl-foo

error: one plugin warning was found
```

У вказаному вище сценарії попередження під `/usr/local/bin/moreplugins/kubectl-foo` говорить вам, що цей втулок ніколи не буде виконано. Замість цього виконується файл, який зʼявляється першим у вашому `PATH`, `/usr/local/bin/plugins/kubectl-foo`, завдяки механізму втулків `kubectl`.

Спосіб розвʼязання цієї проблеми — переконатися, що розташування втулка, яким ви хочете скористатися з `kubectl`, завжди стоїть на першому місці в вашому `PATH`. Наприклад, якщо ви хочете завжди використовувати `/usr/local/bin/moreplugins/kubectl-foo` в будь-який раз, коли викликається команда `kubectl foo`, змініть значення вашого `PATH` на `/usr/local/bin/moreplugins:/usr/local/bin/plugins`.

#### Виклик найдовшого імені виконуваного файлу {#invocation-of-the-longest-executable-name}

Є ще один вид перекриття, який може виникнути з іменами втулків. Допустимо, є два втулки у шляху користувача: `kubectl-foo-bar` та `kubectl-foo-bar-baz`. Механізм втулків `kubectl` завжди вибиратиме найдовше можливе імʼя втулка для заданої команди користувача. Нижче наведено деякі приклади, які докладніше пояснюють це:

```bash
# для заданої команди `kubectl` завжди буде вибиратися втулок з найдовшим можливим іменем файла
kubectl foo bar baz
```

```
Plugin kubectl-foo-bar-baz is executed
```

```bash
kubectl foo bar
```

```
Plugin kubectl-foo-bar is executed
```

```bash
kubectl foo bar baz buz
```

```
Plugin kubectl-foo-bar-baz is executed, with "buz" as its first argument
```

```bash
kubectl foo bar buz
```

```
Plugin kubectl-foo-bar is executed, with "buz" as its first argument
```

Цей вибір дизайну гарантує, що підкоманди втулків можуть бути реалізовані у кількох файлах, якщо це необхідно, і що ці підкоманди можуть бути вкладені під "батьківською" командою втулка:

```bash
ls ./plugin_command_tree
```

```
kubectl-parent
kubectl-parent-subcommand
kubectl-parent-subcommand-subsubcommand
```

### Перевірка на наявність попереджень втулків {#checking-for-plugin-warnings}

Ви можете скористатися вищезазначеною командою `kubectl plugin list`, щоб переконатися, що ваш втулок можна викликати за допомогою `kubectl`, та перевірити, чи немає попереджень, які перешкоджають його виклику як команди `kubectl`.

```bash
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

test/fixtures/pkg/kubectl/plugins/kubectl-foo
/usr/local/bin/kubectl-foo
  - warning: /usr/local/bin/kubectl-foo is overshadowed by a similarly named plugin: test/fixtures/pkg/kubectl/plugins/kubectl-foo
plugins/kubectl-invalid
  - warning: plugins/kubectl-invalid identified as a kubectl plugin, but it is not executable

error: 2 plugin warnings were found
```

### Використання пакунка виконання командного рядка {#using-the-command-line-runtime-package}

Якщо ви пишете втулку для kubectl і використовуєте Go, ви можете скористатися [cli-runtime](https://github.com/kubernetes/cli-runtime) бібліотеками.

Ці бібліотеки надають помічників для парсингу або оновлення файлу [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) користувача, для виконання запитів REST до API-сервера або звʼязування прапорців повʼязаних з конфігурацією та друком.

Перегляньте [Sample CLI Plugin](https://github.com/kubernetes/sample-cli-plugin) для прикладу використання інструментів, які надаються у репозиторії CLI Runtime.

## Розповсюдження втулків для kubectl {#distributing-kubectl-plugins}

Якщо ви розробили втулок для того, щоб інші користувачі могли його використовувати, вам слід розглянути, як ви його пакуєте, розповсюджуєте і надаєте оновлення для користувачів.

### Krew {#distributing-krew}

[Krew](https://krew.dev/) пропонує крос-платформний спосіб пакування та розповсюдження ваших втулків. Таким чином, ви використовуєте єдиний формат пакування для всіх цільових платформ (Linux, Windows, macOS і т.д.) і надаєте оновлення користувачам. Krew також підтримує [індекс втулків](https://krew.sigs.k8s.io/plugins/), щоб інші люди могли знайти ваш втулок та встановлювати його.

### Нативне / платформозалежне керування пакетами {#distributing-native}

З іншого боку, ви можете використовувати традиційні системи керування пакунками, такі як `apt` або `yum` в Linux, Chocolatey в Windows і Homebrew в macOS. Будь-який менеджер пакунків підійде, якщо він може розмістити нові виконувані файли в теці `PATH` користувача. Як автор втулка, якщо ви обираєте цей варіант, вам також слід покласти на себе тягар оновлення пакунка для розповсюдження ваших втулків для kubectl для кожного релізу на кожній платформі.

### Сирці {#distributing-source-code}

Ви можете публікувати сирці, наприклад, як Git-репозиторій. Якщо ви обираєте цей варіант, той, хто хоче використовувати цей втулок, повинен витягти код, налаштувати середовище збірки (якщо він потребує компіляції) та використовувати втулок. Якщо ви також надаєте доступні скомпільовані пакунки або використовуєте Krew, це спростить процес встановлення.

## {{% heading "whatsnext" %}}

* Перегляньте репозиторій [Sample CLI Plugin](https://github.com/kubernetes/sample-cli-plugin) для детального прикладу втулка, написаного на Go.
* У разі будь-яких питань, не соромтеся звертатися до [команди SIG CLI](https://github.com/kubernetes/community/tree/master/sig-cli).
* Дізнайтеся більше про [Krew](https://krew.dev/), менеджер пакунків для втулків kubectl.
