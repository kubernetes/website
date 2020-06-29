---
reviewers:
- thockin
- bowei
content_type: concept
title: 调试 Service
---

<!--
---
reviewers:
- thockin
- bowei
content_type: concept
title: Debug Services
---
-->

<!-- overview -->
<!--
An issue that comes up rather frequently for new installations of Kubernetes is
that a `Service` is not working properly.  You've run your `Deployment` and
created a `Service`, but you get no response when you try to access it.
This document will hopefully help you to figure out what's going wrong.
-->
对于新安装的 Kubernetes，经常出现的一个问题是 `Service` 没有正常工作。如果您已经运行了 `Deployment` 并创建了一个 `Service`，但是当您尝试访问它时没有得到响应，希望这份文档能帮助您找出问题所在。




<!-- body -->

<!--
## Conventions

Throughout this doc you will see various commands that you can run.  Some
commands need to be run within a `Pod`, others on a Kubernetes `Node`, and others
can run anywhere you have `kubectl` and credentials for the cluster.  To make it
clear what is expected, this document will use the following conventions.

If the command "COMMAND" is expected to run in a `Pod` and produce "OUTPUT":

```shell
u@pod$ COMMAND
OUTPUT
```

If the command "COMMAND" is expected to run on a `Node` and produce "OUTPUT":

```shell
u@node$ COMMAND
OUTPUT
```

If the command is "kubectl ARGS":

```shell
$ kubectl ARGS
OUTPUT
```
-->
## 约定

在整个文档中，您将看到各种可以运行的命令。有些命令需要在 `Pod` 中运行，有些命令需要在 Kubernetes `Node` 上运行，还有一些命令可以在您拥有 `kubectl` 和集群凭证的任何地方运行。为了明确预期的效果，本文档将使用以下约定。

如果命令 "COMMAND" 期望在 `Pod` 中运行，并且产生 "OUTPUT"：

```shell
u@pod$ COMMAND
OUTPUT
```

如果命令 "COMMAND" 期望在 `Node` 上运行，并且产生 "OUTPUT"：

```shell
u@node$ COMMAND
OUTPUT
```

如果命令是 "kubectl ARGS"：

```shell
$ kubectl ARGS
OUTPUT
```

<!--
## Running commands in a Pod

For many steps here you will want to see what a `Pod` running in the cluster
sees.  The simplest way to do this is to run an interactive busybox `Pod`:

```none
$ kubectl run -it --rm --restart=Never busybox --image=busybox sh
If you don't see a command prompt, try pressing enter.
/ #
```

If you already have a running `Pod` that you prefer to use, you can run a
command in it using:

```shell
$ kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```
-->
## 在 pod 中运行命令

对于这里的许多步骤，您可能希望知道运行在集群中的 `Pod` 看起来是什么样的。最简单的方法是运行一个交互式的 busybox `Pod`：


```none
$ kubectl run -it --rm --restart=Never busybox --image=busybox sh
如果你没有看到命令提示符，请尝试按 Enter 键。
/ #
```

如果您已经有了您喜欢使用的正在运行的 `Pod`，则可以运行一下命令去使用：

```shell
$ kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

<!--
## Setup

For the purposes of this walk-through, let's run some `Pods`.  Since you're
probably debugging your own `Service` you can substitute your own details, or you
can follow along and get a second data point.

```shell
$ kubectl run hostnames --image=k8s.gcr.io/serve_hostname \
                        --labels=app=hostnames \
                        --port=9376 \
                        --replicas=3
deployment.apps/hostnames created
```

`kubectl` commands will print the type and name of the resource created or mutated, which can then be used in subsequent commands.
{{< note >}}
This is the same as if you started the `Deployment` with the following YAML:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hostnames
spec:
  selector:
    matchLabels:
      app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: k8s.gcr.io/serve_hostname
        ports:
        - containerPort: 9376
          protocol: TCP
```
{{< /note >}}

Confirm your `Pods` are running:

```shell
$ kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```
-->
## 设置

为了完成本次演练的目的，我们先运行几个 `Pod`。因为可能正在调试您自己的 `Service`，所以，您可以使用自己的详细信息进行替换，或者，您也可以跟随并开始下面的步骤来获得第二个数据点。

```shell
$ kubectl run hostnames --image=k8s.gcr.io/serve_hostname \
                        --labels=app=hostnames \
                        --port=9376 \
                        --replicas=3
deployment.apps/hostnames created
```

