---
title: Mengelola Resource
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Kamu telah melakukan deploy pada aplikasimu dan mengeksposnya melalui sebuah service. Lalu? Kubernetes menyediakan berbagai peralatan untuk membantu mengatur deploy aplikasi, termasuk pengaturan kapasitas dan pembaruan. Diantara fitur yang akan didiskusikan lebih mendalam yaitu [berkas konfigurasi](/docs/concepts/configuration/overview/) dan [label](/docs/concepts/overview/working-with-objects/labels/).

{{% /capture %}}


{{% capture body %}}

## Mengelola konfigurasi _resource_

Banyak aplikasi memerlukan beberapa _resource_, seperti Deployment dan Service. Pengelolaan beberapa _resource_ dapat disederhanakan dengan mengelompokkannya dalam berkas yang sama (dengan pemisah `---` pada YAML). Contohnya:

{{< codenew file="application/nginx-app.yaml" >}}

Beberapa _resource_ dapat dibuat seperti satu _resource_:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
service/my-nginx-svc created
deployment.apps/my-nginx created
```

_Resource_ akan dibuat dalam urutan seperti pada berkas. Oleh karena itu, lebih baik menspecify _service_ dahulu agar menjamin _scheduler_ dapat membagikan _pod_ yang terkait _service_ selagi pod dibangkitkan oleh controller, such as Deployment.

`kubectl apply` juga dapat menerima beberapa argumen `-f`:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

Selain berkas, kita dapat juga memasukkan direktori sebagai argumen:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/
```

`kubectl` akan membaca berkass apapun yang berakhiran `.yaml`, `.yml`, or `.json`.

Disarankan untuk meletakkan _resource_ yang terkait _microservice_ atau application tier yang sama dalam satu berkas, dan mengelompokkan semua berkas associated dengan aplikasi anda dalam satu direktori. Jika tiers of your aplikasi bind to each other using DNS, maka anda dapat saja deploy semua komponen stack bersamaan.

Lokasi konfigurasi dapat juga diberikan dalam bentuk URL yang berguna ketika ingin menjalankan berkas konfigurasi dari github:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/application/nginx/nginx-deployment.yaml
```

```shell
deployment.apps/my-nginx created
```

## Operasi majemuk dalam kubectl

Pembuatan _resource_ bukanlah satu-satunya operasi yang bisa dijalankan `kubectl` secara majemuk. Dia juga dapat mengekstrak nama _resource_ dari berkas konfigurasi untuk menjalankan operasi lainnya, khususnya untuk menghapus _resource_ yang telah dibuat:

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

Pada kasus dua _resource_, mudah untuk menspecify keduanya pada command line menggunakan sintaks _resource_/nama:

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

Namun, untuk jumlah yang lebih besar, akan sangat memudahkan untuk menspecify selektor (label query) menggunakan `-l` atau `--selector` untuk memfilter _resource_ berdasarkan label:

```shell
kubectl delete deployment,services -l app=nginx
```

```shell
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

Karena `kubectl` mengembalikan nama resource yang sama dengan sintaks yang diterima, mudah untuk melanjutkan operasi menggunakan `$()` atau `xargs`:

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
```

```shell
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

Dengan perintah di atas, pertama kita buat resource di dalam `examples/application/nginx/`, lalu tampilkan resources yang terbentuk dengan format keluaran `-o name` (menampilkan tiap resource dalam format resource/nama). Kemudian lakukan `grep` hanya pada "service", dan tampilkan dengan `kubectl get`.

Untuk dapat menggunakan perintah di atas pada direktori yang bertingkat, kamu dapat memberi argumen `--recursive` atau `-R` bersamaan dengan argumen `--filename,-f`.

Misalnya ada sebuah direktori `project/k8s/development` memuat semua manifests yang berkaitan development environment. Manifest akan tersusun oleh tipe resource:

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

Secara _default_, menjalankan operasi majemuk pada `project/k8s/development` hanya akan terbatas pada direktori teratas tanpa menelusuri lebih dalam. Sehingga ketika kita menjalankan operasi pembuatan dengan perintah berikut, kita akan mendapatkan pesan kesalahan:

```shell
kubectl apply -f project/k8s/development
```

```shell
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

Solusinya, tambahkan argumen `--recursive` atau `-R` bersama dengan `--filename,-f` seperti:

```shell
kubectl apply -f project/k8s/development --recursive
```

```shell
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Argumen `--recursive` berjalan pada operasi apapun yang menerima argumen `--filename,-f` seperti: `kubectl {create,get,delete,describe,rollout} etc.`

