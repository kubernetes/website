---
title: Mengatur Probe Liveness, Readiness dan Startup
content_type: task
weight: 110
---

<!-- overview -->

Laman ini memperlihatkan bagaimana cara untuk mengatur _probe liveness_, _readiness_, dan
_startup_ untuk Container.

_Probe liveness_ digunakan oleh [kubelet](/docs/admin/kubelet/) untuk mengetahui
kapan perlu mengulang kembali (_restart_) sebuah Container. Sebagai contoh, _probe liveness_
dapat mendeteksi _deadlock_, ketika aplikasi sedang berjalan tapi tidak dapat berfungsi dengan baik.
Mengulang Container dengan _state_ tersebut dapat membantu ketersediaan aplikasi yang lebih baik
walaupun ada kekutu (_bug_).

_Probe readiness_ digunakan oleh kubelet untuk mengetahui kapan sebuah Container telah siap untuk
menerima lalu lintas jaringan (_traffic_). Suatu Pod dianggap siap saat semua Container di dalamnya telah
siap. Sinyal ini berguna untuk mengontrol Pod-Pod mana yang digunakan sebagai _backend_ dari Service.
Ketika Pod dalam kondisi tidak siap, Pod tersebut dihapus dari Service _load balancer_.

_Probe startup_ digunakan oleh kubelet untuk mengetahui kapan sebuah aplikasi Container telah mulai berjalan.
Jika _probe_ tersebut dinyalakan, _probe_ akan menonaktifkan pemeriksaan _liveness_ dan _readiness_ sampai
berhasil, kamu harus memastikan _probe_ tersebut tidak mengganggu _startup_ dari aplikasi.
Mekanisme ini dapat digunakan untuk mengadopsi pemeriksaan _liveness_ pada saat memulai Container yang lambat,
untuk menghindari Container dimatikan oleh kubelet sebelum Container mulai dan berjalan.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Mendefinisikan perintah liveness

Kebanyakan aplikasi yang telah berjalan dalam waktu lama pada akhirnya akan
bertransisi ke _state_ yang rusak (_broken_), dan tidak dapat pulih kecuali diulang kembali.
Kubernetes menyediakan _probe liveness_ untuk mendeteksi dan memperbaiki situasi tersebut.

Pada latihan ini, kamu akan membuat Pod yang menjalankan Container dari image
`registry.k8s.io/busybox`. Berikut ini adalah berkas konfigurasi untuk Pod tersebut:

{{% codenew file="pods/probe/exec-liveness.yaml" %}}

Pada berkas konfigurasi di atas, kamu dapat melihat bahwa Pod memiliki satu `Container`.
_Field_ `periodSeconds` menentukan bahwa kubelet harus melakukan _probe liveness_ setiap 5 detik.
_Field_ `initialDelaySeconds` memberitahu kubelet untuk menunggu 5 detik sebelum mengerjakan
_probe_ yang pertama. Untuk mengerjakan _probe_, kubelet menjalankan perintah `cat /tmp/healthy`
pada Container tujuan. Jika perintah berhasil, kode 0 akan dikembalikan, dan kubelet menganggap
Container sedang dalam kondisi hidup (_alive_) dan sehat (_healthy_). Jika perintah mengembalikan
kode selain 0, maka kubelet akan mematikan Container dan mengulangnya kembali.

Saat dimulai, Container akan menjalankan perintah berikut:

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -f /tmp/healthy; sleep 600"
```

Container memiliki berkas `/tmp/healthy` pada saat 30 detik pertama setelah dijalankan.
Kemudian, perintah `cat /tmp/healthy` mengembalikan kode sukses. Namun setelah 30 detik,
`cat /tmp/healthy` mengembalikan kode gagal.

Buatlah sebuah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

Dalam 30 detik pertama, lihatlah _event_ dari Pod:

```shell
kubectl describe pod liveness-exec
```

Keluaran dari perintah tersebut memperlihatkan bahwa belum ada _probe liveness_ yang gagal:

```
FirstSeen    LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
24s       24s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "registry.k8s.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "registry.k8s.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
```

Setelah 35 detik, lihatlah lagi _event_ Pod tersebut:

```shell
kubectl describe pod liveness-exec
```

Baris terakhir dari keluaran tersebut memperlihatkan pesan bahwa _probe liveness_
mengalami kegagalan, dan Container telah dimatikan dan dibuat ulang.

```
FirstSeen LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
37s       37s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "registry.k8s.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "registry.k8s.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
2s        2s      1   {kubelet worker0}   spec.containers{liveness}   Warning     Unhealthy   Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
```

Tunggu 30 detik lagi, dan verifikasi bahwa Container telah diulang kembali:

```shell
kubectl get pod liveness-exec
```

Keluaran perintah tersebut memperlihatkan bahwa jumlah `RESTARTS` telah meningkat:

```
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## Mendefinisikan probe liveness dengan permintaan HTTP

