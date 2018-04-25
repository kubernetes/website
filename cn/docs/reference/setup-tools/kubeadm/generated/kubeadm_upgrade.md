<!-- 
Upgrade your cluster smoothly to a newer version with this command.

### Synopsis


Upgrade your cluster smoothly to a newer version with this command.

```
kubeadm upgrade
```
 -->

用此命令能将您的集群平滑升级到新版本。

### 概要


用此命令能将您的集群平滑升级到新版本。

```
kubeadm upgrade
```


<!-- 
### Options

```
      --allow-experimental-upgrades        Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
      --allow-release-candidate-upgrades   Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
      --config string                      Path to kubeadm config file. WARNING: Usage of a configuration file is experimental!
      --feature-gates string               A set of key=value pairs that describe feature gates for various features.Options are:
CoreDNS=true|false (ALPHA - default=false)
DynamicKubeletConfig=true|false (ALPHA - default=false)
HighAvailability=true|false (ALPHA - default=false)
SelfHosting=true|false (BETA - default=false)
StoreCertsInSecrets=true|false (ALPHA - default=false)
SupportIPVSProxyMode=true|false (ALPHA - default=false)
      --ignore-checks-errors stringSlice   A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
      --kubeconfig string                  The KubeConfig file to use when talking to the cluster. (default "/etc/kubernetes/admin.conf")
      --print-config                       Specifies whether the configuration file that will be used in the upgrade should be printed or not.
```
 -->

 ### 选择项

```
      --allow-experimental-upgrades        显示Kubernetes的不稳定版本作为升级可选项并允许升级到Kubernetes的 alpha/beta/release 候选版本。
      --allow-release-candidate-upgrades   显示Kubernetes的发布版本作为升级可选项并允许升级至Kubernetes的发布候选版本。
      --config string                      kubeadm config 文件路径（警告：配置文件的使用是实验性的）
      --feature-gates string               一系列描述不同功能选项的feature gates的键值对：
CoreDNS=true|false (ALPHA - default=false)
DynamicKubeletConfig=true|false (ALPHA - default=false)
HighAvailability=true|false (ALPHA - default=false)
SelfHosting=true|false (BETA - default=false)
StoreCertsInSecrets=true|false (ALPHA - default=false)
SupportIPVSProxyMode=true|false (ALPHA - default=false)
      --ignore-checks-errors stringSlice   检查的错误显示成的警告列表。比如: 'IsPrivilegedUser,Swap'. 值 'all' 所有检查的错误。
      --kubeconfig string                  与集群对话时用到的 KubeConfig 文件（默认值 "/etc/kubernetes/admin.conf"）
      --print-config                       指定是否打印升级用到的配置文件。
```
