<template>
  <vue-c3
    :handler="handler"
  />
</template>

<script>
import Vue from 'vue'
import VueC3 from 'vue-c3'
import 'c3/c3.min.css'

export default {
 name: 'LineChartC3',

  components: {
    VueC3,
  },

  data: () => ({
    handler: new Vue(),
    options: {
      data: {},
    }
  }),

  mounted () {
    this.handler.$emit('init', this.options)
  },
}
</script>