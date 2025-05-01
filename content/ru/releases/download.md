---
title: Скачать Kubernetes
type: docs
---

Kubernetes поставляет бинарные файлы для каждого своего компонента, а 
также стандартный набор клиентских приложений для запуска кластера и 
взаимодействия с ним. Компоненты вроде API-сервера могут запускаться 
в контейнерных образах внутри кластера. В рамках процесса подготовки 
официальных релизов эти компоненты также поставляются в виде образов. 
Все бинарные файлы и контейнерные образы доступны для множества 
операционных систем и видов аппаратной архитектуры.

### kubectl

<!-- overview -->

Консольная утилита Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), 
позволяет взаимодействовать с Kubernetes-кластерами.

kubectl можно использовать для деплоя приложений, исследования кластерных
ресурсов и управления ими, просмотра логов. Больше информации, включая
полный список возможных действий с kubectl, смотрите в 
[референсной документации `kubectl`](/ru/docs/reference/kubectl/).

kubectl можно установить на разных Linux-платформах, macOS и Windows.
Выберите предпочтительную операционную систему ниже.

- [Установка kubectl на Linux](/docs/tasks/tools/install-kubectl-linux)
- [Установка kubectl на macOS](/docs/tasks/tools/install-kubectl-macos)
- [Установка kubectl на Windows](/docs/tasks/tools/install-kubectl-windows)

## Образы контейнеров

Все контейнерные образы Kubernetes деплоятся в реестр `registry.k8s.io`.

| Образ контейнера                                                          | Поддерживаемые архитектуры        |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### Архитектуры образов контейнеров

Все образы контейнеров могут работать на множестве архитектур. Исполняемая 
среда контейнеров (runtime) должна сама определить подходящую, исходя из 
используемой платформы. Образ с конкретной архитектурой можно также получить, 
добавив суффикс к названию образа контейнера. Например, 
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Подписи образов контейнеров

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Для Kubernetes {{< param "version" >}} 
образы контейнеров подписываются подписями [sigstore](https://sigstore.dev):

{{< note >}}
В настоящий момент sigstore-подписи образов контейнеров не совпадают 
в разных географических локациях. Подробности об этой проблеме можно 
найти в соответствующем 
[issue на GitHub](https://github.com/kubernetes/registry.k8s.io/issues/187).
{{< /note >}}

Проект Kubernetes публикует список подписанных образов контейнеров Kubernetes 
в формате [SPDX 2.3](https://spdx.dev/specifications/).
Получить этот список можно так:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

Для ручной проверки подписанных образов контейнеров базовых компонентов 
Kubernetes воспользуйтесь инструкцией 
[Verify Signed Container Images](/docs/tasks/administer-cluster/verify-signed-artifacts).

Если вы скачиваете образ контейнера для конкретной архитектуры, этот 
образ, предназначенный только для неё, будет подписан так же, как и 
в списке с мульти-архитектурными манифестами.

## Бинарные файлы

{{< release-binaries >}}
