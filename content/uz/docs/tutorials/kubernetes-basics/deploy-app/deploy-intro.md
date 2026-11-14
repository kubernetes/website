---
title: kubectl yordamida Deployment yaratish
weight: 10
---

## {{% heading "objectives" %}} {#objectives}

* Ilova Deploymentʼlari haqida oʻrganish.
* kubectl yordamida Kubernetesda birinchi ilovangizni joylashtirish.


## {{% heading "prerequisites" %}} {#before-you-begin}

Ushbu qoʻllanmadagi shell buyruqlari POSIX shell sintaksisidan foydalanadi. Bu sintaksis
koʻpchilik Linux va macOS tizimlaridagi standart shellʼlarda (masalan, bash, zsh yoki sh) qoʻllab-quvvatlanadi.
Windows foydalanuvchilari buyruqlarni yozilganidek ishga tushirish uchun POSIX bilan mos shellʼdan,
masalan [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
yoki [Git Bash](https://gitforwindows.org/) dan foydalanishlari kerak.
`export`, `$()` va shunga oʻxshash konstruksiyalardan foydalanadigan buyruqlar PowerShell
yoki Windows Command Prompt bilan **mos kelmaydi**.


## Kubernetes Deploymentʼlari {#kubernetes-deployments}

{{% alert %}}
_Deployment ilovangiz nusxalarini yaratish va yangilash uchun masʼul._
{{% /alert %}}

{{< alert color="info" title="Eslatma" >}}
Ushbu qoʻllanma AMD64 arxitekturasini talab qiladigan konteynerdan foydalanadi. Agar minikubeʼni
boshqa protsessor arxitekturasiga ega kompyuterda ishlatayotgan boʻlsangiz, AMD64ʼni emulyatsiya
qila oladigan drayver bilan minikubeʼni sinab koʻrishingiz mumkin. Masalan, Docker Desktop drayveri buni qila oladi.
{{< /alert >}}

[Ishlayotgan Kubernetes klasteri](/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/) boʻlgach,
uning ustiga konteynerlashtirilgan ilovalaringizni joylashtirishingiz mumkin. Buning uchun Kubernetes
**Deployment** yaratasiz. Deployment Kubernetesga ilovangiz nusxalarini qanday yaratish va
yangilashni buyuradi. Deployment yaratilgach, Kubernetes boshqaruv tekisligi shu Deployment
tarkibidagi ilova nusxalarini klasterdagi alohida Nodeʼlarda ishga tushirishni rejalashtiradi.

Ilova nusxalari yaratilgach, Kubernetes Deployment kontrolleri ularni uzluksiz kuzatib boradi.
Agar nusxani joylashtirgan Node ishdan chiqsa yoki oʻchirilsa, Deployment kontrolleri bu nusxani
klasterdagi boshqa Nodeʼdagi nusxa bilan almashtiradi. **Bu mashina nosozligi yoki
xizmat koʻrsatishni bartaraf etadigan oʻzini oʻzi tiklash mexanizmini beradi.**

Orkestratsiyadan oldingi dunyoda ilovalarni ishga tushirish uchun koʻpincha oʻrnatish skriptlari
ishlatilardi, lekin ular mashina nosozligidan tiklanishga imkon bermasdi. Ilova nusxalarini
ham yaratib, ham ularni Nodeʼlar boʻylab ishlab turishini taʼminlab, Kubernetes Deploymentʼlari
ilovalarni boshqarishga tubdan boshqacha yondashuv beradi.

## Kubernetesda birinchi ilovani joylashtirish {#deploying-your-first-app-on-kubernetes}

{{% alert %}}
_Ilovalar Kubernetesda joylashtirilishi uchun qoʻllab-quvvatlanadigan konteyner
formatlaridan biriga qadoqlangan boʻlishi kerak._
{{% /alert %}}

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_02_first_app.svg" class="diagram-medium" >}}

Deploymentʼni Kubernetes buyruqlar qatori interfeysi [kubectl](/docs/reference/kubectl/) yordamida
yaratish va boshqarish mumkin. `kubectl` klaster bilan ishlash uchun Kubernetes APIʼdan foydalanadi.
Ushbu modulda ilovalaringizni Kubernetes klasterida ishga tushiradigan Deploymentʼlarni yaratish
uchun eng koʻp kerak boʻladigan `kubectl` buyruqlarini oʻrganasiz.

Deployment yaratayotganda ilovangiz uchun konteyner obrazini va ishga tushirmoqchi boʻlgan
nusxalar sonini koʻrsatishingiz kerak. Bu maʼlumotni keyinroq Deploymentʼni yangilash orqali
oʻzgartirish mumkin. Bootcampning [5-moduli](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
va [6-moduli](/docs/tutorials/kubernetes-basics/update/update-intro/) Deploymentʼlarni qanday
masshtablash va yangilash mumkinligini yoritadi.

Birinchi Deploymentʼingiz uchun barcha soʻrovlarni qaytarib berishda NGINXʼdan foydalanadigan
Docker konteyneriga qadoqlangan hello-node ilovasini ishlatasiz. (Agar hello-node ilovasini
yaratib, uni konteyner yordamida joylashtirishni hali sinab koʻrmagan boʻlsangiz, avval
[Hello Minikube qoʻllanmasi](/docs/tutorials/hello-minikube/) koʻrsatmalariga amal qilishingiz mumkin.)

kubectl ham oʻrnatilgan boʻlishi kerak. Oʻrnatish kerak boʻlsa, [vositalarni oʻrnatish](/docs/tasks/tools/#kubectl)
sahifasiga kiring.

Deploymentʼlar nima ekanini bilganingizdan soʻng, keling, birinchi ilovamizni joylashtiramiz!

### kubectl asoslari {#kubectl-basics}

kubectl buyrugʻining odatiy koʻrinishi: `kubectl action resource`.

Bu koʻrsatilgan _resurs_ (masalan, `node` yoki `deployment`) ustida koʻrsatilgan _amal_ni
(`create`, `describe` yoki `delete` kabi) bajaradi. Mumkin boʻlgan parametrlar haqida
qoʻshimcha maʼlumot olish uchun quyi buyruqdan keyin `--help` dan foydalanishingiz mumkin
(masalan: `kubectl get nodes --help`).

`kubectl version` buyrugʻini ishga tushirib, kubectl klasteringiz bilan gaplasha oladigan qilib sozlanganini tekshiring.

kubectl oʻrnatilganini hamda mijoz va server versiyalarini koʻra olishingizni tekshiring.

Klasterdagi tugunlarni koʻrish uchun `kubectl get nodes` buyrugʻini ishga tushiring.

Mavjud Nodeʼlarni koʻrasiz. Keyinroq Kubernetes ilovamizni qayerga joylashtirishni Nodeʼdagi mavjud resurslarga qarab tanlaydi.

### Ilovani joylashtirish {#deploy-an-app}

Keling, birinchi ilovamizni Kubernetesda `kubectl create deployment` buyrugʻi bilan joylashtiramiz.
Deployment nomini va ilova obrazi joylashuvini berishimiz kerak (Docker Hubʼdan tashqarida
joylashgan obrazlar uchun toʻliq repozitoriy URLʼini kiriting).

```shell
kubectl create deployment kubernetes-bootcamp --image=gcr.io/google-samples/kubernetes-bootcamp:v1
```

Ajoyib! Deployment yaratib, birinchi ilovangizni joylashtirdingiz. Bu siz uchun bir nechta ishni bajardi:

* ilova nusxasini ishga tushirish mumkin boʻlgan mos tugunni qidirdi (bizda faqat 1 ta mavjud tugun bor)
* ilovani shu Nodeʼda ishga tushirishni rejalashtirdi
* kerak boʻlganda nusxani yangi Nodeʼda qayta rejalashtirish uchun klasterni sozladi

Deploymentʼlaringiz roʻyxatini olish uchun `kubectl get deployments` buyrugʻidan foydalaning:

```shell
kubectl get deployments
```

Ilovangizning bitta nusxasini ishga tushirayotgan 1 ta Deployment borligini koʻramiz. Nusxa
tuguningizdagi konteyner ichida ishlayapti.

### Ilovani koʻrish {#view-the-app}

Kubernetes ichida ishlayotgan [Pod](/docs/concepts/workloads/pods/)lar shaxsiy, ajratilgan tarmoqda
ishlaydi. Odatiy holda ular bir xil Kubernetes klasteridagi boshqa Pod va Serviceʼlardan koʻrinadi,
lekin bu tarmoqdan tashqarida koʻrinmaydi. `kubectl` dan foydalanganda ilovamiz bilan API
nuqtasi orqali aloqa qilamiz.

Ilovani Kubernetes klasteridan tashqariga qanday ochishning boshqa variantlarini keyinroq,
[4-modul](/docs/tutorials/kubernetes-basics/expose/)da koʻrib chiqamiz.
Bu asosiy qoʻllanma boʻlgani uchun `Pod` nima ekanini bu yerda batafsil tushuntirmaymiz;
bu keyingi mavzularda yoritiladi.

`kubectl proxy` buyrugʻi aloqani klaster boʻylab shaxsiy tarmoqqa uzatadigan proksi yaratishi
mumkin. Proksini control-C tugmasini bosib toʻxtatish mumkin va u ishlayotganda hech narsa chiqarmaydi.

**Proksini ishga tushirish uchun ikkinchi terminal oynasini ochishingiz kerak.**

```shell
kubectl proxy
```
Proksi xostingizni Kubernetes klasteriga ulaydi. U ikkinchi terminalda ishlashda davom etadi,
shuning uchun quyidagi buyruqlarni dastlabki terminalingizda bajaring.

Proksi nuqtasi orqali joylashgan barcha APIʼlarni koʻrishingiz mumkin. Masalan, `curl`
buyrugʻi bilan versiyani toʻgʻridan-toʻgʻri API orqali soʻrash mumkin:

```shell
curl http://localhost:8001/version
```

{{< alert color="info" title="Eslatma" >}}
Agar 8001-port ochilmasa, yuqorida ishga tushirgan `kubectl proxy` ikkinchi terminalda
ishlayotganiga ishonch hosil qiling.
{{< /alert >}}

API server har bir Pod uchun Pod nomiga asoslangan va proksi orqali ham ochiladigan
nuqtani avtomatik yaratadi.

Avval Pod nomini olishimiz kerak va uni `POD_NAME` muhit oʻzgaruvchisida saqlaymiz.

```shell
export POD_NAME=$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')
echo Name of the Pod: $POD_NAME
```

Proksi orqali ochilgan API yordamida Podʼga quyidagicha kirishingiz mumkin:

```shell
curl http://localhost:8001/api/v1/namespaces/default/pods/$POD_NAME:8080/proxy/
```

Yangi Deployment proksisiz ochilishi uchun Service kerak. Bu [4-modul](/docs/tutorials/kubernetes-basics/expose/)da tushuntiriladi.

## {{% heading "whatsnext" %}} {#what-s-next}

* [Pod va Nodeʼlarni koʻrish](/docs/tutorials/kubernetes-basics/explore/explore-intro/) qoʻllanmasi.
* [Deployment](/docs/concepts/workloads/controllers/deployment/)lar haqida batafsil.
