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
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"testing"

	"k8s.io/kubernetes/pkg/api"
	"k8s.io/kubernetes/pkg/api/testapi"
	"k8s.io/kubernetes/pkg/api/validation"
	"k8s.io/kubernetes/pkg/apis/batch"
	"k8s.io/kubernetes/pkg/apis/extensions"
	expvalidation "k8s.io/kubernetes/pkg/apis/extensions/validation"
	"k8s.io/kubernetes/pkg/capabilities"
	"k8s.io/kubernetes/pkg/registry/job"
	"k8s.io/kubernetes/pkg/runtime"
	"k8s.io/kubernetes/pkg/types"
	"k8s.io/kubernetes/pkg/util/validation/field"
	"k8s.io/kubernetes/pkg/util/yaml"
	schedulerapilatest "k8s.io/kubernetes/plugin/pkg/scheduler/api/latest"
)

func validateObject(obj runtime.Object) (errors field.ErrorList) {
	switch t := obj.(type) {
	case *api.ReplicationController:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateReplicationController(t)
	case *api.ReplicationControllerList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.Service:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateService(t)
	case *api.ServiceList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.Pod:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePod(t)
	case *api.PodList:
		for i := range t.Items {
			errors = append(errors, validateObject(&t.Items[i])...)
		}
	case *api.PersistentVolume:
		errors = validation.ValidatePersistentVolume(t)
	case *api.PersistentVolumeClaim:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePersistentVolumeClaim(t)
	case *api.PodTemplate:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidatePodTemplate(t)
	case *api.Endpoints:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateEndpoints(t)
	case *api.Namespace:
		errors = validation.ValidateNamespace(t)
	case *api.Secret:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateSecret(t)
	case *api.LimitRange:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateLimitRange(t)
	case *api.ResourceQuota:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = validation.ValidateResourceQuota(t)
	case *extensions.Deployment:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = expvalidation.ValidateDeployment(t)
	case *batch.Job:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		// Job needs generateSelector called before validation, and job.Validate does this.
		// See: https://github.com/kubernetes/kubernetes/issues/20951#issuecomment-187787040
		t.ObjectMeta.UID = types.UID("fakeuid")
		errors = job.Strategy.Validate(nil, t)
	case *extensions.Ingress:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = expvalidation.ValidateIngress(t)
	case *extensions.DaemonSet:
		if t.Namespace == "" {
			t.Namespace = api.NamespaceDefault
		}
		errors = expvalidation.ValidateDaemonSet(t)
	default:
		errors = field.ErrorList{}
		errors = append(errors, field.InternalError(field.NewPath(""), fmt.Errorf("no validation defined for %#v", obj)))
	}
	return errors
}

// Walks inDir for any json/yaml files. Converts yaml to json, and calls fn for
// each file found with the contents in data.
func walkConfigFiles(inDir string, fn func(name, path string, data []byte)) error {
	return filepath.Walk(inDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() && path != inDir {
			return filepath.SkipDir
		}

		file := filepath.Base(path)
		if ext := filepath.Ext(file); ext == ".json" || ext == ".yaml" {
			//glog.Infof("Testing %s", path)
			data, err := ioutil.ReadFile(path)
			if err != nil {
				return err
			}
			name := strings.TrimSuffix(file, ext)

			if ext == ".yaml" {
				out, err := yaml.ToJSON(data)
				if err != nil {
					return fmt.Errorf("%s: %v", path, err)
				}
				data = out
			}

			fn(name, path, data)
		}
		return nil
	})
}

