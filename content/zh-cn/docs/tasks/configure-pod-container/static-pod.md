---
title: 创建静态 Pod
weight: 220
content_type: task
---
<!--
reviewers:
- jsafrane
title: Create static Pods
weight: 220
content_type: task
-->

<!-- overview -->

<!--
*Static Pods* are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Unlike Pods that are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}});
instead, the kubelet watches each static Pod (and restarts it if it fails).
-->
**静态 Pod** 在指定的节点上由 kubelet 守护进程直接管理，不需要
{{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}监管。
与由控制面管理的 Pod（例如，{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
不同；kubelet 监视每个静态 Pod（在它失败之后重新启动）。

<!--
Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.
The Pod names will be suffixed with the node hostname with a leading hyphen.
-->
静态 Pod 始终都会绑定到特定节点的 {{< glossary_tooltip term_id="kubelet" >}} 上。

kubelet 会尝试通过 Kubernetes API 服务器为每个静态 Pod
自动创建一个{{< glossary_tooltip text="镜像 Pod" term_id="mirror-pod" >}}。
这意味着节点上运行的静态 Pod 对 API 服务来说是可见的，但是不能通过 API 服务器来控制。
Pod 名称将把以连字符开头的节点主机名作为后缀。

{{< note >}}
<!--
If you are running clustered Kubernetes and are using static
Pods to run a Pod on every node, you should probably be using a
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} instead.
-->
如果你在运行一个 Kubernetes 集群，并且在每个节点上都运行一个静态 Pod，
就可能需要考虑使用 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}
替代这种方式。
{{< /note >}}

