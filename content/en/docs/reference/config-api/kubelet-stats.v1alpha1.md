

## Resource Types 


- [Summary](#Summary)
  
    
    

## `AcceleratorStats`     {#AcceleratorStats}
    

**Appears in:**

- [ContainerStats](#ContainerStats)


<p>AcceleratorStats contains stats for accelerators attached to the container.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>make</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Make of the accelerator (nvidia, amd, google etc.)</p>
</td>
</tr>
<tr><td><code>model</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Model of the accelerator (tesla-p100, tesla-k80 etc.)</p>
</td>
</tr>
<tr><td><code>id</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>ID of the accelerator.</p>
</td>
</tr>
<tr><td><code>memoryTotal</code> <B>[Required]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>Total accelerator memory.
unit: bytes</p>
</td>
</tr>
<tr><td><code>memoryUsed</code> <B>[Required]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>Total accelerator memory allocated.
unit: bytes</p>
</td>
</tr>
<tr><td><code>dutyCycle</code> <B>[Required]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>Percent of time over the past sample period (10s) during which
the accelerator was actively processing.</p>
</td>
</tr>
</tbody>
</table>

## `CPUStats`     {#CPUStats}
    

**Appears in:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)


<p>CPUStats contains data about CPU usage.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>time</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which these stats were updated.</p>
</td>
</tr>
<tr><td><code>usageNanoCores</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Total CPU usage (sum of all cores) averaged over the sample window.
The &quot;core&quot; unit can be interpreted as CPU core-nanoseconds per second.</p>
</td>
</tr>
<tr><td><code>usageCoreNanoSeconds</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Cumulative CPU usage (sum of all cores) since object creation.</p>
</td>
</tr>
<tr><td><code>psi</code><br/>
<a href="#PSIStats"><code>PSIStats</code></a>
</td>
<td>
   <p>CPU PSI stats.</p>
</td>
</tr>
</tbody>
</table>

## `ContainerStats`     {#ContainerStats}
    

**Appears in:**

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)


<p>ContainerStats holds container-level unprocessed sample stats.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Reference to the measured container.</p>
</td>
</tr>
<tr><td><code>startTime</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which data collection for this container was (re)started.</p>
</td>
</tr>
<tr><td><code>cpu</code><br/>
<a href="#CPUStats"><code>CPUStats</code></a>
</td>
<td>
   <p>Stats pertaining to CPU resources.</p>
</td>
</tr>
<tr><td><code>memory</code><br/>
<a href="#MemoryStats"><code>MemoryStats</code></a>
</td>
<td>
   <p>Stats pertaining to memory (RAM) resources.</p>
</td>
</tr>
<tr><td><code>io</code><br/>
<a href="#IOStats"><code>IOStats</code></a>
</td>
<td>
   <p>Stats pertaining to IO resources.</p>
</td>
</tr>
<tr><td><code>accelerators</code> <B>[Required]</B><br/>
<a href="#AcceleratorStats"><code>[]AcceleratorStats</code></a>
</td>
<td>
   <p>Metrics for Accelerators. Each Accelerator corresponds to one element in the array.</p>
</td>
</tr>
<tr><td><code>rootfs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Stats pertaining to container rootfs usage of filesystem resources.
Rootfs.UsedBytes is the number of bytes used for the container write layer.</p>
</td>
</tr>
<tr><td><code>logs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Stats pertaining to container logs usage of filesystem resources.
Logs.UsedBytes is the number of bytes used for the container logs.</p>
</td>
</tr>
<tr><td><code>userDefinedMetrics</code> <B>[Required]</B><br/>
<a href="#UserDefinedMetric"><code>[]UserDefinedMetric</code></a>
</td>
<td>
   <p>User defined metrics that are exposed by containers in the pod. Typically, we expect only one container in the pod to be exposing user defined metrics. In the event of multiple containers exposing metrics, they will be combined here.</p>
</td>
</tr>
<tr><td><code>swap</code><br/>
<a href="#SwapStats"><code>SwapStats</code></a>
</td>
<td>
   <p>Stats pertaining to swap resources. This is reported to non-windows systems only.</p>
</td>
</tr>
</tbody>
</table>

## `FsStats`     {#FsStats}
    

**Appears in:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)

