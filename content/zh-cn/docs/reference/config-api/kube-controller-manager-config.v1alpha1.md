---
title: kube-controller-manager Configuration (v1alpha1)
content_type: tool-reference
package: kubecontrollermanager.config.k8s.io/v1alpha1
auto_generated: true
---

<!--
## Resource Types
-->
## 资源类型  {#resource-types}


- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)
- [LeaderMigrationConfiguration](#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)
- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)
  
    
    

## `NodeControllerConfiguration`     {#NodeControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

<p>
<!-- 
NodeControllerConfiguration contains elements describing NodeController.
-->
NodeControllerConfiguration 包含描述 NodeController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentNodeSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- ConcurrentNodeSyncs is the number of workers concurrently synchronizing nodes -->
   ConcurrentNodeSyncs 是并发执行以进行节点同步的工作程序的数量。
   </p>
</td>
</tr>
</tbody>
</table>

## `ServiceControllerConfiguration`     {#ServiceControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

<p>
<!-- ServiceControllerConfiguration contains elements describing ServiceController.-->
ServiceControllerConfiguration 包含描述 ServiceController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentServiceSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentServiceSyncs is the number of services that are
   allowed to sync concurrently. Larger number = more responsive service
   management, but more CPU (and network) load.
   -->
   concurrentServiceSyncs 是允许同时同步的服务数。
   数量越大表示服务管理响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>
  

## `CloudControllerManagerConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration}
    


<p>
<!-- CloudControllerManagerConfiguration contains elements describing cloud-controller manager.-->
CloudControllerManagerConfiguration 包含描述云控制器管理器的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>cloudcontrollermanager.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CloudControllerManagerConfiguration</code></td></tr>
    
  
<tr><td><code>Generic</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration"><code>GenericControllerManagerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- Generic holds configuration for a generic controller-manager -->
   Generic 包含通用控制器管理器的配置。
   </p>
</td>
</tr>
<tr><td><code>KubeCloudShared</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration"><code>KubeCloudSharedConfiguration</code></a>
</td>
<td>
   <p>
   <!-- 
   KubeCloudSharedConfiguration holds configuration for shared related features
   both in cloud controller manager and kube-controller manager. 
   -->
   KubeCloudSharedConfiguration 保存被云控制器管理器和 kube-controller 管理器共享的相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>NodeController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#NodeControllerConfiguration"><code>NodeControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- NodeController holds configuration for node controller related features. -->
   NodeController 保存与节点控制器相关的特性的配置。
   </p>
</td>
</tr>
<tr><td><code>ServiceController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#ServiceControllerConfiguration"><code>ServiceControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ServiceControllerConfiguration holds configuration for ServiceController related features. -->
   ServiceControllerConfiguration 保存 ServiceController 相关的特性的配置。
   </p>
</td>
</tr>
<tr><td><code>NodeStatusUpdateFrequency</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- NodeStatusUpdateFrequency is the frequency at which the controller updates nodes' status -->
   NodeStatusUpdateFrequency 是控制器更新节点状态的频率。
   </p>
</td>
</tr>
<tr><td><code>Webhook</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
</td>
<td>
   <p>
   <!-- Webhook is the configuration for cloud-controller-manager hosted webhooks -->
   Webhook 是云控制器管理器托管的 webhook 的配置。
   </p>
</td>
</tr>
</tbody>
</table>

## `CloudProviderConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudProviderConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeCloudSharedConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration)


<p>
<!-- CloudProviderConfiguration contains basically elements about cloud provider. -->
CloudProviderConfiguration 包含有关云提供商的一些基本元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>Name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- Name is the provider for cloud services. -->
   Name 是云服务的提供商。
   </p>
</td>
</tr>
<tr><td><code>CloudConfigFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- cloudConfigFile is the path to the cloud provider configuration file. -->
   cloudConfigFile 是云提供程序配置文件的路径。
   </p>
</td>
</tr>
</tbody>
</table>

## `KubeCloudSharedConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- 
KubeCloudSharedConfiguration contains elements shared by both kube-controller manager
and cloud-controller manager, but not genericconfig. 
-->
KubeCloudSharedConfiguration 包含 kube-controller 管理器和云控制器管理器共享的元素，但不包含通用配置。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>CloudProvider</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudProviderConfiguration"><code>CloudProviderConfiguration</code></a>
</td>
<td>
   <p>
   <!-- CloudProviderConfiguration holds configuration for CloudProvider related features. -->
   CloudProviderConfiguration 保存 CloudProvider 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>ExternalCloudVolumePlugin</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   externalCloudVolumePlugin specifies the plugin to use when cloudProvider is &quot;external&quot;.
   It is currently used by the in repo cloud providers to handle node and volume control in the KCM.
   -->
   当 cloudProvider 为 &quot;external&quot; 时，externalCloudVolumePlugin 用于指定插件。
   它目前被仓库内的云驱动用于处理 KCM 中的节点和卷控制。
   </p>
</td>
</tr>
<tr><td><code>UseServiceAccountCredentials</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- 
   useServiceAccountCredentials indicates whether controllers should be run with
   individual service account credentials. 
   -->
   useServiceAccountCredentials 指出控制器是否应使用独立的服务帐户凭据运行。
   </p>
</td>
</tr>
<tr><td><code>AllowUntaggedCloud</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- run with untagged cloud instances -->
   使用未标记的云实例运行。
   </p>
</td>
</tr>
<tr><td><code>RouteReconciliationPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- routeReconciliationPeriod is the period for reconciling routes created for Nodes by cloud provider. -->
   routeReconciliationPeriod 是云驱动商为节点创建的路由的调和周期。
   </p>
</td>
</tr>
<tr><td><code>NodeMonitorPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- nodeMonitorPeriod is the period for syncing NodeStatus in NodeController. -->
   nodeMonitorPeriod 是 NodeController 同步 NodeStatus 的周期。
   </p>
</td>
</tr>
<tr><td><code>ClusterName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- clusterName is the instance prefix for the cluster. -->
   clusterName 是集群的实例前缀。
   </p>
</td>
</tr>
<tr><td><code>ClusterCIDR</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- clusterCIDR is CIDR Range for Pods in cluster. -->
   clusterCIDR 是集群中 Pod CIDR 的范围。
   </p>
</td>
</tr>
<tr><td><code>AllocateNodeCIDRs</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- 
   AllocateNodeCIDRs enables CIDRs for Pods to be allocated and, 
   if ConfigureCloudRoutes is true, to be set on the cloud provider. 
   -->
   AllocateNodeCIDRs 允许为 Pod 分配 CIDR，
   如果 ConfigureCloudRoutes 为 true，则允许在对云驱动商设置 CIDR。
   </p>
</td>
</tr>
<tr><td><code>CIDRAllocatorType</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- CIDRAllocatorType determines what kind of pod CIDR allocator will be used. -->
   CIDRAllocatorType 决定使用哪种类型的 Pod CIDR 分配器。
   </p>
</td>
</tr>
<tr><td><code>ConfigureCloudRoutes</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- 
   configureCloudRoutes enables CIDRs allocated with allocateNodeCIDRs
   to be configured on the cloud provider. 
   -->
   configureCloudRoutes 使通过 allocateNodeCIDRs 分配的 CIDR 能够在云提供商上配置。
   </p>