`kubectl` 命令将打印创建或变更的资源的类型和名称，它们可以在后续命令中使用。
{{< note >}}
这与您使用以下 YAML 启动 `Deployment` 相同：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hostnames
spec:
  selector:
    matchLabels:
      app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: k8s.gcr.io/serve_hostname
        ports:
        - containerPort: 9376
          protocol: TCP
```
{{< /note >}}

确认您的 `Pods` 是运行状态:

```shell
$ kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

<!--
## Does the Service exist?

The astute reader will have noticed that we did not actually create a `Service`
yet - that is intentional.  This is a step that sometimes gets forgotten, and
is the first thing to check.

So what would happen if I tried to access a non-existent `Service`?  Assuming you
have another `Pod` that consumes this `Service` by name you would get something
like:

```shell
u@pod$ wget -O- hostnames
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

So the first thing to check is whether that `Service` actually exists:

```shell
$ kubectl get svc hostnames
No resources found.
Error from server (NotFound): services "hostnames" not found
```

So we have a culprit, let's create the `Service`.  As before, this is for the
walk-through - you can use your own `Service`'s details here.

```shell
$ kubectl expose deployment hostnames --port=80 --target-port=9376
service/hostnames exposed
```

And read it back, just to be sure:

```shell
$ kubectl get svc hostnames
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

As before, this is the same as if you had started the `Service` with YAML:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```

Now you can confirm that the `Service` exists.
-->
## Service 存在吗？

细心的读者会注意到我们还没有真正创建一个 `Service` - 其实这是我们有意的。这是一个有时会被遗忘的步骤，也是第一件要检查的事情。

那么，如果我试图访问一个不存在的 `Service`，会发生什么呢？假设您有另一个 `Pod`，想通过名称使用这个 `Service`，您将得到如下内容：

```shell
u@pod$ wget -O- hostnames
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

因此，首先要检查的是 `Service` 是否确实存在：

```shell
$ kubectl get svc hostnames
No resources found.
Error from server (NotFound): services "hostnames" not found
```

我们已经有一个罪魁祸首了，让我们来创建 `Service`。就像前面一样，这里的内容仅仅是为了步骤的执行 - 在这里您可以使用自己的 `Service` 细节。

```shell
$ kubectl expose deployment hostnames --port=80 --target-port=9376
service/hostnames exposed
```

再查询一遍，确定一下：

```shell
$ kubectl get svc hostnames
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

与前面相同，这与您使用 YAML 启动的 `Service` 一样：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```

现在您可以确认 `Service` 存在。

<!--
## Does the Service work by DNS?

From a `Pod` in the same `Namespace`:

```shell
u@pod$ nslookup hostnames
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

If this fails, perhaps your `Pod` and `Service` are in different
`Namespaces`, try a namespace-qualified name:

```shell
u@pod$ nslookup hostnames.default
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

If this works, you'll need to adjust your app to use a cross-namespace name, or
run your app and `Service` in the same `Namespace`.  If this still fails, try a
fully-qualified name:

```shell
u@pod$ nslookup hostnames.default.svc.cluster.local
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

Note the suffix here: "default.svc.cluster.local".  The "default" is the
`Namespace` we're operating in.  The "svc" denotes that this is a `Service`.
The "cluster.local" is your cluster domain, which COULD be different in your
own cluster.

You can also try this from a `Node` in the cluster:

{{< note >}}
10.0.0.10 is my DNS `Service`, yours might be different).
{{< /note >}}

```shell
u@node$ nslookup hostnames.default.svc.cluster.local 10.0.0.10
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

If you are able to do a fully-qualified name lookup but not a relative one, you
need to check that your `/etc/resolv.conf` file is correct.

```shell
u@pod$ cat /etc/resolv.conf
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

The `nameserver` line must indicate your cluster's DNS `Service`.  This is
passed into `kubelet` with the `--cluster-dns` flag.

The `search` line must include an appropriate suffix for you to find the
`Service` name.  In this case it is looking for `Services` in the local
`Namespace` (`default.svc.cluster.local`), `Services` in all `Namespaces`
(`svc.cluster.local`), and the cluster (`cluster.local`).  Depending on your own
install you might have additional records after that (up to 6 total).  The
cluster suffix is passed into `kubelet` with the `--cluster-domain` flag.  We
assume that is "cluster.local" in this document, but yours might be different,
in which case you should change that in all of the commands above.

The `options` line must set `ndots` high enough that your DNS client library
considers search paths at all.  Kubernetes sets this to 5 by default, which is
high enough to cover all of the DNS names it generates.
-->
## Service 是否通过 DNS 工作？

从相同 `Namespace` 下的 `Pod` 中运行：

```shell
u@pod$ nslookup hostnames
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

