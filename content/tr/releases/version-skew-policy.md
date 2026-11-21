---
title: Sürüm Sapması Politikası
type: docs
description: >
  Kubernetes bileşenleri arasında desteklenen maksimum sürüm sapması.
---

<!-- overview -->
Bu doküman, çeşitli Kubernetes bileşenleri arasında desteklenen maksimum sürüm sapmasını açıklar.
Belirli küme dağıtım araçları, sürüm sapması üzerine ek kısıtlamalar getirebilir.

<!-- body -->

## Desteklenen sürümler

Kubernetes sürümleri **x.y.z** olarak ifade edilir; burada **x** majör sürüm,
**y** minör sürüm ve **z** yama sürümüdür ve
[Semantik Sürümleme](https://semver.org/) terminolojisini takip eder. Daha fazla bilgi için
[Kubernetes Sürüm Sürümleme](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning)
sayfasına bakın.

Kubernetes projesi, en son üç minör sürüm için sürüm dalları sürdürür
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 ve sonrası [yaklaşık 1 yıllık yama desteği](/releases/patch-releases/#support-period) alır.
Kubernetes 1.18 ve öncesi yaklaşık 9 aylık yama desteği aldı.

Geçerli düzeltmeler — güvenlik düzeltmeleri dahil — ciddiyetlerine ve uygulanabilirliklerine bağlı
olarak bu üç sürüm dalına geri taşınabilir. Yama sürümleri, bu dallardan
[düzenli bir tempoda](/releases/patch-releases/#cadence) ve gerektiğinde ek acil sürümlerle birlikte üretilir.

[Sürüm Yöneticileri](/releases/release-managers/) grubu bu kararı verir.

Daha fazla bilgi için Kubernetes [yama sürümleri](/releases/patch-releases/) sayfasına bakın.

## Desteklenen sürüm sapması

### kube-apiserver

[Yüksek erişilebilirlikli (HA) kümelerde](/docs/setup/production-environment/tools/kubeadm/high-availability/),
en yeni ve en eski `kube-apiserver` örnekleri birbirinin bir minör sürümü içinde olmalıdır.

Örnek:

* en yeni `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* diğer `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde desteklenir

### kubelet

* `kubelet`, `kube-apiserver`'dan daha yeni olmamalıdır.
* `kubelet`, `kube-apiserver`'dan üç minör sürüm kadar daha eski olabilir (1.25 öncesi `kubelet`, `kube-apiserver`'dan yalnızca iki minör sürüm kadar daha eski olabilir).

Örnek:

* `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* `kubelet`, **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}** ve **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde desteklenir

{{< note >}}
Bir HA kümesindeki `kube-apiserver` örnekleri arasında sürüm sapması varsa, bu izin verilen
`kubelet` sürümlerini daraltır.
{{</ note >}}

Örnek:

* `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde
* `kubelet`, **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**
  ve **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde desteklenir (**{{< skew currentVersion >}}**
  desteklenmez çünkü bu, **{{< skew currentVersionAddMinor -1 >}}** sürümündeki `kube-apiserver` örneğinden
  daha yeni olur)

### kube-proxy

* `kube-proxy`, `kube-apiserver`'dan daha yeni olmamalıdır.
* `kube-proxy`, `kube-apiserver`'dan üç minör sürüm kadar daha eski olabilir
  (1.25 öncesi `kube-proxy`, `kube-apiserver`'dan yalnızca iki minör sürüm kadar daha eski olabilir).
* `kube-proxy`, yanında çalıştığı `kubelet` örneğinden üç minör sürüm kadar daha eski veya daha yeni olabilir
  (1.25 öncesi `kube-proxy`, yanında çalıştığı `kubelet` örneğinden yalnızca iki minör sürüm kadar
  daha eski veya daha yeni olabilir).

Örnek:

* `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* `kube-proxy`, **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}** ve **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde desteklenir

{{< note >}}
Bir HA kümesindeki `kube-apiserver` örnekleri arasında sürüm sapması varsa, bu izin verilen
`kube-proxy` sürümlerini daraltır.
{{</ note >}}

Örnek:

* `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde
* `kube-proxy`, **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**
  ve **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde desteklenir (**{{< skew currentVersion >}}**
  desteklenmez çünkü bu, **{{< skew currentVersionAddMinor -1 >}}** sürümündeki `kube-apiserver`
  örneğinden daha yeni olur)

### kube-controller-manager, kube-scheduler ve cloud-controller-manager

`kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`, iletişim kurdukları
`kube-apiserver` örneklerinden daha yeni olmamalıdır. `kube-apiserver` minör sürümüyle
eşleşmeleri beklenir; ancak bir minör sürüm kadar daha eski olabilirler (canlı yükseltmelere
izin vermek için).

Örnek:

* `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* `kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`,
  **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde desteklenir

{{< note >}}
Bir HA kümesindeki `kube-apiserver` örnekleri arasında sürüm sapması varsa ve bu bileşenler
kümedeki herhangi bir `kube-apiserver` örneğiyle iletişim kurabiliyorsa (örneğin, bir yük
dengeleyici aracılığıyla), bu, bu bileşenlerin izin verilen sürümlerini daraltır.
{{< /note >}}

Örnek:

* `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde
* `kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`, herhangi bir
  `kube-apiserver` örneğine yönlendirebilen bir yük dengeleyici ile iletişim kurar
* `kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`,
  **{{< skew currentVersionAddMinor -1 >}}** sürümünde desteklenir (**{{< skew currentVersion >}}**
  desteklenmez çünkü bu, **{{< skew currentVersionAddMinor -1 >}}** sürümündeki `kube-apiserver`
  örneğinden daha yeni olur)

### kubectl

`kubectl`, `kube-apiserver`'ın bir minör sürümü içinde (daha eski veya daha yeni) desteklenir.

Örnek:

* `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* `kubectl`, **{{< skew currentVersionAddMinor 1 >}}**, **{{< skew currentVersion >}}**
  ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde desteklenir

{{< note >}}
Bir HA kümesindeki `kube-apiserver` örnekleri arasında sürüm sapması varsa, bu desteklenen
`kubectl` sürümlerini daraltır.
{{< /note >}}

Örnek:

* `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde
* `kubectl`, **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde desteklenir
  (diğer sürümler, `kube-apiserver` bileşenlerinden birinden bir minör sürümden daha fazla sapmış olur)

## Desteklenen bileşen yükseltme sırası

Bileşenler arasında desteklenen sürüm sapması, bileşenlerin yükseltilmesi gereken sıra üzerinde
etkilere sahiptir. Bu bölüm, mevcut bir kümeyi **{{< skew currentVersionAddMinor -1 >}}**
sürümünden **{{< skew currentVersion >}}** sürümüne geçirmek için bileşenlerin yükseltilmesi
gereken sırayı açıklar.

İsteğe bağlı olarak, yükseltmeye hazırlanırken, Kubernetes projesi yükseltmeniz sırasında
mümkün olduğunca çok regresyon ve hata düzeltmesinden yararlanmak için aşağıdakileri
yapmanızı önerir:

* Bileşenlerin mevcut minör sürümünüzün en son yama sürümünde olduğundan emin olun.
* Bileşenleri hedef minör sürümün en son yama sürümüne yükseltin.

Örneğin, {{<skew currentVersionAddMinor -1>}} sürümünü çalıştırıyorsanız, en son yama sürümünde
olduğunuzdan emin olun. Ardından, {{<skew currentVersion>}} sürümünün en son yama sürümüne yükseltin.

### kube-apiserver

Önkoşullar:

* Tek örnekli bir kümede, mevcut `kube-apiserver` örneği **{{< skew currentVersionAddMinor -1 >}}** sürümünde
* Bir HA kümesinde, tüm `kube-apiserver` örnekleri **{{< skew currentVersionAddMinor -1 >}}** veya
  **{{< skew currentVersion >}}** sürümünde (bu, en eski ve en yeni `kube-apiserver` örneği arasında
  maksimum 1 minör sürüm sapması sağlar)
* Bu sunucu ile iletişim kuran `kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`
  örnekleri **{{< skew currentVersionAddMinor -1 >}}** sürümünde (bu, mevcut API sunucu
  sürümünden daha yeni olmadıklarını ve yeni API sunucu sürümünün 1 minör sürümü içinde
  olduklarını sağlar)
* Tüm düğümlerdeki `kubelet` örnekleri **{{< skew currentVersionAddMinor -1 >}}** veya
  **{{< skew currentVersionAddMinor -2 >}}** sürümünde (bu, mevcut API sunucu sürümünden daha
  yeni olmadıklarını ve yeni API sunucu sürümünün 2 minör sürümü içinde olduklarını sağlar)
* Kayıtlı admission webhook'ları, yeni `kube-apiserver` örneğinin onlara göndereceği verileri
  işleyebilir:
  * `ValidatingWebhookConfiguration` ve `MutatingWebhookConfiguration` nesneleri,
    **{{< skew currentVersion >}}** sürümünde eklenen REST kaynaklarının yeni sürümlerini
    içerecek şekilde güncellenmiştir
    (veya v1.15+'da kullanılabilen [`matchPolicy: Equivalent` seçeneğini](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) kullanır)
  * Webhook'lar, kendilerine gönderilecek REST kaynaklarının yeni sürümlerini ve
    **{{< skew currentVersion >}}** sürümünde mevcut sürümlere eklenen yeni alanları işleyebilir

`kube-apiserver`'ı **{{< skew currentVersion >}}** sürümüne yükseltin

{{< note >}}
[API kullanımdan kaldırma](/docs/reference/using-api/deprecation-policy/) ve
[API değişiklik kılavuzları](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api_changes.md)
için proje politikaları, tek örnekli kümelerde bile `kube-apiserver`'ın yükseltme yaparken
minör sürümleri atlamamasını gerektirir.
{{< /note >}}

### kube-controller-manager, kube-scheduler ve cloud-controller-manager

Önkoşullar:

* Bu bileşenlerin iletişim kurduğu `kube-apiserver` örnekleri **{{< skew currentVersion >}}** sürümünde
  (bu kontrol düzlemi bileşenlerinin kümedeki herhangi bir `kube-apiserver` örneğiyle iletişim
  kurabildiği HA kümelerinde, bu bileşenleri yükseltmeden önce tüm `kube-apiserver` örnekleri
  yükseltilmelidir)

`kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`'ı
**{{< skew currentVersion >}}** sürümüne yükseltin. `kube-controller-manager`, `kube-scheduler`
ve `cloud-controller-manager` arasında gerekli bir yükseltme sırası yoktur. Bu bileşenleri
herhangi bir sırayla veya hatta aynı anda yükseltebilirsiniz.

### kubelet

Önkoşullar:

* `kubelet`'in iletişim kurduğu `kube-apiserver` örnekleri **{{< skew currentVersion >}}** sürümünde

İsteğe bağlı olarak `kubelet` örneklerini **{{< skew currentVersion >}}** sürümüne yükseltin
(veya **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**
veya **{{< skew currentVersionAddMinor -3 >}}** sürümünde bırakılabilirler)

{{< note >}}
Bir minör sürüm `kubelet` yükseltmesi gerçekleştirmeden önce, o düğümdeki pod'ları
[boşaltın](/docs/tasks/administer-cluster/safely-drain-node/). Yerinde minör sürüm `kubelet`
yükseltmeleri desteklenmez.
{{</ note >}}

{{< warning >}}
Sürekli olarak `kube-apiserver`'dan üç minör sürüm geride kalan `kubelet` örnekleriyle bir küme
çalıştırmak, kontrol düzlemi yükseltilmeden önce bu örneklerin yükseltilmesi gerektiği anlamına gelir.
{{</ warning >}}

### kube-proxy

Önkoşullar:

* `kube-proxy`'nin iletişim kurduğu `kube-apiserver` örnekleri **{{< skew currentVersion >}}** sürümünde

İsteğe bağlı olarak `kube-proxy` örneklerini **{{< skew currentVersion >}}** sürümüne yükseltin
(veya **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**
veya **{{< skew currentVersionAddMinor -3 >}}** sürümünde bırakılabilirler)

{{< warning >}}
Sürekli olarak `kube-apiserver`'dan üç minör sürüm geride kalan `kube-proxy` örnekleriyle bir küme
çalıştırmak, kontrol düzlemi yükseltilmeden önce bu örneklerin yükseltilmesi gerektiği anlamına gelir.
{{</ warning >}}
