const express = require('express');
var path = require('path')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(express.static( __dirname + '/public/dist' ));
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/plants');
app.use(bodyParser.json());

// db stuff
const PlantSchema = new mongoose.Schema({
    name: {type: String},
},{timestamps: true});

const Plant = mongoose.model('Plant', PlantSchema);

// handle the things!
app.get('/plants', function(request, response){
    Plant.find({}, function(err, data){
        if(err){
            console.log('we got errors:');
            response.json(err);
        } else {
            response.json(data);
        }
    })
});

app.get('/plants/:id', function(request, response){
    var id = new mongoose.Types.ObjectId(request.params.id);
    Plant.findById(id, function(err, data){
        if(err){
            console.log(err);
        }else{
            console.log(data);
            response.json(data);
        }
    })
});

app.post('/plants', function(request, response){
    let newPlant = new Plant(request.body);
    newPlant.save(function(err){
        if(err){
            console.log(err);
            response.json(err)
            // response.json(err)
        }else{
            response.json({status: 'everything went okay!'});
        }
    });
});

app.put('/plants/:id', function(request, response){
    Plant.update({_id: mongoose.Types.ObjectId(request.params.id)},request.body, {runValidators:true}, function(err, data){
        if(err){
            console.log(err);
            response.json(err)
        }else{
            console.log('updated');
            response.json({status: 'gucci'});
        }
    })
});

app.delete('/plants/:id', function(request, response){
    var id = mongoose.Types.ObjectId(request.params.id);
    Plant.remove({_id: id}, function(err){
        if(err){
            console.log(err);
        }
    });
    response.json({status: 'gucci'});
})

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/index.html"))
});


app.listen(8000, function(){
    console.log('Listening to 8000 YO!');
});