
显示将对现有静态 pod 清单产生的影响。这也能够通过 `kubeadm upgrade apply --dry-run` 命令查看。
<!--
Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run
-->

<!--
### Synopsis
-->

### 概要

<!--
Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run
-->
显示将对现有静态 pod 清单产生的影响。这也能够通过 `kubeadm upgrade apply --dry-run` 命令查看。

```
kubeadm upgrade diff [version] [flags]
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
<!--
      <td colspan="2">--api-server-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-apiserver.yaml"</td>
-->

    <tr>
      <td colspan="2">--api-server-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/manifests/kube-apiserver.yaml"</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to API server manifest</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API 服务器清单的路径</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    
<!--
    <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">到 kubeadm 配置文件的路径（警告：配置文件的使用是实验性的）</td>    
    </tr>
    
<!--
      <td colspan="2">-c, --context-lines int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 3</td>
-->
    <tr>
      <td colspan="2">-c, --context-lines int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：3</td>
    </tr>
    
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">How many lines of context in the diff</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">diff 中有多少行上下文</td>
    </tr>

<!--
      <td colspan="2">--controller-manager-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-controller-manager.yaml"</td>
-->
    <tr>
      <td colspan="2">--controller-manager-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/manifests/kube-controller-manager.yaml"</td>
    </tr>
    
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to controller manifest</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">控制器清单的路径</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for diff</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">diff 的帮助信息</td>
    </tr>

<!--
      <td colspan="2">--scheduler-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-scheduler.yaml"</td>
-->
    <tr>
      <td colspan="2">--scheduler-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/manifests/kube-scheduler.yaml"</td>
    </tr>
    
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">path to scheduler manifest</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">调度器清单的路径</td>
    </tr>

  </tbody>
</table>


<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

<!--
      <td colspan="2">--rootfs string</td>
-->
    <tr>
      <td colspan="2">--rootfs 字符串</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机 root 文件系统的路径。</td>
    </tr>

  </tbody>
</table>



