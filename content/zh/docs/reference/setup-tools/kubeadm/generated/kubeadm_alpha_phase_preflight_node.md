
运行节点加入前的检查
<!--
Run node pre-flight checks
-->

<!--
### Synopsis
-->

### 概要

<!--
Run node pre-flight checks, functionally equivalent to what implemented by kubeadm join. 
-->
运行节点加入前的检查，功能上与 kubeadm join 的实现相同。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase preflight node [flags]
```

<!--
### Examples
-->

### 例子

<!--
  # Run node pre-flight checks.
-->

```
  # 运行节点加入前的检查
  kubeadm alpha phase preflight node
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">node 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for node</td>
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
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径（警告：配置文件的使用是实验性的）</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
-->

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">检查项列表，这些检查项的错误将以警告的形式显示。例如：'IsPrivilegedUser,Swap'。 值设置为 'all' 将会忽略来自所有检查项的错误。</td>
    </tr>
<!--
     <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
-->

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



