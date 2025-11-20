---
title: kube-controller-manager Configuration (v1alpha1)
content_type: tool-reference
package: kubecontrollermanager.config.k8s.io/v1alpha1
auto_generated: true
---

<!--
## Resource Types
-->
## 資源類型  {#resource-types}


- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)
- [LeaderMigrationConfiguration](#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)
- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)

## `ClientConnectionConfiguration`     {#ClientConnectionConfiguration}

<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<p>
<!--
ClientConnectionConfiguration contains details for constructing a client.
-->
ClientConnectionConfiguration 包含構建客戶端的詳細資訊。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>
  
<tr><td><code>kubeconfig</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
kubeconfig is the path to a KubeConfig file.
-->
kubeconfig 是指向 KubeConfig 檔案的路徑。
</p>
</td>
</tr>
<tr><td><code>acceptContentTypes</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
acceptContentTypes defines the Accept header sent by clients when connecting to a server, overriding the
default value of 'application/json'. This field will control all connections to the server used by a particular
client.
-->
acceptContentTypes 定義了客戶端在連接伺服器時發送的 Accept 請求頭，
覆蓋預設值 application/json。此字段將控制特定客戶端與伺服器之間的所有連接。
</p>
</td>
</tr>
<tr><td><code>contentType</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
contentType is the content type used when sending data to the server from this client.
-->
contentType 是此客戶端向伺服器發送資料時使用的內容類型。
</p>
</td>
</tr>
<tr><td><code>qps</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
<p>
<!--
qps controls the number of queries per second allowed for this connection.
-->
qps 控制此連接每秒允許的查詢數量。
</p>
</td>
</tr>
<tr><td><code>burst</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
<p>
<!--
burst allows extra queries to accumulate when a client is exceeding its rate.
-->
burst 允許在客戶端超出其速率限制時累積額外的查詢。
</p>
</td>
</tr>
</tbody>
</table>

## `DebuggingConfiguration`     {#DebuggingConfiguration}
    
<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<p>
<!--
DebuggingConfiguration holds configuration for Debugging related features.
-->
DebuggingConfiguration 包含與調試相關功能的設定。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>enableProfiling</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
enableProfiling enables profiling via web interface host:port/debug/pprof/
-->
enableProfiling 啓用通過 Web 介面 host:port/debug/pprof/ 進行性能分析（profiling）。
</p>
</td>
</tr>
<tr><td><code>enableContentionProfiling</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
enableContentionProfiling enables block profiling, if
enableProfiling is true.
-->
如果 enableProfiling 爲 true，enableContentionProfiling 啓用阻塞分析（block profiling）。
</p>
</td>
</tr>
</tbody>
</table>

## `LeaderElectionConfiguration`     {#LeaderElectionConfiguration}
    
<!--
**Appears in:**
-->
**出現在：**

- [KubeSchedulerConfiguration](#kubescheduler-config-k8s-io-v1-KubeSchedulerConfiguration)

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)

<p>
<!--
LeaderElectionConfiguration defines the configuration of leader election
clients for components that can run with leader election enabled.
-->
LeaderElectionConfiguration 定義了啓用 leader 選舉的組件的 leader 選舉客戶端設定。
</p>

<table class="table">
<thead><tr><th width="30%"><!--Field-->字段</th><th><!--Description-->描述</th></tr></thead>
<tbody>

<tr><td><code>leaderElect</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
<p>
<!--
leaderElect enables a leader election client to gain leadership
before executing the main loop. Enable this when running replicated
components for high availability.
-->
leaderElect 啓用 leader 選舉客戶端在執行主循環之前獲取領導權。
在爲了高可用性而運行組件副本時啓用此特性。
</p>
</td>
</tr>
<tr><td><code>leaseDuration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
leaseDuration is the duration that non-leader candidates will wait
after observing a leadership renewal until attempting to acquire
leadership of a led but unrenewed leader slot. This is effectively the
maximum duration that a leader can be stopped before it is replaced
by another candidate. This is only applicable if leader election is
enabled.
-->
leaseDuration 是非領導者候選人在觀察到領導權更新後，等待嘗試獲取領導權的時間。
這實際上是領導者在被另一個候選人取代之前可以停止的最大時長。
此設置僅在啓用了 leader 選舉時適用。
</p>
</td>
</tr>
<tr><td><code>renewDeadline</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
renewDeadline is the interval between attempts by the acting master to
renew a leadership slot before it stops leading. This must be less
than or equal to the lease duration. This is only applicable if leader
election is enabled.
-->
renewDeadline 是當前領導者嘗試刷新領導權的時間間隔，如果在此時間內未能成功刷新，
它將停止擔任領導者。此值必須小於或等於 leaseDuration。
此設置僅在啓用了 leader 選舉時適用。
</p>
</td>
</tr>
<tr><td><code>retryPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
<p>
<!--
retryPeriod is the duration the clients should wait between attempting
acquisition and renewal of a leadership. This is only applicable if
leader election is enabled.
-->
retryPeriod 是客戶端在嘗試獲取和刷新領導權之間應等待的時間間隔。
此設置僅在啓用了 leader 選舉時適用。
</p>
</td>
</tr>
<tr><td><code>resourceLock</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
resourceLock indicates the resource object type that will be used to lock
during leader election cycles.
-->
resourceLock 指示在 leader 選舉週期中用於鎖定的資源對象類型。
</p>
</td>
</tr>
<tr><td><code>resourceName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
resourceName indicates the name of resource object that will be used to lock
during leader election cycles.
-->
resourceName 指示在 leader 選舉週期中用於鎖定的資源對象的名稱。
</p>
</td>
</tr>
<tr><td><code>resourceNamespace</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
<p>
<!--
resourceName indicates the namespace of resource object that will be used to lock
during leader election cycles.
-->
resourceNamespace 指示在 leader 選舉週期中用於鎖定的資源對象所在的命名空間。
</p>
</td>
</tr>
</tbody>
</table>