- [RuntimeStats](#RuntimeStats)

- [VolumeStats](#VolumeStats)


<p>FsStats contains data about filesystem usage.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>time</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which these stats were updated.</p>
</td>
</tr>
<tr><td><code>availableBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>AvailableBytes represents the storage space available (bytes) for the filesystem.</p>
</td>
</tr>
<tr><td><code>capacityBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>CapacityBytes represents the total capacity (bytes) of the filesystems underlying storage.</p>
</td>
</tr>
<tr><td><code>usedBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>UsedBytes represents the bytes used for a specific task on the filesystem.
This may differ from the total bytes used on the filesystem and may not equal CapacityBytes - AvailableBytes.
e.g. For ContainerStats.Rootfs this is the bytes used by the container rootfs on the filesystem.</p>
</td>
</tr>
<tr><td><code>inodesFree</code><br/>
<code>uint64</code>
</td>
<td>
   <p>InodesFree represents the free inodes in the filesystem.</p>
</td>
</tr>
<tr><td><code>inodes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Inodes represents the total inodes in the filesystem.</p>
</td>
</tr>
<tr><td><code>inodesUsed</code> <B>[Required]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>InodesUsed represents the inodes used by the filesystem
This may not equal Inodes - InodesFree because this filesystem may share inodes with other &quot;filesystems&quot;
e.g. For ContainerStats.Rootfs, this is the inodes used only by that container, and does not count inodes used by other containers.</p>
</td>
</tr>
</tbody>
</table>

## `IOStats`     {#IOStats}
    

**Appears in:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)


<p>IOStats contains data about IO usage.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>time</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which these stats were updated.</p>
</td>
</tr>
<tr><td><code>psi</code><br/>
<a href="#PSIStats"><code>PSIStats</code></a>
</td>
<td>
   <p>IO PSI stats.</p>
</td>
</tr>
</tbody>
</table>

## `InterfaceStats`     {#InterfaceStats}
    

**Appears in:**

- [NetworkStats](#NetworkStats)


<p>InterfaceStats contains resource value data about interface.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>The name of the interface</p>
</td>
</tr>
<tr><td><code>rxBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Cumulative count of bytes received.</p>
</td>
</tr>
<tr><td><code>rxErrors</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Cumulative count of receive errors encountered.</p>
</td>
</tr>
<tr><td><code>txBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Cumulative count of bytes transmitted.</p>
</td>
</tr>
<tr><td><code>txErrors</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Cumulative count of transmit errors encountered.</p>
</td>
</tr>
</tbody>
</table>

## `MemoryStats`     {#MemoryStats}
    

**Appears in:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)


<p>MemoryStats contains data about memory usage.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>time</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which these stats were updated.</p>
</td>
</tr>
<tr><td><code>availableBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Available memory for use.  This is defined as the memory limit - workingSetBytes.
If memory limit is undefined, the available bytes is omitted.</p>
</td>
</tr>
<tr><td><code>usageBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Total memory in use. This includes all memory regardless of when it was accessed.</p>
</td>
</tr>
<tr><td><code>workingSetBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>The amount of working set memory. This includes recently accessed memory,
dirty memory, and kernel memory. WorkingSetBytes is &lt;= UsageBytes</p>
</td>
</tr>
<tr><td><code>rssBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>The amount of anonymous and swap cache memory (includes transparent
hugepages).</p>
</td>
</tr>
<tr><td><code>pageFaults</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Cumulative number of minor page faults.</p>
</td>
</tr>
<tr><td><code>majorPageFaults</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Cumulative number of major page faults.</p>
</td>
</tr>
<tr><td><code>psi</code><br/>
<a href="#PSIStats"><code>PSIStats</code></a>
</td>
<td>
   <p>Memory PSI stats.</p>
</td>
</tr>
</tbody>
</table>

## `NetworkStats`     {#NetworkStats}
    

**Appears in:**

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)


<p>NetworkStats contains data about network resources.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>time</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which these stats were updated.</p>
</td>
</tr>
<tr><td><code>InterfaceStats</code> <B>[Required]</B><br/>
<a href="#InterfaceStats"><code>InterfaceStats</code></a>
</td>
<td>(Members of <code>InterfaceStats</code> are embedded into this type.)
   <p>Stats for the default interface, if found</p>
</td>
</tr>
<tr><td><code>interfaces</code> <B>[Required]</B><br/>
<a href="#InterfaceStats"><code>[]InterfaceStats</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>

## `NodeStats`     {#NodeStats}
    

**Appears in:**

