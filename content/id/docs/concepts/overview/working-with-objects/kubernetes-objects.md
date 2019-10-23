---
title: Memahami Konsep Objek-Objek yang ada pada Kubernetes
content_template: templates/concept
weight: 10
card: 
  name: concepts
  weight: 40
---

{{% capture overview %}}
Laman ini menjelaskan bagaimana objek-objek Kubernetes direpresentasikan di dalam API Kubernetes, 
dan bagaimana kamu dapat merepresentasikannya di dalam format `.yaml`.
{{% /capture %}}

{{% capture body %}}
## Memahami Konsep Objek-Objek yang Ada pada Kubernetes

Objek-objek Kubernetes adalah entitas persisten di dalam sistem Kubernetes. 
Kubernetes menggunakan entitas ini untuk merepresentasikan _state_ yang ada pada 
kluster kamu. Secara spesifik, hal itu dapat dideskripsikan sebagai:

* Aplikasi-aplikasi kontainer apa sajakah yang sedang dijalankan (serta pada _node_ apa aplikasi tersebut dijalankan)
* _Resource_ yang tersedia untuk aplikasi tersebut
* _Policy_ yang mengatur bagaimana aplikasi tersebut dijalankan, misalnya _restart_, _upgrade_, dan _fault-tolerance_.

Objek Kubernetes merupakan sebuah _"record of intent"_--yang mana sekali kamu membuat suatu objek, 
sistem Kubernetes akan bekerja secara konsisten untuk menjamin 
bahwa objek tersebut akan selalu ada. Dengan membuat sebuah objek, secara tak langsung kamu 
memberikan informasi pada sistem Kubernetes mengenai perilaku apakah yang kamu inginkan pada _workload_ kluster yang kamu miliki;
dengan kata lain ini merupakan definisi _state_ kluster yang kamu inginkan.

Untuk menggunakan objek-objek Kubernetes--baik membuat, mengubah, atau menghapus objek-objek tersebut--kamu 
harus menggunakan [API Kubernetes](/docs/concepts/overview/kubernetes-api/). 
Ketika kamu menggunakan perintah `kubectl`, perintah ini akan melakukan _API call_ untuk perintah 
yang kamu berikan. Kamu juga dapat menggunakan API Kubernetes secara langsung pada program yang kamu miliki 
menggunakan salah satu [_library_ klien](/docs/reference/using-api/client-libraries/) yang disediakan.

### _Spec_ dan Status Objek

Setiap objek Kubernetes memiliki _field_ berantai yang mengatur konfigurasi sebuah objek:
_spec_ dan status. _Spec_, merupakan _field_ yang harus kamu sediakan, _field_ ini mendeskripsikan 
_state_ yang kamu inginkan untuk objek tersebut--karakteristik dari objek yang kamu miliki. 
Status mendeskripsikan _state_ yang sebenarnya dari sebuah objek, dan hal ini disediakan dan selalu diubah oleh 
sistem Kubernetes. Setiap saat, _Control Plane_ Kubernetes selalu memantau apakah _state_ aktual sudah sesuai dengan 
_state_ yang diinginkan.

Sebagai contoh, _Deployment_ merupakan sebuah objek yang merepresentasikan sebuah aplikasi yang dijalankan di kluster kamu. 
Ketika kamu membuat sebuah _Deployment_, kamu bisa saja memberikan _spec_ bagi _Deployment_ untuk memberikan spesifikasi 
berapa banyak _replica_ yang kamu inginkan. Sistem Kubernetes kemudian akan membaca konfigurasi yang kamu berikan 
dan mengaktifkan tiga buah instans untuk aplikasi yang kamu inginkan--mengubah status yang ada saat ini agar sesuai dengan apa yang kamu inginkan. 
Jika terjadi kegagalan dalam instans yang dibuat, sistem Kubernetes akan memberikan respons bahwa terdapat perbedaan antara _spec_ dan status serta 
melakukan penyesuaian dengan cara memberikan instans pengganti.

Informasi lebih lanjut mengenai _spec_ objek, status, dan _metadata_ dapat kamu baca di [Konvensi API Kubernetes](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md).

### Mendeskripsikan Objek Kubernetes

Ketika kamu membuat sebuah objek di Kubernetes, kamu harus menyediakan _spec_ objek yang 
mendeskripsikan _state_ yang diinginkan, serta beberapa informasi tentang objek tersebut (seperti nama). 
Ketika kamu menggunakan API Kubernetes untuk membuat objek tersebut (baik secara langsung atau menggunakan perintah 
`kubectl`), _request_ API yang dibuat harus mencakup informasi seperti _request body_ dalam format JSON. 
Apabila kamu memberikan **informasi dalam bentuk `.yaml` ketika menggunakan perintah `kubectl`** maka `kubectl` 
akan mengubah informasi yang kamu berikan ke dalam format JSON ketika melakukan _request_ API.

Berikut merupakan contoh _file_ `.yaml` yang menunjukkan _field_ dan _spec_ objek untuk _Deployment_:

{{< codenew file="application/deployment.yaml" >}}

Salah satu cara untuk membuat _Deployment_ menggunakan _file_ `.yaml` 
seperti yang dijabarkan di atas adalah dengan menggunakan perintah 
[`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply) 
pada _command-line interface_ `kubectl` kamu menerapkan _file_ `.yaml` sebagai sebuah argumen. 
Berikut merupakan contoh penggunaannya:

```shell
kubectl apply -f https://k8s.io/examples/application/deployment.yaml --record
```

Keluaran yang digunakan kurang lebih akan ditampilkan sebagai berikut:

```shell
deployment.apps/nginx-deployment created
```

### _Field-Field_ yang dibutuhkan

Pada _file_ `.yaml` untuk objek Kubernetes yang ingin kamu buat, kamu perlu 
menyediakan _value_ untuk _field-field_ berikut:

* _apiVersion_ - Version API Kubernetes mana yang kamu gunakan untuk membuat objek tersebut
* _kind_ - Objek apakah yang ingin kamu buat
* _metadata_ - Data yang dapat kamu gunakan untuk melakukan identifikasi objek termasuk _name_ dalam betuk string, _UID_, dan _namespace_ yang bersifat opsional

Kamu juga harus menyediakan _field_ _spec_. Format spesifik dari _spec_ sebuah objek akan berbeda bergantung 
pada objek apakah yang ingin kamu buat, serta mengandung _field_ berantai yang spesifik bagi objek tersebut. 
[Referensi API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/) memberikan penjelasan 
lebih lanjut mengenai format _spec_ untuk semua objek Kubernetes yang dapat kamu buat. Misalnya saja format _spec_ 
untuk _Pod_ dapat kamu temukan [di sini](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core),
dan format _spec_ untuk _Deployment_ dapat ditemukan 
[di sini](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#deploymentspec-v1-apps).

{{% /capture %}}

{{% capture whatsnext %}}
* Pelajari lebih lanjut mengenai dasar-dasar penting bagi objek Kubernetes, seperti [Pod](/docs/concepts/workloads/pods/pod-overview/).
{{% /capture %}}


