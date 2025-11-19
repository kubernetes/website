---
title: kubeadm 設定 (v1beta4)
content_type: tool-reference
package: kubeadm.k8s.io/v1beta4
---
<!--
title: kubeadm Configuration (v1beta4)
content_type: tool-reference
package: kubeadm.k8s.io/v1beta4
auto_generated: true
-->

<!--
<h2>Overview</h2>
<p>Package v1beta4 defines the v1beta4 version of the kubeadm configuration file format.
This version improves on the v1beta3 format by fixing some minor issues and adding a few new fields.</p>
<p>A list of changes since v1beta3:</p>
-->
<h2>概述</h2>
<p>v1beta4 包定義 v1beta4 版本的 kubeadm 設定文件格式。
此版本改進了 v1beta3 的格式，修復了一些小問題並添加了一些新的字段。</p>
<p>從 v1beta3 版本以來的變更列表：</p>

<!--
<ul>
<li>TODO https://github.com/kubernetes/kubeadm/issues/2890</li>
<li>Support custom environment variables in control plane components under
<code>ClusterConfiguration</code>.
Use <code>APIServer.ExtraEnvs</code>, <code>ControllerManager.ExtraEnvs</code>, <code>Scheduler.ExtraEnvs</code>,
<code>Etcd.Local.ExtraEnvs</code>.</li>
<li>The <code>ResetConfiguration</code> API type is now supported in v1beta4.
Users are able to reset a node by passing a <code>--config</code> file to <code>kubeadm reset</code>.</li>
</ul>
-->
<ul>
<li>TODO https://github.com/kubernetes/kubeadm/issues/2890</li>
<li>使用 <code>APIServer.ExtraEnvs</code>、<code>ControllerManager.ExtraEnvs</code>、
<code>Scheduler.ExtraEnvs</code>、<code>Etcd.Local.ExtraEnvs</code>。
支持在 <code>ClusterConfiguration</code> 下控制平面組件中的定製環境變量。</li>
<li><code>ResetConfiguration</code> API 類型在 v1beta4 中已得到支持。
使用者可以爲 <code>kubeadm reset</code> 指定 <code>--config</code> 文件來重置節點。</li>
</ul>

<!--
<h1>Migration from old kubeadm config versions</h1>
<ul>
<li>kubeadm v1.15.x and newer can be used to migrate from v1beta1 to v1beta2.</li>
<li>kubeadm v1.22.x and newer no longer support v1beta1 and older APIs, but can be used to migrate v1beta2 to v1beta3.</li>
<li>kubeadm v1.27.x and newer no longer support v1beta2 and older APIs.</li>
<li>TODO: https://github.com/kubernetes/kubeadm/issues/2890
add version that can be used to convert to v1beta4</li>
</ul>
-->
<h1>kubeadm 設定版本遷移</h1>
<ul>
<li>kubeadm v1.15.x 及更高版本可用於從 v1beta1 遷移到 v1beta2。</li>
<li>kubeadm v1.22.x 及更高版本不再支持 v1beta1 和更早的 API，但可用於從 v1beta2 遷移到 v1beta3。</li>
<li>kubeadm v1.27.x 及更高版本不再支持 v1beta2 和更早的 API。</li>
<li>TODO: https://github.com/kubernetes/kubeadm/issues/2890
添加可用於轉換到 v1beta4 的版本</li>
</ul>

<!--
<h2>Basics</h2>
<p>The preferred way to configure kubeadm is to pass an YAML configuration file with
the `--config“ option. Some of the configuration options defined in the kubeadm
config file are also available as command line flags, but only the most
common/simple use case are supported with this approach.</p>
<p>A kubeadm config file could contain multiple configuration types separated using three dashes (<code>---</code>).</p>
<p>kubeadm supports the following configuration types:</p>
-->
<h2>基礎知識</h2>
<p>配置 kubeadm 的推薦方式是使用 <code>--config</code> 選項向其傳遞一個 YAML 配置文件。
kubeadm 配置文件中定義的某些配置選項也可以作爲命令行標誌來使用，
不過這種方法所支持的都是一些最常見的、最簡單的使用場景。</p>
<p>一個 kubeadm 配置文件中可以包含多個配置類型，使用三根橫線（<code>---</code>）作爲分隔符。</p>
<p>kubeadm 支持以下配置類型：</p>

<pre><code>apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration

apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration

apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration

apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
</code></pre>

<!--
<p>To print the defaults for &quot;init&quot; and &quot;join&quot; actions use the following commands:</p>
<pre style="background-color:#fff">kubeadm config print init-defaults
kubeadm config print join-defaults
</pre>
-->
<p>要輸出 &quot;init&quot; 和 &quot;join&quot; 動作的默認值，可以使用下面的命令：</p>
<pre style="background-color:#fff">kubeadm config print init-defaults
kubeadm config print join-defaults
</pre>

<!--
<p>The list of configuration types that must be included in a configuration file depends by the action you are
performing (<code>init or </code>join`) and by the configuration options you are going to use (defaults or advanced customization).</p>
<p>If some configuration types are not provided, or provided only partially, kubeadm will use default values; defaults
provided by kubeadm includes also enforcing consistency of values across components when required (e.g.
<code>--cluster-cidr</code> flag on controller manager and <code>clusterCIDR</code> on kube-proxy).</p>
-->
<p>設定文件中必須包含的設定類型列表取決於你所執行的動作（<code>init</code> 或 <code>join</code>），
也取決於你要使用的設定選項（默認值或者高級定製）。</p>
<p>如果某些設定類型沒有提供，或者僅部分提供，kubeadm 將使用默認值；
kubeadm 所提供的默認值在必要時也會保證其在多個組件之間是一致的
（例如控制器管理器上的 <code>--cluster-cidr</code> 參數和 kube-proxy 上的
<code>clusterCIDR</code>）。</p>

<!--
<p>Users are always allowed to override default values, with the only exception of a small subset of setting with
relevance for security (e.g. enforce authorization-mode Node and RBAC on api server).</p>
<p>If the user provides a configuration types that is not expected for the action you are performing, kubeadm will
ignore those types and print a warning.</p>
-->
<p>使用者總是可以覆蓋默認設定值，唯一的例外是一小部分與安全性相關聯的設定
（例如在 API 伺服器上強制實施 Node 和 RBAC 鑑權模式）。</p>
<p>如果使用者所提供的設定類型並非你所執行的操作需要的，kubeadm 會忽略這些設定類型並打印警告信息。</p>

