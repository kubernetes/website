---
title: Sürüm Yöneticileri
type: docs
---

"Sürüm Yöneticileri", SIG Release tarafından sağlanan araçları kullanarak sürüm dallarını
sürdürmekten ve sürümler oluşturmaktan sorumlu Kubernetes katkıda bulunanları kümesini kapsayan
şemsiye bir terimdir.

Her rolün sorumlulukları aşağıda açıklanmıştır.

- [İletişim](#contact)
  - [Güvenlik Ambargosu Politikası](#security-embargo-policy)
- [El Kitapları](#handbooks)
- [Sürüm Yöneticileri](#release-managers)
  - [Sürüm Yöneticisi Olma](#becoming-a-release-manager)
- [Sürüm Yöneticisi Adayları](#release-manager-associates)
  - [Sürüm Yöneticisi Adayı Olma](#becoming-a-release-manager-associate)
- [SIG Release Liderleri](#sig-release-leads)
  - [Başkanlar](#chairs)
  - [Teknik Liderler](#technical-leads)

## İletişim {#contact}

| Mailing List | Slack | Görünürlük | Kullanım | Üyelik |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (kanal) / @release-managers (kullanıcı grubu) | Genel | Sürüm Yöneticileri için açık tartışma | Tüm Sürüm Yöneticileri (Adaylar ve SIG Başkanları dahil) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | Özel | Ayrıcalıklı Sürüm Yöneticileri için özel tartışma | Sürüm Yöneticileri, SIG Release liderliği |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (kanal) / @security-rel-team (kullanıcı grubu) | Özel | Güvenlik Yanıt Komitesi ile güvenlik sürümü koordinasyonu | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### Güvenlik Ambargosu Politikası {#security-embargo-policy}

Sürümler hakkındaki bazı bilgiler ambargo altındadır ve bu ambargoların nasıl belirlendiğine
ilişkin bir politika tanımlanmıştır. Daha fazla bilgi için lütfen
[Güvenlik Ambargosu Politikası](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)
sayfasına bakın.

## El Kitapları {#handbooks}

**NOT: Yama Sürümü Takımı ve Dal Yöneticisi el kitapları daha sonraki bir tarihte tekrarlardan arındırılacaktır.**

- [Yama Sürümü Takımı][handbook-patch-release]
- [Dal Yöneticileri][handbook-branch-mgmt]

## Sürüm Yöneticileri {#release-managers}

**Not:** Dokümantasyon, Yama Sürümü Takımı ve Dal Yönetimi rolüne atıfta bulunabilir.
Bu iki rol, Sürüm Yöneticileri rolünde birleştirilmiştir.

Sürüm Yöneticileri ve Sürüm Yöneticisi Adayları için minimum gereksinimler şunlardır:

- Temel Unix komutlarına aşinalık ve kabuk betiklerinde hata ayıklayabilme.
- `git` ve ilgili `git` komut satırı çağrıları aracılığıyla dallı kaynak kodu iş akışlarına aşinalık.
- Google Cloud hakkında genel bilgi (Cloud Build ve Cloud Storage).
- Yardım istemeye ve net bir şekilde iletişim kurmaya açıklık.
- Kubernetes Topluluk [üyeliği][community-membership]

Sürüm Yöneticileri şunlardan sorumludur:

- Kubernetes sürümlerinin koordinasyonu ve üretimi:
  - Yama sürümleri (`x.y.z`, burada `z` > 0)
  - Minör sürümler (`x.y.z`, burada `z` = 0)
  - Ön sürümler (alpha, beta ve release candidate'ler)
  - Her sürüm döngüsünde [Sürüm Takımı][release-team] ile çalışma
  - [Yama sürümleri için takvim ve tempo belirleme][patches]
- Sürüm dallarının bakımı:
  - Cherry-pick'lerin incelenmesi
  - Sürüm dalının sağlıklı kalmasını ve istenmeyen yamaların birleştirilmemesini sağlama
- [Sürüm Yöneticisi Adayları](#release-manager-associates) grubuna mentorluk
- k/release deposunda özelliklerin aktif olarak geliştirilmesi ve kodun bakımı
- Buddy programına aktif olarak katılarak Sürüm Yöneticisi Adaylarını ve katkıda bulunanları destekleme
  - Adaylarla aylık olarak görüşüp görevleri devretme, sürümleri üretmeleri için yetkilendirme ve mentorluk yapma
  - Adayların yeni katkıda bulunanları işe almasına destek olma (örneğin, sorularını yanıtlama
    ve onlara uygun işler önerme)

Bu takım zaman zaman [Güvenlik Yanıt Komitesi][src] ile yakın işbirliği içinde çalışır ve bu nedenle
[Güvenlik Sürüm Süreci][security-release-process]'nde belirtilen yönergelere uymalıdır.

GitHub Erişim Kontrolleri: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub Mention'ları: @kubernetes/release-engineering

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### Sürüm Yöneticisi Olma {#becoming-a-release-manager}

Sürüm Yöneticisi olmak için, önce Sürüm Yöneticisi Adayı olarak görev yapmak gerekir. Adaylar,
birden çok döngüde sürümler üzerinde aktif olarak çalışarak ve aşağıdakileri yaparak Sürüm Yöneticisi
statüsüne yükselir:

- liderlik etme istekliliğini gösterme
- sonunda bağımsız olarak bir sürüm üretmek için Sürüm Yöneticileri ile yamalar üzerinde takım halinde çalışma
  - sürümlerin sınırlı bir işlevi olduğu için, imaj tanıtımı ve diğer çekirdek Sürüm Mühendisliği
    görevlerine önemli katkıları da göz önünde bulundururuz
- Adayların nasıl çalıştığını sorgulama, iyileştirmeler önerme, geri bildirim toplama ve
  değişimi yönlendirme
- güvenilir ve yanıt veren biri olma
- Sürüm Yöneticisi düzeyinde erişim ve ayrıcalık gerektiren gelişmiş işlere odaklanma

## Sürüm Yöneticisi Adayları {#release-manager-associates}

Sürüm Yöneticisi Adayları, daha önce Release Manager shadows olarak anılan, Sürüm Yöneticilerine
çıraktır. Şunlardan sorumludurlar:

- Yama sürümü çalışması, cherry-pick incelemesi
- k/release'e katkıda bulunma: bağımlılıkları güncelleme ve kaynak kod tabanına alışma
- Dokümantasyona katkıda bulunma: el kitaplarının bakımı, sürüm süreçlerinin
  dokümante edildiğinden emin olma
- Bir sürüm yöneticisinin yardımıyla: sürüm döngüsü sırasında Sürüm Takımıyla çalışma ve
  Kubernetes sürümlerini üretme
- Önceliklendirme ve iletişimde yardımcı olma fırsatları arama
  - Yama sürümleri hakkında ön duyurular ve güncellemeler gönderme
  - Takvimi güncelleme, [sürüm döngüsü zaman çizelgesindeki][k-sig-release-releases]
    sürüm tarihleri ve dönüm noktaları konusunda yardımcı olma
- Buddy programı aracılığıyla yeni katkıda bulunanları işe alma ve onlarla görevlerde eşleşme

GitHub Mention'ları: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski([@salaxander](https://github.com/salaxander))

### Sürüm Yöneticisi Adayı Olma {#becoming-a-release-manager-associate}

Katkıda bulunanlar aşağıdakileri göstererek Aday olabilirler:

- tutarlı katılım, 6-12 aylık aktif sürüm mühendisliği ile ilgili çalışma dahil
- bir sürüm döngüsü sırasında Sürüm Takımı'nda teknik lider rolünü yerine getirme deneyimi
  - bu deneyim, SIG Release'in genel olarak nasıl çalıştığını anlamak için sağlam bir temel sağlar —
    teknik beceriler, iletişim/yanıt verme ve güvenilirlik konusundaki beklentilerimiz dahil
- Testgrid ile etkileşimlerimizi iyileştiren, kitaplıkları temizleyen vb. k/release öğeleri üzerinde çalışma
  - bu çabalar, Sürüm Yöneticileri ve Adaylarla etkileşim ve eşleşme gerektirir

## SIG Release Liderleri {#sig-release-leads}

SIG Release Başkanları ve Teknik Liderleri şunlardan sorumludur:

- SIG Release'in yönetişimi
- Sürüm Yöneticileri ve Adayları için bilgi paylaşımı oturumlarına liderlik etme
- Liderlik ve önceliklendirme konusunda koçluk yapma

Her rol için çeşitli iletişim kanallarının ve izin gruplarının (GitHub takımları, GCP erişimi) sahibi
oldukları için burada açıkça belirtilirler. Bu nedenle, oldukça ayrıcalıklı topluluk üyeleridir ve
bazen Kubernetes güvenlik açıklamalarıyla ilgili olabilen bazı özel iletişimlere erişimleri vardır.

GitHub takımı: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### Başkanlar {#chairs}

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

### Teknik Liderler {#technical-leads}

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

Geçmiş Dal Yöneticileri, kubernetes/sig-release deposunun [releases dizininde][k-sig-release-releases]
`release-x.y/release_team.md` dosyaları içinde bulunabilir.

Örnek: [1.15 Sürüm Takımı](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md
