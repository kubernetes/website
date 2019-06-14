---
title: Ingress コントローラ
reviewers:
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

Ingressリソースが機能するためには、クラスタで入力コントローラが動作している必要があります。

`kube-controller-manager`バイナリの一部として動作する他のタイプのコントローラとは異なり、Ingressコントローラ
クラスタでは自動的に起動されません。 このページを使用して、入力コントローラの実装を選択してください。
それはあなたのクラスタに最適です。

プロジェクトとしてのKubernetesは現在[GCE](https://git.k8s.io/ingress-gce/README.md)をサポートし維持しています
   [nginx](https://git.k8s.io/ingress-nginx/README.md)コントローラ。

{{% /capture %}}

{{% capture body %}}

## 追加のコントローラー
* [Ambassador](https://www.getambassador.io/)API Gatewayは[Envoy](https://www.envoyproxy.io)ベースの入力です。
  [コミュニティ](https://www.getambassador.io/docs)を持つコントローラまたは
  [商用](https://www.getambassador.io/pro/)[Datawire](https://www.datawire.io/)からのサポート。
* [AppsCode Inc.](https://appscode.com)は、最も広く使用されている[HAProxy](http://www.haproxy.org/)ベースの入力コントローラ[Voyager](https：//)のサポートとメンテナンスを提供しています。 appscode.com/products/voyager)
* [Contour](https://github.com/heptio/contour)は[Envoy](https://www.envoyproxy.io)ベースの入力コントローラです。
  Heptioによって提供およびサポートされています。
* Citrixは、ハードウェア(MPX)、仮想化(VPX)、および[無料コンテナ化(CPX)ADC]用の[Ingress Controller](https://github.com/citrix/citrix-k8s-ingress-controller)を提供しています(https://www.citrix.com/products/citrix-adc/cpx-express.html)[ベアメタル](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal) )および[クラウド](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment)展開。
* F5 Networksは[サポートとメンテナンス]を提供しています(https://support.f5.com/csp/article/K86859508)
  [Kubernetes用F5 BIG-IPコントローラー](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest)に対応しています。
* [Gloo](https://gloo.solo.io)は[envoy](https://www.envoyproxy.io)をベースにしたオープンソースの入力コントローラで、[solo]からのエンタープライズサポートでAPI Gatewayの機能を提供します。 io](https://www.solo.io)。
* [HAProxy](http://www.haproxy.org/)ベースのIngressコントローラ
  ブログ投稿に記載されている[jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress)
  [HAProxy Ingress Controller for Kubernetes](https://www.haproxy.com/blog/haproxy_ingress_controller_for_kubernetes/)。
  [HAProxy Technologies](https://www.haproxy.com/)は、HAProxy EnterpriseとHAProxy Enterpriseのサポートとメンテナンスを提供しています。
  入力コントローラ[jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress)。
* [Istio](https://istio.io/)ベースの入力コントローラ
  [入力トラフィックを制御する](https://istio.io/docs/tasks/traffic-management/ingress/)。
* [Kong](https://konghq.com/)は[community](https://discuss.konghq.com/c/kubernetes)または
  [商用](https://konghq.com/kong-enterprise/)のサポートとメンテナンス
  [KubernetesのためのKong Ingress Controller](https://github.com/Kong/kubernetes-ingress-controller)。
* [NGINX、Inc.](https://www.nginx.com/)は、のサポートとメンテナンスを提供しています。
  [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)。
* [Traefik](https://github.com/containous/traefik)はフル機能のIngressコントローラーです。
  ([Let's Encrypt](https://letsencrypt.org)、秘密、http2、websocket)、それにコマーシャルも付属しています
  [含む](https://containo.us/services)によるサポート。

## 複数のIngressコントローラを使用する

あなたは[任意の数のIngressコントローラ](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md＃multiple-ingress-controller)をデプロイすることができます
クラスタ内 あなたがIngressを作成するとき、あなたは適切なものでそれぞれのIngressに注釈をつけるべきです
[ingress.class](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-クラスタ)
クラスタ内に複数の入力コントローラが存在する場合にどの入力コントローラを使用するかを指定します。

クラスを定義しないと、クラウドプロバイダはデフォルトの入力プロバイダを使用する可能性があります。

理想的には、すべてのIngressコントローラがこの仕様を満たすべきですが、さまざまなIngress
コントローラの動作は多少異なります。

{{< note >}}
あなたがそれを選ぶことの警告を理解するためにあなたのIngressコントローラのドキュメンテーションをレビューすることを忘れないでいなさい。
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [Ingress](/docs/concepts/services-networking/ingress/)についてもっと学んでください。
* [NGINXコントローラを使ってMinikubeにIngressを設定する](/docs/tasks/access-application-cluster/ingress-minikube)。

{{% /capture %}}
