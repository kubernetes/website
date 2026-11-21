---
title: kubeadm ni oʻrnatish
content_type: task
weight: 10
card:
  name: setup
  weight: 40
  title: kubeadm sozlash vositasini oʻrnatish
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
Ushbu sahifa `kubeadm` vositalar toʻplamini qanday oʻrnatishni koʻrsatadi.
Ushbu oʻrnatish jarayonini bajarganingizdan soʻng kubeadm bilan klaster yaratish haqida maʼlumot uchun
[kubeadm bilan klaster yaratish](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/) sahifasiga qarang.

{{< doc-versions-list "oʻrnatish qoʻllanmasi" >}}

## {{% heading "prerequisites" %}} {#before-you-begin}

* Mos Linux xosti. Kubernetes loyihasi Debian va Red Hat asosidagi Linux distributivlari
  hamda paket menejerisiz distributivlar uchun umumiy koʻrsatmalar beradi.
* Har bir mashinada 2 GB yoki undan koʻp RAM (bundan kam boʻlsa, ilovalaringiz uchun joy deyarli qolmaydi).
* Boshqaruv tekisligi mashinalari uchun 2 ta yoki undan koʻp CPU.
* Klasterdagi barcha mashinalar oʻrtasida toʻliq tarmoq ulanishi (ommaviy yoki xususiy tarmoq boʻlishi mumkin).
* Har bir tugun uchun noyob hostname, MAC manzil va product_uuid. Batafsil maʼlumot uchun [bu yerga](#verify-mac-address) qarang.
* Mashinalaringizda muayyan portlar ochiq. Batafsil maʼlumot uchun [bu yerga](#check-required-ports) qarang.

{{< note >}}
`kubeadm` oʻrnatilishi dinamik bogʻlanishdan foydalanadigan binariylar orqali amalga oshiriladi va maqsad tizimingiz `glibc` ni taqdim etadi deb hisoblaydi.
Bu koʻp Linux distributivlarida (jumladan Debian, Ubuntu, Fedora, CentOS va boshqalar) asosli taxmin,
lekin sukut boʻyicha `glibc` ni oʻz ichiga olmaydigan maxsus va yengil distributivlarda, masalan Alpine Linux da, har doim ham shunday emas.
Kutilgani shuki, distributiv yo `glibc` ni, yo kutilgan belgilarni taqdim etadigan
[muvofiqlik qatlamini](https://wiki.alpinelinux.org/wiki/Running_glibc_programs) oʻz ichiga oladi.
{{< /note >}}

<!-- steps -->

## OT versiyangizni tekshirish

{{% thirdparty-content %}}

{{< tabs name="operating_system_version_check" >}}
{{% tab name="Linux" %}}

* kubeadm loyihasi LTS yadrolarni qoʻllab-quvvatlaydi. [LTS yadrolar roʻyxati](https://www.kernel.org/category/releases.html) ga qarang.
* Yadro versiyasini `uname -r` buyrugʻi bilan olishingiz mumkin

Qoʻshimcha maʼlumot uchun [Linux yadrosi talablari](/docs/reference/node/kernel-version-requirements/) sahifasiga qarang.

{{% /tab %}}

{{% tab name="Windows" %}}

* kubeadm loyihasi yaqin yadro versiyalarini qoʻllab-quvvatlaydi. Yaqin yadrolar roʻyxati uchun [Windows Server reliz maʼlumoti](https://learn.microsoft.com/en-us/windows/release-health/windows-server-release-info) ga qarang.
* Yadro versiyasini (OT versiyasi ham deyiladi) `systeminfo` buyrugʻi bilan olishingiz mumkin

Qoʻshimcha maʼlumot uchun [Windows OT versiyasi muvofiqligi](/docs/concepts/windows/intro/#windows-os-version-support) sahifasiga qarang.

{{% /tab %}}
{{< /tabs >}}

kubeadm yaratgan Kubernetes klasteri yadro imkoniyatlaridan foydalanadigan dasturiy taʼminotga bogʻliq.
Bu dasturiy taʼminot quyidagilarni oʻz ichiga oladi, lekin ular bilan cheklanmaydi:
{{< glossary_tooltip text="konteyner runtime" term_id="container-runtime" >}},
{{< glossary_tooltip term_id="kubelet" text="kubelet">}} va {{< glossary_tooltip text="Konteyner tarmoq interfeysi" term_id="cni" >}} plagini.

Qoʻllab-quvvatlanmaydigan yadro versiyasi tufayli kutilmagan xatolarning oldini olishingizga yordam berish uchun kubeadm `SystemVerification`
oldindan tekshiruvini bajaradi. Yadro versiyasi qoʻllab-quvvatlanmasa, bu tekshiruv muvaffaqiyatsiz tugaydi.

Yadroingiz talab qilinadigan imkoniyatlarni berishini bilsangiz, kubeadm uning versiyasini qoʻllab-quvvatlamasa ham,
tekshiruvni oʻtkazib yuborishingiz mumkin.

## Har bir tugun uchun MAC manzil va product_uuid noyobligini tekshirish {#verify-mac-address}

* Tarmoq interfeyslarining MAC manzilini `ip link` yoki `ifconfig -a` buyrugʻi bilan olishingiz mumkin
* product_uuid ni `sudo cat /sys/class/dmi/id/product_uuid` buyrugʻi bilan tekshirish mumkin

Apparat qurilmalari noyob manzillarga ega boʻlishi ehtimoli juda yuqori, garchi ayrim virtual mashinalar
bir xil qiymatlarga ega boʻlishi mumkin. Kubernetes bu qiymatlardan klasterdagi tugunlarni noyob identifikatsiya qilish uchun foydalanadi.
Agar bu qiymatlar har bir tugun uchun noyob boʻlmasa, oʻrnatish jarayoni
[muvaffaqiyatsiz tugashi](https://github.com/kubernetes/kubeadm/issues/31) mumkin.

## Tarmoq adapterlarini tekshirish

Agar bir nechta tarmoq adapteringiz boʻlsa va Kubernetes komponentlaringiz standart
marshrutda yetib boʻlmasa, Kubernetes klaster manzillari mos adapter orqali oʻtishi uchun IP marshrut(lar)ini qoʻshishingizni tavsiya qilamiz.

## Talab qilinadigan portlarni tekshirish {#check-required-ports}

Kubernetes komponentlari bir-biri bilan aloqa qila olishi uchun ushbu
[talab qilinadigan portlar](/docs/reference/networking/ports-and-protocols/) ochiq boʻlishi kerak.
Port ochiqligini tekshirish uchun [netcat](https://netcat.sourceforge.net) kabi vositalardan foydalanishingiz mumkin. Masalan:

```shell
nc 127.0.0.1 6443 -zv -w 2
```

Foydalanadigan Pod tarmogʻi plaginingiz ham muayyan portlarning
ochiq boʻlishini talab qilishi mumkin. Bu har bir Pod tarmogʻi plaginida farq qilgani sababli, ularga qaysi port(lar)
kerakligi haqida plaginlar hujjatiga qarang.

## Swap konfiguratsiyasi {#swap-configuration}

kubelet ning standart xatti-harakati — tugunda swap xotirasi aniqlansa, ishga tushmaslikdir.
Bu degani, swap yo oʻchirilishi, yo kubelet tomonidan ruxsat etilishi kerak.

* Swap ga ruxsat berish uchun kubelet konfiguratsiyasiga yoki buyruq qatori argumenti sifatida `failSwapOn: false` ni qoʻshing.
  Eslatma: `failSwapOn: false` berilsa ham, ish yuklari sukut boʻyicha swap ga kira olmaydi.
  Buni yana kubelet konfiguratsiya faylida `swapBehavior` oʻrnatish orqali oʻzgartirish mumkin. Swap dan foydalanish uchun
  standart `NoSwap` sozlamasidan boshqa `swapBehavior` oʻrnating.
  Batafsil maʼlumot uchun [Swap xotirasini boshqarish](/docs/concepts/cluster-administration/swap-memory-management) sahifasiga qarang.
* Swap ni oʻchirish uchun vaqtincha almashtirishni oʻchirishda `sudo swapoff -a` dan foydalanish mumkin.
  Bu oʻzgarish qayta yuklashlar davomida saqlanishi uchun tizimingizda qanday sozlanganiga qarab
  `/etc/fstab`, `systemd.swap` kabi konfiguratsiya fayllarida swap oʻchirilganiga ishonch hosil qiling.


## Konteyner runtime ni oʻrnatish {#installing-runtime}

Podlardagi konteynerlarni ishga tushirish uchun Kubernetes
{{< glossary_tooltip term_id="container-runtime" text="konteyner runtime" >}} dan foydalanadi.

Sukut boʻyicha Kubernetes tanlagan konteyner runtime bilan ishlash uchun
{{< glossary_tooltip term_id="cri" text="Konteyner runtime interfeysi">}} (CRI)
dan foydalanadi.

Runtime koʻrsatmasangiz, kubeadm maʼlum endpointlar roʻyxatini koʻzdan kechirib, oʻrnatilgan
konteyner runtimeni avtomatik aniqlashga urinadi.

Bir nechta konteyner runtime aniqlansa yoki hech biri aniqlanmasa, kubeadm xato beradi
va qaysi biridan foydalanmoqchi ekaningizni koʻrsatishingizni soʻraydi.

Qoʻshimcha maʼlumot uchun [konteyner runtimelari](/docs/setup/production-environment/container-runtimes/)
sahifasiga qarang.

{{< note >}}
Docker Engine Kubernetes bilan ishlashi uchun konteyner runtime ga talab boʻlgan
[CRI](/docs/concepts/architecture/cri/) ni amalga oshirmaydi.
Shu sababli qoʻshimcha [cri-dockerd](https://mirantis.github.io/cri-dockerd/) xizmati
oʻrnatilishi kerak. cri-dockerd — kubelet dan 1.24 versiyasida [olib tashlangan](/dockershim)
oʻrnatilgan Docker Engine qoʻllab-quvvatlashiga asoslangan loyihadir.
{{< /note >}}

Quyidagi jadvallar qoʻllab-quvvatlanadigan operatsion tizimlar uchun maʼlum endpointlarni oʻz ichiga oladi:

{{< tabs name="container_runtime" >}}
{{% tab name="Linux" %}}

{{< table caption="Linux konteyner runtimelari" >}}
| Runtime                            | Unix domen soketiga yoʻl                     |
|------------------------------------|----------------------------------------------|
| containerd                         | `unix:///var/run/containerd/containerd.sock` |
| CRI-O                              | `unix:///var/run/crio/crio.sock`             |
| Docker Engine (cri-dockerd yordamida) | `unix:///var/run/cri-dockerd.sock`        |
{{< /table >}}

{{% /tab %}}

{{% tab name="Windows" %}}

{{< table caption="Windows konteyner runtimelari" >}}
| Runtime                            | Windows nomlangan quvuriga yoʻl              |
|------------------------------------|----------------------------------------------|
| containerd                         | `npipe:////./pipe/containerd-containerd`     |
| Docker Engine (cri-dockerd yordamida) | `npipe:////./pipe/cri-dockerd`            |
{{< /table >}}

{{% /tab %}}
{{< /tabs >}}

## kubeadm, kubelet va kubectl ni oʻrnatish

Bu paketlarni barcha mashinalaringizga oʻrnatasiz:

* `kubeadm`: klasterni boshlangʻich sozlash buyrugʻi.

* `kubelet`: klasteringizdagi barcha mashinalarda ishlaydigan va Podlar hamda
  konteynerlarni ishga tushirish kabi ishlarni bajaradigan komponent.

* `kubectl`: klasteringiz bilan aloqa qiladigan buyruq qatori utiliti.

kubeadm siz uchun `kubelet` yoki `kubectl` ni **oʻrnatmaydi** va boshqarmaydi, shuning uchun ular kubeadm siz uchun
oʻrnatishini xohlagan Kubernetes boshqaruv tekisligi versiyasiga mos kelishini taʼminlashingiz
kerak. Aks holda kutilmagan, xatoliklar bilan xatti-harakatga olib kelishi mumkin boʻlgan versiya farqi yuz berish xavfi bor. Biroq kubelet va
boshqaruv tekisligi oʻrtasida _bitta_ kichik versiya farqi qoʻllab-quvvatlanadi, lekin kubelet versiyasi hech qachon API
server versiyasidan oshmasligi kerak. Masalan, 1.7.0 ishlayotgan kubelet 1.8.0 API server bilan toʻliq mos boʻlishi kerak,
aksincha emas.

`kubectl` ni oʻrnatish haqida maʼlumot uchun [kubectl ni oʻrnatish va sozlash](/docs/tasks/tools/) sahifasiga qarang.

{{< warning >}}
Ushbu koʻrsatmalar barcha Kubernetes paketlarini har qanday tizim yangilanishlaridan chiqarib tashlaydi.
Buning sababi kubeadm va Kubernetes
[yangilashga alohida eʼtibor](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) talab qiladi.
{{</ warning >}}

Versiya farqlari haqida qoʻshimcha maʼlumot uchun quyidagilarga qarang:

* Kubernetes [versiya va versiya farqi siyosati](/docs/setup/release/version-skew-policy/)
* Kubeadm ga xos [versiya farqi siyosati](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#version-skew-policy)

{{% legacy-repos-deprecation %}}

{{< note >}}
Har bir Kubernetes kichik versiyasi uchun alohida paket repozitoriyasi bor. v{{< skew currentVersion >}} dan boshqa
kichik versiyani oʻrnatmoqchi boʻlsangiz, xohlagan kichik versiyangiz uchun oʻrnatish qoʻllanmasiga qarang.
{{< /note >}}

{{< tabs name="k8s_install" >}}
{{% tab name="Debian asosidagi distributivlar" %}}

Ushbu koʻrsatmalar Kubernetes v{{< skew currentVersion >}} uchun.

1. `apt` paket indeksini yangilang va Kubernetes `apt` repozitoriyasidan foydalanish uchun kerakli paketlarni oʻrnating:

   ```shell
   sudo apt-get update
   # apt-transport-https may be a dummy package; if so, you can skip that package
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   ```

2. Kubernetes paket repozitoriyalari uchun ochiq imzo kalitini yuklab oling.
   Barcha repozitoriyalar uchun bir xil imzo kaliti ishlatiladi, shuning uchun URL dagi versiyaga eʼtibor bermasligingiz mumkin:

   ```shell
   # If the directory `/etc/apt/keyrings` does not exist, it should be created before the curl command, read the note below.
   # sudo mkdir -p -m 755 /etc/apt/keyrings
   curl -fsSL https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   ```

{{< note >}}
Debian 12 va Ubuntu 22.04 dan eski relizlarda `/etc/apt/keyrings` katalogi
sukut boʻyicha mavjud emas va curl buyrugʻidan oldin yaratilishi kerak.
{{< /note >}}

3. Mos Kubernetes `apt` repozitoriyasini qoʻshing. Eʼtibor bering, bu repozitoriyada faqat
   Kubernetes {{< skew currentVersion >}} uchun paketlar bor; boshqa Kubernetes kichik versiyalari uchun URL dagi
   Kubernetes kichik versiyasini xohlagan kichik versiyangizga moslab oʻzgartirishingiz kerak
   (shuningdek, oʻrnatmoqchi boʻlgan Kubernetes versiyasi hujjatini oʻqiyotganingizni tekshirishingiz kerak).

   ```shell
   # This overwrites any existing configuration in /etc/apt/sources.list.d/kubernetes.list
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   ```

4. `apt` paket indeksini yangilang, kubelet, kubeadm va kubectl ni oʻrnating hamda ularning versiyasini qotiring:

   ```shell
   sudo apt-get update
   sudo apt-get install -y kubelet kubeadm kubectl
   sudo apt-mark hold kubelet kubeadm kubectl
   ```

5. (Ixtiyoriy) kubeadm ni ishga tushirishdan oldin kubelet xizmatini yoqing:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Red Hat asosidagi distributivlar" %}}

1. SELinux ni `permissive` rejimiga oʻrnating:

   Ushbu koʻrsatmalar Kubernetes {{< skew currentVersion >}} uchun.

   ```shell
   # Set SELinux in permissive mode (effectively disabling it)
   sudo setenforce 0
   sudo sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
   ```

{{< caution >}}
- `setenforce 0` va `sed ...` ni ishga tushirish orqali SELinux ni permissive rejimiga oʻrnatish
  uni amalda oʻchiradi. Bu konteynerlarning xost fayl tizimiga kirishi uchun talab qilinadi;
  masalan, ayrim klaster tarmogʻi plaginlari shuni talab qiladi. kubelet da SELinux qoʻllab-quvvatlashi yaxshilanmaguncha
  buni qilishingiz kerak.
- SELinux ni qanday sozlashni bilsangiz, uni yoqib qoʻyishingiz mumkin, lekin bu kubeadm qoʻllab-quvvatlamaydigan
  sozlamalarni talab qilishi mumkin.
{{< /caution >}}

2. Kubernetes `yum` repozitoriyasini qoʻshing. Repozitoriya taʼrifidagi `exclude` parametri
   Kubernetes bilan bogʻliq paketlar oddiy `dnf update` bajarilganda yangilanmasligini taʼminlaydi, chunki Kubernetesni
   yangilash uchun alohida tartibga amal qilish kerak. Eʼtibor bering, bu repozitoriyada
   faqat Kubernetes {{< skew currentVersion >}} uchun paketlar bor; boshqa
   Kubernetes kichik versiyalari uchun URL dagi Kubernetes kichik versiyasini
   xohlagan kichik versiyangizga moslab oʻzgartirishingiz kerak (shuningdek,
   oʻrnatmoqchi boʻlgan Kubernetes versiyasi hujjatini oʻqiyotganingizni
   tekshirishingiz kerak).

   ```shell
   # This overwrites any existing configuration in /etc/yum.repos.d/kubernetes.repo
   cat <<EOF | sudo tee /etc/yum.repos.d/kubernetes.repo
   [kubernetes]
   name=Kubernetes
   baseurl=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/
   enabled=1
   gpgcheck=1
   gpgkey=https://pkgs.k8s.io/core:/stable:/{{< param "version" >}}/rpm/repodata/repomd.xml.key
   exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
   EOF
   ```

3. kubelet, kubeadm va kubectl ni oʻrnating:

   DNF4 ga ega tizimlar uchun (Fedora < 41, RHEL/CentOS < 10)
   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --disableexcludes=kubernetes
   ```
   DNF5 ga ega Fedora tizimlari uchun:
   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes
   ```

   RHEL/CentOS 10 va undan keyingilari uchun, `iptables` bogʻliqlik sifatida tortib olinmasligi uchun:
   ```shell
   sudo dnf install -y kubelet kubeadm kubectl --setopt=disable_excludes=kubernetes --setopt=install_weak_deps=False
   ```

4. (Ixtiyoriy) kubeadm ni ishga tushirishdan oldin kubelet xizmatini yoqing:

   ```shell
   sudo systemctl enable --now kubelet
   ```

{{% /tab %}}
{{% tab name="Paket menejerisiz" %}}
CNI plaginlarini oʻrnating (koʻpchilik Pod tarmogʻi uchun talab qilinadi):

```bash
CNI_PLUGINS_VERSION="v1.3.0"
ARCH="amd64"
DEST="/opt/cni/bin"
sudo mkdir -p "$DEST"
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGINS_VERSION}/cni-plugins-linux-${ARCH}-${CNI_PLUGINS_VERSION}.tgz" | sudo tar -C "$DEST" -xz
```

Buyruq fayllarini yuklab olish katalogini belgilang:

{{< note >}}
`DOWNLOAD_DIR` oʻzgaruvchisi yozish mumkin boʻlgan katalogga oʻrnatilishi kerak.
Flatcar Container Linux da ishlayotgan boʻlsangiz, `DOWNLOAD_DIR="/opt/bin"` qilib oʻrnating.
{{< /note >}}

```bash
DOWNLOAD_DIR="/usr/local/bin"
sudo mkdir -p "$DOWNLOAD_DIR"
```

Ixtiyoriy ravishda crictl ni oʻrnating (Konteyner runtime interfeysi (CRI) bilan ishlash uchun talab qilinadi, kubeadm uchun ixtiyoriy):

```bash
CRICTL_VERSION="v1.31.0"
ARCH="amd64"
curl -L "https://github.com/kubernetes-sigs/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-${ARCH}.tar.gz" | sudo tar -C $DOWNLOAD_DIR -xz
```

`kubeadm`, `kubelet` ni oʻrnating va `kubelet` systemd xizmatini qoʻshing:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"
ARCH="amd64"
cd $DOWNLOAD_DIR
sudo curl -L --remote-name-all https://dl.k8s.io/release/${RELEASE}/bin/linux/${ARCH}/{kubeadm,kubelet}
sudo chmod +x {kubeadm,kubelet}

RELEASE_VERSION="v0.16.2"
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubelet/kubelet.service" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service
sudo mkdir -p /usr/lib/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/release/${RELEASE_VERSION}/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf" | sed "s:/usr/bin:${DOWNLOAD_DIR}:g" | sudo tee /usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf
```

{{< note >}}
Sukut boʻyicha `glibc` ni oʻz ichiga olmaydigan Linux distributivlari uchun [Boshlashdan oldin](#before-you-begin) boʻlimidagi
eslatmaga qarang.
{{< /note >}}

`kubectl` ni [Vositalarni oʻrnatish sahifasidagi](/docs/tasks/tools/#kubectl) koʻrsatmalarga amal qilib oʻrnating.

Ixtiyoriy ravishda kubeadm ni ishga tushirishdan oldin kubelet xizmatini yoqing:

```bash
sudo systemctl enable --now kubelet
```

{{< note >}}
Flatcar Container Linux distributivi `/usr` katalogini faqat oʻqish uchun fayl tizimi sifatida ulaydi.
Klasterni boshlangʻich sozlashdan oldin yozish mumkin boʻlgan katalogni sozlash uchun qoʻshimcha qadamlar bajarishingiz kerak.
Yozish mumkin boʻlgan katalogni qanday sozlashni bilish uchun
[Kubeadm muammolarini bartaraf etish qoʻllanmasi](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/#usr-mounted-read-only)
ga qarang.
{{< /note >}}
{{% /tab %}}
{{< /tabs >}}

kubelet endi kubeadm nima qilishni aytishini crashloop holatida kutib, har bir necha soniyada qayta ishga tushmoqda.

## Muammolarni bartaraf etish

kubeadm bilan qiyinchiliklarga duch kelsangiz,
[muammolarni bartaraf etish hujjatlarimizga](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/) qarang.

## {{% heading "whatsnext" %}}

* [Klaster yaratish uchun kubeadm dan foydalanish](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
