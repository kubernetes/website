---
linktitle: Relizlar tarixi
title: Relizlar
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

Kubernetes loyihasi eng soʻnggi uchta kichik reliz
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}) uchun reliz tarmoqlarini saqlaydi.
Kubernetes 1.19 va undan yangi versiyalar
[taxminan 1 yil patch qoʻllab-quvvatlash](/releases/patch-releases/#support-period) oladi.
Kubernetes 1.18 va undan eski versiyalar taxminan 9 oy patch qoʻllab-quvvatlash olgan.

Kubernetes versiyalari **x.y.z** koʻrinishida ifodalanadi:
bu yerda **x** — katta versiya, **y** — kichik versiya, **z** esa patch versiya.
Bu [semantik versiyalash](https://semver.org/) terminologiyasiga mos keladi.

Batafsil maʼlumot [versiya farqi siyosati](/releases/version-skew-policy/) hujjatida.

<!-- body -->

## Relizlar tarixi {#release-history}

{{< release-data >}}

## Xizmat muddati tugagan relizlar {#end-of-life-releases}

Endi texnik xizmat koʻrsatilmaydigan eski Kubernetes relizlari quyida keltirilgan.

<details>
  <summary>Xizmat muddati tugagan relizlar</summary>
  {{< note >}}
  Bu relizlar endi qoʻllab-quvvatlanmaydi hamda xavfsizlik yangilanishlari yoki xato tuzatishlarini olmaydi.
  Agar ushbu relizlardan birida ishlayotgan boʻlsangiz, Kubernetes loyihasi [qoʻllab-quvvatlanadigan versiya](#release-history)ga yangilashni qatʼiy tavsiya qiladi.
  {{< /note >}}
  
  {{< eol-releases >}}
</details>

## Kutilayotgan reliz {#upcoming-release}

Kutilayotgan **{{< skew nextMinorVersion >}}** Kubernetes relizi
[jadvali](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}}) bilan tanishing!

{{< note >}}
Bu jadval havolasi relizni rejalashtirishning dastlabki bosqichlarida vaqtincha mavjud boʻlmasligi mumkin.
Soʻnggi yangilanishlar uchun [SIG Release repozitoriyasi](https://github.com/kubernetes/sig-release/tree/master/releases)ni tekshiring.
{{< /note >}}

## Foydali manbalar {#helpful-resources}

Rollar va reliz jarayoni haqidagi asosiy maʼlumotlar uchun
[Kubernetes reliz jamoasi](https://github.com/kubernetes/sig-release/tree/master/release-team) manbalariga murojaat qiling.
