创建用于节点加入的引导令牌

<!--
Creates a bootstrap token to be used for node joining
-->

<!--
### Synopsis
-->

### 概要


<!--
Creates a bootstrap token. If no token value is given, kubeadm will generate a random token instead. 

Alternatively, you can use kubeadm token. 

Alpha Disclaimer: this command is currently alpha.
-->

创建一个引导令牌。如果没有给出令牌值，kubeadm 将生成一个随机令牌。

或者，您可以使用 kubeadm 令牌。

Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase bootstrap-token create [flags]
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
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental</td>
    </tr>

    <tr>
      <td colspan="2">--description string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">A human friendly description of how this token is used.</td>
    </tr>

    <tr>
      <td colspan="2">--groups stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [system:bootstrappers:kubeadm:default-node-token]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Extra groups that this token will authenticate as when used for authentication. Must match "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z"</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for create</td>
    </tr>

    <tr>
      <td colspan="2">--skip-token-print</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Skip printing of the bootstrap token</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The token to use for establishing bidirectional trust between nodes and masters. The format is [a-z0-9]{6}\.[a-z0-9]{16} - e.g. abcdef.0123456789abcdef</td>
    </tr>

    <tr>
      <td colspan="2">--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 24h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The duration before the token is automatically deleted (e.g. 1s, 2m, 3h). If set to '0', the token will never expire</td>
    </tr>

    <tr>
      <td colspan="2">--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: [signing,authentication]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Describes the ways in which this token can be used. You can pass --usages multiple times or provide a comma separated list of options. Valid options: [signing,authentication]</td>
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
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径。警告：配置文件的使用是实验性的</td>
    </tr>

    <tr>
      <td colspan="2">--description string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">针对令牌用途的人性化的描述。</td>
    </tr>

    <tr>
      <td colspan="2">--groups stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: [system:bootstrappers:kubeadm:default-node-token]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">使用这个令牌进行身份认证的额外组。必须符合 "\\Asystem:bootstrappers:[a-z0-9:-]{0,255}[a-z0-9]\\z"</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">create 操作的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--skip-token-print</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">跳过打印引导令牌操作</td>
    </tr>

    <tr>
      <td colspan="2">--token string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">令牌用来建立节点与主控节点键的双向信任。格式为 [a-z0-9]{6}\.[a-z0-9]{16} - 例如 abcdef.0123456789abcdef</td>
    </tr>

    <tr>
      <td colspan="2">--token-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 24h0m0s</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">令牌在被自动删除前的持续时间（如 1s, 2m, 3h）。如果设为'0'，token 将永不失效</td>
    </tr>

    <tr>
      <td colspan="2">--usages stringSlice&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: [signing,authentication]</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">描述令牌可以使用的方式。您可以多次传递 --usages 或用逗号分隔开多个选择项。有效的选择项: [signing,authentication]</td>
    </tr>

  </tbody>
</table>

<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

<!--
<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
    </tr>

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
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>


