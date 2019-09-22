
<!--
Joins a machine as a control plane instance
-->
将机器作为控制平面实例加入

<!--
### Synopsis
-->
### 概述


<!--
Joins a machine as a control plane instance
-->
将机器作为控制平面实例加入

```
kubeadm join phase control-plane-join [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
  # Joins a machine as a control plane instance
  kubeadm join phase control-plane-join all
```
-->
```
  # 将机器作为控制平面实例加入
  kubeadm join phase control-plane-join all
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">control-plane-join 帮助</td>
    </tr>

  </tbody>
</table>



<!--
### Options inherited from parent commands
-->
### 从父指令中继承的选项

<!--
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
-->
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 指向'真实'宿主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>


