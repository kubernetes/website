---
title: Secret
content_type: concept
feature:
  title: Secret dan manajemen konfigurasi
  description: >
    Menerapkan serta mengubah secret serta konfigurasi aplikasi tanpa melakukan perubahan pada image kamu serta mencegah tereksposnya secret yang kamu miliki pada konfigurasi.
weight: 50
---


<!-- overview -->

Objek `secret` pada Kubernetes mengizinkan kamu menyimpan dan mengatur informasi yang sifatnya sensitif, seperti
_password_, token OAuth, dan ssh _keys_. Menyimpan informasi yang sifatnya sensitif ini ke dalam `secret`
cenderung lebih aman dan fleksible jika dibandingkan dengan menyimpan informasi tersebut secara apa adanya pada definisi {{< glossary_tooltip term_id="pod" >}} atau di dalam {{< glossary_tooltip text="container image" term_id="image" >}}.
Silahkan lihat [Dokumen desain Secret](https://git.k8s.io/community/contributors/design-proposals/auth/secrets.md) untuk informasi yang sifatnya mendetail.



<!-- body -->

## Ikhtisar Secret

Sebuah Secret merupakan sebuah objek yang mengandung informasi yang sifatnya
sensitif, seperti _password_, token, atau _key_. Informasi tersebut sebenarnya bisa saja
disimpan di dalam spesifikasi Pod atau _image_; meskipun demikian, melakukan penyimpanan
di dalam objek Secret mengizinkan pengguna untuk memiliki kontrol lebih lanjut mengenai
bagaimana Secret ini disimpan, serta mencegah tereksposnya informasi sensitif secara
tidak disengaja.

Baik pengguna dan sistem memiliki kemampuan untuk membuat objek Secret.

Untuk menggunakan Secret, sebuah Pod haruslah merujuk pada Secret tersebut.
Sebuah Secret dapat digunakan di dalam sebuah Pod melalui dua cara:
sebagai _file_ yang ada di dalam _volume_ {{< glossary_tooltip text="volume" term_id="volume" >}}
yang di-_mount_ pada salah satu container Pod, atau digunakan oleh kubelet
ketika menarik _image_ yang digunakan di dalam Pod.

### Secret _Built-in_

#### Sebuah _Service Account_ akan Secara Otomatis Dibuat dan Meng-_attach_ Secret dengan Kredensial API

Kubernetes secara otomatis membuat secret yang mengandung kredensial
yang digunakan untuk mengakses API, serta secara otomatis memerintahkan Pod untuk menggunakan
Secret ini.

Mekanisme otomatisasi pembuatan secret dan penggunaan kredensial API dapat di nonaktifkan
atau di-_override_ jika kamu menginginkannya. Meskipun begitu, jika apa yang kamu butuhkan
hanyalah mengakses apiserver secara aman, maka mekanisme _default_ inilah yang disarankan.

Baca lebih lanjut dokumentasi [_Service Account_](/id/docs/tasks/configure-pod-container/configure-service-account/)
untuk informasi lebih lanjut mengenai bagaimana cara kerja _Service Account_.

### Membuat Objek Secret Kamu Sendiri

#### Membuat Secret dengan Menggunakan kubectl

Misalnya saja, beberapa Pod memerlukan akses ke sebuah basis data. Kemudian _username_
dan _password_ yang harus digunakan oleh Pod-Pod tersebut berada pada mesin lokal kamu
dalam bentuk _file-file_ `./username.txt` dan `./password.txt`.

```shell
# Buatlah berkas yang selanjutnya akan digunakan pada contoh-contoh selanjutnya
echo -n 'admin' > ./username.txt
echo -n '1f2d1e2e67df' > ./password.txt
```

Perintah `kubectl create secret` akan mengemas _file-file_ ini menjadi Secret dan
membuat sebuah objek pada Apiserver.

```shell
kubectl create secret generic db-user-pass --from-file=./username.txt --from-file=./password.txt
```
```
secret "db-user-pass" created
```
{{< note >}}
Karakter spesial seperti `$`, `\*`, and `!` membutuhkan mekanisme _escaping_.
Jika _password_ yang kamu gunakan mengandung karakter spesial, kamu perlu melakukan _escape_ karakter dengan menggunakan karakter `\\`. Contohnya, apabila _password_ yang kamu miliki adalah `S!B\*d$zDsb`, maka kamu harus memanggil perintah kubectl dengan cara berikut:
     kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password=S\\!B\\\\*d\\$zDsb
 Perhatikan bahwa kamu tidak perlu melakukan _escape_ karakter apabila massukan yang kamu berikan merupakan _file_ (`--from-file`).
{{< /note >}}

Kamu dapat memastikan apakah suatu Secret sudah dibuat atau belum dengan menggunakan perintah:

```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
db-user-pass          Opaque                                2         51s
```
```shell
kubectl describe secrets/db-user-pass
```
```
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

{{< note >}}
Perintah-perintah `kubectl get` dan `kubectl describe` secara _default_ akan
mencegah ditampilkannya informasi yang ada di dalam Secret.
Hal ini dilakukan untuk melindungi agar Secret tidak terekspos secara tidak disengaja oleh orang lain,
atau tersimpan di dalam _log_ _terminal_.
{{< /note >}}

Kamu dapat membaca [bagaimana cara melakukan _decode_ sebuah secret](#decoding-a-secret)
untuk mengetahui bagaimana cara melihat isi dari Secret.

#### Membuat Secret Secara Manual

Kamu dapat membuat sebuah Secret dengan terlebih dahulu membuat _file_ yang berisikan
informasi yang ingin kamu jadikan Secret dalam bentuk yaml atau json dan kemudian membuat objek
dengan menggunakan _file_ tersebut. [Secret](/docs/reference/generated/kubernetes-api/v1.12/#secret-v1-core)
mengandung dua buah _map_: _data_ dan _stringData_. _Field_ _data_ digunakan untuk menyimpan sembarang data,
yang di-_encode_ menggunakan base64. Sementara itu _stringData_ disediakan untuk memudahkan kamu untuk menyimpan
informasi sensitif dalam format yang tidak di-_encode_.

Sebagai contoh, untuk menyimpan dua buah string di dalam Secret dengan menggunakan _field_ data, ubahlah
informasi tersebut ke dalam base64 dengan menggunakan mekanisme sebagai berikut:

```shell
echo -n 'admin' | base64
YWRtaW4=
echo -n '1f2d1e2e67df' | base64
MWYyZDFlMmU2N2Rm
```

Buatlah sebuah Secret yang memiliki bentuk sebagai berikut:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

Kemudian buatlah Secret menggunakan perintah [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands#apply):

```shell
kubectl apply -f ./secret.yaml
```
```
secret "mysecret" created
```

Untuk beberapa skenario, kamu bisa saja ingin menggunakan opsi _field_ stringData.
_Field_ ini mengizinkan kamu untuk memberikan masukan berupa informasi yang belum di-_encode_ secara langsung
pada sebuah Secret, informasi dalam bentuk string ini kemudian akan di-_encode_ ketika Secret dibuat maupun diubah.

Contoh praktikal dari hal ini adalah ketika kamu melakukan proses _deploy_ aplikasi
yang menggunakan Secret sebagai penyimpanan _file_ konfigurasi, dan kamu ingin mengisi
bagian dari konfigurasi _file_ tersebut ketika aplikasi di_deploy_.

Jika kamu ingin aplikasi kamu menggunakan _file_ konfigurasi berikut:

```yaml
apiUrl: "https://my.api.com/api/v1"
username: "user"
password: "password"
```

Kamu dapat menyimpan Secret ini dengan menggunakan cara berikut:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
stringData:
  config.yaml: |-
    apiUrl: "https://my.api.com/api/v1"
    username: {{username}}
    password: {{password}}
```

Alat _deployment_ yang kamu gunakan kemudian akan mengubah templat variabel `{{username}}` dan `{{password}}`
sebelum menjalankan perintah `kubectl apply`.

stringData merupakan _field_ yang sifatnya _write-only_ untuk alasan kenyamanan pengguna.
_Field_ ini tidak pernah ditampilkan ketika Secret dibaca. Sebagai contoh, misalkan saja kamu menjalankan
perintah sebagai berikut:

```shell
kubectl get secret mysecret -o yaml
```

Keluaran yang diberikan kurang lebih akan ditampilkan sebagai berikut:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:40:59Z
  name: mysecret
  namespace: default
  resourceVersion: "7225"
  selfLink: /api/v1/namespaces/default/secrets/mysecret
  uid: c280ad2e-e916-11e8-98f2-025000000001
type: Opaque
data:
  config.yaml: YXBpVXJsOiAiaHR0cHM6Ly9teS5hcGkuY29tL2FwaS92MSIKdXNlcm5hbWU6IHt7dXNlcm5hbWV9fQpwYXNzd29yZDoge3twYXNzd29yZH19
```

Jika sebuah _field_ dispesifikasikan dalam bentuk data maupun stringData,
maka nilai dari stringData-lah yang akan digunakan. Sebagai contoh, misalkan saja terdapat
definisi Secret sebagai berikut:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
stringData:
  username: administrator
```

Akan menghasilkan Secret sebagai berikut:

```yaml
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2018-11-15T20:46:46Z
  name: mysecret
  namespace: default
  resourceVersion: "7579"
  selfLink: /api/v1/namespaces/default/secrets/mysecret
  uid: 91460ecb-e917-11e8-98f2-025000000001
type: Opaque
data:
  username: YWRtaW5pc3RyYXRvcg==
```

Dimana string `YWRtaW5pc3RyYXRvcg==` akan di-_decode_ sebagai `administrator`.

_Key_ dari data dan stringData yang boleh tersusun atas karakter alfanumerik,
'-', '_' atau '.'.

**Catatan _Encoding_:** _Value_ dari JSON dan YAML yang sudah diseriakisasi dari data Secret
akan di-_encode_ ke dalam string base64. _Newline_ dianggap tidak valid pada string ini dan harus
dihilangkan. Ketika pengguna Darwin/macOS menggunakan alat `base64`, maka pengguna
tersebut harus menghindari opsi `-b` yang digunakan untuk memecah baris yang terlalu panjang.
Sebaliknya pengguna Linux _harus_ menambahkan opsi `-w 0` pada perintah `base64` atau
melakukan mekanisme _pipeline_ `base64 | tr -d '\n'` jika tidak terdapat opsi `-w`.

#### Membuat Secret dengan Menggunakan _Generator_
Kubectl mendukung [mekanisme manajemen objek dengan menggunakan Kustomize](/docs/tasks/manage-kubernetes-objects/kustomization/)
sejak versi 1.14. Dengan fitur baru ini, kamu juga dapat membuat sebuah Secret dari sebuah _generator_ 
dan kemudian mengaplikasikannya untuk membuat sebuah objek pada Apiserver. _Generator_ yang digunakan haruslah 
dispesifikasikan di dalam sebuah _file_ `kustomization.yaml` di dalam sebuah direktori.

Sebagai contoh, untuk menghasilan sebuah Secret dari _file-file_ `./username.txt` dan `./password.txt`
```shell
# Membuat sebuah berkas kustomization.yaml dengan SecretGenerator
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  files:
  - username.txt
  - password.txt
EOF
```
Gunakan direktori _kustomization_ untuk membuat objek Secret yang diinginkan.
```shell
$ kubectl apply -k .
secret/db-user-pass-96mffmfh4k created
```

Kamu dapat memastikan Secret tersebut sudah dibuat dengan menggunakan perintah berikut:

```shell
$ kubectl get secrets
NAME                             TYPE                                  DATA      AGE
db-user-pass-96mffmfh4k          Opaque                                2         51s

$ kubectl describe secrets/db-user-pass-96mffmfh4k
Name:            db-user-pass
Namespace:       default
Labels:          <none>
Annotations:     <none>

Type:            Opaque

Data
====
password.txt:    12 bytes
username.txt:    5 bytes
```

Sebagai contoh, untuk membuat sebuah Secret dari literal `username=admin` dan `password=secret`,
kamu dapat menspesifikasikan _generator_ Secret pada _file_ `kustomization.yaml` sebagai
```shell
# Membuat sebuah berkas kustomization.yaml dengan menggunakan SecretGenerator
$ cat <<EOF >./kustomization.yaml
secretGenerator:
- name: db-user-pass
  literals:
  - username=admin
  - password=secret
EOF
```
Aplikasikan direktori _kustomization_ untuk membuat objek Secret.
```shell
$ kubectl apply -k .
secret/db-user-pass-dddghtt9b5 created
```
{{< note >}}
Secret yang dihasilkan nantinya akan memiliki tambahan sufix dengan cara melakukan teknik _hashing_ 
pada isi Secret tersebut. Hal ini dilakukan untuk menjamin dibuatnya sebuah Secret baru setiap kali terjadi 
perubahan isi dari Secret tersebut.
{{< /note >}}

#### Melakukan Proses _Decode_ pada Secret

Secret dapat dibaca dengan menggunakan perintah `kubectl get secret`. 
Misalnya saja, untuk membaca Secret yang dibuat pada bagian sebelumya:

```shell
kubectl get secret mysecret -o yaml
```
```
apiVersion: v1
kind: Secret
metadata:
  creationTimestamp: 2016-01-22T18:41:56Z
  name: mysecret
  namespace: default
  resourceVersion: "164619"
  selfLink: /api/v1/namespaces/default/secrets/mysecret
  uid: cfee02d6-c137-11e5-8d73-42010af00002
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

Kemudian lakukan mekanisme _decode_ _field_ _password_:

```shell
echo 'MWYyZDFlMmU2N2Rm' | base64 --decode
```
```
1f2d1e2e67df
```

## Menggunakan Secret

Secret dapat di-_mount_ sebagai _volume_ data atau dapat diekspos sebagai {{< glossary_tooltip text="variabel-variabel environment" term_id="container-env-variables" >}}
dapat digunakan di dalam Pod. Secret ini juga dapat digunakan secara langsug 
oleh bagian lain dari sistem, tanpa secara langsung berkaitan dengan Pod. 
Sebagai contoh, Secret dapat berisikan kredensial bagian suatu sistem lain yang digunakan 
untuk berinteraksi dengan sistem eksternal yang kamu butuhkan.

### Menggunakan Secret sebagai _File_ melalui Pod

Berikut adalah langkah yang harus kamu penuhi agar kamu dapat menggunakan Secret di dalam _volume_ dalam sebuah Pod:

1. Buatlah sebuah Secret, atau gunakan sebuah Secret yang sudah kamu buat sebelumnya. Beberapa Pod dapat merujuk pada sebuah Secret yang sama.
1. Modifikasi definisi Pod kamu dengan cara menambahkan sebuah _volume_ di bawah `.spec.volumes[]`.  Berilah _volume_ tersebut nama, dan pastikan _field_ `.spec.volumes[].secret.secretName` merujuk pada nama yang sama dengan objek secret.
1. Tambahkan _field_ `.spec.containers[].volumeMounts[]` pada setiap container yang membutuhkan Secret.  Berikan spesifikasi `.spec.containers[].volumeMounts[].readOnly = true` dan `.spec.containers[].volumeMounts[].mountPath` pada direktori dimana Secret tersebut diletakkan.
1. Modifikasi image dan/atau _command line_ kamu agar program yang kamu miliki merujuk pada _file_ di dalam direktori tersebut. Setiap _key_ pada map `data` Secret akan menjadi nama dari sebuah _file_ pada `mountPath`.

Berikut merupakan salah satu contoh dimana sebuah Pod melakukan proses _mount_ Secret pada sebuah _volume_:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
```

Setiap Secret yang ingin kamu gunakan harus dirujuk pada _field_ `.spec.volumes`.

Jika terdapat lebih dari satu container di dalam Pod, 
maka setiap container akan membutuhkan blok `volumeMounts`-nya masing-masing, 
meskipun demikian hanya sebuah _field_ `.spec.volumes`  yang dibutuhkan untuk setiap Secret.

Kamu dapat menyimpan banyak _file_ ke dalam satu Secret, 
atau menggunakan banyak Secret, hal ini tentunya bergantung pada preferensi pengguna.

**Proyeksi _key_ Secret pada Suatu _Path_ Spesifik**

Kita juga dapat mengontrol _path_ di dalam _volume_ di mana sebuah Secret diproyeksikan. 
Kamu dapat menggunakan _field_ `.spec.volumes[].secret.items` untuk mengubah 
_path_ target dari setiap _key_:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
```

Apa yang akan terjadi jika kita menggunakan definisi di atas:

* Secret `username` akan disimpan pada _file_ `/etc/foo/my-group/my-username` dan bukan `/etc/foo/username`.
* Secret `password` tidak akan diproyeksikan.

Jika _field_ `.spec.volumes[].secret.items` digunakan, hanya _key-key_ yang dispesifikan di dalam 
`items` yang diproyeksikan. Untuk mengonsumsi semua _key-key_ yang ada dari Secret, 
semua _key_ yang ada harus didaftarkan pada _field_ `items`.
Semua _key_ yang didaftarkan juga harus ada di dalam Secret tadi. 
Jika tidak, _volume_ yang didefinisikan tidak akan dibuat.

**_Permission_ _File-File_ Secret**

Kamu juga dapat menspesifikasikan mode _permission_ dari _file_ Secret yang kamu inginkan. 
Jika kamu tidak menspesifikasikan hal tersebut, maka nilai _default_ yang akan diberikan adalah `0644` is used by default. 
Kamu dapat memberikan mode _default_ untuk semua Secret yang ada serta melakukan mekanisme _override_ _permission_ 
pada setiap _key_ jika memang diperlukan.

Sebagai contoh, kamu dapat memberikan spesifikasi mode _default_ sebagai berikut:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      defaultMode: 256
```

Kemudian, sebuah Secret akan di-_mount_ pada `/etc/foo`, selanjutnya semua _file_ 
yang dibuat pada _volume_ secret tersebut akan memiliki _permission_ `0400`.

Perhatikan bahwa spesifikasi JSON tidak mendukung notasi _octal_, dengan demikian gunakanlah 
_value_ 256 untuk _permission_ 0400. Jika kamu menggunakan format YAML untuk spesifikasi Pod, 
kamu dapat menggunakan notasi _octal_ untuk memberikan spesifikasi _permission_ dengan cara yang lebih 
natural.

Kamu juga dapat melakukan mekanisme pemetaan, seperti yang sudah dilakukan pada contoh sebelumnya, 
dan kemudian memberikan spesifikasi _permission_ yang berbeda untuk _file_ yang berbeda.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
  volumes:
  - name: foo
    secret:
      secretName: mysecret
      items:
      - key: username
        path: my-group/my-username
        mode: 511
```

Pada kasus tersebut, _file_ yang dihasilkan pada `/etc/foo/my-group/my-username` akan memiliki 
_permission_ `0777`. Karena terdapat batasan pada representasi JSON, maka kamu 
harus memberikan spesifikasi mode _permission_ dalam bentuk notasi desimal.

Perhatikan bahwa _permission_ ini bida saja ditampilkan dalam bentuk notasi desimal, 
hal ini akan ditampilkan pada bagian selanjutnya.

**Mengonsumsi _Value_ dari Secret melalui Volume**

Di dalam sebuah container dimana _volume_ secret di-_mount_, 
_key_ dari Secret akan ditampilkan sebagai _file_ dan _value_ dari Secret yang berada dalam bentuk 
base64 ini akan di-_decode_ dam disimpan pada _file-file_ tadi. 
Berikut merupakan hasil dari eksekusi perintah di dalam container berdasarkan contoh 
yang telah dipaparkan di atas:

```shell
ls /etc/foo/
```
```
username
password
```

```shell
cat /etc/foo/username
```
```
admin
```


```shell
cat /etc/foo/password
```
```
1f2d1e2e67df
```

Program di dalam container bertanggung jawab untuk membaca Secret 
dari _file-file_ yang ada.

**Secret yang di-_mount_ Akan Diubah Secara Otomatis**

Ketika sebuah Secret yang sedang digunakan di dalam _volume_ diubah, 
maka _key_ yang ada juga akan diubah. Kubelet akan melakukan mekanisme pengecekan secara periodik 
apakah  terdapat perubahan pada Secret yang telah di-_mount_. Meskipun demikian, 
proses pengecekan ini dilakukan dengan menggunakan _cache_ lokal untuk mendapatkan _value_ saat ini 
dari sebuah Secret. Tipe _cache_ yang ada dapat diatur dengan menggunakan 
(_field_ `ConfigMapAndSecretChangeDetectionStrategy` pada
[KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/)).
Mekanisme ini kemudian dapat diteruskan dengan mekanisme _watch_(_default_), ttl, atau melakukan pengalihan semua 
_request_ secara langsung pada kube-apiserver.
Sebagai hasilnya, _delay_ total dari pertama kali Secret diubah hingga dilakukannya mekanisme 
proyeksi _key_ yang baru pada Pod berlangsung dalam jangka waktu sinkronisasi periodik kubelet + 
_delay_ propagasi _cache_, dimana _delay_ propagasi _cache_ bergantung pada jenis _cache_ yang digunakan 
(ini sama dengan _delay_ propagasi _watch_, ttl dari _cache_, atau nol).

{{< note >}}
Sebuah container menggunakan Secret sebagai
[subPath](/id/docs/concepts/storage/volumes#using-subpath) dari _volume_ 
yang di-_mount_ tidak akan menerima perubahan Secret.
{{< /note >}}

### Menggunakan Secret sebagai Variabel _Environment_

Berikut merupakan langkah-langkah yang harus kamu terapkan, 
untuk menggunakan secret sebagai {{< glossary_tooltip text="variabel _environment_" term_id="container-env-variables" >}}
pada sebuah Pod:

1. Buatlah sebuah Secret, atau gunakan sebuah Secret yang sudah kamu buat sebelumnya. Beberapa Pod dapat merujuk pada sebuah Secret yang sama.
1. Modifikasi definisi Pod pada setiap container dimana kamu menginginkan container tersebut dapat mengonsumsi your Pod definition in each container that you wish to consume the value of a secret key to add an environment variabele for each secret key you wish to consume.  The environment variabele that consumes the secret key should populate the secret's name and key in `env[].valueFrom.secretKeyRef`.
1. Modifikasi _image_ dan/atau _command line_ kamu agar program yang kamu miliki merujuk pada _value_ yang sudah didefinisikan pada variabel _environment_.

Berikut merupakan contoh dimana sebuah Pod menggunakan Secret sebagai variabel _environment_:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-env-pod
spec:
  containers:
  - name: mycontainer
    image: redis
    env:
      - name: SECRET_USERNAME
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: username
      - name: SECRET_PASSWORD
        valueFrom:
          secretKeyRef:
            name: mysecret
            key: password
  restartPolicy: Never
```

**Menggunakan Secret dari Variabel _Environment_**

Di dalam sebuah container yang mengkonsumsi Secret pada sebuah variabel _environment_, _key_ dari sebuah secret 
akan ditampilkan sebagai variabel _environment_ pada umumnya dengan _value_ berupa informasi yang telah di-_decode_ 
ke dalam base64. Berikut merupakan hasil yang didapatkan apabila perintah-perintah di bawah ini 
dijalankan dari dalam container yang didefinisikan di atas:

```shell
echo $SECRET_USERNAME
```
```
admin
```
```shell
echo $SECRET_PASSWORD
```
```
1f2d1e2e67df
```

### Menggunakan imagePullSecrets

Sebuah `imagePullSecret` merupakan salah satu cara yang dapat digunakan untuk menempatkan secret 
yang mengandung _password_ dari registri Docker (atau registri _image_ lainnya) 
pada Kubelet, sehingga Kubelet dapat mengunduh _image_ dan menempatkannya pada Pod.

**Memberikan spesifikasi manual dari sebuah imagePullSecret**

Penggunaan imagePullSecrets dideskripsikan di dalam [dokumentasi _image_](/id/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)

### Mekanisme yang Dapat Diterapkan agar imagePullSecrets dapat Secara Otomatis Digunakan

Kamu dapat secara manual membuat sebuah imagePullSecret, serta merujuk imagePullSecret 
yang sudah kamu buat dari sebuah serviceAccount. Semua Pod yang dibuat dengan menggunakan 
serviceAccount tadi atau serviceAccount _default_ akan menerima _field_ imagePullSecret dari 
serviceAccount yang digunakan.
Bacalah [Cara menambahkan ImagePullSecrets pada sebuah _service account_](/id/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account) 
untuk informasi lebih detail soal proses yang dijalankan.

### Mekanisme _Mounting_ Otomatis dari Secret yang Sudah Dibuat

Secret yang dibuat secara manual (misalnya, secret yang mengandung token yang dapat digunakan 
untuk mengakses akun GitHub) dapat di-_mount_ secara otomatis pada sebuah Pod berdasarkan _service account_ 
yang digunakan oleh Pod tadi.
Baca [Bagaimana Penggunaan PodPreset untuk Memasukkan Informasi ke Dalam Pod](/docs/tasks/inject-data-application/podpreset/) untuk informasi lebih lanjut.

## Detail

### Batasan-Batasan

Sumber dari _secret volume_ akan divalidasi untuk menjamin rujukan pada 
objek yang dispesifikasikan mengarah pada objek dengan _type_ `Secret`. 
Oleh karenanya, sebuah _secret_ harus dibuat sebelum Pod yang merujuk pada _secret_ 
tersebut dibuat.

Sebuah objek API Secret berada di dalam sebuah {{< glossary_tooltip text="namespace" term_id="namespace" >}}.
Objek-objek ini hanya dapat dirujuk oleh Pod-Pod yang ada pada namespace yang sama.

Secret memiliki batasi dalam hal ukuran maksimalnya yaitu hanya sampai 1MiB per objek. 
Oleh karena itulah, pembuatan secret dalam ukuran yang sangat besar tidak dianjurkan 
karena dapat menghabiskan sumber daya apiserver dan memori kubelet. Meskipun demikian, 
pembuatan banyak secret dengan ukuran kecil juga dapat menhabiskan memori. Pembatasan 
sumber daya yang diizinkan untuk pembuatan secret merupakan salah satu fitur tambahan 
yang direncanakan kedepannya.

Kubelet hanya mendukung penggunaan secret oleh Pod apabila Pod tersebut 
didapatkan melalui apiserver. Hal ini termasuk Pod yang dibuat dengan menggunakan 
kubectl, atau secara tak langsung melalui _replication controller_. Hal ini tidak 
termasuk Pod yang dibuat melalui _flag_ `--manifest-url` yang ada pada kubelet, 
maupun REST API yang disediakan (hal ini bukanlah merupakan mekanisme umum yang dilakukan 
untuk membuat sebuah Pod).

Secret harus dibuat sebelum digunakan oleh Pod sebagai variabel _environment_, 
kecuali apabila variabel _environment_ ini dianggap opsional. Rujukan pada Secret 
yang tidak dapat dipenuhi akan menyebabkan Pod gagal _start_.

Rujukan melalui `secretKeyRef` pada _key_ yang tidak ada pada _named_ Secret 
akan akan menyebabkan Pod gagal _start_.

Secret yang digunakan untuk memenuhi variabel _environment_ melalui `envFrom` yang 
memiliki _key_ yang dianggap memiliki penamaan yang tidak valid akan diabaikan. 
Hal ini akan akan menyebabkan Pod gagal _start_. Selanjutnya akan terdapat _event_ 
dengan alasan `InvalidvariabeleNames` dan pesan yang berisikan _list_ dari 
_key_ yang diabaikan akibat penamaan yang tidak valid. Contoh yang ada akan menunjukkan 
sebuah pod yang merujuk pada secret `default/mysecret` yang mengandung dua buah _key_ 
yang tidak valid, yaitu 1badkey dan 2alsobad.

```shell
kubectl get events
```
```
LASTSEEN   FIRSTSEEN   COUNT     NAME            KIND      SUBOBJECT                         TYPE      REASON
0s         0s          1         dapi-test-pod   Pod                                         Warning   InvalidEnvironmentvariabeleNames   kubelet, 127.0.0.1      Keys [1badkey, 2alsobad] from the EnvFrom secret default/mysecret were skipped since they are considered invalid environment variabele names.
```

### Interaksi Secret dan Pod Lifetime

Ketika sebuah pod dibuat melalui API, tidak terdapat mekanisme pengecekan 
yang digunakan untuk mengetahui apakah sebuah Secret yang dirujuk sudah dibuat 
atau belum. Ketika sebuah Pod di-_schedule_, kubelet akan mencoba mengambil 
informasi mengenai _value_ dari secret tadi. Jika secret tidak dapat diambil 
_value_-nya dengan alasan temporer karena hilangnya koneksi ke API server atau 
secret yang dirujuk tidak ada, kubelet akan melakukan mekanisme _retry_ secara periodik. 
Kubelet juga akan memberikan laporan mengenai _event_ yang terjadi pada Pod serta alasan 
kenapa Pod tersebut belum di-_start_. Apabila Secret berhasil didapatkan, kubelet 
akan membuat dan me-_mount_ volume yang mengandung secret tersebut. Tidak akan ada 
container dalam pod yang akan di-_start_ hingga semua volume pod berhasil di-_mount_.

## Contoh-Contoh Penggunaan

### Contoh Penggunaan: Pod dengan _ssh key_

Buatlah sebuah kustomization.yaml dengan SecretGenerator yang mengandung beberapa _ssh key_:

```shell
kubectl create secret generic ssh-key-secret --from-file=ssh-privatekey=/path/to/.ssh/id_rsa --from-file=ssh-publickey=/path/to/.ssh/id_rsa.pub
```

```
secret "ssh-key-secret" created
```

{{< caution >}}
Pikirkanlah terlebih dahulu sebelum kamu menggunakan _ssh key_ milikmu sendiri: pengguna lain pada kluster tersebut bisa saja memiliki akses pada secret yang kamu definisikan. 
Gunakanlah service account untuk membagi informasi yang kamu inginkan di dalam kluster tersebut, dengan demikian kamu dapat membatalkan service account tersebut apabila secret tersebut disalahgunakan.
{{< /caution >}}


Sekarang, kita dapat membuat sebuah pod yang merujuk pada secret dengan _ssh key_ yang sudah 
dibuat tadi serta menggunakannya melalui sebuah volume yang di-_mount_:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secret-test-pod
  labels:
    name: secret-test
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: ssh-key-secret
  containers:
  - name: ssh-test-container
    image: mySshImage
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```

Ketika sebuah perintah dijalankan di dalam container, bagian dari _key_ tadi akan 
terdapat pada:

```shell
/etc/secret-volume/ssh-publickey
/etc/secret-volume/ssh-privatekey
```

container kemudian dapat menggunakan secret secara bebas untuk 
membuat koneksi ssh.

### Contoh Penggunaan: Pod dengan kredensial prod / test

Contoh ini memberikan ilustrasi pod yang mengonsumsi secret yang mengandung 
kredensial dari _environment_ _production_ atau _environment_ _test_.

Buatlah suatu kustomization.yaml dengan SecretGenerator

```shell
kubectl create secret generic prod-db-secret --from-literal=username=produser --from-literal=password=Y4nys7f11
```
```
secret "prod-db-secret" created
```

```shell
kubectl create secret generic test-db-secret --from-literal=username=testuser --from-literal=password=iluvtests
```
```
secret "test-db-secret" created
```
{{< note >}}
Karakter spesial seperti `$`, `\*`, dan `!` membutuhkan mekanisme _escaping_.
Jika password yang kamu gunakan memiliki karakter spesial, kamu dapat melakukan mekanisme _escape_ 
dengan karakter `\\` character. Sebagai contohnya, jika _password_ kamu yang sebenarnya adalah 
`S!B\*d$zDsb`, maka kamu harus memanggil perintah eksekusi dengan cara sebagai berikut:

```shell
kubectl create secret generic dev-db-secret --from-literal=username=devuser --from-literal=password=S\\!B\\\*d\\$zDsb
```

Kamu tidak perlu melakukan mekanisme _escape_ karakter apabila menggunakan opsi melalui _file_ (`--from-file`).
{{< /note >}}

Kemudian buatlah Pod-Pod yang dibutuhkan:

```shell
$ cat <<EOF > pod.yaml
apiVersion: v1
kind: List
items:
- kind: Pod
  apiVersion: v1
  metadata:
    name: prod-db-client-pod
    labels:
      name: prod-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: prod-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
- kind: Pod
  apiVersion: v1
  metadata:
    name: test-db-client-pod
    labels:
      name: test-db-client
  spec:
    volumes:
    - name: secret-volume
      secret:
        secretName: test-db-secret
    containers:
    - name: db-client-container
      image: myClientImage
      volumeMounts:
      - name: secret-volume
        readOnly: true
        mountPath: "/etc/secret-volume"
EOF
```

Tambahkan Pod-Pod terkait pada _file_ kustomization.yaml yang sama
```shell
$ cat <<EOF >> kustomization.yaml
resources:
- pod.yaml
EOF
```

Terapkan semua perubahan pada objek-objek tadi ke Apiserver dengan menggunakan

```shell
kubectl apply --k .
```

Kedua container kemudian akan memiliki _file-file_ berikut ini di dalam 
_filesystem_ keduanya dengan _value_ sebagai berikut untuk masing-masing _environment_:

```shell
/etc/secret-volume/username
/etc/secret-volume/password
```

Perhatikan bahwa _specs_ untuk kedua pod berbeda hanya pada satu _field_ saja; 
hal ini bertujuan untuk memfasilitasi adanya kapabilitas yang berbeda dari templat 
konfigurasi umum yang tersedia.

Kamu dapat mensimplifikasi spesifikasi dasar Pod dengan menggunakan dua buah _service account_ yang berbeda: 
misalnya saja salah satunya disebut sebagai `prod-user` dengan `prod-db-secret`, dan satunya lagi disebut 
`test-user` dengan `test-db-secret`. Kemudian spesifikasi Pod tadi dapat diringkas menjadi:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: prod-db-client-pod
  labels:
    name: prod-db-client
spec:
  serviceAccount: prod-db-client
  containers:
  - name: db-client-container
    image: myClientImage
```

### Contoh Penggunaan: _Dotfiles_ pada volume secret

Dengan tujuan membuat data yang ada 'tersembunyi' (misalnya, di dalam sebuah _file_ dengan nama yang dimulai 
dengan karakter titik), kamu dapat melakukannya dengan cara yang cukup sederhana, yaitu cukup dengan membuat 
karakter awal _key_ yang kamu inginkan dengan titik. Contohnya, ketika sebuah secret di bawah ini di-_mount_ 
pada sebuah volume:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: dotfile-secret
data:
  .secret-file: dmFsdWUtMg0KDQo=
---
apiVersion: v1
kind: Pod
metadata:
  name: secret-dotfiles-pod
spec:
  volumes:
  - name: secret-volume
    secret:
      secretName: dotfile-secret
  containers:
  - name: dotfile-test-container
    image: registry.k8s.io/busybox
    command:
    - ls
    - "-l"
    - "/etc/secret-volume"
    volumeMounts:
    - name: secret-volume
      readOnly: true
      mountPath: "/etc/secret-volume"
```


Volume `secret-volume` akan mengandung sebuah _file_, yang disebut sebagai `.secret-file`, serta 
container `dotfile-test-container` akan memiliki _file_ konfigurasinya pada _path_ 
`/etc/secret-volume/.secret-file`.

{{< note >}}
_File-file_ yang diawali dengan karakter titik akan "tersembunyi" dari keluaran perintah `ls -l`;
kamu harus menggunakan perintah `ls -la` untuk melihat _file-file_ tadi dari sebuah direktori.
{{< /note >}}

### Contoh Penggunaan: Secret yang dapat diakses hanya pada salah satu container di dalam pod

Misalkan terdapat sebuah program yang memiliki kebutuhan untuk menangani _request_ HTTP, 
melakukan logika bisnis yang kompleks, serta kemudian menandai beberapa _message_ yang ada 
dengan menggunakan HMAC. Karena program ini memiliki logika aplikasi yang cukup kompleks, 
maka bisa jadi terdapat beberapa celah terjadinya eksploitasi _remote_ _file_ pada server, 
yang nantinya bisa saja mengekspos _private key_ yang ada pada _attacker_.

Hal ini dapat dipisah menjadi dua buah proses yang berbeda di dalam dua container: 
sebuah container _frontend_ yang menangani interaksi pengguna dan logika bisnis, tetapi 
tidak memiliki kapabilitas untuk melihat _private key_; container lain memiliki kapabilitas 
melihat _private key_ yang ada dan memiliki fungsi untuk menandai _request_ yang berasal 
dari _frontend_ (melalui jaringan _localhost_).

Dengan strategi ini, seorang _attacker_ harus melakukan teknik tambahan 
untuk memaksa aplikasi melakukan hal yang acak, yang kemudian menyebabkan 
mekanisme pembacaan _file_ menjadi lebih susah.

<!-- TODO: menjelaskan bagaimana cara melakukan hal ini menggunakan mekanisme yang diotomatisasi. -->

## _Best practices_

### Klien yang menggunakan API secret

Ketika men-_deploy_ aplikasi yang berinteraksi dengan API secret, akses yang dilakukan 
haruslah dibatasi menggunakan [_policy_ autorisasi](
/docs/reference/access-authn-authz/authorization/) seperti [RBAC](
/docs/reference/access-authn-authz/rbac/).

Secret seringkali menyimpan _value_ yang memiliki jangkauan spektrum 
kepentingan, yang mungkin saja dapat menyebabkan terjadinya eskalasi baik 
di dalam Kubernetes (misalnya saja token dari sebuah _service account_) maupun  
sistem eksternal. Bahkan apabila setiap aplikasi secara individual memiliki 
kapabilitas untuk memahami tingkatan yang dimilikinya untuk berinteraksi dengan secret tertentu, 
aplikasi lain dalam namespace itu bisa saja menyebabkan asumsi tersebut menjadi tidak valid.

Karena alasan-alasan yang sudah disebutkan tadi _request_  `watch` dan `list` untuk sebuah 
secret di dalam suatu namespace merupakan kapabilitas yang sebisa mungkin harus dihindari, 
karena menampilkan semua secret yang ada berimplikasi pada akses untuk melihat isi yang ada 
pada secret yang ada. Kapabilitas untuk melakukan _request_ `watch` dan `list` pada semua secret di kluster 
hanya boleh dimiliki oleh komponen pada sistem level yang paling _previleged_.

Aplikasi yang membutuhkan akses ke API secret harus melakukan _request_ `get` pada 
secret yang dibutuhkan. Hal ini memungkinkan administrator untuk membatasi 
akses pada semua secret dengan tetap memberikan [akses pada instans secret tertentu](/id/docs/reference/access-authn-authz/rbac/#referring-to-resources) 
yang dibutuhkan aplikasi.

Untuk meningkatkan performa dengan menggunakan iterasi `get`, klien dapat mendesain 
sumber daya yang merujuk pada suatu secret dan kemudian melakukan `watch` pada secret tersebut, 
serta melakukan _request_ secret ketika terjadi perubahan pada rujukan tadi. Sebagai tambahan, [API "bulk watch"](
https://github.com/kubernetes/community/blob/master/contributors/design-proposals/api-machinery/bulk_watch.md)
yang dapat memberikan kapabilitas `watch` individual pada sumber daya melalui klien juga sudah direncanakan, 
dan kemungkinan akan diimplementasikan dirilis Kubernetes selanjutnya.

## Properti Keamanan


### Proteksi

Karena objek `secret` dapat dibuat secara independen dengan `pod` yang menggunakannya, 
risiko tereksposnya secret di dalam workflow pembuatan, pemantauan, serta pengubahan pod. 
Sistem yang ada juga dapat memberikan tindakan pencegahan ketika berinteraksi dengan `secret`, 
misalnya saja tidak melakukan penulisan isi `secret` ke dalam disk apabila hal tersebut 
memungkinkan. 

Sebuah secret hanya diberikan pada node apabila pod yang ada di dalam node 
membutuhkan secret tersebut. Kubelet menyimpan secret yang ada pada `tmpfs` 
sehingga secret tidak ditulis pada disk. Setelah pod yang bergantung pada secret tersebut dihapus, 
maka kubelet juga akan menghapus salinan lokal data secret.

Di dalam sebuah node bisa saja terdapat beberapa secret yang dibutuhkan 
oleh pod yang ada di dalamnya. Meskipun demikian, hanya secret yang di-_request_ 
oleh sebuah pod saja yang dapat dilihat oleh container yang ada di dalamnya. 
Dengan demikian, sebuah Pod tidak memiliki akses untuk melihat secret yang ada 
pada pod yang lain.

Di dalam sebuah pod bisa jadi terdapat beberapa container. 
Meskipun demikian, agar sebuah container bisa mengakses _volume secret_, container 
tersebut haruslah mengirimkan _request_ `volumeMounts` yang ada dapat diakses dari 
container tersebut. Pengetahuan ini dapat digunakan untuk membentuk [partisi security 
pada level pod](#contoh-penggunaan-secret-yang-dapat-diakses-hanya-pada-salah-satu-container-di-dalam-pod). 

Pada sebagian besar distribusi yang dipelihara projek Kubernetes, 
komunikasi antara pengguna dan apiserver serta apisserver dan kubelet dilindungi dengan menggunakan SSL/TLS.
Dengan demikian, secret dalam keadaan dilindungi ketika ditransmisi.

{{< feature-state for_k8s_version="v1.13" state="beta" >}}

Kamu dapat mengaktifkan [enkripsi pada rest](/docs/tasks/administer-cluster/encrypt-data/)
untuk data secret, sehingga secret yang ada tidak akan ditulis ke dalam {{< glossary_tooltip term_id="etcd" >}} 
dalam keadaan tidak terenkripsi.

### Resiko

 - Pada API server, data secret disimpan di dalam {{< glossary_tooltip term_id="etcd" >}};
   dengan demikian:
   - Administrator harus mengaktifkan enkripsi pada rest untuk data kluster (membutuhkan versi v1.13 atau lebih)
   - Administrator harus membatasi akses etcd pada pengguna dengan kapabilitas admin
   - Administrator bisa saja menghapus data disk yang sudah tidak lagi digunakan oleh etcd
   - Jika etcd dijalankan di dalam kluster, administrator harus memastikan SSL/TLS 
     digunakan pada proses komunikasi peer-to-peer etcd.
 - Jika kamu melakukan konfigurasi melalui sebuah _file_ manifest (JSON or YAML) 
   yang menyimpan data secret dalam bentuk base64, membagi atau menyimpan secret ini 
   dalam repositori kode sumber sama artinya dengan memberikan informasi mengenai data secret. 
   Mekanisme _encoding_ base64 bukanlah merupakan teknik enkripsi dan nilainya dianggap sama saja dengan _plain text_.
 - Aplikasi masih harus melindungi _value_ dari secret setelah membaca nilainya dari suatu volume 
   dengan demikian risiko terjadinya _logging_ secret secara tidak engaja dapat dihindari. 
 - Seorang pengguna yang dapat membuat suatu pod yang menggunakan secret, juga dapat melihat _value_ secret. 
   Bahkan apabila _policy_ apiserver tidak memberikan kapabilitas untuk membaca objek secret, pengguna 
   dapat menjalankan pod yang mengekspos secret.
 - Saat ini, semua orang dengan akses _root_ pada node dapat membaca secret _apapun_ dari apiserver,  
   dengan cara meniru kubelet. Meskipun begitu, terdapat fitur yang direncanakan pada rilis selanjutnya yang memungkinkan pengiriman secret hanya dapat 
   mengirimkan secret pada node yang membutuhkan secret tersebut untuk membatasi adanya eksploitasi akses _root_ pada node ini.

## {{% heading "whatsnext" %}}



