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

/*

package examples_test

import (
  "io/ioutil"
  "gopkg.in/yaml.v2"
  "path"
  "strings"
	"testing"
)


// Not unmarshaling short-description and long-description fields
// (for simplicity)
type GlossaryTerm struct {
  Id string          `yaml: "id"`
  Name string        `yaml: "name"`
  Aka []string       `yaml: "aka"`
  Related []string   `yaml: "related"`
  Tags []string      `yaml: "tags"`
}

// Not unmarshaling other fields (for simplicity)
type CanonicalTag struct {
  Id string          `yaml: "id"`
}

// Checks that all glossary files (../_data/glossary/*) contain valid tags
// that are present in the canonical set.
func TestCanonicalTags(t *testing.T) {
  canonicalTagsDir := "../data/canonical-tags"
  files, err := ioutil.ReadDir(canonicalTagsDir)
  if err != nil {
    t.Errorf("Unable to read directory %s: %v", canonicalTagsDir, err)
    return
  }

  canonicalTagsSet := make(map[string]bool)
  var tag CanonicalTag
  for _, f := range files {
    filePath := path.Join(canonicalTagsDir, f.Name())
    data, err := ioutil.ReadFile(filePath)
    if err != nil {
      t.Errorf("Unable to read file %s: %v", filePath, err)
      continue
    }
    err = yaml.Unmarshal(data, &tag)
    if err != nil {
      t.Errorf("Unable to unmarshal file %s: %v", filePath, err)
      continue
    }

    canonicalTagsSet[tag.Id] = true
  }

  glossaryDir := "../data/glossary"
  files, err = ioutil.ReadDir(glossaryDir)
  if err != nil {
    t.Errorf("Unable to read directory %s: %v", glossaryDir, err)
    return
  }

  for _, f := range files {
    var term GlossaryTerm
    // skip validation of example files
    if (strings.HasPrefix(f.Name(), "_")) {
      continue
    }

    filePath := path.Join(glossaryDir, f.Name())
    data, err := ioutil.ReadFile(filePath)
    if err != nil {
      t.Errorf("Unable to read file %s: %v", filePath, err)
      continue
    }
    err = yaml.Unmarshal(data, &term)
    if err != nil {
      t.Errorf("Unable to unmarshal file %s: %v", filePath, err)
      continue
    }

    if (len(term.Tags) == 0) {
      t.Errorf("Glossary term \"%s\" requires at least one tag. See %s for the list of valid tags.", term.Name, canonicalTagsDir)
    }
    for _, tag := range term.Tags {
      if _, present := canonicalTagsSet[tag]; !present {
        t.Errorf("Glossary term \"%s\" has invalid tag \"%s\". See %s for the list of valid tags.", term.Name, tag, canonicalTagsDir)
        continue
      }
    }
  }
}
*/
