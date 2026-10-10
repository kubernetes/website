---
title: Генерация справочной документации для API Kubernetes
content_type: task
weight: 50
---

<!-- overview -->

На этой странице рассказывается про обновление справочной документации по API Kubernetes.

Справочная документация по API Kubernetes собирается из [спецификации OpenAPI Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json) с использованием инструмента генерации [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs).

Если вы нашли баги в сгенерированной документации, то можете [исправить их в основном коде](/docs/contribute/generate-ref-docs/contribute-upstream/).

Продолжайте чтение данной странице, если вы хотите перегенерировать справочную документацию из спецификации [OpenAPI](https://github.com/OAI/OpenAPI-Specification).



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
go get -u github.com/kubernetes-sigs/reference-docs

go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

Если у вас ещё нет копии репозитория kubernetes/website, клонируйте её на свой компьютер:

```shell
git clone https://github.com/<your-username>/website $GOPATH/src/github.com/<your-username>/website
```

Склонируйте репозиторий kubernetes/kubernetes по пути k8s.io/kubernetes:

```shell
git clone https://github.com/kubernetes/kubernetes $GOPATH/src/k8s.io/kubernetes
```

* Определите базовую директорию вашей копии репозитория [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Например, если вы выполнили предыдущий шаг, чтобы получить репозиторий, вашей базовой директорией будет `$GOPATH/src/k8s.io/kubernetes`.
В остальных командах базовая директория будет именоваться как `<k8s-base>`.

* Определите базовую директорию вашей копии репозитория [kubernetes/website](https://github.com/kubernetes/website).
Например, если вы выполнили предыдущий шаг, чтобы получить репозиторий, вашей базовой директорией будет `$GOPATH/src/github.com/<your-username>/website`.
В остальных командах базовая директория будет именоваться как `<web-base>`.

* Определите базовую директорию вашей копии репозитория [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs).
Например, если вы выполнили предыдущий шаг, чтобы получить репозиторий, вашей базовой директорией будет `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
В остальных командах базовая директория будет именоваться как `<rdocs-base>`.

## Генерация справочной документации API

Далее в этом разделе рассматривается генерация [справочной документации по API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

### Настройка переменных для сборки

* `K8S_ROOT` со значением `<k8s-base>`.
* `K8S_WEBROOT` со значением  `<web-base>`.
* `K8S_RELEASE` со значением нужной версии документации.
  Например, если вы хотите собрать документацию для Kubernetes версии 1.17.0, определите переменную окружения `K8S_RELEASE` со значением 1.17.0.

Примеры:

```shell
export K8S_WEBROOT=${GOPATH}/src/github.com/<your-username>/website
export K8S_ROOT=${GOPATH}/src/k8s.io/kubernetes
export K8S_RELEASE=1.17.0
```

### Создание версионированной директории и получение Open API spec

Скрипт сборки `updateapispec` создает версионированную директорию для сборки.
После создания директории спецификация Open API генерируется из репозитория `<k8s-base>`. Таким образом версия конфигурационных файлов и спецификация Kubernetes Open API будут совпадать с версией выпуска.
Имя версионированной директории имеет следующий вид: `v<major>_<minor>`.

В директории `<rdocs-base>` выполните следующий скрипт сборки:

```shell
cd <rdocs-base>
make updateapispec
```

### Сборка справочной документации API

Скрипт сборки `copyapi` создает справочник API и копирует генерированные файлы в каталоги в `<web-base>`.
Выполните следующую команду в `<rdocs-base>`:

```shell
cd <rdocs-base>
make copyapi
```

Убедитесь в том, что перечисленные ниже два файлы были сгенерированы:

```shell
[ -e "<rdocs-base>/gen-apidocs/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-apidocs/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

Перейдите в корень директории `<web-base>` и посмотрите, какие файлы были изменены:

```shell
cd <web-base>
git status
```

Вывод команды будет примерно следующим:

```
static/docs/reference/generated/kubernetes-api/v1.17/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/v1.17/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/v1.17/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/v1.17/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.woff2
static/docs/reference/generated/kubernetes-api/v1.17/index.html
static/docs/reference/generated/kubernetes-api/v1.17/js/jquery.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/v1.17/js/navData.js
static/docs/reference/generated/kubernetes-api/v1.17/js/scroll.js
```

## Обновление указателя API-справочника

При генерации справочной документации для нового выпуска в файле `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md` нужно прописать номер предстоящей версии.

* Откройте файл `<web-base>/content/en/docs/reference/kubernetes-api/api-index.md` и обновите номер версии справочника API. Например:

    ```
    ---
    title: v1.17
    ---

    [Kubernetes API v1.17](/docs/reference/generated/kubernetes-api/v1.17/)
    ```

* Откройте файл `<web-base>/content/en/docs/reference/_index.md` и добавьте ссылку на последний справочник API. Удалите самую старую версию справочника API.
  В этом файле должно быть 5 ссылок на новейшие API-справочники.

## Тестирование справочника API локально

Соберите обновлённую версию API-справочника на своём компьютере.
Проверьте ваши изменения на [локальной предварительной версии сайта](http://localhost:1313/docs/reference/generated/kubernetes-api/v1.17/).

```shell
cd <web-base>
make docker-serve
```

## Фиксация изменений

В директории `<web-base>` выполните команду `git add` и `git commit` для фиксации изменений в репозитории.

Создайте пулреквест в репозиторий `kubernetes/website`. Отслеживайте свой пулреквест и при необходимости отвечайте на комментарии. Не забывайте отслеживать активность в собственном пулреквесте до тех пор, пока он не будет принят.

Отправьте свои изменения в виде [пулреквеста](/ru/docs/contribute/start/) в репозиторий [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Отслеживайте изменения в пулреквесте и по мере необходимости отвечайте на комментарии рецензента. Не забывайте проверять пулреквест до тех пор, пока он не будет принят.



## {{% heading "whatsnext" %}}


* [Руководство по быстрому старту генерации справочной документации](/ru/docs/contribute/generate-ref-docs/quickstart/)
* [Генерация справочной документации для компонентов и инструментов Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерация справочной документации для команд kubectl](/ru/docs/contribute/generate-ref-docs/kubectl/)