</td>
</tr>
<tr><td><code>NodeSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   nodeSyncPeriod is the period for syncing nodes from cloudprovider. 
   Longer periods will result in fewer calls to cloud provider, 
   but may delay addition of new nodes to cluster. 
   -->
   nodeSyncPeriod 从云平台同步节点的周期。
   周期较长时，调用云平台的次数减少， 
   但向集群添加新节点可能会延迟。
   </p>
</td>
</tr>
</tbody>
</table>

## `WebhookConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-WebhookConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)


<p>
<!-- WebhookConfiguration contains configuration related to cloud-controller-manager hosted webhooks -->
WebhookConfiguration 包含与云控制器管理器托管的 webhook 相关的配置。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>Webhooks</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!-- 
   Webhooks is the list of webhooks to enable or disable
   '*' means &quot;all enabled by default webhooks&quot;
   'foo' means &quot;enable 'foo'&quot;
   '-foo' means &quot;disable 'foo'&quot;
   first item for a particular name wins
   -->
   Webhooks 是要启用或者禁用的 Webhook 的列表。
   '*' 表示&quot;所有默认启用的 webhook &quot;，
   'foo' 表示&quot;启用 'foo'&quot;，
   '-foo' 表示&quot;禁用 'foo'&quot;，
   特定名称的首个项有效。
   </p>
</td>
</tr>
</tbody>
</table>
  
  

## `LeaderMigrationConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)


<p>
<!-- LeaderMigrationConfiguration provides versioned configuration for all migrating leader locks. -->
LeaderMigrationConfiguration 为所有迁移中的领导者锁提供了版本化配置。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>controllermanager.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>LeaderMigrationConfiguration</code></td></tr>
    
  
<tr><td><code>leaderName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- LeaderName is the name of the leader election resource that protects the migration
E.g. 1-20-KCM-to-1-21-CCM -->
   LeaderName 是保护迁移的领导者选举资源的名称，例如：1-20-KCM-to-1-21-CCM。
   </p>
</td>
</tr>
<tr><td><code>resourceLock</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   ResourceLock indicates the resource object type that will be used to lock
   Should be &quot;leases&quot; or &quot;endpoints&quot; 
   -->
   ResourceLock 表示将被用于加锁的资源对象类型，
   应该是 &quot;leases&quot; 或者是 &quot;endpoints&quot;。
   </p>
</td>
</tr>
<tr><td><code>controllerLeaders</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-ControllerLeaderConfiguration"><code>[]ControllerLeaderConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ControllerLeaders contains a list of migrating leader lock configurations -->
   ControllerLeaders 包含迁移领导者锁配置列表。
   </p>
</td>
</tr>
</tbody>
</table>

## `ControllerLeaderConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-ControllerLeaderConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [LeaderMigrationConfiguration](#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)


<p>
<!-- ControllerLeaderConfiguration provides the configuration for a migrating leader lock. -->
ControllerLeaderConfiguration 提供迁移中领导者锁的配置。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- Name is the name of the controller being migrated
   E.g. service-controller, route-controller, cloud-node-controller, etc 
   -->
   Name 是正被迁移的控制器的名称，例如：service-controller、route-controller、cloud-node-controller 等等
   </p>
</td>
</tr>
<tr><td><code>component</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   Component is the name of the component in which the controller should be running.
   E.g. kube-controller-manager, cloud-controller-manager, etc
   Or '*' meaning the controller can be run under any component that participates in the migration 
   -->
   Component 是控制器运行所处的组件的名称。
   例如，kube-controller-manager、cloud-controller-manager 等。
   或者 “*” 表示控制器可以在任何正在参与迁移的组件中运行。
   </p>
</td>
</tr>
</tbody>
</table>

## `GenericControllerManagerConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- GenericControllerManagerConfiguration holds configuration for a generic controller-manager. -->
GenericControllerManagerConfiguration 保存通用控制器管理器的配置。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>Port</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- port is the port that the controller-manager's http service runs on. -->
   port 是控制器管理器运行 HTTP 服务运行的端口。
   </p>
</td>
</tr>
<tr><td><code>Address</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- address is the IP address to serve on (set to 0.0.0.0 for all interfaces). -->
   address 是提供服务所用的 IP 地址（所有接口设置为 0.0.0.0）。
   </p>
</td>
</tr>
<tr><td><code>MinResyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   minResyncPeriod is the resync period in reflectors; 
   will be random between minResyncPeriod and 2*minResyncPeriod. 
   -->
   minResyncPeriod 是反射器的重新同步周期；大小是在 minResyncPeriod 和 2*minResyncPeriod 范围内的随机数。
   </p>
</td>
</tr>
<tr><td><code>ClientConnection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   <p>
   <!-- 
   ClientConnection specifies the kubeconfig file and client connection
   settings for the proxy server to use when communicating with the apiserver. 
   -->
   ClientConnection 指定代理服务器在与 API 服务器通信时使用的 kubeconfig 文件和客户端连接设置。
   </p>
</td>
</tr>
<tr><td><code>ControllerStartInterval</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- How long to wait between starting controller managers -->
   两次启动控制器管理器之间的间隔时间。
   </p>
</td>
</tr>
<tr><td><code>LeaderElection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#LeaderElectionConfiguration"><code>LeaderElectionConfiguration</code></a>
</td>
<td>
   <p>
   <!-- leaderElection defines the configuration of leader election client. -->
   leaderElection 定义领导者选举客户端的配置。
   </p>
</td>
</tr>
<tr><td><code>Controllers</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!-- 
   Controllers is the list of controllers to enable or disable
   '*' means &quot;all enabled by default controllers&quot;
   'foo' means &quot;enable 'foo'&quot;
   '-foo' means &quot;disable 'foo'&quot;
   first item for a particular name wins
   -->
   Controllers 是要启用或者禁用的控制器列表。
   '*' 表示&quot;所有默认启用的控制器&quot;，
   'foo' 表示&quot;启用 'foo'&quot;，
   '-foo' 表示&quot;禁用 'foo'&quot;，
   特定名称的首个项有效。
   </p>
</td>
</tr>
<tr><td><code>Debugging</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<td>
   <p>
   <!-- DebuggingConfiguration holds configuration for Debugging related features. -->
   DebuggingConfiguration 保存调试相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>LeaderMigrationEnabled</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- LeaderMigrationEnabled indicates whether Leader Migration should be enabled for the controller manager. -->
   LeaderMigrationEnabled 指示是否应为控制器管理器启用领导者迁移（Leader Migration）。
   </p>
</td>
</tr>
<tr><td><code>LeaderMigration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration"><code>LeaderMigrationConfiguration</code></a>
</td>
<td>
   <p>
   <!-- LeaderMigration holds the configuration for Leader Migration. -->
   LeaderMigration 保存领导者迁移的配置。
   </p>
</td>
</tr>
</tbody>
</table>
  
  

## `KubeControllerManagerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration}
    


<p>
<!-- KubeControllerManagerConfiguration contains elements describing kube-controller manager. -->
KubeControllerManagerConfiguration 包含描述 kube-controller 管理器的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubecontrollermanager.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeControllerManagerConfiguration</code></td></tr>
    
  
<tr><td><code>Generic</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration"><code>GenericControllerManagerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- Generic holds configuration for a generic controller-manager -->
   Generic 保存通用控制器管理器的配置。
   </p>
