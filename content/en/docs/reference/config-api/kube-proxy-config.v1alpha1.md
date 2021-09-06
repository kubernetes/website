---
title: kube-proxy Configuration (v1alpha1)
content_type: tool-reference
package: kubeproxy.config.k8s.io/v1alpha1
auto_generated: true
---


## Resource Types 


  
- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)
  
    


## `KubeProxyConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration}
    




KubeProxyConfiguration contains everything necessary to configure the
Kubernetes proxy server.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubeproxy.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeProxyConfiguration</code></td></tr>
    

  
  
<tr><td><code>featureGates</code> <B>[Required]</B><br/>
<code>map[string]bool</code>
</td>
<td>
   featureGates is a map of feature names to bools that enable or disable alpha/experimental features.</td>
</tr>
    
  
<tr><td><code>bindAddress</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   bindAddress is the IP address for the proxy server to serve on (set to 0.0.0.0
for all interfaces)</td>
</tr>
    
  
<tr><td><code>healthzBindAddress</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   healthzBindAddress is the IP address and port for the health check server to serve on,
defaulting to 0.0.0.0:10256</td>
</tr>
    
  
<tr><td><code>metricsBindAddress</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   metricsBindAddress is the IP address and port for the metrics server to serve on,
defaulting to 127.0.0.1:10249 (set to 0.0.0.0 for all interfaces)</td>
</tr>
    
  
<tr><td><code>bindAddressHardFail</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   bindAddressHardFail, if true, kube-proxy will treat failure to bind to a port as fatal and exit</td>
</tr>
    
  
<tr><td><code>enableProfiling</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   enableProfiling enables profiling via web interface on /debug/pprof handler.
Profiling handlers will be handled by metrics server.</td>
</tr>
    
  
<tr><td><code>clusterCIDR</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   clusterCIDR is the CIDR range of the pods in the cluster. It is used to
bridge traffic coming from outside of the cluster. If not provided,
no off-cluster bridging will be performed.</td>
</tr>
    
  
<tr><td><code>hostnameOverride</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   hostnameOverride, if non-empty, will be used as the identity instead of the actual hostname.</td>
</tr>
    
  
<tr><td><code>clientConnection</code> <B>[Required]</B><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   clientConnection specifies the kubeconfig file and client connection settings for the proxy
server to use when communicating with the apiserver.</td>
</tr>
    
  
<tr><td><code>iptables</code> <B>[Required]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration"><code>KubeProxyIPTablesConfiguration</code></a>
</td>
<td>
   iptables contains iptables-related configuration options.</td>
</tr>
    
  
<tr><td><code>ipvs</code> <B>[Required]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration"><code>KubeProxyIPVSConfiguration</code></a>
</td>
<td>
   ipvs contains ipvs-related configuration options.</td>
</tr>
    
  
<tr><td><code>oomScoreAdj</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   oomScoreAdj is the oom-score-adj value for kube-proxy process. Values must be within
the range [-1000, 1000]</td>
</tr>
    
  
<tr><td><code>mode</code> <B>[Required]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-ProxyMode"><code>ProxyMode</code></a>
</td>
<td>
   mode specifies which proxy mode to use.</td>
</tr>
    
  
<tr><td><code>portRange</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   portRange is the range of host ports (beginPort-endPort, inclusive) that may be consumed
in order to proxy service traffic. If unspecified (0-0) then ports will be randomly chosen.</td>
</tr>
    
  
<tr><td><code>udpIdleTimeout</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   udpIdleTimeout is how long an idle UDP connection will be kept open (e.g. '250ms', '2s').
Must be greater than 0. Only applicable for proxyMode=userspace.</td>
</tr>
    
  
<tr><td><code>conntrack</code> <B>[Required]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConntrackConfiguration"><code>KubeProxyConntrackConfiguration</code></a>
</td>
<td>
   conntrack contains conntrack-related configuration options.</td>
</tr>
    
  
<tr><td><code>configSyncPeriod</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   configSyncPeriod is how often configuration from the apiserver is refreshed. Must be greater
than 0.</td>
</tr>
    
  
<tr><td><code>nodePortAddresses</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   nodePortAddresses is the --nodeport-addresses value for kube-proxy process. Values must be valid
IP blocks. These values are as a parameter to select the interfaces where nodeport works.
In case someone would like to expose a service on localhost for local visit and some other interfaces for
particular purpose, a list of IP blocks would do that.
If set it to "127.0.0.0/8", kube-proxy will only select the loopback interface for NodePort.
If set it to a non-zero IP block, kube-proxy will filter that down to just the IPs that applied to the node.
An empty string slice is meant to select all network interfaces.</td>
</tr>
    
  
<tr><td><code>winkernel</code> <B>[Required]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-KubeProxyWinkernelConfiguration"><code>KubeProxyWinkernelConfiguration</code></a>
</td>
<td>
   winkernel contains winkernel-related configuration options.</td>
</tr>
    
  
<tr><td><code>showHiddenMetricsForVersion</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   ShowHiddenMetricsForVersion is the version for which you want to show hidden metrics.</td>
</tr>
    
  
<tr><td><code>detectLocalMode</code> <B>[Required]</B><br/>
<a href="#kubeproxy-config-k8s-io-v1alpha1-LocalMode"><code>LocalMode</code></a>
</td>
<td>
   DetectLocalMode determines mode to use for detecting local traffic, defaults to LocalModeClusterCIDR</td>
</tr>
    
  
</tbody>
</table>
    


## `KubeProxyConntrackConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConntrackConfiguration}
    



**Appears in:**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)


