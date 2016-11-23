---
assignees:
- bprashanth
- enisoc
- erictune
- foxish
- janetkuo
- kow3ns
- smarterclayton

---

{% capture overview %}
This page shows how to scale a Stateful Set.
{% endcapture %}

{% capture prerequisites %}

* Stateful Sets are only available in Kubernetes release >= 1.5. 
* Stateful Sets are previously known as Pet Sets in Kubernetes release 1.3-1.4. You can either upgrade your Pet Sets to Stateful Sets, 
or just change all `statefulset` references to `petset`. *TODO: link to upgrade from Pet Sets to Stateful Sets.*
* **Not all stateful applications scale nicely.** You need to understand your Stateful Sets well before continue. If you're unsure, remember that it may not be safe to scale your Stateful Sets. 

{% endcapture %}

{% capture steps %}

### Use `kubectl` to scale Stateful Sets

#### `kubectl scale` (>= 1.4 release)

First, find the Stateful Set you want to scale. Remember, you need to first understand if you can scale it or not. 

```shell
kubectl get statefulsets <stateful-set-name>
```

If you wish to change the number of replicas of your Stateful Set, just use this command:

```shell
kubectl scale statefulsets <stateful-set-name> --replicas=<new-replicas>
```

Note that `kubectl scale` only works on Stateful Set with Kubernetes release >= 1.4. 

#### Alternative: `kubectl apply` / `kubectl edit` / `kubectl patch` (>= 1.3 release) 

Alternatively, you may do [in-place updates](/docs/user-guide/managing-deployments/#in-place-updates-of-resources) on your Stateful Sets. 

If your Stateful Set was initially created with `kubectl apply` or `kubectl create --save-config`, 
you may update `.spec.replicas` of the Stateful Set manifests, and then do a `kubectl apply`:

```shell 
kubectl apply -f <stateful-set-file-updated>
```

Otherwise, you can just edit that field with `kubectl edit`:

```shell 
kubectl edit statefulsets <stateful-set-name>
```

Or use `kubectl patch`:

```shell 
kubectl patch statefulsets <stateful-set-name> -p '{"spec":{"replicas":<new-replicas>}}'
```

### Troubleshooting

#### Scaling down doesn't not work right

You cannot scale down a Stateful Set when some of the stateful pods it manages are unhealthy. Scaling down only takes place
after those stateful pods become running and ready. See discussions [here](https://github.com/kubernetes/kubernetes/issues/36333). 


{% endcapture %}

{% capture whatsnext %}
*TODO: link to other docs about Stateful Set?*
{% endcapture %}

{% include templates/task.md %}
