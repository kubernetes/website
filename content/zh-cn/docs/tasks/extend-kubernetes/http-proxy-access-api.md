---
title: 使用 HTTP 代理访问 Kubernetes API
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
本文说明如何使用 HTTP 代理访问 Kubernetes API。


## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
If you do not already have an application running in your cluster, start
  a Hello world application by entering this command:
-->
如果你的集群中还没有任何应用，使用如下命令启动一个 Hello World 应用：

```shell
kubectl create deployment hello-app --image=gcr.io/google-samples/hello-app:2.0 --port=8080
```



<!-- steps -->

<!--
## Using kubectl to start a proxy server
-->
## 使用 kubectl 启动代理服务器

<!--
This command starts a proxy to the Kubernetes API server:
-->
使用如下命令启动 Kubernetes API 服务器的代理：

```shell
kubectl proxy --port=8080
```

<!--
## Exploring the Kubernetes API
-->
## 探究 Kubernetes API

<!--
When the proxy server is running, you can explore the API using `curl`, `wget`,
or a browser.
-->
当代理服务器在运行时，你可以通过 `curl`、`wget` 或者浏览器访问 API。

<!--
Get the API versions:
-->
获取 API 版本：

```shell
curl http://localhost:8080/api/
```

<!--
The output should look similar to this:
-->
输出应该类似这样：

```
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
```

<!--
Get a list of pods:
 -->
获取 Pod 列表：

```shell
curl http://localhost:8080/api/v1/namespaces/default/pods
```

<!--
The output should look similar to this:
-->
输出应该类似这样：

```
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
```

## {{% heading "whatsnext" %}}

<!--
Learn more about [kubectl proxy](/docs/reference/generated/kubectl/kubectl-commands#proxy).
-->
想了解更多信息，请参阅 [kubectl 代理](/docs/reference/generated/kubectl/kubectl-commands#proxy)。



