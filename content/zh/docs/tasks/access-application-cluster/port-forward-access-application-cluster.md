<!--
---
title: Use Port Forwarding to Access Applications in a Cluster
content_template: templates/task
weight: 40
---
-->
---
title: 使用端口转发来访问集群中的应用
content_template: templates/task
weight: 40
---

{{% capture overview %}}

<!--
This page shows how to use `kubectl port-forward` to connect to a Redis
server running in a Kubernetes cluster. This type of connection can be useful
for database debugging.
-->
本文展示如何使用 `kubectl port-forward` 连接到在 Kubernetes 集群中运行的 Redis 服务。这种类型的连接对数据库调试很有用。
{{% /capture %}}


{{% capture prerequisites %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Install [redis-cli](http://redis.io/topics/rediscli).
-->
* 安装 [redis-cli](http://redis.io/topics/rediscli)。

{{% /capture %}}


{{% capture steps %}}

<!--
## Creating Redis deployment and service

1. Create a Redis deployment:
-->
## 创建 Redis deployment 和服务

1. 创建一个 Redis deployment：

       kubectl create -f https://k8s.io/docs/tutorials/stateless-application/guestbook/redis-master-deployment.yaml

<!--
    The output of a successful command verifies that the deployment was created:
-->
    查看输出是否成功，以验证是否成功创建 deployment：

        deployment "redis-master" created
 
<!--
    When the pod is ready, you can get:
-->
    当 pod 是 ready 时，您将得到：
       
       kubectl get pods

        NAME                            READY     STATUS    RESTARTS   AGE
        redis-master-765d459796-258hz   1/1       Running   0          50s

       kubectl get deployment
       
        NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
        redis-master 1         1         1            1           55s

       kubectl get rs
       
        NAME                      DESIRED   CURRENT   READY     AGE
        redis-master-765d459796   1         1         1         1m


<!--
2. Create a Redis service:
-->
2. 创建一个 Redis 服务：

       kubectl create -f https://k8s.io/docs/tutorials/stateless-application/guestbook/redis-master-service.yaml

<!--
    The output of a successful command verifies that the service was created:
-->
    查看输出是否成功，以验证是否成功创建服务：

        service "redis-master" created

<!--
    Check the service created:
-->
    检查服务是否创建：

       kubectl get svc | grep redis

        NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
        redis-master   ClusterIP   10.0.0.213   <none>        6379/TCP   27s

<!--
3. Verify that the Redis server is running in the pod and listening on port 6379:
-->
3. 验证 Redis 服务是否运行在 pod 中并且监听 6379 端口：

        
       kubectl get pods redis-master-765d459796-258hz --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
        

<!--
    The output displays the port:
-->
    输出应该显示端口：

        6379


<!--
## Forward a local port to a port on the pod

1.  `kubectl port-forward` allows using resource name, such as a service name, to select a matching pod to port forward to since Kubernetes v1.10.
-->
## 转发一个本地端口到 pod 端口

1. 从 Kubernetes v1.10 开始，`kubectl port-forward` 允许使用资源名称（例如服务名称）来选择匹配的 pod 来进行端口转发。

        kubectl port-forward redis-master-765d459796-258hz 6379:6379 

<!--
    which is the same as
-->
    这相当于

        kubectl port-forward pods/redis-master-765d459796-258hz 6379:6379

<!--
    or  
-->
    或者

        kubectl port-forward deployment/redis-master 6379:6379 

<!--
    or
-->
    或者

        kubectl port-forward rs/redis-master 6379:6379 

<!--
    or
-->
    或者

        kubectl port-forward svc/redis-master 6379:6379

<!--
    Any of the above commands works. The output is similar to this:
-->
    以上所有命令都应该有效。输出应该类似于：

        I0710 14:43:38.274550    3655 portforward.go:225] Forwarding from 127.0.0.1:6379 -> 6379
        I0710 14:43:38.274797    3655 portforward.go:225] Forwarding from [::1]:6379 -> 6379

<!--
2.  Start the Redis command line interface:
-->
2. 启动 Redis 命令行接口：

        redis-cli

<!--
3.  At the Redis command line prompt, enter the `ping` command:
-->
3. 在 Redis 命令行提示符下，输入 `ping` 命令：

        127.0.0.1:6379>ping

<!--
    A successful ping request returns PONG.
-->
    成功的 ping 请求应该返回 PONG。

{{% /capture %}}


{{% capture discussion %}}

<!--
## Discussion

Connections made to local port 6379 are forwarded to port 6379 of the pod that
is running the Redis server. With this connection in place you can use your
local workstation to debug the database that is running in the pod.
-->
## 讨论

与本地 6379 端口建立的连接将转发到运行 Redis 服务器的 pod 的 6379 端口。通过此连接，您可以使用本地工作站来调试在 pod 中运行的数据库。

{{< warning >}}
<!--
Due to known limitations, port forward today only works for TCP protocol.
The support to UDP protocol is being tracked in
[issue 47862](https://github.com/kubernetes/kubernetes/issues/47862).
-->
**警告：** 由于已知的限制，目前的端口转发仅适用于 TCP 协议。
在 [issue 47862](https://github.com/kubernetes/kubernetes/issues/47862) 中正在跟踪对 UDP 协议的支持。
{{< /warning >}}

{{% /capture %}}


{{% capture whatsnext %}}
<!--
Learn more about [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward).
-->
学习更多关于 [kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward)。
{{% /capture %}}



