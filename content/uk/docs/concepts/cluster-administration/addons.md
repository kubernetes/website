---
title: Встановлення надбудов
content_type: concept
weight: 150
---

<!-- overview -->

{{% thirdparty-content %}}

Надбудови розширюють функціональність Kubernetes.

Ця сторінка містить список доступних надбудов та посилання на відповідні інструкції з встановлення. Цей список не намагається бути вичерпним.

<!-- body -->

## Мережа та мережеві політики {#networking-and-network-policy}

* [ACI](https://www.github.com/noironetworks/aci-containers) надає інтегровану мережу контейнерів та мережеву безпеку з Cisco ACI.
* [Antrea](https://antrea.io/) працює на рівні 3/4, щоб надати мережеві послуги та послуги безпеки для Kubernetes, використовуючи Open vSwitch як мережеву панель даних. Antrea є [проєктом CNCF на рівні Sandbox](https://www.cncf.io/projects/antrea/).
* [Calico](https://www.tigera.io/project-calico/) є постачальником мережевих послуг та послуг мережевої політики. Calico підтримує гнучкий набір мережевих опцій, щоб ви могли вибрати найефективнішу опцію для вашої ситуації, включаючи мережі з та без оверлею, з або без BGP. Calico використовує той же рушій для забезпечення мережевої політики для хостів, Podʼів та застосунків на рівні шару сервісної мережі (якщо ви використовуєте Istio та Envoy).
* [Canal](https://projectcalico.docs.tigera.io/getting-started/kubernetes/flannel/flannel) обʼєднує Flannel та Calico, надаючи мережеві рішення та мережеву політику.
* [Cilium](https://github.com/cilium/cilium): це рішення для мережі, спостережуваності та забезпечення безпеки з eBPF-орієнтованою панеллю даних. Cilium надає просту мережу Layer 3 з можливістю охоплення декількох кластерів в режимі маршрутизації або режимі налагодження/інкапсуляції та може застосовувати політики мережі на рівнях L3-L7 з використанням моделі безпеки на основі ідентифікації, що відʼєднана від мережевого адресування. Cilium може діяти як заміна для kube-proxy; він також пропонує додаткові функції спостережуваності та безпеки. Cilium — це [проєкт CNCF рівня Graduated](https://www.cncf.io/projects/cilium/).
* [CNI-Genie](https://github.com/cni-genie/CNI-Genie): Дозволяє Kubernetes безперешкодно підключатися до різних втулків CNI, таких як Calico, Canal, Flannel або Weave. CNI-Genie — це [проєкт CNCF на рівні Sandbox](https://www.cncf.io/projects/cni-genie/).
* [Contiv](https://contivpp.io/): надає налаштовану мережу (L3 з використанням BGP, оверлей використовуючи vxlan, класичний L2 та Cisco-SDN/ACI) для різних варіантів використання та повнофункціональний фреймворк політик. Проєкт Contiv є проєктом з [повністю відкритими сирцями](https://github.com/contiv). [Встановлювач](https://github.com/contiv/install) надає як варіанти установки, як з допомогою kubeadm, так і без.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), заснований на [Tungsten Fabric](https://tungsten.io), є відкритою платформою для віртуалізації багатохмарних мереж та управління політиками. Contrail і Tungsten Fabric інтегровані з системами оркестрування, такими як Kubernetes, OpenShift, OpenStack і Mesos, і забезпечують режими ізоляції для віртуальних машин, контейнерів/подів і робочих навантажень на фізичному обладнанні.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually): постачальник мережі на основі оверлеїв, який можна використовувати з Kubernetes.
* [Gateway API](/docs/concepts/services-networking/gateway/): відкритий проєкт, керований [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network), який надає виразний, розширюваний та рольовий API для моделювання мережевих сервісів.
* [Knitter](https://github.com/ZTE/Knitter/) є втулком для підтримки кількох мережевих інтерфейсів в Podʼі Kubernetes.
* [Multus](https://github.com/k8snetworkplumbingwg/multus-cni): мультивтулок для підтримки кількох мереж у Kubernetes для підтримки всіх втулків CNI (наприклад, Calico, Cilium, Contiv, Flannel), а також навантаження SRIOV, DPDK, OVS-DPDK та VPP у Kubernetes.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/): постачальник мережі для Kubernetes на основі [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/), віртуальної мережевої реалізації, яка вийшла з проєкту Open vSwitch (OVS). OVN-Kubernetes забезпечує реалізацію мережі на основі оверлеїв для Kubernetes, включаючи реалізацію балансування навантаження на основі OVS та політики мережі.
* [Nodus](https://github.com/akraino-edge-stack/icn-nodus): втулок контролера CNI на основі OVN для надання хмарних послуг на основі послуг хмарної обробки (SFC).
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html) Container Plug-in (NCP): забезпечує інтеграцію між VMware NSX-T та оркестраторами контейнерів, такими як Kubernetes, а також інтеграцію між NSX-T та контейнерними платформами CaaS/PaaS, такими як Pivotal Container Service (PKS) та OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst): платформа SDN, яка забезпечує мережеву політику між Podʼами Kubernetes  та не-Kubernetes середовищами з можливістю моніторингу видимості та безпеки.
* [Romana](https://github.com/romana): рішення мережі рівня Layer 3 для мереж Podʼів, яке також підтримує API [NetworkPolicy](/docs/concepts/services-networking/network-policies/).
* [Spiderpool](https://github.com/spidernet-io/spiderpool): мережеве рішення underlay та RDMA для Kubernetes. Spiderpool підтримується на фізичному обладнані, віртуальних машинах та публічних хмарних середовищах.
* [Terway](https://github.com/AliyunContainerService/terway/): це набір втулків CNI, заснований на мережевих продуктах VPC та ECS від AlibabaCloud. Він забезпечує нативну мережу VPC та мережеві політики в середовищах AlibabaCloud.
* [Weave Net](https://github.com/rajch/weave#using-weave-on-kubernetes): надає мережеве рішення та мережеві політики, буде продовжувати працювати з обох боків розділу мережі та не потребує зовнішньої бази даних.

## Виявлення Сервісів {#service-discovery}

* [CoreDNS](https://coredns.io) — це гнучкий, розширюваний DNS-сервер, який може бути [встановлений](https://github.com/coredns/helm) як DNS в кластері для Podʼів.

## Візуалізація та управління {#visualization-amp-control}

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) — це вебінтерфейс для управління та моніторингу Kubernetes.
* [Headlamp](https://headlamp.dev/) — це розширюваний інтерфейс користувача Kubernetes, який можна розгорнути в кластері або використовувати як десктопну програму.

## Інфраструктура {#infrastructure}

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) — це надбудова для запуску віртуальних машин в Kubernetes. Зазвичай використовується в кластерах на розгорнутих на фізичному обладнані.
* [Node problem detector](https://github.com/kubernetes/node-problem-detector) — працює на вузлах Linux та повідомляє про проблеми системи як у вигляді [подій](/docs/reference/kubernetes-api/cluster-resources/event-v1/) або [стану Вузла](/docs/concepts/architecture/nodes/#condition).

## Інструментування {#instrumentation}

* [kube-state-metrics](/docs/concepts/cluster-administration/kube-state-metrics)

## Старі надбудови {#legacy-addons}

Існують ще кілька інших надбудов, які визнані застарілим та знаходяться у теці [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons).

Надбудови, що добре підтримуються, мають бути вказані тут. Приймаються запити на включення!
