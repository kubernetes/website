---
# reviewers:
# - bgrant0607
# - mikedanese
title: "Umumiy koʻrinish"
description: >
  Kubernetes konteynerlashtirilgan yuklamalar va xizmatlarni boshqarish uchun koʻchma, kengaytiriladigan, ochiq manbali platformadir. U deklarativ konfiguratsiya va avtomatlashtirishni osonlashtiradi. Uning ekotizimi katta va tez oʻsmoqda. Kubernetes xizmatlari, qoʻllab-quvvatlashi va vositalari keng tarqalgan.
content_type: concept
weight: 20
theme_lock: light
card:
  name: concepts
  weight: 10
  anchors:
  - anchor: "#why-you-need-kubernetes-and-what-can-it-do"
    title: Nega Kubernetes?
no_list: true
---

<!-- overview -->
Bu sahifa Kubernetesning umumiy koʻrinishidir.


<!-- body -->

Kubernetes nomi yunonchadan olingan boʻlib, rulchi yoki uchuvchi degan maʼnoni anglatadi. K8s qisqartmasi "K" va "s" orasidagi sakkizta harfni sanashdan kelib chiqadi. Google Kubernetes loyihasini 2014-yilda ochiq manba qildi. Kubernetes [Google ning 15 yildan ortiq tajribasini](/blog/2015/04/borg-predecessor-to-kubernetes/) hamjamiyatdagi eng sara gʻoyalar va amaliyotlar bilan birlashtiradi.

## Nega Kubernetes kerak va u nima qila oladi {#why-you-need-kubernetes-and-what-can-it-do}

Konteynerlar ilovalaringizni yigʻish va ishga tushirishning yaxshi usulidir. Ishlab chiqarish muhitida ilovalarni ishga tushirayotgan konteynerlarni boshqarish va uzilish boʻlmasligini taʼminlash kerak. Masalan, bir konteyner toʻxtasa, boshqasi ishga tushishi kerak. Bu xatti-harakatni tizimning oʻzi boshqarsa, osonroq boʻlmasmidi?

Kubernetes aynan shu yerda yordamga keladi. U taqsimlangan tizimlarni chidamli ishga tushirish uchun asos beradi. Ilovangizning masshtablanishi va zaxiraga oʻtishini oʻz zimmasiga oladi, joylashtirish namunalarini beradi va yana koʻp narsani qiladi. Masalan, Kubernetes tizimingiz uchun canary joylashtirishni oson boshqara oladi.

Kubernetes sizga quyidagilarni beradi:

* **Xizmatni topish va yukni muvozanatlash**
  Kubernetes konteynerni DNS nomi yoki oʻzining IP manzili orqali ochishi mumkin.
  Konteynerga tushayotgan trafik yuqori boʻlsa, Kubernetes tarmoq trafigini muvozanatlashtiradi va taqsimlaydi, shunda joylashtirish barqaror qoladi.
* **Saqlashni orkestratsiya qilish**
  Kubernetes siz tanlagan saqlash tizimini, masalan mahalliy saqlashni, ommaviy bulut provayderlarini va boshqalarni avtomatik ulashga imkon beradi.
* **Avtomatik yangilash va orqaga qaytarish**
  Joylashtirilgan konteynerlarning istagan holatini Kubernetes orqali tasvirlaysiz, u esa haqiqiy holatni nazoratli surʼatda shu holatga olib keladi.
  Masalan, Kubernetesni yangi konteynerlar yaratishga, mavjudlarini olib tashlashga va ularning resurslarini yangi konteynerga oʻtkazishga avtomatlashtirish mumkin.
* **Avtomatik joylashtirish**
  Kubernetesga konteynerlashtirilgan vazifalarni ishga tushirish uchun tugunlar klasterini berasiz.
  Har bir konteynerga qancha CPU va xotira (RAM) kerakligini aytasiz. Kubernetes resurslaringizdan unumli foydalanish uchun konteynerlarni tugunlarga joylashtiradi.
* **Oʻzini tiklash**
  Kubernetes ishlamay qolgan konteynerlarni qayta ishga tushiradi, konteynerlarni almashtiradi, siz belgilagan sogʻliq tekshiruviga javob bermaydigan konteynerlarni toʻxtatadi va ular xizmat koʻrsatishga tayyor boʻlmaguncha mijozlarga eʼlon qilmaydi.
* **Maxfiy maʼlumot va konfiguratsiyani boshqarish**
  Kubernetes parollar, OAuth tokenlari va SSH kalitlari kabi sezgir maʼlumotlarni saqlash va boshqarish imkonini beradi. Konteyner obrazlarini qayta yigʻmasdan va maxfiy maʼlumotlarni stek konfiguratsiyasida ochmasdan secretlar hamda ilova konfiguratsiyasini joylashtirish va yangilash mumkin.
