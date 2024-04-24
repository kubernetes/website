---
title: Руководство по быстрому старту
content_type: task
weight: 40
---

<!-- overview -->

На этой странице показано, как использовать скрипт `update-imported-docs` для генерации справочной документации Kubernetes. Скрипт автоматизирует настройку сборки и генерирует справочную документацию для выпуска.



## {{% heading "prerequisites" %}}


{{< include "prerequisites-ref-docs.md" >}}



<!-- steps -->

## Получение репозитория документации

Убедитесь, что ваша копия репозитория `website` обновлена в соответствии с оригинальным репозиторием `kubernetes/website`, а затем склонируйте вашу копию `website`.

```shell
mkdir github.com
cd github.com
git clone git@github.com:<your_github_username>/website.git
```

Определите базовую директорию вашей копии. Например, при выполнении предыдущего блока команд, то базовой директорией будет `website`. Далее в этом руководстве базовая директория в командах будет обозначаться `<web-base>`.

{{< note>}}
Если вы хотите изменить контент инструментов компонента и справочник API, посмотрите [руководство по участию в оригинальной документации](/docs/contribute/generate-ref-docs/contribute-upstream).
{{< /note >}}

## Краткий обзор update-imported-docs

Скрипт `update-imported-docs` находится в директории `<web-base>/update-imported-docs/`.

Этот скрипт генерирует следующие справочники:

* Справочные страницы для компонентов и инструментов
* Справочник команды `kubectl`
* API-справочник Kubernetes

Скрипт `update-imported-docs` генерирует справочную документацию Kubernetes из исходного кода Kubernetes. Скрипт создает временную директорию `/tmp` на вашем компьютере и клонирует необходимые репозитории в эту директорию: `kubernetes/kubernetes` и `kubernetes-sigs/reference-docs`.
Скрипт добавляет путь временной директории в переменную окружения `GOPATH`.
Кроме этого определяются три дополнительные переменные среды:

* `K8S_RELEASE`
* `K8S_ROOT`
* `K8S_WEBROOT`

Для успешного выполнения скрипта нужно передать два аргумента:

* Конфигурационный файл в формате YAML (`reference.yml`)
* Версия выпуска, например, `1.17`

Конфигурационный файл содержит поле `generate-command`.
Поле `generate-command` определяет ряд инструкций для сборки из `kubernetes-sigs/reference-docs/Makefile`. Переменная `K8S_RELEASE` определяет версию выпуска.

Скрипт `update-imported-docs` выполняет следующие шаги:

1.  Клонирует репозитории, указанные в конфигурационном файле. Для генерации справочной документации клонируемым репозиторием по умолчанию является `kubernetes-sigs/reference-docs`.
1.  Запускает команды в клонированных репозиториях для подготовки генератора документации, а затем генерирует файлы HTML и Markdown.
1.  Копирует сгенерированные файлы HTML и Markdown в локальную копию репозитория `<web-base>` в директории, указанные в конфигурационном файле.
1.  Обновляет ссылки на команды `kubectl` из `kubectl`.md, ссылаясь на разделы в справочнике по команде `kubectl`.
.
Когда сгенерированные файлы находятся в вашем локальной копии репозитория `<web-base>`, вы можете отправить их в виде [пулреквеста](/ru/docs/contribute/start/) в оригинальный репозиторий `<web-base>`.

## Формат конфигурационного файла

Каждый конфигурационный файл может содержать несколько репозиториев, которые будут импортированы вместе. При необходимости вы можете вручную изменить конфигурационный файл. Вы можете создавать новые конфигурационные файлы для импорта других групп документации.
Ниже приведен пример файла конфигурации в формате YAML:

```yaml
repos:
- name: community
  remote: https://github.com/kubernetes/community.git
  branch: master
  files:
  - src: contributors/devel/README.md
    dst: docs/imported/community/devel.md
  - src: contributors/guide/README.md
    dst: docs/imported/community/guide.md
```

Каждый Markdown-файл документации, импортированный инструментом, должен соответствовать [руководству по оформлению документации](/docs/contribute/style/style-guide/).

## Настройка reference.yml