</td>
</tr>
<tr><td><code>KubeCloudShared</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration"><code>KubeCloudSharedConfiguration</code></a>
</td>
<td>
   <p>
   <!-- KubeCloudSharedConfiguration holds configuration for shared related features
both in cloud controller manager and kube-controller manager. -->
   KubeCloudSharedConfiguration 保存云控制器管理器和 kube-controller 管理器间共享的相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>AttachDetachController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-AttachDetachControllerConfiguration"><code>AttachDetachControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- AttachDetachControllerConfiguration holds configuration for AttachDetachController related features. -->
   AttachDetachControllerConfiguration 包含 AttachDetachController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>CSRSigningController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration"><code>CSRSigningControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- CSRSigningControllerConfiguration holds configuration for CSRSigningController related features. -->
   CSRSigningControllerConfiguration 包含 CSRSigningController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>DaemonSetController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DaemonSetControllerConfiguration"><code>DaemonSetControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- DaemonSetControllerConfiguration holds configuration for DaemonSetController related features. -->
   DaemonSetControllerConfiguration 包含 DaemonSetController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>DeploymentController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeploymentControllerConfiguration"><code>DeploymentControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- DeploymentControllerConfiguration holds configuration for DeploymentController related features. -->
   DeploymentControllerConfiguration 包含 DeploymentController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>StatefulSetController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-StatefulSetControllerConfiguration"><code>StatefulSetControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- StatefulSetControllerConfiguration holds configuration for StatefulSetController related features. -->
   StatefulSetControllerConfiguration 包含 StatefulSetController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>DeprecatedController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeprecatedControllerConfiguration"><code>DeprecatedControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- DeprecatedControllerConfiguration holds configuration for some deprecated features. -->
   DeprecatedControllerConfiguration 包含一些已弃用的特性的配置。
   </p>
</td>
</tr>
<tr><td><code>EndpointController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointControllerConfiguration"><code>EndpointControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- EndpointControllerConfiguration holds configuration for EndpointController related features. -->
   EndpointControllerConfiguration 包含 EndpointController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>EndpointSliceController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceControllerConfiguration"><code>EndpointSliceControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- EndpointSliceControllerConfiguration holds configuration for EndpointSliceController related features. -->
   EndpointSliceControllerConfiguration 包含 EndpointSliceController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>EndpointSliceMirroringController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceMirroringControllerConfiguration"><code>EndpointSliceMirroringControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- EndpointSliceMirroringControllerConfiguration holds configuration for EndpointSliceMirroringController related 
   features. -->
   EndpointSliceMirroringControllerConfiguration 包含 EndpointSliceMirroringController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>EphemeralVolumeController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EphemeralVolumeControllerConfiguration"><code>EphemeralVolumeControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- EphemeralVolumeControllerConfiguration holds configuration for EphemeralVolumeController related features. -->
   EphemeralVolumeControllerConfiguration 包含 EphemeralVolumeController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>GarbageCollectorController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration"><code>GarbageCollectorControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- GarbageCollectorControllerConfiguration holds configuration for GarbageCollectorController related features. -->
   GarbageCollectorControllerConfiguration 包含 GarbageCollectorController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>HPAController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-HPAControllerConfiguration"><code>HPAControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- HPAControllerConfiguration holds configuration for HPAController related features. -->
   HPAControllerConfiguration 包含 HPAController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>JobController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-JobControllerConfiguration"><code>JobControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- JobControllerConfiguration holds configuration for JobController related features. -->
   HPAControllerConfiguration 包含 JobController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>CronJobController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CronJobControllerConfiguration"><code>CronJobControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- CronJobControllerConfiguration holds configuration for CronJobController related features. -->
   CronJobControllerConfiguration 包含 CronJobController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>LegacySATokenCleaner</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-LegacySATokenCleanerConfiguration"><code>LegacySATokenCleanerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- LegacySATokenCleanerConfiguration holds configuration for LegacySATokenCleaner related features. -->
   LegacySATokenCleanerConfiguration 包含 LegacySATokenCleaner 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>NamespaceController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NamespaceControllerConfiguration"><code>NamespaceControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- NamespaceControllerConfiguration holds configuration for NamespaceController related features. -->
   NamespaceControllerConfiguration 包含 NamespaceController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>NodeIPAMController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NodeIPAMControllerConfiguration"><code>NodeIPAMControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- NodeIPAMControllerConfiguration holds configuration for NodeIPAMController related features. -->
   NodeIPAMControllerConfiguration 包含 NodeIPAMController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>NodeLifecycleController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NodeLifecycleControllerConfiguration"><code>NodeLifecycleControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- NodeLifecycleControllerConfiguration holds configuration for NodeLifecycleController related features. -->
   NodeLifecycleControllerConfiguration 包含 NodeLifecycleController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>PersistentVolumeBinderController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration"><code>PersistentVolumeBinderControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- PersistentVolumeBinderControllerConfiguration holds configuration for PersistentVolumeBinderController related features. -->
   PersistentVolumeBinderControllerConfiguration 包含 PersistentVolumeBinderController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>PodGCController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PodGCControllerConfiguration"><code>PodGCControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- PodGCControllerConfiguration holds configuration for PodGCController related features. -->
   PodGCControllerConfiguration 包含 PodGCController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>ReplicaSetController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicaSetControllerConfiguration"><code>ReplicaSetControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ReplicaSetControllerConfiguration holds configuration for ReplicaSet related features. -->
   ReplicaSetControllerConfiguration 包含 ReplicaSetController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>ReplicationController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicationControllerConfiguration"><code>ReplicationControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ReplicationControllerConfiguration holds configuration for ReplicationController related features. -->
   ReplicationControllerConfiguration 包含 ReplicationController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>ResourceQuotaController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ResourceQuotaControllerConfiguration"><code>ResourceQuotaControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ResourceQuotaControllerConfiguration holds configuration for ResourceQuotaController related features. -->
   ResourceQuotaControllerConfiguration 包含 ResourceQuotaController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>SAController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-SAControllerConfiguration"><code>SAControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- SAControllerConfiguration holds configuration for ServiceAccountController related features. -->
   SAControllerConfiguration 包含 ServiceAccountController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>ServiceController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#ServiceControllerConfiguration"><code>ServiceControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ServiceControllerConfiguration holds configuration for ServiceController related features. -->
   ServiceControllerConfiguration 包含 ServiceController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>TTLAfterFinishedController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-TTLAfterFinishedControllerConfiguration"><code>TTLAfterFinishedControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- TTLAfterFinishedControllerConfiguration holds configuration for TTLAfterFinishedController related features. -->
   TTLAfterFinishedControllerConfiguration 包含 TTLAfterFinishedController 相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>ValidatingAdmissionPolicyStatusController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ValidatingAdmissionPolicyStatusControllerConfiguration"><code>ValidatingAdmissionPolicyStatusControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ValidatingAdmissionPolicyStatusControllerConfiguration holds configuration for ValidatingAdmissionPolicyStatusController related features. -->
   ValidatingAdmissionPolicyStatusControllerConfiguration 包含 ValidatingAdmissionPolicyStatusController 相关特性的配置。
   </p>
