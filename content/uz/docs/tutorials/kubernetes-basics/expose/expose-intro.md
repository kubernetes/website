---
title: Service yordamida ilovani ochish
weight: 10
---

## {{% heading "objectives" %}} {#objectives}

* Kubernetesdagi Service haqida oʻrganish.
* Yorliqlar va selektorlar Service bilan qanday bogʻliqligini tushunish.
* Ilovani Kubernetes klasteridan tashqariga ochish.

## {{% heading "prerequisites" %}} {#before-you-begin}

Ushbu qoʻllanmadagi shell buyruqlari POSIX shell sintaksisidan foydalanadi. Bu sintaksis
koʻpchilik Linux va macOS tizimlaridagi standart shellʼlarda (masalan, bash, zsh yoki sh) qoʻllab-quvvatlanadi.
Windows foydalanuvchilari buyruqlarni yozilganidek ishga tushirish uchun POSIX bilan mos shellʼdan,
masalan [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)
yoki [Git Bash](https://gitforwindows.org/) dan foydalanishlari kerak.
`export`, `$()` va shunga oʻxshash konstruksiyalardan foydalanadigan buyruqlar PowerShell
yoki Windows Command Prompt bilan **mos kelmaydi**.


## Kubernetes Serviceʼlari haqida {#overview-of-kubernetes-services}

Kubernetes [Pod](/docs/concepts/workloads/pods/)lari doimiy emas. Podʼlarning
[hayotiy sikli](/docs/concepts/workloads/pods/pod-lifecycle/) bor. Ishchi tugun nobud boʻlsa,
shu Nodeʼda ishlayotgan Podʼlar ham yoʻqoladi. Shundan soʻng [ReplicaSet](/docs/concepts/workloads/controllers/replicaset/)
yangi Podʼlar yaratish orqali klasterni maqsadli holatga dinamik qaytarishi va ilovangiz
ishlashda davom etishini taʼminlashi mumkin. Boshqa misol: 3 ta nusxali tasvirni qayta
ishlovchi backend. Bu nusxalar oʻzaro almashtiriladi; frontend tizimi backend nusxalari
haqida, hatto Pod yoʻqolib qayta yaratilgani haqida ham qaygʻurmasligi kerak. Shu bilan
birga, Kubernetes klasteridagi har bir Podʼning, hatto bir xil Nodeʼdagi Podʼlarning ham,
noyob IP manzili bor. Shuning uchun ilovalaringiz ishlashda davom etishi uchun Podʼlar
orasidagi oʻzgarishlarni avtomatik muvofiqlashtirish yoʻli kerak.

{{% alert %}}
_Kubernetes Serviceʼi — Podʼlarning mantiqiy toʻplamini belgilaydigan va shu Podʼlar uchun
tashqi trafikni ochish, yukni taqsimlash hamda servisni topishni taʼminlaydigan abstraksiya qatlami._
{{% /alert %}}

Kubernetesdagi [Service](/docs/concepts/services-networking/service/) — Podʼlarning mantiqiy
toʻplamini va ularga kirish siyosatini belgilaydigan abstraksiya. Serviceʼlar oʻzaro
bogʻliq Podʼlar oʻrtasida boʻsh bogʻlanishni taʼminlaydi. Service, barcha Kubernetes obyekt
manifestlari kabi, YAML yoki JSON yordamida belgilanadi. Service moʻljallagan Podʼlar
toʻplami odatda _yorliq selektori_ bilan aniqlanadi (spec ichida `selector` boʻlmagan
Service nima uchun kerak boʻlishi mumkinligi quyida keltirilgan).

Har bir Podʼning noyob IP manzili boʻlsa-da, Serviceʼsiz bu IPʼlar klasterdan tashqariga
ochilmaydi. Serviceʼlar ilovalaringizga trafik qabul qilish imkonini beradi.
Serviceʼning `spec` ida `type` ni koʻrsatish orqali Serviceʼlarni turli usullarda ochish mumkin:

* _ClusterIP_ (odatiy) — Serviceʼni klaster ichidagi ichki IPʼda ochadi. Bu tur Serviceʼni
faqat klaster ichidan mavjud qiladi.

* _NodePort_ — Serviceʼni NAT yordamida klasterdagi har bir tanlangan Nodeʼning bir xil
portida ochadi. Serviceʼni klaster tashqarisidan `NodeIP:NodePort` orqali ochadi. ClusterIPʼning kengaytmasi.

* _LoadBalancer_ — joriy bulutda (qoʻllab-quvvatlansa) tashqi yuk taqsimlovchini yaratadi
va Serviceʼga qatʼiy tashqi IP biriktiradi. NodePortʼning kengaytmasi.

* _ExternalName_ — Serviceʼni `externalName` maydoni mazmuniga (masalan, `foo.bar.example.com`)
xaritalaydi va qiymati shu boʻlgan `CNAME` yozuvini qaytaradi.
Hech qanday proksi sozlanmaydi.

Service turlarining farqlari haqida batafsil maʼlumotni [Manba IPʼdan foydalanish](/docs/tutorials/services/source-ip/)
qoʻllanmasida topasiz. Shuningdek, [Ilovalarni Serviceʼlar bilan ulash](/docs/tutorials/services/connect-applications-service/)
sahifasiga qarang.

Qoʻshimcha ravishda, Serviceʼlarning spec ichida `selector` belgilanmaydigan baʼzi
holatlari borligiga eʼtibor bering. `selector` siz yaratilgan Service mos Endpoints
obyektini ham yaratmaydi. Bu foydalanuvchilarga Serviceʼni aniq endpointʼlarga qoʻlda
xaritalash imkonini beradi. Selektor boʻlmasligining yana bir sababi — faqat
`type: ExternalName` dan foydalanayotgan boʻlishingiz mumkin.

## Serviceʼlar va yorliqlar {#services-and-labels}

Service trafikni Podʼlar toʻplami boʻylab yoʻnaltiradi. Serviceʼlar — Podʼlar Kubernetesda
nobud boʻlib, qayta yaratilishi ilovangizga taʼsir qilmasligi uchun kerak boʻlgan
abstraksiya. Oʻzaro bogʻliq Podʼlar (masalan, ilovadagi frontend va backend komponentlari)
orasida topish va yoʻnaltirishni Kubernetes Serviceʼlari bajaradi.

Serviceʼlar Podʼlar toʻplamiga [yorliqlar va selektorlar](/docs/concepts/overview/working-with-objects/labels)
yordamida mos keladi. Bu Kubernetesdagi obyektlar ustida mantiqiy amal bajarishga
imkon beradigan guruhlash primitivasi. Yorliqlar — obyektlarga biriktirilgan kalit/qiymat
juftliklari boʻlib, ularni istalgancha usulda ishlatish mumkin:

* Obyektlarni ishlab chiqish, sinov va ishlab chiqarish uchun belgilash
* Versiya teglarini joylashtirish
* Obyektni teglar yordamida tasniflash

{{< figure src="/docs/tutorials/kubernetes-basics/public/images/module_04_labels.svg" class="diagram-medium" >}}

Yorliqlarni obyektlarga yaratish paytida yoki keyinroq biriktirish mumkin. Ularni
istalgan vaqtda oʻzgartirish mumkin. Keling, ilovamizni hozir Service yordamida ochamiz
va bir nechta yorliq qoʻllamiz.

### 1-qadam: Yangi Service yaratish {#step-1-creating-a-new-service}

Keling, ilovamiz ishlayotganini tekshiramiz. `kubectl get` buyrugʻidan foydalanamiz
va mavjud Podʼlarni qidiramiz:

```shell
kubectl get pods
```

Agar hech qanday Pod ishlamayotgan boʻlsa, oldingi qoʻllanmalardagi obyektlar tozalangan
degani. Bunday holda orqaga qayting va Deploymentʼni
[kubectl yordamida Deployment yaratish](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro#deploy-an-app)
qoʻllanmasidan qayta yarating. Bir necha soniya kuting va Podʼlarni yana roʻyxatlang.
Bitta Pod ishlayotganini koʻrganingizdan soʻng davom etishingiz mumkin.

Keyin, keling, klasterimizdagi joriy Serviceʼlarni roʻyxatlaymiz:

```shell
kubectl get services
```

Deploymentʼni tashqi trafikga ochish uchun `--type=NodePort` parametri bilan kubectl expose buyrugʻidan foydalanamiz:

```shell
kubectl expose deployment/kubernetes-bootcamp --type="NodePort" --port 8080
```

Endi kubernetes-bootcamp nomli ishlayotgan Serviceʼimiz bor. Bu yerda Service noyob
cluster-IP, ichki port va tashqi IP (Nodeʼning IP manzili) olganini koʻramiz.

Tashqariga qaysi port ochilganini bilish uchun (`type: NodePort` Serviceʼi uchun)
`describe service` quyi buyrugʻini ishga tushiramiz:

```shell
kubectl describe services/kubernetes-bootcamp
```

Qiymati biriktirilgan Node porti boʻlgan `NODE_PORT` muhit oʻzgaruvchisini yarating:

```shell
export NODE_PORT="$(kubectl get services/kubernetes-bootcamp -o go-template='{{(index .spec.ports 0).nodePort}}')"
echo "NODE_PORT=$NODE_PORT"
```

Endi ilova klaster tashqarisiga ochilganini `curl`, Nodeʼning IP manzili va tashqariga
ochilgan port yordamida tekshirishimiz mumkin:

```shell
curl http://"$(minikube ip):$NODE_PORT"
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

Serverdan javob olamiz. Service ochildi.

### 2-qadam: Yorliqlardan foydalanish {#step-2-using-labels}

Deployment Podʼimiz uchun yorliqni avtomatik yaratdi. `describe deployment`
quyi buyrugʻi bilan shu yorliq nomini (_kalit_ini) koʻrishingiz mumkin:

```shell
kubectl describe deployment
```

Keling, Podʼlar roʻyxatini soʻrash uchun shu yorliqdan foydalanamiz. `kubectl get pods`
buyrugʻini `-l` parametri bilan, undan keyin yorliq qiymatlari bilan ishga tushiramiz:

```shell
kubectl get pods -l app=kubernetes-bootcamp
```
Mavjud Serviceʼlarni roʻyxatlash uchun ham xuddi shunday qilishingiz mumkin:

```shell
kubectl get services -l app=kubernetes-bootcamp
```

Pod nomini oling va uni POD_NAME muhit oʻzgaruvchisida saqlang:

```shell
export POD_NAME="$(kubectl get pods -o go-template --template '{{range .items}}{{.metadata.name}}{{"\n"}}{{end}}')"
echo "Name of the Pod: $POD_NAME"
```

Yangi yorliq qoʻllash uchun obyekt turi, obyekt nomi va yangi yorliqdan keyin keladigan
label quyi buyrugʻidan foydalanamiz:

```shell
kubectl label pods "$POD_NAME" version=v1
```

Bu Podʼimizga yangi yorliq qoʻllaydi (ilova versiyasini Podʼga mahkamladik)
va buni `describe pod` buyrugʻi bilan tekshirish mumkin:

```shell
kubectl describe pods "$POD_NAME"
```

Bu yerda yorliq endi Podʼimizga biriktirilganini koʻramiz. Endi yangi yorliq yordamida
Podʼlar roʻyxatini soʻrashimiz mumkin:

```shell
kubectl get pods -l version=v1
```
Va Podʼni koʻramiz.

### 3-qadam: Serviceʼni oʻchirish {#step-3-deleting-a-service}

Serviceʼlarni oʻchirish uchun `delete service` quyi buyrugʻidan foydalanishingiz mumkin.
Yorliqlardan bu yerda ham foydalanish mumkin:

```shell
kubectl delete service -l app=kubernetes-bootcamp
```

Service yoʻqolganini tasdiqlang:

```shell
kubectl get services
```

Bu Serviceʼimiz oʻchirilganini tasdiqlaydi. Yoʻnalish endi ochiq emasligini tasdiqlash
uchun avval ochilgan IP va portga `curl` yuborishingiz mumkin:

```shell
curl http://"$(minikube ip):$NODE_PORT"
```

Bu ilovaga endi klaster tashqarisidan yetib boʻlmasligini isbotlaydi.
Ilova hali ham ishlayotganini Pod ichidan `curl` bilan tasdiqlashingiz mumkin:

```shell
kubectl exec -ti $POD_NAME -- curl http://localhost:8080
```

Bu yerda ilova ishlayotganini koʻramiz. Sababi, ilovani Deployment boshqarayapti.
Ilovani toʻxtatish uchun Deploymentʼni ham oʻchirish kerak boʻladi.

## {{% heading "whatsnext" %}} {#what-s-next}

* [Ilovangizning bir nechta nusxasini ishga tushirish](/docs/tutorials/kubernetes-basics/scale/scale-intro/)
qoʻllanmasi.
* [Service](/docs/concepts/services-networking/service/) haqida batafsil.
