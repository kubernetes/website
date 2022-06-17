---
title: 在名字空間級別應用 Pod 安全標準
content_type: tutorial
weight: 10
---

<!--
title: Apply Pod Security Standards at the Namespace Level
content_type: tutorial
weight: 10
-->

{{% alert title="Note" %}}
<!-- This tutorial applies only for new clusters. -->
本教程僅適用於新叢集。
{{% /alert %}}

<!--
Pod Security admission (PSA) is enabled by default in v1.23 and later, as it
[graduated to beta](/blog/2021/12/09/pod-security-admission-beta/). Pod Security Admission
is an admission controller that applies 
[Pod Security Standards](/docs/concepts/security/pod-security-standards/) 
when pods are created. In this tutorial, you will enforce the `baseline` Pod Security Standard,
one namespace at a time.

You can also apply Pod Security Standards to multiple namespaces at once at the cluster
level. For instructions, refer to 
[Apply Pod Security Standards at the cluster level](/docs/tutorials/security/cluster-level-pss).
-->
Pod 安全准入（PSA）在 v1.23 及更高版本預設啟用，
因為它[升級到測試版（beta）](/blog/2021/12/09/pod-security-admission-beta/)。
Pod 安全准入是在建立 Pod 時應用
[Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)的准入控制器。
在本教程中，你將應用 `baseline` Pod 安全標準，每次一個名字空間。

你還可以在叢集級別一次將 Pod 安全標準應用於多個名稱空間。
有關說明，請參閱[在叢集級別應用 Pod 安全標準](/zh-cn/docs/tutorials/security/cluster-level-pss)。

## {{% heading "prerequisites" %}}

<!-- 
Install the following on your workstation:

- [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/docs/tasks/tools/)
-->
在你的工作站中安裝以下內容：

- [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](/zh-cn/docs/tasks/tools/)

<!--
## Create cluster

1. Create a `KinD` cluster as follows:
-->
## 建立叢集  {#create-cluster}

2. 按照如下方式建立一個 `KinD` 叢集：

   ```shell
   kind create cluster --name psa-ns-level --image kindest/node:v1.23.0
   ```
   <!-- The output is similar to this: -->
   輸出類似於：
   ```
   Creating cluster "psa-ns-level" ...
    ✓ Ensuring node image (kindest/node:v1.23.0) 🖼 
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

<!-- 1. Set the kubectl context to the new cluster: -->
1. 將 kubectl 上下文設定為新叢集：
   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```
    <!-- The output is similar to this: -->
   輸出類似於：
   ```
   Kubernetes control plane is running at https://127.0.0.1:50996
   CoreDNS is running at https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
   
   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

<!--
## Create a namespace

Create a new namespace called `example`:
-->
## 建立名字空間  {#create-a-namespace}

建立一個名為 `example` 的新名字空間：

```shell
kubectl create ns example
```

<!-- The output is similar to this: -->
輸出類似於：

```
namespace/example created
```

<!-- 
## Apply Pod Security Standards

1. Enable Pod Security Standards on this namespace using labels supported by
   built-in Pod Security Admission. In this step we will warn on baseline pod
   security standard as per the latest version (default value)
-->
## 應用 Pod 安全標準  {#apply-pod-security-standards}

1. 使用內建 Pod 安全准入所支援的標籤在此名字空間上啟用 Pod 安全標準。
   在這一步中，我們將根據最新版本（預設值）對基線 Pod 安全標準發出警告。

   ```shell
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/warn=baseline \
     pod-security.kubernetes.io/warn-version=latest
   ```

<!-- 
2. Multiple pod security standards can be enabled on any namespace, using labels.
   Following command will `enforce` the `baseline` Pod Security Standard, but
   `warn` and `audit` for `restricted` Pod Security Standards as per the latest
   version (default value)
-->
2. 可以使用標籤在任何名字空間上啟用多個 Pod 安全標準。
   以下命令將強制（`enforce`） 執行基線（`baseline`）Pod 安全標準，
   但根據最新版本（預設值）對受限（`restricted`）Pod 安全標準執行警告（`warn`）和稽核（`audit`）。

   ```
   kubectl label --overwrite ns example \
     pod-security.kubernetes.io/enforce=baseline \
     pod-security.kubernetes.io/enforce-version=latest \
     pod-security.kubernetes.io/warn=restricted \
     pod-security.kubernetes.io/warn-version=latest \
     pod-security.kubernetes.io/audit=restricted \
     pod-security.kubernetes.io/audit-version=latest
   ```

<!-- 
## Verify the Pod Security Standards

1. Create a minimal pod in `example` namespace:
-->
## 驗證 Pod 安全標準  {#verify-the-pod-security-standards}

1. 在 `example` 名字空間中建立一個最小的 pod：

   ```shell
   cat <<EOF > /tmp/pss/nginx-pod.yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: nginx
   spec:
     containers:
       - image: nginx
         name: nginx
         ports:
           - containerPort: 80
   EOF
   ```

<!-- 
2. Apply the pod spec to the cluster in `example` namespace: 
-->
1. 將 Pod 規約應用到叢集中的 `example` 名字空間中：
   ```shell
   kubectl apply -n example -f /tmp/pss/nginx-pod.yaml
   ```
   <!-- The output is similar to this: -->
   輸出類似於：
   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

<!-- 
1. Apply the pod spec to the cluster in `default` namespace:
-->
3. 將 Pod 規約應用到叢集中的 `default` 名字空間中：

   ```shell
   kubectl apply -n default -f /tmp/pss/nginx-pod.yaml
   ```

   <!-- Output is similar to this: -->
   輸出類似於：

   ```
   pod/nginx created
   ```

<!-- 
The Pod Security Standards were applied only to the `example`
namespace. You could create the same Pod in the `default` namespace
with no warnings.
-->
以上 Pod 安全標準僅被應用到 `example` 名字空間。
你可以在沒有警告的情況下在 `default` 名字空間中建立相同的 Pod。

<!-- 
## Clean up

Run `kind delete cluster -name psa-ns-level` to delete the cluster created.
-->
## 清理  {#clean-up}

執行 `kind delete cluster -name psa-ns-level` 刪除建立的叢集。

## {{% heading "whatsnext" %}}

<!-- 
- Run a
  [shell script](/examples/security/kind-with-namespace-level-baseline-pod-security.sh)
  to perform all the preceding steps all at once.

  1. Create KinD cluster
  2. Create new namespace
  3. Apply `baseline` Pod Security Standard in `enforce` mode while applying
     `restricted` Pod Security Standard also in `warn` and `audit` mode.
  4. Create a new pod with the following pod security standards applied
- [Pod Security Admission](/docs/concepts/security/pod-security-admission/)
- [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
- [Apply Pod Security Standards at the cluster level](/docs/tutorials/security/cluster-level-pss/)
-->
- 執行一個 [shell 指令碼](/examples/security/kind-with-namespace-level-baseline-pod-security.sh)
  一次執行所有前面的步驟。

   1. 建立 KinD 叢集
   2. 建立新的名字空間
   3. 在 `enforce` 模式下應用 `baseline` Pod 安全標準，
      同時在 `warn` 和 `audit` 模式下應用 `restricted` Pod 安全標準。
   4. 建立一個應用以下 Pod 安全標準的新 Pod

- [Pod 安全准入](/zh-cn/docs/concepts/security/pod-security-admission/)
- [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)
- [在叢集級別應用 Pod 安全標準](/zh-cn/docs/tutorials/security/cluster-level-pss/)
