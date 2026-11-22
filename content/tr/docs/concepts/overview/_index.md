---
reviewers:
- bgrant0607
- mikedanese
title: "Genel Bakış"
description: >
  Kubernetes, hem bildirimsel yapılandırmayı hem de otomasyonu kolaylaştıran konteynerleştirilmiş iş yüklerini ve hizmetleri yönetmek için taşınabilir, genişletilebilir, açık kaynaklı bir platformdur. Geniş ve hızla büyüyen bir ekosisteme sahiptir. Kubernetes hizmetleri, desteği ve araçları yaygın olarak mevcuttur.
content_type: concept
weight: 20
theme_lock: light
card:
  name: concepts
  weight: 10
  anchors:
  - anchor: "#neden-kubernetes-e-ihtiyaciniz-var-ve-neler-yapabilir"
    title: Neden Kubernetes?
no_list: true
---

<!-- overview -->
Bu sayfa Kubernetes'e genel bir bakış sunar.


<!-- body -->

Kubernetes adı Yunanca kökenli olup dümenci veya kılavuz anlamına gelir. K8s kısaltması, "K" ile "s" harfleri arasındaki sekiz harfin sayılmasıyla ortaya çıkmıştır. Google, Kubernetes projesini 2014 yılında açık kaynak olarak yayınlamıştır. Kubernetes, Google'ın büyük ölçekli üretim iş yüklerini çalıştırma konusundaki [15 yılı aşkın deneyimini](/blog/2015/04/borg-predecessor-to-kubernetes/), topluluğun en iyi fikirleri ve uygulamalarıyla birleştirir.

## Neden Kubernetes'e ihtiyacınız var ve neler yapabilir {#neden-kubernetes-e-ihtiyaciniz-var-ve-neler-yapabilir}

Konteynerler, uygulamalarınızı paketlemek ve çalıştırmak için iyi bir yoldur. Bir üretim ortamında, uygulamaları çalıştıran konteynerleri yönetmeniz ve kesinti olmamasını sağlamanız gerekir. Örneğin bir konteyner çökerse, başka bir konteynerin başlatılması gerekir. Bu davranışın bir sistem tarafından yönetilmesi daha kolay olmaz mıydı?

İşte Kubernetes bu noktada yardıma yetişir! Kubernetes, dağıtık sistemleri dayanıklı bir şekilde çalıştırmanız için size bir çerçeve sunar. Uygulamanız için ölçekleme ve yük devretme işlemlerini üstlenir, dağıtım modelleri sağlar ve daha fazlasını yapar. Örneğin: Kubernetes sisteminiz için bir kanarya (canary) dağıtımını kolayca yönetebilir.

Kubernetes size şunları sağlar:

* **Hizmet keşfi ve yük dengeleme**
  Kubernetes bir konteyneri bir DNS adı veya kendi IP adresi ile dışarıya sunabilir. Bir konteynere gelen trafik yüksekse, Kubernetes dağıtımın kararlı olması için yük dengelemesi yapabilir ve ağ trafiğini dağıtabilir.
* **Depolama orkestrasyonu**
  Kubernetes; yerel depolama, genel bulut sağlayıcıları ve daha fazlası gibi seçtiğiniz bir depolama sistemini otomatik olarak bağlamanıza olanak tanır.
* **Otomatik dağıtımlar ve geri almalar**
  Kubernetes kullanarak dağıtılan konteynerleriniz için istenen durumu tanımlayabilirsiniz ve gerçek durumu kontrollü bir hızda istenen duruma getirebilir. Örneğin, dağıtımınız için yeni konteynerler oluşturmak, mevcut konteynerleri kaldırmak ve tüm kaynaklarını yeni konteynere uyarlamak üzere Kubernetes'i otomatikleştirebilirsiniz.
* **Otomatik paketleme (bin packing)**
  Kubernetes'e konteynerleştirilmiş görevleri çalıştırmak için kullanabileceği bir düğüm (node) kümesi sağlarsınız. Her konteynerin ne kadar CPU ve belleğe (RAM) ihtiyacı olduğunu Kubernetes'e bildirirsiniz. Kubernetes, kaynaklarınızdan en iyi şekilde yararlanmak için konteynerleri düğümlerinize yerleştirebilir.
* **Kendi kendini iyileştirme (self-healing)**
  Kubernetes; başarısız olan konteynerleri yeniden başlatır, konteynerleri değiştirir, kullanıcı tanımlı sağlık denetiminize yanıt vermeyen konteynerleri sonlandırır ve hizmet vermeye hazır olana kadar bunları istemcilere bildirmez.
* **Gizli bilgi ve yapılandırma yönetimi**
  Kubernetes; parolalar, OAuth belirteçleri ve SSH anahtarları gibi hassas bilgileri depolamanıza ve yönetmenize olanak tanır. Konteyner imajlarınızı yeniden oluşturmadan ve yığın yapılandırmanızda sırları açığa çıkarmadan gizli bilgileri ve uygulama yapılandırmasını dağıtabilir ve güncelleyebilirsiniz.
