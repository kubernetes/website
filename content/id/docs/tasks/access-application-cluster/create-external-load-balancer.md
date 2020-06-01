---
title: Membuat Load Balancer Eksternal
content_template: templates/task
weight: 80
---


{{% capture overview %}}

Halaman ini menjelaskan bagaimana membuat _Load Balancer_ Eksternal.

{{< note >}}
Fitur ini hanya tersedia untuk penyedia _cloud_ atau lingkungan yang mendukung _load balancer_ eksternal.
{{< /note >}}

Ketika membuat servis, kamu mempunyai opsi untuk membuat jaringan _cloud load balancer_ secara otomatis.
Hal ini menyediakan akses eksternal alamat IP yang dapat mengirim lalu lintas melalui porta yang tepat pada klaster _node_ kamu
_asalkan klaster kamu beroperasi pada lingkungan yang mendukung dan terkonfigurasi dengan paket penyedia cloud load balancer yang benar_.

Untuk informasi mengenai penyediaan dan penggunaan sumber daya _Ingress_ yang dapat memberikan
servis URL yang dapat dijangkau secara eksternal, penyeimbang beban lalu lintas, terminasi SSL, dll.,
silahkan cek dokumentasi [_Ingress_](/docs/concepts/services-networking/ingress/)

{{% /capture %}}

