---
title: kubeadm 配置（v1beta3）
content_type: tool-reference
package: kubeadm.k8s.io/v1beta3
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

<p>v1beta3 包定义 v1beta3 版本的 kubeadm 配置文件格式。
此版本改进了 v1beta2 的格式，修复了一些小问题并添加了一些新的字段。</p>

<p>从 v1beta2 版本以来的变更列表：</p>

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
<li>已弃用的字段 &quot;ClusterConfiguration.useHyperKubeImage&quot; 现在被移除。
kubeadm 不再支持 hyperkube 镜像。</li>
<li>&quot;ClusterConfiguration.dns.type&quot; 字段已经被移除，因为 CoreDNS 是
kubeadm 所支持的唯一 DNS 服务器类型。</li>
<li>保存 Secret 信息的字段现在包含了 &quot;datapolicy&quot; 标记（tag）。
这一标记会导致 API 结构通过 klog 打印输出时，会忽略这些字段的值。</li>
<li>添加了 &quot;InitConfiguration.skipPhases&quot;、&quot;JoinConfiguration.skipPhases&quot;，
以允许在执行 <code>kubeadm init/join</code> 命令时略过某些阶段。</li>
<!--
<li>Add &quot;InitConfiguration.NodeRegistration.ImagePullPolicy&quot; and &quot;JoinConfiguration.NodeRegistration.ImagePullPolicy&quot;
to allow specifying the images pull policy during kubeadm &quot;init&quot; and &quot;join&quot;.
The value must be one of &quot;Always&quot;, &quot;Never&quot; or &quot;IfNotPresent&quot;.
&quot;IfNotPresent&quot; is the default, which has been the existing behavior prior to this addition.</li>
<li>Add &quot;InitConfiguration.Patches.Directory&quot;, &quot;JoinConfiguration.Patches.Directory&quot; to allow
the user to configure a directory from which to take patches for components deployed by kubeadm.</li>
<li>Move the BootstrapToken* API and related utilities out of the &quot;kubeadm&quot; API group to a new group
&quot;bootstraptoken&quot;. The kubeadm API version v1beta3 no longer contains the BootstrapToken* structures.</li>
-->
<li>添加了 &quot;InitConfiguration.nodeRegistration.imagePullPolicy&quot; 和
&quot;JoinConfiguration.nodeRegistration.imagePullPolicy&quot;
以允许在 <code>kubeadm init</code> 和 <code>kubeadm join</code> 期间指定镜像拉取策略。
这两个字段的值必须是 &quot;Always&quot;、&quot;Never&quot; 或 &quot;IfNotPresent&quot 之一。
默认值是 &quot;IfNotPresent&quot;，也是添加此字段之前的默认行为。</li>
<li>添加了 &quot;InitConfiguration.patches.directory&quot; 和
&quot;JoinConfiguration.patches.directory&quot; 以允许用户配置一个目录，
kubeadm 将从该目录中提取组件的补丁包。</li>
<li>BootstrapToken* API 和相关的工具被从 &quot;kubeadm&quot; API 组中移出，
放到一个新的 &quot;bootstraptoken&quot; 组中。kubeadm API 版本 v1beta3 不再包含
BootstrapToken* 结构。</li>
</ul>
<!--
<p>Migration from old kubeadm config versions</p>
<ul>
<li>kubeadm v1.15.x and newer can be used to migrate from v1beta1 to v1beta2.</li>
<li>kubeadm v1.22.x and newer no longer support v1beta1 and older APIs, but can be used to migrate v1beta2 to v1beta3.</li>
</ul>
-->
<p>从老的 kubeadm 配置版本迁移：</p>
<ul>
<li>kubeadm v1.15.x 及更新的版本可以用来从 v1beta1 迁移到 v1beta2 版本；</li>
<li>kubeadm v1.22.x 及更新的版本不再支持 v1beta1 和更老的 API，但可以用来从 v1beta2 迁移到 v1beta3。</li>
</ul>

<!--
<h2>Basics</h2>
<p>The preferred way to configure kubeadm is to pass an YAML configuration file with the <code>--config</code> option. Some of the
configuration options defined in the kubeadm config file are also available as command line flags, but only
the most common/simple use case are supported with this approach.</p>
<p>A kubeadm config file could contain multiple configuration types separated using three dashes (<code>---</code>).</p>
<p>kubeadm supports the following configuration types:</p>
-->
<h2>基础知识</h2>

<p>配置 kubeadm 的推荐方式是使用 <code>--config</code> 选项向其传递一个 YAML 配置文件。
kubeadm 配置文件中定义的某些配置选项也可以作为命令行标志来使用，不过这种方法所支持的都是一些最常见的、最简单的使用场景。</p>

<p>一个 kubeadm 配置文件中可以包含多个配置类型，使用三根横线（<code>---</code>）作为分隔符。</p>

<p>kubeadm 支持以下配置类型：</p>

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
<p>要输出 &quot;init&quot; 和 &quot;join&quot; 动作的默认值，可以使用下面的命令：</p>

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
<p>配置文件中必须包含的配置类型列表取决于你在执行的动作（<code>init</code> 或 <code>join</code>），
也取决于你要使用的配置选项（默认值或者高级定制）。</p>

<p>如果某些配置类型没有提供，或者仅部分提供，kubeadm 将使用默认值；
kubeadm 所提供的默认值在必要时也会保证其在多个组件之间是一致的
（例如控制器管理器上的 <code>--cluster-cidr</code> 参数和 kube-proxy 上的
<code>clusterCIDR</code>）。</p>

<!--
<p>Users are always allowed to override default values, with the only exception of a small subset of setting with
relevance for security (e.g. enforce authorization-mode Node and RBAC on api server).</p>
<p>If the user provides a configuration types that is not expected for the action you are performing, kubeadm will
ignore those types and print a warning.</p>
-->
<p>用户总是可以重载默认配置值，唯一的例外是一小部分与安全性相关联的配置
（例如在 API 服务器上强制实施 Node 和 RBAC 鉴权模式）。</p>