func TestExampleObjectSchemas(t *testing.T) {
	cases := map[string]map[string]runtime.Object{
		"../docs/user-guide/walkthrough": {
			"deployment":                &extensions.Deployment{},
			"deployment-update":         &extensions.Deployment{},
			"pod-nginx":                 &api.Pod{},
			"pod-nginx-with-label":      &api.Pod{},
			"pod-redis":                 &api.Pod{},
			"pod-with-http-healthcheck": &api.Pod{},
			"podtemplate":               &api.PodTemplate{},
			"service":                   &api.Service{},
		},
		"../docs/user-guide/update-demo": {
			"kitten-rc":   &api.ReplicationController{},
			"nautilus-rc": &api.ReplicationController{},
		},
		"../docs/user-guide/persistent-volumes/volumes": {
			"local-01": &api.PersistentVolume{},
			"local-02": &api.PersistentVolume{},
			"gce":      &api.PersistentVolume{},
			"nfs":      &api.PersistentVolume{},
		},
		"../docs/user-guide/persistent-volumes/claims": {
			"claim-01": &api.PersistentVolumeClaim{},
			"claim-02": &api.PersistentVolumeClaim{},
			"claim-03": &api.PersistentVolumeClaim{},
		},
		"../docs/user-guide/persistent-volumes/simpletest": {
			"namespace": &api.Namespace{},
			"pod":       &api.Pod{},
			"service":   &api.Service{},
		},
		"../docs/user-guide/liveness": {
			"exec-liveness":            &api.Pod{},
			"http-liveness":            &api.Pod{},
			"http-liveness-named-port": &api.Pod{},
		},
		"../docs/user-guide/jobs/work-queue-1": {
			"job": &batch.Job{},
		},
		"../docs/user-guide/jobs/work-queue-2": {
			"job":           &batch.Job{},
			"redis-pod":     &api.Pod{},
			"redis-service": &api.Service{},
		},
		"../docs/user-guide": {
			"bad-nginx-deployment":       &extensions.Deployment{},
			"counter-pod":                &api.Pod{},
			"curlpod":                    &extensions.Deployment{},
			"deployment":                 &extensions.Deployment{},
			"ingress":                    &extensions.Ingress{},
			"job":                        &batch.Job{},
			"multi-pod":                  &api.Pod{},
			"new-nginx-deployment":       &extensions.Deployment{},
			"nginx-app":                  &api.Service{},
			"nginx-deployment":           &extensions.Deployment{},
			"nginx-init-containers":      &api.Pod{},
			"nginx-lifecycle-deployment": &extensions.Deployment{},
			"nginx-probe-deployment":     &extensions.Deployment{},
			"nginx-secure-app":           &api.Service{},
			"nginx-svc":                  &api.Service{},
			"petset":                     &api.Service{},
			"pod":                        &api.Pod{},
			"pod-w-message":              &api.Pod{},
			"redis-deployment":           &extensions.Deployment{},
			"redis-resource-deployment":  &extensions.Deployment{},
			"redis-secret-deployment":    &extensions.Deployment{},
			"run-my-nginx":               &extensions.Deployment{},
		},
		"../docs/admin": {
			"daemon": &extensions.DaemonSet{},
		},
		"../docs/user-guide/downward-api": {
			"dapi-pod":                 &api.Pod{},
			"dapi-container-resources": &api.Pod{},
		},
		"../docs/user-guide/downward-api/volume/": {
			"dapi-volume":           &api.Pod{},
			"dapi-volume-resources": &api.Pod{},
		},
		"../docs/admin/namespaces": {
			"namespace-dev":  &api.Namespace{},
			"namespace-prod": &api.Namespace{},
		},
		"../docs/admin/limitrange": {
			"invalid-pod": &api.Pod{},
			"limits":      &api.LimitRange{},
			"namespace":   &api.Namespace{},
			"valid-pod":   &api.Pod{},
		},
		"../docs/user-guide/logging-demo": {
			"synthetic_0_25lps": &api.Pod{},
			"synthetic_10lps":   &api.Pod{},
		},
		"../docs/user-guide/node-selection": {
			"pod": &api.Pod{},
			"pod-with-node-affinity": &api.Pod{},
		},
		"../docs/admin/resourcequota": {
			"best-effort":       &api.ResourceQuota{},
			"compute-resources": &api.ResourceQuota{},
			"limits":            &api.LimitRange{},
			"namespace":         &api.Namespace{},
			"not-best-effort":   &api.ResourceQuota{},
			"object-counts":     &api.ResourceQuota{},
		},
		"../docs/user-guide/secrets": {
			"secret-pod":     &api.Pod{},
			"secret":         &api.Secret{},
			"secret-env-pod": &api.Pod{},
		},
	}

	capabilities.SetForTests(capabilities.Capabilities{
		AllowPrivileged: true,
	})

	for path, expected := range cases {
		tested := 0
		err := walkConfigFiles(path, func(name, path string, data []byte) {
			expectedType, found := expected[name]
			if !found {
				t.Errorf("%s: %s does not have a test case defined", path, name)
				return
			}
			tested++
			if expectedType == nil {
				t.Logf("skipping : %s/%s\n", path, name)
				return
			}
			if strings.Contains(name, "scheduler-policy-config") {
				if err := runtime.DecodeInto(schedulerapilatest.Codec, data, expectedType); err != nil {
					t.Errorf("%s did not decode correctly: %v\n%s", path, err, string(data))
					return
				}
				// TODO: Add validate method for
				// &schedulerapi.Policy, and remove this
				// special case
			} else {
				codec, err := testapi.GetCodecForObject(expectedType)
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
		if tested != len(expected) {
			t.Errorf("Directory %v: Expected %d examples, Got %d", path, len(expected), tested)
		}
	}
}

// This regex is tricky, but it works.  For future me, here is the decode:
//
// Flags: (?ms) = multiline match, allow . to match \n
// 1) Look for a line that starts with ``` (a markdown code block)
// 2) (?: ... ) = non-capturing group
// 3) (P<name>) = capture group as "name"
// 4) Look for #1 followed by either:
// 4a)    "yaml" followed by any word-characters followed by a newline (e.g. ```yamlfoo\n)
// 4b)    "any word-characters followed by a newline (e.g. ```json\n)
// 5) Look for either:
// 5a)    #4a followed by one or more characters (non-greedy)
// 5b)    #4b followed by { followed by one or more characters (non-greedy) followed by }
// 6) Look for #5 followed by a newline followed by ``` (end of the code block)
//
// This could probably be simplified, but is already too delicate.  Before any
// real changes, we should have a testscase that just tests this regex.
var sampleRegexp = regexp.MustCompile("(?ms)^```(?:(?P<type>yaml)\\w*\\n(?P<content>.+?)|\\w*\\n(?P<content>\\{.+?\\}))\\n^```")
var subsetRegexp = regexp.MustCompile("(?ms)\\.{3}")

func TestReadme(t *testing.T) {
	paths := []struct {
		file         string
		expectedType []runtime.Object
	}{
		{"../docs/user-guide/volumes.md", []runtime.Object{&api.Pod{}}},
	}

	for _, path := range paths {
		data, err := ioutil.ReadFile(path.file)
		if err != nil {
			t.Errorf("Unable to read file %s: %v", path, err)
			continue
		}

		matches := sampleRegexp.FindAllStringSubmatch(string(data), -1)
		if matches == nil {
			continue
		}
		ix := 0
		for _, match := range matches {
			var content, subtype string
			for i, name := range sampleRegexp.SubexpNames() {
				if name == "type" {
					subtype = match[i]
				}
				if name == "content" && match[i] != "" {
					content = match[i]
				}
			}
			if subtype == "yaml" && subsetRegexp.FindString(content) != "" {
				t.Logf("skipping (%s): \n%s", subtype, content)
				continue
			}

			var expectedType runtime.Object
			if len(path.expectedType) == 1 {
				expectedType = path.expectedType[0]
			} else {
				expectedType = path.expectedType[ix]
				ix++
			}
			json, err := yaml.ToJSON([]byte(content))
			if err != nil {
				t.Errorf("%s could not be converted to JSON: %v\n%s", path, err, string(content))
			}
			if err := runtime.DecodeInto(testapi.Default.Codec(), json, expectedType); err != nil {
				t.Errorf("%s did not decode correctly: %v\n%s", path, err, string(content))
				continue
			}
			if errors := validateObject(expectedType); len(errors) > 0 {
				t.Errorf("%s did not validate correctly: %v", path, errors)
			}
			_, err = runtime.Encode(testapi.Default.Codec(), expectedType)
			if err != nil {
				t.Errorf("Could not encode object: %v", err)
				continue
			}
		}
	}
}
