let ControllerError = require('../errors/ControllerError');
let Producer = require('../models/Producer');
let Product = require('../models/Product');
let multer = require('multer');
let path = require('path');
let fs = require('fs');
let storageEngine = multer.diskStorage({
    destination: path.join(__dirname, '../public/ProducerPhotos'),
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

let upload = multer({
    storage: storageEngine,
    limits: {fileSize: 200000000}
}).single('photo');

let controller = {};

controller.getAll = async (req, res, next) => {
    try {
        res.status(200).json(await Producer.find({}));
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.getByName = async (req, res, next) => {
    try{
        let producer = await Producer.findOne({title: req.params.name});
        if(producer!= null) {
            res.status(200).json(producer);
        }else{
            let noExist = new Producer({title: 'err'});
            res.status(200).json(noExist);
        }
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.getProducerByAuthor = async(req, res, next) => {
    try{
        let dateFrom = new Date(req.params.dateFrom);
        let dateTo = new Date(req.params.dateTo);
        let producers = await Producer.find({userIdAuthor: req.params.id, date: {$gte: dateFrom, $lte: dateTo}});
        console.log(producers);
        res.status(200).json(producers);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.getProducerByAuthor1 = async(req, res, next) => {
    try {
        let producers = await Producer.find({userIdAuthor: req.params.id});
        res.status(200).json(producers);
    } catch (e) {
        next(new ControllerError(e.message, 400));
    }
}
controller.create = async (req, res, next) => {
    try{
        let producer = await Producer.create(req.body);
        console.log(producer);
        res.status(201).json(producer);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.uploadPhoto = async (req, res, next) => {
    let producerToUpload = await Producer.findOne({_id: req.params.id});
    try{
        upload(req, res, async(err) => {
            if(err) console.log(err);
            producerToUpload.photo = req.file.filename;
            producerToUpload.save();
            res.status(200).json(producerToUpload);
        });
        
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
}
controller.update =async (req, res, next) => {
    try{
        let producerWithPhoto = await Producer.findOne({_id: req.params.id});
        let photo = producerWithPhoto.photo;
        fs.unlink('./public/ProducerPhotos/' + photo, (err) => err);
        let producer = await Producer.findOneAndUpdate({_id: req.params.id}, req.body, {new: true});
        res.status(200).json(producer);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.updatePhoto = async (req, res, next) => {
    let producerToUpdate = await Producer.findOne({_id: req.params.id});
    try{
        upload(req, res, (err) => {
            if(err) console.log(err);
            producerToUpdate.photo = req.file.filename;
            producerToUpdate.save();
            res.status(200).json(producerToUpdate);
        })
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
}
controller.delete = async (req, res, next) => {
    try{
        let producerWithPhoto = await Producer.findOne({_id: req.params.id});
        fs.unlink('./public/ProducerPhotos/' + producerWithPhoto.photo, (err) => (err));
        let producer = await Producer.findOneAndRemove({_id: req.params.id});
        res.status(200).json(producer);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.deleteAll = async (req, res, next) => {
    try{
        let producersWithPhotos = await Producer.find({});
        let producers = await Producer.deleteMany({}, (err) => {});
        for(let producer of producersWithPhotos) {
            fs.unlink('./public/ProducerPhotos/' + producer.photo, (err) => (err));
        }
        res.status(200).json(producers);
        console.log(producers);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
};
controller.viewAllProductsByProducer = async (req, res, next) => {
    try{
        let id = req.params.id;
        let producerToFind = await Producer.findOne({_id: id});
        let a = await Product.find({'producer': producerToFind.title});
        res.status(200).json(a);
    }catch (e) {
        next(new ControllerError(e.message, 400));
    }
}

module.exports = controller;