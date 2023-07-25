---
title: Menghubungkan aplikasi dengan Service
content_type: concept
weight: 30
---


<!-- overview -->

## Model Kubernetes untuk menghubungkan kontainer

Sekarang kamu memiliki aplikasi yang telah direplikasi, kamu dapat mengeksposnya di jaringan. Sebelum membahas pendekatan jaringan di Kubernetes, akan lebih baik jika kamu paham bagaimana jaringan bekerja di dalam *Docker*.

Secara *default*, *Docker* menggunakan jaringan *host*, jadi kontainer dapat berkomunikasi dengan kontainer lainnya jika mereka berada di dalam *node* yang sama. Agar kontainer *Docker* dapat berkomunikasi antar *node*, masing-masing kontainer tersebut harus diberikan *port* yang berbeda di alamat IP *node* tersebut, yang akan diteruskan (*proxied*) ke dalam kontainer. Artinya adalah para kontainer di dalam sebuah *node* harus berkoordinasi *port* mana yang akan digunakan atau dialokasikan secara otomatis.

Akan sulit untuk mengkoordinasikan *port* yang digunakan oleh banyak pengembang. Kubernetes mengasumsikan bahwa *Pod* dapat berkomunikasi dengan *Pod* lain, terlepas di *Node* mana *Pod* tersebut di *deploy*. Kubernetes memberikan setiap *Pod* alamat *ClusterIP* sehingga kamu tidak perlu secara explisit membuat jalur antara *Pod* ataupun memetakan *port* kontainer ke dalam *port* di dalam *Node* tersebut. Ini berarti kontainer di dalam sebuah *Pod* dapat berkomunikasi dengan *localhost* via *port*, dan setiap *Pod* di dalam klaster dapat berkomunikasi tanpa *NAT*. Panduan ini akan membahas bagaimana kamu dapat menjalankan sebuah layanan atau aplikasi di dalam model jaringan di atas.

