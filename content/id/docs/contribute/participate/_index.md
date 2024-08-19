---
title: Berpartisipasi dalam SIG Docs
content_type: concept
weight: 60
card:
  name: contribute
  weight: 60
---

<!-- overview -->

SIG Docs merupakan salah satu
[kelompok peminatan khusus (_special interest groups_)](https://github.com/kubernetes/community/blob/master/sig-list.md)
dalam proyek Kubernetes, yang berfokus pada penulisan, pembaruan, dan pemeliharaan
dokumentasi untuk Kubernetes secara keseluruhan. Lihatlah
[SIG Docs dari repositori github komunitas](https://github.com/kubernetes/community/tree/master/sig-docs)
untuk informasi lebih lanjut tentang SIG.

SIG Docs menerima konten dan ulasan dari semua kontributor. Siapa pun dapat membuka
_pull request_ (PR), dan siapa pun boleh mengajukan isu tentang konten atau komen
pada _pull request_ yang sedang berjalan.

Kamu juga bisa menjadi [anggota (_member_)](/id/docs/contribute/participating/roles-and-responsibilities/#anggota),
[pengulas (_reviewer_](/id/docs/contribute/participating/roles-and-responsibilities/#pengulas), atau [pemberi persetujuan (_approver_)](/id/docs/contribute/participating/roles-and-responsibilities/#approvers). Peran tersebut membutuhkan
akses dan mensyaratkan tanggung jawab tertentu untuk menyetujui dan melakukan perubahan.
Lihatlah [keanggotaan-komunitas (_community-membership_)](https://github.com/kubernetes/community/blob/master/community-membership.md)
untuk informasi lebih lanjut tentang cara kerja keanggotaan dalam komunitas Kubernetes.

Selebihnya dari dokumen ini akan menguraikan beberapa cara unik dari fungsi peranan tersebut dalam
SIG Docs, yang bertanggung jawab untuk memelihara salah satu aspek yang paling berhadapan dengan publik
dalam Kubernetes - situs web dan dokumentasi dari Kubernetes.


<!-- body -->

## Ketua umum (_chairperson_) SIG Docs {#ketua-umum-sig-docs}

Setiap SIG, termasuk SIG Docs, memilih satu atau lebih anggota SIG untuk bertindak sebagai
ketua umum. Mereka merupakan kontak utama antara SIG Docs dan bagian lain dari
organisasi Kubernetes. Mereka membutuhkan pengetahuan yang luas tentang struktur
proyek Kubernetes secara keseluruhan dan bagaimana SIG Docs bekerja di dalamnya. Lihatlah
[Kepemimpinan (_leadership_)](https://github.com/kubernetes/community/tree/master/sig-docs#leadership)
untuk daftar ketua umum yang sekarang.

## Tim dan automasi dalam SIG Docs

Automasi dalam SIG Docs bergantung pada dua mekanisme berbeda:
Tim GitHub dan berkas OWNERS.

### Tim GitHub

Terdapat dua kategori tim dalam SIG Docs [tim (_teams_)](https://github.com/orgs/kubernetes/teams?query=sig-docs) dalam GitHub:

- `@sig-docs-{language}-owners` merupakan pemberi persetujuan (_approver_) dan pemimpin (_lead_)
- `@sig-docs-{language}-reviews` merupakan pengulas (_reviewer_)

Setiap tim dapat direferensikan dengan `@name` mereka dalam komen GitHub untuk berkomunikasi dengan setiap orang di dalam grup.

Terkadang tim Prow dan GitHub tumpang tindih (_overlap_) tanpa kecocokan sama persis. Untuk penugasan masalah, _pull request_, dan untuk mendukung persetujuan PR,
otomatisasi menggunakan informasi dari berkas `OWNERS`.


### Berkas OWNERS dan bagian yang utama (_front-matter_)

Proyek Kubernetes menggunakan perangkat otomatisasi yang disebut prow untuk melakukan automatisasi
yang terkait dengan isu dan _pull request_ dalam GitHub.
[Repositori situs web Kubernetes](https://github.com/kubernetes/website) menggunakan
dua buah [prow _plugin_](https://github.com/kubernetes-sigs/prow/tree/main/pkg/plugins)):

- blunderbuss
- approve

Kedua _plugin_ menggunakan berkas
[OWNERS](https://github.com/kubernetes/website/blob/main/OWNERS) dan
[OWNERS_ALIASES](https://github.com/kubernetes/website/blob/main/OWNERS_ALIASES)
dalam level teratas dari repositori GitHub `kubernetes/website` untuk mengontrol
bagaimana prow bekerja di dalam repositori.

Berkas OWNERS berisi daftar orang-orang yang menjadi pengulas dan pemberi persetujuan di dalam SIG Docs.
Berkas OWNERS juga bisa terdapat di dalam subdirektori, dan dapat menimpa peranan karena 
dapat bertindak sebagai pengulas atau pemberi persetujuan berkas untuk subdirektori itu dan
apa saja yang ada di dalamnya. Untuk informasi lebih lanjut tentang berkas OWNERS pada umumnya, lihatlah
[OWNERS](https://github.com/kubernetes/community/blob/master/contributors/guide/owners.md).

Selanjutnya, berkas _markdown_ individu dapat menyimpan daftar pengulas dan pemberi persetujuan 
pada bagian yang utama, baik dengan menyimpan daftar nama pengguna individu GitHub atau grup GitHub.

Kombinasi dari berkas OWNERS dan bagian yang utama dalam berkas _markdown_ menentukan
saran kepada pemilik PR yang didapat dari sistem otomatis tentang siapa yang akan meminta ulasan teknis
dan ulasan editorial untuk PR mereka.

## Cara menggabungkan pekerjaan

Ketika _pull request_ digabungkan ke cabang (_branch_) yang digunakan untuk mempublikasikan konten, konten itu dipublikasikan di http://kubernetes.io. Untuk memastikan bahwa
kualitas konten yang kita terbitkan bermutu tinggi, kita membatasi penggabungan _pull request_ bagi para pemberi persetujuan
SIG Docs. Beginilah cara kerjanya.

- Ketika _pull request_ memiliki label `lgtm` dan `approve`, tidak memiliki label `hold`,
  dan telah lulus semua tes, _pull request_ akan digabungkan secara otomatis.
- Anggota organisasi Kubernetes dan pemberi persetujuan SIG Docs dapat menambahkan komen
  untuk mencegah penggabungan otomatis dari _pull request_ yang diberikan (dengan menambahkan komen `/hold`
  atau menahan komen `/lgtm`).
- Setiap anggota Kubernetes dapat menambahkan label `lgtm` dengan menambahkan komen `lgtm`
- Hanya pemberi persetujuan SIG Docs yang bisa menggabungkan _pull request_
  dengan menambahkan komen `/approve`. Beberapa pemberi persetujuan juga dapat melakukan 
  tugas tambahan seperti [PR _Wrangler_](/id/docs/contribute/advanced#menjadi-pr-wrangler-untuk-seminggu) atau
  [Ketua Umum SIG Docs](#ketua-umum-sig-docs).


## {{% heading "whatsnext" %}}

Untuk informasi lebih lanjut tentang cara berkontribusi pada dokumentasi Kubernetes, lihatlah:

- [Berkontribusi konten baru](/id/docs/contribute/overview/)
- [Mengulas konten](/id/docs/contribute/review/reviewing-prs)
- [Panduan gaya dokumentasi](/id/docs/contribute/style/)
