---
title: kubeadm 配置 (v1beta3)
content_type: tool-reference
package: kubeadm.k8s.io/v1beta3
auto_generated: true
---

<!--
title: kubeadm Configuration (v1beta3)
content_type: tool-reference
package: kubeadm.k8s.io/v1beta3
auto_generated: true
-->

<!--
<h2>Overview</h2>
<p>Package v1beta3 defines the v1beta3 version of the kubeadm configuration file format.
This version improves on the v1beta2 format by fixing some minor issues and adding a few new fields.</p>
<p>A list of changes since v1beta2:</p>
-->
<h2>概述</h2>

<p>包 v1beta3 定義 kubeadm 配置檔案格式的 v1beta3 版本。
此版本改進了 v1beta2 的格式，修復了一些小問題並添加了一些新的欄位。</p>

<p>從 v1beta2 版本以來的變更列表：</p>

<!--
<ul>
<li>The deprecated &quot;ClusterConfiguration.useHyperKubeImage&quot; field has been removed.
Kubeadm no longer supports the hyperkube image.</li>
<li>The &quot;ClusterConfiguration.DNS.Type&quot; field has been removed since CoreDNS is the only supported
DNS server type by kubeadm.</li>
<li>Include &quot;datapolicy&quot; tags on the fields that hold secrets.
This would result in the field values to be omitted when API structures are printed with klog.</li>
<li>Add &quot;InitConfiguration.SkipPhases&quot;, &quot;JoinConfiguration.SkipPhases&quot; to allow skipping
a list of phases during kubeadm init/join command execution.</li>
-->
<ul>
<li>已棄用的欄位 &quot;ClusterConfiguration.useHyperKubeImage&quot; 現在被移除。
  kubeadm 不再支援 hyperkube 映象。</li>
<li>欄位 &quot;ClusterConfiguration.dns.type&quot; 已經被移除，因為 CoreDNS 是 kubeadm 所支援
  的唯一 DNS 伺服器型別。</li>
<li>儲存私密資訊的欄位現在包含了 &quot;datapolicy&quot; 標記（tag）。
這一標記會導致 API 結構透過 klog 列印輸出時，會忽略這些欄位的值。</li>
<li>添加了 &quot;InitConfiguration.skipPhases&quot;, &quot;JoinConfiguration.skipPhases&quot;，
以允許在執行 kubeadm init/join 命令時略過某些階段。</li>
<!--
<li>Add &quot;InitConfiguration.NodeRegistration.ImagePullPolicy&quot; and &quot;JoinConfiguration.NodeRegistration.ImagePullPolicy&quot;
to allow specifying the images pull policy during kubeadm &quot;init&quot; and &quot;join&quot;.
The value must be one of &quot;Always&quot;, &quot;Never&quot; or &quot;IfNotPresent&quot;.
&quot;IfNotPresent&quot; is the default, which has been the existing behavior prior to this addition.</li>
<li>Add &quot;InitConfiguration.Patches.Directory&quot;, &quot;JoinConfiguration.Patches.Directory&quot; to allow
the user to configure a directory from which to take patches for components deployed by kubeadm.</li>
<li>Move the BootstrapToken&lowast; API and related utilities out of the &quot;kubeadm&quot; API group to a new group
&quot;bootstraptoken&quot;. The kubeadm API version v1beta3 no longer contains the BootstrapToken&lowast; structures.</li>
-->
<li>添加了 &quot;InitConfiguration.nodeRegistration.imagePullPolicy&quot; 和
&quot;JoinConfiguration.nodeRegistration.imagePullPolicy&quot;
以允許在 kubeadm init 和 kubeadm join 期間指定映象拉取策略。
這兩個欄位的值必須是 &quot;Always&quot;、&quot;Never&quot; 或 &quot;IfNotPresent&quot 之一。
預設值是 &quot;IfNotPresent&quot;，也是新增此欄位之前的預設行為。</li>
<li>添加了 &quot;InitConfiguration.patches.directory&quot;,
&quot;JoinConfiguration.patches.directory&quot; 以允許使用者配置一個目錄，
kubeadm 將從該目錄中提取元件的補丁包。</li>
<li>BootstrapToken&lowast; API 和相關的工具被從 &quot;kubeadm&quot; API 組中移出，
放到一個新的 &quot;bootstraptoken&quot; 組中。kubeadm API 版本 v1beta3 不再包含
BootstrapToken&lowast; 結構。</li>
</ul>
<!--
<p>Migration from old kubeadm config versions</p>
<ul>
<li>kubeadm v1.15.x and newer can be used to migrate from v1beta1 to v1beta2.</li>
<li>kubeadm v1.22.x and newer no longer support v1beta1 and older APIs, but can be used to migrate v1beta2 to v1beta3.</li>
</ul>
-->
<p>從老的 kubeadm 配置版本遷移：</p>
<ul>
<li>kubeadm v1.15.x 及更新的版本可以用來從 v1beta1 遷移到 v1beta2 版本；</li>
<li>kubeadm v1.22.x 及更新的版本不再支援 v1beta1 和更老的 API，但可以用來
從 v1beta2 遷移到 v1beta3。</li>
</ul>

<!--
<h2>Basics</h2>
<p>The preferred way to configure kubeadm is to pass an YAML configuration file with the <code>--config</code> option. Some of the
configuration options defined in the kubeadm config file are also available as command line flags, but only
the most common/simple use case are supported with this approach.</p>
<p>A kubeadm config file could contain multiple configuration types separated using three dashes (<code>---</code>).</p>
<p>kubeadm supports the following configuration types:</p>
-->
<h2>基礎知識</h2>

<p>配置 kubeadm 的推薦方式是使用 <code>--config</code> 選項向其傳遞一個 YAML 配置檔案。
kubeadm 配置檔案中定義的某些配置選項也可以作為命令列標誌來使用，不過這種
方法所支援的都是一些最常見的、最簡單的使用場景。</p>

<p>一個 kubeadm 配置檔案中可以包含多個配置型別，使用三根橫線（<code>---</code>）作為分隔符。</p>

<p>kubeadm 支援以下配置型別：</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>InitConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>ClusterConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubelet.config.k8s.io/v1beta1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeletConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeproxy.config.k8s.io/v1alpha1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeProxyConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>JoinConfiguration<span style="color:#bbb">
</span></pre>


<!--
<p>To print the defaults for &quot;init&quot; and &quot;join&quot; actions use the following commands:</p>
<pre style="background-color:#fff">kubeadm config print init-defaults
kubeadm config print join-defaults
</pre>
-->
<p>要輸出 &quot;init&quot; 和 &quot;join&quot; 動作的預設值，可以使用下面的命令：</p>

<pre style="background-color:#fff">kubeadm config print init-defaults
kubeadm config print join-defaults
</pre>

<!--
<p>The list of configuration types that must be included in a configuration file depends by the action you are
performing (<code>init</code> or <code>join</code>) and by the configuration options you are going to use (defaults or advanced
customization).</p>
<p>If some configuration types are not provided, or provided only partially, kubeadm will use default values; defaults
provided by kubeadm includes also enforcing consistency of values across components when required (e.g.
<code>--cluster-cidr</code> flag on controller manager and <code>clusterCIDR</code> on kube-proxy).</p>
-->
<p>配置檔案中必須包含的配置型別列表取決於你在執行的動作（<code>init</code> 或 <code>join</code>），
也取決於你要使用的配置選項（預設值或者高階定製）。</p>

<p>如果某些配置型別沒有提供，或者僅部分提供，kubeadm 將使用預設值；
kubeadm 所提供的預設值在必要時也會保證其在多個元件之間是一致的
（例如控制器管理器上的 <code>--cluster-cidr</code> 引數和 kube-proxy 上的
<code>clusterCIDR</code>）。</p>

