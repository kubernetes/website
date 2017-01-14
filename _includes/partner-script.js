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
			link: 'http://wercker.com/workflows/partners/kubernetes/',
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
			link: 'http://wercker.com/workflows/partners/kubernetes/',
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
