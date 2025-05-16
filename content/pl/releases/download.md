---
title: Ściągnij Kubernetesa
type: docs
---

Klaster Kubernetesa dostępny jest w formie plików binarnych dla każdego z jego
komponentów i zestawu standardowych aplikacji klienckich wspomagających proces jego
szybkiego rozruchu lub obsługi. Składniki Kubernetesa takie jak serwer API mogą być
uruchamiane z poziomu obrazów kontenerowych wewnątrz klastra - te ostatnie są także   częścią
oficjalnego wydania Kubernetesa. Wszystkie pliki binarne i obrazy
kontenerowe Kubernetesa udostępniane są dla różnych systemów operacyjnych i architektur sprzętowych.

### kubectl {#kubectl}

<!-- overview -->

[kubectl](/docs/reference/kubectl/kubectl/) to narzędzie
powłoki umożliwiające wykonywanie komend w klastrze Kubernetesa.

Możesz użyć kubectl do wdrażania aplikacji, inspekcji i zarządzania zasobami klastra oraz
przeglądania logów. Więcej informacji na temat kubectl, w tym pełną list operacji, jakie
możesz za jego pomocą wykonać, znajdziesz w [Dokumentacji `kubectl`](/docs/reference/kubectl/).

kubectl można zainstalować w rozmaitych systemach z rodziny Linuxa, jak również w systemach macOS i Windows.
Niżej znajdziesz odnośniki do instrukcji instalacji dla preferowanego przez siebie systemu:

- [Instalacja kubectl w Linuxie](/docs/tasks/tools/install-kubectl-linux)
- [Instalacja kubectl w macOS-ie](/docs/tasks/tools/install-kubectl-macos)
- [Instalacja kubectl w Windowsie](/docs/tasks/tools/install-kubectl-windows)

## Obrazy kontenerów {#container-images}

Wszystkie obrazy kontenerowe
umieszczane są w rejestrze `registry.k8s.io`.

| Obraz kontenera                                                           | Obsługiwane architektury          |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### Architektury obrazów kontenerów {#container-image-architectures}

Wszystkie obrazy kontenerów są dostępne dla różnych architektur, a środowisko uruchomieniowe
kontenerów powinno automatycznie wybrać odpowiednią wersję na podstawie
platformy bazowej. Możliwe jest również pobranie obrazu
przeznaczonego dla konkretnej architektury, dodając odpowiedni sufiks do nazwy obrazu,
na przykład `registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Sygnatury obrazów kontenerów {#container-image-signatures}

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Dla Kubernetesa {{< param "version" >}},
obrazy kontenerów są podpisywane za
pomocą podpisów [sigstore](https://sigstore.dev):

{{< note >}}
Sygnatury `sigstore` obrazów kontenera nie pasują obecnie do siebie w różnych
lokalizacjach geograficznych. Więcej informacji na temat tego problemu można znaleźć w
odpowiednim [zgłoszeniu na GitHubie](https://github.com/kubernetes/registry.k8s.io/issues/187).
{{< /note >}}

Projekt Kubernetes publikuje listę podpisanych obrazów kontenerów
Kubernetes w formacie
[SPDX 2.3](https://spdx.dev/specifications/). Możesz pobrać tę listę za pomocą:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

Aby ręcznie zweryfikować podpisane obrazy kontenerów głównych komponentów Kubernetesa, zapoznaj
się z [Zweryfikuj podpisane obrazy kontenerów](/docs/tasks/administer-cluster/verify-signed-artifacts).

Jeśli pobierzesz obraz kontenera przeznaczony dla jednej architektury, zostanie on
podpisany w taki sam sposób, jak obrazy dostępne w manifestach wieloarchitekturowych.

## Pliki binarne {#binaries}

{{< release-binaries >}}
