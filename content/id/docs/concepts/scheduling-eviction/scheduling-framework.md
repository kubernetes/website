---
title: Kerangka Kerja Penjadwalan (Scheduling Framework)
content_type: concept
weight: 60
---

<!-- overview -->

{{< feature-state for_k8s_version="1.15" state="alpha" >}}

Kerangka kerja penjadwalan (_Scheduling Framework_) adalah arsitektur yang dapat 
dipasang (_pluggable_) pada penjadwal Kubernetes untuk membuat kustomisasi 
penjadwal lebih mudah. Hal itu dilakukan dengan menambahkan satu kumpulan "plugin" 
API ke penjadwal yang telah ada. _Plugin_ dikompilasi ke dalam penjadwal. 
Beberapa API memungkinkan sebagian besar fitur penjadwalan diimplementasikan 
sebagai _plugin_, sambil tetap mempertahankan penjadwalan "inti" sederhana dan 
terpelihara. Silahkan merujuk pada [proposal desain dari kerangka penjadwalan]
[kep] untuk informasi teknis lebih lanjut tentang desain kerangka kerja 
tersebut.

[kep]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20180409-scheduling-framework.md



<!-- body -->

# Alur kerja kerangka kerja

Kerangka kerja penjadwalan mendefinisikan beberapa titik ekstensi. _Plugin_ penjadwal
mendaftar untuk dipanggil di satu atau lebih titik ekstensi. Beberapa _plugin_ ini
dapat mengubah keputusan penjadwalan dan beberapa hanya bersifat informasi.

Setiap upaya untuk menjadwalkan satu Pod dibagi menjadi dua fase, **Siklus Penjadwalan (_Scheduling Cycle_)** dan **Siklus Pengikatan (_Binding Cycle_)**.

## Siklus Penjadwalan dan Siklus Pengikatan

Siklus penjadwalan memilih sebuah Node untuk Pod, dan siklus pengikatan menerapkan
keputusan tersebut ke klaster. Secara bersama-sama, siklus penjadwalan dan siklus 
pengikatan diartikan sebagai sebuah "konteks penjadwalan (_scheduling context_)".

Siklus penjadwalan dijalankan secara serial, sementara siklus pengikatan dapat 
berjalan secara bersamaan.

Siklus penjadwalan atau pengikatan dapat dibatalkan jika Pod telah ditentukan 
untuk tidak terjadwalkan atau jika terdapat kesalahan internal. Pod akan 
dikembalikan ke antrian dan dicoba lagi.

## Titik-titik ekstensi

Gambar berikut menunjukkan konteks penjadwalan Pod dan titik-titik ekstensi
yang diperlihatkan oleh kerangka penjadwalan. Dalam gambar ini "Filter"
setara dengan "Predicate" dan "Scoring" setara dengan "Priority Function".

Satu _plugin_ dapat mendaftar di beberapa titik ekstensi untuk melakukan pekerjaan
yang lebih kompleks atau _stateful_.

{{< figure src="/images/docs/scheduling-framework-extensions.png" title="Titik-titik ekstensi dari kerangka kerja Penjadwalan" >}}

### QueueSort {#queue-sort}

_Plugin_ ini digunakan untuk mengurutkan Pod-Pod dalam antrian penjadwalan. _Plugin_
QueueSort pada dasarnya menyediakan fungsi `Less (Pod1, Pod2)`. Hanya satu jenis
_plugin_ QueueSort yang dapat diaktifkan dalam waktu yang bersamaan.

### PreFilter {#pre-filter}

_Plugin_ ini digunakan untuk melakukan pra-proses informasi tentang Pod, atau untuk 
memeriksa tertentu kondisi yang harus dipenuhi oleh klaster atau Pod. Jika 
_plugin_ PreFilter menghasilkan hasil yang salah, siklus penjadwalan dibatalkan.

### Filter

_Plugin_ ini digunakan untuk menyaring Node yang tidak dapat menjalankan Pod. 
Untuk setiap Node, penjadwal akan memanggil _plugin_ Filter sesuai dengan urutan
mereka dikonfigurasi. Jika ada _plugin_ Filter menandai Node menjadi _infeasible_,
maka _plugin_ yang lainnya tidak akan dipanggil untuk Node itu. Node-Node dapat dievaluasi 
secara bersamaan.

### PostFilter {#post-filter}

