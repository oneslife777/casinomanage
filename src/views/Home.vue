<template>
  <div>
    <v-card>
      <v-card-title>
        <!-- 月選択 -->
        <v-col cols="8" sm="3">
          <v-menu 
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="yearMonth"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="yearMonth"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
                hide-details
              />
            </template>
            <v-date-picker
              v-model="yearMonth"
              type="month"
              color="blue"
              locale="ja-jp"
              no-title
              scrollable
            >
              <v-spacer/>
              <v-btn text color="grey" @click="menu = false">キャンセル</v-btn>
              <v-btn text color="primary" @click="onSelectMonth">選択</v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-spacer/>
        <!-- 追加ボタン -->
        <v-col class="text-right" cols="4">
          <v-btn dark color="blue" @click="onClickAdd">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>

         <!-- 収支総計 -->
        <v-col class="overflow-x-auto" cols="12" sm="9">
          <div class="summary">
            <div class="mr-4">
              <table class="text-right">
                 <tr>
                  <td>現在のドル円レート：￥</td>
                  <td>{{jpyUsd}}</td>
                </tr>
                <tr>
                  <td>利益：＄</td>
                  <td>{{ separate(Math.round((sum.income) * 100) / 100) }}</td>
                </tr>
                <tr>
                  <td>損失：＄</td>
                  <td>{{separate(Math.round((sum.outgo) * 100) / 100)}}</td>
                </tr>
                <tr>
                  <td>収支差：＄</td>
                  <td>{{ separate(Math.round((sum.income - sum.outgo) * 100) / 100) }}</td>
                </tr>
                <tr>
                  <td>日本円換算：￥</td>
                  <td>{{ separate(((sum.income - sum.outgo)*jpyUsd).toFixed(0))}}</td>
                </tr>
              </table>
            </div>

            
            
            <div v-for="blues in CTB" :key="blues[0]">
              <v-progress-circular
                class="mr-3"
                :rotate="-90"
                :size="100"
                :width="8"
                :value="blues[2]"
                color="blue"
              >
                {{ blues[0] }}
              </v-progress-circular>
              <div class="text-center mr-3">＄{{ separate(Math.round((blues[1]) * 100) / 100) }}</div>
            </div>
            
            
            <div v-for="reds in CTR" :key="reds[0]">
              <v-progress-circular
                class="mr-2"
                :rotate="-90"
                :size="100"
                :width="8"
                :value="reds[2]"
                color="red"
              >
                {{ reds[0] }}
              </v-progress-circular>
              <div class="text-center mr-2">＄{{ separate(Math.round((reds[1]) * 100) / 100)  }}</div>
            </div>
          </div>
        </v-col>

        <!-- 検索フォーム -->
        <v-col cols="3">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="検索"
            single-line
            hide-details
          />
        </v-col>
      </v-card-title>

     <!-- <div class="page">
   <Componentna :message="HAI"></Componentna>
  </div>-->




<v-btn type="button" color="blue" class="white--text" @click="BTN"  id="btn">グラフを表示</v-btn>

<v-col>


 
 <v-spacer/>
</v-col>
<BarChart class="chart" v-show="isActive"  :chartData="datacollection" :options="options" height="300" />

<Componentna :message="tableData"></Componentna>



      <Calendar/>
    
    <br>

      <!-- テーブル -->
      <v-data-table
        class="text-no-wrap"
        :headers="tableHeaders"
        :items="tableData"
        :search="search"
        :footer-props="footerProps"
        :loading="loading"
        :sort-by="'date'"
        :sort-desc="true"
        :items-per-page="30"
        mobile-breakpoint="500"
      >
        <!-- 日付列 -->
        <template v-slot:item.date="{ item }">
          {{ parseInt(item.date.slice(-2)) + '日' }}
        </template>
        <!-- タグ列 -->
        <template v-slot:item.tags="{ item }">
          <div v-if="item.tags">
            <v-chip
              class="mr-2"
              v-for="(tag, i) in item.tags.split(',')"
              :key="i"
            >
              {{ tag }}
            </v-chip>
          </div>
        </template>
        <!-- 収入列 -->
        <template v-slot:item.income="{ item }">
          {{ separate(item.income) }}
        </template>
        <!-- タグ列 -->
        <template v-slot:item.outgo="{ item }">
          {{ separate(item.outgo) }}
        </template>
        <!-- 操作列 -->
        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" @click="onClickEdit(item)">mdi-pencil</v-icon>
          <v-icon @click="onClickDelete(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>
    <!-- 追加／編集ダイアログ -->
    <ItemDialog ref="itemDialog"/>
    <!-- 削除ダイアログ -->
    <DeleteDialog ref="deleteDialog"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ItemDialog from '../components/ItemDialog.vue'
