---
# reviewers:
# - sig-cluster-lifecycle
title: Yuqori mavjudlik topologiyasi variantlari
content_type: concept
weight: 50
---

<!-- overview -->

Ushbu sahifa yuqori mavjudlikdagi (HA) Kubernetes klasterlaringiz topologiyasini sozlashning ikki variantini tushuntiradi.

HA klasterini quyidagicha sozlashingiz mumkin:

- Ustma-ust boshqaruv tekisligi tugunlari bilan, bunda etcd tugunlari boshqaruv tekisligi tugunlari bilan birga joylashadi
- Tashqi etcd tugunlari bilan, bunda etcd boshqaruv tekisligidan alohida tugunlarda ishlaydi

HA klasterini sozlashdan oldin har bir topologiyaning afzalliklari va kamchiliklarini diqqat bilan koʻrib chiqishingiz kerak.

{{< note >}}
kubeadm etcd klasterini statik tarzda ishga tushiradi. Batafsil maʼlumot uchun etcd
[klasterlash qoʻllanmasi](https://github.com/etcd-io/etcd/blob/release-3.4/Documentation/op-guide/clustering.md#static)
bilan tanishing.
{{< /note >}}

<!-- body -->

## Ustma-ust etcd topologiyasi {#stacked-etcd-topology}

Ustma-ust HA klasteri — bu [topologiya](https://en.wikipedia.org/wiki/Network_topology) boʻlib, unda etcd taqdim etadigan taqsimlangan
maʼlumotlar saqlash klasteri kubeadm boshqaradigan va boshqaruv tekisligi komponentlarini ishga tushiradigan tugunlar tashkil etgan klaster ustiga joylashtiriladi.

Har bir boshqaruv tekisligi tuguni `kube-apiserver`, `kube-scheduler` va `kube-controller-manager` nusxasini ishga tushiradi.
`kube-apiserver` ishchi tugunlarga yuk muvozanatlagich orqali ochiladi.

Har bir boshqaruv tekisligi tuguni mahalliy etcd aʼzosini yaratadi va bu etcd aʼzosi faqat
shu tugundagi `kube-apiserver` bilan aloqa qiladi. Xuddi shu hol mahalliy `kube-controller-manager`
va `kube-scheduler` nusxalariga ham taalluqlidir.

Bu topologiya boshqaruv tekisliklari va etcd aʼzolarini bir xil tugunlarda bogʻlaydi. Uni tashqi etcd tugunlariga ega
klasterga qaraganda sozlash osonroq va replikatsiya uchun boshqarish ham osonroq.

Biroq ustma-ust klaster birga ishdan chiqish xavfini olib yuradi. Agar bitta tugun ishdan chiqsa, etcd aʼzosi ham, boshqaruv
tekisligi nusxasi ham yoʻqoladi va zaxiraviylik buziladi. Bu xavfni koʻproq boshqaruv tekisligi tugunlarini qoʻshish orqali kamaytirishingiz mumkin.

Shuning uchun HA klasteri uchun kamida uchta ustma-ust boshqaruv tekisligi tugunini ishga tushirishingiz kerak.

Bu kubeadmdagi standart topologiya. `kubeadm init` va `kubeadm join --control-plane` dan foydalanilganda
boshqaruv tekisligi tugunlarida mahalliy etcd aʼzosi avtomatik yaratiladi.

![Ustma-ust etcd topologiyasi](/images/kubeadm/kubeadm-ha-topology-stacked-etcd.svg)

## Tashqi etcd topologiyasi {#external-etcd-topology}

Tashqi etcd ga ega HA klasteri — bu [topologiya](https://en.wikipedia.org/wiki/Network_topology)
boʻlib, unda etcd taqdim etadigan taqsimlangan maʼlumotlar saqlash klasteri boshqaruv tekisligi komponentlarini ishga tushiradigan
tugunlar tashkil etgan klasterdan tashqarida joylashadi.

Ustma-ust etcd topologiyasidagi kabi, tashqi etcd topologiyasida ham har bir boshqaruv tekisligi tuguni
`kube-apiserver`, `kube-scheduler` va `kube-controller-manager` nusxasini ishga tushiradi.
`kube-apiserver` esa ishchi tugunlarga yuk muvozanatlagich orqali ochiladi. Biroq
etcd aʼzolari alohida xostlarda ishlaydi va har bir etcd xosti har bir boshqaruv tekisligi tugunidagi
`kube-apiserver` bilan aloqa qiladi.

Bu topologiya boshqaruv tekisligi va etcd aʼzosini ajratadi. Shuning uchun u shunday HA sozlamasini beradiki,
unda boshqaruv tekisligi nusxasi yoki etcd aʼzosini yoʻqotish kamroq taʼsir qiladi va klaster zaxiraviyligiga
ustma-ust HA topologiyasidagidek kuchli taʼsir qilmaydi.

Biroq bu topologiya ustma-ust HA topologiyasiga qaraganda ikki baravar koʻp xost talab qiladi.
Ushbu topologiyadagi HA klasteri uchun boshqaruv tekisligi tugunlari uchun kamida uchta xost va etcd tugunlari uchun uchta xost
talab qilinadi.

![Tashqi etcd topologiyasi](/images/kubeadm/kubeadm-ha-topology-external-etcd.svg)

## {{% heading "whatsnext" %}} {#what-s-next}

- [kubeadm yordamida yuqori mavjudlikdagi klaster sozlash](/docs/setup/production-environment/tools/kubeadm/high-availability/)
