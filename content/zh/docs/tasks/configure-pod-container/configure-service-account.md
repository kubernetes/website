---
title: 为 Pod 配置服务账户
content_type: task
weight: 90
---
<!--
reviewers:
- bprashanth
- liggitt
- thockin
title: Configure Service Accounts for Pods
content_type: task
weight: 90
-->

<!-- overview -->

<!--
A service account provides an identity for processes that run in a Pod.

This document is a user introduction to Service Accounts and describes how service accounts behave in a cluster set up
as recommended by the Kubernetes project. Your cluster administrator may have
customized the behavior in your cluster, in which case this documentation may
not apply.
-->
服务账户为 Pod 中运行的进程提供了一个标识。

{{< note >}}
本文是服务账户的用户使用介绍，描述服务账号在集群中如何起作用。
你的集群管理员可能已经对你的集群做了定制，因此导致本文中所讲述的内容并不适用。
{{< /note >}}

<!--
When you (a human) access the cluster (for example, using `kubectl`), you are
authenticated by the apiserver as a particular User Account (currently this is
usually `admin`, unless your cluster administrator has customized your
cluster).  Processes in containers inside pods can also contact the apiserver.
When they do, they are authenticated as a particular Service Account (for example,
`default`).
-->
当你（自然人）访问集群时（例如，使用 `kubectl`），API 服务器将你的身份验证为
特定的用户帐户（当前这通常是 `admin`，除非你的集群管理员已经定制了你的集群配置）。
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

当你创建 Pod 时，如果没有指定服务账户，Pod 会被指定给命名空间中的 `default` 服务账户。
如果你查看 Pod 的原始 JSON 或 YAML（例如：`kubectl get pods/podname -o yaml`），
你可以看到 `spec.serviceAccountName` 字段已经被自动设置了。

