---
approvers:
- jessfraz
cn-approvers:
- lichuqiang
title: 使用 PodPreset 将信息注入 Pods
---
<!--
---
approvers:
- jessfraz
title: Inject Information into Pods Using a PodPreset
---
-->

<!--
You can use a `podpreset` object to inject certain information into pods at creation
time. This information can include secrets, volumes, volume mounts, and environment
variables.

See [PodPreset proposal](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md) for more information.
-->
在 pod 创建时，用户可以使用 `podpreset` 对象将特定信息注入 pod 中，这些信息可以包括 secret、 卷、
卷挂载和环境变量。

查看 [PodPreset 提案](https://git.k8s.io/community/contributors/design-proposals/service-catalog/pod-preset.md) 了解更多信息。

* TOC
{:toc}

<!--
## What is a Pod Preset?

A _Pod Preset_ is an API resource that you can use to inject additional runtime
requirements into a Pod at creation time. You use label selectors to specify
the Pods to which a given Pod Preset applies. Check out more information on [label
selectors](/docs/concepts/overview/working-with-objects/labels/#label-selectors).
-->
## 什么是 Pod Preset？

_Pod Preset_ 是一种 API 资源，在 pod 创建时，用户可以用它将额外的运行时需求信息注入 pod。
使用标签选择器（label selector）来指定 Pod Preset 所适用的 pod。
查看更多关于 [标签选择器](/docs/concepts/overview/working-with-objects/labels/#label-selectors)
的信息。

<!--
Using a Pod Preset allows pod template authors to not have to explicitly set
information for every pod. This way, authors of pod templates consuming a
specific service do not need to know all the details about that service.
-->
使用 Pod Preset 使得 pod 模板编写者不必显式地为每个 pod 设置信息。
这样，使用特定服务的 pod 模板编写者不需要了解该服务的所有细节。

<!--
## Admission Control

_Admission control_ is how Kubernetes applies Pod Presets to incoming pod
creation requests. When a pod creation request occurs, the system does the
following:
-->
## 准入控制

_准入控制_ 是指 Kubernetes 如何将 Pod Preset 应用于接收到的创建请求中。
当出现创建请求时，系统会执行以下操作：

<!--
1. Retrieve all `PodPresets` available for use.
1. Match the label selector of the `PodPreset` to the pod being created.
1. Attempt to merge the various defined resources for the `PodPreset` into the
   Pod being created.
1. On error, throw an event documenting the merge error on the pod, and create
   the pod _without_ any injected resources from the `PodPreset`.
-->
1. 检索全部可用 `PodPresets` 。
1. 对 `PodPreset` 的标签选择器和要创建的 pod 进行匹配。
1. 尝试合并 `PodPreset` 中定义的各种资源，并注入要创建的 pod。
1. 发生错误时抛出事件，该事件记录了 pod 信息合并错误，同时_不注入_ `PodPreset` 信息创建 pod。

<!--
### Behavior

When a `PodPreset` is applied to one or more Pods, Kubernetes modifies the pod
spec. For changes to `Env`, `EnvFrom`, and `VolumeMounts`, Kubernetes modifies
the container spec for all containers in the Pod; for changes to Volume,
Kubernetes modifies the Pod Spec.
-->
### 行为

当 `PodPreset` 应用于一个或多个 Pod 时， Kubernetes 修改 pod spec。
对于 `Env`、 `EnvFrom` 和 `VolumeMounts` 的改动， Kubernetes 修改 pod 中所有容器的规格，
对于卷的改动，Kubernetes 修改 Pod spec。

<!--
Kubernetes annotates the resulting modified pod spec to show that it was
modified by a `PodPreset`. The annotation is of the form
`podpreset.admission.kubernetes.io/podpreset-<pod-preset name>": "<resource version>"`.
-->
Kubernetes 为改动的 pod spec 添加注解，来表明它被 `PodPreset` 所修改。 注解形如：
`podpreset.admission.kubernetes.io/podpreset-<pod-preset name>": "<resource version>"`。


<!--
## Enable Pod Preset

In order to use Pod Presets in your cluster you must ensure the
following

1.  You have enabled the api type `settings.k8s.io/v1alpha1/podpreset`
1.  You have enabled the admission controller `PodPreset`
1.  You have defined your pod presets
-->
## 启用 Pod Preset

为了在集群中使用 Pod Preset，必须确保以下内容

1.  已启用 api 类型 `settings.k8s.io/v1alpha1/podpreset` 
1.  已启用准入控制器 `PodPreset`
1.  已定义 pod preset

<!--
## Disable Pod Preset for a pod

There may be instances where you wish for a pod to not be altered by any pod
preset mutations. For these events, one can add an annotation in the pod spec
of the form: `podpreset.admission.kubernetes.io/exclude: "true"`.
-->
## 为 Pod 禁用 Pod Preset

在一些情况下，用户不希望 pod 被 pod preset 所改动，这时，用户可以在 pod spec 中添加形如
 `podpreset.admission.kubernetes.io/exclude: "true"` 的注解。

<!--
## Create a Pod Preset

### Simple Pod Spec Example

This is a simple example to show how a Pod spec is modified by the Pod
Preset.

**User submitted pod spec:**
-->
## 创建 Pod Preset

### 简单的 Pod Spec 示例

这里是一个简单的示例，展示了如何通过 Pod Preset 修改 Pod spec 。

**用户提交的 pod spec：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      ports:
        - containerPort: 80
```

<!--
**Example Pod Preset:**
-->
**Pod Preset 示例：**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  env:
    - name: DB_PORT
      value: "6379"
  volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
```

<!--
**Pod spec after admission controller:**
-->
**通过准入控制器后的 Pod spec：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
  annotations:
    podpreset.admission.kubernetes.io/podpreset-allow-database: "resource version"
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
      ports:
        - containerPort: 80
      env:
        - name: DB_PORT
          value: "6379"
  volumes:
    - name: cache-volume
      emptyDir: {}
```

<!--
### Pod Spec with `ConfigMap` Example

This is an example to show how a Pod spec is modified by the Pod Preset
that defines a `ConfigMap` for Environment Variables.

**User submitted pod spec:**
-->
### 带有 `ConfigMap` 的 Pod Spec 示例

这里的示例展示了如何通过 Pod Preset 修改 Pod spec，Pod Preset 中定义了 `ConfigMap` 作为环境变量取值来源。

**用户提交的 pod spec：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      ports:
        - containerPort: 80
```

<!--
**User submitted `ConfigMap`:**
-->
**用户提交的 `ConfigMap`：**

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: etcd-env-config
data:
  number_of_members: "1"
  initial_cluster_state: new
  initial_cluster_token: DUMMY_ETCD_INITIAL_CLUSTER_TOKEN
  discovery_token: DUMMY_ETCD_DISCOVERY_TOKEN
  discovery_url: http://etcd_discovery:2379
  etcdctl_peers: http://etcd:2379
  duplicate_key: FROM_CONFIG_MAP
  REPLACE_ME: "a value"
```

<!--
**Example Pod Preset:**
-->
**Pod Preset 示例：**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  env:
    - name: DB_PORT
      value: 6379
    - name: duplicate_key
      value: FROM_ENV
    - name: expansion
      value: $(REPLACE_ME)
  envFrom:
    - configMapRef:
        name: etcd-env-config
  volumeMounts:
    - mountPath: /cache
      name: cache-volume
    - mountPath: /etc/app/config.json
      readOnly: true
      name: secret-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
    - name: secret-volume
      secret:
         secretName: config-details
```

<!--
**Pod spec after admission controller:**
-->
**通过准入控制器后的 Pod spec：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
  annotations:
    podpreset.admission.kubernetes.io/podpreset-allow-database: "resource version"
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
        - mountPath: /etc/app/config.json
          readOnly: true
          name: secret-volume
      ports:
        - containerPort: 80
      env:
        - name: DB_PORT
          value: "6379"
        - name: duplicate_key
          value: FROM_ENV
        - name: expansion
          value: $(REPLACE_ME)
      envFrom:
        - configMapRef:
          name: etcd-env-config
  volumes:
    - name: cache-volume
      emptyDir: {}
    - name: secret-volume
      secret:
         secretName: config-details
```

<!--
### ReplicaSet with Pod Spec Example

The following example shows that only the pod spec is modified by the Pod
Preset.

**User submitted ReplicaSet:**
-->
### 带有 Pod Spec 的 ReplicaSet 示例

以下示例展示了（通过 ReplicaSet 创建 pod 后）只有 pod spec 会被 Pod Preset 所修改。

**用户提交的 ReplicaSet：**

```yaml
apiVersion: settings.k8s.io/v1alpha1
kind: ReplicaSet
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
    matchExpressions:
      - {key: tier, operator: In, values: [frontend]}
  template:
    metadata:
      labels:
        app: guestbook
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3
        resources:
          requests:
            cpu: 100m
            memory: 100Mi
        env:
          - name: GET_HOSTS_FROM
            value: dns
        ports:
          - containerPort: 80
```

<!--
**Example Pod Preset:**
-->
**Pod Preset 示例：**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      tier: frontend
  env:
    - name: DB_PORT
      value: "6379"
  volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
```

<!--
**Pod spec after admission controller:**
-->
**通过准入控制器后的 Pod spec：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  labels:
    app: guestbook
    tier: frontend
  annotations:
    podpreset.admission.kubernetes.io/podpreset-allow-database: "resource version"
spec:
  containers:
  - name: php-redis
    image: gcr.io/google_samples/gb-frontend:v3
    resources:
      requests:
        cpu: 100m
        memory: 100Mi
    volumeMounts:
    - mountPath: /cache
      name: cache-volume
    env:
    - name: GET_HOSTS_FROM
      value: dns
    - name: DB_PORT
      value: "6379"
    ports:
    - containerPort: 80
  volumes:
  - name: cache-volume
    emptyDir: {}
```

<!--
### Multiple PodPreset Example

This is an example to show how a Pod spec is modified by multiple Pod
Injection Policies.

**User submitted pod spec:**
-->
### 多 PodPreset 示例

这里的示例展示了如何通过多个 Pod 注入策略修改 Pod spec。

**用户提交的 pod spec：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      ports:
        - containerPort: 80
```

<!--
**Example Pod Preset:**
-->
**Pod Preset 示例：**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  env:
    - name: DB_PORT
      value: "6379"
  volumeMounts:
    - mountPath: /cache
      name: cache-volume
  volumes:
    - name: cache-volume
      emptyDir: {}
```

<!--
**Another Pod Preset:**
-->

**另一个 Pod Preset：**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: proxy
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  volumeMounts:
    - mountPath: /etc/proxy/configs
      name: proxy-volume
  volumes:
    - name: proxy-volume
      emptyDir: {}
```

<!--
**Pod spec after admission controller:**
-->
**通过准入控制器后的 Pod spec：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
  annotations:
    podpreset.admission.kubernetes.io/podpreset-allow-database: "resource version"
    podpreset.admission.kubernetes.io/podpreset-proxy: "resource version"
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
        - mountPath: /etc/proxy/configs
          name: proxy-volume
      ports:
        - containerPort: 80
      env:
        - name: DB_PORT
          value: "6379"
  volumes:
    - name: cache-volume
      emptyDir: {}
    - name: proxy-volume
      emptyDir: {}
```

<!--
### Conflict Example

This is an example to show how a Pod spec is not modified by the Pod Preset
when there is a conflict.

**User submitted pod spec:**
-->
### 冲突示例

这里的示例展示了 Pod Preset 与原 Pod 存在冲突时，Pod spec 不会被修改。

**用户提交的 pod spec：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
      ports:
  volumes:
    - name: cache-volume
      emptyDir: {}
        - containerPort: 80
```

<!--
**Example Pod Preset:**
-->
**Pod Preset 示例：**

```yaml
kind: PodPreset
apiVersion: settings.k8s.io/v1alpha1
metadata:
  name: allow-database
  namespace: myns
spec:
  selector:
    matchLabels:
      role: frontend
  env:
    - name: DB_PORT
      value: "6379"
  volumeMounts:
    - mountPath: /cache
      name: other-volume
  volumes:
    - name: other-volume
      emptyDir: {}
```

<!--
**Pod spec after admission controller will not change because of the conflict:**
-->
**因存在冲突，通过准入控制器后的 Pod spec 不会改变：**

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: website
  labels:
    app: website
    role: frontend
spec:
  containers:
    - name: website
      image: ecorp/website
      volumeMounts:
        - mountPath: /cache
          name: cache-volume
      ports:
        - containerPort: 80
  volumes:
    - name: cache-volume
      emptyDir: {}
```

<!--
**If we run `kubectl describe...` we can see the event:**
-->
**如果运行 `kubectl describe...` 用户会看到以下事件：**

```
$ kubectl describe ...
....
Events:
  FirstSeen             LastSeen            Count   From                    SubobjectPath               Reason      Message
  Tue, 07 Feb 2017 16:56:12 -0700   Tue, 07 Feb 2017 16:56:12 -0700 1   {podpreset.admission.kubernetes.io/podpreset-allow-database }    conflict  Conflict on pod preset. Duplicate mountPath /cache.
```

<!--
## Deleting a Pod Preset

Once you don't need a pod preset anymore, you can delete it with `kubectl`:
-->
## 删除 Pod Preset

一旦用户不再需要 pod preset，可以使用 `kubectl` 进行删除：

```shell
$ kubectl delete podpreset allow-database
podpreset "allow-database" deleted
```

