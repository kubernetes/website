---
title: Rancher 与 Ubuntu Kubernetes 集成
cn-approvers:
- chentao1596
---

<!-- ---
title: Rancher Integration with Ubuntu Kubernetes
content_template: templates/task
--- -->

{{% capture overview %}}

<!-- This repository explains how to deploy Rancher 2.0alpha on Canonical Kubernetes. -->

本文将介绍如何在 Canonical Kubernetes 集群上部署 Rancher 2.0 alpha。

<!-- These steps are currently in alpha/testing phase and will most likely change. -->
这些步骤目前处于 alpha/testing 阶段，未来很可能会发生变化。

<!-- The original documentation for this integration can be found at [https://github.com/CalvinHartwell/canonical-kubernetes-rancher/](https://github.com/CalvinHartwell/canonical-kubernetes-rancher/). -->

有关此集成的原始文档可以在 [https://github.com/CalvinHartwell/canonical-kubernetes-rancher/](https://github.com/CalvinHartwell/canonical-kubernetes-rancher/) 上找到。


{{% /capture %}}
{{% capture prerequisites %}}

<!-- To use this guide, you must have a working kubernetes cluster that was deployed using Canonical's juju. -->
本文假设你有一个已经通过 Juju 部署、正在运行的集群。

<!-- The full instructions for deploying Kubernetes with juju can be found at [/docs/getting-started-guides/ubuntu/installation/](/docs/getting-started-guides/ubuntu/installation/). -->

有关使用 juju 部署 Kubernetes 集群的完整指导，请参考 [/docs/getting-started-guides/ubuntu/installation/](/docs/getting-started-guides/ubuntu/installation/)。

{{% /capture %}}


{{% capture steps %}}

<!-- ## Deploying Rancher -->
## 部署 Rancher

<!-- To deploy Rancher, we just need to run the Rancher container workload on-top of Kubernetes.
Rancher provides their containers through dockerhub ([https://hub.docker.com/r/rancher/server/tags/](https://hub.docker.com/r/rancher/server/tags/)) and can be downloaded freely from the internet. -->

想要部署 Rancher，我们只需要在 Kubernetes 集群上运行 Rancher 容器工作负载即可。
Rancher 通过 dockerhub（[https://hub.docker.com/r/rancher/server/tags/](https://hub.docker.com/r/rancher/server/tags/)）
提供他们的容器镜像的免费下载。

<!-- If you're running your own registry or have an offline deployment,
the container should be downloaded and pushed to a private registry before proceeding. -->

如果您正在使用自己的镜像仓库，或进行离线部署，
那么，在开始部署之前，请先下载好这些容器镜像，将其推入私有镜像仓库中。

<!-- ### Deploying Rancher with a nodeport -->
### 使用 nodeport 部署 Rancher

<!-- First create a yaml file which defines how to deploy Rancher on kubernetes.
Save the file as cdk-rancher-nodeport.yaml: -->
首先创建一个 yaml 文件，该文件定义了如何在 kubernetes 上部署 Rancher。
将该文件保存为 cdk-rancher-nodeport.yaml：

```
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: default
    namespace: default
roleRef:
   kind: ClusterRole
   name: cluster-admin
   apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-admin
rules:
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
- nonResourceURLs:
  - '*'
  verbs:
  - '*'
---
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: rancher
  name: rancher
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rancher
      ima: pod
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: rancher
        ima: pod
    spec:
      containers:
      - image: rancher/server:preview
        imagePullPolicy: Always
        name: rancher
        ports:
        - containerPort: 80
        - containerPort: 443
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          timeoutSeconds: 30
        resources: {}
      restartPolicy: Always
      serviceAccountName: ""
status: {}
---
apiVersion: v1
kind: Service
metadata:
  name: rancher
  labels:
    app: rancher
spec:
  ports:
    - port: 443
      protocol: TCP
      targetPort: 443
  selector:
    app: rancher
---
apiVersion: v1
kind: Service
metadata:
  name: rancher-nodeport
spec:
  type: NodePort
  selector:
     app: rancher
  ports:
  - name: rancher-api
    protocol: TCP
    nodePort: 30443
    port: 443
    targetPort: 443
```

<!-- Once kubectl is running and working, run the following command to deploy Rancher: -->

kubectl 开始正常运行后，执行下面的命令开始部署 Rancher：

```
  kubectl apply -f cdk-rancher-nodeport.yaml
```

<!-- Now we need to open this nodeport so we can access it.
For that, we can use juju. We need to run the open-port command for each of the worker nodes in our cluster.
Inside the cdk-rancher-nodeport.yaml file, the nodeport has been set to 30443.
Below shows how to open the port on each of the worker nodes: -->

现在我们需要打开这个 nodeport，以供访问。
为此，我们可以使用 juju。我们需要在集群中的每个工作节点上运行 open-port 命令。
在 cdk-rancher-nodeport.yaml 文件中，nodeport 已设置为 30443。
下面的命令行展示如何在每个工作节点上打开端口：

<!-- ```
   # repeat this for each kubernetes worker in the cluster.
   juju run --unit kubernetes-worker/0 "open-port 30443"
   juju run --unit kubernetes-worker/1 "open-port 30443"
   juju run --unit kubernetes-worker/2 "open-port 30443"
``` -->

```
   # 在集群的每个工作节点上运行下面的命令行
   juju run --unit kubernetes-worker/0 "open-port 30443"
   juju run --unit kubernetes-worker/1 "open-port 30443"
   juju run --unit kubernetes-worker/2 "open-port 30443"
```

<!-- Rancher can now be accessed on this port through a worker IP or DNS entries if you have created them.
It is generally recommended that you create a DNS entry for each of the worker nodes in your cluster.
For example, if you have three worker nodes and you own the domain example.com,
you could create three A records, one for each worker in the cluster. -->

现在便可以通过工作节点的 IP 或 DNS 记录（如果已经创建）在此端口上访问 Rancher。
通常建议您为集群中的每个工作节点创建一条 DNS 记录。
例如，如果有三个工作节点并且域名是 example.com，则可以创建三条 A 记录，集群中的每个工作节点各一条。

<!-- As creating DNS entries is outside of the scope of this document,
we will use the freely available xip.io service which can return A records for an IP address
which is part of the domain name.
For example, if you have the domain rancher.35.178.130.245.xip.io,
the xip.io service will automatically return the IP address 35.178.130.245 as an
A record which is useful for testing purposes.
For your deployment, the IP address 35.178.130.245 should be replaced with one of your worker IP address,
which can be found using Juju or AWS: -->

由于创建 DNS 记录超出了本文关注的范围，
我们将使用免费服务 xip.io 来获得和 IP 地址相对应的 A 记录，IP 地址将是域名的一部分。
例如，如果有域名 rancher.35.178.130.245.xip.io，
则 xip.io 服务会自动将 IP 地址 35.178.130.245 作为 A 记录返回，这对测试相当有用。
至于您的部署，IP 地址 35.178.130.245 应该替换为集群工作节点的 IP 地址，这个 IP 地址可以通过 Juju 或 AWS 得到：

<!-- ```
 calvinh@ubuntu-ws:~/Source/cdk-rancher$ juju status

# ... output omitted.

Unit                      Workload  Agent  Machine  Public address  Ports                     Message
easyrsa/0*                active    idle   0        35.178.118.232                            Certificate Authority connected.
etcd/0*                   active    idle   1        35.178.49.31    2379/tcp                  Healthy with 3 known peers
etcd/1                    active    idle   2        35.177.99.171   2379/tcp                  Healthy with 3 known peers
etcd/2                    active    idle   3        35.178.125.161  2379/tcp                  Healthy with 3 known peers
kubeapi-load-balancer/0*  active    idle   4        35.178.37.87    443/tcp                   Loadbalancer ready.
kubernetes-master/0*      active    idle   5        35.177.239.237  6443/tcp                  Kubernetes master running.
  flannel/0*              active    idle            35.177.239.237                            Flannel subnet 10.1.27.1/24
kubernetes-worker/0*      active    idle   6        35.178.130.245  80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/2               active    idle            35.178.130.245                            Flannel subnet 10.1.82.1/24
kubernetes-worker/1       active    idle   7        35.178.121.29   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/3               active    idle            35.178.121.29                             Flannel subnet 10.1.66.1/24
kubernetes-worker/2       active    idle   8        35.177.144.76   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/1               active    idle            35.177.144.76

# Note the IP addresses for the kubernetes-workers in the example above.  You should pick one of the public addresses.
``` -->

```
 calvinh@ubuntu-ws:~/Source/cdk-rancher$ juju status

# ... 输出省略。

Unit                      Workload  Agent  Machine  Public address  Ports                     Message
easyrsa/0*                active    idle   0        35.178.118.232                            Certificate Authority connected.
etcd/0*                   active    idle   1        35.178.49.31    2379/tcp                  Healthy with 3 known peers
etcd/1                    active    idle   2        35.177.99.171   2379/tcp                  Healthy with 3 known peers
etcd/2                    active    idle   3        35.178.125.161  2379/tcp                  Healthy with 3 known peers
kubeapi-load-balancer/0*  active    idle   4        35.178.37.87    443/tcp                   Loadbalancer ready.
kubernetes-master/0*      active    idle   5        35.177.239.237  6443/tcp                  Kubernetes master running.
  flannel/0*              active    idle            35.177.239.237                            Flannel subnet 10.1.27.1/24
kubernetes-worker/0*      active    idle   6        35.178.130.245  80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/2               active    idle            35.178.130.245                            Flannel subnet 10.1.82.1/24
kubernetes-worker/1       active    idle   7        35.178.121.29   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/3               active    idle            35.178.121.29                             Flannel subnet 10.1.66.1/24
kubernetes-worker/2       active    idle   8        35.177.144.76   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/1               active    idle            35.177.144.76

# 注意上面输出中 kubernetes-worker 的 IP 地址，可以选一个用作设置。
```

<!-- Try opening up Rancher in your browser using the nodeport and the domain name or ip address: -->

尝试使用 nodeport 搭配域名或 IP 地址在浏览器中打开 Rancher：

<!-- ```
  # replace the IP address with one of your Kubernetes worker, find this from juju status command.
  wget https://35.178.130.245.xip.io:30443 --no-check-certificate

  # this should also work
  wget https://35.178.130.245:30443 --no-check-certificate
``` -->

```
  # 将 IP 地址替换为某个 Kubernetes 工作节点的公共地址，通过 juju status 命令进行查找。
  wget https://35.178.130.245.xip.io:30443 --no-check-certificate

  # 这条命令也应该能工作
  wget https://35.178.130.245:30443 --no-check-certificate
```

<!-- If you need to make any changes to the kubernetes configuration file,
edit the yaml file and then just use apply again: -->

如果需要对 kubernetes 配置文件进行任何更改，编辑 yaml 文件，再重新 apply 即可：

```
  kubectl apply -f cdk-rancher-nodeport.yaml
```

<!-- ### Deploying Rancher with an ingress rule -->
### 使用 ingress 规则部署 Rancher

<!-- It is also possible to deploy Rancher using an ingress rule.
This has the added benefit of not requiring additional ports to be opened up on
the Kubernetes cluster. First create a yaml file to describe the
deployment called cdk-rancher-ingress.yaml which should contain the following: -->

也可以使用 ingress 规则来部署 Rancher。
这还有另外一个好处，就是不需要在 Kubernetes 集群上打开额外的端口。
首先创建一个名为 cdk-rancher-ingress.yaml 的文件，内容如下：

```
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: default
    namespace: default
roleRef:
   kind: ClusterRole
   name: cluster-admin
   apiGroup: rbac.authorization.k8s.io
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: cluster-admin
rules:
- apiGroups:
  - '*'
  resources:
  - '*'
  verbs:
  - '*'
- nonResourceURLs:
  - '*'
  verbs:
  - '*'
---
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: rancher
  name: rancher
spec:
  replicas: 1
  selector:
    matchLabels:
      app: rancher
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: rancher
    spec:
      containers:
      - image: rancher/server:preview
        imagePullPolicy: Always
        name: rancher
        ports:
        - containerPort: 443
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          timeoutSeconds: 30
        resources: {}
      restartPolicy: Always
      serviceAccountName: ""
status: {}
---
apiVersion: v1
kind: Service
metadata:
  name: rancher
  labels:
    app: rancher
spec:
  ports:
    - port: 443
      targetPort: 443
      protocol: TCP
  selector:
    app: rancher
---
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
 name: rancher
 annotations:
   kubernetes.io/tls-acme: "true"
   ingress.kubernetes.io/secure-backends: "true"
spec:
 tls:
   - hosts:
     - rancher.34.244.118.135.xip.io
 rules:
   - host: rancher.34.244.118.135.xip.io
     http:
       paths:
         - path: /
           backend:
             serviceName: rancher
             servicePort: 443
```

<!-- It is generally recommended that you create a DNS entry for each of the worker nodes in your cluster.
For example, if you have three worker nodes and you own the domain example.com,
you could create three A records, one for each worker in the cluster. -->

通常建议您为集群中的每个工作节点创建一条 DNS 记录。
例如，如果有三个工作节点并且域名是 example.com，则可以创建三条 A 记录，集群中的每个工作节点各一条。

<!-- As creating DNS entries is outside of the scope of this tutorial, we will use the freely available xip.io service which can return A records for an IP address which is part of the domain name. For example, if you have the domain rancher.35.178.130.245.xip.io, the xip.io service will automatically return the IP address 35.178.130.245 as an A record which is useful for testing purposes. -->

由于创建 DNS 记录超出了本文关注的范围，
我们将使用免费服务 xip.io 来获得和 IP 地址相对应的 A 记录，IP 地址将是域名的一部分。
例如，如果有域名 rancher.35.178.130.245.xip.io，
则 xip.io 服务会自动将 IP 地址 35.178.130.245 作为 A 记录返回，这对测试相当有用。

<!-- For your deployment, the IP address 35.178.130.245 should be replaced with one of your worker IP address, which can be found using Juju or AWS: -->

至于您的部署，IP 地址 35.178.130.245 应该替换为集群工作节点的 IP 地址，这个 IP 地址可以通过 Juju 或 AWS 得到：

<!-- ```
 calvinh@ubuntu-ws:~/Source/cdk-rancher$ juju status

# ... output omitted.

Unit                      Workload  Agent  Machine  Public address  Ports                     Message
easyrsa/0*                active    idle   0        35.178.118.232                            Certificate Authority connected.
etcd/0*                   active    idle   1        35.178.49.31    2379/tcp                  Healthy with 3 known peers
etcd/1                    active    idle   2        35.177.99.171   2379/tcp                  Healthy with 3 known peers
etcd/2                    active    idle   3        35.178.125.161  2379/tcp                  Healthy with 3 known peers
kubeapi-load-balancer/0*  active    idle   4        35.178.37.87    443/tcp                   Loadbalancer ready.
kubernetes-master/0*      active    idle   5        35.177.239.237  6443/tcp                  Kubernetes master running.
  flannel/0*              active    idle            35.177.239.237                            Flannel subnet 10.1.27.1/24
kubernetes-worker/0*      active    idle   6        35.178.130.245  80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/2               active    idle            35.178.130.245                            Flannel subnet 10.1.82.1/24
kubernetes-worker/1       active    idle   7        35.178.121.29   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/3               active    idle            35.178.121.29                             Flannel subnet 10.1.66.1/24
kubernetes-worker/2       active    idle   8        35.177.144.76   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/1               active    idle            35.177.144.76

# Note the IP addresses for the kubernetes-workers in the example above.  You should pick one of the public addresses.
``` -->

```
 calvinh@ubuntu-ws:~/Source/cdk-rancher$ juju status

# ... 输出省略。

Unit                      Workload  Agent  Machine  Public address  Ports                     Message
easyrsa/0*                active    idle   0        35.178.118.232                            Certificate Authority connected.
etcd/0*                   active    idle   1        35.178.49.31    2379/tcp                  Healthy with 3 known peers
etcd/1                    active    idle   2        35.177.99.171   2379/tcp                  Healthy with 3 known peers
etcd/2                    active    idle   3        35.178.125.161  2379/tcp                  Healthy with 3 known peers
kubeapi-load-balancer/0*  active    idle   4        35.178.37.87    443/tcp                   Loadbalancer ready.
kubernetes-master/0*      active    idle   5        35.177.239.237  6443/tcp                  Kubernetes master running.
  flannel/0*              active    idle            35.177.239.237                            Flannel subnet 10.1.27.1/24
kubernetes-worker/0*      active    idle   6        35.178.130.245  80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/2               active    idle            35.178.130.245                            Flannel subnet 10.1.82.1/24
kubernetes-worker/1       active    idle   7        35.178.121.29   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/3               active    idle            35.178.121.29                             Flannel subnet 10.1.66.1/24
kubernetes-worker/2       active    idle   8        35.177.144.76   80/tcp,443/tcp,30443/tcp  Kubernetes worker running.
  flannel/1               active    idle            35.177.144.76

# 注意上面输出中 kubernetes-worker 的 IP 地址，可以选一个用作设置。
```

<!-- Looking at the output from the juju status above, the Public Address (35.178.130.245) can be used to create a xip.io DNS entry (rancher.35.178.130.245.xip.io) which should be placed into the cdk-rancher-ingress.yaml file. You could also create your own DNS entry as long as it resolves to each of the worker nodes or one of them it will work fine: -->

查看上面 juju status 的命令输出，可以拿公共地址（35.178.130.245）来创建 xip.io DNS记录（rancher.35.178.130.245.xip.io），记录可以加到 cdk-rancher-ingress.yaml 文件中。
你也同样可以创建自己的 DNS 记录，只要能解析到集群上的工作节点即可:

<!-- ```
  # The xip.io domain should appear in two places in the file, change both entries.
  cat cdk-rancher-ingress.yaml | grep xip.io
  - host: rancher.35.178.130.245.xip.io
``` -->

```
  # xip.io 在文件中会出现两次，请都替换修改。
  cat cdk-rancher-ingress.yaml | grep xip.io
  - host: rancher.35.178.130.245.xip.io
```

<!-- Once you've edited the ingress rule to reflect your DNS entries, run the kubectl apply -f cdk-rancher-ingress.yaml to deploy Kubernetes: -->

修改完 ingress 规则之后，可以运行 `kubectl apply -f cdk-rancher-ingress.yaml` 命令来更新 Kubernetes 集群：

```
 kubectl apply -f cdk-rancher-ingress.yaml
```

<!-- Rancher can now be accessed on the regular 443 through a worker IP or DNS entries if you have created them.
Try opening it up in your browser: -->

现在可以通过工作节点 IP 或者 DNS 记录（如果已创建）在常规的 443 上访问 Rancher。
尝试在浏览器中打开它：

<!-- ```
  # replace the IP address with one of your Kubernetes worker, find this from juju status command.
  wget https://35.178.130.245.xip.io:443 --no-check-certificate
``` -->

```
  # 将 IP 地址替换为某个 Kubernetes 工作节点的公共地址，通过 juju status 命令进行查找。
  wget https://35.178.130.245.xip.io:443 --no-check-certificate
```

<!-- If you need to make any changes to the kubernetes configuration file,
edit the yaml file and then just use apply again: -->

如果需要对 kubernetes 配置文件进行任何更改，请编辑 yaml 文件，再 apply：

```
  kubectl apply -f cdk-rancher-ingress.yaml
```

<!-- ### Removing Rancher -->
### 删除 Rancher

<!-- You can remove Rancher from your cluster using kubectl.
Deleting constructs in Kubernetes is as simple as creating them: -->

您可以使用 kubectl 从集群中删除 Rancher。
在 Kubernetes 中删除对象与创建它们的过程一样简单：

<!-- ```
  # If you used the nodeport example change the yaml filename if you used the ingress example.
  kubectl delete -f cdk-rancher-nodeport.yaml
``` -->

```
  # 使用 nodeport 示例（如果使用 ingress 示例，请修改文件名）
  kubectl delete -f cdk-rancher-nodeport.yaml
```

{{% /capture %}}