如果失败，那么您的 `Pod` 和 `Service` 可能位于不同的 `Namespace` 中，请尝试使用限定命名空间的名称：

```shell
u@pod$ nslookup hostnames.default
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

如果成功，那么需要调整您的应用，使用跨命名空间的名称去访问服务，或者，在相同的 `Namespace` 中运行应用和 `Service`。如果仍然失败，请尝试一个完全限定的名称：

```shell
u@pod$ nslookup hostnames.default.svc.cluster.local
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

注意这里的后缀："default.svc.cluster.local"。"default" 是我们正在操作的 `Namespace`。"svc" 表示这是一个 `Service`。"cluster.local" 是您的集群域，在您自己的集群中可能会有所不同。

您也可以在集群中的 Node 上尝试此操作：

{{< note >}}
10.0.0.10 是我的 DNS `Service`，您的可能不同）.
{{< /note >}}

```shell
u@node$ nslookup hostnames.default.svc.cluster.local 10.0.0.10
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

如果您能够使用完全限定的名称查找，但不能使用相对名称，则需要检查 `/etc/resolv.conf` 文件是否正确。

```shell
u@pod$ cat /etc/resolv.conf
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

`nameserver` 行必须指示您的集群的 DNS `Service`，它通过 `--cluster-dns` 标志传递到 `kubelet`。

`search` 行必须包含一个适当的后缀，以便查找 `Service` 名称。在本例中，它在本地 `Namespace`（`default.svc.cluster.local`）、所有 `Namespace` 中的 `Service`（`svc.cluster.local`）以及集群（`cluster.local`）中查找服务。 根据您自己的安装情况，可能会有额外的记录（最多 6 条）。集群后缀通过 `--cluster-domain` 标志传递给 `kubelet`。 本文档中，我们假定它是 “cluster.local”，但是您的可能不同，这种情况下，您应该在上面的所有命令中更改它。

`options` 行必须设置足够高的 `ndots`，以便 DNS 客户端库考虑搜索路径。在默认情况下，Kubernetes 将这个值设置为 5，这个值足够高，足以覆盖它生成的所有 DNS 名称。

<!--
### Does any Service exist in DNS?

If the above still fails - DNS lookups are not working for your `Service` - we
can take a step back and see what else is not working.  The Kubernetes master
`Service` should always work:

```shell
u@pod$ nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

If this fails, you might need to go to the kube-proxy section of this doc, or
even go back to the top of this document and start over, but instead of
debugging your own `Service`, debug DNS.

## Does the Service work by IP?

Assuming we can confirm that DNS works, the next thing to test is whether your
`Service` works at all.  From a node in your cluster, access the `Service`'s
IP (from `kubectl get` above).

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton

u@node$ curl 10.0.1.175:80
hostnames-yp2kp

u@node$ curl 10.0.1.175:80
hostnames-bvc05
```

If your `Service` is working, you should get correct responses.  If not, there
are a number of things that could be going wrong.  Read on.
-->
### DNS 中是否存在任何服务？

如果上面仍然失败 - DNS 查找不到您需要的 `Service` - 我们可以后退一步，看看还有什么不起作用。Kubernetes 主 `Service` 应该一直是工作的：

```shell
u@pod$ nslookup kubernetes.default
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

如果失败，您可能需要转到这个文档的 kube-proxy 部分，或者甚至回到文档的顶部重新开始，但不是调试您自己的 `Service`，而是调试 DNS。

### Service 能够通过 IP 访问么？

假设我们可以确认 DNS 工作正常，那么接下来要测试的是您的 `Service` 是否工作正常。从集群中的一个节点，访问 `Service` 的 IP（从上面的 `kubectl get` 命令获取）。

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton

u@node$ curl 10.0.1.175:80
hostnames-yp2kp

u@node$ curl 10.0.1.175:80
hostnames-bvc05
```

如果 `Service` 是正常的，您应该得到正确的响应。如果没有，有很多可能出错的地方，请继续。

<!--
## Is the Service correct?

It might sound silly, but you should really double and triple check that your
`Service` is correct and matches your `Pod`'s port.  Read back your `Service`
and verify it:

```shell
$ kubectl get service hostnames -o json
```
```json
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "hostnames",
        "namespace": "default",
        "uid": "428c8b6c-24bc-11e5-936d-42010af0a9bc",
        "resourceVersion": "347189",
        "creationTimestamp": "2015-07-07T15:24:29Z",
        "labels": {
            "app": "hostnames"
        }
    },
    "spec": {
        "ports": [
            {
                "name": "default",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376,
                "nodePort": 0
            }
        ],
        "selector": {
            "app": "hostnames"
        },
        "clusterIP": "10.0.1.175",
        "type": "ClusterIP",
        "sessionAffinity": "None"
    },
    "status": {
        "loadBalancer": {}
    }
}
```

