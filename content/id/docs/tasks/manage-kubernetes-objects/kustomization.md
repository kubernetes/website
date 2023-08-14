---
title: Mengelola Objek Kubernetes secara Deklaratif menggunakan Kustomize
content_type: task
weight: 20
---

<!-- overview -->

[Kustomize](https://github.com/kubernetes-sigs/kustomize) merupakan sebuah alat
untuk melakukan kustomisasi objek Kubernetes melalui sebuah berkas [berkas kustomization](https://github.com/kubernetes-sigs/kustomize/blob/master/docs/glossary.md#kustomization).

Sejak versi 1.14, kubectl mendukung pengelolaan objek Kubernetes melalui berkas kustomization.
Untuk melihat sumber daya yang ada di dalam direktori yang memiliki berkas kustomization, jalankan perintah berikut:

```shell
kubectl kustomize <direktori_kustomization>
```

Untuk menerapkan sumber daya tersebut, jalankan perintah `kubectl apply` dengan _flag_ `--kustomize` atau `-k`:

```shell
kubectl apply -k <kustomization_directory>
```



## {{% heading "prerequisites" %}}


Instal [`kubectl`](/id/docs/tasks/tools/install-kubectl/) terlebih dahulu.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Gambaran Umum Kustomize

Kustomize adalah sebuah alat untuk melakukan kustomisasi konfigurasi Kubernetes. Untuk mengelola berkas-berkas konfigurasi, kustomize memiliki fitur -fitur di bawah ini:

* membangkitkan (_generate_) sumber daya dari sumber lain
* mengatur _field_ dari berbagai sumber daya yang bersinggungan
* mengkomposisikan dan melakukan kustomisasi sekelompok sumber daya

### Membangkitkan Sumber Daya

ConfigMap dan Secret menyimpan konfigurasi atau data sensitif yang digunakan oleh objek-objek Kubernetes lainnya, seperti Pod.
Biasanya, _source of truth_ dari ConfigMap atau Secret berasal dari luar klaster, seperti berkas `.properties` atau berkas kunci SSH.
Kustomize memiliki `secretGenerator` dan `configMapGenerator`, yang akan membangkitkan (_generate_) Secret dan ConfigMap dari berkas-berkas atau nilai-nilai literal.

#### configMapGenerator

Untuk membangkitkan sebuah ConfigMap dari berkas, tambahkan entri ke daftar `files` pada `configMapGenerator`.
Contoh di bawah ini membangkitkan sebuah ConfigMap dengan data dari berkas `.properties`:

```shell
# Membuat berkas application.properties
cat <<EOF >application.properties
FOO=Bar
EOF

cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-1
  files:
  - application.properties
EOF
```

ConfigMap yang telah dibangkitkan dapat dilihat menggunakan perintah berikut:

```shell
kubectl kustomize ./
```

Isinya seperti di bawah ini:

```yaml
apiVersion: v1
data:
  application.properties: |
    FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-1-42cfbf598f
```

ConfigMap juga dapat dibangkitkan dari pasangan _key-value_ literal. Untuk membangkitkan secara literal, tambahkan entri pada daftar `literals` di `configMapGenerator`.
Contoh di bawah ini membangkitkan ConfigMap dengan data dari pasangan _key-value_:

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-2
  literals:
  - FOO=Bar
EOF
```

ConfigMap yang dibangkitkan dapat dilihat menggunakan perintah berikut:

```shell
kubectl kustomize ./
```

Isinya seperti ini:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  name: example-configmap-2-g2hdhfc6tk
```

#### secretGenerator

Kamu dapat membangkitkan Secret dari berkas atau pasangan _key-value_ literal. Untuk membangkitkan dari berkas, tambahkan entri pada daftar `files` di `secretGenerator`.
Contoh di bawah ini membangkitkan Secret dengan data dari berkas:

```shell
# Membuat berkas password.txt
cat <<EOF >./password.txt
username=admin
password=secret
EOF

cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-1
  files:
  - password.txt
EOF
```

Isinya seperti ini:

```yaml
apiVersion: v1
data:
  password.txt: dXNlcm5hbWU9YWRtaW4KcGFzc3dvcmQ9c2VjcmV0Cg==
kind: Secret
metadata:
  name: example-secret-1-t2kt65hgtb
type: Opaque
```

Untuk membangkitkan secara literal dari pasangan _key-value_, tambahkan entri pada daftar `literals` di `secretGenerator`.
Contoh di bawah ini membangkitkan Secret dengan data dari pasangan _key-value_:

```shell
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: example-secret-2
  literals:
  - username=admin
  - password=secret
EOF
```

Isinya seperti ini:

```yaml
apiVersion: v1
data:
  password: c2VjcmV0
  username: YWRtaW4=
kind: Secret
metadata:
  name: example-secret-2-t52t6g96d8
type: Opaque
```

#### generatorOptions

ConfigMap dan Secret yang dibangkitkan memiliki informasi sufiks _hash_. Hal ini memastikan bahwa ConfigMap atau Secret yang baru, dibangkitkan saat isinya berubah.
Untuk menonaktifkan penambahan sufiks ini, kamu bisa menggunakan `generatorOptions`. Selain itu, melalui _field_ ini kamu juga bisa mengatur opsi-opsi yang bersinggungan untuk ConfigMap dan Secret yang dibangkitkan.

```shell
cat <<EOF >./kustomization.yaml
configMapGenerator:
- name: example-configmap-3
  literals:
  - FOO=Bar
generatorOptions:
  disableNameSuffixHash: true
  labels:
    type: generated
  annotations:
    note: generated
EOF
```

Jalankan perintah `kubectl kustomize ./` untuk melihat ConfigMap yang dibangkitkan:

```yaml
apiVersion: v1
data:
  FOO: Bar
kind: ConfigMap
metadata:
  annotations:
    note: generated
  labels:
    type: generated
  name: example-configmap-3
```

### Mengatur _field_ yang bersinggungan

Mengatur _field-field_ yang bersinggungan untuk semua sumber daya Kubernetes dalam sebuah proyek.
Beberapa contoh kasusnya seperti di bawah ini:

* mengatur Namespace yang sama untuk semua sumber daya
* menambahkan prefiks atau sufiks yang sama
* menambahkan kumpulan label yang sama
* menambahkan kumpulan anotasi yang sama

Lihat contoh di bawah ini:

```shell
# Membuat sebuah deployment.yaml
cat <<EOF >./deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx
EOF

cat <<EOF >./kustomization.yaml
namespace: my-namespace
namePrefix: dev-
nameSuffix: "-001"
commonLabels:
  app: bingo
commonAnnotations:
  oncallPager: 800-555-1212
resources:
- deployment.yaml
EOF
```

Jalankan perintah `kubectl kustomize ./` untuk melihat _field-field_ tersebut telah terisi di dalam sumber daya Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  annotations:
    oncallPager: 800-555-1212
  labels:
    app: bingo
  name: dev-nginx-deployment-001
  namespace: my-namespace
spec:
  selector:
    matchLabels:
      app: bingo
  template:
    metadata:
      annotations:
        oncallPager: 800-555-1212
      labels:
        app: bingo
    spec:
      containers:
      - image: nginx
        name: nginx
```

### Mengkomposisi dan Melakukan Kustomisasi Sumber Daya

Mengkomposisi kumpulan sumber daya dalam sebuah proyek dan mengelolanya di dalam berkas atau direktori yang sama merupakan hal yang cukup umum dilakukan.
Kustomize menyediakan cara untuk mengkomposisi sumber daya dari berkas-berkas yang berbeda, lalu menerapkan _patch_ atau kustomisasi lain di atasnya.

#### Melakukan Komposisi

Kustomize mendukung komposisi dari berbagai sumber daya yang berbeda. _Field_ `resources` pada berkas `kustomization.yaml`, mendefinisikan daftar sumber daya yang diinginkan dalam sebuah konfigurasi. Atur terlebih dahulu jalur (_path_) ke berkas konfigurasi sumber daya pada daftar `resources`.
Contoh di bawah ini merupakan sebuah aplikasi NGINX yang terdiri dari sebuah Deployment dan sebuah Service:

```shell
# Membuat berkas deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Membuat berkas service.yaml
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# Membuat berkas kustomization.yaml yang terdiri dari keduanya
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

Sumber daya dari `kubectl kustomize ./` berisi kedua objek Deployment dan Service.

#### Melakukan Kustomisasi

_Patch_ dapat digunakan untuk menerapkan berbagai macam kustomisasi pada sumber daya. Kustomize mendukung berbagai mekanisme _patching_ yang berbeda melalui `patchesStrategicMerge` dan `patchesJson6902`. `patchesStrategicMerge` adalah daftar dari yang berisi tentang _path_ berkas. Setiap berkas akan dioperasikan dengan cara [strategic merge patch](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-api-machinery/strategic-merge-patch.md). Nama di dalam _patch_ harus sesuai dengan nama sumber daya yang telah dimuat. Kami menyarankan _patch-patch_ kecil yang hanya melakukan satu hal saja.
Contoh membuat sebuah _patch_ di bawah ini akan menambahkan jumlah replika Deployment dan _patch_ lainnya untuk mengatur limit memori.

```shell
# Membuat berkas deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Membuat sebuah patch increase_replicas.yaml
cat <<EOF > increase_replicas.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
EOF

# Membuat patch lainnya set_memory.yaml
cat <<EOF > set_memory.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  template:
    spec:
      containers:
      - name: my-nginx
        resources:
        limits:
          memory: 512Mi
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
patchesStrategicMerge:
- increase_replicas.yaml
- set_memory.yaml
EOF
```

Jalankan perintah `kubectl kustomize ./` untuk melihat isi dari Deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        limits:
          memory: 512Mi
        name: my-nginx
        ports:
        - containerPort: 80
```

Tidak semua sumber daya atau _field_ mendukung _strategic merge patch_. Untuk mendukung _field_ sembarang pada sumber daya _field_, Kustomize
menyediakan penerapan [_patch_ JSON](https://tools.ietf.org/html/rfc6902) melalui `patchesJson6902`.
Untuk mencari sumber daya yang tepat dengan sebuah _patch_ Json, maka grup, versi, jenis dan nama dari sumber daya harus dispesifikasikan dalam `kustomization.yaml`.
Contoh di bawah ini menambahkan jumlah replika dari objek Deployment yang bisa juga dilakukan melalui `patchesJson6902`.

```shell
# Membuat berkas deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Membuat patch json
cat <<EOF > patch.yaml
- op: replace
  path: /spec/replicas
  value: 3
EOF

# Membuat berkas kustomization.yaml
cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml

patchesJson6902:
- target:
    group: apps
    version: v1
    kind: Deployment
    name: my-nginx
  path: patch.yaml
EOF
```

Jalankan perintah `kubectl kustomize ./` untuk melihat _field_ `replicas` yang telah diperbarui:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: nginx
        name: my-nginx
        ports:
        - containerPort: 80
```

Selain _patch_, Kustomize juga menyediakan cara untuk melakukan kustomisasi _image_ Container atau memasukkan nilai _field_ dari objek lainnya ke dalam Container tanpa membuat _patch_. Sebagai contoh, kamu dapat melakukan kustomisasi _image_ yang digunakan di dalam Container dengan menyebutkan spesifikasi _field_ `images` di dalam `kustomization.yaml`.

```shell
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

cat <<EOF >./kustomization.yaml
resources:
- deployment.yaml
images:
- name: nginx
  newName: my.image.registry/nginx
  newTag: 1.4.0
EOF
```

Jalankan perintah `kubectl kustomize ./` untuk melihat _image_ yang sedang digunakan telah diperbarui:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - image: my.image.registry/nginx:1.4.0
        name: my-nginx
        ports:
        - containerPort: 80
```

Terkadang, aplikasi yang berjalan di dalam Pod perlu untuk menggunakan nilai konfigurasi dari objek lainnya.
Contohnya, sebuah Pod dari objek Deployment perlu untuk membaca nama Service dari Env atau sebagai argumen perintah.
Ini karena nama Service bisa saja berubah akibat dari penambahan `namePrefix` atau `nameSuffix` pada berkas `kustomization.yaml`.
Kami tidak menyarankan kamu untuk meng-_hardcode_ nama Service di dalam argumen perintah.
Untuk penggunaan ini, Kustomize dapat memasukkan nama Service ke dalam Container melalui `vars`.

```shell
# Membuat berkas deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        command: ["start", "--host", "\$(MY_SERVICE_NAME)"]
EOF

# Membuat berkas service.yaml
cat <<EOF > service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

cat <<EOF >./kustomization.yaml
namePrefix: dev-
nameSuffix: "-001"

resources:
- deployment.yaml
- service.yaml

vars:
- name: MY_SERVICE_NAME
  objref:
    kind: Service
    name: my-nginx
    apiVersion: v1
EOF
```

Jalankan perintah `kubectl kustomize ./` untuk melihat nama Service yang dimasukkan ke dalam Container menjadi `dev-my-nginx-001`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: dev-my-nginx-001
spec:
  replicas: 2
  selector:
    matchLabels:
      run: my-nginx
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - command:
        - start
        - --host
        - dev-my-nginx-001
        image: nginx
        name: my-nginx
```

## Base dan Overlay

Kustomize memiliki konsep **base** dan **overlay**. **base** merupakan direktori dengan `kustomization.yaml`, yang berisi
sekumpulan sumber daya dan kustomisasi yang terkait. **base** dapat berupa direktori lokal maupun direktori dari repo _remote_,
asalkan berkas `kustomization.yaml` ada di dalamnya. **overlay** merupakan direktori dengan `kustomization.yaml` yang merujuk pada
direktori kustomization lainnya sebagai **base**-nya. **base** tidak memiliki informasi tentang **overlay**. dan dapat digunakan pada beberapa **overlay** sekaligus.
**overlay** bisa memiliki beberapa **base** dan terdiri dari semua sumber daya yang berasal dari **base** yang juga dapat memiliki kustomisasi lagi di atasnya.

Contoh di bawah ini memperlihatkan kegunaan dari **base**:

```shell
# Membuat direktori untuk menyimpan base
mkdir base
# Membuat base/deployment.yaml
cat <<EOF > base/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
EOF

# Membuat berkas base/service.yaml
cat <<EOF > base/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-nginx
  labels:
    run: my-nginx
spec:
  ports:
  - port: 80
    protocol: TCP
  selector:
    run: my-nginx
EOF

# Membuat berkas base/kustomization.yaml
cat <<EOF > base/kustomization.yaml
resources:
- deployment.yaml
- service.yaml
EOF
```

**base** ini dapat digunakan di dalam beberapa **overlay** sekaligus. Kamu dapat menambahkan `namePrefix` yang berbeda ataupun
_field_ lainnya yang bersinggungan di dalam **overlay** berbeda. Di bawah ini merupakan dua buah **overlay** yang menggunakan **base** yang sama.

```shell
mkdir dev
cat <<EOF > dev/kustomization.yaml
resources:
- ../base
namePrefix: dev-
EOF

mkdir prod
cat <<EOF > prod/kustomization.yaml
resources:
- ../base
namePrefix: prod-
EOF
```

## Cara menerapkan/melihat/menghapus objek menggunakan Kustomize

Gunakan `--kustomize` atau `-k` di dalam perintah `kubectl` untuk mengenali sumber daya yang dikelola oleh `kustomization.yaml`.
Perhatikan bahwa `-k` harus merujuk pada direktori kustomization, misalnya:

```shell
kubectl apply -k <direktori kustomization>/
```

Buatlah `kustomization.yaml` seperti di bawah ini:

```shell
# Membuat berkas deployment.yaml
cat <<EOF > deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-nginx
spec:
  selector:
    matchLabels:
      run: my-nginx
  replicas: 2
  template:
    metadata:
      labels:
        run: my-nginx
    spec:
      containers:
      - name: my-nginx
        image: nginx
        ports:
        - containerPort: 80
EOF

# Membuat berkas kustomization.yaml
cat <<EOF >./kustomization.yaml
namePrefix: dev-
commonLabels:
  app: my-nginx
resources:
- deployment.yaml
EOF
```

Jalankan perintah di bawah ini untuk menerapkan objek Deployment `dev-my-nginx`:

```shell
> kubectl apply -k ./
deployment.apps/dev-my-nginx created
```

Jalankan perintah di bawah ini untuk melihat objek Deployment `dev-my-nginx`:

```shell
kubectl get -k ./
```

```shell
kubectl describe -k ./
```

Jalankan perintah di bawah ini untuk membandingkan objek Deployment `dev-my-nginx` dengan kondisi yang diinginkan pada klaster jika manifes telah berhasil diterapkan:

```shell
kubectl diff -k ./
```

Jalankan perintah di bawah ini untuk menghapus objek Deployment `dev-my-nginx`:

```shell
> kubectl delete -k ./
deployment.apps "dev-my-nginx" deleted
```

## Daftar Fitur Kustomize

| _Field_                 | Tipe                                                                                                         | Deskripsi                                                                        |
|-----------------------|--------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| namespace             | string                                                                                                       | menambahkan Namespace untuk semua sumber daya                                                     |
| namePrefix            | string                                                                                                       | nilai dari _field_ ini ditambahkan di awal pada nama dari semua sumber daya                     |
| nameSuffix            | string                                                                                                       | nilai dari _field_ ini ditambahkan di akhir pada nama dari semua sumber daya                      |
| commonLabels          | map[string]string                                                                                            | label untuk ditambahkan pada semua sumber daya dan selektor                                       |
| commonAnnotations     | map[string]string                                                                                            | anotasi untuk ditambahkan pada semua sumber daya                                                |
| resources             | []string                                                                                                     | setiap entri di dalam daftar ini harus diselesaikan pada berkas konfigurasi sumber daya yang sudah ada    |
| configmapGenerator    | [][ConfigMapArgs](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L99)  | setiap entri di dalam daftar ini membangkitkan ConfigMap                                      |
| secretGenerator       | [][SecretArgs](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L106)     | setiap entri di dalam daftar ini membangkitkan Secret                                         |
| generatorOptions      | [GeneratorOptions](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/kustomization.go#L109) | memodifikasi perilaku dari semua generator ConfigMap dan Secret                             |
| bases                 | []string                                                                                                     | setiap entri di dalam daftar ini harus diselesaikan ke dalam sebuah direktori yang berisi berkas kustomization.yaml |
| patchesStrategicMerge | []string                                                                                                     | setiap entri di dalam daftar ini harus diselesaikan dengan _strategic merge patch_ dari sebuah objek Kubernetes |
| patchesJson6902       | [][Json6902](https://github.com/kubernetes-sigs/kustomize/blob/release-kustomize-v4.0/api/types/patchjson6902.go#L8)             | setiap entri di dalam daftar ini harus diselesaikan ke suatu objek Kubernetes atau _patch_ Json     |
| vars                  | [][Var](https://github.com/kubernetes-sigs/kustomize/blob/master/api/types/var.go#L31)                       | setiap entri digunakan untuk menangkap teks yang berasal dari _field_ sebuah sumber daya                            |
| images                | [][Image](https://github.com/kubernetes-sigs/kustomize/tree/master/api/types/image.go#L23)                   | setiap entri digunakan untuk memodifikasi nama, tag dan/atau _digest_ untuk sebuah _image_ tanpa membuat _patch_ |
| configurations        | []string                                                                                                     | setiap entri di dalam daftar ini harus diselesaikan ke sebuah berkas yang berisi [konfigurasi transformer Kustomize](https://github.com/kubernetes-sigs/kustomize/tree/master/examples/transformerconfigs) |
| crds                  | []string                                                                                                     | setiap entri di dalam daftar ini harus diselesaikan ke sebuah berkas definisi OpenAPI untuk tipe Kubernetes |



## {{% heading "whatsnext" %}}


* [Kustomize](https://github.com/kubernetes-sigs/kustomize)
* [Buku Kubectl](https://kubectl.docs.kubernetes.io)
* [Rujukan Perintah Kubectl](/docs/reference/generated/kubectl/kubectl-commands/)
* [Rujukan API Kubernetes](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
