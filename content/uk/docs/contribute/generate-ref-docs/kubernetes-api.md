---
title: Генерація документації для API Kubernetes
content_type: task
weight: 50
---

<!-- overview -->

Ця сторінка демонструє, як оновити документацію API Kubernetes.

Документація API Kubernetes формується на основі [специфікації OpenAPI Kubernetes](https://github.com/kubernetes/kubernetes/blob/master/api/openapi-spec/swagger.json) з використанням коду генерації з [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs).

Якщо ви знайшли помилки у згенерованій документації, вам потрібно [виправити їх на upstream](/docs/contribute/generate-ref-docs/contribute-upstream/).

Якщо вам потрібно тільки згенерувати документацію з [OpenAPI](https://github.com/OAI/OpenAPI-Specification), продовжте читати цю сторінку.

## {{% heading "prerequisites" %}}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Налаштування локальних репозиторіїв

Створіть локальне робоче середовище і встановіть ваш `GOPATH`:

```shell
mkdir -p $HOME/<workspace>

export GOPATH=$HOME/<workspace>
```

Отримайте локальну копію наступних репозиторіїв:

```shell
git clone github.com/kubernetes-sigs/reference-docs
```

Перейдіть до теки `gen-apidocs` репозиторію `reference-docs` та встановіть необхідні пакунки Go:

```shell
go get -u github.com/go-openapi/loads
go get -u github.com/go-openapi/spec
```

Якщо у вас ще немає репозиторію kubernetes/website, отримайте його зараз:

```shell
git clone https://github.com/<your-username>/website
```

Отримайте копію репозиторію kubernetes/kubernetes:

```shell
git clone https://github.com/kubernetes/kubernetes
```

* Основна тека вашої копії [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes) репозиторію є `<your-path-to>/kubernetes/kubernetes`. Подальші кроки використовують цю основну директорію як `<k8s-base>`.

* Основна тека вашої копії [kubernetes/website](https://github.com/kubernetes/website) репозиторію є `<your-path-to>/website`. Подальші кроки використовують цю основну директорію як `<web-base>`.

* Основна тека вашої копії [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs) репозиторію є `<your-path-to>/reference-docs`. Подальші кроки використовують цю основну директорію як `<rdocs-base>`.

## Генерація документації API {#generate-the-api-reference-docs}

Цей розділ демонструє, як згенерувати [опубліковану документацію API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

### Встановлення змінних для зборки {#set-build-variables}

* Встановіть `K8S_ROOT` на `<k8s-base>`.
* Встановіть `K8S_WEBROOT` на `<web-base>`.
* Встановіть `K8S_RELEASE` на версію документації, яку ви хочете зібрати. Наприклад, якщо ви хочете зібрати документацію для Kubernetes 1.17.0, встановіть `K8S_RELEASE` на 1.17.0.

Наприклад:

```shell
export K8S_WEBROOT=<your-path-to>/website
export K8S_ROOT=<your-path-to>/kubernetes
export K8S_RELEASE=1.17.0
```

### Створення теки версії та завантаження специфікації Open API {#create-versioned-directory-and-fetch-open-api-spec}

Ціль збірки `updateapispec` створює теку версії для збірки. Після створення теки, специфікація Open API завантажується з репозиторію `<k8s-base>`. Ці кроки забезпечують відповідність версій конфігураційних файлів і Kubernetes Open API специфікації з версією релізу. Назва теки версії слідує шаблону `v<major>_<minor>`.

У теці `<rdocs-base>`, виконайте наступну ціль збірки:

```shell
cd <rdocs-base>
make updateapispec
```

### Збірка документації API {#build-the-api-reference-docs}

Ціль `copyapi` будує документацію API та копіює згенеровані файли до теки у `<web-base>`. Виконайте наступну команду у `<rdocs-base>`:

```shell
cd <rdocs-base>
make copyapi
```

Перевірте, що ці два файли були згенеровані:

```shell
[ -e "<rdocs-base>/gen-apidocs/build/index.html" ] && echo "index.html built" || echo "no index.html"
[ -e "<rdocs-base>/gen-apidocs/build/navData.js" ] && echo "navData.js built" || echo "no navData.js"
```

Перейдіть до основної теки вашого локального `<web-base>`, і перегляньте, які файли були змінені:

```shell
cd <web-base>
git status
```

Вихідний результат буде подібним до:

```none
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/bootstrap.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/font-awesome.min.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/css/stylesheet.css
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/FontAwesome.otf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.eot
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.svg
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.ttf
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/fonts/fontawesome-webfont.woff2
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/index.html
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/jquery.scrollTo.min.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/navData.js
static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/js/scroll.js
```

## Розташування та версії довідки API {#api-reference-location-and-versioning}

Створені файли довідки API (версія HTML) копіюються в `<web-base>/static/docs/reference/generated/kubernetes-api/{{< param "version" >}}/`. Ця тека містить автономну документацію API у форматі HTML.

{{< note >}}
Markdown-версія довідки API, розташована в `<web-base>/content/en/docs/reference/kubernetes-api/`, генерується окремо за допомогою генератора [gen-resourcesdocs](https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs).
{{< /note >}}

## Локальне тестування документації API {#locally-test-the-api-reference}

Опублікуйте локальну версію документації API. Перевірте [локальний попередній перегляд](/docs/reference/generated/kubernetes-api/{{< param "version">}}/).

```shell
cd <web-base>
git submodule update --init --recursive --depth 1 # якщо ще не зроблено
make container-serve
```

## Коміт змін {#commit-the-changes}

У `<web-base>`, виконайте `git add` і `git commit`, щоб зафіксувати зміни.

Подайте ваші зміни як [pull request](/docs/contribute/new-content/open-a-pr/) до репозиторію [kubernetes/website](https://github.com/kubernetes/website). Слідкуйте за вашим pull request, і відповідайте на коментарі рецензентів за потреби. Продовжуйте слідкувати за вашим pull request до його злиття.

## {{% heading "whatsnext" %}}

* [Швидкий старт з генерації документації](/docs/contribute/generate-ref-docs/quickstart/)
* [Генерація документації для компонентів та інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерація документації для команд kubectl](/docs/contribute/generate-ref-docs/kubectl/)
