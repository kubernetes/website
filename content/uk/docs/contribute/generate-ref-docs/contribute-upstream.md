---
title: Внесок у код Kubernetes
content_type: task
weight: 20
---

<!-- overview -->

На цій сторінці показано, як зробити внесок в upstream-проєкт `kubernetes/kubernetes`. Ви можете виправляти помилки, знайдені в документації API Kubernetes або у вмісті компонентів Kubernetes, як-от `kubeadm`, `kube-apiserver` і `kube-controller-manager`.

Якщо ж ви хочете повторно згенерувати довідкову документацію для API Kubernetes або компонентів `kube-*` з upstream-коду, див. такі інструкції:

- [Генерація документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Генерація довідкових сторінок для компонентів та інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)

## {{% heading "prerequisites" %}} {#before-you-begin}

- Вам потрібно мати встановлені такі інструменти:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Golang](https://go.dev/doc/install) версії 1.13+
  - [Docker](https://docs.docker.com/engine/installation/)
  - [etcd](https://github.com/coreos/etcd/)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)

- Ваша змінна середовища `GOPATH` повинна бути встановлена, а розташування `etcd` повинно бути у вашій змінній середовища `PATH`.

- Вам потрібно знати, як створити pull request до репозиторію GitHub. Зазвичай для цього створюють форк репозиторію. Докладніше див. [Створення pull request](https://help.github.com/articles/creating-a-pull-request/) і [Стандартний процес Fork & Pull Request на GitHub](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

<!-- steps -->

## Загальна картина {#the-big-picture}

Довідкова документація для API Kubernetes та компонентів `kube-*`, таких як `kube-apiserver`, `kube-controller-manager`, автоматично генерується з вихідного коду в [upstream Kubernetes](https://github.com/kubernetes/kubernetes/).

Якщо ви бачите помилки в згенерованій документації, можете розглянути можливість створити патч, щоб виправити їх в upstream-проєкті.

## Клонування репозиторію Kubernetes {#clone-the-kubernetes-repository}

Якщо ви ще не маєте репозиторію kubernetes/kubernetes, отримайте його зараз:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Визначте базову теку вашого клону репозиторію [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes). Наприклад, якщо ви виконали попередній крок, щоб отримати репозиторій, ваша базова тека — `$GOPATH/src/github.com/kubernetes/kubernetes`. Далі ця базова тека позначається як `<k8s-base>`.

Визначте базову теку вашого клону репозиторію [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs). Наприклад, якщо ви виконали попередній крок, щоб отримати репозиторій, ваша базова тека — `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`. Далі ця базова тека позначається як `<rdocs-base>`.

## Редагування вихідного коду Kubernetes {#edit-the-kubernetes-source-code}

Довідкова документація API Kubernetes автоматично генерується зі специфікації OpenAPI, яку, своєю чергою, генерують з вихідного коду Kubernetes. Якщо ви хочете змінити довідкову документацію API, перший крок — змінити один або кілька коментарів у вихідному коді Kubernetes.

Документація для компонентів `kube-*` також генерується з upstream-коду. Щоб виправити згенеровану документацію, потрібно змінити код, повʼязаний із компонентом, який ви хочете виправити.

### Внесіть зміни у вихідний код upstream {#make-changes-to-the-upstream-source-code}

{{< note >}}
Наступні кроки є прикладом, а не загальною процедурою. Деталі можуть відрізнятися у вашій ситуації.
{{< /note >}}

Ось приклад редагування коментаря у вихідному коді Kubernetes.

У своєму локальному репозиторії kubernetes/kubernetes перейдіть на стандартну гілку й переконайтеся, що вона актуальна:

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

Припустімо, що в цьому вихідному файлі в стандартній гілці є помилка "atmost":

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

У вашому локальному середовищі відкрийте `types.go` і змініть "atmost" на "at most".

Перевірте, що ви змінили файл:

```shell
git status
```

Вивід показує, що ви в гілці master і що вихідний файл `types.go` змінено:

```shell
On branch master
...
    modified:   staging/src/k8s.io/api/apps/v1/types.go
```

### Зробіть коміт відредагованого файлу {#commit-your-edited-file}

Виконайте `git add` і `git commit`, щоб зробити коміт уже внесених змін. На наступному кроці ви зробите другий коміт. Важливо розділити зміни на два коміти.

### Генерація специфікації OpenAPI та повʼязаних файлів {#generate-the-openapi-spec-and-related-files}

Перейдіть до `<k8s-base>` і запустіть ці скрипти:

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

Виконайте `git status`, щоб побачити, що було згенеровано.

```shell
On branch master
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/openapi-spec/v3/apis__apps__v1_openapi.json
    modified:   pkg/generated/openapi/zz_generated.openapi.go
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

Перегляньте вміст `api/openapi-spec/swagger.json`, щоб переконатися, що помилка виправлена. Наприклад, ви можете виконати `git diff -a api/openapi-spec/swagger.json`. Це важливо, оскільки `swagger.json` є вхідними даними для другого етапу процесу генерації документації.

Виконайте `git add` і `git commit`, щоб зробити коміт змін. Тепер у вас два коміти: один із відредагованим файлом `types.go`, а другий зі згенерованою специфікацією OpenAPI та повʼязаними файлами. Тримайте ці два коміти окремо. Тобто не обʼєднуйте (squash) свої коміти.

Подайте свої зміни як [pull request](https://help.github.com/articles/creating-a-pull-request/) до гілки master репозиторію [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes). Стежте за своїм pull request і за потреби відповідайте на коментарі рецензентів. Продовжуйте стежити за pull request, доки його не буде злито.

[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) є прикладом pull request, який виправляє помилку в коді Kubernetes.

{{< note >}}
Буває складно визначити, який саме вихідний файл потрібно змінити. У наведеному прикладі першоджерело розташоване в теці `staging` репозиторію `kubernetes/kubernetes`. Але у вашому випадку тека `staging` може й не бути місцем, де шукати першоджерело. Орієнтуйтеся на файли `README` у репозиторії [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging) і в повʼязаних репозиторіях, як-от [kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
{{< /note >}}

### Cherry-pick вашого коміту в гілку випуску {#cherry-pick-your-commit-into-a-release-branch}

У попередньому розділі ви відредагували файл у гілці master, а потім запустили скрипти, щоб згенерувати специфікацію OpenAPI та повʼязані файли. Потім ви подали зміни в pull request до гілки master репозиторію kubernetes/kubernetes. Тепер припустімо, що ви хочете перенести (backport) свою зміну в гілку випуску. Наприклад, гілка master використовується для розробки Kubernetes версії {{< skew latestVersion >}}, а ви хочете перенести свою зміну в гілку release-{{< skew prevMinorVersion >}}.

Згадайте, що ваш pull request має два коміти: один із редагуванням `types.go` і один із файлами, згенерованими скриптами. Наступний крок — запропонувати cherry-pick вашого першого коміту в гілку release-{{< skew prevMinorVersion >}}. Ідея полягає в тому, щоб зробити cherry-pick коміту, який редагував `types.go`, але не коміту з результатами запуску скриптів. Інструкції див. у [Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

{{< note >}}
Щоб запропонувати cherry-pick, потрібен дозвіл встановлювати мітку та milestone у вашому pull request. Якщо такого дозволу у вас немає, доведеться працювати з кимось, хто зможе встановити мітку й milestone за вас.
{{< /note >}}

Коли у вас є pull request для cherry-pick вашого коміту у гілку release-{{< skew prevMinorVersion >}}, наступний крок — запустити ці скрипти в гілці release-{{< skew prevMinorVersion >}} у вашому локальному середовищі.

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

Тепер додайте коміт до вашого cherry-pick pull request, що містить нещодавно згенеровану OpenAPI специфікацію та супутні файли. Слідкуйте за вашим pull request, поки він не буде злитий у гілку release-{{< skew prevMinorVersion >}}.

Тепер і гілка master, і гілка release-{{< skew prevMinorVersion >}} містять ваш оновлений файл `types.go` і набір згенерованих файлів, що відображають зміну, яку ви внесли в `types.go`. Зверніть увагу, що згенерована специфікація OpenAPI та інші згенеровані файли в гілці release-{{< skew prevMinorVersion >}} не обовʼязково збігаються зі згенерованими файлами в гілці master. Згенеровані файли в гілці release-{{< skew prevMinorVersion >}} містять елементи API лише з Kubernetes {{< skew prevMinorVersion >}}. Згенеровані файли в гілці master можуть містити елементи API, яких немає в {{< skew prevMinorVersion >}}, але які розробляються для {{< skew latestVersion >}}.

## Генерація опублікованої довідкової документації {#generate-the-published-reference-docs}

У попередньому розділі показано, як відредагувати вихідний файл, а потім згенерувати кілька файлів, зокрема `api/openapi-spec/swagger.json` у репозиторії `kubernetes/kubernetes`. Файл `swagger.json` — це файл визначення OpenAPI, який використовується для генерації довідкової документації API.

Тепер можна скористатися посібником [Генерація документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/), щоб згенерувати [опубліковану довідкову документацію API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

## {{% heading "whatsnext" %}} {#what-s-next}

- [Генерація документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Генерація довідкових сторінок для компонентів та інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)
- [Генерація документації для команд kubectl](/docs/contribute/generate-ref-docs/kubectl/)