Is the port you are trying to access in `spec.ports[]`?  Is the `targetPort`
correct for your `Pods` (many `Pods` choose to use a different port than the
`Service`)?  If you meant it to be a numeric port, is it a number (9376) or a
string "9376"?  If you meant it to be a named port, do your `Pods` expose a port
with the same name?  Is the port's `protocol` the same as the `Pod`'s?
-->
## Service 是对的吗？

这听起来可能很愚蠢，但您应该加倍甚至三倍检查您的 `Service` 是否正确，并且与您的 `Pod` 匹配。查看您的 `Service` 并验证它：

```shell
$ kubectl get service hostnames -o json
```
```json
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "hostnames",
        "namespace": "default",
        "selfLink": "/api/v1/namespaces/default/services/hostnames",
        "uid": "428c8b6c-24bc-11e5-936d-42010af0a9bc",
        "resourceVersion": "347189",
        "creationTimestamp": "2015-07-07T15:24:29Z",
        "labels": {
            "app": "hostnames"
        }
    },
    "spec": {
        "ports": [
            {
                "name": "default",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376,
                "nodePort": 0
            }
        ],
        "selector": {
            "app": "hostnames"
        },
        "clusterIP": "10.0.1.175",
        "type": "ClusterIP",
        "sessionAffinity": "None"
    },
    "status": {
        "loadBalancer": {}
    }
}
```

`spec.ports[]` 中描述的是您想要尝试访问的端口吗？`targetPort` 对您的 `Pod` 来说正确吗（许多 `Pod` 选择使用与 `Service` 不同的端口）？如果您想把它变成一个数字端口，那么它是一个数字（9376）还是字符串 “9376”？如果您想把它当作一个指定的端口，那么您的 `Pod` 是否公开了一个同名端口？端口的 `protocol` 和 `Pod` 的一样吗？

<!--
## Does the Service have any Endpoints?

If you got this far, we assume that you have confirmed that your `Service`
exists and is resolved by DNS.  Now let's check that the `Pods` you ran are
actually being selected by the `Service`.

Earlier we saw that the `Pods` were running.  We can re-check that:

```shell
$ kubectl get pods -l app=hostnames
NAME              READY     STATUS    RESTARTS   AGE
hostnames-0uton   1/1       Running   0          1h
hostnames-bvc05   1/1       Running   0          1h
hostnames-yp2kp   1/1       Running   0          1h
```

The "AGE" column says that these `Pods` are about an hour old, which implies that
they are running fine and not crashing.

The `-l app=hostnames` argument is a label selector - just like our `Service`
has.  Inside the Kubernetes system is a control loop which evaluates the
selector of every `Service` and saves the results into an `Endpoints` object.

```shell
$ kubectl get endpoints hostnames
NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

This confirms that the endpoints controller has found the correct `Pods` for
your `Service`.  If the `hostnames` row is blank, you should check that the
`spec.selector` field of your `Service` actually selects for `metadata.labels`
values on your `Pods`.  A common mistake is to have a typo or other error, such
as the `Service` selecting for `run=hostnames`, but the `Deployment` specifying
`app=hostnames`.
-->
## Service 有端点吗？

如果您已经走到了这一步，我们假设您已经确认您的 `Service` 存在，并能通过 DNS 解析。现在，让我们检查一下，您运行的 `Pod` 确实是由 `Service` 选择的。

早些时候，我们已经看到 `Pod` 是运行状态。我们可以再检查一下：

```shell
$ kubectl get pods -l app=hostnames
NAME              READY     STATUS    RESTARTS   AGE
hostnames-0uton   1/1       Running   0          1h
hostnames-bvc05   1/1       Running   0          1h
hostnames-yp2kp   1/1       Running   0          1h
```

"AGE" 列表明这些 `Pod` 已经启动一个小时了，这意味着它们运行良好，而不是崩溃。

`-l app=hostnames` 参数是一个标签选择器 - 就像我们的 `Service` 一样。在 Kubernetes 系统中有一个控制循环，它评估每个 `Service` 的选择器，并将结果保存到 `Endpoints` 对象中。

```shell
$ kubectl get endpoints hostnames
NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

这证实 endpoints 控制器已经为您的 `Service` 找到了正确的 `Pods`。如果 `hostnames` 行为空，则应检查 `Service` 的 `spec.selector` 字段，以及您实际想选择的 `Pods` 的 `metadata.labels` 的值。常见的错误是输入错误或其他错误，例如 `Service` 想选择 `run=hostnames`，但是 `Deployment` 指定的是 `app=hostnames`。

