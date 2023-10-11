---
title: kubeadm Configuration (v1beta4)
content_type: tool-reference
package: kubeadm.k8s.io/v1beta4
auto_generated: true
---
<h2>Overview</h2>
<p>Package v1beta4 defines the v1beta4 version of the kubeadm configuration file format.
This version improves on the v1beta3 format by fixing some minor issues and adding a few new fields.</p>
<p>A list of changes since v1beta3:</p>
<ul>
<li>TODO https://github.com/kubernetes/kubeadm/issues/2890</li>
<li>Support custom environment variables in control plane components under
<code>ClusterConfiguration</code>.
Use <code>APIServer.ExtraEnvs</code>, <code>ControllerManager.ExtraEnvs</code>, <code>Scheduler.ExtraEnvs</code>,
<code>Etcd.Local.ExtraEnvs</code>.</li>
<li>The <code>ResetConfiguration</code> API type is now supported in v1beta4.
Users are able to reset a node by passing a <code>--config</code> file to <code>kubeadm reset</code>.</li>
</ul>
<h1>Migration from old kubeadm config versions</h1>
<ul>
<li>kubeadm v1.15.x and newer can be used to migrate from v1beta1 to v1beta2.</li>
<li>kubeadm v1.22.x and newer no longer support v1beta1 and older APIs, but can be used to migrate v1beta2 to v1beta3.</li>
<li>kubeadm v1.27.x and newer no longer support v1beta2 and older APIs.</li>
<li>TODO: https://github.com/kubernetes/kubeadm/issues/2890
add version that can be used to convert to v1beta4</li>
</ul>
<h2>Basics</h2>
<p>The preferred way to configure kubeadm is to pass an YAML configuration file with
the `--config“ option. Some of the configuration options defined in the kubeadm
config file are also available as command line flags, but only the most
common/simple use case are supported with this approach.</p>
<p>A kubeadm config file could contain multiple configuration types separated using three dashes (<code>---</code>).</p>
<p>kubeadm supports the following configuration types:</p>
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
<p>To print the defaults for &quot;init&quot; and &quot;join&quot; actions use the following commands:</p>
<pre style="background-color:#fff">kubeadm config print init-defaults
kubeadm config print join-defaults
</pre><p>The list of configuration types that must be included in a configuration file depends by the action you are
performing (<code>init or </code>join`) and by the configuration options you are going to use (defaults or advanced customization).</p>
<p>If some configuration types are not provided, or provided only partially, kubeadm will use default values; defaults
provided by kubeadm includes also enforcing consistency of values across components when required (e.g.
<code>--cluster-cidr</code> flag on controller manager and <code>clusterCIDR</code> on kube-proxy).</p>
<p>Users are always allowed to override default values, with the only exception of a small subset of setting with
relevance for security (e.g. enforce authorization-mode Node and RBAC on api server).</p>
<p>If the user provides a configuration types that is not expected for the action you are performing, kubeadm will
ignore those types and print a warning.</p>
<h2>Kubeadm init configuration types</h2>
<p>When executing kubeadm init with the `--config“ option, the following configuration types could be used:
InitConfiguration, ClusterConfiguration, KubeProxyConfiguration, KubeletConfiguration, but only one
between InitConfiguration and ClusterConfiguration is mandatory.</p>
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
</span></pre><p>The InitConfiguration type should be used to configure runtime settings, that in case of kubeadm init
are the configuration of the bootstrap token and all the setting which are specific to the node where kubeadm
is executed, including:</p>
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
</span></pre><p>The ClusterConfiguration type should be used to configure cluster-wide settings,
including settings for:</p>
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
<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeproxy.config.k8s.io/v1alpha1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeProxyConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span></pre><p>The KubeProxyConfiguration type should be used to change the configuration passed to kube-proxy instances deployed
in the cluster. If this object is not provided or provided only partially, kubeadm applies defaults.</p>
<p>See https://kubernetes.io/docs/reference/command-line-tools-reference/kube-proxy/ or
https://pkg.go.dev/k8s.io/kube-proxy/config/v1alpha1#KubeProxyConfiguration
for kube-proxy official documentation.</p>
<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubelet.config.k8s.io/v1beta1<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>KubeletConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span></pre><p>The KubeletConfiguration type should be used to change the configurations that will be passed to all kubelet instances
deployed in the cluster. If this object is not provided or provided only partially, kubeadm applies defaults.</p>
<p>See https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/ or
https://pkg.go.dev/k8s.io/kubelet/config/v1beta1#KubeletConfiguration
for kubelet official documentation.</p>
<p>Here is a fully populated example of a single YAML file containing multiple
configuration types to be used during a <code>kubeadm init</code> run.</p>
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
</span></pre><h2>Kubeadm join configuration types</h2>
<p>When executing kubeadm join with the --config option, the JoinConfiguration type should be provided.</p>
<pre style="background-color:#fff"><span style="color:#000;font-weight:bold">apiVersion</span>:<span style="color:#bbb"> </span>kubeadm.k8s.io/v1beta4<span style="color:#bbb">
</span><span style="color:#bbb"></span><span style="color:#000;font-weight:bold">kind</span>:<span style="color:#bbb"> </span>JoinConfiguration<span style="color:#bbb">
</span><span style="color:#bbb">
</span><span style="color:#bbb">	</span>...<span style="color:#bbb">
</span><span style="color:#bbb">
</span></pre><p>The JoinConfiguration type should be used to configure runtime settings, that in case of kubeadm join
are the discovery method used for accessing the cluster info and all the setting which are specific
to the node where kubeadm is executed, including:</p>
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


## Resource Types 


- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)
- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)
- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)
- [ResetConfiguration](#kubeadm-k8s-io-v1beta4-ResetConfiguration)
  
    
    

## `BootstrapToken`     {#BootstrapToken}
    

**Appears in:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta3-InitConfiguration)

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)


<p>BootstrapToken describes one bootstrap token, stored as a Secret in the cluster</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>token</code> <B>[Required]</B><br/>
<a href="#BootstrapTokenString"><code>BootstrapTokenString</code></a>
</td>
<td>
   <p><code>token</code> is used for establishing bidirectional trust between nodes and control-planes.
Used for joining nodes in the cluster.</p>
</td>
</tr>
<tr><td><code>description</code><br/>
<code>string</code>
</td>
<td>
   <p><code>description</code> sets a human-friendly message why this token exists and what it's used
for, so other administrators can know its purpose.</p>
</td>
</tr>
<tr><td><code>ttl</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p><code>ttl</code> defines the time to live for this token. Defaults to <code>24h</code>.
<code>expires</code> and <code>ttl</code> are mutually exclusive.</p>
</td>
</tr>
<tr><td><code>expires</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p><code>expires</code> specifies the timestamp when this token expires. Defaults to being set
dynamically at runtime based on the <code>ttl</code>. <code>expires</code> and <code>ttl</code> are mutually exclusive.</p>
</td>
</tr>
<tr><td><code>usages</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>usages</code> describes the ways in which this token can be used. Can by default be used
for establishing bidirectional trust, but that can be changed here.</p>
</td>
</tr>
<tr><td><code>groups</code><br/>
<code>[]string</code>
</td>
<td>
   <p><code>groups</code> specifies the extra groups that this token will authenticate as when/if
used for authentication</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenString`     {#BootstrapTokenString}
    

**Appears in:**

- [BootstrapToken](#BootstrapToken)


<p>BootstrapTokenString is a token of the format <code>abcdef.abcdef0123456789</code> that is used
for both validation of the practically of the API server from a joining node's point
of view and as an authentication method for the node in the bootstrap phase of
&quot;kubeadm join&quot;. This token is and should be short-lived.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>-</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>-</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>
  

## `ClusterConfiguration`     {#kubeadm-k8s-io-v1beta4-ClusterConfiguration}
    


<p>ClusterConfiguration contains cluster-wide configuration for a kubeadm cluster</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ClusterConfiguration</code></td></tr>
    
  
<tr><td><code>etcd</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Etcd"><code>Etcd</code></a>
</td>
<td>
   <p>Etcd holds configuration for etcd.</p>
</td>
</tr>
<tr><td><code>networking</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Networking"><code>Networking</code></a>
</td>
<td>
   <p>Networking holds configuration for the networking topology of the cluster.</p>
</td>
</tr>
<tr><td><code>kubernetesVersion</code><br/>
<code>string</code>
</td>
<td>
   <p>KubernetesVersion is the target version of the control plane.</p>
</td>
</tr>
<tr><td><code>controlPlaneEndpoint</code><br/>
<code>string</code>
</td>
<td>
   <p>ControlPlaneEndpoint sets a stable IP address or DNS name for the control plane; it
can be a valid IP address or a RFC-1123 DNS subdomain, both with optional TCP port.
In case the ControlPlaneEndpoint is not specified, the AdvertiseAddress + BindPort
are used; in case the ControlPlaneEndpoint is specified but without a TCP port,
the BindPort is used.
Possible usages are:
e.g. In a cluster with more than one control plane instances, this field should be
assigned the address of the external load balancer in front of the
control plane instances.
e.g.  in environments with enforced node recycling, the ControlPlaneEndpoint
could be used for assigning a stable DNS to the control plane.</p>
</td>
</tr>
<tr><td><code>apiServer</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-APIServer"><code>APIServer</code></a>
</td>
<td>
   <p>APIServer contains extra settings for the API server control plane component</p>
</td>
</tr>
<tr><td><code>controllerManager</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <p>ControllerManager contains extra settings for the controller manager control plane component</p>
</td>
</tr>
<tr><td><code>scheduler</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>
   <p>Scheduler contains extra settings for the scheduler control plane component</p>
</td>
</tr>
<tr><td><code>dns</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-DNS"><code>DNS</code></a>
</td>
<td>
   <p>DNS defines the options for the DNS add-on installed in the cluster.</p>
</td>
</tr>
<tr><td><code>certificatesDir</code><br/>
<code>string</code>
</td>
<td>
   <p>CertificatesDir specifies where to store or look for all required certificates.</p>
</td>
</tr>
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <p>ImageRepository sets the container registry to pull images from.
If empty, <code>registry.k8s.io</code> will be used by default; in case of kubernetes version is a CI build (kubernetes version starts with <code>ci/</code>)
<code>gcr.io/k8s-staging-ci-images</code> will be used as a default for control plane components and for kube-proxy, while <code>registry.k8s.io</code>
will be used for all the other images.</p>
</td>
</tr>
<tr><td><code>featureGates</code><br/>
<code>map[string]bool</code>
</td>
<td>
   <p>FeatureGates enabled by the user.</p>
</td>
</tr>
<tr><td><code>clusterName</code><br/>
<code>string</code>
</td>
<td>
   <p>The cluster name</p>
</td>
</tr>
</tbody>
</table>

## `InitConfiguration`     {#kubeadm-k8s-io-v1beta4-InitConfiguration}
    


<p>InitConfiguration contains a list of elements that is specific &quot;kubeadm init&quot;-only runtime
information.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>InitConfiguration</code></td></tr>
    
  
<tr><td><code>bootstrapTokens</code><br/>
<a href="#BootstrapToken"><code>[]BootstrapToken</code></a>
</td>
<td>
   <p>BootstrapTokens is respected at <code>kubeadm init</code> time and describes a set of Bootstrap Tokens to create.
This information IS NOT uploaded to the kubeadm cluster configmap, partly because of its sensitive nature</p>
</td>
</tr>
<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
   <p>NodeRegistration holds fields that relate to registering the new control-plane node to the cluster</p>
</td>
</tr>
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <p>LocalAPIEndpoint represents the endpoint of the API server instance that's deployed on this control plane node
In HA setups, this differs from ClusterConfiguration.ControlPlaneEndpoint in the sense that ControlPlaneEndpoint
is the global endpoint for the cluster, which then loadbalances the requests to each individual API server. This
configuration object lets you customize what IP/DNS name and port the local API server advertises it's accessible
on. By default, kubeadm tries to auto-detect the IP of the default interface and use that, but in case that process
fails you may set the desired value here.</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <p>CertificateKey sets the key with which certificates and keys are encrypted prior to being uploaded in
a secret in the cluster during the uploadcerts init phase.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p>SkipPhases is a list of phases to skip during command execution.
The list of phases can be obtained with the &quot;kubeadm init --help&quot; command.
The flag &quot;--skip-phases&quot; takes precedence over this field.</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Patches"><code>Patches</code></a>
</td>
<td>
   <p>Patches contains options related to applying patches to components deployed by kubeadm during
&quot;kubeadm init&quot;.</p>
</td>
</tr>
</tbody>
</table>

## `JoinConfiguration`     {#kubeadm-k8s-io-v1beta4-JoinConfiguration}
    


<p>JoinConfiguration contains elements describing a particular node.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>JoinConfiguration</code></td></tr>
    
  
<tr><td><code>nodeRegistration</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions"><code>NodeRegistrationOptions</code></a>
</td>
<td>
   <p>NodeRegistration holds fields that relate to registering the new control-plane node to the cluster</p>
</td>
</tr>
<tr><td><code>caCertPath</code><br/>
<code>string</code>
</td>
<td>
   <p>CACertPath is the path to the SSL certificate authority used to
secure comunications between node and control-plane.
Defaults to &quot;/etc/kubernetes/pki/ca.crt&quot;.</p>
</td>
</tr>
<tr><td><code>discovery</code> <B>[Required]</B><br/>
<a href="#kubeadm-k8s-io-v1beta4-Discovery"><code>Discovery</code></a>
</td>
<td>
   <p>Discovery specifies the options for the kubelet to use during the TLS Bootstrap process</p>
</td>
</tr>
<tr><td><code>controlPlane</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-JoinControlPlane"><code>JoinControlPlane</code></a>
</td>
<td>
   <p>ControlPlane defines the additional control plane instance to be deployed on the joining node.
If nil, no additional control plane instance will be deployed.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p>SkipPhases is a list of phases to skip during command execution.
The list of phases can be obtained with the &quot;kubeadm join --help&quot; command.
The flag &quot;--skip-phases&quot; takes precedence over this field.</p>
</td>
</tr>
<tr><td><code>patches</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-Patches"><code>Patches</code></a>
</td>
<td>
   <p>Patches contains options related to applying patches to components deployed by kubeadm during
&quot;kubeadm join&quot;.</p>
</td>
</tr>
</tbody>
</table>

## `ResetConfiguration`     {#kubeadm-k8s-io-v1beta4-ResetConfiguration}
    


<p>ResetConfiguration contains a list of fields that are specifically &quot;kubeadm reset&quot;-only runtime information.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeadm.k8s.io/v1beta4</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>ResetConfiguration</code></td></tr>
    
  
<tr><td><code>cleanupTmpDir</code><br/>
<code>bool</code>
</td>
<td>
   <p>CleanupTmpDir specifies whether the &quot;/etc/kubernetes/tmp&quot; directory should be cleaned during the reset process.</p>
</td>
</tr>
<tr><td><code>certificatesDir</code><br/>
<code>string</code>
</td>
<td>
   <p>CertificatesDir specifies the directory where the certificates are stored. If specified, it will be cleaned during the reset process.</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <p>CRISocket is used to retrieve container runtime info and used for the removal of the containers.
If CRISocket is not specified by flag or config file, kubeadm will try to detect one valid CRISocket instead.</p>
</td>
</tr>
<tr><td><code>dryRun</code><br/>
<code>bool</code>
</td>
<td>
   <p>DryRun tells if the dry run mode is enabled, don't apply any change if it is and just output what would be done.</p>
</td>
</tr>
<tr><td><code>force</code><br/>
<code>bool</code>
</td>
<td>
   <p>Force flag instructs kubeadm to reset the node without prompting for confirmation.</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <p>IgnorePreflightErrors provides a slice of pre-flight errors to be ignored during the reset process, e.g. 'IsPrivilegedUser,Swap'.
Value 'all' ignores errors from all checks.</p>
</td>
</tr>
<tr><td><code>skipPhases</code><br/>
<code>[]string</code>
</td>
<td>
   <p>SkipPhases is a list of phases to skip during command execution.
The list of phases can be obtained with the &quot;kubeadm reset phase --help&quot; command.</p>
</td>
</tr>
</tbody>
</table>

## `APIEndpoint`     {#kubeadm-k8s-io-v1beta4-APIEndpoint}
    

**Appears in:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

- [JoinControlPlane](#kubeadm-k8s-io-v1beta4-JoinControlPlane)


<p>APIEndpoint struct contains elements of API server instance deployed on a node.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>advertiseAddress</code><br/>
<code>string</code>
</td>
<td>
   <p>AdvertiseAddress sets the IP address for the API server to advertise.</p>
</td>
</tr>
<tr><td><code>bindPort</code><br/>
<code>int32</code>
</td>
<td>
   <p>BindPort sets the secure port for the API Server to bind to.
Defaults to 6443.</p>
</td>
</tr>
</tbody>
</table>

## `APIServer`     {#kubeadm-k8s-io-v1beta4-APIServer}
    

**Appears in:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)


<p>APIServer holds settings necessary for API server deployments in the cluster</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ControlPlaneComponent</code> <B>[Required]</B><br/>
<a href="#kubeadm-k8s-io-v1beta4-ControlPlaneComponent"><code>ControlPlaneComponent</code></a>
</td>
<td>(Members of <code>ControlPlaneComponent</code> are embedded into this type.)
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>certSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p>CertSANs sets extra Subject Alternative Names for the API Server signing cert.</p>
</td>
</tr>
<tr><td><code>timeoutForControlPlane</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>TimeoutForControlPlane controls the timeout that we use for API server to appear</p>
</td>
</tr>
</tbody>
</table>

## `BootstrapTokenDiscovery`     {#kubeadm-k8s-io-v1beta4-BootstrapTokenDiscovery}
    

**Appears in:**

- [Discovery](#kubeadm-k8s-io-v1beta4-Discovery)


<p>BootstrapTokenDiscovery is used to set the options for bootstrap token based discovery</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>token</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Token is a token used to validate cluster information
fetched from the control-plane.</p>
</td>
</tr>
<tr><td><code>apiServerEndpoint</code><br/>
<code>string</code>
</td>
<td>
   <p>APIServerEndpoint is an IP or domain name to the API server from which info will be fetched.</p>
</td>
</tr>
<tr><td><code>caCertHashes</code><br/>
<code>[]string</code>
</td>
<td>
   <p>CACertHashes specifies a set of public key pins to verify
when token-based discovery is used. The root CA found during discovery
must match one of these values. Specifying an empty set disables root CA
pinning, which can be unsafe. Each hash is specified as &quot;<!-- raw HTML omitted -->:<!-- raw HTML omitted -->&quot;,
where the only currently supported type is &quot;sha256&quot;. This is a hex-encoded
SHA-256 hash of the Subject Public Key Info (SPKI) object in DER-encoded
ASN.1. These hashes can be calculated using, for example, OpenSSL.</p>
</td>
</tr>
<tr><td><code>unsafeSkipCAVerification</code><br/>
<code>bool</code>
</td>
<td>
   <p>UnsafeSkipCAVerification allows token-based discovery
without CA verification via CACertHashes. This can weaken
the security of kubeadm since other nodes can impersonate the control-plane.</p>
</td>
</tr>
</tbody>
</table>

## `ControlPlaneComponent`     {#kubeadm-k8s-io-v1beta4-ControlPlaneComponent}
    

**Appears in:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)

- [APIServer](#kubeadm-k8s-io-v1beta4-APIServer)


<p>ControlPlaneComponent holds settings common to control plane component of the cluster</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>ExtraArgs is an extra set of flags to pass to the control plane component.
A key in this map is the flag name as it appears on the
command line except without leading dash(es).
TODO: This is temporary and ideally we would like to switch all components to
use ComponentConfig + ConfigMaps.</p>
</td>
</tr>
<tr><td><code>extraVolumes</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-HostPathMount"><code>[]HostPathMount</code></a>
</td>
<td>
   <p>ExtraVolumes is an extra set of host volumes, mounted to the control plane component.</p>
</td>
</tr>
<tr><td><code>extraEnvs</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#envvar-v1-core"><code>[]core/v1.EnvVar</code></a>
</td>
<td>
   <p>ExtraEnvs is an extra set of environment variables to pass to the control plane component.
Environment variables passed using ExtraEnvs will override any existing environment variables, or *_proxy environment variables that kubeadm adds by default.</p>
</td>
</tr>
</tbody>
</table>

## `DNS`     {#kubeadm-k8s-io-v1beta4-DNS}
    

**Appears in:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)


<p>DNS defines the DNS addon that should be used in the cluster</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ImageMeta</code> <B>[Required]</B><br/>
<a href="#kubeadm-k8s-io-v1beta4-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>(Members of <code>ImageMeta</code> are embedded into this type.)
   <p>ImageMeta allows to customize the image used for the DNS component</p>
</td>
</tr>
</tbody>
</table>

## `Discovery`     {#kubeadm-k8s-io-v1beta4-Discovery}
    

**Appears in:**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)


<p>Discovery specifies the options for the kubelet to use during the TLS Bootstrap process</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>bootstrapToken</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-BootstrapTokenDiscovery"><code>BootstrapTokenDiscovery</code></a>
</td>
<td>
   <p>BootstrapToken is used to set the options for bootstrap token based discovery
BootstrapToken and File are mutually exclusive</p>
</td>
</tr>
<tr><td><code>file</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-FileDiscovery"><code>FileDiscovery</code></a>
</td>
<td>
   <p>File is used to specify a file or URL to a kubeconfig file from which to load cluster information
BootstrapToken and File are mutually exclusive</p>
</td>
</tr>
<tr><td><code>tlsBootstrapToken</code><br/>
<code>string</code>
</td>
<td>
   <p>TLSBootstrapToken is a token used for TLS bootstrapping.
If .BootstrapToken is set, this field is defaulted to .BootstrapToken.Token, but can be overridden.
If .File is set, this field <strong>must be set</strong> in case the KubeConfigFile does not contain any other authentication information</p>
</td>
</tr>
<tr><td><code>timeout</code><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>Timeout modifies the discovery timeout</p>
</td>
</tr>
</tbody>
</table>

## `Etcd`     {#kubeadm-k8s-io-v1beta4-Etcd}
    

**Appears in:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)


