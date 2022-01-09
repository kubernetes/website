---
title: 在名字空间级别应用 Pod 安全标准
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
本教程仅适用于新集群。
{{% /alert %}}

<!--
Pod Security admission (PSA) is enabled by default in v1.23 and later, as it [graduated
to beta](/blog/2021/12/09/pod-security-admission-beta/). Pod Security Admission
is an admission controller that applies 
[Pod Security Standards](docs/concepts/security/pod-security-standards/) 
when pods are created. In this tutorial, you will enforce the `baseline` Pod Security Standard,
one namespace at a time.

You can also apply Pod Security Standards to multiple namespaces at once at the cluster
level. For instructions, refer to [Apply Pod Security Standards at the cluster level](/docs/tutorials/security/cluster-level-pss).
-->
Pod 安全准入（PSA）在 v1.23 及更高版本默认启用，
因为它[升级到测试版（beta）](/blog/2021/12/09/pod-security-admission-beta/)。
Pod 安全准入是在创建 Pod 时应用
[Pod 安全标准](/zh/docs/concepts/security/pod-security-standards/)的准入控制器。
在本教程中，你将应用 `baseline` Pod 安全标准，每次一个名字空间。

你还可以在集群级别一次将 Pod 安全标准应用于多个名称空间。
有关说明，请参阅[在集群级别应用 Pod 安全标准](/zh/docs/tutorials/security/cluster-level-pss)。

## {{% heading "prerequisites" %}}

<!-- 
Install the following on your workstation:

- [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
-->
在你的工作站中安装以下内容：

- [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)

<!--
## Create cluster

1. Create a `KinD` cluster as follows:
-->
## 创建集群  {#create-cluster}

2. 按照如下方式创建一个 `KinD` 集群：

   ```shell
   kind create cluster --name psa-ns-level --image kindest/node:v1.23.0
   ```
   <!-- The output is similar to this: -->
   输入类似于：
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
1. 将 kubectl 上下文设置为新集群：
   ```shell
   kubectl cluster-info --context kind-psa-ns-level
   ```
    <!-- The output is similar to this: -->
   输入类似于：
   ```
   Kubernetes control plane is running at https://127.0.0.1:50996
   CoreDNS is running at https://127.0.0.1:50996/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
   
   To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
   ```

<!--
## Create a namespace

Create a new namespace called `example`:
-->
## 创建名字空间  {#create-a-namespace}

创建一个名为 `example` 的新名字空间：

```shell
kubectl create ns example
```
<!-- The output is similar to this: -->
输出类似于：
```
namespace/example created
```

<!-- 
## Apply Pod Security Standards

1. Enable Pod Security Standards on this namespace using labels supported by
   built-in Pod Security Admission. In this step we will warn on baseline pod
   security standard as per the latest version (default value)
-->
## 应用 Pod 安全标准  {#apply-pod-security-standards}

1. 使用内置 Pod 安全准入所支持的标签在此名字空间上启用 Pod 安全标准。
   在这一步中，我们将根据最新版本（默认值）对基线 Pod 安全标准发出警告。

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
2. 可以使用标签在任何名字空间上启用多个 Pod 安全标准。
   以下命令将强制（`enforce`） 执行基线（`baseline`）Pod 安全标准，
   但根据最新版本（默认值）对受限（`restricted`）Pod 安全标准执行警告（`warn`）和审核（`audit`）。

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
## 验证 Pod 安全标准  {#verify-the-pod-security-standards}

1. 在 `example` 名字空间中创建一个最小的 pod：

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
1. 将 Pod 规约应用到集群中的 `example` 名字空间中：
   ```shell
   kubectl apply -n example -f /tmp/pss/nginx-pod.yaml
   ```
   <!-- The output is similar to this: -->
   输出类似于：
   ```
   Warning: would violate PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "nginx" must set securityContext allowPrivilegeEscalation=false), unrestricted capabilities (container "nginx" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "nginx" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "nginx" must set securityContext seccompProfile.type to "RuntimeDefault" or "Localhost")
   pod/nginx created
   ```

<!-- 
1. Apply the pod spec to the cluster in `default` namespace:
-->
3. 将 Pod 规约应用到集群中的 `default` 名字空间中：
    ```shell
    kubectl apply -n default -f /tmp/pss/nginx-pod.yaml
    ```
   <!-- Output is similar to this: -->
   输入类似于：
   ```
   pod/nginx created
   ```

<!-- 
The Pod Security Standards were applied only to the `example`
namespace. You could create the same Pod in the `default` namespace
with no warnings.
-->
以上 Pod 安全标准仅被应用到 `example` 名字空间。
你可以在没有警告的情况下在 `default` 名字空间中创建相同的 Pod。

<!-- 
## Clean up

Run `kind delete cluster -name psa-ns-level` to delete the cluster created.
-->
## 清理  {#clean-up}

运行 `kind delete cluster -name psa-ns-level` 删除创建的集群。

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
- 运行一个 [shell 脚本](/examples/security/kind-with-namespace-level-baseline-pod-security.sh)
   一次执行所有前面的步骤。
   1. 创建 KinD 集群
   2. 创建新的名字空间
   3. 在 `enforce` 模式下应用 `baseline` Pod 安全标准，
      同时在 `warn` 和 `audit` 模式下应用 `restricted` Pod 安全标准。
   4. 创建一个应用以下 Pod 安全标准的新 Pod
- [Pod 安全准入](/zh/docs/concepts/security/pod-security-admission/)
- [Pod 安全标准](/zh/docs/concepts/security/pod-security-standards/)
- [在集群级别应用 Pod 安全标准](/zh/docs/tutorials/security/cluster-level-pss/)