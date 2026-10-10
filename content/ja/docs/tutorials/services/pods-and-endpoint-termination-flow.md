---
title: Podとそのエンドポイントの終了動作を探る
content_type: tutorial
weight: 60
---


<!-- overview -->

[アプリケーションをServiceに接続する](/docs/tutorials/services/connect-applications-service/)で概略を示したステップに従ってアプリケーションをServiceに接続すると、ネットワーク上で公開され、継続的に実行されて、複製されたアプリケーションが得られます。
このチュートリアルでは、Podを終了する流れを見て、gracefulな(猶予のある)接続ドレインを実装する手法を模索するための手助けをします。

<!-- body -->

## Podの終了手続きとそのエンドポイント

アップグレードやスケールダウンのために、Podを終了しなければならない場面はままあります。
アプリケーションの可用性を高めるために、適切なアクティブ接続ドレインを実装することは重要でしょう。

このチュートリアルでは概念のデモンストレーションのために、シンプルなnginx Webサーバーを例として、対応するエンドポイントの状態に関連したPodの終了および削除の流れを説明します。

<!-- body -->

## エンドポイント終了の流れの例

以下は、[Podの終了](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)ドキュメントに記載されている流れの例です。

1つの`nginx`レプリカを含むDeployment(純粋にデモンストレーション目的です)とServiceがあるとします:

{{% codenew file="service/pod-with-graceful-termination.yaml" %}}

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      terminationGracePeriodSeconds: 120 # 非常に長い猶予期間
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        lifecycle:
          preStop:
            exec:
              # 実際の活動終了はterminationGracePeriodSecondsまでかかる可能性がある。
              # この例においては、少なくともterminationGracePeriodSecondsの間は待機し、
              # 120秒経過すると、コンテナは強制終了される。
              # この間ずっとnginxはリクエストを処理し続けていることに注意。
              command: [
                "/bin/sh", "-c", "sleep 180"
              ]

---

apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

PodとServiceが実行中になったら、関連付けられたEndpointSliceの名前を得られます:

```shell
kubectl get endpointslice
```

この出力は以下のようなものになります:

```none
NAME                  ADDRESSTYPE   PORTS   ENDPOINTS                 AGE
nginx-service-6tjbr   IPv4          80      10.12.1.199,10.12.1.201   22m
```

状態からわかるように、1つのエンドポイントが登録されていることが確認できます:

```shell
kubectl get endpointslices -o json -l kubernetes.io/service-name=nginx-service
```

この出力は以下のようなものになります:

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
```

では、Podを終了し、そのPodがgracefulな終了期間設定を守って終了されていることを確認してみましょう:

```shell
kubectl delete pod nginx-deployment-7768647bf9-b4b9s
```

全Podについて調べます:

```shell
kubectl get pods
```

この出力は以下のようなものになります:

```none
NAME                                READY   STATUS        RESTARTS      AGE
nginx-deployment-7768647bf9-b4b9s   1/1     Terminating   0             4m1s
nginx-deployment-7768647bf9-rkxlw   1/1     Running       0             8s
```

新しいPodがスケジュールされたことを見てとれます。

新しいPodのために新しいエンドポイントが作成される間、古いエンドポイントは終了中の状態のまま残っています:

```shell
kubectl get endpointslice -o json nginx-service-6tjbr
```

この出力は以下のようなものになります:

```none
{
    "addressType": "IPv4",
    "apiVersion": "discovery.k8s.io/v1",
    "endpoints": [
        {
            "addresses": [
                "10.12.1.201"
            ],
            "conditions": {
                "ready": false,
                "serving": true,
                "terminating": true
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-b4b9s",
                "namespace": "default",
                "uid": "66fa831c-7eb2-407f-bd2c-f96dfe841478"
            },
            "zone": "us-central1-c"
        },
        {
            "addresses": [
                "10.12.1.202"
            ],
            "conditions": {
                "ready": true,
                "serving": true,
                "terminating": false
            },
            "nodeName": "gke-main-default-pool-dca1511c-d17b",
            "targetRef": {
                "kind": "Pod",
                "name": "nginx-deployment-7768647bf9-rkxlw",
                "namespace": "default",
                "uid": "722b1cbe-dcd7-4ed4-8928-4a4d0e2bbe35"
            },
            "zone": "us-central1-c"
```


これを使うと、終了中のアプリケーションがその状態について、接続ドレイン機能の実装目的でクライアント(ロードバランサーなど)と通信する、ということが可能です。
これらのクライアントではエンドポイントの終了を検出し、そのための特別なロジックを実装できます。

Kubernetesでは、終了中のエンドポイントの`ready`状態は全て`false`にセットされます。
これは後方互換性のために必要な措置で、既存のロードバランサーは通常のトラフィックにはそれを使用しません。
Podの終了時にトラフィックのドレインが必要な場合、実際に準備できているかは`serving`状態として調べられます。

Podが削除される時には、古いエンドポイントも削除されます。

## {{% heading "whatsnext" %}}


* [アプリケーションをServiceに接続する](/docs/tutorials/services/connect-applications-service/)方法を学びます。
* [Serviceを利用したクラスター内のアプリケーションへのアクセス](/ja/docs/tasks/access-application-cluster/service-access-application-cluster/)を学びます。
* [Serviceを使用してフロントエンドをバックエンドに接続する](/ja/docs/tasks/access-application-cluster/connecting-frontend-backend/)を学びます。
* [外部ロードバランサーの作成](/docs/tasks/access-application-cluster/create-external-load-balancer/)を学びます。