* **Paket ishlar**
  Xizmatlardan tashqari, Kubernetes paket va CI yuklamalarini boshqarishi va xohlasangiz ishlamay qolgan konteynerlarni almashtirishi mumkin.
* **Gorizontal masshtablash**
  Ilovani oddiy buyruq bilan, interfeys orqali yoki CPU foydalanishiga qarab avtomatik ravishda kattalashtirish va kichiklashtirish mumkin.
* **IPv4/IPv6 dual-stack**
  Pod va Service larga IPv4 va IPv6 manzillarini ajratish.
* **Kengaytirish uchun loyihalangan**
  Yuqori oqim manba kodini oʻzgartirmasdan Kubernetes klasteriga funksiyalar qoʻshish.

## Kubernetes nima emas

Kubernetes anʼanaviy, hammasini oʻz ichiga olgan PaaS (Platform as a Service) tizimi emas.
Kubernetes apparat darajasida emas, konteyner darajasida ishlagani uchun PaaS takliflariga xos baʼzi umumiy imkoniyatlarni beradi: joylashtirish, masshtablash, yukni muvozanatlash. Foydalanuvchilar jurnal, monitoring va ogohlantirish yechimlarini oʻzlari ulashi mumkin. Biroq Kubernetes monolit emas, bu standart yechimlar ixtiyoriy va almashtiriladigan. Kubernetes ishlab chiquvchi platformalarini qurish uchun qurilish bloklarini beradi, muhim joyda esa foydalanuvchi tanlovini va moslashuvchanlikni saqlaydi.

Kubernetes:

