---
title: クラスターレベルでのPodセキュリティの標準の適用
content_type: tutorial
weight: 10
---

{{% alert title="Note" %}}
このチュートリアルは、新しいクラスターにのみ適用されます。
{{% /alert %}}

Podセキュリティアドミッション(PSA)は、[ベータへ進み](/blog/2021/12/09/pod-security-admission-beta/)、v1.23以降でデフォルトで有効になっています。
Podセキュリティアドミッションは、Podが作成される際に、[Podセキュリティの標準](/ja/docs/concepts/security/pod-security-standards/)の適用の認可を制御するものです。
このチュートリアルでは、クラスター内の全ての名前空間に標準設定を適用することで、クラスターレベルで`baseline` Podセキュリティの標準を強制する方法を示します。

Podセキュリティの標準を特定の名前空間に適用するには、[名前空間レベルでのPodセキュリティの標準の適用](/ja/docs/tutorials/security/ns-level-pss/)を参照してください。

v{{< skew currentVersion >}}以外のKubernetesバージョンを実行している場合は、そのバージョンのドキュメントを確認してください。

## {{% heading "prerequisites" %}}

ワークステーションに以下をインストールしてください:

- [kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/ja/docs/tasks/tools/)

このチュートリアルでは、完全な制御下にあるKubernetesクラスターの何を設定できるかをデモンストレーションします。
コントロールプレーンを設定できない管理されたクラスターのPodセキュリティアドミッションに対しての設定方法を知りたいのであれば、[名前空間レベルでのPodセキュリティの標準の適用](/ja/docs/tutorials/security/ns-level-pss/)を参照してください。

## 適用する正しいPodセキュリティの標準の選択

[Podのセキュリティアドミッション](/ja/docs/concepts/security/pod-security-admission/)は、以下のモードでビルトインの[Podセキュリティの標準](/ja/docs/concepts/security/pod-security-standards/)の適用を促します: `enforce`、`audit`、`warn`。
設定に最適なPodセキュリティの標準を選択するにあたって助けになる情報を収集するために、以下を行ってください:

1. Podセキュリティの標準を適用していないクラスターを作成します:

   ```shell
   kind create cluster --name psa-wo-cluster-pss
   ```
   出力は次のようになります:
   ```
   Creating cluster "psa-wo-cluster-pss" ...
   ✓ Ensuring node image (kindest/node:v{{< skew currentVersion >}}.0) 🖼
   ✓ Preparing nodes 📦
   ✓ Writing configuration 📜
   ✓ Starting control-plane 🕹️
   ✓ Installing CNI 🔌
   ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-wo-cluster-pss"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-wo-cluster-pss

   Thanks for using kind! 😊
   ```

