---
title: Minikube yordamida klaster yaratish
content_type: tutorial
weight: 10
---

## {{% heading "objectives" %}} {#objectives}

* Kubernetes klasteri nima ekanini oʻrganish.
* Minikube nima ekanini oʻrganish.
* Kompyuteringizda Kubernetes klasterini ishga tushirish.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ushbu qoʻllanma `minikube` allaqachon oʻrnatilgan deb hisoblaydi.
Oʻrnatish boʻyicha koʻrsatmalar uchun [minikube start](https://minikube.sigs.k8s.io/docs/start/) sahifasiga qarang.
{{< note >}}
Faqat **step 1: Installation** boʻlimidagi koʻrsatmalarni bajaring. Qolgan qismi ushbu qoʻllanmada yoritiladi.
{{< /note >}}

`kubectl` ni ham oʻrnatishingiz kerak.
Oʻrnatish boʻyicha koʻrsatmalar uchun [Vositalarni oʻrnatish](/docs/tasks/tools/#kubectl) sahifasiga qarang.

Ushbu qoʻllanmadagi shell buyruqlari POSIX shell sintaksisidan foydalanadi. Bu sintaksis
koʻpchilik Linux va macOS tizimlaridagi standart shellʼlarda (masalan, bash, zsh yoki sh) qoʻllab-quvvatlanadi.
Windows foydalanuvchilari buyruqlarni yozilganidek ishga tushirish uchun POSIX bilan mos shellʼdan,
masalan [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
yoki [Git Bash](https://gitforwindows.org/) dan foydalanishlari kerak.
`export`, `$()` va shunga oʻxshash konstruksiyalardan foydalanadigan buyruqlar PowerShell
yoki Windows Command Prompt bilan **mos kelmaydi**.

## Kubernetes klasterlari {#kubernetes-clusters}

{{% alert %}}
_Kubernetes — ilova konteynerlarini kompyuter klasterlari ichida va klasterlararo
joylashtirishni (rejalashtirishni) hamda bajarilishini boshqaradigan, ishlab chiqarish
darajasidagi ochiq manbali platforma._
{{% /alert %}}

**Kubernetes bir-biriga ulangan va yagona birlik sifatida ishlaydigan, yuqori mavjudlikdagi
kompyuterlar klasterini muvofiqlashtiradi.** Kubernetesdagi abstraksiyalar konteynerlashtirilgan
ilovalarni alohida mashinalarga bogʻlab qoʻymasdan klasterga joylashtirish imkonini beradi.
Bu yangi joylashtirish modelidan foydalanish uchun ilovalarni alohida xostlardan ajratadigan
tarzda qadoqlash kerak: ularni konteynerlashtirish lozim. Konteynerlashtirilgan ilovalar
avvalgi joylashtirish modellariga qaraganda moslashuvchanroq va mavjudroq. Oʻsha modellarda
ilovalar xostga chuqur bogʻlangan paketlar sifatida toʻgʻridan-toʻgʻri maʼlum mashinalarga
oʻrnatilardi. **Kubernetes ilova konteynerlarini klaster boʻylab samaraliroq taqsimlaydi va rejalashtiradi.**
Kubernetes ochiq manbali platforma boʻlib, ishlab chiqarishga tayyor.

Kubernetes klasteri ikki turdagi resursdan iborat:

* **Boshqaruv tekisligi** klasterni muvofiqlashtiradi
* **Node**ʼlar ilovalarni ishga tushiradigan ishchi tugunlardir

### Klaster sxemasi {#cluster-diagram}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_01_cluster.svg" style="width: 100%;" >}}

**Boshqaruv tekisligi klasterni boshqarish uchun masʼul.** Boshqaruv tekisligi
klasteringizdagi barcha faoliyatni muvofiqlashtiradi: ilovalarni rejalashtirish, ilovalarning
maqsadli holatini saqlash, ilovalarni masshtablash va yangi yangilanishlarni chiqarish.

{{% alert %}}
_Boshqaruv tekisliklari klasterni va ishlayotgan ilovalarni joylashtirish uchun
ishlatiladigan tugunlarni boshqaradi._
{{% /alert %}}

**Tugun — Kubernetes klasterida ishchi mashina boʻlib xizmat qiladigan virtual mashina
yoki jismoniy kompyuter.** Har bir tugunda Kubelet boʻladi. Kubelet tugunni boshqaradigan
va Kubernetes boshqaruv tekisligi bilan aloqa qiladigan agentdir. Tugunda konteyner
amallarini bajaradigan vositalar ham boʻlishi kerak, masalan {{< glossary_tooltip text="containerd" term_id="containerd" >}}
yoki {{< glossary_tooltip term_id="cri-o" >}}. Keng tarqalgan va qoʻllab-quvvatlanadigan joylashtirish
modelida Kubernetes boshqaruv tekisligi komponentlari alohida boshqaruv tekisligi tugunlarida ishlaydi.

Kubernetesda ilovalarni joylashtirganingizda boshqaruv tekisligiga ilova konteynerlarini
ishga tushirishni buyurasiz. Boshqaruv tekisligi konteynerlarni klaster tugunlarida
ishga tushirishni rejalashtiradi. **Kubelet kabi tugun darajasidagi komponentlar
boshqaruv tekisligi bilan [Kubernetes API](/docs/concepts/overview/kubernetes-api/) orqali
aloqa qiladi.** Bu APIni boshqaruv tekisligi ochadi. Yakuniy foydalanuvchilar ham klaster
bilan ishlash uchun Kubernetes APIʼdan bevosita foydalanishlari mumkin.

Kubernetes klasterini jismoniy yoki virtual mashinalarda joylashtirish mumkin.
Kubernetesʼni oʻrganishni boshlash uchun Minikubeʼdan foydalanishingiz mumkin. Minikube —
mahalliy mashinangizda virtual mashina yaratadigan va faqat bitta tugundan iborat oddiy
klasterni joylashtiradigan yengil Kubernetes amalga oshiruvi. Minikube Linux, macOS
va Windows tizimlarida mavjud. Minikube CLI klasteringiz bilan ishlash uchun asosiy
ishga tushirish amallarini beradi: start, stop, status va delete.

## minikube klasterini yaratish {#create-a-minikube-cluster}

minikube klasterini ishga tushirish uchun:

```shell
minikube start
```

Klaster holatini tekshirish uchun:

```shell
minikube status
```

Birinchi ilovangizni joylashtirish va Kubernetes boshqaruv panelini oʻrganishni oʻz ichiga olgan toʻliq yoʻl-yoʻriq uchun [Hello Minikube](/docs/tutorials/hello-minikube/) qoʻllanmasiga qarang.

## {{% heading "whatsnext" %}} {#what-s-next}

* [Ilovani joylashtirish](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/) qoʻllanmasi.
* [Klaster arxitekturasi](/docs/concepts/architecture/) haqida batafsil.
