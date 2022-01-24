## Context

This blog is an outcome of the experience gained while working for a client having a Kubernetes based platform hosted on infrastructure (EC2 instances) hosted on AWS. AWS releases new images to be used to build the servers (EC2 instances) every now and then, when a new vulnerability fix is made, a newer feature is added etc. This client had additional hardening to be done on those images and a custom image is released internally for the entire organization to use. There was a deadline imposed by when old the images must be stopped to be in use and the infrastructure is to be built using only the latest image available. One of the teams that is impacted by this was the platform team, the team that hosts and manages a shared platform based on Kubernetes. Many applications teams in the organization host their applications on this shared platform as independent containers. 
Every time a new image is available, all the servers that are a part of the Kubernetes cluster were to be upgraded.  The Blue green strategy mentioned in this paper was one of the strategies followed. All the applications using the shared platform were redeployed when a new cluster using the latest EC2 images is built. There was a lead time involved in validating all the applications redeployed and all the application stakeholders are involved for this validation exercise. The more the applications, the more the lead time.
There was hence a need to explore any other possible options to reduce the dependency on the application teams to validate each time the applications are deployed into a newly built cluster.

## Need for the Infrastructure management

Managing a platform includes the activity of ensuring that the underlying infrastructure is maintained, upgraded, and patched at regular intervals as applicable to take care of latest features, capabilities or vulnerability fixes that are available. Handling these activities with minimal or zero impact to the business is crucial.
Platform agnostic and loosely coupled code base, Scalability, Reliability, Self-healing capability are the current generation basic requirements for the development, roll out and maintenance of applications for any digital customer to be able to keep up with the ever-changing demands, technologies, tools, and business strategies. Kubernetes is one such an open-source container orchestration platform that allows customers to run their applications effectively as containers without worrying about the scale of the application, the underlying OS, hardware, or any other interdependencies. 
As Kubernetes based platforms are gaining more and more popularity, each of the major cloud service providers like AWS, Azure and GCP have introduced their own fully managed Kubernetes service (AWS-EKS, Azure-AKS, GCP-GKE) that also takes care or all underlying platform maintenance, upgrade, and patching. The customers are thereby able to focus on core development activities and be more and more matured in being able to host the required applications or services as containers on those managed Kubernetes platforms. Customers can now focus on business needs than worrying about how to keep their infrastructure up to date. 
Despite the availability of many sophisticated solutions for end-to-end management, there are still many customers who want to continue having (or continue maintaining) their own infrastructure and host Kubernetes to exploit all the features that container orchestration tools bring in. The reasons for this customer outlook can be manyfold. It could be due to the specific compliance requirements on their side, Unique custom requirements, any other factors like investment already made or organization strategy/product roadmap that drives this decision.
Managing own infrastructure brings in the need to keep it up to date with latest OS version, latest patches and fixes applied to exploit the state-of-the-art technologies, strategies, tools available and to take care of the ever-growing list of vulnerabilities and security threats.
This paper presents a point of view on some of the challenges involved in handling such infrastructure upgrade/patching activities in a Kubernetes based environment, some of the strategies that can be followed and pros and cons for each approach.
 
## Some of the Kubernetes cluster upgrade strategies that can be followed

### Blue Green Strategy

One of the popular strategies followed in some of the client landscapes is the blue green strategy.

In Kubernetes based platforms, two equivalent environments named as blue and green instances are always maintained, with one of them being treated as an active cluster at a give point in time. The other cluster could serve multiple purposes. 
a)	It can also be utilized for planned releases. To do this, the new versions of all the applications to be released can be deployed on this cluster and once all the verification and sanity checks are done, a traffic switch needs to be done from the current active cluster to this cluster.
b)	It can be utilized to roll out the underlying infrastructure upgrade/patches to be released. The cluster must be first upgraded/rebuilt to the latest release, all the required applications to be redeployed. After a thorough verification and sanity test, the traffic switch to be done from the current active cluster to this cluster.
c)	It can at times act as a disaster recovery environment (assuming the cluster is built on servers located in disaster recovery location. It could be a different availability zone or a region as applicable if the servers are hosted on cloud).
 ![image](https://user-images.githubusercontent.com/63296841/150771254-feb85403-545c-4dc4-8452-fbbba758f9d5.png)
)

#### Advantages: 
1)	The active cluster is never touched during the upgrade process. Only once everything is ready and thoroughly verified, a switch can be done. 
2)	The second cluster may be available as a backup or for disaster recovery situations.
3)	If there is any issue or a problem identified post the release, there is old environment (cluster that was active earlier) available for immediate roll back.
Hence the blue green strategy can be considered as the safest option for releases/upgrade. With easy roll back option and minimal down time.
#### Important Points to note:
1)  It must be noted that for blue green strategy to work well, both the clusters are to be maintained at all times. This means more infra structure cost and some additional maintenance overhead.
2)	Each time the cluster is rebuilt due to infrastructure upgrade, the applications will have to be redeployed. Hence right effort needs to be considered for validations and application stakeholders’ involvement as needed.  
3)	Due importance to be given to automate the deployment and validation process as much as possible to reduce the dependencies and any version mismatch.
4)	Since there is a switch to a new environment each time, some application downtime can be noted depending on the type of the application. Example for an application with many synchronous transactions and orchestration needs, it may be important to ensure that a synchronous transaction initiated from an active cluster is completed in the same cluster before the switch.

 
### In place upgrade

