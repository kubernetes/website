---
title: "Contoh: Men-deploy WordPress dan MySQL dengan Persistent Volumes"
content_type: tutorial
weight: 20
card: 
  name: tutorials
  weight: 40
  title: "Contoh Stateful: WordPress dengan Persistent Volumes"
---

<!-- overview -->
Tutorial ini menunjukkan cara untuk men-deploy situs WordPress dan database MySQL menggunakan Minikube. Kedua aplikasi ini menggunakan PersistentVolumes dan PersistentVolumeClaims untuk menyimpan data.

[PersistentVolume](/docs/concepts/storage/persistent-volumes/) (PV) adalah bagian dari penyimpanan di dalam kluster yang telah disediakan secara manual oleh administrator, atau secara dinamis disediakan oleh Kubernetes menggunakan [StorageClass](/docs/concepts/storage/storage-classes).

[PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims) (PVC) adalah permintaan penyimpanan oleh pengguna yang dapat dipenuhi oleh PV. PersistentVolumes dan PersistentVolumeClaims bersifat independen dari siklus hidup Pod dan mempertahankan data meskipun Pod di-restart, dijadwalkan ulang, atau bahkan dihapus.

{{< warning >}}
Deployment ini tidak cocok untuk kasus penggunaan produksi, karena menggunakan Pod WordPress dan MySQL instance tunggal. Pertimbangkan untuk menggunakan [WordPress Helm Chart](https://github.com/bitnami/charts/tree/master/bitnami/wordpress) untuk mendeploy WordPress di lingkungan produksi.
{{< /warning >}}

{{< note >}}
File yang disediakan dalam tutorial ini menggunakan API Deployment GA dan spesifik untuk Kubernetes versi 1.9 dan yang lebih baru. Jika Anda ingin menggunakan tutorial ini dengan versi Kubernetes yang lebih lama, harap perbarui versi API sesuai kebutuhan, atau rujuk ke versi tutorial sebelumnya.
{{< /note >}}

## {{% heading "objectives" %}}

* Membuat PersistentVolumeClaims dan PersistentVolumes
* Membuat `kustomization.yaml` dengan
  * generator Secret
  * konfigurasi sumber daya MySQL
  * konfigurasi sumber daya WordPress
* Terapkan direktori kustomisasi dengan `kubectl apply -k ./`
* Bersihkan sumber daya

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Contoh yang ditunjukkan di halaman ini bekerja dengan `kubectl` versi 1.27 dan yang lebih baru.

Unduh file konfigurasi berikut:

1. [mysql-deployment.yaml](/examples/application/wordpress/mysql-deployment.yaml)

1. [wordpress-deployment.yaml](/examples/application/wordpress/wordpress-deployment.yaml)

<!-- lessoncontent -->

## Membuat PersistentVolumeClaims dan PersistentVolumes

MySQL dan WordPress masing-masing memerlukan PersistentVolume untuk menyimpan data. PersistentVolumeClaims mereka akan dibuat pada langkah deployment.

Banyak lingkungan kluster memiliki StorageClass default yang sudah di-instal. Ketika StorageClass tidak ditentukan dalam PersistentVolumeClaim, StorageClass default kluster akan digunakan.

Ketika PersistentVolumeClaim dibuat, PersistentVolume akan disediakan secara dinamis berdasarkan konfigurasi StorageClass.

{{< warning >}}
Di kluster lokal, StorageClass default menggunakan provisioner `hostPath`. Volume `hostPath` hanya cocok untuk pengembangan dan pengujian. Dengan volume `hostPath`, data Anda akan disimpan di `/tmp` pada node tempat Pod dijadwalkan dan tidak akan berpindah antar node. Jika sebuah Pod mati dan dijadwalkan ke node lain di kluster, atau node di-reboot, data akan hilang.
{{< /warning >}}

{{< note >}}
Jika Anda menjalankan kluster yang memerlukan provisioner `hostPath`, flag `--enable-hostpath-provisioner` harus diatur pada komponen `controller-manager`.
{{< /note >}}

{{< note >}}
Jika Anda memiliki kluster Kubernetes yang berjalan di Google Kubernetes Engine, silakan ikuti [panduan ini](https://cloud.google.com/kubernetes-engine/docs/tutorials/persistent-disk).
{{< /note >}}

## Membuat kustomization.yaml

### Menambahkan Generator Secret

[Secret](/docs/concepts/configuration/secret/) adalah objek yang menyimpan data sensitif seperti kata sandi atau kunci. Sejak versi 1.14, `kubectl` mendukung pengelolaan objek Kubernetes menggunakan file kustomisasi. Anda dapat membuat Secret menggunakan generator di `kustomization.yaml`.

Tambahkan generator Secret di `kustomization.yaml` dengan perintah berikut. Anda perlu mengganti `KATA_SANDI` dengan kata sandi yang ingin Anda gunakan.

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=KATA_SANDI
EOF
```

## Menambahkan Konfigurasi Sumber Daya untuk MySQL dan WordPress

Manifest berikut menjelaskan Deployment MySQL instance tunggal. Kontainer MySQL memasang PersistentVolume di /var/lib/mysql. Variabel lingkungan `MYSQL_ROOT_PASSWORD` mengatur kata sandi database dari Secret.

{{% code_sample file="application/wordpress/mysql-deployment.yaml" %}}

Manifest berikut menjelaskan Deployment WordPress instance tunggal. Kontainer WordPress memasang PersistentVolume di `/var/www/html` untuk file data situs web. Variabel lingkungan `WORDPRESS_DB_HOST` mengatur nama Layanan MySQL yang didefinisikan di atas, dan WordPress akan mengakses database melalui Layanan. Variabel lingkungan `WORDPRESS_DB_PASSWORD` mengatur kata sandi database dari Secret yang dihasilkan oleh kustomize.

{{% code_sample file="application/wordpress/wordpress-deployment.yaml" %}}

1. Unduh file konfigurasi deployment MySQL.

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/mysql-deployment.yaml
   ```

2. Unduh file konfigurasi WordPress.

   ```shell
   curl -LO https://k8s.io/examples/application/wordpress/wordpress-deployment.yaml
   ```

3. Tambahkan mereka ke file `kustomization.yaml`.

   ```shell
   cat <<EOF >>./kustomization.yaml
   resources:
     - mysql-deployment.yaml
     - wordpress-deployment.yaml
   EOF
   ```

## Terapkan dan Verifikasi

`kustomization.yaml` berisi semua sumber daya untuk mendeploy situs WordPress dan database MySQL. Anda dapat menerapkan direktori dengan

```shell
kubectl apply -k ./
```

Sekarang Anda dapat memverifikasi bahwa semua objek ada.

1. Verifikasi bahwa Secret ada dengan menjalankan perintah berikut:

   ```shell
   kubectl get secrets
   ```

   Responsnya akan seperti ini:

   ```
   NAME                    TYPE                                  DATA   AGE
   mysql-pass-c57bb4t7mf   Opaque                                1      9s
   ```

2. Verifikasi bahwa PersistentVolume telah disediakan secara dinamis.

   ```shell
   kubectl get pvc
   ```

   {{< note >}}
   Mungkin memerlukan waktu beberapa menit untuk PV disediakan dan terikat.
   {{< /note >}}

   Responsnya akan seperti ini:

   ```
   NAME             STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS       AGE
   mysql-pv-claim   Bound     pvc-8cbd7b2e-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   wp-pv-claim      Bound     pvc-8cd0df54-4044-11e9-b2bb-42010a800002   20Gi       RWO            standard           77s
   ```

3. Verifikasi bahwa Pod sedang berjalan dengan menjalankan perintah berikut:

   ```shell
   kubectl get pods
   ```

   {{< note >}}
   Mungkin memerlukan waktu beberapa menit untuk Status Pod menjadi `RUNNING`.
   {{< /note >}}

   Responsnya akan seperti ini:

   ```
   NAME                               READY     STATUS    RESTARTS   AGE
   wordpress-mysql-1894417608-x5dzt   1/1       Running   0          40s
   ```

4. Verifikasi bahwa Layanan sedang berjalan dengan menjalankan perintah berikut:

   ```shell
   kubectl get services wordpress
   ```

   Responsnya akan seperti ini:

   ```
   NAME        TYPE            CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
   wordpress   LoadBalancer    10.0.0.89    <pending>     80:32406/TCP   4m
   ```

   {{< note >}}
   Minikube hanya dapat mengekspos Layanan melalui `NodePort`. EXTERNAL-IP selalu pending.
   {{< /note >}}

5. Jalankan perintah berikut untuk mendapatkan Alamat IP untuk Layanan WordPress:

   ```shell
   minikube service wordpress --url
   ```

   Responsnya akan seperti ini:

   ```
   http://1.2.3.4:32406
   ```

6. Salin alamat IP, dan muat halaman di browser Anda untuk melihat situs Anda.

   Anda akan melihat halaman pengaturan WordPress yang mirip dengan tangkapan layar berikut.

   ![wordpress-init](https://raw.githubusercontent.com/kubernetes/examples/master/mysql-wordpress-pd/WordPress.png)

   {{< warning >}}
   Jangan biarkan instalasi WordPress Anda di halaman ini. Jika pengguna lain menemukannya, mereka dapat mengatur situs web di instance Anda dan menggunakannya untuk menyajikan konten berbahaya.<br/><br/>
   Instal WordPress dengan membuat nama pengguna dan kata sandi atau hapus instance Anda.
   {{< /warning >}}

## {{% heading "cleanup" %}}

1. Jalankan perintah berikut untuk menghapus Secret, Deployment, Service, dan PersistentVolumeClaim Anda:

   ```shell
   kubectl delete -k ./
   ```

## {{% heading "whatsnext" %}}

* Pelajari lebih lanjut tentang [Introspeksi dan Debugging](/docs/tasks/debug/debug-application/debug-running-pod/)
* Pelajari lebih lanjut tentang [Jobs](/docs/concepts/workloads/controllers/job/)
* Pelajari lebih lanjut tentang [Port Forwarding](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Pelajari cara [Mendapatkan Shell ke Kontainer](/docs/tasks/debug/debug-application/get-shell-running-container/)