KubeProxyConntrackConfiguration contains conntrack settings for
the Kubernetes proxy server.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>maxPerCore</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   maxPerCore is the maximum number of NAT connections to track
per CPU core (0 to leave the limit as-is and ignore min).</td>
</tr>
    
  
<tr><td><code>min</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   min is the minimum value of connect-tracking records to allocate,
regardless of conntrackMaxPerCore (set maxPerCore=0 to leave the limit as-is).</td>
</tr>
    
  
<tr><td><code>tcpEstablishedTimeout</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   tcpEstablishedTimeout is how long an idle TCP connection will be kept open
(e.g. '2s').  Must be greater than 0 to set.</td>
</tr>
    
  
<tr><td><code>tcpCloseWaitTimeout</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   tcpCloseWaitTimeout is how long an idle conntrack entry
in CLOSE_WAIT state will remain in the conntrack
table. (e.g. '60s'). Must be greater than 0 to set.</td>
</tr>
    
  
</tbody>
</table>
    


## `KubeProxyIPTablesConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPTablesConfiguration}
    



**Appears in:**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)


KubeProxyIPTablesConfiguration contains iptables-related configuration
details for the Kubernetes proxy server.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>masqueradeBit</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   masqueradeBit is the bit of the iptables fwmark space to use for SNAT if using
the pure iptables proxy mode. Values must be within the range [0, 31].</td>
</tr>
    
  
<tr><td><code>masqueradeAll</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   masqueradeAll tells kube-proxy to SNAT everything if using the pure iptables proxy mode.</td>
</tr>
    
  
<tr><td><code>syncPeriod</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   syncPeriod is the period that iptables rules are refreshed (e.g. '5s', '1m',
'2h22m').  Must be greater than 0.</td>
</tr>
    
  
<tr><td><code>minSyncPeriod</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   minSyncPeriod is the minimum period that iptables rules are refreshed (e.g. '5s', '1m',
'2h22m').</td>
</tr>
    
  
</tbody>
</table>
    


## `KubeProxyIPVSConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyIPVSConfiguration}
    



**Appears in:**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)


KubeProxyIPVSConfiguration contains ipvs-related configuration
details for the Kubernetes proxy server.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>syncPeriod</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   syncPeriod is the period that ipvs rules are refreshed (e.g. '5s', '1m',
'2h22m').  Must be greater than 0.</td>
</tr>
    
  
<tr><td><code>minSyncPeriod</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   minSyncPeriod is the minimum period that ipvs rules are refreshed (e.g. '5s', '1m',
'2h22m').</td>
</tr>
    
  
<tr><td><code>scheduler</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   ipvs scheduler</td>
</tr>
    
  
<tr><td><code>excludeCIDRs</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   excludeCIDRs is a list of CIDR's which the ipvs proxier should not touch
when cleaning up ipvs services.</td>
</tr>
    
  
<tr><td><code>strictARP</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   strict ARP configure arp_ignore and arp_announce to avoid answering ARP queries
from kube-ipvs0 interface</td>
</tr>
    
  
<tr><td><code>tcpTimeout</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   tcpTimeout is the timeout value used for idle IPVS TCP sessions.
The default value is 0, which preserves the current timeout value on the system.</td>
</tr>
    
  
<tr><td><code>tcpFinTimeout</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   tcpFinTimeout is the timeout value used for IPVS TCP sessions after receiving a FIN.
The default value is 0, which preserves the current timeout value on the system.</td>
</tr>
    
  
<tr><td><code>udpTimeout</code> <B>[Required]</B><br/>
<a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   udpTimeout is the timeout value used for IPVS UDP packets.
The default value is 0, which preserves the current timeout value on the system.</td>
</tr>
    
  
</tbody>
</table>
    


## `KubeProxyWinkernelConfiguration`     {#kubeproxy-config-k8s-io-v1alpha1-KubeProxyWinkernelConfiguration}
    



**Appears in:**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)


KubeProxyWinkernelConfiguration contains Windows/HNS settings for
the Kubernetes proxy server.

<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    

  
<tr><td><code>networkName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   networkName is the name of the network kube-proxy will use
to create endpoints and policies</td>
</tr>
    
  
<tr><td><code>sourceVip</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   sourceVip is the IP address of the source VIP endoint used for
NAT when loadbalancing</td>
</tr>
    
  
<tr><td><code>enableDSR</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   enableDSR tells kube-proxy whether HNS policies should be created
with DSR</td>
</tr>
    
  
</tbody>
</table>
    


## `LocalMode`     {#kubeproxy-config-k8s-io-v1alpha1-LocalMode}
    
(Alias of `string`)


**Appears in:**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)


LocalMode represents modes to detect local traffic from the node


    


## `ProxyMode`     {#kubeproxy-config-k8s-io-v1alpha1-ProxyMode}
    
(Alias of `string`)


**Appears in:**

- [KubeProxyConfiguration](#kubeproxy-config-k8s-io-v1alpha1-KubeProxyConfiguration)


ProxyMode represents modes used by the Kubernetes proxy server.

Currently, three modes of proxy are available in Linux platform: 'userspace' (older, going to be EOL), 'iptables'
(newer, faster), 'ipvs'(newest, better in performance and scalability).

Two modes of proxy are available in Windows platform: 'userspace'(older, stable) and 'kernelspace' (newer, faster).

In Linux platform, if proxy mode is blank, use the best-available proxy (currently iptables, but may change in the
future). If the iptables proxy is selected, regardless of how, but the system's kernel or iptables versions are
insufficient, this always falls back to the userspace proxy. IPVS mode will be enabled when proxy mode is set to 'ipvs',
and the fall back path is firstly iptables and then userspace.

In Windows platform, if proxy mode is blank, use the best-available proxy (currently userspace, but may change in the
future). If winkernel proxy is selected, regardless of how, but the Windows kernel can't support this mode of proxy,
this always falls back to the userspace proxy.


    
  
