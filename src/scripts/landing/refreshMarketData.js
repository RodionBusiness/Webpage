$(function () {
  var url = process.env.MARKET_DATA_URL;

  var buildTable = function (data, productSettings) {
    var table = $('#' + productSettings.type + ' .tbody');
    var precision = productSettings.precision;
    var tableRow = '';

    for (var i = 0; i < data.length; i++) {
      var product = data[i].product ? data[i].product : '—';
      var last = formatCurrency(data[i].last, precision);
      var offer = formatCurrency(data[i].offer, precision);
      var bid = formatCurrency(data[i].bid, precision);
      var volume = data[i].volume ? parseFloat((data[i].volume).toFixed(precision)) : '—';

      table.html('');

      tableRow += [
        '<div class="tr">',
        '<div class="td futers">' + product + '</div>',
        '<div class="td symbol">' + bid + '</div>',
        '<div class="td month">' + offer + '</div>',
        '<div class="td last">' + last + '</div>',
        '<div class="td change">' + volume + '</div>',
        '</div>'
      ].join('\n');
    }

    table.append(tableRow);
  };

  var formatCurrency = function (value, precision) {
    if (isNaN(value)) {
      return '—';
    }

    var floatVal = parseFloat(value);

    return floatVal.toLocaleString('fr-FR', { minimumFractionDigits: precision, maximumFractionDigits: precision });
  };

  var updateData = function (data) {
    var products = [{
      type: 'SpotXBT', precision: 2
    }, {
      type: 'SpotFX', precision: 4
    }, {
      type: 'PrivateMarket', precision: 6
    }];

    for (var i = 0; i < products.length; i++) {
      buildTable(data[products[i].type], products[i]);
    }
  };

  var getData = function () {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.response);
        updateData(data);
      }
    };
    xmlhttp.open('GET', url, true);
    xmlhttp.send();
  };

  /**/

  bs.refreshMarketData = getData;

  bs.refreshMarketData.init = function () {
    setTimeout(bs.refreshMarketData, 30000);
    getData();
  };
});