## `NodeControllerConfiguration`     {#NodeControllerConfiguration}

<!--
**Appears in:**
-->
**出現在：**

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
   ConcurrentNodeSyncs 是併發執行以進行節點同步的工作程式的數量。
   </p>
</td>
</tr>
</tbody>
</table>

## `ServiceControllerConfiguration`     {#ServiceControllerConfiguration}

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentServiceSyncs 是允許同時同步的服務數。
   數量越大表示服務管理響應越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `CloudControllerManagerConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration}

<p>
<!-- CloudControllerManagerConfiguration contains elements describing cloud-controller manager.-->
CloudControllerManagerConfiguration 包含描述雲控制器管理器的元素。
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
   Generic 包含通用控制器管理器的設定。
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
   KubeCloudSharedConfiguration 保存被雲控制器管理器和 kube-controller 管理器共享的相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>NodeController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#NodeControllerConfiguration"><code>NodeControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- NodeController holds configuration for node controller related features. -->
   NodeController 保存與節點控制器相關的特性的設定。
   </p>
</td>
</tr>
<tr><td><code>ServiceController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#ServiceControllerConfiguration"><code>ServiceControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ServiceControllerConfiguration holds configuration for ServiceController related features. -->
   ServiceControllerConfiguration 保存 ServiceController 相關的特性的設定。
   </p>
</td>
</tr>
<tr><td><code>NodeStatusUpdateFrequency</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- NodeStatusUpdateFrequency is the frequency at which the controller updates nodes' status -->
   NodeStatusUpdateFrequency 是控制器更新節點狀態的頻率。
   </p>
</td>
</tr>
<tr><td><code>Webhook</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
</td>
<td>
   <p>
   <!-- Webhook is the configuration for cloud-controller-manager hosted webhooks -->
   Webhook 是雲控制器管理器託管的 webhook 的設定。
   </p>
</td>
</tr>
</tbody>
</table>

## `CloudProviderConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudProviderConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [KubeCloudSharedConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration)


<p>
<!-- CloudProviderConfiguration contains basically elements about cloud provider. -->
CloudProviderConfiguration 包含有關雲提供商的一些基本元素。
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
   Name 是雲服務的提供商。
   </p>
</td>
</tr>
<tr><td><code>CloudConfigFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- cloudConfigFile is the path to the cloud provider configuration file. -->
   cloudConfigFile 是雲提供程式設定檔案的路徑。
   </p>
</td>
</tr>
</tbody>
</table>

## `KubeCloudSharedConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- 
KubeCloudSharedConfiguration contains elements shared by both kube-controller manager
and cloud-controller manager, but not genericconfig. 
-->
KubeCloudSharedConfiguration 包含 kube-controller 管理器和雲控制器管理器共享的元素，但不包含通用設定。
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
   CloudProviderConfiguration 保存 CloudProvider 相關特性的設定。
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
   當 cloudProvider 爲 &quot;external&quot; 時，externalCloudVolumePlugin 用於指定插件。
   它目前被倉庫內的雲驅動用於處理 KCM 中的節點和卷控制。
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
   useServiceAccountCredentials 指出控制器是否應使用獨立的服務帳戶憑據運行。
   </p>
</td>
</tr>
<tr><td><code>AllowUntaggedCloud</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- run with untagged cloud instances -->
   使用未標記的雲實例運行。
   </p>
</td>
</tr>
<tr><td><code>RouteReconciliationPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- routeReconciliationPeriod is the period for reconciling routes created for Nodes by cloud provider. -->
   routeReconciliationPeriod 是雲驅動商爲節點創建的路由的調和週期。
   </p>
</td>
</tr>
<tr><td><code>NodeMonitorPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- nodeMonitorPeriod is the period for syncing NodeStatus in NodeController. -->
   nodeMonitorPeriod 是 NodeController 同步 NodeStatus 的週期。
   </p>
</td>
</tr>
<tr><td><code>ClusterName</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- clusterName is the instance prefix for the cluster. -->
   clusterName 是叢集的實例前綴。
   </p>
</td>
</tr>
<tr><td><code>ClusterCIDR</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- clusterCIDR is CIDR Range for Pods in cluster. -->
   clusterCIDR 是叢集中 Pod CIDR 的範圍。
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
   AllocateNodeCIDRs 允許爲 Pod 分配 CIDR，
   如果 ConfigureCloudRoutes 爲 true，則允許在對雲驅動商設置 CIDR。
   </p>
</td>
</tr>
<tr><td><code>CIDRAllocatorType</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- CIDRAllocatorType determines what kind of pod CIDR allocator will be used. -->
   CIDRAllocatorType 決定使用哪種類型的 Pod CIDR 分配器。
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
   configureCloudRoutes 使通過 allocateNodeCIDRs 分配的 CIDR 能夠在雲提供商上設定。
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
   nodeSyncPeriod 從雲平臺同步節點的週期。
   週期較長時，調用雲平臺的次數減少， 
   但向叢集添加新節點可能會延遲。
   </p>
