<template>
    <div class="admin-layout">
      <AppAdminHeader/>
      <main>
  <slot/>
      </main>
     
    </div>
  </template>
  <script>
  import AppAdminHeader from '../AppAdminHeader.vue'

  
  export default{
    name:'AdminLayout',
    components:{
      AppAdminHeader,
   
    }
  }
</script>
  