<!--
You can access the API from inside a pod using automatically mounted service account credentials,
as described in [Accessing the Cluster](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod).
The API permissions of the service account depend on the [authorization plugin and policy](/docs/reference/access-authn-authz/authorization/#authorization-modules) in use.

In version 1.6+, you can opt out of automounting API credentials for a service account by setting
`automountServiceAccountToken: false` on the service account:
-->
你可以使用自动挂载给 Pod 的服务账户凭据访问 API，
[访问集群](/zh/docs/tasks/access-application-cluster/access-cluster/#accessing-the-api-from-a-pod)
中有相关描述。
服务账户的 API 许可取决于你所使用的
[鉴权插件和策略](/zh/docs/reference/access-authn-authz/authorization/#authorization-modules)。

在 1.6 以上版本中，你可以通过在服务账户上设置 `automountServiceAccountToken: false`
来实现不给服务账号自动挂载 API 凭据：


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
在 1.6 以上版本中，你也可以选择不给特定 Pod 自动挂载 API 凭据：

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
-->
如果 Pod 和服务账户都指定了 `automountServiceAccountToken` 值，则 Pod 的 spec 优先于服务帐户。

<!--
## Use Multiple Service Accounts.

Every namespace has a default service account resource called `default`.
You can list this and any other serviceAccount resources in the namespace with this command:
-->
## 使用多个服务账户   {#use-multiple-service-accounts}

每个命名空间都有一个名为 `default` 的服务账户资源。
你可以用下面的命令查询这个服务账户以及命名空间中的其他 ServiceAccount 资源：

```shell
kubectl get serviceAccounts
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME      SECRETS    AGE
default   1          1d
```

<!--
You can create additional ServiceAccount objects like this:
-->
你可以像这样来创建额外的 ServiceAccount 对象：

```shell
kubectl create -f - <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
```

<!--
The name of a ServiceAccount object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
ServiceAccount 对象的名字必须是一个有效的
[DNS 子域名](/zh/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

<!--
If you get a complete dump of the service account object, like this:
-->
如果你查询服务帐户对象的完整信息，如下所示：

```shell
kubectl get serviceaccounts/build-robot -o yaml
```

<!--
The output is similar to this:
-->
输出类似于：

```yaml
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
那么你就能看到系统已经自动创建了一个令牌并且被服务账户所引用。

你可以使用授权插件来
[设置服务账户的访问许可](/zh/docs/reference/access-authn-authz/rbac/#service-account-permissions)。

要使用非默认的服务账户，只需简单的将 Pod 的 `spec.serviceAccountName` 字段设置为你想用的服务账户名称。

<!--
The service account has to exist at the time the pod is created, or it will be rejected.

You cannot update the service account of an already created pod.

You can clean up the service account from this example like this:
-->
Pod 被创建时服务账户必须存在，否则会被拒绝。

你不能更新已经创建好的 Pod 的服务账户。

你可以清除服务账户，如下所示：

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
现在，你可以确认新构建的 Secret 中填充了 "build-robot" 服务帐户的 API 令牌。

令牌控制器将清理不存在的服务帐户的所有令牌。

```shell
kubectl describe secrets/build-robot-secret
```

<!--
The output is similar to this:
-->
输出类似于：

```
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

<!--
The content of `token` is elided here.
-->
{{< note >}}
这里省略了 `token` 的内容。
{{< /note >}}

<!--
## Add ImagePullSecrets to a service account

### Create an imagePullSecret

- Create an imagePullSecret, as described in [Specifying ImagePullSecret on a Pod](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod).
-->
## 为服务账户添加 ImagePullSecrets  {#add-imagepullsecrets-to-a-service-account}

### 创建 ImagePullSecret

- 创建一个 ImagePullSecret，如同[为 Pod 设置 ImagePullSecret](/zh/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)所述。

  ```shell
  kubectl create secret docker-registry myregistrykey --docker-server=DUMMY_SERVER \
            --docker-username=DUMMY_USERNAME --docker-password=DUMMY_DOCKER_PASSWORD \
            --docker-email=DUMMY_DOCKER_EMAIL
  ```

<!--
- Verify it has been created.
-->
- 确认创建成功：

  ```shell
  kubectl get secrets myregistrykey
  ```
  
  <!-- The output is similar to this: -->
  输出类似于：

   ```
   NAME             TYPE                              DATA    AGE
   myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
   ```

<!--
### Add image pull secret to service account

Next, modify the default service account for the namespace to use this secret as an imagePullSecret.
-->
### 将镜像拉取 Secret 添加到服务账号

接着修改命名空间的 `default` 服务帐户，以将该 Secret 用作 imagePullSecret。

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'
```

<!--
You can instead use `kubectl edit`, or manually edit the YAML manifests as shown below:
-->
你也可以使用 `kubectl edit`，或者如下所示手动编辑 YAML 清单：

```shell
kubectl get serviceaccounts default -o yaml > ./sa.yaml
```

`sa.yaml` 文件的内容类似于：

```yaml
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
```

<!--
Using your editor of choice (for example `vi`), open the `sa.yaml` file, delete line with key `resourceVersion`, add lines with `imagePullSecrets:` and save.

The output of the `sa.yaml` file is similar to this:
-->
使用你常用的编辑器（例如 `vi`），打开 `sa.yaml` 文件，删除带有键名
`resourceVersion` 的行，添加带有 `imagePullSecrets:` 的行，最后保存文件。

所得到的 `sa.yaml` 文件类似于：

```yaml
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
```

<!--
Finally replace the serviceaccount with the new updated `sa.yaml` file
-->
最后，用新的更新的 `sa.yaml` 文件替换服务账号。

```shell
kubectl replace serviceaccount default -f ./sa.yaml
```

<!--
### Verify imagePullSecrets was added to pod spec

Now, when a new Pod is created in the current namespace and using the default ServiceAccount, the new Pod has its  `spec.imagePullSecrets` field set automatically:
-->
### 验证镜像拉取 Secret 已经被添加到 Pod 规约

现在，在当前命名空间中创建的每个使用默认服务账号的新 Pod，新 Pod 都会自动
设置其 `.spec.imagePullSecrets` 字段：

```shell
kubectl run nginx --image=nginx --restart=Never
kubectl get pod nginx -o=jsonpath='{.spec.imagePullSecrets[0].name}{"\n"}'
```

<!-- The output is: -->
输出为：

```
myregistrykey
```

<!--
## Service Account Token Volume Projection
-->
## 服务帐户令牌卷投射   {#service-account-token-volume-projection}

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!--
To enable and use token request projection, you must specify each of the following
command line arguments to `kube-apiserver`:

* `--service-account-issuer`
* `--service-account-key-file`
* `--service-account-signing-key-file`
* `--api-audiences`

-->
{{< note >}}
为了启用令牌请求投射，你必须为 `kube-apiserver` 设置以下命令行参数：

* `--service-account-issuer`
* `--service-account-key-file`
* `--service-account-signing-key-file`
* `--api-audiences`

{{< /note >}}

<!--
The kubelet can also project a service account token into a Pod. You can
specify desired properties of the token, such as the audience and the validity
duration. These properties are not configurable on the default service account
token. The service account token will also become invalid against the API when
the Pod or the ServiceAccount is deleted.
-->
kubelet 还可以将服务帐户令牌投影到 Pod 中。
你可以指定令牌的所需属性，例如受众和有效持续时间。
这些属性在默认服务帐户令牌上无法配置。
当删除 Pod 或 ServiceAccount 时，服务帐户令牌也将对 API 无效。

<!--
This behavior is configured on a PodSpec using a ProjectedVolume type called
[ServiceAccountToken](/docs/concepts/storage/volumes/#projected). To provide a
pod with a token with an audience of "vault" and a validity duration of two
hours, you would configure the following in your PodSpec:
-->
使用名为 [ServiceAccountToken](/zh/docs/concepts/storage/volumes/#projected) 的
ProjectedVolume 类型在 PodSpec 上配置此功能。
要向 Pod 提供具有 "vault" 用户以及两个小时有效期的令牌，可以在 PodSpec 中配置以下内容：

{{< codenew file="pods/pod-projected-svc-token.yaml" >}}

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl create -f https://k8s.io/examples/pods/pod-projected-svc-token.yaml
```

<!--
The kubelet will request and store the token on behalf of the pod, make the
token available to the pod at a configurable file path, and refresh the token as it approaches expiration. 
The kubelet proactively rotates the token if it is older than 80% of its total TTL, or if the token is older than 24 hours.

The application is responsible for reloading the token when it rotates. Periodic reloading (e.g. once every 5 minutes) is sufficient for most use cases.
-->
`kubelet` 组件会替 Pod 请求令牌并将其保存起来，通过将令牌存储到一个可配置的
路径使之在 Pod 内可用，并在令牌快要到期的时候刷新它。
`kubelet` 会在令牌存在期达到其 TTL 的 80% 的时候或者令牌生命期超过 24 小时
的时候主动轮换它。

应用程序负责在令牌被轮换时重新加载其内容。对于大多数使用场景而言，周期性地
（例如，每隔 5 分钟）重新加载就足够了。

<!--
## Service Account Issuer Discovery
-->
## 发现服务账号分发者

{{< feature-state for_k8s_version="v1.20" state="beta" >}}

<!--
The Service Account Issuer Discovery feature is enabled by enabling the
`ServiceAccountIssuerDiscovery` [feature gate](/docs/reference/command-line-tools-reference/feature-gates)
and then enabling the Service Account Token Projection feature as described
[above](#service-account-token-volume-projection).
-->
通过启用 `ServiceAccountIssuerDiscovery`
[特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates)，
并按[前文所述](#service-account-token-volume-projection)启用服务账号令牌投射，
可以启用发现服务账号分发者（Service Account Issuer Discovery）这一功能特性。

<!--
The issuer URL must comply with the
[OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html). In
practice, this means it must use the `https` scheme, and should serve an OpenID
provider configuration at `{service-account-issuer}/.well-known/openid-configuration`.

If the URL does not comply, the `ServiceAccountIssuerDiscovery` endpoints will
not be registered, even if the feature is enabled.
-->
{{< note >}}
分发者的 URL 必须遵从
[OIDC 发现规范](https://openid.net/specs/openid-connect-discovery-1_0.html)。
这意味着 URL 必须使用 `https` 模式，并且必须在
`{service-account-issuer}/.well-known/openid-configuration`
路径提供 OpenID 提供者（Provider）配置。

如果 URL 没有遵从这一规范，`ServiceAccountIssuerDiscovery` 末端就不会被注册，
即使该特性已经被启用。
{{< /note >}}

<!--
The Service Account Issuer Discovery feature enables federation of Kubernetes
service account tokens issued by a cluster (the _identity provider_) with
external systems (_relying parties_).

When enabled, the Kubernetes API server provides an OpenID Provider
Configuration document at `/.well-known/openid-configuration` and the associated
JSON Web Key Set (JWKS) at `/openid/v1/jwks`. The OpenID Provider Configuration
is sometimes referred to as the _discovery document_.
-->
发现服务账号分发者这一功能使得用户能够用联邦的方式结合使用 Kubernetes 
集群（_Identity Provider_，标识提供者）与外部系统（_relying parties_，
依赖方）所分发的服务账号令牌。

当此功能被启用时，Kubernetes API 服务器会在 `/.well-known/openid-configuration`
提供一个 OpenID 提供者配置文档，并在 `/openid/v1/jwks` 处提供与之关联的
JSON Web Key Set（JWKS）。
这里的 OpenID 提供者配置有时候也被称作 _发现文档（Discovery Document）_。

<!--
When enabled, the cluster is also configured with a default RBAC ClusterRole
called `system:service-account-issuer-discovery`. No role bindings are provided
by default. Administrators may, for example, choose whether to bind the role to
`system:authenticated` or `system:unauthenticated` depending on their security
requirements and which external systems they intend to federate with.
-->
特性被启用时，集群也会配置名为 `system:service-account-issuer-discovery`
的默认 RBAC ClusterRole，但默认情况下不提供角色绑定对象。
举例而言，管理员可以根据其安全性需要以及期望集成的外部系统选择是否将该角色绑定到
`system:authenticated` 或 `system:unauthenticated`。

<!--
The responses served at `/.well-known/openid-configuration` and
`/openid/v1/jwks` are designed to be OIDC compatible, but not strictly OIDC
compliant. Those documents contain only the parameters necessary to perform
validation of Kubernetes service account tokens.
-->
{{< note >}}
对 `/.well-known/openid-configuration` 和 `/openid/v1/jwks` 路径请求的响应
被设计为与 OIDC 兼容，但不是完全与其一致。
返回的文档仅包含对 Kubernetes 服务账号令牌进行验证所必须的参数。
{{< /note >}}

<!--
The JWKS response contains public keys that a relying party can use to validate
the Kubernetes service account tokens. Relying parties first query for the
OpenID Provider Configuration, and use the `jwks_uri` field in the response to
find the JWKS.
-->
JWKS 响应包含依赖方可以用来验证 Kubernetes 服务账号令牌的公钥数据。
依赖方先会查询 OpenID 提供者配置，之后使用返回响应中的 `jwks_uri` 来查找
JWKS。

<!--
In many cases, Kubernetes API servers are not available on the public internet,
but public endpoints that serve cached responses from the API server can be made
available by users or service providers. In these cases, it is possible to
override the `jwks_uri` in the OpenID Provider Configuration so that it points
to the public endpoint, rather than the API server's address, by passing the
`--service-account-jwks-uri` flag to the API server. Like the issuer URL, the
JWKS URI is required to use the `https` scheme.
-->
在很多场合，Kubernetes API 服务器都不会暴露在公网上，不过对于缓存并向外提供 API
服务器响应数据的公开末端而言，用户或者服务提供商可以选择将其暴露在公网上。
在这种环境中，可能会重载 OpenID 提供者配置中的
`jwks_uri`，使之指向公网上可用的末端地址，而不是 API 服务器的地址。
这时需要向 API 服务器传递 `--service-account-jwks-uri` 参数。
与分发者 URL 类似，此 JWKS URI 也需要使用 `https` 模式。


## {{% heading "whatsnext" %}}

<!--
See also:

- [Cluster Admin Guide to Service Accounts](/docs/reference/access-authn-authz/service-accounts-admin/)
- [Service Account Signing Key Retrieval KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/20190730-oidc-discovery.md)
- [OIDC Discovery Spec](https://openid.net/specs/openid-connect-discovery-1_0.html)
-->
另请参见：

- [服务账号的集群管理员指南](/zh/docs/reference/access-authn-authz/service-accounts-admin/)
- [服务账号签署密钥检索 KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/20190730-oidc-discovery.md)
- [OIDC 发现规范](https://openid.net/specs/openid-connect-discovery-1_0.html)