</td>
</tr>
</tbody>
</table>

## `WebhookConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-WebhookConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)


<p>
<!-- WebhookConfiguration contains configuration related to cloud-controller-manager hosted webhooks -->
WebhookConfiguration 包含與雲控制器管理器託管的 webhook 相關的設定。
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
   Webhooks 是要啓用或者禁用的 Webhook 的列表。
   '*' 表示&quot;所有預設啓用的 webhook &quot;，
   'foo' 表示&quot;啓用 'foo'&quot;，
   '-foo' 表示&quot;禁用 'foo'&quot;，
   特定名稱的首個項有效。
   </p>
</td>
</tr>
</tbody>
</table>
  
  

## `LeaderMigrationConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)


<p>
<!-- LeaderMigrationConfiguration provides versioned configuration for all migrating leader locks. -->
LeaderMigrationConfiguration 爲所有遷移中的領導者鎖提供了版本化設定。
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
   LeaderName 是保護遷移的領導者選舉資源的名稱，例如：1-20-KCM-to-1-21-CCM。
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
   ResourceLock 表示將被用於加鎖的資源對象類型，
   應該是 &quot;leases&quot; 或者是 &quot;endpoints&quot;。
   </p>
</td>
</tr>
<tr><td><code>controllerLeaders</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-ControllerLeaderConfiguration"><code>[]ControllerLeaderConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ControllerLeaders contains a list of migrating leader lock configurations -->
   ControllerLeaders 包含遷移領導者鎖設定列表。
   </p>
</td>
</tr>
</tbody>
</table>

## `ControllerLeaderConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-ControllerLeaderConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [LeaderMigrationConfiguration](#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)


<p>
<!-- ControllerLeaderConfiguration provides the configuration for a migrating leader lock. -->
ControllerLeaderConfiguration 提供遷移中領導者鎖的設定。
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
   Name 是正被遷移的控制器的名稱，例如：service-controller、route-controller、cloud-node-controller 等等
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
   Component 是控制器運行所處的組件的名稱。
   例如，kube-controller-manager、cloud-controller-manager 等。
   或者 “*” 表示控制器可以在任何正在參與遷移的組件中運行。
   </p>
</td>
</tr>
</tbody>
</table>

## `GenericControllerManagerConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- GenericControllerManagerConfiguration holds configuration for a generic controller-manager. -->
GenericControllerManagerConfiguration 保存通用控制器管理器的設定。
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
   port 是控制器管理器運行 HTTP 服務運行的端口。
   </p>
</td>
</tr>
<tr><td><code>Address</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- address is the IP address to serve on (set to 0.0.0.0 for all interfaces). -->
   address 是提供服務所用的 IP 地址（所有介面設置爲 0.0.0.0）。
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
   minResyncPeriod 是反射器的重新同步週期；大小是在 minResyncPeriod 和 2*minResyncPeriod 範圍內的隨機數。
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
   ClientConnection 指定代理伺服器在與 API 伺服器通信時使用的 kubeconfig 檔案和客戶端連接設置。
   </p>
</td>
</tr>
<tr><td><code>ControllerStartInterval</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- How long to wait between starting controller managers -->
   兩次啓動控制器管理器之間的間隔時間。
   </p>
</td>
</tr>
<tr><td><code>LeaderElection</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#LeaderElectionConfiguration"><code>LeaderElectionConfiguration</code></a>
</td>
<td>
   <p>
   <!-- leaderElection defines the configuration of leader election client. -->
   leaderElection 定義領導者選舉客戶端的設定。
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
   Controllers 是要啓用或者禁用的控制器列表。
   '*' 表示&quot;所有預設啓用的控制器&quot;，
   'foo' 表示&quot;啓用 'foo'&quot;，
   '-foo' 表示&quot;禁用 'foo'&quot;，
   特定名稱的首個項有效。
   </p>
</td>
</tr>
<tr><td><code>Debugging</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<td>
   <p>
   <!-- DebuggingConfiguration holds configuration for Debugging related features. -->
   DebuggingConfiguration 保存調試相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>LeaderMigrationEnabled</code> <B><!--[Required]-->[必需]</B><br/>
<code>bool</code>
</td>
<td>
   <p>
   <!-- LeaderMigrationEnabled indicates whether Leader Migration should be enabled for the controller manager. -->
   LeaderMigrationEnabled 指示是否應爲控制器管理器啓用領導者遷移（Leader Migration）。
   </p>