<!--
## Are the Pods working?

At this point, we know that your `Service` exists and has selected your `Pods`.
Let's check that the `Pods` are actually working - we can bypass the `Service`
mechanism and go straight to the `Pods`.

{{< note >}}
These commands use the `Pod` port (9376), rather than the `Service` port (80).
{{< /note >}}

```shell
u@pod$ wget -qO- 10.244.0.5:9376
hostnames-0uton

pod $ wget -qO- 10.244.0.6:9376
hostnames-bvc05

u@pod$ wget -qO- 10.244.0.7:9376
hostnames-yp2kp
```

We expect each `Pod` in the `Endpoints` list to return its own hostname.  If
this is not what happens (or whatever the correct behavior is for your own
`Pods`), you should investigate what's happening there.  You might find
`kubectl logs` to be useful or `kubectl exec` directly to your `Pods` and check
service from there.

Another thing to check is that your `Pods` are not crashing or being restarted.
Frequent restarts could lead to intermittent connectivity issues.

```shell
$ kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

If the restart count is high, read more about how to [debug
pods](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/#debugging-pods).
-->
## Pod 正常工作吗？

到了这步，我们知道您的 `Service` 存在并选择了您的 `Pods`。让我们检查一下 `Pod` 是否真的在工作 - 我们可以绕过 `Service` 机制，直接进入 `Pod`。

{{< note >}}
这些命令使用的是 `Pod` 端口（9376），而不是 `Service` 端口（80）。
{{< /note >}}

```shell
u@pod$ wget -qO- 10.244.0.5:9376
hostnames-0uton

pod $ wget -qO- 10.244.0.6:9376
hostnames-bvc05

u@pod$ wget -qO- 10.244.0.7:9376
hostnames-yp2kp
```

我们期望的是 `Endpoints` 列表中的每个 `Pod` 返回自己的主机名。如果这没有发生（或者您自己的 `Pod` 的正确行为没有发生），您应该调查发生了什么。您会发现 `kubectl logs` 这个时候非常有用，或者使用 `kubectl exec` 直接进入到您的 `Pod`，并从那里检查服务。

另一件要检查的事情是，您的 Pod 没有崩溃或正在重新启动。频繁的重新启动可能会导致断断续续的连接问题。

```shell
$ kubectl get pods -l app=hostnames
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

如果重新启动计数很高，请查阅有关如何[调试 pods](/docs/tasks/debug-application-cluster/debug-pod-replication-controller/#debugging-pods) 获取更多信息。

<!--
## Is the kube-proxy working?

If you get here, your `Service` is running, has `Endpoints`, and your `Pods`
are actually serving.  At this point, the whole `Service` proxy mechanism is
suspect.  Let's confirm it, piece by piece.
-->
## kube-proxy 正常工作吗？

如果您到了这里，那么您的 `Service` 正在运行，也有 `Endpoints`，而您的 `Pod` 实际上也正在服务。在这一点上，整个 `Service` 代理机制是否正常就是可疑的了。我们来确认一下，一部分一部分来。

<!--
### Is kube-proxy running?

Confirm that `kube-proxy` is running on your `Nodes`.  You should get something
like the below:

```shell
u@node$ ps auxw | grep kube-proxy
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

Next, confirm that it is not failing something obvious, like contacting the
master.  To do this, you'll have to look at the logs.  Accessing the logs
depends on your `Node` OS.  On some OSes it is a file, such as
/var/log/kube-proxy.log, while other OSes use `journalctl` to access logs.  You
should see something like:

```none
I1027 22:14:53.995134    5063 server.go:200] Running in resource-only container "/kube-proxy"
I1027 22:14:53.998163    5063 server.go:247] Using iptables Proxier.
I1027 22:14:53.999055    5063 server.go:255] Tearing down userspace rules. Errors here are acceptable.
I1027 22:14:54.038140    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns-tcp" to [10.244.1.3:53]
I1027 22:14:54.038164    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns" to [10.244.1.3:53]
I1027 22:14:54.038209    5063 proxier.go:352] Setting endpoints for "default/kubernetes:https" to [10.240.0.2:443]
I1027 22:14:54.038238    5063 proxier.go:429] Not syncing iptables until Services and Endpoints have been received from master
I1027 22:14:54.040048    5063 proxier.go:294] Adding new service "default/kubernetes:https" at 10.0.0.1:443/TCP
I1027 22:14:54.040154    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns" at 10.0.0.10:53/UDP
I1027 22:14:54.040223    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns-tcp" at 10.0.0.10:53/TCP
```

If you see error messages about not being able to contact the master, you
should double-check your `Node` configuration and installation steps.

One of the possible reasons that `kube-proxy` cannot run correctly is that the
required `conntrack` binary cannot be found. This may happen on some Linux
systems, depending on how you are installing the cluster, for example, you are
installing Kubernetes from scratch. If this is the case, you need to manually
install the `conntrack` package (e.g. `sudo apt install conntrack` on Ubuntu)
and then retry.
-->
### kube-proxy 在运行吗？

确认 `kube-proxy` 正在您的 `Nodes` 上运行。您应该得到如下内容：

```shell
u@node$ ps auxw | grep kube-proxy
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

