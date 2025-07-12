---
title: Aynı Pod İçindeki Konteynerler Arasında Paylaşılan Bir Hacim Kullanarak İletişim Kurma
content_type: task
weight: 120
---

<!-- overview -->

Bu sayfa, aynı Pod'da çalışan iki Konteyner arasında iletişim kurmak için bir Hacim kullanmayı gösterir. Ayrıca, konteynerler arasında [işlem ad alanını paylaşarak](/docs/tasks/configure-pod-container/share-process-namespace/) süreçlerin nasıl iletişim kurmasına izin verileceğini de görebilirsiniz.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

##  İki Konteyner Çalıştıran Bir Pod Oluşturma

Bu alıştırmada, iki Konteyner çalıştıran bir Pod oluşturacaksınız. İki konteyner, iletişim kurmak için kullanabilecekleri bir Hacimi paylaşır. İşte Pod için yapılandırma dosyası:

{{% code_sample file="pods/two-container-pod.yaml" %}}

Yapılandırma dosyasında, Pod'un `shared-data` adlı bir Hacime sahip olduğunu görebilirsiniz.

Yapılandırma dosyasında listelenen ilk konteyner bir nginx sunucusu çalıştırır. Paylaşılan Hacim için bağlama yolu `/usr/share/nginx/html`'dir.
İkinci konteyner debian imajına dayanmaktadır ve bağlama yolu `/pod-data`'dır. İkinci konteyner aşağıdaki komutu çalıştırır ve ardından sonlanır.

  echo Hello from the debian container > /pod-data/index.html

Dikkat edin ki ikinci konteyner, nginx sunucusunun kök dizininde `index.html` dosyasını yazar.

Pod'u ve iki Konteyneri oluşturun:

  kubectl apply -f https://k8s.io/examples/pods/two-container-pod.yaml

Pod ve Konteynerler hakkında bilgi görüntüleyin:

  kubectl get pod two-containers --output=yaml

İşte çıktının bir kısmı:

  apiVersion: v1
  kind: Pod
  metadata:
    ...
    name: two-containers
    namespace: default
    ...
  spec:
    ...
    containerStatuses:

    - containerID: docker://c1d8abd1 ...
    image: debian
    ...
    lastState:
      terminated:
      ...
    name: debian-container
    ...

    - containerID: docker://96c1ff2c5bb ...
    image: nginx
    ...
    name: nginx-container
    ...
    state:
      running:
    ...

Debian Konteynerinin sonlandığını ve nginx Konteynerinin hala çalıştığını görebilirsiniz.

nginx Konteynerine bir kabuk alın:

  kubectl exec -it two-containers -c nginx-container -- /bin/bash

Kabukta, nginx'in çalıştığını doğrulayın:

  root@two-containers:/# apt-get update
  root@two-containers:/# apt-get install curl procps
  root@two-containers:/# ps aux

Çıktı şu şekilde benzer olacaktır:

  USER       PID  ...  STAT START   TIME COMMAND
  root         1  ...  Ss   21:12   0:00 nginx: master process nginx -g daemon off;

Debian Konteynerinin nginx kök dizininde `index.html` dosyasını oluşturduğunu hatırlayın. nginx sunucusuna bir GET isteği göndermek için `curl` kullanın:

```
root@two-containers:/# curl localhost
```

Çıktı, nginx'in debian konteyneri tarafından yazılmış bir web sayfası sunduğunu gösterir:

```
Hello from the debian container
```

<!-- discussion -->

## Tartışma

Pod'ların birden fazla konteynere sahip olmasının birincil nedeni, birincil uygulamaya yardımcı olan yardımcı uygulamaları desteklemektir. Yardımcı uygulamaların tipik örnekleri veri çekiciler, veri iticiler ve proxy'lerdir.
Yardımcı ve birincil uygulamalar genellikle birbirleriyle iletişim kurmak zorundadır. Genellikle bu, bu alıştırmada gösterildiği gibi paylaşılan bir dosya sistemi veya localhost döngüsel ağ arayüzü aracılığıyla yapılır. Bu modelin bir örneği, yeni güncellemeler için bir Git deposunu sorgulayan bir yardımcı program ile birlikte bir web sunucusudur.

Bu alıştırmadaki Hacim, Pod'un ömrü boyunca Konteynerlerin iletişim kurması için bir yol sağlar. Pod silinir ve yeniden oluşturulursa, paylaşılan Hacimde saklanan veriler kaybolur.

## {{% heading "whatsnext" %}}


* [Bileşik konteynerler için desenler](/blog/2015/06/the-distributed-system-toolkit-patterns/) hakkında daha fazla bilgi edinin.

* [Modüler mimari için bileşik konteynerler](https://www.slideshare.net/Docker/slideshare-burns) hakkında bilgi edinin.

* [Depolama için bir Hacim kullanacak şekilde bir Pod yapılandırma](/docs/tasks/configure-pod-container/configure-volume-storage/) konusuna bakın.

* [Bir Pod'daki konteynerler arasında işlem ad alanını paylaşacak şekilde bir Pod yapılandırma](/docs/tasks/configure-pod-container/share-process-namespace/) konusuna bakın.

* [Hacim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core) konusuna bakın.

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core) konusuna bakın.
