---
title: Membangun Klaster dengan Ketersediaan Tinggi menggunakan kubeadm
content_type: task
weight: 60
---

<!-- overview -->

Laman ini menjelaskan dua pendekatan yang berbeda untuk membuat klaster Kubernetes dengan ketersediaan tinggi menggunakan kubeadm:

- Dengan Node _control plane_ yang bertumpuk (_stacked_). Pendekatan ini membutuhkan sumber daya infrastruktur yang lebih sedikit. Anggota-anggota etcd dan Node _control plane_ diletakkan pada tempat yang sama (_co-located_).
- Dengan klaster etcd eksternal. Pendekatan ini membutuhkan lebih banyak sumber daya infrastruktur. Node _control plane_ dan anggota etcd berada pada tempat yang berbeda.

Sebelum memulai, kamu harus memikirkan dengan matang pendekatan mana yang paling sesuai untuk kebutuhan aplikasi dan _environment_-mu. [Topik perbandingan berikut](/id/docs/setup/production-environment/tools/kubeadm/ha-topology/) menguraikan kelebihan dan kekurangan dari masing-masing pendekatan.

Jika kamu menghadapi masalah dalam pembuatan klaster dengan ketersediaan tinggi, silakan berikan umpan balik
pada [pelacak isu](https://github.com/kubernetes/kubeadm/issues/new) kubeadm.

Lihat juga [dokumentasi pembaruan](/id/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15).

{{< caution >}}
Laman ini tidak menunjukkan cara untuk menjalankan klastermu pada penyedia layanan cloud. Pada _environment_ cloud, kedua pendekatan yang didokumentasikan di sini tidak akan bekerja untuk objek Service dengan tipe LoadBalancer maupun PersistentVolume dinamis.
{{< /caution >}}



## {{% heading "prerequisites" %}}


Untuk kedua metode kamu membutuhkan infrastruktur seperti berikut:

- Tiga mesin yang memenuhi [kebutuhan minimum kubeadm](/id/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#sebelum-mulai) untuk
  Node _control plane_
- Tiga mesin yang memenuhi [kebutuhan minimum kubeadm](/id/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#sebelum-mulai) untuk Node _worker_
- Konektivitas internet pada seluruh mesin di dalam klaster (baik jaringan publik maupun jaringan pribadi)
- Hak akses sudo pada seluruh mesin
- Akses SSH dari satu perangkat ke seluruh Node pada sistem
- Perkakas `kubeadm` dan `kubelet` diinstal pada seluruh mesin. Perkakas `kubectl` bersifat opsional.

Untuk klaster etcd eksternal saja, kamu juga membutuhkan:

- Tiga mesin tambahan untuk anggota-anggota etcd



<!-- steps -->

## Langkah pertama untuk kedua metode

### Membuat _load balancer_ untuk kube-apiserver

{{< note >}}
Akan ada banyak konfigurasi untuk _load balancer_. Contoh berikut ini hanyalah salah satu
opsi. Kebutuhan klastermu mungkin membutuhkan konfigurasi berbeda.
{{< /note >}}

1.  Buat sebuah _load balancer_ kube-apiserver dengan sebuah nama yang yang akan mengubah ke dalam bentuk DNS.

    - Pada _environment_ cloud kamu harus meletakkan Node _control plane_ di belakang _load balancer_ yang meneruskan TCP. _Load balancer_ ini mendistribusikan trafik ke seluruh Node _control plane_ pada daftar tujuan. _Health check_ untuk
      apiserver adalah pengujian TCP pada porta yang didengarkan oleh kube-apiserver
      (nilai semula `:6443`).

    - Tidak direkomendasikan untuk menggunakan alamat IP secara langsung pada _environment_ cloud.

    - _Load balancer_ harus dapat berkomunikasi dengan seluruh Node _control plane_ 
      pada porta yang digunakan apiserver. _Load balancer_ tersebut juga harus mengizinkan trafik masuk pada porta yang didengarkannya.

    - Pastikan alamat _load balancer_ sesuai
      dengan alamat `ControlPlaneEndpoint` pada kubeadm.

    - Baca panduan [Opsi untuk _Software Load Balancing_](https://github.com/kubernetes/kubeadm/blob/master/id/docs/ha-considerations.md#options-for-software-load-balancing)
      untuk detail lebih lanjut.

2.  Tambahkan Node _control plane_ pertama pada _load balancer_ dan lakukan pengujian koneksi:

    ```sh
    nc -v LOAD_BALANCER_IP PORT
    ```

    - Kegalatan koneksi yang ditolak memang diantisipasi karena apiserver belum
      berjalan. Namun jika mendapat _timeout_, berarti _load balancer_ tidak dapat berkomunikasi
      dengan Node _control plane_. Jika terjadi _timeout_, lakukan pengaturan ulang pada _load balancer_ agar dapat berkomunikasi dengan Node _control plane_.

3.  Tambahkan Node _control plane_ lainnya pada grup tujuan _load balancer_.

## Node _control plane_ dan etcd bertumpuk (_stacked_)

### Langkah-langkah untuk Node _control plane_ pertama

1.  Inisialisasi _control plane_:

    ```sh
    sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
    ```

    - Kamu bisa menggunakan opsi `--kubernetes-version` untuk mengatur versi Kubernetes yang akan digunakan.
      Direkomendasikan untuk menggunakan versi kubeadm, kubelet, kubectl, dan Kubernetes yang sama.

    - Opsi `--control-plane-endpoint` harus diatur menuju alamat atau DNS dan porta dari _load balancer_.

    - Opsi `--upload-certs` digunakan untuk mengunggah sertifikat-sertifikat yang harus dibagikan ke seluruh
      Node _control plane_ pada klaster. Jika sebaliknya, kamu memilih untuk menyalin sertifikat ke
      seluruh Node _control plane_ sendiri atau menggunakan perkakas automasi, silakan hapus opsi ini dan merujuk ke bagian [Distribusi sertifikat manual](#distribusi-sertifikat-manual) di bawah.

    {{< note >}}
    Opsi `--config` dan `--certificate-key` pada `kubeadm init` tidak dapat digunakan secara bersamaan, maka dari itu jika kamu ingin menggunakan
    [konfigurasi kubeadm](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)
    kamu harus menambahkan _field_ `certificateKey` pada lokasi pengaturan yang sesuai
    (berada di bawah `InitConfiguration` dan `JoinConfiguration: controlPlane`).
    {{< /note >}}

    {{< note >}}
    Beberapa _plugin_ jaringan CNI membutuhkan pengaturan tambahan, seperti menentukan CIDR IP untuk Pod, meski beberapa lainnya tidak.
    Lihat [dokumentasi jaringan CNI](/id/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#jaringan-pod).
    Untuk menambahkan CIDR Pod, tambahkan opsi `--pod-network-cidr`, atau jika kamu menggunakan berkas konfigurasi kubeadm 
    pasang _field_ `podSubnet` di bawah objek `networking` dari `ClusterConfiguration`.
    {{< /note >}}

    - Keluaran yang dihasilkan terlihat seperti berikut ini:

      ```sh
      ...
      You can now join any number of control-plane node by running the following command on each as a root:
          kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
      
      Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
      As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.
      
      Then you can join any number of worker nodes by running the following on each as root:
          kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
      ```

    - Salin keluaran ini pada sebuah berkas teks. Kamu akan membutuhkannya nanti untuk menggabungkan Node _control plane_ dan _worker_ ke klaster.
    - Ketika opsi `--upload-certs` digunakan dengan `kubeadm init`, sertifikat dari _control plane_ utama
       akan dienkripsi dan diunggah ke Secret `kubeadm-certs`.
    - Untuk mengunggah ulang sertifikat dan membuat kunci dekripsi baru, gunakan perintah berikut pada Node _control plane_
      yang sudah tergabung pada klaster:

      ```sh
      sudo kubeadm init phase upload-certs --upload-certs
      ```

    - Kamu juga dapat menentukan `--certificate-key` _custom_ pada saat `init` yang nanti dapat digunakan pada saat `join`.
      Untuk membuat kunci tersebut kamu dapat menggunakan perintah berikut:

      ```sh
      kubeadm alpha certs certificate-key
      ```

    {{< note >}}
    Secret `kubeadm-certs` dan kunci dekripsi akan kadaluarsa setelah dua jam.
    {{< /note >}}

    {{< caution >}}
    Seperti yang tertera pada keluaran perintah, kunci sertifikat memberikan akses ke data klaster yang bersifat sensitif, jaga kerahasiaannya!
    {{< /caution >}}

2.  Pasang _plugin_ CNI pilihanmu:
    [Ikuti petunjuk berikut](/id/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#jaringan-pod)
    untuk menginstal penyedia CNI. Pastikan konfigurasinya sesuai dengan CIDR Pod yang ditentukan pada berkas konfigurasi kubeadm jika diterapkan.

    Pada contoh berikut kami menggunakan Weave Net:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

3.  Tulis perintah berikut dan saksikan Pod komponen-komponen _control plane_ mulai dinyalakan:

    ```sh
    kubectl get pod -n kube-system -w
    ```

### Langkah-langkah selanjutnya untuk Node _control plane_

{{< note >}}
Sejak kubeadm versi 1.15 kamu dapat menggabungkan beberapa Node _control plane_ secara bersamaan.
Pada versi sebelumnya, kamu harus menggabungkan Node _control plane_ baru secara berurutan, setelah
Node pertama selesai diinisialisasi.
{{< /note >}}

Untuk setiap Node _control plane_ kamu harus:

1.  Mengeksekusi perintah untuk bergabung yang sebelumnya diberikan pada keluaran `kubeadm init` pada Node pertama.
    Perintah tersebut terlihat seperti ini:

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    ```

    - Opsi `--control-plane` menunjukkan `kubeadm join` untuk membuat _control plane_ baru.
    - Opsi `--certificate-key ...` akan membuat sertifikat _control plane_ diunduh
      dari Secret `kubeadm-certs` pada klaster dan didekripsi menggunakan kunci yang diberikan.

## Node etcd eksternal

Membangun sebuah klaster dengan Node etcd eksternal memiliki prosedur yang mirip dengan etcd bertumpuk
dengan pengecualian yaitu kamu harus setup etcd terlebih dulu, dan kamu harus memberikan informasi etcd 
pada berkas konfigurasi kubeadm.

### Memasang klaster etcd

1.  Ikuti [petunjuk berikut](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) untuk membangun klaster etcd.

2.  Lakukan pengaturan SSH seperti yang dijelaskan [di sini](#distribusi-sertifikat-manual).

3.  Salin berkas-berkas berikut dari Node etcd manapun pada klaster ke Node _control plane_ pertama:

    ```sh
    export CONTROL_PLANE="ubuntu@10.0.0.7"
    scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
    ```

    - Ganti nilai `CONTROL_PLANE` dengan `user@host` dari mesin _control plane_ pertama.

### Mengatur Node _control plane_ pertama

1.  Buat sebuah berkas bernama `kubeadm-config.yaml` dengan konten sebagai berikut:

        apiVersion: kubeadm.k8s.io/v1beta2
        kind: ClusterConfiguration
        kubernetesVersion: stable
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
            external:
                endpoints:
                - https://ETCD_0_IP:2379
                - https://ETCD_1_IP:2379
                - https://ETCD_2_IP:2379
                caFile: /etc/kubernetes/pki/etcd/ca.crt
                certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
                keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key

  {{< note >}}
  Perbedaan antara etcd bertumpuk dan etcd eksternal yaitu etcd eksternal membutuhkan
  sebuah berkas konfigurasi dengan _endpoint_ etcd di bawah objek `external`untuk `etcd`.
  Pada kasus ini topologi etcd bertumpuk dikelola secara otomatis.
  {{< /note >}}

  -  Ganti variabel-variabel berikut pada templat konfigurasi dengan nilai yang sesuai untuk klastermu:

    - `LOAD_BALANCER_DNS`
    - `LOAD_BALANCER_PORT`
    - `ETCD_0_IP`
    - `ETCD_1_IP`
    - `ETCD_2_IP`

Langkah-langkah berikut sama dengan pengaturan pada etcd bertumpuk:

1.  Jalankan `sudo kubeadm init --config kubeadm-config.yaml --upload-certs` pada Node ini.

2.  Tulis perintah untuk bergabung yang didapat dari keluaran ke dalam sebuah berkas teks untuk digunakan nanti.

3.  Pasang _plugin_ CNI pilihanmu. Contoh berikut ini untuk Weave Net:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

### Langkah selanjutnya untuk Node _control plane_ lainnya

Langkah-langkah selanjutnya sama untuk pengaturan etcd bertumpuk:

- Pastikan Node _control plane_ pertama sudah diinisialisasi dengan sempurna.
- Gabungkan setiap Node _control plane_ dengan perintah untuk bergabung yang kamu simpan dalam berkas teks. Direkomendasikan untuk
menggabungkan Node _control plane_ satu persatu.
- Jangan lupakan bahwa kunci dekripsi dari `--certificate-key` akan kadaluarsa setelah dua jam, pada pengaturan semula.

## Tugas-tugas umum setelah menyiapkan _control plane_

### Menginstal _worker_

Node _worker_ bisa digabungkan ke klaster menggunakan perintah yang kamu simpan sebelumnya
dari keluaran perintah `kubeadm init`:

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## Distribusi sertifikat manual

Jika kamu memilih untuk tidak menggunakan `kubeadm init` dengan opsi `--upload-certs` berarti kamu harus 
menyalin sertifikat dari Node _control plane_ utama secara manual ke
Node _control plane_ yang akan bergabung.

Ada beberapa cara untuk melakukan hal ini. Pada contoh berikut ini kami menggunakan `ssh` dan `scp`:

SSH dibutuhkan jika kamu ingin mengendalikan seluruh Node dari satu mesin.

1.  Nyalakan ssh-agent pada perangkat utamamu yang memiliki akses ke seluruh Node pada
    sistem:

    ```
    eval $(ssh-agent)
    ```

2.  Tambahkan identitas SSH milikmu ke dalam sesi:

    ```
    ssh-add ~/.ssh/path_to_private_key
    ```

3.  Lakukan SSH secara bergantian ke setiap Node untuk memastikan koneksi bekerja dengan baik.

    - Ketika kamu melakukan SSH ke Node, pastikan untuk menambahkan opsi `-A`:

        ```
        ssh -A 10.0.0.7
        ```

    - Jika kamu menggunakan sudo pada Node, pastikan kamu menyimpan _environment_ yang ada sehingga penerusan SSH
      dapat bekerja dengan baik:

        ```
        sudo -E -s
        ```

4. Setelah mengatur SSH pada seluruh Node kamu harus menjalankan skrip berikut pada Node _control plane_ pertama setelah
   menjalankan `kubeadm init`. Skrip ini akan menyalin sertifikat dari Node _control plane_ pertama ke Node
   _control plane_ lainnya:

    Pada contoh berikut, ganti `CONTROL_PLANE_IPS` dengan alamat IP dari
    Node _control plane_ lainnya.
    ```sh
    USER=ubuntu # dapat disesuaikan
    CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
    for host in ${CONTROL_PLANE_IPS}; do
        scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
        # Kutip baris berikut jika kamu menggunakan etcd eksternal
        scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
    done
    ```

    {{< caution >}}
    Salinlah hanya sertifikat yang berada pada daftar di atas saja. Perkakas kubeadm akan mengambil alih pembuatan sertifikat lainnya
    dengan SANs yang dibutuhkan untuk Node _control plane_ yang akan bergabung. Jika kamu menyalin seluruh sertifikat tanpa sengaja,
    pembuatan Node tambahan dapat gagal akibat tidak adanya SANs yang dibutuhkan.
    {{< /caution >}}

5. Lalu, pada setiap Node _control plane_ yang bergabung kamu harus menjalankan skrip berikut sebelum menjalankan `kubeadm join`.
   Skrip ini akan memindahkan sertifikat yang telah disalin sebelumnya dari direktori _home_ ke `/etc/kubernetes/pki`:

    ```sh
    USER=ubuntu # dapat disesuaikan
    mkdir -p /etc/kubernetes/pki/etcd
    mv /home/${USER}/ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/ca.key /etc/kubernetes/pki/
    mv /home/${USER}/sa.pub /etc/kubernetes/pki/
    mv /home/${USER}/sa.key /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
    mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
    # Kutip baris berikut jika kamu menggunakan etcd eksternal
    mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
    ```

