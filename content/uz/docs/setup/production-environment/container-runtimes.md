---
# reviewers:
# - vincepri
# - bart0sh
title: Konteyner runtimelari
content_type: concept
weight: 20
---
<!-- overview -->

{{% dockershim-removal %}}

Podlar u yerda ishlay olishi uchun klasterdagi har bir tugunga
{{< glossary_tooltip text="konteyner runtime" term_id="container-runtime" >}}
oʻrnatishingiz kerak. Ushbu sahifa nimalar kirishini qisqacha bayon qiladi
va tugunlarni sozlashga oid vazifalarni tavsiflaydi.

Kubernetes {{< skew currentVersion >}}
{{< glossary_tooltip term_id="cri" text="Konteyner runtime interfeysi">}} (CRI) ga mos runtime dan foydalanishingizni talab qiladi.

Qoʻshimcha axborot uchun [CRI versiyalarini qoʻllab-quvvatlash](#cri-versions) boʻlimiga qarang.

Ushbu sahifa Kubernetes bilan bir nechta keng tarqalgan konteyner runtimelaridan qanday foydalanishning
qisqacha tavsifini beradi.

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker Engine](#docker)
- [Mirantis Container Runtime](#mcr)

{{< note >}}
v1.24 dan oldingi Kubernetes relizlari Docker Engine bilan bevosita integratsiyani oʻz ichiga olgan.
Bunda _dockershim_ deb nomlangan komponent ishlatilgan. Bu maxsus bevosita integratsiya endi
Kubernetesning bir qismi emas (bu olib tashlash
v1.20 relizining bir qismi sifatida
[eʼlon qilingan](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation)).
Bu olib tashlash sizga qanday taʼsir qilishi mumkinligini tushunish uchun
[Dockershim olib tashlanishi sizga taʼsir qilishini tekshiring](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
sahifasini oʻqishingiz mumkin. dockershimdan koʻchish haqida bilish uchun
[dockershimdan koʻchish](/docs/tasks/administer-cluster/migrating-from-dockershim/) sahifasiga qarang.

Agar v{{< skew currentVersion >}} dan boshqa Kubernetes versiyasini ishga tushirayotgan boʻlsangiz,
oʻsha versiya hujjatlari bilan tanishing.
{{< /note >}}

<!-- body -->
## Talablarni oʻrnatish va sozlash {#install-and-configure-prerequisites}

### Tarmoq konfiguratsiyasi {#network-configuration}

Standart holatda Linux yadrosi IPv4 paketlarini interfeyslar orasida
marshrutlashga ruxsat bermaydi. Kubernetes klaster tarmogʻining aksariyat amalga oshirishlari
bu sozlamani (kerak boʻlsa) oʻzgartiradi, lekin ayrimlari buni
administratorning oʻzi qilishini kutishi mumkin. (Ayrimlari boshqa sysctl
parametrlari belgilanishini, yadro modullari yuklanishini va boshqalarni ham kutishi mumkin; aniq
tarmoq amalga oshirishining hujjatlari bilan tanishing.)

### IPv4 paketlarini yoʻnaltirishni yoqish {#prerequisite-ipv4-forwarding-optional}

IPv4 paketlarini yoʻnaltirishni qoʻlda yoqish uchun:

```bash
# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

`net.ipv4.ip_forward` 1 ga teng ekanini quyidagi bilan tekshiring:

```bash
sysctl net.ipv4.ip_forward
```

## cgroup drayverlari {#cgroup-drivers}

Linuxda jarayonlarga ajratiladigan resurslarni cheklash uchun {{< glossary_tooltip text="boshqaruv guruhlari" term_id="cgroup" >}}
dan foydalaniladi.

Ham {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, ham
uning ostidagi konteyner runtime [Podlar va konteynerlar uchun resurslarni boshqarish](/docs/concepts/configuration/manage-resources-containers/)
ni qoʻllash
hamda cpu/xotira soʻrovlari va cheklovlari kabi resurslarni belgilash uchun boshqaruv guruhlari bilan ishlashi kerak. Boshqaruv
guruhlari bilan ishlash uchun kubelet va konteyner runtime *cgroup drayveri*dan foydalanishi kerak.
kubelet va konteyner runtime bir xil cgroup
drayveridan foydalanishi va bir xil sozlanishi juda muhim.

Ikki xil cgroup drayveri mavjud:

* [`cgroupfs`](#cgroupfs-cgroup-driver)
* [`systemd`](#systemd-cgroup-driver)

### cgroupfs drayveri {#cgroupfs-cgroup-driver}

`cgroupfs` drayveri [kubeletdagi standart cgroup drayveri](/docs/reference/config-api/kubelet-config.v1beta1) dir.
 `cgroupfs` drayveri ishlatilganda kubelet va konteyner runtime cgrouplarni sozlash uchun
 cgroup fayl tizimi bilan bevosita ishlaydi.

[systemd](https://www.freedesktop.org/wiki/Software/systemd/) init
tizimi boʻlganda `cgroupfs` drayveri **tavsiya etilmaydi**, chunki systemd tizimda bitta cgroup menejerini
kutadi. Qoʻshimcha ravishda, agar [cgroup v2](/docs/concepts/architecture/cgroups) dan foydalansangiz, `cgroupfs`
oʻrniga `systemd`
cgroup drayveridan foydalaning.

### systemd cgroup drayveri {#systemd-cgroup-driver}

Linux distributivi uchun init
tizimi sifatida [systemd](https://www.freedesktop.org/wiki/Software/systemd/) tanlanganda init jarayoni ildiz boshqaruv guruhini
(`cgroup`) yaratadi va isteʼmol qiladi hamda cgroup menejeri sifatida ishlaydi.

systemd cgrouplar bilan zich integratsiyalashgan va har bir systemd
unit uchun cgroup ajratadi. Natijada, agar init tizimi sifatida `systemd` dan `cgroupfs`
drayveri bilan foydalansangiz, tizimda ikki xil cgroup menejeri paydo boʻladi.

Ikki cgroup menejeri tizimdagi mavjud va foydalanilayotgan resurslarning ikki xil koʻrinishiga olib keladi.
Ayrim hollarda kubelet va konteyner runtime uchun `cgroupfs` dan foydalanishga sozlangan, lekin qolgan jarayonlar uchun `systemd` dan foydalanadigan
tugunlar resurs bosimi ostida
beqaror boʻlib qoladi.

Bu beqarorlikni yumshatish yoʻli — systemd tanlangan init tizimi boʻlganda kubelet va
konteyner runtime uchun cgroup drayveri sifatida `systemd` dan foydalanishdir.

`systemd` ni cgroup drayveri sifatida belgilash uchun
[`KubeletConfiguration`](/docs/tasks/administer-cluster/kubelet-config-file/)
dagi `cgroupDriver` parametrini tahrirlang va uni `systemd` ga oʻrnating. Masalan:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
...
cgroupDriver: systemd
```

Agar kubelet uchun cgroup drayveri sifatida `systemd` ni sozlasangiz, konteyner runtime uchun ham
cgroup drayveri sifatida `systemd` ni sozlashingiz kerak. Koʻrsatmalar uchun
konteyner runtimeingiz hujjatlariga qarang. Masalan:

*  [containerd](#containerd-systemd)
*  [CRI-O](#cri-o)

Kubernetes {{< skew currentVersion >}} da `KubeletCgroupDriverFromCRI`
[funksiya darvozasi](/docs/reference/command-line-tools-reference/feature-gates/)
yoqilgan va `RuntimeConfig` CRI RPC ni qoʻllab-quvvatlaydigan konteyner runtime boʻlsa,
kubelet runtimedan mos cgroup drayverini avtomatik aniqlaydi
va kubelet konfiguratsiyasidagi `cgroupDriver` sozlamasini eʼtiborsiz qoldiradi.

Biroq konteyner runtimelarining eskiroq versiyalari (xususan,
containerd 1.y va undan past) `RuntimeConfig` CRI RPC ni qoʻllab-quvvatlamaydi va
bu soʻrovga toʻgʻri javob bermasligi mumkin. Shunda kubelet oʻz
`--cgroup-driver` flagidagi qiymatga qaytadi.

Kubernetes 1.38 da bu zaxira xatti-harakat olib tashlanadi va containerd ning eskiroq versiyalari
yangi kubeletlar bilan ishdan chiqadi.

{{< caution >}}
Klasterga qoʻshilgan Node ning cgroup drayverini oʻzgartirish sezgir amaldir.
Agar kubelet Podlarni bitta cgroup drayverining semantikasi bilan yaratgan boʻlsa, konteyner
runtimeni boshqa cgroup drayveriga oʻzgartirish bunday mavjud Podlar uchun Pod sandboxini qayta yaratishga urinilganda xatolarga olib kelishi mumkin. kubeletni qayta ishga tushirish bunday xatolarni hal qilmasligi mumkin.

Agar buni amalga oshirish imkonini beradigan avtomatlashtirish boʻlsa, tugunni yangilangan
konfiguratsiyadagi boshqa tugun bilan almashtiring yoki uni avtomatlashtirish yordamida qayta oʻrnating.
{{< /caution >}}

## CRI versiyalarini qoʻllab-quvvatlash {#cri-versions}

Konteyner runtimeingiz konteyner runtime interfeysining v1 versiyasini qoʻllab-quvvatlashi kerak.

[v1.26 dan boshlab](/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#cri-api-removal) Kubernetes
faqat CRI API ning v1 versiyasi bilan _ishlaydi_. Agar konteyner runtime v1 API ni qoʻllab-quvvatlamasa,
kubelet tugun sifatida roʻyxatdan oʻtmaydi.

## Konteyner runtimelari {#container-runtimes}

{{% thirdparty-content %}}

### containerd {#containerd}

Ushbu boʻlim containerd ni CRI runtime sifatida ishlatish uchun zarur qadamlarni qisqacha bayon qiladi.

Tizimingizga containerd oʻrnatish uchun
[containerd bilan ishni boshlash](https://github.com/containerd/containerd/blob/main/docs/getting-started.md) boʻyicha koʻrsatmalarga amal qiling.
Yaroqli `config.toml` konfiguratsiya faylini yaratganingizdan soʻng ushbu qadamga qayting.

{{< tabs name="Finding your config.toml file" >}}
{{% tab name="Linux" %}}
Bu faylni `/etc/containerd/config.toml` yoʻlida topishingiz mumkin.
{{% /tab %}}
{{% tab name="Windows" %}}
Bu faylni `C:\Program Files\containerd\config.toml` yoʻlida topishingiz mumkin.
{{% /tab %}}
{{< /tabs >}}

Linuxda containerd uchun standart CRI soketi `/run/containerd/containerd.sock` dir.
Windowsda standart CRI endpointi `npipe://./pipe/containerd-containerd` dir.

#### `systemd` cgroup drayverini sozlash {#containerd-systemd}

`runc` bilan `/etc/containerd/config.toml` da `systemd` cgroup drayveridan foydalanish uchun
Containerd versiyangizga qarab quyidagi konfiguratsiyani belgilang

Containerd 1.x versiyalari:

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Containerd 2.x versiyalari:

```
[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
  ...
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]
    SystemdCgroup = true
```

Agar [cgroup v2](/docs/concepts/architecture/cgroups) dan foydalansangiz, `systemd` cgroup drayveri tavsiya etiladi.

{{< note >}}
Agar containerd ni paketdan (masalan, RPM yoki `.deb`) oʻrnatgan boʻlsangiz,
CRI integratsiya plagini standart holatda oʻchirilgan boʻlishi mumkin.

containerd ni Kubernetes bilan ishlatish uchun CRI qoʻllab-quvvatlashi yoqilgan boʻlishi kerak. `/etc/containerd/config.toml` ichidagi `disabled_plugins` roʻyxatiga `cri`
kiritilmaganiga ishonch hosil qiling;
agar bu faylga oʻzgartirish kiritgan boʻlsangiz, `containerd` ni ham qayta ishga tushiring.

Dastlabki klaster oʻrnatilishidan soʻng yoki
CNI oʻrnatilgandan keyin konteynerlar qayta-qayta ishdan chiqishini (crash loop) kuzatsangiz, paket bilan kelgan containerd konfiguratsiyasida
mos kelmaydigan konfiguratsiya parametrlari boʻlishi mumkin. containerd konfiguratsiyasini
[getting-started.md](https://github.com/containerd/containerd/blob/main/docs/getting-started.md#advanced-topics) da koʻrsatilganidek `containerd config default > /etc/containerd/config.toml` bilan qayta tiklashni koʻrib chiqing
va soʻng yuqorida koʻrsatilgan konfiguratsiya parametrlarini mos ravishda belgilang.
{{< /note >}}

Agar bu oʻzgarishni qoʻllasangiz, containerd ni qayta ishga tushirishni unutmang:

```shell
sudo systemctl restart containerd
```

Kubernetes v1.28 da cgroup drayverini avtomatik aniqlashni
alpha imkoniyat sifatida yoqishingiz mumkin. Batafsil maʼlumot uchun [systemd cgroup drayveri](#systemd-cgroup-driver)
boʻlimiga qarang.

#### Sandbox (pause) obrazini almashtirish {#override-pause-image-containerd}

[containerd konfiguratsiyangizda](https://github.com/containerd/containerd/blob/main/docs/cri/config.md) quyidagi konfiguratsiyani belgilash orqali
sandbox obrazini qayta yozishingiz mumkin:

```toml
[plugins."io.containerd.grpc.v1.cri"]
  sandbox_image = "registry.k8s.io/pause:3.10"
```

Konfiguratsiya faylini yangilagandan soʻng `containerd` ni ham qayta ishga tushirishingiz kerak boʻlishi mumkin: `systemctl restart containerd`.

### CRI-O {#cri-o}

Ushbu boʻlim CRI-O ni konteyner runtime sifatida oʻrnatish uchun zarur qadamlarni oʻz ichiga oladi.

CRI-O oʻrnatish uchun [CRI-O oʻrnatish koʻrsatmalari](https://github.com/cri-o/packaging/blob/main/README.md#usage) ga amal qiling.

#### cgroup drayveri {#cgroup-driver}

CRI-O standart holatda systemd cgroup drayveridan foydalanadi va bu odatda
sizga mos keladi. `cgroupfs` cgroup drayveriga oʻtish uchun
`/etc/crio/crio.conf` ni tahrirlang yoki drop-in konfiguratsiyani
`/etc/crio/crio.conf.d/02-cgroup-manager.conf` ga joylang, masalan:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

CRI-O `cgroupfs` bilan ishlatilganda `pod` qiymatiga oʻrnatilishi kerak boʻlgan oʻzgartirilgan `conmon_cgroup` ga ham
diqqat qiling. Odatda kubelet (odatda kubeadm orqali bajariladi) va CRI-O ning
cgroup drayveri konfiguratsiyasini mos holda saqlash kerak.

Kubernetes v1.28 da cgroup drayverini avtomatik aniqlashni
alpha imkoniyat sifatida yoqishingiz mumkin. Batafsil maʼlumot uchun [systemd cgroup drayveri](#systemd-cgroup-driver)
boʻlimiga qarang.

CRI-O uchun CRI soketi standart holatda `/var/run/crio/crio.sock` dir.

#### Sandbox (pause) obrazini almashtirish {#override-pause-image-cri-o}

[CRI-O konfiguratsiyangizda](https://github.com/cri-o/cri-o/blob/main/docs/crio.conf.5.md) quyidagi
konfiguratsiya qiymatini belgilashingiz mumkin:

```toml
[crio.image]
pause_image="registry.k8s.io/pause:3.10"
```

Bu konfiguratsiya parametri ushbu oʻzgarishni qoʻllash uchun jonli konfiguratsiya qayta yuklashini qoʻllab-quvvatlaydi: `systemctl reload crio` yoki
`crio` jarayoniga `SIGHUP` yuborish orqali.

### Docker Engine {#docker}

{{< note >}}
Ushbu koʻrsatmalar Docker Engine ni Kubernetes bilan integratsiya qilish uchun
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) adapteridan foydalanayotganingizni
nazarda tutadi.
{{< /note >}}

1. Har bir tuguningizda Linux distributivingiz uchun Docker ni
  [Docker Engine ni oʻrnatish](https://docs.docker.com/engine/install/#server) boʻyicha oʻrnating.

2. Hujjatlarning oʻrnatish boʻlimidagi koʻrsatmalarga amal qilib, [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install) ni oʻrnating.

`cri-dockerd` uchun CRI soketi standart holatda `/run/cri-dockerd.sock` dir.

### Mirantis Container Runtime {#mcr}

[Mirantis Container Runtime](https://docs.mirantis.com/mcr/25.0/overview.html) (MCR) — ilgari Docker Enterprise Edition nomi bilan maʼlum boʻlgan, tijorat
tarzida mavjud konteyner runtime dir.

Mirantis Container Runtime dan Kubernetes bilan MCR tarkibidagi ochiq manbali
[`cri-dockerd`](https://mirantis.github.io/cri-dockerd/) komponenti yordamida foydalanishingiz mumkin.

Mirantis Container Runtime ni qanday oʻrnatish haqida koʻproq bilish uchun
[MCR joylashtirish qoʻllanmasi](https://docs.mirantis.com/mcr/25.0/install.html) ga kiring.

CRI soketiga yoʻlni aniqlash uchun `cri-docker.socket` nomli systemd unitini tekshiring.

#### Sandbox (pause) obrazini almashtirish {#override-pause-image-cri-dockerd-mcr}

`cri-dockerd` adapteri Pod infratuzilma konteyneri (“pause image”) sifatida qaysi konteyner obrazidan foydalanishni
koʻrsatish uchun buyruq qatori argumentini qabul qiladi.
Foydalaniladigan buyruq qatori argumenti `--pod-infra-container-image` dir.

## {{% heading "whatsnext" %}} {#what-s-next}

Konteyner runtime bilan birga klasteringizga ishlaydigan
[tarmoq plagini](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model) ham kerak boʻladi.