</td>
</tr>
<tr><td><code>LeaderMigration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration"><code>LeaderMigrationConfiguration</code></a>
</td>
<td>
   <p>
   <!-- LeaderMigration holds the configuration for Leader Migration. -->
   LeaderMigration 保存領導者遷移的設定。
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
   Generic 保存通用控制器管理器的設定。
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
   KubeCloudSharedConfiguration 保存雲控制器管理器和 kube-controller 管理器間共享的相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>AttachDetachController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-AttachDetachControllerConfiguration"><code>AttachDetachControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- AttachDetachControllerConfiguration holds configuration for AttachDetachController related features. -->
   AttachDetachControllerConfiguration 包含 AttachDetachController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>CSRSigningController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration"><code>CSRSigningControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- CSRSigningControllerConfiguration holds configuration for CSRSigningController related features. -->
   CSRSigningControllerConfiguration 包含 CSRSigningController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>DaemonSetController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DaemonSetControllerConfiguration"><code>DaemonSetControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- DaemonSetControllerConfiguration holds configuration for DaemonSetController related features. -->
   DaemonSetControllerConfiguration 包含 DaemonSetController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>DeploymentController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeploymentControllerConfiguration"><code>DeploymentControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- DeploymentControllerConfiguration holds configuration for DeploymentController related features. -->
   DeploymentControllerConfiguration 包含 DeploymentController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>StatefulSetController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-StatefulSetControllerConfiguration"><code>StatefulSetControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- StatefulSetControllerConfiguration holds configuration for StatefulSetController related features. -->
   StatefulSetControllerConfiguration 包含 StatefulSetController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>DeprecatedController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeprecatedControllerConfiguration"><code>DeprecatedControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- DeprecatedControllerConfiguration holds configuration for some deprecated features. -->
   DeprecatedControllerConfiguration 包含一些已棄用的特性的設定。
   </p>
</td>
</tr>
<tr><td><code>EndpointController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointControllerConfiguration"><code>EndpointControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- EndpointControllerConfiguration holds configuration for EndpointController related features. -->
   EndpointControllerConfiguration 包含 EndpointController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>EndpointSliceController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceControllerConfiguration"><code>EndpointSliceControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- EndpointSliceControllerConfiguration holds configuration for EndpointSliceController related features. -->
   EndpointSliceControllerConfiguration 包含 EndpointSliceController 相關特性的設定。
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
   EndpointSliceMirroringControllerConfiguration 包含 EndpointSliceMirroringController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>EphemeralVolumeController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EphemeralVolumeControllerConfiguration"><code>EphemeralVolumeControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- EphemeralVolumeControllerConfiguration holds configuration for EphemeralVolumeController related features. -->
   EphemeralVolumeControllerConfiguration 包含 EphemeralVolumeController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>GarbageCollectorController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration"><code>GarbageCollectorControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- GarbageCollectorControllerConfiguration holds configuration for GarbageCollectorController related features. -->
   GarbageCollectorControllerConfiguration 包含 GarbageCollectorController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>HPAController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-HPAControllerConfiguration"><code>HPAControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- HPAControllerConfiguration holds configuration for HPAController related features. -->
   HPAControllerConfiguration 包含 HPAController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>JobController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-JobControllerConfiguration"><code>JobControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- JobControllerConfiguration holds configuration for JobController related features. -->
   HPAControllerConfiguration 包含 JobController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>CronJobController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CronJobControllerConfiguration"><code>CronJobControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- CronJobControllerConfiguration holds configuration for CronJobController related features. -->
   CronJobControllerConfiguration 包含 CronJobController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>LegacySATokenCleaner</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-LegacySATokenCleanerConfiguration"><code>LegacySATokenCleanerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- LegacySATokenCleanerConfiguration holds configuration for LegacySATokenCleaner related features. -->
   LegacySATokenCleanerConfiguration 包含 LegacySATokenCleaner 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>NamespaceController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NamespaceControllerConfiguration"><code>NamespaceControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- NamespaceControllerConfiguration holds configuration for NamespaceController related features. -->
   NamespaceControllerConfiguration 包含 NamespaceController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>NodeIPAMController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NodeIPAMControllerConfiguration"><code>NodeIPAMControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- NodeIPAMControllerConfiguration holds configuration for NodeIPAMController related features. -->
   NodeIPAMControllerConfiguration 包含 NodeIPAMController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>NodeLifecycleController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NodeLifecycleControllerConfiguration"><code>NodeLifecycleControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- NodeLifecycleControllerConfiguration holds configuration for NodeLifecycleController related features. -->
   NodeLifecycleControllerConfiguration 包含 NodeLifecycleController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>PersistentVolumeBinderController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration"><code>PersistentVolumeBinderControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- PersistentVolumeBinderControllerConfiguration holds configuration for PersistentVolumeBinderController related features. -->
   PersistentVolumeBinderControllerConfiguration 包含 PersistentVolumeBinderController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>PodGCController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PodGCControllerConfiguration"><code>PodGCControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- PodGCControllerConfiguration holds configuration for PodGCController related features. -->
   PodGCControllerConfiguration 包含 PodGCController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>ReplicaSetController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicaSetControllerConfiguration"><code>ReplicaSetControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ReplicaSetControllerConfiguration holds configuration for ReplicaSet related features. -->
   ReplicaSetControllerConfiguration 包含 ReplicaSetController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>ReplicationController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicationControllerConfiguration"><code>ReplicationControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ReplicationControllerConfiguration holds configuration for ReplicationController related features. -->
   ReplicationControllerConfiguration 包含 ReplicationController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>ResourceQuotaController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ResourceQuotaControllerConfiguration"><code>ResourceQuotaControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ResourceQuotaControllerConfiguration holds configuration for ResourceQuotaController related features. -->
   ResourceQuotaControllerConfiguration 包含 ResourceQuotaController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>SAController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-SAControllerConfiguration"><code>SAControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- SAControllerConfiguration holds configuration for ServiceAccountController related features. -->
   SAControllerConfiguration 包含 ServiceAccountController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>ServiceController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#ServiceControllerConfiguration"><code>ServiceControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ServiceControllerConfiguration holds configuration for ServiceController related features. -->
   ServiceControllerConfiguration 包含 ServiceController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>TTLAfterFinishedController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-TTLAfterFinishedControllerConfiguration"><code>TTLAfterFinishedControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- TTLAfterFinishedControllerConfiguration holds configuration for TTLAfterFinishedController related features. -->
   TTLAfterFinishedControllerConfiguration 包含 TTLAfterFinishedController 相關特性的設定。
   </p>
