---
title: Kubernetes Metrics Reference
content_type: reference
auto_generated: true
description: >-
  Details of the metric data that Kubernetes components export.
---

## Metrics (v1.29)

<!-- (auto-generated 2023 Sep 01) -->
<!-- (auto-generated v1.29) -->
This page details the metrics that different Kubernetes components export. You can query the metrics endpoint for these 
components using an HTTP scrape, and fetch the current metrics data in Prometheus format.

### List of Stable Kubernetes Metrics

Stable metrics observe strict API contracts and no labels can be added or removed from stable metrics during their lifcetime.


<div class="metrics">
	<div class="metric_name">apiserver_admission_controller_admission_duration_seconds</div>
	<div>Admission controller latency histogram in seconds, identified by name and broken out for each operation and API resource and type (validate or admit).</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span><span class="separate-labels">operation</span><span class="separate-labels">rejected</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_step_admission_duration_seconds</div>
	<div>Admission sub-step latency histogram in seconds, broken out for each operation and API resource and step type (validate or admit).</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span><span class="separate-labels">rejected</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_webhook_admission_duration_seconds</div>
	<div>Admission webhook latency histogram in seconds, identified by name and broken out for each operation and API resource and type (validate or admit).</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span><span class="separate-labels">operation</span><span class="separate-labels">rejected</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_current_inflight_requests</div>
	<div>Maximal number of currently used inflight request limit of this apiserver per request kind in last second.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request_kind</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_longrunning_requests</div>
	<div>Gauge of all active long-running apiserver requests broken out by verb, group, version, resource, scope and component. Not all requests are tracked this way.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">component</span><span class="separate-labels">group</span><span class="separate-labels">resource</span><span class="separate-labels">scope</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_duration_seconds</div>
	<div>Response latency distribution in seconds for each verb, dry run value, group, version, resource, subresource, scope and component.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">component</span><span class="separate-labels">dry_run</span><span class="separate-labels">group</span><span class="separate-labels">resource</span><span class="separate-labels">scope</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_total</div>
	<div>Counter of apiserver requests broken out for each verb, dry run value, group, version, resource, scope, component, and HTTP response code.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">component</span><span class="separate-labels">dry_run</span><span class="separate-labels">group</span><span class="separate-labels">resource</span><span class="separate-labels">scope</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_requested_deprecated_apis</div>
	<div>Gauge of deprecated APIs that have been requested, broken out by API group, version, resource, subresource, and removed_release.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">group</span><span class="separate-labels">removed_release</span><span class="separate-labels">resource</span><span class="separate-labels">subresource</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_response_sizes</div>
	<div>Response size distribution in bytes for each group, version, verb, resource, subresource, scope and component.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">component</span><span class="separate-labels">group</span><span class="separate-labels">resource</span><span class="separate-labels">scope</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_objects</div>
	<div>Number of stored objects at the time of last check split by kind.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">container_cpu_usage_seconds_total</div>
	<div>Cumulative cpu time consumed by the container in core-seconds</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container</span><span class="separate-labels">pod</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">container_memory_working_set_bytes</div>
	<div>Current working set of the container in bytes</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container</span><span class="separate-labels">pod</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">container_start_time_seconds</div>
	<div>Start time of the container since unix epoch in seconds</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container</span><span class="separate-labels">pod</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cronjob_controller_job_creation_skew_duration_seconds</div>
	<div>Time between when a cronjob is scheduled to be run, and when the corresponding job is created</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">job_controller_job_pods_finished_total</div>
	<div>The number of finished Pods that are fully tracked</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">completion_mode</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">job_controller_job_sync_duration_seconds</div>
	<div>The time it took to sync a job</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">action</span><span class="separate-labels">completion_mode</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">job_controller_job_syncs_total</div>
	<div>The number of job syncs</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">action</span><span class="separate-labels">completion_mode</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">job_controller_jobs_finished_total</div>
	<div>The number of finished jobs</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">completion_mode</span><span class="separate-labels">reason</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_pod_resource_limit</div>
	<div>Resources limit for workloads on the cluster, broken down by pod. This shows the resource usage the scheduler and kubelet expect per pod for resources along with the unit for the resource if any.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">pod</span><span class="separate-labels">node</span><span class="separate-labels">scheduler</span><span class="separate-labels">priority</span><span class="separate-labels">resource</span><span class="separate-labels">unit</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_pod_resource_request</div>
	<div>Resources requested by workloads on the cluster, broken down by pod. This shows the resource usage the scheduler and kubelet expect per pod for resources along with the unit for the resource if any.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">pod</span><span class="separate-labels">node</span><span class="separate-labels">scheduler</span><span class="separate-labels">priority</span><span class="separate-labels">resource</span><span class="separate-labels">unit</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_collector_evictions_total</div>
	<div>Number of Node evictions that happened since current instance of NodeController started.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">zone</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_cpu_usage_seconds_total</div>
	<div>Cumulative cpu time consumed by the node in core-seconds</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_memory_working_set_bytes</div>
	<div>Current working set of the node in bytes</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pod_cpu_usage_seconds_total</div>
	<div>Cumulative cpu time consumed by the pod in core-seconds</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">pod</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pod_memory_working_set_bytes</div>
	<div>Current working set of the pod in bytes</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">pod</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">resource_scrape_error</div>
	<div>1 if there was an error while getting container metrics, 0 otherwise</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_framework_extension_point_duration_seconds</div>
	<div>Latency for running all plugins of a specific extension point.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">extension_point</span><span class="separate-labels">profile</span><span class="separate-labels">status</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_pending_pods</div>
	<div>Number of pending pods, by the queue type. 'active' means number of pods in activeQ; 'backoff' means number of pods in backoffQ; 'unschedulable' means number of pods in unschedulablePods that the scheduler attempted to schedule and failed; 'gated' is the number of unschedulable pods that the scheduler never attempted to schedule because they are gated.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">queue</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_pod_scheduling_attempts</div>
	<div>Number of attempts to successfully schedule a pod.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_pod_scheduling_duration_seconds</div>
	<div>E2e latency for a pod being scheduled which may include multiple scheduling attempts.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">attempts</span></li>
	<div class="metric_labels_constant"></div>
	<li class="metric_deprecated_version"><span class="metric-data">Deprecated Versions:</span>1.28.0</li>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_preemption_attempts_total</div>
	<div>Total preemption attempts in the cluster till now</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_preemption_victims</div>
	<div>Number of selected preemption victims</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_queue_incoming_pods_total</div>
	<div>Number of pods added to scheduling queues by event and queue type.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">event</span><span class="separate-labels">queue</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_schedule_attempts_total</div>
	<div>Number of attempts to schedule pods, by the result. 'unschedulable' means a pod could not be scheduled, while 'error' means an internal scheduler problem.</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">profile</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_scheduling_attempt_duration_seconds</div>
	<div>Scheduling attempt latency in seconds (scheduling algorithm + binding)</div>
	<ul>
	<li data-stability="stable"><span class="metric-data">Stability Level:</span>STABLE</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">profile</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>

### List of Beta Kubernetes Metrics

Beta metrics observe a looser API contract than its stable counterparts. No labels can be removed from beta metrics during their lifetime, however, labels can be added while the metric is in the beta stage. This offers the assurance that beta metrics will honor existing dashboards and alerts, while allowing for amendments in the future. 


<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_current_executing_requests</div>
	<div>Number of requests in initial (for a WATCH) or any (for a non-WATCH) execution stage in the API Priority and Fairness subsystem</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_current_executing_seats</div>
	<div>Concurrency (number of seats) occupied by the currently executing (initial stage for a WATCH, any stage otherwise) requests in the API Priority and Fairness subsystem</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_current_inqueue_requests</div>
	<div>Number of requests currently pending in queues of the API Priority and Fairness subsystem</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_dispatched_requests_total</div>
	<div>Number of requests executed by API Priority and Fairness subsystem</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_nominal_limit_seats</div>
	<div>Nominal number of execution seats configured for each priority level</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_rejected_requests_total</div>
	<div>Number of requests rejected by API Priority and Fairness subsystem</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span><span class="separate-labels">reason</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_request_wait_duration_seconds</div>
	<div>Length of time a request spent waiting in its queue</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">execute</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">disabled_metrics_total</div>
	<div>The count of disabled metrics.</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">hidden_metrics_total</div>
	<div>The count of hidden metrics.</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubernetes_feature_enabled</div>
	<div>This metric records the data about the stage and enablement of a k8s feature.</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span><span class="separate-labels">stage</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubernetes_healthcheck</div>
	<div>This metric records the result of a single healthcheck.</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubernetes_healthchecks_total</div>
	<div>This metric records the results of all healthcheck.</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span><span class="separate-labels">status</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">registered_metrics_total</div>
	<div>The count of registered metrics broken by stability level and deprecation version.</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">deprecated_version</span><span class="separate-labels">stability_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_pod_scheduling_sli_duration_seconds</div>
	<div>E2e latency for a pod being scheduled, from the time the pod enters the scheduling queue an d might involve multiple scheduling attempts.</div>
	<ul>
	<li data-stability="beta"><span class="metric-data">Stability Level:</span>BETA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">attempts</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>

