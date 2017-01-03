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
  * endpoints (aka 'ep')  
  * events (aka 'ev')  
  * horizontalpodautoscalers (aka 'hpa')  
  * ingresses (aka 'ing')  
  * jobs  
  * limitranges (aka 'limits')  
  * namespaces (aka 'ns')  
  * networkpolicies  
  * nodes (aka 'no')  
  * persistentvolumeclaims (aka 'pvc')  
  * persistentvolumes (aka 'pv')  
  * pods (aka 'po')  
  * podsecuritypolicies (aka 'psp')  
  * podtemplates  
  * replicasets (aka 'rs')  
  * replicationcontrollers (aka 'rc')  
  * resourcequotas (aka 'quota')  
  * secrets  
  * serviceaccounts (aka 'sa')  
  * services (aka 'svc')  
  * statefulsets  
  * storageclasses  
  * thirdpartyresources

### Usage

`$ explain RESOURCE`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
recursive |  | false | Print the fields of fields (Currently only 1 level deep) 


