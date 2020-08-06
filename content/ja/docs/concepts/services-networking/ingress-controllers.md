---
title: Ingressコントローラー
content_type: concept
weight: 40
---

<!-- overview -->

Ingressリソースを機能させるためには、クラスター内でIngressコントローラーが動作している必要があります。

他の種類のコントローラーは`kube-controller-manager`バイナリの一部として実行されますが、Ingressコントローラーはクラスターで自動的には実行されません。このページを参考に、クラスターに最適なIngressコントローラーの実装を選択してください。

現在、Kubernetesがプロジェクトとしてサポートとメンテナンスを行っているのは、[GCE](https://git.k8s.io/ingress-gce/README.md)と[nginx](https://git.k8s.io/ingress-nginx/README.md)です。


<!-- body -->

## 追加のコントローラー

* [AKS Application Gateway Ingressコントローラー](https://github.com/Azure/application-gateway-kubernetes-ingress)を利用すると、[AKSクラスター](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough-portal)への通信で、[Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview)を用いたIngressが利用できるようになります。
* [Ambassador](https://www.getambassador.io/) API Gatewayは、[Envoy](https://www.envoyproxy.io)をベースとしたIngressコントローラーです。[コミュニティー](https://www.getambassador.io/docs)または[商用の](https://www.getambassador.io/pro/)サポートが[Datawire](https://www.datawire.io/)から提供されています。
* [AppsCode Inc.](https://appscode.com)は、最も広く使われている[HAProxy](https://www.haproxy.org/)をベースとした、Ingressコントローラー[Voyager](https://appscode.com/products/voyager)のサポートとメンテナンスを提供しています。
* [AWS ALB Ingressコントローラー](https://github.com/kubernetes-sigs/aws-alb-ingress-controller)を使用すると、[AWS Application Load Balancer](https://aws.amazon.com/elasticloadbalancing/)を用いたIngressが利用できるようになります。
* [Contour](https://projectcontour.io/)は、[Envoy](https://www.envoyproxy.io/)をベースとしたIngressコントローラーです。VMwareが開発し、サポートを提供しています。
* Citrixは、Citrixのハードウェア(MPX)、仮想化(VPX)、[フリーのコンテナ化(CPX)ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html)、および[クラウド](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment)デプロイ向けの[Ingressコントローラー](https://github.com/citrix/citrix-k8s-ingress-controller)を提供しています。
* F5 Networksは、[F5 BIG-IP Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)向けの[サポートとメンテナンス](https://support.f5.com/csp/article/K86859508)を提供しています。
* [Gloo](https://gloo.solo.io)は、APIゲートウェイ機能を提供する[Envoy](https://www.envoyproxy.io)をベースとしたオープンソースのIngressコントローラーを提供しています。[solo.io](https://www.solo.io)から、エンタープライズ向けのサポートが提供されています。
* [HAProxy Ingress](https://haproxy-ingress.github.io)は、HAProxy向けの高度にカスタマイズ可能なコミュニティ駆動のIngressコントローラーです。
* [HAProxy Technologies](https://www.haproxy.com/)は、[HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress)向けのサポートとメンテナンスを提供しています。詳しくは[公式ドキュメント](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/)を参照してください。
* [Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/)は、[Istio](https://istio.io/)をベースとしたIngressコントローラーです。
* [Kong](https://konghq.com/)は、[Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller)向けの[コミュニティ](https://discuss.konghq.com/c/kubernetes)または[商用の](https://konghq.com/kong-enterprise/)サポートとメンテナンスを提供しています。
* [NGINX, Inc.](https://www.nginx.com/)は、[NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)のサポートとメンテナンスを提供しています。
* サービス構成用のHTTPルーターおよびリバースプロキシの[Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/)には、Kubernetes Ingressなどのユースケースが含まれ、カスタムのプロキシを構築するためのライブラリとして設計されています。
* [Traefik](https://github.com/containous/traefik)は、[Let's Encrypt](https://letsencrypt.org)、secret、http2、websocketに対応したフル機能のIngressコントローラーです。商用のサポートが[Containous](https://containo.us/services)から提供されています。

## 複数のIngressコントローラーを使用する

クラスター内には、[好きな数のIngressコントローラー](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers)をデプロイできます。クラスター内に複数のIngressコントローラーが存在する場合、Ingressリソースを作成するときに各Ingressのアノテーションで適切な[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster)を指定して、どのIngressコントローラーを使用するのかを指定する必要があります。

classを定義していない場合、クラウドプロバイダーではデフォルトのIngressコントローラーが使用される場合があります。

理想的には、すべてのIngressコントローラーはこの仕様を満たすべきですが、Ingressコントローラーの種類によっては微妙に動作が異なる場合があります。

{{< note >}}
Ingressコントローラーのドキュメントを確認し、コントローラーの選択の注意点について理解するようにしてください。
{{< /note >}}



## {{% heading "whatsnext" %}}


* [Ingress](/ja/docs/concepts/services-networking/ingress/)についてさらに学ぶ。
* [Minikube上でNGINX Ingressコントローラーを使用してIngressをセットアップする](/ja/docs/tasks/access-application-cluster/ingress-minikube)。


