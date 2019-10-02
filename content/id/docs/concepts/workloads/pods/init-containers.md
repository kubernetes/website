---
title: Init Container
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
Halaman ini menyediakan ikhtisar untuk Init Container, yaitu Container khusus yang dijalankan sebelum Container aplikasi dan berisi skrip peralatan atau _setup_ yang tidak tersedia di dalam _image_ dari Container aplikasi.
{{% /capture %}}

Fitur ini telah keluar dari trek Beta sejak versi 1.6. Init Container dapat dispesifikasikan di dalam PodSpec bersama dengan _array_ `containers` aplikasi. Nilai anotasi _beta_ akan tetap diperhitungkan dan akan menimpa nilai pada PodSpec, tetapi telah ditandai sebagai kedaluarsa pada versi 1.6 dan 1.7. Pada versi 1.8, anotasi _beta_ tidak didukung lagi dan harus diganti menjadi nilai pada PodSpec.

{{% capture body %}}

## Memahami Init Container

Sebuah [Pod](/docs/concepts/workloads/pods/pod-overview/) dapat memiliki beberapa Container yang berjalan di dalamnya, dan dapat juga memiliki satu atau lebih Init Container, yang akan berjalan sebelum Container aplikasi dijalankan.

Init Container sama saja seperti Container biasa, kecuali:

* Mereka selalu berjalan hingga selesai.
* Setiap Init Container harus selesai secara sukses sebelum Init Container berikutnya dijalankan.

Jika sebuah Init Container tidak selesai secara sukses untuk sebuah Pod, Kubernetes akan mengulang kembali Pod tersebut secara terus menerus hingga Init Container selesai secara sukses. Tetapi, jika Pod tersebut memiliki nilai `restartPolicy` berupa `Never`, Pod tersebut tidak akan diulang kembali.

Untuk menspesifikasikan sebuah Container sebagai Init Container, tambahkan kolom `initContainers` pada PodSpec sebagai sebuah _array_ JSON yang berisi objek dengan tipe [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core), berdampingan dengan array `containers` aplikasi.
Status-status dari Init Container dikembalikan di kolom `.status.initContainerStatuses` sebagai sebuah _array_ dari status-status Container (mirip seperti kolom `status.containerStatuses`)

### Perbedaan dengan Container biasa

Init Container mendukung semua kolom dan fitur dari Container aplikasi, termasuk konfigurasi `limit` sumber daya, `volume`, dan keamanan. Tetapi, `request` dan `limit` sumber daya dari sebuah Init Container ditangani dengan cara yang sedikit berbeda, yang didokumentasikan di bagian [Sumber Daya](#sumber-daya) di bawah. Juga, Init Container tidak mendukung _readiness probe_ karena mereka harus berjalan hingga selesai sebelum Pod dapat siap.

Jika beberapa Init Container dispesifikasikan untuk sebuah Pod, Container-container tersebut akan dijalankan satu per satu secara berurutan. Setiap Init Container harus selesai secara sukses sebelum yang berikutnya dapat berjalan.
Saat semua Init Container telah berjalan hingga selesai, Kubernetes akan menginisialisasi Pod dan menjalankan Container aplikasi seperti biasa.

## Apa kegunaan Init Container?

Karena Init Container memiliki _image_ yang berbeda dengan Container aplikasi, mereka memiliki beberapa kelebihan untuk kode yang berhubungan dengan dimulainya Init Container:

* Mereka dapat berisi dan menjalankan skrip peralatan yang tidak diinginkan untuk berada di dalam _image_ Container aplikasi karena alasan keamanan.
* Mereka dapat berisi skrip peralatan atau _setup_ yang tidak tersedia di dalam _image_ aplikasi. Misalnya, kita tidak perlu membuat _image_ dengan instruksi `FROM` dari _image_ lainnya hanya untuk menggunakan peralatan seperti `sed`, `awk`, `python`, atau `dig` pada saat _setup_.
* Peran _builder_ atau _deployer_ dari _image_ dapat bekerja secara independen tanpa harus digabung untuk membuat satu _image_ aplikasi.
* Mereka menggunakan _namespace_ Linux, sehingga mereka dapat memiliki sudut pandang _filesystem_ yang berbeda dengan Container aplikasi. Oleh karenanya, mereka dapat diberikan akses terhadap `Secret` yang tidak boleh diakses oleh Container aplikasi.
* Mereka berjalan hingga selesai sebelum Container aplikasi manapun dimulai, sedangkan Container aplikasi dijalankan secara paralel, sehingga Init Container menyediakan cara yang mudah untuk menunda dijalankannya Container aplikasi hingga ketentuan-ketentuan yang diinginkan dipenuhi.

### Contoh-contoh

Berikut beberapa contoh kasus penggunaan Init Container:

* Menunggu sebuah Service untuk dibuat dengan perintah _shell_ seperti:

      for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; done; exit 1

* Mendaftarkan suatu Pod ke sebuah peladen terpisah dari _downward API_ dengan perintah seperti:

      `curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'`

* Menunggu beberapa waktu sebelum menjalankan Container aplikasi dengan perintah seperti `sleep 60`.
* Mengklon sebuah _git repository_ ke dalam sebuah _volume_.
* Menaruh nilai-nilai tertentu ke dalam sebuah _file_ konfigurasi dan menjalankan peralatan _template_ untuk membuat _file_ konfigurasi secara dinamis untuk Container aplikasi utama. Misalnya, untuk menaruh nilai POD_IP ke dalam sebuah konfigurasi dan membuat konfigurasi aplikasi utama menggunakan Jinja.
  
Contoh-contoh penggunaan yang lebih detail dapat dilihat pada [dokumentasi StatefulSet](/docs/concepts/workloads/controllers/statefulset/) dan [petunjuk Produksi Pod](/docs/tasks/configure-pod-container/configure-pod-initialization/).

### Menggunakan Init Container

_File_ YAML untuk Kubernetes 1.5 berikut menguraikan sebuah Pod sederhana yang memiliki dua buah Init Container.
Pod pertama menunggu `myservice` dan yang kedua menunggu `mydb`. Saat kedua Init Container tersebut sudah selesai, Podnya akan dijalankan.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
  annotations:
    pod.beta.kubernetes.io/init-containers: '[
        {
            "name": "init-myservice",
            "image": "busybox:1.28",
            "command": ["sh", "-c", "until nslookup myservice; do echo waiting for myservice; sleep 2; done;"]
        },
        {
            "name": "init-mydb",
            "image": "busybox:1.28",
            "command": ["sh", "-c", "until nslookup mydb; do echo waiting for mydb; sleep 2; done;"]
        }
    ]'
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
```

Ada sintaksis baru pada Kubernetes 1.6, walaupun sintaksis anotasi yang lama tetap akan bekerja untuk versi 1.6 dan 1.7. Sintaksis yang baru harus digunakan untuk versi 1.8 ke atas. Deklarasi Init Container dipindahkan ke dalam `spec`:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', 'until nslookup myservice; do echo waiting for myservice; sleep 2; done;']
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', 'until nslookup mydb; do echo waiting for mydb; sleep 2; done;']
```

