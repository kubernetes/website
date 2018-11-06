---
title: kubelet
notitle: true
---
## kubelet



<!--
### Synopsis
-->
### 概要


<!--
The kubelet is the primary "node agent" that runs on each
node. The kubelet works in terms of a PodSpec. A PodSpec is a YAML or JSON object
that describes a pod. The kubelet takes a set of PodSpecs that are provided through
various mechanisms (primarily through the apiserver) and ensures that the containers
described in those PodSpecs are running and healthy. The kubelet doesn't manage
containers which were not created by Kubernetes.
-->
kubelet 是在每个节点上运行的主要 "节点代理"。kubelet 以 PodSpec 为单位来运行任务，PodSpec 是一个描述 pod 的 YAML 或 JSON 对象。
kubelet 运行多种机制（主要通过 apiserver）提供的一组 PodSpec，并确保这些 PodSpecs 中描述的容器健康运行。
不是 Kubernetes 创建的容器将不在 kubelet 的管理范围。

<!--
Other than from a PodSpec from the apiserver, there are three ways that a container
manifest can be provided to the Kubelet.

File: Path passed as a flag on the command line. Files under this path will be monitored
periodically for updates. The monitoring period is 20s by default and is configurable
via a flag.

HTTP endpoint: HTTP endpoint passed as a parameter on the command line. This endpoint
is checked every 20 seconds (also configurable with a flag).

HTTP server: The kubelet can also listen for HTTP and respond to a simple API
(underspec'd currently) to submit a new manifest.
-->
除了来自 apiserver 的 PodSpec 之外，还有三种方法可以将容器清单提供给 Kubelet。

文件：通过命令行传入的文件路径。kubelet 将定期监听该路径下的文件以获得更新。监视周期默认为 20 秒，可通过参数进行配置。

HTTP 端点：HTTP 端点以命令行参数传入。每 20 秒检查一次该端点（该时间间隔也是可以通过命令行配置的）。

HTTP 服务：kubelet 还可以监听 HTTP 并响应简单的 API（当前未指定）以提交新的清单。

```
kubelet [flags]
```

<!--
### Options
-->
### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--azure-container-registry-config string</td>
    </tr>
    <tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the file containing Azure container registry configuration information.</td>
-->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">包含 Azure 容器注册配置信息的文件路径</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kubelet</td>
-->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubelet 的帮助信息</td>
    </tr>

    <tr>
<!--
      <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 5s</td>
-->
      <td colspan="2">--log-flush-frequency 间隔&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认: 5s</td>
    </tr>
    <tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Maximum number of seconds between log flushes</td>
-->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">日志刷新间隔的最大秒数</td>
    </tr>

    <tr>
      <td colspan="2">--version version[=true]</td>
    </tr>
    <tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Print version information and quit</td>
-->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">打印版本信息并退出</td>
    </tr>

  </tbody>
</table>



