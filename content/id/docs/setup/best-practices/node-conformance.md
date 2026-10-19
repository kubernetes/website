---
reviewers:
- Random-Liu
title: Validasi Pengaturan Node
weight: 30
---

## Tes Kesesuaian *Node*

*Node conformance test* atau tes kesesuaian *Node* adalah kerangka kerja tes berbasis kontainer yang menyediakan sistem verifikasi dan tes untuk *Node*. Tes memvalidasi apakah *Node* memenuhi syarat minimum untuk Kubernetes; *Node* yang lolos tes dianggap lolos untuk bergabung dengan klaster Kubernetes.

## Prasyarat Node

Untuk menjalankan tes kesesuaian *Node*, sebuah *Node* harus memenuhi prasyarat yang sama dengan *Node* Kubernetes standar. Sekurang - kurangnya, *daemon* dibawah ini harus terpasang di *Node*:

* *runtime* kontainer yang kompatibel dengan CRI seperti Docker, containerd dan CRI-O
* kubelet

## Menjalankan Tes Kesesuaian Node

Untuk menjalankan tes kesesuaian *Node*, lakukanlah langkah-langkah  berikut ini:

1. Sesuaikan nilai opsi dari `--kubeconfig` untuk kubelet; sebagai contoh: 
    `--kubeconfig=/var/lib/kubelet/config.yaml`.
    Karena kerangka kerja tes akan menjalankan panel kontrol lokal untuk menguji kubelet,
    menggunakan `http://localhost:8080` sebagai URL dari API Server.
    Terdapat beberapa parameter *command line* untuk kubelet yang mungkin bisa kamu gunakan:

    * `--cloud-provider`: Jika kamu menggunakan `--cloud-provider=gce`, maka kamu harus
      menghapus *flag* untuk menjalankan tes

2. Jalankan tes kesesuaian *Node* dengan perintah:

   ```shell
   # $CONFIG_DIR adalah path dari manifest untuk kubelet kamu
   # $LOG_DIR adalah path untuk output
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## Menjalankan Tes Kesesuaian Node untuk Arsitektur lainnya

Kubernetes juga menyediakan *image* tes kesesuaian *Node* untuk arsitektur lainnya:

|  Arch  |       Image       |
|--------|:-----------------:|
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |

## Menjalankan Tes Tertentu

Untuk menjalankan tes-tes tertentu, ganti nilai *environment variable* `FOCUS` dengan ekspresi reguler dari tes-tes yang ingin kamu jalankan.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Hanya menjalankan tes MirrorPod
  registry.k8s.io/node-test:0.2
```

Untuk melewat tes-tes tertentu, ganti nilai *environment variable* `SKIP` dengan ekspresi reguler dari tes-tes yang ingin kamu lewati.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Menjalankan semua tes skesesuaian dengan melewat tes MirrorPod
  registry.k8s.io/node-test:0.2
```

Tes kesesuaian *Node* adalah versi kontainer dari [node e2e test](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md). Secara bawaan, tes ini menjalankan semua tes kesesuaian.

Secara teori, kamu dapat menjalankan tes node-e2e manapun jika kamu mengkonfigurasi kontainer dan *mount* yang dibutuhkan *volume* dengan benar. Tapi **sangat direkomendasikan hanya untuk menjalankan tes kesesuaian**, karena banyak sekali konfigurasi yang dibutuhkan untuk menjalankan tes ketidaksesuaian dan tentunya lebih kompleks.

## Kekurangan

* Tes ini meninggalkan sisa-sisa *image* Docker di dalam *Node*, termasuk *image* dari tes kesesuaian *Node* dan *image* kontainer yang digunakan untuk tes fungsionalitas.
* Tes ini meninggalkan kontainer mati di dalam *Node*. Kontainer-kontainer ini dibuat selama tes fungsionalitas.
  