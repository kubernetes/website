---
linktitle: Sürüm Geçmişi
title: Sürümler
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

Kubernetes projesi, en son üç minör sürüm için sürüm dalları sürdürür
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 ve sonrası
[yaklaşık 1 yıllık yama desteği](/releases/patch-releases/#support-period) alır.
Kubernetes 1.18 ve öncesi yaklaşık 9 aylık yama desteği aldı.

Kubernetes sürümleri **x.y.z** olarak ifade edilir; burada
**x** majör sürüm, **y** minör sürüm ve **z** yama sürümüdür ve
[Semantik Sürümleme](https://semver.org/) terminolojisini takip eder.

Daha fazla bilgi için [sürüm sapması politikası](/releases/version-skew-policy/) belgesine bakın.

<!-- body -->

## Sürüm Geçmişi

{{< release-data >}}

## Yaşam Sonu Sürümleri

Artık bakımı yapılmayan eski Kubernetes sürümleri aşağıda listelenmiştir.

<details>
  <summary>Yaşam sonu sürümleri</summary>
  {{< note >}}
  Bu sürümler artık desteklenmemektedir ve güvenlik güncellemeleri veya hata düzeltmeleri almamaktadır.
  Bu sürümlerden birini çalıştırıyorsanız, Kubernetes projesi [desteklenen bir sürüme](#release-history) yükseltmenizi şiddetle önerir.
  {{< /note >}}

  {{< eol-releases >}}
</details>

## Yaklaşan Sürüm

Yaklaşan **{{< skew nextMinorVersion >}}** Kubernetes sürümü için
[takvime](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
göz atın!

{{< note >}}
Bu takvim bağlantısı, erken sürüm planlama aşamalarında geçici olarak kullanılamayabilir.
En son güncellemeler için [SIG Release deposunu](https://github.com/kubernetes/sig-release/tree/master/releases) kontrol edin.
{{< /note >}}

## Yararlı Kaynaklar

Roller ve sürüm süreci hakkında önemli bilgiler için
[Kubernetes Sürüm Takımı](https://github.com/kubernetes/sig-release/tree/master/release-team) kaynaklarına başvurun.
