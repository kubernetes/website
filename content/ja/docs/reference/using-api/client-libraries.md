---
title: クライアントライブラリ
content_type: concept
weight: 30
---

<!-- overview -->
このページでは、様々なプログラミング言語からKubernetes APIを利用するためのクライアントライブラリの概要を説明します。

<!-- body -->
[Kubernetes REST API](/docs/reference/using-api/)を利用してアプリケーションを開発するために、APIの呼び出しやリクエスト/レスポンスの型を自分で実装する必要はありません。
プログラミング言語ごとのクライアントライブラリを利用することができます。

クライアントライブラリは多くの場合、認証などの共通のタスクを処理します。
APIのクライアントがKubernetesクラスター内で実行される場合、ほとんどのクライアントライブラリは認証のためにKubernetesのサービスアカウントを検出して利用することができます。
もしくは、[kubeconfigファイル](/docs/tasks/access-application-cluster/configure-access-multiple-clusters/)のフォーマットを理解して、認証情報とAPIサーバーのアドレスを読み取ることができます。

## 公式にサポートされているKubernetesのクライアントライブラリ {#officially-supported-kubernetes-client-libraries}

以下のクライアントライブラリは、[Kubernetes SIG API Machinery](https://github.com/kubernetes/community/tree/main/sig-api-machinery)によって公式にメンテナンスされています。

| 言語 | クライアントライブラリ | サンプルプログラム |
|------------|----------------|-----------------|
| C          | [github.com/kubernetes-client/c](https://github.com/kubernetes-client/c/) | [閲覧する](https://github.com/kubernetes-client/c/tree/master/examples)
| dotnet     | [github.com/kubernetes-client/csharp](https://github.com/kubernetes-client/csharp) | [閲覧する](https://github.com/kubernetes-client/csharp/tree/master/examples)
| Go         | [github.com/kubernetes/client-go/](https://github.com/kubernetes/client-go/) | [閲覧する](https://github.com/kubernetes/client-go/tree/master/examples)
| Haskell    | [github.com/kubernetes-client/haskell](https://github.com/kubernetes-client/haskell) | [閲覧する](https://github.com/kubernetes-client/haskell/tree/master/kubernetes-client/example)
| Java       | [github.com/kubernetes-client/java](https://github.com/kubernetes-client/java/) | [閲覧する](https://github.com/kubernetes-client/java/tree/master/examples)
| JavaScript | [github.com/kubernetes-client/javascript](https://github.com/kubernetes-client/javascript) | [閲覧する](https://github.com/kubernetes-client/javascript/tree/master/examples)
| Perl       | [github.com/kubernetes-client/perl/](https://github.com/kubernetes-client/perl/) | [閲覧する](https://github.com/kubernetes-client/perl/tree/master/examples)
| Python     | [github.com/kubernetes-client/python/](https://github.com/kubernetes-client/python/) | [閲覧する](https://github.com/kubernetes-client/python/tree/master/examples)
| Ruby       | [github.com/kubernetes-client/ruby/](https://github.com/kubernetes-client/ruby/) | [閲覧する](https://github.com/kubernetes-client/ruby/tree/master/examples)

## コミュニティによってメンテナンスされているクライアントライブラリ {#community-maintained-client-libraries}

{{% thirdparty-content %}}

以下のKubernetes APIのクライアントライブラリはKubernetesのチームではなく、各ライブラリの作者によって提供され、メンテナンスされています。

| 言語 | クライアントライブラリ |
| -------------------- | ---------------------------------------- |
| Clojure              | [github.com/yanatan16/clj-kubernetes-api](https://github.com/yanatan16/clj-kubernetes-api) |
| DotNet               | [github.com/tonnyeremin/kubernetes_gen](https://github.com/tonnyeremin/kubernetes_gen) |
| DotNet (RestSharp)   | [github.com/masroorhasan/Kubernetes.DotNet](https://github.com/masroorhasan/Kubernetes.DotNet) |
| Elixir               | [github.com/obmarg/kazan](https://github.com/obmarg/kazan/) |
| Elixir               | [github.com/coryodaniel/k8s](https://github.com/coryodaniel/k8s) |
| Java (OSGi)          | [bitbucket.org/amdatulabs/amdatu-kubernetes](https://bitbucket.org/amdatulabs/amdatu-kubernetes) |
| Java (Fabric8, OSGi) | [github.com/fabric8io/kubernetes-client](https://github.com/fabric8io/kubernetes-client) |
| Java                 | [github.com/manusa/yakc](https://github.com/manusa/yakc) |
| Lisp                 | [github.com/brendandburns/cl-k8s](https://github.com/brendandburns/cl-k8s) |
| Lisp                 | [github.com/xh4/cube](https://github.com/xh4/cube) |
| Node.js (TypeScript) | [github.com/Goyoo/node-k8s-client](https://github.com/Goyoo/node-k8s-client) |
| Node.js              | [github.com/ajpauwels/easy-k8s](https://github.com/ajpauwels/easy-k8s)
| Node.js              | [github.com/godaddy/kubernetes-client](https://github.com/godaddy/kubernetes-client) |
| Node.js              | [github.com/tenxcloud/node-kubernetes-client](https://github.com/tenxcloud/node-kubernetes-client) |
| Perl                 | [metacpan.org/pod/Net::Kubernetes](https://metacpan.org/pod/Net::Kubernetes) |
| PHP                  | [github.com/allansun/kubernetes-php-client](https://github.com/allansun/kubernetes-php-client) |
| PHP                  | [github.com/maclof/kubernetes-client](https://github.com/maclof/kubernetes-client) |
| PHP                  | [github.com/travisghansen/kubernetes-client-php](https://github.com/travisghansen/kubernetes-client-php) |
| PHP                  | [github.com/renoki-co/php-k8s](https://github.com/renoki-co/php-k8s) |
| Python               | [github.com/cloudcoil/cloudcoil](https://github.com/cloudcoil/cloudcoil) |
| Python               | [github.com/fiaas/k8s](https://github.com/fiaas/k8s) |
| Python               | [github.com/gtsystem/lightkube](https://github.com/gtsystem/lightkube) |
| Python               | [github.com/kr8s-org/kr8s](https://github.com/kr8s-org/kr8s) |
| Python               | [github.com/mnubo/kubernetes-py](https://github.com/mnubo/kubernetes-py) |
| Python               | [github.com/puzl-cloud/kubesdk](https://github.com/puzl-cloud/kubesdk) |
| Python               | [github.com/tomplus/kubernetes_asyncio](https://github.com/tomplus/kubernetes_asyncio) |
| Python               | [github.com/Frankkkkk/pykorm](https://github.com/Frankkkkk/pykorm) |
| Ruby                 | [github.com/abonas/kubeclient](https://github.com/abonas/kubeclient) |
| Ruby                 | [github.com/k8s-ruby/k8s-ruby](https://github.com/k8s-ruby/k8s-ruby) |
| Ruby                 | [github.com/kontena/k8s-client](https://github.com/kontena/k8s-client) |
| Rust                 | [github.com/kube-rs/kube](https://github.com/kube-rs/kube) |
| Rust                 | [github.com/ynqa/kubernetes-rust](https://github.com/ynqa/kubernetes-rust) |
| Scala                | [github.com/hagay3/skuber](https://github.com/hagay3/skuber) |
| Scala                | [github.com/hnaderi/scala-k8s](https://github.com/hnaderi/scala-k8s) |
| Scala                | [github.com/joan38/kubernetes-client](https://github.com/joan38/kubernetes-client) |
| Swift                | [github.com/swiftkube/client](https://github.com/swiftkube/client) |
