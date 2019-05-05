
生成调度器的静态 Pod 清单
<!--
Generates the scheduler static Pod manifest
-->

<!--
### Synopsis
-->

### 概要

<!--
Generates the static Pod manifest file for the scheduler and saves it into /etc/kubernetes/manifests/kube-scheduler.yaml file. 
-->
为调度器生成静态 Pod 清单文件，并将其保存到 /etc/kubernetes/manifests/kube-scheduler.yaml 文件中。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase controlplane scheduler [flags]
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
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/pki"</td>
    </tr>
<!--
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">证书的存储路径</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where certificates are stored</td>
-->

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径，警告：配置文件的使用是实验性的</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">scheduler 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for scheduler</td>
-->

    <tr>
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;,默认值： "stable-1"</td>
    </tr>
<!--
      <td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"</td>
-->

    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为控制平面选择特定的 Kubernetes 版本</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Choose a specific Kubernetes version for the control plane</td>
-->

    <tr>
      <td colspan="2">--scheduler-extra-args mapStringString</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">一组以 &lt;flagname&gt;=&lt;value&gt; 的格式传递调度器或覆盖默认参数的附加的参数</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">A set of extra flags to pass to the Scheduler or override default ones in form of &lt;flagname&gt;=&lt;value&gt;</td>
-->

  </tbody>
</table>



<!--
### Options inherited from parent commands
-->

#### 从父命令继承的选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>
<!--
    <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->

  </tbody>
</table>