- [Summary](#Summary)


<p>NodeStats holds node-level unprocessed sample stats.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>nodeName</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Reference to the measured Node.</p>
</td>
</tr>
<tr><td><code>systemContainers</code><br/>
<a href="#ContainerStats"><code>[]ContainerStats</code></a>
</td>
<td>
   <p>Stats of system daemons tracked as raw containers.
The system containers are named according to the SystemContainer* constants.</p>
</td>
</tr>
<tr><td><code>startTime</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which data collection for the node-scoped (i.e. aggregate) stats was (re)started.</p>
</td>
</tr>
<tr><td><code>cpu</code><br/>
<a href="#CPUStats"><code>CPUStats</code></a>
</td>
<td>
   <p>Stats pertaining to CPU resources.</p>
</td>
</tr>
<tr><td><code>memory</code><br/>
<a href="#MemoryStats"><code>MemoryStats</code></a>
</td>
<td>
   <p>Stats pertaining to memory (RAM) resources.</p>
</td>
</tr>
<tr><td><code>io</code><br/>
<a href="#IOStats"><code>IOStats</code></a>
</td>
<td>
   <p>Stats pertaining to IO resources.</p>
</td>
</tr>
<tr><td><code>network</code><br/>
<a href="#NetworkStats"><code>NetworkStats</code></a>
</td>
<td>
   <p>Stats pertaining to network resources.</p>
</td>
</tr>
<tr><td><code>fs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Stats pertaining to total usage of filesystem resources on the rootfs used by node k8s components.
NodeFs.Used is the total bytes used on the filesystem.</p>
</td>
</tr>
<tr><td><code>runtime</code><br/>
<a href="#RuntimeStats"><code>RuntimeStats</code></a>
</td>
<td>
   <p>Stats about the underlying container runtime.</p>
</td>
</tr>
<tr><td><code>rlimit</code><br/>
<a href="#RlimitStats"><code>RlimitStats</code></a>
</td>
<td>
   <p>Stats about the rlimit of system.</p>
</td>
</tr>
<tr><td><code>swap</code><br/>
<a href="#SwapStats"><code>SwapStats</code></a>
</td>
<td>
   <p>Stats pertaining to swap resources. This is reported to non-windows systems only.</p>
</td>
</tr>
</tbody>
</table>

## `PSIData`     {#PSIData}
    

**Appears in:**

- [PSIStats](#PSIStats)


<p>PSI data for an individual resource.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>total</code> <B>[Required]</B><br/>
<code>uint64</code>
</td>
<td>
   <p>Total time duration for tasks in the cgroup have waited due to congestion.
Unit: nanoseconds.</p>
</td>
</tr>
<tr><td><code>avg10</code> <B>[Required]</B><br/>
<code>float64</code>
</td>
<td>
   <p>The average (in %) tasks have waited due to congestion over a 10 second window.</p>
</td>
</tr>
<tr><td><code>avg60</code> <B>[Required]</B><br/>
<code>float64</code>
</td>
<td>
   <p>The average (in %) tasks have waited due to congestion over a 60 second window.</p>
</td>
</tr>
<tr><td><code>avg300</code> <B>[Required]</B><br/>
<code>float64</code>
</td>
<td>
   <p>The average (in %) tasks have waited due to congestion over a 300 second window.</p>
</td>
</tr>
</tbody>
</table>

## `PSIStats`     {#PSIStats}
    

**Appears in:**

- [CPUStats](#CPUStats)

- [IOStats](#IOStats)

- [MemoryStats](#MemoryStats)


<p>PSI statistics for an individual resource.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>full</code> <B>[Required]</B><br/>
<a href="#PSIData"><code>PSIData</code></a>
</td>
<td>
   <p>PSI data for all tasks in the cgroup.</p>
</td>
</tr>
<tr><td><code>some</code> <B>[Required]</B><br/>
<a href="#PSIData"><code>PSIData</code></a>
</td>
<td>
   <p>PSI data for some tasks in the cgroup.</p>
</td>
</tr>
</tbody>
</table>

## `PVCReference`     {#PVCReference}
    

**Appears in:**

- [VolumeStats](#VolumeStats)


<p>PVCReference contains enough information to describe the referenced PVC.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>namespace</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>

## `PodReference`     {#PodReference}
    

**Appears in:**

- [PodStats](#PodStats)


<p>PodReference contains enough information to locate the referenced pod.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>namespace</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>uid</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
</tbody>
</table>

## `PodStats`     {#PodStats}
    

**Appears in:**

- [Summary](#Summary)


<p>PodStats holds pod-level unprocessed sample stats.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>podRef</code> <B>[Required]</B><br/>
<a href="#PodReference"><code>PodReference</code></a>
</td>
<td>
   <p>Reference to the measured Pod.</p>
</td>
</tr>
<tr><td><code>startTime</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which data collection for the pod-scoped (e.g. network) stats was (re)started.</p>
</td>
</tr>
<tr><td><code>containers</code> <B>[Required]</B><br/>
<a href="#ContainerStats"><code>[]ContainerStats</code></a>
</td>
<td>
   <p>Stats of containers in the measured pod.</p>
</td>
</tr>
<tr><td><code>cpu</code><br/>
<a href="#CPUStats"><code>CPUStats</code></a>
</td>
<td>
   <p>Stats pertaining to CPU resources consumed by pod cgroup (which includes all containers' resource usage and pod overhead).</p>
</td>
</tr>
<tr><td><code>memory</code><br/>
<a href="#MemoryStats"><code>MemoryStats</code></a>
</td>
<td>
   <p>Stats pertaining to memory (RAM) resources consumed by pod cgroup (which includes all containers' resource usage and pod overhead).</p>
</td>
</tr>
<tr><td><code>io</code><br/>
<a href="#IOStats"><code>IOStats</code></a>
</td>
<td>
   <p>Stats pertaining to IO resources consumed by pod cgroup (which includes all containers' resource usage and pod overhead).</p>
</td>
</tr>
<tr><td><code>network</code><br/>
<a href="#NetworkStats"><code>NetworkStats</code></a>
</td>
<td>
   <p>Stats pertaining to network resources.</p>
</td>
</tr>
<tr><td><code>volume</code><br/>
<a href="#VolumeStats"><code>[]VolumeStats</code></a>
</td>
<td>
   <p>Stats pertaining to volume usage of filesystem resources.
VolumeStats.UsedBytes is the number of bytes used by the Volume</p>
</td>
</tr>
<tr><td><code>ephemeral-storage</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>EphemeralStorage reports the total filesystem usage for the containers and emptyDir-backed volumes in the measured Pod.</p>
</td>
</tr>
<tr><td><code>process_stats</code><br/>
<a href="#ProcessStats"><code>ProcessStats</code></a>
</td>
<td>
   <p>ProcessStats pertaining to processes.</p>
</td>
</tr>
<tr><td><code>swap</code><br/>
<a href="#SwapStats"><code>SwapStats</code></a>
</td>
<td>
   <p>Stats pertaining to swap resources. This is reported to non-windows systems only.</p>
</td>
</tr>
</tbody>
</table>

## `ProcessStats`     {#ProcessStats}
    

**Appears in:**

- [PodStats](#PodStats)


<p>ProcessStats are stats pertaining to processes.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>process_count</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Number of processes</p>
</td>
</tr>
</tbody>
</table>

## `RlimitStats`     {#RlimitStats}
    

**Appears in:**

- [NodeStats](#NodeStats)


<p>RlimitStats are stats rlimit of OS.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>time</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>maxpid</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   <p>The max number of extant process (threads, precisely on Linux) of OS. See RLIMIT_NPROC in getrlimit(2).
The operating system ceiling on the number of process IDs that can be assigned.
On Linux, tasks (either processes or threads) consume 1 PID each.</p>
</td>
</tr>
<tr><td><code>curproc</code> <B>[Required]</B><br/>
<code>int64</code>
</td>
<td>
   <p>The number of running process (threads, precisely on Linux) in the OS.</p>
</td>
</tr>
</tbody>
</table>

## `RuntimeStats`     {#RuntimeStats}
    

**Appears in:**

- [NodeStats](#NodeStats)


<p>RuntimeStats are stats pertaining to the underlying container runtime.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>imageFs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Stats about the underlying filesystem where container images are stored.
This filesystem could be the same as the primary (root) filesystem.
Usage here refers to the total number of bytes occupied by images on the filesystem.</p>
</td>
</tr>
<tr><td><code>containerFs</code><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>
   <p>Stats about the underlying filesystem where container's writeable layer is stored.
This filesystem could be the same as the primary (root) filesystem or the ImageFS.
Usage here refers to the total number of bytes occupied by the writeable layer on the filesystem.</p>
</td>
</tr>
</tbody>
</table>

## `SwapStats`     {#SwapStats}
    

**Appears in:**

- [ContainerStats](#ContainerStats)

- [NodeStats](#NodeStats)

- [PodStats](#PodStats)


<p>SwapStats contains data about memory usage</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>time</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which these stats were updated.</p>
</td>
</tr>
<tr><td><code>swapAvailableBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Available swap memory for use.  This is defined as the <!-- raw HTML omitted --> - <!-- raw HTML omitted -->.
If swap limit is undefined, this value is omitted.</p>
</td>
</tr>
<tr><td><code>swapUsageBytes</code><br/>
<code>uint64</code>
</td>
<td>
   <p>Total swap memory in use.</p>
</td>
</tr>
</tbody>
</table>

## `UserDefinedMetric`     {#UserDefinedMetric}
    

**Appears in:**

- [ContainerStats](#ContainerStats)


<p>UserDefinedMetric represents a metric defined and generated by users.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>UserDefinedMetricDescriptor</code> <B>[Required]</B><br/>
<a href="#UserDefinedMetricDescriptor"><code>UserDefinedMetricDescriptor</code></a>
</td>
<td>(Members of <code>UserDefinedMetricDescriptor</code> are embedded into this type.)
   <span class="text-muted">No description provided.</span></td>
</tr>
<tr><td><code>time</code> <B>[Required]</B><br/>
<a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.35/#time-v1-meta"><code>meta/v1.Time</code></a>
</td>
<td>
   <p>The time at which these stats were updated.</p>
</td>
</tr>
<tr><td><code>value</code> <B>[Required]</B><br/>
<code>float64</code>
</td>
<td>
   <p>Value of the metric. Float64s have 53 bit precision.
We do not foresee any metrics exceeding that value.</p>
</td>
</tr>
</tbody>
</table>

## `UserDefinedMetricDescriptor`     {#UserDefinedMetricDescriptor}
    

**Appears in:**

- [UserDefinedMetric](#UserDefinedMetric)


<p>UserDefinedMetricDescriptor contains metadata that describes a user defined metric.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>name</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>The name of the metric.</p>
</td>
</tr>
<tr><td><code>type</code> <B>[Required]</B><br/>
<a href="#UserDefinedMetricType"><code>UserDefinedMetricType</code></a>
</td>
<td>
   <p>Type of the metric.</p>
</td>
</tr>
<tr><td><code>units</code> <B>[Required]</B><br/>
<code>string</code>
</td>
<td>
   <p>Display Units for the stats.</p>
</td>
</tr>
<tr><td><code>labels</code><br/>
<code>map[string]string</code>
</td>
<td>
   <p>Metadata labels associated with this metric.</p>
</td>
</tr>
</tbody>
</table>

## `UserDefinedMetricType`     {#UserDefinedMetricType}
    
(Alias of `string`)

**Appears in:**

- [UserDefinedMetricDescriptor](#UserDefinedMetricDescriptor)


<p>UserDefinedMetricType defines how the metric should be interpreted by the user.</p>




## `VolumeHealthStats`     {#VolumeHealthStats}
    

**Appears in:**

- [VolumeStats](#VolumeStats)


<p>VolumeHealthStats contains data about volume health.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>abnormal</code> <B>[Required]</B><br/>
<code>bool</code>
</td>
<td>
   <p>Normal volumes are available for use and operating optimally.
An abnormal volume does not meet these criteria.</p>
</td>
</tr>
</tbody>
</table>

## `VolumeStats`     {#VolumeStats}
    

**Appears in:**

- [PodStats](#PodStats)


<p>VolumeStats contains data about Volume filesystem usage.</p>


<table class="table">
<thead><tr><th width="30%">Field</th><th>Description</th></tr></thead>
<tbody>
    
  
<tr><td><code>FsStats</code> <B>[Required]</B><br/>
<a href="#FsStats"><code>FsStats</code></a>
</td>
<td>(Members of <code>FsStats</code> are embedded into this type.)
   <p>Embedded FsStats</p>
</td>
</tr>
<tr><td><code>name</code><br/>
<code>string</code>
</td>
<td>
   <p>Name is the name given to the Volume</p>
</td>
</tr>
<tr><td><code>pvcRef</code><br/>
<a href="#PVCReference"><code>PVCReference</code></a>
</td>
<td>
   <p>Reference to the PVC, if one exists</p>
</td>
</tr>
<tr><td><code>volumeHealthStats</code><br/>
<a href="#VolumeHealthStats"><code>VolumeHealthStats</code></a>
</td>
<td>
   <p>VolumeHealthStats contains data about volume health</p>
</td>
</tr>
</tbody>
</table>