---
title: "Dockershim'den Geçiş"
weight: 20
content_type: task
no_list: true
---

<!-- overview -->

Bu bölüm, dockershim'den diğer konteyner çalışma zamanlarına geçiş yaparken bilmeniz gereken bilgileri sunar.

Kubernetes 1.20'de [dockershim'in kullanımdan kaldırılması](/blog/2020/12/08/kubernetes-1-20-release-announcement/#dockershim-deprecation) duyurulduğundan beri, bu durumun çeşitli iş yüklerini ve Kubernetes kurulumlarını nasıl etkileyeceği konusunda sorular vardı. [Dockershim Kaldırma SSS](/blog/2022/02/17/dockershim-faq/) sorunu daha iyi anlamanıza yardımcı olmak için oradadır.

Dockershim, Kubernetes'in v1.24 sürümüyle kaldırıldı.
Konteyner çalışma zamanı olarak dockershim aracılığıyla Docker Engine kullanıyorsanız ve v1.24'e yükseltmek istiyorsanız,
başka bir çalışma zamanına geçmeniz veya Docker Engine desteği almak için alternatif bir yol bulmanız önerilir.
Seçeneklerinizi öğrenmek için [konteyner çalışma zamanları](/docs/setup/production-environment/container-runtimes/)
bölümüne göz atın.

Dockershim ile Kubernetes sürümü (1.23) destek dışıdır ve v1.24
yakında destek dışı kalacaktır [yakında](/releases/#release-v1-24). Karşılaştığınız sorunları
[meld etmek](https://github.com/kubernetes/kubernetes/issues) için emin olun
böylece sorunlar zamanında düzeltilebilir ve kümeniz dockershim kaldırılmasına hazır olur. V1.24 destek dışı kaldıktan sonra,
destek için Kubernetes sağlayıcınıza başvurmanız veya kümenizi etkileyen kritik sorunlar varsa birden fazla sürümü aynı anda yükseltmeniz gerekecektir.

Kümenizde birden fazla türde düğüm olabilir, ancak bu yaygın bir
yapılandırma değildir.

Bu görevler size geçiş yapmanıza yardımcı olacaktır:

* [Dockershim kaldırılmasının sizi etkileyip etkilemediğini kontrol edin](/docs/tasks/administer-cluster/migrating-from-dockershim/check-if-dockershim-removal-affects-you/)
* [Docker Engine düğümlerini dockershim'den cri-dockerd'ye geçirin](/docs/tasks/administer-cluster/migrating-from-dockershim/migrate-dockershim-dockerd/)
* [Telemetri ve güvenlik ajanlarını dockershim'den geçirme](/docs/tasks/administer-cluster/migrating-from-dockershim/migrating-telemetry-and-security-agents/)


## {{% heading "whatsnext" %}}

* Alternatif seçeneklerinizi anlamak için [konteyner çalışma zamanlarına](/docs/setup/production-environment/container-runtimes/)
  göz atın.
* Dockershim'den geçişle ilgili bir hata veya başka bir teknik sorun bulursanız,
  Kubernetes projesine [bir sorun bildirebilirsiniz](https://github.com/kubernetes/kubernetes/issues/new/choose).
