---
reviewers:
- liggitt
- lavalamp
- thockin
- smarterclayton
title: "Deprecations by Kubernetes Version"
weight: 95
content_type: reference
---

<!-- overview -->

This guide will help users migrating from previous versions of Kubernetes
by centralizing deprecations and removals for each major version.
The deprecations listed below are from the previous major version 
(e.g. 1.XX.0 -> 1.YY.0).


<!-- body -->

## Deprecations by Release

### v1.29

#### Breaking Changes

Stopped accepting component configuration for kube-proxy and kubelet during kubeadm upgrade plan --config.
This was a legacy behavior that was not well supported for upgrades and could be used only at the plan stage
to determine if the configuration for these components stored in the cluster needs manual version migration.
In the future, kubeadm will attempt alternative component config migration approaches.

kubeadm: a separate "super-admin.conf" file is now deployed. The User in admin.conf is now bound to a new
RBAC Group kubeadm:cluster-admins that has cluster-admin ClusterRole access. The User in super-admin.conf
is now bound to the system:masters built-in super-powers / break-glass Group that can bypass RBAC. Before
this change, the default admin.conf was bound to system:masters Group, which was undesired. Executing
kubeadm init phase kubeconfig all or just kubeadm init will now generate the new super-admin.conf file.
The cluster admin can then decide to keep the file present on a node host or move it to a safe location.
kubadm certs renew will renew the certificate in super-admin.conf to one year if the file exists; if it
does not exist a "MISSING" note will be printed. kubeadm upgrade apply for this release will migrate this
particular node to the two file setup. Subsequent kubeadm releases will continue to optionally renew the
certificate in super-admin.conf if the file exists on disk and if renew on upgrade is not disabled.
kubeadm join --control-plane will now generate only an admin.conf file that has the less privileged User.

#### APIs

The **v1.29** release stopped serving the following deprecated API versions:

##### Flow control resources {#flowcontrol-resources-v129}

The **flowcontrol.apiserver.k8s.io/v1beta2** API version of FlowSchema and PriorityLevelConfiguration is no longer served as of v1.29.

* Migrate manifests and API clients to use the **flowcontrol.apiserver.k8s.io/v1** API version, available since v1.29, or the **flowcontrol.apiserver.k8s.io/v1beta3** API version, available since v1.26.
* All existing persisted objects are accessible via the new API
* Notable changes in **flowcontrol.apiserver.k8s.io/v1**:
  * The PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field is renamed to `spec.limited.nominalConcurrencyShares` and only defaults to 30 when unspecified, and an explicit value of 0 is not changed to 30.
* Notable changes in **flowcontrol.apiserver.k8s.io/v1beta3**:
  * The PriorityLevelConfiguration `spec.limited.assuredConcurrencyShares` field is renamed to `spec.limited.nominalConcurrencyShares`

##### Other APIs

* Removed the networking alpha API 'ClusterCIDR'.

#### Features

The **v1.29** release deprecated/removed the following feature gates:

