---
title: kube-controller-manager Configuration (v1alpha1)
content_type: tool-reference
package: kubecontrollermanager.config.k8s.io/v1alpha1
auto_generated: true
---


## Resource Types 


- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)
- [LeaderMigrationConfiguration](#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)
- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)
  
    
    

## `NodeControllerConfiguration`     {#NodeControllerConfiguration}
    

**Appears in:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)


<p>NodeControllerConfiguration contains elements describing NodeController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentNodeSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>ConcurrentNodeSyncs is the number of workers
concurrently synchronizing nodes</p>
</td>
</tr>
</tbody>
</table>

## `ServiceControllerConfiguration`     {#ServiceControllerConfiguration}
    

**Appears in:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>ServiceControllerConfiguration contains elements describing ServiceController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentServiceSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentServiceSyncs is the number of services that are
allowed to sync concurrently. Larger number = more responsive service
management, but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>
  

## `CloudControllerManagerConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration}
    


<p>CloudControllerManagerConfiguration contains elements describing cloud-controller manager.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>cloudcontrollermanager.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>CloudControllerManagerConfiguration</code></td></tr>
    
  
<tr><td><code>Generic</code> <B>[Required]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration"><code>GenericControllerManagerConfiguration</code></a>
</td>
<td>
   <p>Generic holds configuration for a generic controller-manager</p>
</td>
</tr>
<tr><td><code>KubeCloudShared</code> <B>[Required]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration"><code>KubeCloudSharedConfiguration</code></a>
</td>
<td>
   <p>KubeCloudSharedConfiguration holds configuration for shared related features
both in cloud controller manager and kube-controller manager.</p>
</td>
</tr>
<tr><td><code>NodeController</code> <B>[Required]</B><br/>
<a href="#NodeControllerConfiguration"><code>NodeControllerConfiguration</code></a>
</td>
<td>
   <p>NodeController holds configuration for node controller
related features.</p>
</td>
</tr>
<tr><td><code>ServiceController</code> <B>[Required]</B><br/>
<a href="#ServiceControllerConfiguration"><code>ServiceControllerConfiguration</code></a>
</td>
<td>
   <p>ServiceControllerConfiguration holds configuration for ServiceController
related features.</p>
</td>
</tr>
<tr><td><code>NodeStatusUpdateFrequency</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>NodeStatusUpdateFrequency is the frequency at which the controller updates nodes' status</p>
</td>
</tr>
<tr><td><code>Webhook</code> <B>[Required]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-WebhookConfiguration"><code>WebhookConfiguration</code></a>
</td>
<td>
   <p>Webhook is the configuration for cloud-controller-manager hosted webhooks</p>
</td>
</tr>
</tbody>
</table>

## `CloudProviderConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudProviderConfiguration}
    

**Appears in:**

- [KubeCloudSharedConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration)


<p>CloudProviderConfiguration contains basically elements about cloud provider.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>Name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the provider for cloud services.</p>
</td>
</tr>
<tr><td><code>CloudConfigFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>cloudConfigFile is the path to the cloud provider configuration file.</p>
</td>
</tr>
</tbody>
</table>

## `KubeCloudSharedConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration}
    

**Appears in:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>KubeCloudSharedConfiguration contains elements shared by both kube-controller manager
and cloud-controller manager, but not genericconfig.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>CloudProvider</code> <B>[Required]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudProviderConfiguration"><code>CloudProviderConfiguration</code></a>
</td>
<td>
   <p>CloudProviderConfiguration holds configuration for CloudProvider related features.</p>
</td>
</tr>
<tr><td><code>ExternalCloudVolumePlugin</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>externalCloudVolumePlugin specifies the plugin to use when cloudProvider is &quot;external&quot;.
It is currently used by the in repo cloud providers to handle node and volume control in the KCM.</p>
</td>
</tr>
<tr><td><code>UseServiceAccountCredentials</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>useServiceAccountCredentials indicates whether controllers should be run with
individual service account credentials.</p>
</td>
</tr>
<tr><td><code>AllowUntaggedCloud</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>run with untagged cloud instances</p>
</td>
</tr>
<tr><td><code>RouteReconciliationPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>routeReconciliationPeriod is the period for reconciling routes created for Nodes by cloud provider..</p>
</td>
</tr>
<tr><td><code>NodeMonitorPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>nodeMonitorPeriod is the period for syncing NodeStatus in NodeController.</p>
</td>
</tr>
<tr><td><code>ClusterName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>clusterName is the instance prefix for the cluster.</p>
</td>
</tr>
<tr><td><code>ClusterCIDR</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>clusterCIDR is CIDR Range for Pods in cluster.</p>
</td>
</tr>
<tr><td><code>AllocateNodeCIDRs</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>AllocateNodeCIDRs enables CIDRs for Pods to be allocated and, if
ConfigureCloudRoutes is true, to be set on the cloud provider.</p>
</td>
</tr>
<tr><td><code>CIDRAllocatorType</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>CIDRAllocatorType determines what kind of pod CIDR allocator will be used.</p>
</td>
</tr>
<tr><td><code>ConfigureCloudRoutes</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>configureCloudRoutes enables CIDRs allocated with allocateNodeCIDRs
to be configured on the cloud provider.</p>
</td>
</tr>
<tr><td><code>NodeSyncPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>nodeSyncPeriod is the period for syncing nodes from cloudprovider. Longer
periods will result in fewer calls to cloud provider, but may delay addition
of new nodes to cluster.</p>
</td>
</tr>
</tbody>
</table>

