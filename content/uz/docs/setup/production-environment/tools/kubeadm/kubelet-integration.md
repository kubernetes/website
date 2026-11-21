---
# reviewers:
# - sig-cluster-lifecycle
title: Klasterdagi har bir kubeletni kubeadm yordamida sozlash
content_type: concept
weight: 80
---

<!-- overview -->

{{% dockershim-removal %}}

{{< feature-state for_k8s_version="v1.11" state="stable" >}}

kubeadm CLI vositasining hayotiy sikli Kubernetes klasteridagi har bir tugunda ishlaydigan
demon boʻlgan [kubelet](/docs/reference/command-line-tools-reference/kubelet) dan ajratilgan. Kubernetes
ishga tushirilganda yoki yangilanganda kubeadm CLI vositasini foydalanuvchi ishga tushiradi, kubelet esa doim fonda ishlaydi.

kubelet demon boʻlgani uchun uni qandaydir init
tizimi yoki xizmat menejeri boshqarishi kerak. kubelet DEB yoki RPM lar yordamida oʻrnatilganda,
systemd kubeletni boshqarishga sozlanadi. Buning oʻrniga boshqa xizmat
menejeridan foydalanishingiz mumkin, lekin uni qoʻlda sozlashingiz kerak.

Ayrim kubelet konfiguratsiya tafsilotlari klasterdagi barcha kubeletlarda bir xil boʻlishi kerak, boshqa
konfiguratsiya jihatlari esa berilgan mashinaning turli
xususiyatlariga (masalan, operatsion tizim, saqlash va tarmoq) moslash uchun har bir kubelet boʻyicha belgilanishi kerak. kubeletlaringiz konfiguratsiyasini
qoʻlda boshqarishingiz mumkin, lekin endi kubeadm
[kubelet konfiguratsiyalaringizni markazdan boshqarish](#configure-kubelets-using-kubeadm) uchun `KubeletConfiguration` API turini beradi.

<!-- body -->

## kubelet konfiguratsiya naqshlari {#kubelet-configuration-patterns}

Quyidagi boʻlimlar har bir Node uchun kubelet konfiguratsiyasini qoʻlda boshqarish oʻrniga
kubeadm yordamida soddalashtiriladigan kubelet konfiguratsiya naqshlarini tavsiflaydi.

### Klaster darajasidagi konfiguratsiyani har bir kubeletga tarqatish {#propagating-cluster-level-configuration-to-each-kubelet}

`kubeadm init` va `kubeadm join`
buyruqlari foydalanadigan standart qiymatlarni kubeletga berishingiz mumkin. Qiziqarli misollar boshqa konteyner runtime dan foydalanish yoki xizmatlar foydalanadigan standart quyi tarmoqni
belgilashni oʻz ichiga oladi.

Agar xizmatlaringiz xizmatlar uchun standart sifatida `10.96.0.0/12` quyi tarmogʻidan foydalanishini xohlasangiz, kubeadm ga
`--service-cidr` parametrini uzatishingiz mumkin:

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

Endi xizmatlar uchun virtual IP lar shu quyi tarmoqdan ajratiladi. `--cluster-dns` flagi yordamida kubelet foydalanadigan DNS manzilini ham belgilashingiz
kerak. Bu sozlama klasterdagi har bir boshqaruvchi va har bir Node dagi har bir kubelet uchun bir xil boʻlishi kerak. kubelet kubeletdagi aksariyat parametrlarni sozlashi
va bu konfiguratsiyani klasterdagi har bir ishlayotgan
kubeletga yuborishi mumkin boʻlgan versiyalangan, tuzilmali API obyektini beradi. Bu obyekt
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/) deb ataladi.
`KubeletConfiguration` foydalanuvchiga klaster DNS IP manzillari kabi flaglarni
qiymatlar roʻyxati sifatida camelCase kalitga ifodalash imkonini beradi. Buni quyidagi misol koʻrsatadi:

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

