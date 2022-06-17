---
title: 使用 HTTP 代理訪問 Kubernetes API
content_type: task
weight: 40
---
<!--
---
title: Use an HTTP Proxy to Access the Kubernetes API
content_type: task
weight: 40
---
-->

<!-- overview -->
<!--
This page shows how to use an HTTP proxy to access the Kubernetes API.
-->
本文說明如何使用 HTTP 代理訪問 Kubernetes API。


## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* If you do not already have an application running in your cluster, start
  a Hello world application by entering this command:
-->
* 如果你的叢集中還沒有任何應用，使用如下命令啟動一個 Hello World 應用：

```shell
kubectl create deployment node-hello --image=gcr.io/google-samples/node-hello:1.0 --port=8080
```



<!-- steps -->

<!--
## Using kubectl to start a proxy server
-->
## 使用 kubectl 啟動代理伺服器

<!--
This command starts a proxy to the Kubernetes API server:
-->
使用如下命令啟動 Kubernetes API 伺服器的代理：

    kubectl proxy --port=8080

<!--
## Exploring the Kubernetes API
-->
## 探究 Kubernetes API

<!--
When the proxy server is running, you can explore the API using `curl`, `wget`,
or a browser.
-->
當代理伺服器在執行時，你可以透過 `curl`、`wget` 或者瀏覽器訪問 API。

<!--
Get the API versions:
 -->
獲取 API 版本：

    curl http://localhost:8080/api/

<!--
The output should look similar to this:
-->

輸出應該類似這樣：

    {
      "kind": "APIVersions",
      "versions": [
        "v1"
      ],
      "serverAddressByClientCIDRs": [
        {
          "clientCIDR": "0.0.0.0/0",
          "serverAddress": "10.0.2.15:8443"
        }
      ]
    }

<!--
Get a list of pods:
 -->
獲取 Pod 列表：

    curl http://localhost:8080/api/v1/namespaces/default/pods

    {
      "kind": "PodList",
      "apiVersion": "v1",
      "metadata": {
        "resourceVersion": "33074"
      },
      "items": [
        {
          "metadata": {
            "name": "kubernetes-bootcamp-2321272333-ix8pt",
            "generateName": "kubernetes-bootcamp-2321272333-",
            "namespace": "default",
            "uid": "ba21457c-6b1d-11e6-85f7-1ef9f1dab92b",
            "resourceVersion": "33003",
            "creationTimestamp": "2016-08-25T23:43:30Z",
            "labels": {
              "pod-template-hash": "2321272333",
              "run": "kubernetes-bootcamp"
            },
            ...
    }



## {{% heading "whatsnext" %}}

<!--
Learn more about [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy).
-->
想了解更多資訊，請參閱 [kubectl 代理](/docs/reference/generated/kubectl/kubectl-commands#proxy)。