</td>
</tr>
</tbody>
</table>

## `AttachDetachControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-AttachDetachControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- AttachDetachControllerConfiguration contains elements describing AttachDetachController. -->
AttachDetachControllerConfiguration 包含描述 AttachDetachController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>DisableAttachDetachReconcilerSync</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- 
   Reconciler runs a periodic loop to reconcile the desired state of the with
   the actual state of the world by triggering attach detach operations.
   This flag enables or disables reconcile.  Is false by default, and thus enabled. 
   -->
   Reconciler 运行一个周期性循环，通过触发 attach/detach 操作来协调期望状态与实际状态。 
   此标志启用或禁用调和操作。默认为 false，即被启用的。
   </p>
</td>
</tr>
<tr><td><code>ReconcilerSyncLoopPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   ReconcilerSyncLoopPeriod is the amount of time the reconciler sync states loop
   wait between successive executions. Is set to 60 sec by default. 
   -->
   ReconcilerSyncLoopPeriod 是调和器在连续执行同步状态的循环间，所等待的时间量。
   默认为 60 秒。
   </p>
</td>
</tr>
<tr><td><code>disableForceDetachOnTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!--
   DisableForceDetachOnTimeout disables force detach when the maximum unmount
   time is exceeded. Is false by default, and thus force detach on unmount is
   enabled.
   -->
   当超过最大卸载时间时，DisableForceDetachOnTimeout 将禁用强制分离。
   默认情况下为 false，因此启用卸载时强制分离。
   </p>
</td>
</tr>
</tbody>
</table>

## `CSRSigningConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [CSRSigningControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration)


<p>
<!-- CSRSigningConfiguration holds information about a particular CSR signer -->
CSRSigningConfiguration 保存有关特定 CSR 签名者的信息。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>CertFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- certFile is the filename containing a PEM-encoded X509 CA certificate used to issue certificates -->
   certFile 是包含 PEM 编码的 X509 CA 证书的文件名，用于颁发证书。
   </p>
</td>
</tr>
<tr><td><code>KeyFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- keyFile is the filename containing a PEM-encoded RSA or ECDSA private key used to issue certificates -->
   keyFile 是包含 PEM 编码的 RSA 或 ECDSA 私钥的文件名，用于颁发证书。
   </p>
</td>
</tr>
</tbody>
</table>

## `CSRSigningControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**


- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- CSRSigningControllerConfiguration contains elements describing CSRSigningController. -->
CSRSigningControllerConfiguration 包含描述 CSRSigningController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ClusterSigningCertFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   clusterSigningCertFile is the filename containing a PEM-encoded
   X509 CA certificate used to issue cluster-scoped certificates 
   -->
   clusterSigningCertFile 是包含 PEM 编码的 X509 CA 证书的文件名，该证书用于颁发集群范围的证书。
   </p>
</td>
</tr>
<tr><td><code>ClusterSigningKeyFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   clusterSigningCertFile is the filename containing a PEM-encoded
   RSA or ECDSA private key used to issue cluster-scoped certificates 
   -->
   clusterSigningCertFile 是包含 PEM 编码的 RSA 或 ECDSA 私钥的文件名，用于颁发集群范围的证书。
   </p>
</td>
</tr>
<tr><td><code>KubeletServingSignerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>
   <!-- kubeletServingSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kubelet-serving signer -->
   kubeletServingSignerConfiguration 保存用于为 kubernetes.io/kubelet-serving 签名者颁发证书的证书和密钥。
   </p>
</td>
</tr>
<tr><td><code>KubeletClientSignerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>
   <!-- kubeletClientSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kube-apiserver-client-kubelet -->
   kubeletClientSignerConfiguration 保存用于为 kubernetes.io/kube-apiserver-client-kubelet 颁发证书的证书和密钥。
   
   </p>
</td>
</tr>
<tr><td><code>KubeAPIServerClientSignerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>
   <!-- kubeAPIServerClientSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kube-apiserver-client -->
   kubeAPIServerClientSignerConfiguration 保存用于为 kubernetes.io/kube-apiserver-client 颁发证书的证书和密钥。
   </p>
</td>
</tr>
<tr><td><code>LegacyUnknownSignerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>
   <!-- legacyUnknownSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/legacy-unknown -->
   legacyUnknownSignerConfiguration 保存用于颁发 kubernetes.io/legacy-unknown 证书的证书和密钥。
   </p>
</td>
</tr>
<tr><td><code>ClusterSigningDuration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   clusterSigningDuration is the max length of duration signed certificates will be given.
   Individual CSRs may request shorter certs by setting spec.expirationSeconds. 
   -->
   clusterSigningDuration 是签名证书的最长持续时间。 
   单个 CSRs 可以通过设置 spec.expirationSeconds 来请求有效期更短的证书。
   </p>
</td>
</tr>
</tbody>
</table>

## `CronJobControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CronJobControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- CronJobControllerConfiguration contains elements describing CrongJob2Controller. -->
CronJobControllerConfiguration 包含描述 CrongJob2Controller 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentCronJobSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentCronJobSyncs is the number of job objects that are
   allowed to sync concurrently. Larger number = more responsive jobs,
   but more CPU (and network) load. 
   -->
   concurrentCronJobSyncs 是允许并发同步的 Job 对象的数量。
   数量越大意味着 Job 响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `DaemonSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DaemonSetControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- DaemonSetControllerConfiguration contains elements describing DaemonSetController. -->
DaemonSetControllerConfiguration 包含描述 DaemonSetController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentDaemonSetSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentDaemonSetSyncs is the number of daemonset objects that are
   allowed to sync concurrently. Larger number = more responsive daemonset,
   but more CPU (and network) load. 
   -->
   concurrentDaemonSetSyncs 是允许并发同步的 DaemonSet 对象的数量。
   数目越大意味着 DaemonSet 响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `DeploymentControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DeploymentControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- DeploymentControllerConfiguration contains elements describing DeploymentController. -->
DeploymentControllerConfiguration 包含描述 DeploymentController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentDeploymentSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentDeploymentSyncs is the number of deployment objects that are
   allowed to sync concurrently. Larger number = more responsive deployments,
   but more CPU (and network) load. 
   -->
   concurrentDeploymentSyncs 是允许并发同步的 Deployment 对象的数量。
   数量越大意味着 Deployment 响应更越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `DeprecatedControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DeprecatedControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- DeprecatedControllerConfiguration contains elements be deprecated. -->
DeprecatedControllerConfiguration 包含被弃用的元素。
</p>




## `EndpointControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- EndpointControllerConfiguration contains elements describing EndpointController. -->
EndpointControllerConfiguration 包含描述 EndpointController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentEndpointSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentEndpointSyncs is the number of endpoint syncing operations
   that will be done concurrently. Larger number = faster endpoint updating,
   but more CPU (and network) load. 
   -->
   concurrentEndpointSyncs 是将并发执行的 Endpoints 同步操作的数量。
   数字越大意味着 Endpoints 更新越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
<tr><td><code>EndpointUpdatesBatchPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   EndpointUpdatesBatchPeriod describes the length of endpoint updates batching period.
   Processing of pod changes will be delayed by this duration to join them with potential
   upcoming updates and reduce the overall number of endpoints updates. 
   -->
   EndpointUpdatesBatchPeriod 描述批量更新 Endpoints 的周期长度。
   Pod 更改的处理将被延迟相同的时长，以便将它们与即将到来的更新连接起来，并减少 Endpoints 更新的总数。
   </p>
</td>
</tr>
</tbody>
</table>

## `EndpointSliceControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- EndpointSliceControllerConfiguration contains elements describing EndpointSliceController. -->
EndpointSliceControllerConfiguration 包含描述 EndpointSliceController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentServiceEndpointSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentServiceEndpointSyncs is the number of service endpoint syncing
   operations that will be done concurrently. Larger number = faster
   endpoint slice updating, but more CPU (and network) load. 
   -->
   concurrentServiceEndpointSyncs 是将并发完成的服务端点同步操作的数量。
   数字越大意味着 EndpointSlice 更新越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
<tr><td><code>MaxEndpointsPerSlice</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   maxEndpointsPerSlice is the maximum number of endpoints that will be
   added to an EndpointSlice. More endpoints per slice will result in fewer
   and larger endpoint slices, but larger resources. 
   -->
   maxEndpointsPerSlice 是将添加到 EndpointSlice 的最大端点数。
   每个切片的端点越多，端点切片就会更少、更大，但资源消耗就会更多。
   </p>
</td>
</tr>
<tr><td><code>EndpointUpdatesBatchPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   EndpointUpdatesBatchPeriod describes the length of endpoint updates batching period.
   Processing of pod changes will be delayed by this duration to join them with potential
   upcoming updates and reduce the overall number of endpoints updates. 
   -->
   EndpointUpdatesBatchPeriod 描述批量更新 Endpoints 的周期长度。
   Pod 更改的处理将被延迟相同的时长，以便将它们与即将到来的更新连接起来，并减少 Endpoints 更新的总数。
   </p>
</td>
</tr>
</tbody>
</table>

## `EndpointSliceMirroringControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceMirroringControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- EndpointSliceMirroringControllerConfiguration contains elements describing EndpointSliceMirroringController. -->
EndpointSliceMirroringControllerConfiguration 包含描述 EndpointSliceMirroringController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>MirroringConcurrentServiceEndpointSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   mirroringConcurrentServiceEndpointSyncs is the number of service endpoint
   syncing operations that will be done concurrently. Larger number = faster
   endpoint slice updating, but more CPU (and network) load. 
   -->
   mirroringConcurrentServiceEndpointSyncs 是将并发完成的服务端点同步操作的数量。
   数字越大意味着 EndpointSlice 更新越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
<tr><td><code>MirroringMaxEndpointsPerSubset</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- mirroringMaxEndpointsPerSubset is the maximum number of endpoints that
will be mirrored to an EndpointSlice for an EndpointSubset. -->
   mirroringMaxEndpointsPerSubset 是把 EndpointSubset 映射到 EndpointSlice 的端点数上限。
   </p>
</td>
</tr>
<tr><td><code>MirroringEndpointUpdatesBatchPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   mirroringEndpointUpdatesBatchPeriod can be used to batch EndpointSlice
   updates. All updates triggered by EndpointSlice changes will be delayed
   by up to 'mirroringEndpointUpdatesBatchPeriod'. If other addresses in the
   same Endpoints resource change in that period, they will be batched to a
   single EndpointSlice update. Default 0 value means that each Endpoints
   update triggers an EndpointSlice update. 
   -->
   mirroringEndpointUpdatesBatchPeriod 可用于批量更新 EndpointSlice。
   所有由 EndpointSlice 更改触发的更新可能被延迟，延迟的时间长度上限为 “mirroringEndpointUpdatesBatchPeriod”。
   如果同一 Endpoints 资源中的其他地址在此期间发生变化，它们将被合并到同一个 EndpointSlice 更新中以实现批处理。
   默认值 0 表示 Endpoints 的每次更新都会触发一次 EndpointSlice 更新。
   </p>
</td>
</tr>
</tbody>
</table>

## `EphemeralVolumeControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EphemeralVolumeControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- EphemeralVolumeControllerConfiguration contains elements describing EphemeralVolumeController. -->
EphemeralVolumeControllerConfiguration 包含描述 EphemeralVolumeController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentEphemeralVolumeSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   ConcurrentEphemeralVolumeSyncseSyncs is the number of ephemeral volume syncing operations
   that will be done concurrently. Larger number = faster ephemeral volume updating,
   but more CPU (and network) load. 
   -->
   ConcurrentEphemeralVolumeSyncseSyncs 是并发执行的临时卷同步操作数量。
   数字越大意味着临时卷更新越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `GarbageCollectorControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- GarbageCollectorControllerConfiguration contains elements describing GarbageCollectorController. -->
GarbageCollectorControllerConfiguration 包含描述 GarbageCollectorController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>EnableGarbageCollector</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- 
   enables the generic garbage collector. MUST be synced with the
   corresponding flag of the kube-apiserver. WARNING: the generic garbage
   collector is an alpha feature. 
   -->
   启用通用垃圾收集器。必须与 kube-apiserver 的相应标志同步。
   警告：通用垃圾收集器是一个 Alpha 特性。
   </p>
</td>
</tr>
<tr><td><code>ConcurrentGCSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- concurrentGCSyncs is the number of garbage collector workers that are allowed to sync concurrently. -->
   concurrentGCSyncs 是允许垃圾收集器并发同步的工作线程的数量。
   </p>
</td>
</tr>
<tr><td><code>GCIgnoredResources</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-GroupResource"><code>[]GroupResource</code></a>
</td>
<td>
   <p>
   <!-- gcIgnoredResources is the list of GroupResources that garbage collection should ignore. -->
   gcIgnoredResources 是垃圾收集应该忽略的 GroupResource 列表。
   </p>
</td>
</tr>
</tbody>
</table>

## `GroupResource`     {#kubecontrollermanager-config-k8s-io-v1alpha1-GroupResource}
    

<!--
**Appears in:**
-->
**出现在：**

- [GarbageCollectorControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration)


<p>
<!-- GroupResource describes an group resource. -->
GroupResource 描述组资源。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>Group</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- group is the group portion of the GroupResource. -->
   group 是 GroupResource 的 group 部分。
   </p>
</td>
</tr>
<tr><td><code>Resource</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- resource is the resource portion of the GroupResource. -->
   resource 是 GroupResource 的 resource 部分。
   </p>
</td>
</tr>
</tbody>
</table>

## `HPAControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-HPAControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- HPAControllerConfiguration contains elements describing HPAController. -->
HPAControllerConfiguration 包含描述 HPAController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentHorizontalPodAutoscalerSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   ConcurrentHorizontalPodAutoscalerSyncs is the number of HPA objects that are allowed to sync concurrently.
   Larger number = more responsive HPA processing, but more CPU (and network) load. 
   -->
   ConcurrentHorizontalPodAutoscalerSyncs 是允许并发同步的 HPA 对象的数量。
   数字越大意味着 HPA 处理响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- HorizontalPodAutoscalerSyncPeriod is the period for syncing the number of pods in horizontal pod autoscaler. -->
   HorizontalPodAutoscalerSyncPeriod 是对 HPA 中 Pod 数量进行同步的周期。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerUpscaleForbiddenWindow</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- HorizontalPodAutoscalerUpscaleForbiddenWindow is a period after which next upscale allowed. -->
   HorizontalPodAutoscalerUpscaleForbiddenWindow 是一个时间段，过了这一时间段才允许下一次扩容
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerDownscaleStabilizationWindow</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   HorizontalPodAutoscalerDowncaleStabilizationWindow is a period for which autoscaler will look
   backwards and not scale down below any recommendation it made during that period. 
   -->
   horizontalpodautoscalerdowncalstabilizationwindow 是一个自动缩放器要回顾的时段长度，
   在所给时段内，自动缩放器不会按照建议执行任何缩容操作。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerDownscaleForbiddenWindow</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- HorizontalPodAutoscalerDownscaleForbiddenWindow is a period after which next downscale allowed. -->
   HorizontalPodAutoscalerDownscaleForbiddenWindow 是一个时间段长度，过了此时间段才允许执行下一此缩容操作。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerTolerance</code> <B><!--[Required]-->[必需]</B><br/>