下一步，确认它并没有出现明显的失败，比如连接主节点失败。要做到这一点，您必须查看日志。访问日志取决于您的 `Node` 操作系统。在某些操作系统是一个文件，如 /var/log/messages kube-proxy.log，而其他操作系统使用 `journalctl` 访问日志。您应该看到类似的东西：

```none
I1027 22:14:53.995134    5063 server.go:200] Running in resource-only container "/kube-proxy"
I1027 22:14:53.998163    5063 server.go:247] Using iptables Proxier.
I1027 22:14:53.999055    5063 server.go:255] Tearing down userspace rules. Errors here are acceptable.
I1027 22:14:54.038140    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns-tcp" to [10.244.1.3:53]
I1027 22:14:54.038164    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns" to [10.244.1.3:53]
I1027 22:14:54.038209    5063 proxier.go:352] Setting endpoints for "default/kubernetes:https" to [10.240.0.2:443]
I1027 22:14:54.038238    5063 proxier.go:429] Not syncing iptables until Services and Endpoints have been received from master
I1027 22:14:54.040048    5063 proxier.go:294] Adding new service "default/kubernetes:https" at 10.0.0.1:443/TCP
I1027 22:14:54.040154    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns" at 10.0.0.10:53/UDP
I1027 22:14:54.040223    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns-tcp" at 10.0.0.10:53/TCP
```

如果您看到有关无法连接主节点的错误消息，则应再次检查节点配置和安装步骤。

`kube-proxy` 无法正确运行的可能原因之一是找不到所需的 `conntrack` 二进制文件。在一些 Linux 系统上，这也是可能发生的，这取决于您如何安装集群，例如，您正在从头开始安装 Kubernetes。如果是这样的话，您需要手动安装 `conntrack` 包（例如，在 Ubuntu 上使用 `sudo apt install conntrack`），然后重试。

<!--
### Is kube-proxy writing iptables rules?

One of the main responsibilities of `kube-proxy` is to write the `iptables`
rules which implement `Services`.  Let's check that those rules are getting
written.

The kube-proxy can run in "userspace" mode, "iptables" mode or "ipvs" mode.
Hopefully you are using the "iptables" mode or "ipvs" mode.  You
should see one of the following cases.

#### Userspace

```shell
u@node$ iptables-save | grep hostnames
-A KUBE-PORTALS-CONTAINER -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j REDIRECT --to-ports 48577
-A KUBE-PORTALS-HOST -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j DNAT --to-destination 10.240.115.247:48577
```

There should be 2 rules for each port on your `Service` (just one in this
example) - a "KUBE-PORTALS-CONTAINER" and a "KUBE-PORTALS-HOST".  If you do
not see these, try restarting `kube-proxy` with the `-V` flag set to 4, and
then look at the logs again.

Almost nobody should be using the "userspace" mode any more, so we won't spend
more time on it here.
-->
### kube-proxy 是否在写 iptables 规则？

`kube-proxy` 的主要职责之一是写实现 `Services` 的 `iptables` 规则。让我们检查一下这些规则是否已经被写好了。

kube-proxy 可以在 "userspace" 模式、 "iptables" 模式或者 "ipvs" 模式下运行。
希望您正在使用 "iptables" 模式或者 "ipvs" 模式。您应该看到以下情况之一。

#### Userpace

```shell
u@node$ iptables-save | grep hostnames
-A KUBE-PORTALS-CONTAINER -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j REDIRECT --to-ports 48577
-A KUBE-PORTALS-HOST -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames:default" -m tcp --dport 80 -j DNAT --to-destination 10.240.115.247:48577
```

您的 `Service` 上的每个端口应该有两个规则（本例中只有一个）- "KUBE-PORTALS-CONTAINER" 和 "KUBE-PORTALS-HOST"。如果您没有看到这些，请尝试将 `-V` 标志设置为 4 之后重新启动 `kube-proxy`，然后再次查看日志。

