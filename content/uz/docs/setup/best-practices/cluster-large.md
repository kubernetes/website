---
# reviewers:
# - davidopp
# - lavalamp
title: Katta klasterlar uchun mulohazalar
weight: 10
---

Klaster — bu {{< glossary_tooltip text="boshqaruv tekisligi" term_id="control-plane" >}} tomonidan boshqariladigan,
Kubernetes agentlarini ishga tushiradigan {{< glossary_tooltip text="tugunlar" term_id="node" >}} (jismoniy
yoki virtual mashinalar) toʻplamidir.
Kubernetes {{< param "version" >}} 5,000 tagacha tugunga ega klasterlarni qoʻllab-quvvatlaydi. Aniqroq aytganda,
Kubernetes quyidagi mezonlarning *barchasiga* javob beradigan konfiguratsiyalarni sigʻdirish uchun moʻljallangan:

* Har bir tugunda 110 tadan ortiq boʻlmagan Pod
* 5,000 tadan ortiq boʻlmagan tugun
* Jami 150,000 tadan ortiq boʻlmagan Pod
* Jami 300,000 tadan ortiq boʻlmagan konteyner

Klasteringizni tugun qoʻshish yoki olib tashlash orqali masshtablashingiz mumkin. Buni qanday qilish
klasteringiz qanday joylashtirilganiga bogʻliq.

## Bulut provayderi resurs kvotalari {#quota-issues}

Koʻp tugunli klaster yaratishda bulut provayderi kvotasi muammolariga duch kelmaslik uchun
quyidagilarni hisobga oling:
* Quyidagi kabi bulut resurslari uchun kvotani oshirishni soʻrash:
    * Kompyuter nusxalari
    * CPUlar
    * Saqlash hajmlari
    * Foydalanilayotgan IP manzillar
    * Paket filtrlash qoidalari toʻplamlari
    * Yuk balanslagichlar soni
    * Tarmoq subnetlari
    * Jurnal oqimlari
* Yangi tugunlarni guruhma-guruh, guruhlar orasida pauza bilan ishga tushirish uchun klasterni masshtablash amallarini cheklang, chunki baʼzi bulut provayderlari yangi nusxalar yaratish tezligini cheklaydi.

## Boshqaruv tekisligi komponentlari {#control-plane-components}

Katta klaster uchun yetarli hisoblash quvvati va boshqa
resurslarga ega boshqaruv tekisligi kerak.

Odatda har bir nosozlik zonasida boshqaruv tekisligining bir yoki ikkita nusxasini ishga tushirasiz:
avval bu nusxalarni vertikal masshtablaysiz, soʻngra vertikal masshtabning samarasi pasayadigan nuqtaga yetgach,
gorizontal masshtablaysiz.

Nosozlikka chidamlilikni taʼminlash uchun har bir nosozlik zonasida kamida bitta nusxani ishga tushirishingiz kerak. Kubernetes
tugunlari trafikni avtomatik ravishda ayni nosozlik zonasidagi boshqaruv tekisligi endpointlariga yoʻnaltirmaydi; biroq bulut
provayderingizda buni qiladigan oʻz mexanizmlari boʻlishi mumkin.

Masalan, boshqariladigan yuk balanslagichdan foydalanib, yuk balanslagichni _A_ nosozlik zonasidagi kubelet va Podlardan
keladigan trafikni faqat yana _A_ zonasidagi boshqaruv tekisligi xostlariga yuborishga sozlaysiz. Agar _A_ nosozlik zonasidagi bitta boshqaruv tekisligi
xosti yoki endpointi ishdan chiqsa, bu _A_ zonasidagi tugunlar uchun barcha boshqaruv tekisligi
trafigi endi zonalar orasida yuborilayotganini anglatadi. Har bir zonada bir nechta boshqaruv tekisligi hostini ishga tushirish
bunday natijani kamroq ehtimolli qiladi.

### etcd xotirasi {#etcd-storage}

Katta klasterlar unumdorligini oshirish uchun Event obyektlarini alohida,
maxsus etcd nusxasida saqlashingiz mumkin.

Klaster yaratishda (maxsus vositalar yordamida) quyidagilarni qilishingiz mumkin:

* qoʻshimcha etcd nusxasini ishga tushirish va sozlash
* hodisalarni saqlash uchun {{< glossary_tooltip term_id="kube-apiserver" text="API serveri" >}}ni undan foydalanishga sozlash

