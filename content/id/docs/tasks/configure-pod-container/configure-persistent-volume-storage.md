---
title: Mengatur Pod untuk Penyimpanan dengan PersistentVolume
content_type: task
weight: 60
---

<!-- overview -->

Laman ini akan menjelaskan bagaimana kamu dapat mengatur sebuah Pod dengan menggunakan
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
untuk penyimpanan.
Berikut ringkasan prosesnya:

1. Kamu, sebagai seorang administrator klaster, membuat sebuah PersistentVolume yang didukung oleh penyimpanan
fisik. Kamu tidak mengaitkan volume dengan Pod apapun.

2. Kamu, sekarang mengambil peran sebagai seorang _developer_ / pengguna klaster, membuat sebuah
PersistentVolumeClaim yang secara otomatis terikat dengan PersistentVolume yang sesuai.

3. Kamu membuat sebuah Pod yang menggunakan PersistentVolumeClaim di atas untuk penyimpanan.



## {{% heading "prerequisites" %}}


* Kamu membutuhkan sebuah klaster Kubernetes yang hanya memiliki satu Node, dan 
{{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
alat baris perintah yang sudah diatur untuk berkomunikasi dengan klaster kamu. Jika kamu
tidak memiliki sebuah klaster dengan Node tunggal, kamu dapat membuatnya dengan 
[Minikube](/docs/getting-started-guides/minikube).

* Familiar dengan materi di
[Persistent Volumes](/id/docs/concepts/storage/persistent-volumes/).



<!-- steps -->

## Membuat sebuah berkas index.html di dalam Node kamu

Buka sebuah _shell_ ke Node tunggal di klaster kamu. Bagaimana kamu membuka sebuah _shell_ tergantung
dengan bagaimana kamu mengatur klaster kamu. Contoh, jika kamu menggunakan Minikube, kamu
dapat membuka sebuah _shell_ ke Node kamu dengan memasukkan `minikube ssh`. 

Di dalam _shell_ kamu pada Node itu, buat sebuah direktori dengan nama `/mnt/data`:

```shell
# Asumsikan Node kamu menggunakan "sudo" untuk menjalankan perintah
# sebagai superuser
sudo mkdir /mnt/data
```


Di dalam  direktori `/mnt/data`, buat sebuah berkas dengan nama `index.html`:

```shell
# Disini kembali asumsikan bahwa Node kamu menggunakan "sudo" untuk menjalankan perintah
# sebagai superuser
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
Jika Node kamu menggunakan alat untuk mengakses _superuser_ selain dengan `sudo`, kamu dapat
membuat ini bekerja jika mengganti `sudo` dengan nama dari alat lainnya.
{{< /note >}}

Menguji bahwa berkas `index.html` ada:

```shell
cat /mnt/data/index.html
```

Keluaran akan seperti ini:
```
Hello from Kubernetes storage
```

Sekarang kamu dapat menutup _shell_ di Node kamu.

## Membuat sebuah PersistentVolume

Pada latihan ini, kamu akan membuat sebuah *hostPath* PersistentVolume. Kubernetes mendukung
hostPath untuk pengembangan dan pengujian di dalam klaster Node tunggal. Sebuah hostPath
PersistentVolume menggunakan berkas atau direktori di dalam Node untuk meniru penyimpanan terhubung jaringan (NAS, _network-attached storage_).

Di dalam klaster _production_, kamu tidak dapat menggunakan hostPath. Sebagai gantinya sebuah administrator klaster
akan menyediakan sumberdaya jaringan seperti Google Compute Engine _persistent disk_,
_NFS share_, atau sebuah Amazon Elastic Block Store volume. Administrator klaster juga dapat 
menggunakan [StorageClass](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
untuk mengatur
[_provisioning_ secara dinamis](https://kubernetes.io/blog/2016/10/dynamic-provisioning-and-storage-in-kubernetes).

Berikut berkas konfigurasi untuk hostPath PersistentVolume:

{{% codenew file="pods/storage/pv-volume.yaml" %}}

Berkas konfigurasi tersebut menentukan bahwa volume berada di `/mnt/data` pada 
klaster Node. Konfigurasi tersebut juga menentukan ukuran dari 10 gibibytes dan 
mode akses `ReadWriteOnce`, yang berarti volume dapat di pasang sebagai
_read-write_ oleh Node tunggal. Konfigurasi ini menggunakan [nama dari StorageClass](/id/docs/concepts/storage/persistent-volumes/#kelas)
`manual` untuk PersistentVolume, yang akan digunakan untuk mengikat
permintaan PeristentVolumeClaim ke PersistentVolume ini.

Membuat sebuah PersistentVolume:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

Melihat informasi tentang PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Keluaran menunjuk PersistentVolume memliki sebuah `STATUS` dari `Available`. Ini
berarti PersistentVolume belum terikat ke PersistentVolumeClaim.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s

## Membuat sebuah PersistentVolumeClaim

Langkah selanjutnya adalah membuat sebuah PersistentVolumeClaim. Pod menggunakan PersistentVolumeClaim
untuk meminta penyimpanan fisik. Pada latihan ini, kamu akan membuat sebuah PersistentVolumeClaim
yang meminta sebuah volume minimal tiga gibibytes dengan mode akses _read-write_ 
setidaknya untuk satu Node.

Berikut berkas konfigurasi untuk PersistentVolumeClaim:

{{% codenew file="pods/storage/pv-claim.yaml" %}}

Membuat sebuah PersistentVolumeClaim:

    kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml

Setelah membuat sebuah PersistentVolumeClaim, Kubernetes _control plane_ terlihat
untuk sebuah PersistentVolumeClaim yang memenuhi persyaratan _claim's_. Jika
_control plane_ menemukan PersistentVolume yang cocok dengan StorageClass, maka
akan mengikat _claim_ ke dalam volume tersebut.

Lihat kembali PersistentVolume:

```shell
kubectl get pv task-pv-volume
```

Sekarang keluaran menunjukan sebuah `STATUS` dari `Bound`.

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m

Lihat PersistentVolumeClaim:

```shell
kubectl get pvc task-pv-claim
```

Keluaran menunjukan PersistentVolumeClaim terlah terikat dengan PersistentVolume,
`task-pv-volume`.

    NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
    task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s

## Membuat sebuah Pod

Langkah selanjutnya adalah membuat sebuah Pod yang akan menggunakan PersistentVolumeClaim sebagai volume.

Berikut berkas konfigurasi untuk Pod:

{{% codenew file="pods/storage/pv-pod.yaml" %}}

Perhatikan bahwa berkas konfigurasi Pod menentukan sebuah PersistentVolumeClaim, tetapi
tidak menentukan PeristentVolume. Dari sudut pandang Pod, _claim_ adalah volume.

Membuat Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

Pastikan bahwa Container di dalam Pod berjalan:

```shell
kubectl get pod task-pv-pod
```

Mendapatkan sebuah _shell_ ke Container yang sedang berjalan di Pod kamu:

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

Di dalam _shell_, pastikan bahwa nginx menyajikan berkas `index.html` dari dalam 
hostPath volume:

```shell
# Pastikan kamu menjalankan 3 perintah ini di dalam shell root yang berasal dari
# "kubectl exec" dari langkah sebelumnya
apt update
apt install curl
curl http://localhost/
```

Keluaran akan menunjukan sebuah teks yang telah kamu tulis di berkas `index.html`
di dalam hostPath volume:

    Hello from Kubernetes storage


Jika kamu melihat pesan tersebut, kamu telah berhasil mengatur sebuah Pod
untuk menggunakan penyimpanan dari PersistentVolumeClaim.

## Membersihkan

Hapus Pod, PersistentVolumeClaim dan PersistentVolume:

```shell
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

Jika kamu belum memiliki _shell_ yang telah dibuka ke Node di klaster kamu,
buka _shell_ baru dengan cara yang sama yang telah kamu lakukan sebelumnya.

Di dalam _shell_ Node kamu, hapus berkas dan direktori yang telah kamu buat:

```shell
# Asumsikan Node kamu menggunakan "sudo" untuk menjalankan perintah
# sebagai superuser
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

Sekarang kamu dapat menutup _shell_ Node kamu.




<!-- discussion -->

## Kontrol akses

Penyimpanan yang telah terkonfigurasi dengan group ID (GID) memungkinkan akses menulis hanya dari Pod yang menggunakan
GID yang sama. GID yang tidak cocok atau hilang akan menyebabkan kesalahan izin ditolak. Untuk mengurangi
kebutuhan koordinasi dengan pengguna, administrator dapat membuat anotasi sebuah PersistentVolume
dengan GID. Kemudian GID akan otomatis ditambahkan ke Pod yang menggunakan PersistentVolume.

Gunakan anotasi `pv.beta.kubernetes.io/gid` sebagai berikut:
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```
Ketika sebuah Pod mengkonsumsi PersistentVolume yang memiliki anotasi GID, anotasi GID tersebut
akan diterapkan ke semua container di dalam Pod dengan cara yang sama yang ditentukan di dalam GID Pod security context.
Settiap GID, baik berasal dari anotasi PersistentVolume atau Pod, diterapkan pada proses pertama yang dijalankan 
di setiap container.

{{< note >}}
Ketika sebuah Pod mengkonsumsi PersistentVolume, GID yang terkait dengan PersistentVolume
tidak ada di dalam sumberdaya Pod itu sendiri.
{{< /note >}}




## {{% heading "whatsnext" %}}


* Belajar lebih lanjut tentang [PersistentVolume](/id/docs/concepts/storage/persistent-volumes/).
* Baca [dokumen perancangan Penyimpanan _Persistent_](https://git.k8s.io/community/contributors/design-proposals/storage/persistent-storage.md).

### Referensi

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)


