------------

# explain

>bdocs-tab:example Get the documentation of the resource and its fields

```bdocs-tab:example_shell
kubectl explain pods
```

>bdocs-tab:example Get the documentation of a specific field of a resource

```bdocs-tab:example_shell
kubectl explain pods.spec.containers
```



Documentation of resources.

Valid resource types include:
* clusters (valid only for federation apiservers)
* componentstatuses (aka 'cs')
* configmaps (aka 'cm')
* daemonsets (aka 'ds')
* deployments (aka 'deploy')
* events (aka 'ev')
* endpoints (aka 'ep')
* horizontalpodautoscalers (aka 'hpa')
* ingress (aka 'ing')
* jobs
* limitranges (aka 'limits')
* nodes (aka 'no')
* namespaces (aka 'ns')
* petsets (alpha feature, may be unstable)
* pods (aka 'po')
* persistentvolumes (aka 'pv')
* persistentvolumeclaims (aka 'pvc')
* quota
* resourcequotas (aka 'quota')
* replicasets (aka 'rs')
* replicationcontrollers (aka 'rc')
* secrets
* serviceaccounts (aka 'sa')
* services (aka 'svc')


### Usage

`$ explain RESOURCE`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
recursive |  | false | Print the fields of fields (Currently only 1 level deep) 


