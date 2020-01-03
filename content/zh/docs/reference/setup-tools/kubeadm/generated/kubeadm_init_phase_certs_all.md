
<!--
### Synopsis
-->
### 概要


<!--
Generate all certificates
-->
生成所有证书

```
kubeadm init phase certs all [flags]
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
      <td colspan="2">--apiserver-advertise-address string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
      -->
      API 服务器所公布的其正在监听的 IP 地址。如果未设置，将使用默认网络接口。
      </td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-cert-extra-sans stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Optional extra Subject Alternative Names (SANs) to use for the API Server serving certificate. Can be both IP addresses and DNS names.
      -->
      用于 API 服务器服务证书的可选额外替代名称（SAN）。可以同时使用 IP 地址和 DNS 名称。
      </td>
    </tr>

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
      The path where to save and store the certificates.
      -->
      证书的存储路径。
      </td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Path to a kubeadm configuration file.
      -->
       kubeadm 配置文件的路径。
      </td>
    </tr>

    <tr>
      <td colspan="2">--control-plane-endpoint string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Specify a stable IP address or DNS name for the control plane.
      -->
      为控制平面指定一个稳定的 IP 地址或 DNS 名称。
      </td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for all
      -->
       all 操作的帮助命令 
      </td>
    </tr>

    <tr>
      <td colspan="2">
      <!--
      --kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
      -->
      --kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："stable-1"
      </td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Choose a specific Kubernetes version for the control plane.
      -->
      为控制平面选择特定的 Kubernetes 版本。
      </td>
    </tr>

    <tr>
      <td colspan="2">
      <!--
      --service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"
      -->
      --service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："10.96.0.0/12"
      </td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Use alternative range of IP address for service VIPs.
      -->
      VIP 服务使用其它的 IP 地址范围。
      </td>
    </tr>

    <tr>
      <td colspan="2">
      <!--
      --service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"
      -->
      --service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："cluster.local"
      </td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Use alternative domain for services, e.g. "myorg.internal".
      -->
      服务使用其它的域名，例如："myorg.internal"。
      </td>
    </tr>

  </tbody>
</table>



<!--
### Options inherited from parent commands
-->
### 继承于父命令的选项

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
      [实验] 到 '真实' 主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>
