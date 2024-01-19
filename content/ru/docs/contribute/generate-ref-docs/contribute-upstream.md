---
title: Участие в основном коде Kubernetes
content_type: task
weight: 20
---

<!-- overview -->

На этой странице показано, как поучаствовать в основном содержимом проекта `kubernetes/kubernetes`.
Вы можете исправить баги, найденные в документации по API Kubernetes или содержимом таких компонентов Kubernetes, как `kubeadm`, `kube-apiserver` и `kube-controller-manager`.

Если вместо этого вы хотите перегенерировать справочную документацию для API Kubernetes или компонентов с именем `kube-*` в основном коде, изучите следующие инструкции:

- [Генерация справочной документации для API Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-api/)
- [Генерация справочной документации для компонентов и инструментов Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-components/)



## {{% heading "prerequisites" %}}


- Установленные инструменты:

  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - [Golang](https://go.dev/doc/install) версии 1.13+
  - [Docker](https://docs.docker.com/engine/installation/)
  - [etcd](https://github.com/coreos/etcd/)
  - [make](https://www.gnu.org/software/make/)
  - [gcc compiler/linker](https://gcc.gnu.org/)

- Созданная переменная окружения `GOPATH`, а путь к `etcd` должен быть прописан в переменной окружения `PATH`.

- Вам необходимо знать, как создать пулреквест в репозитории на GitHub.
  Это обычно предполагает создание копии репозитория.
  Для получения дополнительной информации смотрите страницы [Создание пулреквеста](https://help.github.com/articles/creating-a-pull-request/) и [Стандартный рабочий процесс в GitHub по работе с копией и пулреквестом](https://gist.github.com/Chaser324/ce0505fbed06b947d962).



<!-- steps -->

## Рассмотрение процесса в целом

Справочная документация для API Kubernetes и таких компонентов с `kube-*`, как `kube-apiserver`, `kube-controller-manager`, автоматически генерируются из исходного кода в [основном репозитории Kubernetes](https://github.com/kubernetes/kubernetes/).

Если вы заметили баги в сгенерированной документации, попробуйте его исправить через пулреквест в основной проект.

## Клонирование репозитория Kubernetes

Если вы ещё не склонировали репозиторий kubernetes/kubernetes, сделайте это:

```shell
mkdir $GOPATH/src
cd $GOPATH/src
go get github.com/kubernetes/kubernetes
```

Определите базовую директорию вашей копии репозитория [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Например, если вы выполнили предыдущий шаг, чтобы получить репозиторий, вашей базовой директорией будет `$GOPATH/src/github.com/kubernetes/kubernetes`.
В остальных команд базовая директория будет именоваться как `<k8s-base>`.

Определите базовую директорию вашей копии репозитория [kubernetes-sigs/reference-docs](https://github.com/kubernetes-sigs/reference-docs). Например, если вы выполнили предыдущий шаг, чтобы получить репозиторий, вашей базовой директорией будет `$GOPATH/src/github.com/kubernetes-sigs/reference-docs`.
В остальных команд базовая директория будет именоваться как `<rdocs-base>`.

## Редактирование исходного кода Kubernetes

Справочная документация API Kubernetes генерируется автоматически из спецификации OpenAPI в исходном коде Kubernetes. Если вы хотите изменить справочную документацию API, сначала нужно изменить один или несколько комментариев в исходном коде Kubernetes.

Документация для компонентов `kube-*` также генерируется из основного исходного кода. Для изменения генерируемой документации вам нужно изменить соответствующий код компонента.

### Внесение изменений в основной исходный код

{{< note >}}
Следующие шаги служат примером, а не общим порядком действий. Детали могут отличаться в вашей ситуации.
{{< /note >}}

Рассмотрим пример редактирования комментария в исходном коде Kubernetes.

В вашем локальном репозитории kubernetes/kubernetes переключитесь на ветку master и проверьте, что она актуальна:

```shell
cd <k8s-base>
git checkout master
git pull https://github.com/kubernetes/kubernetes master
```

Предположим, что в исходном файле в ветке master есть опечатка "atmost":

[kubernetes/kubernetes/staging/src/k8s.io/api/apps/v1/types.go](https://github.com/kubernetes/kubernetes/blob/master/staging/src/k8s.io/api/apps/v1/types.go)

В вашем локальном окружении откройте `types.go` и измените "atmost" на "at most".

Убедитесь, что вы изменили файл:

```shell
git status
```

Вывод этой команды покажет, что вы находитесь в ветке master и был изменён исходный файл `types.go`:

```shell
On branch master
...
    modified:   staging/src/k8s.io/api/apps/v1/types.go
```

### Фиксация отредактированного файла

Выполните команду `git add` и `git commit`, чтобы зафиксировать внесенные вами изменения. На следующем шаге вы сделаете второй коммит. Следует отметить, что ваши изменения должны быть разделены на коммита.

### Генерация спецификации OpenAPI и сопутствующих файлов

Перейдите в директорию `<k8s-base>` и выполните следующие скрипты:

```shell
hack/update-generated-swagger-docs.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
```

Выполните команду `git status`, чтобы посмотреть, какие файлы изменились.

```shell
On branch master
...
    modified:   api/openapi-spec/swagger.json
    modified:   api/openapi-spec/v3/apis__apps__v1_openapi.json
    modified:   pkg/generated/openapi/zz_generated.openapi.go
    modified:   staging/src/k8s.io/api/apps/v1/generated.proto
    modified:   staging/src/k8s.io/api/apps/v1/types_swagger_doc_generated.go
```

Изучите содержимое файла `api/openapi-spec/swagger.json`, чтобы убедиться в том, что опечатка была исправлена.
Например, для этого вы можете выполнить команду `git diff -a api/openapi-spec/swagger.json`.
Это важно, потому что изменённый файл `swagger.json` является результатом второй стадии процесса генерации документации.

Выполните команду `git add` и `git commit` для фиксации ваших изменения. Теперь вы можете увидеть два новых коммита:
первый содержит отредактированный файл `types.go`, а второй — сгенерированную спецификацию OpenAPI и сопутствующие файлы. Оформляйте эти изменения в виде двух отдельных коммитов. Это означает, что не нужно объединять коммиты.

Отправьте свои изменения как [пулреквест](https://help.github.com/articles/creating-a-pull-request/) в ветку master репозитория [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes).
Отслеживайте пулреквест и по мере необходимости отвечайте на комментарии рецензента. Не забывайте отслеживать активность в пулреквест до тех пор, пока он не будет принят.

[PR 57758](https://github.com/kubernetes/kubernetes/pull/57758) — пример пулреквеста, который исправляет опечатку в исходном коде Kubernetes.

{{< note >}}
Не всегда легко правильно определить, какой исходный файл нужно изменить. В предыдущем примере нужный исходный файл находится в директории `staging` в репозитории `kubernetes/kubernetes`. Однако в вашей ситуации файл для изменения может находится в другом месте, нежели чем в директории `staging`. Для получения помощи изучите файлы `README` в репозитории [kubernetes/kubernetes](https://github.com/kubernetes/kubernetes/tree/master/staging) и в смежных репозиториях, например, [kubernetes/apiserver](https://github.com/kubernetes/apiserver/blob/master/README.md).
{{< /note >}}

### Применение вашего коммита в ветку выпуска

В предыдущем разделе вы отредактировали файл в ветке master, а затем запустили скрипты для генерации спецификации OpenAPI и смежных файлов. Затем вы отправили свои изменения в виде пулреквеста в ветку master репозитория kubernetes/kubernetes. Теперь представим, что вам нужно бэкпортировать изменения в ветку выпуска. К примеру, ветка master используется для разработки Kubernetes версии 1.10, а вы хотите применить ваши изменения в ветке release-1.9.

Напомним, что в вашем пулреквесте есть два коммита: первый для редактирования `types.go`, а второй — для файлов, сгенерированных скриптами. Следующий шаг — применить сделанный вами первый коммит в ветку release-1.9. Суть в том, чтобы выбрать коммит, который изменяет файл `types.go`, а не коммит с результатами выполнения скриптов. За инструкциями обратитесь к странице [Propose a Cherry Pick](https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md).

{{< note >}}
Применение коммита требует наличия возможности добавить метку и этап в вашем пулреквесте. Если у вас нет таких разрешений, вам нужно переговорить с кем-то, кто может сделать это для вас.
{{< /note >}}

Когда в вашем пулреквесте есть определённый коммит, который нужно применить в ветке release-1.9, вам нужно запустить перечисленные ниже скрипты в этой вете из вашего локального окружения.

```shell
hack/update-generated-swagger-docs.sh
hack/update-openapi-spec.sh
hack/update-generated-protobuf.sh
hack/update-api-reference-docs.sh
```

Теперь зафиксируйте изменения в вашем пулреквесте с применённым коммитом, теперь там будет сгенерированная спецификация OpenAPI и связанные с ней файлы. Отслеживайте этот пулреквест до тех пор, пока он не будет объединен в ветке release-1.9.

Сейчас у вас и в ветке master, и в ветке release-1.9 есть обновленный файл `types.go` вместе с множеством сгенерированных файлов, в которых отражаются изменения, внесенные вами в `types.go`. Обратите внимание, что сгенерированная спецификация OpenAPI и другие сгенерированные файлы в ветке release-1.9 не обязательно совпадают с сгенерированными файлами в ветке master. Сгенерированные файлы в ветке release-1.9 содержат элементы API только из Kubernetes 1.9. Сгенерированные файлы в ветке master могут содержать элементы API не только для версии 1.9, но и для 1.10, которая ещё находится в разработке.

## Генерация справочной документации

В предыдущем разделе было показано, как отредактировать исходный файл, а затем сгенерировать несколько файлов, включая  `api/openapi-spec/swagger.json` в репозитории `kubernetes/kubernetes`.
Файл `swagger.json` — это файл определения OpenAPI, который используется для генерации справочной документации API.

Теперь вы можете приступить к изучению руководству [Генерация справочной документации для API Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-api/), чтобы создать [справочную документацию API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/).



## {{% heading "whatsnext" %}}


* [Генерация справочной документации для API Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-api/)
* [Генерация справочной документации для компонентов и инструментов Kubernetes](/ru/docs/contribute/generate-ref-docs/kubernetes-components/)
* [Генерация справочной документации для команд kubectl](/ru/docs/contribute/generate-ref-docs/kubectl/)