Argumen `--recursive` juga berjalan saat beberapa argumen `-f` diberikan:

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```shell
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

Jika anda tertarik mempelajari lebih lanjut tentang `kubectl`, silahkan baca [Ikhtisar kubectl](/id/docs/reference/kubectl/overview/).

## Memakai label secara efektif

Contoh yang kita lihat sejauh ini hanya menggunakan paling banyak satu label pada _resource_ apapun. Ada banyak skenario ketika membutuhkan beberapa label untuk membedakan sebuah kelompok dari yang lainnya.

Sebagai contoh, different applications would use different values for the `app` label, tapi pada aplikasi multitier, seperti pada [contoh buku tamu](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/), tiap tier perlu dibedakan. Untuk menandai tier frontend bisa menggunakan label:

```yaml
     labels:
        app: guestbook
        tier: frontend
```

seperti halnya Redis master dan slave memiliki label `tier` yang berbeda, atau bahkan label tambahan `role`:

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

dan

```yaml
     labels:
        app: guestbook
        tier: backend
        role: slave
```

Label memungkinkan kita untuk memilah _resource_ dengan pembeda berupa label:

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```shell
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=slave
```
```shell
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

## Deploy dengan Canary

Skenario lain yang menggunakan beberapa label yaitu saat membedakan deployment komponen yang sama namun dengan rilis atau konfigurasi yang berbeda. Adalah praktik yang umum untuk mendeploy sebuah *canary* dari rilis aplikasi yang baru (berdasarkan tag image dalam templat pod) bersamaan dengan rilis sebelumnya sehingga rilis yang baru dapat menerima live traffic sebelum benar-benar roll out -- bekerja?.

Sebagai contoh, kamu dapat memakai label `track` untuk membedakan antar rilis.

Rilis primer dan stabil akan memiliki label `track` yang berisi `stable`:

```yaml
     name: frontend
     replicas: 3
     ...
     labels:
        app: guestbook
        tier: frontend
        track: stable
     ...
     image: gb-frontend:v3
```

kemudian kamu buat lagi rilis frontend buku tamu yang membawa label `track` yang berbeda (misal `canary`), sehingga pod dalam kedua rilis tidak overlap:

```yaml
     name: frontend-canary
     replicas: 1
     ...
     labels:
        app: guestbook
        tier: frontend
        track: canary
     ...
     image: gb-frontend:v4
```

Servis frontend akan meliputi kedua set replika dengan menentukan subset bersama dari label-labelnya (i.e. menghapus label `track`) sehingga traffic akan diarahkan ke kedua aplikasi:

```yaml
  selector:
     app: guestbook
     tier: frontend
```

Anda dapat mengatur jumlah replika rilis stable dan canary untuk menentukan rasio dari tiap rilis yang akan menerima _traffic_ _production_ _live_ (dalam kasus ini 3:1).
Ketika telah yakin, kamu dapat mengganti track stable ke rilis baru dan menghapus canary.

Untuk contoh yang lebih jelas, cek pada [tutorial of deploying Ghost](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary).

## Memperbarui label

Kadang, pod dan resource lain yang sudah ada harus dilabeli ulang sebelum membuat resource baru. Hal ini dapat dilakukan dengan perintah `kubectl label`.
Contohnya jika kamu ingin melabeli ulang semua pod nginx sebagai frontend tier, tinggal jalankan:

```shell
kubectl label pods -l app=nginx tier=fe
```

```shell
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

Perintah ini melakukan filter pada semua pod dengan label "app=nginx", lalu melabelinya dengan "tier=fe".
Untuk melihat pod yang telah dilabeli, jalankan:

```shell
kubectl get pods -l app=nginx -L tier
```
```shell
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

Akan muncul semua pod dengan "app=nginx" dan sebuah kolom label tambahan yaitu tier (ditentukan dengan `-L` atau `--label-columns`).

Untuk informasi lebih lanjut, silahkan baca [label](/docs/concepts/overview/working-with-objects/labels/) dan [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).

## Memperbarui anotasi

Kadang resource perlu ditambahkan anotasi. Anotasi adalah metadata sembarang yang tidak identifying, seperti tools, libraries, etc. Ini dapat dilakukan dengan `kubectl annotate`. Sebagai contoh:

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```
```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

Untuk informasi lebih lanjut, silahkan lihat laman [annotations](/docs/concepts/overview/working-with-objects/annotations/) dan [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate).

## Mengatur kapasitas aplikasi anda

Saat beban aplikasi naik maupun turun, mudah untuk mengubah kapasitas dengan `kubectl`. Contohnya, untuk menurunkan kapasitas replika nginx dari 3 ke 1, lakukan:

```shell
kubectl scale deployment/my-nginx --replicas=1
```
```shell
deployment.extensions/my-nginx scaled
```

Sekarang anda hanya memiliki satu pod yang dikelola oleh deployment.

```shell
kubectl get pods -l app=nginx
```
```shell
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

Agar sistem dapat menyesuaikan jumlah replika nginx yang dibutuhkan secara otomatis dari 1 hingga 3, lakukan: 

```shell
kubectl autoscale deployment/my-nginx --min=1 --max=3
```
```shell
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

Sekarang kapasitas replika nginx akan secara otomatis naik dan turun sesuai kebutuhan.

Informasi tambahan dapat dilihat pada dokumen [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale), [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) dan [horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/).


