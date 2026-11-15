---
title: "Розширення kubectl за допомогою втулків"
description: "Розширюйте kubectl, створюючи та встановлюючи втулки kubectl."
content_type: task
weight: 150
---

<!-- overview -->

Цей посібник показує, як встановлювати й створювати розширення для [kubectl](/docs/reference/kubectl/kubectl/). Розглядаючи основні команди `kubectl` як базові будівельні блоки для взаємодії з кластером Kubernetes, адміністратор кластера може вважати втулки засобом використання цих блоків для створення складнішої поведінки. Втулки розширюють `kubectl` новими підкомандами, додаючи нові й власні можливості, яких немає в основному дистрибутиві `kubectl`.

## {{% heading "prerequisites" %}} {#before-you-begin}

Вам потрібен встановлений робочий бінарний файл `kubectl`.

<!-- steps -->

## Встановлення втулків для kubectl {#installing-kubectl-plugins}

Втулок — це окремий виконуваний файл, назва якого починається з `kubectl-`. Щоб установити втулок, перемістіть його виконуваний файл у будь-яке місце у вашому `PATH`.

Ви також можете шукати й встановлювати втулки kubectl із відкритим кодом за допомогою [Krew](https://krew.dev/). Krew — це менеджер втулків, який підтримує спільнота Kubernetes SIG CLI.

{{< caution >}}
Втулки kubectl, доступні через [індекс втулків](https://krew.sigs.k8s.io/plugins/) Krew, не проходять перевірки безпеки. Сторонні втулки ви встановлюєте й запускаєте на власний ризик, оскільки це довільні програми, що виконуються на вашому компʼютері.
{{< /caution >}}

### Пошук втулків {#discovering-plugins}

`kubectl` надає команду `kubectl plugin list`, яка шукає у вашому `PATH` дійсні виконувані файли втулків. Виконання цієї команди спричиняє обхід усіх файлів у вашому `PATH`. Усі файли, які є виконуваними й починаються з `kubectl-`, зʼявляться у виводі цієї команди *у тому порядку, в якому вони розташовані у вашому `PATH`*. Для всіх файлів, що починаються з `kubectl-` і *не* є виконуваними, буде показано попередження. Також буде показано попередження для всіх дійсних файлів втулків, назви яких перекривають одна одну.

Ви можете використовувати [Krew](https://krew.dev/), щоб шукати й встановлювати втулки `kubectl` з [індексу втулків](https://krew.sigs.k8s.io/plugins/), який підтримує спільнота.

#### Створення втулків {#create-plugins}

`kubectl` дозволяє втулкам додавати власні команди створення вигляду `kubectl create something`: для цього в `PATH` має бути виконуваний файл `kubectl-create-something`.

#### Обмеження {#limitations}

Наразі неможливо створити втулки, які перезаписують наявні команди `kubectl` або розширюють інші команди, крім `create`. Наприклад, якщо створити втулок `kubectl-version`, він ніколи не виконуватиметься, оскільки наявна команда `kubectl version` завжди матиме пріоритет. Через це обмеження також *не* можна використовувати втулки для додавання нових підкоманд до наявних команд `kubectl`. Наприклад, якщо додати підкоманду `kubectl attach vm`, назвавши втулок `kubectl-attach-vm`, цей втулок буде проігноровано.

`kubectl plugin list` показує попередження для всіх дійсних втулків, які намагаються це зробити.

## Написання втулків для kubectl {#writing-kubectl-plugins}

Ви можете написати втулок будь-якою мовою програмування або скриптом, що дозволяє створювати команди командного рядка.

Втулки не потребують встановлення чи попереднього завантаження. Виконувані файли втулків успадковують середовище від бінарного файлу `kubectl`. Втулок визначає шлях команди, який він реалізує, за своєю назвою. Наприклад, втулок із назвою `kubectl-foo` надає команду `kubectl foo`. Виконуваний файл втулка потрібно встановити десь у вашому `PATH`.

### Приклад втулка {#example-plugin}

```bash
#!/bin/bash

# необовʼязкова обробка аргументів
if [[ "$1" == "version" ]]
then
    echo "1.0.0"
    exit 0
fi

# необовʼязкова обробка аргументів
if [[ "$1" == "config" ]]
then
    echo "$KUBECONFIG"
    exit 0
fi

echo "I am a plugin named kubectl-foo"
```

### Використання втулка {#using-a-plugin}

Щоб використовувати втулок, зробіть його виконуваним:

```shell
sudo chmod +x ./kubectl-foo
```

і помістіть його в будь-яке місце у вашому `PATH`:

```shell
sudo mv ./kubectl-foo /usr/local/bin
```

Тепер ви можете викликати втулок як команду `kubectl`:

```shell
kubectl foo
```

```
I am a plugin named kubectl-foo
```

Усі аргументи та прапорці передаються виконуваному файлу без змін:

```shell
kubectl foo version
```

```
1.0.0
```

Усі змінні середовища також передаються виконуваному файлу без змін:

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

Крім того, першим аргументом, який передається втулку, завжди буде повний шлях до місця, де його викликано (`$0` дорівнюватиме `/usr/local/bin/kubectl-foo` у наведеному вище прикладі).

### Іменування втулків {#naming-a-plugin}

Як видно з наведеного вище прикладу, втулок визначає шлях команди, яку він реалізує, за назвою свого файлу. Усі підкоманди в шляху команди, на яку націлений втулок, розділені дефісом (`-`). Наприклад, втулок, який має викликатися щоразу, коли користувач виконує команду `kubectl foo bar baz`, матиме назву файлу `kubectl-foo-bar-baz`.

#### Обробка прапорців та аргументів {#flags-and-argument-handling}

{{< note >}}
Механізм втулків _не_ створює жодних власних, специфічних для втулка значень або змінних середовища для процесу втулка.

Старіший механізм втулків kubectl надавав змінні середовища, такі як `KUBECTL_PLUGINS_CURRENT_NAMESPACE`; тепер такого немає.
{{< /note >}}

Втулки kubectl мають самостійно розбирати та перевіряти всі передані їм аргументи. Докладніше про бібліотеку Go для авторів втулків дивіться в розділі [використання пакунка command line runtime](#using-the-command-line-runtime-package).

Нижче наведено кілька додаткових випадків, коли користувачі викликають ваш втулок із додатковими прапорцями та аргументами. Вони ґрунтуються на втулку `kubectl-foo-bar-baz` із наведеного вище сценарію.

Якщо ви виконаєте `kubectl foo bar baz arg1 --flag=value arg2`, механізм втулків kubectl спочатку спробує знайти втулок із найдовшою можливою назвою, у цьому випадку `kubectl-foo-bar-baz-arg1`. Не знайшовши такого втулка, kubectl вважатиме останнє значення, відокремлене дефісом, аргументом (тут `arg1`) і спробує знайти наступну найдовшу можливу назву, `kubectl-foo-bar-baz`. Знайшовши втулок із такою назвою, kubectl викличе його, передаючи всі аргументи й прапорці після назви втулка як аргументи процесу втулка.

Приклад:

```bash
# створимо втулок
echo -e '#!/bin/bash\n\necho "My first command-line argument was $1"' > kubectl-foo-bar-baz
sudo chmod +x ./kubectl-foo-bar-baz

# встановимо ваш втулок, перемістивши його у теку з $PATH
sudo mv ./kubectl-foo-bar-baz /usr/local/bin

# перевіримо, що kubectl розпізнав ваш втулок
kubectl plugin list
```

```
The following kubectl-compatible plugins are available:

/usr/local/bin/kubectl-foo-bar-baz
```

```
# перевірте, що виклик вашого втулка через команду "kubectl" працює
# навіть тоді, коли користувач передає додаткові аргументи та прапорці
# до виконуваного файлу вашого втулка.
kubectl foo bar baz arg1 --meaningless-flag=true
```

```
My first command-line argument was arg1
```

Як бачите, ваш втулок було знайдено за командою `kubectl`, вказаною користувачем, а всі додаткові аргументи та прапорці після цього передано виконуваному файлу втулка без змін.

#### Назви з дефісами та підкреслюваннями {#names-with-dashes-and-underscores}

Хоча механізм втулків `kubectl` використовує дефіс (`-`) у назвах файлів втулків для розділення послідовності підкоманд, які обробляє втулок, усе ж можна створити команду втулка з дефісами у виклику з командного рядка, використовуючи підкреслення (`_`) у назві файлу.

Приклад:

```bash
# створимо втулок, що містить підкреслення в назві файлу
echo -e '#!/bin/bash\n\necho "I am a plugin with a dash in my name"' > ./kubectl-foo_bar
sudo chmod +x ./kubectl-foo_bar

# перемістимо втулок у теку з $PATH
sudo mv ./kubectl-foo_bar /usr/local/bin

# тепер ви можете викликати свій втулок через kubectl:
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

Зверніть увагу, що підкреслення в назві файлу втулка не заважає використовувати команди на кшталт `kubectl foo_bar`. Команду з наведеного вище прикладу можна викликати і з дефісом (`-`), і з підкресленням (`_`):

```bash
# Ви можете викликати вашу власну команду з дефісом
kubectl foo-bar
```

```
I am a plugin with a dash in my name
```

```bash
# Ви також можете викликати свою власну команду з підкресленнями
kubectl foo_bar
```

```
I am a plugin with a dash in my name
```

#### Конфлікти назв і перекриття {#name-conflicts-and-overshadowing}

У вашому `PATH` може бути кілька втулків з однаковою назвою файлу в різних розташуваннях. Наприклад, якщо `PATH` має значення `PATH=/usr/local/bin/plugins:/usr/local/bin/moreplugins`, копія втулка `kubectl-foo` може існувати в `/usr/local/bin/plugins` і `/usr/local/bin/moreplugins`, і тоді вивід команди `kubectl plugin list` буде таким:

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

У цьому сценарії попередження під `/usr/local/bin/moreplugins/kubectl-foo` повідомляє, що цей втулок ніколи не буде виконано. Натомість механізм втулків `kubectl` завжди спершу знайде й виконає файл, який першим трапляється у вашому `PATH`, тобто `/usr/local/bin/plugins/kubectl-foo`.

Щоб розвʼязати цю проблему, переконайтеся, що розташування втулка, який ви хочете використовувати з `kubectl`, завжди стоїть першим у вашому `PATH`. Наприклад, якщо ви хочете завжди використовувати `/usr/local/bin/moreplugins/kubectl-foo` під час виклику команди `kubectl foo`, змініть значення `PATH` на `/usr/local/bin/moreplugins:/usr/local/bin/plugins`.

#### Виклик за найдовшою назвою виконуваного файлу {#invocation-of-the-longest-executable-filename}

Існує ще один вид перекриття, який може виникнути з назвами файлів втулків. Якщо в `PATH` користувача є два втулки, `kubectl-foo-bar` і `kubectl-foo-bar-baz`, механізм втулків `kubectl` завжди вибиратиме найдовшу можливу назву втулка для заданої команди користувача. Наведені нижче приклади це пояснюють:

```bash
# для заданої команди kubectl завжди вибиратиметься втулок із найдовшою можливою назвою файлу
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

Таке проєктне рішення гарантує, що підкоманди втулка можна за потреби реалізувати в кількох файлах і вкладати їх під «батьківську» команду втулка:

```bash
ls ./plugin_command_tree
```

```
kubectl-parent
kubectl-parent-subcommand
kubectl-parent-subcommand-subsubcommand
```

### Перевірка на наявність попереджень втулків {#checking-for-plugin-warnings}

Ви можете скористатися згаданою вище командою `kubectl plugin list`, щоб переконатися, що `kubectl` бачить ваш втулок, і перевірити, що немає попереджень, які заважають викликати його як команду `kubectl`.

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

### Використання пакунка command line runtime {#using-the-command-line-runtime-package}

Якщо ви пишете втулок для kubectl мовою Go, ви можете скористатися допоміжними бібліотеками [cli-runtime](https://github.com/kubernetes/cli-runtime).

Ці бібліотеки надають допоміжні засоби для розбору чи оновлення файлу [kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/) користувача, для виконання запитів у стилі REST до API-сервера або для привʼязування прапорців, повʼязаних із конфігурацією та виводом.

Приклад використання інструментів із репозиторію CLI Runtime дивіться в [Sample CLI Plugin](https://github.com/kubernetes/sample-cli-plugin).

## Розповсюдження втулків для kubectl {#distributing-kubectl-plugins}

Якщо ви розробили втулок для інших користувачів, варто подумати, як ви його пакуватимете, розповсюджуватимете й доставлятимете оновлення своїм користувачам.

### Krew {#distributing-krew}

[Krew](https://krew.dev/) пропонує кросплатформний спосіб пакування й розповсюдження ваших втулків. Так ви використовуєте єдиний формат пакування для всіх цільових платформ (Linux, Windows, macOS тощо) і доставляєте оновлення своїм користувачам. Krew також підтримує [індекс втулків](https://krew.sigs.k8s.io/plugins/), щоб інші люди могли знайти ваш втулок і встановити його.

### Нативне / платформозалежне керування пакунками {#distributing-native}

Також ви можете використовувати традиційні менеджери пакунків, такі як `apt` або `dnf` у Linux, Chocolatey у Windows і Homebrew у macOS. Підійде будь-який менеджер пакунків, який може розмістити нові виконувані файли десь у `PATH` користувача. Якщо ви як автор втулка обираєте цей варіант, вам також доведеться оновлювати пакунок розповсюдження вашого втулка kubectl на кількох платформах для кожного випуску.

### Вихідний код {#distributing-source-code}

Ви можете опублікувати вихідний код, наприклад як репозиторій Git. Якщо ви обираєте цей варіант, той, хто хоче використовувати цей втулок, має отримати код, налаштувати середовище збірки (якщо потрібна компіляція) і розгорнути втулок. Якщо ви також надаєте скомпільовані пакунки або використовуєте Krew, встановлення стане простішим.

## {{% heading "whatsnext" %}} {#what-s-next}

* Перегляньте репозиторій Sample CLI Plugin, де є [докладний приклад](https://github.com/kubernetes/sample-cli-plugin) втулка, написаного мовою Go. Якщо виникнуть запитання, звертайтеся до [команди SIG CLI](https://github.com/kubernetes/community/tree/main/sig-cli).
* Прочитайте про [Krew](https://krew.dev/), менеджер пакунків для втулків kubectl.