<!--
<h2>Kubeadm init configuration types</h2>
<p>When executing kubeadm init with the `--config“ option, the following configuration types could be used:
InitConfiguration, ClusterConfiguration, KubeProxyConfiguration, KubeletConfiguration, but only one
between InitConfiguration and ClusterConfiguration is mandatory.</p>
-->
<h2>kubeadm init 配置類型</h2>

<p>當帶有 <code>--config</code> 選項來執行 kubeadm init 命令時，可以使用下面的配置類型：
<code>InitConfiguration</code>、<code>ClusterConfiguration</code>、<code>KubeProxyConfiguration</code>、
<code>KubeletConfiguration</code>，但 <code>InitConfiguration</code> 和 <code>ClusterConfiguration</code>
二者之間取其一即可。</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta4<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>InitConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">bootstrapTokens</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">nodeRegistration</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span></pre>

<!--
<p>The InitConfiguration type should be used to configure runtime settings, that in case of kubeadm init
are the configuration of the bootstrap token and all the setting which are specific to the node where kubeadm
is executed, including:</p>
-->
<p>InitConfiguration 類型用來配置運行時設置，就 kubeadm init 命令而言，
包括啓動引導令牌以及所有與 kubeadm 所在節點相關的設置，包括：</p>

<!--
<ul>
<li>
<p>NodeRegistration, that holds fields that relate to registering the new node to the cluster;
use it to customize the node name, the CRI socket to use or any other settings that should apply to this
node only (e.g. the node ip).</p>
</li>
<li>
<p>LocalAPIEndpoint, that represents the endpoint of the instance of the API server to be deployed on this node;
use it e.g. to customize the API server advertise address.</p>
</li>
</ul>
-->
<ul>
<li>nodeRegistration：其中包含與向集羣註冊新節點相關的字段；
使用這個類型來定製節點名稱、要使用的 CRI 套接字或者其他僅對當前節點起作用的設置（例如節點 IP 地址）。</li>
<li>localAPIEndpoint：代表的是要部署到此節點上的 API 伺服器實例的端點；
使用這個類型可以完成定製 API 伺服器公告地址這類操作。</li>
</ul>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta4<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>ClusterConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">networking</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">etcd</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiServer</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span>...<span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span>...<span style="color:#bbb">
</span></pre>

<!--
<p>The ClusterConfiguration type should be used to configure cluster-wide settings,
including settings for:</p>
-->
<p>類型 <code>ClusterConfiguration</code> 用來定製集羣範圍的設置，具體包括以下設置：</p>

<!--
<ul>
<li>
<p><code>networking</code> that holds configuration for the networking topology of the cluster; use it e.g. to customize
Pod subnet or services subnet.</p>
</li>
<li>
<p><code>etcd</code>: use it e.g. to customize the local etcd or to configure the API server
for using an external etcd cluster.</p>
</li>
<li>
<p>kube-apiserver, kube-scheduler, kube-controller-manager configurations; use it to customize control-plane
components by adding customized setting or overriding kubeadm default settings.</p>
</li>
</ul>
-->
<ul>
<li>
<p><code>networking</code>：其中包含集羣的網絡拓撲配置。使用這一部分可以定製 Pod
的子網或者 Service 的子網。</p>
</li>
<li>
<p><code>etcd</code>：etcd 數據庫的配置。例如使用這個部分可以定製本地 etcd 或者配置 API
伺服器使用一個外部的 etcd 集羣。</p>
</li>
<li>
<p><code>kube-apiserver</code>、<code>kube-scheduler</code>、<code>kube-controller-manager</code>
配置：這些部分可以通過添加定製的設置或者重載 kubeadm 的默認設置來定製控制平面組件。</p>
</li>
</ul>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeproxy.config.k8s.io/v1alpha1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeProxyConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span></pre>

<!--
<p>The KubeProxyConfiguration type should be used to change the configuration passed to kube-proxy instances deployed
in the cluster. If this object is not provided or provided only partially, kubeadm applies defaults.</p>
<p>See https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/ or
https://pkg.go.dev/k8s.io/kube-proxy/config/v1alpha1#KubeProxyConfiguration
for kube-proxy official documentation.</p>
-->
<p>KubeProxyConfiguration 類型用來更改傳遞給在集羣中部署的 kube-proxy 實例的配置。
如果此對象沒有提供，或者僅部分提供，kubeadm 使用默認值。</p>
<p>關於 kube-proxy 的官方文檔，可參閱
https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kube-proxy/
或者 https://pkg.go.dev/k8s.io/kube-proxy/config/v1alpha1#KubeProxyConfiguration。
</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubelet.config.k8s.io/v1beta1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeletConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
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
<p>KubeletConfiguration 類型用來更改傳遞給在集羣中部署的 kubelet 實例的配置。
如果此對象沒有提供，或者僅部分提供，kubeadm 使用默認值。</p>
<p>關於 kubelet 的官方文檔，可參閱
https://kubernetes.io/zh-cn/docs/reference/command-line-tools-reference/kubelet/
或者
https://pkg.go.dev/k8s.io/kubelet/config/v1beta1#KubeletConfiguration。</p>
<p>下面是一個爲執行 <code>kubeadm init</code> 而提供的、包含多個配置類型的單一 YAML 文件，
其中填充了很多部分。</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta4<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>InitConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">bootstrapTokens</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#000;font-weight:bold">token</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;9a08jv.c0izixklcxtmnze7&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">description</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;kubeadm bootstrap token&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">ttl</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;24h&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">  </span>- <span style="color:#000;font-weight:bold">token</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;783bde.3f89s0fje9f38fhf&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">description</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;another bootstrap token&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">usages</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- authentication<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- signing<span style="color:#bbb">
</span><span style="color:#bbb">    </span><span style="color:#000;font-weight:bold">groups</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- system:bootstrappers:kubeadm:default-node-token<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">nodeRegistration</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;ec2-10-100-0-1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">criSocket</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;unix:///var/run/containerd/containerd.sock&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">taints</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span>- <span style="color:#000;font-weight:bold">key</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;kubeadmNode&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">value</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;someValue&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">effect</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;NoSchedule&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">kubeletExtraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">v</span>:<span style="color:#bbb"> </span><span style="color:#099">4</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">ignorePreflightErrors</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span>- IsPrivilegedUser<span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">imagePullPolicy</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;IfNotPresent&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">localAPIEndpoint</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">advertiseAddress</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">bindPort</span>:<span style="color:#bbb"> </span><span style="color:#099">6443</span><span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">certificateKey</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;e6a2eb8581237ab72a4f494f30285ec12a9694d750b9785706a83bfcbbbd2204&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">skipPhases</span>:<span style="color:#bbb">
</span><span style="color:#bbb">  </span>- addon/kube-proxy<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span>---<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta4<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>ClusterConfiguration<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">etcd</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#998;font-style:italic"># one of local or external</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">local</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">imageRepository</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;registry.k8s.io&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">imageTag</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;3.2.24&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">dataDir</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/var/lib/etcd&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">listen-client-urls</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;http://10.100.0.1:2379&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">serverCertSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	    </span>- <span style="color:#bbb"> </span><span style="color:#d14">&#34;ec2-10-100-0-1.compute-1.amazonaws.com&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">peerCertSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	    </span>- <span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#998;font-style:italic"># external:</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#998;font-style:italic"># endpoints:</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#998;font-style:italic"># - &#34;10.100.0.1:2379&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#998;font-style:italic"># - &#34;10.100.0.2:2379&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#998;font-style:italic"># caFile: &#34;/etcd/kubernetes/pki/etcd/etcd-ca.crt&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#998;font-style:italic"># certFile: &#34;/etcd/kubernetes/pki/etcd/etcd.crt&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#998;font-style:italic"># keyFile: &#34;/etcd/kubernetes/pki/etcd/etcd.key&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">networking</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">serviceSubnet</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.96.0.0/16&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">podSubnet</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.244.0.0/24&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">dnsDomain</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;cluster.local&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kubernetesVersion</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;v1.21.0&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">controlPlaneEndpoint</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.100.0.1:6443&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">apiServer</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">authorization-mode</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;Node,RBAC&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">certSANs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span>- <span style="color:#d14">&#34;10.100.1.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	  </span>- <span style="color:#d14">&#34;ec2-10-100-0-1.compute-1.amazonaws.com&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">timeoutForControlPlane</span>:<span style="color:#bbb"> </span>4m0s<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">controllerManager</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">&#34;node-cidr-mask-size&#34;: </span><span style="color:#d14">&#34;20&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">scheduler</span>:<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">extraArgs</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span><span style="color:#000;font-weight:bold">address</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;10.100.0.1&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span><span style="color:#000;font-weight:bold">extraVolumes</span>:<span style="color:#bbb">
</span><span style="color:#bbb">	  </span>- <span style="color:#000;font-weight:bold">name</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;some-volume&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">hostPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">mountPath</span>:<span style="color:#bbb"> </span><span style="color:#d14">&#34;/etc/some-pod-path&#34;</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">readOnly</span>:<span style="color:#bbb"> </span><span style="color:#000;font-weight:bold">false</span><span style="color:#bbb">
</span><span style="color:#bbb">	    </span><span style="color:#000;font-weight:bold">pathType</span>:<span style="color:#bbb"> </span>File<span style="color:#bbb">
</span><span style="color:#bbb">
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
<p>When executing kubeadm join with the --config option, the JoinConfiguration type should be provided.</p>
-->
<h2> kubeadm join 配置類型</h2>
<p>當使用 <code>--config</code> 選項執行 <code>kubeadm join</code> 命令時，
需要提供 JoinConfiguration 類型。</p>

<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta4<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>JoinConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span></pre>

<!--
<p>The JoinConfiguration type should be used to configure runtime settings, that in case of kubeadm join
are the discovery method used for accessing the cluster info and all the setting which are specific
to the node where kubeadm is executed, including:</p>
-->
<p>JoinConfiguration 類型用來配置運行時設置，就 <code>kubeadm join</code>
而言包括用來訪問集羣信息的發現方法，以及所有特定於 kubeadm 執行所在節點的設置，包括：</p>

<!--
<ul>
<li>
<p><code>nodeRegistration</code>, that holds fields that relate to registering the new node to the cluster;
use it to customize the node name, the CRI socket to use or any other settings that should apply to this
node only (e.g. the node ip).</p>
</li>
<li>
<p>`apiEndpoint“, that represents the endpoint of the instance of the API server to be eventually deployed on this node.</p>
</li>
</ul>
-->
<ul>
<li>
<p><code>nodeRegistration</code>：其中包含向叢集註冊新節點相關的設定字段；
使用這個類型可以定製節點名稱、用使用的 CRI 套接字和所有其他僅適用於當前節點的設置
（例如節點 IP 地址）。</p>
</li>
<li>
<p><code>apiEndpoint</code>：用來代表最終要部署到此節點上的 API 伺服器實例的端點。</p>
</li>
</ul>

