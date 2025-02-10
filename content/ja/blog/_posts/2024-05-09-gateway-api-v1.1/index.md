---
layout: blog
title: "Gateway API v1.1: サービスメッシュ、GRPCRoute、そして更なる進化"
date: 2024-05-09T09:00:00-08:00
slug: gateway-api-v1-1
author: >
  [Richard Belleville](https://github.com/gnossen) (Google),
  [Frank Budinsky](https://github.com/frankbu) (IBM),
  [Arko Dasgupta](https://github.com/arkodg) (Tetrate),
  [Flynn](https://github.com/kflynn) (Buoyant),
  [Candace Holman](https://github.com/candita) (Red Hat),
  [John Howard](https://github.com/howardjohn) (Solo.io),
  [Christine Kim](https://github.com/xtineskim) (Isovalent),
  [Mattia Lavacca](https://github.com/mlavacca) (Kong),
  [Keith Mattix](https://github.com/keithmattix) (Microsoft),
  [Mike Morris](https://github.com/mikemorris) (Microsoft),
  [Rob Scott](https://github.com/robscott) (Google),
  [Grant Spence](https://github.com/gcs278) (Red Hat),
  [Shane Utt](https://github.com/shaneutt) (Kong),
  [Gina Yeh](https://github.com/ginayeh) (Google),
  and other review and release note contributors
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([IDC Frontier Inc.](https://www.idcf.jp/)),
  [Daiki Hayakawa(bells17)](https://github.com/bells17) ([3-shake Inc.](https://3-shake.com/en/)),
  [Junya Okabe](https://github.com/Okabe-Junya) (University of Tsukuba)
---

![Gateway API logo](gateway-api-logo.svg)

昨年10月のGateway APIの正式リリース後、Kubernetes SIG Networkは[Gateway API](https://gateway-api.sigs.k8s.io/)のv1.1リリースを発表しました。
このリリースでは、いくつかの機能が _標準機能_ (GA)に昇格しています。
特にサービスメッシュとGRPCRouteのサポートが含まれます。
また、セッション維持とクライアント証明書の検証を含む新しい実験的機能も導入しています。

## 新機能

### GAへの昇格

このリリースでは、4つの待望の機能が標準機能に昇格しました。
これにより、これらの機能は実験的な段階を卒業したことになります。
GAへの昇格が行われたということは、APIの設計に対する高い信頼性を示すとともに、後方互換性を保証するものです。
他のKubernetes APIと同様に、GAへ昇格した機能も時間とともに後方互換性を保ちながら進化していきます。
今後もこれらの新機能のさらなる改良と改善が行われることを期待しています。
これらの仕組みについて詳しくは、Gateway APIの[バージョニングポリシー](https://gateway-api.sigs.k8s.io/concepts/versioning/)をご覧ください。

#### [サービスメッシュのサポート](https://gateway-api.sigs.k8s.io/mesh/)

Gateway APIのサービスメッシュサポートにより、サービスメッシュユーザーは同じAPIを使用してIngressトラフィックとメッシュトラフィックを管理することが可能になります。
これにより同じポリシーとルーティングインターフェースを再利用することができます。
また、Gateway API v1.1では、HTTPRouteなどのルートがServiceを`parentRef`として持つことができるようになり、特定のサービスへのトラフィックの動作を制御できます。
詳細については、[Gateway APIのサービスメッシュドキュメント](https://gateway-api.sigs.k8s.io/mesh/)をお読みいただくか、[Gateway APIの実装リスト](https://gateway-api.sigs.k8s.io/implementations/#service-mesh-implementation-status)をご覧ください。

例えば、アプリケーションのコールグラフの深部にあるワークロードに対して、HTTPRouteを使用してカナリアデプロイメントを行うことができます。
以下はその例です：

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: color-canary
  namespace: faces
spec:
  parentRefs:
    - name: color
      kind: Service
      group: ""
      port: 80
  rules:
  - backendRefs:
    - name: color
      port: 80
      weight: 50
    - name: color2
      port: 80
      weight: 50
```

これにより、名前空間`faces`内の`color`サービスに送信されるトラフィックが、元の`color`サービスと`color2`サービスの間で50対50に分割されます。
この設定は移植性が高く、あるメッシュから別のメッシュへ簡単に移行できます。

#### [GRPCRoute](https://gateway-api.sigs.k8s.io/guides/grpc-routing/)

すでにGRPCRouteの実験的機能バージョンを使用している場合、使用しているコントローラーがGRPCRoute v1をサポートするようアップデートされるまで、標準バージョンのGRPCRouteへのアップグレードは控えることをお勧めします。
それまでは、`v1alpha2`と`v1`の両方のAPIバージョンを含むv1.1の実験的チャンネルバージョンのGRPCRouteにアップグレードしても問題ありません。

#### [ParentReference Port](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.ParentReference)

ParentReferenceにportフィールドが追加されました。
これにより、リソースをGatewayのリスナー、Service、あるいは他の親リソース(実装によって異なります)に関連付けることができるようになりました。
ポートにバインドすることで、複数のリスナーに一度に関連付けることも可能です。

例えば、HTTPRouteをGatewayの特定のリスナーに関連付ける際、リスナー名ではなくリスナーのポートを指定できるようになりました。
これにより、一つまたは複数の特定のリスナーに関連付けることができます。

詳細については、[Gatewayへの関連付け](https://gateway-api.sigs.k8s.io/api-types/httproute/#attaching-to-gateways)を参照してください。

#### [適合性プロファイルとレポート](https://gateway-api.sigs.k8s.io/concepts/conformance/#conformance-profiles)

適合性レポートのAPIが拡張され、実装の動作モードを指定する`mode`フィールドと、Gateway APIのチャネル(標準版または実験的機能版)をしめす`gatewayAPIChannel`が追加されました。
`gatewayAPIVersion`と`gatewayAPIChannel`は、テスト結果の簡単な説明とともに、テストスイートの仕組みによって自動的に入力されるようになりました。
レポートの構成がより体系的に整理され、実装者はテストの実行方法に関する情報を追加し、再現手順を提供できるようになりました。

### 実験的機能版チャンネルへの新機能追加

#### [Gatewayのクライアント証明書の検証](https://gateway-api.sigs.k8s.io/geps/gep-91/)

Gatewayの各リスナーでクライアント証明書の検証が設定できるようになりました。
これは、`tls`内に新しく追加された`frontendValidation`フィールドによって実現されています。
このフィールドでは、クライアントが提示する証明書を検証するための信頼アンカーとして使用できるCA証明書のリストを設定できます。

以下の例は、ConfigMapの`foo-example-com-ca-cert`に保存されているCA証明書を使用して、Gatewayリスナーの`foo-https`に接続するクライアントの証明書を検証する方法を示しています。

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: client-validation-basic
spec:
  gatewayClassName: acme-lb
  listeners:
    name: foo-https
    protocol: HTTPS
    port: 443
    hostname: foo.example.com
  tls:
    certificateRefs:
      kind: Secret
      group: ""
      name: foo-example-com-cert
    frontendValidation:
      caCertificateRefs:
        kind: ConfigMap
        group: ""
        name: foo-example-com-ca-cert
```

#### [セッション維持とBackendLBPolicy](https://gateway-api.sigs.k8s.io/geps/gep-1619/)

Gateway APIに[セッション維持機能](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io%2fv1.SessionPersistence)が導入されました。
これは新しいポリシー([BackendLBPolicy](https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1alpha2.BackendLBPolicy))によってサービスレベルで設定でき、さらにHTTPRouteとGRPCRoute内のフィールドを使用してルートレベルでも設定可能です。
BackendLBPolicyとルートレベルのAPIは、セッションのタイムアウト、セッション名、セッションタイプ、クッキーの有効期間タイプなど、同じセッション維持の設定を提供します。

以下は、`foo`サービスにクッキーベースのセッション維持を有効にする`BackendLBPolicy`の設定例です。
セッション名を`foo-session`に設定し、絶対タイムアウトとアイドルタイムアウトを定義し、クッキーをセッションクッキーとして設定しています：

```yaml
apiVersion: gateway.networking.k8s.io/v1alpha2
kind: BackendLBPolicy
metadata:
  name: lb-policy
  namespace: foo-ns
spec:
  targetRefs:
  - group: core
    kind: service
    name: foo
  sessionPersistence:
    sessionName: foo-session
    absoluteTimeout: 1h
    idleTimeout: 30m
    type: Cookie
    cookieConfig:
      lifetimeType: Session
```

### その他の変更点

#### [TLS関連用語の明確化](https://gateway-api.sigs.k8s.io/geps/gep-2907/)

API全体でTLS関連の用語を統一する取り組みの一環として、BackendTLSPolicyに互換性のない変更を加えました。
これにより、新しいAPIバージョン(v1alpha3)が導入されました。
既存のv1alpha2を使用している場合は、データのバックアップや古いバージョンのアンインストールなど、適切な対応が必要です。

v1alpha2のBackendTLSPolicyフィールドへの参照は、v1alpha3に更新する必要があります。
主な変更点は以下の通りです：

- `targetRef`が`targetRefs`に変更(複数のターゲットへの適用が可能に)
- `tls`が`validation`に変更
- `tls.caCertRefs`が`validation.caCertificateRefs`に変更
- `tls.wellKnownCACerts`が`validation.wellKnownCACertificates`に変更

このリリースに含まれるすべての変更点については、[v1.1.0リリースノート](https://github.com/kubernetes-sigs/gateway-api/releases/tag/v1.1.0)をご覧ください。

## Gateway APIの背景

Gateway APIのアイデアは、2019年のKubeCon San Diegoで次世代のIngress APIとして[最初に提案](https://youtu.be/Ne9UJL6irXY?si=wgtC9w8PMB5ZHil2)されました。
それ以来、すばらしいコミュニティが形成され、おそらく[Kubernetes史上最も協力的なAPI](https://www.youtube.com/watch?v=V3Vu_FWb4l4)を開発してきました。
これまでに200人以上がこのAPIに貢献しており、その数は今も増え続けています。

メンテナーは、リポジトリへのコミット、議論、アイデア、あるいは一般的なサポートなど、あらゆる形でGateway APIに貢献してくださった _全ての方々_ に感謝の意を表します。
このように献身的で活発なコミュニティのサポートなしでは、ここまで到達することはできませんでした。

## 実際に使ってみましょう

Gateway APIの特徴として、最新版を使用するためにKubernetesそのものを最新にする必要がありません。
Kubernetes 1.26以降であれば、このバージョンのGateway APIをすぐに利用開始できます。

APIを試すには、[スタートガイド](https://gateway-api.sigs.k8s.io/guides/)をご覧ください。

## 開発に参加しませんか

Ingressやサービスメッシュ向けのKubernetesルーティングAPIの未来を形作るチャンスがたくさんあります。

- [ユーザーガイド](https://gateway-api.sigs.k8s.io/guides)で、対応可能なユースケースをチェックしてみてください。
- [既存のGatewayコントローラー](https://gateway-api.sigs.k8s.io/implementations/)を実際に試してみるのもおすすめです。
- さらに、[コミュニティへの参加](https://gateway-api.sigs.k8s.io/contributing/)もお待ちしています。一緒にGateway APIの未来を築いていきましょう！

## 関連するKubernetesブログ記事

- [New Experimental Features in Gateway API v1.0](/blog/2023/11/28/gateway-api-ga/)
  11/2023
- [Gateway API v1.0: GA Release](/blog/2023/10/31/gateway-api-ga/)
  10/2023
- [Introducing ingress2gateway; Simplifying Upgrades to Gateway API](/blog/2023/10/25/introducing-ingress2gateway/)
  10/2023
- [Gateway API v0.8.0: Introducing Service Mesh Support](/blog/2023/08/29/gateway-api-v0-8/)
  08/2023
