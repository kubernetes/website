---
title: Ilovangizning bir nechta nusxasini ishga tushirish
weight: 10
---

## {{% heading "objectives" %}} {#objectives}

* Mavjud ilovani kubectl yordamida qoʻlda masshtablash.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ushbu qoʻllanmadagi shell buyruqlari POSIX shell sintaksisidan foydalanadi. Bu sintaksis
koʻpchilik Linux va macOS tizimlaridagi standart shellʼlarda (masalan, bash, zsh yoki sh) qoʻllab-quvvatlanadi.
Windows foydalanuvchilari buyruqlarni yozilganidek ishga tushirish uchun POSIX bilan mos shellʼdan,
masalan [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
yoki [Git Bash](https://gitforwindows.org/) dan foydalanishlari kerak.
`export`, `$()` va shunga oʻxshash konstruksiyalardan foydalanadigan buyruqlar PowerShell
yoki Windows Command Prompt bilan **mos kelmaydi**.



## Ilovani masshtablash {#scaling-an-application}

{{% alert %}}
_kubectl create deployment buyrugʻining --replicas parametri yordamida boshidanoq
bir nechta nusxali Deployment yaratishingiz mumkin._
{{% /alert %}}

Avval [Deployment](/docs/concepts/workloads/controllers/deployment/) yaratdik, soʻng uni
[Service](/docs/concepts/services-networking/service/) orqali ommaga ochdik.
Deployment ilovamizni ishga tushirish uchun faqat bitta Pod yaratdi. Trafik oshganda,
foydalanuvchi talabiga ulgurish uchun ilovani masshtablashimiz kerak boʻladi.

Agar oldingi boʻlimlarni bajarmagan boʻlsangiz,
[Minikube yordamida klaster yaratish](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/)
dan boshlang.

_Masshtablash_ Deploymentʼdagi nusxalar sonini oʻzgartirish orqali bajariladi.

{{< alert color="info" title="Eslatma" >}}
Agar buni
[oldingi boʻlim](/docs/tutorials/kubernetes-basics/expose/expose-intro/)dan keyin sinayotgan boʻlsangiz,
yaratgan Serviceʼingizni oʻchirgan yoki `type: NodePort` turidagi Service yaratgan boʻlishingiz mumkin.
Ushbu boʻlimda kubernetes-bootcamp Deploymentʼi uchun `type: LoadBalancer` turidagi Service yaratilgan deb hisoblanadi.

Agar [oldingi boʻlim](/docs/tutorials/kubernetes-basics/expose/expose-intro/)da yaratilgan
Serviceʼni oʻchirmagan boʻlsangiz, avval oʻsha Serviceʼni oʻchiring, soʻng `type` qiymati
`LoadBalancer` boʻlgan yangi Service yaratish uchun quyidagi buyruqni bajaring:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="LoadBalancer" --port 8080
```
{{< /alert >}}

## Masshtablash haqida qisqacha {#scaling-overview}

<!-- animation -->
{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_05_scaling2.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
_Masshtablash Deploymentʼdagi nusxalar sonini oʻzgartirish orqali bajariladi._
{{% /alert %}}

Deploymentʼni kengaytirish yangi Podʼlar yaratilishi va ular mavjud resurslari bor
Nodeʼlarga rejalashtirilishini taʼminlaydi. Masshtablash Podʼlar sonini yangi maqsadli
holatgacha oshiradi. Kubernetes Podʼlarni [avtomatik masshtablash](/docs/concepts/workloads/autoscaling/)ni
ham qoʻllab-quvvatlaydi, lekin bu ushbu qoʻllanma doirasidan tashqarida. Nolga masshtablash
ham mumkin va u koʻrsatilgan Deploymentʼning barcha Podʼlarini tugatadi.

Ilovaning bir nechta nusxasini ishga tushirish trafikni ularning barchasiga taqsimlash
yoʻlini talab qiladi. Serviceʼlarda ochilgan Deploymentʼning barcha Podʼlariga tarmoq
trafikini taqsimlaydigan oʻrnatilgan yuk taqsimlovchi bor. Serviceʼlar trafik faqat
mavjud Podʼlarga yuborilishini taʼminlash uchun ishlayotgan Podʼlarni endpointʼlar
yordamida uzluksiz kuzatib boradi.

Ilovaning bir nechta nusxasi ishlayotganidan soʻng, toʻxtovsiz ketma-ket yangilashni
bajara olasiz. Buni qoʻllanmaning keyingi boʻlimida koʻrib chiqamiz. Endi terminalga
oʻtib, ilovamizni masshtablaymiz.

### Deploymentʼni masshtablash {#scaling-a-deployment}

Deploymentʼlaringizni roʻyxatlash uchun `get deployments` quyi buyrugʻidan foydalaning:

```shell
kubectl get deployments
```

Chiqish shunga oʻxshash boʻlishi kerak:

```
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
kubernetes-bootcamp   1/1     1            1           11m
```

1 ta Pod boʻlishi kerak. Aks holda buyruqni yana bajaring. Bu quyidagilarni koʻrsatadi:

* _NAME_ klasterdagi Deploymentʼlar nomlarini roʻyxatlaydi.
* _READY_ joriy/maqsadli nusxalar nisbatini koʻrsatadi
* _UP-TO-DATE_ maqsadli holatga erishish uchun yangilangan nusxalar sonini koʻrsatadi.
* _AVAILABLE_ ilovaning foydalanuvchilaringizga mavjud nechta nusxasi borligini koʻrsatadi.
* _AGE_ ilova qancha vaqtdan beri ishlayotganini koʻrsatadi.

Deployment yaratgan ReplicaSetʼni koʻrish uchun quyidagini bajaring:

```shell
kubectl get rs
```

ReplicaSet nomi har doim
<nobr>[DEPLOYMENT-NAME]-[RANDOM-STRING]</nobr>
koʻrinishida boʻlishiga eʼtibor bering.
Tasodifiy qator tasodifiy yaratiladi va urugʻ sifatida pod-template-hashʼdan foydalanadi.

Bu chiqishning ikkita muhim ustuni:

* _DESIRED_ ilovaning maqsadli nusxalar sonini koʻrsatadi. Uni Deployment yaratishda
belgilaysiz. Bu maqsadli holat.
* _CURRENT_ hozir nechta nusxa ishlayotganini koʻrsatadi.

Keyin, keling, Deploymentʼni 4 ta nusxaga masshtablaymiz. Deployment turi, nomi va
kerakli nusxalar sonidan keyin `kubectl scale` buyrugʻidan foydalanamiz:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=4
```

Deploymentʼlaringizni yana roʻyxatlash uchun `get deployments` dan foydalaning:

```shell
kubectl get deployments
```

Oʻzgarish qoʻllandi va ilovaning 4 ta nusxasi mavjud. Keyin, keling, Podʼlar soni
oʻzgarganini tekshiramiz:

```shell
kubectl get pods -o wide
```

Endi turli IP manzilli 4 ta Pod bor. Oʻzgarish Deployment hodisalari jurnaliga yozildi.
Buni tekshirish uchun `describe` quyi buyrugʻidan foydalaning:

```shell
kubectl describe deployments/kubernetes-bootcamp
```

Bu buyruq chiqishida ham endi 4 ta nusxa borligini koʻrishingiz mumkin.

### Yukni taqsimlash {#load-balancing}

Keling, Service trafikni taqsimlayotganini tekshiramiz. Ochiq IP va portni bilish uchun
qoʻllanmaning oldingi qismida oʻrganganimizdek `describe service` dan foydalanishimiz mumkin:

```shell
kubectl describe services/kubernetes-bootcamp
```

Qiymati Node porti boʻlgan NODE_PORT muhit oʻzgaruvchisini yarating:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo NODE_PORT=$NODE_PORT
```

Keyin ochiq IP manzil va portga `curl` yuboramiz. Buyruqni bir necha marta bajaring:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Har bir soʻrovda boshqa Podʼga tegamiz. Bu yukni taqsimlash ishlayotganini koʻrsatadi.

Chiqish shunga oʻxshash boʻlishi kerak:

```
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-hs9dj | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-wp67j | v=1
Hello Kubernetes bootcamp! | Running on: kubernetes-bootcamp-644c5687f4-4hjvf | v=1
```

{{< alert color="info" title="Eslatma" >}}
Agar minikubeʼni konteyner drayveri sifatida Docker Desktop bilan ishga tushirayotgan boʻlsangiz, minikube
tunnel kerak boʻladi. Sababi, Docker Desktop ichidagi konteynerlar xost kompyuteringizdan ajratilgan.

Alohida terminal oynasida quyidagini bajaring:

```shell
minikube service kubernetes-bootcamp --url
```

Chiqish shunday koʻrinadi:

```
http://127.0.0.1:51082
!  Because you are using a Docker driver on darwin, the terminal needs to be open to run it.
```

Soʻng ilovaga kirish uchun berilgan URLdan foydalaning:

```shell
curl 127.0.0.1:51082
```
{{< /alert >}}

### Masshtabni kamaytirish {#scale-down}

Deploymentʼni 2 ta nusxaga kamaytirish uchun `scale` quyi buyrugʻini yana bajaring:

```shell
kubectl scale deployments/kubernetes-bootcamp --replicas=2
```

Oʻzgarish qoʻllanganini tekshirish uchun Deploymentʼlarni `get deployments` quyi buyrugʻi bilan roʻyxatlang:

```shell
kubectl get deployments
```

Nusxalar soni 2 taga kamaydi. Podʼlar sonini `get pods` bilan roʻyxatlang:

```shell
kubectl get pods -o wide
```

Bu 2 ta Pod tugatilganini tasdiqlaydi.

## {{% heading "whatsnext" %}} {#what-s-next}

* [Ketma-ket yangilash](/docs/tutorials/kubernetes-basics/update/update-intro/)
qoʻllanmasi.
* [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) haqida batafsil.
* [Avtomatik masshtablash](/docs/concepts/workloads/autoscaling/) haqida batafsil.
