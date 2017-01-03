------------

# describe

>bdocs-tab:example Describe a node

```bdocs-tab:example_shell
kubectl describe nodes kubernetes-node-emt8.c.myproject.internal
```

>bdocs-tab:example Describe a pod

```bdocs-tab:example_shell
kubectl describe pods/nginx
```

>bdocs-tab:example Describe a pod identified by type and name in "pod.json"

```bdocs-tab:example_shell
kubectl describe -f pod.json
```

>bdocs-tab:example Describe all pods

```bdocs-tab:example_shell
kubectl describe pods
```

>bdocs-tab:example Describe pods by label name=myLabel

```bdocs-tab:example_shell
kubectl describe po -l name=myLabel
```

>bdocs-tab:example Describe all pods managed by the 'frontend' replication controller (rc-created pods # get the name of the rc as a prefix in the pod the name).

```bdocs-tab:example_shell
kubectl describe pods frontend
```


Show details of a specific resource or group of resources. This command joins many API calls together to form a detailed description of a given resource or group of resources. 

  $ kubectl describe TYPE NAME_PREFIX
  
will first check for an exact match on TYPE and NAME PREFIX. If no such resource exists, it will output details for every resource that has a name prefixed with NAME PREFIX. 

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

`$ describe (-f FILENAME | TYPE [NAME_PREFIX | -l label] | TYPE/NAME)`



### Flags

Name | Shorthand | Default | Usage
---- | --------- | ------- | ----- 
all-namespaces |  | false | If present, list the requested object(s) across all namespaces. Namespace in current context is ignored even if specified with --namespace. 
filename | f | [] | Filename, directory, or URL to files containing the resource to describe 
include-extended-apis |  | true | If true, include definitions of new APIs via calls to the API server. [default true] 
recursive | R | false | Process the directory used in -f, --filename recursively. Useful when you want to manage related manifests organized within the same directory. 
selector | l |  | Selector (label query) to filter on 
show-events |  | true | If true, display events related to the described object. 


