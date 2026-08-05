---
title: Mengatur Pod untuk Menggunakan ConfigMap
content_type: task
weight: 150
card:
  name: tasks
  weight: 50
---

<!-- overview -->
ConfigMap mengizinkan kamu untuk memisahkan artifak-artifak konfigurasi dari konten _image_ untuk menjaga aplikasi yang dikontainerisasi tetap portabel. Artikel ini menyediakan sekumpulan contoh penerapan yang mendemonstrasikan bagaimana cara membuat ConfigMap dan mengatur Pod menggunakan data yang disimpan di dalam ConfigMap.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->


## Membuat ConfigMap
Kamu dapat menggunakan `kubectl create configmap` ataupun generator ConfigMap pada `kustomization.yaml` untuk membuat sebuah ConfigMap. Perlu diingat bahwa `kubectl` mulai mendukung `kustomization.yaml` sejak versi 1.14.

### Membuat ConfigMap Menggunakan kubectl create configmap

Gunakan perintah `kubectl create configmap` untuk membuat ConfigMap dari [direktori](#membuat-configmap-dari-direktori), [berkas](#membuat-configmap-dari-berkas), ataupun [nilai-nilai yang harfiah (_literal values_)](#membuat-configmap-dari-nilai-harfiah):

```shell
kubectl create configmap <map-name> <data-source>
```

di mana \<map-name> merupakan nama yang ingin kamu berikan pada ConfigMap tersebut dan \<data-source> adalah direktori, berkas, atau nilai harfiah yang digunakan sebagai sumber data.
Nama dari sebuah objek ConfigMap haruslah berupa
[nama subdomain DNS](/id/docs/concepts/overview/working-with-objects/names#dns-subdomain-names) yang sah.

Ketika kamu membuat ConfigMap dari sebuah berkas, secara bawaan, _basename_ dari berkas tersebut akan menjadi kunci pada \<data-source>, dan isi dari berkas tersebut akan menjadi nilai dari kunci tersebut.

Kamu dapat menggunakan [`kubectl describe`](/docs/reference/generated/kubectl/kubectl-commands/#describe) atau
[`kubectl get`](/docs/reference/generated/kubectl/kubectl-commands/#get) untuk mengambil informasi
mengenai sebuah ConfigMap.

#### Membuat ConfigMap dari direktori

Kamu dapat menggunakan `kubectl create configmap` untuk membuat sebuah ConfigMap dari banyak berkas dalam sebuah direktori yang sama. Ketika kamu membuat sebuah ConfigMap dari sebuah direktori, kubectl akan mengidentifikasi berkas-berkas yang memiliki _basename_ yang merupakan sebuah kunci yang sah pada direktori dan mengemas tiap berkas tersebut ke dalam sebuah ConfigMap baru. Seluruh entri direktori kecuali berkas reguler akan diabaikan (subdirektori, _symlink_, _device_, _pipe_, dsb).

Sebagai contoh:

```shell
# Membuat direktori lokal
mkdir -p configure-pod-container/configmap/

# Mengunduh berkas-berkas sampel ke dalam direktori `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game.properties -O configure-pod-cont1ainer/configmap/game.properties
wget https://kubernetes.io/examples/configmap/ui.properties -O configure-pod-container/configmap/ui.properties

# Membuat configmap
kubectl create configmap game-config --from-file=configure-pod-container/configmap/
```

Perintah di atas mengemas tiap berkas, dalam kasus ini, `game.properties` dan `ui.properties` dalam direktori `configure-pod-container/configmap/` ke dalam ConfigMap dengan nama game-config. Kamu dapat menampilkan detail dari ConfigMap menggunakan perintah berikut:

```shell
kubectl describe configmaps game-config
```

Keluaran akan tampil seperti berikut:
```
Name:         game-config
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

Berkas-berkas `game.properties` dan `ui.properties` pada direktori `configure-pod-container/configmap/` direpresentasikan oleh bagian `data` pada ConfigMap.

```shell
kubectl get configmaps game-config -o yaml
```
Keluaran akan tampil seperti berikut:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:52:05Z
  name: game-config
  namespace: default
  resourceVersion: "516"
  uid: b4952dc3-d670-11e5-8cd0-68f728db1985
data:
  game.properties: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
  ui.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
    how.nice.to.look=fairlyNice
```

#### Membuat ConfigMap dari berkas

Kamu dapat menggunakan `kubectl create configmap` untuk membuat sebuah ConfigMap dari berkas individual, atau dari banyak berkas.

Sebagai contoh,

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties
```

akan menghasilkan ConfigMap berikut:

```shell
kubectl describe configmaps game-config-2
```

dengan keluaran seperti berikut:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
```

Kamu dapat memasukkan argumen `--from-file` beberapa kali untuk membuat sebuah ConfigMap dari banyak sumber data.

```shell
kubectl create configmap game-config-2 --from-file=configure-pod-container/configmap/game.properties --from-file=configure-pod-container/configmap/ui.properties
```

Kamu dapat menampilkan detail dari ConfigMap `game-config-2` menggunakan perintah berikut:

```shell
kubectl describe configmaps game-config-2
```

Keluaran akan tampil seperti berikut:

```
Name:         game-config-2
Namespace:    default
Labels:       <none>
Annotations:  <none>

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
ui.properties:
----
color.good=purple
color.bad=yellow
allow.textmode=true
how.nice.to.look=fairlyNice
```

Gunakan opsi `--from-env-file` untuk membuat sebuah ConfigMap dari sebuah _env-file_, sebagai contoh:

```shell
# Env-file berisi sebuah daftar variabel _environment_.
# Ada aturan-aturan sintaks yang berlaku:
#   Tiap baris pada sebuah env file harus memiliki format VAR=VAL.
#   Baris yang diawali # (komentar) akan diabaikan.
#   Baris-baris kosong akan diabaikan.
#   Tidak ada penanganan spesial untuk tanda kutip (tanda kutip akan menjadi bagian dari nilai pada ConfigMap).

# Mengunduh berkas-berkas sampel berikut ke dalam direktori `configure-pod-container/configmap/`
wget https://kubernetes.io/examples/configmap/game-env-file.properties -O configure-pod-container/configmap/game-env-file.properties

# Berkas env-file `game-env-file.properties` berisi sebagai berikut:
cat configure-pod-container/configmap/game-env-file.properties
enemies=aliens
lives=3
allowed="true"

# Komentar ini dan baris kosong di atasnya akan diabaikan.
```

```shell
kubectl create configmap game-config-env-file \
       --from-env-file=configure-pod-container/configmap/game-env-file.properties
```

akan menghasilkan ConfigMap sebagai berikut:

```shell
kubectl get configmap game-config-env-file -o yaml
```

dengan keluaran seperti berikut:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:36:28Z
  name: game-config-env-file
  namespace: default
  resourceVersion: "809965"
  uid: d9d1ca5b-eb34-11e7-887b-42010a8002b8
data:
  allowed: '"true"'
  enemies: aliens
  lives: "3"
```

{{< caution >}}
Ketika memasukkan `--from-env-file` beberapa kali untuk membuat sebuah ConfigMap dari beberapa sumber data, hanya env-file terakhir yang akan digunakan.
{{< /caution >}}

Contoh perilaku memasukkan `--from-env-file` beberapa kali didemonstrasikan dengan:

```shell
# Mengunduh berkas-berkas sampel berikut ke dalam direktori `configure-pod-container/configmap/` 
wget https://kubernetes.io/examples/configmap/ui-env-file.properties -O configure-pod-container/configmap/ui-env-file.properties

# Membuat configmap
kubectl create configmap config-multi-env-files \
        --from-env-file=configure-pod-container/configmap/game-env-file.properties \
        --from-env-file=configure-pod-container/configmap/ui-env-file.properties
```

akan menghasilkan ConfigMap sebagai berikut:

```shell
kubectl get configmap config-multi-env-files -o yaml
```

dengan keluaran seperti berikut:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2017-12-27T18:38:34Z
  name: config-multi-env-files
  namespace: default
  resourceVersion: "810136"
  uid: 252c4572-eb35-11e7-887b-42010a8002b8
data:
  color: purple
  how: fairlyNice
  textmode: "true"
```

#### Menentukan kunci yang akan digunakan ketika membuat ConfigMap dari sebuah berkas

Kamu dapat menentukan kunci selain dari nama berkas untuk digunakan pada bagian `data` pada ConfigMap yang kamu buat menggunakan argumen `--from-file`:

```shell
kubectl create configmap game-config-3 --from-file=<my-key-name>=<path-to-file>
```

di mana `<my-key-name>` merupakan kunci yang ingin kamu gunakan pada ConfigMap dan `<path-to-file>` merupakan lokasi dari berkas sumber data yang akan menjadi nilai dari kunci tersebut.

Sebagai contoh:

```shell
kubectl create configmap game-config-3 --from-file=game-special-key=configure-pod-container/configmap/game.properties
```

akan menghasilkan ConfigMap sebagai berikut:
```
kubectl get configmaps game-config-3 -o yaml
```

dengan keluaran seperti berikut:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T18:54:22Z
  name: game-config-3
  namespace: default
  resourceVersion: "530"
  uid: 05f8da22-d671-11e5-8cd0-68f728db1985
data:
  game-special-key: |
    enemies=aliens
    lives=3
    enemies.cheat=true
    enemies.cheat.level=noGoodRotten
    secret.code.passphrase=UUDDLRLRBABAS
    secret.code.allowed=true
    secret.code.lives=30
```

#### Membuat ConfigMap dari nilai harfiah

Kamu dapat menggunakan `kubectl create configmap` dengan argumen `--from-literal` untuk menentukan nilai harfiah dari baris perintah:

```shell
kubectl create configmap special-config --from-literal=special.how=very --from-literal=special.type=charm
```

Kamu dapat memasukkan beberapa pasang kunci-nilai. Tiap pasang yang dimasukkan pada _command line_ direpresentasikan sebagai sebuah entri terpisah pada bagian `data` dari ConfigMap.

```shell
kubectl get configmaps special-config -o yaml
```

Keluaran akan tampil seperti berikut:
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: special-config
  namespace: default
  resourceVersion: "651"
  uid: dadce046-d673-11e5-8cd0-68f728db1985
data:
  special.how: very
  special.type: charm
```

### Membuat ConfigMap dari generator
`kubectl` mendukung `kustomization.yaml` sejak versi 1.14.
Kamu juga dapat membuat ConfigMap dari generator lalu menggunakannya untuk membuat objek tersebut pada
peladen API. Generator
harus dituliskan pada `kustomization.yaml` dalam sebuah direktori.

#### Menghasilkan ConfigMap dari berkas
Sebagai contoh, untuk menghasilkan ConfigMap dari berkas `configure-pod-container/configmap/game.properties`
```shell
# Membuat berkas kustomization.yaml dengan ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-4
  files:
  - configure-pod-container/configmap/game.properties
EOF
```

Gunakan direktori kustomization untuk membuat objek ConfigMap.
```shell
kubectl apply -k .
configmap/game-config-4-m9dm2f92bt created
```

Kamu dapat melihat ConfigMap yang dihasilkan seperti berikut:

```shell
kubectl get configmap
NAME                       DATA   AGE
game-config-4-m9dm2f92bt   1      37s


kubectl describe configmaps/game-config-4-m9dm2f92bt
Name:         game-config-4-m9dm2f92bt
Namespace:    default
Labels:       <none>
Annotations:  kubectl.kubernetes.io/last-applied-configuration:
                {"apiVersion":"v1","data":{"game.properties":"enemies=aliens\nlives=3\nenemies.cheat=true\nenemies.cheat.level=noGoodRotten\nsecret.code.p...

Data
====
game.properties:
----
enemies=aliens
lives=3
enemies.cheat=true
enemies.cheat.level=noGoodRotten
secret.code.passphrase=UUDDLRLRBABAS
secret.code.allowed=true
secret.code.lives=30
Events:  <none>
```

Perlu diingat baha nama dari ConfigMap yang dihasilkan memiliki sufiks yang ditambahkan dengan melakukan _hashing_ terhadap konten dari ConfigMap tersebut. Hal ini memastikan bahwa
sebuah ConfigMap baru akan dihasilkan setiap kali konten dimodifikasi.

#### Menentukan kunci yang akan digunakan ketika generating ConfigMap dari sebuah berkas
Kamu dapat menentukan kunci selain nama berkas untuk digunakan pada generator ConfigMap.
Sebagai contoh, untuk menghasilkan sebuah ConfigMap dari berkas `configure-pod-container/configmap/game.properties`
dengan kunci `game-special-key`

```shell
# Membuat berkas kustomization.yaml dengan ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: game-config-5
  files:
  - game-special-key=configure-pod-container/configmap/game.properties
EOF
```

Gunakan direktori kustomization untuk membuat objek ConfigMap.
```shell
kubectl apply -k .
configmap/game-config-5-m67dt67794 created
```

#### Menghasilkan ConfigMap dari Nilai-nilai Harfiah
Untuk menghasilkan ConfigMap dari nilai-nilai harfiah `special.type=charm` dan `special.how=very`,
kamu dapat menentukan generator ConfigMap pada `kustomization.yaml` sebagai berikut
```shell
# Membuat berkas kustomization.yaml dengan ConfigMapGenerator
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: special-config-2
  literals:
  - special.how=very
  - special.type=charm
EOF
```
Gunakan direktori kustomization untuk membuat objek ConfigMap.
```shell
kubectl apply -k .
configmap/special-config-2-c92b5mmcf2 created
```

## Menentukan variabel _environment_ kontainer menggunakan data ConfigMap

### Menentukan variabel _environment_ kontainer dengan data dari sebuah ConfigMap

1.  Menentukan sebuah variabel _environment_ sebagai sepasang kunci-nilai pada ConfigMap:

    ```shell
    kubectl create configmap special-config --from-literal=special.how=very
    ```

2.  Memberikan nilai `special.how` yang sudah terdapat pada ConfigMap pada variabel _environment_ `SPECIAL_LEVEL_KEY` di spesifikasi Pod.

   {{% codenew file="pods/pod-single-configmap-env-variable.yaml" %}}

   Buat Pod:

 ```shell
 kubectl create -f https://kubernetes.io/id/examples/pods/pod-single-configmap-env-variable.yaml
 ```

   Sekarang, keluaran dari Pod meliputi variabel _environment_ `SPECIAL_LEVEL_KEY=very`.

### Menentukan variabel _environment_ kontainer dengan data dari beberapa ConfigMap

 * Seperti pada contoh sebelumnya, buat ConfigMap terlebih dahulu.

   {{% codenew file="configmap/configmaps.yaml" %}}

   Buat ConfigMap:

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmaps.yaml
 ```

* Tentukan variabel _environment_ pada spesifikasi Pod.

  {{% codenew file="pods/pod-multiple-configmap-env-variable.yaml" %}}

  Buat Pod:

 ```shell
 kubectl create -f https://kubernetes.io/id/examples/pods/pod-multiple-configmap-env-variable.yaml
 ```

  Sekarang, keluaran Pod meliputi variabel _environment_ `SPECIAL_LEVEL_KEY=very` dan `LOG_LEVEL=INFO`.

## Mengatur semua pasangan kunci-nilai pada ConfigMap sebagai variabel _environment_ kontainer

{{< note >}}
Fungsi ini tersedia pada Kubernetes v1.6 dan selanjutnya.
{{< /note >}}

* Buat ConfigMap yang berisi beberapa pasangan kunci-nilai.

  {{% codenew file="configmap/configmap-multikeys.yaml" %}}

  Buat ConfigMap:

 ```shell
 kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
 ```

* Gunakan `envFrom` untuk menentukan seluruh data pada ConfigMap sebagai variabel _environment_ kontainer. Kunci dari ConfigMap akan menjadi nama variabel _environment_ di dalam Pod.

 {{% codenew file="pods/pod-configmap-envFrom.yaml" %}}

 Buat Pod:

 ```shell
 kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-envFrom.yaml
 ```

 Sekarang, Pod keluaran pod meliputi variabel _environment_ `SPECIAL_LEVEL=very` dan `SPECIAL_TYPE=charm`.


## Menggunakan variabel _environment_ yang ditentukan ConfigMap pada perintah Pod 

Kamu dapat menggunakan variabel _environment_ yang ditentukan ConfigMap pada bagian `command` dari spesifikasi Pod menggunakan sintaks substitusi Kubernetes `$(VAR_NAME)`.

Sebagai contoh, spesifikasi Pod berikut

{{% codenew file="pods/pod-configmap-env-var-valueFrom.yaml" %}}

dibuat dengan menjalankan

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-env-var-valueFrom.yaml
```

menghasilkan keluaran pada kontainer `test-container` seperti berikut:
```shell
kubectl logs dapi-test-pod
```

```shell
very charm
```

## Menambahkan data ConfigMap pada Volume

Seperti yang sudah dijelaskan pada [Membuat ConfigMap dari berkas](#membuat-configmap-dari-berkas), ketika kamu membuat ConfigMap menggunakan ``--from-file``, nama dari berkas tersebut akan menjadi kunci yang disimpan pada bagian `data` dari ConfigMap. Isi berkas tersebut akan menjadi nilai dari kunci tersebut.

Contoh pada bagian ini merujuk pada ConfigMap bernama `special-config`, Seperti berikut.

{{% codenew file="configmap/configmap-multikeys.yaml" %}}

Buat ConfigMap:

```shell
kubectl create -f https://kubernetes.io/examples/configmap/configmap-multikeys.yaml
```

### Mengisi Volume dengan data yang disimpan Pada ConfigMap

Tambahkan nama ConfigMap di bawah bagian `volumes` pada spesifikasi Pod.
Hal ini akan menambahkan data ConfigMap pada direktori yang ditentukan oleh `volumeMounts.mountPath` (pada kasus ini, `/etc/config`).
Bagian `command` berisi daftar berkas pada direktori dengan nama-nama yang sesuai dengan kunci-kunci pada ConfigMap.

{{% codenew file="pods/pod-configmap-volume.yaml" %}}

Buat Pod:

```shell
kubectl create -f https://kubernetes.io/i/examples/pods/pod-configmap-volume.yaml
```

Ketika Pod berjalan, perintah `ls /etc/config/` akan menghasilkan keluaran di bawah:

```shell
SPECIAL_LEVEL
SPECIAL_TYPE
```

{{< caution >}}
Jika ada beberapa berkas pada direktori `/etc/config/`, berkas-berkas tersebut akan dihapus.
{{< /caution >}}

### Menambahkan data ConfigMap pada jalur tertentu pada Volume

Gunakan kolom `path` untuk menentukan jalur berkas yang diinginkan untuk butir tertentu pada ConfigMap (butir ConfigMap tertentu).
Pada kasus ini, butir `SPECIAL_LEVEL` akan akan dipasangkan sebagai `config-volume` pada `/etc/config/keys`.

{{% codenew file="pods/pod-configmap-volume-specific-key.yaml" %}}

Buat Pod:

```shell
kubectl create -f https://kubernetes.io/examples/pods/pod-configmap-volume-specific-key.yaml
```

Ketika Pod berjalan, perintah `cat /etc/config/keys` akan menghasilkan keluaran di bawah:

```shell
very
```

{{< caution >}}
Seperti sebelumnya, semua berkas yang sebelumnya berada pada direktori `/etc/config/` akan dihapus.
{{< /caution >}}

### Memproyeksikan kunci ke jalur dan perizinan berkas tertentu

Kamu dapat memproyeksikan kunci ke jalur dan perizinan tertentu pada setiap
berkas. Panduan pengguna [Secret](/id/docs/concepts/configuration/secret/#using-secrets-as-files-from-a-pod) menjelaskan mengenai sintaks-sintaksnya.

### ConfigMap yang dipasang akan diperbarui secara otomatis

Ketika sebuah ConfigMap yang sudah dipasang pada sebuah volume diperbarui, kunci-kunci yang diproyeksikan akan turut diperbarui. Kubelet akan memeriksa apakah ConfigMap yang dipasang merupakan yang terbaru pada sinkronisasi berkala. Namun, ConfigMap menggunakan _cache_ lokal berbasis ttl (_time-to-live_) miliknya untuk mendapatkan nilai dari ConfigMap saat ini. Hasilnya, keseluruhan penundaan dari saat ketika ConfigMap diperbarui sampai saat ketika kunci-kunci baru diproyeksikan ke pada Pod bisa selama periode sinkronisasi kubelet (secara bawaan selama 1 menit) + ttl dari _cache_ ConfigMap (secara bawaan selama 1 menit) pada kubelet. Kamu dapat memicu pembaruan langsung dengan memperbarui salah satu dari anotasi Pod.

{{< note >}}
Kontainer yang menggunakan ConfigMap sebagai volume [subPath](/id/docs/concepts/storage/volumes/#using-subpath) tidak akan menerima pembaruan ConfigMap.
{{< /note >}}



<!-- discussion -->

## Memahami ConfigMap dan Pod

Sumber daya API ConfigMap menyimpan data konfigurasi sebagai pasangan kunci-nilai. Data tersebut dapat dikonsumsi oleh Pod atau sebagai penyedia konfigurasi untuk komponen-komponen sistem seperti kontroler. ConfigMap mirip dengan [Secret](/id/docs/concepts/configuration/secret/), tetapi ConfigMap dimaksudkan untuk mengolah tulisan yang tidak memiliki informasi yang sensitif. Baik pengguna maupun komponen sistem dapat menyimpan data konfigurasi pada ConfigMap.

{{< note >}}
ConfigMap harus mereferensikan berkas-berkas properti, bukan menggantikannya. Anggaplah ConfigMap sebagai sesuatu yang merepresentasikan direktori `/etc` beserta isinya pada Linux. Sebagai contoh, jika kamu membuat sebuah [Volume Kubernetes](/id/docs/concepts/storage/volumes/) dari ConfigMap, tiap butir data pada ConfigMap direpresentasikan sebagai sebuah berkas pada volume.
{{< /note >}}

Kolom `data` pada ConfigMap berisi data konfigurasi. Seperti pada contoh di bawah, hal ini bisa berupa sesuatu yang sederhana -- seperti properti individual yang ditentukan menggunakan `--from-literal` -- atau sesuatu yang kompleks -- seperti berkas konfigurasi atau _blob_ JSON yang ditentukan dengan `--from-file`.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  creationTimestamp: 2016-02-18T19:14:38Z
  name: example-config
  namespace: default
data:
  # contoh properti yang sederhana yang ditentukan menggunakan --from-literal
  example.property.1: hello
  example.property.2: world
  # contoh properti yang kompleks yang ditentukan menggunakan --from-file
  example.property.file: |-
    property.1=value-1
    property.2=value-2
    property.3=value-3
```

### Batasan

- Kamu harus membuat ConfigMap sebelum merujuknya pada spesifikasi Pod (kecuali kamu menandai ConfigMap sebagai "_optional_"). Jika kamu merujuk sebuah ConfigMap yang tidak ada, Pod tersebut tidak akan berjalan. Sama halnya, mereferensikan kunci yang tidak ada pada ConfigMap akan mencegah Pod untuk berjalan.

- Jika kamu menggunakan `envFrom` untuk menentukan variabel _environment_ dari ConfigMap, kunci-kunci yang dianggap tidak sah akan dilewat. Pod akan diizinkan untuk berjalan, tetapi nama-nama yang tidak sah akan direkam pada _event log_ (`InvalidVariableNames`). Pesan _log_ tersebut mencantumkan tiap kunci yang dilewat. Sebagai contoh:

   ```shell
   kubectl get events
   ```

   Keluaran akan tampil seperti berikut:
   ```
   LASTSEEN FIRSTSEEN COUNT NAME          KIND  SUBOBJECT  TYPE      REASON                            SOURCE                MESSAGE
   0s       0s        1     dapi-test-pod Pod              Warning   InvalidEnvironmentVariableNames   {kubelet, 127.0.0.1}  Keys [1badkey, 2alsobad] from the EnvFrom configMap default/myconfig were skipped since they are considered invalid environment variable names.
   ```

- ConfigMap berada pada {{< glossary_tooltip term_id="namespace" >}} tertentu. ConfigMap hanya dapat dirujuk oleh Pod yang berada pada Namespace yang sama.

- Kamu tidak dapat menggunakan ConfigMap untuk {{< glossary_tooltip text="Pod statis" term_id="static-pod" >}}, karena Kubelet tidak mendukung hal ini.



## {{% heading "whatsnext" %}}

* Ikuti contoh penerapan pada dunia nyata [Mengatur Redis menggunakan ConfigMap](/docs/tutorials/configuration/configure-redis-using-configmap/).


