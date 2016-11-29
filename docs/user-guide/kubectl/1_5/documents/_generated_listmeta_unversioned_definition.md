## ListMeta unversioned

Group        | Version     | Kind
------------ | ---------- | -----------
Core | unversioned | ListMeta

> Example yaml coming soon...



ListMeta describes metadata that synthetic resources must have, including lists and various status objects. A resource may have only one of {ObjectMeta, ListMeta}.

<aside class="notice">
Appears In  <a href="#certificatesigningrequestlist-v1alpha1">CertificateSigningRequestList</a>  <a href="#clusterrolebindinglist-v1alpha1">ClusterRoleBindingList</a>  <a href="#clusterrolelist-v1alpha1">ClusterRoleList</a>  <a href="#componentstatuslist-v1">ComponentStatusList</a>  <a href="#configmaplist-v1">ConfigMapList</a>  <a href="#daemonsetlist-v1beta1">DaemonSetList</a>  <a href="#deploymentlist-v1beta1">DeploymentList</a>  <a href="#endpointslist-v1">EndpointsList</a>  <a href="#eventlist-v1">EventList</a>  <a href="#horizontalpodautoscalerlist-v1">HorizontalPodAutoscalerList</a>  <a href="#ingresslist-v1beta1">IngressList</a>  <a href="#joblist-v1">JobList</a>  <a href="#limitrangelist-v1">LimitRangeList</a>  <a href="#namespacelist-v1">NamespaceList</a>  <a href="#networkpolicylist-v1beta1">NetworkPolicyList</a>  <a href="#nodelist-v1">NodeList</a>  <a href="#persistentvolumeclaimlist-v1">PersistentVolumeClaimList</a>  <a href="#persistentvolumelist-v1">PersistentVolumeList</a>  <a href="#poddisruptionbudgetlist-v1beta1">PodDisruptionBudgetList</a>  <a href="#podlist-v1">PodList</a>  <a href="#podtemplatelist-v1">PodTemplateList</a>  <a href="#replicasetlist-v1beta1">ReplicaSetList</a>  <a href="#replicationcontrollerlist-v1">ReplicationControllerList</a>  <a href="#resourcequotalist-v1">ResourceQuotaList</a>  <a href="#rolebindinglist-v1alpha1">RoleBindingList</a>  <a href="#rolelist-v1alpha1">RoleList</a>  <a href="#secretlist-v1">SecretList</a>  <a href="#serviceaccountlist-v1">ServiceAccountList</a>  <a href="#servicelist-v1">ServiceList</a>  <a href="#statefulsetlist-v1beta1">StatefulSetList</a>  <a href="#status-unversioned">Status</a>  <a href="#storageclasslist-v1beta1">StorageClassList</a>  <a href="#thirdpartyresourcelist-v1beta1">ThirdPartyResourceList</a> </aside>

Field        | Description
------------ | -----------
resourceVersion <br /> *string* | String that identifies the server's internal version of this object that can be used by clients to determine when objects have changed. Value must be treated as opaque by clients and passed unmodified back to the server. Populated by the system. Read-only. More info: http://releases.k8s.io/HEAD/docs/devel/api-conventions.md#concurrency-control-and-consistency
selfLink <br /> *string* | SelfLink is a URL representing this object. Populated by the system. Read-only.

