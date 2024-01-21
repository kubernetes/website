---
title: ノード固有のボリューム制限
content_type: concept
weight: 90
---

<!-- overview -->

このページでは、さまざまなクラウドプロバイダーのノードに接続できるボリュームの最大数について説明します。

通常、Google、Amazon、Microsoftなどのクラウドプロバイダーには、ノードに接続できるボリュームの数に制限があります。Kubernetesがこれらの制限を尊重することが重要です。
そうしないと、ノードでスケジュールされたPodが、ボリュームが接続されるのを待ってスタックする可能性があります。



<!-- body -->

## Kubernetesのデフォルトの制限

Kubernetesスケジューラーには、ノードに接続できるボリュームの数にデフォルトの制限があります。

<table>
  <tr><th>クラウドサービス</th><th>ノード当たりの最大ボリューム</th></tr>
  <tr><td><a href="https://aws.amazon.com/ebs/">Amazon Elastic Block Store (EBS)</a></td><td>39</td></tr>
  <tr><td><a href="https://cloud.google.com/persistent-disk/">Google Persistent Disk</a></td><td>16</td></tr>
  <tr><td><a href="https://azure.microsoft.com/en-us/services/storage/main-disks/">Microsoft Azure Disk Storage</a></td><td>16</td></tr>
</table>

## カスタム制限

これらの制限を変更するには、`KUBE_MAX_PD_VOLS`環境変数の値を設定し、スケジューラーを開始します。CSIドライバーの手順は異なる場合があります。制限をカスタマイズする方法については、CSIドライバーのドキュメントを参照してください。

デフォルトの制限よりも高い制限を設定する場合は注意してください。クラウドプロバイダーのドキュメントを参照して、設定した制限をノードが実際にサポートしていることを確認してください。

制限はクラスター全体に適用されるため、すべてのノードに影響します。

## 動的ボリューム制限

{{< feature-state state="stable" for_k8s_version="v1.17" >}}

動的ボリューム制限は、次のボリュームタイプでサポートされています。

- Amazon EBS
- Google Persistent Disk
- Azure Disk
- CSI

ツリー内のボリュームプラグインによって管理されるボリュームの場合、Kubernetesはノードタイプを自動的に決定し、ノードに適切なボリュームの最大数を適用します。例えば:

* <a href="https://cloud.google.com/compute/">Google Compute Engine</a>上では[ノードタイプ](https://cloud.google.com/compute/docs/disks/#pdnumberlimits)に応じて、最大127個のボリュームをノードに接続できます。

* M5、C5、R5、T3、およびZ1DインスタンスタイプのAmazon EBSディスクの場合、Kubernetesは25ボリュームのみをノードにアタッチできます。<a href="https://aws.amazon.com/ec2/">Amazon Elastic Compute Cloud (EC2)</a>の他のインスタンスタイプの場合、Kubernetesでは39個のボリュームをノードに接続できます。

* Azureでは、ノードの種類に応じて、最大64個のディスクをノードに接続できます。詳細については、[Azureの仮想マシンのサイズ](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/sizes)を参照してください。

* CSIストレージドライバーが(`NodeGetInfo`を使用して)ノードの最大ボリューム数をアドバタイズする場合、{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}はその制限を尊重します。詳細については、[CSIの仕様](https://github.com/container-storage-interface/spec/blob/master/spec.md#nodegetinfo)を参照してください。

* CSIドライバーに移行されたツリー内プラグインによって管理されるボリュームの場合、ボリュームの最大数はCSIドライバーによって報告される数になります。

