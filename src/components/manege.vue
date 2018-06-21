<template lang="html">
  <div class="manege">
    <div class="manegeBox">
        <div class="top">
            <span>Bottom Library ID： </span>
            <!--<InputNumber class="inputId"  :min="1" v-model="ID" placeholder="Please Enter ID"></InputNumber>-->
            <Input class="inputId" v-model="ID" placeholder="Please Enter ID"></Input>
            <span>Names： </span>
            <Input class="inputIdName" v-model="name" placeholder="Please Enter Names"></Input>
            <Button class="searchBtn" type="primary" icon="ios-search" @click="searchList" :loading="loading">Search</Button>
            <div class="addBtn">
              <Upload
                  class="addUpload"
                  :before-upload="handleUpload"
                  type="drag"
                  action="">
                  <Button type="success">
                  <img src="../assets/img/people.png">
                   Add People </Button>
              </Upload>
            </div>
        </div>
        <div class="table">
          <Table stripe  :columns="columns" :data="manageList"></Table>
        </div>
        <div class="page">
          <Page  :total="total" :page-size="pageSize" placement="top" size="small" show-elevator show-sizer show-total @on-change="pageChange" @on-page-size-change="pageSizeChange"></Page>
        </div>
    </div>
    <Modal
        title="add people"
        v-model="addPeopleModal"
        class-name="vertical-center-modal"
        width="350"
        :mask-closable="false"
        >
        <Form ref="addPeopleForm" :model="addPeople" :rules="rules" inline :label-width="90">
          <FormItem prop="username" label="Username">
              <Input type="text" v-model="addPeople.username" placeholder="Please enter Username" style="width: 200px"></Input>
          </FormItem>
          <FormItem label="Identity">
              <Input type="text" v-model="addPeople.identity" placeholder="Please enter Identity" style="width: 200px"></Input>
          </FormItem>
          <div>
            <FormItem label="Radio">
                <RadioGroup v-model="addPeople.gender">
                    <Radio :label="1">Male</Radio>
                    <Radio :label="0">Female</Radio>
                </RadioGroup>
            </FormItem>
          </div>
      </Form>
      <div slot="footer">
            <Button type="primary" size="small"   @click="addPeopleCancel">Cancel</Button>
            <Button type="primary" size="small" :loading="modal_loading" @click="addPeopleOk" style="width: 80px;"> Ok </Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import rules from '../assets/rules.js'
export default {
  name: 'manege',
  computed: {
    rules () {
      return rules
    }
  },
  data () {
    return {
      loading: false,
      timer: '',
      modal_loading: false,
      addPeople: {
        username: '',
        photo: '',
        identity: '',
        gender: 1
      },
      addPeopleModal: false,
      dataUrl: '',
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      ID: '',
      name: '',
      manageList: [],
      columns: [
        {
          title: 'ID',
          key: 'id',
          align: 'center'
        },
        {
          title: 'Names',
          key: 'person',
          align: 'center'
        },
        {
          title: 'Photos',
          key: 'photo',
          className: 'zoomImage',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.photo
                },
                style: {
                  width: '140px',
                  height: '90px',
                  marginTop: '5px'
                }
              })
            ])
          }
        },
        {
          title: 'Delete',
          key: 'action',
          align: 'center',
          render: (h, params) => {
            return h('Icon', {
              props: {
                type: 'trash-a'
              },
              style: {
                fontSize: '30px',
                cursor: 'pointer'
              },
              on: {
                click: () => {
                  console.log('delete:' + params.row.id)
                  this.$http.delete(`/faces/${params.row.id}`).then(res => {
                    // 列表里把这条数据删除
                    this.$Message.success('delete success')
                    this.manageList = this.remove(this.manageList, params.row.id)
                    this.total = this.total - 1
                    this.searchList()
                  })
                }
              }
            })
          }
        }
      ]
    }
  },
  methods: {
    remove (arr, itemId) {
      return arr.filter(ele => {
        return ele.id !== itemId
      })
    },
    addPeopleCancel () {
      this.addPeopleModal = false
      this.addPeople.username = ''
      this.addPeople.photo = ''
      this.addPeople.identity = ''
      this.addPeople.gender = 0
    },
    addPeopleOk () {
      this.$refs.addPeopleForm.validate((valid) => {
        if (!valid) {
          this.$Message.error({
            content: 'Please use the correct username',
            duration: 3
          })
          return
        }
        // 发送 登录请求
        if (this.timer) {
          clearTimeout(this.timer)
        }
        this.modal_loading = true

        this.$http.post('/faces', {
          name: this.addPeople.username,
          photo: this.addPeople.photo,
          identity: this.addPeople.identity,
          gender: this.addPeople.gender
        }).then(res => {
          this.total = 1
          this.manageList = [res.data.result]
        })

        this.timer = setTimeout(() => {
          this.modal_loading = false
          this.addPeopleCancel()
        }, 500)
      })
    },
    handleUpload (file) {
      let that = this
      that.addPeople.username = file.name.split('.')[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = function () {
        that.addPeople.photo = reader.result
        that.addPeopleModal = true
      }
    },
    checkInfo () {
      if (this.name === '' && this.ID === '') {
        this.$Message.info({
          content: 'Please enter the search conditions',
          duration: 3
        })
        this.manageList = [] // 提示用户输入条件，并清空列表
        return false
      } else {
        return true
      }
    },
    searchList () {
      // 先检查 是否输入 ID 姓名
      let checkEnd = this.checkInfo()
      if (checkEnd) {
        this.loading = true
        this.$http.get(`/faces?page=${this.pageIndex}&pageSize=${this.pageSize}&name=${this.name}&id=${this.ID}`).then(res => {
          console.log(res)
          this.loading = false
          this.total = res.data.total
          this.manageList = res.data.result
          if (res.data.result.length === 0) {
            this.$Message.info({
              content: 'No matching item',
              duration: 3
            })
          }
        })
      }
    },
    pageChange (page) {
      this.pageIndex = page
      this.searchList()
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.searchList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .manege {
    width: 100%;
    height: 100%;
    padding: 60px 160px 100px;
    background-color: #eeeeee;
    border: 1px solid white;
    .manegeBox {
      width: 100%;
      min-width: 1100px;
      min-height: 850px;
      padding: 40px 100px 0;
      background-color: white;
      border: 1px solid white;
      .top {
        position: relative;
        span {
          font-size: 12px;
          color: #86A1BF;
        }
        .inputId {
          width: 140px;
          margin-right: 30px;
        }
        .inputIdName {
          width: 180px;
          margin-right: 30px;
        }
        .searchBtn {
          width: 108px;
          height: 30px;
          line-height: 17px;
          background: #05B3FF;
          border-radius: 4px;
          font-size: 14px;
          margin-right: 20px;
          &:hover {
            background-color: #0D9AFF;
          }
        }
        .addBtn {
          width: 128px;
          height: 30px;
          line-height: 25px;
          background: #00CCAB;
          border-radius: 4px;
          font-size: 14px;
          display: inline-block;
          vertical-align: middle;
          &:hover {
            background-color: #08CC8E;
            border: none;
          }
          Button {
            width: 100%;
          }
        }
      }
      .table {
        margin: 30px 0 30px;
      }
      .page {
        text-align: right;
        margin-bottom: 20px;
      }
    }
  }
  .zoomImage {
    width:100%;
    height:0;
    padding-bottom: 100%;
    overflow:hidden;
    background-position: center center;
    background-repeat: no-repeat;
    -webkit-background-size:cover;
    -moz-background-size:cover;
    background-size:cover;
  }
</style>
