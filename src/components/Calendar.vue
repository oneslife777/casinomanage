<template>
  <div>
<div>
 
 
</div>
    <v-sheet tile height="6vh" color="blue lighten" class="d-flex align-center">
      <v-btn outlined small class="ma-4" @click="setToday" color="white">
        今日
      </v-btn>
      <v-btn icon color="white" @click="$refs.calendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn icon color="white" @click="$refs.calendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
      <v-toolbar-title class="white--text" >{{ title }}</v-toolbar-title>

    </v-sheet>


    <v-sheet height="90vh">
      <v-calendar
        ref="calendar"
        v-model="value"
        :events="events"
        :event-color="getEventColor"
        locale="ja-jp"
        :day-format="(timestamp) => new Date(timestamp.date).getDate()"
        :month-format="(timestamp) => new Date(timestamp.date).getMonth() + 1 + ' /'"
        @change="getEvents"
        @click:event="showEvent"
        :event-more = false
      ></v-calendar>

        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>


    </v-sheet>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'


export default {
name:'Calendar',
//props: ['message'],

data () {
    
    const today = new Date()
    const year = today.getFullYear()
    const month = ('0' + (today.getMonth() + 1)).slice(-2)

    return {
    //ddata:[],
    events: [],
    value: moment().format('yyyy-MM-DD'),
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    yearMonth: `${year}-${month}`, 
    DATA:[],
    
    
    }
  },

    
  
  computed: {
    ...mapState({
      /** 家計簿データ */
      abData: state => state.abData,
      /** ローディング状態 */
      loading: state => state.loading.fetch,
    }),
    
    title() {
      return moment(this.value).format('yyyy年 M月');
    },
  },

  methods: {
    ...mapActions([
      /** 家計簿データを取得 */
      'fetchAbData'
    ]),

    async DATAOPEN(){
    const yearMonth = this.yearMonth
    const list = this.abData[yearMonth]

    if (list) {
    this.DATA = list
    this.fetchAbData({yearMonth})}
    else {
        await this.fetchAbData({ yearMonth })
        this.DATA = this.abData[yearMonth]
        this.getEvents();
      }
    },

    showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },

    setToday() {
      this.value = moment().format('yyyy-MM-DD');
      
    },
   
    getEvents() {
     
      const events = []
      //var y = 0
      var COLORS = 'blue'
      //var GOUKEI = 0
      //var x = 0 
  
      //ループ処理
      for(var i=0; i < this.DATA.length; i++) {
        var DATE = this.DATA[i].date
        var NAME = String(this.DATA[i].income)
        //var CASINO = String(this.DATA[i].category)
        
        //インカムのデータが空欄ではない時
        if(this.DATA[i].income !== null){
          NAME = "＄" + String(this.DATA[i].income)
          COLORS = 'green'
        }else{
          NAME = "＄" + String(-this.DATA[i].outgo)
          COLORS = 'green'
        }
  
          events.push({
            name: NAME,
            start: moment(DATE).toDate(),
            color: COLORS,
          })
      }

    //イベント配列ソート
    this.DATA.sort(function(a,b){
    if(a.date<b.date) return -1;
    if(a.date > b.date) return 1;
    return 0;
    });

    //イベント配列ソート
    events.sort(function(a,b){
    if(a.start<b.start) return -1;
    if(a.start > b.start) return 1;
    return 0;
    });


    for(var y=1; y < this.DATA.length; y++) { //比較ループ処理
    
     if (this.DATA[y-1].date === this.DATA[y].date){ //前回と今回の日付を比較して同じ場合
     
     var TODAY = this.DATA[y].date //ループで順に指定日を確定

      //同じ日付のデータのみで配列を作成
      var DDAY = this.DATA.filter(x => x.date === TODAY)
      this.DDAY = DDAY

      //incomeデータのみ抽出
      const INCOME = DDAY.map(x => x.income)

      //INCOMEの数値を合算
      let ALLINCOME = INCOME.reduce(function(sum, element){
      return Math.round((sum * 100) / 100) + Math.round((element * 100) / 100)
      }, 0);
      //Math.round(ALLINCOME * 100) / 100;

      //outgoデータのみ抽出
      const OUTGO = DDAY.map(x => x.outgo)

      //OUTGOの数値を合算
      let ALLOUTGO = OUTGO.reduce(function(sum, element){
      return Math.round((sum * 100) / 100) + Math.round((element * 100) / 100)
      }, 0);
      //Math.round(ALLOUTGO * 100) / 100;
      
      var TOTAL = ALLINCOME - ALLOUTGO
      Math.round(TOTAL * 100) / 100;
    

      //合計金額の判定
             //   if(TOTAL > 0){
              //  COLORS = "blue"
               // }else{
               // COLORS = "red"  
                //}

     NAME = "＄" + TOTAL
     
     COLORS = "white"
     events[y-1].name = NAME
     events[y]["color"] = COLORS
    //合計金額の判定
     // if(TOTAL > 0){
     // COLORS = "blue"
     // }else{
     // COLORS = "red"  
     // }
      
     }
    }

       this.events = events;   
       
    },

    getEventColor(event) {
      return event.color;
    },
  },

created () {
    this.DATAOPEN()     
  }

}

</script>