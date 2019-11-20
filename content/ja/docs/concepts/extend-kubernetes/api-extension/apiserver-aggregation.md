---
title: アグリゲーションレイヤーを使ったKubernetes APIの拡張
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

アグリゲーションレイヤーを使用すると、KubernetesのコアAPIで提供されている機能を超えて、追加のAPIでKubernetesを拡張できます。

{{% /capture %}}

{{% capture body %}}

## 概要

アグリゲーションレイヤーを使用すると、クラスターにKubernetesスタイルのAPIを追加でインストールできます。これらは、[service-catalog](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md)や、[apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md)のようなユーザーが作成したAPIなど、出来合いのもの、また既存のサードパーティソリューションに関わらず使い始めることができます。

バージョン1.7において、アグリゲーションレイヤーは、kube-apiserverのプロセス内で動きます。拡張リソースが登録されるまでは、アグリゲーションレイヤーは何もしません。APIを登録するには、ユーザーはKubernetes APIで使われるURLのパスを"要求"した、APIServiceオブジェクトを追加しなければなりません。それを追加すると、アグリゲーションレイヤーはAPIパス（例、/apis/myextension.mycompany.io/v1/…）への全てのアクセスを、登録されたAPIServiceにプロキシします。

通常、APIServiceは、クラスター上で動いているPod内の *extension-apiserver* で実装されます。このextension-apiserverは、追加されたリソースに対するアクティブな管理が必要な場合、通常、1つか複数のコントローラーとペアになっている必要があります。そのため、実際にapiserver-builderはextension-apiserverとコントローラーの両方のスケルトンを提供します。一例として、service-catalogがインストールされると、extension-apiserverと提供するサービスのコントローラーの両方を提供します。

{{% /capture %}}

{{% capture whatsnext %}}

* アグリゲーターをあなたの環境で動かすには、まず[アグリゲーションレイヤーを設定](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/)します
* そして、アグリゲーションレイヤーと一緒に動作させるために[extension api-serverをセットアップ](/docs/tasks/access-kubernetes-api/setup-extension-api-server/)します
* また、[Custom Resource Definitionを使いKubernetes APIを拡張する](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)方法を学んで下さい

{{% /capture %}}

