pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                script {
                    checkout([$class: 'GitSCM', branches: [[name: 'main']], userRemoteConfigs: [[url: 'https://github.com/AnthonyTerreros/CI_OncesDevs']]])
                }
            }
        }
        stage("Install") {
            steps {
                script {
                    bat "npm install"
                }
            }
        }
        stage("Test: Unit and Integration") {
            steps {
                script {
                    bat "npm test"
                }
            }
            post {
                always {
                    junit 'junit.xml'
                }
            }
        }
        state("Test: Acceptance") {
            steps {
                script {
                    bat "node_modules\.bin\cucumber-js --format json:report.json"
                }
            }
            post {
                always {
                     cucumber fileIncludePattern: 'report.json'
                }
            }
        }
    }
}
