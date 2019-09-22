<!-- 

Generates the client certificate for liveness probes to healthcheck etcd

 -->

为探查healthcheck etcd的活跃度生成客户端证书

<!--

Synopsis

Generates the client certificate for liveness probes to healtcheck etcd, and saves them into etcd/healthcheck-client.cert and etcd/healthcheck-client.key files.

If both files already exist, kubeadm skips the generation step and existing files will be used.

Alpha Disclaimer: this command is currently alpha.

-->

概要

为探查healthcheck etcd的活跃度生成客户端证书，并且保存为 etcd/healthcheck-client.cert 以及 etcd/healthcheck-client.key 两个文件。

如果两个文件都已经存在，kubeadm 将会跳过生成的步骤并且使用已经存在的文件。

Alpha免责声明：这个指令现在是alpha版。

    kubeadm init phase certs etcd-healthcheck-client [flags]

<!--

Options

-->

选项

    <tr>
      <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save and store the certificates.</td>
    </tr>
    
    <tr>
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td>
    </tr>
    
    <tr>
      <td colspan="2">--csr-dir string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The path to output the CSRs and private keys to</td>
    </tr>
    
    <tr>
      <td colspan="2">--csr-only</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Create CSRs instead of generating certificates</td>
    </tr>
    
    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for etcd-healthcheck-client</td>
    </tr>

<!--

Options inherited from parent commands

-->

从父命令继承来的选项

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>
