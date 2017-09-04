---
approvers:
- jsafrane
title: 静态 Pod
---

<!--
**If you are running clustered Kubernetes and are using static pods to run a pod on every node, you should probably be using a [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)!**
-->
**如果需要在集群环境中使用静态 pod 的方式在每个节点上都运行一个 pod，您应该考虑使用 [DaemonSet](/docs/concepts/workloads/controllers/daemonset/)！**

<!--
*Static pods* are managed directly by kubelet daemon on a specific node, without API server observing it. It does not have associated any replication controller, kubelet daemon itself watches it and restarts it when it crashes. There is no health check though. Static pods are always bound to one kubelet daemon and always run on the same node with it.
-->
*静态 pod* 在特定的节点上直接通过 kubelet 守护进程进行管理，API 服务无法管理。它没有跟任何的副本控制器进行关联，kubelet 守护进程对它进行监控，如果崩溃了，kubelet 守护进程会重启它。

<!--
Kubelet automatically creates so-called *mirror pod* on Kubernetes API server for each static pod, so the pods are visible there, but they cannot be controlled from the API server.
-->
Kubelet 通过 Kubernetes API 服务为每个静态 pod 创建 *镜像 pod*，这些镜像 pod 对于 API 服务是可见的，但是不受它控制。

<!--
## Static pod creation
-->
## 创建静态 pod

<!--
Static pod can be created in two ways: either by using configuration file(s) or by HTTP.
-->
静态 pod 能够通过两种方式创建：配置文件或者 HTTP。

<!--
### Configuration files
-->
### 配置文件

<!--
The configuration files are just standard pod definition in json or yaml format in specific directory. Use `kubelet --pod-manifest-path=<the directory>` to start kubelet daemon, which periodically scans the directory and creates/deletes static pods as yaml/json files appear/disappear there.
-->
配置文件要求放在指定目录，是 json 或者 yaml 格式描述的标准的 pod 定义文件。使用 `kubelet --pod-manifest-path=<the directory>` 启动 kubelet 守护进程，它就会定期扫描目录下面 yaml/json 文件的出现/消失，从而执行 pod 的创建/删除。

<!--
For example, this is how to start a simple web server as a static pod:
-->
这是如何启动一个简单的 Web 服务器作为静态 POD 的示例：

<!--
1. Choose a node where we want to run the static pod. In this example, it's `my-node1`.
-->
1. 选择一个想要运行静态 pod 的节点。在本例中，选择节点 `my-node1`。

    ```
    [joe@host ~] $ ssh my-node1
    ```

<!--
2. Choose a directory, say `/etc/kubelet.d` and place a web server pod definition there, e.g. `/etc/kubelet.d/static-web.yaml`:
-->
2. 选择一个命名为 `/etc/kubelet.d` 的目录，将 Web 服务的 pod 定义文件放在该目录下，例如：`/etc/kubelet.d/static-web.yaml`

    ```
    [root@my-node1 ~] $ mkdir /etc/kubernetes.d/
    [root@my-node1 ~] $ cat <<EOF >/etc/kubernetes.d/static-web.yaml
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
3. Configure your kubelet daemon on the node to use this directory by running it with `--pod-manifest-path=/etc/kubelet.d/` argument.
-->
3. 配置该节点上 kubelet 守护进程，将 `--pod-manifest-path=/etc/kubelet.d/` 添加到启动参数中。
    <!--
    On Fedora edit `/etc/kubernetes/kubelet` to include this line:
    -->
    在 Fedora 系统上，编辑 `/etc/kubernetes/kubelet` 文件，使其包括下面行：

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
    ```

	<!--
    Instructions for other distributions or Kubernetes installations may vary.
	-->
	其它 Kubernetes 环境可能有不同的指令。

<!--
4. Restart kubelet. On Fedora, this is:
-->
4. 重启 kubelet，在 Fedora 上，按照如下方式：

    ```
    [root@my-node1 ~] $ systemctl restart kubelet
    ```

<!--
## Pods created via HTTP
-->
## 通过 HTTP 创建静态 pod

