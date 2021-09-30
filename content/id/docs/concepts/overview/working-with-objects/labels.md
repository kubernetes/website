---
title: Label dan Selektor
content_type: concept
weight: 40
---

<!-- overview -->

_Label_ merupakan pasangan _key/value_ yang melekat pada objek-objek, misalnya pada Pod.
Label digunakan untuk menentukan atribut identitas dari objek agar memiliki arti dan relevan bagi para pengguna, namun tidak secara langsung memiliki makna terhadap sistem inti.
Label dapat digunakan untuk mengatur dan memilih sebagian dari banyak objek. Label-label dapat ditempelkan ke objek-objek pada saat dibuatnya objek-objek tersebut dan kemudian ditambahkan atau diubah kapan saja setelahnya.
Setiap objek dapat memiliki satu set label _key/value_. Setiap _Key_ harus unik untuk objek tersebut.

```json
"metadata": {
  "labels": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

Label memungkinkan untuk menjalankan kueri dan pengamatan dengan efisien, serta ideal untuk digunakan pada UI dan CLI. Informasi yang tidak digunakan untuk identifikasi sebaiknya menggunakan [anotasi](/id/docs/concepts/overview/working-with-objects/annotations/).




<!-- body -->

## Motivasi

Label memungkinkan pengguna untuk memetakan struktur organisasi mereka ke dalam objek-objek sistem yang tidak terikat secara erat, tanpa harus mewajibkan klien untuk menyimpan pemetaan tersebut.

_Service deployments_ dan _batch processing pipelines_ sering menjadi entitas yang berdimensi ganda (contohnya partisi berganda atau _deployment_, jalur rilis berganda, tingkatan berganda, _micro-services_ berganda per tingkatan). Manajemen seringkali membutuhkan operasi lintas tim, yang menyebabkan putusnya enkapsulasi dari representasi hierarki yang ketat, khususnya pada hierarki-hierarki kaku yang justru ditentukan oleh infrastruktur, bukan oleh pengguna.

Contoh label:

   * `"release" : "stable"`, `"release" : "canary"`
   * `"environment" : "dev"`, `"environment" : "qa"`, `"environment" : "production"`
   * `"tier" : "frontend"`, `"tier" : "backend"`, `"tier" : "cache"`
   * `"partition" : "customerA"`, `"partition" : "customerB"`
   * `"track" : "daily"`, `"track" : "weekly"`

Ini hanya contoh label yang biasa digunakan; kamu bebas mengembangkan caramu sendiri. Perlu diingat bahwa _Key_ dari label harus unik untuk objek tersebut.

## Sintaksis dan set karakter

_Label_ merupakan pasangan _key/value_. _Key-key_ dari Label yang valid memiliki dua segmen: sebuah prefiks dan nama yang opsional, yang dipisahkan oleh garis miring (`/`). Segmen nama wajib diisi dan tidak boleh lebih dari 63, dimulai dan diakhiri dengan karakter alfanumerik (`[a-z0-9A-Z]`) dengan tanda pisah (`-`), garis bawah (`_`), titik (`.`), dan alfanumerik di antaranya. Sedangkan prefiks bersifat opsional. Jika ditentukan, prefiks harus berupa subdomain DNS: rangkaian label DNS yang dipisahkan oleh titik (`.`), dengan total tidak lebih dari 253 karakter, yang diikuti oleh garis miring (`/`).

Jika prefiks dihilangkan, _Key_ dari label diasumsikan privat bagi pengguna. Komponen sistem otomatis (contoh `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, atau otomasi pihak ketiga lainnya) yang akan menambah label ke objek-objek milik pengguna akhir harus menentukan prefiks.

Prefiks `kubernetes.io/` dan `k8s.io/` dikhususkan untuk komponen inti Kubernetes.

Nilai label yang valid tidak boleh lebih dari 63 karakter dan harus kosong atau diawali dan diakhiri dengan karakter alfanumerik (`[a-z0-9A-Z]`) dengan tanda pisah (`-`), garis bawah (`_`), titik (`.`), dan alfanumerik di antaranya.

Contoh di bawah ini merupakan berkas konfigurasi untuk Pod yang memiliki dua label `environment: production` dan `app: nginx` :

```yaml

apiVersion: v1
kind: Pod
metadata:
  name: label-demo
  labels:
    environment: production
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.7.9
    ports:
    - containerPort: 80

```

## Selektor label

