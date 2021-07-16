const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const ejs = require('ejs');
app.use(bodyparser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://barsha_1234:barsha1234@cluster0.b0eeh.mongodb.net/Customer?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('connection successful');
    }).catch((err) => console.log('no connection'));

app.use(express.static('public'));
app.use('/image', express.static('image'));


const bankSchema = {

    name: String,
    email: String,
    money: Number
};

const Bank = mongoose.model("bank", bankSchema);

app.get('/', function (req, res) {

    res.sendFile(__dirname + '/index.html');


});
app.get('/customer', function (req, res) {

    Bank.find(function (err, result) {


        res.render('customer', { list: result });
    });
});
app.post('/customer', function (req, res) {
    var input1 = req.body.input1;
    var input2 = req.body.input2;
    var balance = Number(req.body.num);

    Bank.find({ name: input1, input2 }, function (err, result) {
        if (result == null) {
            res.sendFile(__dirname + '/error.html');
            console.log(result);



        }
        else {

            Bank.findOne({ name: input1 }, function (err, result1) {
                if (err) {
                    res.sendFile(__dirname + '/error.html');

                }
                else {
                    Bank.updateOne({ name: input1 }, { money: result1.money - balance }, function (err) {
                        if (err) {
                            console.log('error');
                        }

                    });
                }
            });
            Bank.findOne({ name: input2 }, function (err, result2) {
                if (err) {
                    res.sendFile(__dirname + '/error.html');

                }
                else {
                    Bank.updateOne({ name: input2 }, { money: result2.money + balance }, function (err) {
                        if (err) {
                            console.log('error');
                        }


                    });
                    res.redirect('/customer');
                }
            });
        }

    });




});





app.listen(process.env.PORT || 3000, function () {
    console.log("server started on port 3000");
});