---
title: Menggunakan Otorisasi RBAC
content_type: concept
aliases: [../../../rbac/]
weight: 70
---

<!-- overview -->
Kontrol akses berbasis peran (RBAC) adalah metode pengaturan akses ke sumber daya komputer 
atau jaringan berdasarkan peran pengguna individu dalam organisasi kamu.


<!-- body -->
Otorisasi RBAC menggunakan `rbac.authorization.k8s.io` kelompok API untuk mengendalikan keputusan
otorisasi, memungkinkan kamu untuk mengkonfigurasi kebijakan secara dinamis melalui API Kubernetes.

Untuk mengaktifkan RBAC, jalankan Kubernetes dengan _flag_ `--authorization-mode` atur 
dengan daftar yang dipisahkan koma dengan menyertakan `RBAC`;
sebagai contoh:
```shell
kube-apiserver --authorization-mode=Example,RBAC --other-options --more-options
```

## Objek API  {#api-overview}

API RBAC mendeklarasikan empat jenis objek Kubernetes: Role, ClusterRole,
RoleBinding and ClusterRoleBinding. kamu bisa [mendeskripsikan beberapa objek](/id/docs/concepts/overview/working-with-objects/kubernetes-objects/#understanding-kubernetes-objects), atau mengubahnya menggunakan alat seperti `kubectl`, seperti objek Kubernetes lain.

{{< caution >}}
Objek-objek ini, dengan disengaja, memaksakan pembatasan akses. Jika kamu melakukan perubahan
ke klaster saat kamu belajar, lihat
[pencegahan eskalasi hak istimewa dan _bootstrap_](#privilege-eskalasi-pencegahan-dan-bootstrap)
untuk memahami bagaimana pembatasan tersebut dapat mencegah kamu melakukan beberapa perubahan.
{{< /caution >}}

### Role dan ClusterRole

Sebuah RBAC Role atau ClusterRole berisi aturan yang mewakili sekumpulan izin.
Izin bersifat aditif (tidak ada aturan "tolak").

Sebuah Role selalu mengatur izin dalam Namespace tertentu;
ketika kamu membuat Role, kamu harus menentukan Namespace tempat Role tersebut berada.

ClusterRole, sebaliknya, adalah sumber daya tanpa Namespace. Sumber daya tersebut memiliki nama yang berbeda (Role
dan ClusterRole) karena objek Kubernetes selalu harus menggunakan Namespace atau tanpa Namespace;
tidak mungkin keduanya.

ClusterRole memiliki beberapa kegunaan. Kamu bisa menggunakan ClusterRole untuk:

1. mendefinisikan izin pada sumber daya dalam Namespace dan diberikan dalam sebuah Namespace atau lebih
1. mendefinisikan izin pada sumber daya dalam Namespace dan diberikan dalam seluruh Namespace
1. mendefinisikan izin pada sumber daya yang dicakup klaster

Jika kamu ingin mendefinisikan sebuah peran dalam Namespace, gunakan Role; jika kamu ingin mendefinisikan
peran di level klaster, gunakan ClusterRole.
 
#### Contoh Role 

Berikut adalah contoh Role dalam Namespace bawaan yang dapat digunakan 
untuk memberikan akses baca pada Pod:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  Namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" mengindikasikan core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

#### Contoh ClusterRole

ClusterRole dapat digunakan untuk memberikan izin yang sama dengan Role.
Karena ClusterRole memiliki lingkup-klaster, kamu juga dapat menggunakannya untuk memberikan akses ke:

* sumber daya lingkup-klaster (seperti Nodes)
* berbagai _endpoint_ non-sumber daya (seperti `/healthz`)
* sumber daya Namespace (seperti Pod), di semua Namespace
 Sebagai contoh: kamu bisa menggunakan ClusterRole untuk memungkinkan pengguna tertentu untuk menjalankan 
`kubectl get pods --all-namespaces`.

Berikut adalah contoh ClusterRole yang dapat digunakan untuk memberikan akses baca pada
Secret di Namespace tertentu, atau di semua Namespace (tergantung bagaimana itu [terikat](#rolebinding-dan-clusterrolebinding)):

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
Jika kamu ingin memasangkan ClusterRole ke semua Namespace di klaster kamu, kamu dapat menggunakan 
ClusterRoleBinding.

Nama objek RoleBinding atau ClusterRoleBinding harus valid menggunakan
[nama _path segment_](/id/docs/concepts/overview/working-with-objects/names#path-segment-names) yang valid.

#### Contoh RoleBinding

Berikut adalah contoh dari RoleBinding yang memberikan Role "pod-reader" kepada pengguna "jane"
pada Namespace bawaan.
Ini memungkinkan "jane" untuk membaca Pod di Namespace bawaan.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# Role binding memungkinkan "jane" untuk membaca Pod di Namespace bawaan
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
  # "roleRef" menentukan pengikatan ke Role / ClusterRole
  kind: Role # ini harus Role atau ClusterRole
  name: pod-reader # ini harus sesuai dengan nama Role atau ClusterRole yang ingin kamu gunakan
  apiGroup: rbac.authorization.k8s.io
```

RoleBinding juga bisa mereferensikan ClusterRole untuk memberikan izin yang didefinisikan di dalam
ClusterRole ke sumber daya di dalam Namespace RoleBinding. Referensi semacam ini
memungkinkan kamu menentukan sekumpulan Role yang umum di seluruh klaster kamu, lalu menggunakannya kembali di dalam
beberapa Namespace.

Sebagai contoh, meskipun RoleBinding berikut merujuk ke ClusterRole,
"dave" (subjek, peka huruf besar-kecil) hanya akan dapat membaca Secret di dalam Namespace "development", 
karena Namespace RoleBinding (di dalam metadata-nya) adalah "development".

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# role binding memungkinkan "dave" untuk membaca Secret di Namespace "development".
# Kamu sudah harus memiliki ClusterRole bernama "secret-reader".
kind: RoleBinding
metadata:
  name: read-secrets
  #
  # Namespace dari RoleBinding menentukan dimana izin akan diberikan.  
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
# Cluster role binding ini memungkinkan siapapun di dalam kelompok "manager" untuk membaca Secret di berbagai Namespace.
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # Nama peka huruf besar-kecil
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```
Setelah kamu membuat sebuat ikatan, kamu tidak dapat mengganti Role atau ClusterRole dirujuk.
Jika kamu mencoba mengganti sebuah ikatan `roleRef`, kamu mendapatkan kesalahan validasi. Jika kamu
tidak ingin mengganti `roleRef` untuk sebuah ikatan, kamu harus menghapus objek ikatan tersebut dan membuat
sebuah pengganti.

Ada dua alasan untuk pembatasan tersebut:

1. Membuat `roleRef` tidak dapat diubah memungkinkan seseorang untuk melakukan `update` pada objek ikatan yang ada, 
sehingga mereka dapat mengelola daftar subyek, tanpa bisa berubah
Role yang diberikan kepada subyek tersebut.

1. Ikatan pada Role yang berbeda adalah ikatan yang berbeda secara fundamental.
Mengharuskan sebuah ikatan untuk dihapus/diciptakan kembali untuk dalam upaya mengubah `roleRef` akan
memastikan daftar lengkap subyek dalam ikatan akan diberikan diberikan
Role baru (sebagai langkah untuk mencegah modifikasi secara tidak sengaja hanya pada roleRef
tanpa memverifikasi semua subyek yang seharusnya diberikan izin pada Role baru).

Utilitas baris perintah `kubectl auth reconcile` membuat atau memperbaharui berkas manifes yang mengandung objek RBAC,
dan menangani penghapusan dan pembuatan objek ikatan jika dibutuhkan untuk mengganti Role yang dirujuk.
Lihat [penggunaan perintah dan contoh](#kubectl-auth-reconcile) untuk informasi tambahan.

### Mengacu pada sumber daya

Pada API Kubernetes, sebagian besar sumber daya diwakili dan diakses menggunakan representasi 
nama objek, seperti `pods` untuk Pod. RBAC mengacu pada sumber daya yang menggunakan nama yang persis sama
dengan yang muncul di URL untuk berbagai _endpoint_ API yang relevan.
Beberapa Kubernetes APIs melibatkan 
_subresource_, seperti catatan untuk Pod. Permintaan untuk catatan Pod terlihat seperti:

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
Berikut adalah contoh yang membatasi subjeknya hanya untuk melakukan `get` atau` update` pada sebuah
ConfigMap bernama `my-configmap`:

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
Kamu tidak dapat membatasi permintaan `create` atau` deletecollection` dengan nama sumber daya. Untuk `create`, 
Keterbatasan ini dikarenakan nama objek yang tidak dikenal pada waktu otorisasi.
{{< /note >}}

### Agregat ClusterRole

Kamu dapat mengumpulkan beberapa ClusterRole menjadi satu ClusterRole gabungan.
_Controller_, yang berjalan sebagai bagian dari _control plane_ klaster, mengamati objek ClusterRole
dengan `aggregationRule`. `AggregationRule` mendefinisikan label
Selector yang digunakan oleh _Controller_ untuk mencocokkan objek ClusterRole lain 
yang harus digabungkan ke dalam `rules`.

Berikut adalah contoh ClusterRole agregat:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # _Control plane_ secara otomatis mengisi rules
```

Jika kamu membuat ClusterRole baru yang cocok dengan _selector_ label dari ClusterRole agregat yang ada,
perubahan itu memicu penambahan aturan baru ke dalam ClusterRole agregat.
Berikut adalah contoh yang menambahkan aturan ke "monitoring" ClusterRole, dengan membuat sebuah
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

[Role bawaan pengguna](#role-dan-role-binding-bawaan) menggunakan agregasi ClusterRole. Ini memungkinkan kamu,
sebagai administrator klaster, menambahkan aturan untuk sumber daya kustom, seperti yang dilayani oleh CustomResourceDefinition
atau _aggregated_ server API, untuk memperluas Role bawaan.

Sebagai contoh: ClusterRole berikut mengizinkan Role bawaan "admin" dan "edit" mengelola sumber daya kustom
bernama CronTab, sedangkan Role "view" hanya dapat melakukan tindakan membaca sumber daya CronTab.
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

Contoh berikut adalah potongan dari objek Role atau ClusterRole, yang hanya menampilkan
bagian `rules`.

Mengizinkan pembacaan sumber daya `"pods`` pada kumpulan API inti:

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
di bagian sumber daya dari URL) pada masing-masing kumpulan API `"extensions"` dan `"apps"`:

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  #
  # pada tingkat HTTP, nama dari sumber daya untuk mengakses objek Deployment
  # adalah "deployments"
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Mengizinkan pembacaan pada Pods pada kumpulan API inti, dan juga serta pembacaan atau penulisan Job
di kumpulan API `"batch"` atau `"extensions"`:

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

Mengizinkan pembacaan ConfigMap bernama "my-config" (harus terikat dengan
RoleBinding untuk membatasi pada sebuah ConfigMap di sebuah Namespace):

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

Mengizinkan pembacaan sumber daya `"nodes"` pada kumpulan API inti (karena sebuah node
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

### Mengacu Pada Subjek

RoleBinding atau ClusterRoleBinding mengikat sebuah Role ke subjek.
Subjek dapat berupa kelompok, pengguna atau ServiceAccount.

Kubernetes merepresentasikan _username_ sebagai string.
Ini bisa berupa: nama sederhana, seperti "alice"; email, seperti "bob@example.com";
atau ID pengguna numerik yang direpresentasikan sebagai string. Terserah kamu sebagai administrator klaster
untuk mengkonfigurasi [modul otentikasi](/docs/reference/access-authn-authz/authentication/)
sehingga otentikasi menghasilkan _username_ dalam format yang kamu inginkan.

{{< caution >}}
Awalan `system:` direservasi untuk sistem Kubernetes, jadi kamu harus memastikan
bahwa kamu tidak memiliki pengguna atau grup dengan nama yang dimulai dengan `system:` secara tidak sengaja.
Selain awalan khusus ini, sistem otorisasi RBAC tidak memerlukan format apa pun
untuk nama pengguna.
{{< /caution >}}

Di Kubernetes, modul otentikasi menyediakan informasi grup.
Grup, seperti halnya pengguna, direpresentasikan sebagai string, dan string tersebut tidak memiliki format tertentu,
selain awalan `system:` yang sudah direservasi.

[ServiceAccount](/id/docs/tasks/configure-pod-container/configure-service-account/) memiliki nama yang diawali dengan `system:serviceaccount:`, dan menjadi milik grup yang diawali dengan nama `system:serviceaccounts:`.

{{< note >}}
- `system:serviceaccount:` (tunggal) adalah awalan untuk ServiceAccount _username_.
- `system:serviceaccounts:` (jamak) adalah awalan untuk ServiceAccount grup.
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

## Role dan RoleBinding Bawaan

API membuat satu set objek ClusterRole dan ClusterRoleBinding bawaan. 
Sebagian besar dari objek berawalan `system:`, menunjukkan bahwa sumber daya tersebut
secara langsung dikelolah oleh _control plane_ klaster. Seluruh ClusterRole dan ClusterRoleBinding dilabeli dengan
`kubernetes.io/bootstrapping=rbac-defaults`.

{{< caution >}}
Berhati-hatilah saat memodifikasi CLusterRole dan ClusterRoleBinding dengan nama yang
memiliki awalan `system:`.
Modifikasi sumber daya ini dapat mengakibatkan klaster yang malfungsi.
{{< /caution >}}

### Rekonsiliasi Otomatis

Pada setiap _start-up-_, server API memperbaharui ClusterRole bawaan dengan berbagai izin yang hilang, 
dan memperbaharui ikatan ClusterRole bawaan dengan subjek yang hilang.
Ini memungkinkan klaster untuk memperbaiki modifikasi yang tidak disengaja, dan membantu menjaga Role 
dan RoleBinding selalu terkini karena izin dan subjek berubah pada rilis terbaru Kubernetes.

Untuk menon-aktifkan rekonsiliasi ini, setel anotasi `rbac.authorization.kubernetes.io/autoupdate`
pada ClusterRole bawaan atau RoleBinding bawaan menjadi `false`.
Ingat bahwa hilangnya izin dan subjek bawaan dapat mengakibatkan klaster tidak berfungsi.

Rekonsiliasi otomatis diaktifkan secara bawaan jika otorizer RBAC aktif.

### Role API discovery {#discovery-roles}

RoleBinding bawaan memberi otorisasi kepada pengguna yang tidak terotentikasi untuk membaca informasi API yang dianggap aman
untuk diakses publik (termasuk CustomResourceDefinitions). Untuk menonaktifkan akses anonim, tambahkan `--anonymous-auth=false` ke konfigurasi server API.

Untuk melihat konfigurasi Role ini melalui `kubectl` jalankan perintah:

```shell
kubectl get clusterroles system:discovery -o yaml
```

{{< note >}}
Jika kamu mengubah ClusterRole tersebut, perubahan kamu akan ditimpa pada penyalaan ulang server API melalui 
[rekonsiliasi-otomatis](#auto-reconciliation). Untuk menghindari penulisan ulang tersebut, hindari mengubah Role secara manual, 
atau nonaktifkan rekonsiliasi otomatis
{{< /note >}}

<table>
<caption>Kubernetes RBAC API discovery roles</caption>
<colgroup><col width="25%" /><col width="25%" /><col /></colgroup>
<tr>
<th>ClusterRole Bawaan</th>
<th>ClusterRoleBinding Bawaan</th>
<th>Deskripsi</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> group</td>
<td>Mengizinkan pengguna hanya dengan akses baca untuk mengakses informasi dasar tentang diri mereka sendiri. Sebelum  v1.14, Role ini juga terikat pada <tt>system:unauthenticated</tt> secara bawaan.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> group</td>
<td>Mengizinkan akses baca pada berbagai _API discovery endpoint_ yang dibutuhkan untuk menemukan dan melakukan negosiasi pada tingkat API. Sebelum v1.14, Role ini juga terikat pada <tt>system:unauthenticated</tt> secara bawaan.</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>Mengizinkan akses baca pada informasi yang tidak sensitif tentang klaster. Diperkenalkan pada Kubernetes v1.14.</td>
</tr>
</table>

### Role Pengguna

Beberapa ClusterRole bawaan tidak diawali dengan `system:`. Ini dimaksudkan untuk Role pengguna.
Ini termasuk Role super-user (`cluster-admin`), Role yang dimaksudkan untuk diberikan akses seluruh klaster dengan
menggunakan ClusterRoleBinding, dan Role yang dimaksudkan untuk diberikan pada Namespace tertentu 
dengan menggunakan RoleBinding (`admin`, `edit`, `view`).

ClusterRole menggunakan [aggregasi ClusterRole](#aggregated-clusterroles) untuk mengizinkan admin untuk memasukan peraturan untuk sumber daya khusus pada ClusterRole ini. Untuk menambahkan aturan kepada Role `admin`, `edit`, atau `view`, buat sebuah CLusterRole
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
<td><b>system:masters</b> group</td>
<td>Mengizinkan akses super-user access untuk melakukan berbagai aksi pada berbagai sumber daya. 
Ketika digunakan pada <b>ClusterRoleBinding</b>, ini memberikan kendali penuh terhadap seluruh sumber daya pada klaster dan seluruh Namespace. 
Ketika digunakan pada <b>RoleBinding</b>, ini memberikan kendali penuh terhadap setiap sumber daya pada Namespace RoleBinding, termasuk Namespace itu sendiri.</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>None</td>
<td>mengizinkan akses admin, yang dimaksudkan untuk diberikan dalam sebuah Namespace menggunakan <b>RoleBinding</b>.
Jika digunakan dalam <b>RoleBinding</b>, ini memungkikan akses baca/tulis ke sebagian besar sumber daya di sebuah Namespace,
termasuk kemampuan untuk membuat Role dan RoleBinding dalam Namespace. 
Role ini tidak memungkinkan akses tulis pada kuota sumber daya atau ke Namespace itu sendiri.</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>None</td>
<td>Mengizinkan akses baca/tulis pada seluruh objek dalam Namespace.

Role ini tidak memungkinkan untuk melihat dan merubah Role dan RoleBinding.
Namun, Role ini memungkinkan untuk mengakses Secret dan menjalankan Pod seperti ServiceAccount dalam Namespace, 
sehingga dapat digunakan untuk mendapatkan tingkat akses API dari setiap ServiceAccount di Namespace. 
</td>
</tr>
<tr>
<td><b>view</b></td>
<td>None</td>
<td>Mengizinkan akses baca untuk melihat hampir seluruh objek dalam Namespace.

Ini tidak memungkinkan untuk melihat Role dan RoleBinding.

Role ini tidak memungkikan melihat Secret, karena pembacaan konten Secret memungkinkan
akses ke kredensial ServiceAccount dalam Namespace, yang akan memungkinkan akses API sebagai
ServiceAccount apapun di Namespace (bentuk eskalasi hak istimewa).
</td>
</tr>
</table>

### Core component roles

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>Allows access to the resources required by the {{< glossary_tooltip term_id="kube-scheduler" text="scheduler" >}} component.</td>
</tr>
<tr>
<td><b>system:volume-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>Allows access to the volume resources required by the kube-scheduler component.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> user</td>
<td>Allows access to the resources required by the {{< glossary_tooltip term_id="kube-controller-manager" text="controller manager" >}} component.
The permissions required by individual controllers are detailed in the <a href="#controller-roles">controller roles</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>None</td>
<td>Allows access to resources required by the kubelet, <b>including read access to all secrets, and write access to all pod status objects</b>.

You should use the <a href="/docs/reference/access-authn-authz/node/">Node authorizer</a> and <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction admission plugin</a> instead of the <tt>system:node</tt> role, and allow granting API access to kubelets based on the Pods scheduled to run on them.

The <tt>system:node</tt> role only exists for compatibility with Kubernetes clusters upgraded from versions prior to v1.8.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> user</td>
<td>Allows access to the resources required by the {{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}} component.</td>
</tr>
</table>

### Other component roles

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:auth-delegator</b></td>
<td>None</td>
<td>Allows delegated authentication and authorization checks.
This is commonly used by add-on API servers for unified authentication and authorization.</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/heapster">Heapster</a> component (deprecated).</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> component.</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b>kube-dns</b> service account in the <b>kube-system</b> namespace</td>
<td>Role for the <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a> component.</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>None</td>
<td>Allows full access to the kubelet API.</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>None</td>
<td>Allows access to the resources required to perform
<a href="/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/">kubelet TLS bootstrapping</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> component.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>None</td>
<td>Allows access to the resources required by most <a href="/docs/concepts/storage/persistent-volumes/#provisioner">dynamic volume provisioners</a>.</td>
</tr>
</table>

### Roles for built-in controllers {#controller-roles}

The Kubernetes {{< glossary_tooltip term_id="kube-controller-manager" text="controller manager" >}} runs
{{< glossary_tooltip term_id="controller" text="controllers" >}} that are built in to the Kubernetes
control plane.
When invoked with `--use-service-account-credentials`, kube-controller-manager starts each controller
using a separate service account.
Corresponding roles exist for each built-in controller, prefixed with `system:controller:`.
If the controller manager is not started with `--use-service-account-credentials`, it runs all control loops
using its own credential, which must be granted all the relevant roles.
These roles include:

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

## Privilege escalation prevention and bootstrapping

The RBAC API prevents users from escalating privileges by editing roles or role bindings.
Because this is enforced at the API level, it applies even when the RBAC authorizer is not in use.

### Restrictions on role creation or update

You can only create/update a role if at least one of the following things is true:

1. You already have all the permissions contained in the role, at the same scope as the object being modified
(cluster-wide for a ClusterRole, within the same namespace or cluster-wide for a Role).
2. You are granted explicit permission to perform the `escalate` verb on the `roles` or `clusterroles` resource in the `rbac.authorization.k8s.io` API group.

For example, if `user-1` does not have the ability to list Secrets cluster-wide, they cannot create a ClusterRole
containing that permission. To allow a user to create/update roles:

1. Grant them a role that allows them to create/update Role or ClusterRole objects, as desired.
2. Grant them permission to include specific permissions in the roles they create/update:
    * implicitly, by giving them those permissions (if they attempt to create or modify a Role or ClusterRole with permissions they themselves have not been granted, the API request will be forbidden)
    * or explicitly allow specifying any permission in a `Role` or `ClusterRole` by giving them permission to perform the `escalate` verb on `roles` or `clusterroles` resources in the `rbac.authorization.k8s.io` API group

### Restrictions on role binding creation or update

You can only create/update a role binding if you already have all the permissions contained in the referenced role
(at the same scope as the role binding) *or* if you have been authorized to perform the `bind` verb on the referenced role.
For example, if `user-1` does not have the ability to list Secrets cluster-wide, they cannot create a ClusterRoleBinding
to a role that grants that permission. To allow a user to create/update role bindings:

1. Grant them a role that allows them to create/update RoleBinding or ClusterRoleBinding objects, as desired.
2. Grant them permissions needed to bind a particular role:
    * implicitly, by giving them the permissions contained in the role.
    * explicitly, by giving them permission to perform the `bind` verb on the particular Role (or ClusterRole).

For example, this ClusterRole and RoleBinding would allow `user-1` to grant other users the `admin`, `edit`, and `view` roles in the namespace `user-1-namespace`:

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

When bootstrapping the first roles and role bindings, it is necessary for the initial user to grant permissions they do not yet have.
To bootstrap initial roles and role bindings:

* Use a credential with the "system:masters" group, which is bound to the "cluster-admin" super-user role by the default bindings.
* If your API server runs with the insecure port enabled (`--insecure-port`), you can also make API calls via that port, which does not enforce authentication or authorization.

## Command-line utilities

### `kubectl create role`

Creates a Role object defining permissions within a single namespace. Examples:

* Create a Role named "pod-reader" that allows users to perform `get`, `watch` and `list` on pods:

    ```shell
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* Create a Role named "pod-reader" with resourceNames specified:

    ```shell
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Create a Role named "foo" with apiGroups specified:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Create a Role named "foo" with subresource permissions:

    ```shell
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Create a Role named "my-component-lease-holder" with permissions to get/update a resource with a specific name:

    ```shell
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```

### `kubectl create clusterrole`

Creates a ClusterRole. Examples:

* Create a ClusterRole named "pod-reader" that allows user to perform `get`, `watch` and `list` on pods:

    ```shell
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* Create a ClusterRole named "pod-reader" with resourceNames specified:

    ```shell
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Create a ClusterRole named "foo" with apiGroups specified:

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Create a ClusterRole named "foo" with subresource permissions:

    ```shell
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Create a ClusterRole named "foo" with nonResourceURL specified:

    ```shell
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* Create a ClusterRole named "monitoring" with an aggregationRule specified:

    ```shell
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```

### `kubectl create rolebinding`

Grants a Role or ClusterRole within a specific namespace. Examples:

* Within the namespace "acme", grant the permissions in the "admin" ClusterRole to a user named "bob":

    ```shell
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* Within the namespace "acme", grant the permissions in the "view" ClusterRole to the service account in the namespace "acme" named "myapp":

    ```shell
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* Within the namespace "acme", grant the permissions in the "view" ClusterRole to a service account in the namespace "myappnamespace" named "myapp":

    ```shell
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```

### `kubectl create clusterrolebinding`

Grants a ClusterRole across the entire cluster (all namespaces). Examples:

* Across the entire cluster, grant the permissions in the "cluster-admin" ClusterRole to a user named "root":

    ```shell
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* Across the entire cluster, grant the permissions in the "system:node-proxier" ClusterRole to a user named "system:kube-proxy":

    ```shell
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* Across the entire cluster, grant the permissions in the "view" ClusterRole to a service account named "myapp" in the namespace "acme":

    ```shell
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

Creates or updates `rbac.authorization.k8s.io/v1` API objects from a manifest file.

Missing objects are created, and the containing namespace is created for namespaced objects, if required.

Existing roles are updated to include the permissions in the input objects,
and remove extra permissions if `--remove-extra-permissions` is specified.

Existing bindings are updated to include the subjects in the input objects,
and remove extra subjects if `--remove-extra-subjects` is specified.

Examples:

* Test applying a manifest file of RBAC objects, displaying changes that would be made:

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run=client
    ```

* Apply a manifest file of RBAC objects, preserving any extra permissions (in roles) and any extra subjects (in bindings):

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* Apply a manifest file of RBAC objects, removing any extra permissions (in roles) and any extra subjects (in bindings):

    ```shell
    kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
    ```

## ServiceAccount permissions {#service-account-permissions}

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

This allows you to grant particular roles to particular ServiceAccounts as needed.
Fine-grained role bindings provide greater security, but require more effort to administrate.
Broader grants can give unnecessary (and potentially escalating) API access to
ServiceAccounts, but are easier to administrate.

In order from most secure to least secure, the approaches are:

1. Grant a role to an application-specific service account (best practice)

    This requires the application to specify a `serviceAccountName` in its pod spec,
    and for the service account to be created (via the API, application manifest, `kubectl create serviceaccount`, etc.).

    For example, grant read-only permission within "my-namespace" to the "my-sa" service account:

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. Grant a role to the "default" service account in a namespace

    If an application does not specify a `serviceAccountName`, it uses the "default" service account.

    {{< note >}}
    Permissions given to the "default" service account are available to any pod
    in the namespace that does not specify a `serviceAccountName`.
    {{< /note >}}

    For example, grant read-only permission within "my-namespace" to the "default" service account:

    ```shell
    kubectl create rolebinding default-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:default \
      --namespace=my-namespace
    ```

    Many [add-ons](/id/docs/concepts/cluster-administration/addons/) run as the
    "default" service account in the `kube-system` namespace.
    To allow those add-ons to run with super-user access, grant cluster-admin
    permissions to the "default" service account in the `kube-system` namespace.

    {{< caution >}}
    Enabling this means the `kube-system` namespace contains Secrets
    that grant super-user access to your cluster's API.
    {{< /caution >}}

    ```shell
    kubectl create clusterrolebinding add-on-cluster-admin \
      --clusterrole=cluster-admin \
      --serviceaccount=kube-system:default
    ```

3. Grant a role to all service accounts in a namespace

    If you want all applications in a namespace to have a role, no matter what service account they use,
    you can grant a role to the service account group for that namespace.

    For example, grant read-only permission within "my-namespace" to all service accounts in that namespace:

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. Grant a limited role to all service accounts cluster-wide (discouraged)

    If you don't want to manage permissions per-namespace, you can grant a cluster-wide role to all service accounts.

    For example, grant read-only permission across all namespaces to all service accounts in the cluster:

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. Grant super-user access to all service accounts cluster-wide (strongly discouraged)

    If you don't care about partitioning permissions at all, you can grant super-user access to all service accounts.

    {{< warning >}}
    This allows any application full access to your cluster, and also grants
    any user with read access to Secrets (or the ability to create any pod)
    full access to your cluster.
    {{< /warning >}}

    ```shell
    kubectl create clusterrolebinding serviceaccounts-cluster-admin \
      --clusterrole=cluster-admin \
      --group=system:serviceaccounts
    ```

## Upgrading from ABAC

Clusters that originally ran older Kubernetes versions often used
permissive ABAC policies, including granting full API access to all
service accounts.

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

While far more secure, this can be disruptive to existing workloads expecting to automatically receive API permissions.
Here are two approaches for managing this transition:

### Parallel authorizers

Run both the RBAC and ABAC authorizers, and specify a policy file that contains
the [legacy ABAC policy](/docs/reference/access-authn-authz/abac/#policy-file-format):

```
--authorization-mode=...,RBAC,ABAC --authorization-policy-file=mypolicy.json
```

To explain that first command line option in detail: if earlier authorizers, such as Node,
deny a request, then the the RBAC authorizer attempts to authorize the API request. If RBAC
also denies that API request, the ABAC authorizer is then run. This means that any request
allowed by *either* the RBAC or ABAC policies is allowed.

When the kube-apiserver is run with a log level of 5 or higher for the RBAC component
(`--vmodule=rbac*=5` or `--v=5`), you can see RBAC denials in the API server log
(prefixed with `RBAC`).
You can use that information to determine which roles need to be granted to which users, groups, or service accounts.

Once you have [granted roles to service accounts](#service-account-permissions) and workloads
are running with no RBAC denial messages in the server logs, you can remove the ABAC authorizer.

### Permissive RBAC permissions

You can replicate a permissive ABAC policy using RBAC role bindings.

{{< warning >}}
The following policy allows **ALL** service accounts to act as cluster administrators.
Any application running in a container receives service account credentials automatically,
and could perform any action against the API, including viewing secrets and modifying permissions.
This is not a recommended policy.

```shell
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

After you have transitioned to use RBAC, you should adjust the access controls
for your cluster to ensure that these meet your information security needs.


