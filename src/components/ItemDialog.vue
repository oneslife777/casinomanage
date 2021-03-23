<template>
  <!-- 追加／編集ダイアログ -->
  <v-dialog
    v-model="show"
    scrollable
    persistent
    max-width="500px"
    eager
  >
    <v-card>
      <v-card-title>{{ titleText }}</v-card-title>
      <v-divider/>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- 日付選択 -->
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
                hide-details
              />
            </template>
            <v-date-picker
              v-model="date"
              color="blue"
              locale="ja-jp"
              :day-format="date => new Date(date).getDate()"
              no-title
              scrollable
            >
              <v-spacer/>
              <v-btn text color="grey" @click="menu = false">キャンセル</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">選択</v-btn>
            </v-date-picker>
          </v-menu>
           <v-col><v-spacer/></v-col>
          <!-- タイトル --
          <v-text-field
            label="タイトル"
            v-model.trim="title"
            :counter="20"
            :rules="titleRules"
          />-->
          
          <!-- カテゴリ -->
          <v-select
            label="カジノ名"
            v-model="category"
            :items="categoryItems"
            hide-details
          />
          <v-col cols="8">
          <!-- タグ -->
          <v-select
            label="タグ"
            v-model="tags"
            :items="tagItems"
            multiple
            chips
            :rules="[tagRule]"
          />
          </v-col>

          <!-- 収支 -->
          <v-radio-group
            row
            v-model="inout"
            hide-details
            @change="onChangeInout"
          >
            <v-radio label="勝ち" value="income"/>
            <v-radio label="負け" value="outgo"/>
          </v-radio-group>


          <v-row  style="height: 45px;" >
            <v-col style="width: 320px;" >
          <!-- 通貨選択-->    
          <v-switch  
          v-model="agree" 
          true-value="yes" 
          false-value="no" 
          color="primary"
          label="円で入力する"
          @change="disp2">
          </v-switch>
            
          <v-spacer/>
</v-col>
 <v-col style="width: 320px;" >
          <v-switch  
          v-model="agree2" 
          true-value="yes" 
          false-value="no" 
          color="primary"
          label="BTCで入力する"
          @change="disp3">
          </v-switch></v-col>
