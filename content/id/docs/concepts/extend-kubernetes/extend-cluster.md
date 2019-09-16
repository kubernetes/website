---
title: Memperluas Kubernetes Cluster Anda
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

Kubernetes sangat mudah dikonfigurasi dan dikembangkan. Sehingga,
jarang membutuhkan fork atau menambahkan patches ke kode projek Kubernetes.

Panduan ini menjelaskan pilihan untuk menyesuaikan Kubernetes cluster.
Ini ditujukan kepada {{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}} yang ingin
memahami bagaimana menyesuaikan kluster Kubernetes dengan kebutuhan lingkungan kerja mereka.
Pengembang yang prospektif {{< glossary_tooltip text="Platform Developers" term_id="platform-developer" >}} atau {{< glossary_tooltip text="Contributors" term_id="contributor" >}} Projek Kubernetes juga mendapatkan manfaat dari
dokumen ini sebagai pengantar apa saja poin dan pola yang ada, untung-rugi dan batasannya.

{{% /capture %}}


{{% capture body %}}

## Gambaran

Pendekatan kostumisasi secara luas dapat dibagi atas *konfigurasi*, yang hanya melibatkan perubahan bendera, konfigurasi file lokal, atau API sumber;
dan *ekstensi*, yang melibatkan berjalannya program atau layanan tambahan. Dokumen ini utamanya membahas tentang ekstensi.

## Konfigurasi

*File Konfigurasi* dan *bendera* terdokumentasi di bagian Referensi dokumentasi online, didalam setiap binary:

* [kubelet](/docs/admin/kubelet/)
* [kube-apiserver](/docs/admin/kube-apiserver/)
* [kube-controller-manager](/docs/admin/kube-controller-manager/)
* [kube-scheduler](/docs/admin/kube-scheduler/).

Bendera dan file konfigurasi mungkin tidak selalu dapat diubah di layanan Kubernetes yang dihosting atau di distribusi dengan instalasi terkelola.
Ketika mereka dapat diubah, mereka biasanya hanya dapat diubah oleh Admin Kluster. Dan juga, mereka dapat berubah dalam versi Kubernetes di masa depan,
dan mengatur mereka mungkin memerlukan proses restart. Oleh karena itu, mereka harus digunakan hanya ketika tidak ada pilihan lain.

*API kebijakan bawaan*, seperti [ResourceQuota](/docs/concepts/policy/resource-quotas/), [PodSecurityPolicies](/docs/concepts/policy/pod-security-policy/), [NetworkPolicy](/docs/concepts/services-networking/network-policies/) dan Role-based Access Control ([RBAC](/docs/reference/access-authn-authz/rbac/)), adalah API bawaan Kubernetes.
API biasanya digunakan oleh layanan Kubernetes yang dihosting dan diatur oleh instalasi Kubernetes. Mereka bersifat deklaratif dan menggunakan konvensi yang sama dengan sumber lain Kubernetes seperti
pods, jadi konfigurasi kluster baru dapat diulang-ulang dan dapat diatur dengan cara yang sama dengan aplikasi. 
Dan, ketika mereka stabil, mereka menyukai [kebijakan pendukung yang ditetapkan](/docs/reference/deprecation-policy/) seperti API Kubernetes lainnya. Oleh karena itu, mereka lebih disukai daripada
*konfigurasi file* dan *bendera* yang sesuai.

## Ekstensi

Ekstensi adalah komponen perangkat lunak yang luas dan terintegrasi secara dalam dengan Kubernetes.
Mereka mengadaptasi Kubernetes untuk mendukung perangkat keras tipe baru dan jenis baru.

Kebanyakan admin kluster akan menggunakan instansi Kubernetes yang terdistribusi atau yang dihosting.
Sehingga hasilnya adalah, kebanyakan pengguna Kubernetes akan membutuhkan instalasi ekstensi dan beberapa
akan butuh untuk membuat baru.

## Pola Ekstensi

Kubernetes didesain untuk dapat diotomasi dengan menuliskan program klien. Program apapun
yang membaca dan/atau menulis ke API Kubernetes dapat menyediakan otomasi yang berguna. 

*Otomasi* dapat berjalan di dalam kluster atau di luar kluster. Dengan mengikuti panduan
di dalam dokumen ini, Anda dapat menulis otomasi yang sangat tersedia dan kuat.
Otomasi pada umumnya dapat bekerja dengan berbagai macam kluster Kubernetes, termasuk
kluster yang terhosting dan instalasi yang diatur.

