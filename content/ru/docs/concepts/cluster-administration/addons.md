---
title: Установка дополнений
content_type: concept
---

<!-- overview -->

{{% thirdparty-content %}}

Надстройки расширяют функциональность Kubernetes.

На этой странице перечислены некоторые из доступных надстроек и ссылки на соответствующие инструкции по установке.

<!-- body -->

## Сеть и сетевыя политика

* [ACI](https://www.github.com/noironetworks/aci-containers) обеспечивает интегрированную сеть контейнеров и сетевую безопасность с помощью Cisco ACI.
* [Antrea](https://antrea.io/) работает на уровне 3, обеспечивая сетевые службы и службы безопасности для Kubernetes, используя Open vSwitch в качестве уровня сетевых данных.
* [Calico](https://docs.projectcalico.org/latest/introduction/) Calico поддерживает гибкий набор сетевых опций, поэтому вы можете выбрать наиболее эффективный вариант для вашей ситуации, включая сети без оверлея и оверлейные сети, с или без BGP. Calico использует тот же механизм для обеспечения соблюдения сетевой политики для хостов, модулей и (при использовании Istio и Envoy) приложений на уровне сервисной сети (mesh layer).
* [Canal](https://github.com/tigera/canal/tree/master/k8s-install) объединяет Flannel и Calico, обеспечивая сеть и сетевую политик.
* [Cilium](https://github.com/cilium/cilium) - это плагин сети L3 и сетевой политики, который может прозрачно применять политики HTTP/API/L7. Поддерживаются как режим маршрутизации, так и режим наложения/инкапсуляции, и он может работать поверх других подключаемых модулей CNI.
* [CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) позволяет Kubernetes легко подключаться к выбору плагинов CNI, таких как Calico, Canal, Flannel, Romana или Weave.
* [Contiv](https://contiv.github.io) предоставляет настраиваемую сеть (собственный L3 с использованием BGP, слоя с использованием vxlan, классический L2 и Cisco-SDN/ACI) для различных вариантов использования и обширную структуру политик. Проект Contiv имеет полностью [открытый исходный код](https://github.com/contiv). [Установка](https://github.com/contiv/install) обеспечивает варианты на основе как kubeadm так и без kubeadm.
* [Contrail](https://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), основан на [Tungsten Fabric](https://tungsten.io), представляет собой платформу для виртуализации мультиоблачных сетей с открытым исходным кодом и управления политиками. Contrail и Tungsten Fabric are интегрированы с системами оркестровки, такими как Kubernetes, OpenShift, OpenStack и Mesos, и обеспечивают режимы изоляции для виртуальных машин, контейнеров/pod-ов и рабочих нагрузок без операционной системы.
* [Flannel](https://github.com/flannel-io/flannel#deploying-flannel-manually) - это поставщик оверлейной сети, который можно использовать с Kubernetes.
* [Knitter](https://github.com/ZTE/Knitter/) - это плагин для поддержки нескольких сетевых интерфейсов Kubernetes pod-ов.
* [Multus](https://github.com/Intel-Corp/multus-cni) - это плагин Multi для поддержки нексольких сетейв Kubernetes для поддержки всех CNI плагинов (наприме: Calico, Cilium, Contiv, Flannel), в дополнение к рабочим нагрузкам основанных на SRIOV, DPDK, OVS-DPDK и VPP в Kubernetes.
* [OVN-Kubernetes](https://github.com/ovn-org/ovn-kubernetes/) - это сетевой провайдер для Kubernetes основанный на [OVN (Open Virtual Network)](https://github.com/ovn-org/ovn/), реализация виртуалной сети a появившейся в результате проекта Open vSwitch (OVS). OVN-Kubernetes обеспечивает сетевую реализацию на основе наложения для Kubernetes, включая реализацию балансировки нагрузки и сетевой политики на основе OVS.
* [OVN4NFV-K8S-Plugin](https://github.com/opnfv/ovn4nfv-k8s-plugin) - это подключаемый модуль контроллера CNI на основе OVN для обеспечения облачной цепочки сервисных функций (SFC), несколько наложеных сетей OVN, динамического создания подсети, динамического создания виртуальных сетей, сети поставщика VLAN, сети прямого поставщика и подключаемого к другим Multi Сетевые плагины, идеально подходящие для облачных рабочих нагрузок на периферии в сети с несколькими кластерами.
* [NSX-T](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) плагин для контейнера (NCP) обеспечивающий интеграцию между VMware NSX-T и контейнерами оркестраторов, таких как Kubernetes, а так же интеграцию между NSX-T и контейнеров на основе платформы CaaS/PaaS, таких как Pivotal Container Service (PKS) и OpenShift.
* [Nuage](https://github.com/nuagenetworks/nuage-kubernetes/blob/v5.1.1-1/docs/kubernetes-1-installation.rst) - эта платформа SDN, которая обеспечивает сетевое взаимодействие на основе политик между Kubernetes Pod-ами и не Kubernetes окружением с отображением и мониторингом безопасности.
* [Romana](https://romana.io) - это сетевое решение уровня 3 для pod сетей, которое также поддерживает  [NetworkPolicy API](/docs/concepts/services-networking/network-policies/). Подробности установки Kubeadm доступны [здесь](https://github.com/romana/romana/tree/master/containerize).
* [Weave Net](https://www.weave.works/docs/net/latest/kubernetes/kube-addon/) обеспечивает сетевуюи политику сетей, будет работать в сетевого раздела и не требует внешней базы данных.

## Обнаружение служб

* [CoreDNS](https://coredns.io) - это гибкий, расширяемый DNS-сервер, который может быть [установлен](https://github.com/coredns/deployment/tree/master/kubernetes) в качестве внутрикластерного DNS для pod-ов.

## Визуализация и контроль

* [Dashboard](https://github.com/kubernetes/dashboard#kubernetes-dashboard) - это веб-интерфейс панели инструментов для Kubernetes.
* [Weave Scope](https://www.weave.works/documentation/scope-latest-installing/#k8s) - это инструмент для графической визуализации ваших контейнеров, pod-ов, сервисов и т.д. Используйте его вместе с [учетной записью Weave Cloud](https://cloud.weave.works/) или разместите пользовательский интерфейс самостоятельно.

## Инфраструктура

* [KubeVirt](https://kubevirt.io/user-guide/#/installation/installation) - это дополнение для запуска виртуальных машин в Kubernetes. Обычно работает на bare-metal кластерах.

## Legacy Add-ons

В устаревшем каталоге [cluster/addons](https://git.k8s.io/kubernetes/cluster/addons) задокументировано несколько других дополнений.

Ссылки на те, в хорошем состоянии, должны быть здесь. PR приветствуются!