import DeleteDialog from '../components/DeleteDialog.vue'
import Calendar from '../components/Calendar.vue'
import axios from 'axios'
import Vue from 'vue'
import BarChart from '@/components/BarChart'
import VueAnalytics from 'vue-analytics';

Vue.use(VueAnalytics, {
  id: 'UA-172383676-2'
});


export default {
  name: 'Home',

  components: {
    ItemDialog,
    DeleteDialog,
    BarChart,
    //Calendar,
    Componentna:  Calendar,
  },

  data () {
    const today = new Date()
    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)
    
     
    return {
      /** 月選択メニューの状態 */
      menu: false,
      /** 検索文字 */
      search: '',
      /** 選択年月 */
      yearMonth: `${year}-${month}`,
      /** テーブルに表示させるデータ */
      tableData: [],
      TD:[], 
      //TEST:[], 
      //DATA:[],
      jpyUsd:0,
      TOTAL:0,
      MT:[],
      CTR:[],
      CTB:[],
      isActive: false,
      datacollection: null,
      options: null
    }
  },

  

mounted(){
    this.GURAHU();
    this.fillData();
    this.$ga.page('/pagename');

    this.options = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "top"
        },
        layout: {
          padding: 20
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true, 
                 
              }
            }
          ]
        }
      }
     
  
    axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=jpy')
        .then(function(res){
        //this.jpyEur = res.data.rates.JPY
        //this.jpyUsd = res.data.rates.JPY/res.data.rates.USD
        //this.jpyUsd = this.jpyUsd.toFixed(2)
       //this.jpyUsd = res.data
      var RESP = res.data.tether.jpy
      // var tmp = RESP.filter(e => e.rate);

      var JPY = Number(RESP);
          //parseInt(JPY, 10);
          JPY = Number(JPY).toFixed(2)
          //JPY = (JPY / 1000).toFixed(2)

      this.jpyUsd = JPY
        
        }.bind(this))
    
},

  computed: {
    ...mapState({
      /** 家計簿データ */
      abData: state => state.abData,
      /** ローディング状態 */
      loading: state => state.loading.fetch,
    }),
    /** テーブルのヘッダー設定 */
    tableHeaders () {
      return [
        { text: '日付', value: 'date', align: 'end' },
       /** { text: 'タイトル', value: 'title', sortable: false },*/
        { text: 'カジノ名', value: 'category', sortable: false },
        { text: 'タグ', value: 'tags', sortable: false },
        { text: '勝ち', value: 'income', align: 'end' },
        { text: '負け', value: 'outgo', align: 'end' },
        { text: 'メモ', value: 'memo', sortable: false },
        { text: '操作', value: 'actions', sortable: false }
      ]
    },
    /** テーブルのフッター設定 */
    footerProps () {
      return { itemsPerPageText: '', itemsPerPageOptions: [] }
    },
 

   /** 収支総計 */
    sum () {
      let income = 0
      let outgo = 0
      const categoryOutgo = {}
      const categories = []
      const categoryIncome = {}
      const categories2 = []
            
      // 収支の合計とカテゴリ別の支出を計算
      for (const row of this.tableData) {
        //TABLEデータのインカムにデータがある場合
        if (row.income !== null) {
          income += row.income
          if (categoryIncome[row.category]) {
            categoryIncome[row.category] += row.income
          } else {
            categoryIncome[row.category] = row.income
          }
  

        } else {
          //TABLEDATAのインカムにデータがない場合
          outgo += row.outgo
          if (categoryOutgo[row.category]) {
            categoryOutgo[row.category] += row.outgo
          } else {
            categoryOutgo[row.category] = row.outgo
          }
        }
      }
      // カテゴリ別の支出を降順にソート
      const sorted = Object.entries(categoryOutgo).sort((a, b) => b[1] - a[1])
      for (const [category, value] of sorted) {
        const percent = parseInt((value / outgo) * 100)
        categories.push([category, percent, value])
      }

      // カテゴリ別の支出を降順にソート
      const sorted2 = Object.entries(categoryIncome).sort((a, b) => b[1] - a[1])
      for (const [category2, value2] of sorted2) {
        const percent2 = parseInt((value2 / income) * 100)
        categories2.push([category2, percent2, value2])
      }

      return {
        income,
        outgo,
        categories,
        categories2,
      }
    }
  },

   

  methods: {
    ...mapActions([
      /** 家計簿データを取得 */
      'fetchAbData'
    ]),
    
    /** 表示させるデータを更新します */
    async updateTable () {
      const yearMonth = this.yearMonth
      const list = this.abData[yearMonth]
  
      if (list) {
        this.tableData = list
        this.fetchAbData({yearMonth}) 
        this.GURAHU(); 
        this.CASINOTOTAL()
        
       

      } else {
        await this.fetchAbData({ yearMonth })
        this.tableData = this.abData[yearMonth]
        //this.DATA = this.abData[yearMonth]
        this.GURAHU();
        this.CASINOTOTAL()
        
      }
    },

    CASINOTOTAL(){
      var MT = this.tableData
      let CASINOSUM =[]
      
      for(var y=0; y < MT.length; y++) { 
      var CASINO = MT[y].category //配列の1番目のカジノ名を取得
      var CASINOG = MT.filter(item => item.category === CASINO) //日付ごとに配列生成
      var incomeCASINO = CASINOG.map(x => x.income) //incomeデータのみ抽出
      let incomesumC = incomeCASINO.reduce(function(sum, element){
      return sum + element //incomeだけの合計
      }, 0);
      var outgoCASINO = CASINOG.map(x => x.outgo) //outgoデータのみ抽出
      let outgosumC = outgoCASINO.reduce(function(sum, element){
      return sum + element //outgoだけの合計
      }, 0);
      var Ctotal = incomesumC - outgosumC
      Math.round(Ctotal * 100) / 100; //四捨五入
      Ctotal = (Ctotal).toFixed(2) //1日ごとの合計

      CASINOSUM.push({name:MT[y].category,SUM:Ctotal}) //配列に追加
      var cleanListC = CASINOSUM.filter(function(v1,i1,a1){ 
      return (a1.findIndex(function(v2){ 
      return (v1.name===v2.name) 
      }) === i1);
      });
      }
      
      var reds = []
      var blues = []
//      var reds2 = []
      //var blues2 = []
      for(var x=0; x < cleanListC.length; x++) { 
      if(cleanListC[x].SUM < 0){
          reds.push([cleanListC[x].name,cleanListC[x].SUM])      
      }else{
          blues.push([cleanListC[x].name,cleanListC[x].SUM])
      }
      }
   
       for(var z=0; z < blues.length; z++) {
        var bluemap = blues.map(x => x.[1]) 
        let bluesum = bluemap.reduce(function(sum, element){
        return (parseFloat(sum) + parseFloat(element)) //outgoだけの合計
        }, 0);
        var persentB = ((blues[z].[1] / bluesum)*100).toFixed(0)
        blues[z].push(persentB)
       } 

       for(var c=0; c < reds.length; c++) {
        var redmap = reds.map(x => x.[1]) 
        let redsum = redmap.reduce(function(sum, element){
        return (parseFloat(sum) + parseFloat(element)) //outgoだけの合計
        }, 0);
        var persentR = ((reds[c].[1] / redsum)*100).toFixed(0)
        reds[c].push(persentR)
       } 
      this.CTR = reds
      this.CTB = blues
    },

    BTN(){
      this.isActive=true
      this.GURAHU()
      this.fillData()
    },
  
    GURAHU(){
      var TD = this.tableData 
      TD.sort(function(a,b){
      if(a.date<b.date) return -1;
      if(a.date > b.date) return 1;
      return 0;
      });
      let DAYSUM =[]
      let monthTT = []
      

      //日付ごとの収支取得する。まず日付ごとに配列を作成
      for(var i=0; i < TD.length; i++)  {
      var TODAY = TD[i].date //配列の1番目の日付を取得
      var DAYS = TD.filter(item => item.date === TODAY) //日付ごとに配列生成
      var incomeday = DAYS.map(x => x.income) //incomeデータのみ抽出
      let incomesum = incomeday.reduce(function(sum, element){
      return sum + element //incomeだけの合計
      }, 0);
      var outgoday = DAYS.map(x => x.outgo) //outgoデータのみ抽出
      let outgosum = outgoday.reduce(function(sum, element){
      return sum + element //outgoだけの合計
      }, 0);
      var daytotal = incomesum - outgosum
      Math.round(daytotal * 100) / 100; //四捨五入
      daytotal = (daytotal).toFixed(2) //1日ごとの合計

      monthTT.push(daytotal)

      var cleanMONTH = monthTT.filter(function(v1,i1,a1){ 
      return (a1.findIndex(function(v2){ 
      return (v2===v1) 
      }) === i1);
      });



      let monthtotal = cleanMONTH.reduce(function(sum, element){
      return (parseFloat(sum) + parseFloat(element)) //outgoだけの合計
      }, 0);
      
      DAYSUM.push({date:TD[i].date,SUM:monthtotal}) //配列に追加
      // 重複を取り除く処理
      var cleanList = DAYSUM.filter(function(v1,i1,a1){ 
      return (a1.findIndex(function(v2){ 
      return (v2.date===v1.date) 
      }) === i1);
      });

      this.TD = cleanList
      //this.TEST = DAYSUM
      //this.TEST2 = cleanList
      } 

      this.CHART()
      
    },

    CHART(){
    //this.isActive = true
    this.datacollection = {
        labels:  this.TD.map(item => item.date.slice( 8 )+"日"),
        datasets: [
          {
            label: "月間収支",
            data: this.TD.map(item => item.SUM),
             
            //ここに「キー(プロパティ名)：値」で指定していく
            backgroundColor: 'green',
            borderWidth: '2',
            borderColor: 'green',
            barPercentage: 0.5
          }
        ]
    }
    },

  
    DATAHYOUJI(){
    const yearMonth = this.yearMonth
    
    this.fetchAbData({yearMonth})
    //this.DATA = this.abData[yearMonth]
    //this.DATA.date = this.DATA.date.replace(/-/g,"/")
   
    },

    fillData() {
      this.datacollection = {
        labels:  this.TD.map(item => item.date.slice( 8 )+"日"),
        datasets: [
          {
            label: "収支(月間)",
            data: this.TD.map(item => item.SUM),
             
            //ここに「キー(プロパティ名)：値」で指定していく
            backgroundColor: 'green',
            borderWidth: '2',
            borderColor: 'green',
            barPercentage: 0.5
          }
        ]
      } 
    },

       

    /**
     * 数字を3桁区切りにして返します。
     * 受け取った数が null のときは null を返します。
     */
    separate (num) {
      return num !== null ? num.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,') : null
    },
    /** 月選択ボタンがクリックされたとき */
    onSelectMonth () {
      this.$refs.menu.save(this.yearMonth)
      this.updateTable()
    },
    /** 追加ボタンがクリックされたとき */
    onClickAdd () {
      this.$refs.itemDialog.open('add')
    },
    /** 編集ボタンがクリックされたとき */
    onClickEdit (item) {
      this.$refs.itemDialog.open('edit', item)
    },
    /** 削除ボタンがクリックされたとき */
    onClickDelete (item) {
      this.$refs.deleteDialog.open(item)
    }
  },
  created () {
    this.updateTable(),
    this.DATAHYOUJI(),
    this.CASINOTOTAL()
  }
}
Vue.component('bar-chart', BarChart)
</script>

<style>
.summary {
  display: flex;
  font-size: 0.7rem;
  white-space: nowrap;
  line-height: 1.2rem;
}

</style>