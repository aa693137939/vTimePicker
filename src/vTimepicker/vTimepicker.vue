<template>
    <div class="date-pickers">
        <input type="text" placeholder="选择日期" @focus="trueDateBox" :value="timePicker.value" readonly />
        <transition name="fade">
            <div class="date-box" v-if="dateBoxFlag">
                <div class="day-select">
                    <div>
                        <button class="year-btn" @click="reduceYear">&laquo;</button>
                        <button @click="reduceMonth">&lt;</button>
                    </div>
                    <div>
                        <input type="text" @click="selected" v-model="year" />年
                        <input type="text" @click="selected" v-model="month" />月
                    </div>
                    <div>
                        <button @click="addMonth">&gt;</button>
                        <button class="year-btn" @click="addYear">&raquo;</button>
                    </div>
                </div>
                <div class="day-screen">
                    <div>
                        <span v-for="week in week">{{ week }}</span>
                    </div>
                    <div @click="selectDay">
                        <span v-for="day in previousMonth" class="previousMonth"
                              :class="{'disabled':isDisabled(day,'pre')}">
                        {{ day }}</span>
                        <span v-for="day in monthDay[month - 1]"
                              :class="{'active':isActive(day),'disabled':isDisabled(day,'self')}"
                              class="currentMonth">{{ day }}</span>
                        <span v-for="day in nextMonth" class="nextMonth" :class="{'disabled':isDisabled(day,'next')}">
                        {{ day }}</span>
                    </div>
                </div>
                <div class="time-screen" v-if="hasTime">
                时间:
                    <input class="time-input" type="number" @click="selected" v-model="hour" /> :
                    <input class="time-input" type="number" @click="selected" v-model="minute" /> :
                    <input class="time-input" type="number" @click="selected" v-model="second" />
                </div>
                <div class="btn-screen" v-if="hasBtn">
                    <button v-if="hasClean" @click="cleanFn">清空</button>
                    <button v-if="hasToday" @click="toToday">今天</button>
                    <button @click="cancel">取消</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
      name: 'vTimePicker',
      data () {
        return {
          dateBoxFlag: false,
          isClean:false,
          clicked:false,
          year: 0,
          month: 0,
          day: 0,
          hour:0,
          minute:0,
          second:0,
          previousMonth: [],
          nextMonth: [],
          week: ['日', '一', '二', '三', '四', '五', '六'],
          monthDay: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
          maxDate:'',
          minDate:'',
          hasTime:true,
          hasBtn:true,
          hasClean:true,
          hasToday:true,
//          format:'yyyy-MM-dd hh:mm:ss'
          format:'yyyy-MM-dd'
        }
      },
      props:{
        timePicker:{
          type: Object,
          required: true,
          default: function(){
            return null;
          }
        }
      },
      computed: {
        date () {
          const self=this;
          self.clicked=false;
          if(self.isClean== true){
            console.log('clean');
            self.timePicker.value='';
            return self.timePicker.value;
          }
          if (self.year == 0 || self.month == 0 || self.day == 0) {
            self.timePicker.value='';
            return self.timePicker.value;
          }
          let year=self.year,month=self.month,day=self.day,
            hour=self.hour,minute=self.minute,second=self.second,result='';
          switch ( self.format ) {
            case 'yyyy-MM-dd hh:mm:ss' : {
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              hour = hour < 10 ? '0' + hour : '' + hour;
              minute = minute < 10 ? '0' + minute : '' + minute;
              second = second < 10 ? '0' + second : '' + second;
              result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
              break;
            }
            case 'yyyy-MM-dd hh:mm' : {
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              hour = hour < 10 ? '0' + hour : '' + hour;
              minute = minute < 10 ? '0' + minute : '' + minute;
              result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
              break;
            }
            case 'yyyy-MM-dd' : {
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              result = year + '-' + month + '-' + day;
              break;
            }
            default:{
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              hour = hour < 10 ? '0' + hour : '' + hour;
              minute = minute < 10 ? '0' + minute : '' + minute;
              second = second < 10 ? '0' + second : '' + second;
              result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
              break;
            }
          }
          self.timePicker.value=result;
          return result;
        }
      },
      watch: {
        year: function (val) {
          let self=this;
          let reg = /^[1-9]\d*$/g;
          if (!reg.test(val)) {
            let date = new Date();
            self.year = date.getFullYear();
          }
          if (val < 0) {
            self.year = 1;
          }
          if (val > 10000) {
            self.year = 10000;
          }
          self.dayScreen();
        },
        month: function (val) {
          let self=this;
          let reg = /^[1-9]\d*$/g;
          if (!reg.test(val)) {
            let date = new Date();
            self.month = date.getMonth() + 1;
          }
          if (val < 1) {
            self.month = 1;
          }
          if (val > 12) {
            self.month = 12;
          }
          self.dayScreen();
        },
        hour: function (val) {
          let self=this;
          let reg = /^\d*$/g;
          if (!reg.test(val)) {
            let date = new Date();
            self.hour = date.getHours();
            return;
          }
          if (val < 0) {
            self.hour = 0;
          }
          if (val > 23) {
            self.hour = 23;
          }
        },
        minute: function (val) {
          let self=this;
          let reg = /^\d*$/g;
          if (!reg.test(val)) {
            let date = new Date();
            self.minute = date.getMinutes();
            return;
          }
          if (val < 0) {
            self.minute = 0;
          }
          if (val > 59) {
            self.minute = 59;
          }
        },
        second: function (val) {
          let self=this;
          let reg = /^\d*$/g;
          val=Number(val);
          if (!reg.test(val)) {
            let date = new Date();
            self.second = date.getSeconds();
            return;
          }
          if (val < 0) {
            self.second = 0;
          }
          if (val > 59) {
            self.second = 59;
          }
        },
        'timePicker.maxDate':function( val ){
          let self=this;
          if(val && !isNaN(new Date(val) ) ){
            self.maxDate=val;
          }
        },
        'timePicker.minDate':function( val ){
          let self=this;
          if(val && !isNaN(new Date(val) ) ){
            self.minDate=val;
          }
        },
        'timePicker.value':function( val ){
          let self=this;
          if(val===''&& self.clicked){
            self.timePicker.value=self.getResult();
            self.clicked=false;
          }else{
            self.timePicker.value=val;
          }
        },
        date:function( val ){
          let self=this;
          self.clicked=false;
          if(self.isDisabled(new Date(val).getDate(),'self')){
            self.timePicker.value='';
            return;
          }
          self.timePicker.value=val;
        }
      },
      created(){
        const self = this;
        self.initFn();
      },
      methods: {
        initFn(){
          const self = this;
          self.clicked=false;
          if(self.timePicker.value && !isNaN(new Date(self.timePicker.value) ) ){
            let date = new Date(self.timePicker.value);
            self.year = date.getFullYear();
            if (self.isLeapYear(self.year)) {
              self.monthDay[1] = 29;
            } else {
              self.monthDay[1] = 28;
            }
            self.month = date.getMonth() + 1;
            self.day = date.getDate();
            if(self.format && self.format.toLowerCase().indexOf('h')>-1){
              self.hasTime=true;
              self.hour = date.getHours();
              self.minute = date.getMinutes();
              self.second = date.getSeconds();
            }else{
              self.hasTime=false;
            }
          }
          if(self.timePicker.maxDate && !isNaN(new Date(self.timePicker.maxDate) ) ){
            self.maxDate=self.timePicker.maxDate;
          }
          if(self.timePicker.minDate && !isNaN(new Date(self.timePicker.minDate) ) ){
            self.minDate=self.timePicker.minDate;
          }
          if(self.timePicker.format ){
            self.format=self.timePicker.format;
          }
          if(self.timePicker.hasTime!=null){
            self.hasTime=self.timePicker.hasTime;
          }
          if(self.timePicker.hasBtn!=null){
            self.hasBtn=self.timePicker.hasBtn;
          }
          if(self.timePicker.hasClean!=null){
            self.hasClean=self.timePicker.hasClean;
          }
          if(self.timePicker.hasToday!=null){
            self.hasToday=self.timePicker.hasToday;
          }
        },
        // 突出显示当前日期
        isActive (index) {
          if (index == this.day) {
            return true;
          }
          return false;
        },
        isDisabled(day,flag){
          let self=this;
          let year=self.year,month=self.month;
          if(flag=='pre'){
            if(month==1){
              year--;
              month=12;
            }else{
              month--;
            }
          }else if(flag=='next'){
            if(month==12){
              year++;
              month=1;
            }else{
              month++;
            }
          }
          let selfTime=new Date(year + '-' + month + '-' + day).getTime();
          let maxTime=new Date(self.maxDate).getTime();
          let minTime=new Date(self.minDate).getTime();
          if(maxTime || minTime){
            if(minTime-selfTime>8000*3600 || selfTime-maxTime>8000*3600){
              return true;
            }
          }
          return false;
        },
        // 显示日期盒子并初始化
        trueDateBox () {
          let self=this;
          let date = new Date();
          self.isClean=false;
          self.clicked=false;
          if (self.date === '') {
            self.year = date.getFullYear();
            if (self.isLeapYear(self.year)) {
              self.monthDay[1] = 29;
            } else {
              self.monthDay[1] = 28;
            }
            self.month = date.getMonth() + 1;
            self.day = date.getDate();
            if(self.format && self.format.toLowerCase().indexOf('h')>-1){
              self.hasTime=true;
              self.hour = date.getHours();
              self.minute = date.getMinutes();
              self.second = date.getSeconds();
            }else{
              self.hasTime=false;
            }
          }
          self.dayScreen();
          self.dateBoxFlag = true;
        },
        // 增减年份
        addYear () {
          this.year++;
          if (this.isLeapYear(this.year)) {
            this.monthDay[1] = 29;
          } else {
            this.monthDay[1] = 28;
          }
        },
        reduceYear () {
          this.year--;
          if (this.isLeapYear(this.year)) {
            this.monthDay[1] = 29;
          } else {
            this.monthDay[1] = 28;
          }
        },
        // 增减月份
        addMonth () {
          this.month++;
          if (this.month > 12) {
            this.month = 1;
            this.year++;
          }
        },
        reduceMonth () {
          this.month--;
          if (this.month < 1) {
            this.month = 12;
            this.year--;
          }
        },
        // 获取input里的文字
        selected (e) {
          e.target.select();
        },
        // 选择日期
        selectDay (e) {
          let self=this;
          let targetClass = e.target.className;
          if (targetClass.indexOf('disabled')>-1 ) {
            console.log('disabled')
            return;
          }else if (targetClass.indexOf('previousMonth')>-1 ) {
            if (self.month == 1) {
              self.month = 12;
              self.year--;
            } else {
              self.month = self.month - 1;
            }
            self.day = parseInt(e.target.innerText);
          } else if (targetClass.indexOf('nextMonth')>-1) {
            if (self.month == 12) {
              self.month = 1;
              self.year++;
            } else {
              self.month = self.month + 1;
            }
            self.day = parseInt(e.target.innerText);
          } else {
            self.day = parseInt(e.target.innerText);
          }
          self.clicked=true;
          if(self.isSameValue()){
            self.timePicker.value=self.getResult();
            self.clicked=false;
          }
          self.dateBoxFlag = false;
        },
        // 日期显示
        dayScreen () {
          // 上一个月
          let self=this;
          let firstDate = new Date(self.year, self.month - 1, 1);
          let firstWeek = firstDate.getDay();
          let preMonthDay = null;
          if (self.month == 1) {
            preMonthDay = self.monthDay[11];
          } else {
            preMonthDay = self.monthDay[self.month - 2];
          }
          for (let i = 0; i < preMonthDay; i++) {
            self.previousMonth[i] = i + 1;
          }
          if (firstWeek == 0) {
            self.previousMonth = self.previousMonth.slice(-7);
          } else {
            self.previousMonth = self.previousMonth.slice(-firstWeek);
          }
          // 下一个月
          let endDate = new Date(self.year, self.month - 1, self.monthDay[self.month - 1]);
          let endWeek = endDate.getDay();
          let nextMonthDay = null;
          if (self.month == 12) {
            nextMonthDay = self.monthDay[0];
          } else {
            nextMonthDay = self.monthDay[self.month];
          }
          for (let i = 0; i < nextMonthDay; i++) {
            self.nextMonth[i] = i + 1;
          }
          if (endWeek == 6) {
            self.nextMonth = self.nextMonth.slice(0, 7);
          } else {
            self.nextMonth = self.nextMonth.slice(0, 6 - endWeek);
          }
        },
        // 判断是否是闰年
        isLeapYear (year) {
          return (year % 100 == 0 ? (year % 400 == 0 ? true : false) : (year % 4 == 0 ? true : false));
        },
        cancel (){
          this.dateBoxFlag = false;
        },
        cleanFn(){
          let self=this;
          self.isClean=true;
          self.cancel();
        },
        toToday(){
          let self=this;
          let date = new Date();
          self.year = date.getFullYear();
          if (self.isLeapYear(self.year)) {
            self.monthDay[1] = 29;
          } else {
            self.monthDay[1] = 28;
          }
          self.month = date.getMonth() + 1;
          self.day = date.getDate();
          if(self.format && self.format.toLowerCase().indexOf('h')>-1){
            self.hasTime=true;
            self.hour = date.getHours();
            self.minute = date.getMinutes();
            self.second = date.getSeconds();
          }else{
            self.hasTime=false;
          }
          self.dayScreen();
        },
        //获取结果对应format
        getResult(){
          let self=this;
          let year=self.year,month=self.month,day=self.day,
            hour=self.hour,minute=self.minute,second=self.second,result='';
          switch ( self.format ) {
            case 'yyyy-MM-dd hh:mm:ss' : {
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              hour = hour < 10 ? '0' + hour : '' + hour;
              minute = minute < 10 ? '0' + minute : '' + minute;
              second = second < 10 ? '0' + second : '' + second;
              result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
              break;
            }
            case 'yyyy-MM-dd hh:mm' : {
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              hour = hour < 10 ? '0' + hour : '' + hour;
              minute = minute < 10 ? '0' + minute : '' + minute;
              result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
              break;
            }
            case 'yyyy-MM-dd' : {
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              result = year + '-' + month + '-' + day;
              break;
            }
            default:{
              month = month < 10 ? '0' + month : '' + month;
              day = day < 10 ? '0' + day : '' + day;
              hour = hour < 10 ? '0' + hour : '' + hour;
              minute = minute < 10 ? '0' + minute : '' + minute;
              second = second < 10 ? '0' + second : '' + second;
              result = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
              break;
            }
          }
          return result;
        },
        isSameValue(){
          let self=this;
          let oldDate=new Date(self.date);
          let oldYear=oldDate.getFullYear(),
            oldMonth=oldDate.getMonth()+1,
            oldDay=oldDate.getDate();
          if( oldYear==self.year && oldMonth==self.month && oldDay==self.day ){
            return true;
          }
          return false;
        }
      }
    }
