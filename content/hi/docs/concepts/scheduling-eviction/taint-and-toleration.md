---
reviewers:
- davidopp
- kevin-wangzefeng
- bsalamat
title: Taints aur Tolerations
content_type: concept
weight: 50
---


<!-- overview -->
[_Node affinity_](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)
{{< glossary_tooltip text="Pods" term_id="pod" >}} ki ek aisi property hai jo unhe nodes ke ek
set ki taraf *akarshit* karti hai {{< glossary_tooltip text="nodes" term_id="node" >}}
(ya toh preference ke roop mein ya hard requirement ke roop mein). _Taints_ iske viprit hain --
yeh ek node ko pods ke ek set ko door karne ki anumati dete hain.

_Tolerations_ pods par apply hoti hain. Tolerations scheduler ko matching taints wale pods ko
schedule karne ki anumati deti hain. Tolerations scheduling ki anumati deti hain lekin scheduling
ki guarantee nahi deti: scheduler apne function ke hisse ke roop mein
[anya parameters ka bhi mulyankan karta hai](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

Taints aur tolerations milkar ensure karte hain ki pods galat nodes par schedule na ho sakein.
Ek ya adhik taints ek node par apply ki jaati hain; yeh darshata hai ki node un pods ko accept
nahi karega jo taints ko tolerate nahi karte.

<!-- body -->

## Concepts

Aap [kubectl taint](/docs/reference/generated/kubectl/kubectl-commands#taint) ka upyog karke
ek node par taint add kar sakte hain. Udaharan ke liye,

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
```

node `node1` par ek taint lagata hai. Is taint ki key `key1`, value `value1`, aur taint effect
`NoSchedule` hai. Iska matlab hai ki koi bhi pod `node1` par schedule nahi ho sakega jab tak
uske paas matching toleration na ho.

Upar diye gaye command se add ki gayi taint ko hatane ke liye, aap yeh run kar sakte hain:

```shell
kubectl taint nodes node1 key1=value1:NoSchedule-
```

Aap PodSpec mein pod ke liye toleration specify karte hain. Niche diye gaye dono tolerations
upar ki `kubectl taint` line se bani taint se "match" karte hain, aur isliye in mein se kisi bhi
toleration wala pod `node1` par schedule ho sakta hai:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
```

```yaml
tolerations:
- key: "key1"
  operator: "Exists"
  effect: "NoSchedule"
```

Default Kubernetes scheduler kisi particular Pod ko run karne ke liye node select karte samay
taints aur tolerations ko dhyan mein rakhta hai. Lekin agar aap manually Pod ke liye
`.spec.nodeName` specify karte hain, toh woh action scheduler ko bypass kar deta hai; Pod tab
us node par bound ho jaata hai jahan aapne use assign kiya tha, chahe us node par `NoSchedule`
taints hi kyun na ho. Agar aisa hota hai aur node par `NoExecute` taint bhi set hai, toh kubelet
Pod ko eject kar dega jab tak appropriate tolerance set na ho.

Yahan ek pod ka udaharan hai jisme kuch tolerations defined hain:

{{% code_sample file="pods/pod-with-toleration.yaml" %}}

`operator` ki default value `Equal` hai.

Ek toleration ek taint se "match" karti hai agar keys same hain aur effects same hain, aur:

* `operator` `Exists` hai (is case mein koi `value` specify nahi honi chahiye), ya
* `operator` `Equal` hai aur values equal honi chahiye.

{{< note >}}

Do special cases hain:

Agar `key` empty hai, toh `operator` `Exists` hona chahiye, jo saari keys aur values se match
karta hai. Dhyan rakhein ki `effect` ko abhi bhi usi samay match karna hoga.

Ek empty `effect` key `key1` ke saath saare effects se match karta hai.

{{< /note >}}

Upar diye gaye udaharan mein `NoSchedule` ka `effect` use kiya gaya tha. Vikalp ke roop mein,
aap `PreferNoSchedule` ka `effect` use kar sakte hain.

`effect` field ke liye allowed values hain:

`NoExecute`
: Yeh un pods ko affect karta hai jo node par pehle se chal rahe hain, is prakar:

  * Jo pods taint ko tolerate nahi karte unhe turant evict kar diya jaata hai
  * Jo pods taint ko tolerate karte hain aur apni toleration specification mein
    `tolerationSeconds` specify nahi karte woh hamesha ke liye bound rehte hain
  * Jo pods taint ko tolerate karte hain aur specified `tolerationSeconds` ke saath,
    specified samay tak bound rehte hain. Us samay ke baad, node lifecycle controller
    Pods ko node se evict kar deta hai.

`NoSchedule`
: Tainted node par koi naya Pod schedule nahi hoga jab tak unke paas matching toleration na ho.
  Node par currently chal rahe Pods ko evict **nahi** kiya jaata.

`PreferNoSchedule`
: `PreferNoSchedule` `NoSchedule` ka ek "preference" ya "soft" version hai.
  Control plane pod ko tainted node par place karne se *bachne ki koshish karega* agar pod
  taint ko tolerate nahi karta, lekin yeh guaranteed nahi hai.

Aap ek hi node par multiple taints aur ek hi pod par multiple tolerations rakh sakte hain.
Kubernetes multiple taints aur tolerations ko ek filter ki tarah process karta hai: node ki
saari taints se shuru karein, phir un taints ko ignore karein jinke liye pod ke paas matching
toleration hai; bache hue un-ignored taints pod par indicated effects dete hain. Vishesh roop se,

* agar kam se kam ek un-ignored taint `NoSchedule` effect ke saath hai toh Kubernetes pod ko
  us node par schedule nahi karega
* agar `NoSchedule` effect ke saath koi un-ignored taint nahi hai lekin kam se kam ek un-ignored
  taint `PreferNoSchedule` effect ke saath hai toh Kubernetes pod ko us node par schedule na karne
  ki *koshish karega*
* agar kam se kam ek un-ignored taint `NoExecute` effect ke saath hai toh pod ko node se evict
  kar diya jaayega (agar woh node par pehle se chal raha hai), aur node par schedule nahi hoga
  (agar woh abhi node par chal nahi raha).

Udaharan ke liye, sochain ki aap ek node ko is tarah taint karte hain

```shell
kubectl taint nodes node1 key1=value1:NoSchedule
kubectl taint nodes node1 key1=value1:NoExecute
kubectl taint nodes node1 key2=value2:NoSchedule
```

Aur ek pod ke paas do tolerations hain:

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoSchedule"
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
```

Is case mein, pod node par schedule nahi ho sakega, kyunki teesre taint se match karne wali
koi toleration nahi hai. Lekin agar taint add hone ke samay pod pehle se node par chal raha
hai toh woh chalte rehne mein able hoga, kyunki teesra taint teeno mein se akela aisa hai jo
pod dwara tolerate nahi kiya jaata.

Aam taur par, agar `NoExecute` effect wali taint ek node par add ki jaati hai, toh jo pods
taint ko tolerate nahi karte unhe turant evict kar diya jaata hai, aur jo pods taint ko
tolerate karte hain unhe kabhi evict nahi kiya jaata. Lekin, `NoExecute` effect wali toleration
ek optional `tolerationSeconds` field specify kar sakti hai jo yeh bataata hai ki taint add
hone ke baad pod kitne samay tak node se bound rahega. Udaharan ke liye,

```yaml
tolerations:
- key: "key1"
  operator: "Equal"
  value: "value1"
  effect: "NoExecute"
  tolerationSeconds: 3600
```

iska matlab hai ki agar yeh pod chal raha hai aur node par ek matching taint add ki jaati hai,
toh pod 3600 seconds tak node se bound rahega, aur phir evict ho jaayega. Agar us samay se
pehle taint hata di jaati hai, toh pod evict nahi hoga.

## Numeric comparison operators {#numeric-comparison-operators}

{{< feature-state feature_gate_name="TaintTolerationComparisonOperators" >}}

`Equal` aur `Exists` ke alaawa, aap integer values wale taints ko match karne ke liye numeric
comparison operators (`Gt` aur `Lt`) use kar sakte hain. Yeh threshold-based scheduling ke
liye useful hai, jaise reliability level ya SLA tier ke anusaar nodes ko match karna.

* `Gt` tab match karta hai jab taint value toleration value se badi hoti hai.
* `Lt` tab match karta hai jab taint value toleration value se chhoti hoti hai.

Numeric operators ke liye, toleration aur taint dono values valid integers hone chahiye.
Agar koi bhi value integer ke roop mein parse nahi ho sakti, toh toleration match nahi karti.

{{< note >}}
Jab aap `Gt` ya `Lt` tolerations operators use karne wala Pod banate hain, toh API server
validate karta hai ki toleration values valid integers hain. Nodes par taint values ko node
registration ke samay validate nahi kiya jaata. Agar ek node ke paas non-numeric taint value
hai (udaharan ke liye,
`servicelevel.organization.example/agreed-service-level=high:NoSchedule`),
numeric comparison operators wale pods us taint se match nahi karenge aur us node par schedule
nahi ho sakte.
{{< /note >}}

Udaharan ke liye, agar nodes ko service level agreement (SLA) represent karne wali value ke
saath taint kiya jaata hai:

```shell
kubectl taint nodes node1 servicelevel.organization.example/agreed-service-level=950:NoSchedule
```

Ek pod 900 se bade SLA wale nodes ko tolerate kar sakta hai:

{{% code_sample file="pods/pod-with-numeric-toleration.yaml" %}}

Yeh toleration `node1` par taint se match karti hai kyunki `950 > 900` (taint value `Gt`
operator ke liye toleration value se badi hai). Isi tarah, aap `Lt` operator use kar sakte
hain un taints ko match karne ke liye jahan taint value toleration value se chhoti ho:

```yaml
tolerations:
- key: "servicelevel.organization.example/agreed-service-level"
  operator: "Lt"
  value: "1000"
  effect: "NoSchedule"
```

{{< note >}}
Numeric comparison operators use karte samay:

* Toleration aur taint dono values valid signed 64-bit integers hone chahiye
  (zero leading numbers (e.g., "0550") allowed nahi hain).
* Agar koi value integer ke roop mein parse nahi ho sakti, toh toleration match nahi karti.
* Numeric operators saare taint effects ke saath kaam karte hain: `NoSchedule`,
  `PreferNoSchedule`, aur `NoExecute`.
* `PreferNoSchedule` ke saath numeric operators ke liye: agar pod ki toleration numeric
  comparison satisfy nahi karti (e.g., `Gt` use karte samay taint value < toleration value),
  toh scheduler node ko lower priority deta hai lekin agar koi better option nahi hai toh
  wahan schedule bhi kar sakta hai.
{{< /note >}}

{{< warning >}}

`TaintTolerationComparisonOperators` feature gate disable karne se pehle:

* Aapko controller hot-loops se bachne ke liye `Gt` ya `Lt` operators use karne wale saare
  workloads identify karne chahiye.
* Saare workload controller templates ko `Equal` ya `Exists` operators use karne ke liye
  update karein
* `Gt` ya `Lt` operators use karne wale pending pods delete karein
* Validation errors mein spikes ke liye `apiserver_request_total` metric monitor karein
{{< /warning >}}

## Example Use Cases

Taints aur tolerations pods ko nodes se *door* steering karne ya un pods ko evict karne ka
ek flexible tarika hai jo nahi chalne chahiye. Kuch use cases hain:

* **Dedicated Nodes**: Agar aap users ke ek particular set ke exclusive use ke liye nodes ka
  ek set dedicate karna chahte hain, toh aap un nodes par ek taint add kar sakte hain (jaise,
  `kubectl taint nodes nodename dedicated=groupName:NoSchedule`) aur phir unke pods mein
  corresponding toleration add kar sakte hain (yeh sabse aasaan ek custom
  [admission controller](/docs/reference/access-authn-authz/admission-controllers/) likhkar
  kiya jaata hai). Tolerations wale pods tab tainted (dedicated) nodes ke saath-saath cluster
  ke kisi bhi doosre node ka use karne mein able honge. Agar aap nodes unhe dedicate karna
  *chahte hain* aur ensure karna chahte hain ki woh *sirf* dedicated nodes use karein, toh
  aapko additionally nodes ke same set par taint ke similar ek label add karna chahiye (e.g.
  `dedicated=groupName`), aur admission controller ko additionally ek node affinity add karna
  chahiye jisme require ho ki pods sirf `dedicated=groupName` se labeled nodes par schedule ho
  sakein.

* **Special Hardware wale Nodes**: Ek aisi cluster mein jahan nodes ke ek chhote subset ke
  paas specialized hardware hai (udaharan ke liye GPUs), yeh desirable hai ki un nodes se
  special hardware ki zaroorat na hone wale pods ko door rakha jaaye, taaki baad mein aane
  wale pods ke liye jagah bache jinhein special hardware ki zaroorat hai. Yeh specialized
  hardware wale nodes ko taint karke kiya ja sakta hai (e.g.
  `kubectl taint nodes nodename special=true:NoSchedule` ya
  `kubectl taint nodes nodename special=true:PreferNoSchedule`) aur special hardware use karne
  wale pods mein corresponding toleration add karke. Dedicated nodes use case ki tarah, ek
  custom [admission controller](/docs/reference/access-authn-authz/admission-controllers/) ka
  use karke tolerations apply karna shayad sabse aasaan hai. Udaharan ke liye, special hardware
  represent karne ke liye [Extended Resources](/docs/concepts/configuration/manage-resources-containers/#extended-resources)
  use karna recommended hai, apne special hardware nodes ko extended resource name ke saath
  taint karein aur
  [ExtendedResourceToleration](/docs/reference/access-authn-authz/admission-controllers/#extendedresourcetoleration)
  admission controller run karein. Ab, kyunki nodes tainted hain, toleration ke bina koi pod
  unpar schedule nahi hoga. Lekin jab aap extended resource request karne wala pod submit karte
  hain, toh `ExtendedResourceToleration` admission controller automatically pod mein correct
  toleration add kar dega aur woh pod special hardware nodes par schedule ho jaayega. Yeh
  ensure karega ki yeh special hardware nodes special hardware request karne wale pods ke liye
  dedicated hain aur aapko manually apne pods mein tolerations add nahi karni padegi.

* **Taint based Evictions**: Node problems hone par per-pod-configurable eviction behavior,
  jo agale section mein describe kiya gaya hai.

## Taint based Evictions

{{< feature-state for_k8s_version="v1.18" state="stable" >}}

Node controller automatically ek Node ko taint karta hai jab certain conditions true hoti hain.
Niche diye gaye taints built-in hain:

 * `node.kubernetes.io/not-ready`: Node ready nahi hai. Yeh NodeCondition `Ready` ke
   "`False`" hone se correspond karta hai.
 * `node.kubernetes.io/unreachable`: Node, node controller se unreachable hai. Yeh
   NodeCondition `Ready` ke "`Unknown`" hone se correspond karta hai.
 * `node.kubernetes.io/memory-pressure`: Node par memory pressure hai.
 * `node.kubernetes.io/disk-pressure`: Node par disk pressure hai.
 * `node.kubernetes.io/pid-pressure`: Node par PID pressure hai.
 * `node.kubernetes.io/network-unavailable`: Node ka network unavailable hai.
 * `node.kubernetes.io/unschedulable`: Node unschedulable hai.
 * `node.cloudprovider.kubernetes.io/uninitialized`: Jab kubelet ek "external" cloud provider
    ke saath start kiya jaata hai, toh yeh taint node par set kiya jaata hai use unusable mark
    karne ke liye. Cloud-controller-manager ke ek controller ke is node ko initialize karne ke
    baad, kubelet is taint ko hata deta hai.

Agar kisi node ko drain karna ho, toh node controller ya kubelet `NoExecute` effect ke saath
relevant taints add karta hai. Yeh effect `node.kubernetes.io/not-ready` aur
`node.kubernetes.io/unreachable` taints ke liye default roop se add kiya jaata hai.
Agar fault condition normal ho jaati hai, toh kubelet ya node controller relevant taint(s)
hata sakta hai.

Kuch cases mein jab node unreachable hota hai, API server node par kubelet ke saath
communicate nahi kar sakta. Pods delete karne ka decision kubelet ko tab tak communicate nahi
kiya ja sakta jab tak API server ke saath communication re-establish na ho jaaye. Iss beech
mein, deletion ke liye scheduled pods partitioned node par chalte reh sakte hain.

{{< note >}}
Control plane nodes mein naye taints add karne ki rate ko limit karta hai. Yeh rate limiting
un evictions ki sankhya ko manage karta hai jo tab trigger hoti hain jab bahut saare nodes
ek saath unreachable ho jaate hain (udaharan ke liye: agar network disruption hoti hai).
{{< /note >}}

Aap ek Pod ke liye `tolerationSeconds` specify kar sakte hain yeh define karne ke liye ki
failing ya unresponsive Node par woh Pod kitne samay tak bound rahega.

Udaharan ke liye, aap network partition hone par bahut saari local state wale application ko
node se kaafi samay tak bound rakhna chahte ho sakte hain, umeed rakhte hue ki partition
recover ho jaayega aur isliye pod eviction se bachaa ja sakta hai.
Is Pod ke liye aap jo toleration set karte hain woh kuch is tarah lag sakti hai:

```yaml
tolerations:
- key: "node.kubernetes.io/unreachable"
  operator: "Exists"
  effect: "NoExecute"
  tolerationSeconds: 6000
```

{{< note >}}
Kubernetes automatically `node.kubernetes.io/not-ready` aur
`node.kubernetes.io/unreachable` ke liye `tolerationSeconds=300` ke saath toleration add
karta hai, jab tak aap, ya koi controller, un tolerations ko explicitly set na karein.

Yeh automatically-added tolerations mean karti hain ki Pods in problems mein se kisi ek ke
detect hone ke baad 5 minutes tak Nodes se bound rehte hain.
{{< /note >}}

[DaemonSet](/docs/concepts/workloads/controllers/daemonset/) pods niche diye gaye taints ke
liye bina `tolerationSeconds` ke `NoExecute` tolerations ke saath create kiye jaate hain:

  * `node.kubernetes.io/unreachable`
  * `node.kubernetes.io/not-ready`

Yeh ensure karta hai ki DaemonSet pods in problems ke karan kabhi evict nahi hote.

{{< note >}}
Node controller nodes mein taints add karne aur pods evict karne ke liye responsible tha.
Lekin 1.29 ke baad, taint-based eviction implementation ko node controller se bahar ek alag,
aur independent component mein shift kar diya gaya hai jise taint-eviction-controller kaha
jaata hai. Users optionally taint-based eviction ko
`--controllers=-taint-eviction-controller` ko kube-controller-manager mein set karke
disable kar sakte hain.
{{< /note >}}

## Condition ke anusaar Nodes ko Taint karna

Control plane, node {{<glossary_tooltip text="controller" term_id="controller">}} ka upyog
karke, automatically [node conditions](/docs/concepts/scheduling-eviction/node-pressure-eviction/#node-conditions)
ke liye `NoSchedule` effect ke saath taints create karta hai.

Scheduler scheduling decisions karte samay node conditions nahi, taints check karta hai.
Yeh ensure karta hai ki node conditions directly scheduling ko affect nahi karti.
Udaharan ke liye, agar `DiskPressure` node condition active hai, toh control plane
`node.kubernetes.io/disk-pressure` taint add karta hai aur affected node par naye pods
schedule nahi karta. Agar `MemoryPressure` node condition active hai, toh control plane
`node.kubernetes.io/memory-pressure` taint add karta hai.

Aap naye bane pods ke liye corresponding Pod tolerations add karke node conditions ko ignore
kar sakte hain. Control plane `node.kubernetes.io/memory-pressure` toleration un pods par bhi
add karta hai jinki {{< glossary_tooltip text="QoS class" term_id="qos-class" >}}
`BestEffort` ke alaawa koi aur hai. Yeh isliye hai kyunki Kubernetes `Guaranteed` ya
`Burstable` QoS classes mein pods ko (chahe unke paas koi memory request set na ho) aise
treat karta hai jaise woh memory pressure cope karne mein able hain, jabki naye `BestEffort`
pods affected node par schedule nahi hote.

DaemonSet controller automatically niche diye gaye `NoSchedule` tolerations saare daemons mein
add karta hai, DaemonSets ko break hone se rokne ke liye.

  * `node.kubernetes.io/memory-pressure`
  * `node.kubernetes.io/disk-pressure`
  * `node.kubernetes.io/pid-pressure` (1.14 ya baad ka)
  * `node.kubernetes.io/unschedulable` (1.10 ya baad ka)
  * `node.kubernetes.io/network-unavailable` (*sirf host network*)

Yeh tolerations add karna backward compatibility ensure karta hai. Aap DaemonSets mein
arbitrary tolerations bhi add kar sakte hain.

## Device taints aur tolerations

Pure nodes ko taint karne ki jagah, administrators [individual devices ko bhi taint kar sakte hain](/docs/concepts/scheduling-eviction/dynamic-resource-allocation#device-taints-and-tolerations)
jab cluster special hardware manage karne ke liye [dynamic resource allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
use karta hai. Iska faayda yeh hai ki tainting ko exactly us hardware ki taraf target kiya
ja sakta hai jo faulty hai ya maintenance ki zaroorat hai. Tolerations bhi supported hain
aur devices request karte samay specify ki ja sakti hain. Taints ki tarah yeh un saare pods
par apply hoti hain jo same allocated device share karte hain.

## {{% heading "whatsnext" %}}

* [Node-pressure Eviction](/docs/concepts/scheduling-eviction/node-pressure-eviction/) ke
  baare mein padhen aur aap ise kaise configure kar sakte hain
* [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/) ke baare mein
  padhen
* [device taints aur tolerations](/docs/concepts/scheduling-eviction/dynamic-resource-allocation#device-taints-and-tolerations)
  ke baare mein padhen