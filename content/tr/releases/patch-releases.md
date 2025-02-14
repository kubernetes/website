---
title: Yama Sürümleri
type: docs
---

Kubernetes yama sürümleri için program ve ekip iletişim bilgileri.

Kubernetes sürüm döngüsü hakkında genel bilgi için, [sürüm süreci açıklamasına] bakın.

## Kadans

Tipik yama sürüm kadansımız aylıktır. 1.X küçük sürümünden sonraki en erken yama sürümleri için genellikle biraz daha hızlıdır (1 ila 2 hafta). Kritik hata düzeltmeleri, normal kadansın dışında daha acil bir sürüme neden olabilir. Ayrıca büyük tatil dönemlerinde sürüm yapmamaya çalışıyoruz.

## İletişim

Yama Sürüm Ekibi ile ilgili tam iletişim bilgileri için [Sürüm Yöneticileri sayfasına][release-managers] bakın.

Yanıt vermemiz için bize bir iş günü verin - farklı bir zaman diliminde olabiliriz!

Sürümler arasında ekip, gelen cherry pick isteklerine haftalık olarak bakıyor. Ekip, GitHub PR, Slack'teki SIG kanalları ve Slack'teki doğrudan mesajlar ve [email](mailto:release-managers-private@kubernetes.io) aracılığıyla PR ile ilgili sorular varsa göndericilerle iletişime geçecektir.

## Cherry pickler

Lütfen [cherry pick sürecini][cherry-picks] takip edin.

Cherry pickler, hedef sürümden iki gün önce, ancak daha fazla olabilir, uygun etiketlerle (örneğin, `approved`, `lgtm`, `release-note`) ve CI testlerini geçerek GitHub'da birleştirmeye hazır olmalıdır. PR'ın erken hazır olması daha iyidir, çünkü cherry picklerinizi gerçek sürümden önce birleştirdikten sonra CI sinyali almamız gerekiyor.

Birleştirme kriterlerini kaçıran cherry pick PR'ları bir sonraki yama sürümü için taşınacak ve takip edilecektir.

## Destek Süresi

[Yıllık destek KEP][yearly-support] uyarınca, Kubernetes Topluluğu aktif yama sürüm serilerini yaklaşık on dört (14) ay boyunca destekleyecektir.

Bu zaman diliminin ilk on iki ayı standart dönem olarak kabul edilecektir.

On iki ayın sonuna doğru aşağıdakiler gerçekleşecektir:

- [Sürüm Yöneticileri][release-managers] bir sürüm kesecek
- Yama sürüm serisi bakım moduna girecek

İki aylık bakım modu döneminde, Sürüm Yöneticileri aşağıdakileri çözmek için ek bakım sürümleri kesebilir:

- Bir CVE kimliği atanmış [Güvenlik Açıkları](/docs/reference/issues-security/official-cve-feed/) (Güvenlik Yanıt Komitesi'nin tavsiyesi altında)
- bağımlılık sorunları (temel görüntü güncellemeleri dahil)
- kritik çekirdek bileşen sorunları

İki aylık bakım modu döneminin sonunda, yama sürüm serisi EOL (kullanım ömrünün sonu) olarak kabul edilecek ve ilgili dal için cherry pickler kısa süre sonra kapatılacaktır.

Bakım modu ve EOL hedef tarihleri için basitlik adına ayın 28'i seçilmiştir (her ayda vardır).

## Yaklaşan Aylık Sürümler

Hata düzeltmelerinin ciddiyetine göre zaman çizelgeleri değişebilir, ancak daha kolay planlama için aşağıdaki aylık sürüm noktalarını hedefleyeceğiz. Planlanmamış, kritik sürümler de bu süreler arasında gerçekleşebilir.

{{< upcoming-releases >}}

## Aktif Dallar için Ayrıntılı Sürüm Geçmişi

{{< release-branches >}}

## Aktif Olmayan Dal Geçmişi

Bu sürümler artık desteklenmemektedir.

{{< eol-releases >}}

[cherry-picks]: https://github.com/kubernetes/community/blob/master/contributors/devel/sig-release/cherry-picks.md
[release-managers]: /releases/release-managers
[sürüm süreci açıklaması]: /releases/release
[yıllık destek]: https://git.k8s.io/enhancements/keps/sig-release/1498-kubernetes-yearly-support-period/README.md
