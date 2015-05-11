function showTimeTooltip(pay, payType){
  var ebay = false;
  if ($( "#priceblock_saleprice" ).length){
    var itemprice = $('#priceblock_saleprice').text();
    var tooltipId = '#priceblock_saleprice_lbl';
  }
  else if ($( "#prcIsum" ).length){
    var itemprice = $('#prcIsum').text();
    var tooltipId = '#prcIsum-lbl';
    ebay = true;
  }
  else if ($( "#priceblock_ourprice" ).length){ 
    var itemprice = $('#priceblock_ourprice').text();
    var tooltipId = '#priceblock_ourprice_lbl';
  } else {
    console.log('Can not find item price');
    return;
  }

  if (ebay) {
    itemprice = itemprice.split(' ').pop()
  }
  itemprice = itemprice.replace('$','');
  itemprice = itemprice.replace(',','');
  itemprice = parseInt(itemprice);

  if (payType === 'per year'){
    var secondsWorkingPerYear = 7513200;
    var payPerSecond = pay / secondsWorkingPerYear;
    var hourlyPay = pay / 2080 ;
    var annualSalary = pay;
  }
  else if(payType === 'per hour'){
    var payPerSecond = pay / 3600;
    var hourlyPay = pay;
    var annualSalary = pay * 2080;
  }

  var secondsWorking = itemprice / payPerSecond;
  var info = Math.floor(secondsWorking).toString() + ' seconds working';

  if (secondsWorking >= 60){
    var minutesWorking = secondsWorking / 60;
    secondsWorking = (minutesWorking % 1) * 60;
    info = Math.floor(minutesWorking).toString() + ' mintues ' + Math.floor(secondsWorking).toString() + ' seconds working';
    if (minutesWorking >= 60){
      var hoursWorking = minutesWorking / 60;
      minutesWorking = (hoursWorking % 1) * 60;
      secondsWorking = (minutesWorking % 1) * 60;
      info = Math.floor(hoursWorking).toString() + ' hours ' +  Math.floor(minutesWorking).toString() + ' mintues ' + Math.floor(secondsWorking).toString() + ' seconds working';
      if (hoursWorking >= 24){
        var daysWorking = hoursWorking / 24;
        hoursWorking = (daysWorking % 1) * 24;
        minutesWorking = (hoursWorking % 1) * 60;
        secondsWorking = (minutesWorking % 1) * 60;
        info = Math.floor(daysWorking).toString() + ' days ' +  Math.floor(hoursWorking).toString() + ' hours ' +  Math.floor(minutesWorking).toString() + ' mintues ' + Math.floor(secondsWorking).toString() + ' seconds working';
        if (daysWorking >= 7){
          var weeksWorking = daysWorking / 7;
          daysWorking = (weeksWorking % 1) * 7;
          hoursWorking = (daysWorking % 1) * 24;
          minutesWorking = (hoursWorking % 1) * 60;
          secondsWorking = (minutesWorking % 1) * 60;
          info = Math.floor(weeksWorking).toString() + ' weeks ' +  Math.floor(daysWorking).toString() + ' days ' +  Math.floor(hoursWorking).toString() + ' hours ' +  Math.floor(minutesWorking).toString() + ' mintues ' + Math.floor(secondsWorking).toString() + ' seconds working';
          if (weeksWorking >= 4){
            var monthsWorking = weeksWorking / 4;
            weeksWorking = (monthsWorking % 1) * 4;
            daysWorking = (weeksWorking % 1) * 7;
            hoursWorking = (daysWorking % 1) * 24;
            minutesWorking = (hoursWorking % 1) * 60;
            secondsWorking = (minutesWorking % 1) * 60;
            info = Math.floor(monthsWorking).toString() + ' months ' +  Math.floor(weeksWorking).toString() + ' weeks ' +  Math.floor(daysWorking).toString() + ' days ' +  Math.floor(hoursWorking).toString() + ' hours ' +  Math.floor(minutesWorking).toString() + ' mintues ' + Math.floor(secondsWorking).toString() + ' seconds working';
            if (monthsWorking >= 12){
              var yearsWorking = monthsWorking / 12;
              monthsWorking = (yearsWorking % 1) * 12;
              weeksWorking = (monthsWorking % 1) * 4;
              daysWorking = (weeksWorking % 1) * 7;
              hoursWorking = (daysWorking % 1) * 24;
              minutesWorking = (hoursWorking % 1) * 60;
              secondsWorking = (minutesWorking % 1) * 60;
              info = Math.floor(yearsWorking).toString() + ' years ' +  Math.floor(monthsWorking).toString() + ' months ' +  Math.floor(weeksWorking).toString() + ' weeks ' +  Math.floor(daysWorking).toString() + ' days ' +  Math.floor(hoursWorking).toString() + ' hours ' +  Math.floor(minutesWorking).toString() + ' mintues ' + Math.floor(secondsWorking).toString() + ' seconds working';
            }
          }
        }
      }
    }
  }

  if (ebay)  {
    var position = {'my': 'top center','at':'bottom right'}
    var css = 'qtip-ebay';
  } else {
    var position = {'my': 'right center','at':'left center'}
    var css = 'qtip-amazon';
  }

  var title = 'Annual Salary: $'+ annualSalary.toFixed(2) + '</br>' + 'Hourly pay: $' + hourlyPay.toFixed(2)
  $(tooltipId).qtip({
    content: {
      title: title,
      text: info
    },
    style: {
      classes: css + ' qtip-rounded'
    },
    position: {
      my: position['my'],  // Position my top left...
      at: position['at'], // at the bottom right of...
      target: $(tooltipId) // my target
    },
  show: { ready: true },
  hide: false
  });
  return true;
}

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    if ((msg.from === 'popup') && (msg.subject === 'payInfo')) {
      showTimeTooltip(msg.pay, msg.payType);
    }
});

chrome.storage.sync.get(null,function(res){
  if (res.pay && res.payType){
      showTimeTooltip(res.pay, res.payType);
  }
});
