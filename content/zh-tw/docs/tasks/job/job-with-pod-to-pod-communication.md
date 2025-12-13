---
title: 帶 Pod 間通信的 Job
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
In this example, you will run a Job in [Indexed completion mode](/blog/2021/04/19/introducing-indexed-jobs/)
configured such that the pods created by the Job can communicate with each other using pod hostnames rather
than pod IP addresses.

Pods within a Job might need to communicate among themselves. The user workload running in each pod
could query the Kubernetes API server to learn the IPs of the other Pods, but it's much simpler to
rely on Kubernetes' built-in DNS resolution.
-->
在此例中，你將以[索引完成模式](/blog/2021/04/19/introducing-indexed-jobs/)運行一個 Job，
並通過設定使得該 Job 所創建的各 Pod 之間可以使用 Pod 主機名而不是 Pod IP 地址進行通信。

某 Job 內的 Pod 之間可能需要通信。每個 Pod 中運行的使用者工作負載可以查詢 Kubernetes API
伺服器以獲知其他 Pod 的 IP，但使用 Kubernetes 內置的 DNS 解析會更加簡單。

<!--
Jobs in Indexed completion mode automatically set the pods' hostname to be in the format of
`${jobName}-${completionIndex}`. You can use this format to deterministically build
pod hostnames and enable pod communication *without* needing to create a client connection to
the Kubernetes control plane to obtain pod hostnames/IPs via API requests.

This configuration is useful for use cases where pod networking is required but you don't want
to depend on a network connection with the Kubernetes API server.
-->
索引完成模式下的 Job 自動將 Pod 的主機名設置爲 `${jobName}-${completionIndex}` 的格式。
你可以使用此格式確定性地構建 Pod 主機名並啓用 Pod 通信，無需創建到 Kubernetes
控制平面的客戶端連接來通過 API 請求獲取 Pod 主機名/IP。

此設定可用於需要 Pod 聯網但不想依賴 Kubernetes API 伺服器網路連接的使用場景。

## {{% heading "prerequisites" %}}

<!--
You should already be familiar with the basic use of [Job](/docs/concepts/workloads/controllers/job/).
-->
你應該已熟悉了 [Job](/zh-cn/docs/concepts/workloads/controllers/job/) 的基本用法。

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{< note >}}
<!--
If you are using minikube or a similar tool, you may need to take
[extra steps](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/)
to ensure you have DNS.
-->
如果你正在使用 minikube 或類似的工具，
你可能需要採取[額外的步驟](https://minikube.sigs.k8s.io/docs/handbook/addons/ingress-dns/)來確保你擁有 DNS。
{{< /note >}}

<!-- steps -->

<!--
## Starting a Job with Pod-to-Pod communication

To enable pod-to-pod communication using pod hostnames in a Job, you must do the following:
-->
## 啓動帶 Pod 間通信的 Job   {#starting-a-job-with-pod-to-pod-communication}

要在某 Job 中啓用使用 Pod 主機名的 Pod 間通信，你必須執行以下操作：

<!--
1. Set up a [headless Service](/docs/concepts/services-networking/service/#headless-services)
   with a valid label selector for the pods created by your Job. The headless service must be
   in the same namespace as the Job. One easy way to do this is to use the
   `job-name: <your-job-name>` selector, since the `job-name` label will be automatically added
   by Kubernetes. This configuration will trigger the DNS system to create records of the hostnames
   of the pods running your Job.

2. Configure the headless service as subdomain service for the Job pods by including the following
   value in your Job template spec:
-->
1. 對於 Job 所創建的那些 Pod，
   使用一個有效的標籤選擇算符創建[無頭服務](/zh-cn/docs/concepts/services-networking/service/#headless-services)。
   該無頭服務必須位於與該 Job 相同的名字空間內。
   實現這一目的的一種簡單的方式是使用 `job-name: <任務名稱>` 作爲選擇算符，
   因爲 `job-name` 標籤將由 Kubernetes 自動添加。
   此設定將觸發 DNS 系統爲運行 Job 的 Pod 創建其主機名的記錄。

2. 通過將以下值包括到你的 Job 模板規約中，針對該 Job 的 Pod，將無頭服務設定爲其子域服務：

   <!--
   ```yaml
   subdomain: <headless-svc-name>
   ```
   -->
   ```yaml
   subdomain: <無頭服務的名稱>
   ```

<!--
### Example

Below is a working example of a Job with pod-to-pod communication via pod hostnames enabled.
The Job is completed only after all pods successfully ping each other using hostnames.
-->
### 示例    {#example}

以下是啓用通過 Pod 主機名來完成 Pod 間通信的 Job 示例。
只有在使用主機名成功 ping 通所有 Pod 之後，此 Job 纔會結束。

{{< note >}}
<!--
In the Bash script executed on each pod in the example below, the pod hostnames can be prefixed
by the namespace as well if the pod needs to be reached from outside the namespace.
-->
在以下示例中的每個 Pod 中執行的 Bash 腳本中，如果需要從名字空間外到達 Pod，
Pod 主機名也可以帶有該名字空間作爲前綴。
{{< /note >}}

<!--
```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # clusterIP must be None to create a headless service
  selector:
    job-name: example-job # must match Job name
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
      subdomain: headless-svc # has to match Service name
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
-->
```yaml
apiVersion: v1
kind: Service
metadata:
  name: headless-svc
spec:
  clusterIP: None # clusterIP 必須爲 None 以創建無頭服務
  selector:
    job-name: example-job # 必須與 Job 名稱匹配
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
      subdomain: headless-svc # 必須與 Service 名稱匹配
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
應用上述示例之後，使用 `<Pod 主機名>.<無頭服務名>` 通過網路到達彼此。
你應看到類似以下的輸出：

```shell
kubectl logs example-job-0-qws42
```

```
Failed to ping pod example-job-0.headless-svc, retrying in 1 second...
Successfully pinged pod: example-job-0.headless-svc
Successfully pinged pod: example-job-1.headless-svc
Successfully pinged pod: example-job-2.headless-svc
```

{{< note >}}
<!--
Keep in mind that the `<pod-hostname>.<headless-service-name>` name format used
in this example would not work with DNS policy set to `None` or `Default`.
Refer to [Pod's DNS Policy](/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy).
-->
謹記此例中使用的 `<Pod 主機名>.<無頭服務名稱>` 名稱格式不適用於設置爲 `None` 或 `Default` 的 DNS 策略。
請參閱 [Pod 的 DNS 策略](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pod-s-dns-policy)。
{{< /note >}}