{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Berkas konfigurasi

Untuk membuat _load balancer_ eksternal, tambahkan baris dibawah ini ke
[berkas konfigurasi servis](/docs/concepts/services-networking/service/#loadbalancer) kamu:

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

Kamu dapat membuat servis dengan perintah `kubectl expose` dan
_flag_ `--type=LoadBalancer`:

```bash
kubectl expose rc example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

Perintah ini membuat servis baru dengan menggunakan pemilih yang sama dengan
sumber daya yang dirujuk (dalam hal contoh diatas, pengendali replikasi bernama `example`).

Untuk informasi lebih lanjut, termasuk opsi _flag_, mengacu kepada
[referensi `kubectl expose`](/docs/reference/generated/kubectl/kubectl-commands/#expose).

## Menemukan alamat IP kamu

Kamu dapat menemukan alamat IP yang telah dibuat untuk servis kamu dengan mendapatkan
informasi servis melalui `kubectl`:

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
Juka kamu menjalankan servis dari Minikube, kamu dapat menemukan alamat IP dan porta yang ditetapkan dengan:
{{< /note >}}

```bash
minikube service example-service --url
```

## Preservasi IP sumber klien

Dikarenakan implementasi fitur ini, sumber IP yang terlihat pada _container_
target *bukan sebagai sumber IP asli* dari klien. Untuk mengaktifkan
preservasi IP klien, bidang berikut dapat dikonfigurasikan didalam
spek servis (mendukung lingkungan GCE/Google Kubernetes Engine):

* `service.spec.externalTrafficPolicy` - menunjukan jika Service menginginkan untuk merute lalu lintas
eksternal ke titik akhir _node-local_ atau _cluster-wide_. Terdapat dua opsi yang tersedia:
Cluster (_default_) dan Local. Cluster mengaburkan sumber IP klien dan mungkin menyebabkan
hop kedua ke _node_ berbeda, namun harus mempunyai _load-spreading_ yang baik secara keseluruhan.
Local mempreservasi sumber IP client dan menghindari hop kedua _LoadBalancer_ dan servis tipe _NodePort_, namun
resiko berpotensi penyebaran lalu lintas yang tidak merata.
* `service.spec.healthCheckNodePort` - menentukan cek kesehatan _node_ porta (nomor porta numerik) untuk servis.
Jika `healthCheckNodePort` tidak ditentukan, pengendali servis mengalokasi
porta dari bentangan _NodePort_ dari klaster kamu. Kamu dapat mengonfigurasi
bentangan tersebut dari pengaturan opsi barisan perintah API server,
`--service-node-port-range`. Hal itu menggunakan nilai `healthCheckNodePort` pengguna spesifik
jika ditentukan oleh klien. Hal itu dapat berefek hanya ketika `type` diset ke _LoadBalancer_ dan
`externalTrafficPolicy` diset ke Local.

Pengaturan `externalTrafficPolicy` ke Local pada berkas konfigurasi Service mengaktifkan
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

## Pengumpul Sampah Load Balancers

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

Pada kasus biasa, sumber daya _load balancer_ yang berkorelasi pada penyedia _cloud_ perlu
dibersihkan segera setelah Service bertipe _LoadBalancer_ dihapus. Namun perlu diketahui
bahwa terdapat kasus tepi dimana sumber daya _cloud_ yatim piatu (_orphaned_) setelah
Service yang berkaitan dihapus. _Finalizer Protection_ untuk Service _LoadBalancer_
diperkenalkan untuk mencegah hal ini terjadi. Dengan menggunakan _finalizers_, sebuah sumber daya Service
tidak akan pernah dihapus hingga sumber daya _load balancer_ yang berkorelasi juga dihapus.

Secara khusus, jika Service mempunyai `type` _LoadBalancer_, pengendali servis akan melekatkan
_finalizer_ bernama `service.kubernetes.io/load-balancer-cleanup`.
_Finalizer_ hanya akan dihapus setelah sumber daya _load balancer_ dibersihkan.
Hal ini mencegah sumber daya _load balancer_ yang teruntai bahkan setelah kasus tepi seperti
pengendali servis berhenti.

## Penyedia Load Balancer Eksternal

Penting untuk dicatat bahwa jalur data untuk fungsionalitas ini disediakan oleh _load balancer_ eksternal ke klaster Kubernetes.

Ketika Service `type` diset `LoadBalancer`, Kubernetes menediakan fungsionalitas yang ekuivalen dengan `type` sebanding ClusterIP
ke _pods_ dalam klaster dan mengekstensinya dengan pemrograman (eksternal ke Kubernetes) _load balancer_ dengan entri pada pods
Kubernetes. Pengendali servis Kubernetes mengotomasi pembuatan _load balancer_ eksternal, cek kesehatan (jika dibutuhkan),
dinding api (jika dibutuhkan), dan mengambil IP eksternal yang dialokasikan oleh penyedia _cloud_ dan mengisinya pada objek servis.

## Peringatan dan and Limitasi ketika preservasi sumber IP

_Load balancers_ GCE/AWS tidak menyediakan bobot pada kolam targetnya. Hal ini bukan merupakan isu dengan aturan kube-proxy
LB lama yang akan menyeimbangkan semua titik akhir dengan benar.

Dengan fungsionalitas yang baru, lalu lintas eksternal tidak menyeimbangkan beban secara merata pada seluruh pods, namun
sebaliknya menyeimbangkan secara merata pada level _node_ (karena GCE/AWS dan implementasi LB eksternal lainnya tidak mempunyai
kemampuan untuk menentukan bobot setiap _node_, mereka menyeimbangkan secara merata pada semua _node_ target, mengabaikan jumlah
_pods_ pada tiap _node_).


Namun demikian, kita dapat menyatakan bahwa NumServicePods << NumNodes or NumServicePods >> NumNodes, distribusi yang cukup mendekati
sama akan terlihat, meski tanpa bobot.

Sekali _load balancers_ eksternal menyediakan bobot, fungsionalitas ini dapat ditambahkan pada jalur pemrograman LB.
*Pekerjaan Masa Depan: Tidak adanya dukungan untuk bobot yang disediakan untuk rilis 1.4, namun dapat ditambahkan di masa mendatang*

_Pod_ internal ke lalu lintas _pod_ harus berperilaku sama seperti servis ClusterIP, dengan probabilitas yang sama pada seluruh _pods_. 

{{% /capture %}}
