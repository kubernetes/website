
Read an older version of the kubeadm configuration API types from a file, and output the similar config object for the newer version.

### Synopsis



This command lets you convert configuration objects of older versions to the latest supported version,
locally in the CLI tool without ever touching anything in the cluster.
In this version of kubeadm, the following API versions are supported:
- kubeadm.k8s.io/v1alpha2
- kubeadm.k8s.io/v1alpha1

Further, kubeadm can only write out config of version "kubeadm.k8s.io/v1alpha2", but read both types.
So regardless of what version you pass to the --old-config parameter here, the API object will be
read, deserialized, defaulted, converted, validated, and re-serialized when written to stdout or
--new-config if specified.

In other words, the output of this command is what kubeadm actually would read internally if you
submitted this file to "kubeadm init"


```
kubeadm config migrate [flags]
```

### Options

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for migrate</td>
    </tr>

    <tr>
      <td colspan="2">--new-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the resulting equivalent kubeadm config file using the new API version. Optional, if not specified output will be sent to STDOUT.</td>
    </tr>

    <tr>
      <td colspan="2">--old-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the kubeadm config file that is using an old API version and should be converted. This flag is mandatory.</td>
    </tr>

  </tbody>
</table>



### Options inherited from parent commands

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster.</td>
    </tr>

  </tbody>
</table>



