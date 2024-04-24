---
title: Panduan HorizontalPodAutoscaler
content_type: task
weight: 100
---

<!-- overview -->

HorizontalPodAutoscaler secara otomatis akan memperbanyak jumlah Pod di dalam ReplicationController, Deployment, 
ReplicaSet ataupun StatefulSet berdasarkan hasil observasi penggunaan CPU (atau, dengan 
[metrik khusus](https://git.k8s.io/community/contributors/design-proposals/instrumentation/custom-metrics-api.md), pada beberapa aplikasi yang menyediakan metrik).

Laman ini memandu kamu dengan contoh pengaktifan HorizontalPodAutoscaler untuk server php-apache.  Untuk informasi lebih lanjut tentang perilaku HorizontalPodAutoscaler, lihat [Petunjuk pengguna HorizontalPodAutoscaler](/id/docs/tasks/run-application/horizontal-pod-autoscaler/).




## {{% heading "prasyarat" %}}


Contoh dibawah ini membutuhkan klaster Kubernetes dan kubectl di versi 1.2 atau yang lebih baru yang sedang berjalan. 
[Server metrik](https://github.com/kubernetes-incubator/metrics-server/) sebagai pemantauan perlu diluncurkan di dalam sebuah klaster 
untuk menyediakan metrik melalui metrik API sumber daya, karena HorizontalPodAutoscaler menggunakan API ini untuk mengumpulkan metrik. Petunjuk untuk menerapkan server metrik ada di repositori GitHub dari [server metrik](https://github.com/kubernetes-incubator/metrics-server/), jika kamu mengikuti petunjuk [memulai panduan GCE](/docs/setup/production-environment/turnkey/gce/),
metrik-pemantauan server akan diaktifkan secara default

Untuk menentukan beberapa metrik sumber daya untuk HorizontalPodAutoscaler, kamu harus memiliki klaster Kubernetes
dan kubectl di versi 1.6 atau yang lebih baru. Selanjutnya, untuk menggunakan metrik khusus, klaster kamu
harus dapat berkomunikasi dengan server API yang menyediakan API metrik khusus. Terakhir, untuk menggunakan metrik yang tidak terkait dengan objek Kubernetes apa pun, kamu harus memiliki klaster Kubernetes pada versi 1.10 atau yang lebih baru, dan kamu harus dapat berkomunikasi dengan server API yang menyediakan API metrik eksternal.
Lihat [Panduan pengguna HorizontalPodAutoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics) untuk detail lebih lanjut.


<!-- langkah - langkah -->

## Menjalankan & mengekspos server php-apache

Untuk mendemonstrasikan HorizontalPodAutoscaler kita akan menggunakan _image_ Docker khusus berdasarkan _image_ php-apache.
Dockerfile memiliki konten berikut:

```
FROM php:5-apache
ADD index.php /var/www/html/index.php
RUN chmod a+rx index.php
```

Bagian ini mendefinisikan laman index.php yang melakukan beberapa komputasi intensif CPU:

```
<?php
  $x = 0.0001;
  for ($i = 0; $i <= 1000000; $i++) {
    $x += sqrt($x);
  }
  echo "OK!";
?>
```

Pertama, kita akan memulai Deployment yang menjalankan _image_ dan mengeksposnya sebagai Service
menggunakan konfigurasi berikut:

{{% codenew file="application/php-apache.yaml" %}}


Jalankan perintah berikut:
```shell
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml
```
```
deployment.apps/php-apache created
service/php-apache created
```

## Membuat HorizontalPodAutoscaler

Sekarang server sudah berjalan, selanjutnya kita akan membuat _autoscaler_ menggunakan
[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale).
Perintah berikut akan membuat HorizontalPodAutoscaler yang mengelola antara 1 dan 10 replika Pod yang dikontrol oleh Deployment php-apache yang kita buat pada langkah pertama instruksi ini.
Secara kasar, HPA akan menambah dan mengurangi jumlah replika
(melalui Deployment) untuk mempertahankan pemakaian CPU rata-rata di semua Pod sebesar 50%
(karena setiap Pod meminta 200 mili-core menurut `kubectl run`), ini berarti penggunaan CPU rata-rata adalah 100 mili-core).
Lihat [ini](/id/docs/tasks/run-application/horizontal-pod-autoscaler/#detail-algoritma) untuk detail lebih lanjut tentang algoritmanya.

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```
```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

Kita dapat memeriksa status _autoscaler_ saat ini dengan menjalankan:

```shell
kubectl get hpa
```
```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s

```

Harap dicatat bahwa konsumsi CPU saat ini adalah 0% karena kita tidak mengirimkan permintaan apa pun ke server
(kolom ``TARGET`` menunjukkan nilai rata-rata di semua Pod yang dikontrol oleh Deployment yang sesuai).

## Menambahkan beban

Sekarang, kita akan melihat bagaimana _autoscaler_ bereaksi terhadap peningkatan beban.
Kita akan memulai sebuah Container, dan mengirimkan perulangan kueri tak terbatas ke Service php-apache (jalankan di terminal yang berbeda):

```shell
kubectl run -it --rm load-generator --image=busybox /bin/sh

Hit enter for command prompt

while true; do wget -q -O- http://php-apache; done
```

Dalam satu menit atau lebih, kita akan melihat beban CPU yang lebih tinggi dengan menjalankan:

```shell
kubectl get hpa
```
```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m

```

Di sini, konsumsi CPU meningkat hingga 305% dari permintaan.
Hasilnya, Deployment mengubah ukurannya menjadi 7 replika:

```shell
kubectl get deployment php-apache
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

{{< note >}}
Mungkin perlu beberapa menit untuk menstabilkan jumlah replika. Karena jumlah 
bebannya tidak dikendalikan dengan cara apa pun, yang mungkin terjadi adalah jumlah replika akhir
akan berbeda dari contoh.
{{< /note >}}

## Menghentikan beban

Kita akan menyudahi contoh dengan menghentikan beban pengguna.

Di terminal tempat kita membuat Container dengan _image_ `busybox`, hentikan
pembangkitan beban dengan mengetik `<Ctrl> + C`.

Kemudian kita akan memverifikasi status hasil (setelah satu menit atau lebih):

```shell
kubectl get hpa
```
```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

```shell
kubectl get deployment php-apache
```
```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

Di sini penggunaan CPU turun menjadi 0, sehingga HPA secara otomatis melakukan penyekalaan jumlah replika kembali menjadi 1.

{{< note >}}
Penyekalaan otomatis replika mungkin memerlukan waktu beberapa menit.
{{< /note >}}



<!-- diskusi -->

## Penyekalaan otomatis pada metrik multipel dan metrik kustom

Kamu dapat memperkenalkan metrik tambahan untuk digunakan saat melakukan penyekalaan otomatis pada Deployment `php-apache` dengan menggunakan versi API `autoscaling / v2beta2`.

Pertama, dapatkan YAML HorizontalPodAutoscaler kamu dalam bentuk `autoscaling / v2beta2`:

```shell
kubectl get hpa.v2beta2.autoscaling -o yaml > /tmp/hpa-v2.yaml
```

Buka berkas `/tmp/hpa-v2.yaml` di editor, dan kamu akan melihat YAML yang terlihat seperti ini:

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
      current:
        averageUtilization: 0
        averageValue: 0
```

Perhatikan bahwa kolom `targetCPUUtilizationPercentage` telah diganti dengan himpunan yang disebut `metrics`.
Metrik penggunaan CPU adalah *resource metric*, merepresentasikan sebagai persentase sumber daya
ditentukan pada Container Pod. Perhatikan bahwa kamu dapat menentukan metrik sumber daya selain CPU. Secara bawaan,
satu-satunya metrik sumber daya lain yang didukung adalah memori. Sumber daya ini tidak mengubah nama dari klaster
ke klaster, dan harus selalu tersedia, selama API `metrics.k8s.io` tersedia.

Kamu juga dapat menentukan metrik sumber daya dalam nilai secara langsung, bukan sebagai persentase dari
nilai yang diminta, dengan menggunakan `target.type` dari `AverageValue` sebagai ganti `Utilization`, dan
menyetel _field_ `target.averageValue` yang sesuai, bukan `target.averageUtilization`.

Ada dua jenis metrik lainnya, keduanya dianggap sebagai *metrik khusus*: metrik Pod dan
metrik objek. Metrik ini memungkinkan untuk memiliki nama yang spesifik untuk klaster, dan membutuhkan lebih banyak
pengaturan pemantauan klaster lanjutan.

Jenis metrik alternatif yang pertama adalah *metrik Pod*. Metrik ini mendeskripsikan Pod, dan
dirata-ratakan bersama di seluruh Pod dan dibandingkan dengan nilai target untuk menentukan jumlah replika.
Mereka bekerja seperti metrik sumber daya, kecuali bahwa mereka *hanya* mendukung jenis `target` dari `AverageValue`.

Metrik Pod ditentukan menggunakan blok metrik seperti ini:

```yaml
type: Pods
pods:
  metric:
    name: packets-per-second
  target:
    type: AverageValue
    averageValue: 1k
```

Jenis metrik alternatif kedua adalah *metrik objek*. Metrik ini mendeskripsikan perbedaan
objek di Namespace yang sama, bukan mendeskripsikan Pod. Metriknya belum tentu
diambil dari objek; mereka hanya mendeskripsikannya. Metrik objek mendukung jenis `target`
baik `Value` dan `AverageValue`. Dengan `Value`, target dibandingkan langsung dengan yang dikembalikan
metrik dari API. Dengan `AverageValue`, nilai yang dikembalikan dari API metrik khusus dibagi
dengan jumlah Pod sebelum dibandingkan dengan target. Contoh berikut adalah YAML
representasi dari metrik `requests-per-second`.

```yaml
type: Object
object:
  metric:
    name: requests-per-second
  describedObject:
    apiVersion: networking.k8s.io/v1beta1
    kind: Ingress
    name: main-route
  target:
    type: Value
    value: 2k
```

Jika kamu memberikan beberapa blok metrik seperti itu, HorizontalPodAutoscaler akan mempertimbangkan setiap metrik secara bergantian.
HorizontalPodAutoscaler akan menghitung jumlah replika yang diusulkan untuk setiap metrik, lalu memilih
satu dengan jumlah replika tertinggi.

Misalnya, jika sistem pemantauan kamu mengumpulkan metrik tentang lalu lintas jaringan,
kamu dapat memperbarui definisi di atas menggunakan `kubectl edit` agar terlihat seperti ini:

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Pods
    pods:
      metric:
        name: packets-per-second
      target:
        type: AverageValue
        averageValue: 1k
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1beta1
        kind: Ingress
        name: main-route
      target:
        type: Value
        value: 10k
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
    current:
      averageUtilization: 0
      averageValue: 0
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1beta1
        kind: Ingress
        name: main-route
      current:
        value: 10k
```

Kemudian, HorizontalPodAutoscaler kamu akan mencoba memastikan bahwa setiap Pod mengonsumsi kira-kira
50% dari CPU yang diminta, melayani 1000 paket per detik, dan semua Pod berada di belakang Ingress 
rute utama melayani total 10.000 permintaan per detik.

### Penyekalaan otomatis pada metrik yang lebih spesifik

Banyak _pipeline_ metrik memungkinkan kamu mendeskripsikan metrik baik berdasarkan nama atau kumpulan tambahan
deskriptor yang disebut _labels_. Untuk semua jenis metrik non-sumber daya (Pod, objek, dan eksternal,
dijelaskan seperti dibawah), kamu dapat menentukan pemilih label tambahan yang diteruskan ke pipa metrik kamu. Misalnya, jika kamu mengumpulkan metrik `http_requests` dengan label `verb`
, kamu dapat menentukan blok metrik berikut untuk diskalakan hanya pada permintaan GET:

```yaml
type: Object
object:
  metric:
    name: http_requests
    selector: {matchLabels: {verb: GET}}
```

_Selector_ ini menggunakan sintaksis yang sama dengan _selector_ lengkap label Kubernetes. Pipa pemantauan
menentukan cara mengecilkan beberapa seri menjadi satu nilai, jika nama dan pemilih cocok dengan 
beberapa seri. Selektor bersifat aditif, dan tidak dapat memilih metrik yang mendeskripsikan objek 
yang **bukan** objek target (target pod dalam kasus tipe `Pod`, dan objek yang dijelaskan dalam kasus tipe `Objek`).

### Penyekalaan otomatis pada metrik yang tidak terkait dengan objek Kubernetes

Aplikasi yang berjalan di Kubernetes mungkin perlu melakukan penyekalaan otomatis berdasarkan metrik yang tidak
memiliki hubungan yang jelas dengan objek apa pun di klaster Kubernetes, seperti metrik yang mendeskripsikan
layanan yang dihosting tanpa korelasi langsung dengan namespace Kubernetes. Di Kubernetes 1.10 dan yang lebih baru, kamu dapat menangani kasus penggunaan ini dengan *metrik eksternal*.

Menggunakan metrik eksternal membutuhkan pengetahuan tentang sistem pemantauanmu; penyiapannya mirip dengan yang diperlukan saat menggunakan metrik khusus. Metrik eksternal memungkinkan kamu menskalakan klaster kamu secara otomatis berdasarkan metrik apa pun yang tersedia di sistem pemantauanmu. Cukup berikan blok `metric` dengan `name` dan `selector` (pemilih), seperti di atas, dan gunakan jenis metrik `External`, bukan `Object`.
Jika beberapa _series_ cocok dengan `metricSelector`, jumlah dari nilai mereka akan digunakan oleh HorizontalPodAutoscaler.
Metrik eksternal mendukung jenis target `Value` dan `AverageValue`, yang berfungsi persis sama seperti saat kamu menggunakan tipe `Object`.

Misalnya, jika aplikasi kamu memproses tugas dari layanan antrian yang dihosting, kamu dapat menambahkan bagian berikut ke manifes HorizontalPodAutoscaler untuk menentukan bahwa kamu memerlukan satu pekerja per 30 tugas yang belum diselesaikan.

```yaml
- type: External
  external:
    metric:
      name: queue_messages_ready
      selector: "queue=worker_tasks"
    target:
      type: AverageValue
      averageValue: 30
```

Jika memungkinkan, lebih baik menggunakan target metrik khusus daripada metrik eksternal, karena lebih mudah bagi administrator klaster untuk mengamankan API metrik khusus. API metrik eksternal berpotensi memungkinkan akses ke metrik apa pun, jadi administrator klaster harus berhati-hati saat mengeksposnya.

## Lampiran: Kondisi Status Horizontal Pod Autoscaler

Saat menggunakan bentuk `autoscaling/v2beta2` dari HorizontalPodAutoscaler, kamu akan dapat melihat
*status condition* yang ditetapkan oleh Kubernetes pada HorizontalPodAutoscaler. _Status condition_ ini menunjukkan apakah HorizontalPodAutoscaler dapat melakukan penyekalaan atau tidak, dan apakah saat ini dibatasi atau tidak.

Kondisi muncul pada _field_ `status.conditions`. Untuk melihat kondisi yang memengaruhi HorizontalPodAutoscaler, kita bisa menggunakan `kubectl description hpa`:

```shell
kubectl describe hpa cm-test
```
```shell
Name:                           cm-test
Namespace:                      prom
Labels:                         <none>
Annotations:                    <none>
CreationTimestamp:              Fri, 16 Jun 2017 18:09:22 +0000
Reference:                      ReplicationController/cm-test
Metrics:                        ( current / target )
  "http_requests" on pods:      66m / 500m
Min replicas:                   1
Max replicas:                   4
ReplicationController pods:     1 current / 1 desired
Conditions:
  Type                  Status  Reason                  Message
  ----                  ------  ------                  -------
  AbleToScale           True    ReadyForNewScale        the last scale time was sufficiently old as to warrant a new scale
  ScalingActive         True    ValidMetricFound        the HPA was able to successfully calculate a replica count from pods metric http_requests
  ScalingLimited        False   DesiredWithinRange      the desired replica count is within the acceptable range
Events:
```

Untuk HorizontalPodAutoscaler ini, kita dapat melihat beberapa kondisi yang menandakan dalam keadaan sehat. Yang pertama, `AbleToScale`, menunjukkan apakah HPA dapat mengambil dan memperbarui skala atau tidak, serta apakah kondisi terkait _backoff_ akan mencegah penyekalaan atau tidak. Yang kedua, `ScalingActive`, menunjukkan apakah HPA diaktifkan atau tidak (yaitu jumlah replika target bukan nol) dan mampu menghitung skala yang diinginkan. Jika `False`, biasanya menunjukkan masalah dengan
pengambilan metrik. Terakhir, kondisi terakhir, `ScalingLimited`, menunjukkan bahwa skala yang diinginkan telah dibatasi oleh maksimum atau minimum HorizontalPodAutoscaler.  Ini adalah indikasi bahwa kamu mungkin ingin menaikkan atau menurunkan batasan jumlah replika minimum atau maksimum pada HorizontalPodAutoscaler kamu.

## Lampiran: Kuantitas

Semua metrik di HorizontalPodAutoscaler dan metrik API ditentukan menggunakan notasi bilangan bulat khusus yang dikenal di Kubernetes sebagai {{< glossary_tooltip term_id="quantity" text="kuantitas">}}. Misalnya, kuantitas `10500m` akan ditulis sebagai `10.5` dalam notasi desimal. Metrik API akan menampilkan bilangan bulat tanpa sufiks jika memungkinkan, dan secara umum akan mengembalikan kuantitas dalam satuan mili. Ini berarti kamu mungkin melihat nilai metrik berfluktuasi antara `1` dan `1500m`, atau `1` dan `1,5` ketika ditulis dalam notasi desimal.

## Lampiran: Skenario lain yang memungkinkan

### Membuat autoscaler secara deklaratif

Daripada menggunakan perintah `kubectl autoscale` untuk membuat HorizontalPodAutoscaler secara imperatif, kita dapat menggunakan berkas berikut untuk membuatnya secara deklaratif:

{{% codenew file="application/hpa/php-apache.yaml" %}}

Kita akan membuat _autoscaler_ dengan menjalankan perintah berikut:

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```
```
horizontalpodautoscaler.autoscaling/php-apache created
```


