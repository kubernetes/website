---
approvers:
- caseydavenport
- danwinship
title: 声明网络策略
content_type: task
---

<!-- overview -->


本文可以帮助您开始使用 Kubernetes 的 [NetworkPolicy API](/docs/concepts/services-networking/network-policies/) 声明网络策略去管理 Pod 之间的通信



## {{% heading "prerequisites" %}}



您首先需要有一个支持网络策略的 Kubernetes 集群。已经有许多支持 NetworkPolicy 的网络提供商，包括：

* [Calico](/docs/tasks/configure-pod-container/calico-network-policy/)
* [Romana](/docs/tasks/configure-pod-container/romana-network-policy/)
* [Weave 网络](/docs/tasks/configure-pod-container/weave-network-policy/)


**注意**：以上列表是根据产品名称按字母顺序排序，而不是按推荐或偏好排序。下面示例对于使用了上面任何提供商的 Kubernetes 集群都是有效的



<!-- steps -->


## 创建一个`nginx` deployment 并且通过服务将其暴露


为了查看 Kubernetes 网络策略是怎样工作的，可以从创建一个`nginx` deployment 并且通过服务将其暴露开始

```console
$ kubectl create deployment nginx --image=nginx
deployment "nginx" created
$ kubectl expose deployment nginx --port=80
service "nginx" exposed
```


在 default 命名空间下运行了两个 `nginx` pod，而且通过一个名字为 `nginx` 的服务进行了暴露

```console
$ kubectl get svc,pod
NAME                        CLUSTER-IP    EXTERNAL-IP   PORT(S)    AGE
svc/kubernetes              10.100.0.1    <none>        443/TCP    46m
svc/nginx                   10.100.0.16   <none>        80/TCP     33s

NAME                        READY         STATUS        RESTARTS   AGE
po/nginx-701339712-e0qfq    1/1           Running       0          35s
```


## 测试服务能够被其它的 pod 访问


您应该可以从其它的 pod 访问这个新的 `nginx` 服务。为了验证它，从 default 命名空间下的其它 pod 来访问该服务。请您确保在该命名空间下没有执行孤立动作。


启动一个 busybox 容器，然后在容器中使用 `wget` 命令去访问 `nginx` 服务：

```console
$ kubectl run busybox --rm -ti --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
/ #
```


## 限制访问 `nginx` 服务


如果说您想限制 `nginx` 服务，只让那些拥有标签 `access: true` 的 pod 访问它，那么您可以创建一个只允许从那些 pod 连接的 `NetworkPolicy`：

```yaml
kind: NetworkPolicy
apiVersion: networking.k8s.io/v1
metadata:
  name: access-nginx
spec:
  podSelector:
    matchLabels:
      app: nginx
  ingress:
  - from:
    - podSelector:
        matchLabels:
          access: "true"
```


## 为服务指定策略


使用 kubectl 工具根据上面的 nginx-policy.yaml 文件创建一个 NetworkPolicy：

```console
$ kubectl create -f nginx-policy.yaml
networkpolicy "access-nginx" created
```


## 当访问标签没有定义时测试访问服务


如果您尝试从没有设定正确标签的 pod 中去访问 `nginx` 服务，请求将会超时：

```console
$ kubectl run busybox --rm -ti --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
wget: download timed out
/ #
```


## 定义访问标签后再次测试


创建一个拥有正确标签的 pod，您将看到请求是被允许的：

```console
$ kubectl run busybox --rm -ti --labels="access=true" --image=busybox /bin/sh
Waiting for pod default/busybox-472357175-y0m47 to be running, status is Pending, pod ready: false

Hit enter for command prompt

/ # wget --spider --timeout=1 nginx
Connecting to nginx (10.100.0.16:80)
/ #
```



