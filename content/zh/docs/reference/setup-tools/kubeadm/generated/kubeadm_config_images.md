
<!--
### Synopsis
-->
### 概要

<!--
Interact with container images used by kubeadm.
-->
与 kubeadm 使用的容器镜像交互。

```
kubeadm config images [flags]
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
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for images
      -->
       images 的帮助命令
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
      <td colspan="2">
      <!--
      --kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
      -->
      --kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"
      </td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
      -->
      用于和集群通信的 kubeconfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 kubeconfig 文件。
      </td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      [EXPERIMENTAL] The path to the 'real' host root filesystem.
      -->
      [实验] 到 '真实' 主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>



<!-- 
SEE ALSO
-->
查看其它

<!-- 
* [kubeadm config](kubeadm_config.md)	 - Manage configuration for a kubeadm cluster persisted in a ConfigMap in the cluster
* [kubeadm config images list](kubeadm_config_images_list.md)	 - Print a list of images kubeadm will use. The configuration file is used in case any images or image repositories are customized
* [kubeadm config images pull](kubeadm_config_images_pull.md)	 - Pull images used by kubeadm 
-->
* [kubeadm config](kubeadm_config.md)	 - 管理 kubeadm 集群的配置，该配置保存在集群的 ConfigMap 中
* [kubeadm config images list](kubeadm_config_images_list.md)	 - 打印 kubeadm 将使用的镜像列表。如果自定义任何镜像或镜像存储库，则使用配置文件
* [kubeadm config images pull](kubeadm_config_images_pull.md)	 - 拉取 kubeadm 使用的镜像

