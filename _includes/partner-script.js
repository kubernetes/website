;(function () {
	var partners = [
		{
			type: 0,
			name: 'CoreOS',
			logo: 'core_os',
			link: 'https://tectonic.com/',
			blurb: 'Tectonic is the enterprise-ready Kubernetes product, by CoreOS. It adds key features to allow you to manage, update, and control clusters in production.'
		},
		{
			type: 0,
			name: 'Deis',
			logo: 'deis',
			link: 'https://deis.com',
			blurb: 'Deis the creators of Helm, Workflow, and Steward, helps developers and operators build, deploy, manage and scale their applications on top of Kubernetes.'
		},
		{
			type: 0,
			name: 'StackPointCloud',
			logo: 'stackpoint',
			link: 'https://stackpoint.io',
			blurb: 'StackPointCloud builds Stackpoint.io, the universal control plane for Kubernetes Anywhere -- compose and build your own infrastructure as easily as a DigitalOcean droplet at any public cloud provider.'
		},
		{
			type: 0,
			name: 'Sysdig Cloud',
			logo: 'sys_dig',
			link: 'https://sysdig.com/blog/monitoring-kubernetes-with-sysdig-cloud/',
			blurb: 'Container native monitoring with deep support for Kubernetes.'
		},
		{
			type: 0,
			name: 'Puppet',
			logo: 'puppet',
			link: 'https://puppet.com/blog/managing-kubernetes-configuration-puppet',
			blurb: 'The Puppet module for Kubernetes makes it easy to manage Pods, Replication Controllers, Services and more in Kubernetes, and to build domain-specific interfaces to one\'s Kubernetes configuration.'
		},
		{
			type: 0,
			name: 'Citrix',
			logo: 'citrix',
			link: 'https://www.citrix.com/networking/microservices.html',
			blurb: 'Netscaler CPX gives app developers all the features they need to load balance their microservices and containerized apps with Kubernetes.'
		},
		{
			type: 0,
			name: 'Cockroach Labs',
			logo: 'cockroach_labs',
			link: 'https://www.cockroachlabs.com/blog/running-cockroachdb-on-kubernetes/',
			blurb: 'CockroachDB is a distributed SQL database whose built-in replication and survivability model pair with Kubernetes to truly make data easy.'
		},
		{
			type: 0,
			name: 'Skippbox',
			logo: 'skippbox',
			link: 'http://www.skippbox.com/tag/products/',
			blurb: 'Creator of Cabin the first mobile application for Kubernetes, and kompose. Skippbox’s solutions distill all the power of k8s in simple easy to use interfaces.'
		},
		{
			type: 0,
			name: 'Weave Works',
			logo: 'weave_works',
			link: ' https://weave.works/kubernetes',
			blurb: 'Weaveworks enables Developers and Dev/Ops teams to easily connect, deploy, secure, manage, and troubleshoot microservices in Kubernetes.'
		},
		{
			type: 0,
			name: 'Wercker',
			logo: 'wercker',
			link: 'http://www.wercker.com/integrations/kubernetes',
			blurb: 'Wercker automates your build, test and deploy pipelines for launching containers and triggering rolling updates on your Kubernetes cluster. '
		},
		{
			type: 0,
			name: 'Rancher',
			logo: 'rancher',
			link: 'http://rancher.com/kubernetes/',
			blurb: 'Rancher is an open-source, production-ready container management platform that makes it easy to deploy and leverage Kubernetes in the enterprise.'
		},
		{
			type: 0,
			name: 'Red Hat',
			logo: 'redhat',
			link: 'https://www.openshift.com/',
			blurb: 'Leverage an enterprise Kubernetes platform to orchestrate complex, multi-container apps.'
		},
		{
			type: 0,
			name: 'Intel',
			logo: 'intel',
			link: 'https://tectonic.com/press/intel-coreos-collaborate-on-openstack-with-kubernetes.html',
			blurb: 'Powering the GIFEE (Google’s Infrastructure for Everyone Else), to run OpenStack deployments on Kubernetes.'
		},
		{
			type: 0,
			name: 'ElasticKube',
			logo: 'elastickube',
			link: 'https://www.ctl.io/elastickube-kubernetes/',
			blurb: 'Self-service container management for Kubernetes.'
		},
		{
			type: 0,
			name: 'Platform9',
			logo: 'platform9',
			link: 'https://platform9.com/products/kubernetes/',
			blurb: 'Platform9 is the open source-as-a-service company that takes all of the goodness of Kubernetes and delivers it as a managed service.'
		},
		{
			type: 0,
			name: 'Datadog',
			logo: 'datadog',
			link: 'http://docs.datadoghq.com/integrations/kubernetes/',
			blurb: 'Full-stack observability for dynamic infrastructure & applications. Includes precision alerting, analytics and deep Kubernetes integrations. '
		},
		{
			type: 0,
			name: 'AppFormix',
			logo: 'appformix',
			link: 'http://www.appformix.com/solutions/appformix-for-kubernetes/',
			blurb: 'AppFormix is a cloud infrastructure performance optimization service helping enterprise operators streamline their cloud operations on any Kubernetes cloud. '
		},
		{
			type: 0,
			name: 'Crunchy',
			logo: 'crunchy',
			link: 'http://info.crunchydata.com/blog/advanced-crunchy-containers-for-postgresql',
			blurb: 'Crunchy PostgreSQL Container Suite is a set of containers for managing PostgreSQL with DBA microservices leveraging Kubernetes and Helm.'
		},
		{
			type: 0,
			name: 'Aqua',
			logo: 'aqua',
			link: 'http://blog.aquasec.com/security-best-practices-for-kubernetes-deployment',
			blurb: 'Deep, automated security for your containers running on Kubernetes.'
		},
		{
			type: 0,
			name: 'Canonical',
			logo: 'canonical',
			link: 'https://jujucharms.com/canonical-kubernetes/',
			blurb: 'The Canonical Distribution of Kubernetes enables you to operate Kubernetes clusters on demand on any major public cloud and private	infrastructure.'
		},
		{
			type: 0,
			name: 'Distelli',
			logo: 'distelli',
			link: 'https://www.distelli.com/',
			blurb: 'Pipelines from your source repositories to your Kubernetes Clusters on any cloud.'
		},
		{
			type: 0,
			name: 'Nuage networks',
			logo: 'nuagenetworks',
			link: 'https://github.com/nuagenetworks/nuage-kubernetes',
			blurb: 'The Nuage SDN platform provides policy-based networking between Kubernetes Pods and non-Kubernetes environments with visibility and security monitoring.'
		},
		{
			type: 0,
			name: 'Sematext',
			logo: 'sematext',
			link: 'https://sematext.com/kubernetes/',
			blurb: 'Logging & Monitoring: Automatic collection and processing of Metrics, Events and Logs for auto-discovered pods and Kubernetes nodes.'
		},
		{
			type: 0,
			name: 'Diamanti',
			logo: 'diamanti',
			link: 'https://www.diamanti.com/products/',
			blurb: 'Diamanti deploys containers with guaranteed performance using Kubernetes in the first hyperconverged appliance purpose built for containerized applications.'
		},
		{
			type: 0,
			name: 'Apprenda',
			logo: 'apprenda',
			link: 'https://apprenda.com/kubernetes-support/',
			blurb: 'Apprenda creates and supports modern, enterprise-ready application platforms for both cloud native and traditional application workloads.'
		},
		{
			type: 0,
			name: 'Aporeto',
			logo: 'aporeto',
			link: 'https://aporeto.com/trireme',
			blurb: 'Aporeto makes cloud-native applications secure by default without impacting developer velocity and works at any scale, on any cloud.'
		},
		{
  			type: 0,
 			name: 'Giant Swarm',
 			logo: 'giant_swarm',
 			link: 'https://giantswarm.io',
 			blurb: 'Giant Swarm provides fully-managed Kubernetes Clusters in your location of choice, so you can focus on your product.'
 		},
		{
 			type: 0,
 			name: 'Mirantis',
 			logo: 'mirantis',
 			link: 'https://content.mirantis.com/Containerizing-OpenStack-on-Kubernetes-Video-Landing-Page.html',
 			blurb: 'Mirantis builds and manages private clouds with open source software such as OpenStack, deployed as containers orchestrated by Kubernetes.'
 		},
		{
 			type: 0,
 			name: 'Kubernetic',
 			logo: 'kubernetic',
 			link: 'https://kubernetic.com/',
 			blurb: 'Kubernetic is a Kubernetes Desktop client that simplifies and democratizes cluster management for DevOps.'
 		},
		{
			type: 1,
			name: 'Apprenda',
			logo: 'apprenda',
			link: 'https://apprenda.com/kubernetes-support/',
			blurb: 'Apprenda offers flexible and wide range of support plans for pure play Kubernetes on your choice of infrastructure, cloud provider and operating system.'
		},
		{
			type: 1,
			name: 'Reactive Ops',
			logo: 'reactive_ops',
			link: 'https://www.reactiveops.com/kubernetes/',
			blurb: 'ReactiveOps has written automation on best practices for infrastructure as code on GCP & AWS using Kubernetes, helping you build and maintain a world-class infrastructure at a fraction of the price of an internal hire.'
		},
		{
			type: 1,
			name: 'Livewyer',
			logo: 'livewyer',
			link: 'https://livewyer.io/services/kubernetes-experts/',
			blurb: 'Kubernetes experts that on-board applications and empower IT teams to get the most out of containerised technology.'
		},
		{
			type: 1,
			name: 'Deis',
			logo: 'deis',
			link: 'https://deis.com/services/',
			blurb: 'Deis provides professional services and 24x7 operational support for any Kubernetes cluster managed by our global cluster operations team.'
		},
		{
			type: 1,
			name: 'StackPointCloud',
			logo: 'stackpoint',
			link: 'https://stackpoint.io',
			blurb: 'StackPointCloud offers a wide range of support plans for managed Kubernetes clusters built through its universal control plane for Kubernetes Anywhere.'
		},
		{
			type: 1,
			name: 'Samsung SDS',
			logo: 'samsung_sds',
			link: 'http://www.samsungsdsa.com/cloud-infrastructure_kubernetes',
			blurb: 'Samsung SDS’s Cloud Native Computing Team offers expert consulting across the range of technical aspects involved in building services targeted at a Kubernetes cluster.'
		},
		{
			type: 1,
			name: 'Container Solutions',
			logo: 'container_solutions',
			link: 'http://container-solutions.com/resources/kubernetes/',
			blurb: 'Container Solutions is a premium software consultancy that focuses on programmable infrastructure, offering our expertise in software development, strategy and operations to help you innovate at speed and scale.'
		},
		{
			type: 1,
			name: 'Jetstack',
			logo: 'jetstack',
			link: 'https://www.jetstack.io/',
			blurb: 'Jetstack is an organisation focused entirely on Kubernetes. They will help you to get the most out of Kubernetes through expert professional services and open source tooling. Get in touch, and accelerate your project.'
		},
		{
			type: 0,
			name: 'Tigera',
			logo: 'tigera',
			link: 'http://docs.projectcalico.org/v1.5/getting-started/kubernetes/',
			blurb: 'Tigera builds high performance, policy driven, cloud native networking solutions for Kubernetes.'
		},
		{
			type: 1,
			name: 'Skippbox',
			logo: 'skippbox',
			link: 'http://www.skippbox.com/services/',
			blurb: 'Skippbox brings its Kubernetes expertise to help companies embrace Kubernetes on their way to digital transformation. Skippbox offers both professional services and expert training.'
		},
		{
 			type: 1,
 			name: 'Harbur',
 			logo: 'harbur',
 			link: 'https://harbur.io/',
 			blurb: 'Based in Barcelona, Harbur is a consulting firm that helps companies deploy self-healing solutions empowered by Container technologies'
  		},
		{
 			type: 1,
 			name: 'Endocode',
 			logo: 'endocode',
 			link: 'https://endocode.com/kubernetes/',
 			blurb: 'Endocode practices and teaches the open source way. Kernel to cluster - Dev to Ops. We offer Kubernetes trainings, services and support.'
  		},
		{
 			type: 0,
 			name: 'Spotinst',
 			logo: 'spotinst',
 			link: 'http://blog.spotinst.com/2016/08/04/elastigroup-kubernetes-minions-steroids/',
 			blurb: 'Spotinst uses a prediction algorithm in the Amazon EC2 Spot allowing k8s clusters to increase performance and lower the infrastructure costs'
  		},
		{
 			type: 1,
 			name: 'inwinSTACK',
 			logo: 'inwinstack',
 			link: 'http://www.inwinstack.com/index.php/en/solutions-en/',
 			blurb: 'Our container service leverages OpenStack-based infrastructure and its container orchestration engine Magnum to manage Kubernetes clusters.'
  		},
		{
 			type: 1,
 			name: 'Semantix',
 			logo: 'semantix',
 			link: 'http://www.semantix.com.br/',
 			blurb: 'Semantix is a company that works with data analytics and distributed systems. Kubernetes is used to orchestrate services for our customers.'
  		},
		{
 			type: 0,
 			name: 'ASM Technologies Limited',
 			logo: 'asm',
 			link: 'http://www.asmtech.com/',
 			blurb: 'Our technology supply chain portfolio enables your software products to be accessible, viable and available more effectively.'
  		},
		{
 			type: 1,
 			name: 'InfraCloud Technologies',
 			logo: 'infracloud',
 			link: 'http://blog.infracloud.io/state-of-kubernetes/',
 			blurb: 'InfraCloud Technologies is software consultancy which provides services in Containers, Cloud and DevOps.'
  		},
		{
 			type: 0,
 			name: 'SignalFx',
 			logo: 'signalfx',
 			link: 'https://github.com/signalfx/integrations/tree/master/kubernetes',
 			blurb: 'Gain real-time visibility across metrics & the most intelligent alerts for todays architectures, including deep integration with Kubernetes'
  		},
		{
 			type: 0,
 			name: 'NATS',
 			logo: 'nats',
 			link: 'https://github.com/pires/kubernetes-nats-cluster',
 			blurb: 'NATS is a simple, secure, and scalable cloud native messaging system.'
  		},
		{
 			type: 1,
 			name: 'RX-M',
 			logo: 'rxm',
 			link: 'http://rx-m.com/training/kubernetes-training/',
 			blurb: 'Market neutral Kubernetes Dev, DevOps and Production training and consulting services'
  		},
		{
 			type: 1,
 			name: 'Emerging Technology Advisors',
 			logo: 'eta',
 			link: 'https://www.emergingtechnologyadvisors.com/services/kubernetes.html',
 			blurb: 'ETA helps companies architect, implement, and manage scalable applications using Kubernetes on on public or private cloud.'
  		},
		{
 			type: 0,
 			name: 'CloudPlex.io',
 			logo: 'cloudplex',
 			link: 'http://www.cloudplex.io',
 			blurb: 'CloudPlex enables operations teams to visually deploy, orchestrate, manage, and monitor infrastructure, applications, and services in public or private cloud.'
  		},
		{
 			type: 1,
 			name: 'Kumina',
 			logo: 'kumina',
 			link: 'https://www.kumina.nl/managed_kubernetes',
 			blurb: 'Kumina creates Kubernetes solutions on your choice of infrastructure with around-the-clock management and unlimited support.'
  		},
		{
 			type: 0,
 			name: 'CA Technologies',
 			logo: 'ca',
 			link: 'https://www.ca.com/us/products/application-deployment.html',
 			blurb: 'The RA CDE Kubernetes plugin enables an automated process for pushing changes to production by applying standard Kubernetes YAML files'
  		},
		{
 			type: 0,
 			name: 'CoScale',
 			logo: 'coscale',
 			link: 'http://www.coscale.com/blog/how-to-monitor-your-kubernetes-cluster',
 			blurb: 'Full stack monitoring of containers and microservices orchestrated by Kubernetes. Powered by anomaly detection to find problems faster.'
  		},
		{
 			type: 0,
 			name: 'Supergiant.io',
 			logo: 'supergiant',
 			link: 'https://supergiant.io/blog/supergiant-packing-algorithm-unique-save-money',
 			blurb: 'Supergiant autoscales hardware for Kubernetes. Open-source, it makes HA, distributed, stateful apps easy to deploy, manage, and scale.'
  		},
		{
 			type: 0,
 			name: 'Avi Networks',
 			logo: 'avinetworks',
 			link: 'https://kb.avinetworks.com/avi-vantage-openshift-installation-guide/',
 			blurb: 'Avis elastic application services fabric provides scalable, feature rich & integrated L4-7 networking for K8S environments.'
  		},
		{
 			type: 1,
 			name: 'codecrux web technologies pvt ltd',
 			logo: 'codecrux',
 			link: 'http://codecrux.com/kubernetes/',
 			blurb: 'At CodeCrux we help your organization get the most out of Containers and Kubernetes, regardless of where you are in your journey'
  		},
		{
 			type: 0,
 			name: 'Greenqloud',
 			logo: 'qstack',
 			link: 'https://www.qstack.com/application-orchestration/',
 			blurb: 'Qstack provides self-serviceable on-site Kubernetes clusters with an intuitive User Interface for Infrastructure and Kubernetes management.'
  		},
		{
 			type: 1,
 			name: 'StackOVerdrive.io',
 			logo: 'stackoverdrive',
 			link: 'http://www.stackoverdrive.net/kubernetes-consulting/',
 			blurb: 'We are a devops consulting firm and we do alot of work with containers and Kunbernetes is one of our go to tools.'
  		},
		{
 			type: 0,
 			name: 'StackIQ, Inc.',
 			logo: 'stackiq',
 			link: 'https://www.stackiq.com/kubernetes/',
 			blurb: 'With Stacki and the Stacki Pallet for Kubernetes, you can go from bare metal to containers in one step very quickly and easily.'
  		},
		{
 			type: 0,
 			name: 'Cobe',
 			logo: 'cobe',
 			link: 'https://cobe.io/blog/posts/problems-within-your-kubernetes-cluster/',
 			blurb: 'Manage Kubernetes clusters with a live, searchable model that captures all relationships and performance data in full visualised context.'
  		},
		{
 			type: 0,
 			name: 'Datawire',
 			logo: 'datawire',
 			link: 'http://www.datawire.io',
 			blurb: 'Datawires open source tools let your microservices developers be awesomely productive on Kubernetes, while letting ops sleep at night.'
  		},
		{
 			type: 0,
 			name: 'Mashape, Inc.',
 			logo: 'mashape',
 			link: 'https://getkong.org/install/kubernetes/',
 			blurb: 'Kong is a scalable open source API layer that runs in front of any RESTful API and can be provisioned to a Kubernetes cluster.'
  		},
		{
 			type: 0,
 			name: 'F5 Networks',
 			logo: 'f5networks',
 			link: 'http://github.com/f5networks',
 			blurb: 'We have a LB integration into Kubernetes.'
  		},
		{
 			type: 1,
 			name: 'Lovable Tech',
 			logo: 'lovable',
 			link: 'http://lovable.tech/',
 			blurb: 'World class engineers, designers, and strategic consultants helping you ship Lovable web & mobile technology.'
  		},
		{
 			type: 0,
 			name: 'StackState',
 			logo: 'stackstate',
 			link: 'http://stackstate.com/platform/container-monitoring',
 			blurb: 'Operational Analytics across teams and tools. Includes topology visualization, root cause analysis and anomaly detection for Kubernetes.'
  		},
		{
 			type: 1,
 			name: 'INEXCCO INC',
 			logo: 'inexcco',
 			link: 'https://www.inexcco.com/',
 			blurb: 'Strong DevOps and Cloud talent working with couple clients on kubernetes and helm implementations. '
  		},
		{
 			type: 0,
 			name: 'Bitnami',
 			logo: 'bitnami',
 			link: 'http://bitnami.com/kubernetes',
 			blurb: 'Bitnami brings a catalog of trusted, up to date, and easy to use applications and application building blocks to Kubernetes.'
  		},
		{
 			type: 1,
 			name: 'Nebulaworks',
 			logo: 'nebulaworks',
 			link: 'http://www.nebulaworks.com/container-platforms',
 			blurb: 'Nebulaworks provides services to help the enterprise adopt modern container platforms and optimized processes to enable innovation at scale.'
  		},
		{
 			type: 1,
 			name: 'EASYNUBE LTD',
 			logo: 'easynube',
 			link: 'https://www.carrefour.es/supermercado/?ic_source=portal-home&ic_medium=menu-links&ic_content=section-home',
 			blurb: 'Provide consultancy, architecture and implementation'
  		},
		{
 			type: 1,
 			name: 'Opcito Technologies',
 			logo: 'opcito',
 			link: 'http://www.opcito.com/kubernetes/',
 			blurb: 'Opcito is a software consultancy that uses Kubernetes to help organisations build, architect & deploy highly scalable applications.'
  		},
		{
 			type: 0,
 			name: 'Huawei Technologies Co., Ltd.',
 			logo: 'huawei',
 			link: 'http://developer.huawei.com/ict/en/site-paas',
 			blurb: 'FusionStage is an enterprise-grade PaaS, the core of which is based on open source container technology including Kubernetes and Docker.'
  		},
		{
 			type: 0,
 			name: '{code} by Dell EMC',
 			logo: 'codedellemc',
 			link: 'https://blog.codedellemc.com',
 			blurb: 'Respected as a thought leader in storage persistence for containerized applications. Contributed significant work to K8 and Ecosystem'
  		}
		
	]

	var isvContainer = document.getElementById('isvContainer')
	var servContainer = document.getElementById('servContainer')

	var sorted = partners.sort(function (a, b) {
		if (a.name > b.name) return 1
		if (a.name < b.name) return -1
		return 0
	})

	sorted.forEach(function (obj) {
		var box = document.createElement('div')
		box.className = 'partner-box'

		var img = document.createElement('img')
		img.src = '/images/square-logos/' + obj.logo + '.png'

		var div = document.createElement('div')

		var p = document.createElement('p')
		p.textContent = obj.blurb

		var link = document.createElement('a')
		link.href = obj.link
		link.target = '_blank'
		link.textContent = 'Learn more'

		div.appendChild(p)
		div.appendChild(link)

		box.appendChild(img)
		box.appendChild(div)

		var container = obj.type ? servContainer : isvContainer
		container.appendChild(box)
	})
})();