<p>如果用户所提供的配置类型并非你所执行的操作需要的，kubeadm 会忽略这些配置类型并打印警告信息。</p>

<!--
<h2>Kubeadm init configuration types</h2>
<p>When executing kubeadm init with the <code>--config</code> option, the following configuration types could be used:
InitConfiguration, ClusterConfiguration, KubeProxyConfiguration, KubeletConfiguration, but only one
between InitConfiguration and ClusterConfiguration is mandatory.</p>
-->
<h2>kubeadm init 配置类型</h2>

<p>当带有 <code>--config</code> 选项来执行 kubeadm init 命令时，可以使用下面的配置类型：
<code>InitConfiguration</code>、<code>ClusterConfiguration</code>、<code>KubeProxyConfiguration</code>、<code>KubeletConfiguration</code>，
但 <code>InitConfiguration</code> 和 <code>ClusterConfiguration</code>
之间只有一个是必须提供的。</p>

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
<p>类型 InitConfiguration 用来配置运行时设置，就 <code>kubeadm init</code> 命令而言，
包括启动引导令牌以及所有与 kubeadm 所在节点相关的设置，包括：</p>

<ul>
<li>nodeRegistration：其中包含与向集群注册新节点相关的字段；
使用这个类型来定制节点名称、要使用的 CRI 套接字或者其他仅对当前节点起作用的设置
（例如节点 IP 地址）。</li>
<li>localAPIEndpoint：代表的是要部署到此节点上的 API 服务器实例的端点；
使用这个类型可以完成定制 API 服务器公告地址这类操作。</li>
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
<p>类型 <code>ClusterConfiguration</code> 用来定制集群范围的设置，具体包括以下设置：</p>

<ul>
<li><p><code>networking</code>：其中包含集群的网络拓扑配置。使用这一部分可以定制 Pod
的子网或者 Service 的子网。</p>
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
<p><code>etcd</code>：etcd 数据库的配置。例如使用这个部分可以定制本地 etcd 或者配置 API
服务器使用一个外部的 etcd 集群。</p>
</li>
<li>
<p><code>kube-apiserver</code>、<code>kube-scheduler</code>、<code>kube-controller-manager</code>
配置：这些部分可以通过添加定制的设置或者重载 kubeadm 的默认设置来定制控制面组件。</p>
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
https://pkg.go.dev/k8s.io/kube-proxy/config/v1alpha1#KubeProxyConfiguration
for kube-proxy official documentation.</p>
-->
<p>KubeProxyConfiguration 类型用来更改传递给在集群中部署的 kube-proxy 实例的配置。
如果此对象没有提供，或者仅部分提供，kubeadm 使用默认值。</p>

<p>关于 kube-proxy 的官方文档，可参阅
https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/
或者 https://pkg.go.dev/k8s.io/kube-proxy/config/v1alpha1#KubeProxyConfiguration。
</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubelet.config.k8s.io/v1beta1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeletConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">  </span>...<span style="color:#bbb">
</span></pre>

<!--
<p>The KubeletConfiguration type should be used to change the configurations that will be passed to all kubelet instances
deployed in the cluster. If this object is not provided or provided only partially, kubeadm applies defaults.</p>
<p>See https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/ or
https://pkg.go.dev/k8s.io/kubelet/config/v1beta1#KubeletConfiguration
for kubelet official documentation.</p>
<p>Here is a fully populated example of a single YAML file containing multiple
configuration types to be used during a <code>kubeadm init</code> run.</p>
-->
<p>KubeletConfiguration 类型用来更改传递给在集群中部署的 kubelet 实例的配置。
如果此对象没有提供，或者仅部分提供，kubeadm 使用默认值。</p>

<p>关于 kubelet 的官方文档，可参阅
https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kubelet/
或者
https://pkg.go.dev/k8s.io/kubelet/config/v1beta1#KubeletConfiguration。</p>

<p>下面是一个为执行 <code>kubeadm init</code> 而提供的、包含多个配置类型的单一 YAML 文件，
其中填充了很多部分。</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>InitConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">bootstrapTokens</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#000;font-weight:bold">token</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;9a08jv.c0izixklcxtmnze7&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">description</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;kubeadm bootstrap token&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">ttl</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;24h&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#000;font-weight:bold">token</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;783bde.3f89s0fje9f38fhf&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">description</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;another bootstrap token&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">usages</span>:<span style="color:#bbb">
</span><span style="color:#bbb">      </span>- authentication<span style="color:#bbb">
</span><span style="color:#bbb">      </span>- signing<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">groups</span>:<span style="color:#bbb">
</span><span style="color:#bbb">      </span>- system:bootstrappers:kubeadm:default-node-token<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">nodeRegistration</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;ec2-10-100-0-1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">criSocket</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/var/run/dockershim.sock&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">taints</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>- <span style="color:#000;font-weight:bold">key</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;kubeadmNode&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">value</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;someValue&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">effect</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;NoSchedule&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">kubeletExtraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">v</span>:<span style="color:#bbb"> </span><span style="color:#099">4</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">ignorePreflightErrors</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>- IsPrivilegedUser<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">imagePullPolicy</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;IfNotPresent&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">localAPIEndpoint</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">advertiseAddress</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">bindPort</span>:<span style="color:#bbb"> </span><span style="color:#099">6443</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">certificateKey</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">skipPhases</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- addon/kube-proxy<span style="color:#bbb">
</span><span style="color:#bbb"></span>---<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta3<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>ClusterConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">etcd</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#998;font-style:italic"># one of local or external</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">local</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">imageRepository</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;registry.k8s.io&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">imageTag</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;3.2.24&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">dataDir</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/var/lib/etcd&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">listen-client-urls</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;http://10.100.0.1:2379&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">serverCertSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">      </span>- <span style="color:#bbb"> </span><span style="color:#d14">&#34;ec2-10-100-0-1.compute-1.amazonaws.com&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">peerCertSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">      </span>- <span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
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
</span><span style="color:#bbb">    </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">certSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>- <span style="color:#d14">&#34;10.100.1.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span>- <span style="color:#d14">&#34;ec2-10-100-0-1.compute-1.amazonaws.com&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">timeoutForControlPlane</span>:<span style="color:#bbb"> </span>4m0s<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">controllerManager</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">&#34;node-cidr-mask-size&#34;: </span><span style="color:#d14">&#34;20&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">scheduler</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">bind-address</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">    </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">      </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">certificatesDir</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/kubernetes/pki&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">imageRepository</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;registry.k8s.io&#34;</span><span style="color:#bbb">
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
<h2>kubeadm join 配置类型</h2>

