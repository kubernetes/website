---
title: kube-state-metrics Metrics Reference
content_type: reference
auto_generated: true
description: >-
  Details of the metric data that kube-state-metrics exports.
---

## Metrics (v2.19.1)

<!-- (auto-generated 2026 Jun 28) -->
<!-- (auto-generated v2.19.1) -->
This page details the metrics that kube-state-metrics exports. You can query the metrics endpoint using an HTTP scrape, and fetch the current metrics data in Prometheus format.

### List of Stable kube-state-metrics Metrics

Stable metrics observe strict API contracts and no labels can be added or removed from stable metrics during their lifetime.

<div class="metrics">
</div>

### List of Beta kube-state-metrics Metrics

Beta metrics observe a looser API contract than its stable counterparts. No labels can be removed from beta metrics during their lifetime, however, labels can be added while the metric is in the beta stage. This offers the assurance that beta metrics will honor existing dashboards and alerts, while allowing for amendments in the future. 

<div class="metrics"><div class="metric" data-stability="beta">
	<div class="metric_name">kube_certificatesigningrequest_cert_length</div>
	<div class="metric_help">Length of the issued cert</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">certificatesigningrequest</span><span class="metric_label">signer_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_certificatesigningrequest_condition</div>
	<div class="metric_help">The number of each certificatesigningrequest condition</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">certificatesigningrequest</span><span class="metric_label">signer_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_certificatesigningrequest_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">certificatesigningrequest</span><span class="metric_label">signer_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_certificatesigningrequest_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">certificatesigningrequest</span><span class="metric_label">signer_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_configmap_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">configmap</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_configmap_info</div>
	<div class="metric_help">Information about configmap.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">configmap</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_configmap_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">configmap</span><span class="metric_label">label_CONFIGMAP_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_info</div>
	<div class="metric_help">Info about cronjob.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span><span class="metric_label">schedule</span><span class="metric_label">concurrency_policy</span><span class="metric_label">timezone</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span><span class="metric_label">label_CRONJOB_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_metadata_resource_version</div>
	<div class="metric_help">Resource version representing a specific version of the cronjob.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_next_schedule_time</div>
	<div class="metric_help">Next time the cronjob should be scheduled. The time after lastScheduleTime, or after the cron job's creation time if it's never been scheduled. Use this to determine if the job is delayed.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_spec_starting_deadline_seconds</div>
	<div class="metric_help">Deadline in seconds for starting the job if it misses scheduled time for any reason.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_spec_suspend</div>
	<div class="metric_help">Suspend flag tells the controller to suspend subsequent executions.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_status_active</div>
	<div class="metric_help">Active holds pointers to currently running jobs.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_status_last_schedule_time</div>
	<div class="metric_help">LastScheduleTime keeps information of when was the last time the job was successfully scheduled.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_cronjob_status_last_successful_time</div>
	<div class="metric_help">LastSuccessfulTime keeps information of when was the last time the job was completed successfully.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">cronjob</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span><span class="metric_label">label_DAEMONSET_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_metadata_generation</div>
	<div class="metric_help">Sequence number representing a specific generation of the desired state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_status_current_number_scheduled</div>
	<div class="metric_help">The number of nodes running at least one daemon pod and are supposed to.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_status_desired_number_scheduled</div>
	<div class="metric_help">The number of nodes that should be running the daemon pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_status_number_available</div>
	<div class="metric_help">The number of nodes that should be running the daemon pod and have one or more of the daemon pod running and available</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_status_number_misscheduled</div>
	<div class="metric_help">The number of nodes running a daemon pod but are not supposed to.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_status_number_ready</div>
	<div class="metric_help">The number of nodes that should be running the daemon pod and have one or more of the daemon pod running and ready.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_status_number_unavailable</div>
	<div class="metric_help">The number of nodes that should be running the daemon pod and have none of the daemon pod running and available</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_status_observed_generation</div>
	<div class="metric_help">The most recent generation observed by the daemon set controller.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_daemonset_status_updated_number_scheduled</div>
	<div class="metric_help">The total number of nodes that are running updated daemon pod</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">daemonset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span><span class="metric_label">label_DEPLOYMENT_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_metadata_generation</div>
	<div class="metric_help">Sequence number representing a specific generation of the desired state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_spec_paused</div>
	<div class="metric_help">Whether the deployment is paused and will not be processed by the deployment controller.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_spec_replicas</div>
	<div class="metric_help">Number of desired pods for a deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_spec_strategy_rollingupdate_max_surge</div>
	<div class="metric_help">Maximum number of replicas that can be scheduled above the desired number of replicas during a rolling update of a deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_spec_strategy_rollingupdate_max_unavailable</div>
	<div class="metric_help">Maximum number of unavailable replicas during a rolling update of a deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_status_condition</div>
	<div class="metric_help">The current status conditions of a deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span><span class="metric_label">reason</span><span class="metric_label">condition</span><span class="metric_label">status</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_status_observed_generation</div>
	<div class="metric_help">The generation observed by the deployment controller.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_status_replicas</div>
	<div class="metric_help">The number of replicas per deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_status_replicas_available</div>
	<div class="metric_help">The number of available replicas per deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_status_replicas_ready</div>
	<div class="metric_help">The number of ready replicas per deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_status_replicas_unavailable</div>
	<div class="metric_help">The number of unavailable replicas per deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_deployment_status_replicas_updated</div>
	<div class="metric_help">The number of updated replicas per deployment.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">deployment</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_endpoint_address</div>
	<div class="metric_help">Information about Endpoint available and non available addresses.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">endpoint</span><span class="metric_label">port_protocol</span><span class="metric_label">port_number</span><span class="metric_label">port_name</span><span class="metric_label">ip</span><span class="metric_label">ready</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_endpoint_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">endpoint</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_endpoint_info</div>
	<div class="metric_help">Information about endpoint.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">endpoint</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_endpoint_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">endpoint</span><span class="metric_label">label_ENDPOINT_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_endpoint_ports</div>
	<div class="metric_help">(Deprecated since v2.14.0) Information about the Endpoint ports.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">endpoint</span><span class="metric_label">port_name</span><span class="metric_label">port_protocol</span><span class="metric_label">port_number</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_horizontalpodautoscaler_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">horizontalpodautoscaler</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_horizontalpodautoscaler_metadata_generation</div>
	<div class="metric_help">The generation observed by the HorizontalPodAutoscaler controller.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">horizontalpodautoscaler</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_horizontalpodautoscaler_spec_max_replicas</div>
	<div class="metric_help">Upper limit for the number of pods that can be set by the autoscaler; cannot be smaller than MinReplicas.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">horizontalpodautoscaler</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_horizontalpodautoscaler_spec_min_replicas</div>
	<div class="metric_help">Lower limit for the number of pods that can be set by the autoscaler, default 1.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">horizontalpodautoscaler</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_horizontalpodautoscaler_status_condition</div>
	<div class="metric_help">The condition of this autoscaler.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">horizontalpodautoscaler</span><span class="metric_label">condition</span><span class="metric_label">status</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_horizontalpodautoscaler_status_current_replicas</div>
	<div class="metric_help">Current number of replicas of pods managed by this autoscaler.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">horizontalpodautoscaler</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_horizontalpodautoscaler_status_desired_replicas</div>
	<div class="metric_help">Desired number of replicas of pods managed by this autoscaler.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">horizontalpodautoscaler</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_horizontalpodautoscaler_status_target_metric</div>
	<div class="metric_help">The current metric status used by this autoscaler when calculating the desired replica count.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">horizontalpodautoscaler</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_ingress_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">ingress</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_ingress_info</div>
	<div class="metric_help">Information about ingress.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">ingress</span><span class="metric_label">ingressclass</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_ingress_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">ingress</span><span class="metric_label">label_INGRESS_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_ingress_path</div>
	<div class="metric_help">Ingress host, paths and backend service information.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">ingress</span><span class="metric_label">host</span><span class="metric_label">path</span><span class="metric_label">path_type</span><span class="metric_label">service_name</span><span class="metric_label">service_port</span><span class="metric_label">resource_api_group</span><span class="metric_label">resource_kind</span><span class="metric_label">resource_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_ingress_tls</div>
	<div class="metric_help">Ingress TLS host and secret information.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">ingress</span><span class="metric_label">tls_host</span><span class="metric_label">secret</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_complete</div>
	<div class="metric_help">The job has completed its execution.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span><span class="metric_label">condition</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_failed</div>
	<div class="metric_help">The job has failed its execution.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span><span class="metric_label">condition</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_info</div>
	<div class="metric_help">Information about job.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span><span class="metric_label">label_JOB_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_owner</div>
	<div class="metric_help">Information about the Job's owner.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span><span class="metric_label">owner_kind</span><span class="metric_label">owner_name</span><span class="metric_label">owner_is_controller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_spec_active_deadline_seconds</div>
	<div class="metric_help">The duration in seconds relative to the startTime that the job may be active before the system tries to terminate it.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_spec_completions</div>
	<div class="metric_help">The desired number of successfully finished pods the job should be run with.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_spec_parallelism</div>
	<div class="metric_help">The maximum desired number of pods the job should run at any given time.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_status_active</div>
	<div class="metric_help">The number of actively running pods.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_status_completion_time</div>
	<div class="metric_help">CompletionTime represents time when the job was completed.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_status_failed</div>
	<div class="metric_help">The number of pods which reached Phase Failed and the reason for failure.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span><span class="metric_label">reason</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_status_start_time</div>
	<div class="metric_help">StartTime represents time when the job was acknowledged by the Job Manager.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_job_status_succeeded</div>
	<div class="metric_help">The number of pods which reached Phase Succeeded.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">job_name</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_limitrange</div>
	<div class="metric_help">Information about limit range.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">limitrange</span><span class="metric_label">resource</span><span class="metric_label">type</span><span class="metric_label">constraint</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_limitrange_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">limitrange</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_namespace_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_namespace_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">label_NS_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_namespace_status_phase</div>
	<div class="metric_help">kubernetes namespace status phase.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">phase</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_node_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">node</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_node_info</div>
	<div class="metric_help">Information about a cluster node.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">node</span><span class="metric_label">kernel_version</span><span class="metric_label">os_image</span><span class="metric_label">container_runtime_version</span><span class="metric_label">kubelet_version</span><span class="metric_label">kubeproxy_version</span><span class="metric_label">provider_id</span><span class="metric_label">pod_cidr</span><span class="metric_label">system_uuid</span><span class="metric_label">internal_ip</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_node_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">node</span><span class="metric_label">label_NODE_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_node_spec_taint</div>
	<div class="metric_help">The taint of a cluster node.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">node</span><span class="metric_label">key</span><span class="metric_label">value</span><span class="metric_label">effect</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_node_spec_unschedulable</div>
	<div class="metric_help">Whether a node can schedule new pods.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">node</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_node_status_allocatable</div>
	<div class="metric_help">The allocatable for different resources of a node that are available for scheduling.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">node</span><span class="metric_label">resource</span><span class="metric_label">unit</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_node_status_capacity</div>
	<div class="metric_help">The capacity for different resources of a node.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">node</span><span class="metric_label">resource</span><span class="metric_label">unit</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_node_status_condition</div>
	<div class="metric_help">The condition of a cluster node.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">node</span><span class="metric_label">condition</span><span class="metric_label">status</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolume_capacity_bytes</div>
	<div class="metric_help">Persistentvolume capacity in bytes.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">persistentvolume</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolume_claim_ref</div>
	<div class="metric_help">Information about the Persistent Volume Claim Reference.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">persistentvolume</span><span class="metric_label">name</span><span class="metric_label">claim_namespace</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolume_info</div>
	<div class="metric_help">Information about persistentvolume.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">persistentvolume</span><span class="metric_label">storageclass</span><span class="metric_label">gce_persistent_disk_name</span><span class="metric_label">ebs_volume_id</span><span class="metric_label">azure_disk_name</span><span class="metric_label">fc_wwids</span><span class="metric_label">fc_lun</span><span class="metric_label">fc_target_wwns</span><span class="metric_label">iscsi_target_portal</span><span class="metric_label">iscsi_iqn</span><span class="metric_label">iscsi_lun</span><span class="metric_label">iscsi_initiator_name</span><span class="metric_label">nfs_server</span><span class="metric_label">nfs_path</span><span class="metric_label">csi_driver</span><span class="metric_label">csi_volume_handle</span><span class="metric_label">local_path</span><span class="metric_label">local_fs</span><span class="metric_label">host_path</span><span class="metric_label">host_path_type</span><span class="metric_label">reclaim_policy</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolume_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">persistentvolume</span><span class="metric_label">label_PERSISTENTVOLUME_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolume_status_phase</div>
	<div class="metric_help">The phase indicates if a volume is available, bound to a claim, or released by a claim.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">persistentvolume</span><span class="metric_label">phase</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolumeclaim_access_mode</div>
	<div class="metric_help">The access mode(s) specified by the persistent volume claim.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span><span class="metric_label">access_mode</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolumeclaim_info</div>
	<div class="metric_help">Information about persistent volume claim.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span><span class="metric_label">storageclass</span><span class="metric_label">volumename</span><span class="metric_label">volumemode</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolumeclaim_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span><span class="metric_label">label_PERSISTENTVOLUMECLAIM_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolumeclaim_resource_requests_storage_bytes</div>
	<div class="metric_help">The capacity of storage requested by the persistent volume claim.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_persistentvolumeclaim_status_phase</div>
	<div class="metric_help">The phase the persistent volume claim is currently in.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">persistentvolumeclaim</span><span class="metric_label">phase</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_completion_time</div>
	<div class="metric_help">Completion time in unix timestamp for a pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_info</div>
	<div class="metric_help">Information about a container in a pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span><span class="metric_label">image_spec</span><span class="metric_label">image</span><span class="metric_label">image_id</span><span class="metric_label">container_id</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_resource_limits</div>
	<div class="metric_help">The number of requested limit resource by a container. It is recommended to use the kube_pod_resource_limits metric exposed by kube-scheduler instead, as it is more precise.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span><span class="metric_label">node</span><span class="metric_label">resource</span><span class="metric_label">unit</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_resource_requests</div>
	<div class="metric_help">The number of requested request resource by a container. It is recommended to use the kube_pod_resource_requests metric exposed by kube-scheduler instead, as it is more precise.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span><span class="metric_label">node</span><span class="metric_label">resource</span><span class="metric_label">unit</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_state_started</div>
	<div class="metric_help">Start time in unix timestamp for a pod container.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_status_ready</div>
	<div class="metric_help">Describes whether the containers readiness check succeeded.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_status_restarts_total</div>
	<div class="metric_help">The number of container restarts per container.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="counter"><label class="metric_detail">Type:</label> <span class="metric_type">Counter</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_status_running</div>
	<div class="metric_help">Describes whether the container is currently in running state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_status_terminated</div>
	<div class="metric_help">Describes whether the container is currently in terminated state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_status_waiting</div>
	<div class="metric_help">Describes whether the container is currently in waiting state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_container_status_waiting_reason</div>
	<div class="metric_help">Describes the reason the container is currently in waiting state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span><span class="metric_label">reason</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_info</div>
	<div class="metric_help">Information about pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">host_ip</span><span class="metric_label">pod_ip</span><span class="metric_label">node</span><span class="metric_label">created_by_kind</span><span class="metric_label">created_by_name</span><span class="metric_label">priority_class</span><span class="metric_label">host_network</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_init_container_info</div>
	<div class="metric_help">Information about an init container in a pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span><span class="metric_label">image_spec</span><span class="metric_label">image</span><span class="metric_label">image_id</span><span class="metric_label">container_id</span><span class="metric_label">restart_policy</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_init_container_status_ready</div>
	<div class="metric_help">Describes whether the init containers readiness check succeeded.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_init_container_status_restarts_total</div>
	<div class="metric_help">The number of restarts for the init container.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="counter"><label class="metric_detail">Type:</label> <span class="metric_type">Counter</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_init_container_status_running</div>
	<div class="metric_help">Describes whether the init container is currently in running state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_init_container_status_terminated</div>
	<div class="metric_help">Describes whether the init container is currently in terminated state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_init_container_status_waiting</div>
	<div class="metric_help">Describes whether the init container is currently in waiting state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">container</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">label_POD_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_owner</div>
	<div class="metric_help">Information about the Pod's owner.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">owner_kind</span><span class="metric_label">owner_name</span><span class="metric_label">owner_is_controller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_restart_policy</div>
	<div class="metric_help">Describes the restart policy in use by this pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">type</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_spec_volumes_persistentvolumeclaims_info</div>
	<div class="metric_help">Information about persistentvolumeclaim volumes in a pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">volume</span><span class="metric_label">persistentvolumeclaim</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_spec_volumes_persistentvolumeclaims_readonly</div>
	<div class="metric_help">Describes whether a persistentvolumeclaim is mounted read only.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">volume</span><span class="metric_label">persistentvolumeclaim</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_start_time</div>
	<div class="metric_help">Start time in unix timestamp for a pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_status_phase</div>
	<div class="metric_help">The pods current phase.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">phase</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_status_ready</div>
	<div class="metric_help">Describes whether the pod is ready to serve requests.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">condition</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_status_scheduled</div>
	<div class="metric_help">Describes the status of the scheduling process for the pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span><span class="metric_label">condition</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_status_scheduled_time</div>
	<div class="metric_help">Unix timestamp when pod moved into scheduled status</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_pod_status_unschedulable</div>
	<div class="metric_help">Describes the unschedulable status for the pod.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">pod</span><span class="metric_label">uid</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_poddisruptionbudget_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">poddisruptionbudget</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_poddisruptionbudget_status_current_healthy</div>
	<div class="metric_help">Current number of healthy pods</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">poddisruptionbudget</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_poddisruptionbudget_status_desired_healthy</div>
	<div class="metric_help">Minimum desired number of healthy pods</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">poddisruptionbudget</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_poddisruptionbudget_status_expected_pods</div>
	<div class="metric_help">Total number of pods counted by this disruption budget</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">poddisruptionbudget</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_poddisruptionbudget_status_observed_generation</div>
	<div class="metric_help">Most recent generation observed when updating this PDB status</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">poddisruptionbudget</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_poddisruptionbudget_status_pod_disruptions_allowed</div>
	<div class="metric_help">Number of pod disruptions that are currently allowed</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">poddisruptionbudget</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span><span class="metric_label">label_REPLICASET_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_metadata_generation</div>
	<div class="metric_help">Sequence number representing a specific generation of the desired state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_owner</div>
	<div class="metric_help">Information about the ReplicaSet's owner.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span><span class="metric_label">owner_kind</span><span class="metric_label">owner_name</span><span class="metric_label">owner_is_controller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_spec_replicas</div>
	<div class="metric_help">Number of desired pods for a ReplicaSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_status_fully_labeled_replicas</div>
	<div class="metric_help">The number of fully labeled replicas per ReplicaSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_status_observed_generation</div>
	<div class="metric_help">The generation observed by the ReplicaSet controller.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_status_ready_replicas</div>
	<div class="metric_help">The number of ready replicas per ReplicaSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicaset_status_replicas</div>
	<div class="metric_help">The number of replicas per ReplicaSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicaset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicationcontroller_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicationcontroller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicationcontroller_metadata_generation</div>
	<div class="metric_help">Sequence number representing a specific generation of the desired state.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicationcontroller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicationcontroller_spec_replicas</div>
	<div class="metric_help">Number of desired pods for a ReplicationController.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicationcontroller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicationcontroller_status_available_replicas</div>
	<div class="metric_help">The number of available replicas per ReplicationController.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicationcontroller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicationcontroller_status_fully_labeled_replicas</div>
	<div class="metric_help">The number of fully labeled replicas per ReplicationController.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicationcontroller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicationcontroller_status_observed_generation</div>
	<div class="metric_help">The generation observed by the ReplicationController controller.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicationcontroller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicationcontroller_status_ready_replicas</div>
	<div class="metric_help">The number of ready replicas per ReplicationController.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicationcontroller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_replicationcontroller_status_replicas</div>
	<div class="metric_help">The number of replicas per ReplicationController.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">replicationcontroller</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_resourcequota</div>
	<div class="metric_help">Information about resource quota.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">resourcequota</span><span class="metric_label">resource</span><span class="metric_label">type</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_resourcequota_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">resourcequota</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_resourcequota_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">resourcequota</span><span class="metric_label">label_RESOURCE_QUOTA_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_secret_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">secret</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_secret_info</div>
	<div class="metric_help">Information about secret.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">secret</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_secret_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">secret</span><span class="metric_label">label_SECRET_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_secret_type</div>
	<div class="metric_help">Type about secret.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">secret</span><span class="metric_label">type</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_service_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">service</span><span class="metric_label">uid</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_service_info</div>
	<div class="metric_help">Information about service.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">service</span><span class="metric_label">uid</span><span class="metric_label">cluster_ip</span><span class="metric_label">external_name</span><span class="metric_label">load_balancer_ip</span><span class="metric_label">external_traffic_policy</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_service_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">service</span><span class="metric_label">uid</span><span class="metric_label">label_SERVICE_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_service_spec_external_ip</div>
	<div class="metric_help">Service external ips. One series for each ip</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">service</span><span class="metric_label">uid</span><span class="metric_label">external_ip</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_service_spec_type</div>
	<div class="metric_help">Type about service.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">service</span><span class="metric_label">uid</span><span class="metric_label">type</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_service_status_load_balancer_ingress</div>
	<div class="metric_help">Service load balancer ingress status</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">service</span><span class="metric_label">uid</span><span class="metric_label">ip</span><span class="metric_label">hostname</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_annotations</div>
	<div class="metric_help">Kubernetes annotations converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_deletion_timestamp</div>
	<div class="metric_help">Unix deletion timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span><span class="metric_label">label_STATEFULSET_LABEL</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_metadata_generation</div>
	<div class="metric_help">Sequence number representing a specific generation of the desired state for the StatefulSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_ordinals_start</div>
	<div class="metric_help">Start ordinal of the StatefulSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_persistentvolumeclaim_retention_policy</div>
	<div class="metric_help">Count of retention policy for StatefulSet template PVCs</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span><span class="metric_label">when_deleted</span><span class="metric_label">when_scaled</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_replicas</div>
	<div class="metric_help">Number of desired pods for a StatefulSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_status_current_revision</div>
	<div class="metric_help">Indicates the version of the StatefulSet used to generate Pods in the sequence [0,currentReplicas).</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span><span class="metric_label">revision</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_status_observed_generation</div>
	<div class="metric_help">The generation observed by the StatefulSet controller.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_status_replicas</div>
	<div class="metric_help">The number of replicas per StatefulSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_status_replicas_available</div>
	<div class="metric_help">The number of available replicas per StatefulSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_status_replicas_current</div>
	<div class="metric_help">The number of current replicas per StatefulSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_status_replicas_ready</div>
	<div class="metric_help">The number of ready replicas per StatefulSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_status_replicas_updated</div>
	<div class="metric_help">The number of updated replicas per StatefulSet.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_statefulset_status_update_revision</div>
	<div class="metric_help">Indicates the version of the StatefulSet used to generate Pods in the sequence [replicas-updatedReplicas,replicas)</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">namespace</span><span class="metric_label">statefulset</span><span class="metric_label">revision</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_storageclass_created</div>
	<div class="metric_help">Unix creation timestamp</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">storageclass</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_storageclass_info</div>
	<div class="metric_help">Information about storageclass.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">storageclass</span><span class="metric_label">provisioner</span><span class="metric_label">reclaim_policy</span><span class="metric_label">volume_binding_mode</span></li></ul>
	</div><div class="metric" data-stability="beta">
	<div class="metric_name">kube_storageclass_labels</div>
	<div class="metric_help">Kubernetes labels converted to Prometheus labels.</div>
	<ul>
	<li><label class="metric_detail">Stability Level:</label><span class="metric_stability_level">BETA</span></li>
	<li data-type="gauge"><label class="metric_detail">Type:</label> <span class="metric_type">Gauge</span></li>
	<li class="metric_labels_varying"><label class="metric_detail">Labels:</label><span class="metric_label">storageclass</span><span class="metric_label">label_STORAGECLASS_LABEL</span></li></ul>
	</div>
</div>

### List of Alpha kube-state-metrics Metrics

Alpha metrics do not have any API guarantees. These metrics must be used at your own risk, subsequent versions of kube-state-metrics may remove these metrics altogether, or mutate the API in such a way that breaks existing dashboards and alerts. 

<div class="metrics">
</div>