</td>
</tr>
<tr><td><code>ValidatingAdmissionPolicyStatusController</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ValidatingAdmissionPolicyStatusControllerConfiguration"><code>ValidatingAdmissionPolicyStatusControllerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- ValidatingAdmissionPolicyStatusControllerConfiguration holds configuration for ValidatingAdmissionPolicyStatusController related features. -->
   ValidatingAdmissionPolicyStatusControllerConfiguration 包含 ValidatingAdmissionPolicyStatusController 相關特性的設定。
   </p>
</td>
</tr>
</tbody>
</table>

## `AttachDetachControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-AttachDetachControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   Reconciler 運行一個週期性循環，通過觸發 attach/detach 操作來協調期望狀態與實際狀態。 
   此標誌啓用或禁用調和操作。預設爲 false，即被啓用的。
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
   ReconcilerSyncLoopPeriod 是調和器在連續執行同步狀態的循環間，所等待的時間量。
   預設爲 60 秒。
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
   當超過最大卸載時間時，DisableForceDetachOnTimeout 將禁用強制分離。
   預設情況下爲 false，因此啓用卸載時強制分離。
   </p>
</td>
</tr>
</tbody>
</table>

## `CSRSigningConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [CSRSigningControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration)


<p>
<!-- CSRSigningConfiguration holds information about a particular CSR signer -->
CSRSigningConfiguration 保存有關特定 CSR 簽名者的資訊。
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
   certFile 是包含 PEM 編碼的 X509 CA 證書的檔案名，用於頒發證書。
   </p>
</td>
</tr>
<tr><td><code>KeyFile</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- keyFile is the filename containing a PEM-encoded RSA or ECDSA private key used to issue certificates -->
   keyFile 是包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔案名，用於頒發證書。
   </p>
</td>
</tr>
</tbody>
</table>

## `CSRSigningControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**


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
   clusterSigningCertFile 是包含 PEM 編碼的 X509 CA 證書的檔案名，該證書用於頒發叢集範圍的證書。
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
   clusterSigningCertFile 是包含 PEM 編碼的 RSA 或 ECDSA 私鑰的檔案名，用於頒發叢集範圍的證書。
   </p>
</td>
</tr>
<tr><td><code>KubeletServingSignerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>
   <!-- kubeletServingSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kubelet-serving signer -->
   kubeletServingSignerConfiguration 保存用於爲 kubernetes.io/kubelet-serving 簽名者頒發證書的證書和密鑰。
   </p>
</td>
</tr>
<tr><td><code>KubeletClientSignerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>
   <!-- kubeletClientSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kube-apiserver-client-kubelet -->
   kubeletClientSignerConfiguration 保存用於爲 kubernetes.io/kube-apiserver-client-kubelet 頒發證書的證書和密鑰。
   
   </p>
</td>
</tr>
<tr><td><code>KubeAPIServerClientSignerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>
   <!-- kubeAPIServerClientSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kube-apiserver-client -->
   kubeAPIServerClientSignerConfiguration 保存用於爲 kubernetes.io/kube-apiserver-client 頒發證書的證書和密鑰。
   </p>
</td>
</tr>
<tr><td><code>LegacyUnknownSignerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>
   <!-- legacyUnknownSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/legacy-unknown -->
   legacyUnknownSignerConfiguration 保存用於頒發 kubernetes.io/legacy-unknown 證書的證書和密鑰。
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
   clusterSigningDuration 是簽名證書的最長持續時間。 
   單個 CSRs 可以通過設置 spec.expirationSeconds 來請求有效期更短的證書。
   </p>
</td>
</tr>
</tbody>
</table>

## `CronJobControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CronJobControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentCronJobSyncs 是允許併發同步的 Job 對象的數量。
   數量越大意味着 Job 響應越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `DaemonSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DaemonSetControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentDaemonSetSyncs 是允許併發同步的 DaemonSet 對象的數量。
   數目越大意味着 DaemonSet 響應越快，但 CPU（和網路）負載也越高。
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
   concurrentDeploymentSyncs 是允許併發同步的 Deployment 對象的數量。
   數量越大意味着 Deployment 響應更越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `DeprecatedControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DeprecatedControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>
<!-- DeprecatedControllerConfiguration contains elements be deprecated. -->
DeprecatedControllerConfiguration 包含被棄用的元素。
</p>




## `EndpointControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentEndpointSyncs 是將併發執行的 Endpoints 同步操作的數量。
   數字越大意味着 Endpoints 更新越快，但 CPU（和網路）負載也越高。
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
   EndpointUpdatesBatchPeriod 描述批量更新 Endpoints 的週期長度。
   Pod 更改的處理將被延遲相同的時長，以便將它們與即將到來的更新連接起來，並減少 Endpoints 更新的總數。
   </p>
</td>
</tr>
</tbody>
</table>

