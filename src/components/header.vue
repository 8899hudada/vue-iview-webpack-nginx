<template lang="html">
  <div class="myHeader">
    <span @click='linkToSearch'>
    <img src="../assets/img/face.png" class="face">
    Portrait Search
    </span>
    <span @click='linkToManege'>
    <img src="../assets/img/manager.png" class="face">
    Library Management</span>
  </div>
</template>

<script>
export default {
  name: 'myHeader',
  methods: {
    linkToSearch () {
      this.$router.push({
        name: 'search'
      })
    },
    linkToManege () {
      this.$router.push({
        name: 'manege'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.myHeader {
  width: 100%;
  height: 70px;
  line-height: 70px;
  padding: 0 160px;
  background-image: linear-gradient(90deg, #27A7EF 0%, #36CEF6 100%);
  span {
    display: inline-block;
    height: 70px;
    line-height: 70px;
    color: white;
    padding: 0 24px 0 0;
    margin-right: 22px;
    cursor: pointer;
    &:hover {
      background-color: #27A7EF;
    }
  }
  .face {
    position: relative;
    top: 5px;
    margin-right: 10px;
  }
}
</style>
