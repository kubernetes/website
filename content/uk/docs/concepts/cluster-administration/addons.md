---
title: Встановлення надбудов
content_type: concept
weight: 150
---

<!-- overview -->

{{% thirdparty-content %}}

Надбудови розширюють функціональність Kubernetes.

Ця сторінка містить список доступних надбудов та посилання на відповідні інструкції з встановлення. Список не намагається бути вичерпним.

<!-- body -->

## Мережа та політика мережі {#networking-and-network-policy}

* [ACI](https://www.github.com/noironetworks/aci-containers) надає інтегровану мережу контейнерів та мережеву безпеку з Cisco ACI.
* [Antrea](https://antrea.io/) працює на рівні 3/4, щоб надати мережеві та служби безпеки для Kubernetes, використовуючи Open vSwitch як мережеву панель даних. Antrea є [проєктом CNCF на рівні Sandbox](https://www.cncf.io/projects/antrea/).
* [Calico](https://www.tigera.io/project-calico/) є постачальником мережі та мережевої політики. Calico підтримує гнучкий набір мережевих опцій, щоб ви могли вибрати найефективнішу опцію для вашої ситуації, включаючи мережі з та без оверлею, з або без BGP. Calico використовує однаковий рушій для забезпечення мережевої політики для хостів, Podʼів та (якщо використовуєте Istio та Envoy) застосунків на рівні шару сервісної мережі.
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel) обʼєднує Flannel та Calico, надаючи мережу та мережеву політику.
* [Cilium](https://github.com/cilium/cilium): це рішення для мережі, спостереження та забезпечення безпеки з eBPF-орієнтованою панеллю даних. Cilium надає просту мережу Layer 3 з можливістю охоплення декількох кластерів в режимі маршрутизації або режимі налагодження/інкапсуляції та може застосовувати політики мережі на рівнях L3-L7 з використанням моделі безпеки на основі ідентифікації, що відʼєднана від мережевого адресування. Cilium може діяти як заміна для kube-proxy; він також пропонує додаткові функції спостереження та безпеки.
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie): Дозволяє Kubernetes безперешкодно підключатися до вибору втулків CNI, таких як Calico, Canal, Flannel або Weave.
* [Contiv](https://contivpp.io/): надає налаштовану мережу (L3 з використанням BGP, оверлей за допомогою vxlan, класичний L2 та Cisco-SDN/ACI) для різних варіантів використання та повнофункціональний фреймворк політик. Проєкт Contiv є проєктом з повністю відкритими сирцями. Встановлювач надає як варіанти установки, як з, так і без, kubeadm.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/): оснований на [Tungsten Fabric](https://tungsten.io), це відкритою платформою мережевої віртуалізації та управління політикою для кількох хмар. Contrail і Tungsten Fabric інтегровані з системами оркестрування, такими як Kubernetes, OpenShift, OpenStack і Mesos, і надають режими ізоляції для віртуальних машин, контейнерів/Podʼів та обробки робочих навантажень на bare metal.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually): постачальник мережі на основі оверлеїв, який можна використовувати з Kubernetes.
* [Gateway API](/docs/concepts/services-networking/gateway/): відкритий проєкт, керований [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network), який надає виразний, розширюваний та рольовий API для моделювання сервісних мереж.
* [Knitter](https://github.com/ZTE/Knitter/) є втулком для підтримки кількох мережевих інтерфейсів в Podʼі Kubernetes.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni): мультивтулок для підтримки кількох мереж у Kubernetes для підтримки всіх втулків CNI (наприклад, Calico, Cilium, Contiv, Flannel), а також навантаження SRIOV, DPDK, OVS-DPDK та VPP у Kubernetes.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/): постачальник мережі для Kubernetes на основі [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/), віртуальної мережевої реалізації, яка вийшла з проєкту Open vSwitch (OVS). OVN-Kubernetes забезпечує реалізацію мережі на основі оверлеїв для Kubernetes, включаючи реалізацію балансування навантаження на основі OVS та політики мережі.
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus): втулок контролера CNI на основі OVN для надання хмарних послуг на основі послуг хмарної обробки (SFC).
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in (NCP): забезпечує інтеграцію між VMware NSX-T та оркестраторами контейнерів, такими як Kubernetes, а також інтеграцію між NSX-T та контейнерними платформами CaaS/PaaS, такими як Pivotal Container Service (PKS) та OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst): платформа SDN, яка забезпечує мережеву політику між кластерами Kubernetes Pods та некластерними середовищами з можливістю моніторингу видимості та безпеки.
* [Romana](https://github.com/romana): рішення мережі рівня Layer 3 для мережевих мереж Podʼів, яке також підтримує [NetworkPolicy](/docs/concepts/services-networking/network-policies/) API.
* [Spiderpool](https://github.com/spidernet-io/spiderpool): рішення мережі основи та RDMA для Kubernetes. Spiderpool підтримується на bare metal, віртуальних машинах та публічних хмарних середовищах.
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes): надає мережу та політику мережі, буде продовжувати працювати з обох боків розділу мережі та не потребує зовнішньої бази даних.

## Виявлення служб {#service-discovery}

* [CoreDNS](https://coredns.io) — це гнучкий, розширюваний DNS-сервер, який може бути [встановлений](https://github.com/coredns/deployment/tree/master/kubernetes) як DNS в кластері для Podʼів.

## Візуалізація та управління {#visualization-amp-control}

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) — це вебінтерфейс для управління Kubernetes.

## Інфраструктура {#infrastructure}

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) — це додатковий інструмент для запуску віртуальних машин на Kubernetes. Зазвичай використовується на кластерах на bare metal.
* [Виявлення проблем вузла](https://github.com/kubernetes/node-problem-detector) — працює на вузлах Linux та повідомляє про проблеми системи як [події](/docs/reference/kubernetes-api/cluster-resources/event-v1/) або [стан вузла](/docs/concepts/architecture/nodes/#condition).

## Інструментування {#instrumentation}

* [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics)

## Старі надбудови {#legacy-addons}

Існують ще кілька інших надбудов, які документуються в застарілій теці [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons).

Добре підтримувані мають бути вказані тут. Приймаються запити на включення!
