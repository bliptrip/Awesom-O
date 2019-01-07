const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');

//Post saves a new project and returns the DB ID for it
router.post('/', auth.required, (req, res, next)  => {
    Project = new Projects(req.body.project);

    return Project.save()
            .then((err) => {
                if( err ) {
                    res.sendStatus(400);
                } else {
                    res.json( { project: { id: Project.id } } );
                }
            });
});

//Put saves over an existing project
router.put('/:id', auth.required, (req, res, next)  => {
    return Projects.findById(req.params.id)
    .then((project) => {
        if(!project) {
            return res.sendStatus(400);
        }

        project = req.body.project; 
    
        return res.sendStatus(200);
    });
});

//Retrieve information on specific project
router.get('/:id', auth.required, (req, res, next) => {
    return Projects.findById(req.params.id)
    .then((project) => {
        if(!project) {
            return res.sendStatus(400);
        }
        
        return res.json(project);
    });
});

//Retrieve a summary of all projects in the DB
router.get('/list', auth.required, (req, res, next) => {
    return Projects.find({}, function(err, projects) {
        res.send(projects.reduce(function(projectMap, project) {
            projectMap[project.id] = project.description;
            return res.json(projectMap);
        }, {}))});
});

module.exports = router;
