---
no_issue: true
title: Başlarken
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#ogrenme-ortami"
    title: Öğrenme ortamı
  - anchor: "#uretim-ortami"
    title: Üretim ortamı
---

<!-- overview -->

Bu bölüm, Kubernetes'i kurmanın ve çalıştırmanın farklı yollarını listeler.
Kubernetes'i yüklediğinizde; bakım kolaylığı, güvenlik, kontrol, mevcut kaynaklar
ve bir kümeyi işletmek ve yönetmek için gereken uzmanlığa göre bir kurulum türü seçin.

Yerel bir makinede, bulutta veya kendi veri merkezinizde bir Kubernetes kümesi dağıtmak için
[Kubernetes'i indirebilirsiniz](/releases/download/).

{{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} veya {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} gibi
çeşitli [Kubernetes bileşenleri](/docs/concepts/overview/components/) küme içinde
[konteyner imajları](/releases/download/#container-images) olarak da dağıtılabilir.

Kubernetes bileşenlerini mümkün olan her yerde konteyner imajları olarak çalıştırmak
ve bu bileşenleri Kubernetes'in yönetmesini sağlamak **önerilir**.
Konteyner çalıştıran bileşenler — özellikle kubelet — bu kategoriye dahil edilemez.

Bir Kubernetes kümesini kendiniz yönetmek istemiyorsanız,
[sertifikalı platformlar](/docs/setup/production-environment/turnkey-solutions/) dahil olmak üzere yönetilen bir hizmet seçebilirsiniz.
Geniş bir bulut ve çıplak donanım ortamları yelpazesinde başka standartlaştırılmış ve özel çözümler de mevcuttur.

<!-- body -->

## Öğrenme ortamı {#ogrenme-ortami}

Kubernetes öğreniyorsanız, yerel bir makinede bir Kubernetes kümesi kurmak için
Kubernetes topluluğu tarafından desteklenen araçları veya ekosistemdeki araçları kullanın.
Bkz. [Öğrenme ortamı](/docs/setup/learning-environment/)

## Üretim ortamı {#uretim-ortami}

Bir [üretim ortamı](/docs/setup/production-environment/) için bir çözümü
değerlendirirken, bir Kubernetes kümesini işletmenin (veya _soyutlamalarının_) hangi yönlerini
kendiniz yönetmek istediğinizi ve hangilerini bir sağlayıcıya devretmeyi tercih ettiğinizi düşünün.

Kendi yönettiğiniz bir küme için, Kubernetes dağıtımı için resmi olarak desteklenen araç
[kubeadm](/docs/setup/production-environment/tools/kubeadm/)'dır.

## {{% heading "whatsnext" %}}

- [Kubernetes'i indirin](/releases/download/)
- `kubectl` dahil [araçları indirip kurun](/docs/tasks/tools/)
- Yeni kümeniz için bir [konteyner çalışma zamanı](/docs/setup/production-environment/container-runtimes/) seçin
- Küme kurulumu için [en iyi uygulamalar](/docs/setup/best-practices/) hakkında bilgi edinin

Kubernetes, {{< glossary_tooltip term_id="control-plane" text="kontrol düzleminin" >}} Linux üzerinde
çalışacak şekilde tasarlanmıştır. Kümenizin içinde uygulamaları Linux veya Windows dahil olmak üzere
diğer işletim sistemlerinde çalıştırabilirsiniz.

- [Windows düğümleri ile kümeler nasıl kurulur](/docs/concepts/windows/) öğrenin
