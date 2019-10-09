
此命令可将 'kubeadm init' 或者 'kubeadm join' 对主机的改动恢复到执行前的状态。

### 摘要

此命令可将 'kubeadm init' 或者 'kubeadm join' 对主机的改动恢复到执行前的状态。

<!--
Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'.

### Synopsis


Run this to revert any changes made to this host by 'kubeadm init' or 'kubeadm join'.
-->

```
kubeadm reset [flags]
```

<!--
### Options
-->

### 选项

<!--
<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the directory where the certificates are stored. If specified, clean this directory.</td>
    </tr>
    
    <tr>
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to the CRI socket to use with crictl when cleaning up containers.</td>
    </tr>

    <tr>
      <td colspan="2">-f, --force</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Reset the node without prompting for confirmation.</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for reset</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.</td>
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
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">到存储证书的目录的路径。如果指定了，需要清除此目录。</td>
    </tr>
    
    <tr>
      <td colspan="2">--cri-socket string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/var/run/dockershim.sock"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">在清理容器时与 crictl 一起使用的 CRI 套接字的路径。</td>
    </tr>

    <tr>
      <td colspan="2">-f, --force</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">在不提示确认的情况下重置节点。</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">reset 操作的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">检查列表，其错误将显示为警告。示例：'IsPrivilegedUser,Swap'。值设为 'all' 将忽略所有检查中的错误。</td>
    </tr>

  </tbody>
</table>



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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] 通往'真正的'主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>