几乎没有人应该再使用 "userspace" 模式了，所以我们不会在这里花费更多的时间。

<!--
#### Iptables

```shell
u@node$ iptables-save | grep hostnames
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```

There should be 1 rule in `KUBE-SERVICES`, 1 or 2 rules per endpoint in
`KUBE-SVC-(hash)` (depending on `SessionAffinity`), one `KUBE-SEP-(hash)` chain
per endpoint, and a few rules in each `KUBE-SEP-(hash)` chain.  The exact rules
will vary based on your exact config (including node-ports and load-balancers).
-->
#### Iptables

```shell
u@node$ iptables-save | grep hostnames
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```

`KUBE-SERVICES` 中应该有 1 条规则，`KUBE-SVC-(hash)` 中每个端点有 1 或 2 条规则（取决于 `SessionAffinity`），每个端点中应有 1 条 `KUBE-SEP-(hash)` 链。准确的规则将根据您的确切配置（包括节点、端口组合以及负载均衡器设置）而有所不同。

<!--
#### IPVS

```shell
u@node$ ipvsadm -ln
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
...
TCP  10.0.1.175:80 rr
  -> 10.244.0.5:9376               Masq    1      0          0
  -> 10.244.0.6:9376               Masq    1      0          0
  -> 10.244.0.7:9376               Masq    1      0          0
...
```

IPVS proxy will create a virtual server for each service address(e.g. Cluster IP, External IP, NodePort IP, Load Balancer IP etc.) and some corresponding real servers for endpoints of the service, if any. In this example, service hostnames(`10.0.1.175:80`) has 3 endpoints(`10.244.0.5:9376`, `10.244.0.6:9376`, `10.244.0.7:9376`) and you'll get results similar to above.
-->
#### IPVS

```shell
u@node$ ipvsadm -ln
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
...
TCP  10.0.1.175:80 rr
  -> 10.244.0.5:9376               Masq    1      0          0
  -> 10.244.0.6:9376               Masq    1      0          0
  -> 10.244.0.7:9376               Masq    1      0          0
...
```

IPVS 代理将为每个服务器地址（例如集群 IP、外部 IP、节点端口 IP、负载均衡 IP等）创建虚拟服务器，并为服务的端点创建一些相应的真实服务器（如果有）。在这个例子中，服务器主机名（`10.0.1.175:80`）有 3 个端点(`10.244.0.5:9376`, `10.244.0.6:9376`, `10.244.0.7:9376`)，你会得到类似上面的结果。


<!--
### Is kube-proxy proxying?

Assuming you do see the above rules, try again to access your `Service` by IP:

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton
```

If this fails and you are using the userspace proxy, you can try accessing the
proxy directly.  If you are using the iptables proxy, skip this section.

Look back at the `iptables-save` output above, and extract the
port number that `kube-proxy` is using for your `Service`.  In the above
examples it is "48577".  Now connect to that:

```shell
u@node$ curl localhost:48577
hostnames-yp2kp
```

If this still fails, look at the `kube-proxy` logs for specific lines like:

```shell
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

If you don't see those, try restarting `kube-proxy` with the `-V` flag set to 4, and
then look at the logs again.
-->
### kube-proxy 在执行代理操作么？

假设您确实看到了上述规则，请再次尝试通过 IP 访问您的 `Service`：

```shell
u@node$ curl 10.0.1.175:80
hostnames-0uton
```

如果失败了，并且您正在使用 userspace 代理，您可以尝试直接访问代理。如果您使用的是 iptables 代理，请跳过本节。

回顾上面的 `iptables-save` 输出，并提取 `kube-proxy` 用于您的 `Service` 的端口号。在上面的例子中，它是 “48577”。现在连接到它：

```shell
u@node$ curl localhost:48577
hostnames-yp2kp
```

如果仍然失败，请查看 `kube-proxy` 日志中的特定行，如：

```shell
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

如果您没有看到这些，请尝试将 `-V` 标志设置为 4 并重新启动 `kube-proxy`，然后再查看日志。

<!--
### A Pod cannot reach itself via Service IP

This can happen when the network is not properly configured for "hairpin"
traffic, usually when `kube-proxy` is running in `iptables` mode and Pods
are connected with bridge network. The `Kubelet` exposes a `hairpin-mode`
[flag](/docs/admin/kubelet/) that allows endpoints of a Service to loadbalance back to themselves
if they try to access their own Service VIP. The `hairpin-mode` flag must either be
set to `hairpin-veth` or `promiscuous-bridge`.

The common steps to trouble shoot this are as follows:

* Confirm `hairpin-mode` is set to `hairpin-veth` or `promiscuous-bridge`.
You should see something like the below. `hairpin-mode` is set to
`promiscuous-bridge` in the following example.

```shell
u@node$ ps auxw|grep kubelet
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0

