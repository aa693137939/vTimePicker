<template>
    <div style="display: flex;">
      开始时间:<v-timepicker :timePicker="timePicker1"></v-timepicker>
      结束时间:<v-timepicker :timePicker="timePicker2"></v-timepicker>
    </div>
</template>
<script>
export default {
  name:'app',
  data(){
    return {
      timePicker1:{
        minDate:'',
        maxDate:'',
        value:'',
        format:'yyyy-MM-dd'
      },
      timePicker2:{
        maxDate:'',
        minDate:'',
        value:'',
        format:'yyyy-MM-dd'
      }
    }
  },
  watch:{
    'timePicker1.value':function( val ){
      let self=this;
      if(val && !isNaN( new Date(val) ) ){
        self.timePicker2.minDate=val;
        self.timePicker2.value='';
      }
    }
  },
  created(){
    const self=this;
    self.timePicker1.maxDate=self.timePicker2.value;
    self.timePicker2.minDate=self.timePicker1.value;
  }
}
</script>
