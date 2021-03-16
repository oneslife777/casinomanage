<template>
  <v-app>
    <!-- ツールバー -->
    
    <v-app-bar absolute
      color="#fcb69f"
      dark
      max-height="128px"
      shrink-on-scroll
      src="https://picsum.photos/1920/1080?random"
      scroll-target="#scrolling-techniques-2">

 <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(19,84,122,.5), rgba(128,208,199,.8)"
        ></v-img>
      </template>

      <v-spacer></v-spacer>
      

      <!-- タイトル -->
      <v-toolbar-title id="apptitle">
        {{ appName }}<br><center id="sub">for oneslife tools</center></v-toolbar-title>
      
      <v-spacer></v-spacer>
      <!-- テーブルアイコンのボタン -->
      <v-btn icon to="/">
        <v-icon>mdi-file-table-outline</v-icon>
      </v-btn>
      <!-- 歯車アイコンのボタン -->
      <v-btn icon to="/settings">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
    
<v-col>
  <v-spacer/>
</v-col>
<v-col>
  <v-spacer/>
</v-col>
<v-col>
  <v-spacer/>
</v-col>
<v-col>
  <v-spacer/>
</v-col>
<v-col>
  <v-spacer/>
</v-col>
    
    <!-- メインコンテンツ -->
    <v-main>
      <v-container fluid>
        <!-- router-view の中身がパスによって切り替わる -->
        <router-view></router-view>
      </v-container>
    </v-main>
    <!-- スナックバー -->
    <v-snackbar v-model="snackbar" color="error">{{ errorMessage }}</v-snackbar>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      snackbar: false
    }
  },
  computed: mapState({
    appName: state => state.settings.appName,
    errorMessage: state => state.errorMessage
  }),
  watch: {
    errorMessage () {
      this.snackbar = true
    }
  },
  // Appインスタンス生成前に一度だけ実行されます
  beforeCreate () {
    this.$store.dispatch('loadSettings')
  }
}
</script>

<style>

/* Google fontsで導入したいfonts から@importのコードを取得 */
@import url('https://fonts.googleapis.com/css2?family=Sawarabi+Mincho&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&family=Noto+Sans+JP&display=swap');
#apptitle {
/* Google fontsで導入したいfontsからfont-familyを取ってくる */
  font-family: 'Sawarabi Mincho', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  
  margin-top: 60px;
}

#sub {
/* Google fontsで導入したいfontsからfont-familyを取ってくる */
  font-family: 'Fredericka the Great', cursive;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  
  margin-top: 10px;
}

</style>