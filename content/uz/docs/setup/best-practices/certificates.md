---
title: PKI sertifikatlari va talablar
# reviewers:
# - sig-cluster-lifecycle
content_type: concept
weight: 50
---

<!-- overview -->

Kubernetes TLS orqali autentifikatsiya uchun PKI sertifikatlarini talab qiladi.
Agar Kubernetesni [kubeadm](/docs/reference/setup-tools/kubeadm/) bilan oʻrnatsangiz, klasteringiz talab qiladigan sertifikatlar
avtomatik yaratiladi.
Sertifikatlaringizni oʻzingiz ham yaratishingiz mumkin — masalan, yopiq kalitlaringizni API serverda saqlamaslik orqali ularni xavfsizroq tutish uchun.
Ushbu sahifa klasteringiz talab qiladigan sertifikatlarni tushuntiradi.

<!-- body -->

## Klasteringiz sertifikatlardan qanday foydalanadi {#how-certificates-are-used-by-your-cluster}

Kubernetes quyidagi amallar uchun PKI ni talab qiladi:

### Server sertifikatlari {#server-certificates}

* API server ulanish nuqtasi uchun server sertifikati
* etcd serveri uchun server sertifikati
* Har bir kubelet uchun [server sertifikatlari](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  (har bir {{< glossary_tooltip text="tugun" term_id="node" >}} kubelet ishga tushiradi)
* [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) uchun ixtiyoriy server sertifikati

### Mijoz sertifikatlari {#client-certificates}

* Har bir kubelet uchun mijoz sertifikatlari; Kubernetes APIning mijozi sifatida API serverda autentifikatsiya qilish uchun ishlatiladi
* Har bir API server uchun mijoz sertifikati; etcdga autentifikatsiya qilish uchun ishlatiladi
* Controller manager API server bilan xavfsiz muloqot qilishi uchun mijoz sertifikati
* Scheduler API server bilan xavfsiz muloqot qilishi uchun mijoz sertifikati
* kube-proxy API serverda autentifikatsiya qilishi uchun mijoz sertifikatlari, har bir tugun uchun bittadan
* Klaster administratorlari API serverda autentifikatsiya qilishi uchun ixtiyoriy mijoz sertifikatlari
* [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) uchun ixtiyoriy mijoz sertifikati

### kubeletning server va mijoz sertifikatlari {#kubelet-s-server-and-client-certificates}

Xavfsiz ulanish oʻrnatish va kubelet oldida oʻzini autentifikatsiya qilish uchun API Server mijoz sertifikati va kalit juftligini talab qiladi.

Bu holatda sertifikatdan foydalanishning ikki yondashuvi bor:

* Umumiy sertifikatlar: kube-apiserver mijozlarini autentifikatsiya qilishda foydalanadigan oʻsha sertifikat va kalit juftligidan foydalanishi mumkin. Bu `apiserver.crt`
  va `apiserver.key` kabi mavjud sertifikatlar kubelet serverlari bilan muloqot uchun ishlatilishi mumkinligini anglatadi.

* Alohida sertifikatlar: shu bilan birga, kube-apiserver kubelet serverlari bilan muloqotini autentifikatsiya qilish uchun yangi mijoz sertifikati
  va kalit juftligini yaratishi mumkin. Bu holda
  `kubelet-client.crt` nomli alohida sertifikat va unga mos yopiq kalit
  `kubelet-client.key` yaratiladi.

{{< note >}}
`front-proxy` sertifikatlari faqat [kengaytma API serverini](/docs/tasks/extend-kubernetes/setup-extension-api-server/) qoʻllab-quvvatlash uchun API server agregatsiya qatlamidan foydalanilganda talab qilinadi.
{{< /note >}}

etcd mijozlar va peerlarni autentifikatsiya qilish uchun oʻzaro TLS ni ham qoʻllaydi.

## Sertifikatlar qayerda saqlanadi {#where-certificates-are-stored}

Agar Kubernetesni kubeadm bilan oʻrnatsangiz, sertifikatlarning aksariyati `/etc/kubernetes/pki` da saqlanadi.
Ushbu hujjatlardagi barcha yoʻllar shu katalogga nisbatan berilgan; kubeadm `/etc/kubernetes` ga joylashtiradigan foydalanuvchi hisobi
sertifikatlari bundan mustasno.

## Sertifikatlarni qoʻlda sozlash {#configure-certificates-manually}

Agar kerakli sertifikatlarni kubeadm yaratishini xohlamasangiz, ularni
yagona ildiz CA yordamida yoki barcha sertifikatlarni oʻzingiz taqdim etib yaratishingiz mumkin. Oʻz sertifikat markazingizni yaratish tafsilotlari uchun [Sertifikatlar](/docs/tasks/administer-cluster/certificates/)
sahifasiga qarang. Sertifikatlarni boshqarish haqida koʻproq maʼlumot uchun
[kubeadm bilan sertifikatlarni boshqarish](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
sahifasiga qarang.

### Yagona ildiz CA {#single-root-ca}

Administrator boshqaradigan yagona ildiz CA yaratishingiz mumkin. Soʻngra bu ildiz CA
bir nechta oraliq CA yaratishi va keyingi barcha yaratishni Kubernetesning oʻziga topshirishi mumkin.

Talab qilinadigan CAlar:

| Yoʻl                   | Standart CN               | Tavsif                           |
|------------------------|---------------------------|----------------------------------|
| ca.crt,key             | kubernetes-ca             | Kubernetes umumiy CA             |
| etcd/ca.crt,key        | etcd-ca                   | Barcha etcd bilan bogʻliq funksiyalar uchun |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | [front-end proksi](/docs/tasks/extend-kubernetes/configure-aggregation-layer/) uchun |

Yuqoridagi CAlardan tashqari, xizmat hisoblarini boshqarish uchun ochiq/yopiq kalit juftligi, yaʼni `sa.key` va `sa.pub` ham kerak.
Quyidagi misol oldingi jadvalda koʻrsatilgan CA kaliti va sertifikat fayllarini koʻrsatadi:

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### Barcha sertifikatlar {#all-certificates}

Agar CA yopiq kalitlarini klasteringizga nusxalashni xohlamasangiz, barcha sertifikatlarni oʻzingiz yaratishingiz mumkin.

Talab qilinadigan sertifikatlar:

| Standart CN                   | Ota CA                    | O (Subject ichida) | kind             | xostlar (SAN)                                       |
|-------------------------------|---------------------------|--------------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                    | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                    | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                    | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                    | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                    | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters     | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                    | client           |                                                     |

{{< note >}}
`kube-apiserver-kubelet-client` uchun super-foydalanuvchi guruhi `system:masters` oʻrniga
kamroq imtiyozli guruhdan foydalanish mumkin. kubeadm shu maqsadda `kubeadm:cluster-admins` guruhidan
foydalanadi.
{{< /note >}}

[^1]: klasteringizga ulanadigan boshqa istalgan IP yoki DNS nomi ([kubeadm](/docs/reference/setup-tools/kubeadm/)
ishlatadigan yuk balanslagichning barqaror IP si va/yoki DNS nomi, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

bu yerda `kind` x509 kalit vazifalarining biriga yoki bir nechtasiga mos keladi; bu ham
[CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
turining `.spec.usages` maydonida hujjatlashtirilgan:

| kind   | Kalit vazifasi                                                                 |
|--------|--------------------------------------------------------------------------------|
| server | raqamli imzo (`digital signature`), kalitni shifrlash (`key encipherment`), server autentifikatsiyasi (`server auth`) |
| client | raqamli imzo (`digital signature`), kalitni shifrlash (`key encipherment`), mijoz autentifikatsiyasi (`client auth`) |

{{< note >}}
Yuqorida sanab oʻtilgan xostlar/SAN ishlaydigan klaster olish uchun tavsiya etilganlaridir; aniq
oʻrnatish talab qilsa, barcha server sertifikatlariga qoʻshimcha SANlar qoʻshish mumkin.
{{< /note >}}

{{< note >}}
Faqat kubeadm foydalanuvchilari uchun:

* Yopiq kalitlarsiz CA sertifikatlarini klasteringizga nusxalayotgan holat
  kubeadm hujjatlarida tashqi CA deb ataladi.
* Agar yuqoridagi roʻyxatni kubeadm yaratgan PKI bilan solishtirayotgan boʻlsangiz,
  tashqi etcd holatida `kube-etcd`, `kube-etcd-peer` va `kube-etcd-healthcheck-client` sertifikatlari yaratilmasligini
  yodda tuting.

{{< /note >}}

### Sertifikat yoʻllari {#certificate-paths}

Sertifikatlar tavsiya etilgan yoʻlga joylashtirilishi kerak ([kubeadm](/docs/reference/setup-tools/kubeadm/) ishlatadiganidek).
Joylashuvidan qatʼi nazar, yoʻllar berilgan argument yordamida koʻrsatilishi kerak.

| Standart CN | tavsiya etilgan kalit yoʻli | tavsiya etilgan sertifikat yoʻli | buyruq | kalit argumenti | sertifikat argumenti |
| --------- | ------------------ | ------------------- | ------- | ----------- | ------------ |
| etcd-ca | etcd/ca.key | etcd/ca.crt | kube-apiserver | | --etcd-cafile |
| kube-apiserver-etcd-client | apiserver-etcd-client.key | apiserver-etcd-client.crt | kube-apiserver | --etcd-keyfile | --etcd-certfile |
| kubernetes-ca | ca.key | ca.crt | kube-apiserver | | --client-ca-file |
| kubernetes-ca | ca.key | ca.crt | kube-controller-manager | --cluster-signing-key-file | --client-ca-file,--root-ca-file,--cluster-signing-cert-file |
| kube-apiserver | apiserver.key | apiserver.crt | kube-apiserver | --tls-private-key-file | --tls-cert-file |
| kube-apiserver-kubelet-client | apiserver-kubelet-client.key | apiserver-kubelet-client.crt | kube-apiserver | --kubelet-client-key | --kubelet-client-certificate |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-apiserver | | --requestheader-client-ca-file |
| front-proxy-ca | front-proxy-ca.key | front-proxy-ca.crt | kube-controller-manager | | --requestheader-client-ca-file |
| front-proxy-client | front-proxy-client.key | front-proxy-client.crt | kube-apiserver | --proxy-client-key-file | --proxy-client-cert-file |
| etcd-ca | etcd/ca.key | etcd/ca.crt | etcd | | --trusted-ca-file,--peer-trusted-ca-file |
| kube-etcd | etcd/server.key | etcd/server.crt | etcd | --key-file | --cert-file |
| kube-etcd-peer | etcd/peer.key | etcd/peer.crt | etcd | --peer-key-file | --peer-cert-file |
| etcd-ca | | etcd/ca.crt | etcdctl | | --cacert |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key | etcd/healthcheck-client.crt | etcdctl | --key | --cert |

Xizmat hisobi kalit juftligi uchun ham xuddi shu mulohazalar qoʻllanadi:

| yopiq kalit yoʻli | ochiq kalit yoʻli | buyruq                  | argument                             |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

Quyidagi misol, agar barcha kalit va sertifikatlaringizni oʻzingiz yaratayotgan boʻlsangiz, taqdim etishingiz kerak boʻlgan [oldingi jadvallardagi](#certificate-paths)
fayl yoʻllarini koʻrsatadi:

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```

## Foydalanuvchi hisoblari uchun sertifikatlarni sozlash {#configure-certificates-for-user-accounts}

Quyidagi administrator hisoblari va xizmat hisoblarini qoʻlda sozlashingiz kerak:

| Fayl nomi               | Hisob maʼlumoti nomi       | Standart CN                         | O (Subject ichida)     |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (izohga qarang) | system:nodes      |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
`kubelet.conf` uchun `<nodeName>` qiymati kubelet apiserverda roʻyxatdan oʻtayotganda taqdim etadigan tugun nomi qiymatiga **aynan** mos kelishi shart. Qoʻshimcha tafsilotlar uchun
[Node avtorizatsiyasi](/docs/reference/access-authn-authz/node/)ni oʻqing.
{{< /note >}}

{{< note >}}
Yuqoridagi misolda `<admin-group>` amalga oshirishga xosdir. Baʼzi vositalar standart `admin.conf` dagi
sertifikatni `system:masters` guruhiga kiradigan qilib imzolaydi.
`system:masters` — Kubernetes avtorizatsiya qatlamini, masalan RBAC ni, chetlab oʻta oladigan favqulodda (break-glass) super-foydalanuvchi guruhidir. Shuningdek, baʼzi vositalar ushbu super-foydalanuvchi guruhiga bogʻlangan sertifikat bilan alohida
`super-admin.conf` yaratmaydi.

kubeadm kubeconfig fayllarida ikkita alohida administrator sertifikatini yaratadi.
Bittasi `admin.conf` da boʻlib, unda `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin` boʻladi.
`kubeadm:cluster-admins` — `cluster-admin` ClusterRole ga bogʻlangan maxsus guruhdir.
Bu fayl kubeadm boshqaradigan barcha boshqaruv tekisligi mashinalarida yaratiladi.

Yana biri `super-admin.conf` da boʻlib, unda `Subject: O = system:masters, CN = kubernetes-super-admin` boʻladi.
Bu fayl faqat `kubeadm init` chaqirilgan tugunda yaratiladi.
{{< /note >}}

1. Har bir konfiguratsiya uchun berilgan umumiy nom (CN) va tashkilot (O) bilan x509 sertifikat/kalit juftligini
   yarating.

1. Har bir konfiguratsiya uchun `kubectl` ni quyidagicha ishga tushiring:

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

Bu fayllar quyidagicha ishlatiladi:

| Fayl nomi               | Buyruq                  | Izoh                                                                  |
|-------------------------|-------------------------|-----------------------------------------------------------------------|
| admin.conf              | kubectl                 | Klaster uchun administrator foydalanuvchini sozlaydi                  |
| super-admin.conf        | kubectl                 | Klaster uchun super-administrator foydalanuvchini sozlaydi            |
| kubelet.conf            | kubelet                 | Klasterdagi har bir tugun uchun bittadan talab qilinadi.              |
| controller-manager.conf | kube-controller-manager | `manifests/kube-controller-manager.yaml` dagi manifestga qoʻshilishi kerak |
| scheduler.conf          | kube-scheduler          | `manifests/kube-scheduler.yaml` dagi manifestga qoʻshilishi kerak     |

Quyidagi fayllar oldingi jadvaldagi fayllarning toʻliq yoʻllarini koʻrsatadi:

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