Ada pola spesifik tertentu untuk menulis program klien yang bekerja baik dengan Kubernetes
yang disebut pola *Controller*. *Controller* biasanya membaca objek milik `.spec`, kemungkinan
melakukan sesuatu, dan kemudian memperbarui objek milik `.status`.

*Controller* adalah klien dari Kubernetes. Ketika Kubernetes adalah klien dan memanggil layanan
jarak jauh, ini disebut *Webhook*. Layanan jarak jauhnya disebut *Webhook Backend*. Seperti *controller*, Webhooks
memang menambah poin kegagalan.

Di dalam model *Webhook*, Kubernetes membuat sebuah *network request* kepada sebuah layanan jarak jauh.

Di dalam model *Binary Plugin*, Kubernetes mengeksekusi file binari (program).
Plugin binari digunakan oleh kubelet (seperti [Flex Volume Plugins](https://github.com/kubernetes/community/blob/master/contributors/devel/flexvolume.md)
dan [Network Plugins](/docs/concepts/cluster-administration/network-plugins/)) dan oleh kubectl.

Berikut ini adalah diagram yang menunjukkan bagaimana titik ekstensi berinteraksi dengan bidang kontrol Kubernetes.

<img src="https://docs.google.com/drawings/d/e/2PACX-1vQBRWyXLVUlQPlp7BvxvV9S1mxyXSM6rAc_cbLANvKlu6kCCf-kGTporTMIeG5GZtUdxXz1xowN7RmL/pub?w=960&h=720">

<!-- image source drawing https://docs.google.com/drawings/d/1muJ7Oxuj_7Gtv7HV9-2zJbOnkQJnjxq-v1ym_kZfB-4/edit?ts=5a01e054 -->


## Titik-titik Ekstensi

Diagram berikut menunjukkan titik-titik ekstensi di sistem Kubernetes.

<img src="https://docs.google.com/drawings/d/e/2PACX-1vSH5ZWUO2jH9f34YHenhnCd14baEb4vT-pzfxeFC7NzdNqRDgdz4DDAVqArtH4onOGqh0bhwMX0zGBb/pub?w=425&h=809">

<!-- image source diagrams: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

1. Pengguna biasa berinteraksi dengan API Kubernetes menggunakan `kubectl`. [Kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/) memperluas binari kubectl. Mereka hanya memengaruhi lingkungan lokal pengguna, dan tidak dapat menegakkan kebijakan di seluruh situs.
2. API server menangani semua permintaan. Beberapa tipe titik ekstensi di API server memperbolehkan autentikasi permintaan, atau memblokir mereka berdasarkan konten, konten editing, dan penanganan penghapusan mereka. Hal ini dideskripsikan di bagian [API Access Extensions](/docs/concepts/overview/extending#api-access-extensions)
3. API server melayani berbagai macam *resources*, *Built-in resource kinds*, seperti `pods`, didefinisikan oleh projek Kubernetes dan tidak dapat diubah. Anda juga dapat menambahkan sumber yang Anda definisikan sendiri, atau yang projek lain definisikan, memanggil *Custom Resources*, seperti yang dijelaskan di bagian [Custom Resources](/docs/concepts/overview/extending#user-defined-types). Sumber khusus sering digunakan dengan Ekstensi API Aksi.
4. Penjadwal Kubernetes memutuskan node mana yang akan ditempatkan node. Ada beberapa cara untuk memperluas penjadwalan. Hal ini dibahas pada bagian [Scheduler Extensions](/docs/concepts/overview/extending#scheduler-extensions).
5. Sebagian besar perilaku Kubernetes diimplementasikan oleh program yang disebut *Controllers* yang merupakan klien dari API-Server. *Controllers* sering digunakan bersama dengan Sumber Daya Kustom.
6. Kubelet berjalan di server, dan membantu pod terlihat sepreti server virtual dengan IP mereka sendiri di jaringan kluster. [Network Plugins](/docs/concepts/overview/extending#network-plugins) memungkinkan perbedaan implementasi pada jaringan pod.
7. Kubelet juga melakukan pemasangan dan pelepasan volume untuk kontainer. Tipe penyimpanan baru dapat didukung via [Storage Plugins](/docs/concepts/overview/extending#storage-plugins).

Jika Anda tidak yakin untuk memulai darimana, flowchart dibawah ini dapat membantu Anda. Ingat bahwa beberapa solusi mungkin melibatkan beberapa tipe ekstensi.


<img src="https://docs.google.com/drawings/d/e/2PACX-1vRWXNNIVWFDqzDY0CsKZJY3AR8sDeFDXItdc5awYxVH8s0OLherMlEPVUpxPIB1CSUu7GPk7B2fEnzM/pub?w=1440&h=1080">

<!-- image source drawing: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

## Ekstensi API
### Tipe-tipe yang Ditentukan Pengguna

Pertimbangkan untuk menambahkan Sumber Daya Kustom ke Kubernetes jika Anda ingin mendefinisikan pengontrol baru, objek konfigurasi aplikasi atau API deklaratif lainnya, dan untuk mengelolanya menggunakan alat Kubernetes, seperti `kubectl`.

Jangan menggunakan Sumber Daya Kustom sebagai penyimpanan data untuk aplikasi, pengguna, atau untuk memonitor data.

Untuk lebih jelasnya tentan Sumber Daya Kustom, lihat [Custom Resources concept guide](/docs/concepts/api-extension/custom-resources/).

### Combining New APIs with Automation

The combination of a custom resource API and a control loop is called the [Operator pattern](/docs/concepts/extend-kubernetes/operator/). The Operator pattern is used to manage specific, usually stateful, applications. These custom APIs and control loops can also be used to control other resources, such as storage or policies.

### Changing Built-in Resources

When you extend the Kubernetes API by adding custom resources, the added resources always fall into a new API Groups. You cannot replace or change existing API groups.
Adding an API does not directly let you affect the behavior of existing APIs (e.g. Pods), but API Access Extensions do.


### API Access Extensions

When a request reaches the Kubernetes API Server, it is first Authenticated, then Authorized, then subject to various types of Admission Control. See [Controlling Access to the Kubernetes API](/docs/reference/access-authn-authz/controlling-access/) for more on this flow.

Each of these steps offers extension points.

Kubernetes has several built-in authentication methods that it supports. It can also sit behind an authenticating proxy, and it can send a token from an Authorization header to a remote service for verification (a webhook). All of these methods are covered in the [Authentication documentation](/docs/reference/access-authn-authz/authentication/).

### Authentication

[Authentication](/docs/reference/access-authn-authz/authentication/) maps headers or certificates in all requests to a username for the client making the request.

Kubernetes provides several built-in authentication methods, and an [Authentication webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) method if those don't meet your needs.


### Authorization

 [Authorization](/docs/reference/access-authn-authz/webhook/) determines whether specific users can read, write, and do other operations on API resources. It just works at the level of whole resources -- it doesn't discriminate based on arbitrary object fields. If the built-in authorization options don't meet your needs, and [Authorization webhook](/docs/reference/access-authn-authz/webhook/) allows calling out to user-provided code to make an authorization decision.


### Dynamic Admission Control

After a request is authorized, if it is a write operation, it also goes through [Admission Control](/docs/reference/access-authn-authz/admission-controllers/) steps. In addition to the built-in steps, there are several extensions:

*   The [Image Policy webhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook) restricts what images can be run in containers.
*   To make arbitrary admission control decisions, a general [Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks) can be used. Admission Webhooks can reject creations or updates.

## Infrastructure Extensions


### Storage Plugins

[Flex Volumes](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/flexvolume-deployment.md
) allow users to mount volume types without built-in support by having the
Kubelet call a Binary Plugin to mount the volume.


### Device Plugins

Device plugins allow a node to discover new Node resources (in addition to the
builtin ones like cpu and memory) via a [Device
Plugin](/docs/concepts/cluster-administration/device-plugins/).


### Network Plugins

Different networking fabrics can be supported via node-level [Network Plugins](/docs/admin/network-plugins/).

### Scheduler Extensions

The scheduler is a special type of controller that watches pods, and assigns
pods to nodes. The default scheduler can be replaced entirely, while
continuing to use other Kubernetes components, or [multiple
schedulers](/docs/tasks/administer-cluster/configure-multiple-schedulers/)
can run at the same time.

This is a significant undertaking, and almost all Kubernetes users find they
do not need to modify the scheduler.

The scheduler also supports a
[webhook](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md)
that permits a webhook backend (scheduler extension) to filter and prioritize
the nodes chosen for a pod.

{{% /capture %}}


{{% capture whatsnext %}}

* Learn more about [Custom Resources](/docs/concepts/api-extension/custom-resources/)
* Learn about [Dynamic admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Learn more about Infrastructure extensions
  * [Network Plugins](/docs/concepts/cluster-administration/network-plugins/)
  * [Device Plugins](/docs/concepts/cluster-administration/device-plugins/)
* Learn about [kubectl plugins](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Learn about the [Operator pattern](/docs/concepts/extend-kubernetes/operator/)

{{% /capture %}}