<!--
<p>Users are always allowed to override default values, with the only exception of a small subset of setting with
relevance for security (e.g. enforce authorization-mode Node and RBAC on api server)</p>
<p>If the user provides a configuration types that is not expected for the action you are performing, kubeadm will
ignore those types and print a warning.</p>
-->
<p>使用者總是可以過載預設配置值，唯一的例外是一小部分與安全性相關聯的配置
（例如在 API 伺服器上強制實施 Node 和 RBAC 鑑權模式）。</p>

<p>如果使用者所提供的配置型別並非你所執行的操作需要的，kubeadm 會忽略這些配置型別
並列印警告資訊。</p>

<!--
<h2>Kubeadm init configuration types</h2>
<p>When executing kubeadm init with the <code>--config</code> option, the following configuration types could be used:
InitConfiguration, ClusterConfiguration, KubeProxyConfiguration, KubeletConfiguration, but only one
between InitConfiguration and ClusterConfiguration is mandatory.</p>
-->
<h2>kubeadm init 配置型別</h2>

<p>當帶有 <code>--config</code> 選項來執行 kubeadm init 命令時，可以使用下面的配置型別：
`InitConfiguration`、`ClusterConfiguration`、`KubeProxyConfiguration`、`KubeletConfiguration`，
但 `InitConfiguration` 和 `ClusterConfiguration`
之間只有一個是必須提供的。</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>InitConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">bootstrapTokens</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>...<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">nodeRegistration</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>...<span style="color:#bbb">
</span></pre>

<!--
<p>The InitConfiguration type should be used to configure runtime settings, that in case of kubeadm init
are the configuration of the bootstrap token and all the setting which are specific to the node where
kubeadm is executed, including:</p>
<ul>
<li>
<p>NodeRegistration, that holds fields that relate to registering the new node to the cluster;
use it to customize the node name, the CRI socket to use or any other settings that should apply to this
node only (e.g. the node ip).</p>
</li>
<li>
<p>LocalAPIEndpoint, that represents the endpoint of the instance of the API server to be deployed on this node;
use it e.g. to customize the API server advertise address.</p>
-->
<p>型別 InitConfiguration 用來配置執行時設定，就 kubeadm init 命令而言，包括
啟動引導令牌以及所有與 kubeadm 所在節點相關的設定，包括：</p>

<ul>
<li>nodeRegistration：其中包含與向叢集註冊新節點相關的欄位；使用這個型別來
定製節點名稱、要使用的 CRI 套接字或者其他僅對當前節點起作用的設定
（例如節點 IP 地址）。</li>
<li>localAPIEndpoint：代表的是要部署到此節點上的 API 伺服器示例的端點；
使用這個型別可以完成定製 API 伺服器公告地址這類操作。</li>
</ul>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>ClusterConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">networking</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>...<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">etcd</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>...<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiServer</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>...<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>...<span style="color:#bbb">
</span><span style="color:#bbb"></span>...<span style="color:#bbb">
</span></pre>

<!--
<p>The ClusterConfiguration type should be used to configure cluster-wide settings,
including settings for:</p>
<ul>
<li>
<p><code>networking</code> that holds configuration for the networking topology of the cluster; use it e.g. to customize
Pod subnet or services subnet.</p>
</li>
-->
<p>型別 `ClusterConfiguration` 用來定製叢集範圍的設定，具體包括以下設定：</p>

<ul>
<li><p><code>networking</code>：其中包含叢集的網路拓撲配置。使用這一部分可以定製 Pod 的
子網或者 Service 的子網。</p>
</li>
<!--
<li>
<p><code>etcd</code>: use it e.g. to customize the local etcd or to configure the API server
for using an external etcd cluster.</p>
</li>
<li>
<p>kube-apiserver, kube-scheduler, kube-controller-manager configurations; use it to customize control-plane
components by adding customized setting or overriding kubeadm default settings.</p>
-->
<li>
<p><code>etcd</code>：etcd 資料庫的配置。例如使用這個部分可以定製本地 etcd 或者配置 API 伺服器
使用一個外部的 etcd 叢集。</p>
</li>
<li>
<p><code>kube-apiserver</code>、<code>kube-scheduler</code>、<code>kube-controller-manager</code>
配置：這些部分可以透過新增定製的設定或者過載 kubeadm 的預設設定來定製控制面元件。</p>
</li>
</ul>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeproxy.config.k8s.io/v1alpha1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeProxyConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">  </span>...<span style="color:#bbb">
</span></pre>

<!--
<p>The KubeProxyConfiguration type should be used to change the configuration passed to kube-proxy instances
deployed in the cluster. If this object is not provided or provided only partially, kubeadm applies defaults.</p>
<p>See https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/ or
https://godoc.org/k8s.io/kube-proxy/config/v1alpha1#KubeProxyConfiguration
for kube-proxy official documentation.</p>
-->
<p>KubeProxyConfiguration 型別用來更改傳遞給在叢集中部署的 kube-proxy 例項
的配置。如果此物件沒有提供，或者僅部分提供，kubeadm 使用預設值。</p>

<p>關於 kube-proxy 的官方文件，可參閱
https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/
或者 https://godoc.org/k8s.io/kube-proxy/config/v1alpha1#KubeProxyConfiguration。
</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubelet.config.k8s.io/v1beta1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeletConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">  </span>...<span style="color:#bbb">
</span></pre>

<!--
<p>The KubeletConfiguration type should be used to change the configurations that will be passed to all kubelet instances
deployed in the cluster. If this object is not provided or provided only partially, kubeadm applies defaults.</p>
<p>See https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/ or
https://godoc.org/k8s.io/kubelet/config/v1beta1#KubeletConfiguration
for kubelet official documentation.</p>
<p>Here is a fully populated example of a single YAML file containing multiple
configuration types to be used during a <code>kubeadm init</code> run.</p>
-->
<p>KubeletConfiguration 型別用來更改傳遞給在叢集中部署的 kubelet 例項的配置。
如果此物件沒有提供，或者僅部分提供，kubeadm 使用預設值。</p>

<p>關於 kubelet 的官方文件，可參閱
https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kubelet/
或者
https://godoc.org/k8s.io/kubelet/config/v1beta1#KubeletConfiguration。</p>

