---
# reviewers:
# - Random-Liu
title: Tugun oʻrnatilishini tekshirish
weight: 30
---

## Tugun muvofiqlik testi {#node-conformance-test}

*Tugun muvofiqlik testi* tugun uchun tizimni tekshirish va funksional testni taqdim etadigan konteynerlashtirilgan test freymvorkidir. Test tugun Kubernetes uchun minimal talablarga javob berishini tekshiradi; testdan oʻtgan tugun Kubernetes klasteriga qoʻshilishga loyiq hisoblanadi.

## Tugun old sharti {#node-prerequisite}

Tugun muvofiqlik testini ishga tushirish uchun tugun standart Kubernetes tuguni bilan bir xil old shartlarga javob berishi kerak. Eng kamida tugunda quyidagi demonlar oʻrnatilgan boʻlishi kerak:

* containerd yoki CRI-O kabi CRI bilan mos konteyner runtime
* kubelet

## Tugun muvofiqlik testini ishga tushirish {#running-node-conformance-test}

Tugun muvofiqlik testini ishga tushirish uchun quyidagi qadamlarni bajaring:

1. kubelet foydalanadigan kubeconfig faylini uning ishga tushirish buyrugʻini
   yoki `--kubeconfig` bayrogʻi bilan berilgan yoʻl uchun systemd unitini tekshirish orqali toping. Bu
   `--config` bilan koʻrsatiladigan kubelet konfiguratsiya faylidan farq qiladi.
   kubeconfig yoʻli kubelet qanday oʻrnatilganiga bogʻliq. Ushbu kubeconfig dagi
   `server` maydonini test freymvorki ishga tushiradigan ichki API server manzili boʻlgan `https://127.0.0.1:6443` dan foydalanishga sozlang.

1. Tugun muvofiqlik testini quyidagi buyruq bilan ishga tushiring:

   ```shell
   # $CONFIG_DIR is the pod manifest path of your kubelet.
   # $LOG_DIR is the test output path.
   sudo docker run -it --rm --privileged --net=host \
     -v /:/rootfs -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
     registry.k8s.io/node-test:0.2
   ```

## Boshqa arxitekturalar uchun tugun muvofiqlik testini ishga tushirish {#running-node-conformance-test-for-other-architectures}

Kubernetes boshqa arxitekturalar uchun ham tugun muvofiqlik testi docker obrazlarini taqdim etadi:

| Arxitektura | Obraz |
|-------------|:-----------------:|
| amd64 | node-test-amd64 |
| arm | node-test-arm |
| arm64 | node-test-arm64 |

## Tanlangan testni ishga tushirish {#running-selected-test}

Aniq testlarni ishga tushirish uchun `FOCUS` muhit oʻzgaruvchisini ishga tushirmoqchi boʻlgan testlarning
muntazam ifodasi bilan almashtiring.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e FOCUS=MirrorPod \ # Only run MirrorPod test
  registry.k8s.io/node-test:0.2
```

Aniq testlarni oʻtkazib yuborish uchun `SKIP` muhit oʻzgaruvchisini oʻtkazib yubormoqchi boʻlgan testlarning
muntazam ifodasi bilan almashtiring.

```shell
sudo docker run -it --rm --privileged --net=host \
  -v /:/rootfs:ro -v $CONFIG_DIR:$CONFIG_DIR -v $LOG_DIR:/var/result \
  -e SKIP=MirrorPod \ # Run all conformance tests but skip MirrorPod test
  registry.k8s.io/node-test:0.2
```

Tugun muvofiqlik testi
[tugun e2e testi](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/e2e-node-tests.md)ning konteynerlashtirilgan versiyasidir.
Odatiy holda u barcha muvofiqlik testlarini ishga tushiradi.

Nazariy jihatdan, konteynerni toʻgʻri sozlasangiz va
kerakli hajmlarni toʻgʻri ulasangiz, istalgan tugun e2e testini ishga tushirishingiz mumkin. Lekin **faqat muvofiqlik testini ishga tushirish qatʼiy tavsiya etiladi**,
chunki muvofiqlikdan tashqari testni ishga tushirish ancha murakkabroq sozlashni talab qiladi.

## Muhim eslatmalar {#caveats}

* Test tugunda baʼzi docker obrazlarini qoldiradi, jumladan tugun muvofiqlik
  testi obrazi va funksional
  testda ishlatilgan konteynerlar obrazlari.
* Test tugunda ishlamay qolgan konteynerlarni qoldiradi. Bu konteynerlar
  funksional test davomida yaratiladi.
