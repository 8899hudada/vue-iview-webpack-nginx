<template lang="html">
  <div class="search">
    <div class="searchBoxTop" v-show="showTop"></div>
    <div class="searchBox">
      <div class="searchDetail">
        <div class="imgBox">
          <Upload
              v-if="!dataUrl"
              class="upload"
              :before-upload="handleUpload"
              type="drag"
              :show-upload-list = false
              action="">
              <div class="uploadIcon">
                  <img src="../assets/img/camera.png">
              </div>
          </Upload>
          <img v-if="dataUrl" :src="dataUrl" class="upImg">
        </div>
        <div class="upBtn">
          <Upload
              class="upload"
              :before-upload="handleUpload"
              type="drag"
              action="">
              <div class="uploadIcon">
                  {{dataUrl ? 'Re - Upload' : 'Please Upload a Portrait Photo' }}
              </div>
          </Upload>
        </div>
        <div class="searchBtn">
            <label for="Threshold">
              Search Threshold:
            </label>
            <InputNumber class="inputNumber" name='Threshold' :max="100" :min="70" v-model="threshold" placeholder='70~100'></InputNumber><span class="percent">%</span>
            <label for="Range">
              Return Range:
            </label>
            <InputNumber class="inputNumber" name='Range' :max="200" :min="1" v-model="limit" placeholder='1~200'></InputNumber>
            <Button class="searchbtn" type="primary" @click='search' :loading="loading">Search</Button>
        </div>
        <div v-if="showMessage" class="showMessage">{{showMessage}}</div>
      </div>
      <div v-show="!showTop">
        <SearchResults :dataList="dataList" :totalResult="totalResult"></SearchResults>
      </div>
    </div>
  </div>
</template>

<script>
import SearchResults from './searchResults'
import searchJson from './search.json'
export default {
  name: 'Search',
  components: {
    SearchResults
  },
  data () {
    return {
      showMessage: '',
      loading: false,
      totalResult: '',
      queryToken: '',
      threshold: 70,
      limit: 10,
      showTop: true,
      dataList: [],
      dataUrl: ''
    }
  },
  methods: {
    chechInfo () {
      // 检查数据是否齐全
      if (!this.threshold) {
        this.$Message.info({
          content: 'Please use the correct threshold',
          duration: 3
        })
        return false
      } else if (!this.limit) {
        this.$Message.info({
          content: 'Please use the correct range',
          duration: 3
        })
        return false
      } else if (!this.dataUrl) {
        this.$Message.info({
          content: 'Please upload image',
          duration: 3
        })
        return false
      } else {
        return true
      }
    },
    search_timer_msg (status) {
      this.showMessage = searchJson[status] + ' !!!'
    },
    search_timer_query () {
      let timer = setTimeout(() => {
        this.search_query_token()
        if (timer) {
          clearTimeout(timer)
        }
      }, 2000)
    },
    search_query_token () {
      this.$http.get(`/query/${this.queryToken}`).then(res => {
        this.dataList = []
        this.loading = true
        this.showMessage = ''
        console.log(res)
        if (res.data.status === 'processed') {
          this.dataList = res.data.result
          this.totalResult = String(res.data.total)
          this.showTop = false
          this.loading = false
        } else if (res.data.status === 'fail') {
          this.search_timer_msg(res.data.status)
          this.loading = false
        } else {
          this.search_timer_msg(res.data.status)
          this.search_timer_query()
        }
      })
    },
    search () {
      let checkEnd = this.chechInfo()
      if (checkEnd) {
        this.$http.post('/query', {
          photo: this.dataUrl,
          threshold: this.threshold,
          limit: this.limit
        }).then(res => {
          this.queryToken = res.data.result.query_token
          this.search_query_token()
        })
      }
    },
    handleUpload (file) {
      let that = this
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = function () {
        that.dataUrl = reader.result
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/search.scss";
</style>
