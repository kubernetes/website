---
title: Ingressコントローラー
reviewers:
content_type: concept
weight: 40
---

<!-- overview -->

Ingressリソースが動作するためには、クラスターでIngressコントローラーが実行されている必要があります。

`kube-controller-manager`バイナリの一部として実行される他のタイプのコントローラーとは異なり、Ingressコントローラーはクラスターで自動的に起動されません。このページを使用して、クラスターに最適なIngressコントローラーの実装を選択してください。

プロジェクトとしてのKubernetesは現在、[GCE](https://git.k8s.io/ingress-gce/README.md)と[nginx](https://git.k8s.io/ingress-nginx/README.md)のコントローラーをサポートし、保守しています。



<!-- body -->

## 追加のコントローラー {#additional-controllers}

* [AKS Application Gateway Ingress Controller](https://github.com/Azure/application-gateway-kubernetes-ingress)は[Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview)を利用して[AKSクラスター](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough-portal)でIngressを実行可能にするIngressコントローラーです。
* [Ambassador](https://www.getambassador.io/) API Gatewayは[Envoy](https://www.envoyproxy.io)ベースのIngressコントローラーで、[Datawire](https://www.datawire.io/)による[コミュニティ版](https://www.getambassador.io/docs)または[商用版](https://www.getambassador.io/pro/)のサポートがあります。
* [AppsCode Inc.](https://appscode.com)では、最も広く使用されている[HAProxy](https://www.haproxy.org/)ベースのIngressコントローラーである[Voyager](https://appscode.com/products/voyager)のサポートと保守を提供しています。
* [AWS ALB Ingress Controller](https://github.com/kubernetes-sigs/aws-alb-ingress-controller)は[AWS Application Load Balancer](https://aws.amazon.com/elasticloadbalancing/)を使用したIngressを有効にします。
* [Contour](https://projectcontour.io/)は、VMwareが提供し、サポートしている[Envoy](https://www.envoyproxy.io/)ベースのIngressコントローラーです。
* Citrixは、[ベアメタル](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal)と[クラウド](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment)のデプロイ用に、ハードウェア(MPX）、仮想化(VPX)、[フリーコンテナ化(CPX) ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html)用の[Ingressコントローラー](https://github.com/citrix/citrix-k8s-ingress-controller)を提供しています。
* F5 Networksは[F5 BIG-IP Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)の[サポートと保守](https://support.f5.com/csp/article/K86859508)を提供しています。
* [Gloo](https://gloo.solo.io)は[Envoy](https://www.envoyproxy.io)をベースにしたオープンソースのIngressコントローラーで、[solo.io](https://www.solo.io)からのエンタープライズサポートでAPI Gateway機能を提供しています。
* [HAProxy Ingress](https://haproxy-ingress.github.io)は、HAProxy用の高度にカスタマイズ可能なコミュニティ主導のIngressコントローラーです。
* [HAProxy Technologies](https://www.haproxy.com/)は[HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress)のサポートと保守を提供しています。[公式ドキュメント](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/)を参照してください。
* [Istio](https://istio.io/)ベースのIngressコントローラー[Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/)。
* [Kong](https://konghq.com/)は、[Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller)の[コミュニティ版](https://discuss.konghq.com/c/kubernetes)と[商用版]](https://konghq.com/kong-enterprise/)のサポートと保守を提供しています。
* [NGINX, Inc.](https://www.nginx.com/)は[NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)のサポートと保守を提供しています。
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/)は、カスタムプロキシーを構築するためのライブラリーとして設計された、Kubernetes Ingressなどのユースケースを含む、サービス構成用のHTTPルーターとリバースプロキシーです。
* [Traefik](https://github.com/containous/traefik)はフル機能([Let's Encrypt](https://letsencrypt.org), secrets, http2, websocket)のIngressコントローラーで、[Containous](https://containo.us/services)による商用サポートもあります。

## 複数のIngressコントローラーの使用 {#using-multiple-ingress-controllers}

[Ingressコントローラーは、好きな数だけ](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers)クラスターにデプロイすることができます。Ingressを作成する際には、クラスター内に複数のIngressコントローラーが存在する場合にどのIngressコントローラーを使用するかを示すために適切な[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster)のアノテーションを指定します。

クラスを定義しない場合、クラウドプロバイダーはデフォルトのIngressコントローラーを使用する場合があります。

理想的には、すべてのIngressコントローラーはこの仕様を満たすべきですが、いくつかのIngressコントローラーはわずかに異なる動作をします。


{{< note >}}
Ingressコントローラーのドキュメントを確認して、選択する際の注意点を理解してください。
{{< /note >}}



## {{% heading "whatsnext" %}}


* [Ingress](/ja/docs/concepts/services-networking/ingress/)の詳細
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube)