`KubeletConfiguration` haqida batafsil maʼlumot uchun [ushbu boʻlim](#configure-kubelets-using-kubeadm) ga qarang.

### Nusxaga xos konfiguratsiya tafsilotlarini berish {#providing-instance-specific-configuration-details}

Ayrim xostlar apparat taʼminoti, operatsion tizim,
tarmoq yoki boshqa xostga xos parametrlardagi farqlar tufayli maxsus kubelet konfiguratsiyalarini talab qiladi. Quyidagi roʻyxat bir nechta misol beradi.

- `--resolv-conf` kubelet
  konfiguratsiya flagi koʻrsatadigan DNS yechish fayliga yoʻl operatsion tizimlar orasida yoki
  `systemd-resolved` dan foydalanayotganingizga qarab farq qilishi mumkin. Agar bu yoʻl notoʻgʻri boʻlsa, kubeleti
  notoʻgʻri sozlangan Node da DNS yechish ishdan chiqadi.

- Agar bulut provayderidan foydalanmayotgan boʻlsangiz, Node API obyektining `.metadata.name` maydoni standart holatda mashinaning xost nomiga oʻrnatiladi.
  Mashinaning xost nomidan farq qiladigan Node nomini koʻrsatishingiz kerak boʻlsa, standart xatti-harakatni qayta belgilash uchun `--hostname-override` flagidan foydalanishingiz mumkin.

- Hozirda kubelet konteyner runtime ishlatadigan cgroup drayverini avtomatik aniqlay olmaydi,
  lekin kubelet sogʻlom boʻlishi uchun `--cgroup-driver` qiymati konteyner runtime ishlatadigan cgroup drayveriga mos kelishi kerak.

- Konteyner runtimeni koʻrsatish uchun uning endpointini
`--container-runtime-endpoint=<path>` flagi bilan belgilashingiz kerak.

Bunday nusxaga xos konfiguratsiyani qoʻllashning tavsiya etilgan yoʻli
[`KubeletConfiguration` yamoqlari](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#patches) dan foydalanishdir.

## kubeletlarni kubeadm yordamida sozlash {#configure-kubelets-using-kubeadm}

Agar `kubeadm ... --config some-config-file.yaml` kabi konfiguratsiya fayli bilan maxsus
[`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
API obyekti uzatilsa, kubeadm ishga tushiradigan kubeletni sozlash mumkin.

`kubeadm config print init-defaults --component-configs KubeletConfiguration` ni chaqirish orqali
bu struktura uchun barcha standart qiymatlarni koʻrishingiz mumkin.

Asosiy `KubeletConfiguration` ustidan nusxaga xos yamoqlarni qoʻllash ham mumkin.
Batafsil maʼlumot uchun [kubeletni moslashtirish](/docs/setup/production-environment/tools/kubeadm/control-plane-flags#customizing-the-kubelet)
sahifasiga qarang.

### `kubeadm init` dan foydalangandagi ish jarayoni {#workflow-when-using-kubeadm-init}

`kubeadm init` ni chaqirganingizda kubelet konfiguratsiyasi diskka
`/var/lib/kubelet/config.yaml` ga yoziladi va klasterning `kube-system` Namespace ichidagi `kubelet-config`
ConfigMap ga ham yuklanadi.
Qoʻshimcha ravishda, kubeadm vositasi tugundagi CRI soketini aniqlaydi va uning tafsilotlarini
(soket yoʻlini ham) mahalliy konfiguratsiyaga, `/var/lib/kubelet/instance-config.yaml` ga yozadi.
kubelet konfiguratsiya fayli `/etc/kubernetes/kubelet.conf` ga ham yoziladi.
Unda klasterdagi barcha kubeletlar uchun asosiy klaster miqyosidagi konfiguratsiya boʻladi. Bu konfiguratsiya fayli
kubeletning API server bilan aloqa qilishiga imkon beradigan mijoz sertifikatlariga ishora qiladi. Bu
[klaster darajasidagi konfiguratsiyani har bir kubeletga tarqatish](#propagating-cluster-level-configuration-to-each-kubelet) ehtiyojini hal qiladi.

[Nusxaga xos konfiguratsiya tafsilotlarini berish](#providing-instance-specific-configuration-details) ning ikkinchi naqshini hal qilish uchun
kubeadm `/var/lib/kubelet/kubeadm-flags.env` ga muhit faylini yozadi. Unda kubelet ishga tushganda unga uzatiladigan
flaglar roʻyxati boʻladi. Flaglar faylda quyidagicha keltiriladi:

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

kubeletni ishga tushirishda ishlatiladigan flaglarga qoʻshimcha ravishda faylda cgroup drayveri kabi dinamik
parametrlar ham bor.

Bu ikki fayl diskka yozilgandan soʻng, agar systemd dan foydalanayotgan boʻlsangiz, kubeadm quyidagi ikki
buyruqni ishga tushirishga urinadi:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

Agar qayta yuklash va qayta ishga tushirish muvaffaqiyatli boʻlsa, odatiy `kubeadm init` ish jarayoni davom etadi.

### `kubeadm join` dan foydalangandagi ish jarayoni {#workflow-when-using-kubeadm-join}

`kubeadm join` ni ishga tushirganingizda kubeadm TLS bootstrap bajarish uchun Bootstrap Token hisob maʼlumotidan foydalanadi. Bu
`kubelet-config` ConfigMap ni yuklab olish uchun kerakli hisob maʼlumotini oladi va uni `/var/lib/kubelet/config.yaml` ga yozadi.
Qoʻshimcha ravishda, kubeadm vositasi tugundagi CRI soketini aniqlaydi va uning tafsilotlarini
(soket yoʻlini ham) mahalliy konfiguratsiyaga, `/var/lib/kubelet/instance-config.yaml` ga yozadi.
Dinamik muhit fayli `kubeadm init` dagi kabi aynan shu tarzda yaratiladi.

Keyin `kubeadm` yangi konfiguratsiyani kubeletga yuklash uchun quyidagi ikki buyruqni ishga tushiradi:

```bash
systemctl daemon-reload && systemctl restart kubelet
```

kubelet yangi konfiguratsiyani yuklagandan soʻng kubeadm
`/etc/kubernetes/bootstrap-kubelet.conf` KubeConfig faylini yozadi. Unda CA sertifikati va Bootstrap
Token bor. kubelet ular yordamida TLS Bootstrap ni bajaradi va yagona
hisob maʼlumotini oladi. Bu hisob maʼlumoti `/etc/kubernetes/kubelet.conf` da saqlanadi.

`/etc/kubernetes/kubelet.conf` fayli yozilganda kubelet TLS Bootstrap ni bajarib boʻlgan boʻladi.
Kubeadm TLS Bootstrap tugagandan soʻng `/etc/kubernetes/bootstrap-kubelet.conf` faylini oʻchiradi.

## systemd uchun kubelet drop-in fayli {#the-kubelet-drop-in-file-for-systemd}

`kubeadm` systemd kubeletni qanday ishga tushirishi kerakligi haqidagi konfiguratsiya bilan birga keladi.
kubeadm CLI buyrugʻi bu drop-in faylga hech qachon tegmasligini yodda tuting.

`kubeadm`
[paketi](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubeadm/10-kubeadm.conf) oʻrnatadigan bu konfiguratsiya fayli
`/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` ga yoziladi va systemd tomonidan ishlatiladi.
U asosiy
[`kubelet.service`](https://github.com/kubernetes/release/blob/cd53840/cmd/krel/templates/latest/kubelet/kubelet.service) ni toʻldiradi.

Agar buni yanada qayta belgilashni xohlasangiz, `/etc/systemd/system/kubelet.service.d/` katalogini yaratishingiz mumkin
(`/usr/lib/systemd/system/kubelet.service.d/` emas) va oʻz moslashtirishlaringizni u yerdagi faylga joylashingiz mumkin.
Masalan, `kubeadm` sozlagan unit sozlamalarini qayta belgilash uchun yangi mahalliy `/etc/systemd/system/kubelet.service.d/local-overrides.conf` faylini qoʻshishingiz mumkin.

`/usr/lib/systemd/system/kubelet.service.d/10-kubeadm.conf` da quyidagini topishingiz ehtimoli yuqori:

{{< note >}}
Quyidagi tarkib faqat misoldir. Agar paket menejeridan foydalanishni xohlamasangiz,
([Paketsiz](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#k8s-install-2))
boʻlimida bayon qilingan qoʻllanmaga amal qiling.
{{< /note >}}

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
# the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

Bu fayl kubeadm kubelet uchun boshqaradigan barcha fayllarning standart joylarini koʻrsatadi.

- TLS Bootstrap uchun ishlatiladigan KubeConfig fayli `/etc/kubernetes/bootstrap-kubelet.conf` dir,
  lekin u faqat `/etc/kubernetes/kubelet.conf` mavjud boʻlmaganda ishlatiladi.
- Yagona kubelet identifikatsiyasiga ega KubeConfig fayli `/etc/kubernetes/kubelet.conf` dir.
- kubeletning ComponentConfig ini oʻz ichiga olgan fayl `/var/lib/kubelet/config.yaml` dir.
- `KUBELET_KUBEADM_ARGS` ni oʻz ichiga olgan dinamik muhit fayli `/var/lib/kubelet/kubeadm-flags.env` dan olinadi.
- `KUBELET_EXTRA_ARGS` bilan foydalanuvchi koʻrsatgan flag qayta belgilashlarini oʻz ichiga olishi mumkin boʻlgan fayl
  `/etc/default/kubelet` (DEB lar uchun) yoki `/etc/sysconfig/kubelet` (RPM lar uchun) dan olinadi. `KUBELET_EXTRA_ARGS`
  flaglar zanjirida oxirgi turadi va ziddiyatli sozlamalar yuz berganda eng yuqori ustuvorlikka ega.

## Kubernetes binariylari va paket tarkibi {#kubernetes-binaries-and-package-contents}

Kubernetes relizlari bilan yetkaziladigan DEB va RPM paketlar quyidagilar:

| Paket nomi | Tavsif |
|--------------|-------------|
| `kubeadm`    | `/usr/bin/kubeadm` CLI vositasini va kubelet uchun [kubelet drop-in fayli](#the-kubelet-drop-in-file-for-systemd) ni oʻrnatadi. |
| `kubelet`    | `/usr/bin/kubelet` binariysini oʻrnatadi. |
| `kubectl`    | `/usr/bin/kubectl` binariysini oʻrnatadi. |
| `cri-tools` | [cri-tools git ombori](https://github.com/kubernetes-sigs/cri-tools) dan `/usr/bin/crictl` binariysini oʻrnatadi. |
| `kubernetes-cni` | [plaginlar git ombori](https://github.com/containernetworking/plugins) dan `/opt/cni/bin` binariylarini oʻrnatadi. |