Jenis kedua dari _probe liveness_ menggunakan sebuah permintaan GET HTTP. Berikut ini
berkas konfigurasi untuk Pod yang menjalankan Container dari image `registry.k8s.io/e2e-test-images/agnhost`.

{{% codenew file="pods/probe/http-liveness.yaml" %}}

Pada berkas konfigurasi tersebut, kamu dapat melihat Pod memiliki sebuah Container.
_Field_ `periodSeconds` menentukan bahwa kubelet harus mengerjakan _probe liveness_ setiap 3 detik.
_Field_ `initialDelaySeconds` memberitahu kubelet untuk menunggu 3 detik sebelum mengerjakan
_probe_ yang pertama. Untuk mengerjakan _probe_ tersebut, kubelet mengirimkan sebuah permintaan
GET HTTP ke server yang sedang berjalan di dalam Container dan mendengarkan (_listen_) pada porta 8080.
Jika _handler path_ `/healthz` yang dimiliki server mengembalikan kode sukses, kubelet menganggap
Container sedang dalam kondisi hidup dan sehat. Jika _handler_ mengembalikan kode gagal,
kubelet mematikan Container dan mengulangnya kembali.

Kode yang lebih besar atau sama dengan 200 dan kurang dari 400 mengindikasikan kesuksesan.
Kode selain ini mengindikasikan kegagalan.

Kamu dapat melihat kode program untuk server ini pada [server.go](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/test/images/agnhost/liveness/server.go).

