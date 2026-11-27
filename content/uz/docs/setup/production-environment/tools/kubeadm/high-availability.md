---
# reviewers:
# - sig-cluster-lifecycle
title: kubeadm bilan yuqori mavjudlikka ega klasterlar yaratish
content_type: task
weight: 60
---

<!-- overview -->

Ushbu sahifa kubeadm yordamida yuqori mavjudlikka ega Kubernetes
klasterini sozlashning ikki xil yondashuvini tushuntiradi:

- Ustma-ust boshqaruv tekisligi tugunlari bilan. Bu yondashuv kamroq infratuzilma talab qiladi. etcd aʼzolari
  va boshqaruv tekisligi tugunlari bir joyda joylashadi.
- Tashqi etcd klasteri bilan. Bu yondashuv koʻproq infratuzilma talab qiladi.
  Boshqaruv tekisligi tugunlari va etcd aʼzolari ajratiladi.

Davom etishdan oldin qaysi yondashuv ilovalaringiz va muhitingiz ehtiyojlariga eng yaxshi mos kelishini
diqqat bilan koʻrib chiqing. [Yuqori mavjudlik topologiyasi variantlari](/docs/setup/production-environment/tools/kubeadm/ha-topology/)
har birining afzalliklari va kamchiliklarini bayon qiladi.