<p>下面是一個為執行 <code>kubeadm init</code> 而提供的、包含多個配置型別的單一 YAML 檔案，
其中填充了很多部分。</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>InitConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">bootstrapTokens</span>:<span style="color:#bbb">
</span><span style="color:#bbb"></span>- <span style="color:#000;font-weight:bold">token</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;9a08jv.c0izixklcxtmnze7&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">description</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;kubeadm bootstrap token&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">ttl</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;24h&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span>- <span style="color:#000;font-weight:bold">token</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;783bde.3f89s0fje9f38fhf&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">description</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;another bootstrap token&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">usages</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- authentication<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- signing<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">groups</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- system:bootstrappers:kubeadm:default-node-token<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">nodeRegistration</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;ec2-10-100-0-1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">criSocket</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/var/run/dockershim.sock&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">taints</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#000;font-weight:bold">key</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;kubeadmNode&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">value</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;someValue&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">effect</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;NoSchedule&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">kubeletExtraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">v</span>:<span style="color:#bbb"> </span><span style="color:#099">4</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">ignorePreflightErrors</span>:<span style="color:#bbb">
</span><span style="color:#bbb"></span>- IsPrivilegedUser<span style="color:#bbb">
</span><span style="color:#bbb">   </span><span style="color:#000;font-weight:bold">imagePullPolicy</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;IfNotPresent&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">localAPIEndpoint</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">advertiseAddress</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">bindPort</span>:<span style="color:#bbb"> </span><span style="color:#099">6443</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">certificateKey</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">skipPhases</span>:<span style="color:#bbb">
</span><span style="color:#bbb"> </span>- addon/kube-proxy<span style="color:#bbb">
</span><span style="color:#bbb"></span>---<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>ClusterConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">etcd</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#998;font-style:italic"># one of local or external</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">local</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">imageRepository</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;k8s.gcr.io&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">imageTag</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;3.2.24&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">dataDir</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/var/lib/etcd&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">listen-client-urls</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;http://10.100.0.1:2379&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">serverCertSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>- <span style="color:#bbb"> </span><span style="color:#d14">&#34;ec2-10-100-0-1.compute-1.amazonaws.com&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">peerCertSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>- <span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#998;font-style:italic"># external:</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#998;font-style:italic"># endpoints:</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#998;font-style:italic"># - &#34;10.100.0.1:2379&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#998;font-style:italic"># - &#34;10.100.0.2:2379&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#998;font-style:italic"># caFile: &#34;/etcd/kubernetes/pki/etcd/etcd-ca.crt&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#998;font-style:italic"># certFile: &#34;/etcd/kubernetes/pki/etcd/etcd.crt&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#998;font-style:italic"># keyFile: &#34;/etcd/kubernetes/pki/etcd/etcd.key&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">networking</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">serviceSubnet</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.96.0.0/16&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">podSubnet</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.244.0.0/24&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">dnsDomain</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;cluster.local&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kubernetesVersion</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;v1.21.0&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">controlPlaneEndpoint</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.100.0.1:6443&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiServer</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">authorization-mode</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;Node,RBAC&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">certSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#d14">&#34;10.100.1.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#d14">&#34;ec2-10-100-0-1.compute-1.amazonaws.com&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">timeoutForControlPlane</span>:<span style="color:#bbb"> </span>4m0s<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">controllerManager</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">&#34;node-cidr-mask-size&#34;: </span><span style="color:#d14">&#34;20&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">scheduler</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">address</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">certificatesDir</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/kubernetes/pki&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">imageRepository</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;k8s.gcr.io&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">clusterName</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;example-cluster&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span>---<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubelet.config.k8s.io/v1beta1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeletConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#998;font-style:italic"># kubelet specific options here</span><span style="color:#bbb">
</span><span style="color:#bbb"></span>---<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeproxy.config.k8s.io/v1alpha1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeProxyConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#998;font-style:italic"># kube-proxy specific options here</span><span style="color:#bbb">
</span></pre>

<!--
<h2>Kubeadm join configuration types</h2>
<p>When executing <code>kubeadm join</code> with the <code>--config</code> option, the JoinConfiguration type should be provided.</p>
-->
<h2> kubeadm join 配置型別</h2>

<p>當帶有 <code>--config</code> 選項來執行 <code>kubeadm join</code> 操作時，
需要提供 JoinConfiguration 型別。</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>JoinConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">  </span>...<span style="color:#bbb">
</span></pre>

<!--
<p>The JoinConfiguration type should be used to configure runtime settings, that in case of <code>kubeadm join</code>
are the discovery method used for accessing the cluster info and all the setting which are specific
to the node where kubeadm is executed, including:</p>
<ul>
<li>
<p><code>nodeRegistration</code>, that holds fields that relate to registering the new node to the cluster;
use it to customize the node name, the CRI socket to use or any other settings that should apply to this
node only (e.g. the node ip).</p>
</li>
<li>
<p><code>apiEndpoint</code>, that represents the endpoint of the instance of the API server to be eventually deployed on this node.</p>
</li>
</ul>
-->
<p>JoinConfiguration 型別用來配置執行時設定，就 <code>kubeadm join</code> 而言包括
用來訪問叢集資訊的發現方法，以及所有特定於 kubeadm 執行所在節點的設定，包括：</p>

<ul>
<li><code>nodeRegistration</code>：其中包含向叢集註冊新節點相關的配置欄位；
使用這個型別可以定製節點名稱、用使用的 CRI 套接字和所有其他僅適用於當前節點的設定
（例如節點 IP 地址）。</li>
<li><code>apiEndpoint</code>：用來代表最終要部署到此節點上的 API
伺服器例項的端點。</li>
</ul>

<!--
## Resource Types
-->
## 資源型別  {#resource-types}

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)
- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

## `ClusterConfiguration`     {#kubeadm-k8s-io-v1beta3-ClusterConfiguration}

<!--
<p>ClusterConfiguration contains cluster-wide configuration for a kubeadm cluster</p>
-->
<p>ClusterConfiguration 包含一個 kubadm 叢集的叢集範圍配置資訊。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ClusterConfiguration</code></td></tr>

<tr><td><code>etcd</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Etcd"><code>Etcd</code></a>
</td>
<td>
   <!--
   <p><code>etcd</code> holds the configuration for etcd.</p>
   -->
   <p><code>etcd</code> 中包含 etcd 服務的配置。</p>
</td>
</tr>
<tr><td><code>networking</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Networking"><code>Networking</code></a>
</td>
<td>
   <!--
   <p><code>networking</code> holds configuration for the networking topology of the cluster.</p>
   -->
   <p><code>networking</code> 欄位包含叢集的網路拓撲配置。</p>
</td>
</tr>
<tr><td><code>kubernetesVersion</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>kubernetesVersion</code> is the target version of the control plane.</p>
   -->
   <p><code>kubernetesVersion</code> 設定控制面的目標版本。</p>
</td>
</tr>
<tr><td><code>controlPlaneEndpoint</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>controlPlaneEndpoint</code> sets a stable IP address or DNS name for the control plane.
It can be a valid IP address or a RFC-1123 DNS subdomain, both with optional TCP port.
In case the <code>controlPlaneEndpoint</code> is not specified, the <code>advertiseAddress</code> + <code>bindPort</code>
are used; in case the <code>controlPlaneEndpoint</code> is specified but without a TCP port,
the <code>bindPort</code> is used.
Possible usages are:</p>
   -->
   <p><code>controlPlaneEndpoint</code> 為控制面設定一個穩定的 IP 地址或 DNS 名稱。
取值可以是一個合法的 IP 地址或者 RFC-1123 形式的 DNS 子域名，二者均可以帶一個
可選的 TCP 埠號。
如果 <code>controlPlaneEndpoint</code> 未設定，則使用 <code>advertiseAddress<code>
+ <code>bindPort</code>。
如果設定了 <code>controlPlaneEndpoint</code>，但未指定 TCP 埠號，則使用
<code>bindPort</code>。</p>
<p>可能的用法有：</p>
<!--
<ul>
<li>In a cluster with more than one control plane instances, this field should be
assigned the address of the external load balancer in front of the
control plane instances.</li>
<li>In environments with enforced node recycling, the <code>controlPlaneEndpoint</code> could
be used for assigning a stable DNS to the control plane.</li>
</ul>
-->
<ul>
  <li>在一個包含不止一個控制面例項的叢集中，該欄位應該設定為放置在控制面
例項之前的外部負載均衡器的地址。</li>
  <li>在帶有強制性節點回收的環境中，<code>controlPlaneEndpoint</code> 可以用來
為控制面設定一個穩定的 DNS。</li>
</ul>
</td>
</tr>
<tr><td><code>apiServer</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIServer"><code>APIServer</code></a>
</td>
<td>
   <!--
   <p><code>apiServer</code> contains extra settings for the API server.</p>
   -->
   <p><code>apiServer</code> 包含 API 伺服器的一些額外配置。</p>
</td>
</tr>
<tr><td><code>controllerManager</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <!--
   <p><code>controllerManager</code> contains extra settings for the controller manager.</p>
   -->
   <p><code>controllerManager</code> 中包含控制器管理器的額外配置。</p>
</td>
</tr>
<tr><td><code>scheduler</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <!--
   <p><code>scheduler</code> contains extra settings for the scheduler.</p>
   -->
   <p><code>scheduler</code> 包含排程器的額外配置。</p>
</td>
</tr>
<tr><td><code>dns</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-DNS"><code>DNS</code></a>
</td>
<td>
   <!--
   <p><code>dns</code> defines the options for the DNS add-on installed in the cluster.</p>
   -->
   <p><code>dns</code> 定義在叢集中安裝的 DNS 外掛的選項。</p>
</td>
</tr>
<tr><td><code>certificatesDir</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>certificatesDir</code> specifies where to store or look for all required certificates.</p>
   -->
   <p><code>certificatesDir</code> 設定在何處存放或者查詢所需證書。</p>
