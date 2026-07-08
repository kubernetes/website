---
title: Contekan kubectl
content_type: concept
card:
  name: reference
  weight: 30
---

<!-- overview -->

Lihat juga: [Ikhitsar Kubectl](/docs/reference/kubectl/overview/) dan [Panduan JsonPath](/docs/reference/kubectl/jsonpath).

Laman ini merupakan ikhitisar dari perintah `kubectl`.



<!-- body -->

# kubectl - Contekan

## Autocomplete Kubectl

### BASH

```bash
source <(kubectl completion bash) # menyiapkan autocomplete untuk bash ke dalam shell saat ini, paket bash-completion harus diinstal terlebih dahulu.
echo "source <(kubectl completion bash)" >> ~/.bashrc # menambahkan autocomplete secara permanen ke dalam bash shell kamu.
```

Kamu juga dapat menggunakan alias singkatan untuk `kubectl` yang juga bisa berfungsi dengan _completion_:

```bash
alias k=kubectl
complete -F __start_kubectl k
```

### ZSH


```bash
source <(kubectl completion zsh)  # menyiapkan autocomplete untuk zsh ke dalam shell saat ini.
echo "[[ $commands[kubectl] ]] && source <(kubectl completion zsh)" >> ~/.zshrc # menambahkan autocomplete secara permanen ke dalam zsh shell kamu.
```

## Konteks Kubectl dan Konfigurasinya

Memilih klaster Kubernetes yang mana yang ditembak oleh `kubectl` untuk berkomunikasi dan
diubah konfigurasinya. Lihat dokumentasi [Otentikasi ke berbagai Klaster dengan kubeconfig](/id/docs/tasks/access-application-cluster/configure-access-multiple-clusters/) untuk mengetahui informasi tentang berkas konfigurasi ini secara detail.

```bash
kubectl config view # memperlihatkan setelan kubeconfig yang sudah digabung (merged)

# menggunakan beberapa berkas kubeconfig sekaligus dan melihat semua konfigurasinya sekaligus (merged)
KUBECONFIG=~/.kube/config:~/.kube/kubconfig2 

kubectl config view

# mendapatkan kata sandi untuk pengguna e2e
kubectl config view -o jsonpath='{.users[?(@.name == "e2e")].user.password}'

kubectl config view -o jsonpath='{.users[].name}'    # memperlihatkan pengguna pertama
kubectl config view -o jsonpath='{.users[*].name}'   # mendapatkan daftar pengguna
kubectl config get-contexts                          # memperlihatkan daftar konteks
kubectl config current-context                       # memperlihatkan konteks saat ini
kubectl config use-context my-cluster-name           # menyetel konteks bawaan menjadi my-cluster-name

# menambahkan seorang pengguna baru ke dalam kubeconf kamu yang mendukung basic auth
kubectl config set-credentials kubeuser/foo.kubernetes.com --username=kubeuser --password=kubepassword

# menyimpan Namespace secara permanen untuk semua perintah kubectl pada konteks tersebut
kubectl config set-context --current --namespace=ggckad-s2

# menyetel konteks yang menggunakan pengguna dan namespace yang spesifik
kubectl config set-context gce --user=cluster-admin --namespace=foo \
  && kubectl config use-context gce
 
kubectl config unset users.foo                       # menghapus pengguna foo
```

## Menerapkan

