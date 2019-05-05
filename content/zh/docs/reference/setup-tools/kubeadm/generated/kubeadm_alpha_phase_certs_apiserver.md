
<!--
Generates the certificate for serving the kubernetes API
-->
生成用于 Kubernetes API 的证书

<!--
### Synopsis
-->
### 概要

<!--
Generates the certificate for serving the kubernetes API, and saves them into apiserver.cert and apiserver.key files.
-->
生成用于 Kubernetes API 的证书，并把证书保存到 apiserver.cert 和 apiserver.key 文件中。

<!--
Default SANs are kubernetes, kubernetes.default, kubernetes.default.svc, kubernetes.default.svc.cluster.local, 10.96.0.1, 127.0.0.1 
-->
默认的 SAN 是 kubernetes、kubernetes.default、kubernetes.default.svc、kubernetes.default.svc.cluster.local、10.96.0.1、127.0.0.1。

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used. 
-->
如果这两个文件已经存在，kubeadm 将跳过生成步骤直接使用现有文件。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前处于 alpha 阶段。

```
kubeadm alpha phase certs apiserver [flags]
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
      <td colspan="2">--apiserver-advertise-address string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The IP address the API server is accessible on, to use for the API server serving cert</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-cert-extra-sans stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Optional extra altnames to use for the API server serving cert. Can be both IP addresses and DNS names</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the certificates</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file (WARNING: Usage of a configuration file is experimental)</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for apiserver</td>
    </tr>

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Alternative range of IP address for service VIPs, from which derives the internal API server VIP that will be added to the API Server serving cert</td>
    </tr>

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cluster.local"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Alternative domain for services, to use for the API server serving cert</td>
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
      <td colspan="2">--apiserver-advertise-address string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API 服务器可访问的 IP 地址，用于提供证书的 API 服务器</td>
    </tr>

    <tr>
      <td colspan="2">--apiserver-cert-extra-sans stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">为证书提供服务的 API 服务器使用的可选的额外 altname， 可以是 IP 地址和 DNS 名称。</td>
    </tr>

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认："/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">保存证书的路径</td>
    </tr>

    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm config 文件路径（警告： 配置文件的使用是实验性的）</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">apiserver 的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："10.96.0.0/12"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">服务 VIP 的可选 IP 地址范围，从中会产生将添加到提供证书的 API 服务器的内部 API 服务器的 VIP</td>
    </tr>

    <tr>
      <td colspan="2">--service-dns-domain string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："cluster.local"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">服务的备用域，用于提供证书的 API 服务器</td>
    </tr>

  </tbody>
</table>
-->

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径</td>
    </tr>

  </tbody>
</table>

