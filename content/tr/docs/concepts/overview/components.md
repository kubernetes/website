---
reviewers:
- lavalamp
title: Kubernetes Bileşenleri
content_type: concept
description: >
  Bir Kubernetes kümesini oluşturan temel bileşenlere genel bir bakış.
weight: 10
theme_lock: light
card:
  title: Bir kümenin bileşenleri
  name: concepts
  weight: 20
---

<!-- overview -->

Bu sayfa, bir Kubernetes kümesini (cluster) oluşturan temel bileşenlere üst düzey bir genel bakış sunmaktadır.

{{< figure src="/images/docs/components-of-kubernetes.svg" alt="Kubernetes Bileşenleri" caption="Bir Kubernetes kümesinin temel bileşenleri" class="diagram-large" clicktozoom="true" >}}

<!-- body -->

## Temel Bileşenler

Bir Kubernetes kümesi, bir kontrol düzlemi (control plane) ve bir veya daha fazla çalışan düğümden (worker node) oluşur.
İşte temel bileşenlere kısa bir genel bakış:

### Kontrol Düzlemi Bileşenleri (Control Plane Components)

Kümenin genel durumunu yönetir:

[kube-apiserver](/docs/concepts/architecture/#kube-apiserver)
: Kubernetes HTTP API'sini dışarıya sunan çekirdek bileşen sunucusudur.

[etcd](/docs/concepts/architecture/#etcd)
: Tüm API sunucu verileri için tutarlı ve yüksek oranda erişilebilir anahtar-değer (key-value) veri deposudur.

[kube-scheduler](/docs/concepts/architecture/#kube-scheduler)
: Henüz bir düğüme atanmamış Pod'ları tespit eder ve her Pod'u çalıştırılması için uygun bir düğüme atar.

[kube-controller-manager](/docs/concepts/architecture/#kube-controller-manager)
: Kubernetes API davranışlarını uygulamak üzere denetleyicileri (controllers) çalıştırır.

[cloud-controller-manager](/docs/concepts/architecture/#cloud-controller-manager) (isteğe bağlı)
: Altta yatan bulut sağlayıcısı veya sağlayıcıları ile entegrasyonu yönetir.

### Düğüm Bileşenleri (Node Components)

Çalışan Pod'ları yönetmek ve Kubernetes çalışma zamanı ortamını sağlamak için her düğümde çalışır:

[kubelet](/docs/concepts/architecture/#kubelet)
: Pod'ların ve içerdikleri konteynerlerin düğüm üzerinde sağlıklı şekilde çalıştığından emin olur.

[kube-proxy](/docs/concepts/architecture/#kube-proxy) (isteğe bağlı)
: Düğümler üzerinde ağ kurallarını yöneterek Kubernetes Servisleri'nin (Services) ağ iletişimini sağlar.

[Konteyner Çalışma Zamanı (Container Runtime)](/docs/concepts/architecture/#container-runtime)
: Konteynerlerin çalıştırılmasından sorumlu olan yazılımdır (örn. containerd, CRI-O). Daha fazla bilgi edinmek için [Konteyner Çalışma Zamanları](/docs/setup/production-environment/container-runtimes/) kılavuzunu inceleyebilirsiniz.

{{% thirdparty-content single="true" %}}

Kümeniz her düğüm üzerinde ek yazılımlar gerektirebilir; örneğin, yerel bileşenleri denetlemek için bir Linux düğümünde [systemd](https://systemd.io/) çalıştırabilirsiniz.

## Eklentiler (Addons)

Eklentiler, Kubernetes'in işlevselliğini genişletir. Bazı önemli örnekler şunlardır:

[DNS](/docs/concepts/architecture/#dns)
: Küme genelinde DNS ad çözümlemesi sağlar.

[Web Kullanıcı Arayüzü (Dashboard)](/docs/concepts/architecture/#web-ui-dashboard)
: Bir web arayüzü üzerinden küme yönetimi sağlar.

[Konteyner Kaynak İzleme](/docs/concepts/architecture/#container-resource-monitoring)
: Konteyner metriklerini toplar ve saklar.

[Küme Düzeyinde Günlükleme (Logging)](/docs/concepts/architecture/#cluster-level-logging)
: Konteyner günlüklerini (logs) merkezi bir depolama alanına kaydeder.

## Mimaride Esneklik

Kubernetes, bu bileşenlerin nasıl dağıtılacağı ve yönetileceği konusunda esneklik sağlar.
Mimari; küçük geliştirme ortamlarından büyük ölçekli kurumsal üretim dağıtımlarına kadar çeşitli ihtiyaçlara göre uyarlanabilir.

Her bileşen hakkında daha ayrıntılı bilgi ve küme mimarinizi yapılandırmanın çeşitli yolları için [Küme Mimarisi](/docs/concepts/architecture/) sayfasını inceleyebilirsiniz.
