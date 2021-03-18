<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
    mixins: [Line,reactiveProp],
    props: ['options'],
    mounted() {
        this.renderChart(this.data, this.options)
    }
}
</script>