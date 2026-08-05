---
title: _Topology Aware Routing_ (Routing yang Mempertimbangkan Topologi)
content_type: concept
weight: 100
description: >-
  _Topology Aware Routing_ (Routing yang Mempertimbangkan Topologi) menyediakan mekanisme untuk membantu menjaga trafik jaringan tetap berada di dalam zona tempat asalnya. Memprioritaskan trafik antar Pod yang berada di zona yang sama dalam klaster kamu dapat membantu meningkatkan keandalan, performa (latensi dan _throughput_ jaringan), serta mengurangi biaya.
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< note >}}
Sebelum Kubernetes versi 1.27, fitur ini dikenal dengan nama _Topology Aware Hints_.
{{</ note >}}

_Topology Aware Routing_ mengatur perilaku _routing_ untuk memprioritaskan menjaga trafik tetap berada di zona asalnya. Dalam beberapa kasus, hal ini dapat membantu mengurangi biaya atau meningkatkan performa jaringan.

<!-- body -->

## Motivasi

Kluster Kubernetes semakin sering diterapkan di lingkungan multi-zona.
_Topology Aware Routing_ menyediakan mekanisme untuk membantu menjaga trafik tetap berada di zona asalnya. Saat menghitung _endpoint_ untuk sebuah {{< glossary_tooltip term_id="Service" >}}, kontroler EndpointSlice mempertimbangkan topologi (wilayah dan zona) dari setiap _endpoint_ dan mengisi _field_ _hints_ untuk mengalokasikannya ke suatu zona. Komponen klaster seperti {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} kemudian dapat menggunakan _hints_ tersebut dan memanfaatkannya untuk mempengaruhi cara trafik diarahkan (dengan memprioritaskan _endpoint_ yang secara topologis lebih dekat).

## Mengaktifkan _Topology Aware Routing_

{{< note >}}
Sebelum Kubernetes versi 1.27, perilaku ini dikendalikan menggunakan anotasi
`service.kubernetes.io/topology-aware-hints`.
{{</ note >}}

Kamu dapat mengaktifkan _Topology Aware Routing_ untuk sebuah Service dengan mengatur anotasi
`service.kubernetes.io/topology-mode` ke `Auto`. Ketika terdapat cukup banyak _endpoint_ yang tersedia di setiap zona, _Topology Hints_ akan diisi pada EndpointSlices untuk mengalokasikan _endpoint_ secara individual ke zona tertentu, sehingga trafik diarahkan lebih dekat ke tempat asalnya.

## Kapan Fitur ini Bekerja dengan Baik

Fitur ini bekerja paling baik ketika:

### 1. Trafik masuk didistribusikan secara merata

Jika sebagian besar trafik berasal dari satu zona saja, trafik tersebut dapat membebani sebagian _endpoint_ yang dialokasikan ke zona tersebut. Fitur ini tidak direkomendasikan jika trafik masuk diperkirakan berasal dari satu zona saja.

### 2. Service memiliki 3 atau lebih _endpoint_ per zona {#tiga-atau-lebih-endpoint-per-zona}

Dalam klaster dengan tiga zona, ini berarti 9 atau lebih _endpoint_. Jika ada kurang dari 3 _endpoint_ per zona, kemungkinan besar (≈50%) kontroler EndpointSlice tidak dapat mengalokasikan _endpoint_ secara merata dan akan kembali menggunakan pendekatan _routing_ bawaan yang berlaku di seluruh klaster.

## Cara Kerjanya

Heuristik "Auto" berusaha mengalokasikan sejumlah _endpoint_ secara proporsional ke setiap zona. Perlu dicatat bahwa heuristik ini bekerja paling baik untuk Service yang memiliki jumlah _endpoint_ yang signifikan.

### Kontroler EndpointSlice {#implementasi-control-plane}

Kontroler EndpointSlice bertanggung jawab untuk mengatur _hints_ pada EndpointSlices ketika heuristik ini diaktifkan. Kontroler mengalokasikan jumlah _endpoint_ secara proporsional ke setiap zona. Proporsi ini didasarkan pada
core CPU tersedia yang dialokasikan untuk Node yang berjalan di zona tersebut. Misalnya, jika satu zona memiliki 2 core CPU dan zona lain hanya memiliki 1 core CPU, kontroler akan mengalokasikan dua kali lebih banyak _endpoint_ ke zona dengan 2 core CPU.

Contoh berikut menunjukkan seperti apa EndpointSlice ketika _hints_ telah diisi:

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-hints
  labels:
    kubernetes.io/service-name: example-svc
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    zone: zone-a
    hints:
      forZones:
        - name: "zone-a"
