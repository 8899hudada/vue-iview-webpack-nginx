<template>
  <div class="login">
    <div class="loginBox">
      <div class='left'>
        Hello, <br>
        Welcome <br>
        Back!
      </div>
      <div class="right">
        <h2>Log in</h2>
        <div class="formBox">
          <Form :model="login" label-position="top" ref='loginForm' :rules="rules">
              <FormItem label="Username" prop='username'>
                  <Input type='text' v-model="login.username" autocomplete="off"></Input>
              </FormItem>
              <FormItem label="Password" prop='password'>
                  <Input type='password' v-model="login.password" autocomplete="off"></Input>
              </FormItem>
              <Button type="primary" @click='Login'>Log in</Button>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import rules from '../assets/rules.js'
export default {
  name: 'login',
  computed: {
    rules () {
      return rules
    }
  },
  data () {
    return {
      login: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    Login () {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          this.$Message.info({
            content: 'Please use the correct username and password',
            duration: 3
          })
          return
        }
        // 发送 登录请求
        this.$http.post('/session/login', this.login).then(res => {
          sessionStorage.setItem('token', res.data.result.token)
          setTimeout(() => {
            this.$router.replace({
              name: 'search'
            })
          }, 20)
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url('../assets/img/login_bg.jpg');
  background-size: cover;
  background-position: center;
  position: absolute;
  overflow: hidden;
  .loginBox {
    width: 1000px;
    height: 600px;
    border-radius: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .left {
      display: inline-block;
      width: 50%;
      height: 100%;
      float: left;
      font-size: 72px;
      color: #FFFFFF;
      padding: 82px 0 0 74px;
      background-color: #05B3FF;
      }
      .right {
        display: inline-block;
        width: 50%;
        height: 100%;
        padding: 82px 0 0 74px;
        float: right;
        background-color: white;
        h2 {
          font-size: 52px;
          color: #585858;
          margin-bottom: 56px;
        }
        .formBox {
          width: 360px;
          button {
            background: #05B3FF;
            border-radius: 3px;
            width: 360px;
            height: 50px;
            line-height: 40px;
            margin-top: 56px;
            font-size: 16px;
          }
        }
      }
    }
}
</style>
