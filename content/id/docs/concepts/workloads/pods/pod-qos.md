---
title: Kelas Kualitas Layanan Pod
content_type: concept
weight: 85
---

<!-- overview -->

Halaman ini memperkenalkan {{< glossary_tooltip text="Kelas QoS (Kelas Kualitas Layanan)" term_id="qos-class" >}} Pod di Kubernetes, dan menjelaskan bagaimana Kubernetes menetapkan kelas QoS untuk setiap Pod sebagai konsekuensi dari batasan sumber daya yang Anda tentukan untuk {{< glossary_tooltip text="Kontainer" term_id="container" >}} di Pod tersebut. Kubernetes mengandalkan klasifikasi ini untuk membuat keputusan tentang Pod mana yang akan diusir ketika tidak ada cukup sumber daya yang tersedia di *{{< glossary_tooltip text="Node" term_id="node" >}}*.

<!-- body -->

## Kelas kualitas layanan

Kubernetes mengklasifikasikan Pod yang Anda jalankan dan mengalokasikan setiap Pod ke dalam kelas QoS tertentu. Kubernetes menggunakan klasifikasi tersebut untuk memengaruhi cara penanganan Pod yang berbeda. Kubernetes melakukan klasifikasi ini berdasarkan [*resource requests*](/docs/concepts/configuration/manage-resources-containers/) dari Kontainer di Pod tersebut, beserta bagaimana permintaan tersebut terkait dengan batasan sumber daya. Ini dikenal sebagai kelas QoS. Kubernetes menetapkan sebuah kelas QoS pada setiap Pod berdasarkan permintaan sumber daya dan batasan Kontainer komponennya. Kelas QoS digunakan oleh Kubernetes untuk memutuskan Pod mana yang akan dikeluarkan dari *Node* yang mengalami [*Node Pressure*](/docs/concepts/scheduling-eviction/node-pressure-eviction/). Kelas QoS yang mungkin adalah *`Guaranteed`*, *`Burstable`*, dan *`BestEffort`*. Ketika *Node* kehabisan sumber daya, Kubernetes akan terlebih dahulu mengeluarkan Pod *`BestEffort`* yang berjalan pada *Node* tersebut, diikuti oleh Pod *`Burstable`* dan terakhir Pod *`Guaranteed`*. Ketika pengeluaran ini disebabkan oleh tekanan sumber daya, hanya Pod yang melebihi permintaan sumber daya yang menjadi kandidat untuk pengeluaran.

### *Guaranteed*

