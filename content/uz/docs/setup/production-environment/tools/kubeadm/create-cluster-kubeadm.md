---
# reviewers:
# - sig-cluster-lifecycle
title: kubeadm bilan klaster yaratish
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
`kubeadm` yordamida eng yaxshi amaliyotlarga mos keladigan minimal ishlaydigan Kubernetes klasterini yaratishingiz mumkin.
Aslida, `kubeadm` yordamida
[Kubernetes muvofiqlik testlaridan](/blog/2017/10/software-conformance-certification/) oʻtadigan klaster oʻrnatishingiz mumkin.
`kubeadm` boshqa klaster hayotiy tsikli funksiyalarini ham qoʻllab-quvvatlaydi, masalan
[bootstrap tokenlar](/docs/reference/access-authn-authz/bootstrap-tokens/) va klasterni yangilash.

`kubeadm` vositasi quyidagi hollarda qulay:

- Kubernetesni, ehtimol birinchi marta, oddiy usulda sinab koʻrmoqchi boʻlsangiz.
- Mavjud foydalanuvchilar klaster oʻrnatishni avtomatlashtirib, ilovasini sinamoqchi boʻlsa.
- Kengroq qamrovga ega boshqa ekotizim va/yoki oʻrnatish vositalaridagi
  qurilish bloki sifatida.

`kubeadm` ni turli mashinalarga oʻrnatib ishlatishingiz mumkin: noutbukingiz, bulut
serverlari toʻplami, Raspberry Pi va boshqalar. Bulutga joylashtirasizmi yoki
oʻz infratuzilmangizga, `kubeadm` ni Ansible yoki Terraform kabi
taʼminlash tizimlariga ulashingiz mumkin.

## {{% heading "prerequisites" %}}

Ushbu qoʻllanmaga amal qilish uchun quyidagilar kerak:

- deb/rpm bilan mos Linux OT ishlaydigan bir yoki bir nechta mashina; masalan: Ubuntu yoki CentOS.
- Har bir mashinada 2 GiB yoki undan koʻp RAM — bundan kam boʻlsa, ilovalaringiz uchun joy deyarli qolmaydi.
- Boshqaruv tekisligi tuguni sifatida ishlatadigan mashinada kamida 2 ta CPU.
- Klasterdagi barcha mashinalar oʻrtasida toʻliq tarmoq ulanishi. Ommaviy yoki
  xususiy tarmoqdan foydalanishingiz mumkin.

Shuningdek, yangi klasteringizda ishlatmoqchi boʻlgan Kubernetes versiyasini
joylashtira oladigan `kubeadm` versiyasidan foydalanishingiz kerak.