## `WebhookConfiguration`     {#cloudcontrollermanager-config-k8s-io-v1alpha1-WebhookConfiguration}
    

**Appears in:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)


<p>WebhookConfiguration contains configuration related to
cloud-controller-manager hosted webhooks</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>Webhooks</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>Webhooks is the list of webhooks to enable or disable
'*' means &quot;all enabled by default webhooks&quot;
'foo' means &quot;enable 'foo'&quot;
'-foo' means &quot;disable 'foo'&quot;
first item for a particular name wins</p>
</td>
</tr>
</tbody>
</table>
  
  

## `LeaderMigrationConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration}
    

**Appears in:**

- [GenericControllerManagerConfiguration](#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration)


<p>LeaderMigrationConfiguration provides versioned configuration for all migrating leader locks.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>controllermanager.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>LeaderMigrationConfiguration</code></td></tr>
    
  
<tr><td><code>leaderName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>LeaderName is the name of the leader election resource that protects the migration
E.g. 1-20-KCM-to-1-21-CCM</p>
</td>
</tr>
<tr><td><code>resourceLock</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>ResourceLock indicates the resource object type that will be used to lock
Should be &quot;leases&quot; or &quot;endpoints&quot;</p>
</td>
</tr>
<tr><td><code>controllerLeaders</code> <B>[Required]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-ControllerLeaderConfiguration"><code>[]ControllerLeaderConfiguration</code></a>
</td>
<td>
   <p>ControllerLeaders contains a list of migrating leader lock configurations</p>
</td>
</tr>
</tbody>
</table>

## `ControllerLeaderConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-ControllerLeaderConfiguration}
    

**Appears in:**

- [LeaderMigrationConfiguration](#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration)


<p>ControllerLeaderConfiguration provides the configuration for a migrating leader lock.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Name is the name of the controller being migrated
E.g. service-controller, route-controller, cloud-node-controller, etc</p>
</td>
</tr>
<tr><td><code>component</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Component is the name of the component in which the controller should be running.
E.g. kube-controller-manager, cloud-controller-manager, etc
Or '*' meaning the controller can be run under any component that participates in the migration</p>
</td>
</tr>
</tbody>
</table>

## `GenericControllerManagerConfiguration`     {#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration}
    

**Appears in:**

- [CloudControllerManagerConfiguration](#cloudcontrollermanager-config-k8s-io-v1alpha1-CloudControllerManagerConfiguration)

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>GenericControllerManagerConfiguration holds configuration for a generic controller-manager.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>Port</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>port is the port that the controller-manager's http service runs on.</p>
</td>
</tr>
<tr><td><code>Address</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>address is the IP address to serve on (set to 0.0.0.0 for all interfaces).</p>
</td>
</tr>
<tr><td><code>MinResyncPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>minResyncPeriod is the resync period in reflectors; will be random between
minResyncPeriod and 2*minResyncPeriod.</p>
</td>
</tr>
<tr><td><code>ClientConnection</code> <B>[Required]</B><br/>
<a href="#ClientConnectionConfiguration"><code>ClientConnectionConfiguration</code></a>
</td>
<td>
   <p>ClientConnection specifies the kubeconfig file and client connection
settings for the proxy server to use when communicating with the apiserver.</p>
</td>
</tr>
<tr><td><code>ControllerStartInterval</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>How long to wait between starting controller managers</p>
</td>
</tr>
<tr><td><code>LeaderElection</code> <B>[Required]</B><br/>
<a href="#LeaderElectionConfiguration"><code>LeaderElectionConfiguration</code></a>
</td>
<td>
   <p>leaderElection defines the configuration of leader election client.</p>
</td>
</tr>
<tr><td><code>Controllers</code> <B>[Required]</B><br/>
<code>[]string</code>
</td>
<td>
   <p>Controllers is the list of controllers to enable or disable
'*' means &quot;all enabled by default controllers&quot;
'foo' means &quot;enable 'foo'&quot;
'-foo' means &quot;disable 'foo'&quot;
first item for a particular name wins</p>
</td>
</tr>
<tr><td><code>Debugging</code> <B>[Required]</B><br/>
<a href="#DebuggingConfiguration"><code>DebuggingConfiguration</code></a>
</td>
<td>
   <p>DebuggingConfiguration holds configuration for Debugging related features.</p>
</td>
</tr>
<tr><td><code>LeaderMigrationEnabled</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>LeaderMigrationEnabled indicates whether Leader Migration should be enabled for the controller manager.</p>
</td>
</tr>
<tr><td><code>LeaderMigration</code> <B>[Required]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-LeaderMigrationConfiguration"><code>LeaderMigrationConfiguration</code></a>
</td>
<td>
   <p>LeaderMigration holds the configuration for Leader Migration.</p>
</td>
</tr>
</tbody>
</table>
  
  

## `KubeControllerManagerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration}
    


<p>KubeControllerManagerConfiguration contains elements describing kube-controller manager.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
<tr><td><code>apiVersion</code><br/>string</td><td><code>kubecontrollermanager.config.k8s.io/v1alpha1</code></td></tr>
<tr><td><code>kind</code><br/>string</td><td><code>KubeControllerManagerConfiguration</code></td></tr>
    
  
<tr><td><code>Generic</code> <B>[Required]</B><br/>
<a href="#controllermanager-config-k8s-io-v1alpha1-GenericControllerManagerConfiguration"><code>GenericControllerManagerConfiguration</code></a>
</td>
<td>
   <p>Generic holds configuration for a generic controller-manager</p>
</td>
</tr>
<tr><td><code>KubeCloudShared</code> <B>[Required]</B><br/>
<a href="#cloudcontrollermanager-config-k8s-io-v1alpha1-KubeCloudSharedConfiguration"><code>KubeCloudSharedConfiguration</code></a>
</td>
<td>
   <p>KubeCloudSharedConfiguration holds configuration for shared related features
both in cloud controller manager and kube-controller manager.</p>
</td>
</tr>
<tr><td><code>AttachDetachController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-AttachDetachControllerConfiguration"><code>AttachDetachControllerConfiguration</code></a>
</td>
<td>
   <p>AttachDetachControllerConfiguration holds configuration for
AttachDetachController related features.</p>
</td>
</tr>
<tr><td><code>CSRSigningController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration"><code>CSRSigningControllerConfiguration</code></a>
</td>
<td>
   <p>CSRSigningControllerConfiguration holds configuration for
CSRSigningController related features.</p>
</td>
</tr>
<tr><td><code>DaemonSetController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DaemonSetControllerConfiguration"><code>DaemonSetControllerConfiguration</code></a>
</td>
<td>
   <p>DaemonSetControllerConfiguration holds configuration for DaemonSetController
related features.</p>
</td>
</tr>
<tr><td><code>DeploymentController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeploymentControllerConfiguration"><code>DeploymentControllerConfiguration</code></a>
</td>
<td>
   <p>DeploymentControllerConfiguration holds configuration for
DeploymentController related features.</p>
</td>
</tr>
<tr><td><code>StatefulSetController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-StatefulSetControllerConfiguration"><code>StatefulSetControllerConfiguration</code></a>
</td>
<td>
   <p>StatefulSetControllerConfiguration holds configuration for
StatefulSetController related features.</p>
</td>
</tr>
<tr><td><code>DeprecatedController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-DeprecatedControllerConfiguration"><code>DeprecatedControllerConfiguration</code></a>
</td>
<td>
   <p>DeprecatedControllerConfiguration holds configuration for some deprecated
features.</p>
</td>
</tr>
<tr><td><code>EndpointController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointControllerConfiguration"><code>EndpointControllerConfiguration</code></a>
</td>
<td>
   <p>EndpointControllerConfiguration holds configuration for EndpointController
related features.</p>
</td>
</tr>
<tr><td><code>EndpointSliceController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceControllerConfiguration"><code>EndpointSliceControllerConfiguration</code></a>
</td>
<td>
   <p>EndpointSliceControllerConfiguration holds configuration for
EndpointSliceController related features.</p>
</td>
</tr>
<tr><td><code>EndpointSliceMirroringController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceMirroringControllerConfiguration"><code>EndpointSliceMirroringControllerConfiguration</code></a>
</td>
<td>
   <p>EndpointSliceMirroringControllerConfiguration holds configuration for
EndpointSliceMirroringController related features.</p>
</td>
</tr>
<tr><td><code>EphemeralVolumeController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-EphemeralVolumeControllerConfiguration"><code>EphemeralVolumeControllerConfiguration</code></a>
</td>
<td>
   <p>EphemeralVolumeControllerConfiguration holds configuration for EphemeralVolumeController
related features.</p>
</td>
</tr>
<tr><td><code>GarbageCollectorController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration"><code>GarbageCollectorControllerConfiguration</code></a>
</td>
<td>
   <p>GarbageCollectorControllerConfiguration holds configuration for
GarbageCollectorController related features.</p>
</td>
</tr>
<tr><td><code>HPAController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-HPAControllerConfiguration"><code>HPAControllerConfiguration</code></a>
</td>
<td>
   <p>HPAControllerConfiguration holds configuration for HPAController related features.</p>
</td>
</tr>
<tr><td><code>JobController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-JobControllerConfiguration"><code>JobControllerConfiguration</code></a>
</td>
<td>
   <p>JobControllerConfiguration holds configuration for JobController related features.</p>
</td>
</tr>
<tr><td><code>CronJobController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CronJobControllerConfiguration"><code>CronJobControllerConfiguration</code></a>
</td>
<td>
   <p>CronJobControllerConfiguration holds configuration for CronJobController related features.</p>
</td>
</tr>
<tr><td><code>LegacySATokenCleaner</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-LegacySATokenCleanerConfiguration"><code>LegacySATokenCleanerConfiguration</code></a>
</td>
<td>
   <p>LegacySATokenCleanerConfiguration holds configuration for LegacySATokenCleaner related features.</p>
</td>
</tr>
<tr><td><code>NamespaceController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NamespaceControllerConfiguration"><code>NamespaceControllerConfiguration</code></a>
</td>
<td>
   <p>NamespaceControllerConfiguration holds configuration for NamespaceController
related features.</p>
</td>
</tr>
<tr><td><code>NodeIPAMController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NodeIPAMControllerConfiguration"><code>NodeIPAMControllerConfiguration</code></a>
</td>
<td>
   <p>NodeIPAMControllerConfiguration holds configuration for NodeIPAMController
related features.</p>
</td>
</tr>
<tr><td><code>NodeLifecycleController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-NodeLifecycleControllerConfiguration"><code>NodeLifecycleControllerConfiguration</code></a>
</td>
<td>
   <p>NodeLifecycleControllerConfiguration holds configuration for
NodeLifecycleController related features.</p>
</td>
</tr>
<tr><td><code>PersistentVolumeBinderController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration"><code>PersistentVolumeBinderControllerConfiguration</code></a>
</td>
<td>
   <p>PersistentVolumeBinderControllerConfiguration holds configuration for
PersistentVolumeBinderController related features.</p>
</td>
</tr>
<tr><td><code>PodGCController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PodGCControllerConfiguration"><code>PodGCControllerConfiguration</code></a>
</td>
<td>
   <p>PodGCControllerConfiguration holds configuration for PodGCController
related features.</p>
</td>
</tr>
<tr><td><code>ReplicaSetController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicaSetControllerConfiguration"><code>ReplicaSetControllerConfiguration</code></a>
</td>
<td>
   <p>ReplicaSetControllerConfiguration holds configuration for ReplicaSet related features.</p>
</td>
</tr>
<tr><td><code>ReplicationController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicationControllerConfiguration"><code>ReplicationControllerConfiguration</code></a>
</td>
<td>
   <p>ReplicationControllerConfiguration holds configuration for
ReplicationController related features.</p>
</td>
</tr>
<tr><td><code>ResourceQuotaController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ResourceQuotaControllerConfiguration"><code>ResourceQuotaControllerConfiguration</code></a>
</td>
<td>
   <p>ResourceQuotaControllerConfiguration holds configuration for
ResourceQuotaController related features.</p>
</td>
</tr>
<tr><td><code>SAController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-SAControllerConfiguration"><code>SAControllerConfiguration</code></a>
</td>
<td>
   <p>SAControllerConfiguration holds configuration for ServiceAccountController
related features.</p>
</td>
</tr>
<tr><td><code>ServiceController</code> <B>[Required]</B><br/>
<a href="#ServiceControllerConfiguration"><code>ServiceControllerConfiguration</code></a>
</td>
<td>
   <p>ServiceControllerConfiguration holds configuration for ServiceController
related features.</p>
</td>
</tr>
<tr><td><code>TTLAfterFinishedController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-TTLAfterFinishedControllerConfiguration"><code>TTLAfterFinishedControllerConfiguration</code></a>
</td>
<td>
   <p>TTLAfterFinishedControllerConfiguration holds configuration for
TTLAfterFinishedController related features.</p>
</td>
</tr>
<tr><td><code>ValidatingAdmissionPolicyStatusController</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-ValidatingAdmissionPolicyStatusControllerConfiguration"><code>ValidatingAdmissionPolicyStatusControllerConfiguration</code></a>
</td>
<td>
   <p>ValidatingAdmissionPolicyStatusControllerConfiguration holds configuration for
ValidatingAdmissionPolicyStatusController related features.</p>
</td>
</tr>
</tbody>
</table>

## `AttachDetachControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-AttachDetachControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>AttachDetachControllerConfiguration contains elements describing AttachDetachController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>DisableAttachDetachReconcilerSync</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>Reconciler runs a periodic loop to reconcile the desired state of the with
the actual state of the world by triggering attach detach operations.
This flag enables or disables reconcile.  Is false by default, and thus enabled.</p>
</td>
</tr>
<tr><td><code>ReconcilerSyncLoopPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>ReconcilerSyncLoopPeriod is the amount of time the reconciler sync states loop
wait between successive executions. Is set to 60 sec by default.</p>
</td>
</tr>
<tr><td><code>disableForceDetachOnTimeout</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>DisableForceDetachOnTimeout disables force detach when the maximum unmount
time is exceeded. Is false by default, and thus force detach on unmount is
enabled.</p>
</td>
</tr>
</tbody>
</table>

## `CSRSigningConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration}
    

**Appears in:**

- [CSRSigningControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration)


<p>CSRSigningConfiguration holds information about a particular CSR signer</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>CertFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>certFile is the filename containing a PEM-encoded
X509 CA certificate used to issue certificates</p>
</td>
</tr>
<tr><td><code>KeyFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>keyFile is the filename containing a PEM-encoded
RSA or ECDSA private key used to issue certificates</p>
</td>
</tr>
</tbody>
</table>

## `CSRSigningControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>CSRSigningControllerConfiguration contains elements describing CSRSigningController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ClusterSigningCertFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>clusterSigningCertFile is the filename containing a PEM-encoded
X509 CA certificate used to issue cluster-scoped certificates</p>
</td>
</tr>
<tr><td><code>ClusterSigningKeyFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>clusterSigningCertFile is the filename containing a PEM-encoded
RSA or ECDSA private key used to issue cluster-scoped certificates</p>
</td>
</tr>
<tr><td><code>KubeletServingSignerConfiguration</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>kubeletServingSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kubelet-serving signer</p>
</td>
</tr>
<tr><td><code>KubeletClientSignerConfiguration</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>kubeletClientSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kube-apiserver-client-kubelet</p>
</td>
</tr>
<tr><td><code>KubeAPIServerClientSignerConfiguration</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>kubeAPIServerClientSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/kube-apiserver-client</p>
</td>
</tr>
<tr><td><code>LegacyUnknownSignerConfiguration</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-CSRSigningConfiguration"><code>CSRSigningConfiguration</code></a>
</td>
<td>
   <p>legacyUnknownSignerConfiguration holds the certificate and key used to issue certificates for the kubernetes.io/legacy-unknown</p>
</td>
</tr>
<tr><td><code>ClusterSigningDuration</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>clusterSigningDuration is the max length of duration signed certificates will be given.
Individual CSRs may request shorter certs by setting spec.expirationSeconds.</p>
</td>
</tr>
</tbody>
</table>

## `CronJobControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-CronJobControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>CronJobControllerConfiguration contains elements describing CrongJob2Controller.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentCronJobSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentCronJobSyncs is the number of job objects that are
allowed to sync concurrently. Larger number = more responsive jobs,
but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `DaemonSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DaemonSetControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>DaemonSetControllerConfiguration contains elements describing DaemonSetController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentDaemonSetSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentDaemonSetSyncs is the number of daemonset objects that are
allowed to sync concurrently. Larger number = more responsive daemonset,
but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `DeploymentControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DeploymentControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>DeploymentControllerConfiguration contains elements describing DeploymentController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentDeploymentSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentDeploymentSyncs is the number of deployment objects that are
allowed to sync concurrently. Larger number = more responsive deployments,
but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `DeprecatedControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-DeprecatedControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>DeprecatedControllerConfiguration contains elements be deprecated.</p>




## `EndpointControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>EndpointControllerConfiguration contains elements describing EndpointController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentEndpointSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentEndpointSyncs is the number of endpoint syncing operations
that will be done concurrently. Larger number = faster endpoint updating,
but more CPU (and network) load.</p>
</td>
</tr>
<tr><td><code>EndpointUpdatesBatchPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>EndpointUpdatesBatchPeriod describes the length of endpoint updates batching period.
Processing of pod changes will be delayed by this duration to join them with potential
upcoming updates and reduce the overall number of endpoints updates.</p>
</td>
</tr>
</tbody>
</table>

## `EndpointSliceControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>EndpointSliceControllerConfiguration contains elements describing
EndpointSliceController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentServiceEndpointSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentServiceEndpointSyncs is the number of service endpoint syncing
operations that will be done concurrently. Larger number = faster
endpoint slice updating, but more CPU (and network) load.</p>
</td>
</tr>
<tr><td><code>MaxEndpointsPerSlice</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>maxEndpointsPerSlice is the maximum number of endpoints that will be
added to an EndpointSlice. More endpoints per slice will result in fewer
and larger endpoint slices, but larger resources.</p>
</td>
</tr>
<tr><td><code>EndpointUpdatesBatchPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>EndpointUpdatesBatchPeriod describes the length of endpoint updates batching period.
Processing of pod changes will be delayed by this duration to join them with potential
upcoming updates and reduce the overall number of endpoints updates.</p>
</td>
</tr>
</tbody>
</table>

## `EndpointSliceMirroringControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EndpointSliceMirroringControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>EndpointSliceMirroringControllerConfiguration contains elements describing
EndpointSliceMirroringController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>MirroringConcurrentServiceEndpointSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>mirroringConcurrentServiceEndpointSyncs is the number of service endpoint
syncing operations that will be done concurrently. Larger number = faster
endpoint slice updating, but more CPU (and network) load.</p>
</td>
</tr>
<tr><td><code>MirroringMaxEndpointsPerSubset</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>mirroringMaxEndpointsPerSubset is the maximum number of endpoints that
will be mirrored to an EndpointSlice for an EndpointSubset.</p>
</td>
</tr>
<tr><td><code>MirroringEndpointUpdatesBatchPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>mirroringEndpointUpdatesBatchPeriod can be used to batch EndpointSlice
updates. All updates triggered by EndpointSlice changes will be delayed
by up to 'mirroringEndpointUpdatesBatchPeriod'. If other addresses in the
same Endpoints resource change in that period, they will be batched to a
single EndpointSlice update. Default 0 value means that each Endpoints
update triggers an EndpointSlice update.</p>
</td>
</tr>
</tbody>
</table>

## `EphemeralVolumeControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-EphemeralVolumeControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>EphemeralVolumeControllerConfiguration contains elements describing EphemeralVolumeController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentEphemeralVolumeSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>ConcurrentEphemeralVolumeSyncseSyncs is the number of ephemeral volume syncing operations
that will be done concurrently. Larger number = faster ephemeral volume updating,
but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `GarbageCollectorControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>GarbageCollectorControllerConfiguration contains elements describing GarbageCollectorController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>EnableGarbageCollector</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>enables the generic garbage collector. MUST be synced with the
corresponding flag of the kube-apiserver. WARNING: the generic garbage
collector is an alpha feature.</p>
</td>
</tr>
<tr><td><code>ConcurrentGCSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentGCSyncs is the number of garbage collector workers that are
allowed to sync concurrently.</p>
</td>
</tr>
<tr><td><code>GCIgnoredResources</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-GroupResource"><code>[]GroupResource</code></a>
</td>
<td>
   <p>gcIgnoredResources is the list of GroupResources that garbage collection should ignore.</p>
</td>
</tr>
</tbody>
</table>

## `GroupResource`     {#kubecontrollermanager-config-k8s-io-v1alpha1-GroupResource}
    

**Appears in:**

- [GarbageCollectorControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-GarbageCollectorControllerConfiguration)


<p>GroupResource describes an group resource.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>Group</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>group is the group portion of the GroupResource.</p>
</td>
</tr>
<tr><td><code>Resource</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>resource is the resource portion of the GroupResource.</p>
</td>
</tr>
</tbody>
</table>

## `HPAControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-HPAControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>HPAControllerConfiguration contains elements describing HPAController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentHorizontalPodAutoscalerSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>ConcurrentHorizontalPodAutoscalerSyncs is the number of HPA objects that are allowed to sync concurrently.
Larger number = more responsive HPA processing, but more CPU (and network) load.</p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerSyncPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>HorizontalPodAutoscalerSyncPeriod is the period for syncing the number of
pods in horizontal pod autoscaler.</p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerDownscaleStabilizationWindow</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>HorizontalPodAutoscalerDowncaleStabilizationWindow is a period for which autoscaler will look
backwards and not scale down below any recommendation it made during that period.</p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerTolerance</code> <B>[Required]</B><br/>
<code>float64</code>
</td>
<td>
   <p>HorizontalPodAutoscalerTolerance is the tolerance for when
resource usage suggests upscaling/downscaling</p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerCPUInitializationPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>HorizontalPodAutoscalerCPUInitializationPeriod is the period after pod start when CPU samples
might be skipped.</p>
</td>
</tr>
<tr><td><code>HorizontalPodAutoscalerInitialReadinessDelay</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>HorizontalPodAutoscalerInitialReadinessDelay is period after pod start during which readiness
changes are treated as readiness being set for the first time. The only effect of this is that
HPA will disregard CPU samples from unready pods that had last readiness change during that
period.</p>
</td>
</tr>
</tbody>
</table>

## `JobControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-JobControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>JobControllerConfiguration contains elements describing JobController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentJobSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentJobSyncs is the number of job objects that are
allowed to sync concurrently. Larger number = more responsive jobs,
but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `LegacySATokenCleanerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-LegacySATokenCleanerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>LegacySATokenCleanerConfiguration contains elements describing LegacySATokenCleaner</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>CleanUpPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>CleanUpPeriod is the period of time since the last usage of an
auto-generated service account token before it can be deleted.</p>
</td>
</tr>
</tbody>
</table>

## `NamespaceControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NamespaceControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>NamespaceControllerConfiguration contains elements describing NamespaceController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>NamespaceSyncPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>namespaceSyncPeriod is the period for syncing namespace life-cycle
updates.</p>
</td>
</tr>
<tr><td><code>ConcurrentNamespaceSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentNamespaceSyncs is the number of namespace objects that are
allowed to sync concurrently.</p>
</td>
</tr>
</tbody>
</table>

## `NodeIPAMControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NodeIPAMControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>NodeIPAMControllerConfiguration contains elements describing NodeIpamController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ServiceCIDR</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>serviceCIDR is CIDR Range for Services in cluster.</p>
</td>
</tr>
<tr><td><code>SecondaryServiceCIDR</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>secondaryServiceCIDR is CIDR Range for Services in cluster. This is used in dual stack clusters. SecondaryServiceCIDR must be of different IP family than ServiceCIDR</p>
</td>
</tr>
<tr><td><code>NodeCIDRMaskSize</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>NodeCIDRMaskSize is the mask size for node cidr in cluster.</p>
</td>
</tr>
<tr><td><code>NodeCIDRMaskSizeIPv4</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>NodeCIDRMaskSizeIPv4 is the mask size for node cidr in dual-stack cluster.</p>
</td>
</tr>
<tr><td><code>NodeCIDRMaskSizeIPv6</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>NodeCIDRMaskSizeIPv6 is the mask size for node cidr in dual-stack cluster.</p>
</td>
</tr>
</tbody>
</table>

## `NodeLifecycleControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-NodeLifecycleControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>NodeLifecycleControllerConfiguration contains elements describing NodeLifecycleController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>NodeEvictionRate</code> <B>[Required]</B><br/>
<code>float32</code>
</td>
<td>
   <p>nodeEvictionRate is the number of nodes per second on which pods are deleted in case of node failure when a zone is healthy</p>
</td>
</tr>
<tr><td><code>SecondaryNodeEvictionRate</code> <B>[Required]</B><br/>
<code>float32</code>
</td>
<td>
   <p>secondaryNodeEvictionRate is the number of nodes per second on which pods are deleted in case of node failure when a zone is unhealthy</p>
</td>
</tr>
<tr><td><code>NodeStartupGracePeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>nodeStartupGracePeriod is the amount of time which we allow starting a node to
be unresponsive before marking it unhealthy.</p>
</td>
</tr>
<tr><td><code>NodeMonitorGracePeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>nodeMontiorGracePeriod is the amount of time which we allow a running node to be
unresponsive before marking it unhealthy. Must be N times more than kubelet's
nodeStatusUpdateFrequency, where N means number of retries allowed for kubelet
to post node status.</p>
</td>
</tr>
<tr><td><code>PodEvictionTimeout</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>podEvictionTimeout is the grace period for deleting pods on failed nodes.</p>
</td>
</tr>
<tr><td><code>LargeClusterSizeThreshold</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>secondaryNodeEvictionRate is implicitly overridden to 0 for clusters smaller than or equal to largeClusterSizeThreshold</p>
</td>
</tr>
<tr><td><code>UnhealthyZoneThreshold</code> <B>[Required]</B><br/>
<code>float32</code>
</td>
<td>
   <p>Zone is treated as unhealthy in nodeEvictionRate and secondaryNodeEvictionRate when at least
unhealthyZoneThreshold (no less than 3) of Nodes in the zone are NotReady</p>
</td>
</tr>
</tbody>
</table>

## `PersistentVolumeBinderControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>PersistentVolumeBinderControllerConfiguration contains elements describing
PersistentVolumeBinderController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>PVClaimBinderSyncPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>pvClaimBinderSyncPeriod is the period for syncing persistent volumes
and persistent volume claims.</p>
</td>
</tr>
<tr><td><code>VolumeConfiguration</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration"><code>VolumeConfiguration</code></a>
</td>
<td>
   <p>volumeConfiguration holds configuration for volume related features.</p>
</td>
</tr>
</tbody>
</table>

## `PersistentVolumeRecyclerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeRecyclerConfiguration}
    

**Appears in:**

- [VolumeConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration)


<p>PersistentVolumeRecyclerConfiguration contains elements describing persistent volume plugins.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>MaximumRetry</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>maximumRetry is number of retries the PV recycler will execute on failure to recycle
PV.</p>
</td>
</tr>
<tr><td><code>MinimumTimeoutNFS</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>minimumTimeoutNFS is the minimum ActiveDeadlineSeconds to use for an NFS Recycler
pod.</p>
</td>
</tr>
<tr><td><code>PodTemplateFilePathNFS</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>podTemplateFilePathNFS is the file path to a pod definition used as a template for
NFS persistent volume recycling</p>
</td>
</tr>
<tr><td><code>IncrementTimeoutNFS</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>incrementTimeoutNFS is the increment of time added per Gi to ActiveDeadlineSeconds
for an NFS scrubber pod.</p>
</td>
</tr>
<tr><td><code>PodTemplateFilePathHostPath</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>podTemplateFilePathHostPath is the file path to a pod definition used as a template for
HostPath persistent volume recycling. This is for development and testing only and
will not work in a multi-node cluster.</p>
</td>
</tr>
<tr><td><code>MinimumTimeoutHostPath</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>minimumTimeoutHostPath is the minimum ActiveDeadlineSeconds to use for a HostPath
Recycler pod.  This is for development and testing only and will not work in a multi-node
cluster.</p>
</td>
</tr>
<tr><td><code>IncrementTimeoutHostPath</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>incrementTimeoutHostPath is the increment of time added per Gi to ActiveDeadlineSeconds
for a HostPath scrubber pod.  This is for development and testing only and will not work
in a multi-node cluster.</p>
</td>
</tr>
</tbody>
</table>

## `PodGCControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-PodGCControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>PodGCControllerConfiguration contains elements describing PodGCController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>TerminatedPodGCThreshold</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>terminatedPodGCThreshold is the number of terminated pods that can exist
before the terminated pod garbage collector starts deleting terminated pods.
If &lt;= 0, the terminated pod garbage collector is disabled.</p>
</td>
</tr>
</tbody>
</table>

## `ReplicaSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicaSetControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>ReplicaSetControllerConfiguration contains elements describing ReplicaSetController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentRSSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentRSSyncs is the number of replica sets that are  allowed to sync
concurrently. Larger number = more responsive replica  management, but more
CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `ReplicationControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ReplicationControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>ReplicationControllerConfiguration contains elements describing ReplicationController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentRCSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentRCSyncs is the number of replication controllers that are
allowed to sync concurrently. Larger number = more responsive replica
management, but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `ResourceQuotaControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ResourceQuotaControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>ResourceQuotaControllerConfiguration contains elements describing ResourceQuotaController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ResourceQuotaSyncPeriod</code> <B>[Required]</B><br/>
<a href="https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#Duration"><code>meta/v1.Duration</code></a>
</td>
<td>
   <p>resourceQuotaSyncPeriod is the period for syncing quota usage status
in the system.</p>
</td>
</tr>
<tr><td><code>ConcurrentResourceQuotaSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentResourceQuotaSyncs is the number of resource quotas that are
allowed to sync concurrently. Larger number = more responsive quota
management, but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `SAControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-SAControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>SAControllerConfiguration contains elements describing ServiceAccountController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ServiceAccountKeyFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>serviceAccountKeyFile is the filename containing a PEM-encoded private RSA key
used to sign service account tokens.</p>
</td>
</tr>
<tr><td><code>ConcurrentSATokenSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentSATokenSyncs is the number of service account token syncing operations
that will be done concurrently.</p>
</td>
</tr>
<tr><td><code>RootCAFile</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>rootCAFile is the root certificate authority will be included in service
account's token secret. This must be a valid PEM-encoded CA bundle.</p>
</td>
</tr>
</tbody>
</table>

## `StatefulSetControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-StatefulSetControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>StatefulSetControllerConfiguration contains elements describing StatefulSetController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentStatefulSetSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentStatefulSetSyncs is the number of statefulset objects that are
allowed to sync concurrently. Larger number = more responsive statefulsets,
but more CPU (and network) load.</p>
</td>
</tr>
</tbody>
</table>

## `TTLAfterFinishedControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-TTLAfterFinishedControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>TTLAfterFinishedControllerConfiguration contains elements describing TTLAfterFinishedController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentTTLSyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>concurrentTTLSyncs is the number of TTL-after-finished collector workers that are
allowed to sync concurrently.</p>
</td>
</tr>
</tbody>
</table>

## `ValidatingAdmissionPolicyStatusControllerConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-ValidatingAdmissionPolicyStatusControllerConfiguration}
    

**Appears in:**

- [KubeControllerManagerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-KubeControllerManagerConfiguration)


<p>ValidatingAdmissionPolicyStatusControllerConfiguration contains elements describing ValidatingAdmissionPolicyStatusController.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>ConcurrentPolicySyncs</code> <B>[Required]</B><br/>
<code>int32</code>
</td>
<td>
   <p>ConcurrentPolicySyncs is the number of policy objects that are
allowed to sync concurrently. Larger number = quicker type checking,
but more CPU (and network) load.
The default value is 5.</p>
</td>
</tr>
</tbody>
</table>

## `VolumeConfiguration`     {#kubecontrollermanager-config-k8s-io-v1alpha1-VolumeConfiguration}
    

**Appears in:**

- [PersistentVolumeBinderControllerConfiguration](#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeBinderControllerConfiguration)


<p>VolumeConfiguration contains <em>all</em> enumerated flags meant to configure all volume
plugins. From this config, the controller-manager binary will create many instances of
volume.VolumeConfig, each containing only the configuration needed for that plugin which
are then passed to the appropriate plugin. The ControllerManager binary is the only part
of the code which knows what plugins are supported and which flags correspond to each plugin.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>EnableHostPathProvisioning</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>enableHostPathProvisioning enables HostPath PV provisioning when running without a
cloud provider. This allows testing and development of provisioning features. HostPath
provisioning is not supported in any way, won't work in a multi-node cluster, and
should not be used for anything other than testing or development.</p>
</td>
</tr>
<tr><td><code>EnableDynamicProvisioning</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>enableDynamicProvisioning enables the provisioning of volumes when running within an environment
that supports dynamic provisioning. Defaults to true.</p>
</td>
</tr>
<tr><td><code>PersistentVolumeRecyclerConfiguration</code> <B>[Required]</B><br/>
<a href="#kubecontrollermanager-config-k8s-io-v1alpha1-PersistentVolumeRecyclerConfiguration"><code>PersistentVolumeRecyclerConfiguration</code></a>
</td>
<td>
   <p>persistentVolumeRecyclerConfiguration holds configuration for persistent volume plugins.</p>
</td>
</tr>
<tr><td><code>FlexVolumePluginDir</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>volumePluginDir is the full path of the directory in which the flex
volume plugin should search for additional third party volume plugins</p>
</td>
</tr>
</tbody>
</table>
  