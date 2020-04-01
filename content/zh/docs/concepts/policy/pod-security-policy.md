---
approvers:
- pweil-
title: Pod 安全策略
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state state="beta" >}}

<!-- 
Pod Security Policies enable fine-grained authorization of pod creation and
updates. 
-->
PodSecurityPolicy支持针对 pod 创建和更新的精细的权限控制。

{{% /capture %}}

{{% capture body %}}


<!-- 
## What is a Pod Security Policy?
-->
## 什么是 PodSecurityPolicy？

<!-- 
A _Pod Security Policy_ is a cluster-level resource that controls security
sensitive aspects of the pod specification. The [PodSecurityPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicy-v1beta1-policy) objects
define a set of conditions that a pod must run with in order to be accepted into
the system, as well as defaults for the related fields. They allow an
administrator to control the following:
-->
_PodSecurityPolicy_ 是集群级别的资源，它能够控制 Pod 规范中对安全敏感的方面。
[PodSecurityPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicy-v1beta1-policy) 
对象定义了一组条件，指示 Pod 必须按系统所能接受的顺序运行，以及相关字段的默认值。
它们允许管理员控制如下方面：

<!-- 
| Control Aspect                                      | Field Names                                 |
| ----------------------------------------------------| ------------------------------------------- |
| Running of privileged containers                    | [`privileged`](#privileged)                                |
| Usage of host namespaces                            | [`hostPID`, `hostIPC`](#host-namespaces)    |
| Usage of host networking and ports                  | [`hostNetwork`, `hostPorts`](#host-namespaces) |
| Usage of volume types                               | [`volumes`](#volumes-and-file-systems)      |
| Usage of the host filesystem                        | [`allowedHostPaths`](#volumes-and-file-systems) |
| White list of FlexVolume drivers                    | [`allowedFlexVolumes`](#flexvolume-drivers) |
| Allocating an FSGroup that owns the pod's volumes   | [`fsGroup`](#volumes-and-file-systems)      |
| Requiring the use of a read only root file system   | [`readOnlyRootFilesystem`](#volumes-and-file-systems) |
| The user and group IDs of the container             | [`runAsUser`, `runAsGroup`, `supplementalGroups`](#users-and-groups) |
| Restricting escalation to root privileges           | [`allowPrivilegeEscalation`, `defaultAllowPrivilegeEscalation`](#privilege-escalation) |
| Linux capabilities                                  | [`defaultAddCapabilities`, `requiredDropCapabilities`, `allowedCapabilities`](#capabilities) |
| The SELinux context of the container                | [`seLinux`](#selinux)                       |
| The Allowed Proc Mount types for the container      | [`allowedProcMountTypes`](#allowedprocmounttypes) |
| The AppArmor profile used by containers             | [annotations](#apparmor)                    |
| The seccomp profile used by containers              | [annotations](#seccomp)                     |
| The sysctl profile used by containers               | [`forbiddenSysctls`,`allowedUnsafeSysctls`](#sysctl)                      |

-->
| 控制面                          | 字段名称                                                                                      |
|--------------------------------|----------------------------------------------------------------------------------------------|
| 已授权容器的运行                  | [`privileged`](#privileged)                                                                  |
| 主机 PID namespace 的使用        | [`hostPID`, `hostIPC`](#host-namespaces)                                                     |
| 主机网络的使用                   | [`hostNetwork`,`hostPorts`](#host-namespaces)                                                |
| 控制卷类型的使用                 | [`volumes`](#volumes-and-file-systems)                                                       |
| 主机路径的使用                   | [`allowedHostPaths`](#volumes-and-file-systems)                                              |
| FlexVolume 卷驱动的白名单        | [`allowedFlexVolumes`](#flexvolume-drivers)                                                  |
| 分配拥有 Pod 数据卷的 FSGroup    | [`fsGroup`](#volumes-and-file-systems)                                                       |
| 必须使用一个只读的 root 文件系统   | [`readOnlyRootFilesystem`(#volumes-and-file-systems)                                         |
| 容器的用户和组的 ID              | [`runAsUser`, `runAsGroup`, `supplementalGroups`](#users-and-groups)                         |
| 提升为 root 权限的限制           | [`allowPrivilegeEscalation`, `defaultAllowPrivilegeEscalation`](#privilege-escalation)       |
| 为容器添加默认的一组能力           | [`defaultAddCapabilities`, `requiredDropCapabilities`, `allowedCapabilities`](#capabilities) |
| 容器的 SELinux 上下文            | [`seLinux`](#selinux)                                                                        |
| 容器允许的 Proc 挂载类型          | [`allowedProcMountTypes`](#allowedprocmounttypes)                                            |
| 容器使用的 AppArmor 配置文件      | [annotations](#apparmor)                                                                     |
| 容器使用的 seccomp 配置文件       | [annotations](#seccomp)                                                                      |
| 容器使用的 sysctl 配置文件        | [`forbiddenSysctls`,`allowedUnsafeSysctls`](#sysctl)                                         |

<!--
## Enabling Pod Security Policies
-->
## 启用 PodSecurityPolicy

<!--
Pod security policy control is implemented as an optional (but recommended)
[admission
controller](/docs/reference/access-authn-authz/admission-controllers/#podsecuritypolicy). PodSecurityPolicies
are enforced by [enabling the admission
controller](/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-on-an-admission-control-plug-in),
but doing so without authorizing any policies **will prevent any pods from being
created** in the cluster.
-->

PodSecurityPolicy 控制是 [admission 控制器](/docs/reference/access-authn-authz/admission-controllers/#podsecuritypolicy) 
的一个可选实现。PodSecurityPolicy通过 [启用 admission 控制器](/docs/reference/access-authn-authz/admission-controllers/#how-do-i-turn-on-an-admission-control-plug-in) 被强制启用，
但是如果集群内没有授权任何策略时这样做 **将导致任何 pod 都无法被创建**。

<!--
Since the pod security policy API (`policy/v1beta1/podsecuritypolicy`) is
enabled independently of the admission controller, for existing clusters it is
recommended that policies are added and authorized before enabling the admission
controller.
-->
由于 PodSecurityPolicy API (`policy/v1beta1/podsecuritypolicy`) 时独立于 admission 控制器启用的，
所以对于现有集群推荐在启用 admission 控制器之前就添加并授权安全策略。

<!--
## Authorizing Policies
-->
## 授权策略

<!--
When a PodSecurityPolicy resource is created, it does nothing. In order to use
it, the requesting user or target pod's [service
account](/docs/tasks/configure-pod-container/configure-service-account/) must be
authorized to use the policy, by allowing the `use` verb on the policy.
-->
当一个 PodSecurityPolicy 资源被创建后，不会执行任何动作。想要应用这个策略，请求用户或者目标 pod 的 
[服务账户](/docs/tasks/configure-pod-container/configure-service-account/) 必须在策略中使用 `use` 动词，从而被授权使用这个策略。

<!--
Most Kubernetes pods are not created directly by users. Instead, they are
typically created indirectly as part of a
[Deployment](/docs/concepts/workloads/controllers/deployment/),
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/), or other
templated controller via the controller manager. Granting the controller access
to the policy would grant access for *all* pods created by that controller,
so the preferred method for authorizing policies is to grant access to the
pod's service account (see [example](#run-another-pod)).
-->
多数 Kubernetes pod 并非由用户直接创建。相反，通常他们作为 [Deployment](/docs/concepts/workloads/controllers/deployment/)、
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/) 或者其他的模板控制器的组成部分由控制器管理器被间接地创建。
授权策略给控制器即授权给 **所有** 由该控制器创建的 pod，因此授权策略的授权方式应该时授权给 pod 的服务账户 （参见 [示例](#run-another-pod)）。

<!--
### Via RBAC
-->
### 使用 RBAC

<!--
[RBAC](/docs/reference/access-authn-authz/rbac/) is a standard Kubernetes
authorization mode, and can easily be used to authorize use of policies.
-->
[RBAC](/docs/reference/access-authn-authz/rbac/) 是一个标准的 Kubernetes 授权模式，同时也能够方便地用于授权策
略的使用。
 
<!--
First, a `Role` or `ClusterRole` needs to grant access to `use` the desired
policies. The rules to grant access look like this:
-->
首先，需要有一个 `Role` 或者 `ClusterRole` 被授予访问权限来 `use` 预期策略。授予访问权限的策略如下所示：

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: <role name>
rules:
- apiGroups: ['policy']
  resources: ['podsecuritypolicies']
  verbs:     ['use']
  resourceNames:
  - <list of policies to authorize>
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: <角色名称>
rules:
- apiGroups: ['policy']
  resources: ['podsecuritypolicies']
  verbs:     ['use']
  resourceNames:
  - <需要授权的策略列表>
```

<!--
Then the `(Cluster)Role` is bound to the authorized user(s):
-->
随后该 `(Cluster)Role` 即绑定给了授权的用户：

<!--
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: <binding name>
roleRef:
  kind: ClusterRole
  name: <role name>
  apiGroup: rbac.authorization.k8s.io
subjects:
# Authorize specific service accounts:
- kind: ServiceAccount
  name: <authorized service account name>
  namespace: <authorized pod namespace>
# Authorize specific users (not recommended):
- kind: User
  apiGroup: rbac.authorization.k8s.io
  name: <authorized user name>
```
-->
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: <绑定名称>
roleRef:
  kind: ClusterRole
  name: <角色名称>
  apiGroup: rbac.authorization.k8s.io
subjects:
# 授权给特定的服务账户:
- kind: ServiceAccount
  name: <授权的服务账户名称>
  namespace: <授权的 pod 命名空间>
# 授权给指定用户 (不推荐):
- kind: User
  apiGroup: rbac.authorization.k8s.io
  name: <授权的用户名>
```

<!--
If a `RoleBinding` (not a `ClusterRoleBinding`) is used, it will only grant
usage for pods being run in the same namespace as the binding. This can be
paired with system groups to grant access to all pods run in the namespace:
-->
如果一个 `RoleBinding` (非 `ClusterRoleBinding`) 被使用，它只会授权给那些运行在与绑定相同命名空间下的 pod。
这可以与系统组一起授权给所有运行在该命名空间下的所有 pod。

<!--
```yaml
# Authorize all service accounts in a namespace:
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts
# Or equivalently, all authenticated users in a namespace:
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:authenticated
```
-->
```yaml
# 授权命名空间下的所有服务账户:
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts
# 或者同样的，授权给命名空间下的所有已验证的用户:
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:authenticated
```

<!--
For more examples of RBAC bindings, see [Role Binding
Examples](/docs/reference/access-authn-authz/rbac#role-binding-examples).
For a complete example of authorizing a PodSecurityPolicy, see
[below](#example).
-->
更多关于 RBAC 绑定的示例，查看 [角色绑定示例](/docs/reference/access-authn-authz/rbac#role-binding-examples)。
关于授权 PodSecurityPolicy 的完整示例，查看 [下面](#example)。

<!--
### Troubleshooting
-->
### 故障诊断

<!--
- The [Controller Manager](/docs/admin/kube-controller-manager/) must be run
against [the secured API port](/docs/reference/access-authn-authz/controlling-access/),
and must not have superuser permissions. Otherwise requests would bypass
authentication and authorization modules, all PodSecurityPolicy objects would be
allowed, and users would be able to create privileged containers. For more details
on configuring Controller Manager authorization, see [Controller
Roles](/docs/reference/access-authn-authz/rbac/#controller-roles).
-->
- [控制器管理器](/docs/admin/kube-controller-manager/) 必须运行于 [安全的 API 端口](/docs/reference/access-authn-authz/controlling-access/)，
并且必须不能具备超级用户权限。否则请求将可绕过身份验证和授权模块，所有的 PodSecurityPolicy 对象将被允许，并且所有的用户将能够创建特权容器。
关于配置控制器管理器授权的更多细节，查看 [控制器角色](/docs/reference/access-authn-authz/rbac/#controller-roles)。

<!--
## Policy Order
-->
## 策略顺序

<!--
In addition to restricting pod creation and update, pod security policies can
also be used to provide default values for many of the fields that it
controls. When multiple policies are available, the pod security policy
controller selects policies according to the following criteria:
-->
除了限制 pod 的创建和更新之外，PodSecurityPolicy 也可以用于为由其控制的许多字段提供默认值。当同时多个策略可用时，PodSecurityPolicy 控制器依据以下标准选择策略：

<!--
1. PodSecurityPolicies which allow the pod as-is, without changing defaults or
   mutating the pod, are preferred.  The order of these non-mutating
   PodSecurityPolicies doesn't matter.
2. If the pod must be defaulted or mutated, the first PodSecurityPolicy
   (ordered by name) to allow the pod is selected.
-->
1. 允许 pod 维持原状，不改变默认设置或者变更 pod 的 PodSecurityPolicy 是首选。这些非变更的 PodSecurityPolicy 的顺序无关紧要。
2. 如果 pod 必须默认或者变更，则使用第一个 PodSecurityPolicy（按名称排序）以允许该 pod。

{{< note >}}
<!--
During update operations (during which mutations to pod specs are disallowed)
only non-mutating PodSecurityPolicies are used to validate the pod.
-->
在更新操作期间（在 pod 规范不允许变更的期间）只有非变更的 PodSecurityPolicy 会用于校验 pod。
{{< /note >}}

<!-- 
## Example
-->
## 示例

<!--
_This example assumes you have a running cluster with the PodSecurityPolicy
admission controller enabled and you have cluster admin privileges._
-->
_这个示例假定你有一个运行中且已启用 PodSecurityPolicy admission 控制器的集群，并且你拥有集群管理员权限。_

<!--
### Set up
-->
### 设置

<!--
Set up a namespace and a service account to act as for this example. We'll use
this service account to mock a non-admin user.
-->
以此为例设置一个命名空间和服务账户. 我们将使用这个服务账户来模拟一个非管理员用户.

```shell
kubectl create namespace psp-example
kubectl create serviceaccount -n psp-example fake-user
kubectl create rolebinding -n psp-example fake-editor --clusterrole=edit --serviceaccount=psp-example:fake-user
```

<!-- 
To make it clear which user we're acting as and save some typing, create 2
aliases:
-->
为了清晰展示我们所演示的具体用户以及省去一些键入操作,首先创建两个别名:

```shell
alias kubectl-admin='kubectl -n psp-example'
alias kubectl-user='kubectl --as=system:serviceaccount:psp-example:fake-user -n psp-example'
```

<!-- 
### Create a policy and a pod
-->
### 创建一个策略和一个 pod

<!-- 
Define the example PodSecurityPolicy object in a file. This is a policy that
simply prevents the creation of privileged pods.
The name of a PodSecurityPolicy object must be a valid
[DNS subdomain name](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).
-->
在一个文件中定义 PodSecurityPolicy 对象实例。这里的策略只是用来禁止创建有特权
要求的 Pods。 PodSecurityPolicy 对象的命名必须是合法的 [DNS 子域名](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names).

{{< codenew file="policy/example-psp.yaml" >}}

<!-- 
And create it with kubectl: 
-->
然后通过 kubectl 命名创建它:

```shell
kubectl-admin create -f example-psp.yaml
```

<!--
Now, as the unprivileged user, try to create a simple pod:
-->
现在作为一个非特权用户, 尝试创建一个简单的 pod:

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      pause
spec:
  containers:
    - name:  pause
      image: k8s.gcr.io/pause
EOF
Error from server (Forbidden): error when creating "STDIN": pods "pause" is forbidden: unable to validate against any pod security policy: []
```

<!-- 
**What happened?** Although the PodSecurityPolicy was created, neither the
pod's service account nor `fake-user` have permission to use the new policy: 
-->
***发生了什么?* 尽管 PodSecurityPolicy 已经创建, pod 的 service account 和 `fake-user` 都没有权限使用这个策略:

```shell
kubectl-user auth can-i use podsecuritypolicy/example
no
```

<!--
Create the rolebinding to grant `fake-user` the `use` verb on the example
policy:
-->
创建 rolebinding 来为示例策略中的 `fake-user` 的 `use` 动词授权:

{{< note >}}
<!--
This is not the recommended way! See the [next section](#run-another-pod)
for the preferred approach.
-->
不推荐这种方式! 更推荐的方式请查看 [下一部分](#run-another-pod).
{{< /note >}}

```shell
kubectl-admin create role psp:unprivileged \
    --verb=use \
    --resource=podsecuritypolicy \
    --resource-name=example
role "psp:unprivileged" created

kubectl-admin create rolebinding fake-user:psp:unprivileged \
    --role=psp:unprivileged \
    --serviceaccount=psp-example:fake-user
rolebinding "fake-user:psp:unprivileged" created

kubectl-user auth can-i use podsecuritypolicy/example
yes
```

<!--
Now retry creating the pod:
-->
接下来尝试创建这个 pod:

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      pause
spec:
  containers:
    - name:  pause
      image: k8s.gcr.io/pause
EOF
pod "pause" created
```

<!--
It works as expected! But any attempts to create a privileged pod should still
be denied:
-->
它按预期运行,但是任何创建特权 pod 的尝试应当都被拒绝:

```shell
kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      privileged
spec:
  containers:
    - name:  pause
      image: k8s.gcr.io/pause
      securityContext:
        privileged: true
EOF
Error from server (Forbidden): error when creating "STDIN": pods "privileged" is forbidden: unable to validate against any pod security policy: [spec.containers[0].securityContext.privileged: Invalid value: true: Privileged containers are not allowed]
```

<!--
Delete the pod before moving on:
-->
在继续下一步之前先删掉之前的 pod:

```shell
kubectl-user delete pod pause
```

<!--
### Run another pod
-->
### 运行另一个 pod

<!--
Let's try that again, slightly differently:
-->
我们来再试一次, 相比之前略微有些不同:

```shell
kubectl-user run pause --image=k8s.gcr.io/pause
deployment "pause" created

kubectl-user get pods
No resources found.

kubectl-user get events | head -n 2
LASTSEEN   FIRSTSEEN   COUNT     NAME              KIND         SUBOBJECT                TYPE      REASON                  SOURCE                                  MESSAGE
1m         2m          15        pause-7774d79b5   ReplicaSet                            Warning   FailedCreate            replicaset-controller                   Error creating: pods "pause-7774d79b5-" is forbidden: no providers available to validate pod request
```

<!--
**What happened?** We already bound the `psp:unprivileged` role for our `fake-user`,
why are we getting the error `Error creating: pods "pause-7774d79b5-" is
forbidden: no providers available to validate pod request`? The answer lies in
the source - `replicaset-controller`. Fake-user successfully created the
deployment (which successfully created a replicaset), but when the replicaset
went to create the pod it was not authorized to use the example
podsecuritypolicy.
-->
**发生了什么?**我们已经将 `psp:unprivileged` 角色绑定给了 `fake-user`, 为何仍然报错 
`Error creating: pods "pause-7774d79b5-" is forbidden: no providers available to validate pod request`? 
答案在 `replicaset-controller` 源码中. Fake-user 成功创建了 deployment (并且该 deployment 成功创建了一个 replicaset), 
然而当该 replicaset 想要创建 pod 时却没有权限使用我们的示例 pod 安全策略.

<!--
In order to fix this, bind the `psp:unprivileged` role to the pod's service
account instead. In this case (since we didn't specify it) the service account
is `default`:
-->
为了修复这个问题,将 `psp:unprivileged` 角色绑定给 pod 的 service account. 在这种情况下(由于我们没有显式指定) 该 service account 为 `default`:

```shell
kubectl-admin create rolebinding default:psp:unprivileged \
    --role=psp:unprivileged \
    --serviceaccount=psp-example:default
rolebinding "default:psp:unprivileged" created
```

<!--
Now if you give it a minute to retry, the replicaset-controller should
eventually succeed in creating the pod:
-->
现在如果你给它一分钟让它重试, replicaset-controller 应该最终能够成功创建出 pod:

```shell
kubectl-user get pods --watch
NAME                    READY     STATUS    RESTARTS   AGE
pause-7774d79b5-qrgcb   0/1       Pending   0         1s
pause-7774d79b5-qrgcb   0/1       Pending   0         1s
pause-7774d79b5-qrgcb   0/1       ContainerCreating   0         1s
pause-7774d79b5-qrgcb   1/1       Running   0         2s
```

<!--
### Clean up
-->
### 清理

<!--
Delete the namespace to clean up most of the example resources:
-->
删除命名空间来清理大部分示例资源:

```shell
kubectl-admin delete ns psp-example
namespace "psp-example" deleted
```

<!--
Note that `PodSecurityPolicy` resources are not namespaced, and must be cleaned
up separately:
-->
注意 `PodSecurityPolicy` 并非命名空间限定的资源类型, 必须单独清理:

```shell
kubectl-admin delete psp example
podsecuritypolicy "example" deleted
```

<!--
### Example Policies
-->
### 示例策略

<!--
This is the least restrictive policy you can create, equivalent to not using the
pod security policy admission controller:
-->
这是一个你能够创建的最小化的限制性策略, 相当于不使用 pod 安全策略准入控制器:

{{< codenew file="policy/privileged-psp.yaml" >}}

<!--
This is an example of a restrictive policy that requires users to run as an
unprivileged user, blocks possible escalations to root, and requires use of
several security mechanisms.
-->
这是一个限制性策略示例,要求用户以非特权用户运行, 屏蔽了权限提升至 root 的可能性, 同时需要使用几个安全机制.

{{< codenew file="policy/restricted-psp.yaml" >}}

<!--
## Policy Reference
-->
## 策略参考

<!--
### Privileged
-->
### 特权

<!--
**Privileged** - determines if any container in a pod can enable privileged mode.
By default a container is not allowed to access any devices on the host, but a
"privileged" container is given access to all devices on the host. This allows
the container nearly all the same access as processes running on the host.
This is useful for containers that want to use linux capabilities like
manipulating the network stack and accessing devices.
-->
**特权** - 决定 pod 中的任意容器能否启用特权模式。默认情况下一个容器不允许访问主机上的任意设备， 但是一个 "特权" 容器是允许访问主机上的所有设备的。
这样容器具备的权限几乎等同于主机上运行的进程。 这对于像比如操作网络堆栈和访问设备等需要使用 linux capabilities 的容器来说非常有用。

<!--
### Host namespaces
-->
### 主机命名空间

<!--
**HostPID** - Controls whether the pod containers can share the host process ID
namespace. Note that when paired with ptrace this can be used to escalate
privileges outside of the container (ptrace is forbidden by default). 
-->
**HostPID** - 控制 pod 容器能否共享主机进程 ID 命名空间。 注意当它与 ptrace 搭配使用时可被利用于在容器外部提升权限(ptrace 默认被禁用)。

<!--
**HostIPC** - Controls whether the pod containers can share the host IPC
namespace.
-->
**HostIPC** - 控制 pod 容器能够共享主机 IPC

<!--
**HostNetwork** - Controls whether the pod may use the node network
namespace. Doing so gives the pod access to the loopback device, services
listening on localhost, and could be used to snoop on network activity of other
pods on the same node.
-->
**HostNetwork** - 控制 pod 能否使用节点网络命名空间。 这样做可允许 pod 访问回环设备、监听 localhost 的服务以及能够用于探测同意节点上其他 pod 的网络活动。

<!--
**HostPorts** - Provides a whitelist of ranges of allowable ports in the host
network namespace. Defined as a list of `HostPortRange`, with `min`(inclusive)
and `max`(inclusive). Defaults to no allowed host ports
-->
**HostPorts** - 提供主机网络名称空间中允许端口范围的白名单。定义为 `HostPortRange` 列表，其中包含 `min(包含)` 和 `max(包含)`。默认不允许任何主机端口。

<!-- 
### Volumes and file systems
 -->
### 存储卷和文件系统

<!-- 
**Volumes** - Provides a whitelist of allowed volume types. The allowable values
correspond to the volume sources that are defined when creating a volume. For
the complete list of volume types, see [Types of
Volumes](/docs/concepts/storage/volumes/#types-of-volumes). Additionally, `*`
may be used to allow all volume types.
-->
**Volumes** - 提供允许的存储卷类型的白名单。允许值对应于在创建卷时定义的源卷。完整的卷类型列表，请查阅 [卷类型](/docs/concepts/storage/volumes/#types-of-volumes)。
此外 `*` 可用于允许所有卷类型。

<!-- 
The **recommended minimum set** of allowed volumes for new PSPs are:
-->
对于新 PSP 允许的卷**推荐的最小化组合** 是：

- configMap
- downwardAPI
- emptyDir
- persistentVolumeClaim
- secret
- projected

{{< warning >}}
<!-- 
PodSecurityPolicy does not limit the types of `PersistentVolume` objects that
may be referenced by a `PersistentVolumeClaim`, and hostPath type
`PersistentVolumes` do not support read-only access mode. Only trusted users
should be granted permission to create `PersistentVolume` objects.
 -->
PodSecurityPolicy 并不会对可能被 `PersistentVolumeClaim` 引用的 `PersistentVolume` 资源对象的类型做限制，
并且 hostPath 类型的 `PersistentVolumes` 并不支持只读访问模式。只有可信用户才应当给予创建 `PersistentVolume` 资源对象的权限。
{{< /warning >}}

<!-- 
**FSGroup** - Controls the supplemental group applied to some volumes.
 -->
**FSGroup** - 控制应用于某些卷的补充组。

<!-- 
- *MustRunAs* - Requires at least one `range` to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *MayRunAs* - Requires at least one `range` to be specified. Allows
`FSGroups` to be left unset without providing a default. Validates against
all ranges if `FSGroups` is set.
- *RunAsAny* - No default provided. Allows any `fsGroup` ID to be specified.
-->
- *MustRunAs* - 要求至少指定一个 `range`。使用第一个范围的最小值作为默认值。针对所有范围进行验证。
- *MayRunAs* - 要求至少指定一个 `range`。允许 `FSGroups` 不提供默认设置。如果设置了 `FSGroups`，
则针对所有范围进行验证。
- *RunAsAny* - 不提供默认值。允许指定任意 `fsGroup` ID。

<!-- 
**AllowedHostPaths** - This specifies a whitelist of host paths that are allowed
to be used by hostPath volumes. An empty list means there is no restriction on
host paths used. This is defined as a list of objects with a single `pathPrefix`
field, which allows hostPath volumes to mount a path that begins with an
allowed prefix, and a `readOnly` field indicating it must be mounted read-only.
For example:
 -->
**AllowedHostPaths** - 它指定主机路径的白名单，允许 hostPath 卷使用这些白名单。空列表意味着对使用的主机路径没有限制。
这被定义为一个对象列表，其中有一个 `pathPrefix` 字段，它允许 hostPath 卷挂载一个以允许的前缀开头的路径，以及一个 `readOnly` 字段，
表示它必须以只读方式挂载。例如：

```yaml
allowedHostPaths:
  # This allows "/foo", "/foo/", "/foo/bar" etc., but
  # disallows "/fool", "/etc/foo" etc.
  # "/foo/../" is never valid.
  - pathPrefix: "/foo"
    readOnly: true # only allow read-only mounts
```

{{< warning >}}
<!-- 
There are many ways a container with unrestricted access to the host
filesystem can escalate privileges, including reading data from other
containers, and abusing the credentials of system services, such as Kubelet.
 -->
对于能够无限制访问主机文件系统的容器来说，有许多方式可以进行特权提升，包括从其他容器读取数据，以及滥用系统服务(如 Kubelet)的凭据。
<!-- 
Writeable hostPath directory volumes allow containers to write
to the filesystem in ways that let them traverse the host filesystem outside the `pathPrefix`.
`readOnly: true`, available in Kubernetes 1.11+, must be used on **all** `allowedHostPaths`
to effectively limit access to the specified `pathPrefix`.
 -->
可写的 hostPath 目录卷允许容器以允许它们在 `pathPrefix` 之外遍历主机文件系统的方式写入文件系统。`readOnly: true` 在 Kubernetes 1.11+ 可用，
必须应用于 **所有** `allowedHostPaths` 以有效限制对指定 `pathPrefix` 的访问。
{{< /warning >}}

<!-- 
**ReadOnlyRootFilesystem** - Requires that containers must run with a read-only
root filesystem (i.e. no writable layer).
 -->
**ReadOnlyRootFilesystem** - 要求容器必须运行于一个只读的根文件系统（即不可写的层）。

<!-- 
### FlexVolume drivers
 -->
### FlexVolume 驱动

<!-- 
This specifies a whitelist of FlexVolume drivers that are allowed to be used
by flexvolume. An empty list or nil means there is no restriction on the drivers.
Please make sure [`volumes`](#volumes-and-file-systems) field contains the
`flexVolume` volume type; no FlexVolume driver is allowed otherwise.
 -->
这指定了 FlexVolume 驱动程序的白名单，允许 FlexVolume 使用这些驱动程序。空列表或 nil 表示对驱动程序没有限制。
请确保 [`volumes`](#volumes-and-file-systems) 字段包含 `flexVolume` 卷类型；否则任何 FlexVolume 驱动都不允许。

<!-- 
For example:
 -->
例如：

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: allow-flex-volumes
spec:
  # ... other spec fields
  volumes:
    - flexVolume
  allowedFlexVolumes:
    - driver: example/lvm
    - driver: example/cifs
```

<!-- 
### Users and groups
-->
### 用户和组

<!-- 
**RunAsUser** - Controls which user ID the containers are run with.
 -->
**RunAsUser** - 控制容器以哪个用户 ID 运行。

<!-- 
- *MustRunAs* - Requires at least one `range` to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *MustRunAsNonRoot* - Requires that the pod be submitted with a non-zero
`runAsUser` or have the `USER` directive defined (using a numeric UID) in the
image. Pods which have specified neither `runAsNonRoot` nor `runAsUser` settings
will be mutated to set `runAsNonRoot=true`, thus requiring a defined non-zero 
numeric `USER` directive in the container. No default provided. Setting 
`allowPrivilegeEscalation=false` is strongly recommended with this strategy.
- *RunAsAny* - No default provided. Allows any `runAsUser` to be specified.
 -->
- *MustRunAs* - 要求至少指定一个 `range`。使用第一个范围的最小值作为默认值。针对所有范围进行验证。
- *MustRunAsNonRoot* - 要求 pod 使用非零的 `runAsUser` 提交，或者在镜像中定义 `USER` 命令 (使用数字 UID)。
没有指定 `runAsNonRoot` 或 `runAsUser` 设置的 pod 将被修改为设置 `runAsNonRoot=true`，
因此需要在容器中定义一个非零的数字 `USER` 命令。不提供默认值。这个策略强烈建议设置 `allowPrivilegeEscalation=false`。
- *RunAsAny* - 不提供默认值。允许指定任意 `runAsUser`。

<!-- 
**RunAsGroup** - Controls which primary group ID the containers are run with.
 -->
**RunAsGroup** - 控制容器以哪个首要组 ID 运行。

<!-- 
- *MustRunAs* - Requires at least one `range` to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *MayRunAs* - Does not require that RunAsGroup be specified. However, when RunAsGroup
is specified, they have to fall in the defined range.
- *RunAsAny* - No default provided. Allows any `runAsGroup` to be specified.
 -->
- *MustRunAs* - 要求至少指定一个 `range`。使用第一个范围的最小值作为默认值。针对所有范围进行验证。
- *MayRunAs* - 不要求指定 RunAsGroup。但是，当指定 RunAsGroup 时，它们必须落在定义的范围内。
- *RunAsAny* - 不提供默认值。允许指定任意 `runAsGroup`。

<!-- 
**SupplementalGroups** - Controls which group IDs containers add.
 -->
**SupplementalGroups** - 控制容器添加那些组 ID。

<!-- 
- *MustRunAs* - Requires at least one `range` to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *MayRunAs* - Requires at least one `range` to be specified. Allows
`supplementalGroups` to be left unset without providing a default.
Validates against all ranges if `supplementalGroups` is set.
- *RunAsAny* - No default provided. Allows any `supplementalGroups` to be
specified.
 -->
- *MustRunAs* - 要求至少指定一个 `range`。使用第一个范围的最小值作为默认值。针对所有范围进行验证。
- *MayRunAs* - 要求至少指定一个 `range`。允许在不提供默认值的情况下不设置 `supplementalGroups`。
如果设置了 `supplementalGroups`，则对所有范围进行验证。
- *RunAsAny* - 不提供默认值。允许指定任意 `supplementalGroups`。

<!-- 
### Privilege Escalation
 -->
### 特权提升

<!-- 
These options control the `allowPrivilegeEscalation` container option. This bool
directly controls whether the
[`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
flag gets set on the container process. This flag will prevent `setuid` binaries
from changing the effective user ID, and prevent files from enabling extra
capabilities (e.g. it will prevent the use of the `ping` tool). This behavior is
required to effectively enforce `MustRunAsNonRoot`.
 -->
这个选项控制容器的 `allowPrivilegeEscalation` 选项。这个布尔值直接控制 [`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
标志是否设置到容器进程上。这个标志将防止 `setuid` 二进制文件改变有效的用户 ID，并防止文件启用额外的功能 (例如，它将防止使用 `ping` 工具)。
这种行为前提是需要有效地强制指定 `MustRunAsNonRoot`。

<!-- 
**AllowPrivilegeEscalation** - Gates whether or not a user is allowed to set the
security context of a container to `allowPrivilegeEscalation=true`. This
defaults to allowed so as to not break setuid binaries. Setting it to `false`
ensures that no child process of a container can gain more privileges than its parent.
 -->
**AllowPrivilegeEscalation** - 是否允许用户将容器的安全上下文设置为 `allowPrivilegeEscalation=true`。
这是默认设置，以便不破坏 setuid 二进制文件。将其设置为 `false` 可以确保容器的子进程不能获得比其父进程更多的特权。

<!-- 
**DefaultAllowPrivilegeEscalation** - Sets the default for the
`allowPrivilegeEscalation` option. The default behavior without this is to allow
privilege escalation so as to not break setuid binaries. If that behavior is not
desired, this field can be used to default to disallow, while still permitting
pods to request `allowPrivilegeEscalation` explicitly.
 -->
**DefaultAllowPrivilegeEscalation** - 设置 `allowPrivilegeEscalation` 选项的默认值。没有这个设置的默认行为是允许
特权升级，以避免破坏 setuid 二进制文件。如果这种行为并非有意，可以使此字段默认为不允许，但仍然允许
显式请求 `allowPrivilegeEscalation` 的 pods。

<!-- 
### Capabilities
 -->
### 能力

<!-- 
Linux capabilities provide a finer grained breakdown of the privileges
traditionally associated with the superuser. Some of these capabilities can be
used to escalate privileges or for container breakout, and may be restricted by
the PodSecurityPolicy. For more details on Linux capabilities, see
[capabilities(7)](http://man7.org/linux/man-pages/man7/capabilities.7.html).
 -->
Linux 能力提供了对传统上与超级用户相关的特权的细粒度分解。其中一些能力可用于特权提升或容器断接，并且可能受到 PodSecurityPolicy 的限制。
有关Linux功能的更多信息，查看 [capabilities(7)](http://man7.org/linux/man-pages/man7/capabilities.7.html)。

<!-- 
The following fields take a list of capabilities, specified as the capability
name in ALL_CAPS without the `CAP_` prefix.
 -->
以下字段列出了能力列表，在 ALL_CAPS 中指定为不带 `CAP_` 前缀的能力名称。

<!-- 
**AllowedCapabilities** - Provides a whitelist of capabilities that may be added
to a container. The default set of capabilities are implicitly allowed. The
empty set means that no additional capabilities may be added beyond the default
set. `*` can be used to allow all capabilities.
 -->
**AllowedCapabilities** - 提供可添加到容器中的能力白名单。默认的能力集是隐式允许的。
空集意味着在默认集之外不能添加任何附加能力。`*` 可用于允许所有能力。

<!-- 
**RequiredDropCapabilities** - The capabilities which must be dropped from
containers. These capabilities are removed from the default set, and must not be
added. Capabilities listed in `RequiredDropCapabilities` must not be included in
`AllowedCapabilities` or `DefaultAddCapabilities`.
 -->
**RequiredDropCapabilities** - 必须从容器中删除的能力。这些能力将从默认设置中删除，并且不能被添加。
在 `requireddropcapability` 中列出的能力不能包含在 `allowedcapability` 或 `defaultaddcapability` 中。

<!-- 
**DefaultAddCapabilities** - The capabilities which are added to containers by
default, in addition to the runtime defaults. See the [Docker
documentation](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities)
for the default list of capabilities when using the Docker runtime.
 -->
**DefaultAddCapabilities** - 除了运行时默认设置外，默认添加到容器中的能力。查看 [Docker 文档](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities) 中关于使用 Docker 运行时时默认的能力列表。

### SELinux
<!-- 
- *MustRunAs* - Requires `seLinuxOptions` to be configured. Uses
`seLinuxOptions` as the default. Validates against `seLinuxOptions`.
- *RunAsAny* - No default provided. Allows any `seLinuxOptions` to be
specified.
 -->
- *MustRunAs* - 要求设置 `seLinuxOptions`。使用 `seLinuxOptions` 作为默认值。针对所有范围进行验证。
- *RunAsAny* - 不提供默认值。允许指定任意 `seLinuxOptions`。


### AllowedProcMountTypes

<!-- 
`allowedProcMountTypes` is a whitelist of allowed ProcMountTypes.
Empty or nil indicates that only the `DefaultProcMountType` may be used.
 -->
`allowedProcMountTypes` 是允许 ProcMountTypes 的白名单。空列表或 nil 表示只允许 `DefaultProcMountType` 指定的默认值。

<!-- 
`DefaultProcMount` uses the container runtime defaults for readonly and masked
paths for /proc.  Most container runtimes mask certain paths in /proc to avoid
accidental security exposure of special devices or information. This is denoted
as the string `Default`.
 -->
`DefaultProcMount` 对只读路径使用容器运行时默认值，对/proc 使用掩码路径。大多数容器运行时屏蔽 /proc 中的某些路径，
以避免特殊设备或信息的意外安全性暴露。使用字符串 `Default` 表示。

<!-- 
The only other ProcMountType is `UnmaskedProcMount`, which bypasses the
default masking behavior of the container runtime and ensures the newly
created /proc the container stays intact with no modifications. This is
denoted as the string `Unmasked`.
 -->
另一个 ProcMountType 是 `UnmaskedProcMount`，它绕过了容器运行时的默认屏蔽行为，并确保新创建的 /proc 容器保持不变。
使用字符串 `unmask` 表示。

### AppArmor

<!-- 
Controlled via annotations on the PodSecurityPolicy. Refer to the [AppArmor
documentation](/docs/tutorials/clusters/apparmor/#podsecuritypolicy-annotations).
 -->
通过 PodSecurityPolicy 上面的注解进行控制。参考 [AppArmor
文档](/docs/tutorials/clusters/apparmor/#podsecuritypolicy-annotations)。

### Seccomp

<!-- 
The use of seccomp profiles in pods can be controlled via annotations on the
PodSecurityPolicy. Seccomp is an alpha feature in Kubernetes.
 -->
可以通过 PodSecurityPolicy 上的注解来控制 pod 中 seccomp 配置文件的使用。
Seccomp 是 Kubernetes 的一个 alpha 特性。

<!-- 
**seccomp.security.alpha.kubernetes.io/defaultProfileName** - Annotation that
specifies the default seccomp profile to apply to containers. Possible values
are:
 -->
**seccomp.security.alpha.kubernetes.io/defaultProfileName** - 指定要应用于容器的默认 seccomp 配置文件的注解。
可选值有：

<!-- 
- `unconfined` - Seccomp is not applied to the container processes (this is the
  default in Kubernetes), if no alternative is provided.
- `runtime/default` - The default container runtime profile is used.
- `docker/default` - The Docker default seccomp profile is used. Deprecated as of
  Kubernetes 1.11. Use `runtime/default` instead.
- `localhost/<path>` - Specify a profile as a file on the node located at
  `<seccomp_root>/<path>`, where `<seccomp_root>` is defined via the
  `--seccomp-profile-root` flag on the Kubelet.
 -->
- `unconfined` - 如果没有提供替代方案，则 Seccomp 不会应用于容器进程 (这是 Kubernetes 中的默认设置)。
- `runtime/default` - 使用默认的容器运行时配置。
- `docker/default` -  使用 Docker 默认的 seccomp 配置。于 Kubernetes 1.11 弃用。使用 `runtime/default` 代替。
- `localhost/<path>` - 将配置文件指定为位于节点上 `<seccomp_root>/<path>` 目录下的文件，
其中通过 Kubelet 上的 `--seccomp-profile-root` 标志来定义 `<seccomp_root>`。

<!-- 
**seccomp.security.alpha.kubernetes.io/allowedProfileNames** - Annotation that
specifies which values are allowed for the pod seccomp annotations. Specified as
a comma-delimited list of allowed values. Possible values are those listed
above, plus `*` to allow all profiles. Absence of this annotation means that the
default cannot be changed.
 -->
**seccomp.security.alpha.kubernetes.io/allowedProfileNames** - 用于指定 pod seccomp 注解允许哪些取值的注解。
指定为允许值的逗号分隔列表。可选值是上面列出的值，加上 `*` 以允许所有配置文件。缺少此注解意味着无法更改默认值。

### Sysctl

<!-- 
By default, all safe sysctls are allowed. 
 -->
默认情况下允许所有安全的 sysctl。

<!-- 
- `forbiddenSysctls` - excludes specific sysctls. You can forbid a combination of safe and unsafe sysctls in the list. To forbid setting any sysctls, use `*` on its own.
- `allowedUnsafeSysctls` - allows specific sysctls that had been disallowed by the default list, so long as these are not listed in `forbiddenSysctls`.
 -->
- `forbiddenSysctls` - 排除特定的 sysctl。您可以在列表中禁止安全的和不安全的 sysctl 的组合。要禁止设置任意 sysctl，请单独使用 `*`。
- `allowedUnsafeSysctls` - 允许在默认列表中被禁用的特定 sysctl，只要这些 sysctl 没有在 `forbiddenSysctls` 中列出。

<!-- 
Refer to the [Sysctl documentation](
/docs/concepts/cluster-administration/sysctl-cluster/#podsecuritypolicy).
 -->
参考 [Sysctl 文档](
/docs/concepts/cluster-administration/sysctl-cluster/#podsecuritypolicy)。
{{% /capture %}}

{{% capture whatsnext %}}

<!-- 
Refer to [Pod Security Policy Reference](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podsecuritypolicy-v1beta1-policy) for the api details.
 -->

{{% /capture %}}