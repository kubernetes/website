---
title: kubeadm muammolarini bartaraf etish
content_type: concept
weight: 20
---

<!-- overview -->

Har qanday dasturda boʻlgani kabi, kubeadm ni oʻrnatish yoki ishga tushirishda xatoga duch kelishingiz mumkin.
Ushbu sahifa ayrim keng tarqalgan nosozlik ssenariylarini sanaydi va muammoni tushunish hamda tuzatishga yordam beradigan qadamlarni beradi.

Muammongiz quyida keltirilmagan boʻlsa, quyidagi qadamlarga amal qiling:

- Muammongiz kubeadm dagi xato deb hisoblasangiz:
  - [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues) ga kiring va mavjud muammolarni qidiring.
  - Muammo mavjud boʻlmasa, [yangisini oching](https://github.com/kubernetes/kubeadm/issues/new) va muammo andozasiga amal qiling.

- kubeadm qanday ishlashiga ishonchingiz komil boʻlmasa, [Slack](https://slack.k8s.io/) dagi `#kubeadm` da soʻrashingiz
  yoki [StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes) da savol ochishingiz mumkin. Odamlar yordam bera olishi uchun
  `#kubernetes` va `#kubeadm` kabi tegishli teglarni kiriting.

<!-- body -->

## RBAC yetishmagani sababli v1.18 Node ni v1.17 klasteriga qoʻshib boʻlmaydi

v1.18 da kubeadm bir xil nomli Node allaqachon mavjud boʻlsa, klasterga Node qoʻshishning oldini olishni qoʻshdi.
Buning uchun bootstrap-token foydalanuvchisi Node obyektini GET qila olishi uchun RBAC qoʻshish kerak edi.

Biroq bu v1.18 dagi `kubeadm join` kubeadm v1.17 yaratgan klasterga qoʻshila olmasligi muammosini keltirib chiqaradi.

Muammoni aylanib oʻtish uchun ikkita variantingiz bor:

kubeadm v1.18 yordamida boshqaruv tekisligi tugunida `kubeadm init phase bootstrap-token` ni bajaring.
Eʼtibor bering, bu bootstrap-token ruxsatlarining qolgan qismini ham yoqadi.

yoki

Quyidagi RBAC ni `kubectl apply -f ...` yordamida qoʻlda qoʻllang:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: kubeadm:get-nodes
rules:
  - apiGroups:
      - ""
    resources:
      - nodes
    verbs:
      - get
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: kubeadm:get-nodes
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: kubeadm:get-nodes
subjects:
  - apiGroup: rbac.authorization.k8s.io
    kind: Group
    name: system:bootstrappers:kubeadm:default-node-token
```

## Oʻrnatish paytida `ebtables` yoki shunga oʻxshash bajariladigan fayl topilmadi

`kubeadm init` ni ishga tushirishda quyidagi ogohlantirishlarni koʻrsangiz

```console
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

unda tuguningizda `ebtables`, `ethtool` yoki shunga oʻxshash bajariladigan fayl yetishmayotgan boʻlishi mumkin.
Ularni quyidagi buyruqlar bilan oʻrnatishingiz mumkin:

- Ubuntu/Debian foydalanuvchilari uchun `apt install ebtables ethtool` ni bajaring.
- CentOS/Fedora foydalanuvchilari uchun `dnf install ebtables ethtool` ni bajaring.

## Oʻrnatish paytida kubeadm boshqaruv tekisligini kutib qoladi

Agar `kubeadm init` quyidagi qatorni chiqargandan keyin osilib qolganini sezsangiz:

```console
[apiclient] Created API client, waiting for the control plane to become ready
```

Bunga bir qator muammolar sabab boʻlishi mumkin. Eng keng tarqalganlari:

- tarmoq ulanishi muammolari. Davom etishdan oldin mashinangizda toʻliq tarmoq ulanishi borligini tekshiring.
- boshqaruv tekisligi konteynerlari crashloop holatida yoki osilib turibdi. Buni `docker ps`
  ni ishga tushirish va har bir konteynerni `docker logs` bilan tekshirish orqali koʻrishingiz mumkin. Boshqa konteyner runtime uchun
  [crictl bilan Kubernetes tugunlarini nosozliklarni bartaraf etish](/docs/tasks/debug/debug-cluster/crictl/) sahifasiga qarang.

## Boshqariladigan konteynerlarni olib tashlashda kubeadm toʻxtab qoladi

Konteyner runtime toʻxtab, Kubernetes boshqaradigan konteynerlarni olib
tashlamasa, quyidagi holat yuz berishi mumkin:

```shell
sudo kubeadm reset
```

```console
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

Mumkin boʻlgan yechim — konteyner runtimeni qayta ishga tushirish va soʻng `kubeadm reset` ni qayta bajarish.
Konteyner runtime holatini nosozliklarni bartaraf etish uchun `crictl` dan ham foydalanishingiz mumkin.
[crictl bilan Kubernetes tugunlarini nosozliklarni bartaraf etish](/docs/tasks/debug/debug-cluster/crictl/) sahifasiga qarang.

## Podlar `RunContainerError`, `CrashLoopBackOff` yoki `Error` holatida

`kubeadm init` dan darhol keyin bu holatlardagi Podlar boʻlmasligi kerak.

- Agar `kubeadm init` dan _darhol keyin_ bu holatlarning biridagi Podlar boʻlsa, kubeadm repozitoriyasida
  muammo oching. Tarmoq qoʻshimchasini joylashtirmaguningizcha `coredns` (yoki `kube-dns`) `Pending` holatida
  boʻlishi kerak.
- Tarmoq qoʻshimchasini joylashtirgandan keyin Podlar `RunContainerError`, `CrashLoopBackOff` yoki `Error` holatida
  boʻlsa va `coredns` (yoki `kube-dns`) ga hech narsa boʻlmasa,
  oʻrnatgan Pod tarmogʻi qoʻshimchangiz qandaydir tarzda buzilgan boʻlishi ehtimoli juda yuqori.
  Unga koʻproq RBAC imtiyozlari berishingiz yoki yangiroq versiyadan foydalanishingiz kerak boʻlishi mumkin. Pod tarmogʻi provayderlarining
  muammo kuzatuvchisida muammo oching va muammo u yerda saralansin.

## `coredns` `Pending` holatida qotib qolgan

Bu **kutilgan** holat va loyihaning bir qismidir. kubeadm tarmoq provayderidan mustaqil, shuning uchun administrator
oʻzi tanlagan [Pod tarmogʻi qoʻshimchasini oʻrnatishi](/docs/concepts/cluster-administration/addons/) kerak.
CoreDNS toʻliq joylashtirilishi uchun avval Pod tarmogʻini oʻrnatishingiz kerak. Shuning uchun tarmoq sozlanmaguncha `Pending` holati boʻladi.

## `HostPort` Servicelari ishlamaydi

`HostPort` va `HostIP` funksionalligi Pod tarmogʻi
provayderingizga qarab mavjud. `HostPort` va `HostIP` funksionalligi mavjudligini aniqlash uchun
Pod tarmogʻi qoʻshimchasi muallifiga murojaat qiling.

Calico, Canal va Flannel CNI provayderlari HostPort ni qoʻllab-quvvatlashi tekshirilgan.

Qoʻshimcha maʼlumot uchun
[CNI portmap hujjatiga](https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md) qarang.

Agar tarmoq provayderingiz portmap CNI plaginini qoʻllab-quvvatlamasa,
[Servicelarning NodePort imkoniyatidan](/docs/concepts/services-networking/service/#type-nodeport)
foydalanishingiz yoki `HostNetwork=true` dan foydalanishingiz kerak boʻlishi mumkin.

## Podlarga ularning Service IP manzili orqali kirib boʻlmaydi

- Koʻp tarmoq qoʻshimchalari hali [hairpin rejimini](/docs/tasks/debug/debug-application/debug-service/#a-pod-fails-to-reach-itself-via-the-service-ip)
  yoqmagan; bu rejim Podlarga oʻzlariga Service IP orqali kirish imkonini beradi. Bu
  [CNI](https://github.com/containernetworking/cni/issues/476) bilan bogʻliq muammo. Hairpin rejimini qoʻllab-quvvatlashning soʻnggi holati uchun
  tarmoq qoʻshimchasi provayderiga murojaat qiling.

- VirtualBox dan (bevosita yoki Vagrant orqali) foydalanayotgan boʻlsangiz,
  `hostname -i` marshrutlanadigan IP manzil qaytarishiga ishonch hosil qilishingiz kerak. Sukut boʻyicha birinchi
  interfeys marshrutlanmaydigan faqat xost tarmogʻiga ulangan. Vaqtinchalik yechim
  `/etc/hosts` ni oʻzgartirishdir; misol uchun ushbu
  [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11)
  ga qarang.

## TLS sertifikat xatolari

Quyidagi xato sertifikat nomuvofiqligini bildirishi mumkin.

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- `$HOME/.kube/config` faylida yaroqli sertifikat borligini tekshiring va
  kerak boʻlsa, sertifikatni qayta yarating. kubeconfig faylidagi sertifikatlar
  base64 da kodlangan. Sertifikatni dekodlash uchun `base64 --decode` buyrugʻidan
  va sertifikat maʼlumotini koʻrish uchun `openssl x509 -text -noout` dan foydalanish mumkin.

- `KUBECONFIG` muhit oʻzgaruvchisini quyidagicha bekor qiling:

  ```sh
  unset KUBECONFIG
  ```

  Yoki uni standart `KUBECONFIG` joylashuviga oʻrnating:

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- Yana bir vaqtinchalik yechim — «admin» foydalanuvchisi uchun mavjud `kubeconfig` ni ustidan yozish:

  ```sh
  mv $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## kubelet mijoz sertifikatini aylantirish muvaffaqiyatsiz tugaydi {#kubelet-client-cert}

Sukut boʻyicha kubeadm kubelet ni `/etc/kubernetes/kubelet.conf` da koʻrsatilgan
`/var/lib/kubelet/pki/kubelet-client-current.pem` symlinki yordamida mijoz sertifikatlarini avtomatik aylantirish bilan sozlaydi.
Agar bu aylantirish jarayoni muvaffaqiyatsiz tugasa, kube-apiserver jurnallarida `x509: certificate has expired or is not yet valid`
kabi xatolarni koʻrishingiz mumkin. Muammoni tuzatish uchun quyidagi qadamlarga amal qilishingiz kerak:

1. Nosoz tugundan `/etc/kubernetes/kubelet.conf` va `/var/lib/kubelet/pki/kubelet-client*` ni zaxiralab, oʻchiring.
1. Klasterdagi `/etc/kubernetes/pki/ca.key` ga ega ishlayotgan boshqaruv tekisligi tugunidan
   `kubeadm kubeconfig user --org system:nodes --client-name system:node:$NODE > kubelet.conf` ni bajaring.
   `$NODE` klasterdagi mavjud nosoz tugunning nomiga oʻrnatilishi kerak.
   Olingan `kubelet.conf` ni klaster nomi va server endpointini moslash uchun qoʻlda oʻzgartiring
   yoki `kubeconfig user --config` ni uzating ([Qoʻshimcha foydalanuvchilar uchun kubeconfig fayllarini yaratish](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubeconfig-additional-users) ga qarang). Klasteringizda
   `ca.key` boʻlmasa, `kubelet.conf` ichiga joylashtirilgan sertifikatlarni tashqarida imzolashingiz kerak.
1. Olingan ushbu `kubelet.conf` ni nosoz tugundagi `/etc/kubernetes/kubelet.conf` ga nusxalang.
1. Nosoz tugunda kubelet ni qayta ishga tushiring (`systemctl restart kubelet`) va
   `/var/lib/kubelet/pki/kubelet-client-current.pem` qayta yaratilishini kuting.
1. Aylantirilgan kubelet mijoz sertifikatlariga yoʻnaltirish uchun `kubelet.conf` ni qoʻlda tahrirlang:
   `client-certificate-data` va `client-key-data` ni quyidagi bilan almashtiring:

   ```yaml
   client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem
   client-key: /var/lib/kubelet/pki/kubelet-client-current.pem
   ```

1. kubelet ni qayta ishga tushiring.
1. Tugun `Ready` boʻlishiga ishonch hosil qiling.

## Vagrant da flannel Pod tarmogʻi sifatida ishlatilganda standart NIC

Quyidagi xato Pod tarmogʻida biror narsa notoʻgʻri boʻlganini bildirishi mumkin:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Agar Vagrant ichida Pod tarmogʻi sifatida flannel dan foydalanayotgan boʻlsangiz, flannel uchun
  standart interfeys nomini koʻrsatishingiz kerak boʻladi.

  Vagrant odatda barcha virtual mashinalarga ikkita interfeys tayinlaydi. Birinchisi, barcha xostlarga
  `10.0.2.15` IP manzili beriladigan interfeys, NAT qilinadigan tashqi trafik uchundir.

  Bu flannel bilan muammolarga olib kelishi mumkin, chunki flannel sukut boʻyicha xostdagi birinchi interfeysga oʻtadi.
  Bu barcha xostlar bir xil ommaviy IP manzilga ega deb hisoblashiga olib keladi. Buning oldini olish uchun
  ikkinchi interfeys tanlanishi uchun flannel ga `--iface eth1` bayrogʻini uzating.

## Konteynerlar uchun ommaviy boʻlmagan IP ishlatilishi

Ayrim holatlarda aks holda ishlaydigan klasterda `kubectl logs` va `kubectl run` buyruqlari
quyidagi xatolar bilan qaytishi mumkin:

```console
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- Bunga Kubernetes goʻyo bir xil past tarmoqdagi boshqa IP lar bilan aloqa qila olmaydigan IP dan foydalanishi
  sabab boʻlishi mumkin, ehtimol mashina provayderi siyosati tufayli.
- DigitalOcean `eth0` ga ommaviy IP ni ham, suzuvchi IP imkoniyati uchun ichki langar sifatida ishlatiladigan
  xususiy IP ni ham tayinlaydi, lekin `kubelet` ommaviy IP oʻrniga ikkinchisini tugunning
  `InternalIP` si sifatida tanlaydi.

  Bu ssenariyni tekshirish uchun `ifconfig` oʻrniga `ip addr show` dan foydalaning, chunki `ifconfig`
  muammoli taxallus IP manzilini koʻrsatmaydi. Shu bilan birga, DigitalOcean ga xos API endpointi
  droplet dan langar IP ni soʻrash imkonini beradi:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  Vaqtinchalik yechim — `kubelet` ga qaysi IP dan foydalanishni `--node-ip` orqali aytish.
  DigitalOcean dan foydalanganda bu `eth0` ga tayinlangan ommaviy IP yoki
  ixtiyoriy xususiy tarmoqdan foydalanmoqchi boʻlsangiz `eth1` ga tayinlangan xususiy IP boʻlishi mumkin.
  Buning uchun kubeadm [`NodeRegistrationOptions` tuzilmasi](/docs/reference/config-api/kubeadm-config.v1beta4/#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions)
  ning `kubeletExtraArgs` boʻlimidan foydalanish mumkin.

  Soʻng `kubelet` ni qayta ishga tushiring:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## `coredns` Podlari `CrashLoopBackOff` yoki `Error` holatida

Docker ning eskiroq versiyasi bilan SELinux ishlayotgan tugunlaringiz boʻlsa, `coredns` Podlari
ishga tushmaydigan ssenariyga duch kelishingiz mumkin. Buni hal qilish uchun quyidagi variantlardan birini sinashingiz mumkin:

- [Docker ning yangiroq versiyasiga](/docs/setup/production-environment/container-runtimes/#docker) yangilang.

- [SELinux ni oʻchiring](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux).

- `allowPrivilegeEscalation` ni `true` ga oʻrnatish uchun `coredns` Deploymentini oʻzgartiring:

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

CoreDNS `CrashLoopBackOff` holatiga tushishining yana bir sababi — Kubernetesda joylashtirilgan CoreDNS Podi halqa aniqlaganida yuz beradi.
CoreDNS halqani aniqlab chiqqan har safar Kubernetes CoreDNS Podini qayta ishga tushirishga urinmasligi uchun
[bir qator vaqtinchalik yechimlar](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters) mavjud.

{{< warning >}}
SELinux ni oʻchirish yoki `allowPrivilegeEscalation` ni `true` ga oʻrnatish
klasteringiz xavfsizligiga putur yetkazishi mumkin.
{{< /warning >}}

## etcd Podlari uzluksiz qayta ishga tushadi

Quyidagi xatoga duch kelsangiz:

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

Bu muammo CentOS 7 ni Docker 1.13.1.84 bilan ishga tushirsangiz yuz beradi.
Docker ning ushbu versiyasi kubelet ning etcd konteyneriga exec qilishiga toʻsqinlik qilishi mumkin.

Muammoni aylanib oʻtish uchun ushbu variantlardan birini tanlang:

- Docker ning oldingi versiyasiga, masalan 1.13.1-75 ga qayting

  ```
  dnf downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
  ```

- Tavsiya etilgan yangiroq versiyalardan birini, masalan 18.06 ni oʻrnating:

  ```bash
  sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
  dnf install docker-ce-18.06.1.ce-3.el7.x86_64
  ```

## `--component-extra-args` bayrogʻi ichidagi argumentlarga vergul bilan ajratilgan qiymatlar roʻyxatini uzatib boʻlmaydi

`--component-extra-args` kabi `kubeadm init` bayroqlari kube-apiserver kabi boshqaruv tekisligi
komponentiga maxsus argumentlar uzatish imkonini beradi. Biroq bu mexanizm qiymatlarni tahlil qilishda ishlatiladigan asosiy tur
(`mapStringString`) tufayli cheklangan.

`--apiserver-extra-args "enable-admission-plugins=LimitRanger,NamespaceExists"` kabi bir nechta vergul bilan ajratilgan qiymatlarni qoʻllab-quvvatlaydigan
argument uzatishga qaror qilsangiz, bu bayroq
`flag: malformed pair, expect string=string` bilan muvaffaqiyatsiz tugaydi. Bu `--apiserver-extra-args` uchun argumentlar roʻyxati
`key=value` juftliklarini kutgani va bu holda `NamespacesExists` qiymati yoʻq
kalit deb hisoblangani sababli yuz beradi.

Shu bilan birga, `key=value` juftliklarini quyidagicha ajratishga urinib koʻrishingiz mumkin:
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"`
lekin bunda `enable-admission-plugins` kaliti faqat `NamespaceExists` qiymatiga ega boʻladi.

Maʼlum vaqtinchalik yechim — kubeadm [konfiguratsiya faylidan](/docs/reference/config-api/kubeadm-config.v1beta4/) foydalanish.

## kube-proxy tugun cloud-controller-manager tomonidan ishga tushirilishidan oldin rejalashtiriladi

Bulut provayderi ssenariylarida kube-proxy yangi ishchi tugunlarga cloud-controller-manager
tugun manzillarini ishga tushirishidan oldin rejalashtirilishi mumkin. Bu kube-proxy ning tugun IP manzilini
toʻgʻri olishiga toʻsqinlik qiladi va yuk balanslagichlarni boshqaradigan proksi funksiyasiga zanjirli taʼsir qiladi.

kube-proxy Podlarida quyidagi xatoni koʻrish mumkin:

```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

Maʼlum yechim — kube-proxy DaemonSet ini boshqaruv tekisligi tugunlariga ularning shartlaridan qatʼi nazar
rejalashtirishga ruxsat beradigan, boshqa tugunlarda esa dastlabki himoya
shartlari yoʻqolguncha uni ushlab turadigan qilib yamoq qilish:

```
kubectl -n kube-system patch ds kube-proxy -p='{
  "spec": {
    "template": {
      "spec": {
        "tolerations": [
          {
            "key": "CriticalAddonsOnly",
            "operator": "Exists"
          },
          {
            "effect": "NoSchedule",
            "key": "node-role.kubernetes.io/control-plane"
          }
        ]
      }
    }
  }
}'
```

Bu muammo uchun kuzatuv muammosi [bu yerda](https://github.com/kubernetes/kubeadm/issues/1027).

## Tugunlarda `/usr` faqat oʻqish uchun ulangan {#usr-mounted-read-only}

Fedora CoreOS yoki Flatcar Container Linux kabi Linux distributivlarida `/usr` katalogi faqat oʻqish uchun fayl tizimi sifatida ulanadi.
[flex-volume qoʻllab-quvvatlashi](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md) uchun
kubelet va kube-controller-manager kabi Kubernetes komponentlari
`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/` standart yoʻlidan foydalanadi, lekin imkoniyat ishlashi uchun flex-volume katalogi _yozish mumkin boʻlishi shart_.

{{< note >}}
FlexVolume Kubernetes v1.23 relizida eskirgan deb eʼlon qilindi.
{{< /note >}}

Bu muammoni aylanib oʻtish uchun flex-volume katalogini kubeadm
[konfiguratsiya fayli](/docs/reference/config-api/kubeadm-config.v1beta4/) yordamida sozlashingiz mumkin.

Asosiy boshqaruv tekisligi Node ida (`kubeadm init` yordamida yaratilgan) `--config` orqali
quyidagi faylni uzating:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
controllerManager:
  extraArgs:
  - name: "flex-volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Qoʻshilayotgan Nodelarda:

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
  - name: "volume-plugin-dir"
    value: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

Shu bilan birga, `/usr` ulanishini yozish mumkin qilish uchun `/etc/fstab` ni oʻzgartirishingiz mumkin, lekin
bu Linux distributivining loyiha tamoyilini oʻzgartirish ekanini yodda tuting.

## `kubeadm upgrade plan` `context deadline exceeded` xato xabarini chiqaradi

Bu xato xabari tashqi etcd ishlayotgan holda Kubernetes klasterini `kubeadm` bilan yangilashda
koʻrsatiladi. Bu jiddiy xato emas va eskiroq kubeadm versiyalari tashqi etcd klasterida versiya tekshiruvini
bajargani sababli yuz beradi.
`kubeadm upgrade apply ...` bilan davom etishingiz mumkin.

Bu muammo 1.19 versiyasidan boshlab tuzatilgan.

## `kubeadm reset` `/var/lib/kubelet` ni uzadi

Agar `/var/lib/kubelet` ulangan boʻlsa, `kubeadm reset` ni bajarish uni amalda uzadi.

Muammoni aylanib oʻtish uchun `kubeadm reset` amalini bajargandan keyin `/var/lib/kubelet` katalogini qayta ulang.

Bu kubeadm 1.15 da kiritilgan regressiya. Muammo 1.20 da tuzatilgan.

## kubeadm klasterida metrics-server dan xavfsiz foydalanib boʻlmaydi

kubeadm klasterida [metrics-server](https://github.com/kubernetes-sigs/metrics-server)
ga `--kubelet-insecure-tls` uzatish orqali xavfsiz boʻlmagan tarzda foydalanish mumkin. Bu ishlab chiqarish klasterlari uchun tavsiya etilmaydi.

metrics-server va kubelet oʻrtasida TLS dan foydalanmoqchi boʻlsangiz, muammo bor,
chunki kubeadm kubelet uchun oʻzi imzolagan xizmat sertifikatini joylashtiradi. Bu metrics-server tomonida
quyidagi xatolarga sabab boʻlishi mumkin:

```
x509: certificate signed by unknown authority
x509: certificate is valid for IP-foo not IP-bar
```

kubeadm klasteridagi kubeletlarni toʻgʻri imzolangan xizmat sertifikatlariga ega qilib qanday sozlashni tushunish uchun
[Imzolangan kubelet xizmat sertifikatlarini yoqish](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#kubelet-serving-certs) sahifasiga qarang.

Shuningdek, [metrics-server ni xavfsiz qanday ishga tushirish](https://github.com/kubernetes-sigs/metrics-server/blob/master/FAQ.md#how-to-run-metrics-server-securely) sahifasiga qarang.

## Yangilash etcd xeshi oʻzgarmagani sababli muvaffaqiyatsiz tugaydi

Faqat tugun hozir kubeadm v1.28.0, v1.28.1 yoki v1.28.2 versiyalari bilan boshqarilayotgan boʻlsa,
boshqaruv tekisligi tugunini kubeadm binariysi v1.28.3 yoki undan keyingisi bilan yangilashga tatbiq etiladi.

Duch kelishingiz mumkin boʻlgan xato xabari:

```
[upgrade/etcd] Failed to upgrade etcd: couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced: static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
[upgrade/etcd] Waiting for previous etcd to become available
I0907 10:10:09.109104    3704 etcd.go:588] [etcd] attempting to see if all cluster endpoints ([https://172.17.0.6:2379/ https://172.17.0.4:2379/ https://172.17.0.3:2379/]) are available 1/10
[upgrade/etcd] Etcd was rolled back and is now available
static Pod hash for component etcd on Node kinder-upgrade-control-plane-1 did not change after 5m0s: timed out waiting for the condition
couldn't upgrade control plane. kubeadm has tried to recover everything into the earlier state. Errors faced
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.rollbackOldManifests
	cmd/kubeadm/app/phases/upgrade/staticpods.go:525
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.upgradeComponent
	cmd/kubeadm/app/phases/upgrade/staticpods.go:254
k8s.io/kubernetes/cmd/kubeadm/app/phases/upgrade.performEtcdStaticPodUpgrade
	cmd/kubeadm/app/phases/upgrade/staticpods.go:338
...
```

Bu muvaffaqiyatsizlikning sababi shuki, taʼsirlangan versiyalar PodSpec da keraksiz standart qiymatlar bilan
etcd manifest faylini yaratadi. Bu manifest taqqoslashidan diff keltirib chiqaradi
va kubeadm Pod xeshida oʻzgarish kutadi, lekin kubelet xeshni hech qachon yangilamaydi.

Klasteringizda buni koʻrsangiz, muammoni aylanib oʻtishning ikki usuli bor:

- Taʼsirlangan versiyalar va v1.28.3 (yoki undan keyingisi) oʻrtasida etcd yangilashini quyidagi bilan oʻtkazib yuborish mumkin:

  ```shell
  kubeadm upgrade {apply|node} [version] --etcd-upgrade=false
  ```

  Keyingi v1.28 yamoq versiyasi yangi etcd versiyasini kiritgan boʻlsa, bu tavsiya etilmaydi.

- Yangilashdan oldin muammoli standart atributlarni olib tashlash uchun etcd statik podi manifestini yamoq qiling:

  ```patch
  diff --git a/etc/kubernetes/manifests/etcd_defaults.yaml b/etc/kubernetes/manifests/etcd_origin.yaml
  index d807ccbe0aa..46b35f00e15 100644
  --- a/etc/kubernetes/manifests/etcd_defaults.yaml
  +++ b/etc/kubernetes/manifests/etcd_origin.yaml
  @@ -43,7 +43,6 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
      name: etcd
      resources:
  @@ -59,26 +58,18 @@ spec:
          scheme: HTTP
        initialDelaySeconds: 10
        periodSeconds: 10
  -      successThreshold: 1
        timeoutSeconds: 15
  -    terminationMessagePath: /dev/termination-log
  -    terminationMessagePolicy: File
      volumeMounts:
      - mountPath: /var/lib/etcd
        name: etcd-data
      - mountPath: /etc/kubernetes/pki/etcd
        name: etcd-certs
  -  dnsPolicy: ClusterFirst
  -  enableServiceLinks: true
    hostNetwork: true
    priority: 2000001000
    priorityClassName: system-node-critical
  -  restartPolicy: Always
  -  schedulerName: default-scheduler
    securityContext:
      seccompProfile:
        type: RuntimeDefault
  -  terminationGracePeriodSeconds: 30
    volumes:
    - hostPath:
        path: /etc/kubernetes/pki/etcd
  ```

Bu xato haqida qoʻshimcha maʼlumotni
[kuzatuv muammosida](https://github.com/kubernetes/kubeadm/issues/2927) topishingiz mumkin.
