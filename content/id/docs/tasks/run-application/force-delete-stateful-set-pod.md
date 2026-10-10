---
reviewers:
title: Menghapus Paksa Pod StatefulSet
content_type: task
weight: 70
---

<!-- overview -->
Laman ini menjelaskan bagaimana cara menghapus Pod yang menjadi bagian dari sebuah {{< glossary_tooltip text="stateful set" term_id="StatefulSet" >}}, dan menjelaskan pertimbangan yang harus diperhatikan saat melakukannya.


## {{% heading "prerequisites" %}}


* Ini merupakan tugas yang cukup rumit dan memiliki potensi melanggar beberapa properti yang melekat dari StatefulSet.
* Sebelum melanjutkan, pastikan kamu paham dengan pertimbangan yang disebutkan di bawah ini.



<!-- steps -->

## Pertimbangan StatefulSet

Pada operasi normal dari StatefulSet, **tidak pernah** ada kebutuhan untuk menghapus paksa sebuah Pod StatefulSet. [_Controller_ StatefulSet](/id/docs/concepts/workloads/controllers/statefulset/) bertanggung jawab terhadap pembuatan, penyekalaan dan penghapusan terhadap anggota dari StatefulSet. _Controller_ akan berusaha menjaga agar jumlah Pod yang ditentukan dari 0 hingga N-1 hidup dan siap sedia. StatefulSet memastikan bahwa, pada waktu kapanpun, akan ada minimal satu Pod dengan identitas yang telah ditetapkan berjalan pada klaster. Hal ini direferensikan sebagai semantik *at most one* yang disediakan StatefulSet.

Penghapusan paksa secara manual harus dilakukan dengan hati-hati, karena hal tersebut berpotensi melanggar semantik _at most one_ yang melekat pada StatefulSet. StatefulSet dapat digunakan untuk menjalankan aplikasi terklaster dan terdistribusi yang membutuhkan identitas jaringan dan penyimpanan yang stabil dan tetap. Aplikasi-aplikasi ini biasanya memiliki konfigurasi yang tergantung dengan sejumlah anggota dengan identitas yang tetap. Memiliki banyak anggota dengan identitas yang sama berpotensi menimbulkan kerusakan dan kehilangan data (contohnya skenario  _split brain_ pada sistem berbasis kuorum).

## Menghapus Pod

Kamu dapat melakukan penghapusan Pod secara _graceful_ dengan perintah berikut:

```shell
kubectl delete pods <pod>
```

Agar perintah di atas mengarah ke terminasi secara _graceful_, Pod **tidak boleh** menspesifikasikan `pod.Spec.TerminationGracePeriodSeconds` dengan nilai 0. Praktik untuk mengatur nilai `pod.Spec.TerminationGracePeriodSeconds` menjadi 0 detik merupakan hal yang tidak aman dan sangat tidak disarankan untuk Pod StatefulSet. Penghapusan secara _graceful_  itu aman dan akan memastikan bahwa Pod [akan mati secara _gracefully_](/id/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) sebelum kubelet menghapus nama dari apiserver.

Kubernetes (versi 1.5 atau lebih baru) tidak akan menghapus Pod hanya karena Node tidak dapat dijangkau. Pod yang berjalan pada Node yang tidak dapat dijangkau akan memasuki keadaan 'Terminating' atau 'Unknown' setelah [waktu habis](/id/docs/admin/node/#node-condition). Pod juga dapat memasuki keadaan ini saat pengguna berusaha melakukan penghapusan secara _graceful_ terhadap Pod pada Node yang tidak dapat dijangkau. Cara yang hanya dapat dilakukan untuk menghapus Pod pada keadaan tersebut dari apiserver adalah:

   * Objek Node telah dihapus (baik oleh kamu, atau oleh [_Controller_ Node](/id/docs/admin/node)).<br/>
   * Kubelet pada Node yang tidak responsif akan menanggapi, lalu mematikan Pod dan menghapusnya dari apiserver.<br/>
   * Penghapusan paksa Pod oleh pengguna.

Praktik terbaik yang direkomendasikan adalah menggunakan pendekatan pertama atau kedua. Jika sebuah Node telah terkonfirmasi mati (contohnya terputus dari jaringan secara permanen, dimatikan, dll), maka objek Node dihapus. Jika Node mengalami partisi jaringan, maka coba selesaikan masalah ini atau menunggu masalah itu terselesaikan. Saat partisi terselesaikan, kubelet akan menyelesaikan penghapusan Pod serta membebaskan namanya dari apiserver.

Normalnya, sistem akan menyelesaikan penghapusan saat Pod tidak lagi berjalan pada Node, atau Node telah dihapus oleh administrator. Kamu dapat mengabaikan hal ini dengan menghapus paksa Pod.

### Penghapusan Paksa

Penghapusan paksa **tidak** menunggu konfirmasi dari kubelet bahwa Pod telah diterminasi. Terlepas dari apakah penghapusan paksa sukses mematikan sebuah Pod, namanya akan segera dibebaskan dari apiserver. Hal ini berakibat _controller_ StatefulSet akan membuat Pod pengganti dengan identitas yang sama; ini dapat menimbulkan duplikasi terhadap Pod apabila ternyata Pod tersebut masih berjalan, dan jika Pod tersebut masih dapat berkomunikasi dengan anggota Statefulset lainnya, hal ini berakibat terjadi pelanggaran semantik _at most one_ dari StatefulSet yang telah dijamin.

Saat kamu menghapus paksa sebuah Pod StatefulSet, berarti kamu menjamin bahwa Pod tersebut tidak akan pernah lagi berkomunikasi dengan Pod lain pada StatefulSet dan namanya dapat dibebaskan secara aman untuk pembuatan penggantinya.

Jika kamu ingin menghapus paksa Pod dengan menggunakan kubectl versi >= 1.5, lakukan perintah berikut:

```shell
kubectl delete pods <pod> --grace-period=0 --force
```

Jika kamu menggunakan kubectl <= 1.4, kamu harus menghilangkan pilihan `--force` dan gunakan:

```shell
kubectl delete pods <pod> --grace-period=0
```

Jika setelah perintah ini dijalankan dan Pod tetap berada pada kondisi `Unknown`, gunakan perintah berikut untuk menghapus Pod dari klaster:

```shell
kubectl patch pod <pod> -p '{"metadata":{"finalizers":null}}'
```

Selalu jalankan penghapusan paksa Pod StatefulSet dengan hati-hati dan penuh pemahaman terhadap risiko yang dapat timbul.



## {{% heading "whatsnext" %}}


Pelajari lebih lanjut [_debugging_ StatefulSet](/docs/tasks/debug-application-cluster/debug-stateful-set/).


