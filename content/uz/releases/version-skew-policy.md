---
# reviewers:
# - sig-api-machinery
# - sig-architecture
# - sig-cli
# - sig-cluster-lifecycle
# - sig-node
# - sig-release
title: Versiya farqi siyosati
type: docs
description: >
  Turli Kubernetes komponentlari oʻrtasida qoʻllab-quvvatlanadigan eng katta versiya farqi.
---

<!-- overview -->
Ushbu hujjat turli Kubernetes komponentlari oʻrtasida qoʻllab-quvvatlanadigan eng katta versiya farqini tavsiflaydi.
Ayrim klaster joylashtirish vositalari versiya farqiga qoʻshimcha cheklovlar qoʻyishi mumkin.

<!-- body -->

## Qoʻllab-quvvatlanadigan versiyalar {#supported-versions}

Kubernetes versiyalari **x.y.z** koʻrinishida ifodalanadi: bu yerda **x** — katta versiya,
**y** — kichik versiya, **z** esa patch versiya. Bu
[semantik versiyalash](https://semver.org/) terminologiyasiga mos keladi. Batafsil maʼlumot uchun
[Kubernetes relizlarini versiyalash](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning)ga qarang.

Kubernetes loyihasi eng soʻnggi uchta kichik reliz uchun reliz tarmoqlarini saqlaydi
({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}}).
Kubernetes 1.19 va undan yangi versiyalar [taxminan 1 yil patch qoʻllab-quvvatlash](/releases/patch-releases/#support-period) oladi.
Kubernetes 1.18 va undan eski versiyalar taxminan 9 oy patch qoʻllab-quvvatlash olgan.

Qoʻllaniladigan tuzatishlar, shu jumladan xavfsizlik tuzatishlari, jiddiylik va amalga oshirish imkoniyatiga qarab, oʻsha uchta reliz tarmogʻiga orqaga koʻchirilishi mumkin.
Patch-relizlar shu tarmoqlardan
[muntazam davriylik](/releases/patch-releases/#cadence) bilan, zarur boʻlganda esa qoʻshimcha shoshilinch relizlar bilan chiqariladi.

Bu qaror [reliz menejerlari](/releases/release-managers/) guruhiga tegishli.

Batafsil maʼlumot uchun Kubernetes [patch-relizlar](/releases/patch-releases/) sahifasiga qarang.

## Qoʻllab-quvvatlanadigan versiya farqi {#supported-version-skew}

### kube-apiserver

[Yuqori mavjudlikli (HA) klasterlar](/docs/setup/production-environment/tools/kubeadm/high-availability/)da
eng yangi va eng eski `kube-apiserver` nusxalari bir kichik versiya doirasida boʻlishi kerak.

Misol:

* eng yangi `kube-apiserver` **{{< skew currentVersion >}}** da
* boshqa `kube-apiserver` nusxalari **{{< skew currentVersion >}}** va **{{< skew currentVersionAddMinor -1 >}}** da qoʻllab-quvvatlanadi

### kubelet

* `kubelet` `kube-apiserver`dan yangi boʻlmasligi kerak.
* `kubelet` `kube-apiserver`dan uchtagacha kichik versiya eskiroq boʻlishi mumkin (`kubelet` < 1.25 `kube-apiserver`dan faqat ikkitagacha kichik versiya eskiroq boʻlishi mumkin).

Misol:

* `kube-apiserver` **{{< skew currentVersion >}}** da
* `kubelet` **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}** va **{{< skew currentVersionAddMinor -3 >}}** da qoʻllab-quvvatlanadi

{{< note >}}
Agar HA klasterdagi `kube-apiserver` nusxalari oʻrtasida versiya farqi boʻlsa, bu ruxsat etilgan `kubelet` versiyalarini toraytiradi.
{{</ note >}}

Misol:

* `kube-apiserver` nusxalari **{{< skew currentVersion >}}** va **{{< skew currentVersionAddMinor -1 >}}** da
* `kubelet` **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**
  va **{{< skew currentVersionAddMinor -3 >}}** da qoʻllab-quvvatlanadi (**{{< skew currentVersion >}}** qoʻllab-quvvatlanmaydi, chunki bu
  **{{< skew currentVersionAddMinor -1 >}}** versiyasidagi `kube-apiserver` nusxasidan yangi boʻlardi)

### kube-proxy

* `kube-proxy` `kube-apiserver`dan yangi boʻlmasligi kerak.
* `kube-proxy` `kube-apiserver`dan uchtagacha kichik versiya eskiroq boʻlishi mumkin
  (`kube-proxy` < 1.25 `kube-apiserver`dan faqat ikkitagacha kichik versiya eskiroq boʻlishi mumkin).
* `kube-proxy` u bilan birga ishlaydigan `kubelet` nusxasidan uchtagacha kichik versiya eskiroq yoki yangiroq
  boʻlishi mumkin (`kube-proxy` < 1.25 u bilan birga ishlaydigan `kubelet` nusxasidan faqat ikkitagacha kichik versiya eskiroq yoki yangiroq
  boʻlishi mumkin).

Misol:

* `kube-apiserver` **{{< skew currentVersion >}}** da
* `kube-proxy` **{{< skew currentVersion >}}**, **{{< skew currentVersionAddMinor -1 >}}**,
  **{{< skew currentVersionAddMinor -2 >}}** va **{{< skew currentVersionAddMinor -3 >}}** da qoʻllab-quvvatlanadi

{{< note >}}
Agar HA klasterdagi `kube-apiserver` nusxalari oʻrtasida versiya farqi boʻlsa, bu ruxsat etilgan `kube-proxy` versiyalarini toraytiradi.
{{</ note >}}

Misol:

* `kube-apiserver` nusxalari **{{< skew currentVersion >}}** va **{{< skew currentVersionAddMinor -1 >}}** da
* `kube-proxy` **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**
  va **{{< skew currentVersionAddMinor -3 >}}** da qoʻllab-quvvatlanadi (**{{< skew currentVersion >}}** qoʻllab-quvvatlanmaydi, chunki bu
  **{{< skew currentVersionAddMinor -1 >}}** versiyasidagi `kube-apiserver` nusxasidan yangi boʻlardi)

### kube-controller-manager, kube-scheduler va cloud-controller-manager {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager}

`kube-controller-manager`, `kube-scheduler` va `cloud-controller-manager` oʻzlari aloqa qiladigan
`kube-apiserver` nusxalaridan yangi boʻlmasligi kerak. Ularning `kube-apiserver` kichik versiyasiga mos kelishi kutiladi,
biroq ishlab turgan holda yangilashga imkon berish uchun bir kichik versiyagacha eskiroq boʻlishi mumkin.

Misol:

* `kube-apiserver` **{{< skew currentVersion >}}** da
* `kube-controller-manager`, `kube-scheduler` va `cloud-controller-manager`
  **{{< skew currentVersion >}}** va **{{< skew currentVersionAddMinor -1 >}}** da qoʻllab-quvvatlanadi

{{< note >}}
Agar HA klasterdagi `kube-apiserver` nusxalari oʻrtasida versiya farqi boʻlsa va bu komponentlar
klasterdagi istalgan `kube-apiserver` nusxasi bilan aloqa qila olsa (masalan, yuk balanslagichi orqali),
bu komponentlarning ruxsat etilgan versiyalari torayadi.
{{< /note >}}

Misol:

* `kube-apiserver` nusxalari **{{< skew currentVersion >}}** va **{{< skew currentVersionAddMinor -1 >}}** da
* `kube-controller-manager`, `kube-scheduler` va `cloud-controller-manager` istalgan `kube-apiserver` nusxasiga
  yoʻnaltira oladigan yuk balanslagichi bilan aloqa qiladi
* `kube-controller-manager`, `kube-scheduler` va `cloud-controller-manager`
  **{{< skew currentVersionAddMinor -1 >}}** da qoʻllab-quvvatlanadi (**{{< skew currentVersion >}}** qoʻllab-quvvatlanmaydi,
  chunki bu **{{< skew currentVersionAddMinor -1 >}}** versiyasidagi `kube-apiserver` nusxasidan yangi boʻlardi)

### kubectl

`kubectl` `kube-apiserver`dan bir kichik versiya doirasida (eskiroq yoki yangiroq) qoʻllab-quvvatlanadi.

Misol:

* `kube-apiserver` **{{< skew currentVersion >}}** da
* `kubectl` **{{< skew currentVersionAddMinor 1 >}}**, **{{< skew currentVersion >}}**
  va **{{< skew currentVersionAddMinor -1 >}}** da qoʻllab-quvvatlanadi

{{< note >}}
Agar HA klasterdagi `kube-apiserver` nusxalari oʻrtasida versiya farqi boʻlsa, bu qoʻllab-quvvatlanadigan `kubectl` versiyalarini toraytiradi.
{{< /note >}}

Misol:

* `kube-apiserver` nusxalari **{{< skew currentVersion >}}** va **{{< skew currentVersionAddMinor -1 >}}** da
* `kubectl` **{{< skew currentVersion >}}** va **{{< skew currentVersionAddMinor -1 >}}** da qoʻllab-quvvatlanadi
  (boshqa versiyalar `kube-apiserver` komponentlaridan biriga nisbatan bir kichik versiyadan ortiq farq qilgan boʻlardi)

## Qoʻllab-quvvatlanadigan komponentlarni yangilash tartibi {#supported-component-upgrade-order}

Komponentlar oʻrtasidagi qoʻllab-quvvatlanadigan versiya farqi komponentlarni qaysi tartibda
yangilash kerakligiga taʼsir qiladi. Ushbu boʻlim mavjud klasterni
**{{< skew currentVersionAddMinor -1 >}}** versiyasidan **{{< skew currentVersion >}}** versiyasiga
oʻtkazish uchun komponentlarni qaysi tartibda yangilash kerakligini tavsiflaydi.

Ixtiyoriy ravishda, yangilashga tayyorgarlik koʻrishda Kubernetes loyihasi yangilash paytida imkon qadar koʻproq regressiya va xato tuzatishlaridan foyda olish uchun quyidagilarni bajarishni tavsiya qiladi:

* Komponentlar joriy kichik versiyangizning eng soʻnggi patch versiyasida ekaniga ishonch hosil qiling.
* Komponentlarni maqsadli kichik versiyaning eng soʻnggi patch versiyasiga yangilang.

Masalan, agar siz {{<skew currentVersionAddMinor -1>}} versiyasida ishlayotgan boʻlsangiz,
eng soʻnggi patch versiyada ekaningizga ishonch hosil qiling. Soʻng {{<skew currentVersion>}} ning eng
soʻnggi patch versiyasiga yangilang.

### kube-apiserver

Old shartlar:

* Bitta nusxali klasterda mavjud `kube-apiserver` nusxasi **{{< skew currentVersionAddMinor -1 >}}**
* HA klasterda barcha `kube-apiserver` nusxalari **{{< skew currentVersionAddMinor -1 >}}** yoki
  **{{< skew currentVersion >}}** da (bu eng eski va eng yangi `kube-apiserver` nusxasi oʻrtasida eng koʻpi bilan 1 kichik versiya farqini taʼminlaydi)
* Ushbu server bilan aloqa qiladigan `kube-controller-manager`, `kube-scheduler` va `cloud-controller-manager` nusxalari
  **{{< skew currentVersionAddMinor -1 >}}** versiyasida
  (bu ular mavjud API server versiyasidan yangi emasligini va yangi API server versiyasidan 1 kichik versiya doirasida ekanini taʼminlaydi)
* Barcha tugunlardagi `kubelet` nusxalari **{{< skew currentVersionAddMinor -1 >}}** yoki **{{< skew currentVersionAddMinor -2 >}}** versiyasida
  (bu ular mavjud API server versiyasidan yangi emasligini va yangi API server versiyasidan 2 kichik versiya doirasida ekanini taʼminlaydi)
* Roʻyxatdan oʻtgan admission webhooklari yangi `kube-apiserver` nusxasi ularga yuboradigan maʼlumotlarni qayta ishlay oladi:
  * `ValidatingWebhookConfiguration` va `MutatingWebhookConfiguration` obyektlari
    **{{< skew currentVersion >}}** da qoʻshilgan REST resurslarining har qanday yangi versiyalarini oʻz ichiga oladigan qilib yangilangan
    (yoki v1.15+ da mavjud [`matchPolicy: Equivalent` parametri](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)dan foydalaniladi)
  * Webhooklar ularga yuboriladigan REST resurslarining har qanday yangi versiyalarini
    va **{{< skew currentVersion >}}** dagi mavjud versiyalarga qoʻshilgan har qanday yangi maydonlarni qayta ishlay oladi

`kube-apiserver`ni **{{< skew currentVersion >}}** ga yangilang

{{< note >}}
[API eskirishi](/docs/reference/using-api/deprecation-policy/) va
[API oʻzgarishlari boʻyicha qoʻllanma](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-architecture/api_changes.md)
loyiha siyosatlari `kube-apiserver`dan yangilashda, hatto bitta nusxali klasterlarda ham, kichik versiyalarni tashlab oʻtmaslikni talab qiladi.
{{< /note >}}

### kube-controller-manager, kube-scheduler va cloud-controller-manager {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager-1}

Old shartlar:

* Bu komponentlar aloqa qiladigan `kube-apiserver` nusxalari **{{< skew currentVersion >}}** da
  (ushbu boshqaruv tekisligi komponentlari klasterdagi istalgan `kube-apiserver`
  nusxasi bilan aloqa qila oladigan HA klasterlarda bu komponentlarni yangilashdan oldin barcha `kube-apiserver` nusxalari yangilangan boʻlishi kerak)

`kube-controller-manager`, `kube-scheduler` va
`cloud-controller-manager`ni **{{< skew currentVersion >}}** ga yangilang. `kube-controller-manager`, `kube-scheduler` va
`cloud-controller-manager` oʻrtasida majburiy yangilash tartibi yoʻq. Bu komponentlarni istalgan tartibda
yoki hatto bir vaqtda yangilashingiz mumkin.

### kubelet

Old shartlar:

* `kubelet` aloqa qiladigan `kube-apiserver` nusxalari **{{< skew currentVersion >}}** da

`kubelet` nusxalarini ixtiyoriy ravishda **{{< skew currentVersion >}}** ga yangilang (yoki ularni
**{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}** yoki **{{< skew currentVersionAddMinor -3 >}}** da qoldirish mumkin)

{{< note >}}
Kichik versiya `kubelet` yangilanishini bajarishdan oldin ushbu tugundan podlarni [boʻshating](/docs/tasks/administer-cluster/safely-drain-node/).
Joyida kichik versiya `kubelet` yangilanishlari qoʻllab-quvvatlanmaydi.
{{</ note >}}

{{< warning >}}
`kube-apiserver`dan doimiy ravishda uchta kichik versiya ortda qolgan `kubelet` nusxalari bilan
klaster ishlatish ularni boshqaruv tekisligi yangilanishidan oldin yangilash kerakligini anglatadi.
{{</ warning >}}

### kube-proxy

Old shartlar:

* `kube-proxy` aloqa qiladigan `kube-apiserver` nusxalari **{{< skew currentVersion >}}** da

`kube-proxy` nusxalarini ixtiyoriy ravishda **{{< skew currentVersion >}}** ga
yangilang (yoki ularni **{{< skew currentVersionAddMinor -1 >}}**, **{{< skew currentVersionAddMinor -2 >}}**
yoki **{{< skew currentVersionAddMinor -3 >}}** da qoldirish mumkin)

{{< warning >}}
`kube-apiserver`dan doimiy ravishda uchta kichik versiya ortda qolgan `kube-proxy` nusxalari bilan
klaster ishlatish ularni boshqaruv tekisligi yangilanishidan oldin yangilash kerakligini anglatadi.
{{</ warning >}}
