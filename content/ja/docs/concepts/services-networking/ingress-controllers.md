---
title: Ingressコントローラー
reviewers:
content_type: concept
weight: 40
---

<!-- overview -->

Ingressリソースが動作するためには、クラスターでIngressコントローラーが実行されている必要があります。

`kube-controller-manager`バイナリの一部として実行される他のタイプのコントローラーとは異なり、Ingressコントローラーはクラスターで自動的に起動されません。このページを使用して、クラスターに最適なIngressコントローラーの実装を選択してください。

プロジェクトとしてのKubernetesは現在、[AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme)、[GCE](https://git.k8s.io/ingress-gce/README.md#readme)、および[nginx](https://git.k8s.io/ingress-nginx/README.md#readme)のIngressコントローラーをサポート・保守しています。

<!-- body -->

## 追加のコントローラー {#additional-controllers}

{{% thirdparty-content %}}

* [AKS Application Gateway Ingress Controller](https://github.com/Azure/application-gateway-kubernetes-ingress)は、[Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview)を設定するIngressコントローラーです。
* [Ambassador](https://www.getambassador.io/) API Gatewayは[Envoy](https://www.envoyproxy.io)ベースのIngressコントローラーです。
* [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme)は、Citrix Application Delivery Controllerで動作します。
* [Contour](https://projectcontour.io/)は、[Envoy](https://www.envoyproxy.io/)ベースのIngressコントローラーです。
* F5 BIG-IPの[Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)はF5 BIG-IPの仮想サーバー上でIngressの設定を可能にします。
* [Gloo](https://gloo.solo.io)は[Envoy](https://www.envoyproxy.io)をベースにしたオープンソースのIngressコントローラーで、API Gateway機能を提供しています。
* [HAProxy Ingress](https://haproxy-ingress.github.io)は、[HAProxy](http://www.haproxy.org/#desc)用のIngressコントローラーです。
* [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress)も、[HAProxy](http://www.haproxy.org/#desc)用のIngressコントローラーです。
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)は、[Istio](https://istio.io/)ベースのIngressコントローラーです。
* [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)は、[Kong Gateway](https://konghq.com/kong/)向けのIngressコントローラーです。
* [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)は、[NGINX](https://www.nginx.com/resources/glossary/nginx/)ウェブサーバーで(プロキシとして)動作します。
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/)は、カスタムプロキシーを構築するためのライブラリーとして設計された、Kubernetes Ingressなどのユースケースを含む、サービス構成用のHTTPルーターとリバースプロキシーです。
* [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)は、[Traefik](https://github.com/containous/traefik) proxy向けのIngressコントローラーです。
* [Voyager](https://appscode.com/products/voyager)は、[HAProxy](http://www.haproxy.org/#desc)向けのIngressコントローラーです。

## 複数のIngressコントローラーの使用 {#using-multiple-ingress-controllers}

[Ingressコントローラーは、好きな数だけ](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers)クラスターにデプロイすることができます。Ingressを作成する際には、クラスター内に複数のIngressコントローラーが存在する場合にどのIngressコントローラーを使用するかを示すために適切な[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster)のアノテーションを指定する必要があります。

クラスを定義しない場合、クラウドプロバイダーはデフォルトのIngressコントローラーを使用する場合があります。

理想的には、すべてのIngressコントローラーはこの仕様を満たすべきですが、いくつかのIngressコントローラーはわずかに異なる動作をします。

{{< note >}}
Ingressコントローラーのドキュメントを確認して、選択する際の注意点を理解してください。
{{< /note >}}

## {{% heading "whatsnext" %}}

* [Ingress](/ja/docs/concepts/services-networking/ingress/)についてさらに学ぶ。
* [Minikube上でNGINX Ingressコントローラーを使用してIngressをセットアップする](/ja/docs/tasks/access-application-cluster/ingress-minikube)。
