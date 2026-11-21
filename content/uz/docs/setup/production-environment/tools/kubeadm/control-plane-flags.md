---
# reviewers:
# - sig-cluster-lifecycle
title: Komponentlarni kubeadm API yordamida moslashtirish
content_type: concept
weight: 40
---

<!-- overview -->

Ushbu sahifa kubeadm joylashtiradigan komponentlarni qanday moslashtirishni qamrab oladi. Boshqaruv tekisligi komponentlari uchun
`ClusterConfiguration` strukturasidagi flaglardan yoki har bir tugun uchun yamoqlardan foydalanishingiz mumkin. kubelet
va kube-proxy uchun mos ravishda `KubeletConfiguration` va `KubeProxyConfiguration` dan foydalanishingiz mumkin.

Bu variantlarning barchasi kubeadm konfiguratsiya APIsi orqali mumkin.
Konfiguratsiyadagi har bir maydon haqida batafsil maʼlumot uchun
[API maʼlumotnoma sahifalarimiz](/docs/reference/config-api/kubeadm-config.v1beta4/) ga oʻtishingiz mumkin.

{{< note >}}
Allaqachon yaratilgan klasterni qayta sozlash uchun
[kubeadm klasterini qayta sozlash](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure) sahifasiga qarang.
{{< /note >}}

<!-- body -->

## `ClusterConfiguration` dagi flaglar bilan boshqaruv tekisligini moslashtirish {#customizing-the-control-plane-with-flags-in-clusterconfiguration}

kubeadm `ClusterConfiguration` obyekti foydalanuvchilarga APIServer, ControllerManager, Scheduler va Etcd kabi boshqaruv tekisligi komponentlariga uzatiladigan standart
flaglarni qayta belgilash yoʻlini ochadi.
Komponentlar quyidagi strukturlar yordamida aniqlanadi:

- `apiServer`
- `controllerManager`
- `scheduler`
- `etcd`

Bu strukturalar `name` / `value` juftliklaridan iborat umumiy `extraArgs` maydonini oʻz ichiga oladi.
Boshqaruv tekisligi komponenti uchun flagni qayta belgilash uchun:

1.  Konfiguratsiyangizga tegishli `extraArgs` ni qoʻshing.
2.  `extraArgs` maydoniga flaglar qoʻshing.
3.  `kubeadm init` ni `--config <YOUR CONFIG YAML>` bilan ishga tushiring.

{{< note >}}
`kubeadm config print init-defaults` ni ishga tushirish
va chiqishni oʻzingiz tanlagan faylga saqlash orqali standart qiymatlarga ega `ClusterConfiguration` obyektini yaratishingiz mumkin.
{{< /note >}}