In place upgrade is a strategy that ensures an upgrade without the need of maintaining or creating a new cluster.  
In Kubernetes based platforms the upgrade is done for one node at a time and thereby upgrading the entire cluster.
The node that is to be upgraded is marked as non-schedulable so that no new pods get deployed on it. The node is drained so that existing pods running on it have a graceful closure. The Kubernetes creates the equivalent pods on the other active nodes to ensure that the deployed applications continue to be available.
Once it is confirmed that no pods are running on the node to be upgraded, the upgrade process is initiated. Once the node is upgraded, its again marked as schedulable so that the applications or services start getting deployed on the upgraded node.
Depending on the type of the node to be updated (Master/Worker) and the components running on them, due care needs to be taken to ensure that nothing is missed, and all inter dependencies are taken care. Example: The etcd database on all master nodes must be in sync. Various Kubernetes based platforms available such as Red Hat Openshift has mechanisms/scripts to ensure these things.
In place upgrade can be considered as a bit complex upgrade procedure as each node/component have to be upgraded and verified for completion.
 ![image](https://user-images.githubusercontent.com/63296841/150771693-7a6a6675-f170-47de-8830-700c8e01e016.png)

#### Advantages:
1)	Is Cost effective compared to strategies like Blue Green, as there are a smaller number of servers to be maintained.
2)	The applications are not redeployed from scratch. New pods relevant to the same application image are deployed by Kubernetes on the active nodes. Hence the applications related stakeholder involvement and dependency management may go away. 
3)	Near to Zero Downtime 

#### Important points to note:
1) Since the upgrade is a complex process handling one node/component at a time, it is important to ensure every step is covered each time. Else the node may not come up post upgrade. Manual validations may be unavoidable at times and scope for automation could be low depending on the upgrade to be done.
2) It is important to pay due attention to monitor and plan for the pods/applications/services that use persistent storage so that the new pods/applications/services that get created on new nodes using the same storage are fully functional.
3) If there is any issue post upgrade, there may be no rollback option available since the upgrade has happened on the same server. The mitigation is to plan and maintain a separate disaster recovery environment that can be banked upon for unplanned failures after the upgrade.
 
### Upgrade using a server pool

Having a pool of servers (more than the number of servers needed for a cluster) is an approach that mitigates some of the risks of in place upgrade and off course at a cost of having few more servers.

In Kubernetes based platforms, one new node based on the upgraded infrastructure is added to the active cluster each time, followed by draining out an equivalent existing node having the older version. As and when an older node is drained out, the pods running on the nodes are evicted and rescheduled on the active nodes which include the newly added node with upgraded infrastructure. Thus after a few iterations, we will have an entirely new set of nodes in the cluster that had the nodes based on older infrastructure.
The number of nodes to be newly added for each type(master/worker) will be the same as the number of nodes of each type in the current cluster. It may be either possible to have those many servers (Pool of servers) ready upfront, or we can further optimize the cost by creating one server at a time and terminating the old server as and when it’s removed from the cluster. However, it is safer to retain the servers for some time for possible rollback options.
 ![image](https://user-images.githubusercontent.com/63296841/150771936-ae4f5577-a66b-4e00-8247-5a4f9ac43111.png)

#### Advantages:
1)	Is Costlier than in place upgrade but Cost effective compared to strategies like Blue Green, as there could be a smaller number of servers to be maintained and only one active cluster to be maintained.
2)	The applications are not redeployed from scratch. New pods relevant to the same application image are deployed by Kubernetes on the active nodes. Hence the applications related stakeholder involvement and dependency management may go away.
3)	The risk prevalent in “in place upgrade strategy” -the possibility of not being able to bring up a server after upgrade is mitigated to a certain extent. The server can be added only after a thorough validation that its ready to be added to the cluster. Roll back is not easy but better that in place upgrade
4)	Supports Zero Downtime in Highly available architectures. This is because the pods need not be redeployed. If an application has only one instance (Not highly available), then there could be a slightest delay while the pod comes up in some other node.
#### Important points to note:
1) The upgrade process is complex. It is important to pay due attention to monitor and plan for the pods/applications/services that use persistent storage so that the new pods/applications/services that get created on new nodes using the same storage are fully functional.
2) If there is any issue post upgrade, the rollback option may not be straight forward like in the blue-green strategy. The new server needs to be manually drained and removed from the cluster and the older server need to be added back. Hence it may be important to retain the old servers for some time before completely terminating them.
3) It is better to plan and maintain a separate disaster recovery environment. This can be used for unplanned disasters and as a backup during unplanned failures after the upgrade.

### Which strategy to choose?

Blue-Green strategy is the safest upgrade strategy with immediate rollback option available provided there is no cost constraint to maintain two equivalent environments and involving application stakeholders for validation as needed each time during the upgrade is not a concern. 
In Place upgrade is a cost-effective strategy but could be complex to implement and validate and has no rollback option available unless disaster recovery environment is available as a fallback option.
Having a Pool of server works well when maintaining a separate equivalent environment is not feasible. Rollback is possible but not straight forward unless disaster recovery environment is available as a fallback option.

#### Below is the approach comparison summary

![image](https://user-images.githubusercontent.com/63296841/150772360-920bf737-33d5-4a30-baf2-c3ef2748b9b9.png)

### Conclusion

Each strategy comes with its own advantages and limitations and there is no one solution that fits all.
If there is no cost constraint, a minimal downtime is allowed but the main point is to have some immediate fallback option in case of upgrade failure then the Blue green approach could be the best.
If there is severe cost crunch but a risk that no roll immediate back option maybe available is accepted, then in-Place upgrade may suit the best.
If the option is to keep the cost as low as possible with a medium level risk aptitude that roll back during the upgrade could be complex, and the aim is to keep the application deployment to minimal, then the upgrade with a pool of servers could be the best approach.
