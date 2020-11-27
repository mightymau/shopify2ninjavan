import logo from './logo.svg';
import './App.css';
import CSVtoJSON from 'csvtojson';
import JSONtoCSV from 'json2csv';

function App() {
  var exportedDay;
  const showFile = () => {
    

    let csvresult = {};
    if (window.File && window.FileReader && window.FileList && window.Blob) {
      var preview = document.getElementById('show-text');
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader()

      var textFile = /text.*/;
      if(file)
      if (file.type.match(textFile)) {


        reader.onload = function (event) {
          //preview.innerHTML = JSONcsv(mergeOrderId(csvJSON(event.target.result)));
          //downloadTxtFile(JSONcsv(mergeOrderId(csvJSON(event.target.result))));
          //console.log(csvJSON(event.target.result))
          //console.log(mergeOrderId(csvJSON(event.target.result)))
          //console.log(CSVtoJSON(event.target.result))
          CSVtoJSON()
            .fromString(event.target.result)
            .then((jsonObj) => {
              //csvresult = jsonObj; 
              //console.log(jsonObj) // => [["1","2","3"], ["4","5","6"], ["7","8","9"]]
              //console.log(JSONtoCSV(mergeOrderId(jsonObj)))

              console.log(jsonObj);
              const { Parser } = require('json2csv');

              const fields = [

                'REQUESTED TRACKING NUMBER',
                'NAME',
                'ADDRESS 1',
                'PACKAGE TYPE',
                'ADDRESS 2',
                'SUBDIVISION',
                'CITY',
                'PROVINCE',
                'EMAIL',
                'CONTACT',
                'POSTCODE',
                'DELIVERY DATE',
                'SIZE',
                'WEIGHT',
                'DELIVERY TYPE',
                'SHIPPER ORDER NO',
                'INSTRUCTIONS',
                'WEEKEND DELIVERY',
                'PARCEL DESCRIPTION',
                'IS DANGEROUS GOOD',
                'CASH ON DELIVERY',
                'INSURED VALUE',
                'VOLUME',
                'LENGTH',
                'WIDTH',
                'HEIGHT',
                'SHIPPING METHOD',
                'SHIPPING',
                'SUBTOTAL',
                'TOTAL',
                'ITEMS',
                'VENDOR',
                'SHIPPING METHOD'

              ];

              const json2csvParser = new Parser({ fields });
              const csv = json2csvParser.parse(mergeOrderId(jsonObj));

              console.log(mergeOrderId(jsonObj));





              downloadTxtFile(csv);
            })


          //console.log(Object.keys(csvJSON(event.target.result)).length)


        }
      } else {
        preview.innerHTML = "<span class='error'>It doesn't seem to be a text file!</span>";
      }

      if(file)
      reader.readAsText(file);


    } else {
      alert("Your browser is too old to support HTML5 File API");
    }
    console.log(removeQuotes('"sdf'));
  }
  const downloadTxtFile = (csv) => {
    const element = document.createElement("a");
    const file = new Blob([csv], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Ninjavan-ALL_VENDORS-${exportedDay}.csv`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const mergeOrderId = (obj) => {

    var output = [];
    var outout_gogo = [];

    obj.forEach(function (item) {

      var existing = output.filter(function (v, i) {
        return v['SHIPPER ORDER NO'] == item['Name'];
      });



      if (existing.length) {

        existing.forEach((existingItem) => {
          var existingIndex = output.indexOf(existingItem);
          output[existingIndex]['ITEMS'] = output[existingIndex]['ITEMS'] + '\n' + item['Lineitem name'];

        })


        //push new  record



      } else {


        // New Record Ninja Van
        //console.log(`${item['Shipping Method']} ${item['Financial Status']}`)
        if (item['Shipping Method'] == 'NINJA VAN - STANDARD' && item['Financial Status'] == 'paid') {
          exportedDay = item['Created at'].substr(0,10);
          if(item['Shipping Zip'].charAt(0) == "'") 
            item['Shipping Zip'] = item['Shipping Zip'].substring(1);
          
          //console.log(`${item['Shipping Method']} ${item['Financial Status']}`)
          var pouchCount = calcalateNinjavanPouches(item['Shipping'], item['Shipping Zip']);
          console.log(item['Name'] + " " +item['Shipping Zip'] + " " +item['Shipping'] + " " + pouchCount);
          //var i = 1;
          for (var i = 1; i <= pouchCount; i++) {
            output.push({
              'REQUESTED TRACKING NUMBER': '',
              'NAME': item['Shipping Name'],
              'ADDRESS 1': removeQuotes(item['Shipping Address1']),
              'PACKAGE TYPE': '',
              'ADDRESS 2': item['Shipping Address2'],
              'SUBDIVISION': '',
              'CITY': item['Shipping City'],
              'PROVINCE': item['Shipping Province'],
              'EMAIL': item['Email'],
              'CONTACT': item['Shipping Phone'],
              'POSTCODE': item['Shipping Zip'],
              'DELIVERY DATE': '',
              'SIZE': '',
              'WEIGHT': '',
              'DELIVERY TYPE': '',
              'SHIPPER ORDER NO': item.Name,
              'INSTRUCTIONS': item.Notes,
              'WEEKEND DELIVERY': '',
              'PARCEL DESCRIPTION': `Manila International Online Book Fair \nOrder Number: ${item['Name']} \nVendor: ${item['Vendor']}\nPackage: ${i} of ${pouchCount}`,
              'IS DANGEROUS GOOD': '',
              'CASH ON DELIVERY': 0,
              'INSURED VALUE': item['Subtotal'],
              'VOLUME': '',
              'LENGTH': '',
              'WIDTH': '',
              'HEIGHT': '',
              'SHIPPING METHOD': item['Shipping Method'],
              'SHIPPING': item['Shipping'],
              'SUBTOTAL': item['Subtotal'],
              'TOTAL': item['Total'],
              'ITEMS' : item['Lineitem name'],
              'VENDOR': item['Vendor'],
              'SHIPPING METHOD': item['Shipping Method']
              
            });
          }




        }
        
        
        //GOGO
        if ((item['Shipping Method'] == 'GOGO XPRESS' || item['Shipping Method'] == 'GOGO XPRESS BOX') && item['Financial Status'] == 'paid') {
          exportedDay = item['Created at'].substr(0,10);
          if(item['Shipping Zip'].charAt(0) == "'") 
            item['Shipping Zip'] = item['Shipping Zip'].substring(1);
        
            output.push({
              'REQUESTED TRACKING NUMBER': '',
              'NAME': item['Shipping Name'],
              'ADDRESS 1': removeQuotes(item['Shipping Address1']),
              'PACKAGE TYPE': '',
              'ADDRESS 2': item['Shipping Address2'],
              'SUBDIVISION': '',
              'CITY': item['Shipping City'],
              'PROVINCE': item['Shipping Province'],
              'EMAIL': item['Email'],
              'CONTACT': item['Shipping Phone'],
              'POSTCODE': item['Shipping Zip'],
              'DELIVERY DATE': '',
              'SIZE': '',
              'WEIGHT': '',
              'DELIVERY TYPE': '',
              'SHIPPER ORDER NO': item.Name,
              'INSTRUCTIONS': item.Notes,
              'WEEKEND DELIVERY': '',
              'PARCEL DESCRIPTION': `Manila International Online Book Fair \nOrder Number: ${item['Name']} \nVendor: ${item['Vendor']}\nPackage: ${i} of ${pouchCount}`,
              'IS DANGEROUS GOOD': '',
              'CASH ON DELIVERY': 0,
              'INSURED VALUE': item['Subtotal'],
              'VOLUME': '',
              'LENGTH': '',
              'WIDTH': '',
              'HEIGHT': '',
              'SHIPPING METHOD': item['Shipping Method'],
              'SHIPPING': item['Shipping'],
              'SUBTOTAL': item['Subtotal'],
              'TOTAL': item['Total'],
              'ITEMS' : item['Lineitem name'],
              'VENDOR': item['Vendor'],
              'SHIPPING METHOD': item['Shipping Method']
              
            });
          




        }

        ///////
      }


      //console.log(item.Name);
    });

    return output;

  }


  const removeQuotes = (str) => {
    //console.log(str)
    if (str != null) {
      if (str.charAt(0) == '"')
        str = str.substring(1);
      if (str.charAt(str.length - 1) == '"')
        str = str.slice(0, -1);
    }


    return str;
  }

  const calcalateNinjavanPouches = (amount, zip) => {
    let pouchCount = 0;

    if (zip <= 1820) {
      //This is Metro Manila
      pouchCount = Math.floor(amount / 70);

    } else if (zip <= 5599) {
      //this is Luzon
      pouchCount = Math.floor(amount / 180);
    }

    return pouchCount;
  }


  return (
    <div className="App">
      <div className="container">
        <h1>Shopify to Ninja Van CSV Format</h1> 
      <div id="show-text">
        <p>Only upload .csv file* exported from Shopify.<br />
        Formatted .csv file will automatically start downloading.
        Please double check data before uploading to Ninja Van Dashboard.
        Use at your own risk! &#9888;
        <br />
        <br />
        <span className="note">*convert the file to *.txt extension if you're on a windows machine.</span>
        </p>
        
        <span className="createdBy">Made with 💙 by Lisandro Molina</span>
      </div>
      <input type="file" onChange={showFile} />

      
      </div>

    </div>
  );
}

export default App;