Yuqori mavjudlik klasterini sozlashda muammolarga duch kelsangiz, ularni kubeadm
[muammo kuzatuvchisida](https://github.com/kubernetes/kubeadm/issues/new) xabar qiling.

Shuningdek, [yangilash hujjatiga](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) qarang.

{{< caution >}}
Ushbu sahifa klasteringizni bulut provayderida ishga tushirishni qamrab olmaydi. Bulut
muhitida bu yerda hujjatlashtirilgan yondashuvlarning hech biri LoadBalancer turidagi
Service obyektlari yoki dinamik PersistentVolume lar bilan ishlamaydi.
{{< /caution >}}

## {{% heading "prerequisites" %}}

Old shartlar klasteringizning boshqaruv tekisligi uchun qaysi topologiyani tanlaganingizga bogʻliq:

{{< tabs name="prerequisite_tabs" >}}
{{% tab name="Ustma-ust etcd" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    external etc tab
-->

Sizga quyidagilar kerak:

- Boshqaruv tekisligi tugunlari uchun [kubeadm ning minimal talablariga](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) javob beradigan
  uch yoki undan koʻp mashina. Boshqaruv tekisligi tugunlarining toq sonda boʻlishi mashina yoki zona
  nosozligida liderni tanlashga yordam berishi mumkin.
  - jumladan, allaqachon sozlangan va ishlayotgan {{< glossary_tooltip text="konteyner runtime" term_id="container-runtime" >}}
- Ishchi tugunlar uchun [kubeadm ning minimal
  talablariga](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) javob beradigan uch yoki undan koʻp mashina
  - jumladan, allaqachon sozlangan va ishlayotgan konteyner runtime
- Klasterdagi barcha mashinalar oʻrtasida toʻliq tarmoq ulanishi (ommaviy yoki
  xususiy tarmoq)
- Barcha mashinalarda `sudo` yordamida superfoydalanuvchi imtiyozlari
  - Boshqa vositadan foydalanishingiz mumkin; ushbu qoʻllanma misollarda `sudo` dan foydalanadi.
- Tizimdagi barcha tugunlarga bitta qurilmadan SSH kirishi
- Barcha mashinalarda `kubeadm` va `kubelet` allaqachon oʻrnatilgan.

_Kontekst uchun [Ustma-ust etcd topologiyasi](/docs/setup/production-environment/tools/kubeadm/ha-topology/#stacked-etcd-topology) ga qarang._

{{% /tab %}}
{{% tab name="Tashqi etcd" %}}
<!--
    note to reviewers: these prerequisites should match the start of the
    stacked etc tab
-->
Sizga quyidagilar kerak:

- Boshqaruv tekisligi tugunlari uchun [kubeadm ning minimal talablariga](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) javob beradigan
  uch yoki undan koʻp mashina. Boshqaruv tekisligi tugunlarining toq sonda boʻlishi mashina yoki zona
  nosozligida liderni tanlashga yordam berishi mumkin.
  - jumladan, allaqachon sozlangan va ishlayotgan {{< glossary_tooltip text="konteyner runtime" term_id="container-runtime" >}}
- Ishchi tugunlar uchun [kubeadm ning minimal
  talablariga](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#before-you-begin) javob beradigan uch yoki undan koʻp mashina
  - jumladan, allaqachon sozlangan va ishlayotgan konteyner runtime
- Klasterdagi barcha mashinalar oʻrtasida toʻliq tarmoq ulanishi (ommaviy yoki
  xususiy tarmoq)
- Barcha mashinalarda `sudo` yordamida superfoydalanuvchi imtiyozlari
  - Boshqa vositadan foydalanishingiz mumkin; ushbu qoʻllanma misollarda `sudo` dan foydalanadi.
- Tizimdagi barcha tugunlarga bitta qurilmadan SSH kirishi
- Barcha mashinalarda `kubeadm` va `kubelet` allaqachon oʻrnatilgan.

<!-- end of shared prerequisites -->

Shuningdek, sizga quyidagilar ham kerak:

- etcd klasteri aʼzolariga aylanadigan uch yoki undan koʻp qoʻshimcha mashina.
  Optimal ovoz berish kvorumiga erishish uchun etcd klasteridagi aʼzolar sonining toq boʻlishi talab.
  - Bu mashinalarda ham `kubeadm` va `kubelet` oʻrnatilgan boʻlishi kerak.
  - Bu mashinalarda ham allaqachon sozlangan va ishlayotgan konteyner runtime talab qilinadi.

_Kontekst uchun [Tashqi etcd topologiyasi](/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology) ga qarang._
{{% /tab %}}
{{< /tabs >}}

### Konteyner obrazlari

Har bir xost Kubernetes konteyner obrazlari registri `registry.k8s.io` dan obrazlarni
oʻqiy olishi va tortib ola olishi kerak. Xostlar obrazlarni tortib olish imkoniga ega boʻlmagan
yuqori mavjudlikka ega klaster joylashtirmoqchi boʻlsangiz, bu mumkin. Boshqa vositalar bilan tegishli
xostlarda toʻgʻri konteyner obrazlari allaqachon mavjud ekaniga ishonch hosil qilishingiz kerak.

### Buyruq qatori interfeysi {#kubectl}

Klasteringiz sozlangach Kubernetesni boshqarish uchun shaxsiy kompyuteringizga
[kubectl ni oʻrnatishingiz](/docs/tasks/tools/#kubectl) kerak. `kubectl` vositasini har bir boshqaruv tekisligi
tuguniga ham oʻrnatish foydali, chunki bu muammolarni bartaraf etishda yordam berishi mumkin.

<!-- steps -->

## Har ikki usul uchun birinchi qadamlar

### kube-apiserver uchun yuk balanslagich yaratish

{{< note >}}
Yuk balanslagichlar uchun koʻp konfiguratsiyalar bor. Quyidagi misol faqat bitta
variantdir. Klasteringiz talablari boshqa konfiguratsiyani talab qilishi mumkin.
{{< /note >}}

1. DNS ga yechiladigan nomga ega kube-apiserver yuk balanslagichini yarating.

   - Bulut muhitida boshqaruv tekisligi tugunlaringizni TCP
     yoʻnaltiruvchi yuk balanslagich ortiga joylashtirishingiz kerak. Bu yuk balanslagich trafigini maqsadlar roʻyxatidagi
     barcha sogʻlom boshqaruv tekisligi tugunlariga taqsimlaydi. Apiserver uchun
     holat tekshiruvi kube-apiserver tinglaydigan portdagi TCP tekshiruvidir
     (standart qiymat `:6443`).

   - Bulut muhitida IP manzildan bevosita foydalanish tavsiya etilmaydi.

   - Yuk balanslagich barcha boshqaruv tekisligi tugunlari bilan apiserver portida
     aloqa qila olishi kerak. U tinglash portida kiruvchi trafikni ham
     qabul qilishi kerak.

   - Yuk balanslagich manzili doim kubeadm ning `ControlPlaneEndpoint` manziliga
     mos kelishiga ishonch hosil qiling.

   - Batafsil maʼlumot uchun [Dasturiy yuk balanslash variantlari](https://git.k8s.io/kubeadm/docs/ha-considerations.md#options-for-software-load-balancing)
     qoʻllanmasini oʻqing.

1. Birinchi boshqaruv tekisligi tugunini yuk balanslagichga qoʻshing va ulanishni
   sinang:

   ```shell
   nc -zv -w 2 <LOAD_BALANCER_IP> <PORT>
   ```

   Ulanish rad etildi xatosi kutiladi, chunki API server hali
   ishlamayapti. Taym-aut esa yuk balanslagich boshqaruv tekisligi tuguni bilan
   aloqa qila olmasligini bildiradi. Taym-aut yuz bersa, yuk balanslagichni
   boshqaruv tekisligi tuguni bilan aloqa qiladigan qilib qayta sozlang.

1. Qolgan boshqaruv tekisligi tugunlarini yuk balanslagichning maqsadli guruhiga qoʻshing.

## Ustma-ust boshqaruv tekisligi va etcd tugunlari

### Birinchi boshqaruv tekisligi tuguni uchun qadamlar

1. Boshqaruv tekisligini ishga tushiring:

   ```sh
   sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
   ```

   - Foydalaniladigan Kubernetes versiyasini oʻrnatish uchun `--kubernetes-version` bayrogʻidan foydalanishingiz mumkin.
     kubeadm, kubelet, kubectl va Kubernetes versiyalari mos kelishi tavsiya etiladi.
   - `--control-plane-endpoint` bayrogʻi yuk balanslagichning manzili yoki DNS i va portiga oʻrnatilishi kerak.

   - `--upload-certs` bayrogʻi barcha boshqaruv tekisligi nusxalari oʻrtasida ulashilishi kerak boʻlgan sertifikatlarni
     klasterga yuklash uchun ishlatiladi. Uning oʻrniga sertifikatlarni boshqaruv tekisligi tugunlari oʻrtasida qoʻlda yoki
     avtomatlashtirish vositalari bilan nusxalashni afzal koʻrsangiz, bu bayroqni olib tashlang va quyidagi [Sertifikatlarni qoʻlda
     tarqatish](#manual-certs) boʻlimiga qarang.

   {{< note >}}
   `kubeadm init` bayroqlari `--config` va `--certificate-key` ni aralashtirib boʻlmaydi, shuning uchun
   [kubeadm konfiguratsiyasidan](/docs/reference/config-api/kubeadm-config.v1beta4/) foydalanmoqchi boʻlsangiz,
   tegishli konfiguratsiya joylariga `certificateKey` maydonini qoʻshishingiz kerak
   (`InitConfiguration` va `JoinConfiguration: controlPlane` ostida).
   {{< /note >}}

   {{< note >}}
   Ayrim CNI tarmoq plaginlari qoʻshimcha konfiguratsiya talab qiladi, masalan Pod IP CIDR ini koʻrsatish, boshqalari esa talab qilmaydi.
   [CNI tarmoq hujjatiga](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network) qarang.
   Pod CIDR ini qoʻshish uchun `--pod-network-cidr` bayrogʻini uzating yoki kubeadm konfiguratsiya faylidan foydalanayotgan boʻlsangiz,
   `ClusterConfiguration` ning `networking` obyekti ostida `podSubnet` maydonini oʻrnating.
   {{< /note >}}

   Chiqish quyidagiga oʻxshaydi:

   ```sh
   ...
   You can now join any number of control-plane node by running the following command on each as a root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07

   Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
   As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.

   Then you can join any number of worker nodes by running the following on each as root:
       kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
   ```

   - Bu chiqishni matn fayliga nusxalang. Keyinroq boshqaruv tekisligi va ishchi tugunlarni
     klasterga qoʻshish uchun unga muhtoj boʻlasiz.
   - `--upload-certs` `kubeadm init` bilan ishlatilganda, asosiy boshqaruv tekisligining sertifikatlari
     shifrlanadi va `kubeadm-certs` Secret iga yuklanadi.
   - Sertifikatlarni qayta yuklash va yangi shifrni ochish kalitini yaratish uchun klasterga allaqachon
     qoʻshilgan boshqaruv tekisligi
     tugunida quyidagi buyruqdan foydalaning:

     ```sh
     sudo kubeadm init phase upload-certs --upload-certs
     ```

   - `init` paytida keyinroq `join` ishlata oladigan maxsus `--certificate-key` ni ham koʻrsatishingiz mumkin.
     Bunday kalitni yaratish uchun quyidagi buyruqdan foydalanishingiz mumkin:

     ```sh
     kubeadm certs certificate-key
     ```

   Sertifikat kaliti 32 bayt hajmdagi AES kaliti boʻlgan oʻn oltilik kodlangan satrdir.

   {{< note >}}
   `kubeadm-certs` Secret i va shifrni ochish kaliti ikki soatdan keyin muddati tugaydi.
   {{< /note >}}

   {{< caution >}}
   Buyruq chiqishida aytilganidek, sertifikat kaliti klasterdagi maxfiy maʼlumotlarga kirish imkonini beradi, uni maxfiy saqlang!
   {{< /caution >}}

1. Oʻzingiz tanlagan CNI plaginini qoʻllang:
   CNI provayderini oʻrnatish uchun [ushbu koʻrsatmalarga amal qiling](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network).
   Konfiguratsiya kubeadm konfiguratsiya faylida koʻrsatilgan Pod CIDR iga mos kelishiga ishonch hosil qiling (tatbiq etilsa).

   {{< note >}}
   Foydalanish holatingizga mos tarmoq plaginini tanlab, keyingi qadamga oʻtishdan oldin uni joylashtirishingiz shart.
   Buni qilmasangiz, klasteringizni toʻgʻri ishga tushira olmaysiz.
   {{< /note >}}

1. Quyidagini yozing va boshqaruv tekisligi komponentlarining Podlari ishga tushishini kuzating:

   ```sh
   kubectl get pod -n kube-system -w
   ```

### Qolgan boshqaruv tekisligi tugunlari uchun qadamlar

Har bir qoʻshimcha boshqaruv tekisligi tuguni uchun quyidagilarni bajarishingiz kerak:

1. Birinchi tugundagi `kubeadm init` chiqishi avval sizga bergan join buyrugʻini bajaring.
   U quyidagiga oʻxshash boʻlishi kerak:

   ```sh
   sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
   ```

   - `--control-plane` bayrogʻi `kubeadm join` ga yangi boshqaruv tekisligi yaratishni aytadi.
   - `--certificate-key ...` boshqaruv tekisligi sertifikatlari klasterdagi `kubeadm-certs` Secret idan yuklab olinishiga
     va berilgan kalit yordamida shifri ochilishiga olib keladi.


{{< note >}}
Klaster tugunlari odatda ketma-ket ishga tushirilgani sababli, CoreDNS Podlari ehtimol hammasi
birinchi boshqaruv tekisligi tugunida ishlaydi. Yuqoriroq mavjudlikni taʼminlash uchun kamida bitta yangi tugun qoʻshilgach,
CoreDNS Podlarini `kubectl -n kube-system rollout restart deployment coredns` bilan qayta muvozanatlang.
{{< /note >}}

## Tashqi etcd tugunlari

Tashqi etcd tugunlari bilan klaster sozlash ustma-ust etcd uchun qoʻllaniladigan tartibga oʻxshaydi,
farqi shundaki, avval etcd ni sozlashingiz va etcd maʼlumotini
kubeadm konfiguratsiya faylida uzatishingiz kerak.

### etcd klasterini sozlash

1. etcd klasterini sozlash uchun [ushbu koʻrsatmalarga](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) amal qiling.

1. SSH ni [bu yerda](#manual-certs) tavsiflanganidek sozlang.

1. Quyidagi fayllarni klasterdagi istalgan etcd tugunidan birinchi boshqaruv tekisligi tuguniga nusxalang:

   ```sh
   export CONTROL_PLANE="ubuntu@10.0.0.7"
   scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
   scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
   ```

   - `CONTROL_PLANE` qiymatini birinchi boshqaruv tekisligi tugunining `user@host` i bilan almashtiring.

### Birinchi boshqaruv tekisligi tugunini sozlash

1. Quyidagi mazmunga ega `kubeadm-config.yaml` faylini yarating:

   ```yaml
   ---
   apiVersion: kubeadm.k8s.io/v1beta4
   kind: ClusterConfiguration
   kubernetesVersion: stable
   controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" # change this (see below)
   etcd:
     external:
       endpoints:
         - https://ETCD_0_IP:2379 # change ETCD_0_IP appropriately
         - https://ETCD_1_IP:2379 # change ETCD_1_IP appropriately
         - https://ETCD_2_IP:2379 # change ETCD_2_IP appropriately
       caFile: /etc/kubernetes/pki/etcd/ca.crt
       certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
       keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key
   ```

   {{< note >}}
   Bu yerda ustma-ust etcd va tashqi etcd oʻrtasidagi farq shundaki, tashqi etcd sozlamasi
   `etcd` uchun `external` obyekti ostida etcd endpointlari boʻlgan konfiguratsiya faylini talab qiladi.
   Ustma-ust etcd topologiyasida bu avtomatik boshqariladi.
   {{< /note >}}

   - Konfiguratsiya andozasidagi quyidagi oʻzgaruvchilarni klasteringiz uchun mos qiymatlar bilan almashtiring:

     - `LOAD_BALANCER_DNS`
     - `LOAD_BALANCER_PORT`
     - `ETCD_0_IP`
     - `ETCD_1_IP`
     - `ETCD_2_IP`

Quyidagi qadamlar ustma-ust etcd sozlamasiga oʻxshaydi:

1. Ushbu tugunda `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` ni bajaring.

1. Qaytarilgan chiqishdagi join buyruqlarini keyinroq foydalanish uchun matn fayliga yozing.

1. Oʻzingiz tanlagan CNI plaginini qoʻllang.

   {{< note >}}
   Foydalanish holatingizga mos tarmoq plaginini tanlab, keyingi qadamga oʻtishdan oldin uni joylashtirishingiz shart.
   Buni qilmasangiz, klasteringizni toʻgʻri ishga tushira olmaysiz.
   {{< /note >}}

### Qolgan boshqaruv tekisligi tugunlari uchun qadamlar

Qadamlar ustma-ust etcd sozlamasidagi kabi:

- Birinchi boshqaruv tekisligi tuguni toʻliq ishga tushirilganiga ishonch hosil qiling.
- Har bir boshqaruv tekisligi tugunini matn fayliga saqlagan join buyrugʻingiz bilan qoʻshing. Boshqaruv tekisligi tugunlarini
  bir vaqtda bittadan qoʻshish tavsiya etiladi.
- `--certificate-key` dagi shifrni ochish kaliti sukut boʻyicha ikki soatdan keyin muddati tugashini unutmang.

## Boshqaruv tekisligini boshlangʻich sozlagandan keyingi umumiy vazifalar

### Ishchi tugunlarni oʻrnatish

Ishchi tugunlarni klasterga avval `kubeadm init` buyrugʻi chiqishi sifatida
saqlab qoʻygan buyrugʻingiz bilan qoʻshish mumkin:

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## Sertifikatlarni qoʻlda tarqatish {#manual-certs}

`kubeadm init` ni `--upload-certs` bayrogʻi bilan ishlatmaslikni tanlasangiz, bu sertifikatlarni
asosiy boshqaruv tekisligi tugunidan qoʻshilayotgan boshqaruv tekisligi tugunlariga qoʻlda nusxalashingiz kerak degani.

Buni qilishning koʻp usullari bor. Quyidagi misol `ssh` va `scp` dan foydalanadi:

Barcha tugunlarni bitta mashinadan boshqarmoqchi boʻlsangiz, SSH talab qilinadi.

1. Tizimdagi boshqa barcha tugunlarga kira oladigan asosiy qurilmangizda ssh-agent ni yoqing:

   ```shell
   eval $(ssh-agent)
   ```

1. SSH identifikatoringizni sessiyaga qoʻshing:

   ```shell
   ssh-add ~/.ssh/path_to_private_key
   ```

1. Ulanish toʻgʻri ishlayotganini tekshirish uchun tugunlar oʻrtasida SSH qiling.

   - Istalgan tugunga SSH qilganingizda `-A` bayrogʻini qoʻshing. Bu bayroq SSH orqali
     kirgan tugunga shaxsiy kompyuteringizdagi SSH agentiga kirish imkonini beradi. Tugundagi foydalanuvchi sessiyangiz
     xavfsizligiga toʻliq ishonmasangiz, muqobil usullarni koʻrib chiqing.

     ```shell
     ssh -A 10.0.0.7
     ```

   - Istalgan tugunda sudo ishlatganingizda, SSH yoʻnaltirish ishlashi uchun muhit saqlanishiga ishonch hosil qiling:

     ```shell
     sudo -E -s
     ```

1. Barcha tugunlarda SSH ni sozlaganingizdan soʻng, `kubeadm init` ni bajargandan keyin birinchi
   boshqaruv tekisligi tugunida quyidagi skriptni ishga tushirishingiz kerak. Bu skript sertifikatlarni birinchi
   boshqaruv tekisligi tugunidan boshqa boshqaruv tekisligi tugunlariga nusxalaydi:

   Quyidagi misolda `CONTROL_PLANE_IPS` ni boshqa boshqaruv tekisligi tugunlarining IP manzillari bilan almashtiring.

   ```sh
   USER=ubuntu # customizable
   CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
   for host in ${CONTROL_PLANE_IPS}; do
       scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
       scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
       scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
       scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
       # Skip the next line if you are using external etcd
       scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
   done
   ```

   {{< caution >}}
   Faqat yuqoridagi roʻyxatdagi sertifikatlarni nusxalang. kubeadm qolgan sertifikatlarni qoʻshilayotgan boshqaruv tekisligi nusxalari uchun
   talab qilinadigan SAN lar bilan yaratishni oʻz zimmasiga oladi. Barcha sertifikatlarni xato bilan nusxalasangiz,
   talab qilinadigan SAN lar yetishmasligi tufayli qoʻshimcha tugunlarni yaratish muvaffaqiyatsiz tugashi mumkin.
   {{< /caution >}}

1. Soʻng har bir qoʻshilayotgan boshqaruv tekisligi tugunida `kubeadm join` ni ishga tushirishdan oldin quyidagi skriptni bajarishingiz kerak.
   Bu skript avval nusxalangan sertifikatlarni uy katalogidan `/etc/kubernetes/pki` ga koʻchiradi:

   ```sh
   USER=ubuntu # customizable
   mkdir -p /etc/kubernetes/pki/etcd
   mv /home/${USER}/ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/ca.key /etc/kubernetes/pki/
   mv /home/${USER}/sa.pub /etc/kubernetes/pki/
   mv /home/${USER}/sa.key /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
   mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
   mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
   # Skip the next line if you are using external etcd
   mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
   ```
