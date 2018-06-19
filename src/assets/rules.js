let rules = {
  username: [
    { required: true, message: 'The username can not be empty', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'The password can not be empty', trigger: 'blur' }
  ],
  identity: [
    { required: true, message: 'The identity can not be empty', trigger: 'blur' }
  ]
}

export default rules
