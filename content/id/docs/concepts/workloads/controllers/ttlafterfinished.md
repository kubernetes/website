---
title: Kontroler TTL untuk Sumber Daya yang Telah Selesai Digunakan
content_template: templates/concept
weight: 65
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

Kontroler TTL menyediakan mekanisme TTL yang membatasi _lifetime_ dari sebuah 
objek sumber daya yang telah selesai digunakan. Kontroler TTL untuk saat ini hanya menangani 
[Jobs](/docs/concepts/workloads/controllers/jobs-run-to-completion/), 
dan nantinya bisa saja digunakan untuk sumber daya lain yang telah selesai digunakan 
misalnya saja Pod atau sumber daya kustom lainnya. 

Peringatan Fitur Alpha: fitur ini tergolong datam fitur alpha dan dapat diaktifkan dengan 
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
`TTLAfterFinished`.


{{% /capture %}}




{{% capture body %}}

## Kontroler TTL

Kontroler TTL untuk saat ini hanya mendukung Job. Sebuah operator kluster 
dapat menggunakan fitur ini untuk membersihkan Job yang telah dieksekusi (baik 
`Complete` atau `Failed`) secara otomatis dengan mennetukan _field_ 
`.spec.ttlSecondsAfterFinished` pada Job, seperti yang tertera di 
[contoh](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically).
Kontroler TTL akan berasumsi bahwa sebuah sumber daya dapat dihapus apabila 
TTL dari sumber daya tersebut telah habis. Proses dihapusnya sumber daya ini 
dilakukan secara berantai, yaitu sekaligus menghapus sumber daya lain yang 
berkaitan dengannya. Perhatikan bahwa ketika sebuah sumber daya dihapus, 
_lifecycle_ yang ada akan menjaga bahwa _finalizer_ akan tetap dijalankan sebagaimana mestinya.

Waktu TTL dalam detik dapat diatur kapan pun. Terdapat beberapa contoh untuk mengaktifkan _field_ 
`.spec.ttlSecondsAfterFinished` pada sebuah Job:

* Spesifikasikan _field_ ini pada _manifest_ sumber daya, sehingga Job akan 
  dihapus secara otomatis beberapa saat setelah selesai dieksekusi. 
* Aktifkan _field_ ini pada sumber daya yang sudah selesai dieksekusi untuk 
  menerapkan fitur ini.
* Gunakan sebuah 
  [webhook admisi pengubah (_mutating admission webhook_)](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
  untuk mengaktifkan _field_ ini secara dinamis pada saat pembuatan sumber daya. 
  Administrator kluster dapat menggunakan hal ini untuk menjamin _policy_ TTL pada 
  sumber daya yang telah selesai digunakan.
* Gunakan sebuah 
  [webhook admisi pengubah (_mutating admission webhook_)](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)
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

Karena kontroler TTL menggunakan _timestamps_ yang disimpan di sumber daya 
Kubernetes untuk mennetukan apakah TTL sudah habis atau belum, fitur ini tidak sensitif 
terhadap _time skew_ yang ada pada kluster dan bisa saja menghapus objek pada waktu yang salah 
bagi objek tersebut akibat adanya _time skew_.

Pada Kubernetes, NTP haruslah dilakukan pada semua node untuk mecegah adanya _time skew_ 
(lihat [#6159](https://github.com/kubernetes/kubernetes/issues/6159#issuecomment-93844058)). 
_Clock_ tidak akan selalu tepat, meskipun begitu perbedaan yang ada haruslah diminimalisasi. 
Perhatikan bahwa hal ini dapat terjadi apabila TTL diaktifkan dengan nilai selain 0.

{{% /capture %}}

{{% capture whatsnext %}}

[Membersikan Job secara Otomatis](/docs/concepts/workloads/controllers/jobs-run-to-completion/#clean-up-finished-jobs-automatically)

[Dokumentasi _Design_](https://github.com/kubernetes/enhancements/blob/master/keps/sig-apps/0026-ttl-after-finish.md)

{{% /capture %}}
