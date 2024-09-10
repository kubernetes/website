---
title: Ingressコントローラー
description: >-
  クラスターで[Ingress](/ja/docs/concepts/services-networking/ingress/)を動作させるためには、_ingress controller_ が動作している必要があります。
  少なくとも1つのIngressコントローラーを選択し、クラスター内にセットアップされていることを確認する必要があります。
  このページはデプロイ可能な一般的なIngressコントローラーをリストアップします。
content_type: concept
weight: 50
---

<!-- overview -->

Ingressリソースが動作するためには、クラスターでIngressコントローラーが実行されている必要があります。

`kube-controller-manager`バイナリの一部として実行される他のタイプのコントローラーとは異なり、Ingressコントローラーはクラスターで自動的に起動されません。このページを使用して、クラスターに最適なIngressコントローラーの実装を選択してください。

プロジェクトとしてのKubernetesは現在、[AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme)、[GCE](https://git.k8s.io/ingress-gce/README.md#readme)、および[nginx](https://git.k8s.io/ingress-nginx/README.md#readme)のIngressコントローラーをサポート・保守しています。

<!-- body -->

## 追加のコントローラー {#additional-controllers}

{{% thirdparty-content %}}

* [AKS Application Gateway Ingress Controller](https://docs.microsoft.com/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)は、[Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview)を設定するIngressコントローラーです。
* [Ambassador](https://www.getambassador.io/) API Gatewayは[Envoy](https://www.envoyproxy.io)ベースのIngressコントローラーです。
* [Apache APISIX ingress controller](https://github.com/apache/apisix-ingress-controller)は[Apache APISIX](https://github.com/apache/apisix)ベースのIngressコントローラーです。
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes)は[VMware NSX Advanced Load Balancer](https://avinetworks.com/)を使用したL4-L7ロードバランサーを提供します。
* [BFE Ingress Controller](https://github.com/bfenetworks/ingress-bfe)は[BFE](https://www.bfe-networks.net)ベースのIngressコントローラーです。
* [Cilium Ingress Controller](https://docs.cilium.io/en/stable/network/servicemesh/ingress/)は[Cilium](https://cilium.io/)を備えたIngressコントローラーです。
* [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme)は、Citrix Application Delivery Controllerで動作します。
* [Contour](https://projectcontour.io/)は、[Envoy](https://www.envoyproxy.io/)ベースのIngressコントローラーです。
* [EnRoute](https://getenroute.io/)はIngressコントローラーのように実行できる[Envoy](https://www.envoyproxy.io)ベースのAPI gatewayです。
* [Easegress IngressController](https://megaease.com/docs/easegress/04.cloud-native/4.1.kubernetes-ingress-controller/)はIngressコントローラーのように実行できる[Easegress](https://megaease.com/easegress/)ベースのAPI gatewayです。
* F5 BIG-IPの[Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)はF5 BIG-IPの仮想サーバー上でIngressの設定を可能にします。
* [FortiADC Ingress Controller](https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller/742835/fortiadc-ingress-controller-overview)は、Kubernetes Ingressリソースをサポートし、FortiADCオブジェクトをKubernetesから管理することができます。
* [Gloo](https://gloo.solo.io)は[Envoy](https://www.envoyproxy.io)をベースにしたオープンソースのIngressコントローラーで、API Gateway機能を提供しています。
* [HAProxy Ingress](https://haproxy-ingress.github.io/)は、[HAProxy](https://www.haproxy.org/#desc)用のIngressコントローラーです。
* [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress#readme)も、[HAProxy](https://www.haproxy.org/#desc)用のIngressコントローラーです。
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)は、[Istio](https://istio.io/)ベースのIngressコントローラーです。
* [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)は、[Kong Gateway](https://konghq.com/kong/)向けのIngressコントローラーです。
* [Kusk Gateway](https://kusk.kubeshop.io/)は[Envoy](https://www.envoyproxy.io)をベースにしたOpenAPIドリブンのIngressコントローラーです。 
* [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx-ingress-controller/)は、[NGINX](https://www.nginx.com/resources/glossary/nginx/)ウェブサーバーで(プロキシとして)動作します。
* [ngrok Kubernetes Ingress Controller](https://github.com/ngrok/kubernetes-ingress-controller)は、[ngrok platform](https://ngrok.com)を使用するK8sサービスに安全な公開アクセスを追加するためのオープンソースコントローラーです。 
* [OCI Native Ingress Controller](https://github.com/oracle/oci-native-ingress-controller#readme)は、Oracle Cloud Infrastructure用のIngressコントローラーであり、[OCI Load Balancer](https://docs.oracle.com/ja-jp/iaas/Content/Balance/home.htm)を管理することができます。
* [Pomerium Ingress Controller](https://www.pomerium.com/docs/k8s/ingress.html)は[Pomerium](https://pomerium.com/)ベースのものであり、コンテキストを考慮したアクセスポリシーを提供します。
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/)は、カスタムプロキシを構築するためのライブラリーとして設計された、Kubernetes Ingressなどのユースケースを含む、サービス構成用のHTTPルーターとリバースプロキシです。
* [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)は、[Traefik](https://traefik.io/traefik/) proxy向けのIngressコントローラーです。
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator)はAPI管理機能をIngressに持たせるためにCustom ResourcesでAPIを拡張します。Tyk OperatorはOpen Source Tyk GatewayとTyk Cloudコントロールプレーンで動作します。
* [Voyager](https://voyagermesh.com)は、[HAProxy](https://www.haproxy.org/#desc)向けのIngressコントローラーです。
* [Wallarm Ingress Controller](https://www.wallarm.com/solutions/waf-for-kubernetes)はWAAP(WAF)やAPIセキュリティ機能を提供するIngressコントローラーです。

## 複数のIngressコントローラーの使用 {#using-multiple-ingress-controllers}

[Ingress Class](/ja/docs/concepts/services-networking/ingress/#ingress-class)を使用して、複数のIngressコントローラーをクラスターにデプロイすることができます。
Ingress Classリソースの`.metadata.name`に注目してください。
Ingressを作成する際には、Ingressオブジェクトで`ingressClassName`フィールドを指定するために、その名前が必要になります([IngressSpec v1 reference](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)を参照)。
`ingressClassName`は古い[annotation method](/ja/docs/concepts/services-networking/ingress/#deprecated-annotation)の代替品です。

Ingressに対してIngressClassを指定せず、クラスターにはデフォルトとして設定されたIngressClassが1つだけある場合、KubernetesはIngressにクラスターのデフォルトIngressClassを[適用](/ja/docs/concepts/services-networking/ingress/#default-ingress-class)します。
IngressClassの[`ingressclass.kubernetes.io/is-default-class`アノテーション](/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class)を文字列`"true"`に設定することで、デフォルトとしてIngressClassを設定します。

理想的には、すべてのIngressコントローラーはこの仕様を満たすべきですが、いくつかのIngressコントローラーはわずかに異なる動作をします。

{{< note >}}
Ingressコントローラーのドキュメントを確認して、選択する際の注意点を理解してください。
{{< /note >}}

## {{% heading "whatsnext" %}}

* [Ingress](/ja/docs/concepts/services-networking/ingress/)についてさらに学ぶ。
* [Minikube上でNGINX Ingressコントローラーを使用してIngressをセットアップする](/ja/docs/tasks/access-application-cluster/ingress-minikube)。
