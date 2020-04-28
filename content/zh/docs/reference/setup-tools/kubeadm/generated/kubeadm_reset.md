
<!--
### Synopsis
-->
### 概要


<!--
Performs a best effort revert of changes made to this host by 'kubeadm init' or 'kubeadm join'
-->
尽最大努力还原通过 'kubeadm init' 或者 'kubeadm join' 操作对主机所做的更改

<!--
The "reset" command executes the following phases:
-->
"reset" 命令执行以下阶段：
```
preflight              Run reset pre-flight checks
update-cluster-status  Remove this node from the ClusterStatus object.
remove-etcd-member     Remove a local etcd member.
cleanup-node           Run cleanup node.
```

```
kubeadm reset [flags]
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
      <td colspan="2">
      <!--
      --cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
      -->
      --cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"
      </td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The path to the directory where the certificates are stored. If specified, clean this directory.
      -->
      存储证书的目录路径。如果已指定，则需要清空此目录。
      </td>
    </tr>

    <tr>
      <td colspan="2">--cri-socket string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
      -->
      要连接的 CRI 套接字的路径。如果为空，则 kubeadm 将尝试自动检测此值；仅当安装了多个CRI 或具有非标准 CRI 插槽时，才使用此选项。
      </td>
    </tr>

    <tr>
      <td colspan="2">-f, --force</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Reset the node without prompting for confirmation.
      -->
      在不提示确认的情况下重置节点。
      </td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for reset
      -->
       reset 操作的帮助命令
      </td>
    </tr>

    <tr>
      <td colspan="2">--ignore-preflight-errors stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      -->
      错误将显示为警告的检查列表；例如：'IsPrivilegedUser,Swap'。取值为 'all' 时将忽略检查中的所有错误。
      </td>
    </tr>

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
      与集群通信时使用的 kubeconfig 文件。如果未设置该标志，则可以在一组标准位置中搜索现有的 kubeconfig 文件。
      </td>
    </tr>

    <tr>
      <td colspan="2">--skip-phases stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      List of phases to be skipped
      -->
      要跳过的阶段列表
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
      [实验] 指向 '真实' 宿主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>

