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
              :format="['jpg', 'png']"
              :on-format-error="handleFormatError"
              :max-size="3072"
              :on-exceeded-size="handleMaxSize"
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
              :format="['jpg', 'png']"
              :on-format-error="handleFormatError"
              :max-size="3072"
              :on-exceeded-size="handleMaxSize"
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
        this.$Notice.info({
          title: 'threshold error',
          desc: 'Please use the correct threshold',
          duration: 7
        })
        return false
      } else if (!this.limit) {
        this.$Notice.info({
          title: 'range error',
          desc: 'Please use the correct range',
          duration: 7
        })
        return false
      } else if (!this.dataUrl) {
        this.$Notice.info({
          title: 'image is empty',
          desc: 'Please upload image',
          duration: 7
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
        this.totalResult = String(0)
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
      }).catch((err) => {
        this.$Notice.error({
          title: 'Search error',
          desc: err.message,
          duration: 7
        })
        this.loading = false
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
        }).catch((err) => {
          this.$Notice.error({
            title: 'Search error',
            desc: err.message,
            duration: 7
          })
          this.loading = false
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
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: 'The file format is incorrect',
        desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.',
        duration: 7
      })
      let _this = this
      let FormatError = setTimeout(function () {
        _this.dataUrl = ''
        if (FormatError) {
          clearTimeout(FormatError)
        }
      }, 30)
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: 'Exceeding file size limit',
        desc: 'File  ' + file.name + ' is too large, no more than 3M.',
        duration: 10
      })
      let _this = this
      let MaxSize = setTimeout(function () {
        _this.dataUrl = ''
        if (MaxSize) {
          clearTimeout(MaxSize)
        }
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/search.scss";
</style>
