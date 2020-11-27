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
      if (file)
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
                const newObject = mergeOrderId(jsonObj);
                const csv = json2csvParser.parse(newObject['output']);

                console.log(newObject['output_forreview'].length)
                if(newObject['output_forreview'].length) {
                  const csv2 = json2csvParser.parse(newObject['output_forreview']);
                  setTimeout(()=>{downloadTxtFile(csv2,"FOR_REVIEW")},2000);
                }
                


                //console.log(mergeOrderId(jsonObj)['output']);
                //console.log(mergeOrderId(jsonObj)['output_forreview']);






                setTimeout(()=>{downloadTxtFile(csv,"ALL_VENDORS")}, 0);
                
              })


            //console.log(Object.keys(csvJSON(event.target.result)).length)


          }
        } else {
          preview.innerHTML = "<span class='error'>It doesn't seem to be a text file!</span>";
        }

      if (file)
        reader.readAsText(file);


    } else {
      alert("Your browser is too old to support HTML5 File API");
    }
    console.log(removeQuotes('"sdf'));
  }
  const downloadTxtFile = (csv, filename) => {
    const element = document.createElement("a");
    const file = new Blob([csv], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}-${exportedDay}.csv`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  }

  const mergeOrderId = (obj) => {

    var output = [];
    var output_forreview = [];

    obj.forEach(function (item) {

      //console.log(output_forreview.length + item['Name'])

      var existing = output.filter(function (v, i) {
        return v['SHIPPER ORDER NO'] == item['Name'];
      });
      if (existing.length) {
        existing.forEach((existingItem) => {
          var existingIndex = output.indexOf(existingItem);
          output[existingIndex]['ITEMS'] = output[existingIndex]['ITEMS'] + '\n' + `(${item['Lineitem quantity']})  ${item['Lineitem name']}`;

        })
      } else {
        // New Record Ninja Van
        if ((item['Shipping Method'] == 'NINJA VAN - STANDARD' || item['Shipping Method'] == 'NINJAVAN - STANDARD') && item['Financial Status'] == 'paid') {
          exportedDay = item['Created at'].substr(0, 10);
          if (item['Shipping Zip'].charAt(0) == "'")
            item['Shipping Zip'] = item['Shipping Zip'].substring(1);

          var pouchCount = calcalateNinjavanPouches(item['Shipping'], item['Shipping Zip']);

          //Pouch is 0, need to review
          if (pouchCount == 0) {
            
            var existing_review = output_forreview.filter(function (v, i) {
              return v['SHIPPER ORDER NO'] == item['Name'];
            });

            if (existing_review.length) {

              // existing_review.forEach((existingItem) => {
              //   var existingIndex = output_forreview.indexOf(existingItem);
              //   output_forreview[existingIndex]['ITEMS'] = output_forreview[existingIndex]['ITEMS'] + '\n' + item['Lineitem name'] + " x" + item['Lineitem quantity'];

              // })

            } else {
              
              if (item['Name'])
                output_forreview.push({
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
                  'PARCEL DESCRIPTION': `Manila International Online Book Fair \nOrder Number: ${item['Name']} \nVendor: ${item['Vendor']}\n`,
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
                  'ITEMS': 'PLEASE CHECK THE ITEMS FROM THE EXPORTED FILE',
                  'VENDOR': item['Vendor'],
                  'SHIPPING METHOD': item['Shipping Method']

                });

                

            }

          }

          //at least 1 pouch
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
              'ITEMS':  `(${item['Lineitem quantity']})  ${item['Lineitem name']} ${item['Lineitem quantity']}`,
              'VENDOR': item['Vendor'],
              'SHIPPING METHOD': item['Shipping Method']

            });
          }

        }


        //GOGO
        if ((item['Shipping Method'] == 'GOGO XPRESS' || item['Shipping Method'] == 'GOGO XPRESS BOX') && item['Financial Status'] == 'paid') {
          exportedDay = item['Created at'].substr(0, 10);
          if (item['Shipping Zip'].charAt(0) == "'")
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
            'PARCEL DESCRIPTION': `Manila International Online Book Fair \nOrder Number: ${item['Name']} \nVendor: ${item['Vendor']}\nPackage: 1 of 1`,
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
            'ITEMS': `(${item['Lineitem quantity']})  ${item['Lineitem name']}`,
            'VENDOR': item['Vendor'],
            'SHIPPING METHOD': item['Shipping Method']

          });





        }

        ///////
      }


      //console.log(item.Name);
    });

    return { output, output_forreview };

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
          <ul>
            <li>Only upload .csv file exported from Shopify.</li>
            <li>Convert the file to *.txt extension if you're on a windows machine.</li>
            <li>This app will automatically generate 2 files if there are invalid zip codes. The first file can be uploaded to Ninjavan and the other file must be reviewed for invalid zip codes.</li>
            <li>Only 1 file will be generated if all entries are valid.</li>
            <li>Please double check data before uploading to Ninja Van Dashboard.
        Use at your own risk! &#9888;</li>
          </ul>

          <span className="createdBy">Made with 💙 by Lisandro Molina</span>
        </div>
        <input type="file" onChange={showFile} />


      </div>

    </div>
  );
}

export default App;