Pod yang *`Guaranteed`* memiliki batasan sumber daya yang paling ketat dan paling kecil kemungkinannya untuk menghadapi pengusiran dari *Node*. Pod tersebut dijamin tidak akan dimatikan hingga melampaui batasnya atau tidak ada Pod dengan prioritas lebih rendah yang dapat didahului dari *Node*. Pod tersebut tidak boleh memperoleh sumber daya di luar batas yang ditentukan. Pod ini juga dapat menggunakan CPU eksklusif menggunakan [kebijakan manajemen CPU statis](/docs/tasks/administer-cluster/cpu-management-policies/#static-policy).

#### Kriteria

Agar Pod diberi kelas QoS *`Guaranteed`*:

* Setiap Kontainer di Pod harus memiliki batas memori dan permintaan memori.
* Untuk setiap Kontainer di Pod, batas memori harus sama dengan permintaan memori.
* Setiap Kontainer di Pod harus memiliki batas CPU dan permintaan CPU.
* Untuk setiap Kontainer di Pod, batas CPU harus sama dengan permintaan CPU.

### *Burstable*

Pod yang *`Burstable`* memiliki beberapa jaminan batas bawah sumber daya berdasarkan permintaan, tetapi tidak memerlukan batasan tertentu. Jika batasan tidak ditentukan, maka batas tersebut akan ditetapkan secara *default* ke batas yang setara dengan kapasitas *Node*, yang memungkinkan Pod untuk secara fleksibel meningkatkan sumber dayanya jika sumber daya tersedia. Jika terjadi pengusiran Pod karena tekanan sumber daya *Node*, Pod ini akan diusir hanya setelah semua Pod *`BestEffort`* diusir. Karena Pod *`Burstable`* dapat menyertakan Kontainer yang tidak memiliki batasan atau permintaan sumber daya, Pod yang *`Burstable`* dapat mencoba menggunakan sumber daya *Node* dalam jumlah berapa pun.

#### Kriteria

Pod diberi kelas QoS *`Burstable`* jika:

* Pod tidak memenuhi kriteria untuk kelas QoS *`Guaranteed`*.
* Setidaknya satu Kontainer di Pod memiliki permintaan atau batasan memori atau CPU.

### *BestEffort*

Pod dalam kelas QoS *`BestEffort`* dapat menggunakan sumber daya *Node* yang tidak secara khusus ditetapkan ke Pod dalam kelas QoS lainnya. Misalnya, jika Anda memiliki *Node* dengan 16 inti CPU yang tersedia untuk kubelet, dan Anda menetapkan 4 inti CPU ke Pod `Guaranteed`, maka Pod dalam kelas QoS *`BestEffort`* dapat mencoba menggunakan sejumlah dari 12 inti CPU yang tersisa.

Kubelet lebih memilih mengusir Pod *`BestEffort`* jika *Node* mengalami tekanan sumber daya.

#### Kriteria

Pod memiliki kelas QoS *`BestEffort`* jika tidak memenuhi kriteria untuk *`Guaranteed`* atau *`Burstable`*. Dengan kata lain, sebuah Pod adalah *`BestEffort`* hanya jika tidak ada Kontainer dalam Pod yang memiliki batas memori atau permintaan memori, dan tidak ada Kontainer dalam Pod yang memiliki batas CPU atau permintaan CPU.
Kontainer dalam Pod dapat meminta sumber daya lain (bukan CPU atau memori) dan masih diklasifikasikan sebagai *`BestEffort`*.

## Memori QoS dengan cgroup v2

{{< feature-state feature_gate_name="MemoryQoS" >}}

Memori QoS menggunakan pengontrol memori cgroup v2 untuk menjamin sumber daya memori di Kubernetes. Permintaan memori dan batasan Kontainer di pod digunakan untuk menyetel antarmuka tertentu `memory.min` dan `memory.high` yang disediakan oleh pengontrol memori. Saat `memory.min` disetel ke permintaan memori, sumber daya memori dicadangkan dan tidak pernah diambil kembali oleh kernel; beginilah cara memori QoS memastikan ketersediaan memori untuk pod Kubernetes. Dan jika batasan memori disetel di Kontainer, ini berarti sistem perlu membatasi penggunaan memori Kontainer; memori QoS menggunakan `memory.high` untuk membatasi beban kerja yang mendekati batas memorinya, memastikan bahwa sistem tidak kewalahan oleh alokasi memori yang terjadi secara tiba-tiba.

Memori QoS bergantung pada kelas QoS untuk menentukan setelan mana yang akan diterapkan; namun, ini adalah mekanisme berbeda yang keduanya menyediakan kontrol atas kualitas layanan.

## Beberapa perilaku independen dari kelas QoS {#perilaku-independen-dari-kelas}

Perilaku tertentu independen dari kelas QoS yang ditetapkan oleh Kubernetes. Misalnya:

* Setiap Kontainer yang melampaui batas sumber daya akan dihentikan dan dimulai ulang oleh kubelet tanpa memengaruhi Kontainer lain dalam Pod tersebut.

* Jika Kontainer melampaui permintaan sumber dayanya dan *Node* yang dijalankannya menghadapi tekanan sumber daya, Pod yang menjadi tempatnya menjadi kandidat untuk [pengusiran](/docs/concepts/scheduling-eviction/node-pressure-eviction/). Jika ini terjadi, semua Kontainer dalam Pod akan dihentikan. Kubernetes dapat membuat Pod pengganti, biasanya pada *Node* yang berbeda.

* Permintaan sumber daya Pod sama dengan jumlah permintaan sumber daya dari Kontainer komponennya, dan batas sumber daya Pod sama dengan jumlah batas sumber daya dari Kontainer komponennya.

* kube-scheduler tidak mempertimbangkan kelas QoS saat memilih Pod mana yang akan [didahulukan](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption). Pendahuluan dapat terjadi saat kluster tidak memiliki cukup sumber daya untuk menjalankan semua Pod yang Anda tentukan.

## {{% heading "whatsnext" %}}

* Pelajari tentang [resource management for Pods and Containers](/docs/concepts/configuration/manage-resources-containers/).
* Pelajari tentang [Node-pressure eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/).
* Pelajari tentang [Pod priority and preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
* Pelajari tentang [disrupsi Pod](/id/docs/concepts/workloads/pods/disruptions/).
* Pelajari bagaimana untuk [menetapkan sumber daya memori untuk Kontainer dan Pod](/docs/tasks/configure-pod-container/assign-memory-resource/).
* Pelajari bagaimana untuk [assign CPU resources to containers and pods](/docs/tasks/configure-pod-container/assign-cpu-resource/).
* Pelajari bagaimana untuk [konfigurasi Quality of Service untuk Pods](/id/docs/tasks/configure-pod-container/quality-service-pod/).
