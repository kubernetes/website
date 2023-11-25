---
title: Ściągnij Kubernetesa
type: docs
---

Klaster Kubernetesa dostępny jest w formie plików binarnych dla każdego z jego komponentów i zestawu standardowych aplikacji klienckich wspomagających proces jego szybkiego rozruchu lub obsługi. Składniki Kubernetesa takie jak serwer API mogą być uruchamiane z poziomu obrazów kontenerowych wewnątrz klastra - te ostatnie są także   częścią oficjalnego wydania Kubernetesa. Wszystkie pliki binarne i obrazy kontenerowe Kubernetesa udostępniane są dla różnych systemów operacyjnych i architektur sprzętowych.  

### kubectl

<!--overview-->

[kubectl](/docs/reference/kubectl/kubectl/) to narzędzie powłoki umożliwiające wykonywanie komend w klastrze Kubernetesa służących do m.in. uruchamiania aplikacji, zarządzania zasobami klastra i przeglądania logów. Więcej informacji na temat kubectl, w tym pełną list operacji, jakie możesz za jego pomocą wykonać, znajdziesz w [Dokumentacji `kubectl`](/docs/reference/kubectl/).

kubectl można zainstalować w rozmaitych systemach z rodziny Linuxa, jak również w systemach macOS i Windows. Niżej znajdziesz odnośniki do instrukcji instalacji dla preferowanego przez siebie systemu:
- [Instalacja kubectl w Linuxie](/docs/tasks/tools/install-kubectl-linux)
- [Instalacja kubectl w macOS-ie](/docs/tasks/tools/install-kubectl-macos)
- [Instalacja kubectl w Windowsie](/docs/tasks/tools/install-kubectl-windows)

## Obrazy kontenerów

Wszystkie obrazy kontenerowe umieszczane są w rejestrze `registry.k8s.io`.

{{< feature-state for_k8s_version="v1.24" state="alpha" >}}

Dla wersji Kubernetesa {{< param "version">}} następujące obrazy kontenerów opatrzone są podpisem [cosign](https://github.com/sigstore/cosign):

| Obraz kontenera                                                           | Wspierana architektura                                                                   |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

Obrazy kontenerów Kubernetesa obsługują rozmaite architektury sprzętowe, ich wyboru powinno zaś dokonać środowisko uruchomieniowe w zależności od wybranej platformy. Istnieje też możliwość pobrania obrazu kontenera dla konkretnej architektury poprzez dodanie do jego nazwy odpowiedniego przyrostka, np. `registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`. Wszystkie te warianty obrazów Kubernetesa są podpisane w taki sam sposób jak w przypadku listy manifestów wieloarchitekturowych. 

Wydawcy Kubernetesa publikują listę podpisanych obrazów kontenerowych w formacie [SPDX 2.3](https://spdx.dev/specifications/). Możesz ją pobrać wpisując w powłoce: 

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

Dla wersji {{< skew currentVersion >}} Kubernetesa jedynym typem artefaktu kodu, którego integralność możesz zweryfikować, jest obraz kontenera (korzystając z eksperymentalnej opcji podpisu). 

By ręcznie zweryfikować podpisane obrazy kontenerów głównych komponentów Kubernetesa, zobacz [Zweryfikuj podpisane obrazy kontenerów](/docs/tasks/administer-cluster/verify-signed-artifacts).

## Pliki binarne

{{< release-binaries >}}