{{ <table class="sortable-table" data-sort-order="asc">
<caption style="display:none">Feature Gates for Graduated or Deprecated Features</caption>
<thead>
   <tr>
      <th style="cursor: pointer;">Feature</th>
      <th style="cursor: pointer;">Default</th>
      <th style="cursor: pointer;">Stage</th>
      <th style="cursor: pointer;">Since</th>
      <th style="cursor: pointer;">Until</th>
   </tr>
</thead>
<tbody>
   <tr>
      <td><code title="Enables .status.ingress.loadBalancer to be set on Services of types other than LoadBalancer.
         ">AllowServiceLBStatusOnNonLB</code></td>
      <td><code>false</code></td>
      <td>Deprecated</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enable the API clients to retrieve (LIST or GET) resources from API server in chunks.
         ">APIListChunking</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enable managing request concurrency with prioritization and fairness at each server. (Renamed from RequestManagement)
         ">APIPriorityAndFairness</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enable passing secret authentication data to a CSI driver for use during a NodeExpandVolume CSI operation.
         ">CSINodeExpandSecret</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enable expression language validation in CRD which will validate customer resource based on validation rules written in the x-kubernetes-validations extension.
         ">CustomResourceValidationExpressions</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enables tracking the number of Pods that have a Ready condition. The count of Ready pods is recorded in the status of a Job status.
         ">JobReadyPods</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enables KMS v1 API for encryption at rest. See Using a KMS Provider for data encryption for more details.
         ">KMSv1</code></td>
      <td><code>false</code></td>
      <td>Deprecated</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enables KMS v2 API for encryption at rest. See Using a KMS Provider for data encryption for more details.
         ">KMSv2</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enables KMS v2 to generate single use data encryption keys. See Using a KMS Provider for data encryption for more details. If the KMSv2 feature gate is not enabled in your cluster, the value of the KMSv2KDF feature gate has no effect.
         ">KMSv2KDF</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enables the usage of ReadWriteOncePod PersistentVolume access mode.
         ">ReadWriteOncePod</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Allow the API servers to show a count of remaining items in the response to a chunking list request.
         ">RemainingItemCount</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
      <td><code title="Enables the use of different port allocation strategies for NodePort Services. For more details, see reserve NodePort ranges to avoid collisions.
         ">ServiceNodePortStaticSubrange</code></td>
      <td><code>true</code></td>
      <td>GA</td>
      <td>1.29</td>
      <td>–</td>
   </tr>
   <tr>
     <td><code title="Skip validation for GCE, will enable in the next version.
">SkipReadOnlyValidationGCE</code></td>
     <td><code>true</code></td><td>Deprecated</td><td>1.29</td><td>–</td>
  </tr>
<tr>
   <td><code title="Enables the DaemonSet workloads to maintain availability during update per node. See Perform a Rolling Update on a DaemonSet.
      ">DaemonSetUpdateSurge</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enables the MultiCIDR range allocator.
      ">MultiCIDRRangeAllocator</code></td>
   <td><code>false</code></td>
   <td>Alpha</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enables shims and translation logic to route volume operations from the vSphere in-tree plugin to vSphere CSI plugin. Supports falling back to in-tree vSphere plugin for mount operations to nodes that have the feature disabled or that do not have vSphere CSI plugin installed and configured. Does not support falling back for provision operations, for those the CSI plugin must be installed and configured. Requires CSIMigration feature flag enabled.
      ">CSIMigrationvSphere</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enables tracking Job completions without relying on Pods remaining in the cluster indefinitely. The Job controller uses Pod finalizers and a field in the Job status to keep track of the finished Pods to count towards completion.
      ">JobTrackingWithFinalizers</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enable kubelet exec credential providers for image pull credentials.
      ">KubeletCredentialProviders</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Stop auto-generation of Secret-based service account tokens.
      ">LegacyServiceAccountTokenNoAutoGeneration</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Allow the use of the timeZone optional field in CronJobs
      ">CronJobTimeZone</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enables usage of hugepages in downward API.
      ">DownwardAPIHugePages</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enables the gRPC probe method for {Liveness,Readiness,Startup}Probe. See Configure Liveness, Readiness and Startup Probes.
      ">GRPCContainerProbe</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Allows updating node scheduling directives in the pod template of Job.
      ">JobMutableNodeSchedulingDirectives</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enables the API server to publish OpenAPI v3.
      ">OpenAPIV3</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enables the use of RuntimeDefault as the default seccomp profile for all workloads. The seccomp profile is specified in the securityContext of a Pod and/or a Container.
      ">SeccompDefault</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enable a mechanism to coordinate fine-grained hardware resource assignments for different components in Kubernetes. See Control Topology Management Policies on a node.
      ">TopologyManager</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Enable setting probe-level terminationGracePeriodSeconds on pods. See the enhancement proposal for more details.
      ">ProbeTerminationGracePeriod</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
<tr>
   <td><code title="Allow assigning StorageClass to unbound PVCs retroactively.
      ">RetroactiveDefaultStorageClass</code></td>
   <td><code>true</code></td>
   <td>GA</td>
   <td>1.29</td>
</tr>
</tbody>
</table> }}

<h4>Other Deprecations</h4>

<h5>CLI's</h5>

* `Kube-controller-manager`: Deprecate `--volume-host-cidr-denylist` and `--volume-host-allow-local-loopback` flags (Note this is actually 1.28
but is included here as an example)


<h5>Annotations</h5>

* `kubectl prune v2`: The annotation `contains-group-resources` will be deprecated in favor of `contains-group-kinds`.

### v1.28

...