{{< note >}}
`ClusterConfiguration` obyekti hozirda kubeadm klasterlarida globaldir. Bu qoʻshgan har qanday flaglaringiz
turli tugunlardagi bir xil komponentning barcha nusxalariga qoʻllanishini anglatadi. Turli tugunlarda komponent boʻyicha alohida konfiguratsiyani qoʻllash uchun
[yamoqlardan](#patches) foydalanishingiz mumkin.
{{< /note >}}

{{< note >}}
Takroriy flaglar (kalitlar) yoki bir xil `--foo` flagini bir necha marta uzatish hozirda qoʻllab-quvvatlanmaydi.
Buni chetlab oʻtish uchun [yamoqlardan](#patches) foydalanishingiz kerak.
{{< /note >}}

### APIServer flaglari {#apiserver-flags}

Batafsil maʼlumot uchun [kube-apiserver maʼlumotnoma hujjatlari](/docs/reference/command-line-tools-reference/kube-apiserver/) ga qarang.

Foydalanish misoli:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
apiServer:
  extraArgs:
  - name: "enable-admission-plugins"
    value: "AlwaysPullImages,DefaultStorageClass"
  - name: "audit-log-path"
    value: "/home/johndoe/audit.log"
```

### ControllerManager flaglari {#controllermanager-flags}

Batafsil maʼlumot uchun [kube-controller-manager maʼlumotnoma hujjatlari](/docs/reference/command-line-tools-reference/kube-controller-manager/) ga qarang.

Foydalanish misoli:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
controllerManager:
  extraArgs:
  - name: "cluster-signing-key-file"
    value: "/home/johndoe/keys/ca.key"
  - name: "deployment-controller-sync-period"
    value: "50"
```

### Scheduler flaglari {#scheduler-flags}

Batafsil maʼlumot uchun [kube-scheduler maʼlumotnoma hujjatlari](/docs/reference/command-line-tools-reference/kube-scheduler/) ga qarang.

Foydalanish misoli:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
kubernetesVersion: v1.16.0
scheduler:
  extraArgs:
  - name: "config"
    value: "/etc/kubernetes/scheduler-config.yaml"
  extraVolumes:
    - name: schedulerconfig
      hostPath: /home/johndoe/schedconfig.yaml
      mountPath: /etc/kubernetes/scheduler-config.yaml
      readOnly: true
      pathType: "File"
```

### Etcd flaglari {#etcd-flags}

Batafsil maʼlumot uchun [etcd server hujjatlari](https://etcd.io/docs/) ga qarang.

Foydalanish misoli:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
etcd:
  local:
    extraArgs:
    - name: "election-timeout"
      value: 1000
```

## Yamoqlar bilan moslashtirish {#patches}

{{< feature-state for_k8s_version="v1.22" state="beta" >}}

Kubeadm alohida tugunlarda `InitConfiguration`,
`JoinConfiguration` va `UpgradeConfiguration` ga yamoq fayllari joylashgan katalogni uzatish imkonini beradi.
Bu yamoqlar komponent konfiguratsiyasi
diskka yozilishidan oldingi oxirgi moslashtirish qadami sifatida ishlatilishi mumkin.

Bu faylni `kubeadm init` ga `--config <YOUR CONFIG YAML>` bilan uzatishingiz mumkin:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
patches:
  directory: /home/user/somedir
```

{{< note >}}
`kubeadm init` uchun `---` bilan ajratilgan `ClusterConfiguration` va `InitConfiguration` ning ikkalasini ham oʻz ichiga olgan faylni uzatishingiz mumkin.
{{< /note >}}

Bu faylni `kubeadm join` ga `--config <YOUR CONFIG YAML>` bilan uzatishingiz mumkin:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
patches:
  directory: /home/user/somedir
```

Agar kubeadm tugunlaringizni yangilash uchun `kubeadm upgrade apply` va `kubeadm upgrade node` dan foydalanayotgan boʻlsangiz,
moslashtirish yangilanishdan keyin saqlanib qolishi uchun yana oʻsha yamoqlarni berishingiz kerak.

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
apply:
  patches:
    directory: /home/user/somedir
```

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: UpgradeConfiguration
node:
  patches:
    directory: /home/user/somedir
```

Katalogda `target[suffix][+patchtype].extension` shaklida nomlangan fayllar boʻlishi kerak.
Masalan, `kube-apiserver0+merge.yaml` yoki shunchaki `etcd.json`.

- `target` quyidagilardan biri boʻlishi mumkin: `kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, `etcd`,
`kubeletconfiguration` va `corednsdeployment`.
- `suffix` — qaysi yamoqlar birinchi qoʻllanishini alifbo-raqam tartibida aniqlash uchun ishlatilishi mumkin boʻlgan ixtiyoriy satr.
- `patchtype` `strategic`, `merge` yoki `json` dan biri boʻlishi mumkin va bular
[kubectl qoʻllab-quvvatlaydigan](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch) yamoqlash formatlariga mos kelishi kerak.
Standart `patchtype` — `strategic`.
- `extension` `json` yoki `yaml` boʻlishi kerak.

## kubeletni moslashtirish {#kubelet}

kubeletni moslashtirish uchun bir xil konfiguratsiya fayli ichida `---` bilan ajratilgan holda `ClusterConfiguration` yoki `InitConfiguration` yoniga [`KubeletConfiguration`](/docs/reference/config-api/kubelet-config.v1beta1/)
qoʻshishingiz mumkin.
Soʻng bu fayl `kubeadm init` ga uzatilishi mumkin va kubeadm bir xil asosiy `KubeletConfiguration`
ni klasterdagi barcha tugunlarga qoʻllaydi.

Asosiy `KubeletConfiguration` ustidan nusxaga xos konfiguratsiyani qoʻllash uchun
[`kubeletconfiguration` yamoq nishoni](#patches) dan foydalanishingiz mumkin.

Shu bilan bir qatorda, ham `InitConfiguration`, ham `JoinConfiguration` qoʻllab-quvvatlaydigan
`nodeRegistration.kubeletExtraArgs` maydonida ularni uzatish orqali kubelet flaglaridan qayta belgilash sifatida foydalanishingiz mumkin.
Ayrim kubelet flaglari eskirgan, shuning uchun ulardan foydalanishdan oldin holatini
[kubelet maʼlumotnoma hujjatlari](/docs/reference/command-line-tools-reference/kubelet) dan tekshiring.

Qoʻshimcha batafsil maʼlumot uchun [Klasterdagi har bir kubeletni kubeadm yordamida sozlash](/docs/setup/production-environment/tools/kubeadm/kubelet-integration) sahifasiga qarang.

## kube-proxy ni moslashtirish {#customizing-kube-proxy}

kube-proxy ni moslashtirish uchun `kubeadm init` ga `---` bilan ajratilgan holda `ClusterConfiguration` yoki
`InitConfiguration` yoniga `KubeProxyConfiguration` uzatishingiz mumkin.

Batafsil maʼlumot uchun [API maʼlumotnoma sahifalarimiz](/docs/reference/config-api/kubeadm-config.v1beta4/) ga oʻtishingiz mumkin.

{{< note >}}
kubeadm kube-proxy ni {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} sifatida joylashtiradi. Bu
`KubeProxyConfiguration` klasterdagi kube-proxy ning barcha nusxalariga qoʻllanishini anglatadi.
{{< /note >}}

## CoreDNS ni moslashtirish {#customizing-coredns}

kubeadm CoreDNS Deployment ini
[`corednsdeployment` yamoq nishoni](#patches) ga qarshi yamoqlar bilan moslashtirish imkonini beradi.

`kube-system/coredns`
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} kabi boshqa CoreDNS ga oid API obyektlari uchun yamoqlar hozirda qoʻllab-quvvatlanmaydi.
Bu obyektlarning istalganini kubectl yordamida qoʻlda yamab, shundan keyin CoreDNS
{{< glossary_tooltip text="Podlar" term_id="pod" >}} ni qayta yaratishingiz kerak.

Shu bilan bir qatorda, `ClusterConfiguration` ga quyidagi
parametrni kiritish orqali kubeadm CoreDNS joylashtirishini oʻchirib qoʻyishingiz mumkin:

```yaml
dns:
  disabled: true
```

Shuningdek, quyidagi buyruqni bajarish orqali:

```shell
kubeadm init phase addon coredns --print-manifest --config my-config.yaml`
```

sozlamangizda kubeadm CoreDNS uchun yaratadigan manifest faylini olishingiz mumkin.