Plugin ini disebut setelah fase Filter, tetapi hanya ketika tidak ada node yang layak
ditemukan untuk pod. Plugin dipanggil dalam urutan yang dikonfigurasi. Jika
plugin postFilter menandai node sebagai 'Schedulable', plugin yang tersisa
tidak akan dipanggil. Implementasi PostFilter yang khas adalah preemption, yang
mencoba membuat pod dapat di menjadwalkan dengan mendahului Pod lain.

### PreScore {#pre-score}

_Plugin_ ini digunakan untuk melakukan pekerjaan "pra-penilaian", yang 
menghasilkan keadaan yang dapat dibagi untuk digunakan oleh _plugin-plugin_ Score. 
Jika _plugin_ PreScore mengeluarkan hasil salah, maka siklus penjadwalan dibatalkan.

### Score {#score}

_Plugin_ ini digunakan untuk menentukan peringkat Node yang telah melewati fase
penyaringan. Penjadwal akan memanggil setiap _plugin_ Score untuk setiap Node. 
Akan ada kisaran bilangan bulat yang telah ditetapkan untuk mewakili skor
minimum dan maksimum. Setelah fase [NormalizeScore](#normalize-scoring), 
penjadwal akan menggabungkan skor Node dari semua _plugin_ sesuai dengan bobot 
_plugin_ yang telah dikonfigurasi.

### NormalizeScore {#normalize-score}

_Plugin_ ini digunakan untuk memodifikasi skor sebelum penjadwal menghitung 
peringkat akhir Node-Node. _Plugin_ yang mendaftar untuk titik ekstensi ini akan 
dipanggil dengan hasil [Score](#score) dari _plugin_ yang sama. Hal ini dilakukan
sekali untuk setiap _plugin_ dan setiap siklus penjadwalan.

Sebagai contoh, anggaplah sebuah _plugin_ `BlinkingLightScorer` memberi peringkat 
pada Node-Node berdasarkan berapa banyak kedipan lampu yang mereka miliki.

```go
func ScoreNode(_ *v1.pod, n *v1.Node) (int, error) {
    return getBlinkingLightCount(n)
}
```

Namun, jumlah maksimum kedipan lampu mungkin kecil jika dibandingkan dengan
`NodeScoreMax`. Untuk memperbaikinya, `BlinkingLightScorer` juga harus mendaftar
untuk titik ekstensi ini.

```go
func NormalizeScores(scores map[string]int) {
    highest := 0
    for _, score := range scores {
        highest = max(highest, score)
    }
    for node, score := range scores {
        scores[node] = score*NodeScoreMax/highest
    }
}
```

Jika ada _plugin_ NormalizeScore yang menghasilkan hasil yang salah, maka siklus 
penjadwalan dibatalkan.

{{< note >}}
_Plugin_ yang ingin melakukan pekerjaan "pra-pemesanan" harus menggunakan
titik ekstensi NormalizeScore.
{{< /note >}}

### Reserve

Ini adalah titik ekstensi yang bersifat informasi. _Plugin_ yang mempertahankan
keadaan _runtime_ (alias "_stateful plugins_") harus menggunakan titik ekstensi ini
untuk diberitahukan oleh penjadwal ketika sumber daya pada suatu Node dicadangkan
untuk Pod yang telah disiapkan. Proses ini terjadi sebelum penjadwal benar-benar
mengikat Pod ke Node, dan itu ada untuk mencegah kondisi balapan (_race conditions_)
ketika penjadwal menunggu agar pengikatan berhasil.

Ini adalah langkah terakhir dalam siklus penjadwalan. Setelah Pod berada dalam 
status dicadangkan, maka itu akan memicu _plugin_ [Unreserve](#unreserve)
(apabila gagal) atau _plugin_ [PostBind](#post-bind) (apabila sukses) 
di akhir siklus pengikatan.

### Permit

_Plugin_ Permit dipanggil pada akhir siklus penjadwalan untuk setiap Pod
untuk mencegah atau menunda pengikatan ke Node kandidat. _Plugin_ Permit dapat 
melakukan salah satu dari ketiga hal ini:

1. **approve** \
     Setelah semua _plugin_ Permit menyetujui sebuah Pod, Pod tersebut akan dikirimkan untuk diikat.

2. **deny** \
     Jika ada _plugin_ Permit yang menolak sebuah Pod, Pod tersebut akan dikembalikan ke 
     antrian penjadwalan. Hal ini akan memicu _plugin_ [Unreserve](#unreserve).

3. **wait** (dengan batas waktu) \
     Jika _plugin_ Permit menghasilkan "wait", maka Pod disimpan dalam
     daftar Pod "yang menunggu" internal, dan siklus pengikatan Pod ini dimulai tetapi akan langsung diblokir
     sampai mendapatkan [_approved_](#frameworkhandle). Jika waktu tunggu habis, ** wait ** menjadi ** deny **
     dan Pod dikembalikan ke antrian penjadwalan, yang memicu _plugin_ [Unreserve](#unreserve).

{{< note >}}
Ketika setiap _plugin_ dapat mengakses daftar Pod-Pod "yang menunggu" dan menyetujuinya
(silahkan lihat [`FrameworkHandle`](#frameworkhandle)), kami hanya mengharapkan
_plugin_ Permit untuk menyetujui pengikatan Pod dalam kondisi "menunggu" yang 
telah dipesan. Setelah Pod disetujui, akan dikirim ke fase [PreBind](#pre-bind).
{{< /note >}}

### PreBind {#pre-bind}

_Plugin_ ini digunakan untuk melakukan pekerjaan apa pun yang diperlukan sebelum
Pod terikat. Sebagai contoh, _plugin_ PreBind dapat menyediakan _network volume_ 
dan melakukan _mounting_ pada Node target sebelum mengizinkan Pod berjalan di 
sana.

Jika ada _plugin_ PreBind yang menghasilkan kesalahan, maka Pod [ditolak](#unreserve)
dan kembali ke antrian penjadwalan.

### Bind

_Plugin_ ini digunakan untuk mengikat Pod ke Node. _Plugin-plugin_ Bind tidak akan
dipanggil sampai semua _plugin_ PreBind selesai. Setiap _plugin_ Bind dipanggil 
sesuai urutan saat dikonfigurasi. _Plugin_ Bind dapat memilih untuk menangani 
atau tidak Pod yang diberikan. Jika _plugin_ Bind memilih untuk menangani Pod, 
** _plugin_ Bind yang tersisa dilewati **.

### PostBind {#post-bind}

Ini adalah titik ekstensi bersifat informasi. _Plugin-plugin_ PostBind dipanggil
setelah sebuah Pod berhasil diikat. Ini adalah akhir dari siklus pengikatan, dan
dapat digunakan untuk membersihkan sumber daya terkait.

### Unreserve

Ini adalah titik ekstensi bersifat informasi. Jika sebuah Pod telah dipesan dan 
kemudian ditolak di tahap selanjutnya, maka _plugin-plugin_ Unreserve akan 
diberitahu. _Plugin_ Unreserve harus membersihkan status yang terkait dengan Pod
yang dipesan.

_Plugin_ yang menggunakan titik ekstensi ini sebaiknya juga harus digunakan
[Reserve](#unreserve).

## _Plugin_ API

Ada dua langkah untuk _plugin_ API. Pertama, _plugin_ harus mendaftar dan mendapatkan
konfigurasi, kemudian mereka menggunakan antarmuka titik ekstensi. Antarmuka (_interface_)
titik ekstensi memiliki bentuk sebagai berikut.

```go
type Plugin interface {
    Name() string
}

type QueueSortPlugin interface {
    Plugin
    Less(*v1.pod, *v1.pod) bool
}

type PreFilterPlugin interface {
    Plugin
    PreFilter(context.Context, *framework.CycleState, *v1.pod) error
}

// ...
```

## Konfigurasi _plugin_

Kamu dapat mengaktifkan atau menonaktifkan _plugin_ dalam konfigurasi penjadwal.
Jika kamu menggunakan Kubernetes v1.18 atau yang lebih baru, kebanyakan 
[plugin-plugin penjadwalan](/docs/reference/scheduling/profiles/#scheduling-plugins)
sudah digunakan dan diaktifkan secara bawaan.

Selain _plugin-plugin_ bawaan, kamu juga dapat mengimplementasikan _plugin-plugin_ penjadwalan 
kamu sendiri dan mengonfigurasinya bersama-sama dengan _plugin-plugin_ bawaan.
Kamu bisa mengunjungi [plugin-plugin penjadwalan](https://github.com/kubernetes-sigs/scheduler-plugins) 
untuk informasi lebih lanjut.

Jika kamu menggunakan Kubernetes v1.18 atau yang lebih baru, kamu dapat 
mengonfigurasi sekumpulan _plugin_ sebagai profil penjadwal dan kemudian menetapkan 
beberapa profil agar sesuai dengan berbagai jenis beban kerja. Pelajari lebih 
lanjut di [multi profil](/docs/reference/scheduling/profiles/#multiple-profiles).