</script>
<style scoped>
.date-pickers {
  width: 280px;
  padding: 5px;
  position: relative; }
.date-pickers > input {
  width: 50%;
  height: 20px;
  padding: 5px; }
.date-pickers .fade-enter-active, .date-pickers .fade-leave-active {
  transition: all 0.5s; }
.date-pickers .fade-enter, .date-pickers .fade-leave-active {
  opacity: 0;
  transform: translateY(-10px); }
.date-pickers > div {
  width: 100%;
  border: 1px solid #EAEAEA;
  border-radius: 5px;
  box-shadow: 2px 2px 2px #eee;
  background: white;
  position: absolute;
  top: 40px;
  left: 0px;
  z-index: 99; }
.date-pickers > div div.day-select {
  display: flex;
  padding: 5px 0;
  height: 30px;
  line-height: 30px;
  color: #888888;
  border-bottom: 1px solid #ccc; }
.date-pickers > div div.day-select input,
.date-pickers > div div.day-select button {
  border: none;
  background: white;
  text-align: center;
  color: #888888;
  cursor: pointer; }
.date-pickers > div div.day-select > div:nth-child(1),
.date-pickers > div div.day-select > div:nth-child(3) {
  width: 20%; }
.date-pickers > div div.day-select > div:nth-child(2) {
  width: 60%;
  display: flex;
  justify-content: center; }
.date-pickers > div div.day-select > div:nth-child(2) input:hover {
  background: #eee; }
.date-pickers > div div.day-select > div:nth-child(2) input:nth-child(1) {
  width: 50px; }
.date-pickers > div div.day-select > div:nth-child(2) input:nth-child(2) {
  width: 30px; }
.date-pickers > div div.day-screen > div {
  width: 280px;
  padding: 0 5px;
  display: flex;
  font-size: 14px;
  justify-content: flex-start;
  flex-wrap: wrap; }
.date-pickers > div div.day-screen > div span {
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-bottom: 1px solid #ccc; }
.date-pickers > div div.day-screen > div:nth-child(1) {
  font-weight: bold;
  background: #BDEBEE; }
.date-pickers > div div.day-screen > div:nth-child(2) span {
  cursor: pointer;
  color: black; }
.date-pickers > div div.day-screen > div:nth-child(2) span:hover, .date-pickers > div div.day-screen > div:nth-child(2) span.active {
  background: #21A5EF;
  color: white; }
.date-pickers > div div.day-screen > div:nth-child(2) span.previousMonth,
.date-pickers > div div.day-screen > div:nth-child(2) span.nextMonth {
  color: #888888; }
.date-pickers > div div.time-screen{
  text-align: center;
  margin-top: 5px;
  margin-bottom: 5px;
}
.date-pickers > div div.time-screen .time-input{width: 35px;}
.date-pickers > div div.btn-screen{text-align: right;margin-right: 10px;margin-bottom: 5px;margin-top: 5px;}
.year-btn{font-size: 16px;}
.disabled{
  background-color: #ccc !important;
  color: #888 !important;
}
</style>
