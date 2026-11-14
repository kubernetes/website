---
title: Reliz menejerlari
type: docs
---

«Reliz menejerlari» — reliz tarmoqlarini saqlash va SIG Release taqdim etadigan
vositalar yordamida relizlar yaratish uchun masʼul Kubernetes hissa
qoʻshuvchilari toʻplamini oʻz ichiga olgan umumiy atama.

Har bir rolning masʼuliyatlari quyida tavsiflanadi.

- [Aloqa](#contact)
  - [Xavfsizlik embargo siyosati](#security-embargo-policy)
- [Qoʻllanmalar](#handbooks)
- [Reliz menejerlari](#release-managers)
  - [Reliz menejeriga aylanish](#becoming-a-release-manager)
- [Reliz menejeri yordamchilari](#release-manager-associates)
  - [Reliz menejeri yordamchisiga aylanish](#becoming-a-release-manager-associate)
- [SIG Release rahbarlari](#sig-release-leads)
  - [Raislar](#chairs)
  - [Texnik rahbarlar](#technical-leads)

## Aloqa {#contact}

| Pochta roʻyxati | Slack | Koʻrinish | Foydalanish | Aʼzolik |
| --- | --- | --- | --- | --- |
| [release-managers@kubernetes.io](mailto:release-managers@kubernetes.io) | [#release-management](https://kubernetes.slack.com/messages/CJH2GBF7Y) (kanal) / @release-managers (foydalanuvchilar guruhi) | Ommaviy | Reliz menejerlari uchun ommaviy muhokama | Barcha reliz menejerlari (shu jumladan yordamchilar va SIG raislari) |
| [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) | Mavjud emas | Shaxsiy | Imtiyozli reliz menejerlari uchun shaxsiy muhokama | Reliz menejerlari, SIG Release rahbariyati |
| [security-release-team@kubernetes.io](mailto:security-release-team@kubernetes.io) | [#security-release-team](https://kubernetes.slack.com/archives/G0162T1RYHG) (kanal) / @security-rel-team (foydalanuvchilar guruhi) | Shaxsiy | Xavfsizlik relizini Xavfsizlikka javob qoʻmitasi bilan muvofiqlashtirish | [security-discuss-private@kubernetes.io](mailto:security-discuss-private@kubernetes.io), [release-managers-private@kubernetes.io](mailto:release-managers-private@kubernetes.io) |

### Xavfsizlik embargo siyosati {#security-embargo-policy}

Relizlar haqidagi ayrim maʼlumotlar embargoga tortiladi va biz bu embargolar
qanday oʻrnatilishi haqida siyosat belgilaganmiz. Batafsil maʼlumot uchun
[xavfsizlik embargo siyosati](https://github.com/kubernetes/committee-security-response/blob/main/private-distributors-list.md#embargo-policy)ga
qarang.

## Qoʻllanmalar {#handbooks}

**ESLATMA: Patch-reliz jamoasi va tarmoq menejeri qoʻllanmalari keyinroq takrorlanishdan tozalanadi.**

- [Patch-reliz jamoasi][handbook-patch-release]
- [Tarmoq menejerlari][handbook-branch-mgmt]

## Reliz menejerlari {#release-managers}

**Eslatma:** Hujjatlarda Patch-reliz jamoasi va tarmoqni boshqarish roli tilga
olinishi mumkin. Bu ikki rol Reliz menejerlari roliga birlashtirilgan.

Reliz menejerlari va reliz menejeri yordamchilari uchun eng kam talablar:

- Asosiy Unix buyruqlarini bilish va shell skriptlaridagi xatolarni tuzata olish.
- `git` va tegishli `git` buyruq qatori chaqiruvlari orqali tarmoqlangan manba
  kodi ish oqimlarini bilish.
- Google Cloud (Cloud Build va Cloud Storage) haqida umumiy bilim.
- Yordam soʻrashga ochiq boʻlish va aniq muloqot qilish.
- Kubernetes hamjamiyati [aʼzoligi][community-membership]

Reliz menejerlari quyidagilar uchun masʼul:

- Kubernetes relizlarini muvofiqlashtirish va chiqarish:
  - Patch-relizlar (`x.y.z`, bu yerda `z` > 0)
  - Kichik relizlar (`x.y.z`, bu yerda `z` = 0)
  - Oldindan relizlar (alpha, beta va reliz nomzodlari)
  - Har bir reliz sikli davomida [reliz jamoasi][release-team] bilan
    ishlash
  - Patch-relizlar uchun [jadval va davriylik][patches]ni belgilash
- Reliz tarmoqlarini saqlash:
  - Cherry-picklarni koʻrib chiqish
  - Reliz tarmogʻi sogʻlom qolishini va moʻljallanmagan patch
    birlashtirib yuborilmasligini taʼminlash
- [Reliz menejeri yordamchilari](#release-manager-associates) guruhiga mentorlik qilish
- k/release dagi funksiyalarni faol ishlab chiqish va kodni saqlash
- Buddy dasturida faol ishtirok etish orqali reliz menejeri yordamchilari va hissa
  qoʻshuvchilarni qoʻllab-quvvatlash
  - Yordamchilar bilan har oy muloqot qilish va vazifalarni topshirish, ularga
    reliz chiqarish vakolatini berish hamda mentorlik qilish
  - Yordamchilarga yangi hissa qoʻshuvchilarni jalb qilishda koʻmaklashish uchun
    tayyor turish, masalan, savollarga javob berish va ularga mos ishni taklif qilish

Bu jamoa baʼzan [Xavfsizlikka javob qoʻmitasi][src] bilan yaqin hamkorlikda
ishlaydi va shu sababli [xavfsizlik relizi jarayoni][security-release-process]da
belgilangan qoʻllanmalarga rioya qilishi kerak.

GitHub kirish nazorati: [@kubernetes/release-managers](https://github.com/orgs/kubernetes/teams/release-managers)

GitHub da tilga olish: @kubernetes/release-engineering

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Cici Huang ([@cici37](https://github.com/cici37))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Marko Mudrinić ([@xmudrii](https://github.com/xmudrii))
- Nabarun Pal ([@palnabarun](https://github.com/palnabarun))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))
- Verónica López ([@verolop](https://github.com/verolop))

### Reliz menejeriga aylanish {#becoming-a-release-manager}

Reliz menejeriga aylanish uchun avval reliz menejeri yordamchisi boʻlib xizmat
qilish kerak. Yordamchilar bir necha sikl davomida relizlar ustida faol ishlash
va quyidagilar orqali reliz menejeriga oʻtadi:

- yetakchilik qilishga tayyorlikni koʻrsatish
- mustaqil reliz chiqarishgacha reliz menejerlari bilan patchlarda birga ishlash
  - reliz chiqarish imkoniyati cheklanganligi sababli, tasvirlarni reliz registriga koʻtarish (image promotion) va boshqa
    asosiy reliz muhandisligi vazifalariga qoʻshilgan salmoqli hissa ham hisobga olinadi
- yordamchilar ishini tanqidiy koʻrib chiqish, yaxshilanishlar taklif qilish,
  fikr-mulohaza yigʻish va oʻzgarishni ilgari surish
- ishonchli va tezkor javob beradigan boʻlish
- bajarish uchun reliz menejeri darajasidagi kirish huquqi va imtiyozlar talab
  qilinadigan murakkab ishga kirishish

## Reliz menejeri yordamchilari {#release-manager-associates}

Reliz menejeri yordamchilari reliz menejerlarining shogirdlaridir; avval ular
reliz menejeri soyasi (shadow) deb atalgan. Ular quyidagilar uchun masʼul:

- Patch-reliz ishlari, cherry-picklarni koʻrib chiqish
- k/release ga hissa qoʻshish: bogʻliqliklarni yangilash va manba kod
  bazasiga koʻnikish
- Hujjatlarga hissa qoʻshish: qoʻllanmalarni saqlash, reliz jarayonlari
  hujjatlashtirilganiga ishonch hosil qilish
- Reliz menejeri yordami bilan: reliz sikli davomida reliz jamoasi bilan ishlash
  va Kubernetes relizlarini chiqarish
- Ustuvorlik va muloqotda yordam berish imkoniyatlarini izlash
  - Patch-relizlar haqida oldindan eʼlonlar va yangilanishlar yuborish
  - Taqvimni yangilash, reliz sanalari va
    [reliz sikli vaqt jadvali][k-sig-release-releases]dagi bosqichlar boʻyicha yordam berish
- Buddy dasturi orqali yangi hissa qoʻshuvchilarni jalb qilish va ular bilan
  vazifalarda juft ishlash

GitHub da tilga olish: @kubernetes/release-engineering

- Arnaud Meukam ([@ameukam](https://github.com/ameukam))
- Jim Angel ([@jimangel](https://github.com/jimangel))
- Joseph Sandoval ([@jrsapi](https://github.com/jrsapi))
- Xander Grzywinski([@salaxander](https://github.com/salaxander))

### Reliz menejeri yordamchisiga aylanish {#becoming-a-release-manager-associate}

Hissa qoʻshuvchilar quyidagilarni koʻrsatish orqali yordamchiga aylanishi mumkin:

- izchil ishtirok, jumladan reliz muhandisligiga oid 6-12 oylik faol ish
- reliz sikli davomida reliz jamoasida texnik rahbar rolini bajargan tajriba
  - bu tajriba SIG Release umuman qanday ishlashini tushunish uchun mustahkam
    asos beradi — jumladan, texnik koʻnikmalar, muloqot va tezkor javob hamda
    ishonchlilik boʻyicha kutishlarimiz
- Testgrid bilan oʻzaro aloqamizni yaxshilaydigan, kutubxonalarni tartibga
  keltiradigan va shu kabi k/release vazifalari ustida ishlash
  - bu ishlar reliz menejerlari va yordamchilar bilan muloqot qilish va juft
    ishlashni talab qiladi

## SIG Release rahbarlari {#sig-release-leads}

SIG Release raislari va texnik rahbarlari quyidagilar uchun masʼul:

- SIG Release boshqaruvi
- Reliz menejerlari va yordamchilar uchun bilim almashish sessiyalarini olib borish
- Rahbarlik va ustuvorlik boʻyicha murabbiylik

Ular bu yerda alohida tilga olinadi, chunki har bir rol uchun turli aloqa
kanallari va ruxsat guruhlari (GitHub jamoalari, GCP kirishi) egalari
hisoblanadi. Shu bois ular yuqori imtiyozli hamjamiyat aʼzolari hisoblanadi va
baʼzan Kubernetes xavfsizlik oshkor etishlariga tegishli boʻlishi mumkin boʻlgan
ayrim shaxsiy yozishmalardan xabardor boʻladi.

GitHub jamoasi: [@kubernetes/sig-release-leads](https://github.com/orgs/kubernetes/teams/sig-release-leads)

### Raislar {#chairs}

- Jeremy Rickard ([@jeremyrickard](https://github.com/jeremyrickard))
- Sascha Grunert ([@saschagrunert](https://github.com/saschagrunert))
- Stephen Augustus ([@justaugustus](https://github.com/justaugustus))

### Texnik rahbarlar {#technical-leads}

- Adolfo García Veytia ([@puerco](https://github.com/puerco))
- Carlos Panato ([@cpanato](https://github.com/cpanato))
- Verónica López ([@verolop](https://github.com/verolop))

---

Sobiq tarmoq menejerlarini kubernetes/sig-release repozitoriyasining
[relizlar katalogi][k-sig-release-releases]dagi `release-x.y/release_team.md`
ichidan topish mumkin.

Misol: [1.15 reliz jamoasi](https://git.k8s.io/sig-release/releases/release-1.15/release_team.md)

[community-membership]: https://git.k8s.io/community/community-membership.md#member
[handbook-branch-mgmt]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/branch-manager.md
[handbook-patch-release]: https://git.k8s.io/sig-release/release-engineering/role-handbooks/patch-release-team.md
[k-sig-release-releases]: https://git.k8s.io/sig-release/releases
[patches]: /releases/patch-releases/
[src]: https://git.k8s.io/community/committee-security-response/README.md
[release-team]: https://git.k8s.io/sig-release/release-team/README.md
[security-release-process]: https://git.k8s.io/security/security-release-process.md