<p>当使用 <code>--config</code> 选项执行 <code>kubeadm join</code> 命令时，
需要提供 JoinConfiguration 类型。</p>

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
<p>JoinConfiguration 类型用来配置运行时设置，就 <code>kubeadm join</code>
而言包括用来访问集群信息的发现方法，以及所有特定于 kubeadm 执行所在节点的设置，包括：</p>

<ul>
<li><code>nodeRegistration</code>：其中包含向集群注册新节点相关的配置字段；
使用这个类型可以定制节点名称、用使用的 CRI 套接字和所有其他仅适用于当前节点的设置
（例如节点 IP 地址）。</li>
<li><code>apiEndpoint</code>：用来代表最终要部署到此节点上的 API
服务器实例的端点。</li>
</ul>

<!--
## Resource Types
-->
## 资源类型  {#resource-types}

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)
- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

## `BootstrapToken`     {#BootstrapToken}
    
<!--
**Appears in:**
-->
**出现在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

<!--
BootstrapToken describes one bootstrap token, stored as a Secret in the cluster
-->
<p><code>BootstrapToken</code> 描述的是一个启动引导令牌，以 Secret 形式存储在集群中。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>token</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#BootstrapTokenString"><code>BootstrapTokenString</code></a>
</td>
<td>
   <!--
   <code>token</code> is used for establishing bidirectional trust between nodes and control-planes.
Used for joining nodes in the cluster.
   -->
   <p><code>token</code> 用来在节点与控制面之间建立双向的信任关系。
在向集群中添加节点时使用。</p>
</td>
</tr>
<tr><td><code>description</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>description</code> sets a human-friendly message why this token exists and what it's used
for, so other administrators can know its purpose.
   -->
   <p><code>description</code> 设置一个对用户友好的消息，
   说明为什么此令牌会存在以及其目标用途，这样其他管理员能够知道其目的。</p>
</td>
</tr>
<tr><td><code>ttl</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <!--
   <code>ttl</code> defines the time to live for this token. Defaults to <code>24h</code>.
<code>expires</code> and <code>ttl</code> are mutually exclusive.
   -->
   <p><code>ttl</code> 定义此令牌的声明周期。默认为 <code>24h</code>。
<code>expires</code> 和 <code>ttl</code> 是互斥的。</p>
</td>
</tr>
<tr><td><code>expires</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!--
   <code>expires</code> specifies the timestamp when this token expires. Defaults to being set
dynamically at runtime based on the <code>ttl</code>. <code>expires</code> and <code>ttl</code> are mutually exclusive.
   -->
   <p><code>expires</code> 设置此令牌过期的时间戳。默认为在运行时基于
<code>ttl</code> 来决定。
<code>expires</code> 和 <code>ttl</code> 是互斥的。</p>
</td>
</tr>
<tr><td><code>usages</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <code>usages</code> describes the ways in which this token can be used. Can by default be used
for establishing bidirectional trust, but that can be changed here.
   -->
   <p><code>usages</code> 描述此令牌的可能使用方式。默认情况下，
   令牌可用于建立双向的信任关系；不过这里可以改变默认用途。</p>