## `EndpointSliceControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentServiceEndpointSyncs 是將併發完成的服務端點同步操作的數量。
   數字越大意味着 EndpointSlice 更新越快，但 CPU（和網路）負載也越高。
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
   maxEndpointsPerSlice 是將添加到 EndpointSlice 的最大端點數。
   每個切片的端點越多，端點切片就會更少、更大，但資源消耗就會更多。
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
   EndpointUpdatesBatchPeriod 描述批量更新 Endpoints 的週期長度。
   Pod 更改的處理將被延遲相同的時長，以便將它們與即將到來的更新連接起來，並減少 Endpoints 更新的總數。
   </p>
</td>
</tr>
</tbody>
</table>

## `EndpointSliceMirroringControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceMirroringControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   mirroringConcurrentServiceEndpointSyncs 是將併發完成的服務端點同步操作的數量。
   數字越大意味着 EndpointSlice 更新越快，但 CPU（和網路）負載也越高。
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
   mirroringMaxEndpointsPerSubset 是把 EndpointSubset 映射到 EndpointSlice 的端點數上限。
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
   mirroringEndpointUpdatesBatchPeriod 可用於批量更新 EndpointSlice。
   所有由 EndpointSlice 更改觸發的更新可能被延遲，延遲的時間長度上限爲 “mirroringEndpointUpdatesBatchPeriod”。
   如果同一 Endpoints 資源中的其他地址在此期間發生變化，它們將被合併到同一個 EndpointSlice 更新中以實現批處理。
   預設值 0 表示 Endpoints 的每次更新都會觸發一次 EndpointSlice 更新。
   </p>
</td>
</tr>
</tbody>
</table>

## `EphemeralVolumeControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EphemeralVolumeControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   ConcurrentEphemeralVolumeSyncseSyncs 是併發執行的臨時卷同步操作數量。
   數字越大意味着臨時卷更新越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `GarbageCollectorControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   啓用通用垃圾收集器。必須與 kube-apiserver 的相應標誌同步。
   警告：通用垃圾收集器是一個 Alpha 特性。
   </p>
</td>
</tr>
<tr><td><code>ConcurrentGCSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- concurrentGCSyncs is the number of garbage collector workers that are allowed to sync concurrently. -->
   concurrentGCSyncs 是允許垃圾收集器併發同步的工作執行緒的數量。
   </p>
</td>
</tr>
<tr><td><code>GCIgnoredResources</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-GroupResource"><code>[]GroupResource</code></a>
</td>
<td>
   <p>
   <!-- gcIgnoredResources is the list of GroupResources that garbage collection should ignore. -->
   gcIgnoredResources 是垃圾收集應該忽略的 GroupResource 列表。
   </p>
</td>
</tr>
</tbody>
</table>

## `GroupResource`     {#kubecontrollermanager-config-k8s-io-v1alpha1-GroupResource}
    

<!--
**Appears in:**
-->
**出現在：**

- [GarbageCollectorControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration)


<p>
<!-- GroupResource describes an group resource. -->
GroupResource 描述組資源。
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
**出現在：**

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
   ConcurrentHorizontalPodAutoscalerSyncs 是允許併發同步的 HPA 對象的數量。
   數字越大意味着 HPA 處理響應越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerSyncPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- HorizontalPodAutoscalerSyncPeriod is the period for syncing the number of pods in horizontal pod autoscaler. -->
   HorizontalPodAutoscalerSyncPeriod 是對 HPA 中 Pod 數量進行同步的週期。
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
   horizontalpodautoscalerdowncalstabilizationwindow 是一個自動縮放器要回顧的時段長度，
   在所給時段內，自動縮放器不會按照建議執行任何縮容操作。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerTolerance</code> <B><!--[Required]-->[必需]</B><br/>
<code>float64</code>
</td>
<td>
   <p>
   <!-- HorizontalPodAutoscalerTolerance is the tolerance for when resource usage suggests upscaling/downscaling -->
   HorizontalPodAutoscalerTolerance 是當資源用量表明需要擴容/縮容時的容忍度。
   </p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerCPUInitializationPeriod</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- HorizontalPodAutoscalerCPUInitializationPeriod is the period after pod start when CPU samples might be skipped. -->
   HorizontalPodAutoscalerCPUInitializationPeriod 是 Pod 啓動後可以跳過時間段，這段時間內部執行 CPU 採樣。
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
   HorizontalPodAutoscalerInitialReadinessDelay 是 Pod 啓動後的一段時間，
   在此期間，readiness 狀態的變更被視爲初次設置 readiness 狀態。
   這樣做的唯一影響是，對於在此期間發生 readiness 狀態變化但未準備好的 Pod，HPA 將忽略其 CPU 採樣值。
   </p>
</td>
</tr>
</tbody>
</table>

## `JobControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-JobControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentJobSyncs 是允許併發同步的 Job 對象的數量。
   數字越大意味着 Job 響應越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `LegacySATokenCleanerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-LegacySATokenCleanerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   CleanUpPeriod 是自動生成的服務帳戶令牌上次被使用以來的時長，超出此時長的令牌可被清理。
   </p>
</td>
</tr>
</tbody>
</table>

## `NamespaceControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NamespaceControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   namespaceSyncPeriod 是對名字空間生命週期更新進行同步的週期。
   </p>
