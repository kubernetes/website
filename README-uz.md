# Kubernetes hujjatlari

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Ushbu repozitory [Kubernetes veb-sayti va hujjatlari](https://kubernetes.io/) yaratish uchun barcha kerakli fayllarni o'z ichiga oladi .Hissa qo'shish istagingiz uchun tashakkur!

# Ushbu repozitorydan foydalanish

Siz saytni Hugo [Kengaytirilgan versiya](https://gohugo.io/) yordamida yoki konteynerlar uchun bajariladigan muhitda ishga tushirishingiz mumkin. Biz konteyner muhitidan foydalanishni tavsiya qilamiz, chunki u asl sayt bilan tarqatishning mustahkamligini ta'minlaydi.

## Boshlang'ich Shartlar

Ushbu repozitory bilan ishlash uchun sizga mahalliy o'rnatilgan quyidagi komponentlar kerak bo'ladi:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (Extended version)](https://gohugo.io/)
- Konteynerlar uchun bajariladigan muhit [Docker](https://www.docker.com/)

Ishni boshlashdan oldin, bog'liqliklarni o'rnating. Repozitorydan nusxaoling va uning papkasiga o'ting:

```
git clone https://github.com/kubernetes/website.git
cd website
```

Kubernetes sayti [Hugo uchun Docs deb nomlangan mavzu](https://github.com/google/docs)dan foydalanadi. Xattoki siz saytni konteynerda ishga tushirishni rejalashtirmoqchi bo'lsangiz ham, quyidagi buyruqni bajarish orqali tegishli submodul va boshqa yaratish bog'liqliklarini yuklab olishni tavsiya etamiz:

## Windows
```
# Submodul bog'gliqliklarini yuklab oling 
git submodule update --init --recursive --depth 1
```
## Linux/ other Unix
```
# Submodul bog'gliqliklarini yuklab oling 
make module-init
```

## Konteyner yordamida veb-saytni ishga tushirish

Saytni konteynerda yaratish uchun quyidagilarni bajaring:
```
# Siz $CONTAINER_ENGINE ni Docker-ga o'xshash har qanday konteyner vositasi nomiga o'rnatishingiz mumkin
make container-serve
```

Agar siz xatolarni ko'rsangiz, bu hugo konteynerida yetarli hisoblash resurslari mavjud emasligini anglatadi. Buni hal qilish uchun kompyuteringizda (MacOSX va Windows) Docker uchun ruxsat etilgan CPU va xotiradan foydalanish hajmini oshiring. 
## Hugo yordamida veb-saytni mahalliy sifatida ishga tushirish
[`netlify.toml`](netlify.toml#L10) faylida `HUGO_VERSION` muhit o'zgaruvchisi tomonidan belgilangan Hugo kengaytirilgan versiyasini o'rnatganingizga ishonch hosil qiling.

Saytni mahalliy sifatida yaratish va sinab ko'rish uchun quyidagilarni bajaring:

```bash
# bog'liqliklarni ishga tushiring
npm ci
make serve
```

Bu 1313-portda mahalliy Hugo serverini ishga tushiradi. Veb-saytni ko'rish uchun brauzeringizda http://localhost:1313 manzilini oching. Manba fayllariga o'zgartirishlar kiritganingizda, Hugo veb-saytni yangilaydi va brauzerni yangilashga majbur qiladi.

## API ma'lumotnoma-sahifalarini yaratish
`content/en/docs/reference/kubernetes-api` manzilida joylashgan API ma'lumot sahifalari [`https://github.com/kubernetes-sigs/reference-docs/tree/master`](https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs) yordamida OpenAPI spetsifikatsiyasi sifatida tanilgan Swagger spetsifikatsiyasidan foydalanib qurilgan.

Kubernetesning yangi versiyasi uchun ma'lumotnomalarni yangilashda quyidagi amallarni bajaring:

1. Pull in the `api-ref-generator` submodule:
```
git submodule update --init --recursive --depth 1
```
2. Swagger spetsifikatsiyasini yangilang:
```
curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
```
3. `api-ref-assets/config/` da `toc.yaml` va `fields.yaml` fayllarini yangi versiyadagi o'zgarishlarni aks ettirish uchun moslang.

4. Keyin sahifalarni yarating:
```
make api-reference
```
Saytni konteyner imagedan yaratish va xizmat ko'rsatish orqali natijalarni mahalliy sinab ko'rishingiz mumkin:
```
make container-image
make container-serve
```
Veb-brauzerda API ma'lumotnomasini ko'rish uchun [`http://localhost:1313/docs/reference/kubernetes-api/`](http://localhost:1313/docs/reference/kubernetes-api/) saytiga o'ting.

5. Yangi shartnomadagi barcha o'zgarishlar `toc.yaml` va `fields.yaml` konfiguratsiya fayllarida aks ettirilganda, yangi yaratilgan API ma'lumotnomalari bilan Pull Requestni yarating.



## Muammolarni bartaraf qilish
### error: failed to transform resource: TOCSS: failed to transform "scss/main.scss" (text/x-scss): this feature is not available in your current Hugo version


Hugo texnik sabablarga ko'ra ikkita ikkilik to'plamda yuboriladi. Joriy veb-sayt faqat **Hugo Extended** versiyasi asosida ishlaydi. [Chiqarish sahifasida](https://github.com/gohugoio/hugo/releases) `extended` nomi bilan arxivlardan qidiring. Tasdiqlash uchun `hugo version` ni ishga tushiring va `extended` so'zni qidiring.

### Juda koʻp ochiq fayllar uchun macOS bilan bogʻliq muammolarni bartaraf qilish

Agar siz macOS-da `make serve` ni ishga tushirsangiz va quyidagi xatolikni qabul qilsangiz:

```
ERROR 2020/08/01 19:09:18 Error: listen tcp 127.0.0.1:1313: socket: too many open files
make: *** [serve] Error 1
```

Ochiq fayllar uchun joriy limitni tekshirib ko'ring:

`launchctl limit maxfiles`

Keyin quyidagi buyruqlarni bajaring [`https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c`](https://gist.github.com/tombigel/d503800a282fcadbee14b537735d202c dan moslashtirilgan):

```shell
#!/bin/sh

# Bu asl havolalar bo'lib, ular hozir mening havolalarim bilan bog'lanadi.
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxfiles.plist
# curl -O https://gist.githubusercontent.com/a2ikm/761c2ab02b7b3935679e55af5d81786a/raw/ab644cb92f216c019a2f032bbf25e258b01d87f9/limit.maxproc.plist

curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxfiles.plist
curl -O https://gist.githubusercontent.com/tombigel/d503800a282fcadbee14b537735d202c/raw/ed73cacf82906fdde59976a0c8248cce8b44f906/limit.maxproc.plist

sudo mv limit.maxfiles.plist /Library/LaunchDaemons
sudo mv limit.maxproc.plist /Library/LaunchDaemons

sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo chown root:wheel /Library/LaunchDaemons/limit.maxproc.plist

sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

Bu Catalina va Mojave macOS uchun ishlaydi.

# SIG Docs bilan shug'ullaning
SIG Docs Kubernetes hamjamiyati va uchrashuvlar haqida [hamjamiyat sahifasi](https://github.com/kubernetes/community/tree/master/sig-docs#meetings) da
ko'proq bilib oling.

Shuningdek, ushbu loyihaning boshqaruvchilariga quyidagi manzil orqali murojaat qilishingiz mumkin:

- [Slack dagi kanal](https://kubernetes.slack.com/messages/sig-docs) 
- ([Slack uchun tashrifni qo'lga kiriting](https://slack.k8s.io/))
- [Pochta ro'yhatlari](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

# Hujjatlarga hissa qo'shish

GitHub akkauntingizda ushbu repozitoryning nusxasini yaratish uchun ekranning yuqori o‘ng qismidagi **Fork** tugmasini bosishingiz mumkin. Ushbu nusxa sug'urish deb ataladi. O'zingizning vilkangizda xohlagan o'zgarishlarni kiriting va bu o'zgarishlarni bizga yuborishga tayyor bo'lgach, vilkangizga o'ting va bu haqda bizga xabar berish uchun yangi pull request (PR) yarating.

Sizning pull request (PR)ingiz yaratilgandan so'ng, Kubernetes tekshiruvchisi aniq va amalda bo'ladigan fikr-mulohazalarni taqdim etish uchun javobgarlikni o'z zimmasiga oladi. **Pull request (PR)ning egasi sifatida Kubernetes tekshiruvchisi tomonidan sizga taqdim etilgan fikr-mulohazalarni hal qilish uchun pull requestingizni oʻzgartirish sizning javobgarligingizdir.**

Shuni ham yodda tutingki, bir nechta Kubernetes tekshiruvchisi sizga fikr-mulohaza bildirishi mumkin yoki Kubernetes sharhlovchisidan dastlab sizga fikr-mulohaza bildirish uchun tayinlanganidan farqli fikr-mulohaza olishingiz mumkin.

Bundan tashqari, ba'zi hollarda tekshiruvchilaringizdan biri kerak bo'lganda [Kubernetes texnik tekshiruvchisi](https://github.com/kubernetes/website/wiki/Tech-reviewers)dan texnik ko'rib chiqishni so'rashi mumkin. Tekshiruvchilar o'z vaqtida fikr-mulohazalarni taqdim etish uchun qo'llaridan kelganini qiladilar, ammo javob vaqti vaziyatga qarab farq qilishi mumkin.

Kubernetes hujjatlariga hissa qoʻshish haqida koʻproq maʼlumot olish uchun qarang:

* [Kubernetes hujjatlariga hissangizni qo'shing](https://kubernetes.io/docs/contribute/)
* [Sahifa Kontent Tiplari](https://kubernetes.io/docs/contribute/style/page-content-types/)
* [Hujjatlashtirish Stili yo'riqnomasi](https://kubernetes.io/docs/contribute/style/style-guide/)
* [Kubernetes Hujjatlarini Mahalliylashtirish](https://kubernetes.io/docs/contribute/localization/)

## Yangi hissa qo'shuvchi ambassadorlar
Agar sizga hissa qo‘shayotganda istalgan vaqtda yordam kerak bo‘lsa, [New Contributor Ambassadors](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador) yaxshi aloqa nuqtasidir. Bular SIG Docs ma'qullovchilari bo'lib, ularning mas'uliyatiga yangi hissa qo'shuvchilarga maslahat berish va ularning dastlabki bir nechta so'rovlarini bajarishda yordam berish kiradi. Yangi ishtirokchilar elchilari bilan bog'lanish uchun eng yaxshi joy [Kubernetes Slack](https://slack.k8s.io/) bo'ladi. SIG hujjatlari uchun hozirgi yangi hissa qo'shuvchilar elchilari:


|           To'liq Ismi        |       Slack            | GitHub
|-------------------------------|      -------------------------------|-------------------------------|
|Arsh Sharma | @arsh | @RinkiyaKeDad   

# Файл `README.md` на других языках

|           другие языки        |       другие языки            |
|-------------------------------|-------------------------------|
| [Inglizcha](README.md)       | [Nemischa](README-de.md)      |
| [Vetnamcha](README-vi.md)   | [Polyakcha]( README-pl.md)     |
| [Indonezcha](README-id.md) | [Portugalcha](README-pt.md) |
| [Ispancha](README-es.md)     | [Ukraincha](README-uk.md)    |
| [Italyancha](README-it.md)   | [Fransuzcha](README-fr.md)   |
| [Xitoycha](README-zh.md)     | [Hindcha](README-hi.md)         |
| [Koreyscha](README-ko.md)     | [Yaponcha](README-ja.md)      |

# Odob-axloq qoidalari
Kubernetes hamjamiyatida ishtirok etish [CNCF axloq kodeksi](https://github.com/cncf/foundation/blob/master/code-of-conduct-languages/ru.md) bilan tartibga solinadi.


# Rahmat!
Kubernetes hamjamiyat ishtirok etishida muvaffaqiyat qozonadi va biz sizning veb-saytimizga va hujjatlarimizga qo'shgan hissalaringizni qadrlaymiz!