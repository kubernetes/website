
为 kubelet 写入带有运行时参数的环境文件。
<!--
Writes an environment file with runtime flags for the kubelet.
-->

<!--
### Synopsis
-->

### 概要

<!--
Writes an environment file with flags that should be passed to the kubelet executing on the master or node. This --config flag can either consume a InitConfiguration object or a JoinConfiguration one, as this function is used for both "kubeadm init" and "kubeadm join". 
-->
生成一个环境文件，其中包含需要传递给在主节点或节点上执行的 kubelet 的参数。--config 参数的取值可以是一个 InitConfiguration 对象或一个 JoinConfiguration 对象，因为这个功能既用于 "kubeadm init" 也用于 "kubeadm join"。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase kubelet write-env-file [flags]
```

<!--
### Examples
-->

### 例子

<!--
  # Writes a dynamic environment file with kubelet flags from a InitConfiguration file.
  # Writes a dynamic environment file with kubelet flags from a JoinConfiguration file.
-->

```
  # 从 InitConfiguration 文件中写入带有 kubelet 参数的动态环境文件。
  kubeadm alpha phase kubelet write-env-file --config masterconfig.yaml
  
  # 从 JoinConfiguration 文件中写入带有 kubelet 参数的动态环境文件。
  kubeadm alpha phase kubelet write-env-file --config nodeconfig.yaml
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
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告: 配置文件的使用是实验性的）</td>
    </tr>
<!--
     <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
-->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">write-env-file 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for write-env-file</td>
-->

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



