---
title: Menggunakan Otorisasi RBAC
content_type: concept
aliases: [/id/rbac/]
weight: 70
---

<!-- overview -->
_Role-based access control_ (RBAC) atau kontrol akses berbasis rol adalah metode pengaturan akses ke sumber daya komputer 
atau jaringan berdasarkan rol pengguna individu dalam organisasimu.


<!-- body -->
Otorisasi RBAC menggunakan {{< glossary_tooltip text="grup API" term_id="api-group" >}} `rbac.authorization.k8s.io` untuk mengendalikan keputusan
otorisasi. Hal ini memungkinkanmu untuk mengonfigurasi kebijakan secara dinamis melalui
API Kubernetes.

Untuk mengaktifkan RBAC, jalankan {{< glossary_tooltip text="server API" term_id="kube-apiserver" >}} dengan _flag_ `--authorization-mode` diatur 
dengan daftar yang dipisahkan koma yang menyertakan `RBAC`;
sebagai contoh:
```shell
kube-apiserver --authorization-mode=Example,RBAC --other-options --more-options
```

## Objek API {#api-overview}

API RBAC mendeklarasikan empat jenis objek Kubernetes: Role, ClusterRole,
RoleBinding dan ClusterRoleBinding. kamu bisa [mendeskripsikan beberapa objek](/id/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects), atau mengubahnya menggunakan alat seperti `kubectl`, seperti objek Kubernetes lain.