1. kubectl contextを新しいクラスターにセットします:

   ```shell
   kubectl cluster-info --context kind-psa-wo-cluster-pss
   ```
   出力は次のようになります:

   ```
   Kubernetes control plane is running at https://127.0.0.1:61350

   CoreDNS is running at https://127.0.0.1:61350/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. クラスター内の名前空間の一覧を取得します:

   ```shell
   kubectl get ns
   ```
   出力は次のようになります:
   ```
   NAME                 STATUS   AGE
   default              Active   9m30s
   kube-node-lease      Active   9m32s
   kube-public          Active   9m32s
   kube-system          Active   9m32s
   local-path-storage   Active   9m26s
   ```

1. 異なるPodセキュリティの標準が適用されたときに何が起きるかを理解するために、`-dry-run=server`を使います:

   1. privileged
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=privileged
      ```

      出力は次のようになります:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```
   2. baseline
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=baseline
      ```

      出力は次のようになります:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "baseline:latest"
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged
      namespace/kube-system labeled
      namespace/local-path-storage labeled
      ```

   3. restricted
      ```shell
      kubectl label --dry-run=server --overwrite ns --all \
      pod-security.kubernetes.io/enforce=restricted
      ```

      出力は次のようになります:
      ```
      namespace/default labeled
      namespace/kube-node-lease labeled
      namespace/kube-public labeled
      Warning: existing pods in namespace "kube-system" violate the new PodSecurity enforce level "restricted:latest"
      Warning: coredns-7bb9c7b568-hsptc (and 1 other pod): unrestricted capabilities, runAsNonRoot != true, seccompProfile
      Warning: etcd-psa-wo-cluster-pss-control-plane (and 3 other pods): host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true
      Warning: kindnet-vzj42: non-default capabilities, host namespaces, hostPath volumes, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      Warning: kube-proxy-m6hwf: host namespaces, hostPath volumes, privileged, allowPrivilegeEscalation != false, unrestricted capabilities, restricted volume types, runAsNonRoot != true, seccompProfile
      namespace/kube-system labeled
      Warning: existing pods in namespace "local-path-storage" violate the new PodSecurity enforce level "restricted:latest"
      Warning: local-path-provisioner-d6d9f7ffc-lw9lh: allowPrivilegeEscalation != false, unrestricted capabilities, runAsNonRoot != true, seccompProfile
      namespace/local-path-storage labeled
      ```

この出力から、`privileged` Podセキュリティの標準を適用すると、名前空間のどれにも警告が示されないことに気付くでしょう。
これに対し、`baseline`と`restrict`の標準ではどちらも、とりわけ`kube-system`名前空間に対して警告が示されています。

## モード、バージョン、標準のセット

このセクションでは、`latest`バージョンに以下のPodセキュリティの標準を適用します:

* `enforce`モードで`baseline`標準。
* `warn`および`audit`モードで`restricted`標準。

`baseline` Podセキュリティの標準は、免除リストを短く保てて、かつ既知の特権昇格を防ぐような、利便性のある中庸を提供します。

加えて、`kube-system`内の失敗からPodを守るために、適用されるPodセキュリティの標準の対象から名前空間を免除します。

環境にPodセキュリティアドミッションを実装する際には、以下の点を考慮してください:

1. クラスターに適用されるリスク状況に基づくと、`restricted`のようにより厳格なPodセキュリティの標準のほうが、より良い選択肢かもしれません。
1. `kube-system`名前空間の免除は、Podがその名前空間で`privileged`として実行するのを許容することになります。
   実世界で使うにあたっては、以下の最小権限の原則に従って`kube-system`へのアクセスを制限する厳格なRBACポリシーを適用することを、Kubernetesプロジェクトは強く推奨します。
   上記の標準を実装するには、次のようにします:
1. 目的のPodセキュリティの標準を実装するために、Podセキュリティアドミッションコントローラーで利用可能な設定ファイルを作成します:

   ```
   mkdir -p /tmp/pss
   cat <<EOF > /tmp/pss/cluster-level-pss.yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: AdmissionConfiguration
   plugins:
   - name: PodSecurity
     configuration:
       apiVersion: pod-security.admission.config.k8s.io/v1
       kind: PodSecurityConfiguration
       defaults:
         enforce: "baseline"
         enforce-version: "latest"
         audit: "restricted"
         audit-version: "latest"
         warn: "restricted"
         warn-version: "latest"
       exemptions:
         usernames: []
         runtimeClasses: []
         namespaces: [kube-system]
   EOF
   ```

   {{< note >}}
   `pod-security.admission.config.k8s.io/v1`設定はv1.25+での対応です。
   v1.23とv1.24では[v1beta1](https://v1-24.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)を使用してください。
   v1.22では[v1alpha1](https://v1-22.docs.kubernetes.io/docs/tasks/configure-pod-container/enforce-standards-admission-controller/)を使用してください。
   {{< /note >}}


1. クラスターの作成中にこのファイルを取り込むAPIサーバーを設定します:

   ```
   cat <<EOF > /tmp/pss/cluster-config.yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   nodes:
   - role: control-plane
     kubeadmConfigPatches:
     - |
       kind: ClusterConfiguration
       apiServer:
           extraArgs:
             admission-control-config-file: /etc/config/cluster-level-pss.yaml
           extraVolumes:
             - name: accf
               hostPath: /etc/config
               mountPath: /etc/config
               readOnly: false
               pathType: "DirectoryOrCreate"
     extraMounts:
     - hostPath: /tmp/pss
       containerPath: /etc/config
       # optional: if set, the mount is read-only.
       # default false
       readOnly: false
       # optional: if set, the mount needs SELinux relabeling.
       # default false
       selinuxRelabel: false
       # optional: set propagation mode (None, HostToContainer or Bidirectional)
       # see https://kubernetes.io/docs/concepts/storage/volumes/#mount-propagation
       # default None
       propagation: None
   EOF
   ```

   {{<note>}}
   macOSでDocker Desktopと*kind*を利用している場合は、**Preferences > Resources > File Sharing**のメニュー項目からShared Directoryとして`/tmp`を追加できます。
   {{</note>}}

1. 目的のPodセキュリティの標準を適用するために、Podセキュリティアドミッションを使うクラスターを作成します:

   ```shell
   kind create cluster --name psa-with-cluster-pss --config /tmp/pss/cluster-config.yaml
   ```
   出力は次のようになります:
   ```
   Creating cluster "psa-with-cluster-pss" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentVersion >}}.0) 🖼
    ✓ Preparing nodes 📦
    ✓ Writing configuration 📜
    ✓ Starting control-plane 🕹️
    ✓ Installing CNI 🔌
    ✓ Installing StorageClass 💾
   Set kubectl context to "kind-psa-with-cluster-pss"
   You can now use your cluster with:

   kubectl cluster-info --context kind-psa-with-cluster-pss

   Have a question, bug, or feature request? Let us know! https://kind.sigs.k8s.io/#community 🙂
   ```

1. kubectlをこのクラスターに向けます:
   ```shell
   kubectl cluster-info --context kind-psa-with-cluster-pss
   ```
   出力は次のようになります:
   ```
   Kubernetes control plane is running at https://127.0.0.1:63855
   CoreDNS is running at https://127.0.0.1:63855/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

1. デフォルトの名前空間にPodを作成します:

   ```shell
   kubectl apply -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```

   Podは正常に開始されますが、出力には警告が含まれます:
   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

## 後片付け

では、上記で作成したクラスターを、以下のコマンドを実行して削除します:

```shell
kind delete cluster --name psa-with-cluster-pss
```
```shell
kind delete cluster --name psa-wo-cluster-pss
```

## {{% heading "whatsnext" %}}

- 前出の一連の手順を一度に全て行うために[シェルスクリプト](/examples/security/kind-with-cluster-level-baseline-pod-security.sh)を実行します:
  1. クラスターレベルの設定に基づきPodセキュリティの標準を作成します。
  2. APIサーバーでこの設定を取り込むようにファイルを作成します。
  3. この設定のAPIサーバーを立てるクラスターを作成します。
  4. この新しいクラスターにkubectl contextをセットします。
  5. 最小限のPod YAMLファイルを作成します。
  6. 新しいクラスター内でPodを作成するために、このファイルを適用します。
- [Podのセキュリティアドミッション](/ja/docs/concepts/security/pod-security-admission/)
- [Podセキュリティの標準](/ja/docs/concepts/security/pod-security-standards/)
- [名前空間レベルでのPodセキュリティの標準の適用](/ja/docs/tutorials/security/ns-level-pss/)