Untuk 10 detik pertama setelah Container hidup (_alive_), _handler_ `/healthz` mengembalikan
status 200. Setelah itu, _handler_ mengembalikan status 500.

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("error: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
})
```

Pemeriksaan kesehatan (_health check_) dilakukan kubelet 3 detik setelah Container dimulai,
sehingga beberapa pemeriksaaan pertama akan berhasil. Namun setelah 10 detik,
pemeriksaan akan gagal, dan kubelet akan mematikan dan mengulang Container kembali.

Untuk mencoba pemeriksaan _liveness_ HTTP, marilah membuat sebuah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

Setelah 10 detik, lihatlah _event_ Pod untuk memverifikasi bahwa _probe liveness_
telah gagal dan Container telah diulang kembali:

```shell
kubectl describe pod liveness-http
```

Untuk rilis sebelum v1.13 (termasuk v1.13), jika variabel lingkungan
`http_proxy` (atau `HTTP_PROXY`) telah diatur pada Node dimana Pod
berjalan, _probe liveness_ HTTP akan menggunakan proksi tersebut.
Untuk rilis setelah v1.13, pengaturan variabel lingkungan pada proksi HTTP lokal
tidak mempengaruhi _probe liveness_ HTTP.

## Mendefinisikan probe liveness TCP

Jenis ketiga dari _probe liveness_ menggunakaan sebuah soket TCP. Dengan konfigurasi ini,
kubelet akan mencoba untuk membuka soket pada Container kamu dengan porta tertentu.
Jika koneksi dapat terbentuk dengan sukses, maka Container dianggap dalam kondisi sehat.
Namun jika tidak berhasil terbentuk, maka Container dianggap gagal.

{{% codenew file="pods/probe/tcp-liveness-readiness.yaml" %}}

Seperti yang terlihat, konfigurasi untuk pemeriksaan TCP cukup mirip dengan
pemeriksaan HTTP. Contoh ini menggunakan _probe readiness_ dan _liveness_.
_Probe readiness_ yang pertama akan dikirimkan oleh kubelet, 5 detik setelah
Container mulai dijalankan. Container akan coba dihubungkan oleh kubelet dengan 
`goproxy` pada porta 8080. Jika _probe_ berhasil, maka Pod akan ditandai menjadi
_ready_. Pemeriksaan ini akan dilanjutkan oleh kubelet setiap 10 detik.

Selain _probe readiness_, _probe liveness_ juga termasuk di dalam konfigurasi.
_Probe liveness_ yang pertama akan dijalankan oleh kubelet, 15 detik setelah Container
mulai dijalankan. Sama seperti _probe readiness_, kubelet akan mencoba untuk
terhubung dengan Container `goproxy` pada porta 8080. Jika _probe liveness_ gagal,
maka Container akan diulang kembali.

Untuk mencoba pemeriksaan _liveness_ TCP, marilah membuat sebuah Pod:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

Setelah 15 detik, lihatlah _event_ Pod untuk memverifikasi _probe liveness_ tersebut:

```shell
kubectl describe pod goproxy
```

## Menggunakan sebuah porta dengan nama

Kamu dapat menggunakan
[ContainerPort](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerport-v1-core)
dengan nama untuk melakukan pemeriksaan _liveness_ HTTP atau TCP:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## Melindungi Container yang lambat untuk dimulai dengan probe startup {#mendefinisikan-probe-startup}

Terkadang kamu harus berurusan dengan aplikasi peninggalan (_legacy_) yang
memerlukan waktu tambahan untuk mulai berjalan pada saat pertama kali diinisialisasi.
Pada kasus ini, cukup rumit untuk mengatur parameter _probe liveness_ tanpa
mengkompromikan respons yang cepat terhadap _deadlock_ yang memotivasi digunakannya
probe_ tersebut. Triknya adalah mengatur _probe startup_ dengan perintah yang sama,
baik pemeriksaan HTTP ataupun TCP, dengan `failureThreshold * periodSeconds` yang
mencukupi untuk kemungkinan waktu memulai yang terburuk.

Sehingga, contoh sebelumnya menjadi:

```yaml
ports:
- name: liveness-port
  containerPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

Berkat _probe startup_, aplikasi akan memiliki paling lambat 5 menit (30 * 10 = 300 detik)
untuk selesai memulai.
Ketika _probe startup_ telah berhasil satu kali, maka _probe liveness_ akan
mengambil alih untuk menyediakan respons cepat terhadap _deadlock_ Container.
Jika _probe startup_ tidak pernah berhasil, maka Container akan dimatikan setelah
300 detik dan perilakunya akan bergantung pada `restartPolicy` yang dimiliki Pod.

## Mendefinisikan probe readiness

Terkadang aplikasi tidak dapat melayani lalu lintas jaringan sementara.
Contohnya, aplikasi mungkin perlu untuk memuat data besar atau berkas konfigurasi
saat dimulai, atau aplikasi bergantung pada layanan eksternal setelah dimulai.
Pada kasus-kasus ini, kamu tidak ingin mematikan aplikasi, tetapi kamu tidak
ingin juga mengirimkan permintaan ke aplikasi tersebut. Kubernetes menyediakan
_probe readiness_ sebagai solusinya. Sebuah Pod dengan Container yang melaporkan
dirinya tidak siap, tidak akan menerima lalu lintas jaringan dari Kubernetes Service.

{{< note >}}
_Probe readiness_ dijalankan di dalam Container selama siklus hidupnya.
{{< /note >}}

_Probe readiness_ memiliki pengaturan yang mirip dengan _probe liveness_. Perbedaan
satu-satunya adalah kamu menggunakan _field_ `readinessProbe`, bukan _field_ `livenessProbe`.

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

Pengaturan untuk _probe readiness_ untuk HTTP dan TCP juga sama persis dengan
pengaturan untuk _probe liveness_.

