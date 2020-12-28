if($('#txt') && $('#txt').length) {
	$('#txt').remove();
}

$('body').append('<textarea id="txt" name="txt" rows="10" cols="40" style="position:fixed; right: 10px; top: 10px; border: 1px solid #000;"></textarea>');
$txt = $('#txt');

var data = [];

function cleannumber(val) {
	return +val.replace('$', '').replace(',', '');
}

var thisYear = (new Date()).getFullYear();
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};


$('.rh-expandable-item-a32bb9ad').each(function() {
	var thisData = {
		deposit: 0,
		withdrawal: 0,
		buyamount: 0,
		sellamount: 0,
		buyshares: 0,
		sellshares: 0,
		datestamp: '',
		stockticker: '',
		type: '',
		regulatoryfee: 0,
		goldfee: 0,
		goldinterest: 0,
		dividend: 0,
		status: ''
	};
	var btn = $('._2VPzNpwfga_8Mcn-DCUwug h3', this).text();
	if(btn.substr(0, 13) === 'Deposit from ') {
		thisData['type'] = 'Deposit';
	} else if(btn.substr(0, 14) === 'Withdrawal to ') {
		thisData['type'] = 'Withdrawal';
	} else if(btn.substr(0, 8) === 'Dividend') {
		thisData['type'] = 'Dividend';
		thisData['stockticker'] = btn.replace('Dividend from ', '');
	} else if(btn === 'Robinhood Gold' || btn === 'Robinhood Gold Interest') {
		thisData['type'] = btn;
	}

	if($('.css-zy0xqa', this).length) {
		thisData['datestamp'] = $('.css-zy0xqa', this).eq(1).text();
	}

	$('._2SYphfY1DF71e5bReqgDyP', this).each(function() {
		var key = $('.css-1qd1r5f', this).eq(0).text();
		var val = $('.css-1qd1r5f', this).eq(1).text();

		if(key === 'Amount') {
			if(thisData['type'].indexOf('Deposit') > -1) {
				thisData['deposit'] = cleannumber(val);
			} else if(thisData['type'].indexOf('Withdrawal') > -1) {
				thisData['withdrawal'] = cleannumber(val);
			}
		}
		if(key === 'Billing Cycle') {
			thisData['datestamp'] = val.substr(val.indexOf('-') + 2, 10) + ', ' + thisYear;
		}
		if(key === 'Type') {
			thisData['type'] = val;
		}
		if(key === 'Symbol') {
			thisData['stockticker'] = val;
		}
		if(key === 'Submitted') {
			thisData['datestamp'] = val + ' ' + thisData['datestamp'];
			thisYear = (new Date(val)).getFullYear();
		}
		if(key === 'Filled' || key === 'Initiated') {
			thisData['datestamp'] += val;
		}
		if(key === 'Regulatory Fee') {
			thisData['regulatoryfee'] = cleannumber(val);
		}
		if(key === 'Entered Quantity') {
			if(thisData['type'].indexOf('Buy') > -1) {
				thisData['buyshares'] = cleannumber(val);
			} else {
				thisData['sellshares'] = cleannumber(val);
			}
		}
		if(key === 'Total') {
			if(thisData['type'].indexOf('Buy') > -1) {
				thisData['buyamount'] = cleannumber(val);
			} else if(thisData['type'].indexOf('Sell') > -1) {
				thisData['sellamount'] = cleannumber(val);
			} else if(thisData['type'] === 'Robinhood Gold') {
				thisData['goldfee'] = cleannumber(val);
			}
		}
		if(key === 'Total Amount') {
			thisData['dividend'] = cleannumber(val);
		}
		if(key === 'Total Interest') {
			thisData['goldinterest'] = cleannumber(val);
		}
		if(key === 'Status') {
			thisData['status'] = val;
		}
	});	  
	// if(thisData['type'] === 'Dividend') debugger;
	thisData['datestamp'] = (new Date(thisData['datestamp'])).toMysqlFormat();
	if(thisData['status'] !== 'Canceled' && thisData['status'] !== 'Failed' && thisData['status'] !== 'Pending') {
		data.push(thisData);
	}
});

var txt = '';
data.forEach(function(ditem) {
	txt += '"' + ditem.datestamp + '",';
	txt += '"' + ditem.type + '",';
	txt += '"' + ditem.status + '",';
	txt += '"' + ditem.stockticker + '",';
	txt += ditem.buyamount + ',';
	txt += ditem.sellamount + ',';
	txt += ditem.deposit + ',';
	txt += ditem.withdrawal + ',';
	txt += ditem.dividend + ',';
	txt += ditem.goldfee + ',';
	txt += ditem.goldinterest + ',';
	txt += ditem.regulatoryfee + ',';
	txt += ditem.buyshares + ',';
	txt += ditem.sellshares;
	txt += "\n";
});
$('#txt').val(txt);
//console.table(data);