{{< note >}}
<!--
The `spec` of a static Pod cannot refer to other API objects
(e.g., {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}},
{{< glossary_tooltip text="Secret" term_id="secret" >}}, etc).
-->
静态 Pod 的 `spec` 不能引用其他 API 对象
（如：{{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}、
{{< glossary_tooltip text="Secret" term_id="secret" >}} 等）。
{{< /note >}}

{{< note >}}
<!--
Static pods do not support [ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/).
-->
静态 Pod 不支持[临时容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
This page assumes you're using {{< glossary_tooltip term_id="cri-o" >}} to run Pods,
and that your nodes are running the Fedora operating system.
Instructions for other distributions or Kubernetes installations may vary.
-->
本文假定你在使用 {{< glossary_tooltip term_id="docker" >}} 来运行 Pod，
并且你的节点是运行着 Fedora 操作系统。
其它发行版或者 Kubernetes 部署版本上操作方式可能不一样。

<!-- steps -->

<!--
## Create a static pod {#static-pod-creation}

You can configure a static Pod with either a
[file system hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#configuration-files)
or a [web hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http).
-->
## 创建静态 Pod {#static-pod-creation}

可以通过[文件系统上的配置文件](/zh-cn/docs/tasks/configure-pod-container/static-pod/#configuration-files)或者
[Web 网络上的配置文件](/zh-cn/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http)来配置静态 Pod。

<!--
### Filesystem-hosted static Pod manifest {#configuration-files}

Manifests are standard Pod definitions in JSON or YAML format in a specific directory.
Use the `staticPodPath: <the directory>` field in the
[kubelet configuration file](/docs/reference/config-api/kubelet-config.v1beta1/),
which periodically scans the directory and creates/deletes static Pods as YAML/JSON files appear/disappear there.
Note that the kubelet will ignore files starting with dots when scanning the specified directory.

For example, this is how to start a simple web server as a static Pod:
-->
### 文件系统上的静态 Pod 声明文件 {#configuration-files}

声明文件是标准的 Pod 定义文件，以 JSON 或者 YAML 格式存储在指定目录。路径设置在
[Kubelet 配置文件](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)的
`staticPodPath: <目录>` 字段，kubelet 会定期的扫描这个文件夹下的 YAML/JSON
文件来创建/删除静态 Pod。
注意 kubelet 扫描目录的时候会忽略以点开头的文件。

例如：下面是如何以静态 Pod 的方式启动一个简单 web 服务：

<!--
1. Choose a node where you want to run the static Pod. In this example, it's `my-node1`.
-->
1. 选择一个要运行静态 Pod 的节点。在这个例子中选择 `my-node1`。

   ```shell
   ssh my-node1
   ```

<!--
1. Choose a directory, say `/etc/kubernetes/manifests` and place a web server
   Pod definition there, for example `/etc/kubernetes/manifests/static-web.yaml`:

   # Run this command on the node where kubelet is running
-->
2. 选择一个目录，比如在 `/etc/kubernetes/manifests` 目录来保存 Web 服务 Pod 的定义文件，例如
   `/etc/kubernetes/manifests/static-web.yaml`：

   ```shell
   # 在 kubelet 运行的节点上执行以下命令
   mkdir -p /etc/kubernetes/manifests/
   cat <<EOF >/etc/kubernetes/manifests/static-web.yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: static-web
     labels:
       role: myrole
   spec:
     containers:
       - name: web
         image: nginx
         ports:
           - name: web
             containerPort: 80
             protocol: TCP
   EOF
   ```

<!--
1. Configure the kubelet on that node to set a `staticPodPath` value in the
   [kubelet configuration file](/docs/reference/config-api/kubelet-config.v1beta1/).  
   See [Set Kubelet Parameters Via A Configuration File](/docs/tasks/administer-cluster/kubelet-config-file/)
   for more information.

   An alternative and deprecated method is to configure the kubelet on that node
   to look for static Pod manifests locally, using a command line argument.
   To use the deprecated approach, start the kubelet with the
   `--pod-manifest-path=/etc/kubernetes/manifests/` argument.
-->
3. 在该节点上配置 kubelet，在 [kubelet 配置文件](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1/)中设定 `staticPodPath` 值。
   欲了解更多信息，请参考[通过配置文件设定 kubelet 参数](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)。

   另一个已弃用的方法是，在该节点上通过命令行参数配置 kubelet，以便从本地查找静态 Pod 清单。
   若使用这种弃用的方法，请启动 kubelet 时加上 `--pod-manifest-path=/etc/kubernetes/manifests/` 参数。
<!--
1. Restart the kubelet. On Fedora, you would run:

   ```shell
   # Run this command on the node where the kubelet is running
   systemctl restart kubelet
   ```
-->
4. 重启 kubelet。在 Fedora 上，你将使用下面的命令：

   ```shell
   # 在 kubelet 运行的节点上执行以下命令
   systemctl restart kubelet
   ```

<!--
### Web-hosted static pod manifest {#pods-created-via-http}

Kubelet periodically downloads a file specified by `--manifest-url=<URL>` argument
and interprets it as a JSON/YAML file that contains Pod definitions.
Similar to how [filesystem-hosted manifests](#configuration-files) work, the kubelet
refetches the manifest on a schedule. If there are changes to the list of static
Pods, the kubelet applies them.

To use this approach:
-->
### Web 网上的静态 Pod 声明文件 {#pods-created-via-http}

Kubelet 根据 `--manifest-url=<URL>` 参数的配置定期的下载指定文件，并且转换成
JSON/YAML 格式的 Pod 定义文件。
与[文件系统上的清单文件](#configuration-files)使用方式类似，kubelet 调度获取清单文件。
如果静态 Pod 的清单文件有改变，kubelet 会应用这些改变。

按照下面的方式来：

<!--
1. Create a YAML file and store it on a web server so that you can pass the URL of that file to the kubelet.
-->
1. 创建一个 YAML 文件，并保存在 Web 服务器上，这样你就可以将该文件的 URL 传递给 kubelet。

   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: static-web
     labels:
       role: myrole
   spec:
     containers:
       - name: web
         image: nginx
         ports:
           - name: web
             containerPort: 80
             protocol: TCP
   ```

<!--
1. Configure the kubelet on your selected node to use this web manifest by
   running it with `--manifest-url=<manifest-url>`.
   On Fedora, edit `/etc/kubernetes/kubelet` to include this line:
-->
2. 通过在选择的节点上使用 `--manifest-url=<manifest-url>` 配置运行 kubelet。
   在 Fedora 添加下面这行到 `/etc/kubernetes/kubelet`：

   ```shell
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<manifest-url>"
   ```

<!--
1. Restart the kubelet. On Fedora, you would run:

   ```shell
   # Run this command on the node where the kubelet is running
   systemctl restart kubelet
   ```
-->
3. 重启 kubelet。在 Fedora 上，你将运行如下命令：

   ```shell
   # 在 kubelet 运行的节点上执行以下命令
   systemctl restart kubelet
   ```

<!--
## Observe static pod behavior {#behavior-of-static-pods}

When the kubelet starts, it automatically starts all defined static Pods. As you have
defined a static Pod and restarted the kubelet, the new static Pod should
already be running.

You can view running containers (including static Pods) by running (on the node):
```shell
# Run this command on the node where the kubelet is running
crictl ps
```
-->
## 观察静态 Pod 的行为 {#behavior-of-static-pods}

当 kubelet 启动时，会自动启动所有定义的静态 Pod。
当定义了一个静态 Pod 并重新启动 kubelet 时，新的静态 Pod 就应该已经在运行了。

可以在节点上运行下面的命令来查看正在运行的容器（包括静态 Pod）：

```shell
# 在 kubelet 运行的节点上执行以下命令
crictl ps
```

<!--
The output might be something like:
-->
输出可能会像这样：

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
129fd7d382018   docker.io/library/nginx@sha256:...    11 minutes ago    Running    web     0          34533c6729106
```

{{< note >}}
<!--
`crictl` outputs the image URI and SHA-256 checksum. `NAME` will look more like:
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`.
-->
`crictl` 会输出镜像 URI 和 SHA-256 校验和。`NAME` 看起来像：
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`。
{{< /note >}}

<!--
You can see the mirror Pod on the API server:
-->
可以在 API 服务上看到镜像 Pod：

```shell
kubectl get pods
```

```
NAME                  READY   STATUS    RESTARTS        AGE
static-web-my-node1   1/1     Running   0               2m
```

{{< note >}}
<!--
Make sure the kubelet has permission to create the mirror Pod in the API server.
If not, the creation request is rejected by the API server.
-->
要确保 kubelet 在 API 服务上有创建镜像 Pod 的权限。如果没有，创建请求会被 API 服务拒绝。
{{< /note >}}

<!--
{{< glossary_tooltip term_id="label" text="Labels" >}} from the static Pod are
propagated into the mirror Pod. You can use those labels as normal via
{{< glossary_tooltip term_id="selector" text="selectors" >}}, etc.
-->
静态 Pod 上的{{< glossary_tooltip term_id="label" text="标签" >}}被传播到镜像 Pod。
你可以通过{{< glossary_tooltip term_id="selector" text="选择算符" >}}使用这些标签。

<!--
If you try to use `kubectl` to delete the mirror Pod from the API server,
the kubelet _doesn't_ remove the static Pod:
-->
如果你用 `kubectl` 从 API 服务上删除镜像 Pod，kubelet **不会**移除静态 Pod：

```shell
kubectl delete pod static-web-my-node1
```

```
pod "static-web-my-node1" deleted
```

<!--
You can see that the Pod is still running:
-->
可以看到 Pod 还在运行：

```shell
kubectl get pods
```

```
NAME                  READY   STATUS    RESTARTS   AGE
static-web-my-node1   1/1     Running   0          4s
```

<!--
Back on your node where the kubelet is running, you can try to stop the container manually.
You'll see that, after a time, the kubelet will notice and will restart the Pod
automatically:

```shell
# Run these commands on the node where the kubelet is running
crictl stop 129fd7d382018 # replace with the ID of your container
sleep 20
crictl ps
```
-->
回到 kubelet 运行所在的节点上，你可以手动停止容器。
可以看到过了一段时间后 kubelet 会发现容器停止了并且会自动重启 Pod：

```shell
# 在 kubelet 运行的节点上执行以下命令
# 把 ID 换为你的容器的 ID
crictl stop 129fd7d382018
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
89db4553e1eeb   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

<!--
Once you identify the right container, you can get the logs for that container with `crictl`:

```shell
# Run these commands on the node where the container is running
crictl logs <container_id>
```
-->
一旦你找到合适的容器，你就可以使用 `crictl` 获取该容器的日志。

```shell
# 在容器运行所在的节点上执行以下命令
crictl logs <container_id>
```

```console
10.240.0.48 - - [16/Nov/2022:12:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nov/2022:12:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nove/2022:12:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

<!--
To find more about how to debug using `crictl`, please visit
[_Debugging Kubernetes nodes with crictl_](/docs/tasks/debug/debug-cluster/crictl/).
-->
若要找到如何使用 `crictl` 进行调试的更多信息，
请访问[使用 crictl 对 Kubernetes 节点进行调试](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)。

<!--
## Dynamic addition and removal of static pods

The running kubelet periodically scans the configured directory
(`/etc/kubernetes/manifests` in our example) for changes and
adds/removes Pods as files appear/disappear in this directory.
-->
## 动态增加和删除静态 Pod  {#dynamic-addition-and-removal-of-static-pods}

运行中的 kubelet 会定期扫描配置的目录（比如例子中的 `/etc/kubernetes/manifests` 目录）中的变化，
并且根据文件中出现/消失的 Pod 来添加/删除 Pod。

<!--
```shell
# This assumes you are using filesystem-hosted static Pod configuration
# Run these commands on the node where the container is running
#
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
crictl ps
# You see that no nginx container is running
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
crictl ps
```
-->
```shell
# 这里假定你在用主机文件系统上的静态 Pod 配置文件
# 在容器运行所在的节点上执行以下命令
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
crictl ps
# 可以看到没有 nginx 容器在运行
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
f427638871c35   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```

## {{% heading "whatsnext" %}}

<!--
* [Generate static Pod manifests for control plane components](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifests-for-control-plane-components)
* [Generate static Pod manifest for local etcd](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifest-for-local-etcd)
* [Debugging Kubernetes nodes with `crictl`](/docs/tasks/debug/debug-cluster/crictl/)
* [Learn more about `crictl`](https://github.com/kubernetes-sigs/cri-tools).
* [Map `docker` CLI commands to `crictl`](/docs/reference/tools/map-crictl-dockercli/).
* [Set up etcd instances as static pods managed by a kubelet](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
-->
* [为控制面组件生成静态 Pod 清单](/zh-cn/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifests-for-control-plane-components)
* [为本地 etcd 生成静态 Pod 清单](/zh-cn/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifest-for-local-etcd)
* [使用 `crictl` 对 Kubernetes 节点进行调试](/zh-cn/docs/tasks/debug/debug-cluster/crictl/)
* 更多细节请参阅 [`crictl`](https://github.com/kubernetes-sigs/cri-tools)
* [从 `docker` CLI 命令映射到 `crictl`](/zh-cn/docs/reference/tools/map-crictl-dockercli/)
* [将 etcd 实例设置为由 kubelet 管理的静态 Pod](/zh-cn/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
