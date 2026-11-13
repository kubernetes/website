---
title: Ketma-ket yangilash
weight: 10
---

## {{% heading "objectives" %}} {#objectives}

kubectl yordamida ketma-ket yangilashni bajarish.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ushbu qoʻllanmadagi shell buyruqlari POSIX shell sintaksisidan foydalanadi. Bu sintaksis
koʻpchilik Linux va macOS tizimlaridagi standart shellʼlarda (masalan, bash, zsh yoki sh) qoʻllab-quvvatlanadi.
Windows foydalanuvchilari buyruqlarni yozilganidek ishga tushirish uchun POSIX bilan mos shellʼdan,
masalan [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
yoki [Git Bash](https://gitforwindows.org/) dan foydalanishlari kerak.
`export`, `$()` va shunga oʻxshash konstruksiyalardan foydalanadigan buyruqlar PowerShell
yoki Windows Command Prompt bilan **mos kelmaydi**.


## Ilovani yangilash {#updating-an-application}

{{% alert %}}
_Ketma-ket yangilashlar Deployment yangilanishini toʻxtovsiz amalga oshirishga imkon beradi:
Pod nusxalari yangilari bilan bosqichma-bosqich almashtiriladi._
{{% /alert %}}

Foydalanuvchilar ilovalar doim mavjud boʻlishini kutadi, ishlab chiquvchilardan esa ularning
yangi versiyalarini kuniga bir necha marta joylashtirish kutiladi. Kubernetesda bu ketma-ket
yangilash bilan bajariladi. **Ketma-ket yangilash** Deployment yangilanishini toʻxtovsiz
amalga oshirishga imkon beradi. Buni joriy Podʼlarni yangilari bilan bosqichma-bosqich
almashtirish orqali qiladi. Yangi Podʼlar mavjud resurslari bor Nodeʼlarga rejalashtiriladi
va Kubernetes eski Podʼlarni olib tashlashdan oldin yangi Podʼlar ishga tushishini kutadi.

Oldingi modulda ilovamizni bir nechta nusxada ishlashi uchun masshtabladik. Bu ilova
mavjudligiga taʼsir qilmasdan yangilashni bajarish uchun talabdir. Odatiy holda yangilash
paytida mavjud boʻlmasligi mumkin boʻlgan Podʼlarning eng koʻp soni va yaratilishi mumkin
boʻlgan yangi Podʼlarning eng koʻp soni bittadan. Ikkala variantni ham son yoki foiz
(Podʼlarga nisbatan) sifatida sozlash mumkin. Kubernetesda yangilanishlar versiyalanadi
va istalgan Deployment yangilanishini oldingi (barqaror) versiyaga qaytarish mumkin.

## Ketma-ket yangilash haqida qisqacha {#rolling-updates-overview}

<!-- animation -->
{{< tutorials/carousel id="myCarousel" interval="3000" >}}
  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates1.svg"
      active="true" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates2.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates3.svg" >}}

  {{< tutorials/carousel-item
      image="/docs/tutorials/kubernetes-basics/public/images/module_06_rollingupdates4.svg" >}}
{{< /tutorials/carousel >}}

{{% alert %}}
Agar Deployment ommaga ochilgan boʻlsa, Service trafikni faqat soʻrovlarni bajara oladigan Podʼlarga yuboradi.
Bu yangilash paytida foydalanuvchilar ilovaga kiraverishini taʼminlaydi.
{{% /alert %}}

Ketma-ket yangilash paytida bu xatti-harakat trafikni faqat soʻrovlarni xizmat qilayotgan
Podʼlarga yoʻnaltirish orqali ilovani mavjud saqlaydi.
Ketma-ket yangilashlar quyidagi amallarga imkon beradi:

* Ilovani bir muhitdan boshqasiga oʻtkazish (konteyner obrazini yangilash orqali)
* Oldingi versiyalarga qaytarish
* Ilovalarni toʻxtovsiz uzluksiz integratsiya va uzluksiz yetkazib berish

Quyidagi interaktiv qoʻllanmada ilovamizni yangi versiyaga yangilaymiz va orqaga qaytarishni ham bajaramiz.

### Ilova versiyasini yangilash {#update-the-version-of-the-app}

Deploymentʼlaringizni roʻyxatlash uchun `get deployments` quyi buyrugʻini bajaring:

```shell
kubectl get deployments
```

Ishlayotgan Podʼlarni roʻyxatlash uchun `get pods` quyi buyrugʻini bajaring:

```shell
kubectl get pods
```

Ilovaning joriy obraz versiyasini koʻrish uchun `describe pods` quyi buyrugʻini bajaring
va `Image` maydonini qidiring:

```shell
kubectl describe pods
```

Ilova obrazini 2-versiyaga yangilash uchun deployment nomi va yangi obraz versiyasidan
keyin `set image` quyi buyrugʻidan foydalaning:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=docker.io/jocatalin/kubernetes-bootcamp:v2
```

Buyruq Deploymentʼga ilovangiz uchun boshqa obrazdan foydalanishni bildirdi va ketma-ket
yangilashni boshladi. Yangi Podʼlar holatini tekshiring va eskisi tugayotganini
`get pods` quyi buyrugʻi bilan koʻring:

```shell
kubectl get pods
```

### Yangilanishni tekshirish {#verify-an-update}

Avval Service ishlayotganini tekshiring, chunki uni oldingi qoʻllanma qadamida oʻchirgan
boʻlishingiz mumkin. `describe services/kubernetes-bootcamp` ni bajaring. Agar u yoʻq boʻlsa,
quyidagi bilan qayta yaratishingiz mumkin:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Qiymati biriktirilgan Node porti boʻlgan `NODE_PORT` muhit oʻzgaruvchisini yarating:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Keyin ochiq IP va portga `curl` yuboring:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

`curl` buyrugʻini har safar bajarganingizda boshqa Podʼga tegiladi. Barcha Podʼlar endi
eng soʻnggi versiyani (`v2`) ishga tushirayotganiga eʼtibor bering.

Yangilanishni `rollout status` quyi buyrugʻini bajaring orqali ham tasdiqlashingiz mumkin:

```shell
kubectl rollout status deployments/kubernetes-bootcamp
```

Ilovaning joriy obraz versiyasini koʻrish uchun describe pods quyi buyrugʻini bajaring:

```shell
kubectl describe pods
```

Chiqishning `Image` maydonida eng soʻnggi obraz versiyasini (`v2`) ishga tushirayotganingizni tekshiring.

### Yangilanishni orqaga qaytarish {#roll-back-an-update}

Keling, yana bir yangilash bajaramiz va `v10` tegi qoʻyilgan obrazni joylashtirishga urinamiz:

```shell
kubectl set image deployments/kubernetes-bootcamp kubernetes-bootcamp=gcr.io/google-samples/kubernetes-bootcamp:v10
```

Deployment holatini koʻrish uchun `get deployments` dan foydalaning:

```shell
kubectl get deployments
```

Chiqish mavjud Podʼlarning maqsadli sonini koʻrsatmasligiga eʼtibor bering. Barcha
Podʼlarni roʻyxatlash uchun `get pods` quyi buyrugʻini bajaring:

```shell
kubectl get pods
```

Baʼzi Podʼlarning holati `ImagePullBackOff` ekaniga eʼtibor bering.

Muammo haqida koʻproq bilish uchun `describe pods` quyi buyrugʻini bajaring:

```shell
kubectl describe pods
```

Taʼsirlangan Podʼlar chiqishining `Events` boʻlimida `v10` obraz versiyasi
repozitoriyda mavjud emasligiga eʼtibor bering.

Deploymentʼni oxirgi ishlagan versiyangizga qaytarish uchun `rollout undo`
quyi buyrugʻidan foydalaning:

```shell
kubectl rollout undo deployments/kubernetes-bootcamp
```

`rollout undo` buyrugʻi deploymentʼni oldingi maʼlum holatga (`obrazning v2` versiyasi)
qaytaradi. Yangilanishlar versiyalanadi va Deploymentʼning avval maʼlum boʻlgan istalgan
holatiga qaytishingiz mumkin.

Podʼlarni yana roʻyxatlash uchun `get pods` quyi buyrugʻidan foydalaning:

```shell
kubectl get pods
```

Ishlayotgan Podʼlarga joylashtirilgan obrazni tekshirish uchun `describe pods` quyi buyrugʻidan foydalaning:

```shell
kubectl describe pods
```

Deployment yana ilovaning barqaror versiyasidan (`v2`) foydalanmoqda. Orqaga qaytarish
muvaffaqiyatli boʻldi.

Mahalliy klasteringizni tozalashni unutmang.

```shell
kubectl delete deployments/kubernetes-bootcamp services/kubernetes-bootcamp
```

## {{% heading "whatsnext" %}} {#what-s-next}

* [Deployment](/docs/concepts/workloads/controllers/deployment/)lar haqida batafsil.
