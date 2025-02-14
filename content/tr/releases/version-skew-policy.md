---
inceleyenler:
- sig-api-machinery
- sig-architecture
- sig-cli
- sig-cluster-lifecycle
- sig-node
- sig-release
başlık: Sürüm Uyumsuzluk Politikası
tür: belgeler
açıklama: >
  Çeşitli Kubernetes bileşenleri arasındaki maksimum sürüm uyumsuzluğu.
---

<!-- genel bakış -->
Bu belge, çeşitli Kubernetes bileşenleri arasındaki maksimum sürüm uyumsuzluğunu açıklar.
Belirli küme dağıtım araçları, sürüm uyumsuzluğu konusunda ek kısıtlamalar getirebilir.

<!-- gövde -->

## Desteklenen sürümler

Kubernetes sürümleri **x.y.z** olarak ifade edilir, burada **x** ana sürüm,
**y** alt sürüm ve **z** yama sürümüdür, [Semantik Sürümleme](https://semver.org/) terminolojisini takip eder.
Daha fazla bilgi için [Kubernetes Sürümleme](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning) sayfasına bakın.

Kubernetes projesi, en son üç alt sürüm için sürüm dallarını korur
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 ve daha yenileri [yaklaşık 1 yıl yama desteği](/releases/patch-releases/#support-period) alır.
Kubernetes 1.18 ve daha eskileri yaklaşık 9 ay yama desteği aldı.

Uygulanabilir düzeltmeler, güvenlik düzeltmeleri dahil, bu üç sürüm dalına geri taşınabilir,
ciddiyet ve uygulanabilirliğe bağlı olarak. Yama sürümleri, bu dallardan
[düzenli bir kadansla](/releases/patch-releases/#cadence) ve gerektiğinde ek acil sürümlerle kesilir.

[Release Managers](/releases/release-managers/) grubu bu kararı sahiplenir.

Daha fazla bilgi için Kubernetes [yama sürümleri](/releases/patch-releases/) sayfasına bakın.

## Desteklenen sürüm uyumsuzluğu

### kube-apiserver

[Yüksek kullanılabilirlik (HA) kümelerinde](/docs/setup/production-environment/tools/kubeadm/high-availability/),
en yeni ve en eski `kube-apiserver` örnekleri bir alt sürüm içinde olmalıdır.

Örnek:

* en yeni `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* diğer `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde desteklenir

### kubelet

* `kubelet`, `kube-apiserver`'dan daha yeni olmamalıdır.
* `kubelet`, `kube-apiserver`'dan en fazla üç alt sürüm eski olabilir (`kubelet` < 1.25 yalnızca `kube-apiserver`'dan en fazla iki alt sürüm eski olabilir).

Örnek:

* `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* `kubelet` **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}** ve **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde desteklenir

{{< note >}}
HA kümesinde `kube-apiserver` örnekleri arasında sürüm uyumsuzluğu varsa, bu durum izin verilen `kubelet` sürümlerini daraltır.
{{</ note >}}

Örnek:

* `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde
* `kubelet` **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  ve **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde desteklenir (**{{< skew currentVersion >}}** desteklenmez çünkü bu,
  **{{< skew currentVersionAddMinor -1 >}}** sürümündeki `kube-apiserver` örneğinden daha yeni olurdu)

### kube-proxy

* `kube-proxy`, `kube-apiserver`'dan daha yeni olmamalıdır.
* `kube-proxy`, `kube-apiserver`'dan en fazla üç alt sürüm eski olabilir
  (`kube-proxy` < 1.25 yalnızca `kube-apiserver`'dan en fazla iki alt sürüm eski olabilir).
* `kube-proxy`, yanında çalıştığı `kubelet` örneğinden en fazla üç alt sürüm eski veya yeni olabilir
  (`kube-proxy` < 1.25 yalnızca yanında çalıştığı `kubelet` örneğinden en fazla iki alt sürüm eski veya yeni olabilir).

Örnek:

* `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* `kube-proxy` **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}** ve **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde desteklenir

{{< note >}}
HA kümesinde `kube-apiserver` örnekleri arasında sürüm uyumsuzluğu varsa, bu durum izin verilen `kube-proxy` sürümlerini daraltır.
{{</ note >}}

Örnek:

* `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde
* `kube-proxy` **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**,
  ve **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde desteklenir (**{{< skew currentVersion >}}** desteklenmez çünkü bu,
  **{{< skew currentVersionAddMinor -1 >}}** sürümündeki `kube-apiserver` örneğinden daha yeni olurdu)

### kube-controller-manager, kube-scheduler ve cloud-controller-manager

`kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`, iletişim kurdukları
`kube-apiserver` örneklerinden daha yeni olmamalıdır. `kube-apiserver` alt sürümüyle eşleşmeleri beklenir,
ancak canlı yükseltmelere izin vermek için bir alt sürüm eski olabilirler.

Örnek:

* `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* `kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`
  **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde desteklenir

{{< note >}}
HA kümesinde `kube-apiserver` örnekleri arasında sürüm uyumsuzluğu varsa ve bu bileşenler
kümedeki herhangi bir `kube-apiserver` örneğiyle iletişim kurabiliyorsa (örneğin, bir yük dengeleyici aracılığıyla),
bu durum bu bileşenlerin izin verilen sürümlerini daraltır.
{{< /note >}}

Örnek:

* `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde
* `kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager` bir yük dengeleyiciyle iletişim kurar
  ve bu yük dengeleyici herhangi bir `kube-apiserver` örneğine yönlendirebilir
* `kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager`
  **{{< skew currentVersionAddMinor -1 >}}** sürümünde desteklenir (**{{< skew currentVersion >}}** desteklenmez çünkü bu,
  **{{< skew currentVersionAddMinor -1 >}}** sürümündeki `kube-apiserver` örneğinden daha yeni olurdu)

### kubectl

`kubectl`, `kube-apiserver`'dan bir alt sürüm (eski veya yeni) içinde desteklenir.

Örnek:

* `kube-apiserver` **{{< skew currentVersion >}}** sürümünde
* `kubectl` **{{< skew currentVersionAddMinor 1 >}}**, **{{< skew currentVersion >}}**,
  ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde desteklenir

{{< note >}}
HA kümesinde `kube-apiserver` örnekleri arasında sürüm uyumsuzluğu varsa, bu durum desteklenen `kubectl` sürümlerini daraltır.
{{< /note >}}

Örnek:

* `kube-apiserver` örnekleri **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde
* `kubectl` **{{< skew currentVersion >}}** ve **{{< skew currentVersionAddMinor -1 >}}** sürümlerinde desteklenir
  (diğer sürümler, `kube-apiserver` bileşenlerinden birinden bir alt sürümden fazla uyumsuz olurdu)

## Desteklenen bileşen yükseltme sırası

Bileşenler arasındaki desteklenen sürüm uyumsuzluğunun, bileşenlerin yükseltilme sırası üzerinde etkileri vardır.
Bu bölüm, mevcut bir kümeyi **{{< skew currentVersionAddMinor -1 >}}** sürümünden **{{< skew currentVersion >}}** sürümüne
geçirmek için bileşenlerin hangi sırayla yükseltilmesi gerektiğini açıklar.

İsteğe bağlı olarak, yükseltmeye hazırlanırken, Kubernetes projesi aşağıdakileri yapmanızı önerir:
mümkün olduğunca çok sayıda gerileme ve hata düzeltmesinden yararlanmak için:

* Bileşenlerin mevcut alt sürümünüzün en son yama sürümünde olduğundan emin olun.
* Bileşenleri hedef alt sürümün en son yama sürümüne yükseltin.

Örneğin, {{<skew currentVersionAddMinor -1>}} sürümünü çalıştırıyorsanız,
en son yama sürümünde olduğunuzdan emin olun. Ardından, {{<skew currentVersion>}} sürümünün
en son yama sürümüne yükseltin.

### kube-apiserver

Ön koşullar:

* Tek örnekli bir kümede, mevcut `kube-apiserver` örneği **{{< skew currentVersionAddMinor -1 >}}** sürümündedir
* HA kümesinde, tüm `kube-apiserver` örnekleri **{{< skew currentVersionAddMinor -1 >}}** veya
  **{{< skew currentVersion >}}** sürümündedir (bu, en eski ve en yeni `kube-apiserver` örneği arasında maksimum 1 alt sürüm uyumsuzluğu sağlar)
* Bu sunucuyla iletişim kuran `kube-controller-manager`, `kube-scheduler` ve `cloud-controller-manager` örnekleri
  **{{< skew currentVersionAddMinor -1 >}}** sürümündedir
  (bu, mevcut API sunucusu sürümünden daha yeni olmadıklarını ve yeni API sunucusu sürümünden 1 alt sürüm içinde olduklarını sağlar)
* Tüm düğümlerdeki `kubelet` örnekleri **{{< skew currentVersionAddMinor -1 >}}** veya **{{< skew currentVersionAddMinor -2 >}}** sürümündedir
  (bu, mevcut API sunucusu sürümünden daha yeni olmadıklarını ve yeni API sunucusu sürümünden 2 alt sürüm içinde olduklarını sağlar)
* Kayıtlı kabul web kancaları, yeni `kube-apiserver` örneğinin göndereceği verileri işleyebilir:
  * `ValidatingWebhookConfiguration` ve `MutatingWebhookConfiguration` nesneleri, **{{< skew currentVersion >}}**'de
    eklenen REST kaynaklarının yeni sürümlerini içerecek şekilde güncellenir
    (veya v1.15+ sürümünde mevcut olan [`matchPolicy: Equivalent` seçeneğini](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy) kullanır)
  * Web kancaları, kendilerine gönderilecek REST kaynaklarının yeni sürümlerini ve
    **{{< skew currentVersion >}}**'de mevcut sürümlere eklenen yeni alanları işleyebilir

`kube-apiserver`'ı **{{< skew currentVersion >}}** sürümüne yükseltin

{{< note >}}
[API kullanımdan kaldırma](/docs/reference/using-api/deprecation-policy/) ve
[API değişiklik yönergeleri](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)
için proje politikaları, `kube-apiserver`'ın tek örnekli kümelerde bile alt sürümleri atlamadan yükseltilmesini gerektirir.
{{< /note >}}

### kube-controller-manager, kube-scheduler ve cloud-controller-manager

Ön koşullar:

* Bu bileşenlerin iletişim kurduğu `kube-apiserver` örnekleri **{{< skew currentVersion >}}** sürümündedir
  (bu kontrol düzlemi bileşenlerinin kümedeki herhangi bir `kube-apiserver` örneğiyle iletişim kurabildiği
  HA kümelerinde, bu bileşenleri yükseltmeden önce tüm `kube-apiserver` örnekleri yükseltilmelidir)

`kube-controller-manager`, `kube-scheduler` ve
`cloud-controller-manager`'ı **{{< skew currentVersion >}}** sürümüne yükseltin.
`kube-controller-manager`, `kube-scheduler` ve
`cloud-controller-manager` arasında zorunlu bir yükseltme sırası yoktur.
Bu bileşenleri herhangi bir sırayla veya hatta aynı anda yükseltebilirsiniz.

### kubelet

Ön koşullar:

* `kubelet`'in iletişim kurduğu `kube-apiserver` örnekleri **{{< skew currentVersion >}}** sürümündedir

İsteğe bağlı olarak `kubelet` örneklerini **{{< skew currentVersion >}}** sürümüne yükseltin (veya
**{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}** veya **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde bırakabilirsiniz)

{{< note >}}
Kümeden [düğümü güvenli bir şekilde boşaltın](/docs/tasks/administer-cluster/safely-drain-node/) ve ardından küçük sürüm `kubelet` yükseltmesi gerçekleştirin.
Yerinde küçük sürüm `kubelet` yükseltmeleri desteklenmez.
{{</ note >}}

{{< warning >}}
`kube-apiserver`'dan kalıcı olarak üç alt sürüm geride olan `kubelet` örnekleri çalıştırmak,
kontrol düzlemi yükseltilmeden önce bunların yükseltilmesi gerektiği anlamına gelir.
{{</ warning >}}

### kube-proxy

Ön koşullar:

* `kube-proxy`'nin iletişim kurduğu `kube-apiserver` örnekleri **{{< skew currentVersion >}}** sürümündedir

İsteğe bağlı olarak `kube-proxy` örneklerini **{{< skew currentVersion >}}** sürümüne yükseltin
(veya **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}** veya **{{< skew currentVersionAddMinor -3 >}}** sürümlerinde bırakabilirsiniz)

{{< warning >}}
`kube-apiserver`'dan kalıcı olarak üç alt sürüm geride olan `kube-proxy` örnekleri çalıştırmak,
kontrol düzlemi yükseltilmeden önce bunların yükseltilmesi gerektiği anlamına gelir.
{{</ warning >}}
