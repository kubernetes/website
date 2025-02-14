---
layout: blog
title: "Betadan İleriye Gitmek"
date: 2020-08-21
slug: betadan-ileriye-gitmek

# yerelleştiricilere not: bunu dahil etmek, makaleyi güncel tuttuğunuzu gösterir. Bu sorun değil, ancak bir güncelleme olursa, yerelleştirilmiş sürümü de güncellemeyi taahhüt ediyorsunuz demektir.
# Emin değilseniz: bu sonraki alanı atlayın.
evergreen: true
author: >
   Tim Bannister (The Scale Factory)
---

Kubernetes'te, özellikler belirli bir
[yaşam döngüsünü](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages) takip eder.
İlk olarak, ilgili bir geliştiricinin gözünde bir parıltı olarak başlar. Belki de, çevrimiçi tartışmalarda taslak olarak çizilir, bir kafe peçetesinin çevrimiçi eşdeğerine çizilir. Bu kaba çalışma tipik olarak bir
[Kubernetes Geliştirme Teklifi](https://github.com/kubernetes/enhancements/blob/master/keps/sig-architecture/0000-kep-process/README.md#kubernetes-enhancement-proposal-process) (KEP) haline gelir ve
oradan genellikle koda dönüşür.

Kubernetes v1.20 ve sonrasında, bu kodun kararlı özelliklere geçişine yardımcı olmaya odaklanıyoruz.

Bahsettiğim yaşam döngüsü şu şekilde işler:

![Alfa → Beta → Genel Kullanılabilirlik](feature_stages.svg)

Genellikle, alfa özellikleri varsayılan olarak etkinleştirilmez. Bunları bir özellik kapısı ayarlayarak etkinleştirirsiniz; genellikle, özelliği kullanan bileşenlerin her birinde bir komut satırı bayrağı ayarlayarak.

(Kubernetes'i AKS, EKS, GKE gibi yönetilen bir hizmet teklifi aracılığıyla kullanıyorsanız, bu hizmeti yürüten satıcı sizin için hangi özellik kapılarının etkinleştirileceğine karar vermiş olabilir).

Mevcut bir alfa özelliğinin beta aşamasına geçişi için tanımlanmış bir süreç vardır.
Bu önemlidir çünkü **beta özellikleri varsayılan olarak etkinleştirilir**, ancak özellik bayrağı hala oradadır, böylece küme operatörleri isterlerse devre dışı bırakabilirler.

Genel kullanılabilirliğe (GA) geçişi yöneten benzer ancak daha kapsamlı bir dizi mezuniyet kriteri vardır, bu da "kararlı" olarak bilinir. GA özellikleri Kubernetes'in bir parçasıdır ve mevcut ana sürüm boyunca yerinde kalacaklarına dair bir taahhüt vardır.

Beta özelliklerinin varsayılan olarak etkinleştirilmesi, Kubernetes ve katkıda bulunanlarının değerli gerçek dünya geri bildirimleri almasını sağlar. Ancak, teşviklerde bir uyumsuzluk vardır. Bir özellik varsayılan olarak etkinleştirildiğinde, insanlar onu kullanacaktır. Birkaç ayrıntının düzeltilmesi gerekse bile, Kubernetes'in REST API'leri ve gelenekleri çalışma şekli, gelecekteki herhangi bir kararlı API'nin en son beta API'si ile uyumlu olacağı anlamına gelir: bir beta özelliği GA'ya geçtiğinde API nesneleriniz çalışmayı durdurmaz.

Özellikle API ve kaynakları için, özellikleri betadan GA'ya taşımak için alfa'dan beta'ya taşımaktan daha az güçlü bir teşvik vardır. Belirli bir özelliği isteyen satıcılar, özelliklerin varsayılan olarak etkinleştirildiği noktaya kadar kodun alınmasına yardımcı olmak için iyi bir nedene sahipti ve bundan öte yolculuk daha az netti.

KEP'ler kod iyileştirmelerinden daha fazlasını izler. Temelde, daha geniş topluluğa iletilmesi gereken herhangi bir şey bir KEP'i hak eder. Bununla birlikte, çoğu KEP Kubernetes özelliklerini (ve bunları uygulamak için kodu) kapsar.

[Ingress](/docs/concepts/services-networking/ingress/)
bir süredir Kubernetes'te olduğunu biliyor olabilirsiniz, ancak aslında 2015'te beta sürümüne geçtiğini fark ettiniz mi? İlerlemeyi sağlamak için, Kubernetes'in Mimari Özel İlgi Grubu (SIG) yeni bir yaklaşım düşünüyor.

## Kalıcı betadan kaçınmak

Kubernetes REST API'leri için, yeni bir özelliğin API'si beta sürümüne ulaştığında, bu bir geri sayımı başlatır.
Beta kalitesindeki API'nin artık **üç sürümü** (yaklaşık dokuz takvim ayı) vardır:
- GA'ya ulaşmak ve betayı kullanımdan kaldırmak, veya
- yeni bir beta sürümüne sahip olmak (_ve önceki betayı kullanımdan kaldırmak_).

Açık olmak gerekirse, şu anda **yalnızca REST API'leri etkilenmektedir**. Örneğin, _APIListChunking_ bir beta özelliğidir ancak kendisi bir REST API değildir. Şu anda _APIListChunking_ veya REST API'leri olmayan diğer özellikleri otomatik olarak kullanımdan kaldırma planı yoktur.

Bir beta API'si üç Kubernetes sürümünden sonra GA'ya geçmemişse, bir sonraki Kubernetes sürümü o API sürümünü kullanımdan kaldıracaktır. REST API'sinin, sürüm penceresinden sonraki ilk Kubernetes sürümünün ötesinde aynı beta sürümünde kalma seçeneği yoktur.

### Bu sizin için ne anlama geliyor

Kubernetes kullanıyorsanız, büyük olasılıkla bir beta özelliği kullanıyorsunuzdur. Dediğim gibi, bunlardan çok var.
Ingress'in yanı sıra, [CronJob](/docs/concepts/workloads/controllers/cron-jobs/),
veya [PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/) gibi diğerlerini kullanıyor olabilirsiniz.
En az bir beta özelliği etkinleştirilmiş bir kontrol düzleminde çalıştırma olasılığınız daha da yüksektir.

Beta API'leri kullanan veya üreten Kubernetes manifestoları kullanıyorsanız, bunları gözden geçirmeyi planlamanız gerekecektir. Mevcut API'ler belirli bir programa göre kullanımdan kaldırılacak (daha önce bahsettiğim 9 ay) ve bu kullanımdan kaldırılan API'ler 9 ay sonra kaldırılacaktır. O noktada, Kubernetes ile güncel kalmak için zaten geçiş yapmış olmalısınız.

### Bu Kubernetes katkıda bulunanlar için ne anlama geliyor

Buradaki motivasyon oldukça açık görünüyor: özellikleri kararlı hale getirin. Beta özelliklerinin kullanımdan kaldırılacağını garanti etmek, bu özelliğin kararlı hale gelmesi için kod, belge ve testlerin hazır olana kadar çabalarını sürdüren insanlar için oldukça büyük bir teşvik ekler, gerçek dünya kullanımında birkaç Kubernetes sürümü tarafından desteklenir.

### Bu ekosistem için ne anlama geliyor

Bana göre, bu sert görünen önlemler çok mantıklı ve Kubernetes için iyi olacak. Mevcut API'lerin kullanımdan kaldırılması, farklı Özel İlgi Grupları (SIG'ler) arasında geçerli olan bir kural aracılığıyla durgunluktan kaçınmaya ve düzeltmeleri teşvik etmeye yardımcı olur.

Diyelim ki bir API beta sürümüne geçiyor ve ardından gerçek dünya deneyimi bunun doğru olmadığını gösteriyor - temelde, API'nin eksiklikleri var. Bu 9 aylık geri sayım devam ederken, ilgili kişiler sorunlu durumlarla başa çıkan bir API'yi gözden geçirme ve yayınlama araçlarına ve gerekçesine sahiptir. Kullanımdan kaldırılan API ile yaşamak isteyen herkes hoş karşılanır - Kubernetes açık kaynak - ancak ihtiyaçları özelliğin ilerlemesini engellemek zorunda değildir.