<p>Etcd contains elements describing Etcd configuration.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>local</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-LocalEtcd"><code>LocalEtcd</code></a>
</td>
<td>
   <p>Local provides configuration knobs for configuring the local etcd instance
Local and External are mutually exclusive</p>
</td>
</tr>
<tr><td><code>external</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-ExternalEtcd"><code>ExternalEtcd</code></a>
</td>
<td>
   <p>External describes how to connect to an external etcd cluster
Local and External are mutually exclusive</p>
</td>
</tr>
</tbody>
</table>

## `ExternalEtcd`     {#kubeadm-k8s-io-v1beta4-ExternalEtcd}
    

**Appears in:**

- [Etcd](#kubeadm-k8s-io-v1beta4-Etcd)


<p>ExternalEtcd describes an external etcd cluster.
Kubeadm has no knowledge of where certificate files live and they must be supplied.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>endpoints</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>Endpoints of etcd members. Required for ExternalEtcd.</p>
</td>
</tr>
<tr><td><code>caFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>CAFile is an SSL Certificate Authority file used to secure etcd communication.
Required if using a TLS connection.</p>
</td>
</tr>
<tr><td><code>certFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>CertFile is an SSL certification file used to secure etcd communication.
Required if using a TLS connection.</p>
</td>
</tr>
<tr><td><code>keyFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>KeyFile is an SSL key file used to secure etcd communication.
Required if using a TLS connection.</p>
</td>
</tr>
</tbody>
</table>

## `FileDiscovery`     {#kubeadm-k8s-io-v1beta4-FileDiscovery}
    

**Appears in:**

- [Discovery](#kubeadm-k8s-io-v1beta4-Discovery)


<p>FileDiscovery is used to specify a file or URL to a kubeconfig file from which to load cluster information</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>kubeConfigPath</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>KubeConfigPath is used to specify the actual file path or URL to the kubeconfig file from which to load cluster information</p>
</td>
</tr>
</tbody>
</table>

## `HostPathMount`     {#kubeadm-k8s-io-v1beta4-HostPathMount}
    

**Appears in:**

- [ControlPlaneComponent](#kubeadm-k8s-io-v1beta4-ControlPlaneComponent)


<p>HostPathMount contains elements describing volumes that are mounted from the
host.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name of the volume inside the pod template.</p>
</td>
</tr>
<tr><td><code>hostPath</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>HostPath is the path in the host that will be mounted inside
the pod.</p>
</td>
</tr>
<tr><td><code>mountPath</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>MountPath is the path inside the pod where hostPath will be mounted.</p>
</td>
</tr>
<tr><td><code>readOnly</code><br/>
<code>bool</code>
</td>
<td>
   <p>ReadOnly controls write access to the volume</p>
</td>
</tr>
<tr><td><code>pathType</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#hostpathtype-v1-core"><code>core/v1.HostPathType</code></a>
</td>
<td>
   <p>PathType is the type of the HostPath.</p>
</td>
</tr>
</tbody>
</table>

## `ImageMeta`     {#kubeadm-k8s-io-v1beta4-ImageMeta}
    

**Appears in:**

- [DNS](#kubeadm-k8s-io-v1beta4-DNS)

- [LocalEtcd](#kubeadm-k8s-io-v1beta4-LocalEtcd)


<p>ImageMeta allows to customize the image used for components that are not
originated from the Kubernetes/Kubernetes release process</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>imageRepository</code><br/>
<code>string</code>
</td>
<td>
   <p>ImageRepository sets the container registry to pull images from.
if not set, the ImageRepository defined in ClusterConfiguration will be used instead.</p>
</td>
</tr>
<tr><td><code>imageTag</code><br/>
<code>string</code>
</td>
<td>
   <p>ImageTag allows to specify a tag for the image.
In case this value is set, kubeadm does not change automatically the version of the above components during upgrades.</p>
</td>
</tr>
</tbody>
</table>

## `JoinControlPlane`     {#kubeadm-k8s-io-v1beta4-JoinControlPlane}
    

**Appears in:**

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)


<p>JoinControlPlane contains elements describing an additional control plane instance to be deployed on the joining node.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>localAPIEndpoint</code><br/>
<a href="#kubeadm-k8s-io-v1beta4-APIEndpoint"><code>APIEndpoint</code></a>
</td>
<td>
   <p>LocalAPIEndpoint represents the endpoint of the API server instance to be deployed on this node.</p>
</td>
</tr>
<tr><td><code>certificateKey</code><br/>
<code>string</code>
</td>
<td>
   <p>CertificateKey is the key that is used for decryption of certificates after they are downloaded from the secret
upon joining a new control plane node. The corresponding encryption key is in the InitConfiguration.</p>
</td>
</tr>
</tbody>
</table>

## `LocalEtcd`     {#kubeadm-k8s-io-v1beta4-LocalEtcd}
    

**Appears in:**

- [Etcd](#kubeadm-k8s-io-v1beta4-Etcd)


<p>LocalEtcd describes that kubeadm should run an etcd cluster locally</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ImageMeta</code> <B>[Required]</B><br/>
<a href="#kubeadm-k8s-io-v1beta4-ImageMeta"><code>ImageMeta</code></a>
</td>
<td>(Members of <code>ImageMeta</code> are embedded into this type.)
   <p>ImageMeta allows to customize the container used for etcd</p>
</td>
</tr>
<tr><td><code>dataDir</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>DataDir is the directory etcd will place its data.
Defaults to &quot;/var/lib/etcd&quot;.</p>
</td>
</tr>
<tr><td><code>extraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>ExtraArgs are extra arguments provided to the etcd binary
when run inside a static pod.
A key in this map is the flag name as it appears on the
command line except without leading dash(es).</p>
</td>
</tr>
<tr><td><code>extraEnvs</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#envvar-v1-core"><code>[]core/v1.EnvVar</code></a>
</td>
<td>
   <p>ExtraEnvs is an extra set of environment variables to pass to the control plane component.
Environment variables passed using ExtraEnvs will override any existing environment variables, or *_proxy environment variables that kubeadm adds by default.</p>
</td>
</tr>
<tr><td><code>serverCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p>ServerCertSANs sets extra Subject Alternative Names for the etcd server signing cert.</p>
</td>
</tr>
<tr><td><code>peerCertSANs</code><br/>
<code>[]string</code>
</td>
<td>
   <p>PeerCertSANs sets extra Subject Alternative Names for the etcd peer signing cert.</p>
</td>
</tr>
</tbody>
</table>

## `Networking`     {#kubeadm-k8s-io-v1beta4-Networking}
    

**Appears in:**

- [ClusterConfiguration](#kubeadm-k8s-io-v1beta4-ClusterConfiguration)


<p>Networking contains elements describing cluster's networking configuration</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>serviceSubnet</code><br/>
<code>string</code>
</td>
<td>
   <p>ServiceSubnet is the subnet used by k8s services. Defaults to &quot;10.96.0.0/12&quot;.</p>
</td>
</tr>
<tr><td><code>podSubnet</code><br/>
<code>string</code>
</td>
<td>
   <p>PodSubnet is the subnet used by pods.</p>
</td>
</tr>
<tr><td><code>dnsDomain</code><br/>
<code>string</code>
</td>
<td>
   <p>DNSDomain is the dns domain used by k8s services. Defaults to &quot;cluster.local&quot;.</p>
</td>
</tr>
</tbody>
</table>

## `NodeRegistrationOptions`     {#kubeadm-k8s-io-v1beta4-NodeRegistrationOptions}
    

**Appears in:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)


<p>NodeRegistrationOptions holds fields that relate to registering a new control-plane or node to the cluster, either via &quot;kubeadm init&quot; or &quot;kubeadm join&quot;</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <p>Name is the <code>.Metadata.Name</code> field of the Node API object that will be created in this <code>kubeadm init</code> or <code>kubeadm join</code> operation.
This field is also used in the CommonName field of the kubelet's client certificate to the API server.
Defaults to the hostname of the node if not provided.</p>
</td>
</tr>
<tr><td><code>criSocket</code><br/>
<code>string</code>
</td>
<td>
   <p>CRISocket is used to retrieve container runtime info. This information will be annotated to the Node API object, for later re-use</p>
</td>
</tr>
<tr><td><code>taints</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#taint-v1-core"><code>[]core/v1.Taint</code></a>
</td>
<td>
   <p>Taints specifies the taints the Node API object should be registered with. If this field is unset, i.e. nil,
it will be defaulted with a control-plane taint for control-plane nodes. If you don't want to taint your control-plane
node, set this field to an empty slice, i.e. <code>taints: []</code> in the YAML file. This field is solely used for Node registration.</p>
</td>
</tr>
<tr><td><code>kubeletExtraArgs</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>KubeletExtraArgs passes through extra arguments to the kubelet. The arguments here are passed to the kubelet command line via the environment file
kubeadm writes at runtime for the kubelet to source. This overrides the generic base-level configuration in the kubelet-config ConfigMap
Flags have higher priority when parsing. These values are local and specific to the node kubeadm is executing on.
A key in this map is the flag name as it appears on the
command line except without leading dash(es).</p>
</td>
</tr>
<tr><td><code>ignorePreflightErrors</code><br/>
<code>[]string</code>
</td>
<td>
   <p>IgnorePreflightErrors provides a slice of pre-flight errors to be ignored when the current node is registered, e.g. 'IsPrivilegedUser,Swap'.
Value 'all' ignores errors from all checks.</p>
</td>
</tr>
<tr><td><code>imagePullPolicy</code><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.28/#pullpolicy-v1-core"><code>core/v1.PullPolicy</code></a>
</td>
<td>
   <p>ImagePullPolicy specifies the policy for image pulling during kubeadm &quot;init&quot; and &quot;join&quot; operations.
The value of this field must be one of &quot;Always&quot;, &quot;IfNotPresent&quot; or &quot;Never&quot;.
If this field is unset kubeadm will default it to &quot;IfNotPresent&quot;, or pull the required images if not present on the host.</p>
</td>
</tr>
</tbody>
</table>

## `Patches`     {#kubeadm-k8s-io-v1beta4-Patches}
    

**Appears in:**

- [InitConfiguration](#kubeadm-k8s-io-v1beta4-InitConfiguration)

- [JoinConfiguration](#kubeadm-k8s-io-v1beta4-JoinConfiguration)


<p>Patches contains options related to applying patches to components deployed by kubeadm.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>directory</code><br/>
<code>string</code>
</td>
<td>
   <p>Directory is a path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;.
For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of
&quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;.
&quot;patchtype&quot; can be one of &quot;strategic&quot; &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl.
The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;.
&quot;suffix&quot; is an optional string that can be used to determine which patches are applied
first alpha-numerically.</p>
</td>
</tr>
</tbody>
</table>
  