Sintaksis versi 1.5 tetap akan bekerja pada versi 1.6 dan 1.7, tetapi kami menyarankan untuk menggunakan sintaksis versi 1.6. Pada Kubernetes 1.6, Init Container dijadikan sebagai sebuah kolom di dalam API Kubernetes. Anotasi _beta_ tetap akan diperhitungkan pada versi 1.6 dan 1.7, tetapi tidak didukung lagi pada versi 1.8 ke atas.

_File_ YAML di bawah menguraikan Service `mydb` dan `myservice`.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

Pod ini dapat dijalankan dan di-_debug_ dengan menggunakan perintah berikut:

```shell
kubectl apply -f myapp.yaml
```

```
pod/myapp-pod created
```

```shell
kubectl get -f myapp.yaml
```

```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

```shell
kubectl describe -f myapp.yaml
```

```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app=myapp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container with docker id 5ced34a04634; Security:[seccomp=unconfined]
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container with docker id 5ced34a04634
```

```shell
kubectl logs myapp-pod -c init-myservice # Memeriksa Init Container pertama
kubectl logs myapp-pod -c init-mydb      # Memeriksa Init Container kedua
```

Saat kita menjalankan Service `mydb` dan `myservice`, kita dapat melihat Init Container telah selesai dan `myapp-pod` pun dibuat:

```shell
kubectl apply -f services.yaml
```

```
service/myservice created
service/mydb created
```

```shell
kubectl get -f myapp.yaml
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

Contoh ini sangat sederhana, tetapi dapat memberikan sedikit petunjuk bagi kamu untuk membuat Init Container sendiri.

## Perilaku mendetail

Saat dimulainya sebuah Pod, Init Container dijalankan secara berurutan, setelah jaringan dan _volume_ telah diinisialisasi. Setiap Init Container harus selesai dan keluar secara berhasil sebelum yang berikutnya dijalankan. Jika ada Init Container yang gagal dijalankan atau keluar secara gagal, dia akan diulang kembali sesuai dengan `restartPolicy` yang dimiliki Pod. Tetapi, jika `restartPolicy` Pod disetel dengan nilai `Always`, Init Container akan menggunakan strategi `RestartPolicy` `OnFailure`.

Sebuah Pod tidak dapat masuk ke status `Ready` hingga semua Init Container berhasil selesai. _Port_ di sebuah Init Container tidak diagregasikan di dalam sebuah Service. Sebuah Pod yang sedang diinisalisasikan akan masuk ke dalam status `Pending`, tetapi akan memiliki kondisi `Initializing` yang disetel menjadi `true`.

