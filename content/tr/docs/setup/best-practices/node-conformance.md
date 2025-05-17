---
reviewers:
- Random-Liu
title: Düğüm kurulumunu doğrulayın
weight: 30
---

## Düğüm Uyum Testi

*Düğüm uyum testi*, bir düğüm için sistem doğrulama ve işlevsellik testi sağlayan kapsayıcılaştırılmış bir test çerçevesidir. Test, düğümün Kubernetes için minimum gereksinimleri karşılayıp karşılamadığını doğrular; testi geçen bir düğüm, bir Kubernetes kümesine katılmaya hak kazanır.

## Düğüm Ön Koşulu

Düğüm uyum testini çalıştırmak için, bir düğüm standart bir Kubernetes düğümü ile aynı ön koşulları karşılamalıdır. En azından, düğümde aşağıdaki daemonlar kurulmuş olmalıdır:

* Docker, containerd ve CRI-O gibi CRI uyumlu kapsayıcı çalışma zamanları
* kubelet

## Düğüm Uyum Testini Çalıştırma

Düğüm uyum testini çalıştırmak için aşağıdaki adımları izleyin:

1. Kubelet için `--kubeconfig` seçeneğinin değerini belirleyin; örneğin: `--kubeconfig=/var/lib/kubelet/config.yaml`.
  Test çerçevesi kubeleti test etmek için yerel bir kontrol düzlemi başlattığından, API sunucusunun URL'si olarak `http://localhost:8080` kullanın.
  Kullanmak isteyebileceğiniz bazı diğer kubelet komut satırı parametreleri şunlardır:
  
   * `--cloud-provider`: `--cloud-provider=gce` kullanıyorsanız, testi çalıştırmak için bayrağı kaldırmalısınız.

1. Düğüm uyum testini şu komutla çalıştırın:

   ```shell
   # $CONFIG_DIR, kubelet'in pod manifest yoludur.
   # $LOG_DIR, test çıktısı yoludur.
   sudo docker run -it --rm --privileged --net=host \
   -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
   registry.k8s.io/node-test:0.2
   ```

## Diğer Mimariler İçin Düğüm Uyum Testini Çalıştırma

Kubernetes ayrıca diğer mimariler için düğüm uyum testi docker görüntüleri sağlar:

|  Arch  |       Image       |
|--------|:-----------------:| 
|  amd64 |  node-test-amd64  |
|  arm   |   node-test-arm   |
| arm64  |  node-test-arm64  |

## Seçili Testi Çalıştırma

Belirli testleri çalıştırmak için, çalıştırmak istediğiniz testlerin düzenli ifadesi ile `FOCUS` ortam değişkenini geçersiz kılın.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Sadece MirrorPod testini çalıştır
  registry.k8s.io/node-test:0.2
```

Belirli testleri atlamak için, atlamak istediğiniz testlerin düzenli ifadesi ile `SKIP` ortam değişkenini geçersiz kılın.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Tüm uyum testlerini çalıştır ama MirrorPod testini atla
  registry.k8s.io/node-test:0.2
```

Düğüm uyum testi, [düğüm e2e testi](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/e2e-node-tests.md)'nin kapsayıcılaştırılmış bir versiyonudur. Varsayılan olarak, tüm uyum testlerini çalıştırır.

Teorik olarak, kapsayıcıyı yapılandırıp gerekli birimleri doğru şekilde monte ederseniz herhangi bir düğüm e2e testini çalıştırabilirsiniz. Ancak **yalnızca uyum testini çalıştırmanız şiddetle tavsiye edilir**, çünkü uyum dışı testleri çalıştırmak çok daha karmaşık bir yapılandırma gerektirir.

## Uyarılar

* Test, düğümde bazı docker görüntüleri bırakır, bunlar arasında düğüm uyum testi görüntüsü ve işlevsellik testinde kullanılan kapsayıcıların görüntüleri bulunur.
* Test, düğümde ölü kapsayıcılar bırakır. Bu kapsayıcılar işlevsellik testi sırasında oluşturulur.