Tidak seperti [nama dan UID](/id/docs/concepts/overview/working-with-objects/names/), label tidak memberikan keunikan. Secara umum, kami memperkirakan bahwa banyak objek yang akan memiliki label yang sama.

Menggunakan sebuah _label selector_, klien/pengguna dapat mengidentifikasi suatu kumpulan objek. Selektor label merupakan alat/cara pengelompokan utama pada Kubernetes.

Saat ini API mendukung dua jenis selektor: _equality-based_ dan _set-based_.
Sebuah selektor label dapat dibuat dari kondisi berganda yang dipisahkan oleh koma. Pada kasus kondisi berganda, semua kondisi harus dipenuhi sehingga separator koma dapat bertindak sebagai operator logika _AND_ (`&&`).

Makna dari selektor yang kosong atau tidak diisi tergantung dari konteks, dan tipe API yang menggunakan selektor harus mendokumentasikan keabsahan dan arti dari selektor yang kosong tersebut.

{{< note >}}
Untuk beberapa tipe API, seperti ReplicaSet, selektor label untuk dua objek tidak boleh tumpang tindih dengan Namespace, jika tidak maka _controller_ akan melihatnya sebagai instruksi yang menyebabkan konflik dan akan gagal menentukan berapa banyak replika yang seharusnya tersedia.
{{< /note >}}

{{< caution >}}
Untuk kedua kondisi _equality-based_ dan _set-based_ tidak ada logika operator _OR_ (`||`). Pastikan struktur pernyataan filter kamu ikut disesuaikan.
{{< /caution >}}

### Kondisi _Equality-based_

Kondisi _Equality-based_ atau _inequality-based_ memungkinkan untuk melakukan filter dengan menggunakan _key_ dan _value_ dari label. Objek yang cocok harus memenuhi semua batasan label yang telah ditentukan, meskipun mereka dapat memiliki label tambahan lainnya.
Terdapat tiga jenis operator yang didukung yaitu `=`,`==`,`!=`. Dua operator pertama menyatakan kesamaan (keduanya hanyalah sinonim), sementara operator terakhir menyatakan ketidaksamaan. Contoh:

```
environment = production
tier != frontend
```

Kondisi pertama akan memilih semua sumber daya dengan _key_ `environment` dan nilai _key_ `production`.
Kondisi berikutnya akan memilih semua sumber daya dengan _key_ `tier` dan nilai _key_ selain `frontend`, dan semua sumber daya yang tidak memiliki label dengan _key_ `tier`.
Kamu juga dapat memfilter sumber daya dalam `production` selain `frontend` dengan menggunakan operator koma: `environment=production,tier!=frontend`

Salah satu skenario penggunaan label dengan kondisi _equality-based_ yaitu untuk kriteria pemilihan Node untuk Pod-Pod. Sebagai contoh, Pod percontohan di bawah ini akan memilih Node dengan label "`accelerator=nvidia-tesla-p100`".

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-test
spec:
  containers:
    - name: cuda-test
      image: "k8s.gcr.io/cuda-vector-add:v0.1"
      resources:
        limits:
          nvidia.com/gpu: 1
  nodeSelector:
    accelerator: nvidia-tesla-p100