Jika sebuah Pod diulang [kembali](#alasan-pod-diulang-kembali), semua Init Container harus dijalankan kembali.

Perubahan pada spesifikasi Init Container dibatasi hanya pada kolom `image` pada Init Container. Mengganti kolom `image` sebuah Init Container sama dengan mengulang kembali Pod tersebut.

Karena Init Container dapat diulang kembali, dicoba ulang, atau dijalankan ulang, Init Container sebaiknya bersifat _idempotent_. Khususnya, kode yang menulis ke dalam _file_ pada `EmptyDir` sebaiknya dipersiapkan untuk menangani kemungkinan jika _file_ keluaran yang diharapkan sudah ada di dalam `EmptyDir` tersebut.

Init Container memiliki semua kolom yang dimiliki oleh Container aplikasi. Tetapi, Kubernetes melarang penggunaan `readinessProbe` karena Init Container tidak dapat mendefinisikan/menggunakan _readiness probe_ setelah selesai/keluar secara berhasil. Hal ini dipaksakan saat proses validasi.

Gunakan `activeDeadlineSeconds` pada Pod dan `livenessProbe` pada Container untuk mencegah Init Container gagal terus menerus. Nilai `activeDeadlineSeconds` berlaku juga terhadap Init Container.

Nama setiap Container aplikasi dan Init Container pada sebuah Pod haruslah unik; Kesalahan validasi akan terjadi jika ada Container atau Init Container yang memiliki nama yang sama.

### Sumber Daya

Karena eksekusi Init Container yang berurutan, aturan-aturan untuk sumber daya berlaku sebagai berikut:

* Yang tertinggi antara `request` atau `limit` sumber daya yang didefinisikan pada **semua Init Container** adalah **`request`/`limit` inisialisasi yang berlaku**.
* `request`/`limit` sumber daya Pod yang berlaku adalah yang paling besar diantara:
  * Jumah `request`/`limit` semua Container aplikasi untuk suatu sumber daya.
  * `request`/`limit` inisialisasi yang berlaku untuk suatu sumber daya.
* Penjadwalan dilakukan berdasarkan `request`/`limit` (Pod) yang berlaku, yang berarti bahwa Init Container dapat mengambil sumber daya inisialisasi yang tidak digunakan selama umur Pod tersebut.
* **Tingkat QoS yang berlaku** milik Pod adalah sama dengan tingkat QoS untuk Init Container dan Container aplikasi.

`ResourceQuota` dan `limitedResources` diberlakukan berdasarkan `request` dan `limit` Pod yang berlaku.

Cgroup pada tingat Pod didasarkan pada `request` dan `limit` Pod yang berlaku, sama dengan _scheduler_.

### Alasan Pod diulang kembali

Pod dapat diulang kembali, yang berakibat pada diulangnya eksekusi Init Container, diakibatkan oleh beberapa alasan berikut:

* Seorang pengguna memperbarui `PodSpec`, mengakibatkan `image` Init Container berubah. Perubahan apapun pada `image` Init Container akan mengulang kembali Pod tersebut. Perubahan pada `image` Container aplikasi hanya mengulang kembali Container aplikasi yang bersangkutan.
* Infrastruktur Container Pod diulang kembali. Hal ini jarang terjadi, dan hanya dapat dilakukan oleh seseorang yang memiliki akses _root_ pada _node_ yang bersangkutan.
* Semua Container di dalam Pod diterminasi, dengan nilai `restartPolicy` yang disetel sebagai `Always`, memaksa pengulangan kembali, dan catatan selesainya Init Container telah hilang karena _garbage collection_.

## Dukungan dan kompatibilitas

Sebuah kluster dengan versi Apiserver 1.6.0 ke atas mendukung Init Container melalui kolom `.spec.initContainers`. Versi-versi sebelumnya mendukung Init Container melalui anotasi _alpha_ atau _beta_. Kolom `.spec.initContainers` juga diduplikasikan dalam bentuk anotasi _alpha_ dan _beta_ agar Kubelet versi 1.3.0 ke atas dapat menjalankan Init Container, dan agar Apiserver versi 1.6 dapat dengan aman dikembalikan ke versi 1.5.x tanpa kehilangan fungsionalitas Pod-pod yang telah dibuat sebelumnya.

Pada Apiserver dan Kubelet versi 1.8.0 ke atas, dukungan untuk anotasi _alpha_ dan _beta_ telah dihapus, sehingga dibutuhkan konversi (manual) dari anotasi yang telah kedaluwarsa tersebut ke dalam bentuk kolom `.spec.initContainers`.

{{% /capture %}}


{{% capture whatsnext %}}

* [Membuat Pod yang memiliki Init Container](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container)

{{% /capture %}}