</v-row>
           <v-row  style="height: 20px;" >
             <v-col cols="12" style="width: 500px;">
          <v-switch  
          v-model="agree3" 
          true-value="yes" 
          false-value="no" 
          color="primary"
          label="開始残高と終了残高で＄入力する"
          @change="disp4">
          </v-switch></v-col></v-row>
          

         <v-row  style="width: 320px;" >
           <v-col cols="6">
          <!--JPY通貨入力-->
          <v-text-field           
            prefix="￥"
            v-model.number="amount2JS"
            v-if="isActive2"
            outlined
            clearable
            label="開始残高"
            @change="onChangeTuukaJS"
            patte rn="[0-9]*"
            :rules="amountRulesJPY"
          ></v-text-field>
           </v-col><v-spacer/>
           <v-col cols="6">
           <v-text-field           
            prefix="￥"
            v-model.number="amount2JE"
            v-if="isActive4"
            outlined
            clearable
            label="終了残高"
            @change="onChangeTuukaJE"
            patte rn="[0-9]*"
            :rules="amountRulesJPY"
          ></v-text-field>
           </v-col>
         </v-row>

            <v-text-field           
            prefix="￥"
            v-model.number="amount2"
            v-if="isActive2"
            outlined
            clearable
            label="直接入力 ※ドルに自動換算されます"
            @change="onChangeTuuka"
            patte rn="[0-9]*"
            :rules="amountRulesJPY"
          ></v-text-field>

           <v-row  style="width: 320px;" >
           <v-col cols="6">
           <!--BTC通貨入力-->
           <v-text-field           
            prefix="mBTC"
            v-model.number="amount3BS"
            v-if="isActive3"
            outlined
            clearable
            label="開始残高"
            @change="onChangeTuukaBS"
            patte rn="[0-9]*"
            :rules="amountRules"
          ></v-text-field>

          </v-col><v-spacer/>
           <v-col cols="6">

          <v-text-field           
            prefix="mBTC"
            v-model.number="amount3BE"
            v-if="isActive5"
            outlined
            clearable
            label="終了残高"
            @change="onChangeTuukaBE"
            patte rn="[0-9]*"
            :rules="amountRules"
          ></v-text-field>
          </v-col>
         </v-row>

            <v-text-field           
            prefix="mBTC"
            v-model.number="amount3"
            v-if="isActive3"
            outlined
            clearable
            label="直接入力 ※ドルに自動換算されます"
            @change="onChangeTuuka2"
            patte rn="[0-9]*"
            :rules="amountRules"
          ></v-text-field>
          

          <v-row  style="width: 320px;" >
           <v-col cols="6">
          <v-text-field
            v-model.number="amountS"
            prefix="＄"
            label="開始残高"
            outlined
            clearable
            v-if="isActive7"
            patte rn="[0-9]*"
            :rules="amountRules"
             @change="onChangeAmountS"
          />
          </v-col><v-spacer/>
           <v-col cols="6">

          <v-text-field
            v-model.number="amountE"
            prefix="＄"
            v-if="isActive6"
            label="終了残高"
            outlined
            clearable
            patte rn="[0-9]*"
            :rules="amountRules"
             @change="onChangeAmountE"
          /></v-col>
         </v-row>

          
          <v-text-field
            v-model.number="amount"
            prefix="＄"
            label="直接入力 ※少数第2位以下は四捨五入されます"
            patte rn="[0-9]*"
            :rules="amountRules"
             @change="onChangeAmount"
          />
          <!-- メモ -->
          <v-text-field
            label="メモ"
            v-model="memo"
            :counter="50"
            :rules="[memoRule]"
          />
        </v-form>
      </v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-spacer/>
        <v-btn
          color="grey darken-1"
          text
          :disabled="loading"
          @click="onClickClose"
        >
          キャンセル
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          :disabled="!valid"
          :loading="loading"
          @click="onClickAction"
        >
          {{ actionText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'ItemDialog',
  
  data () {
    return {
      /** ダイアログの表示状態 */
      show: false,
      /** 入力したデータが有効かどうか */
      valid: false,
      /** 日付選択メニューの表示状態 */
      menu: false,
      /** 操作タイプ 'add' or 'edit' */
      actionType: 'add',
      /** id */
      id: '',
      /** 日付 */
      date: '',
      /** タイトル */
      title: '',
      /** 収支 'income' or 'outgo' */
      inout: '',
      /** カテゴリ */
      category: '',
      /** タグ */
      tags: [],
      /** 単位*/
      tani: "￥",
      bikou:'',
      /** 通貨 'japan' or 'usd' */
      tuuka: '',
      /** ドル円*/
      jpyEur: '',
      jpyUsd: '',
      bpi: '',
      DORUEN: 'ドル円',
      DORUTEXT:false,
      isActive3: false,
      isActive4:false,
      isActive2: false,
      isActive5:false,
      isActive6:false,
      Active:false,
      agree:false,
      agree2:false,   
      agree3:false,
      isActive7:false,   
      amount2:0,
      amount3:0,
      amount2JS:0,
      amount2JE:0,
      amount3BS:0,
      amount3BE:0,
      amountS:'',
      amountE:0,
      
      /** 金額 */
      amount: 0,
      /** メモ */
      memo: '',
      /** 選択可能カテゴリ一覧 */
      categoryItems: [],
      /** 編集前の年月（編集時に使う） */
      beforeYM: '',
      /** バリデーションルール */
      titleRules: [
        v => v.trim().length > 0 || 'タイトルは必須です',
        v => v.length <= 20 || '20文字以内で入力してください'
      ],
      tagRule: v => v.length <= 5 || 'タグは5種類以内で選択してください',
      amountRulesJPY: [
        v => v >= 0 || '金額は0以上で入力してください',
        v => Number.isInteger(Number(v)) || '整数で入力してください'
      ],
      amountRules: [
        v => v >= 0 || '金額は0以上で入力してください',
        //v => Number.isInteger(Number(v)) || '整数で入力してください'
      ],
      memoRule: v => v.length <= 50 || 'メモは50文字以内で入力してください'
    }
  },

  

  computed: {
    ...mapGetters([
      /** 収支カテゴリ */
      'incomeItems',
      'outgoItems',
      /** タグ */
      'tagItems'
    ]),
    ...mapState({
      /** ローディング状態 */
      loading: state => state.loading.add || state.loading.update
    }),
    /** ダイアログのタイトル */
    titleText () {
      return this.actionType === 'add' ? 'データ追加' : 'データ編集'
    },
    /** ダイアログのアクション */
    actionText () {
      return this.actionType === 'add' ? '追加' : '更新'
    }
  },
  methods: {
    ...mapActions([
      /** データ追加 */
      'addAbData',
      /** データ更新 */
      'updateAbData'
    ]),
    /**
     * ダイアログを表示します。
     * このメソッドは親から呼び出されます。
     */
    open (actionType, item) {
      this.show = true
      this.actionType = actionType
      this.resetForm(item)
      if (actionType === 'edit') {
        this.beforeYM = item.date.slice(0, 7)
      }
    },
    /** キャンセルがクリックされたとき */
    onClickClose () {
      this.show = false
    },
    /** 追加／更新がクリックされたとき */
    async onClickAction () {
      const item = {
        date: this.date,
        title: this.title,
        category: this.category,
        tags: this.tags.join(','),
        memo: this.memo,
        income: null,
        outgo: null
      }

      item[this.inout] = this.amount || 0
      if (this.actionType === 'add') {
        await this.addAbData({ item })
        this.$router.go({path: this.$router.currentRoute.path, force: true})
      } else {
        item.id = this.id
        await this.updateAbData({ beforeYM: this.beforeYM, item })
        this.$router.go({path: this.$router.currentRoute.path, force: true})
      }

      this.show = false
    },
    /** 収支が切り替わったとき */
    onChangeInout () {
      if (this.inout === 'income') {
        this.categoryItems = this.incomeItems
      } else {
        this.categoryItems = this.outgoItems
      }
      this.category = this.categoryItems[0]
    },

    disp2(){
     
     if(this.agree === "yes"){this.isActive2=true}
     else{this.isActive2=false, this.isActive4=false}
     
    },

    disp3(){
     
     if(this.agree2 === "yes"){this.isActive3=true}
     else{this.isActive3=false, this.isActive5=false}
     
    },

    disp4(){
     
     if(this.agree3 === "yes"){this.isActive7=true}
     else{this.isActive7=false, this.isActive6=false}
     
    },

    /** 金額が入力されたとき */
    onChangeAmount () {
      
    //this.amount = Number(this.amount).toFixed(2)
    this.amount = Math.round(this.amount * 100) / 100;
        
    },

    /** 通貨が切り替わったとき */
    onChangeTuuka () {
      
    axios.get('https://api.exchangeratesapi.io/latest')
        .then(function(res){
        this.jpyEur = res.data.rates.JPY
        this.jpyUsd = res.data.rates.JPY/res.data.rates.USD
        this.jpyUsd = this.jpyUsd.toFixed(2)
        this.amount = Number((this.amount2 /this.jpyUsd).toFixed(2))
        this.amount = Math.round(this.amount * 100) / 100;
        }.bind(this))
        
    },
    
    onChangeTuuka2 () {
    
     axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(function(res){
        this.bpi = res.data.bpi.USD.rate

          var BTC = this.bpi.replace(/,/g, '');
          parseInt(BTC, 10);
          BTC = Number(BTC).toFixed(2)
          BTC = (BTC / 1000).toFixed(2)



        this.amount = Number(BTC * this.amount3)
        this.amount = Math.round(this.amount * 100) / 100;
    }.bind(this))
        
    },

    onChangeAmountS () {
     
     this.isActive6 = true
    },

    onChangeAmountE () {

      this.amount = this.amountE - this.amountS
      if(this.amount > 0){
        this.inout = 'income'
      }else{
        this.inout = 'outgo'
        this.amount =Math.abs(this.amount)
      }     
    },

    onChangeTuukaJS () {
      if(this.agree === "yes"){this.isActive4=true}
     else{this.isActive4=false}

     if(this.isActive2 == false){
       this.isActive4 = false
     }  
    },

    onChangeTuukaJE () {

      this.amount2 = this.amount2JE - this.amount2JS
      if(this.amount2 > 0){
        this.inout = 'income'
      }else{
        this.inout = 'outgo'
        this.amount2 =Math.abs(this.amount2)
      }


      axios.get('https://api.exchangeratesapi.io/latest')
        .then(function(res){
        this.jpyEur = res.data.rates.JPY
        this.jpyUsd = res.data.rates.JPY/res.data.rates.USD
        this.jpyUsd = this.jpyUsd.toFixed(2)
        this.amount = Number((this.amount2 /this.jpyUsd).toFixed(2))
        this.amount = Math.round(this.amount * 100) / 100;
        }.bind(this))
     
    },

    onChangeTuukaBS () {
      if(this.agree2 === "yes"){this.isActive5=true}
     else{this.isActive5=false}

     if(this.isActive3 == false){
       this.isActive5 = false
     }  
    },

    onChangeTuukaBE () {

      this.amount3 = this.amount3BE - this.amount3BS
      if(this.amount3 > 0){
        this.inout = 'income'
      }else{
        this.inout = 'outgo'
        this.amount3 =Math.abs(this.amount3)
      }


     axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(function(res){
        this.bpi = res.data.bpi.USD.rate

          var BTC = this.bpi.replace(/,/g, '');
          parseInt(BTC, 10);
          BTC = Number(BTC).toFixed(2)
          BTC = (BTC / 1000).toFixed(2)



        this.amount = Number(BTC * this.amount3)
        this.amount = Math.round(this.amount * 100) / 100;
    }.bind(this))
     
    },


    /** フォームの内容を初期化します */
    resetForm (item = {}) {
      const today = new Date()
      const year = today.getFullYear()
      const month = ('0' + (today.getMonth() + 1)).slice(-2)
      const date = ('0' + today.getDate()).slice(-2)
      this.id = item.id || ''
      this.date = item.date || `${year}-${month}-${date}`
      this.title = item.title || ''
      this.tuuka = 'japan'
      this.isActive=false
      this.isActive2=false
      this.isActive4 = false
      this.amount2JS = 0
      this.amount2JE = 0
      this.isActive5 = false
      this.isActive6 = 0
      this.amountS = ''
      this.amountE = 0
      this.amount3BS = 0
      this.amount3BE = 0
      this.agree2 = false
      this.agree3 = false
      this.agree = false
      axios.get('https://api.exchangeratesapi.io/latest')
    .then(function(res){
        this.jpyEur = res.data.rates.JPY
        this.jpyUsd = res.data.rates.JPY/res.data.rates.USD
        this.jpyUsd = this.jpyUsd.toFixed(2)
        this.amount2 = 0
    }.bind(this))
      this.inout = item.income != null ? 'income' : 'outgo'
      if (this.inout === 'income') {
        this.categoryItems = this.incomeItems
        this.amount = item.income || 0
      } else {
        this.categoryItems = this.outgoItems
        this.amount = item.outgo || 0
      }
      this.category = item.category || this.categoryItems[0]
      this.tags = item.tags ? item.tags.split(',') : []
      this.memo = item.memo || ''
      this.$refs.form.resetValidation()  
    }
  }
}
</script>