```

### Kondisi _Set-based_

Kondisi label _Set-based_ memungkinkan memfilter _key_ terhadap suatu kumpulan nilai. Terdapat tiga jenis operator yang didukung, yaitu: `in`,`notin`, dan `exists` (hanya  _key_-nya saja). Contoh:

```
environment in (production, qa)
tier notin (frontend, backend)
partition
!partition
```

Contoh pertama akan memilih semua sumber daya dengan _key_ `environment` dan nilai `production` atau `qa`.
Contoh kedua akan memilih semua sumber daya dengan _key_ `tier` dan nilai selain `frontend` dan `backend`, serta semua sumber daya yang tidak memiliki label dengan _key_ `tier`.
Contoh ketiga akan memilih semua sumber daya yang memiliki _key_ dari label`partition`; nilainya tidak diperiksa.
Sedangkan contoh keempat akan memilih semua sumber daya yang tidak memiliki label dengan _key_ `partition`; nilainya tidak diperiksa.
Secara serupa, operator koma bertindak sebagai operator _AND_. Sehingga penyaringan sumber daya dengan _key_ `partition` (tidak peduli nilai dari _key_) dan `environment` yang tidak sama dengan `qa` dapat dicapai dengan `partition,environment notin (qa)`.
Selektor label _set-based_ merupakan bentuk umum persamaan karena `environment=production` sama dengan `environment in (production)`; demikian pula `!=` dan `notin`.

Kondisi _Set-based_ dapat digabungkan dengan kondisi _equality-based_. Contoh: `partition in (customerA, customerB),environment!=qa`.


## API

### Penyaringan LIST dan WATCH

Operasi LIST dan WATCH dapat menentukan selektor label untuk memfilter suatu kumpulan objek yang didapat dengan menggunakan parameter kueri. Kedua jenis kondisi diperbolehkan (ditampilkan sebagai berikut, sama seperti saat tampil pada string kueri di URL):

  * Kondisi _equality-based_: `?labelSelector=environment%3Dproduction,tier%3Dfrontend`
  * Kondisi _set-based_: `?labelSelector=environment+in+%28production%2Cqa%29%2Ctier+in+%28frontend%29`

Kedua jenis selektor label dapat digunakan untuk menampilkan (_list_) dan mengamati (_watch_) sumber daya melalui klien REST. Contohnya, menargetkan `apiserver` dengan `kubectl` dan menggunakan _equality-based_ kamu dapat menuliskan:

```shell
kubectl get pods -l environment=production,tier=frontend
```

atau menggunakan kondisi _set-based_:

```shell
kubectl get pods -l 'environment in (production),tier in (frontend)'
```

Seperti yang telah disebutkan sebelumnya, kondisi _set-based_ lebih ekspresif.  Sebagai contoh, mereka dapat digunakan untuk mengimplementasi operator _OR_ pada nilai:

```shell
kubectl get pods -l 'environment in (production, qa)'
```

atau membatasi pencocokan negatif dengan operator _exists_:

```shell
kubectl get pods -l 'environment,environment notin (frontend)'
```

### Mengatur referensi pada objek API

Pada beberapa objek Kubernetes, seperti [`Service`](/docs/user-guide/services) dan [`ReplicationController`](/id/docs/concepts/workloads/controllers/replicationcontroller/), juga menggunakan selektor label untuk menentukan kumpulan dari sumber daya lain, seperti [Pod](/id/docs/concepts/workloads/pods/pod).

#### Service dan ReplicationController

Kumpulan Pod yang ditargetkan oleh sebuah `service` ditentukan dengan selektor label. Demikian pula kumpulan Pod yang harus ditangani oleh `replicationcontroller` juga ditentukan dengan selektor label.

Selektor label untuk kedua objek tersebut ditentukan dalam berkas `json` atau `yaml` menggunakan _maps_, dan hanya mendukung kondisi _equality-based_:

```json
"selector": {
    "component" : "redis",
}
```
atau

```yaml
selector:
    component: redis
```

selektor ini (baik dalam bentuk `json` atau `yaml`) sama dengan `component=redis` atau `component in (redis)`.

#### Sumber daya yang mendukung kondisi set-based

Sumber daya yang lebih baru, seperti [`Job`](/id/docs/concepts/workloads/controllers/jobs-run-to-completion/), [`Deployment`](/id/docs/concepts/workloads/controllers/deployment/), [`ReplicaSet`](/id/docs/concepts/workloads/controllers/replicaset/), dan [`DaemonSet`](/id/docs/concepts/workloads/controllers/daemonset/), juga mendukung kondisi _set-based_.

```yaml
selector:
  matchLabels:
    component: redis
  matchExpressions:
    - {key: tier, operator: In, values: [cache]}
    - {key: environment, operator: NotIn, values: [dev]}
```

`matchLabels` merupakan pemetaan dari pasangan `{key,value}`. Sebuah `{key,value}` pada pemetaan `matchLabels` adalah sama dengan elemen dari `matchExpressions`, yang nilai `key` nya adalah "key", dengan `operator` "In", dan _array_ `values` hanya berisi "value". `matchExpressions` merupakan daftar kondisi untuk selektor Pod. Operator yang valid termasuk In, NotIn, Exists, dan DoesNotExist. Kumpulan nilai ini tidak boleh kosong pada kasus In dan NotIn. Semua kondisi, baik dari  `matchLabels` dan `matchExpressions` di-AND secara sekaligus -- mereka harus memenuhi semua kondisi agar cocok.

#### Memilih kumpulan Node

Salah satu contoh penggunaan pemilihan dengan menggunakan label yaitu untuk membatasi suatu kumpulan Node tertentu yang dapat digunakan oleh Pod.
Lihat dokumentasi pada [pemilihan Node](/id/docs/concepts/scheduling-eviction/assign-pod-node/) untuk informasi lebih lanjut.


