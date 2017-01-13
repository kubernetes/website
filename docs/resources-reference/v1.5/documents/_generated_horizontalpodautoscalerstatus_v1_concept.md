

-----------
# HorizontalPodAutoscalerStatus v1



Group        | Version     | Kind
------------ | ---------- | -----------
Core | v1 | HorizontalPodAutoscalerStatus




<aside class="notice">Other api versions of this object exist: <a href="#horizontalpodautoscalerstatus-v1beta1">v1beta1</a> </aside>


current status of a horizontal pod autoscaler

<aside class="notice">
Appears In <a href="#horizontalpodautoscaler-v1">HorizontalPodAutoscaler</a> </aside>

Field        | Description
------------ | -----------
currentCPUUtilizationPercentage <br /> *integer*  | current average CPU utilization over all pods, represented as a percentage of requested CPU, e.g. 70 means that an average pod is using now 70% of its requested CPU.
currentReplicas <br /> *integer*  | current number of replicas of pods managed by this autoscaler.
desiredReplicas <br /> *integer*  | desired number of replicas of pods managed by this autoscaler.
lastScaleTime <br /> *[Time](#time-unversioned)*  | last time the HorizontalPodAutoscaler scaled the number of pods; used by the autoscaler to control how often the number of pods is changed.
observedGeneration <br /> *integer*  | most recent generation observed by this autoscaler.






