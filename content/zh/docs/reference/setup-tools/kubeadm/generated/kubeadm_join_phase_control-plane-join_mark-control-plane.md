
<!--
Mark a node as a control-plane
-->
将节点标记为控制平面

<!--
### Synopsis
-->
### 概要


<!--
Mark a node as a control-plane
-->
将节点标记为控制平面

```
kubeadm join phase control-plane-join mark-control-plane [flags]
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
      Path to kubeadm config file.</td>
      -->
      kubeadm 配置文件的路径
    </tr>

    <tr>
      <td colspan="2">--experimental-control-plane</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Create a new control plane instance on this node
      -->
      在此节点上创建一个新的控制平面实例
      </td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for mark-control-plane
      -->
      标记控制平面帮助
      </td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Specify the node name.
      -->
      指定节点名称。
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
      [实验] 到'真实'主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>




