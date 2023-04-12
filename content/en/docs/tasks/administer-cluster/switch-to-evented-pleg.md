---
title: Switching From Polling to CRI Event-based Updates to Container Status
min-kubernetes-server-version: 1.26
content_type: task
weight: 90
---

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

<!-- overview -->
This page shows how to migrate notes to use event based updates for container status. The event-based
implementation reduces node resource consumption by the kubelet, compared to the legacy approach
that relies on polling.
You may know this feature as _evented Pod lifecycle event generator (PLEG)_. That's the name used
internally within the Kubernetes project for a key implementation detail.


## {{% heading "prerequisites" %}}

* You need to run a version of Kubernetes that provides this feature.
Kubernetes {{< skew currentVersion >}} includes beta support for event-based container
status updates. The feature is beta and is disabled by default. 
{{< version-check >}}
If you are running a different version of Kubernetes, check the documentation for that release.


<!-- steps -->

## Why switch to Evented PLEG?

* The current `Generic PLEG` incurs non-negligible overhead due to frequent polling of container statuses.
* This overhead is exacerbated by Kubelet's parallelism, limiting its scalability and causing poor performance and reliability problems.
* The goal of `Evented PLEG` is to reduce unnecessary work during inactivity by replacing periodic polling.

## Switching to Evented PLEG


1. Start the Kubelet with the [feature gate](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/) `EventedPLEG` enabled. In Kubelet feature gates can be enabled by editing [config file](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/) and restarting the Kubelet service.

2. Please make sure the node is [drained](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) before proceeding. 

3. Start the `CRI Runtime` with the `Evented PLEG` support. 
      {{< tabs name="tab_with_code" >}}
      {{< tab name="Containerd" codelang="bash" >}}
      Version 1.7+
      {{< /tab >}}
      {{< tab name="CRI-O" codelang="bash" >}}
      Version 1.26+
      
      Check if the CRI-O is already configured to emit `CRI Events` by verifying the configuration, 
      ```
      $ crio config | grep enable_pod_events
      ```
      If its enabled it should show, 
      ```
      # enable_pod_events = true
      ```

      To enable it, start the cri-o daemon with the flag `--enable-pod-events=true` or using a drop in config like,
            
      [crio.runtime]
      enable_pod_events: true
      

      {{< /tab >}}
      {{< /tabs >}}


{{< version-check >}}

4. Verify that `Evented PLEG` is in use by looking for the term `EventedPLEG` in the kubelet logs

      The output is similar to this:
      ```
      I0314 11:10:13.909915 1105457 feature_gate.go:249] feature gates: &{map[EventedPLEG:true]}
      ```

      If you have set LOG_LEVEL to 4 and above, you might see more entries that indicate `Evented PLEG` is in use by the kubelet.
      
      ```
      I0314 11:12:42.009542 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=3b2c6172-b112-447a-ba96-94e7022912dc
      I0314 11:12:44.623326 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
      I0314 11:12:44.714564 1110177 evented.go:238] "Evented PLEG: Generated pod status from the received event" podUID=b3fba5ea-a8c5-4b76-8f43-481e17e8ec40
      ```

## {{% heading "whatsnext" %}}

* Learn more about [KEP 3386](https://github.com/kubernetes/enhancements/blob/5b258a990adabc2ffdc9d84581ea6ed696f7ce6c/keps/sig-node/3386-kubelet-evented-pleg/README.md).