</td>
</tr>
<tr><td><code>groups</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <code>groups</code> specifies the extra groups that this token will authenticate as when/if
used for authentication
   -->
   <p><code>groups</code> 设定此令牌被用于身份认证时对应的附加用户组。</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenString`     {#BootstrapTokenString}
    
<!--
**Appears in:**
-->
**出现在：**

- [BootstrapToken](#BootstrapToken)

<!--
BootstrapTokenString is a token of the format <code>abcdef.abcdef0123456789</code> that is used
for both validation of the practically of the API server from a joining node's point
of view and as an authentication method for the node in the bootstrap phase of
&quot;kubeadm join&quot;. This token is and should be short-lived.
-->
<p>BootstrapTokenString 形式为 <code>abcdef.abcdef0123456789</code> 的一个令牌，
用来从加入集群的节点角度验证 API 服务器的身份，或者 &quot;kubeadm join&quot;
在节点启动引导时作为一种身份认证方法。
此令牌的生命期是短暂的，并且应该如此。</p>
<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>-</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--span class="text-muted">No description provided.</span-->
   <span class="text-muted">令牌的 ID。</span>
</td>
</tr>
<tr><td><code>-</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--span class="text-muted">No description provided.</span-->
   <span class="text-muted">令牌的私密数据。</span>
</td>
</tr>
</tbody>
</table>

## `ClusterConfiguration`     {#kubeadm-k8s-io-v1beta3-ClusterConfiguration}

<!--
<p>ClusterConfiguration contains cluster-wide configuration for a kubeadm cluster.</p>
-->
<p>ClusterConfiguration 包含一个 kubeadm 集群的集群范围配置信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
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
   <p><code>etcd</code> 中包含 etcd 服务的配置。</p>
</td>
</tr>
<tr><td><code>networking</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Networking"><code>Networking</code></a>
</td>
<td>
   <!--
   <p><code>networking</code> holds configuration for the networking topology of the cluster.</p>
   -->
   <p><code>networking</code> 字段包含集群的网络拓扑配置。</p>
</td>
</tr>
<tr><td><code>kubernetesVersion</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>kubernetesVersion</code> is the target version of the control plane.</p>
   -->
   <p><code>kubernetesVersion</code> 设置控制面的目标版本。</p>
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
   <p><code>controlPlaneEndpoint</code> 为控制面设置一个稳定的 IP 地址或 DNS 名称。
取值可以是一个合法的 IP 地址或者 RFC-1123 形式的 DNS 子域名，二者均可以带一个可选的 TCP 端口号。
如果 <code>controlPlaneEndpoint</code> 未设置，则使用 <code>advertiseAddress<code>
+ <code>bindPort</code>。
如果设置了 <code>controlPlaneEndpoint</code>，但未指定 TCP 端口号，则使用
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
  <li>在一个包含不止一个控制面实例的集群中，该字段应该设置为放置在控制面实例前面的外部负载均衡器的地址。</li>
  <li>在带有强制性节点回收的环境中，<code>controlPlaneEndpoint</code> 可以用来为控制面设置一个稳定的 DNS。</li>
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
   <p><code>apiServer</code> 包含 API 服务器的一些额外配置。</p>
</td>
</tr>
<tr><td><code>controllerManager</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <!--
   <p><code>controllerManager</code> contains extra settings for the controller manager.</p>
   -->
   <p><code>controllerManager</code> 中包含控制器管理器的额外配置。</p>
</td>
</tr>
<tr><td><code>scheduler</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <!--
   <p><code>scheduler</code> contains extra settings for the scheduler.</p>
   -->
   <p><code>scheduler</code> 包含调度器的额外配置。</p>
</td>
</tr>
<tr><td><code>dns</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-DNS"><code>DNS</code></a>
</td>
<td>
   <!--
   <p><code>dns</code> defines the options for the DNS add-on installed in the cluster.</p>
   -->
   <p><code>dns</code> 定义在集群中安装的 DNS 插件的选项。</p>
</td>
</tr>
<tr><td><code>certificatesDir</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>certificatesDir</code> specifies where to store or look for all required certificates.</p>
   -->
   <p><code>certificatesDir</code> 设置在何处存放或者查找所需证书。</p>
</td>
</tr>
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>imageRepository</code> sets the container registry to pull images from.
If empty, <code>registry.k8s.io</code> will be used by default.
In case of kubernetes version is a CI build (kubernetes version starts with <code>ci/</code>)
<code>gcr.io/k8s-staging-ci-images</code> will be used as a default for control plane components
and for kube-proxy, while <code>registry.k8s.io</code> will be used for all the other images.</p>
   -->
   <p><code>imageRepository</code> 设置用来拉取镜像的容器仓库。
如果此字段为空，默认使用 <code>registry.k8s.io</code>。
当 Kubernetes 用来执行 CI 构建时（Kubernetes 版本以 <code>ci/</code> 开头），
将默认使用 <code>gcr.io/k8s-staging-ci-images</code> 来拉取控制面组件镜像，
而使用 <code>registry.k8s.io</code> 来拉取所有其他镜像。</p>
</td>
</tr>
<tr><td><code>featureGates</code><br/>
<code>map[string]bool</code>
</td>
<td>
   <!--
   <p><code>featureGates</code> contains the feature gates enabled by the user.</p>
   -->
   <p><code>featureGates</code> 包含用户所启用的特性门控。</p>
</td>
</tr>
<tr><td><code>clusterName</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>The cluster name.</p>
   -->
   <p>集群名称。</p>
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
<p>InitConfiguration 包含一组特定于 &quot;kubeadm init&quot; 的运行时元素。
这里的字段仅用于第一次运行 <code>kubeadm init</code> 命令。
之后，此结构中的字段信息不会再被上传到 <code>kubeadm upgrade</code> 所要使用的
<code>kubeadm-config</code> ConfigMap 中。
这些字段必须设置 &quot;omitempty&quot;</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
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
   <p><code>bootstrapTokens</code> 在 <code>kubeadm init</code> 执行时会被用到，
其中描述了一组要创建的启动引导令牌（Bootstrap Tokens）。这里的信息不会被上传到 kubeadm
在集群中保存的 ConfigMap 中，部分原因是由于信息本身比较敏感。</p>
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
   <p><code>nodeRegistration</code> 中包含与向集群中注册新的控制面节点相关的字段。</p>
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
   <p><code>localAPIEndpoint</code> 所代表的是在此控制面节点上要部署的 API 服务器的端点。
   在高可用（HA）配置中，此字段与 <code>ClusterConfiguration.controlPlaneEndpoint</code>
的取值不同：后者代表的是整个集群的全局端点，该端点上的请求会被负载均衡到每个 API 服务器。
此配置对象允许你定制本地 API 服务器所公布的、可访问的 IP/DNS 名称和端口。
默认情况下，kubeadm 会尝试自动检测默认接口上的 IP 并使用该地址。
不过，如果这种检测失败，你可以在此字段中直接设置所期望的值。</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>certificateKey</code> sets the key with which certificates and keys are encrypted prior to being
uploaded in a Secret in the cluster during the <code>uploadcerts init</code> phase.
The certificate key is a hex encoded string that is an AES key of size 32 bytes.</p>
   -->
   <p><code>certificateKey</code> 用来设置一个密钥，该密钥将对 <code>uploadcerts init</code>
阶段上传到集群中某 Secret 内的密钥和证书加密。
证书密钥是十六进制编码的字符串，是长度为 32 字节的 AES 密钥。</p>
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
   <p><code>skipPhases</code> 是命令执行过程中要略过的阶段（Phases）。
通过执行命令 <code>kubeadm init --help</code> 可以获得阶段的列表。
参数标志 &quot;--skip-phases&quot; 优先于此字段的设置。</p>
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
   <p><code>patches</code> 包含与 <code>kubeadm init</code> 阶段 kubeadm
   所部署的组件上要应用的补丁相关的信息。</p>
</td>
</tr>
</tbody>
</table>

## `JoinConfiguration`     {#kubeadm-k8s-io-v1beta3-JoinConfiguration}

<p>
<!--
JoinConfiguration contains elements describing a particular node.
-->
JoinConfiguration 包含描述特定节点的元素。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
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
   <code>nodeRegistration</code> 包含与向集群注册控制面节点相关的字段。
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
   <code>caCertPath</code> 是指向 SSL 证书机构的路径，该证书包用来加密节点与控制面之间的通信。
   默认值为 &quot;/etc/kubernetes/pki/ca.crt&quot;。
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
   <code>discovery</code> 设置 TLS 引导过程中 kubelet 要使用的选项。
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
   <code>controlPlane</code> 定义要在正被加入到集群中的节点上部署的额外控制面实例。
   此字段为 null 时，不会在上面部署额外的控制面实例。
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
   此字段包含在命令执行过程中要略过的阶段。通过 <code>kubeadm join --help</code>
命令可以查看阶段的列表。参数 <code>--skip-phases</code> 优先于此字段。
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
   此字段包含 <code>kubeadm join</code> 阶段向 kubeadm 所部署的组件打补丁的选项。
</p>
</td>
</tr>
</tbody>
</table>

## `APIEndpoint`     {#kubeadm-k8s-io-v1beta3-APIEndpoint}

<!--
**Appears in:**
-->
**出现在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)
- [JoinControlPlane](#kubeadm-k8s-io-v1beta3-JoinControlPlane)

<p>
<!--
APIEndpoint struct contains elements of API server instance deployed on a node.
-->
APIEndpoint 结构包含某节点上部署的 API 服务器的配置元素。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>advertiseAddress</code><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   <code>advertiseAddress</code> sets the IP address for the API server to advertise.
   -->
   <code>advertiseAddress</code> 设置 API 服务器要公布的 IP 地址。
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
   <code>bindPort</code> 设置 API 服务器要绑定到的安全端口。默认值为 6443。
</p>
</td>
</tr>
</tbody>
</table>

## `APIServer`     {#kubeadm-k8s-io-v1beta3-APIServer}

<!--
**Appears in:**
-->
**出现在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<p>
<!--
APIServer holds settings necessary for API server deployments in the cluster
-->
APIServer 包含集群中 API 服务器部署所必需的设置。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>ControlPlaneComponent</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
<!--
(Members of <code>ControlPlaneComponent</code> are embedded into this type.)
-->
（<code>ControlPlaneComponent</code> 结构的字段被嵌入到此类型中。）
   <!--span class="text-muted">No description provided.</span-->
   <span class="text-muted">无描述。</span>
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
   <code>certSANs</code> 设置 API 服务器签署证书所用的额外主体替代名（Subject Alternative Name，SAN）。
</p>
</td>
</tr>
<tr><td><code>timeoutForControlPlane</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
   <!--
   <code>timeoutForControlPlane</code> controls the timeout that we wait for API server to appear.
   -->
   <code>timeoutForControlPlane</code> 用来控制我们等待 API 服务器开始运行的超时时间。
</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenDiscovery`     {#kubeadm-k8s-io-v1beta3-BootstrapTokenDiscovery}

<!--
**Appears in:**
-->
**出现在：**

- [Discovery](#kubeadm-k8s-io-v1beta3-Discovery)

<p>
<!--
BootstrapTokenDiscovery is used to set the options for bootstrap token based discovery.
-->
BootstrapTokenDiscovery 用来设置基于引导令牌的服务发现选项。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>token</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   <code>token</code> is a token used to validate cluster information fetched from the control-plane.
   -->
   <code>token</code> 用来验证从控制面获得的集群信息。
</p>
</td>
</tr>
<tr><td><code>apiServerEndpoint</code><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   <code>apiServerEndpoint</code> is an IP or domain name to the API server from which
information will be fetched.
   -->
   <code>apiServerEndpoint</code> 为 API 服务器的 IP 地址或者域名，从该端点可以获得集群信息。
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
Each hash is specified as <code>&lt;type&gt;:&lt;value&gt;</code>, where the only currently supported type is
&quot;sha256&quot;. This is a hex-encoded SHA-256 hash of the Subject Public Key Info (SPKI)
object in DER-encoded ASN.1. These hashes can be calculated using, for example, OpenSSL.
   -->
   <code>caCertHashes</code> 设置一组在基于令牌来发现服务时要验证的公钥指纹。
发现过程中获得的根 CA 必须与这里的数值之一匹配。
设置为空集合意味着禁用根 CA 指纹，因而可能是不安全的。
每个哈希值的形式为 <code>&lt;type&gt;:&lt;value&gt;</code>，当前唯一支持的 type 为
&quot;sha256&quot;。
哈希值为主体公钥信息（Subject Public Key Info，SPKI）对象的 SHA-256
哈希值（十六进制编码），形式为 DER 编码的 ASN.1。
例如，这些哈希值可以使用 OpenSSL 来计算。
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
   <code>unsafeSkipCAVerification</code> 允许在使用基于令牌的服务发现时不使用
   <code>caCertHashes</code> 来执行 CA 验证。这会弱化 kubeadm 的安全性，
因为其他节点可以伪装成控制面。
</p>
</td>
</tr>
</tbody>
</table>

## `ControlPlaneComponent`     {#kubeadm-k8s-io-v1beta3-ControlPlaneComponent}

<!--
**Appears in:**
-->
**出现在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)
- [APIServer](#kubeadm-k8s-io-v1beta3-APIServer)

<!--
ControlPlaneComponent holds settings common to control plane component of the cluster
-->
<p>ControlPlaneComponent 中包含对集群中所有控制面组件都适用的设置。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
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
   <code>extraArgs</code> 是要传递给控制面组件的一组额外的参数标志。
此映射中的每个键对应命令行上使用的标志名称，只是没有其引导连字符。
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
   <code>extraVolumes</code> 是一组额外的主机卷，需要挂载到控制面组件中。
</p>
</td>
</tr>
</tbody>
</table>

## `DNS`     {#kubeadm-k8s-io-v1beta3-DNS}

<!--
**Appears in:**
-->
**出现在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<!--
DNS defines the DNS addon that should be used in the cluster
-->
<p>DNS 结构定义要在集群中使用的 DNS 插件。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>ImageMeta</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeadm-k8s-io-v1beta3-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>
<!--
(Members of <code>ImageMeta</code> are embedded into this type.)
-->
（<code>ImageMeta</code> 的成员被内嵌到此类型中）。
<p>
   <!--
   <code>imageMeta</code> allows to customize the image used for the DNS component.
   -->
   <code>imageMeta</code> 允许对 DNS 组件所使用的镜像作定制。
</p>
</td>
</tr>
</tbody>
</table>

## `Discovery`     {#kubeadm-k8s-io-v1beta3-Discovery}

<!--
**Appears in:**
-->
**出现在：**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--
Discovery specifies the options for the kubelet to use during the TLS Bootstrap process.
-->
<p>Discovery 设置 TLS 启动引导过程中 kubelet 要使用的配置选项。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
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
   <code>bootstrapToken</code> 设置基于启动引导令牌的服务发现选项。
<code>bootstrapToken</code> 与 <code>file</code> 是互斥的。
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
   <code> 用来设置一个文件或者 URL 路径，指向一个 kubeconfig 文件；该配置文件中包含集群信息。
<code>bootstrapToken</code> 与 <code>file</code> 是互斥的。
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
can be overridden. If <code>file</code> is set, this field <strong>must be set</strong> in case the KubeConfigFile
does not contain any other authentication information
   -->
   <code>tlsBootstrapToken</code> 是 TLS 启动引导过程中使用的令牌。
如果设置了 <code>bootstrapToken</code>，则此字段默认值为 <code>.bootstrapToken.token</code>，不过可以被重载。
如果设置了 <code>file</code>，此字段<strong>必须被设置</strong>，以防 kubeconfig 文件中不包含其他身份认证信息。
</p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
   <!--
   <code>timeout</code> modifies the discovery timeout.
   -->
   <code>timeout</code> 用来修改发现过程的超时时长。
</p>
</td>
</tr>
</tbody>
</table>

## `Etcd`     {#kubeadm-k8s-io-v1beta3-Etcd}

<!--
**Appears in:**
-->
**出现在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<!--
Etcd contains elements describing Etcd configuration.
-->
<p>Etcd 包含用来描述 etcd 配置的元素。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
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
   <code>local</code> 提供配置本地 etcd 实例的选项。<code>local</code> 和
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
   <code>external</code> 描述如何连接到外部的 etcd 集群。
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
**出现在：**

- [Etcd](#kubeadm-k8s-io-v1beta3-Etcd)

<!--
ExternalEtcd describes an external etcd cluster.
Kubeadm has no knowledge of where certificate files live and they must be supplied.
-->
<p>ExternalEtcd 描述外部 etcd 集群。
kubeadm 不清楚证书文件的存放位置，因此必须单独提供证书信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>endpoints</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p><code>endpoints</code> contains the list of etcd members.</p>
   -->
   <p><code>endpoints</code> 包含一组 etcd 成员的列表。</p>
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
   <p><code>caFile</code> 是一个 SSL 证书机构（CA）文件，用来加密 etcd 通信。
如果使用 TLS 连接，此字段为必需字段。</p>
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
   <p><code>certFile</code> 是一个 SSL 证书文件，用来加密 etcd 通信。
如果使用 TLS 连接，此字段为必需字段。</p>
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
   <p><code>keyFile</code> 是一个用来加密 etcd 通信的 SSL 密钥文件。
此字段在使用 TLS 连接时为必填字段。</p>
</td>
</tr>
</tbody>
</table>

## `FileDiscovery`     {#kubeadm-k8s-io-v1beta3-FileDiscovery}
    
<!--
**Appears in:**
-->
**出现在：**

- [Discovery](#kubeadm-k8s-io-v1beta3-Discovery)

<!--
<p>FileDiscovery is used to specify a file or URL to a kubeconfig file from which to load
cluster information.</p>
-->
<p>FileDiscovery 用来指定一个文件或者 URL 路径，指向一个 kubeconfig 文件；
该配置文件可用来加载集群信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>kubeConfigPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p><code>kubeConfigPath</code> is used to specify the actual file path or URL to the kubeconfig
file from which to load cluster information.</p>
   -->
   <p><code>kubeConfigPath</code> 用来指定一个文件或者 URL 路径，指向一个 kubeconfig 文件；
该配置文件可用来加载集群信息。</p>
</td>
</tr>
</tbody>
</table>

## `HostPathMount`     {#kubeadm-k8s-io-v1beta3-HostPathMount}
    
<!--
**Appears in:**
-->
**出现在：**

- [ControlPlaneComponent](#kubeadm-k8s-io-v1beta3-ControlPlaneComponent)

<!--
HostPathMount contains elements describing volumes that are mounted from the host.
-->
<p>HostPathMount 包含从主机节点挂载的卷的信息。</p-->

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>name</code> is the name of the volume inside the Pod template.
   -->
   <p><code>name</code> 为卷在 Pod 模板中的名称。</p>
</td>
</tr>
<tr><td><code>hostPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>hostPath</code> is the path in the host that will be mounted inside the Pod.
   -->
   <p><code>hostPath</code> 是要在 Pod 中挂载的卷在主机系统上的路径。</p>
</td>
</tr>
<tr><td><code>mountPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>mountPath</code> is the path inside the Pod where <code>hostPath</code> will be mounted.
   -->
   <p><code>mountPath</code> 是 <code>hostPath</code> 在 Pod 内挂载的路径。</p>
</td>
</tr>
<tr><td><code>readOnly</code><br/>
<code>bool</code>
</td>
<td>
   <!--
   <code>readOnly</code> controls write access to the volume.
   -->
   <p><code>readOnly</code> 控制卷的读写访问模式。</p>
</td>
</tr>
<tr><td><code>pathType</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#hostpathtype-v1-core"><code>core/v1.HostPathType</code></a>
</td>
<td>
   <!--
   <code>pathType</code> is the type of the <code>hostPath</code>.
   -->
   <p><code>pathType</code> 是 <code>hostPath</code> 的类型。</p>
</td>
</tr>
</tbody>
</table>

## `ImageMeta`     {#kubeadm-k8s-io-v1beta3-ImageMeta}
    
<!--
**Appears in:**
-->
**出现在：**

- [DNS](#kubeadm-k8s-io-v1beta3-DNS)
- [LocalEtcd](#kubeadm-k8s-io-v1beta3-LocalEtcd)

<!--
ImageMeta allows to customize the image used for components that are not
originated from the Kubernetes/Kubernetes release process
-->
<p>ImageMeta 用来配置来源不是 Kubernetes/kubernetes 发布过程的组件所使用的镜像。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>imageRepository</code> sets the container registry to pull images from.
If not set, the <code>imageRepository</code> defined in ClusterConfiguration will be used instead.
   -->
   <p><code>imageRepository</code> 设置镜像拉取所用的容器仓库。
若未设置，则使用 ClusterConfiguration 中的 <code>imageRepository</code>。</p>
</td>
</tr>
<tr><td><code>imageTag</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>imageTag</code> allows to specify a tag for the image.
In case this value is set, kubeadm does not change automatically the version of
the above components during upgrades.
   -->
   <p><code>imageTag</code> 允许用户设置镜像的标签。
如果设置了此字段，则 kubeadm 不再在集群升级时自动更改组件的版本。</p>
</td>
</tr>
</tbody>
</table>

## `JoinControlPlane`     {#kubeadm-k8s-io-v1beta3-JoinControlPlane}

<!--
**Appears in:**
-->
**出现在：**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--
JoinControlPlane contains elements describing an additional control plane instance
to be deployed on the joining node.
-->
<p>JoinControlPlane 包含在正在加入集群的节点上要部署的额外的控制面组件的设置。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <!--
   <code>localAPIEndpoint</code> represents the endpoint of the API server instance to be
deployed on this node.
   -->
   <p><code>localAPIEndpoint</code> 代表的是将在此节点上部署的 API 服务器实例的端点。</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>certificateKey</code> is the key that is used for decryption of certificates after
they are downloaded from the secret upon joining a new control plane node.
The corresponding encryption key is in the InitConfiguration.
The certificate key is a hex encoded string that is an AES key of size 32 bytes.
   -->
   <p><code>certificateKey</code> 是在添加新的控制面节点时用来解密所下载的
Secret 中的证书的密钥。对应的加密密钥在 InitConfiguration 结构中。
证书密钥是十六进制编码的字符串，是长度为 32 字节的 AES 密钥。</p>
</td>
</tr>
</tbody>
</table>

## `LocalEtcd`     {#kubeadm-k8s-io-v1beta3-LocalEtcd}

<!--
**Appears in:**
-->
**出现在：**

- [Etcd](#kubeadm-k8s-io-v1beta3-Etcd)

<!--
LocalEtcd describes that kubeadm should run an etcd cluster locally.
-->
<p>LocalEtcd 描述的是 kubeadm 要使用的本地 etcd 集群。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>ImageMeta</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeadm-k8s-io-v1beta3-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>
<!--
(Members of <code>ImageMeta</code> are embedded into this type.)
-->
（<code>ImageMeta</code> 结构的字段被嵌入到此类型中。）
   <!--
   ImageMeta allows to customize the container used for etcd.
   -->
   <p>ImageMeta 允许用户为 etcd 定制要使用的容器。</p>
</td>
</tr>
<tr><td><code>dataDir</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>dataDir</code> is the directory etcd will place its data.
Defaults to &quot;/var/lib/etcd&quot;.
   -->
   <p><code>dataDir</code> 是 etcd 用来存放数据的目录。
默认值为 &quot;/var/lib/etcd&quot;。</p>
</td>
</tr>
<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <!--
   <code>extraArgs</code> are extra arguments provided to the etcd binary when run
inside a static Pod. A key in this map is the flag name as it appears on the
command line except without leading dash(es).
   -->
   <p><code>extraArgs</code> 是为 etcd 可执行文件提供的额外参数，用于在静态
Pod 中运行 etcd。映射中的每一个键对应命令行上的一个标志参数，只是去掉了前置的连字符。</p>
</td>
</tr>
<tr><td><code>serverCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <code>serverCertSANs</code> sets extra Subject Alternative Names (SANs) for the etcd
server signing certificate.
   -->
   <p><code>serverCertSANs</code> 为 etcd
   服务器的签名证书设置额外的主体替代名（Subject Alternative Names，SAN）。</p>
</td>
</tr>
<tr><td><code>peerCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <code>peerCertSANs</code> sets extra Subject Alternative Names (SANs) for the etcd peer
signing certificate.
   -->
   <p><code>peerCertSANs</code> 为 etcd
   的对等端签名证书设置额外的主体替代名（Subject Alternative Names，SAN）。</p>
</td>
</tr>
</tbody>
</table>

## `Networking`     {#kubeadm-k8s-io-v1beta3-Networking}
    
<!--
**Appears in:**
-->
**出现在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<!--
Networking contains elements describing cluster's networking configuration.
-->
<p>Networking 中包含描述集群网络配置的元素。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>serviceSubnet</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>serviceSubnet</code> is the subnet used by Kubernetes Services. Defaults to &quot;10.96.0.0/12&quot;.
   -->
   <p><code>serviceSubnet</code> 是 Kubernetes 服务所使用的子网。
默认值为 &quot;10.96.0.0/12&quot;。</p>
</td>
</tr>
<tr><td><code>podSubnet</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>podSubnet</code> is the subnet used by Pods.
   -->
   <p><code>podSubnet</code> 为 Pod 所使用的子网。</p>
</td>
</tr>
<tr><td><code>dnsDomain</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>dnsDomain</code> is the DNS domain used by Kubernetes Services. Defaults to &quot;cluster.local&quot;.
   -->
   <p><code>dnsDomain</code> 是 Kubernetes 服务所使用的 DNS 域名。
默认值为 &quot;cluster.local&quot;。</p>
</td>
</tr>
</tbody>
</table>

## `NodeRegistrationOptions`     {#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions}
    
<!--
**Appears in:**
-->
**出现在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--
NodeRegistrationOptions holds fields that relate to registering a new control-plane or
node to the cluster, either via <code>kubeadm init</code> or <code>kubeadm join</code>.
-->
<p>NodeRegistrationOptions 包含向集群中注册新的控制面或节点所需要的信息；
节点注册可能通过 &quot;kubeadm init&quot; 或 &quot;kubeadm join&quot; 完成。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>name</code> is the <code>.metadata.name</code> field of the Node API object that will be created in this
<code>kubeadm init</code> or <code>kubeadm join</code> operation.
This field is also used in the <code>CommonName</code> field of the kubelet's client certificate to
the API server.
Defaults to the hostname of the node if not provided.
   -->
   <p><code>name</code> 是 Node API 对象的 <code>.metadata.name</code> 字段值；
该 API 对象会在此 <code>kubeadm init</code> 或 <code>kubeadm join</code> 操作期间创建。
在提交给 API 服务器的 kubelet 客户端证书中，此字段也用作其 <code>CommonName</code>。
如果未指定则默认为节点的主机名。</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>criSocket</code> is used to retrieve container runtime info.
This information will be annotated to the Node API object, for later re-use.
   -->
   <p><code>criSocket</code> 用来读取容器运行时的信息。
此信息会被以注解的方式添加到 Node API 对象至上，用于后续用途。</p>
</td>
</tr>
<tr><td><code>taints</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#taint-v1-core"><code>[]core/v1.Taint</code></a>
</td>
<td>
   <!--
   <code>taints</code> specifies the taints the Node API object should be registered with.
If this field is unset, i.e. nil, it will be defaulted with a control-plane taint for control-plane nodes.
If you don't want to taint your control-plane node, set this field to an empty list,
i.e. <code>taints: []</code> in the YAML file. This field is solely used for Node registration.
   -->
   <p><code>taints</code> 设定 Node API 对象被注册时要附带的污点。
若未设置此字段（即字段值为 null），默认为控制面节点添加控制面污点。
如果你不想为控制面节点添加污点，可以将此字段设置为空列表（即 YAML 文件中的 <code>taints: []</code>），
这个字段只用于节点注册。</p>
</td>
</tr>
<tr><td><code>kubeletExtraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <!--
   <code>kubeletExtraArgs</code> passes through extra arguments to the kubelet.
The arguments here are passed to the kubelet command line via the environment file
kubeadm writes at runtime for the kubelet to source.
This overrides the generic base-level configuration in the <code>kubelet-config</code> ConfigMap.
Flags have higher priority when parsing. These values are local and specific to the node
kubeadm is executing on. A key in this map is the flag name as it appears on the
command line except without leading dash(es).
   -->
   <p><code>kubeletExtraArgs</code> 用来向 kubelet 传递额外参数。
这里的参数会通过 kubeadm 在运行时写入的、由 kubelet 来读取的环境文件来传递给 kubelet 命令行。
这里的设置会覆盖掉 <code>kubelet-config</code> ConfigMap 中包含的一般性的配置。
命令行标志在解析时优先级更高。这里的设置值仅作用于 kubeadm 运行所在的节点。
映射中的每个键对应命令行中的一个标志参数，只是去掉了前置的连字符。</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <code>ignorePreflightErrors</code> provides a list of pre-flight errors to be ignored when
the current node is registered, e.g.
  <code>IsPrevilegedUser,Swap</code>.
  Value <code>all</code> ignores errors from all checks.
   -->
   <p>
      <code>ignorePreflightErrors</code> 提供一组在当前节点被注册时可以忽略掉的预检错误。
      例如：<code>IsPrevilegedUser,Swap</code>。
      取值 <code>all</code> 忽略所有检查的错误。
   </p>
</td>
</tr>
<tr><td><code>imagePullPolicy</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.30/#pullpolicy-v1-core"><code>core/v1.PullPolicy</code></a>
</td>
<td>
   <!--
   <code>imagePullPolicy</code> specifies the policy for image pulling during kubeadm &quot;init&quot; and
&quot;join&quot; operations.
The value of this field must be one of &quot;Always&quot;, &quot;IfNotPresent&quot; or &quot;Never&quot;.
If this field is not set, kubeadm will default it to &quot;IfNotPresent&quot;, or pull the required
images if not present on the host.
   -->
   <p><code>imagePullPolicy</code> 设定 &quot;kubeadm init&quot; 和 &quot;kubeadm join&quot;
操作期间的镜像拉取策略。此字段的取值可以是 &quot;Always&quot;、&quot;IfNotPresent&quot; 或
&quot;Never&quot; 之一。若此字段未设置，则 kubeadm 使用 &quot;IfNotPresent&quot; 作为其默认值，
换言之，当镜像在主机上不存在时才执行拉取操作。</p>
</td>
</tr>
</tbody>
</table>

## `Patches`     {#kubeadm-k8s-io-v1beta3-Patches}
    
<!--
**Appears in:**
-->
**出现在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--
Patches contains options related to applying patches to components deployed by kubeadm.
-->
<p>Patches 包含要向 kubeadm 所部署的组件应用的补丁信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>directory</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <code>directory</code> is a path to a directory that contains files named
&quot;target[suffix][+patchtype].extension&quot;.
For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of
&quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;. &quot;patchtype&quot; can
be one of &quot;strategic&quot; &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by
kubectl.
The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;.
&quot;suffix&quot; is an optional string that can be used to determine which patches are applied
first alpha-numerically.
   -->
  <p><code>directory</code> 是指向某目录的路径，该目录中包含名为
&quot;target[suffix][+patchtype].extension&quot; 的文件。
例如，&quot;kube-apiserver0+merge.yaml&quot; 或者 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、
&quot;kube-scheduler&quot;、&quot;etcd&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot;，
其取值对应 kubectl 所支持的补丁形式。
&quot;patchtype&quot; 的默认值是 &quot;strategic&quot;。
&quot;extension&quot; 必须是 &quot;json&quot; 或者 &quot;yaml&quot;。
&quot;suffix&quot; 是一个可选的字符串，用来确定按字母表顺序来应用时，哪个补丁最先被应用。</p>
</td>
</tr>
</tbody>
</table>