* **Toplu iş yürütme (batch execution)**
  Hizmetlere ek olarak Kubernetes, istenirse başarısız olan konteynerleri değiştirerek toplu iş ve CI iş yüklerinizi de yönetebilir.
* **Yatay ölçekleme (horizontal scaling)**
  Uygulamanızı basit bir komutla, bir kullanıcı arayüzüyle veya CPU kullanımına bağlı olarak otomatik şekilde büyütüp küçültebilirsiniz.
* **IPv4/IPv6 çift yığın (dual-stack)**
  Pod'lara ve Hizmetlere (Services) IPv4 ve IPv6 adreslerinin atanması.
* **Genişletilebilirlik için tasarlandı**
  Yukarı akış (upstream) kaynak kodunu değiştirmeden Kubernetes kümenize yeni özellikler ekleyin.

## Kubernetes ne değildir

Kubernetes geleneksel, her şeyi kapsayan bir PaaS (Hizmet Olarak Platform) sistemi değildir. Kubernetes donanım düzeyinden ziyade konteyner düzeyinde çalıştığı için, PaaS tekliflerinde yaygın olan dağıtım, ölçekleme, yük dengeleme gibi genel uygulanabilir bazı özellikler sunar ve kullanıcıların günlük kaydı (logging), izleme (monitoring) ve uyarı çözümlerini entegre etmelerine olanak tanır. Ancak Kubernetes monolitik değildir ve bu varsayılan çözümler isteğe bağlı ve takıp çıkarılabilirdir. Kubernetes, geliştirici platformları oluşturmak için yapı taşları sağlar ancak önemli olan yerlerde kullanıcı tercihini ve esnekliğini korur.

Kubernetes:

* Desteklenen uygulama türlerini kısıtlamaz. Kubernetes; durumsuz (stateless), durum bilgisi içeren (stateful) ve veri işleme iş yükleri de dahil olmak üzere son derece çeşitli iş yüklerini desteklemeyi hedefler. Bir uygulama bir konteyner içinde çalışabiliyorsa, Kubernetes üzerinde de harika çalışacaktır.
* Kaynak kodunu derlemez ve uygulama imajları oluşturmaz. Sürekli Entegrasyon, Dağıtım ve Yayınlama (CI/CD) iş akışları organizasyonel kültür ve tercihlerle birlikte teknik gereksinimlerle belirlenir.
* Uygulama düzeyinde hizmetler sağlamaz; örneğin ara katman yazılımları (mesaj kuyrukları gibi), veri işleme çerçeveleri (Spark gibi), veritabanları (MySQL gibi), önbellekler veya küme depolama sistemleri (Ceph gibi) yerleşik özellikler olarak gelmez. Bu tür bileşenler Kubernetes üzerinde çalışabilir veya Kubernetes üzerinde çalışan uygulamalar tarafından Open Service Broker gibi taşınabilir mekanizmalar aracılığıyla erişilebilir.
* Günlük kaydı, izleme veya uyarı çözümleri dayatmaz. Kavram kanıtı olarak bazı entegrasyonlar sağlar ve metrikleri toplamak ve dışa aktarmak için mekanizmalar sunar.
* Bir yapılandırma dili/sistemi (örneğin Jsonnet) sağlamaz veya zorunlu kılmaz. Bildirimsel belirtimlerin rastgele biçimleriyle hedeflenebilecek bildirimsel bir API sağlar.
* Kapsamlı makine yapılandırması, bakım, yönetim veya kendi kendini iyileştirme sistemleri sağlamaz ve benimsemez.
* Ayrıca Kubernetes yalnızca bir orkestrasyon sistemi değildir. Aslında orkestrasyon ihtiyacını ortadan kaldırır. Orkestrasyonun teknik tanımı, tanımlanmış bir iş akışının yürütülmesidir: önce A'yı yap, sonra B'yi, ardından C'yi. Buna karşılık Kubernetes, geçerli durumu sürekli olarak sağlanan istenen duruma doğru yönlendiren bağımsız, birleştirilebilir kontrol süreçlerinden oluşur. A'dan C'ye nasıl ulaştığınız önemli değildir. Merkezi kontrol de gerekli değildir. Bu da kullanımı daha kolay, daha güçlü, sağlam, dayanıklı ve genişletilebilir bir sistem ortaya çıkarır.

## Kubernetes için tarihsel bağlam {#tarihe-geri-donus}

Zaman içinde geriye giderek Kubernetes'in neden bu kadar yararlı olduğuna bir göz atalım.

![Dağıtım evrimi](/images/docs/Container_Evolution.svg)

**Geleneksel dağıtım dönemi:**

