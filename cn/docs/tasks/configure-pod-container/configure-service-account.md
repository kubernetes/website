---
assignees:
- bprashanth
- liggitt
- thockin
title: 配置Pod的Service Account
redirect_from:
- "/docs/user-guide/service-accounts/"
- "/docs/user-guide/service-accounts.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- rootsongjc
---
<!--
A service account provides an identity for processes that run in a Pod.
-->
Service account为Pod中的进程提供身份信息。
<!--
*This is a user introduction to Service Accounts.  See also the
[Cluster Admin Guide to Service Accounts](/docs/admin/service-accounts-admin).*
-->
*本文是关于 Service Account 的用户指南，管理指南另见 [Service Account 的集群管理指南](/docs/admin/service-accounts-admin) 。*

<!--
*Note: This document describes how service accounts behave in a cluster set up
as recommended by the Kubernetes project.  Your cluster administrator may have
customized the behavior in your cluster, in which case this documentation may
not apply.*
-->
*注意：本文档描述的关于 Serivce Account 的行为只有当您按照 Kubernetes 项目建议的方式搭建起集群的情况下才有效。您的集群管理员可能在您的集群中有自定义配置，这种情况下该文档可能并不适用。*
<!--
When you (a human) access the cluster (e.g. using `kubectl`), you are
authenticated by the apiserver as a particular User Account (currently this is
usually `admin`, unless your cluster administrator has customized your
cluster).  Processes in containers inside pods can also contact the apiserver.
When they do, they are authenticated as a particular Service Account (e.g.
`default`).
-->
当您（真人用户）访问集群（例如使用`kubectl`命令）时，apiserver 会将您认证为一个特定的 User Account（目前通常是`admin`，除非您的系统管理员自定义了集群配置）。Pod 容器中的进程也可以与 apiserver 联系。 当它们在联系 apiserver 的时候，它们会被认证为一个特定的 Service Account（例如`default`）。
<!--

## Use the Default Service Account to access the API server.

