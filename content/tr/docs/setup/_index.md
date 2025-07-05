---
reviewers:
- brendandburns
- erictune
- mikedanese
title: Başlarken
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Öğrenme ortamı
  - anchor: "#production-environment"
    title: Üretim ortamı  
---

<!-- overview -->

Bu bölüm, Kubernetes'i kurmanın ve çalıştırmanın farklı yollarını listeler.
Kubernetes'i kurarken, bakım kolaylığı, güvenlik, kontrol, mevcut kaynaklar ve bir küme işletme ve yönetme konusunda gereken uzmanlığa dayalı bir kurulum türü seçin.

Bir Kubernetes kümesini yerel bir makineye, buluta veya kendi veri merkezinize dağıtmak için [Kubernetes'i indirin](/releases/download/).

{{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} veya {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} gibi çeşitli [Kubernetes bileşenleri](/docs/concepts/overview/components/) de küme içinde [konteyner görüntüleri](/releases/download/#container-images) olarak dağıtılabilir.

Kubernetes bileşenlerini mümkün olduğunda konteyner görüntüleri olarak çalıştırmanız ve bu bileşenleri Kubernetes'in yönetmesini sağlamanız **önerilir**.
Konteyner çalıştıran bileşenler - özellikle kubelet - bu kategoriye dahil edilemez.

Bir Kubernetes kümesini kendiniz yönetmek istemiyorsanız, [sertifikalı platformlar](/docs/setup/production-environment/turnkey-solutions/) dahil olmak üzere yönetilen bir hizmet seçebilirsiniz.
Ayrıca, geniş bir bulut ve çıplak metal ortamları yelpazesinde diğer standart ve özel çözümler de mevcuttur.

<!-- body -->

## Öğrenme ortamı

Kubernetes'i öğreniyorsanız, Kubernetes topluluğu tarafından desteklenen araçları veya ekosistemdeki araçları kullanarak yerel bir makinede bir Kubernetes kümesi kurun.
[Kurulum araçlarını](/docs/tasks/tools/) inceleyin.

## Üretim ortamı

[Üretim ortamı](/docs/setup/production-environment/) için bir çözüm değerlendirirken, bir Kubernetes kümesini işletmenin (veya _soyutlamaların_) hangi yönlerini kendiniz yönetmek istediğinizi ve hangilerini bir sağlayıcıya devretmeyi tercih ettiğinizi düşünün.

Kendiniz yönettiğiniz bir küme için, Kubernetes'i dağıtmak için resmi olarak desteklenen araç [kubeadm](/docs/setup/production-environment/tools/kubeadm/)'dir.

## {{% heading "whatsnext" %}}

- [Kubernetes'i indirin](/releases/download/)
- `kubectl` dahil [kurulum araçlarını](/docs/tasks/tools/) indirin ve kurun
- Yeni kümeniz için bir [konteyner çalışma zamanı](/docs/setup/production-environment/container-runtimes/) seçin
- Küme kurulumu için [en iyi uygulamaları](/docs/setup/best-practices/) öğrenin

Kubernetes, {{< glossary_tooltip term_id="control-plane" text="kontrol düzlemi" >}}'nin Linux üzerinde çalışması için tasarlanmıştır. Kümeniz içinde Linux veya Windows dahil diğer işletim sistemlerinde uygulamalar çalıştırabilirsiniz.

- Windows düğümleriyle kümeleri kurmayı öğrenin](/docs/concepts/windows/)
