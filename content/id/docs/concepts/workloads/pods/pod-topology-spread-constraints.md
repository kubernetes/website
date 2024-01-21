---
title: Batasan Persebaran Topologi Pod
content_type: concept
weight: 50
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Kamu dapat menggunakan batasan perseberan topologi (_topology spread constraints_)
untuk mengatur bagaimana {{< glossary_tooltip text="Pod" term_id="Pod" >}} akan disebarkan
pada klaster yang ditetapkan sebagai _failure-domains_, seperti wilayah, zona, Node dan domain 
topologi yang ditentukan oleh pengguna. Ini akan membantu untuk mencapai ketersediaan yang tinggi
dan juga penggunaan sumber daya yang efisien.



<!-- body -->

## Persyaratan

### Mengaktifkan Gerbang Fitur 

[Gerbang fitur (_feature gate_)](/docs/reference/command-line-tools-reference/feature-gates/) 
`EvenPodsSpread` harus diaktifkan untuk
{{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}} **dan**
{{< glossary_tooltip text="penjadwal (_scheduler_)" term_id="kube-scheduler" >}}.

### Label Node

Batasan persebaran topologi bergantung dengan label pada Node untuk menentukan
domain topologi yang memenuhi untuk semua Node. Misalnya saja, sebuah Node bisa memiliki
label sebagai berikut: `node=node1,zone=us-east-1a,region=us-east-1`

Misalkan kamu memiliki klaster dengan 4 Node dengan label sebagai berikut:

```
NAME    STATUS   ROLES    AGE     VERSION   LABELS
node1   Ready    <none>   4m26s   v1.16.0   node=node1,zone=zoneA
node2   Ready    <none>   3m58s   v1.16.0   node=node2,zone=zoneA
node3   Ready    <none>   3m17s   v1.16.0   node=node3,zone=zoneB
node4   Ready    <none>   2m43s   v1.16.0   node=node4,zone=zoneB
```

Maka klaster tersebut secara logika akan dilihat sebagai berikut:

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
```

Tanpa harus memberi label secara manual, kamu dapat menggunakan [label ternama]
(/docs/reference/kubernetes-api/labels-annotations-taints/) yang terbuat dan terkumpulkan
secara otomatis pada kebanyakan klaster.

## Batasan Persebaran untuk Pod

### API

_Field_ `pod.spec.topologySpreadConstraints` diperkenalkan pada versi 1.16 sebagai berikut:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  topologySpreadConstraints:
  - maxSkew: <integer>
    minDomains: <integer>
    topologyKey: <string>
    whenUnsatisfiable: <string>
    labelSelector: <object>
```

Kamu dapat mendefinisikan satu atau lebih `topologySpreadConstraint` untuk menginstruksikan
kube-scheduler mengenai cara peletakan tiap Pod baru dengan menggunakan kondisi Pod yang
sudah ada dalam klaster kamu. _Field_ yang ada adalah:

- **maxSkew** menentukan batasan yang menandakan Pod tidak tersebar secara merata.
Ini merupakan nilai maksimal dari selisih jumlah Pod yang sama untuk setiap 2 domain topologi
yang sama. Nilai ini harus lebih dari 0.
- **topologyKey** adalah kunci dari label Node. Jika terdapat dua Node memiliki label dengan
kunci ini dan memiliki nilai yang identik untuk label tersebut, maka penjadwal akan menganggap
kedua Noode dalam topologi yang sama. Penjadwal akan mencoba untuk menyeimbangkan jumlah Pod
dalam setiap domain topologi.
- **whenUnsatisfiable** mengindikasikan cara menangani Pod yang tidak memenuhi batasan persebaran:
    - `DoNotSchedule` (_default_) memberitahukan penjadwal untuk tidak menjadwalkan Pod tersebut.
    - `ScheduleAnyway` memberitahukan penjadwal untuk tetap menjadwalkan Pod namun tetap menjaga ketidakseimbangan Node sekecil mungkin.
