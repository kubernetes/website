---
title: コントローラーマネージャーの指標
content_template: templates/concept
weight: 100
---

{{% capture overview %}}
コントローラーマネージャーの指標は、コントローラー内部のパフォーマンスについての重要で正確な情報と、クラウドコントローラーの状態についての情報を提供します。

{{% /capture %}}

{{% capture body %}}
## コントローラーマネージャーの指標とは何か

コントローラーマネージャーの指標は、コントローラー内部のパフォーマンスについての重要で正確な情報と、クラウドコントローラーの状態についての情報を提供します。
これらの指標にはgo_routineのカウントなどの一般的なGo言語ランタイムの指標と、etcdのリクエストレイテンシまたはCloudprovider（AWS、GCE、OpenStack）APIのレイテンシといったコントローラー固有の指標が含まれていて、クラスターの状態を測定するために利用できます。

Kubernetes 1.7からGCE、AWS、Vsphere、OpenStackのストレージ操作の詳細なCloudproviderの指標が利用可能になりました。
これらの指標は永続的ボリュームの操作状況を監視するために利用できます。

たとえば、GCEの場合にはこれらの指標は次のように呼び出されます。

```
cloudprovider_gce_api_request_duration_seconds { request = "instance_list"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_insert"}
cloudprovider_gce_api_request_duration_seconds { request = "disk_delete"}
cloudprovider_gce_api_request_duration_seconds { request = "attach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "detach_disk"}
cloudprovider_gce_api_request_duration_seconds { request = "list_disk"}
```



## 設定

クラスターではコントローラーマネージャーの指標はコントローラーマネージャーが実行されているホストの`http://localhost:10252/metrics`から取得可能です。

この指標は[prometheusフォーマット](https://prometheus.io/docs/instrumenting/exposition_formats/)で出力され人間が読める形式になっています。

本番環境ではこれらの指標を定期的に収集し、なんらかの時系列データベースで使用できるようにprometheusやその他の指標のスクレイパーを構成することが推奨されます。

{{% /capture %}}
