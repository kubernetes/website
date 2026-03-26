---
layout: blog
title: "Ingress2Gateway 1.0リリースのお知らせ: Gateway APIへの移行"
slug: ingress2gateway-1-0-release
author: >
  [Beka Modebadze](https://github.com/bexxmodd) (Google),
  [Steven Jin](https://github.com/Stevenjin8) (Microsoft)
translator: >
  [Taisuke Okamoto](https://github.com/b1gb4by) ([PLAID, Inc.](https://plaid.co.jp/)),
date: 2026-03-20T11:00:00-08:00
---

Ingress-NGINXの[廃止](/blog/2025/11/11/ingress-nginx-retirement/)が2026年3月に予定されており、Kubernetesのネットワーキングは転換期を迎えています。
多くの組織にとって、問題は[Gateway API](https://gateway-api.sigs.k8s.io/)に移行するかどうかではなく、いかに安全に移行するかです。

IngressからGateway APIへの移行は、API設計における根本的な転換です。
Gateway APIはモジュール式で拡張可能なAPIを提供し、KubernetesネイティブなRBACを強力にサポートしています。
一方、Ingress APIはシンプルですがIngress-NGINXのような実装では独自のアノテーション、ConfigMap、CRDを通じてAPIを拡張しています。
Ingress-NGINXのようなIngressコントローラーからの移行では、Ingressコントローラーのあらゆる細かな挙動を正確に把握し、それをGateway APIへ対応付けるという困難な作業が伴います。

Ingress2Gatewayは、チームがIngressからGateway APIへ安心して移行できるよう支援するツールです。
Ingressリソースやマニフェストを実装固有のアノテーションも含めてGateway APIへ変換します。また、変換できない設定については警告や代替案を提示します。

本日、SIG Networkは**Ingress2Gatewayの1.0リリース**を発表します。
このマイルストーンは、ネットワーキングスタックの刷新を検討しているチームに向けた、安定かつテスト済みの移行支援ツールの完成を意味します。

## Ingress2Gateway 1.0 {#ingress2gateway-1-0}

### Ingress-NGINXアノテーションのサポート {#ingress-nginx-annotation-support}

1.0リリースにおける主な改善点は、Ingress-NGINXのより包括的なサポートです。
1.0リリース以前、Ingress2GatewayがサポートしていたIngress-NGINXのアノテーションはわずか3つでした。
1.0リリースでは、30以上の一般的なアノテーション(CORS、バックエンドTLS、正規表現マッチング、パスの書き換えなど)をサポートしています。

### 包括的なインテグレーションテスト {#comprehensive-integration-testing}

サポートされている各Ingress-NGINXアノテーション、および一般的なアノテーションの代表的な組み合わせには、コントローラーレベルのインテグレーションテストが用意されています。
これらのテストは、Ingress-NGINX設定と生成されたGateway APIの動作が同等であることを検証します。
これらのテストは、実際のクラスター上で実際のコントローラーを動作させ、YAML構造だけでなく、実行時の挙動(ルーティング、リダイレクト、書き換えなど)を比較します。

テストでは以下を行います:

- Ingress-NGINXコントローラーを起動する
- 複数のGateway APIコントローラーを起動する
- 実装固有の設定を含むIngressリソースを適用する
- `ingress2gateway`でIngressリソースをGateway APIに変換し、生成されたマニフェストを適用する
- Gateway APIコントローラーとIngressコントローラーが同等の挙動を示すことを検証する

包括的なテストスイートは開発中のバグを検出するだけでなく、[予期しないエッジケースや想定外のデフォルト値](/blog/2026/ingress-nginx-before-you-migrate)を考慮した変換の正確性を保証するため、本番環境で初めて問題に気づくという事態を防ぎます。

### 通知とエラーハンドリング {#notification--error-handling}

移行は「ワンクリック」で完了するものではありません。
サポートされている設定を変換することと同様に、細かな差異や変換できない挙動を明示することも重要です。
1.0リリースでは通知のフォーマットと内容が改善され、何が不足しているか、どのように修正すればよいかが明確にわかるようになりました。

## Ingress2Gatewayの使い方 {#using-ingress2gateway}

Ingress2Gatewayは移行支援ツールであり、一度きりの置き換えツールではありません。
その目的は以下の通りです。

- サポートされているIngressの設定と挙動を移行する
- サポートされていない設定を特定し、代替案を提示する
- 望ましくない設定を再評価し、必要に応じて破棄する

このセクションでは、以下のIngress-NGINX設定を安全に移行する方法を説明します。

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  annotations:
    nginx.ingress.kubernetes.io/proxy-body-size: "1G"
    nginx.ingress.kubernetes.io/use-regex: "true"
    nginx.ingress.kubernetes.io/proxy-send-timeout: "1"
    nginx.ingress.kubernetes.io/proxy-read-timeout: "1"
    nginx.ingress.kubernetes.io/enable-cors: "true"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "Request-Id: $req_id";
  name: my-ingress
  namespace: my-ns
spec:
  ingressClassName: nginx
  rules:
    - host: my-host.example.com
      http:
        paths:
          - backend:
              service:
                name: website-service
                port:
                  number: 80
            path: /users/(\d+)
            pathType: ImplementationSpecific
  tls:
    - hosts:
        - my-host.example.com
      secretName: my-secret
```

### 1. Ingress2Gatewayのインストール {#1-install-ingress2gateway}

Go環境がセットアップ済みであれば、以下のコマンドでIngress2Gatewayをインストールできます。

```bash
go install github.com/kubernetes-sigs/ingress2gateway@v1.0.0
```

または、以下のコマンドを使用します。

```bash
brew install ingress2gateway
```

[GitHub](https://github.com/kubernetes-sigs/ingress2gateway/releases/tag/v1.0.0)からバイナリをダウンロードするか、[ソースからビルド](https://github.com/kubernetes-sigs/ingress2gateway/)することもできます。

### 2. Ingress2Gatewayの実行 {#2-run-ingress2gateway}

Ingress2GatewayにはIngressマニフェストをファイルとして渡すか、クラスターから直接読み取らせることができます。

```bash
# マニフェストファイルを渡す
ingress2gateway print --input-file my-manifest.yaml,my-other-manifest.yaml --providers=ingress-nginx > gwapi.yaml
# クラスター内のNamespaceを指定する
ingress2gateway print --namespace my-api --providers=ingress-nginx > gwapi.yaml
# クラスター全体を対象にする
ingress2gateway print --providers=ingress-nginx --all-namespaces > gwapi.yaml
```

{{< note >}}
`--emitter <agentgateway|envoy-gateway|kgateway>`を渡すことで、実装固有の拡張を出力することもできます。
{{< /note >}}

### 3. 出力の確認 {#3-review-the-output}

これが最も重要なステップです。
前のセクションのコマンドはGateway APIマニフェストを`gwapi.yaml`に出力するとともに、正確に変換できなかった箇所や手動で確認すべき点を説明する警告も出力します。

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: nginx
  namespace: my-ns
spec:
  gatewayClassName: nginx
  listeners:
    - hostname: my-host.example.com
      name: my-host-example-com-http
      port: 80
      protocol: HTTP
    - hostname: my-host.example.com
      name: my-host-example-com-https
      port: 443
      protocol: HTTPS
      tls:
        certificateRefs:
          - group: ""
            kind: Secret
            name: my-secret
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-ingress-my-host-example-com
  namespace: my-ns
spec:
  hostnames:
    - my-host.example.com
  parentRefs:
    - name: nginx
      port: 443
  rules:
    - backendRefs:
        - name: website-service
          port: 80
      filters:
        - cors:
            allowCredentials: true
            allowHeaders:
              - DNT
              - Keep-Alive
              - User-Agent
              - X-Requested-With
              - If-Modified-Since
              - Cache-Control
              - Content-Type
              - Range
              - Authorization
            allowMethods:
              - GET
              - PUT
              - POST
              - DELETE
              - PATCH
              - OPTIONS
            allowOrigins:
              - "*"
            maxAge: 1728000
          type: CORS
      matches:
        - path:
            type: RegularExpression
            value: (?i)/users/(\d+).*
      name: rule-0
      timeouts:
        request: 10s
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-ingress-my-host-example-com-ssl-redirect
  namespace: my-ns
spec:
  hostnames:
    - my-host.example.com
  parentRefs:
    - name: nginx
      port: 80
  rules:
    - filters:
        - requestRedirect:
            scheme: https
            statusCode: 308
          type: RequestRedirect
```

Ingress2Gatewayは、一部のアノテーションをGateway APIの同等の機能へ正常に変換しました。
例えば、 `nginx.ingress.kubernetes.io/enable-cors`アノテーションはCORSフィルターに変換されています。
しかし詳しく見ると、 `nginx.ingress.kubernetes.io/proxy-{read,send}-timeout`と`nginx.ingress.kubernetes.io/proxy-body-size`アノテーションは完全には対応付けられていません。
ログには、これらが省略された理由と変換の背景が示されています。

```
┌─ WARN  ────────────────────────────────────────
│  Unsupported annotation nginx.ingress.kubernetes.io/configuration-snippet
│  source: INGRESS-NGINX
│  object: Ingress: my-ns/my-ingress
└─
┌─ INFO  ────────────────────────────────────────
│  Using case-insensitive regex path matches. You may want to change this.
│  source: INGRESS-NGINX
│  object: HTTPRoute: my-ns/my-ingress-my-host-example-com
└─
┌─ WARN  ────────────────────────────────────────
│  ingress-nginx only supports TCP-level timeouts; i2gw has made a best-effort translation to Gateway API timeouts.request. Please verify that this meets your needs. See documentation: https://gateway-api.sigs.k8s.io/guides/http-timeouts/
│  source: INGRESS-NGINX
│  object: HTTPRoute: my-ns/my-ingress-my-host-example-com
└─
┌─ WARN  ────────────────────────────────────────
│  Failed to apply my-ns.my-ingress.metadata.annotations."nginx.ingress.kubernetes.io/proxy-body-size" from my-ns/my-ingress: Most Gateway API implementations have reasonable body size and buffering defaults
│  source: STANDARD_EMITTER
│  object: HTTPRoute: my-ns/my-ingress-my-host-example-com
└─
┌─ WARN  ────────────────────────────────────────
│  Gateway API does not support configuring URL normalization (RFC 3986, Section 6). Please check if this matters for your use case and consult implementation-specific details.
│  source: STANDARD_EMITTER
└─
```

Ingress2Gatewayが`nginx.ingress.kubernetes.io/configuration-snippet`アノテーションをサポートしていないという警告が表示されています。
同等の挙動を実現する方法があるかどうか、使用しているGateway API実装のドキュメントを確認する必要があります。

また、Ingress-NGINXの正規表現マッチングは大文字小文字を区別しないプレフィックスマッチであることも通知されています。これが、マッチパターンが `(?i)/users/(\d+).*` となっている理由です。
ほとんどの組織では、パスパターンから先頭の `(?i)` と末尾の `.*` を削除して、大文字小文字を区別する完全一致に変更することが望ましいでしょう。

Ingress2Gatewayは、`nginx.ingress.kubernetes.io/proxy-{send,read}-timeout`アノテーションからHTTPルートの10秒の[リクエストタイムアウト](https://gateway-api.sigs.k8s.io/guides/http-timeouts/)へのベストエフォートな変換を行いました。
このServiceへのリクエストがもっと短い時間、例えば3秒で完了すべきであれば、Gateway APIマニフェストに対応する変更を加えてください。

また、 `nginx.ingress.kubernetes.io/proxy-body-size`にはGateway APIでの同等の機能がないため、変換されていません。
しかし、ほとんどのGateway API実装ではリクエストボディの最大サイズやバッファリングに適切なデフォルト値が設定されているため、実際には問題にならない可能性があります。
さらに、一部のエミッターでは実装固有の拡張を通じてこのアノテーションをサポートしている場合があります。
例えば、先ほどの`ingress2gateway print`コマンドに`--emitter agentgateway`、`--emitter envoy-gateway`、または`--emitter kgateway`フラグを追加すると、生成されるGateway APIマニフェストにボディサイズの設定を反映した実装固有の設定が追加されます。

URL正規化に関する警告も表示されています。
Agentgateway、Envoy Gateway、Kgateway、IstioなどのGateway API実装にはある程度のURL正規化機能がありますが、その挙動は実装によって異なり、標準のGateway APIを通じて設定することはできません。
使用しているGateway API実装のURL正規化の挙動を確認・テストし、ユースケースとの互換性を確保してください。

Ingress-NGINXのデフォルトの挙動に合わせるため、Ingress2Gatewayはポート80のリスナーと、HTTPトラフィックをHTTPSにリダイレクトする[HTTPリクエストリダイレクトフィルター](https://gateway-api.sigs.k8s.io/reference/spec/#httprequestredirectfilter)も追加しています。
HTTPトラフィックを一切処理しない場合は、ポート80のリスナーと対応するHTTPRouteを削除してください。

{{< caution >}}
生成された出力とログを必ず確認してください。
{{< /caution >}}

これらの変更を手動で適用した後、Gateway APIマニフェストは以下のようになります。

```yaml
---
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: nginx
  namespace: my-ns
spec:
  gatewayClassName: nginx
  listeners:
  - hostname: my-host.example.com
    name: my-host-example-com-https
    port: 443
    protocol: HTTPS
    tls:
      certificateRefs:
      - group: ""
        kind: Secret
        name: my-secret
---
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  annotations:
    gateway.networking.k8s.io/generator: ingress2gateway-dev
  name: my-ingress-my-host-example-com
  namespace: my-ns
spec:
  hostnames:
  - my-host.example.com
  parentRefs:
  - name: nginx
    port: 443
  rules:
  - backendRefs:
    - name: website-service
      port: 80
    filters:
    - cors:
        allowCredentials: true
        allowHeaders:
        - DNT
        ...
        allowMethods:
        - GET
        ...
        allowOrigins:
        - '*'
        maxAge: 1728000
      type: CORS
    matches:
    - path:
        type: RegularExpression
        value: /users/(\d+)
    name: rule-0
    timeouts:
      request: 3s
```

### 4. 検証 {#4-verify}

Gateway APIマニフェストが用意できたら、開発クラスターで十分にテストしてください。
この例では、少なくともGateway API実装のリクエストボディの最大サイズのデフォルト値が適切であることと、3秒のタイムアウトが十分であることを確認してください。
開発クラスターで挙動を検証した後、既存のIngressと並行してGateway APIの設定をデプロイしてください。

その後、DNSの重み付けルーティング、クラウドロードバランサー、またはプラットフォームのトラフィック分割機能を使用して、トラフィックを段階的に移行することを強く推奨します。
こうすることで、テストをすり抜けた設定ミスから迅速に復旧できます。

最後に、すべてのトラフィックをGateway APIコントローラーに移行し終えたら、Ingressリソースを削除しIngressコントローラーをアンインストールしてください。

## まとめ {#conclusion}

Ingress2Gateway 1.0のリリースはまだ始まりに過ぎません。Ingress2Gatewayを活用してGateway APIへ安全に移行していただければ幸いです。
2026年3月のIngress-NGINX廃止が迫る中、設定の対応範囲の拡大、テストの拡充、UXの改善にご協力いただけるよう、コミュニティの皆さまに呼びかけます。

## Gateway APIに関するリソース {#resources-about-gateway-api}

Gateway APIの対象範囲は広大です。
Gateway APIを活用するために役立つリソースを以下に紹介します。

- [Listener sets](https://gateway-api.sigs.k8s.io/geps/gep-1713/?h=listenersets)は、アプリケーション開発者がGatewayリスナーを管理できるようにする機能です。
- [`gwctl`](https://github.com/kubernetes-sigs/gwctl)は、アタッチメントやリンターエラーなど、Gatewayリソースの包括的なビューを提供します。
- Gateway API Slack: [Kubernetes Slack](https://kubernetes.slack.com)の`#sig-network-gateway-api`
- Ingress2Gateway Slack: [Kubernetes Slack](https://kubernetes.slack.com)の`#sig-network-ingress2gateway`
- GitHub: [kubernetes-sigs/ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway)