Katta klaster uchun etcd ni sozlash va boshqarish tafsilotlari uchun
[Kubernetes uchun etcd klasterlarini yuritish](/docs/tasks/administer-cluster/configure-upgrade-etcd/) va
[kubeadm bilan yuqori mavjudlikdagi etcd klasterini oʻrnatish](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
sahifalariga qarang.

## Qoʻshimcha resurslar {#addon-resources}

Kubernetes [resurs cheklovlari](/docs/concepts/configuration/manage-resources-containers/)
xotira sizib chiqishi hamda Pod va konteynerlarning boshqa komponentlarga taʼsir qilishining
boshqa usullari taʼsirini kamaytirishga yordam beradi. Bu resurs cheklovlari ilova yuklamalariga
qoʻllanganidek, {{< glossary_tooltip text="qoʻshimcha" term_id="addons" >}} resurslariga ham qoʻllanadi.

Masalan, jurnal yozish komponenti uchun CPU va xotira cheklovlarini oʻrnatishingiz mumkin:

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Qoʻshimchalarning standart cheklovlari odatda har bir qoʻshimchani kichik yoki oʻrtacha Kubernetes
klasterlarida ishga tushirish tajribasidan toʻplangan maʼlumotlarga asoslanadi. Katta
klasterlarda ishga tushirilganda qoʻshimchalar koʻpincha baʼzi resurslarni standart cheklovlaridan koʻra koʻproq
isteʼmol qiladi.
Agar katta klaster bu qiymatlar moslashtirilmasdan joylashtirilsa, qoʻshimcha(lar)
xotira chekloviga urilavergani uchun uzluksiz toʻxtatib qoʻyilishi mumkin.
Shu bilan birga, qoʻshimcha ishlashi mumkin, lekin CPU vaqt
boʻlagi cheklovlari tufayli unumdorligi past boʻladi.

Koʻp tugunli klaster yaratishda klaster qoʻshimchalari resurslari muammolariga duch kelmaslik uchun
quyidagilarni hisobga oling:

* Baʼzi qoʻshimchalar vertikal masshtablanadi — klaster uchun yoki butun nosozlik zonasiga xizmat
  qiladigan qoʻshimchaning bitta nusxasi boʻladi. Bunday qoʻshimchalar uchun klasteringizni kengaytirganingizda
  soʻrovlar va cheklovlarni oshiring.
* Koʻp qoʻshimchalar gorizontal masshtablanadi — koʻproq Pod ishga tushirish orqali quvvat qoʻshasiz — lekin
  juda katta klasterda CPU yoki xotira cheklovlarini biroz oshirishingiz ham kerak boʻlishi mumkin.
  [Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) soʻrovlar va cheklovlar uchun tavsiya etilgan
  raqamlarni berish uchun _recommender_ rejimida ishlashi mumkin.
* Baʼzi qoʻshimchalar har bir tugunda bitta nusxa sifatida, {{< glossary_tooltip text="DaemonSet"
  term_id="daemonset" >}} tomonidan boshqarilgan holda ishlaydi: masalan, tugun darajasidagi jurnal agregatori. Gorizontal
  masshtablanadigan qoʻshimchalar holatiga oʻxshab, CPU yoki xotira
  cheklovlarini biroz oshirishingiz ham kerak boʻlishi mumkin.

## Klaster uchun muhim komponentlarni ustuvor qilish {#prioritizing-cluster-essential-components}

Klaster uchun muhim komponentlar (masalan, CoreDNS, metrics-server va boshqa muhim qoʻshimchalar) boshqa yuklamalardan oldin rejalashtirilishi va pastroq ustuvorlikdagi Podlar tomonidan siqib chiqarilmasligi uchun ularni tizim [PriorityClass](/docs/concepts/scheduling-eviction/pod-priority-preemption/) bilan, masalan `system-cluster-critical` yoki `system-node-critical` bilan ishga tushiring.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler` — Podlar uchun resurs soʻrovlari va cheklovlarini boshqarishga yordam berish uchun
klasteringizga joylashtirishingiz mumkin boʻlgan maxsus resursdir.
[Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme)
haqida koʻproq oʻqing va undan klaster
komponentlarini, jumladan klaster uchun muhim qoʻshimchalarni masshtablashda qanday foydalanish mumkinligini bilib oling.

* [Tugunlarni avtomatik masshtablash](/docs/concepts/cluster-administration/node-autoscaling/) haqida oʻqing

* [addon resizer](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme)
klasteringiz masshtabi oʻzgarganda qoʻshimchalar oʻlchamini avtomatik ravishda oʻzgartirishga yordam beradi.