Panduan ini menggunakan server *nginx* sederhana untuk mendemonstrasikan konsepnya. Konsep yang sama juga ditulis lebih lengkap di [Aplikasi Jenkins CI](https://kubernetes.io/blog/2015/07/strong-simple-ssl-for-kubernetes).



<!-- body -->

## Mengekspos Pod ke dalam klaster

Kita melakukan ini di beberapa contoh sebelumnya, tetapi mari kita lakukan sekali lagi dan berfokus pada prespektif jaringannya. Buat sebuah *nginx Pod*, dan perhatikan bahwa templat tersebut mempunyai spesifikasi *port* kontainer:

{{% codenew file="service/networking/run-my-nginx.yaml" %}}

Ini membuat aplikasi tersebut dapat diakses dari *node* manapun di dalam klaster kamu. Cek lokasi *node* dimana *Pod* tersebut berjalan:
```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```
Cek IP dari *Pod* kamu:

```shell
kubectl get pods -l run=my-nginx -o yaml | grep podIP
    podIP: 10.244.3.4
    podIP: 10.244.2.5
```

Kamu dapat melakukan akses dengan *ssh* ke dalam *node* di dalam klaster dan mengakses IP *Pod* tersebut menggunakan *curl*. Perlu dicatat bahwa kontainer tersebut tidak menggunakan *port* 80 di dalam *node*, atau aturan *NAT* khusus untuk merutekan trafik ke dalam *Pod*. Ini berarti kamu dapat menjalankan banyak *nginx Pod* di *node* yang sama dimana setiap *Pod* dapat menggunakan *containerPort* yang sama, kamu dapat mengakses semua itu dari *Pod* lain ataupun dari *node* di dalam klaster menggunakan IP. Seperti *Docker*, *port* masih dapat di publikasi ke dalam * interface node*, tetapi kebutuhan seperti ini sudah berkurang karena model jaringannya.

Kamu dapat membaca lebih detail [bagaimana kita melakukan ini](/id/docs/concepts/cluster-administration/networking/#how-to-achieve-this) jika kamu penasaran.

## Membuat Service

Kita mempunyai *Pod* yang menjalankan *nginx* di dalam klaster. Teorinya, kamu dapat berkomunikasi ke *Pod* tersebut secara langsung, tapi apa yang terjadi jika sebuah *node* mati? *Pod* di dalam *node* tersebut ikut mati, dan *Deployment* akan membuat *Pod* baru, dengan IP yang berbeda. Ini adalah masalah yang *Service* selesaikan.

*Service* Kubernetes adalah sebuah abstraksi yang mendefinisikan sekumpulan *Pod* yang menyediakan fungsi yang sama dan berjalan di dalam klaster. Saat dibuat, setiap *Service* diberikan sebuah alamat IP (disebut juga *ClusterIP*). Alamat ini akan terus ada, dan tidak akan pernah berubah selama *Service* hidup. *Pod* dapat berkomunikasi dengan *Service* dan trafik yang menuju *Service* tersebut akan otomatis dilakukan mekanisme *load balancing* ke *Pod* yang merupakan anggota dari *Service* tersebut.

Kamu dapat membuat *Service* untuk replika 2 *nginx* dengan `kubectl explose`:

```shell
kubectl expose deployment/my-nginx
```
```
service/my-nginx exposed
```

Perintah di atas sama dengan `kubectl apply -f` dengan *yaml* sebagai berikut:

{{% codenew file="service/networking/nginx-svc.yaml" %}}

Spesifikasi ini akan membuat *Service* yang membuka *TCP port 80* di setiap *Pod* dengan label `run: my-nginx` dan mengeksposnya ke dalam *port Service* (`targetPort`: adalah port kontainer yang menerima trafik, `port` adalah *service port* yang dapat berupa *port* apapun yang digunakan *Pod* lain untuk mengakses *Service*).

Lihat [Service](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)
objek *API* untuk melihat daftar *field* apa saja yang didukung di definisi *Service*. Cek *Service* kamu:

```shell
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

Seperti yang disebutkan sebelumnya, sebuah *Service* berisi sekumpulan *Pod*. *Pod* diekspos melalui `endpoints`. *Service selector* akan mengecek *Pod* secara terus-menerus dan hasilnya akan dikirim (*POSTed*) ke objek *endpoint* yang bernama `my-nginx`. Saat sebuah *Pod* mati, *IP Pod* di dalam *endpoint* tersebut akan otomatis dihapus, dan *Pod* baru yang sesuai dengan *Service selector* akan otomatis ditambahkan ke dalam *endpoint*. Cek *endpoint* dan perhatikan bahwa IP sama dengan *Pod* yang dibuat di langkah pertama:

```shell
kubectl describe svc my-nginx
```
```
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP Family Policy:    SingleStack
IP Families:         IPv4
IP:                  10.0.162.149
IPs:                 10.0.162.149
Port:                <unset> 80/TCP
TargetPort:          80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```
```shell
kubectl get ep my-nginx
```
```
NAME       ENDPOINTS                     AGE
my-nginx   10.244.2.5:80,10.244.3.4:80   1m
```

Kamu sekarang dapat melakukan *curl* ke dalam *nginx Service* di `<CLUSTER-IP>:<PORT>` dari *node* manapun di klaster. Perlu dicatat bahwa *Service IP* adalah IP virtual, IP tersebut tidak pernah ada di *interface node* manapun. Jika kamu penasaran bagaimana konsep ini bekerja, kamu dapat membaca lebih lanjut tentang [service proxy](/id/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies).

## Mengakses Service

Kubernetes mendukung 2 mode utama untuk menemukan sebuah *Service* - variabel *environment* dan *DNS*.
*DNS* membutuhkan [tambahan CoreDNS di dalam klaster](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/coredns).

### Variabel Environment

Saat sebuah *Pod* berjalan di *Node*, *kubelet* akan menambahkan variabel *environment* untuk setiap *Service* yang aktif ke dalam *Pod*. Ini menimbulkan beberapa masalah. Untuk melihatnya, periksa *environment* dari *Pod nginx* yang telah kamu buat (nama *Pod*-mu akan berbeda-beda):

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

Perlu dicatat tidak ada variabel *environment* yang menunjukan *Service* yang kamu buat. Ini terjadi karena kamu membuat replika terlebih dahulu sebelum membuat *Service*. Kerugian lain ditimbulkan adalah bahwa komponen *scheduler* mungkin saja bisa menempatkan semua *Pod* di dalam satu *Node*, yang akan membuat keseluruhan *Service* mati jika *Node* tersebut mati. Kita dapat menyelesaikan masalah ini dengan menghapus 2 *Pod* tersebut dan menunggu *Deployment* untuk membuat *Pod* kembali. Kali ini *Service* ada sebelum replika *Pod* tersebut ada. Ini akan memberikan kamu *scheduler-level Service* (jika semua *Node* kamu mempunyai kapasitas yang sama), serta variabel *environment* yang benar:

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

Kamu mungkin saja melihat *Pod* dengan nama yang berbeda, hal ini terjadi karena *Pod-Pod* itu dihapus dan dibuat ulang.

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

Kubernetes menawarkan sebuah layanan *DNS* klaster tambahan yang secara otomatis memberikan sebuah nama *dns* pada *Service*. Kamu dapat mengecek jika *DNS* berjalan di dalam klaster Kubernetes:

```shell
kubectl get services kube-dns --namespace=kube-system
```
```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

Jika *DNS* belum berjalan, kamu dapat [mengaktifkannya](http://releases.k8s.io/{{< param "githubbranch" >}}/cluster/addons/dns/kube-dns/README.md#how-do-i-configure-it).

Sisa panduan ini mengasumsikan kamu mempunyai *Service* dengan IP (my-nginx), dan sebuah server *DNS*  yang memberikan nama ke dalam IP tersebut (CoreDNS klaster), jadi kamu dapat berkomunikasi dengan *Service* dari *Pod* lain di dalam klaster menggunakan metode standar (contohnya *gethostbyname*). Jalankan aplikasi *curl* lain untuk melakukan pengujian ini:

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty --rm
```
```
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

Lalu tekan *enter* dan jalankan `nslookup my-nginx`:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## Mengamankan Service

Hingga sekarang kita hanya mengakses *nginx* server dari dalam klaster. Sebelum mengekspos *Service* ke internet, kamu harus memastikan bahwa kanal komunikasi aman. Untuk melakukan hal tersebut, kamu membutuhkan:

* *Self signed certificates* untuk *https* (kecuali jika kamu sudah mempunyai *identity certificate*)
* Sebuah server *nginx* yang terkonfigurasi untuk menggunakan *certificate* tersebut
* Sebuah [secret](/id/docs/concepts/configuration/secret/) yang membuat setifikat tersebut dapat diakses oleh *pod*


Kamu dapat melihat semua itu di [contoh nginx https](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/https-nginx/). Contoh ini mengaharuskan kamu melakukan instalasi *go* dan *make*. Jika kamu tidak ingin melakukan instalasi tersebut, ikuti langkah-langkah manualnya nanti, singkatnya:

```shell
make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
```
```
secret/nginxsecret created
```
```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           Opaque                                2         1m
```

Berikut ini adalah langkah-langkah manual yang harus diikuti jika kamu mengalami masalah menjalankan *make* (pada windows contohnya):

```shell
#membuat sebuah key-pair public private
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
#rubah key tersebut ke dalam pengkodean base64
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```
Gunakan hasil keluaran dari perintah sebelumnya untuk membuat sebuah file *yaml* seperti berikut. Nilai yang dikodekan *base64* harus berada di dalam satu baris.

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
data:
  nginx.crt: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIekNDQWdlZ0F3SUJBZ0lKQUp5M3lQK0pzMlpJTUEwR0NTcUdTSWIzRFFFQkJRVUFNQ1l4RVRBUEJnTlYKQkFNVENHNW5hVzU0YzNaak1SRXdEd1lEVlFRS0V3aHVaMmx1ZUhOMll6QWVGdzB4TnpFd01qWXdOekEzTVRKYQpGdzB4T0RFd01qWXdOekEzTVRKYU1DWXhFVEFQQmdOVkJBTVRDRzVuYVc1NGMzWmpNUkV3RHdZRFZRUUtFd2h1CloybHVlSE4yWXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjFxSU1SOVdWM0IKMlZIQlRMRmtobDRONXljMEJxYUhIQktMSnJMcy8vdzZhU3hRS29GbHlJSU94NGUrMlN5ajBFcndCLzlYTnBwbQppeW1CL3JkRldkOXg5UWhBQUxCZkVaTmNiV3NsTVFVcnhBZW50VWt1dk1vLzgvMHRpbGhjc3paenJEYVJ4NEo5Ci82UVRtVVI3a0ZTWUpOWTVQZkR3cGc3dlVvaDZmZ1Voam92VG42eHNVR0M2QURVODBpNXFlZWhNeVI1N2lmU2YKNHZpaXdIY3hnL3lZR1JBRS9mRTRqakxCdmdONjc2SU90S01rZXV3R0ljNDFhd05tNnNTSzRqYUNGeGpYSnZaZQp2by9kTlEybHhHWCtKT2l3SEhXbXNhdGp4WTRaNVk3R1ZoK0QrWnYvcW1mMFgvbVY0Rmo1NzV3ajFMWVBocWtsCmdhSXZYRyt4U1FVQ0F3RUFBYU5RTUU0d0hRWURWUjBPQkJZRUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjcKTUI4R0ExVWRJd1FZTUJhQUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjdNQXdHQTFVZEV3UUZNQU1CQWY4dwpEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRVhTMW9FU0lFaXdyMDhWcVA0K2NwTHI3TW5FMTducDBvMm14alFvCjRGb0RvRjdRZnZqeE04Tzd2TjB0clcxb2pGSW0vWDE4ZnZaL3k4ZzVaWG40Vm8zc3hKVmRBcStNZC9jTStzUGEKNmJjTkNUekZqeFpUV0UrKzE5NS9zb2dmOUZ3VDVDK3U2Q3B5N0M3MTZvUXRUakViV05VdEt4cXI0Nk1OZWNCMApwRFhWZmdWQTRadkR4NFo3S2RiZDY5eXM3OVFHYmg5ZW1PZ05NZFlsSUswSGt0ejF5WU4vbVpmK3FqTkJqbWZjCkNnMnlwbGQ0Wi8rUUNQZjl3SkoybFIrY2FnT0R4elBWcGxNSEcybzgvTHFDdnh6elZPUDUxeXdLZEtxaUMwSVEKQ0I5T2wwWW5scE9UNEh1b2hSUzBPOStlMm9KdFZsNUIyczRpbDlhZ3RTVXFxUlU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
  nginx.key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2RhaURFZlZsZHdkbFIKd1V5eFpJWmVEZWNuTkFhbWh4d1NpeWF5N1AvOE9ta3NVQ3FCWmNpQ0RzZUh2dGtzbzlCSzhBZi9WemFhWm9zcApnZjYzUlZuZmNmVUlRQUN3WHhHVFhHMXJKVEVGSzhRSHA3VkpMcnpLUC9QOUxZcFlYTE0yYzZ3MmtjZUNmZitrCkU1bEVlNUJVbUNUV09UM3c4S1lPNzFLSWVuNEZJWTZMMDUrc2JGQmd1Z0ExUE5JdWFubm9UTWtlZTRuMG4rTDQKb3NCM01ZUDhtQmtRQlAzeE9JNHl3YjREZXUraURyU2pKSHJzQmlIT05Xc0RadXJFaXVJMmdoY1kxeWIyWHI2UAozVFVOcGNSbC9pVG9zQngxcHJHclk4V09HZVdPeGxZZmcvbWIvNnBuOUYvNWxlQlkrZStjSTlTMkQ0YXBKWUdpCkwxeHZzVWtGQWdNQkFBRUNnZ0VBZFhCK0xkbk8ySElOTGo5bWRsb25IUGlHWWVzZ294RGQwci9hQ1Zkank4dlEKTjIwL3FQWkUxek1yall6Ry9kVGhTMmMwc0QxaTBXSjdwR1lGb0xtdXlWTjltY0FXUTM5SjM0VHZaU2FFSWZWNgo5TE1jUHhNTmFsNjRLMFRVbUFQZytGam9QSFlhUUxLOERLOUtnNXNrSE5pOWNzMlY5ckd6VWlVZWtBL0RBUlBTClI3L2ZjUFBacDRuRWVBZmI3WTk1R1llb1p5V21SU3VKdlNyblBESGtUdW1vVlVWdkxMRHRzaG9reUxiTWVtN3oKMmJzVmpwSW1GTHJqbGtmQXlpNHg0WjJrV3YyMFRrdWtsZU1jaVlMbjk4QWxiRi9DSmRLM3QraTRoMTVlR2ZQegpoTnh3bk9QdlVTaDR2Q0o3c2Q5TmtEUGJvS2JneVVHOXBYamZhRGR2UVFLQmdRRFFLM01nUkhkQ1pKNVFqZWFKClFGdXF4cHdnNzhZTjQyL1NwenlUYmtGcVFoQWtyczJxWGx1MDZBRzhrZzIzQkswaHkzaE9zSGgxcXRVK3NHZVAKOWRERHBsUWV0ODZsY2FlR3hoc0V0L1R6cEdtNGFKSm5oNzVVaTVGZk9QTDhPTm1FZ3MxMVRhUldhNzZxelRyMgphRlpjQ2pWV1g0YnRSTHVwSkgrMjZnY0FhUUtCZ1FEQmxVSUUzTnNVOFBBZEYvL25sQVB5VWs1T3lDdWc3dmVyClUycXlrdXFzYnBkSi9hODViT1JhM05IVmpVM25uRGpHVHBWaE9JeXg5TEFrc2RwZEFjVmxvcG9HODhXYk9lMTAKMUdqbnkySmdDK3JVWUZiRGtpUGx1K09IYnRnOXFYcGJMSHBzUVpsMGhucDBYSFNYVm9CMUliQndnMGEyOFVadApCbFBtWmc2d1BRS0JnRHVIUVV2SDZHYTNDVUsxNFdmOFhIcFFnMU16M2VvWTBPQm5iSDRvZUZKZmcraEppSXlnCm9RN3hqWldVR3BIc3AyblRtcHErQWlSNzdyRVhsdlhtOElVU2FsbkNiRGlKY01Pc29RdFBZNS9NczJMRm5LQTQKaENmL0pWb2FtZm1nZEN0ZGtFMXNINE9MR2lJVHdEbTRpb0dWZGIwMllnbzFyb2htNUpLMUI3MkpBb0dBUW01UQpHNDhXOTVhL0w1eSt5dCsyZ3YvUHM2VnBvMjZlTzRNQ3lJazJVem9ZWE9IYnNkODJkaC8xT2sybGdHZlI2K3VuCnc1YytZUXRSTHlhQmd3MUtpbGhFZDBKTWU3cGpUSVpnQWJ0LzVPbnlDak9OVXN2aDJjS2lrQ1Z2dTZsZlBjNkQKckliT2ZIaHhxV0RZK2Q1TGN1YSt2NzJ0RkxhenJsSlBsRzlOZHhrQ2dZRUF5elIzT3UyMDNRVVV6bUlCRkwzZAp4Wm5XZ0JLSEo3TnNxcGFWb2RjL0d5aGVycjFDZzE2MmJaSjJDV2RsZkI0VEdtUjZZdmxTZEFOOFRwUWhFbUtKCnFBLzVzdHdxNWd0WGVLOVJmMWxXK29xNThRNTBxMmk1NVdUTThoSDZhTjlaMTltZ0FGdE5VdGNqQUx2dFYxdEYKWSs4WFJkSHJaRnBIWll2NWkwVW1VbGc9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K"
```
Sekarang buat *secrets* menggunakan file tersebut:
```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
default-token-il9rc   kubernetes.io/service-account-token   1         1d
nginxsecret           Opaque                                2         1m
```

Sekarang modifikasi replika *nginx* untuk menjalankan server *https* menggunakan *certificate* di dalam *secret* dan *Service* untuk mengekspos semua *port* (80 dan 443):

{{% codenew file="service/networking/nginx-secure-app.yaml" %}}

Berikut catatan penting tentang manifes *nginx-secure-app*:

- di dalam file tersebut, ada spesifikasi *Deployment* dan *Service*
- ada [server nginx](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/staging/https-nginx/default.conf) yang melayani trafik *HTTP* di *port* 80 dan trafik *HTTPS* di *port* 443, dan *Service nginx* yang mengekspos kedua *port* tersebut.
- Setiap kontainer mempunyai akses ke *key* melalui *volume* yang di *mount* pada `/etc/nginx/ssl`. Ini adalah konfigurasi sebelum server *nginx* dijalankan.

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

Pada tahapan ini, kamu dapat berkomunikasi dengan server *nginx* dari *node* manapun.

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.5]]
```

```shell
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

Perlu dicatat bahwa kita menggunakan parameter `-k` saat menggunakan *curl*, ini karena kita tidak tau apapun tentang *Pod* yang menjalankan *nginx* saat pembuatan seritifikat, jadi kita harus memberitahu *curl* untuk mengabaikan ketidakcocokan *CName*. Dengan membuat *Service*, kita menghubungkan *CName* yang digunakan pada *certificate* dengan nama pada *DNS* yang digunakan *Pod*. Lakukan pengujian dari sebuah *Pod* (*secret* yang sama digunakan untuk agar mudah, *Pod* tersebut hanya membutuhkan *nginx.crt* untuk mengakses *Service*)

{{% codenew file="service/networking/curlpod.yaml" %}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```
```
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```
```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/nginx.crt
...
<title>Welcome to nginx!</title>
...
```

## Mengekspos Service

Kamu mungkin ingin mengekspos *Service* ke alamat IP eksternal. Kubernetes mendukung dua cara untuk melakukan ini: *NodePort* dan *LoadBalancer*. *Service* yang dibuat tadi sudah menggunakan `NodePort`, jadi replika *nginx* sudah siap untuk menerima trafik dari internet jika *Node* kamu mempunyai IP publik.


```shell
kubectl get svc my-nginx -o yaml | grep nodePort -C 5
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx
```
```shell
kubectl get nodes -o yaml | grep ExternalIP -C 1
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Welcome to nginx!</h1>
```

Mari coba membuat ulang *Service* menggunakan *cloud load balancer*, ubah saja `type` *Service* `my-nginx`  dari `NodePort` ke `LoadBalancer`:

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   ClusterIP   10.0.162.149   162.222.184.144    80/TCP,81/TCP,82/TCP  21s
```
```
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

IP address pada kolom `EXTERNAL-IP` menunjukan IP yang tersedia di internet. Sedangkan kolom `CLUSTER-IP` merupakan IP yang hanya tersedia di dalam klaster kamu (*IP private*).

Perhatikan pada *AWS*, tipe `LoadBalancer` membuat sebuah *ELB*, yang menggunakan *hostname* yang panjang, bukan IP. Karena tidak semua keluar pada standar keluaran `kubectl get svc`. Jadi kamu harus menggunakan `kubectl describe service my-nginx` untuk melihatnya. Kamu akan melihat seperti ini:

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```



## {{% heading "whatsnext" %}}


Kubernetes juga mendukung *Federated Service*, yang bisa mempengaruhi banyak klaster dan penyedia layanan *cloud*, untuk meningkatkan ketersediaan, peningkatan toleransi kesalahan, dan pengembangan dari *Service* kamu. Lihat [Panduan Federated Service](/id/docs/concepts/cluster-administration/federation-service-discovery/) untuk informasi lebih lanjut.


