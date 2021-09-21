---
title: Kontainer Sementara (Ephemeral)
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.16" >}}

Halaman ini memberikan gambaran umum tentang kontainer sementara: satu jenis 
kontainer khusus yang berjalan sementara pada {{< glossary_tooltip term_id="pod" >}} 
yang sudah ada untuk melakukan tindakan yang diinisiasi oleh pengguna seperti 
dalam pemecahan masalah. Kamu menggunakan kontainer sementara untuk memeriksa 
layanan bukan untuk membangun aplikasi.

{{< warning >}}
Kontainer sementara masih berada dalam fase alpha dan tidak cocok untuk 
klaster produksi. Kamu harus mengharapkan adanya suatu fitur yang tidak akan 
berfungsi dalam beberapa situasi tertentu, seperti saat menargetkan _namespace_
dari suatu kontainer. Sesuai dengan Kubernetes
[_Deprecation Policy_](/docs/reference/using-api/deprecation-policy/), fitur alpha
ini dapat berubah secara signifikan di masa depan atau akan dihapus seluruhnya.
{{< /warning >}}



<!-- body -->

## Memahami Kontainer Sementara

{{< glossary_tooltip text="Pod" term_id="pod" >}} adalah blok pembangun 
fundamental dalam aplikasi Kubernetes. Karena Pod diharapkan digunakan hanya 
sekali dan dapat diganti, sehingga kamu tidak dapat menambahkan kontainer ke 
dalam Pod setelah Pod tersebut dibuat. Sebaliknya, kamu biasanya menghapus dan 
mengganti beberapa Pod dengan cara yang terkontrol melalui
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}.

Namun, kadang-kadang perlu juga untuk memeriksa keadaan Pod yang telah ada, 
sebagai contoh untuk memecahkan masalah _bug_ yang sulit direproduksi. Dalam 
kasus ini, kamu dapat menjalankan sebuah kontainer sementara di dalam suatu Pod 
yang sudah ada untuk memeriksa statusnya dan menjalankannya segala macam 
perintah.

### Apa itu Kontainer Sementara?

Kontainer sementara berbeda dengan kontainer lainnya karena tidak memiliki 
jaminan sumber daya maupun akan eksekusi, dan mereka tidak akan pernah secara 
otomatis melakukan _restart_, jadi mereka tidak sesuai untuk membangun aplikasi.
Kontainer sementara dideskripsikan dengan menggunakan ContainerSpec yang sama
dengan kontainer biasa, tetapi banyak bagian yang tidak kompatibel dan tidak 
diperbolehkan untuk kontainer sementara.

- Kontainer sementara mungkin tidak memiliki port, sehingga bagian seperti 
`port`, `livenessProbe`, `readinessProbe` tidak diperbolehkan.
- Alokasi sumber daya untuk Pod tidak dapat diubah, sehingga pengaturan 
  sumber daya tidak diperbolehkan.
- Untuk daftar lengkap bagian yang diperbolehkan, dapat di lihat 
  [referensi dokumentasi Kontainer Sementara](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core).

Kontainer sementara dibuat dengan menggunakan _handler_ khusus 
EphemeralContainers dalam API tanpa menambahkannya langsung ke `pod.spec`, 
sehingga tidak memungkinan untuk menambahkan kontainer sementara dengan 
menggunakan `kubectl edit`.

Seperti dengan kontainer biasa, kamu tidak dapat mengubah atau menghapus 
kontainer sementara setelah kamu memasukkannya ke dalam sebuah Pod.

## Penggunaan Kontainer Sementara

Kontainer sementara berguna untuk pemecahan masalah secara interaktif pada saat 
`kubectl exec` tidak mencukupi karena sebuah kontainer telah hancur atau 
kontainer _image_ tidak memiliki utilitas untuk _debugging_.

Khususnya, untuk [_images_distroless_](https://github.com/GoogleContainerTools/distroless)
memungkinkan kamu untuk menyebarkan kontainer *image* minimal yang mengurangi 
_surface attack_ dan paparan _bug_ dan _vulnerability_. Karena
_image distroless_ tidak mempunyai sebuah _shell_ atau utilitas _debugging_ apa
pun, sehingga sulit untuk memecahkan masalah _image distroless_ dengan 
menggunakan `kubectl exec` saja.

Saat menggunakan kontainer sementara, akan sangat membantu untuk mengaktifkan
[_process namespace sharing_](/id/docs/tasks/configure-pod-container/share-process-namespace/)
sehingga kamu dapat melihat proses pada kontainer lain.

### Contoh

{{< note >}}
Contoh-contoh pada bagian ini membutuhkan `EphemeralContainers` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) untuk
diaktifkan, dan membutuhkan Kubernetes klien dan server versi v1.16 atau 
yang lebih baru.
{{< /note >}}