{{< caution >}}
Objek-objek ini, dengan disengaja, memaksakan pembatasan akses. Jika kamu melakukan perubahan
ke klaster saat kamu belajar, lihat
[pencegahan eskalasi privilese dan _bootstrapping_](#pencegahan-eskalasi-privilese-dan-bootstrapping)
untuk memahami bagaimana pembatasan tersebut dapat mencegah kamu melakukan beberapa perubahan.
{{< /caution >}}

### Role dan ClusterRole

Sebuah Role RBAC atau ClusterRole memuat aturan yang mewakili sekumpulan izin.
Izin bersifat aditif (tidak ada aturan "tolak").

Sebuah Role selalu mengatur izin dalam {{< glossary_tooltip text="Namespace" term_id="namespace" >}} tertentu;
ketika kamu membuat Role, kamu harus menentukan Namespace tempat Role tersebut berada.

ClusterRole, sebaliknya, adalah sumber daya tanpa Namespace. Sumber daya tersebut memiliki nama yang berbeda (Role
dan ClusterRole) karena objek Kubernetes selalu harus menggunakan Namespace atau tanpa Namespace;
tidak mungkin keduanya.

ClusterRole memiliki beberapa kegunaan. Kamu bisa menggunakan ClusterRole untuk:

1. mendefinisikan izin pada sumber daya dalam Namespace dan diberikan dalam sebuah Namespace atau lebih
2. mendefinisikan izin pada sumber daya dalam Namespace dan diberikan dalam seluruh Namespace
3. mendefinisikan izin pada sumber daya dalam lingkup klaster

Jika kamu ingin mendefinisikan sebuah rol dalam Namespace, gunakan Role; jika kamu ingin mendefinisikan
rol di level klaster, gunakan ClusterRole.
 
#### Contoh Role 

Berikut adalah contoh Role dalam Namespace bawaan yang dapat digunakan 
untuk memberikan akses baca pada {{< glossary_tooltip text="Pod" term_id="pod" >}}:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" mengindikasikan grup API inti
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

#### Contoh ClusterRole

ClusterRole dapat digunakan untuk memberikan izin yang sama dengan Role.
Karena ClusterRole memiliki lingkup klaster, kamu juga dapat menggunakannya untuk memberikan akses ke:

* sumber daya lingkup klaster (seperti {{< glossary_tooltip text="Node" term_id="node" >}})
* berbagai _endpoint_ non-sumber daya (seperti `/healthz`)
* sumber daya Namespace (seperti Pod), di semua Namespace
 Sebagai contoh: kamu bisa menggunakan ClusterRole untuk memungkinkan pengguna tertentu untuk menjalankan 
`kubectl get pods --all-namespaces`.

Berikut adalah contoh ClusterRole yang dapat digunakan untuk memberikan akses baca pada
{{< glossary_tooltip text="Secret" term_id="secret" >}} di Namespace tertentu, atau di semua Namespace (tergantung bagaimana [keterikatannya](#rolebinding-dan-clusterrolebinding)):

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" dihilangkan karena ClusterRole tidak menggunakan Namespace
  name: secret-reader
rules:
- apiGroups: [""]
  #
  # di tingkat HTTP, nama sumber daya untuk mengakses objek Secret
  # adalah "secrets"
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

Nama objek Role dan ClusterRole harus menggunakan [nama _path segment_](/id/docs/concepts/overview/working-with-objects/names#path-segment-names) yang valid.

### RoleBinding dan ClusterRoleBinding

Sebuah RoleBinding memberikan izin yang ditentukan dalam sebuah Role kepada pengguna atau sekelompok pengguna.
Ini menyimpan daftar subjek (pengguna, grup, atau ServiceAccount), dan referensi ke
Role yang diberikan.
RoleBinding memberikan izin dalam Namespace tertentu sedangkan ClusterRoleBinding
memberikan akses tersebut pada lingkup klaster.

RoleBinding dapat merujuk Role apa pun di Namespace yang sama. Atau, RoleBinding
dapat mereferensikan ClusterRole dan memasangkan ClusterRole tersebut ke Namespace dari RoleBinding.
Jika kamu ingin memasangkan ClusterRole ke semua Namespace di dalam klastermu, kamu dapat menggunakan 
ClusterRoleBinding.

Nama objek RoleBinding atau ClusterRoleBinding harus valid menggunakan
[nama _path segment_](/id/docs/concepts/overview/working-with-objects/names#path-segment-names) yang valid.

#### Contoh RoleBinding

Berikut adalah contoh dari RoleBinding yang memberikan Role "pod-reader" kepada pengguna "jane"
pada Namespace "default".
Ini memungkinkan "jane" untuk membaca Pod di Namespace "default".

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# RoleBinding memungkinkan "jane" untuk membaca Pod di Namespace "default"
# Kamu harus sudah memiliki Role bernama "pod-reader" di Namespace tersebut.
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
# Kamu bisa mencantumkan lebih dari satu "subjek"
- kind: User
  name: jane # "name" peka huruf besar-kecil
  apiGroup: rbac.authorization.k8s.io
roleRef:
  # "roleRef" menentukan pengikatan (binding) ke Role / ClusterRole
  kind: Role # ini harus Role atau ClusterRole
  name: pod-reader # ini harus sesuai dengan nama Role atau ClusterRole yang ingin kamu gunakan
  apiGroup: rbac.authorization.k8s.io
```

RoleBinding juga bisa mereferensikan ClusterRole untuk memberikan izin yang didefinisikan di dalam
ClusterRole ke sumber daya di dalam Namespace RoleBinding. Referensi semacam ini
memungkinkan kamu menentukan sekumpulan Role yang umum di seluruh klastermu, lalu menggunakannya kembali di dalam
beberapa Namespace.

Sebagai contoh, meskipun RoleBinding berikut merujuk ke ClusterRole,
"dave" (subjek, peka kapital) hanya akan dapat membaca Secret di dalam Namespace "development", 
karena Namespace RoleBinding (di dalam metadatanya) adalah "development".

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# RoleBinding memungkinkan "dave" untuk membaca Secret di Namespace "development".
# Kamu sudah harus memiliki ClusterRole bernama "secret-reader".
kind: RoleBinding
metadata:
  name: read-secrets
  #
  # Namespace dari RoleBinding menentukan di mana izin akan diberikan.  
  # Ini hanya memberikan izin di dalam Namespace "development".
  namespace: development
subjects:
- kind: User
  name: dave # Nama peka huruf besar-kecil
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

#### Contoh ClusterRoleBinding

Untuk memberikan izin di seluruh klaster, kamu dapat menggunakan ClusterRoleBinding.
ClusterRoleBinding berikut memungkinkan seluruh pengguna di dalam kelompok "manager" untuk
membaca Secret di berbagai Namespace.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# ClusterRoleBinding ini memungkinkan siapapun di dalam kelompok "manager" untuk membaca Secret di berbagai Namespace.
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # Nama peka kapital
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```
Setelah kamu membuat ClusterRoleBinding, kamu tidak dapat mengganti Role atau ClusterRole yang dirujuk.
Jika kamu mencoba mengganti `roleRef` dari sebuah ClusterRoleBinding, kamu akan mendapatkan galat validasi. Jika kamu
tidak ingin mengganti `roleRef` untuk sebuah ClusterRoleBinding, kamu harus menghapus objek ClusterRoleBinding tersebut dan membuat
sebuah pengganti.

Ada dua alasan untuk pembatasan tersebut:

1. Membuat `roleRef` menjadi tidak dapat diubah (_immutable_) memungkinkan pemberian izin `update` kepada seseorang pada objek ClusterRoleBinding yang ada, 
sehingga mereka dapat mengelola daftar subjek, tanpa bisa berubah
Role yang diberikan kepada subjek tersebut.

2. ClusterRoleBinding dengan Role yang berbeda adalah ClusterRoleBinding yang berbeda secara fundamental.
Mengharuskan sebuah ClusterRoleBinding untuk dihapus/diciptakan kembali untuk mengubah `roleRef` akan
memastikan daftar lengkap subjek dalam ClusterRoleBinding akan diberikan
Role baru (sebagai langkah untuk mencegah modifikasi secara tidak sengaja hanya pada `roleRef`
tanpa memastikan semua subjek yang seharusnya diberikan izin pada Role baru).

Utilitas baris perintah `kubectl auth reconcile` membuat atau memperbarui berkas manifes yang mengandung objek RBAC,
dan menangani penghapusan dan pembuatan objek ikatan jika dibutuhkan untuk mengganti Role yang dirujuk.
Lihat [penggunaan perintah dan contoh](#kubectl-auth-reconcile) untuk informasi tambahan.

### Mengacu pada sumber daya

Pada API Kubernetes, sebagian besar sumber daya diwakili dan diakses menggunakan representasi 
nama objek, seperti `pods` untuk Pod. RBAC mengacu pada sumber daya yang menggunakan nama yang persis sama
dengan yang muncul di URL untuk berbagai _endpoint_ API yang relevan.
Beberapa Kubernetes APIs melibatkan 
_subresource_, seperti log untuk Pod. Permintaan untuk log Pod terlihat seperti:

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

Dalam hal ini, `pods` adalah sumber daya Namespace untuk sumber daya Pod, dan `log` adalah sebuah
sub-sumber daya `pods`. Untuk mewakili ini dalam sebuah Role RBAC, gunakan garis miring (`/`) untuk
membatasi sumber daya dan sub-sumber daya. Untuk memungkinkan subjek membaca `pods` dan
juga mengakses sub-sumber daya `log` untuk masing-masing Pod tersebut, kamu dapat menulis:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

Kamu juga dapat merujuk ke sumber daya dengan nama untuk permintaan tertentu melalui daftar `resourceNames`.
Ketika nama dicantumkan, permintaan dapat dibatasi untuk setiap objek sumber daya.
Berikut adalah contoh yang membatasi subjeknya hanya untuk melakukan `get` atau `update` pada sebuah
{{< glossary_tooltip term_id="ConfigMap" >}} bernama `my-configmap`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  #
  # pada level HTTP, nama sumber daya untuk mengakses objek ConfigMap
  # adalah "configmaps"
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

{{< note >}}
Kamu tidak dapat membatasi permintaan `create` atau `deletecollection` dengan nama sumber daya. Untuk `create`, 
keterbatasan ini dikarenakan nama objek tidak diketahui pada waktu otorisasi.
{{< /note >}}

### ClusterRole gabungan

Kamu dapat mengumpulkan beberapa ClusterRole menjadi satu ClusterRole gabungan.
Pengontrol, yang berjalan sebagai bagian dari _control plane_ klaster, mengamati objek ClusterRole
dengan `aggregationRule`. `AggregationRule` mendefinisikan
{{< glossary_tooltip text="Selector" term_id="selector" >}} label yang digunakan oleh pengontrol untuk mencocokkan objek ClusterRole lain 
yang harus digabungkan ke dalam `rules`.

Berikut adalah contoh ClusterRole gabungan:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # Control plane secara otomatis mengisi rules
```

Jika kamu membuat ClusterRole baru yang cocok dengan label Selector dari ClusterRole gabungan yang ada,
maka perubahan itu akan memicu penambahan aturan baru ke dalam ClusterRole gabungan.
Berikut adalah contoh yang menambahkan aturan ke ClusterRole "monitoring", dengan membuat sebuah
ClusterRole lain berlabel `rbac.example.com/aggregate-to-monitoring: true`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpoints
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# ketika kamu membuat ClusterRole "monitoring-endpoints",
# aturan di bawah ini akan ditambahkan ke ClusterRole "monitoring".
rules:
- apiGroups: [""]
  resources: ["services", "endpoints", "pods"]
  verbs: ["get", "list", "watch"]
```

[Role bawaan pengguna](#role-dan-rolebinding-bawaan) menggunakan agregasi ClusterRole. Ini memungkinkan kamu,
sebagai administrator klaster, menambahkan aturan untuk sumber daya ubah suai, seperti yang dilayani oleh {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinitions" >}}
atau server API gabungan, untuk memperluas Role bawaan.

Sebagai contoh: ClusterRole berikut mengizinkan Role bawaan "admin" dan "edit" mengelola sumber daya ubah suai
bernama CronTab, sedangkan Role "view" hanya dapat membaca sumber daya CronTab.
Kamu dapat mengasumsikan bahwa objek CronTab dinamai `"crontab"` dalam URL yang terlihat oleh server API.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # Tambahkan izin berikut ke Role bawaan "admin" and "edit".
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    # Tambahkan izin berikut ke Role bawaan "view"    
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

#### Contoh Role

Contoh berikut adalah potongan dari objek Role atau ClusterRole yang hanya menampilkan
bagian `rules`.

Mengizinkan pembacaan sumber daya `"pods"` pada {{< glossary_tooltip text="grup API" term_id="api-group" >}} inti:

```yaml
rules:
- apiGroups: [""]
  #
  # pada tingkat HTTP, nama dari sumber daya untuk mengakses objek Pod
  # adalah "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

Mengizinkan pembacaan/penulisan Deployment (pada tingkat HTTP: objek dengan `"deployments"` 
di bagian sumber daya dari URL) pada masing-masing grup API `"extensions"` dan `"apps"`:

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  #
  # pada tingkat HTTP, nama dari sumber daya untuk mengakses objek Deployment
  # adalah "deployments"
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Mengizinkan pembacaan pada Pods pada grup API inti, dan juga serta pembacaan atau penulisan Job
di grup API `"batch"` atau `"extensions"`:

```yaml
rules:
- apiGroups: [""]
  #
  # pada tingkat HTTP, nama dari sumber daya untuk mengakses objek Pod
  # adalah "pods"
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch", "extensions"]
  #
  # pada tingkat HTTP, nama dari sumber daya untuk mengakses objek Job
  # adalah "jobs"
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Mengizinkan pembacaan ConfigMap bernama "my-config" (harus terikat dengan suatu
RoleBinding untuk membatasi ke satu ConfigMap di satu Namespace):

```yaml
rules:
- apiGroups: [""]
  #
  # pada tingkat HTTP, nama dari sumber daya untuk mengakses objek ConfigMap
  # adalah "configmaps"  
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

Mengizinkan pembacaan sumber daya `"nodes"` pada grup API inti (karena sebuah node
ada pada lingkup-klaster, ini harus berupa ClusterRole yang terikat dengan ClusterRoleBinding
agar efektif):

```yaml
rules:
- apiGroups: [""]
  #
  # pada tingkat HTTP, nama dari sumber daya untuk mengakses objek Node
  # adalah "nodes"
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

Mengizinkan permintaan GET dan POST kepada _endpoint_ non-sumber daya `/healthz` dan seluruh _subpath_
(harus berada di dalam ClusterRole yang terikat dengan ClusterRoleBinding agar efektif):

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' in a nonResourceURL is a suffix glob match
  verbs: ["get", "post"]
```

### Mengacu pada subjek

RoleBinding atau ClusterRoleBinding mengikat sebuah Role ke subjek.
Subjek dapat berupa kelompok, pengguna atau {{< glossary_tooltip text="ServiceAccounts" term_id="service-account" >}}.

Kubernetes merepresentasikan _username_ sebagai _string_.
Ini bisa berupa: nama sederhana, seperti "alice"; email, seperti "bob@example.com";
atau ID pengguna numerik yang direpresentasikan sebagai _string_. Terserah kamu sebagai administrator klaster
untuk mengonfigurasi [modul otentikasi](/docs/reference/access-authn-authz/authentication/)
sehingga otentikasi menghasilkan _username_ dalam format yang kamu inginkan.

{{< caution >}}
Awalan `system:` direservasi untuk sistem Kubernetes, jadi kamu harus memastikan
bahwa kamu tidak memiliki pengguna atau grup dengan nama yang dimulai dengan `system:` secara tidak sengaja.
Selain prefiks khusus ini, sistem otorisasi RBAC tidak memerlukan format apa pun
untuk nama pengguna.
{{< /caution >}}

Di Kubernetes, modul otentikasi menyediakan informasi grup.
Grup, seperti halnya pengguna, direpresentasikan sebagai string, dan string tersebut tidak memiliki format tertentu,
selain prefiks `system:` yang sudah direservasi.

[ServiceAccount](/id/docs/tasks/configure-pod-container/configure-service-account/) memiliki nama yang diawali dengan `system:serviceaccount:`, dan menjadi milik grup yang diawali dengan nama `system:serviceaccounts:`.

{{< note >}}
- `system:serviceaccount:` (tunggal) adalah prefiks untuk _username_ ServiceAccount.
- `system:serviceaccounts:` (jamak) adalah prefiks untuk grup ServiceAccount.
{{< /note >}}

#### Contoh RoleBinding {#role-binding-examples}

Contoh-contoh berikut ini hanya potongan RoleBinding yang hanya memperlihatkan
bagian `subjects`.

Untuk pengguna bernama `alice@example.com`:

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

Untuk grup bernama `frontend-admins`:

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

Untuk ServiceAccount bawaan di Namespace "kube-system":

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

Untuk seluruh ServiceAccount di Namespace qa:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

Untuk seluruh ServiceAccount di Namespace apapun:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

Untuk seluruh pengguna yang terotentikasi:

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

Untuk seluruh pengguna yang tidak terotentikasi:

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

Untuk seluruh pengguna:

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

## Role dan RoleBinding bawaan

API membuat satu set objek ClusterRole dan ClusterRoleBinding bawaan. 
Sebagian besar dari objek dengan prefiks `system:` menunjukkan bahwa sumber daya tersebut
secara langsung dikelola oleh _control plane_ klaster. Seluruh ClusterRole dan ClusterRoleBinding dilabeli dengan
`kubernetes.io/bootstrapping=rbac-defaults`.

{{< caution >}}
Berhati-hatilah saat memodifikasi CLusterRole dan ClusterRoleBinding dengan nama yang
memiliki prefiks `system:`.
Modifikasi sumber daya ini dapat mengakibatkan malfungsi klaster.
{{< /caution >}}

### Rekonsiliasi otomatis

Pada setiap penyalaan (_start-up_), server API memperbarui ClusterRole bawaan dengan berbagai izin yang hilang, 
dan memperbarui ClusterRoleBinding bawaan dengan subjek yang hilang.
Ini memungkinkan klaster untuk memperbaiki modifikasi yang tidak disengaja, dan membantu menjaga Role 
dan RoleBinding selalu terkini karena izin dan subjek berubah pada rilis terbaru Kubernetes.

Untuk menonaktifkan rekonsiliasi ini, atur anotasi `rbac.authorization.kubernetes.io/autoupdate`
pada ClusterRole bawaan atau RoleBinding bawaan menjadi `false`.
Ingat bahwa hilangnya izin dan subjek bawaan dapat mengakibatkan malfungsi klaster.

Rekonsiliasi otomatis diaktifkan secara bawaan jika pemberi otorisasi RBAC aktif.

### Role diskoveri API {#discovery-roles}

RoleBinding bawaan memberi otorisasi kepada pengguna yang tidak terotentikasi untuk membaca informasi API yang dianggap aman
untuk diakses publik (termasuk CustomResourceDefinitions). Untuk menonaktifkan akses anonim, tambahkan `--anonymous-auth=false` ke konfigurasi server API.

Untuk melihat konfigurasi Role ini melalui `kubectl` jalankan perintah:

```shell
kubectl get clusterroles system:discovery -o yaml
```

{{< note >}}
Jika kamu mengubah ClusterRole tersebut, maka perubahanmu akan ditimpa pada penyalaan ulang server API melalui 
[rekonsiliasi-otomatis](#auto-reconciliation). Untuk menghindari penulisan ulang tersebut, hindari mengubah Role secara manual, 
atau nonaktifkan rekonsiliasi otomatis
{{< /note >}}

<table>
<caption>Role diskoveri API Kubernetes RBAC</caption>
<colgroup><col width="25%" /><col width="25%" /><col /></colgroup>
<tr>
<th>ClusterRole Bawaan</th>
<th>ClusterRoleBinding Bawaan</th>
<th>Deskripsi</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td>Grup <b>system:authenticated</b></td>
<td>Mengizinkan pengguna hanya dengan akses baca untuk mengakses informasi dasar tentang diri mereka sendiri. Sebelum v1.14, Role ini juga terikat pada <tt>system:unauthenticated</tt> secara bawaan.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td>Grup <b>system:authenticated</b></td>
<td>Mengizinkan akses baca pada berbagai <i>endpoint</i> diskoveri API yang dibutuhkan untuk menemukan dan melakukan negosiasi pada tingkat API. Sebelum v1.14, Role ini juga terikat pada <tt>system:unauthenticated</tt> secara bawaan.</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td>Grup <b>system:authenticated</b> dan <b>system:unauthenticated</b></td>
<td>Mengizinkan akses baca pada informasi yang tidak sensitif tentang klaster. Diperkenalkan pada Kubernetes v1.14.</td>
</tr>
</table>

### Role pengguna

Beberapa ClusterRole bawaan tidak diawali dengan `system:`. Ini dimaksudkan untuk Role pengguna.
Ini termasuk Role _super-user_ (`cluster-admin`), Role yang dimaksudkan untuk diberikan akses seluruh klaster dengan
menggunakan ClusterRoleBinding, dan Role yang dimaksudkan untuk diberikan pada Namespace tertentu 
dengan menggunakan RoleBinding (`admin`, `edit`, `view`).

ClusterRole menggunakan [ClusterRole gabungan](#clusterrole-gabungan) untuk mengizinkan administrator untuk memasukan peraturan untuk sumber daya khusus pada ClusterRole ini. Untuk menambahkan aturan kepada Role `admin`, `edit`, atau `view`, buatlah sebuah CLusterRole
dengan satu atau lebih label berikut:

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>ClusterRole Bawaan</th>
<th>ClusterRoleBinding Bawaan</th>
<th>Deskripsi</th>
</tr>
<tr>
<td><b>cluster-admin</b></td>
<td>Grup <b>system:masters</b></td>
<td>Mengizinkan akses <i>super-user</i> untuk melakukan berbagai aksi pada berbagai sumber daya. 
Ketika digunakan pada <b>ClusterRoleBinding</b>, Role ini akan memberikan kendali penuh terhadap semua sumber daya pada klaster dan seluruh Namespace. 
Ketika digunakan pada <b>RoleBinding</b>, Role ini akan memberikan kendali penuh terhadap setiap sumber daya pada Namespace RoleBinding, termasuk Namespace itu sendiri.</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>Tidak ada</td>
<td>mengizinkan akses administrator, yang dimaksudkan untuk diberikan dalam sebuah Namespace menggunakan <b>RoleBinding</b>.
Jika digunakan dalam <b>RoleBinding</b>, ini memungkikan akses baca/tulis ke sebagian besar sumber daya di sebuah Namespace,
termasuk kemampuan untuk membuat Role dan RoleBinding dalam Namespace. 
Role ini tidak memungkinkan akses tulis pada kuota sumber daya atau ke Namespace itu sendiri.</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>Tidak ada</td>
<td>Mengizinkan akses baca/tulis pada seluruh objek dalam Namespace.

Role ini tidak memungkinkan untuk melihat dan mengubah Role dan RoleBinding.
Namun, Role ini memungkinkan untuk mengakses Secret dan menjalankan Pod seperti ServiceAccount dalam Namespace, 
sehingga dapat digunakan untuk mendapatkan tingkat akses API dari setiap ServiceAccount di Namespace. 
</td>
</tr>
<tr>
<td><b>view</b></td>
<td>Tidak ada</td>
<td>Mengizinkan akses baca untuk melihat hampir seluruh objek dalam Namespace.

Ini tidak memungkinkan untuk melihat Role dan RoleBinding.

Role ini tidak memungkikan melihat Secret, karena pembacaan konten Secret memungkinkan
akses ke kredensial ServiceAccount dalam Namespace, yang akan memungkinkan akses API sebagai
ServiceAccount apapun di Namespace (bentuk eskalasi privilese).
</td>
</tr>
</table>

### Role komponen inti

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>ClusterRole Bawaan</th>
<th>ClusterRoleBinding Bawaan</th>
<th>Deskripsi</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:kube-scheduler</b></td>
<td>Pengguna <b>system:kube-scheduler</b></td>
<td>Mengizinkan akses ke sumber daya yang dibutuhkan oleh komponen {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}.</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<td>Pengguna <b>system:kube-scheduler</b></td>
<td>Mengizinkan akses ke sumber daya volume yang dibutuhkan oleh komponen kube-scheduler.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td>Pengguna <b>system:kube-controller-manager</b></td>
<td>Mengizinkan akses ke sumber daya yang dibutuhkan oleh komponen {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}.
Izin yang diperlukan oleh masing-masing pengontrol dirincikan di <a href="#controller-roles">Role pengontrol</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>Tidak ada</td>
<td>Mengizinkan akses ke sumber daya yang dibutuhkan oleh kubelet, <b>termasuk akses baca ke semua Secret, dan akses rulis ke semua objek status Pod</b>.

Kamu dapat menggunakan <a href="/docs/reference/access-authn-authz/node/">pemberi otorisasi Node</a> dan <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">pugasan admisi NodeRestriction</a> daripada Role <tt>system:node</tt>, dan mengizinkan pemberian akses API ke kubelet berdasarkan Pod yang dijadwalkan untuk berjalan di atasnya.

Role <tt>system:node</tt> hanya ada untuk kompatibilitas dengan klaster Kubernetes yang ditingkatkan dari versi sebelum v1.8.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td>Pengguna <b>system:kube-proxy</b></td>
<td>Mengizinkan akses ke sumber daya yang dibutuhkan oleh komponen {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}.</td>
</tr>
</tbody>
</table>

### Role komponen lainnya

<table>
<colgroup><col style="width: 25%;" /><col style="width: 25%;" /><col /></colgroup>
<thead>
<tr>
<th>ClusterRole Bawaan</th>
<th>ClusterRoleBinding Bawaan</th>
<th>Deskripsi</th>
</tr>
</thead>
<tbody>
<tr>
<td><b>system:auth-delegator</b></td>
<td>Tidak ada</td>
<td>Mengizinkan pemeriksaan otentikasi dan otorisasi yang didelegasikan.
Hal ini umumnya digunakan oleh pugasan server API untuk otentikasi dan otorisasi terpadu.</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>Tidak ada</td>
<td>Role untuk komponen <a href="https://github.com/kubernetes/heapster">Heapster</a> (usang).</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>Tidak ada</td>
<td>Role untuk komponen <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a>.</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td>ServiceAccount <b>kube-dns</b> dalam Namespace <b>kube-system</b></td>
<td>Role untuk komponen <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a>.</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>Tidak ada</td>
<td>Mengizinkan akses penuh ke API kubelet.</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>Tidak ada</td>
<td>Mengizinkan akses ke sumber daya yang dibutuhkan untuk melakukan <a href="/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/"><i>bootstrapping</i> TLS kubelet</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>Tidak ada</td>
<td>Role untuk komponen <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a>.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>Tidak ada</td>
<td>Mengizinkan akses ke sumber daya yang dibutuhkan oleh kebanyakan <a href="/id/docs/concepts/storage/persistent-volumes/#dinamis">penyedia volume dinamis</a>.</td>
</tr>
<tbody>
</table>

### Role untuk pengontrol bawaan {#controller-roles}

{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
pada Kubernetes menjalankan {{< glossary_tooltip term_id="controller" text="pengontrol" >}}
yang merupakan bawaan dari _control plane_ Kubernetes. Ketika dijalankan dengan
`--use-service-account-credentials`, kube-controller-manager memulai setiap pengontrol
menggunakan ServiceAccount yang terpisah. Role yang sesuai tersedia untuk setiap
pengontrol bawaan, dengan prefiks `system:controller:`. Jika manajer pengontrol tidak
dimulai dengan `--use-service-account-credentials`, maka manajer pengontrol akan menjalankan
semua kontrol tertutup (_control loop_) menggunakan kredensialnya sendiri, yang harus
diberikan semua Role yang relevan. Role yang dimaksud termasuk:

* `system:controller:attachdetach-controller`
* `system:controller:certificate-controller`
* `system:controller:clusterrole-aggregation-controller`
* `system:controller:cronjob-controller`
* `system:controller:daemon-set-controller`
* `system:controller:deployment-controller`
* `system:controller:disruption-controller`
* `system:controller:endpoint-controller`
* `system:controller:expand-controller`
* `system:controller:generic-garbage-collector`
* `system:controller:horizontal-pod-autoscaler`
* `system:controller:job-controller`
* `system:controller:namespace-controller`
* `system:controller:node-controller`
* `system:controller:persistent-volume-binder`
* `system:controller:pod-garbage-collector`
* `system:controller:pv-protection-controller`
* `system:controller:pvc-protection-controller`
* `system:controller:replicaset-controller`
* `system:controller:replication-controller`
* `system:controller:resourcequota-controller`
* `system:controller:root-ca-cert-publisher`
* `system:controller:route-controller`
* `system:controller:service-account-controller`
* `system:controller:service-controller`
* `system:controller:statefulset-controller`
* `system:controller:ttl-controller`

## Pencegahan eskalasi privilese dan _bootstrapping_

API RBAC mencegah pengguna dari mengeskalasikan privilese dengan mengubah Role atau RoleBinding.
Karena hal ini diberlakukan pada level API, maka hal ini berlaku bahkan ketika pemberi otorisasi
RBAC tidak digunakan.

### Pembatasan pada pembuatan dan pembaruan Role

Kamu hanya bisa membuat/memperbaru suatu Role jika setidaknya satu dari beberapa
hal di bawah ini terpenuhi:

1. Kamu telah mempunyai semua izin yang termuat dalam Role tersebut, pada lingkup yang sama
dengan objek yang diubah
(di seluruh klaster untuk sebuah ClusterRole, di dalam Namespace yang sama atau keseluruhan
klaster untuk sebuah Role).
2. Kamu diberikan izin eksplisit untuk melakukan `escalate` pada sumber daya `roles` atau
`clusterroles` di dalam grup API `rbac.authorization.k8s.io`.

Sebagai contoh, jika `user-1` tidak memiliki kemampuan untuk mendaftar Secret di seluruh klaster,
maka `user-1` tidak akan bisa membuat suatu ClusterRole yang memuat izin tersebut. Agar pengguna
bisa membuat/memperbaru Role:

1. Berikan sebuah Role yang memungkinkan mereka untuk membuat/memperbarui objek Role atau CLusterRole, sesuai keinginan.
2. Berikan mereka izin untuk menyertakan izin tertentu dalam Role yang mereka buat/perbarui:
    * secara implisit, dengan memberikan mereka izin tersebut (jika mereka mencoba untuk membuat atau mengubah sebuah Role atau ClusterRole dengan izin yang tidak mereka miliki, permintaan API akan dilarang)
    * atau secara eksplisit mengizinkan penentuan izin apa pun dalam sebuah `Role` atau `ClusterRole` dengan memberikan mereka izin untuk melakukan `escalate` pada sumber daya `roles` atau `clusterroles` di dalam grup API `rbac.authorization.k8s.io`

### Pembatasan pada pembuatan dan pembaruan RoleBinding

Kamu hanya bisa membuat/memperbarui suatu RoleBinding jika kamu telah mempunyai semua izin yang
terdapat pada Role yang diacu (di dalam lingkup yang sama dengan RoleBinding) *atau* jika
kamu telah terotorisasi untuk melakukan `bind` pada role yang diacu.
Sebagai contoh, jika `user-1` tidak mempunyai kemampuan untuk mendaftar Secret di seluruh klaster,
maka `user-1` tidak akan bisa membuat sebuah ClusterRoleBinding dengan Role yang memberikan
izin tersebut. Agar pengguna bisa membuat/memperbarui RoleBinding:

1. Berikan sebuah Role yang mengizinkan mereka untuk membuat/memperbarui objek RoleBinding atau ClusterRoleBinding, sesuai keinginan.
2. Berikan mereka izin yang dibutuhkan untuk RoleBinding tertentu:
    * secara implisit, dengan memberikan mereka izin yang yang termuat pada Role yang dimaksud
    * secara eksplisit, dengan memberikan mereka izin untuk melakukan `bind` pada Role (atau ClusterRole) tertentu

Sebagai contoh, ClusterRole dan RoleBinding berikut akan memungkinkan `user-1` untuk memberikan Role `admin`, `edit`, dan `view` kepada pengguna lain di dalam Namespace `user-1-namespace`:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  resourceNames: ["admin","edit","view"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: role-grantor-binding
  namespace: user-1-namespace
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

Ketika melakukan _bootstrapping_ Role dan RoleBinding yang pertama, pengguna awal perlu memberikan
izin yang belum mereka miliki.
Untuk melakukan _bootstrapping_ Role dan RoleBinding awal:

* Gunakan kredensial dengan grup "system:masters" yang terikat ke Role _super-user_ "cluster-admin" oleh RoleBinding bawaan.
* Jika server API dijalankan dengan porta tidak aman diaktifkan (`--insecure-port`), kamu juga bisa membuat panggilan API via porta tersebut, yang tidak memberlakukan otentikasi atau otorisasi.

## Utilitas baris perintah

### `kubectl create role`

Membuat sebuah objek Role yang mendefinisikan izin di dalam sebuah Namespace. Contoh:

* Membuat sebuah Role bernama "pod-reader" yang memungkinkan pengguna untuk melakukan `get`, `watch` dan `list` pada Pod:

    ```shell
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* Membuat sebuah Role bernama "pod-reader" dengan resourceNames yang ditentukan:

    ```shell
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Membuat sebuah Role bernama "foo" dengan apiGroups yang ditentukan:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Membuat sebuah Role bernama "foo" dengan izin sub-sumber daya:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Membuat sebuah Role bernama "my-component-lease-holder" dengan izin untuk mendapatkan/memperbarui suatu sumber daya dengan nama tertentu:

    ```shell
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```

### `kubectl create clusterrole`

Membuat sebuah ClusterRole. Contoh:

* Membuat sebuah ClusterRole bernama "pod-reader" yang memungkinkan pengguna untuk merlakukan `get`, `watch` dan `list` pada Pod:

    ```shell
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* Membuat sebuah ClusterRole bernama "pod-reader" dengan recourceNames yang ditentukan:

    ```shell
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Membuat sebuah ClusterRole bernama "foo" dengan apiGroups yang ditentukan:

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Membuat sebuah ClusterRole bernama "foo" dengan izin sub-sumber daya:

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Membuat sebuah ClusterRole bernama "foo" dengan nonResourceURL yang ditentukan:

    ```shell
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* Membuat sebuah ClusterRole bernama "monitoring" dengan aggregationRule yang ditentukan:

    ```shell
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```

### `kubectl create rolebinding`

Memberikan sebuah Role atau ClusterRole di dalam Namespace tertentu. Contoh:

* Di dalam Namespace "acme", memberikan izin dalam ClusterRole "admin" kepada pengguna bernama "bob":

    ```shell
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* Di dalam Namespace "acme", memberikan izin dalam ClusterRole "view" ke ServiceAccount di dalam Namespace "acme" yang bernama "myapp":

    ```shell
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* Di dalam Namespace "acme", memberikan izin dalam ClusterRole "view" ke ServiceAccount di dalam Namespace "myappnamespace" yang bernama "myapp":

    ```shell
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```

### `kubectl create clusterrolebinding`

Memberikan sebuah ClusterRole di seluruh klaster (semua Namespace). Contoh:

* Di seluruh klaster, memberikan izin dalam ClusterRole "cluster-admin" kepada pengguna bernama "root":

    ```shell
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* Di seluruh klaster, memberikan izin dalam ClusterRole "system:node-proxier" kepada user bernama "system:kube-proxy":

    ```shell
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* Di seluruh klaster, memberikan izin dalam ClusterRole "view" ke ServiceAccount bernama "myapp" di dalam Namespace "acme":

    ```shell
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

Membuat atau memperbarui objek API `rbac.authorization.k8s.io/v1` dari suatu berkas manifes.

Objek yang hilang dibuat, dan Namespace dibuat untuk objek dengan Namespace jika diperlukan.

Role yang sudah ada diperbarui untuk menyertakan izin pada objek masukan,
dan menghilangkan izin tambahan jika `--remove-extra-permissions` ditetapkan.

RoleBinding yang sudah ada diperbarui untuk menyertakan subjek pada objek masukan,
dan menghapus subjek tambahan jika `--remove-extra-subjects` ditetapkan.

Contoh:

* Mencoba menerapkan sebuah berkas manifes dari objek RBAC, menampilkan perubahan yang akan dibuat:

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client
    ```

* Menerapkan sebuah berkas manifes dari objek RBAC, mempertahankan izin tambahan (dalam Role) dan subjek tambahan (dalam RoleBinding):

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* Menerapkan sebuah berkas manifes dari objek RBAC, menghapus izin tambahan (dalam Role) dan subjek tambahan (dalam RoleBinding):

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
    ```

## Izin ServiceAccount {#service-account-permissions}

Kebijakan RBAC bawaan memberikan izin terbatas ke komponen _control plane_, Node, dan pengontrol,
akan tetapi *tidak memberikan izin* ke ServiceAccount di luar Namespace `kube-system`
(di luar izin diskoveri yang diberikan kepada semua pengguna terotentikasi).

Hal ini memungkinkan kamu untuk memberika Role tertentu ke ServiceAccount tertentu sesuai
kebutuhan. RoleBinding yang sangat detail memberikan keamanan yang lebih baik,
akan tetapi membutuhkan lebih banyak usaha untuk pengaturannya. Pemberian izin
yang lebih luas dapat memberikan akses API yang tidak perlu (dan berpotensi tereskalasi)
ke ServiceAccount, akan tetapi pengaturannya lebih mudah.

Dalam urutan dari yang paling aman ke yang paling tidak aman, pendekatannya adalah:

1. Memberikan sebuah Role ke ServiceAccount aplikasi tertentu (praktik terbaik)

    Hal ini membutuhkan aplikasi untuk menentukan sebuah `serviceAccountName`
    di dalam spesifikasi Pod-nya, dan untuk ServiceAccount yang akan dibuat (via
    API, manifes aplikasi, `kubectl create serviceaccount`, dan lain-lain).

    Sebagai contoh, untuk memberikan izin hanya baca (_read-only_) di dalam "my-namespace"
    ke ServiceAccount "my-sa":

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. Memberikan sebuah Role ke ServiceAccount "default" di dalam suatu Namespace

    Jika sebuah aplikasi tidak menetapkan `serviceAccountName`, aplikasi
    tersebut akan menggunakan ServiceAccount "default".

    {{< note >}}
    Izin yang diberikan ke ServiceAccount "default" tersedia ke Pod apa pun di dalam
    Namespace yang tidak menetapkan `serviceAccountName`.
    {{< /note >}}

    Sebagai contoh, untuk memberikan izin hanya baca di dalam "my-namespace" ke ServiceAccount
    "default":

    ```shell
    kubectl create rolebinding default-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:default \
      --namespace=my-namespace
    ```

    Banyak [pugasan](/id/docs/concepts/cluster-administration/addons/) berjalan sebagai
    ServiceAccount "default" di dalam Namespace `kube-system`. Untuk mengizinkan pugasan
    tersebut berjalan dengan akses _super-user_, berikan izin `cluster-admin` kepada
    ServiceAccount "default" di dalam Namespace `kube-system`.

    {{< caution >}}
    Mengaktifkan ini berarti Namespace `kube-system` memuat Secret yang
    memberikan akses _super-user_ ke API klastermu.
    {{< /caution >}}

    ```shell
    kubectl create clusterrolebinding add-on-cluster-admin \
      --clusterrole=cluster-admin \
      --serviceaccount=kube-system:default
    ```

3. Memberikan Role ke semua ServiceAccount dalam suatu Namespace

    Jika kamu ingin semua aplikasi di dalam satu Namespace untuk memiliki Role, apa pun
    ServiceAccount yang digunakan, maka kamu dapat memberikan Role ke grup ServiceAccount
    untuk Namespace tersebut.

    Sebagai contoh, untuk memberikan izin hanya baca di dalam "my-namespace" ke semua
    ServiceAccount di dalam Namespace tersebut:

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. Memberikan Role terbatas ke semua ServiceAccount di seluruh klaster (tidak disarankan)
    
    Jika kamu tidak ingin untuk mengelola izin per Namespace, kamu bisa memberikan
    Role yang berlaku di seluruh klaster kepada semua ServiceAccount.

    Sebagai contoh, untuk memberikan akses hanya baca di semua Namespace untuk
    semua ServiceAccount yang ada di klaster:

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. Memberikan akses _super-user_ ke semua ServiceAccount di seluruh klaster (sangat tidak disarankan)
    
    Jika kamu tidak peduli untuk melakukan partisi terhadap izin sama sekali, maka kamu bisa
    memberikan akses _super-user_ ke semua ServiceAccount.

    {{< warning >}}
    Hal ini akan memberikan akses penuh untuk aplikasi apapun ke klastermu, dan juga
    memberikan pengguna manapun dengan akses baca ke Secret (atau kemampuan untuk membuat
    Pod apa pun) akses penuh ke klastermu.
    {{< /warning >}}

    ```shell
    kubectl create clusterrolebinding serviceaccounts-cluster-admin \
      --clusterrole=cluster-admin \
      --group=system:serviceaccounts
    ```

## Melakukan peningkatan dari ABAC

Klaster yang awalnya menjalankan versi Kubernetes lawas sering kali menggunakan
kebijakan ABAC yang permisif, termasuk memberikan akses API penuh ke semua
ServiceAccount.

Kebijakan RBAC bawaan memberikan izin yang terbatas ke komponen _control plane_, Node,
dan pengontrol, akan tetapi *tidak memberikan izin* ke ServiceAccount di luar Namespace
`kube-system` (di luar izin diskoveri yang diberikan kepada semua pengguna terotentikasi).

Meskipun jauh lebih aman, hal ini dapat mengganggu beban kerja yang sudah ada yang
mengharapkan untuk menerima izin API secara otomatis.
Berikut adalah dua pendekatan untuk mengelola transisi ini:

### Pemberi otorisasi paralel

Jalankan pemberi otorisasi RBAC dan ABAC bersamaan, dan tentukan berkas kebijakan yang
memuat [kebijakan ABAC lama](/docs/reference/access-authn-authz/abac/#policy-file-format):

```
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

Untuk menjelaskan opsi baris perintah yang pertama secara detail: jika pemberi otorisasi
sebelumnya, seperti Node, menolak permintaan, maka pemberi otorisasi RBAC mencoba untuk
mengotorisasi permintaan API tersebut. Jika RBAC juga menolak permintaan API tersebut,
maka pemberi otorisasi ABAC akan dijalankan. Hal ini berarti permintaan apa pun yang
diizinkan oleh *salah satu* kebijakan RBAC atau ABAC akan diizinkan.

Ketika kube-apiserver dijalankan dengan level log 5 atau lebih tinggi untuk komponen
RBAC (`--vmodule=rbac*=5` atau `--v=5`), kamu dapat melihat penolakan RBAC di log
server API (dengan prefiks `RBAC`). Kamu dapat menggunakan informasi tersebut untuk
menentukan Role mana yang perlu diberikan ke pengguna, grup, atau ServiceAccount yang mana.

Jika kamu telah [memberikan Role ke ServiceAccount](#service-account-permissions) dan
beban kerja sedang berjalan tanpa pesan penolakan RBAC dalam log server, maka kamu
dapat menghapus pemberi otorisasi ABAC.

### Izin RBAC permisif

Kamu dapat mereplikasi kebijakan ABAC yang permisif dengan menggunakan RoleBinding
RBAC.

{{< warning >}}
Kebijakan berikut mengizinkan **SEMUA** ServiceAccount bentindak sebagai administrator
klaster. Aplikasi apa pun yang berjalan di dalam Container akan menerima kredensial
ServiceAccount secara otomatis, dan dapat melakukan tindakan apa pun terhadap API,
termasuk menampilkan Secret dan mengubah izin. Hal ini bukan kebijakan
yang direkomendasikan.

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

Setelah kamu beralih menggunakan RBAC, kamu harus menyesuaikan kontrol akses untuk
klastermu untuk memastikan bahwa kesemuanya memenuhi kebutuhanmu terkait keamanan
informasi.