Откройте файл `<web-base>/update-imported-docs/reference.yml` для редактирования.
Не изменяйте значение в поле `generate-command`, если не понимаете, как эта команда используется для сборки справочников.
Вам нет необходимости править файл `reference.yml`. В некоторых случаях изменения в исходном коде основного репозитория могут потребовать внесения изменений в конфигурационный файл (например, зависимости версий golang и изменения сторонних библиотек).
Если у вас возникли проблемы со сборкой, обратитесь за помощью к команде SIG-Docs на канале [#sig-docs в Slack Kubernetes](https://kubernetes.slack.com).

{{< note >}}
Команда `generate-command` является необязательной, её можно использовать для выполнения указанной команды или небольшого скрипта, чтобы сгенерировать документацию из репозитория.
{{< /note >}}

В файле `reference.yml` секция `files` содержат список полей `src` и `dst`.
В поле `src` хранится путь к сгенерированному Markdown-файлу в клонированной директории сборки `kubernetes-sigs/reference-docs`, а поле `dst` определяет, куда скопировать этот файл в клонированном репозитории `kubernetes/website`.
Например:

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-sigs/reference-docs.git
  files:
  - src: gen-compdocs/build/kube-apiserver.md
    dst: content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
  ...
```

Обратите внимание, что в случае наличия множества файлов, которые нужно скопировать из одной директории в другую, то для это можете воспользоваться подстановочными знаки в поле `src`. Вам нужно указать имя директории в поле `dst`.
Например:

```yaml
  files:
  - src: gen-compdocs/build/kubeadm*.md
    dst: content/en/docs/reference/setup-tools/kubeadm/generated/
```

## Запуск инструмента update-imported-docs

Вы можете запустить инструмент `update-imported-docs` следующим образом:

```shell
cd <web-base>/update-imported-docs
./update-imported-docs <configuration-file.yml> <release-version>
```

Например:

```shell
./update-imported-docs reference.yml 1.17
```

<!-- Revisit: is the release configuration used -->
## Исправление ссылок

Конфигурационный файл `release.yml` содержит инструкции по исправлению относительных ссылок
Для исправления относительных ссылок в импортированных файлах, установите для свойство `gen-absolute-links` в значение `true`. В качестве примера можете посмотреть файл [`release.yml`](https://github.com/kubernetes/website/blob/main/update-imported-docs/release.yml).

## Внесение изменений в kubernetes/website

Список сгенерированных и скопированных файлов в `<web-base>` можно узнать, как показано ниже:

```shell
cd <web-base>
git status
```

В выводе команды будут показаны новые и измененные файлы. Полученный вывод может отличаться в зависимости от изменений основного исходного кода.

### Сгенерированные файлы инструментом

```
content/en/docs/reference/command-line-tools-reference/cloud-controller-manager.md
content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
content/en/docs/reference/command-line-tools-reference/kube-controller-manager.md
content/en/docs/reference/command-line-tools-reference/kube-proxy.md
content/en/docs/reference/command-line-tools-reference/kube-scheduler.md
content/en/docs/reference/setup-tools/kubeadm/generated/kubeadm.md
content/en/docs/reference/kubectl/kubectl.md
```

### Сгенерированные справочные файлы для команды kubectl

```
static/docs/reference/generated/kubectl/kubectl-commands.html
static/docs/reference/generated/kubectl/navData.js
static/docs/reference/generated/kubectl/scroll.js
static/docs/reference/generated/kubectl/stylesheet.css
static/docs/reference/generated/kubectl/tabvisibility.js
static/docs/reference/generated/kubectl/node_modules/bootstrap/dist/css/bootstrap.min.css
static/docs/reference/generated/kubectl/node_modules/highlight.js/styles/default.css
static/docs/reference/generated/kubectl/node_modules/jquery.scrollto/jquery.scrollTo.min.js
static/docs/reference/generated/kubectl/node_modules/jquery/dist/jquery.min.js
static/docs/reference/generated/kubectl/css/font-awesome.min.css
```

### Сгенерированные файлы и директории для справочника API Kubernetes

```
static/docs/reference/generated/kubernetes-api/v1.17/index.html
static/docs/reference/generated/kubernetes-api/v1.17/js/navData.js
static/docs/reference/generated/kubernetes-api/v1.17/js/scroll.js
static/docs/reference/generated/kubernetes-api/v1.17/js/query.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/v1.17/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/v1.17/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/v1.17/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/v1.17/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/v1.17/fonts/fontawesome-webfont.woff2
```

Выполните `git add` и `git commit`, чтобы зафиксировать файлы в репозитории.

## Создание пулреквеста

Создайте пулреквест в репозиторий `kubernetes/website`. Отслеживайте свой пулреквест и при необходимости отвечайте на комментарии. Не забывайте отслеживать активность в собственном пулреквесте до тех пор, пока он не будет принят.

Спустя несколько минут после принятия вашего пулреквеста, обновленные темы справочника будут отображены в [документации](/ru/docs/home/).



## {{% heading "whatsnext" %}}


Для генерации отдельной взятой справочной документации путём ручной настройки необходимых репозиториев сборки и выполнении скриптов сборки обратитесь к следующим руководствам:

* [Генерация справочной документации для компонентов и инструментов Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерация справочной документации для команд kubectl](/ru/docs/contribute/generate-ref-docs/kubectl/)
* [Генерация справочной документации для API Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-api/)