[Kubernetes versiyasi va versiya farqini qoʻllab-quvvatlash siyosati](/docs/setup/release/version-skew-policy/#supported-versions)
`kubeadm` ga ham, umuman Kubernetesga ham tatbiq etiladi.
Kubernetes va `kubeadm` ning qaysi versiyalari qoʻllab-quvvatlanishini bilish uchun
ushbu siyosatni tekshiring. Bu sahifa Kubernetes {{< param "version" >}} uchun yozilgan.

`kubeadm` vositasining umumiy imkoniyat holati — umumiy foydalanish (General Availability, GA). Ayrim kichik imkoniyatlar
hali faol ishlab chiqilmoqda. Vosita rivojlangani sari klasterni yaratish amaliyoti biroz
oʻzgarishi mumkin, lekin umumiy amaliyot yetarlicha barqaror boʻlishi kerak.

{{< note >}}
`kubeadm alpha` ostidagi har qanday buyruq, taʼrifiga koʻra, alfa darajada qoʻllab-quvvatlanadi.
{{< /note >}}

<!-- steps -->

## Maqsadlar

* Bitta boshqaruv tekisligiga ega Kubernetes klasterini oʻrnatish
* Podlaringiz bir-biri bilan
  aloqa qila olishi uchun klasterga Pod tarmogʻini oʻrnatish

## Koʻrsatmalar

### Xostlarni tayyorlash

#### Komponentlarni oʻrnatish

Barcha xostlarga {{< glossary_tooltip term_id="container-runtime" text="konteyner runtime" >}}
va kubeadm ni oʻrnating. Batafsil koʻrsatmalar va boshqa old shartlar uchun
[kubeadm ni oʻrnatish](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) sahifasiga qarang.

{{< note >}}
kubeadm ni allaqachon oʻrnatgan boʻlsangiz, kubeadm ni qanday yangilash haqidagi koʻrsatmalar uchun
[Linux tugunlarini yangilash](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes)
hujjatining dastlabki ikki qadamiga qarang.

Yangilash paytida kubelet kubeadm nima qilishni aytishini crashloop holatida kutib, har
bir necha soniyada qayta ishga tushadi. Bu crashloop kutilgan va odatiy holat.
Boshqaruv tekisligini ishga tushirgandan soʻng kubelet odatdagidek ishlaydi.
{{< /note >}}

#### Tarmoqni sozlash

kubeadm, boshqa Kubernetes komponentlari kabi, xostdagi standart shlyuz bilan
bogʻlangan tarmoq interfeyslarida yaroqli IP ni topishga urinadi. Ana shu
IP keyin komponent eʼlon qilishi va/yoki tinglashi uchun ishlatiladi.

Linux xostida bu IP nima ekanini bilish uchun quyidagidan foydalanishingiz mumkin:

```shell
ip route show # Look for a line starting with "default via"
```

{{< note >}}
Xostda ikki yoki undan koʻp standart shlyuz boʻlsa, Kubernetes komponenti
mos global unicast IP manzilga ega birinchi duch kelgan shlyuzdan foydalanishga urinadi.
Bu tanlovda shlyuzlarning aniq tartibi turli
operatsion tizimlar va yadro versiyalarida farq qilishi mumkin.
{{< /note >}}

Kubernetes komponentlari maxsus tarmoq interfeysini parametr sifatida qabul qilmaydi,
shuning uchun bunday maxsus konfiguratsiya kerak boʻlgan barcha komponent nusxalariga
maxsus IP manzil bayroq orqali uzatilishi shart.

{{< note >}}
Xostda standart shlyuz boʻlmasa va Kubernetes komponentiga maxsus IP manzil
uzatilmasa, komponent xato bilan chiqishi mumkin.
{{< /note >}}

Ham `init`, ham `join` bilan yaratilgan boshqaruv tekisligi tugunlari uchun API server eʼlon manzilini sozlashda
`--apiserver-advertise-address` bayrogʻidan foydalanish mumkin.
Afzalroq yoʻl — bu parametrni [kubeadm API](/docs/reference/config-api/kubeadm-config.v1beta4)
ichida `InitConfiguration.localAPIEndpoint` va `JoinConfiguration.controlPlane.localAPIEndpoint` sifatida oʻrnatish.

Barcha tugunlardagi kubeletlar uchun `--node-ip` parametrini kubeadm konfiguratsiya faylidagi
(`InitConfiguration` yoki `JoinConfiguration`) `.nodeRegistration.kubeletExtraArgs` ichida uzatish mumkin.

Dual-stack uchun
[kubeadm bilan dual-stack qoʻllab-quvvatlash](/docs/setup/production-environment/tools/kubeadm/dual-stack-support) sahifasiga qarang.

Boshqaruv tekisligi komponentlariga tayinlagan IP manzillar ularning X.509 sertifikatlaridagi
subject alternative name maydonlarining bir qismiga aylanadi. Bu IP manzillarni oʻzgartirish
yangi sertifikatlarni imzolashni va taʼsirlangan komponentlarni qayta ishga tushirishni talab qiladi,
shunda sertifikat fayllaridagi oʻzgarish aks etadi. Bu mavzu haqida batafsil
[Sertifikatni qoʻlda yangilash](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)
sahifasiga qarang.

{{< warning >}}
Kubernetes loyihasi bu yondashuvni (barcha komponent nusxalarini
maxsus IP manzillar bilan sozlashni) tavsiya etmaydi. Uning oʻrniga Kubernetes qoʻllab-quvvatlovchilari xost tarmogʻini shunday sozlashni tavsiya qiladi,
ki standart shlyuz IP si Kubernetes komponentlari avtomatik aniqlab ishlatadigan manzil boʻlsin.
Linux tugunlarida tarmoqni sozlash uchun `ip route` kabi buyruqlardan foydalanishingiz mumkin; operatsion
tizimingiz yuqoriroq darajadagi tarmoq boshqaruvi vositalarini ham berishi mumkin. Tuguningizning standart shlyuzi
ommaviy IP manzil boʻlsa, tugunlar va klasteringizni himoya qiladigan paket filtrlash yoki boshqa xavfsizlik choralarini
sozlashingiz kerak.
{{< /warning >}}

### Kerakli konteyner obrazlarini tayyorlash

Bu qadam ixtiyoriy va faqat `kubeadm init` hamda `kubeadm join`
`registry.k8s.io` dagi standart konteyner obrazlarini yuklab olmasligini xohlasangiz tatbiq etiladi.

Kubeadm tugunlarida internet ulanishisiz klaster yaratishda kerakli obrazlarni oldindan tortib olishga
yordam beradigan buyruqlarga ega.
Batafsil maʼlumot uchun [Internet ulanishisiz kubeadm ni ishga tushirish](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)
sahifasiga qarang.

Kubeadm kerakli obrazlar uchun maxsus obraz repozitoriyasidan foydalanishga imkon beradi.
Batafsil maʼlumot uchun [Maxsus obrazlardan foydalanish](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)
sahifasiga qarang.

### Boshqaruv tekisligi tugunini ishga tushirish

Boshqaruv tekisligi tuguni — boshqaruv tekisligi komponentlari, jumladan
{{< glossary_tooltip term_id="etcd" >}} (klaster maʼlumotlar bazasi) va
{{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
ishlaydigan mashina ({{< glossary_tooltip text="kubectl" term_id="kubectl" >}} buyruq qatori vositasi
aynan shu bilan aloqa qiladi).

1. (Tavsiya etiladi) Ushbu bitta boshqaruv tekisligiga ega `kubeadm` klasterini
   [yuqori mavjudlik](/docs/setup/production-environment/tools/kubeadm/high-availability/)
   darajasiga yangilashni rejalashtirgan boʻlsangiz, barcha boshqaruv tekisligi tugunlari uchun umumiy endpointni oʻrnatish uchun `--control-plane-endpoint` ni koʻrsating.
   Bunday endpoint yuk balanslagichning DNS nomi yoki IP manzili boʻlishi mumkin.
1. Pod tarmogʻi qoʻshimchasini tanlang va u `kubeadm init` ga biror argument
   uzatishni talab qilishini tekshiring. Qaysi
   uchinchi tomon provayderini tanlashingizga qarab, `--pod-network-cidr` ni
   provayderga xos qiymatga oʻrnatishingiz kerak boʻlishi mumkin. [Pod tarmogʻi qoʻshimchasini oʻrnatish](#pod-network) boʻlimiga qarang.
1. (Ixtiyoriy) `kubeadm` maʼlum endpointlar roʻyxati yordamida konteyner runtimeni aniqlashga urinadi.
   Boshqa konteyner runtimedan foydalanish uchun yoki tayyorlangan tugunda bir nechtasi oʻrnatilgan boʻlsa,
   `kubeadm` ga `--cri-socket` argumentini koʻrsating.
   [Runtime oʻrnatish](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime) boʻlimiga qarang.

Boshqaruv tekisligi tugunini ishga tushirish uchun quyidagini bajaring:

```bash
kubeadm init <args>
```

### apiserver-advertise-address va ControlPlaneEndpoint haqida mulohazalar

`--apiserver-advertise-address` ushbu aniq boshqaruv tekisligi tugunining API serveri uchun eʼlon qilinadigan manzilni oʻrnatishda ishlatilishi mumkin,
`--control-plane-endpoint` esa barcha boshqaruv tekisligi tugunlari uchun umumiy endpointni oʻrnatishda ishlatilishi mumkin.

`--control-plane-endpoint` IP manzillarga moslanishi mumkin boʻlgan ham IP manzillarni, ham DNS nomlarini qabul qiladi.
Bunday moslash boʻyicha mumkin boʻlgan yechimlarni baholash uchun tarmoq administratoringizga murojaat qiling.

Quyida moslash misoli keltirilgan:

```
192.168.0.102 cluster-endpoint
```

Bu yerda `192.168.0.102` ushbu tugunning IP manzili, `cluster-endpoint` esa shu IP ga moslanadigan maxsus DNS nomidir.
Bu sizga `kubeadm init` ga `--control-plane-endpoint=cluster-endpoint` ni va xuddi shu DNS nomini
`kubeadm join` ga uzatish imkonini beradi. Keyinchalik yuqori mavjudlik ssenariysida `cluster-endpoint` ni
yuk balanslagichingiz manziliga yoʻnaltirish uchun oʻzgartirishingiz mumkin.

`--control-plane-endpoint` koʻrsatilmasdan yaratilgan bitta boshqaruv tekisligiga ega klasterni yuqori mavjudlikka ega klasterga aylantirish
kubeadm tomonidan qoʻllab-quvvatlanmaydi.

### Qoʻshimcha maʼlumot

`kubeadm init` argumentlari haqida qoʻshimcha maʼlumot uchun [kubeadm maʼlumotnomasiga](/docs/reference/setup-tools/kubeadm/) qarang.

`kubeadm init` ni konfiguratsiya fayli bilan sozlash uchun
[Konfiguratsiya fayli bilan kubeadm init dan foydalanish](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file) boʻlimiga qarang.

Boshqaruv tekisligi komponentlarini, jumladan boshqaruv tekisligi komponentlari va etcd serveri uchun jonlilik tekshiruviga ixtiyoriy IPv6 tayinlashni sozlash uchun
har bir komponentga [maxsus argumentlar](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)
hujjatida koʻrsatilganidek qoʻshimcha argumentlar bering.

Allaqachon yaratilgan klasterni qayta sozlash uchun
[kubeadm klasterini qayta sozlash](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure) sahifasiga qarang.

`kubeadm init` ni qayta ishga tushirish uchun avval [klasterni yopishingiz](#tear-down) kerak.

Klasteringizga boshqa arxitekturadagi tugunni qoʻshsangiz, joylashtirilgan DaemonSet laringiz
ushbu arxitektura uchun konteyner obrazini qoʻllab-quvvatlashiga ishonch hosil qiling.

`kubeadm init` avval mashina Kubernetesni ishga tushirishga tayyor ekanini taʼminlash uchun bir qator oldindan tekshiruvlarni bajaradi.
Bu oldindan tekshiruvlar ogohlantirishlarni koʻrsatadi va xatolarda chiqadi. Soʻng `kubeadm init`
klaster boshqaruv tekisligi komponentlarini yuklab olib oʻrnatadi. Bu bir necha daqiqa olishi mumkin.
Tugagach, quyidagini koʻrishingiz kerak:

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

kubectl root boʻlmagan foydalanuvchingiz uchun ishlashi uchun quyidagi buyruqlarni bajaring; ular
`kubeadm init` chiqishining ham bir qismidir:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Shu bilan birga, agar siz `root` foydalanuvchisi boʻlsangiz, quyidagini bajarishingiz mumkin:

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
`kubeadm init` yaratadigan `admin.conf` kubeconfig fayli
`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin` ga ega sertifikatni oʻz ichiga oladi. `kubeadm:cluster-admins` guruhi
oʻrnatilgan `cluster-admin` ClusterRole ga bogʻlangan.
`admin.conf` faylini hech kim bilan ulashmang.

`kubeadm init` yana bir `super-admin.conf` kubeconfig faylini yaratadi; unda
`Subject: O = system:masters, CN = kubernetes-super-admin` ga ega sertifikat bor.
`system:masters` — avtorizatsiya qatlamini (masalan, RBAC) chetlab oʻtadigan favqulodda superfoydalanuvchi guruhidir.
`super-admin.conf` faylini hech kim bilan ulashmang. Faylni xavfsiz joyga koʻchirish tavsiya etiladi.

Qoʻshimcha foydalanuvchilar uchun kubeconfig fayllarini yaratishda `kubeadm kubeconfig user` dan qanday foydalanish haqida
[Qoʻshimcha foydalanuvchilar uchun kubeconfig fayllarini yaratish](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)
boʻlimiga qarang.
{{< /warning >}}

`kubeadm init` chiqaradigan `kubeadm join` buyrugʻini yozib oling. Bu buyruq
[tugunlarni klasteringizga qoʻshish](#join-nodes) uchun kerak.

Token boshqaruv tekisligi tuguni va qoʻshilayotgan tugunlar oʻrtasidagi oʻzaro autentifikatsiya uchun ishlatiladi.
Bu yerdagi token maxfiy. Uni xavfsiz saqlang, chunki ushbu token
ga ega har kim klasteringizga autentifikatsiya qilingan tugunlarni qoʻshishi mumkin. Bu tokenlarni
`kubeadm token` buyrugʻi bilan koʻrish, yaratish va oʻchirish mumkin.
[kubeadm maʼlumotnomasiga](/docs/reference/setup-tools/kubeadm/kubeadm-token/) qarang.

### Pod tarmogʻi qoʻshimchasini oʻrnatish {#pod-network}

{{< caution >}}
Ushbu boʻlimda tarmoqni sozlash va joylashtirish tartibi haqida muhim maʼlumot bor.
Davom etishdan oldin ushbu maslahatning hammasini diqqat bilan oʻqing.

**Podlaringiz bir-biri bilan aloqa qila olishi uchun
{{< glossary_tooltip text="Konteyner tarmoq interfeysi" term_id="cni" >}}
(CNI) asosidagi Pod tarmogʻi qoʻshimchasini joylashtirishingiz shart.
Klaster DNS (CoreDNS) tarmoq oʻrnatilmaguncha ishga tushmaydi.**

- Pod tarmogʻingiz xost tarmoqlarining birortasi bilan ustma-ust tushmasligiga eʼtibor bering:
  biror ustma-ustlik boʻlsa, muammolarni koʻrishingiz ehtimoli yuqori.
  (Agar tarmoq plaginining afzal koʻrgan Pod
  tarmogʻi bilan ayrim xost tarmoqlaringiz orasida toʻqnashuv topsangiz, uning oʻrniga mos
  CIDR blokini oʻylab toping, soʻng undan `kubeadm init` paytida
  `--pod-network-cidr` bilan va tarmoq plaginingiz YAML ida almashtirish sifatida foydalaning).

- Sukut boʻyicha `kubeadm` klasteringizni
  [RBAC](/docs/reference/access-authn-authz/rbac/) (rolga asoslangan kirish
  nazorati) dan foydalanish va uni majburiy qoʻllash uchun sozlaydi.
  Pod tarmogʻi plaginingiz RBAC ni qoʻllab-quvvatlashiga va uni joylashtirish uchun ishlatadigan
  har qanday manifestlar ham shuni qoʻllab-quvvatlashiga ishonch hosil qiling.

- Klasteringiz uchun IPv6 dan — dual-stack yoki faqat IPv6
  tarmogʻi — foydalanmoqchi boʻlsangiz, Pod tarmogʻi plaginingiz
  IPv6 ni qoʻllab-quvvatlashiga ishonch hosil qiling.
  IPv6 qoʻllab-quvvatlashi CNI ga [v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0) da qoʻshilgan.

{{< /caution >}}

{{< note >}}
Kubeadm CNI dan mustaqil boʻlishi kerak va CNI provayderlarini tekshirish joriy e2e testlarimiz qamrovidan tashqarida.
CNI plagini bilan bogʻliq muammo topsangiz, kubeadm yoki kubernetes muammo kuzatuvchilari oʻrniga
uning oʻz muammo kuzatuvchisida chipta ochishingiz kerak.
{{< /note >}}

Bir nechta tashqi loyiha CNI yordamida Kubernetes Pod tarmoqlarini taqdim etadi, ularning baʼzilari
[tarmoq siyosatini](/docs/concepts/services-networking/network-policies/) ham qoʻllab-quvvatlaydi.

[Kubernetes tarmoq modelini](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)
amalga oshiradigan qoʻshimchalar roʻyxatiga qarang.

Kubernetes qoʻllab-quvvatlaydigan tarmoq qoʻshimchalarining toʻliq boʻlmagan roʻyxati uchun
[Qoʻshimchalarni oʻrnatish](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)
sahifasiga qarang.
Pod tarmogʻi qoʻshimchasini boshqaruv tekisligi tugunida yoki kubeconfig hisob maʼlumotlariga ega tugunda
quyidagi buyruq bilan oʻrnatishingiz mumkin:

```bash
kubectl apply -f <add-on.yaml>
```

{{< note >}}
Windows ni faqat bir nechta CNI plaginlari qoʻllab-quvvatlaydi. Batafsil maʼlumot va sozlash koʻrsatmalarini
[Windows ishchi tugunlarini qoʻshish](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config) sahifasida topishingiz mumkin.
{{< /note >}}

Har bir klasterga faqat bitta Pod tarmogʻini oʻrnatish mumkin.

Pod tarmogʻi oʻrnatilgach, u ishlayotganini `kubectl get pods --all-namespaces` chiqishida
CoreDNS Podi `Running` ekanini tekshirib tasdiqlashingiz mumkin.
CoreDNS Podi ishga tushib ishlagach, tugunlaringizni qoʻshish bilan davom etishingiz mumkin.

Tarmogʻingiz ishlamasa yoki CoreDNS `Running` holatida boʻlmasa, `kubeadm` uchun
[muammolarni bartaraf etish qoʻllanmasiga](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)
qarang.

### Boshqariladigan tugun yorliqlari

Sukut boʻyicha kubeadm tugun roʻyxatdan oʻtishida kubeletlar oʻzi qoʻllashi mumkin boʻlgan yorliqlarni cheklaydigan
[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)
qabul nazoratchisini yoqadi.
Qabul nazoratchisi hujjatida kubelet `--node-labels` parametri bilan qaysi yorliqlardan foydalanishga ruxsat etilishi yoritilgan.

{{< caution >}}
`NodeRestriction` qabul nazoratchisi tufayli ishga tushirish paytida cheklangan yorliqlarni (masalan, `node-role.kubernetes.io/*`)
qoʻllash uchun kubelet `--node-labels` bayrogʻidan foydalana **olmaysiz**.

Ushbu kubelet bayrogʻi yordamida cheklangan yorliqlarni qoʻshishga urinsangiz, tugun API serverda
roʻyxatdan oʻta olmaydi.
{{< /caution >}}

Bu yorliqlarni qoʻlda qoʻllash uchun tugun klasterga qoʻshilgandan keyin `kubectl label` dan foydalanishingiz kerak.
kubeadm boshqaradigan `/etc/kubernetes/admin.conf` kabi imtiyozli kubeconfig dan foydalanayotganingizga ishonch hosil qiling.

### Boshqaruv tekisligi tugunini ajratish

Sukut boʻyicha klasteringiz xavfsizlik sabablariga koʻra boshqaruv tekisligi tugunlarida Podlarni rejalashtirmaydi.
Boshqaruv tekisligi tugunlarida Podlarni rejalashtira olishni xohlasangiz,
masalan bitta mashinali Kubernetes klasteri uchun, quyidagini bajaring:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

Chiqish quyidagiga oʻxshash boʻladi:

```
node "test-01" untainted
...
```

Bu `node-role.kubernetes.io/control-plane:NoSchedule` taintini
unga ega har qanday tugundan, jumladan boshqaruv tekisligi tugunlaridan, olib tashlaydi. Bu degani,
rejalashtiruvchi keyin Podlarni hamma joyga rejalashtira oladi.

Bundan tashqari, boshqaruv tekisligi tugunidan uni backend serverlar roʻyxatidan chiqarib tashlaydigan
[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers) yorligʻini
olib tashlash uchun quyidagi buyruqni bajarishingiz mumkin:

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### Qoʻshimcha boshqaruv tekisligi tugunlarini qoʻshish

Qoʻshimcha boshqaruv tekisligi tugunlarini qoʻshib, yuqori mavjudlikka ega kubeadm klasterini yaratish qadamlari uchun
[kubeadm bilan yuqori mavjudlikka ega klasterlar yaratish](/docs/setup/production-environment/tools/kubeadm/high-availability/)
sahifasiga qarang.

### Ishchi tugunlarni qoʻshish {#join-nodes}

Ishchi tugunlar — ish yuklaringiz ishlaydigan joy.

Quyidagi sahifalar `kubeadm join` buyrugʻi yordamida klasterga Linux va Windows ishchi tugunlarini qanday qoʻshishni koʻrsatadi:

* [Linux ishchi tugunlarini qoʻshish](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Windows ishchi tugunlarini qoʻshish](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (Ixtiyoriy) Klasterni boshqaruv tekisligi tugunidan boshqa mashinalardan boshqarish

Boshqa kompyuterdagi (masalan, noutbuk) kubectl klasteringiz bilan aloqa qilishi uchun
administrator kubeconfig faylini boshqaruv tekisligi tugunidan
ish stansiyangizga quyidagicha nusxalashingiz kerak:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
Yuqoridagi misol root uchun SSH kirishi yoqilgan deb hisoblaydi. Aks holda,
`admin.conf` faylini boshqa foydalanuvchi kira oladigan qilib nusxalab,
oʻsha boshqa foydalanuvchi orqali `scp` qilishingiz mumkin.

`admin.conf` fayli foydalanuvchiga klaster ustidan _superfoydalanuvchi_ imtiyozlarini beradi.
Bu fayldan tejab foydalanish kerak. Oddiy foydalanuvchilar uchun imtiyoz beradigan
noyob hisob maʼlumotini yaratish tavsiya etiladi. Buni
`kubeadm kubeconfig user --client-name <CN>`
buyrugʻi bilan qilishingiz mumkin. Bu buyruq STDOUT ga KubeConfig faylini chiqaradi;
uni faylga saqlab, foydalanuvchingizga tarqatishingiz kerak. Shundan soʻng
`kubectl create (cluster)rolebinding` yordamida imtiyozlar bering.
{{< /note >}}

### (Ixtiyoriy) API serverni localhost ga proksi qilish

API serverga klaster tashqarisidan ulanmoqchi boʻlsangiz,
`kubectl proxy` dan foydalanishingiz mumkin:

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

Endi API serverga mahalliy ravishda `http://localhost:8001/api/v1` orqali kira olasiz

## Tozalash {#tear-down}

Agar klasteringiz uchun, sinov maqsadida, bir martalik serverlardan foydalangan boʻlsangiz,
ularni oʻchirib, qoʻshimcha tozalash qilmasligingiz mumkin. Klasterga mahalliy havolalaringizni
oʻchirish uchun `kubectl config delete-cluster` dan foydalanishingiz mumkin.

Biroq klasterni yanada tozaroq olib tashlamoqchi boʻlsangiz, avval
[tugunni boʻshatishingiz](/docs/reference/generated/kubectl/kubectl-commands#drain)
va tugun boʻsh ekaniga ishonch hosil qilishingiz, soʻng tugun konfiguratsiyasini olib tashlashingiz kerak.

### Tugunni olib tashlash

Tegishli hisob maʼlumotlari bilan boshqaruv tekisligi tuguniga murojaat qilib, quyidagini bajaring:

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

Tugunni olib tashlashdan oldin `kubeadm` oʻrnatgan holatni tiklang:

```bash
kubeadm reset
```

Tiklash jarayoni iptables qoidalarini yoki IPVS jadvallarini tiklamaydi va tozalamaydi.
iptables ni tiklamoqchi boʻlsangiz, buni qoʻlda qilishingiz kerak:

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

IPVS jadvallarini tiklamoqchi boʻlsangiz, quyidagi buyruqni bajarishingiz kerak:

```bash
ipvsadm -C
```

Endi tugunni olib tashlang:

```bash
kubectl delete node <node name>
```

Qaytadan boshlamoqchi boʻlsangiz, tegishli argumentlar bilan `kubeadm init` yoki `kubeadm join` ni bajaring.

### Boshqaruv tekisligini tozalash

Imkon qadar tozalashni ishga tushirish uchun boshqaruv tekisligi xostida `kubeadm reset` dan foydalanishingiz mumkin.

Ushbu kichik buyruq va uning parametrlari haqida qoʻshimcha maʼlumot uchun
[`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)
maʼlumotnoma hujjatiga qarang.

## Versiya farqi siyosati {#version-skew-policy}

kubeadm u boshqaradigan ayrim komponentlarga nisbatan versiya farqiga yoʻl qoʻysa-da, kubeadm versiyasini
boshqaruv tekisligi komponentlari, kube-proxy va kubelet versiyalari bilan moslash tavsiya etiladi.

### kubeadm ning Kubernetes versiyasiga nisbatan farqi

kubeadm kubeadm bilan bir xil versiyadagi yoki bir versiya eskiroq Kubernetes komponentlari bilan ishlatilishi mumkin.
Kubernetes versiyasini kubeadm ga `kubeadm init` ning
`--kubernetes-version` bayrogʻi yoki `--config` ishlatilganda
[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/)
maydoni orqali koʻrsatish mumkin. Bu parametr kube-apiserver, kube-controller-manager, kube-scheduler va kube-proxy
versiyalarini boshqaradi.

Misol:

* kubeadm {{< skew currentVersion >}} da
* `kubernetesVersion` {{< skew currentVersion >}} yoki {{< skew currentVersionAddMinor -1 >}} da boʻlishi kerak

### kubeadm ning kubelet ga nisbatan farqi

Kubernetes versiyasiga oʻxshab, kubeadm kubeadm bilan bir xil versiyadagi yoki uch versiya eskiroq
kubelet versiyasi bilan ishlatilishi mumkin.

Misol:

* kubeadm {{< skew currentVersion >}} da
* xostdagi kubelet {{< skew currentVersion >}}, {{< skew currentVersionAddMinor -1 >}},
  {{< skew currentVersionAddMinor -2 >}} yoki {{< skew currentVersionAddMinor -3 >}} da boʻlishi kerak

### kubeadm ning kubeadm ga nisbatan farqi

kubeadm buyruqlari kubeadm boshqaradigan mavjud tugunlar yoki butun klasterlarda qanday ishlashi boʻyicha muayyan cheklovlar bor.

Klasterga yangi tugunlar qoʻshilsa, `kubeadm join` uchun ishlatiladigan kubeadm binariysi klasterni `kubeadm init` bilan yaratishda
yoki xuddi shu tugunni `kubeadm upgrade` bilan yangilashda ishlatilgan kubeadm ning soʻnggi versiyasiga mos kelishi kerak.
`kubeadm upgrade` bundan mustasno, qolgan kubeadm buyruqlariga ham oʻxshash qoidalar tatbiq etiladi.

`kubeadm join` uchun misol:

* klaster `kubeadm init` bilan kubeadm {{< skew currentVersion >}} versiyasida yaratilgan
* Qoʻshilayotgan tugunlar {{< skew currentVersion >}} versiyasidagi kubeadm binariyasidan foydalanishi kerak

Yangilanayotgan tugunlar tugunni boshqarish uchun ishlatilgan kubeadm versiyasi bilan bir xil MINOR
versiyadagi yoki bir MINOR versiya yangiroq kubeadm versiyasidan foydalanishi kerak.

`kubeadm upgrade` uchun misol:

* tugun kubeadm {{< skew currentVersionAddMinor -1 >}} versiyasi bilan yaratilgan yoki yangilangan
* Tugunni yangilash uchun ishlatiladigan kubeadm versiyasi {{< skew currentVersionAddMinor -1 >}}
  yoki {{< skew currentVersion >}} da boʻlishi kerak

Turli Kubernetes komponentlari oʻrtasidagi versiya farqi haqida koʻproq bilish uchun
[Versiya farqi siyosati](/releases/version-skew-policy/) sahifasiga qarang.

## Cheklovlar {#limitations}

### Klaster barqarorligi {#resilience}

Bu yerda yaratilgan klasterda bitta boshqaruv tekisligi tuguni va unda ishlaydigan bitta etcd maʼlumotlar bazasi bor.
Bu degani, boshqaruv tekisligi tuguni ishdan chiqsa, klasteringiz maʼlumotlarni
yoʻqotishi va noldan qayta yaratilishi kerak boʻlishi mumkin.

Vaqtinchalik yechimlar:

* etcd dan muntazam [zaxira nusxa oling](https://etcd.io/docs/v3.5/op-guide/recovery/).
  kubeadm sozlagan etcd maʼlumotlar katalogi boshqaruv tekisligi tugunida `/var/lib/etcd` da joylashgan.

* Bir nechta boshqaruv tekisligi tugunidan foydalaning.
  [Yuqori mavjudlik](/docs/setup/production-environment/tools/kubeadm/high-availability/) ni taʼminlaydigan klaster
  topologiyasini tanlash uchun [Yuqori mavjudlik topologiyasi variantlari](/docs/setup/production-environment/tools/kubeadm/ha-topology/) ni oʻqishingiz mumkin.

### Platforma muvofiqligi {#multi-platform}

kubeadm deb/rpm paketlari va binariylari amd64, arm (32-bit), arm64, ppc64le va s390x uchun
[koʻp platformali taklifga](https://git.k8s.io/design-proposals-archive/multi-platform.md) muvofiq yigʻiladi.

Boshqaruv tekisligi va qoʻshimchalar uchun koʻp platformali konteyner obrazlari ham v1.12 dan beri qoʻllab-quvvatlanadi.

Tarmoq provayderlarining faqat bir qismi barcha platformalar uchun yechimlar taklif etadi. Provayder tanlagan
platformangizni qoʻllab-quvvatlashini aniqlash uchun yuqoridagi tarmoq provayderlari roʻyxatiga yoki har bir provayder hujjatiga qarang.

## Muammolarni bartaraf etish {#troubleshooting}

kubeadm bilan qiyinchiliklarga duch kelsangiz,
[muammolarni bartaraf etish hujjatlarimizga](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/) qarang.

<!-- discussion -->

## {{% heading "whatsnext" %}}

* Klasteringiz toʻgʻri ishlayotganini [Sonobuoy](https://github.com/heptio/sonobuoy) bilan tekshiring
* <a id="lifecycle" />`kubeadm` yordamida klasteringizni yangilash tafsilotlari uchun [kubeadm klasterlarini yangilash](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
  sahifasiga qarang.
* [kubeadm maʼlumotnoma hujjatida](/docs/reference/setup-tools/kubeadm/) `kubeadm` dan ilgʻor foydalanish haqida bilib oling
* Kubernetes [tushunchalari](/docs/concepts/) va [`kubectl`](/docs/reference/kubectl/) haqida koʻproq bilib oling.
* Pod tarmogʻi qoʻshimchalarining kattaroq roʻyxati uchun [Klaster tarmogʻi](/docs/concepts/cluster-administration/networking/) sahifasiga qarang
* <a id="other-addons" />Jurnallash, monitoring, tarmoq siyosati, vizualizatsiya va
  Kubernetes klasteringizni boshqarish vositalarini oʻz ichiga olgan boshqa qoʻshimchalarni oʻrganish uchun [qoʻshimchalar roʻyxatiga](/docs/concepts/cluster-administration/addons/) qarang.
* Klasteringiz klaster hodisalari jurnallarini va Podlarda ishlayotgan
  ilovalar jurnallarini qanday qayta ishlashini sozlang.
  Nima talab qilinishi haqida umumiy maʼlumot uchun [Jurnallash arxitekturasi](/docs/concepts/cluster-administration/logging/)
  sahifasiga qarang.

### Fikr-mulohaza {#feedback}

* Xatolar uchun [kubeadm GitHub muammo kuzatuvchisiga](https://github.com/kubernetes/kubeadm/issues) kiring
* Qoʻllab-quvvatlash uchun
  [#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slack kanaliga kiring
* SIG Cluster Lifecycle umumiy ishlab chiqish Slack kanali:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG maʼlumoti](https://github.com/kubernetes/community/tree/main/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycle pochta roʻyxati:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
