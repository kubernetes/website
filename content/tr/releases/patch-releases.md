---
title: Yama Sürümleri
type: docs
---

Kubernetes yama sürümleri için takvim ve takım iletişim bilgileri.

Kubernetes sürüm döngüsü hakkında genel bilgi için
[sürüm süreci açıklamasına] bakın.

## Tempo

Tipik yama sürüm tempomuz aylıktır. 1.X minör sürümünden sonraki ilk yama sürümleri için
genellikle biraz daha hızlıdır (1 ila 2 hafta). Kritik hata düzeltmeleri, normal tempo dışında
daha acil bir sürüme neden olabilir. Ayrıca büyük tatil dönemlerinde sürüm yapmamayı hedefliyoruz.

## İletişim

Yama Sürümü Takımı için tam iletişim bilgileri için [Sürüm Yöneticileri sayfasına][release-managers] bakın.

Lütfen yanıt vermemiz için bize bir iş günü tanıyın — farklı bir saat diliminde olabiliriz!

Sürümler arasında takım, haftalık olarak gelen cherry-pick taleplerine bakar. Takım, PR ile ilgili
sorular varsa GitHub PR, Slack'teki SIG kanalları ve Slack ile [e-posta](mailto:release-managers-private@kubernetes.io)
üzerinden doğrudan mesajlar yoluyla göndericilerle iletişime geçer.

## Cherry-pick'ler

Lütfen [cherry-pick sürecini][cherry-picks] takip edin.

Cherry-pick'ler, cherry-pick son tarihinden önce uygun etiketlerle (örneğin `approved`, `lgtm`,
`release-note`) ve geçen CI testleriyle GitHub'da merge-edilebilir durumda olmalıdır. Bu genellikle
hedef sürümden iki gün önce, ancak daha fazla da olabilir. PR'nin erken hazır olması daha iyidir;
çünkü asıl sürümden önce cherry-pick'lerinizi birleştirdikten sonra CI sinyali almak için zamana ihtiyacımız vardır.

Birleştirme kriterlerini kaçıran cherry-pick PR'ları bir sonraki yama sürümüne taşınır ve takip edilir.

## Destek Süresi

[Yıllık destek KEP][yearly-support]'ine uygun olarak, Kubernetes Topluluğu aktif yama sürüm serilerini
yaklaşık on dört (14) aylık bir süre boyunca destekleyecektir.

Bu zaman çerçevesinin ilk on iki ayı standart süre olarak kabul edilecektir.

On iki ayın sonuna doğru, aşağıdakiler olacaktır:

- [Sürüm Yöneticileri][release-managers] bir sürüm üretecek
- Yama sürüm serisi bakım moduna geçecek

İki aylık bakım modu süresi boyunca, Sürüm Yöneticileri aşağıdakileri çözmek için ek bakım
sürümleri üretebilir:

- Atanmış bir CVE Kimliği olan [zafiyetler](/docs/reference/issues-security/official-cve-feed/)
  (Güvenlik Yanıt Komitesinin tavsiyesi altında)
- bağımlılık sorunları (temel imaj güncellemeleri dahil)
- kritik çekirdek bileşen sorunları

İki aylık bakım modu süresinin sonunda, yama sürüm serisi EOL (yaşam sonu) olarak kabul edilecek
ve ilgili dala olan cherry-pick'ler kısa süre sonra kapatılacaktır.

Ayın 28'inin basitlik açısından bakım modu ve EOL hedef tarihleri için seçildiğini unutmayın
(her ayda vardır).

## Yaklaşan Aylık Sürümler

Zaman çizelgeleri hata düzeltmelerinin ciddiyetine göre değişebilir, ancak daha kolay planlama için
aşağıdaki aylık sürüm noktalarını hedefleyeceğiz. Bunların arasında planlanmamış, kritik sürümler
de meydana gelebilir.

{{< upcoming-releases >}}

## Aktif Dallar için Ayrıntılı Sürüm Geçmişi

{{< release-branches >}}

## Aktif olmayan dal geçmişi

Bu sürümler artık desteklenmemektedir.

{{< eol-releases >}}

[cherry-picks]: https://github.com/kubernetes/community/blob/main/contributors/devel/sig-release/cherry-picks.md
[release-managers]: /releases/release-managers
[sürüm süreci açıklamasına]: /releases/release
[yearly-support]: https://git.k8s.io/enhancements/keps/sig-release/1498-kubernetes-yearly-support-period/README.md
