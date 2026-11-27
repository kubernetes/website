---
title: Pod va Nodeʼlarni koʻrish
weight: 10
---

## {{% heading "objectives" %}} {#objectives}

* Kubernetes Podʼlari haqida oʻrganish.
* Kubernetes Nodeʼlari haqida oʻrganish.
* Joylashtirilgan ilovalardagi nosozliklarni aniqlash.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ushbu qoʻllanmadagi shell buyruqlari POSIX shell sintaksisidan foydalanadi. Bu sintaksis
koʻpchilik Linux va macOS tizimlaridagi standart shellʼlarda (masalan, bash, zsh yoki sh) qoʻllab-quvvatlanadi.
Windows foydalanuvchilari buyruqlarni yozilganidek ishga tushirish uchun POSIX bilan mos shellʼdan,
masalan [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
yoki [Git Bash](https://gitforwindows.org/) dan foydalanishlari kerak.
`export`, `$()` va shunga oʻxshash konstruksiyalardan foydalanadigan buyruqlar PowerShell
yoki Windows Command Prompt bilan **mos kelmaydi**.


## Kubernetes Podʼlari {#kubernetes-pods}

{{% alert %}}
_Pod — bir yoki bir nechta ilova konteynerlari guruhi (masalan, Docker) boʻlib, ularga
umumiy saqlash (Volumeʼlar), IP manzil va ularni qanday ishga tushirish haqidagi maʼlumot kiradi._
{{% /alert %}}

[2-modul](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)da Deployment yaratganingizda
Kubernetes ilova nusxangizni joylashtirish uchun **Pod** yaratdi. Pod — bir yoki bir nechta
ilova konteynerini (masalan, Docker) va shu konteynerlar uchun baʼzi umumiy resurslarni
ifodalaydigan Kubernetes abstraksiyasi. Bu resurslarga quyidagilar kiradi:

* Volumeʼlar sifatidagi umumiy saqlash
* Noyob klaster IP manzili sifatidagi tarmoq
* Har bir konteynerni qanday ishga tushirish haqidagi maʼlumot, masalan konteyner obrazi
versiyasi yoki ishlatiladigan aniq portlar

Pod ilovaga xos «mantiqiy xost»ni modellaydi va oʻzaro nisbatan zich bogʻlangan turli ilova
konteynerlarini oʻz ichiga olishi mumkin. Masalan, Podʼda ham Node.js ilovangiz joylashgan
konteyner, ham Node.js veb-serveri eʼlon qiladigan maʼlumotni yetkazib beradigan boshqa
konteyner boʻlishi mumkin. Pod ichidagi konteynerlar IP manzil va portlar makonini boʻlishadi,
har doim birga joylashadi va birga rejalashtiriladi hamda bir xil Nodeʼdagi umumiy
kontekstda ishlaydi.

Podʼlar Kubernetes platformasidagi atomar birlikdir. Kubernetesda Deployment yaratganimizda
bu Deployment ichida konteynerlar boʻlgan Podʼlarni yaratadi (konteynerlarni bevosita
yaratish oʻrniga). Har bir Pod u rejalashtirilgan Nodeʼga bogʻlanadi va tugatilgunga qadar
(qayta ishga tushirish siyosatiga koʻra) yoki oʻchirilgunga qadar shu yerda qoladi.
Node nosozligida bir xil Podʼlar klasterdagi boshqa mavjud Nodeʼlarga rejalashtiriladi.

### Podʼlar haqida qisqacha {#pods-overview}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_pods.svg" class="diagram-medium" >}}

{{% alert %}}
_Konteynerlar faqat zich bogʻlangan va disk kabi resurslarni boʻlishishi kerak
boʻlgandagina bitta Podʼda birga rejalashtirilishi lozim._
{{% /alert %}}

## Nodeʼlar {#nodes}

Pod har doim **Node**ʼda ishlaydi. Node — Kubernetesdagi ishchi tugun boʻlib, klasterga qarab
virtual yoki jismoniy mashina boʻlishi mumkin. Har bir Nodeʼni boshqaruv tekisligi boshqaradi.
Bitta Nodeʼda bir nechta Pod boʻlishi mumkin va Kubernetes boshqaruv tekisligi Podʼlarni
klasterdagi Nodeʼlar boʻylab rejalashtirishni avtomatik bajaradi. Boshqaruv tekisligining
avtomatik rejalashtirishi har bir Nodeʼdagi mavjud resurslarni hisobga oladi.

Har bir Kubernetes Nodeʼida kamida quyidagilar ishlaydi:

* Kubelet — Kubernetes boshqaruv tekisligi va Node oʻrtasidagi aloqa uchun masʼul jarayon;
u mashinada ishlayotgan Podʼlar va konteynerlarni boshqaradi.

* Konteyner obrazini registrdan olish, konteynerni ochish va ilovani ishga tushirish uchun
masʼul konteyner runtime (masalan, containerd).

### Nodeʼlar haqida qisqacha {#nodes-overview}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_03_nodes.svg" class="diagram-medium" >}}

## kubectl yordamida nosozliklarni aniqlash {#troubleshooting-with-kubectl}

[2-modul](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)da kubectl buyruqlar
qatori interfeysidan foydalangansiz. 3-modulda ham joylashtirilgan ilovalar va ularning
muhiti haqida maʼlumot olish uchun undan foydalanishda davom etasiz. Eng keng tarqalgan
amallarni quyidagi kubectl quyi buyruqlari bilan bajarish mumkin:

* `kubectl get` - resurslarni roʻyxatlash
* `kubectl describe` - resurs haqida batafsil maʼlumotni koʻrsatish
* `kubectl logs`  - Pod ichidagi konteyner jurnallarini chiqarish
* `kubectl exec` - Pod ichidagi konteynerda buyruq bajarish

Bu buyruqlar yordamida ilovalar qachon joylashtirilganini, ularning joriy holati qandayligini,
qayerda ishlayotganini va konfiguratsiyasi qandayligini koʻrish mumkin.

Klaster komponentlari va buyruqlar qatori haqida koʻproq bilganimizdan soʻng, keling,
ilovamizni oʻrganamiz.

### Ilova konfiguratsiyasini tekshirish {#check-application-configuration}

Oldingi ssenariyda joylashtirgan ilovamiz ishlayotganini tekshiramiz.
`kubectl get` buyrugʻidan foydalanamiz va mavjud Podʼlarni qidiramiz:

```shell
kubectl get pods
```

Agar hech qanday Pod ishlamayotgan boʻlsa, bir necha soniya kuting va Podʼlarni yana roʻyxatlang.
Bitta Pod ishlayotganini koʻrganingizdan soʻng davom etishingiz mumkin.

Keyin, shu Pod ichida qanday konteynerlar borligini va bu konteynerlar qanday obrazlardan
yigʻilganini koʻrish uchun `kubectl describe pods` buyrugʻini ishga tushiramiz:

```shell
kubectl describe pods
```

Bu yerda Pod konteyneri haqida tafsilotlarni koʻramiz: IP manzil, ishlatilgan portlar va
Pod hayotiy sikliga oid hodisalar roʻyxati.

`describe` quyi buyrugʻining chiqishi keng boʻlib, hali tushuntirmagan baʼzi tushunchalarni
ham qamrab oladi, lekin xavotir olmang: ushbu qoʻllanma oxiriga kelib ular tanish boʻlib qoladi.

{{< alert color="info" title="Eslatma" >}}
`describe` quyi buyrugʻidan Node, Pod va Deploymentʼlarni oʻz ichiga olgan koʻpchilik
Kubernetes primitivelari haqida batafsil maʼlumot olish uchun foydalanish mumkin. describe
chiqishi odam oʻqishi uchun moʻljallangan, skriptlarga moslashtirilmagan.
{{< /alert >}}

### Ilovani terminalda koʻrsatish {#show-the-app-in-the-terminal}

Podʼlar ajratilgan, shaxsiy tarmoqda ishlashini eslang. Shuning uchun ularni tuzatish va
ular bilan ishlash uchun ularga proksi orqali kirishimiz kerak. Buning uchun proksini
**ikkinchi terminal**da ishga tushirishga `kubectl proxy` buyrugʻidan foydalanamiz.
Yangi terminal oynasini oching va shu yangi terminalda quyidagini bajaring:

```shell
kubectl proxy
```

Endi yana Pod nomini olamiz va shu Podʼni proksi orqali bevosita soʻraymiz.
Pod nomini olib, uni `POD_NAME` muhit oʻzgaruvchisida saqlash uchun:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo Name of the Pod: $POD_NAME
```

Ilovamiz chiqishini koʻrish uchun `curl` soʻrovini yuboring:

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

URL — Pod APIʼsiga yoʻl.

{{< alert color="info" title="Eslatma" >}}
Konteyner nomini koʻrsatishimiz shart emas, chunki Pod ichida faqat bitta konteyner bor.
{{< /alert >}}

### Konteynerda buyruqlarni bajarish {#executing-commands-on-the-container}

Pod ishga tushib, ishlayotganidan soʻng buyruqlarni toʻgʻridan-toʻgʻri konteynerda bajarishimiz mumkin.
Buning uchun `exec` quyi buyrugʻidan foydalanamiz va Pod nomini parametr sifatida beramiz.
Keling, muhit oʻzgaruvchilarini roʻyxatlaymiz:

```shell
kubectl exec "$POD_NAME" -- env
```

Yana shuni aytish kerak: Podʼda faqat bitta konteyner boʻlgani uchun konteynerning oʻz nomini tushirib qoldirish mumkin.

Keyin Pod konteynerida bash seansini boshlaymiz:

```shell
kubectl exec -ti $POD_NAME -- bash
```

Endi NodeJS ilovamiz ishlayotgan konteynerda ochiq konsolimiz bor.
Ilova manba kodi `server.js` faylida:

```shell
cat server.js
```

Ilova ishlayotganini curl buyrugʻini ishga tushirib tekshirishingiz mumkin:

```shell
curl http://localhost:8080
```

{{< alert color="info" title="Eslatma" >}}
Bu yerda `localhost` dan foydalandik, chunki buyruqni NodeJS Podʼi ichida bajardik.
Agar `localhost:8080` ga ulana olmasangiz, `kubectl exec` buyrugʻini ishga tushirganingizga
va buyruqni Pod ichidan berayotganingizga ishonch hosil qiling.
{{< /alert >}}

Konteyner ulanishini yopish uchun `exit` deb yozing.

## {{% heading "whatsnext" %}} {#what-s-next}

* [Service yordamida ilovani ochish](/docs/tutorials/kubernetes-basics/expose/expose-intro/)
qoʻllanmasi.
* [Pod](/docs/concepts/workloads/pods/)lar haqida batafsil.
* [Node](/docs/concepts/architecture/nodes/)lar haqida batafsil.