</td>
</tr>
<tr><td><code>ConcurrentNamespaceSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- concurrentNamespaceSyncs is the number of namespace objects that are allowed to sync concurrently. -->
   concurrentNamespaceSyncs 是允許併發同步的 Namespace 對象的數量。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeIPAMControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NodeIPAMControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   serviceCIDR 爲叢集中 Service 的 CIDR 範圍。
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
   SecondaryServiceCIDR 爲叢集中 Service 的 CIDR 範圍。此字段用於雙棧叢集。
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
   NodeCIDRMaskSize 爲叢集中節點 CIDR 的掩碼大小。
   </p>
</td>
</tr>
<tr><td><code>NodeCIDRMaskSizeIPv4</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- NodeCIDRMaskSizeIPv4 is the mask size for node cidr in dual-stack cluster. -->
   NodeCIDRMaskSizeIPv4 爲雙棧叢集中節點 CIDR 的掩碼大小。
   </p>
</td>
</tr>
<tr><td><code>NodeCIDRMaskSizeIPv6</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- NodeCIDRMaskSizeIPv6 is the mask size for node cidr in dual-stack cluster. -->
   NodeCIDRMaskSizeIPv6 爲雙棧叢集中節點 CIDR 的掩碼大小。
   </p>
</td>
</tr>
</tbody>
</table>

## `NodeLifecycleControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NodeLifecycleControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   nodeEvictionRate 是在區域健康時，如果節點發生故障，每秒刪除 Pod 的節點數。
   </p>
</td>
</tr>
<tr><td><code>SecondaryNodeEvictionRate</code> <B><!--[Required]-->[必需]</B><br/>
<code>float32</code>
</td>
<td>
   <p>
   <!-- secondaryNodeEvictionRate is the number of nodes per second on which pods are deleted in case of node failure when a zone is unhealthy -->
   secondaryNodeEvictionRate 是在區域不健康時，如果節點故障，每秒刪除 Pod 的節點數。
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
   nodeStartupGracePeriod 是在將節點標記爲不健康之前允許啓動節點無響應的時長。
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
   to post node status. This value should also be greater than the sum of
   HTTP2_PING_TIMEOUT_SECONDS and HTTP2_READ_IDLE_TIMEOUT_SECONDS.
   -->
   nodeMontiorGracePeriod 是在將運行中的節點標記爲不健康之前允許其無響應的時長。
   必須是 kubelet 的 nodeStatusUpdateFrequency 的 N 倍，其中 N 表示允許 kubelet 發佈節點狀態的重試次數。
   此值還應大於 `HTTP2_PING_TIMEOUT_SECONDS` 和 `HTTP2_READ_IDLE_TIMEOUT_SECONDS` 之和。
   </p>
</td>
</tr>
<tr><td><code>PodEvictionTimeout</code> <B><!--[Required]-->[必需]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>
   <!-- podEvictionTimeout is the grace period for deleting pods on failed nodes. -->
   podEvictionTimeout 爲刪除故障節點上的 Pod 的寬限時間。
   </p>
</td>
</tr>
<tr><td><code>LargeClusterSizeThreshold</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- secondaryNodeEvictionRate is implicitly overridden to 0 for clusters smaller than or equal to largeClusterSizeThreshold -->
   對於規模小於或等於 largeClusterSizeThreshold 的叢集，secondaryNodeEvictionRate 會被隱式覆蓋，取值爲 0。
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
   當區域中至少有 unhealthyZoneThreshold（不少於 3 個）的節點處於 NotReady 狀態時，
   nodeEvctionRate 和 secondaryNodeEvictionRate 兩個屬性的判定邏輯會將區域視爲不健康。
   </p>
</td>
</tr>
</tbody>
</table>

## `PersistentVolumeBinderControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   pvClaimBinderSyncPeriod 用於同步 PV 和 PVC 的週期。
   </p>
</td>
</tr>
<tr><td><code>VolumeConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration"><code>VolumeConfiguration</code></a>
</td>
<td>
   <p>
   <!-- volumeConfiguration holds configuration for volume related features. -->
   volumeConfiguration 包含卷相關特性的設定。
   </p>
</td>
</tr>
</tbody>
</table>

## `PersistentVolumeRecyclerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeRecyclerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   maximumRetry 是當 PV 回收失敗時，PV 回收器重試的次數。
   </p>
</td>
</tr>
<tr><td><code>MinimumTimeoutNFS</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- minimumTimeoutNFS is the minimum ActiveDeadlineSeconds to use for an NFS Recycler pod. -->
   minimumTimeoutNFS 是用於 NFS 回收器的，用於設置 Pod 的最小 ActiveDeadlineSeconds。
   </p>
</td>
</tr>
<tr><td><code>PodTemplateFilePathNFS</code> <B><!--[Required]-->[必需]</B><br/>
<code>string</code>
</td>
<td>
   <p>
   <!-- podTemplateFilePathNFS is the file path to a pod definition used as a template for NFS persistent volume recycling -->
   podTemplateFilePathNFS 是一個 Pod 定義檔案的路徑，該檔案將被用作 NFS PV 捲回收模板。
   </p>