Contoh-contoh pada bagian ini menunjukkan bagaimana kontainer sementara muncul
dalam API. Kamu biasanya dapat menggunakan plugin `kubectl` untuk mengatasi 
masalah untuk mengotomatiskan langkah-langkah ini.

Kontainer sementara dibuat menggunakan _subresource_ `ephemeralcontainers`
Pod, yang dapat didemonstrasikan menggunakan `kubectl --raw`. Pertama-tama
deskripsikan kontainer sementara untuk ditambahkan dalam daftar 
`EphemeralContainers`:

```json
{
    "apiVersion": "v1",
    "kind": "EphemeralContainers",
    "metadata": {
        "name": "example-pod"
    },
    "ephemeralContainers": [{
        "command": [
            "sh"
        ],
        "image": "busybox",
        "imagePullPolicy": "IfNotPresent",
        "name": "debugger",
        "stdin": true,
        "tty": true,
        "terminationMessagePolicy": "File"
    }]
}
```

Untuk memperbarui kontainer yang sudah berjalan dalam `example-pod`:

```shell
kubectl replace --raw /api/v1/namespaces/default/pods/example-pod/ephemeralcontainers  -f ec.json
```

Ini akan menampilkan daftar baru dari seluruh kontainer sementara:

```json
{
   "kind":"EphemeralContainers",
   "apiVersion":"v1",
   "metadata":{
      "name":"example-pod",
      "namespace":"default",
      "selfLink":"/api/v1/namespaces/default/pods/example-pod/ephemeralcontainers",
      "uid":"a14a6d9b-62f2-4119-9d8e-e2ed6bc3a47c",
      "resourceVersion":"15886",
      "creationTimestamp":"2019-08-29T06:41:42Z"
   },
   "ephemeralContainers":[
      {
         "name":"debugger",
         "image":"busybox",
         "command":[
            "sh"
         ],
         "resources":{

         },
         "terminationMessagePolicy":"File",
         "imagePullPolicy":"IfNotPresent",
         "stdin":true,
         "tty":true
      }
   ]
}
```

Kamu dapat melihat kondisi kontainer sementara yang baru dibuat dengan 
menggunakan `kubectl describe`:

```shell
kubectl describe pod example-pod
```

```
...
Ephemeral Containers:
  debugger:
    Container ID:  docker://cf81908f149e7e9213d3c3644eda55c72efaff67652a2685c1146f0ce151e80f
    Image:         busybox
    Image ID:      docker-pullable://busybox@sha256:9f1003c480699be56815db0f8146ad2e22efea85129b5b5983d0e0fb52d9ab70
    Port:          <none>
    Host Port:     <none>
    Command:
      sh
    State:          Running
      Started:      Thu, 29 Aug 2019 06:42:21 +0000
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

Kamu dapat mengakses kontainer sementara yang baru menggunakan 
`kubectl attach`:

```shell
kubectl attach -it example-pod -c debugger
```

Jika proses berbagi _namespace_ diaktifkan, kamu dapat melihat proses dari semua
kontainer dalam Pod tersebut. Misalnya, setelah mengakses, kamu jalankan 
`ps` di kontainer _debugger_:

```shell
# Jalankan ini pada _shell_ dalam _debugger_ dari kontainer sementara
ps auxww
```
Hasilnya akan seperti ini:
```
PID   USER     TIME  COMMAND
    1 root      0:00 /pause
    6 root      0:00 nginx: master process nginx -g daemon off;
   11 101       0:00 nginx: worker process
   12 101       0:00 nginx: worker process
   13 101       0:00 nginx: worker process
   14 101       0:00 nginx: worker process
   15 101       0:00 nginx: worker process
   16 101       0:00 nginx: worker process
   17 101       0:00 nginx: worker process
   18 101       0:00 nginx: worker process
   19 root      0:00 /pause
   24 root      0:00 sh
   29 root      0:00 ps auxww
```