```

* Confirm the effective `hairpin-mode`. To do this, you'll have to look at
kubelet log. Accessing the logs depends on your Node OS. On some OSes it
is a file, such as /var/log/kubelet.log, while other OSes use `journalctl`
to access logs. Please be noted that the effective hairpin mode may not
match `--hairpin-mode` flag due to compatibility. Check if there is any log
lines with key word `hairpin` in kubelet.log. There should be log lines
indicating the effective hairpin mode, like something below.

```shell
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* If the effective hairpin mode is `hairpin-veth`, ensure the `Kubelet` has
the permission to operate in `/sys` on node. If everything works properly,
you should see something like:

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
1
1
1
1
```

* If the effective hairpin mode is `promiscuous-bridge`, ensure `Kubelet`
has the permission to manipulate linux bridge on node. If cbr0` bridge is
used and configured properly, you should see:

```shell
u@node$ ifconfig cbr0 |grep PROMISC
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1

```

* Seek help if none of above works out.
-->
### Pod 无法通过 Service IP 访问自己

如果网络没有为“发夹模式”流量生成正确配置，通常当 `kube-proxy` 以 `iptables` 模式运行，并且 Pod 与桥接网络连接时，就会发生这种情况。`Kubelet` 公开了一个 `hairpin-mode` 标志，如果 pod 试图访问它们自己的 Service VIP，就可以让 Service 的端点重新负载到他们自己身上。`hairpin-mode` 标志必须设置为 `hairpin-veth` 或者 `promiscuous-bridge`。

解决这一问题的常见步骤如下：

* 确认 `hairpin-mode` 被设置为 `hairpin-veth` 或者 `promiscuous-bridge`。您应该看到下面这样的内容。在下面的示例中，`hairpin-mode` 被设置为 `promiscuous-bridge`。

```shell
u@node$ ps auxw|grep kubelet
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0

```

* 确认有效的 `hairpin-mode`。要做到这一点，您必须查看 kubelet 日志。访问日志取决于节点的操作系统。在一些操作系统上，它是一个文件，如 /var/log/kubelet.log，而其他操作系统则使用 `journalctl` 访问日志。请注意，由于兼容性，有效的 `hairpin-mode` 可能不匹配 `--hairpin-mode` 标志。在 kubelet.log 中检查是否有带有关键字 `hairpin` 的日志行。应该有日志行指示有效的 `hairpin-mode`，比如下面的内容。
```shell
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* 如果有效的发夹模式是 `hairpin-veth`，请确保 `Kubelet` 具有在节点上的 `/sys` 中操作的权限。如果一切正常工作，您应该看到如下内容：

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
1
1
1
1
```

* 如果有效的发夹模式是 `promiscuous-bridge`，则请确保 `Kubelet` 拥有在节点上操纵 Linux 网桥的权限。如果正确使用和配置了 cbr0 网桥，您应该看到：

```shell
u@node$ ifconfig cbr0 |grep PROMISC
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1

```

* 如果上述任何一项都没有效果，请寻求帮助。

<!--
## Seek help

If you get this far, something very strange is happening.  Your `Service` is
running, has `Endpoints`, and your `Pods` are actually serving.  You have DNS
working, `iptables` rules installed, and `kube-proxy` does not seem to be
misbehaving.  And yet your `Service` is not working.  You should probably let
us know, so we can help investigate!

Contact us on
[Slack](/docs/troubleshooting/#slack) or
[Forum](https://discuss.kubernetes.io) or
[GitHub](https://github.com/kubernetes/kubernetes).
-->
## 寻求帮助

如果您走到这一步，那么就真的是奇怪的事情发生了。您的 `Service` 正在运行，有 `Endpoints`，您的 `Pods` 也确实在服务中。您的 DNS 正常，`iptables` 规则已经安装，`kube-proxy` 看起来也正常。然而 `Service` 不起作用。这种情况下，您应该让我们知道，这样我们可以帮助调查！

使用 [Slack](/docs/troubleshooting/#slack) 或者 [Forum](https://discuss.kubernetes.io) 或者 [GitHub](https://github.com/kubernetes/kubernetes) 联系我们。




## {{% heading "whatsnext" %}}


<!--
Visit [troubleshooting document](/docs/troubleshooting/) for more information.
-->
访问[故障排查文档](/docs/troubleshooting/)获取更多信息。