_Probe readiness_ dan _liveness_ dapat digunakan secara bersamaan untuk
Container yang sama. Apabila keduanya digunakan sekaligus, lalu lintas jaringan
tidak akan sampai ke Container yang belum siap, dan Container akan diulang kembali
(_restart_) saat mengalami kegagalan.

## Mengatur Probe

{{< comment >}}
Nantinya beberapa bagian dari bab ini dapat berpindah ke topik konsep.
{{< /comment >}}

[Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) memiliki
beberapa _field_ yang dapat digunakan untuk mengendalikan pemeriksaan _liveness_ dan _readiness_
secara presisi.

* `initialDelaySeconds`: Durasi dalam detik setelah Container dimulai,
sebelum _probe liveness_ atau _readiness_ diinisiasi. Nilai bawaannya adalah 0 detik. Nilai minimalnya adalah 0.
* `periodSeconds`: Seberapa sering (dalam detik) _probe_ dijalankan. Nilai bawaannya adalah 10 detik.
Nilai minimalnya adalah 0.
* `timeoutSeconds`: Durasi dalam detik setelah _probe_ mengalami _timeout_. Nilai bawaannya adalah 1 detik.
Nilai minimalnya adalah 0.
* `successThreshold`: Jumlah minimal sukses yang berurutan untuk _probe_ dianggap berhasil
setelah mengalami kegagalan. Nilai bawaannya adalah 1. Nilanya harus 1 untuk _liveness_.
Nilai minimalnya adalah 1.
* `failureThreshold`: Ketika sebuah Pod dimulai dan _probe_ mengalami kegagalan, Kubernetes
akan mencoba beberapa kali sesuai nilai `failureThreshold` sebelum menyerah. Menyerah dalam
kasus _probe liveness_ berarti Container akan diulang kembali. Untuk _probe readiness_, menyerah
akan menandai Pod menjadi "tidak siap" (_Unready_). Nilai bawaannya adalah 3. Nilai minimalnya adalah 1.

[_Probe_ HTTP](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
memiliki _field-field_ tambahan yang bisa diatur melalui `httpGet`:

* `host`: Nama dari host yang akan terhubung, nilai bawaannya adalah IP dari Pod. Kamu mungkin
juga ingin mengatur "Host" pada httpHeaders.
* `scheme`: Skema yang digunakan untuk terhubung pada host (HTTP atau HTTPS). Nilai bawaannya adalah HTTP.
* `path`: _Path_ untuk mengakses server HTTP.
* `httpHeaders`: _Header_ khusus yang diatur dalam permintaan HTTP. HTTP memperbolehkan _header_ yang berulang.
* `port`: Nama atau angka dari porta untuk mengakses Container. Angkanya harus ada di antara 1 sampai 65535.

Untuk sebuah _probe_ HTTP, kubelet mengirimkan permintaan HTTP untuk _path_ yang ditentukan
dan porta untuk mengerjakan pemeriksaan. _Probe_ dikirimkan oleh kubelet untuk alamat IP Pod,
kecuali saat alamat digantikan oleh _field_ opsional pada `httpGet`. Jika _field_ `scheme`
diatur menjadi `HTTPS`, maka kubelet mengirimkan permintaan HTTPS dan melewati langkah verifikasi
sertifikat. Pada skenario kebanyakan, kamu tidak menginginkan _field_ `host`.
Berikut satu skenario yang memerlukan `host`. Misalkan Container mendengarkan permintaan
melalui 127.0.0.1 dan _field_ `hostNetwork` pada Pod bernilai true. Kemudian `host`, melalui
`httpGet`, harus diatur menjadi 127.0.0.1. Jika Pod kamu bergantung pada host virtual, dimana
untuk kasus-kasus umum, kamu tidak perlu menggunakan `host`, tetapi perlu mengatur _header_
`Host` pada `httpHeaders`.

Untuk _probe_ TCP, kubelet membuat koneksi _probe_ pada Node, tidak pada Pod, yang berarti bahwa
kamu tidak menggunakan nama Service di dalam parameter `host` karena kubelet tidak bisa
me-_resolve_-nya.



## {{% heading "whatsnext" %}}


* Pelajari lebih lanjut tentang
[Probe Container](/id/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).

Kamu juga dapat membaca rujukan API untuk:

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)


