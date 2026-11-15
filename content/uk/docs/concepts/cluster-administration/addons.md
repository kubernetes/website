---
title: Встановлення надбудов
content_type: concept
weight: 150
---

<!-- overview -->

{{% thirdparty-content %}}

Надбудови розширюють функціональність Kubernetes.

На цій сторінці перелічено деякі доступні надбудови з посиланнями на відповідні інструкції зі встановлення. Список не претендує на вичерпність.

<!-- body -->

## Мережа та мережеві політики {#networking-and-network-policy}

* [ACI](https://www.github.com/noironetworks/aci-containers) забезпечує інтегровану мережу контейнерів і мережеву безпеку з Cisco ACI.
* [Antrea](https://antrea.io/) працює на рівнях 3/4, щоб надавати мережеві сервіси та сервіси безпеки для Kubernetes, використовуючи Open vSwitch як мережеву площину даних. Antrea — це [проєкт CNCF рівня Sandbox](https://www.cncf.io/projects/antrea/).
* [Calico](https://www.tigera.io/project-calico/) — це провайдер мережі та мережевих політик. Calico підтримує гнучкий набір мережевих параметрів, тож ви можете вибрати найефективніший варіант для своєї ситуації, зокрема мережі без оверлею та оверлейні мережі, з BGP або без нього. Calico використовує той самий рушій для застосування мережевих політик до хостів, Podʼів і (якщо використовуються Istio та Envoy) застосунків на рівні service mesh.
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel) обʼєднує Flannel і Calico, забезпечуючи мережу та мережеві політики.
* [Cilium](https://github.com/cilium/cilium) — це рішення для мережі, спостережуваності та безпеки з площиною даних на основі eBPF. Cilium надає просту пласку мережу рівня 3 з можливістю охоплення кількох кластерів у режимі нативної маршрутизації або в режимі оверлею/інкапсуляції та може застосовувати мережеві політики на рівнях L3-L7 за допомогою моделі безпеки на основі ідентичності, відокремленої від мережевої адресації. Cilium може замінити kube-proxy; він також пропонує додаткові можливості спостережуваності й безпеки, які вмикаються за бажанням. Cilium — це [проєкт CNCF рівня Graduated](https://www.cncf.io/projects/cilium/).
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie) дозволяє Kubernetes безшовно підʼєднуватися до вибраних втулків CNI, таких як Calico, Canal, Flannel або Weave. CNI-Genie — це [проєкт CNCF рівня Sandbox](https://www.cncf.io/projects/cni-genie/).
* [Contiv](https://contivpp.io/) надає налаштовувану мережу (нативний L3 із BGP, оверлей із vxlan, класичний L2 і Cisco-SDN/ACI) для різних випадків використання та багатий фреймворк політик. Проєкт Contiv має повністю [відкритий код](https://github.com/contiv). [Інсталятор](https://github.com/contiv/install) пропонує варіанти встановлення як на основі kubeadm, так і без нього.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), заснований на [Tungsten Fabric](https://tungsten.io), — це платформа з відкритим кодом для віртуалізації багатохмарних мереж і керування політиками. Contrail і Tungsten Fabric інтегровані із системами оркестрування, такими як Kubernetes, OpenShift, OpenStack і Mesos, і надають режими ізоляції для віртуальних машин, контейнерів/Podʼів і робочих навантажень на фізичному обладнанні.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) — це провайдер оверлейної мережі, який можна використовувати з Kubernetes.
* [Gateway API](/docs/concepts/services-networking/gateway/) — це проєкт із відкритим кодом, яким керує спільнота [SIG Network](https://github.com/kubernetes/community/tree/main/sig-network), що надає виразний, розширюваний і орієнтований на ролі API для моделювання мережевої взаємодії сервісів.
* [Knitter](https://github.com/ZTE/Knitter/) — це втулок для підтримки кількох мережевих інтерфейсів у Podʼі Kubernetes.
* [kube-router](https://github.com/cloudnativelabs/kube-router) — це готове рішення з відкритим кодом для мережі Kubernetes, метою якого є простота експлуатації та висока продуктивність. Воно використовує API Kubernetes, BGP і Golang для шляху керування та мережеві примітиви Linux (IPVS, nftables тощо) для шляху даних. Це альтернатива з низькими накладними витратами, яка використовується в k0s і k3s.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni) — це мультивтулок для підтримки кількох мереж у Kubernetes, який підтримує всі втулки CNI (наприклад, Calico, Cilium, Contiv, Flannel), а також робочі навантаження на основі SRIOV, DPDK, OVS-DPDK і VPP у Kubernetes.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) — це провайдер мережі для Kubernetes на основі [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/), реалізації віртуальної мережі, що вийшла з проєкту Open vSwitch (OVS). OVN-Kubernetes надає реалізацію мережі на основі оверлею для Kubernetes, зокрема реалізацію балансування навантаження та мережевих політик на основі OVS.
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus) — це втулок контролера CNI на основі OVN для забезпечення ланцюжків сервісних функцій (Service Function Chaining, SFC) у стилі cloud native.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in (NCP) забезпечує інтеграцію між VMware NSX-T та оркестраторами контейнерів, такими як Kubernetes, а також інтеграцію між NSX-T та контейнерними платформами CaaS/PaaS, такими як Pivotal Container Service (PKS) та OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) — це платформа SDN, яка забезпечує мережу на основі політик між Podʼами Kubernetes і середовищами поза Kubernetes із моніторингом видимості та безпеки.
* [Romana](https://github.com/romana) — це мережеве рішення рівня 3 для мереж Podʼів, яке також підтримує API [NetworkPolicy](/docs/concepts/services-networking/network-policies/).
* [Spiderpool](https://github.com/spidernet-io/spiderpool) — це мережеве рішення базової мережі (underlay) та RDMA для Kubernetes. Spiderpool підтримується на фізичному обладнанні, віртуальних машинах і в публічних хмарних середовищах.
* [Terway](https://github.com/AliyunContainerService/terway/) — це набір втулків CNI на основі мережевих продуктів VPC та ECS від AlibabaCloud. Він забезпечує нативну мережу VPC і мережеві політики в середовищах AlibabaCloud.
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes) забезпечує мережу та мережеві політики, продовжує працювати з обох боків розділення мережі й не потребує зовнішньої бази даних.

## Виявлення сервісів {#service-discovery}

* [CoreDNS](https://coredns.io) — це гнучкий, розширюваний DNS-сервер, який можна [встановити](https://github.com/coredns/helm) як внутрішньокластерний DNS для Podʼів.

## Візуалізація та керування {#visualization-control}

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) — це вебінтерфейс dashboard для Kubernetes.
* [Headlamp](https://headlamp.dev/) — це розширюваний інтерфейс користувача Kubernetes, який можна розгорнути в кластері або використовувати як настільний застосунок.

## Інфраструктура {#infrastructure}

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) — це надбудова для запуску віртуальних машин у Kubernetes. Зазвичай працює в кластерах на фізичному обладнанні.
* [Node problem detector](https://github.com/kubernetes/node-problem-detector) працює на вузлах Linux і повідомляє про системні проблеми у вигляді [Events](/docs/reference/kubernetes-api/cluster-resources/event-v1/) або [станів вузла](/docs/concepts/architecture/nodes/#condition).

## Інструментування {#instrumentation}

* [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics)

## Застарілі надбудови {#legacy-add-ons}

Кілька інших надбудов задокументовано в застарілій теці [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons).

Надбудови, що добре підтримуються, мають бути вказані тут. Чекаємо на ваші PR!
