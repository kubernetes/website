---
reviewers:
- tallclair
- liggitt
title: Pod Güvenlik Standartlarını Uygulama
weight: 40
---

<!-- overview -->

Bu sayfa, [Pod Güvenlik Standartlarını](/docs/concepts/security/pod-security-standards) uygularken en iyi uygulamalara genel bir bakış sağlar.

<!-- body -->

## Yerleşik Pod Güvenlik Kabul Denetleyicisini Kullanma

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

[Pod Güvenlik Kabul Denetleyicisi](/docs/reference/access-authn-authz/admission-controllers/#podsecurity), kullanımdan kaldırılan PodSecurityPolicies'in yerini almayı amaçlamaktadır.

### Tüm küme ad alanlarını yapılandırın

Hiçbir yapılandırmaya sahip olmayan ad alanları, küme güvenlik modelinizde önemli boşluklar olarak kabul edilmelidir. Her ad alanında gerçekleşen iş yükü türlerini analiz etmek için zaman ayırmanızı ve Pod Güvenlik Standartlarına referansla her biri için uygun bir seviye belirlemenizi öneririz. Etiketlenmemiş ad alanları, yalnızca henüz değerlendirilmediklerini göstermelidir.

Tüm ad alanlarındaki tüm iş yüklerinin aynı güvenlik gereksinimlerine sahip olduğu senaryoda, PodSecurity etiketlerinin toplu olarak nasıl uygulanabileceğini gösteren bir [örnek](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces) sağlıyoruz.

### En az ayrıcalık ilkesini benimseyin

İdeal bir dünyada, her ad alanındaki her pod `restricted` politikasının gereksinimlerini karşılayacaktır. Ancak, bu mümkün veya pratik değildir, çünkü bazı iş yükleri meşru nedenlerle yükseltilmiş ayrıcalıklar gerektirecektir.

- `privileged` iş yüklerine izin veren ad alanları uygun erişim kontrollerini oluşturmalı ve uygulamalıdır.
- Bu izin verici ad alanlarında çalışan iş yükleri için, benzersiz güvenlik gereksinimleri hakkında belgeler tutun. Mümkünse, bu gereksinimlerin nasıl daha fazla kısıtlanabileceğini düşünün.

### Çok modlu bir strateji benimseyin

Pod Güvenlik Standartları kabul denetleyicisinin `audit` ve `warn` modları, mevcut iş yüklerini bozmadan podlarınız hakkında önemli güvenlik bilgileri toplamanızı kolaylaştırır.

Bu modları tüm ad alanları için etkinleştirmek iyi bir uygulamadır, onları sonunda `enforce` etmek isteyeceğiniz _istenen_ seviyeye ve sürüme ayarlayın. Bu aşamada üretilen uyarılar ve denetim açıklamaları sizi o duruma yönlendirebilir. İş yükü yazarlarının istenen seviyeye uymak için değişiklikler yapmasını bekliyorsanız, `warn` modunu etkinleştirin. İstenilen seviyeye uymak için değişiklikleri izlemek/sürdürmek için denetim günlüklerini kullanmayı bekliyorsanız, `audit` modunu etkinleştirin.

`enforce` modunu istediğiniz değere ayarladığınızda, bu modlar hala birkaç farklı şekilde yararlı olabilir:

- `warn` modunu `enforce` ile aynı seviyeye ayarlayarak, istemciler geçerli olmayan Podlar (veya Pod şablonlarına sahip kaynaklar) oluşturmaya çalıştıklarında uyarılar alır. Bu, bu kaynakları uyumlu hale getirmelerine yardımcı olacaktır.
- `enforce` modunu belirli bir en son olmayan sürüme sabitleyen ad alanlarında, `audit` ve `warn` modlarını `enforce` ile aynı seviyeye, ancak `en son` sürüme ayarlamak, önceki sürümler tarafından izin verilen ancak mevcut en iyi uygulamalara göre izin verilmeyen ayarları görünür hale getirir.

## Üçüncü taraf alternatifleri

{{% thirdparty-content %}}

Kubernetes ekosisteminde güvenlik profillerini uygulamak için başka alternatifler geliştirilmektedir:

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

Yerleşik bir çözüm (örneğin PodSecurity kabul denetleyicisi) ile üçüncü taraf bir araç arasında karar vermek tamamen kendi durumunuza bağlıdır. Herhangi bir çözümü değerlendirirken, tedarik zincirinizin güvenilirliği çok önemlidir. Sonuçta, yukarıda belirtilen yaklaşımlardan _herhangi birini_ kullanmak hiçbir şey yapmamaktan daha iyi olacaktır.
