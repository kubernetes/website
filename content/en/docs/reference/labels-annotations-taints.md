
## kubernetes.io/limit-ranger

Example: `kubernetes.io/limit-ranger: LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx`

Used on: Namespace

Kubernetes by default doesn't provide any resource limit, that means unless you explicitly define limits,
your container can consume unlimited CPU and memory.
We can define default limit for pods by creating a LimitRange in the relevant namespace.
Pods deployed after this LimitRange will have these limits applied to them.
The annotation `limit-ranger` indicates that limits were requested for the pod and they were applied successfully.
For more details - [LimitRange](/docs/concepts/policy/limit-range)

