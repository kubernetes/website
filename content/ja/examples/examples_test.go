/*
Copyright 2016 The Kubernetes Authors.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

package examples_test

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	"k8s.io/apimachinery/pkg/util/validation/field"
	"k8s.io/apimachinery/pkg/util/yaml"
	utilfeature "k8s.io/apiserver/pkg/util/feature"
	"k8s.io/kubernetes/pkg/api/legacyscheme"
	"k8s.io/kubernetes/pkg/api/testapi"
	"k8s.io/kubernetes/pkg/apis/admissionregistration"
	ar_validation "k8s.io/kubernetes/pkg/apis/admissionregistration/validation"
	"k8s.io/kubernetes/pkg/apis/apps"
	apps_validation "k8s.io/kubernetes/pkg/apis/apps/validation"
	"k8s.io/kubernetes/pkg/apis/autoscaling"
	autoscaling_validation "k8s.io/kubernetes/pkg/apis/autoscaling/validation"
	"k8s.io/kubernetes/pkg/apis/batch"
	batch_validation "k8s.io/kubernetes/pkg/apis/batch/validation"
	api "k8s.io/kubernetes/pkg/apis/core"
	"k8s.io/kubernetes/pkg/apis/core/validation"
	"k8s.io/kubernetes/pkg/apis/extensions"
	ext_validation "k8s.io/kubernetes/pkg/apis/extensions/validation"
	"k8s.io/kubernetes/pkg/apis/policy"
	policy_validation "k8s.io/kubernetes/pkg/apis/policy/validation"
	"k8s.io/kubernetes/pkg/apis/rbac"
	rbac_validation "k8s.io/kubernetes/pkg/apis/rbac/validation"
	"k8s.io/kubernetes/pkg/apis/settings"
	settings_validation "k8s.io/kubernetes/pkg/apis/settings/validation"
	"k8s.io/kubernetes/pkg/apis/storage"
	storage_validation "k8s.io/kubernetes/pkg/apis/storage/validation"
	"k8s.io/kubernetes/pkg/capabilities"
	"k8s.io/kubernetes/pkg/registry/batch/job"
)

func getCodecForObject(obj runtime.Object) (runtime.Codec, error) {
	kinds, _, err := legacyscheme.Scheme.ObjectKinds(obj)
	if err != nil {
		return nil, fmt.Errorf("unexpected encoding error: %v", err)
	}
	kind := kinds[0]

	for _, group := range testapi.Groups {
		if group.GroupVersion().Group != kind.Group {
			continue
		}

		if legacyscheme.Scheme.Recognizes(kind) {
			return group.Codec(), nil
		}
	}
	// Codec used for unversioned types
	if legacyscheme.Scheme.Recognizes(kind) {
		serializer, ok := runtime.SerializerInfoForMediaType(legacyscheme.Codecs.SupportedMediaTypes(), runtime.ContentTypeJSON)
		if !ok {
			return nil, fmt.Errorf("no serializer registered for json")
		}
		return serializer.Serializer, nil
	}
	return nil, fmt.Errorf("unexpected kind: %v", kind)
}

func validateObject(obj runtime.Object) (errors field.ErrorList) {
	// Enable CustomPodDNS for testing
	utilfeature.DefaultFeatureGate.Set("CustomPodDNS=true")
	switch t := obj.(type) {
	case *api.ConfigMap:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateConfigMap(t)
	case *api.Endpoints:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateEndpoints(t)
	case *api.LimitRange:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateLimitRange(t)
	case *api.Namespace:
		errors = validation.ValidateNamespace(t)
	case *api.PersistentVolume:
		errors = validation.ValidatePersistentVolume(t)
	case *api.PersistentVolumeClaim:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePersistentVolumeClaim(t)
	case *api.Pod:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePod(t)
	case *api.PodList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.PodTemplate:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePodTemplate(t)
	case *api.ReplicationController:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateReplicationController(t)
	case *api.ReplicationControllerList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.ResourceQuota:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateResourceQuota(t)
	case *api.Secret:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateSecret(t)
	case *api.Service:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateService(t)
	case *api.ServiceAccount:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateServiceAccount(t)
	case *api.ServiceList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *apps.StatefulSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = apps_validation.ValidateStatefulSet(t)
	case *autoscaling.HorizontalPodAutoscaler:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = autoscaling_validation.ValidateHorizontalPodAutoscaler(t)
	case *batch.Job:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		// Job needs generateSelector called before validation, and job.Validate does this.
		// See: https://github.com/kubernetes/kubernetes/issues/20951#issuecomment-187787040
		t.ObjectMeta.UID = types.UID("fakeuid")
		if strings.Index(t.ObjectMeta.Name, "$") > -1 {
			t.ObjectMeta.Name = "skip-for-good"
		}
		errors = job.Strategy.Validate(nil, t)
	case *extensions.DaemonSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = ext_validation.ValidateDaemonSet(t)
	case *extensions.Deployment:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = ext_validation.ValidateDeployment(t)
	case *extensions.Ingress:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = ext_validation.ValidateIngress(t)
	case *policy.PodSecurityPolicy:
		errors = policy_validation.ValidatePodSecurityPolicy(t)
	case *extensions.ReplicaSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = ext_validation.ValidateReplicaSet(t)
	case *batch.CronJob:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = batch_validation.ValidateCronJob(t)
	case *policy.PodDisruptionBudget:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = policy_validation.ValidatePodDisruptionBudget(t)
	case *rbac.ClusterRoleBinding:
		// clusterolebinding does not accept namespace
		errors = rbac_validation.ValidateClusterRoleBinding(t)
	case *settings.PodPreset:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = settings_validation.ValidatePodPreset(t)
	case *storage.StorageClass:
		// storageclass does not accept namespace
		errors = storage_validation.ValidateStorageClass(t)
	default:
		errors = field.ErrorList{}
		errors = append(errors, field.InternalError(field.NewPath(""), fmt.Errorf("no validation defined for %#v", obj)))
	}
	return errors
}

// Walks inDir for any json/yaml files. Converts yaml to json, and calls fn for
// each file found with the contents in data.
func walkConfigFiles(inDir string, t *testing.T, fn func(name, path string, data [][]byte)) error {
	return filepath.Walk(inDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() && path != inDir {
			return filepath.SkipDir
		}

		file := filepath.Base(path)
		if ext := filepath.Ext(file); ext == ".json" || ext == ".yaml" {
			data, err := ioutil.ReadFile(path)
			if err != nil {
				return err
			}
			// workaround for Jekyllr limit
			if bytes.HasPrefix(data, []byte("---\n")) {
				return fmt.Errorf("YAML file cannot start with \"---\", please remove the first line")
			}
			name := strings.TrimSuffix(file, ext)

			var docs [][]byte
			if ext == ".yaml" {
				// YAML can contain multiple documents.
				splitter := yaml.NewYAMLReader(bufio.NewReader(bytes.NewBuffer(data)))
				for {
					doc, err := splitter.Read()
					if err == io.EOF {
						break
					}
					if err != nil {
						return fmt.Errorf("%s: %v", path, err)
					}
					out, err := yaml.ToJSON(doc)
					if err != nil {
						return fmt.Errorf("%s: %v", path, err)
					}
					// deal with "empty" document (e.g. pure comments)
					if string(out) != "null" {
						docs = append(docs, out)
					}
				}
			} else {
				docs = append(docs, data)
			}

			t.Logf("Checking file %s\n", name)
			fn(name, path, docs)
		}
		return nil
	})
}

func TestExampleObjectSchemas(t *testing.T) {
	// Please help maintain the alphabeta order in the map
	cases := map[string]map[string][]runtime.Object{
		"admin": {
			"namespace-dev":  {&api.Namespace{}},
			"namespace-prod": {&api.Namespace{}},
		},
		"admin/cloud": {
			"ccm-example":            {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &extensions.DaemonSet{}},
		},
		"admin/dns": {
			"busybox":                   {&api.Pod{}},
			"dns-horizontal-autoscaler": {&extensions.Deployment{}},
		},
		"admin/logging": {
			"fluentd-sidecar-config":                  {&api.ConfigMap{}},
			"two-files-counter-pod":                   {&api.Pod{}},
			"two-files-counter-pod-agent-sidecar":     {&api.Pod{}},
			"two-files-counter-pod-streaming-sidecar": {&api.Pod{}},
		},
		"admin/resource": {
			"cpu-constraints":          {&api.LimitRange{}},
			"cpu-constraints-pod":      {&api.Pod{}},
			"cpu-constraints-pod-2":    {&api.Pod{}},
			"cpu-constraints-pod-3":    {&api.Pod{}},
			"cpu-constraints-pod-4":    {&api.Pod{}},
			"cpu-defaults":             {&api.LimitRange{}},
			"cpu-defaults-pod":         {&api.Pod{}},
			"cpu-defaults-pod-2":       {&api.Pod{}},
			"cpu-defaults-pod-3":       {&api.Pod{}},
			"memory-constraints":       {&api.LimitRange{}},
			"memory-constraints-pod":   {&api.Pod{}},
			"memory-constraints-pod-2": {&api.Pod{}},
			"memory-constraints-pod-3": {&api.Pod{}},
			"memory-constraints-pod-4": {&api.Pod{}},
			"memory-defaults":          {&api.LimitRange{}},
			"memory-defaults-pod":      {&api.Pod{}},
			"memory-defaults-pod-2":    {&api.Pod{}},
			"memory-defaults-pod-3":    {&api.Pod{}},
			"quota-mem-cpu":            {&api.ResourceQuota{}},
			"quota-mem-cpu-pod":        {&api.Pod{}},
			"quota-mem-cpu-pod-2":      {&api.Pod{}},
			"quota-objects":            {&api.ResourceQuota{}},
			"quota-objects-pvc":        {&api.PersistentVolumeClaim{}},
			"quota-objects-pvc-2":      {&api.PersistentVolumeClaim{}},
			"quota-pod":                {&api.ResourceQuota{}},
			"quota-pod-deployment":     {&extensions.Deployment{}},
		},
		"admin/sched": {
			"my-scheduler": {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &extensions.Deployment{}},
			"pod1":         {&api.Pod{}},
			"pod2":         {&api.Pod{}},
			"pod3":         {&api.Pod{}},
		},
		"application": {
			"deployment":         {&extensions.Deployment{}},
			"deployment-patch":   {&extensions.Deployment{}},
			"deployment-scale":   {&extensions.Deployment{}},
			"deployment-update":  {&extensions.Deployment{}},
			"nginx-app":          {&api.Service{}, &extensions.Deployment{}},
			"nginx-with-request": {&extensions.Deployment{}},
			"shell-demo":         {&api.Pod{}},
			"simple_deployment":  {&extensions.Deployment{}},
			"update_deployment":  {&extensions.Deployment{}},
		},
		"application/cassandra": {
			"cassandra-service":     {&api.Service{}},
			"cassandra-statefulset": {&apps.StatefulSet{}, &storage.StorageClass{}},
		},
		"application/guestbook": {
			"frontend-deployment":     {&extensions.Deployment{}},
			"frontend-service":        {&api.Service{}},
			"redis-master-deployment": {&extensions.Deployment{}},
			"redis-master-service":    {&api.Service{}},
			"redis-slave-deployment":  {&extensions.Deployment{}},
			"redis-slave-service":     {&api.Service{}},
		},
		"application/hpa": {
			"php-apache": {&autoscaling.HorizontalPodAutoscaler{}},
		},
		"application/nginx": {
			"nginx-deployment": {&extensions.Deployment{}},
			"nginx-svc":        {&api.Service{}},
		},
		"application/job": {
			"cronjob":  {&batch.CronJob{}},
			"job-tmpl": {&batch.Job{}},
		},
		"application/job/rabbitmq": {
			"job": {&batch.Job{}},
		},
		"application/job/redis": {
			"job":           {&batch.Job{}},
			"redis-pod":     {&api.Pod{}},
			"redis-service": {&api.Service{}},
		},
		"application/mysql": {
			"mysql-configmap":   {&api.ConfigMap{}},
			"mysql-deployment":  {&api.Service{}, &extensions.Deployment{}},
			"mysql-pv":          {&api.PersistentVolume{}, &api.PersistentVolumeClaim{}},
			"mysql-services":    {&api.Service{}, &api.Service{}},
			"mysql-statefulset": {&apps.StatefulSet{}},
		},
		"application/web": {
			"web":          {&api.Service{}, &apps.StatefulSet{}},
			"web-parallel": {&api.Service{}, &apps.StatefulSet{}},
		},
		"application/wordpress": {
			"mysql-deployment":     {&api.Service{}, &api.PersistentVolumeClaim{}, &extensions.Deployment{}},
			"wordpress-deployment": {&api.Service{}, &api.PersistentVolumeClaim{}, &extensions.Deployment{}},
		},
		"application/zookeeper": {
			"zookeeper": {&api.Service{}, &api.Service{}, &policy.PodDisruptionBudget{}, &apps.StatefulSet{}},
		},
		"controllers": {
			"daemonset":        {&extensions.DaemonSet{}},
			"frontend":         {&extensions.ReplicaSet{}},
			"hpa-rs":           {&autoscaling.HorizontalPodAutoscaler{}},
			"job":              {&batch.Job{}},
			"replicaset":       {&extensions.ReplicaSet{}},
			"replication":      {&api.ReplicationController{}},
			"nginx-deployment": {&extensions.Deployment{}},
		},
		"debug": {
			"counter-pod":                     {&api.Pod{}},
			"event-exporter":                  {&api.ServiceAccount{}, &rbac.ClusterRoleBinding{}, &extensions.Deployment{}},
			"fluentd-gcp-configmap":           {&api.ConfigMap{}},
			"fluentd-gcp-ds":                  {&extensions.DaemonSet{}},
			"node-problem-detector":           {&extensions.DaemonSet{}},
			"node-problem-detector-configmap": {&extensions.DaemonSet{}},
			"termination":                     {&api.Pod{}},
		},
		"federation": {
			"policy-engine-deployment":    {&extensions.Deployment{}},
			"policy-engine-service":       {&api.Service{}},
			"replicaset-example-policy":   {&extensions.ReplicaSet{}},
			"scheduling-policy-admission": {&api.ConfigMap{}},
		},
		"podpreset": {
			"allow-db":          {&settings.PodPreset{}},
			"allow-db-merged":   {&api.Pod{}},
			"configmap":         {&api.ConfigMap{}},
			"conflict-pod":      {&api.Pod{}},
			"conflict-preset":   {&settings.PodPreset{}},
			"merged":            {&api.Pod{}},
			"multi-merged":      {&api.Pod{}},
			"pod":               {&api.Pod{}},
			"preset":            {&settings.PodPreset{}},
			"proxy":             {&settings.PodPreset{}},
			"replicaset-merged": {&api.Pod{}},
			"replicaset":        {&extensions.ReplicaSet{}},
		},
		"pods": {
			"commands":                {&api.Pod{}},
			"init-containers":         {&api.Pod{}},
			"lifecycle-events":        {&api.Pod{}},
			"pod-nginx":               {&api.Pod{}},
			"pod-with-node-affinity":  {&api.Pod{}},
			"pod-with-pod-affinity":   {&api.Pod{}},
			"private-reg-pod":         {&api.Pod{}},
			"share-process-namespace": {&api.Pod{}},
			"simple-pod":              {&api.Pod{}},
			"two-container-pod":       {&api.Pod{}},
		},
		"pods/config": {
			"redis-pod": {&api.Pod{}},
		},
		"pods/inject": {
			"dapi-envars-container": {&api.Pod{}},
			"dapi-envars-pod":       {&api.Pod{}},
			"dapi-volume":           {&api.Pod{}},
			"dapi-volume-resources": {&api.Pod{}},
			"envars":                {&api.Pod{}},
			"secret":                {&api.Secret{}},
			"secret-envars-pod":     {&api.Pod{}},
			"secret-pod":            {&api.Pod{}},
		},
		"pods/probe": {
			"exec-liveness":                   {&api.Pod{}},
			"http-liveness":                   {&api.Pod{}},
			"pod-with-http-healthcheck":       {&api.Pod{}},
			"pod-with-tcp-socket-healthcheck": {&api.Pod{}},
			"tcp-liveness-readiness":          {&api.Pod{}},
		},
		"pods/qos": {
			"qos-pod":   {&api.Pod{}},
			"qos-pod-2": {&api.Pod{}},
			"qos-pod-3": {&api.Pod{}},
			"qos-pod-4": {&api.Pod{}},
		},
		"pods/resource": {
			"cpu-request-limit":       {&api.Pod{}},
			"cpu-request-limit-2":     {&api.Pod{}},
			"extended-resource-pod":   {&api.Pod{}},
			"extended-resource-pod-2": {&api.Pod{}},
			"memory-request-limit":    {&api.Pod{}},
			"memory-request-limit-2":  {&api.Pod{}},
			"memory-request-limit-3":  {&api.Pod{}},
		},
		"pods/security": {
			"hello-apparmor":     {&api.Pod{}},
			"security-context":   {&api.Pod{}},
			"security-context-2": {&api.Pod{}},
			"security-context-3": {&api.Pod{}},
			"security-context-4": {&api.Pod{}},
		},
		"pods/storage": {
			"projected": {&api.Pod{}},
			"pv-claim":  {&api.PersistentVolumeClaim{}},
			"pv-pod":    {&api.Pod{}},
			"pv-volume": {&api.PersistentVolume{}},
			"redis":     {&api.Pod{}},
		},
		"policy": {
			"privileged-psp": {&policy.PodSecurityPolicy{}},
			"restricted-psp": {&policy.PodSecurityPolicy{}},
			"example-psp":    {&policy.PodSecurityPolicy{}},
		},
		"service": {
			"nginx-service": {&api.Service{}},
		},
		"service/access": {
			"frontend":      {&api.Service{}, &extensions.Deployment{}},
			"hello-service": {&api.Service{}},
			"hello":         {&extensions.Deployment{}},
		},
		"service/networking": {
			"curlpod":          {&extensions.Deployment{}},
			"custom-dns":       {&api.Pod{}},
			"hostaliases-pod":  {&api.Pod{}},
			"ingress":          {&extensions.Ingress{}},
			"nginx-secure-app": {&api.Service{}, &extensions.Deployment{}},
			"nginx-svc":        {&api.Service{}},
			"run-my-nginx":     {&extensions.Deployment{}},
		},
		"windows": {
			"configmap-pod":       {&api.ConfigMap{}, &api.Pod{}},
			"daemonset":           {&extensions.DaemonSet{}},
			"deploy-hyperv":       {&extensions.Deployment{}},
			"deploy-resource":     {&extensions.Deployment{}},
			"emptydir-pod":        {&api.Pod{}},
			"hostpath-volume-pod": {&api.Pod{}},
			"secret-pod":          {&api.Secret{}, &api.Pod{}},
			"simple-pod":          {&api.Pod{}},
		},
	}

	// Note a key in the following map has to be complete relative path
	filesIgnore := map[string]map[string]bool{
		"audit": {
			"audit-policy": true,
		},
	}
	capabilities.SetForTests(capabilities.Capabilities{
		AllowPrivileged: true,
	})

	for dir, expected := range cases {
		tested := 0
		numExpected := 0
		path := dir
		// Test if artifacts do exist
		for name := range expected {
			fn := path + "/" + name
			_, err1 := os.Stat(fn + ".yaml")
			_, err2 := os.Stat(fn + ".json")
			if err1 != nil && err2 != nil {
				t.Errorf("Test case defined for non-existent file %s", fn)
			}
		}
		t.Logf("Checking path %s/\n", path)
		err := walkConfigFiles(path, t, func(name, path string, docs [][]byte) {
			expectedTypes, found := expected[name]
			if !found {
				p := filepath.Dir(path)
				if files, ok := filesIgnore[p]; ok {
					if files[name] {
						return
					}
				}
				t.Errorf("%s: %s does not have a test case defined", path, name)
				return
			}
			numExpected += len(expectedTypes)
			if len(expectedTypes) != len(docs) {
				t.Errorf("%s: number of expected types (%v) doesn't match number of docs in YAML (%v)", path, len(expectedTypes), len(docs))
				return
			}
			for i, data := range docs {
				expectedType := expectedTypes[i]
				tested++
				if expectedType == nil {
					t.Logf("skipping : %s/%s\n", path, name)
					return
				}

				codec, err := getCodecForObject(expectedType)
				if err != nil {
					t.Errorf("Could not get codec for %s: %s", expectedType, err)
				}
				if err := runtime.DecodeInto(codec, data, expectedType); err != nil {
					t.Errorf("%s did not decode correctly: %v\n%s", path, err, string(data))
					return
				}
				if errors := validateObject(expectedType); len(errors) > 0 {
					t.Errorf("%s did not validate correctly: %v", path, errors)
				}
			}
		})
		if err != nil {
			t.Errorf("Expected no error, Got %v on Path %v", err, path)
		}
		if tested != numExpected {
			t.Errorf("Directory %v: Expected %d examples, Got %d", path, len(expected), tested)
		}
	}
}
