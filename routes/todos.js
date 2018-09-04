var express = require('express');
var router = express.Router();

var mongojs = require('mongojs');
var db = mongojs('mongodb://hongrudu:111111@ds161901.mlab.com:61901/mytasklist_gru', ['todos']);


router.get('/todos', function(req, res, next){
    db.todos.find(function(err, todos){
        if(err){
            res.send(err);
        } else {
            res.json(todos);
        }
    })
});

// Get Single Task
router.get('/todos/:id', function(req, res, next) {
    db.todos.findOne({
        _id: mongojs.ObjectId(req.params.id)
    },function(err, todo) {
        if (err){
            res.send(err);
        }
        res.json(todo);
    });
});

// Save Task
router.post('/todo', function(req, res, next){
    var todo = req.body;
    if (!todo.text || (todo.isCompleted + '')) {
        res.status(400);
        res.json({
            "error": "Bad Data"
        });
    } else {
        db.todos.save(todo, function(err, result) {
            if (err){
                res.send(err);
            } else {
                res.json(result);
            }            
        });
    }
});

// Delete Task
router.delete('/todo/:id', function(req, res, next) {
    db.todos.remove({
        _id: mongojs.ObjectId(req.params.id)
    }, '', function(err, result) {
        if (err){
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

// Update Task
router.put('/todo/:id', function(req, res, next) {
    var todo = req.body;
    var updTodo = {};

    if(todo.isCompleted){
        updTodo.isCompleted = todo.isCompleted;
    }

    if(todo.text){
        updTodo.text = todo.text;
    }

    if(!updTodo){
        res.status(400);
        res.json({
            "error": "Bad data"
        });
    } else {
        db.todos.update({
            _id: mongojs.ObjectId(req.params.id)
        }, updTodo, {}, function(err, result) {
            if (err){
                res.send(err);
            } else {
                res.json(result);
            }   
        });
    }    
});

module.exports = router;