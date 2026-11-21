---
# reviewers:
# - jlowdermilk
# - justinsb
# - quinton-hoole
title: Bir nechta zonada ishga tushirish
weight: 20
content_type: concept
---

<!-- overview -->

Ushbu sahifa Kubernetesni bir nechta zonada ishga tushirishni tavsiflaydi.

<!-- body -->

## Fon {#background}

Kubernetes shunday moʻljallanganki, bitta Kubernetes klasteri bir nechta nosozlik zonalarida ishlay oladi;
odatda bu zonalar _region_ deb ataladigan mantiqiy guruh ichiga joylashadi. Yirik bulut provayderlari regionni
bir xil imkoniyatlar toʻplamini beradigan nosozlik zonalari (shuningdek, _mavjudlik zonalari_ deb ataladi) toʻplami
sifatida belgilaydi: region ichida har bir zona bir xil API va xizmatlarni taklif qiladi.

Odatiy bulut arxitekturalari bir zonadagi nosozlik boshqa zonadagi xizmatlarga ham putur yetkazishi ehtimolini
kamaytirishga intiladi.

## Boshqaruv tekisligi xatti-harakati {#control-plane-behavior}

Barcha [boshqaruv tekisligi komponentlari](/docs/concepts/architecture/#control-plane-components)
har bir komponent boʻyicha nusxalanadigan, oʻzaro almashtiriladigan resurslar toʻplami sifatida ishlashni qoʻllab-quvvatlaydi.

Klaster boshqaruv tekisligini joylashtirayotganda boshqaruv tekisligi komponentlari nusxalarini
bir nechta nosozlik zonalariga joylashtiring. Agar mavjudlik muhim masala boʻlsa, kamida uchta nosozlik zonasini tanlang
va har bir alohida boshqaruv tekisligi komponentini (API server, scheduler, etcd,
cluster controller manager) kamida uchta nosozlik zonasi boʻylab nusxalang.
Agar cloud controller manager ishga tushirayotgan boʻlsangiz, uni ham
tanlagan barcha nosozlik zonalaringiz boʻylab nusxalashingiz kerak.

{{< note >}}
Kubernetes API server endpointlari uchun zonalararo chidamlilikni taʼminlamaydi.
Klaster API serveri mavjudligini oshirish uchun turli usullardan, jumladan DNS round-robin, SRV yozuvlari yoki
sogʻliqni tekshiradigan uchinchi tomon yuk balanslash yechimidan foydalanishingiz mumkin.
{{< /note >}}

## Tugun xatti-harakati {#node-behavior}

Kubernetes yuklama resurslari (masalan, {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
yoki {{< glossary_tooltip text="StatefulSet" term_id="statefulset" >}}) uchun Podlarni
klasterdagi turli tugunlar boʻylab avtomatik tarqatadi. Bu tarqatish
nosozliklar taʼsirini kamaytirishga yordam beradi.

Tugunlar ishga tushganda har bir tugundagi kubelet Kubernetes APIdagi oʻsha aniq kubeletni ifodalovchi
Node obyektiga avtomatik ravishda {{< glossary_tooltip text="yorliqlar" term_id="label" >}} qoʻshadi.
Bu yorliqlar
[zona maʼlumotini](/docs/reference/labels-annotations-taints/#topologykubernetesiozone) oʻz ichiga olishi mumkin.

Agar klasteringiz bir nechta zona yoki regionni qamrab olsa, nosozlik sohalari — regionlar, zonalar va hatto
aniq tugunlar — boʻylab Podlar qanday tarqalishini boshqarish uchun tugun yorliqlaridan
[Pod topologiyasini tarqatish cheklovlari](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
bilan birga foydalanishingiz mumkin.
Bu koʻrsatmalar
{{< glossary_tooltip text="rejalashtiruvchi" term_id="kube-scheduler" >}}ga Podlarni
kutilayotgan mavjudlik yaxshiroq boʻladigan qilib joylashtirish imkonini beradi va oʻzaro bogʻliq
nosozlik butun yuklamangizga taʼsir qilish xavfini kamaytiradi.

Masalan, imkon qadar StatefulSetning 3 ta nusxasi bir-biridan farqli zonalarda
ishlashini taʼminlash uchun cheklov oʻrnatishingiz mumkin. Buni har bir yuklama uchun qaysi mavjudlik
zonalari ishlatilishini aniq koʻrsatmasdan, deklarativ tarzda belgilashingiz mumkin.

### Tugunlarni zonalar boʻylab taqsimlash {#distributing-nodes-across-zones}

Kubernetes yadrosi siz uchun tugun yaratmaydi; buni oʻzingiz qilishingiz
yoki tugunlarni sizning nomingizdan boshqarish uchun [Cluster API](https://cluster-api.sigs.k8s.io/) kabi vositadan
foydalanishingiz kerak.

Cluster API kabi vositalar yordamida klasteringiz uchun bir nechta nosozlik sohalari boʻylab ishchi tugunlar
sifatida ishlaydigan mashinalar toʻplamini va butun zona xizmati uzilganda klasterni
avtomatik tiklaydigan qoidalarni belgilashingiz mumkin.

## Podlar uchun zonani qoʻlda tayinlash {#manual-zone-assignment-for-pods}

Yaratadigan Podlaringizga, shuningdek Deployment, StatefulSet yoki Job kabi yuklama resurslaridagi
Pod andozalariga [tugun selektori cheklovlarini](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
qoʻllashingiz mumkin.

## Zonalar uchun saqlashga kirish {#storage-access-for-zones}

Doimiy hajmlar yaratilganda Kubernetes aniq zonaga bogʻlangan har qanday PersistentVolume ga
avtomatik ravishda zona yorliqlarini qoʻshadi.
Soʻng {{< glossary_tooltip text="rejalashtiruvchi" term_id="kube-scheduler" >}} oʻzining `NoVolumeZoneConflict` predikati orqali
berilgan PersistentVolume ni talab qiladigan Podlar faqat oʻsha hajm bilan bir xil zonaga
joylashtirilishini taʼminlaydi.

Zona yorliqlarini qoʻshish usuli bulut provayderingizga va foydalanayotgan saqlash taʼminlovchisiga
bogʻliq boʻlishi mumkinligini yodda tuting. Toʻgʻri sozlashni taʼminlash uchun doimo oʻz muhitingiz
hujjatlariga murojaat qiling.

PersistentVolumeClaimlar uchun ushbu sinfdagi saqlash foydalanishi mumkin boʻlgan nosozlik sohalarini (zonalarni)
koʻrsatadigan {{< glossary_tooltip text="StorageClass" term_id="storage-class" >}} ni belgilashingiz mumkin.
Nosozlik sohalari yoki zonalardan xabardor StorageClass ni sozlash haqida oʻrganish uchun
[Ruxsat etilgan topologiyalar](/docs/concepts/storage/storage-classes/#allowed-topologies) sahifasiga qarang.

## Tarmoq {#networking}

Oʻz-oʻzidan Kubernetes zonadan xabardor tarmoqni oʻz ichiga olmaydi. Klaster tarmogʻini sozlash uchun
[tarmoq plaginidan](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
foydalanishingiz mumkin va bu tarmoq yechimida zonaga xos
elementlar boʻlishi mumkin. Masalan, agar bulut provayderingiz
`type=LoadBalancer` li Servicelarni qoʻllab-quvvatlasa, yuk balanslagich trafikni faqat berilgan ulanishni
qayta ishlayotgan yuk balanslagich elementi bilan bir xil zonada ishlayotgan Podlarga yuborishi mumkin.
Tafsilotlar uchun bulut provayderingiz hujjatlarini tekshiring.

Maxsus yoki oʻz infratuzilmasidagi (on-premises) joylashtirishlar uchun ham shunga oʻxshash mulohazalar qoʻllanadi.
{{< glossary_tooltip text="Service" term_id="service" >}} va
{{< glossary_tooltip text="Ingress" term_id="ingress" >}} xatti-harakati, jumladan turli nosozlik zonalarini qanday qayta ishlashi,
klasteringiz aynan qanday oʻrnatilganiga qarab farq qiladi.

## Nosozlikdan tiklash {#fault-recovery}

Klasterni oʻrnatayotganda regiondagi barcha nosozlik zonalari bir vaqtning oʻzida
ishdan chiqsa, oʻrnatishingiz xizmatni tiklay oladimi va qanday tiklashini ham hisobga olishingiz kerak boʻlishi mumkin.
Masalan, zonada Podlarni ishga tushira oladigan kamida bitta tugun borligiga tayanasizmi?
Klaster uchun muhim taʼmirlash ishlari klasteringizda kamida bitta sogʻlom tugun borligiga
tayanmasligiga ishonch hosil qiling. Masalan: agar barcha tugunlar
nosoz boʻlsa, taʼmirlash kamida bitta tugunni xizmatga qaytarishga yetarli darajada yakunlanishi uchun
maxsus {{< glossary_tooltip text="toleratsiya" term_id="toleration" >}} ga ega taʼmirlash Job ini ishga tushirishingiz kerak boʻlishi mumkin.

Kubernetes bu masala uchun tayyor javob bilan kelmaydi; biroq
bu hisobga olish kerak boʻlgan narsadir.

## {{% heading "whatsnext" %}}

Rejalashtiruvchi sozlangan cheklovlarga rioya qilgan holda Podlarni klasterda qanday joylashtirishini oʻrganish uchun
[Rejalashtirish va eviksiya](/docs/concepts/scheduling-eviction/) sahifasiga oʻting.
