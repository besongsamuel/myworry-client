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
  withAWS(credentials:'AWS_CRED') {

    stage('Deploy') {
        s3Upload(file:'dist/*', bucket:'www.myworry.ca', path:'.')
    }
  }
  
  
}
