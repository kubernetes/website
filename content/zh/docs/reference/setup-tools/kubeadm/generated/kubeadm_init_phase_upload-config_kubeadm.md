
<!--
Uploads the kubeadm ClusterConfiguration to a ConfigMap
-->
将 kubeadm ClusterConfiguration 上载到 ConfigMap上

<!--
### Synopsis
-->
### 概要


<!--
Uploads the kubeadm ClusterConfiguration to a ConfigMap called kubeadm-config in the kube-system namespace. This enables correct configuration of system components and a seamless user experience when upgrading. 
-->
将 kubeadm ClusterConfiguration 上传到 kube-system 命名空间中名为 kubeadm-config 的 
ConfigMap。
这样可以正确配置系统组件，并在升级时提供无缝的用户体验。

<!--
Alternatively, you can use kubeadm config.
-->
另外，您可以使用 kubeadm 配置。

```
kubeadm init phase upload-config kubeadm [flags]
```

<!--
### Examples
-->
### 例子

```
  # uploads the configuration of your cluster
  kubeadm init phase upload-config --config=myConfig.yaml
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to a kubeadm configuration file.
      -->
      kubeadm 配置文件的路径。
      </td>
    </tr>
    
    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for kubeadm
      -->
      帮助 kubeadm
      </td>
    </tr>
    
    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
      -->
      与集群通信时使用的 kubeconfig 文件。如果未设置该标志，则可以在一组标准位置中搜索现有的 kubeconfig 文件。
      </td>
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

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      [EXPERIMENTAL] The path to the 'real' host root filesystem.
      -->
      [实验性]“真实”主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>