</td>
</tr>
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>imageRepository</code> sets the container registry to pull images from.
If empty, <code>k8s.gcr.io</code> will be used by default.
In case of kubernetes version is a CI build (kubernetes version starts with <code>ci/</code>)
<code>gcr.io/k8s-staging-ci-images</code> will be used as a default for control plane components
and for kube-proxy, while <code>k8s.gcr.io</code> will be used for all the other images.</p>
   -->
   <p><code>imageRepository</code> 設定用來拉取映象的容器倉庫。
如果此欄位為空，預設使用 <code>k8s.gcr.io</code>。
當 Kubernetes 用來執行 CI 構造時（Kubernetes 版本以 <code>ci/</code> 開頭），
將預設使用 <code>gcr.io/k8s-staging-ci-images</code> 來拉取控制面元件映象，
而使用 <code>k8s.gcr.io</code> 來拉取所有其他映象。</p>
</td>
</tr>
<tr><td><code>featureGates</code><br/>
<code>map[string]bool</code>
</td>
<td>
   <!--
   <p><code>featureGates</code> contains the feature gates enabled by the user.</p>
   -->
   <p><code>featureGates</code> 包含使用者所啟用的特性門控。</p>
</td>
</tr>
<tr><td><code>clusterName</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>The cluster name.</p>
   -->
   <p>叢集名稱。</p>
</td>
</tr>
</tbody>
</table>

## `InitConfiguration`     {#kubeadm-k8s-io-v1beta3-InitConfiguration}
    
<!--
<p>InitConfiguration contains a list of elements that is specific &quot;kubeadm init&quot;-only runtime
information.
<code>kubeadm init</code>-only information. These fields are solely used the first time <code>kubeadm init</code> runs.
After that, the information in the fields IS NOT uploaded to the <code>kubeadm-config</code> ConfigMap
that is used by <code>kubeadm upgrade</code> for instance. These fields must be omitempty.</p>
-->
<p>InitConfiguration 包含一組特定於 &quot;kubeadm init&quot; 的執行時元素。
這裡的欄位僅用於第一次執行 <code>kubeadm init</code> 命令。
之後，此結構中的欄位資訊不會再被上傳到 <code>kubeadm upgrade</code> 所要使用的
<code>kubeadm-config</code> ConfigMap 中。
這些欄位必須設定 &quot;omitempty&quot;</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InitConfiguration</code></td></tr>
  
<tr><td><code>bootstrapTokens</code><br/>
<a href="#BootstrapToken"><code>[]BootstrapToken</code></a>
</td>
<td>
   <!--
   <p><code>bootstrapTokens</code> is respected at <code>kubeadm init</code> time and describes a set of Bootstrap Tokens to create.
This information IS NOT uploaded to the kubeadm cluster configmap, partly because of its sensitive nature</p>
   -->
   <p><code>bootstrapTokens</code> 在 <code>kubeadm init</code> 執行時會被用到，
其中描述了一組要建立的啟動引導令牌（Bootstrap Tokens）。
這裡的資訊不會被上傳到 kubeadm 在叢集中儲存的 ConfigMap 中，部分原因是由於資訊
本身比較敏感。</p>
</td>
</tr>
<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
   <!--
   <p><code>nodeRegistration</code> holds fields that relate to registering the new control-plane node
to the cluster.</p>
   -->
   <p><code>nodeRegistration</code> 中包含與向叢集中註冊新的控制面節點相關的欄位。</p>
</td>
</tr>
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <!--
   <p><code>localAPIEndpoint</code> represents the endpoint of the API server instance that's deployed on this
control plane node. In HA setups, this differs from <code>ClusterConfiguration.controlPlaneEndpoint</code>
in the sense that <code>controlPlaneEndpoint</code> is the global endpoint for the cluster, which then
load-balances the requests to each individual API server.
This configuration object lets you customize what IP/DNS name and port the local API server
advertises it's accessible on. By default, kubeadm tries to auto-detect the IP of the default
interface and use that, but in case that process fails you may set the desired value here.</p>
   -->
   <p><code>localAPIEndpoint</code> 所代表的的是在此控制面節點上要部署的 API 伺服器
的端點。在高可用（HA）配置中，此欄位與 <code>ClusterConfiguration.controlPlaneEndpoint</code>
的取值不同：後者代表的是整個叢集的全域性端點，該端點上的請求會被負載均衡到每個
API 伺服器。
此配置物件允許你定製本地 API 伺服器所公佈的、可訪問的 IP/DNS 名稱和埠。
預設情況下，kubeadm 會嘗試自動檢測預設介面上的 IP 並使用該地址。
不過，如果這種檢測失敗，你可以在此欄位中直接設定所期望的值。</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>certificateKey</code> sets the key with which certificates and keys are encrypted prior to being
uploaded in a Secret in the cluster during the <code>uploadcerts init</code> phase.</p>
   -->
   <p><code>certificateKey</code> 用來設定一個秘鑰，該秘鑰將對 <code>uploadcerts init</code>
階段上傳到叢集中某 Secret 內的秘鑰和證書加密。</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p><code>skipPhases</code> is a list of phases to skip during command execution.
The list of phases can be obtained with the <code>kubeadm init --help</code> command.
The flag &quot;--skip-phases&quot; takes precedence over this field.</p>
   -->
   <p><code>skipPhases</code> 是命令執行過程中藥略過的階段（Phases）。
透過執行命令 <code>kubeadm init --help</code> 可以獲得階段的列表。
引數標誌 &quot;--skip-phases&quot; 優先於此欄位的設定。</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Patches"><code>Patches</code></a>
</td>
<td>
   <!--
   <p><code>patches</code> contains options related to applying patches to components deployed by kubeadm during
<code>kubeadm init</code>.</p>
   -->
   <p><code>patches</code> 包含與 <code>kubeadm init</code> 階段 kubeadm 所部署
的元件上要應用的補丁相關的資訊。</p>
</td>
</tr>
</tbody>
</table>

## `JoinConfiguration`     {#kubeadm-k8s-io-v1beta3-JoinConfiguration}

<p>
<!--
JoinConfiguration contains elements describing a particular node.
-->
JoinConfiguration 包含描述特定節點的元素。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta3</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>JoinConfiguration</code></td></tr>

<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
<p>
   <!--
   <code>nodeRegistration</code> holds fields that relate to registering the new
control-plane node to the cluster.
   -->
   <code>nodeRegistration</code> 包含與向叢集註冊控制面節點相關的欄位。
</p>
</td>
</tr>
<tr><td><code>caCertPath</code><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   <code>caCertPath</code> is the path to the SSL certificate authority used to secure
comunications between a node and the control-plane.
Defaults to &quot;/etc/kubernetes/pki/ca.crt&quot;.
   -->
   <code>caCertPath</code> 是指向 SSL 證書機構的路徑，該證書包用來加密
節點與控制面之間的通訊。預設值為 &quot;/etc/kubernetes/pki/ca.crt&quot;。
</p>
</td>
</tr>
<tr><td><code>discovery</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeadm-k8s-io-v1beta3-Discovery"><code>Discovery</code></a>
</td>
<td>
<p>
   <!--
   <code>discovery</code> specifies the options for the kubelet to use during the TLS
bootstrap process.
   -->
   <code>discovery</code> 設定 TLS 引導過程中 kubelet 要使用的選項。
</p>
</td>
</tr>
<tr><td><code>controlPlane</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-JoinControlPlane"><code>JoinControlPlane</code></a>
</td>
<td>
<p>
   <!--
   <code>controlPlane</code> defines the additional control plane instance to be deployed
on the joining node. If nil, no additional control plane instance will be deployed.
   -->
   <code>controlPlane</code> 定義要在正被加入到叢集中的節點上部署的額外
控制面例項。此欄位為 null 時，不會再上面部署額外的控制面例項。
</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
<p>
   <!--
   <code>skipPhases</code> is a list of phases to skip during command execution.
