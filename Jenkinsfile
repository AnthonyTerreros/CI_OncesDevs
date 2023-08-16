pipeline {
    agent any
    stages {
        stage("Install") {
            steps {
                scripts {
                    bat "npm install"
                }
            }
        }
        stage("Test") {
            steps {
                scripts {
                    bat "npm test"
                }
            }
            post {
                always {
                    junit 'output/coverage/junit/junit.xml'
                }
            }
        }
    }
}