</td>
</tr>
<tr><td><code>IncrementTimeoutNFS</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- incrementTimeoutNFS is the increment of time added per Gi to ActiveDeadlineSeconds for an NFS scrubber pod. -->
   incrementTimeoutNFS 提供給 NFS 清理器 Pod 的設置值，資料卷每增加 1 GiB，
   則需要向 Pod 中的 activeDeadlineSeconds 參數增加這裏所給的秒數。
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
   podTemplateFilePathHostPath 是一個 Pod 定義檔案的路徑，該檔案將被作爲 HostPath PV 捲回收模板。
   此字段僅用於開發和測試場景，在多節點叢集中無法正常工作。
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
   minimumTimeoutHostPath 是用於 HostPath 回收器 Pod 的 activeDeadlineSeconds 屬性值下限。
   此字段僅用於開發和測試場景，在多節點叢集中無法正常工作。
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
   incrementTimeoutHostPath 是提供給 HostPath 清理器 Pod 的設定值，
   HostPath 卷的尺寸每增加 1 GiB，則需要爲 Pod 的 activeDeadlineSeconds 屬性增加這裏所給的秒數。
   回收器 Pod 的 activeDeadlineSeconds 屬性值下限。
   </p>
</td>
</tr>
</tbody>
</table>

## `PodGCControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PodGCControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   terminatedPodGCThreshold 是提供給回收已終止 Pod 的垃圾收集器的，
   所設置的數字是在垃圾收集器開始刪除某 Pod 之前可以存在的、已終止 Pod 的個數。
   如果 &lt;= 0，則禁用已終止的 Pod 垃圾收集器。
   </p>
</td>
</tr>
</tbody>
</table>

## `ReplicaSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicaSetControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentRSSyncs 是允許併發同步的 ReplicaSet 的數量。
   數量越大意味着副本管理響應越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `ReplicationControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicationControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentRCSyncs 是允許併發同步的 ReplicationController 數量。
   數量越大意味着副本管理響應越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `ResourceQuotaControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ResourceQuotaControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   resourceQuotaSyncPeriod 是系統中 Quota 使用狀態的同步週期。
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
   concurrentResourceQuotaSyncs 是允許併發同步的 ResourcQuota 數目。
   數量越大意味着配額管理響應越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `SAControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-SAControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   serviceAccountKeyFile 是包含 PEM 編碼的用於簽署服務帳戶令牌的 RSA 私鑰的檔案名。
   </p>
</td>
</tr>
<tr><td><code>ConcurrentSATokenSyncs</code> <B><!--[Required]-->[必需]</B><br/>
<code>int32</code>
</td>
<td>
   <p>
   <!-- concurrentSATokenSyncs is the number of service account token syncing operations that will be done concurrently. -->
   concurrentSATokenSyncs 是將併發完成的服務帳戶令牌同步操作的數量。
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
   rootCAFile 是根證書頒發機構將被包含在 ServiceAccount 的令牌 Secret 中。
   所提供的資料必須是一個有效的 PEM 編碼的 CA 包。
   </p>
</td>
</tr>
</tbody>
</table>

## `StatefulSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-StatefulSetControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentStatefulSetSyncs 是允許併發同步的 StatefulSet 對象的數量。
   數字越大意味着 StatefulSet 響應越快，但 CPU（和網路）負載也越高。
   </p>
</td>
</tr>
</tbody>
</table>

## `TTLAfterFinishedControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-TTLAfterFinishedControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   concurrentTTLSyncs 是允許併發同步的 TTL-after-finished 收集器工作執行緒的數量。
   </p>
</td>
</tr>
</tbody>
</table>

## `ValidatingAdmissionPolicyStatusControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ValidatingAdmissionPolicyStatusControllerConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

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
   ConcurrentPolicySyncs 是允許併發同步的策略對象的數量。
   數字越大意味着類型檢查越快，但 CPU（和網路）負載越高。 
   預設值爲 5。
   </p>
</td>
</tr>
</tbody>
</table>

## `VolumeConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration}
    

<!--
**Appears in:**
-->
**出現在：**

- [PersistentVolumeBinderControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration)


<p>
<!-- 
VolumeConfiguration contains <em>all</em> enumerated flags meant to configure all volume
plugins. From this config, the controller-manager binary will create many instances of
volume.VolumeConfig, each containing only the configuration needed for that plugin which
are then passed to the appropriate plugin. The ControllerManager binary is the only part
of the code which knows what plugins are supported and which flags correspond to each plugin. 
-->
VolumeConfiguration 包含<em>所有</em>用於設定各個卷插件的所有參數。
從這個設定中，控制器管理器可執行檔案將創建許多 volume.VolumeConfig 的實例。
每個只包含該插件所需的設定，然後將其傳遞給相應的插件。
控制器管理器可執行檔案是代碼中唯一知道支持哪些插件以及每個插件對應哪些標誌的部分。
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
   enableHostPathProvisioning 在沒有云驅動的情況下允許製備 HostPath PV。
   此特性用來測試和開發 PV 卷製備特性。HostPath 設定完全不受支持，在多節點叢集中無法工作，
   除了測試或開發之外不應該用於任何其他用途。
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
   enableDynamicProvisioning 在支持動態設定的環境中運行時允許製備新卷。預設爲 true。
   </p>
</td>
</tr>
<tr><td><code>PersistentVolumeRecyclerConfiguration</code> <B><!--[Required]-->[必需]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeRecyclerConfiguration"><code>PersistentVolumeRecyclerConfiguration</code></a>
</td>
<td>
   <p>
   <!-- persistentVolumeRecyclerConfiguration holds configuration for persistent volume plugins. -->
   persistentVolumeRecyclerConfiguration 保存持久卷插件的設定。
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
   volumePluginDir 是一個完整路徑，FlexVolume 插件在這一目錄中搜索額外的第三方卷插件。
   </p>
</td>
</tr>
</tbody>
</table>
