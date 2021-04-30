---
title: 创建静态 Pod
weight: 170
content_type: task
---

<!-- overview -->

<!--
*Static Pods* are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Unlike Pods that are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}});
instead, the kubelet watches each static Pod (and restarts it if it crashes).
-->

*静态 Pod* 在指定的节点上由 kubelet 守护进程直接管理，不需要
{{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}} 监管。
与由控制面管理的 Pod（例如，{{< glossary_tooltip text="Deployment" term_id="deployment" >}}）
不同；kubelet 监视每个静态 Pod（在它崩溃之后重新启动）。

<!--
Static Pods are always bound to one {{< glossary_tooltip term_id="kubelet" >}} on a specific node.

The kubelet automatically tries to create a {{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.

{{< note >}}
If you are running clustered Kubernetes and are using static
Pods to run a Pod on every node, you should probably be using a
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}
instead.
{{< /note >}}
-->
静态 Pod 永远都会绑定到一个指定节点上的 {{< glossary_tooltip term_id="kubelet" >}}。

kubelet 会尝试通过 Kubernetes API 服务器为每个静态 Pod 自动创建一个
{{< glossary_tooltip text="镜像 Pod" term_id="mirror-pod" >}}。
这意味着节点上运行的静态 Pod 对 API 服务来说是可见的，但是不能通过 API 服务器来控制。

{{< note >}}
如果你在运行一个 Kubernetes 集群，并且在每个节点上都运行一个静态 Pod，
就可能需要考虑使用 {{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} 替代这种方式。
{{< /note >}}

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
This page assumes you're using {{< glossary_tooltip term_id="docker" >}} to run Pods,
and that your nodes are running the Fedora operating system.
Instructions for other distributions or Kubernetes installations may vary.
-->
本文假定你在使用 {{< glossary_tooltip term_id="docker" >}} 来运行 Pod，
并且你的节点是运行着 Fedora 操作系统。
其它发行版或者 Kubernetes 部署版本上操作方式可能不一样。

<!-- steps -->

<!--
## Create a static pod {#static-pod-creation}

You can configure a static Pod with either a [file system hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#configuration-files) or a [web hosted configuration file](/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http).
-->
## 创建静态 Pod {#static-pod-creation}

可以通过[文件系统上的配置文件](/zh/docs/tasks/configure-pod-container/static-pod/#configuration-files)
或者 [web 网络上的配置文件](/zh/docs/tasks/configure-pod-container/static-pod/#pods-created-via-http)
来配置静态 Pod。

<!--
### Filesystem-hosted static Pod manifest {#configuration-files}

Manifests are standard Pod definitions in JSON or YAML format in a specific directory. Use the `staticPodPath: <the directory>` field in the [KubeletConfiguration file](/docs/tasks/administer-cluster/kubelet-config-file), which periodically scans the directory and creates/deletes static Pods as YAML/JSON files appear/disappear there.
Note that the kubelet will ignore files starting with dots when scanning the specified directory.

For example, this is how to start a simple web server as a static Pod:
-->
### 文件系统上的静态 Pod 声明文件 {#configuration-files}

声明文件是标准的 Pod 定义文件，以 JSON 或者 YAML 格式存储在指定目录。路径设置在
[Kubelet 配置文件](/zh/docs/tasks/administer-cluster/kubelet-config-file/)
的 `staticPodPath: <目录>` 字段，kubelet 会定期的扫描这个文件夹下的 YAML/JSON
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
2. Choose a directory, say `/etc/kubelet.d` and place a web server Pod definition there, e.g. `/etc/kubelet.d/static-web.yaml`:

   ```shell
    # Run this command on the node where kubelet is running
    mkdir /etc/kubelet.d/
    cat <<EOF >/etc/kubelet.d/static-web.yaml
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
-->
2. 选择一个目录，比如在 `/etc/kubelet.d` 目录来保存 web 服务 Pod 的定义文件，
   `/etc/kubelet.d/static-web.yaml`：

   ```shell
   # 在 kubelet 运行的节点上执行以下命令
   mkdir /etc/kubelet.d/
   cat <<EOF >/etc/kubelet.d/static-web.yaml
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
1. Configure your kubelet on the node to use this directory by running it with `--pod-manifest-path=/etc/kubelet.d/` argument. On Fedora edit `/etc/kubernetes/kubelet` to include this line:

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
    ```
    or add the `staticPodPath: <the directory>` field in the [KubeletConfiguration file](/docs/tasks/administer-cluster/kubelet-config-file).
-->
3. 配置这个节点上的 kubelet，使用这个参数执行 `--pod-manifest-path=/etc/kubelet.d/`。
在 Fedora 上编辑 `/etc/kubernetes/kubelet` 以包含下行：

   ```
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
   ```
   或者在 [Kubelet配置文件](/zh/docs/tasks/administer-cluster/kubelet-config-file/)
   中添加 `staticPodPath: <目录>`字段。

<!--
1. Restart the kubelet. On Fedora, you would run:

    ```shell
    # Run this command on the node where the kubelet is running
    systemctl restart kubelet
    ```
-->
4. 重启 kubelet。Fedora 上使用下面的命令：

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
### Web 上的静态 Pod 声明文件 {#pods-created-via-http}

Kubelet 根据 `--manifest-url=<URL>` 参数的配置定期的下载指定文件，并且转换成
JSON/YAML 格式的 Pod 定义文件。
与[文件系统上的清单文件](#configuration-files)使用方式类似，kubelet 调度获取清单文件。
如果静态 Pod 的清单文件有改变，kubelet 会应用这些改变。

按照下面的方式来：

<!--
1. Create a YAML file and store it on a web server so that you can pass the URL of that file to the kubelet.
-->
1. 创建一个 YAML 文件，并保存在 web 服务上，为 kubelet 生成一个 URL。

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
2. Configure the kubelet on your selected node to use this web manifest by running it with `--manifest-url=<manifest-url>`. On Fedora, edit `/etc/kubernetes/kubelet` to include this line:
-->
2. 通过在选择的节点上使用 `--manifest-url=<manifest-url>` 配置运行 kubelet。
   在 Fedora 添加下面这行到 `/etc/kubernetes/kubelet` ：

   ```
   KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<manifest-url>"
   ```
<!--
3. Restart the kubelet. On Fedora, you would run:

    ```shell
    # Run this command on the node where the kubelet is running
    systemctl restart kubelet
    ```
-->
3. 重启 kubelet。在 Fedora 上运行如下命令：

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
# Run this command on the node where kubelet is running
docker ps
```

The output might be something like:
-->
## 观察静态 pod 的行为 {#behavior-of-static-pods}

当 kubelet 启动时，会自动启动所有定义的静态 Pod。
当定义了一个静态 Pod 并重新启动 kubelet 时，新的静态 Pod 就应该已经在运行了。

可以在节点上运行下面的命令来查看正在运行的容器（包括静态 Pod）：

```shell
# 在 kubelet 运行的节点上执行以下命令
docker ps
```

<!--
The output might be something like:
-->
输出可能会像这样：

```
CONTAINER ID IMAGE         COMMAND  CREATED        STATUS         PORTS     NAMES
f6d05272b57e nginx:latest  "nginx"  8 minutes ago  Up 8 minutes             k8s_web.6f802af4_static-web-fk-node1_default_67e24ed9466ba55986d120c867395f3c_378e5f3c
```

<!--
You can see the mirror Pod on the API server:
-->
可以在 API 服务上看到镜像 Pod：

```shell
kubectl get pods
```

```
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          2m
```

<!--
Make sure the kubelet has permission to create the mirror Pod in the API server. If not, the creation request is rejected by the API server. See
[PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/).
-->
{{< note >}}
要确保 kubelet 在 API 服务上有创建镜像 Pod 的权限。如果没有，创建请求会被 API 服务拒绝。
可以看[Pod安全策略](/zh/docs/concepts/policy/pod-security-policy/)。
{{< /note >}}

<!--
{{< glossary_tooltip term_id="label" text="Labels" >}} from the static Pod are
propagated into the mirror Pod. You can use those labels as normal via
{{< glossary_tooltip term_id="selector" text="selectors" >}}, etc.
-->
静态 Pod 上的{{< glossary_tooltip term_id="label" text="标签" >}} 被传到镜像 Pod。
你可以通过 {{< glossary_tooltip term_id="selector" text="选择算符" >}} 使用这些标签。

<!--
If you try to use `kubectl` to delete the mirror Pod from the API server,
the kubelet _doesn't_ remove the static Pod:
-->
如果你用 `kubectl` 从 API 服务上删除镜像 Pod，kubelet _不会_ 移除静态 Pod：

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
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          12s
```

<!--
Back on your node where the kubelet is running, you can try to stop the Docker
container manually.
You'll see that, after a time, the kubelet will notice and will restart the Pod
automatically:

```shell
# Run these commands on the node where the kubelet is running
docker stop f6d05272b57e # replace with the ID of your container
sleep 20
docker ps
```
-->
回到 kubelet 运行的节点上，可以手工停止 Docker 容器。
可以看到过了一段时间后 kubelet 会发现容器停止了并且会自动重启 Pod：

```shell
# 在 kubelet 运行的节点上执行以下命令
# 把 ID 换为你的容器的 ID
docker stop f6d05272b57e
sleep 20
docker ps
```

```
CONTAINER ID        IMAGE         COMMAND                CREATED       ...
5b920cbaf8b1        nginx:latest  "nginx -g 'daemon of   2 seconds ago ...
```

<!--
## Dynamic addition and removal of static pods

The running kubelet periodically scans the configured directory (`/etc/kubelet.d` in our example) for changes and adds/removes Pods as files appear/disappear in this directory.

```shell
# This assumes you are using filesystem-hosted static Pod configuration
# Run these commands on the node where the kubelet is running
#
mv /etc/kubelet.d/static-web.yaml /tmp
sleep 20
docker ps
# You see that no nginx container is running
mv /tmp/static-web.yaml  /etc/kubelet.d/
sleep 20
docker ps
```
-->
## 动态增加和删除静态 pod

运行中的 kubelet 会定期扫描配置的目录(比如例子中的 `/etc/kubelet.d` 目录)中的变化，
并且根据文件中出现/消失的 Pod 来添加/删除 Pod。

```shell
# 前提是你在用主机文件系统上的静态 Pod 配置文件
# 在 kubelet 运行的节点上执行以下命令
mv /etc/kubelet.d/static-web.yaml /tmp
sleep 20
docker ps
# 可以看到没有 nginx 容器在运行
mv /tmp/static-web.yaml  /etc/kubelet.d/
sleep 20
docker ps
```

```
CONTAINER ID        IMAGE         COMMAND                CREATED           ...
e7a62e3427f1        nginx:latest  "nginx -g 'daemon of   27 seconds ago
```