<!--
## Resource Types
-->
## 資源類型  {#resource-types}

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)
- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)
- [ResetConfiguration](#kubeadm-k8s-io-v1beta4-ResetConfiguration)

## `BootstrapToken`     {#BootstrapToken}
    
<!--
**Appears in:**
-->
**出現在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

<!--
BootstrapToken describes one bootstrap token, stored as a Secret in the cluster
-->
<p>BootstrapToken 描述的是一個啓動引導令牌，以 Secret 的形式存儲在叢集中。</p>

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
   <p><code>token</code> 用來在節點與控制平面之間建立雙向的信任關係。
在向叢集中添加節點時使用。</p>
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
   <p><code>description</code> 設置一個對使用者友好的信息，
   說明爲什麼此令牌會存在以及其目標用途，這樣其他管理員能夠知道其目的。</p>
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
   <p><code>ttl</code> 定義此令牌的生命週期。默認爲 <code>24h</code>。
<code>expires</code> 和 <code>ttl</code> 是互斥的。</p>
</td>
</tr>
<tr><td><code>expires</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <!--
   <code>expires</code> specifies the timestamp when this token expires. Defaults to being set
dynamically at runtime based on the <code>ttl</code>. <code>expires</code> and <code>ttl</code> are mutually exclusive.
   -->
   <p><code>expires</code> 設置此令牌過期的時間戳。默認根據 <code>ttl</code> 值在運行時動態設置。
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
   <p><code>usages</code> 描述此令牌的可能使用方式。默認情況下，
   令牌可用於建立雙向的信任關係；不過這裏可以改變默認用途。</p>
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

<!--
BootstrapTokenString is a token of the format <code>abcdef.abcdef0123456789</code> that is used
for both validation of the practically of the API server from a joining node's point
of view and as an authentication method for the node in the bootstrap phase of
&quot;kubeadm join&quot;. This token is and should be short-lived.
-->
<p>BootstrapTokenString 形式爲 <code>abcdef.abcdef0123456789</code> 的一個令牌，
用來從加入叢集的節點角度驗證 API 伺服器的身份，或者 &quot;kubeadm join&quot;
在節點啓動引導時作爲一種身份認證方法。
此令牌的生命期是短暫的，並且應該如此。</p>
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
   <span class="text-muted">令牌的私密數據。</span>
</td>
</tr>
</tbody>
</table>

## `ClusterConfiguration`     {#kubeadm-k8s-io-v1beta3-ClusterConfiguration}

<!--
<p>ClusterConfiguration contains cluster-wide configuration for a kubeadm cluster</p>
-->
<p>ClusterConfiguration 包含一個 kubeadm 叢集的叢集範圍設定信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ClusterConfiguration</code></td></tr>

<tr><td><code>etcd</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Etcd"><code>Etcd</code></a>
</td>
<td>
   <!--
   <p>Etcd holds configuration for etcd.</p>
   -->
   <p><code>etcd</code> 中包含 etcd 服務的設定。</p>
</td>
</tr>
<tr><td><code>networking</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Networking"><code>Networking</code></a>
</td>
<td>
   <!--
   <p>Networking holds configuration for the networking topology of the cluster.</p>
   -->
   <p><code>networking</code> 字段包含叢集的網路拓撲設定。</p>
</td>
</tr>
<tr><td><code>kubernetesVersion</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>KubernetesVersion is the target version of the control plane.</p>
   -->
   <p><code>kubernetesVersion</code> 設置控制平面的目標版本。</p>
</td>
</tr>
<tr><td><code>controlPlaneEndpoint</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>ControlPlaneEndpoint sets a stable IP address or DNS name for the control plane; it
can be a valid IP address or a RFC-1123 DNS subdomain, both with optional TCP port.
In case the ControlPlaneEndpoint is not specified, the AdvertiseAddress + BindPort
are used; in case the ControlPlaneEndpoint is specified but without a TCP port,
the BindPort is used.
Possible usages are:</p>
   -->
   <p><code>controlPlaneEndpoint</code> 爲控制平面設置一個穩定的 IP 地址或 DNS 名稱。
取值可以是一個合法的 IP 地址或者 RFC-1123 形式的 DNS 子域名，二者均可以帶一個可選的 TCP 端口號。
如果 <code>controlPlaneEndpoint</code> 未設置，則使用 <code>advertiseAddress<code> +
<code>bindPort</code>。如果設置了 <code>controlPlaneEndpoint</code>，但未指定 TCP 端口號，
則使用 <code>bindPort</code>。</p>
<p>可能的用法有：</p>
<!--
e.g. In a cluster with more than one control plane instances, this field should be
assigned the address of the external load balancer in front of the
control plane instances.
e.g.  in environments with enforced node recycling, the ControlPlaneEndpoint
could be used for assigning a stable DNS to the control plane.
-->
<ul>
  <li>在一個包含不止一個控制平面實例的叢集中，該字段應該設置爲放置在控制平面實例前面的外部負載均衡器的地址。</li>
  <li>在帶有強制性節點回收的環境中，<code>controlPlaneEndpoint</code> 可以用來爲控制平面設置一個穩定的 DNS。</li>
</ul>
</td>
</tr>

<tr><td><code>apiServer</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIServer"><code>APIServer</code></a>
</td>
<td>
   <!--
   <p>APIServer contains extra settings for the API server control plane component</p>
   -->
   <p><code>apiServer</code> 包含 API 伺服器的一些額外設定。</p>
</td>
</tr>
<tr><td><code>controllerManager</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <!--
   <p>ControllerManager contains extra settings for the controller manager control plane component</p>
   -->
   <p><code>controllerManager</code> 中包含控制器管理器的額外設定。</p>
</td>
</tr>
<tr><td><code>scheduler</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <!--
   <p>Scheduler contains extra settings for the scheduler control plane component</p>
   -->
   <p><code>scheduler</code> 包含調度器控制平面組件的額外設定。</p>
</td>
</tr>
<tr><td><code>dns</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-DNS"><code>DNS</code></a>
</td>
<td>
   <!--
   <p>DNS defines the options for the DNS add-on installed in the cluster.</p>
   -->
   <p><code>dns</code> 定義在叢集中安裝的 DNS 插件的選項。</p>
</td>
</tr>
<tr><td><code>certificatesDir</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>CertificatesDir specifies where to store or look for all required certificates.</p>
   -->
   <p><code>certificatesDir</code> 設置在何處存放或者查找所需證書。</p>
</td>
</tr>
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>ImageRepository sets the container registry to pull images from.
If empty, <code>registry.k8s.io</code> will be used by default; in case of kubernetes version is a CI build (kubernetes version starts with <code>ci/</code>)
<code>gcr.io/k8s-staging-ci-images</code> will be used as a default for control plane components and for kube-proxy, while <code>registry.k8s.io</code>
will be used for all the other images.</p>
   -->
   <p><code>imageRepository</code> 設置用來拉取映像檔的容器倉庫。
如果此字段爲空，默認使用 <code>registry.k8s.io</code>。
當 Kubernetes 用來執行 CI 構建時（Kubernetes 版本以 <code>ci/</code> 開頭），
將默認使用 <code>gcr.io/k8s-staging-ci-images</code> 來拉取控制平面組件映像檔，
而使用 <code>registry.k8s.io</code> 來拉取所有其他映像檔。</p>
</td>
</tr>
<tr><td><code>featureGates</code><br/>
<code>map[string]bool</code>
</td>
<td>
   <!--
   <p>FeatureGates enabled by the user.</p>
   -->
   <p><code>featureGates</code> 包含使用者所啓用的特性門控。</p>
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
information.</p>
-->
<p><code>InitConfiguration</code> 包含一組特定於 &quot;kubeadm init&quot; 的運行時元素。

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InitConfiguration</code></td></tr>
  
<tr><td><code>bootstrapTokens</code><br/>
<a href="#BootstrapToken"><code>[]BootstrapToken</code></a>
</td>
<td>
   <!--
   <p>BootstrapTokens is respected at <code>kubeadm init</code> time and describes a set of Bootstrap Tokens to create.
This information IS NOT uploaded to the kubeadm cluster configmap, partly because of its sensitive nature</p>
   -->
   <p><code>bootstrapTokens</code> 在 <code>kubeadm init</code> 執行時會被用到，
其中描述了一組要創建的啓動引導令牌（Bootstrap Tokens）。
這裏的信息不會被上傳到 kubeadm 在叢集中保存的 ConfigMap 中，部分原因是由於信息本身比較敏感。</p>
</td>
</tr>
<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
   <!--
   <p>NodeRegistration holds fields that relate to registering the new control-plane node to the cluster</p>
   -->
   <p><code>nodeRegistration</code> 中包含與向叢集中註冊新的控制平面節點相關的字段。</p>
</td>
</tr>
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <!--
   <p>LocalAPIEndpoint represents the endpoint of the API server instance that's deployed on this control plane node
In HA setups, this differs from ClusterConfiguration.ControlPlaneEndpoint in the sense that ControlPlaneEndpoint
is the global endpoint for the cluster, which then loadbalances the requests to each individual API server. This
configuration object lets you customize what IP/DNS name and port the local API server advertises it's accessible
on. By default, kubeadm tries to auto-detect the IP of the default interface and use that, but in case that process
fails you may set the desired value here.</p>
   -->
   <p><code>localAPIEndpoint</code> 所代表的是在此控制平面節點上要部署的 API 伺服器的端點。
   在高可用（HA）設定中，此字段與 <code>ClusterConfiguration.controlPlaneEndpoint</code>
的取值不同：後者代表的是整個叢集的全局端點，該端點上的請求會被負載均衡到每個
API 伺服器。此設定對象允許你定製本地 API 伺服器所公佈的、可訪問的 IP/DNS 名稱和端口。
默認情況下，kubeadm 會嘗試自動檢測默認接口上的 IP 並使用該地址。
不過，如果這種檢測失敗，你可以在此字段中直接設置所期望的值。</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>CertificateKey sets the key with which certificates and keys are encrypted prior to being uploaded in
a secret in the cluster during the uploadcerts init phase.</p>
   -->
   <p><code>certificateKey</code> 用來設置一個祕鑰，該祕鑰將對 <code>uploadcerts init</code>
階段上傳到叢集中某 Secret 內的祕鑰和證書加密。</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p>SkipPhases is a list of phases to skip during command execution.
The list of phases can be obtained with the &quot;kubeadm init --help&quot; command.
The flag &quot;--skip-phases&quot; takes precedence over this field.</p>
   -->
   <p><code>skipPhases</code> 是命令執行過程中要略過的階段（Phases）。
通過執行命令 <code>kubeadm init --help</code> 可以獲得階段的列表。
參數標誌 &quot;--skip-phases&quot; 優先於此字段的設置。</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Patches"><code>Patches</code></a>
</td>
<td>
   <!--
   <p>Patches contains options related to applying patches to components deployed by kubeadm during
&quot;kubeadm init&quot;.</p>
   -->
   <p><code>patches</code> 包含與 <code>kubeadm init</code> 階段 kubeadm
   所部署的組件上要應用的補丁相關的信息。</p>
</td>
</tr>
</tbody>
</table>

## `JoinConfiguration`     {#kubeadm-k8s-io-v1beta3-JoinConfiguration}

<p>
<!--
<p>JoinConfiguration contains elements describing a particular node.</p>
-->
JoinConfiguration 包含描述特定節點的元素。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>JoinConfiguration</code></td></tr>

<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
<p>
   <!--
   NodeRegistration holds fields that relate to registering the new control-plane node to the cluster
   -->
   <code>nodeRegistration</code> 包含與向叢集註冊控制平面節點相關的字段。
</p>
</td>
</tr>
<tr><td><code>caCertPath</code><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   CACertPath is the path to the SSL certificate authority used to
secure comunications between node and control-plane.
Defaults to &quot;/etc/kubernetes/pki/ca.crt&quot;.
   -->
   <code>caCertPath</code> 是指向 SSL 證書機構的路徑，該證書包用來加密節點與控制平面之間的通信。
   默認值爲 &quot;/etc/kubernetes/pki/ca.crt&quot;。
</p>
</td>
</tr>
<tr><td><code>discovery</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubeadm-k8s-io-v1beta3-Discovery"><code>Discovery</code></a>
</td>
<td>
<p>
   <!--
   Discovery specifies the options for the kubelet to use during the TLS Bootstrap process
   -->
   <code>discovery</code> 設置 TLS 引導過程中 kubelet 要使用的選項。
</p>
</td>
</tr>
<tr><td><code>controlPlane</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-JoinControlPlane"><code>JoinControlPlane</code></a>
</td>
<td>
<p>
   <!--
   ControlPlane defines the additional control plane instance to be deployed on the joining node.
If nil, no additional control plane instance will be deployed.
   -->
   <code>controlPlane</code> 定義要在正被加入到叢集中的節點上部署的額外控制平面實例。
   此字段爲 null 時，不會在上面部署額外的控制平面實例。
</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
<p>
   <!--
   SkipPhases is a list of phases to skip during command execution.
The list of phases can be obtained with the &quot;kubeadm join --help&quot; command.
The flag &quot;--skip-phases&quot; takes precedence over this field.
   -->
   <code>skipPhases</code> 是在命令執行過程中要略過的階段的列表。
   通過 <code>kubeadm join --help</code> 命令可以查看階段的列表。
   參數 <code>--skip-phases</code> 優先於此字段。
</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-Patches"><code>Patches</code></a>
</td>
<td>
<p>
   <!--
   Patches contains options related to applying patches to components deployed by kubeadm during
&quot;kubeadm join&quot;.
   -->
   此字段包含 <code>kubeadm join</code> 階段向 kubeadm 所部署的組件打補丁的選項。
</p>
</td>
</tr>
</tbody>
</table>

## `ResetConfiguration`     {#kubeadm-k8s-io-v1beta4-ResetConfiguration}

<!--
<p>ResetConfiguration contains a list of fields that are specifically &quot;kubeadm reset&quot;-only runtime information.</p>
-->
<p><code>ResetConfiguration</code> 包含一個字段列表，這些字段是特定於 &quot;kubeadm reset&quot; 的運行時元素。</p>

<table class="table">
<thead><tr><th width="30%"><!-- Field -->字段</th><th><!-- Description -->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ResetConfiguration</code></td></tr>
    
  
<tr><td><code>cleanupTmpDir</code><br/>
<code>bool</code>
</td>
<td>
   <!--
   <p>CleanupTmpDir specifies whether the &quot;/etc/kubernetes/tmp&quot; directory should be cleaned during the reset process.</p>
   -->
   <p><code>cleanupTmpDir</code> 指定在重置過程中 &quot;/etc/kubernetes/tmp&quot; 目錄是否應被清理。</p>

</td>
</tr>
<tr><td><code>certificatesDir</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>CertificatesDir specifies the directory where the certificates are stored. If specified, it will be cleaned during the reset process.</p>
   -->
   <p><code>certificatesDir</code> 指定證書存儲的目錄。如果被指定，則在重置過程中此目錄將被清理。</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>CRISocket is used to retrieve container runtime info and used for the removal of the containers.
If CRISocket is not specified by flag or config file, kubeadm will try to detect one valid CRISocket instead.</p>
   -->
   <p><code>criSocket</code> 用於檢索容器運行時信息，並用於移除容器。
如果未通過標誌或設定文件指定 <code>criSocket</code>，kubeadm 將嘗試檢測一個有效的 <code>criSocket</code>。</p>

</td>
</tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <!--
   <p>DryRun tells if the dry run mode is enabled, don't apply any change if it is and just output what would be done.</p>
   -->
   <p><code>dryRun</code> 指定是否啓用試運行模式。如果啓用了試運行模式，
   則不應用任何更改，只輸出將要執行的操作。</p>
</td>
</tr>
<tr><td><code>force</code><br/>
<code>bool</code>
</td>
<td>
   <!--
   <p>Force flag instructs kubeadm to reset the node without prompting for confirmation.</p>
   -->
   <p><code>force</code> 標誌指示 kubeadm 在重置節點時不需要確認提示。</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p>IgnorePreflightErrors provides a slice of pre-flight errors to be ignored during the reset process, e.g. 'IsPrivilegedUser,Swap'.
Value 'all' ignores errors from all checks.</p>
   -->
   <p><code>ignorePreflightErrors</code> 提供了一個在重置過程中要忽略的預檢錯誤列表，例如
   'IsPrivilegedUser,Swap'。值 'all' 將忽略所有檢查的錯誤。</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p>SkipPhases is a list of phases to skip during command execution.
The list of phases can be obtained with the &quot;kubeadm reset phase --help&quot; command.</p>
   -->
   <p><code>skipPhases</code> 是一個在命令執行過程中要略過的階段的列表。
你可以使用命令 &quot;kubeadm reset phase --help&quot; 獲取階段的列表。</p>
</td>
</tr>
</tbody>
</table>

## `APIEndpoint`     {#kubeadm-k8s-io-v1beta3-APIEndpoint}

<!--
**Appears in:**
-->
**出現在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

- [JoinControlPlane](#kubeadm-k8s-io-v1beta4-JoinControlPlane)

<p>
<!--
APIEndpoint struct contains elements of API server instance deployed on a node.
-->
<code>APIEndpoint</code> 結構包含某節點上部署的 API 伺服器實例的元素。
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
   AdvertiseAddress sets the IP address for the API server to advertise.<
   -->
   <code>advertiseAddress</code> 設置 API 伺服器要公佈的 IP 地址。
</p>
</td>
</tr>
<tr><td><code>bindPort</code><br/>
<code>int32</code>
</td>
<td>
<p>
   <!--
   BindPort sets the secure port for the API Server to bind to.
Defaults to 6443.
   -->
   <code>bindPort</code> 設置 API 伺服器要綁定到的安全端口。默認值爲 6443。
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
<code>APIServer</code> 包含叢集中 API 伺服器部署所必需的設置。
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
（<code>ControlPlaneComponent</code> 結構的字段被嵌入到此類型中。）
   <!--span class="text-muted">No description provided.</span-->
   <span class="text-muted">無描述。</span>
</td>
</tr>
<tr><td><code>certSANs</code><br/>
<code>[]string</code>
</td>
<td>
<p>
   <!--
   CertSANs sets extra Subject Alternative Names for the API Server signing cert.
   -->
   <code>certSANs</code> 設置 API 伺服器簽署證書所用的額外主體替代名（Subject Alternative Name，SAN）。
</p>
</td>
</tr>
<tr><td><code>timeoutForControlPlane</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
   <!--
   TimeoutForControlPlane controls the timeout that we use for API server to appear<
   -->
   <code>timeoutForControlPlane</code> 用來控制我們等待 API 伺服器開始運行的超時時間。
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
BootstrapTokenDiscovery 用來設置基於引導令牌的服務發現選項。
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
   Token is a token used to validate cluster information
fetched from the control-plane.
   -->
   <code>token</code> 是用來驗證從控制平面獲得的叢集信息的令牌。
</p>
</td>
</tr>
<tr><td><code>apiServerEndpoint</code><br/>
<code>string</code>
</td>
<td>
<p>
   <!--
   APIServerEndpoint is an IP or domain name to the API server from which info will be fetched.
   -->
   <code>apiServerEndpoint</code> 爲 API 伺服器的 IP 地址或者域名，從該端點可以獲得叢集信息。
</p>
</td>
</tr>
<tr><td><code>caCertHashes</code><br/>
<code>[]string</code>
</td>
<td>
<p>
   <!--
   CACertHashes specifies a set of public key pins to verify
when token-based discovery is used. The root CA found during discovery
must match one of these values. Specifying an empty set disables root CA
pinning, which can be unsafe. Each hash is specified as &quot; &quot;,
where the only currently supported type is &quot;sha256&quot;. This is a hex-encoded
SHA-256 hash of the Subject Public Key Info (SPKI) object in DER-encoded
ASN.1. These hashes can be calculated using, for example, OpenSSL.
   -->
   <code>caCertHashes</code> 設置一組在基於令牌來發現服務時要驗證的公鑰指紋。
發現過程中獲得的根 CA 必須與這裏的數值之一匹配。設置爲空集合意味着禁用根 CA 指紋，
因而可能是不安全的。每個哈希值的形式爲 <code>&lt;type&gt;:&lt;value&gt;</code>，
當前唯一支持的 type 爲 &quot;sha256&quot;。
哈希值爲主體公鑰信息（Subject Public Key Info，SPKI）對象的 SHA-256
哈希值（十六進制編碼），形式爲 DER 編碼的 ASN.1。
例如，這些哈希值可以使用 OpenSSL 來計算。
</p>
</td>
</tr>
<tr><td><code>unsafeSkipCAVerification</code><br/>
<code>bool</code>
</td>
<td>
<p>
   <!--
   UnsafeSkipCAVerification allows token-based discovery
without CA verification via CACertHashes. This can weaken
the security of kubeadm since other nodes can impersonate the control-plane.
   -->
   <code>unsafeSkipCAVerification</code> 允許在使用基於令牌的服務發現時不使用
   <code>caCertHashes</code> 來執行 CA 驗證。這會弱化 kubeadm 的安全性，
   因爲其他節點可以僞裝成控制平面。
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
<p>ControlPlaneComponent 中包含對叢集中所有控制平面組件都適用的設置。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
<p>
   <!--
   ExtraArgs is an extra set of flags to pass to the control plane component.
A key in this map is the flag name as it appears on the
command line except without leading dash(es).
TODO: This is temporary and ideally we would like to switch all components to
use ComponentConfig + ConfigMaps.
   -->
   <code>extraArgs</code> 是要傳遞給控制平面組件的一組額外的參數標誌。
此映射中的每個鍵對應命令列上使用的標誌名稱，只是沒有其引導連字符。
TODO：這只是暫時的，我們希望將所有組件切換爲使用 ComponentConfig + ConfigMap。
</p>
</td>
</tr>
<tr><td><code>extraVolumes</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-HostPathMount"><code>[]HostPathMount</code></a>
</td>
<td>
<p>
   <!--
   ExtraVolumes is an extra set of host volumes, mounted to the control plane component.
   -->
   <code>extraVolumes</code> 是一組額外的主機卷，需要掛載到控制平面組件中。
</p>
</td>
</tr>
<tr><td><code>extraEnvs</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#envvar-v1-core"><code>[]core/v1.EnvVar</code></a>
</td>
<td>
   <!--
   <p>ExtraEnvs is an extra set of environment variables to pass to the control plane component.
Environment variables passed using ExtraEnvs will override any existing environment variables, or *_proxy environment variables that kubeadm adds by default.</p>
   -->
   <p><code>extraEnvs</code> 是要傳遞給控制平面組件的額外環境變量集合。
使用 <code>extraEnvs</code> 傳遞的環境變量將會覆蓋所有現有的環境變量或是 kubeadm 默認添加的 *_proxy 環境變量。</p>
</td>
</tr>
</tbody>
</table>

## `DNS`     {#kubeadm-k8s-io-v1beta4-DNS}

<!--
**Appears in:**
-->
**出現在：**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta3-ClusterConfiguration)

<!--
DNS defines the DNS addon that should be used in the cluster<
-->
<p>DNS 結構定義要在叢集中使用的 DNS 插件。</p>

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
（<code>ImageMeta</code> 的成員被內嵌到此類型中）。
<p>
   <!--
   ImageMeta allows to customize the image used for the DNS component
   -->
   <code>imageMeta</code> 允許對 DNS 組件所使用的的映像檔作定製。
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
<p>Discovery 設置 TLS 啓動引導過程中 kubelet 要使用的設定選項。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>bootstrapToken</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-BootstrapTokenDiscovery"><code>BootstrapTokenDiscovery</code></a>
</td>
<td>
<p>
   <!--
   BootstrapToken is used to set the options for bootstrap token based discovery
BootstrapToken and File are mutually exclusive
   -->
   <code>bootstrapToken</code> 設置基於啓動引導令牌的服務發現選項。
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
   File is used to specify a file or URL to a kubeconfig file from which to load cluster information
BootstrapToken and File are mutually exclusive
   -->
   <code>file</code> 用來設置一個文件或者 URL 路徑，指向一個 kubeconfig 文件；
   該設定文件中包含叢集信息。
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
   TLSBootstrapToken is a token used for TLS bootstrapping.
If .BootstrapToken is set, this field is defaulted to .BootstrapToken.Token, but can be overridden.
If .File is set, this field <strong>must be set</strong> in case the KubeConfigFile does not contain any other authentication information
   -->
   <code>tlsBootstrapToken</code> 是 TLS 啓動引導過程中使用的令牌。
如果設置了 <code>bootstrapToken</code>，則此字段默認值爲 <code>.bootstrapToken.token</code>，
不過可以被重載。如果設置了 <code>file</code>，此字段<strong>必須被設置</strong>，以防 kubeconfig
文件中不包含其他身份認證信息。
</p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
   <!--
   Timeout modifies the discovery timeout
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
<p>Etcd 包含用來描述 etcd 設定的元素。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>local</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-LocalEtcd"><code>LocalEtcd</code></a>
</td>
<td>
<p>
   <!--
   Local provides configuration knobs for configuring the local etcd instance
Local and External are mutually exclusive
   -->
   <code>local</code> 提供設定本地 etcd 實例的選項。
   <code>local</code> 和 <code>external</code> 是互斥的。
</p>
</td>
</tr>
<tr><td><code>external</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-ExternalEtcd"><code>ExternalEtcd</code></a>
</td>
<td>
<p>
   <!--
   External describes how to connect to an external etcd cluster
Local and External are mutually exclusive
   -->
   <code>external</code> 描述如何連接到外部的 etcd 叢集。
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
kubeadm 不清楚證書文件的存放位置，因此必須單獨提供證書信息。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>endpoints</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <!--
   <p>Endpoints of etcd members. Required for ExternalEtcd.</p>
   -->
   <p><code>endpoints</code> 包含一組 etcd 成員的列表。</p>
</td>
</tr>
<tr><td><code>caFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>CAFile is an SSL Certificate Authority file used to secure etcd communication.
Required if using a TLS connection.</p>
   -->
   <p><code>caFile</code> 是一個 SSL 證書機構（CA）文件，用來加密 etcd 通信。
如果使用 TLS 連接，此字段爲必需字段。</p>
</td>
</tr>
<tr><td><code>certFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>CertFile is an SSL certification file used to secure etcd communication.
Required if using a TLS connection.</p>
   -->
   <p><code>certFile</code> 是一個 SSL 證書文件，用來加密 etcd 通信。
如果使用 TLS 連接，此字段爲必需字段。</p>
</td>
</tr>
<tr><td><code>keyFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>KeyFile is an SSL key file used to secure etcd communication.
Required if using a TLS connection.</p>
   -->
   <p><code>keyFile</code> 是一個用來加密 etcd 通信的 SSL 祕鑰文件。
此字段在使用 TLS 連接時爲必填字段。</p>
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
<p>FileDiscovery is used to specify a file or URL to a kubeconfig file from which to load cluster information</p>
-->
<p>FileDiscovery 用來指定一個文件或者 URL 路徑，指向一個 kubeconfig 文件；
該設定文件可用來加載叢集信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>kubeConfigPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   <p>KubeConfigPath is used to specify the actual file path or URL to the kubeconfig file from which to load cluster information</p>
   -->
   <p><code>kubeConfigPath</code> 用來指定一個文件或者 URL 路徑，指向一個 kubeconfig 文件；
該設定文件可用來加載叢集信息。</p>
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

<!--
<p>HostPathMount contains elements describing volumes that are mounted from the
host.</p>
-->
<p>HostPathMount 包含從宿主節點掛載的卷的信息。</p-->

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   Name of the volume inside the pod template.
   -->
   <p><code>name</code> 爲卷在 Pod 模板中的名稱。</p>
</td>
</tr>
<tr><td><code>hostPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   HostPath is the path in the host that will be mounted inside
the pod.
   -->
   <p><code>hostPath</code> 是要在 Pod 中掛載的卷在宿主系統上的路徑。</p>
</td>
</tr>
<tr><td><code>mountPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <!--
   MountPath is the path inside the pod where hostPath will be mounted.
   -->
   <p><code>mountPath</code> 是 <code>hostPath</code> 在 Pod 內掛載的路徑。</p>
</td>
</tr>
<tr><td><code>readOnly</code><br/>
<code>bool</code>
</td>
<td>
   <!--
   ReadOnly controls write access to the volume
   -->
   <p><code>readOnly</code> 控制卷的讀寫訪問模式。</p>
</td>
</tr>
<tr><td><code>pathType</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#hostpathtype-v1-core"><code>core/v1.HostPathType</code></a>
</td>
<td>
   <!--
   PathType is the type of the HostPath.
   -->
   <p><code>pathType</code> 是 <code>hostPath</code> 的類型。</p>
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

<!--
<p>ImageMeta allows to customize the image used for components that are not
originated from the Kubernetes/Kubernetes release process</p>
-->
<p>ImageMeta 用來設定來源不是 Kubernetes/Kubernetes 發佈過程的組件所使用的映像檔。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <!--
   ImageRepository sets the container registry to pull images from.
if not set, the ImageRepository defined in ClusterConfiguration will be used instead.
   -->
   <p><code>imageRepository</code> 設置映像檔拉取所用的容器倉庫。
若未設置，則使用 ClusterConfiguration 中的 <code>imageRepository</code>。</p>
</td>
</tr>
<tr><td><code>imageTag</code><br/>
<code>string</code>
</td>
<td>
   <!--
   ImageTag allows to specify a tag for the image.
In case this value is set, kubeadm does not change automatically the version of the above components during upgrades.
   -->
   <p><code>imageTag</code> 允許使用者設置映像檔的標籤。
如果設置了此字段，則 kubeadm 不再在叢集升級時自動更改組件的版本。</p>
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

<!--
JoinControlPlane contains elements describing an additional control plane instance to be deployed on the joining node.
-->
<p>JoinControlPlane 包含在正在加入叢集的節點上要部署的額外的控制平面組件的設置。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta3-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <!--
   LocalAPIEndpoint represents the endpoint of the API server instance to be deployed on this node.
   -->
   <p><code>localAPIEndpoint</code> 代表的是將在此節點上部署的 API 伺服器實例的端點。</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <!--
   CertificateKey is the key that is used for decryption of certificates after they are downloaded from the secret
upon joining a new control plane node. The corresponding encryption key is in the InitConfiguration.
   -->
   <p><code>certificateKey</code> 是在添加新的控制平面節點時用來解密所下載的
Secret 中的證書的祕鑰。對應的加密祕鑰在 InitConfiguration 結構中。</p>
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

<!--
LocalEtcd describes that kubeadm should run an etcd cluster locally
-->
<p>LocalEtcd 描述的是 kubeadm 要使用的本地 etcd 叢集。</p>

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
（<code>ImageMeta</code> 結構的字段被嵌入到此類型中。）
   <!--
   ImageMeta allows to customize the container used for etcd.
   -->
   <p>ImageMeta 允許使用者爲 etcd 定製要使用的容器。</p>
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
   <p><code>dataDir</code> 是 etcd 用來存放數據的目錄。
默認值爲  &quot;/var/lib/etcd&quot;。</p>
</td>
</tr>
<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <!--
   ExtraArgs are extra arguments provided to the etcd binary
when run inside a static pod.
A key in this map is the flag name as it appears on the
command line except without leading dash(es).
   -->
   <p><code>extraArgs</code> 是爲 etcd 可執行文件提供的額外參數，用於在靜態
Pod 中運行 etcd。映射中的每一個鍵對應命令列上的一個標誌參數，只是去掉了前置的連字符。</p>
</td>
</tr>
<tr><td><code>extraEnvs</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#envvar-v1-core"><code>[]core/v1.EnvVar</code></a>
</td>
<td>
   <!--
   <p>ExtraEnvs is an extra set of environment variables to pass to the control plane component.
Environment variables passed using ExtraEnvs will override any existing environment variables, or *_proxy environment variables that kubeadm adds by default.</p>
   -->
   <p><code>extraEnvs</code> 是要傳遞給控制平面組件的額外環境變量集合。
使用 ExtraEnvs 傳遞的環境變量將會覆蓋任何現有的環境變量或是 kubeadm 默認添加的 *_proxy 環境變量。</p>
</td>
</tr>
<tr><td><code>serverCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   ServerCertSANs sets extra Subject Alternative Names for the etcd server signing cert.
   -->
   <p><code>serverCertSANs</code> 爲 etcd 伺服器的簽名證書設置額外的主體替代名
   （Subject Alternative Names，SAN）。</p>
</td>
</tr>
<tr><td><code>peerCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   PeerCertSANs sets extra Subject Alternative Names for the etcd peer signing cert.
   -->
   <p><code>peerCertSANs</code> 爲 etcd 的對等端簽名證書設置額外的主體替代名
   （Subject Alternative Names，SAN）。</p>
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

<!--
Networking contains elements describing cluster's networking configuration
-->
<p>Networking 中包含描述叢集網路設定的元素。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>serviceSubnet</code><br/>
<code>string</code>
</td>
<td>
   <!--
   ServiceSubnet is the subnet used by k8s services. Defaults to &quot;10.96.0.0/12&quot;.
   -->
   <p><code>serviceSubnet</code> 是 Kubernetes 服務所使用的的子網。
默認值爲 &quot;10.96.0.0/12&quot;。</p>
</td>
</tr>
<tr><td><code>podSubnet</code><br/>
<code>string</code>
</td>
<td>
   <!--
   PodSubnet is the subnet used by pods.
   -->
   <p><code>podSubnet</code> 爲 Pod 所使用的子網。</p>
</td>
</tr>
<tr><td><code>dnsDomain</code><br/>
<code>string</code>
</td>
<td>
   <!--
   DNSDomain is the dns domain used by k8s services. Defaults to &quot;cluster.local&quot;.
   -->
   <p><code>dnsDomain</code> 是 Kubernetes 服務所使用的的 DNS 域名。
默認值爲 &quot;cluster.local&quot;。</p>
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

<!--
<p>NodeRegistrationOptions holds fields that relate to registering a new control-plane or node to the cluster, either via &quot;kubeadm init&quot; or &quot;kubeadm join&quot;</p>
-->
<p>NodeRegistrationOptions 包含向叢集中註冊新的控制平面或節點所需要的信息；
節點註冊可能通過 &quot;kubeadm init&quot; 或 &quot;kubeadm join&quot; 完成。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <!--
   Name is the <code>.Metadata.Name</code> field of the Node API object that will be created in this <code>kubeadm init</code> or <code>kubeadm join</code> operation.
This field is also used in the CommonName field of the kubelet's client certificate to the API server.
Defaults to the hostname of the node if not provided.
   -->
   <p><code>name</code> 是 Node API 對象的 <code>.metadata.name</code> 字段值；
該 API 對象會在此 <code>kubeadm init</code> 或 <code>kubeadm join</code> 操作期間創建。
在提交給 API 伺服器的 kubelet 客戶端證書中，此字段也用作其 <code>CommonName</code>。
如果未指定則默認爲節點的主機名。</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <!--
   CRISocket is used to retrieve container runtime info. This information will be annotated to the Node API object, for later re-use
   -->
   <p><code>criSocket</code> 用來讀取容器運行時的信息。此信息會被以註解的方式添加到 Node API 對象至上，用於後續用途。</p>
</td>
</tr>
<tr><td><code>taints</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#taint-v1-core"><code>[]core/v1.Taint</code></a>
</td>
<td>
   <!--
   Taints specifies the taints the Node API object should be registered with. If this field is unset, i.e. nil,
it will be defaulted with a control-plane taint for control-plane nodes. If you don't want to taint your control-plane
node, set this field to an empty slice, i.e. <code>taints: []</code> in the YAML file. This field is solely used for Node registration.
   -->
   <p><code>taints</code> 設定 Node API 對象被註冊時要附帶的污點。
若未設置此字段（即字段值爲 null），默認爲控制平面節點添加控制平面污點。
如果你不想爲控制平面節點添加污點，可以將此字段設置爲空列表（即 YAML 文件中的 <code>taints: []</code>），
這個字段只用於節點註冊。</p>
</td>
</tr>
<tr><td><code>kubeletExtraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <!--
   KubeletExtraArgs passes through extra arguments to the kubelet. The arguments here are passed to the kubelet command line via the environment file
kubeadm writes at runtime for the kubelet to source. This overrides the generic base-level configuration in the kubelet-config ConfigMap
Flags have higher priority when parsing. These values are local and specific to the node kubeadm is executing on.
A key in this map is the flag name as it appears on the
command line except without leading dash(es).
   -->
   <p><code>kubeletExtraArgs</code> 用來向 kubelet 傳遞額外參數。
這裏的參數會通過 kubeadm 在運行時寫入的、由 kubelet 來讀取的環境文件來傳遞給 kubelet 命令列。
這裏的設置會覆蓋掉 <code>kubelet-config</code> ConfigMap 中包含的一般性的設定。
命令列標誌在解析時優先級更高。這裏的設置值僅作用於 kubeadm 運行所在的節點。
映射中的每個鍵對應命令列中的一個標誌參數，只是去掉了前置的連字符。</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <!--
   IgnorePreflightErrors provides a slice of pre-flight errors to be ignored when the current node is registered, e.g. 'IsPrivilegedUser,Swap'.
Value 'all' ignores errors from all checks.
   -->
   <p>
   <code>ignorePreflightErrors</code> 提供一組在當前節點被註冊時可以忽略掉的預檢錯誤。
   例如：<code>IsPrevilegedUser,Swap</code>。
   取值 <code>all</code> 忽略所有檢查的錯誤。
   </p>
</td>
</tr>
<tr><td><code>imagePullPolicy</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#pullpolicy-v1-core"><code>core/v1.PullPolicy</code></a>
</td>
<td>
   <!--
   ImagePullPolicy specifies the policy for image pulling during kubeadm &quot;init&quot; and &quot;join&quot; operations.
The value of this field must be one of &quot;Always&quot;, &quot;IfNotPresent&quot; or &quot;Never&quot;.
If this field is unset kubeadm will default it to &quot;IfNotPresent&quot;, or pull the required images if not present on the host.
   -->
   <p><code>imagePullPolicy</code> 設定 &quot;kubeadm init&quot; 和 &quot;kubeadm join&quot;
操作期間的映像檔拉取策略。此字段的取值可以是 &quot;Always&quot;、&quot;IfNotPresent&quot; 或
&quot;Never&quot; 之一。若此字段未設置，則 kubeadm 使用 &quot;IfNotPresent&quot; 作爲其默認值，
換言之，當映像檔在主機上不存在時才執行拉取操作。</p>
</td>
</tr>
</tbody>
</table>

## `Patches`     {#kubeadm-k8s-io-v1beta3-Patches}
    
<!--
**Appears in:**
-->
**出現在：**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta3-JoinConfiguration)

<!--
Patches contains options related to applying patches to components deployed by kubeadm.
-->
<p><code>Patches</code> 包含要向 kubeadm 所部署的組件應用的補丁信息。</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>directory</code><br/>
<code>string</code>
</td>
<td>
   <!--
   Directory is a path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;.
For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of
&quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;.
&quot;patchtype&quot; can be one of &quot;strategic&quot; &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl.
The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;.
&quot;suffix&quot; is an optional string that can be used to determine which patches are applied
first alpha-numerically.
   -->
  <p><code>directory</code> 是指向某目錄的路徑，該目錄中包含名爲
&quot;target[suffix][+patchtype].extension&quot; 的文件。
例如，&quot;kube-apiserver0+merge.yaml&quot; 或者 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、
&quot;kube-scheduler&quot;、&quot;etcd&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot;，
其取值對應 kubectl 所支持的補丁形式。
&quot;patchtype&quot; 的默認值是 &quot;strategic&quot;。
&quot;extension&quot; 必須是 &quot;json&quot; 或者 &quot;yaml&quot;。
&quot;suffix&quot; 是一個可選的字符串，用來確定按字母表順序來應用時，哪個補丁最先被應用。</p>
</td>
</tr>
</tbody>
</table>
