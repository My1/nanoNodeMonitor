var template;
var timeouter;

init.push(function(){
  Handlebars.registerHelper('formatNumber', function (number, digits) {
    if(typeof number === 'undefined'){
      return 0;
    }

    if (Number.isInteger(digits)) {
      return number.toLocaleString('en-US', {minimumFractionDigits: digits, maximumFractionDigits: digits});
    }
    return number.toLocaleString('en-US');
  });

  Handlebars.registerHelper('formatNano', function (number) {
    if(typeof number === 'undefined'){
      return 0;
    }

    return number.toLocaleString('en-US', {minimumFractionDigits: GLOBAL_DIGITS, maximumFractionDigits: GLOBAL_DIGITS});
  });

  Handlebars.registerHelper('formatSeconds', function (number) {
    if(typeof number === 'undefined'){
      return 0;
    }

    var hours   = Math.floor(number / 3600);
    var minutes = Math.floor((number - (hours * 3600)) / 60);
    var seconds = number - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+'h '+minutes+'m '+seconds+'s';
  });

  Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

  axios.get('templates/index.hbs')
  .then(function (response) {
    template=Handlebars.compile(response.data);

    updateStats();
  });
});

function updateStats(){
  clearTimeout(timeouter);
  syncbutton=document.getElementById("syncbutton");
  if(syncbutton!=null) {
    syncbutton.classList.add('fa-spin');
  }
  axios.get('api.php')
  .then(function (response) {
    console.log(response.data);
    response.data.notcem = response.data.currentBlock - response.data.cementedBlocks;
    response.data.totalblocks = response.data.currentBlock + response.data.uncheckedBlocks;
    response.data.accs = parseInt(response.data.telemetry.account_count);
    document.getElementById("content").innerHTML = template(response.data);
    new ClipboardJS('#copyAccount');
  })
  .catch(function (error) {
    console.log('FAIL', error);
    if(error.response){
      document.getElementById("content").innerHTML = error.response.data;
    }
  })
  .finally(function () {
    if(GLOBAL_REFRESH>0) {
      timeouter=setTimeout(updateStats, GLOBAL_REFRESH * 1000);
    }
  });
  if(syncbutton!=null) {
    //syncbutton.classList.remove('fa-spin');
    setTimeout(function(){syncbutton.classList.remove('fa-spin');}, 1000);
  }
}