`apply` (menerapkan) mengelola aplikasi melalui berkas-berkas yang berisi definisi tentang sumber daya Kubernetes. Perintah ini membuat dan memperbarui
sumber daya di dalam sebuah klaster dengan menjalankan `kubectl apply`. Ini merupakan cara yang disarankan untuk mengelola aplikasi di dalam _production_.
Lihat [Buku Kubectl](https://kubectl.docs.kubernetes.io).

## Membuat Objek

Manifes Kubernetes dapat didefinisikan ke dalam YAML atau JSON. Gunakan berkas dengan ekstensi `.yaml`,
`.yml`, dan `.json`.

```bash
kubectl apply -f ./my-manifest.yaml            # membuat sumber daya
kubectl apply -f ./my1.yaml -f ./my2.yaml      # membuat sumber daya dari beberapa berkas
kubectl apply -f ./dir                         # membuat sumber daya dari berbagai berkas manifes yang ada di dalam direktori
kubectl apply -f https://git.io/vPieo          # membuat sumber daya dari sebuah tautan
kubectl create deployment nginx --image=nginx  # memulai sebuah instans tunggal nginx
kubectl explain pods                           # mendapatkan dokumentasi untuk manifes Pod

# membuat beberapa objek YAML dari masukan (stdin)
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000000"
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox-sleep-less
spec:
  containers:
  - name: busybox
    image: busybox
    args:
    - sleep
    - "1000"
EOF

# membuat sebuah Secret dengan beberapa kunci (key)
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  password: $(echo -n "s33msi4" | base64 -w0)
  username: $(echo -n "jane" | base64 -w0)
EOF

```

## Melihat, Mencari Sumber Daya

```bash
# mendapatkan berbagai perintah dengan keluaran dasar
kubectl get services                          # mendapatkan semua Service di dalam Namespace saat ini
kubectl get pods --all-namespaces             # mendapatkan semua Pod di dalam semua Namespace
kubectl get pods -o wide                      # mendapatkan semua Pod di dalam Namespace saat ini, dengan informasi tambahan
kubectl get deployment my-dep                 # mendapatkan Deployment tertentu
kubectl get pods                              # mendapatkan semua Pod di dalam Namespace saat ini
kubectl get pod my-pod -o yaml                # mendapatkan spesifikasi YAML dari Pod tertentu

# menggambarkan berbagai perintah dengan keluaran yang lengkap (verbose)
kubectl describe nodes my-node
kubectl describe pods my-pod

# mendapatkan semua Service yang diurutkan berdasar nama
kubectl get services --sort-by=.metadata.name

# mendapatkan semua Pod yang diurut berdasarkan jumlah restart
kubectl get pods --sort-by='.status.containerStatuses[0].restartCount'

# mendapatkan PersistentVolume yang diurut berdasarkan kapasitas
kubectl get pv --sort-by=.spec.capacity.storage

# mendapatkan label versi dari semua Pod dengan label app=cassandra
kubectl get pods --selector=app=cassandra -o \
  jsonpath='{.items[*].metadata.labels.version}'

# mendapatkan semua Node pekerja (worker) (selektor digunakan untuk tidak memasukkan
# Node yang memiliki label 'node-role.kubernetes.io/master' ke dalam keluaran)
kubectl get node --selector='!node-role.kubernetes.io/master'

# mendapatkan semua Pod yang sedang berjalan di dalam Namespace saat ini
kubectl get pods --field-selector=status.phase=Running

# mendapatkan ExternalIP dari semua Node
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

# mendapatkan nama dari semua Pod yang termasuk ke dalam RC tertentu
# perintah "jq" berguna untuk mentransformasi keluaran yang terlalu rumit untuk diproses oleh jsonpath, lihat https://stedolan.github.io/jq/
sel=${$(kubectl get rc my-rc --output=json | jq -j '.spec.selector | to_entries | .[] | "\(.key)=\(.value),"')%?}
echo $(kubectl get pods --selector=$sel --output=jsonpath={.items..metadata.name})

# memperlihatkan label yang dimiliki semua Pod (atau objek Kubernetes lainnya yang mendukung label)
kubectl get pods --show-labels

# memeriksa Node mana yang sudah dalam kondisi siap (ready)
JSONPATH='{range .items[*]}{@.metadata.name}:{range @.status.conditions[*]}{@.type}={@.status};{end}{end}' \
 && kubectl get nodes -o jsonpath="$JSONPATH" | grep "Ready=True"

# mendapatkan semua Secret yang sedang digunakan oleh Pod
kubectl get pods -o json | jq '.items[].spec.containers[].env[]?.valueFrom.secretKeyRef.name' | grep -v null | sort | uniq

# mendapatkan semua containerID dari initContainer yang ada di semua Pod,
# berguna untuk membersihkan kontainer yang telah berhenti, tetapi menghindari terhapusnya initContainer
kubectl get pods --all-namespaces -o jsonpath='{range .items[*].status.initContainerStatuses[*]}{.containerID}{"\n"}{end}' | cut -d/ -f3

# mendapatkan Event yang diurut berdasarkan cap waktu (timestamp)
kubectl get events --sort-by=.metadata.creationTimestamp

# membandingkan antara keadaan saat ini dengan keadaan yang diinginkan pada klaster, jika manifes diterpakan
kubectl diff -f ./my-manifest.yaml
```

## Memperbarui Sumber Daya


```bash
kubectl set image deployment/frontend www=image:v2               # memperbarui kontainer "www" secara bergilir dari sebuah Deployment "frontend", memperbarui image-nya
kubectl rollout history deployment/frontend                      # memeriksa sejarah (history) Deployment, termasuk revisinya
kubectl rollout undo deployment/frontend                         # mengembalikan (rollback) ke Deployment sebelumnya
kubectl rollout undo deployment/frontend --to-revision=2         # mengembalikan (rollback) ke revisi tertentu
kubectl rollout status -w deployment/frontend                    # melakukan watch terhadap status pembaruan bergilir dari Deployment "frontend" sampai selesai
kubectl rollout restart deployment/frontend                      # melakukan restart secara bergilir untuk Deployment "frontend"


cat pod.json | kubectl replace -f -                              # menggantikan sebuah Pod berdasarkan JSON yang dilewatkan melalui std

# menggantikan, menghapus, dan membuat ulang sumber daya secara paksa, dapat menyebabkan gagalnya layanan
kubectl replace --force -f ./pod.json

# membuat sebuah Service untuk nginx yang terreplikasi, melayani pada porta 80 dan menghubungkan kontainer pada porta 8000
kubectl expose rc nginx --port=80 --target-port=8000

# memperbarui versi image (tag) yang dimiliki kontainer Pod menjadi versi v4
kubectl get pod mypod -o yaml | sed 's/\(image: myimage\):.*$/\1:v4/' | kubectl replace -f -

kubectl label pods my-pod new-label=awesome                      # menambahkan sebuah label
kubectl annotate pods my-pod icon-url=http://goo.gl/XXBTWq       # menambahkan sebuah anotasi
kubectl autoscale deployment foo --min=2 --max=10                # menskalakan sebuah Deployment "foo" secara otomatis
```

## Menambal (_Patch_) Sumber Daya

```bash
# memperbarui sebuah Node secara parsial
kubectl patch node k8s-node-1 -p '{"spec":{"unschedulable":true}}'

# memperbarui image dari kontainer; spec.containers[*].name diperlukan karena menggunakan kunci merge
kubectl patch pod valid-pod -p '{"spec":{"containers":[{"name":"kubernetes-serve-hostname","image":"new image"}]}}'

# memperbarui image dari kontainer menggunakan patch json dengan array posisi
kubectl patch pod valid-pod --type='json' -p='[{"op": "replace", "path": "/spec/containers/0/image", "value":"new image"}]'

# menonaktifkan sebuah Deployment livenessProbe menggunakan patch json dengan array posisi
kubectl patch deployment valid-deployment  --type json   -p='[{"op": "remove", "path": "/spec/template/spec/containers/0/livenessProbe"}]'

# menambahkan elemen baru ke dalam array posisi
kubectl patch sa default --type='json' -p='[{"op": "add", "path": "/secrets/1", "value": {"name": "whatever" } }]'
```

## Menyunting Sumber Daya

Menyunting sumber daya API menggunakan penyunting (editor) yang biasa kamu gunakan.

```bash
kubectl edit svc/docker-registry                      # menyunting Service yang bernama docker-registry
KUBE_EDITOR="nano" kubectl edit svc/docker-registry   # menggunakan penyunting alternatif
```

## Menskalakan Sumber Daya

```bash
kubectl scale --replicas=3 rs/foo                                 # menskalakan ReplicaSet bernama 'foo' menjadi 3
kubectl scale --replicas=3 -f foo.yaml                            # menskalakan sebuah sumber daya yang dispesifikasikan di dalam "foo.yaml" menjadi 3
kubectl scale --current-replicas=2 --replicas=3 deployment/mysql  # jika Deployment bernama mysql saat ini memiliki ukuran 2, skalakan mysql menjadi 3
kubectl scale --replicas=5 rc/foo rc/bar rc/baz                   # menskalakan beberapa ReplicationController sekaligus
```

## Menghapus Sumber Daya

```bash
kubectl delete -f ./pod.json                                              # menghapus Pod menggunakan tipe dan nama yang dispesifikan di dalam pod.json
kubectl delete pod,service baz foo                                        # menghapus Pod dan Service dengan nama yang sama, yaitu "baz" dan "foo"
kubectl delete pods,services -l name=myLabel                              # menghapus semua Pod dan Service yang memiliki label name=myLabel
kubectl -n my-ns delete pod,svc --all                                     # menghapus semua Pod dan Service di dalam Namespace my-ns
# menghapus semua Pod yang sesuai dengan pattern1 atau pattern2 dari awk
kubectl get pods  -n mynamespace --no-headers=true | awk '/pattern1|pattern2/{print $1}' | xargs  kubectl delete -n mynamespace pod
```

## Berinteraksi dengan Pod yang sedang berjalan

```bash
kubectl logs my-pod                                 # memperlihatkan log dari Pod (keluaran stdout)
kubectl logs -l name=myLabel                        # memperlihatkan log dari Pod dengan label name=myLabel (keluaran stdout)
kubectl logs my-pod --previous                      # memperlihatkan log dari Pod (keluaran stdout) untuk kontainer yang dijalankan sebelumnya
kubectl logs my-pod -c my-container                 # memperlihatkan log dari kontainer di dalam Pod (keluaran stdout, kasus banyak kontainer)
kubectl logs -l name=myLabel -c my-container        # memperlihatkan log dari Pod, dengan label name=myLabel (keluaran stdout)
kubectl logs my-pod -c my-container --previous      # memperlihatkan log dari kontainer di dalam Pod (keluaran stdout, kasus banyak kontainer) untuk kontainer yang dijalankan sebelumnya
kubectl logs -f my-pod                              # memperlihatkan aliran log dari Pod (keluaran stdout)
kubectl logs -f my-pod -c my-container              # memperlihatkan aliran log dari kontainer di dalam Pod (keluaran stdout, kasus banyak kontainer)
kubectl logs -f -l name=myLabel --all-containers    # memperlihatkan aliran log dari Pod dengan label name=myLabel (keluaran stdout)
kubectl run -i --tty busybox --image=busybox -- sh  # menjalankan Pod sebagai shell interaktif
kubectl run nginx --image=nginx --restart=Never -n 
mynamespace                                         # menjalankan Pod nginx ke dalam Namespace tertentu
kubectl run nginx --image=nginx --restart=Never     # menjalankan Pod nginx dan menulis spesifikasinya ke dalam sebuah berkas bernama pod.yaml
--dry-run -o yaml > pod.yaml

kubectl attach my-pod -i                            # melekatkan (meng-attach) ke dalam kontainer yang sedang berjalan
kubectl port-forward my-pod 5000:6000               # mendengar (listen) pada porta 5000 di mesin lokal dan meneruskan ke porta 6000 di Pod my-pod
kubectl exec my-pod -- ls /                         # menjalankan perintah pada Pod my-pod (kasus 1 kontainer)
kubectl exec my-pod -c my-container -- ls /         # menjalankan peirntah pada Pod my-pod (kasus banyak kontainer)
kubectl top pod POD_NAME --containers               # memperlihatkan metrik yang dimiliki Pod bersama kontainernya
```

## Berinteraksi dengan Node dan Klaster

```bash
kubectl cordon my-node                                                # menandai my-node supaya tidak bisa dijadwalkan dengan Pod (unschedulable)
kubectl drain my-node                                                 # mengeringkan (drain) my-node sebagai bagian dari persiapan untuk pemeliharaan
kubectl uncordon my-node                                              # menandai my-node supaya bisa dijadwalkan dengan Pod (schedulable)
kubectl top node my-node                                              # memperlihatkan metrik dari Node my-node
kubectl cluster-info                                                  # memperlihatkan alamaat dari master dan layanan
kubectl cluster-info dump                                             # memperlihatkan state klaster saat ini pada keluaran stdout
kubectl cluster-info dump --output-directory=/path/to/cluster-state   # memperlihatkan state klaster saat ini pada /path/to/cluster-state

# jika sebuah taint dengan sebuah kunci dan efek di bawah pernah diterapkan, maka nilainya akan tergantikan dengan yang baru
kubectl taint nodes foo dedicated=special-user:NoSchedule
```

### Berbagai Tipe Sumber Daya

Mendapatkan seluruh daftar tipe sumber daya yang didukung lengkap dengan singkatan pendeknya, [grup API](/id/docs/concepts/overview/kubernetes-api/#api-groups),
apakah sumber daya merupakan sumber daya yang berada di dalam Namespace atau tidak, serta [Kind](/id/docs/concepts/overview/working-with-objects/kubernetes-objects):

```bash
kubectl api-resources
```

Operasi lainnya yang berkaitan dengan sumber daya API (api-resources):

```bash
kubectl api-resources --namespaced=true      # semua sumber daya yang berada di dalam Namespace
kubectl api-resources --namespaced=false     # semua sumber daya yang tidak berada di dalam Namespace
kubectl api-resources -o name                # semua sumber daya dengan keluaran sederhana (hanya nama sumber daya)
kubectl api-resources -o wide                # semua sumber daya dengan keluaran tambahan ("wide")
kubectl api-resources --verbs=list,get       # semua sumber daya yang mendukung verb permintaan "list" dan "get"
kubectl api-resources --api-group=extensions # semua sumber daya di dalam grup API "extensions"
```

### Memformat Keluaran


Untuk mengeluarkan detail ke dalam jendela terminal kamu dengan format tertentu, tambahkan _flag_ `-o` (atau `--output`)
dengan perintah `kubectl` yang didukung.

Format keluaran | Deskripsi
--------------| -----------
`-o=custom-columns=<spec>` | Mencetak sebuah tabel dengan daftar kolom khas (_custom_) yang dipisahkan dengan koma
`-o=custom-columns-file=<filename>` | Mencetak sebuah tabel dengan templat kolom khas pada berkas `<filename>`
`-o=json`     | Memberikan keluaran objek API dengan format JSON
`-o=jsonpath=<template>` | Mencetak bagian-bagian yang didefinisikan di dalam sebuah ekspresi [jsonpath](/docs/reference/kubectl/jsonpath)
`-o=jsonpath-file=<filename>` | Mencetak bagian-bagian yang didefinisikan dengan ekspresi [jsonpath](/docs/reference/kubectl/jsonpath) ke dalam berkas `<filename>`
`-o=name`     | Mencetak hanya nama dari sumber daya, tidak dengan informasi yang lainnya
`-o=wide`     | Memberikan keluaran dengan format teks polos (_plain-text_) dengan informasi tambahan, dan nama dari Node akan juga termasuk ke dalam informasi untuk Pod
`-o=yaml`     | Memberikan keluaran objek API dengan format YAML

Contoh-contoh yang menggunakan `-o=custom-columns`:

```bash
# All images running in a cluster
kubectl get pods -A -o=custom-columns='DATA:spec.containers[*].image'

 # All images excluding "registry.k8s.io/coredns:1.6.2"
kubectl get pods -A -o=custom-columns='DATA:spec.containers[?(@.image!="registry.k8s.io/coredns:1.6.2")].image'

# All fields under metadata regardless of name
kubectl get pods -A -o=custom-columns='DATA:metadata.*'
```

More examples in the kubectl [reference documentation](/docs/reference/kubectl/overview/#custom-columns).

### Tingkat Kelengkapan Keluaran dan Debugging Kubectl

Tingkat kelengkapan keluaran (_verbosity_) dari kubectl dikendalikan oleh _flag_ `-v` atau `--v` diikuti dengan bilangan bulat yang merepresentasikan
tingkatan log. Ketentuan _logging_ Kubernetes secara umum dan keterkaitannya dengan tingkatan log dijelaskan [di sini](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-instrumentation/logging.md).

Tingkat kelengkapan keluaran | Deskripsi
--------------| -----------
`--v=0` | Umumnya berguna untuk *selalu* bisa dilihat oleh seorang operator klaster.
`--v=1` | Tingkatan log bawaan yang layak jika kamu tidak ingin log yang terlalu lengkap.
`--v=2` | Berisi informasi yang _steady state_ tentang layanan dan berbagai pesan log penting yang berhubungan dengan perubahan besar pada sistem. Tingkat ini yang paling disarankan pada sistem kebanyakan.
`--v=3` | Informasi tambahan tentang perubahan pada sistem.
`--v=4` | Tingkat kelengkapan _debug_.
`--v=6` | Memperlihatkan sumber daya yang diminta.
`--v=7` | Memperlihatkan _header_ dari permintaan HTTP.
`--v=8` | Memperlihatkan konten dari permintan HTTP.
`--v=9` | Memperlihatkan kontek dari permintaan HTTP tanpa dipotong.



## {{% heading "whatsnext" %}}


* Pelajari lebih lanjut tentang [Ikhitsar kubectl](/docs/reference/kubectl/overview/).

* Lihat berbagai pilihan opsi dari [kubectl](/docs/reference/kubectl/kubectl/).

* Pelajari juga [Ketentuan Penggunaan kubectl](/docs/reference/kubectl/conventions/) untuk mengetahui bagaimana cara memakainya di dalam skrip yang bisa dipergunakan berulangkali (_reusable_).

* Pelajari [contekan kubectl](https://github.com/dennyzhang/cheatsheet-kubernetes-A4) dari komunitas.


