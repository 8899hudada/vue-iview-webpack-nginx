<template lang="html">
  <div class="face_seach">
    <MyHeader></MyHeader>
    <router-view/>
  </div>
</template>

<script>
import MyHeader from './header'
export default {
  name: 'face_seach',
  components: {
    MyHeader
  }
}
</script>
