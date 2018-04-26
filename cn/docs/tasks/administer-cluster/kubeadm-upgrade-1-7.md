---
approvers:
- pipejakob
cn-approvers:
- xiaosuiba
cn-reviewers:
- shirdrn
title: 将 kubeadm 集群从 1.6 升级到 1.7
---

{% capture overview %}

<!--
This guide is for upgrading kubeadm clusters from version 1.6.x to 1.7.x.
Upgrades are not supported for clusters lower than 1.6, which is when kubeadm
became Beta.
-->
本指南用于将kubeadm集群从1.6.x升级到1.7.x。升级操作不支持低于 1.6 版本的集群，kubeadm 在 1.6 成为 Beta 版本。

<!--
**WARNING**: These instructions will **overwrite** all of the resources managed
by kubeadm (static pod manifest files, service accounts and RBAC rules in the
`kube-system` namespace, etc.), so any customizations you may have made to these
resources after cluster setup will need to be reapplied after the upgrade. The
upgrade will not disturb other static pod manifest files or objects outside the
`kube-system` namespace.
-->
**警告**：这些指令将**覆盖**所有 kubeadm 管理的资源（静态 pod 清单文件、`kube-system` 命名空间中的 service account 和 RBAC 规则等。），因此，对于在集群设置之后进行的资源定制化，在升级之后需要重新应用。升级不会干扰 `kube-system` 命名空间之外的其它静态 pod 清单文件或对象。

{% endcapture %}

{% capture prerequisites %}
<!--
You need to have a Kubernetes cluster running version 1.6.x.
-->
您需要运行版本为 1.6.x 的 Kubernetes 集群。
{% endcapture %}

{% capture steps %}

<!--
## On the master
-->
## 在 master 上

<!--
1. Upgrade system packages.

   Upgrade your OS packages for kubectl, kubeadm, kubelet, and kubernetes-cni.

   a. On Debian, this can be accomplished with:

       sudo apt-get update
       sudo apt-get upgrade

   b. On CentOS/Fedora, you would instead run:

       sudo yum update
-->
1. 升级系统包。

   更新  kubectl、kubeadm、kubelet 和 kubernetes-cni 的系统包。

   a. 在 Debian 上这样完成：

       sudo apt-get update
       sudo apt-get upgrade

   b. 在 CentOS/Fedora 上则运行:

       sudo yum update

<!--
2. Restart kubelet.
-->
2. 重启 kubelet。

       systemctl restart kubelet

<!--
3. Delete the `kube-proxy` DaemonSet.

   Although most components are automatically upgraded by the next step,
   `kube-proxy` currently needs to be manually deleted so it can be recreated at
   the correct version:

       sudo KUBECONFIG=/etc/kubernetes/admin.conf kubectl delete daemonset kube-proxy -n kube-system
-->
3. 删除 `kube-proxy` DaemonSet。

   虽然这个步骤自动升级了大部分组件，但当前仍需要手动删除 `kube-proxy` 以使其可以使用正确的版本重建：

       sudo KUBECONFIG=/etc/kubernetes/admin.conf kubectl delete daemonset kube-proxy -n kube-system

<!--
4. Perform kubeadm upgrade.

    **WARNING**: All parameters you passed to the first `kubeadm init` when you bootstrapped your
    cluster **MUST** be specified here in the upgrade-`kubeadm init`-command. This is a limitation
    we plan to address in v1.8.

       sudo kubeadm init --skip-preflight-checks --kubernetes-version <DESIRED_VERSION>

   For instance, if you want to upgrade to `1.7.0`, you would run:

       sudo kubeadm init --skip-preflight-checks --kubernetes-version v1.7.0
-->
4. 执行 kubeadm 升级。

    **警告**：当引导集群时，所有传递给第一个 `kubeadm init` 的参数都必须在用于升级的 `kubeadm init` 命令中指定。我们计划在 v1.8 引入这个限制。

       sudo kubeadm init --skip-preflight-checks --kubernetes-version <DESIRED_VERSION>

   例如，如果要升级到 `1.7.0`，可以运行：

       sudo kubeadm init --skip-preflight-checks --kubernetes-version v1.7.0

<!--
5. Upgrade CNI provider.

   Your CNI provider might have its own upgrade instructions to follow now.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see if there are additional upgrade steps
   necessary.
-->
5. 升级 CNI provider。

   您的 CNI provider 现在可能有它自己升级说明。检查 [addons](/docs/concepts/cluster-administration/addons/) 页面，找到您的 CNI provider 并查看是否有必要的额外升级步骤。

<!--
## On each node
-->
## 在每个 node 上

<!--
1. Upgrade system packages.

   Upgrade your OS packages for kubectl, kubeadm, kubelet, and kubernetes-cni.

   a. On Debian, this can be accomplished with:

       sudo apt-get update
       sudo apt-get upgrade

   b. On CentOS/Fedora, you would instead run:

       sudo yum update
-->
1. 升级系统包。

   更新  kubectl、kubeadm、kubelet 和 kubernetes-cni 的系统包。

   a. 在 Debian 上这样完成：

       sudo apt-get update
       sudo apt-get upgrade

   b. 在 CentOS/Fedora 上则运行:

       sudo yum update

<!--
2. Restart kubelet.
-->
2. 重启 kubelet。

       systemctl restart kubelet

{% endcapture %}

{% include templates/task.md %}
