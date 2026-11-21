---
title: Kubernetesni yuklab olish
type: docs
---

Kubernetes har bir komponent uchun binar fayllarni, shuningdek klasterni ishga
tushirish yoki u bilan ishlash uchun mijoz ilovalarining standart toʻplamini
tarqatadi. API server kabi komponentlar klaster ichidagi konteyner
tasvirlarida ishlay oladi. Bu komponentlar rasmiy reliz jarayonining bir qismi
sifatida konteyner tasvirlarida ham tarqatiladi. Barcha binar fayllar va
konteyner tasvirlari bir nechta operatsion tizim hamda apparat arxitekturalari
uchun mavjud.

### kubectl

<!-- overview -->

Kubernetes buyruq satri vositasi [kubectl](/docs/reference/kubectl/kubectl/)
Kubernetes klasterlarida buyruqlar bajarish imkonini beradi.

kubectl yordamida ilovalarni joylashtirish, klaster resurslarini tekshirish va
boshqarish hamda loglarni koʻrish mumkin. kubectl amallarining toʻliq roʻyxati
bilan birga batafsil maʼlumot uchun
[`kubectl` maʼlumotnoma hujjatlari](/docs/reference/kubectl/)ga qarang.

kubectl turli Linux platformalari, macOS va Windowsʼga oʻrnatiladi.
Quyida afzal koʻrgan operatsion tizimingizni toping.

- [kubectlʼni Linuxʼga oʻrnatish](/docs/tasks/tools/install-kubectl-linux)
- [kubectlʼni macOSʼga oʻrnatish](/docs/tasks/tools/install-kubectl-macos)
- [kubectlʼni Windowsʼga oʻrnatish](/docs/tasks/tools/install-kubectl-windows)

## Konteyner tasvirlari {#container-images}

Barcha Kubernetes konteyner tasvirlari
`registry.k8s.io` konteyner tasvirlari registriga joylashtiriladi.

| Konteyner tasviri                                                         | Qoʻllab-quvvatlanadigan arxitekturalar |
| ------------------------------------------------------------------------- | -------------------------------------- |
| registry.k8s.io/kube-apiserver:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x      |
| registry.k8s.io/kube-controller-manager:v{{< skew currentPatchVersion >}} | amd64, arm, arm64, ppc64le, s390x      |
| registry.k8s.io/kube-proxy:v{{< skew currentPatchVersion >}}              | amd64, arm, arm64, ppc64le, s390x      |
| registry.k8s.io/kube-scheduler:v{{< skew currentPatchVersion >}}          | amd64, arm, arm64, ppc64le, s390x      |
| registry.k8s.io/conformance:v{{< skew currentPatchVersion >}}             | amd64, arm, arm64, ppc64le, s390x      |

### Konteyner tasviri arxitekturalari {#container-image-architectures}

Barcha konteyner tasvirlari bir nechta arxitektura uchun mavjud, konteyner
runtime esa asosidagi platformaga qarab toʻgʻrisini tanlashi kerak. Konteyner
tasviri nomiga qoʻshimcha qoʻshib, aniq bir arxitekturani ham olish mumkin,
masalan
`registry.k8s.io/kube-apiserver-arm64:v{{< skew currentPatchVersion >}}`.

### Konteyner tasviri imzolari {#container-image-signatures}

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

Kubernetes {{< param "version" >}} uchun
konteyner tasvirlari [sigstore](https://sigstore.dev)
imzolari yordamida imzolanadi:

Kubernetes loyihasi imzolangan Kubernetes konteyner tasvirlari roʻyxatini
[SPDX 2.3](https://spdx.dev/specifications/) formatida eʼlon qiladi.
Bu roʻyxatni quyidagicha olishingiz mumkin:

```shell
curl -Ls "https://sbom.k8s.io/$(curl -Ls https://dl.k8s.io/release/stable.txt)/release" | grep "SPDXID: SPDXRef-Package-registry.k8s.io" |  grep -v sha256 | cut -d- -f3- | sed 's/-/\//' | sed 's/-v1/:v1/'
```

Kubernetes asosiy komponentlarining imzolangan konteyner tasvirlarini qoʻlda
tekshirish uchun
[imzolangan konteyner tasvirlarini tekshirish](/docs/tasks/administer-cluster/verify-signed-artifacts)ga qarang.

Agar aniq bir arxitektura uchun konteyner tasvirini olsangiz, bitta
arxitekturali tasvir koʻp arxitekturali manifest roʻyxatlari bilan bir xil
tarzda imzolanadi.

## Binar fayllar {#binaries}

{{< release-binaries >}}
