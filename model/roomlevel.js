const mongoose= require('mongoose');

const roomlevelSchema = new mongoose.Schema({
    number:{
        type:String,
        required:true,
    },
    value:{
        type:String,
    },
});


module.exports = mongoose.model('roomlevel', roomlevelSchema);