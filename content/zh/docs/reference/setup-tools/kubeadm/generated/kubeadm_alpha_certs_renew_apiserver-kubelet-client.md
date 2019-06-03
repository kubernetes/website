
<!-- Generates the Client certificate for the API server to connect to kubelet-->
生成API服务器的客户端证书以连接到kubelet

<!-- ### Synopsis -->
### 概要


<!-- Renews the Client certificate for the API server to connect to kubelet, and saves them into apiserver-kubelet-client.cert and apiserver-kubelet-client.key files. -->
续订API Server的客户端证书以连接到kubelet，并将其保存到apiserver-kubelet-client.cert和apiserver-kubelet-client.key文件中

<!-- Extra attributes such as SANs will be based on the existing certificates, there is no need to resupply them. -->
SAN等额外属性将基于现有证书，无需为他们生成

```
kubeadm alpha certs renew apiserver-kubelet-client [flags]
```

<!-- ### Options -->
### 选项

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
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the certificates</td>
 -->
         <td></td><td style="line-height: 130%; word-wrap: break-word;">保存证书的路径</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td>
 -->
        <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm配置路径</td>
    </tr>

    <tr>
      <td colspan="2">--csr-dir string</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to output the CSRs and private keys to</td>
 -->
        <td></td><td style="line-height: 130%; word-wrap: break-word;">输出CSR和私钥的路径</td>
    </tr>

    <tr>
      <td colspan="2">--csr-only</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">Create CSRs instead of generating certificates</td>
 -->
         <td></td><td style="line-height: 130%; word-wrap: break-word;">创建CSR</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">help for apiserver-kubelet-client</td>
 -->      <td></td><td style="line-height: 130%; word-wrap: break-word;">帮助</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
 -->
    <td></td><td style="line-height: 130%; word-wrap: break-word;">与群集通信时使用的kubeconfig文件. 如未设置，则搜索一组标准位置以查找现有的kubeconfig文件.</td>
    </tr>

    <tr>
      <td colspan="2">--use-api</td>
    </tr>
    <tr>
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">Use the Kubernetes certificate API to renew certificates</td>
 -->      <td></td><td style="line-height: 130%; word-wrap: break-word;">使用Kubernetes证书API续订证书</td>
    </tr>

  </tbody>
</table>



<!-- ### Options inherited from parent commands
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
<!--       <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
 -->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验]主机根文件系统的路径</td>
    </tr>

  </tbody>
</table>



