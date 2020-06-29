---
reviewers:
- bprashanth
- liggitt
- thockin
title: 为 Pod 配置服务账户
content_type: task
weight: 90
---

<!--
---
reviewers:
- bprashanth
- liggitt
- thockin
title: Configure Service Accounts for Pods
content_type: task
weight: 90
---
-->

<!-- overview -->

<!--
A service account provides an identity for processes that run in a Pod.

*This is a user introduction to Service Accounts.  See also the
[Cluster Admin Guide to Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/).*
-->

服务账户为 Pod 中运行的进程提供了一个标识。

*本文是服务账户的用户使用介绍。您也可以参考[集群管理指南之服务账户](/docs/reference/access-authn-authz/service-accounts-admin/)。*


{{< note >}}
<!--
This document describes how service accounts behave in a cluster set up
as recommended by the Kubernetes project.  Your cluster administrator may have
customized the behavior in your cluster, in which case this documentation may
not apply.
-->

本文档描述 Kubernetes 项目推荐的集群中服务帐户的行为。
集群管理员也可能已经定制了服务账户在集群中的属性，在这种情况下，本文档可能并不适用。

{{< /note >}}

<!--
When you (a human) access the cluster (for example, using `kubectl`), you are
authenticated by the apiserver as a particular User Account (currently this is
usually `admin`, unless your cluster administrator has customized your
cluster).  Processes in containers inside pods can also contact the apiserver.
When they do, they are authenticated as a particular Service Account (for example,
`default`).
-->

当您（人类）访问集群时（例如，使用 `kubectl`），api 服务器将您的身份验证为特定的用户帐户（当前这通常是 `admin`，除非您的集群管理员已经定制了您的集群配置）。
Pod 内的容器中的进程也可以与 api 服务器接触。
当它们进行身份验证时，它们被验证为特定的服务帐户（例如，`default`）。



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

<!--
## Use the Default Service Account to access the API server.

