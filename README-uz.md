# Kubernetes hujjatlari

[![Netlify Status](https://api.netlify.com/api/v1/badges/be93b718-a6df-402a-b4a4-855ba186c97d/deploy-status)](https://app.netlify.com/sites/kubernetes-io-main-staging/deploys) [![GitHub release](https://img.shields.io/github/release/kubernetes/website.svg)](https://github.com/kubernetes/website/releases/latest)

Ushbu repozitoriy [Kubernetes veb-sayti va hujjatlari](https://kubernetes.io/)ni yigʻish uchun kerak boʻlgan materiallarni oʻz ichiga oladi. Hissa qoʻshmoqchi ekaningizdan xursandmiz.

- [Hujjatlarga hissa qoʻshish](#hujjatlarga-hissa-qoshish)
- [Lokalizatsiya README fayllari](./README.md#localization-readmes)

## Aloqa

Oʻzbekcha lokalizatsiya boʻyicha aloqa uchun:

- Anvarbek Ziyodov — GitHub [@Mr-Perfectuz](https://github.com/Mr-Perfectuz), email `anvarbekdev@gmail.com`

Birinchi lokalizatsiya pull requesti ochilgach, har bir ishtirokchi `kubernetes/org` orqali Kubernetes tashkilotiga aʻzo boʻlishni soʻraydi. Shundan keyin `sig-docs-uz-owners` va `sig-docs-uz-reviews` jamoalari, `content/uz/` dagi `OWNERS` fayli va `language/uz` yorligʻi qoʻshiladi.

## Ushbu repozitoriyidan foydalanish

Veb-saytni mahalliy ravishda [Hugo (kengaytirilgan versiya)](https://gohugo.io/) yordamida yoki konteyner muhitida ishga tushirishingiz mumkin. Jonli sayt bilan bir xil yigʻilish uchun konteyner muhitidan foydalanishni tavsiya qilamiz.

## Talablar

Ushbu repozitoriy bilan ishlash uchun quyidagilar mahalliy oʻrnatilgan boʻlishi kerak:

- [npm](https://www.npmjs.com/)
- [Go](https://go.dev/)
- [Hugo (kengaytirilgan versiya)](https://gohugo.io/)
- Konteyner muhiti, masalan [Docker](https://www.docker.com/).

> [!NOTE]
> [`netlify.toml`](netlify.toml#L11) faylidagi `HUGO_VERSION` muhit oʻzgaruvchisi koʻrsatgan Hugo kengaytirilgan versiyasini oʻrnating.

Boshlashdan oldin bogʻliqliklarni oʻrnating. Repozitoriyni klonlang va katalogga oʻting:

```bash
git clone https://github.com/kubernetes/website.git
cd website
```

Kubernetes veb-sayti [Docsy Hugo mavzusi](https://github.com/google/docsy#readme)dan foydalanadi. U npm orqali oʻrnatiladi. Hugo va Docsy allaqachon ichida boʻlgan tayyor ishlab chiqish konteyneri obrazini ham yuklab olish mumkin. Maʼlumotnoma hujjatlarini yaratadigan vositalar uchun Git submoduli ishlatiladi.

### Windows

```powershell
# submodul bogʻliqliklarini olish
git submodule update --init --recursive --depth 1
```

### Linux / boshqa Unix

```bash
# submodul bogʻliqliklarini olish
make module-init
```

## Veb-saytni konteynerda ishga tushirish

Saytni konteynerda yigʻish uchun quyidagini bajaring:

```bash
# $CONTAINER_ENGINE ga istalgan Docker oʻxshash vosita nomini qoʻyishingiz mumkin

# Butun veb-saytni chiqarish
make container-serve

# Faqat bitta til segmentini chiqarish (masalan, inglizcha)
make container-serve segments=en

# Bir nechta tilni chiqarish (masalan, inglizcha va oʻzbekcha)
make container-serve segments=en,uz
```

**💡 Maslahat:** _Hugo segmentlari_ faqat tanlangan til(lar)ni chiqarib, mahalliy koʻrib chiqish yigʻilishini tezlashtiradi.

Xato koʻrsangiz, odatda Hugo konteyneriga yetarli hisoblash resursi berilmagan boʻladi. Docker dagi ruxsat etilgan CPU va xotira hajmini oshiring ([macOS](https://docs.docker.com/desktop/settings/mac/) va [Windows](https://docs.docker.com/desktop/settings/windows/)).

Veb-saytni koʻrish uchun brauzerda <http://localhost:1313> ni oching. Manba fayllarni oʻzgartirganingizda Hugo saytni yangilaydi va brauzerni qayta yuklaydi.

## Veb-saytni Hugo bilan mahalliy ishga tushirish

Bogʻliqliklarni oʻrnatish, saytni joylashtirish va mahalliy tekshirish uchun:

- macOS va Linux

  ```bash
  npm ci

  # Butun saytni chiqarish (standart)
  make serve

  # Faqat bitta til segmentini chiqarish
  make serve segments=en

  # Bir nechta til segmentini chiqarish
  make serve segments=en,uz
  ```

**💡 Maslahat:** Hugo segmentlari `hugo.toml` da aniqlanadi va faqat tanlangan til(lar)ni chiqarish orqali yigʻishni tezlashtiradi.

- Windows (PowerShell)

  ```powershell
  npm ci
  hugo.exe server --config hugo.toml,hugo.server.toml --buildFuture --environment development
  ```

Bu mahalliy Hugo serverini 1313-portda ishga tushiradi. Veb-saytni koʻrish uchun brauzerda <http://localhost:1313> ni oching. Manba fayllarni oʻzgartirganingizda Hugo saytni yangilaydi va brauzerni qayta yuklaydi.

## API maʼlumotnoma sahifalarini yigʻish

`content/en/docs/reference/kubernetes-api` dagi API maʼlumotnoma sahifalari OpenAPI (Swagger) spetsifikatsiyasidan <https://github.com/kubernetes-sigs/reference-docs/tree/master/gen-resourcesdocs> yordamida yigʻiladi.

Yangi Kubernetes relizi uchun maʼlumotnoma sahifalarini yangilash:

1. `api-ref-generator` submodulini oling:

   ```bash
   git submodule update --init --recursive --depth 1
   ```

2. Swagger spetsifikatsiyasini yangilang:

   ```bash
   curl 'https://raw.githubusercontent.com/kubernetes/kubernetes/master/api/openapi-spec/swagger.json' > api-ref-assets/api/swagger.json
   ```

3. `api-ref-assets/config/` ichidagi `toc.yaml` va `fields.yaml` fayllarini yangi relizdagi oʻzgarishlarga moslang.

4. Sahifalarni yigʻing:

   ```bash
   make api-reference
   ```

   Natijani konteynerdan mahalliy koʻrish:

   ```bash
   make container-serve
   ```

   Brauzerda <http://localhost:1313/docs/reference/kubernetes-api/> manzilini oching.

5. Yangi kontraktning barcha oʻzgarishlari `toc.yaml` va `fields.yaml` ga tushgach, yangi yaratilgan API maʼlumotnoma sahifalari bilan pull request oching.

## Nosozliklarni bartaraf etish

Saytni mahalliy ishga tushirishda muammo boʻlsa, hissa qoʻshish hujjatidagi [Nosozliklarni bartaraf etish](https://kubernetes.io/docs/contribute/new-content/preview-locally/#troubleshooting) boʻlimiga qarang.

## SIG Docs ga qoʻshiling

Kubernetes SIG Docs hamjamiyati va uchrashuvlari haqida [hamjamiyat sahifasi](https://github.com/kubernetes/community/tree/main/sig-docs#meetings)da oʻqing.

Loyiha qoʻllab-quvvatlovchilariga quyidagi joylardan murojaat qilishingiz mumkin:

- [Slack](https://kubernetes.slack.com/messages/sig-docs)
  - [Slack taklifnomasini oling](https://slack.k8s.io/)
- [Pochta roʻyxati](https://groups.google.com/forum/#!forum/kubernetes-sig-docs)

## Hujjatlarga hissa qoʻshish

Ekranning yuqori oʻng burchagidagi **Fork** tugmasini bosib, ushbu repozitoriy nusxasini oʻz GitHub hisobingizda yarating. Bu nusxa _fork_ deb ataladi. Oʻzgartirishlarni forkingizda qiling va ularni yuborishga tayyor boʻlganingizda yangi pull request oching.

Pull request yaratilgach, Kubernetes sharhlovchisi aniq va bajariladigan fikr beradi. Pull request egasi sifatida **sharhlovchi bergan fikr boʻyicha pull requestni oʻzgartirish sizning zimmangizda.**

Bir nechta sharhlovchi fikr berishi mumkin. Baʼzan texnik sharhlovchi ham jalb etiladi. Javob vaqti vaziyatga qarab oʻzgaradi.

Kubernetes hujjatlariga hissa qoʻshish haqida batafsil:

- [Kubernetes hujjatlariga hissa qoʻshish](https://kubernetes.io/docs/contribute/)
- [Sahifa tarkibi turlari](https://kubernetes.io/docs/contribute/style/page-content-types/)
- [Hujjat uslubi qoʻllanmasi](https://kubernetes.io/docs/contribute/style/style-guide/)
- [Kubernetes hujjatlarini lokalizatsiya qilish](https://kubernetes.io/docs/contribute/localization/)
- [Introduction to Kubernetes Docs](https://www.youtube.com/watch?v=pprMgmNzDcw)

### Yangi ishtirokchilar elchilari

Hissa qoʻshish paytida yordam kerak boʻlsa, [yangi ishtirokchilar elchilari](https://kubernetes.io/docs/contribute/advanced/#serve-as-a-new-contributor-ambassador)ga murojaat qiling. Ular SIG Docs tasdiqlovchilari boʻlib, yangi ishtirokchilarga birinchi pull requestlarida yordam beradi. Eng qulay joy — [Kubernetes Slack](https://slack.k8s.io/).

| Ism                        | Slack                      | GitHub                     |
| -------------------------- | -------------------------- | -------------------------- |
| Sreeram Venkitesh          | @sreeram.venkitesh         | @sreeram-venkitesh         |

## Xulq-atvor kodeksi

Kubernetes hamjamiyatidagi ishtirok [CNCF xulq-atvor kodeksi](https://github.com/cncf/foundation/blob/main/code-of-conduct.md) bilan tartibga solinadi.

Oʻzbekcha tarjima alohida pull request bilan [`cncf/foundation`](https://github.com/cncf/foundation/tree/main/code-of-conduct-languages) repozitoriyidagi `code-of-conduct-languages/uz.md` fayliga qoʻshiladi. U qoʻshilguncha inglizcha kodeks amal qiladi.

## Rahmat

Kubernetes hamjamiyat ishtiroki bilan yashaydi. Veb-sayt va hujjatlarga qoʻshgan hissangiz uchun rahmat.