## Pembaruan resource di tempat

Kadang kita perlu membuat pembaruan kecil, non-disruptif pada resource yang telah dibuat.

### kubectl apply

Disarankan untuk menyimpan berkas-berkas konfigurasi dalam source control (lihat [configuration as code](http://martinfowler.com/bliki/InfrastructureAsCode.html)).
Sehingga dapat dipelihara dan diversion bersamaan dengan kode for the resources they configure.
Kemudian, kamu dapat menggunakan [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) untuk membarui perubahan konfigurasi ke cluster.

Perintah ini akan membandingkan versi konfigurasi yang disuplai dengan versi sebelumnya yang telah berjalan dan memasang perubahan yang kamu buat tanpa mengganti properti yang tidak berubah sama sekali.

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

Perhatikan bahwa `kubectl apply` memasang anotasi pada resource untuk menentukan perubahan pada konfigurasi since the previous invocation. Ketika dijalankan, `kubectl apply` melakukan a three-way diff antara konfigurasi sebelumnya, masukan yang disuplai, dan konfigurasi resource sekarang, untuk dapat menentukan cara memodifkasi resource.

Sekarang, resource dibuat tanpa ada anotasi. Jadi pemanggilan pertama pada `kubectl apply` akan kembali pada two-way diff antara masukan pengguna dan konfigurasi resource sekarang. Saat itu, tidak ada penghapusan set properti yang terdeteksi saat resource dibuat. Sehingga, tidak ada yang dihapus.

Tiap `kubectl apply`, atau perintah lain yang memodifikasi konfigurasi seperti `kubectl replace` dan `kubectl edit` dijalankan, anotasi akan diperbarui. Sehingga memungkinkan operasi `kubectl apply` untuk mendeteksi dan melakukan penghapusan secara three-way diff.

### kubectl edit

Sebagai alternatif, kamu juga dapat membarui resource dengan `kubectl edit`:

```shell
kubectl edit deployment/my-nginx
```

Ini sama dengan melakukan `get` pada resource dahulu, mengubahnya di text editor, kemudian menjalankan`apply` pada resource dengan versi terkini:

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# lakukan pengubahan, lalu simpan berkas

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

Cara demikian memungkinkan kamu membuat perubahan signifikan dengan mudah. Lihat bahwa kamu juga dapat menentukan editor dengan variabel environment `EDITOR` atau `KUBE_EDITOR`.

Untuk informasi tambahan, silahkan lihat laman [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit).

### kubectl patch

Kamu dapat menggunakan `kubectl patch` untuk membarui obyek API di tempat. Perintah ini mendukung patch JSON,
patch gabungan JSON, dan strategic merge patch. Lihat
[Update API Objects in Place Using kubectl patch](/docs/tasks/run-application/update-api-object-kubectl-patch/)
dan
[kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch).

## Pembaruan disruptif

Pada kasus tertentu, kamu mungkin perlu memperbarui field resource yang tidak dapat diperbarui setelah diinisiasi atau kamu ingin membuat perubahan rekursif segera, seperti memperbaiki pod yang rusak saat menjalankan Deployment. Untuk mengubah field seperti itu, gunakan `replace --force` yang akan menghapus dan membuat ulang resource. Dalam kasus ini kamu dapat mengubah berkas konfigurasi awalnya:

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```
```shell
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

## Membarui aplikasi tanpa outage servis

Suatu saat, kamu akan perlu untuk membarui aplikasi yang telah terdeploy, biasanya dengan mengganti image atau tag sebagaimana dalam skenario canary deployment di atas. `kubectl` mendukung beberapa operasi pembaruan, masing-masing dapat digunakan pada skenario berbeda.

Kami akan memandumu untuk membuat dan membarui aplikasi melalui Deployment.

Misal kamu telah menjalankan nginx versi 1.7.9:

```shell
kubectl run my-nginx --image=nginx:1.7.9 --replicas=3
```
```shell
deployment.apps/my-nginx created
```

Untuk memperbarui versi ke 1.9.1, ganti `.spec.template.spec.containers[0].image` dari `nginx:1.7.9` ke `nginx:1.9.1`, dengan perintah kubectl yang telah dipelajari di atas.

```shell
kubectl edit deployment/my-nginx
```

Selesai! Deployment akan memperbarui aplikasi nginx yang terdeploy secara berangsur di belakang. Dia akan menjamin hanya ada sekian replika lama yang akan down selagi pembaruan berjalan dan hanya ada sekian replika baru akan dibuat melebihi jumlah pod. Untuk mempelajari lebih lanjut, kunjungi [laman Deployment](/docs/concepts/workloads/controllers/deployment/).

{{% /capture %}}

{{% capture whatsnext %}}

- [Learn about how to use `kubectl` for application introspection and debugging.](/docs/tasks/debug-application-cluster/debug-application-introspection/)
- [Configuration Best Practices and Tips](/docs/concepts/configuration/overview/)

{{% /capture %}}
