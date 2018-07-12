<template>
    <div class="SearchResults">
      <h3 class="name">Search Results: {{totalResult}}</h3>
      <div class="contentBox" v-if="totalResult !== '0'">
        <div class="content" v-for="(item, index) in dataList" :key="item.face_name + index">
          <div class="imgBox">
            <img v-if="item.photo_base64 !== ''" class="imgbase64" :src="item.photo_base64">
            <div v-else class="zoomImage" :style="{backgroundImage: 'url('+ item.url +')'}"></div>
          </div>
          <h3 class="itemName no-wrap">{{item.face_name}}</h3>
          <span class="similar">similarity</span>
          <span class="similarNumber">{{item.similarity.toFixed(2)}}%</span>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'searchResult',
  props: {
    dataList: {
      type: Array,
      default: function () {
        return []
      }
    },
    totalResult: {
      type: String,
      default: function () {
        return '0'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.SearchResults {
  text-align: left;
  padding: 10px 35px 65px;
  .name {
    font-size: 16px;
    color: #626c77;
    margin-bottom: 5px;
  }
  .contentBox {
    width: 100%;
    background-color: #f3f6f9;
    padding: 20px 0 20px 30px;
    position: relative;
    .content {
      width: 120px;
      display: inline-block;
      margin: 15px 30px 15px 0;
      box-sizing: border-box;
      .imgBox {
        width: 120px;
        height: 120px;
        .imgbase64 {
          width: auto;
          height: 100%;
        }
        .zoomImage {
          width: 100%;
          height: 0;
          padding-bottom: 100%;
          overflow: hidden;
          background-position: center center;
          background-repeat: no-repeat;
          -webkit-background-size: cover;
          -moz-background-size: cover;
          background-size: cover;
        }
      }
      .itemName {
        font-size: 16px;
        color: #626c77;
        margin: 10px 0 0;
      }
      .similar {
        font-size: 14px;
        color: #8998aa;
      }
      .similarNumber {
        font-size: 16px;
        color: #626c77;
        float: right;
      }
    }
  }
}
.baseImage {
  width: 120px;
  height: 120px;
  text-align: center;
  img {
    width: auto;
    height: 100%;
  }
}
</style>
