---
title: Membuat Load Balancer Eksternal
content_type: task
weight: 80
---


<!-- overview -->

Laman ini menjelaskan bagaimana membuat _Load Balancer_ Eksternal.

{{< note >}}
Fitur ini hanya tersedia untuk penyedia cloud atau lingkungan yang mendukung _load balancer_ eksternal.
{{< /note >}}

Ketika membuat Service, kamu mempunyai opsi untuk tersambung dengan jaringan cloud _load balancer_ secara otomatis.
Hal ini menyediakan akses eksternal alamat IP yang dapat mengirim lalu lintas melalui porta yang tepat pada klaster Node kamu
_asalkan klaster kamu beroperasi pada lingkungan yang mendukung dan terkonfigurasi dengan paket penyedia cloud load balancer yang benar_.

Untuk informasi mengenai penyediaan dan penggunaan sumber daya Ingress yang dapat memberikan
servis URL yang dapat dijangkau secara eksternal, penyeimbang beban lalu lintas, terminasi SSL, dll.,
silahkan cek dokumentasi [Ingress](/id/docs/concepts/services-networking/ingress/)



## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## Berkas konfigurasi

Untuk membuat _load balancer_ eksternal, tambahkan baris di bawah ini ke
[berkas konfigurasi Service](/id/docs/concepts/services-networking/service/#loadbalancer) kamu:

```yaml
    type: LoadBalancer
```

Berkas konfigurasi kamu mungkin terlihat seperti ini:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  type: LoadBalancer
```

## Menggunakan kubectl

Kamu dapat membuat Service dengan perintah `kubectl expose` dan
_flag_ `--type=LoadBalancer`:

```bash
kubectl expose rc example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

Perintah ini membuat Service baru dengan menggunakan pemilih yang sama dengan
sumber daya yang dirujuk (dalam hal contoh di atas, ReplicationController bernama `example`).

Untuk informasi lebih lanjut, termasuk opsi _flag_, mengacu kepada
[referensi `kubectl expose`](/docs/reference/generated/kubectl/kubectl-commands/#expose).

## Menemukan alamat IP kamu

Kamu dapat menemukan alamat IP yang telah dibuat untuk Service kamu dengan mendapatkan
informasi Service melalui `kubectl`:

```bash
kubectl describe services example-service
```

yang seharusnya menghasilkan keluaran seperti ini:

```bash
    Name:                   example-service
    Namespace:              default
    Labels:                 <none>
    Annotations:            <none>
    Selector:               app=example
    Type:                   LoadBalancer
    IP:                     10.67.252.103
    LoadBalancer Ingress:   192.0.2.89
    Port:                   <unnamed> 80/TCP
    NodePort:               <unnamed> 32445/TCP
    Endpoints:              10.64.0.4:80,10.64.1.5:80,10.64.2.4:80
    Session Affinity:       None
    Events:                 <none>
```

Alamat IP tercantum di sebelah `LoadBalancer Ingress`.

{{< note >}}
Jika kamu menjalankan Service dari Minikube, kamu dapat menemukan alamat IP dan porta yang ditetapkan dengan:
{{< /note >}}

```bash
minikube service example-service --url
```

## Preservasi IP sumber klien

Implementasi dari fitur ini menyebabkan sumber IP yang terlihat pada Container
target *bukan sebagai sumber IP asli* dari klien. Untuk mengaktifkan
preservasi IP klien, bidang berikut dapat dikonfigurasikan di dalam
spek Service (mendukung lingkungan GCE/Google Kubernetes Engine):

* `service.spec.externalTrafficPolicy` - menunjukkan jika Service menginginkan rute lalu lintas
eksternal ke titik akhir _node-local_ atau _cluster-wide_. Terdapat dua opsi yang tersedia:
`Cluster` (bawaan) dan `Local`. `Cluster` mengaburkan sumber IP klien dan mungkin menyebabkan
hop kedua ke Node berbeda, namun harus mempunyai penyebaran beban (_load-spreading_) yang baik secara keseluruhan.
`Local` mempreservasi sumber IP client dan menghindari hop kedua `LoadBalancer` dan Service dengan tipe `NodePort`, namun
resiko berpotensi penyebaran lalu lintas yang tidak merata.
* `service.spec.healthCheckNodePort` - menentukan pemeriksaan kesehatan porta dari sebuah Node (angka porta numerik) untuk Service.
Jika `healthCheckNodePort` tidak ditentukan, pengendali Service mengalokasi
porta dari rentang `NodePort` dari klaster kamu. Kamu dapat mengonfigurasi
rentangan tersebut dari pengaturan opsi barisan perintah API server,
`--service-node-port-range`. Hal itu menggunakan nilai `healthCheckNodePort` pengguna spesifik
jika ditentukan oleh klien. Hal itu dapat berefek hanya ketika `type` diset ke `LoadBalancer` dan
`externalTrafficPolicy` diset ke `Local`.

Pengaturan `externalTrafficPolicy` ke `Local` pada berkas konfigurasi Service mengaktifkan
fitur ini.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  externalTrafficPolicy: Local
  type: LoadBalancer
```

## Pengumpul Sampah (Garbage Collector) Load Balancer

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Pada kasus biasa, sumber daya _load balancer_ yang berkorelasi pada penyedia cloud perlu
dibersihkan segera setelah Service bertipe _LoadBalancer_ dihapus. Namun perlu diketahui
bahwa terdapat kasus tepi dimana sumber daya cloud yatim piatu (_orphaned_) setelah
Service yang berkaitan dihapus. _Finalizer Protection_ untuk Service _LoadBalancer_
diperkenalkan untuk mencegah hal ini terjadi. Dengan menggunakan _finalizers_, sebuah sumber daya Service
tidak akan pernah dihapus hingga sumber daya _load balancer_ yang berkorelasi juga dihapus.

Secara khusus, jika Service mempunyai `type LoadBalancer`, pengendali Service akan melekatkan
_finalizer_ bernama `service.kubernetes.io/load-balancer-cleanup`.
_Finalizer_ hanya akan dihapus setelah sumber daya _load balancer_ dibersihkan.
Hal ini mencegah sumber daya _load balancer_ yang teruntai bahkan setelah kasus tepi seperti
pengendali Service berhenti.

## Penyedia Load Balancer Eksternal

Penting untuk dicatat bahwa jalur data untuk fungsionalitas ini disediakan oleh _load balancer_ eksternal ke klaster Kubernetes.

Ketika Service `type` diset `LoadBalancer`, Kubernetes menyediakan fungsionalitas yang ekuivalen dengan `type` sebanding `ClusterIP`
ke berbagai Pod di dalam klaster dan mengekstensinya dengan pemrograman (eksternal dari Kubernetes) _load balancer_ dengan entri pada Pod
Kubernetes. Pengendali Service Kubernetes mengotomasi pembuatan _load balancer_ eksternal, cek kesehatan (jika dibutuhkan),
dinding api (_firewall_) (jika dibutuhkan), dan mengambil IP eksternal yang dialokasikan oleh penyedia cloud dan mengisinya pada objek Service.

## Peringatan dan and Limitasi ketika preservasi sumber IP

_Load balancers_ GCE/AWS tidak menyediakan bobot pada kolam targetnya (target pools). Hal ini bukan merupakan isu dengan aturan kube-proxy
_Load balancer_ lama yang akan menyeimbangkan semua titik akhir dengan benar.

Dengan fungsionalitas yang baru, lalu lintas eksternal tidak menyeimbangkan beban secara merata pada seluruh Pod, namun
sebaliknya menyeimbangkan secara merata pada level Node (karena GCE/AWS dan implementasi _load balancer_ eksternal lainnya tidak mempunyai
kemampuan untuk menentukan bobot setiap Node, mereka menyeimbangkan secara merata pada semua Node target, mengabaikan jumlah
Pod pada tiap Node).


Namun demikian, kita dapat menyatakan bahwa NumServicePods << NumNodes atau NumServicePods >> NumNodes, distribusi yang cukup mendekati
sama akan terlihat, meski tanpa bobot.

Sekali _load balancer_ eksternal menyediakan bobot, fungsionalitas ini dapat ditambahkan pada jalur pemrograman _load balancer_.
*Pekerjaan Masa Depan: Tidak adanya dukungan untuk bobot yang disediakan untuk rilis 1.4, namun dapat ditambahkan di masa mendatang*

Pod internal ke lalu lintas Pod harus berperilaku sama seperti Service ClusterIP, dengan probabilitas yang sama pada seluruh Pod. 


