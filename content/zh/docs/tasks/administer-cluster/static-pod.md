---
approvers:
- jsafrane
title: 静态 Pods
---

**如果你正在运行 Kubernetes 集群并且使用静态 pods 在每个节点上起一个 pod，那么最好使用 [DaemonSet](/cn/docs/concepts/workloads/controllers/daemonset/)!**

*静态 pods* 直接由特定节点上的 kubelet 进程来管理，不通过主控节点上的 API 服务器。静态 pod 不关联任何 replication controller，它由 kubelet 进程自己来监控，当 pod 崩溃时重启该 pod。对于静态 pod 没有健康检查。静态 pod 始终绑定在某一个 kubelet，并且始终运行在同一个节点上。

Kubelet 自动为每一个静态 pod 在 Kubernetes 的 API 服务器上创建一个镜像 Pod(Mirror Pod)，因此可以在 API 服务器查询到该 pod，但是不被 API 服务器控制(例如不能删除)。

## 静态 pod 创建

静态 pod 有两种创建方式：用配置文件或者通过 HTTP。

### 配置文件

配置文件就是放在特定目录下的标准的 JSON 或 YAML 格式的 pod 定义文件。用`kubelet --pod-manifest-path=<the directory>`来启动 kubelet 进程，kubelet 将会周期扫描<the directory>这个目录，根据这个目录下出现或消失的 YAML/JSON 文件来创建或删除静态 pod。

下面例子用静态 pod 的方式启动一个 nginx 的 Web 服务器：

1. 选择一个节点来运行静态 pod。这个例子中就是`my-node1`。

    ```
    [joe@host ~] $ ssh my-node1
    ```

2. 选择一个目录，例如/etc/kubelet.d，把 web 服务器的 pod 定义文件放在这个目录下，例如`/etc/kubelet.d/static-web.yaml`:

    ```
    [root@my-node1 ~] $ mkdir /etc/kubelet.d/
    [root@my-node1 ~] $ cat <<EOF >/etc/kubelet.d/static-web.yaml
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

3.配置节点上的 kubelet 使用这个目录，kubelet 启动时增加`--pod-manifest-path=/etc/kubelet.d/`参数。如果是 Fedora 系统，在 Kubelet 配置文件 /etc/kubernetes/kubelet 中添加下面这行：
	
    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
    ```

如果是其它 Linux 发行版或者其它 Kubernetes 安装方式，配置方法可能会不一样。

4. 重启 kubelet。如果是 Fedora 系统，就是：

    ```
    [root@my-node1 ~] $ systemctl restart kubelet
    ```

## 通过 HTTP 创建静态 Pods

Kubelet 周期地从 --manifest-url=<URL> 参数指定的地址下载文件，并且把它翻译成 JSON/YAML 格式的 pod 定义。此后的操作方式与 --pod-manifest-path=<directory> 相同，kubelet 会不时地重新下载该文件，当文件变化时对应地终止或启动静态 pod(如下)。

## 静态 pods 的动作行为

kubelet 启动时，由 `--pod-manifest-path=` 或者 `--manifest-url=` 参数指定的目录下定义的所有 pod 都会自动创建，例如，我们示例中的 static-web。 (可能要花些时间拉取 nginx 镜像，耐心等待...)

```shell
[joe@my-node1 ~] $ docker ps
CONTAINER ID IMAGE         COMMAND  CREATED        STATUS         PORTS     NAMES
f6d05272b57e nginx:latest  "nginx"  8 minutes ago  Up 8 minutes             k8s_web.6f802af4_static-web-fk-node1_default_67e24ed9466ba55986d120c867395f3c_378e5f3c
```

如果我们查看 Kubernetes 的 API 服务器(运行在主机 `my-master`)，可以看到这里创建了一个新的镜像 Pod：

```shell
[joe@host ~] $ ssh my-master
[joe@my-master ~] $ kubectl get pods
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          2m
```

静态 pod 的标签会传递给镜像 Pod，可以用来过滤或筛选。

需要注意的是，我们不能通过 API 服务器来删除静态 pod(例如，通过 [`kubectl`](/docs/user-guide/kubectl/) 命令)，kebelet 不会删除它。

```shell
[joe@my-master ~] $ kubectl delete pod static-web-my-node1
pods/static-web-my-node1
[joe@my-master ~] $ kubectl get pods
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          12s
```

返回`my-node1`主机，我们尝试手动终止容器，可以看到 kubelet 很快就会自动重启容器。

```shell
[joe@host ~] $ ssh my-node1
[joe@my-node1 ~] $ docker stop f6d05272b57e
[joe@my-node1 ~] $ sleep 20
[joe@my-node1 ~] $ docker ps
CONTAINER ID        IMAGE         COMMAND                CREATED       ...
5b920cbaf8b1        nginx:latest  "nginx -g 'daemon of   2 seconds ago ...
```

## 静态 pods 的动态增加和删除

运行中的 kubelet 周期扫描配置的目录(我们这个例子中就是`/etc/kubelet.d`)下文件的变化，当这个目录中有文件出现或消失时创建或删除 pods。

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
