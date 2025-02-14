---
title: Kubernetes İndir
type: docs
---

Kubernetes, her bileşen için ikili dosyalar ve bir küme başlatmak veya etkileşimde bulunmak için standart bir dizi istemci uygulaması sağlar. API sunucusu gibi bileşenler, bir küme içinde konteyner görüntüleri içinde çalışabilir. Bu bileşenler, resmi sürüm sürecinin bir parçası olarak konteyner görüntülerinde de sağlanır. Tüm ikili dosyalar ve konteyner görüntüleri, birden fazla işletim sistemi ve donanım mimarisi için mevcuttur.

### kubectl

<!-- genel bakış -->

Kubernetes komut satırı aracı, [kubectl](/docs/reference/kubectl/kubectl/), Kubernetes kümelerine karşı komutlar çalıştırmanıza olanak tanır.

kubectl'i uygulamaları dağıtmak, küme kaynaklarını incelemek ve yönetmek ve günlükleri görüntülemek için kullanabilirsiniz. kubectl işlemlerinin tam listesi de dahil olmak üzere daha fazla bilgi için [`kubectl` referans belgelerine](/docs/reference/kubectl/) bakın.

kubectl, çeşitli Linux platformlarında, macOS ve Windows'ta kurulabilir. Tercih ettiğiniz işletim sistemini aşağıda bulun.

- [Linux'ta kubectl'i kurun](/docs/tasks/tools/install-kubectl-linux)
- [macOS'ta kubectl'i kurun](/docs/tasks/tools/install-kubectl-macos)
- [Windows'ta kubectl'i kurun](/docs/tasks/tools/install-kubectl-windows)

## Konteyner görüntüleri

Tüm Kubernetes konteyner görüntüleri `registry.k8s.io` konteyner görüntü kayıt defterine dağıtılır.

| Konteyner Görüntüsü                                                       | Desteklenen Mimariler             |
| ------------------------------------------------------------------------- | --------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x |

### Konteyner görüntü mimarileri

Tüm konteyner görüntüleri birden fazla mimari için mevcuttur, bu nedenle konteyner çalışma zamanı, alttaki platforma göre doğru olanı seçmelidir. Ayrıca, konteyner görüntü adının sonuna ekleyerek belirli bir mimariyi çekmek de mümkündür, örneğin `registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Konteyner görüntü imzaları

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Kubernetes {{< param "version" >}} için konteyner görüntüleri [sigstore](https://sigstore.dev) imzaları kullanılarak imzalanır:

{{< note >}}
Konteyner görüntü sigstore imzaları şu anda farklı coğrafi konumlar arasında eşleşmemektedir.
Bu sorun hakkında daha fazla bilgi ilgili [GitHub sorunu](https://github.com/kubernetes/registry.k8s.io/issues/187) adresinde mevcuttur.
{{< /note >}}

Kubernetes projesi, imzalı Kubernetes konteyner görüntülerinin bir listesini [SPDX 2.3](https://spdx.dev/specifications/) formatında yayınlar.
Bu listeyi şu şekilde alabilirsiniz:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

Kubernetes çekirdek bileşenlerinin imzalı konteyner görüntülerini manuel olarak doğrulamak için [İmzalı Konteyner Görüntülerini Doğrulama](/docs/tasks/administer-cluster/verify-signed-artifacts) adresine bakın.

Belirli bir mimari için bir konteyner görüntüsü çekerseniz, tek mimarili görüntü, çok mimarili manifest listeleri için olduğu gibi aynı şekilde imzalanır.

## İkili dosyalar

{{< release-binaries >}}