When you create a pod, if you do not specify a service account, it is
automatically assigned the `default` service account in the same namespace.
If you get the raw json or yaml for a pod you have created (e.g. `kubectl get pods/podname -o yaml`),
you can see the `spec.serviceAccountName` field has been
[automatically set](/docs/user-guide/working-with-resources/#resources-are-automatically-modified).
-->
## 使用默认的 Service Account 访问 API server

当您创建 pod 的时候，如果您没有指定一个 service account，系统会自动得在与该pod 相同的 namespace 下为其指派一个`default` service account。如果您获取刚创建的 pod 的原始 json 或 yaml 信息（例如使用`kubectl get pods/podename -o yaml`命令），您将看到`spec.serviceAccountName`字段已经被设置为 [automatically set](/docs/user-guide/working-with-resources/#resources-are-automatically-modified) 。
<!--
You can access the API from inside a pod using automatically mounted service account credentials,
as described in [Accessing the Cluster](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod).
The API permissions a service account has depend on the [authorization plugin and policy](/docs/admin/authorization/#a-quick-note-on-service-accounts) in use.

In version 1.6+, you can opt out of automounting API credentials for a service account by setting
`automountServiceAccountToken: false` on the service account:
-->
您可以在 pod 中使用自动挂载的 service account 凭证来访问 API，如 [Accessing the Cluster](/docs/user-guide/accessing-the-cluster/#accessing-the-api-from-a-pod) 中所描述。

Service account 是否能够取得访问 API 的许可取决于您使用的 [授权插件和策略](/docs/admin/authorization/#a-quick-note-on-service-accounts)。

在 1.6 以上版本中，您可以选择取消为 serivce account 自动挂载 API 凭证，只需在 service account 中设置 `automountServiceAccountToken: false`：

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
在 1.6 以上版本中，您也可以选择只取消单个 pod 的 API 凭证自动挂载：

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
如果在 pod 和 service account 中同时设置了 `automountServiceAccountToken` , pod 设置中的优先级更高。
<!--
## Use Multiple Service Accounts.

Every namespace has a default service account resource called `default`.
You can list this and any other serviceAccount resources in the namespace with this command:
-->
## 使用多个Service Account

每个 namespace 中都有一个默认的叫做 `default` 的 service account 资源。

您可以使用以下命令列出 namespace 下的所有 serviceAccount 资源。

```shell
$ kubectl get serviceAccounts
NAME      SECRETS    AGE
default   1          1d
```
<!--
You can create additional ServiceAccount objects like this:
-->
您可以像这样创建一个 ServiceAccount 对象：

```shell
$ cat > /tmp/serviceaccount.yaml <<EOF
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
EOF
$ kubectl create -f /tmp/serviceaccount.yaml
serviceaccount "build-robot" created
```
<!--
If you get a complete dump of the service account object, like this:
-->
如果您看到如下的 service account 对象的完整输出信息：

```shell
$ kubectl get serviceaccounts/build-robot -o yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-06-16T00:12:59Z
  name: build-robot
  namespace: default
  resourceVersion: "272500"
  selfLink: /api/v1/namespaces/default/serviceaccounts/build-robot
  uid: 721ab723-13bc-11e5-aec2-42010af0021e
secrets:
- name: build-robot-token-bvbk5
```
<!--
then you will see that a token has automatically been created and is referenced by the service account.

You may use authorization plugins to [set permissions on service accounts](/docs/admin/authorization/#a-quick-note-on-service-accounts).

To use a non-default service account, simply set the `spec.serviceAccountName`
field of a pod to the name of the service account you wish to use.

The service account has to exist at the time the pod is created, or it will be rejected.

You cannot update the service account of an already created pod.

You can clean up the service account from this example like this:
-->
然后您将看到有一个 token 已经被自动创建，并被 service account 引用。

您可以使用授权插件来 [设置 service account 的权限](/docs/admin/authorization/#a-quick-note-on-service-accounts) 。

设置非默认的 service account，只需要在 pod 的`spec.serviceAccountName` 字段中将name设置为您想要用的 service account 名字即可。

在 pod 创建之初 service account 就必须已经存在，否则创建将被拒绝。

您不能更新已创建的 pod 的 service account。

您可以清理 service account，如下所示：

```shell
$ kubectl delete serviceaccount/build-robot
```
<!--
## Manually create a service account API token.

Suppose we have an existing service account named "build-robot" as mentioned above, and we create
a new secret manually.
-->
## 手动创建 service account 的 API token

假设我们已经有了一个如上文提到的名为 ”build-robot“ 的 service account，我们手动创建一个新的 secret。

```shell
$ cat > /tmp/build-robot-secret.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: build-robot-secret
  annotations: 
    kubernetes.io/service-account.name: build-robot
type: kubernetes.io/service-account-token
EOF
$ kubectl create -f /tmp/build-robot-secret.yaml
secret "build-robot-secret" created
```
<!--
Now you can confirm that the newly built secret is populated with an API token for the "build-robot" service account.

Any tokens for non-existent service accounts will be cleaned up by the token controller.
-->
现在您可以确认下新创建的 secret 取代了 "build-robot" 这个 service account 原来的 API token。

所有已不存在的 service account 的 token 将被 token controller 清理掉。

```shell
$ kubectl describe secrets/build-robot-secret 
Name:   build-robot-secret
Namespace:  default
Labels:   <none>
Annotations:  kubernetes.io/service-account.name=build-robot,kubernetes.io/service-account.uid=870ef2a5-35cf-11e5-8d06-005056b45392

Type: kubernetes.io/service-account-token

Data
====
ca.crt: 1220 bytes
token: ...
namespace: 7 bytes
```
<!--

> Note that the content of `token` is elided here.

-->

> 注意该内容中的`token`被省略了。


<!--
## Add ImagePullSecrets to a service account

First, create an imagePullSecret, as described [here](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)
Next, verify it has been created.  For example:
-->
## 为 service account 添加 ImagePullSecret

首先，创建一个 imagePullSecret，详见[这里](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod)。

然后，确认已创建。如：

```shell
$ kubectl get secrets myregistrykey
NAME             TYPE                              DATA    AGE
myregistrykey    kubernetes.io/.dockerconfigjson   1       1d
```
<!--
Next, modify the default service account for the namespace to use this secret as an imagePullSecret.
-->

然后，修改 namespace 中的默认 service account 使用该 secret 作为 imagePullSecret。

```shell
kubectl patch serviceaccount default -p '{"imagePullSecrets": [{"name": "myregistrykey"}]}'

```
<!--
Interactive version requiring manual edit:
-->
Vi 交互过程中需要手动编辑：

```shell
$ kubectl get serviceaccounts default -o yaml > ./sa.yaml
$ cat sa.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  resourceVersion: "243024"
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
$ vi sa.yaml
[editor session not shown]
[delete line with key "resourceVersion"]
[add lines with "imagePullSecret:"]
$ cat sa.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  creationTimestamp: 2015-08-07T22:02:39Z
  name: default
  namespace: default
  selfLink: /api/v1/namespaces/default/serviceaccounts/default
  uid: 052fb0f4-3d50-11e5-b066-42010af0d7b6
secrets:
- name: default-token-uudge
imagePullSecrets:
- name: myregistrykey
$ kubectl replace serviceaccount default -f ./sa.yaml
serviceaccounts/default
```
<!--
Now, any new pods created in the current namespace will have this added to their spec:
-->
现在，所有当前 namespace 中新创建的 pod 的 spec 中都会增加如下内容：

```yaml
spec:
  imagePullSecrets:
  - name: myregistrykey
```

<!--## Adding Secrets to a service account.

TODO: Test and explain how to use additional non-K8s secrets with an existing service account.
-->
