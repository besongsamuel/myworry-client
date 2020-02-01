#!usr/bin/env groovy


node {
  checkout scm
  withEnv(["PATH=$PATH:/usr/local/bin/"]){
    stage('build') {
      sh 'npm install'
      sh 'ng build --prod'
    }
    stage('test'){
      sh 'echo "Testing..."'
    }
  }
  withAWS(credentials:'ASW_CRED', region: 'us-east-1') {

    stage('Deploy') {
        s3Delete(bucket:'www.myworry.ca', path:'')
        s3Upload(workingDir:'dist/myworry-client', includePathPattern:'**/*', bucket:'www.myworry.ca', path:'', acl:'PublicRead')
    }
  }
  
  
}
