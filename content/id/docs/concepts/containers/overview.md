---
title: Ikhtisar Kontainer
content_type: concept
weight: 1
---

<!-- overview -->

Kontainer adalah teknologi untuk mengemas kode (yang telah dikompilasi) menjadi 
suatu aplikasi beserta dengan dependensi-dependensi yang dibutuhkannya pada saat 
dijalankan. Setiap kontainer yang Anda jalankan dapat diulang; standardisasi 
dengan menyertakan dependensinya berarti Anda akan mendapatkan perilaku yang 
sama di mana pun Anda menjalankannya.

Kontainer memisahkan aplikasi dari infrastruktur host yang ada dibawahnya. Hal 
ini membuat penyebaran lebih mudah di lingkungan cloud atau OS yang berbeda.



<!-- body -->

## Image-Image Kontainer

[Kontainer image](/id/docs/concepts/containers/images/) meruapakan paket perangkat lunak 
yang siap dijalankan, mengandung semua yang diperlukan untuk menjalankan 
sebuah aplikasi: kode dan setiap *runtime* yang dibutuhkan, *library* dari 
aplikasi dan sistem, dan nilai *default* untuk penganturan yang penting.

Secara desain, kontainer tidak bisa berubah: Anda tidak dapat mengubah kode 
dalam kontainer yang sedang berjalan. Jika Anda memiliki aplikasi yang 
terkontainerisasi dan ingin melakukan perubahan, maka Anda perlu membuat 
kontainer baru dengan menyertakan perubahannya, kemudian membuat ulang kontainer
dengan memulai dari _image_ yang sudah diubah.

## Kontainer _runtime_

Kontainer *runtime* adalah perangkat lunak yang bertanggung jawab untuk 
menjalankan kontainer. Kubernetes mendukung beberapa kontainer *runtime*: 
{{< glossary_tooltip term_id="docker" >}}, 
{{< glossary_tooltip term_id="containerd" >}},
{{< glossary_tooltip term_id="cri-o" >}}, dan semua implementasi dari 
[Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).

## Selanjutnya

- Baca tentang [image-image kontainer](https://kubernetes.io/docs/concepts/containers/images/)
- Baca tentang [Pod](https://kubernetes.io/docs/concepts/workloads/pods/)

