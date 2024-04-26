---
title: 带 Pod 间通信的 Job
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---
<!--
title: Job with Pod-to-Pod Communication
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
-->

<!-- overview -->

<!--
In this example, you will run a Job in [Indexed completion mode](/blog/2021/04/19/introducing-indexed-jobs/) configured such that
the pods created by the Job can communicate with each other using pod hostnames rather than pod IP addresses.

Pods within a Job might need to communicate among themselves. The user workload running in each pod could query the Kubernetes API server
to learn the IPs of the other Pods, but it's much simpler to rely on Kubernetes' built-in DNS resolution.
-->
在此例中，你将以[索引完成模式](/blog/2021/04/19/introducing-indexed-jobs/)运行一个 Job，
并通过配置使得该 Job 所创建的各 Pod 之间可以使用 Pod 主机名而不是 Pod IP 地址进行通信。

某 Job 内的 Pod 之间可能需要通信。每个 Pod 中运行的用户工作负载可以查询 Kubernetes API
服务器以获知其他 Pod 的 IP，但使用 Kubernetes 内置的 DNS 解析会更加简单。

<!--
Jobs in Indexed completion mode automatically set the pods' hostname to be in the format of
`${jobName}-${completionIndex}`. You can use this format to deterministically build
pod hostnames and enable pod communication *without* needing to create a client connection to
the Kubernetes control plane to obtain pod hostnames/IPs via API requests. 

This configuration is useful
for use cases where pod networking is required but you don't want to depend on a network 
connection with the Kubernetes API server.
-->
索引完成模式下的 Job 自动将 Pod 的主机名设置为 `${jobName}-${completionIndex}` 的格式。
你可以使用此格式确定性地构建 Pod 主机名并启用 Pod 通信，无需创建到 Kubernetes
控制平面的客户端连接来通过 API 请求获取 Pod 主机名/IP。

此配置可用于需要 Pod 联网但不想依赖 Kubernetes API 服务器网络连接的使用场景。

## {{% heading "prerequisites" %}}

<!--
You should already be familiar with the basic use of [Job](/docs/concepts/workloads/controllers/job/).
-->
你应该已熟悉了 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的基本用法。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{<note>}}
<!--
If you are using MiniKube or a similar tool, you may need to take
[extra steps](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/)
to ensure you have DNS.
-->
如果你正在使用 MiniKube 或类似的工具，
你可能需要采取[额外的步骤](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/)来确保你拥有 DNS。
{{</note>}}

<!-- steps -->

<!--
## Starting a Job with Pod-to-Pod Communication

To enable pod-to-pod communication using pod hostnames in a Job, you must do the following:
-->
## 启动带 Pod 间通信的 Job   {#starting-a-job-with-pod-to-pod-communication}

要在某 Job 中启用使用 Pod 主机名的 Pod 间通信，你必须执行以下操作：

<!--
1. Set up a [headless Service](/docs/concepts/services-networking/service/#headless-services)
with a valid label selector for the pods created by your Job. The headless service must be in the same namespace as 
the Job. One easy way to do this is to use the `job-name: <your-job-name>` selector, since the `job-name` label will be automatically added by Kubernetes. This configuration will trigger the DNS system to create records of the hostnames of 
the pods running your Job.

2. Configure the headless service as subdomain service for the Job pods by including the following value in your Job template spec:
-->
1. 对于 Job 所创建的那些 Pod，
   使用一个有效的标签选择算符创建[无头服务](/zh-cn/docs/concepts/services-networking/service/#headless-services)。
   该无头服务必须位于与该 Job 相同的名字空间内。
   实现这一目的的一种简单的方式是使用 `job-name: <任务名称>` 作为选择算符，
   因为 `job-name` 标签将由 Kubernetes 自动添加。
   此配置将触发 DNS 系统为运行 Job 的 Pod 创建其主机名的记录。

2. 通过将以下值包括到你的 Job 模板规约中，针对该 Job 的 Pod，将无头服务配置为其子域服务：

   ```yaml
   subdomain: <无头服务的名称>
   ```

<!--
### Example 
Below is a working example of a Job with pod-to-pod communication via pod hostnames enabled.
The Job is completed only after all pods successfully ping each other using hostnames.
-->
### 示例    {#example}

以下是启用通过 Pod 主机名来完成 Pod 间通信的 Job 示例。
只有在使用主机名成功 ping 通所有 Pod 之后，此 Job 才会结束。

{{<note>}}
<!--
In the Bash script executed on each pod in the example below, the pod hostnames can be prefixed
by the namespace as well  if the pod needs to be reached from outside the namespace.
-->
在以下示例中的每个 Pod 中执行的 Bash 脚本中，如果需要从名字空间外到达 Pod，
Pod 主机名也可以带有该名字空间作为前缀。
{{</note>}}

```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # clusterIP 必须为 None 以创建无头服务
  selector:
    job-name: example-job # 必须与 Job 名称匹配
---
apiVersion: batch/v1
kind: Job
metadata:
  name: example-job
spec:
  completions: 3
  parallelism: 3
  completionMode: Indexed
  template:
    spec:
      subdomain: headless-svc # 必须与 Service 名称匹配
      restartPolicy: Never
      containers:
      - name: example-workload
        image: bash:latest
        command:
        - bash
        - -c
        - |
          for i in 0 1 2
          do
            gotStatus="-1"
            wantStatus="0"             
            while [ $gotStatus -ne $wantStatus ]
            do                                       
              ping -c 1 example-job-${i}.headless-svc > /dev/null 2>&1
              gotStatus=$?                
              if [ $gotStatus -ne $wantStatus ]; then
                echo "Failed to ping pod example-job-${i}.headless-svc, retrying in 1 second..."
                sleep 1
              fi
            done                                                         
            echo "Successfully pinged pod: example-job-${i}.headless-svc"
          done
```

<!--
After applying the example above, reach each other over the network
using: `<pod-hostname>.<headless-service-name>`. You should see output similar to the following:
-->
应用上述示例之后，使用 `<Pod 主机名>.<无头服务名>` 通过网络到达彼此。
你应看到类似以下的输出：

```shell
kubectl logs example-job-0-qws42
```

```
Failed to ping pod example-job-0.headless-svc, retrying in 1 second...
Successfully pinged pod: example-job-0.headless-svc
Successfully pinged pod: example-job-1.headless-svc
Successfully pinged pod: example-job-2.headless-svc
```

{{<note>}}
<!--
Keep in mind that the `<pod-hostname>.<headless-service-name>` name format used
in this example would not work with DNS policy set to `None` or `Default`.
You can learn more about pod DNS policies [here](/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy).
-->
谨记此例中使用的 `<Pod 主机名>.<无头服务名称>` 名称格式不适用于设置为 `None` 或 `Default` 的 DNS 策略。
你可以在[此处](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy)了解有关
Pod DNS 策略的更多信息。
{{</note>}}
