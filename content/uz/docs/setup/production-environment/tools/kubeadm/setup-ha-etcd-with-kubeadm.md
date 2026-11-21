---
# reviewers:
# - sig-cluster-lifecycle
title: kubeadm bilan yuqori mavjudlikka ega etcd klasterini sozlash
content_type: task
weight: 70
---

<!-- overview -->


Sukut boʻyicha kubeadm har bir boshqaruv tekisligi tugunida mahalliy etcd nusxasini ishga tushiradi.
etcd klasterini tashqi deb hisoblash va etcd nusxalarini alohida xostlarda
taʼminlash ham mumkin. Ikki yondashuv oʻrtasidagi farqlar
[Yuqori mavjudlik topologiyasi variantlari](/docs/setup/production-environment/tools/kubeadm/ha-topology) sahifasida yoritilgan.

Ushbu vazifa klaster yaratish paytida kubeadm foydalana oladigan uch aʼzoli yuqori mavjudlikka ega tashqi
etcd klasterini yaratish jarayonini bosqichma-bosqich koʻrsatadi.

## {{% heading "prerequisites" %}}

- TCP 2379 va 2380 portlari orqali bir-biri bilan aloqa qila oladigan uch xost. Ushbu
  hujjat shu standart portlarni nazarda tutadi. Biroq ular kubeadm konfiguratsiya fayli orqali
  sozlanishi mumkin.
- Har bir xostda systemd va bash bilan mos qobiq oʻrnatilgan boʻlishi kerak.
- Har bir xostda [konteyner runtime, kubelet va kubeadm oʻrnatilgan boʻlishi](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) kerak.
- Har bir xost Kubernetes konteyner obrazlari registriga (`registry.k8s.io`) kira olishi yoki kerakli etcd obrazini
  `kubeadm config images list/pull` yordamida koʻrsatishi/tortib olishi kerak. Ushbu qoʻllanma etcd nusxalarini kubelet boshqaradigan
  [statik Podlar](/docs/tasks/configure-pod-container/static-pod/) sifatida sozlaydi.
- Xostlar oʻrtasida fayllarni nusxalash uchun biror infratuzilma. Masalan, `ssh` va `scp`
  bu talabni qondirishi mumkin.

<!-- steps -->

## Klasterni sozlash

Umumiy yondashuv — barcha sertifikatlarni bitta tugunda yaratish va boshqa tugunlarga faqat
_kerakli_ fayllarni tarqatish.

{{< note >}}
kubeadm quyida tavsiflangan sertifikatlarni yaratish uchun zarur barcha kriptografik mexanizmni oʻz ichiga oladi;
ushbu misol uchun boshqa kriptografik vosita talab qilinmaydi.
{{< /note >}}

{{< note >}}
Quyidagi misollar IPv4 manzillardan foydalanadi, lekin kubeadm, kubelet va etcd ni
IPv6 manzillardan foydalanish uchun ham sozlashingiz mumkin. Dual-stack ayrim Kubernetes parametrlari tomonidan qoʻllab-quvvatlanadi, lekin etcd tomonidan emas. Kubernetes dual-stack
qoʻllab-quvvatlashi haqida batafsil maʼlumot uchun [kubeadm bilan dual-stack qoʻllab-quvvatlash](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/) sahifasiga qarang.
{{< /note >}}

1. kubelet ni etcd uchun xizmat menejeri qilib sozlang.

   {{< note >}}Buni etcd ishlashi kerak boʻlgan har bir xostda bajarishingiz shart.{{< /note >}}
   etcd avval yaratilgani sababli, kubeadm bergan kubelet unit faylidan yuqoriroq ustuvorlikka ega
   yangi unit fayl yaratib, xizmat ustuvorligini bekor qilishingiz kerak.

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # Replace "systemd" with the cgroup driver of your container runtime. The default value in the kubelet is "cgroupfs".
   # Replace the value of "containerRuntimeEndpoint" for a different container runtime if needed.
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   kubelet ishlayotganiga ishonch hosil qilish uchun uning holatini tekshiring.

   ```sh
   systemctl status kubelet
   ```

1. kubeadm uchun konfiguratsiya fayllarini yarating.

   Quyidagi skript yordamida etcd aʼzosi ishlaydigan har bir xost uchun bitta kubeadm konfiguratsiya faylini yarating.

   ```sh
   # Update HOST0, HOST1 and HOST2 with the IPs of your hosts
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # Update NAME0, NAME1 and NAME2 with the hostnames of your hosts
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # Create temp directories to store files that will end up on other hosts
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

1. Sertifikat markazini yarating.

   Agar CA allaqachon boʻlsa, yagona amal — CA ning `crt` va
   `key` faylini `/etc/kubernetes/pki/etcd/ca.crt` hamda
   `/etc/kubernetes/pki/etcd/ca.key` ga nusxalashdir. Bu fayllar nusxalangach,
   keyingi qadamga, «Har bir aʼzo uchun sertifikatlar yaratish» ga oʻting.

   Agar CA hali boʻlmasa, ushbu buyruqni `$HOST0` da bajaring (kubeadm uchun
   konfiguratsiya fayllarini shu yerda yaratgansiz).

   ```
   kubeadm init phase certs etcd-ca
   ```

   Bu ikkita fayl yaratadi:

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. Har bir aʼzo uchun sertifikatlar yarating.

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # cleanup non-reusable certificates
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # No need to move the certs because they are for HOST0

   # clean up certs that should not be copied off this host
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. Sertifikatlar va kubeadm konfiguratsiyalarini nusxalang.

   Sertifikatlar yaratildi va endi ular tegishli xostlariga
   koʻchirilishi kerak.

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. Kutilgan barcha fayllar mavjudligiga ishonch hosil qiling.

   `$HOST0` dagi talab qilinadigan fayllarning toʻliq roʻyxati:

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   `$HOST1` da:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   `$HOST2` da:

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

1. Statik Pod manifestlarini yarating.

   Sertifikatlar va konfiguratsiyalar joyida ekan, endi manifestlarni
   yaratish vaqti. Har bir xostda etcd uchun statik manifest yaratish uchun `kubeadm` buyrugʻini bajaring.

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. Ixtiyoriy: klaster holatini tekshiring.

    Agar `etcdctl` mavjud boʻlmasa, bu vositani konteyner obrazi ichida ishga tushirishingiz mumkin.
    Buni Kubernetes orqali emas, konteyner runtime ingiz bilan bevosita, `crictl run` kabi
    vosita yordamida qilasiz

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 is healthy: successfully committed proposal: took = 16.283339ms
    https://[HOST1 IP]:2379 is healthy: successfully committed proposal: took = 19.44402ms
    https://[HOST2 IP]:2379 is healthy: successfully committed proposal: took = 35.926451ms
    ```

    - `${HOST0}` ni sinayotgan xostingizning IP manziliga oʻrnating.


## {{% heading "whatsnext" %}}

3 ta ishlaydigan aʼzoga ega etcd klasteringiz boʻlgach, kubeadm ning
[tashqi etcd usuli](/docs/setup/production-environment/tools/kubeadm/high-availability/) yordamida
yuqori mavjudlikka ega boshqaruv tekisligini sozlashni davom ettirishingiz mumkin.
