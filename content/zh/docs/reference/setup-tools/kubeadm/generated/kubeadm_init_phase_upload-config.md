
<!--
### Synopsis

This command is not meant to be run on its own. See list of available subcommands.

```
kubeadm init phase upload-config [flags]
```
-->
### 概要

此命令并不意味着可以单独运行。
请参阅可用的子命令列表。

```
kubeadm init phase upload-config [flags]
```

<!--
### Options

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for upload-config</td>
    </tr>

  </tbody>
</table>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">upload-config 的命令帮助文档</td>
    </tr>

  </tbody>
</table>

<!--
### Options inherited from parent commands

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>



SEE ALSO

* [kubeadm init phase](kubeadm_init_phase.md)	 - Use this command to invoke single phase of the init workflow
* [kubeadm init phase upload-config all](kubeadm_init_phase_upload-config_all.md)	 - Upload all configuration to a config map
* [kubeadm init phase upload-config kubeadm](kubeadm_init_phase_upload-config_kubeadm.md)	 - Upload the kubeadm ClusterConfiguration to a ConfigMap
* [kubeadm init phase upload-config kubelet](kubeadm_init_phase_upload-config_kubelet.md)	 - Upload the kubelet component config to a ConfigMap
-->
### 从父指令中继承的选项

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] 指向“真实”宿主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>

也可以看以下文档

* [kubeadm init phase](kubeadm_init_phase.md)	 - 使用此命令可以调用初始化工作流程的单个阶段
* [kubeadm init phase upload-config all](kubeadm_init_phase_upload-config_all.md)	 - 将所有的配置上传到 ConfigMap 中
* [kubeadm init phase upload-config kubeadm](kubeadm_init_phase_upload-config_kubeadm.md)	 - 将 kubeadm 的集群配置上传到 ConfigMap 中
* [kubeadm init phase upload-config kubelet](kubeadm_init_phase_upload-config_kubelet.md)	 - 将 kubelet 的组件配置上传到 ConfigMap 中