```

### kube-proxy {#implementasi-kube-proxy}

Komponen kube-proxy memfilter _endpoint_ yang diarahkan berdasarkan _hints_ yang diatur oleh kontroler EndpointSlice. Dalam sebagian besar kasus, ini berarti kube-proxy mampu mengarahkan trafik ke _endpoint_ yang berada di zona yang sama. Namun terkadang kontroler mengalokasikan _endpoint_ dari zona berbeda untuk memastikan distribusi _endpoint_ yang lebih merata antar zona. Hal ini akan menyebabkan sebagian trafik diarahkan ke zona lain.

## Pengamanan (_Safeguard_)

_Control plane_ Kubernetes dan kube-proxy pada setiap Node menerapkan aturan pengamanan sebelum menggunakan _Topology Aware Hints_. Jika aturan ini tidak terpenuhi, kube-proxy akan memilih endpoint dari mana saja dalam klaster kamu, tanpa memperhatikan zona.

1. **Jumlah _endpoint_ tidak mencukupi:** Jika jumlah _endpoint_ lebih sedikit daripada jumlah zona dalam klaster, kontroler tidak akan memberikan _hints_ apa pun.

2. **Tidak mungkin mencapai alokasi yang seimbang:** Dalam beberapa kasus, tidak mungkin mencapai alokasi _endpoint_ yang seimbang antar zona. Misalnya, jika zona-a dua kali lebih besar dari zona-b, tetapi hanya ada 2 _endpoint_, _endpoint_ yang dialokasikan ke zona-a mungkin menerima dua kali lebih banyak trafik dibanding zona-b. Kontroler tidak memberikan _hints_ jika nilai "kelebihan beban kerja (_expected overload_)" ini tidak bisa ditekan di bawah ambang batas yang dapat diterima untuk setiap zona. Penting untuk dicatat bahwa ini bukan berdasarkan umpan balik waktu nyata. Masih mungkin bagi _endpoint_ individu untuk mengalami kelebihan beban kerja.

3. **Satu atau lebih Node kekurangan informasi:** Jika ada Node yang tidak memiliki label `topology.kubernetes.io/zone` atau tidak melaporkan nilai CPU yang dapat dialokasikan, _control plane_ tidak akan mengatur _hints_ _endpoint_ yang mempertimbangkan topologi, sehingga kube-proxy tidak memfilter _endpoint_ berdasarkan zona.

4. **Satu atau lebih endpoint tidak memiliki hint zona:** Jika ini terjadi, kube-proxy menganggap sedang terjadi transisi dari atau ke _Topology Aware Hints_. Memfilter endpoint untuk Service dalam kondisi ini berisiko, sehingga kube-proxy kembali menggunakan semua _endpoint_.

5. **Sebuah zona tidak terwakili dalam hints:** Jika kube-proxy tidak dapat menemukan setidaknya satu _endpoint_ dengan _hint_ yang menargetkan zona tempatnya berjalan, kube-proxy akan kembali menggunakan _endpoint_ dari semua zona. Ini biasanya terjadi saat kamu menambahkan zona baru ke klaster yang sudah ada.

## Batasan (_Constraint_)

* _Topology Aware Hints_ tidak digunakan ketika `internalTrafficPolicy` diatur ke `Local` pada sebuah Service. Kamu bisa menggunakan kedua fitur ini dalam satu klaster pada Service yang berbeda, tetapi tidak pada Service yang sama.

* Pendekatan ini tidak akan bekerja dengan baik untuk Service yang memiliki sebagian besar trafik berasal dari sebagian zona tertentu. Pendekatan ini mengasumsikan bahwa trafik masuk akan kira-kira proporsional dengan kapasitas Node di setiap zona.

* Kontroler EndpointSlice mengabaikan Node yang belum siap (_NotReady_) saat menghitung proporsi tiap zona. Ini bisa menimbulkan konsekuensi yang tidak diinginkan jika sebagian besar Node dalam keadaan belum siap.

* Kontroler EndpointSlice mengabaikan Node yang memiliki label `node-role.kubernetes.io/control-plane` atau `node-role.kubernetes.io/master`. Ini bisa menjadi masalah jika beban kerja juga berjalan di Node-Node tersebut.

* Kontroler EndpointSlice tidak mempertimbangkan {{< glossary_tooltip text="tolerations" term_id="toleration" >}} saat men-_deploy_ atau menghitung proporsi tiap zona. Jika Pod yang mendukung sebuah Service terbatas pada sebagian Node dalam klaster, hal ini tidak akan diperhitungkan.

* Fitur ini mungkin tidak bekerja dengan baik bersama _autoscaling_. Misalnya, jika sebagian besar trafik berasal dari satu zona, hanya _endpoint_ yang dialokasikan ke zona tersebut yang akan menangani trafik itu. Hal ini dapat menyebabkan {{< glossary_tooltip text="Horizontal Pod Autoscaler" term_id="horizontal-pod-autoscaler" >}} tidak mendeteksi kejadian ini, atau Pod baru yang ditambahkan justru mulai di zona berbeda.

## Heuristik Kustom

Kubernetes diterapkan dalam berbagai cara yang berbeda, sehingga tidak ada satu heuristik tunggal untuk mengalokasikan 
_endpoint_ ke zona yang akan cocok untuk setiap kasus penggunaan. Salah satu tujuan utama fitur ini adalah 
memungkinkan pengembangan heuristik kustom jika heuristik bawaan tidak sesuai dengan kebutuhan kasus penggunaan kamu. 
Langkah awal untuk mengaktifkan heuristik kustom telah disertakan dalam rilis 1.27. Ini adalah implementasi terbatas 
yang mungkin belum mencakup beberapa situasi relevan dan masuk akal.

### {{% heading "whatsnext" %}}

* Ikuti tutorial [Menghubungkan Aplikasi dengan Service](/docs/tutorials/services/connect-applications-service/)
* Pelajari tentang _field_ [`trafficDistribution`](/docs/concepts/services-networking/service/#traffic-distribution)
  yang sangat terkait dengan anotasi `service.kubernetes.io/topology-mode` dan menyediakan opsi fleksibel untuk 
  _routing_ trafik dalam Kubernetes.