When you create a pod, if you do not specify a service account, it is
automatically assigned the `default` service account in the same namespace.
If you get the raw json or yaml for a pod you have created (for example, `kubectl get pods/podname -o yaml`),
you can see the `spec.serviceAccountName` field has been
[automatically set](/docs/user-guide/working-with-resources/#resources-are-automatically-modified).
-->

## 使用默认的服务账户访问 API 服务器

当您创建 Pod 时，如果没有指定服务账户，Pod 会被指定命名空间中的`default`服务账户。
如果您查看 Pod 的原始 json 或 yaml（例如：`kubectl get pods/podname -o yaml`），
您可以看到 `spec.serviceAccountName` 字段已经被[自动设置](/docs/user-guide/working-with-resources/#resources-are-automatically-modified)了。

<!--
You can access the API from inside a pod using automatically mounted service account credentials,
as described in [Accessing the Cluster](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod).
The API permissions of the service account depend on the [authorization plugin and policy](/docs/reference/access-authn-authz/authorization/#authorization-modules) in use.

In version 1.6+, you can opt out of automounting API credentials for a service account by setting
`automountServiceAccountToken: false` on the service account:
-->

您可以使用自动挂载给 Pod 的服务账户凭据访问 API，[访问集群](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod) 中有相关描述。
服务账户的 API 许可取决于您所使用的[授权插件和策略](/docs/reference/access-authn-authz/authorization/#authorization-modules)。

在 1.6 以上版本中，您可以通过在服务账户上设置 `automountServiceAccountToken: false` 来实现不给服务账号自动挂载 API 凭据：


```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
automountServiceAccountToken: false
...
```

<!--
In version 1.6+, you can also opt out of automounting API credentials for a particular pod:
-->

在 1.6 以上版本中，您也可以选择不给特定 Pod 自动挂载 API 凭据：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-pod
spec:
  serviceAccountName: build-robot
  automountServiceAccountToken: false
  ...
```

<!--
The pod spec takes precedence over the service account if both specify a `automountServiceAccountToken` value.

## Use Multiple Service Accounts.

Every namespace has a default service account resource called `default`.
You can list this and any other serviceAccount resources in the namespace with this command:
-->

如果 Pod 和服务账户都指定了 `automountServiceAccountToken` 值，则 Pod 的 spec 优先于服务帐户。

## 使用多个服务账户

每个命名空间都有一个名为 `default` 的服务账户资源。
您可以用下面的命令查询这个服务账户以及命名空间中的其他 serviceAccount 资源：

```shell
kubectl get serviceAccounts
NAME      SECRETS    AGE
default   1          1d
```

<!--
You can create additional ServiceAccount objects like this:
-->

您可以像这样来创建额外的 ServiceAccount 对象：

```shell
kubectl create -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
serviceaccount/build-robot created
```

<!--
If you get a complete dump of the service account object, like this:
-->

如果您查询服务帐户对象的完整信息，如下所示：

```shell
kubectl get serviceaccounts/build-robot -o yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-06-16T00:12:59Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
secrets:
- name: build-robot-token-bvbk5
```

<!--
then you will see that a token has automatically been created and is referenced by the service account.

You may use authorization plugins to [set permissions on service accounts](/docs/reference/access-authn-authz/rbac/#service-account-permissions).

To use a non-default service account, simply set the `spec.serviceAccountName`
field of a pod to the name of the service account you wish to use.
-->

那么您就能看到系统已经自动创建了一个令牌并且被服务账户所引用。

您可以使用授权插件来 [设置服务账户的访问许可](/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

要使用非默认的服务账户，只需简单的将 Pod 的 `spec.serviceAccountName` 字段设置为您想用的服务账户名称。

<!--
The service account has to exist at the time the pod is created, or it will be rejected.

You cannot update the service account of an already created pod.

You can clean up the service account from this example like this:
-->

Pod 被创建时服务账户必须存在，否则会被拒绝。

您不能更新已经创建好的 Pod 的服务账户。

您可以清除服务账户，如下所示：

```shell
kubectl delete serviceaccount/build-robot
```

<!--
## Manually create a service account API token.

Suppose we have an existing service account named "build-robot" as mentioned above, and we create
a new secret manually.
-->

## 手动创建服务账户 API 令牌

假设我们有一个上面提到的名为 "build-robot" 的服务账户，然后我们手动创建一个新的 Secret。

```shell
kubectl create -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations:
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
secret/build-robot-secret created
```

<!--
Now you can confirm that the newly built secret is populated with an API token for the "build-robot" service account.

Any tokens for non-existent service accounts will be cleaned up by the token controller.
-->

现在，您可以确认新构建的 Secret 中填充了 "build-robot" 服务帐户的 API 令牌。

令牌控制器将清理不存在的服务帐户的所有令牌。

```shell
kubectl describe secrets/build-robot-secret
Name:           build-robot-secret
Namespace:      default
Labels:         <none>
Annotations:    kubernetes.io/service-account.name=build-robot
                kubernetes.io/service-account.uid=da68f9c6-9d26-11e7-b84e-002dc52800da

Type:   kubernetes.io/service-account-token

Data
====
ca.crt:         1338 bytes
namespace:      7 bytes
token:          ...
```

{{< note >}}
<!--
The content of `token` is elided here.
-->
这里省略了 `token` 的内容。
{{< /note >}}

<!--
## Add ImagePullSecrets to a service account

First, create an imagePullSecret, as described [here](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
Next, verify it has been created.  For example:
-->

## 为服务账户添加 ImagePullSecrets

首先，创建一个 ImagePullSecrets，可以参考[这里](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod) 的描述。
然后，确认创建是否成功。例如：

```shell
kubectl get secrets myregistrykey
NAME             TYPE                              DATA    AGE
myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
```
<!--
Next, modify the default service account for the namespace to use this secret as an imagePullSecret.
-->

接着修改命名空间的默认服务帐户，以将该 Secret 用作 imagePullSecret。

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

<!--
Interactive version requiring manual edit:
-->

需要手动编辑的交互式版本：

```shell
kubectl get serviceaccounts default -o yaml > ./sa.yaml

cat sa.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge

vi sa.yaml
[editor session not shown]
[delete line with key "resourceVersion"]
[add lines with "imagePullSecrets:"]

cat sa.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
imagePullSecrets:
- name: myregistrykey

kubectl replace serviceaccount default -f ./sa.yaml
serviceaccounts/default
```

<!--
Now, any new pods created in the current namespace will have this added to their spec:
-->

现在，在当前命名空间中创建的每个新 Pod 的 spec 中都会添加下面的内容：

```yaml
spec:
  imagePullSecrets:
  - name: myregistrykey
```

<!--## Adding Secrets to a service account.

TODO: Test and explain how to use additional non-K8s secrets with an existing service account.
-->

<!--
## Service Account Token Volume Projection
-->

## 服务帐户令牌卷投影

{{< feature-state for_k8s_version="v1.12" state="beta" >}}

{{< note >}}
<!--
This ServiceAccountTokenVolumeProjection is __beta__ in 1.12 and
enabled by passing all of the following flags to the API server:

* `--service-account-issuer`
* `--service-account-signing-key-file`
* `--service-account-api-audiences`
-->

ServiceAccountTokenVolumeProjection 在 1.12 版本中是 __beta__ 阶段，可以通过向 API 服务器传递以下所有参数来启用它：

* `--service-account-issuer`
* `--service-account-signing-key-file`
* `--service-account-api-audiences`

{{< /note >}}

<!--
The kubelet can also project a service account token into a Pod. You can
specify desired properties of the token, such as the audience and the validity
duration. These properties are not configurable on the default service account
token. The service account token will also become invalid against the API when
the Pod or the ServiceAccount is deleted.
-->

kubelet 还可以将服务帐户令牌投影到 Pod 中。
您可以指定令牌的所需属性，例如受众和有效持续时间。
这些属性在默认服务帐户令牌上无法配置。
当删除 Pod 或 ServiceAccount 时，服务帐户令牌也将对 API 无效。

<!--
This behavior is configured on a PodSpec using a ProjectedVolume type called
[ServiceAccountToken](/docs/concepts/storage/volumes/#projected). To provide a
pod with a token with an audience of "vault" and a validity duration of two
hours, you would configure the following in your PodSpec:
-->

使用名为 [ServiceAccountToken](/docs/concepts/storage/volumes/#projected) 的 ProjectedVolume 类型在 PodSpec 上配置此功能。
要向 Pod 提供具有 "vault" 观众以及两个小时有效期的令牌，可以在 PodSpec 中配置以下内容：

```yaml
kind: Pod
apiVersion: v1
spec:
  containers:
  - image: nginx
    name: nginx
    volumeMounts:
    - mountPath: /var/run/secrets/tokens
      name: vault-token
  volumes:
  - name: vault-token
    projected:
      sources:
      - serviceAccountToken:
          path: vault-token
          expirationSeconds: 7200
          audience: vault
```

<!--
The kubelet will request and store the token on behalf of the pod, make the
token available to the pod at a configurable file path, and refresh the token as
it approaches expiration. Kubelet proactively rotates the token if it is older
than 80% of its total TTL, or if the token is older than 24 hours.

The application is responsible for reloading the token when it rotates. Periodic
reloading (e.g. once every 5 minutes) is sufficient for most usecases.
-->

Kubelet 将代表 Pod 请求和存储令牌，使令牌在可配置的文件路径上对 Pod 可用，并在令牌接近到期时刷新令牌。
如果令牌存活时间大于其总 TTL 的 80% 或者大于 24 小时，Kubelet 则会主动旋转令牌。

应用程序负责在令牌旋转时重新加载令牌。
对于大多数情况，定期重新加载（例如，每 5 分钟一次）就足够了。