- **labelSelector** digunakan untuk mencari Pod yang sesuai. Pod dengan label yang sama dengan ini akan dihitung untuk menentukan jumlah Pod dalam domain topologi yang sesuai. Silakan baca [Label dan Selector](/id/docs/concepts/overview/working-with-objects/labels/#selektor-label) untuk lebih detailnya.

Kamu juga bisa membaca lebih detail mengenai _field_ ini dengan menjalankan perintah
`kubectl explain Pod.spec.topologySpreadConstraints`.

### Contoh: Satu TopologySpreadConstraint

Misalkan kamu memiliki klaster dengan 4 Node dimana 3 Pod berlabel `foo:bar` terdapat pada node1, 
node2 dan node3 (`P` merepresentasikan Pod):

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

Jika kita ingin Pod baru akan disebar secara merata berdasarkan Pod yang telah ada pada semua zona,
maka _spec_ bernilai sebagai berikut:

{{% codenew file="pods/topology-spread-constraints/one-constraint.yaml" %}}

`topologyKey: zone` berarti persebaran merata hanya akan digunakan pada Node dengan pasangan label 
"zone: <nilai apapun>". `whenUnsatisfiable: DoNotSchedule` memberitahukan penjadwal untuk membiarkan
tetap ditunda jika Pod yang baru tidak memenuhi batasan yang diterapkan.

Jika penjadwal menempatkan Pod baru pada "zoneA", persebaran Pod akan menjadi [3, 1], menjadikan
ketidakseimbangan menjadi bernilai 2 (3 - 1), yang mana akan melanggar batasan `maxSkew: 1`. 
Dalam contoh ini, Pod baru hanya dapat ditempatkan pada "zoneB":

```
+---------------+---------------+      +---------------+---------------+
|     zoneA     |     zoneB     |      |     zoneA     |     zoneB     |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |  OR  | node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
|   P   |   P   |   P   |   P   |      |   P   |   P   |  P P  |       |
+-------+-------+-------+-------+      +-------+-------+-------+-------+
```

Kamu dapat mengatur spesifikasi Pod untuk memenuhi beberapa persyaratan berikut:

- Ubah nilai `maxSkew` menjadi lebih besar, misal "2", sehingga Pod baru dapat ditempatkan pada "zoneA".
- Ubah nilai `topologyKey` menjadi "node" agar Pod disebarkan secara merata pada semua Node, bukan zona. Pada contoh di atas, jika `maxSkew` tetap bernilai "1", maka Pod baru hanya akan ditempatkan pada "node4".
- Ubah nilai `whenUnsatisfiable: DoNotSchedule` menjadi `whenUnsatisfiable: ScheduleAnyway` untuk
menjamin agar semua Pod baru akan tetap dijadwalkan (misalkan saja API penjadwalan lain tetap 
terpenuhi). Namun, ini lebih suka ditempatkan pada domain topologi yang memiliki lebih sedikit
Pod yang sesuai. (Harap diperhatikan bahwa preferensi ini digabungkan bersama dengan prioritas
penjadwalan internal yang lain, seperti rasio penggunaan sumber daya, dan lain sebagainya.)

### Contoh: Beberapa TopologySpreadConstraint

Ini dibuat berdasarkan contoh sebelumnya. Misalkan kamu memiliki klaster dengan 4 Node dengan 
3 Pod berlabel `foo:bar` yang ditempatkan pada node1, node2 dan node3. (`P` merepresentasikan Pod):

```
+---------------+---------------+
|     zoneA     |     zoneB     |
+-------+-------+-------+-------+
| node1 | node2 | node3 | node4 |
+-------+-------+-------+-------+
|   P   |   P   |   P   |       |
+-------+-------+-------+-------+
```

Kamu dapat menggunakan 2 TopologySpreadConstraint untuk mengatur persebaran Pod pada zona dan Node:

{{% codenew file="pods/topology-spread-constraints/two-constraints.yaml" %}}

Dalam contoh ini, untuk memenuhi batasan pertama, Pod yang baru hanya akan ditempatkan pada "zoneB",
sedangkan untuk batasan kedua, Pod yang baru hanya akan ditempatkan pada "node4". Maka hasil dari 
2 batasan ini akan digunakan (_AND_), sehingga opsi untuk menempatkan Pod hanya pada "node4".

Beberapa batasan dapat berujung pada konflik. Misalnya saja kamu memiliki klaster dengan 3 Node
pada 2 zona berbeda:

```
+---------------+-------+
|     zoneA     | zoneB |
+-------+-------+-------+
| node1 | node2 | node3 |
+-------+-------+-------+
|  P P  |   P   |  P P  |
+-------+-------+-------+
```

Jika kamu menerapkan "two-constraints.yaml" pada klaster ini, kamu akan mendapatkan "mypod" tetap 
dalam kondisi `Pending`. Ini dikarenakan oleh: untuk memenuhi batasan pertama, "mypod" hanya dapat
ditempatkan pada "zoneB", sedangkan untuk batasan kedua, "mypod" hanya dapat ditempatkan pada 
"node2". Tidak ada hasil penggabungan dari "zoneB" dan "node2".

Untuk mengatasi situasi ini, kamu bisa menambahkan nilai `maxSkew` atau mengubah salah satu dari 
batasan untuk menggunakan `whenUnsatisfiable: ScheduleAnyway`.

### Konvensi

Ada beberapa konvensi implisit yang perlu diperhatikan di sini:

- Hanya Pod dengan Namespace yang sama dengan Pod baru yang bisa menjadi kandidat yang cocok.

- Node tanpa memiliki `topologySpreadConstraints[*].topologyKey` akan dilewatkan. Ini berarti:
    1. Pod yang ditempatkan pada Node tersebut tidak berpengaruh pada perhitungan `maxSkew`. Dalam contoh di atas, misalkan "node1" tidak memiliki label "zone", maka kedua Pod tidak diperhitungkan dan menyebabkan Pod yang baru akan dijadwalkan masuk ke "zoneA".
    2. Pod yang baru tidak memiliki kesempatan untuk dijadwalkan ke Node tersebut, pada contoh di atas, misalkan terdapat "node5" dengan label `{zone-typo: zoneC}` bergabung dalam klaster, Node ini akan dilewatkan karena tidak memiliki label dengan kunci "zone".

- Harap diperhatikan mengenai hal yang terjadi jika nilai `topologySpreadConstraints[*].labelSelector` pada Pod yang baru tidak sesuai dengan labelnya. 
Pada contoh di atas, jika kita menghapus label pada Pod yang baru, maka Pod akan tetap ditempatkan
pada "zoneB" karena batasan yang ada masih terpenuhi. Namun, setelah ditempatkan, nilai 
ketidakseimbangan pada klaster masih tetap tidak berubah, zoneA tetap memiliki 2 Pod dengan label
{foo:bar} dan zoneB memiliki 1 Pod dengan label {foo:bar}. Jadi jika ini tidak yang kamu harapkan,
kami menyarankan nilai dari `topologySpreadConstraints[*].labelSelector` disamakan dengan labelnya.

- Jika Pod yang baru memiliki `spec.nodeSelector` atau `spec.affinity.nodeAffinity`, Node yang tidak
sesuai dengan nilai tersebut akan dilewatkan.

    Misalkan kamu memiliki klaster dengan 5 Node dari zoneA sampai zoneC:

    ```
    +---------------+---------------+-------+
    |     zoneA     |     zoneB     | zoneC |
    +-------+-------+-------+-------+-------+
    | node1 | node2 | node3 | node4 | node5 |
    +-------+-------+-------+-------+-------+
    |   P   |   P   |   P   |       |       |
    +-------+-------+-------+-------+-------+
    ```

    dan kamu mengetahui bahwa "zoneC" harus tidak diperhitungkan. Dalam kasus ini, kamu dapat membuat
    berkas yaml seperti di bawah, jadi "mypod" akan ditempatkan pada "zoneB", bukan "zoneC".
    Demikian juga `spec.nodeSelector` akan digunakan.

    {{% codenew file="pods/topology-spread-constraints/one-constraint-with-nodeaffinity.yaml" %}}
    
### Batasan _default_ pada tingkat klaster

{{< feature-state for_k8s_version="v1.18" state="alpha" >}}

Ini memungkinkan untuk mengatur batasan persebaran topologi bawaan untuk klaster.
Batasan persebaran topologi bawaan akan digunakan pada Pod jika dan hanya jika:

- Hal ini tidak mendefinisikan batasan apapun pada `.spec.topologySpreadConstraints`.
- Hal ini milik sebuah Service, ReplicationController, ReplicaSet atau StatefulSet.

Batasan bawaan akan diatur sebagai bagian dari argumen pada _plugin_ `PodTopologySpread`
di dalam sebuah [profil penjadwalan](/docs/reference/scheduling/profiles).
Batasan dispesifikasikan dengan [API yang sama dengan di atas](#api), kecuali bagian `labelSelector`
harus kosong. _selector_ akan dihitung dari Service, ReplicationController, ReplicaSet atau
StatefulSet yang dimiliki oleh Pod tersebut.

Sebuah contoh konfigurasi sebagai berikut:


```yaml
apiVersion: kubescheduler.config.k8s.io/v1alpha2
kind: KubeSchedulerConfiguration

profiles:
  - pluginConfig:
      - name: PodTopologySpread
        args:
          defaultConstraints:
            - maxSkew: 1
              topologyKey: topology.kubernetes.io/zone
              whenUnsatisfiable: ScheduleAnyway
```

{{< note >}}
Nilai yang dihasilkan oleh batasan penjadwalan bawaan mungkin akan konflik dengan
nilai yang dihasilkan oleh 
[`DefaultPodTopologySpread` plugin](/docs/reference/scheduling/profiles/#scheduling-plugins).
Direkomendasikan untuk kamu menonaktifkan _plugin_ ini dalam profil penjadwalan ketika
menggunakan batasan _default_ untuk `PodTopologySpread`.
{{< /note >}}

## Perbandingan dengan PodAffinity/PodAntiAffinity

Di Kubernetes, arahan yang terkait dengan "Afinitas" mengontrol bagaimana Pod dijadwalkan - 
lebih terkumpul atau lebih tersebar.

- Untuk `PodAffinity`, kamu dapat mencoba mengumpulkan beberapa Pod ke dalam suatu
domain topologi yang memenuhi syarat.
- Untuk `PodAntiAffinity`, hanya satu Pod yang dalam dijadwalkan pada sebuah domain topologi.

Fitur "EvenPodsSpread" memberikan opsi fleksibilas untuk mendistribusikan Pod secara merata
pada domain topologi yang berbeda, untuk meraih ketersediaan yang tinggi atau menghemat biaya.
Ini juga dapat membantu saat perbaruan bergilir dan menaikan jumlah replika dengan lancar.
Silakan baca [motivasi](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20190221-even-pods-spreading.md#motivation) untuk lebih detail.

## Limitasi yang diketahui

Pada versi 1.18, dimana fitur ini masih Beta, beberapa limitasi yang sudah diketahui:

- Pengurangan jumlah Deployment akan membuat ketidakseimbangan pada persebaran Pod.
- Pod yang cocok pada _tainted_ Node akan dihargai. Lihat [Issue 80921](https://github.com/kubernetes/kubernetes/issues/80921)


