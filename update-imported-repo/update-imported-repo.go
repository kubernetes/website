package main

import (
  "fmt"
  "io"
  "io/ioutil"
  "os"
  "os/exec"
  "path"
  "path/filepath"
  "regexp"

  "github.com/ghodss/yaml"
)

func main() {

  args := os.Args[1:]

  websiteRepo, err := os.Getwd()
  checkError(err)

  content, err := ioutil.ReadFile(args[0])
  if err != nil {
    fmt.Fprintf(os.Stderr, "error when reading file: %v\n", err)
    os.Exit(1)
  }

  var config map[string]interface{}
  err = yaml.Unmarshal(content, &config)
  if err != nil {
    fmt.Fprintf(os.Stderr, "error when unmarshal the config file: %v\n", err)
    os.Exit(1)
  }

  tmpDir := "/tmp/update_docs"
  os.RemoveAll(tmpDir)
  os.Mkdir(tmpDir, 0750)

  // Match the content between 2 `---`
  // It mostly have something like:
  // ---
  // title: ***
  // notile: ***
  // ---
  titleRegex := regexp.MustCompile("^---\n(.*\n)*---\n")

  repos := config["repos"].([]interface{})
  for _, repo := range repos {
    err = os.Chdir(tmpDir)
    checkError(err)

    r := repo.(map[string]interface{})
    repoName := r["name"].(string)
    cmd := "git"
    args := []string{"clone", "--depth=1", "-b", r["branch"].(string), r["remote"].(string), repoName}
    fmt.Fprintf(os.Stdout, "Cloning repo %q\n", repoName)
    if err := exec.Command(cmd, args...).Run(); err != nil {
      fmt.Fprintf(os.Stderr, "error when cloning repo %q: %v\n", repoName, err)
      os.Exit(1)
    }

    err = os.Chdir(repoName)
    checkError(err)

// Sites w/ static content won't need to generate docs
//
//    fmt.Fprintf(os.Stdout, "Generating docs for repo %q\n", repoName)
//    if err := exec.Command("hack/generate-docs.sh").Run(); err != nil {
//      fmt.Fprintf(os.Stderr, "error when generating docs for repo %q: %v\n", repoName, err)
//      os.Exit(1)
//    }

    err = os.Chdir(websiteRepo)
    checkError(err)
    files := r["files"].([]interface{})
    for _, file := range files {
      f := file.(map[string]interface{})
      src := f["src"].(string)
      dst := f["dst"].(string)
      absSrc, err := filepath.Abs(path.Join(tmpDir, repoName, src))
      checkError(err)
      absDst, err := filepath.Abs(dst)
      checkError(err)
      // Ignore the error if the old file is not found/
      content, _ := ioutil.ReadFile(absDst)
      titleBlock := titleRegex.Find(content)
      content, err = ioutil.ReadFile(absSrc)
      checkError(err)
      dstFile, err := os.OpenFile(absDst, os.O_RDWR|os.O_CREATE, 0755)
      checkError(err)
      defer dstFile.Close()
      _, err = dstFile.Write(titleBlock)
      checkError(err)
      _, err = dstFile.Write(content)
      checkError(err)
      dstFile.Sync()
    }
  }
  fmt.Fprintf(os.Stdout, "Docs imported! Run 'git add .' 'git commit -m <comment>' and 'git push' to upload them\n")
}

func copyFile(src, dst string) error {
  sf, err := os.Open(src)
  if err != nil {
    return err
  }
  defer sf.Close()

  df, err := os.Create(dst)
  if err != nil {
    return err
  }
  defer df.Close()

  _, err = io.Copy(df, sf)
  if err != nil {
    return err
  }

  return df.Sync()
}

func checkError(err error) {
  if err != nil {
    fmt.Fprintln(os.Stderr, err)
    os.Exit(1)
  }
}
