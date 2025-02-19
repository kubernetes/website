---
reviewers:
- davidopp
- lavalamp
title: Büyük kümeler için dikkate alınması gerekenler
weight: 10
---

Bir küme, Kubernetes ajanlarını çalıştıran ve 
{{< glossary_tooltip text="kontrol düzlemi" term_id="control-plane" >}} tarafından yönetilen 
{{< glossary_tooltip text="düğümler" term_id="node" >}} (fiziksel veya sanal makineler) setidir.
Kubernetes {{< param "version" >}}, 5.000 düğüme kadar kümeleri destekler. Daha spesifik olarak,
Kubernetes, *tüm* aşağıdaki kriterleri karşılayan yapılandırmaları barındıracak şekilde tasarlanmıştır:

* Düğüm başına en fazla 110 pod
* En fazla 5.000 düğüm
* Toplamda en fazla 150.000 pod
* Toplamda en fazla 300.000 konteyner

Kümenizi düğüm ekleyerek veya çıkararak ölçeklendirebilirsiniz. Bunu yapma şekliniz,
kümenizin nasıl dağıtıldığına bağlıdır.

## Bulut sağlayıcı kaynak kotaları {#quota-issues}

Birçok düğüme sahip bir küme oluştururken bulut sağlayıcı kota sorunlarıyla karşılaşmamak için,
şunları göz önünde bulundurun:
* Bilgisayar örnekleri, CPU'lar, depolama birimleri, kullanılan IP adresleri, paket filtreleme kural setleri, yük dengeleyici sayısı, ağ alt ağları, günlük akışları gibi bulut kaynakları için kota artışı talep etmek
* Bazı bulut sağlayıcılar yeni örneklerin oluşturulmasını hız sınırladığı için, yeni düğümleri gruplar halinde oluşturma ve gruplar arasında duraklama yapma

## Kontrol düzlemi bileşenleri

Büyük bir küme için, yeterli hesaplama ve diğer kaynaklara sahip bir kontrol düzlemine ihtiyacınız vardır.

Genellikle, her hata bölgesi başına bir veya iki kontrol düzlemi örneği çalıştırırsınız,
bu örnekleri önce dikey olarak ölçeklendirir ve ardından (dikey) ölçeklendirmede azalan getiri noktasına ulaştıktan sonra yatay olarak ölçeklendirirsiniz.

Hata toleransı sağlamak için her hata bölgesinde en az bir örnek çalıştırmalısınız. Kubernetes
düğümleri, trafiği aynı hata bölgesindeki kontrol düzlemi uç noktalarına otomatik olarak yönlendirmez; ancak, bulut sağlayıcınızın bunu yapmak için kendi mekanizmaları olabilir.

Örneğin, yönetilen bir yük dengeleyici kullanarak, yük dengeleyiciyi kubelet ve Pod'lardan gelen trafiği hata bölgesi _A_'dan alacak şekilde yapılandırabilir ve bu trafiği yalnızca hata bölgesi _A_'daki kontrol düzlemi ana bilgisayarlarına yönlendirebilirsiniz. Hata bölgesi _A_'daki tek bir kontrol düzlemi ana bilgisayarı veya uç noktası çevrimdışı olursa, bu, hata bölgesi _A_'daki düğümler için tüm kontrol düzlemi trafiğinin artık bölgeler arasında gönderildiği anlamına gelir. Her bölgede birden fazla kontrol düzlemi ana bilgisayarı çalıştırmak bu sonucu daha az olası hale getirir.

### etcd depolama

Büyük kümelerin performansını artırmak için, Olay nesnelerini ayrı bir özel etcd örneğinde depolayabilirsiniz.

Bir küme oluştururken, özel araçlar kullanarak:

* ek etcd örneği başlatın ve yapılandırın
* {{< glossary_tooltip term_id="kube-apiserver" text="API sunucusu" >}}'nu olayları depolamak için kullanacak şekilde yapılandırın