Başlangıçta kuruluşlar uygulamaları fiziksel sunucularda çalıştırıyordu. Fiziksel bir sunucudaki uygulamalar için kaynak sınırları tanımlamanın bir yolu yoktu ve bu da kaynak tahsis sorunlarına yol açıyordu. Örneğin, fiziksel bir sunucuda birden çok uygulama çalışıyorsa, bir uygulamanın kaynakların çoğunu kapladığı ve sonuç olarak diğer uygulamaların düşük performans gösterdiği durumlar olabiliyordu. Bunun çözümü, her uygulamayı farklı bir fiziksel sunucuda çalıştırmak olabilirdi. Ancak bu, kaynakların verimsiz kullanılmasına yol açıyordu ve kuruluşların çok sayıda fiziksel sunucunun bakımını yapması maliyetliydi.

**Sanallaştırılmış dağıtım dönemi:**

Bir çözüm olarak sanallaştırma tanıtıldı. Tek bir fiziksel sunucunun CPU'su üzerinde birden çok Sanal Makine (VM) çalıştırmanıza olanak tanır. Sanallaştırma, uygulamaların sanal makineler arasında izole edilmesini sağlar ve bir uygulamanın bilgilerine başka bir uygulama tarafından serbestçe erişilemeyeceği için bir güvenlik düzeyi sunar.

Sanallaştırma, fiziksel bir sunucudaki kaynakların daha iyi kullanılmasını sağlar ve bir uygulamanın kolayca eklenmesine veya güncellenmesine olanak tanıyarak daha iyi ölçeklenebilirlik sağlar, donanım maliyetlerini azaltır ve çok daha fazlasını sunar. Sanallaştırma ile bir dizi fiziksel kaynağı, tek kullanımlık sanal makinelerden oluşan bir küme olarak sunabilirsiniz.

Her sanal makine; sanallaştırılmış donanımın üzerinde kendi işletim sistemi de dahil olmak üzere tüm bileşenleri çalıştıran tam bir makinedir.

**Konteyner dağıtım dönemi:**

Konteynerler sanal makinelere benzer, ancak uygulamalar arasında İşletim Sistemini (OS) paylaşmak için esnetilmiş izolasyon özelliklerine sahiptirler. Bu nedenle konteynerler hafif (lightweight) kabul edilir. Bir sanal makineye benzer şekilde, bir konteynerin kendi dosya sistemi, CPU payı, belleği, işlem alanı ve daha fazlası vardır. Alttaki altyapıdan ayrıldıkları için bulutlar ve işletim sistemi dağıtımları arasında taşınabilirdirler.

Konteynerler popüler hale gelmiştir çünkü şu ek faydaları sağlarlar:

* Çevik uygulama oluşturma ve dağıtımı: VM imajı kullanımına kıyasla konteyner imajı oluşturma kolaylığı ve verimliliği.
* Sürekli geliştirme, entegrasyon ve dağıtım: Hızlı ve verimli geri almalarla (imajın değiştirilemezliği sayesinde) güvenilir ve sık konteyner imajı derlemesi ve dağıtımı sağlar.
* Dev ve Ops sorumluluklarının ayrılması: Uygulama konteyner imajlarını dağıtım zamanı yerine derleme/yayınlama zamanında oluşturarak uygulamaları altyapıdan ayırır.
* Gözlemlenebilirlik: Yalnızca işletim sistemi düzeyindeki bilgileri ve metrikleri değil, aynı zamanda uygulama sağlığını ve diğer sinyalleri de yüzeye çıkarır.
* Geliştirme, test ve üretim ortamları arasında tutarlılık: Bulutta çalıştığı gibi bir dizüstü bilgisayarda da aynı şekilde çalışır.
* Bulut ve işletim sistemi dağıtımı taşınabilirliği: Ubuntu, RHEL, CoreOS, şirket içi (on-premises), büyük genel bulutlarda ve diğer her yerde çalışır.
* Uygulama merkezli yönetim: Soyutlama düzeyini, sanal donanım üzerinde bir işletim sistemi çalıştırmaktan mantıksal kaynakları kullanarak bir işletim sistemi üzerinde bir uygulama çalıştırmaya yükseltir.
* Gevşek bağlı, dağıtık, esnek, özgür mikro hizmetler: Uygulamalar daha küçük, bağımsız parçalara ayrılır ve dinamik olarak dağıtılabilir ve yönetilebilir; tek bir büyük amaca özel makinede çalışan monolitik bir yığın değildir.
* Kaynak izolasyonu: Öngörülebilir uygulama performansı.
* Kaynak kullanımı: Yüksek verimlilik ve yoğunluk.


## {{% heading "whatsnext" %}}

* [Kubernetes Bileşenleri](/tr/docs/concepts/overview/components/) bölümüne göz atın
* [Kubernetes API](/tr/docs/concepts/overview/kubernetes-api/) bölümüne göz atın
* Kubernetes için birincil CLI olan [kubectl](/tr/docs/concepts/overview/kubectl/) aracına göz atın
* [Küme Mimarisi](/tr/docs/concepts/architecture/) bölümüne göz atın
* [Başlamaya](/tr/docs/setup/) hazır mısınız?