<code>float64</code>
</td>
<td>
   <p>
   <!-- HorizontalPodAutoscalerTolerance is the tolerance for when resource usage suggests upscaling/downscaling -->
   HorizontalPodAutoscalerTolerance 是当资源用量表明需要扩容/缩容时的容忍度。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerCPUInitializationPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- HorizontalPodAutoscalerCPUInitializationPeriod is the period after pod start when CPU samples might be skipped. -->
   HorizontalPodAutoscalerCPUInitializationPeriod 是 Pod 启动后可以跳过时间段，这段时间内部执行 CPU 采样。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerInitialReadinessDelay</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   HorizontalPodAutoscalerInitialReadinessDelay is period after pod start during which readiness
   changes are treated as readiness being set for the first time. The only effect of this is that
   HPA will disregard CPU samples from unready pods that had last readiness change during that period.
   -->
   HorizontalPodAutoscalerInitialReadinessDelay 是 Pod 启动后的一段时间，
   在此期间，readiness 状态的变更被视为初次设置 readiness 状态。
   这样做的唯一影响是，对于在此期间发生 readiness 状态变化但未准备好的 Pod，HPA 将忽略其 CPU 采样值。
   </p>
</td>
</tr>
</tbody>
</table>

## `JobControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-JobControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- JobControllerConfiguration contains elements describing JobController. -->
JobControllerConfiguration 包含描述 JobController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentJobSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentJobSyncs is the number of job objects that are
   allowed to sync concurrently. Larger number = more responsive jobs,
   but more CPU (and network) load. 
   -->
   concurrentJobSyncs 是允许并发同步的 Job 对象的数量。
   数字越大意味着 Job 响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `LegacySATokenCleanerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-LegacySATokenCleanerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- LegacySATokenCleanerConfiguration contains elements describing LegacySATokenCleaner -->
LegacySATokenCleanerConfiguration 包含描述 LegacySATokenCleaner 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>CleanUpPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   CleanUpPeriod is the period of time since the last usage of an
   auto-generated service account token before it can be deleted. 
   -->
   CleanUpPeriod 是自动生成的服务帐户令牌上次被使用以来的时长，超出此时长的令牌可被清理。
   </p>
</td>
</tr>
</tbody>
</table>

## `NamespaceControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NamespaceControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- NamespaceControllerConfiguration contains elements describing NamespaceController. -->
NamespaceControllerConfiguration 包含描述 NamespaceController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>NamespaceSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- namespaceSyncPeriod is the period for syncing namespace life-cycle updates. -->
   namespaceSyncPeriod 是对名字空间生命周期更新进行同步的周期。
   </p>
</td>
</tr>
<tr><td><code>ConcurrentNamespaceSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- concurrentNamespaceSyncs is the number of namespace objects that are allowed to sync concurrently. -->
   concurrentNamespaceSyncs 是允许并发同步的 Namespace 对象的数量。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeIPAMControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NodeIPAMControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- NodeIPAMControllerConfiguration contains elements describing NodeIpamController. -->
NodeIPAMControllerConfiguration 包含描述 NodeIpamController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ServiceCIDR</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- serviceCIDR is CIDR Range for Services in cluster. -->
   serviceCIDR 为集群中 Service 的 CIDR 范围。
   </p>
</td>
</tr>
<tr><td><code>SecondaryServiceCIDR</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   secondaryServiceCIDR is CIDR Range for Services in cluster. This is used in dual stack clusters. 
   SecondaryServiceCIDR must be of different IP family than ServiceCIDR 
   -->
   SecondaryServiceCIDR 为集群中 Service 的 CIDR 范围。此字段用于双栈集群。
   SecondaryServiceCIDR 和 ServiceCIDR 的 IP 族不能相同。
   </p>
</td>
</tr>
<tr><td><code>NodeCIDRMaskSize</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- NodeCIDRMaskSize is the mask size for node cidr in cluster. -->
   NodeCIDRMaskSize 为集群中节点 CIDR 的掩码大小。
   </p>
</td>
</tr>
<tr><td><code>NodeCIDRMaskSizeIPv4</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- NodeCIDRMaskSizeIPv4 is the mask size for node cidr in dual-stack cluster. -->
   NodeCIDRMaskSizeIPv4 为双栈集群中节点 CIDR 的掩码大小。
   </p>
</td>
</tr>
<tr><td><code>NodeCIDRMaskSizeIPv6</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- NodeCIDRMaskSizeIPv6 is the mask size for node cidr in dual-stack cluster. -->
   NodeCIDRMaskSizeIPv6 为双栈集群中节点 CIDR 的掩码大小。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeLifecycleControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NodeLifecycleControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- NodeLifecycleControllerConfiguration contains elements describing NodeLifecycleController. -->
Nodelifecyclecontrolerconfiguration 包含描述 NodeLifecycleController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>NodeEvictionRate</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
   <p>
   <!-- nodeEvictionRate is the number of nodes per second on which pods are deleted in case of node failure when a zone is healthy -->
   nodeEvictionRate 是在区域健康时，如果节点发生故障，每秒删除 Pod 的节点数。
   </p>
</td>
</tr>
<tr><td><code>SecondaryNodeEvictionRate</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
   <p>
   <!-- secondaryNodeEvictionRate is the number of nodes per second on which pods are deleted in case of node failure when a zone is unhealthy -->
   secondaryNodeEvictionRate 是在区域不健康时，如果节点故障，每秒删除 Pod 的节点数。
   </p>
</td>
</tr>
<tr><td><code>NodeStartupGracePeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   nodeStartupGracePeriod is the amount of time which we allow starting a node to
   be unresponsive before marking it unhealthy. 
   -->
   nodeStartupGracePeriod 是在将节点标记为不健康之前允许启动节点无响应的时长。
   </p>
</td>
</tr>
<tr><td><code>NodeMonitorGracePeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- 
   nodeMontiorGracePeriod is the amount of time which we allow a running node to be
   unresponsive before marking it unhealthy. Must be N times more than kubelet's
   nodeStatusUpdateFrequency, where N means number of retries allowed for kubelet
   to post node status. 
   -->
   nodeMontiorGracePeriod 是在将运行中的节点标记为不健康之前允许其无响应的时长。
   必须是 kubelet 的 nodeStatusUpdateFrequency 的 N 倍，其中 N 表示允许 kubelet 发布节点状态的重试次数。
   </p>