### List of Alpha Kubernetes Metrics

Alpha metrics do not have any API guarantees. These metrics must be used at your own risk, subsequent versions of Kubernetes may remove these metrics altogether, or mutate the API in such a way that breaks existing dashboards and alerts. 


<div class="metrics">
	<div class="metric_name">aggregator_discovery_aggregation_count_total</div>
	<div>Counter of number of times discovery was aggregated</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">aggregator_openapi_v2_regeneration_count</div>
	<div>Counter of OpenAPI v2 spec regeneration count broken down by causing APIService name and reason.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">apiservice</span><span class="separate-labels">reason</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">aggregator_openapi_v2_regeneration_duration</div>
	<div>Gauge of OpenAPI v2 spec regeneration duration in seconds.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">reason</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">aggregator_unavailable_apiservice</div>
	<div>Gauge of APIServices which are marked as unavailable broken down by APIService name.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">aggregator_unavailable_apiservice_total</div>
	<div>Counter of APIServices which are marked as unavailable broken down by APIService name and reason.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span><span class="separate-labels">reason</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiextensions_openapi_v2_regeneration_count</div>
	<div>Counter of OpenAPI v2 spec regeneration count broken down by causing CRD name and reason.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">crd</span><span class="separate-labels">reason</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiextensions_openapi_v3_regeneration_count</div>
	<div>Counter of OpenAPI v3 spec regeneration count broken down by group, version, causing CRD and reason.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">crd</span><span class="separate-labels">group</span><span class="separate-labels">reason</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_match_condition_evaluation_errors_total</div>
	<div>Admission match condition evaluation errors count, identified by name of resource containing the match condition and broken out for each kind containing matchConditions (webhook or policy), operation and admission type (validate or admit).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">kind</span><span class="separate-labels">name</span><span class="separate-labels">operation</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_match_condition_evaluation_seconds</div>
	<div>Admission match condition evaluation time in seconds, identified by name and broken out for each kind containing matchConditions (webhook or policy), operation and type (validate or admit).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">kind</span><span class="separate-labels">name</span><span class="separate-labels">operation</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_match_condition_exclusions_total</div>
	<div>Admission match condition evaluation exclusions count, identified by name of resource containing the match condition and broken out for each kind containing matchConditions (webhook or policy), operation and admission type (validate or admit).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">kind</span><span class="separate-labels">name</span><span class="separate-labels">operation</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_step_admission_duration_seconds_summary</div>
	<div>Admission sub-step latency summary in seconds, broken out for each operation and API resource and step type (validate or admit).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="summary"><span class="metric-data">Type:</span>Summary</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span><span class="separate-labels">rejected</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_webhook_fail_open_count</div>
	<div>Admission webhook fail open count, identified by name and broken out for each admission type (validating or mutating).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_webhook_rejection_count</div>
	<div>Admission webhook rejection count, identified by name and broken out for each admission type (validating or admit) and operation. Additional labels specify an error type (calling_webhook_error or apiserver_internal_error if an error occurred; no_error otherwise) and optionally a non-zero rejection code if the webhook rejects the request with an HTTP status code (honored by the apiserver when the code is greater or equal to 400). Codes greater than 600 are truncated to 600, to keep the metrics cardinality bounded.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">error_type</span><span class="separate-labels">name</span><span class="separate-labels">operation</span><span class="separate-labels">rejection_code</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_admission_webhook_request_total</div>
	<div>Admission webhook request total, identified by name and broken out for each admission type (validating or mutating) and operation. Additional labels specify whether the request was rejected or not and an HTTP status code. Codes greater than 600 are truncated to 600, to keep the metrics cardinality bounded.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">name</span><span class="separate-labels">operation</span><span class="separate-labels">rejected</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_audit_error_total</div>
	<div>Counter of audit events that failed to be audited properly. Plugin identifies the plugin affected by the error.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">plugin</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_audit_event_total</div>
	<div>Counter of audit events generated and sent to the audit backend.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_audit_level_total</div>
	<div>Counter of policy levels for audit events (1 per request).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_audit_requests_rejected_total</div>
	<div>Counter of apiserver requests rejected due to an error in audit logging backend.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_cache_list_fetched_objects_total</div>
	<div>Number of objects read from watch cache in the course of serving a LIST request</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">index</span><span class="separate-labels">resource_prefix</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_cache_list_returned_objects_total</div>
	<div>Number of objects returned for a LIST request from watch cache</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource_prefix</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_cache_list_total</div>
	<div>Number of LIST requests served from watch cache</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">index</span><span class="separate-labels">resource_prefix</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_cel_compilation_duration_seconds</div>
	<div>CEL compilation time in seconds.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_cel_evaluation_duration_seconds</div>
	<div>CEL evaluation time in seconds.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_certificates_registry_csr_honored_duration_total</div>
	<div>Total number of issued CSRs with a requested duration that was honored, sliced by signer (only kubernetes.io signer names are specifically identified)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">signerName</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_certificates_registry_csr_requested_duration_total</div>
	<div>Total number of issued CSRs with a requested duration, sliced by signer (only kubernetes.io signer names are specifically identified)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">signerName</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_client_certificate_expiration_seconds</div>
	<div>Distribution of the remaining lifetime on the certificate used to authenticate a request.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_conversion_webhook_duration_seconds</div>
	<div>Conversion webhook request latency</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">failure_type</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_conversion_webhook_request_total</div>
	<div>Counter for conversion webhook requests with success/failure and failure error type</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">failure_type</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_crd_conversion_webhook_duration_seconds</div>
	<div>CRD webhook conversion duration in seconds</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">crd_name</span><span class="separate-labels">from_version</span><span class="separate-labels">succeeded</span><span class="separate-labels">to_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_current_inqueue_requests</div>
	<div>Maximal number of queued requests in this apiserver per request kind in last second.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request_kind</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_delegated_authn_request_duration_seconds</div>
	<div>Request latency in seconds. Broken down by status code.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_delegated_authn_request_total</div>
	<div>Number of HTTP requests partitioned by status code.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_delegated_authz_request_duration_seconds</div>
	<div>Request latency in seconds. Broken down by status code.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_delegated_authz_request_total</div>
	<div>Number of HTTP requests partitioned by status code.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_egress_dialer_dial_duration_seconds</div>
	<div>Dial latency histogram in seconds, labeled by the protocol (http-connect or grpc), transport (tcp or uds)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">protocol</span><span class="separate-labels">transport</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_egress_dialer_dial_failure_count</div>
	<div>Dial failure count, labeled by the protocol (http-connect or grpc), transport (tcp or uds), and stage (connect or proxy). The stage indicates at which stage the dial failed</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">protocol</span><span class="separate-labels">stage</span><span class="separate-labels">transport</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_egress_dialer_dial_start_total</div>
	<div>Dial starts, labeled by the protocol (http-connect or grpc) and transport (tcp or uds).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">protocol</span><span class="separate-labels">transport</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_encryption_config_controller_automatic_reload_failures_total</div>
	<div>Total number of failed automatic reloads of encryption configuration.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_encryption_config_controller_automatic_reload_last_timestamp_seconds</div>
	<div>Timestamp of the last successful or failed automatic reload of encryption configuration.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">status</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_encryption_config_controller_automatic_reload_success_total</div>
	<div>Total number of successful automatic reloads of encryption configuration.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_envelope_encryption_dek_cache_fill_percent</div>
	<div>Percent of the cache slots currently occupied by cached DEKs.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_envelope_encryption_dek_cache_inter_arrival_time_seconds</div>
	<div>Time (in seconds) of inter arrival of transformation requests.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">transformation_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_envelope_encryption_dek_source_cache_size</div>
	<div>Number of records in data encryption key (DEK) source cache. On a restart, this value is an approximation of the number of decrypt RPC calls the server will make to the KMS plugin.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">provider_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_envelope_encryption_invalid_key_id_from_status_total</div>
	<div>Number of times an invalid keyID is returned by the Status RPC call split by error.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">error</span><span class="separate-labels">provider_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_envelope_encryption_key_id_hash_last_timestamp_seconds</div>
	<div>The last time in seconds when a keyID was used.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">key_id_hash</span><span class="separate-labels">provider_name</span><span class="separate-labels">transformation_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_envelope_encryption_key_id_hash_status_last_timestamp_seconds</div>
	<div>The last time in seconds when a keyID was returned by the Status RPC call.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">key_id_hash</span><span class="separate-labels">provider_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_envelope_encryption_key_id_hash_total</div>
	<div>Number of times a keyID is used split by transformation type and provider.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">key_id_hash</span><span class="separate-labels">provider_name</span><span class="separate-labels">transformation_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_envelope_encryption_kms_operations_latency_seconds</div>
	<div>KMS operation duration with gRPC error code status total.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">grpc_status_code</span><span class="separate-labels">method_name</span><span class="separate-labels">provider_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_current_inqueue_seats</div>
	<div>Number of seats currently pending in queues of the API Priority and Fairness subsystem</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_current_limit_seats</div>
	<div>current derived number of execution seats available to each priority level</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_current_r</div>
	<div>R(time of last change)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_demand_seats</div>
	<div>Observations, at the end of every nanosecond, of (the number of seats each priority level could use) / (nominal number of seats for that level)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="timingratiohistogram"><span class="metric-data">Type:</span>TimingRatioHistogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_demand_seats_average</div>
	<div>Time-weighted average, over last adjustment period, of demand_seats</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_demand_seats_high_watermark</div>
	<div>High watermark, over last adjustment period, of demand_seats</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_demand_seats_smoothed</div>
	<div>Smoothed seat demands</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_demand_seats_stdev</div>
	<div>Time-weighted standard deviation, over last adjustment period, of demand_seats</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_dispatch_r</div>
	<div>R(time of last dispatch)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_epoch_advance_total</div>
	<div>Number of times the queueset's progress meter jumped backward</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span><span class="separate-labels">success</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_latest_s</div>
	<div>S(most recently dispatched request)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_lower_limit_seats</div>
	<div>Configured lower bound on number of execution seats available to each priority level</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_next_discounted_s_bounds</div>
	<div>min and max, over queues, of S(oldest waiting request in queue) - estimated work in progress</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">bound</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_next_s_bounds</div>
	<div>min and max, over queues, of S(oldest waiting request in queue)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">bound</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_priority_level_request_utilization</div>
	<div>Observations, at the end of every nanosecond, of number of requests (as a fraction of the relevant limit) waiting or in any stage of execution (but only initial stage for WATCHes)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="timingratiohistogram"><span class="metric-data">Type:</span>TimingRatioHistogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">phase</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_priority_level_seat_utilization</div>
	<div>Observations, at the end of every nanosecond, of utilization of seats for any stage of execution (but only initial stage for WATCHes)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="timingratiohistogram"><span class="metric-data">Type:</span>TimingRatioHistogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<li class="metric_labels_constant"><span class="metric-data">Const Labels:</span><span class="metric_label">phase:executing</span></li>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_read_vs_write_current_requests</div>
	<div>Observations, at the end of every nanosecond, of the number of requests (as a fraction of the relevant limit) waiting or in regular stage of execution</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="timingratiohistogram"><span class="metric-data">Type:</span>TimingRatioHistogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">phase</span><span class="separate-labels">request_kind</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_request_concurrency_in_use</div>
	<div>Concurrency (number of seats) occupied by the currently executing (initial stage for a WATCH, any stage otherwise) requests in the API Priority and Fairness subsystem</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<li class="metric_deprecated_version"><span class="metric-data">Deprecated Versions:</span>1.31.0</li>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_request_concurrency_limit</div>
	<div>Nominal number of execution seats configured for each priority level</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<li class="metric_deprecated_version"><span class="metric-data">Deprecated Versions:</span>1.30.0</li>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_request_dispatch_no_accommodation_total</div>
	<div>Number of times a dispatch attempt resulted in a non accommodation due to lack of available seats</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_request_execution_seconds</div>
	<div>Duration of initial stage (for a WATCH) or any (for a non-WATCH) stage of request execution in the API Priority and Fairness subsystem</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_request_queue_length_after_enqueue</div>
	<div>Length of queue in the API Priority and Fairness subsystem, as seen by each request after it is enqueued</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_seat_fair_frac</div>
	<div>Fair fraction of server's concurrency to allocate to each priority level that can use it</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_target_seats</div>
	<div>Seat allocation targets</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_upper_limit_seats</div>
	<div>Configured upper bound on number of execution seats available to each priority level</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_watch_count_samples</div>
	<div>count of watchers for mutating requests in API Priority and Fairness</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_flowcontrol_work_estimated_seats</div>
	<div>Number of estimated seats (maximum of initial and final seats) associated with requests in API Priority and Fairness</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">flow_schema</span><span class="separate-labels">priority_level</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_init_events_total</div>
	<div>Counter of init events processed in watch cache broken by resource type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_kube_aggregator_x509_insecure_sha1_total</div>
	<div>Counts the number of requests to servers with insecure SHA1 signatures in their serving certificate OR the number of connection failures due to the insecure SHA1 signatures (either/or, based on the runtime environment)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_kube_aggregator_x509_missing_san_total</div>
	<div>Counts the number of requests to servers missing SAN extension in their serving certificate OR the number of connection failures due to the lack of x509 certificate SAN extension missing (either/or, based on the runtime environment)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_aborts_total</div>
	<div>Number of requests which apiserver aborted possibly due to a timeout, for each group, version, verb, resource, subresource and scope</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">group</span><span class="separate-labels">resource</span><span class="separate-labels">scope</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_body_sizes</div>
	<div>Apiserver request body sizes broken out by size.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span><span class="separate-labels">verb</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_filter_duration_seconds</div>
	<div>Request filter latency distribution in seconds, for each filter type</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">filter</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_post_timeout_total</div>
	<div>Tracks the activity of the request handlers after the associated requests have been timed out by the apiserver</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">source</span><span class="separate-labels">status</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_sli_duration_seconds</div>
	<div>Response latency distribution (not counting webhook duration and priority & fairness queue wait times) in seconds for each verb, group, version, resource, subresource, scope and component.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">component</span><span class="separate-labels">group</span><span class="separate-labels">resource</span><span class="separate-labels">scope</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_slo_duration_seconds</div>
	<div>Response latency distribution (not counting webhook duration and priority & fairness queue wait times) in seconds for each verb, group, version, resource, subresource, scope and component.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">component</span><span class="separate-labels">group</span><span class="separate-labels">resource</span><span class="separate-labels">scope</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<li class="metric_deprecated_version"><span class="metric-data">Deprecated Versions:</span>1.27.0</li>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_terminations_total</div>
	<div>Number of requests which apiserver terminated in self-defense.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">component</span><span class="separate-labels">group</span><span class="separate-labels">resource</span><span class="separate-labels">scope</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_request_timestamp_comparison_time</div>
	<div>Time taken for comparison of old vs new objects in UPDATE or PATCH requests</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code_path</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_rerouted_request_total</div>
	<div>Total number of requests that were proxied to a peer kube apiserver because the local apiserver was not capable of serving it</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_selfrequest_total</div>
	<div>Counter of apiserver self-requests broken out for each verb, API resource and subresource.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span><span class="separate-labels">subresource</span><span class="separate-labels">verb</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_data_key_generation_duration_seconds</div>
	<div>Latencies in seconds of data encryption key(DEK) generation operations.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_data_key_generation_failures_total</div>
	<div>Total number of failed data encryption key(DEK) generation operations.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_db_total_size_in_bytes</div>
	<div>Total size of the storage database file physically allocated in bytes.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">endpoint</span></li>
	<div class="metric_labels_constant"></div>
	<li class="metric_deprecated_version"><span class="metric-data">Deprecated Versions:</span>1.28.0</li>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_decode_errors_total</div>
	<div>Number of stored object decode errors split by object type</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_envelope_transformation_cache_misses_total</div>
	<div>Total number of cache misses while accessing key decryption key(KEK).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_events_received_total</div>
	<div>Number of etcd events received split by kind.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_list_evaluated_objects_total</div>
	<div>Number of objects tested in the course of serving a LIST request from storage</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_list_fetched_objects_total</div>
	<div>Number of objects read from storage in the course of serving a LIST request</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_list_returned_objects_total</div>
	<div>Number of objects returned for a LIST request from storage</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_list_total</div>
	<div>Number of LIST requests served from storage</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_size_bytes</div>
	<div>Size of the storage database file physically allocated in bytes.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">cluster</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_transformation_duration_seconds</div>
	<div>Latencies in seconds of value transformation operations.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">transformation_type</span><span class="separate-labels">transformer_prefix</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_storage_transformation_operations_total</div>
	<div>Total number of transformations. Successful transformation will have a status 'OK' and a varied status string when the transformation fails. This status and transformation_type fields may be used for alerting on encryption/decryption failure using transformation_type from_storage for decryption and to_storage for encryption</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">status</span><span class="separate-labels">transformation_type</span><span class="separate-labels">transformer_prefix</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_terminated_watchers_total</div>
	<div>Counter of watchers closed due to unresponsiveness broken by resource type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_tls_handshake_errors_total</div>
	<div>Number of requests dropped with 'TLS handshake error from' error</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_validating_admission_policy_check_duration_seconds</div>
	<div>Validation admission latency for individual validation expressions in seconds, labeled by policy and further including binding, state and enforcement action taken.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">enforcement_action</span><span class="separate-labels">policy</span><span class="separate-labels">policy_binding</span><span class="separate-labels">state</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_validating_admission_policy_check_total</div>
	<div>Validation admission policy check total, labeled by policy and further identified by binding, enforcement action taken, and state.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">enforcement_action</span><span class="separate-labels">policy</span><span class="separate-labels">policy_binding</span><span class="separate-labels">state</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_validating_admission_policy_definition_total</div>
	<div>Validation admission policy count total, labeled by state and enforcement action.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">enforcement_action</span><span class="separate-labels">state</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_watch_cache_events_dispatched_total</div>
	<div>Counter of events dispatched in watch cache broken by resource type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_watch_cache_events_received_total</div>
	<div>Counter of events received in watch cache broken by resource type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_watch_cache_initializations_total</div>
	<div>Counter of watch cache initializations broken by resource type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_watch_events_sizes</div>
	<div>Watch event size distribution in bytes</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">group</span><span class="separate-labels">kind</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_watch_events_total</div>
	<div>Number of events sent in watch clients</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">group</span><span class="separate-labels">kind</span><span class="separate-labels">version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_webhooks_x509_insecure_sha1_total</div>
	<div>Counts the number of requests to servers with insecure SHA1 signatures in their serving certificate OR the number of connection failures due to the insecure SHA1 signatures (either/or, based on the runtime environment)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">apiserver_webhooks_x509_missing_san_total</div>
	<div>Counts the number of requests to servers missing SAN extension in their serving certificate OR the number of connection failures due to the lack of x509 certificate SAN extension missing (either/or, based on the runtime environment)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">attach_detach_controller_attachdetach_controller_forced_detaches</div>
	<div>Number of times the A/D Controller performed a forced detach</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">reason</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">attachdetach_controller_total_volumes</div>
	<div>Number of volumes in A/D Controller</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">plugin_name</span><span class="separate-labels">state</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authenticated_user_requests</div>
	<div>Counter of authenticated requests broken out by username.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">username</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authentication_attempts</div>
	<div>Counter of authenticated attempts.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authentication_duration_seconds</div>
	<div>Authentication duration in seconds broken out by result.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authentication_token_cache_active_fetch_count</div>
	<div></div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">status</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authentication_token_cache_fetch_total</div>
	<div></div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">status</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authentication_token_cache_request_duration_seconds</div>
	<div></div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">status</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authentication_token_cache_request_total</div>
	<div></div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">status</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authorization_attempts_total</div>
	<div>Counter of authorization attempts broken down by result. It can be either 'allowed', 'denied', 'no-opinion' or 'error'.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">authorization_duration_seconds</div>
	<div>Authorization duration in seconds broken out by result.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloud_provider_webhook_request_duration_seconds</div>
	<div>Request latency in seconds. Broken down by status code.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">webhook</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloud_provider_webhook_request_total</div>
	<div>Number of HTTP requests partitioned by status code.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">webhook</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_azure_api_request_duration_seconds</div>
	<div>Latency of an Azure API call</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request</span><span class="separate-labels">resource_group</span><span class="separate-labels">source</span><span class="separate-labels">subscription_id</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_azure_api_request_errors</div>
	<div>Number of errors for an Azure API call</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request</span><span class="separate-labels">resource_group</span><span class="separate-labels">source</span><span class="separate-labels">subscription_id</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_azure_api_request_ratelimited_count</div>
	<div>Number of rate limited Azure API calls</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request</span><span class="separate-labels">resource_group</span><span class="separate-labels">source</span><span class="separate-labels">subscription_id</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_azure_api_request_throttled_count</div>
	<div>Number of throttled Azure API calls</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request</span><span class="separate-labels">resource_group</span><span class="separate-labels">source</span><span class="separate-labels">subscription_id</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_azure_op_duration_seconds</div>
	<div>Latency of an Azure service operation</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request</span><span class="separate-labels">resource_group</span><span class="separate-labels">source</span><span class="separate-labels">subscription_id</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_azure_op_failure_count</div>
	<div>Number of failed Azure service operations</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request</span><span class="separate-labels">resource_group</span><span class="separate-labels">source</span><span class="separate-labels">subscription_id</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_gce_api_request_duration_seconds</div>
	<div>Latency of a GCE API call</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">region</span><span class="separate-labels">request</span><span class="separate-labels">version</span><span class="separate-labels">zone</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_gce_api_request_errors</div>
	<div>Number of errors for an API call</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">region</span><span class="separate-labels">request</span><span class="separate-labels">version</span><span class="separate-labels">zone</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_vsphere_api_request_duration_seconds</div>
	<div>Latency of vsphere api call</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_vsphere_api_request_errors</div>
	<div>vsphere Api errors</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_vsphere_operation_duration_seconds</div>
	<div>Latency of vsphere operation call</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_vsphere_operation_errors</div>
	<div>vsphere operation errors</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">cloudprovider_vsphere_vcenter_versions</div>
	<div>Versions for connected vSphere vCenters</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">hostname</span><span class="separate-labels">version</span><span class="separate-labels">build</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">container_swap_usage_bytes</div>
	<div>Current amount of the container swap usage in bytes. Reported only on non-windows systems</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container</span><span class="separate-labels">pod</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">csi_operations_seconds</div>
	<div>Container Storage Interface operation duration with gRPC error code status total</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">driver_name</span><span class="separate-labels">grpc_status_code</span><span class="separate-labels">method_name</span><span class="separate-labels">migrated</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_controller_changes</div>
	<div>Number of EndpointSlice changes</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_controller_desired_endpoint_slices</div>
	<div>Number of EndpointSlices that would exist with perfect endpoint allocation</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_controller_endpoints_added_per_sync</div>
	<div>Number of endpoints added on each Service sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_controller_endpoints_desired</div>
	<div>Number of endpoints desired</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_controller_endpoints_removed_per_sync</div>
	<div>Number of endpoints removed on each Service sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_controller_endpointslices_changed_per_sync</div>
	<div>Number of EndpointSlices changed on each Service sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">topology</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_controller_num_endpoint_slices</div>
	<div>Number of EndpointSlices</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_controller_syncs</div>
	<div>Number of EndpointSlice syncs</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_addresses_skipped_per_sync</div>
	<div>Number of addresses skipped on each Endpoints sync due to being invalid or exceeding MaxEndpointsPerSubset</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_changes</div>
	<div>Number of EndpointSlice changes</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_desired_endpoint_slices</div>
	<div>Number of EndpointSlices that would exist with perfect endpoint allocation</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_endpoints_added_per_sync</div>
	<div>Number of endpoints added on each Endpoints sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_endpoints_desired</div>
	<div>Number of endpoints desired</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_endpoints_removed_per_sync</div>
	<div>Number of endpoints removed on each Endpoints sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_endpoints_sync_duration</div>
	<div>Duration of syncEndpoints() in seconds</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_endpoints_updated_per_sync</div>
	<div>Number of endpoints updated on each Endpoints sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">endpoint_slice_mirroring_controller_num_endpoint_slices</div>
	<div>Number of EndpointSlices</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">ephemeral_volume_controller_create_failures_total</div>
	<div>Number of PersistenVolumeClaims creation requests</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">ephemeral_volume_controller_create_total</div>
	<div>Number of PersistenVolumeClaims creation requests</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">etcd_bookmark_counts</div>
	<div>Number of etcd bookmarks (progress notify events) split by kind.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">etcd_lease_object_counts</div>
	<div>Number of objects attached to a single etcd lease.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">etcd_request_duration_seconds</div>
	<div>Etcd request latency in seconds for each operation and object type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">etcd_request_errors_total</div>
	<div>Etcd failed request counts for each operation and object type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">etcd_requests_total</div>
	<div>Etcd request counts for each operation and object type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">etcd_version_info</div>
	<div>Etcd server's binary version</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">binary_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">field_validation_request_duration_seconds</div>
	<div>Response latency distribution in seconds for each field validation value</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">field_validation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">force_cleaned_failed_volume_operation_errors_total</div>
	<div>The number of volumes that failed force cleanup after their reconstruction failed during kubelet startup.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">force_cleaned_failed_volume_operations_total</div>
	<div>The number of volumes that were force cleaned after their reconstruction failed during kubelet startup. This includes both successful and failed cleanups.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">garbagecollector_controller_resources_sync_error_total</div>
	<div>Number of garbage collector resources sync errors</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">get_token_count</div>
	<div>Counter of total Token() requests to the alternate token source</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">get_token_fail_count</div>
	<div>Counter of failed Token() requests to the alternate token source</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">horizontal_pod_autoscaler_controller_metric_computation_duration_seconds</div>
	<div>The time(seconds) that the HPA controller takes to calculate one metric. The label 'action' should be either 'scale_down', 'scale_up', or 'none'. The label 'error' should be either 'spec', 'internal', or 'none'. The label 'metric_type' corresponds to HPA.spec.metrics[*].type</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">action</span><span class="separate-labels">error</span><span class="separate-labels">metric_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">horizontal_pod_autoscaler_controller_metric_computation_total</div>
	<div>Number of metric computations. The label 'action' should be either 'scale_down', 'scale_up', or 'none'. Also, the label 'error' should be either 'spec', 'internal', or 'none'. The label 'metric_type' corresponds to HPA.spec.metrics[*].type</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">action</span><span class="separate-labels">error</span><span class="separate-labels">metric_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">horizontal_pod_autoscaler_controller_reconciliation_duration_seconds</div>
	<div>The time(seconds) that the HPA controller takes to reconcile once. The label 'action' should be either 'scale_down', 'scale_up', or 'none'. Also, the label 'error' should be either 'spec', 'internal', or 'none'. Note that if both spec and internal errors happen during a reconciliation, the first one to occur is reported in `error` label.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">action</span><span class="separate-labels">error</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">horizontal_pod_autoscaler_controller_reconciliations_total</div>
	<div>Number of reconciliations of HPA controller. The label 'action' should be either 'scale_down', 'scale_up', or 'none'. Also, the label 'error' should be either 'spec', 'internal', or 'none'. Note that if both spec and internal errors happen during a reconciliation, the first one to occur is reported in `error` label.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">action</span><span class="separate-labels">error</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">job_controller_pod_failures_handled_by_failure_policy_total</div>
	<div>`The number of failed Pods handled by failure policy with, 			respect to the failure policy action applied based on the matched, 			rule. Possible values of the action label correspond to the, 			possible values for the failure policy rule action, which are:, 			"FailJob", "Ignore" and "Count".`</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">action</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">job_controller_terminated_pods_tracking_finalizer_total</div>
	<div>`The number of terminated pods (phase=Failed|Succeeded), that have the finalizer batch.kubernetes.io/job-tracking, The event label can be "add" or "delete".`</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">event</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_clusterip_allocator_allocated_ips</div>
	<div>Gauge measuring the number of allocated IPs for Services</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">cidr</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_clusterip_allocator_allocation_errors_total</div>
	<div>Number of errors trying to allocate Cluster IPs</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">cidr</span><span class="separate-labels">scope</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_clusterip_allocator_allocation_total</div>
	<div>Number of Cluster IPs allocations</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">cidr</span><span class="separate-labels">scope</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_clusterip_allocator_available_ips</div>
	<div>Gauge measuring the number of available IPs for Services</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">cidr</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_nodeport_allocator_allocated_ports</div>
	<div>Gauge measuring the number of allocated NodePorts for Services</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_nodeport_allocator_available_ports</div>
	<div>Gauge measuring the number of available NodePorts for Services</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_pod_logs_backend_tls_failure_total</div>
	<div>Total number of requests for pods/logs that failed due to kubelet server TLS verification</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_pod_logs_insecure_backend_total</div>
	<div>Total number of requests for pods/logs sliced by usage type: enforce_tls, skip_tls_allowed, skip_tls_denied</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">usage</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_pod_logs_pods_logs_backend_tls_failure_total</div>
	<div>Total number of requests for pods/logs that failed due to kubelet server TLS verification</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<li class="metric_deprecated_version"><span class="metric-data">Deprecated Versions:</span>1.27.0</li>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kube_apiserver_pod_logs_pods_logs_insecure_backend_total</div>
	<div>Total number of requests for pods/logs sliced by usage type: enforce_tls, skip_tls_allowed, skip_tls_denied</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">usage</span></li>
	<div class="metric_labels_constant"></div>
	<li class="metric_deprecated_version"><span class="metric-data">Deprecated Versions:</span>1.27.0</li>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_active_pods</div>
	<div>The number of pods the kubelet considers active and which are being considered when admitting new pods. static is true if the pod is not from the apiserver.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">static</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_certificate_manager_client_expiration_renew_errors</div>
	<div>Counter of certificate renewal errors.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_certificate_manager_client_ttl_seconds</div>
	<div>Gauge of the TTL (time-to-live) of the Kubelet's client certificate. The value is in seconds until certificate expiry (negative if already expired). If client certificate is invalid or unused, the value will be +INF.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_certificate_manager_server_rotation_seconds</div>
	<div>Histogram of the number of seconds the previous certificate lived before being rotated.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_certificate_manager_server_ttl_seconds</div>
	<div>Gauge of the shortest TTL (time-to-live) of the Kubelet's serving certificate. The value is in seconds until certificate expiry (negative if already expired). If serving certificate is invalid or unused, the value will be +INF.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_cgroup_manager_duration_seconds</div>
	<div>Duration in seconds for cgroup manager operations. Broken down by method.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_container_log_filesystem_used_bytes</div>
	<div>Bytes used by the container's logs on the filesystem.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">uid</span><span class="separate-labels">namespace</span><span class="separate-labels">pod</span><span class="separate-labels">container</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_containers_per_pod_count</div>
	<div>The number of containers per pod.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_cpu_manager_pinning_errors_total</div>
	<div>The number of cpu core allocations which required pinning failed.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_cpu_manager_pinning_requests_total</div>
	<div>The number of cpu core allocations which required pinning.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_credential_provider_plugin_duration</div>
	<div>Duration of execution in seconds for credential provider plugin</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">plugin_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_credential_provider_plugin_errors</div>
	<div>Number of errors from credential provider plugin</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">plugin_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_desired_pods</div>
	<div>The number of pods the kubelet is being instructed to run. static is true if the pod is not from the apiserver.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">static</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_device_plugin_alloc_duration_seconds</div>
	<div>Duration in seconds to serve a device plugin Allocation request. Broken down by resource name.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_device_plugin_registration_total</div>
	<div>Cumulative number of device plugin registrations. Broken down by resource name.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_evented_pleg_connection_error_count</div>
	<div>The number of errors encountered during the establishment of streaming connection with the CRI runtime.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_evented_pleg_connection_latency_seconds</div>
	<div>The latency of streaming connection with the CRI runtime, measured in seconds.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_evented_pleg_connection_success_count</div>
	<div>The number of times a streaming client was obtained to receive CRI Events.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_eviction_stats_age_seconds</div>
	<div>Time between when stats are collected, and when pod is evicted based on those stats by eviction signal</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">eviction_signal</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_evictions</div>
	<div>Cumulative number of pod evictions by eviction signal</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">eviction_signal</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_graceful_shutdown_end_time_seconds</div>
	<div>Last graceful shutdown start time since unix epoch in seconds</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_graceful_shutdown_start_time_seconds</div>
	<div>Last graceful shutdown start time since unix epoch in seconds</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_http_inflight_requests</div>
	<div>Number of the inflight http requests</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">long_running</span><span class="separate-labels">method</span><span class="separate-labels">path</span><span class="separate-labels">server_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_http_requests_duration_seconds</div>
	<div>Duration in seconds to serve http requests</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">long_running</span><span class="separate-labels">method</span><span class="separate-labels">path</span><span class="separate-labels">server_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_http_requests_total</div>
	<div>Number of the http requests received since the server started</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">long_running</span><span class="separate-labels">method</span><span class="separate-labels">path</span><span class="separate-labels">server_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_lifecycle_handler_http_fallbacks_total</div>
	<div>The number of times lifecycle handlers successfully fell back to http from https.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_managed_ephemeral_containers</div>
	<div>Current number of ephemeral containers in pods managed by this kubelet.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_mirror_pods</div>
	<div>The number of mirror pods the kubelet will try to create (one per admitted static pod)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_node_name</div>
	<div>The node's name. The count is always 1.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">node</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_orphan_pod_cleaned_volumes</div>
	<div>The total number of orphaned Pods whose volumes were cleaned in the last periodic sweep.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_orphan_pod_cleaned_volumes_errors</div>
	<div>The number of orphaned Pods whose volumes failed to be cleaned in the last periodic sweep.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_orphaned_runtime_pods_total</div>
	<div>Number of pods that have been detected in the container runtime without being already known to the pod worker. This typically indicates the kubelet was restarted while a pod was force deleted in the API or in the local configuration, which is unusual.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pleg_discard_events</div>
	<div>The number of discard events in PLEG.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pleg_last_seen_seconds</div>
	<div>Timestamp in seconds when PLEG was last seen active.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pleg_relist_duration_seconds</div>
	<div>Duration in seconds for relisting pods in PLEG.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pleg_relist_interval_seconds</div>
	<div>Interval in seconds between relisting in PLEG.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_resources_endpoint_errors_get</div>
	<div>Number of requests to the PodResource Get endpoint which returned error. Broken down by server api version.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">server_api_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_resources_endpoint_errors_get_allocatable</div>
	<div>Number of requests to the PodResource GetAllocatableResources endpoint which returned error. Broken down by server api version.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">server_api_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_resources_endpoint_errors_list</div>
	<div>Number of requests to the PodResource List endpoint which returned error. Broken down by server api version.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">server_api_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_resources_endpoint_requests_get</div>
	<div>Number of requests to the PodResource Get endpoint. Broken down by server api version.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">server_api_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_resources_endpoint_requests_get_allocatable</div>
	<div>Number of requests to the PodResource GetAllocatableResources endpoint. Broken down by server api version.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">server_api_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_resources_endpoint_requests_list</div>
	<div>Number of requests to the PodResource List endpoint. Broken down by server api version.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">server_api_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_resources_endpoint_requests_total</div>
	<div>Cumulative number of requests to the PodResource endpoint. Broken down by server api version.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">server_api_version</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_start_duration_seconds</div>
	<div>Duration in seconds from kubelet seeing a pod for the first time to the pod starting to run</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_start_sli_duration_seconds</div>
	<div>Duration in seconds to start a pod, excluding time to pull images and run init containers, measured from pod creation timestamp to when all its containers are reported as started and observed via watch</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_status_sync_duration_seconds</div>
	<div>Duration in seconds to sync a pod status update. Measures time from detection of a change to pod status until the API is successfully updated for that pod, even if multiple intevening changes to pod status occur.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_worker_duration_seconds</div>
	<div>Duration in seconds to sync a single pod. Broken down by operation type: create, update, or sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_pod_worker_start_duration_seconds</div>
	<div>Duration in seconds from kubelet seeing a pod to starting a worker.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_preemptions</div>
	<div>Cumulative number of pod preemptions by preemption resource</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">preemption_signal</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_restarted_pods_total</div>
	<div>Number of pods that have been restarted because they were deleted and recreated with the same UID while the kubelet was watching them (common for static pods, extremely uncommon for API pods)</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">static</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_run_podsandbox_duration_seconds</div>
	<div>Duration in seconds of the run_podsandbox operations. Broken down by RuntimeClass.Handler.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">runtime_handler</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_run_podsandbox_errors_total</div>
	<div>Cumulative number of the run_podsandbox operation errors by RuntimeClass.Handler.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">runtime_handler</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_running_containers</div>
	<div>Number of containers currently running</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container_state</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_running_pods</div>
	<div>Number of pods that have a running pod sandbox</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_runtime_operations_duration_seconds</div>
	<div>Duration in seconds of runtime operations. Broken down by operation type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_runtime_operations_errors_total</div>
	<div>Cumulative number of runtime operation errors by operation type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_runtime_operations_total</div>
	<div>Cumulative number of runtime operations by operation type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_server_expiration_renew_errors</div>
	<div>Counter of certificate renewal errors.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_started_containers_errors_total</div>
	<div>Cumulative number of errors when starting containers</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">container_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_started_containers_total</div>
	<div>Cumulative number of containers started</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_started_host_process_containers_errors_total</div>
	<div>Cumulative number of errors when starting hostprocess containers. This metric will only be collected on Windows.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">container_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_started_host_process_containers_total</div>
	<div>Cumulative number of hostprocess containers started. This metric will only be collected on Windows.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_started_pods_errors_total</div>
	<div>Cumulative number of errors when starting pods</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_started_pods_total</div>
	<div>Cumulative number of pods started</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_topology_manager_admission_duration_ms</div>
	<div>Duration in milliseconds to serve a pod admission request.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_topology_manager_admission_errors_total</div>
	<div>The number of admission request failures where resources could not be aligned.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_topology_manager_admission_requests_total</div>
	<div>The number of admission requests where resources have to be aligned.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_volume_metric_collection_duration_seconds</div>
	<div>Duration in seconds to calculate volume stats</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">metric_source</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_volume_stats_available_bytes</div>
	<div>Number of available bytes in the volume</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">persistentvolumeclaim</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_volume_stats_capacity_bytes</div>
	<div>Capacity in bytes of the volume</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">persistentvolumeclaim</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_volume_stats_health_status_abnormal</div>
	<div>Abnormal volume health status. The count is either 1 or 0. 1 indicates the volume is unhealthy, 0 indicates volume is healthy</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">persistentvolumeclaim</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_volume_stats_inodes</div>
	<div>Maximum number of inodes in the volume</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">persistentvolumeclaim</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_volume_stats_inodes_free</div>
	<div>Number of free inodes in the volume</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">persistentvolumeclaim</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_volume_stats_inodes_used</div>
	<div>Number of used inodes in the volume</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">persistentvolumeclaim</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_volume_stats_used_bytes</div>
	<div>Number of used bytes in the volume</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">persistentvolumeclaim</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubelet_working_pods</div>
	<div>Number of pods the kubelet is actually running, broken down by lifecycle phase, whether the pod is desired, orphaned, or runtime only (also orphaned), and whether the pod is static. An orphaned pod has been removed from local configuration or force deleted in the API and consumes resources that are not otherwise visible.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">config</span><span class="separate-labels">lifecycle</span><span class="separate-labels">static</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_network_programming_duration_seconds</div>
	<div>In Cluster Network Programming Latency in seconds</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_proxy_healthz_total</div>
	<div>Cumulative proxy healthz HTTP status</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_proxy_livez_total</div>
	<div>Cumulative proxy livez HTTP status</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_full_proxy_rules_duration_seconds</div>
	<div>SyncProxyRules latency in seconds for full resyncs</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_partial_proxy_rules_duration_seconds</div>
	<div>SyncProxyRules latency in seconds for partial resyncs</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_duration_seconds</div>
	<div>SyncProxyRules latency in seconds</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_endpoint_changes_pending</div>
	<div>Pending proxy rules Endpoint changes</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_endpoint_changes_total</div>
	<div>Cumulative proxy rules Endpoint changes</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_iptables_last</div>
	<div>Number of iptables rules written by kube-proxy in last sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">table</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_iptables_partial_restore_failures_total</div>
	<div>Cumulative proxy iptables partial restore failures</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_iptables_restore_failures_total</div>
	<div>Cumulative proxy iptables restore failures</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_iptables_total</div>
	<div>Total number of iptables rules owned by kube-proxy</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">table</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_last_queued_timestamp_seconds</div>
	<div>The last time a sync of proxy rules was queued</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_last_timestamp_seconds</div>
	<div>The last time proxy rules were successfully synced</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_no_local_endpoints_total</div>
	<div>Number of services with a Local traffic policy and no endpoints</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">traffic_policy</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_service_changes_pending</div>
	<div>Pending proxy rules Service changes</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubeproxy_sync_proxy_rules_service_changes_total</div>
	<div>Cumulative proxy rules Service changes</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">kubernetes_build_info</div>
	<div>A metric with a constant '1' value labeled by major, minor, git version, git commit, git tree state, build date, Go version, and compiler from which Kubernetes was built, and platform on which it is running.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">build_date</span><span class="separate-labels">compiler</span><span class="separate-labels">git_commit</span><span class="separate-labels">git_tree_state</span><span class="separate-labels">git_version</span><span class="separate-labels">go_version</span><span class="separate-labels">major</span><span class="separate-labels">minor</span><span class="separate-labels">platform</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">leader_election_master_status</div>
	<div>Gauge of if the reporting system is master of the relevant lease, 0 indicates backup, 1 indicates master. 'name' is the string used to identify the lease. Please make sure to group by name.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_authorizer_graph_actions_duration_seconds</div>
	<div>Histogram of duration of graph actions in node authorizer.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_collector_unhealthy_nodes_in_zone</div>
	<div>Gauge measuring number of not Ready Nodes per zones.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">zone</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_collector_update_all_nodes_health_duration_seconds</div>
	<div>Duration in seconds for NodeController to update the health of all nodes.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_collector_update_node_health_duration_seconds</div>
	<div>Duration in seconds for NodeController to update the health of a single node.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_collector_zone_health</div>
	<div>Gauge measuring percentage of healthy nodes per zone.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">zone</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_collector_zone_size</div>
	<div>Gauge measuring number of registered Nodes per zones.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">zone</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_controller_cloud_provider_taint_removal_delay_seconds</div>
	<div>Number of seconds after node creation when NodeController removed the cloud-provider taint of a single node.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_controller_initial_node_sync_delay_seconds</div>
	<div>Number of seconds after node creation when NodeController finished the initial synchronization of a single node.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_cidrset_allocation_tries_per_request</div>
	<div>Number of endpoints added on each Service sync</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_cidrset_cidrs_allocations_total</div>
	<div>Counter measuring total number of CIDR allocations.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_cidrset_cidrs_releases_total</div>
	<div>Counter measuring total number of CIDR releases.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_cidrset_usage_cidrs</div>
	<div>Gauge measuring percentage of allocated CIDRs.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_cirdset_max_cidrs</div>
	<div>Maximum number of CIDRs that can be allocated.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_multicidrset_allocation_tries_per_request</div>
	<div>Histogram measuring CIDR allocation tries per request.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_multicidrset_cidrs_allocations_total</div>
	<div>Counter measuring total number of CIDR allocations.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_multicidrset_cidrs_releases_total</div>
	<div>Counter measuring total number of CIDR releases.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_multicidrset_usage_cidrs</div>
	<div>Gauge measuring percentage of allocated CIDRs.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_ipam_controller_multicirdset_max_cidrs</div>
	<div>Maximum number of CIDRs that can be allocated.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">clusterCIDR</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">node_swap_usage_bytes</div>
	<div>Current swap usage of the node in bytes. Reported only on non-windows systems</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">number_of_l4_ilbs</div>
	<div>Number of L4 ILBs</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">feature</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">plugin_manager_total_plugins</div>
	<div>Number of plugins in Plugin Manager</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">socket_path</span><span class="separate-labels">state</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pod_gc_collector_force_delete_pod_errors_total</div>
	<div>Number of errors encountered when forcefully deleting the pods since the Pod GC Controller started.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">reason</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pod_gc_collector_force_delete_pods_total</div>
	<div>Number of pods that are being forcefully deleted since the Pod GC Controller started.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span><span class="separate-labels">reason</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pod_security_errors_total</div>
	<div>Number of errors preventing normal evaluation. Non-fatal errors may result in the latest restricted profile being used for evaluation.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">fatal</span><span class="separate-labels">request_operation</span><span class="separate-labels">resource</span><span class="separate-labels">subresource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pod_security_evaluations_total</div>
	<div>Number of policy evaluations that occurred, not counting ignored or exempt requests.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">decision</span><span class="separate-labels">mode</span><span class="separate-labels">policy_level</span><span class="separate-labels">policy_version</span><span class="separate-labels">request_operation</span><span class="separate-labels">resource</span><span class="separate-labels">subresource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pod_security_exemptions_total</div>
	<div>Number of exempt requests, not counting ignored or out of scope requests.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">request_operation</span><span class="separate-labels">resource</span><span class="separate-labels">subresource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pod_swap_usage_bytes</div>
	<div>Current amount of the pod swap usage in bytes. Reported only on non-windows systems</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">pod</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">prober_probe_duration_seconds</div>
	<div>Duration in seconds for a probe response.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container</span><span class="separate-labels">namespace</span><span class="separate-labels">pod</span><span class="separate-labels">probe_type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">prober_probe_total</div>
	<div>Cumulative number of a liveness, readiness or startup probe for a container by result.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">container</span><span class="separate-labels">namespace</span><span class="separate-labels">pod</span><span class="separate-labels">pod_uid</span><span class="separate-labels">probe_type</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pv_collector_bound_pv_count</div>
	<div>Gauge measuring number of persistent volume currently bound</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">storage_class</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pv_collector_bound_pvc_count</div>
	<div>Gauge measuring number of persistent volume claim currently bound</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pv_collector_total_pv_count</div>
	<div>Gauge measuring total number of persistent volumes</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">plugin_name</span><span class="separate-labels">volume_mode</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pv_collector_unbound_pv_count</div>
	<div>Gauge measuring number of persistent volume currently unbound</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">storage_class</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">pv_collector_unbound_pvc_count</div>
	<div>Gauge measuring number of persistent volume claim currently unbound</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">namespace</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">reconstruct_volume_operations_errors_total</div>
	<div>The number of volumes that failed reconstruction from the operating system during kubelet startup.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">reconstruct_volume_operations_total</div>
	<div>The number of volumes that were attempted to be reconstructed from the operating system during kubelet startup. This includes both successful and failed reconstruction.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">replicaset_controller_sorting_deletion_age_ratio</div>
	<div>The ratio of chosen deleted pod's ages to the current youngest pod's age (at the time). Should be <2.The intent of this metric is to measure the rough efficacy of the LogarithmicScaleDown feature gate's effect onthe sorting (and deletion) of pods when a replicaset scales down. This only considers Ready pods when calculating and reporting.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">resourceclaim_controller_create_attempts_total</div>
	<div>Number of ResourceClaims creation requests</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">resourceclaim_controller_create_failures_total</div>
	<div>Number of ResourceClaims creation request failures</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_dns_resolution_duration_seconds</div>
	<div>DNS resolver latency in seconds. Broken down by host.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">host</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_exec_plugin_call_total</div>
	<div>Number of calls to an exec plugin, partitioned by the type of event encountered (no_error, plugin_execution_error, plugin_not_found_error, client_internal_error) and an optional exit code. The exit code will be set to 0 if and only if the plugin call was successful.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">call_status</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_exec_plugin_certificate_rotation_age</div>
	<div>Histogram of the number of seconds the last auth exec plugin client certificate lived before being rotated. If auth exec plugin client certificates are unused, histogram will contain no data.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_exec_plugin_ttl_seconds</div>
	<div>Gauge of the shortest TTL (time-to-live) of the client certificate(s) managed by the auth exec plugin. The value is in seconds until certificate expiry (negative if already expired). If auth exec plugins are unused or manage no TLS certificates, the value will be +INF.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_rate_limiter_duration_seconds</div>
	<div>Client side rate limiter latency in seconds. Broken down by verb, and host.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">host</span><span class="separate-labels">verb</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_request_duration_seconds</div>
	<div>Request latency in seconds. Broken down by verb, and host.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">host</span><span class="separate-labels">verb</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_request_retries_total</div>
	<div>Number of request retries, partitioned by status code, verb, and host.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">host</span><span class="separate-labels">verb</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_request_size_bytes</div>
	<div>Request size in bytes. Broken down by verb and host.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">host</span><span class="separate-labels">verb</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_requests_total</div>
	<div>Number of HTTP requests, partitioned by status code, method, and host.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span><span class="separate-labels">host</span><span class="separate-labels">method</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_response_size_bytes</div>
	<div>Response size in bytes. Broken down by verb and host.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">host</span><span class="separate-labels">verb</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_transport_cache_entries</div>
	<div>Number of transport entries in the internal cache.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">rest_client_transport_create_calls_total</div>
	<div>Number of calls to get a new transport, partitioned by the result of the operation hit: obtained from the cache, miss: created and added to the cache, uncacheable: created and not cached</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">retroactive_storageclass_errors_total</div>
	<div>Total number of failed retroactive StorageClass assignments to persistent volume claim</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">retroactive_storageclass_total</div>
	<div>Total number of retroactive StorageClass assignments to persistent volume claim</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">root_ca_cert_publisher_sync_duration_seconds</div>
	<div>Number of namespace syncs happened in root ca cert publisher.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">root_ca_cert_publisher_sync_total</div>
	<div>Number of namespace syncs happened in root ca cert publisher.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">code</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">running_managed_controllers</div>
	<div>Indicates where instances of a controller are currently running</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">manager</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_goroutines</div>
	<div>Number of running goroutines split by the work they do such as binding.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_permit_wait_duration_seconds</div>
	<div>Duration of waiting on permit.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">result</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_plugin_evaluation_total</div>
	<div>Number of attempts to schedule pods by each plugin and the extension point (available only in PreFilter and Filter.).</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">extension_point</span><span class="separate-labels">plugin</span><span class="separate-labels">profile</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_plugin_execution_duration_seconds</div>
	<div>Duration for running a plugin at a specific extension point.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">extension_point</span><span class="separate-labels">plugin</span><span class="separate-labels">status</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_scheduler_cache_size</div>
	<div>Number of nodes, pods, and assumed (bound) pods in the scheduler cache.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">type</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_scheduling_algorithm_duration_seconds</div>
	<div>Scheduling algorithm latency in seconds</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_unschedulable_pods</div>
	<div>The number of unschedulable pods broken down by plugin name. A pod will increment the gauge for all plugins that caused it to not schedule and so this metric have meaning only when broken down by plugin.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">plugin</span><span class="separate-labels">profile</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_volume_binder_cache_requests_total</div>
	<div>Total number for request volume binding cache</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scheduler_volume_scheduling_stage_error_total</div>
	<div>Volume scheduling stage error count</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">scrape_error</div>
	<div>1 if there was an error while getting container metrics, 0 otherwise</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<li class="metric_deprecated_version"><span class="metric-data">Deprecated Versions:</span>1.29.0</li>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">service_controller_loadbalancer_sync_total</div>
	<div>A metric counting the amount of times any load balancer has been configured, as an effect of service/node changes on the cluster</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">service_controller_nodesync_error_total</div>
	<div>A metric counting the amount of times any load balancer has been configured and errored, as an effect of node changes on the cluster</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">service_controller_nodesync_latency_seconds</div>
	<div>A metric measuring the latency for nodesync which updates loadbalancer hosts on cluster node updates.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">service_controller_update_loadbalancer_host_latency_seconds</div>
	<div>A metric measuring the latency for updating each load balancer hosts.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">serviceaccount_legacy_auto_token_uses_total</div>
	<div>Cumulative auto-generated legacy tokens used</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">serviceaccount_legacy_manual_token_uses_total</div>
	<div>Cumulative manually created legacy tokens used</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">serviceaccount_legacy_tokens_total</div>
	<div>Cumulative legacy service account tokens used</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">serviceaccount_stale_tokens_total</div>
	<div>Cumulative stale projected service account tokens used</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">serviceaccount_valid_tokens_total</div>
	<div>Cumulative valid projected service account tokens used</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">storage_count_attachable_volumes_in_use</div>
	<div>Measure number of volumes in use</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">node</span><span class="separate-labels">volume_plugin</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">storage_operation_duration_seconds</div>
	<div>Storage operation duration</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">migrated</span><span class="separate-labels">operation_name</span><span class="separate-labels">status</span><span class="separate-labels">volume_plugin</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">ttl_after_finished_controller_job_deletion_duration_seconds</div>
	<div>The time it took to delete the job since it became eligible for deletion</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_manager_selinux_container_errors_total</div>
	<div>Number of errors when kubelet cannot compute SELinux context for a container. Kubelet can't start such a Pod then and it will retry, therefore value of this metric may not represent the actual nr. of containers.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_manager_selinux_container_warnings_total</div>
	<div>Number of errors when kubelet cannot compute SELinux context for a container that are ignored. They will become real errors when SELinuxMountReadWriteOncePod feature is expanded to all volume access modes.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_manager_selinux_pod_context_mismatch_errors_total</div>
	<div>Number of errors when a Pod defines different SELinux contexts for its containers that use the same volume. Kubelet can't start such a Pod then and it will retry, therefore value of this metric may not represent the actual nr. of Pods.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_manager_selinux_pod_context_mismatch_warnings_total</div>
	<div>Number of errors when a Pod defines different SELinux contexts for its containers that use the same volume. They are not errors yet, but they will become real errors when SELinuxMountReadWriteOncePod feature is expanded to all volume access modes.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_manager_selinux_volume_context_mismatch_errors_total</div>
	<div>Number of errors when a Pod uses a volume that is already mounted with a different SELinux context than the Pod needs. Kubelet can't start such a Pod then and it will retry, therefore value of this metric may not represent the actual nr. of Pods.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_manager_selinux_volume_context_mismatch_warnings_total</div>
	<div>Number of errors when a Pod uses a volume that is already mounted with a different SELinux context than the Pod needs. They are not errors yet, but they will become real errors when SELinuxMountReadWriteOncePod feature is expanded to all volume access modes.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_manager_selinux_volumes_admitted_total</div>
	<div>Number of volumes whose SELinux context was fine and will be mounted with mount -o context option.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<div class="metric_labels_varying"></div>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_manager_total_volumes</div>
	<div>Number of volumes in Volume Manager</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="custom"><span class="metric-data">Type:</span>Custom</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">plugin_name</span><span class="separate-labels">state</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_operation_total_errors</div>
	<div>Total volume operation errors</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation_name</span><span class="separate-labels">plugin_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">volume_operation_total_seconds</div>
	<div>Storage operation end to end duration in seconds</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">operation_name</span><span class="separate-labels">plugin_name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">watch_cache_capacity</div>
	<div>Total capacity of watch cache broken by resource type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">watch_cache_capacity_decrease_total</div>
	<div>Total number of watch cache capacity decrease events broken by resource type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">watch_cache_capacity_increase_total</div>
	<div>Total number of watch cache capacity increase events broken by resource type.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">resource</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">workqueue_adds_total</div>
	<div>Total number of adds handled by workqueue</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">workqueue_depth</div>
	<div>Current depth of workqueue</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">workqueue_longest_running_processor_seconds</div>
	<div>How many seconds has the longest running processor for workqueue been running.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">workqueue_queue_duration_seconds</div>
	<div>How long in seconds an item stays in workqueue before being requested.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">workqueue_retries_total</div>
	<div>Total number of retries handled by workqueue</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="counter"><span class="metric-data">Type:</span>Counter</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">workqueue_unfinished_work_seconds</div>
	<div>How many seconds of work has done that is in progress and hasn't been observed by work_duration. Large values indicate stuck threads. One can deduce the number of stuck threads by observing the rate at which this increases.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="gauge"><span class="metric-data">Type:</span>Gauge</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
<div class="metrics">
	<div class="metric_name">workqueue_work_duration_seconds</div>
	<div>How long in seconds processing an item from workqueue takes.</div>
	<ul>
	<li data-stability="alpha"><span class="metric-data">Stability Level:</span>ALPHA</li>
	<li data-type="histogram"><span class="metric-data">Type:</span>Histogram</li>
	<li class="metric_labels_varying"><span class="metric-data">Labels:</span><span class="separate-labels">name</span></li>
	<div class="metric_labels_constant"></div>
	<div class="metric_deprecated_version"></div>
	</ul>
</div>
