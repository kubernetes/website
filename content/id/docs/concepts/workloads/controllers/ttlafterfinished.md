---
title: Pengendali TTL untuk Sumber Daya yang Telah Selesai Digunakan
content_type: concept
weight: 65
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Pengendali TTL menyediakan mekanisme TTL yang membatasi umur dari suatu
objek sumber daya yang telah selesai digunakan. Pengendali TTL untuk saat ini hanya menangani
[Jobs](/id/docs/concepts/workloads/controllers/jobs-run-to-completion/),
dan nantinya bisa saja digunakan untuk sumber daya lain yang telah selesai digunakan
misalnya saja Pod atau sumber daya khusus (_custom resource_) lainnya.

Peringatan Fitur Alpha: fitur ini tergolong datam fitur alpha dan dapat diaktifkan dengan
[_feature gate_](/docs/reference/command-line-tools-reference/feature-gates/)
`TTLAfterFinished`.







<!-- body -->

## Pengendali TTL

Pengendali TTL untuk saat ini hanya mendukung Job. Sebuah operator klaster
dapat menggunakan fitur ini untuk membersihkan Job yang telah dieksekusi (baik
`Complete` atau `Failed`) secara otomatis dengan menentukan _field_
`.spec.ttlSecondsAfterFinished` pada Job, seperti yang tertera di
[contoh](/id/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically).
Pengendali TTL akan berasumsi bahwa sebuah sumber daya dapat dihapus apabila
TTL dari sumber daya tersebut telah habis. Proses dihapusnya sumber daya ini
dilakukan secara berantai, dimana sumber daya lain yang
berkaitan akan ikut terhapus. Perhatikan bahwa ketika sebuah sumber daya dihapus,
siklus hidup yang ada akan menjaga bahwa _finalizer_ akan tetap dijalankan sebagaimana mestinya.

Waktu TTL dalam detik dapat diatur kapan pun. Terdapat beberapa contoh untuk mengaktifkan _field_
`.spec.ttlSecondsAfterFinished` pada suatu Job:

* Spesifikasikan _field_ ini pada _manifest_ sumber daya, sehingga Job akan
  dihapus secara otomatis beberapa saat setelah selesai dieksekusi.
* Aktifkan _field_ ini pada sumber daya yang sudah selesai dieksekusi untuk
  menerapkan fitur ini.
* Gunakan sebuah
  [mengubah (_mutating_) _admission)](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  untuk mengaktifkan _field_ ini secara dinamis pada saat pembuatan sumber daya.
  Administrator klaster dapat menggunakan hal ini untuk menjamin kebijakan (_policy_) TTL pada
  sumber daya yang telah selesai digunakan.
* Gunakan sebuah
  [mengubah (_mutating_) _admission](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  untuk mengaktifkan _field_ ini secara dinamis setelah sumber daya
  selesai digunakan dan TTL didefinisikan sesuai dengan status, label, atau hal lain
  yang diinginkan.

## Peringatan

### Mengubah TTL Detik

Perhatikan bahwa periode TTL, yaitu _field_ `.spec.ttlSecondsAfterFinished` pada Job,
dapat dimodifikasi baik setelah sumber daya dibuat atau setelah selesai digunakan.
Meskipun begitu, setelah Job dapat dihapus (TTL sudah habis), sistem tidak akan
menjamin Job tersebut akan tetap ada, meskipun nilai TTL berhasil diubah.

### _Time Skew_

Karena pengendali TTL menggunakan cap waktu (_timestamp_) yang disimpan di sumber daya
Kubernetes untuk menentukan apakah TTL sudah habis atau belum, fitur ini tidak sensitif
terhadap _time skew_ yang ada pada klaster dan bisa saja menghapus objek pada waktu yang salah
bagi objek tersebut akibat adanya _time skew_.

Pada Kubernetes, NTP haruslah dilakukan pada semua node untuk mecegah adanya _time skew_
(lihat [#6159](https://github.com/kubernetes/kubernetes/issues/6159#issuecomment-93844058)).
_Clock_ tidak akan selalu tepat, meskipun begitu perbedaan yang ada haruslah diminimalisasi.
Perhatikan bahwa hal ini dapat terjadi apabila TTL diaktifkan dengan nilai selain 0.



## {{% heading "whatsnext" %}}


[Membersikan Job secara Otomatis](/id/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically)

[Dokumentasi Rancangan](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/592-ttl-after-finish/README.md)


