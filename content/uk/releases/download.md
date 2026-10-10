---
title: Завантаження Kubernetes
type: docs
weight: 10
---

Kubernetes надає бінарні файли для кожного компонента, а також стандартний набір клієнтських
застосунків для початкового завантаження або взаємодії з кластером. Компоненти, такі як
API-сервер, здатні працювати всередині контейнерних образів в кластері. Ці компоненти також
постачаються в контейнерних образах як частина офіційного процесу випуску. Всі бінарні файли,
а також контейнерні образи доступні для різних операційних систем та апаратних архітектур.

### kubectl

<!-- overview -->

Інструмент командного рядка Kubernetes, [kubectl](/docs/reference/kubectl/kubectl/), дозволяє виконувати команди в кластерах Kubernetes.

Ви можете використовувати kubectl для розгортання застосунків, інспектування та керування ресурсами кластера, а також перегляду логів. Для отримання додаткової інформації, включаючи повний список операцій kubectl, дивіться [довідкову документацію `kubectl`](/docs/reference/kubectl/).

kubectl можна встановити на різних платформах Linux, macOS і Windows. Знайдіть вашу операційну систему нижче.

- [Встановити kubectl на Linux](/docs/tasks/tools/install-kubectl-linux)
- [Встановити kubectl на macOS](/docs/tasks/tools/install-kubectl-macos)
- [Встановити kubectl на Windows](/docs/tasks/tools/install-kubectl-windows)

## Контейнерні образи {#container-images}

Всі контейнерні образи Kubernetes розміщені в реєстрі контейнерних образів `registry.k8s.io`.

| Контейнерний образ                                                        | Підтримувані архітектури          |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### Архітектури контейнерних образів {#container-image-architectures}

Всі контейнерні образи доступні для кількох архітектур, тоді як середовище виконання контейнерів має вибрати правильну архітектуру на основі базової платформи. Також можна витягнути образ для конкретної архітектури, додавши суфікс до імені контейнерного образу, наприклад `registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Підписи контейнерних образів {#container-image-signatures}

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Для Kubernetes {{< param "version" >}}, контейнерні образи підписуються за допомогою [sigstore](https://sigstore.dev) підписів:

{{< note >}}
Підписи контейнерних образів sigstore наразі не збігаються між різними географічними положеннями. Додаткова інформація про цю проблему доступна у відповідному [GitHub issue](https://github.com/kubernetes/registry.k8s.io/issues/187).
{{< /note >}}

Проєкт Kubernetes публікує список підписаних контейнерних образів Kubernetes у форматі [SPDX 2.3](https://spdx.dev/specifications/). Ви можете отримати цей список за допомогою:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

Щоб вручну перевірити підписані контейнерні образи основних компонентів Kubernetes, зверніться до документа [Перевірка підписаних контейнерних образів](/docs/tasks/administer-cluster/verify-signed-artifacts).

Якщо ви витягуєте образ контейнера для певної архітектури, то цей образ для однієї архітектури
підписаний так само як і мультиархітектурні списки маніфестів.

## Бінарні файли {#binaries}

{{< release-binaries >}}
