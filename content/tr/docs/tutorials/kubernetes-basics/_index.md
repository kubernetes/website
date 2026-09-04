---
title: Kubernetes Temellerini Öğrenin
main_menu: true
no_list: true
weight: 20
content_type: concept
card:
  name: tutorials
  weight: 20
  title: Temellerden başlayın
---

## {{% heading "objectives" %}}

Bu eğitim, Kubernetes küme orkestrasyon sisteminin temellerini adım adım anlatır.
Her modül, başlıca Kubernetes özellikleri ve kavramları hakkında bazı arka plan bilgileri
ile takip edebileceğiniz bir eğitim içerir.

Eğitimleri kullanarak şunları öğrenebilirsiniz:

* Bir kümede konteyner haline getirilmiş bir uygulamayı dağıtmayı.
* Dağıtımı ölçeklendirmeyi.
* Konteyner haline getirilmiş uygulamayı yeni bir yazılım sürümüyle güncellemeyi.
* Konteyner haline getirilmiş uygulamada hata ayıklamayı.

## Kubernetes sizin için neler yapabilir?

Modern web hizmetlerinde, kullanıcılar uygulamaların 7/24 kullanılabilir olmasını bekler ve geliştiriciler,
bu uygulamaların yeni sürümlerini günde birkaç kez dağıtmayı bekler. Konteynerleştirme,
yazılımı bu hedeflere hizmet edecek şekilde paketlemeye yardımcı olur ve uygulamaların
kesinti olmadan yayınlanmasını ve güncellenmesini sağlar. Kubernetes, konteyner haline getirilmiş bu
uygulamaların istediğiniz yerde ve zamanda çalışmasını sağlamanıza yardımcı olur ve çalışmaları için
ihtiyaç duydukları kaynak ve araçları bulmalarına yardımcı olur. Kubernetes, Google'ın konteyner
orkestrasyonundaki birikmiş deneyimiyle ve topluluğun en iyi fikirleriyle tasarlanmış,
üretime hazır, açık kaynaklı bir platformdur.

## Kubernetes Temelleri Modülleri

<!-- For translators, translate only the values of the ‘alt’ and ‘title’ keys -->
{{< tutorials/modules >}}
  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/create-cluster/cluster-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_01.svg?v=1469803628347"
      alt="Modül 1"
      title="1. Bir Kubernetes kümesi oluşturun" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_02.svg?v=1469803628347"
      alt="Modül 2"
      title="2. Bir uygulama dağıtın" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/explore/explore-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_03.svg?v=1469803628347"
      alt="Modül 3"
      title="3. Uygulamanızı keşfedin" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/expose/expose-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_04.svg?v=1469803628347"
      alt="Modül 4"
      title="4. Uygulamanızı herkese açık şekilde yayınlayın" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/scale/scale-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_05.svg?v=1469803628347"
      alt="Modül 5"
      title="5. Uygulamanızı ölçeklendirin" >}}

  {{< tutorials/module
      path="/docs/tutorials/kubernetes-basics/update/update-intro/"
      image="/docs/tutorials/kubernetes-basics/public/images/module_06.svg?v=1469803628347"
      alt="Modül 6"
      title="6. Uygulamanızı güncelleyin" >}}
{{< /tutorials/modules >}}

## {{% heading "whatsnext" %}}

* Alıştırma kümeleri ve kendinize ait bir küme çalıştırmanın yolları hakkında daha fazla bilgi için [Öğrenme ortamı](/docs/setup/learning-environment/) sayfasına bakın.
* Eğitim: [Bir Küme Oluşturmak için Minikube Kullanma](/docs/tutorials/kubernetes-basics/create-cluster/)