The list of phases can be obtained with the <code>kubeadm join --help</code> command.
The flag <code>--skip-phases</code> takes precedence over this field.
   -->
   此欄位包含在命令執行過程中要略過的階段。透過 <code>kubeadm join --help</code>
命令可以檢視階段的列表。引數 <code>--skip-phases</code> 優先於此欄位。
</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Patches"><code>Patches</code></a>
</td>
<td>
<p>
   <!--
   <code>patches</code> contains options related to applying patches to components deployed
by kubeadm during <code>kubeadm join</code>.
   -->
   此欄位包含 <code>kubeadm join</code> 階段向 kubeadm 所部署的元件打補丁
的選項。
</p>
</td>
</tr>
</tbody>
</table>

## `APIEndpoint`     {#kubeadm-k8s-io-v1beta3-APIEndpoint}

<!--
**Appears in:**
-->
**出現在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

- [JoinControlPlane](#kubeadm-k8s-io-v1beta3-JoinControlPlane)

<p>
<!--
APIEndpoint struct contains elements of API server instance deployed on a node.
-->
APIEndpoint 結構包含某節點上部署的 API 伺服器的配置元素。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>advertiseAddress</code><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   <code>advertiseAddress</code> sets the IP address for the API server to advertise.
   -->
   <code>advertiseAddress</code> 設定 API 伺服器要公佈的 IP 地址。
</p>
</td>
</tr>
<tr><td><code>bindPort</code><br/>
<code>int32</code>
</td>
<td>
<p>
   <!--
   <code>bindPort</code> sets the secure port for the API Server to bind to.
Defaults to 6443.
   -->
   <code>bindPort</code> 設定 API 伺服器要繫結到的安全埠。預設值為 6443。
</p>
</td>
</tr>
</tbody>
</table>

## `APIServer`     {#kubeadm-k8s-io-v1beta3-APIServer}

<!--
**Appears in:**
-->
**出現在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<p>
<!--
APIServer holds settings necessary for API server deployments in the cluster
-->
APIServer 包含叢集中 API 伺服器部署所必需的設定。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>ControlPlaneComponent</code> <B><!--<!--[Required]-->[必需]-->[必需]</B><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>（<code>ControlPlaneComponent</code> 結構的欄位被嵌入到此型別中）
   <span class="text-muted">無描述.</span>
</td>
</tr>
<tr><td><code>certSANs</code><br/>
<code>[]string</code>
</td>
<td>
<p>
   <!--
   <code>certSANs</code> sets extra Subject Alternative Names (SANs) for the API Server signing certificate.
   -->
   <code>certSANs</code> 設定 API 伺服器簽署證書所用的額外主題替代名（Subject Alternative Name，SAN）。
</p>
</td>
</tr>
<tr><td><code>timeoutForControlPlane</code><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
   <!--
   <code>timeoutForControlPlane</code> controls the timeout that we wait for API server to appear.
   -->
   <code>timeoutForControlPlane</code> 用來控制我們等待 API 伺服器開始執行的超時時間。
</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenDiscovery`     {#kubeadm-k8s-io-v1beta3-BootstrapTokenDiscovery}

<!--
**Appears in:**
-->
**出現在：**

- [Discovery](#kubeadm-k8s-io-v1beta3-Discovery)

<p>
<!--
BootstrapTokenDiscovery is used to set the options for bootstrap token based discovery
-->
BootstrapTokenDiscovery 用來設定基於引導令牌的服務發現選項。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>token</code> <B><!--<!--[Required]-->[必需]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   <code>token</code> is a token used to validate cluster information fetched from the control-plane.
   -->
   <code>token</code> 用來驗證從控制面獲得的叢集資訊。
</p>
</td>
</tr>
<tr><td><code>apiServerEndpoint</code><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   <code>apiServerEndpoint</p> is an IP or domain name to the API server from which
information will be fetched.
   -->
   <code>apiServerEndpoint</p> 為 API 伺服器的 IP 地址或者域名，從該端點可以獲得叢集資訊。
</p>
</td>
</tr>
<tr><td><code>caCertHashes</code><br/>
<code>[]string</code>
</td>
<td>
<p>
   <!--
   <code>caCertHashes</code> specifies a set of public key pins to verify when token-based discovery
is used. The root CA found during discovery must match one of these values.
Specifying an empty set disables root CA pinning, which can be unsafe.
Each hash is specified as &quot;&lt;type&gt;:&lt;value&gt;&quot;, where the only currently supported type is
&quot;sha256&quot;. This is a hex-encoded SHA-256 hash of the Subject Public Key Info (SPKI)
object in DER-encoded ASN.1. These hashes can be calculated using, for example, OpenSSL.
   -->
   <code>caCertHashes</code> 設定一組在基於令牌來發現服務時要驗證的公鑰指紋。
發現過程中獲得的根 CA 必須與這裡的數值之一匹配。
設定為空集合意味著禁用根 CA 指紋，因而可能是不安全的。
每個雜湊值的形式為 "&lt;type&gt;:&lt;value&gt;"，當前唯一支援的 type 為
&quot;sha256&quot;。
雜湊值為主體公鑰資訊（Subject Public Key Info，SPKI）物件的 SHA-256
雜湊值（十六進位制編碼），形式為 DER 編碼的 ASN.1。
例如，這些雜湊值可以使用 OpenSSL 來計算。
</p>
</td>
</tr>
<tr><td><code>unsafeSkipCAVerification</code><br/>
<code>bool</code>
</td>
<td>
<p>
   <!--
   <code>unsafeSkipCAVerification</code> allows token-based discovery without CA verification
via <code>caCertHashes</code>. This can weaken the security of kubeadm since other nodes can
impersonate the control-plane.
   -->
   <code>unsafeSkipCAVerification</code> 允許在使用基於令牌的服務發現時
不使用 <code>caCertHashes</code> 來執行 CA 驗證。這會弱化 kubeadm 的安全性，
因為其他節點可以偽裝成控制面。
</p>
</td>
</tr>
</tbody>
</table>

## `ControlPlaneComponent`     {#kubeadm-k8s-io-v1beta3-ControlPlaneComponent}

<!--
**Appears in:**
-->
**出現在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)
- [APIServer](#kubeadm-k8s-io-v1beta3-APIServer)

<!--
ControlPlaneComponent holds settings common to control plane component of the cluster
-->
<p>ControlPlaneComponent 中包含對叢集中所有控制面元件都適用的設定。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
<p>
   <!--
   <code>extraArgs</code> is an extra set of flags to pass to the control plane component.
A key in this map is the flag name as it appears on the command line except
without leading dash(es).
   -->
   <code>extraArgs</code> 是要傳遞給控制面元件的一組額外的引數標誌。
此對映中的每個鍵對應命令列上使用的標誌名稱，只是沒有其引導連字元。
</p>
</td>
</tr>
<tr><td><code>extraVolumes</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-HostPathMount"><code>[]HostPathMount</code></a>
</td>
<td>
<p>
   <!--
   <code>extraVolumes</code> is an extra set of host volumes, mounted to the control plane component.
   -->
   <code>extraVolumes</code> 是一組額外的主機卷，需要掛載到控制面元件中。
</p>
</td>
</tr>
</tbody>
</table>

## `DNS`     {#kubeadm-k8s-io-v1beta3-DNS}

<!--
**Appears in:**
-->
**出現在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<!--
DNS defines the DNS addon that should be used in the cluster
-->
<p>DNS 結構定義要在叢集中使用的 DNS 外掛。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>ImageMeta</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeadm-k8s-io-v1beta3-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>
<!--
(Members of <code>ImageMeta</code> are embedded into this type.)
-->
（<code>ImageMeta</code> 的成員被內嵌到此型別中）。
<p>
   <!--
   <code>imageMeta</code> allows to customize the image used for the DNS component.
   -->
   <code>imageMeta</code> 允許對 DNS 元件所使用的的映象作定製。
</p>
</td>
</tr>
</tbody>
</table>

## `Discovery`     {#kubeadm-k8s-io-v1beta3-Discovery}

<!--
**Appears in:**
-->
**出現在：**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--
Discovery specifies the options for the kubelet to use during the TLS Bootstrap process.
-->
<p>Discovery 設定 TLS 啟動引導過程中 kubelet 要使用的配置選項。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>bootstrapToken</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-BootstrapTokenDiscovery"><code>BootstrapTokenDiscovery</code></a>
</td>
<td>
<p>
   <!--
   <code>bootstrapToken</code> is used to set the options for bootstrap token based discovery.
<code>bootstrapToken</code> and <code>file</code> are mutually exclusive.
   -->
   <code>bootstrapToken</code> 設定基於啟動引導令牌的服務發現選項。
<code>bootstrapToken</code> 與 <code>file</code> 是互斥的。
</p>
</td>
</tr>
<tr><td><code>file</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-FileDiscovery"><code>FileDiscovery</code></a>
</td>
<td>
<p>
   <!--
   <code>file</code> is used to specify a file or URL to a kubeconfig file from which to load
cluster information.
<code>bootstrapToken</code> and <code>file</code> are mutually exclusive.
   -->
   <code> 用來設定一個檔案或者 URL 路徑，指向一個 kubeconfig 檔案；該配置檔案
中包含叢集資訊。
<code>bootstrapToken</code> 與 <code>file</code> 是互斥的。
</p>
</td>
</tr>
<tr><td><code>tlsBootstrapToken</code><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   <code>tlsBootstrapToken</code> is a token used for TLS bootstrapping.
If <code>bootstrapToken</code> is set, this field is defaulted to <code>.bootstrapToken.token</code>, but
can be overridden. If <code>file<code> is set, this field &lowast;&lowast;must be set&lowast;&lowast; in case the KubeConfigFile
does not contain any other authentication information
   -->
   <code>tlsBootstrapToken</code> 是 TLS 啟動引導過程中使用的令牌。
如果設定了 <code>bootstrapToken</code>，則此欄位預設值為 <code>.bootstrapToken.token</code>，不過可以被過載。
如果設定了 <code>file</code>，此欄位<B>必須被設定</B>，以防 kubeconfig 檔案
中不包含其他身份認證資訊。
</p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
   <!--
   <code>timeout</code> modifies the discovery timeout.
   -->
   <code>timeout</code> 用來修改發現過程的超時時長。
</p>
</td>
</tr>
</tbody>
</table>

## `Etcd`     {#kubeadm-k8s-io-v1beta3-Etcd}

<!--
**Appears in:**
-->
**出現在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<!--
Etcd contains elements describing Etcd configuration.
-->
<p>Etcd 包含用來描述 etcd 配置的元素。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>local</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-LocalEtcd"><code>LocalEtcd</code></a>
</td>
<td>
<p>
   <!--
   <code>local</code> provides configuration knobs for configuring the local etcd instance.
<code>local</code> and <code>external</code> are mutually exclusive.
   -->
   <code>local</code> 提供配置本地 etcd 例項的選項。<code>local</code> 和
<code>external</code> 是互斥的。
</p>
</td>
</tr>
<tr><td><code>external</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ExternalEtcd"><code>ExternalEtcd</code></a>
</td>
<td>
<p>
   <!--
   <code>external</code> describes how to connect to an external etcd cluster.
<code>local</code> and <code>external</code> are mutually exclusive.
   -->
   <code>external</code> 描述如何連線到外部的 etcd 叢集。
<code>external</code> 是互斥的。
</p>
</td>
</tr>
</tbody>
</table>

## `ExternalEtcd`     {#kubeadm-k8s-io-v1beta3-ExternalEtcd}

<!--
**Appears in:**
-->
**出現在：**

- [Etcd](#kubeadm-k8s-io-v1beta3-Etcd)

<!--
ExternalEtcd describes an external etcd cluster.
Kubeadm has no knowledge of where certificate files live and they must be supplied.
-->
<p>ExternalEtcd 描述外部 etcd 叢集。
kubeadm 不清楚證書檔案的存放位置，因此必須單獨提供證書資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>endpoints</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p><code>endpoints</code> contains the list of etcd members.</p>
   -->
   <p><code>endpoints</code> 包含一組 etcd 成員的列表。</p>
</td>
</tr>
<tr><td><code>caFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>caFile</code> is an SSL Certificate Authority (CA) file used to secure etcd communication.
Required if using a TLS connection.</p>
   -->
   <p><code>caFile</code> 是一個 SSL 證書機構（CA）檔案，用來加密 etcd 通訊。
如果使用 TLS 連線，此欄位為必需欄位。</p>
</td>
</tr>
<tr><td><code>certFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>certFile</code> is an SSL certification file used to secure etcd communication.
Required if using a TLS connection.</p>
   -->
   <p><code>certFile</code> 是一個 SSL 證書檔案，用來加密 etcd 通訊。
如果使用 TLS 連線，此欄位為必需欄位。</p>
</td>
</tr>
<tr><td><code>keyFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>keyFile</code> is an SSL key file used to secure etcd communication.
Required if using a TLS connection.</p>
   -->
   <p><code>keyFile</code> 是一個用來加密 etcd 通訊的 SSL 秘鑰檔案。
此欄位在使用 TLS 連線時為必填欄位。</p>
</td>
</tr>
</tbody>
</table>

## `FileDiscovery`     {#kubeadm-k8s-io-v1beta3-FileDiscovery}
    
<!--
**Appears in:**
-->
**出現在：**

- [Discovery](#kubeadm-k8s-io-v1beta3-Discovery)

<!--
<p>FileDiscovery is used to specify a file or URL to a kubeconfig file from which to load
cluster information.</p>
-->
<p>FileDiscovery 用來指定一個檔案或者 URL 路徑，指向一個 kubeconfig 檔案；該配置檔案
可用來載入叢集資訊。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>kubeConfigPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>kubeConfigPath</code> is used to specify the actual file path or URL to the kubeconfig
file from which to load cluster information.</p>
   -->
   <p><code>kubeConfigPath</code> 用來指定一個檔案或者 URL 路徑，指向一個 kubeconfig 檔案；
該配置檔案可用來載入叢集資訊。</p>
</td>
</tr>
</tbody>
</table>

## `HostPathMount`     {#kubeadm-k8s-io-v1beta3-HostPathMount}
    
<!--
**Appears in:**
-->
**出現在：**

- [ControlPlaneComponent](#kubeadm-k8s-io-v1beta3-ControlPlaneComponent)

<!--p>HostPathMount contains elements describing volumes that are mounted from the host.</p-->
<p>HostPathMount 包含從宿主節點掛載的卷的資訊。</p-->

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--p><code>name</code> is the name of the volume inside the Pod template.</p-->
   <p><code>name</code> 為卷在 Pod 模板中的名稱。</p>
</td>
</tr>
<tr><td><code>hostPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--p><code>hostPath</code> is the path in the host that will be mounted inside the Pod.</p-->
   <p><code>hostPath</code> 是要在 Pod 中掛載的卷在宿主系統上的路徑。</p>
</td>
</tr>
<tr><td><code>mountPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--p><code>mountPath</code> is the path inside the Pod where <code>hostPath</code> will be mounted.</p-->
   <p><code>mountPath</code> 是 <code>hostPath</code> 在 Pod 內掛載的路徑。</p>
</td>
</tr>
<tr><td><code>readOnly</code><br/>
<code>bool</code>
</td>
<td>
   <!--p><code>readOnly</code> controls write access to the volume.</p-->
   <p><code>readOnly</code> 控制卷的讀寫訪問模式。</p>
</td>
</tr>
<tr><td><code>pathType</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#hostpathtype-v1-core"><code>core/v1.HostPathType</code></a>
</td>
<td>
   <!--p><code>pathType</code> is the type of the <code>hostPath</code>.</p-->
   <p><code>pathType</code> 是 <code>hostPath</code> 的型別。</p>
</td>
</tr>
</tbody>
</table>

## `ImageMeta`     {#kubeadm-k8s-io-v1beta3-ImageMeta}
    
<!--
**Appears in:**
-->
**出現在：**

- [DNS](#kubeadm-k8s-io-v1beta3-DNS)
- [LocalEtcd](#kubeadm-k8s-io-v1beta3-LocalEtcd)

<!--p>ImageMeta allows to customize the image used for components that are not
originated from the Kubernetes/Kubernetes release process</p-->
<p>ImageMeta 用來配置來源不是 Kubernetes/kubernetes
釋出過程的元件所使用的映象。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>imageRepository</code> sets the container registry to pull images from.
If not set, the <code>imageRepository</code> defined in ClusterConfiguration will be used instead.</p-->
   <p><code>imageRepository</code> 設定映象拉取所用的容器倉庫。
若未設定，則使用 ClusterConfiguration 中的 <code>imageRepository</code>。</p>
</td>
</tr>
<tr><td><code>imageTag</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>imageTag</code> allows to specify a tag for the image.
In case this value is set, kubeadm does not change automatically the version of
the above components during upgrades.</p-->
   <p><code>imageTag</code> 允許使用者設定映象的標籤。
如果設定了此欄位，則 kubeadm 不再在叢集升級時自動更改元件的版本。</p>
</td>
</tr>
</tbody>
</table>

## `JoinControlPlane`     {#kubeadm-k8s-io-v1beta3-JoinControlPlane}

<!--
**Appears in:**
-->
**出現在：**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--p>JoinControlPlane contains elements describing an additional control plane instance
to be deployed on the joining node.</p-->
<p>JoinControlPlane 包含在正在加入叢集的節點上要部署的額外的控制面元件的
設定。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <!--p><code>localAPIEndpoint</code> represents the endpoint of the API server instance to be
deployed on this node.</p-->
   <p><code>localAPIEndpoint</code> 代表的是將在此節點上部署的 API 伺服器例項
的端點。</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>certificateKey</code> is the key that is used for decryption of certificates after
they are downloaded from the secret upon joining a new control plane node.
The corresponding encryption key is in the InitConfiguration.</p-->
   <p><code>certificateKey</code> 是在新增新的控制面節點時用來解密所下載的
Secret 中的證書的秘鑰。對應的加密秘鑰在 InitConfiguration 結構中。</p>
</td>
</tr>
</tbody>
</table>

## `LocalEtcd`     {#kubeadm-k8s-io-v1beta3-LocalEtcd}

<!--
**Appears in:**
-->
**出現在：**

- [Etcd](#kubeadm-k8s-io-v1beta3-Etcd)

<!--p>LocalEtcd describes that kubeadm should run an etcd cluster locally</p-->
<p>LocalEtcd 描述的是 kubeadm 要使用的本地 etcd 叢集。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>ImageMeta</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeadm-k8s-io-v1beta3-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>
<!--
(Members of <code>ImageMeta</code> are embedded into this type.)
-->
（<code>ImageMeta</code> 結構的欄位被嵌入到此型別中。）
   <!--p>ImageMeta allows to customize the container used for etcd.</p-->
   <p>ImageMeta 允許使用者為 etcd 定製要使用的容器。</p>
</td>
</tr>
<tr><td><code>dataDir</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--p><code>dataDir</code> is the directory etcd will place its data.
Defaults to &quot;/var/lib/etcd&quot;.</p-->
   <p><code>dataDir</code> 是 etcd 用來存放資料的目錄。
預設值為  &quot;/var/lib/etcd&quot;。</p>
</td>
</tr>
<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <!--p><code>extraArgs</code> are extra arguments provided to the etcd binary when run
inside a static Pod. A key in this map is the flag name as it appears on the
command line except without leading dash(es).</p-->
   <p><code>extraArgs</code> 是為 etcd 可執行檔案提供的額外引數，用於在靜態
Pod 中執行 etcd。對映中的每一個鍵對應命令列上的一個標誌引數，只是去掉了
前置的連字元。</p>
</td>
</tr>
<tr><td><code>serverCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <!--p><code>serverCertSANs</code> sets extra Subject Alternative Names (SANs) for the etcd
server signing certificate.</p-->
   <p><code>serverCertSANs</code> 為 etcd 伺服器的簽名證書設定額外的
主體替代名（Subject Alternative Names，SAN）。</p>
</td>
</tr>
<tr><td><code>peerCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <!--p><code>peerCertSANs</code> sets extra Subject Alternative Names (SANs) for the etcd peer
signing certificate.</p-->
   <p><code>peerCertSANs</code> 為 etcd 的對等端簽名證書設定額外的
主體替代名（Subject Alternative Names，SAN）。</p>
</td>
</tr>
</tbody>
</table>

## `Networking`     {#kubeadm-k8s-io-v1beta3-Networking}
    
<!--
**Appears in:**
-->
**出現在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<!--p>Networking contains elements describing cluster's networking configuration</p-->
<p>Networking 中包含描述叢集網路配置的元素。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>serviceSubnet</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>serviceSubnet</code> is the subnet used by Kubernetes Services. Defaults to &quot;10.96.0.0/12&quot;.</p-->
   <p><code>serviceSubnet</code> 是 Kubernetes 服務所使用的的子網。
預設值為 &quot;10.96.0.0/12&quot;。</p>
</td>
</tr>
<tr><td><code>podSubnet</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>podSubnet</code> is the subnet used by Pods.</p-->
   <p><code>podSubnet</code> 為 Pod 所使用的子網。</p>
</td>
</tr>
<tr><td><code>dnsDomain</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>dnsDomain</code> is the DNS domain used by Kubernetes Services. Defaults to &quot;cluster.local&quot;.</p-->
   <p><code>dnsDomain</code> 是 Kubernetes 服務所使用的的 DNS 域名。
預設值為 &quot;cluster.local&quot;。</p>
</td>
</tr>
</tbody>
</table>

## `NodeRegistrationOptions`     {#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions}
    
<!--
**Appears in:**
-->
**出現在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--p>NodeRegistrationOptions holds fields that relate to registering a new control-plane or
node to the cluster, either via &quot;kubeadm init&quot; or &quot;kubeadm join&quot;</p-->
<p>NodeRegistrationOptions 包含向叢集中註冊新的控制面或節點所需要的資訊；
節點註冊可能透過 &quot;kubeadm init&quot; 或 &quot;kubeadm join&quot; 完成。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>name</code> is the <code>.metadata.name</code> field of the Node API object that will be created in this
<code>kubeadm init</code> or <code>kubeadm join</code> operation.
This field is also used in the <code>CommonName</code> field of the kubelet's client certificate to
the API server.
Defaults to the hostname of the node if not provided.</p-->
   <p><code>name</code> 是 Node API 物件的 <code>.metadata.name</code> 欄位值；
該 API 物件會在此 <code>kubeadm init</code> 或 <code>kubeadm join</code> 操作期間建立。
在提交給 API 伺服器的 kubelet 客戶端證書中，此欄位也用作其 <code>CommonName</code>。
如果未指定則預設為節點的主機名。</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>criSocket</code> is used to retrieve container runtime info.
This information will be annotated to the Node API object, for later re-use</p-->
   <p><code>criSocket</code> 用來讀取容器執行時的資訊。
此資訊會被以註解的方式新增到 Node API 物件至上，用於後續用途。</p>
</td>
</tr>
<tr><td><code>taints</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#taint-v1-core"><code>[]core/v1.Taint</code></a>
</td>
<td>
<!--
   <p><code>tains</code> specifies the taints the Node API object should be registered with.
If this field is unset, i.e. nil, in the <code>kubeadm init</code> process it will be defaulted
with a control-plane taint for control-plane nodes.
If you don't want to taint your control-plane node, set this field to an empty list,
i.e. <code>taints: []</code> in the YAML file. This field is solely used for Node registration.</p>
-->
   <p><code>tains</code> 設定 Node API 物件被註冊時要附帶的汙點。
若未設定此欄位（即欄位值為 null），在 <code>kubeadm init</code> 期間，預設為控制平面節點新增控制平面汙點。
如果你不想汙染你的控制平面節點，可以將此欄位設定為空列表（即 YAML 檔案中的 <code>taints: []</code>），
這個欄位只用於節點註冊。</p>
</td>
</tr>
<tr><td><code>kubeletExtraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <!--p><code>kubeletExtraArgs</code> passes through extra arguments to the kubelet.
The arguments here are passed to the kubelet command line via the environment file
kubeadm writes at runtime for the kubelet to source.
This overrides the generic base-level configuration in the 'kubelet-config-1.X' ConfigMap.
Flags have higher priority when parsing. These values are local and specific to the node
kubeadm is executing on. A key in this map is the flag name as it appears on the
command line except without leading dash(es).</p-->
   <p><code>kubeletExtraArgs</code> 用來向 kubelet 傳遞額外引數。
這裡的引數會透過 kubeadm 在執行時寫入的、由 kubelet 來讀取的環境檔案來
傳遞給 kubelet 命令列。
這裡的設定會覆蓋掉 'kubelet-config-1.X' ConfigMap 中包含的一般性的配置。
命令列標誌在解析時優先順序更高。
這裡的設定值僅作用於 kubeadm 執行所在的節點。
對映中的每個鍵對應命令列中的一個標誌引數，只是去掉了前置的連字元。</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <!--p><code>ignorePreflightErrors</code> provides a list of pre-flight errors to be ignored when
the current node is registered.</p-->
   <p><code>ignorePreflightErrors</code> 提供一組在當前節點被註冊時可以
忽略掉的預檢錯誤。</p>
</td>
</tr>
<tr><td><code>imagePullPolicy</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#pullpolicy-v1-core"><code>core/v1.PullPolicy</code></a>
</td>
<td>
   <!--p><code>imagePullPolicy</code> specifies the policy for image pulling during kubeadm &quot;init&quot; and
&quot;join&quot; operations.
The value of this field must be one of &quot;Always&quot;, &quot;IfNotPresent&quot; or &quot;Never&quot;.
If this field is unset kubeadm will default it to &quot;IfNotPresent&quot;, or pull the required
images if not present on the host.</p-->
   <p><code>imagePullPolicy</code> 設定 &quot;kubeadm init&quot; 和 &quot;kubeadm join&quot;
操作期間的映象拉取策略。此欄位的取值可以是 &quot;Always&quot;、&quot;IfNotPresent&quot; 或
&quot;Never&quot; 之一。
若此欄位未設定，則  kubeadm 使用 &quot;IfNotPresent&quot; 作為其預設值，換言之，
當映象在主機上不存在時才執行拉取操作。</p>
</td>
</tr>
</tbody>
</table>

## `Patches`     {#kubeadm-k8s-io-v1beta3-Patches}
    
<!--
**Appears in:**
-->
**出現在：**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--p>Patches contains options related to applying patches to components deployed by kubeadm.</p-->
<p>Patches 包含要向 kubeadm 所部署的元件應用的補丁資訊。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>directory</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>directory</code> is a path to a directory that contains files named
&quot;target[suffix][+patchtype].extension&quot;.
For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of
&quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;. &quot;patchtype&quot; can
be one of &quot;strategic&quot; &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by
kubectl.
The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;.
&quot;suffix&quot; is an optional string that can be used to determine which patches are applied
first alpha-numerically.</p-->
  <p><code>directory</code> 是指向某目錄的路徑，該目錄中包含名為
&quot;target[suffix][+patchtype].extension&quot; 的檔案。
例如，&quot;kube-apiserver0+merge.yaml&quot; 或者 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、
&quot;kube-scheduler&quot;、&quot;etcd&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot;，
其取值對應 kubectl 所支援的補丁形式。
&quot;patchtype&quot; 的預設值是 &quot;strategic&quot;。
&quot;extension&quot; 必須是 &quot;json&quot; 或者 &quot;yaml&quot;。
&quot;suffix&quot; 是一個可選的字串，用來確定按字母表順序來應用時，哪個補丁最先被應用。</p>
</td>
</tr>
</tbody>
</table>
  
## `BootstrapToken`     {#BootstrapToken}
    
<!--
**Appears in:**
-->
**出現在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

<!--p>BootstrapToken describes one bootstrap token, stored as a Secret in the cluster</p-->
<p>BootstrapToken 描述的是一個啟動引導令牌，以 Secret 形式儲存在叢集中。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>token</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#BootstrapTokenString"><code>BootstrapTokenString</code></a>
</td>
<td>
   <!--p><code>token</code> is used for establishing bidirectional trust between nodes and control-planes.
Used for joining nodes in the cluster.</p-->
  <p><code>token</code> 用來在節點與控制面之間建立雙向的信任關係。
在向叢集中新增節點時使用。</p>
</td>
</tr>
<tr><td><code>description</code><br/>
<code>string</code>
</td>
<td>
   <!--p><code>description</code> sets a human-friendly message why this token exists and what it's used
for, so other administrators can know its purpose.</p-->
   <p><code>description</code> 設定一個對人友好的訊息，說明為什麼此令牌
會存在以及其目標用途，這樣其他管理員能夠知道其目的。</p>
</td>
</tr>
<tr><td><code>ttl</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--p><code>ttl</code> defines the time to live for this token. Defaults to <code>24h</code>.
<code>expires</code> and <code>ttl</code> are mutually exclusive.</p-->
   <p><code>ttl</code> 定義此令牌的宣告週期。預設為 <code>24h</code>。
<code>expires</code> 和 <code>ttl</code> 是互斥的。</p>
</td>
</tr>
<tr><td><code>expires</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!--p><code>expires</code> specifies the timestamp when this token expires. Defaults to being set
dynamically at runtime based on the <code>ttl</code>. <code>expires</code> and <code>ttl</code> are mutually exclusive.</p>-->
   <p><code>expires</code> 設定此令牌過期的時間戳。預設為在執行時基於
<code>ttl</code> 來決定。
<code>expires</code> 和 <code>ttl</code> 是互斥的。</p>
</td>
</tr>
<tr><td><code>usages</code><br/>
<code>[]string</code>
</td>
<td>
   <!--p><code>usages</code> describes the ways in which this token can be used. Can by default be used
for establishing bidirectional trust, but that can be changed here.</p-->
   <p><code>usages</code> 描述此令牌的可能使用方式。預設情況下，令牌可用於
建立雙向的信任關係；不過這裡可以改變預設用途。</p>
</td>
</tr>
<tr><td><code>groups</code><br/>
<code>[]string</code>
</td>
<td>
   <!--p><code>groups</code> specifies the extra groups that this token will authenticate as when/if
used for authentication</p-->
   <p><code>groups</code> 設定此令牌被用於身份認證時對應的附加使用者組。</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenString`     {#BootstrapTokenString}
    
<!--
**Appears in:**
-->
**出現在：**

- [BootstrapToken](#BootstrapToken)

<!--p>BootstrapTokenString is a token of the format <code>abcdef.abcdef0123456789</code> that is used
for both validation of the practically of the API server from a joining node's point
of view and as an authentication method for the node in the bootstrap phase of
&quot;kubeadm join&quot;. This token is and should be short-lived.</p-->
<p>BootstrapTokenString 形式為 <code>abcdef.abcdef0123456789</code> 的一個令牌，
用來從加入叢集的節點角度驗證 API 伺服器的身份，或者 &quot;kubeadm join&quot;
在節點啟動引導是作為一種身份認證方法。
此令牌的生命期是短暫的，並且應該如此。</p>
<table class="table">
<thead><tr><th width="30%"><!--Field-->欄位</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>id</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--span class="text-muted">No description provided.</span-->
   <span class="text-muted">無描述</span>
   
</td>
</tr>
<tr><td><code>secret</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--span class="text-muted">No description provided.</span-->
   <span class="text-muted">無描述</span>
</td>
</tr>
</tbody>
</table>

