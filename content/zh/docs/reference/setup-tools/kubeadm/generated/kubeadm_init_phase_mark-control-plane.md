
<!-- Mark a node as a control-plane -->
将节点标记为控制平面

<!-- ### Synopsis -->
### 概要


<!-- Mark a node as a control-plane -->
将节点标记为控制平面

```
kubeadm init phase mark-control-plane [flags]
```

<!-- ### Examples -->
### 例子

```
  # Applies control-plane label and taint to the current node, functionally equivalent to what executed by kubeadm init.
  # 将控制平面的标签和污点应用于当前节点，功能上等同于 kubeadm init 执行的操作。
  kubeadm init phase mark-control-plane --config config.yml

  # Applies control-plane label and taint to a specific node
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental.</td>
    </tr> -->
    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;"> kubeadm 配置文件的路径。 警告：配置文件的使用是实验性的。</td>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">标记控制平面的帮助</td>
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] “真正的”主机 Rootfs 的路径。</td>
    </tr>

  </tbody>
</table>



