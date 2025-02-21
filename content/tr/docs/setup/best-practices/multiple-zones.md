---
reviewers:
- jlowdermilk
- justinsb
- quinton-hoole
title: birden fazla bölgede çalıştırma
weight: 20
content_type: concept
---

<!-- overview -->

bu sayfa, kubernetes'i birden fazla bölgede çalıştırmayı açıklar.

<!-- body -->

## arka plan

kubernetes, tek bir kubernetes kümesinin birden fazla hata bölgesinde çalışabilmesi için tasarlanmıştır, genellikle bu bölgeler _bölge_ olarak adlandırılan mantıksal bir gruplama içinde yer alır. büyük bulut sağlayıcıları, bir bölgeyi, aynı özellikleri sağlayan hata bölgelerinden (aynı zamanda _kullanılabilirlik bölgeleri_ olarak da adlandırılır) oluşan bir set olarak tanımlar: bir bölge içinde, her bölge aynı apileri ve hizmetleri sunar.

tipik bulut mimarileri, bir bölgedeki bir hatanın diğer bölgedeki hizmetleri de etkileme olasılığını en aza indirmeyi amaçlar.

## kontrol düzlemi davranışı

tüm [kontrol düzlemi bileşenleri](/docs/concepts/architecture/#control-plane-components), bileşen başına çoğaltılmış, değiştirilebilir kaynaklar havuzu olarak çalışmayı destekler.

bir küme kontrol düzlemi dağıttığınızda, kontrol düzlemi bileşenlerinin kopyalarını birden fazla hata bölgesine yerleştirin. kullanılabilirlik önemli bir endişe ise, en az üç hata bölgesi seçin ve her bir kontrol düzlemi bileşenini (api sunucusu, zamanlayıcı, etcd, küme denetleyici yöneticisi) en az üç hata bölgesine çoğaltın. bir bulut denetleyici yöneticisi çalıştırıyorsanız, bunu da seçtiğiniz tüm hata bölgelerine çoğaltmalısınız.

{{< note >}}
kubernetes, api sunucusu uç noktaları için bölge çapında dayanıklılık sağlamaz. küme api sunucusunun kullanılabilirliğini artırmak için dns round-robin, srv kayıtları veya sağlık kontrolü ile üçüncü taraf bir yük dengeleme çözümü gibi çeşitli teknikler kullanabilirsiniz.
{{< /note >}}

## düğüm davranışı

kubernetes, iş yükü kaynakları (örneğin {{< glossary_tooltip text="deployment" term_id="deployment" >}} veya {{< glossary_tooltip text="statefulset" term_id="statefulset" >}}) için podları otomatik olarak bir kümedeki farklı düğümlere yayar. bu yayılma, hataların etkisini azaltmaya yardımcı olur.

düğümler başlatıldığında, her düğümdeki kubelet, kubernetes apisinde o belirli kubeleti temsil eden düğüm nesnesine otomatik olarak {{< glossary_tooltip text="labels" term_id="label" >}} ekler. bu etiketler, [bölge bilgilerini](/docs/reference/labels-annotations-taints/#topologykubernetesiozone) içerebilir.

kümeniz birden fazla bölge veya bölgeye yayılıyorsa, podların hata alanları arasında nasıl yayıldığını kontrol etmek için düğüm etiketlerini [pod topoloji yayılma kısıtlamaları](/docs/concepts/scheduling-eviction/topology-spread-constraints/) ile birlikte kullanabilirsiniz: bölgeler, bölgeler ve hatta belirli düğümler. bu ipuçları, {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}'ın podları daha iyi beklenen kullanılabilirlik için yerleştirmesini sağlar, böylece ilişkili bir hatanın tüm iş yükünüzü etkileme riskini azaltır.

örneğin, bir statefulset'in 3 kopyasının her birinin farklı bölgelerde çalıştığından emin olmak için bir kısıtlama ayarlayabilirsiniz, bu mümkün olduğunda. bunu, her iş yükü için hangi kullanılabilirlik bölgelerinin kullanıldığını açıkça tanımlamadan deklaratif olarak tanımlayabilirsiniz.

### düğümleri bölgeler arasında dağıtma

kubernetes'in çekirdeği sizin için düğümler oluşturmaz; bunu kendiniz yapmanız veya düğümleri sizin adınıza yönetmek için [cluster api](https://cluster-api.sigs.k8s.io/) gibi bir araç kullanmanız gerekir.

cluster api gibi araçları kullanarak, kümeniz için birden fazla hata alanında çalışan işçi düğümleri olarak çalışacak makine setlerini ve tüm bölge hizmet kesintisi durumunda kümeyi otomatik olarak iyileştirme kurallarını tanımlayabilirsiniz.

## podlar için manuel bölge ataması

oluşturduğunuz podlara ve deployment, statefulset veya job gibi iş yükü kaynaklarındaki pod şablonlarına [düğüm seçici kısıtlamalar](/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector) uygulayabilirsiniz.

## bölgeler için depolama erişimi

kalıcı hacimler oluşturulduğunda, kubernetes, belirli bir bölgeye bağlı herhangi bir kalıcı hacme otomatik olarak bölge etiketleri ekler. {{< glossary_tooltip text="scheduler" term_id="kube-scheduler" >}}, `novolumezoneconflict` önermesi aracılığıyla, belirli bir kalıcı hacmi talep eden podların yalnızca o hacmin bulunduğu bölgeye yerleştirilmesini sağlar.

bölge etiketleri ekleme yöntemi, bulut sağlayıcınıza ve kullandığınız depolama sağlayıcısına bağlı olabilir. doğru yapılandırmayı sağlamak için her zaman ortamınıza özgü belgeleri kontrol edin.

kalıcı hacim talepleri için, o sınıftaki depolamanın kullanabileceği hata alanlarını (bölgeleri) belirten bir {{< glossary_tooltip text="storageclass" term_id="storage-class" >}} belirtebilirsiniz. hata alanları veya bölgeleri farkında olan bir storageclass yapılandırmayı öğrenmek için [izin verilen topolojiler](/docs/concepts/storage/storage-classes/#allowed-topologies) bölümüne bakın.

## ağ iletişimi

kubernetes, kendi başına bölge farkında ağ iletişimi içermez. bir [ağ eklentisi](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) kullanarak küme ağını yapılandırabilirsiniz ve bu ağ çözümü bölgeye özgü unsurlara sahip olabilir. örneğin, bulut sağlayıcınız `type=loadbalancer` hizmetlerini destekliyorsa, yük dengeleyici, belirli bir bağlantıyı işleyen yük dengeleyici öğesiyle aynı bölgede çalışan podlara yalnızca trafik gönderebilir. ayrıntılar için bulut sağlayıcınızın belgelerini kontrol edin.

özel veya şirket içi dağıtımlar için benzer hususlar geçerlidir. {{< glossary_tooltip text="service" term_id="service" >}} ve {{< glossary_tooltip text="ingress" term_id="ingress" >}} davranışı, farklı hata bölgelerinin ele alınması da dahil olmak üzere, kümenizin tam olarak nasıl yapılandırıldığına bağlı olarak değişir.

## hata kurtarma

kümenizi kurarken, bir bölgedeki tüm hata bölgeleri aynı anda çevrimdışı olursa, kurulumunuzun hizmeti nasıl ve ne şekilde geri yükleyebileceğini de göz önünde bulundurmanız gerekebilir. örneğin, bir bölgede en az bir pod çalıştırabilen bir düğümün bulunmasına güveniyor musunuz? herhangi bir küme kritik onarım işinin, kümenizde en az bir sağlıklı düğüm bulunmasına bağlı olmadığından emin olun. örneğin: tüm düğümler sağlıksızsa, en az bir düğümü hizmete sokacak kadar onarımı tamamlamak için özel bir {{< glossary_tooltip text="toleration" term_id="toleration" >}} ile bir onarım işi çalıştırmanız gerekebilir.

kubernetes bu zorluk için bir çözüm sunmaz; ancak, dikkate alınması gereken bir konudur.

## {{% heading "whatsnext" %}}

zamanlayıcının, yapılandırılmış kısıtlamalara uyarak bir kümedeki podları nasıl yerleştirdiğini öğrenmek için [zamanlama ve tahliye](/docs/concepts/scheduling-eviction/) bölümünü ziyaret edin.
