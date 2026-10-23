---
reviewers:
- caesarxuchao
- dchen1107
title: Düğümler (Nodes)
api_metadata:
- apiVersion: "v1"
  kind: "Node"
content_type: concept
weight: 10
---

<!-- overview -->

Kubernetes, konteynerlerinizi Pod'lar içerisine yerleştirerek bunları _Düğümler_ (Nodes) üzerinde çalıştırır. Kümenin mimarisine bağlı olarak bir düğüm, sanal bir makine (VM) veya fiziksel bir sunucu (bare metal) olabilir. Her düğüm kontrol düzlemi (control plane) tarafından yönetilir ve Pod'ları çalıştırmak için gerekli servisleri barındırır.

Genellikle bir kümede birden çok düğüm bulunur; ancak öğrenme veya kaynak kısıtlı ortamlarda yalnızca tek bir düğüm de bulunabilir.

Bir düğüm üzerindeki temel bileşenler şunlardır:
* [kubelet](/docs/concepts/architecture/#kubelet)
* [Konteyner Çalışma Zamanı (Container Runtime)](/docs/concepts/architecture/#container-runtime)
* [kube-proxy](/docs/concepts/architecture/#kube-proxy)

<!-- body -->

## Düğüm Yönetimi

Düğümlerin API sunucusuna eklenmesinin iki temel yolu vardır:

1. Düğüm üzerindeki kubelet'in kontrol düzlemine otomatik olarak kendi kaydını yapması (self-registration).
2. Sizin (veya bir yöneticinin) manuel olarak bir Düğüm nesnesi oluşturması.

Bir Düğüm nesnesi oluşturulduğunda veya kubelet kendi kaydını tamamladığında, kontrol düzlemi yeni Düğüm nesnesinin geçerli olup olmadığını denetler. Örneğin düğüm sağlıklıyse (yani gerekli tüm hizmetler çalışıyorsa), Pod çalıştırmaya uygun hale gelir. Aksi takdirde, sağlıklı hale gelene kadar küme etkinliklerinde yok sayılır.

### Düğüm Adı Benzersizliği

Düğüm adı (`metadata.name`), bir düğümü benzersiz şekilde tanımlar. İki düğüm aynı anda aynı ada sahip olamaz. Kubernetes, aynı ada sahip bir kaynağın aynı nesne olduğunu varsayar.

## Düğüm Durumu (Node Status)

Bir düğümün durumu; düğümün adresleri, çalışma koşulları, kapasitesi ve genel sistem bilgileri hakkında veriler içerir. Durumu incelemek için:

```shell
kubectl describe node <dugum-adi>
```

### Koşullar (Conditions)

`conditions` alanı, çalışan tüm düğümlerin durumunu tanımlar. Başlıca durum koşulları şunlardır:

* **Ready:** Düğüm sağlıklı ve Pod kabul etmeye hazırsa `True` değerini alır.
* **DiskPressure:** Düğümün disk kapasitesinde baskı varsa `True` değerini alır.
* **MemoryPressure:** Düğümün bellek (RAM) kapasitesinde baskı varsa `True` değerini alır.
* **PIDPressure:** Düğümde çok fazla işlem (PID) çalışıyorsa `True` değerini alır.
* **NetworkUnavailable:** Düğüm için ağ yapılandırması henüz tamamlanmadıysa `True` değerini alır.

### Kapasite ve Ayrılabilir Kaynaklar (Capacity & Allocatable)

Düğümün kullanılabilir kaynaklarını belirtir: CPU miktarı, bellek boyutu ve düğüm üzerinde çalıştırılabilecek maksimum Pod sayısı.

## Düğüm Kalp Atışları (Heartbeats)

Kubernetes düğümleri, kümenin kontrol düzlemine düzenli aralıklarla "kalp atışı" (heartbeat) gönderir. Bu kalp atışları sayesinde kontrol düzlemi düğümün ayakta olduğunu bilir ve olası arızaları anında tespit ederek Pod'ları sağlıklı düğümlere tahliye edebilir.

## {{% heading "whatsnext" %}}

* Düğümleri denetleyen [Düğüm Denetleyicisi (Node Controller)](/docs/concepts/architecture/nodes/#node-controller) hakkında daha fazla bilgi edinin.
* Düğümler üzerindeki kaynakları yönetmek için [Düğüm Kapasitesi](/docs/concepts/architecture/nodes/#capacity) belgelerini inceleyin.
