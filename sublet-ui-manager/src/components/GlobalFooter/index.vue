<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
    </template>
    <template v-slot:copyright>
      <a href="http://www.sublet.com" target="_blank">@房转系统</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
