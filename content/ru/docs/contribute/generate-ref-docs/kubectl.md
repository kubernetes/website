---
title: Генерация справочной документации для команд kubectl
content_type: task
weight: 90
---

<!-- overview -->

На этой странице показано, как сгенерировать справочник для команды `kubectl`.

{{< note >}}
На этой странице показывается, как сгенерировать справочную документацию для таких [команд kubectl](/ru/docs/reference/generated/kubectl/kubectl-commands), как [kubectl apply](/ru/docs/reference/generated/kubectl/kubectl-commands#apply) и [kubectl taint](/ru/docs/reference/generated/kubectl/kubectl-commands#taint).
Этот раздел не рассматривает генерацию справочной страницы для опций [kubectl](/ru/docs/reference/generated/kubectl/kubectl/). Инструкции по генерации справочной страницы опций kubectl смотрите в разделе [Генерация справочной документации для компонентов и инструментов Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-components/).
{{< /note >}}



## {{% heading "prerequisites" %}}


{{< include "prerequisites-ref-docs.md" >}}



<!-- steps -->

## Настройка локальных репозиториев

Создайте рабочую область и определите переменную окружения `GOPATH`.

```shell
mkdir -p $HOME/<workspace>

export GOPATH=$HOME/<workspace>
```

Загрузите локальные копии следующих репозиториев:

```shell
go get -u github.com/spf13/pflag
go get -u github.com/spf13/cobra
go get -u gopkg.in/yaml.v2
go get -u kubernetes-sigs/reference-docs
```

Если у вас ещё нет копии репозитория kubernetes/website, клонируйте её на свой компьютер:

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

Склонируйте репозиторий kubernetes/kubernetes по пути k8s.io/kubernetes:

```shell
git clone https://github.com/kubernetes/kubernetes $GOPATH/src/k8s.io/kubernetes
```

Удалите пакет spf13 в `$GOPATH/src/k8s.io/kubernetes/vendor/github.com`.

```shell
rm -rf $GOPATH/src/k8s.io/kubernetes/vendor/github.com/spf13
```

В репозитории kubernetes/kubernetes использует исходный код `kubectl` и `kustomize`.

* Определите базовую директорию вашей копии репозитория [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Например, если вы выполнили предыдущий шаг, чтобы получить репозиторий, вашей базовой директорией будет `$GOPATH/src/k8s.io/kubernetes`.
В остальных командах базовая директория будет именоваться как `<k8s-base>`.

* Определите базовую директорию вашей копии репозитория [kubernetes/website](https://github.com/kubernetes/website).
Например, если вы выполнили предыдущий шаг, чтобы получить репозиторий, вашей базовой директорией будет `$GOPATH/src/github.com/<your-username>/website`.
В остальных команд базовая директория будет именоваться как `<web-base>`.

* Определите базовую директорию вашей копии репозитория [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs).
Например, если вы выполнили предыдущий шаг, чтобы получить репозиторий, вашей базовой директорией будет `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
В остальных команд базовая директория будет именоваться как `<rdocs-base>`.

В вашем локальном репозитории k8s.io/kubernetes переключитесь в нужную вам ветку и убедитесь, что она в актуальном состоянии. Например, если вам нужно сгенерировать документацию для Kubernetes 1.17, вы можете использовать эти команды:

```shell
cd <k8s-base>
git checkout v1.17.0
git pull https://github.com/kubernetes/kubernetes v1.17.0
```

Если вам не нужно изменять исходный код `kubectl`, следуйте инструкциям по [определению переменных сборки](#настройка-переменных-для-сборки).

## Редактирование исходного кода kubectl

Справочная документация по команде kubectl генерируется автоматически из исходного кода kubectl. Если вы хотите изменить справочную документацию, сначала измените один или несколько комментариев в исходном коде kubectl. Сделайте изменения в локальный репозиторий kubernetes/kubernetes, а затем отправьте пулреквест в ветку master репозитория [github.com/kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).

[PR 56673](https://github.com/kubernetes/kubernetes/pull/56673/files) — пример пулреквеста, который исправляет опечатку в исходном коде kubectl.

Отслеживайте пулреквест и по мере необходимости отвечайте на комментарии рецензента. Не забывайте отслеживать активность в пулреквест до тех пор, пока он не будет принят в ветку master репозитория kubernetes/kubernetes.

## Применение вашего изменения в ветку выпуска

Теперь ваше изменение в ветке master, которая используется для разработки следующего выпуска Kubernetes. Если вы хотите добавить ваше изменение в документацию для уже выпущенной версии Kubernetes, вам нужно применить коммит с соответствующим изменением в нужную ветку выпуска.

Например, предположим, что ветка master используется для разработки Kubernetes 1.10, а вам нужно бэкпортировать ваше изменение в ветку release-1.15. За инструкциями обратитесь к странице [Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

Отслеживайте ваш пулреквест с применённым изменением до тех пор, пока он не будет объединён в ветку выпуска.

{{< note >}}
Применение коммита требует наличия возможности добавить метку и этап в вашем пулреквесте. Если у вас нет таких разрешений, вам нужно переговорить с кем-то, кто может сделать это для вас.
{{< /note >}}

## Настройка переменных для сборки

Перейдите на `<rdocs-base>`. В командной строке установите следующие переменные окружения.

* `K8S_ROOT` со значением `<k8s-base>`.
* `WEB_ROOT` со значением  `<web-base>`.
* `K8S_RELEASE` со значением нужной версии документации.
  Например, если вы хотите собрать документацию для Kubernetes версии 1.17, определите переменную окружения `K8S_RELEASE` со значением 1.17.

Примеры:

```shell
export WEB_ROOT=$(GOPATH)/src/github.com/<your-username>/website
export K8S_ROOT=$(GOPATH)/src/k8s.io/kubernetes
export K8S_RELEASE=1.17
```

## Создание версионированной директории

Скрипт сборки `createversiondirs` создаёт версионированную директорию и копирует туда конфигурационные файлы справочника kubectl.
Имя версионированной директории имеет следующий вид: `v<major>_<minor>`.

В директории `<rdocs-base>` выполнение следующий скрипт сборки:

```shell
cd <rdocs-base>
make createversiondirs
```

## Переход в тег выпуска в k8s.io/kubernetes

В вашем локальном репозитории `<k8s-base>` перейдите в ветку с версией Kubernetes, для которой вы хотите получить документацию. Например, если вы хотите сгенерировать документацию для Kubernetes 1.17, перейдите в тег `v1.17.0`. Убедитесь, что ваша локальная ветка содержит актуальные изменения.

```shell
cd <k8s-base>
git checkout v1.17.0
git pull https://github.com/kubernetes/kubernetes v1.17.0
```

## Выполнение кода для генерации документации

В вашей локальной директории `<rdocs-base>` запустите скрипт сборки `copycli`. Команда выполняется от пользователя `root`:

```shell
cd <rdocs-base>
make copycli
```

Команда `copycli` удаляет временную директорию сборки, генерирует файлы команды kubectl и копирует полученную HTML-страницу справочника команде kubectl и ресурсы в `<web-base>`.

## Проверка сгенерированных файлов

Убедитесь в том, что перечисленные ниже два файлы были сгенерированы:

```shell
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-kubectldocs/generators/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

## Проверка скопированных файлов

Убедитесь в том, все сгенерированные файлы были скопированы в вашу директорию `<web-base>`:

```shell
cd <web-base>
git status
```

В выводе должны перечислены изменённые файлы:

```
static/docs/reference/generated/kubectl/kubectl-commands.html
static/docs/reference/generated/kubectl/navData.js
```

Также в выводе должно быть:

```
static/docs/reference/generated/kubectl/scroll.js
static/docs/reference/generated/kubectl/stylesheet.css
static/docs/reference/generated/kubectl/tabvisibility.js
static/docs/reference/generated/kubectl/node_modules/bootstrap/dist/css/bootstrap.min.css
static/docs/reference/generated/kubectl/node_modules/highlight.js/styles/default.css
static/docs/reference/generated/kubectl/node_modules/jquery.scrollto/jquery.scrollTo.min.js
static/docs/reference/generated/kubectl/node_modules/jquery/dist/jquery.min.js
static/docs/reference/generated/kubectl/node_modules/font-awesome/css/font-awesome.min.css
```

## Проверка документации локально

Соберите документацию Kubernetes в вашей директории `<web-base>`.

```shell
cd <web-base>
make docker-serve
```

Посмотрите [локальную предварительную версию сайта](https://localhost:1313/docs/reference/generated/kubectl/kubectl-commands/).

## Добавление и фиксация изменений в kubernetes/website

Выполните команду `git add` и `git commit` для фиксации файлов.

## Создание пулреквеста

Создайте пулреквест в репозиторий `kubernetes/website`. Отслеживайте изменения в пулреквесте и по мере необходимости отвечайте на комментарии рецензента. Не забывайте проверять пулреквест до тех пор, пока он не будет принят.

Спустя несколько минут после принятия вашего пулреквеста, обновленные темы справочника будут отображены в [документации](/ru/docs/home/).



## {{% heading "whatsnext" %}}


* [Руководство по быстрому старту генерации справочной документации](/ru/docs/contribute/generate-ref-docs/quickstart/)
* [Генерация справочной документации для компонентов и инструментов Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерация справочной документации для API Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-api/)