<!--
Kubelet periodically downloads a file specified by `--manifest-url=<URL>` argument and interprets it as a json/yaml file with a pod definition. It works the same as `--pod-manifest-path=<directory>`, i.e. it's reloaded every now and then and changes are applied to running static pods (see below).
-->
Kubelet 定期的从参数 `--manifest-url=<URL>` 配置的地址下载文件，并将其解析为 json/yaml 格式的 pod 描述。它的工作原理与从 `--pod-manifest-path=<directory>` 中发现文件执行创建/更新静态 pod 是一样的，即，文件的每次更新都将应用到运行中的静态 pod 中(参见下面内容)。

<!--
## Behavior of static pods
-->
## 静态 pod 的行为

<!--
When kubelet starts, it automatically starts all pods defined in directory specified in `--pod-manifest-path=` or `--manifest-url=` arguments, i.e. our static-web.  (It may take some time to pull nginx image, be patient…):
-->
当 kubelet 启动时，它将自动启动通过参数 `--pod-manifest-path=` 指定的目录以及 `--manifest-url=` 指定的位置下定义的 pod，例如，我们的 static-web (由于它需要一些时间拉取 nginx 镜像，请您耐心等待)

```shell
[joe@my-node1 ~] $ docker ps
CONTAINER ID IMAGE         COMMAND  CREATED        STATUS         PORTS     NAMES
f6d05272b57e nginx:latest  "nginx"  8 minutes ago  Up 8 minutes             k8s_web.6f802af4_static-web-fk-node1_default_67e24ed9466ba55986d120c867395f3c_378e5f3c
```

<!--
If we look at our Kubernetes API server (running on host `my-master`), we see that a new mirror-pod was created there too:
-->
查看 Kubernetes API 服务(运行在主机 `my-master` 上)，我们也将看到一个新的 `mirror-pod` 被创建：

```shell
[joe@host ~] $ ssh my-master
[joe@my-master ~] $ kubectl get pods
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          2m

```

<!--
Labels from the static pod are propagated into the mirror-pod and can be used as usual for filtering.
-->
表明 pod 是静态 pod 的标签被设置到 `mirror-pod` 中，该标签可以像其它标签一样用于过滤。

<!--
Notice we cannot delete the pod with the API server (e.g. via [`kubectl`](/docs/user-guide/kubectl/) command), kubelet simply won't remove it.
-->
请注意，我们不能通过 API 服务去删除这些 pod (例如，通过 [`kubectl`](/docs/user-guide/kubectl/) 命令)，kubelet 根本不会删除它。

```shell
[joe@my-master ~] $ kubectl delete pod static-web-my-node1
pods/static-web-my-node1
[joe@my-master ~] $ kubectl get pods
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          12s

```

<!--
Back to our `my-node1` host, we can try to stop the container manually and see, that kubelet automatically restarts it in a while:
-->
回到 `my-node1` 主机上，尝试手动停止容器，我们将看到 kubelet 在一段时间之后会自动重启它：

```shell
[joe@host ~] $ ssh my-node1
[joe@my-node1 ~] $ docker stop f6d05272b57e
[joe@my-node1 ~] $ sleep 20
[joe@my-node1 ~] $ docker ps
CONTAINER ID        IMAGE         COMMAND                CREATED       ...
5b920cbaf8b1        nginx:latest  "nginx -g 'daemon of   2 seconds ago ...
```

<!--
## Dynamic addition and removal of static pods
-->
## 动态增加和删除静态 pod

<!--
Running kubelet periodically scans the configured directory (`/etc/kubelet.d` in our example) for changes and adds/removes pods as files appear/disappear in this directory.
-->
运行中的 kubelet 会定期扫描配置的目录(在我们的例子中是 `/etc/kubelet.d`)，根据目录中文件的出现/消失来确定 pod 新增/删除之类的变化。

```shell
[joe@my-node1 ~] $ mv /etc/kubelet.d/static-web.yaml /tmp
[joe@my-node1 ~] $ sleep 20
[joe@my-node1 ~] $ docker ps
// no nginx container is running
[joe@my-node1 ~] $ mv /tmp/static-web.yaml  /etc/kubelet.d/
[joe@my-node1 ~] $ sleep 20
[joe@my-node1 ~] $ docker ps
CONTAINER ID        IMAGE         COMMAND                CREATED           ...
e7a62e3427f1        nginx:latest  "nginx -g 'daemon of   27 seconds ago
```