Büyük bir küme için etcd'yi yapılandırma ve yönetme hakkında ayrıntılar için [Kubernetes için etcd kümelerini işletme](/docs/tasks/administer-cluster/configure-upgrade-etcd/) ve
[kubeadm ile Yüksek Erişilebilirlik etcd kümesi kurma](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/) sayfalarına bakın.

## Eklenti kaynakları

Kubernetes [kaynak sınırları](/docs/concepts/configuration/manage-resources-containers/),
bellek sızıntıları ve diğer yollarla pod'ların ve konteynerlerin diğer bileşenleri etkilemesini en aza indirmeye yardımcı olur. Bu kaynak sınırları,
{{< glossary_tooltip text="eklenti" term_id="addons" >}} kaynaklarına da uygulandığı gibi uygulama iş yüklerine de uygulanır.

Örneğin, bir günlük bileşeni için CPU ve bellek sınırları belirleyebilirsiniz:

```yaml
  ...
  containers:
  - name: fluentd-cloud-logging
    image: fluent/fluentd-kubernetes-daemonset:v1
    resources:
      limits:
        cpu: 100m
        memory: 200Mi
```

Eklentilerin varsayılan sınırları, genellikle her eklentiyi küçük veya orta ölçekli Kubernetes kümelerinde çalıştırma deneyiminden toplanan verilere dayanır. Büyük
kümelerde çalışırken, eklentiler genellikle varsayılan sınırlarından daha fazla kaynak tüketir.
Büyük bir küme, bu değerler ayarlanmadan dağıtılırsa, eklenti(ler) sürekli olarak bellek sınırına ulaştıkları için öldürülebilir.
Alternatif olarak, eklenti çalışabilir ancak CPU zaman dilimi kısıtlamaları nedeniyle zayıf performans gösterebilir.

Birçok düğüme sahip bir küme oluştururken eklenti kaynak sorunlarıyla karşılaşmamak için, şunları göz önünde bulundurun:

* Bazı eklentiler dikey olarak ölçeklenir - küme için veya tüm hata bölgesine hizmet veren bir eklenti kopyası vardır. Bu eklentiler için, kümenizi ölçeklendirdikçe istekleri ve sınırları artırın.
* Birçok eklenti yatay olarak ölçeklenir - daha fazla pod çalıştırarak kapasite ekleyebilirsiniz - ancak çok büyük bir kümede CPU veya bellek sınırlarını da biraz artırmanız gerekebilir.
  [Dikey Pod Otomatik Ölçekleyici](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) _önerici_ modunda çalışarak istekler ve sınırlar için önerilen
  rakamları sağlayabilir.
* Bazı eklentiler, bir {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} tarafından kontrol edilen, düğüm başına bir kopya olarak çalışır: örneğin, düğüm düzeyinde bir günlük toplayıcı. Yatay olarak ölçeklenen eklentilerde olduğu gibi, CPU veya bellek sınırlarını biraz artırmanız gerekebilir.

## {{% heading "whatsnext" %}}

* `VerticalPodAutoscaler`, pod'lar için kaynak isteklerini ve sınırlarını yönetmenize yardımcı olan bir özel kaynaktır.  
[Vertical Pod Autoscaler](https://github.com/kubernetes/autoscaler/tree/master/vertical-pod-autoscaler#readme) hakkında daha fazla bilgi edinin 
ve küme bileşenlerini, küme kritik eklentilerini ölçeklendirmek için nasıl kullanabileceğinizi öğrenin.

* [Düğüm otomatik ölçeklendirme](/docs/concepts/cluster-administration/node-autoscaling/) hakkında bilgi edinin

* [eklenti yeniden boyutlandırıcı](https://github.com/kubernetes/autoscaler/tree/master/addon-resizer#readme),
kümenizin ölçeği değiştikçe eklentileri otomatik olarak yeniden boyutlandırmanıza yardımcı olur.
