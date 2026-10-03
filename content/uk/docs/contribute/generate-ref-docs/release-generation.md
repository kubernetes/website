---
title: Генерація довідкової документації для релізу
linkTitle: Генерація для релізу
content_type: task
weight: 15
---

<!-- overview -->

Ця сторінка показує, як перегенерувати кожен набір довідкової документації Kubernetes для нового релізу та як розділити згенерований результат на pull request-и, які рецензенти можуть обробляти по одному.

Опрацьовуйте розділи по порядку. Кожен набір довідки має власний розділ, який збирає його, копіює у ваш клон вебсайту та завершується сторінкою для перевірки, тому ви можете завершити один набір, перш ніж почати наступний. [Підсумок](#summary) у кінці перелічує кожну ціль, її результат та pull request-и, які потрібно відкрити.

{{< note >}}
Очільник команди документації релізу та помічники (Docs shadows) виконують цей процес протягом циклу релізу. [Інструкція для ролі з документації](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks/docs) у `kubernetes/sig-release` охоплює решту цієї ролі. Якщо інструкція отримає власні кроки для генерації довідкової документації, оновіть цю сторінку відповідно.
{{< /note >}}

## {{% heading "prerequisites" %}}{#before-you-begin}

{{< include "prerequisites-ref-docs.md" >}}

<!-- steps -->

## Налаштування локальних репозиторіїв {#set-up-the-local-repositories}

Вам потрібні локальні клони `kubernetes/website` та `kubernetes-sigs/reference-docs`.

Якщо ви ще не зробили форк і клон `kubernetes/website`, дивіться [Робота з локальним клоном](/docs/contribute/new-content/open-a-pr/#fork-the-repo). Клонуйте `reference-docs`:

```shell
git clone https://github.com/kubernetes-sigs/reference-docs
```

Подальші кроки посилаються на ваш клон `kubernetes/website` як `<web-base>` та ваш клон `reference-docs` як `<rdocs-base>`.

## Налаштування змінних збірки {#set-build-variables}

Встановіть їх у вашій оболонці. Вони застосовуються до кожної команди `make` у кроках, що наведені нижче.

```shell
export K8S_WEBROOT=<your-path-to>/website     # ваш клон вебсайту (<web-base>)
export K8S_RELEASE={{< skew currentVersionAddMinor 1 >}}.0
```

Встановіть `K8S_RELEASE` на повну версію релізу, наприклад `{{< skew currentVersionAddMinor 1 >}}.0` або `{{< skew currentVersionAddMinor 1 >}}.0-rc.1`. Цілі збірки виводять назву теки з версією, наприклад `v{{< skew currentVersionAddMinor 1 "_" >}}`, з основної та другої частин версії.

## Створення тек з версіями {#create-the-versioned-directories}

Виконайте це у `<rdocs-base>`:

```shell
make createversiondirs
```

Це створює теку конфігурації для нового релізу у `gen-apidocs/config/`, копіюючи `config.yaml` з попереднього релізу.

Вам рідко потрібно редагувати цей файл. Налаштування, які змінюються з кожним релізом: групи API та список ресурсів, які є порожніми, цілі збірки на цій сторінці передають `--auto-detect`, тому генератор читає їх з `swagger.json`. Те, що залишається у файлі, — це найменування та виключення операцій, які слідують за механізмами API, а не за його поверхнею.

Коли згенерована довідка виглядає неправильно, виправте причину [в upstream](/docs/contribute/generate-ref-docs/contribute-upstream/), де можете: описи та повідомлення про застарілість походять з Go-коментарів у `kubernetes/kubernetes`, і виправлення там досягне кожного читача цього API. Редагуйте `config.yaml` лише для того, що вирішує сам генератор, наприклад операція без назви (`operation_categories`), точка доступу, яку довідка не має публікувати (`excluded_operations`), або група, чиї ідентифікатори операцій пишуться інакше, ніж її ресурси (`operation_group_map`). Кожен запис переноситься у кожен подальший реліз, тому тримайте файл стислим.

## Отримання специфікації OpenAPI {#fetch-the-openapi-specification}

Генератор довідки API читає `gen-apidocs/config/<version>/swagger.json`. Специфікація, яку комітить `kubernetes/kubernetes`, збирається з вимкненою функціональною можливістю `OpenAPIEnums`, тому вона пропускає допустимі значення перелічуваних полів, і довідка, зібрана з неї, також пропускає їх. Краще згенерувати довідку, яка перелічує допустимі значення, тому ви виконуєте кілька додаткових кроків, щоб цього досягти.

Виберіть один із двох наведених варіантів.

### Варіант 1: Генерація специфікації з вихідного коду {#option-1-generate-the-specification-from-source}

Використовуйте цей варіант, якщо не можете виконати вимоги нижче. Він не потребує власного клону `kubernetes/kubernetes`, не чіпає жоден клон, який у вас уже є, і створює специфікацію, що включає значення переліків.

```shell
make updateapispec-enums-from-source
```

Ця ціль робить поверхневий клон `kubernetes/kubernetes` з тегу `v$K8S_RELEASE` у тимчасову теку, вмикає `OpenAPIEnums=true` лише у цьому клоні, запускає upstream `hack/update-openapi-spec.sh`, копіює отриману специфікацію у теку конфігурації з версією, перевіряє, що вона містить значення переліків, і видаляє клон. Окрім інструментів з вимог, їй потрібно:

* `jq`, `curl` та `openssl` у вашому `PATH`
* доступ до мережі, щоб клонувати тег і завантажити Go-модулі та etcd
* вільні TCP-порти 2379 та 8050

Upstream-скрипт запускає etcd на порту 2379 і тимчасовий сервер API на порту 8050; встановіть `ETCD_PORT` або `API_PORT`, якщо якийсь із них зайнятий. Він завантажує власну копію etcd і збирає `kube-apiserver`, тому очікуйте, що перший запуск триватиме кілька хвилин.

Щоб зберегти тимчасовий клон і журнал генерації для усунення несправностей:

```shell
KEEP_TMP=1 make updateapispec-enums-from-source
```

### Варіант 2: Копіювання закоміченої специфікації з локального клону {#option-2-copy-the-committed-specification-from-a-local-clone}

Цей варіант потребує локальний клон `kubernetes/kubernetes` і копіює специфікацію набагато швидше.

{{< note >}}
Специфікація, збережена у `kubernetes/kubernetes`, генерується з `OpenAPIEnums=false`. У вашому клоні `kubernetes/kubernetes` встановіть `OpenAPIEnums=true` у `hack/update-openapi-spec.sh`, перш ніж перегенерувати специфікацію. Без цього специфікація не містить значень переліку, а в опублікованому довіднику API не вказано можливі значення кожного поля переліку.
{{< /note >}}

У вашому клоні `kubernetes/kubernetes` виконайте `hack/update-openapi-spec.sh` і збрежіть перегенерований `api/openapi-spec/swagger.json` у тезі `v$K8S_RELEASE`. Потім скопіюйте його у `reference-docs`:

```shell
export K8S_ROOT=<your-path-to>/kubernetes
cd <rdocs-base>
make updateapispec
```

Ціль читає файл так, як він збережений в цьому тезі, а не файл у вашому робочому дереві. Це єдиний крок на цій сторінці, який читає `K8S_ROOT`.

### Перевірка специфікації {#check-the-specification}

Який би варіант ви не використали, ви можете перевірити специфікацію на наявність значень переліків у будь-який час:

```shell
./hack/verify-enum-swagger.sh gen-apidocs/config/<version>/swagger.json
```

## Запуск локального попереднього перегляду {#start-the-local-preview}

Запустіть попередній перегляд один раз, у другому терміналі, і залиште його працювати. Hugo перезавантажує кожну сторінку, коли цілі копіювання замінюють її, тому ви можете перевіряти кожен набір довідки одразу після його генерації.

```shell
cd <web-base>
git submodule update --init --recursive --depth 1   # якщо ще не зроблено
make container-serve
```

Hugo надає попередній перегляд у `http://localhost:1313/`.

{{< note >}}
Починайте кожен набір з актуальної гілки у `<web-base>`, генеруйте його, перевіряйте у попередньому перегляді та зберігайте комітами. [Pull request-и](#pull-requests) перелічують, що відкрити для кожного набору, коли це відкрити та як це описати.
{{< /note >}}

## Генерація довідки API Kubernetes {#generate-the-kubernetes-api-reference}

`gen-apidocs` збирає цей набір (HTML-довідку API) зі специфікації OpenAPI, яку ви отримали. Результат збірки йде до `gen-apidocs/build/html/`, перш ніж ціль скопіює його.

```shell
cd <rdocs-base>
make copyapi
```

Ціль записує два файли у `<web-base>`:

```gotemplate
static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/index.html
static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/js/navData.js
```

Перевірте `/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/` у попередньому перегляді. Відкрийте такий ресурс, як Pod, і пошукайте на сторінці `Possible enum values` ("можливі значення переліків"), що підтверджує, що специфікація пронесла значення переліків крізь генерацію.

Дивіться [Pull request-и](#pull-requests) для того, що відкрити для цього набору.

## Генерація довідкових сторінок API у Markdown {#generate-the-api-reference-pages-in-markdown}

`gen-apidocs` також збирає цей набір (довідку API у Markdown, яку Hugo відображає як звичайні сторінки) з тієї ж специфікації. Результат збірки йде до `gen-apidocs/build/markdown/`.

```shell
cd <rdocs-base>
make copyapimd
```

Ціль замінює `<web-base>/content/en/docs/reference/kubernetes-api/` та зберігає `_index.md`, який люди підтримують вручну.

Перевірте `/docs/reference/kubernetes-api/` у попередньому перегляді. Порівняйте кількість згенерованих сторінок з попереднім релізом:

```shell
find <web-base>/content/en/docs/reference/kubernetes-api -name '*.md' | wc -l
```

Дивіться [Pull request-и](#pull-requests) для того, що відкрити для цього набору.

## Генерація довідки компонентів {#generate-the-component-reference}

`gen-compdocs` збирає з `k8s.io/kubernetes` та з staging-модулів `k8s.io`, які `go.mod` закріплює директивами `replace`. `go get` оновлює перший і залишає решту, тому переміщуйте весь набір одразу:

```shell
cd <rdocs-base>/gen-compdocs
STAGING=v0.${K8S_RELEASE#*.}
go get k8s.io/kubernetes@v$K8S_RELEASE
KK=$(go list -m -f '{{.Dir}}' k8s.io/kubernetes)

# кожен staging-модуль цього релізу
for m in $(awk '/=> \.\/staging\/src\//{print $1}' "$KK/go.mod"); do
  go mod edit -replace="$m=$m@$STAGING" -require="$m@$STAGING"
done

# записи, що залишились від релізу з іншим набором staging-модулів
for m in $(go mod edit -json | jq -r '.Replace[].Old.Path'); do
  grep -q "$m => ./staging/src/$m" "$KK/go.mod" ||
    go mod edit -dropreplace="$m" -droprequire="$m"
done

go mod tidy
go mod edit -go=$(go list -m -f '{{.GoVersion}}' k8s.io/kubernetes)
go mod tidy
```

{{< note >}}
Якщо `go get` або `go mod tidy` повідомляє `unknown revision` або 404 від `sum.golang.org` для модуля `k8s.io`, staging-модулі для цього релізу ще не опубліковані. Вони слідують за тегом `kubernetes/kubernetes` з запізненням у кілька годин. Перевірте це:

```shell
git ls-remote --tags https://github.com/kubernetes/api.git "v0.${K8S_RELEASE#*.}"
```

Порожній результат означає, що вам доведеться чекати. Це стосується також довідки конфігураційних API. Два набори довідки API читають лише специфікацію OpenAPI, тому ви можете згенерувати їх тим часом.
{{< /note >}}

Цикли читають набір модулів з `kubernetes/kubernetes`, оскільки релізи додають і видаляють staging-модулі, і `go.mod` може все ще перелічувати модулі від старішого релізу. Директива `go` йде останньою: поки старі модулі ще у графі, `go mod tidy` піднімає її знову.

Перевірте, що змінилося:

```shell
git diff go.mod
```

Кожна вимога `k8s.io`, кожен `replace` і директива `go` тепер мають вказувати новий реліз. Вимоги поза staging-набором, такі як `k8s.io/klog/v2` та пакети Goldmark, зберігають власні версії.

Потім зберіть і скопіюйте основні сторінки компонентів:

```shell
cd <rdocs-base>
make copycomp-core
```

`gen-compdocs` записує кожну сторінку компонента до `gen-compdocs/build/`, і ціль копіює `kube-apiserver.md`, `kube-controller-manager.md`, `kube-scheduler.md`, `kube-proxy.md` та `kubelet.md` звідти до `<web-base>/content/en/docs/reference/command-line-tools-reference/`.

Перевірте `/docs/reference/command-line-tools-reference/` у попередньому перегляді.

Дивіться [Pull request-и](#pull-requests) для того, що відкрити для цього набору.

{{< note >}}
Довідка компонентів, kubectl та kubeadm — це три окремі pull request-и, навіть якщо `gen-compdocs` створює всі три. Кожна ціль `copycomp-*` спочатку перезбирає кожну сторінку компонента, що займає кілька хвилин. Щоб зібрати один раз і скопіювати всі три набори, виконайте `make copycomp`, а потім розділіть результат на три гілки.
{{< /note >}}

## Генерація довідки kubectl {#generate-the-kubectl-reference}

Сторінки kubectl походять з тієї ж збірки `gen-compdocs`, що й довідка компонентів, і належать до власного pull request-а.

```shell
cd <rdocs-base>
make copycomp-kubectl
```

Ціль записує `kubectl.md` і теку для кожної підкоманди до `<web-base>/content/en/docs/reference/kubectl/generated/` та зберігає `_index.md`, який люди підтримують вручну.

Перевірте `/docs/reference/kubectl/generated/` у попередньому перегляді та відкрийте сторінку підкоманди, наприклад `kubectl apply`.

Дивіться [Pull request-и](#pull-requests) для того, що відкрити для цього набору.

## Генерація довідки kubeadm {#generate-the-kubeadm-reference}

Сторінки kubeadm також походять з `gen-compdocs` і належать до власного pull request-а.

```shell
cd <rdocs-base>
make copycomp-kubeadm
```

Ціль записує `kubeadm.md` і теку для кожної підкоманди до `<web-base>/content/en/docs/reference/setup-tools/kubeadm/generated/` та зберігає `_index.md` і `README.md`, які люди підтримують вручну.

Перевірте `/docs/reference/setup-tools/kubeadm/generated/` у попередньому перегляді.

Дивіться [Pull request-и](#pull-requests) для того, що відкрити для цього набору.

## Генерація довідки конфігураційних API {#generate-the-configuration-api-reference}

`genref` читає Go-типи конфігурацій кожного компонента з staging-модулів `k8s.io`. Він не має директив `replace`, тому самі вимоги вирішують, який реліз ви документуєте:

```shell
cd <rdocs-base>/genref
STAGING=v0.${K8S_RELEASE#*.}
OLD=$(go mod edit -json | jq -r '.Require[] | select(.Path=="k8s.io/api") | .Version')

# кожен модуль k8s.io, закріплений за попереднім релізом
go get $(go mod edit -json | jq -r --arg v "$OLD" --arg s "$STAGING" \
  '.Require[] | select(.Version==$v and (.Path|startswith("k8s.io/"))) | .Path + "@" + $s')

go mod tidy
go mod edit -go=$(go list -m -f '{{.GoVersion}}' k8s.io/api)
go mod tidy
```

Вибір за старою версією підбирає staging-модулі та залишає `k8s.io/klog/v2`, `k8s.io/gengo` та інші незалежні репозиторії у спокої. Перевірте, що змінилося:

```shell
git diff go.mod
```

Також оновіть реліз у цільовому посиланні `externalPackages` у `genref/config.yaml`, яке вказує читачам на опубліковану довідку API.

### Перевірка на наявність нових версій API {#check-for-new-api-versions}

`genref` генерує одну сторінку для кожного запису у `genref/config.yaml`, і кожен запис називає Go-пакет і шлях, що закінчується версією API:

```yaml
  - name: kubelet-config
    title: Kubelet Configuration (v1)
    package: k8s.io/kubelet
    path: config/v1
```

Компонент, який починає обслуговувати нову версію свого конфігураційного API, додає теку версії у свій Go-вихідний код. Перелічіть теки версій компонента, щоб побачити, що існує у цьому релізі:

```shell
cd <rdocs-base>/genref
go mod download
ls "$(go list -m -f '{{.Dir}}' k8s.io/kubelet)/config"
```

Щоб порівняти кожен запис у `config.yaml` з вихідним кодом одразу, виконайте:

```shell
awk '$1=="package:"{pkg=$2} $1=="path:"{print pkg, $2}' config.yaml | sort -u |
while read -r pkg path; do
  dir=$(go list -m -f '{{.Dir}}' "$pkg" 2>/dev/null) || continue
  parent=$(dirname "$path")
  for v in $(find "$dir/$parent" -maxdepth 1 -mindepth 1 -type d -name 'v[0-9]*'); do
    grep -q "path: $parent/$(basename "$v")\$" config.yaml ||
      echo "$pkg $parent/$(basename "$v")"
  done
done | sort -u
```

Кожен рядок — це кандидат, а не прогалина, яку треба заповнити: кілька старіших версій навмисно пропущені, і коментарі у `config.yaml` фіксують чому. Додайте запис, коли компонент обслуговує версію, яку читачі налаштовують, і зберігайте запис для старішої версії, поки компонент все ще обслуговує її.

### Збірка та копіювання сторінок {#build-and-copy-the-pages}

```shell
cd <rdocs-base>
make copyconfigapi
```

`genref` записує згенеровані сторінки до `genref/output/md/`, і ціль сортує їх під час копіювання: більшість іде до `content/en/docs/reference/config-api/`, метричні API йдуть до `content/en/docs/reference/external-api/`, оскільки проєкт визначає їх, але не обслуговує їх з сервера API, а сторінки, які вебсайт не публікує, пропускаються.

Перевірте обидва розділи у попередньому перегляді та підтвердіть, що жодна сторінка, яку ви опублікували для попереднього релізу, не зникла:

```shell
cd <web-base>
git status content/en/docs/reference/config-api/ content/en/docs/reference/external-api/
```

Дивіться [Pull request-и](#pull-requests) для того, що відкрити для цього набору.

## Підсумок {#summary}

{{< table caption="Набори довідки, генератор, що збирає кожен із них, і куди потрапляє його результат" >}}
| Набір довідки | Генератор у `<rdocs-base>` | Ціль | Результат у `<web-base>` |
| --- | --- | --- | --- |
| Kubernetes API, HTML | `gen-apidocs` | `make copyapi` | `static/docs/reference/generated/kubernetes-api/v{{< skew currentVersionAddMinor 1 >}}/` |
| Kubernetes API, Markdown | `gen-apidocs` | `make copyapimd` | `content/en/docs/reference/kubernetes-api/` |
| Компоненти | `gen-compdocs` | `make copycomp-core` | `content/en/docs/reference/command-line-tools-reference/` |
| kubectl | `gen-compdocs` | `make copycomp-kubectl` | `content/en/docs/reference/kubectl/generated/` |
| kubeadm | `gen-compdocs` | `make copycomp-kubeadm` | `content/en/docs/reference/setup-tools/kubeadm/generated/` |
| Конфігураційні API | `genref` | `make copyconfigapi` | `content/en/docs/reference/config-api/`, `content/en/docs/reference/external-api/` |
{{< /table >}}

Кожна ціль копіювання спочатку збирає. Щоб зібрати кожен набір без копіювання чогось у ваш клон вебсайту, виконайте `make api apimd comp configapi`.

### Pull request-и {#pull-requests}

Спочатку виконується збірка кожного об’єкта копіювання. Щоб зібрати всі набори, не копіюючи нічого у клон вашого вебсайту, виконайте команду `make api apimd comp configapi`.

{{< table caption="Pull request-и, які потрібно відкрити для кожного набору довідки" >}}
| Набір довідки | Pull request до `kubernetes-sigs/reference-docs` | Pull request до `kubernetes/website` |
| --- | --- | --- |
| Kubernetes API, HTML | `gen-apidocs/config/<version>/`, конфігурація та специфікація: один pull request для обох наборів API | `Update the Kubernetes API reference for v{{< skew currentVersionAddMinor 1 >}}` |
| Kubernetes API, Markdown | той самий pull request до `gen-apidocs` | `Update the generated API reference pages for v{{< skew currentVersionAddMinor 1 >}}` |
| Компоненти | `gen-compdocs/go.mod` і `go.sum`: один pull request для наборів компонентів, kubectl та kubeadm | `Update the component reference for v{{< skew currentVersionAddMinor 1 >}}` |
| kubectl | той самий pull request до `gen-compdocs` | `Update the kubectl reference for v{{< skew currentVersionAddMinor 1 >}}` |
| kubeadm | той самий pull request до `gen-compdocs` | `Update the kubeadm reference for v{{< skew currentVersionAddMinor 1 >}}` |
| Конфігураційні API | `genref/go.mod`, `genref/config.yaml` та `genref/output/md/`: один pull request | `Update the configuration API reference for v{{< skew currentVersionAddMinor 1 >}}` |
{{< /table >}}

У кожному pull request-і до вебсайту опишіть, як ви згенерували результат, щоб рецензент міг його відтворити:

```text
Regenerated the kubectl reference for v{{< skew currentVersionAddMinor 1 >}}.0.

- Generated with `make copycomp-kubectl` from kubernetes-sigs/reference-docs at commit <commit>
- Generator changes: kubernetes-sigs/reference-docs#<pull request>
- Generated files only, with no hand edits
```

Для двох наборів довідки API додайте, як ви створили специфікацію OpenAPI, оскільки згенерований результат її не показує: `generated from source with OpenAPIEnums=true` або скопійована з клону.

{{< caution >}}
Не редагуйте згенеровані сторінки вручну. Наступний реліз перезапише вашу правку. Виправте формулювання [в upstream-проєкті](/docs/contribute/generate-ref-docs/contribute-upstream/) або в генераторі.
{{< /caution >}}

## {{% heading "whatsnext" %}} {#whats-next}

* [Генерація довідкової документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Генерація довідкової документації для конфігураційних API](/docs/contribute/generate-ref-docs/config-api/)
* [Генерація довідкових сторінок для компонентів та інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерація довідкової документації для команд kubectl](/docs/contribute/generate-ref-docs/kubectl/)
* [Генерація довідкової документації для метрик](/docs/contribute/generate-ref-docs/metrics-reference/)
* [Внесення змін в upstream-код Kubernetes](/docs/contribute/generate-ref-docs/contribute-upstream/)
* [Інструкція для ролі з документації](https://github.com/kubernetes/sig-release/tree/master/release-team/role-handbooks/docs) у `kubernetes/sig-release`
