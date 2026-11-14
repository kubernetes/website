---
title: Patch-relizlar
type: docs
---

Kubernetes patch-relizlari uchun jadval va jamoa aloqa maʼlumotlari.

Kubernetes reliz sikli haqida umumiy maʼlumot uchun
[reliz jarayoni tavsifi][release process description]ga qarang.

## Davriylik {#cadence}

Odatdagi patch-reliz davriyligimiz oylik. 1.X kichik relizidan keyingi eng
dastlabki patch-relizlar uchun u odatda biroz tezroq (1 dan 2 haftagacha)
boʻladi. Jiddiy xato tuzatishlari odatiy davriylikdan tashqari yanada zudlikli
relizga sabab boʻlishi mumkin. Yirik bayram davrlarida ham reliz
chiqarmaslikka intilamiz.

## Aloqa {#contact}

Patch-reliz jamoasining toʻliq aloqa maʼlumotlari uchun [reliz menejerlari sahifasi][release-managers]ga qarang.

Javob berishimiz uchun bir ish kuni bering — biz boshqa vaqt mintaqasida boʻlishimiz mumkin!

Relizlar oraligʻida jamoa kelib tushayotgan cherry-pick soʻrovlarini haftalik
tartibda koʻrib chiqadi. PRda savollar boʻlsa, jamoa yuboruvchilar bilan GitHub
PR, Slack dagi SIG kanallari hamda Slack dagi toʻgʻridan-toʻgʻri xabarlar va
[elektron pochta](mailto:release-managers-private@kubernetes.io)
orqali bogʻlanadi.

## Cherry-picklar {#cherry-picks}

[Cherry-pick jarayoni][cherry-picks]ga amal qiling.

Cherry-picklar cherry-pick muddatidan oldin GitHub da birlashtirishga tayyor
boʻlishi, toʻgʻri yorliqlarga (masalan,
`approved`, `lgtm`, `release-note`) ega boʻlishi va CI sinovlaridan oʻtishi
kerak. Bu odatda maqsadli relizdan ikki kun oldin, biroq undan ham oldinroq
boʻlishi mumkin. PR qanchalik erta tayyor boʻlsa, shuncha yaxshi, chunki
haqiqiy relizdan oldin cherry-picklaringizni birlashtirgach, CI signalini
olishga vaqt kerak.

Birlashtirish mezonlariga javob bermagan cherry-pick PRlari keyingi
patch-reliz uchun oʻtkaziladi va kuzatiladi.

## Qoʻllab-quvvatlash davri {#support-period}

[Yillik qoʻllab-quvvatlash KEP][yearly-support]iga muvofiq, Kubernetes
hamjamiyati faol patch-reliz qatorlarini taxminan
oʻn toʻrt (14) oy davomida qoʻllab-quvvatlaydi.

Bu muddatning dastlabki oʻn ikki oyi standart davr hisoblanadi.

Oʻn ikki oylikning oxiriga yaqin quyidagilar sodir boʻladi:

- [Reliz menejerlari][release-managers] reliz chiqaradi
- Patch-reliz qatori texnik xizmat rejimiga oʻtadi

Ikki oylik texnik xizmat rejimi davrida reliz menejerlari quyidagilarni
bartaraf etish uchun qoʻshimcha texnik xizmat relizlarini chiqarishi mumkin:

- tayinlangan CVE identifikatoriga ega
  [zaifliklar](/docs/reference/issues-security/official-cve-feed/) (Xavfsizlikka javob qoʻmitasi maslahati asosida)
- bogʻliqlik muammolari (shu jumladan asosiy tasvir yangilanishlari)
- muhim asosiy komponent muammolari

Ikki oylik texnik xizmat rejimi davri oxirida patch-reliz qatori xizmat
muddati tugagan (EOL) deb hisoblanadi va bogʻliq tarmoqqa moʻljallangan
cherry-picklar tez orada yopiladi.

Eslatma: soddalik uchun texnik xizmat rejimi va xizmat muddati tugashi maqsad
sanalari sifatida oyning 28-sanasi tanlangan (har bir oyda shu sana bor).

## Kelgusi oylik relizlar {#upcoming-monthly-releases}

Muddatlar xato tuzatishlarining jiddiyligiga qarab farq qilishi mumkin, biroq
rejalashtirish osonroq boʻlishi uchun quyidagi oylik reliz nuqtalarini maqsad
qilamiz. Rejasiz, jiddiy relizlar ular oraligʻida ham chiqishi mumkin.

{{< upcoming-releases >}}

## Faol tarmoqlar uchun batafsil reliz tarixi {#detailed-release-history-for-active-branches}

{{< release-branches >}}

## Faol boʻlmagan tarmoqlar tarixi {#non-active-branch-history}

Bu relizlar endi qoʻllab-quvvatlanmaydi.

{{< eol-releases >}}

[cherry-picks]: https://github.com/kubernetes/community/blob/main/contributors/devel/sig-release/cherry-picks.md
[release-managers]: /releases/release-managers
[release process description]: /releases/release
[yearly-support]: https://git.k8s.io/enhancements/keps/sig-release/1498-kubernetes-yearly-support-period/README.md
