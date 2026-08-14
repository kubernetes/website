---
title: 名前空間レベルでのPodセキュリティの標準の適用
content_type: チュートリアル
weight: 20
---

{{% alert title="Note" %}}
このチュートリアルは、新しいクラスターにのみ適用されます。
{{% /alert %}}

Podセキュリティアドミッション(PSA)は、[ベータへ進み](/blog/2021/12/09/pod-security-admission-beta/)、v1.23以降でデフォルトで有効になっています。
Podセキュリティアドミッションは、Podが作成される際に、[Podセキュリティの標準](/docs/concepts/security/pod-security-standards/)の適用の認可を制御するものです。
このチュートリアルでは、一度に1つの名前空間で`baseline` Podセキュリティ標準を強制します。

Podセキュリティの標準を複数の名前空間に一度にクラスターレベルで適用することもできます。やり方については[クラスターレベルでのPodセキュリティの標準の適用](/docs/tutorials/security/cluster-level-pss/)を参照してください。

## {{% heading "prerequisites" %}}

ワークステーションに以下をインストールしてください:

- [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)

## クラスターの作成

1. 以下のように`KinD`クラスターを作成します。

   ```shell
   kind create cluster --name psa-ns-level
   ```

   出力は次のようになります:

   ```
   Creating cluster "psa-ns-level" ...
    ✓ Ensuring node image (kindest/node:v{{< skew currentPatchVersion >}}) 🖼 
    ✓ Preparing nodes 📦  
    ✓ Writing configuration 📜 
    ✓ Starting control-plane 🕹️ 
    ✓ Installing CNI 🔌 
    ✓ Installing StorageClass 💾 
   Set kubectl context to "kind-psa-ns-level"
   You can now use your cluster with:
    
   kubectl cluster-info --context kind-psa-ns-level
    
   Not sure what to do next? 😅  Check out https://kind.sigs.k8s.io/docs/user/quick-start/
   ```

1. kubectl のコンテキストを新しいクラスターにセットします:

   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```
   出力は次のようになります:

   ```
   Kubernetes control plane is running at https://127.0.0.1:50996
   CoreDNS is running at https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    
   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

## 名前空間の作成

`example`と呼ぶ新しい名前空間を作成します:

```shell
kubectl create ns example
```

出力は次のようになります:

```
namespace/example created
```

## 名前空間へのPodセキュリティの標準チェックの有効化

1. ビルトインのPod Security Admissionでサポートされているラベルを使って、この名前空間のPodセキュリティの標準を有効にします。
   このステップでは、_baseline_ Podセキュリティの標準の最新バージョンに合わないPodについて警告するチェックを設定します。

   ```shell
   kubectl label --overwrite ns example \
      pod-security.kubernetes.io/warn=baseline \
      pod-security.kubernetes.io/warn-version=latest
   ```

2. ラベルを使って、任意の名前空間に対して複数のPodセキュリティの標準チェックを設定できます。
   以下のコマンドは、`baseline` Podセキュリティの標準を`enforce`(強制)としますが、`restricted` Podセキュリティの標準には最新バージョンに準じて`warn`(警告)および`audit`(監査)とします(デフォルト値)。

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/enforce=baseline \
     pod-security.kubernetes.io/enforce-version=latest \
     pod-security.kubernetes.io/warn=restricted \
     pod-security.kubernetes.io/warn-version=latest \
     pod-security.kubernetes.io/audit=restricted \
     pod-security.kubernetes.io/audit-version=latest
   ```

## Podセキュリティの標準の強制の実証

1. `example`名前空間内に`baseline` Podを作成します:

   ```shell
   kubectl apply -n example -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```
   Podは正常に起動しますが、出力には警告が含まれています。例えば:

   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

1. `default`名前空間内に`baseline` Podを作成します:

   ```shell
   kubectl apply -n default -f https://k8s.io/examples/security/example-baseline-pod.yaml
   ```
   出力は次のようになります:

   ```
   pod/nginx created
   ```

`example`名前空間にだけ、Podセキュリティの標準のenforceと警告の設定が適用されました。
`default`名前空間内では、警告なしに同じPodを作成できました。

## 後片付け

では、上記で作成したクラスターを、以下のコマンドを実行して削除します:

```shell
kind delete cluster --name psa-ns-level
```

## {{% heading "whatsnext" %}}

- 前出の一連の手順を一度に全て行うために[シェルスクリプト](/examples/security/kind-with-namespace-level-baseline-pod-security.sh)を実行します。

  1. KinDクラスターを作成します。
  2. 新しい名前空間を作成します。
  3. `enforce`モードでは`baseline` Podセキュリティの標準を適用し、`warn`および`audit`モードでは`restricted` Podセキュリティの標準を適用します。
  4. これらのPodセキュリティの標準を適用した新しいPodを作成します。

- [Podのセキュリティアドミッション](/docs/concepts/security/pod-security-admission/)
- [Podセキュリティの標準](/docs/concepts/security/pod-security-standards/)
- [クラスターレベルでのPodセキュリティの標準の適用](/docs/tutorials/security/cluster-level-pss/)
