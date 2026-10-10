---
title: Genel Bakış (Overview)
weight: 10
description: >
  Kubernetes'in ne olduğuna, mimari bileşenlerine ve yeteneklerine genel bakış.
---

## Kubernetes'e Genel Bakış

Kubernetes; konteynerleştirilmiş uygulamaların dağıtımını, ölçeklendirilmesini ve yönetimini otomatikleştiren açık kaynaklı bir konteyner orkestrasyon platformudur.

### Neden Kubernetes?

Kapsayıcılar (Containers), uygulamalarınızı paketlemek ve çalıştırmak için modern ve hafif bir yöntemdir. Üretim ortamında, uygulamaları çalıştıran kapsayıcıları yönetmeniz ve hiçbir kesinti süresi yaşanmamasını sağlamanız gerekir. Örneğin bir konteyner çökerse, başka bir konteynerin başlatılması gerekir. Bu sürecin bir sistem tarafından otomatik olarak ele alınması çok daha kolay olmaz mıydı?

İşte Kubernetes bu kurtarıcı rolü üstlenir! Kubernetes size dağıtık sistemleri esnek bir şekilde çalıştırmanız için bir altyapı sunar. Uygulamanızın ölçeklenmesini, hata telafisini, dağıtım desenlerini ve çok daha fazlasını otomatik olarak yönetir.

### Temel Yetenekler
- **Servis Keşfi ve Yük Dengeleme:** Pod'lara IP atar ve DNS adlarıyla yükü dengeler.
- **Depolama Orkestrasyonu:** Yerel veya bulut depolama sistemlerini otomatik bağlar.
- **Otomatik Dağıtımlar ve Geri Alma:** Uygulama sürümlerini kesintisiz günceller, hata durumunda geri alır.
- **Otomatik Paketleme:** Kaynak gereksinimlerine göre konteynerleri en uygun düğümlere yerleştirir.
- **Kendi Kendini Onarma:** Çöken konteynerleri yeniden başlatır, yanıt vermeyenleri değiştirir.
- **Gizli Bilgi ve Yapılandırma Yönetimi:** Parola ve token gibi hassas bilgileri güvenle saklar.
