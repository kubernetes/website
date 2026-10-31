---
title: Kubernetes'i İndir
type: docs
---

Kubernetes, her bileşen için ikili dosyaların yanı sıra bir kümeyi başlatmak veya bir kümeyle
etkileşim kurmak için standart bir araç seti sunar. API sunucusu (`kube-apiserver`) gibi bileşenler,
bir küme içinde konteyner imajları olarak (Kubernetes üzerindeki bir uygulamaya benzer şekilde)
çalışabilirler. Bu tür bileşenler, resmi sürüm sürecinin bir parçası olarak konteyner imajları halinde
paketlenir. Hem tüm ikili dosyalar hem de konteyner imajları, birçok işletim sistemi ve donanım
mimarisiyle uyumlu olarak yayınlanır.

### kubectl

<!-- overview -->

Kubernetes komut satırı aracı [kubectl](/docs/reference/kubectl/kubectl/), bir Kubernetes kümesiyle
etkileşim kurmanızı sağlar.

kubectl'i uygulamaları dağıtmak, küme kaynaklarını gözlemleyip yönetmek veya günlükleri görüntülemek için
kullanabilirsiniz. kubectl hakkında daha fazla bilgi için
[`kubectl` dokümantasyonuna](/docs/reference/kubectl/) bakın.

kubectl, Linux, macOS veya Windows dahil olmak üzere çeşitli işletim sistemlerine yüklenebilir.
Aşağıda işletim sisteminize göre kurulum kılavuzlarını bulabilirsiniz.

- [Linux için kubectl yükleyin](/docs/tasks/tools/install-kubectl-linux)
- [macOS için kubectl yükleyin](/docs/tasks/tools/install-kubectl-macos)
- [Windows için kubectl yükleyin](/docs/tasks/tools/install-kubectl-windows)

## Konteyner imajları

Tüm Kubernetes konteyner imajları `registry.k8s.io` adresine yüklenir.

| Konteyner İmajı                                                           | Desteklenen Mimariler             |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### Konteyner imaj mimarileri

Tüm konteyner imajları, çoklu mimariler için kullanılabilir. Konteyner imaj adına son ek ekleyerek
makinenizin mimarisine tam olarak uyan konteyner imajını çekebilirsiniz. Örneğin
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Konteyner imaj imzaları

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Tüm Kubernetes konteyner imajları [sigstore](https://sigstore.dev) imzaları kullanılarak imzalanır.

Kubernetes, imzalı konteyner imajları listesini [SPDX 2.3](https://spdx.dev/specifications/) biçiminde
yayımlar. Listeyi şu şekilde alabilirsiniz:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

İmzalı konteyner imajlarını doğrulamak için
[İmzalı Konteyner İmajlarını Doğrulama](/docs/tasks/administer-cluster/verify-signed-artifacts) bölümündeki
yönergeleri izleyin.

## İkili dosyalar

{{< release-binaries >}}
