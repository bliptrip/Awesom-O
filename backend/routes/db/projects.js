/**************************************************************************************
This file is part of Awesom-O, an image acquisition and analysis web application,
consisting of a frontend web interface and a backend database, camera, and motor access
management framework.

Copyright (C)  2019  Andrew F. Maule

Awesom-O is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Awesom-O is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this Awesom-O.  If not, see <https://www.gnu.org/licenses/>.
**************************************************************************************/

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