</td>
</tr>
<tr><td><code>PodEvictionTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- podEvictionTimeout is the grace period for deleting pods on failed nodes. -->
   podEvictionTimeout 为删除故障节点上的 Pod 的宽限时间。
   </p>
</td>
</tr>
<tr><td><code>LargeClusterSizeThreshold</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- secondaryNodeEvictionRate is implicitly overridden to 0 for clusters smaller than or equal to largeClusterSizeThreshold -->
   对于规模小于或等于 largeClusterSizeThreshold 的集群，secondaryNodeEvictionRate 会被隐式覆盖，取值为 0。
   </p>
</td>
</tr>
<tr><td><code>UnhealthyZoneThreshold</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
   <p>
   <!-- 
   Zone is treated as unhealthy in nodeEvictionRate and secondaryNodeEvictionRate when at least
   unhealthyZoneThreshold (no less than 3) of Nodes in the zone are NotReady 
   -->
   当区域中至少有 unhealthyZoneThreshold（不少于 3 个）的节点处于 NotReady 状态时，
   nodeEvctionRate 和 secondaryNodeEvictionRate 两个属性的判定逻辑会将区域视为不健康。
   </p>
</td>
</tr>
</tbody>
</table>

## `PersistentVolumeBinderControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- PersistentVolumeBinderControllerConfiguration contains elements describing PersistentVolumeBinderController. -->
PersistentVolumeBinderControllerConfiguration 包含描述 PersistentVolumeBinderController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>PVClaimBinderSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- pvClaimBinderSyncPeriod is the period for syncing persistent volumes and persistent volume claims. -->
   pvClaimBinderSyncPeriod 用于同步 PV 和 PVC 的周期。
   </p>
</td>
</tr>
<tr><td><code>VolumeConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration"><code>VolumeConfiguration</code></a>
</td>
<td>
   <p>
   <!-- volumeConfiguration holds configuration for volume related features. -->
   volumeConfiguration 包含卷相关特性的配置。
   </p>
</td>
</tr>
<tr><td><code>VolumeHostCIDRDenylist</code> <B><!--[Required]-->[必需]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>
   <!-- DEPRECATED: VolumeHostCIDRDenylist is a list of CIDRs that should not be reachable by the
controller from plugins. -->
   已弃用：VolumeHostCIDRDenylist 是一个不能被插件中控制器访问的 CIDR 列表。
   </p>
</td>
</tr>
<tr><td><code>VolumeHostAllowLocalLoopback</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- DEPRECATED: VolumeHostAllowLocalLoopback indicates if local loopback hosts (127.0.0.1, etc)
should be allowed from plugins. -->
   已弃用：VolumeHostAllowLocalLoopback 表示是否应该允许插件使用本地回路主机地址（127.0.0.1 等）。
   </p>
</td>
</tr>
</tbody>
</table>

## `PersistentVolumeRecyclerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeRecyclerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [VolumeConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration)


<p>
<!-- PersistentVolumeRecyclerConfiguration contains elements describing persistent volume plugins. -->
PersistentVolumeRecyclerConfiguration 包含描述持久卷插件的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>MaximumRetry</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- maximumRetry is number of retries the PV recycler will execute on failure to recycle PV. -->
   maximumRetry 是当 PV 回收失败时，PV 回收器重试的次数。
   </p>
</td>
</tr>
<tr><td><code>MinimumTimeoutNFS</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- minimumTimeoutNFS is the minimum ActiveDeadlineSeconds to use for an NFS Recycler pod. -->
   minimumTimeoutNFS 是用于 NFS 回收器的，用于设置 Pod 的最小 ActiveDeadlineSeconds。
   </p>
</td>
</tr>
<tr><td><code>PodTemplateFilePathNFS</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- podTemplateFilePathNFS is the file path to a pod definition used as a template for NFS persistent volume recycling -->
   podTemplateFilePathNFS 是一个 Pod 定义文件的路径，该文件将被用作 NFS PV 卷回收模板。
   </p>
</td>
</tr>
<tr><td><code>IncrementTimeoutNFS</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- incrementTimeoutNFS is the increment of time added per Gi to ActiveDeadlineSeconds for an NFS scrubber pod. -->
   incrementTimeoutNFS 提供给 NFS 清理器 Pod 的设置值，数据卷每增加 1 GiB，
   则需要向 Pod 中的 activeDeadlineSeconds 参数增加这里所给的秒数。
   </p>
</td>
</tr>
<tr><td><code>PodTemplateFilePathHostPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   podTemplateFilePathHostPath is the file path to a pod definition used as a template for
   HostPath persistent volume recycling. This is for development and testing only and
   will not work in a multi-node cluster. 
   -->
   podTemplateFilePathHostPath 是一个 Pod 定义文件的路径，该文件将被作为 HostPath PV 卷回收模板。
   此字段仅用于开发和测试场景，在多节点集群中无法正常工作。
   </p>
</td>
</tr>
<tr><td><code>MinimumTimeoutHostPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   minimumTimeoutHostPath is the minimum ActiveDeadlineSeconds to use for a HostPath Recycler pod.
   This is for development and testing only and will not work in a multi-node cluster. 
   -->
   minimumTimeoutHostPath 是用于 HostPath 回收器 Pod 的 activeDeadlineSeconds 属性值下限。
   此字段仅用于开发和测试场景，在多节点集群中无法正常工作。
   </p>
</td>
</tr>
<tr><td><code>IncrementTimeoutHostPath</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   incrementTimeoutHostPath is the increment of time added per Gi to ActiveDeadlineSeconds
   for a HostPath scrubber pod.  This is for development and testing only and will not work
   in a multi-node cluster.
   -->
   incrementTimeoutHostPath 是提供给 HostPath 清理器 Pod 的配置值，
   HostPath 卷的尺寸每增加 1 GiB，则需要为 Pod 的 activeDeadlineSeconds 属性增加这里所给的秒数。
   回收器 Pod 的 activeDeadlineSeconds 属性值下限。
   </p>
</td>
</tr>
</tbody>
</table>

## `PodGCControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PodGCControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- PodGCControllerConfiguration contains elements describing PodGCController. -->
PodGCControllerConfiguration 包含描述 PodGCController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>TerminatedPodGCThreshold</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   terminatedPodGCThreshold is the number of terminated pods that can exist
   before the terminated pod garbage collector starts deleting terminated pods.
   If &lt;= 0, the terminated pod garbage collector is disabled. 
   -->
   terminatedPodGCThreshold 是提供给回收已终止 Pod 的垃圾收集器的，
   所设置的数字是在垃圾收集器开始删除某 Pod 之前可以存在的、已终止 Pod 的个数。
   如果 &lt;= 0，则禁用已终止的 Pod 垃圾收集器。
   </p>
</td>
</tr>
</tbody>
</table>

