---
title: Генерація документації для команд kubectl
content_type: task
weight: 90
---

<!-- overview -->

Ця сторінка показує, як згенерувати довідкову документацію для команд `kubectl`.

{{< note >}}
Ця тема показує, як згенерувати довідкову документацію для [команд kubectl](/docs/reference/generated/kubectl/kubectl-commands) таких як [kubectl apply](/docs/reference/generated/kubectl/kubectl-commands#apply) та [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint). Ця тема не показує, як згенерувати сторінку довідки для [опцій kubectl](/docs/reference/generated/kubectl/kubectl-commands/). Для інструкцій про те, як згенерувати довідкову сторінку опцій kubectl, дивіться [Генерація довідкових сторінок для компонентів та інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/).
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Налаштування локальних репозиторіїв {#set-up-the-local-repositories}

Створіть локальне робоче середовище і встановіть ваш `GOPATH`:

```shell
mkdir -p $HOME/<workspace>

export GOPATH=$HOME/<workspace>
```

Отримайте локальну копію наступних репозиторіїв:

```shell
go get -u github.com/spf13/pflag
go get -u github.com/spf13/cobra
go get -u gopkg.in/yaml.v2
go get -u github.com/kubernetes-sigs/reference-docs
```

Якщо у вас ще немає репозиторію kubernetes/website, отримайте його зараз:

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

Отримайте копію репозиторію kubernetes/kubernetes як k8s.io/kubernetes:

```shell
git clone https://github.com/kubernetes/kubernetes $GOPATH/src/k8s.io/kubernetes
```

Видаліть пакет spf13 з `$GOPATH/src/k8s.io/kubernetes/vendor/github.com`:

```shell
rm -rf $GOPATH/src/k8s.io/kubernetes/vendor/github.com/spf13
```

Репозиторій kubernetes/kubernetes надає вихідний код `kubectl` і `kustomize`.

* Визначте основну теку вашої копії репозиторію [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes). Наприклад, якщо ви слідували попередньому кроку для отримання репозиторію, ваша основна тека є `$GOPATH/src/k8s.io/kubernetes`. Подальші кроки використовують цю основну теку як `<k8s-base>`.

* Визначте основну теку вашої копії репозиторію [kubernetes/website](https://github.com/kubernetes/website). Наприклад, якщо ви слідували попередньому кроку для отримання репозиторію, ваша основна тека є `$GOPATH/src/github.com/<your-username>/website`. Подальші кроки використовують цю основну теку як `<web-base>`.

* Визначте основну теку вашої копії [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) репозиторію. Наприклад, якщо ви слідували попередньому кроку для отримання репозиторію, ваша основна тека є `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`. Подальші кроки використовують цю основну теку як `<rdocs-base>`.

У вашій локальній копії k8s.io/kubernetes перевірте гілку інтересу і переконайтеся, що вона актуальна. Наприклад, якщо ви хочете згенерувати документацію для Kubernetes {{< skew prevMinorVersion >}}.0, ви можете використати ці команди:

```shell
cd <k8s-base>
git checkout v{{< skew prevMinorVersion >}}.0
git pull https://github.com/kubernetes/kubernetes {{< skew prevMinorVersion >}}.0
```

Якщо вам не потрібно редагувати вихідний код `kubectl`, дотримуйтесь інструкцій для [Налаштування змінних для зборки](#set-build-variables).

## Редагування вихідного коду kubectl {#edit-the-kubectl-source-code}

Документація довідки для команд kubectl автоматично генерується з вихідного коду kubectl. Якщо ви хочете змінити довідкову документацію, перший крок — змінити один або кілька коментарів у вихідному коді kubectl. Змініть їх у вашій локальній копії репозиторію kubernetes/kubernetes, а потім подайте pull request до основної гілки [github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files)
є прикладом pull requestг, який виправляє помилку в вихідному коді kubectl.

Слідкуйте за вашим pull request і відповідайте на коментарі рецензентів. Продовжуйте слідкувати за вашим pull request до його злиття в цільову гілку репозиторію kubernetes/kubernetes.

## Cherry pick вашої зміни до релізної гілки {#cherry-pick-your-change-into-a-release-branch}

Ваша зміна тепер знаходиться в основній гілці, яка використовується для розробки наступного випуску Kubernetes. Якщо ви хочете, щоб ваша зміна зʼявилася в документації для версії Kubernetes, яка вже була випущена, вам потрібно запропонувати, щоб вашу зміну було вибрано для релізної гілки.

Наприклад, припустимо, що основна гілка використовується для розробки Kubernetes {{< skew currentVersion >}} і ви хочете повернути вашу зміну до релізної гілки release-{{< skew prevMinorVersion >}}. Для інструкцій про те, як це зробити, дивіться [Пропонування вибірки](/docs/contribute/generate-ref-docs/kubernetes-components/).

Слідкуйте за вашим запитом на вибірку до його злиття в релізну гілку.

{{< note >}}
Пропонування вибірки вимагає, щоб ви мали дозвіл на встановлення мітки та віхи у вашому pull request. Якщо у вас немає таких прав, вам знадобиться допомога когось, хто може встановити мітку та віху для вас.
{{< /note >}}

## Налаштування змінних для збірки {#set-build-variables}

Перейдіть до `<rdocs-base>`. У командному рядку встановіть наступні змінні середовища.

* Встановіть `K8S_ROOT` на `<k8s-base>`.
* Встановіть `K8S_WEBROOT` на `<web-base>`.
* Встановіть `K8S_RELEASE` на версію документації, яку ви хочете зібрати. Наприклад, якщо ви хочете зібрати документацію для Kubernetes {{< skew prevMinorVersion >}}, встановіть `K8S_RELEASE` на {{< skew prevMinorVersion >}}.

Наприклад:

```shell
export K8S_WEBROOT=$GOPATH/src/github.com/<your-username>/website
export K8S_ROOT=$GOPATH/src/k8s.io/kubernetes
export K8S_RELEASE={{< skew prevMinorVersion >}}
```

## Створення теки версії {#creating-a-versioned-directory}

Ціль збірки `createversiondirs` створює версійну теку і копіює конфігураційні файли довідки для kubectl до теки версії. Назва теки версії слідує шаблону `v<major>_<minor>`.

У теці `<rdocs-base>` виконайте наступну ціль зборки:

```shell
cd <rdocs-base>
make createversiondirs
```

## Перевірте теґ релізу у k8s.io/kubernetes {#checkout-a-release-tag-in-k8s-io-kubernetes}

У вашій локальній копії `<k8s-base>` перевірте гілку, яка містить версію Kubernetes, яку ви хочете задокументувати. Наприклад, якщо ви хочете згенерувати документацію для Kubernetes {{< skew prevMinorVersion >}}.0, перевірте теґ `v{{< skew prevMinorVersion >}}`. Переконайтеся, що ваша локальна гілка актуальна.

```shell
cd <k8s-base>
git checkout v{{< skew prevMinorVersion >}}.0
git pull https://github.com/kubernetes/kubernetes v{{< skew prevMinorVersion >}}.0
```

## Запустіть код генерації документації {#run-the-doc-generation-code}

У вашій локальній копії `<rdocs-base>`, виконайте ціль зборки `copycli`. Команда запускається як `root`:

```shell
cd <rdocs-base>
make copycli
```

Команда `copycli` очищує тимчасову теку збірки, генерує файли команд kubectl і копіює зведену HTML-сторінку довідки команд kubectl та активи до `<web-base>`.

## Знайдіть згенеровані файли {#locate-the-generated-files}

Перевірте, чи ці два файли були згенеровані:

```shell
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

## Знайдіть скопійовані файли {#locate-the-copied-files}

Перевірте, чи всі згенеровані файли були скопійовані до вашої `<web-base>` теки:

```shell
cd <web-base>
git status
```

Вивід має включати змінені файли:

```none
static/docs/reference/generated/kubectl/kubectl-commands.html
static/docs/reference/generated/kubectl/navData.js
```

Вивід також може включати:

```none
static/docs/reference/generated/kubectl/scroll.js
static/docs/reference/generated/kubectl/stylesheet.css
static/docs/reference/generated/kubectl/tabvisibility.js
static/docs/reference/generated/kubectl/node_modules/bootstrap/dist/css/bootstrap.min.css
static/docs/reference/generated/kubectl/node_modules/highlight.js/styles/default.css
static/docs/reference/generated/kubectl/node_modules/jquery.scrollto/jquery.scrollTo.min.js
static/docs/reference/generated/kubectl/node_modules/jquery/dist/jquery.min.js
static/docs/reference/generated/kubectl/node_modules/font-awesome/css/font-awesome.min.css
```

## Локально протестуйте документацію {#locally-test-the-documentation}

Побудуйте документацію Kubernetes у вашій локальній копії `<web-base>`.

```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # якщо не було зроблено раніше
make container-serve
```

Перегляньте [локальний попередній перегляд](/docs/reference/generated/kubectl/kubectl-commands/).

## Додайте та зафіксуйте зміни в kubernetes/website {#add-and-commit-changes-in-kubernetes-website}

Запустіть `git add` та `git commit`, щоб зафіксувати файли.

## Створіть pull request {#create-a-pull-request}

Створіть pull request до репозиторію `kubernetes/website`. Слідкуйте за вашим pull request і відповідайте на коментарі рецензентів за потреби. Продовжуйте слідкувати за вашим pull request до його злиття.

Через кілька хвилин після злиття вашого pull request оновлені теми довідки стануть видимими в [опублікованій документації](/docs/home).

## {{% heading "whatsnext" %}}

* [Швидкий старт генерування довідкової документації](/docs/contribute/generate-ref-docs/quickstart/)
* [Генерація довідкової документації для компонентів і інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерація довідкової документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/)
