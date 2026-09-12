---
title: Внесок у код Kubernetes
content_type: task
weight: 20
---

<!-- overview -->

Ця сторінка показує, як зробити внесок у проєкт `kubernetes/kubernetes`. Ви можете виправити помилки, знайдені в документації API Kubernetes або вмісті компонентів Kubernetes, таких як `kubeadm`, `kube-apiserver` та `kube-controller-manager`.

Якщо ви хочете відновити довідкову документацію для API Kubernetes або компонентів `kube-*` з коду upstream, перегляньте наступні інструкції:

- [Генерація довідкової документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Генерація довідкової документації для компонентів і інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)

## {{% heading "prerequisites" %}}

- Вам потрібно встановити наступні інструменти:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Golang](https://go.dev/doc/install) версії 1.13+
  - [Docker](https://docs.docker.com/engine/installation/)
  - [etcd](https://github.com/coreos/etcd/)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)

- Ваша змінна середовища `GOPATH` повинна бути встановлена, а розташування `etcd` повинно бути у вашій змінній середовища `PATH`.

- Вам потрібно знати, як створити pull request у репозиторій GitHub. Зазвичай це включає створення форку репозиторію. Для отримання додаткової інформації дивіться [Створення Pull Request](https://help.github.com/articles/creating-a-pull-request/) та [Стандартний Workflow Fork & Pull Request на GitHub](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

<!-- steps -->

## Загальна картина {#the-big-picture}

Довідкова документація для API Kubernetes та компонентів `kube-*`, таких як `kube-apiserver`, `kube-controller-manager`, автоматично генерується з вихідного коду в [upstream Kubernetes](https://github.com/kubernetes/kubernetes/).

Коли ви бачите помилки в згенерованій документації, ви можете розглянути можливість створення патчу для виправлення помилки в upstream проєкті.

## Клонування репозиторію Kubernetes {#clone-the-kubernetes-repository}

Якщо ви ще не маєте репозиторію kubernetes/kubernetes, отримайте його зараз:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Визначте базову теку вашого клону репозиторію [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes). Наприклад, якщо ви слідували попередньому кроку для отримання репозиторію, ваша базова тека — `$GOPATH/src/github.com/kubernetes/kubernetes`. Наступні кроки посилаються на вашу базову теку як `<k8s-base>`.

Визначте базову теку вашого клону репозиторію [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs). Наприклад, якщо ви слідували попередньому кроку для отримання репозиторію, ваша базова тека — `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`. Наступні кроки посилаються на вашу базову теку як `<rdocs-base>`.

## Редагування вихідного коду Kubernetes {#edit-the-kubernetes-source-code}

Довідкова документація API Kubernetes автоматично генерується з OpenAPI специфікації, яка створюється з вихідного коду Kubernetes. Якщо ви хочете змінити довідкову документацію API, перший крок — змінити один або кілька коментарів у вихідному коді Kubernetes.

Документація для компонентів `kube-*` також генерується з вихідного коду upstream. Ви повинні змінити код, повʼязаний з компонентом, який ви хочете виправити, щоб виправити згенеровану документацію.

### Зробіть зміни у вихідному коді upstream {#make-changes-to-the-upstream-source-code}

{{< note >}}
Наступні кроки є прикладом, а не загальною процедурою. Деталі можуть відрізнятися у вашій ситуації.
{{< /note >}}

Ось приклад редагування коментаря у вихідному коді Kubernetes.

У вашому локальному репозиторії kubernetes/kubernetes, перейдіть на основну гілку і переконайтеся, що вона оновлена:

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

Припустимо, що у цьому вихідному файлі в основній гілці є помилка "atmost":

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

У вашому локальному середовищі відкрийте `types.go` і змініть "atmost" на "at most".

Перевірте, що ви змінили файл:

```shell
git status
```

Вивід показує, що ви в основній гілці та що вихідний файл `types.go` був змінений:

```shell
On branch master
...
    modified:   staging/src/k8s.io/api/apps/v1/types.go
```

### Збережіть відредагований файл {#commit-your-edited-file}

Виконайте `git add` і `git commit`, щоб зберегти зміни, які ви внесли до цього моменту. У наступному кроці ви зробите другий коміт. Важливо зберігати ваші зміни в окремих комітах.

### Генерація OpenAPI специфікації та супутніх файлів {#generate-openapi-spec-and-related-files}

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

Виконайте `git add` і `git commit`, щоб зберегти ваші зміни. Тепер у вас є два коміти: один з відредагованим файлом `types.go`, і один, що містить згенеровану OpenAPI специфікацію та супутні файли. Залишить ці два коміти окремо. Тобто, не зливайте ваші коміти.

Подайте свої зміни як [pull request](https://help.github.com/articles/creating-a-pull-request/) до основної гілки репозиторію [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes). Слідкуйте за вашим pull request і відповідайте на коментарі рецензентів за потреби. Продовжуйте слідкувати за вашим pull request, поки він не буде злитий.

[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) є прикладом pull request, який виправляє помилку в коді Kubernetes.

{{< note >}}
Може бути складно визначити правильний вихідний файл для зміни. У наведеному прикладі авторитетний вихідний файл знаходиться у теці `staging` в репозиторії `kubernetes/kubernetes`. Але у вашій ситуації, тека `staging` може не бути місцем для знаходження авторитетного джерела. Для орієнтації перегляньте файли `README` у репозиторії [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging) та у повʼязаних репозиторіях, таких як [kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
{{< /note >}}

### Cherry-pick вашого коміту у релізну гілку {#cherry-pick-your-commit-to-a-release-branch}

У попередньому розділі ви відредагували файл в основній гілці та потім запустили скрипти для генерації OpenAPI специфікації та супутніх файлів. Потім ви подали свої зміни у pull request до основної гілки репозиторію kubernetes/kubernetes. Тепер припустимо, що ви хочете повернути вашу зміну в релізну гілку. Наприклад, якщо основна гілка використовується для розробки версії Kubernetes {{< skew latestVersion >}}, і ви хочете повернути вашу зміну у гілку release-{{< skew prevMinorVersion >}}.

Згадайте, що ваш pull request має два коміти: один для редагування `types.go` і один для файлів, згенерованих скриптами. Наступний крок — запропонувати cherry pick вашого першого коміту у гілку release-{{< skew prevMinorVersion >}}. Ідея полягає в тому, щоб зробити cherry-pick коміту, що редагував `types.go`, але не коміту, що має результати запуску скриптів. Для інструкцій дивіться [Запропонувати Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

{{< note >}}
Пропонування cherry pick вимагає, щоб ви мали дозвіл на встановлення мітки та етапу у вашому pull request. Якщо у вас немає таких дозволів, вам потрібно буде працювати з кимось, хто може встановити мітку та етап для вас.
{{< /note >}}

Коли у вас є pull request для cherry-pick вашого коміту у гілку release-{{< skew prevMinorVersion >}}, наступний крок — запустити ці скрипти в гілці release-{{< skew prevMinorVersion >}} у вашому локальному середовищі.

```shell
./hack/update-codegen.sh
./hack/update-openapi-spec.sh
```

Тепер додайте коміт до вашого cherry-pick pull request, що містить нещодавно згенеровану OpenAPI специфікацію та супутні файли. Слідкуйте за вашим pull request, поки він не буде злитий у гілку release-{{< skew prevMinorVersion >}}.

На цьому етапі й основна гілка, й гілка release-{{< skew prevMinorVersion >}} містять ваш оновлений файл `types.go` та набір згенерованих файлів, що відображають зміну, яку ви внесли в `types.go`. Зазначте, що згенерована OpenAPI специфікація та інші згенеровані файли в гілці release-{{< skew prevMinorVersion >}} не обовʼязково будуть такими ж, як згенеровані файли в основній гілці. Згенеровані файли в гілці release-{{< skew prevMinorVersion >}} містять API елементи лише з Kubernetes {{< skew prevMinorVersion >}}. Згенеровані файли в основній гілці можуть містити API елементи, які не є в {{< skew prevMinorVersion >}}, але розробляються для {{< skew latestVersion >}}.

## Генерація опублікованих довідкових документів {#generate-published-reference-docs}

Попередній розділ показав, як редагувати вихідний файл і потім згенерувати декілька файлів, включаючи `api/openapi-spec/swagger.json` у репозиторії `kubernetes/kubernetes`. Файл `swagger.json` є файлом визначення OpenAPI, який використовується для генерації документації API.

Тепер ви готові слідувати посібнику [Генерація довідкової документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/), щоб згенерувати [опубліковану довідкову документацію API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).

## {{% heading "whatsnext" %}}

- [Генерація довідкової документації для API Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Генерація довідкових документів для компонентів і інструментів Kubernetes](/docs/contribute/generate-ref-docs/kubernetes-components/)
- [Генерація довідкової документації для команд kubectl](/docs/contribute/generate-ref-docs/kubectl/)