## `ReplicaSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicaSetControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- ReplicaSetControllerConfiguration contains elements describing ReplicaSetController. -->
ReplicaSetControllerConfiguration 包含描述 ReplicaSetController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentRSSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentRSSyncs is the number of replica sets that are  allowed to sync
   concurrently. Larger number = more responsive replica  management, but more
   CPU (and network) load. 
   -->
   concurrentRSSyncs 是允许并发同步的 ReplicaSet 的数量。
   数量越大意味着副本管理响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `ReplicationControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicationControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- ReplicationControllerConfiguration contains elements describing ReplicationController. -->
ReplicationControllerConfiguration 包含描述 ReplicationController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentRCSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentRCSyncs is the number of replication controllers that are
   allowed to sync concurrently. Larger number = more responsive replica
   management, but more CPU (and network) load. 
   -->
   concurrentRCSyncs 是允许并发同步的 ReplicationController 数量。
   数量越大意味着副本管理响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `ResourceQuotaControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ResourceQuotaControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- ResourceQuotaControllerConfiguration contains elements describing ResourceQuotaController. -->
ResourceQuotaControllerConfiguration 包含描述 ResourceQuotaController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ResourceQuotaSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- resourceQuotaSyncPeriod is the period for syncing quota usage status in the system. -->
   resourceQuotaSyncPeriod 是系统中 Quota 使用状态的同步周期。
   </p>
</td>
</tr>
<tr><td><code>ConcurrentResourceQuotaSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentResourceQuotaSyncs is the number of resource quotas that are
   allowed to sync concurrently. Larger number = more responsive quota
   management, but more CPU (and network) load. 
   -->
   concurrentResourceQuotaSyncs 是允许并发同步的 ResourcQuota 数目。
   数量越大意味着配额管理响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `SAControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-SAControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- SAControllerConfiguration contains elements describing ServiceAccountController. -->
SAControllerConfiguration 包含描述 ServiceAccountController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ServiceAccountKeyFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- serviceAccountKeyFile is the filename containing a PEM-encoded private RSA key used to sign service account tokens. -->
   serviceAccountKeyFile 是包含 PEM 编码的用于签署服务帐户令牌的 RSA 私钥的文件名。
   </p>
</td>
</tr>
<tr><td><code>ConcurrentSATokenSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- concurrentSATokenSyncs is the number of service account token syncing operations that will be done concurrently. -->
   concurrentSATokenSyncs 是将并发完成的服务帐户令牌同步操作的数量。
   </p>
</td>
</tr>
<tr><td><code>RootCAFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   rootCAFile is the root certificate authority will be included in service
   account's token secret. This must be a valid PEM-encoded CA bundle. 
   -->
   rootCAFile 是根证书颁发机构将被包含在 ServiceAccount 的令牌 Secret 中。
   所提供的数据必须是一个有效的 PEM 编码的 CA 包。
   </p>
</td>
</tr>
</tbody>
</table>

## `StatefulSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-StatefulSetControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- StatefulSetControllerConfiguration contains elements describing StatefulSetController. -->
StatefulSetControllerConfiguration 包含描述 StatefulSetController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentStatefulSetSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   concurrentStatefulSetSyncs is the number of statefulset objects that are
   allowed to sync concurrently. Larger number = more responsive statefulsets,
   but more CPU (and network) load. 
   -->
   concurrentStatefulSetSyncs 是允许并发同步的 StatefulSet 对象的数量。
   数字越大意味着 StatefulSet 响应越快，但 CPU（和网络）负载也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `TTLAfterFinishedControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-TTLAfterFinishedControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- TTLAfterFinishedControllerConfiguration contains elements describing TTLAfterFinishedController. -->
TTLAfterFinishedControllerConfiguration 包含描述 TTLAfterFinishedController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentTTLSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- concurrentTTLSyncs is the number of TTL-after-finished collector workers that are allowed to sync concurrently.-->
   concurrentTTLSyncs 是允许并发同步的 TTL-after-finished 收集器工作线程的数量。
   </p>
</td>
</tr>
</tbody>
</table>

## `ValidatingAdmissionPolicyStatusControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ValidatingAdmissionPolicyStatusControllerConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- ValidatingAdmissionPolicyStatusControllerConfiguration contains elements describing ValidatingAdmissionPolicyStatusController. -->
ValidatingAdmissionPolicyStatusControllerConfiguration 包含描述 ValidatingAdmissionPolicyStatusController 的元素。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentPolicySyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- 
   ConcurrentPolicySyncs is the number of policy objects that are
   allowed to sync concurrently. Larger number = quicker type checking,
   but more CPU (and network) load.
   The default value is 5. 
   -->
   ConcurrentPolicySyncs 是允许并发同步的策略对象的数量。
   数字越大意味着类型检查越快，但 CPU（和网络）负载越高。 
   默认值为 5。
   </p>
</td>
</tr>
</tbody>
</table>

## `VolumeConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration}
    

<!--
**Appears in:**
-->
**出现在：**

- [PersistentVolumeBinderControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration)


<p>
<!-- 
VolumeConfiguration contains <em>all</em> enumerated flags meant to configure all volume
plugins. From this config, the controller-manager binary will create many instances of
volume.VolumeConfig, each containing only the configuration needed for that plugin which
are then passed to the appropriate plugin. The ControllerManager binary is the only part
of the code which knows what plugins are supported and which flags correspond to each plugin. 
-->
VolumeConfiguration 包含<em>所有</em>用于配置各个卷插件的所有参数。
从这个配置中，控制器管理器可执行文件将创建许多 volume.VolumeConfig 的实例。
每个只包含该插件所需的配置，然后将其传递给相应的插件。
控制器管理器可执行文件是代码中唯一知道支持哪些插件以及每个插件对应哪些标志的部分。
</p>


<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
    
  
<tr><td><code>EnableHostPathProvisioning</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- 
   enableHostPathProvisioning enables HostPath PV provisioning when running without a
   cloud provider. This allows testing and development of provisioning features. HostPath
   provisioning is not supported in any way, won't work in a multi-node cluster, and
   should not be used for anything other than testing or development. 
   -->
   enableHostPathProvisioning 在没有云驱动的情况下允许制备 HostPath PV。
   此特性用来测试和开发 PV 卷制备特性。HostPath 配置完全不受支持，在多节点集群中无法工作，
   除了测试或开发之外不应该用于任何其他用途。
   </p>
</td>
</tr>
<tr><td><code>EnableDynamicProvisioning</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- 
   enableDynamicProvisioning enables the provisioning of volumes when running within an environment
   that supports dynamic provisioning. Defaults to true. 
   -->
   enableDynamicProvisioning 在支持动态配置的环境中运行时允许制备新卷。默认为 true。
   </p>
</td>
</tr>
<tr><td><code>PersistentVolumeRecyclerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeRecyclerConfiguration"><code>PersistentVolumeRecyclerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- persistentVolumeRecyclerConfiguration holds configuration for persistent volume plugins. -->
   persistentVolumeRecyclerConfiguration 保存持久卷插件的配置。
   </p>
</td>
</tr>
<tr><td><code>FlexVolumePluginDir</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- 
   volumePluginDir is the full path of the directory in which the flex
   volume plugin should search for additional third party volume plugins 
   -->
   volumePluginDir 是一个完整路径，FlexVolume 插件在这一目录中搜索额外的第三方卷插件。
   </p>
</td>
</tr>
</tbody>
</table>
  