---
title: Kubernetes reliz sikli
type: docs
auto_generated: true
---
<!-- THIS CONTENT IS AUTO-GENERATED via https://github.com/kubernetes/website/blob/main/scripts/releng/update-release-info.sh -->

<!-- Localization note: omit the pageinfo block when localizing -->

## Yaxshilanishlar, issuelar va PRlarni reliz milestoneʼlariga yoʻnaltirish {#targeting-enhancements-issues-and-prs-to-release-milestones}

Ushbu hujjat aniq bir reliz milestoneʼiga yoʻnaltirilgan yaxshilanish, issue
yoki pull request yaratishi kerak boʻlgan Kubernetes ishlab chiquvchilari va
hissa qoʻshuvchilariga qaratilgan.

- [Qisqacha](#tldr)
  - [Oddiy ishlab chiqish (1-11-haftalar)](#normal-dev-weeks-1-11)
  - [Kod muzlashi (12-14-haftalar)](#code-freeze-weeks-12-14)
  - [Relizdan keyin (14-haftadan boshlab)](#post-release-weeks-14)
- [Taʼriflar](#definitions)
- [Reliz sikli](#the-release-cycle)
- [Elementlarni milestoneʼdan olib tashlash](#removal-of-items-from-the-milestone)
- [Milestoneʼga element qoʻshish](#adding-an-item-to-the-milestone)
  - [Milestone saqlovchilari](#milestone-maintainers)
  - [Funksiya qoʻshimchalari](#feature-additions)
  - [Issue qoʻshimchalari](#issue-additions)
  - [PR qoʻshimchalari](#pr-additions)
- [Boshqa majburiy yorliqlar](#other-required-labels)
  - [SIG egasi yorligʻi](#sig-owner-label)
  - [Ustuvorlik yorligʻi](#priority-label)
  - [Issue/PR turi yorligʻi](#issuepr-kind-label)

Yaxshilanishlar, issuelar va pull requestlarni Kubernetes reliziga olib kirish
jarayoni bir nechta manfaatdor tomonni qamrab oladi:

- yaxshilanish, issue va pull request egasi (egalari)
- SIG rahbariyati
- [reliz jamoasi][release-team]

Ish jarayonlari va oʻzaro aloqalar haqidagi maʼlumotlar quyida tavsiflanadi.

Yaxshilanish, issue yoki pull request (PR) egasi sifatida reliz milestoneʼi
talablari bajarilishini taʼminlash sizning masʼuliyatingizdir. Yangilanishlar
talab qilinsa, avtomatlashtirish va reliz jamoasi siz bilan bogʻlanadi, biroq
harakatsizlik ishingiz milestoneʼdan olib tashlanishiga olib kelishi mumkin.
Maqsadli milestone oldingi reliz boʻlsa, qoʻshimcha talablar mavjud (batafsil
maʼlumot uchun [cherry-pick jarayoni][cherry-picks]ga qarang).

## Qisqacha {#tldr}

PR birlashtirilishini istasangiz, unga quyidagi majburiy yorliqlar va
milestoneʼlar kerak. Bu yerda ularni qoʻshish uchun zarur Prow /buyruqlari
keltirilgan:

### Oddiy ishlab chiqish (1-11-haftalar) {#normal-dev-weeks-1-11}

- /sig {name}
- /kind {type}
- /lgtm
- /approved

### [Kod muzlashi][code-freeze] (12-14-haftalar) {#code-freeze-weeks-12-14}

- /milestone {v1.y}
- /sig {name}
- /kind {bug, failing-test}
- /lgtm
- /approved

### Relizdan keyin (14-haftadan boshlab) {#post-release-weeks-14}

«Oddiy ishlab chiqish» bosqichi talablariga qayting:

- /sig {name}
- /kind {type}
- /lgtm
- /approved

1.y tarmogʻiga birlashtirishlar endi [cherry-pick][cherry-picks] orqali,
[reliz menejerlari][release-managers] tasdigʻi bilan amalga oshiriladi.

Avval milestoneʼga yoʻnaltirilgan pull requestlar uchun bogʻliq GitHub issue
ochilishi talab qilingan, biroq endi bunday emas.
Funksiyalar yoki yaxshilanishlar aslida keyingi PRlarga olib boradigan GitHub
issuelari yoki [KEPlar][keps] hisoblanadi.

Umumiy yorliqlash jarayoni artefakt turlari boʻylab izchil boʻlishi kerak.

## Taʼriflar {#definitions}

- *issue egalari*: yaratuvchi, tayinlanganlar va issueni reliz
  milestoneʼiga oʻtkazgan foydalanuvchi

- *Reliz jamoasi*: har bir Kubernetes relizida [bu yerda][release-team]
  tavsiflangan loyiha boshqaruvi vazifalarini bajaradigan jamoa bor.

  Muayyan relizga bogʻliq jamoaning aloqa maʼlumotlarini
  [bu yerda](https://git.k8s.io/sig-release/releases/) topish mumkin.

- *Y kun*: ish kunlarini anglatadi

- *yaxshilanish*: «[Mening narsam yaxshilanishmi?](https://git.k8s.io/enhancements/README.md#is-my-thing-an-enhancement)» ga qarang

- *[Yaxshilanishlarni muzlatish][enhancements-freeze]*:
  yaxshilanishlar joriy relizning bir qismi boʻlishi uchun [KEPlar][keps]
  yakunlanishi kerak boʻlgan muddat

- *[Istisno soʻrovi][exceptions]*:
  muayyan yaxshilanish uchun muddatni uzaytirishni soʻrash jarayoni

- *[Kod muzlashi][code-freeze]*:
  yakuniy reliz sanasidan oldingi ~4 haftalik davr. Bu davrda relizga faqat
  jiddiy xato tuzatishlari birlashtiriladi.

- *[Kesish](https://git.k8s.io/sig-release/releases/release_phases.md#pruning)*:
  yaxshilanish toʻliq amalga oshirilmagan yoki boshqa sababga koʻra barqaror
  hisoblanmasa, uni reliz milestoneʼidan olib tashlash jarayoni

- *reliz milestoneʼi*: relizning MAJOR.MINOR `vX.Y` versiyasiga ishora qiluvchi
  semantik versiya qatori yoki
  [GitHub milestone](https://help.github.com/en/github/managing-your-work-on-github/associating-milestones-with-issues-and-pull-requests).

  Shuningdek,
  [relizlarni versiyalash](https://git.k8s.io/sig-release/release-engineering/reference/versioning.md#kubernetes-release-versioning)ga
  qarang.

- *reliz tarmogʻi*: `vX.Y` milestoneʼi uchun yaratilgan `release-X.Y` Git tarmogʻi.

  `vX.Y-rc.0` relizi vaqtida yaratiladi va relizdan keyin taxminan 12 oy
  davomida `vX.Y.Z` patch-relizlari bilan saqlanadi.

  Eslatma: 1.19 va undan yangi relizlar 1 yil patch-reliz qoʻllab-quvvatlashini
  oladi, 1.18 va undan oldingi relizlar esa 9 oy patch-reliz
  qoʻllab-quvvatlashini olgan.

## Reliz sikli {#the-release-cycle}

![Bitta Kubernetes reliz siklining tasviri](/images/releases/release-cycle.jpg)

Hozirda Kubernetes relizlari yiliga taxminan uch marta chiqadi.

Reliz jarayonini uchta asosiy bosqichga ega deb qarash mumkin:

- Yaxshilanishni aniqlash
- Amalga oshirish
- Barqarorlashtirish

Biroq amalda bu ochiq manbali va egiluvchan (agile) loyiha boʻlib, funksiyalarni
rejalashtirish va amalga oshirish doimiy davom etadi. Loyiha koʻlami va
ishlab chiquvchilarning butun dunyoga tarqalganini hisobga olsak, loyiha
tezligi uchun oxirida turadigan barqarorlashtirish bosqichiga tayanmaslik
muhim. Buning oʻrniga loyihaning doim barqarorligini taʼminlaydigan uzluksiz
integratsiya sinovlari boʻlishi kerak, shunda alohida commitlar biror narsani
buzgani aniqlanadi.

Yil davomida funksiyalar uzluksiz aniqlanib borishi bilan ayrim elementlar
toʻplami muayyan relizga yoʻnaltirilgan sifatida ajralib chiqadi.
**[Yaxshilanishlarni muzlatish][enhancements-freeze]**
reliz siklining ~4-haftasida boshlanadi. Shu paytga kelib, berilgan reliz uchun
moʻljallangan barcha funksiya ishlari reliz jamoasining
[yaxshilanishlar yetakchisi](https://git.k8s.io/sig-release/release-team/role-handbooks/enhancements/README.md)
bilan hamkorlikda mos rejalashtirish artefaktlarida aniqlangan boʻladi.

Yaxshilanishlarni muzlatishdan keyin PR va issuelardagi milestoneʼlarni
kuzatish muhim. Milestone ichidagi elementlar relizni yakunlash uchun
bajariladigan ishlar roʻyxati sifatida ishlatiladi. *Issuelarda* milestoneʼlar
SIG tomonidan saralash orqali toʻgʻri qoʻyilishi kerak, shunda
[reliz jamoasi][release-team] xatolar va yaxshilanishlarni kuzata oladi
(yaxshilanishga oid har qanday issueʼga milestone kerak).

PRlarga milestoneʼlarni avtomatik tayinlashga yordam beradigan ayrim
avtomatlashtirish mavjud.

Hozirda bu avtomatlashtirish quyidagi repozitoriylarga tatbiq etiladi:

- `kubernetes/enhancements`
- `kubernetes/kubernetes`
- `kubernetes/release`
- `kubernetes/sig-release`
- `kubernetes/test-infra`

Yaratish vaqtida `master` tarmogʻiga qarshi PRlarda odamlar PR qaysi
milestoneʼni maqsad qilishi mumkinligiga ishora qilishi kerak. Birlashtirilgach,
`master` tarmogʻiga qarshi PRlarga milestoneʼlar avtomatik qoʻyiladi, shu
vaqtdan boshlab ushbu PRning milestoneʼini odam boshqarishi kamroq zarur.
Reliz tarmoqlariga qarshi PRlarda milestone PR yaratilganda avtomatik
qoʻyiladi, shuning uchun milestoneʼni odam boshqarishi umuman shart emas.

Reliz jamoasi kuzatishi kerak boʻlgan, biroq ushbu avtomatlashtirish
doirasiga kirmaydigan har qanday boshqa ishga milestone qoʻyilishi kerak.

Amalga oshirish va xatolarni tuzatish sikl davomida uzluksiz ketadi, biroq kod
muzlashi davrida yakuniga yetadi.

**[Kod muzlashi][code-freeze]** ~12-haftada boshlanadi va ~2 hafta davom etadi.
Bu vaqt ichida reliz kod bazasiga faqat jiddiy xato tuzatishlari qabul
qilinadi.

Kod muzlashidan keyin va relizdan oldin taxminan ikki hafta bor. Bu davrda
qolgan barcha jiddiy issuelar relizdan oldin hal qilinishi kerak.
Bu hujjatlarni yakunlash uchun ham vaqt beradi.

Kod bazasi yetarli darajada barqaror boʻlgach, `master` tarmogʻi umumiy
ishlab chiqish uchun qayta ochiladi va keyingi reliz milestoneʼi boʻyicha ish
u yerda boshlanadi. Joriy reliz uchun qolgan har qanday oʻzgartirishlar
`master`dan reliz tarmogʻiga cherry-pick qilinadi. Reliz reliz tarmogʻidan
yigʻiladi.

Har bir reliz kengroq Kubernetes hayot siklining bir qismidir:

![Uchta relizni qamrab olgan Kubernetes reliz hayot siklining tasviri](/images/releases/release-lifecycle.jpg)

## Elementlarni milestoneʼdan olib tashlash {#removal-of-items-from-the-milestone}

Elementni milestoneʼga qoʻshish jarayoniga chuqur kirishdan oldin quyidagiga
eʼtibor bering:

[Reliz jamoasi][release-team] aʼzolari issueʼni milestoneʼdan olib tashlashi
mumkin, agar ular yoki masʼul SIG issue aslida relizni toʻsib turmaganini va
oʻz vaqtida hal qilinishi dargumonligini aniqlasa.

Reliz jamoasi aʼzolari PRlarni milestoneʼdan quyidagi yoki shunga oʻxshash
sabablarga koʻra olib tashlashi mumkin:

- PR potensial ravishda beqarorlashtiradi va toʻsuvchi issueʼni hal qilish
  uchun kerak emas
- PR yangi, kechikkan funksiya PRʼi boʻlib, yaxshilanishlar jarayoni yoki
  [istisno jarayoni][exceptions]dan oʻtmagan
- PRga egalik qilishga va u bilan bogʻliq keyingi issuelarni hal qilishga
  tayyor masʼul SIG yoʻq
- PR toʻgʻri yorliqlanmagan
- PRdagi ish koʻzga koʻrinarli tarzda toʻxtagan va yetkazib berish sanalari
  noaniq yoki kech

Reliz jamoasi aʼzolari yorliqlash va SIG(lar) bilan bogʻlanishda yordam
beradi, biroq PRlarni turkumlash va PR sabab boʻlgan har qanday buzilish tezda
bartaraf etilishini kafolatlash uchun tegishli SIG yordamini taʼminlash
yuboruvchining masʼuliyatidir.

Qoʻshimcha harakat talab qilinsa, reliz jamoasi quyidagi kanallar orqali
odamdan odamga eskalatsiya qilishga urinadi:

- Issue turiga mos ravishda SIG jamoasi va SIG aʼzolarini tilga olgan holda
  GitHub da izoh
- SIG pochta roʻyxatiga xat yuborish
  - [hamjamiyat SIG roʻyxati][sig-list]dagi guruh elektron pochta manzillari
    bilan boshlanadi
  - ixtiyoriy ravishda SIG rahbariyati yoki boshqa SIG aʼzolariga ham bevosita
    murojaat qilinadi
- SIG ning Slack kanaliga xabar yuborish
  - [hamjamiyat SIG roʻyxati][sig-list]dagi slackchannel va SIG rahbariyati
    bilan boshlanadi
  - ixtiyoriy ravishda SIG rahbariyati yoki boshqalar foydalanuvchi nomi
    orqali bevosita «@» bilan tilga olinadi

## Milestoneʼga element qoʻshish {#adding-an-item-to-the-milestone}

### Milestone saqlovchilari {#milestone-maintainers}

[`milestone-maintainers`](https://github.com/orgs/kubernetes/teams/milestone-maintainers/members)
GitHub jamoasi aʼzolariga GitHub artefaktlarida reliz milestoneʼini koʻrsatish
masʼuliyati ishonib topshirilgan.

Bu guruh SIG Release tomonidan [saqlanadi](https://git.k8s.io/sig-release/release-team/README.md#milestone-maintainers)
va turli SIGlar rahbariyatidan vakillikka ega.

Kod muzlashidan keyin pull requestlarga davom etayotgan reliz milestoneʼini
qoʻshish qatʼiyan man etiladi, chunki bu reliz barqarorligiga putur yetkazishi
mumkin. Bunday oʻzgarishlardan oldin ham reliz jamoasi yetakchisi, ham faxriy
maslahatchi(lar)ning tasdigʻi olinishi kerak.

### Funksiya qoʻshimchalari {#feature-additions}

Funksiyalarni rejalashtirish va aniqlash bugun turli shakllarda boʻladi, biroq
odatiy misol [KEP][keps]da tavsiflangan katta hajmdagi ish va GitHub dagi
bogʻliq vazifa issuelari boʻlishi mumkin. Reja amalga oshirish mumkin boʻlgan
holatga yetganda va ish boshlanganda, yaxshilanish yoki uning qismlari GitHub
issuelarini yaratish va ularni Prow «/milestone» buyrugʻi bilan belgilash
orqali kelgusi milestoneʼga yoʻnaltiriladi.

Reliz siklining dastlabki ~4 haftasida reliz jamoasining yaxshilanishlar
yetakchisi barcha zarur rejalashtirish artefaktlarini yigʻib olish uchun
SIGlar va funksiya egalari bilan GitHub, Slack va SIG yigʻilishlari orqali
muloqot qiladi.

Agar kelgusi reliz milestoneʼiga yoʻnaltirmoqchi boʻlgan yaxshilanishingiz
boʻlsa, SIG rahbariyatingiz va ushbu relizning yaxshilanishlar yetakchisi bilan
suhbatni boshlang.

### Issue qoʻshimchalari {#issue-additions}

Issuelar Prow «/milestone» buyrugʻi orqali milestoneʼni maqsad qilgan deb
belgilanadi.

Reliz jamoasining [xatolarni saralash yetakchisi](https://git.k8s.io/sig-release/release-team/role-handbooks/bug-triage/README.md)
va umuman hamjamiyat kelib tushayotgan issuelarni kuzatadi hamda ularni hissa
qoʻshuvchilar qoʻllanmasidagi
[issuelarni saralash](https://k8s.dev/docs/guide/issue-triage/)
boʻlimida tavsiflanganidek saralaydi.

Issuelarni milestone bilan belgilash hamjamiyatga issue qachon kuzatilgani va
hamjamiyat uni qachongacha hal qilinishi kerak deb hisoblashi haqida yaxshiroq
koʻrinish beradi. [Kod muzlashi][code-freeze] davrida PRni birlashtirish uchun
milestone qoʻyilishi shart.

PR uchun ochiq issue endi talab qilinmaydi, biroq ochiq issuelar va bogʻliq
PRlarning yorliqlari moslangan boʻlishi kerak. Masalan, yuqori ustuvorlikdagi
xato issueʼsining bogʻliq PRʼi faqat pastroq ustuvorlik bilan belgilangan
boʻlsa, birlashtirilmasligi mumkin.

### PR qoʻshimchalari {#pr-additions}

PRlar Prow «/milestone» buyrugʻi orqali milestoneʼni maqsad qilgan deb
belgilanadi.

Yuqorida tavsiflanganidek, bu kod muzlashi davridagi toʻsuvchi talabdir.

## Boshqa majburiy yorliqlar {#other-required-labels}

[Mana yorliqlar roʻyxati hamda ularning ishlatilishi va maqsadi.](https://git.k8s.io/test-infra/label_sync/labels.md#labels-that-apply-to-all-repos-for-both-issues-and-prs)

### SIG egasi yorligʻi {#sig-owner-label}

SIG egasi yorligʻi milestone issueʼsi choʻzilib ketsa yoki qoʻshimcha eʼtibor
talab qilsa, qaysi SIG ga eskalatsiya qilishimizni belgilaydi. Eskalatsiyadan
keyin yangilanish boʻlmasa, issue milestoneʼdan avtomatik olib tashlanishi
mumkin.

Ular Prow «/sig» buyrugʻi bilan qoʻshiladi. Masalan, SIG Storage masʼul
ekanini koʻrsatuvchi yorliqni qoʻshish uchun `/sig storage` deb izoh qoldiring.

### Ustuvorlik yorligʻi {#priority-label}

Ustuvorlik yorliqlari issuelarni reliz milestoneʼidan chiqarishdan oldin
eskalatsiya yoʻlini aniqlash uchun ishlatiladi. Ular reliz issue hal
qilinishiga bogʻliq ravishda toʻsib qoʻyilishi kerakmi yoki yoʻqligini
aniqlash uchun ham ishlatiladi.

- `priority/critical-urgent`: hech qachon reliz milestoneʼidan avtomatik
  chiqarilmaydi; barcha mavjud kanallar orqali hissa qoʻshuvchi va SIG ga
  uzluksiz eskalatsiya qilinadi.
  - relizni toʻsuvchi issue hisoblanadi
  - [kod muzlashi][code-freeze] davrida issue egalaridan kunlik yangilanishlarni
    talab qiladi
  - kichik relizdan keyin topilmasa, patch-relizni talab qiladi
- `priority/important-soon`: issue egalari va SIG egasiga eskalatsiya
  qilinadi; bir necha muvaffaqiyatsiz eskalatsiya urinishidan keyin
  milestoneʼdan chiqariladi.
  - relizni toʻsuvchi issue hisoblanmaydi
  - patch-relizni talab qilmaydi
  - kod muzlashida 4 kunlik imtiyozli muddatdan keyin reliz milestoneʼidan
    avtomatik chiqariladi
- `priority/important-longterm`: issue egalariga eskalatsiya qilinadi; 1
  urinishdan keyin milestoneʼdan chiqariladi.
  - `priority/important-soon` ga qaraganda yanada kamroq shoshilinch / jiddiy
  - `priority/important-soon` ga qaraganda milestoneʼdan tezroq chiqariladi

### Issue/PR turi yorligʻi {#issuepr-kind-label}

Issue turi vaqt oʻtishi bilan relizga kirayotgan oʻzgarish turlarini aniqlashga
yordam beradi. Bu reliz jamoasiga tezroq reliz davriyligida qanday turdagi
issuelarni oʻtkazib yuborishimiz mumkinligini yaxshiroq tushunish imkonini
berishi mumkin.

Pull requestlar bilan birga, relizga yoʻnaltirilgan issuelar uchun quyidagi
issue turi yorliqlaridan biri qoʻyilishi kerak:

- `kind/api-change`: API ni qoʻshadi, olib tashlaydi yoki oʻzgartiradi
- `kind/bug`: yangi aniqlangan xatoni tuzatadi.
- `kind/cleanup`: sinovlar qoʻshish, qayta tuzish, eski xatolarni tuzatish.
- `kind/design`: dizaynga oid
- `kind/documentation`: hujjat qoʻshadi
- `kind/failing-test`: CI sinov holati izchil ravishda muvaffaqiyatsiz.
- `kind/feature`: yangi funksionallik.
- `kind/flake`: CI sinov holati vaqti-vaqti bilan muvaffaqiyatsizlik koʻrsatadi.

[cherry-picks]: https://git.k8s.io/community/contributors/devel/sig-release/cherry-picks.md
[code-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#code-freeze
[enhancements-freeze]: https://git.k8s.io/sig-release/releases/release_phases.md#enhancements-freeze
[exceptions]: https://git.k8s.io/sig-release/releases/release_phases.md#exceptions
[keps]: https://git.k8s.io/enhancements/keps
[release-managers]: /releases/release-managers/
[release-team]: https://git.k8s.io/sig-release/release-team
[sig-list]: https://k8s.dev/sigs
