import timepicker from './vTimepicker.vue'

const vTimepicker = {
  install: function( Vue ){
    Vue.component( 'v-timepicker' , timepicker );
  }
};

export default vTimepicker;
