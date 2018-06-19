<template>
    <div class="SearchResults">
      <h3 class="name">Search Results: {{totalResult}}</h3>
      <div class="contentBox">
        <div class="content" v-for="(item, index) in dataList" :key="item.face_name + index">
          <div class="imgBox">
            <div class="zoomImage" :style="{backgroundImage: 'url('+ item.url +')'}"></div>
          </div>
          <h3 class="itemName no-wrap">{{item.face_name}}</h3>
          <span class="similar">similarity</span>
          <span class="similarNumber">{{item.similarity}}%</span>
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
        return ''
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
    color: #626C77;
    margin-bottom: 5px;
  }
  .contentBox {
    width: 100%;
    background-color: #F3F6F9;
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
      }
      .itemName {
        font-size: 16px;
        color: #626C77;
        margin: 10px 0 0;
      }
      .similar {
        font-size: 14px;
        color: #8998AA;
      }
      .similarNumber {
        font-size: 16px;
        color: #626C77;
        float: right;
      }
    }
  }
}
</style>