* Qoʻllab-quvvatlanadigan ilova turlarini cheklamaydi. Kubernetes holatsiz, holatli va maʼlumotlarni qayta ishlash yuklamalarini ham oʻz ichiga olgan juda xilma-xil yuklamalarni qoʻllab-quvvatlashni maqsad qiladi. Ilova konteynerda ishlay olsa, u Kubernetesda ham yaxshi ishlashi kerak.
* Manba kodini joylashtirmaydi va ilovangizni yigʻmaydi. Uzluksiz integratsiya, yetkazib berish va joylashtirish (CI/CD) jarayonlari tashkilot madaniyati, afzalliklari va texnik talablar bilan belgilanadi.
* Oʻrnatilgan xizmat sifatida ilova darajasidagi xizmatlarni bermaydi: middleware (masalan, xabar shinasi), maʼlumotlarni qayta ishlash freymvorklari (masalan, Spark), maʼlumotlar bazalari (masalan, MySQL), keshlar yoki klaster saqlash tizimlari (masalan, Ceph). Bunday komponentlar Kubernetesda ishlashi mumkin va/yoki Kubernetesda ishlayotgan ilovalar ularga [Open Service Broker](https://openservicebrokerapi.org/) kabi koʻchma mexanizmlar orqali murojaat qilishi mumkin.
* Jurnal, monitoring yoki ogohlantirish yechimini majburlamaydi. U kontseptni tasdiqlash uchun baʼzi integratsiyalar hamda metrikalarni yigʻish va eksport qilish mexanizmlarini beradi.
* Konfiguratsiya tili yoki tizimini (masalan, Jsonnet) bermaydi va majburlamaydi. U deklarativ API beradi va bu APIga turli deklarativ spetsifikatsiyalar yoʻnaltirilishi mumkin.
* Toʻliq mashina konfiguratsiyasi, texnik xizmat, boshqaruv yoki oʻzini tiklash tizimini bermaydi va qabul qilmaydi.
* Bundan tashqari, Kubernetes oddiy orkestratsiya tizimi emas. Aslida u orkestratsiyaga boʻlgan ehtiyojni yoʻqotadi. Orkestratsiyaning texnik taʼrifi belgilangan ish oqimini bajarishdir: avval A, keyin B, soʻng C. Kubernetes esa hozirgi holatni berilgan istagan holatga uzluksiz olib boradigan mustaqil, birlashtiriladigan boshqaruv jarayonlari toʻplamidir. A dan C ga qanday yetib borishingiz muhim emas. Markazlashgan boshqaruv ham shart emas. Natijada tizimdan foydalanish osonroq, u esa kuchliroq, mustahkamroq, chidamliroq va kengaytiriladigan boʻladi.

## Kubernetesning tarixiy konteksti {#going-back-in-time}

Kubernetes nima uchun foydali ekanini koʻrish uchun vaqtga nazar tashlaymiz.

![Joylashtirish evolyutsiyasi](/images/docs/Container_Evolution.svg)

**Anʼanaviy joylashtirish davri:**

Dastlab tashkilotlar ilovalarni fizik serverlarda ishga tushirgan. Fizik serverda ilovalar uchun resurs chegarasini belgilash imkoni yoʻq edi va bu resurslarni taqsimlash muammolarini keltirib chiqargan. Masalan, bir fizik serverda bir nechta ilova ishlasa, bittasi resurslarning koʻpini egallab, qolganlari yomon ishlashi mumkin. Yechim har bir ilovani alohida fizik serverda ishga tushirish boʻlgan. Lekin bu masshtablanmagan: resurslar toʻliq ishlatilmagan va koʻp fizik serverni yuritish qimmatga tushgan.

**Virtuallashtirilgan joylashtirish davri:**

Yechim sifatida virtuallashtirish joriy etildi. U bitta fizik serverning CPU sida bir nechta virtual mashinani (VM) ishga tushirishga imkon beradi. Virtuallashtirish ilovalarni VM lar orasida ajratadi va xavfsizlik qatlamini beradi, chunki bir ilovaning maʼlumotiga boshqasi erkin kira olmaydi.

Virtuallashtirish fizik serverdagi resurslardan yaxshiroq foydalanish va yaxshiroq masshtablash imkonini beradi, chunki ilovani oson qoʻshish yoki yangilash mumkin, apparat xarajati kamayadi va yana boshqa foydalar bor. Virtuallashtirish bilan fizik resurslar toʻplamini bir martalik virtual mashinalar klasteri sifatida koʻrsatish mumkin.

Har bir VM virtual apparat ustida oʻz operatsion tizimini ham oʻz ichiga olgan barcha komponentlarni ishga tushiradigan toʻliq mashinadir.

**Konteynerli joylashtirish davri:**

Konteynerlar VM larga oʻxshaydi, lekin ilovalar orasida operatsion tizimni (OS) ulashish uchun ajratish talablari yumshoqroq. Shuning uchun konteynerlar yengil hisoblanadi. VM ga oʻxshab, konteynerning oʻz fayl tizimi, CPU ulushi, xotirasi, jarayonlar makoni va boshqa resurslari bor. Ular ostidagi infratuzilmadan ajratilgani uchun bulutlar va OS distributivlari orasida koʻchma.

Konteynerlar qoʻshimcha foydalari tufayli ommalashdi:

* Tezkor ilova yaratish va joylashtirish: VM obraziga qaraganda konteyner obrazini yaratish osonroq va samaraliroq.
* Uzluksiz ishlab chiqish, integratsiya va joylashtirish: konteyner obrazini ishonchli va tez-tez yigʻish hamda joylashtirish, obraz oʻzgarmasligi tufayli tez orqaga qaytarish.
* Dev va Ops masʼuliyatini ajratish: ilova konteyner obrazlari joylashtirish paytida emas, yigʻish va reliz paytida yaratiladi, shu bilan ilova infratuzilmadan ajraladi.
* Kuzatuvchanlik: nafaqat OS darajasidagi maʼlumot va metrikalarni, balki ilova sogʻligʻi va boshqa signallarni ham koʻrsatadi.
* Ishlab chiqish, sinov va ishlab chiqarish oʻrtasida muhitning bir xilligi: noutbukda qanday ishlasa, bulutda ham shunday ishlaydi.
* Bulut va OS distributivi boʻyicha koʻchma: Ubuntu, RHEL, CoreOS, oʻz infratuzilmangiz, yirik ommaviy bulutlar va boshqa joylarda ishlaydi.
* Ilovaga yoʻnaltirilgan boshqaruv: abstraksiya darajasini virtual apparatda OS ishga tushirishdan mantiqiy resurslar yordamida OS da ilovani ishga tushirishga koʻtaradi.
* Boʻsh bogʻlangan, taqsimlangan, elastik mikroservislar: ilovalar kichikroq, mustaqil boʻlaklarga boʻlinadi va dinamik joylashtiriladi hamda boshqariladi. Bu bitta katta, bitta maqsadli mashinada ishlaydigan monolit stek emas.
* Resurslarni ajratish: ilova unumdorligi oldindan taxmin qilinadi.
* Resurslardan foydalanish: yuqori samaradorlik va zichlik.

## {{% heading "whatsnext" %}}

* [Kubernetes komponentlari](/docs/concepts/overview/components/) bilan tanishing
* [Kubernetes API](/docs/concepts/overview/kubernetes-api/) bilan tanishing
* [kubectl](/docs/concepts/overview/kubectl/) bilan tanishing: Kubernetesning asosiy buyruq qatori
* [Klaster arxitekturasi](/docs/concepts/architecture/) bilan tanishing
* [Boshlash](/docs/setup/)ga tayyormisiz?
