
<!-- Mark a node as a control-plane -->
将节点标记为控制平面

<!-- ### Synopsis -->
### 概要


```
kubeadm init phase mark-control-plane [flags]
```

<!-- ### Examples -->
### 例子

```
  # 将控制平面的标签和污点应用于当前节点，功能上等同于 kubeadm init 执行的操作。
  kubeadm init phase mark-control-plane --config config.yml

  # 将控制平面的标签和污点应用于特定节点
  kubeadm init phase mark-control-plane --node-name myNode
```

<!-- ### Options -->
### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

<!--     <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td>
    </tr> -->
    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径。</td>
    </tr>

<!--     <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for mark-control-plane</td>
    </tr> -->

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"> mark-control-plane 命令的帮助</td>
    </tr>

<!--     <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Specify the node name.</td>
    </tr> -->

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指定节点名称。</td>
    </tr>

  </tbody>
</table>



<!-- ### Options inherited from parent commands -->
<!-- ### Options inherited from parent commands -->
### 从父命令继承的选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

<!--     <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr> -->
    <tr>
      <td colspan="2">--rootfs 字符串</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">主机根文件系统的“真实”路径。</td>
    </tr>

  </tbody>
</table>

<!--
SEE ALSO
* [kubeadm init phase](kubeadm_init_phase.md)   - Use this command to invoke single phase of the init workflow
-->

查看其他

* [kubeadm init phase](kubeadm_init_phase.md)   - 使用此命令调用 init 工作流程的单个阶段

