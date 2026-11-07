---
title: Kubernetes Nedir?
description: >
  Kubernetes; konteynerleştirilmiş iş yüklerini ve servisleri yönetmek için geliştirilmiş, hem bildirimsel (declarative) yapılandırmayı hem de otomasyonu kolaylaştıran, taşınabilir ve genişletilebilir açık kaynaklı bir platformdur.
weight: 10
---

Bu sayfa Kubernetes'e genel bir bakış sunmaktadır.

{{% alert title="Not" color="info" %}}
Kubernetes ismi Yunanca kökenli olup "dümenci" veya "kılavuz kaptan" anlamına gelir. **K8s** kısaltması ise "K" ile "s" harfleri arasındaki 8 harften türetilmiştir. Google, Kubernetes projesini 2014 yılında açık kaynak olarak kullanıma sunmuştur.
{{% /alert %}}

## Zamanda Yolculuk: Konteynerlerin Doğuşu

Dağıtım yöntemlerinin nasıl geliştiğine bakmak, Kubernetes'in neden bu kadar kritik olduğunu anlamaya yardımcı olur:

### Geleneksel Dağıtım Çağı
Erken dönemlerde kuruluşlar uygulamaları fiziksel sunucular üzerinde çalıştırıyordu. Fiziksel bir sunucuda birden çok uygulama için kaynak sınırları tanımlamak mümkün değildi ve bu durum kaynak tahsisi sorunlarına yol açıyordu. Örneğin, birden çok uygulama tek bir fiziksel sunucuda çalışıyorsa, bir uygulamanın kaynakların çoğunu tüketmesi diğer uygulamaların performansını düşürüyordu.

### Sanallaştırılmış Dağıtım Çağı
Bir çözüm olarak sanallaştırma tanıtıldı. Tek bir fiziksel sunucunun CPU'su üzerinde birden çok Sanal Makine (VM) çalıştırma olanağı sağlandı. Sanallaştırma, uygulamaların VM'ler arasında yalıtılmasını sağlayarak bir kuruluşun uygulamalarının diğer kuruluşlarca serbestçe erişilememesi gibi güvenlik avantajları sundu.

### Konteyner Dağıtım Çağı
Konteynerler VM'lere benzerdir; ancak uygulamalar arasında İşletim Sistemini (OS) paylaşmak üzere esnek izolasyon özelliklerine sahiptirler. Bu nedenle konteynerler "hafif" (lightweight) olarak kabul edilir. Bir VM gibi bir konteyner de kendi dosya sistemine, CPU payına, belleğine, işlem alanına ve daha fazlasına sahiptir. Altyapıdan bağımsız oldukları için bulutlar ve işletim sistemi dağıtımları arasında taşınabilirdirler.

## Kubernetes Neden Gereklidir ve Neler Yapabilir?

Konteynerler uygulamalarınızı çalıştırmanın harika bir yoludur. Bir üretim ortamında, uygulamaları çalıştıran konteynerleri yönetmeniz ve kesinti olmamasını sağlamanız gerekir. Örneğin, bir konteyner çökerse başka bir konteynerin başlatılması gerekir. Bu davranışın bir sistem tarafından otomatik olarak yönetilmesi daha kolay olmaz mıydı?

Kubernetes tam olarak bunu sağlar! Kubernetes size dağıtılmış sistemleri dayanıklı bir şekilde çalıştırmak için bir çatı sunar. Uygulamanızın ölçeklenmesini, yük devretmesini (failover), devreye alma düzenlerini ve daha fazlasını yönetir:

- **Hizmet keşfi ve yük dengeleme:** Kubernetes, bir konteyneri DNS adını veya kendi IP adresini kullanarak açığa çıkarabilir. Bir konteynere gelen trafik yüksekse, Kubernetes trafiği dağıtmak ve dengelemek için ağ trafiğini yönlendirebilir.
- **Depolama orkestrasyonu:** Kubernetes, yerel depolama birimleri veya genel bulut sağlayıcıları gibi seçtiğiniz bir depolama sistemini otomatik olarak bağlamanıza olanak tanır.
- **Otomatik dağıtımlar ve geri almalar:** Kubernetes kullanarak dağıtılan konteynerleriniz için istenen durumu tanımlayabilir ve gerçek durumu kontrollü bir hızla istenen duruma dönüştürebilirsiniz.
- **Otomatik paketleme (Bin packing):** Kubernetes'e her konteynerin ne kadar CPU ve belleğe (RAM) ihtiyaç duyduğunu bildirirsiniz. Kubernetes, kaynakları en iyi şekilde kullanmak için konteynerleri düğümlerinize (node) yerleştirir.
- **Kendi kendini onarma (Self-healing):** Kubernetes başarısız olan konteynerleri yeniden başlatır, kullanıcı tanımlı sağlık denetimlerine yanıt vermeyen konteynerleri kapatır ve istemcilere hizmet vermeye hazır olana kadar bunları duyurmaz.
- **Gizli bilgi ve yapılandırma yönetimi:** Kubernetes, parolalar, OAuth belirteçleri ve SSH anahtarları gibi hassas bilgileri depolamanıza ve yönetmenize olanak tanır.
