---
title: Швидкий старт з довідковою документацією
linkTitle: Швидкий старт
content_type: task
weight: 10
hide_summary: true
---

<!-- overview -->

Ця сторінка показує, як використовувати скрипт `update-imported-docs.py` для генерації довідкової документації Kubernetes. Скрипт автоматизує налаштування збірки та генерує довідкову документацію для релізу.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Отримання репозиторію документації {#getting-the-docs-repo}

Переконайтеся, що ваш форк репозиторію `website` синхронізований з віддаленим репозиторієм `kubernetes/website` на GitHub (гілка `main`), і клонуйте ваш форк `website` собі локально.

```shell
mkdir github.com
cd github.com
git clone git@github.com:<your_github_username>/website.git
```

Визначте базову теку вашого клону. Наприклад, якщо ви слідували попередньому кроку для отримання репозиторію, ваша базова тека — `github.com/website`. Наступні кроки посилаються на вашу базову теку як `<web-base>`.

{{< note>}}
Якщо ви хочете змінити вміст компонентів інструментів і довідкову документацію API, дивіться [інструкцію для внесення змін в upstream](/docs/contribute/generate-ref-docs/contribute-upstream).
{{< /note >}}

## Огляд update-imported-docs {#overview-of-update-imported-docs}

Скрипт `update-imported-docs.py` розташований у теці `<web-base>/update-imported-docs/`.

Скрипт будує наступні довідки:

* Довідкові сторінки компонентів та інструментів
* Довідка по команді `kubectl`
* Довідка по API Kubernetes

{{< note >}}
Сторінка [довідника `kubelet`](/docs/reference/command-line-tools-reference/kubelet/) не генерується цим скриптом і підтримується вручну. Щоб оновити довідку kubelet, дотримуйтесь стандартного процесу внесення змін, описаного в [Відкриття pull request](/docs/contribute/new-content/open-a-pr/).
{{< /note >}}

Скрипт `update-imported-docs.py` генерує довідкову документацію Kubernetes з вихідного коду Kubernetes. Скрипт створює тимчасову теку в `/tmp` на вашій машині та клонує потрібні репозиторії: `kubernetes/kubernetes` та `kubernetes-sigs/reference-docs` у цю теку. Скрипт встановлює вашу змінну середовища `GOPATH` на цю тимчасову теку. Встановлюються три додаткові змінні середовища:

* `K8S_RELEASE`
* `K8S_ROOT`
* `K8S_WEBROOT`

Скрипт потребує два аргументи для успішного виконання:

* YAML конфігураційний файл (`reference.yml`)
* Версія релізу, наприклад: `1.17`

Конфігураційний файл містить поле `generate-command`. Поле `generate-command` визначає серію інструкцій для збірки з `kubernetes-sigs/reference-docs/Makefile`. Змінна `K8S_RELEASE` визначає версію релізу.

Скрипт `update-imported-docs.py` виконує наступні кроки:

1. Клонування повʼязаних репозиторіїв, зазначених у конфігураційному файлі. Для генерації довідкових документів типово клонуються `kubernetes-sigs/reference-docs`.
2. Запуск команд під час клонування репозиторіїв для підготовки генератора документації та генерація HTML і Markdown файлів.
3. Копіювання згенерованих HTML і Markdown файлів до локального клону репозиторію `<web-base>` за вказаними в конфігураційному файлі шляхами.
4. Оновлення посилань команд `kubectl` з `kubectl.md` у секції в довідці по команді `kubectl`.

Коли згенеровані файли знаходяться у вашому локальному клоні репозиторію `<web-base>`, ви можете подати їх у [pull request](/docs/contribute/new-content/open-a-pr/) до `<web-base>`.

## Формат конфігураційного файлу {#configuration-file-format}

Кожен конфігураційний файл може містити кілька репозиторіїв, які будуть імпортовані разом. За необхідності, ви можете налаштувати конфігураційний файл, редагуючи його вручну. Можна створювати нові конфігураційні файли для імпорту інших груп документів. Ось приклад YAML конфігураційного файлу:

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

Окремі Markdown документи, імпортовані за допомогою інструмента, повинні відповідати [Посібнику зі стилю документації](/docs/contribute/style/style-guide/).

## Налаштування reference.yml {#customizing-reference-yml}

Відкрийте `<web-base>/update-imported-docs/reference.yml` для редагування. Не змінюйте вміст поля `generate-command`, якщо не розумієте, як команда використовується для побудови довідок. Оновлення `reference.yml` зазвичай не потрібне. Іноді зміни в upstream вихідному коді можуть вимагати змін у конфігураційному файлі (наприклад: залежності версій golang та зміни сторонніх бібліотек). Якщо ви стикаєтеся з проблемами збірки, зверніться до команди SIG-Docs у [#sig-docs Kubernetes Slack](https://kubernetes.slack.com).

{{< note >}}
`generate-command` є необовʼязковим полем, яке можна використовувати для запуску заданої команди або короткого скрипту для генерації документації з репозиторію.
{{< /note >}}

У `reference.yml`, `files` містить список полів `src` та `dst`. Поле `src` містить розташування згенерованого Markdown файлу у теці збірки `kubernetes-sigs/reference-docs`, а поле `dst` визначає, куди скопіювати цей файл у клонованому репозиторії `kubernetes/website`. Наприклад:

```yaml
repos:
- name: reference-docs
  remote: https://github.com/kubernetes-sigs/reference-docs.git
  files:
  - src: gen-compdocs/build/kube-apiserver.md
    dst: content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
  ...
```

Зверніть увагу, що коли є багато файлів для копіювання з одного джерела в одну й ту ж теку призначення, ви можете використовувати шаблони в значенні `src`. Ви повинні надати назву теки як значення для `dst`. Наприклад:

```yaml
  files:
  - src: gen-compdocs/build/kubeadm*.md
    dst: content/en/docs/reference/setup-tools/kubeadm/generated/
```

## Запуск інструмента update-imported-docs {#running-the-update-imported-docs-tool}

Ви можете запустити інструмент `update-imported-docs.py` наступним чином:

```shell
cd <web-base>/update-imported-docs
./update-imported-docs.py <configuration-file.yml> <release-version>
```

Наприклад:

```shell
./update-imported-docs.py reference.yml 1.17
```

<!-- Revisit: is the release configuration used -->
## Виправлення посилань {#fixing-links}

Конфігураційний файл `release.yml` містить інструкції для виправлення відносних посилань. Щоб виправити відносні посилання у ваших імпортованих файлах, встановіть властивість `gen-absolute-links` на `true`. Ви можете знайти приклад цього в  [`release.yml`](https://github.com/kubernetes/website/blob/main/update-imported-docs/release.yml).

## Додавання та коміт змін у репо kubernetes/website {#adding-and-committing-changes-to-the-kubernetes-website}

Перегляньте файли, що були згенеровані та скопійовані до `<web-base>`:

```shell
cd <web-base>
git status
```

Вивід показує нові та змінені файли. Згенеровані результати варіюються залежно від змін, внесених у upstream вихідний код.

### Згенеровані файли компонентів інструментів {#generated-component-tool-files}

```none
content/en/docs/reference/command-line-tools-reference/kube-apiserver.md
content/en/docs/reference/command-line-tools-reference/kube-controller-manager.md
content/en/docs/reference/command-line-tools-reference/kube-proxy.md
content/en/docs/reference/command-line-tools-reference/kube-scheduler.md
content/en/docs/reference/setup-tools/kubeadm/generated/kubeadm.md
content/en/docs/reference/kubectl/kubectl.md
```

### Згенеровані файли довідки команди kubectl {#generated-kubectl-command-reference-files}

```none
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

### Згенеровані теки та файли довідки по Kubernetes API {#generated-kubernetes-api-reference-directories-and-files}

```none
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/index.html
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/navData.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/scroll.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/query.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff2
```

Виконайте `git add` та `git commit`, щоб зафіксувати файли.

## Створення pull request {#creating-a-pull-request}

Створіть pull request до репозиторію `kubernetes/website`. Слідкуйте за вашим pull request і відповідайте на коментарі рецензентів за потреби. Продовжуйте слідкувати за вашим pull request до його злиття.

Через кілька хвилин після злиття вашого pull request, ваша оновлена довідкова документація буде видна в [опублікованій документації](/docs/home/).

## {{% heading "whatsnext" %}}

Щоб згенерувати окрему довідкову документацію, вручну налаштувавши необхідні репозиторії та запустивши цільові завдання збірки, дивіться наступні посібники:

* [Генерація довідкової документації для компонентів і інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерація довідкової документації для команд kubectl](/docs/contribute/generate-ref-docs/kubectl/)
* [Генерація довідкової документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/)
