---
title: Sürüm Yöneticileri
type: docs
---

"Sürüm Yöneticileri", Kubernetes sürüm dallarını korumaktan ve SIG Release tarafından sağlanan araçları kullanarak sürümler oluşturmaktan sorumlu Kubernetes katkıcılarını kapsayan bir şemsiye terimdir.

Her rolün sorumlulukları aşağıda açıklanmıştır.

- [İletişim](#iletişim)
  - [Güvenlik Ambargosu Politikası](#güvenlik-ambargosu-politikası)
- [El Kitapları](#el-kitapları)
- [Sürüm Yöneticileri](#sürüm-yöneticileri)
  - [Sürüm Yöneticisi Olmak](#sürüm-yöneticisi-olmak)
- [Sürüm Yöneticisi Yardımcıları](#sürüm-yöneticisi-yardımcıları)
  - [Sürüm Yöneticisi Yardımcısı Olmak](#sürüm-yöneticisi-yardımcısı-olmak)
- [SIG Release Liderleri](#sig-release-liderleri)
  - [Başkanlar](#başkanlar)
  - [Teknik Liderler](#teknik-liderler)

## İletişim

| Posta Listesi | Slack | Görünürlük | Kullanım | Üyelik |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (kanal) / @release-managers (kullanıcı grubu) | Herkese açık | Sürüm Yöneticileri için herkese açık tartışma | Tüm Sürüm Yöneticileri (Yardımcılar ve SIG Başkanları dahil) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | N/A | Özel | Ayrıcalıklı Sürüm Yöneticileri için özel tartışma | Sürüm Yöneticileri, SIG Release liderliği |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (kanal) / @security-rel-team (kullanıcı grubu) | Özel | Güvenlik Yanıt Komitesi ile güvenlik sürümü koordinasyonu | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### Güvenlik Ambargosu Politikası

Bazı sürüm bilgileri ambargo altındadır ve bu ambargoların nasıl belirlendiğine dair tanımlanmış bir politikamız vardır. Daha fazla bilgi için lütfen [Güvenlik Ambargosu Politikası](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy) sayfasına bakın.

## El Kitapları

**NOT: Yama Sürüm Ekibi ve Dal Yöneticisi el kitapları daha sonra yinelenmeyecek şekilde düzenlenecektir.**

- [Yama Sürüm Ekibi][handbook-patch-release]
- [Dal Yöneticileri][handbook-branch-mgmt]

## Sürüm Yöneticileri

**Not:** Belgeler Yama Sürüm Ekibi ve Dal Yönetimi rolüne atıfta bulunabilir. Bu iki rol, Sürüm Yöneticileri rolünde birleştirilmiştir.

Sürüm Yöneticileri ve Sürüm Yöneticisi Yardımcıları için asgari gereksinimler şunlardır:

- Temel Unix komutlarına aşinalık ve kabuk betiklerini hata ayıklayabilme.
- `git` ve ilgili `git` komut satırı çağrıları aracılığıyla dallanmış kaynak kodu iş akışlarına aşinalık.
- Google Cloud (Cloud Build ve Cloud Storage) hakkında genel bilgi.
- Yardım istemeye ve açıkça iletişim kurmaya açık olmak.
- Kubernetes Topluluğu [üyeliği][community-membership]

Sürüm Yöneticileri şunlardan sorumludur:

- Kubernetes sürümlerini koordine etmek ve kesmek:
  - Yama sürümleri (`x.y.z`, burada `z` > 0)
  - Küçük sürümler (`x.y.z`, burada `z` = 0)
  - Ön sürümler (alpha, beta ve sürüm adayları)
  - Her sürüm döngüsü boyunca [Sürüm Ekibi][release-team] ile çalışmak
  - [Yama sürümleri için program ve ritmi belirlemek][patches]
- Sürüm dallarını korumak:
  - Kiraz seçmelerini gözden geçirmek
  - Sürüm dalının sağlıklı kalmasını ve istenmeyen yamaların birleştirilmemesini sağlamak
- [Sürüm Yöneticisi Yardımcıları](#release-manager-associates) grubuna mentorluk yapmak
- k/release'de özellikler geliştirmek ve kodu korumak
- Buddy programına aktif olarak katılarak Sürüm Yöneticisi Yardımcılarını ve katkıcıları desteklemek
  - Yardımcılarla aylık olarak görüşmek ve görevleri devretmek, sürümleri kesmeleri için onları güçlendirmek ve mentorluk yapmak
  - Yeni katkıcıları işe alırken yardımcı olmak için mevcut olmak, örneğin soruları yanıtlamak ve yapacakları uygun işleri önermek

Bu ekip zaman zaman [Güvenlik Yanıt Komitesi][src] ile yakın işbirliği içinde çalışır ve bu nedenle [Güvenlik Sürüm Süreci][security-release-process] tarafından belirlenen yönergelere uymalıdır.

GitHub Erişim Kontrolleri: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub Bahsetmeleri: [@kubernetes/release-engineering](https://github.com/orgs/kubernetes/teams/release-engineering)

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### Sürüm Yöneticisi Olmak

Sürüm Yöneticisi olmak için önce Sürüm Yöneticisi Yardımcısı olarak görev yapmak gerekir. Yardımcılar, birkaç döngü boyunca aktif olarak sürümler üzerinde çalışarak ve:

- liderlik etme isteğini göstererek
- yamalar üzerinde Sürüm Yöneticileri ile birlikte çalışarak, sonunda bağımsız olarak bir sürüm keserek
  - sürümlerin sınırlayıcı bir işlevi olduğu için, görüntü tanıtımı ve diğer temel Sürüm Mühendisliği görevlerine yapılan önemli katkıları da dikkate alıyoruz
- Yardımcıların nasıl çalıştığını sorgulamak, iyileştirmeler önermek, geri bildirim toplamak ve değişimi yönlendirmek
- güvenilir ve duyarlı olmak
- Sürüm Yöneticisi düzeyinde erişim ve ayrıcalık gerektiren ileri düzey çalışmalara yönelmek

## Sürüm Yöneticisi Yardımcıları

Sürüm Yöneticisi Yardımcıları, Sürüm Yöneticilerinin çıraklarıdır, daha önce Sürüm Yöneticisi gölgeleri olarak adlandırılırlardı. Şunlardan sorumludurlar:

- Yama sürüm çalışması, kiraz seçme incelemesi
- k/release'ye katkıda bulunmak: bağımlılıkları güncellemek ve kaynak kod tabanına alışmak
- Belgeleri güncellemek: el kitaplarını korumak, sürüm süreçlerinin belgelenmesini sağlamak
- Bir sürüm yöneticisinin yardımıyla: sürüm döngüsü sırasında Sürüm Ekibi ile çalışmak ve Kubernetes sürümlerini kesmek
- Önceliklendirme ve iletişimde yardımcı olma fırsatlarını aramak
  - Yama sürümleri hakkında ön duyurular ve güncellemeler göndermek
  - Takvimi güncellemek, sürüm tarihleri ve kilometre taşları ile ilgili olarak [sürüm döngüsü zaman çizelgesinden][k-sig-release-releases] yardım almak
- Buddy programı aracılığıyla yeni katkıcıları işe almak ve onlarla görevlerde eşleşmek

GitHub Bahsetmeleri: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski([@salaxander](https://github.com/salaxander))

### Sürüm Yöneticisi Yardımcısı Olmak

Katkıcılar, aşağıdakileri göstererek Yardımcı olabilirler:

- tutarlı katılım, 6-12 aylık aktif sürüm mühendisliği ile ilgili çalışma
- bir sürüm döngüsü sırasında Sürüm Ekibinde teknik lider rolünü yerine getirme deneyimi
  - bu deneyim, SIG Release'in genel olarak nasıl çalıştığını anlamak için sağlam bir temel sağlar—teknik beceriler, iletişim/yanıt verme ve güvenilirlik konusundaki beklentilerimiz dahil
- Testgrid ile etkileşimlerimizi iyileştiren, kütüphaneleri temizleyen vb. k/release öğeleri üzerinde çalışmak
  - bu çabalar, Sürüm Yöneticileri ve Yardımcıları ile etkileşimde bulunmayı ve onlarla eşleşmeyi gerektirir

## SIG Release Liderleri

SIG Release Başkanları ve Teknik Liderler şunlardan sorumludur:

- SIG Release'in yönetimi
- Sürüm Yöneticileri ve Yardımcıları için bilgi paylaşım oturumlarına liderlik etmek
- Liderlik ve önceliklendirme konusunda koçluk yapmak

Burada açıkça belirtilmişlerdir çünkü her rol için çeşitli iletişim kanallarının ve izin gruplarının (GitHub ekipleri, GCP erişimi) sahipleridir. Bu nedenle, yüksek ayrıcalıklı topluluk üyeleridir ve bazen Kubernetes güvenlik açıklamalarıyla ilgili olabilecek bazı özel iletişimlere vakıftırlar.

GitHub ekibi: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### Başkanlar

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

### Teknik Liderler

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

Geçmiş Dal Yöneticileri, kubernetes/sig-release deposunun `release-x.y/release_team.md` içindeki [sürümler dizininde][k-sig-release-releases] bulunabilir.

Örnek: [1.15 Sürüm Ekibi](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md
